"""Lire un dossier, conserver les inconnues et formuler les questions applicables."""
from math import isfinite

REGIMES = ("avant_impot", "montant_connu", "micro_foncier", "foncier_reel",
           "micro_bic", "lmnp_reel", "sci_is", "jeanbrun")
LOCATIONS = ("nue", "meublee_longue", "tourisme_classe", "tourisme_non_classe")
INCONNU = object()
CHAMPS = {
    "achat": "prix frais_acte mode_acte taux_departement_pct agence_en_plus travaux mobilier autres",
    "credit": "capital apport_hors_frais_bancaires taux_pct duree_mois differe_mois type_differe mode_assurance assurance garantie dossier",
    "location": "type loyer_mensuel_hc prix_nuit occupation_pct vacance_pct annexes_mensuelles gestion_pct delai_mois charges_refacturees_annuelles",
    "projection": "annees index_loyers_pct index_charges_pct actualisation_pct effort_max_mensuel",
    "fiscalite": "regime annee_reference detention conditions_confirmees micro_compatible tmi_pct mode_ir revenu_hors_location parts impot_annuel evolution_impot_connu charges_deductibles_annuelles deductions_annee_1 autres_recettes recettes_n1 recettes_n2 revenus_comparaison_lmp amortissement_annuel base_amortissable taux_reduit_is dividendes_bruts_annuels type_jeanbrun niveau_jeanbrun base_jeanbrun plafond_jeanbrun mois_jeanbrun_an1",
    "revente": "prix frais indemnite mode_indemnite impot mode_impot base_acquisition_fiscale frais_cession_deductibles amortissements_a_reintegrer cas_particulier_confirme",
}


class Lecture:
    def __init__(self, brut):
        if not isinstance(brut, dict):
            raise ValueError("Le projet doit être un objet JSON.")
        self.brut = brut
        self.projet = {}
        self.questions = {}
        self.erreurs = {}
        self.defauts = {}
        for groupe, donnees in brut.items():
            if groupe in ("charges_annuelles", "hypotheses"):
                continue
            if groupe not in CHAMPS:
                self.erreurs[groupe] = "Rubrique inconnue."
            elif donnees is not None:
                if not isinstance(donnees, dict):
                    self.erreurs[groupe] = "Un objet JSON est attendu."
                else:
                    for cle in donnees.keys() - set(CHAMPS[groupe].split()):
                        self.erreurs[f"{groupe}.{cle}"] = "Champ inconnu. Vérifier le nom et l’unité."
        notes = brut.get("hypotheses", [])
        if not isinstance(notes, list) or not all(isinstance(n, str) for n in notes):
            self.erreurs["hypotheses"] = "Utiliser une liste de textes anonymisés."
        self.projet["hypotheses"] = notes

    def champ(self, chemin, question, defaut=INCONNU, choix=None, entier=False,
              minimum=0, maximum=1e12, booleen=False):
        groupe, cle = chemin.split(".")
        section = self.brut.get(groupe)
        section = section if isinstance(section, dict) else {}
        if cle not in section and defaut is not INCONNU:
            v = defaut
            self.defauts[chemin] = v
        else:
            v = section.get(cle)
        if v is None:
            self.questions[chemin] = question
            return None
        if choix is not None:
            valide = not isinstance(v, bool) and v in choix
            attendu = "Valeurs possibles : " + ", ".join(map(str, choix))
        elif booleen:
            valide = isinstance(v, bool)
            attendu = "Utiliser true ou false."
        else:
            valide = (type(v) in (int, float) and minimum <= v <= maximum and isfinite(v)
                      and (not entier or int(v) == v))
            attendu = f"Nombre {'entier ' if entier else ''}compris entre {minimum:g} et {maximum:g} attendu."
            if valide and entier:
                v = int(v)
        if not valide:
            self.erreurs[chemin] = attendu
            return None
        self.projet.setdefault(groupe, {})[cle] = v
        return v


