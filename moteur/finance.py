"""Coût d’entrée, échéancier mensuel, revente et indicateurs sur fonds propres."""
from math import expm1, log1p


def frais_acte(achat):
    prix = achat["prix"]
    mode = achat["mode_acte"]
    if mode == "montant":
        return achat["frais_acte"]
    if mode == "neuf_estime":
        return prix * 0.025
    if "taux_departement_pct" not in achat:
        return prix * 0.075
    departement = achat["taux_departement_pct"] / 100
    taxes = prix * (departement * 1.0237 + 0.012 + 0.001)
    emoluments = 0.0
    borne = 0
    for fin, taux in ((6500, .03870), (17000, .01596), (60000, .01064), (float("inf"), .00799)):
        emoluments += max(0, min(prix, fin) - borne) * taux
        borne = fin
    return taxes + 1.20 * emoluments + 900


def cout_acquisition(achat):
    return frais_acte(achat) + sum(achat[k] for k in ("prix", "agence_en_plus", "travaux", "mobilier", "autres"))


def echeancier(credit):
    capital = credit["capital"]
    if capital == 0:
        return []
    mois = credit["duree_mois"]
    differe = credit["differe_mois"]
    capitalise = credit.get("type_differe") == "capitalise"
    taux = credit["taux_pct"] / 1200
    apres_differe = capital * (1+taux)**differe if capitalise else capital
    duree = mois - differe
    mensualite = apres_differe * taux / -expm1(-duree * log1p(taux)) if taux else apres_differe / duree
    solde = capital
    lignes = []
    for m in range(1, mois+1):
        interets = solde * taux
        interets_payes = interets
        amorti = 0.0
        if credit["mode_assurance"] == "montant_annuel":
            prime = credit["assurance"] / 12
        else:
            assiette = solde if credit["mode_assurance"] == "capital_restant_du" else capital
            prime = assiette * credit["assurance"] / 1200
        if m <= differe:
            if capitalise:
                solde += interets
                interets_payes = 0.0
        else:
            amorti = solde if m == mois else min(solde, mensualite - interets)
            solde -= amorti
        lignes.append({"mois": m, "interets_courus": interets, "interets_payes": interets_payes,
                       "capital_rembourse": amorti, "assurance": prime, "echeance": amorti+interets_payes+prime,
                       "capital_restant_du": solde})
    return lignes


def van(flux, taux):
    return sum(f / (1+taux)**an for an, f in enumerate(flux))


def tri(flux):
    signes = [f > 0 for f in flux if abs(f) > 1e-9]
    if sum(a != b for a, b in zip(signes, signes[1:])) != 1:
        return None
    bas, haut = -0.99999, 1.0
    signe_bas = van(flux, bas) > 0
    while haut < 1e12 and (van(flux, haut) > 0) == signe_bas:
        haut = 2*haut+1
    if (van(flux, haut) > 0) == signe_bas:
        return None
    for _ in range(170):
        milieu = (bas+haut)/2
        if (van(flux, milieu) > 0) == signe_bas:
            bas = milieu
        else:
            haut = milieu
    return (bas+haut)/2


def bilan_flux(flux, actualisation):
    annees = len(flux)-1
    apports = -sum(min(f, 0) for f in flux)
    versements = sum(max(f, 0) for f in flux)
    ratio = versements/apports if apports > 0 else None
    taux_tri = tri(flux)
    va_apports = -van([min(f, 0) for f in flux], .04)
    vf_versements = sum(max(f, 0) * 1.04**(annees-an) for an, f in enumerate(flux))
    trim = (vf_versements/va_apports)**(1/annees)-1 if va_apports > 0 and vf_versements > 0 else None
    return {"flux_annuels": flux, "contributions": apports, "distributions": versements,
            "roi_pct": 100*(ratio-1) if ratio is not None else None, "moic": ratio,
            "tri_pct": 100*taux_tri if taux_tri is not None else None,
            "tri_modifie_pct": 100*trim if trim is not None else None, "van": van(flux, actualisation/100)}


def surtaxe_plus_value(base):
    # CGI 1609 nonies G, un cédant. Le lissage porte sur les premiers 10 000 € de chaque tranche.
    if base <= 50000:
        return 0.0
    for debut, taux, lissage in ((250000,.06,.25), (200000,.05,.20), (150000,.04,.15),
                                 (100000,.03,.10), (50000,.02,.05)):
        if base > debut:
            return taux*base - max(0, debut+10000-base)*lissage


def cession(revente, annees, crd, taux_credit):
    if revente["mode_indemnite"] == "plafond":
        indemnite = min(crd*.03, crd*taux_credit/200)
    else:
        indemnite = revente["indemnite"]
    detail = {}
    if revente["mode_impot"] == "particulier":
        if revente["frais_cession_deductibles"] > revente["frais"]:
            raise ValueError("Les frais de vente déduits fiscalement dépassent les frais payés.")
        if revente["amortissements_a_reintegrer"] > revente["base_acquisition_fiscale"]:
            raise ValueError("La reprise d’amortissements dépasse la base d’acquisition indiquée.")
        pv = max(0, revente["prix"] - revente["frais_cession_deductibles"]
                 - revente["base_acquisition_fiscale"] + revente["amortissements_a_reintegrer"])
        tranche = max(0, min(annees, 21)-5)
        abat_ir = min(1, .06*tranche + .04*(annees >= 22))
        abat_ps = min(1, .0165*tranche + .016*(annees >= 22) + .09*max(0, annees-22))
        base_ir = 0 if annees >= 22 else pv*(1-abat_ir)
        base_ps = 0 if annees >= 30 else pv*(1-abat_ps)
        surtaxe = surtaxe_plus_value(base_ir)
        impot = base_ir*.19 + base_ps*.172 + surtaxe
        detail = {"plus_value_brute": pv, "base_ir": base_ir, "base_ps": base_ps, "surtaxe": surtaxe}
    else:
        impot = revente["impot"]
    net = revente["prix"]-revente["frais"]-indemnite-crd-impot
    return {**detail, "prix": revente["prix"], "frais": revente["frais"], "dette_remboursee": crd,
            "indemnite": indemnite, "impot_cession": impot, "produit_net": net}
