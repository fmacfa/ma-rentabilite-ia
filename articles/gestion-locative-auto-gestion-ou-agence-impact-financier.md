# Gestion locative : auto-gestion ou agence, quel impact financier ?

Publié le 2025-09-20 sur ma-rentabilite.fr. [Article d’origine](https://ma-rentabilite.fr/article/gestion-locative-auto-gestion-ou-agence-impact-financier)

## Introduction

Confier la **gestion locative** à une *agence* coûte un pourcentage du loyer, mais peut réduire la **vacance**, sécuriser les loyers (GLI),
et te faire gagner du **temps**. En *auto-gestion*, tu économises les **frais de gestion** mais tu supportes la charge opérationnelle
et parfois une vacance plus longue. Voyons l’impact sur le **cashflow** — chiffres à l’appui.

**À retenir :** la comparaison doit intégrer *tous* les postes : **vacance, frais de gestion, GLI, frais de mise en location, charges non récupérables, mensualité**
et la **valeur de ton temps**. Le calculateur ci-dessous fournit aussi le **point d’équilibre** (taux de gestion max pour rester neutre).

## Coûts & paramètres à comparer

- **Vacance locative** (mois/an) : l’agence peut relouer plus vite → meilleure occupation.
- **Frais de gestion** (ex. 5–8 % du loyer encaissé) : coût récurrent uniquement côté agence.
- **GLI** (assurance loyers impayés) : % du loyer, parfois négocié via agence ; en auto-gestion, souvent plus élevé ou absent.
- **Frais de mise en location** (honoraires, états des lieux, photos) :
  peuvent être facturés à chaque relocation (exprimés en *mois de loyer* tous les X ans).
- **Valeur du temps** : visites, états des lieux, compta, SAV. Valorise en *€/h* × *heures/an*.

## Comment cela impacte la rentabilité ?

- **Loyers encaissés** = Loyer HC × *taux d’occupation*.
- **Cashflow** = Loyers encaissés − (Frais gestion + GLI + Mise en location mensuelle + Charges non récupérables + Mensualité crédit + Coût du temps).
- **Point d’équilibre** : taux de gestion *maximal* pour que l’agence donne le même cashflow que l’auto-gestion.

**Lecture rapide :** si l’agence te fait gagner *1 mois* d’occupation/an, cela vaut ≈ *1/12* du loyer annuel.
Compare ce gain au pourcentage de gestion payé.

## Exemple express (ordre de grandeur)

Loyer 1 150 € HC/mois ; vacance auto-gestion 1,5 mois/an ; vacance agence 0,8 mois/an ; frais gestion 6 % ; GLI auto 3,0 % ; GLI agence 2,2 % ;
mise en location : auto *0,3 mois* tous les 2 ans, agence *1,0 mois* tous les 2 ans ; charges non récupérables 320 €/mois ; mensualité 1 050 €/mois ;
temps : auto 12 h/an à 25 €/h, agence 3 h/an.

**Important :** les pratiques varient selon les villes/agences. Ajuste les paramètres dans le **calculateur** pour refléter ton marché.

## Calculateur interactif — Auto-gestion vs Agence

Renseigne les hypothèses. Le tableau compare le **cashflow mensuel** des deux options et calcule le **taux de gestion “seuil”**
pour lequel l’agence devient *neutre* par rapport à l’auto-gestion.

Loyer HC mensuel (€)
1150

Charges non récupérables (€ /mois)
320

Mensualité crédit + assurance (€)
1050

Vacance auto-gestion (mois/an)
1.5

Vacance agence (mois/an)
0.8

Taux de gestion agence (% du loyer encaissé)
6

GLI auto-gestion (% du loyer encaissé)
3.0

GLI agence (% du loyer encaissé)
2.2

Mise en location auto (mois de loyer / X ans)

0.3
tous les
2
ans

Mise en location agence (mois de loyer / X ans)

1.0
tous les
2
ans

Temps auto-gestion (h/an) & valeur (€/h)

12
25

Temps via agence (h/an) & valeur (€/h)

3
25

| Scénario | Occupation | Loyers encaissés | Frais gestion | GLI | Mise en loc. /mois | Charges non rec. | Mensualité | Coût temps | Cashflow /mois |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| — | | | | | | | | | |

**Point d’équilibre :** taux de gestion * pour cashflow agence = auto-gestion.
(* calculé sur loyers encaissés : si négatif ou >20 %, interpréter comme agence avantageuse/désavantageuse aux hypothèses saisies.)

Modélisation pédagogique (hors fiscalité) : les frais de gestion/GLI sont calculés sur les *loyers encaissés* (après vacance).
La mise en location est mensualisée : *loyer × (mois) / (ans × 12)*. Le coût du temps est *(heures/an × €/h)/12*.

## Conseils pratiques

- **Devis** : compare frais de gestion (inclut-il encaissement, relances, états des lieux, GLI ?), délais moyens de relocation, frais de ML.
- **Process** : photos pro, visites groupées, réactivité — qu’ils soient faits par toi ou par l’agence, *réduisent la vacance*.
- **Valorise ton temps** : si tu as peu de disponibilité, l’agence peut “acheter” de la sérénité pour un surcoût modéré.

## Conclusion

L’auto-gestion est intéressante si la **vacance** reste faible et si ton **temps** est disponible.
L’agence prend un pourcentage mais peut **lisser la trésorerie** (vacance/GLI) et te dégager du temps.
Mesure l’écart avec le calculateur, puis choisis selon ton **cashflow** cible et ta **tolérance opérationnelle**.

### Passer à la pratique

Projette l’option retenue dans le simulateur complet — gratuit, anonyme, sans inscription — et exporte ton bilan.

<details>
<summary>Formules du calculateur publié avec cet article (JavaScript historique)</summary>

```javascript
// ====== Calculateur : Auto-gestion vs Agence ======
  (function gestionCalc(){
    const byId = (id)=>document.getElementById(id);
    const fmt0 = (x)=> x.toLocaleString('fr-FR',{minimumFractionDigits:0, maximumFractionDigits:0});
    const fmt2 = (x)=> x.toLocaleString('fr-FR',{minimumFractionDigits:2, maximumFractionDigits:2});

    function monthlyLetting(loyer, mois, ans){
      const a = Math.max(0.1, ans||1); // évite /0
      return (loyer * mois) / (a * 12);
    }
    function costTimeMonthly(hAn, valH){
      return (hAn * valH) / 12;
    }

    function compute(){
      const L     = parseFloat(byId('c-loyer').value || '0');
      const chg   = parseFloat(byId('c-charges').value || '0');
      const mensu = parseFloat(byId('c-mensu').value || '0');

      const vacA  = parseFloat(byId('c-vac-auto').value || '0'); // mois/an
      const vacG  = parseFloat(byId('c-vac-ag').value || '0');   // mois/an
      const fee   = (parseFloat(byId('c-gestion').value || '0') / 100); // %
      const gliA  = (parseFloat(byId('c-gli-auto').value || '0') / 100);
      const gliG  = (parseFloat(byId('c-gli-ag').value || '0') / 100);

      const mlAm  = parseFloat(byId('c-ml-auto-mois').value || '0');
      const mlAa  = parseFloat(byId('c-ml-auto-ans').value || '1');
      const mlGm  = parseFloat(byId('c-ml-ag-mois').value || '0');
      const mlGa  = parseFloat(byId('c-ml-ag-ans').value || '1');

      const hA    = parseFloat(byId('c-h-auto').value || '0');
      const vA    = parseFloat(byId('c-v-auto').value || '0');
      const hG    = parseFloat(byId('c-h-ag').value || '0');
      const vG    = parseFloat(byId('c-v-ag').value || '0');

      const occA = Math.max(0, Math.min(1, (12 - Math.max(0, Math.min(12, vacA)))/12));
      const occG = Math.max(0, Math.min(1, (12 - Math.max(0, Math.min(12, vacG)))/12));

      // Loyers encaissés
      const loyA = L * occA;
      const loyG = L * occG;

      // Frais
      const fraisGestG = loyG * fee;          // agence
      const gliAuto    = loyA * gliA;
      const gliAg      = loyG * gliG;
      const mlAuto     = monthlyLetting(L, mlAm, mlAa);
      const mlAg       = monthlyLetting(L, mlGm, mlGa);
      const timeA      = costTimeMonthly(hA, vA);
      const timeG      = costTimeMonthly(hG, vG);

      // Cashflows
      const cfA = loyA - (gliAuto + mlAuto + chg + mensu + timeA);
      const cfG = loyG - (fraisGestG + gliAg + mlAg + chg + mensu + timeG);

      // Rendu tableau
      const tbody = document.querySelector('#c-table tbody');
      tbody.innerHTML = '';
      [
        ['Auto-gestion', occA, loyA, 0, gliAuto, mlAuto, chg,   mensu, timeA, cfA],
        ['Agence',       occG, loyG, fraisGestG, gliAg,  mlAg,  chg,   mensu, timeG, cfG]
      ].forEach((r, idx)=>{
        const tr = document.createElement('tr');
        r.forEach((val, j)=>{
          const td = document.createElement('td');
          td.className = 'border px-3 py-2'+(j===0?' font-medium':'');
          if(j===1){ td.textContent = (val*100).toFixed(1)+' %'; }
          else if(j>=2 && j<=8){ td.textContent = "€ "+fmt2(val); }
          else if(j===9){
            td.innerHTML = (val>=0?'<span class="text-emerald-700">€ '+fmt2(val)+'</span>':'<span class="text-rose-600">€ '+fmt2(val)+'</span>');
          } else { td.textContent = val; }
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      });

      // Point d’équilibre (taux de gestion neutre)
      // fee*L*occG = L*(occG*(1-gliG) - occA*(1-gliA)) - (mlAg - mlAuto) - (timeG - timeA)
      const num = (L*(occG*(1-gliG) - occA*(1-gliA)) - (mlAg - mlAuto) - (timeG - timeA));
      const den = (L*occG);
      let feeStar = den>0 ? (num/den) : NaN; // en ratio
      const span = document.getElementById('res-fee');
      if(!isFinite(feeStar)) { span.textContent = '—'; }
      else {
        span.textContent = (feeStar*100).toFixed(2)+' %';
      }
    }

    document.addEventListener('input', (e)=>{ if(e.target.closest('#calco')) compute(); });
    compute();
  })();
```

</details>