def lire(brut):
    l = Lecture(brut)
    champ = l.champ
    prix = champ("achat.prix", "Quel est le prix d’achat en euros, frais d’agence inclus s’ils figurent déjà dans le prix ?", minimum=0.01)
    mode_acte = champ("achat.mode_acte", "Disposez-vous de frais d’acte chiffrés ou souhaitez-vous une estimation ?", "montant",
                      choix=("montant", "ancien_estime", "neuf_estime"))
    if mode_acte == "montant":
        champ("achat.frais_acte", "Quels frais d’acte prévoit le notaire, en euros ?")
    elif mode_acte == "ancien_estime" and "taux_departement_pct" in (l.brut.get("achat") or {}):
        champ("achat.taux_departement_pct", "Quel taux départemental avez-vous vérifié pour la date d’achat ?", maximum=10)
    for cle in ("agence_en_plus", "travaux", "mobilier", "autres"):
        champ("achat."+cle, f"Quel montant retenir en euros pour « {cle} » à l’achat ?", 0)

    credit = brut.get("credit")
    if isinstance(credit, dict) and credit.get("apport_hors_frais_bancaires") is not None:
        apport = champ("credit.apport_hors_frais_bancaires", "Quel apport est affecté au prix et aux frais d’acquisition, hors frais bancaires ?")
        if credit.get("capital") is not None:
            l.erreurs["credit.capital"] = "Choisir le capital emprunté ou l’apport servant à le déduire."
        # Le coût d’acquisition est disponible seulement après la saisie de cette rubrique.
        from .finance import cout_acquisition
        if prix and apport is not None and not any(k.startswith("achat") for k in {**l.erreurs, **l.questions}):
            cout = cout_acquisition(l.projet["achat"])
            if apport > cout:
                l.erreurs["credit.apport_hors_frais_bancaires"] = "L’apport dépasse le coût d’acquisition."
            capital = max(0, cout-apport)
            l.projet["credit"]["capital"] = capital
        else:
            capital = None
    else:
        capital = champ("credit.capital", "Quel capital est emprunté en euros ? Inscrire 0 pour un achat comptant.")
    for cle in ("garantie", "dossier"):
        champ("credit."+cle, f"Combien coûtent les frais de {cle} du prêt ?", 0)
    if capital:
        champ("credit.taux_pct", "Quel est le taux nominal annuel du prêt, hors assurance ?", maximum=100)
        mois = champ("credit.duree_mois", "Quelle est la durée totale du prêt en mois, différé inclus ?", entier=True, minimum=1, maximum=600)
        differe = champ("credit.differe_mois", "Combien de mois de différé sont prévus ?", 0, entier=True, maximum=599)
        if differe:
            champ("credit.type_differe", "Les intérêts sont-ils payés ou capitalisés pendant le différé ?", choix=("interets_seuls", "capitalise"))
            if mois and differe >= mois:
                l.erreurs["credit.differe_mois"] = "Prévoir au moins une mensualité d’amortissement après le différé."
        assurance = champ("credit.mode_assurance", "L’assurance est-elle un montant annuel ou un taux sur capital initial ou restant dû ?",
                          choix=("montant_annuel", "capital_initial", "capital_restant_du"))
        if assurance:
            champ("credit.assurance", "Quel montant annuel en euros ?" if assurance == "montant_annuel" else "Quel taux annuel d’assurance en % ?",
                  maximum=1e12 if assurance == "montant_annuel" else 100)

    loc = champ("location.type", "Le logement sera-t-il loué nu, meublé à l’année ou en tourisme classé/non classé ?", choix=LOCATIONS)
    if loc in LOCATIONS[:2]:
        champ("location.loyer_mensuel_hc", "Quel loyer mensuel hors charges est réaliste en euros ?")
        champ("location.vacance_pct", "Quelle part des loyers sera perdue en vacance et impayés, en % ?", maximum=100)
    elif loc:
        champ("location.prix_nuit", "Quel prix par nuit hors frais récupérés et taxe de séjour ?")
        champ("location.occupation_pct", "Quel pourcentage des 365 nuits sera effectivement loué ?", maximum=100)
    for cle in ("annexes_mensuelles", "charges_refacturees_annuelles"):
        champ("location."+cle, f"Quel montant pour {cle.replace('_',' ')} en euros ?", 0)
    champ("location.gestion_pct", "Quel pourcentage des loyers est versé au gestionnaire ?", 0, maximum=100)
    champ("location.delai_mois", "Après combien de mois le premier loyer sera-t-il perçu ?", 0, entier=True, maximum=600)

    charges = brut.get("charges_annuelles")
    if charges is None:
        l.questions["charges_annuelles"] = "Quelles dépenses annuelles restent au propriétaire (taxe foncière hors TEOM, copropriété, assurance, entretien…) ?"
    elif not isinstance(charges, dict):
        l.erreurs["charges_annuelles"] = "Saisir un objet avec un montant annuel positif ou nul pour chaque poste."
    else:
        l.projet["charges_annuelles"] = {}
        for poste, montant in charges.items():
            chemin = "charges_annuelles."+poste
            if montant is None:
                l.questions[chemin] = f"Quel montant annuel reste à la charge du propriétaire pour « {poste} » ?"
            elif not poste.strip() or type(montant) not in (float, int) or not 0 <= montant <= 1e12:
                l.erreurs[chemin] = "Saisir un libellé et un montant annuel positif ou nul."
            else:
                l.projet["charges_annuelles"][poste] = montant

    champ("projection.annees", "Sur combien d’années souhaitez-vous étudier les flux ?", minimum=1, maximum=50, entier=True)
    if isinstance(brut.get("projection"), dict) and "effort_max_mensuel" in brut["projection"]:
        champ("projection.effort_max_mensuel", "Quel effort d’épargne moyen acceptez-vous par mois la première année ?")
    champ("projection.index_loyers_pct", "Quelle évolution annuelle des loyers retenir en % ?", 0, minimum=-99, maximum=50)
    champ("projection.index_charges_pct", "Quelle évolution annuelle des charges retenir en % ?", 0, minimum=-99, maximum=50)
    champ("projection.actualisation_pct", "À quel taux annuel en % voulez-vous actualiser les flux ?", 5, minimum=-50, maximum=100)
    regime = champ("fiscalite.regime", "Étudier d’abord le projet avant impôt, saisir un impôt connu ou simuler un régime fiscal ?", choix=REGIMES)
    if regime == "montant_connu":
        champ("fiscalite.impot_annuel", "Quel montant annuel d’impôt locatif, prélèvements compris, retenir en euros ?")
        champ("fiscalite.evolution_impot_connu", "Garder cet impôt constant ou le faire évoluer avec le résultat net d’exploitation ?", "constant", choix=("constant", "proportionnel_net"))
    elif regime and regime != "avant_impot":
        lire_fiscalite(l, loc, regime)
    if "revente" in brut and brut["revente"] is not None:
        lire_revente(l, regime)
    return l


