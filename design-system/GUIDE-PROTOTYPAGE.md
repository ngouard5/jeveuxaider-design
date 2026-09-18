# Guide de prototypage — design-system JVA

Ce document explique comment produire des prototypes HTML fidèles au design
system réel de JeVeuxAider.gouv.fr (DSFR + composants Vue maison), pour que
n'importe quel prototype généré en promptant réutilise correctement ce qui
est déjà documenté dans `design-system/composants/` plutôt que d'improviser.

Écrit après plusieurs allers-retours sur `prototypes/homepage.html` où les
mêmes catégories de bugs sont apparues : composants inventés, hovers cassés,
soulignements parasites. Ce guide capitalise ces apprentissages pour que les
prochains prototypes ne les répètent pas.

Voir aussi : [`AGENTS.md`](../AGENTS.md) (contexte produit JeVeuxAider) et
[`guide-prompts.html`](guide-prompts.html) (comment formuler la demande).

## Démarrer un nouveau prototype

Copiez `design-system/prototype-starter.html` comme point de départ plutôt
que de repartir d'un `<head>` vide ou de copier un ancien prototype au
hasard — il contient déjà la base qui évite les deux bugs les plus
récurrents (voir plus bas). Renommez le `<title>`, videz le `<main>`, gardez
le reste du `<head>` tel quel.

## Principe : composants réels, pas inventés

Avant d'écrire le markup d'un bouton, d'une carte, d'un tag, etc. :

1. Un doc page existe déjà dans `design-system/composants/` → repartez de sa
   structure et de ses classes.
2. Sinon, lisez le composant Vue source réel dans `jeveuxaider/frontend/`
   (lecture seule — ne jamais modifier ni copier tel quel dans ce dépôt) et
   reproduisez sa structure ET ses valeurs exactes (classes Tailwind quand
   elles existent dans le bundle, valeurs hex/px reproduites à la main
   sinon). Documentez la source dans un commentaire CSS/HTML à côté.
3. N'inventez jamais un pattern "qui ressemble" (une carte, un dégradé de
   couleurs, un hover) sans vérifier qu'il existe réellement quelque part.
   C'est le retour le plus direct reçu sur ce dépôt : *"tu as inventé des
   composants"*.

## Piège n°1 : compiled.css est un bundle PARTIEL

