# Comprendre les tranches d’imposition

Publié le 2025-09-21 sur ma-rentabilite.fr. [Article d’origine](https://ma-rentabilite.fr/article/comment-fonctionnent-les-tranches-dimposition-exemples-chiffres)

## Mise à jour du 23 novembre 2026

Pour le barème publié en 2026 et applicable aux revenus 2025, les bornes supérieures par part sont 11 600 €, 29 579 €, 84 577 € et 181 917 €, avant la tranche à 45 %. Le moteur peut estimer l’effet d’un revenu locatif en calculant l’impôt brut avant et après ce revenu. Pour les revenus 2026, ce barème reste une hypothèse de projection. [Barème et exemple de calcul](https://www.service-public.gouv.fr/particuliers/vosdroits/F1419)

[Règles du moteur et sources officielles](../docs/fiscalite.md)

<details>
<summary>Lire l’article historique et ses exemples à la date de publication</summary>

## Introduction

En France, l’**impôt sur le revenu** est *progressif* : ton revenu est découpé en **tranches**,
et chaque tranche est taxée à son **taux**. On confond souvent *taux marginal* (celui de la tranche la plus haute
qui te concerne) et *taux moyen* (impôt total / revenu imposable). Le **quotient familial** (nombre de parts)
répartit le revenu pour tenir compte de la composition du foyer.

**À retenir :** on applique d’abord le **quotient familial** :
*revenu imposable / parts* → barème progressif → on *remultiplie* par le nombre de parts.

## Le barème (pédagogique)

Exemple de barème *type* (seuils annuels par part) — **à adapter** si besoin :

- 0 % jusqu’à `10 000 €`
- 11 % de `10 000` à `27 000 €`
- 30 % de `27 000` à `78 000 €`
- 41 % de `78 000` à `168 000 €`
- 45 % au-delà

Ce barème est **progressif par tranches** : si ton revenu (par part) franchit un seuil, *seule la fraction au-dessus* est taxée au nouveau taux.

## Taux marginal vs taux moyen

- **Taux marginal (TMI)** : taux de ta *dernière* tranche touchée. C’est le coût fiscal d’1 € supplémentaire (hors contributions et effets annexes).
- **Taux moyen** : impôt total / revenu imposable. Toujours *inférieur* ou égal au TMI.

## Exemples pas à pas

### Exemple 1 — Célibataire (1 part), 32 000 € imposables

1. Quotient : 32 000 / 1 = 32 000.
2. Tranches appliquées :
   - 0 % sur 10 000 → 0
   - 11 % sur 17 000 (de 10 000 à 27 000) → 1 870
   - 30 % sur 5 000 (de 27 000 à 32 000) → 1 500
3. Impôt par part : 3 370 → total : 3 370.
4. **TMI** : 30 % ; **taux moyen** ≈ 3 370 / 32 000 = 10,5 %.

### Exemple 2 — Couple (2 parts), 64 000 € imposables

1. Quotient : 64 000 / 2 = 32 000.
2. Impôt par part = *mêmes calculs* que l’exemple 1 → 3 370.
3. Total = 3 370 × 2 = 6 740. **TMI** : 30 % ; **taux moyen** ≈ 10,5 %.

**Important :** ceci est une *modélisation pédagogique* du barème.
Les règles exactes (décotes, réductions/crédits, plafonnement du quotient, contributions, etc.) ne sont *pas* modélisées ici.

## Calculateur interactif — Tranches, TMI et taux moyen

Entre ton **revenu net imposable** annuel et le **nombre de parts**.
Ajuste *si besoin* les **seuils** par part et **taux**. Le calculateur affiche :
**impôt**, **TMI**, **taux moyen**, décomposition par tranche, et l’effet d’un **+1 000 €**.

## Bonnes pratiques

- **Compare** toujours le *taux moyen* (impact global) et le *TMI* (impact à la marge).
- **Simule** l’effet d’une hausse de revenus (prime, loyer, plus-value) avec la case bonus.
- **Vérifie** chaque année les seuils/taux officiels et les dispositifs (décote, plafonds, crédits d’impôt…).

## Conclusion

Les **tranches** ne taxent pas tout ton revenu au même taux : la progression se fait par paliers.
Distingue **TMI** et **taux moyen**, et utilise le **quotient familial** pour des comparaisons justes selon ta situation.

### Passer à la pratique

Projette ton impôt et ton cashflow après impôt directement dans le simulateur — gratuit, anonyme, sans inscription.

<details>
<summary>Formules du calculateur publié avec cet article (JavaScript historique)</summary>

```javascript
// ====== Calculateur Tranches ======
  (function tranchesCalc(){
    const byId = (id)=>document.getElementById(id);
    const fmt0 = (x)=> x.toLocaleString('fr-FR',{maximumFractionDigits:0});
    const fmt2 = (x)=> x.toLocaleString('fr-FR',{minimumFractionDigits:2, maximumFractionDigits:2});

    function computeTax(base, bounds, rates){
      // bounds: array of lower bounds per tranche (sorted asc)
      // rates : array of decimal rates per tranche (same length)
      const n = bounds.length;
      let taxPerPart = 0;
      let rows = [];
      for(let i=0;i<n;i++){
        const lower = bounds[i];
        const upper = (i<n-1? bounds[i+1] : Infinity);
        const taxable = Math.max(0, Math.min(base, upper) - lower);
        const t = rates[i];
        const imp = taxable * t;
        if(taxable>0){
          rows.push([lower, isFinite(upper)? upper : '∞', taxable, t, imp]);
        } else {
          rows.push([lower, isFinite(upper)? upper : '∞', 0, t, 0]);
        }
        taxPerPart += imp;
        if(base<=upper) break;
      }
      return { taxPerPart, rows };
    }

    function run(){
      const rev   = parseFloat(byId('ri-rev').value || '0');
      const parts = Math.max(0.5, parseFloat(byId('ri-parts').value || '1'));
      const bonus = Math.max(0, parseFloat(byId('ri-bonus').value || '0'));
      byId('ri-bonus-lbl').textContent = fmt0(bonus);

      const bounds = [ parseFloat(byId('b1').value||'0'),
                       parseFloat(byId('b2').value||'0'),
                       parseFloat(byId('b3').value||'0'),
                       parseFloat(byId('b4').value||'0'),
                       parseFloat(byId('b5').value||'0') ].sort((a,b)=>a-b);
      const rates  = [ byId('t1'), byId('t2'), byId('t3'), byId('t4'), byId('t5') ]
                        .map(i => Math.max(0, parseFloat(i.value||'0')/100));

      const qfBase = rev / parts;
      const res    = computeTax(qfBase, bounds, rates);
      const impot  = res.taxPerPart * parts;

      // TMI = taux de la tranche où tombe la dernière fraction
      let tmiRate = 0;
      for(let i=0;i<bounds.length;i++){
        const upper = (i<bounds.length-1? bounds[i+1] : Infinity);
        if(qfBase>bounds[i] && qfBase<=upper){ tmiRate = rates[i]; break; }
        if(qfBase>upper && i===bounds.length-1){ tmiRate = rates[i]; }
      }

      const tauxMoy = rev>0 ? (impot/rev) : 0;

      // Table
      const tbody = document.querySelector('#ri-table tbody');
      tbody.innerHTML = '';
      res.rows.forEach(r=>{
        const tr = document.createElement('tr');
        const trancheLbl = (r[1]==='∞' ? (fmt0(r[0])+' € et +') : (fmt0(r[0])+'–'+fmt0(r[1])+' €'));
        [
          trancheLbl,
          "€ "+fmt0(r[2]),
          (r[3]*100).toFixed(1)+" %",
          "€ "+fmt0(r[4])
        ].forEach((val, j)=>{
          const td = document.createElement('td');
          td.className = 'border px-3 py-2'+(j===0?' font-medium':'');
          td.textContent = val;
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      });

      // Bonus
      const resB  = computeTax((rev+bonus)/parts, bounds, rates);
      const impotB= resB.taxPerPart * parts;
      const delta = impotB - impot;
      const tmiEff= bonus>0 ? (delta/bonus) : 0;

      // Outputs
      byId('ri-impot').textContent      = "€ "+fmt0(impot);
      byId('ri-tmi').textContent        = (tmiRate*100).toFixed(1)+" %";
      byId('ri-tmoy').textContent       = (tauxMoy*100).toFixed(2)+" %";
      byId('ri-impot-bonus').textContent= "€ "+fmt0(impotB);
      byId('ri-delta').textContent      = "€ "+fmt0(delta);
      byId('ri-tmi-eff').textContent    = (tmiEff*100).toFixed(2)+" %";
      byId('ri-par-part').textContent   = "€ "+fmt0(qfBase);
      byId('ri-parts-out').textContent  = parts;
    }

    document.addEventListener('input', (e)=>{ if(e.target.closest('#calco')) run(); });
    run();
  })();
```

</details>

</details>
