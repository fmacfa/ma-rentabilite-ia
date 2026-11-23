# Tous les calculs de rentabilité locative

[← Revenir à l’accueil du dépôt](README.md) · [Lire le bilan de Lina](exemples/lina.md) · [Ouvrir son PDF](exemples/bilan-lina.pdf)

Combien faut-il apporter à l’achat, que reste-t-il chaque mois et que récupère-t-on à la revente ? Suivez Lina, qui achète un appartement à 140 000 € pour le louer meublé. Chaque rubrique donne une formule et montre comment y remplacer les inconnues par de vrais montants.

## Parcourir les calculs

- [Achat et apport](#achat-et-apport)
- [Crédit et assurance](#crédit-et-assurance)
- [Loyers et charges](#loyers-et-charges)
- [Rendements et trésorerie](#rendements-et-trésorerie)
- [Fiscalité des loyers](#fiscalité-des-loyers)
- [Revente et plus-value](#revente-et-plus-value)
- [VAN, TRI et fonds propres](#van-tri-et-fonds-propres)
- [Six projets chiffrés](#six-projets-chiffrés)
- [Sources pour préciser vos hypothèses](#sources-pour-préciser-vos-hypothèses)

## Achat et apport

Lina achète un appartement à 140 000 €. Elle emprunte pour couvrir une partie du prix, des travaux et du mobilier. Son premier calcul est le virement à prévoir pour boucler l’achat.

**Coût d’acquisition.** Prix + honoraires d’agence à ajouter + frais d’acte + travaux + mobilier + autres frais initiaux.

> 140 000 + 0 + 11 200 + 14 000 + 4 000 + 1 800 = **171 000 €**

**Coût initial avec la banque.** Acquisition + garantie + frais de dossier.

> 171 000 + 1 500 + 800 = **173 300 €**

**Fonds propres à verser.** Coût initial avec la banque − emprunt.

> 173 300 − 145 000 = **28 300 €**

Le compromis précise si les honoraires d’agence sont déjà compris dans le prix. Le décompte du notaire donne les frais d’acte à retenir pour le bien.

<details>
<summary>Estimer les frais d’acte et les émoluments par tranche</summary>

À défaut de décompte, le simulateur propose une provision de 7,5 % du prix en ancien ou de 2,5 % en neuf lorsque les droits réduits s’appliquent. Pour un achat classique dans l’ancien, le taux départemental permet d’affiner l’estimation. Voici un calcul indépendant du montant prévu par Lina.

**Émoluments hors taxe pour un prix de 140 000 €**

| Part du prix | Taux | Montant HT |
| --- | --- | --- |
| Premiers 6 500 € | 3,870 % | 251,55 € |
| 10 500 € suivants, jusqu’à 17 000 € | 1,596 % | 167,58 € |
| 43 000 € suivants, jusqu’à 60 000 € | 1,064 % | 457,52 € |
| 80 000 € au-delà de 60 000 € | 0,799 % | 639,20 € |

Émoluments TTC = 1 515,85 × 1,20 = 1 819,02 €. Avec un taux départemental supposé de 5 %, les taxes estimées valent 140 000 × (5 % × 1,0237 + 1,2 % + 0,1 %) = 8 985,90 €. En ajoutant la provision du simulateur de 900 € pour les débours, on obtient **11 704,92 €**. Le département, le type de vente et les frais réels peuvent modifier ce montant.

[Notaires de France, frais d’acquisition](https://www.notaires.fr/fr/immobilier-fiscalite/financement/les-frais-dacquisition) · [Code de commerce, barème des émoluments](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000041684370/2026-04-28)

</details>

## Crédit et assurance

Le prêt de Lina porte sur 145 000 € à taux fixe de 3,5 % sur vingt ans. Une mensualité comprend les intérêts et le capital remboursé. L’assurance emprunteur s’y ajoute.

**Mensualité hors assurance.** Avec le capital *K*, le taux mensuel *i* et *n* mensualités amortissables, *M* = *K* × *i* / [1 − (1 + *i*)<sup>−n</sup>]. À taux nul, *M* = *K* / *n*.

> 145 000 × (0,035/12) / [1 − (1 + 0,035/12)<sup>−240</sup>] ≈ **840,94 €**

**Première échéance.** Intérêts = 145 000 × 0,035 / 12 = 422,92 €. Capital remboursé = 418,02 €. Nouveau solde = **144 581,98 €**. Les intérêts du deuxième mois portent sur ce solde.

**Assurance et annuité.** Prime fixe = 360 / 12 = 30 € par mois. Mensualité assurée = **870,94 €**. La somme des douze échéances donne **10 451,30 €** en année 1. Les calculs conservent les centimes non affichés.

**Coût du crédit à terme.** Intérêts courus + primes d’assurance + frais de banque sur la durée complète.

> 56 825,98 + 7 200 + 2 300 = **66 325,98 €**

<details>
<summary>Différé, assurance sur le capital et durée restante</summary>

Pendant un différé d’intérêts seuls, on paie intérêts et assurance et le capital reste stable. Pendant un différé capitalisé de *d* mois, l’assurance est payée et les intérêts s’ajoutent au capital. Le nouveau solde est *K* × (1 + *i*)<sup>d</sup>. Les mensualités suivantes amortissent ce solde sur la durée totale moins les mois de différé.

Sur 100 000 € à 3,2 %, trois mois d’intérêts seuls coûtent environ 266,67 € chacun, hors assurance. Avec capitalisation, le solde au bout de ces trois mois atteint 100 000 × (1 + 0,032/12)<sup>3</sup> = **100 802,14 €**.

Une assurance à 0,30 % du capital initial coûte 100 000 × 0,003 / 12 = 25 € par mois. Si le contrat l’assoit sur le capital restant dû, un solde de 80 000 € ramène la prime du mois à 20 €. Un forfait annuel se divise par douze.

</details>

## Loyers et charges

La vacance se répète au fil des relocations. Le délai initial couvre les mois avant le premier loyer, par exemple pendant les travaux. Lina prévoit les deux.

**Longue durée.** Loyer mensuel hors charges × 12 × (1 − taux de vacance).

> 1 050 × 12 × 95 % = **11 970 €** en année pleine

**Location à la nuit.** Prix par nuit × 365 × taux d’occupation. Le nombre de nuits est une moyenne de projection.

> 85 × 365 × 45 % = **13 961,25 €** pour le meublé de tourisme

**Annexes et gestion.** Les recettes annexes mensuelles, par exemple un parking loué séparément, se multiplient par douze. La gestion porte sur les loyers effectivement encaissés hors annexes. Dans le cas touristique, 13 961,25 × 18 % = **2 513,03 €**.

**Mois ouverts.** Année 1 de Lina avec deux mois de travaux, 11 970 × 10 / 12 = **9 975 €**. On applique le même prorata aux annexes, à la gestion et aux charges refacturées. Les charges fixes du bailleur courent pendant les travaux.

**Dépenses du bailleur.** Taxe foncière nette des sommes récupérées + copropriété à sa charge + assurance propriétaire + entretien et autres postes.

> 1 200 + 900 + 180 + 700 = **2 980 €** pour Lina

**Net d’exploitation.** Loyers et annexes − gestion − dépenses du propriétaire. Une charge récupérée à prix coûtant entraîne une entrée et une sortie égales. En meublé, elle compte aussi dans les recettes fiscales.

> 9 975 − 0 − 2 980 = **6 995 €** en année 1. À douze mois ouverts, 11 970 − 2 980 = **8 990 €**.

<details>
<summary>Projeter les années suivantes avec des hausses différentes</summary>

En année *t*, les recettes et la gestion sont multipliées par (1 + hausse annuelle des loyers)<sup>t−1</sup> × mois ouverts / 12. Les charges fixes suivent leur propre indice (1 + hausse annuelle des charges)<sup>t−1</sup>. Chez Lina, avec +1,5 % et +2 %, le net de la deuxième année vaut 11 970 × 1,015 − 2 980 × 1,02 = **9 109,95 €**. Une indexation est une hypothèse à confronter au bail, à l’indice et aux règles locales. [Service Public, révision du loyer](https://www.service-public.gouv.fr/particuliers/vosdroits/F13723)

</details>

## Rendements et trésorerie

Les trois premiers rendements décrivent le bien en année pleine, indépendamment de sa dette. Pour budgéter le premier virement mensuel, Lina repart des dix mois effectivement ouverts.

Pour un premier tri à partir d’une annonce, loyer mensuel hors charges × 12 / prix affiché donne un brut rapide. Chez Lina, 1 050 × 12 / 140 000 = **9,00 % sur le prix seul**. Dès que les travaux et frais sont connus, les rendements ci-dessous rapportent le loyer au coût complet d’acquisition.

**Le bien de Lina, pour 171 000 € investis dans l’acquisition**

| Indicateur | Calcul |
| --- | --- |
| Rendement brut théorique | Loyers à pleine occupation et annexes / acquisition = 12 600 / 171 000 = **7,37 %**. |
| Rendement brut effectif | Recettes avec vacance / acquisition = 11 970 / 171 000 = **7,00 %**. |
| Rendement net d’exploitation | Net stabilisé / acquisition = 8 990 / 171 000 = **5,26 %**. |
| Rendement après impôt, année 1 | (Net d’exploitation de l’année − impôt locatif) / acquisition = (6 995 − 1 200) / 171 000 = **3,39 %**. |

**Trésorerie avant impôt.** Net d’exploitation − dette annuelle assurance comprise.

> 6 995 − 10 451,30 = **−3 456,30 €**

**Trésorerie après impôt.** Trésorerie avant impôt − impôt locatif. Avec 1 200 € d’impôt supposé, Lina verse **388,02 € par mois en moyenne** depuis son épargne.

> (−3 456,30 − 1 200) / 12 = −388,02 €

**Rendement sur l’apport (cash-on-cash).** Trésorerie de l’année 1 / fonds propres initiaux = −4 656,30 / 28 300 = **−16,45 %**. Cet indicateur reste indéfini avec un apport nul.

**Couverture de la dette (DSCR).** Net d’exploitation / annuité assurée = 6 995 / 10 451,30 = **0,67**. Les loyers nets couvrent environ 67 % des échéances de l’année. Le ratio suppose un emprunt.

**Recette mensuelle au point mort.** (Charges + gestion + impôt retenu + dette assurée) / mois ouverts. Avec la gestion et l’impôt du scénario, (2 980 + 0 + 1 200 + 10 451,30) / 10 = **1 463,13 €** à encaisser par mois ouvert. Sans mois ouvert, le point mort mensuel est indéfini.

### Si le prix ou le loyer change

Chaque variante modifie une seule donnée. Pour un prix de départ de 140 000 €, les prix testés sont 126 000 et 112 000 €. Pour un loyer de 1 050 €, les loyers testés sont 945 et 840 € par mois. En tourisme, la baisse porte sur le tarif par nuit. Le montant emprunté, le taux de vacance ou d’occupation, le prix de sortie et les autres hypothèses saisis sont conservés. Les montants qui en dépendent sont recalculés.

**Effet sur le dossier de Lina, emprunt de 145 000 €**

| Variante | Rendement net | Effort mensuel en année 1 |
| --- | --- | --- |
| Projet initial | 5,26 % | 388,02 € |
| Prix d’achat −10 % | 5,73 % | 388,02 € |
| Prix d’achat −20 % | 6,29 % | 388,02 € |
| Loyer −10 % | 4,56 % | 471,15 € |
| Loyer −20 % | 3,86 % | 554,27 € |

À prix réduit de 10 %, les frais d’acte saisis en euros et l’impôt supposé de Lina gardent leur montant. Son apport descend à 14 300 € et son rendement devient 8 990 / 157 000 = 5,73 %. Une variante peut sortir du périmètre, par exemple si le crédit saisi dépasse le nouveau coût du projet. On peut alors modifier le financement pour étudier cette autre hypothèse.

## Fiscalité des loyers

Repères français pour les revenus 2026, vérifiés le 23 novembre 2026. Le bail, la détention, les autres recettes du foyer ou de l’activité, la résidence fiscale, la protection sociale et une option déjà exercée déterminent les régimes accessibles. Les projections conservent les règles et taux retenus.

[Impôt personnel](#de-la-base-imposable-à-limpôt-personnel) · [Location nue](#location-nue-micro-foncier-et-réel) · [Location meublée](#location-meublée-micro-bic-et-lmnp-réel) · [SCI](#sci-à-limpôt-sur-le-revenu-ou-à-limpôt-sur-les-sociétés) · [Jeanbrun](#déduction-jeanbrun-en-location-nue) · [Impôt déjà chiffré](#impôt-déjà-chiffré-ou-calcul-avant-impôt)

### De la base imposable à l’impôt personnel

En première estimation, impôt locatif = base imposable × (tranche marginale d’impôt sur le revenu + taux de prélèvements sociaux). Pour un bailleur résident relevant des prélèvements sur les revenus du patrimoine, les taux intégrés sont de **17,2 % en location nue** et **18,6 % en meublé**. Sur 1 000 € imposables en location nue à la tranche de 30 %, le coût estimé est 300 + 172 = **472 €**. [DGFiP, prélèvements sociaux des bailleurs](https://www.impots.gouv.fr/particulier/questions/je-donne-un-bien-en-location-dois-je-payer-des-prelevements-sociaux)

<details>
<summary>Quand le revenu traverse deux tranches</summary>

L’option au barème indicatif calcule l’impôt brut du foyer avec les loyers, puis retranche l’impôt brut sans les loyers. Pour chaque calcul, on divise le revenu par le nombre de parts, on taxe chaque tranche, puis on multiplie par les parts. Le barème publié en 2026 pour les **revenus 2025** sert ici d’hypothèse comparative.

Par part, les taux successifs sont 0 % jusqu’à 11 600 €, 11 % jusqu’à 29 579 €, 30 % jusqu’à 84 577 €, 41 % jusqu’à 181 917 €, puis 45 %. Pour une part, 29 000 € de revenu et 3 000 € de base supplémentaire, le supplément d’IR brut est 579 × 11 % + 2 421 × 30 % = **789,99 €**. En location nue, les prélèvements sociaux ajoutent 3 000 × 17,2 % = 516 €. La décote, le plafonnement des parts et les crédits d’impôt relèvent du calcul complet du foyer. [Service Public, barème de l’impôt sur le revenu](https://www.service-public.gouv.fr/particuliers/vosdroits/F1419)

</details>

### Location nue, micro-foncier et réel

Dans le [projet de location nue](exemples/location-nue.md), le loyer encaissé atteint 11 400 € par an. Le foyer n’a pas d’autres loyers et peut comparer les deux régimes pour une tranche marginale de 30 %.

**Micro-foncier.** Jusqu’à 15 000 € de recettes brutes foncières annuelles du foyer, sous conditions, l’abattement est de 30 %.

> 11 400 × 70 % = 7 980 € de base. Impôt estimé = 7 980 × 47,2 % = **3 766,56 €**.

**Réel foncier.** Recettes − charges fiscalement déductibles − gestion − intérêts payés − assurance d’emprunt − autres déductions admises. Une réserve de 400 € pour de futurs travaux figure dans le budget de trésorerie. Les dépenses déductibles justifiées s’élèvent ici à 2 000 €.

> 11 400 − 2 000 − 684 − 4 013,97 − 300 ≈ 4 402,03 € de base. Impôt estimé = **2 077,76 €**.

L’effort mensuel est de **335,68 € au micro** et de **194,95 € au réel** pour cette première année. Une option volontaire pour le réel engage en principe trois ans. [CGI, article 32](https://www.legifrance.gouv.fr/loda/article_lc/LEGIARTI000053544766/2026-11-01) · [DGFiP, location vide](https://www.impots.gouv.fr/particulier/location-vide-de-meubles)

<details>
<summary>Lorsque les déductions foncières dépassent les recettes</summary>

Le déficit lié aux intérêts excédant les recettes est reportable sur les revenus fonciers. La fraction due aux autres dépenses peut, sous conditions, s’imputer sur le revenu global dans la limite ordinaire de 10 700 €. Le surplus et la part liée aux intérêts peuvent se reporter pendant dix ans. La simulation affiche l’imputation globale possible séparément et démarre avec des reports nuls.

Exemple indépendant avec 8 000 € de recettes, 10 000 € d’intérêts et 12 000 € d’autres charges déductibles. Le déficit de 14 000 € comprend 2 000 € liés aux intérêts. Sur les 12 000 € restants, 10 700 € sont imputables sur le revenu global si les conditions sont remplies, et 1 300 € s’ajoutent aux 2 000 € reportables. Le maintien de la location et certains travaux énergétiques relèvent de conditions particulières. [BOFiP, imputation des déficits fonciers](https://bofip.impots.gouv.fr/bofip/4142-PGP.html/identifiant%3DBOI-RFPI-BASE-30-20-20250916)

</details>

### Location meublée, micro-BIC et LMNP réel

Les bénéfices industriels et commerciaux (BIC) tiennent compte des loyers et des charges refacturées. Pour les revenus 2026, on compare au seuil les recettes de l’année précédente ou de l’avant-dernière année. Une activité homogène doit respecter le seuil sur au moins l’une des deux années, sous réserve des autres conditions.

**Seuils et abattements du micro-BIC en 2026**

| Type de location | Seuil | Abattement |
| --- | --- | --- |
| Meublé de longue durée | 83 600 € | 50 % |
| Tourisme classé | 83 600 € | 50 % |
| Tourisme non classé | 15 000 € | 30 % |

L’abattement minimal de 305 € s’applique une fois à l’activité. Pour des recettes *R*, la base est le maximum entre zéro et *R* − max(305 €, *R* × abattement). S’il existe d’autres biens, la base supplémentaire du projet est la différence entre la base avec et sans ce bien. [BOFiP, seuils 2026–2028](https://bofip.impots.gouv.fr/bofip/14069-PGP.html/identifiant%3DBOI-BAREME-000044-20260819) · [CGI, article 50-0](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006302439/2026-07-26)

**Meublé de longue durée au micro.** Recettes = 9 792 € de loyers + 600 € de charges refacturées. Base = 10 392 × 50 % = 5 196 €. À la tranche de 30 %, impôt estimé = 5 196 × 48,6 % = **2 525,26 €**.

**Tourisme non classé au micro.** Recettes = 13 961,25 €. Base = 13 961,25 × 70 %. À la tranche de 11 %, impôt estimé = 13 961,25 × 70 % × (11 % + 18,6 %) = **2 892,77 €**.

**Loueur en meublé non professionnel (LMNP) au réel.** Recettes − dépenses déductibles − intérêts payés − assurance − amortissement admis. Le terrain est exclu du plan d’amortissement. Dans le meublé de longue durée, les 600 € de charges refacturées apparaissent de chaque côté.

> 10 392 − 2 600 − 3 463,09 − 3 100 = 1 228,91 € de base. Impôt estimé = **597,25 €**.

En LMNP, l’amortissement admis est plafonné par le bénéfice disponible avant amortissement. Avec 2 000 € disponibles et une dotation de 3 100 €, 2 000 € sont déduits et 1 100 € sont différés. Les amortissements différés et les déficits d’exploitation suivent deux stocks distincts. Pour ces déficits, le report sur les bénéfices de même activité est limité à dix ans. [DGFiP, régimes du loueur en meublé](https://www.impots.gouv.fr/particulier/les-regimes-dimposition)

Au-delà de 23 000 € de recettes, le régime social du tourisme demande un calcul de cotisations. En longue durée, le passage à la location meublée professionnelle dépend également des autres revenus d’activité du foyer. L’affiliation à un régime d’assurance maladie étranger peut aussi changer le calcul. [Service Public, cotisations et statut du loueur](https://www.service-public.gouv.fr/particuliers/vosdroits/F34102)

### SCI à l’impôt sur le revenu ou à l’impôt sur les sociétés

En SCI à l’IR louant nu, le dossier d’un associé porte sur sa quote-part du prix, de la dette, des loyers et des charges. Un bénéfice foncier de 10 000 € pour une participation de 40 % donne 4 000 € imposables pour l’associé, soit 4 000 × 47,2 % = **1 888 €** sous les hypothèses précédentes. L’accès au micro-foncier en présence d’une SCI dépend notamment de la détention directe d’un bien nu. [CGI, article 32](https://www.legifrance.gouv.fr/loda/article_lc/LEGIARTI000053544766/2026-11-01)

En SCI à l’IS, le bénéfice de la société tient compte des dépenses déductibles, des frais d’emprunt et des amortissements. L’IS vaut 25 % au taux normal. Si les conditions du taux réduit sont réunies, il vaut 15 % sur les premiers 42 500 € de bénéfice d’un exercice de douze mois, puis 25 %. [Service Public Entreprendre, taux de l’IS](https://entreprendre.service-public.gouv.fr/vosdroits/F23575)

**Résultat et IS de la société.** 11 059,20 de loyers − 2 100 de charges − 3 800 d’amortissements = 5 159,20 € de bénéfice. IS à 15 % = **773,88 €**. La société conserve 11 059,20 − 2 100 − 773,88 = **8 185,32 €** de trésorerie avant dividende.

**Distribution à l’associé.** Si la société distribue 2 000 €, il lui reste 6 185,32 €. Pour un associé résident au prélèvement forfaitaire unique ordinaire, 2 000 × 31,4 % = 628 € d’impôt et **1 372 €** nets reçus. [Service Public Entreprendre, fiscalité des dividendes](https://entreprendre.service-public.gouv.fr/vosdroits/F32963)

Dans la projection ordinaire à l’IS, un déficit se reporte sur des bénéfices ultérieurs. L’imputation annuelle est plafonnée à 1 million d’euros, majoré de 50 % du bénéfice dépassant ce seuil. Une vente par la SCI part de la valeur nette comptable pour déterminer le résultat de cession. L’impôt de cession chiffré pour la société se renseigne dans le bilan. [DGFiP, déclaration d’IS 2026](https://www.impots.gouv.fr/sites/default/files/formulaires/2065-sd/2026/2065-sd_5381.pdf)

### Déduction Jeanbrun en location nue

Le dispositif Relance logement vise certaines opérations réalisées du 21 février 2026 au 31 décembre 2028, en logement collectif neuf ou ancien réhabilité. La location nue à titre de résidence principale s’accompagne d’un engagement de neuf ans. Il faut vérifier dates, zone, loyer, ressources du locataire et, en ancien, les travaux exigés, dont le seuil de 30 % lorsqu’il s’applique. [Service Public, éligibilité et plafonds](https://www.service-public.gouv.fr/particuliers/vosdroits/F39735)

Déduction annuelle = le minimum entre l’assiette éligible hors terrain × taux × fraction d’année, le plafond restant du foyer et l’assiette restant à amortir. La part de terrain est fixée à 20 %. Dans l’ordre intermédiaire, social, très social, les taux sont 3,5 %, 4,5 %, 5,5 % en neuf et 3 %, 3,5 %, 4 % en ancien éligible. Le plafond de 8 000 € peut atteindre 10 000 ou 12 000 € sous conditions. [Loi de finances pour 2026, article 47](https://www.legifrance.gouv.fr/eli/loi/2026/2/19/CPPX2524517L/jo/article_47)

> **Projet neuf à loyer intermédiaire.** Une assiette de 220 000 × 80 % = 176 000 €, dix mois la première année et un plafond disponible de 8 000 € donnent une déduction de 176 000 × 3,5 % × 10 / 12 = 5 133,33 €. La base foncière vaut 7 800 − 2 050 − 5 133,33 = 616,67 €. À 47,2 %, l’impôt de l’année est estimé à **291,07 €**.

### Impôt déjà chiffré ou calcul avant impôt

Un montant annuel documenté peut servir pour un cas particulier. Lina suppose 1 200 € en année 1. Ce montant peut rester constant ou évoluer à partir de l’année 2 en proportion du net d’exploitation, sur une référence stabilisée positive. Dans son scénario, 1 200 × 9 109,95 / 8 990 = **1 216,01 €** en année 2. Si l’impôt est inconnu, le bilan peut présenter le flux avant impôt en laissant le résultat après impôt à compléter.

## Revente et plus-value

Lina vend au bout de dix ans, après la dernière échéance de l’année. L’argent effectivement disponible à cette date entre dans le calcul du rendement sur la durée.

**Produit net de la vente.** Prix de vente − frais payés par le vendeur − capital restant dû − indemnité de remboursement anticipé − impôt de cession. Le montant peut être négatif.

> 190 000 − 9 500 − 85 041,64 − 0 − 5 000 = **90 458,36 €**.

**Indemnité de remboursement anticipé.** En cas de remboursement intégral, le plafond ordinaire est le plus petit de six mois d’intérêts sur le capital remboursé et de 3 % du capital restant dû. Pour Lina, min(85 041,64 × 3,5 % / 2, 85 041,64 × 3 %) = **1 488,23 €** de plafond. Son contrat fictif prévoit 0 €. [Code de la consommation, article R313-25](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000032807572/)

**Plus-value immobilière d’un particulier.** Plus-value brute retenue = maximum entre zéro et prix de cession − frais de cession fiscalement admis − prix d’acquisition fiscal majoré + amortissements à reprendre. Exonérations, forfaits d’acquisition ou de travaux, quote-part et amortissements déduits sont à vérifier avec le notaire. Le prix fiscal peut différer du budget d’acquisition.

Pour certaines ventes d’immeubles loués en LMNP au réel à partir du 15 février 2025, les amortissements admis en déduction sur l’immeuble augmentent la plus-value. Des exceptions existent. Une cession après une déduction Jeanbrun demande aussi de vérifier le montant à reprendre. Le dossier accepte le montant de reprise vérifié ou l’impôt de cession directement chiffré. [DGFiP, cession d’un logement meublé](https://www.impots.gouv.fr/particulier/questions/je-vends-un-bien-immobilier-donne-en-location-meublee-comment-se-calcule-la) · [Service Public, dispositif Jeanbrun](https://www.service-public.gouv.fr/particuliers/vosdroits/F39735)

<details>
<summary>Abattements par année de détention</summary>

On compte les années de détention entièrement révolues. L’impôt d’un cédant ordinaire est égal à 19 % de sa base d’impôt sur le revenu (IR) + 17,2 % de sa base de prélèvements sociaux (PS) + l’éventuelle surtaxe. Chaque base est la plus-value brute multipliée par 1 − son abattement cumulé.

**Abattement supplémentaire pour chaque année révolue**

| Durée | Pour l’IR | Pour les PS |
| --- | --- | --- |
| Jusqu’à cinq ans | 0 % | 0 % |
| 6ᵉ à 21ᵉ année | 6 % par an | 1,65 % par an |
| 22ᵉ année | 4 % (exonération atteinte) | 1,60 % |
| 23ᵉ à 30ᵉ année | Exonération acquise | 9 % par an (exonération à 30 ans) |

À dix ans révolus, pour une plus-value brute de 40 000 €, il y a cinq années d’abattement. La base IR est 40 000 × (1 − 5 × 6 %) = 28 000 €. La base PS est 40 000 × (1 − 5 × 1,65 %) = 36 700 €. Impôt total = 28 000 × 19 % + 36 700 × 17,2 % = **11 632,40 €**. [Service Public, plus-value immobilière](https://www.service-public.gouv.fr/particuliers/vosdroits/F10864)

</details>

<details>
<summary>Surtaxe des plus-values immobilières élevées et lissage</summary>

Dans le cas ordinaire d’un cédant unique, la surtaxe s’applique lorsque la base IR après abattements dépasse 50 000 €. Pour une base *B* dans une ligne du tableau, la surtaxe = taux × *B* − coefficient × max(0, seuil bas + 10 000 − *B*). Le lissage intervient sur les premiers 10 000 € de chaque ligne.

**Calcul sur la base IR du cédant**

| Base IR, borne basse exclue | Taux | Coefficient de lissage |
| --- | --- | --- |
| 50 000 à 100 000 € | 2 % | 5 % |
| 100 000 à 150 000 € | 3 % | 10 % |
| 150 000 à 200 000 € | 4 % | 15 % |
| 200 000 à 250 000 € | 5 % | 20 % |
| Au-delà de 250 000 € | 6 % | 25 % |

Exemple avec 55 000 € de plus-value imposable avant tout abattement de durée. Surtaxe = 55 000 × 2 % − (60 000 − 55 000) × 5 % = **850 €**. Impôt total = 10 450 d’IR + 9 460 de PS + 850 = **20 760 €**. [CGI, article 1609 nonies G](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000048806252/2026-07-09)

</details>

## VAN, TRI et fonds propres

Le premier flux est l’apport sorti de la poche de Lina. Chaque flux suivant est la trésorerie d’une année. Le dernier reçoit aussi le produit de vente. Sans prix de vente, le bilan présente les flux d’exploitation et leur cumul. Le dossier de Lina cumule **−23 771,60 €** d’exploitation sur dix ans, hors revente et hors apport.

> **Le flux de la dixième année.** La vente rapporte 90 458,36 € et l’exploitation de l’année coûte 1 677,80 €. Avec les montants avant arrondi, le dernier flux vaut **88 780,57 €**. C’est cette somme qu’on actualise à dix ans.

<details>
<summary>Voir les onze flux utilisés pour le calcul, de l’achat à la vente</summary>

- Achat**−28 300,00 €**
- Année 1**−4 656,30 €**
- Année 2**−2 557,36 €**
- Année 3**−2 452,12 €**
- Année 4**−2 345,57 €**
- Année 5**−2 237,68 €**
- Année 6**−2 128,45 €**
- Année 7**−2 017,86 €**
- Année 8**−1 905,90 €**
- Année 9**−1 792,55 €**
- Année 10, vente comprise**+88 780,57 €**

</details>

**Valeur actuelle nette (VAN).** Au taux annuel choisi *r*, additionner chaque flux de l’année *t* divisé par (1 + *r*)<sup>t</sup>. Une VAN positive mesure le gain supplémentaire en euros d’aujourd’hui par rapport au taux choisi.

> −28 300 − 4 656,30 / 1,05 − … + 88 780,57 / 1,05<sup>10</sup> = **8 180,35 €** au taux de 5 %.

**Taux de rendement interne (TRI).** C’est le taux annuel pour lequel la VAN de tous ces flux vaut zéro. La solution pour Lina est **7,03 %**, arrondie. Le moteur calcule le TRI lorsque les flux changent de signe une seule fois et qu’une racine peut être trouvée.

**Multiple des fonds investis (MOIC).** Somme des flux positifs / somme des flux négatifs en valeur absolue. L’apport initial et les années qui demandent de l’épargne entrent dans le dénominateur.

> 88 780,57 / 50 393,80 ≈ **1,76 fois** les apports.

**Retour total (ROI).** (Distributions − contributions) / contributions. Pour Lina, (88 780,57 − 50 393,80) / 50 393,80 = **76,17 % sur dix ans**. Le MOIC et le ROI supposent un montant d’apports positif.

**TRI modifié.** On capitalise les flux positifs jusqu’à la fin et on actualise les flux négatifs au jour de l’achat. La simulation retient 4 % pour le réinvestissement et le financement. Sur *n* années, le TRI modifié = (valeur finale des entrées / valeur actuelle des sorties)<sup>1/n</sup> − 1.

> (88 780,57 / 47 033,38)<sup>1/10</sup> − 1 = **6,56 %**.

Les hausses de loyer de 1,5 %, de charges de 2 % et l’évolution de l’impôt à partir de l’année 2 ont été reconstituées pour reproduire l’exemple du guide. À revenus, charges et impôt constants, le même projet donne un TRI de 6,20 % et une VAN de 4 783,74 €. [Ouvrir le bilan complet de Lina](exemples/lina.md)

## Six projets chiffrés

Chaque fiche s’ouvre ici, sur GitHub. Votre IA peut reprendre les hypothèses de l’exemple et les remplacer par vos chiffres.

| Exemple | Résultat du cas fictif |
| --- | --- |
| [Lina, dix ans avec un crédit](exemples/lina.md) | 388,02 € d’effort mensuel en année 1. TRI de 7,03 % après la revente. |
| [Location nue](exemples/location-nue.md) | À 1 000 € de loyer et 5 % de vacance, l’impôt au réel atteint 2 077,76 € en année 1. |
| [Meublé de longue durée](exemples/location-meublee.md) | Après impôt, la trésorerie passe de −114,49 €/mois au micro à +46,17 €/mois au réel. |
| [Tourisme non classé](exemples/tourisme.md) | À 85 € la nuit et 45 % d’occupation, le flux après impôt est de 437,95 €/mois. |
| [SCI à l’IS](exemples/sci-is.md) | 8 185,32 € de trésorerie avant distribution. Pour 2 000 € distribués, l’associé reçoit 1 372 €. |
| [Logement neuf sous Jeanbrun](exemples/jeanbrun.md) | Dix mois loués, 5 133,33 € de déduction et 454,91 € de flux mensuel après impôt en année 1. |

## Sources pour préciser vos hypothèses

Une formule indique comment calculer. Les justificatifs du projet donnent les montants à utiliser. Retrouvez les sources primaires, les conditions et un exemple pour chaque décision dans les [fiches de calcul vérifiées](articles/README.md).
