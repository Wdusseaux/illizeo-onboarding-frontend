# Génération de contrats DOCX

Illizeo génère automatiquement vos contrats de travail au format DOCX (et PDF) en fusionnant les données du collaborateur avec un template juridique. Plus besoin de copier-coller, plus d'erreurs de saisie, gain de temps : 15 minutes par contrat en moyenne.

## Le principe : DOCX + variables

Un template de contrat est un document Word classique (.docx) dans lequel vous insérez des **variables** entre doubles accolades :

- `{{collaborateur.civilite}} {{collaborateur.prenom}} {{collaborateur.nom}}`
- né(e) le `{{collaborateur.date_naissance}}` à `{{collaborateur.lieu_naissance}}`
- domicilié(e) `{{collaborateur.adresse}}`
- en qualité de `{{poste.titre}}`
- à compter du `{{date_arrivee}}`
- pour un salaire annuel de `{{remuneration.salaire_annuel}}` CHF brut

À la génération, Illizeo remplace toutes les variables par les valeurs réelles.

## Les variables disponibles

Variables collaborateur :

- `collaborateur.civilite`, `prenom`, `nom`, `nom_naissance`
- `collaborateur.date_naissance`, `lieu_naissance`, `nationalite`
- `collaborateur.adresse`, `code_postal`, `ville`, `pays`
- `collaborateur.email`, `telephone`
- `collaborateur.numero_avs` (Suisse), `numero_secu` (FR)

Variables poste :

- `poste.titre`, `niveau`, `coefficient`
- `poste.equipe`, `manager`, `site`
- `poste.type_contrat`, `duree`, `date_fin`
- `poste.temps_travail`, `forfait_jours`

Variables rémunération :

- `remuneration.salaire_annuel`, `mensuel`, `horaire`
- `remuneration.devise`
- `remuneration.13e_mois` (Suisse)
- `remuneration.primes`, `variables`

Variables société :

- `societe.nom_legal`, `forme_juridique`
- `societe.numero_ide`, `tva`
- `societe.adresse`, `cp`, `ville`, `pays`
- `societe.representant`, `qualite_representant`

## Créer un template

Allez dans **Documents → Templates → Nouveau template DOCX**.

1. Uploadez votre fichier .docx existant
2. Illizeo scanne les variables `{{...}}` détectées
3. Vérifie que toutes les variables existent dans le système
4. Vous valide ou signale les variables inconnues
5. Sauvegarde le template

Ou partez d'un template officiel Illizeo (voir [Templates par pays](?article=documents-templates-pays)) et adaptez-le.

> 💡 Astuce : pour insérer une variable dans Word, tapez simplement `{{nom_variable}}`. Pas besoin d'un plugin spécial. Illizeo détecte automatiquement la syntaxe.

## Les variables conditionnelles

Pour des sections optionnelles, utilisez des conditions :

- `{{#if poste.voiture_fonction}} ... {{/if}}`
- `{{#if pays_eq "CH"}} ... {{/if}}`
- `{{#unless temps_partiel}} ... {{/unless}}`

Le moteur de templating est basé sur **Handlebars**.

## Les variables formatées

Pour formater dates et montants :

- `{{format_date date_arrivee "DD MMMM YYYY"}}` → 15 janvier 2026
- `{{format_money salaire "CHF"}}` → 85 000.00 CHF
- `{{uppercase nom}}` → DUPONT
- `{{number_to_words salaire}}` → quatre-vingt-cinq mille

## Générer un contrat

Une fois le template prêt :

1. Sur la fiche du collaborateur → **Documents → Générer un contrat**
2. Choisissez le template
3. Vérifiez les variables (toutes doivent être renseignées)
4. Cliquez sur **Générer**

Illizeo produit :

- Le **DOCX** avec les valeurs fusionnées
- Le **PDF** correspondant
- Une **prévisualisation** dans le navigateur

> ⚠️ Important : si une variable obligatoire manque (salaire, date d'arrivée), la génération est bloquée. Renseignez d'abord toutes les variables sur la fiche du collaborateur, puis générez.

## Numérotation et archivage

Chaque contrat généré reçoit un numéro unique (ex. CDI-2026-0042) qui apparaît :

- En pied de page du document
- Dans la GED comme métadonnée
- Dans les exports CSV pour comptabilité

## Régénération

Si vous devez régénérer un contrat (correction de variable), Illizeo conserve l'ancienne version (« Brouillon ») et crée une **nouvelle version**. L'ancienne reste accessible via l'historique.

## Et après ?

Une fois le contrat généré :

1. [Signature électronique](?article=documents-signature)
2. [GED](?article=documents-ged) pour le retrouver
3. [Templates par pays](?article=documents-templates-pays) pour avoir les bonnes mentions légales
