# Remplir un dossier

Un dossier JSON représente un achat, un mode de location et un financement. Les montants sont en euros. Les taux sont exprimés en points de pourcentage (`3.5` signifie 3,5 %). Les libellés et valeurs de choix sont sensibles à l’orthographe. Dans le JSON, écrivez `1050.50` pour 1 050,50 €. `null` dans un champ actif déclenche une question. Un poste optionnel omis prend la valeur indiquée ci-dessous, restituée dans `valeurs_par_defaut`. Les objets inconnus ou mal orthographiés sont signalés.

## Achat et crédit

| Champ | Valeur à fournir |
| --- | --- |
| `achat.prix` | Prix retenu. Pour un prix frais d’agence inclus, renseigner uniquement les frais d’agence additionnels réellement dus. |
| `achat.mode_acte`, `frais_acte` | Par défaut `montant`, avec le montant du notaire. Les options `neuf_estime` et `ancien_estime` activent les conventions historiques. En ancien, `taux_departement_pct` active le calcul par tranches. |
| `achat.agence_en_plus`, `travaux`, `mobilier`, `autres` | Dépenses initiales, hors crédit. Chacune vaut 0 si omise. |
| `credit.capital` | Capital emprunté. Pour un achat comptant, indiquer 0. Autre possibilité, renseigner seulement `apport_hors_frais_bancaires` et laisser calculer le capital. |
| `credit.garantie`, `dossier` | Frais bancaires initiaux, chacun à 0 si omis. Les dépenses déjà incluses ailleurs doivent être ventilées une seule fois. |
| `credit.taux_pct`, `duree_mois` | Taux nominal annuel hors assurance et durée totale en mois. |
| `credit.differe_mois`, `type_differe` | Le différé est inclus dans la durée. Durée par défaut 0. Si elle est positive, choisir `interets_seuls` ou `capitalise`. |
| `credit.mode_assurance`, `assurance` | `montant_annuel` en euros par an, ou `capital_initial` / `capital_restant_du` avec un taux annuel en %. Inclure la quotité assurée dans le montant ou le taux. |

## Location, charges et horizon

