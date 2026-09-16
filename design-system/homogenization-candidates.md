# Candidats à l'homogénéisation — composants à usage unique

Analyse basée sur `component-inventory-single-use.csv` (647 composants, 0-1 usage),
avec lecture du code source pour vérifier chaque groupe avant de le retenir (les
regroupements par simple mot-clé produisaient trop de faux positifs — cf. section
méthodo en bas de fichier).

Légende effort/risque :
- **Effort** : faible (renommer/paramétrer une valeur) · moyen (extraire un composant
  partagé, adapter plusieurs appelants) · élevé (logique métier trop différente pour
  fusionner sans repenser l'API du composant)
- **Risque de régression visuelle** : faible (diff mécanique, un seul point de
  variation) · moyen (plusieurs points de variation, tests manuels nécessaires) ·
  élevé (mise en page ou comportement significativement différents)

---

## 1. Duplication visuelle/fonctionnelle

### 1.1 `components/numbers/*` vs `components/statistics/*` — 32 paires quasi-identiques

Les deux dossiers contiennent chacun ~50 fichiers, dont **32 portent exactement le
même nom** des deux côtés (`MissionsByDomaines.vue`, `OrganisationsByTypes.vue`,
`ParticipationsByReseaux.vue`, etc.). Diff vérifié sur 8 paires.

**Tier A — 27 fichiers "ByX" (répartitions/graphiques)** : diff = littéralement une
seule ligne, l'URL de l'endpoint API (`/statistics/xxx` en admin vs
`/statistics/public/xxx` en public). Exemple `MissionsByDomaines.vue` : 53 lignes
des deux côtés, 1 ligne de diff.
- Fichiers : `components/numbers/{MissionsByActivities,MissionsByDomaines,
  MissionsByOrganisations,MissionsByPeriod,MissionsByReseaux,MissionsByStates,
  MissionsByTemplateTypes,MissionsByTemplates,MissionsByTypes,
  OrganisationsByDomaines,OrganisationsByPeriod,OrganisationsByReseaux,
  OrganisationsByStates,OrganisationsByTypes,ParticipationsByActivities,
  ParticipationsByDomaines,ParticipationsByOrganisations,ParticipationsByPeriod,
  ParticipationsByReseaux,ParticipationsCanceledByBenevoles,PlacesByActivities,
  PlacesByDomaines,PlacesByMissions,PlacesByOrganisations,PlacesByReseaux,
  UtilisateursByActivities,UtilisateursByAge,UtilisateursByPeriod}.vue` et leurs
  homonymes dans `components/statistics/`
- **Effort : faible** — un seul composant paramétré par une prop `endpoint` (ou
  `visibility: 'admin' | 'public'`) remplace les 54 fichiers (27 paires).
- **Risque : faible** — diff mécanique, un seul point de variation vérifiable par
  simple comparaison de rendu avant/après.

**Tier B — 5 fichiers "*Statistics" (vues de synthèse/KPI)** :
`MissionsStatistics`, `OrganisationsStatistics`, `ParticipationsStatistics`,
`PlacesStatistics`, `UtilisateursStatistics`. Même squelette (`BoxHeadingStatistics`
+ grille de `CardStatistic`) mais **le contenu des KPI diffère réellement** entre
admin et public (ex. `PlacesStatistics` : la version admin affiche un taux de
remplissage, la version publique affiche des places réservées aux moins de 16 ans).
- Fichiers : `components/numbers/{Missions,Organisations,Participations,Places,
  Utilisateurs}Statistics.vue` et `components/statistics/{...}Statistics.vue`
- **Effort : moyen** — extraire le squelette commun (`BoxHeadingStatistics` +
  grille) en composant partagé, chaque appelant ne fournit plus que la liste de
  KPI à afficher (slot ou prop `items`).
- **Risque : moyen** — le contenu diffère vraiment, une fusion naïve casserait
  l'affichage ; il faut vérifier chaque KPI un par un.

---

### 1.2 Badge "en ligne / hors ligne" réimplémenté 4 fois au lieu de réutiliser `BadgeOnline`

`components/BadgeOnline.vue` (réutilisable, 19 usages) encapsule déjà le pattern
`DsfrBadge` + point vert/rouge + libellé. Pourtant le **même motif visuel est
recopié à la main** dans 3 fichiers à usage unique :

- `components/section/mission/Badges.vue` (lignes 33-45) — pastille
  `bg-green-600`/`bg-red-600` recopiée à l'identique
- `components/section/profile/Badges.vue` (lignes 37-47) — même pastille,
  classes quasi identiques (`h-2 w-2 rounded-full`)
- `components/card/CardMission.vue` (ligne 358-363) — même pastille, en dur

- **Effort : faible** — remplacer les 3 blocs par `<BadgeOnline :is-online="..."
  active-label="En ligne" inactive-label="Hors ligne" />` (le composant accepte
  déjà des libellés personnalisés).
- **Risque : faible** — le rendu DOM final est déjà identique (mêmes classes
  Tailwind), c'est un remplacement mécanique.

---

### 1.3 Famille "pill/badge/tag" fragmentée en au moins 5 implémentations distinctes

- `components/base/Badge.vue` (réutilisable mais 1 seul usage réel dans la
  section usage-unique : `components/section/logs/DisclosureActivityLogItems.vue`)
  — pill Tailwind custom (couleurs `jva-*` codées en dur par mot-clé métier :
  `'Brouillon'`, `'Terminée'`, `'waiting'`, etc. mélangées à des couleurs
  génériques `gray`/`blue`/`orange`)
- `components/search/BadgeFilter.vue` — pill `rounded-full border px-4 py-1.5`
  pour un filtre actif/inactif, implémentation indépendante
- `components/base/TagFormItem.vue` — tag supprimable (bouton croix) pour un
  formulaire, encore une autre implémentation
- vs. `components/dsfr/Badge.vue` et `components/dsfr/Tag.vue` /
  `components/dsfr/TagLink.vue` déjà disponibles et déjà adoptés ailleurs

- **Fichiers concernés** : `components/base/Badge.vue`,
  `components/search/BadgeFilter.vue`, `components/base/TagFormItem.vue`
- **Effort : moyen** — `BadgeFilter` peut être remplacé par `DsfrTag` en mode
  sélectionnable (props `selected`) ; `TagFormItem` correspond au pattern "tag
  supprimable" déjà couvert par `DsfrTagLink` + une icône de fermeture. Il faut
  vérifier l'API d'accessibilité (aria) de chaque cas.
- **Risque : moyen** — styles visuels proches mais pas pixel-perfect identiques
  (rayons, paddings, couleurs de bordure diffèrent légèrement) ; nécessite une
  revue visuelle après migration.

---

### 1.4 `Disclosure*` — 2 groupes quasi-clonés par entité

**`DisclosureWarningWords.vue`** (mission / organisation / territoire) — 83
lignes **identiques** des 3 côtés, seule différence : le nom du mixin importé
(`mission-aide-moderation` vs `organisation-aide-moderation`) et le nom de la
prop (`mission` vs `organisation` vs `territoire`).
- Fichiers : `components/section/{mission,organisation,territoire}/DisclosureWarningWords.vue`
- **Effort : faible** — une prop `entity` + `entityType` (ou passer le mixin en
  paramètre) suffit.
- **Risque : faible** — diff mécanique vérifiée ligne à ligne.

**`DisclosureModerationAI.vue`** (mission / organisation) — 116-118 lignes,
diff limitée à 2 libellés de texte, au nom du mixin, et à un `.sort()` en plus
côté mission.
- Fichiers : `components/section/{mission,organisation}/DisclosureModerationAI.vue`
- **Effort : faible**
- **Risque : faible**

Les deux groupes s'appuient déjà sur `components/base/Disclosure.vue` (accordéon
maison) plutôt que sur `components/dsfr/Accordion.vue` — voir §2.2.

