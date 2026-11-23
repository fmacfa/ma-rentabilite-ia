/* Une seule représentation alimente le bilan web, le PDF et le texte fourni à l’IA. */
(() => {
  "use strict";
  const fmt = new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const court = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 6 });
  const n = (v) => (v == null ? "Non calculé" : fmt.format(v));
  const eur = (v) => (v == null ? "Non calculé" : n(v) + " €");
  const pct = (v) => (v == null ? "Non calculé" : n(v) + " %");
  const tab = (titre, colonnes, lignes) => ({ titre, colonnes, lignes });
  const fiscPage =
    "https://fmacfa.github.io/ma-rentabilite-ia/docs/fiscalite.md";
  const etiquette = (k, p) => RentaChamps.descriptif(k, p)?.label || k;
  function entree(k, v, p) {
    if (v == null) return "À préciser";
    const f = RentaChamps.descriptif(k, p);
    if (!f) return String(v);
    return (
      f.choix?.[String(v)] ||
      (typeof v === "number" ? court.format(v) : String(v)) +
        (f.unite ? " " + f.unite : "")
    );
  }
  const fiscLabels = {
    base_imposable: "Base imposable",
    recettes_fiscales: "Recettes fiscales",
    charges_deduites_hors_emprunt: "Charges déduites hors emprunt",
    frais_emprunt: "Intérêts et assurance déduits",
    ir_estime: "Impôt sur le revenu",
    prelevements_sociaux: "Prélèvements sociaux",
    impot: "Impôt locatif retenu",
    is: "Impôt sur les sociétés",
    deduction_jeanbrun: "Déduction Jeanbrun",
    amortissement_deduit: "Amortissement déduit",
    amortissement_en_report: "Amortissements différés",
    deficits_en_report: "Déficits à reporter",
    deficit_imputable_global_hors_flux:
      "Déficit imputable sur le revenu global (hors trésorerie)",
    dividendes_bruts_hypothese: "Dividendes bruts",
    pfu_associe: "PFU de l’associé",
    dividendes_nets_associe: "Dividendes nets de l’associé",
  };
  function detailsImpots(p, r) {
    const f = p.fiscalite,
      a = r.annees[0],
      t = a.fiscalite,
      loc = p.location.type;
    const exp = [];
    if (f.regime === "avant_impot")
      return [
        "La simulation s’arrête au cash-flow avant impôt. L’impôt et la trésorerie après impôt restent à déterminer.",
      ];
    if (f.regime === "montant_connu") {
      exp.push(
        "L’impôt locatif de la première année est l’hypothèse saisie de " +
          eur(t.impot) +
          ".",
      );
      exp.push(
        f.evolution_impot_connu === "proportionnel_net"
          ? "Ensuite, impôt annuel = impôt initial × maximum de 0 et du rapport entre le net d’exploitation de l’année et celui d’une année de référence."
          : "Le même montant annuel est retenu pendant la projection.",
      );
      return exp;
    }
    const brut =
      a.recettes_hc_et_annexes +
      (loc === "nue" ? 0 : a.charges_recuperees_a_prix_coutant);
    if (f.regime === "micro_foncier") {
      exp.push(
        "Recettes foncières brutes du foyer = " +
          eur(brut) +
          " + " +
          eur(f.autres_recettes) +
          " hors projet. Seuil de référence : 15 000 €.",
      );
      exp.push(
        "Base imposable du projet = " +
          eur(brut) +
          " × 70 % = " +
          eur(t.base_imposable) +
          ".",
      );
    } else if (f.regime === "micro_bic") {
      const nonClasse = loc === "tourisme_non_classe",
        taux = nonClasse ? 30 : 50;
      const autres = f.autres_recettes,
        total = brut + autres,
        base = (x) => Math.max(0, x - Math.max(305, (x * taux) / 100));
      exp.push(
        "Recettes BIC du projet = loyers et annexes " +
          eur(a.recettes_hc_et_annexes) +
          " + charges récupérées " +
          eur(a.charges_recuperees_a_prix_coutant) +
          " = " +
          eur(brut) +
          ".",
      );
      exp.push(
        "Seuil de référence " +
          eur(nonClasse ? 15000 : 83600) +
          ", apprécié sur N−1 (" +
          eur(f.recettes_n1) +
          ") ou N−2 (" +
          eur(f.recettes_n2) +
          "). Abattement de " +
          taux +
          " %, minimum de 305 € pour l’activité.",
      );
      exp.push(
        "Base supplémentaire = base de l’activité avec le projet " +
          eur(base(total)) +
          " − base hors projet " +
          eur(base(autres)) +
          " = " +
          eur(t.base_imposable) +
          ".",
      );
    } else {
      const net =
        t.recettes_fiscales - t.charges_deduites_hors_emprunt - t.frais_emprunt;
      exp.push(
        "Résultat avant amortissements et reports = " +
          eur(t.recettes_fiscales) +
          " de recettes − " +
          eur(t.charges_deduites_hors_emprunt) +
          " de charges déductibles hors emprunt − " +
          eur(t.frais_emprunt) +
          " de frais d’emprunt = " +
          eur(net) +
          ".",
      );
      if (f.regime === "lmnp_reel" || f.regime === "sci_is")
        exp.push(
          "Dotation prévue " +
            eur(f.amortissement_annuel) +
            ", dans la limite d’une assiette restant à amortir de " +
            eur(f.base_amortissable) +
            ". Amortissement admis en année 1 : " +
            eur(t.amortissement_deduit) +
            ".",
        );
      if (f.regime === "lmnp_reel")
        exp.push(
          "Au LMNP réel, la dotation admise est limitée au résultat positif disponible avant amortissement. Les déficits d’exploitation et les amortissements différés sont suivis séparément.",
        );
      if (f.regime === "jeanbrun") {
        const taux = {
          neuf: { intermediaire: 3.5, social: 4.5, tres_social: 5.5 },
          ancien: { intermediaire: 3, social: 3.5, tres_social: 4 },
        }[f.type_jeanbrun][f.niveau_jeanbrun];
        exp.push(
          "Déduction = " +
            eur(f.base_jeanbrun) +
            " × " +
            pct(taux) +
            " × " +
            f.mois_jeanbrun_an1 +
            "/12, limitée au plafond disponible de " +
            eur(f.plafond_jeanbrun) +
            " et à l’assiette restante. Montant retenu : " +
            eur(t.deduction_jeanbrun) +
            ".",
        );
      }
      if (f.regime === "foncier_reel" || f.regime === "jeanbrun")
        exp.push(
          "Sur un déficit, la part hors frais d’emprunt imputable sur le revenu global est isolée dans la limite ordinaire de 10 700 €. Le gain éventuel sur le revenu global reste hors trésorerie. Les reports fonciers sont suivis dix ans.",
        );
      if (f.regime === "sci_is") {
        const reduit = f.taux_reduit_is ? Math.min(t.base_imposable, 42500) : 0;
        exp.push(
          "IS = " +
            eur(reduit) +
            " × 15 % + " +
            eur(t.base_imposable - reduit) +
            " × 25 % = " +
            eur(t.is) +
            ".",
        );
        exp.push(
          "Au niveau des associés, PFU = " +
            eur(t.dividendes_bruts_hypothese) +
            " × 31,4 % = " +
            eur(t.pfu_associe) +
            ". Dividendes nets : " +
            eur(t.dividendes_nets_associe) +
            ".",
        );
      }
    }
    if (f.regime !== "sci_is") {
      exp.push(
        f.mode_ir === "bareme_indicatif"
          ? "IR marginal estimé = impôt brut au barème sur " +
              eur(f.revenu_hors_location + t.base_imposable) +
              " − impôt brut sur " +
              eur(f.revenu_hors_location) +
              ", pour " +
              court.format(f.parts) +
              " part(s) = " +
              eur(t.ir_estime) +
              ". Le barème indicatif publié en 2026 porte sur les revenus 2025."
          : "IR estimé = " +
              eur(t.base_imposable) +
              " × tranche marginale " +
              pct(f.tmi_pct) +
              " = " +
              eur(t.ir_estime) +
              ".",
      );
      exp.push(
        "Prélèvements sociaux = " +
          eur(t.base_imposable) +
          " × " +
          pct(loc === "nue" ? 17.2 : 18.6) +
          " = " +
          eur(t.prelevements_sociaux) +
          ". Total estimé = " +
          eur(t.ir_estime) +
          " + " +
          eur(t.prelevements_sociaux) +
          " = " +
          eur(t.impot) +
          ".",
      );
    }
    return exp;
  }
  function construire(
    p,
    r,
    defauts = {},
    comparaison = null,
    nom = "Votre bilan locatif",
    variantes = null,
  ) {
    const c = p.credit,
      l = p.location,
      a = p.achat,
      f = p.fiscalite,
      pr = p.projection,
      prem = r.annees[0],
      dernier = r.annees.at(-1);
    const cash = prem.cash_flow_mensuel_retenu,
      impot = prem.fiscalite.impot;
    const rapport = {
      titre: nom,
      sousTitre:
        RentaChamps.locations[l.type] +
        " · " +
        RentaChamps.regimes[r.regime] +
        " · Projection sur " +
        pr.annees +
        " an" +
        (pr.annees > 1 ? "s" : ""),
      indicateurs: [
        {
          label:
            cash < 0
              ? "Effort d’épargne mensuel · an 1"
              : "Trésorerie mensuelle · an 1",
          valeur: eur(Math.abs(cash)),
        },
        {
          label: "Rendement net d’exploitation",
          valeur: pct(r.rendement_net_exploitation_pct),
        },
        {
          label: "Fonds propres initiaux",
          valeur: eur(r.fonds_propres_initiaux),
        },
      ],
      sections: [],
    };
    const ajouter = (titre, paragraphes = [], tables = []) =>
      rapport.sections.push({ titre, paragraphes, tables });
    const couts = [
      ["Prix d’achat", eur(a.prix)],
      ["Agence à ajouter", eur(a.agence_en_plus)],
      ["Frais d’acte", eur(r.frais_acte)],
      ["Travaux", eur(a.travaux)],
      ["Mobilier", eur(a.mobilier)],
      ["Autres frais", eur(a.autres)],
      ["Coût d’acquisition", eur(r.cout_acquisition)],
    ];
    const surPrix = [
      "Coût d’acquisition = " +
        [
          a.prix,
          a.agence_en_plus,
          r.frais_acte,
          a.travaux,
          a.mobilier,
          a.autres,
        ]
          .map(eur)
          .join(" + ") +
        " = " +
        eur(r.cout_acquisition) +
        ".",
    ];
    if (a.mode_acte !== "montant") {
      if (a.mode_acte === "neuf_estime" || a.taux_departement_pct == null)
        surPrix.push(
          "Provision pour frais d’acte = " +
            eur(a.prix) +
            " × " +
            (a.mode_acte === "neuf_estime" ? "2,5 %" : "7,5 %") +
            " = " +
            eur(r.frais_acte) +
            ".",
        );
      else {
        const parts = [
          [0, 6500, 0.0387],
          [6500, 17000, 0.01596],
          [17000, 60000, 0.01064],
          [60000, Infinity, 0.00799],
        ];
        const emol = parts.reduce(
          (t, [bas, haut, taux]) =>
            t + Math.max(0, Math.min(a.prix, haut) - bas) * taux,
          0,
        );
        const taxes =
          a.prix * ((a.taux_departement_pct / 100) * 1.0237 + 0.013);
        surPrix.push(
          "Estimation dans l’ancien : taxes = prix × (taux départemental × 1,0237 + 1,20 % + 0,10 %) = " +
            eur(taxes) +
            ". Émoluments par tranches HT " +
            eur(emol) +
            " × 1,20, plus 900 € de débours. Total " +
            eur(r.frais_acte) +
            ".",
        );
      }
    }
    surPrix.push(
      "Coût initial avec frais bancaires = " +
        eur(r.cout_acquisition) +
        " + " +
        eur(c.garantie) +
        " de garantie + " +
        eur(c.dossier) +
        " de dossier = " +
        eur(r.cout_initial_total) +
        ".",
    );
    surPrix.push(
      "Fonds propres à engager = " +
        eur(r.cout_initial_total) +
        " − " +
        eur(r.capital_emprunte) +
        " d’emprunt = " +
        eur(r.fonds_propres_initiaux) +
        ".",
    );
    ajouter("Achat et apport", surPrix, [
      tab("Dépenses initiales", ["Poste", "Montant"], couts),
    ]);
    const longue = ["nue", "meublee_longue"].includes(l.type),
      plein = longue ? l.loyer_mensuel_hc * 12 : l.prix_nuit * 365;
    const loyers =
      plein * (longue ? 1 - l.vacance_pct / 100 : l.occupation_pct / 100);
    const charges = Object.values(p.charges_annuelles).reduce(
        (a, b) => a + b,
        0,
      ),
      gestion = (loyers * l.gestion_pct) / 100,
      net = r.recettes_reference - charges - gestion;
    const recettes = [
      longue
        ? "Loyer théorique annuel = " +
          eur(l.loyer_mensuel_hc) +
          " × 12 = " +
          eur(plein) +
          ". Loyers après vacance = " +
          eur(plein) +
          " × (1 − " +
          pct(l.vacance_pct) +
          ") = " +
          eur(loyers) +
          "."
        : "Recettes d’hébergement = " +
          eur(l.prix_nuit) +
          " × 365 nuits × " +
          pct(l.occupation_pct) +
          " = " +
          eur(loyers) +
          ".",
      "Recettes annuelles stabilisées = " +
        eur(loyers) +
        " + 12 × " +
        eur(l.annexes_mensuelles) +
        " d’annexes = " +
        eur(r.recettes_reference) +
        ".",
      "Première année : " +
        prem.mois_ouverts +
        " mois d’ouverture. Recettes = " +
        eur(r.recettes_reference) +
        " × " +
        prem.mois_ouverts +
        "/12 = " +
        eur(prem.recettes_hc_et_annexes) +
        ".",
      "Gestion stabilisée = " +
        eur(loyers) +
        " × " +
        pct(l.gestion_pct) +
        " = " +
        eur(gestion) +
        ". Net annuel stabilisé = " +
        eur(r.recettes_reference) +
        " − " +
        eur(charges) +
        " − " +
        eur(gestion) +
        " = " +
        eur(net) +
        ".",
      "Rendement brut théorique = " +
        eur(plein + l.annexes_mensuelles * 12) +
        " / " +
        eur(r.cout_acquisition) +
        " × 100 = " +
        pct(r.rendement_brut_theorique_pct) +
        ". Après vacance : " +
        eur(r.recettes_reference) +
        " / " +
        eur(r.cout_acquisition) +
        " × 100 = " +
        pct(r.rendement_brut_effectif_pct) +
        ".",
      "Rendement net d’exploitation = " +
        eur(net) +
        " / " +
        eur(r.cout_acquisition) +
        " × 100 = " +
        pct(r.rendement_net_exploitation_pct) +
        ".",
    ];
    if (l.charges_refacturees_annuelles)
      recettes.push(
        "Les charges payées puis récupérées à prix coûtant s’équilibrent en trésorerie. Montant en année 1 : " +
          eur(prem.charges_recuperees_a_prix_coutant) +
          ".",
      );
    ajouter("Loyers, charges et rendements", recettes, [
      tab(
        "Charges annuelles du propriétaire",
        ["Poste", "Montant"],
        [
          ...Object.entries(p.charges_annuelles).map(([k, v]) => [
            etiquette("charges_annuelles." + k, p),
            eur(v),
          ]),
          ["Total", eur(charges)],
        ],
      ),
    ]);
    const financement = [];
    if (c.capital) {
      const i = c.taux_pct / 1200,
        D = c.differe_mois || 0,
        N = c.duree_mois - D,
        K =
          c.type_differe === "capitalise"
            ? c.capital * (1 + i) ** D
            : c.capital;
      const m = r.echeancier[D];
      financement.push(
        "Taux mensuel i = " +
          pct(c.taux_pct) +
          " / 12 = " +
          court.format(i * 100) +
          " %. Durée totale " +
          c.duree_mois +
          " mois, dont " +
          D +
          " de différé. Nombre de mensualités amortissables : " +
          N +
          ".",
      );
      if (D)
        financement.push(
          c.type_differe === "capitalise"
            ? "Pendant le différé, les intérêts augmentent le capital : " +
                eur(c.capital) +
                " × (1 + i)^" +
                D +
                " = " +
                eur(K) +
                "."
            : "Pendant le différé, les intérêts sont payés et le capital reste égal à " +
                eur(K) +
                ".",
        );
      financement.push(
        i
          ? "Mensualité hors assurance = " +
              eur(K) +
              " × i / [1 − (1 + i)^(−" +
              N +
              ")] = " +
              eur(m.echeance - m.assurance) +
              "."
          : "À taux nul, mensualité hors assurance = " +
              eur(K) +
              " / " +
              N +
              " = " +
              eur(m.echeance - m.assurance) +
              ".",
      );
      financement.push(
        "Au mois " +
          m.mois +
          ", le versement se décompose en " +
          eur(m.interets_payes) +
          " d’intérêts + " +
          eur(m.capital_rembourse) +
          " de capital + " +
          eur(m.assurance) +
          " d’assurance = " +
          eur(m.echeance) +
          ". Le capital restant dû après ce versement est de " +
          eur(m.capital_restant_du) +
          ".",
      );
      financement.push(
        (c.mode_assurance === "montant_annuel"
          ? "Assurance mensuelle = " + eur(c.assurance) + " / 12"
          : c.mode_assurance === "capital_initial"
            ? "Assurance mensuelle = capital initial × " +
              pct(c.assurance) +
              " / 12"
            : "Assurance de chaque mois = capital restant dû en début de mois × " +
              pct(c.assurance) +
              " / 12") +
          ". Première échéance après différé, assurance comprise : " +
          eur(r.mensualite_apres_differe_assurance_comprise) +
          ".",
      );
      financement.push(
        "Coût à terme du crédit, hors indemnité de sortie = intérêts courus " +
          eur(r.echeancier.reduce((s, m) => s + m.interets_courus, 0)) +
          " + assurance " +
          eur(r.echeancier.reduce((s, m) => s + m.assurance, 0)) +
          " + frais bancaires " +
          eur(r.frais_bancaires) +
          " = " +
          eur(r.cout_credit_a_terme_hors_ira) +
          ".",
      );
    } else
      financement.push(
        "L’acquisition est financée sans emprunt. Service de la dette : 0,00 €.",
      );
    ajouter("Financement", financement);
    const impTables = [];
    if (!["avant_impot", "montant_connu"].includes(r.regime)) {
      const cles = Object.keys(prem.fiscalite).filter((k) => k in fiscLabels);
      for (let i = 0; i < cles.length; i += 3) {
        const bloc = cles.slice(i, i + 3);
        impTables.push(
          tab(
            i === 0 ? "Détail fiscal par année" : "Suite du détail fiscal",
            ["An", ...bloc.map((k) => fiscLabels[k])],
            r.annees.map((x) => [
              String(x.annee),
              ...bloc.map((k) => eur(x.fiscalite[k])),
            ]),
          ),
        );
      }
    }
    ajouter("Fiscalité du projet", detailsImpots(p, r), impTables);
    if (comparaison?.scenarios) {
      const lignes = Object.entries(comparaison.scenarios).map(([k, v]) =>
        v.statut === "calcule"
          ? [
              RentaChamps.regimes[k],
              eur(v.base_imposable_an1),
              eur(v.impot_an1),
              eur(v.cash_flow_mensuel_retenu),
            ]
          : [
              RentaChamps.regimes[k],
              "À vérifier",
              "—",
              v.motif ||
                Object.values({ ...v.erreurs, ...v.questions }).join(" "),
            ],
      );
      ajouter(
        "Comparaison fiscale en première année",
        [
          "Le bien, le financement et le mode de location sont identiques dans chaque scénario.",
        ],
        [
          tab(
            "Régimes étudiés",
            ["Régime", "Base", "Impôt", "Trésorerie / mois ou condition"],
            lignes,
          ),
        ],
      );
    }
    const cf = prem.cash_flow_apres_impot ?? prem.cash_flow_avant_impot;
    const exploitation = [
      "Année 1 : " +
        eur(prem.recettes_hc_et_annexes) +
        " − " +
        eur(prem.gestion) +
        " de gestion − " +
        eur(prem.charges_proprietaire) +
        " de charges = " +
        eur(prem.net_exploitation) +
        " de net d’exploitation.",
      "Trésorerie avant impôt = " +
        eur(prem.net_exploitation) +
        " − " +
        eur(prem.dette_assurance_comprise) +
        " de dette assurée = " +
        eur(prem.cash_flow_avant_impot) +
        ".",
      ...(impot == null
        ? []
        : [
            "Trésorerie après impôt = " +
              eur(prem.cash_flow_avant_impot) +
              " − " +
              eur(impot) +
              " = " +
              eur(cf) +
              ".",
            "Rendement après impôt, hors financement = (" +
              eur(prem.net_exploitation) +
              " − " +
              eur(impot) +
              ") / " +
              eur(r.cout_acquisition) +
              " × 100 = " +
              pct(r.rendement_apres_impot_an1_pct) +
              ".",
          ]),
      "Trésorerie mensuelle moyenne = " +
        eur(cf) +
        " / 12 = " +
        eur(cash) +
        " (" +
        r.flux_retenus +
        ").",
      r.fonds_propres_initiaux
        ? "Cash-on-cash = " +
          eur(cf) +
          " / " +
          eur(r.fonds_propres_initiaux) +
          " × 100 = " +
          pct(r.cash_on_cash_an1_pct) +
          "."
        : "Cash-on-cash indéfini avec zéro fonds propres initiaux.",
      prem.dette_assurance_comprise
        ? "Couverture de la dette (DSCR) = " +
          eur(prem.net_exploitation) +
          " / " +
          eur(prem.dette_assurance_comprise) +
          " = " +
          n(r.dscr_an1) +
          " fois."
        : "Couverture de la dette sans objet pour un achat comptant.",
      prem.mois_ouverts
        ? "Recettes mensuelles au point mort = (" +
          [
            prem.charges_proprietaire,
            prem.gestion,
            ...(impot == null ? [] : [impot]),
            prem.dette_assurance_comprise,
          ]
            .map(eur)
            .join(" + ") +
          ") / " +
          prem.mois_ouverts +
          " mois ouverts = " +
          eur(r.recettes_mensuelles_point_mort_an1) +
          "."
        : "Aucun mois ouvert en année 1 pour calculer le point mort mensuel.",
    ];
    ajouter("Trésorerie de la première année", exploitation);
    const anTab = (titre, colonnes, keys) =>
      tab(
        titre,
        ["An", ...colonnes],
        r.annees.map((x) => [
          String(x.annee),
          ...keys.map((k) =>
            k === "mois_ouverts"
              ? String(x[k])
              : k === "impot"
                ? eur(x.fiscalite.impot)
                : eur(x[k]),
          ),
        ]),
      );
    const annuels = [
      anTab(
        "Exploitation",
        [
          "Mois ouverts",
          "Recettes HC et annexes",
          "Gestion",
          "Charges",
          "Net d’exploitation",
        ],
        [
          "mois_ouverts",
          "recettes_hc_et_annexes",
          "gestion",
          "charges_proprietaire",
          "net_exploitation",
        ],
      ),
      anTab(
        "Crédit et trésorerie",
        [
          "Dette assurée",
          "Impôt locatif",
          "Avant impôt",
          "Après impôt",
          "Moyenne / mois",
        ],
        [
          "dette_assurance_comprise",
          "impot",
          "cash_flow_avant_impot",
          "cash_flow_apres_impot",
          "cash_flow_mensuel_retenu",
        ],
      ),
    ];
    if (c.capital)
      annuels.push(
        anTab(
          "Financement par année",
          [
            "Échéances versées",
            "Intérêts payés",
            "Assurance",
            "Capital restant dû",
          ],
          [
            "dette_assurance_comprise",
            "interets_payes",
            "assurance",
            "capital_restant_du",
          ],
        ),
      );
    if (l.charges_refacturees_annuelles)
      annuels.push(
        anTab(
          "Charges récupérées à prix coûtant",
          ["Montant récupéré et dépensé"],
          ["charges_recuperees_a_prix_coutant"],
        ),
      );
    if (r.regime === "sci_is")
      annuels.push(
        anTab(
          "Société après distribution",
          ["Trésorerie après dividendes"],
          ["tresorerie_societe_apres_distribution"],
        ),
      );
    ajouter(
      "Projection annuelle",
      [
        "Loyers et annexes : montant de référence × (1 + " +
          pct(pr.index_loyers_pct) +
          ")^(année − 1) × mois ouverts / 12. Charges : montant annuel × (1 + " +
          pct(pr.index_charges_pct) +
          ")^(année − 1).",
        "Trésorerie cumulée hors vente sur " +
          pr.annees +
          " an(s) : " +
          eur(r.cash_flow_cumule_hors_vente) +
          ". Les échéances s’arrêtent au terme du prêt. Capital restant dû à l’horizon : " +
          eur(dernier.capital_restant_du) +
          ".",
      ],
      annuels,
    );
    if (r.revente) {
      const v = r.revente,
        rv = p.revente,
        b = r.bilan_avec_revente,
        an = pr.annees;
      const txt = [];
      if (rv.mode_indemnite === "plafond")
        txt.push(
          "Indemnité estimée = minimum de 3 % du capital restant et de six mois d’intérêts sur ce capital = " +
            eur(v.indemnite) +
            ".",
        );
      if (rv.mode_impot === "particulier") {
        txt.push(
          "Plus-value brute = maximum de zéro et de (" +
            eur(v.prix) +
            " − " +
            eur(rv.frais_cession_deductibles) +
            " − " +
            eur(rv.base_acquisition_fiscale) +
            " + " +
            eur(rv.amortissements_a_reintegrer) +
            ") = " +
            eur(v.plus_value_brute) +
            ".",
        );
        txt.push(
          "Après " +
            an +
            " an(s) de détention, impôt de cession = " +
            eur(v.base_ir) +
            " × 19 % + " +
            eur(v.base_ps) +
            " × 17,2 % + " +
            eur(v.surtaxe) +
            " de surtaxe = " +
            eur(v.impot_cession) +
            ".",
        );
      } else
        txt.push(
          "L’impôt de cession de " +
            eur(v.impot_cession) +
            " est un montant fourni pour ce scénario.",
        );
      txt.push(
        "Produit de vente = prix " +
          eur(v.prix) +
          " − frais " +
          eur(v.frais) +
          " − dette " +
          eur(v.dette_remboursee) +
          " − indemnité " +
          eur(v.indemnite) +
          " − impôt " +
          eur(v.impot_cession) +
          " = " +
          eur(v.produit_net) +
          ".",
      );
      txt.push(
        "VAN = somme des flux divisés par (1 + " +
          pct(pr.actualisation_pct) +
          ")^année = " +
          eur(b.van) +
          ". Le flux initial est l’opposé des fonds propres et le dernier intègre la vente.",
      );
      txt.push(
        b.tri_pct == null
          ? "TRI non défini sur cette série de flux."
          : "TRI = taux annuel qui annule la VAN de ces flux = " +
              pct(b.tri_pct) +
              ".",
      );
      txt.push(
        "TRI modifié : les entrées sont capitalisées à 4 % et les sorties actualisées à 4 %. Le rapport des deux montants est élevé à la puissance 1 / " +
          an +
          ", puis diminué de 1. Résultat : " +
          pct(b.tri_modifie_pct) +
          ".",
      );
      txt.push(
        "Contributions cumulées = " +
          eur(b.contributions) +
          ". Distributions cumulées = " +
          eur(b.distributions) +
          ". ROI = (distributions − contributions) / contributions = " +
          pct(b.roi_pct) +
          ". MOIC = distributions / contributions = " +
          n(b.moic) +
          ".",
      );
      ajouter("Revente et rendement sur la durée", txt, [
        tab(
          "Flux retenus pour la VAN et le TRI",
          ["Année", "Flux net", "Valeur actualisée"],
          b.flux_annuels.map((x, i) => [
            String(i),
            eur(x),
            eur(x / (1 + pr.actualisation_pct / 100) ** i),
          ]),
        ),
      ]);
    }
    if (variantes?.scenarios) {
      const lignes = Object.entries(variantes.scenarios).map(
        ([nomVariante, v]) => {
          if (v.statut !== "calcule")
            return [
              nomVariante,
              "—",
              "—",
              "—",
              v.motif ||
                Object.values({ ...v.erreurs, ...v.questions }).join(" "),
            ];
          return [
            nomVariante === "Central" ? "Votre scénario" : nomVariante,
            eur(v.fonds_propres_initiaux),
            pct(v.rendement_net_pct),
            eur(v.cash_flow_mensuel_retenu),
            eur(v.cash_flow_mensuel_retenu - cash),
          ];
        },
      );
      const pret =
        c.apport_hors_frais_bancaires != null
          ? "L’apport hors frais bancaires reste fixe, le capital à emprunter est recalculé."
          : "Le montant emprunté reste fixe.";
      ajouter(
        "Si le prix ou le loyer change",
        [
          "Chaque variante modifie un seul montant. Une baisse de 10 % multiplie le prix ou le loyer par 0,90. Une baisse de 20 % le multiplie par 0,80. " +
            pret,
          "La dernière colonne mesure l’écart de trésorerie mensuelle par rapport à votre scénario en première année. Pour une location touristique, la baisse porte sur le prix par nuit.",
        ],
        [
          tab(
            "Comparaison des hypothèses",
            [
              "Variante",
              "Fonds propres",
              "Rendement net",
              "Trésorerie / mois",
              "Écart / mois ou condition",
            ],
            lignes,
          ),
        ],
      );
    }
    const tous = [];
    for (const [g, label] of Object.entries(RentaChamps.groupes))
      for (const [k, v] of Object.entries(p[g] || {})) {
        const key = g + "." + k;
        tous.push([
          label,
          etiquette(key, p),
          entree(key, v, p),
          Object.hasOwn(defauts, key) ? "Convention par défaut" : "Dossier",
        ]);
      }
    ajouter(
      "Données et hypothèses",
      p.hypotheses?.length
        ? p.hypotheses
        : ["Aucune note supplémentaire saisie."],
      [
        tab(
          "Valeurs utilisées",
          ["Rubrique", "Donnée", "Valeur", "Origine"],
          tous,
        ),
      ],
    );
    if (r.echeancier.length)
      ajouter(
        "Échéancier mensuel du prêt",
        [
          "Intérêts courus = solde d’ouverture × taux mensuel. Le paiement additionne les intérêts payés, le capital remboursé et l’assurance. Montants en euros.",
        ],
        [
          tab(
            "Toutes les mensualités",
            [
              "Mois",
              "Int. courus",
              "Int. payés",
              "Capital payé",
              "Assurance",
              "Échéance",
              "Capital restant",
            ],
            r.echeancier.map((m) => [
              String(m.mois),
              n(m.interets_courus),
              n(m.interets_payes),
              n(m.capital_rembourse),
              n(m.assurance),
              n(m.echeance),
              n(m.capital_restant_du),
            ]),
          ),
        ],
      );
    const sources = [
      "Les calculs utilisent les montants non arrondis. Les montants affichés sont arrondis au centime.",
      "Formules et exemples : https://fmacfa.github.io/ma-rentabilite-ia/calculs.html",
    ];
    if (r.annee_regles)
      sources.push(
        "Règles de référence sur les revenus " +
          r.annee_regles +
          ", vérifiées le 23 novembre 2026 et maintenues constantes dans la projection. Sources officielles et périmètre : " +
          fiscPage,
      );
    ajouter("Conventions et références", sources);
    return rapport;
  }
  function texte(r) {
    const lignes = [
      r.titre,
      r.sousTitre,
      "",
      ...r.indicateurs.map((i) => i.label + " : " + i.valeur),
    ];
    for (const s of r.sections) {
      lignes.push("", "## " + s.titre, ...s.paragraphes);
      for (const t of s.tables)
        lignes.push(
          "",
          t.titre,
          t.colonnes.join(" | "),
          ...t.lignes.map((l) => l.join(" | ")),
        );
    }
    return lignes.join("\n");
  }
  window.RentaRapport = { construire, texte, eur, pct, n, entree };
})();
