# Simulation de revente : intégrer la plus-value dans le TRI

Publié le 2025-09-23 sur ma-rentabilite.fr. [Article d’origine](https://ma-rentabilite.fr/article/simulation-revente-integrer-plus-value-dans-tri)

> **Mise à jour du 23 novembre 2026.** Pour les revenus locatifs 2026 relevant des prélèvements sur le patrimoine, le taux de référence est de 17,2 % en location nue et de 18,6 % en location meublée. En meublé de longue durée, le seuil micro-BIC 2026 est de 83 600 €. Les chiffres de l’exemple d’origine restent rattachés à sa date. [Règles et sources officielles](../docs/fiscalite.md)

## Introduction

Le **TRI (taux de rendement interne)** mesure la performance d’un projet en prenant en compte *tous les flux* :
l’apport initial, les **cashflows d’exploitation** et le **flux de revente** (prix net − impôts − *CRD*).
Bien modéliser la revente est crucial, car elle pèse souvent lourdement dans le résultat final.

**À retenir** : le TRI est le *taux d’actualisation* qui annule la VAN de tes flux. Il consolide
*exploitation* et *revente*. Un TRI élevé mais fondé sur des hypothèses de revente irréalistes doit être **stress-testé**.

## Quels flux intégrer ?

- **Au départ (t=0)** : *apport* = coût d’acquisition − montant du prêt. Flux **négatif**.
- **Chaque année** (t=1…H) : *cashflow d’exploitation annuel* ≈ NOI − annuité (simplifié ici constant).
- **À la revente (année H)** : prix de vente − frais de cession − impôt de plus-value (simplifié) − **CRD**. Flux **positif** additionnel.

**Attention** : la fiscalité de plus-value est ici *simplifiée* via un taux paramétrable (IR + PS).
En pratique : abattements selon la durée, surtaxes, éventuelles exonérations (résidence principale…), frais et travaux majorant le prix d’acquisition, etc.

## Simulateur interactif — TRI avec revente

Renseigne l’achat, l’exploitation, le crédit et la revente. Le module calcule le **TRI/IRR**, le
**multiple des fonds propres (Equity Multiple)**, le **CRD** à l’horizon, la **plus-value nette** (pédagogique)
et fournit un **stress test** (prix de vente ±5 %, ±10 %).

### Acquisition & exploitation

Prix (€)
200000
Notaire (%)
8
Agence (€)
0
Travaux initiaux (€)
10000
Frais de dossier (€)
0

Loyer potentiel (€/mois)
1000
Vacance (%)
5
Charges non récup. (€/an)
1200
TF nette TEOM (€/an)
1000
Gestion + assur. (%) du loyer
8

### Financement

LTV (%)
90
Part du coût financée par la dette.
Taux annuel (%)
4
Durée (années)
25
Assurance (%) /an
0.20
% du capital initial (approx.).

—

Mensualité calculée (annuité constante).

### Revente

Horizon (années)
10
Prix de vente (€)
250000
Frais de cession (%)
6
Agence, diagnostics, notaire…
Taux impôt PV (%)
19
Prélèvements sociaux (%)
17.2

| Indicateur | Valeur |
| --- | --- |
| — | |

#### Stress test — Sensibilité au prix de vente

Hypothèses pédagogiques : flux d’exploitation annuels constants, assurance emprunteur ≈ % du capital initial,
base de plus-value = (prix net vendeur − coût d’acquisition total). La réalité fiscale peut différer (abattements, frais majorant le prix d'acquisition, etc.).

## Lecture des résultats

- **TRI** : performance annualisée intégrant exploitation + revente (net d’impôts de PV dans ce modèle).
- **Equity Multiple** : (Somme des flux positifs) / (apport initial). 2× signifie que tu as doublé tes fonds propres.
- **CRD** : capital restant dû à l’horizon, déduit du flux de revente.
- **Décomposition** : l’outil isole la part *exploitation* vs *revente* dans le résultat final.

## Conclusion

Inclure la **revente** dans le calcul du **TRI** change souvent la lecture du projet.
Teste différents horizons et prix, et **stress-teste** pour éviter un TRI artificiellement gonflé par une hypothèse de marché trop optimiste.

### Passer à la pratique

Projette tes chiffres dans le simulateur complet — gratuit, anonyme, sans inscription — et exporte ton bilan.

<details>
<summary>Formules du calculateur publié avec cet article (JavaScript historique)</summary>

```javascript
// ====== Simulateur TRI avec revente ======
  (function triResale(){
    const byId = (id)=>document.getElementById(id);
    const fmt0 = (x)=> x.toLocaleString('fr-FR',{maximumFractionDigits:0});
    const fmt2 = (x)=> x.toLocaleString('fr-FR',{minimumFractionDigits:2, maximumFractionDigits:2});

    function acquisitionCost(price, notPct, agency, initWorks, fees){
      const notary = Math.max(0, price) * (Math.max(0, notPct)/100);
      return Math.max(0, price) + Math.max(0, notary) + Math.max(0, agency) + Math.max(0, initWorks) + Math.max(0, fees);
    }
    function egi(annualRent, vacPct){ return Math.max(0, annualRent) * (1 - Math.max(0, vacPct)/100); }
    function noi(egi, chgNonRec, tfNet, mgmtPct, annualRent){
      const mgmt = (Math.max(0, mgmtPct)/100) * Math.max(0, annualRent);
      return egi - (Math.max(0, chgNonRec) + Math.max(0, tfNet) + mgmt);
    }
    function annuityMonthly(loan, ratePct, years){
      const r = (Math.max(0, ratePct)/100)/12;
      const n = Math.max(1, Math.round(years*12));
      if(r===0) return loan/n;
      return loan * (r / (1 - Math.pow(1+r, -n)));
    }
    function remainingBalance(loan, ratePct, years, monthsElapsed){
      const r = (Math.max(0, ratePct)/100)/12;
      const n = Math.max(1, Math.round(years*12));
      const k = Math.min(n, Math.max(0, Math.round(monthsElapsed)));
      if (r===0){
        const m = loan/n;
        return Math.max(0, loan - m*k);
      }
      const m = loan * (r / (1 - Math.pow(1+r, -n)));
      const bal = loan*Math.pow(1+r, k) - m*((Math.pow(1+r, k)-1)/r);
      return Math.max(0, bal);
    }
    // IRR par dichotomie robuste (de -99% à 1000% l'an)
    function irrAnnual(cashflows){
      // cashflows: [t0, t1, ..., tN] en années
      const npv = (rate)=>{
        let s = 0;
        for(let t=0;t<cashflows.length;t++){
          s += cashflows[t] / Math.pow(1+rate, t);
        }
        return s;
      };
      let lo = -0.99, hi = 10.0; // -99% à 1000%
      const npvLo = npv(lo), npvHi = npv(hi);
      if (npvLo*npvHi>0){
        // pas de changement de signe → renvoyer NaN
        return NaN;
      }
      for(let i=0;i<80;i++){
        const mid = (lo+hi)/2;
        const v = npv(mid);
        if (Math.abs(v) < 1e-7) return mid;
        if (npvLo*v < 0){ hi = mid; }
        else { lo = mid; }
      }
      return (lo+hi)/2;
    }

    function compute(){
      // Inputs
      const PRIX = parseFloat(byId('ac-prix').value||'0');
      const NOT  = parseFloat(byId('ac-not').value||'0');
      const AG   = parseFloat(byId('ac-ag').value||'0');
      const TRAV = parseFloat(byId('ac-trav').value||'0');
      const DOSS = parseFloat(byId('cr-doss').value||'0');

      const LOYm = parseFloat(byId('ex-loy').value||'0');
      const VAC  = parseFloat(byId('ex-vac').value||'0');
      const CHGa = parseFloat(byId('ex-chg').value||'0');
      const TF   = parseFloat(byId('ex-tf').value||'0');
      const GES  = parseFloat(byId('ex-gest').value||'0');

      const LTV  = parseFloat(byId('cr-ltv').value||'0');
      const TAUX = parseFloat(byId('cr-taux').value||'0');
      const DUR  = parseFloat(byId('cr-duree').value||'0');
      const ASSU = parseFloat(byId('cr-assu').value||'0');

      const HOR  = Math.max(1, parseFloat(byId('rv-hor').value||'1'));
      const PV   = parseFloat(byId('rv-prix').value||'0');
      const FRV  = parseFloat(byId('rv-frais').value||'0');
      const TPV  = parseFloat(byId('rv-tpv').value||'0');
      const PS   = parseFloat(byId('rv-ps').value||'0');

      // Acquisition / coût / financement
      const COST = acquisitionCost(PRIX, NOT, AG, TRAV, DOSS);
      const RENTa = LOYm * 12;
      const EGIa = egi(RENTa, VAC);
      const NOIa = noi(EGIa, CHGa, TF, GES, RENTa);

      const LOAN = Math.max(0, COST * (Math.max(0, LTV)/100));
      const EQUITY = Math.max(0, COST - LOAN);

      const mensualite = annuityMonthly(LOAN, TAUX, DUR);
      const ASSUan = (Math.max(0, ASSU)/100) * LOAN; // approx annuelle
      const ANNUITE = mensualite*12 + ASSUan;
      const CFexp = NOIa - ANNUITE; // cashflow d'exploitation annuel (constant)

      // Revente
      const prixNet = Math.max(0, PV) * (1 - Math.max(0, FRV)/100);       // après frais de cession
      const basePV  = Math.max(0, prixNet - COST);                         // PV brute simplifiée
      const impPV   = Math.max(0, basePV) * ((Math.max(0, TPV)+Math.max(0, PS))/100);
      const mois = HOR * 12;
      const CRD = remainingBalance(LOAN, TAUX, DUR, mois);
      const fluxRevente = prixNet - impPV - CRD;

      // Flux pour IRR
      const flows = [];
      flows.push(-EQUITY);
      for(let y=1;y<=HOR;y++){
        // flux annuel d'exploitation
        let f = CFexp;
        if (y===HOR){
          f += fluxRevente;
        }
        flows.push(f);
      }
      const irr = irrAnnual(flows);
      const equityMultiple = EQUITY>0 ? (flows.slice(1).reduce((s,x)=>s+x,0) / EQUITY) : NaN;

      // Décomposition contribution exploitation vs revente (approche simple)
      const contribExploit = CFexp * HOR;
      const contribRevente = fluxRevente;

      // Rendu tableau principal
      const tbody = document.querySelector('#tri-table tbody');
      tbody.innerHTML = '';
      const rows = [
        ['Coût d’acquisition (prix + notaire + agence + travaux + dossier)', '€ '+fmt0(COST)],
        ['Montant emprunté (LTV)', '€ '+fmt0(LOAN)+' ('+LTV.toFixed(1)+' %)'],
        ['Apport (fonds propres)', '€ '+fmt0(EQUITY)],
        ['NOI (annuel)', '€ '+fmt0(NOIa)],
        ['Annuité (mensualité × 12 + assurance)', '€ '+fmt0(ANNUITE)],
        ['Cashflow d’exploitation (annuel)', (CFexp>=0?'<span class="text-emerald-700">€ '+fmt2(CFexp)+'</span>':'<span class="text-rose-600">€ '+fmt2(CFexp)+'</span>')],
        ['Horizon de détention', HOR+' an(s)'],
        ['CRD à la revente (capital restant dû)', '€ '+fmt0(CRD)],
        ['Prix de vente net (après frais de cession)', '€ '+fmt0(prixNet)],
        ['Plus-value brute (simplifiée)', '€ '+fmt0(basePV)],
        ['Impôt + prélèvements sur PV (simplifié)', '€ '+fmt0(impPV)],
        ['Flux de revente net (net vendeur − impôts − CRD)', (fluxRevente>=0?'<span class="text-emerald-700">€ '+fmt0(fluxRevente)+'</span>':'<span class="text-rose-600">€ '+fmt0(fluxRevente)+'</span>')],
        ['Equity Multiple (≈ flux cum./apport)', isFinite(equityMultiple)?fmt2(equityMultiple)+'×':'—'],
        ['TRI / IRR (annualisé)', isNaN(irr)?'—':( (irr*100).toFixed(2)+' %' )],
        ['Décomposition — Exploitation cumulée', '€ '+fmt0(contribExploit)],
        ['Décomposition — Revente nette', '€ '+fmt0(contribRevente)],
      ];
      rows.forEach(r=>{
        const tr = document.createElement('tr');
        const td1 = document.createElement('td'); td1.className='border px-3 py-2 font-medium'; td1.innerHTML=r[0];
        const td2 = document.createElement('td'); td2.className='border px-3 py-2'; td2.innerHTML=r[1];
        tr.appendChild(td1); tr.appendChild(td2); tbody.appendChild(tr);
      });

      // Stress tests sur le prix de vente (±5 %, ±10 %)
      function irrWithPrice(mult){
        const PV2 = PV * mult;
        const prixNet2 = PV2 * (1 - Math.max(0, FRV)/100);
        const basePV2  = Math.max(0, prixNet2 - COST);
        const impPV2   = Math.max(0, basePV2) * ((Math.max(0, TPV)+Math.max(0, PS))/100);
        const fluxRevente2 = prixNet2 - impPV2 - CRD;
        const flows2 = [ -EQUITY ];
        for(let y=1;y<=HOR;y++){
          let f = CFexp;
          if (y===HOR) f += fluxRevente2;
          flows2.push(f);
        }
        return irrAnnual(flows2);
      }
      const stress = document.getElementById('tri-stress');
      const sN10 = irrWithPrice(0.90);
      const sN05 = irrWithPrice(0.95);
      const sP05 = irrWithPrice(1.05);
      const sP10 = irrWithPrice(1.10);
      stress.innerHTML = `
        <table class="w-full">
          <thead><tr><th class="text-left py-1">Scénario prix</th><th class="text-left py-1">IRR</th></tr></thead>
          <tbody>
            <tr><td class="py-1">Prix -10%</td><td>${isNaN(sN10)?'—':( (sN10*100).toFixed(2)+' %')}</td></tr>
            <tr><td class="py-1">Prix -5%</td><td>${isNaN(sN05)?'—':( (sN05*100).toFixed(2)+' %')}</td></tr>
            <tr><td class="py-1">Prix +5%</td><td>${isNaN(sP05)?'—':( (sP05*100).toFixed(2)+' %')}</td></tr>
            <tr><td class="py-1">Prix +10%</td><td>${isNaN(sP10)?'—':( (sP10*100).toFixed(2)+' %')}</td></tr>
          </tbody>
        </table>
      `;
    }

    document.addEventListener('input', (e)=>{ if(e.target.closest('#calco')) compute(); });
    compute();
  })();
```

</details>
