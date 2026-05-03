# Workflows automatiques

Les workflows automatisent les actions répétitives liées au cycle de vie des collaborateurs : envoyer un email à J-3 avant l'arrivée, créer une action quand un parcours démarre, alerter le manager si une action est en retard, etc.

## Anatomie d'un workflow

Chaque workflow est composé de :

- Un **déclencheur** (event Laravel) — ex. *Nouveau collaborateur*, *Document soumis*, *J+0 jour d'arrivée*
- Une suite d'**étapes** : actions, conditions, délais (drag & drop dans le builder visuel)
- Un **destinataire** par étape — qui reçoit l'email/notification

L'exécution est synchrone à l'événement déclencheur (sauf délais explicites qui passent par une queue).

## Les 27 déclencheurs disponibles

### Cycle de vie collaborateur
- **Nouveau collaborateur** — fiche créée
- **Parcours créé** — un parcours est attribué à un collaborateur
- **Parcours complété à 100 %**
- **Fin de parcours offboarding**

### Documents
- **Document soumis** par un collaborateur
- **Document validé** par RH
- **Document refusé** (action requise)
- **Tous documents validés** (dossier complet)

### Actions & formulaires
- **Action complétée** par un collaborateur
- **Formulaire soumis**

### Contrats & signatures
- **Contrat prêt** à envoyer
- **Contrat signé**
- **J+3 après envoi signature** (relance)

### Triggers temporels (commande quotidienne `workflows:check-scheduled`)
- **J-7 avant date limite** d'une action
- **J-3 avant date d'arrivée**
- **Jour d'arrivée (J+0)**
- **Milestone post-arrivée** (J+14, J+30)
- **Période d'essai terminée**
- **Fin de période d'essai (J-15)**
- **Renouvellement CDD (J-60)** — uniquement pour les CDD
- **Anniversaire d'embauche**
- **Anniversaire personnel**
- **Collaborateur en retard** sur ses actions
- **Hebdomadaire (lundi)** — résumé hebdo

### Engagement
- **Cooptation validée**
- **Questionnaire NPS soumis**
- **Nouveau message reçu**

## Les 13 actions disponibles

| Action | Description |
|---|---|
| **Envoyer email de relance** | Email avec template + variables |
| **Envoyer confirmation au collaborateur** | Email + notif in-app au collab |
| **Envoyer pour validation au Manager** | Email + notif au manager direct |
| **Envoyer pour approbation Admin RH** | Email + notif aux admins RH |
| **Notifier l'équipe RH** | In-app + email |
| **Envoyer un message IllizeoBot** | Message bot interne |
| **Envoyer via Teams** | Carte Teams (intégration requise) |
| **Envoyer pour signature** | Demande de signature (DocuSign/UgoSign requis) |
| **Assigner action automatiquement** | Crée une `CollaborateurAction` réelle dans le parcours du collaborateur ; choisissez l'action via le sélecteur dans le panel de config |
| **Changer statut du parcours** | Marque le parcours comme terminé |
| **Attribuer un badge** | Crée un badge avec nom/icône/couleur configurables |
| **Ajouter au groupe** | Ajoute le collab à un groupe spécifique |
| **Générer un document** | PDF DomPDF à partir d'un titre + corps HTML, sauvegardé dans le dossier du collab |

> 💡 Astuce : les actions « Envoyer via Teams » et « Envoyer pour signature » nécessitent une intégration active. Le builder affiche un bandeau d'avertissement rouge si l'intégration manque, pour éviter les workflows qui échouent silencieusement.

## Les 8 destinataires possibles

- **Collaborateur** — l'employé concerné
- **Manager direct** — le supérieur N+1 (relation `accompagnants` rôle `manager`)
- **Parrain/Buddy** — accompagnant `buddy` ou `parrain`
- **N+2** — vraie résolution hiérarchique (manager du manager) ; fallback sur admin_rh si pas trouvé
- **Équipe RH** — tous les utilisateurs avec le rôle `admin_rh`
- **Tous les participants** — collaborateur + tous ses accompagnants
- **Utilisateur spécifique** — un user désigné par ID
- **Groupe spécifique** — tous les collabs d'un groupe

## Conditions

Vous pouvez insérer une étape **condition** (ex. *si type_contrat == CDI*) qui filtre les champs du collaborateur :

- `site`, `departement`, `poste`, `type_contrat`, `pays`
- Opérateurs : `==`, `!=`, `contains`

Si la condition n'est pas remplie, les étapes suivantes sont sautées.

## Délais

Une étape **délai** (ex. *attendre 2 jours*) met le workflow en pause via la queue Laravel et reprend à l'étape suivante après expiration. Unités : heures, jours, semaines.

## Créer un workflow

1. Allez dans **Admin → Workflows → Nouveau workflow**
2. Nommez-le et donnez-lui une description
3. Choisissez le **déclencheur** (dropdown 27 choix)
4. Ajoutez les **étapes** via le bouton « + » du builder
5. Configurez chaque étape (panel latéral)
6. Activez le toggle « Actif »

> ⚠️ Avant d'activer, vérifiez que les intégrations dont dépendent vos actions sont configurées (Teams webhook, DocuSign, UgoSign…). Sinon les actions correspondantes échoueront et l'admin recevra une notif d'erreur.

## URL du bouton CTA dans les emails

L'URL `{FRONTEND_URL}` du bouton « Accéder à Illizeo » en bas de chaque email est automatiquement substituée par l'URL tenant-aware (`https://onboarding.illizeo.com/votre-tenant`).

## Logo dans les emails

Le bandeau supérieur des emails workflow utilise votre **logo client** (configuré dans **Apparence**) si défini, sinon le logo Illizeo. Le HTML des templates peut contenir des balises (`<h2>`, `<p>`, `<b>`…) qui sont rendues telles quelles.

## Et après ?

1. [Templates emails](?article=onboarding-templates) avec les variables disponibles
2. [Configuration des notifications](?article=admin-notifications) — choisir les canaux (in-app/email)
3. [Webhooks API](?article=api-webhooks) pour brancher vos propres outils
