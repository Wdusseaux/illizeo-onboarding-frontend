# Phases et actions

Un parcours Illizeo est structuré en **phases** (regroupements temporels) qui contiennent des **actions** (tâches concrètes). Cette structure double permet à la fois de donner une vue macro de la progression et de descendre au détail de chaque tâche.

## Anatomie d'une phase

Chaque phase a :

- Un **nom** (ex. « Préboarding », « Première semaine »)
- Une **fenêtre temporelle** relative à la date d'arrivée (ex. J-30 à J0)
- Une **icône** et une **couleur** pour la timeline
- Un **objectif** affiché au collaborateur
- Une liste **d'actions** ordonnées

La phase est considérée terminée quand toutes ses actions obligatoires sont terminées.

## Les phases standards

Illizeo recommande 6 phases par défaut, modifiables :

1. **Préboarding** (J-30 à J-7) — administratif, contrat
2. **Veille du jour J** (J-7 à J-1) — préparation matériel, accueil
3. **Jour J** (J0) — accueil, présentation, remise des accès
4. **Première semaine** (J+1 à J+7) — formation, premières missions
5. **Premier mois** (J+8 à J+30) — bilan, NPS, intégration
6. **Période d'intégration** (J+31 à J+100) — bilan d'essai, objectifs

## Anatomie d'une action

Chaque action a :

- Un **titre** court (ex. « Signer le contrat »)
- Une **description** détaillée
- Un **type** (signature, upload, formulaire, réunion, vidéo, quiz, etc.)
- Un **responsable** (RH, manager, IT, buddy, collaborateur)
- Une **échéance** relative (ex. J-7)
- Un **statut** (à faire, en cours, terminé, en retard)
- Un caractère **obligatoire** ou **optionnel**

## Les responsables (assignees)

Une action peut être assignée à :

- Un **rôle** (ex. tous les RH) — la première personne du rôle qui agit prend la main
- Un **utilisateur nommé** (ex. Sophie Martin)
- Un **rôle de poste** (manager direct, buddy, IT du site)
- Le **collaborateur lui-même**

> 💡 Astuce : préférez les rôles aux personnes nommées. Si Sophie part en vacances, l'action assignée au rôle « RH » continue d'apparaître à toute l'équipe ; assignée à Sophie nommément, elle bloque.

## Les types d'actions

Voici les types les plus utilisés :

- **Signature** — document à signer électroniquement
- **Upload** — pièce à téléverser (RIB, pièce d'identité, diplôme)
- **Formulaire** — questionnaire structuré (allergies, contact d'urgence)
- **Réunion** — rendez-vous à planifier (avec lien Calendar)
- **Vidéo** — vidéo de présentation à visionner
- **Quiz** — validation de connaissances (charte, RGPD)
- **Visite** — checklist physique (locaux, postes de travail)
- **Custom** — type créé par vous

Voir [Personnaliser les types d'actions](?article=onboarding-types-actions).

## Dépendances et conditions

Pour des parcours sophistiqués, vous pouvez :

- Lier deux actions par une **dépendance** : l'action B ne s'active qu'après B
- Ajouter une **condition** : l'action n'apparaît que si une variable est vraie (ex. « si pays = Suisse »)
- Définir des **branches** : si X alors phase A, sinon phase B

> ⚠️ Important : restez sobre sur les dépendances. Trop de conditions rendent le parcours difficile à débugguer. Pour 95 % des onboardings, un parcours linéaire suffit.

## Et après ?

Maintenant que vous comprenez phases et actions :

1. [Assigner le parcours à un collaborateur](?article=onboarding-assigner)
2. [Suivre l'avancement](?article=onboarding-suivre)
3. [Automatiser avec des workflows](?article=onboarding-workflows)