`design-system/compiled.css` n'est pas un export Tailwind complet : il ne
contient que les classes déjà utilisées par les quelques fichiers réels déjà
extraits dans ce dépôt. Une classe utilitaire plausible (un breakpoint
inédit, une combinaison d'espacement jamais vue ailleurs) peut très bien ne
pas y être, même si elle existe dans le vrai design system.

→ Avant de committer un prototype, faites tourner :
```
python3 design-system/outils/audit-classes.py votre-prototype.html
```
Toute classe listée comme "absente" doit être soit une classe que vous avez
vous-même définie dans le `<style>` du prototype (attendu, documentez-la),
soit reproduite à la main si c'est une vraie classe DSFR/Tailwind manquante.

Pour la mise en page propre au prototype (pas de vrais composants : grilles,
espacements, tailles de titres), écrivez du CSS simple avec vos propres
breakpoints (alignés sur ceux de dsfr.min.css : 640/768/1024/1348px) plutôt
que de deviner des classes absentes du bundle.

## Piège n°2 : la base DSFR bat parfois nos classes utilitaires

`dsfr.min.css` applique des styles de base génériques à tout élément
`[href]` :
- un soulignement permanent (`background-image` en dégradé, visible même au
  repos, pas juste au survol) ;
- un hover générique : `a[href]:hover, button:not(:disabled):hover{...}`.

Le problème : ces règles génériques ont parfois une spécificité CSS
supérieure à nos classes utilitaires ciblées (`.hover\:bg-jva-blue-800:hover`,
`.ma-classe:hover`), qui perdent alors silencieusement. C'est ce qui a cassé
à plusieurs reprises sur ce dépôt : le hover des boutons bleus, puis un
soulignement parasite sous les titres de cartes et sous les boutons eux-mêmes
(bordure blanche visible au repos).

**Le correctif à ne plus refaire au cas par cas** (id, classes doublées...) :
`design-system/prototype-starter.html` charge les feuilles DSFR via
`@import ... layer(...)` dans des cascade layers distincts, DANS CET ORDRE :

```css
@import url("../design-system/compiled-reset.css") layer(tailwind-reset);
@import url("../design-system/dsfr.min.css") layer(dsfr-base);
@import url("../design-system/compiled.css") layer(dsfr-utilitaires);
@import url("../design-system/patches.css") layer(site-patches);
```

La dernière couche, `patches.css`, centralise les correctifs pour les trous
du bundle DSFR (reset `.dsfr-link`, `@font-face` Marianne, etc.) — voir
`design-system/patches.css` pour le détail. Un nouveau correctif de ce type
va dans ce fichier, jamais copié-collé dans une page.

Tout le CSS du prototype écrit après reste hors de toute couche. Règle des
cascade layers CSS : une règle non assignée à une couche gagne TOUJOURS
contre une règle qui l'est, quelle que soit sa spécificité ; et entre deux
couches, celle déclarée en dernier gagne toujours sur les précédentes, là
aussi indépendamment de la spécificité. Ça reproduit la hiérarchie
`base < components < utilities` d'un vrai build Tailwind, que le bundle figé
`compiled.css`/`dsfr.min.css` ne conserve plus une fois exporté du build réel.

`compiled-reset.css` est le préflight Tailwind générique (reset de
`button`/`input`/`table`/`ul`...) qui vivait à l'origine en tête de
`compiled.css`. Il doit rester dans sa PROPRE couche, placée AVANT
`dsfr-base` : sinon (ancien état de ce dépôt) il gagne contre les vrais
composants DSFR par le même mécanisme de couches — `.fr-tabs__tab`,
`.fr-btn`, etc. perdent alors tout leur style visuel (padding, couleur de
fond...) malgré une spécificité supérieure. C'est le bug qui a fait
apparaître des onglets (`fr-tabs`) sans aucun style DSFR. `compiled.css` ne
contient plus que les classes utilitaires (celles qui doivent battre
`dsfr-base`, notamment les `:hover`) ; le préflight en a été retiré.

Résultat concret : plus besoin d'ID ou de classes doublées pour qu'un hover
personnalisé gagne — une simple `.ma-classe:hover{...}` suffit toujours — et
les vrais composants DSFR gardent leur style.

Un cas reste à traiter à la main : un vrai bouton `DsfrButton.vue` est un
`<button>` en production (jamais concerné par `[href]`) et ne devient un
`<a href>` que pour la navigation. Un prototype statique rend souvent CES
boutons en `<a href="#">` pour simuler des liens de navigation, ce qui les
expose quand même au soulignement `[href]` de base. Ce correctif vit dans `design-system/patches.css`
(`a.font-medium.transition-extended{background-image:none}` — ces deux
classes sont présentes sur tous les vrais boutons DsfrButton.vue), chargé
par le starter : rien à recopier.
Pour un titre de carte en stretched-link (`CardMission`, `CardArticleLight`),
ajoutez `background-image:none` explicitement à côté du `text-decoration:none`
habituel.

## Piège n°3 : couleurs en dur = dark mode cassé

Tout prototype charge déjà le mécanisme de theming DSFR (`data-fr-theme`
posé en `<script>` dans le `<head>`, cf. `prototype-starter.html`) et
`dsfr.min.css` redéfinit ses variables sémantiques pour `[data-fr-theme=dark]`.
Mais ce mécanisme ne sert à rien si le CSS du prototype utilise des couleurs
en dur (`color:#161616`, `background:#fff`, classes Tailwind à valeur figée
comme `bg-jva-blue-500`) au lieu des variables DSFR (`var(--text-title-grey)`,
`var(--background-default-grey)`, `var(--background-action-high-blue-france)`,
etc.) : une valeur figée reste identique quel que soit le thème, donc la page
a beau détecter le dark mode, rien ne change visuellement (bug vécu sur
`inscription-benevole-etape-1.html`, resté 100% clair sous
`prefers-color-scheme: dark` jusqu'à correction).

**La règle** : pour tout texte, fond, bordure ou icône dont la couleur doit
suivre le thème, utilisez la variable sémantique DSFR correspondante plutôt
qu'un hex recopié à la main. Table de correspondance des couleurs les plus
fréquentes dans ce dépôt (valeur claire → variable ; la valeur sombre est
automatique) :

| Usage | Hex vu dans les prototypes | Variable DSFR |
|---|---|---|
| Fond de page | `#fff` | `var(--background-default-grey)` |
| Titre / label | `#161616` | `var(--text-title-grey)` |
| Texte secondaire / muted | `#666` | `var(--text-mention-grey)` |
| Soulignement de champ | `#3A3A3A` | `var(--border-plain-grey)` |
| Fond de champ de saisie | `#EEEEEE` | `var(--background-contrast-grey)` |
| Texte / icône d'erreur | `#CE0500`, `#E2011C` | `var(--text-default-error)` |
| Texte / icône de succès | `#18753C` | `var(--text-default-success)` |
| Fond de bandeau succès | `#B8FEC9` | `var(--background-contrast-success)` |
| Lien / action bleu France | `#000091` | `var(--text-action-high-blue-france)` |

**Cas du bouton d'action principal (CTA)** : ne PAS utiliser les classes
`bg-jva-blue-500`/`hover:bg-jva-blue-800`/`active:bg-jva-blue-900` avec
`text-white` — ce sont des couleurs de marque figées (bundle Tailwind
partiel, `compiled.css`), volontairement fixes sur les pages qui doivent
reproduire une couleur de marque exacte, mais donc illisibles dès qu'on
force un fond clair en dark mode via une variable. Pour un vrai bouton
d'action haute emphase adaptatif, utilisez plutôt :
`background-color:var(--background-action-high-blue-france)` (+ `-hover` /
`-active` au survol/clic) **et** `color:var(--text-inverted-blue-france)`
pour le texte. Les deux vont ensemble : en dark mode, DSFR éclaircit le fond
(bleu → violet clair) ET assombrit le texte en retour (blanc → bleu marine)
— changer l'un sans l'autre rend le bouton illisible dans un des deux
thèmes. Si vous ne changez que le fond, vous recréez ce bug.

Pour vérifier qu'aucune couleur en dur n'a été oubliée : comparer un
screenshot Playwright pris avec `color_scheme="light"` puis `"dark"` (voir
étape 3 d'« Avant de committer ») — toute zone identique dans les deux
captures qui ne devrait pas l'être (texte, fond, bouton) pointe vers une
couleur figée à remplacer.

## Avant de committer

1. `python3 design-system/outils/checktags.py votre-prototype.html` —
   équilibrage des balises. Piège connu : un tag auto-fermant écrit
   `<img ... />` déclenche une fausse erreur ("stray closing `</img>`") à
   cause d'une particularité de `html.parser.HTMLParser` (`handle_startendtag`
   n'est pas surchargé). Écrivez toujours les balises void sans `/>` final
   (`<img ...>`), comme partout ailleurs dans ce dépôt. Autre faux positif
   connu, cette fois sur `_layouts/default.html` uniquement : le script ne
   comprend pas la syntaxe Liquid (`{% if %}` dans une balise `<body>`) et
   remonte une erreur de balises sans rapport avec le HTML réellement rendu
   — sans impact, vérifiez plutôt le rendu en prod après déploiement.
2. `python3 design-system/outils/audit-classes.py votre-prototype.html` —
   aucune classe utilitaire non vérifiée.
3. Un passage Playwright qui **hover réellement** chaque élément interactif
   (bouton, tag, carte) et lit `getComputedStyle` avant/après — pas juste un
   screenshot statique. C'est précisément ce qui a laissé passer les bugs de
   hover à plusieurs reprises : un screenshot à l'état repos ne les montre
   pas. Répétez ce passage avec `color_scheme="light"` PUIS `"dark"` (voir
   Piège n°3) : un élément identique dans les deux captures qui ne devrait
   pas l'être trahit une couleur en dur.
4. Propager au device avec `device_commit_files`, puis **vérifier le md5sum
   des deux côtés** avant de committer — un `device_commit_files` peut
   répondre "written" sans que le contenu ait réellement changé côté device
   (observé sur ce dépôt) ; si les checksums ne correspondent pas, relancer
   avec `force: true` et revérifier.
5. Si `git commit`/`git status` échoue avec une erreur `index.lock` ou
   `HEAD.lock` déjà existant alors qu'aucun autre processus git ne tourne
   (`ps aux | grep git`), c'est un lock résiduel d'une commande précédente,
   pas une vraie collision : supprimez les fichiers `*.lock` sous `.git/`
   (et les `tmp_obj_*` sous `.git/objects/` si présents) puis recommittez.
   Sur ce dépôt, ça demande la permission de suppression sur le dossier
   connecté (observé et débloqué plusieurs fois).

## Éditer une page de doc existante (composants, fondamentaux, gabarits, ressources)

Ce guide, jusqu'ici, parle de créer un nouveau *prototype*. Pour modifier une
page de *documentation* existante (`design-system/composants/*.html`,
`fondamentaux/*.html`, `gabarits/*.html`, `homogenisation.html`,
`migration-dsfr.html`, `guide-prompts.html`, `index.html`), c'est différent :
ces pages sont générées par Jekyll (GitHub Pages les build automatiquement).

- Le fichier d'une page de doc ne contient **que son contenu propre** (ce qui
  était avant dans `<main>`) + un court front matter en tête
  (`layout: default`, `title: "..."`, parfois `data_chemin`/`data_tagname`).
  Éditez ce contenu normalement.
- Le `<head>` et la sidebar de navigation, eux, sont **partagés par toutes
  les pages** et vivent dans deux fichiers à la racine du dépôt :
  `_layouts/default.html` (head, CSS de mise en page commune) et
  `_includes/sidebar.html` (menu). **Ne jamais recopier un changement de
  menu ou de tête de page dans un fichier individuel** — toujours éditer ces
  deux fichiers, le changement s'applique alors automatiquement aux 180
  pages concernées. C'est tout le sens de ce refacto : avant, une correction
  de sidebar oubliée sur 165 pages sur 166 est passée inaperçue plusieurs
  jours (voir `claude/plan-refacto-design-system.md` sur le Project Claude).
- Un nouveau correctif pour un trou du bundle DSFR (dans le style de
  `.fr-stepper__state{display:block}`) va dans `design-system/patches.css`,
  jamais dans le `<style>` d'une page.

## État de la migration

Toutes les pages de doc du design-system (180 : composants, fondamentaux,
gabarits, ressources, vue d'ensemble) sont générées par le layout Jekyll
partagé (`_layouts/default.html` + `_includes/sidebar.html`) — plus aucun
head ni sidebar dupliqué page par page. `design-system/patches.css`
centralise les correctifs pour les trous du bundle DSFR (reset `.dsfr-link`,
`@font-face` Marianne, `background-image:none`, `.fr-stepper__state`).

Les prototypes (`prototypes/*.html`) et `prototype-starter.html` restent en
HTML autonome par choix (ils doivent reproduire fidèlement une page produit,
pas le chrome du site de doc), mais chargent tous `patches.css` en 3e
cascade layer. Tout nouveau prototype doit repartir de
`prototype-starter.html`, qui a le pattern déjà en place.
