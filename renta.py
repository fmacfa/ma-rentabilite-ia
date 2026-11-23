#!/usr/bin/env python3
"""Assistant de simulation locative. Exécuter « python3 renta.py --help »."""
import argparse
from copy import deepcopy
import json
from pathlib import Path
import sys

from moteur.saisie import lire
from moteur.simulation import simuler
from moteur.fiscalite import QuestionFiscale

RACINE = Path(__file__).resolve().parent


def charger(chemin):
    if chemin == "-":
        return json.load(sys.stdin)
    with Path(chemin).open(encoding="utf-8") as fichier:
        return json.load(fichier)


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
        scenario = deepcopy(brut)
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
        variante = deepcopy(brut)
        variante[rubrique][cle] *= facteur
        scenarios[nom] = indicateurs(calcul(variante))
    return {"statut": "comparaison", "objet": "Sensibilité au prix et au loyer, autres entrées identiques", "scenarios": scenarios}


def arrondir(v):
    if isinstance(v, dict):
        return {k: arrondir(x) for k, x in v.items()}
    if isinstance(v, list):
        return [arrondir(x) for x in v]
    return round(v, 6) if isinstance(v, float) else v


def nombre(v, unite="€"):
    if v is None:
        return "non calculé"
    return f"{v:,.2f}".replace(",", " ").replace(".", ",")+" "+unite


def resume(resultat, echeancier=False):
    statut = resultat["statut"]
    if statut == "comparaison":
        print(resultat["objet"])
        for nom, s in resultat["scenarios"].items():
            print(f"\n{nom}")
            if s["statut"] != "calcule":
                resume(s)
                continue
            print(f"  Impôt an 1 {nombre(s['impot_an1'])} · trésorerie mensuelle {nombre(s['cash_flow_mensuel_retenu'])} ({s['flux_retenus']})")
            print(f"  Rendement net {nombre(s['rendement_net_pct'], '%')} · fonds propres {nombre(s['fonds_propres_initiaux'])}")
            if s["tri_pct"] is not None:
                print("  TRI à la revente", nombre(s["tri_pct"], "%"))
        return
    if statut != "calcule":
        if resultat.get("motif"):
            print(resultat["motif"])
        for k, v in {**resultat.get("erreurs", {}), **resultat.get("questions", {})}.items():
            print(f"• {k} — {v}")
        for k, v in resultat.get("premiers_reperes", {}).items():
            print(f"  {k}  {nombre(v, '%' if k.endswith('_pct') else '€')}")
        if statut == "complet":
            print("Les entrées nécessaires sont renseignées.")
        return

    a = resultat["annees"][0]
    print(f"Simulation {resultat['regime']} · {resultat['flux_retenus']}")
    print(f"Coût d’acquisition {nombre(resultat['cout_acquisition'])} · fonds propres {nombre(resultat['fonds_propres_initiaux'])}")
    print(f"Rendement brut après vacance {nombre(resultat['rendement_brut_effectif_pct'], '%')} · net d’exploitation {nombre(resultat['rendement_net_exploitation_pct'], '%')}")
    print(f"Année 1 · recettes {nombre(a['recettes_hc_et_annexes'])} · gestion et charges {nombre(a['gestion']+a['charges_proprietaire'])} · crédit assuré {nombre(a['dette_assurance_comprise'])}")
    print(f"Impôt locatif {nombre(a['fiscalite']['impot'])} · trésorerie avant impôt {nombre(a['cash_flow_avant_impot'])}/an")
    print(f"Trésorerie retenue {nombre(a['cash_flow_mensuel_retenu'])}/mois · point mort {nombre(resultat['recettes_mensuelles_point_mort_an1'])}/mois ouvert")
    if "revente" in resultat:
        bilan = resultat["bilan_avec_revente"]
        print(f"Revente à {len(resultat['annees'])} ans · produit net {nombre(resultat['revente']['produit_net'])} · TRI {nombre(bilan['tri_pct'], '%')} · VAN {nombre(bilan['van'])}")
    if echeancier:
        print("\nMois       Échéance        Intérêts payés       Capital restant dû")
        for m in resultat["echeancier"]:
            print(f"{m['mois']:4} {nombre(m['echeance']):>15} {nombre(m['interets_payes']):>18} {nombre(m['capital_restant_du']):>22}")


def main():
    parser = argparse.ArgumentParser(description="Simuler un investissement locatif français à partir d’un dossier JSON.")
    parser.add_argument("action", choices=("questions", "calculer", "comparer", "sensibilite"))
    parser.add_argument("dossiers", nargs="*", help="Dossier JSON ou - pour lire l’entrée standard.")
    parser.add_argument("--json", action="store_true", help="Toutes les hypothèses et les résultats structurés pour votre IA.")
    parser.add_argument("--echeancier", action="store_true", help="Ajouter le tableau mensuel du prêt au calcul.")
    args = parser.parse_args()
    fichiers = args.dossiers
    if not fichiers and args.action == "questions":
        fichiers = [RACINE/"modele.json"]
    if not fichiers or (args.action != "comparer" and len(fichiers) != 1):
        parser.error("Fournir un dossier JSON (plusieurs sont acceptés par comparer).")
    if args.echeancier and args.action != "calculer":
        parser.error("--echeancier accompagne la commande calculer.")
    try:
        brut = charger(fichiers[0])
        if args.action == "questions":
            fiche = lire(brut)
            resultat = {"statut": "a_corriger" if fiche.erreurs else ("a_completer" if fiche.questions else "complet"),
                        "questions": fiche.questions, "erreurs": fiche.erreurs, "premiers_reperes": reperes(fiche.projet)}
            if resultat["statut"] == "complet":
                validation = calcul(brut)
                if validation["statut"] != "calcule":
                    resultat = validation
        elif args.action == "calculer":
            resultat = calcul(brut, args.echeancier)
        elif args.action == "sensibilite":
            resultat = sensibilite(brut)
        elif len(fichiers) == 1:
            resultat = comparer_fiscalite(brut)
        else:
            scenarios = {str(path): indicateurs(calcul(charger(path))) for path in fichiers}
            resultat = {"statut": "comparaison", "objet": "Comparaison de dossiers, selon les hypothèses de chacun", "scenarios": scenarios}
    except (ValueError, OSError) as err:
        resultat = {"statut": "a_corriger", "motif": str(err)}
    if args.json:
        print(json.dumps(arrondir(resultat), ensure_ascii=False, indent=2, allow_nan=False))
    else:
        resume(resultat, args.echeancier)
    return 2 if (resultat["statut"] in ("a_corriger", "hors_perimetre")
                 or (resultat["statut"] == "a_completer" and args.action != "questions")) else 0


if __name__ == "__main__":
    sys.exit(main())
