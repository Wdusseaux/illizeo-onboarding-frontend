# Résumé hebdo + Bot proactif

Deux IA jumelles qui poussent l'information vers vous au lieu d'attendre que vous la cherchiez : le **résumé exécutif hebdomadaire** envoyé chaque lundi matin, et le **bot proactif** qui détecte et alerte en temps réel.

## Le résumé exécutif hebdo

Chaque **lundi à 7h** (heure locale de l'admin), Illizeo envoie aux administrateurs un email de **résumé exécutif** généré par IA.

Le contenu :

- **Top 3 risques** de la semaine
- **Métriques clés** (embauches, départs, NPS moyen)
- **Évolutions** vs semaine précédente
- **Anomalies détectées**
- **Actions recommandées** pour la semaine
- **Citations marquantes** des verbatims

L'email est court (lecture en 3-5 minutes), priorisé et actionnable.

## Exemple d'email

> **Résumé hebdo Illizeo — semaine 18, 2026**
>
> **Top 3 risques** :
> 1. Score turnover de Marc B. (Tech) est passé de 45 à 72 en 2 semaines
> 2. NPS arrivée des 3 nouveaux Sales : moyenne 6.3 (vs 8.1 sur les 30 jours précédents)
> 3. 4 contrats en attente de signature depuis >7 jours
>
> **Métriques** :
> - 2 embauches cette semaine (cible 3)
> - 1 départ négocié
> - NPS arrivée moyen : 7.8 (-0.3)
> - Workflows exécutés : 1 247
>
> **Action recommandée** : programmer un 1:1 avec Marc B. avant vendredi.

## Configurer le résumé

Allez dans **Paramètres → IA → Résumé hebdo**.

Vous configurez :

- **Destinataires** (admins, admin RH, direction)
- **Heure d'envoi** (par défaut 7h le lundi)
- **Sections incluses** (turnover, NPS, métriques, etc.)
- **Niveau de détail** (executive / détaillé)
- **Désactivation** ponctuelle (vacances)

> 💡 Astuce : l'email est conçu pour être **lu en mobile**. Ouvrez-le dans le métro ou la voiture. Si une action est urgente, vous la voyez immédiatement.

## Le bot proactif

Au-delà de l'email hebdo, le **bot proactif** opère en continu. Il **détecte des patterns** et envoie des notifications immédiates.

Les patterns détectés :

- Score turnover qui dépasse un seuil critique
- Plusieurs verbatims négatifs sur le même thème en 24h
- Actions de parcours bloquées chez plusieurs collaborateurs
- Anomalie statistique (chute brutale d'engagement d'une équipe)
- Risque de conflit (verbatims sur le même manager)
- Surcharge d'un membre de l'équipe RH (trop d'actions à faire)

## Recevoir les alertes

Vous recevez les alertes via :

- **Email** (haute priorité)
- **Slack** ou **Teams** (canal RH dédié)
- **Notification in-app** Illizeo
- **SMS** (Enterprise uniquement, alertes critiques)

Personnalisez les canaux et seuils via **Paramètres → IA → Bot proactif**.

## Exemple d'alerte

> **Alerte bot proactif — il y a 5 minutes**
>
> 3 collaborateurs ont mentionné « surcharge » dans leurs mood checkins de cette semaine, tous dans l'équipe Marketing. Le NPS moyen de l'équipe a chuté de 8.1 à 6.4 sur 14 jours.
>
> **Recommandation** : programmer un point équipe avec leur manager (Lisa C.) pour explorer la charge. Détails : [Voir l'analyse]

## Filtrer le bruit

Le bot proactif peut générer des **fausses alertes**. Pour calibrer :

- Augmenter les **seuils** (déclenche moins souvent)
- Désactiver certains **types** d'alertes
- Ignorer les alertes pendant les **périodes spéciales** (réorganisation annoncée, etc.)
- **Feedback** sur les alertes : « pertinent » ou « pas pertinent », l'IA apprend

> ⚠️ Important : si vous ignorez systématiquement les alertes, désactivez le bot. Une alerte ignorée est pire qu'une alerte absente : elle crée une fatigue cognitive sans valeur.

## Mesurer l'impact

Le tableau de bord IA mesure :

- Nombre d'alertes envoyées sur 30 jours
- % d'alertes traitées (action prise)
- % de cas réels (pertinents) vs faux positifs
- Temps de réaction moyen

Cible : > 70 % de pertinence.

## Confidentialité

Les alertes ne révèlent jamais publiquement :

- Le nom d'un collaborateur à risque (sauf au manager direct + RH)
- Le contenu exact des verbatims (synthétisés)
- Les scores individuels précis

## Combiner avec les workflows

Une alerte bot proactif peut **déclencher un workflow** :

- « Si score turnover > 70, créer une tâche RH automatique »
- « Si verbatim négatif sur le manager X, planifier un 1:1 RH avec lui »

Voir [Workflows automatiques](?article=onboarding-workflows).

## Quotas

- **Starter** : non disponible
- **Business** : résumé hebdo + bot proactif (10 alertes/jour max)
- **Enterprise** : illimité + alertes SMS + résumés ad hoc

## Et après ?

Pour aller plus loin :

1. [Détection turnover](?article=ia-turnover) qui alimente les alertes
2. [Sentiment NPS](?article=ia-sentiment-nps)
3. [Vue d'ensemble des IA](?article=ia-overview)
