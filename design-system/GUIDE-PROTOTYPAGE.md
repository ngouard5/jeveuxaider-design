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
`design-system/prototype-starter.html` charge les deux feuilles DSFR via
`@import ... layer(...)` dans deux cascade layers distincts, DANS CET ORDRE :

```css
@import url("../design-system/dsfr.min.css") layer(dsfr-base);
@import url("../design-system/compiled.css") layer(dsfr-utilitaires);
```

Tout le CSS du prototype écrit après reste hors de toute couche. Règle des
cascade layers CSS : une règle non assignée à une couche gagne TOUJOURS
contre une règle qui l'est, quelle que soit sa spécificité ; et entre deux
couches, celle déclarée en second (ici `dsfr-utilitaires`) gagne toujours sur
la première (`dsfr-base`), là aussi indépendamment de la spécificité. Ça
reproduit la hiérarchie `base < utilities` d'un vrai build Tailwind, que le
bundle figé `compiled.css`/`dsfr.min.css` ne conserve plus une fois exporté
du build réel.

Résultat concret : plus besoin d'ID ou de classes doublées pour qu'un hover
personnalisé gagne — une simple `.ma-classe:hover{...}` suffit toujours.

Un cas reste à traiter à la main : un vrai bouton `DsfrButton.vue` est un
`<button>` en production (jamais concerné par `[href]`) et ne devient un
`<a href>` que pour la navigation. Un prototype statique rend souvent CES
boutons en `<a href="#">` pour simuler des liens de navigation, ce qui les
expose quand même au soulignement `[href]` de base. Le starter neutralise
déjà ça via `a.font-medium.transition-extended{background-image:none}`
(ces deux classes sont présentes sur tous les vrais boutons DsfrButton.vue).
Pour un titre de carte en stretched-link (`CardMission`, `CardArticleLight`),
ajoutez `background-image:none` explicitement à côté du `text-decoration:none`
habituel.

## Avant de committer

1. `python3 design-system/outils/checktags.py votre-prototype.html` —
   équilibrage des balises. Piège connu : un tag auto-fermant écrit
   `<img ... />` déclenche une fausse erreur ("stray closing `</img>`") à
   cause d'une particularité de `html.parser.HTMLParser` (`handle_startendtag`
   n'est pas surchargé). Écrivez toujours les balises void sans `/>` final
   (`<img ...>`), comme partout ailleurs dans ce dépôt.
2. `python3 design-system/outils/audit-classes.py votre-prototype.html` —
   aucune classe utilitaire non vérifiée.
3. Un passage Playwright qui **hover réellement** chaque élément interactif
   (bouton, tag, carte) et lit `getComputedStyle` avant/après — pas juste un
   screenshot statique. C'est précisément ce qui a laissé passer les bugs de
   hover à plusieurs reprises : un screenshot à l'état repos ne les montre
   pas.
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

## État de la migration

Tous les fichiers du dépôt utilisent désormais le pattern cascade layers
(plus aucun `<link>` vers compiled.css/dsfr.min.css, plus aucune astuce de
spécificité au cas par cas). Les cinq fichiers qui portaient encore les
anciens correctifs (`prototypes/verification-code.html`,
`prototypes/inscription-benevole-etape-1.html`,
`design-system/composants/dsfrbutton.html`,
`design-system/composants/buttoncreateuseralert.html`,
`design-system/composants/dsfriconbutton.html`) ont été migrés. Tout nouveau
prototype doit repartir de `prototype-starter.html`, qui a le pattern déjà en
place.
