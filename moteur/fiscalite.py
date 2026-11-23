"""Scénarios à droit constant. Voir docs/fiscalite.md pour le périmètre et les sources."""
from dataclasses import dataclass, field


class QuestionFiscale(ValueError):
    """Un seuil atteint pendant la projection appelle une précision du foyer."""
    champ = "fiscalite.revenus_comparaison_lmp"


@dataclass
class Suivi:
    deficits: list = field(default_factory=list)
    amortissements_differes: float = 0.0
    base_amortie: float = 0.0
    recettes_bic: list = field(default_factory=list)

    def imputer(self, an, benefice, duree=10):
        restant = []
        for origine, montant in self.deficits:
            if duree is not None and an-origine > duree:
                continue
            pris = min(montant, benefice)
            benefice -= pris
            if montant > pris:
                restant.append((origine, montant-pris))
        self.deficits = restant
        return benefice


def ir_bareme(revenu, parts):
    quotient = max(0, revenu)/parts
    total, precedent = 0.0, 0
    for plafond, taux in ((11600, 0), (29579, .11), (84577, .30), (181917, .41), (float("inf"), .45)):
        total += max(0, min(quotient, plafond)-precedent)*taux
        precedent = plafond
    return total*parts


def impot_personnel(base, taux_ps, f):
    if f["mode_ir"] == "tmi":
        ir = base*f["tmi_pct"]/100
    else:
        revenu, parts = f["revenu_hors_location"], f["parts"]
        ir = ir_bareme(revenu+base, parts)-ir_bareme(revenu, parts)
    ps = base*taux_ps
    return {"base_imposable": base, "ir_estime": ir, "prelevements_sociaux": ps, "impot": ir+ps}


def micro(f, location, recettes, suivi):
    autres = f["autres_recettes"]
    total = recettes + autres
    if f["regime"] == "micro_foncier":
        if total > 15000:
            raise ValueError("Micro-foncier hors seuil : les recettes foncières brutes du foyer dépassent 15 000 €.")
        return recettes*.70
    seuil, abattement = (15000, .30) if location == "tourisme_non_classe" else (83600, .50)
    if not suivi.recettes_bic:
        suivi.recettes_bic = [f["recettes_n2"], f["recettes_n1"]]
    if min(suivi.recettes_bic[-2:]) > seuil:
        raise ValueError(f"Micro-BIC hors seuil : N−1 et N−2 dépassent chacun {seuil:,} €.".replace(",", " "))
    suivi.recettes_bic.append(total)

    def imposable(brut):
        return max(0, brut-max(305, brut*abattement))

    # L'abattement minimal de 305 € s'applique une seule fois à l'activité.
    return imposable(total) - imposable(autres)


def estimer(f, location, an, recettes_hc, refacturees, gestion, indice_charges, interets, assurance, suivi, net_exploitation, net_reference):
    regime = f["regime"]
    if regime == "avant_impot":
        return {"impot": None}
    if regime == "montant_connu":
        facteur = 1.0
        if f["evolution_impot_connu"] == "proportionnel_net" and an > 1:
            if net_reference <= 0:
                raise ValueError("L’indexation d’un impôt connu exige un résultat d’exploitation de référence positif.")
            facteur = max(0, net_exploitation/net_reference)
        return {"impot": f["impot_annuel"]*facteur}
    meuble = location != "nue"
    recettes = recettes_hc + (refacturees if meuble else 0)
    if regime in ("lmnp_reel", "micro_bic") and recettes+f["autres_recettes"] > 23000:
        if location.startswith("tourisme"):
            raise ValueError("Tourisme au-delà de 23 000 € : chiffrer les cotisations avec le régime social applicable et utiliser un montant connu.")
        if "revenus_comparaison_lmp" not in f:
            raise QuestionFiscale("Les recettes meublées dépassent 23 000 €. Quel montant de revenus du foyer comparer pour déterminer le statut LMNP ou LMP ?")
        if recettes+f["autres_recettes"] > f["revenus_comparaison_lmp"]:
            raise ValueError("Les deux conditions de la location meublée professionnelle sont remplies. Le scénario LMNP ne s’applique plus.")
    if regime.startswith("micro_"):
        return impot_personnel(micro(f, location, recettes, suivi), .186 if meuble else .172, f)

    # Les charges récupérées à prix coûtant apparaissent symétriquement des deux côtés au réel.
    charges = f["charges_deductibles_annuelles"]*indice_charges + gestion + (refacturees if meuble else 0)
    if an == 1:
        charges += f["deductions_annee_1"]
    frais_emprunt = interets + assurance
    resultat = recettes - charges - frais_emprunt
    detail = {"recettes_fiscales": recettes, "charges_deduites_hors_emprunt": charges, "frais_emprunt": frais_emprunt}
    if regime == "jeanbrun":
        taux = {"neuf": {"intermediaire": .035, "social": .045, "tres_social": .055},
                "ancien": {"intermediaire": .03, "social": .035, "tres_social": .04}}
        base = f["base_jeanbrun"]
        mois = f["mois_jeanbrun_an1"] if an == 1 else 12
        annuite = base*taux[f["type_jeanbrun"]][f["niveau_jeanbrun"]]*mois/12
        amort = min(annuite, f["plafond_jeanbrun"], max(0, base-suivi.base_amortie))
        resultat -= amort
        suivi.base_amortie += amort
        detail["deduction_jeanbrun"] = amort

    if regime in ("foncier_reel", "jeanbrun"):
        perte = max(0, -resultat)
        part_interets = max(0, frais_emprunt-recettes)
        global_possible = min(10700, max(0, perte-part_interets))
        if perte > global_possible:
            suivi.deficits.append((an, perte-global_possible))
        base = suivi.imputer(an, max(0, resultat))
        detail["deficit_imputable_global_hors_flux"] = global_possible
    else:
        dotation = min(f["amortissement_annuel"], max(0, f["base_amortissable"]-suivi.base_amortie))
        suivi.base_amortie += dotation
        if regime == "lmnp_reel":
            amort = min(dotation, max(0, resultat))
            suivi.amortissements_differes += dotation-amort
            resultat -= amort
            if resultat < 0:
                suivi.deficits.append((an, -resultat))
            base = suivi.imputer(an, max(0, resultat))
            reprise = min(base, suivi.amortissements_differes)
            base -= reprise
            suivi.amortissements_differes -= reprise
            detail.update(amortissement_deduit=amort+reprise, amortissement_en_report=suivi.amortissements_differes)
        else:
            resultat -= dotation
            if resultat < 0:
                suivi.deficits.append((an, -resultat))
            # Limite du report en avant à l'IS (1 M€ puis 50 % de l'excédent).
            benefice = max(0, resultat)
            imputable = min(benefice, 1_000_000 + .5*max(0, benefice-1_000_000))
            base = benefice-imputable + suivi.imputer(an, imputable, duree=None)
            tranche = min(base, 42500) if f["taux_reduit_is"] else 0
            impot = tranche*.15 + (base-tranche)*.25
            dividendes = f["dividendes_bruts_annuels"]
            return {**detail, "amortissement_deduit": dotation, "base_imposable": base, "is": impot,
                    "impot": impot, "deficits_en_report": sum(v for _, v in suivi.deficits),
                    "dividendes_bruts_hypothese": dividendes, "pfu_associe": dividendes*.314,
                    "dividendes_nets_associe": dividendes*(1-.314)}
    detail["deficits_en_report"] = sum(v for _, v in suivi.deficits)
    return {**detail, **impot_personnel(base, .186 if meuble else .172, f)}
