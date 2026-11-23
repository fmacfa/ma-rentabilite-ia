# Conventions des calculs

Les montants sont calculés en euros sans arrondi intermédiaire. Le résumé affiche les centimes. La sortie JSON conserve jusqu’à six décimales. Chaque taux dont le nom se termine par `_pct` est un pourcentage. Les périodes annuelles comprennent douze mois. La vente intervient après la dernière échéance de l’horizon.

## Du prix au loyer encaissé

- **Coût d’acquisition** = prix + agence à ajouter + frais d’acte + travaux + mobilier + autres frais initiaux.
- **Fonds propres initiaux** = coût d’acquisition + garantie + dossier bancaire − capital emprunté. Une garantie récupérable peut être intégrée dans un scénario de sortie établi par l’utilisateur. Les frais sont comptés une seule fois.
- **Longue durée** = loyer mensuel hors charges × 12 × (1 − vacance). **Tourisme** = tarif par nuit × 365 × occupation. Les recettes annexes annuelles s’ajoutent aux deux.
- **Gestion** = loyers effectivement encaissés hors annexes × taux de gestion. Les mois avant mise en location réduisent loyers, annexes, gestion et charges refacturées. Les charges fixes du propriétaire restent dues. Les indexations sont composées à partir de la deuxième année.
- **Net d’exploitation** = loyers et annexes − frais de gestion − dépenses du propriétaire. Les charges récupérées à prix coûtant ont un effet de trésorerie nul.