def lire_fiscalite(l, loc, regime):
    c = l.champ
    c("fiscalite.annee_reference", "Quelle est l’année des revenus ? Le moteur embarque les règles 2026.", entier=True, minimum=2026, maximum=2026)
    det = c("fiscalite.detention", "Le bien est-il détenu en direct, en SCI à l’IR ou en SCI à l’IS ?", choix=("direct", "sci_ir", "sci_is"))
    confirme = c("fiscalite.conditions_confirmees", "Les conditions du régime et les hypothèses sociales de la fiche fiscale sont-elles vérifiées ?", booleen=True)
    if confirme is False:
        l.erreurs["fiscalite.conditions_confirmees"] = "Conditions à examiner dans docs/fiscalite.md. Le calcul avant impôt reste disponible."
    if (det and ((regime == "sci_is") != (det == "sci_is")
                 or (regime in ("micro_bic", "lmnp_reel", "micro_foncier") and det != "direct"))):
        l.erreurs["fiscalite.detention"] = "Détention hors du périmètre modélisé pour ce régime."
    if loc and regime != "sci_is" and ((regime in ("micro_foncier", "foncier_reel", "jeanbrun")) != (loc == "nue")):
        l.erreurs["fiscalite.regime"] = "Le régime doit correspondre au type de location."
    if regime != "sci_is":
        ir = c("fiscalite.mode_ir", "Estimer l’IR à la tranche marginale ou au barème de référence ?", "tmi", choix=("tmi", "bareme_indicatif"))
        if ir == "tmi":
            c("fiscalite.tmi_pct", "Quelle tranche marginale d’imposition retenir (0, 11, 30, 41 ou 45 %) ?", choix=(0,11,30,41,45))
        elif ir:
            c("fiscalite.parts", "Combien de parts de quotient familial ?", minimum=0.25, maximum=50)
            c("fiscalite.revenu_hors_location", "Quel revenu net imposable annuel du foyer hors ce projet ?")
    if regime.startswith("micro_"):
        compatible = c("fiscalite.micro_compatible", "Les conditions d’accès au micro, hors seuil calculé, sont-elles réunies (détention, options, autres dispositifs) ?", booleen=True)
        if compatible is False:
            l.erreurs["fiscalite.micro_compatible"] = "Une condition hors seuil exclut le micro."
        c("fiscalite.autres_recettes", "Combien de recettes annuelles de même catégorie le foyer ou l’activité encaisse-t-il hors de ce projet ?")
        if regime == "micro_bic":
            for cle, an in (("recettes_n1", "N−1"), ("recettes_n2", "N−2")):
                c("fiscalite."+cle, f"Quelles recettes de l’activité en {an}, charges comprises ? Pour une création au 1er janvier sans activité antérieure, saisir 0.")
    else:
        c("fiscalite.charges_deductibles_annuelles", "Quelle part annuelle des dépenses est fiscalement déductible, hors emprunt et frais de gestion déjà calculés ?")
        c("fiscalite.deductions_annee_1", "Quels frais initiaux déjà payés sont déductibles en année 1 ?", 0)
    if regime in ("lmnp_reel", "sci_is"):
        c("fiscalite.amortissement_annuel", "Quelle dotation annuelle aux amortissements ressort du plan comptable ?")
        c("fiscalite.base_amortissable", "Quelle valeur reste à amortir, terrain exclu ?")
    if regime == "lmnp_reel":
        c("fiscalite.autres_recettes", "Quelles autres recettes meublées faut-il intégrer aux seuils annuels du foyer ?")
    if regime in ("lmnp_reel", "micro_bic") and "revenus_comparaison_lmp" in l.brut["fiscalite"]:
        c("fiscalite.revenus_comparaison_lmp", "Quel montant annuel des revenus du foyer sert à apprécier le statut professionnel ?")
    if regime == "sci_is":
        c("fiscalite.taux_reduit_is", "La société remplit-elle les conditions du taux réduit d’IS ?", booleen=True)
        c("fiscalite.dividendes_bruts_annuels", "Quel montant la société prévoit-elle de distribuer aux associés chaque année ?", 0)
    if regime == "jeanbrun":
        c("fiscalite.type_jeanbrun", "S’agit-il d’un logement neuf ou ancien réhabilité éligible ?", choix=("neuf", "ancien"))
        c("fiscalite.niveau_jeanbrun", "Quel niveau de location est conventionné ?", choix=("intermediaire", "social", "tres_social"))
        c("fiscalite.base_jeanbrun", "Quelle assiette d’amortissement éligible a été vérifiée, terrain exclu ?")
        c("fiscalite.plafond_jeanbrun", "Quelle part du plafond annuel du foyer reste disponible pour ce bien ?", maximum=12000)
        c("fiscalite.mois_jeanbrun_an1", "Combien de mois d’amortissement sont ouverts au premier exercice civil ?", minimum=1, maximum=12, entier=True)


