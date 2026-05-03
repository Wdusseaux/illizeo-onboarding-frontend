// ─── TYPES — extracted from Onboarding_v1.tsx ────────────

// ─── TYPES ───────────────────────────────────────────────────
export type OnboardingStep = "email" | "welcome_banner" | "create_account" | "photo_profile" | "collect_info" | "welcome_modal" | "dashboard";
export type DashboardPage = "tableau_de_bord" | "mes_actions" | "messagerie" | "notifications" | "entreprise" | "rapports" | "suivi" | "mon_profil" | "cooptation" | "satisfaction" | "assistant_ia" | "organigramme" | "mes_rdv" | "documents" | "mes_signatures" | "formations" | "bureaux" | "badges" | "mon_materiel";
export type DashboardTab = "toutes" | "onboarding";
export type UserRole = "employee" | "rh";
export type AdminPage = "admin_dashboard" | "admin_parcours" | "admin_suivi" | "admin_documents" | "admin_actions" | "admin_workflows" | "admin_templates" | "admin_phases" | "admin_equipes" | "admin_messagerie" | "admin_notifications" | "admin_entreprise" | "admin_profil" | "admin_gamification" | "admin_nps" | "admin_feedback_hub" | "admin_livret" | "admin_contrats" | "admin_integrations" | "admin_users" | "admin_fields" | "admin_provisioning" | "admin_cooptation" | "admin_apparence" | "admin_donnees" | "admin_2fa" | "admin_abonnement" | "admin_equipements" | "admin_signatures" | "admin_roles" | "admin_calendar" | "admin_orgchart" | "admin_buddy" | "admin_audit" | "admin_password_policy" | "admin_assistant_ia" | "admin_manager_view" | "admin_cohorte_rh" | "admin_templates_profil" | "admin_quotes" | "admin_recurring_meetings" | "admin_bureaux";
export type AdminModal = null | "create_parcours" | "edit_parcours" | "view_parcours" | "create_action" | "edit_action" | "create_doc_category" | "edit_doc" | "create_template" | "edit_template" | "create_workflow" | "assign_member" | "collaborateur_detail" | "create_groupe" | "edit_groupe" | "action_detail" | "send_message" | "create_phase" | "edit_phase" | "create_contrat" | "edit_contrat";

export interface Collaborateur {
  id: number; prenom: string; nom: string; email?: string; poste: string; site: string; departement: string;
  dateDebut: string; phase: string; progression: number; status: "en_cours" | "en_retard" | "termine";
  docsValides: number; docsTotal: number; actionsCompletes: number; actionsTotal: number;
  initials: string; color: string; parcours_id?: number;
  managerId?: number | null; hrManagerId?: number | null;
  manager?: { id: number; prenom: string; nom: string } | null;
  hrManager?: { id: number; prenom: string; nom: string } | null;
}

export type ParcoursCategorie = "onboarding" | "offboarding" | "crossboarding" | "reboarding";

export interface ParcourTemplate {
  id: number; nom: string; phases: string[]; actionsCount: number; docsCount: number;
  collaborateursActifs: number; status: "actif" | "brouillon" | "archive"; categorie: ParcoursCategorie;
}

export interface ActionTemplate {
  id: number; titre: string; type: ActionType; phase: string; delaiRelatif: string;
  obligatoire: boolean; description: string; assignation: AssignTarget;
  lienExterne?: string; dureeEstimee?: string; parcours: string;
  piecesRequises?: string[];
}

export type ActionType = "document" | "formulaire" | "formation" | "questionnaire" | "tache" | "signature" | "lecture" | "rdv" | "message" | "entretien" | "checklist_it" | "passation" | "visite";

export interface AssignTarget {
  mode: "tous" | "individuel" | "groupe" | "site" | "departement" | "contrat" | "parcours" | "phase";
  valeurs: string[];
}

export interface GroupePersonnes {
  id: number; nom: string; description: string; membres: string[]; couleur: string;
  critereAuto?: { type: "site" | "departement" | "contrat"; valeur: string };
}

export interface DocCategory {
  id: string; titre: string; pieces: { nom: string; obligatoire: boolean; type: "upload" | "formulaire" }[];
}

export interface WorkflowRule {
  id: number; nom: string; declencheur: string; action: string; destinataire: string; actif: boolean;
}

export interface EmailTemplate {
  id: number; nom: string; sujet: string; declencheur: string; variables: string[]; actif: boolean;
  contenu?: string;
}

export interface TeamMember {
  initials: string;
  name: string;
  role: string;
  hasPhoto?: boolean;
  color: string;
}
