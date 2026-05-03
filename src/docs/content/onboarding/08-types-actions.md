# Personnaliser les types d'actions

Au-delà des types d'actions natifs (signature, upload, formulaire, etc.), Illizeo vous permet de créer vos **propres types d'actions** sur mesure. C'est utile pour formaliser des étapes spécifiques à votre métier ou votre culture d'entreprise.

## Quand créer un type personnalisé ?

Créez un type personnalisé si :

- Vous avez une étape récurrente dans plusieurs parcours
- Vous voulez forcer un format de donnée particulier
- Vous voulez intégrer un outil externe spécifique
- Vous voulez tracer une métrique business (ex. nombre de cafés réseau pris la première semaine)

Si l'étape est ponctuelle, restez sur un type **Custom** simple.

## Créer un nouveau type

Allez dans **Paramètres → Types d'actions → Nouveau type**.

1. Nom du type (ex. « Café réseau », « Lecture du Code éthique »)
2. Icône (choisissez parmi les icônes Lucide)
3. Couleur de la pastille
4. **Schéma** des champs à remplir (JSON Schema, optionnel)
5. **Validation** custom (regex, contraintes)
6. **Webhook** appelé à la complétion (optionnel)

## Schéma de champs (JSON Schema)

Pour un type avancé, vous pouvez définir un schéma de formulaire. Exemple pour « Café réseau » :

- Nom de la personne rencontrée (texte, obligatoire)
- Date du café (date, obligatoire)
- Sujet abordé (textarea, optionnel)
- Photo (upload, optionnel)

Illizeo génère automatiquement le formulaire correspondant côté collaborateur.

> 💡 Astuce : pour des formulaires complexes, n'hésitez pas à utiliser une intégration Typeform ou Tally et insérez l'URL dans une action de type « Formulaire externe ». Vous gardez la souplesse du builder externe.

## Webhooks à la complétion

Si votre type personnalisé doit déclencher un système externe (ex. créer un ticket Jira à la complétion), configurez un webhook.

Le webhook reçoit en POST :

- L'ID de l'action
- L'ID du collaborateur
- Les données du formulaire (si schéma défini)
- L'utilisateur qui a complété

Voir [Webhooks API](?article=api-webhooks).

## Types pré-configurés à activer

En plus des 8 types natifs, Illizeo propose 15 types « avancés » à activer en un clic :

- **DocuSign Envelope** — envoi automatique d'enveloppe DocuSign
- **UgoSign Envelope** — équivalent UgoSign
- **Microsoft Teams meeting** — création d'événement Teams
- **Calendar event** — création d'événement Google/Outlook
- **Slack channel invite** — ajout au canal Slack
- **Jira ticket** — création de ticket Jira
- **Trello card** — création de carte Trello
- **Notion page** — création de page Notion
- **Webhook custom** — appel webhook arbitraire
- **API call** — requête HTTP arbitraire (avancé)

## Permissions sur les types

Vous pouvez restreindre la création/modification/suppression de types par rôle :

- `super_admin` peut tout
- `admin` peut tout
- `admin_rh` peut créer ses types personnalisés
- `manager` ne peut pas créer de types

> ⚠️ Important : ne supprimez jamais un type d'action utilisé dans un parcours actif. Désactivez-le à la place. Sinon, les actions existantes basculent en type « Custom » et perdent leurs métadonnées.

## Bibliothèque communautaire

Comme pour les templates de parcours, vous pouvez **partager** ou **importer** des types d'actions depuis la communauté Illizeo. Pratique pour les use cases sectoriels (banque, santé, industrie).

## Et après ?

Pour aller plus loin :

1. [Workflows automatiques](?article=onboarding-workflows) pour brancher vos types custom
2. [Webhooks API](?article=api-webhooks) pour intégrer vos outils
3. [Templates de parcours](?article=onboarding-templates) qui utilisent vos types
