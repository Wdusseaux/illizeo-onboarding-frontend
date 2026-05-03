# RGPD et conservation des données

Illizeo est conçu **RGPD by design** et conforme à la **nLPD suisse** (nouvelle loi sur la protection des données entrée en vigueur en septembre 2023). En tant que sous-traitant de vos données, nous vous fournissons les outils pour rester conforme.

## Notre rôle : sous-traitant

Selon le RGPD, vous êtes le **responsable du traitement** (data controller) de vos données collaborateurs. Illizeo est votre **sous-traitant** (data processor).

Cela signifie :

- Vous décidez ce que vous collectez et pourquoi
- Vous répondez aux demandes des collaborateurs (droits)
- Illizeo héberge, sécurise, traite techniquement
- Illizeo n'utilise jamais vos données pour d'autres finalités

Notre **DPA** (Data Processing Agreement) est disponible dans **Paramètres → Légal → DPA**.

## Hébergement à Genève

Toutes vos données sont hébergées en **Suisse** chez **Infomaniak** :

- Centres de données à Genève (Plan-les-Ouates)
- Énergie 100 % renouvelable
- ISO 27001 et ISO 9001 certifié
- Pas de transfert hors Europe sans votre accord

Pour les fonctions IA (Claude), les requêtes sont traitées par **Anthropic Europe** (centres en UE) selon une option configurable.

> 💡 Astuce : pour des contraintes de souveraineté très strictes, le plan **Enterprise** propose un déploiement **on-premise** dans votre propre infrastructure.

## Les durées de conservation

Illizeo applique des durées par catégorie :

- **Contrats et avenants** : 10 ans après le départ
- **Fiches de paie** : 5 ans (FR) / 10 ans (CH)
- **Pièces d'identité** : durée du contrat + 1 an
- **Documents médicaux** : 10 ans après la visite
- **Données candidat refusé** : 2 ans (RGPD CNIL)
- **Logs d'audit** : 7 ans
- **Verbatims NPS** : 5 ans (anonymisés au-delà)

Configurez les durées spécifiques à votre pays via **Paramètres → RGPD → Conservation**.

## Suppression et anonymisation

À l'échéance, Illizeo applique automatiquement :

- **Suppression définitive** des données identifiantes
- **Anonymisation** des données utiles aux statistiques (sans lien avec l'individu)
- **Audit log** de toutes les suppressions

Vous pouvez aussi déclencher manuellement :

- Suppression d'un dossier complet
- Anonymisation d'un dossier (suppression du nom, mais conservation des stats)
- Export RGPD avant suppression

## Les droits du collaborateur

Le RGPD garantit 7 droits aux personnes physiques :

1. **Accès** — connaître les données détenues
2. **Rectification** — corriger les données erronées
3. **Effacement** — droit à l'oubli
4. **Limitation** — bloquer un traitement spécifique
5. **Portabilité** — récupérer ses données dans un format réutilisable
6. **Opposition** — refuser un traitement (marketing par ex.)
7. **Décision automatisée** — refuser une décision purement algorithmique

Illizeo permet d'exercer ces droits via **Mon espace → Mes données → Droits RGPD**.

> ⚠️ Important : le droit à l'effacement n'est pas absolu. Vous avez l'**obligation légale** de conserver certaines données (contrat, fiche de paie) pendant les durées légales. Expliquez-le clairement au collaborateur en cas de demande.

## Le registre des traitements

Vous devez tenir un **registre des traitements** (article 30 RGPD). Illizeo génère automatiquement un registre couvrant les traitements effectués par notre plateforme :

- Paie et gestion administrative
- Recrutement et onboarding
- Évaluation et talent management
- Communication interne

Vous l'enrichissez avec vos autres outils (paie externalisée, mutuelle, etc.).

## Notification de violation

En cas de **violation de données** (data breach), Illizeo s'engage à :

- Vous notifier dans les **24 heures** de la détection
- Vous fournir les éléments techniques (impact, données concernées)
- Vous accompagner dans la communication CNIL/autorité

Vous avez ensuite **72 heures** pour notifier l'autorité de contrôle si la violation présente un risque.

## Le DPO

Si vous n'avez pas de DPO interne :

- Illizeo peut vous mettre en relation avec des DPO externes partenaires
- Le plan Enterprise inclut un **DPO de référence** pour vos questions

## Cookies et tracking

Illizeo n'utilise **aucun cookie de tracking marketing**. Seulement :

- Cookie de session (essentiel)
- Cookie de préférences (langue, thème)
- Pas de Google Analytics ni Meta Pixel

L'IA n'utilise pas vos données pour entraîner ses modèles externes.

## Et après ?

Pour aller plus loin :

1. [Audit log](?article=admin-audit-log)
2. [Sécurité et 2FA](?article=admin-securite-2fa)
3. [Permissions et champs](?article=admin-permissions-champs)
