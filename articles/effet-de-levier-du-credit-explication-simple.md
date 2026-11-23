# L’effet de levier du crédit : explication simple

Publié le 2025-09-22 sur ma-rentabilite.fr. [Article d’origine](https://ma-rentabilite.fr/article/effet-de-levier-du-credit-explication-simple)

## Introduction

L’**effet de levier** décrit l’impact de l’*endettement* sur le **rendement des fonds propres** (ROE).
Quand le **rendement économique du bien** (cap rate = NOI / coût d’acquisition) est *supérieur* au **coût de la dette** (taux d’intérêt),
*leverage positif* : le ROE augmente. L’inverse crée un *leverage négatif*.

**À retenir** : si *cap rate* > *taux* ⇒ levier généralement **créateur de valeur**.
Si *cap rate* < *taux* ⇒ levier **destructeur** (le prêt dégrade le résultat).

## Les indicateurs clés

- **Cap rate** : *NOI / Coût d’acquisition* (NOI = loyers effectifs − charges d’exploitation hors dette).
- **Coût de la dette** : taux du prêt (hors frais, simplifié ici).
- **DSCR** : *NOI / Annuité de dette* (≥ 1,20 recommandé pour marge de sécurité).
- **Cash-on-cash** (CoC) : *(NOI − annuité) / Apport* → flux de trésorerie sur fonds propres.
- **ROE (pédagogique, année 1)** : *(NOI − Intérêts) / Apport*. On distingue du CoC (qui retire capital + intérêts).

**Amortissement** : une part de chaque mensualité *rembourse du capital*.
Ce n’est pas une charge : c’est de l’**épargne forcée** qui augmente ton équité.

## Quand le levier devient risqué ?

- **Cap rate faible** et **taux élevés** → DSCR proche de 1, cashflow fragile.
- **Vacance** et **charges** sous-estimées → l’écart cap rate − taux se referme.
- **Taux variable** sans couverture → hausse des annuités, ROE qui chute.

## Calculateur interactif — Levier, CoC, ROE, DSCR

Renseigne les hypothèses. Le module calcule le **cap rate**, le **DSCR**,
le **cash-on-cash**, le **ROE** (année 1), l’**amortissement** remboursé la 1ʳᵉ année,
et indique si le levier est **positif** ou **négatif**.
Stress test : loyers ±5 % et taux ±100 points de base.

### Acquisition & exploitation

Prix (€)
200000
Notaire (%)
8
Agence (€)
0
Travaux initiaux (€)
10000
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
Autres OPEX (€/an)
300

### Crédit

LTV (%)
90
Part du coût financée par le prêt.
Taux annuel (%)
4
Durée (années)
25
Assurance (%) /an
0.20
% du capital initial (approx.).

—

Mensualité calculée par annuité constante.

| Indicateur | Valeur |
| --- | --- |
| — | |

#### Stress test

Hypothèses pédagogiques : cap rate = NOI / coût (prix + notaire + agence + travaux initiaux); assurance prêt approximée (taux × capital initial).
Amortissement = capital remboursé sur 12 premiers mois. Pas de fiscalité intégrée ici.

## Lecture des résultats

- **Levier positif** : cap rate > taux → ROE > cap rate et CoC acceptable; DSCR ≥ 1,20.
- **Levier négatif** : cap rate < taux → ROE comprimé, DSCR faible, cashflow tendu.
- **Amortissement** : même en CoC faible, le capital remboursé crée du *rendement patrimonial*.

## Conclusion

Le crédit peut **amplifier** tes rendements si la performance opérationnelle du bien dépasse le **coût de la dette**.
Vérifie toujours **cap rate vs taux**, le **DSCR**, et ta **tolérance au risque** avec un stress de taux et de loyers.

### Passer à la pratique

Projette tes chiffres dans le simulateur complet — gratuit, anonyme, sans inscription — et exporte ton bilan.

<details>
<summary>Formules du calculateur publié avec cet article (JavaScript historique)</summary>

```javascript
// ====== Calculateur Effet de levier ======
  (function leverageCalc(){
    const byId = (id)=>document.getElementById(id);
    const fmt0 = (x)=> x.toLocaleString('fr-FR',{maximumFractionDigits:0});
    const fmt2 = (x)=> x.toLocaleString('fr-FR',{minimumFractionDigits:2, maximumFractionDigits:2});

    function acquisitionCost(price, notPct, agency, initWorks){
      const notary = price * (Math.max(0, notPct)/100);
      return Math.max(0, price) + Math.max(0, notary) + Math.max(0, agency) + Math.max(0, initWorks);
    }

    function egi(annualRent, vacPct){
      return Math.max(0, annualRent) * (1 - Math.max(0, vacPct)/100);
    }

    function noi(egi, nonRecCharges, tfNet, mgmtPct, otherOpex, annualRent){
      const mgmt = (Math.max(0, mgmtPct)/100) * annualRent;
      return egi - (Math.max(0, nonRecCharges) + Math.max(0, tfNet) + mgmt + Math.max(0, otherOpex));
    }

    function annuityMonthly(loan, ratePct, years){
      const r = (Math.max(0, ratePct)/100)/12;
      const n = Math.max(1, Math.round(years*12));
      if (r === 0) return loan / n;
      return loan * (r / (1 - Math.pow(1+r, -n)));
    }

    function year1Amortization(loan, ratePct, years){
      const r = (Math.max(0, ratePct)/100)/12;
      const n = Math.max(1, Math.round(years*12));
      const m = annuityMonthly(loan, ratePct, years);
      let capital = loan, principalYear = 0, interestYear = 0;
      for(let i=0;i<12;i++){
        const interest = capital * r;
        const principal = m - interest;
        interestYear += interest;
        principalYear += principal;
        capital = Math.max(0, capital - principal);
      }
      return {principalYear, interestYear, monthly:m};
    }

    function compute(){
      // Inputs
      const PRIX = parseFloat(byId('ac-prix').value||'0');
      const NOT  = parseFloat(byId('ac-not').value||'0');
      const AG   = parseFloat(byId('ac-ag').value||'0');
      const TRAV = parseFloat(byId('ac-trav').value||'0');

      const LOYm = parseFloat(byId('ex-loy').value||'0');
      const VAC  = parseFloat(byId('ex-vac').value||'0');
      const CHGa = parseFloat(byId('ex-chg').value||'0');
      const TF   = parseFloat(byId('ex-tf').value||'0');
      const GES  = parseFloat(byId('ex-gest').value||'0');
      const OPEXspec = parseFloat(byId('ex-opex').value||'0');

      const LTV  = parseFloat(byId('cr-ltv').value||'0');
      const TAUX = parseFloat(byId('cr-taux').value||'0');
      const DUR  = parseFloat(byId('cr-duree').value||'0');
      const ASSU = parseFloat(byId('cr-assu').value||'0');

      // Acquisition
      const COST = acquisitionCost(PRIX, NOT, AG, TRAV);
      const RENTa = LOYm * 12;

      // Exploitation
      const EGI  = egi(RENTa, VAC);
      const NOI  = noi(EGI, CHGa, TF, GES, OPEXspec, RENTa);
      const CAP_RATE = COST>0 ? NOI/COST : 0;

      // Crédit
      const LOAN = Math.max(0, COST * (Math.max(0, LTV)/100));
      const EQUITY = Math.max(0, COST - LOAN);
      const {principalYear, interestYear, monthly} = year1Amortization(LOAN, TAUX, DUR);
      const ASSUan = (Math.max(0, ASSU)/100) * LOAN; // approx assurance annuelle
      const DEBTan = monthly*12 + ASSUan;

      // Indicateurs
      const DSCR = DEBTan>0 ? NOI / DEBTan : 0;
      const CoC  = EQUITY>0 ? ( (NOI - DEBTan) / EQUITY ) : 0;           // cash-on-cash
      const ROE  = EQUITY>0 ? ( (NOI - interestYear) / EQUITY ) : 0;     // ROE pedago (après intérêts)
      const AMORT = principalYear; // capital remboursé année 1

      const leverageSign = (CAP_RATE*100 > TAUX) ? 'positif' : (CAP_RATE*100 < TAUX ? 'négatif' : 'neutre');

      // Rendu
      const tbody = document.querySelector('#lev-table tbody');
      tbody.innerHTML = '';
      const rows = [
        ['Coût d’acquisition', '€ '+fmt0(COST)],
        ['Loyers annuels bruts', '€ '+fmt0(RENTa)],
        ['Revenu effectif (EGI)', '€ '+fmt0(EGI)],
        ['NOI (net d’exploitation)', '€ '+fmt0(NOI)],
        ['Cap rate (NOI/Coût)', (CAP_RATE*100).toFixed(2)+' %'],
        ['Montant emprunté (LTV)', '€ '+fmt0(LOAN)+' ('+LTV.toFixed(1)+' %)'],
        ['Apport (fonds propres)', '€ '+fmt0(EQUITY)],
        ['Mensualité (hors assu.)', '€ '+fmt2(monthly)],
        ['Assurance emprunteur (annuel, approx.)', '€ '+fmt0(ASSUan)],
        ['Annuité totale (avec assu.)', '€ '+fmt0(DEBTan)],
        ['DSCR (NOI / Annuité)', DSCR.toFixed(2)],
        ['Cash-on-cash (CoC)', (CoC*100).toFixed(2)+' %'],
        ['ROE (après intérêts, année 1)', (ROE*100).toFixed(2)+' %'],
        ['Amortissement remboursé (année 1)', '€ '+fmt0(AMORT)],
        ['Lecture rapide', '<span class="'+(leverageSign==='positif'?'text-emerald-700':(leverageSign==='négatif'?'text-rose-600':'text-slate-700'))+'">Levier '+leverageSign+'</span> (cap rate '+(CAP_RATE*100).toFixed(2)+' % vs taux '+TAUX.toFixed(2)+' %)'],
      ];
      rows.forEach(r=>{
        const tr = document.createElement('tr');
        const td1 = document.createElement('td'); td1.className='border px-3 py-2 font-medium'; td1.innerHTML=r[0];
        const td2 = document.createElement('td'); td2.className='border px-3 py-2'; td2.innerHTML=r[1];
        tr.appendChild(td1); tr.appendChild(td2); tbody.appendChild(tr);
      });

      // Stress tests
      function recomputeWith(loyFactor=1, tauxShiftPct=0){
        const RENTa2 = RENTa * loyFactor;
        const EGI2 = egi(RENTa2, VAC);
        const NOI2 = noi(EGI2, CHGa, TF, GES, OPEXspec, RENTa2);
        const monthly2 = annuityMonthly(LOAN, TAUX + tauxShiftPct, DUR);
        const ASSUan2 = ASSUan; // inchangée (approx.)
        const DEBTan2 = monthly2*12 + ASSUan2;
        const CoC2 = EQUITY>0 ? ( (NOI2 - DEBTan2) / EQUITY ) : 0;
        const CAP2 = COST>0 ? NOI2/COST : 0;
        const DSCR2 = DEBTan2>0 ? NOI2/DEBTan2 : 0;
        return {CoC2, CAP2, DSCR2};
      }

      const stress = document.getElementById('lev-stress');
      const s1 = recomputeWith(0.95,  0);
      const s2 = recomputeWith(1.05,  0);
      const s3 = recomputeWith(1.00, +1.00);
      const s4 = recomputeWith(1.00, -1.00);
      stress.innerHTML = `
        <table class="w-full">
          <thead><tr><th class="text-left py-1">Scénario</th><th class="text-left py-1">Cap rate</th><th class="text-left py-1">DSCR</th><th class="text-left py-1">CoC</th></tr></thead>
          <tbody>
            <tr><td class="py-1">Loyers -5%</td><td>${(s1.CAP2*100).toFixed(2)} %</td><td>${s1.DSCR2.toFixed(2)}</td><td>${(s1.CoC2*100).toFixed(2)} %</td></tr>
            <tr><td class="py-1">Loyers +5%</td><td>${(s2.CAP2*100).toFixed(2)} %</td><td>${s2.DSCR2.toFixed(2)}</td><td>${(s2.CoC2*100).toFixed(2)} %</td></tr>
            <tr><td class="py-1">Taux +100 bps</td><td>${(s3.CAP2*100).toFixed(2)} %</td><td>${s3.DSCR2.toFixed(2)}</td><td>${(s3.CoC2*100).toFixed(2)} %</td></tr>
            <tr><td class="py-1">Taux -100 bps</td><td>${(s4.CAP2*100).toFixed(2)} %</td><td>${s4.DSCR2.toFixed(2)}</td><td>${(s4.CoC2*100).toFixed(2)} %</td></tr>
          </tbody>
        </table>
      `;
    }

    document.addEventListener('input', (e)=>{ if(e.target.closest('#calco')) compute(); });
    compute();
  })();
```

</details>
