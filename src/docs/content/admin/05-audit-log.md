# Journal d'audit

Le journal d'audit (audit log) trace **chaque action sensible** effectuée dans Illizeo : qui a fait quoi, quand, depuis où. C'est votre garantie de conformité, votre outil d'investigation en cas d'incident, et votre preuve en cas de litige.

## À quoi sert l'audit log

Cas d'usage typiques :

- **Conformité** RGPD, SOC 2, ISO 27001 (preuve d'accès traçable)
- **Investigation** post-incident (qui a vu/modifié X ?)
- **Contestation** d'un collaborateur (preuves d'accès à son dossier)
- **Détection** d'usage anormal (admin qui consulte trop)
- **Audit interne** (revue trimestrielle de sécurité)

## Les actions logguées

Toutes les actions suivantes sont automatiquement tracées :

**Authentification**

- Connexion réussie
- Échec de connexion (mot de passe invalide, 2FA invalide)
- Déconnexion
- Activation / désactivation 2FA
- Changement de mot de passe

**Données collaborateurs**

- Création / modification / suppression d'un collaborateur
- Consultation des champs sensibles (rémunération, identité admin)
- Export de données
- Téléchargement de documents sensibles

**Configuration**

- Modification des rôles
- Changement de permissions
- Connexion / déconnexion d'intégrations
- Modification des paramètres de sécurité

**IA**

- Utilisation des fonctions IA (avec quota consommé)
- Désactivation / activation des IA

## Accéder à l'audit log

Allez dans **Paramètres → Sécurité → Audit log**.

Réservé au rôle **super_admin** par défaut. Vous pouvez l'étendre aux **admin** si besoin.

Filtres disponibles :

- Période (date début / date fin)
- Type d'action
- Utilisateur effectuant l'action
- Utilisateur ciblé (si applicable)
- IP source
- Résultat (succès / échec)

## Format d'une entrée d'audit

Chaque entrée contient :

- **Horodatage** précis (millisecondes UTC)
- **Utilisateur** (qui)
- **Action** (quoi)
- **Ressource** (sur quoi)
- **IP** et **User-Agent**
- **Résultat** (succès / échec / partiel)
- **Avant/Après** pour les modifications (diff JSON)

> 💡 Astuce : pour les actions sensibles (modification de salaire, suppression de dossier), l'audit log capture automatiquement le **diff** : ancienne valeur → nouvelle valeur. Très utile en cas de contestation.

## Recherche full-text

La barre de recherche permet de chercher dans :

- Les noms d'utilisateurs
- Les types d'actions
- Les messages d'erreur
- Les ressources affectées

Exemple : « modifier salaire » remonte toutes les modifications de salaire sur la période.

## Conservation

Par défaut, l'audit log est conservé **7 ans** :

- Conservation chaude (recherche rapide) : 90 jours
- Conservation froide (archive) : jusqu'à 7 ans

Vous pouvez prolonger jusqu'à **10 ans** via la configuration. Au-delà, l'export annuel vers votre propre stockage est recommandé.

## Export

Trois formats d'export :

- **CSV** : pour Excel, BI
- **JSON** : pour systèmes SIEM
- **PDF** : pour audits formels

Vous pouvez planifier des **exports automatiques** (mensuels, trimestriels) vers un email ou un bucket S3.

## Intégration SIEM

Pour les entreprises avec un SIEM (Splunk, Elastic, Datadog) :

- API REST de récupération des logs (avec filtre temporel)
- Webhook **streaming** des événements en temps réel
- Format CEF (Common Event Format) supporté

Cela permet de centraliser les logs Illizeo avec ceux de vos autres systèmes pour une vue unifiée.

> ⚠️ Important : les logs d'audit sont **immuables**. Personne (pas même un super_admin) ne peut les modifier ou les supprimer. Cette propriété est essentielle à leur valeur juridique.

## Alertes sur l'audit log

Configurez des **alertes automatiques** pour :

- Connexions depuis un pays inhabituel
- Tentatives de connexion en force brute
- Modification massive de données
- Consultation hors heures ouvrées
- Désactivation de la 2FA d'un admin

**Paramètres → Sécurité → Alertes audit**.

## Exemples d'investigation

**Incident** : un collaborateur dit qu'on a accédé à sa fiche sans raison.

**Procédure** :

1. Filtrer l'audit log : ressource = collaborateur X, action = consultation
2. Liste des consultations sur 90 jours
3. Identifier les utilisateurs ayant consulté
4. Croiser avec les motifs métier (était-ce justifié ?)
5. Documenter et répondre au collaborateur

## Et après ?

Pour aller plus loin :

1. [Sécurité et 2FA](?article=admin-securite-2fa)
2. [RGPD](?article=admin-rgpd)
3. [Permissions et champs](?article=admin-permissions-champs)
