// ─── URL Router — syncs app state with browser URL ─────────────────
// URL format: /:tenantId/:pageSlug
// e.g. /acme/calendrier, /acme/parcours, /acme/tableau-de-bord

import type { AdminPage, DashboardPage } from './types';

// ─── SLUG MAPPINGS ──────────────────────────────────────────────────

const ADMIN_PAGE_TO_SLUG: Record<AdminPage, string> = {
  admin_dashboard: "tableau-de-bord",
  admin_parcours: "parcours",
  admin_suivi: "collaborateurs",
  admin_documents: "documents",
  admin_actions: "actions",
  admin_workflows: "workflows",
  admin_templates: "modeles-email",
  admin_phases: "phases",
  admin_equipes: "equipes",
  admin_messagerie: "messagerie",
  admin_notifications: "notifications",
  admin_entreprise: "entreprise",
  admin_profil: "profil",
  admin_gamification: "gamification",
  admin_nps: "nps",
  admin_livret: "livret",
  admin_contrats: "contrats",
  admin_integrations: "integrations",
  admin_users: "utilisateurs",
  admin_fields: "champs",
  admin_provisioning: "provisionnement",
  admin_cooptation: "cooptation",
  admin_apparence: "apparence",
  admin_donnees: "donnees-rgpd",
  admin_2fa: "securite-2fa",
  admin_abonnement: "abonnement",
  admin_equipements: "equipements",
  admin_signatures: "signatures",
  admin_roles: "roles",
  admin_calendar: "calendrier",
  admin_orgchart: "organigramme",
  admin_buddy: "parrainage",
  admin_audit: "audit",
  admin_password_policy: "securite",
  admin_assistant_ia: "assistant-ia",
  admin_manager_view: "vue-manager",
  admin_cohorte_rh: "cohorte",
  admin_templates_profil: "templates-profil",
  admin_quotes: "citations",
  admin_recurring_meetings: "rdv-recurrents",
  admin_bureaux: "bureaux",
  admin_feedback_hub: "feedback-hub",
};

const EMPLOYEE_PAGE_TO_SLUG: Record<DashboardPage, string> = {
  tableau_de_bord: "accueil",
  mes_actions: "mes-actions",
  messagerie: "messagerie",
  notifications: "notifications",
  entreprise: "entreprise",
  rapports: "rapports",
  suivi: "suivi",
  cooptation: "cooptation",
  satisfaction: "satisfaction",
  mon_profil: "mon-profil",
  assistant_ia: "assistant-ia",
  organigramme: "organigramme",
  mes_rdv: "mes-rdv",
  documents: "mes-signatures",
  mes_signatures: "mes-signatures",
  formations: "formations",
  bureaux: "bureaux",
  badges: "badges",
  mon_materiel: "mon-materiel",
};

// Build reverse maps
const SLUG_TO_ADMIN_PAGE: Record<string, AdminPage> = {};
for (const [page, slug] of Object.entries(ADMIN_PAGE_TO_SLUG)) {
  SLUG_TO_ADMIN_PAGE[slug] = page as AdminPage;
}

const SLUG_TO_EMPLOYEE_PAGE: Record<string, DashboardPage> = {};
for (const [page, slug] of Object.entries(EMPLOYEE_PAGE_TO_SLUG)) {
  SLUG_TO_EMPLOYEE_PAGE[slug] = page as DashboardPage;
}
// Legacy redirect: old "documents" slug → mes_signatures (merged page)
SLUG_TO_EMPLOYEE_PAGE["documents"] = "mes_signatures";

// ─── URL PARSING ────────────────────────────────────────────────────

export interface ParsedRoute {
  tenantId: string | null;
  adminPage: AdminPage | null;
  employeePage: DashboardPage | null;
  superAdmin: boolean;
}

/** Parse current URL path into route info */
export function parseCurrentUrl(): ParsedRoute {
  const path = window.location.pathname.replace(/^\/+|\/+$/g, ""); // trim slashes
  const segments = path.split("/").filter(Boolean);

  const result: ParsedRoute = { tenantId: null, adminPage: null, employeePage: null, superAdmin: false };

  if (segments.length === 0) return result;

  // First segment = tenant ID
  result.tenantId = segments[0];

  if (segments.length < 2) return result;

  const slug = segments[1].toLowerCase();

  // Check super admin
  if (slug === "super-admin") {
    result.superAdmin = true;
    return result;
  }

  // Try admin page first, then employee
  if (SLUG_TO_ADMIN_PAGE[slug]) {
    result.adminPage = SLUG_TO_ADMIN_PAGE[slug];
  } else if (SLUG_TO_EMPLOYEE_PAGE[slug]) {
    result.employeePage = SLUG_TO_EMPLOYEE_PAGE[slug];
  }

  return result;
}

// ─── URL BUILDING ───────────────────────────────────────────────────

function getTenantFromStorage(): string {
  return localStorage.getItem("illizeo_tenant_id") || "";
}

function buildPath(tenantId: string, slug: string): string {
  return `/${tenantId}/${slug}`;
}

/** Push URL for an admin page */
export function pushAdminPage(page: AdminPage): void {
  const tid = getTenantFromStorage();
  if (!tid) return;
  const slug = ADMIN_PAGE_TO_SLUG[page];
  if (!slug) return;
  const path = buildPath(tid, slug);
  if (window.location.pathname !== path) {
    window.history.pushState({ adminPage: page }, "", path);
  }
}

/** Push URL for an employee page */
export function pushEmployeePage(page: DashboardPage): void {
  const tid = getTenantFromStorage();
  if (!tid) return;
  const slug = EMPLOYEE_PAGE_TO_SLUG[page];
  if (!slug) return;
  const path = buildPath(tid, slug);
  if (window.location.pathname !== path) {
    window.history.pushState({ dashPage: page }, "", path);
  }
}

/** Push URL for super admin */
export function pushSuperAdmin(): void {
  const tid = getTenantFromStorage();
  if (!tid) return;
  const path = buildPath(tid, "super-admin");
  if (window.location.pathname !== path) {
    window.history.pushState({ superAdmin: true }, "", path);
  }
}

/** Replace URL without adding history entry (for initial load) */
export function replaceCurrentPage(role: "rh" | "employee", adminPage?: AdminPage, dashPage?: DashboardPage): void {
  const tid = getTenantFromStorage();
  if (!tid) return;
  let slug: string | undefined;
  if (role === "rh" && adminPage) {
    slug = ADMIN_PAGE_TO_SLUG[adminPage];
  } else if (role === "employee" && dashPage) {
    slug = EMPLOYEE_PAGE_TO_SLUG[dashPage];
  }
  if (!slug) return;
  const path = buildPath(tid, slug);
  if (window.location.pathname !== path) {
    window.history.replaceState({}, "", path);
  }
}

/** Set URL to tenant root (e.g. after login, before page nav) */
export function pushTenantRoot(tenantId: string): void {
  const path = `/${tenantId}`;
  if (window.location.pathname !== path) {
    window.history.replaceState({}, "", path);
  }
}

export { ADMIN_PAGE_TO_SLUG, EMPLOYEE_PAGE_TO_SLUG, SLUG_TO_ADMIN_PAGE, SLUG_TO_EMPLOYEE_PAGE };
