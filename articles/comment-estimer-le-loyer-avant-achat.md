# Comment estimer le loyer d’un bien avant achat ?

Publié le 2025-09-20 sur ma-rentabilite.fr. [Article d’origine](https://ma-rentabilite.fr/article/comment-estimer-le-loyer-avant-achat)

## Introduction

Avant d’acheter, tu dois fixer une **hypothèse de loyer réaliste**. C’est l’entrée critique de tous tes calculs : rentabilités, cashflow, TRI…
Voici trois approches complémentaires, avec un **calculateur** pour te faire une idée rapide et une liste d’**erreurs fréquentes** à éviter.

**À retenir :** croise *comparables* de marché, *rendement inverse* (depuis le prix) et *références/encadrement* local.
Utilise une **fourchette** (min–max) plutôt qu’un seul chiffre.

## Méthode 1 — Les comparables (la plus robuste)

Recherche 3 à 6 annonces *louées ou récemment louées* très proches en :

- **Localisation** (quartier, proximité transports) ;
- **Typologie** (studio/T1/T2/T3…) ;
- **Surface** (±10 %) ;
- **État & prestations** (rénové, meublé, extérieur, parking, étage/ascenseur).

Normalise ensuite en **€/m²** et applique des *petits coefficients* (ex. meublé +5 à +12 %, parking +20 à +60 € /mois, état refait +5 %).

### Barre d’ajustements (repères simples)

- **Meublé** : +8 % par défaut (à adapter).
- **Parking/box** : +40 € (fourchette 20–80 € selon zone).
- **État rénové** : +5 % ; **à rafraîchir** : −5 %.
- **Étage sans ascenseur** (≥3e) : −10 à −30 €.

## Méthode 2 — Rendement inverse (cohérence rapide)

Quand tu connais le **coût total investi** et vises un **rendement brut cible**, tu peux *déduire* un loyer cohérent :

*Loyer annuel (HC) ≈ Rendement brut cible × Coût total* → *Loyer mensuel* = (…)/12

Ex. : coût total 230 k€ et cible 5 % brut → 230 000 × 0,05 / 12 ≈ **958 €** /mois.

## Méthode 3 — Encadrement / références locales

Dans certaines villes, l’**encadrement des loyers** impose des *loyers de référence* (plancher/médian/majoré) selon quartier, surface, époque, meublé/nu, etc.
Même hors encadrement, des **observatoires locaux** publient des fourchettes de marché.
Utilise ces valeurs comme **garde-fou** pour vérifier que ton estimation reste cohérente.

**Important :** attention à la *confusion HC/CC* dans les annonces (hors charges vs charges comprises).
Pour la rentabilité, travaille toujours en **loyer HC**.

## Calculateur interactif — Comparables & rendement inverse

Renseigne quelques comparables (surface/loyer/poids) et tes ajustements. Le calculateur propose une **fourchette** (±5–10 %).

Surface du bien (m²)
45

Meublé ?
Non

État général
Standard

Parking/box ?
Non

### Comparables (€/mois HC et surface)

| # | Surface (m²) | Loyer HC (€ /mois) | Poids (1–5) | €/m² |
| --- | --- | --- | --- | --- |

#### Résultat (comparables)

Basé sur un €/m² pondéré × surface, avec ajustements.

—

—

#### Rendement inverse

Coût total investi (€)
230000

Rendement brut cible (%)
5

—

#### Synthèse

Fourchette finale (pondération 70 % comparables / 30 % rendement inverse) :

—

Ajuste ensuite selon encadrement/références locales.

## Erreurs fréquentes

- Confondre **HC** et **CC** (charges comprises). La rentabilité se calcule sur *HC*.
- Comparer des biens **non homogènes** (surface, état, localisation) sans correctifs.
- Ignorer l’**encadrement des loyers** ou les **références locales** (plafonds).
- Raisonner au **prix facial** sans considérer la **vacance** (périodes non louées) ni la **saisonnalité** (zones étudiantes).

## Conclusion

Estime ton loyer avec des **comparables solides**, confronte-le au **rendement inverse** et aux **références** de la zone.
Travaille avec une **fourchette** et un scénario prudent : ta décision d’achat n’en sera que meilleure.

### Passer à la pratique

Projette ton loyer dans le simulateur — gratuit, anonyme, sans inscription — et calcule cashflow, rentabilités et TRI.

<details>
<summary>Formules du calculateur publié avec cet article (JavaScript historique)</summary>

```javascript
// ====== Calculateur : Comparables & Rendement inverse ======
  (function estimator(){
    const byId = (id)=>document.getElementById(id);
    const tbody = document.querySelector('#cmp-table tbody');
    const fmt = (x)=> x.toLocaleString('fr-FR',{minimumFractionDigits:0, maximumFractionDigits:0});
    const fmt2 = (x)=> x.toLocaleString('fr-FR',{minimumFractionDigits:2, maximumFractionDigits:2});

    function addRow(i, s=40, l=900, p=3){
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="border px-3 py-2 font-medium">${i}</td>
        <td class="border px-3 py-2"><input type="number" class="w-28 border rounded px-2 py-1" value="${s}" step="0.5" min="10"></td>
        <td class="border px-3 py-2"><input type="number" class="w-28 border rounded px-2 py-1" value="${l}" step="10" min="50"></td>
        <td class="border px-3 py-2"><input type="number" class="w-20 border rounded px-2 py-1" value="${p}" step="1" min="1" max="5"></td>
        <td class="border px-3 py-2 text-slate-700">—</td>
      `;
      tbody.appendChild(tr);
    }

    // seed 3 lignes
    addRow(1, 42, 880, 3);
    addRow(2, 47, 960, 4);
    addRow(3, 45, 920, 3);

    function compute(){
      // €/m² pondéré
      let sumW = 0, sumVal = 0;
      [...tbody.querySelectorAll('tr')].forEach(tr=>{
        const s  = parseFloat(tr.children[1].querySelector('input').value || '0');
        const l  = parseFloat(tr.children[2].querySelector('input').value || '0');
        const p  = parseFloat(tr.children[3].querySelector('input').value || '0');
        if(s>0 && l>0 && p>0){
          const eurm2 = l / s;
          tr.children[4].textContent = eurm2.toFixed(2);
          sumW += p;
          sumVal += eurm2 * p;
        } else {
          tr.children[4].textContent = '—';
        }
      });
      const eurm2Pondere = sumW>0 ? (sumVal / sumW) : 0;

      // Ajustements
      const surf = parseFloat(byId('c-surf').value || '0');
      const meuble = byId('c-meuble').value === 'oui';
      const etat = byId('c-etat').value;
      const parking = byId('c-parking').value === 'oui';

      let coef = 1.0;
      if(meuble) coef *= 1.08;            // +8 %
      if(etat === 'refait') coef *= 1.05;  // +5 %
      if(etat === 'a_rafraichir') coef *= 0.95; // -5 %
      let bonus = parking ? 40 : 0;       // +40 €

      const loyerBase = eurm2Pondere * surf * coef + bonus;

      // Fourchettes
      const low = loyerBase * 0.95;
      const high = loyerBase * 1.10;

      byId('res-cmp').textContent = loyerBase>0 ? ("≈ € "+fmt(loyerBase)) : "—";
      byId('res-cmp-range').textContent = loyerBase>0 ? ("Fourchette : € "+fmt(low)+" à € "+fmt(high)) : "—";

      // Rendement inverse
      const cout = parseFloat(byId('r-cout').value || '0');
      const rend = (parseFloat(byId('r-rend').value || '0') / 100);
      const loyAnn = cout * rend;
      const loyMens = loyAnn / 12;
      byId('res-rend').textContent = (loyMens>0 ? ("≈ € "+fmt(loyMens)+" /mois") : "—");

      // Synthèse pondérée 70/30
      const synth = (loyerBase>0 && loyMens>0) ? (0.7*loyerBase + 0.3*loyMens) : (loyerBase || loyMens || 0);
      const sLow  = synth * 0.95;
      const sHigh = synth * 1.10;
      byId('res-synth').textContent = (synth>0) ? ("€ "+fmt(sLow)+" — € "+fmt(sHigh)+" /mois HC") : "—";
    }

    document.getElementById('cmp-add').addEventListener('click', ()=>{
      const n = tbody.querySelectorAll('tr').length + 1;
      addRow(n, 45, 900, 3);
    });

    // Recompute on changes
    document.addEventListener('input', (e)=>{
      if(e.target.closest('#calco')) compute();
    });

    compute(); // initial
  })();
```

</details>
