# Authentification API

L'API REST Illizeo permet de brancher vos propres outils, vos workflows internes ou vos intégrations sur mesure. Avant tout appel API, vous devez vous authentifier via une **clé API** ou un **token OAuth 2.0**.

## Les méthodes d'authentification

Illizeo propose deux méthodes selon le cas d'usage :

- **API Key** — pour les intégrations server-to-server (votre backend appelle l'API Illizeo)
- **OAuth 2.0** — pour les applications tierces qui agissent au nom d'un utilisateur

## Obtenir une clé API

Allez dans **Paramètres → API → Clés API → Nouvelle clé**.

1. Donnez un **nom** explicite à la clé (ex. « Backend ERP », « Script paie »)
2. Définissez les **scopes** (lecture seule, lecture/écriture, admin)
3. Définissez une **date d'expiration** (recommandé : 12 mois max)
4. Optionnel : restreignez aux **IPs sources** autorisées

Copiez la clé immédiatement. Elle ne sera **plus jamais affichée** par la suite (seul un hash est stocké).

> 💡 Astuce : créez une clé par **intégration** (pas une clé partagée pour tout). En cas de compromission, vous révoquez juste celle qui pose problème, pas toutes.

## Utiliser une clé API

Dans vos requêtes HTTP, ajoutez le header :

```
Authorization: Bearer ill_sk_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Exemple en cURL :

```
curl -X GET https://api.illizeo.com/v1/employees \
  -H "Authorization: Bearer ill_sk_xxxxxxx" \
  -H "Content-Type: application/json"
```

## Les scopes

Une clé API a des **scopes** qui définissent ce qu'elle peut faire :

- `employees:read` — lire les fiches collaborateurs
- `employees:write` — créer/modifier des collaborateurs
- `journeys:read` — lire les parcours
- `journeys:write` — créer/assigner des parcours
- `documents:read` — lire les documents
- `documents:write` — uploader des documents
- `webhooks:manage` — créer/supprimer des webhooks
- `*` — accès total (à éviter)

Donnez le **minimum nécessaire** à chaque clé.

## OAuth 2.0 pour applications tierces

Si vous développez une application qui agit **au nom d'un utilisateur Illizeo** (ex. un mobile app personnalisé), utilisez OAuth 2.0.

Workflow standard :

1. Enregistrez votre app dans **Paramètres → API → Apps OAuth**
2. Récupérez `client_id` et `client_secret`
3. Redirigez l'utilisateur vers `https://api.illizeo.com/oauth/authorize`
4. L'utilisateur valide les permissions
5. Vous récupérez un `authorization_code`
6. Vous échangez ce code contre un `access_token` (et `refresh_token`)
7. Vous utilisez l'`access_token` dans les requêtes

Le flow est conforme RFC 6749.

## Rate limiting

Pour éviter les abus, l'API a des **rate limits** :

- **Plan Starter** : 60 requêtes/min
- **Plan Pro** : 300 requêtes/min
- **Plan Business** : 1 000 requêtes/min
- **Plan Enterprise** : 10 000 requêtes/min

Au-delà, l'API renvoie un **HTTP 429 Too Many Requests** avec un header `Retry-After` indiquant le délai à attendre.

> ⚠️ Important : implémentez un **backoff exponentiel** côté client (1s, 2s, 4s, 8s) en cas de 429. Ne refaites pas immédiatement la même requête.

## Sécurité des clés

Bonnes pratiques :

- Stockez les clés dans un **gestionnaire de secrets** (Vault, AWS Secrets Manager, GitHub Secrets)
- **Ne committez jamais** une clé dans git
- **Renouvelez** les clés tous les 6-12 mois
- **Révoquez immédiatement** une clé compromise
- **Auditez** régulièrement les clés actives

## Révoquer une clé

En cas de fuite :

1. **Paramètres → API → Clés API**
2. Trouvez la clé compromise
3. Cliquez sur **Révoquer**

La révocation est **immédiate**. Toutes les requêtes en cours avec cette clé sont rejetées.

## Audit des appels API

Tous les appels API sont logués dans l'**audit log** :

- Horodatage de l'appel
- Clé utilisée (anonymisée)
- IP source
- Endpoint appelé
- Code de retour HTTP
- Temps de réponse

Voir [Audit log](?article=admin-audit-log).

## Versions de l'API

L'URL d'API contient le numéro de version : `/v1/`.

- **v1** : version actuelle (stable)
- Les évolutions non rétrocompatibles passeront en **v2**
- Les anciennes versions sont supportées **24 mois** après la sortie de la nouvelle

Le changelog est disponible sur **api.illizeo.com/changelog**.

## Documentation interactive

La doc interactive (Swagger / OpenAPI) est disponible sur **api.illizeo.com/docs**.

Vous pouvez :

- Parcourir tous les endpoints
- Tester chaque endpoint depuis le navigateur
- Générer du code client (Curl, Python, JS, PHP)

## Et après ?

Pour aller plus loin :

1. [Webhooks](?article=api-webhooks) pour recevoir des événements
2. [SSO](?article=api-sso-microsoft) pour l'authentification utilisateur
3. [Audit log](?article=admin-audit-log)
