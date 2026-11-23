# Ma Rentabilité IA

![Une main tient une clé devant la fenêtre ouverte d’un appartement français, en linogravure bleu encre.](docs/images/couverture-locative.webp)

**Après le crédit, les charges et l’impôt, que restera-t-il du loyer ?** Partez d’une annonce en France et des chiffres que vous connaissez. Votre IA vous aide à compléter le budget, à comparer vos options et à garder un bilan détaillé en PDF.

[Exemple de bilan en PDF](exemples/bilan-lina.pdf) · [Tous les calculs](CALCULS.md) · [Sources vérifiées](articles/README.md)

## Commencer avec mon IA

Envoyez [le lien de ce guide](https://github.com/fmacfa/ma-rentabilite-ia) à **ChatGPT, Claude, Codex** ou votre IA habituelle. Vous pouvez copier le message ci-dessous, puis ajouter le prix et le loyer du bien.

```text
Étudie mon projet avec moi.
https://github.com/fmacfa/ma-rentabilite-ia

Pose-moi les questions utiles.
Détaille tous mes calculs
et donne-moi le bilan en PDF.
```

1. **Décrivez le bien.** L’IA part de vos chiffres et vous indique où trouver ceux qui manquent, par exemple l’assurance sur l’offre de prêt.
2. **Testez ce qui vous fait hésiter.** « Et si je louais 100 € moins cher ? » ou « Quels régimes fiscaux puis-je comparer ? » Demandez l’écart en euros et la source de la règle.
3. **Repartez avec votre bilan.** Retrouvez les hypothèses, les opérations et les résultats année par année dans la conversation. L’IA peut joindre le PDF ou vous donner un lien pour le télécharger.

<details>
<summary>Mon IA ne peut pas ouvrir le lien GitHub</summary>

Copiez le texte du guide d’accompagnement dans votre conversation ou joignez-le comme fichier, puis décrivez votre projet. [Ouvrir le guide en texte brut](https://raw.githubusercontent.com/fmacfa/ma-rentabilite-ia/main/assistant.md) · [Le lire sur GitHub](assistant.md)

</details>

## Exemple · Le projet de Lina

> **Lina** — « J’ai trouvé un appartement à 140 000 € que je pourrais louer meublé 1 050 € par mois. Combien devrai-je sortir de ma poche ? »
>
> **Son IA** — « Quelle mensualité, assurance comprise, figure sur l’offre de prêt ? Et combien de mois s’écouleront avant le premier loyer ? »

Dans cet exemple fictif, Lina rembourse **870,94 € par mois**. Elle prévoit deux mois de travaux, puis 5 % de vacance locative. Elle compte **2 980 € de charges** et retient **1 200 € d’impôt** pour la première année.

[![Budget de Lina en première année. En moyenne chaque mois, 831,25 € encaissés et 1 219,27 € déboursés, soit 388,02 € à apporter. Ouvrir le bilan détaillé.](docs/images/budget-lina.png)](exemples/lina.md)

Lina engage **28 300 € à l’achat**, puis apporte **388,02 € par mois en moyenne** la première année. Pendant les travaux, la mensualité du prêt est déjà due et aucun loyer ne rentre.

**Et si le loyer baisse de 10 % ?** À 945 € de loyer, l’effort passe à **471,15 € par mois**. Si Lina s’était fixé une enveloppe de 400 €, il lui manquerait alors **71,15 € par mois en moyenne**.

**[Ouvrir le bilan de Lina en PDF · 11 pages](exemples/bilan-lina.pdf)** · [Lire les calculs sur GitHub](exemples/lina.md)

<details>
<summary>Refaire le calcul de Lina en quatre lignes</summary>

| Première année | Opération | Résultat |
| --- | --- | ---: |
| Loyers encaissés | 1 050 € × 10 mois ouverts × 95 % | 9 975,00 € |
| Revenu après charges | 9 975 € − 2 980 € | 6 995,00 € |
| Trésorerie après crédit et impôt | 6 995 € − 10 451,30 € − 1 200 € | −4 656,30 € |
| Effort d’épargne mensuel moyen | Déficit annuel avant arrondi / 12 | **388,02 €** |

Avant arrondi, l’effort annuel est de 4 656,2991 €, soit 388,0249 € par mois. Le bilan complet donne les 240 échéances du prêt et suit le projet jusqu’à la revente en année 10.

</details>

## Quel exemple ressemble à votre projet ?

| Projet | Question étudiée dans le bilan |
| --- | --- |
| [Location nue](exemples/location-nue.md) | Avec 1 000 € de loyer par mois, quel impôt au micro-foncier et au réel ? |
| [Meublé de longue durée](exemples/location-meublee.md) | Pourquoi le même logement donne-t-il −114,49 € par mois au micro et +46,17 € au réel ? |
| [Meublé de tourisme](exemples/tourisme.md) | À 85 € la nuit et 45 % d’occupation, combien reste-t-il sur un an ? |
| [SCI à l’IS](exemples/sci-is.md) | Sur 2 000 € de dividendes distribués, combien l’associé reçoit-il ? |
| [Location sous Jeanbrun](exemples/jeanbrun.md) | Quelle déduction retenir si le logement est loué dix mois la première année ? |

## Vérifier un chiffre

- **[Tous les calculs](CALCULS.md)** pour refaire une mensualité, retrouver un rendement ou suivre les flux jusqu’à la revente.
- **[Les 11 fiches vérifiées](articles/README.md)** pour choisir le bon montant et retrouver la source officielle. Les règles fiscales portent sur les revenus 2026.
- **[Le guide pratique](guide/README.md)** pour approfondir un sujet ou préparer une visite.

Le lien personnel de votre bilan contient les chiffres du projet. Toute personne à qui vous le transmettez pourra les lire.
