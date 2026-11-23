# Investir en immobilier neuf vs ancien : impact sur la rentabilité

Publié le 2025-09-22 sur ma-rentabilite.fr. [Article d’origine](https://ma-rentabilite.fr/article/immobilier-neuf-vs-ancien-impact-rentabilite)

## Introduction

**Neuf** ou **Ancien** ? La question revient souvent. Le Neuf propose des *frais de notaire réduits*,
une meilleure *performance énergétique* et potentiellement moins d’entretien au départ. L’Ancien offre souvent un *prix d’achat* et des *loyers au m²* différents,
avec des *travaux* à prévoir mais aussi des opportunités de **création de valeur** (rénovation, optimisation des surfaces).
L’essentiel est d’objectiver : **coût d’acquisition** vs **revenu net d’exploitation (NOI)** et **cashflow**.

**Méthode** : on calcule le *NOI* (loyers effectifs − charges non récup. − TF nette − gestion/assurance − autres OPEX) puis :

- **Rentabilité nette** = NOI / *coût d’acquisition* (hors dette et IR).
- **Cashflow** = NOI/12 − mensualité (si tu compares aussi le financement).
- **DSCR** = NOI / annuité de dette ; **CoC** = (NOI − annuité) / apport.

## Différences structurantes

- **Frais de notaire** : plus faibles en Neuf, plus élevés en Ancien.
- **Travaux initiaux** : souvent faibles en Neuf, variables en Ancien (rafraîchissement à rénovation lourde).
- **Charges d’exploitation** : PNO/GLI, syndic non récup., entretien ; au départ souvent plus faibles en Neuf.
- **Taxe foncière** : possibilité d’*exonération temporaire* partielle/totale dans certaines communes pour le Neuf (à vérifier localement).
- **Loyers** : peuvent différer selon marché, prestations, localisation précise.

**Attention** : les dispositifs fiscaux locaux (exonération TF) et l’état de la copropriété impactent fortement la rentabilité.
Vérifie toujours *les avis, règlements de copropriété et budgets prévisionnels* avant d’arrêter ton choix.

## Comparateur interactif — Neuf vs Ancien

Entre tes hypothèses pour chaque scénario. Les **paramètres communs** (vacance, gestion/assurance %, crédit)
s’appliquent aux deux pour une comparaison à base identique. Tu obtiens **NOI**, **rentabilité nette**,
**cashflow**, **DSCR** et **CoC**. Le Neuf inclut une option pédagogique d’**exonération TF (2 ans)**.

### Hypothèses communes

Vacance locative (%)
5

Gestion locative (%) du loyer
6

Assurance (PNO/GLI) (%) du loyer
2

Crédit — LTV (%)
90
Part du coût financée par le prêt.

Crédit — Taux / Durée

4
25

% annuel — années

### Scénario Neuf

Prix (€)
210000
Notaire (%)
2.5
Hypothèse pédagogique.
Agence (€)
0
Travaux initiaux (€)
1000
Loyer potentiel (€/mois)
950

Charges non récup. (€/an)
700
Taxe foncière totale (€/an)
1200
Dont TEOM (€/an)
200
Récupérable en principe.
Autres OPEX spé. (€/an)
0
Exonération TF 2 ans ?
Oui (pédagogique)
À confirmer auprès de ta commune.

### Scénario Ancien

Prix (€)
185000
Notaire (%)
8
Agence (€)
5000
Travaux initiaux (€)
15000
Loyer potentiel (€/mois)
980

Charges non récup. (€/an)
1100
Taxe foncière totale (€/an)
1350
Dont TEOM (€/an)
220
Autres OPEX spé. (€/an)
200

—

Pas d’exonération TF par défaut.

| Indicateur | Neuf | Ancien | Écart (Ancien − Neuf) |
| --- | --- | --- | --- |
| — | | | |

#### Lecture rapide — Neuf

#### Lecture rapide — Ancien

Hypothèses pédagogiques : TEOM supposée récupérable si incluse, donc TF *nette* = TF − TEOM.
Exonération TF 2 ans pour le Neuf modélisée de façon simple (année 1 = 0). Les règles locales varient.

## Conseils pratiques

- **Compare à base identique** (vacance, gestion, % assurance) pour isoler l’effet *Neuf vs Ancien*.
- **Vérifie** les *budgets prévisionnels* de copropriété et l’*état des équipements* (toiture, chaudière, ascenseur).
- **Stress-test** loyers (−5/−10 %) et charges (+10 %) avant de trancher.

## Conclusion

Le Neuf peut gagner en **simplicité** (frais réduits, entretien limité, éventuelle exonération TF) mais l’Ancien
peut offrir une **meilleure rentabilité** via prix d’entrée, optimisation des travaux et potentiel de revalorisation.
Décide avec des chiffres normalisés (NOI, cashflow, DSCR, CoC) plutôt qu’avec des a priori.

### Passer à la pratique

Projette tes deux scénarios dans le simulateur complet — gratuit, anonyme, sans inscription — et exporte ton bilan.

<details>
<summary>Formules du calculateur publié avec cet article (JavaScript historique)</summary>

```javascript
// ====== Comparateur Neuf vs Ancien ======
  (function compareNeufAncien(){
    const byId = (id)=>document.getElementById(id);
    const fmt0 = (x)=> x.toLocaleString('fr-FR',{maximumFractionDigits:0});
    const fmt1 = (x)=> x.toLocaleString('fr-FR',{minimumFractionDigits:1, maximumFractionDigits:1});
    const fmt2 = (x)=> x.toLocaleString('fr-FR',{minimumFractionDigits:2, maximumFractionDigits:2});

    function acquisitionCost(price, notPct, agency, initWorks){
      const notary = price * (Math.max(0, notPct)/100);
      return Math.max(0, price) + Math.max(0, notary) + Math.max(0, agency) + Math.max(0, initWorks);
    }
    function egi(annualRent, vacPct){ return annualRent * (1 - Math.max(0, vacPct)/100); }
    function tfNet(tf, teom, teomRecoverable=true){
      return Math.max(0, tf - (teomRecoverable ? Math.min(tf, Math.max(0, teom)) : 0));
    }
    function noi(egi, nonRecCharges, tfNet, mgmtPct, insPct, annualRent, otherOpex){
      const mgmt = (Math.max(0, mgmtPct)/100) * annualRent;
      const ins  = (Math.max(0, insPct)/100) * annualRent;
      return egi - (Math.max(0, nonRecCharges) + Math.max(0, tfNet) + mgmt + ins + Math.max(0, otherOpex));
    }
    function annuityMonthly(loan, ratePct, years){
      const r = (Math.max(0, ratePct)/100)/12;
      const n = Math.max(1, Math.round(years*12));
      if(r===0) return loan/n;
      return loan * (r / (1 - Math.pow(1+r, -n)));
    }

    function computeOne(prefix, exoTF){
      const PRIX = parseFloat(byId(prefix+'-prix').value||'0');
      const NOT  = parseFloat(byId(prefix+'-not').value||'0');
      const AG   = parseFloat(byId(prefix+'-ag').value||'0');
      const TRAV = parseFloat(byId(prefix+'-trav').value||'0');
      const LOYm = parseFloat(byId(prefix+'-loy').value||'0');
      const CHGa = parseFloat(byId(prefix+'-chg').value||'0');
      const TF   = parseFloat(byId(prefix+'-tf').value||'0');
      const TEOM = parseFloat(byId(prefix+'-teom').value||'0');
      const OPEX = parseFloat(byId(prefix+'-opex').value||'0');

      const VAC  = parseFloat(byId('g-vac').value||'0');
      const GES  = parseFloat(byId('g-gest').value||'0');
      const ASS  = parseFloat(byId('g-assu').value||'0');
      const LTV  = parseFloat(byId('g-ltv').value||'0');
      const TAUX = parseFloat(byId('g-taux').value||'0');
      const DUR  = parseFloat(byId('g-dur').value||'0');

      const COST = acquisitionCost(PRIX, NOT, AG, TRAV);
      const LOYa = LOYm * 12;
      const EGIv = egi(LOYa, VAC);
      let TFN = tfNet(TF, TEOM, true);
      if(exoTF){ TFN = 0; } // exo pédagogique "année 1"

      const NOIv = noi(EGIv, CHGa, TFN, GES, ASS, LOYa, OPEX);

      // Financement
      const LOAN = Math.max(0, COST * (Math.max(0, LTV)/100));
      const EQUITY = Math.max(0, COST - LOAN);
      const mensualite = annuityMonthly(LOAN, TAUX, DUR);
      const annuite = mensualite * 12;

      const NETm = (NOIv/12) - mensualite;
      const DSCR = annuite>0 ? (NOIv / annuite) : 0;
      const Ynet = COST>0 ? (NOIv / COST) : 0;
      const CoC  = EQUITY>0 ? ((NOIv - annuite)/EQUITY) : 0;

      return {COST, LOYa, EGIv, TFN, NOIv, mensualite, NETm, DSCR, Ynet, CoC, EQUITY, LOAN};
    }

    function compute(){
      const exo = (byId('n-tfexo').value === '1');
      const N = computeOne('n', exo);
      const A = computeOne('a', false);

      const tbody = document.querySelector('#cmp-table tbody');
      tbody.innerHTML = '';
      const rows = [
        ['Coût d’acquisition', '€ '+fmt0(N.COST), '€ '+fmt0(A.COST), (A.COST-N.COST>=0?'+':'')+'€ '+fmt0(A.COST - N.COST)],
        ['Loyers annuels bruts', '€ '+fmt0(N.LOYa), '€ '+fmt0(A.LOYa), (A.LOYa-N.LOYa>=0?'+':'')+'€ '+fmt0(A.LOYa - N.LOYa)],
        ['Revenu effectif (EGI)', '€ '+fmt0(N.EGIv), '€ '+fmt0(A.EGIv), (A.EGIv-N.EGIv>=0?'+':'')+'€ '+fmt0(A.EGIv - N.EGIv)],
        ['Taxe foncière <em>nette</em>', '€ '+fmt0(N.TFN)+(exo?' <span class="text-emerald-700">(exo)</span>':''), '€ '+fmt0(A.TFN), (A.TFN-N.TFN>=0?'+':'')+'€ '+fmt0(A.TFN - N.TFN)],
        ['NOI (annuel)', (N.NOIv>=0?'<span class="text-emerald-700">€ '+fmt0(N.NOIv)+'</span>':'<span class="text-rose-600">€ '+fmt0(N.NOIv)+'</span>'),
                         (A.NOIv>=0?'<span class="text-emerald-700">€ '+fmt0(A.NOIv)+'</span>':'<span class="text-rose-600">€ '+fmt0(A.NOIv)+'</span>'),
                         (A.NOIv-N.NOIv>=0?'<span class="text-emerald-700">+ € '+fmt0(A.NOIv - N.NOIv)+'</span>':'<span class="text-rose-600">- € '+fmt0(Math.abs(A.NOIv - N.NOIv))+'</span>')],
        ['Mensualité (crédit)', '€ '+fmt2(N.mensualite), '€ '+fmt2(A.mensualite),
          (A.mensualite-N.mensualite>=0?'<span class="text-emerald-700">- € '+fmt2(Math.abs(A.mensualite - N.mensualite))+'</span>':'<span class="text-rose-600">+ € '+fmt2(Math.abs(A.mensualite - N.mensualite))+'</span>')],
        ['Net mensuel (avant impôt)', (N.NETm>=0?'<span class="text-emerald-700">€ '+fmt2(N.NETm)+'</span>':'<span class="text-rose-600">€ '+fmt2(N.NETm)+'</span>'),
                                      (A.NETm>=0?'<span class="text-emerald-700">€ '+fmt2(A.NETm)+'</span>':'<span class="text-rose-600">€ '+fmt2(A.NETm)+'</span>'),
                                      (A.NETm-N.NETm>=0?'<span class="text-emerald-700">+ € '+fmt2(A.NETm - N.NETm)+'</span>':'<span class="text-rose-600">- € '+fmt2(Math.abs(A.NETm - N.NETm))+'</span>')],
        ['Rentabilité nette', (N.Ynet*100).toFixed(2)+' %', (A.Ynet*100).toFixed(2)+' %',
                              ((A.Ynet-N.Ynet)>=0?'+':'')+((A.Ynet-N.Ynet)*100).toFixed(2)+' pts'],
        ['DSCR (NOI/Annuité)', N.DSCR.toFixed(2), A.DSCR.toFixed(2), (A.DSCR-N.DSCR>=0?'+':'')+fmt1(A.DSCR - N.DSCR)],
        ['Cash-on-cash (CoC)', (N.CoC*100).toFixed(2)+' %', (A.CoC*100).toFixed(2)+' %',
                               ((A.CoC-N.CoC)>=0?'+':'')+((A.CoC-N.CoC)*100).toFixed(2)+' pts'],
        ['Apport (fonds propres)', '€ '+fmt0(N.EQUITY), '€ '+fmt0(A.EQUITY),
                                   (A.EQUITY-N.EQUITY>=0?'+':'')+'€ '+fmt0(A.EQUITY - N.EQUITY)],
      ];
      rows.forEach(r=>{
        const tr = document.createElement('tr');
        [r[0], r[1], r[2], r[3]].forEach((val, i)=>{
          const td = document.createElement('td');
          td.className = 'border px-3 py-2'+(i===0?' font-medium':'');
          td.innerHTML = val;
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      });

      // Résumés
      const resumeN = document.getElementById('resume-n');
      const resumeA = document.getElementById('resume-a');
      resumeN.innerHTML = `
        <ul class="list-disc ml-5">
          <li>Coût d'acquisition : € ${fmt0(N.COST)} | LTV ${byId('g-ltv').value}% → Emprunt € ${fmt0(N.LOAN)}.</li>
          <li>NOI : € ${fmt0(N.NOIv)} /an | Rentab. nette ${(N.Ynet*100).toFixed(2)} %.</li>
          <li>Mensualité : € ${fmt2(N.mensualite)} | DSCR ${N.DSCR.toFixed(2)} | Net mensuel ${N.NETm>=0?'<span class="text-emerald-700">€ '+fmt2(N.NETm)+'</span>':'<span class="text-rose-600">€ '+fmt2(N.NETm)+'</span>'}.</li>
          <li>CoC ${(N.CoC*100).toFixed(2)} % ${exo?'<span class="text-emerald-700">(TF exo)</span>':''}</li>
        </ul>`;
      resumeA.innerHTML = `
        <ul class="list-disc ml-5">
          <li>Coût d'acquisition : € ${fmt0(A.COST)} | LTV ${byId('g-ltv').value}% → Emprunt € ${fmt0(A.LOAN)}.</li>
          <li>NOI : € ${fmt0(A.NOIv)} /an | Rentab. nette ${(A.Ynet*100).toFixed(2)} %.</li>
          <li>Mensualité : € ${fmt2(A.mensualite)} | DSCR ${A.DSCR.toFixed(2)} | Net mensuel ${A.NETm>=0?'<span class="text-emerald-700">€ '+fmt2(A.NETm)+'</span>':'<span class="text-rose-600">€ '+fmt2(A.NETm)+'</span>'}.</li>
          <li>CoC ${(A.CoC*100).toFixed(2)} %</li>
        </ul>`;
    }

    document.addEventListener('input', (e)=>{ if(e.target.closest('#calco')) compute(); });
    compute();
  })();
```

</details>
