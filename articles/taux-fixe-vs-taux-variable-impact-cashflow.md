# Taux fixe vs taux variable : quel impact sur le cashflow ?

Publié le 2025-09-20 sur ma-rentabilite.fr. [Article d’origine](https://ma-rentabilite.fr/article/taux-fixe-vs-taux-variable-impact-cashflow)

## Introduction

Le **taux fixe** offre une *mensualité stable* et donc un **cashflow prévisible**.
Le **taux variable** évolue avec un *index* (souvent type Euribor) **+** une *marge* de la banque ; la mensualité est *révisée périodiquement* et peut être **capée** (plafond) et/ou **floorée** (plancher).
Dans un projet locatif, la question est simple : **combien mon cashflow peut-il bouger ?**

**À retenir :** le cashflow = *loyers effectifs* − *charges d’exploitation* − *mensualité totale* (intérêts + capital + assurance).
Si le taux *monte*, la mensualité monte et le cashflow *baisse* — l’inverse si le taux descend (dans la limite du floor).

## Notions clés

- **Taux fixe** : inchangé pendant toute la durée (mensualité constante hors assurance CRD).
- **Taux variable** : *index* (marché) + *marge* (banque). Périodicité de révision (ex. 12 mois).
  Souvent assorti d’un **cap** (+X %) et/ou d’un **floor** (−Y %) autour du taux initial ou absolu.
- **Schéma de révision** retenu ici :

1. La *mensualité* est **recalculée** à chaque révision, sur la *durée résiduelle* et le *CRD* du jour.
2. L’assurance (si sur capital initial) est ajoutée pour obtenir le **total payé** chaque mois.

**Important :** les contrats varient (révision avec mensualité ou durée ajustée, caps absolus/relatifs, index différents, frais/assurance).
Le calculateur ci-dessous est une *modélisation pédagogique* : reporte les conditions exactes de ta banque pour une évaluation fidèle.

## Impact sur la mensualité et le cashflow

- **Fixe** : mensualité *prévisible* = confort de trésorerie, mais pas de bénéfice si les taux baissent (hors renégociation).
- **Variable** : mensualité *adaptative* = meilleure quand les taux baissent, plus lourde si les taux montent.
  Le **cap** limite la hausse et le **floor** limite la baisse.

## Exemple de base

**Hypothèses** : capital **200 000 €**, durée **25 ans**, assurance **0,25 %/an** sur capital initial.
Comparaison :

- **Fixe** : 4,00 % nominal.
- **Variable** : index 2,50 % + marge 1,20 % = **3,70 %** initial ; révision **annuelle** (12 mois) ; cap +2,0 % / floor −2,0 % *autour du taux initial*.

**Lecture rapide :** si l’index grimpe de +1,5 % d’ici un an, le taux passerait vers ~5,2 % (dans la limite du cap),
la mensualité augmenterait et le cashflow baisserait d’autant.

## Calculateur interactif — fixe vs variable

Teste les scénarios **Base** (index inchangé), **Optimiste** (index –1 pt) et **Stress** (index +2 pts),
avec cap/floor et révision annuelle (paramétrable). Le calcul se fait sur les **24 premiers mois** pour illustrer l’impact sur le cashflow.

Capital emprunté (€)
200000

Durée (années)
25

Assurance (cap. initial) (%/an)
0.25

Taux fixe nominal (%)
4

Index initial (%)
2.5

Marge banque (%)
1.2

Cap (+% relatif)
2.0

Floor (−% relatif)
2.0

Révision (mois)
12

Loyer mensuel (HC)
1150

Charges mensuelles
325

| Scénario | Taux initial | Mensualité M1 (hors assur.) | Mensualité après 12 mois | Assurance / mois | Cashflow M1 | Cashflow M13 |
| --- | --- | --- | --- | --- | --- | --- |
| — | | | | | | |

Hypothèses : mensualité recalculée à chaque révision sur la durée résiduelle et le CRD.
Assurance modélisée sur *capital initial* (prime constante). Cashflow = loyer − charges − (mensualité + assurance).

## Conseils pratiques

- **Test d’effort** : vérifie que ton cashflow reste supportable au *taux “stress”* (ex. +2 pts, ou cap).
- **Flexibilité** : si le variable est choisi, garde une *marge de sécurité* (épargne, modulation, possibilité de passer en fixe si prévu au contrat).
- **Objectif** : si ton focus est le *cashflow prévisible*, le fixe reste souvent plus confortable.
  Si tu vises un pari sur la baisse des taux (ou possibilité de renégociation), le variable peut se défendre.

## Conclusion

Le **taux fixe** sécurise la trésorerie ; le **taux variable** peut améliorer ou détériorer ton cashflow selon l’évolution de l’index, dans la limite cap/floor.
Projette 3 scénarios (base/optimiste/stress), regarde la **mensualité** et le **cashflow** à M1 et après révision, puis décide en fonction de ta tolérance au risque.

### Passer à la pratique

Compare fixe/variable dans le simulateur complet — gratuit, anonyme, sans inscription — et exporte ton bilan.

<details>
<summary>Formules du calculateur publié avec cet article (JavaScript historique)</summary>

```javascript
// ====== Calculateur : Taux fixe vs variable (3 scénarios) ======
  (function tauxFixeVariable(){
    const byId = (id)=>document.getElementById(id);
    const fmt = (x)=> x.toLocaleString('fr-FR',{minimumFractionDigits:2, maximumFractionDigits:2});
    const fmt0 = (x)=> x.toLocaleString('fr-FR');

    function mensualite(P, iAnn, n){
      const r = iAnn/12;
      return P * r / (1 - Math.pow(1+r, -n));
    }

    function simulateScenario(type, P, iFixe, idx0, marge, cap, floor, revMois, Y, assurA, loy, chg){
      const nTot = Math.round(Y*12);
      const primeAss = P * (assurA/12); // capital initial (constante)
      // Scénarios sur index :
      // base: 0; optimiste: -1 pt; stress: +2 pts
      let delta = 0;
      if(type==='optimiste') delta = -1.0/100;
      if(type==='stress')    delta =  2.0/100;

      // Taux fixe
      if(type==='fixe'){
        const M = mensualite(P, iFixe/100, nTot);
        return {
          label: 'Taux fixe',
          tauxInit: iFixe,
          m1: M, m13: M,
          ass: primeAss,
          cf1: loy - chg - (M + primeAss),
          cf13: loy - chg - (M + primeAss)
        };
      }

      // Taux variable
      // Taux initial limité par cap/floor relatifs autour du taux init de référence (idx0 + marge)
      const tInit = Math.min(idx0/100 + marge/100 + cap/100, Math.max(idx0/100 + marge/100 - floor/100, idx0/100 + marge/100));
      // M1 avec taux initial
      let crd = P;
      let nRest = nTot;
      const M1 = mensualite(crd, tInit, nRest);
      const cf1 = loy - chg - (M1 + primeAss);

      // Après 12 mois : on simule 12 échéances au taux tInit puis on révise
      const rInit = tInit/12;
      for(let k=1;k<=revMois;k++){
        const interets = crd * rInit;
        const capital = M1 - interets;
        crd = Math.max(0, crd - capital);
        nRest--;
      }

      // Nouveau taux après révision, avec delta et cap/floor relatifs
      const tRef = idx0/100 + delta + marge/100;
      const tCap = (idx0/100 + marge/100) + cap/100;
      const tFloor = (idx0/100 + marge/100) - floor/100;
      const tNew = Math.max(tFloor, Math.min(tCap, tRef));
      const M13 = mensualite(crd, tNew, nRest);
      const cf13 = loy - chg - (M13 + primeAss);

      return {
        label: (type==='base'?'Variable (base)': type==='optimiste'?'Variable (optimiste)':'Variable (stress)'),
        tauxInit: (tInit*100),
        m1: M1, m13: M13,
        ass: primeAss,
        cf1: cf1, cf13: cf13
      };
    }

    function render(){
      const P     = parseFloat(byId('c-capital').value || '0');
      const Y     = parseFloat(byId('c-duree').value || '0');
      const assur = (parseFloat(byId('c-assur').value || '0')/100);
      const iFixe = parseFloat(byId('c-fixe').value || '0');
      const idx0  = parseFloat(byId('c-index').value || '0');   // %
      const marge = parseFloat(byId('c-marge').value || '0');   // %
      const cap   = parseFloat(byId('c-cap').value || '0');     // +% relatifs
      const floor = parseFloat(byId('c-floor').value || '0');   // -% relatifs
      const revM  = parseFloat(byId('c-rev').value || '12');    // mois
      const loy   = parseFloat(byId('c-loyer').value || '0');
      const chg   = parseFloat(byId('c-charges').value || '0');

      const rows = [];
      rows.push(simulateScenario('fixe', P, iFixe, idx0, marge, cap, floor, revM, Y, assur, loy, chg));
      rows.push(simulateScenario('base', P, iFixe, idx0, marge, cap, floor, revM, Y, assur, loy, chg));
      rows.push(simulateScenario('optimiste', P, iFixe, idx0, marge, cap, floor, revM, Y, assur, loy, chg));
      rows.push(simulateScenario('stress', P, iFixe, idx0, marge, cap, floor, revM, Y, assur, loy, chg));

      const tbody = document.querySelector('#c-table tbody');
      tbody.innerHTML = '';
      rows.forEach(r=>{
        const tr = document.createElement('tr');
        const cells = [
          r.label,
          r.tauxInit.toFixed(2)+" %",
          "€ "+fmt(r.m1),
          "€ "+fmt(r.m13),
          "€ "+fmt(r.ass),
          (r.cf1>=0?'<span class="text-emerald-700">€ '+fmt(r.cf1)+'</span>':'<span class="text-rose-600">€ '+fmt(r.cf1)+'</span>'),
          (r.cf13>=0?'<span class="text-emerald-700">€ '+fmt(r.cf13)+'</span>':'<span class="text-rose-600">€ '+fmt(r.cf13)+'</span>')
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
    ['c-capital','c-duree','c-assur','c-fixe','c-index','c-marge','c-cap','c-floor','c-rev','c-loyer','c-charges'].forEach(id=>{
      const el = byId(id);
      el.addEventListener('change', render);
      el.addEventListener('keydown', (e)=>{ if(e.key==='Enter'){ render(); }});
    });
    render();
  })();
```

</details>
