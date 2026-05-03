# Webhooks

Les webhooks permettent à Illizeo de **vous notifier en temps réel** quand un événement se produit (nouveau collaborateur, contrat signé, etc.). Plutôt que de poller l'API toutes les 5 minutes, vos systèmes reçoivent des notifications push instantanées.

## Concept

Un webhook est une URL HTTP que vous exposez de votre côté. Quand un événement Illizeo se produit, nous envoyons une requête HTTP POST à votre URL avec les détails de l'événement.

C'est l'inverse de l'API classique : c'est Illizeo qui appelle votre serveur.

## Créer un webhook

Allez dans **Paramètres → API → Webhooks → Nouveau webhook**.

1. Donnez un **nom** (ex. « Sync ERP », « Notif Slack interne »)
2. Renseignez l'**URL cible** (votre endpoint, en HTTPS uniquement)
3. Choisissez les **événements** à notifier
4. Configurez le **secret** de signature (pour vérifier l'authenticité)
5. Optionnel : **filtres** (par équipe, par pays, etc.)

Le webhook est **inactif par défaut**. Activez-le après avoir testé.

## Les événements disponibles

Plus de 30 événements à choisir :

**Collaborateur**

- `employee.created` — nouvelle fiche créée
- `employee.updated` — modification
- `employee.deactivated` — désactivation
- `employee.deleted` — suppression définitive

**Parcours**

- `journey.assigned` — parcours assigné
- `journey.completed` — parcours terminé
- `journey.action.completed` — action complétée
- `journey.action.overdue` — action en retard

**Documents**

- `document.uploaded` — upload réussi
- `document.signed` — signature électronique reçue
- `document.expired` — document arrivé à expiration

**Onboarding/Offboarding**

- `onboarding.started`
- `onboarding.completed`
- `offboarding.started`
- `offboarding.completed`

**IA**

- `ai.alert.turnover` — alerte turnover
- `ai.summary.weekly` — résumé hebdo généré

## Format du payload

Chaque webhook reçoit un POST JSON :

```json
{
  "event": "employee.created",
  "timestamp": "2026-05-02T08:30:00Z",
  "version": "1.0",
  "tenant_id": "abc-123",
  "data": {
    "employee_id": "emp-456",
    "first_name": "Sophie",
    "last_name": "Martin",
    "email": "sophie.martin@entreprise.com",
    "role": "Developer",
    "team": "Tech",
    "start_date": "2026-06-01"
  }
}
```

## Vérifier la signature

Pour vérifier que le webhook vient bien d'Illizeo (et pas d'un tiers malveillant), chaque requête est signée :

```
X-Illizeo-Signature: sha256=abcdef1234567890...
```

Côté serveur, vous calculez le HMAC-SHA256 du body avec votre **secret partagé** et comparez :

```python
expected = hmac.new(secret, body, sha256).hexdigest()
if expected != received_signature:
    return 401
```

> ⚠️ Important : ne **jamais** traiter un webhook sans vérifier la signature. Sinon n'importe qui peut envoyer de faux événements à votre endpoint.

## Retries en cas d'échec

Si votre serveur répond autrement que **200/201**, Illizeo retente :

- Tentative 1 : immédiate
- Tentative 2 : +1 minute
- Tentative 3 : +5 minutes
- Tentative 4 : +30 minutes
- Tentative 5 : +2 heures
- Tentative 6 : +12 heures

Au-delà de 6 échecs, le webhook est marqué **en panne** et désactivé. Vous recevez une alerte par email.

## Idempotence

Pour les événements critiques, Illizeo peut **renvoyer plusieurs fois** le même événement (suite à un retry).

Côté votre code, identifiez chaque événement par son `event_id` et déduplicez :

```python
if event_id in already_processed:
    return 200  # Déjà traité, OK
```

> 💡 Astuce : stockez les `event_id` traités pendant au moins 24h pour gérer correctement les retries.

## Tester un webhook

Avant la production, testez avec :

- **Webhook tester** dans Illizeo (envoie un événement de test)
- **Outil tiers** comme webhook.site (pour voir le payload)
- **Tunnel local** comme ngrok (pour tester depuis votre machine)

## Logs et monitoring

Allez dans **Paramètres → API → Webhooks → [Webhook] → Logs**.

Vous voyez :

- Liste des derniers événements envoyés (100 derniers)
- Statut HTTP retourné par votre serveur
- Temps de réponse
- Body de la réponse (si erreur)
- Bouton **Renvoyer** pour rejouer un événement

## Bonnes pratiques

- Répondez **rapidement** (< 5 secondes) avec un 200, puis traitez en async
- **Idempotence** stricte (utilisez `event_id`)
- **Vérification de signature** systématique
- **Logs côté serveur** pour debug
- **Alerte** sur tous les échecs

## Quand utiliser webhook vs polling ?

- **Webhook** : événements rares mais critiques (création, suppression, signature)
- **Polling API** : sync massive régulière (rapprochement quotidien complet)

La plupart des cas d'usage utilisent les deux : webhook pour le temps réel, polling de réconciliation chaque nuit.

## Quotas

- **Pro** : 5 webhooks actifs
- **Business** : 20 webhooks actifs
- **Enterprise** : illimité

## Et après ?

Pour aller plus loin :

1. [Authentification API](?article=api-authentification)
2. [SSO](?article=api-sso-microsoft)
3. [Workflows automatiques](?article=onboarding-workflows) en alternative aux webhooks pour des cas simples
