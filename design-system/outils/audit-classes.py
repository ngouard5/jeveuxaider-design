"""
Vérifie qu'un prototype HTML n'utilise aucune classe utilitaire absente du
bundle réel (compiled.css + dsfr.min.css). Contexte : compiled.css n'est PAS
un build Tailwind complet, c'est un export PARTIEL ne contenant que les
classes déjà utilisées par les quelques fichiers réels déjà extraits dans ce
dépôt. Toute classe utilitaire "plausible" (ex. un breakpoint responsive
inédit, une combinaison d'espacement jamais vue) peut donc être absente même
si elle existe dans le vrai design system — d'où ce script, à faire tourner
sur chaque nouveau prototype avant de le considérer fini.

Toute classe listée comme "manquante" doit être :
  (a) une classe que VOUS avez définie vous-même dans le <style> du prototype
      (CSS custom documenté, cf. GUIDE-PROTOTYPAGE.md) — attendu, pas un bug ;
  (b) sinon, une vraie classe absente du bundle partiel : soit vous
      reproduisez sa valeur réelle à la main (voir comment les couleurs
      jva-orange/domaines sont faites dans les prototypes existants), soit
      vous évitez cette classe.

Usage : python3 audit-classes.py <fichier.html> [<fichier2.html> ...]
"""
import re
import sys
import os

def escape_class(c: str) -> str:
    out = []
    for ch in c:
        if ch in r':[]#().%/,':
            out.append('\\' + ch)
        else:
            out.append(ch)
    return ''.join(out)

def find_repo_root(start: str) -> str:
    d = os.path.abspath(start)
    while d != '/':
        if os.path.isdir(os.path.join(d, 'design-system')):
            return d
        d = os.path.dirname(d)
    raise SystemExit("Impossible de localiser le dossier design-system/ (repo root) à partir de " + start)

def main():
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)

    for html_path in sys.argv[1:]:
        repo_root = find_repo_root(os.path.dirname(os.path.abspath(html_path)) or '.')
        css_paths = [
            os.path.join(repo_root, 'design-system', 'compiled.css'),
            os.path.join(repo_root, 'design-system', 'dsfr.min.css'),
        ]

        html = open(html_path, encoding='utf-8').read()
        classes = set()
        for m in re.finditer(r'class="([^"]*)"', html):
            for c in m.group(1).split():
                classes.add(c)

        css = ""
        for p in css_paths:
            if os.path.exists(p):
                css += open(p, encoding='utf-8').read()

        missing = []
        for c in sorted(classes):
            sel = '.' + escape_class(c)
            if sel not in css:
                missing.append(c)

        print(f"=== {html_path} ===")
        print(f"  Classes trouvées : {len(classes)}  |  Absentes du bundle réel : {len(missing)}")
        for c in missing:
            print("   -", c)

if __name__ == '__main__':
    main()