---

### 1.5 `PanelStatistics.vue` (organisation / reseau) — quasi-clone

112 lignes des deux côtés, diff limitée aux noms de champs API
(`missions_available` vs `missions_actives`) et aux query params de liens
(`ofStructure` vs `ofReseau`).
- Fichiers : `components/organisation/PanelStatistics.vue`,
  `components/reseau/PanelStatistics.vue`
- **Effort : faible** — un mapping de champs par type d'entité suffit.
- **Risque : faible**

---

### 1.6 `PanelInfo.vue` (mission / mission-template) — squelette partagé, contenu différent

Même schéma (`ListItemInfo` + dates de création/mise à jour) mais les champs
métier affichés divergent significativement (domaines/publics bénéficiaires côté
mission, recommandations de créneaux côté modèle de mission).
- Fichiers : `components/mission/PanelInfo.vue`,
  `components/mission-template/PanelInfo.vue`
- **Effort : moyen** — extraire l'en-tête commun (dates de création/màj), laisser
  le reste spécifique par slot.
- **Risque : moyen** — contenu métier différent, une fusion complète serait
  contre-productive ; ne mutualiser que l'enveloppe.

---

### 1.7 `BoxInformations.vue` — pattern partagé recopié 13 fois

`components/section/{activity,domaine,logs,mission,mission-template,
organisation,profile,reseau,ressource,temoignage,term,territoire,thematique}/BoxInformations.vue`
(30 à 184 lignes chacun). Tous suivent le même squelette (`BaseBox` + titre +
liste de `BaseDescriptionListItem`), mais le contenu (champs métier affichés)
diffère fortement d'une entité à l'autre — ce n'est **pas** une réimplémentation
à l'identique comme 1.1/1.4/1.5, mais une duplication de *structure*.
- **Effort : moyen** — extraire un composant `InfoBox` (titre + `BaseBox` +
  slot par défaut) ; chaque fichier entité ne garderait que sa liste de
  `BaseDescriptionListItem`. Gain surtout en lisibilité, pas en lignes de code.
