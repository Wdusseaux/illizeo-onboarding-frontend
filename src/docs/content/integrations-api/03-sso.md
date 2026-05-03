# SSO Microsoft / Google

Le SSO (Single Sign-On) permet à vos collaborateurs de se connecter à Illizeo avec leur compte Microsoft 365 ou Google Workspace, sans créer ni mémoriser de mot de passe Illizeo séparé. Plus pratique pour eux, plus sécurisé pour vous.

## Pourquoi le SSO

Avantages :

- **Un seul mot de passe** à gérer pour vos utilisateurs
- **2FA centralisée** chez votre IdP (déjà configurée)
- **Provisioning** automatique (création de compte à la première connexion)
- **Déprovisioning** automatique (désactivation côté IdP = blocage côté Illizeo)
- **Conformité** facilitée (audit centralisé)

Une fois le SSO actif, vos utilisateurs cliquent sur « Connexion avec Microsoft » (ou Google) et c'est terminé.

## SSO Microsoft (Entra ID / Azure AD)

### Pré-requis

- Tenant Microsoft 365 / Entra ID
- Compte **Global Admin** ou **Application Admin**
- Plan Illizeo **Pro** ou supérieur

### Procédure

1. Allez dans **Paramètres → SSO → Microsoft**
2. Cliquez sur **Connecter Entra ID**
3. Vous êtes redirigé vers la page de consentement Microsoft
4. Connectez-vous avec un compte admin global
5. Acceptez les permissions demandées :
   - `User.Read.All` (lire les profils)
   - `Group.Read.All` (lire les groupes)
   - `email`, `profile`, `openid` (identification)
6. Vous êtes redirigé vers Illizeo, SSO actif

### Configurer les groupes

Vous pouvez **mapper les groupes Entra ID** aux rôles Illizeo :

- Groupe « RH-Team » → rôle `admin_rh`
- Groupe « Direction » → rôle `admin`
- Groupe « Tous-employés » → rôle `employee`

Allez dans **Paramètres → SSO → Mapping groupes**.

> 💡 Astuce : pour démarrer simple, mappez juste un groupe « Illizeo-Admin » au rôle `admin`. Les autres utilisateurs auront le rôle `employee` par défaut.

## SSO Google Workspace

### Pré-requis

- Tenant Google Workspace
- Compte **Super Admin**
- Plan Illizeo **Pro** ou supérieur

### Procédure

1. Allez dans **Paramètres → SSO → Google**
2. Cliquez sur **Connecter Google Workspace**
3. Connectez-vous avec un compte super admin
4. Acceptez les permissions OAuth
5. Mapping des groupes Google → rôles Illizeo

## Provisioning automatique

À la **première connexion SSO** d'un utilisateur, Illizeo crée automatiquement son profil :

- Nom et prénom (depuis le profil M365 / Google)
- Email (identifiant SSO)
- Photo (si autorisée)
- Rôle (selon mapping de groupe ou rôle par défaut)

Pas besoin de pré-créer les utilisateurs. C'est ce qu'on appelle le **JIT provisioning** (Just-In-Time).

## Déprovisioning automatique

Quand un utilisateur est **désactivé dans Entra ID / Google**, l'effet sur Illizeo dépend de votre configuration :

- **Sync immédiate** (toutes les 15 min) : compte Illizeo désactivé sous 15 min
- **Sync à la connexion** : compte désactivé à la prochaine tentative de login
- **Manuel** : c'est à vous de désactiver côté Illizeo

Pour le mode immédiat, il faut activer **SCIM** en plus du SSO.

> ⚠️ Important : le déprovisioning automatique est **critique pour la sécurité**. Sans, un employé licencié peut continuer à se connecter à Illizeo si vous oubliez de le désactiver manuellement.

## SCIM (provisioning bidirectionnel)

SCIM va plus loin que le SSO :

- **Création** automatique des comptes (pas seulement à la première connexion)
- **Modification** automatique (changement d'email, de groupe)
- **Suppression** automatique
- **Sync continue** des annuaires

Configurez SCIM via **Paramètres → SSO → SCIM**.

Disponible avec les plans **Business** et **Enterprise**.

## Forcer le SSO

Une fois confiant, vous pouvez **forcer le SSO** : aucune connexion par mot de passe Illizeo possible, tous les utilisateurs doivent passer par Microsoft / Google.

**Paramètres → SSO → Forcer le SSO**.

> 💡 Astuce : avant de forcer le SSO, gardez **au moins un super_admin** avec un mot de passe Illizeo classique (compte break-glass). Sinon, si Microsoft/Google a un downtime, vous êtes bloqué.

## SSO et 2FA

Quand le SSO est actif :

- La 2FA est gérée par votre IdP (Entra ID / Google)
- Pas besoin d'activer la 2FA dans Illizeo séparément
- Le niveau de sécurité dépend de la config IdP

Si votre IdP n'a pas de 2FA configurée, **activez-la côté IdP**, pas seulement côté Illizeo.

## SSO multi-IdP

Pour les groupes avec plusieurs sociétés :

- Plusieurs tenants Microsoft / Google peuvent être connectés
- Chaque utilisateur se connecte avec son IdP
- Les rôles et permissions s'appliquent indépendamment

## Audit du SSO

Toutes les connexions SSO sont logées :

- Identité de l'utilisateur
- IdP utilisé (Microsoft / Google)
- Réussite / échec
- IP source et User-Agent

Voir [Audit log](?article=admin-audit-log).

## Et après ?

Pour aller plus loin :

1. [Sécurité et 2FA](?article=admin-securite-2fa)
2. [Authentification API](?article=api-authentification)
3. [Inviter mon équipe RH](?article=inviter-equipe-rh)
