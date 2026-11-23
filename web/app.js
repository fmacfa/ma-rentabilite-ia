(() => {
  "use strict";
  const BASE = "https://fmacfa.github.io/ma-rentabilite-ia/";
  const GUIDE = BASE + "assistant.md";
  const TITRES = {
    lina: "Le bilan de Lina",
    "location-nue": "Location nue en direct",
    "location-meublee": "Location meublée à l’année",
    tourisme: "Meublé de tourisme",
    "sci-is": "Société civile à l’IS",
    jeanbrun: "Location sous Jeanbrun",
  };
  const home = document.getElementById("accueil"),
    zone = document.getElementById("dossier");
  let version = 0,
    minuterie;
  const el = (tag, texte, classe) => {
    const n = document.createElement(tag);
    if (texte !== undefined && texte !== null) n.textContent = texte;
    if (classe) n.className = classe;
    return n;
  };
  const lien = (texte, url, classe) => {
    const a = el("a", texte, classe);
    a.href = url;
    return a;
  };
  function bouton(texte, action, classe = "btn") {
    const b = el("button", texte, classe);
    b.type = "button";
    b.addEventListener("click", () => action(b));
    return b;
  }
  function notifier(s) {
    const n = document.getElementById("notification");
    n.textContent = s;
    clearTimeout(minuterie);
    minuterie = setTimeout(() => {
      n.textContent = "";
    }, 4500);
  }
  async function copier(texte, message) {
    try {
      if (!navigator.clipboard?.writeText) throw new Error();
      await navigator.clipboard.writeText(texte);
      notifier(message);
    } catch {
      const d = document.getElementById("copie-manuelle"),
        area = d.querySelector("textarea");
      area.value = texte;
      d.showModal();
      area.focus();
      area.select();
    }
  }
  document
    .getElementById("copier-lien")
    .addEventListener("click", () =>
      copier(
        "Lis ce guide et accompagne-moi pas à pas pour étudier mon investissement locatif. " +
          GUIDE,
        "Message et lien copiés. Collez-les dans votre IA.",
      ),
    );
  document
    .getElementById("copier-guide")
    .addEventListener("click", () =>
      copier(
        RentaContenus.guide,
        "Guide copié. Collez-le dans votre conversation.",
      ),
    );
  document.querySelector(".skip").addEventListener("click", (event) => {
    event.preventDefault();
    document.getElementById("contenu").focus();
  });
  const neuf = () => ({
    achat: { prix: null, mode_acte: "montant", frais_acte: null },
    credit: { capital: null },
    location: { type: "nue", loyer_mensuel_hc: null, vacance_pct: null },
    charges_annuelles: null,
    fiscalite: { regime: "avant_impot" },
    projection: { annees: 1 },
    hypotheses: [],
  });
  function entete(titre, sousTitre) {
    zone.replaceChildren(
      lien("Retour à l’accueil", "index.html", "retour"),
      el("h1", titre),
    );
    if (sousTitre) zone.append(el("p", sousTitre, "sous-titre"));
    document.title = titre + " · Ma Rentabilité";
  }
  function tableau(t) {
    const cont = el("div", null, "table-bloc"),
      titre = el("h3", t.titre);
    const scroll = el("div", null, "table-scroll"),
      table = el("table");
    const head = el("thead"),
      cols = el("tr");
    for (const nom of t.colonnes) {
      const th = el("th", nom);
      th.scope = "col";
      cols.append(th);
    }
    head.append(cols);
    table.append(head);
    const body = el("tbody");
    for (const ligne of t.lignes) {
      const tr = el("tr");
      for (const valeur of ligne) tr.append(el("td", valeur));
      body.append(tr);
    }
    table.append(body);
    table.setAttribute("aria-label", t.titre);
    scroll.append(table);
    cont.append(titre, scroll);
    return cont;
  }
  function vueSection(s, ouvrir = false) {
    const b = el("details", null, "bloc");
    b.open = ouvrir;
    b.append(el("summary", s.titre));
    const corps = el("div", null, "detail-body");
    for (const phrase of s.paragraphes || []) {
      const p = el("p");
      for (const token of phrase.split(/(https:\/\/[^\s]+)/g)) {
        if (token.startsWith("https://")) p.append(lien(token, token));
        else p.append(document.createTextNode(token));
      }
      corps.append(p);
    }
    for (const t of s.tables || []) corps.append(tableau(t));
    b.append(corps);
    return b;
  }
  function exportPDF(rapport, titre = "Télécharger le PDF") {
    return bouton(
      titre,
      async (b) => {
        b.disabled = true;
        b.textContent = "Préparation du PDF…";
        try {
          await RentaPDF.telecharger(rapport);
          notifier("Le PDF est prêt à être enregistré.");
        } catch {
          notifier(
            "Le PDF n’a pas pu être créé. Réessayez ou copiez le détail du bilan.",
          );
        } finally {
          b.disabled = false;
          b.textContent = titre;
        }
      },
      "btn primary",
    );
  }
  function textePourIA(p, r = null, statut = null) {
    const parties = [
      "Guide de simulation : " + GUIDE,
      "Mon projet : " + BASE + RentaChamps.encode(p),
    ];
    if (r)
      parties.push(
        "Voici les calculs de mon bilan. Explique-moi les chiffres et les hypothèses qui changeraient ma décision.",
        RentaRapport.texte(r),
      );
    else
      parties.push(
        "Aide-moi à compléter ce dossier. Pose-moi deux ou trois questions à la fois.",
        ...Object.values({ ...statut?.questions, ...statut?.erreurs }),
      );
    return parties.join("\n\n");
  }
  function renderRapport(p, r, nom, defauts, compare, variantes) {
    const rapport = RentaRapport.construire(
      p,
      r,
      defauts,
      compare,
      nom,
      variantes,
    );
    entete(rapport.titre, rapport.sousTitre);
    const stats = el("div", null, "stats");
    for (const i of rapport.indicateurs) {
      const s = el("div", null, "stat");
      s.append(el("span", i.label), el("strong", i.valeur));
      stats.append(s);
    }
    zone.append(stats);
    const actions = el("div", null, "actions");
    actions.append(
      exportPDF(rapport),
      bouton("Copier le détail pour mon IA", () =>
        copier(
          textePourIA(actuel, rapport),
          "Calculs détaillés copiés pour votre IA.",
        ),
      ),
      bouton("Modifier les chiffres", () => ouvrirEdition(actuel)),
    );
    zone.append(actions);
    const partage = el("p", null, "fine");
    partage.append(
      bouton(
        "Copier le lien de ce bilan",
        () => copier(BASE + RentaChamps.encode(actuel), "Lien du bilan copié."),
        "btn sm",
      ),
      document.createTextNode(
        "  Le lien personnel contient les chiffres du dossier.",
      ),
    );
    zone.append(partage, el("h2", "Détail des calculs", "rapport-titre"));
    const intro = el("p", null, "rapport-intro");
    intro.append(
      "Chaque rubrique reprend vos montants et leurs formules. Le PDF inclut toutes les rubriques. ",
      lien("Consulter toutes les formules", "calculs.html"),
    );
    zone.append(intro);
    for (const s of rapport.sections)
      zone.append(vueSection(s, s.titre === "Trésorerie de la première année"));
  }
  function incomplet(p, r) {
    entete(
      "Votre projet à compléter",
      "Les chiffres déjà renseignés restent dans ce dossier.",
    );
    const err = el("div", null, "attention");
    err.append(
      el(
        "h2",
        r.statut === "hors_perimetre"
          ? "Une hypothèse à revoir"
          : "Chiffres ou précisions nécessaires",
      ),
    );
    if (r.motif) err.append(el("p", r.motif));
    const items = Object.entries({ ...r.erreurs, ...r.questions });
    if (items.length) {
      const ul = el("ul");
      for (const [k, v] of items)
        ul.append(
          el(
            "li",
            v + " (" + (RentaChamps.descriptif(k, p)?.label ?? "Dossier") + ")",
          ),
        );
      err.append(ul);
    }
    zone.append(err);
    const actions = el("div", null, "actions");
    actions.append(
      bouton("Compléter les chiffres", () => ouvrirEdition(p), "btn primary"),
      bouton("Continuer avec mon IA", () =>
        copier(
          textePourIA(p, null, r),
          "Dossier et questions copiés pour votre IA.",
        ),
      ),
    );
    zone.append(actions);
    const rep = r.premiers_reperes;
    if (rep?.loyer_theorique_annuel_hc != null) {
      const rapport = {
        titre: "Première estimation du loyer",
        sousTitre:
          "Projet incomplet · avant frais, vacance, crédit et fiscalité",
        indicateurs: [
          {
            label: "Loyer théorique annuel HC",
            valeur: RentaRapport.eur(rep.loyer_theorique_annuel_hc),
          },
          {
            label: "Rendement sur prix affiché",
            valeur: RentaRapport.pct(rep.brut_sur_prix_annonce_hors_frais_pct),
          },
        ],
        sections: [
          {
            titre: "Premier calcul",
            paragraphes: [
              RentaRapport.eur(p.location.loyer_mensuel_hc) +
                " × 12 = " +
                RentaRapport.eur(rep.loyer_theorique_annuel_hc) +
                " de loyer annuel théorique.",
              RentaRapport.eur(rep.loyer_theorique_annuel_hc) +
                " / " +
                RentaRapport.eur(p.achat.prix) +
                " × 100 = " +
                RentaRapport.pct(rep.brut_sur_prix_annonce_hors_frais_pct) +
                " sur le prix affiché.",
            ],
            tables: [],
          },
          {
            titre: "Données à compléter",
            paragraphes: items.map(([, v]) => v),
            tables: [],
          },
        ],
      };
      zone.append(
        vueSection(rapport.sections[0], true),
        exportPDF(rapport, "Télécharger cette estimation en PDF"),
      );
    }
  }
  let actuel;
  const structurants = new Set([
    "achat.mode_acte",
    "credit.capital",
    "credit.differe_mois",
    "credit.mode_assurance",
    "location.type",
    "fiscalite.regime",
    "fiscalite.mode_ir",
    "revente.mode_indemnite",
    "revente.mode_impot",
  ]);
  function champsFormulaire(p) {
    const a = p.achat || {},
      c = p.credit || {},
      l = p.location || {},
      f = p.fiscalite || {},
      v = p.revente || {};
    const keys = {
      achat: [
        "prix",
        "mode_acte",
        ...((a.mode_acte ?? "montant") === "montant"
          ? ["frais_acte"]
          : a.mode_acte === "ancien_estime"
            ? ["taux_departement_pct"]
            : []),
        "agence_en_plus",
        "travaux",
        "mobilier",
        "autres",
      ],
      location: [
        "type",
        ...(l.type?.startsWith("tourisme")
          ? ["prix_nuit", "occupation_pct"]
          : ["loyer_mensuel_hc", "vacance_pct"]),
        "annexes_mensuelles",
        "gestion_pct",
        "delai_mois",
        "charges_refacturees_annuelles",
      ],
      charges_annuelles: Object.keys(p.charges_annuelles || {}),
      credit: [
        c.apport_hors_frais_bancaires != null
          ? "apport_hors_frais_bancaires"
          : "capital",
      ],
      fiscalite: ["regime"],
      projection: [
        "annees",
        "index_loyers_pct",
        "index_charges_pct",
        "actualisation_pct",
      ],
    };
    if (!keys.charges_annuelles.length) keys.charges_annuelles = ["total"];
    if (c.capital > 0 || c.apport_hors_frais_bancaires != null) {
      keys.credit.push(
        "taux_pct",
        "duree_mois",
        "mode_assurance",
        "assurance",
        "differe_mois",
      );
      if (c.differe_mois > 0) keys.credit.push("type_differe");
    }
    keys.credit.push("garantie", "dossier");
    if (f.regime === "montant_connu")
      keys.fiscalite.push("impot_annuel", "evolution_impot_connu");
    else if (f.regime && f.regime !== "avant_impot") {
      keys.fiscalite.push(
        "annee_reference",
        "detention",
        "conditions_confirmees",
      );
      if (f.regime !== "sci_is")
        keys.fiscalite.push(
          "mode_ir",
          ...(f.mode_ir === "bareme_indicatif"
            ? ["revenu_hors_location", "parts"]
            : ["tmi_pct"]),
        );
      if (f.regime.startsWith("micro_")) {
        keys.fiscalite.push("micro_compatible", "autres_recettes");
        if (f.regime === "micro_bic")
          keys.fiscalite.push(
            "recettes_n1",
            "recettes_n2",
            "revenus_comparaison_lmp",
          );
      } else
        keys.fiscalite.push(
          "charges_deductibles_annuelles",
          "deductions_annee_1",
        );
      if (["sci_is", "lmnp_reel"].includes(f.regime))
        keys.fiscalite.push("amortissement_annuel", "base_amortissable");
      if (f.regime === "lmnp_reel")
        keys.fiscalite.push("autres_recettes", "revenus_comparaison_lmp");
      if (f.regime === "sci_is")
        keys.fiscalite.push("taux_reduit_is", "dividendes_bruts_annuels");
      if (f.regime === "jeanbrun")
        keys.fiscalite.push(
          "type_jeanbrun",
          "niveau_jeanbrun",
          "base_jeanbrun",
          "plafond_jeanbrun",
          "mois_jeanbrun_an1",
        );
    }
    if (p.revente) {
      keys.revente = ["prix", "frais", "mode_indemnite"];
      if (v.mode_indemnite !== "plafond") keys.revente.push("indemnite");
      keys.revente.push(
        "mode_impot",
        ...(v.mode_impot === "particulier"
          ? [
              "cas_particulier_confirme",
              "base_acquisition_fiscale",
              "frais_cession_deductibles",
              "amortissements_a_reintegrer",
            ]
          : ["impot"]),
      );
    }
    return keys;
  }
  const conventions = {
    mode_acte: "montant",
    mode_ir: "tmi",
    evolution_impot_connu: "constant",
    mode_indemnite: "montant",
    mode_impot: "montant",
    agence_en_plus: 0,
    travaux: 0,
    mobilier: 0,
    autres: 0,
    garantie: 0,
    dossier: 0,
    differe_mois: 0,
    annexes_mensuelles: 0,
    gestion_pct: 0,
    delai_mois: 0,
    charges_refacturees_annuelles: 0,
    index_loyers_pct: 0,
    index_charges_pct: 0,
    actualisation_pct: 5,
    deductions_annee_1: 0,
    dividendes_bruts_annuels: 0,
  };
  const aides = {
    "credit.capital": "Indiquez 0 pour un achat comptant.",
    "credit.duree_mois": "20 ans correspondent à 240 mois.",
    "achat.taux_departement_pct":
      "Facultatif. Sans taux, la provision dans l’ancien est de 7,5 %.",
    "fiscalite.revenus_comparaison_lmp":
      "Demandé en longue durée si les recettes meublées dépassent 23 000 €.",
    "fiscalite.conditions_confirmees":
      "Vérifiez les conditions d’accès au régime et les prélèvements applicables avec votre IA.",
    "projection.annees": "Le rapport présente une ligne de calcul par année.",
  };
  function ouvrirEdition(source) {
    ++version;
    zone.removeAttribute("aria-busy");
    actuel = JSON.parse(JSON.stringify(source));
    const ouvert = new Set([
      "achat",
      "location",
      "charges_annuelles",
      "credit",
    ]);
    function dessiner(focus = null) {
      entete(
        "Les chiffres de votre projet",
        "Vous pouvez commencer avec les montants connus et reprendre les autres avec votre IA.",
      );
      const form = el("form");
      form.noValidate = true;
      const notes = el(
        "p",
        "Les champs marqués « par défaut » indiquent l’hypothèse utilisée si vous les laissez tels quels.",
        "form-note",
      );
      form.append(notes);
      const erreurs = el("p", null, "error-message");
      erreurs.setAttribute("role", "alert");
      const champs = champsFormulaire(actuel);
      for (const [g, cles] of Object.entries(champs)) {
        const d = el("details", null, "form-set");
        d.open = ouvert.has(g);
        d.append(el("summary", RentaChamps.groupes[g]));
        d.addEventListener("toggle", () => {
          if (!d.isConnected) return;
          if (d.open) ouvert.add(g);
          else ouvert.delete(g);
        });
        const grille = el("div", null, "fields");
        for (const k of cles) {
          const key = g + "." + k,
            meta = RentaChamps.descriptif(key, actuel);
          const original = actuel[g]?.[k],
            def =
              g !== "charges_annuelles" && original === undefined
                ? conventions[k]
                : undefined;
          const val = original ?? def;
          const cont = el("div", null, "field"),
            id = "champ-" + key;
          const label = el(
            "label",
            meta.label + (meta.unite ? " (" + meta.unite + ")" : ""),
          );
          label.htmlFor = id;
          cont.append(label);
          let input;
          if (meta.choix) {
            input = el("select");
            input.append(new Option("À préciser", ""));
            for (const [v, txt] of Object.entries(meta.choix))
              input.append(new Option(txt, v));
            input.value = val == null ? "" : String(val);
          } else {
            input = el("input");
            input.type = "text";
            input.inputMode = "decimal";
            input.autocomplete = "off";
            if (original != null)
              input.value = String(original).replace(".", ",");
            if (def !== undefined)
              input.placeholder = String(def) + " par défaut";
            else if (
              g === "charges_annuelles" &&
              actuel[g] &&
              !Object.keys(actuel[g]).length
            )
              input.value = "0";
            else input.placeholder = "À préciser";
          }
          input.id = id;
          input.name = key;
          cont.append(input);
          if (aides[key] || (meta.choix && def !== undefined)) {
            const aide = el("small", aides[key] || "Choix par défaut");
            aide.id = id + "-aide";
            input.setAttribute("aria-describedby", aide.id);
            cont.append(aide);
          }
          input.addEventListener("input", () => {
            try {
              const v = RentaChamps.valeur(key, input.value);
              (actuel[g] ||= {})[k] = v;
              input.setCustomValidity("");
              input.removeAttribute("aria-invalid");
              erreurs.textContent = "";
            } catch (e) {
              input.setCustomValidity(e.message);
              input.setAttribute("aria-invalid", "true");
            }
          });
          if (structurants.has(key))
            input.addEventListener("change", () => {
              if (input.validity.valid) dessiner(id);
            });
          grille.append(cont);
        }
        d.append(grille);
        form.append(d);
      }
      const opts = el("div", null, "form-options"),
        label = el("label"),
        ck = el("input");
      ck.type = "checkbox";
      ck.checked = Boolean(actuel.revente);
      ck.addEventListener("change", () => {
        if (ck.checked) {
          actuel.revente = {
            prix: null,
            frais: null,
            indemnite: null,
            impot: null,
          };
          ouvert.add("revente");
        } else delete actuel.revente;
        dessiner();
      });
      label.append(
        ck,
        document.createTextNode("Inclure une revente à la fin de l’étude"),
      );
      opts.append(label);
      form.append(opts);
      const nd = el("details", null, "form-set");
      nd.append(el("summary", "Notes et hypothèses"));
      const nb = el("div", null, "detail-body field"),
        nt = el("textarea");
      nt.setAttribute("aria-label", "Notes et hypothèses, une par ligne");
      nt.rows = 3;
      nt.value = (actuel.hypotheses || []).join("\n");
      nt.addEventListener("input", () => {
        actuel.hypotheses = nt.value
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean);
      });
      nb.append(nt);
      nd.append(nb);
      form.append(nd, erreurs);
      const buttons = el("div", null, "actions"),
        ok = el("button", "Calculer mon bilan", "btn primary");
      ok.type = "submit";
      buttons.append(
        ok,
        bouton("Continuer dans mon IA", () =>
          copier(textePourIA(actuel), "Projet et guide copiés."),
        ),
      );
      form.append(buttons);
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const mauvais = [...form.elements].find(
          (x) => x.validity && !x.validity.valid,
        );
        if (mauvais) {
          mauvais.closest("details").open = true;
          mauvais.focus();
          erreurs.textContent = mauvais.validationMessage;
          return;
        }
        const hash = RentaChamps.encode(actuel);
        if (location.hash === hash) router();
        else location.hash = hash;
      });
      zone.append(form);
      if (focus) document.getElementById(focus)?.focus({ preventScroll: true });
    }
    dessiner();
    zone.scrollIntoView({ block: "start" });
  }
  async function router() {
    const ticket = ++version,
      h = location.hash;
    if (!h || ["#", "#contenu", "#accueil"].includes(h)) {
      home.hidden = false;
      zone.hidden = true;
      zone.replaceChildren();
      document.title =
        "Ma Rentabilité — Étudier son projet locatif avec son IA";
      return;
    }
    home.hidden = true;
    zone.hidden = false;
    zone.removeAttribute("aria-busy");
    if (h === "#saisie") {
      ouvrirEdition(neuf());
      return;
    }
    try {
      let titre;
      if (h.startsWith("#exemple=")) {
        const k = h.slice(9);
        if (!Object.hasOwn(RentaContenus.exemples, k))
          throw new Error("Cet exemple est introuvable.");
        actuel = JSON.parse(JSON.stringify(RentaContenus.exemples[k]));
        titre = TITRES[k];
      } else {
        actuel = RentaChamps.decode(h);
        titre = "Votre bilan locatif";
      }
      const p = actuel;
      entete("Calcul du bilan…");
      zone.setAttribute("aria-busy", "true");
      const r = await RentaMoteur.calculer(p);
      if (ticket !== version) return;
      if (r.statut !== "calcule") {
        incomplet(p, r);
        return;
      }
      const [lecture, comparaison, variantes] = await Promise.all([
        RentaMoteur.entrees(p),
        !["avant_impot", "montant_connu"].includes(r.regime)
          ? RentaMoteur.comparer(p)
          : null,
        RentaMoteur.sensibilite(p),
      ]);
      if (ticket !== version) return;
      renderRapport(
        lecture.projet,
        r,
        titre,
        lecture.defauts,
        comparaison,
        variantes,
      );
    } catch (e) {
      if (ticket === version) {
        entete("Impossible d’ouvrir ce bilan", e.message);
        zone.append(
          lien("Commencer un projet", "#saisie", "btn"),
          document.createTextNode(" "),
          lien("Ouvrir le guide pour mon IA", "assistant.md", "btn"),
        );
      }
    } finally {
      if (ticket === version) {
        zone.removeAttribute("aria-busy");
        window.scrollTo(0, 0);
      }
    }
  }
  window.addEventListener("hashchange", router);
  router();
})();
