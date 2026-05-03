import { apiFetch, setToken, clearToken } from './client';

// ─── Auth ───────────────────────────────────────────────────
export interface AuthUser {
  id: number;
  name: string;
  email: string;
  roles: string[];
  permissions: string[];
  collaborateur_id: number | null;
}

interface AuthResponse {
  user: AuthUser;
  token: string;
}

export async function login(email: string, password: string): Promise<AuthUser | { two_factor_required: true; email: string }> {
  const res = await apiFetch<AuthResponse & { two_factor_required?: boolean }>('/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  if (res.two_factor_required) {
    return { two_factor_required: true, email };
  }
  setToken(res.token);
  return res.user;
}

export async function register(name: string, email: string, password: string, password_confirmation: string): Promise<AuthUser> {
  const res = await apiFetch<AuthResponse>('/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password, password_confirmation }),
  });
  setToken(res.token);
  return res.user;
}

export async function logout(): Promise<void> {
  try {
    await apiFetch<void>('/logout', { method: 'POST' });
  } finally {
    clearToken();
  }
}

export async function getAuthUser(): Promise<AuthUser> {
  return apiFetch<AuthUser>('/user');
}

// ─── Helpers ────────────────────────────────────────────────
function isoToFr(iso: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}

// ─── Collaborateurs ─────────────────────────────────────────
interface ApiCollaborateur {
  id: number; prenom: string; nom: string; email: string; poste: string;
  site: string; departement: string; date_debut: string; phase: string;
  progression: number; status: string; docs_valides: number; docs_total: number;
  actions_completes: number; actions_total: number; initials: string;
  couleur: string; photo: string | null; parcours_id: number | null;
  manager_id: number | null; hr_manager_id: number | null;
  manager?: { id: number; prenom: string; nom: string } | null;
  hr_manager?: { id: number; prenom: string; nom: string } | null;
  parcours?: any; groupes?: any[];
  // Extended fields
  civilite?: string; date_naissance?: string; nationalite?: string; numero_avs?: string;
  telephone?: string; adresse?: string; ville?: string; code_postal?: string; pays?: string; iban?: string;
  type_contrat?: string; salaire_brut?: string; devise?: string; taux_activite?: string;
  periode_essai?: string; date_fin_essai?: string;
  matricule?: string; manager_nom?: string;
  job_title?: string; job_family?: string; job_code?: string; job_level?: string;
  employment_type?: string; date_fin_contrat?: string; motif_embauche?: string;
  position_title?: string; position_code?: string; business_unit?: string; division?: string;
  cost_center?: string; location_code?: string; work_schedule?: string; fte?: string;
  [key: string]: any;
}

export function transformCollaborateur(c: ApiCollaborateur) {
  return {
    id: c.id, prenom: c.prenom, nom: c.nom, email: c.email, poste: c.poste, site: c.site,
    departement: c.departement, dateDebut: isoToFr(c.date_debut), phase: c.phase,
    progression: c.progression, status: c.status as "en_cours" | "en_retard" | "termine",
    docsValides: c.docs_valides, docsTotal: c.docs_total,
    actionsCompletes: c.actions_completes, actionsTotal: c.actions_total,
    initials: c.initials, color: c.couleur, parcours_id: c.parcours_id ?? undefined,
    managerId: c.manager_id, hrManagerId: c.hr_manager_id,
    manager: c.manager ?? null, hrManager: c.hr_manager ?? null,
    user_id: (c as any).user_id ?? null, photo: c.photo ?? null,
    // Extended fields — pass through as-is
    civilite: c.civilite || null, date_naissance: c.date_naissance || null, nationalite: c.nationalite || null,
    numero_avs: c.numero_avs || null, telephone: c.telephone || null, adresse: c.adresse || null,
    ville: c.ville || null, code_postal: c.code_postal || null, pays: c.pays || null, iban: c.iban || null,
    type_contrat: c.type_contrat || null, salaire_brut: c.salaire_brut || null, devise: c.devise || null,
    taux_activite: c.taux_activite || null, periode_essai: c.periode_essai || null,
    date_fin_essai: c.date_fin_essai || null,
    matricule: c.matricule || null, manager_nom: c.manager_nom || null,
    job_title: c.job_title || null, job_family: c.job_family || null, job_code: c.job_code || null,
    job_level: c.job_level || null, employment_type: c.employment_type || null,
    date_fin_contrat: c.date_fin_contrat || null, motif_embauche: c.motif_embauche || null,
    position_title: c.position_title || null, position_code: c.position_code || null,
    business_unit: c.business_unit || null, division: c.division || null,
    cost_center: c.cost_center || null, location_code: c.location_code || null,
    work_schedule: c.work_schedule || null, fte: c.fte || null,
  };
}

export async function getCollaborateurs() {
  const raw = await apiFetch<ApiCollaborateur[]>('/collaborateurs');
  return raw.map(transformCollaborateur);
}

export async function createCollaborateur(data: Record<string, any>) {
  return apiFetch<ApiCollaborateur>('/collaborateurs', { method: 'POST', body: JSON.stringify(data) });
}

