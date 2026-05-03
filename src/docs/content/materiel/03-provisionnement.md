# Provisionnement automatique

Le provisionnement automatique permet à Illizeo de **commander, configurer et livrer** le matériel sans intervention humaine pour la plupart des étapes. C'est un gain de temps massif (4 à 8 heures par embauche) et une réduction des erreurs.

## Les niveaux de provisionnement

Du moins au plus automatisé :

1. **Manuel** — IT prépare physiquement chaque item, attribue dans Illizeo
2. **Semi-auto** — Illizeo crée les tickets dans votre outil ITSM (Jira, ServiceNow)
3. **Auto** — Illizeo provisionne directement comptes M365 + accès applicatifs
4. **Full auto** — Illizeo commande aussi le matériel auprès du fournisseur (zero-touch)

La plupart des PME démarrent au niveau 2-3, les grandes entreprises visent le niveau 4.

## Provisionnement comptes Microsoft 365

Si vous avez connecté Microsoft 365 ([voir intégrations](?article=connecter-integrations)), Illizeo peut :

- Créer le **compte utilisateur** dans Entra ID
- Lui assigner une **licence M365** (Business Standard, E3, E5)
- L'ajouter aux **groupes** correspondant à son équipe
- Créer son **email** au format défini (prenom.nom@entreprise.com)
- Configurer les **règles de transfert** d'email

Tout cela en 30 secondes au lieu de 10-15 minutes manuels.

## Provisionnement comptes Google Workspace

Même logique avec Google Workspace :

- Création du compte
- Assignation des licences (Business Starter / Standard / Plus / Enterprise)
- Ajout aux groupes
- Configuration de la signature email

## Provisionnement applications via SSO / SCIM

Pour les applications connectées via **SSO + SCIM** (System for Cross-domain Identity Management), le provisioning est automatique :

- L'utilisateur est créé dans l'IdP (Okta, Entra ID, Google)
- L'IdP propage la création vers les applications connectées
- L'utilisateur reçoit ses accès au lendemain

Applications SCIM-compatibles courantes : Slack, Notion, Jira, GitHub Enterprise, Salesforce, Zoom, Asana, Trello.

## Provisionnement via webhook

Pour les applications sans SCIM, utilisez les **webhooks Illizeo** ([voir l'article](?article=api-webhooks)) qui appellent l'API native de l'application.

Exemple : à la création d'un dev, Illizeo appelle l'API GitHub pour ajouter l'utilisateur à l'organisation, lui donner les bons droits sur les repos, etc.

> 💡 Astuce : pour 5 applications principales, le ROI du provisioning automatique est massif. Au-delà, certaines applications de niche peuvent rester manuelles (la maintenance des intégrations devient lourde).

## Provisionnement matériel (commande fournisseur)

Le niveau le plus poussé : Illizeo commande directement le matériel chez vos fournisseurs habituels (Apple Business, Galaxus, Brack, Dell, Lenovo).

Workflow type :

1. À l'assignation du parcours, Illizeo identifie le pack
2. Illizeo crée une commande chez le fournisseur via API
3. Le matériel est livré préconfiguré (DEP/ABM Apple, Autopilot Microsoft)
4. Le collaborateur le reçoit chez lui ou au bureau
5. À la première connexion, l'appareil s'enrôle automatiquement dans votre MDM
6. L'utilisateur a juste à se connecter avec son compte

Cela suppose :

- Compte Apple Business / Microsoft Intune Autopilot
- API fournisseur configurée (Apple ASM, Galaxus B2B)
- Adresse de livraison validée

## Le déprovisionnement automatique

L'inverse à l'offboarding :

- Désactivation des comptes M365 / Google
- Révocation SSO et IAM cloud
- Suppression des accès SCIM (Slack, Notion, etc.)
- Wipe sélectif des appareils enrôlés MDM
- Récupération du matériel via étiquette retour

Voir [Désactivation des accès](?article=offboarding-desactivation-acces).

> ⚠️ Important : le provisioning et déprovisioning automatiques sont **puissants mais sensibles**. Une erreur de configuration peut désactiver un mauvais compte. Testez toujours sur un compte test avant la mise en production.

## Audit du provisioning

Chaque action de provisioning génère une **trace d'audit** :

- Heure et durée
- Système cible (M365, Slack, etc.)
- Action exécutée
- Résultat (succès, erreur, partiel)
- Utilisateur final affecté

Le log est consultable via **Audit log** ([voir l'article](?article=admin-audit-log)).

## Coût et plans

Le provisioning automatique est inclus dans les plans :

- **Pro** : SSO + SCIM (5 applications)
- **Business** : SSO + SCIM illimité + webhooks
- **Enterprise** : tout + intégration Apple Business / Microsoft Autopilot

## Et après ?

Pour aller plus loin :

1. [Inventaire matériel](?article=materiel-inventaire)
2. [Packs d'équipement](?article=materiel-packs)
3. [Webhooks API](?article=api-webhooks)
