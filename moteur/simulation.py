"""Relie les flux d’exploitation, de financement, d’impôt et de vente."""
from .finance import bilan_flux, cession, cout_acquisition, echeancier, frais_acte
from .fiscalite import QuestionFiscale, Suivi, estimer


def simuler(p, avec_echeancier=False, premiere_annee=False, dette_preparee=None):
    achat, loc, credit = p["achat"], p["location"], p["credit"]
    f, proj = p["fiscalite"], p["projection"]
    location = loc["type"]
    avant_impot = f["regime"] == "avant_impot"
    cout = cout_acquisition(achat)
    frais_banque = credit["dossier"]+credit["garantie"]
    apport = cout+frais_banque-credit["capital"]
    if apport < 0:
        raise ValueError("Le crédit dépasse le coût du projet frais bancaires compris. Vérifier les montants financés.")
    dette = echeancier(credit) if dette_preparee is None else dette_preparee
    nb_ans = 1 if premiere_annee else proj["annees"]
    if f["regime"] == "jeanbrun" and "revente" in p and 12*proj["annees"]-loc["delai_mois"] < 108:
        raise ValueError("La vente précède les neuf ans de location requis pour Jeanbrun. Chiffrer séparément une éventuelle reprise.")
    if location in ("nue", "meublee_longue"):
        loyer_plein = loc["loyer_mensuel_hc"]*12
        loyers = loyer_plein*(1-loc["vacance_pct"]/100)
    else:
        loyer_plein = loc["prix_nuit"]*365
        loyers = loyer_plein*loc["occupation_pct"]/100
    annexes = loc["annexes_mensuelles"]*12
    recettes = loyers+annexes
    charges_fixes = sum(p["charges_annuelles"].values())
    frais_gestion = loyers*loc["gestion_pct"]/100
    net_reference = recettes-charges_fixes-frais_gestion
    suivi = Suivi()
    flux = [-apport]
    lignes = []
    crd = credit["capital"]
    for an in range(1, nb_ans+1):
        ouverts = 12-min(12, max(0, loc["delai_mois"]-12*(an-1)))
        indice_loyer = (1+proj["index_loyers_pct"]/100)**(an-1)
        facteur = indice_loyer*ouverts/12
        indice_charges = (1+proj["index_charges_pct"]/100)**(an-1)
        loyers_hc = recettes*facteur
        gestion = frais_gestion*facteur
        charges = charges_fixes*indice_charges
        refacturees = loc["charges_refacturees_annuelles"]*facteur
        exploitation = loyers_hc-gestion-charges
        mensualites = dette[12*(an-1):12*an]
        annuite = sum(m["echeance"] for m in mensualites)
        interets = sum(m["interets_payes"] for m in mensualites)
        assurance = sum(m["assurance"] for m in mensualites)
        if mensualites:
            crd = mensualites[-1]["capital_restant_du"]
        try:
            fiscal = estimer(f, location, an, loyers_hc, refacturees, gestion, indice_charges, interets,
                             assurance, suivi, exploitation, net_reference)
        except QuestionFiscale as err:
            raise QuestionFiscale(f"Année {an}. {err}") from err
        except ValueError as err:
            raise ValueError(f"Année {an}. {err}") from err
        cf_avant = exploitation-annuite
        impot = fiscal["impot"]
        cf_apres = cf_avant-impot if impot is not None else None
        cf = cf_avant if avant_impot else cf_apres
        flux.append(cf)
        lignes.append({"annee": an, "mois_ouverts": ouverts, "recettes_hc_et_annexes": loyers_hc,
                       "charges_recuperees_a_prix_coutant": refacturees, "gestion": gestion, "charges_proprietaire": charges,
                       "net_exploitation": exploitation, "dette_assurance_comprise": annuite, "interets_payes": interets,
                       "assurance": assurance, "capital_restant_du": crd, "fiscalite": fiscal,
                       "cash_flow_avant_impot": cf_avant, "cash_flow_apres_impot": cf_apres,
                       "cash_flow_mensuel_retenu": cf/12})
        if f["regime"] == "sci_is":
            lignes[-1]["tresorerie_societe_apres_distribution"] = cf-fiscal["dividendes_bruts_hypothese"]
    a1 = lignes[0]
    cf1 = flux[1]
    brut_pt = a1["charges_proprietaire"]+a1["gestion"]+(a1["fiscalite"]["impot"] or 0)+a1["dette_assurance_comprise"]
    result = {"regime": f["regime"], "annee_regles": f.get("annee_reference"),
              "flux_retenus": "avant impôt locatif" if avant_impot else ("société après IS, avant distribution" if f["regime"]=="sci_is" else "après impôt locatif estimé"),
              "frais_acte": frais_acte(achat), "cout_acquisition": cout, "frais_bancaires": frais_banque,
              "cout_initial_total": cout+frais_banque, "capital_emprunte": credit["capital"], "fonds_propres_initiaux": apport,
              "recettes_reference": recettes, "rendement_brut_effectif_pct": 100*recettes/cout,
              "rendement_brut_theorique_pct": 100*(loyer_plein+annexes)/cout, "rendement_net_exploitation_pct": 100*net_reference/cout,
              "rendement_apres_impot_an1_pct": None if avant_impot else 100*(a1["net_exploitation"]-a1["fiscalite"]["impot"])/cout,
              "cash_on_cash_an1_pct": 100*cf1/apport if apport > 0 else None,
              "dscr_an1": a1["net_exploitation"]/a1["dette_assurance_comprise"] if a1["dette_assurance_comprise"] else None,
              "recettes_mensuelles_point_mort_an1": brut_pt/a1["mois_ouverts"] if a1["mois_ouverts"] else None,
              "mensualite_apres_differe_assurance_comprise": dette[credit["differe_mois"]]["echeance"] if dette else 0,
              "cout_credit_a_terme_hors_ira": frais_banque+sum(m["interets_courus"]+m["assurance"] for m in dette),
              "annees": lignes, "hypotheses": p["hypotheses"]}
    if avec_echeancier:
        result["echeancier"] = dette
    if "revente" in p and not premiere_annee:
        vente = cession(p["revente"], nb_ans, crd, credit.get("taux_pct", 0))
        flux[-1] += vente["produit_net"]
        result["revente"] = vente
        result["bilan_avec_revente"] = bilan_flux(flux, proj["actualisation_pct"])
    result["cash_flow_cumule_hors_vente"] = sum(flux[1:]) - result.get("revente", {}).get("produit_net", 0)
    return result