- **Risque : faible à moyen** — l'enveloppe commune est simple, le risque porte
  surtout sur les variantes de props (`boxVariant`, `boxPadding`, `showTitle`)
  qui ne sont pas utilisées de façon cohérente d'un fichier à l'autre
  aujourd'hui (à normaliser en même temps).

*Note apparentée (hors périmètre usage-unique strict)* : `HeaderActions.vue` (11
fichiers dans `components/section/*/`, 76 à 199 lignes) suit le même schéma de
duplication de structure avec un contenu métier variable — mentionné pour
mémoire, effort élevé vu la variabilité des actions par entité.

---

### 1.8 Famille "autocomplete / combobox" — doublons **et** code mort

Au moins 8 implémentations coexistent :
`components/algolia/InputAutocomplete.vue`,
`components/api-engagement/InputAutocomplete.vue`,
`components/base/InputAutocomplete.vue`,
`components/base/FilterInputAutocomplete.vue`,
`components/base/SelectAutocomplete.vue`,
`components/base/Combobox.vue`,
`components/dsfr/InputAutocomplete.vue`,
`components/dsfr/SelectAutocomplete.vue`, plus les primitives
`components/ui/combobox/*` (Reka-UI/shadcn) et
`components/dsfr/combobox-panel/*`.

Vérification du code : `algolia/InputAutocomplete.vue` et
`api-engagement/InputAutocomplete.vue` sont déjà des wrappers fins autour de
`DsfrInputAutocomplete` — bon signal, ce sont des intégrations légitimes, pas
des doublons. En revanche, **`base/InputAutocomplete.vue`,
`base/FilterInputAutocomplete.vue`, `base/SelectAutocomplete.vue` et
`base/Combobox.vue` ont 0 usage réel** :
- `base/InputAutocomplete.vue` remonte comme "1 usage" dans le CSV, mais c'est
  un faux positif : l'unique référence, dans
  `components/algolia/InputAutocomplete.vue`, est un `import` **commenté**
  (code mort laissé après la migration vers `DsfrInputAutocomplete`).
- `base/FilterInputAutocomplete.vue`, `base/SelectAutocomplete.vue` et
  `base/Combobox.vue` : 0 référence, nulle part.

