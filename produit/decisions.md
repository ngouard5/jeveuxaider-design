# Décisions de conception

Arbitrages pris par l'équipe design, à appliquer dans les prototypes, la doc
et les propositions. Une décision ici prime sur le rendu actuel de la prod
quand les deux divergent : le prototype montre la cible, la doc du composant
signale l'écart avec la prod.

Format : date — décision. Pourquoi. Où elle s'applique.

## Vocabulaire

**06/10/2026 — « Participation », jamais « candidature », y compris côté
bénévole.** C'est le terme du produit, des deux côtés de la mise en relation.
S'applique à tout texte d'interface. Voir aussi le lexique de
[`redaction.md`](redaction.md).

## Bénévoles

**06/10/2026 — Ne pas mettre en avant l'annulation d'une participation.** Pas
de lien « Annuler » sur les cartes de participation du tableau de bord. La
carte mène à la messagerie de la participation ; c'est depuis la messagerie
que le bénévole peut écrire à l'organisation et, s'il le faut, annuler.
Exemple : `prototypes/tableau-de-bord-benevole.html`.

**06/10/2026 — Une carte cliquable se signale au repos, pas seulement au
survol.** Chevron › à droite (le même que les lignes « Actions en attente »),
ombre et titre souligné au survol, toute la carte cliquable. Le vrai
`CardParticipationBenevole.vue` ne signale le clic qu'au survol, invisible sur
mobile. Exemple : `prototypes/tableau-de-bord-benevole.html`.

## Statuts

**22/09/2026 — `Terminée` s'affiche en bleu info, comme `Brouillon`.** Aligné
sur Figma. En prod, `Terminée` tombe encore dans le badge rose par défaut (pas
de `case` dans `components/ui/BadgeState.vue`) ; le correctif reste à faire
côté app. Voir `design-system/composants/uibadgestate.html` et
`prototypes/missions-responsable.html`.
