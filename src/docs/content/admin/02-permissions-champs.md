# Permissions et champs

Au-delà des rôles, Illizeo permet une **gestion fine des permissions** par catégorie de données et par champ. Vous décidez exactement qui voit quoi : qui voit le salaire, qui voit le numéro AVS, qui voit les évaluations.

## Le modèle de permissions

Illizeo applique deux niveaux de filtrage :

1. **Niveau rôle** — ce que ce rôle peut voir/modifier en général
2. **Niveau champ** — quels champs spécifiques sont visibles à ce rôle

Le résultat final est l'intersection des deux niveaux.

## Les catégories de champs

Les champs collaborateur sont regroupés en catégories :

- **Identité publique** — nom, prénom, photo, poste, équipe
- **Contact** — email, téléphone, adresse
- **Identité administrative** — date de naissance, nationalité, n° AVS
- **Contrat** — type, dates, période d'essai, préavis
- **Rémunération** — salaire, primes, variables, voiture de fonction
- **Évaluation** — bilans, scores, objectifs
- **Médical** — visites médicales, RQTH, restrictions
- **Famille** — enfants à charge, conjoint(e), urgences

## Permissions par défaut

Voici la matrice par défaut Illizeo (modifiable via **Paramètres → Permissions**) :

| Catégorie | super_admin | admin | admin_rh | manager | employee |
|---|---|---|---|---|---|
| Identité publique | RW | RW | RW | R | R (sien) |
| Contact | RW | RW | RW | R | RW (sien) |
| Identité admin | RW | RW | RW | - | R (sien) |
| Contrat | RW | RW | RW | R partiel | R (sien) |
| Rémunération | RW | RW | RW | - | R (sien) |
| Évaluation | RW | RW | RW | RW (équipe) | R (sien) |
| Médical | R | R | R | - | RW (sien) |
| Famille | RW | RW | RW | - | RW (sien) |

R = lecture, W = écriture, RW = les deux, "-" = pas d'accès.

## Personnaliser les permissions

Allez dans **Paramètres → Permissions & champs**.

Pour chaque catégorie, vous configurez :

- **Lecture** : qui voit
- **Écriture** : qui peut modifier
- **Export** : qui peut exporter en CSV
- **Audit** : si les accès sont logés

Vous pouvez aussi configurer **champ par champ** dans une catégorie (avancé).

> 💡 Astuce : pour la catégorie **Rémunération**, certaines entreprises ouvrent l'accès aux managers. Cela facilite les revues annuelles. Évaluez la maturité culturelle avant.

## Permissions sur les parcours

Pour les parcours, deux niveaux :

- **Visibilité globale** : qui voit la liste de tous les parcours
- **Visibilité d'instance** : qui voit un parcours individuel assigné à un collaborateur

Par exemple, un manager voit la liste des templates de parcours mais ne voit que les instances de son équipe.

## Permissions sur les documents

Sur la GED, par catégorie de document :

- **Identité** : RH only
- **Contrat** : RH + collaborateur (le sien)
- **Rémunération (fiches paie)** : RH + collaborateur (le sien)
- **Évaluation** : RH + manager (équipe) + collaborateur (sien)
- **Médical** : RH only (et collaborateur sien)

Voir [GED](?article=documents-ged).

## Audit des consultations

Activez l'**audit des consultations** sur les catégories sensibles :

- Rémunération
- Identité administrative (n° AVS)
- Évaluation
- Médical

Chaque consultation est logée : qui a vu, quand, depuis quelle IP. Voir [Audit log](?article=admin-audit-log).

> ⚠️ Important : l'audit log des consultations est crucial pour la conformité RGPD. En cas de plainte ou d'audit, vous devez pouvoir prouver qui a accédé à quoi.

## Permissions par site / entité

Si vous avez plusieurs entités juridiques ou sites :

- L'admin RH du site Genève voit uniquement les collaborateurs Genève
- L'admin RH du site Zurich voit uniquement Zurich
- Le DRH groupe voit tout

Configurez via **Paramètres → Entités → Permissions par entité**.

## Anonymisation pour le reporting

Pour les rapports analytiques, certaines données sont **anonymisées** :

- Verbatims dans les analyses sentiment NPS
- Statistiques agrégées (équipes <5 personnes regroupées)
- Exit interviews dans les rapports trimestriels

L'anonymisation est appliquée automatiquement par l'IA Illizeo.

## Permissions personnalisées (Enterprise)

Le plan Enterprise permet des **rôles 100 % custom** :

- Combinaisons de permissions hors rôles standards
- Permissions par projet, par équipe, par geography
- Workflows d'approbation pour les actions sensibles

## Et après ?

Pour aller plus loin :

1. [Utilisateurs et rôles](?article=admin-utilisateurs-roles)
2. [Sécurité et 2FA](?article=admin-securite-2fa)
3. [RGPD](?article=admin-rgpd)
