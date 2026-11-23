# Comprendre et chiffrer le déficit foncier

Publié le 2025-09-22 sur ma-rentabilite.fr. [Article d’origine](https://ma-rentabilite.fr/article/deficit-foncier-optimiser-fiscalite-immobiliere)

## Mise à jour du 23 novembre 2026

Un appartement encaisse 8 000 € et supporte 11 000 € d’intérêts d’emprunt et 12 000 € de charges déductibles. Son déficit atteint 15 000 €. Dans le cas ordinaire, 3 000 € proviennent des intérêts. Sur les 12 000 € restants, au maximum 10 700 € sont imputables sur le revenu global. Les 4 300 € restants alimentent le report foncier. L’économie de trésorerie dépend ensuite du foyer et de la poursuite de la location. [Règles et cas particuliers](https://www.impots.gouv.fr/particulier/location-vide-de-meubles)

[Règles du moteur et sources officielles](../docs/fiscalite.md)

<details>
<summary>Lire l’article historique et ses exemples à la date de publication</summary>

## Introduction

En location **nue**, les revenus sont imposés dans la catégorie **revenus fonciers**.
Quand *charges + travaux + intérêts* dépassent les loyers, tu crées un **déficit foncier**.
Bien utilisé, il peut réduire significativement ton **impôt sur le revenu** (IR) et lisser la trésorerie.

**À retenir :** un déficit se décompose en deux parties :

- **Hors intérêts** : imputable sur le *revenu global* dans la limite usuelle de **10 700 €** par an (modèle pédagogique ici).
- **Intérêts (et surplus)** : *reportables* sur les **revenus fonciers** des 10 années suivantes.

## Comment se calcule le déficit foncier ?

1. Calcule d’abord le résultat *hors intérêts* : **R₀ = Loyers − (Charges non récupérables + Travaux déductibles)**.
2. Puis soustrais les **Intérêts d’emprunt** : **Résultat foncier = R₀ − Intérêts**.
3. Si le résultat est **négatif**, tu as un déficit à répartir :
   - *Part imputable sur revenu global* = **min(10 700 €, max(0, −R₀))**.
   - *Part reportable sur revenus fonciers* = **déficit total − part imputable**.

**Effet fiscal :** la part imputée sur le *revenu global* produit une économie ≈ **part imputée × TMI** (hors effets annexes).
Les **prélèvements sociaux** (PS) ne s’appliquent que si *revenus fonciers* sont **positifs**.

## Conditions & prudences

- Engagement de **location** du bien pendant une durée (souvent 3 ans) après l’imputation sur revenu global.
- Nature des **travaux** : l’entretien/réparation est en principe déductible; la reconstruction/agrandissement ne l’est pas (souvent immobilisée).
- Les règles et **plafonds** peuvent évoluer. Notre calculateur est *pédagogique*.

## Calculateur interactif — Déficit foncier

Renseigne tes **loyers**, **charges**, **intérêts**, **travaux**, ta **TMI** et les **PS**.
Le calculateur décompose la part **imputable**, le **report**, estime l’**impôt** et l’**économie d’IR**.
Il affiche aussi deux visions de **cashflow mensuel** : (A) après IR/PS *du foncier* uniquement, et (B) après IR/PS *en intégrant* l’économie d’IR sur le revenu global.

Loyers annuels encaissés (€)
13800

Charges non récupérables annuelles (€)
2800
Taxe foncière (hors TEOM récupérée), PNO, gestion, comptable…

Travaux déductibles annuels (€)
6000

Intérêts d’emprunt annuels (€)
3100

TMI (%)
30

Prélèvements sociaux PS (%)
17.2

Plafond imputable sur revenu global (€)
10700
Valeur usuelle 10 700 € (à vérifier selon règles).

Mensualité crédit + assurance (€ /mois)
1050

Autres charges d’exploitation (€ /mois)
120

| Indicateur | Valeur |
| --- | --- |
| — | |

Simplifications : calculs annuels; PS uniquement si revenus fonciers positifs; économie d’IR ≈ part imputée × TMI (hors décote/CSG déductible/plafonds précis).
La part reportée (hors intérêts excédentaires et intérêts) est supposée utilisable sur revenus fonciers futurs (10 ans).

## Bonnes pratiques

- **Documente** précisément tes travaux (devis/factures, nature des dépenses).
- **Anticipe** la **vacance** liée aux travaux dans tes simulations de trésorerie.
- **Planifie** les chantiers pour optimiser l’imputation (année de gros travaux).

## Conclusion

Le **déficit foncier** est un levier puissant pour réduire l’**IR** et améliorer le **cashflow** net d’imposition.
Sépare bien la part **imputable** (hors intérêts) et la part **reportable** (intérêts/surplus), respecte les conditions et mets à jour tes simulations chaque année.

### Passer à la pratique

Projette tes chiffres dans le simulateur complet — gratuit, anonyme, sans inscription — et exporte ton bilan.

<details>
<summary>Formules du calculateur publié avec cet article (JavaScript historique)</summary>

```javascript
// ====== Calculateur Déficit foncier ======
  (function deficitFoncierCalc(){
    const byId = (id)=>document.getElementById(id);
    const fmt0 = (x)=> x.toLocaleString('fr-FR',{maximumFractionDigits:0});
    const fmt2 = (x)=> x.toLocaleString('fr-FR',{minimumFractionDigits:2, maximumFractionDigits:2});

    function compute(){
      const L   = parseFloat(byId('df-loyers').value || '0');
      const CH  = parseFloat(byId('df-charges').value || '0');   // hors TEOM récupérée
      const TR  = parseFloat(byId('df-travaux').value || '0');
      const IN  = parseFloat(byId('df-interets').value || '0');
      const TMI = (parseFloat(byId('df-tmi').value || '0')/100);
      const PS  = (parseFloat(byId('df-ps').value || '0')/100);
      const PL  = parseFloat(byId('df-plafond').value || '0');

      const MEN = parseFloat(byId('df-mensu').value || '0');
      const CHM = parseFloat(byId('df-chgmois').value || '0');

      // Etape 1 : résultats
      const R0 = L - (CH + TR);       // avant intérêts
      const R  = R0 - IN;             // après intérêts = résultat foncier

      // Déficit et répartition
      const deficitTotal = Math.max(0, -R);
      const partHorsInt  = Math.max(0, -R0);                 // déficit provenant des charges/travaux
      const imputable    = Math.min(PL, partHorsInt);         // sur revenu global (plafond)
      const reportable   = Math.max(0, deficitTotal - imputable); // à reporter sur revenus fonciers (10 ans)

      // Impôts/PS sur revenus fonciers de l'année (si R>0)
      const basePS = Math.max(0, R); // PS uniquement si résultat positif
      const impIR  = Math.max(0, R) * TMI; // IR sur revenus fonciers positifs (modèle simple)
      const impPS  = basePS * PS;
      const impotFoncierAn = impIR + impPS;

      // Economie d'IR sur revenu global (si imputable>0)
      const economieIR = imputable * TMI;

      // Cashflows
      const cfA_mois = (L/12) - ((CH+TR+IN)/12) - MEN - CHM - (impotFoncierAn/12); // A: après IR/PS foncier
      const cfB_mois = cfA_mois + (economieIR/12);                                  // B: incluant économie IR globale

      // Rendu
      const tbody = document.querySelector('#df-table tbody');
      tbody.innerHTML = '';
      const rows = [
        ['Résultat avant intérêts (R₀)', '€ '+fmt0(R0)],
        ['Résultat foncier après intérêts (R)', (R>=0?'<span class="text-emerald-700">€ '+fmt0(R)+'</span>':'<span class="text-rose-600">€ '+fmt0(R)+'</span>')],
        ['Déficit total constaté', '€ '+fmt0(deficitTotal)],
        ['Part imputable sur revenu global (hors intérêts, plaf.)', '€ '+fmt0(imputable)],
        ['Part reportable sur revenus fonciers (10 ans)', '€ '+fmt0(reportable)],
        ['Impôt IR sur revenus fonciers (si R>0)', '€ '+fmt0(impIR)+' /an'],
        ['Prélèvements sociaux (si R>0)', '€ '+fmt0(impPS)+' /an'],
        ['Économie d’IR sur revenu global (≈ imputable × TMI)', (economieIR>0?'<span class="text-emerald-700">€ '+fmt0(economieIR)+'</span>':'—')],
        ['Cashflow (A) après IR/PS foncier', (cfA_mois>=0?'<span class="text-emerald-700">€ '+fmt2(cfA_mois)+'/mois</span>':'<span class="text-rose-600">€ '+fmt2(cfA_mois)+'/mois</span>')],
        ['Cashflow (B) incluant économie d’IR globale', (cfB_mois>=0?'<span class="text-emerald-700">€ '+fmt2(cfB_mois)+'/mois</span>':'<span class="text-rose-600">€ '+fmt2(cfB_mois)+'/mois</span>')],
      ];
      rows.forEach(r=>{
        const tr = document.createElement('tr');
        [r[0], r[1]].forEach((val, i)=>{
          const td = document.createElement('td');
          td.className = 'border px-3 py-2'+(i===0?' font-medium':'');
          td.innerHTML = val;
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      });
    }

    document.addEventListener('input', (e)=>{ if(e.target.closest('#calco')) compute(); });
    compute();
  })();
```

</details>

</details>
