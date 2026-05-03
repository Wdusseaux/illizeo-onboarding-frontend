# Gestion documentaire (GED)

La GED Illizeo est un coffre-fort numérique RH qui stocke, organise et sécurise tous les documents liés à vos collaborateurs : contrats, avenants, certificats, pièces d'identité, justificatifs. Hébergée à Genève chez Infomaniak, elle est conforme RGPD et au droit suisse.

## L'arborescence par défaut

Chaque collaborateur dispose d'un dossier personnel structuré :

- **Identité** — pièce d'identité, permis de travail, photo
- **Contrat** — contrat initial, avenants, lettres
- **Rémunération** — fiches de paie, primes, AVS, LPP
- **Formation** — diplômes, certificats, attestations
- **Onboarding** — documents d'arrivée signés
- **Administratif** — RIB, contact d'urgence, mutuelle
- **Offboarding** — documents de départ
- **Médical** — visites médicales, certificats (accès très restreint)

Vous pouvez personnaliser l'arborescence via **Paramètres → GED → Structure**.

## Les sources des documents

Les documents arrivent dans la GED par 4 canaux :

- **Upload manuel** par RH ou collaborateur
- **Génération automatique** (contrats DOCX, voir [Contrats DOCX](?article=documents-contrats-docx))
- **Signature électronique** (DocuSign / UgoSign) qui dépose le PDF signé
- **Import en masse** (CSV + ZIP) lors de la migration

## Permissions et confidentialité

Par défaut :

- Le **collaborateur** voit ses propres documents
- Le **manager** voit certains documents (contrat sans rémunération, attestations)
- Les **RH** voient tout
- L'**audit log** trace chaque consultation et téléchargement

Vous configurez les permissions par **catégorie de document** via **Paramètres → GED → Permissions**.

> 💡 Astuce : créez une catégorie « Documents partagés » accessible aux managers (charte, livret d'accueil, etc.) pour leur éviter de demander aux RH à chaque fois.

## La recherche dans la GED

La barre de recherche en haut de la GED cherche dans :

- Les **noms de fichiers**
- Les **métadonnées** (date, auteur, catégorie)
- Le **contenu** des PDFs et documents Office (OCR full-text)
- Les **noms de personnes** liées au document

La recherche full-text est disponible à partir du plan **Pro**.

## Les versions de documents

Quand un document est modifié (avenant, nouvelle version), Illizeo conserve **toutes les versions** :

- Version actuelle (en haut de la liste)
- Versions précédentes accessibles via « Historique »
- Comparaison côte à côte de deux versions

Pour les contrats, c'est essentiel : vous devez pouvoir prouver quelle version a été signée à quelle date.

## La conservation et la suppression

Selon la nature du document, Illizeo applique des **durées de conservation** :

- Contrats et avenants : 10 ans après le départ
- Fiches de paie : 5 ans (FR) / 10 ans (CH)
- Pièces d'identité : durée du contrat + 1 an
- Documents médicaux : 10 ans après la visite
- Documents formation : 5 ans

Au-delà, suppression automatique (ou anonymisation, selon configuration). Voir [RGPD](?article=admin-rgpd).

> ⚠️ Important : les durées légales de conservation varient par pays. Configurez les règles via **Paramètres → GED → Conservation** en respectant le droit local.

## Le coffre-fort numérique pour le collaborateur

Le collaborateur accède à ses documents via **Mon espace → Mes documents**. Il peut :

- Consulter et télécharger
- Demander une copie certifiée
- Recevoir des notifications de nouveaux documents
- Récupérer tous ses documents au départ (RGPD : portabilité)

## Export et archivage

Pour vos besoins d'archivage légal :

- **Export PDF/A** d'un dossier complet (format pérenne)
- **Export CSV** des métadonnées
- **API** pour brancher un système d'archivage tiers

## Et après ?

Pour aller plus loin :

1. [Templates de documents par pays](?article=documents-templates-pays)
2. [OCR pièces d'identité](?article=documents-ocr)
3. [RGPD](?article=admin-rgpd)
