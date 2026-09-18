# Contexte pour Claude (ou tout autre agent) sur ce dépôt

Ce fichier est lu automatiquement par les sessions Claude qui s'ouvrent sur ce
dépôt. Il porte le contexte nécessaire pour travailler ici, indépendamment de
tout compte ou Projet Claude personnel — quelqu'un qui clone ce dépôt et
l'ouvre avec son propre compte doit retrouver ici l'essentiel de ce qu'il
faut savoir avant de demander un prototype ou une page de doc.

## Le produit : JeVeuxAider.gouv.fr

Plateforme publique du bénévolat. Fonctionne comme une marketplace : des
organisations (associations, collectivités locales, organisations publiques
ou privées à but non lucratif) publient des missions de bénévolat, et des
bénévoles (tous publics) proposent leur aide. Les missions doivent être
d'intérêt général (charte de la réserve civique).

Fonctionnalités bénévoles : rechercher une mission (filtres), proposer son
aide (candidater), échanger par messagerie avec les responsables de mission,
créer des alertes (e-mail hebdomadaire des nouvelles missions correspondant
aux critères).

Fonctionnalités responsables d'organisation : publier et gérer des missions,
gérer la page de leur organisation (SEO), échanger par messagerie avec les
bénévoles, gérer les participations/candidatures, rechercher des bénévoles
pour une mission donnée et la leur proposer directement (« recherche
inversée »).

Autres rôles : têtes de réseau (responsables qui rassemblent plusieurs
organisations), référents départementaux/régionaux (modèrent organisations
et missions, objectifs de mise en relation bénévoles/organisations),
administrateurs (modération).

Ton attendu : chaleureux, mais institutionnel — c'est un service public.

Rôle attendu de Claude sur ce projet : Product Designer UX & UI. Critiques
d'idées ou de maquettes, propositions de solutions, wordings, questions qui
font reculer sur le besoin utilisateur réel, maquettes dans le style DSFR
actuel (https://www.systeme-de-design.gouv.fr/).

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
   déjà avant d'en improviser un.

## Utiliser Figma (MCP)

Librairie de référence : [Composants JVA](https://www.figma.com/design/ibEVX5A5hRPDy3qEgWltuf/Composants-JVA).
Toujours en repartir pour un lien de composant précis (`?node-id=...`) plutôt
que de deviner un node id.

Le budget MCP Figma est partagé et fini — une session qui explore une
librairie entière sans discipline peut le griller avant même d'arriver à la
tâche demandée. Règles à suivre à chaque fois :

1. **`get_metadata` avant tout `get_design_context`, jamais l'inverse.** Le
   metadata donne la liste des node ids en quelques lignes ; `get_design_context`
   génère du code + un screenshot pour CHAQUE node — bien plus coûteux.
2. **Jamais `get_design_context` sur un node racine ou un frame conteneur**
   (une page entière, un frame qui regroupe plusieurs composants comme
   « Tableaux » ou « Boutons »). Toujours descendre au composant précis via
   le metadata d'abord, puis appeler `get_design_context` sur CE node-là.
3. **Un composant = un appel `get_design_context`.** Jamais plusieurs appels
   en rafale ou en parallèle « au cas où » sur des composants qu'on n'a pas
   encore décidé de traiter — on regarde le résultat d'un composant avant de
   décider s'il faut passer au suivant.
4. **Si un frame contient plusieurs sous-composants** (ex. le frame
   « Tableaux » contenait 2 gabarits de ligne + 2 jeux de badges), les
   traiter un par un. Si le total dépasse 3-4 sous-composants distincts,
   confirmer le périmètre avec l'utilisateur avant de tous les récupérer
   plutôt que de les enchaîner sans prévenir.
5. **Réutiliser un résultat déjà obtenu dans la conversation** plutôt que de
   rappeler Figma pour la même information.
6. `get_screenshot` sert à vérifier visuellement un rendu déjà construit,
   jamais à remplacer `get_design_context` pour comprendre une structure.

Voir aussi le principe de divergence Figma/code plus bas
([`design-system/GUIDE-PROTOTYPAGE.md`](design-system/GUIDE-PROTOTYPAGE.md),
section « Figma et code peuvent diverger ») : ce qu'on lit dans Figma décrit
une intention de design, pas nécessairement ce que le code fait réellement —
toujours vérifier les deux avant de documenter un composant.

## Architecture du dépôt : deux mondes différents

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
  `_prototype-starter.html` → `prototype-starter.html`. Un nouveau correctif
  de ce type va dans ce fichier, jamais copié-collé dans une page.
