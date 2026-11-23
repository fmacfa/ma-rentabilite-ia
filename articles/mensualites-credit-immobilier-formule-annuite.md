# Comment calculer ses mensualités de crédit immobilier ? (formule d’annuité)

Publié le 2025-09-19 sur ma-rentabilite.fr. [Article d’origine](https://ma-rentabilite.fr/article/mensualites-credit-immobilier-formule-annuite)

## Introduction

Pour un prêt amortissable classique, la mensualité se calcule avec la **formule d’annuité constante**.
Elle dépend du *capital emprunté*, du *taux* et de la *durée*.
On peut y ajouter l’**assurance emprunteur** pour obtenir le *coût total* qui sort réellement de ton compte chaque mois.

**À retenir :** Mensualité (hors assurance) = *P × r / (1 − (1+r)^{−n})* avec *r* = taux mensuel et *n* = nombre total de mensualités.

## La formule d’annuité (pas à pas)

- **P** : capital emprunté (euros).
- **i** : taux nominal *annuel* (ex. 4 % → 0,04).
- **r** : taux *mensuel* = i / 12 (pour un prêt à échéances mensuelles).
- **n** : durée totale en mois (ex. 25 ans → 300 mois).

**Mensualité hors assurance** :

*\( M = \dfrac{P \times r}{1 - (1+r)^{-n}} \)*

### Ajouter l’assurance emprunteur

Deux cas fréquents :

- **Assurance sur capital initial** (taux annuel a) → *prime mensuelle* ≈ *P × a / 12* (constante).
- **Assurance sur capital restant dû** → prime décroissante (suivant l’amortissement).

**Mensualité totale ≈** mensualité hors assurance **+** prime d’assurance (selon modalité).

**TAEG vs taux nominal :** le *TAEG* inclut intérêts, assurance (si obligatoire), frais de dossier/garantie.
La formule d’annuité utilise le *taux nominal*. Pour raisonner “cash qui sort”, ajoute l’assurance (et garde en tête les autres frais).

## Exemple chiffré (25 ans)

**Hypothèses** :

- Capital **P = 200 000 €** ; taux nominal **i = 4 %** ; durée **25 ans** → **n = 300**.
- Assurance **a = 0,25 %** / an sur capital initial.

| Élément | Calcul | Résultat |
| --- | --- | --- |
| Taux mensuel | r = 0,04 / 12 | ≈ 0,003333… |
| Mensualité (hors assur.) | M = P × r / (1 − (1+r)^{−n}) | **≈ 1 055,67 €** |
| Assurance (capital initial) | P × a / 12 | **≈ 41,67 €** |
| Mensualité totale estimée | M hors + Assurance | **≈ 1 097,34 €** |

**Lecture :** la mensualité hors assurance est *constante* ; la part d’intérêts diminue et la part de capital augmente au fil du temps.

## Amortissement : 1ère année détaillée

Ci-dessous, la décomposition **intérêts / capital remboursé / CRD** pour les 12 premières échéances (à partir des hypothèses ci-dessus).
Si ton assurance est sur CRD, la prime décroît — ici on affiche la prime fixe (capital initial) pour l’exemple.

| # | Mensualité (hors assur.) | Intérêts | Capital | CRD fin échéance | Assurance | Total payé |
| --- | --- | --- | --- | --- | --- | --- |

## CRD et revente intermédiaire

Le **CRD** (*capital restant dû*) après *t* mensualités sert, par exemple, à estimer le **net vendeur** à la revente : *prix net − frais de vente − CRD*.
C’est crucial dans le calcul du **TRI** et du cash final.

## Erreurs fréquentes

- Confondre **mensualité hors assurance** et **total payé** (ajoute l’assurance).
- Utiliser un **taux annuel** directement dans la formule sans convertir en **mensuel**.
- Oublier que l’assurance sur **CRD** est *décroissante*, pas constante.
- Négliger les **frais annexes** (dossier, garantie) qui influent sur le *TAEG* mais pas la formule d’annuité.

## Conclusion

La formule d’annuité te donne la mensualité *théorique* hors assurance.
Pour ton budget, pense **mensualité totale**, et garde le **CRD** en tête pour tes scénarios de revente/renégociation.

### Passer à la pratique

Teste directement différents montants, durées et taux dans le formulaire — gratuit, anonyme, sans inscription.

<details>
<summary>Formules du calculateur publié avec cet article (JavaScript historique)</summary>

```javascript
// ====== Calculs de l'exemple & tableau d'amortissement (12 premières échéances) ======
  (function amortissement(){
    const P = 200000;          // capital
    const i = 0.04;            // taux annuel
    const a = 0.0025;          // assurance / an sur capital initial
    const years = 25;
    const n = years * 12;
    const r = i / 12;

    // Mensualité hors assurance (annuité)
    const M = P * r / (1 - Math.pow(1 + r, -n));
    const assurMensuelle = P * a / 12;
    const Mtot = M + assurMensuelle;

    // Injecte les résultats dans le tableau de synthèse
    const fmt = (x) => x.toLocaleString('fr-FR', {minimumFractionDigits:2, maximumFractionDigits:2});
    const mHors = document.getElementById('mHors');
    const mAssur = document.getElementById('mAssur');
    const mTot  = document.getElementById('mTot');
    if(mHors) mHors.textContent = "≈ " + fmt(M) + " €";
    if(mAssur) mAssur.textContent = "≈ " + fmt(assurMensuelle) + " €";
    if(mTot)  mTot.textContent  = "≈ " + fmt(Mtot) + " €";

    // Construire 12 lignes d'amortissement
    const tbody = document.querySelector('#tabAmort tbody');
    let crd = P;
    for(let k=1; k<=12; k++){
      const interets = crd * r;
      const capital  = M - interets;
      crd = Math.max(0, crd - capital);

      const tr = document.createElement('tr');
      const cells = [
        k,
        fmt(M) + " €",
        fmt(interets) + " €",
        fmt(capital) + " €",
        fmt(crd) + " €",
        fmt(assurMensuelle) + " €",
        fmt(M + assurMensuelle) + " €",
      ];
      cells.forEach((c, idx)=>{
        const td = document.createElement('td');
        td.className = 'border px-3 py-2' + (idx===0 ? ' font-medium' : '');
        td.innerHTML = c;
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    }
  })();
```

</details>
