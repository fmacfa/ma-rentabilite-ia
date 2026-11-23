/* Généré depuis assistant.md et exemples/. */
window.RentaContenus = {
  "guide": "# Ma Rentabilité IA · Étudier un investissement locatif en France\n\nVous pouvez commencer avec une phrase, même si vous ne connaissez que le prix du bien. Par exemple : « J’envisage un appartement à 150 000 €. Un loyer de 950 € par mois me permettrait-il de couvrir toutes les dépenses ? » Pour reprendre un projet, collez le lien du bilan ou joignez son PDF à votre conversation.\n\n## Conduire l’entretien dans le chat\n\nQuand une personne te partage ce lien pour que tu l’accompagnes, prends en charge les calculs et la préparation de son bilan. Réponds en français, avec ses mots. Si elle a déjà décrit son projet, commence avec les éléments fournis. Si elle transmet simplement le guide, tu peux ouvrir ainsi :\n\n> Que souhaitez-vous vérifier avec ce projet : ce qu’il vous restera chaque mois, le prix que vous pouvez payer ou le choix entre deux façons de louer ? Quel est le prix envisagé et quel loyer hors charges pensez-vous pouvoir obtenir ?\n\nPose deux ou trois questions à la fois. Garde dans la conversation une fiche reprenable avec les montants, leur période, leur provenance, les hypothèses acceptées et les informations à retrouver. Pour une question de vocabulaire, une définition et un petit calcul suffisent.\n\n1. **Le bien.** Relève le prix, la commune si utile, les frais d’agence déjà inclus, les frais d’acte, les travaux et le mobilier. Propose le compromis ou les devis pour préciser les montants.\n2. **La location.** Demande le mode de location, le loyer mensuel hors charges ou le tarif par nuit, l’occupation et le délai avant le premier loyer. Identifie les dépenses restant au propriétaire sur l’avis de taxe foncière, les comptes de copropriété ou le contrat de gestion.\n3. **Le financement.** Demande s’il y a un emprunt. Sur l’offre, relève le capital, la durée, le taux nominal, l’assurance, les frais bancaires et l’éventuel différé.\n4. **Les choix à étudier.** Demande l’horizon et si une vente est envisagée. Pour une question fiscale, établis l’année des revenus, la détention, la résidence fiscale et le régime social. Demande uniquement les montants agrégés utiles au régime envisagé.\n5. **Les inconnues.** Inscris « à confirmer » quand une valeur manque. Réserve le zéro aux postes effectivement nuls. Pour avancer, propose une hypothèse chiffrée ou deux variantes et explique leur effet. Une première estimation peut par exemple se limiter au rendement brut sur le prix annoncé ou à la trésorerie avant impôt.\n\nAvec seulement le prix et le loyer, un premier calcul est possible. Pour 950 € par mois, 950 € × 12 ÷ 150 000 € = **7,60 % brut sur le prix affiché**, avant frais, vacance, crédit et impôt. Un rendement net demande les dépenses du projet. Pour expliquer un résultat, tu peux retrouver sa formule, son unité et un exemple sur la page [Tous les calculs](https://fmacfa.github.io/ma-rentabilite-ia/calculs.html).\n\n## Restituer le bilan complet\n\nCommence par la réponse à la décision posée, par exemple le montant mensuel qui reste au propriétaire ou qu’il doit apporter. Indique le scénario et la période. Fournis ensuite le **détail chiffré dans le chat**, puis son lien de bilan. Pour chaque indicateur annoncé, donne la formule, remplace ses termes par les montants du dossier, indique l’unité et explique le résultat en une phrase. Garde la précision entière pendant le calcul et arrondis les montants affichés au centime.\n\n- **Hypothèses.** Présente les montants connus, les estimations acceptées et les postes encore ouverts. Indique notamment les valeurs retenues pour la vacance, les frais d’acte, les taux du prêt, la fiscalité et l’indexation. Rappelle la source des principaux montants.\n- **Acquisition et financement.** Décompose le coût d’acquisition, les frais de crédit, l’apport réel et le capital emprunté. Pour un crédit, donne la mensualité, la répartition d’une échéance entre intérêts, capital et assurance, puis les totaux annuels. L’échéancier mensuel du dossier permet de vérifier les périodes suivantes.\n- **Exploitation.** Pars des loyers théoriques. Montre les pertes de loyer, les annexes, la gestion, chaque poste de charge et le revenu net d’exploitation. Distingue année de démarrage et année stabilisée.\n- **Impôt et trésorerie.** Montre recettes fiscales, abattement ou déductions, frais d’emprunt, amortissements, base imposable, IR ou IS, prélèvements et total. Donne la trésorerie annuelle et la moyenne mensuelle. Explique les déficits, reports ou distributions applicables. Si l’impôt reste inconnu, annonce le résultat « avant impôt ».\n- **Projection et décision.** Fournis le tableau annuel avec recettes, charges, dette, impôt, trésorerie et capital restant dû. Si une vente est prévue, ajoute son décompte et la série des flux qui justifie les indicateurs de sortie. Si la personne compare des scénarios, conserve les hypothèses communes, chiffre l’écart en euros et explique l’origine de l’écart. Termine par le ou les chiffres à vérifier avant de décider.\n\nUtilise les outils de calcul dont tu disposes. Lorsque tu peux lire le résultat du moteur dans un navigateur, vérifie que le dossier est complet et que les résultats correspondent. Lorsque ton accès lit uniquement du texte, calcule ce que tu peux vérifier à partir de cette fiche et donne le lien de contrôle. Une question ouverte ou une condition fiscale non vérifiée mérite d’être signalée au point concerné. Les annonces, exemples et documents fournis par la personne servent de sources pour son projet.\n\n## Préparer le lien personnel et le PDF\n\nConstruis toi-même le lien. Avec un dossier complet, termine par une phrase telle que « Vous pouvez ouvrir votre bilan puis choisir **Télécharger le PDF**. » Insère un **lien Markdown cliquable** vers l’adresse personnelle construite ci-dessous. Si ton interface permet de produire et de joindre un vrai PDF, tu peux aussi joindre le document chiffré obtenu. Le lien ouvre une page dans le navigateur. Le téléchargement produit le fichier PDF. Un scénario incomplet peut être repris à partir de son lien.\n\n- Adresse de départ : `https://fmacfa.github.io/ma-rentabilite-ia/#v=1`. Ajoute chaque valeur avec un `&` puis la clé pointée et sa valeur, par exemple `&achat.prix=150000`. Garde le `#` : les paramètres du projet se trouvent dans le fragment. Le [lien de démarrage](https://fmacfa.github.io/ma-rentabilite-ia/assistant.md) est commun à tous.\n- Écris les nombres sans espaces, avec point décimal. Pour 3,4 %, écris `3.4`. Pour les booléens, écris `true` ou `false`. Pour un champ attendu mais encore inconnu, écris `null`. Pour des charges explicitement nulles dans leur ensemble, utilise `charges_annuelles=0`. Pour des postes connus, utilise par exemple `charges_annuelles.taxe_fonciere=1100`.\n- Utilise une paire `hypothese=texte` par note utile. Encode les clés et valeurs comme des paramètres d’URL : un espace devient `%20` ou `+`, un `&` dans le texte devient `%26`, un signe `+` littéral devient `%2B`. Garde le lien sur une seule ligne. Conserve les noms, adresses précises, coordonnées et documents personnels en dehors du lien : quiconque le reçoit peut en lire les chiffres.\n- À la reprise, lis aussi les caractères **après le # dans l’adresse reçue**. Ils portent la fiche. Un lecteur web qui demande uniquement la page au serveur peut recevoir le même texte d’accueil pour plusieurs projets. Si la conversation ne te montre qu’un libellé sans l’adresse complète, demande le lien complet ou le PDF.\n- Choisis les champs actifs du scénario dans le tableau ci-dessous. Omettre un champ optionnel applique sa valeur par défaut. Un bloc de revente est utile seulement si la personne prévoit la vente. En cas de comparaison, donne un lien identifié pour chaque scénario.\n\n### Champs pour construire le lien\n\nDans ce tableau, ajoute le préfixe suivi d’un point au nom d’un champ. Par exemple, la durée du prêt est `credit.duree_mois`. Les montants sont en euros, les taux en pourcentage et les durées suivent l’unité du champ. Pose les questions en langage courant.\n\n| Préfixe | Champs et choix |\n| --- | --- |\n| `achat` | `prix`, `frais_acte`, `agence_en_plus`, `travaux`, `mobilier`, `autres`. Pour un montant notarial, `mode_acte=montant` est le défaut. Si la personne accepte une provision, utilise `mode_acte=ancien_estime` ou `neuf_estime`. En ancien, `taux_departement_pct` active un calcul local lorsqu’un taux a été vérifié. |\n| `credit` | `capital` (0 pour un achat comptant), ou `apport_hors_frais_bancaires` pour en déduire le capital. Avec un prêt : `taux_pct`, `duree_mois`, `mode_assurance` et `assurance`. Les modes d’assurance sont `montant_annuel` en euros ou `capital_initial` / `capital_restant_du` en % par an. Frais initiaux : `garantie`, `dossier`. En cas de différé : `differe_mois` et `type_differe=interets_seuls` ou `capitalise`. |\n| `location` | `type=nue` ou `meublee_longue` avec `loyer_mensuel_hc` et `vacance_pct`. Pour `tourisme_classe` ou `tourisme_non_classe`, utiliser `prix_nuit` et `occupation_pct`. Postes facultatifs : `annexes_mensuelles`, `gestion_pct`, `delai_mois`, `charges_refacturees_annuelles` récupérées à prix coûtant. |\n| `charges_annuelles` | Un nom simple et un montant annuel pour chaque dépense du propriétaire. La gestion proportionnelle, l’assurance du prêt et les charges refacturées disposent de champs distincts. |\n| `projection` | `annees` de 1 à 50. `index_loyers_pct` et `index_charges_pct` valent chacun 0 % par défaut. `actualisation_pct` vaut 5 % par défaut. |\n| `fiscalite` | `regime=avant_impot` pour l’exploitation seule, `montant_connu` avec `impot_annuel` pour un chiffrage fourni. `evolution_impot_connu` vaut `constant` ou, sur hypothèse explicite, `proportionnel_net` après l’année 1. |\n| `fiscalite` pour un régime calculé | `regime=micro_foncier`, `foncier_reel`, `micro_bic`, `lmnp_reel`, `sci_is` ou `jeanbrun`. Fournis `annee_reference=2026`, `detention=direct`, `sci_ir` ou `sci_is`, et `conditions_confirmees=true` **après vérification** de la détention, du régime social, de l’éligibilité et des charges concernées. Pour l’IR, `tmi_pct` (0, 11, 30, 41 ou 45) avec `mode_ir=tmi` par défaut, ou `mode_ir=bareme_indicatif` avec `revenu_hors_location` et `parts`. |\n| `fiscalite` pour le micro | `micro_compatible` après vérification des conditions hors seuil, et `autres_recettes` de même catégorie hors projet, par an. En BIC, ajoute `recettes_n1` et `recettes_n2` de toute l’activité charges comprises. Le meublé de longue durée peut demander aussi `revenus_comparaison_lmp` pour apprécier le statut du foyer. |\n| `fiscalite` pour le réel | `charges_deductibles_annuelles` hors gestion, emprunt et dépenses récupérées déjà traités. `deductions_annee_1` pour des frais initiaux déjà payés et admis. En LMNP réel ou en SCI à l’IS, ajoute `amortissement_annuel` et `base_amortissable` hors terrain. En LMNP réel, fournis aussi `autres_recettes`. En SCI à l’IS, précise `taux_reduit_is` et, le cas échéant, `dividendes_bruts_annuels`. |\n| `fiscalite` pour Jeanbrun | `type_jeanbrun=neuf` ou `ancien`, `niveau_jeanbrun=intermediaire`, `social` ou `tres_social`, `base_jeanbrun` éligible hors foncier, `plafond_jeanbrun` disponible pour le bien et `mois_jeanbrun_an1`. Ajouter les champs du réel foncier. |\n| `revente` | `prix`, `frais` à la charge du vendeur. `mode_indemnite=montant` avec `indemnite`, ou `plafond` pour un remboursement total à taux fixe. `mode_impot=montant` avec `impot` documenté, ou `particulier` avec `cas_particulier_confirme`, `base_acquisition_fiscale`, `frais_cession_deductibles`, `amortissements_a_reintegrer`. En SCI à l’IS, utiliser un impôt de cession chiffré pour la société. |\n\n### Exemple chiffré et lien de contrôle\n\nUn appartement nu est acheté 150 000 €. Les frais d’acte atteignent 11 500 €, les travaux 4 500 €. Le bailleur emprunte 120 000 € sur 240 mois à 3,4 %, avec assurance à 0,25 % du capital initial. Il paie 1 500 € de garantie et de dossier. Le loyer vaut 1 000 €/mois, avec 5 % de vacance et 6 % de gestion. Les charges annuelles du bailleur se composent de 1 100 € de taxe foncière nette, 700 € de copropriété, 200 € d’assurance et 400 € de réserve pour travaux. Le scénario suppose une détention directe ordinaire, une tranche marginale de 30 % et l’éligibilité confirmée au réel.\n\n| Année 1 | Calcul |\n| --- | --- |\n| Coût d’acquisition | 150 000 + 11 500 + 4 500 = **166 000 €** |\n| Fonds propres initiaux | 166 000 + 1 500 − 120 000 = **47 500 €** |\n| Loyers encaissés | 1 000 × 12 × 95 % = **11 400 €** |\n| Gestion et net d’exploitation | 11 400 × 6 % = 684 €. 11 400 − 684 − 2 400 = **8 316 €** |\n| Rendement net stabilisé | 8 316 ÷ 166 000 × 100 = **5,01 %** |\n| Échéances | 689,80 € de crédit et 25,00 € d’assurance par mois. Le total annuel avant arrondis d’affichage atteint **8 577,61 €**, dont 4 013,97 € d’intérêts et 300 € d’assurance. |\n| Base au réel | 11 400 − 684 − 2 000 de charges déductibles − 4 013,97 d’intérêts − 300 d’assurance = **4 402,03 €**. La réserve de 400 € est une mise de côté. |\n| Impôts estimés | 4 402,03 × 30 % d’IR + 4 402,03 × 17,2 % de prélèvements = **2 077,76 €** |\n| Argent à apporter | 8 316 − 8 577,61 − 2 077,76 = **−2 339,37 €/an**, soit **194,95 €/mois** à apporter en moyenne |\n\n[Ouvrir le bilan de cet exemple et télécharger son PDF](https://fmacfa.github.io/ma-rentabilite-ia/#v=1&achat.prix=150000&achat.frais_acte=11500&achat.travaux=4500&credit.capital=120000&credit.taux_pct=3.4&credit.duree_mois=240&credit.mode_assurance=capital_initial&credit.assurance=0.25&credit.garantie=1000&credit.dossier=500&location.type=nue&location.loyer_mensuel_hc=1000&location.vacance_pct=5&location.gestion_pct=6&charges_annuelles.taxe_fonciere=1100&charges_annuelles.copropriete=700&charges_annuelles.assurance=200&charges_annuelles.reserve_travaux=400&projection.annees=5&fiscalite.regime=foncier_reel&fiscalite.annee_reference=2026&fiscalite.detention=direct&fiscalite.conditions_confirmees=true&fiscalite.tmi_pct=30&fiscalite.charges_deductibles_annuelles=2000&hypothese=Exemple+fictif+en+location+nue)\n\n## Formules à appliquer au projet réel de la personne\n\n| Calcul | Formule ou convention |\n| --- | --- |\n| Achat | Coût d’acquisition = prix + agence à ajouter + frais d’acte + travaux + mobilier + autres frais. Coût initial total = coût d’acquisition + frais bancaires. Fonds propres = coût initial total − emprunt. |\n| Recettes | En longue durée, loyer HC × 12 × (1 − vacance). En tourisme, prix/nuit × 365 × occupation. Ajouter les annexes mensuelles × 12. Les taux sont divisés par 100 dans les formules. |\n| Délai et indexation | Multiplier loyers, annexes, gestion et charges récupérées par la fraction des mois ouverts de chaque année. Dès l’année 2, multiplier les recettes par (1 + indexation des loyers) à la puissance (année − 1). Indexer les charges fixes séparément, sur douze mois. |\n| Net et rendements | Gestion = loyers encaissés hors annexes × taux de gestion. Net d’exploitation = loyers et annexes − gestion − charges du propriétaire. Diviser recettes à pleine occupation, recettes effectives ou net stabilisé par le coût d’acquisition pour obtenir respectivement le brut théorique, le brut effectif ou le net. |\n| Crédit | Taux mensuel i = taux annuel en % ÷ 1 200. Pour K empruntés et n mensualités amortissables, mensualité hors assurance = K × i ÷ [1 − (1 + i)⁻ⁿ], ou K ÷ n à taux nul. Chaque mois, intérêts = solde de début × i. Capital remboursé = mensualité hors assurance − intérêts payés. Retrancher le capital remboursé du solde. |\n| Assurance et différé | Assurance en euros/an ÷ 12, ou capital de référence × taux annuel en % ÷ 1 200. En différé d’intérêts seuls, payer intérêts et assurance. En différé capitalisé, les intérêts augmentent le solde, l’assurance est payée. Calculer ensuite la mensualité sur le solde obtenu et les mois restant à amortir. |\n| Trésorerie | Avant impôt = net d’exploitation − somme des échéances de l’année, assurance incluse. Après impôt = montant précédent − impôt locatif estimé. Moyenne mensuelle = flux annuel ÷ 12. En SCI à l’IS, préciser si la trésorerie est celle de la société avant ou après distribution, ou le revenu net de l’associé. |\n| Autres repères | Rendement après impôt an 1 = (net d’exploitation an 1 − impôt an 1) ÷ coût d’acquisition. Rendement de trésorerie sur apport = flux retenu an 1 ÷ fonds propres. Couverture de la dette = net d’exploitation ÷ échéances assurées. Recettes au point mort par mois ouvert = (charges + gestion + impôt retenu + dette assurée) ÷ mois ouverts. Un dénominateur nul rend l’indicateur indéfini. |\n| Revente | Produit net = prix de vente − frais vendeur − dette restante − indemnité − impôt de cession. Le montant peut être négatif. Lorsque le plafond d’indemnité est applicable, retenir le minimum entre 3 % du solde et six mois d’intérêts sur le capital intégralement remboursé. |\n| VAN, TRI et multiples | Flux initial = opposé de l’apport. Les flux annuels reprennent la trésorerie d’exploitation, avec le produit net de vente ajouté à la dernière année. VAN = somme des flux divisés par (1 + taux d’actualisation) élevé au numéro de l’année, en partant de zéro. Le TRI annule la VAN : indiquer « indéterminé » si les flux ne permettent pas d’isoler un taux. Le TRI modifié réinvestit les entrées et finance les sorties à 4 %. MOIC = somme des flux positifs ÷ valeur absolue des flux négatifs. ROI = (MOIC − 1) × 100 %. |\n\n## Aider à choisir un régime fiscal\n\nLe moteur du bilan applique les règles françaises vérifiées **le 23 novembre 2026**, en les maintenant constantes pour les projections. Précise toujours l’année des revenus. Vérifie les sources officielles pour l’opération réelle, notamment si une situation particulière, une option préexistante ou une autre année change le résultat. Pour une situation hors du périmètre intégré, chiffre l’exploitation avant impôt ou utilise un montant fiscal documenté. Dans une décision engageante, indique le point précis à valider avec le notaire ou l’expert-comptable.\n\n- **Location nue en direct.** Micro-foncier de droit commun sous conditions lorsque les recettes foncières brutes du foyer sont au plus de 15 000 € : base du projet = recettes foncières × 70 %. Au réel, retranche charges déductibles, gestion et frais d’emprunt admis. Ventile le déficit entre la part éventuellement imputable sur le revenu global et les reports fonciers. Le réel sur option engage en principe trois ans. [DGFiP, location nue](https://www.impots.gouv.fr/particulier/questions/je-mets-en-location-un-logement-vide-comment-declarer-les-loyers-percus)\n- **Meublé au micro-BIC.** En longue durée ou tourisme classé, seuil de référence de 83 600 € et abattement de 50 %. En tourisme non classé, seuil de 15 000 € et abattement de 30 %. Examiner N−1 et N−2 séparément. Les charges refacturées entrent dans les recettes. Le minimum d’abattement de 305 € s’apprécie pour l’activité entière. Pour une activité existante, calcule la base supplémentaire en faisant la différence avec et sans le projet. [Service Public, hébergement touristique et revenus 2026](https://entreprendre.service-public.gouv.fr/vosdroits/F39451) · [BOFiP, seuils 2026](https://bofip.impots.gouv.fr/bofip/14069-PGP.html/identifiant%3DBOI-BAREME-000044-20260819)\n- **Meublé au réel.** Établis le résultat après charges et frais financiers admis. L’amortissement retient le plan comptable hors terrain et se limite au résultat disponible avant amortissement. Suis séparément les déficits et les amortissements différés. Au-delà de 23 000 € de recettes meublées du foyer, vérifie les autres revenus utiles en longue durée et le régime de cotisations en tourisme. [DGFiP, location meublée](https://www.impots.gouv.fr/particulier/location-meublee) · [DGFiP, régimes d’imposition](https://www.impots.gouv.fr/particulier/les-regimes-dimposition)\n- **Impôt personnel.** L’estimation usuelle vaut base imposable × tranche marginale pour l’IR, puis base × taux de prélèvements. En 2026, pour les revenus locatifs relevant des prélèvements sur le patrimoine, le taux ordinaire est de 17,2 % en nu et 18,6 % en meublé. L’affiliation, la résidence ou les cotisations d’activité peuvent modifier le calcul. Le barème publié en 2026 concerne les revenus 2025 : son emploi pour une autre année constitue une hypothèse. [DGFiP, prélèvements sociaux](https://www.impots.gouv.fr/particulier/questions/je-donne-un-bien-en-location-dois-je-payer-des-prelevements-sociaux) · [Service Public, barème](https://www.service-public.gouv.fr/particuliers/vosdroits/F1419)\n- **SCI.** À l’IR en location nue, travaille sur une quote-part cohérente du dossier et la situation personnelle de l’associé. À l’IS, détermine le bénéfice fiscal de la société. Le taux ordinaire est 25 %. Pour une société éligible sur douze mois, la tranche jusqu’à 42 500 € est imposée à 15 %. Pour un associé résident relevant du PFU ordinaire, un dividende distribué en 2026 supporte un prélèvement indicatif de 31,4 %. [Service Public, IS](https://entreprendre.service-public.gouv.fr/vosdroits/F23575) · [Service Public, dividendes](https://entreprendre.service-public.gouv.fr/vosdroits/F32963)\n- **Jeanbrun.** Vérifie la période de l’opération, le bâtiment, les travaux éventuels, le loyer, les ressources du locataire et l’engagement de neuf ans avant de comparer la déduction au foncier réel ordinaire. Le calcul applique à la base éligible hors foncier le taux correspondant au type de logement et au niveau de location, le prorata initial et le plafond annuel encore disponible pour le foyer. [Service Public, Relance logement](https://www.service-public.gouv.fr/particuliers/vosdroits/F39735)\n- **Cession.** Dans le régime ordinaire d’un cédant unique, détermine la plus-value à partir du prix, des frais admis et du prix d’acquisition fiscal majoré. Vérifie les amortissements immobiliers à réintégrer, notamment au LMNP réel pour les cessions réalisées à compter du 15 février 2025. Applique les abattements propres à la durée de détention, puis 19 % d’IR, 17,2 % de prélèvements sur la plus-value et la surtaxe éventuelle. Distingue cette base fiscale de l’argent effectivement disponible après remboursement de la banque. [Service Public, plus-value immobilière](https://www.service-public.gouv.fr/particuliers/vosdroits/F10864) · [DGFiP, revente en meublé](https://www.impots.gouv.fr/particulier/questions/je-vends-un-bien-immobilier-donne-en-location-meublee-comment-se-calcule-la)\n\nPour rapprocher deux régimes, montre à la fois l’impôt, la trésorerie, le coût comptable éventuel et, si pertinent, la revente. Pour comparer location nue et meublée, ajuste aussi le loyer, le budget mobilier et la vacance. La personne peut alors choisir en connaissant le coût et la condition qui pourraient faire changer le résultat.\n",
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
