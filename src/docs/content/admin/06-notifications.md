# Configuration des notifications

Illizeo envoie des notifications **in-app** (cloche dans la sidebar) et **email** (boîte de l'utilisateur) à chaque événement du cycle de vie. Vous décidez globalement, par tenant, lesquels sont actifs et sur quel canal.

## Accéder à la page

**Admin → Notifications**. Permission requise : `notifications:edit`.

## La liste des notifications — synchronisée avec le backend

La page liste les **20 notifications réellement émises** par le backend, regroupées par catégorie. La liste vient du registry serveur (`PermissionRegistry` côté API) — elle est en sync automatique : si le serveur ajoute un type, il apparaît ici sans toucher au front.

### Catégories

| Catégorie | Notifications | Audience |
|---|---|---|
| **Onboarding** | Bienvenue, Nouvelle tâche, Relance échéance, Action complétée, Parcours terminé, Nouveau collaborateur | Collab + RH |
| **Documents** | Document soumis, Document validé, Document refusé, Document à signer/lire | Collab + RH |
| **Communication** | Nouveau message | Tous |
| **Facturation IA** | Recharge IA, Échec recharge, Plafond bientôt atteint, Plafond atteint, Suggestion IA | Admin |
| **Engagement** | Badge obtenu | Collab |
| **Cooptation** | Statut cooptation | Collab |
| **Workflow** | Action de workflow | Tous |
| **Dossier** | Dossier validé / exporté | RH |

## Les deux canaux

Pour chaque notification, deux toggles indépendants :

- **In-app** — crée un enregistrement `UserNotification` visible dans la cloche
- **Email** — envoie un mail via le `NotificationMail` (bandeau avec votre logo)

Si une notif ne supporte qu'un canal (ex. *Nouveau message* ne supporte que l'in-app pour éviter le spam), l'autre est grisé avec un tiret.

## Comment ça fonctionne

Quand un événement déclenche une notif, le backend appelle `NotificationService::send()` ou `sendWithEmail()`. Avant de créer la notif et/ou d'envoyer l'email, le service consulte `NotificationRegistry::isEnabled(type, channel)` :

1. Lit la config du tenant (`CompanySetting.notif_config`, JSON)
2. Si le type est désactivé pour ce canal → **rien n'est envoyé**
3. Sinon → in-app et/ou email

Les modifications faites dans la page Notifications sont **persistées immédiatement** dans `CompanySetting` et prennent effet au prochain événement.

> 💡 Astuce : pour un test rapide, désactivez « Document validé » en email, validez un document depuis l'admin, et vérifiez que le collaborateur reçoit la notif in-app sans email.

## Défauts à l'installation

Tous les types ont des défauts raisonnables (la plupart : in-app + email activés). Quand vous arrivez sur la page pour la première fois sans avoir touché à la config, ce sont ces défauts qui s'appliquent — la valeur n'est explicitement écrite que quand vous cliquez un toggle.

## Type non listé ?

Si un nouvel événement backend émet une notif avec un type non encore enregistré dans `NotificationRegistry`, le service la **laisse passer** par défaut (politique « ne jamais étouffer silencieusement »). C'est un signal pour l'équipe technique d'ajouter l'entrée au registry.

## Audit

Chaque envoi de notif est logé en debug. Pour suivre les volumes par type/canal, consultez **Admin → Journal d'audit** filtré sur `notification`.

## Et après ?

1. [Templates emails](?article=onboarding-templates) — personnaliser le contenu des mails envoyés
2. [Workflows](?article=onboarding-workflows) — déclencher des notifs custom sur événement
3. [Personnaliser le branding](?article=personnaliser-branding) — logo dans le bandeau des emails
