source "https://rubygems.org"

# Le gem "github-pages" fige Jekyll 3.9 / Liquid 4.0 pour matcher exactement
# l'infra GitHub Pages — mais cette combo appelle `String#tainted?`, retiré
# de Ruby en 3.2+ (on est en Ruby 4.x ici) : impossible à builder tel quel.
# On utilise donc Jekyll moderne en local (le rendu est identique pour ce
# site : pas de plugin Pages exotique, juste includes/layouts/Liquid basique).
gem "jekyll"
gem "webrick"
