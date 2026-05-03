# Connecter mes intégrations

Illizeo se connecte à vos outils d'entreprise pour automatiser le provisionnement des comptes, l'envoi de signatures, la création d'événements calendrier et la communication d'équipe. Plus vous connectez, plus Illizeo travaille pour vous.

## Les intégrations natives

Illizeo propose des connecteurs natifs avec :

- **Microsoft 365** (Entra ID / Azure AD, Outlook, Teams, OneDrive)
- **Google Workspace** (SSO, Calendar, Drive, Gmail)
- **Slack** (notifications, canaux d'équipe)
- **Microsoft Teams** (notifications, créations de canaux)
- **DocuSign** et **UgoSign** (signature électronique)
- **BambooHR**, **Personio**, **Lucca**, **Workday**, **SuccessFactors** (SIRH)
- **Teamtailor** (ATS)

## Connecter Microsoft 365 / Entra ID

Allez dans **Paramètres → Intégrations → Microsoft 365**.

1. Cliquez sur **Connecter**
2. Connectez-vous avec un compte **administrateur global** de votre tenant
3. Acceptez les permissions demandées (User.Read, Group.Read, Mail.Send, Calendars.ReadWrite)
4. Choisissez les modules à activer (SSO, provisionnement, calendar, Teams)

Une fois connecté, vous pouvez :

- Activer le **SSO Microsoft** pour vos utilisateurs ([voir l'article](?article=api-sso-microsoft))
- **Provisionner automatiquement** les comptes M365 lors d'un onboarding
- **Désactiver** automatiquement les comptes lors d'un offboarding
- Créer des **événements de bienvenue** dans le calendrier

> 💡 Astuce : pour le provisionnement automatique, vous devez avoir un plan Microsoft 365 Business ou supérieur, et que votre admin global ait délégué les permissions à Illizeo via Entra ID.

## Connecter Slack ou Teams

Pour Slack :

1. **Paramètres → Intégrations → Slack → Connecter**
2. Choisissez le **workspace Slack** cible
3. Sélectionnez les **canaux** où Illizeo peut poster (canal RH, canal IT)

Illizeo poste alors les notifications de cooptation, d'arrivée, de départ dans les canaux choisis. Les nouveaux collaborateurs sont automatiquement invités dans les canaux de bienvenue configurés dans le pack d'onboarding.

## Connecter DocuSign / UgoSign

La signature électronique est essentielle pour faire signer contrats, NDA, règlements internes.

Pour DocuSign :

1. **Paramètres → Intégrations → DocuSign → Connecter**
2. Connectez-vous avec un compte admin DocuSign
3. Choisissez le **template de signature** par défaut

UgoSign (alternative suisse) suit la même logique. Voir l'article [Signature électronique](?article=documents-signature) pour le détail.

## Connecter votre SIRH

Si vous avez déjà un SIRH (BambooHR, Personio, Lucca, Workday, SuccessFactors), connectez-le pour synchroniser collaborateurs, organigramme et événements de cycle de vie.

> ⚠️ Important : la synchronisation est unidirectionnelle par défaut (SIRH → Illizeo). Pour une synchro bidirectionnelle, contactez votre customer success manager.

## API et webhooks

Pour des intégrations sur mesure, Illizeo expose une API REST documentée et un système de webhooks. Voir [Authentification API](?article=api-authentification) et [Webhooks](?article=api-webhooks).

## Et après ?

Maintenant que votre espace est configuré, créez votre premier parcours d'onboarding. Direction l'article [Créer un parcours d'onboarding](?article=onboarding-creer-parcours).
