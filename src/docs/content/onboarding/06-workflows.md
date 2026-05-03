# Workflows automatiques

Les workflows sont les automatisations qui font tourner Illizeo en arrière-plan. Ils déclenchent des notifications, créent des tâches, envoient des documents, sans intervention humaine. Bien configurés, ils libèrent 70 % du temps RH dédié au suivi des parcours.

## Qu'est-ce qu'un workflow ?

Un workflow est composé de :

- Un **déclencheur** (event) — ex. « assignation d'un parcours », « action en retard »
- Une **condition** optionnelle — ex. « si type de contrat = CDI »
- Une ou plusieurs **actions** — ex. « envoyer un email », « créer une tâche », « notifier Slack »

Chaque workflow tourne en asynchrone via une queue. Il ne bloque jamais l'utilisateur.

## Les déclencheurs disponibles

Illizeo propose une trentaine de déclencheurs natifs :

- Création / assignation / clôture de parcours
- Changement de statut d'une action
- Action en retard (1, 3, 7, 14 jours)
- NPS reçu (avec score < seuil)
- Mood checkin négatif
- Document signé / non signé
- Pièce d'identité uploadée
- Anniversaire du collaborateur
- Anniversaire d'arrivée (1 mois, 3 mois, 1 an, etc.)
- Score turnover > seuil

## Les actions disponibles

- Envoi d'**email** (template personnalisable)
- Notification **Slack / Teams**
- Notification **in-app**
- Création d'une **tâche RH** assignée à quelqu'un
- **Webhook** vers un système tiers
- Ajout / suppression d'une **action de parcours**
- Mise à jour d'un **champ collaborateur**

## Les workflows fournis par défaut

Illizeo livre 12 workflows prêts à l'emploi :

- Bienvenue à l'assignation
- Rappel J-7 au manager
- Relance signature contrat (J+2 si non signé)
- Relance pièces d'identité (J+5)
- NPS arrivée à J+30
- Mood checkin hebdo les 4 premières semaines
- Bilan période d'essai à J+90
- Anniversaire d'arrivée annuel

Activez ou désactivez chaque workflow via **Espace admin → Workflows**.

> 💡 Astuce : conservez les workflows par défaut activés au moins 3 mois avant de les modifier. Ils sont calibrés sur la base de retours de centaines d'entreprises et offrent un bon point de départ.

## Créer un workflow personnalisé

Allez dans **Espace admin → Workflows → Nouveau workflow**.

1. Nommez le workflow (ex. « Relance manager si NPS < 6 »)
2. Choisissez le **déclencheur**
3. Ajoutez des **conditions** (optionnel)
4. Configurez les **actions** (jusqu'à 10 par workflow)
5. **Testez** en mode simulation avant de publier

## Mode simulation

Avant qu'un workflow ne tourne en production, lancez-le en mode **simulation** : Illizeo affiche ce qui se serait passé sur les 30 derniers jours sans rien envoyer réellement. Vous validez le comportement avant d'activer.

> ⚠️ Important : les workflows mal calibrés peuvent générer du spam (3 emails par jour à un manager). Surveillez les premières semaines via **Workflows → Historique** pour vérifier les volumes.

## Limites par plan

- **Starter** : 5 workflows actifs maximum, 1 000 exécutions/mois
- **Pro** : 20 workflows actifs, 10 000 exécutions/mois
- **Business** : illimité, 100 000 exécutions/mois
- **Enterprise** : illimité, illimité

Au-delà du quota, les workflows continuent mais avec un délai d'exécution (best effort).

## Et après ?

Pour aller plus loin :

1. [Webhooks API](?article=api-webhooks) pour brancher vos propres outils
2. [Templates de parcours](?article=onboarding-templates) qui embarquent leurs workflows
3. [Bot proactif IA](?article=ia-resume-bot-proactif) pour des automatisations intelligentes
