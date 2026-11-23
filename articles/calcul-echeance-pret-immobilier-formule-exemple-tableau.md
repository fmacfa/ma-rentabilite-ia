# Comment calculer l’échéance de votre prêt immobilier ?

Publié le 2025-12-30 sur ma-rentabilite.fr. [Article d’origine](https://ma-rentabilite.fr/article/calcul-echeance-pret-immobilier-formule-exemple-tableau)

Que vous prépariez une offre d’achat ou que vous compariez des banques, savoir faire le **calcul d’échéance de prêt immobilier** vous permet de vérifier la cohérence des propositions. Voici la **formule** officielle des prêts amortissables, un **exemple simple** et un **mini tableau de calcul** pour comprendre d’où viennent les chiffres d’une **mensualité de prêt**.

### L’avis de ma-rentabilite.fr

Pour comparer deux offres, ne regardez pas que la mensualité : vérifiez le **TAEG** (inclut intérêts, assurance, frais), la **modularité** des échéances, et les **pénalités** de remboursement anticipé. Une mensualité confortable aujourd’hui doit rester supportable si vos charges grimpent (énergie, copro) ou en cas de vacance si investissement.

## 1) La formule d’annuité (mensualité constante)

La plupart des crédits habitat en France sont des *prêts amortissables à échéances constantes*. La mensualité hors assurance se calcule avec la formule d’annuité :

Formule

**M = K × \, \dfrac{i}{1 - (1 + i)^{-n}}**

- **K** = capital emprunté (euros)
- **i** = taux *périodique* (taux annuel / 12)
- **n** = nombre total d’échéances (durée en mois)
- **M** = mensualité hors assurance

Remarque : si votre taux affiché est un taux nominal annuel de 4 %, alors *i* = 0,04 / 12 = 0,003333… (soit 0,3333 % par mois).

## 2) Exemple simple, pas à pas

Supposons un emprunt **K = 200 000 €**, à **4,0 % nominal annuel**, sur **20 ans** (soit **n = 240** mensualités). Calculons la mensualité hors assurance.

1. Taux mensuel : *i* = 0,04 / 12 = 0,003333…
2. Facteur d’actualisation : ((1 + i)^{-n} = (1{,}003333)^{-240}) ≈ 0,4496
3. Dénominateur : (1 - (1 + i)^{-n} ≈ 1 - 0{,}4496 = 0{,}5504)
4. Quotient : (i / [1 - (1+i)^{-n}] ≈ 0{,}003333 / 0{,}5504 ≈ 0{,}006056)
5. **M** = (200 000 × 0{,}006056 ≈ **1 211,2 €**) (hors assurance)

Si l’assurance emprunteur coûte par exemple **0,20 %/an** de capital initial (tarification au capital initial *à la française*), cela représente ~**33 €/mois** par tranche de 200 000 € (0,20 % × 200 000 / 12). La **mensualité totale** serait donc ≈ **1 244 €**.

## 3) Mini tableau de calcul (1re année)

Le principe de l’amortissement : au début, la part d’intérêts est élevée puis décroît, tandis que la part de capital remboursé augmente. Voici les 6 premiers mois de notre exemple.

| Échéance | Capital restant dû début | Intérêts | Amortissement | Mensualité (hors assur.) | CRD fin |
| --- | --- | --- | --- | --- | --- |
| M1 | 200 000 € | 666,67 € | 544,53 € | 1 211,20 € | 199 455,47 € |
| M2 | 199 455,47 € | 664,85 € | 546,35 € | 1 211,20 € | 198 909,12 € |
| M3 | 198 909,12 € | 663,03 € | 548,17 € | 1 211,20 € | 198 360,95 € |
| M4 | 198 360,95 € | 661,20 € | 560,00 € | 1 211,20 € | 197 800,95 € |
| M5 | 197 800,95 € | 659,34 € | 551,86 € | 1 211,20 € | 197 249,09 € |
| M6 | 197 249,09 € | 657,50 € | 553,70 € | 1 211,20 € | 196 695,39 € |

Arrondis présentés à 2 décimales pour la lisibilité. Les chiffres exacts peuvent varier selon les conventions d’arrondi de la banque.

## 4) Où placer l’assurance et les frais ?

- **Assurance emprunteur** : elle s’ajoute à la mensualité. Selon le contrat, elle peut être calculée sur le *capital initial* (prime fixe) ou sur le *capital restant dû* (prime dégressive). Intégrez-la pour estimer la mensualité *totale*.
- **Frais de garantie et de dossier** : inclus dans le TAEG, ils n’entrent pas dans la formule de M mais impactent le coût global.
- **TAEG** : indicateur de comparaison, il agrège taux, assurance et frais (selon périmètre légal).

## 5) Variantes utiles : résoudre à l’envers

Vous pouvez inverser la formule selon votre besoin :

- **Capital empruntable** pour une mensualité cible *M* : (K = M × dfrac{1 - (1+i)^{-n}}{i})
- **Durée** pour un couple *K*, *M* : (n = -\dfrac{ln(1 - iK/M)}{\ln(1+i)})

Pratique pour caler votre projet à une mensualité « confort ».

## 6) Conseils pratiques

- **Stress-testez** votre mensualité avec +0,5 à +1 point de taux (utile si vous n’êtes pas encore financé).
- Gardez un **matelas de sécurité** (3–6 mois d’échéances) pour absorber les imprévus.
- Regardez la **modularité** (baisse/hausse temporaire de mensualité), le **différé** et les **IRA** (indemnités de remboursement anticipé).

## FAQ express

- **Le simulateur prêt immobilier** des banques utilise-t-il la même formule ? Oui, avec leurs conventions d’arrondi et l’assurance intégrée.
- **Puis-je inclure l’assurance dans la formule ?** On l’additionne généralement à la mensualité calculée, selon sa méthode de tarification.
- **Pourquoi deux offres avec le même taux donnent des mensualités différentes ?** Assurance, frais, dates de valeur et arrondis expliquent les écarts.

## Conclusion

Retenez la logique : la **mensualité** dépend du **capital**, du **taux périodique** et du **nombre d’échéances**. Avec la formule d’annuité, vous vérifiez vos chiffres et comparez mieux les offres. Pour trancher, regardez la mensualité *totale* (assurance comprise) et le **TAEG**, pas seulement le taux nominal.
