/* Généré depuis exemples/*.json. */
window.RentaContenus = {
  "exemples": {
    "jeanbrun": {
      "achat": {
        "prix": 220000,
        "frais_acte": 5500
      },
      "credit": {
        "capital": 0
      },
      "location": {
        "type": "nue",
        "loyer_mensuel_hc": 780,
        "vacance_pct": 0,
        "delai_mois": 2
      },
      "charges_annuelles": {
        "copropriete": 850,
        "taxe_et_assurance": 1200
      },
      "fiscalite": {
        "regime": "jeanbrun",
        "annee_reference": 2026,
        "detention": "direct",
        "conditions_confirmees": true,
        "micro_compatible": false,
        "autres_recettes": 0,
        "tmi_pct": 30,
        "charges_deductibles_annuelles": 2050,
        "type_jeanbrun": "neuf",
        "niveau_jeanbrun": "intermediaire",
        "base_jeanbrun": 176000,
        "plafond_jeanbrun": 8000,
        "mois_jeanbrun_an1": 10
      },
      "projection": {
        "annees": 10
      },
      "hypotheses": [
        "Exemple fictif de logement collectif neuf acquis en mars 2026, loyer intermédiaire et ressources du locataire supposés conformes, engagement de neuf ans. Le budget de l’année initiale retient dix mois de recettes et les charges annuelles indiquées.",
        "Assiette vérifiée dans ce scénario : 220 000 € × 80 %. Aucun autre amortissement Jeanbrun dans le foyer."
      ]
    },
    "lina": {
      "achat": {
        "prix": 140000,
        "frais_acte": 11200,
        "travaux": 14000,
        "mobilier": 4000,
        "autres": 1800
      },
      "credit": {
        "capital": 145000,
        "taux_pct": 3.5,
        "duree_mois": 240,
        "mode_assurance": "montant_annuel",
        "assurance": 360,
        "garantie": 1500,
        "dossier": 800
      },
      "location": {
        "type": "meublee_longue",
        "loyer_mensuel_hc": 1050,
        "vacance_pct": 5,
        "delai_mois": 2
      },
      "charges_annuelles": {
        "taxe_fonciere_nette": 1200,
        "copropriete": 900,
        "assurance_pno": 180,
        "entretien_et_renouvellement": 700
      },
      "fiscalite": {
        "regime": "montant_connu",
        "impot_annuel": 1200,
        "evolution_impot_connu": "proportionnel_net"
      },
      "projection": {
        "annees": 10,
        "actualisation_pct": 5,
        "index_loyers_pct": 1.5,
        "index_charges_pct": 2
      },
      "revente": {
        "prix": 190000,
        "frais": 9500,
        "indemnite": 0,
        "impot": 5000
      },
      "hypotheses": [
        "Exemple fictif de Lina, guide de juillet 2026. L’impôt initial et l’impôt de cession sont des hypothèses chiffrées du livre.",
        "Hypothèses reconstituées à partir du tableau de sortie : loyers +1,5 %/an, charges +2 %/an ; à compter de l’année 2, impôt proportionnel au résultat net d’exploitation. Elles reproduisent les indicateurs du guide."
      ]
    },
    "location-meublee": {
      "achat": {
        "prix": 130000,
        "frais_acte": 10000,
        "mobilier": 5500
      },
      "credit": {
        "capital": 100000,
        "taux_pct": 3.2,
        "duree_mois": 216,
        "differe_mois": 3,
        "type_differe": "interets_seuls",
        "mode_assurance": "capital_restant_du",
        "assurance": 0.3
      },
      "location": {
        "type": "meublee_longue",
        "loyer_mensuel_hc": 850,
        "vacance_pct": 4,
        "charges_refacturees_annuelles": 600
      },
      "charges_annuelles": {
        "taxe_fonciere": 900,
        "comptabilite": 450,
        "assurance": 150,
        "entretien": 500
      },
      "fiscalite": {
        "regime": "lmnp_reel",
        "annee_reference": 2026,
        "detention": "direct",
        "conditions_confirmees": true,
        "micro_compatible": true,
        "tmi_pct": 30,
        "autres_recettes": 0,
        "recettes_n1": 0,
        "recettes_n2": 0,
        "charges_deductibles_annuelles": 2000,
        "amortissement_annuel": 3100,
        "base_amortissable": 108000
      },
      "projection": {
        "annees": 7
      },
      "hypotheses": [
        "Exemple fictif de création individuelle au 1er janvier. Loueur non professionnel relevant des prélèvements sur le patrimoine.",
        "Les 600 € refacturés sont compensés par 600 € de dépenses récupérables. Dotation illustrative hors terrain à confirmer sur un plan comptable."
      ]
    },
    "location-nue": {
      "achat": {
        "prix": 150000,
        "frais_acte": 11500,
        "travaux": 4500
      },
      "credit": {
        "capital": 120000,
        "taux_pct": 3.4,
        "duree_mois": 240,
        "mode_assurance": "capital_initial",
        "assurance": 0.25,
        "garantie": 1000,
        "dossier": 500
      },
      "location": {
        "type": "nue",
        "loyer_mensuel_hc": 1000,
        "vacance_pct": 5,
        "gestion_pct": 6
      },
      "charges_annuelles": {
        "taxe_fonciere_hors_teom": 1100,
        "copropriete_non_recuperable": 700,
        "assurance": 200,
        "reserve_travaux": 400
      },
      "fiscalite": {
        "regime": "foncier_reel",
        "annee_reference": 2026,
        "detention": "direct",
        "conditions_confirmees": true,
        "micro_compatible": true,
        "tmi_pct": 30,
        "autres_recettes": 0,
        "charges_deductibles_annuelles": 2000
      },
      "projection": {
        "annees": 5
      },
      "hypotheses": [
        "Exemple fictif en France. Aucun autre revenu foncier, aucune option ni exclusion du micro. La réserve de 400 € est un budget de précaution."
      ]
    },
    "sci-is": {
      "achat": {
        "prix": 180000,
        "frais_acte": 14200
      },
      "credit": {
        "capital": 0
      },
      "location": {
        "type": "nue",
        "loyer_mensuel_hc": 960,
        "vacance_pct": 4
      },
      "charges_annuelles": {
        "taxe_fonciere": 1000,
        "assurance_et_gestion_comptable": 1100
      },
      "fiscalite": {
        "regime": "sci_is",
        "annee_reference": 2026,
        "detention": "sci_is",
        "conditions_confirmees": true,
        "charges_deductibles_annuelles": 2100,
        "amortissement_annuel": 3800,
        "base_amortissable": 145000,
        "taux_reduit_is": true,
        "dividendes_bruts_annuels": 2000
      },
      "projection": {
        "annees": 5
      },
      "hypotheses": [
        "SCI française fictive remplissant les conditions du taux réduit. Distribution annuelle hypothétique finançable et couverte par un bénéfice distribuable."
      ]
    },
    "tourisme": {
      "achat": {
        "prix": 155000,
        "mode_acte": "ancien_estime",
        "mobilier": 7000
      },
      "credit": {
        "capital": 0
      },
      "location": {
        "type": "tourisme_non_classe",
        "prix_nuit": 85,
        "occupation_pct": 45,
        "gestion_pct": 18
      },
      "charges_annuelles": {
        "charges_et_assurance": 2100,
        "entretien": 1200
      },
      "fiscalite": {
        "regime": "micro_bic",
        "annee_reference": 2026,
        "detention": "direct",
        "conditions_confirmees": true,
        "micro_compatible": true,
        "tmi_pct": 11,
        "autres_recettes": 0,
        "recettes_n1": 13000,
        "recettes_n2": 12800,
        "charges_deductibles_annuelles": 3300,
        "base_amortissable": 120000,
        "amortissement_annuel": 3250
      },
      "projection": {
        "annees": 3
      },
      "hypotheses": [
        "Exemple fictif d’activité individuelle homogène déjà exercée. Autorisation de courte durée supposée vérifiée dans la commune. Frais d’acte provisionnels."
      ]
    }
  }
};
