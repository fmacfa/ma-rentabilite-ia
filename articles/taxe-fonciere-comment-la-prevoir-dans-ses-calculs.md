# Taxe foncière : comment la prévoir dans ses calculs ?

Publié le 2025-09-22 sur ma-rentabilite.fr. [Article d’origine](https://ma-rentabilite.fr/article/taxe-fonciere-comment-la-prevoir-dans-ses-calculs)

## Introduction

La **taxe foncière (TF)** est une dépense *annuelle* significative pour les bailleurs.
Dans la TF figure souvent la **TEOM** (Taxe d’Enlèvement des Ordures Ménagères), qui est en principe *récupérable* auprès du locataire via les **charges locatives**.
Bien la modéliser évite de sous-estimer tes charges et ton **cashflow**.

**À retenir :** dans tes calculs de rentabilité, intègre la **TF nette** = *TF totale − part TEOM récupérable*.
Lisse-la en **mensuel** (provision) et ajoute une **revalorisation** prudente d’une année sur l’autre.

## Que contient la taxe foncière ?

- **Taxe foncière sur les propriétés bâties** (TFPB) : la part *propriétaire*, non récupérable auprès du locataire.
- **TEOM** : en principe *récupérable* via les provisions sur charges (hors exonérations/cas particuliers).

## Où l’intégrer dans le simulateur ?

1. À l’onglet **Charges** : ajoute une ligne *“Taxe foncière (nette TEOM)”* en annuel, ou sa version **mensualisée** (TF nette / 12).
2. À l’onglet **Loyers & charges** : inclue la **TEOM** dans les *charges récupérables* pour compenser via le locataire.

## Anticiper la revalorisation

Les montants peuvent **évoluer** d’année en année. Pour une projection prudente, applique un **taux de revalorisation** (ex. 2–5 %/an) et observe l’impact sur ton **cashflow**.

**Attention :** la récupérabilité de la **TEOM** suppose de *bien la refacturer* dans les charges au locataire et de disposer des justificatifs.
Vérifie aussi les **règles locales** et les mentions sur ton avis de TF.

## Calculateur interactif — TF nette, lissage & cashflow

Saisis la TF totale et la part de **TEOM**. Le calculateur déduit la **TF nette** (à ta charge), la **mensualise**,
et mesure l’impact sur ton **cashflow** avec et sans **revalorisation**, plus un **stress-test +10 %**.

Taxe foncière totale (€/an)
1400

Dont TEOM (€/an)
220
Part récupérable sur le locataire (en principe).

Revalorisation annuelle TF (%)
3
Hypothèse prudente pour l’année à venir.

Loyer HC (€/mois)
900

Mensualité crédit + assur. (€/mois)
650

Autres charges non récup. (€/mois)
110
PNO, GLI, syndic non récupérable, etc.

| Indicateur | Valeur |
| --- | --- |
| — | |

Hypothèses pédagogiques : TEOM entièrement récupérée auprès du locataire si correctement provisionnée et régularisée.
Cashflow = Loyer HC − (Mensualité prêt + Autres charges non récup. + TF nette/12).
La revalorisation applique TF × (1 + taux) pour une projection à N+1. Les pratiques locales peuvent différer.

## Bonnes pratiques

- **Provisionne mensuellement** la TF nette pour lisser la trésorerie.
- **Identifie** précisément la part TEOM et **récupère-la** via les provisions sur charges.
- **Calibre** une *marge de sécurité* (ex. +10 %) pour les hausses et évolutions locales.

## Conclusion

Calcule toujours la **TF nette** (après TEOM récupérable), **mensualise-la** dans tes charges, et
applique une **revalorisation** prudente pour anticiper l’impact sur ton **cashflow**.
Tu évites les à-coups de trésorerie et fiabilises ta rentabilité.

### Passer à la pratique

Projette tes chiffres dans le simulateur complet — gratuit, anonyme, sans inscription — et exporte ton bilan.

<details>
<summary>Formules du calculateur publié avec cet article (JavaScript historique)</summary>

```javascript
// ====== Calculateur Taxe foncière ======
  (function taxeFoncCalc(){
    const byId = (id)=>document.getElementById(id);
    const fmt0 = (x)=> x.toLocaleString('fr-FR',{maximumFractionDigits:0});
    const fmt2 = (x)=> x.toLocaleString('fr-FR',{minimumFractionDigits:2, maximumFractionDigits:2});

    function compute(){
      const TF   = parseFloat(byId('tf-tot').value || '0');     // taxe foncière totale
      const TEOM = parseFloat(byId('tf-teom').value || '0');    // part récupérable
      const REV  = (parseFloat(byId('tf-reval').value || '0')/100);

      const LOY  = parseFloat(byId('tf-loyer').value || '0');
      const MEN  = parseFloat(byId('tf-mensu').value || '0');
      const CHG  = parseFloat(byId('tf-chg').value   || '0');

      const TF_net = Math.max(0, TF - TEOM);
      const TF_mois = TF_net / 12;

      // Projection N+1 avec revalorisation
      const TF1 = TF * (1 + REV);
      const TEOM1 = TEOM * (1 + REV); // hypothèse simple
      const TF_net1 = Math.max(0, TF1 - TEOM1);
      const TF_mois1 = TF_net1 / 12;

      // Cashflow
      const CF0 = LOY - (MEN + CHG + TF_mois);
      const CF1 = LOY - (MEN + CHG + TF_mois1);

      // Stress test +10% sur TF (TEOM constante)
      const TF_stress = TF * 1.10;
      const TF_net_stress = Math.max(0, TF_stress - TEOM);
      const TF_mois_stress = TF_net_stress / 12;
      const CF_stress = LOY - (MEN + CHG + TF_mois_stress);

      const tbody = document.querySelector('#tf-table tbody');
      tbody.innerHTML = '';
      const rows = [
        ['TEOM récupérable (annuel)', '€ '+fmt0(TEOM)],
        ['Taxe foncière <strong>nette</strong> propriétaire (annuel)', '€ '+fmt0(TF_net)],
        ['Provision TF nette (mensuelle)', '€ '+fmt2(TF_mois)],
        ['Cashflow (TF actuelle)', (CF0>=0?'<span class="text-emerald-700">€ '+fmt2(CF0)+'/mois</span>':'<span class="text-rose-600">€ '+fmt2(CF0)+'/mois</span>')],
        ['Projection N+1 — TF revalorisée', '€ '+fmt0(TF1)],
        ['Projection N+1 — TF nette propriétaire', '€ '+fmt0(TF_net1)],
        ['Provision N+1 (mensuelle)', '€ '+fmt2(TF_mois1)],
        ['Cashflow projeté N+1', (CF1>=0?'<span class="text-emerald-700">€ '+fmt2(CF1)+'/mois</span>':'<span class="text-rose-600">€ '+fmt2(CF1)+'/mois</span>')],
        ['Stress test +10% TF (TEOM inchangée)', 'Provision : € '+fmt2(TF_mois_stress)+' / Cashflow : '+(CF_stress>=0?'<span class="text-emerald-700">€ '+fmt2(CF_stress)+'/mois</span>':'<span class="text-rose-600">€ '+fmt2(CF_stress)+'/mois</span>')],
      ];
      rows.forEach(r=>{
        const tr = document.createElement('tr');
        const td1 = document.createElement('td');
        td1.className = 'border px-3 py-2 font-medium';
        td1.innerHTML = r[0];
        const td2 = document.createElement('td');
        td2.className = 'border px-3 py-2';
        td2.innerHTML = r[1];
        tr.appendChild(td1); tr.appendChild(td2);
        tbody.appendChild(tr);
      });
    }

    document.addEventListener('input', (e)=>{ if(e.target.closest('#calco')) compute(); });
    compute();
  })();
```

</details>
