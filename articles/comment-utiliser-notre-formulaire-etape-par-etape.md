# Comment utiliser notre formulaire étape par étape (guide détaillé)

Publié le 2025-09-23 sur ma-rentabilite.fr. [Article d’origine](https://ma-rentabilite.fr/article/comment-utiliser-notre-formulaire-etape-par-etape)

> **Mise à jour du 23 novembre 2026.** Pour les revenus locatifs 2026 relevant des prélèvements sur le patrimoine, le taux de référence est de 17,2 % en location nue et de 18,6 % en location meublée. En meublé de longue durée, le seuil micro-BIC 2026 est de 83 600 €. Les chiffres de l’exemple d’origine restent rattachés à sa date. [Règles et sources officielles](../docs/fiscalite.md)

## Avant de commencer

Notre **formulaire de calcul de rentabilité** fonctionne en 5 blocs : *Achat*, *Crédit*, *Loyers & charges*,
*Fiscalité*, *Résultats*. Tu peux remplir dans n’importe quel ordre, revenir en arrière, et **exporter un PDF**.
L’outil est **100% gratuit** et **ne demande aucune donnée personnelle** (ni e-mail, ni adresse).

**Checklist express** : prix, frais d’achat, durée/taux, loyer visé, charges non récup., vacance, taxe foncière,
gestion/assurance, régime fiscal. C’est tout !

## Étape 1 — Renseigner l’achat

Commence par les éléments d’acquisition. Ils déterminent le **coût total** et le **montant à financer**.

- **Prix d’achat** : hors frais.
- **Frais de notaire** : en % du prix (estimation : *Neuf* plus bas, *Ancien* plus haut).
- **Frais d’agence** : si applicables.
- **Travaux initiaux** : remise en état, ameublement, etc.
- **Apport** : facultatif, sert à calculer le *montant de crédit*.

**Astuce** : si tu n’as pas le détail des frais, entre une *valeur prudente*. Tu affineras plus tard.

## Étape 2 — Paramétrer le crédit

Le module calcule la **mensualité** et le **coût de la dette** via la *formule d’annuité*.

- **Montant emprunté** : auto-déduit de l’étape 1 (coût − apport).
- **Durée** (années) et **taux** nominal.
- **Assurance** : en %/an du capital initial (approximation pédagogique).

Tu vois en direct l’impact sur le **cashflow** et le **DSCR** (NOI/annuité).

## Étape 3 — Loyers & charges

Ici, tu décris la réalité économique du bien.

- **Loyer** : mensuel (ou annuel).
- **Vacance** : en % (mois sans locataire, turnover…).
- **Charges non récupérables** : syndic, PNO/GLI, entretien, etc.
- **Taxe foncière nette** : hors TEOM si récupérable.
- **Gestion + assurance** : en % du loyer brut.

Le formulaire calcule le **NOI** (net d’exploitation) puis le **cashflow** après dette.

## Étape 4 — Choisir la fiscalité

Sélectionne un **régime fiscal** pour estimer l’impact impôt/prélèvements sur ton résultat :

- **Micro-foncier** : abattement forfaitaire (si conditions).
- **Régime réel** : charges réelles, intérêts…
- **LMNP** (*souvent au réel*) : amortissements, règles spécifiques.

Tu peux *désactiver la fiscalité* pour une vue “exploitation pure”, puis la réactiver pour affiner.

**Important** : teste *au moins deux régimes* quand c’est possible. La fiscalité peut inverser un verdict.

## Étape 5 — Lire et interpréter les résultats

- **Rentabilités** : brute, nette (NOI/coût).
- **Cashflow** : mensuel après charges et dette (avant/après impôt selon option).
- **DSCR** : marge de sécurité de l’exploitation (*≥ 1,20* recommandé).
- **TRI** : si tu actives un scénario de revente.
- **Graphiques & tableau** : synthèse prête à exporter.

## Exporter & partager

À tout moment, clique sur **Exporter en PDF** pour obtenir un document propre : hypothèses, résultats,
tableaux. Idéal pour ton banquier ou pour comparer plusieurs biens.

## Confidentialité & données

Notre simulateur est **gratuit**, **sans inscription** et **n’exige aucune donnée personnelle**.
Tu ne renseignes que des *données chiffrées de projet*, que tu peux effacer. Pas d’e-mail, pas d’adresse.

## FAQ rapide

- **Puis-je enregistrer un scénario ?** Oui, en *exportant le PDF* et/ou via l’URL pré-remplie (si activée sur ta version).
- **Dois-je commencer par l’Achat ?** Non, les sections sont indépendantes. Reviens dessus si besoin.
- **Les taux bougent** ? Fais un *stress test* : +/−100 bps pour voir l’effet sur le cashflow et le DSCR.

## Pas-à-pas interactif (checklist)

Utilise cette petite *checklist* pour suivre ta progression. Quand tout est vert, tu es prêt pour l’export PDF.

Progression

0/5 étapes

- … Achat renseigné (prix, frais, travaux, apport)
- … Crédit paramétré (durée, taux, assurance)
- … Loyers & charges saisis (vacance, TF nette, gestion)
- … Fiscalité testée (au moins 2 régimes)
- … Résultats vérifiés (rentabilité, cashflow, DSCR, TRI)

#### Contrôles rapides

Coche les étapes, des conseils apparaîtront ici.

## Erreurs à éviter

- Confondre **brute** et **nette** (oublier charges et vacance).
- Ignorer l’**assurance** de prêt dans l’annuité.
- Sous-estimer la **taxe foncière nette** (TEOM récupérable à part).
- Ne pas **stresser** les *loyers* (−5/−10 %) et le *taux* (±100 bps).

### Passer à la pratique

Calcule ta rentabilité en quelques minutes — **gratuit**, **anonyme**, **sans inscription**.

<details>
<summary>Formules du calculateur publié avec cet article (JavaScript historique)</summary>

```javascript
// ====== Pas-à-pas interactif (checklist + progression) ======
  (function wizard(){
    const boxes = document.querySelectorAll('#wizard .wz');
    const done = document.getElementById('wz-done');
    const bar  = document.getElementById('wz-bar');
    const hints= document.getElementById('wz-hints');

    const messages = {
      0: "Coche les étapes au fur et à mesure.",
      1: "Bien ! Passe au crédit pour voir la mensualité.",
      2: "Top. Vérifie l'impact du taux et de la durée sur le cashflow.",
      3: "Parfait. Ajoute vacance, TF nette et gestion.",
      4: "Excellent. Compare micro vs réel/LMNP.",
      5: "Tout est prêt ! Exporte le PDF et garde une trace de tes hypothèses."
    };

    function refresh(){
      let count = 0;
      boxes.forEach(b => { if(b.checked) count++; });
      done.textContent = count.toString();
      const pct = Math.round((count/5)*100);
      bar.style.width = pct + '%';
      hints.innerHTML = messages[count] || messages[0];
      bar.className = 'h-2 ' + (pct<40 ? 'bg-rose-500' : (pct<80 ? 'bg-amber-500' : 'bg-emerald-600'));
    }

    document.addEventListener('change', (e)=>{
      if(e.target && e.target.classList.contains('wz')) refresh();
    });
    refresh();
  })();
```

</details>
