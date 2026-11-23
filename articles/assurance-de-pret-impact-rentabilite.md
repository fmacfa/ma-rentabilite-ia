# Assurance de prêt : impact sur la rentabilité

Publié le 2025-09-20 sur ma-rentabilite.fr. [Article d’origine](https://ma-rentabilite.fr/article/assurance-de-pret-impact-rentabilite)

## Introduction

L’**assurance de prêt** représente une part non négligeable du *coût réel* d’un financement.
Selon le type de contrat (*groupe* banque vs *délégation*), la **base de calcul** (*capital initial* vs *capital restant dû — CRD*) et la **quotité** (100 % / 50 % par emprunteur),
l’impact sur la **mensualité**, le **cashflow** et la **rentabilité** peut être majeur.

**À retenir :** la mensualité totale = *annuité du crédit* + *prime d’assurance*.
Une assurance sur *CRD* est *décroissante* ; sur *capital initial*, la prime est *constante*.

## Notions clés

- **TAEA** : taux annuel effectif de l’assurance (coût de l’assurance rapporté au capital emprunté).
- **TAEG** : intègre intérêts, assurance (si exigée), frais. Sert à comparer des offres globales.
- **Base de calcul** :
  - *Capital initial* : prime fixe ≈ `P x a / 12`.
  - *CRD* : prime varie chaque mois (diminue avec l’amortissement).
- **Quotité** : répartition de la couverture (ex. 100/0, 50/50, 100/100). La prime est proportionnelle à la quotité totale.
- **Garanties** (exemples) : Décès, PTIA, ITT, IPT. Les critères (âge, métier, santé) jouent sur le tarif/acceptation.

## Comment l’assurance impacte la rentabilité ?

- **Mensualité** : augmente de la prime d’assurance → effet direct sur le *cashflow*.
- **Coût total** : somme des primes ≈ plusieurs milliers d’euros sur la durée.
- **Capacité d’emprunt** : la prime entre dans l’endettement (TAEG).

## Exemple de base (réutilisable)

**Hypothèses** : capital **P = 200 000 €**, taux nominal **4 %**, durée **25 ans** (300 mois).
Deux formules d’assurance au choix :

- *Contrat A* — capital initial **0,25 %**/an, quotité 100 % → prime *constante*.
- *Contrat B* — sur CRD **0,12 %**/an, quotité 100 % → prime *décroissante*.

**Lecture rapide :** à taux identique, une base *CRD* coûte moins cher sur la durée mais ne “soulagent” pas forcément autant le tout premier mois qu’un taux très faible sur capital initial.

## Comparatif express

| Élément | Contrat A (init.) | Contrat B (CRD) | Impact attendu |
| --- | --- | --- | --- |
| Prime mensuelle (début) | P x a / 12 → constante | CRD x a / 12 → décroissante | Avec CRD, la prime baisse au fil du temps |
| Coût sur la durée | Plus élevé à taux équivalent | Plus faible en général | Meilleure rentabilité long terme avec CRD |
| Cashflow mensuel | Impact stable | Impact décroissant | Soulagement progressif |

## Calculateur interactif — assurance & rentabilité

Teste l’effet sur la mensualité totale, le coût d’assurance cumulé, le coût du crédit et le **cashflow** (avant impôts).
Tu peux aussi simuler la **quotité** (ex. 50 % si vous êtes deux co-emprunteurs avec 50/50 chacun).

Capital emprunté (€)
200000

Taux nominal annuel (%)
4

Durée (années)
25

Taux assurance (%/an)
0.25

Base de calcul
Capital initial (prime constante)

Quotité totale couverte (%)
100

Loyer mensuel (HC)
1150

Charges mensuelles (exploitation)
325

| Mensualité (hors assur.) | Assurance 1er mois | Total / mois (début) | Coût intérêts (total) | Coût assurance (total) | Coût crédit global | Cashflow (mois 1) |
| --- | --- | --- | --- | --- | --- | --- |
| — | | | | | | |

Hypothèses : assurance au *taux saisi* appliqué à la *base choisie*, quotité proportionnelle.
Cashflow = loyer - charges exploitation - (mensualité + assurance mois 1).
Pour une vision complète (fiscalité, TRI, export PDF), utilise le simulateur du site.

## Bonnes pratiques

- **Comparer** au moins deux offres (groupe vs délégation) et deux bases (initial vs CRD).
- **Adapter la quotité** à la situation des co-emprunteurs (revenus, protection souhaitée).
- **Relire garanties/exclusions** (ITT/IPT) : un tarif bas sans la bonne couverture peut coûter cher en risque.
- **Réviser** l’assurance si le cadre le permet (changement de contrat), pour améliorer cashflow et coût global.

## Erreurs fréquentes

- Oublier l’assurance dans la **mensualité totale** → cashflow surévalué.
- Comparer des offres sur des **bases différentes** (initial vs CRD) sans recalcul sur la durée.
- Ignorer la **quotité** (payer 100 % chacun alors que 50/50 suffisait au projet).

## Conclusion

L’assurance de prêt influence **trésorerie**, **coût** et donc **rentabilité**.
Joue sur le trio *taux* x *base* x *quotité* pour optimiser ton montage — et vérifie toujours l’adéquation des garanties.

### Passer à la pratique

Teste plusieurs offres et bases dans notre simulateur — gratuit, anonyme, sans inscription — puis exporte ton bilan.

<details>
<summary>Formules du calculateur publié avec cet article (JavaScript historique)</summary>

```javascript
// ====== Calculateur : assurance & rentabilité ======
  (function assuranceCalco(){
    const byId = (id)=>document.getElementById(id);
    const fmt = (x)=> x.toLocaleString('fr-FR',{minimumFractionDigits:2, maximumFractionDigits:2});
    const fmt0 = (x)=> x.toLocaleString('fr-FR');

    function mensualite(P, iAnn, n){
      const r = iAnn/12;
      return P * r / (1 - Math.pow(1+r, -n));
    }

    // Somme des primes d'assurance sur CRD (exact, via boucle d'amortissement)
    function coutAssuranceCRD(P, iAnn, n, aAnn, quot){
      const r = iAnn/12;
      const aM = (aAnn/12) * (quot/100);
      let crd = P, total = 0;
      const M = mensualite(P, iAnn, n);
      for(let k=1;k<=n;k++){
        const interets = crd * r;
        const capital = M - interets;
        const prime = crd * aM; // assurance sur CRD du mois
        total += prime;
        crd = Math.max(0, crd - capital);
      }
      return total;
    }

    function render(){
      const P   = parseFloat(byId('c-capital').value || '0');
      const i   = (parseFloat(byId('c-taux').value || '0')/100);
      const Y   = parseFloat(byId('c-duree').value || '0');
      const a   = (parseFloat(byId('c-assur').value || '0')/100);
      const base= byId('c-base').value;
      const q   = parseFloat(byId('c-quotite').value || '100');
      const loy = parseFloat(byId('c-loyer').value || '0');
      const chg = parseFloat(byId('c-charges').value || '0');

      const n = Math.round(Y*12);
      const M = mensualite(P, i, n);
      let primeM1 = 0, coutAssurTotal = 0;

      if(base==='initial'){
        const aM = (a/12) * (q/100);
        primeM1 = P * aM; // constante
        coutAssurTotal = primeM1 * n;
      } else {
        // CRD
        const r = i/12;
        const aM = (a/12) * (q/100);
        primeM1 = P * aM; // 1er mois sur CRD ~ P
        coutAssurTotal = coutAssuranceCRD(P, i, n, a, q);
      }

      const interetsTot = M*n - P;
      const coutGlobal = interetsTot + coutAssurTotal;
      const totalMois1 = M + primeM1;
      const cashflowM1 = loy - chg - totalMois1;

      const tbody = document.querySelector('#c-table tbody');
      tbody.innerHTML = '';
      const tr = document.createElement('tr');
      [
        "€ "+fmt(M),
        "€ "+fmt(primeM1),
        "€ "+fmt(totalMois1),
        "€ "+fmt0(Math.round(interetsTot)),
        "€ "+fmt0(Math.round(coutAssurTotal)),
        "€ "+fmt0(Math.round(coutGlobal)),
        (cashflowM1>=0?'<span class="text-emerald-700">€ '+fmt(cashflowM1)+'</span>':'<span class="text-rose-600">€ '+fmt(cashflowM1)+'</span>')
      ].forEach((c, idx)=>{
        const td = document.createElement('td');
        td.className = 'border px-3 py-2'+(idx===0?' font-medium':'');
        td.innerHTML = c;
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    }

    byId('c-run').addEventListener('click', render);
    ['c-capital','c-taux','c-duree','c-assur','c-base','c-quotite','c-loyer','c-charges'].forEach(id=>{
      const el = byId(id);
      el.addEventListener('change', render);
      el.addEventListener('keydown', (e)=>{ if(e.key==='Enter'){ render(); }});
    });
    render();
  })();
```

</details>
