/* Export PDF local du bilan. La bibliothèque et les polices sont chargées au premier export. */
(() => {
  "use strict";

  const dossier = new URL(".", document.currentScript.src);
  const marge = 36;
  const largeurUtile = 595.28 - 2 * marge; // A4 en points
  const bleu = {
    encre: "#153359",
    bandeau: "#153359",
    accent: "#235A96",
    secondaire: "#445B75",
    ligne: "#C6D7E9",
    fond: "#E8F1FA",
    alternance: "#F5F8FC",
    libelleSurEncre: "#E1EEFA",
    valeurSurEncre: "#BCDFFF"
  };
  let preparation;

  function palette(choix) {
    if (!/^#[0-9a-f]{6}$/i.test(choix) || choix.toUpperCase() === bleu.bandeau) return bleu;
    const rgb = choix.slice(1).match(/../g).map(v => parseInt(v, 16));
    const melange = (cible, part) => "#" + rgb.map(v =>
      Math.round(v * (1 - part) + cible * part).toString(16).padStart(2, "0")).join("");
    const lineariser = n => n <= .04045 ? n / 12.92 : ((n + .055) / 1.055) ** 2.4;
    const [r, g, b] = rgb.map(v => lineariser(v / 255));
    const luminance = .2126 * r + .7152 * g + .0722 * b;
    const surFond = luminance > .179 ? "#000000" : "#FFFFFF";
    return { encre: melange(0, .70), bandeau: choix, accent: luminance <= .179 ? choix : melange(0, .59),
      secondaire: melange(0, .65), ligne: melange(255, .68), fond: melange(255, .88), alternance: melange(255, .96),
      libelleSurEncre: surFond, valeurSurEncre: surFond };
  }

  function chargerFichier(nom) {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = new URL("vendor/" + nom, dossier).href;
      script.onload = resolve;
      script.onerror = () => {
        script.remove();
        reject(new Error("Le module d’export PDF n’a pas pu être chargé. Réessayez le téléchargement."));
      };
      document.head.append(script);
    });
  }

  function preparer() {
    if (!preparation) {
      preparation = (async () => {
        if (!window.pdfMake) await chargerFichier("pdfmake-0.3.15.min.js");
        await chargerFichier("vfs-roboto.js");
        return window.pdfMake;
      })().catch(erreur => {
        preparation = undefined;
        throw erreur;
      });
    }
    return preparation;
  }

  function texte(valeur) {
    // La police du PDF contient l’espace insécable française classique (U+00A0).
    return valeur == null ? "" : String(valeur).replace(/[\u202f\u2007]/g, "\u00a0");
  }

  function contenuCellule(valeur, couleur) {
    const contenu = texte(valeur);
    if (/^https?:\/\/\S+$/i.test(contenu)) {
      // Les coupures discrétionnaires préservent les adresses longues dans une cellule étroite.
      return { text: contenu.replace(/([/=?&#_.-])/g, "$1\u200b"), link: contenu, color: couleur.accent };
    }
    return { text: contenu };
  }

  function estNombre(valeur) {
    return /^\(?[+−-]?\s*\d[\d\s\u00a0\u202f.,]*(?:€|%|×|x|ans?|mois)?\)?$/i.test(texte(valeur).trim());
  }

  function indicateurs(items, couleur) {
    if (!items.length) return [];
    const colonnes = items.length === 4 ? 2 : Math.min(3, items.length);
    const lignes = [];
    for (let debut = 0; debut < items.length; debut += colonnes) {
      const rang = items.slice(debut, debut + colonnes).map(ind => ({
        fillColor: couleur.bandeau,
        margin: [9, 6, 9, 6],
        stack: [
          { text: texte(ind.label), fontSize: 9, color: couleur.libelleSurEncre, margin: [0, 0, 0, 3] },
          { text: texte(ind.valeur), bold: true, color: couleur.valeurSurEncre, fontSize: 15 }
        ]
      }));
      while (rang.length < colonnes) rang.push({ text: "", fillColor: "white" });
      lignes.push(rang);
    }
    return [{
      table: { widths: Array(colonnes).fill("*"), body: lignes, dontBreakRows: true },
      layout: {
        hLineWidth: () => 2, vLineWidth: () => 2,
        hLineColor: () => "white", vLineColor: () => "white",
        paddingTop: () => 0, paddingBottom: () => 0, paddingLeft: () => 0, paddingRight: () => 0
      },
      margin: [-1, 5, -1, 5]
    }];
  }

  function creerTableau(titres, lignes, couleur) {
    const n = titres.length;
    const petite = n >= 7;
    const padding = n >= 5 ? 4 : 6;
    const tailleTexte = petite ? 8.3 : n >= 5 ? 9 : 9.5;
    const numeros = titres.map((_, i) => {
      const valeurs = lignes.map(ligne => ligne[i]).filter(v => texte(v).trim());
      return valeurs.length > 0 && valeurs.filter(estNombre).length >= .8 * valeurs.length;
    });
    const poids = titres.map((nom, i) => {
      const max = lignes.reduce((m, ligne) => Math.max(m, texte(ligne[i]).length), 0);
      if (numeros[i]) return Math.max(5, Math.min(18, Math.max(max, nom.length * .65)) + 2);
      return Math.max(9, Math.min(n <= 3 ? 68 : 27, Math.max(max, nom.length)) + 2);
    });
    const somme = poids.reduce((a, b) => a + b, 0);
    const largeur = largeurUtile - 2 * padding * n;
    const largeurs = poids.map(p => largeur * p / somme);
    const corps = [
      titres.map((v, i) => ({
        ...contenuCellule(v, couleur), bold: true, color: couleur.encre,
        fillColor: couleur.fond, alignment: numeros[i] ? "right" : "left"
      })),
      ...lignes.map((ligne, index) => titres.map((_, i) => ({
        ...contenuCellule(ligne[i], couleur), alignment: numeros[i] ? "right" : "left",
        fillColor: index % 2 ? couleur.alternance : undefined
      })))
    ];
    return {
      fontSize: tailleTexte,
      table: { headerRows: 1, keepWithHeaderRows: lignes.length ? 1 : 0, dontBreakRows: true, widths: largeurs, body: corps },
      layout: {
        hLineWidth: i => i === 1 ? .7 : .25, hLineColor: () => couleur.ligne,
        vLineWidth: () => 0, paddingLeft: () => padding, paddingRight: () => padding,
        paddingTop: i => i === 0 ? 4 : 2.4, paddingBottom: i => i === 0 ? 4 : 2.4
      },
      margin: [0, 3, 0, 6]
    };
  }

  function tableaux(table, couleur) {
    const titres = (table.colonnes || []).map(texte);
    if (!titres.length) return [];
    const lignes = table.lignes || [];
    const blocs = [];
    if (table.titre) blocs.push({ text: texte(table.titre), style: "titreTable", headlineLevel: 3 });
    if (titres.length <= 8) {
      blocs.push(creerTableau(titres, lignes, couleur));
      return blocs;
    }
    // Un tableau exceptionnellement large reste lisible en répétant sa colonne d’identification.
    for (let debut = 1; debut < titres.length; debut += 7) {
      const colonnes = [titres[0], ...titres.slice(debut, debut + 7)];
      const valeurs = lignes.map(ligne => [ligne[0], ...ligne.slice(debut, debut + 7)]);
      blocs.push(creerTableau(colonnes, valeurs, couleur));
    }
    return blocs;
  }

  function documentPdf(rapport, identite) {
    if (!rapport || !Array.isArray(rapport.sections)) {
      throw new Error("Ouvrez un bilan calculé pour créer son PDF.");
    }
    const couleur = palette(identite.couleur);
    const titre = texte(identite.titre).trim() || texte(rapport.titre).trim() || "Bilan locatif";
    const auteur = texte(identite.nom).trim() || "Ma Rentabilité IA";
    const logo = /^data:image\/png;base64,[A-Za-z0-9+/=]+$/.test(identite.logo || "") ? identite.logo : null;
    const identification = { text: auteur, fontSize: 10, bold: true, color: couleur.accent };
    const pied = texte(identite.pied).trim();
    const contenu = [{ text: titre, style: "titre" }];
    if (rapport.sousTitre) contenu.push({ text: texte(rapport.sousTitre), style: "sousTitre" });
    if (identite.introduction) contenu.push({ text: texte(identite.introduction), margin: [0, 3, 0, 8] });
    contenu.push(...indicateurs(rapport.indicateurs || [], couleur));
    for (const section of rapport.sections) {
      contenu.push({ text: texte(section.titre), style: "section", headlineLevel: 2,
        ...(section.nouvellePage ? { pageBreak: "before" } : {}) });
      for (const p of section.paragraphes || []) {
        contenu.push({ ...contenuCellule(p, couleur), margin: [0, 0, 0, 4] });
      }
      for (const table of section.tables || []) contenu.push(...tableaux(table, couleur));
    }
    return {
      info: { title: titre, author: auteur, subject: "Simulation d’un investissement locatif" },
      images: logo ? { logoPro: logo } : {},
      language: "fr-FR",
      pageSize: "A4",
      pageMargins: [marge, logo ? 70 : identite.nom ? 58 : 49, marge, pied ? 56 : 42],
      defaultStyle: { font: "Roboto", fontSize: 10, color: couleur.encre, lineHeight: 1.12 },
      styles: {
        titre: { fontSize: 25, bold: true, lineHeight: 1.02, margin: [0, 3, 0, 4] },
        sousTitre: { fontSize: 11, color: couleur.secondaire, margin: [0, 0, 0, 7] },
        section: { fontSize: 16, bold: true, color: couleur.accent, margin: [0, 11, 0, 5] },
        titreTable: { fontSize: 10.5, bold: true, margin: [0, 5, 0, 1] }
      },
      header: {
        margin: [marge, 19, marge, 0],
        stack: [
          logo ? { columns: [{ width: 95, stack: [{ image: "logoPro", fit: [86, 29] }] },
            { ...identification, width: "*", alignment: "right", margin: [0, 4, 0, 0] }] } : identification,
          { canvas: [{ type: "line", x1: 0, y1: 5, x2: largeurUtile, y2: 5, lineWidth: .6, lineColor: couleur.ligne }] }
        ]
      },
      footer: (page, total) => ({
        margin: [marge, 5, marge, 0],
        stack: [
          { canvas: [{ type: "line", x1: 0, y1: 0, x2: largeurUtile, y2: 0, lineWidth: .6, lineColor: couleur.ligne }] },
          { columns: [{ text: pied, width: "*" }, { text: page + " / " + total, width: 56, alignment: "right" }],
            columnGap: 10, fontSize: 8.5, color: couleur.secondaire, margin: [0, 5, 0, 0] }
        ]
      }),
      pageBreakBefore: (noeud, autour) => {
        if (!noeud.headlineLevel) return false;
        if (noeud.headlineLevel === 2 && noeud.startPosition.verticalRatio > .88) return true;
        return !autour.getFollowingNodesOnPage().some(n => !n.headlineLevel && (n.text || n.table));
      },
      content: contenu
    };
  }

  async function blob(rapport, identite = {}) {
    const doc = documentPdf(rapport, identite);
    const lib = await preparer();
    return lib.createPdf(doc).getBlob();
  }

  async function telecharger(rapport, nom = "bilan-locatif.pdf", identite = {}) {
    const documentGenere = await blob(rapport, identite);
    const adresse = URL.createObjectURL(documentGenere);
    const lien = document.createElement("a");
    lien.href = adresse;
    lien.download = nom;
    document.body.append(lien);
    lien.click();
    lien.remove();
    window.setTimeout(() => URL.revokeObjectURL(adresse), 60_000);
  }

  window.RentaPDF = Object.freeze({ blob, telecharger, palette });
})();
