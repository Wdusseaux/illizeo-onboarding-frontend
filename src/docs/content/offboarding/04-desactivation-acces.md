# Désactivation des accès

La désactivation des accès est l'étape **critique pour la sécurité** de l'offboarding. Un compte oublié = une faille de sécurité, une fuite potentielle de données, voire un risque de fraude. Illizeo automatise le maximum mais certaines étapes restent manuelles.

## La règle d'or : le moment de désactivation

Le **timing** de désactivation dépend du type de départ :

- **Démission négociée bien passée** — désactivation au lendemain du dernier jour effectif
- **Démission rapide** — désactivation immédiate dès l'annonce
- **Licenciement** — désactivation **AVANT l'entretien** de notification
- **Conflit** — désactivation immédiate à la décision

Côté Illizeo, vous pilotez le timing dans le parcours d'offboarding via une action de type **« Désactivation accès »**.

## La checklist des accès à désactiver

Liste exhaustive à valider :

- **Identité** — Microsoft 365 / Google Workspace / Entra ID
- **Communication** — Slack, Teams, Zoom, email
- **Stockage** — OneDrive, Google Drive, Dropbox, NAS
- **Productivité** — Notion, Jira, Confluence, Trello, Asana
- **CRM/ERP** — Salesforce, HubSpot, SAP, Odoo
- **Code** — GitHub, GitLab, Bitbucket
- **Cloud** — AWS, GCP, Azure (révoquer IAM users + clés)
- **VPN** — accès réseau
- **Bâtiment** — badge, alarme
- **Téléphonie** — extension, mobile pro, ligne
- **Cartes** — bancaires pro, crédit, péage, essence
- **Illizeo** — compte utilisateur Illizeo lui-même

## L'automatisation via Microsoft 365 / Google Workspace

Si vous avez connecté Microsoft 365 ou Google Workspace ([voir intégrations](?article=connecter-integrations)), Illizeo peut **désactiver le compte M365/Google automatiquement** au moment configuré dans le parcours.

L'action désactive :

- La connexion (l'utilisateur ne peut plus se logger)
- Les sessions actives sont révoquées
- Les emails entrants sont redirigés vers le manager (configurable)
- Les fichiers partagés restent accessibles (transfert de propriété)

Le compte est **désactivé**, pas **supprimé**. La suppression peut intervenir 30 à 90 jours après pour permettre la récupération de données.

> 💡 Astuce : configurez un message d'absence automatique sur l'email du partant pendant 30 à 60 jours, redirigeant vers le manager ou le successeur. Évitez les rebonds vers le client final.

## Les comptes applicatifs sans SSO

Si vous n'avez pas de SSO centralisé, chaque application doit être désactivée manuellement. Illizeo peut générer une **checklist personnalisée** par collaborateur listant tous les outils auxquels il avait accès, basée sur l'inventaire de provisioning de l'onboarding.

Pour automatiser, plusieurs options :

- Webhooks Illizeo vers vos outils (voir [Webhooks](?article=api-webhooks))
- Connecteurs SCIM si supporté
- Intégration via votre Identity Provider (Okta, Entra ID)

## Récupération des données

Avant de désactiver, **récupérez les données pro** :

- Emails importants (dossier Outlook archivé)
- Fichiers OneDrive / Drive (transfert de propriété au manager)
- Notes (Notion, OneNote)
- Tickets en cours (Jira, Zendesk)

Cette opération doit être faite **avec le partant** dans la mesure du possible, pour identifier ce qui est critique vs personnel.

> ⚠️ Important : les données personnelles (emails persos qui ont transité, fichiers privés) doivent être **supprimées** par le partant avant la désactivation. Ne fouillez jamais une boîte mail à sa place sans accord écrit.

## L'audit de désactivation

Illizeo génère un **rapport d'audit** PDF listant :

- Tous les accès qui ont été désactivés
- L'horodatage de chaque désactivation
- L'utilisateur qui a effectué l'opération
- Les accès éventuellement non désactivés (avec justification)

Ce rapport est conservé 7 ans dans la GED de l'offboarding.

## Et après ?

Pour finaliser :

1. [Exit interview](?article=offboarding-exit-interview)
2. [Journal d'audit](?article=admin-audit-log)
3. [RGPD et conservation des données](?article=admin-rgpd)
