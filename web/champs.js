/* Libellés partagés par le formulaire, les liens de reprise et le bilan. */
(() => {
  "use strict";
  const groupes = {
    achat: "Achat",
    credit: "Financement",
    location: "Location",
    charges_annuelles: "Charges annuelles",
    fiscalite: "Fiscalité",
    projection: "Projection",
    revente: "Revente",
  };
  const regimes = {
    avant_impot: "Avant impôt",
    montant_connu: "Impôt estimé par vos soins",
    micro_foncier: "Micro-foncier",
    foncier_reel: "Réel foncier",
    micro_bic: "Micro-BIC",
    lmnp_reel: "LMNP au réel",
    sci_is: "SCI à l’IS",
    jeanbrun: "Dispositif Jeanbrun",
  };
  const locations = {
    nue: "Location nue",
    meublee_longue: "Meublé de longue durée",
    tourisme_classe: "Meublé de tourisme classé",
    tourisme_non_classe: "Meublé de tourisme non classé",
  };
  const ouiNon = { true: "Oui", false: "Non" };
  const table = {};
  function champ(g, cle, label, unite = "", choix = null) {
    table[g + "." + cle] = { label, unite, choix };
  }
  function euros(g, champs) {
    for (const [k, v] of Object.entries(champs)) champ(g, k, v, "€");
  }
  euros("achat", {
    prix: "Prix d’achat",
    frais_acte: "Frais d’acte",
    agence_en_plus: "Frais d’agence à ajouter",
    travaux: "Travaux initiaux",
    mobilier: "Mobilier",
    autres: "Autres frais d’acquisition",
  });
  champ("achat", "mode_acte", "Évaluation des frais d’acte", "", {
    montant: "Montant connu",
    ancien_estime: "Estimation dans l’ancien",
    neuf_estime: "Estimation dans le neuf",
  });
  champ("achat", "taux_departement_pct", "Taux départemental vérifié", "%");
  euros("credit", {
    capital: "Montant emprunté",
    apport_hors_frais_bancaires: "Apport hors frais bancaires",
    garantie: "Garantie du prêt",
    dossier: "Frais de dossier",
  });
  champ("credit", "taux_pct", "Taux annuel du prêt", "%");
  champ("credit", "duree_mois", "Durée du prêt, différé inclus", "mois");
  champ("credit", "differe_mois", "Durée du différé", "mois");
  champ("credit", "type_differe", "Type de différé", "", {
    interets_seuls: "Intérêts payés",
    capitalise: "Intérêts capitalisés",
  });
  champ("credit", "mode_assurance", "Mode de calcul de l’assurance", "", {
    montant_annuel: "Montant annuel en euros",
    capital_initial: "Taux sur capital initial",
    capital_restant_du: "Taux sur capital restant dû",
  });
  champ("credit", "assurance", "Assurance emprunteur");
  champ("location", "type", "Type de location", "", locations);
  euros("location", {
    loyer_mensuel_hc: "Loyer mensuel hors charges",
    prix_nuit: "Prix par nuit",
    annexes_mensuelles: "Revenus annexes par mois",
    charges_refacturees_annuelles: "Charges récupérées par an",
  });
  champ("location", "occupation_pct", "Nuits occupées", "%");
  champ("location", "vacance_pct", "Vacance et impayés", "%");
  champ("location", "gestion_pct", "Honoraires de gestion sur les loyers", "%");
  champ("location", "delai_mois", "Délai avant le premier loyer", "mois");
  champ("projection", "annees", "Durée de l’étude", "ans");
  champ("projection", "index_loyers_pct", "Évolution annuelle des loyers", "%");
  champ(
    "projection",
    "index_charges_pct",
    "Évolution annuelle des charges",
    "%",
  );
  champ("projection", "actualisation_pct", "Taux d’actualisation", "%");
  champ("fiscalite", "regime", "Régime étudié", "", regimes);
  champ("fiscalite", "annee_reference", "Année des revenus");
  champ("fiscalite", "detention", "Détention", "", {
    direct: "En direct",
    sci_ir: "SCI à l’IR",
    sci_is: "SCI à l’IS",
  });
  champ(
    "fiscalite",
    "conditions_confirmees",
    "Conditions fiscales et sociales vérifiées",
    "",
    ouiNon,
  );
  champ(
    "fiscalite",
    "micro_compatible",
    "Conditions du micro vérifiées hors seuil",
    "",
    ouiNon,
  );
  champ("fiscalite", "mode_ir", "Estimation de l’impôt sur le revenu", "", {
    tmi: "Tranche marginale",
    bareme_indicatif: "Barème indicatif",
  });
  champ("fiscalite", "tmi_pct", "Tranche marginale", "%", {
    0: "0 %",
    11: "11 %",
    30: "30 %",
    41: "41 %",
    45: "45 %",
  });
  champ("fiscalite", "parts", "Nombre de parts fiscales");
  champ(
    "fiscalite",
    "evolution_impot_connu",
    "Évolution de l’impôt estimé",
    "",
    {
      constant: "Montant constant",
      proportionnel_net: "Proportionnel au net d’exploitation",
    },
  );
  euros("fiscalite", {
    revenu_hors_location: "Revenu imposable hors projet",
    impot_annuel: "Impôt locatif annuel estimé",
    charges_deductibles_annuelles: "Charges annuelles fiscalement déductibles",
    deductions_annee_1: "Déductions supplémentaires en première année",
    autres_recettes: "Autres recettes annuelles de même catégorie",
    recettes_n1: "Recettes de l’activité en N−1",
    recettes_n2: "Recettes de l’activité en N−2",
    revenus_comparaison_lmp: "Revenus du foyer à comparer au seuil LMP",
    amortissement_annuel: "Dotation annuelle aux amortissements",
    base_amortissable: "Valeur restant à amortir hors terrain",
    dividendes_bruts_annuels: "Dividendes annuels prévus",
    base_jeanbrun: "Assiette Jeanbrun hors foncier",
    plafond_jeanbrun: "Plafond Jeanbrun disponible dans le foyer",
  });
  champ(
    "fiscalite",
    "taux_reduit_is",
    "Conditions du taux réduit d’IS réunies",
    "",
    ouiNon,
  );
  champ("fiscalite", "type_jeanbrun", "Bien éligible au dispositif", "", {
    neuf: "Neuf",
    ancien: "Ancien réhabilité",
  });
  champ("fiscalite", "niveau_jeanbrun", "Niveau de location", "", {
    intermediaire: "Intermédiaire",
    social: "Social",
    tres_social: "Très social",
  });
  champ(
    "fiscalite",
    "mois_jeanbrun_an1",
    "Mois éligibles en première année",
    "mois",
  );
  euros("revente", {
    prix: "Prix de revente",
    frais: "Frais à la charge du vendeur",
    indemnite: "Indemnité de remboursement",
    impot: "Impôt de cession",
    base_acquisition_fiscale: "Prix d’acquisition fiscal majoré",
    frais_cession_deductibles: "Frais de cession fiscalement admis",
    amortissements_a_reintegrer: "Amortissements à réintégrer",
  });
  champ("revente", "mode_indemnite", "Indemnité de remboursement", "", {
    montant: "Montant prévu au contrat",
    plafond: "Plafond indicatif",
  });
  champ("revente", "mode_impot", "Calcul de l’impôt de cession", "", {
    montant: "Montant estimé",
    particulier: "Plus-value du particulier",
  });
  champ(
    "revente",
    "cas_particulier_confirme",
    "Régime ordinaire du cédant unique confirmé",
    "",
    ouiNon,
  );
  const labelsCharges = {
    total: "Charges à votre charge",
    taxe_fonciere_nette: "Taxe foncière nette",
    taxe_fonciere_hors_teom: "Taxe foncière hors TEOM",
    assurance_pno: "Assurance propriétaire non occupant",
  };
  const interdit = new Set(["__proto__", "prototype", "constructor"]);
  const propre = (o, k) => Object.prototype.hasOwnProperty.call(o, k);
  function descriptif(key, projet = {}) {
    if (key.startsWith("charges_annuelles.")) {
      const nom = key.slice("charges_annuelles.".length);
      if (!nom || interdit.has(nom)) return null;
      return {
        label: Object.hasOwn(labelsCharges, nom)
          ? labelsCharges[nom]
          : nom.replaceAll("_", " ").replace(/^./, (c) => c.toUpperCase()),
        unite: "€",
        choix: null,
      };
    }
    if (!propre(table, key)) return null;
    if (key === "credit.assurance")
      return {
        ...table[key],
        unite:
          projet.credit?.mode_assurance === "montant_annuel" ? "€/an" : "%/an",
      };
    return table[key];
  }
  function valeur(key, s) {
    if (s === "null" || s === "") return null;
    const f = descriptif(key);
    if (!f) throw new Error("Champ inconnu dans le lien : " + key);
    if (f.choix) {
      if (!propre(f.choix, s))
        throw new Error("Valeur inconnue pour " + f.label + ".");
      if (f.choix === ouiNon) return s === "true";
      return key === "fiscalite.tmi_pct" ? Number(s) : s;
    }
    const texte = String(s)
      .replace(/[\s\u202f\u00a0]/g, "")
      .replace(",", ".");
    if (
      !/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(texte) ||
      !Number.isFinite(Number(texte))
    )
      throw new Error("Indiquez un nombre pour « " + f.label + " ».");
    return Number(texte);
  }
  function decode(fragment) {
    const params = new URLSearchParams(fragment.replace(/^#/, ""));
    if (params.get("v") !== "1" || params.getAll("v").length !== 1)
      throw new Error("Version du lien de bilan inconnue.");
    const p = { hypotheses: [] },
      vus = new Set();
    for (const [cle, s] of params) {
      if (cle === "v") continue;
      if (cle === "hypothese") {
        if (s) p.hypotheses.push(s);
        continue;
      }
      if (vus.has(cle))
        throw new Error(
          "Le champ « " + cle + " » figure deux fois dans le lien.",
        );
      vus.add(cle);
      if (cle === "charges_annuelles") {
        if (s !== "0" && s !== "null")
          throw new Error(
            "Les charges doivent être ventilées ou indiquées à zéro.",
          );
        if (propre(p, "charges_annuelles"))
          throw new Error("Deux montants de charges incompatibles.");
        p.charges_annuelles = s === "0" ? {} : null;
        continue;
      }
      const i = cle.indexOf("."),
        g = cle.slice(0, i),
        k = cle.slice(i + 1);
      if (
        i < 1 ||
        !propre(groupes, g) ||
        interdit.has(k) ||
        !descriptif(cle) ||
        (g === "charges_annuelles" && vus.has(g))
      )
        throw new Error("Champ inconnu ou incompatible dans le lien : " + cle);
      (p[g] ||= {})[k] = valeur(cle, s);
    }
    return p;
  }
  function encode(p) {
    const params = new URLSearchParams({ v: "1" });
    for (const g of Object.keys(groupes)) {
      if (p[g] == null) {
        if (g === "charges_annuelles" && propre(p, g)) params.set(g, "null");
        continue;
      }
      const entries = Object.entries(p[g]);
      if (g === "charges_annuelles" && !entries.length) params.set(g, "0");
      for (const [k, v] of entries) params.set(g + "." + k, String(v));
    }
    for (const h of p.hypotheses || []) params.append("hypothese", h);
    return "#" + params.toString();
  }
  window.RentaChamps = {
    groupes,
    regimes,
    locations,
    table,
    descriptif,
    valeur,
    decode,
    encode,
  };
})();