- **Effort : faible** — ce ne sont pas des candidats à fusionner, mais à
  **supprimer purement et simplement** (pré-requis DSFR déjà en place via
  `dsfr/InputAutocomplete.vue` et `dsfr/SelectAutocomplete.vue`).
- **Risque : quasi nul** — code déjà mort, aucun appelant actif à vérifier
  (confirmer par une recherche globale avant suppression, au cas où un import
  dynamique échapperait au grep statique).

---

## 2. Composants custom qui réimplémentent un pattern DSFR

| Composant | Équivalent DSFR déjà dans le projet | Effort | Risque |
|---|---|---|---|
| `components/base/Pagination.vue` (1 usage : `components/section/History.vue`) | `components/dsfr/Pagination.vue` / `components/dsfr/PaginationSimple.vue` | Faible — remplacement direct, un seul appelant à adapter | Faible |
| `components/base/Combobox.vue`, `FilterInputAutocomplete.vue`, `SelectAutocomplete.vue` (voir §1.8, 0 usage) | `components/dsfr/InputAutocomplete.vue`, `components/dsfr/SelectAutocomplete.vue` | Faible (suppression, pas migration) | Quasi nul |
| `components/search/BadgeFilter.vue` (pill filtre actif/inactif) | `components/dsfr/Tag.vue` (mode sélectionnable) | Moyen | Moyen |
| `components/base/TagFormItem.vue` (tag supprimable) | `components/dsfr/TagLink.vue` + icône fermeture | Moyen | Moyen |
| `components/section/*/DisclosureWarningWords.vue`, `DisclosureModerationAI.vue` (via `base/Disclosure.vue`) | `components/dsfr/Accordion.vue` | Moyen — il faut vérifier que `DsfrAccordion` supporte le slot `button` avec état `isOpen` utilisé actuellement | Moyen — accordéon DSFR a une present­ation visuelle légèrement différente (chevron, style de bouton) |
| `components/custom/PercentageVariation.vue` (texte rouge/vert selon signe) | Pas d'équivalent direct DSFR — à discuter plutôt qu'à migrer, c'est un simple style de texte, pas un composant DSFR à proprement parler | — | — |

---

## 3. Incohérences de nommage

- **Trois préfixes concurrents pour le même concept** : `Base*` (maison,
  pré-DSFR), `Dsfr*` (wrapper DSFR actuel), `Ui*` (shadcn-vue/Reka-UI). Le
  même mot ("Button", "Badge", "Pagination", "InputAutocomplete",
  "SelectAutocomplete") existe sous 2 à 3 préfixes différents avec des
  implémentations différentes — cf. `component-inventory.csv` déjà généré
  (`BaseButton`/`DsfrButton`/`UiButton`, `BaseBadge`/`DsfrBadge`, etc.). Aucune
  règle visible pour savoir lequel utiliser dans du code neuf.
- **`Badges.vue` (pluriel) vs `Badge.vue` (singulier)** : les 8 fichiers
  `components/section/*/Badges.vue` regroupent plusieurs badges pour une
  entité (convention cohérente entre eux), mais rien dans le nom ne les relie
  visuellement à `base/Badge.vue` ou `dsfr/Badge.vue` qu'ils utilisent en
  interne — un renommage en `StatusBadges.vue` ou similaire clarifierait
  l'intention.
- **Groupement par type d'UI vs par domaine métier** : `components/base/`,
  `components/dsfr/`, `components/ui/` groupent par nature technique, alors
  que `components/section/*/`, `components/card/`, `components/numbers/` vs
  `components/statistics/` groupent par domaine métier ou par page. Les deux
  logiques de rangement coexistent sans règle explicite, ce qui a probablement
  facilité l'apparition des doublons ci-dessus (impossible de repérer par
  simple parcours de dossier qu'un composant équivalent existe déjà ailleurs).
- **`numbers/` vs `statistics/`** (voir §1.1) : deux dossiers différents pour
  la même famille de composants selon qu'ils sont utilisés en admin ou en
  public — un nommage/emplacement unique avec une prop de visibilité éviterait
  la confusion structurelle en plus de la duplication de code.

