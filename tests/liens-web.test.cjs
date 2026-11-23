const assert = require("node:assert/strict");
const { readdirSync, readFileSync } = require("node:fs");
const path = require("node:path");
const test = require("node:test");

globalThis.window = globalThis;
require("../web/champs.js");
const { decode, encode } = RentaChamps;
require("../web/contenus.js");
require("../web/rapport.js");
require("../web/comparaison.js");

test("la comparaison conserve les deux fiches, leurs notes et un budget nul", () => {
  const b = { projection: { effort_max_mensuel: 0 }, hypotheses: ["Devis A & B + #2"] };
  const duo = RentaComparaison.encoder("https://fmacfa.github.io/ma-rentabilite-ia/#exemple=lina&effort=400", encode(b));
  const [a, second] = RentaComparaison.decoder(duo);
  assert.equal(a.projet.projection.effort_max_mensuel, 400);
  assert.equal(RentaContenus.exemples.lina.projection.effort_max_mensuel, undefined);
  assert.deepEqual(second.projet, b);
  for (const h of ["#duo=1&a=v%3D1", duo + "&b=v%3D1", "#duo=1&a=duo%3D1&b=v%3D1"])
    assert.throws(() => RentaComparaison.decoder(h));
  assert.throws(() => RentaComparaison.fiche("https://exemple.org/#exemple=lina"));
});

test("la synthèse conserve les inconnues et les avertissements de comparabilité", () => {
  const incomplet = { projet: { achat: { prix: 100000 } }, r: { statut: "a_completer", questions: { loyer: "Quel loyer ?" } } };
  const partiel = RentaComparaison.rapport([incomplet, incomplet]);
  assert.match(partiel.sousTitre, /en cours/);
  assert.deepEqual(partiel.sections[0].tables[0].lignes[1].slice(1), ["Non calculé", "Non calculé"]);
  const an = { fiscalite: { impot: null }, cash_flow_avant_impot: 0, cash_flow_mensuel_retenu: 0 };
  const a = { projet: {}, r: { statut: "calcule", annees: [an], flux_retenus: "avant impôt locatif" }, rapport: { sections: [] } };
  const b = { ...a, r: { ...a.r, annees: [an, an], flux_retenus: "après impôt locatif estimé" } };
  const synthese = RentaComparaison.rapport([a, b]).sections[0];
  assert.match(synthese.paragraphes.join(" "), /conventions fiscales différentes/);
  assert.match(synthese.paragraphes.join(" "), /horizons diffèrent/);
  assert.doesNotMatch(synthese.paragraphes.join(" "), /demande .* de moins|effort d’épargne moyen est identique/);
});

test("les six exemples sont entièrement repris depuis leur lien", () => {
  const exemples = path.resolve(__dirname, "../exemples");
  for (const nom of readdirSync(exemples).filter((f) => f.endsWith(".json"))) {
    const projet = JSON.parse(readFileSync(path.join(exemples, nom), "utf8"));
    assert.deepEqual(decode(encode(projet)), projet, nom);
  }
});

test("une dépense inconnue, absente ou nulle garde son sens", () => {
  for (const charges of [
    {},
    { charges_annuelles: null },
    { charges_annuelles: {} },
    { charges_annuelles: { entretien: 0 } },
  ]) {
    const projet = { ...charges, achat: { frais_acte: null }, hypotheses: [] };
    assert.deepEqual(decode(encode(projet)), projet);
  }
});

test("les montants et les annotations résistent au copier-coller en français", () => {
  const notes = ["Devis de 2 300 € + 5 % & mobilier #2", "Ligne suivante"];
  const p = { achat: { travaux: 2300.5 }, hypotheses: notes };
  assert.deepEqual(decode(encode(p)), p);
  assert.equal(decode("#v=1&achat.travaux=2%20200%2C50").achat.travaux, 2200.5);
});

test("un lien ambigu ou illisible donne une erreur explicite", () => {
  for (const suite of [
    "v=2",
    "v=1&v=1",
    "v=1&achat.prix=1&achat.prix=2",
    "v=1&charges_annuelles=0&charges_annuelles.entretien=1",
    "v=1&charges_annuelles.entretien=1&charges_annuelles=null",
    "v=1&credit.capital=une+somme",
    "v=1&location.type=autre",
    "v=1&charges_annuelles.__proto__=1",
    "v=1&constructor.test=1",
  ])
    assert.throws(() => decode("#" + suite), undefined, suite);
});
