# Cashflow positif vs cashflow négatif : que choisir ?

Publié le 2025-09-22 sur ma-rentabilite.fr. [Article d’origine](https://ma-rentabilite.fr/article/cashflow-positif-vs-negatif-que-choisir)

> **Mise à jour du 23 novembre 2026.** Pour les revenus locatifs 2026 relevant des prélèvements sur le patrimoine, le taux de référence est de 17,2 % en location nue et de 18,6 % en location meublée. En meublé de longue durée, le seuil micro-BIC 2026 est de 83 600 €. Les chiffres de l’exemple d’origine restent rattachés à sa date. [Règles et sources officielles](../docs/fiscalite.md)

## Introduction

Le **cashflow** est la *trésorerie mensuelle* qui reste après toutes tes dépenses (prêt, charges, impôts).
On oppose souvent **cashflow positif** (le bien s’autofinance et génère un surplus) à **cashflow négatif**
(chaque mois, tu dois remettre de l’argent). Faut-il toujours viser le positif ? Pas forcément : tout dépend de **tes objectifs**,
de **ton horizon**, de **ta capacité d’épargne** et du **risque** que tu acceptes.

**Définitions** :

- *Cashflow avant impôt (CF₀)* = loyers nets d’exploitation − mensualité du prêt.
- *Cashflow après impôt (CF)* = CF₀ − impôt estimé (modèle simplifié).
- *DSCR* (Debt Service Coverage Ratio) = **NOI / Annuité de dette**, indicateur de marge de sécurité.

## Quand viser du cashflow positif ?

- Tu veux **sécuriser** ta trésorerie et limiter le risque (vacance, travaux, impôts).
- Tu construis un **parc** vite : des biens qui s’autofinancent évitent l’asphyxie mensuelle.
- Tu es en phase de **taux élevés** : la marge protège en cas d’imprévu.

## Quand tolérer un léger cashflow négatif ?

- Le bien présente un **fort potentiel** (localisation, tension locative, revalorisation des loyers).
- Tu vises un **gain patrimonial** (appréciation, capital remboursé) supérieur au déficit de trésorerie.
- Tu as une **capacité d’épargne** confortable et une **visibilité** sur les risques.

**Attention** : un cashflow négatif n’est acceptable que s’il est *volontaire*, *mesuré*, et *finançable*
dans la durée (buffer de sécurité, plan de sortie, scénarios dégradés testés).

## Règles de décision (pratiques)

- **DSCR ≥ 1,20** : marge confortable ; **1,05–1,20** : vigilance ; **< 1,00** : déficit opérationnel.
- **Seuil de loyer** : calcule le loyer minimum pour CF₀ = 0 ; compare au marché (est-ce réaliste ?).
- **Tolérance à la vacance** : combien de % de vacance le bien supporte avant CF₀ < 0 ?
- **Stress test** : loyers −5/−10 %, charges +10 % → le projet tient-il encore ?

## Calculateur interactif — Cashflow, DSCR & seuils

Renseigne tes hypothèses. Le calculateur affiche le **cashflow** (avant/après impôt), le **DSCR**,
le **loyer d’équilibre** (CF₀ = 0), et la **tolérance à la vacance** avant que le CF₀ devienne négatif.
Le module propose aussi un **stress test** simple.

Loyer HC (€/mois)
950

Vacance locative (%)
5
Pertes de loyers / impayés / turnover.

Mensualité prêt + assur. (€/mois)
720

Charges non récup. (€/mois)
120
PNO/GLI, syndic non récup., entretien courant…

Taxe foncière nette TEOM (€/an)
980

Gestion + assurance (%) du loyer
8
Gestion délég., PNO/GLI en % du loyer.

Option — Impôt approximatif

TMI (%)
30

Prélèvements sociaux (%)
17.2

Modèle simplifié : base imposable ≈ loyers effectifs − charges opérationnelles (hors intérêts détaillés).

| Indicateur | Valeur |
| --- | --- |
| — | |

#### Stress test (rapide)

Simplifications : calculs pédagogiques, pas de décote/CGI détaillé, pas de distinction intérêts vs amortissements,
fiscalité approchée par TMI+PS sur une base simplifiée. Utilise le simulateur complet pour une projection fidèle.

## Comment décider ?

1. Teste ton projet avec des **hypothèses prudentes** (vacance, charges).
2. Vérifie **DSCR**, **seuil de loyer** et **tolérance à la vacance**.
3. Si tu acceptes un **léger déficit**, *budgete-le* sur 24 mois et définis un **plan** (hausse de loyer, travaux, bascule de régime fiscal, renégociation de taux).

## Conclusion

Le **cashflow positif** n’est pas un dogme, mais une **marge de sécurité** très utile.
Un **léger négatif** peut se défendre avec une stratégie patrimoniale claire, des hypothèses réalistes et des **buffers** de trésorerie.

### Passer à la pratique

Projette tes chiffres dans le simulateur complet — gratuit, anonyme, sans inscription — et exporte ton bilan.

<details>
<summary>Formules du calculateur publié avec cet article (JavaScript historique)</summary>

```javascript
// ====== Calculateur Cashflow & DSCR ======
  (function cfCalc(){
    const byId = (id)=>document.getElementById(id);
    const fmt0 = (x)=> x.toLocaleString('fr-FR',{maximumFractionDigits:0});
    const fmt2 = (x)=> x.toLocaleString('fr-FR',{minimumFractionDigits:2, maximumFractionDigits:2});

    function compute(){
      const LOYm = parseFloat(byId('cf-loyer').value || '0');     // €/mois HC
      const VAC  = (parseFloat(byId('cf-vac').value || '0')/100);
      const MEN  = parseFloat(byId('cf-mensu').value || '0');     // €/mois

      const CHGm = parseFloat(byId('cf-chg').value || '0');       // €/mois non récup.
      const TFan = parseFloat(byId('cf-tfnet').value || '0');     // €/an net TEOM
      const GAp  = (parseFloat(byId('cf-gestass').value || '0')/100); // % loyer

      const TMI  = (parseFloat(byId('cf-tmi')?.value || '0')/100);
      const PS   = (parseFloat(byId('cf-ps')?.value  || '0')/100);

      // Revenus effectifs (vacance)
      const LOYeff_m = LOYm * (1 - VAC);
      const LOYeff_a = LOYeff_m * 12;

      // Charges opérationnelles annuelles (hors dette)
      const GA_a  = LOYm * 12 * GAp;    // gestion + assur % du loyer brut
      const CHG_a = CHGm * 12;          // autres charges non récup.
      const TF_a  = TFan;               // TF nette
      const OPEX  = GA_a + CHG_a + TF_a;

      // NOI annuel et mensuel
      const NOI_a = LOYeff_a - OPEX;
      const NOI_m = NOI_a / 12;

      // Annuité dette
      const DEBT_a = MEN * 12;

      // Cashflow avant impôt
      const CF0_m = NOI_m - MEN;

      // Base imposable (approximative, pédagogique)
      const baseIR = Math.max(0, NOI_a); // ≈ loyers effectifs − OPEX (hors intérêts détaillés)
      const impAn  = baseIR * (TMI + PS);
      const imp_m  = impAn / 12;

      // Cashflow après impôt (approx.)
      const CF_m = CF0_m - imp_m;

      // DSCR
      const DSCR = DEBT_a>0 ? (NOI_a / DEBT_a) : 0;

      // Loyer d'équilibre (CF0=0) : NOI_m = MEN -> LOY_eq_m ?
      // NOI_m = LOYm*(1-VAC) - (GA%*LOYm) - CHGm - TF/12
      // => NOI_m = LOYm*(1 - VAC - GAp) - (CHGm + TF/12)
      const denom = (1 - VAC - GAp);
      const LOYeq_m = denom>0 ? ( (CHGm + TFan/12) + MEN ) / denom : Infinity;

      // Tolérance à la vacance avant CF0<0 : résoudre CF0_m = 0 pour VAC
      // CF0_m = LOYm*(1 - VAC) - GA%*LOYm - CHGm - TF/12 - MEN
      // => VAC*LOYm = LOYm*(1 - GAp) - (CHGm + TF/12 + MEN)
      const numVac = (LOYm*(1 - GAp) - (CHGm + TFan/12 + MEN));
      const VACtol = LOYm>0 ? Math.max(0, Math.min(1, numVac / LOYm)) : 0;

      // Stress : loyers -10% / +10%
      function cfWithRentFactor(f){
        const LOYm2 = LOYm * f;
        const LOYeff_a2 = (LOYm2 * (1 - VAC)) * 12;
        const GA_a2 = (LOYm2 * 12) * GAp;
        const NOI_a2 = LOYeff_a2 - (GA_a2 + CHG_a + TF_a);
        const CF0_m2 = (NOI_a2/12) - MEN;
        return CF0_m2;
      }

      const tbody = document.querySelector('#cf-table tbody');
      tbody.innerHTML = '';
      const rows = [
        ['Loyers effectifs (vacance incluse)', '€ '+fmt0(LOYeff_a)+' /an'],
        ['Charges opérationnelles (OPEX)', '€ '+fmt0(OPEX)+' /an'],
        ['NOI (net d’exploitation)', '€ '+fmt0(NOI_a)+' /an'],
        ['Annuité de dette', '€ '+fmt0(DEBT_a)+' /an'],
        ['DSCR (NOI / Dette)', DSCR.toFixed(2)],
        ['Cashflow <em>avant impôt</em>', (CF0_m>=0?'<span class="text-emerald-700">€ '+fmt2(CF0_m)+'/mois</span>':'<span class="text-rose-600">€ '+fmt2(CF0_m)+'/mois</span>')],
        ['Impôt estimé (approximatif)', '€ '+fmt0(impAn)+' /an'],
        ['Cashflow <em>après impôt</em> (approx.)', (CF_m>=0?'<span class="text-emerald-700">€ '+fmt2(CF_m)+'/mois</span>':'<span class="text-rose-600">€ '+fmt2(CF_m)+'/mois</span>')],
        ['Loyer d’équilibre (CF₀=0)', (isFinite(LOYeq_m)?'€ '+fmt2(LOYeq_m)+'/mois':'—')],
        ['Tolérance à la vacance avant CF₀<0', (VACtol*100).toFixed(1)+' %'],
      ];
      rows.forEach(r=>{
        const tr = document.createElement('tr');
        const td1 = document.createElement('td'); td1.className='border px-3 py-2 font-medium'; td1.innerHTML=r[0];
        const td2 = document.createElement('td'); td2.className='border px-3 py-2'; td2.innerHTML=r[1];
        tr.appendChild(td1); tr.appendChild(td2); tbody.appendChild(tr);
      });

      const stress = document.getElementById('cf-stress');
      const cf_m_m10 = cfWithRentFactor(0.90);
      const cf_m_m05 = cfWithRentFactor(0.95);
      const cf_m_p05 = cfWithRentFactor(1.05);
      const cf_m_p10 = cfWithRentFactor(1.10);
      stress.innerHTML = `
        <table class="w-full">
          <thead><tr><th class="text-left py-1">Scénario</th><th class="text-left py-1">CF₀ (€/mois)</th></tr></thead>
          <tbody>
            <tr><td class="py-1">Loyers -10%</td><td>${cf_m_m10>=0?'<span class="text-emerald-700">€ ${fmt2(cf_m_m10)}</span>':'<span class="text-rose-600">€ ${fmt2(cf_m_m10)}</span>'}</td></tr>
            <tr><td class="py-1">Loyers -5%</td><td>${cf_m_m05>=0?'<span class="text-emerald-700">€ ${fmt2(cf_m_m05)}</span>':'<span class="text-rose-600">€ ${fmt2(cf_m_m05)}</span>'}</td></tr>
            <tr><td class="py-1">Loyers +5%</td><td>€ ${fmt2(cf_m_p05)}</td></tr>
            <tr><td class="py-1">Loyers +10%</td><td>€ ${fmt2(cf_m_p10)}</td></tr>
          </tbody>
        </table>
      `;
    }

    document.addEventListener('input', (e)=>{ if(e.target.closest('#calco')) compute(); });
    compute();
  })();
```

</details>
