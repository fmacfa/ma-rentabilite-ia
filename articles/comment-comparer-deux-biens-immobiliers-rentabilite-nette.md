# Comment comparer deux biens immobiliers avec la rentabilité nette ?

Publié le 2025-09-22 sur ma-rentabilite.fr. [Article d’origine](https://ma-rentabilite.fr/article/comment-comparer-deux-biens-immobiliers-rentabilite-nette)

## Introduction

Pour départager deux opportunités, la **rentabilité nette** (hors financement et impôts) est une mesure simple et robuste.
Elle s’appuie sur le *revenu net d’exploitation* (**NOI**) ramené au **coût d’acquisition**.

**Définition (pédagogique)** :
*Rentabilité nette* = **NOI / Coût d’acquisition**, où

NOI = *loyers annuels effectifs* − *charges non récupérables* − *taxe foncière nette TEOM* − *gestion* − *assurance bailleur/PNO* − *autres OPEX*.

## Normaliser la comparaison

- **Vacance locative** : applique le même *taux de vacance* aux deux biens (ou des hypothèses justifiées).
- **Gestion & assurance** : aligne les % (gestion, PNO/GLI, etc.).
- **Taxe foncière nette** : soustrais la *TEOM récupérable* pour ne garder que la part propriétaire.
- **Coût d’acquisition** : prix + notaire + agence + *travaux initiaux* nécessaires à la mise en location.

## Interprétation

- Un écart de **+0,5 à +1,0 pt** de rentabilité nette est souvent significatif à paramètres identiques.
- Complète l’analyse par un **stress test** (loyers −5/−10 %, charges +10 %).

## Comparateur interactif — Bien A vs Bien B

Renseigne les **prix & frais**, **loyers**, et **charges**.
Les **hypothèses communes** (vacance, gestion, assurance %) s’appliquent aux deux biens.
Le module calcule le **NOI**, la **rentabilité nette**, le **net mensuel** (avant financement) et la **sensibilité** ±5/±10 % sur le loyer.

### Hypothèses communes

Vacance locative (%)
5

Gestion locative (%) du loyer
6

Assurance PNO/GLI (%) du loyer
2

Autres OPEX (€/an)
300
Entretien courant, petites fournitures…

TEOM récupérable ?
Oui (déduite de la TF)

### Bien A

Prix (€)
180000
Notaire (%)
8
Agence (€)
0
Travaux initiaux (€)
8000
Loyer potentiel (€/mois)
900

Charges non récup. (€/an)
700
Taxe foncière totale (€/an)
1200
Dont TEOM (€/an)
180
Autres OPEX spé. (€/an)
0

### Bien B

Prix (€)
195000
Notaire (%)
8
Agence (€)
5000
Travaux initiaux (€)
4000
Loyer potentiel (€/mois)
980

Charges non récup. (€/an)
800
Taxe foncière totale (€/an)
1350
Dont TEOM (€/an)
200
Autres OPEX spé. (€/an)
0

| Indicateur | Bien A | Bien B | Écart (B − A) |
| --- | --- | --- | --- |
| — | | | |

#### Sensibilité loyer — Bien A

#### Sensibilité loyer — Bien B

Hypothèses pédagogiques : la TEOM est considérée récupérable si "Oui"; le calcul est hors financement et fiscalité IR/PS.
Le but est de comparer l'efficacité opérationnelle pure (NOI) rapportée au coût d'acquisition.

## Conseils pratiques

- **Valide** le loyer potentiel avec des *comparables* récents.
- **Stress-teste** la vacance (+2–3 pts) et les charges (+10 %).
- **Ajoute** une colonne “travaux récurrents” si le bien B nécessite plus de CapEx (copropriété, toiture, chaudière…).

## Conclusion

La **rentabilité nette** te donne une comparaison *à paramètres normalisés*.
Complète ensuite avec le **cashflow** (avec financement) et, in fine, le **TRI** sur la durée de détention pour une décision totalement éclairée.

### Passer à la pratique

Projette tes deux biens dans le simulateur complet — gratuit, anonyme, sans inscription — et exporte ton bilan.

<details>
<summary>Formules du calculateur publié avec cet article (JavaScript historique)</summary>

```javascript
// ====== Comparateur A vs B : Rentabilité nette ======
  (function compareNetYield(){
    const byId = (id)=>document.getElementById(id);
    const fmt0 = (x)=> x.toLocaleString('fr-FR',{maximumFractionDigits:0});
    const fmt1 = (x)=> x.toLocaleString('fr-FR',{minimumFractionDigits:1, maximumFractionDigits:1});
    const fmt2 = (x)=> x.toLocaleString('fr-FR',{minimumFractionDigits:2, maximumFractionDigits:2});

    function acquisitionCost(price, notPct, agency, initWorks){
      const notary = price * (Math.max(0, notPct)/100);
      return price + notary + Math.max(0, agency) + Math.max(0, initWorks);
    }

    function egi(annualRent, vacPct){
      return annualRent * (1 - Math.max(0, vacPct)/100);
    }

    function teomNet(tf, teom, teomRecoverable){
      return Math.max(0, tf - (teomRecoverable ? Math.min(tf, Math.max(0, teom)) : 0));
    }

    function noi(egi, nonRecCharges, tfNet, mgmtPct, insPct, annualRent, otherOpexCommon, otherOpexSpecific){
      const mgmt = (Math.max(0, mgmtPct)/100) * annualRent;
      const ins  = (Math.max(0, insPct)/100) * annualRent;
      return egi - (Math.max(0, nonRecCharges) + Math.max(0, tfNet) + mgmt + ins + Math.max(0, otherOpexCommon) + Math.max(0, otherOpexSpecific));
    }

    function computeOne(prefix){
      const PRIX = parseFloat(byId(prefix+'-prix').value||'0');
      const NOT  = parseFloat(byId(prefix+'-not').value||'0');
      const AG   = parseFloat(byId(prefix+'-ag').value||'0');
      const TRAV = parseFloat(byId(prefix+'-trav').value||'0');
      const LOYM = parseFloat(byId(prefix+'-loy').value||'0');
      const CHGA = parseFloat(byId(prefix+'-chg').value||'0');
      const TF   = parseFloat(byId(prefix+'-tf').value||'0');
      const TEOM = parseFloat(byId(prefix+'-teom').value||'0');
      const OPEX = parseFloat(byId(prefix+'-opex').value||'0');

      const VAC = parseFloat(byId('g-vac').value||'0');
      const GES = parseFloat(byId('g-gest').value||'0');
      const ASS = parseFloat(byId('g-assu').value||'0');
      const OCOM= parseFloat(byId('g-opex').value||'0');
      const TEOMOK = byId('g-teom').value === '1';

      const COST = acquisitionCost(PRIX, NOT, AG, TRAV);
      const Rann = LOYM * 12;
      const EGI  = egi(Rann, VAC);
      const TFN  = teomNet(TF, TEOM, TEOMOK);
      const NOI  = noi(EGI, CHGA, TFN, GES, ASS, Rann, OCOM, OPEX);
      const NETm = NOI/12;
      const Ynet = COST>0 ? (NOI / COST) : 0;

      return { COST, Rann, EGI, TFN, NOI, NETm, Ynet };
    }

    function renderSens(elId, base, mutateRentPct){
      const el = document.getElementById(elId);
      const steps = [-10,-5,0,5,10];
      let html = '<table class="w-full text-sm"><thead><tr><th class="text-left py-1">Δ Loyers</th><th class="text-left py-1">NOI (€/an)</th><th class="text-left py-1">Rentab. nette</th></tr></thead><tbody>';
      steps.forEach(s=>{
        const f = 1 + s/100;
        const NOI = base.NOI * f; // approximation linéaire sur loyers -> NOI
        const Y   = base.COST>0 ? NOI/base.COST : 0;
        html += '<tr><td class="py-1">'+(s>0?'+':'')+s+'%</td><td>€ '+(NOI).toLocaleString('fr-FR',{maximumFractionDigits:0})+'</td><td>'+ (Y*100).toFixed(2) +' %</td></tr>';
      });
      html += '</tbody></table>';
      el.innerHTML = html;
    }

    function compute(){
      const A = computeOne('a');
      const B = computeOne('b');

      const tbody = document.querySelector('#cmp-table tbody');
      tbody.innerHTML = '';
      const rows = [
        ['Coût d’acquisition', '€ '+fmt0(A.COST), '€ '+fmt0(B.COST), (B.COST-A.COST>=0?'+':'')+'€ '+fmt0(B.COST - A.COST)],
        ['Loyers annuels bruts', '€ '+fmt0(A.Rann), '€ '+fmt0(B.Rann), (B.Rann-A.Rann>=0?'+':'')+'€ '+fmt0(B.Rann - A.Rann)],
        ['Revenu effectif (EGI)', '€ '+fmt0(A.EGI), '€ '+fmt0(B.EGI), (B.EGI-A.EGI>=0?'+':'')+'€ '+fmt0(B.EGI - A.EGI)],
        ['Taxe foncière <em>nette</em>', '€ '+fmt0(A.TFN), '€ '+fmt0(B.TFN), (B.TFN-A.TFN>=0?'+':'')+'€ '+fmt0(B.TFN - A.TFN)],
        ['NOI (net d’exploitation, annuel)', (A.NOI>=0?'<span class="text-emerald-700">€ '+fmt0(A.NOI)+'</span>':'<span class="text-rose-600">€ '+fmt0(A.NOI)+'</span>'),
                                            (B.NOI>=0?'<span class="text-emerald-700">€ '+fmt0(B.NOI)+'</span>':'<span class="text-rose-600">€ '+fmt0(B.NOI)+'</span>'),
                                            (B.NOI-A.NOI>=0?'<span class="text-emerald-700">+ € '+fmt0(B.NOI - A.NOI)+'</span>':'<span class="text-rose-600">- € '+fmt0(Math.abs(B.NOI - A.NOI))+'</span>')],
        ['Net mensuel (avant financement)', (A.NETm>=0?'<span class="text-emerald-700">€ '+fmt2(A.NETm)+'/mois</span>':'<span class="text-rose-600">€ '+fmt2(A.NETm)+'/mois</span>'),
                                             (B.NETm>=0?'<span class="text-emerald-700">€ '+fmt2(B.NETm)+'/mois</span>':'<span class="text-rose-600">€ '+fmt2(B.NETm)+'/mois</span>'),
                                             (B.NETm-A.NETm>=0?'<span class="text-emerald-700">+ € '+fmt2(B.NETm - A.NETm)+'/mois</span>':'<span class="text-rose-600">- € '+fmt2(Math.abs(B.NETm - A.NETm))+'/mois</span>')],
        ['Rentabilité nette', (A.Ynet*100).toFixed(2)+' %', (B.Ynet*100).toFixed(2)+' %',
                              ((B.Ynet-A.Ynet)>=0?'+':'')+( (B.Ynet-A.Ynet)*100 ).toFixed(2)+' pts'],
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

      renderSens('sens-a', A);
      renderSens('sens-b', B);
    }

    document.addEventListener('input', (e)=>{ if(e.target.closest('#calco')) compute(); });
    compute();
  })();
```

</details>
