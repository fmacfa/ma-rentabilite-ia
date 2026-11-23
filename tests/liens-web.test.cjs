const assert = require("node:assert/strict");
const { readdirSync, readFileSync } = require("node:fs");
const path = require("node:path");
const test = require("node:test");

globalThis.window = globalThis;
require("../web/champs.js");
const { decode, encode } = RentaChamps;

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
