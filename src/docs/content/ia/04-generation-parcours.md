# Génération de parcours IA

Vous décrivez votre besoin en langage naturel, l'IA génère un parcours d'onboarding (ou offboarding) complet en JSON, prêt à être utilisé. C'est une des fonctions IA les plus impressionnantes d'Illizeo : elle transforme 2 heures de configuration en 30 secondes.

## Comment ça marche

1. Vous écrivez un **prompt** descriptif (3 à 10 lignes)
2. L'IA Claude analyse les **paramètres clés** (poste, contrat, pays, contexte)
3. Elle génère un **parcours JSON** complet :
   - Phases adaptées à la durée et au contexte
   - Actions pertinentes à chaque phase
   - Responsables suggérés (RH, manager, IT, buddy)
   - Échéances calculées
4. Vous **éditez et publiez** dans l'éditeur de parcours

## Exemple de prompt

> « Onboarding pour un développeur full-stack senior en CDI à Lausanne, présentiel 3 jours par semaine, équipe de 8 personnes, technologies Laravel et React, buddy obligatoire, période d'essai de 3 mois, salaire 110k CHF, début prévu mi-mars. »

L'IA génère typiquement :

- **6 à 8 phases** (J-30, J-7, J0, J+7, J+30, J+60, J+90, J+100)
- **25 à 40 actions** réparties
- **Variables auto-remplies** ({{collaborateur.prenom}}, {{manager.prenom}})
- **Workflows liés** (relance contrat, notification équipe)

## Démarrer une génération

Allez dans **Espace admin → Parcours → Nouveau parcours → Générer par IA**.

1. Choisissez le **type de parcours** (onboarding, offboarding, crossboarding, reboarding)
2. Choisissez le **pays** (CH, FR, DE, IT, ES, etc.)
3. Choisissez la **langue** des actions
4. Tapez votre **prompt** descriptif
5. Cliquez sur **Générer**

L'IA produit un draft en 10-30 secondes. Vous arrivez sur l'éditeur avec le draft pré-rempli.

> 💡 Astuce : plus vous donnez de **contexte spécifique** (équipe, technologies, défis du poste), plus le parcours est adapté. Ajoutez vos contraintes culturelles (ex. « pas de pot d'arrivée », « buddy externe à l'équipe »).

## Affiner le résultat

Le parcours généré n'est **jamais parfait du premier coup**. Comptez 30 minutes d'ajustement :

- Renommez les actions pour matcher votre culture
- Supprimez les actions non pertinentes
- Ajoutez les spécificités de votre entreprise
- Ajustez les échéances selon vos process
- Connectez les workflows existants

## Itération du prompt

Si le résultat ne convient pas, vous pouvez :

- **Régénérer** avec le même prompt (résultat différent à chaque fois)
- **Affiner** le prompt avec plus de détails
- **Demander à l'IA** de modifier (« raccourcis le préboarding », « ajoute une action sécurité IT »)

L'IA garde le contexte de la conversation pour les modifications successives.

## Cas d'usage typiques

- Création d'un parcours pour un **nouveau type de poste** non couvert par les templates
- Génération d'un parcours **multi-sites international** complexe
- Création d'un parcours **d'urgence** (recrutement non prévu)
- Test de **différentes approches** sur un même poste

## Limitations

- L'IA peut **inventer des actions inutiles** (cafés réseau toutes les semaines)
- Les **mentions légales** générées doivent être vérifiées par un juriste
- L'IA ne **connaît pas votre culture** spécifique (l'éditer après)
- Le format JSON nécessite parfois des ajustements manuels

> ⚠️ Important : ne publiez jamais un parcours généré par IA **sans le relire intégralement**. Ce sont des suggestions, pas un parcours validé.

## Comparaison avec les templates

- **Template** : valide juridiquement, à jour des évolutions, couvre 80 % des besoins
- **Génération IA** : flexibilité totale, parfait pour les 20 % de cas spécifiques

Notre recommandation : utilisez les **templates** pour les cas standards, et la **génération IA** pour les cas exotiques.

## Quotas

- **Starter** : non disponible
- **Business** : 50 générations / mois
- **Enterprise** : illimité

## Et après ?

Pour aller plus loin :

1. [Templates de parcours](?article=onboarding-templates)
2. [Créer un parcours](?article=onboarding-creer-parcours)
3. [Vue d'ensemble des IA](?article=ia-overview)
