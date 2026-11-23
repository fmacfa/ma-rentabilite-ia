# Location meublée non professionnelle en 2026

Publié le 2025-09-21 sur ma-rentabilite.fr. [Article d’origine](https://ma-rentabilite.fr/article/lmnp-avantages-et-inconvenients-investisseur)

## Mise à jour du 23 novembre 2026

Dans notre meublé de longue durée, 9 792 € de loyers encaissés et 600 € de charges récupérées donnent 10 392 € de recettes fiscales. Le micro-BIC conduit à 5 196 € imposables. À 30 % d’IR marginal et 18,6 % de prélèvements sociaux, l’impôt estimé vaut 2 525,26 €. La simulation au réel, avec 3 100 € de dotation et les frais du dossier, aboutit à 597,25 € pour la première année. Vérifiez aussi le coût comptable et le cumul d’amortissements à reprendre à la revente. [Dossier exécutable](../exemples/location-meublee.json)

[Règles du moteur et sources officielles](../docs/fiscalite.md)

<details>
<summary>Lire l’article historique et ses exemples à la date de publication</summary>

## Introduction

La **Location Meublée Non Professionnelle (LMNP)** permet de louer un logement *meublé* et d’être imposé dans la catégorie **BIC** (micro-BIC ou réel).
L’attrait majeur : au **réel**, tu peux **amortir** le bien et le mobilier, ce qui réduit fortement la base imposable — souvent jusqu’à *zéro* pendant plusieurs années.

**À retenir :**

- **Micro-BIC** : abattement forfaitaire (ex. 50 % usuel) — simple quand tes charges sont faibles.
- **Réel LMNP** : déductions réelles + **amortissements** (bien, travaux immobilisés, mobilier) — plus optimisant mais plus **exigeant**.

## Avantages du LMNP

- **Souplesse fiscale** : choix entre *micro-BIC* (simplicité) et *réel* (optimisation).
- **Amortissements** au réel : peuvent annuler le résultat imposable (hors franchissement de certaines limites) pendant plusieurs années.
- **Cashflow après impôt** généralement meilleur que la location nue à charges équivalentes.
- **Meublé** : loyer souvent plus élevé, mise en marché plus rapide dans certaines zones (étudiants, pros en mobilité).

## Inconvénients / points d’attention

- **Comptabilité** au réel (bilan, liasse BIC) et **expert-comptable** conseillé (coût récurrent).
- **CFE** (Cotisation Foncière des Entreprises) généralement due pour la location meublée.
- **Meubles/équipements** à maintenir → **CapEx** (renouvellement) à provisionner.
- **Réglementations locales** possibles (changements d’usage, zones tendues, encadrement des loyers…) selon la ville.
- **Basculer LMP** si certaines conditions sont réunies (seuils/critères pouvant évoluer) : impacts sociaux et fiscaux différents.

**Important :** Les *règles* (abattements, seuils, nature des dépenses amortissables, conditions LMP, etc.) peuvent évoluer.
Cet article est *pédagogique*. Vérifie toujours les règles en vigueur et/ou consulte un professionnel.

## Micro-BIC vs Réel LMNP : comment trancher ?

1. Estime tes **charges** (PNO, syndic non récupérable, GLI, entretien, CFE, comptable…) + **intérêts d’emprunt**.
2. Au **réel**, ajoute une estimation d’**amortissements** (bien, travaux immobilisés, mobilier).
3. Compare à l’**abattement** du micro-BIC. Si *charges + intérêts + amortissements plafonnés* > abattement, le **réel** est souvent plus avantageux.

## Amortissements (rappels simplifiés)

- Répartition par **composants** (structure, second œuvre, mobilier…) sur des *durées usuelles*.
- La déduction des amortissements ne peut généralement pas *créer* ou *aggraver* un déficit reportable sur d’autres revenus :
  on **plafonne** pour ne pas passer sous zéro; l’excès se *reporterait* selon les règles applicables.
- Les **travaux** peuvent être *déductibles* (entretien) ou *immobilisés* (amortis) selon leur nature.

## Calculateur interactif — LMNP micro-BIC vs réel

Indique ton **CA annuel** (loyers), tes **charges réelles**, **intérêts**, une estimation d’**amortissements** annuels,
ta **TMI** et les **prélèvements sociaux**. Le calculateur estime l’**impôt** et le **cashflow après impôt** dans les deux régimes (modèle simplifié).

## Bonnes pratiques

- **Devis & suivi** du mobilier et des composants pour une estimation d’amortissement plus fine.
- **Provisionne** la CFE et le **comptable** (si réel) dans tes charges.
- **Compare** chaque année micro-BIC vs réel avec tes chiffres mis à jour.

## Conclusion

Le **LMNP** est puissant pour optimiser l’**impôt** grâce aux **amortissements** au réel.
En contrepartie, il demande une **gestion comptable** et intègre la **CFE**.
Teste tes chiffres avec le calculateur puis projette-les dans le simulateur complet pour valider l’**impact sur le cashflow** et la **rentabilité**.

### Passer à la pratique

Projette ton LMNP dans le simulateur — gratuit, anonyme, sans inscription — et exporte ton bilan.

<details>
<summary>Formules du calculateur publié avec cet article (JavaScript historique)</summary>

```javascript
// ====== Calculateur LMNP : micro-BIC vs réel ======
  (function lmnpCalc(){
    const byId = (id)=>document.getElementById(id);
    const fmt0 = (x)=> x.toLocaleString('fr-FR',{minimumFractionDigits:0, maximumFractionDigits:0});
    const fmt2 = (x)=> x.toLocaleString('fr-FR',{minimumFractionDigits:2, maximumFractionDigits:2});

    function compute(){
      const CA    = parseFloat(byId('bic-ca').value || '0');
      const abat  = (parseFloat(byId('bic-abatt').value || '0')/100);
      const TMI   = (parseFloat(byId('bic-tmi').value || '0')/100);
      const PS    = (parseFloat(byId('bic-ps').value || '0')/100);
      const chAn  = parseFloat(byId('bic-charges').value || '0');
      const intAn = parseFloat(byId('bic-interets').value || '0');
      const amoAn = parseFloat(byId('bic-amort').value || '0');
      const mensu = parseFloat(byId('bic-mensu').value || '0');
      const chgM  = parseFloat(byId('bic-chgmois').value || '0');

      // Micro-BIC
      const baseMicro = Math.max(0, CA * (1 - abat));
      const impMicro  = baseMicro * (TMI + PS);

      // Réel LMNP : résultat avant amort. + amort plafonné pour ne pas < 0
      const resAvantAmo = CA - (chAn + intAn);
      const amoUtil     = Math.max(0, Math.min(amoAn, Math.max(0, resAvantAmo)));
      const baseReel    = Math.max(0, resAvantAmo - amoUtil);
      const impReel     = baseReel * (TMI + PS);
      const amoReport   = Math.max(0, amoAn - amoUtil); // indicatif

      // Cashflow après impôt (mensuel) — modèle pédagogique
      const cfMicro = (CA/12) - ((chAn/12) + (intAn/12)) - mensu - chgM - (impMicro/12);
      const cfReel  = (CA/12) - ((chAn/12) + (intAn/12)) - mensu - chgM - (impReel/12);

      // Rendu
      const tbody = document.querySelector('#bic-table tbody');
      tbody.innerHTML = '';
      [
        ['Micro-BIC', baseMicro, impMicro, cfMicro, '—'],
        ['Réel LMNP', baseReel,  impReel,  cfReel,  'Utilisé : € '+fmt0(amoUtil)+' / Report indicatif : € '+fmt0(amoReport)]
      ].forEach(row=>{
        const tr = document.createElement('tr');
        row.forEach((val, i)=>{
          const td = document.createElement('td');
          td.className = 'border px-3 py-2'+(i===0?' font-medium':'');
          if(i===1 || i===2){
            td.textContent = "€ "+fmt0(val);
          } else if(i===3){
            td.innerHTML = (val>=0?'<span class="text-emerald-700">€ '+fmt2(val)+'/mois</span>':'<span class="text-rose-600">€ '+fmt2(val)+'/mois</span>');
          } else {
            td.innerHTML = val;
          }
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
