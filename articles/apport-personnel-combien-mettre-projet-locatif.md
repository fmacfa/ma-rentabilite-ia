# Apport personnel : combien mettre dans un projet locatif ?

Publié le 2025-09-19 sur ma-rentabilite.fr. [Article d’origine](https://ma-rentabilite.fr/article/apport-personnel-combien-mettre-projet-locatif)

## Introduction

L’**apport personnel** influe directement sur le *montant emprunté*, la *mensualité*, le *cashflow* et le *ROE* (retour sur fonds propres).
Plus d’apport ↓ *mensualité* et ↓ *coût d’intérêts*, mais aussi ↓ *effet de levier* et parfois ↓ *performance sur fonds propres*.

**À retenir :** l’apport optimal dépend de tes *objectifs* (cashflow/levier/risque) et des *exigences de la banque* (frais, épargne résiduelle, assurance…).

## Notions clés

- **Coût total investi** : prix + frais de notaire + agence + travaux d’acquisition (+ mobilier en meublé).
- **LTV** (*Loan-To-Value*) : Emprunt / Coût total investi. Plus la *LTV* est élevée, plus le levier est fort.
- **ROE** : Résultat sur une période / Fonds propres mobilisés (apport, frais de dossier…).
- **Cashflow** : Loyers effectifs − Charges d’exploitation − Mensualités (capital+intérêts+assurance).

## Repères pratiques (généraux)

- **0–10 % d’apport** : levier max, mensualités plus hautes, cashflow plus tendu.
- **~20 %** : compromis fréquent pour lisser la mensualité sans “manger” tout le ROE.
- **≥30 %** : mensualités confortables, coût d’intérêts réduit, mais effet de levier plus faible.

**Attention :** certaines banques exigent de couvrir au minimum les *frais* (notaire/garantie) en apport et de conserver une *épargne de précaution*. Compare plusieurs offres.

## Comparatif — 0 % vs 10 % vs 20 % vs 30 %

*Hypothèses par défaut (modifiables dans le calculateur plus bas)* : coût total 230 000 €, taux nominal 4 %, durée 25 ans, assurance 0,25 %/an (capital initial), loyer 1 150 €/mois, vacance 1 mois, charges exploitation 325 €/mois.

| Apport | LTV | Mensualité (hors assur.) | Assurance / mois | Total / mois | Cashflow mensuel* | ROE (année 1)** |
| --- | --- | --- | --- | --- | --- | --- |

*Avant impôts. **Approche simple : (cashflow annuel) / (apport). Pour une vision globale, préfère le **TRI** sur horizon + revente (CRD, frais de vente).

## Calculateur interactif

Adapte à ton projet pour voir l’impact de l’apport. Les champs sont volontairement simples ; le simulateur complet du site va plus loin (fiscalité, TRI, export PDF).

Coût total investi (€)
230000

Taux nominal annuel (%)
4

Durée (années)
25

Assurance (cap. initial) (%/an)
0.25

Loyer mensuel (HC)
1150

Charges mensuelles (exploitation)
325

Vacance (mois/an)
1

## Lecture des résultats

- **LTV** = Emprunt / Coût total. Plus d’apport → LTV ↓ → risque banque ↓.
- **Cashflow** s’améliore avec plus d’apport (mensualité ↓), mais ton **ROE** peut baisser (mêmes euros de résultat pour davantage de fonds immobilisés).
- **Coût d’intérêts** diminue avec plus d’apport (emprunt ↓), utile si tu vises le désendettement rapide.

## Stratégies selon objectifs

- **Maximiser le levier / scaler** : *apport minimal* compatible banque + épargne de sécurité.
- **Stabilité de trésorerie** : viser un *cashflow neutre/positif* avec apport intermédiaire (10–20 %).
- **Coût et risque faibles** : *apport élevé* pour des mensualités basses et un endettement réduit.

**Raccourci décision** : fais tourner deux niveaux d’apport (ex. 10 % vs 20 %) et compare *cashflow*, *ROE* et, idéalement, le *TRI* avec une hypothèse de revente (CRD + frais de vente).

## Erreurs fréquentes

- Mettre “tout” en apport et **laisser zéro épargne** (aléas : vacance, travaux).
- Ne regarder que la **mensualité** sans comparer le **ROE** et la capacité à **enchaîner** d’autres projets.
- Oublier que l’assurance sur **capital initial** est *constante* (ajoute bien au budget mensuel).

## Conclusion

Il n’y a pas de “bon” niveau d’apport universel : choisis celui qui **équilibre** ta trésorerie, ton levier, et tes objectifs.
Teste plusieurs scénarios dans le calculateur, puis affine dans le **simulateur complet** (cashflow après impôts, TRI, export PDF).

### Passer à la pratique

Projette différents apports et montages en 2 minutes — gratuit, anonyme, sans inscription.

<details>
<summary>Formules du calculateur publié avec cet article (JavaScript historique)</summary>

```javascript
// ====== Comparatif d'apports + Calculateur ======
  (function comparateurApport(){
    const byId = (id)=>document.getElementById(id);
    const fmt = (x)=> x.toLocaleString('fr-FR',{minimumFractionDigits:2, maximumFractionDigits:2});
    const fmt0 = (x)=> x.toLocaleString('fr-FR');

    function mensualite(P, iAnn, nMois){
      const r = iAnn/12;
      return P * r / (1 - Math.pow(1+r, -nMois));
    }

    function cashflow(loyMensuel, vacMois, chgMensuel, mTot){
      const loyEff = loyMensuel * (12 - vacMois) / 12;
      return loyEff - chgMensuel - mTot;
    }

    function render(){
      const cout   = parseFloat(byId('c-cout').value || '0');
      const iAnn   = (parseFloat(byId('c-taux').value || '0')/100);
      const dureeY = parseFloat(byId('c-duree').value || '0');
      const assurA = (parseFloat(byId('c-assur').value || '0')/100);
      const loyer  = parseFloat(byId('c-loyer').value || '0');
      const chg    = parseFloat(byId('c-charges').value || '0');
      const vac    = parseFloat(byId('c-vacance').value || '0');

      const n = Math.round(dureeY*12);
      const scen = [0,10,20,30];

      const tbody = document.querySelector('#cmp-table tbody');
      tbody.innerHTML = '';

      scen.forEach(pct=>{
        const apport = cout * (pct/100);
        const emprunt = Math.max(0, cout - apport);
        const ltv = emprunt / cout;
        const mHors = mensualite(emprunt, iAnn, n);
        const assurM = emprunt>0 ? (emprunt * assurA / 12) : 0; // sur capital initial emprunté
        const mTot = mHors + assurM;
        const cf = cashflow(loyer, vac, chg, mTot);
        const roe = (apport>0) ? ((cf*12)/apport) : null;

        const tr = document.createElement('tr');
        const cells = [
          pct+" %",
          (ltv*100).toFixed(1)+" %",
          "€ "+fmt(mHors),
          "€ "+fmt(assurM),
          "€ "+fmt(mTot),
          (cf>=0?'<span class="text-emerald-700">€ '+fmt(cf)+'</span>':'<span class="text-rose-600">€ '+fmt(cf)+'</span>'),
          (roe===null? '—' : ((roe*100).toFixed(1)+" %"))
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

    // Hooks
    byId('c-run').addEventListener('click', render);
    ['c-cout','c-taux','c-duree','c-assur','c-loyer','c-charges','c-vacance'].forEach(id=>{
      const el = byId(id);
      el.addEventListener('change', render);
      el.addEventListener('keydown', (e)=>{ if(e.key==='Enter'){ render(); }});
    });

    render(); // initial
  })();
```

</details>