## 4. Incohérences valeurs Figma ↔ code (tokens)

- **Couleur du texte désactivé sur `DsfrButton` (`components/dsfr/Button.vue`)** :
  le composant Figma canonique "Thème clair / Primaire / LG" (node `1850:17578`)
  utilise le token `Light/Decisions/Text/$text-disabled-grey` = `#929292` pour
  le texte à l'état désactivé, et ce quel que soit le variant. Le code, lui,
  câble des valeurs différentes selon le variant : `text-[#656565]` pour
  `disabled && type === 'primary'` (et `secondary`/`tertiary`), et
  `text-[#929292]` uniquement pour `disabled && type === 'tertiary-no-outline'`.
  Repéré en reproduisant l'écran OTP (node `1850:17311`) en prototype statique :
  le prototype suivait d'abord le code (`#656565`) avant vérification directe du
  composant Figma, qui a confirmé `#929292` comme valeur de référence.
  - Fichiers : `components/dsfr/Button.vue`
  - **Effort : faible** — remplacer les 3 valeurs `#656565` par `#929292` (ou par
    le token si le projet en a un équivalent Tailwind/CSS var).
  - **Risque : faible** — changement de couleur seul, pas de logique affectée ;
    à vérifier visuellement sur les boutons `primary`/`secondary`/`tertiary`
    désactivés existants avant merge.

- **Points de rupture Tailwind ≠ points de rupture DSFR** : `tailwind.config.ts`
  définit `screens: { xxs:375px, xs:425px, sm:640px, md:768px, lg:1024px, xl:1348px }`,
  alors que la grille DSFR (Figma « Fondamentaux » + doc officielle) définit
  XS 0–575, SM 576–767, MD 768–991, LG 992–1247, XL ≥1248. Seul `md` coïncide
  (768px) ; `lg` et `xl` divergent notablement (1024 vs 992, 1348 vs 1248). Une
  maquette pensée avec les breakpoints DSFR peut donc légèrement casser au
  moment de l'implémentation Tailwind aux paliers lg/xl.
  - Fichiers : `frontend/tailwind.config.ts`
  - **Effort : élevé** — renommer/décaler des breakpoints Tailwind utilisés
    dans tout le codebase est risqué (impact visuel large, non isolé).
  - **Risque : élevé** — à ne considérer qu'en connaissance de cause, pas une
    correction ponctuelle.

- **`@heroicons/vue` et `vue-remix-icons` en marge de `@remixicon/vue`** : le
  set d'icônes DSFR (Figma « Fondamentaux ») est basé sur Remix Icon, et
  `@remixicon/vue` est bien la librairie dominante côté code (220 fichiers).
  Mais `@heroicons/vue` (4 fichiers) et `vue-remix-icons` (1 fichier, package
  legacy) sont aussi présents dans `package.json` et sortent de cette
  convention — leurs icônes ne correspondent pas au set DSFR officiel.
  - Fichiers : `package.json`, + 5 fichiers `.vue` consommateurs
  - **Effort : faible** — migrer les 5 usages vers `@remixicon/vue`, puis
    retirer les 2 dépendances.
  - **Risque : faible** — remplacement d'icône isolé par composant, pas de
    logique affectée.

---

## Méthodologie

Analyse en deux temps : regroupement automatique par mot-clé sur les 647 noms de
fichiers du CSV usage-unique (badge/tag, card, modal, alerte, table, pagination,
etc.), puis **lecture effective du code source** (`diff`, `wc -l`, `grep`) pour
chaque groupe avant de le retenir — les regroupements purement lexicaux
produisaient trop de faux positifs (ex. `CardMission.vue` matchait le mot-clé
"card" mais n'a rien à voir avec un composant `Card` DSFR générique ; `base/Steps.vue`
matchait "rounded-full" mais est un stepper, pas un badge). Seuls les groupes
vérifiés par lecture directe des fichiers sont listés ci-dessus. Les estimations
d'effort/risque sont qualitatives (pas de mesure automatisée de complexité
cyclomatique) et supposent une revue humaine avant toute fusion.
