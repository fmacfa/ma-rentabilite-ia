# Crédit immobilier : quelle durée choisir ?

Publié le 2025-09-19 sur ma-rentabilite.fr. [Article d’origine](https://ma-rentabilite.fr/article/credit-immobilier-quelle-duree-choisir)

> **Repère du 23 novembre 2026.** Les critères du HCSF portent notamment sur le taux d’effort, la maturité du prêt et les cas de flexibilité. L’accord et le taux effectif dépendent de l’offre du prêteur. [HCSF, octroi de crédits immobiliers](https://www.economie.gouv.fr/hcsf/mesures/mesure-relative-loctroi-de-credits-immobiliers)

## Introduction

Choisir la **durée de son crédit** est un arbitrage entre *mensualité* (confort de trésorerie et capacité d’emprunt) et *coût total* (intérêts sur la durée).
Plus la durée est longue, plus la mensualité est basse… mais plus le coût total d’intérêts est élevé.

**À retenir :** la bonne durée est *celle qui optimise ton projet* (cashflow, risque, objectifs) — pas forcément la plus longue ni la plus courte.

## Rappels : ce que la durée change

- **Mensualité** : diminue quand la durée s’allonge.
- **Coût total du crédit** : augmente avec la durée (plus d’intérêts versés).
- **Capacité d’emprunt** : s’améliore avec une mensualité plus faible (durée plus longue).
- **Cashflow locatif** : souvent meilleur avec une durée longue (mensualité plus basse), utile pour l’autofinancement.

## Repères rapides

- **15 ans** : mensualités hautes, coût total faible — profil “désendettement rapide”.
- **20 ans** : compromis courant.
- **25 ans** : mensualités plus douces, coût total supérieur — souvent choisi pour améliorer le cashflow.
- **30 ans** : mensualités minimales, coût total maximal — à envisager si l’objectif est le cashflow avant tout.

**Attention :** taux d’assurance, frais, politiques de banques et conditions d’éligibilité varient.
Compare toujours *plusieurs offres* et lis les conditions (modulation, pénalités de remboursement anticipé, portabilité…).

## Calculateur interactif — compare 15/20/25/30 ans

Entre tes hypothèses ci-dessous pour comparer la **mensualité**, le **coût total**, les **intérêts** et l’**impact cashflow** (avant impôts).

Capital emprunté (€)
200000

Taux nominal annuel (%)
4

Assurance (sur capital initial) (%/an)
0.25

Loyers mensuels (HC) pour cashflow (€)
1150

Charges exploitation mensuelles (€)
325

| Durée | Mensualité (hors assur.) | Assurance / mois | Total / mois estimé | Intérêts totaux | Coût total crédit | Cashflow mensuel (avant impôts) |
| --- | --- | --- | --- | --- | --- | --- |

Hypothèse assurance *sur capital initial* (prime constante). Le cashflow estimé ci-dessus = loyers − charges d’exploitation − mensualité totale.

## Lecture des résultats

- **Mensualité totale** = mensualité (annuité) + assurance ; c’est le *cash qui sort* chaque mois.
- **Intérêts totaux** : plus la durée est longue, plus ils augmentent — c’est le “prix” des mensualités basses.
- **Cashflow** : utile en locatif pour viser l’autofinancement. Un cashflow légèrement négatif peut rester acceptable si la performance globale (TRI) est bonne.

## Stratégies pratiques

- **Durée longue + remboursement anticipé** : tu sécurises une mensualité basse et tu rembourses plus vite si ta trésorerie le permet (vérifie les pénalités/conditions).
- **Modulation d’échéances** : monte/descends la mensualité dans la fourchette autorisée par la banque, pratique pour absorber un aléa (vacance, travaux).
- **Penser “fonds propres”** : le ROE/TRI comparent mieux deux montages que la seule mensualité.

**Raccourci décision** : fais tourner 2–3 scénarios (20 vs 25 ans par ex.).
Choisis celui qui respecte tes *contraintes de trésorerie* tout en limitant le *surcoût d’intérêts*.

## Erreurs fréquentes

- Comparer les durées uniquement sur la **mensualité** sans regarder le **coût total**.
- Oublier l’**assurance emprunteur** dans le budget mensuel.
- Confondre **rendement du bien** (ratio) et **cashflow** (flux de trésorerie).

## Conclusion

La bonne durée dépend de ton projet (résidence principale vs locatif), de ta tolérance au risque et de ta stratégie (désendettement vs cashflow).
Teste plusieurs durées, regarde le **coût total** et la **trésorerie**, puis décide.

<details>
<summary>Formules du calculateur publié avec cet article (JavaScript historique)</summary>

```javascript
// ====== Calculateur comparaison de durées (15/20/25/30 ans) ======
  (function dureesComparateur(){
    const byId = (id)=>document.getElementById(id);
    const fmt = (x)=> x.toLocaleString('fr-FR',{minimumFractionDigits:2, maximumFractionDigits:2});
    const fmt0 = (x)=> x.toLocaleString('fr-FR');

    function mensualite(P, iAnn, nMois){
      const r = iAnn / 12;
      return P * r / (1 - Math.pow(1+r, -nMois));
    }

    function render(){
      const P   = parseFloat(byId('c-capital').value || '0');
      const i   = (parseFloat(byId('c-taux').value || '0') / 100);
      const a   = (parseFloat(byId('c-assur').value || '0') / 100); // sur capital initial
      const loy = parseFloat(byId('c-loyer').value || '0');
      const chg = parseFloat(byId('c-charges').value || '0');

      const durees = [15,20,25,30];
      const tbody = document.querySelector('#c-table tbody');
      tbody.innerHTML = '';

      durees.forEach(Y=>{
        const n = Y*12;
        const mHors = mensualite(P, i, n);
        const assurM = P * a / 12; // prime constante
        const mTot = mHors + assurM;
        const interetsTot = mHors*n - P;
        const coutTotal = interetsTot + (assurM*n);
        const cashflow = loy - chg - mTot;

        const tr = document.createElement('tr');
        const cells = [
          Y+" ans",
          "€ "+fmt(mHors),
          "€ "+fmt(assurM),
          "€ "+fmt(mTot),
          "€ "+fmt0(Math.round(interetsTot)),
          "€ "+fmt0(Math.round(coutTotal)),
          (cashflow>=0?'<span class="text-emerald-700">€ '+fmt(cashflow)+'</span>':'<span class="text-rose-600">€ '+fmt(cashflow)+'</span>')
        ];
        cells.forEach((c, idx)=>{
          const td = document.createElement('td');
          td.className = 'border px-3 py-2'+(idx===0?' font-medium':'');
          td.innerHTML = c;
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      });
    }

    byId('c-run').addEventListener('click', render);
    ['c-capital','c-taux','c-assur','c-loyer','c-charges'].forEach(id=>{
      document.getElementById(id).addEventListener('keydown', (e)=>{ if(e.key==='Enter'){ render(); }});
      document.getElementById(id).addEventListener('change', render);
    });
    render(); // initial
  })();
```

</details>
