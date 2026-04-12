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
  parcours?: any; groupes?: any[];
}

export function transformCollaborateur(c: ApiCollaborateur) {
  return {
    id: c.id, prenom: c.prenom, nom: c.nom, email: c.email, poste: c.poste, site: c.site,
    departement: c.departement, dateDebut: isoToFr(c.date_debut), phase: c.phase,
    progression: c.progression, status: c.status as "en_cours" | "en_retard" | "termine",
    docsValides: c.docs_valides, docsTotal: c.docs_total,
    actionsCompletes: c.actions_completes, actionsTotal: c.actions_total,
    initials: c.initials, color: c.couleur,
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
  pieces_requises: string[] | null; assignation_mode: string;
  assignation_valeurs: string[] | null;
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
    parcours: a.parcours?.nom || '',
    piecesRequises: a.pieces_requises || undefined,
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
  parcours_id: number | null;
  parcours?: { id: number; nom: string }[];
}

export function transformPhase(ph: ApiPhase) {
  return {
    id: ph.id, nom: ph.nom, delaiDebut: ph.delai_debut, delaiFin: ph.delai_fin,
    couleur: ph.couleur, iconName: ph.icone as any, actionsDefaut: ph.actions_defaut,
    parcoursIds: ph.parcours ? ph.parcours.map(p => p.id) : [],
    parcoursNoms: ph.parcours ? ph.parcours.map(p => p.nom) : [],
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
    critereAuto: g.critere_type ? { type: g.critere_type as any, valeur: g.critere_valeur || '' } : undefined,
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

export async function createDocumentTemplate(data: { nom: string; obligatoire: boolean; type: string; categorie_id: number }) {
  return apiFetch<any>('/documents', { method: 'POST', body: JSON.stringify(data) });
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
export async function unassignEquipment(id: number) { return apiFetch<Equipment>(`/equipments/${id}/unassign`, { method: 'POST' }); }

export interface EquipmentPackage { id: number; nom: string; description: string | null; icon: string; couleur: string; actif: boolean; items: { id: number; equipment_type_id: number; quantite: number; notes: string | null; type?: EquipmentType }[]; }
export async function getEquipmentPackages() { return apiFetch<EquipmentPackage[]>('/equipment-packages'); }
export async function createEquipmentPackage(data: Record<string, any>) { return apiFetch<EquipmentPackage>('/equipment-packages', { method: 'POST', body: JSON.stringify(data) }); }
export async function updateEquipmentPackage(id: number, data: Record<string, any>) { return apiFetch<EquipmentPackage>(`/equipment-packages/${id}`, { method: 'PUT', body: JSON.stringify(data) }); }
export async function deleteEquipmentPackage(id: number) { return apiFetch<void>(`/equipment-packages/${id}`, { method: 'DELETE' }); }
export async function provisionPackage(id: number, collaborateurId: number) { return apiFetch<any>(`/equipment-packages/${id}/provision`, { method: 'POST', body: JSON.stringify({ collaborateur_id: collaborateurId }) }); }

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

export async function updateCompanySettings(settings: Record<string, string>) {
  return apiFetch<{ message: string }>('/company-settings', { method: 'PUT', body: JSON.stringify({ settings }) });
}

// ─── Tenant Registration ────────────────────────────────────
export async function registerTenant(data: { company_name: string; admin_name: string; admin_email: string; password: string; password_confirmation: string }) {
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

export async function superAdminGetStripeConfig() {
  return apiFetch<{ has_key: boolean; has_secret: boolean; has_webhook: boolean }>('/super-admin/stripe-config');
}

export async function superAdminUpdateStripeConfig(data: { stripe_key?: string; stripe_secret?: string; stripe_webhook_secret?: string }) {
  return apiFetch<any>('/super-admin/stripe-config', { method: 'PUT', body: JSON.stringify(data) });
}

// ─── Tenant Subscription ────────────────────────────────────
export async function getMySubscription() {
  return apiFetch<{ subscriptions: any[]; active_modules: string[]; tenant_id: string }>('/my-subscription');
}

export async function subscribeToPlan(plan_id: number, billing_cycle: 'monthly' | 'yearly', payment_method: 'stripe' | 'invoice') {
  return apiFetch<any>('/subscribe', { method: 'POST', body: JSON.stringify({ plan_id, billing_cycle, payment_method }) });
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

export async function getSignatureUsage() {
  return apiFetch<{ total: number; signed: number; sent: number; declined: number }>('/signature-usage');
}

export async function getStorageUsage() {
  return apiFetch<{ used_bytes: number; used_formatted: string; max_bytes: number; max_formatted: string; percent: number; file_count: number; db_size: string }>('/storage-usage');
}
