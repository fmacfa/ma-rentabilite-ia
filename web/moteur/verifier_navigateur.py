"""Contrôle de parité dans un navigateur hors ligne, pour la maintenance du moteur."""
import json
import math
from copy import deepcopy
from html import escape
from pathlib import Path
import sys
import tempfile
import unittest

from playwright.sync_api import sync_playwright

DOSSIER = Path(__file__).resolve().parent
RACINE = DOSSIER.parents[1]
sys.path.insert(0, str(RACINE))

from moteur.api import arrondir, calcul, comparer_fiscalite, questions, sensibilite
from moteur.saisie import lire
from construire import paquet_sources


def entrees(projet):
    fiche = lire(projet)
    return {"projet": fiche.projet, "defauts": fiche.defauts, "questions": fiche.questions, "erreurs": fiche.erreurs}


class PariteNavigateur(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.exemples = {f.stem: json.loads(f.read_text(encoding="utf-8")) for f in (RACINE / "exemples").glob("*.json")}
        cls.pw = sync_playwright().start()
        cls.addClassCleanup(cls.pw.stop)
        local = Path("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome")
        cls.browser = cls.pw.chromium.launch(executable_path=str(local) if local.is_file() else None)
        cls.addClassCleanup(cls.browser.close)
        cls.page = cls.browser.new_page()
        classeur = tempfile.TemporaryDirectory()
        cls.addClassCleanup(classeur.cleanup)
        accueil = Path(classeur.name, "index.html")
        accueil.write_text('<!doctype html><meta charset="utf-8"><script src="'
                           + escape((DOSSIER / "renta.js").as_uri(), quote=True) + '"></script>', encoding="utf-8")
        cls.page.context.set_offline(True)
        cls.requetes = []
        cls.page.on("request", lambda requete: cls.requetes.append(requete.url))
        cls.page.goto(accueil.as_uri())

    def comparer_valeurs(self, valeur, attendu, chemin):
        if isinstance(attendu, dict):
            self.assertIsInstance(valeur, dict, chemin)
            self.assertEqual(set(valeur), set(attendu), chemin)
            for cle in attendu:
                self.comparer_valeurs(valeur[cle], attendu[cle], f"{chemin}.{cle}")
        elif isinstance(attendu, list):
            self.assertIsInstance(valeur, list, chemin)
            self.assertEqual(len(valeur), len(attendu), chemin)
            for i, (recu, ref) in enumerate(zip(valeur, attendu)):
                self.comparer_valeurs(recu, ref, f"{chemin}[{i}]")
        elif type(attendu) in (int, float):
            self.assertTrue(type(valeur) in (int, float) and math.isclose(
                valeur, attendu, rel_tol=1e-13, abs_tol=1.1e-6), f"{chemin} : {valeur} / {attendu}")
        else:
            self.assertEqual(valeur, attendu, chemin)

    def verifier(self, dossier):
        actions = {"calculer": lambda p: calcul(p, echeancier=True), "comparer": comparer_fiscalite,
                   "questions": questions, "entrees": entrees, "sensibilite": sensibilite}
        # Des clics successifs avant la fin du chargement partagent une initialisation.
        sorties = self.page.evaluate("""
            ([actions, dossier]) => Promise.all(actions.map(action => RentaMoteur[action](dossier)))
        """, [list(actions), dossier])
        for (action, fonction), obtenu in zip(actions.items(), sorties):
            self.comparer_valeurs(obtenu, arrondir(fonction(dossier)), action)
        self.assertTrue(all(url.startswith("file:") for url in self.requetes), self.requetes)

    def test_sources_synchronisees(self):
        self.assertEqual(paquet_sources(), (DOSSIER / "modules.js").read_text(encoding="utf-8"))

    def test_six_exemples(self):
        self.assertEqual(len(self.exemples), 6)
        for nom, d in self.exemples.items():
            with self.subTest(nom=nom):
                self.verifier(d)

    def test_partiel_seuils_fiscalite_et_revente_a_perte(self):
        self.verifier(json.loads((RACINE / "modele.json").read_text(encoding="utf-8")))
        p = deepcopy(self.exemples["location-nue"])
        p["charges_annuelles"]["copropriete"] = None
        p["hypotheses"].append('Loyer « annoncé » à confirmer. Test de caractères : <, &, " et €.')
        self.verifier(p)
        p = deepcopy(self.exemples["location-nue"])
        p["fiscalite"].update(regime="micro_foncier", autres_recettes=3600.01)
        self.verifier(p)
        p = deepcopy(self.exemples["location-meublee"])
        p["location"]["loyer_mensuel_hc"] = 3100
        self.verifier(p)
        p = deepcopy(self.exemples["lina"])
        p["revente"]["prix"] = 45000
        p["credit"].update(type_differe="capitalise", differe_mois=8, mode_assurance="capital_restant_du", assurance=.3)
        self.verifier(p)

    def test_vente_auto_taux_nul_et_conservation_longue(self):
        p = deepcopy(self.exemples["location-nue"])
        p["credit"].update(taux_pct=0, mode_assurance="capital_restant_du", assurance=.17)
        p["projection"].update(annees=30)
        p["revente"] = {"prix":230000, "frais":6000, "mode_indemnite":"plafond", "mode_impot":"particulier",
                        "cas_particulier_confirme":True, "base_acquisition_fiscale":150000,
                        "frais_cession_deductibles":4000, "amortissements_a_reintegrer":0}
        self.verifier(p)

    def test_objectif_budget_et_loyer_inconnu(self):
        p = deepcopy(self.exemples["lina"])
        p["projection"]["effort_max_mensuel"] = 400
        self.verifier(p)
        p["location"]["loyer_mensuel_hc"] = None
        self.verifier(p)


if __name__ == "__main__":
    unittest.main()
