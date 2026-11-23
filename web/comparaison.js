/* Les deux dossiers restent dans le fragment de l’adresse. */
(() => {
  "use strict";
  const base = "https://fmacfa.github.io/ma-rentabilite-ia/";

  function fiche(lien) {
    let fragment = lien.trim();
    if (!fragment.startsWith("#") && !/^(?:exemple|v)=/.test(fragment)) {
      let url;
      try { url = new URL(fragment); } catch { throw new Error("Collez le lien d’un bilan locatif."); }
      if (url.origin + url.pathname !== base) throw new Error("Le lien doit provenir de Ma Rentabilité IA.");
      fragment = url.hash;
    }
    fragment = fragment.replace(/^#/, "");
    if (fragment.startsWith("exemple=")) {
      const params = new URLSearchParams(fragment);
      const nom = params.get("exemple");
      if (!Object.hasOwn(RentaContenus.exemples, nom)) throw new Error("Cet exemple est introuvable.");
      const projet = structuredClone(RentaContenus.exemples[nom]);
      if (params.size !== (params.has("effort") ? 2 : 1)) throw new Error("Lien d’exemple invalide.");
      if (params.has("effort")) projet.projection.effort_max_mensuel = RentaChamps.valeur("projection.effort_max_mensuel", params.get("effort"));
      return { projet, exemple: nom, fragment };
    }
    return { projet: RentaChamps.decode(fragment), fragment };
  }

  function encoder(a, b) {
    return "#" + new URLSearchParams({ duo: "1", a: fiche(a).fragment, b: fiche(b).fragment });
  }

  function decoder(h) {
    const p = new URLSearchParams(h.replace(/^#/, ""));
    if (p.size !== 3 || p.get("duo") !== "1" || !p.get("a") || !p.get("b"))
      throw new Error("La comparaison demande un lien pour chacun des deux biens.");
    return [fiche(p.get("a")), fiche(p.get("b"))];
  }

  function rapport(dossiers) {
    const { eur, pct } = RentaRapport;
    const [a, b] = dossiers;
    const complet = dossiers.every(d => d.r.statut === "calcule");
    const memeFlux = complet && a.r.flux_retenus === b.r.flux_retenus;
    const memeHorizon = complet && a.r.annees.length === b.r.annees.length;
    const biens = ["Bien A", "Bien B"];
    const ligne = (nom, fn, format = eur) => [nom, ...dossiers.map(d => format(fn(d)))];
    const an = d => d.r.annees?.[0];
    const effort = d => Math.max(0, -an(d).cash_flow_mensuel_retenu);
    const table = (titre, lignes) => ({ titre, colonnes: ["Indicateur", ...biens], lignes });
    const notes = [];
    if (!complet) notes.push("Comparaison provisoire. Les informations manquantes figurent sous le bien concerné.");
    else if (!memeFlux) notes.push("Les colonnes utilisent des conventions fiscales différentes. Pour comparer la trésorerie sur la même base, utilisez la ligne avant impôt.");
    if (complet && !memeHorizon) notes.push("Les horizons diffèrent. Choisissez une même année de vente dans les deux fiches pour mesurer l’écart à la sortie.");
    if (dossiers.some(d => !d.r.revente)) notes.push("Pour chiffrer une vente, renseignez son prix, ses frais et son impôt dans chaque dossier concerné.");
    if (memeFlux) {
      const ecart = effort(b) - effort(a);
      notes.push(Math.abs(ecart) < .005 ? "L’effort d’épargne moyen est identique pour les deux biens en année 1."
        : "En année 1, le bien " + (ecart < 0 ? "B" : "A") + " demande " + eur(Math.abs(ecart)) + " de moins par mois en moyenne.");
    }
    if (memeHorizon && memeFlux && dossiers.every(d => d.r.revente)) {
      const ecart = b.r.revente.produit_net - a.r.revente.produit_net;
      notes.push(Math.abs(ecart) < .005 ? "Les deux biens donnent le même produit net de vente à l’horizon choisi."
        : "À la vente en année " + a.r.annees.length + ", le bien " + (ecart > 0 ? "B" : "A") + " rapporte " + eur(Math.abs(ecart)) + " de plus après remboursement de la dette, frais et impôt.");
    }
    const synthese = {
      titre: "Les deux biens en chiffres", paragraphes: notes,
      tables: [
        table("Achat et exploitation", [
          ligne("Prix d’achat", d => d.projet.achat?.prix),
          ligne("Coût initial, frais bancaires compris", d => d.r.cout_initial_total),
          ligne("Fonds propres à engager", d => d.r.fonds_propres_initiaux),
          ligne("Loyers et annexes encaissés en année 1", d => an(d)?.recettes_hc_et_annexes),
          ligne("Gestion et charges du bailleur", d => an(d) && an(d).gestion + an(d).charges_proprietaire),
          ligne("Crédit et assurance en année 1", d => an(d)?.dette_assurance_comprise),
          ligne("Impôt locatif en année 1", d => an(d)?.fiscalite.impot),
          ligne("Trésorerie mensuelle avant impôt", d => an(d) && an(d).cash_flow_avant_impot / 12),
          ligne("Trésorerie mensuelle retenue", d => an(d)?.cash_flow_mensuel_retenu),
          ligne("Effort mensuel à prévoir", d => an(d) && effort(d)),
          ligne("Convention de trésorerie", d => d.r.flux_retenus || "À préciser", String),
        ]),
        table("Détention et vente", [
          ligne("Horizon étudié", d => d.projet.projection?.annees, v => v == null ? "À préciser" : v + (v > 1 ? " ans" : " an")),
          ligne("Trésorerie cumulée hors vente", d => d.r.cash_flow_cumule_hors_vente),
          ligne("Prix de vente envisagé", d => d.projet.revente?.prix),
          ligne("Dette à rembourser à la vente", d => d.r.revente?.dette_remboursee),
          ligne("Frais, indemnité et impôt de cession", d => d.r.revente && d.r.revente.frais + d.r.revente.indemnite + d.r.revente.impot_cession),
          ligne("Produit net de vente", d => d.r.revente?.produit_net),
          ligne("TRI des fonds propres", d => d.r.bilan_avec_revente?.tri_pct, pct),
        ]),
      ],
    };
    const sections = [synthese];
    dossiers.forEach((d, i) => {
      if (d.rapport) {
        for (const [j, section] of d.rapport.sections.entries()) sections.push({
          ...section, titre: biens[i] + " · " + section.titre, nouvellePage: j === 0,
        });
      } else {
        sections.push({ titre: biens[i] + " · Données à compléter",
          paragraphes: [d.r.motif, ...Object.values({ ...d.r.questions, ...d.r.erreurs }), ...(d.projet.hypotheses || [])].filter(Boolean), tables: [] });
      }
    });
    return { titre: "Comparaison de deux biens locatifs",
      sousTitre: (complet ? "Deux projets chiffrés" : "Dossiers en cours") + " · Synthèse suivie du détail de chaque bien",
      indicateurs: dossiers.map((d, i) => ({ label: biens[i] + " · Effort mensuel en année 1", valeur: an(d) ? eur(effort(d)) : "À compléter" })),
      sections };
  }

  window.RentaComparaison = { fiche, encoder, decoder, rapport };
})();
