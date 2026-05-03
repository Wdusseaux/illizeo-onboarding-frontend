# Restitution du matériel

La restitution du matériel est l'une des étapes les plus concrètes d'un offboarding. Mal organisée, elle génère des pertes (laptop non restitué = 1500 CHF), des conflits (caution non rendue), et des risques de sécurité (données sur un appareil personnel).

## L'inventaire du matériel attribué

Illizeo maintient automatiquement la liste du matériel attribué à chaque collaborateur, à condition que vous ayez activé le module **Matériel** lors de l'onboarding.

Allez dans **Collaborateurs → [Prénom Nom] → Matériel** pour voir :

- Laptop (modèle, n° série, valeur, état)
- Téléphone (modèle, IMEI, ligne)
- Écrans externes
- Casque audio
- Badge bâtiment
- Clés de bureau / casier
- Cartes de crédit pro
- Équipements spécifiques (caméra, instruments, etc.)

## Générer la liste de restitution

À l'initiation de l'offboarding, Illizeo génère automatiquement la **liste de restitution** : un document PDF listant tout le matériel à rendre, avec espace pour signature partant + RH.

Ce document peut être :

- **Signé électroniquement** via DocuSign / UgoSign
- **Imprimé** et signé physiquement le jour du départ

> 💡 Astuce : pour les départs à distance (remote workers), envoyez une étiquette d'expédition prépayée avec le matériel à restituer. Tracez le colis et liez-le à l'action « Restitution matériel ».

## Le check-in physique

Le jour du départ effectif, l'IT (ou l'office manager) procède au **check-in** :

1. Vérification de chaque item face à la liste
2. Contrôle de l'état (rayures, dommages, accessoires)
3. Photos avant/après si nécessaire
4. Signature partant + RH/IT
5. Validation de l'action dans Illizeo

Si un item est manquant ou endommagé, marquez-le et négociez la suite (déduction sur solde de tout compte, remplacement).

## Cas du matériel personnel utilisé pour le travail

Avec le télétravail, certains collaborateurs utilisent leur propre matériel (BYOD). Dans ce cas :

- Désinstallation des logiciels pro (Microsoft 365, VPN, MDM)
- Suppression à distance via Intune / Jamf si MDM
- Vérification que les données pro ne restent pas en local

> ⚠️ Important : ne déclenchez pas un wipe complet sur un appareil personnel ! Utilisez uniquement le **wipe sélectif** (Microsoft Intune, Jamf), qui supprime seulement les données entreprise.

## Restitution du badge et clés

Pour les bâtiments physiques :

- Désactivation du badge dans le système de contrôle d'accès
- Récupération physique du badge (à détruire ou réutiliser)
- Récupération des clés (casier, bureau, voiture de fonction)
- Vérification du parking (place attribuée libérée)

## Cas particulier : voiture de fonction

Si le collaborateur a une voiture de fonction :

- Date de restitution clairement stipulée dans le solde de tout compte
- État des lieux du véhicule (kilométrage, dommages, niveau carburant)
- Récupération des cartes (essence, péage)
- Annulation des assurances

## Si le matériel n'est pas restitué

Si malgré les relances, du matériel n'est pas restitué :

1. **Premier rappel** par email à J+3
2. **Deuxième rappel** recommandé par AR à J+10
3. **Mise en demeure** à J+30 avec valorisation du matériel
4. Dernière option : **retenue sur solde de tout compte** (légalité variable selon pays)

> ⚠️ Important : en Suisse, la retenue sur salaire est strictement encadrée par l'art. 323b CO. Consultez votre juriste avant toute déduction.

## Et après ?

Pour finaliser le départ :

1. [Désactivation des accès](?article=offboarding-desactivation-acces)
2. [Exit interview](?article=offboarding-exit-interview)
3. [Inventaire matériel](?article=materiel-inventaire) pour la suite
