# Paiement par carte ou virement

Illizeo accepte plusieurs moyens de paiement adaptés au B2B suisse et européen. Vous payez via **Stripe Checkout** pour les cartes bancaires, ou par **virement** pour les commandes annuelles ou triennales.

## Carte bancaire (Stripe)

Méthode privilégiée pour les abonnements **mensuels** ou **annuels** standards.

Cartes acceptées :

- Visa, Mastercard, American Express
- Cartes corporate (incluant les cartes de prépaiement)
- Apple Pay, Google Pay (mobile)

Le paiement se fait via **Stripe Checkout**, hébergé sur Stripe (vos données carte ne transitent jamais par Illizeo). Sécurité : 3D Secure 2 obligatoire pour les cartes européennes.

## Virement bancaire

Recommandé pour les **engagements annuels ou triennaux** > 5 000 CHF.

Workflow :

1. Vous choisissez **Virement** au moment de la souscription
2. Illizeo génère une **facture pro forma** avec coordonnées bancaires
3. Vous virez le montant depuis votre banque
4. La réception du virement (1 à 3 jours ouvrés) active votre abonnement
5. Vous recevez la **facture définitive** par email

Coordonnées bancaires :

- Banque : Banque cantonale de Genève (BCGE)
- IBAN : CH00 0000 0000 0000 0000 0
- BIC/SWIFT : BCGECHGGXXX
- Bénéficiaire : Illizeo SA, Genève

> 💡 Astuce : indiquez votre **n° client Illizeo** dans la communication du virement. Cela accélère le rapprochement (24h vs 3 jours).

## Prélèvement SEPA / LSV

Pour les clients européens habitués au prélèvement automatique :

- **SEPA Direct Debit** (Europe) : autorisation via Stripe
- **LSV/BDD** (Suisse) : prélèvement direct depuis votre compte CHF

Avantages : pas de relance de paiement, mensualisation possible, prévisible.

## Paiement annuel vs mensuel

- **Mensuel** : flexibilité maximale, 0 % de remise
- **Annuel** : -17 % par rapport au mensuel
- **Triennal** : -25 % (plans Business et Enterprise uniquement)

Le paiement annuel ou triennal se fait en une fois à la souscription ou au renouvellement.

## Devises

Illizeo facture dans la devise de votre choix :

- CHF (Suisse)
- EUR (zone euro)
- USD, GBP, CAD, AUD, JPY (autres marchés)

Le taux de change est figé à la **date de souscription** pour la durée de l'engagement.

## TVA et taxes

- Clients **suisses** : TVA suisse 8.1 % facturée en sus
- Clients **UE B2B** avec n° TVA valide : autoliquidation (TVA non facturée)
- Clients **UE B2C** : TVA française 20 % facturée
- Clients **hors UE** : pas de TVA

Voir [Factures et TVA](?article=billing-factures-tva).

## Modifier le moyen de paiement

Allez dans **Paramètres → Facturation → Moyen de paiement**.

Vous pouvez :

- Ajouter une nouvelle carte
- Supprimer l'ancienne
- Changer pour le virement (à la prochaine échéance)
- Mettre à jour les coordonnées bancaires SEPA

> ⚠️ Important : si votre carte expire, Illizeo vous notifie 30 jours avant. Si vous ne mettez pas à jour, l'abonnement passe en **suspension** au prochain prélèvement (mais sans suppression : vous avez 30 jours pour régulariser).

## Échec de paiement

Si un paiement échoue :

- **J+0** : email d'alerte avec lien de mise à jour
- **J+3** : nouvelle tentative automatique
- **J+7** : nouvelle tentative + email manager
- **J+14** : suspension de l'espace (lecture seule)
- **J+30** : suppression définitive (avec préavis)

Pendant la suspension, l'admin peut toujours payer en arriéré pour rétablir le service immédiatement.

## Centre de facturation

Dans **Paramètres → Facturation**, vous trouvez :

- Liste de toutes les **factures** émises
- Liste des **paiements** effectués
- **Téléchargement PDF** de chaque facture
- Mise à jour des **informations de facturation**
- **Historique** des changements de plan

## Adresse de facturation

L'adresse de facturation peut être différente de l'adresse de l'entreprise utilisatrice (cas de groupes).

- Renseignez via **Paramètres → Facturation → Adresse**
- Indiquez le **service comptabilité** comme destinataire
- Configurez l'**email de réception** des factures

## Et après ?

Pour aller plus loin :

1. [Factures et TVA](?article=billing-factures-tva)
2. [Changement de plan](?article=billing-changement-plan)
3. [Choisir un plan](?article=billing-choisir-plan)
