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

## Support et modération

**04/11/2026 — Le bouton qui confirme une action irréversible nomme l'action.**
« Fusionner les doublons » sur la page, « Confirmer la fusion » dans la modale
(Figma, 05/11/2026), jamais « Confirmer » ou « Valider » seul. Exemple :
`prototypes/fusion-doublons-organisations.html`.

**04/11/2026 — Date de création d'une organisation sans l'heure.** « Créée le
4 mars 2021 » : l'heure n'aide pas à départager des doublons. Exemple :
`prototypes/fusion-doublons-organisations.html`.

**04/11/2026, revu le 05/11/2026 — Fusion de doublons : une carte homogène
qui nomme les responsables.** Les référents vont pouvoir fusionner. Ils
doivent avoir l'accord des responsables avant, donc la carte montre leurs
noms, pas un compteur. Carte : numéro, date de création et badges sur la
première ligne, une ligne de tags d'identité (RNA, SIRET, ville, les « NC » en gris
pour repérer ce qui manque), un séparateur, une ligne de tags d'activité
(responsables, missions, participations), y compris dans la liste. Essayé le
05/11/2026 : en-tête sur une ligne et activité en texte gris, abandonné. On a
essayé de ne montrer que les différences et d'ajouter un bilan sur la page :
plus difficile à lire, abandonné. Page de fusion (05/11/2026, croquis de
Nicolas) : les organisations à fusionner forment un groupe lié (cartes
reliées par un pont, badge avertissement « À fusionner et désinscrire »), une flèche
porte ce qui est transféré, cumulé en 3 tags quel que soit le nombre
d'organisations (responsables, missions, participations), puis
l'organisation gardée (badge vert « À garder », sans icône pour ne pas le
confondre avec le statut « Validée » ; « Recommandée » reste bleu info, c'est
un conseil, pas une décision). Badge avertissement (orange) plutôt que rouge : le
rouge DSFR dit « erreur », pas « action prévue ». La liste et la modale
« Changer » restent triées par ancienneté (la gardée en premier) : elles
servent à comparer, pas à montrer le mouvement. Le bilan (qui devient
co-responsable, champs complétés) est dans la confirmation. La plus ancienne est gardée par défaut (référencement),
« Changer » reste possible. Exemple :
`prototypes/fusion-doublons-organisations.html`.

**09/11/2026 — Fusion de doublons : « Garder celle-ci » sur chaque doublon,
plus de modale « Changer ».** La page a deux zones l'une au-dessus de
l'autre, titrées par un badge : « Organisations à désinscrire » (badge
rouge — revu le 09/11, remplace l'orange du 05/11 —, zone en pointillé, cartes grises complètes — identité et activité —
avec « Détails » et « Garder celle-ci », sans badge par carte), une flèche,
puis « Organisation à garder » (badge vert, zone blanche bordée de bleu
clair, carte bleu clair, badge « La plus ancienne », conseil de garder la
plus ancienne). Les tags d'activité de la gardée montrent ce qui arrive,
un « + » par responsable ajouté : « Camille P + Léa F + Karim H + Julie M »,
« 13 missions +7 », « 156 participations +99 ». Une seule appellation dans les textes :
« l'organisation gardée ». Ordre : de la plus récente à la plus ancienne,
dans la liste des doublons comme dans la zone « à désinscrire » (remplace
le tri par ancienneté du 05/11). Figma : 2220:14639. La page de confirmation reprend
les deux zones : « Organisations désinscrites » (badge rouge, cartes sans
activité ni bouton) et « Organisation gardée » (badge vert, carte sans
badge avec les totaux après fusion, sans « + ») ; pas de phrase sous les
badges de zone. Figma : 2239:37020. Explorées puis écartées (maquette de Nicolas
retenue) : flux convergents horizontaux, rail vertical façon graphe de
fusion, barres empilées colorées par organisation, table de fusion champ
par champ — voir `prototypes/fusion-doublons-organisations-pistes.html`.

**09/11/2026 — Détection des doublons : même nom ou même RNA, toujours
avec le même code postal.** Une organisation n'appartient qu'à un seul
groupe : si A et B ont le même nom et B et C le même RNA, A, B et C forment
un seul groupe (la détection ne le fait pas encore, prévu côté technique).
Dans la liste, chaque groupe affiche son critère (badge gris « Même nom » /
« Même RNA ») et un filtre permet de les séparer. Quand les noms diffèrent,
le groupe prend le nom de la plus ancienne suivi de « aussi « … » » (au-delà
d'un autre nom : « aussi « ASP Pantin » et 2 autres noms », un groupe RNA
pouvant réunir 4 ou 5 organisations) et chaque
carte affiche son nom sur la ligne de l'id (« #12740 · Solidarité Pantin »).
Essayé puis retiré le 09/11 : tag RNA mis en avant en bleu, phrase « Elle
garde son nom : … » sur la page de fusion (le nom est déjà sur la carte). Erreurs de détection :
« Ce ne sont pas des doublons » sur le groupe, « Retirer du groupe » sur
une organisation quand le groupe en compte 3 ou plus ; les deux sont
ouverts aux référents et aux modérateurs, et le choix est mémorisé pour que
le groupe ne revienne pas. À trancher : le cas « même nom, même code postal,
RNA différents » (probablement deux associations distinctes, à exclure de
la détection) et les organisations sans code postal. Volume des doublons
par RNA inconnu. Exemple : `prototypes/fusion-doublons-organisations.html`.

**04/11/2026 — À la fusion, les champs vides de l'organisation gardée sont
complétés par les autres, jamais écrasés.** Rien n'est perdu : les autres
organisations sont désinscrites, pas supprimées. Hypothèse à valider côté
technique : quels champs exactement (logo, description, site, RNA, SIRET dans
le prototype).

**04/11/2026, simplifié le 09/11/2026 — La confirmation de fusion parle de
l'effet sur les personnes.** Encadré « Ce que ça change pour les
responsables », une seule phrase : « Karim H, Julie M et Léa F deviendront
co-responsables de l'organisation #8743 avec Camille P. Ils resteront
responsables de leurs missions et pourront voir celles des autres. » Plus
de mention des champs complétés ni de l'e-mail dans la modale.
Pas d'alerte orange « irréversible » : un encadré d'information dit qui
devient co-responsable et ce que ça change pour eux. La case confirme
l'accord des responsables (« Les responsables ont donné leur accord pour
cette fusion », sans le nombre), pas seulement qu'ils ont été prévenus. Ils reçoivent un e-mail une fois la fusion
faite.