Pour les frais d’acte, un décompte local est préférable. Les options historiques du site utilisent 2,5 % en neuf et 7,5 % en ancien à titre de provision. Avec un taux départemental renseigné en ancien, la convention du site combine droits départementaux, taxe communale, frais d’assiette et CSI, puis ajoute les émoluments TTC par tranches et 900 € de débours estimés. Une opération en neuf ne bénéficie des droits réduits que si ses conditions sont réunies. [Notaires de France, frais d’acquisition](https://www.notaires.fr/fr/immobilier-fiscalite/financement/les-frais-dacquisition)

## Crédit et effort d’épargne

Pour un taux mensuel `i = taux_pct / 1200`, un capital `K` et `n` échéances amortissables, la mensualité hors assurance est `K × i / (1 − (1+i)^−n)`. À taux nul elle vaut `K/n`. Les intérêts seuls laissent le capital stable pendant le différé. Un différé capitalisé augmente le solde avant le début de l’amortissement. L’assurance peut être fixe, calculée sur le capital initial ou sur le capital restant en début de mois. La dernière échéance solde le capital.

L’échéancier distingue intérêts courus et intérêts effectivement payés. En cas de différé capitalisé, le moteur fiscal prend les intérêts payés et l’assurance indiqués sur les échéances. Le traitement comptable ou le calendrier de déduction d’intérêts capitalisés peut nécessiter un montant fiscal personnalisé. Le coût du crédit à terme inclut intérêts courus, primes et frais de financement. L’indemnité de remboursement anticipé est calculée à part à la vente.

| Indicateur | Lecture |
| --- | --- |
| Rendement brut théorique | Loyers à pleine occupation et annexes / coût d’acquisition. |
| Rendement brut effectif | Recettes à occupation stabilisée / coût d’acquisition, avant charges et financement. |
| Rendement net d’exploitation | Net d’exploitation stabilisé / coût d’acquisition. La gestion est classée dans les charges. L’ancien site retranchait parfois la gestion directement des revenus utilisés pour le « brut ». |
| Cash-flow avant impôt | Net d’exploitation annuel − échéances assurance comprise. |
| Cash-flow après impôt | Cash-flow avant impôt − impôt locatif estimé. En SCI à l’IS, il s’agit de la trésorerie de la société avant distribution. En mode avant impôt, le champ après impôt reste vide. |
| Cash-on-cash an 1 | Trésorerie d’exploitation retenue de l’année 1 / fonds propres initiaux. Un apport nul rend le ratio indéfini. |
| DSCR an 1 | Net d’exploitation / service annuel de la dette assuré, avant fiscalité. |
| Recettes mensuelles au point mort | (Charges + gestion + impôt retenu + dette assurée) / mois ouverts en année 1. C’est une recette encaissée tous loyers et annexes confondus, aux hypothèses de gestion et d’impôt du dossier. |
| Effort d’épargne | Valeur absolue d’un cash-flow négatif. La moyenne annuelle divisée par douze peut masquer des mois plus tendus. |

## Revente et rentabilité sur la durée

Le produit de vente net est le prix diminué des frais du vendeur, du capital restant dû, de l’indemnité et de l’impôt de cession. **Une vente à perte peut donner un montant négatif.** Le plafond indicatif d’indemnité est le plus petit de six mois d’intérêts sur le capital intégralement remboursé et de 3 % du capital restant dû. Le contrat peut prévoir un autre montant dans les limites qui lui sont applicables. [Code de la consommation, R313-25](https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006069565/LEGISCTA000032807570/)

La série de flux commence par l’opposé des fonds propres initiaux. Chaque flux annuel contient le cash-flow d’exploitation. Le dernier reçoit le produit net de cession. Les rapports ROI et MOIC intègrent **tous les apports**, y compris les nouvelles contributions lorsque l’exploitation reste déficitaire.

| Indicateur | Calcul |
| --- | --- |
| VAN | Somme des flux actualisés à la date d’achat au taux renseigné. |
| TRI | Taux annuel qui annule la VAN. Le moteur rend une valeur si le profil de flux présente un seul changement de signe et permet d’encadrer une racine. |
| TRI modifié | Réinvestissement des entrées et financement des sorties à 4 %, convention du site. Il figure séparément. |
| ROI | (Somme des flux positifs − valeur absolue des flux négatifs) / valeur absolue des flux négatifs. |
| MOIC | Somme des flux positifs / valeur absolue des flux négatifs. |

Sans vente renseignée, la sortie comporte les flux et le cash-flow cumulé d’exploitation. Un prix terminal est nécessaire pour le bilan patrimonial complet. Les ratios non définis sont rendus par `null`.

## Calcul de contrôle

Dans le [dossier de Lina](../exemples/lina.json), le loyer annuel stabilisé vaut 1 050 × 12 × 95 % = **11 970 €**. Le net d’exploitation est de **8 990 €**, soit **5,26 %** de 171 000 €. Avec deux mois de délai, l’année 1 encaisse 9 975 €. Les charges de 2 980 €, la dette assurée de 10 451,30 € et l’impôt supposé de 1 200 € conduisent à **−4 656,30 €** de trésorerie annuelle.

Sur dix ans, une hausse annuelle des loyers de 1,5 %, des charges de 2 % et l’indexation de l’impôt connu sur le net d’exploitation reproduisent le tableau du guide, dont le TRI de 7,03 % et la VAN de 8 180,35 €. Ces hypothèses d’indexation ont été reconstituées à partir des résultats publiés. À loyers, charges et impôt constants, le même dossier donnerait un TRI de **6,20 %** et une VAN de **4 783,74 €**.

## Hypothèses à vérifier localement

Le scénario d’indexation du loyer doit être compatible avec le bail, l’IRL, l’encadrement éventuellement applicable et la performance énergétique. Le DPE et les dates de conclusion, de renouvellement ou de reconduction du bail peuvent modifier les premiers mois louables ou imposer des travaux. Les conditions diffèrent entre la métropole et les territoires ultramarins. [Service Public, révision des loyers](https://www.service-public.gouv.fr/particuliers/vosdroits/F13723) · [Service Public, décence énergétique](https://www.service-public.gouv.fr/particuliers/actualites/A17975) · [Service Public, évolution du DPE en 2026](https://www.service-public.gouv.fr/particuliers/actualites/A18446)
