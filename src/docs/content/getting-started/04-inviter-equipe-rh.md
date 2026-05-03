# Inviter mon équipe RH

Avant de lancer votre premier parcours, invitez les membres de votre équipe RH (responsables RH, gestionnaires de paie, office managers) ainsi que les managers concernés. Chaque utilisateur reçoit un email d'invitation et configure son mot de passe et sa 2FA en moins de 2 minutes.

## Les 5 rôles disponibles

Illizeo propose 5 rôles avec des permissions hiérarchiques :

- **super_admin** — accès total, gestion de la facturation, suppression de l'espace
- **admin** — accès total fonctionnel, sauf suppression de l'espace
- **admin_rh** — gestion complète des collaborateurs et parcours, sans accès à la facturation
- **manager** — accès à son équipe et aux parcours dont il est responsable
- **employee** — accès à son propre parcours, ses documents et la messagerie

Pour la majorité de votre équipe RH, le rôle **admin_rh** est le bon choix.

## Inviter un nouvel utilisateur

Allez dans **Paramètres → Utilisateurs & rôles → Inviter**.

1. Saisissez l'email professionnel de la personne
2. Choisissez son rôle
3. Sélectionnez son **équipe** (optionnel mais recommandé)
4. Pour les managers : indiquez les **collaborateurs de leur équipe**
5. Cliquez sur **Envoyer l'invitation**

L'utilisateur reçoit un email avec un lien valable 7 jours. À la première connexion, il choisit son mot de passe et active sa 2FA.

> 💡 Astuce : pour inviter plusieurs personnes en une fois, utilisez l'import CSV (**Paramètres → Utilisateurs & rôles → Import**). Le template CSV est téléchargeable directement depuis cette page.

## SSO Microsoft ou Google

Si vous avez configuré le SSO ([voir l'article](?article=api-sso-microsoft)), les utilisateurs invités se connectent en un clic avec leur compte d'entreprise. Aucun mot de passe à mémoriser, et la 2FA est gérée par votre IdP.

Pour les utilisateurs SSO, la première connexion crée automatiquement le profil avec leurs nom, prénom et email tirés de l'annuaire.

## Permissions fines (champs RH sensibles)

Certains champs sont sensibles (salaire, n° AVS, IBAN). Par défaut :

- **admin** et **admin_rh** voient tous les champs
- **manager** ne voit pas la rémunération de son équipe
- **employee** voit uniquement ses propres données

Vous pouvez affiner ces permissions via **Paramètres → Permissions & champs**. Voir l'article dédié [Permissions et champs](?article=admin-permissions-champs).

## Désactiver un utilisateur

Pour révoquer l'accès d'un utilisateur (départ, changement de poste), allez dans sa fiche utilisateur et cliquez sur **Désactiver**. Le compte est verrouillé immédiatement, mais les données restent (audit, historique des parcours).

> ⚠️ Important : ne supprimez jamais un compte utilisateur tant qu'il a des parcours actifs ou des documents signés. Désactivez-le à la place. La suppression définitive efface l'historique et peut poser un problème de conformité RGPD/audit.

## Et après ?

Une fois votre équipe RH invitée, connectez vos intégrations clés. Suivez le guide [Connecter mes intégrations](?article=connecter-integrations).
