# Chatbot RH (employé + admin)

Le chatbot RH Illizeo est disponible 24/7 pour répondre aux questions des collaborateurs et accompagner les RH dans leur quotidien. Il connaît votre charte, vos politiques et chaque collaborateur. Il décharge votre équipe RH des questions répétitives.

## Deux modes : employé et admin

Le chatbot opère en deux modes selon l'utilisateur connecté :

**Mode employé** (par défaut pour tous les rôles non-admin)

- Réponses à des questions personnelles (« Combien de jours de congés j'ai pris ? »)
- Informations sur les politiques (télétravail, frais, formation)
- Accès à la documentation interne
- Aide sur l'utilisation d'Illizeo

**Mode admin** (réservé aux rôles admin / admin_rh)

- Toutes les fonctions employé
- Requêtes sur les collaborateurs (« Combien d'embauches en mars ? »)
- Génération d'extraits de données
- Aide à la décision (« Quel candidat coopté avoir prioritairement ? »)
- Pilotage du produit (« Crée un workflow pour... »)

## Accéder au chatbot

Plusieurs entrées :

- **Bouton flottant** en bas à droite de toutes les pages Illizeo
- **Slack** (si l'intégration est connectée) via `/illizeo`
- **Microsoft Teams** (si connecté) via le bot Illizeo
- **Page dédiée** : **Mon espace → Assistant** ou **Espace admin → Assistant**

## Ce qu'il sait sur vous

Le chatbot a accès à :

- Votre **fiche personnelle** (poste, équipe, manager, ancienneté)
- Votre **parcours en cours** (actions à faire, statut)
- Vos **documents** (contrat, fiches de paie si autorisé)
- Vos **soldes de congés** (si SIRH connecté)
- La **charte interne** et les politiques
- La **documentation** de l'entreprise (uploadée par les RH)

> 💡 Astuce : enrichissez la base de connaissances RH (charte, FAQ interne, manuel salarié). Plus elle est complète, plus le chatbot répond bien. Allez dans **Paramètres → IA → Base de connaissances**.

## Exemples de questions employé

- « Combien de jours de congés j'ai pris cette année ? »
- « Quelle est la politique télétravail ? »
- « Comment je déclare une note de frais ? »
- « Qui est mon référent IT ? »
- « C'est quoi le salaire 13e mois ? »
- « Quand je passe ma période d'essai ? »
- « J'ai une question pour mon manager, peux-tu la résumer ? »

## Exemples de questions admin

- « Combien d'embauches sur les 6 derniers mois par équipe ? »
- « Liste-moi les 3 collaborateurs avec le score de risque turnover le plus élevé »
- « Génère un mail de relance pour les contrats non signés depuis 7 jours »
- « Quels sont les motifs de départ les plus fréquents Q1 ? »
- « Compare le NPS arrivée 2025 vs 2026 »

## Limites du chatbot

Le chatbot **ne fait pas** :

- D'engagements juridiques (« le manager m'a dit... »)
- De décisions à votre place (refus de demande de congé)
- De fuites de données sensibles (rémunération d'un collègue)
- D'accès aux données médicales (sauf l'intéressé lui-même)

Si la question dépasse son champ, il **redirige vers un humain** (RH ou manager).

> ⚠️ Important : le chatbot peut **se tromper**. Pour les questions juridiques ou financières (calcul d'une indemnité, interprétation d'une CCT), validez toujours avec votre RH ou juriste. C'est un assistant, pas une autorité.

## Confidentialité

Les conversations avec le chatbot sont :

- **Privées** par défaut (l'admin ne voit pas les chats des employés)
- **Conservées 90 jours** (puis anonymisées)
- **Non utilisées pour entraîner** Claude
- **Audit log** disponible pour les conversations sensibles

## Personnaliser le chatbot

Vous pouvez :

- Renommer le chatbot (« Sophie », « Léo », etc.)
- Choisir un avatar
- Définir un **ton** (formel, décontracté, humoristique)
- Désactiver certaines capacités (génération d'emails, etc.)
- Filtrer des sujets sensibles

Allez dans **Paramètres → IA → Chatbot**.

## Quotas

- **Starter** : 200 messages / mois / utilisateur
- **Business** : 1 000 messages / mois / utilisateur
- **Enterprise** : illimité

## Et après ?

Pour aller plus loin :

1. [Vue d'ensemble des IA](?article=ia-overview)
2. [Bot proactif](?article=ia-resume-bot-proactif) qui pousse vs réagit
3. [La messagerie côté collaborateur](?article=collab-messagerie-ia)
