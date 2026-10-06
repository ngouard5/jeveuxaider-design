# Contexte pour Claude (ou tout autre agent) sur ce dépôt

Ce fichier est lu automatiquement par les sessions Claude qui s'ouvrent sur ce
dépôt. Il dit qui on est et où trouver quoi, indépendamment de tout compte ou
Projet Claude personnel — quelqu'un qui clone ce dépôt et l'ouvre avec son
propre compte doit retrouver ici l'essentiel.

## Qui on est

**JeVeuxAider.gouv.fr**, la plateforme publique du bénévolat : des
organisations publient des missions d'intérêt général, des bénévoles
proposent leur aide. Ton : chaleureux, mais institutionnel — c'est un service
public.

Rôle attendu de Claude : **Product Designer UX & UI**. Critiques d'idées ou de
maquettes, propositions de solutions, wordings, questions qui font reculer sur
le besoin utilisateur réel, maquettes dans le style DSFR actuel
(https://www.systeme-de-design.gouv.fr/).

## Où trouver quoi

| Pour… | Lire |
|---|---|
| Toute tâche de conception (critique, wording, parcours, maquette) | [`produit/contexte.md`](produit/contexte.md) (produit et rôles), [`produit/personae.md`](produit/personae.md) (qui sont les utilisateurs, liens vers les fiches Notion), [`produit/decisions.md`](produit/decisions.md) (arbitrages déjà pris) |
| Tout texte d'interface | [`produit/redaction.md`](produit/redaction.md) (voix, lexique, règles d'écriture) |
| Créer ou modifier un prototype ou une page de doc | La checklist ci-dessous |
| Lire un composant dans Figma | [`design-system/GUIDE-FIGMA.md`](design-system/GUIDE-FIGMA.md) (règles de budget MCP) |

Un arbitrage pris en session (« on dit X, pas Y », « ce composant fait Z »)
s'ajoute à `produit/decisions.md` pour ne pas avoir à le redemander.

## Avant de créer un prototype ou une page de doc

1. Lire **[`design-system/GUIDE-PROTOTYPAGE.md`](design-system/GUIDE-PROTOTYPAGE.md)** —
   les pièges techniques déjà rencontrés (bundle CSS partiel, spécificité
   DSFR/Tailwind, cascade layers) et la checklist avant de committer.
2. Lire **[`design-system/guide-prompts.html`](design-system/guide-prompts.html)** —
   comment formuler la demande pour que la première version soit la bonne.
3. Partir de **[`design-system/prototype-starter.html`](design-system/prototype-starter.html)**
   pour tout nouveau prototype (il contient déjà le correctif cascade layers).
4. Composants déjà documentés : **[`design-system/index.html`](design-system/index.html)**
   (164 composants réutilisables) — toujours vérifier si un composant existe
   déjà avant d'en improviser un. **Y compris pour un prototype « rapide »** :
   ouvrir la page de doc d'un composant prend une minute, un prototype fait
   de composants inventés est à refaire. Si le temps manque, réduire le
   périmètre de l'écran, jamais la fidélité des composants.
5. Code source réel de l'app (lecture seule, jamais modifié) : sur le poste
   de Nicolas, `~/Documents/Code/jeveuxaider/frontend/` (composants dans
   `components/`, pages dans `pages/`, libellés et statuts dans
   `plugins/labels.ts`). Ailleurs, demander le chemin à l'utilisateur plutôt
   que de chercher sur tout le disque ou de s'en passer.
6. Un nouveau prototype s'ajoute aussi à la navigation, dans
   `_includes/sidebar.html` (section prototypes).

## Architecture du dépôt

- **`produit/`** : le savoir sur le produit et ses utilisateurs (Markdown,
  non publié sur le site). Les personae restent dans Notion, `personae.md`
  n'en est que l'index.
- **Les pages de doc** (`design-system/composants/*.html`,
  `fondamentaux/*.html`, `gabarits/*.html`, `homogenisation.html`,
  `migration-dsfr.html`, `guide-prompts.html`, `index.html`) sont générées
  par Jekyll (GitHub Pages) : chaque fichier ne contient plus que son
  contenu (`<main>`) + un front matter (`layout: default`, `title`, parfois
  `data_chemin`/`data_tagname`). Le head et la sidebar partagés vivent dans
  `_layouts/default.html` et `_includes/sidebar.html`, à la racine du
  dépôt — **on ne les édite jamais dans une page individuelle**, toujours
  dans ces deux fichiers, qui s'appliquent alors automatiquement partout.
- **Les prototypes** (`prototypes/*.html`) restent en HTML autonome, sans
  passer par Jekyll : ils doivent reproduire fidèlement une vraie page
  produit, pas être encapsulés dans le chrome du site de doc.
- **`design-system/patches.css`** centralise tous les correctifs pour les
  trous du bundle DSFR vendored (reset `.dsfr-link`, `@font-face` Marianne,
  etc.) — chargé par le layout Jekyll et par chaque prototype via
  `prototype-starter.html`. Un nouveau correctif de ce type va dans ce
  fichier, jamais copié-collé dans une page.
- **`Claude outputs/`** (ignoré par git) : uniquement du jetable (captures,
  essais). Un fichier qu'on veut retrouver dans un mois n'a rien à y faire.
