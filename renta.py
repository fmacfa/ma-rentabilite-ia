#!/usr/bin/env python3
"""Assistant de simulation locative. Exécuter « python3 renta.py --help »."""
import argparse
import json
from pathlib import Path
import sys

from moteur.api import arrondir, calcul, comparer_fiscalite, indicateurs, questions, reperes, sensibilite
from moteur.saisie import lire

RACINE = Path(__file__).resolve().parent


def charger(chemin):
    if chemin == "-":
        return json.load(sys.stdin)
    with Path(chemin).open(encoding="utf-8") as fichier:
        return json.load(fichier)


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
            resultat = questions(brut)
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
