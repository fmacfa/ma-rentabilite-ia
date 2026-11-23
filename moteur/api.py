"""Actions de simulation partagées entre le navigateur et les outils locaux."""
from .saisie import lire
from .simulation import simuler
from .finance import echeancier
from .fiscalite import QuestionFiscale, taux_prelevements


def reperes(projet):
    achat = projet.get("achat", {})
    location = projet.get("location", {})
    if achat.get("prix") and "loyer_mensuel_hc" in location and location.get("type") in ("nue", "meublee_longue"):
        loyer = location["loyer_mensuel_hc"]*12
        return {"loyer_theorique_annuel_hc": loyer, "brut_sur_prix_annonce_hors_frais_pct": 100*loyer/achat["prix"]}
    return {}


def calcul(brut, echeancier=False, an1=False):
    resultat = _calcul(brut, echeancier, an1)
    projection = brut.get("projection")
    if not an1 and isinstance(projection, dict) and projection.get("effort_max_mensuel") is not None:
        resultat["loyer_cible"] = loyer_cible(brut)
    return resultat


def _calcul(brut, echeancier, an1):
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


def loyer_cible(brut):
    """Premier tarif au centime qui respecte le budget moyen de l’année 1."""
    loc = brut.get("location")
    projection = brut.get("projection")
    budget = projection.get("effort_max_mensuel") if isinstance(projection, dict) else None
    tourisme = isinstance(loc, dict) and loc.get("type") in ("tourisme_classe", "tourisme_non_classe")
    cle = "prix_nuit" if tourisme else "loyer_mensuel_hc"
    scenario = {**brut, "projection": {"annees": 1, "effort_max_mensuel": budget}}
    scenario.pop("revente", None)
    if isinstance(loc, dict):
        scenario["location"] = {**loc, cle: 0}
    fiche = lire(scenario)
    if fiche.questions or fiche.erreurs:
        return {"statut": "a_corriger" if fiche.erreurs else "a_completer",
                "erreurs": fiche.erreurs, "questions": fiche.questions}
    p = fiche.projet
    dette = echeancier(p["credit"])
    location, fiscalite = p["location"], p["fiscalite"]

    def essai(centimes):
        location[cle] = centimes / 100
        try:
            resultat = simuler(p, premiere_annee=True, dette_preparee=dette)
        except QuestionFiscale as err:
            return {"statut": "a_completer", "questions": {err.champ: str(err)}}
        except ValueError as err:
            return {"statut": "hors_perimetre", "motif": str(err)}
        an = resultat["annees"][0]
        return {"statut": "calcule", "tarif": location[cle], "champ": cle, "effort_max_mensuel": budget,
                "flux_retenus": resultat["flux_retenus"], "mois_ouverts": an["mois_ouverts"],
                "recettes": an["recettes_hc_et_annexes"], "gestion": an["gestion"],
                "charges": an["charges_proprietaire"], "dette": an["dette_assurance_comprise"],
                "impot": an["fiscalite"]["impot"], "cash_flow_mensuel": an["cash_flow_mensuel_retenu"]}

    def insuffisant(essai):
        return essai["statut"] == "calcule" and essai["cash_flow_mensuel"] < -budget - 1e-10

    bas, precedent = 0, essai(0)
    if not insuffisant(precedent):
        return precedent
    occupation = location["occupation_pct"] if tourisme else 100 - location["vacance_pct"]
    if not precedent["mois_ouverts"] or not occupation or location["gestion_pct"] == 100:
        return {"statut": "inatteignable", "motif": "Aucun loyer supplémentaire ne reste disponible en année 1 avec ces hypothèses de délai, d’occupation et de gestion."}
    if fiscalite["regime"].startswith("micro_"):
        # Les frais réels de gestion ne réduisent pas la base du micro. En cas
        # de frais très élevés, la trésorerie peut diminuer quand le loyer monte.
        taux_ir_max = fiscalite.get("tmi_pct", 45)
        if location["gestion_pct"] + taux_ir_max + 100 * taux_prelevements(location["type"]) > 100:
            return {"statut": "hors_perimetre", "motif": "Avec ces frais de gestion au micro, une hausse du loyer peut réduire la trésorerie. Comparer des loyers précis avec le bilan."}
    limite = 100_000_000_000_000  # Maximum accepté par la saisie, en centimes.
    haut = 100_000
    candidat = essai(haut)
    while insuffisant(candidat) and haut < limite:
        bas, precedent = haut, candidat
        haut = min(2 * haut, limite)
        candidat = essai(haut)
    if insuffisant(candidat):
        return {"statut": "inatteignable", "motif": "L’objectif dépasse la plage de montants du calcul."}
    # Une sortie du régime est aussi une borne haute. Un tarif valable
    # peut encore exister entre le dernier essai et ce seuil.
    while haut - bas > 1:
        milieu = (bas + haut) // 2
        essai_milieu = essai(milieu)
        if insuffisant(essai_milieu):
            bas, precedent = milieu, essai_milieu
        else:
            haut, candidat = milieu, essai_milieu
    if candidat["statut"] == "calcule":
        candidat["cash_flow_au_centime_precedent"] = precedent["cash_flow_mensuel"]
    return candidat


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
    if isinstance(brut.get("projection"), dict) and "effort_max_mensuel" in brut["projection"]:
        brut = {**brut, "projection": dict(brut["projection"])}
        del brut["projection"]["effort_max_mensuel"]
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
