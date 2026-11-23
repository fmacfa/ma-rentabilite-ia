# Charges courantes à ne pas oublier dans la rentabilité

Publié le 2025-09-20 sur ma-rentabilite.fr. [Article d’origine](https://ma-rentabilite.fr/article/charges-courantes-a-ne-pas-oublier-rentabilite)

> **Mise à jour du 23 novembre 2026.** Pour les revenus locatifs 2026 relevant des prélèvements sur le patrimoine, le taux de référence est de 17,2 % en location nue et de 18,6 % en location meublée. En meublé de longue durée, le seuil micro-BIC 2026 est de 83 600 €. Les chiffres de l’exemple d’origine restent rattachés à sa date. [Règles et sources officielles](../docs/fiscalite.md)

## Introduction

Une bonne estimation des **charges courantes** évite de surévaluer la rentabilité et le **cashflow**.
Certaines dépenses sont *récupérables* auprès du locataire (ex. une partie des charges de copro), d’autres non (ex. **taxe foncière**, **PNO**).
Fais le tri, ajoute une **provision travaux** (CapEx) et projette l’impact dans tes calculs.

**À retenir :** sépare *récupérables* / *non récupérables*, pense aux *frais annuels* à mensualiser et n’oublie pas une **provision** pour l’entretien lourd (toiture, chaudière, ravalement…).

## Checklist — Charges courantes (à adapter à ton bien)

- **Taxe foncière** (dont TOM si non récupérée) — *non récupérable*.
- **Assurance PNO** (Propriétaire Non Occupant) — non récupérable.
- **Assurance loyers impayés (GLI)** — non récupérable.
- **Copropriété (syndic)** :
  - Charges *récurrentes récupérables* (entretien courant, ASC/PC, eau froide part locataire…)
  - Charges *non récupérables* (honoraires syndic, fonds travaux loi ALUR, grosses réparations hors récupérable)
- **Entretien & petites réparations** (interventions, consommables non récupérables).
- **Internet/EDF** si *meublé* avec charges au forfait (non récupérable si inclus au bail).
- **Gestion locative** (agence) — % du loyer HC, non récupérable.
- **Comptable** (LMNP/LMP au réel) — non récupérable.
- **CFE** (en meublé selon cas) — non récupérable.
- **Frais bancaires** (compte, virement) — non récupérable.
- **Provision travaux (CapEx)** — ravalement, chaudière, toiture, ascenseur…
- **Autres** : parking/box (si offert), alarme, propreté/espaces verts hors récupérable.

## Bien classifier : récupérables vs non récupérables

Pour la **rentabilité nette**, ne garde que les **non récupérables** (ceux qui restent à ta charge).
Les récupérables sont payés par le locataire (via provisions/forfaits) ; néanmoins anticipe le *risque de non-recouvrement* ou le *décalage* (régularisation tardive).

## Provisions & saisonnalité

- **Mensualise** les dépenses annuelles (taxe foncière, comptable…).
- Ajoute une **provision travaux** *mensuelle* (ex. 0,5–1,0 % du coût total/an).
- Si meublé étudiant/saisonnier : ajuste pour la **vacance** et les **surcoûts de remise en location**.

**Important :** vérifie ton *bail* : forfait de charges en meublé (non régularisable) vs provisions avec régularisation (nu).
Cela change la part *récupérable* et donc le cashflow.

## Calculateur interactif — Liste tes charges, mesure l'impact

Renseigne ton loyer HC, tes charges et coche *Récupérable* si elles sont refacturées au locataire.
Le calculateur affiche : total **non récupérables**, coût par **m²**, **rentabilité nette** (avant impôts) et **cashflow** mensuel (avec ta mensualité).

Loyer HC mensuel (€)
1150

Surface (m²)
45

Mensualité crédit + assurance (€)
1050

Coût total investi (€) — pour % de rentabilité
230000

### Charges (ajuste, ajoute/supprime)

| # | Intitulé | Périodicité | Montant (€) | Récupérable ? | €/mois normalisé |  |
| --- | --- | --- | --- | --- | --- | --- |

#### Totaux

- Charges récupérables : **—** /mois
- Charges non récupérables : **—** /mois
- Coût total charges (toutes) : **—** /mois

Les *non récupérables* impactent directement la rentabilité *nette* et le cashflow.

#### Coûts normalisés

- €/m² de charges non récup. : **—** /mois
- Loyer net de charges (nette) : **—** /mois

#### Rentabilité & Cashflow

- Rentabilité **nette** (avant impôts) : **—**
- Cashflow (avant impôts) : **—** /mois

La “nette-nette” inclurait aussi la fiscalité ; utilise le simulateur complet pour la projeter.

## Ordres de grandeur (repères)

- **Taxe foncière** : souvent 1–2 mois de loyer /an selon la commune.
- **PNO** : 8–20 € /mois environ (selon surface/garanties).
- **GLI** : 2–3,5 % du loyer HC (mensuel).
- **Gestion** : 5–8 % du loyer HC (hors frais location).
- **Provision CapEx** : 0,5–1,0 % du coût total /an (à affiner selon l’immeuble).

## Erreurs fréquentes

- Confondre **récupérables** et **non récupérables**.
- Oublier une **provision travaux** (CapEx) : la rentabilité “papier” s’évapore au premier gros poste.
- Ne pas **mensualiser** (taxe foncière, comptable) → cashflow sous-estimé certains mois.

## Conclusion

Structure tes charges, mensualise ce qui doit l’être et sépare bien la part **récupérable**.
Tu obtiens une **rentabilité nette** réaliste et un **cashflow** fidèle à la vie du bien.
Le simulateur complet va plus loin (fiscalité, TRI, export PDF) — toujours **gratuit** et **sans données personnelles**.

### Passer à la pratique

Renseigne tes charges dans le simulateur — gratuit, anonyme, sans inscription — et exporte ton bilan.

<details>
<summary>Formules du calculateur publié avec cet article (JavaScript historique)</summary>

```javascript
// ====== Calculateur Charges ======
  (function chargesCalco(){
    const byId = (id)=>document.getElementById(id);
    const tbody = document.querySelector('#chg-table tbody');
    const fmt0 = (x)=> x.toLocaleString('fr-FR',{minimumFractionDigits:0, maximumFractionDigits:0});
    const fmt2 = (x)=> x.toLocaleString('fr-FR',{minimumFractionDigits:2, maximumFractionDigits:2});

    const seed = [
      { lib:'Taxe foncière (annuel)', per:'annuel', mt:1000, rec:false },
      { lib:'PNO (annuel)',          per:'annuel', mt:180,  rec:false },
      { lib:'GLI (% loyer HC)',      per:'mensuel',mt:1150*0.03, rec:false },
      { lib:'Syndic non récupérable',per:'mensuel',mt:20,   rec:false },
      { lib:'Syndic récupérable',    per:'mensuel',mt:35,   rec:true  },
      { lib:'Entretien / petites rép.', per:'mensuel', mt:25, rec:false },
      { lib:'Internet (meublé)',     per:'mensuel',mt:30,   rec:false },
      { lib:'Gestion locative (6%)', per:'mensuel',mt:1150*0.06, rec:false },
      { lib:'Comptable (annuel)',    per:'annuel', mt:500,  rec:false },
      { lib:'Provision CapEx (1% coût/an)', per:'annuel', mt:230000*0.01, rec:false }
    ];

    function perToMonthly(mt, per){
      if(per==='mensuel') return mt;
      if(per==='annuel')  return mt/12;
      return mt;
    }

    function addRow(i, item){
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="border px-3 py-2 font-medium">\${i}</td>
        <td class="border px-3 py-2"><input type="text" class="w-56 border rounded px-2 py-1" value="\${item.lib}"></td>
        <td class="border px-3 py-2">
          <select class="border rounded px-2 py-1">
            <option value="mensuel"\${item.per==='mensuel'?' selected':''}>Mensuel</option>
            <option value="annuel"\${item.per==='annuel'?' selected':''}>Annuel</option>
          </select>
        </td>
        <td class="border px-3 py-2"><input type="number" class="w-28 border rounded px-2 py-1" value="\${Math.round(item.mt)}" step="1" min="0"></td>
        <td class="border px-3 py-2 text-center"><input type="checkbox"\${item.rec?' checked':''}></td>
        <td class="border px-3 py-2 text-slate-700">—</td>
        <td class="border px-3 py-2 text-right"><button class="text-rose-600 hover:underline">Supprimer</button></td>
      `;
      tbody.appendChild(tr);
    }

    // Seed rows
    seed.forEach((it, idx)=> addRow(idx+1, it));

    function compute(){
      const loyer = parseFloat(byId('c-loyer').value || '0');
      const surf  = parseFloat(byId('c-surface').value || '0');
      const mensu = parseFloat(byId('c-mensu').value || '0');
      const cout  = parseFloat(byId('c-cout').value || '0');

      let totRec = 0, totNonRec = 0, totAll = 0;

      [...tbody.querySelectorAll('tr')].forEach(tr=>{
        const per = tr.children[2].querySelector('select').value;
        const mt  = parseFloat(tr.children[3].querySelector('input').value || '0');
        const rec = tr.children[4].querySelector('input').checked;
        const mNorm = perToMonthly(mt, per);
        tr.children[5].textContent = "€ "+fmt2(mNorm);
        totAll += mNorm;
        if(rec) totRec += mNorm; else totNonRec += mNorm;
      });

      // Sorties
      byId('tot-rec').textContent    = "€ "+fmt2(totRec);
      byId('tot-nonrec').textContent = "€ "+fmt2(totNonRec);
      byId('tot-all').textContent    = "€ "+fmt2(totAll);

      const eurm2 = (surf>0)? (totNonRec/surf) : 0;
      byId('eurm2').textContent = "€ "+fmt2(eurm2);

      const loyNet = Math.max(0, loyer - totNonRec);
      byId('loy-net').textContent = "€ "+fmt2(loyNet);

      const rendNet = (cout>0)? ((loyNet*12)/cout*100) : 0;
      byId('rend-net').textContent = rendNet>0 ? fmt2(rendNet)+" %" : "—";

      const cf = loyNet - mensu; // avant impôts
      byId('cf').textContent = (cf>=0? "€ "+fmt2(cf) : "€ "+fmt2(cf));
      byId('cf').className = cf>=0? "text-emerald-700 font-semibold" : "text-rose-600 font-semibold";
    }

    // Add row
    document.getElementById('chg-add').addEventListener('click', ()=>{
      const i = tbody.querySelectorAll('tr').length + 1;
      addRow(i, {lib:'Nouvelle charge', per:'mensuel', mt:0, rec:false});
      compute();
    });

    // Delete row
    tbody.addEventListener('click', (e)=>{
      if(e.target.tagName==='BUTTON'){
        e.target.closest('tr').remove();
        // Re-index
        [...tbody.querySelectorAll('tr')].forEach((tr, idx)=> tr.children[0].textContent = idx+1);
        compute();
      }
    });

    // Recompute on any input in the table or header inputs
    document.addEventListener('input', (e)=>{
      if(e.target.closest('#calco')) compute();
    });

    compute(); // initial
  })();
```

</details>
