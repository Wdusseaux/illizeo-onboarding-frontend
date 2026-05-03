# OCR pièces d'identité

L'OCR (Optical Character Recognition) d'Illizeo s'appuie sur **Claude Vision** pour extraire automatiquement les données des pièces d'identité scannées ou photographiées. C'est l'une des features IA les plus utilisées au quotidien : elle économise 5 à 10 minutes par dossier.

## Comment fonctionne l'OCR Illizeo

Plutôt que d'utiliser un OCR classique + un parseur dédié, Illizeo utilise **Claude Vision en bout-en-bout** :

1. La photo est envoyée à Claude (TLS, hors stockage Anthropic)
2. Claude **détecte le type de document** (CI suisse, passeport français, etc.)
3. Claude **extrait les 13 champs** dans un JSON structuré
4. Claude évalue la **confiance** de chaque extraction
5. Illizeo valide les formats (date, numéros, MRZ)
6. Le résultat est affiché à l'utilisateur

Le tout en 3 à 5 secondes pour une photo nette.

## Types de documents supportés

L'OCR reconnaît :

- **Carte d'identité française** (recto + verso)
- **Carte d'identité suisse** (recto + verso)
- **Passeports** (tous pays, MRZ Type 3)
- **Permis de séjour suisse** B, C, L, G, F, S
- **Cartes de résident UE** (CR, CRA)
- **Permis de conduire** (extraction limitée)

## Les 13 champs extraits

Pour une carte d'identité ou un passeport :

1. Nom de famille
2. Prénom(s)
3. Date de naissance
4. Lieu de naissance
5. Nationalité
6. Sexe
7. Numéro du document
8. Date de délivrance
9. Date d'expiration
10. Autorité de délivrance
11. Adresse (si présente sur le document)
12. Numéro AVS (Suisse, si permis B/C)
13. MRZ parsée (zone de lecture machine)

## La validation par confiance

Chaque champ extrait reçoit un **score de confiance** :

- **Vert** (>90 %) — très fiable
- **Jaune** (70-90 %) — à vérifier rapidement
- **Rouge** (<70 %) — vérification obligatoire

L'utilisateur (RH ou collaborateur) doit valider les champs jaunes/rouges. Les champs verts peuvent être validés en bloc.

> 💡 Astuce : pour les noms à particules (« van der Berg », « de la Cruz »), l'OCR a parfois du mal. Vérifiez toujours visuellement, même si le score est vert.

## La détection d'anomalies

Au-delà de l'extraction, Claude détecte :

- **Document expiré** (date d'expiration < aujourd'hui)
- **Capture d'écran** (photo de photo, pas l'original)
- **MRZ incohérente** (zone machine ≠ visible)
- **Date de naissance irréaliste** (collaborateur déclaré 30 ans, document indique 60)
- **Photo masquée ou floue** intentionnellement

Les alertes sont **non-bloquantes** : c'est l'humain qui décide si la pièce est acceptée.

## La sécurité des données

Pendant le traitement :

- **TLS 1.3** chiffrement en transit
- **Pas de stockage** chez Anthropic (l'image est traitée puis oubliée)
- **Logs anonymisés** uniquement pour le debug
- **Pas d'utilisation pour entraînement**

Une fois stockée dans la GED Illizeo, la pièce est :

- Chiffrée AES-256 au repos
- Accessible uniquement aux RH et au collaborateur
- Conservée la durée du contrat + 1 an
- Auto-supprimée à l'échéance

Voir [GED](?article=documents-ged) et [RGPD](?article=admin-rgpd).

## Quotas par plan

L'OCR consomme des crédits IA :

- **Starter** : 50 OCR / mois
- **Pro** : 200 OCR / mois
- **Business** : 1 000 OCR / mois
- **Enterprise** : illimité

Au-delà du quota, achat de packs supplémentaires (10 CHF / 100 OCR).

## Cas où l'OCR ne suffit pas

L'OCR Illizeo n'est **pas un service KYC certifié**. Pour les usages réglementaires (banque, assurance, finance), utilisez un service KYC spécialisé (IDnow, Onfido, Veriff) **en plus** de notre OCR.

> ⚠️ Important : ne vous reposez pas uniquement sur l'OCR pour identifier un collaborateur. Vérifiez physiquement la pièce le jour de l'embauche, ou demandez une copie certifiée conforme.

## Limites connues

- Documents très anciens (avant 2010) parfois mal lus
- Cartes d'identité avec hologrammes très réfléchissants
- Photos prises en angle (>30°)
- Documents en alphabets non latins (cyrillique, arabe, asiatique) : extraction partielle

## Et après ?

Pour aller plus loin :

1. [GED](?article=documents-ged) pour stocker les pièces
2. [Contrats DOCX](?article=documents-contrats-docx) qui utilisent les données OCR
3. [Vue d'ensemble des IA](?article=ia-overview)
