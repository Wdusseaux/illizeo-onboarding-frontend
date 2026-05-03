# OCR pièces d'identité

L'OCR Illizeo utilise Claude Vision (Anthropic) pour extraire automatiquement les données des pièces d'identité (carte d'identité, passeport, permis de séjour). Cela évite à votre équipe RH de re-saisir manuellement les informations et réduit les erreurs de saisie.

## Comment ça marche

Quand un collaborateur upload une pièce d'identité (PNG, JPG, PDF), Illizeo :

1. Détecte le **type de document** (CI, passeport, permis B/C/L/G, etc.)
2. Identifie le **pays émetteur**
3. Extrait **13 champs** (selon le type)
4. Valide la cohérence
5. Pré-remplit la fiche du collaborateur

Le tout en moins de 5 secondes pour une photo claire.

## Les 13 champs extraits

Pour une carte d'identité ou un passeport :

- Nom de famille
- Prénom(s)
- Date de naissance
- Lieu de naissance
- Nationalité
- Sexe
- Numéro du document
- Date de délivrance
- Date d'expiration
- Autorité de délivrance
- Adresse (si présente)
- Numéro AVS / sécurité sociale (Suisse uniquement)
- MRZ (Machine Readable Zone) parsée

## Les types de documents reconnus

Illizeo reconnaît :

- **Carte d'identité** (FR, CH, DE, IT, ES, BE, LU)
- **Passeport** (tous pays)
- **Permis de séjour suisse** (B, C, L, G, F, S)
- **Carte de résident** (UE)
- **Permis de conduire** (extraction limitée, complément à la pièce d'identité)

## Uploader une pièce d'identité

Plusieurs canaux :

- Le **collaborateur** uploade depuis son espace (mobile ou desktop)
- Le **RH** uploade pour le compte du collaborateur
- **L'API** permet l'upload programmatique

Formats supportés :

- PNG, JPG, JPEG (5 Mo max par image)
- PDF (10 Mo max, jusqu'à 4 pages)
- HEIC (iPhone) — converti automatiquement

> 💡 Astuce : pour la meilleure qualité d'extraction, photographiez la pièce d'identité **à plat sur fond uni**, **bien éclairée**, et **sans reflets**. L'IA gère les flous légers mais pas les réflexions sur le hologramme.

## Validation et correction manuelle

Après l'extraction, l'IA présente les **13 champs** avec un **score de confiance** par champ (0 à 100 %).

- Champs **verts** (>90 %) : très probablement corrects
- Champs **jaunes** (70-90 %) : à vérifier rapidement
- Champs **rouges** (<70 %) : à vérifier impérativement, possiblement erronés

Le RH ou le collaborateur vérifie et corrige avant validation finale. Les corrections alimentent un système d'apprentissage anonymisé.

## Détection de fraude

Illizeo détecte automatiquement plusieurs anomalies :

- **Document expiré** (date < aujourd'hui)
- **Photo de photo** (capture d'écran d'une pièce d'identité)
- **MRZ incohérente** (la zone machine ne correspond pas au visible)
- **Date de naissance incohérente** avec l'âge du collaborateur déclaré

Les alertes sont remontées au RH pour vérification humaine. Illizeo **ne refuse jamais automatiquement** un document : c'est l'humain qui décide.

> ⚠️ Important : Illizeo n'est pas un service KYC/AML certifié. Pour des contrôles d'identité réglementaires (banque, finance), utilisez un service spécialisé (IDnow, Onfido) en plus.

## Sécurité et conservation

Les pièces d'identité sont des données **très sensibles** :

- Stockage chiffré AES-256 au repos
- Accès restreint aux RH (pas le manager)
- Audit log complet (qui a vu/téléchargé quand)
- Conservation = durée du contrat + 1 an, puis suppression auto

Les images ne sont **jamais utilisées pour entraîner** un modèle d'IA externe. Claude Vision traite l'image puis l'oublie.

## Quotas par plan

L'OCR est inclus dans tous les plans avec quotas mensuels :

- **Starter** : 50 OCR/mois
- **Pro** : 200 OCR/mois
- **Business** : 1 000 OCR/mois
- **Enterprise** : illimité

Au-delà du quota, achat de packs supplémentaires possible (10 CHF / 100 OCR).

## Et après ?

Pour aller plus loin :

1. [GED](?article=documents-ged) pour la gestion documentaire
2. [Contrats DOCX](?article=documents-contrats-docx) qui utilisent les données OCR
3. [IA OCR détaillée](?article=ia-ocr) pour le fonctionnement interne
