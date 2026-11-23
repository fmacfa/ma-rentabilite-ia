# Vacance locative : comment l’anticiper dans vos calculs ?

Publié le 2025-09-20 sur ma-rentabilite.fr. [Article d’origine](https://ma-rentabilite.fr/article/vacance-locative-comment-anticiper-calculs)

## Introduction

La **vacance locative** représente les périodes où le bien n’est pas loué (entre deux locataires, travaux, saison creuse, etc.).
Ne pas l’intégrer fausse immédiatement **rentabilités** et **cashflow**. Voici comment l’estimer et l’ajouter proprement à tes calculs.

**À retenir :** travaille avec un *taux d’occupation réaliste* (ou un *nombre de mois vacants*) et ajoute un **coût de remise en location** (honoraires, rafraîchissement).
Le résultat clé : *loyers effectifs* = loyers théoriques × taux d’occupation − coûts de remise en location.

## Deux façons d’intégrer la vacance

- **En mois/an** : ex. 1 mois vide par an → *taux d’occupation* = (12 − 1) / 12 = 91,7 %.
- **En %** : ex. 7 % de vacance → *taux d’occupation* = 93 %.

**Loyers effectifs annuels** :

*\( Loyers\_effectifs = Loyers\_théoriques \times Occupation − Coûts\_remise\_en\_location \)*

## Comment estimer la vacance ?

- **Données locales** : délais moyens de relocation, tension locative, saisonnalité (zones étudiantes, littoral).
- **Stratégie** : meublé étudiant (vacance estivale probable), LCD saison (hors-saison plus longue).
- **Process** : photos/annonce, visites groupées, disponibilité → réduit le délai de vacance.

**Important :** ajoute un *coût de remise en location* (honos d’agence, petites réparations, peinture, ménage)
que tu peux modéliser en **mois de loyer** tous les X ans.

## Impact mécanique sur la rentabilité & le cashflow

- **Rentabilité brute** baisse proportionnellement au taux d’occupation.
- **Cashflow** : baisse de loyers mais *charges fixes* (mensualité de crédit, taxe foncière, PNO) restent dues.
- **Point mort** : taux d’occupation à partir duquel le cashflow devient nul (utile pour le *stress test*).

## Tableau express — effet de 0 à 3 mois de vacance

Hypothèses : loyer 1 150 € HC/mois, mensualité totale 1 050 € (crédit+assurance), charges exploitation 300 €/mois,
coût de remise en location 0,5 mois de loyer tous les 2 ans.

| Vacance (mois/an) | Occupation | Loyers effectifs /mois | Cashflow /mois |
| --- | --- | --- | --- |

## Calculateur interactif — vacance & cashflow

Renseigne tes paramètres : vacance (en mois *ou* en %), coût de remise en location, charges et mensualité totale.
Le calculateur donne les **loyers effectifs**, le **cashflow** et le **taux d’occupation d’équilibre** (point mort).

Loyer HC mensuel (€)
1150

Charges d’exploitation mensuelles (€)
300

Mensualité crédit + assurance (€)
1050

Vacance (mois/an)
1

ou Vacance (%)
Si rempli, écrase la valeur en mois.

Coût remise en location

0.5
mois de loyer tous les
2
ans

| Occupation (%) | Loyers effectifs /mois | Coût remise loc. /mois | Cashflow /mois | Point mort (occupation min.) |
| --- | --- | --- | --- | --- |
| — | | | | |

Modélisation simple (hors fiscalité) : Loyers effectifs = Loyer HC × Occupation − Remise en location / mois.
Cashflow = Loyers effectifs − Charges exploitation − Mensualité totale.

## Bonnes pratiques

- Prendre une **marge prudente** (ex. 1 mois/an en longue durée, plus en zones peu tendues ou en saisonnier hors haute saison).
- Prévoir un **coussin de trésorerie** de 3–6 mois de charges fixes.
- Limiter la vacance : annonce de qualité, visites groupées, disponibilité rapide, *pricing* réaliste, flexibilité sur la durée d’engagement.

## Erreurs fréquentes

- Compter 0 mois de vacance “par optimisme”。
- Oublier les **frais de remise en location** (honoraires, ménages, petits travaux).
- Confondre **HC** et **CC** dans les comparaisons de loyers.

## Conclusion

La vacance locative est un **paramètre clé** de la rentabilité.
Intègre-la en mois ou en %, ajoute les frais de remise en location, et vérifie ton **point mort**.
Tu prendras des décisions plus solides — et un risque mieux maîtrisé.

### Passer à la pratique

Projette ta vacance (mois ou %) dans le simulateur — gratuit, anonyme, sans inscription — et calcule rentabilités, cashflow et TRI.

<details>
<summary>Formules du calculateur publié avec cet article (JavaScript historique)</summary>

```javascript
// ====== Tableau express 0–3 mois ======
  (function vacQuick(){
    const rows = [0,1,2,3];
    const loyer = 1150, mensu = 1050, chg = 300, remMois = 0.5, remAns = 2;
    const remMens = (loyer * remMois) / (remAns * 12);
    const tbody = document.querySelector('#vac-quick tbody');
    const fmt = (x)=> x.toLocaleString('fr-FR',{minimumFractionDigits:0, maximumFractionDigits:0});
    rows.forEach(m=>{
      const occ = (12 - m) / 12;
      const loyEff = loyer * occ - remMens;
      const cf = loyEff - chg - mensu;
      const tr = document.createElement('tr');
      [m+" mois", (occ*100).toFixed(1)+" %", "€ "+fmt(loyEff), (cf>=0?'<span class="text-emerald-700">€ '+fmt(cf)+'</span>':'<span class="text-rose-600">€ '+fmt(cf)+'</span>')].forEach((c, i)=>{
        const td = document.createElement('td');
        td.className = 'border px-3 py-2'+(i===0?' font-medium':'');
        td.innerHTML = c;
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
  })();

  // ====== Calculateur Vacance & Cashflow ======
  (function vacCalculator(){
    const byId = (id)=>document.getElementById(id);
    const fmt0 = (x)=> x.toLocaleString('fr-FR',{minimumFractionDigits:0, maximumFractionDigits:0});
    const fmt2 = (x)=> x.toLocaleString('fr-FR',{minimumFractionDigits:2, maximumFractionDigits:2});

    function compute(){
      const loyer = parseFloat(byId('c-loyer').value || '0');
      const chg   = parseFloat(byId('c-charges').value || '0');
      const mensu = parseFloat(byId('c-mensu').value || '0');
      const vacM  = parseFloat(byId('c-vac-mois').value || '0');
      const vacP  = byId('c-vac-pct').value === '' ? null : (parseFloat(byId('c-vac-pct').value || '0')/100);
      const remM  = parseFloat(byId('c-rem-mois').value || '0');
      const remA  = parseFloat(byId('c-rem-ans').value || '1');

      // Occupation
      const occ = (vacP!==null) ? (1 - Math.min(0.9999, Math.max(0, vacP))) : (Math.max(0, Math.min(12, 12 - vacM)) / 12);

      // Coût remise en location mensuel
      const remMens = (loyer * remM) / (remA * 12);

      // Loyers effectifs mensuels
      const loyEff = loyer * occ - remMens;

      // Cashflow
      const cf = loyEff - chg - mensu;

      // Point mort : occ*loyer - remMens - chg - mensu >= 0 → occ >= (chq + mensu + remMens)/loyer
      const occMin = loyer>0 ? ((chg + mensu + remMens) / loyer) : 1.0;
      const occMinPct = Math.min(1, Math.max(0, occMin)) * 100;

      // Rendu
      const tbody = document.querySelector('#c-table tbody');
      tbody.innerHTML = '';
      const tr = document.createElement('tr');
      [
        (occ*100).toFixed(1)+" %",
        "€ "+fmt0(loyEff),
        "€ "+fmt0(remMens),
        (cf>=0?'<span class="text-emerald-700">€ '+fmt0(cf)+'</span>':'<span class="text-rose-600">€ '+fmt0(cf)+'</span>'),
        (occMinPct>100? 'Non atteignable (loyer trop bas)' : fmt2(occMinPct)+' %')
      ].forEach((c, i)=>{
        const td = document.createElement('td');
        td.className = 'border px-3 py-2'+(i===0?' font-medium':'');
        td.innerHTML = c;
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    }

    // Hooks
    document.addEventListener('input', (e)=>{ if(e.target.closest('#calco')) compute(); });
    compute();
  })();
```

</details>
