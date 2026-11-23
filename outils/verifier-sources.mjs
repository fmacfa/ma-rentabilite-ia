// Le tableau Markdown est aussi le registre utilisé dans GitHub Actions.
import { appendFile, readFile } from "node:fs/promises";

const fichier = new URL("../docs/veille-fiscale.md", import.meta.url);
const registre = await readFile(fichier, "utf8");
const lignes = registre.split("\n").filter(l => l.startsWith("| ["));
if (!lignes.length) throw new Error("Le registre ne contient aucune source.");

function texteVisible(html) {
  return html.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]*>/g, " ").replace(/&(?:nbsp|thinsp|nnbsp);/gi, " ").replace(/&euro;/gi, "€")
    .replace(/&#(x[0-9a-f]+|\d+);/gi, (entite, code) => {
      const n = code[0].toLowerCase() === "x" ? parseInt(code.slice(1), 16) : Number(code);
      return n <= 0x10ffff ? String.fromCodePoint(n) : entite;
    }).normalize("NFKC").replace(/\s+/g, " ").trim();
}

async function verifier(ligne) {
  const [source, date, reperes, impacts] = ligne.slice(1, -1).split("|").map(c => c.trim());
  const lien = /^\[([^\]]+)\]\((https:\/\/[^)]+)\)$/.exec(source);
  if (!lien || !date || !reperes || !impacts) throw new Error("Ligne de registre invalide " + ligne);
  const baseGit = "https://github.com/fmacfa/ma-rentabilite-ia/blob/main/docs/";
  const references = impacts.replace(/\]\(([^)]+)\)/g, (_, chemin) => "](" + new URL(chemin, baseGit).href + ")");
  let visible;
  try {
    const res = await fetch(lien[2], { signal: AbortSignal.timeout(25_000) });
    if (!res.ok) throw new Error("HTTP " + res.status);
    visible = texteVisible(await res.text());
  } catch (e) {
    return { ok: false, ligne: [source, "Source inaccessible (" + e.message + ")", references] };
  }
  const version = visible.match(/(?:modifié le|vérifié le) (\d{2}\/\d{2}\/\d{4}|\d{1,2} [\p{L}]+ \d{4})/iu)?.[1];
  const manquants = reperes.split(" · ").filter(rep => !visible.includes(rep));
  const constats = [];
  if (!version) constats.push("Date de l’éditeur introuvable");
  else if (version !== date) constats.push("Nouvelle version du " + version + " (registre du " + date + ")");
  if (manquants.length) constats.push("Repères à relire (" + manquants.join(", ") + ")");
  return { ok: constats.length === 0, ligne: [source, constats.join(". ") || "Date et repères retrouvés", references] };
}

const controles = [];
for (const ligne of lignes) {
  let controle = await verifier(ligne);
  if (controle.ligne[1].startsWith("Source inaccessible")) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    controle = await verifier(ligne);
  }
  controles.push(controle);
}
const rapport = ["## Veille des sources fiscales", "", "| Source | Résultat | Calculs et exemples concernés |",
  "| --- | --- | --- |", ...controles.map(c => "| " + c.ligne.join(" | ") + " |"), ""].join("\n");
console.log(rapport);
if (process.env.GITHUB_STEP_SUMMARY) await appendFile(process.env.GITHUB_STEP_SUMMARY, rapport);
if (controles.some(c => !c.ok)) process.exitCode = 1;
