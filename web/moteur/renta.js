/* Le navigateur exécute les mêmes modules de calcul que la version de référence. */
(() => {
  "use strict";

  const base = new URL(".", document.currentScript.src);
  const assets = new Map();
  let chargement;

  function chargerScript(nom) {
    if (!assets.has(nom)) {
      const promesse = new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = new URL(nom, base).href;
        script.onload = resolve;
        script.onerror = () => {
          assets.delete(nom);
          script.remove();
          reject(new Error("Le moteur local n’a pas pu être chargé. Réessayez en ouvrant le lien du simulateur."));
        };
        document.head.appendChild(script);
      });
      assets.set(nom, promesse);
    }
    return assets.get(nom);
  }

  async function initialiser() {
    await chargerScript("brython-3.14.3.js");
    await chargerScript("modules.js");
    const runtime = globalThis.__BRYTHON__;
    runtime.parser.brython({debug: 0, ids: [], indexeddb: false, cache: false});
    // Ce programme est constant. Les chiffres de la personne sont passés séparément en JSON.
    runtime.runPythonSource(`from browser import window
from javascript import JSON
from moteur.api import arrondir, calcul, comparer_fiscalite, questions, sensibilite
from moteur.saisie import lire

def executer(action, texte):
    try:
        projet = JSON.parse(texte)
        if action == "calculer":
            resultat = calcul(projet, echeancier=True)
        elif action == "comparer":
            resultat = comparer_fiscalite(projet)
        elif action == "sensibilite":
            resultat = sensibilite(projet)
        elif action == "entrees":
            fiche = lire(projet)
            resultat = {"projet": fiche.projet, "defauts": fiche.defauts, "questions": fiche.questions, "erreurs": fiche.erreurs}
        else:
            resultat = questions(projet)
    except ValueError as err:
        resultat = {"statut": "a_corriger", "motif": str(err)}
    return JSON.stringify(arrondir(resultat))

window._rentaActionLocale = executer
`, {id: "interface_renta"});
    const action = window._rentaActionLocale;
    delete window._rentaActionLocale;
    if (typeof action !== "function") {
      throw new Error("Le moteur local n’a pas pu démarrer. Rechargez la page.");
    }
    return action;
  }

  async function executer(nom, projet) {
    const dossier = JSON.stringify(projet);
    if (typeof dossier !== "string") {
      return {statut: "a_corriger", motif: "Une fiche de projet est attendue."};
    }
    if (!chargement) {
      chargement = initialiser().catch(erreur => {
        chargement = undefined;
        throw erreur;
      });
    }
    const action = await chargement;
    return JSON.parse(action(nom, dossier));
  }

  globalThis.RentaMoteur = Object.freeze({
    calculer: projet => executer("calculer", projet),
    comparer: projet => executer("comparer", projet),
    questions: projet => executer("questions", projet),
    entrees: projet => executer("entrees", projet),
    sensibilite: projet => executer("sensibilite", projet),
  });
})();
