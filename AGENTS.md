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
3. Partir de **[`design-system/_prototype-starter.html`](design-system/_prototype-starter.html)**
   pour tout nouveau prototype (il contient déjà le correctif cascade layers).
4. Composants déjà documentés : **[`design-system/index.html`](design-system/index.html)**
   (164 composants réutilisables) — toujours vérifier si un composant existe
   déjà avant d'en improviser un.
