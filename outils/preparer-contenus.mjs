// Les exemples restent utilisables dans une copie locale de l’outil PDF.
import { readFile, readdir, writeFile } from "node:fs/promises";
const racine = new URL("../", import.meta.url);
const exemples = {};
for (const nom of (await readdir(new URL("exemples/", racine))).sort()) {
  if (nom.endsWith(".json"))
    exemples[nom.slice(0, -5)] = JSON.parse(
      await readFile(new URL("exemples/" + nom, racine), "utf8"),
    );
}
await writeFile(
  new URL("web/contenus.js", racine),
  "/* Généré depuis exemples/*.json. */\nwindow.RentaContenus = " +
    JSON.stringify({ exemples }, null, 2) +
    ";\n",
);
