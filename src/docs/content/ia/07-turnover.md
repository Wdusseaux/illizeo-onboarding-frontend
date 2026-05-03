# Détection turnover

La détection turnover est une fonction prédictive : l'IA Illizeo calcule pour **chaque collaborateur** un score de risque de départ (0 à 100), basé sur des dizaines de signaux comportementaux. Détecter tôt = pouvoir agir = retenir.

## Pourquoi anticiper

Un collaborateur qui démissionne :

- Coûte 6 à 12 mois de salaire à remplacer (recrutement + onboarding + montée en compétence)
- Démoralise son équipe directe
- Laisse des dossiers en suspens
- Peut être détecté **2 à 6 mois à l'avance** avec les bons signaux

L'IA Illizeo vous donne cette fenêtre d'anticipation.

## Le score de risque

Pour chaque collaborateur, l'IA calcule un score 0-100 :

- **0-30** : risque faible (engagement normal)
- **31-50** : risque modéré (à surveiller)
- **51-70** : risque élevé (action recommandée)
- **71-100** : risque critique (action immédiate)

Le score est mis à jour **chaque jour** à partir des signaux frais.

## Les signaux pris en compte

L'IA croise une vingtaine de signaux :

**Signaux explicites** (forts)

- Score NPS individuel < 7
- Mood checkin négatif sur 2+ semaines
- Verbatims contenant des mots-clés (« épuisement », « doute », « cherche »)
- Actions de parcours systématiquement en retard

**Signaux comportementaux** (modérés)

- Baisse d'activité Slack / Teams (si intégration)
- Diminution des participations aux réunions
- Absence aux événements d'équipe
- Pas de prise de congés depuis longtemps (épuisement) ou inversement

**Signaux contextuels** (faibles)

- Anniversaire d'arrivée approchant (les 1 an, 2 ans, 5 ans sont des moments à risque)
- Changement récent de manager
- Refus récent d'une promotion ou augmentation
- Embauches massives dans son équipe (jalousie)

## Enrichissement par Claude

Au-delà du score brut, **Claude génère** :

- Une **narrative** explicative (« Pourquoi ce score ? »)
- Une **tendance sur 4 semaines** (en hausse, stable, en baisse)
- Des **recommandations** actionnables (« proposer un 1:1 manager », « explorer une mobilité »)
- Une **probabilité** de départ sur 6 mois

Cette narrative est ce qui rend l'IA actionnable, pas juste un chiffre abstrait.

> 💡 Astuce : ne montrez jamais le score à un collaborateur. C'est un outil RH, pas un indicateur public. La perception « je suis flagué comme à risque » est dévastatrice.

## Accéder aux scores

Allez dans **Espace admin → Dashboard → Risque turnover**.

Vous voyez :

- La **liste des collaborateurs** triée par score
- Les **alertes critiques** (score >70)
- Les **évolutions récentes** (score qui monte rapidement)
- L'**historique** par collaborateur

Vous pouvez filtrer par équipe, manager, ancienneté.

## L'alerte automatique

Quand un score dépasse certains seuils, Illizeo notifie automatiquement :

- **Score > 50** : email au manager direct
- **Score > 70** : email au manager + RH responsable
- **Tendance forte (+20 en 4 semaines)** : alerte spéciale même si score absolu modéré

Configurez les seuils via **Paramètres → IA → Détection turnover**.

## Les actions recommandées

Pour chaque score élevé, l'IA propose des actions concrètes :

- Programmer un **1:1 manager** dans la semaine
- Lancer un **mood checkin** ciblé
- Proposer une **mobilité interne**
- Explorer un **réajustement salarial**
- Identifier un **frein concret** (charge, conflit, projet)

Vous validez ou ignorez chaque suggestion.

## Limites et faux positifs

Le score a ses limites :

- **Faux positifs** : un collaborateur introverti peut avoir un score élevé sans intention de partir
- **Faux négatifs** : un départ « brutal » (offre concurrente massive) n'est pas détectable
- **Biais culturels** : les signaux varient par culture (un Suisse peut être très réservé sans être à risque)

> ⚠️ Important : le score est un **indicateur**, pas une vérité. Croisez toujours avec votre connaissance terrain. Une discussion humaine vaut 1 000 scores algorithmiques.

## Confidentialité

Les scores sont visibles uniquement par :

- RH (admin et admin_rh)
- Manager direct (uniquement pour son équipe)
- Le collaborateur lui-même : **NON**, il ne voit jamais son score

Les calculs sont logés en interne et n'utilisent jamais de données externes.

## Quotas

- **Starter** : non disponible
- **Business** : scores quotidiens illimités
- **Enterprise** : scores quotidiens + analyses approfondies à la demande

## Et après ?

Pour aller plus loin :

1. [Sentiment NPS](?article=ia-sentiment-nps) qui alimente le score
2. [Bot proactif](?article=ia-resume-bot-proactif) qui pousse les alertes
3. [Reboarding](?article=reboarding) si retour de longue absence
