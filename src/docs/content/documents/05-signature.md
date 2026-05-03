# Signature électronique

Illizeo s'intègre avec **DocuSign** et **UgoSign** pour faire signer électroniquement vos contrats, NDA, avenants et règlements internes. La signature électronique a la même valeur juridique qu'une signature manuscrite (eIDAS en UE, ZertES en Suisse).

## DocuSign vs UgoSign

Deux options selon votre contexte :

- **DocuSign** — leader mondial, intégrations matures, prix plus élevé
- **UgoSign** — alternative suisse, conforme ZertES, plus économique

Si vous êtes une entreprise suisse avec des collaborateurs principalement suisses, **UgoSign est souvent le meilleur choix**. Pour les groupes internationaux, DocuSign offre plus de flexibilité.

## Connecter votre compte signature

Allez dans **Paramètres → Intégrations → DocuSign** (ou UgoSign).

1. Cliquez sur **Connecter**
2. Authentifiez-vous avec un compte admin DocuSign / UgoSign
3. Acceptez les permissions
4. Choisissez le **template de signature** par défaut (mise en page, ordre des signataires)

## Niveaux de signature

Trois niveaux de validité juridique :

- **Simple Electronic Signature (SES)** — clic sur « Je signe », valeur juridique standard
- **Advanced Electronic Signature (AES)** — vérification d'identité (SMS, email)
- **Qualified Electronic Signature (QES)** — niveau le plus élevé, équivalent strict de la signature manuscrite, requis pour certains actes

Pour un contrat de travail standard, **AES suffit** dans la plupart des juridictions. Pour une lettre de licenciement ou un accord transactionnel, préférez **QES**.

> 💡 Astuce : la QES nécessite que le signataire ait une identité numérique vérifiée (SwissID en Suisse, FranceConnect en France). Si ce n'est pas le cas, l'AES + signature manuscrite scannée est un bon compromis.

## Envoyer un document à signer

Depuis la fiche du collaborateur ou le parcours :

1. Cliquez sur **Envoyer pour signature**
2. Choisissez le **document** (généré ou uploadé)
3. Choisissez les **signataires** (collaborateur, employeur, témoin)
4. Définissez l'**ordre** de signature (séquentiel ou parallèle)
5. Choisissez le **niveau** (SES, AES, QES)
6. Cliquez sur **Envoyer**

Le signataire reçoit un email avec un lien sécurisé. Il signe en quelques clics depuis son ordinateur ou son mobile.

## Les emplacements de signature

Dans votre template DOCX, vous pouvez insérer des **balises de signature** :

- `{{sign:employer}}` — emplacement de la signature employeur
- `{{sign:employee}}` — emplacement de la signature collaborateur
- `{{sign:witness}}` — témoin si applicable
- `{{date:employee}}` — date auto-remplie au moment de la signature

À l'envoi, Illizeo positionne automatiquement les zones cliquables aux bons endroits.

## Suivi des signatures

Sur la fiche du document, vous voyez en temps réel :

- Statut (envoyé, ouvert, signé, refusé, expiré)
- Horodatage de chaque action
- Adresse IP et device du signataire
- Certificat de signature téléchargeable

> ⚠️ Important : un document signé électroniquement est **immuable**. Si vous devez modifier après signature, vous créez un avenant ou un nouveau contrat. Ne supprimez jamais un document signé.

## Le certificat de preuve

Chaque signature électronique génère un **certificat de preuve** PDF qui détaille :

- Identité des signataires (avec moyens d'authentification)
- Horodatage de chaque signature
- Hash cryptographique du document
- Validation TSA (timestamp authority)

Ce certificat est joint automatiquement au PDF signé dans la GED. Il vaut **preuve juridique** en cas de contestation.

## Relances automatiques

Si un signataire n'a pas signé sous 48h, Illizeo envoie automatiquement une relance. Configurez les délais via **Paramètres → Signature → Relances**.

## Coûts

- DocuSign : facturation à l'enveloppe (3 à 8 CHF / enveloppe selon plan)
- UgoSign : facturation au signataire (1 à 3 CHF / signataire)

Ces coûts sont **séparés** de votre abonnement Illizeo. Vous payez directement votre fournisseur de signature.

## Et après ?

Pour aller plus loin :

1. [GED](?article=documents-ged) pour stocker les documents signés
2. [Contrats DOCX](?article=documents-contrats-docx)
3. [Workflows automatiques](?article=onboarding-workflows) pour automatiser l'envoi
