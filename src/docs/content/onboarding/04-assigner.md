# Assigner un parcours à un collaborateur

Une fois votre parcours créé et publié, il faut l'**assigner** à un collaborateur pour qu'il devienne actif. L'assignation déclenche les workflows automatiques (envoi du contrat, notifications) et rend les actions visibles aux assignés.

## Le workflow d'assignation

Allez dans **Espace admin → Collaborateurs → Nouveau collaborateur**.

1. Renseignez les **informations de base** (prénom, nom, email perso, poste, date d'arrivée)
2. Choisissez le **manager** et l'**équipe**
3. Sélectionnez le **parcours d'onboarding**
4. Choisissez un **buddy** (ou laissez l'IA proposer)
5. Cliquez sur **Créer et lancer le parcours**

Le parcours est instancié immédiatement avec toutes ses phases et actions, calculées par rapport à la date d'arrivée.

## Les informations clés à renseigner

Plus vous renseignez d'informations dès le départ, plus les variables dynamiques se remplissent :

- **Identité** — prénom, nom, civilité, date de naissance
- **Contact** — email perso (avant la création M365), téléphone
- **Poste** — intitulé, type de contrat, équipe, manager
- **Date d'arrivée** — pivot de toutes les échéances
- **Site** — adresse de rattachement (Genève, Lausanne, Paris, Berlin)
- **Rémunération** — salaire annuel ou horaire (visible RH uniquement)

Les champs marqués obligatoires bloquent la création tant qu'ils ne sont pas remplis.

> 💡 Astuce : si vous avez déjà signé un contrat ailleurs et avez les pièces d'identité, uploadez-les dès la création. L'OCR Illizeo extrait automatiquement nom, prénom, date de naissance, n° AVS, etc. Voir [OCR pièces d'identité](?article=documents-ocr).

## Choisir un buddy

Le buddy est le pair qui accompagne humainement le nouveau collaborateur (questions du quotidien, déjeuners, conseils informels). Trois façons de le choisir :

- **Manuellement** : vous sélectionnez la personne dans la liste
- **Suggéré par IA** : Illizeo propose les 3 meilleurs candidats avec un score 0-100 (basé sur affinités, fuseau, charge actuelle)
- **Aucun** : pas de buddy (déconseillé)

Voir [Matching buddy IA](?article=ia-buddy-matching).

## Les notifications déclenchées

L'assignation déclenche immédiatement :

- Email de **bienvenue** au collaborateur (vers son email perso)
- Email d'**information** au manager (avec lien vers le parcours)
- Email d'**information** au buddy (avec lien et conseils)
- Création de la **fiche IT** si l'intégration est connectée
- Calcul des **échéances** de chaque action

> ⚠️ Important : si la date d'arrivée est dans moins de 7 jours, certaines actions de préboarding (J-30, J-14) seront immédiatement marquées « en retard ». Illizeo affiche un avertissement à l'assignation pour vous permettre d'ajuster ou de désactiver ces actions.

## Modifier ou réassigner

Vous pouvez à tout moment :

- **Modifier la date d'arrivée** — toutes les échéances sont recalculées
- **Changer le manager** — les actions « manager » sont réassignées
- **Changer le buddy** — l'ancien est notifié, le nouveau aussi
- **Ajouter/supprimer des actions** ad hoc

## Et après ?

Après l'assignation :

1. [Suivre l'avancement du parcours](?article=onboarding-suivre)
2. [Configurer les workflows](?article=onboarding-workflows)
3. [Préparer la phase préboarding](?article=onboarding-preboarding)
