# Sécurité et 2FA

La sécurité d'Illizeo repose sur plusieurs couches : authentification forte (2FA, SSO), chiffrement bout-en-bout, journal d'audit, protection contre les attaques courantes (CSRF, XSS, brute force). Le tout hébergé chez Infomaniak à Genève.

## L'authentification à deux facteurs (2FA)

La 2FA ajoute une seconde couche de sécurité au mot de passe. Activée, elle réduit de 99 % les risques de compromission de compte.

### Activer la 2FA

Pour un utilisateur individuel :

1. **Mon profil → Sécurité → Activer 2FA**
2. Scanner le QR code avec une app TOTP (Google Authenticator, Microsoft Authenticator, 1Password, Authy)
3. Saisir le code à 6 chiffres affiché par l'app
4. Sauvegarder les **codes de récupération** (10 codes à utiliser en cas de perte du téléphone)

### Forcer la 2FA pour tout l'espace

Pour l'admin global :

1. **Paramètres → Sécurité → Politique 2FA**
2. Choisissez **Obligatoire pour tous** ou **Obligatoire pour les admins**
3. Définissez un **délai de grâce** (7 ou 30 jours pour configurer)

Au-delà du délai, les utilisateurs sans 2FA ne peuvent plus se connecter tant qu'ils ne l'activent pas.

> 💡 Astuce : démarrez par **Obligatoire pour les admins** seulement. Élargissez à tous après 30 jours, le temps que chacun configure son authenticator.

## SSO Microsoft / Google

Le SSO (Single Sign-On) délègue l'authentification à votre IdP (Identity Provider). Avantages :

- Pas de mot de passe à mémoriser
- 2FA gérée par votre IdP
- Activation/désactivation centralisée
- Conformité réglementaire facilitée

Voir [SSO Microsoft / Google](?article=api-sso-microsoft).

## Politique de mots de passe

Pour les utilisateurs sans SSO, la politique de mot de passe :

- Minimum 12 caractères
- Au moins 1 majuscule, 1 minuscule, 1 chiffre
- Pas dans les top 10 000 mots de passe communs (Have I Been Pwned)
- Pas réutilisable sur les 5 derniers
- Renouvellement obligatoire tous les 12 mois (configurable)

Vous pouvez **renforcer ou assouplir** via **Paramètres → Sécurité → Politique mot de passe**.

> ⚠️ Important : ne forcez pas de renouvellement trop fréquent (tous les 3 mois par exemple). Cela conduit à des mots de passe faibles (Pa$$word1, Pa$$word2). 12 à 18 mois est l'optimum sécurité/usabilité.

## Sessions et expiration

Par défaut :

- Session active = 8 heures puis re-authentification
- Session inactive = 30 minutes puis déconnexion
- Multi-device : autorisé (vous pouvez être connecté sur PC + mobile)

Pour des contraintes plus strictes (banque, finance) :

- Session = 1 heure max
- Pas de multi-device
- Re-authentification pour chaque action sensible

## Protection contre les attaques

Illizeo implémente :

- **Brute force** : verrouillage après 5 tentatives échouées (15 min)
- **CSRF** : tokens uniques par session
- **XSS** : Content Security Policy stricte
- **SQL injection** : ORM Eloquent + paramétrage strict
- **Rate limiting** : 60 requêtes/min par IP (admin), 600 (API)
- **Geolocking** : possible de restreindre les IP par pays (Enterprise)

## Chiffrement

- **En transit** : TLS 1.3 obligatoire (TLS 1.2 toléré pour anciens clients)
- **Au repos** : AES-256 sur la base de données et les fichiers
- **Documents sensibles** : chiffrement supplémentaire au niveau application (clé dédiée par tenant)

## Hébergement et certifications

- **Infomaniak Genève** — datacenters suisses, ISO 27001, ISO 9001
- **RGPD** : compliant by design
- **nLPD** (loi suisse sur la protection des données) : compliant
- **SOC 2 Type II** : en cours pour 2026

## L'audit log

Toutes les actions sensibles sont logées :

- Connexions (succès / échec)
- Changements de rôle
- Consultations de données sensibles (rémunération, etc.)
- Suppression de données
- Modifications de configuration

Voir [Audit log](?article=admin-audit-log).

## En cas de compromission

Si vous suspectez une compromission :

1. Forcer la déconnexion de tous les utilisateurs (**Paramètres → Sécurité → Force logout all**)
2. Forcer le renouvellement de mot de passe (**Force password change**)
3. Auditer les logs (qui s'est connecté quand)
4. Contacter le support Illizeo (security@illizeo.com)

## Et après ?

Pour aller plus loin :

1. [SSO Microsoft / Google](?article=api-sso-microsoft)
2. [Audit log](?article=admin-audit-log)
3. [RGPD](?article=admin-rgpd)
