# Utiliser Figma (MCP) sur ce dépôt

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

Voir aussi [`GUIDE-PROTOTYPAGE.md`](GUIDE-PROTOTYPAGE.md), section « Figma et
le code peuvent dire deux choses différentes » : ce qu'on lit dans Figma
décrit une intention de design, pas nécessairement ce que le code fait
réellement — toujours vérifier les deux avant de documenter un composant.
