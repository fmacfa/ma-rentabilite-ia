# Le TRI expliqué simplement (Taux de Rendement Interne, avec exemple chiffré)

Publié le 2025-09-19 sur ma-rentabilite.fr. [Article d’origine](https://ma-rentabilite.fr/article/tri-taux-rendement-interne-explication-exemple)

## Introduction

Le **TRI (Taux de Rendement Interne)** est le *taux annuel* qui annule la **VAN** (Valeur Actuelle Nette) d’un investissement.
Autrement dit, c’est le taux qui rend la somme de tous tes *flux de trésorerie actualisés* égale à zéro.

**En une phrase :** le TRI répond à « *si mes euros investis aujourd’hui génèrent ces flux futurs, quel rendement annuel cela représente-t-il ?* ».
Il tient compte de **tous les flux** : apport initial, cashflows annuels (après charges et crédit) et **revente nette**.

## Définition et lien avec la VAN

On cherche le taux *r* tel que :

*VAN(r) = \(\sum_{t=0}^{T} \dfrac{CF_t}{(1+r)^t} = 0\)*, où *CFt* sont tes flux de trésorerie à l’année *t*.

- **TRI** : taux interne qui met la VAN à 0.
- **VAN** avec un taux cible *k* : si VAN > 0, ton projet surperforme *k* ; si VAN < 0, il sous-performe.

## Quand utiliser le TRI ?

- Pour comparer des projets ayant des **timings de flux** différents (durées, reventes, travaux, etc.).
- Pour intégrer une **revente** (prix net vendeur − frais de vente − CRD) au bout de X années.
- Pour compléter les ratios de **rentabilité** (brute/nette) et le **cashflow**.

**Attention :** si les flux changent de signe plusieurs fois (ex. gros travaux en année 3), il peut exister *plusieurs* TRI (ou aucun).
Dans ce cas, utilise plutôt la **VAN** à un taux cible ou fais une analyse de sensibilité.

## Exemple chiffré (10 ans)

**Hypothèses** (pédagogiques) :

- Prix d’achat : 180 000 € ; frais de notaire : 14 000 € ; agence : 6 000 € ; travaux d’acquisition : 10 000 €.
- Apport : 30 000 € → **emprunt** 180 000 € sur 25 ans ; **taux** 4 % ; **assurance** 0,25 % (sur capital initial).
- Loyer HC : 1 150 €/mois ; vacance : 1 mois/an → **loyers effectifs** = 12 650 €.
- Charges d’exploitation annuelles : TF 1 100 € ; copro 700 € ; PNO 120 € ; entretien 300 € ; GLI 2,5 % loyers (= 316 €) ; gestion 7 % (= 886 €) ; énergie/internet 480 € → **total ≈ 3 902 €**.
- **Cashflow opérationnel** ≈ 12 650 − 3 902 = 8 748 €.
- **Service de la dette** : mensualité ≈ 950,11 € ; assurance ≈ 37,50 €/mois → **≈ 11 851 €/an**.
- **Cashflow avant impôts** ≈ 8 748 − 11 851 = **−3 103 €/an**.
- Revente fin année 10 : prix **240 000 €** ; frais de vente 6 % → net vendeur ≈ 225 600 €. **CRD** (restant dû) ≈ 128 447 € → **net pour l’investisseur** ≈ 97 153 €.

Les **flux de trésorerie** (*côté investisseur*) sur 10 ans sont alors :

| Année | Flux (€) | Détail |
| --- | --- | --- |
| 0 | −30 000 | Apport initial |
| 1 → 9 | ≈ −3 103 / an | Cashflow avant impôts, constant pour l’exemple |
| 10 | ≈ +93 ? € | Cashflow annuel (≈ −3 103) **+** net revente (≈ 97 153) |

Avec ces flux, le **TRI annuel** ressort à : **≈ 6,15 %** (calcul dynamique ci-dessous).

**Lecture :** ici le cashflow annuel est légèrement négatif, mais la *revente nette* au bout de 10 ans (après remboursement du CRD et frais de vente) fait remonter la performance globale.
C’est exactement ce que le **TRI** capture.

## Comment calculer le TRI en pratique ?

- **Excel / Google Sheets** : fonctions `=IRR(plage)` (flux réguliers) ou `=XIRR(plage_flux; plage_dates)` (flux datés).
- **Calculette** : méthode itérative (Newton/Bisection) jusqu’à annuler la VAN.
- **Simulateur** : renseigne tes flux (apport, cashflows, revente), il calcule le TRI automatiquement.

## Analyse de sensibilité (idées)

- **+50 € de loyer** ou **−0,5 pt** sur le taux peut gagner ~0,5 à 1,0 pt de TRI selon le cas.
- **Prix de revente** : chaque +10 k€ (net vendeur) peut ajouter ~1 à 1,5 pt sur 10 ans.
- **Frais de vente** / **CRD** : souvent sous-estimés → le TRI baisse si on les intègre correctement.

## Erreurs fréquentes

- Oublier le **CRD** à la revente (ou les frais de vente).
- Mélanger flux *avant*/*après* impôts dans une même série.
- Utiliser des flux mensuels mais un **TRI annuel** sans conversion (`XIRR` résout cela).

## Conclusion

Le TRI donne une mesure synthétique (en %) de la **performance globale** de ton projet, en tenant compte du temps et de la revente.
Complète-le toujours par une vision **cashflow** et des scénarios (optimiste/prudent).

### Passer à la pratique

Teste plusieurs scénarios (durée, taux, loyer, revente) dans le formulaire — gratuit, anonyme, sans inscription.

<details>
<summary>Formules du calculateur publié avec cet article (JavaScript historique)</summary>

```javascript
// ====== Calcul dynamique du TRI de l'exemple (annuel) ======
  (function calcIRRExample(){
    // Hypothèses de l'exemple (doivent refléter le texte ci-dessus)
    const apport = 30000;
    const principal = 180000;
    const years = 25;
    const iRate = 0.04;       // intérêt nominal
    const insRate = 0.0025;   // assurance sur capital initial (≈ 0,25%/an)
    const horizon = 10;

    const loyerMensuel = 1150;
    const vacanceMois = 1;
    const loyersEffectifs = loyerMensuel * (12 - vacanceMois); // 12 650 €

    const charges = 3902; // total charges d'exploitation (voir détail dans le texte)
    const cashOp = loyersEffectifs - charges;

    // Mensualité (hors assurance)
    const r = iRate / 12;
    const n = years * 12;
    const pmt = principal * (r) / (1 - Math.pow(1 + r, -n));
    const assuranceAnnuelle = insRate * principal;
    const serviceDetteAnnuel = pmt * 12 + assuranceAnnuelle; // ≈ 11 851 €/an

    const cfAvantImpots = cashOp - serviceDetteAnnuel; // ≈ -3 103 €/an

    // CRD après 'horizon' années
    const m = horizon * 12;
    const crd = principal * Math.pow(1 + r, m) - pmt * (Math.pow(1 + r, m) - 1) / r;

    // Revente
    const prixVente = 240000;
    const fraisVente = 0.06 * prixVente;
    const netVendeur = prixVente - fraisVente;
    const netInvest = netVendeur - crd; // net pour l'investisseur à la revente

    // Série de flux annuels (t=0..10) sur fonds propres
    const flows = [];
    flows.push(-apport); // t0
    for(let t=1;t<=9;t++) flows.push(cfAvantImpots);
    flows.push(cfAvantImpots + netInvest); // année 10

    // NPV helper
    function npv(rate, cfs){
      let v = 0;
      for(let t=0;t<cfs.length;t++){
        v += cfs[t] / Math.pow(1+rate, t);
      }
      return v;
    }

    // Bisection IRR (robuste)
    function irrBisection(cfs, low=-0.999, high=1.0){
      let fLow = npv(low, cfs), fHigh = npv(high, cfs);
      let attempts = 0;
      while(fLow * fHigh > 0 && attempts < 50){
        high = high * 1.5 + 0.5;
        fHigh = npv(high, cfs);
        attempts++;
      }
      if(fLow * fHigh > 0) return null;
      for(let k=0;k<200;k++){
        const mid = (low + high)/2;
        const fMid = npv(mid, cfs);
        if(Math.abs(fMid) < 1e-10) return mid;
        if(fLow * fMid < 0){ high = mid; fHigh = fMid; }
        else { low = mid; fLow = fMid; }
      }
      return (low + high)/2;
    }

    const irr = irrBisection(flows);
    const el = document.getElementById('irrResult');
    if(irr !== null && el){
      el.textContent = (irr*100).toFixed(2) + " %";
    }
  })();
```

</details>
