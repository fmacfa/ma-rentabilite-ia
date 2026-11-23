// Le guide et les exemples sont également disponibles depuis une copie locale du site.
import { readFile, readdir, writeFile } from "node:fs/promises";
const racine = new URL("../", import.meta.url);
const guide = await readFile(new URL("assistant.md", racine), "utf8");
const exemples = {};
for (const nom of (await readdir(new URL("exemples/", racine))).sort()) {
  if (nom.endsWith(".json"))
    exemples[nom.slice(0, -5)] = JSON.parse(
      await readFile(new URL("exemples/" + nom, racine), "utf8"),
    );
}
await writeFile(
  new URL("web/contenus.js", racine),
  "/* Généré depuis assistant.md et exemples/. */\nwindow.RentaContenus = " +
    JSON.stringify({ guide, exemples }, null, 2) +
    ";\n",
);
