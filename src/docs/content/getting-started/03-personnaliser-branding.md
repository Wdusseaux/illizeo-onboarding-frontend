# Personnaliser le branding

Vos collaborateurs vivent leur expérience Illizeo dans un environnement aux couleurs de votre entreprise. Ce branding s'applique à l'interface, aux emails, aux documents générés et aux pages publiques (page de cooptation, signature électronique).

## Accéder aux paramètres de branding

Allez dans **Paramètres → Apparence → Branding**. Cette section est réservée aux rôles `admin` et `super_admin`.

Vous y configurez :

- Logo principal (header de l'app)
- Logo monochrome (filigranes, factures)
- Favicon (onglet du navigateur)
- Couleur primaire (CTA, liens, accents)
- Couleur secondaire (boutons secondaires, badges)
- Image de fond de l'écran de connexion

## Logos : formats recommandés

Pour un rendu parfait sur tous les écrans, utilisez :

- **Logo principal** : PNG transparent, 512×512 px minimum, ratio carré ou horizontal jusqu'à 4:1
- **Logo monochrome** : SVG ou PNG noir sur fond transparent, 256×256 px minimum
- **Favicon** : PNG carré 64×64 px (généré automatiquement en .ico)

Illizeo génère ensuite automatiquement les déclinaisons retina (2x, 3x) et les versions claires/sombres si vous fournissez les deux.

> 💡 Astuce : si vous n'avez qu'un logo couleur, l'IA Illizeo peut générer la version monochrome pour vous. Cliquez sur « Générer la version monochrome » sous le champ d'upload.

## Couleurs : sélecteur et accessibilité

Le sélecteur de couleurs accepte les formats hex (#0054A6), RGB et HSL. Illizeo vérifie automatiquement le **ratio de contraste WCAG AA** : si votre couleur primaire ne passe pas avec le texte blanc, un avertissement s'affiche.

Pour respecter votre charte tout en gardant l'accessibilité :

- Utilisez votre couleur primaire pour les **gros aplats** (boutons, headers)
- Évitez de l'utiliser pour des **petits textes** sur fond clair
- Préférez du blanc ou un noir adouci (#1a1a1a) pour les textes longs

## Branding des emails et documents

Le branding s'applique automatiquement à :

- Tous les emails transactionnels (invitation, rappel, notification)
- Les en-têtes des PDF de factures
- Les contrats DOCX générés (logo dans l'en-tête)
- Les pages publiques de cooptation et de signature

Vous pouvez personnaliser plus finement les emails via **Paramètres → Apparence → Templates email**.

> ⚠️ Important : modifier le logo n'impacte **pas** les contrats déjà générés ni les factures déjà émises. Seuls les nouveaux documents prennent le nouveau branding. C'est voulu : un PDF signé est immuable.

## Mode sombre

Illizeo propose un mode sombre que chaque utilisateur active depuis son profil. Vous pouvez forcer un mode par défaut au niveau de l'espace, mais l'utilisateur garde toujours le choix final.

## Et après ?

Une fois votre branding configuré, partagez un lien d'invitation avec votre équipe RH pour qu'ils découvrent l'espace à vos couleurs. Suivez le guide [Inviter mon équipe RH](?article=inviter-equipe-rh).
