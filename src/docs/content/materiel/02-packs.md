# Packs d'équipement par poste

Plutôt que d'attribuer manuellement le matériel à chaque arrivée, créez des **packs d'équipement** par type de poste. À chaque embauche, Illizeo applique automatiquement le pack correspondant et déclenche les actions IT nécessaires.

## Le concept de pack

Un pack est un **set de matériel standard** associé à un type de poste :

- Pack « Développeur » : MacBook Pro 16, écran 4K, casque Bose, dock USB-C, clavier mécanique, souris
- Pack « Sales » : Laptop standard 15, écran 27, smartphone, casque Bluetooth, dock
- Pack « Office Manager » : Laptop standard 13, casque, accès imprimante, badge bâtiment
- Pack « C-level » : MacBook Pro 16, smartphone premium, écran 32, voiture de fonction

## Créer un pack

Allez dans **Matériel → Packs → Nouveau pack**.

1. Donnez un **nom** explicite (ex. « Pack Dev Senior »)
2. Listez les **items** du pack (par modèle ou par catégorie)
3. Pour chaque item : **obligatoire** ou **optionnel**
4. Définissez les **alternatives** (Mac OU PC selon préférence)
5. Indiquez le **budget cible** total

## Lier un pack à un poste

Allez dans **Paramètres → Postes → [Nom du poste] → Pack matériel** et sélectionnez le pack par défaut.

Vous pouvez avoir des packs différents selon :

- Le **niveau** (junior / senior / lead / staff)
- Le **lieu** (siège / site secondaire / remote)
- Le **type de contrat** (CDI / CDD / stage)

Plusieurs critères peuvent se cumuler.

## Application automatique à l'onboarding

Quand vous assignez un parcours d'onboarding, Illizeo :

1. Détecte le **poste** du collaborateur
2. Identifie le **pack matériel** lié
3. Crée des **actions IT** dans le parcours pour chaque item :
   - « Préparer le laptop modèle X »
   - « Configurer le smartphone »
   - « Imprimer le badge »
4. Réserve les **actifs en stock** (si l'inventaire est à jour)

L'IT n'a plus qu'à exécuter le brief.

> 💡 Astuce : tenez l'inventaire à jour en temps réel. Sinon Illizeo réserve un actif qui n'est plus disponible et l'erreur ne se voit qu'au moment de la remise. Faites un check stock mensuel.

## Les options et préférences

Pour respecter les préférences individuelles, certains packs proposent des **choix** :

- Mac vs PC
- Clavier QWERTZ (Suisse) vs AZERTY (France) vs QWERTY (international)
- Casque filaire vs Bluetooth
- Souris droite vs gauche

Le formulaire de préférence est rempli par le collaborateur en préboarding (J-21).

## Le coût d'un pack

Pour chaque pack, Illizeo calcule automatiquement :

- **Coût total** d'achat (somme des items)
- **Coût mensuel amorti** (sur 3 à 5 ans)
- **Coût opex** annuel (consommables)
- **Variations** par alternative

Utile pour budgétiser vos embauches : « 100 nouveaux devs cette année = 100 × 4 500 CHF = 450 000 CHF d'investissement matériel ».

## Mise à jour d'un pack

Quand vous changez le pack (nouveau modèle de laptop par exemple), Illizeo applique :

- **Nouveau pack** pour les **futurs embauchés**
- **Pack actuel** maintenu pour les **collaborateurs déjà équipés**
- **Migration optionnelle** : proposer aux collaborateurs existants de migrer (avec budget)

> ⚠️ Important : ne supprimez jamais un pack utilisé par des collaborateurs actifs. Désactivez-le simplement (« n'apparaît plus pour les nouveaux »). Sinon vous perdez l'historique d'attribution.

## Pack pour le télétravail

Pour les collaborateurs en télétravail full ou hybride, prévoyez un **pack télétravail** complémentaire :

- Écran second 27"
- Chaise ergonomique (avec budget)
- Lampe de bureau
- Tapis de souris XL
- Webcam HD si pas intégrée

Ce pack peut être livré directement à domicile via vos prestataires logistique.

## Pack offboarding

Le pack d'offboarding est le **miroir** : la liste à restituer. Il est généré automatiquement à partir des items attribués + les éléments « consommables » fournis (clés, badges, cartes).

## Et après ?

Pour aller plus loin :

1. [Provisionnement automatique](?article=materiel-provisionnement)
2. [Inventaire matériel](?article=materiel-inventaire)
3. [Restitution matériel](?article=offboarding-restitution-materiel)
