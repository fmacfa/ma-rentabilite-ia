"""Valeurs indépendantes pour les conventions financières et les changements fiscaux."""
import json
from pathlib import Path
import subprocess
import sys
import unittest

from moteur.finance import bilan_flux, cession, echeancier
from moteur.fiscalite import Suivi, ir_bareme
from moteur.api import loyer_cible
from renta import calcul, charger, comparer_fiscalite, lire

ROOT = Path(__file__).resolve().parents[1]


def exemple(nom):
    return charger(ROOT/"exemples"/(nom+".json"))


class SimulationTests(unittest.TestCase):
    def test_loyer_cible_de_lina_meme_sans_loyer_observe(self):
        p = exemple("lina")
        p["projection"]["effort_max_mensuel"] = 400
        cible = calcul(p)["loyer_cible"]
        self.assertEqual(cible["tarif"], 1034.88)
        self.assertGreater(cible["cash_flow_mensuel"], -400)
        self.assertLess(cible["cash_flow_au_centime_precedent"], -400)
        p["location"]["loyer_mensuel_hc"] = None
        p["revente"]["prix"] = None
        d = calcul(p)
        self.assertEqual(d["statut"], "a_completer")
        self.assertEqual(d["loyer_cible"], cible)
        self.assertIsNone(p["location"]["loyer_mensuel_hc"])
        p["location"]["delai_mois"] = 12
        self.assertEqual(loyer_cible(p)["statut"], "inatteignable")
        p["projection"]["effort_max_mensuel"] = 2000
        self.assertEqual(loyer_cible(p)["tarif"], 0)

    def test_loyer_cible_recalcule_le_micro_et_respecte_son_seuil(self):
        p = exemple("location-nue")
        p.update(credit={"capital": 0}, charges_annuelles={"charges": 9000})
        p["location"].update(gestion_pct=0, vacance_pct=0)
        p["projection"]["effort_max_mensuel"] = 0
        p["fiscalite"]["regime"] = "micro_foncier"
        cible = loyer_cible(p)
        self.assertEqual(cible["tarif"], 1120.08)
        self.assertAlmostEqual(cible["impot"], 1120.08 * 12 * .7 * .472)
        p["charges_annuelles"]["charges"] = 11000
        self.assertIn("Micro-foncier hors seuil", loyer_cible(p)["motif"])

    def test_tarif_cible_par_nuit_avec_annexes_et_gestion(self):
        p = exemple("tourisme")
        p.update(credit={"capital": 0}, fiscalite={"regime": "avant_impot"}, charges_annuelles={"charges": 15500})
        p["projection"]["effort_max_mensuel"] = 0
        p["location"].update(occupation_pct=50, delai_mois=0, gestion_pct=20, annexes_mensuelles=75)
        cible = loyer_cible(p)
        self.assertEqual((cible["champ"], cible["tarif"], cible["impot"]), ("prix_nuit", 100, None))
        self.assertAlmostEqual(cible["cash_flow_mensuel"], 0)
        p["location"]["occupation_pct"] = 0
        self.assertEqual(loyer_cible(p)["statut"], "inatteignable")
        p["projection"]["effort_max_mensuel"] = -1
        self.assertEqual(loyer_cible(p)["statut"], "a_corriger")

    def test_tableau_de_lina_et_indicateurs_de_sortie(self):
        d = calcul(exemple("lina"), True)
        a = d["annees"][0]
        for valeur, attendu in (
            (d["cout_acquisition"], 171000), (d["fonds_propres_initiaux"], 28300),
            (d["mensualite_apres_differe_assurance_comprise"], 870.94),
            (a["recettes_hc_et_annexes"], 9975), (a["dette_assurance_comprise"], 10451.30),
            (a["cash_flow_apres_impot"], -4656.30), (d["rendement_brut_effectif_pct"], 7),
            (d["rendement_net_exploitation_pct"], 5.26), (d["revente"]["dette_remboursee"], 85041.64),
            (d["revente"]["produit_net"], 90458.36), (d["cash_on_cash_an1_pct"], -16.45),
            (d["bilan_avec_revente"]["tri_pct"], 7.03), (d["bilan_avec_revente"]["van"], 8180.35),
            (d["bilan_avec_revente"]["roi_pct"], 76.17), (d["bilan_avec_revente"]["moic"], 1.76),
            (d["recettes_mensuelles_point_mort_an1"], 1463.13)):
            self.assertAlmostEqual(valeur, attendu, delta=.005)
        self.assertEqual(len(d["echeancier"]), 240)
        self.assertAlmostEqual(d["echeancier"][-1]["capital_restant_du"], 0)

    def test_credit_nul_zero_pct_et_deux_differes(self):
        base = {"capital": 120000, "taux_pct": 0, "duree_mois": 120, "differe_mois": 0,
                "mode_assurance": "capital_restant_du", "assurance": 1.2}
        pret = echeancier(base)
        self.assertEqual([p["assurance"] for p in pret[:2]], [120,119])
        self.assertEqual(sum(m["echeance"] for m in pret[:12]), 13374)
        self.assertEqual(echeancier({"capital": 0}), [])
        for mode in ("interets_seuls", "capitalise"):
            pret = echeancier({**base, "taux_pct": 12, "differe_mois": 12, "type_differe": mode})
            capital = 120000 if mode == "interets_seuls" else 120000*1.01**12
            self.assertAlmostEqual(pret[11]["capital_restant_du"], capital, places=6)
            self.assertEqual(pret[0]["interets_payes"], 1200 if mode == "interets_seuls" else 0)
            self.assertAlmostEqual(pret[-1]["capital_restant_du"], 0, places=6)
            self.assertAlmostEqual(sum(m["capital_rembourse"] for m in pret), capital, places=6)

    def test_perte_a_la_vente_et_coefficient_de_van(self):
        p = exemple("lina")
        p["projection"].update(annees=1, actualisation_pct=1)
        p["revente"].update(prix=40000, impot=0)
        d = calcul(p)
        self.assertLess(d["revente"]["produit_net"], 0)
        flux = d["bilan_avec_revente"]["flux_annuels"]
        self.assertAlmostEqual(d["bilan_avec_revente"]["van"], flux[0]+flux[1]/1.01)
        self.assertAlmostEqual(d["cash_on_cash_an1_pct"], 100*d["annees"][0]["cash_flow_apres_impot"]/28300)
        self.assertIsNone(d["bilan_avec_revente"]["tri_pct"])

    def test_multiples_sur_apports_et_tri_non_unique(self):
        b = bilan_flux([-100,-50,350],5)
        self.assertAlmostEqual(b["moic"], 350/150)
        self.assertAlmostEqual(b["roi_pct"], 200/150*100)
        b = bilan_flux([-100,230,-132],5)
        self.assertIsNone(b["tri_pct"])
        self.assertIsNotNone(b["tri_modifie_pct"])

    def test_seuil_micro_foncier_et_gestion_deduite_une_fois(self):
        p = exemple("location-nue")
        p["fiscalite"]["autres_recettes"] = 3600     # total foyer = 15 000 €
        d = comparer_fiscalite(p)["scenarios"]
        self.assertAlmostEqual(d["micro_foncier"]["base_imposable_an1"], 7980)
        self.assertAlmostEqual(d["micro_foncier"]["impot_an1"], 3766.56)
        self.assertAlmostEqual(d["foncier_reel"]["impot_an1"], 2077.76, delta=.005)
        p["fiscalite"]["autres_recettes"] += 1
        self.assertEqual(comparer_fiscalite(p)["scenarios"]["micro_foncier"]["statut"], "hors_perimetre")

    def test_bic_deux_annees_minimum_par_activite_et_charges_recuperees(self):
        p = exemple("location-meublee")
        p["fiscalite"].update(regime="micro_bic", recettes_n1=90000, recettes_n2=83600)
        p["projection"]["annees"] = 1
        a = calcul(p)["annees"][0]
        self.assertAlmostEqual(a["fiscalite"]["base_imposable"], 5196)
        self.assertAlmostEqual(a["fiscalite"]["impot"], 2525.256)
        p["fiscalite"]["recettes_n2"] += 1
        self.assertEqual(calcul(p)["statut"], "hors_perimetre")
        p["fiscalite"].update(recettes_n2=0, autres_recettes=400)
        p["location"].update(loyer_mensuel_hc=10, vacance_pct=0, charges_refacturees_annuelles=0)
        # Imposable de 520 € (215 €) moins imposable de 400 € (95 €).
        self.assertEqual(calcul(p)["annees"][0]["fiscalite"]["base_imposable"], 120)

    def test_lmnp_et_statut_social(self):
        p = exemple("location-meublee")
        p["location"].update(loyer_mensuel_hc=3000, vacance_pct=0, charges_refacturees_annuelles=0)
        d = calcul(p)
        self.assertIn("fiscalite.revenus_comparaison_lmp", d["questions"])
        p["fiscalite"]["revenus_comparaison_lmp"] = 35000
        self.assertEqual(calcul(p)["statut"], "hors_perimetre")
        p["fiscalite"]["revenus_comparaison_lmp"] = 36000
        self.assertEqual(calcul(p)["statut"], "calcule")
        p = exemple("tourisme")
        p["location"]["occupation_pct"] = 100
        self.assertEqual(calcul(p)["statut"], "hors_perimetre")

    def test_plus_de_vacance_que_la_premiere_annee(self):
        p = exemple("location-nue")
        p["location"].update(delai_mois=18, gestion_pct=0)
        p["fiscalite"] = {"regime":"avant_impot"}
        a, b = calcul(p)["annees"][:2]
        self.assertEqual(a["recettes_hc_et_annexes"], 0)
        self.assertEqual(b["recettes_hc_et_annexes"], 5700)
        self.assertEqual(a["charges_proprietaire"], 2400)
        self.assertIsNone(a["cash_flow_apres_impot"])
        self.assertIsNone(calcul(p)["recettes_mensuelles_point_mort_an1"])

    def test_deductions_amortissements_et_reports(self):
        p = exemple("location-meublee")
        p["credit"] = {"capital":0}
        p["location"].update(loyer_mensuel_hc=500, vacance_pct=0, gestion_pct=0, charges_refacturees_annuelles=0)
        p["fiscalite"].update(charges_deductibles_annuelles=5000, amortissement_annuel=3000, base_amortissable=3000)
        lignes = calcul(p)["annees"]
        self.assertEqual(lignes[0]["fiscalite"]["amortissement_en_report"],2000)
        self.assertEqual(lignes[2]["fiscalite"]["amortissement_en_report"],0)
        self.assertEqual(lignes[3]["fiscalite"]["base_imposable"],1000)
        p = exemple("location-nue")
        p["credit"] = {"capital": 0}
        p["location"].update(loyer_mensuel_hc=1000, vacance_pct=0, gestion_pct=0)
        p["fiscalite"].update(charges_deductibles_annuelles=0, deductions_annee_1=25200)
        a,b = calcul(p)["annees"][:2]
        self.assertEqual(a["fiscalite"]["deficit_imputable_global_hors_flux"],10700)
        self.assertEqual(a["fiscalite"]["deficits_en_report"],2500)
        self.assertEqual(b["fiscalite"]["base_imposable"],9500)
        self.assertEqual(Suivi(deficits=[(1, 100)]).imputer(12, 200), 200)

    def test_societe_et_associe(self):
        p = exemple("sci-is")
        a = calcul(p)["annees"][0]
        self.assertAlmostEqual(a["fiscalite"]["is"],773.88)
        self.assertAlmostEqual(a["fiscalite"]["dividendes_nets_associe"],1372)
        self.assertAlmostEqual(a["tresorerie_societe_apres_distribution"],a["cash_flow_apres_impot"]-2000)
        p["fiscalite"]["taux_reduit_is"] = False
        self.assertAlmostEqual(calcul(p)["annees"][0]["fiscalite"]["is"], 5159.2*.25)
        p["fiscalite"]["detention"] = "direct"
        self.assertEqual(calcul(p)["statut"], "a_corriger")

    def test_jeanbrun_et_duree(self):
        p = exemple("jeanbrun")
        a,b = calcul(p)["annees"][:2]
        self.assertAlmostEqual(a["fiscalite"]["deduction_jeanbrun"],176000*.035*10/12)
        self.assertAlmostEqual(b["fiscalite"]["deduction_jeanbrun"],6160)
        p["revente"] = {"prix":250000, "frais":10000, "impot":5000, "indemnite":0}
        p["projection"]["annees"] = 8
        self.assertEqual(calcul(p)["statut"], "hors_perimetre")

    def test_plus_value_particulier(self):
        v = {"prix": 250000, "frais": 12000, "mode_indemnite":"plafond", "mode_impot":"particulier",
             "base_acquisition_fiscale":200000, "frais_cession_deductibles":10000, "amortissements_a_reintegrer":20000}
        d = cession(v, 5, 50000, 3)
        self.assertEqual(d["plus_value_brute"],60000)
        self.assertEqual(d["indemnite"],750)
        self.assertEqual(d["surtaxe"],1200)
        self.assertAlmostEqual(d["impot_cession"],60000*(.19+.172)+1200)
        self.assertAlmostEqual(cession(v,22,0,3)["impot_cession"],60000*.72*.172)
        self.assertEqual(cession(v,30,0,3)["impot_cession"],0)

    def test_saisie_inconnue_comptant_et_taux_de_bareme(self):
        p = exemple("location-nue")
        p["achat"].update(prix=None, frais_acte=0)
        self.assertIn("achat.prix",lire(p).questions)
        self.assertNotIn("achat.frais_acte",lire(p).questions)
        p["achat"]["prix"] = 150000
        p["credit"] = {"apport_hors_frais_bancaires": 154500}
        self.assertEqual(calcul(p)["capital_emprunte"],0)
        p["credit"]["capital"] = 100
        self.assertIn("credit.capital",lire(p).erreurs)
        self.assertAlmostEqual(ir_bareme(30000,1),2103.99)
        p["fiscalite"]["tmi_pct"] = False
        self.assertIn("fiscalite.tmi_pct",lire(p).erreurs)
        p["charges_annuelles"]["copropriete"] = None
        self.assertIn("charges_annuelles.copropriete",lire(p).questions)

    def test_cli_mauvais_json_et_tous_les_exemples(self):
        for path in (ROOT/"exemples").glob("*.json"):
            with self.subTest(path.name):
                sortie = subprocess.check_output([sys.executable,str(ROOT/"renta.py"),"calculer",str(path),"--json"])
                self.assertEqual(json.loads(sortie)["statut"],"calcule")
        erreur = subprocess.run([sys.executable,str(ROOT/"renta.py"),"calculer","-","--json"],
                                input=b'{"achat":',capture_output=True)
        self.assertNotEqual(erreur.returncode,0)
        self.assertEqual(json.loads(erreur.stdout)["statut"],"a_corriger")
        p = exemple("location-nue")
        p["fiscalite"] = None
        self.assertTrue(all(s["statut"]=="a_completer" for s in comparer_fiscalite(p)["scenarios"].values()))
