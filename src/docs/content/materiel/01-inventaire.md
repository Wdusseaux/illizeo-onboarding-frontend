# Inventaire matériel

Le module **Matériel & équipements** d'Illizeo gère l'inventaire des actifs alloués à vos collaborateurs : ordinateurs, téléphones, écrans, accessoires, badges, cartes. Indispensable pour la sécurité, la conformité comptable et la traçabilité.

## Pourquoi un inventaire structuré

Sans inventaire, vous perdez :

- **De l'argent** — un laptop non restitué = 1 500 CHF perdus
- **Des données** — un appareil oublié = risque de fuite
- **Du temps** — recherche manuelle au moment du départ
- **De la conformité** — audits financiers et SOC2 / ISO27001

Avec un inventaire bien tenu, ces risques sont quasi éliminés.

## L'arborescence des actifs

Illizeo organise les actifs en catégories :

- **Informatique** — laptops, tablettes, smartphones, écrans, claviers, souris, casques
- **Bureau** — chaises, bureaux, lampes, dock USB
- **Sécurité** — badges, clés, cartes d'accès
- **Cartes** — cartes bancaires pro, cartes carburant, cartes péage
- **Véhicules** — voitures de fonction, vélos d'entreprise
- **Spécifique métier** — caméras, instruments, EPI

## Ajouter un actif

Allez dans **Matériel → Inventaire → Nouvel actif**.

1. Choisissez la **catégorie**
2. Renseignez les **caractéristiques** (modèle, n° série, IMEI, MAC)
3. Indiquez la **valeur d'achat** et la **date d'achat**
4. Définissez le **statut** (disponible, attribué, en réparation, mis au rebut)
5. Si attribué : sélectionnez le **collaborateur**

## Import en masse

Pour les entreprises avec un parc existant, utilisez l'import CSV :

- Téléchargez le **template CSV**
- Remplissez vos actifs (jusqu'à 10 000 lignes)
- Uploadez via **Inventaire → Import CSV**
- Validez le mapping des colonnes
- Lancez l'import

> 💡 Astuce : avant un import en masse, faites un **test sur 10 lignes** pour valider le mapping. Une erreur sur 10 000 lignes est compliquée à débugguer.

## Le cycle de vie d'un actif

Un actif passe par plusieurs statuts :

- **Disponible** — au stock, pas attribué
- **Attribué** — alloué à un collaborateur
- **En réparation** — chez un prestataire
- **À restituer** — collaborateur en offboarding
- **Restitué** — restitution effective, vérification ok
- **Disponible** ou **Mis au rebut** — réinjecté ou retiré

Chaque transition est tracée dans l'historique.

## Liaison avec les parcours

Lors d'un onboarding, le module Matériel s'intègre :

- L'action « Préparer le matériel » liste le pack à attribuer
- L'IT clique sur « Attribuer » pour chaque item
- Le scan code-barre / QR code est possible via mobile
- L'attribution apparaît automatiquement sur la fiche du collaborateur

Lors d'un offboarding, l'inverse :

- La liste de restitution est générée auto
- Chaque item est checké au retour
- Les écarts (manquant, endommagé) sont tracés

## Étiquettes et codes-barres

Pour faciliter le suivi physique :

- **Étiquettes imprimables** depuis Illizeo (PDF prêt à imprimer)
- **QR codes** scannables qui ouvrent la fiche de l'actif
- **Codes-barres** Code 128 pour scanners industriels

> ⚠️ Important : étiquetez tous les actifs > 200 CHF. Sans étiquette, l'inventaire physique trimestriel devient un cauchemar.

## Inventaire physique

Tous les 6 ou 12 mois, conduisez un **inventaire physique** :

1. Imprimez la liste des actifs attribués (par site)
2. Déléguez le check à chaque office manager
3. Scannez chaque actif (mobile)
4. Notez les écarts
5. Investigation des écarts (perte, vol, oubli)
6. Mise à jour de l'inventaire

Illizeo génère un **rapport d'écart** automatique.

## Lien avec la comptabilité

Pour les actifs immobilisés (>1 000 CHF), Illizeo calcule automatiquement :

- L'amortissement linéaire (3 ou 5 ans selon catégorie)
- La valeur nette comptable à un instant T
- Les sorties d'actif (cessions, mises au rebut)

Export comptable disponible (CSV, format PCG ou IFRS).

## Et après ?

Pour aller plus loin :

1. [Packs d'équipement par poste](?article=materiel-packs)
2. [Provisionnement automatique](?article=materiel-provisionnement)
3. [Restitution matériel](?article=offboarding-restitution-materiel)
