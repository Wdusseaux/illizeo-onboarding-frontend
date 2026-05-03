/**
 * Help Center / User documentation registry.
 *
 * Each article is a separate Markdown file under src/docs/content/.
 * Articles are loaded eagerly by Vite's import.meta.glob so they're bundled
 * into a single chunk — no runtime fetch needed.
 *
 * To add a new article:
 *  1. Create the .md file under src/docs/content/<section>/
 *  2. Add an entry to the right section below
 *  3. Done — it appears in the sidebar
 */

export interface DocArticle {
  slug: string;
  title: string;
  file: string; // relative to src/docs/content/
  keywords?: string[]; // for search
}

export interface DocSection {
  id: string;
  title: string;
  iconName: string; // lucide icon name
  articles: DocArticle[];
}

export const DOCS_SECTIONS: DocSection[] = [
  {
    id: 'getting-started',
    title: 'Démarrer',
    iconName: 'Rocket',
    articles: [
      { slug: 'bienvenue', title: 'Bienvenue sur Illizeo', file: 'getting-started/01-bienvenue.md', keywords: ['intro', 'présentation', 'overview'] },
      { slug: 'configurer-espace', title: 'Configurer mon espace', file: 'getting-started/02-configurer-espace.md', keywords: ['setup', 'wizard', 'configuration'] },
      { slug: 'personnaliser-branding', title: 'Personnaliser le branding', file: 'getting-started/03-personnaliser-branding.md', keywords: ['logo', 'couleurs', 'identité'] },
      { slug: 'inviter-equipe-rh', title: 'Inviter mon équipe RH', file: 'getting-started/04-inviter-equipe-rh.md', keywords: ['utilisateurs', 'invitation', 'équipe'] },
      { slug: 'connecter-integrations', title: 'Connecter mes intégrations', file: 'getting-started/05-connecter-integrations.md', keywords: ['microsoft', 'slack', 'docusign', 'sso'] },
    ],
  },
  {
    id: 'onboarding',
    title: 'Onboarding',
    iconName: 'Sparkles',
    articles: [
      { slug: 'onboarding-overview', title: 'Vue d\'ensemble Onboarding', file: 'onboarding/01-overview.md' },
      { slug: 'onboarding-creer-parcours', title: 'Créer un parcours d\'onboarding', file: 'onboarding/02-creer-parcours.md' },
      { slug: 'onboarding-phases-actions', title: 'Phases et actions', file: 'onboarding/03-phases-actions.md' },
      { slug: 'onboarding-assigner', title: 'Assigner un parcours à un collaborateur', file: 'onboarding/04-assigner.md' },
      { slug: 'onboarding-suivre', title: 'Suivre l\'avancement', file: 'onboarding/05-suivre.md' },
      { slug: 'onboarding-workflows', title: 'Workflows automatiques', file: 'onboarding/06-workflows.md' },
      { slug: 'onboarding-templates', title: 'Templates de parcours', file: 'onboarding/07-templates.md' },
      { slug: 'onboarding-types-actions', title: 'Personnaliser les types d\'actions', file: 'onboarding/08-types-actions.md' },
      { slug: 'onboarding-preboarding', title: 'Préboarding (J-30 à J0)', file: 'onboarding/09-preboarding.md' },
      { slug: 'onboarding-100-jours', title: 'Onboarding (J0 à J+100)', file: 'onboarding/10-100-jours.md' },
    ],
  },
  {
    id: 'offboarding',
    title: 'Offboarding',
    iconName: 'LogOut',
    articles: [
      { slug: 'offboarding-overview', title: 'Vue d\'ensemble Offboarding', file: 'offboarding/01-overview.md' },
      { slug: 'offboarding-creer-parcours', title: 'Créer un parcours d\'offboarding', file: 'offboarding/02-creer-parcours.md' },
      { slug: 'offboarding-restitution-materiel', title: 'Restitution du matériel', file: 'offboarding/03-restitution-materiel.md' },
      { slug: 'offboarding-desactivation-acces', title: 'Désactivation des accès', file: 'offboarding/04-desactivation-acces.md' },
      { slug: 'offboarding-exit-interview', title: 'Exit interview', file: 'offboarding/05-exit-interview.md' },
    ],
  },
  {
    id: 'cycles',
    title: 'Crossboarding & Reboarding',
    iconName: 'RotateCcw',
    articles: [
      { slug: 'crossboarding', title: 'Crossboarding (mobilité interne)', file: 'cycles/01-crossboarding.md' },
      { slug: 'reboarding', title: 'Reboarding (retour de longue absence)', file: 'cycles/02-reboarding.md' },
      { slug: 'cycles-comparison', title: 'Différences entre les 4 cycles', file: 'cycles/03-comparison.md' },
    ],
  },
  {
    id: 'documents',
    title: 'Documents & Contrats',
    iconName: 'FileText',
    articles: [
      { slug: 'documents-ged', title: 'Gestion documentaire (GED)', file: 'documents/01-ged.md' },
      { slug: 'documents-templates-pays', title: 'Templates de documents par pays', file: 'documents/02-templates-pays.md' },
      { slug: 'documents-ocr', title: 'OCR pièces d\'identité', file: 'documents/03-ocr.md' },
      { slug: 'documents-contrats-docx', title: 'Génération de contrats DOCX', file: 'documents/04-contrats-docx.md' },
      { slug: 'documents-signature', title: 'Signature électronique', file: 'documents/05-signature.md' },
    ],
  },
  {
    id: 'cooptation',
    title: 'Cooptation',
    iconName: 'Handshake',
    articles: [
      { slug: 'cooptation-programme', title: 'Programme de cooptation', file: 'cooptation/01-programme.md' },
      { slug: 'cooptation-recompenses', title: 'Configurer les récompenses', file: 'cooptation/02-recompenses.md' },
      { slug: 'cooptation-campagnes', title: 'Lancer une campagne', file: 'cooptation/03-campagnes.md' },
      { slug: 'cooptation-leaderboard', title: 'Leaderboard et statistiques', file: 'cooptation/04-leaderboard.md' },
    ],
  },
  {
    id: 'materiel',
    title: 'Matériel & équipements',
    iconName: 'Laptop',
    articles: [
      { slug: 'materiel-inventaire', title: 'Inventaire matériel', file: 'materiel/01-inventaire.md' },
      { slug: 'materiel-packs', title: 'Packs d\'équipement par poste', file: 'materiel/02-packs.md' },
      { slug: 'materiel-provisionnement', title: 'Provisionnement automatique', file: 'materiel/03-provisionnement.md' },
    ],
  },
  {
    id: 'ia',
    title: 'IA Illizeo',
    iconName: 'Sparkles',
    articles: [
      { slug: 'ia-overview', title: 'Les 8 IA Illizeo', file: 'ia/01-overview.md' },
      { slug: 'ia-chatbot', title: 'Chatbot RH (employé)', file: 'ia/02-chatbot.md' },
      { slug: 'ia-ocr', title: 'OCR pièces d\'identité', file: 'ia/03-ocr.md' },
      { slug: 'ia-generation-parcours', title: 'Génération de parcours IA', file: 'ia/04-generation-parcours.md' },
      { slug: 'ia-buddy-matching', title: 'Matching buddy IA', file: 'ia/05-buddy-matching.md' },
      { slug: 'ia-sentiment-nps', title: 'Analyse sentiment NPS', file: 'ia/06-sentiment-nps.md' },
      { slug: 'ia-turnover', title: 'Détection turnover', file: 'ia/07-turnover.md' },
      { slug: 'ia-resume-bot-proactif', title: 'Résumé hebdo + Bot proactif', file: 'ia/08-resume-bot-proactif.md' },
    ],
  },
  {
    id: 'admin',
    title: 'Administration',
    iconName: 'ShieldCheck',
    articles: [
      { slug: 'admin-utilisateurs-roles', title: 'Utilisateurs et rôles', file: 'admin/01-utilisateurs-roles.md' },
      { slug: 'admin-permissions-champs', title: 'Permissions et champs', file: 'admin/02-permissions-champs.md' },
      { slug: 'admin-securite-2fa', title: 'Sécurité et 2FA', file: 'admin/03-securite-2fa.md' },
      { slug: 'admin-rgpd', title: 'RGPD et conservation des données', file: 'admin/04-rgpd.md' },
      { slug: 'admin-audit-log', title: 'Journal d\'audit', file: 'admin/05-audit-log.md' },
      { slug: 'admin-notifications', title: 'Configuration des notifications', file: 'admin/06-notifications.md', keywords: ['notifications', 'email', 'in-app', 'canaux'] },
    ],
  },
  {
    id: 'billing',
    title: 'Abonnement & facturation',
    iconName: 'CircleDollarSign',
    articles: [
      { slug: 'billing-choisir-plan', title: 'Choisir un plan', file: 'billing/01-choisir-plan.md' },
      { slug: 'billing-paiement', title: 'Paiement par carte ou virement', file: 'billing/02-paiement.md' },
      { slug: 'billing-factures-tva', title: 'Factures et TVA', file: 'billing/03-factures-tva.md' },
      { slug: 'billing-changement-plan', title: 'Changement et annulation de plan', file: 'billing/04-changement-plan.md' },
    ],
  },
  {
    id: 'collaborateur',
    title: 'Pour les collaborateurs',
    iconName: 'Users',
    articles: [
      { slug: 'collab-premier-jour', title: 'Mon premier jour sur Illizeo', file: 'collaborateur/01-premier-jour.md' },
      { slug: 'collab-mon-parcours', title: 'Mon parcours et mes actions', file: 'collaborateur/02-mon-parcours.md' },
      { slug: 'collab-documents-signatures', title: 'Mes documents et signatures', file: 'collaborateur/03-documents-signatures.md' },
      { slug: 'collab-messagerie-ia', title: 'La messagerie et l\'assistant IA', file: 'collaborateur/04-messagerie-ia.md' },
    ],
  },
  {
    id: 'integrations-api',
    title: 'API & Intégrations',
    iconName: 'Plug',
    articles: [
      { slug: 'api-authentification', title: 'Authentification API', file: 'integrations-api/01-authentification.md' },
      { slug: 'api-webhooks', title: 'Webhooks', file: 'integrations-api/02-webhooks.md' },
      { slug: 'api-sso-microsoft', title: 'SSO Microsoft / Google', file: 'integrations-api/03-sso.md' },
    ],
  },
  {
    id: 'faq',
    title: 'FAQ',
    iconName: 'HelpCircle',
    articles: [
      { slug: 'faq-generale', title: 'Questions fréquentes', file: 'faq/01-faq.md' },
    ],
  },
];

/**
 * Eager-load all markdown content via Vite's glob import.
 * Result: { './content/getting-started/01-bienvenue.md': '<markdown string>', ... }
 */
const articleContents = import.meta.glob('./content/**/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>;

/**
 * Get the raw Markdown content of an article by its file path.
 */
export function getArticleContent(file: string): string {
  const key = `./content/${file}`;
  return articleContents[key] || `# Article introuvable\n\nLe fichier \`${file}\` n'existe pas encore.`;
}

/**
 * Find an article by its slug across all sections.
 */
export function findArticle(slug: string): { section: DocSection; article: DocArticle } | null {
  for (const section of DOCS_SECTIONS) {
    const article = section.articles.find((a) => a.slug === slug);
    if (article) return { section, article };
  }
  return null;
}

/**
 * Total article count for analytics / display.
 */
export function getTotalArticleCount(): number {
  return DOCS_SECTIONS.reduce((sum, s) => sum + s.articles.length, 0);
}
