# Personnaliser le branding

Vos collaborateurs vivent leur expérience Illizeo dans un environnement aux couleurs de votre entreprise. Ce branding s'applique à l'interface admin, aux emails envoyés à vos employés, et aux pages publiques (cooptation, signature électronique).

## Accéder aux paramètres

Allez dans **Admin → Apparence**. Cette section nécessite la permission `apparence:edit`.

Vous y configurez :

- **Logo entreprise** (utilisé dans les emails envoyés aux collaborateurs)
- **Mode clair / sombre**
- **Langues actives**
- **Thème couleur** (couleur primaire des CTA, liens, accents)
- **Région & devise**, fuseau horaire
- **Format de date** et d'heure

## Logo entreprise — frame 600×150 px

C'est le logo affiché dans le bandeau supérieur de tous les emails envoyés depuis votre espace vers vos collaborateurs (notifications, rappels, invitations onboarding, templates email, etc.).

**Format conseillé** : horizontal, fond transparent, ratio 4:1 (ex. votre logo « pleine largeur »).

**Comment l'uploader :**

1. **Importer un logo** — PNG, JPG, SVG ou WebP, max 5 Mo.
2. **Recadrer dans la frame** — un aperçu en taille réelle s'affiche à côté de l'image. Trois sliders :
   - **Zoom** (50–300 %) pour grossir/réduire
   - **Position horizontale** pour décaler à gauche/droite
   - **Position verticale** pour décaler en haut/bas
3. **Enregistrer** — l'image est rendue en canvas 600×150 px, encodée en base64, et persistée dans `CompanySetting.custom_logo_full`.

Si aucun logo n'est défini, le logo Illizeo s'affiche par défaut.

> 💡 Astuce : avant d'envoyer un vrai email à votre équipe, allez dans **Admin → Templates emails**, ouvrez n'importe quel modèle, cliquez **Aperçu** pour vérifier le rendu de votre logo dans le bandeau, puis **Envoyer un test** sur votre adresse.

## Templates email rendus en HTML

Vous pouvez utiliser des balises HTML (`<h2>`, `<p>`, `<b>`, `<a>`…) dans les corps de templates. Le RichEditor produit du HTML qui est rendu tel quel dans l'email final. Les variables `{{prenom}}`, `{{nom}}`, `{{date_debut}}`, `{{lien}}`, etc. sont substituées au moment de l'envoi.

L'URL `{FRONTEND_URL}` du bouton CTA en bas de chaque email est automatiquement remplacée par l'URL de votre tenant (ex. `https://onboarding.illizeo.com/votre-espace`).

## Thème couleur

Choisissez parmi 8 presets ou utilisez le sélecteur custom (format hex). La couleur s'applique :

- Aux boutons CTA et liens dans l'app admin
- Aux boutons CTA dans les emails
- Aux badges et accents UI

> 💡 Astuce : la couleur s'applique en CSS variables, donc le changement est instantané sans rebuild.

## Mode sombre

Activez/désactivez globalement via le toggle en haut de la page. Chaque utilisateur peut surcharger le choix depuis son profil.

## Couleurs des écrans de login

Le gradient du fond de la page de login est configurable séparément via deux color pickers (début / fin de gradient) — voir **Apparence → Login**.

## Et après ?

Une fois votre branding configuré :

1. [Inviter votre équipe RH](?article=inviter-equipe-rh) pour qu'ils découvrent l'espace à vos couleurs
2. [Configurer vos templates emails](?article=onboarding-templates) avec votre logo dans le bandeau
3. [Activer les workflows automatiques](?article=onboarding-workflows) qui enverront ces emails
