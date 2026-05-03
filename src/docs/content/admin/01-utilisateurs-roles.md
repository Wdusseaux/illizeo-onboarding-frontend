# Utilisateurs et rôles

Illizeo gère les utilisateurs via 5 rôles hiérarchiques. Chaque rôle a un périmètre d'actions et de données défini. Bien attribuer les rôles est essentiel pour la sécurité et la conformité.

## Les 5 rôles

- **super_admin** — accès total, gestion abonnement, suppression de l'espace
- **admin** — accès total fonctionnel, sauf suppression d'espace et facturation critique
- **admin_rh** — gestion complète RH (collaborateurs, parcours, documents) sans accès facturation
- **manager** — accès à son équipe et aux parcours dont il est responsable
- **employee** — accès à son propre parcours, ses documents, la messagerie

## Le rôle super_admin

Le super_admin est le **dernier rempart**. Il peut :

- Gérer la facturation et le plan
- Supprimer définitivement l'espace
- Modifier les rôles des autres utilisateurs (y compris des admins)
- Accéder aux logs d'audit complets
- Configurer les intégrations critiques (SSO, SCIM)

> ⚠️ Important : ayez **au moins 2 super_admin** pour éviter le single-point-of-failure (départ, oubli mot de passe). Mais pas plus de 3-4 : c'est un rôle critique.

## Le rôle admin

L'admin a tous les pouvoirs fonctionnels :

- Création / suppression de parcours, templates, workflows
- Gestion des collaborateurs (création, modification, désactivation)
- Configuration des paramètres (sauf facturation critique)
- Gestion des intégrations
- Accès à tous les modules

Donnez le rôle admin à votre **DRH** et aux **2-3 personnes** qui pilotent vraiment Illizeo au quotidien.

## Le rôle admin_rh

C'est le rôle de votre équipe RH **opérationnelle** :

- Gestion des collaborateurs et parcours
- Génération de documents et contrats
- Suivi des onboardings, offboardings
- Accès à tous les champs RH
- Pas d'accès aux paramètres système, ni à la facturation

C'est le rôle le plus utilisé en pratique.

## Le rôle manager

Le manager voit **uniquement son équipe** :

- Liste de ses collaborateurs directs
- Parcours dont il est responsable
- NPS et mood checkins de son équipe (synthèse, pas individu par individu pour les feedbacks anonymes)
- Score turnover de son équipe
- Pas d'accès aux salaires de son équipe (par défaut)

Vous pouvez configurer si le manager voit ou non les rémunérations de son équipe via [Permissions et champs](?article=admin-permissions-champs).

## Le rôle employee

L'employee voit **uniquement ses propres données** :

- Son parcours et ses actions
- Ses documents (contrat, fiches de paie selon configuration)
- Ses notifications
- La messagerie / chatbot

Aucun accès aux données des collègues.

## Inviter un utilisateur

Allez dans **Paramètres → Utilisateurs & rôles → Inviter**.

Voir [Inviter mon équipe RH](?article=inviter-equipe-rh) pour le détail.

## Modifier un rôle

Pour changer le rôle d'un utilisateur :

1. **Paramètres → Utilisateurs → [Nom de l'utilisateur]**
2. Cliquez sur **Modifier le rôle**
3. Choisissez le nouveau rôle
4. Confirmez

L'utilisateur reçoit une notification du changement. La modification est immédiate.

> 💡 Astuce : si un employé devient manager (promotion), changez son rôle Illizeo **avant** son entrée en fonction. Ainsi il peut consulter les profils de sa future équipe en amont.

## Désactiver un utilisateur

Pour révoquer l'accès :

1. Sa fiche → **Désactiver**
2. Le compte est verrouillé immédiatement
3. Les données restent (audit, historique parcours)
4. Le rôle est conservé pour l'audit

Une réactivation est possible si l'utilisateur revient.

## Supprimer un utilisateur

La suppression définitive efface l'historique. À éviter sauf cas particuliers (exigence RGPD du collaborateur).

> ⚠️ Important : avant de supprimer, vérifiez qu'il n'a aucun parcours actif ni document en cours de signature. La suppression brise les liens et peut compromettre des audits.

## Audit log

Tout changement de rôle, désactivation ou suppression est logué dans l'**audit log** ([voir l'article](?article=admin-audit-log)).

## Et après ?

Pour aller plus loin :

1. [Permissions et champs](?article=admin-permissions-champs)
2. [Sécurité et 2FA](?article=admin-securite-2fa)
3. [Audit log](?article=admin-audit-log)
