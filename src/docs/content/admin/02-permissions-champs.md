# Permissions et champs

Illizeo applique deux niveaux de filtrage qui se combinent :

1. **Niveau module** — quelles pages/fonctionnalités un rôle peut voir/éditer/administrer
2. **Niveau champ** — quels champs spécifiques d'un collaborateur (salaire, AVS, date de naissance…) sont visibles ou éditables par ce rôle

Les deux se configurent depuis la **même page** : **Admin → Rôles & permissions**.

## Le système de niveaux

Chaque permission a 4 niveaux hiérarchiques (du plus restrictif au plus permissif) :

| Niveau | Sens |
|---|---|
| **none** | Aucun accès — la page n'apparaît pas dans la sidebar |
| **view** | Lecture seule |
| **edit** | Lecture + écriture (créer, modifier, supprimer) |
| **admin** | edit + actions sensibles (purge, export, configuration globale) |

Les permissions au niveau **champ** n'ont que 3 niveaux : aucun, voir, éditer.

## La matrice des permissions

La matrice principale liste **51 modules** regroupés en deux espaces :

### Espace admin (35 modules)

- **Gestion** — Tableau de bord, Parcours, Collaborateurs, Vue Manager, Documents, Équipes & Groupes, Calendrier, Buddy
- **Automatisation** — Workflows, Templates emails, Notifications, RDV récurrents
- **Contenu** — Page entreprise, Bureaux, Citations, Équipements, NPS, Feedback, Contrats, Signatures, Cooptation, Gamification, Projets
- **Intégrations** — Intégrations, Provisioning SCIM/SSO, Assistant IA
- **Sécurité & Paramètres** — Audit, Utilisateurs, Rôles, Champs collaborateur, Apparence, Sécurité 2FA, RGPD, Abonnement, Paramètres généraux, Rapports

### Espace collaborateur (16 modules)

- **Mon espace** — Onboarding, Actions, Parcours 100j, Équipe
- **Mon dossier** — Signatures, Matériel, Profil, RDV
- **Engagement** — Badges, Bureaux, Feedback, Page entreprise, Citation
- **Communication** — Messagerie, Assistant IA, Cooptation

> 💡 Astuce : la liste est servie par le backend (`PermissionRegistry`). Si un module est ajouté côté serveur, il apparaît automatiquement dans la matrice — pas de mise à jour côté front nécessaire.

## Permissions par champ — synchronisé avec la page Champs

Sous la matrice des modules, une zone turquoise **Champs collaborateur** liste un par un tous les champs du profil (Identité, Personnel, Contrat, Poste, Position, Org).

Pour chaque champ × rôle, un bouton qui cycle :

- **Édit** (rouge) — le rôle voit ET peut modifier
- **Voir** (bleu) — le rôle voit en lecture seule
- **Aucun** (gris) — le champ est masqué pour ce rôle

Cette zone est **dynamiquement synchronisée** avec la page **Admin → Champs collaborateur** :

- Ajouter un champ là-bas → apparaît dans la matrice ici
- Supprimer un champ → disparaît
- Réordonner les sections → reflété dans la matrice

> ⚠️ Cohérence : si vous retirez « Voir » à un rôle, « Éditer » est automatiquement retiré aussi. Logique : on ne peut pas éditer ce qu'on ne voit pas.

## Cycle de clic

Chaque cellule de la matrice est un bouton cliquable qui cycle entre les niveaux :

- **Modules** : Admin → Édit → Voir → Aucun → Admin…
- **Champs** : Édit → Voir → Aucun → Édit…

La modification est **persistée immédiatement** (mise à jour optimiste avec rollback en cas d'erreur API).

## Rôles préconfigurés

Illizeo livre les rôles standards :

- `super_admin` — bypass total, toutes permissions
- `admin` — toutes permissions admin sauf super-admin
- `admin_rh` — onboarding, collaborateurs, RH (pas la facturation ni la sécurité)
- `manager` — sa propre équipe en lecture
- `collaborateur` — son propre profil

Vous pouvez créer des **rôles custom** via le bouton « Nouveau rôle » et leur attribuer la combinaison exacte de permissions souhaitée.

## Scope d'un rôle

Au-delà des permissions, chaque rôle a un **scope** qui limite *sur quelles données* il s'applique :

- **Global** — tous les collaborateurs
- **Société / Sous-société / Département / Bureau / Équipe / Poste** — restriction à une sous-population
- **N-1 du manager** — uniquement les rapports directs
- **Population RH** — uniquement les fiches gérées par cet admin RH

Voir l'onglet **Scope** dans la fiche d'un rôle.

## Audit des changements

Chaque modification de permission est logée dans `permission_logs` avec : qui, quand, quel rôle, quelle clé. Consultable via **Admin → Journal d'audit** (filtre `permission`).

## Et après ?

1. [Utilisateurs et rôles](?article=admin-utilisateurs-roles)
2. [Sécurité et 2FA](?article=admin-securite-2fa)
3. [RGPD](?article=admin-rgpd)
