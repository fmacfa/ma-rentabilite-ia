"""Génère le paquet des modules locaux. --check en vérifie la synchronisation."""
import argparse
import json
from pathlib import Path

DOSSIER = Path(__file__).resolve().parent
RACINE = DOSSIER.parents[1]
VERSION = "3.14.3"


def paquet_sources():
    modules = {}
    for chemin in sorted((RACINE / "moteur").glob("*.py")):
        paquet = chemin.stem == "__init__"
        nom = "moteur" if paquet else f"moteur.{chemin.stem}"
        entree = [".py", chemin.read_text(encoding="utf-8"), []]
        if paquet:
            entree.append(1)
        modules[nom] = entree
    contenu = json.dumps(modules, ensure_ascii=False, indent=2)
    return "// Modules générés à partir des sources du dossier moteur/.\n__BRYTHON__.loadBrythonPackage(" + contenu + ");\n"


def runtime_brython():
    # Cette dépendance ne concerne que la fabrication initiale de l'asset.
    from importlib import resources, metadata

    if metadata.version("brython") != VERSION:
        raise SystemExit(f"La version de fabrication attendue de Brython est {VERSION}.")
    data = resources.files("brython").joinpath("data")
    runtime = data.joinpath("brython.js").read_text(encoding="utf-8")
    standard = data.joinpath("brython_stdlib.js").read_text(encoding="utf-8")
    source = standard.split("var scripts = ", 1)[1].split("\n__BRYTHON__.update_VFS(scripts)", 1)[0]
    math = json.loads(source)["math"]
    # Le moteur partagé importe seulement math. browser et javascript sont des modules natifs.
    return (runtime + "\n// Module math de la même version de la bibliothèque Brython.\n"
            + "__BRYTHON__.loadBrythonPackage(" + json.dumps({"math": math}, ensure_ascii=False) + ");\n")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="Signaler les modules périmés.")
    parser.add_argument("--runtime", action="store_true", help="Recréer également le runtime tiers épinglé.")
    opts = parser.parse_args()
    assets = {DOSSIER / "modules.js": paquet_sources()}
    if opts.runtime:
        assets[DOSSIER / f"brython-{VERSION}.js"] = runtime_brython()
    for cible, contenu in assets.items():
        if opts.check:
            if not cible.is_file() or cible.read_text(encoding="utf-8") != contenu:
                raise SystemExit(f"Le paquet navigateur doit être régénéré : {cible.name}")
        else:
            cible.write_text(contenu, encoding="utf-8")


if __name__ == "__main__":
    main()
