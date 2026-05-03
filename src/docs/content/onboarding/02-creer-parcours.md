# Créer un parcours d'onboarding

Un parcours d'onboarding se construit en 3 étapes : choisir un template, ajuster les phases et actions, sauvegarder. Vous pouvez aussi partir d'une page blanche, ou laisser l'IA Illizeo générer un parcours complet à partir d'une simple description.

## Méthode 1 : partir d'un template (recommandé)

Allez dans **Espace admin → Parcours → Nouveau parcours**.

1. Choisissez le **type** : CDI cadre, CDI non-cadre, CDD, stage, alternance, expat
2. Choisissez la **langue** (FR, EN, DE, IT, ES)
3. Choisissez le **pays** (les mentions légales sont automatiques)
4. Cliquez sur **Créer à partir d'un template**

Le template se charge avec ses phases pré-remplies. Vous arrivez sur l'éditeur de parcours.

## Méthode 2 : générer par IA

Si vous avez le plan **Business** ou supérieur, vous pouvez décrire votre besoin en langage naturel et l'IA Illizeo génère un parcours complet en JSON.

Exemple de prompt :

> « Onboarding pour un développeur full-stack senior en CDI à Lausanne, présentiel 3j/semaine, équipe de 8 personnes, technologies Laravel et React, buddy obligatoire, période d'essai de 3 mois. »

L'IA génère 25 à 40 actions réparties sur 6 à 8 phases. Vous pouvez ensuite tout modifier. Voir [Génération de parcours IA](?article=ia-generation-parcours).

## Méthode 3 : page blanche

Pour les cas très spécifiques, démarrez de zéro via **Nouveau parcours → Page blanche**. Vous créez phases et actions une par une.

> 💡 Astuce : même pour un cas très spécifique, démarrez d'un template et supprimez ce qui ne va pas. Vous gagnerez des heures et n'oublierez aucune mention légale obligatoire.

## L'éditeur de parcours

L'éditeur affiche votre parcours sous forme de **timeline verticale**. Chaque phase est un bloc collapsible, chaque action une ligne avec :

- Titre et description
- Responsable (rôle ou personne nommée)
- Échéance (relative à la date d'arrivée : J-7, J0, J+30...)
- Type (signature, upload, formulaire, etc.)
- Obligatoire / optionnel

Vous pouvez :

- Glisser-déposer pour réorganiser
- Dupliquer une action
- Ajouter des dépendances (action B après action A)
- Conditionner une action (ex. « si CDI » uniquement)

## Les variables dynamiques

Dans les titres et descriptions d'action, vous pouvez insérer des variables qui seront remplacées à l'assignation :

- `{{collaborateur.prenom}}`
- `{{collaborateur.poste}}`
- `{{manager.prenom}}`
- `{{date_arrivee}}`
- `{{buddy.prenom}}`

> ⚠️ Important : si une variable n'a pas de valeur (ex. pas de buddy assigné), Illizeo affiche un avertissement à l'assignation. Vérifiez bien que toutes les variables utilisées seront renseignées.

## Sauvegarder et tester

Cliquez sur **Sauvegarder** en haut à droite. Le parcours passe en statut **Brouillon**. Pour le rendre disponible à l'assignation, cliquez sur **Publier**.

Avant de publier, lancez un **test à blanc** : assignez le parcours à un compte de test et parcourez-le côté collaborateur pour vérifier le rendu.

## Et après ?

Une fois le parcours publié :

1. [Comprendre les phases et actions](?article=onboarding-phases-actions)
2. [Assigner le parcours à un collaborateur](?article=onboarding-assigner)
3. [Configurer les workflows automatiques](?article=onboarding-workflows)
