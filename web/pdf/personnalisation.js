/* La charte reste dans le navigateur. Le titre et le commentaire sont propres au document ouvert. */
(() => {
  "use strict";
  const cle = "ma-rentabilite-ia.identite.v1";
  const origine = { nom: "", couleur: "#153359", logo: "", pied: "" };
  const modal = document.getElementById("identite-pdf");
  const form = modal.querySelector("form");
  const champs = form.elements;
  const erreur = form.querySelector('[role="alert"]');
  const image = modal.querySelector(".apercu-pdf img");
  const textes = new WeakMap();
  let identite = { ...origine }, memorisee = false;
  let actif, logo, generation = 0, informer;
  try {
    const stocke = JSON.parse(localStorage.getItem(cle));
    if (stocke && typeof stocke === "object") {
      for (const k of Object.keys(origine))
        if (typeof stocke[k] === "string") identite[k] = stocke[k];
      if (!/^#[0-9a-f]{6}$/i.test(identite.couleur)) identite.couleur = origine.couleur;
      if (!identite.logo.startsWith("data:image/png;base64,")) identite.logo = "";
      memorisee = true;
    }
  } catch { /* Le navigateur peut désactiver le stockage local. */ }

  function valeur(rapport) {
    return { ...identite, ...textes.get(rapport) };
  }

  function apercu() {
    const teinte = RentaPDF.palette(champs.couleur.value);
    const montrer = (k, s) => { modal.querySelector('[data-apercu="' + k + '"]').textContent = s; };
    montrer("nom", champs.nom.value.trim() || "Ma Rentabilité IA");
    montrer("titre", champs.titre.value.trim() || actif.titre);
    const indicateur = actif.indicateurs?.[0];
    montrer("indicateur", indicateur ? indicateur.label + " · " + indicateur.valeur : actif.sousTitre);
    montrer("pied", champs.pied.value);
    const bandeau = modal.querySelector('[data-apercu="indicateur"]');
    bandeau.style.backgroundColor = teinte.bandeau;
    bandeau.style.color = teinte.valeurSurEncre;
    image.hidden = !logo;
    if (logo) image.src = logo;
    else image.removeAttribute("src");
    champs.retirer.hidden = !logo;
  }

  function remplir(p, memoriser) {
    generation++;
    for (const k of ["nom", "couleur", "pied", "titre", "introduction"]) champs[k].value = p[k] || "";
    champs.titre.placeholder = actif.titre;
    champs.teinte.value = champs.couleur.value;
    champs.memoriser.checked = memoriser;
    logo = p.logo;
    champs.image.value = "";
    form.querySelector('[type="submit"]').disabled = false;
    erreur.textContent = "";
    apercu();
  }

  function ouvrir(rapport, notifier) {
    actif = rapport;
    informer = notifier;
    remplir(valeur(rapport), memorisee);
    modal.showModal();
    champs.nom.focus();
  }

  // La conversion en PNG conserve les proportions et retire les métadonnées du fichier.
  async function lireLogo(fichier) {
    const url = URL.createObjectURL(fichier);
    try {
      const originale = new Image();
      originale.src = url;
      await originale.decode();
      if (!originale.naturalWidth || !originale.naturalHeight) throw new Error();
      const ratio = Math.min(1, 720 / originale.naturalWidth, 280 / originale.naturalHeight);
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(originale.naturalWidth * ratio));
      canvas.height = Math.max(1, Math.round(originale.naturalHeight * ratio));
      canvas.getContext("2d").drawImage(originale, 0, 0, canvas.width, canvas.height);
      return canvas.toDataURL("image/png");
    } finally { URL.revokeObjectURL(url); }
  }

  champs.image.addEventListener("change", async () => {
    const fichier = champs.image.files[0];
    if (!fichier) return;
    const ticket = ++generation;
    const appliquer = form.querySelector('[type="submit"]');
    appliquer.disabled = true;
    erreur.textContent = "";
    try {
      const donnees = await lireLogo(fichier);
      if (ticket === generation) { logo = donnees; apercu(); }
    } catch {
      if (ticket === generation) erreur.textContent = "Ce logo ne peut pas être lu. Choisissez une image PNG, JPEG, WebP ou SVG.";
    } finally {
      if (ticket === generation) appliquer.disabled = false;
    }
  });
  champs.retirer.addEventListener("click", () => {
    generation++;
    logo = ""; champs.image.value = ""; erreur.textContent = "";
    form.querySelector('[type="submit"]').disabled = false;
    apercu();
  });
  form.addEventListener("input", e => {
    if (e.target === champs.teinte) champs.couleur.value = champs.teinte.value;
    else if (e.target === champs.couleur && champs.couleur.validity.valid) champs.teinte.value = champs.couleur.value;
    apercu();
  });
  champs.annuler.addEventListener("click", () => modal.close());
  champs.defaut.addEventListener("click", () => remplir(origine, false));
  modal.addEventListener("close", () => { generation++; });
  form.addEventListener("submit", e => {
    e.preventDefault();
    identite = { nom: champs.nom.value.trim(), couleur: champs.couleur.value, logo, pied: champs.pied.value.trim() };
    textes.set(actif, { titre: champs.titre.value.trim(), introduction: champs.introduction.value.trim() });
    memorisee = champs.memoriser.checked;
    let message = "Personnalisation appliquée au document.";
    try {
      if (memorisee) localStorage.setItem(cle, JSON.stringify(identite));
      else localStorage.removeItem(cle);
    } catch {
      if (memorisee) message = "Personnalisation appliquée. Ce navigateur ne peut pas la mémoriser.";
      memorisee = false;
    }
    modal.close();
    informer(message);
  });

  function markdown(rapport) {
    const p = valeur(rapport);
    const parties = [p.nom, rapport.sousTitre, p.introduction].filter(Boolean);
    const contenu = RentaRapport.texte({ ...rapport, titre: p.titre || rapport.titre, sousTitre: parties.join("\n\n") });
    return p.pied ? contenu + "\n\n---\n\n" + p.pied : contenu;
  }
  window.RentaIdentite = { ouvrir, valeur, markdown };
})();