| Champ | Valeur à fournir |
| --- | --- |
| `location.type` | `nue`, `meublee_longue`, `tourisme_classe` ou `tourisme_non_classe`. |
| `loyer_mensuel_hc`, `vacance_pct` | Longue durée. Loyer mensuel hors charges et part annuelle de loyer perdue (vacance ou impayés). |
| `prix_nuit`, `occupation_pct` | Tourisme. Prix par nuit et taux d’occupation annuel sur 365 nuits. |
| `annexes_mensuelles`, `gestion_pct` | Recettes annexes mensuelles et gestion en % des loyers encaissés hors annexes. Par défaut 0. |
| `delai_mois` | Nombre initial de mois sans location (par défaut 0). Une même période de travaux doit être comptée une seule fois entre ce délai et la vacance. |
| `charges_refacturees_annuelles` | Recettes de charges récupérées à prix coûtant sur une année stabilisée, par défaut 0. Elles entrent dans les recettes du micro-BIC. Le moteur neutralise la dépense correspondante dans la trésorerie. |
| `charges_annuelles` | Objet regroupant les dépenses restant au bailleur par poste libre. Par exemple `{"copropriete": 850, "taxe_fonciere_hors_teom": 1100}`. Exclure assurance emprunteur, gestion proportionnelle et charges refacturées déjà modélisées. `{}` signifie explicitement zéro charge. |
| `projection.annees` | Horizon de 1 à 50 ans. Une ligne par période de 12 mois. |
| `projection.effort_max_mensuel` | Facultatif, en euros par mois. Demande le loyer HC minimum, ou le prix par nuit, qui respecte cet effort moyen en année 1. Zéro demande l’équilibre. Le loyer prévu peut rester inconnu. [Méthode et exemple](../CALCULS.md#loyer-minimum-pour-un-budget-mensuel) |
| `index_loyers_pct`, `index_charges_pct`, `actualisation_pct` | Dans `projection`. Défauts respectifs 0 %, 0 % et 5 %. Les taux sont des scénarios à confirmer. |

## Fiscalité

| Champs de `fiscalite` | Utilisation |
| --- | --- |
| `regime` | `avant_impot`, `montant_connu`, `micro_foncier`, `foncier_reel`, `micro_bic`, `lmnp_reel`, `sci_is` ou `jeanbrun`. |
| `impot_annuel`, `evolution_impot_connu` | Avec `montant_connu`, somme annuelle en euros. Par défaut `constant`. `proportionnel_net` reproduit l’ancienne convention d’indexation de l’impôt à partir de l’année 2. |
| `annee_reference`, `detention`, `conditions_confirmees` | Pour le calcul fiscal intégré, revenus `2026`, détention `direct`, `sci_ir` ou `sci_is`, puis `true` après vérification du [périmètre](fiscalite.md). |
| `mode_ir`, `tmi_pct` | Par défaut `tmi` et taux à fournir (0, 11, 30, 41 ou 45). Avec `bareme_indicatif`, fournir `revenu_hors_location` et `parts`. |
| `micro_compatible`, `autres_recettes` | Confirmer les conditions du micro hors seuil et fournir les recettes annuelles comparables hors projet (0 si aucune). En LMNP réel, le total des autres recettes meublées sert aussi au contrôle du statut. |
| `revenus_comparaison_lmp` | En meublé de longue durée, ce total annuel des autres revenus du foyer au sens du CGI est demandé si les recettes meublées du foyer dépassent 23 000 €. Le modèle projette ce montant constant. |
| `recettes_n1`, `recettes_n2` | Micro-BIC. Totaux de l’activité sur chacune des deux années de référence, charges comprises. Pour un démarrage au 1er janvier sans activité antérieure, utiliser 0. |
| `charges_deductibles_annuelles` | Charges fiscalement déductibles d’une année stabilisée, hors gestion proportionnelle, intérêts, assurance du crédit et charges récupérées déjà traités. Une réserve pour travaux futurs reste distincte d’une dépense payée. |
| `deductions_annee_1` | En supplément, dépenses initiales déjà payées et dont la déduction est validée. Par défaut 0. Le moteur les traite uniquement dans la base fiscale. |
| `amortissement_annuel`, `base_amortissable` | LMNP réel et IS. Dotation annuelle et valeur immobilière/mobilière restant à amortir, terrain exclu. Le moteur limite le total des dotations à cette base. |
| `taux_reduit_is`, `dividendes_bruts_annuels` | Confirmer l’éligibilité au taux réduit de l’IS par `true` ou `false`. Le dividende est un montant annuel en euros décidé et finançable, par défaut 0. |
| `type_jeanbrun`, `niveau_jeanbrun` | `neuf` ou `ancien` et `intermediaire`, `social` ou `tres_social`. |
| `base_jeanbrun`, `plafond_jeanbrun`, `mois_jeanbrun_an1` | Assiette éligible hors foncier, plafond annuel restant du **foyer** en euros et nombre de mois ouvrant droit à l’amortissement lors du premier exercice. |

## Revente et hypothèses

Omettez le bloc `revente` pour étudier uniquement l’exploitation. Ajoutez-le pour une vente à la fin de la dernière année.

| Champs de `revente` | Utilisation |
| --- | --- |
| `prix`, `frais` | Prix brut et frais à la charge du vendeur. |
| `mode_indemnite`, `indemnite` | Par défaut `montant` avec l’indemnité de remboursement en euros. `plafond` calcule l’estimation pour un remboursement total à taux fixe. |
| `mode_impot`, `impot` | Par défaut `montant` et impôt total de cession fourni. Inscrire 0 si cela fait partie du scénario. |
| `cas_particulier_confirme` | Avec `mode_impot` égal à `particulier`, confirmer le périmètre ordinaire d’un cédant unique imposé en France. |
| `base_acquisition_fiscale`, `frais_cession_deductibles`, `amortissements_a_reintegrer` | Prix d’acquisition fiscal majoré avant reprise, frais de cession fiscalement admis et cumul des amortissements immobiliers à réintégrer en euros. L’acquisition fiscale peut différer du coût économique du projet. |

À la racine, `hypotheses` est une liste de notes. Exemple : « Loyer estimé sur trois annonces de septembre, à confirmer par le bail signé. » Gardez les documents nominatifs en dehors du dépôt.
