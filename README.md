# Ma Rentabilité IA

Étudiez un investissement locatif en France avec votre propre assistant. Donnez-lui un prix et un loyer. Il peut déjà estimer le rendement annoncé, puis vous aider à chiffrer les frais, la vacance, le crédit et les impôts pour savoir combien vous devrez ajouter ou pourrez retirer chaque mois.

## Commencer avec son IA

Téléchargez le dépôt avec **Code → Download ZIP** et décompressez-le, ou clonez-le. Ouvrez le dossier dans Codex, Claude Code ou un autre assistant capable de lire des fichiers et de lancer Python. Copiez ce message dans la conversation.

> Je regarde un appartement à 150 000 €, louable 950 € hors charges par mois. Aide-moi à savoir combien je devrai sortir de ma poche chaque mois. Pose-moi les questions qui changent le plus le résultat, deux ou trois à la fois. Je ne connais pas encore tous les chiffres. Compare les options fiscales qui correspondent à mon cas et indique ce qui pourrait changer la conclusion.

L’assistant suit [le guide d’accompagnement](AGENTS.md), crée une fiche dans `mes-projets/` et vous montre les hypothèses. Un zéro signifie que le montant est effectivement nul. Une case inconnue reste ouverte. Les calculs s’exécutent localement avec **Python 3.10 ou plus**, sans installation de bibliothèques, compte sur le site ni clé API. Le service d’IA que vous choisissez applique ses propres modalités de traitement des conversations. Utilisez des montants anonymisés pour travailler dans le dépôt.

**Dans un chat qui lit des pièces jointes**, transmettez le [guide d’accompagnement](AGENTS.md), la [fiche vierge](modele.json) et les [règles fiscales](docs/fiscalite.md). Il pourra conduire l’entretien. Pour retrouver les résultats au centime, donnez-lui aussi accès aux fichiers Python ou joignez la sortie JSON calculée sur votre ordinateur.

## Ce qu’un premier calcul peut vous apprendre

Lina, le cas fictif du guide, achète à 140 000 € et prévoit 1 050 € de loyer mensuel hors charges. Les frais, les travaux et le mobilier portent le coût d’acquisition à **171 000 €**. Avec 5 % de vacance, le rendement net d’exploitation atteint **5,26 %**. Les deux premiers mois sans loyer, le crédit et les impôts font pourtant ressortir un effort d’épargne moyen de **388,02 € par mois la première année**. [Dossier de Lina](exemples/lina.json) · [Calcul détaillé et hypothèses de revente](guide/01-calculs.md)

Dans le [cas de location nue](exemples/location-nue.json), une réserve de travaux de 400 € pèse sur la trésorerie. Les dépenses fiscalement déductibles sont renseignées séparément. À l’année 1, avec une tranche marginale de 30 %, l’impôt et les prélèvements estimés atteignent **3 766,56 € au micro-foncier** et **2 077,76 € au réel**. Le loyer, les charges et le crédit sont identiques dans les deux simulations. L’option au réel engage en principe le foyer pendant trois ans. [Hypothèses fiscales et sources](docs/fiscalite.md)

## Refaire les calculs

Depuis le dossier du dépôt, lancez les commandes ci-dessous. Sous Windows, `py -3` peut remplacer `python3`.

```sh
python3 renta.py calculer exemples/lina.json
python3 renta.py comparer exemples/location-nue.json
python3 renta.py comparer exemples/location-meublee.json
python3 renta.py sensibilite exemples/lina.json
```

| Besoin | Commande |
| --- | --- |
| Reprendre une fiche incomplète | `python3 renta.py questions mes-projets/projet.json` |
| Obtenir les flux annuels et l’échéancier mensuel | `python3 renta.py calculer exemples/lina.json --echeancier --json` |
| Comparer la fiscalité de la première année pour un même bien | `python3 renta.py comparer exemples/location-nue.json --json` |
| Comparer deux dossiers ou deux modes de location | `python3 renta.py comparer exemples/location-nue.json exemples/location-meublee.json` |
| Vérifier les résultats de référence | `python3 -m unittest discover -s tests` |

Pour commencer votre propre dossier, copiez `modele.json` dans `mes-projets/`. Ce répertoire est ignoré par Git. En ligne de commande, toutes les actions acceptent `--json`. La commande `questions` peut également lire un brouillon depuis l’entrée standard avec `-`.

## Ressources

| Pour… | Ouvrir… |
| --- | --- |
| Comprendre le rendement, le cash-flow, le point mort, le TRI ou la VAN | [Formules et conventions](docs/calculs.md) |
| Savoir quel chiffre renseigner et dans quelle unité | [Dictionnaire du dossier](docs/saisie.md) |
| Comparer location nue, meublée, SCI ou dispositif Jeanbrun | [Fiscalité française, version du 23 novembre 2026](docs/fiscalite.md) |
| Retrouver le guide et ses huit fiches pratiques | [Guide de ma-rentabilite.fr](guide/README.md) |
| Chercher un exemple sur le crédit, la copropriété, le DPE ou la revente | [99 articles et 23 jeux de formules du blog](articles/README.md) |
| Tester d’autres situations | [Meublé de tourisme](exemples/tourisme.json) · [SCI à l’IS](exemples/sci-is.json) · [Jeanbrun](exemples/jeanbrun.json) |

Le guide et les articles proviennent de ma-rentabilite.fr. Vous pouvez télécharger ce dépôt et l’utiliser avec l’assistant de votre choix pour effectuer vos propres simulations. Les exemples du blog gardent leur date de publication. Le moteur et la fiche fiscale précisent les règles retenues pour les calculs actuels.
