# Illizeo Onboarding — Module de démo

## Développement local

```bash
npm install
npm run dev
# → http://localhost:3000
```

## Build production

```bash
npm run build
npm run preview   # pour tester le build localement
```

## Déploiement Infomaniak Jelastic

### Option 1 : Node.js (recommandé)

1. Créer un environnement Jelastic avec **Node.js 20**
2. Uploader le projet (zip ou git)
3. Dans le terminal SSH Jelastic :
   ```bash
   cd /var/www
   npm install
   npm run build
   npm install -g serve
   serve -s dist -l 8080
   ```
4. Configurer le port 8080 dans le load balancer

### Option 2 : Docker

1. Créer un environnement Jelastic avec **Docker Engine**
2. Uploader le projet
3. Build et run :
   ```bash
   docker build -t illizeo-onboarding .
   docker run -p 8080:3000 illizeo-onboarding
   ```

### Option 3 : Static (NGINX)

1. En local : `npm run build`
2. Créer un environnement Jelastic avec **NGINX**
3. Uploader le contenu du dossier `dist/` dans `/var/www/webroot/ROOT/`
4. C'est tout — NGINX sert les fichiers statiques

## Structure

```
illizeo-onboarding/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── Dockerfile
├── src/
│   ├── main.tsx          # Point d'entrée
│   └── Onboarding_v1.tsx # Module complet (employé + admin)
└── README.md
```

## Notes

- Le module démarre sur le **dashboard employé**
- Le switcher **Employé ↔ Admin RH** est dans la sidebar
- Pour activer le **preboarding** (inscription), changer `showPreboard` à `true` dans `Onboarding_v1.tsx` ligne ~414
- Toutes les données sont mockup (pas d'API backend)