export async function updateCollaborateur(id: number, data: Record<string, any>) {
  return apiFetch<ApiCollaborateur>(`/collaborateurs/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

export async function deleteCollaborateur(id: number) {
  return apiFetch<void>(`/collaborateurs/${id}`, { method: 'DELETE' });
}

export async function purgeDemoCollaborateurs() {
  return apiFetch<{ deleted: number }>('/collaborateurs/purge-demo', { method: 'POST' });
}

// ─── Parcours ───────────────────────────────────────────────
interface ApiParcours {
  id: number; nom: string; categorie_id: number; actions_count: number;
  docs_count: number; collaborateurs_actifs: number; status: string;
  categorie?: { id: number; slug: string; nom: string };
  phases?: { id: number; nom: string }[];
}

export function transformParcours(p: ApiParcours) {
  return {
    id: p.id, nom: p.nom,
    phases: p.phases ? p.phases.map(ph => ph.nom) : [],
    actionsCount: p.actions_count, docsCount: p.docs_count,
    collaborateursActifs: p.collaborateurs_actifs,
    status: p.status as "actif" | "brouillon" | "archive",
    categorie: (p.categorie?.slug || 'onboarding') as "onboarding" | "offboarding" | "crossboarding" | "reboarding",
    translations: (p as any).translations || {},
  };
}

export async function getParcours() {
  const raw = await apiFetch<ApiParcours[]>('/parcours');
  return raw.map(transformParcours);
}

export async function createParcours(data: Record<string, any>) {
  return apiFetch<ApiParcours>('/parcours', { method: 'POST', body: JSON.stringify(data) });
}

export async function updateParcours(id: number, data: Record<string, any>) {
  return apiFetch<ApiParcours>(`/parcours/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

export async function deleteParcours(id: number) {
  return apiFetch<void>(`/parcours/${id}`, { method: 'DELETE' });
}

export async function duplicateParcours(id: number) {
  return apiFetch<any>(`/parcours/${id}/duplicate`, { method: 'POST' });
}

// ─── Actions ────────────────────────────────────────────────
interface ApiAction {
  id: number; titre: string; action_type_id: number; phase_id: number | null;
  parcours_id: number | null; delai_relatif: string; obligatoire: boolean;
  description: string; lien_externe: string | null; duree_estimee: string | null;
  xp?: number; heure_default?: string | null; accompagnant_role?: string | null;
  pieces_requises: string[] | null; assignation_mode: string;
  assignation_valeurs: string[] | null;
  options?: any;
  action_type?: { id: number; slug: string; label: string };
  phase?: { id: number; nom: string };
  parcours?: { id: number; nom: string };
}

export function transformAction(a: ApiAction) {
  return {
    id: a.id, titre: a.titre,
    type: (a.action_type?.slug || 'tache') as any,
    phase: a.phase?.nom || '', delaiRelatif: a.delai_relatif,
    obligatoire: a.obligatoire, description: a.description,
    assignation: { mode: a.assignation_mode as any, valeurs: a.assignation_valeurs || [] },
    lienExterne: a.lien_externe || undefined,
    dureeEstimee: a.duree_estimee || undefined,
    xp: a.xp ?? 50,
    heureDefault: a.heure_default || undefined,
    accompagnantRole: a.accompagnant_role || undefined,
    parcours: a.parcours?.nom || '',
    parcours_id: a.parcours_id || null,
    piecesRequises: a.pieces_requises || undefined,
    options: a.options || undefined,
    translations: (a as any).translations || {},
  };
}

export async function getActions() {
  const raw = await apiFetch<ApiAction[]>('/actions');
  return raw.map(transformAction);
}

export async function createAction(data: Record<string, any>) {
  return apiFetch<ApiAction>('/actions', { method: 'POST', body: JSON.stringify(data) });
}

export async function updateAction(id: number, data: Record<string, any>) {
  return apiFetch<ApiAction>(`/actions/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

export async function deleteAction(id: number) {
  return apiFetch<void>(`/actions/${id}`, { method: 'DELETE' });
}

// ─── Phases ─────────────────────────────────────────────────
interface ApiPhase {
  id: number; nom: string; delai_debut: string; delai_fin: string;
  couleur: string; icone: string; actions_defaut: number; ordre: number;
  active?: boolean;
  parcours_id: number | null;
  parcours?: { id: number; nom: string }[];
}

export function transformPhase(ph: ApiPhase) {
  return {
    id: ph.id, nom: ph.nom, delaiDebut: ph.delai_debut, delaiFin: ph.delai_fin,
    couleur: ph.couleur, iconName: ph.icone as any, actionsDefaut: ph.actions_defaut,
    active: ph.active !== false,
    parcoursIds: ph.parcours ? ph.parcours.map(p => p.id) : [],
    parcoursNoms: ph.parcours ? ph.parcours.map(p => p.nom) : [],
    translations: (ph as any).translations || {},
  };
}

export async function getPhases() {
  const raw = await apiFetch<ApiPhase[]>('/phases');
  return raw.map(transformPhase);
}

export async function createPhase(data: Record<string, any>) {
  return apiFetch<ApiPhase>('/phases', { method: 'POST', body: JSON.stringify(data) });
}

export async function updatePhase(id: number, data: Record<string, any>) {
  return apiFetch<ApiPhase>(`/phases/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

export async function deletePhase(id: number) {
  return apiFetch<void>(`/phases/${id}`, { method: 'DELETE' });
}

// ─── Groupes ────────────────────────────────────────────────
interface ApiGroupe {
  id: number; nom: string; description: string; couleur: string;
  critere_type: string | null; critere_valeur: string | null;
  collaborateurs?: { id: number; prenom: string; nom: string }[];
}

export function transformGroupe(g: ApiGroupe) {
  return {
    id: g.id, nom: g.nom, description: g.description,
    membres: g.collaborateurs ? g.collaborateurs.map(c => `${c.prenom} ${c.nom}`) : [],
    couleur: g.couleur,
    critere_type: g.critere_type, critere_valeur: g.critere_valeur,
    critereAuto: g.critere_type ? { type: g.critere_type as any, valeur: g.critere_valeur || '' } : undefined,
    collaborateurs: g.collaborateurs || [],
    translations: (g as any).translations || {},
  };
}

export async function getGroupes() {
  const raw = await apiFetch<ApiGroupe[]>('/groupes');
  return raw.map(transformGroupe);
}

export async function createGroupe(data: Record<string, any>) {
  return apiFetch<ApiGroupe>('/groupes', { method: 'POST', body: JSON.stringify(data) });
}

export async function updateGroupe(id: number, data: Record<string, any>) {
  return apiFetch<ApiGroupe>(`/groupes/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

export async function deleteGroupe(id: number) {
  return apiFetch<void>(`/groupes/${id}`, { method: 'DELETE' });
}

// ─── Workflows ──────────────────────────────────────────────
interface ApiWorkflow {
  id: number; nom: string; declencheur: string; action: string;
  destinataire: string; actif: boolean;
}

export async function getWorkflows() {
  return apiFetch<ApiWorkflow[]>('/workflows');
}

export async function createWorkflow(data: Record<string, any>) {
  return apiFetch<ApiWorkflow>('/workflows', { method: 'POST', body: JSON.stringify(data) });
}

export async function updateWorkflow(id: number, data: Record<string, any>) {
  return apiFetch<ApiWorkflow>(`/workflows/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

export async function deleteWorkflow(id: number) {
  return apiFetch<void>(`/workflows/${id}`, { method: 'DELETE' });
}

// ─── Email Templates ────────────────────────────────────────
interface ApiEmailTemplate {
  id: number; nom: string; sujet: string; declencheur: string;
  variables: string[]; actif: boolean;
}

export async function getEmailTemplates() {
  return apiFetch<ApiEmailTemplate[]>('/email-templates');
}

export async function createEmailTemplate(data: Record<string, any>) {
  return apiFetch<ApiEmailTemplate>('/email-templates', { method: 'POST', body: JSON.stringify(data) });
}

export async function updateEmailTemplate(id: number, data: Record<string, any>) {
  return apiFetch<ApiEmailTemplate>(`/email-templates/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

export async function deleteEmailTemplate(id: number) {
  return apiFetch<void>(`/email-templates/${id}`, { method: 'DELETE' });
}

export async function duplicateEmailTemplate(id: number) {
  return apiFetch<any>(`/email-templates/${id}/duplicate`, { method: 'POST' });
}

export async function sendTestEmail(id: number, email: string) {
  return apiFetch<{ success: boolean; message: string }>(`/email-templates/${id}/send-test`, { method: 'POST', body: JSON.stringify({ email }) });
}

export async function getMailConfig() {
  return apiFetch<{ single_recipient: string; from_address: string; from_name: string; mailer: string }>('/mail-config');
}

// ─── Contrats ───────────────────────────────────────────────
interface ApiContrat {
  id: number; nom: string; type: string; juridiction: string;
  variables: number; derniere_maj: string; actif: boolean; fichier: string;
}

export function transformContrat(c: ApiContrat) {
  return {
    id: c.id, nom: c.nom, type: c.type, juridiction: c.juridiction,
    variables: c.variables, derniereMaj: isoToFr(c.derniere_maj),
    actif: c.actif, fichier: c.fichier,
    translations: (c as any).translations || {},
  };
}

export async function getContrats() {
  const raw = await apiFetch<ApiContrat[]>('/contrats');
  return raw.map(transformContrat);
}

export async function createContrat(data: Record<string, any>) {
  return apiFetch<ApiContrat>('/contrats', { method: 'POST', body: JSON.stringify(data) });
}

export async function updateContrat(id: number, data: Record<string, any>) {
  return apiFetch<ApiContrat>(`/contrats/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

export async function deleteContrat(id: number) {
  return apiFetch<void>(`/contrats/${id}`, { method: 'DELETE' });
}

export async function uploadContratFile(id: number, file: File) {
  const formData = new FormData(); formData.append('fichier', file);
  const baseUrl = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8001/api/v1';
  const tenantId = localStorage.getItem('illizeo_tenant_id') || 'illizeo';
  const token = localStorage.getItem('illizeo_token') || '';
  const res = await fetch(`${baseUrl}/contrats/${id}/upload`, { method: 'POST', headers: { 'X-Tenant': tenantId, ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: formData });
  if (!res.ok) throw new Error('Upload failed'); return res.json();
}

export async function getContratGenerated(contratId: number, collaborateurId?: number) {
  const qs = collaborateurId ? `?collaborateur_id=${collaborateurId}` : '';
  return apiFetch<any>(`/contrats/${contratId}/generate${qs}`);
}

export async function downloadContratMerged(contratId: number, collaborateurId: number, format: 'docx' | 'pdf' = 'pdf') {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001/api/v1';
  const tenantId = localStorage.getItem('illizeo_tenant_id') || import.meta.env.VITE_TENANT_ID || 'illizeo';
  const token = localStorage.getItem('illizeo_token');
  const res = await fetch(`${baseUrl}/contrats/${contratId}/download?collaborateur_id=${collaborateurId}&format=${format}`, {
    headers: { 'X-Tenant': tenantId, ...(token ? { Authorization: `Bearer ${token}` } : {}) },
  });
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try { const body = await res.text(); const parsed = JSON.parse(body); msg = parsed.error || parsed.message || msg; } catch {}
    throw new Error(msg);
  }
  const blob = await res.blob();
  const filename = res.headers.get('Content-Disposition')?.match(/filename="?(.+?)"?$/)?.[1] || `contrat.${format}`;
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

// ─── Document Categories ────────────────────────────────────
interface ApiDocCategory {
  id: number; slug: string; titre: string;
  documents?: { id: number; nom: string; obligatoire: boolean; type: string }[];
}

export function transformDocCategory(dc: ApiDocCategory) {
  return {
    id: dc.slug, titre: dc.titre,
    pieces: (dc.documents || []).map(d => ({
      nom: d.nom, obligatoire: d.obligatoire, type: d.type as "upload" | "formulaire",
    })),
  };
}

export async function getDocumentCategories() {
  const raw = await apiFetch<ApiDocCategory[]>('/document-categories');
  return raw.map(transformDocCategory);
}

// ─── Notifications Config ───────────────────────────────────
interface ApiNotifConfig {
  id: number; nom: string; canal: string; actif: boolean; categorie: string;
}

export async function getNotificationsConfig() {
  const raw = await apiFetch<ApiNotifConfig[]>('/notifications-config');
  return raw.filter(n => n.categorie === 'general').map(n => n.nom);
}

export async function updateNotificationConfig(id: number, data: Record<string, any>) {
  return apiFetch<ApiNotifConfig>(`/notifications-config/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

// Single source of truth for the list of notifications the backend can emit.
// Backed by App\Support\NotificationRegistry on the API side.
export interface NotificationRegistryEntry {
  key: string;
  label: string;
  description: string;
  category: string;
  audience: string;
  channels: ("inapp" | "email")[];
  default: { inapp?: boolean; email?: boolean };
}

export async function getNotificationsRegistry() {
  return apiFetch<NotificationRegistryEntry[]>('/notifications-registry');
}

// Canonical permission registry — single source of truth for the Roles & permissions admin page.
// Backed by App\Support\PermissionRegistry on the API side.
export interface PermissionRegistryEntry {
  key: string;
  area: "admin" | "employe";
  section: string;
  label: string;
}

export interface PermissionRegistryResponse {
  levels: ("none" | "view" | "edit" | "admin")[];
  sections: Record<string, string>;
  modules: PermissionRegistryEntry[];
}

export async function getPermissionsRegistry() {
  return apiFetch<PermissionRegistryResponse>('/permissions-registry');
}

// ─── AD Group Mappings ──────────────────────────────────────
export async function getADGroupMappings() {
  return apiFetch<any[]>('/ad-group-mappings');
}

export async function createADGroupMapping(data: any) {
  return apiFetch<any>('/ad-group-mappings', { method: 'POST', body: JSON.stringify(data) });
}

export async function deleteADGroupMapping(id: number) {
  return apiFetch<void>(`/ad-group-mappings/${id}`, { method: 'DELETE' });
}

export async function syncADUsers() {
  return apiFetch<any>('/ad-sync-users', { method: 'POST' });
}

export async function getADGroups(integrationId: number) {
  return apiFetch<any[]>(`/integrations/${integrationId}/entra/groups`);
}

// ─── Onboarding Teams ───────────────────────────────────────
export async function getOnboardingTeams() {
  return apiFetch<any[]>('/onboarding-teams');
}

export async function createOnboardingTeam(data: any) {
  return apiFetch<any>('/onboarding-teams', { method: 'POST', body: JSON.stringify(data) });
}

export async function updateOnboardingTeam(id: number, data: any) {
  return apiFetch<any>(`/onboarding-teams/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

export async function deleteOnboardingTeam(id: number) {
  return apiFetch<void>(`/onboarding-teams/${id}`, { method: 'DELETE' });
}

export async function getCollabAccompagnants(collabId: number) {
  return apiFetch<any[]>(`/collaborateurs/${collabId}/accompagnants`);
}

export async function assignAccompagnant(collabId: number, payload: { user_id: number; role: 'manager' | 'hrbp' | 'buddy' | 'it' | 'recruteur' | 'admin_rh' | 'other' }) {
  return apiFetch<any>(`/collaborateurs/${collabId}/assign-accompagnant`, { method: 'POST', body: JSON.stringify(payload) });
}

export async function removeAccompagnant(accompagnantId: number) {
  return apiFetch<any>(`/accompagnants/${accompagnantId}`, { method: 'DELETE' });
}

export async function assignTeamToCollab(collabId: number, teamId: number) {
  return apiFetch<any>(`/collaborateurs/${collabId}/assign-team`, { method: 'POST', body: JSON.stringify({ team_id: teamId }) });
}

export async function getWorkload() {
  return apiFetch<any[]>('/onboarding-teams/workload');
}

// ─── Field Config ───────────────────────────────────────────
export async function getFieldConfig() {
  return apiFetch<any[]>('/field-config');
}

export async function updateFieldConfig(id: number, data: Record<string, any>) {
  return apiFetch<any>(`/field-config/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

export async function createFieldConfig(data: { field_key: string; label: string; section: string }) {
  return apiFetch<any>('/field-config', { method: 'POST', body: JSON.stringify(data) });
}

export async function deleteFieldConfig(id: number) {
  return apiFetch<void>(`/field-config/${id}`, { method: 'DELETE' });
}

// ─── User Management ────────────────────────────────────────
export async function getUsers() {
  return apiFetch<any[]>('/users');
}

export async function createUser(data: { name: string; email: string; password: string; role: string }) {
  return apiFetch<any>('/users', { method: 'POST', body: JSON.stringify(data) });
}

// Invite a user — creates the account with an unguessable random password and
// sends a "set your password" email backed by the password reset infra. Used
// by the setup wizard team step and the admin "Inviter" actions.
export async function inviteUser(data: { name: string; email: string; role: string }) {
  return apiFetch<{ id: number; email: string; invited: boolean }>('/users/invite', { method: 'POST', body: JSON.stringify(data) });
}

export async function updateUser(id: number, data: Record<string, any>) {
  return apiFetch<any>(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

export async function deleteUser(id: number) {
  return apiFetch<void>(`/users/${id}`, { method: 'DELETE' });
}

// ─── Action Assignments ─────────────────────────────────────
export async function assignActions(actionIds: number[], mode: string, valeurs: string[]) {
  return apiFetch<any>('/assignments/assign', { method: 'POST', body: JSON.stringify({ action_ids: actionIds, mode, valeurs }) });
}

export async function getCollabAssignments(collabId: number) {
  return apiFetch<any[]>(`/assignments/collaborateur/${collabId}`);
}

export async function getMyActions() {
  return apiFetch<any[]>('/my-actions');
}

export async function completeMyAction(assignmentId: number, responseData?: any) {
  return apiFetch<any>(`/my-actions/${assignmentId}/complete`, { method: 'POST', body: JSON.stringify({ response_data: responseData }) });
}

export async function reactivateMyAction(assignmentId: number) {
  return apiFetch<any>(`/my-actions/${assignmentId}/reactivate`, { method: 'POST' });
}

export async function completeMyActionByActionId(actionId: number) {
  return apiFetch<any>(`/my-actions/by-action/${actionId}/complete`, { method: 'POST' });
}

export async function reactivateMyActionByActionId(actionId: number) {
  return apiFetch<any>(`/my-actions/by-action/${actionId}/reactivate`, { method: 'POST' });
}

// ─── Journey milestones / badges auto-award ────────────────
export interface ApiMilestone { day: number; label: string; badge_name: string; badge_color: string; icon: string; description?: string }
export async function getMyJourney() {
  return apiFetch<{ milestones: ApiMilestone[]; day_j: number; categorie: string | null }>('/me/journey');
}
export async function checkMilestones() {
  return apiFetch<{ awarded: any[]; day_j: number; total_milestones: number; reached_milestones: number }>('/me/check-milestones', { method: 'POST' });
}

// ─── Cohort leaderboard + quiz persistence ─────────────────
export interface ApiLeaderboardRow {
  id: number; name: string; initials: string; color: string; xp: number;
  xp_breakdown: { actions: number; badges: number; quiz: number };
  is_me: boolean;
}
export async function getMyLeaderboard() {
  return apiFetch<{ cohort: ApiLeaderboardRow[]; my_rank: number | null; my_xp: number; my_breakdown: { actions: number; badges: number; quiz: number } | null }>('/me/leaderboard');
}
export async function submitQuizCompletion(payload: { block_id?: number | null; correct: number; total: number; xp_per_correct?: number; answers?: Record<number, number> }) {
  return apiFetch<{ ok: boolean; xp_earned: number }>('/me/quiz/complete', { method: 'POST', body: JSON.stringify(payload) });
}

// ─── Feedback hub ──────────────────────────────────────────
export interface ApiMoodEntry { id: number; mood: number; comment: string | null; created_at: string }
export async function postMood(mood: number, comment?: string) {
  return apiFetch<{ ok: boolean; entry: ApiMoodEntry }>('/me/mood', { method: 'POST', body: JSON.stringify({ mood, comment }) });
}
export async function getMyMoods() {
  return apiFetch<ApiMoodEntry[]>('/me/mood');
}
export async function postSuggestion(payload: { category?: 'suggestion' | 'bug' | 'improvement' | 'other' | 'rdv_request'; content: string; anonymous?: boolean }) {
  return apiFetch<{ ok: boolean }>('/me/feedback/suggestion', { method: 'POST', body: JSON.stringify(payload) });
}
export async function postBuddyRating(payload: { target_type: 'buddy' | 'manager'; target_user_id?: number | null; rating: number; comment?: string }) {
  return apiFetch<{ ok: boolean }>('/me/feedback/buddy-rating', { method: 'POST', body: JSON.stringify(payload) });
}
export async function getMyBuddyRatings() {
  return apiFetch<any[]>('/me/feedback/buddy-rating');
}
export async function postConfidentialAlert(payload: { category: 'rps' | 'harcelement' | 'discrimination' | 'autre'; content: string; anonymous?: boolean }) {
  return apiFetch<{ ok: boolean; id: number }>('/me/feedback/confidential', { method: 'POST', body: JSON.stringify(payload) });
}
// ─── Admin feedback hub views ──────────────────────────────
export async function adminGetMoods() {
  return apiFetch<{ entries: any[]; stats: { avg_30d: number | null; count_30d: number; distribution_30d: Record<string, number>; low_mood_count_30d: number } }>('/admin/feedback/moods');
}
export async function adminGetSuggestions(status?: 'open' | 'reviewing' | 'done' | 'dismissed') {
  const qs = status ? `?status=${status}` : '';
  return apiFetch<any[]>(`/admin/feedback/suggestions${qs}`);
}
export async function adminUpdateSuggestionStatus(id: number, status: 'open' | 'reviewing' | 'done' | 'dismissed') {
  return apiFetch<{ ok: boolean }>(`/admin/feedback/suggestions/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) });
}
export async function adminGetBuddyRatings() {
  return apiFetch<{ entries: any[]; stats: { avg_buddy: number | null; avg_manager: number | null; low_count: number } }>('/admin/feedback/buddy-ratings');
}
export async function adminGetExcited() {
  return apiFetch<{ entries: any[]; total: number }>('/admin/feedback/excited');
}

// ─── Quotes (Citations) ─────────────────────────────────────
export interface ApiQuote { id: number; text: string; author: string | null; source: 'system' | 'tenant'; actif: boolean; translations?: Record<string, any> | null }
export async function getQuotes() {
  return apiFetch<ApiQuote[]>('/quotes');
}
export async function getQuoteOfTheDay() {
  return apiFetch<ApiQuote | null>('/quotes/of-the-day');
}
export async function createQuote(data: { text: string; author?: string | null; translations?: any }) {
  return apiFetch<ApiQuote>('/quotes', { method: 'POST', body: JSON.stringify(data) });
}
export async function updateQuote(id: number, data: Partial<ApiQuote>) {
  return apiFetch<ApiQuote>(`/quotes/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}
export async function toggleQuote(id: number) {
  return apiFetch<ApiQuote>(`/quotes/${id}/toggle`, { method: 'PATCH' });
}
export async function deleteQuote(id: number) {
  return apiFetch<{ ok: boolean }>(`/quotes/${id}`, { method: 'DELETE' });
}

// ─── Recurring meetings ────────────────────────────────────
export interface ApiRecurringMeeting { id: number; titre: string; description?: string | null; frequence: 'weekly'|'biweekly'|'monthly'|'milestone'; jour_semaine?: number | null; milestones?: number[] | null; heure: string; duree_min: number; lieu?: string | null; participants_roles?: string[] | null; parcours_id?: number | null; auto_sync_calendar: boolean; actif: boolean; parcours?: { id: number; nom: string } | null }
export async function getRecurringMeetings() {
  return apiFetch<ApiRecurringMeeting[]>('/recurring-meetings');
}
export async function createRecurringMeeting(data: Partial<ApiRecurringMeeting>) {
  return apiFetch<ApiRecurringMeeting>('/recurring-meetings', { method: 'POST', body: JSON.stringify(data) });
}
export async function updateRecurringMeeting(id: number, data: Partial<ApiRecurringMeeting>) {
  return apiFetch<ApiRecurringMeeting>(`/recurring-meetings/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}
export async function deleteRecurringMeeting(id: number) {
  return apiFetch<{ ok: boolean }>(`/recurring-meetings/${id}`, { method: 'DELETE' });
}
export async function getRecurringMeetingInstances(collaborateurId: number) {
  return apiFetch<{ instances: any[] }>(`/recurring-meetings/instances/${collaborateurId}`);
}
export async function syncRecurringInstance(payload: { recurring_meeting_id: number; collaborateur_id: number; scheduled_at: string; provider: 'microsoft'|'google' }) {
  return apiFetch<{ ok: boolean; instance?: any; join_url?: string | null }>('/recurring-meetings/sync', { method: 'POST', body: JSON.stringify(payload) });
}

// ─── Company Blocks ─────────────────────────────────────────
export async function getCompanyBlocks() {
  return apiFetch<any[]>('/company-blocks');
}

export async function getAllCompanyBlocks() {
  return apiFetch<any[]>('/company-blocks/all');
}

export async function createCompanyBlock(data: Record<string, any>) {
  return apiFetch<any>('/company-blocks', { method: 'POST', body: JSON.stringify(data) });
}

export async function updateCompanyBlock(id: number, data: Record<string, any>) {
  return apiFetch<any>(`/company-blocks/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

export async function deleteCompanyBlock(id: number) {
  return apiFetch<void>(`/company-blocks/${id}`, { method: 'DELETE' });
}

// ─── User Notifications ─────────────────────────────────────
export async function getUserNotifications(limit = 50) {
  return apiFetch<any[]>(`/user-notifications?limit=${limit}`);
}

export async function getNotifUnreadCount() {
  return apiFetch<{ count: number }>('/user-notifications/unread-count');
}

export async function markNotifRead(id: number) {
  return apiFetch<any>(`/user-notifications/${id}/read`, { method: 'POST' });
}

export async function markAllNotifsRead() {
  return apiFetch<any>('/user-notifications/read-all', { method: 'POST' });
}

// ─── Messages ───────────────────────────────────────────────
export async function getConversations() {
  return apiFetch<any[]>('/messages/conversations');
}

export async function getMessages(conversationId: number) {
  return apiFetch<any[]>(`/messages/conversations/${conversationId}`);
}

export async function sendMessage(toUserId: number, content: string) {
  return apiFetch<any>('/messages/send', { method: 'POST', body: JSON.stringify({ to_user_id: toUserId, content }) });
}

export async function getUnreadCount() {
  return apiFetch<{ unread_count: number }>('/messages/unread');
}

export async function getAvailableUsers() {
  return apiFetch<any[]>('/messages/users');
}

// ─── Action Types ───────────────────────────────────────────
export async function getActionTypes() {
  return apiFetch<{ id: number; slug: string; label: string }[]>('/action-types');
}

// ─── Intégrations ───────────────────────────────────────────
export interface ApiIntegration {
  id: number; provider: string; categorie: string; nom: string;
  config: Record<string, any>; actif: boolean; connecte: boolean;
  derniere_sync: string | null;
}

export async function getIntegrations() {
  return apiFetch<ApiIntegration[]>('/integrations');
}

export async function updateIntegration(id: number, data: Record<string, any>) {
  return apiFetch<ApiIntegration>(`/integrations/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

export async function testIntegration(id: number) {
  return apiFetch<{ success: boolean; message: string }>(`/integrations/${id}/test`, { method: 'POST' });
}

// ─── Cooptation (parrainage interne) ────────────────────────
export interface Cooptation {
  id: number;
  referrer_name: string;
  referrer_email: string;
  referrer_user_id: number | null;
  candidate_name: string;
  candidate_email: string;
  candidate_poste: string | null;
  linkedin_url: string | null;
  telephone: string | null;
  cv_path: string | null;
  cv_original_name: string | null;
  campaign_id: number | null;
  collaborateur_id: number | null;
  date_cooptation: string;
  date_embauche: string | null;
  mois_requis: number;
  date_validation: string | null;
  statut: 'en_attente' | 'embauche' | 'valide' | 'recompense_versee' | 'refuse';
  type_recompense: 'prime' | 'cadeau';
  montant_recompense: number | null;
  description_recompense: string | null;
  recompense_versee: boolean;
  date_versement: string | null;
  notes: string | null;
  is_validable: boolean;
  jours_restants: number | null;
  created_at: string;
  // AI scoring (computed by backend CooptationScoringService via Claude Haiku)
  priority_score?: number | null;
  priority_reason?: string | null;
  priority_action?: string | null;
  priority_computed_at?: string | null;
  priority_model_version?: string | null;
  cv_parsed_data?: Record<string, any> | null;
  cv_parsed_at?: string | null;
}

export interface CooptationSettings {
  id: number;
  mois_requis_defaut: number;
  montant_defaut: number;
  type_recompense_defaut: 'prime' | 'cadeau';
  description_recompense_defaut: string | null;
  actif: boolean;
}

export interface CooptationStats {
  en_attente: number;
  embauche: number;
  valide: number;
  recompense_versee: number;
  refuse: number;
  total: number;
  total_recompenses_versees: number;
  recompenses_en_attente: number;
  avg_days_to_hire: number;
  conversion_rate: number;
}

export async function getCooptations() {
  return apiFetch<Cooptation[]>('/cooptations');
}

export async function createCooptation(data: Record<string, any>) {
  return apiFetch<Cooptation>('/cooptations', { method: 'POST', body: JSON.stringify(data) });
}

export async function updateCooptation(id: number, data: Record<string, any>) {
  return apiFetch<Cooptation>(`/cooptations/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

export async function deleteCooptation(id: number) {
  return apiFetch<void>(`/cooptations/${id}`, { method: 'DELETE' });
}

export async function cooptationMarkHired(id: number, data: { date_embauche: string }) {
  return apiFetch<Cooptation>(`/cooptations/${id}/mark-hired`, { method: 'POST', body: JSON.stringify(data) });
}

export async function cooptationValidate(id: number) {
  return apiFetch<Cooptation>(`/cooptations/${id}/validate`, { method: 'POST' });
}

export async function cooptationMarkRewarded(id: number) {
  return apiFetch<Cooptation>(`/cooptations/${id}/mark-rewarded`, { method: 'POST' });
}

export async function cooptationRefuse(id: number) {
  return apiFetch<Cooptation>(`/cooptations/${id}/refuse`, { method: 'POST' });
}

export async function getCooptationStats() {
  return apiFetch<CooptationStats>('/cooptation-stats');
}

export async function uploadCooptationCv(id: number, file: File) {
  const formData = new FormData();
  formData.append('cv', file);
  const baseUrl = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8001/api/v1';
  const tenantId = localStorage.getItem('illizeo_tenant_id') || 'illizeo';
  const token = localStorage.getItem('illizeo_token') || '';
  const res = await fetch(`${baseUrl}/cooptations/${id}/cv`, {
    method: 'POST',
    headers: { 'X-Tenant': tenantId, ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: formData,
  });
  if (!res.ok) throw new Error('CV upload failed');
  return res.json();
}

export async function getCooptationSettings() {
  return apiFetch<CooptationSettings>('/cooptation-settings');
}

export async function updateCooptationSettings(data: Record<string, any>) {
  return apiFetch<CooptationSettings>('/cooptation-settings', { method: 'PUT', body: JSON.stringify(data) });
}

// ─── Cooptation Campaigns ───────────────────────────────────
export interface CooptationCampaign {
  id: number;
  titre: string;
  description: string | null;
  departement: string | null;
  site: string | null;
  type_contrat: string;
  type_recompense: 'prime' | 'cadeau';
  montant_recompense: number | null;
  description_recompense: string | null;
  mois_requis: number;
  statut: 'active' | 'pourvue' | 'fermee';
  date_limite: string | null;
  nombre_postes: number;
  nombre_candidatures: number;
  priorite: 'basse' | 'normale' | 'haute' | 'urgente';
  share_token: string;
  cooptations_count?: number;
  created_at: string;
  // Boost — temporary multiplier on the reward (e.g. ×2 pendant 8 jours)
  boost_active?: boolean;
  boost_multiplier?: number;
  boost_label?: string | null;
  boost_until?: string | null;
}

export interface LeaderboardEntry {
  referrer_email: string;
  referrer_name: string;
  total_points: number;
  total_cooptations: number;
}

export async function getCooptationCampaigns() {
  return apiFetch<CooptationCampaign[]>('/cooptation-campaigns');
}

export async function createCooptationCampaign(data: Record<string, any>) {
  return apiFetch<CooptationCampaign>('/cooptation-campaigns', { method: 'POST', body: JSON.stringify(data) });
}

export async function updateCooptationCampaign(id: number, data: Record<string, any>) {
  return apiFetch<CooptationCampaign>(`/cooptation-campaigns/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

export async function deleteCooptationCampaign(id: number) {
  return apiFetch<void>(`/cooptation-campaigns/${id}`, { method: 'DELETE' });
}

export async function getCooptationLeaderboard() {
  return apiFetch<LeaderboardEntry[]>('/cooptation-leaderboard');
}

// ─── Data Export & RGPD ─────────────────────────────────────
export async function exportAllData(): Promise<Blob> {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
  const token = localStorage.getItem('illizeo_token');
  const res = await fetch(`${baseUrl}/export/all`, { headers: { 'Authorization': `Bearer ${token}`, 'X-Tenant': localStorage.getItem('illizeo_tenant_id') || import.meta.env.VITE_TENANT_ID || 'illizeo', 'Accept': 'application/json' } });
  if (!res.ok) throw new Error('Export failed');
  return res.blob();
}

export async function exportCollaborateursCSV(): Promise<Blob> {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
  const token = localStorage.getItem('illizeo_token');
  const res = await fetch(`${baseUrl}/export/collaborateurs`, { headers: { 'Authorization': `Bearer ${token}`, 'X-Tenant': localStorage.getItem('illizeo_tenant_id') || import.meta.env.VITE_TENANT_ID || 'illizeo' } });
  if (!res.ok) throw new Error('Export failed');
  return res.blob();
}

export async function exportAuditLog(): Promise<Blob> {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
  const token = localStorage.getItem('illizeo_token');
  const res = await fetch(`${baseUrl}/export/audit-log`, { headers: { 'Authorization': `Bearer ${token}`, 'X-Tenant': localStorage.getItem('illizeo_tenant_id') || import.meta.env.VITE_TENANT_ID || 'illizeo', 'Accept': 'application/json' } });
  if (!res.ok) throw new Error('Export failed');
  return res.blob();
}

export async function rgpdDeleteCollaborateur(email: string) {
  return apiFetch<{ message: string }>('/rgpd/delete-collaborateur', { method: 'POST', body: JSON.stringify({ email }) });
}

export async function rgpdDeleteAccount() {
  return apiFetch<{ message: string }>('/rgpd/delete-account', { method: 'POST' });
}

// ─── Badges ─────────────────────────────────────────────────
export interface Badge {
  id: number;
  user_id: number;
  collaborateur_id: number | null;
  nom: string;
  description: string | null;
  icon: string;
  color: string;
  earned_at: string;
  workflow_id: number | null;
}

export async function getBadges() {
  return apiFetch<Badge[]>('/badges');
}

export async function getMyBadges() {
  return apiFetch<Badge[]>('/badges/my');
}

export async function getUserBadges(userId: number) {
  return apiFetch<Badge[]>(`/badges/user/${userId}`);
}

export interface BadgeTemplate {
  id: number;
  nom: string;
  description: string | null;
  icon: string;
  color: string;
  critere: string | null;
  actif: boolean;
  earned_count?: number;
}

export async function getBadgeTemplates() {
  return apiFetch<BadgeTemplate[]>('/badge-templates');
}

export async function getMyBadgeTemplates() {
  return apiFetch<BadgeTemplate[]>('/me/badge-templates');
}

export async function createBadgeTemplate(data: Record<string, any>) {
  return apiFetch<BadgeTemplate>('/badge-templates', { method: 'POST', body: JSON.stringify(data) });
}

export async function updateBadgeTemplate(id: number, data: Record<string, any>) {
  return apiFetch<BadgeTemplate>(`/badge-templates/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

export async function deleteBadgeTemplate(id: number) {
  return apiFetch<void>(`/badge-templates/${id}`, { method: 'DELETE' });
}

export async function awardBadge(userId: number, data: { badge_template_id?: number; nom?: string; icon?: string; color?: string }) {
  return apiFetch<Badge>('/badges/award', { method: 'POST', body: JSON.stringify({ user_id: userId, ...data }) });
}

export async function revokeBadge(id: number) {
  return apiFetch<void>(`/badges/${id}`, { method: 'DELETE' });
}

// ─── Documents (file upload) ────────────────────────────────
export interface UploadedDocument {
  id: number;
  collaborateur_id: number;
  user_id: number | null;
  categorie_id: number | null;
  nom: string;
  fichier_original: string | null;
  fichier_path: string | null;
  fichier_taille: number | null;
  fichier_mime: string | null;
  status: 'soumis' | 'valide' | 'refuse';
  validated_by: number | null;
  validated_at: string | null;
  refuse_motif: string | null;
  notes: string | null;
  url: string | null;
  created_at: string;
}

export async function getDocuments(params?: { collaborateur_id?: number; status?: string }) {
  const qs = new URLSearchParams();
  if (params?.collaborateur_id) qs.set('collaborateur_id', String(params.collaborateur_id));
  if (params?.status) qs.set('status', params.status);
  const query = qs.toString() ? `?${qs}` : '';
  return apiFetch<UploadedDocument[]>(`/documents${query}`);
}

export async function createDocumentTemplate(data: { nom: string; description?: string; obligatoire: boolean; type: string; categorie_id: number; translations?: any }) {
  return apiFetch<any>('/documents', { method: 'POST', body: JSON.stringify({ ...data, is_template: true }) });
}

export async function updateDocumentTemplate(id: number, data: any) {
  return apiFetch<any>(`/documents/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

export async function getDocumentTemplates() {
  return apiFetch<any[]>('/document-templates');
}

export async function uploadTemplateFile(documentId: number, file: File): Promise<any> {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001/api/v1';
  const token = localStorage.getItem('illizeo_token');
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${baseUrl}/documents/${documentId}/upload-template`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'X-Tenant': localStorage.getItem('illizeo_tenant_id') || import.meta.env.VITE_TENANT_ID || 'illizeo', 'Accept': 'application/json' },
    body: formData,
  });
  if (!res.ok) throw new Error('Upload failed');
  return res.json();
}

export async function downloadTemplateFile(documentId: number): Promise<Blob> {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001/api/v1';
  const token = localStorage.getItem('illizeo_token');
  const res = await fetch(`${baseUrl}/documents/${documentId}/download-template`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}`, 'X-Tenant': localStorage.getItem('illizeo_tenant_id') || import.meta.env.VITE_TENANT_ID || 'illizeo' },
  });
  if (!res.ok) throw new Error('Download failed');
  return res.blob();
}

export async function uploadDocument(file: File, collaborateurId: number, categorie: string, nom: string) {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001/api/v1';
  const token = localStorage.getItem('illizeo_token');
  const formData = new FormData();
  formData.append('file', file);
  formData.append('collaborateur_id', String(collaborateurId));
  formData.append('categorie', categorie);
  formData.append('nom', nom);
  const res = await fetch(`${baseUrl}/documents/upload`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'X-Tenant': localStorage.getItem('illizeo_tenant_id') || import.meta.env.VITE_TENANT_ID || 'illizeo', 'Accept': 'application/json' },
    body: formData,
  });
  if (!res.ok) throw new Error('Upload failed');
  return res.json() as Promise<UploadedDocument>;
}

export async function downloadDocument(id: number): Promise<Blob> {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001/api/v1';
  const token = localStorage.getItem('illizeo_token');
  const res = await fetch(`${baseUrl}/documents/${id}/download`, {
    headers: { 'Authorization': `Bearer ${token}`, 'X-Tenant': localStorage.getItem('illizeo_tenant_id') || import.meta.env.VITE_TENANT_ID || 'illizeo' },
  });
  if (!res.ok) throw new Error('Download failed');
  return res.blob();
}

export async function validateDocument(id: number) {
  return apiFetch<UploadedDocument>(`/documents/${id}/validate`, { method: 'POST' });
}

export async function refuseDocument(id: number, motif?: string) {
  return apiFetch<UploadedDocument>(`/documents/${id}/refuse`, { method: 'POST', body: JSON.stringify({ motif }) });
}

export async function deleteDocument(id: number) {
  return apiFetch<void>(`/documents/${id}`, { method: 'DELETE' });
}

export async function getDocumentsSummary() {
  return apiFetch<Record<string, { status: string; count: number }[]>>('/documents/summary');
}

// ─── Two-Factor Authentication ──────────────────────────────
export async function get2FAStatus() {
  return apiFetch<{ enabled: boolean; confirmed_at: string | null }>('/2fa/status');
}

export async function setup2FA() {
  return apiFetch<{ secret: string; qr_code_svg: string; qr_code_url: string }>('/2fa/setup', { method: 'POST' });
}

export async function confirm2FA(code: string) {
  return apiFetch<{ message: string; recovery_codes: string[] }>('/2fa/confirm', { method: 'POST', body: JSON.stringify({ code }) });
}

export async function verify2FA(email: string, code: string) {
  return apiFetch<AuthResponse>('/2fa/verify', { method: 'POST', body: JSON.stringify({ email, code }) });
}

export async function disable2FA(code: string) {
  return apiFetch<{ message: string }>('/2fa/disable', { method: 'POST', body: JSON.stringify({ code }) });
}

export async function regenerate2FARecoveryCodes(code: string) {
  return apiFetch<{ recovery_codes: string[] }>('/2fa/recovery-codes', { method: 'POST', body: JSON.stringify({ code }) });
}

// ─── NPS Surveys ────────────────────────────────────────────
export interface NpsSurvey {
  id: number;
  titre: string;
  description: string | null;
  type: 'nps' | 'satisfaction' | 'custom';
  parcours_id: number | null;
  declencheur: string;
  date_envoi: string | null;
  questions: { text: string; type: 'nps' | 'rating' | 'text' | 'choice'; options?: string[] }[];
  actif: boolean;
  responses_count?: number;
  created_at: string;
}

export interface NpsResponse {
  id: number;
  survey_id: number;
  collaborateur_id: number;
  score: number | null;
  rating: number | null;
  answers: any;
  comment: string | null;
  completed_at: string | null;
  collaborateur?: { prenom: string; nom: string; poste: string };
}

export interface NpsStats {
  nps_score: number;
  avg_rating: number;
  response_rate: number;
  total_responses: number;
  total_completed: number;
  promoters: number;
  passives: number;
  detractors: number;
  distribution: { label: string; count: number; color: string }[];
  evolution: { month: string; score: number }[];
}

export async function getNpsSurveys() {
  return apiFetch<NpsSurvey[]>('/nps-surveys');
}

export async function createNpsSurvey(data: Record<string, any>) {
  return apiFetch<NpsSurvey>('/nps-surveys', { method: 'POST', body: JSON.stringify(data) });
}

export async function updateNpsSurvey(id: number, data: Record<string, any>) {
  return apiFetch<NpsSurvey>(`/nps-surveys/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

export async function deleteNpsSurvey(id: number) {
  return apiFetch<void>(`/nps-surveys/${id}`, { method: 'DELETE' });
}

export async function showNpsSurvey(id: number) {
  return apiFetch<NpsSurvey & { responses: NpsResponse[] }>(`/nps-surveys/${id}`);
}

export async function getNpsStats() {
  return apiFetch<NpsStats>('/nps-stats');
}

export async function sendNpsSurvey(surveyId: number, collaborateurId: number) {
  return apiFetch<any>(`/nps-surveys/${surveyId}/send`, { method: 'POST', body: JSON.stringify({ collaborateur_id: collaborateurId }) });
}

export async function getMyNpsSurveys() {
  return apiFetch<{ survey: NpsSurvey; token: string | null; completed: boolean; completed_at: string | null; score?: number; rating?: number }[]>('/my-nps-surveys');
}

export async function submitNpsResponse(token: string, data: { score?: number | null; rating?: number | null; answers?: Record<string, any>; comment?: string }) {
  return apiFetch<{ message: string }>(`/nps/respond/${token}`, { method: 'POST', body: JSON.stringify(data) });
}

export async function sendNpsSurveyToAll(surveyId: number) {
  return apiFetch<any>(`/nps-surveys/${surveyId}/send-all`, { method: 'POST' });
}

// ─── Equipment Management ──────────────────────────────────
export interface EquipmentType { id: number; nom: string; icon: string; description: string | null; actif: boolean; equipments_count?: number; }
export interface Equipment {
  id: number; equipment_type_id: number; nom: string; numero_serie: string | null; marque: string | null; modele: string | null;
  etat: 'disponible' | 'attribue' | 'en_commande' | 'en_reparation' | 'retire';
  collaborateur_id: number | null; assigned_by: number | null; assigned_at: string | null; returned_at: string | null;
  date_achat: string | null; valeur: number | null; notes: string | null;
  type?: EquipmentType; collaborateur?: any; assigned_by_user?: any;
}
export interface EquipmentStats { total: number; disponible: number; attribue: number; enCommande: number; enReparation: number; retire: number; valeurTotale: number; }

export async function getEquipmentTypes() { return apiFetch<EquipmentType[]>('/equipment-types'); }
export async function createEquipmentType(data: Record<string, any>) { return apiFetch<EquipmentType>('/equipment-types', { method: 'POST', body: JSON.stringify(data) }); }
export async function updateEquipmentType(id: number, data: Record<string, any>) { return apiFetch<EquipmentType>(`/equipment-types/${id}`, { method: 'PUT', body: JSON.stringify(data) }); }
export async function deleteEquipmentType(id: number) { return apiFetch<void>(`/equipment-types/${id}`, { method: 'DELETE' }); }

export async function getEquipments(params?: Record<string, any>) {
  const qs = params ? '?' + new URLSearchParams(params as any).toString() : '';
  return apiFetch<Equipment[]>(`/equipments${qs}`);
}
export async function getEquipmentStats() { return apiFetch<EquipmentStats>('/equipments/stats'); }
export async function createEquipment(data: Record<string, any>) { return apiFetch<Equipment>('/equipments', { method: 'POST', body: JSON.stringify(data) }); }
export async function updateEquipment(id: number, data: Record<string, any>) { return apiFetch<Equipment>(`/equipments/${id}`, { method: 'PUT', body: JSON.stringify(data) }); }
export async function deleteEquipment(id: number) { return apiFetch<void>(`/equipments/${id}`, { method: 'DELETE' }); }
export async function assignEquipment(id: number, collaborateurId: number) { return apiFetch<Equipment>(`/equipments/${id}/assign`, { method: 'POST', body: JSON.stringify({ collaborateur_id: collaborateurId }) }); }
export async function unassignEquipment(id: number, data?: { returned_at?: string; etat?: string; notes?: string }) { return apiFetch<Equipment>(`/equipments/${id}/unassign`, { method: 'POST', body: data ? JSON.stringify(data) : undefined }); }

export interface EquipmentPackage { id: number; nom: string; description: string | null; icon: string; couleur: string; actif: boolean; items: { id: number; equipment_type_id: number; quantite: number; notes: string | null; type?: EquipmentType }[]; }
export async function getEquipmentPackages() { return apiFetch<EquipmentPackage[]>('/equipment-packages'); }
export async function createEquipmentPackage(data: Record<string, any>) { return apiFetch<EquipmentPackage>('/equipment-packages', { method: 'POST', body: JSON.stringify(data) }); }
export async function updateEquipmentPackage(id: number, data: Record<string, any>) { return apiFetch<EquipmentPackage>(`/equipment-packages/${id}`, { method: 'PUT', body: JSON.stringify(data) }); }
export async function deleteEquipmentPackage(id: number) { return apiFetch<void>(`/equipment-packages/${id}`, { method: 'DELETE' }); }
export async function provisionPackage(id: number, collaborateurId: number) { return apiFetch<any>(`/equipment-packages/${id}/provision`, { method: 'POST', body: JSON.stringify({ collaborateur_id: collaborateurId }) }); }
export async function getMyEquipment() { return apiFetch<Equipment[]>('/me/equipment'); }

// ─── VAT (TVA suisse + reverse charge EU) ──────────────────
export interface VatValidation { valid: boolean; name: string | null; address: string | null; cached: boolean; error: string | null; }
export interface VatComputation {
  rate: number; amount_ht_cents: number; vat_amount_cents: number; amount_ttc_cents: number;
  treatment: string; mention: string; vat_number_validated?: boolean;
}
export async function validateVatNumber(country_code: string, vat_number: string) {
  return apiFetch<VatValidation>('/vat/validate', { method: 'POST', body: JSON.stringify({ country_code, vat_number }) });
}
export async function computeVat(amount_ht_cents: number, country_code: string, customer_type?: string, vat_number?: string, vat_validated?: boolean) {
  return apiFetch<VatComputation>('/vat/compute', { method: 'POST', body: JSON.stringify({ amount_ht_cents, country_code, customer_type, vat_number, vat_validated }) });
}

// ─── Exchange rates ─────────────────────────────────────────
export async function getExchangeRates(currencies?: string[]) {
  const qs = currencies?.length ? `?currencies=${currencies.join(',')}` : '';
  return apiFetch<{ base: string; rates: Record<string, number>; updated_at: string }>(`/exchange-rates${qs}`);
}
export async function convertExchangeRate(amount: number, currency: string) {
  return apiFetch<{ amount_chf: number; currency: string; amount_target: number; is_estimate: boolean }>(`/exchange-rates/convert?amount=${amount}&currency=${currency}`);
}

// ─── Signature Documents ───────────────────────────────────
export interface SignatureDoc { id: number; titre: string; description: string | null; type: 'lecture' | 'signature'; fichier_path: string | null; fichier_nom: string | null; obligatoire: boolean; actif: boolean; total_envois?: number; total_signes?: number; }
export interface DocAcknowledgement { id: number; signature_document_id: number; collaborateur_id: number; user_id: number; statut: 'en_attente' | 'lu' | 'signe' | 'refuse'; signed_at: string | null; ip_address: string | null; commentaire: string | null; document?: SignatureDoc; collaborateur?: any; }

export async function getSignatureDocuments() { return apiFetch<SignatureDoc[]>('/signature-documents'); }
export async function createSignatureDocument(data: Record<string, any>) { return apiFetch<SignatureDoc>('/signature-documents', { method: 'POST', body: JSON.stringify(data) }); }
export async function updateSignatureDocument(id: number, data: Record<string, any>) { return apiFetch<SignatureDoc>(`/signature-documents/${id}`, { method: 'PUT', body: JSON.stringify(data) }); }
export async function deleteSignatureDocument(id: number) { return apiFetch<void>(`/signature-documents/${id}`, { method: 'DELETE' }); }
export async function uploadSignatureFile(id: number, file: File) {
  const formData = new FormData(); formData.append('fichier', file);
  const baseUrl = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8001/api/v1';
  const tenantId = localStorage.getItem('illizeo_tenant_id') || 'illizeo';
  const token = localStorage.getItem('illizeo_token') || '';
  const res = await fetch(`${baseUrl}/signature-documents/${id}/upload`, { method: 'POST', headers: { 'X-Tenant': tenantId, ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: formData });
  if (!res.ok) throw new Error('Upload failed'); return res.json();
}
export async function sendSignatureDoc(id: number, collaborateurId: number) { return apiFetch<any>(`/signature-documents/${id}/send`, { method: 'POST', body: JSON.stringify({ collaborateur_id: collaborateurId }) }); }
export async function sendSignatureDocToAll(id: number) { return apiFetch<any>(`/signature-documents/${id}/send-all`, { method: 'POST' }); }
export async function getDocAcknowledgements(docId: number) { return apiFetch<DocAcknowledgement[]>(`/signature-documents/${docId}/acknowledgements`); }
export async function acknowledgeDoc(ackId: number) { return apiFetch<DocAcknowledgement>(`/acknowledgements/${ackId}/sign`, { method: 'POST' }); }
export async function refuseDoc(ackId: number, commentaire?: string) { return apiFetch<DocAcknowledgement>(`/acknowledgements/${ackId}/refuse`, { method: 'POST', body: JSON.stringify({ commentaire }) }); }
export async function getMyPendingSignatures() { return apiFetch<DocAcknowledgement[]>('/my-pending-signatures'); }
export async function getMySignatureDocuments() {
  return apiFetch<{ id: number; name: string; description: string; type: 'lecture' | 'signature'; obligatoire: boolean; status: string; urgent: boolean; version: number; signed_at: string | null; signed_version: number | null; ack_id: number | null }[]>('/me/signature-documents');
}

export async function getMySignatureHistory() {
  return apiFetch<{ ack_id: number; document_id: number; document_title: string; document_description: string; document_type: 'lecture' | 'signature'; document_current_version: number; statut: 'signe' | 'lu'; signed_at: string | null; signed_version: number | null; is_outdated: boolean; ip_address: string | null }[]>('/me/signature-history');
}
export async function getMyAcknowledgement(docId: number) { return apiFetch<DocAcknowledgement>(`/signature-documents/${docId}/my-acknowledgement`); }

// ─── Dossier Validation & SIRH Export ───────────────────────
export interface DossierCheck {
  collaborateur_id: number; dossier_status: string; is_complete: boolean; completion_pct: number;
  total_checks: number; completed_checks: number;
  missing: { type: string; key: string; label: string; status?: string }[];
}
export async function checkDossier(collabId: number) { return apiFetch<DossierCheck>(`/collaborateurs/${collabId}/dossier-check`); }
export async function validateDossier(collabId: number) { return apiFetch<any>(`/collaborateurs/${collabId}/dossier-validate`, { method: 'POST' }); }
export async function exportDossier(collabId: number, target: string = 'manual') { return apiFetch<any>(`/collaborateurs/${collabId}/dossier-export`, { method: 'POST', body: JSON.stringify({ target }) }); }
export async function resetDossier(collabId: number) { return apiFetch<any>(`/collaborateurs/${collabId}/dossier-reset`, { method: 'POST' }); }

// ─── Company Settings ───────────────────────────────────────
export async function getCompanySettings() {
  return apiFetch<Record<string, string>>('/company-settings');
}

export async function updateCompanySettings(settings: Record<string, any>) {
  return apiFetch<{ message: string }>('/company-settings', { method: 'PUT', body: JSON.stringify({ settings }) });
}

// ─── Document country packs ────────────────────────────────
// Liste les packs pays disponibles + déclenche l'import des templates pour
// un pays donné (FR, BE, LU, DE…). Idempotent : skip les templates qui
// existent déjà avec le même nom dans la même catégorie.
export async function getCountryPacks() {
  return apiFetch<{ code: string; label: string; docs_count: number }[]>('/document-templates/country-packs');
}
export async function importCountryPack(country: string) {
  return apiFetch<{ country: string; label: string; created: number; skipped: number; documents: any[] }>(
    '/document-templates/import-country-pack', { method: 'POST', body: JSON.stringify({ country }) }
  );
}

// ─── Mon compte ────────────────────────────────────────────
// Endpoints "Mon compte" pour l'utilisateur authentifié (Mon profil, change
// password, préférences notifications). Voir MeController.php côté backend.
export async function getMyProfile() {
  return apiFetch<{ id: number; name: string; email: string; preferred_language: string | null; roles: string[] }>('/me/profile');
}
export async function updateMyProfile(data: { name?: string; email?: string; preferred_language?: string | null }) {
  return apiFetch<{ id: number; name: string; email: string }>('/me/profile', { method: 'PUT', body: JSON.stringify(data) });
}
export async function changeMyPassword(data: { current_password: string; password: string; password_confirmation: string }) {
  return apiFetch<{ message: string }>('/change-password', { method: 'POST', body: JSON.stringify(data) });
}
export async function getMyNotificationPreferences() {
  return apiFetch<Record<string, any>>('/me/notification-preferences');
}
export async function updateMyNotificationPreferences(prefs: Record<string, any>) {
  return apiFetch<{ ok: boolean; prefs: Record<string, any> }>('/me/notification-preferences', { method: 'PUT', body: JSON.stringify(prefs) });
}

// Avatar/banner endpoints accessible to all authenticated users (employees too).
// Use these instead of updateCompanySettings({ avatar_<id>: ... }) which requires admin role.
export async function saveMyAvatar(dataUrl: string) {
  return apiFetch<{ ok: boolean }>('/me/avatar', { method: 'POST', body: JSON.stringify({ avatar: dataUrl }) });
}
export async function deleteMyAvatar() {
  return apiFetch<{ ok: boolean }>('/me/avatar', { method: 'DELETE' });
}
export async function saveMyBanner(payload: { image?: string | null; color?: string | null }) {
  return apiFetch<{ ok: boolean }>('/me/banner', { method: 'POST', body: JSON.stringify(payload) });
}

// ─── Password Policy (public, no auth) ─────────────────────
export interface PasswordPolicy {
  min_length: number;
  uppercase: boolean;
  lowercase: boolean;
  number: boolean;
  special: boolean;
  no_common: boolean;
  no_name: boolean;
  max_attempts: number;
  history_count: number;
  expiry_days: number;
}

export async function getPasswordPolicy(): Promise<PasswordPolicy> {
  return apiFetch<PasswordPolicy>('/password-policy');
}

// ─── Tenant Branding (public, no auth) ─────────────────────
export async function getTenantBranding() {
  return apiFetch<Record<string, string>>('/tenant-branding');
}

// ─── Tenant Registration ────────────────────────────────────
export async function registerTenant(data: {
  company_name: string;
  admin_name: string;
  admin_email: string;
  password: string;
  password_confirmation: string;
  country: string;
  customer_type: 'company' | 'individual';
  vat_number?: string;
  billing_address?: { street?: string; postal_code?: string; city?: string };
}) {
  const res = await apiFetch<{ tenant_id: string; user: AuthUser; token: string }>('/register-tenant', { method: 'POST', body: JSON.stringify(data) });
  setToken(res.token);
  // Update tenant ID in localStorage for future requests
  localStorage.setItem('illizeo_tenant_id', res.tenant_id);
  return res;
}

export async function checkTenantAvailability(company_name: string) {
  return apiFetch<{ tenant_id: string; available: boolean }>('/check-tenant', { method: 'POST', body: JSON.stringify({ company_name }) });
}

// ─── Plans (public) ─────────────────────────────────────────
export interface PlanData {
  id: number;
  nom: string;
  slug: string;
  description: string | null;
  prix_eur_mensuel: number;
  prix_chf_mensuel: number;
  min_mensuel_eur: number;
  min_mensuel_chf: number;
  max_collaborateurs: number | null;
  max_admins: number | null;
  max_parcours: number | null;
  max_integrations: number | null;
  max_workflows: number | null;
  actif: boolean;
  populaire: boolean;
  ordre: number;
  modules: { module: string; actif: boolean }[];
}

export async function getPlans() {
  return apiFetch<PlanData[]>('/plans');
}

// ─── Super Admin ────────────────────────────────────────────
export async function superAdminDashboard() {
  return apiFetch<{ total_tenants: number; active_subscriptions: number; mrr_eur: number; mrr_chf: number; total_collaborateurs: number }>('/super-admin/dashboard');
}

export async function superAdminListTenants() {
  return apiFetch<any[]>('/super-admin/tenants');
}

export async function superAdminUpdateTenant(tenantId: string, data: Record<string, any>) {
  return apiFetch<any>(`/super-admin/tenants/${tenantId}`, { method: 'PUT', body: JSON.stringify(data) });
}

export async function superAdminDeleteTenant(tenantId: string) {
  return apiFetch<void>(`/super-admin/tenants/${tenantId}`, { method: 'DELETE' });
}

export async function superAdminListPlans() {
  return apiFetch<PlanData[]>('/super-admin/plans');
}

export async function superAdminCreatePlan(data: Record<string, any>) {
  return apiFetch<PlanData>('/super-admin/plans', { method: 'POST', body: JSON.stringify(data) });
}

export async function superAdminUpdatePlan(id: number, data: Record<string, any>) {
  return apiFetch<PlanData>(`/super-admin/plans/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

export async function superAdminDeletePlan(id: number) {
  return apiFetch<void>(`/super-admin/plans/${id}`, { method: 'DELETE' });
}

export async function superAdminUpdateModules(planId: number, modules: { module: string; actif: boolean }[]) {
  return apiFetch<any>(`/super-admin/plans/${planId}/modules`, { method: 'PUT', body: JSON.stringify({ modules }) });
}

export async function superAdminListSubscriptions() {
  return apiFetch<any[]>('/super-admin/subscriptions');
}

export async function superAdminListInvoices() {
  return apiFetch<any[]>('/super-admin/invoices');
}

// ─── Super-admin: Coupons (Stripe) ─────────────────────────
export async function superAdminListCoupons() {
  return apiFetch<any[]>('/super-admin/coupons');
}
export async function superAdminCreateCoupon(data: {
  name: string;
  discount_type: 'percent' | 'amount';
  percent_off?: number;
  amount_off?: number;
  currency?: string;
  duration: 'once' | 'repeating' | 'forever';
  duration_in_months?: number;
  max_redemptions?: number;
  redeem_by?: string;
  promo_code?: string;
  code_max_redemptions?: number;
  code_expires_at?: string;
}) {
  return apiFetch<{ coupon_id: string; promo_code?: string; promo_code_id?: string }>('/super-admin/coupons', { method: 'POST', body: JSON.stringify(data) });
}
export async function superAdminDeleteCoupon(couponId: string) {
  return apiFetch<{ ok: boolean }>(`/super-admin/coupons/${couponId}`, { method: 'DELETE' });
}
export async function superAdminTogglePromoCode(promoCodeId: string, active: boolean) {
  return apiFetch<{ code: string; active: boolean }>(`/super-admin/promotion-codes/${promoCodeId}`, { method: 'PATCH', body: JSON.stringify({ active }) });
}

// ─── Super-admin: Reporting ────────────────────────────────
export interface RevenueReport {
  mrr: number; arr: number; arpu: number; arpc: number;
  active_subs: number; total_tenants: number; total_collaborateurs: number;
  churn_rate_30d: number; churned_last_30d: number; revenue_last_30d: number;
  by_plan: { slug: string; nom: string; addon_type: string | null; subs_count: number; mrr: number; collaborateurs: number }[];
  evolution: { month: string; label: string; mrr: number; subs_count: number; new_subs: number; churned: number }[];
  currency: string;
}
export async function superAdminGetRevenueReport() {
  return apiFetch<RevenueReport>('/super-admin/reporting/revenue');
}

// ─── AI Insights ───────────────────────────────────────────
export interface NpsSentimentResult {
  sentiment: 'positive' | 'neutral' | 'negative';
  themes: string[];
  key_insight: string;
  suggestion: string;
}
export async function aiAnalyzeNpsResponse(responseId: number) {
  return apiFetch<NpsSentimentResult>('/ai/nps-sentiment', { method: 'POST', body: JSON.stringify({ response_id: responseId }) });
}

export interface NpsAggregateInsights {
  top_positive_themes: string[];
  top_negative_themes: string[];
  key_findings: string[];
  recommendations: string[];
  summary: { total: number; promoters: number; passives: number; detractors: number; nps_score: number };
}
export async function aiAggregateNpsInsights(surveyId: number) {
  return apiFetch<NpsAggregateInsights>('/ai/nps-insights', { method: 'POST', body: JSON.stringify({ survey_id: surveyId }) });
}

export interface BuddySuggestion {
  collaborateur_id: number;
  user_id: number;
  score: number;
  reasons: string[];
  nom: string;
  poste: string;
  site: string;
  departement: string;
}
export async function aiSuggestBuddy(collaborateurId: number) {
  return apiFetch<{ target: any; suggestions: BuddySuggestion[] }>('/ai/suggest-buddy', { method: 'POST', body: JSON.stringify({ collaborateur_id: collaborateurId }) });
}

export interface TurnoverRiskEntry {
  id: number;
  nom: string;
  poste: string;
  site: string;
  risk_score: number;
  reasons: string[];
  // Level 2/3 enrichment (when enrich=1, default)
  narrative?: string | null;
  trend?: 'declining' | 'stable' | 'improving' | 'insufficient_data' | null;
  trend_label?: string | null;
  targeted_recommendation?: string | null;
}
export interface TurnoverRisk {
  at_risk: TurnoverRiskEntry[];
  total_screened: number;
  enriched: boolean;
}
export async function aiTurnoverRisk(enrich: boolean = true) {
  return apiFetch<TurnoverRisk>(`/ai/turnover-risk${enrich ? '?enrich=1' : '?enrich=0'}`);
}

export async function superAdminGetStripeConfig() {
  return apiFetch<{ has_key: boolean; has_secret: boolean; has_webhook: boolean }>('/super-admin/stripe-config');
}

export async function superAdminUpdateStripeConfig(data: { stripe_key?: string; stripe_secret?: string; stripe_webhook_secret?: string; stripe_mode?: string; stripe_test_key?: string; stripe_test_secret?: string; stripe_test_webhook_secret?: string }) {
  return apiFetch<any>('/super-admin/stripe-config', { method: 'PUT', body: JSON.stringify(data) });
}

// ─── Tenant Subscription ────────────────────────────────────
export async function getMySubscription() {
  return apiFetch<{ subscriptions: any[]; active_modules: string[]; tenant_id: string }>('/my-subscription');
}

export async function subscribeToPlan(plan_id: number, billing_cycle: 'monthly' | 'yearly', payment_method: 'stripe' | 'sepa' | 'invoice', nombre_collaborateurs?: number, billing?: { currency?: string; country?: string; customer_type?: string; vat_number?: string }) {
  return apiFetch<any>('/subscribe', { method: 'POST', body: JSON.stringify({
    plan_id, billing_cycle, payment_method, nombre_collaborateurs: nombre_collaborateurs || 25,
    currency: billing?.currency, country: billing?.country, customer_type: billing?.customer_type, vat_number: billing?.vat_number,
  }) });
}

export async function cancelSubscription(subscriptionId: number) {
  return apiFetch<any>(`/subscriptions/${subscriptionId}/cancel`, { method: 'POST' });
}

export async function getAvailablePlans() {
  return apiFetch<PlanData[]>('/available-plans');
}

export async function getActiveModules() {
  return apiFetch<string[]>('/active-modules');
}

export async function getInvoices() {
  return apiFetch<any[]>('/invoices');
}

export async function createStripeCheckoutSession(data: {
  plan_id: number;
  billing_cycle: 'monthly' | 'yearly';
  currency: string;
  nombre_collaborateurs?: number;
  country?: string;
  customer_type?: 'company' | 'individual';
  vat_number?: string;
  success_url?: string;
  cancel_url?: string;
}) {
  return apiFetch<{ url: string; session_id: string; publishable_key: string }>('/stripe/checkout/create-session', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function downloadInvoicePdf(invoiceId: number, invoiceNumber?: string) {
  const baseUrl = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8001/api/v1';
  const token = localStorage.getItem('illizeo_token');
  const tenantId = localStorage.getItem('illizeo_tenant_id') || (import.meta as any).env?.VITE_TENANT_ID || 'illizeo';
  const res = await fetch(`${baseUrl}/invoices/${invoiceId}/download`, {
    headers: { 'X-Tenant': tenantId, ...(token ? { Authorization: `Bearer ${token}` } : {}) },
  });
  if (!res.ok) throw new Error(`Téléchargement échoué (${res.status})`);
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${invoiceNumber || `facture-${invoiceId}`}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function superAdminRegenerateInvoicePdf(invoiceId: number) {
  return apiFetch<{ ok: boolean; invoice_number: string; pdf_path: string }>(`/super-admin/invoices/${invoiceId}/regenerate-pdf`, { method: 'POST' });
}

export async function superAdminDownloadInvoicePdf(invoiceId: number, invoiceNumber?: string) {
  const baseUrl = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8001/api/v1';
  const token = localStorage.getItem('illizeo_token');
  const tenantId = localStorage.getItem('illizeo_tenant_id') || (import.meta as any).env?.VITE_TENANT_ID || 'illizeo';
  const res = await fetch(`${baseUrl}/super-admin/invoices/${invoiceId}/download`, {
    headers: { 'X-Tenant': tenantId, ...(token ? { Authorization: `Bearer ${token}` } : {}) },
  });
  if (!res.ok) throw new Error(`Téléchargement échoué (${res.status})`);
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${invoiceNumber || `facture-${invoiceId}`}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ─── Demo Mode ─────────────────────────────────────────────
export async function seedDemoData() {
  return apiFetch<{ message: string }>('/demo/seed', { method: 'POST' });
}

// ─── Support Access ────────────────────────────────────────
export async function getSupportAccesses() {
  return apiFetch<any[]>('/support-accesses');
}
export async function grantSupportAccess(data: { email: string; allowed_modules?: string[] | null; reason?: string; duration_hours: number }) {
  return apiFetch<any>('/support-accesses', { method: 'POST', body: JSON.stringify(data) });
}
export async function revokeSupportAccess(id: number) {
  return apiFetch<any>(`/support-accesses/${id}/revoke`, { method: 'POST' });
}

// ─── Security ──────────────────────────────────────────────
export async function getSecuritySessions() { return apiFetch<{ sessions: any[] }>('/security/sessions'); }
export async function revokeSession(id: number) { return apiFetch<any>(`/security/sessions/${id}/revoke`, { method: 'POST' }); }
export async function revokeAllOtherSessions() { return apiFetch<any>('/security/sessions/revoke-all', { method: 'POST' }); }
export async function getLoginHistory() { return apiFetch<any[]>('/security/login-history'); }
export async function getAllLoginHistory() { return apiFetch<any[]>('/security/login-history/all'); }
export async function getSecuritySettings() { return apiFetch<any>('/security/settings'); }
export async function updateSecuritySettings(data: Record<string, any>) { return apiFetch<any>('/security/settings', { method: 'PUT', body: JSON.stringify(data) }); }
export async function createAccessSchedule(data: { label?: string; days: number[]; start_time: string; end_time: string; timezone?: string }) { return apiFetch<any>('/security/schedules', { method: 'POST', body: JSON.stringify(data) }); }
export async function deleteAccessSchedule(id: number) { return apiFetch<any>(`/security/schedules/${id}`, { method: 'DELETE' }); }
export async function exportEncrypted(type: string, password: string) {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001/api/v1';
  const tenantId = localStorage.getItem('illizeo_tenant_id') || 'illizeo';
  const token = localStorage.getItem('illizeo_token');
  const res = await fetch(`${baseUrl}/export/encrypted`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}`, 'X-Tenant': tenantId, 'Content-Type': 'application/json' }, body: JSON.stringify({ type, password }) });
  if (!res.ok) throw new Error('Export failed');
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = `illizeo-export-${type}-encrypted.aes`; a.click(); URL.revokeObjectURL(url);
}

// ─── IP Whitelist ──────────────────────────────────────────
export async function getIpWhitelist() {
  return apiFetch<{ enabled: boolean; entries: any[]; current_ip: string }>('/ip-whitelist');
}
export async function addIpWhitelist(data: { ip_address: string; label?: string }) {
  return apiFetch<any>('/ip-whitelist', { method: 'POST', body: JSON.stringify(data) });
}
export async function toggleIpWhitelist(enabled: boolean) {
  return apiFetch<any>('/ip-whitelist/toggle', { method: 'POST', body: JSON.stringify({ enabled }) });
}
export async function removeIpWhitelist(id: number) {
  return apiFetch<any>(`/ip-whitelist/${id}`, { method: 'DELETE' });
}

export async function getAuditLogs(params?: { category?: string; search?: string; limit?: number }) {
  const qs = new URLSearchParams();
  if (params?.category) qs.set('category', params.category);
  if (params?.search) qs.set('search', params.search);
  if (params?.limit) qs.set('limit', String(params.limit));
  const query = qs.toString() ? `?${qs}` : '';
  return apiFetch<any[]>(`/audit-logs${query}`);
}

export async function getSignatureUsage() {
  return apiFetch<{ total: number; signed: number; sent: number; declined: number }>('/signature-usage');
}

// ─── Stripe / Payments ────────────────────────────────────
export async function createStripeSetupIntent() {
  return apiFetch<{ client_secret: string; customer_id: string; publishable_key: string }>('/stripe/setup-intent', { method: 'POST' });
}
export async function getStripePaymentMethods() {
  return apiFetch<{ methods: { id: string; brand: string; last4: string; exp_month: number; exp_year: number; is_default: boolean }[]; default: string | null }>('/stripe/payment-methods');
}
export async function setDefaultPaymentMethod(paymentMethodId: string) {
  return apiFetch('/stripe/default-payment-method', { method: 'POST', body: JSON.stringify({ payment_method_id: paymentMethodId }), headers: { 'Content-Type': 'application/json' } });
}
export async function deleteStripePaymentMethod(paymentMethodId: string) {
  return apiFetch('/stripe/delete-payment-method', { method: 'POST', body: JSON.stringify({ payment_method_id: paymentMethodId }), headers: { 'Content-Type': 'application/json' } });
}
export async function getPaymentConfig() {
  return apiFetch<any>('/payment-config');
}
export async function saveInvoiceConfig(data: { invoice_email?: string; po_number?: string; billing_address?: Record<string, string> }) {
  return apiFetch('/payment/invoice-config', { method: 'POST', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } });
}
export async function saveBillingContact(data: Record<string, string>) {
  return apiFetch('/billing/contact', { method: 'POST', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } });
}
export async function saveBillingInfo(data: Record<string, string>) {
  return apiFetch('/billing/info', { method: 'POST', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } });
}

// ─── OCR / AI ─────────────────────────────────────────────
export interface OcrIdentityResult {
  document_type: string | null;
  document_number: string | null;
  last_name: string | null;
  first_name: string | null;
  birth_date: string | null;
  birth_place: string | null;
  nationality: string | null;
  gender: string | null;
  expiry_date: string | null;
  issue_date: string | null;
  issuing_authority: string | null;
  issuing_country: string | null;
  address: string | null;
  avs_number: string | null;
  confidence: 'high' | 'medium' | 'low';
}
export async function ocrExtractIdentity(file: File): Promise<{ success: boolean; data: OcrIdentityResult; confidence: string; usage?: number; warning?: string }> {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001/api/v1';
  const tenantId = localStorage.getItem('illizeo_tenant_id') || import.meta.env.VITE_TENANT_ID || 'illizeo';
  const token = localStorage.getItem('illizeo_token');
  const formData = new FormData();
  formData.append('image', file);
  const res = await fetch(`${baseUrl}/ocr/identity`, {
    method: 'POST',
    headers: { 'X-Tenant': tenantId, ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: formData,
  });
  if (!res.ok) { const err = await res.json().catch(() => ({})); throw new Error(err.error || err.message || JSON.stringify(err.errors || {}) || `OCR failed (${res.status})`); }
  return res.json();
}

export async function getStorageUsage() {
  return apiFetch<{ used_bytes: number; used_formatted: string; max_bytes: number; max_formatted: string; percent: number; file_count: number; db_size: string }>('/storage-usage');
}

// ─── Monthly Consumption ─────────────────────────────────────
export interface ConsumptionUser {
  id: number; prenom: string; nom: string; email: string; site: string; role: string; departement: string;
}
export interface MonthlyConsumption {
  year: number; month: number; month_label: string;
  total_active: number; admin_count: number; employee_count: number;
  min_billed: number; billed_count: number;
  users: ConsumptionUser[];
}
export async function getMonthlyConsumption(year?: number, month?: number) {
  const params = new URLSearchParams();
  if (year) params.set('year', String(year));
  if (month) params.set('month', String(month));
  const qs = params.toString();
  return apiFetch<MonthlyConsumption>(`/monthly-consumption${qs ? '?' + qs : ''}`);
}

// ─── Roles & Permissions ──────────────────────────────────────
export interface ApiRole {
  id: number;
  nom: string;
  slug: string;
  description: string | null;
  couleur: string;
  is_system: boolean;
  is_default: boolean;
  scope_type: 'global' | 'site' | 'departement' | 'equipe';
  scope_values: string[] | null;
  temporary: boolean;
  expires_at: string | null;
  permissions: Record<string, string>;
  ordre: number;
  actif: boolean;
  users_count?: number;
  users?: any[];
}

export async function getRoles() {
  return apiFetch<ApiRole[]>('/roles');
}

export async function createRole(data: Record<string, any>) {
  return apiFetch<ApiRole>('/roles', { method: 'POST', body: JSON.stringify(data) });
}

export async function getRole(id: number) {
  return apiFetch<ApiRole>('/roles/' + id);
}

export async function updateRole(id: number, data: Record<string, any>) {
  return apiFetch<ApiRole>('/roles/' + id, { method: 'PUT', body: JSON.stringify(data) });
}

export async function deleteRole(id: number) {
  return apiFetch<void>('/roles/' + id, { method: 'DELETE' });
}

export async function assignRoleUser(roleId: number, userId: number) {
  return apiFetch<any>(`/roles/${roleId}/assign`, { method: 'POST', body: JSON.stringify({ user_id: userId }) });
}

export async function removeRoleUser(roleId: number, userId: number) {
  return apiFetch<any>(`/roles/${roleId}/remove`, { method: 'POST', body: JSON.stringify({ user_id: userId }) });
}

export async function duplicateRole(roleId: number) {
  return apiFetch<ApiRole>(`/roles/${roleId}/duplicate`, { method: 'POST' });
}

export async function getMyCollaborateur() {
  const raw = await apiFetch<any>('/me/collaborateur');
  if (!raw) return null;
  const collab = transformCollaborateur(raw);
  // Attach phases and actions from the parcours
  (collab as any).parcours_phases = raw.parcours_phases || [];
  (collab as any).parcours_actions = (raw.parcours_actions || []).map((a: any) => ({
    id: a.id, titre: a.titre, type: a.type, phase: a.phase_nom || a.phase, delaiRelatif: a.delai_relatif,
    obligatoire: a.obligatoire, description: a.description, parcours: raw.parcours?.nom || "",
    parcours_id: a.parcours_id,
    assignment_id: a.assignment_id || null,
    assignment_status: a.assignment_status || 'a_faire',
    completed_at: a.completed_at || null,
    options: a.options || undefined,
    duree_estimee: a.duree_estimee || null,
    xp: a.xp ?? 50,
    heure_default: a.heure_default || null,
    accompagnant_role: a.accompagnant_role || null,
    accompagnant: a.accompagnant || null,
    piecesRequises: a.pieces_requises || undefined,
    pieces_requises: a.pieces_requises || undefined,
    lien_externe: a.lien_externe || null,
    lienExterne: a.lien_externe || null,
    dureeEstimee: a.duree_estimee || null,
    translations: a.translations || undefined,
  }));
  (collab as any).parcours_nom = raw.parcours?.nom || null;
  (collab as any).parcours_categorie = raw.parcours?.categorie?.slug || raw.parcours?.categorie || null;
  (collab as any).accompagnants = raw.accompagnants || [];
  return collab;
}

/**
 * Compute presence label + colour from a user's last_seen_at ISO timestamp.
 * Buckets: <2min = online, <15min = active, <60min = recent, <24h = today,
 * <7d = this week, older = absent. Null = jamais connecté.
 */
export function presenceLabel(lastSeenAt: string | null | undefined): { label: string; color: string; dotColor: string; isOnline: boolean } {
  if (!lastSeenAt) return { label: "Jamais connecté", color: "#999", dotColor: "#CFD8DC", isOnline: false };
  const last = new Date(lastSeenAt).getTime();
  if (isNaN(last)) return { label: "Jamais connecté", color: "#999", dotColor: "#CFD8DC", isOnline: false };
  const diffSec = Math.max(0, Math.floor((Date.now() - last) / 1000));
  if (diffSec < 120) return { label: "En ligne", color: "#4CAF50", dotColor: "#4CAF50", isOnline: true };
  if (diffSec < 900) return { label: `Actif il y a ${Math.floor(diffSec / 60)} min`, color: "#7CB342", dotColor: "#7CB342", isOnline: true };
  if (diffSec < 3600) return { label: `Vu il y a ${Math.floor(diffSec / 60)} min`, color: "#999", dotColor: "#BDBDBD", isOnline: false };
  if (diffSec < 86400) return { label: `Vu il y a ${Math.floor(diffSec / 3600)} h`, color: "#999", dotColor: "#BDBDBD", isOnline: false };
  if (diffSec < 7 * 86400) return { label: `Vu il y a ${Math.floor(diffSec / 86400)} j`, color: "#999", dotColor: "#BDBDBD", isOnline: false };
  const d = new Date(lastSeenAt);
  return { label: `Vu le ${d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}`, color: "#999", dotColor: "#BDBDBD", isOnline: false };
}

export async function getMyPermissions() {
  return apiFetch<{ permissions: Record<string, string>; roles: string[]; is_super_admin: boolean }>('/me/permissions');
}

export async function getPermissionsSchema() {
  return apiFetch<{ modules: { key: string; label: string }[]; levels: string[] }>('/permissions/schema');
}

export async function getEffectivePermissions(userId: number) {
  return apiFetch<{ permissions: Record<string, string>; roles: string[] }>(`/permissions/effective?user_id=${userId}`);
}

export async function getPermissionLogs() {
  return apiFetch<any[]>('/permissions/logs');
}

// ─── Buddy Pairs ──────────────────────────────────────────────
export async function getBuddyPairs() {
  return apiFetch<any[]>('/buddy-pairs');
}

export async function createBuddyPair(data: { newcomer_id: number; buddy_id: number }) {
  return apiFetch<any>('/buddy-pairs', { method: 'POST', body: JSON.stringify(data) });
}

export async function updateBuddyPair(id: number, data: Record<string, any>) {
  return apiFetch<any>(`/buddy-pairs/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

export async function deleteBuddyPair(id: number) {
  return apiFetch<void>(`/buddy-pairs/${id}`, { method: 'DELETE' });
}

export async function addBuddyNote(id: number, text: string) {
  return apiFetch<any>(`/buddy-pairs/${id}/note`, { method: 'POST', body: JSON.stringify({ text }) });
}

export async function completeBuddyPair(id: number) {
  return apiFetch<any>(`/buddy-pairs/${id}/complete`, { method: 'POST' });
}

// ─── API Keys ─────────────────────────────────────────────
export async function getApiKeys() {
  return apiFetch<any[]>('/api-keys');
}
export async function createApiKey(data: { name: string; scopes: string[]; expires_at?: string }) {
  return apiFetch<any>('/api-keys', { method: 'POST', body: JSON.stringify(data) });
}
export async function revokeApiKey(id: number) {
  return apiFetch<any>(`/api-keys/${id}/revoke`, { method: 'POST' });
}
export async function deleteApiKey(id: number) {
  return apiFetch<void>(`/api-keys/${id}`, { method: 'DELETE' });
}

// ─── Webhooks Config ──────────────────────────────────────
export async function getWebhooksConfig() {
  return apiFetch<any[]>('/webhooks-config');
}
export async function createWebhookConfig(data: { url: string; events: string[] }) {
  return apiFetch<any>('/webhooks-config', { method: 'POST', body: JSON.stringify(data) });
}
export async function updateWebhookConfig(id: number, data: Record<string, any>) {
  return apiFetch<any>(`/webhooks-config/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}
export async function deleteWebhookConfig(id: number) {
  return apiFetch<void>(`/webhooks-config/${id}`, { method: 'DELETE' });
}
export async function testWebhook(id: number) {
  return apiFetch<any>(`/webhooks-config/${id}/test`, { method: 'POST' });
}

// ─── AI Assistant Chat ───────────────────────────────────
export async function postAiChat(message: string, history: { role: string; content: string }[]) {
  return apiFetch<{ reply: string }>('/ai/chat', { method: 'POST', body: JSON.stringify({ message, history }) });
}

export async function getAiAutoRechargeConfig() {
  return apiFetch<{ enabled: boolean; threshold_percent: number; recharge_amount_chf: number; recharge_credits: number; max_recharges_per_month: number; recharges_this_month: number }>('/ai/auto-recharge');
}

export async function updateAiAutoRechargeConfig(config: { enabled: boolean; threshold_percent: number; recharge_amount_chf: number; recharge_credits: number; max_recharges_per_month: number }) {
  return apiFetch<{ success: boolean }>('/ai/auto-recharge', { method: 'POST', body: JSON.stringify(config) });
}

export async function postAdminAiChat(message: string, history: { role: string; content: string }[]) {
  return apiFetch<{ reply: string }>('/ai/admin-chat', { method: 'POST', body: JSON.stringify({ message, history }) });
}

export async function relancerCollaborateur(collabId: number, payload: { subject: string; body: string }) {
  return apiFetch<{ success: boolean; message?: string }>(`/collaborateurs/${collabId}/relancer`, { method: 'POST', body: JSON.stringify(payload) });
}

export async function getCalendarEvents(year: number, month: number) {
  return apiFetch<{ date: string; type: string; title: string; subtitle: string; color: string; collaborateur_id?: number; action_id?: number }[]>(`/calendar-events?year=${year}&month=${month}`);
}

export async function getAiInsights() {
  return apiFetch<{ insights: { type: string; title: string; message: string; priority: "high" | "medium" | "low" }[] }>('/ai/insights');
}

export async function generateParcoursWithAI(prompt: string) {
  return apiFetch<{ parcours: { nom: string; categorie: string; phases: { nom: string; delaiDebut: string; delaiFin: string }[]; actions: { titre: string; type: string; phase: string; delaiRelatif: string; obligatoire: boolean; description: string }[] } }>('/ai/generate-parcours', { method: 'POST', body: JSON.stringify({ prompt }) });
}

// ─── API Logs ─────────────────────────────────────────────
export async function getApiLogs(params?: { method?: string; status_code?: number; api_key_id?: number }) {
  const qs = new URLSearchParams();
  if (params?.method) qs.set('method', params.method);
  if (params?.status_code) qs.set('status_code', String(params.status_code));
  if (params?.api_key_id) qs.set('api_key_id', String(params.api_key_id));
  const query = qs.toString() ? `?${qs}` : '';
  return apiFetch<any[]>(`/api-logs${query}`);
}

// ── AI Translation ──
export async function aiTranslate(text: string, sourceLang: string, targetLangs: string[]): Promise<{ translations: Record<string, string>; from_cache: boolean }> {
  return apiFetch('/ai/translate', { method: 'POST', body: JSON.stringify({ text, source_lang: sourceLang, target_langs: targetLangs }) });
}
