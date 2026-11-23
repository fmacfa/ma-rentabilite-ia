# Pourquoi utiliser un simulateur de rentabilité locative ?

Publié le 2025-09-23 sur ma-rentabilite.fr. [Article d’origine](https://ma-rentabilite.fr/article/pourquoi-utiliser-un-simulateur-de-rentabilite-locative)

> **Mise à jour du 23 novembre 2026.** Pour les revenus locatifs 2026 relevant des prélèvements sur le patrimoine, le taux de référence est de 17,2 % en location nue et de 18,6 % en location meublée. En meublé de longue durée, le seuil micro-BIC 2026 est de 83 600 €. Les chiffres de l’exemple d’origine restent rattachés à sa date. [Règles et sources officielles](../docs/fiscalite.md)

## Introduction

Entre le prix d’achat, les frais, le crédit, la vacance, les charges et la fiscalité, évaluer un projet
d’investissement locatif à la main devient vite un casse-tête. Un **simulateur de rentabilité**
te permet de *structurer* l’analyse, d’**éviter les erreurs courantes** et de **comparer**
des biens *à base identique*, en quelques minutes.

**Ce que tu gagnes** :

- **Précision** : rentabilités (brute, nette), *cashflow*, *DSCR*, TRI…
- **Vitesse** : plusieurs scénarios testés en un clin d’œil.
- **Décision** : seuils (loyer d’équilibre, vacance tolérable), alertes de risque.

## Sans simulateur : 5 erreurs fréquentes

1. **Oublier des charges** (syndic non récup., PNO/GLI, petites maintenances).
2. **Confondre** rentabilité *brute* et *nette* → projet surestimé.
3. **Sous-estimer la vacance** (turnover, travaux, impayés).
4. **Mal modéliser la dette** (mensualité, assurance, impact durée/taux).
5. **Comparer des pommes et des poires** (hypothèses différentes selon le bien).

## Avec simulateur : ce que tu mesures concrètement

- **Rentabilités** : brute, nette, nette-nette (selon ce que tu inclus).
- **Cashflow** : trésorerie mensuelle après charges et dette (avant/après impôt si tu actives la fiscalité).
- **DSCR** : marge de sécurité d’exploitation vs annuité (*NOI / dette*).
- **Seuils** : loyer d’équilibre (CF₀=0), vacance maximum supportable.
- **Stress tests** : loyers −5/−10 %, charges +10 %, taux ±100 bps.

## À quoi ressemble un bon simulateur ?

- **Transparence** : formules explicites, hypothèses visibles.
- **Comparaison** : scénarios clonables et paramétrables.
- **Fiscalité** : choix de régimes (micro, réel, LMNP…), ou à désactiver pour une vue “exploitation pure”.
- **Sorties claires** : tableaux synthétiques, export PDF propre.
- **Respect des données** : *pas d’inscription*, **aucune donnée personnelle** requise.

**Bon réflexe** : commence par une *vue exploitation* (hors IR) pour juger la qualité intrinsèque du bien,
puis ajoute la *fiscalité* pour affiner ton cashflow net.

## Mini prise en main — calcule vite tes indicateurs

Renseigne quelques hypothèses : tu obtiens la **rentabilité nette**, le **cashflow** (avant impôt),
le **DSCR** et le **loyer d’équilibre** (CF₀=0). Idéal pour un premier tri des annonces.

Prix d’achat (€)
180000

Frais notaire (%)
8

Frais agence (€)
0

Loyer (€/mois)
900

Vacance (%)
5

Charges non récup. (€/mois)
110

TF nette TEOM (€/an)
950

Gestion + assur. (%) du loyer
8

Mensualité prêt + assur. (€/mois)
680

| Indicateur | Valeur |
| --- | --- |
| — | |

#### Stress test (rapide)

Mini-modèle pédagogique (hors fiscalité détaillée). Utilise le simulateur complet pour intégrer les régimes d’imposition, l’assurance de prêt précise et la revente.

## Confidentialité & simplicité

Notre outil est **100% gratuit**, **sans inscription** et **ne te demande aucune donnée personnelle**
(e-mail, adresse, etc.). Tu renseignes uniquement des *chiffres de projet*, que tu peux effacer à tout moment et
*exporter en PDF* pour les partager.

## Conclusion

Un simulateur fiable accélère ta **prise de décision**, évite les pièges et te permet de comparer objectivement
des opportunités. Teste plusieurs scénarios, valide les seuils (loyer d’équilibre, DSCR) et avance sereinement.

### Passer à la pratique

Calcule ta rentabilité en quelques minutes — gratuit, anonyme, sans inscription.

<details>
<summary>Formules du calculateur publié avec cet article (JavaScript historique)</summary>

```javascript
// ====== Mini simulateur prise en main ======
  (function quickSim(){
    const byId = (id)=>document.getElementById(id);
    const fmt0 = (x)=> x.toLocaleString('fr-FR',{maximumFractionDigits:0});
    const fmt2 = (x)=> x.toLocaleString('fr-FR',{minimumFractionDigits:2, maximumFractionDigits:2});

    function compute(){
      // Inputs
      const PRIX = parseFloat(byId('p-prix').value||'0');
      const NOT  = parseFloat(byId('p-not').value||'0');
      const AG   = parseFloat(byId('p-ag').value||'0');
      const LOYm = parseFloat(byId('e-loy').value||'0');
      const VAC  = (parseFloat(byId('e-vac').value||'0')/100);
      const CHGm = parseFloat(byId('e-chg').value||'0');
      const TFan = parseFloat(byId('e-tf').value||'0');
      const GESp = (parseFloat(byId('e-gest').value||'0')/100);
      const MEN  = parseFloat(byId('f-mensu').value||'0');

      // Coût d'acquisition
      const COST = PRIX + PRIX*(NOT/100) + AG;

      // Revenus & OPEX
      const LOYeff_a = LOYm * (1 - VAC) * 12;
      const GA_a = LOYm * 12 * GESp;   // gestion + assur % du loyer brut
      const CHG_a = CHGm * 12;
      const OPEX  = GA_a + CHG_a + TFan;
      const NOI_a = LOYeff_a - OPEX;
      const NOI_m = NOI_a / 12;

      // Dette (déjà donnée en mensualité)
      const DEBT_a = MEN * 12;

      // Indicateurs
      const CF0_m = NOI_m - MEN;                       // cashflow avant impôt
      const Ynet  = COST>0 ? (NOI_a / COST) : 0;       // rentabilité nette
      const DSCR  = DEBT_a>0 ? (NOI_a / DEBT_a) : 0;   // sécurité dette

      // Loyer d'équilibre (CF0=0)
      // NOI_m = LOYm*(1 - VAC - GESp) - CHGm - TF/12
      // CF0_m = NOI_m - MEN = 0 -> LOYm_eq = (CHGm + TF/12 + MEN) / (1 - VAC - GESp)
      const denom = (1 - VAC - GESp);
      const LOYeq_m = denom>0 ? ((CHGm + TFan/12 + MEN) / denom) : Infinity;

      const tbody = document.querySelector('#out-table tbody');
      tbody.innerHTML = '';
      const rows = [
        ['Coût d’acquisition estimé', '€ '+fmt0(COST)],
        ['Loyers effectifs (vacance incluse)', '€ '+fmt0(LOYeff_a)+' /an'],
        ['Charges opérationnelles (OPEX)', '€ '+fmt0(OPEX)+' /an'],
        ['NOI (net d’exploitation)', '€ '+fmt0(NOI_a)+' /an'],
        ['Annuité de dette (mensualité × 12)', '€ '+fmt0(DEBT_a)+' /an'],
        ['Rentabilité nette', (Ynet*100).toFixed(2)+' %'],
        ['DSCR (NOI / dette)', DSCR.toFixed(2)],
        ['Cashflow <em>avant impôt</em>', (CF0_m>=0?'<span class="text-emerald-700">€ '+fmt2(CF0_m)+'/mois</span>':'<span class="text-rose-600">€ '+fmt2(CF0_m)+'/mois</span>')],
        ['Loyer d’équilibre (CF₀=0)', (isFinite(LOYeq_m)?'€ '+fmt2(LOYeq_m)+'/mois':'—')],
      ];
      rows.forEach(r=>{
        const tr = document.createElement('tr');
        const td1 = document.createElement('td'); td1.className='border px-3 py-2 font-medium'; td1.innerHTML=r[0];
        const td2 = document.createElement('td'); td2.className='border px-3 py-2'; td2.innerHTML=r[1];
        tr.appendChild(td1); tr.appendChild(td2); tbody.appendChild(tr);
      });

      // Stress test
      const stress = document.getElementById('out-stress');
      const cf_m_m10 = ( (LOYm*0.90*(1-VAC)*12 - (LOYm*0.90*12*GESp + CHG_a + TFan) )/12 ) - MEN;
      const cf_m_p10 = ( (LOYm*1.10*(1-VAC)*12 - (LOYm*1.10*12*GESp + CHG_a + TFan) )/12 ) - MEN;
      stress.innerHTML = `
        <table class="w-full">
          <thead><tr><th class="text-left py-1">Scénario</th><th class="text-left py-1">CF₀ (€/mois)</th></tr></thead>
          <tbody>
            <tr><td class="py-1">Loyers -10%</td><td>${cf_m_m10>=0?'<span class="text-emerald-700">€ '+fmt2(cf_m_m10)+'</span>':'<span class="text-rose-600">€ '+fmt2(cf_m_m10)+'</span>'}</td></tr>
            <tr><td class="py-1">Loyers +10%</td><td>${cf_m_p10>=0?'<span class="text-emerald-700">€ '+fmt2(cf_m_p10)+'</span>':'<span class="text-rose-600">€ '+fmt2(cf_m_p10)+'</span>'}</td></tr>
          </tbody>
        </table>
      `;
    }

    document.addEventListener('input', (e)=>{ if(e.target.closest('#calco')) compute(); });
    compute();
  })();
```

</details>