def lire_revente(l, regime):
    c = l.champ
    c("revente.prix", "Quel prix de vente brut envisagez-vous à la fin de l’horizon retenu ?")
    c("revente.frais", "Quels frais seront payés par le vendeur en euros ?")
    ira = c("revente.mode_indemnite", "Saisir l’indemnité de remboursement ou estimer son plafond ?", "montant", choix=("montant", "plafond"))
    if ira == "montant":
        c("revente.indemnite", "Quelle indemnité de remboursement anticipé prévoit le contrat ? Saisir 0 si elle est nulle.")
    mode = c("revente.mode_impot", "Saisir l’impôt total sur la vente ou estimer la plus-value du particulier ?", "montant", choix=("montant", "particulier"))
    if mode == "montant":
        c("revente.impot", "Quel impôt de cession prévoit le scénario ? Saisir 0 uniquement si c’est l’hypothèse retenue.")
    elif mode == "particulier":
        if regime == "sci_is":
            l.erreurs["revente.mode_impot"] = "La plus-value à l’IS dépend de la valeur nette comptable. Saisir l’impôt de cession de la société."
        v = c("revente.cas_particulier_confirme", "Le cédant unique relève-t-il du régime ordinaire des particuliers, sans exonération spécifique ?", booleen=True)
        if v is False:
            l.erreurs["revente.cas_particulier_confirme"] = "Utiliser le montant établi pour la situation du vendeur."
        c("revente.base_acquisition_fiscale", "Quel prix d’acquisition fiscal majoré est admis, avant reprise d’amortissements ?")
        c("revente.frais_cession_deductibles", "Quelle fraction des frais de vente est fiscalement admise ?")
        c("revente.amortissements_a_reintegrer", "Quel cumul d’amortissements immobiliers doit être réintégré lors de la vente ?")
