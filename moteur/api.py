"""Actions de simulation partagées entre le navigateur et les outils locaux."""
from .saisie import lire
from .simulation import simuler
from .fiscalite import QuestionFiscale


def reperes(projet):
    achat = projet.get("achat", {})
    location = projet.get("location", {})
    if achat.get("prix") and "loyer_mensuel_hc" in location and location.get("type") in ("nue", "meublee_longue"):
        loyer = location["loyer_mensuel_hc"]*12
        return {"loyer_theorique_annuel_hc": loyer, "brut_sur_prix_annonce_hors_frais_pct": 100*loyer/achat["prix"]}
    return {}


def calcul(brut, echeancier=False, an1=False):
    fiche = lire(brut)
    if fiche.questions or fiche.erreurs:
        return {"statut": "a_corriger" if fiche.erreurs else "a_completer",
                "erreurs": fiche.erreurs, "questions": fiche.questions, "premiers_reperes": reperes(fiche.projet)}
    try:
        resultat = simuler(fiche.projet, echeancier, an1)
    except QuestionFiscale as err:
        return {"statut": "a_completer", "questions": {err.champ: str(err)}}
    except ValueError as err:
        return {"statut": "hors_perimetre", "motif": str(err)}
    return {"statut": "calcule", **resultat, "valeurs_par_defaut": fiche.defauts}


def indicateurs(d):
    if d["statut"] != "calcule":
        return d
    a = d["annees"][0]
    return {"statut": "calcule", "regime": d["regime"], "flux_retenus": d["flux_retenus"],
            "cout_acquisition": d["cout_acquisition"], "fonds_propres_initiaux": d["fonds_propres_initiaux"],
            "rendement_net_pct": d["rendement_net_exploitation_pct"], "base_imposable_an1": a["fiscalite"].get("base_imposable"),
            "impot_an1": a["fiscalite"]["impot"], "cash_flow_avant_impot_an1": a["cash_flow_avant_impot"],
            "cash_flow_apres_impot_an1": a["cash_flow_apres_impot"], "cash_flow_mensuel_retenu": a["cash_flow_mensuel_retenu"],
            "horizon_ans": len(d["annees"]), "tri_pct": d.get("bilan_avec_revente", {}).get("tri_pct")}


def comparer_fiscalite(brut):
    # Le type de location et le détenteur restent identiques dans chaque colonne.
    source = lire(brut)
    structure = brut.get("fiscalite") or {}
    loc = source.projet.get("location", {}).get("type")
    if not loc or not isinstance(structure, dict):
        return {"statut": "a_completer", "questions": source.questions, "erreurs": source.erreurs}
    if structure.get("detention") == "sci_is":
        regimes = ["sci_is"]
    elif loc == "nue":
        regimes = ["micro_foncier", "foncier_reel"]
        if structure.get("regime") == "jeanbrun" or "type_jeanbrun" in structure:
            regimes.append("jeanbrun")
    else:
        regimes = ["micro_bic", "lmnp_reel"]
    simulations = {}
    for regime in regimes:
        scenario = dict(brut)
        scenario["fiscalite"] = {**structure, "regime": regime}
        # Comparaison de la première année d’exploitation, hors sortie.
        scenario.pop("revente", None)
        simulations[regime] = indicateurs(calcul(scenario, an1=True))
    return {"statut": "comparaison", "objet": "Fiscalité de la première année, à location et financement identiques",
            "scenarios": simulations}


def sensibilite(brut):
    verification = calcul(brut)
    if verification["statut"] != "calcule":
        return verification
    scenarios = {"Central": indicateurs(verification)}
    loc = brut["location"]["type"]
    cle_loyer = "loyer_mensuel_hc" if loc in ("nue", "meublee_longue") else "prix_nuit"
    for nom, rubrique, cle, facteur in (
        ("Prix d’achat −10 %", "achat", "prix", .90), ("Prix d’achat −20 %", "achat", "prix", .80),
        ("Loyer −10 %", "location", cle_loyer, .90), ("Loyer −20 %", "location", cle_loyer, .80)):
        variante = {**brut, rubrique: dict(brut[rubrique])}
        variante[rubrique][cle] *= facteur
        scenarios[nom] = indicateurs(calcul(variante))
    return {"statut": "comparaison", "objet": "Sensibilité au prix et au loyer, autres entrées identiques", "scenarios": scenarios}


def arrondir(v):
    if isinstance(v, dict):
        return {k: arrondir(x) for k, x in v.items()}
    if isinstance(v, list):
        return [arrondir(x) for x in v]
    return round(v, 6) if isinstance(v, float) else v


def questions(brut):
    fiche = lire(brut)
    resultat = {"statut": "a_corriger" if fiche.erreurs else ("a_completer" if fiche.questions else "complet"),
                "questions": fiche.questions, "erreurs": fiche.erreurs, "premiers_reperes": reperes(fiche.projet)}
    if resultat["statut"] == "complet":
        validation = calcul(brut)
        if validation["statut"] != "calcule":
            resultat = validation
    return resultat
