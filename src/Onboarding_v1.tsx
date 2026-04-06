import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useApiData } from "./api/useApiData";
import { apiFetch } from "./api/client";
import { useAuth } from "./api/useAuth";
import { t, getLang, setLang, getAllLangs, LANG_META, type Lang } from "./i18n";
import {
  getCollaborateurs, getParcours, getActions, getGroupes, getPhases,
  getWorkflows, getEmailTemplates, getContrats, getDocumentCategories,
  getNotificationsConfig,
  getConversations, getMessages as apiGetMessages, sendMessage as apiSendMessage, getAvailableUsers,
  getUserNotifications, markNotifRead, markAllNotifsRead, getNotifUnreadCount,
  getCompanyBlocks, getAllCompanyBlocks, updateCompanyBlock as apiUpdateBlock, createCompanyBlock as apiCreateBlock, deleteCompanyBlock as apiDeleteBlock,
  assignActions as apiAssignActions,
  createWorkflow as apiCreateWorkflow, updateWorkflow as apiUpdateWorkflow, deleteWorkflow as apiDeleteWorkflow,
  createEmailTemplate as apiCreateEmailTpl, updateEmailTemplate as apiUpdateEmailTpl, deleteEmailTemplate as apiDeleteEmailTpl,
  createContrat as apiCreateContrat, updateContrat as apiUpdateContrat, deleteContrat as apiDeleteContrat,
  getUsers, createUser as apiCreateUser, updateUser as apiUpdateUser, deleteUser as apiDeleteUser,
  getFieldConfig, updateFieldConfig as apiUpdateFieldConfig, createFieldConfig as apiCreateFieldConfig, deleteFieldConfig as apiDeleteFieldConfig,
  getOnboardingTeams, createOnboardingTeam as apiCreateTeam, updateOnboardingTeam as apiUpdateTeam, deleteOnboardingTeam as apiDeleteTeam,
  getADGroupMappings, createADGroupMapping, deleteADGroupMapping, syncADUsers, getADGroups,
  createParcours as apiCreateParcours, updateParcours as apiUpdateParcours, deleteParcours as apiDeleteParcours, duplicateParcours as apiDuplicateParcours,
  createPhase as apiCreatePhase, updatePhase as apiUpdatePhase, deletePhase as apiDeletePhase,
  createAction as apiCreateAction, updateAction as apiUpdateAction, deleteAction as apiDeleteAction,
  createGroupe as apiCreateGroupe, updateGroupe as apiUpdateGroupe, deleteGroupe as apiDeleteGroupe,
  createCollaborateur as apiCreateCollab, updateCollaborateur as apiUpdateCollab, deleteCollaborateur as apiDeleteCollab,
  getIntegrations, updateIntegration as apiUpdateIntegration,
  getCooptations, createCooptation as apiCreateCooptation, updateCooptation as apiUpdateCooptation, deleteCooptation as apiDeleteCooptation,
  cooptationMarkHired, cooptationValidate, cooptationMarkRewarded, cooptationRefuse,
  getCooptationStats, getCooptationSettings, updateCooptationSettings as apiUpdateCooptSettings,
  getCooptationCampaigns, createCooptationCampaign as apiCreateCampaign, updateCooptationCampaign as apiUpdateCampaign, deleteCooptationCampaign as apiDeleteCampaign,
  getCooptationLeaderboard,
  uploadCooptationCv,
  type Cooptation, type CooptationStats, type CooptationSettings, type CooptationCampaign, type LeaderboardEntry,
  exportAllData, exportCollaborateursCSV, exportAuditLog, rgpdDeleteCollaborateur, rgpdDeleteAccount,
  get2FAStatus, setup2FA, confirm2FA, disable2FA, regenerate2FARecoveryCodes,
  registerTenant, checkTenantAvailability,
  getCompanySettings, updateCompanySettings,
  getBadges, getMyBadges, getBadgeTemplates, createBadgeTemplate as apiCreateBadgeTpl, updateBadgeTemplate as apiUpdateBadgeTpl, deleteBadgeTemplate as apiDeleteBadgeTpl, awardBadge, revokeBadge,
  type Badge, type BadgeTemplate,
  getPlans, type PlanData,
  superAdminDashboard, superAdminListTenants, superAdminUpdateTenant, superAdminDeleteTenant,
  superAdminListPlans, superAdminCreatePlan, superAdminUpdatePlan, superAdminDeletePlan,
  superAdminUpdateModules, superAdminListSubscriptions, superAdminListInvoices,
  superAdminGetStripeConfig, superAdminUpdateStripeConfig,
  getMySubscription, subscribeToPlan, cancelSubscription, getAvailablePlans, getActiveModules, getStorageUsage, getSignatureUsage,
  getDocuments, uploadDocument, validateDocument as apiValidateDoc, refuseDocument as apiRefuseDoc,
  type UploadedDocument,
  getNpsSurveys, createNpsSurvey as apiCreateNps, updateNpsSurvey as apiUpdateNps, deleteNpsSurvey as apiDeleteNps,
  showNpsSurvey, getNpsStats, sendNpsSurveyToAll as apiSendNpsAll,
  type NpsSurvey, type NpsResponse, type NpsStats,
  duplicateEmailTemplate as apiDuplicateEmailTpl, sendTestEmail, getMailConfig,
  getEquipmentTypes, getEquipments, getEquipmentStats, createEquipment as apiCreateEquip, updateEquipment as apiUpdateEquip, deleteEquipment as apiDeleteEquip,
  createEquipmentType as apiCreateEquipType, updateEquipmentType as apiUpdateEquipType, deleteEquipmentType as apiDeleteEquipType,
  assignEquipment as apiAssignEquip, unassignEquipment as apiUnassignEquip,
  type Equipment, type EquipmentType, type EquipmentStats,
  getEquipmentPackages, createEquipmentPackage as apiCreatePkg, updateEquipmentPackage as apiUpdatePkg, deleteEquipmentPackage as apiDeletePkg, provisionPackage as apiProvisionPkg,
  type EquipmentPackage,
  getSignatureDocuments, createSignatureDocument as apiCreateSignDoc, updateSignatureDocument as apiUpdateSignDoc, deleteSignatureDocument as apiDeleteSignDoc,
  uploadSignatureFile, sendSignatureDocToAll, getDocAcknowledgements, acknowledgeDoc, getMyPendingSignatures,
  type SignatureDoc, type DocAcknowledgement,
  checkDossier, validateDossier, exportDossier, resetDossier, type DossierCheck,
} from "./api/endpoints";
import {
  Users, FileText, MessageCircle, Bell, Building2, LayoutDashboard, Zap,
  ChevronRight, ChevronLeft, X, Upload, Download, Plus, Eye, EyeOff,
  Search, Filter, Clock, AlertTriangle, CheckCircle, Play, BarChart3,
  Calendar, MapPin, Check, FileUp, ClipboardList, GraduationCap, ListChecks,
  PenTool, BookOpen, CalendarClock, MessageSquare, Send, Inbox, ShieldCheck,
  Hand, PartyPopper, Dumbbell, Package, FolderOpen, Globe, Clapperboard,
  Mail, MailOpen, Link, Sparkles, Timer, XCircle, UserPlus, UserCheck,
  Tag, Navigation, Landmark, Route, CalendarDays, ArrowRight,
  Trophy, Star, Award, FileSignature, BookMarked, ClipboardCheck, Smile, Frown, Meh,
  ThumbsUp, Gift, Target, Scroll, FilePen, LogOut, MoreHorizontal, Trash2, RefreshCw, UserMinus,
  Handshake, BadgeDollarSign, CircleDollarSign, Ban, CheckCircle2, Hourglass, Banknote,
  Palette, Trash, DatabaseBackup, Languages, ChevronsRight, ChevronsLeft, Settings, Crown, Lock,
  Phone, Linkedin, Paperclip, TrendingUp, Percent, FileCheck2, CalendarCheck, Rocket, Heart, Gem,
  Laptop, Monitor, Headphones, KeyRound, Mouse, Car, Armchair, Boxes, RotateCcw, PenLine,
  Moon, Sun
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

import { ANIM_STYLES, C, hexToRgb, colorWithAlpha, lighten, REGION_LOCALE, REGION_CURRENCY, getLocaleSettings, fmtDate, fmtDateShort, fmtTime, fmtDateTime, fmtDateTimeShort, fmtCurrency, font, ILLIZEO_LOGO_URI, ILLIZEO_FULL_LOGO_URI, getLogoUri, getLogoFullUri, IllizeoLogoFull, IllizeoLogo, IllizeoLogoBrand, PreboardSidebar, sCard, sBtn, sInput, isDarkMode, applyDarkMode } from './constants';
import type { OnboardingStep, DashboardPage, DashboardTab, UserRole, AdminPage, AdminModal, Collaborateur, ParcoursCategorie, ParcourTemplate, ActionTemplate, ActionType, AssignTarget, GroupePersonnes, DocCategory, WorkflowRule, EmailTemplate, TeamMember } from './types';
import RichEditor from './components/RichEditor';
import TranslatableField, { type Translations } from './components/TranslatableField';
import { DOC_CATEGORIES, ACTIONS, _MOCK_NOTIFICATIONS_LIST, NOTIF_RESOURCES, TEAM_MEMBERS, ACTION_TYPE_META, PHASE_ICONS, SITES, DEPARTEMENTS, TYPES_CONTRAT, _MOCK_COLLABORATEURS, _MOCK_PARCOURS_TEMPLATES, _MOCK_ACTION_TEMPLATES, _MOCK_ADMIN_DOC_CATEGORIES, _MOCK_WORKFLOW_RULES, _MOCK_EMAIL_TEMPLATES, _MOCK_PHASE_DEFAULTS, _MOCK_GROUPES, EQUIPE_ROLES, TPL_CATEGORIES, guessTplCategory } from './mockData';

// ─── MAIN COMPONENT ──────────────────────────────────────────
export default function OnboardingModule() {
  // ═══ POST-REGISTRATION FLAG ═══════════════════════════════
  const [_needsPlan] = useState(() => {
    const flag = localStorage.getItem("illizeo_needs_plan") === "true";
    if (flag) localStorage.removeItem("illizeo_needs_plan");
    return flag;
  });

  // ═══ AUTH ══════════════════════════════════════════════════
  const auth = useAuth();
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [resetMode, setResetMode] = useState(false);
  const [resetToken, setResetToken] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [resetPassword, setResetPassword] = useState("");
  const [resetConfirm, setResetConfirm] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetDone, setResetDone] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState("");
  // Tenant registration
  const [showRegister, setShowRegister] = useState(false);
  // Subscription & active modules
  const [tenantActiveModules, setTenantActiveModules] = useState<string[]>([]);
  const [tenantSubscriptions, setTenantSubscriptions] = useState<any[]>([]);
  const [selectedPlanIds, setSelectedPlanIds] = useState<number[]>([]);
  const [subTab, setSubTab] = useState<"facturation" | "factures" | "paiement" | "protection">("facturation");
  const [subView, setSubView] = useState<"overview" | "change" | "apps">(_needsPlan ? "change" : "overview");
  const [subEmployeeCount, setSubEmployeeCount] = useState(25);
  const [billingInfo, setBillingInfo] = useState({ company: "", email: "", prenom: "", nom: "", telephone: "", pays: "Suisse", rue: "", ville: "", code_postal: "", vat: "" });
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "invoice">("stripe");
  const [storageUsage, setStorageUsage] = useState<{ used_formatted: string; max_formatted: string; percent: number; file_count: number; db_size: string } | null>(null);
  const [signatureUsage, setSignatureUsage] = useState<{ total: number; signed: number; sent: number; declined: number } | null>(null);
  // Pricing & Super Admin
  const [showPricing, setShowPricing] = useState(false);
  const [plans, setPlans] = useState<PlanData[]>([]);
  const [pricingBilling, setPricingBilling] = useState<"monthly" | "yearly">("monthly");
  const [superAdminMode, setSuperAdminMode] = useState(false);
  const [saTab, setSaTab] = useState<"dashboard" | "tenants" | "plans" | "subscriptions" | "stripe">("dashboard");
  const [saDashData, setSaDashData] = useState<any>(null);
  const [saTenants, setSaTenants] = useState<any[]>([]);
  const [saPlans, setSaPlans] = useState<PlanData[]>([]);
  const [saSubscriptions, setSaSubscriptions] = useState<any[]>([]);
  const [saStripe, setSaStripe] = useState<any>(null);
  const [saLoaded, setSaLoaded] = useState(false);
  const [saPlanPanel, setSaPlanPanel] = useState<"closed" | "create" | "edit">("closed");
  const [saPlanData, setSaPlanData] = useState<any>({ nom: "", slug: "", description: "", prix_eur_mensuel: 0, prix_chf_mensuel: 0, min_mensuel_eur: 0, min_mensuel_chf: 0, max_collaborateurs: null, max_admins: null, max_parcours: null, max_integrations: null, max_workflows: null, populaire: false, actif: true, ordre: 0, stripe_price_id_eur: "", stripe_price_id_chf: "" });
  const [tenantError, setTenantError] = useState("");
  const [tenantChecking, setTenantChecking] = useState(false);
  const [tenantResolved, setTenantResolved] = useState(() => {
    // Skip tenant selection only if:
    // 1. URL contains tenant subdomain (e.g. illizeo.illizeo.com)
    const host = window.location.hostname;
    const parts = host.split(".");
    if (parts.length >= 3 && parts[1] === "illizeo") {
      localStorage.setItem("illizeo_tenant_id", parts[0]);
      return true;
    }
    // 2. URL has ?tenant= param
    const params = new URLSearchParams(window.location.search);
    const tenantParam = params.get("tenant");
    if (tenantParam) {
      localStorage.setItem("illizeo_tenant_id", tenantParam);
      return true;
    }
    // 3. Just registered (needs plan selection) — skip tenant selection
    if (_needsPlan && localStorage.getItem("illizeo_tenant_id")) return true;
    // Otherwise show tenant selection
    return false;
  });
  const [tenantInput, setTenantInput] = useState("");
  const [regData, setRegData] = useState({ company_name: "", admin_prenom: "", admin_nom: "", admin_email: "", password: "", password_confirmation: "" });
  const [regLoading, setRegLoading] = useState(false);
  const [regTenantSlug, setRegTenantSlug] = useState("");
  const [twoFASetup, setTwoFASetup] = useState<{ secret: string; qr_code_svg: string } | null>(null);
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [twoFARecoveryCodes, setTwoFARecoveryCodes] = useState<string[]>([]);
  const [twoFAConfirmCode, setTwoFAConfirmCode] = useState("");
  // NPS
  const [npsSurveys, setNpsSurveys] = useState<NpsSurvey[]>([]);
  const [npsStats, setNpsStats] = useState<NpsStats | null>(null);
  const [npsTab, setNpsTab] = useState<"dashboard" | "surveys" | "responses">("dashboard");
  const [npsPanelMode, setNpsPanelMode] = useState<"closed" | "create" | "edit">("closed");
  const [npsPanelData, setNpsPanelData] = useState<any>({ titre: "", description: "", type: "nps", declencheur: "fin_parcours", questions: [{ text: "", type: "nps" }], actif: true });
  const [npsSelectedSurvey, setNpsSelectedSurvey] = useState<(NpsSurvey & { responses: NpsResponse[] }) | null>(null);
  // Gamification
  const [badges, setBadges] = useState<Badge[]>([]);
  const [badgeTemplates, setBadgeTemplates] = useState<BadgeTemplate[]>([]);
  const [myBadges, setMyBadges] = useState<Badge[]>([]);
  const [badgeTplPanel, setBadgeTplPanel] = useState<{ mode: "closed" | "create" | "edit"; data: any }>({ mode: "closed", data: {} });
  // Employee NPS
  const [empSurveys, setEmpSurveys] = useState<any[]>([]);
  const [empNpsAnswers, setEmpNpsAnswers] = useState<Record<string, any>>({});
  // Notification bell
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  // Employee cooptation
  const [empCampaigns, setEmpCampaigns] = useState<CooptationCampaign[]>([]);
  const [empCooptations, setEmpCooptations] = useState<Cooptation[]>([]);
  const [empCooptForm, setEmpCooptForm] = useState<{ open: boolean; campaign_id: number | null; candidate_name: string; candidate_email: string; candidate_poste: string; telephone: string; linkedin_url: string; message: string }>({ open: false, campaign_id: null, candidate_name: "", candidate_email: "", candidate_poste: "", telephone: "", linkedin_url: "", message: "" });
  // Notifications config
  const [notifConfig, setNotifConfig] = useState<Record<string, { email: boolean; push: boolean; inapp: boolean }>>(() => {
    const saved = localStorage.getItem("illizeo_notif_config");
    if (saved) try { return JSON.parse(saved); } catch {}
    const defaults: Record<string, { email: boolean; push: boolean; inapp: boolean }> = {};
    ["anniversaire","fin_contrat","fin_essai","nouveau_questionnaire","nouvelle_tache","relance_retard","piece_a_valider","piece_completee","piece_refusee","arrivees_semaine","nouvelle_recrue","questionnaire_complete","invitation_utilisateur","delegation"].forEach(k => { defaults[k] = { email: true, push: false, inapp: true }; });
    return defaults;
  });

  // Equipment Management
  const [equipTypes, setEquipTypes] = useState<EquipmentType[]>([]);
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [equipStats, setEquipStats] = useState<EquipmentStats | null>(null);
  const [equipPanel, setEquipPanel] = useState<{ mode: "closed" | "create" | "edit"; data: any }>({ mode: "closed", data: {} });
  const [equipFilter, setEquipFilter] = useState<string>("all");
  const [equipTab, setEquipTab] = useState<"inventaire" | "packages" | "types">("inventaire");
  const [equipPackages, setEquipPackages] = useState<EquipmentPackage[]>([]);
  const [pkgPanel, setPkgPanel] = useState<{ mode: "closed" | "create" | "edit"; data: any }>({ mode: "closed", data: {} });
  // Signature Documents
  const [signDocs, setSignDocs] = useState<SignatureDoc[]>([]);
  const [signPanel, setSignPanel] = useState<{ mode: "closed" | "create" | "edit"; data: any }>({ mode: "closed", data: {} });
  const [signAcks, setSignAcks] = useState<DocAcknowledgement[]>([]);
  const [signSelectedDoc, setSignSelectedDoc] = useState<number | null>(null);
  const [myPendingSigs, setMyPendingSigs] = useState<DocAcknowledgement[]>([]);
  // Setup Wizard for new tenants
  const [showSetupWizard, setShowSetupWizard] = useState(false);
  const [setupStep, setSetupStep] = useState(0);
  const [setupData, setSetupData] = useState<Record<string, any>>({
    company_name: "", sector: "", company_size: "", site_principal: "",
    invited_emails: ["", "", ""], invited_roles: ["admin_rh", "manager", "onboardee"],
    docs_checked: ["piece_identite", "rib", "attestation_securite_sociale", "photo_identite"],
    welcome_email_customized: false, first_collab_added: false,
  });
  const [setupCompleted, setSetupCompleted] = useState<string[]>([]);

  // ═══ API DATA (fallback-first — only fetch when authenticated) ═══
  const apiEnabled = { enabled: auth.isAuthenticated };
  // Only show mock data for the editor tenant (illizeo). Other tenants get empty arrays.
  const isDemo = (localStorage.getItem("illizeo_tenant_id") || "illizeo") === "illizeo";
  const { data: COLLABORATEURS, refetch: refetchCollaborateurs } = useApiData(getCollaborateurs, isDemo ? _MOCK_COLLABORATEURS : [], apiEnabled);
  const { data: PARCOURS_TEMPLATES, refetch: refetchParcours } = useApiData(getParcours, isDemo ? _MOCK_PARCOURS_TEMPLATES : [], apiEnabled);
  const { data: ACTION_TEMPLATES, refetch: refetchActions } = useApiData(getActions, isDemo ? _MOCK_ACTION_TEMPLATES as any : [], apiEnabled);
  const { data: GROUPES, refetch: refetchGroupes } = useApiData(getGroupes, isDemo ? _MOCK_GROUPES as any : [], apiEnabled);
  const { data: PHASE_DEFAULTS, refetch: refetchPhases } = useApiData(getPhases, isDemo ? _MOCK_PHASE_DEFAULTS : [], apiEnabled);
  const { data: WORKFLOW_RULES } = useApiData(getWorkflows, isDemo ? _MOCK_WORKFLOW_RULES : [], apiEnabled);
  const { data: EMAIL_TEMPLATES } = useApiData(getEmailTemplates, isDemo ? _MOCK_EMAIL_TEMPLATES : [], apiEnabled);
  const { data: ADMIN_DOC_CATEGORIES } = useApiData(getDocumentCategories, isDemo ? _MOCK_ADMIN_DOC_CATEGORIES : [], apiEnabled);
  const { data: NOTIFICATIONS_LIST } = useApiData(getNotificationsConfig, isDemo ? _MOCK_NOTIFICATIONS_LIST as string[] : [], apiEnabled);
  const { data: integrations, refetch: refetchIntegrations } = useApiData(getIntegrations, [] as any[], apiEnabled);

  const authRole: UserRole = auth.isAdmin ? "rh" : "employee";
  const [role, setRole] = useState<UserRole>(authRole);
  useEffect(() => { setRole(authRole); }, [authRole]);
  const [step, setStep] = useState<OnboardingStep>("dashboard");
  const [showPreboard, setShowPreboard] = useState(false); // Set to true to show preboarding
  const [dashPage, setDashPage] = useState<DashboardPage>("tableau_de_bord");
  const [adminPage, setAdminPage] = useState<AdminPage>(_needsPlan ? "admin_abonnement" : "admin_dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [adminModal, setAdminModal] = useState<AdminModal>(null);
  const [parcoursFilter, setParcoursFilter] = useState<ParcoursCategorie | "all">("all");
  const [actionFilter, setActionFilter] = useState("all");
  const [toast, setToast] = useState<string | null>(null);
  const addToast_admin = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };
  const showConfirm = (message: string, onConfirm: () => void) => setConfirmDialog({ message, onConfirm });
  const [promptModal, setPromptModal] = useState<{ message: string; label: string; type: string; defaultValue: string; onSubmit: (val: string) => void } | null>(null);
  const [promptValue, setPromptValue] = useState("");
  const showPrompt = (message: string, onSubmit: (val: string) => void, opts?: { label?: string; type?: string; defaultValue?: string }) => {
    const dv = opts?.defaultValue || "";
    setPromptValue(dv);
    setPromptModal({ message, label: opts?.label || "", type: opts?.type || "text", defaultValue: dv, onSubmit });
  };
  const [selectedCollab, setSelectedCollab] = useState<number | null>(null);
  const [selectedParcours, setSelectedParcours] = useState<number>(1);
  const [adminSearchQuery, setAdminSearchQuery] = useState("");
  const [adminActionsTab, setAdminActionsTab] = useState<"actions" | "groupes">("actions");
  const [parcoursTab, setParcoursTab] = useState<"parcours" | "phases" | "actions" | "groupes">("parcours");
  const [parcoursCat, setParcoursCat] = useState<ParcoursCategorie | "all">("all");
  const [selectedParcoursId, setSelectedParcoursId] = useState<number | null>(null);
  // Parcours CRUD panel
  const [parcoursPanelMode, setParcoursPanelMode] = useState<"closed" | "create" | "edit">("closed");
  const [parcoursPanelData, setParcoursPanelData] = useState<{ id?: number; nom: string; categorie: ParcoursCategorie; status: "actif" | "brouillon" | "archive" }>({ nom: "", categorie: "onboarding", status: "brouillon" });
  const [parcoursPanelLoading, setParcoursPanelLoading] = useState(false);
  // Phase CRUD panel
  const [phasePanelMode, setPhasePanelMode] = useState<"closed" | "create" | "edit">("closed");
  const [phasePanelData, setPhasePanelData] = useState<{ id?: number; nom: string; delaiDebut: string; delaiFin: string; couleur: string; parcoursIds: number[] }>({ nom: "", delaiDebut: "J+0", delaiFin: "J+0", couleur: "#4CAF50", parcoursIds: [] });
  const [phasePanelLoading, setPhasePanelLoading] = useState(false);
  // Action CRUD panel
  const [actionPanelMode, setActionPanelMode] = useState<"closed" | "create" | "edit">("closed");
  const [actionPanelData, setActionPanelData] = useState<{
    id?: number; titre: string; type: ActionType; phaseIds: number[]; delaiRelatif: string;
    obligatoire: boolean; description: string;
    lienExterne: string; dureeEstimee: string;
    options: Record<string, any>;
  }>({ titre: "", type: "tache", phaseIds: [], delaiRelatif: "J+0", obligatoire: false, description: "", lienExterne: "", dureeEstimee: "", options: {} });
  const [actionPanelLoading, setActionPanelLoading] = useState(false);
  const [assignMode, setAssignMode] = useState<"tous" | "individuel" | "groupe">("tous");
  const [assignSelected, setAssignSelected] = useState<string[]>([]);
  const [assignSearch, setAssignSearch] = useState("");
  const [assignOpen, setAssignOpen] = useState(false);
  // Collaborateur CRUD panel
  const [collabPanelMode, setCollabPanelMode] = useState<"closed" | "create" | "edit">("closed");
  const [collabPanelData, setCollabPanelData] = useState<{
    id?: number; prenom: string; nom: string; email: string; poste: string;
    site: string; departement: string; dateDebut: string;
  }>({ prenom: "", nom: "", email: "", poste: "", site: "", departement: "", dateDebut: "" });
  const [collabPanelLoading, setCollabPanelLoading] = useState(false);
  // Collaborateur profile view
  const [collabProfileId, setCollabProfileId] = useState<number | null>(null);
  const [collabProfileTab, setCollabProfileTab] = useState<"apercu" | "infos" | "documents" | "actions" | "equipe" | "messages" | "dossier">("apercu");
  const [dossierCheck, setDossierCheck] = useState<DossierCheck | null>(null);
  // Groupe CRUD panel
  const [groupePanelMode, setGroupePanelMode] = useState<"closed" | "create" | "edit">("closed");
  const [groupePanelData, setGroupePanelData] = useState<{
    id?: number; nom: string; description: string; couleur: string;
    critereType: string; critereValeur: string; membres: string[];
  }>({ nom: "", description: "", couleur: "#C2185B", critereType: "", critereValeur: "", membres: [] });
  const [groupePanelLoading, setGroupePanelLoading] = useState(false);
  // Integration config panel
  const [integrationPanelId, setIntegrationPanelId] = useState<number | null>(null);
  const [integrationConfig, setIntegrationConfig] = useState<Record<string, any>>({});
  const [integrationSaving, setIntegrationSaving] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState("");
  // Confirm dialog
  // Suivi filters
  const [suiviFilter, setSuiviFilter] = useState<"all" | "en_cours" | "en_retard" | "termine">("all");
  const [suiviSearch, setSuiviSearch] = useState("");
  const [collabMenuId, setCollabMenuId] = useState<number | null>(null);
  useEffect(() => {
    if (collabMenuId === null) return;
    const close = () => setCollabMenuId(null);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [collabMenuId]);
  // AD provisioning
  const [adMappings, setAdMappings] = useState<any[]>([]);
  const [adGroups, setAdGroups] = useState<any[]>([]);
  const [syncLoading, setSyncLoading] = useState(false);
  // Onboarding teams
  const [obTeams, setObTeams] = useState<any[]>([]);
  const [teamPanelMode, setTeamPanelMode] = useState<"closed" | "create" | "edit">("closed");
  const [teamPanelData, setTeamPanelData] = useState<any>({ nom: "", description: "", site: "", members: [] });
  // Workflow panel
  const [wfPanelMode, setWfPanelMode] = useState<"closed" | "create" | "edit">("closed");
  const [wfPanelData, setWfPanelData] = useState<any>({ nom: "", declencheur: "", action: "", destinataire: "", actif: true });
  // Email template panel
  const [tplPanelMode, setTplPanelMode] = useState<"closed" | "create" | "edit">("closed");
  const [tplPanelData, setTplPanelData] = useState<any>({ nom: "", sujet: "", declencheur: "", variables: [], actif: true, contenu: "" });
  // Contrat panel
  const [contratPanelMode, setContratPanelMode] = useState<"closed" | "create" | "edit">("closed");
  const [contratPanelData, setContratPanelData] = useState<any>({ nom: "", type: "CDI", juridiction: "Suisse", actif: true });
  // Language
  const [lang, setLangState] = useState<Lang>(getLang());
  const switchLang = (l: Lang) => { setLang(l); setLangState(l); };
  const [darkMode, setDarkMode] = useState(() => isDarkMode());
  const toggleDarkMode = () => { const next = !darkMode; applyDarkMode(next); setDarkMode(next); };
  const [activeLanguages, setActiveLanguages] = useState<Lang[]>(() => {
    try { const saved = localStorage.getItem("illizeo_active_languages"); return saved ? JSON.parse(saved) : ["fr", "en"]; } catch { return ["fr", "en"]; }
  });
  // Content translations (per-entity: { fieldName: { en: "...", de: "..." } })
  const [contentTranslations, setContentTranslations] = useState<Record<string, Translations>>({});
  const setTr = (field: string, tr: Translations) => setContentTranslations(prev => ({ ...prev, [field]: tr }));
  const resetTr = () => setContentTranslations({});
  const buildTranslationsPayload = () => {
    const result: Record<string, Record<string, string>> = {};
    for (const [field, tr] of Object.entries(contentTranslations)) {
      for (const [lang, val] of Object.entries(tr)) {
        if (val?.trim()) { if (!result[field]) result[field] = {}; result[field][lang] = val; }
      }
    }
    return Object.keys(result).length > 0 ? result : undefined;
  };
  // Field config
  const [fieldConfig, setFieldConfig] = useState<any[]>([]);
  const [translateFieldId, setTranslateFieldId] = useState<number | null>(null);
  const [translateEN, setTranslateEN] = useState("");
  // User management
  const [adminUsers, setAdminUsers] = useState<any[]>([]);
  const [userPanelMode, setUserPanelMode] = useState<"closed" | "create" | "edit">("closed");
  const [userPanelData, setUserPanelData] = useState<{ id?: number; name: string; email: string; password: string; role: string }>({ name: "", email: "", password: "", role: "onboardee" });
  const [userPanelLoading, setUserPanelLoading] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState<string>("all");
  // GED (Documents)
  const [gedTab, setGedTab] = useState<"templates" | "suivi" | "validation">("templates");
  const [gedSearch, setGedSearch] = useState("");
  const [gedCatFilter, setGedCatFilter] = useState<string>("all");
  const [tplPanelOpen, setTplPanelOpen] = useState<"closed" | "create" | "edit">("closed");
  const [tplPanelDoc, setTplPanelDoc] = useState<any>({ nom: "", categorie: "", obligatoire: false, type: "upload", description: "", fichier_modele: "" });
  const [selectedDocsForValidation, setSelectedDocsForValidation] = useState<Set<number>>(new Set());
  const [realDocs, setRealDocs] = useState<UploadedDocument[]>([]);
  // Email config
  const [emailConfig, setEmailConfig] = useState({ single_recipient: "", from_address: "no-reply@illizeo.com", from_name: "Illizeo", mailer: "log" });
  const [tplCatFilter, setTplCatFilter] = useState<string>("all");
  const [tplPreview, setTplPreview] = useState(false);
  // Apparence & settings
  const [themeColor, setThemeColor] = useState(() => localStorage.getItem("illizeo_theme_color") || "#C2185B");
  const [region, setRegion] = useState(() => localStorage.getItem("illizeo_region") || "CH");
  const [dateFormat, setDateFormat] = useState(() => localStorage.getItem("illizeo_date_format") || "DD/MM/YYYY");
  const [timeFormat, setTimeFormat] = useState(() => localStorage.getItem("illizeo_time_format") || "24h");
  const [timezone, setTimezone] = useState(() => localStorage.getItem("illizeo_timezone") || "Europe/Zurich");
  const [customLogo, setCustomLogo] = useState(() => localStorage.getItem("illizeo_custom_logo") || "");
  const [customLogoFull, setCustomLogoFull] = useState(() => localStorage.getItem("illizeo_custom_logo_full") || "");
  const [loginBgImage, setLoginBgImage] = useState(() => localStorage.getItem("illizeo_login_bg_image") || "");
  const [customFavicon, setCustomFavicon] = useState(() => localStorage.getItem("illizeo_custom_favicon") || "");
  // Apply theme color to design tokens
  C.pink = themeColor;
  C.pinkLight = lighten(themeColor, 0.85);
  C.pinkBg = lighten(themeColor, 0.92);
  C.pinkSoft = lighten(themeColor, 0.15);
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--iz-pink", themeColor);
    root.style.setProperty("--iz-pink-bg", lighten(themeColor, 0.92));
    root.style.setProperty("--iz-pink-hover", colorWithAlpha(themeColor, 0.06));
    root.style.setProperty("--iz-pink-shadow", colorWithAlpha(themeColor, 0.3));
  }, [themeColor]);
  // Cooptation
  const [cooptations, setCooptations] = useState<Cooptation[]>([]);
  const [cooptStats, setCooptStats] = useState<CooptationStats | null>(null);
  const [cooptSettings, setCooptSettings] = useState<CooptationSettings | null>(null);
  const [cooptFilter, setCooptFilter] = useState<"all" | Cooptation["statut"]>("all");
  const [cooptCampaignFilter, setCooptCampaignFilter] = useState<number | "all">("all");
  const [cooptPanelMode, setCooptPanelMode] = useState<"closed" | "create" | "edit">("closed");
  const [cooptPanelData, setCooptPanelData] = useState<any>({ referrer_name: "", referrer_email: "", candidate_name: "", candidate_email: "", candidate_poste: "", linkedin_url: "", telephone: "", type_recompense: "prime", montant_recompense: 500, mois_requis: 6, notes: "" });
  const [cooptSettingsOpen, setCooptSettingsOpen] = useState(false);
  const [cooptTab, setCooptTab] = useState<"cooptations" | "campagnes" | "classement">("cooptations");
  const [campaigns, setCampaigns] = useState<CooptationCampaign[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [campaignPanelMode, setCampaignPanelMode] = useState<"closed" | "create" | "edit">("closed");
  const [campaignPanelData, setCampaignPanelData] = useState<any>({ titre: "", description: "", departement: "", site: "", type_contrat: "CDI", type_recompense: "prime", montant_recompense: 500, mois_requis: 6, nombre_postes: 1, priorite: "normale", date_limite: "" });
  // Company blocks
  const [companyBlocks, setCompanyBlocks] = useState<any[]>([]);
  const [editingBlockId, setEditingBlockId] = useState<number | null>(null);
  // User notifications
  const [userNotifs, setUserNotifs] = useState<any[]>([]);
  const [notifUnread, setNotifUnread] = useState(0);
  // Messaging
  const [msgConversations, setMsgConversations] = useState<any[]>([]);
  const [msgActiveConvId, setMsgActiveConvId] = useState<number | null>(null);
  const [msgMessages, setMsgMessages] = useState<any[]>([]);
  const [msgInput, setMsgInput] = useState("");
  const [msgSending, setMsgSending] = useState(false);
  const [msgUsers, setMsgUsers] = useState<any[]>([]);
  const msgEndRef = useRef<HTMLDivElement>(null);
  const [msgShowNewConv, setMsgShowNewConv] = useState(false);
  const [msgSearchQuery, setMsgSearchQuery] = useState("");
  const [confirmDialog, setConfirmDialog] = useState<{ message: string; onConfirm: () => void } | null>(null);
  const [selectedAction, setSelectedAction] = useState<number | null>(null);
  const [actionTypeFilter, setActionTypeFilter] = useState<ActionType | "all">("all");
  const [actionParcoursFilter, setActionParcoursFilter] = useState<string>("all");
  const [selectedActionType, setSelectedActionType] = useState<ActionType>("tache");
  const [suspendedParcours, setSuspendedParcours] = useState<Set<number>>(new Set());
  const [docPieces, setDocPieces] = useState<{ nom: string; obligatoire: boolean; type: "upload" | "formulaire" }[]>([]);
  const [parcoursStatut, setParcoursStatut] = useState<"Actif" | "Brouillon" | "Archivé">("Actif");
  const [groupeColor, setGroupeColor] = useState("#C2185B");
  const [groupeMembres, setGroupeMembres] = useState<string[]>([]);
  const _mockContrats = [
    { id: 1, nom: "CDI — Droit Suisse", type: "CDI", juridiction: "Suisse", variables: 18, derniereMaj: "15/02/2026", actif: true, fichier: "CDI_Suisse_v3.docx" },
    { id: 2, nom: "CDI — Droit Français", type: "CDI", juridiction: "France", variables: 22, derniereMaj: "10/01/2026", actif: true, fichier: "CDI_France_v2.docx" },
    { id: 3, nom: "CDD — Droit Suisse", type: "CDD", juridiction: "Suisse", variables: 20, derniereMaj: "15/02/2026", actif: true, fichier: "CDD_Suisse_v1.docx" },
    { id: 4, nom: "Convention de stage", type: "Stage", juridiction: "France", variables: 15, derniereMaj: "05/03/2026", actif: true, fichier: "Convention_Stage_v4.docx" },
    { id: 5, nom: "Contrat d'alternance", type: "Alternance", juridiction: "France", variables: 16, derniereMaj: "12/01/2026", actif: false, fichier: "Alternance_v1.docx" },
    { id: 6, nom: "Avenant de mobilité", type: "Avenant", juridiction: "Multi", variables: 12, derniereMaj: "20/02/2026", actif: true, fichier: "Avenant_Mobilite_v2.docx" },
  ];
  const { data: apiContrats } = useApiData(getContrats, isDemo ? _mockContrats : []);
  const [contrats, setContrats] = useState(_mockContrats);
  useEffect(() => { setContrats(apiContrats); }, [apiContrats]);
  const [selectedContratId, setSelectedContratId] = useState<number | null>(null);
  const [entrepriseBlocs, setEntrepriseBlocs] = useState([
    { id: 1, titre: "À propos", type: "Texte + image", actif: true },
    { id: 2, titre: "Notre mission", type: "Texte + image", actif: true },
    { id: 3, titre: "Great Place to Work", type: "Bannière statistiques", actif: true },
    { id: 4, titre: "Positive Innovation", type: "Texte", actif: true },
    { id: 5, titre: "Vidéos", type: "Carrousel vidéo", actif: true },
    { id: 6, titre: "Nos valeurs", type: "Icônes + texte", actif: false },
    { id: 7, titre: "Témoignages", type: "Citations collaborateurs", actif: false },
  ]);
  const [entrepriseVideos, setEntrepriseVideos] = useState([
    { id: 1, titre: "Bienvenue du Président", url: "https://illizeo.com/video/president" },
    { id: 2, titre: "Découverte du groupe", url: "https://illizeo.com/video/groupe" },
  ]);
  const [gradientColor, setGradientColor] = useState("#2D1B3D");
  const [bannerUploaded, setBannerUploaded] = useState(false);
  const [employeeBannerColor, setEmployeeBannerColor] = useState("#2D1B3D");
  const [employeeBannerCustom, setEmployeeBannerCustom] = useState(false);
  const [bannerImage, setBannerImage] = useState<string | null>(null);
  const [avatarImage, setAvatarImage] = useState<string | null>(() => localStorage.getItem("illizeo_avatar") || null);
  const [avatarZoom, setAvatarZoom] = useState(100);
  const [avatarPos, setAvatarPos] = useState({ x: 50, y: 50 });
  const [showAvatarEditor, setShowAvatarEditor] = useState(false);
  const [bannerZoom, setBannerZoom] = useState(100);
  const [bannerPos, setBannerPos] = useState({ x: 50, y: 50 });
  const [bannerDragging, setBannerDragging] = useState(false);
  const [bannerEditMode, setBannerEditMode] = useState(false);
  const bannerRef = useRef<HTMLDivElement>(null);
  const [uploadedPieces, setUploadedPieces] = useState<Record<string, "uploaded" | "validated" | "refused">>({}); 
  const [modalPieces, setModalPieces] = useState<string[]>([]);
  const [modalFormFields, setModalFormFields] = useState<{ label: string; type: string }[]>([]);
  const [modalQuestions, setModalQuestions] = useState<{ question: string; type: string; options?: string[] }[]>([]);
  const [modalSubtasks, setModalSubtasks] = useState<string[]>([]);
  const [phases, setPhases] = useState(() => _MOCK_PHASE_DEFAULTS.map(p => ({ ...p })));
  useEffect(() => { if (PHASE_DEFAULTS !== _MOCK_PHASE_DEFAULTS) setPhases(PHASE_DEFAULTS.map(p => ({ ...p }))); }, [PHASE_DEFAULTS]);
  const [selectedPhaseId, setSelectedPhaseId] = useState<number | null>(null);
  const [messageCanal, setMessageCanal] = useState<"email" | "inapp" | "sms">("email");
  const [messageBody, setMessageBody] = useState("");
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showDocPanel, setShowDocPanel] = useState<string | null>(null);
  const [showDocCategory, setShowDocCategory] = useState<string | null>(null);
  const [showActionDetail, setShowActionDetail] = useState<number | null>(null);
  const [actionTab, setActionTab] = useState<DashboardTab>("toutes");
  const [showProfile, setShowProfile] = useState(false);
  const [profileTab, setProfileTab] = useState("infos");
  const [formData, setFormData] = useState({
    prenom: "Nadia", nom: "Ferreira", dateNaissance: "15/09/1990", genre: "Femme",
    nationalite: "Marocaine", metier: "Chef de Projet", site: "Genève",
    departement: "B030-Switzerland", fuseau: "Europe/Paris (UTC +01:00)", dateDebut: "01/06/2026",
    email: "nadia.ferreira@gmail.com", password: "", confirmPassword: "", photoUploaded: false,
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [acceptCGU, setAcceptCGU] = useState(false);

  // ═══ SHARED STATE — Cross-role data flow ═══════════════════
  type DocStatus = "manquant" | "soumis" | "en_attente" | "valide" | "refuse";
  type TimelineEntry = { date: string; heure: string; event: string; type: "system" | "success" | "email" | "warning" | "action"; detail: string };
  type Toast = { id: number; message: string; type: "success" | "info" | "warning"; role: UserRole };

  const [employeeDocs, setEmployeeDocs] = useState<Record<string, DocStatus>>({
    "IBAN/BIC Suisse *": "manquant",
    "Certificats De Travail et Diplômes *": "manquant",
    "Pièce d'identité / Passeport *": "manquant",
    "Carte AVS": "manquant",
    "Permis de travail ou de résidence": "manquant",
    "Photo d'identité *": "manquant",
    "Pièce justificative": "manquant",
  });

  const [completedActions, setCompletedActions] = useState<Set<number>>(new Set());

  const [sharedTimeline, setSharedTimeline] = useState<TimelineEntry[]>([
    { date: "15/02/2026", heure: "10:30", event: "Parcours onboarding créé", type: "system", detail: "Parcours « Onboarding Standard » assigné par Admin RH" },
    { date: "15/02/2026", heure: "10:31", event: "Email d'invitation envoyé", type: "email", detail: "Email envoyé à nadia.ferreira@gmail.com" },
  ]);

  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastIdRef = useRef(0);

  const addToast = useCallback((message: string, type: Toast["type"] = "success", targetRole?: UserRole) => {
    const id = ++toastIdRef.current;
    setToasts(prev => [...prev, { id, message, type, role: targetRole || role }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, [role]);

  const addTimelineEntry = useCallback((event: string, type: TimelineEntry["type"], detail: string) => {
    const now = new Date();
    setSharedTimeline(prev => [{
      date: fmtDate(now),
      heure: fmtTime(now),
      event, type, detail,
    }, ...prev]);
  }, []);

  // Employee submits a document
  const handleEmployeeSubmitDoc = useCallback((docName: string) => {
    setEmployeeDocs(prev => ({ ...prev, [docName]: "en_attente" }));
    addTimelineEntry(`Document soumis : ${docName}`, "success", `Soumis par ${formData.prenom} ${formData.nom}, en attente de validation RH`);
    addToast(`${docName} soumis avec succès`, "success");
    addToast(`Nouveau document à valider : ${docName} (${formData.prenom})`, "info", "rh");
  }, [formData.prenom, formData.nom, addTimelineEntry, addToast]);

  // RH validates a document
  const handleRHValidateDoc = useCallback((docName: string) => {
    setEmployeeDocs(prev => ({ ...prev, [docName]: "valide" }));
    addTimelineEntry(`Document validé : ${docName}`, "success", "Validé par Admin RH");
    addToast(`Document validé : ${docName}`, "success");
    addToast(`Votre document "${docName}" a été validé !`, "success", "employee");
  }, [addTimelineEntry, addToast]);

  // RH refuses a document
  const handleRHRefuseDoc = useCallback((docName: string) => {
    setEmployeeDocs(prev => ({ ...prev, [docName]: "refuse" }));
    addTimelineEntry(`Document refusé : ${docName}`, "warning", "Refusé par Admin RH — veuillez resoumettre");
    addToast(`Document refusé : ${docName}`, "warning");
    addToast(`Votre document "${docName}" a été refusé, veuillez le resoumettre`, "warning", "employee");
  }, [addTimelineEntry, addToast]);

  // Employee completes an action
  const handleCompleteAction = useCallback((actionId: number) => {
    setCompletedActions(prev => new Set(prev).add(actionId));
    const action = ACTIONS.find(a => a.id === actionId);
    if (action) {
      addTimelineEntry(`Action complétée : ${action.title}`, "success", `Marquée comme terminée par ${formData.prenom}`);
      addToast(`Action "${action.title.substring(0, 40)}..." terminée`, "success");
      addToast(`${formData.prenom} a complété : ${action.title.substring(0, 40)}...`, "info", "rh");
    }
  }, [formData.prenom, addTimelineEntry, addToast]);

  // RH sends a relance
  const handleRelance = useCallback((collabName: string, motif: string) => {
    addTimelineEntry(`Relance envoyée à ${collabName}`, "email", motif);
    addToast(`Relance envoyée à ${collabName}`, "success");
    addToast(`Vous avez reçu une relance de la part de l'équipe RH`, "warning", "employee");
  }, [addTimelineEntry, addToast]);

  // Computed: how many docs submitted/validated for employee
  const docsSubmitted = Object.values(employeeDocs).filter(s => s === "en_attente" || s === "valide").length;
  const docsValidated = Object.values(employeeDocs).filter(s => s === "valide").length;
  const docsTotal = Object.keys(employeeDocs).length;
  const docsMissing = Object.values(employeeDocs).filter(s => s === "manquant" || s === "refuse").length;
  const employeeProgression = Math.round(((docsValidated + completedActions.size) / (docsTotal + ACTIONS.length)) * 100);

  // Update collaborateurs data dynamically (Nadia = id 1)
  const getLiveCollaborateurs = useCallback(() => {
    return COLLABORATEURS.map(c => {
      if (c.id === 1) {
        return {
          ...c,
          docsValides: docsValidated,
          docsTotal: docsTotal,
          actionsCompletes: completedActions.size,
          progression: employeeProgression,
          status: (employeeProgression === 100 ? "termine" : docsMissing > 2 ? "en_retard" : "en_cours") as Collaborateur["status"],
        };
      }
      return c;
    });
  }, [COLLABORATEURS, docsValidated, docsTotal, completedActions.size, employeeProgression, docsMissing]);

  // ═══ END SHARED STATE ══════════════════════════════════════

  // Auto-show welcome modal on first dashboard visit + track pre-boarding steps
  const hasTrackedOnboard = useRef(false);
  useEffect(() => {
    if (step === "dashboard" && !hasTrackedOnboard.current) {
      hasTrackedOnboard.current = true;
    }
  }, [step]);

  // Dynamic doc category missing counts
  const getLiveDocCategories = useCallback(() => {
    return DOC_CATEGORIES.map(cat => {
      const missingCount = cat.docs.filter(docName => {
        const status = employeeDocs[docName];
        return !status || status === "manquant" || status === "refuse";
      }).length;
      return { ...cat, missing: missingCount };
    });
  }, [employeeDocs]);

  // ─── AD provisioning effects ────────────────────────────────
  useEffect(() => {
    if (auth.isAuthenticated && auth.isAdmin && adminPage === "admin_provisioning") {
      getADGroupMappings().then(setAdMappings).catch(() => {});
      const entraInteg = (integrations || []).find((i: any) => i.provider === "entra_id" && i.connecte);
      if (entraInteg) {
        getADGroups(entraInteg.id).then(setAdGroups).catch(() => {});
      }
    }
  }, [auth.isAuthenticated, adminPage, integrations]);

  // ─── Onboarding teams effects ───────────────────────────────
  useEffect(() => {
    if (auth.isAuthenticated && auth.isAdmin && adminPage === "admin_equipes") {
      getOnboardingTeams().then(setObTeams).catch(() => {});
    }
  }, [auth.isAuthenticated, adminPage]);

  // ─── Cooptation effects ───────────────────────────────────
  useEffect(() => {
    if (auth.isAuthenticated && auth.isAdmin && adminPage === "admin_cooptation") {
      getCooptations().then(setCooptations).catch(() => {});
      getCooptationStats().then(setCooptStats).catch(() => {});
      getCooptationSettings().then(setCooptSettings).catch(() => {});
      getCooptationCampaigns().then(setCampaigns).catch(() => {});
      getCooptationLeaderboard().then(setLeaderboard).catch(() => {});
    }
  }, [auth.isAuthenticated, adminPage]);

  // ─── Company settings effects ──────────────────────────────
  useEffect(() => {
    if (auth.isAuthenticated) {
      getCompanySettings().then(s => {
        if (s.theme_color) { setThemeColor(s.theme_color); localStorage.setItem("illizeo_theme_color", s.theme_color); }
        if (s.custom_logo) { setCustomLogo(s.custom_logo); localStorage.setItem("illizeo_custom_logo", s.custom_logo); }
        if (s.custom_logo_full) { setCustomLogoFull(s.custom_logo_full); localStorage.setItem("illizeo_custom_logo_full", s.custom_logo_full); }
        if (s.custom_favicon) { setCustomFavicon(s.custom_favicon); localStorage.setItem("illizeo_custom_favicon", s.custom_favicon); }
        if (s.region) { setRegion(s.region); localStorage.setItem("illizeo_region", s.region); }
        if (s.date_format) { setDateFormat(s.date_format); localStorage.setItem("illizeo_date_format", s.date_format); }
        if (s.time_format) { setTimeFormat(s.time_format); localStorage.setItem("illizeo_time_format", s.time_format); }
        if (s.timezone) { setTimezone(s.timezone); localStorage.setItem("illizeo_timezone", s.timezone); }
        if (s.login_bg_image) { setLoginBgImage(s.login_bg_image); localStorage.setItem("illizeo_login_bg_image", s.login_bg_image); }
        if (s.active_languages) { try { const langs = JSON.parse(s.active_languages); setActiveLanguages(langs); localStorage.setItem("illizeo_active_languages", s.active_languages); } catch {} }
        // Setup wizard: show for new tenants (non-illizeo, no setup_completed flag)
        if (!isDemo && auth.isAdmin && !s.setup_completed) {
          setShowSetupWizard(true);
          if (s.setup_steps_done) try { setSetupCompleted(JSON.parse(s.setup_steps_done)); } catch {}
          if (s.company_name) setSetupData(prev => ({ ...prev, company_name: s.company_name }));
        }
        // Load avatar per user
        const avatarKey = `avatar_${auth.user?.id}`;
        if (s[avatarKey]) { setAvatarImage(s[avatarKey]); localStorage.setItem("illizeo_avatar", s[avatarKey]); }
      }).catch(() => {});
    }
  }, [auth.isAuthenticated]);

  // Helper to save a setting both locally and to API
  const saveSetting = (key: string, value: string, localSetter: (v: string) => void) => {
    localSetter(value);
    localStorage.setItem(`illizeo_${key}`, value);
    updateCompanySettings({ [key]: value }).catch(() => {});
  };

  // ─── Employee cooptation effects ────────────────────────────
  useEffect(() => {
    if (auth.isAuthenticated && dashPage === "cooptation") {
      getCooptationCampaigns().then(setEmpCampaigns).catch(() => {});
      getCooptations().then(list => setEmpCooptations(list.filter(c => c.referrer_email === auth.user?.email))).catch(() => {});
    }
  }, [auth.isAuthenticated, dashPage]);

  // ─── Gamification effects ──────────────────────────────────
  useEffect(() => {
    if (auth.isAuthenticated && auth.isAdmin && adminPage === "admin_gamification") {
      getBadges().then(setBadges).catch(() => {});
      getBadgeTemplates().then(setBadgeTemplates).catch(() => {});
    }
    if (auth.isAuthenticated && auth.isAdmin && adminPage === "admin_equipements") {
      getEquipmentTypes().then(setEquipTypes).catch(() => {});
      getEquipments().then(setEquipments).catch(() => {});
      getEquipmentStats().then(setEquipStats).catch(() => {});
      getEquipmentPackages().then(setEquipPackages).catch(() => {});
    }
    if (auth.isAuthenticated && auth.isAdmin && adminPage === "admin_signatures") {
      getSignatureDocuments().then(setSignDocs).catch(() => {});
    }
  }, [auth.isAuthenticated, adminPage]);
  // Load employee pending signatures
  useEffect(() => {
    if (auth.isAuthenticated && !auth.isAdmin) {
      getMyPendingSignatures().then(setMyPendingSigs).catch(() => {});
    }
  }, [auth.isAuthenticated]);
  // Close notification dropdown on outside click
  useEffect(() => {
    if (!showNotifDropdown) return;
    const close = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-notif-dropdown]")) setShowNotifDropdown(false);
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [showNotifDropdown]);

  // Notification polling (every 30s)
  useEffect(() => {
    if (!auth.isAuthenticated) return;
    const poll = () => {
      getUserNotifications().then(setUserNotifs).catch(() => {});
      getNotifUnreadCount().then(c => setNotifUnread(c.count ?? c)).catch(() => {});
    };
    poll();
    const interval = setInterval(poll, 30000);
    return () => clearInterval(interval);
  }, [auth.isAuthenticated]);

  // Load employee badges + surveys
  useEffect(() => {
    if (auth.isAuthenticated && !auth.isAdmin) {
      getMyBadges().then(setMyBadges).catch(() => {});
    }
    if (auth.isAuthenticated && dashPage === "satisfaction") {
      getNpsSurveys().then(setEmpSurveys).catch(() => {});
    }
  }, [auth.isAuthenticated, dashPage]);

  // ─── Documents effects ─────────────────────────────────────
  useEffect(() => {
    if (auth.isAuthenticated && auth.isAdmin && adminPage === "admin_documents") {
      getDocuments().then(setRealDocs).catch(() => {});
    }
  }, [auth.isAuthenticated, adminPage]);

  // ─── NPS effects ───────────────────────────────────────────
  useEffect(() => {
    if (auth.isAuthenticated && auth.isAdmin && adminPage === "admin_nps") {
      getNpsSurveys().then(setNpsSurveys).catch(() => {});
      getNpsStats().then(setNpsStats).catch(() => {});
    }
  }, [auth.isAuthenticated, adminPage]);

  // ─── Favicon effect ────────────────────────────────────────
  useEffect(() => {
    const href = customFavicon || ILLIZEO_LOGO_URI;
    let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement | null;
    if (!link) { link = document.createElement("link"); link.rel = "icon"; document.head.appendChild(link); }
    link.href = href;
  }, [customFavicon]);

  // ─── Reset password from URL ────────────────────────────────
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const rt = params.get('reset_token');
    const re = params.get('email');
    if (rt && re) {
      setResetMode(true);
      setResetToken(rt);
      setResetEmail(re);
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  // ─── SSO callback handler ───────────────────────────────────
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ssoStatus = params.get('sso');
    const ssoToken = params.get('token');
    if (ssoStatus === 'success' && ssoToken) {
      // Store token and reload
      import('./api/client').then(({ setToken }) => {
        setToken(ssoToken);
        window.history.replaceState({}, '', window.location.pathname);
        window.location.reload();
      });
    } else if (ssoStatus === 'error') {
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  // ─── Field config effects ───────────────────────────────────
  useEffect(() => {
    if (auth.isAuthenticated) {
      getFieldConfig().then(setFieldConfig).catch(() => {});
      get2FAStatus().then(res => setTwoFAEnabled(res.enabled)).catch(() => {});
      getActiveModules().then(setTenantActiveModules).catch(() => {});
      getStorageUsage().then(setStorageUsage).catch(() => {});
      getSignatureUsage().then(setSignatureUsage).catch(() => {});
      getMySubscription().then(res => {
        setTenantSubscriptions(res.subscriptions || []);
        setTenantActiveModules(res.active_modules || []);
        const tid = localStorage.getItem("illizeo_tenant_id") || "illizeo";
        if (tid === "illizeo") return; // Editor tenant — no restrictions

        const hasActiveSub = (res.subscriptions || []).some((s: any) => s.status === "active" || s.status === "trialing");
        const trialStart = localStorage.getItem("illizeo_trial_start");
        const trialExpired = trialStart && (new Date().getTime() - new Date(trialStart).getTime()) > 14 * 24 * 60 * 60 * 1000;

        if (!hasActiveSub && trialExpired) {
          // Trial expired + no subscription → force subscription page
          setAdminPage("admin_abonnement" as any);
          setSubView("change");
        } else if (!hasActiveSub && !trialStart) {
          // New tenant, never had trial → set trial start + go to subscription
          localStorage.setItem("illizeo_trial_start", new Date().toISOString());
          setAdminPage("admin_abonnement" as any);
          setSubView("change");
        }
        // If in trial (< 14 days) with no sub → let them use everything freely
      }).catch(() => {});
    }
  }, [auth.isAuthenticated]);

  // ─── User management effects ────────────────────────────────
  useEffect(() => {
    if (auth.isAuthenticated && auth.isAdmin && (adminPage === "admin_users" || adminPage === "admin_equipes")) {
      getUsers().then(setAdminUsers).catch(() => {});
    }
  }, [auth.isAuthenticated, adminPage]);

  // ─── Company blocks effects ─────────────────────────────────
  useEffect(() => {
    if (auth.isAuthenticated) {
      (auth.isAdmin ? getAllCompanyBlocks : getCompanyBlocks)().then(setCompanyBlocks).catch(() => {
        // Fallback to public endpoint if manage permission missing
        getCompanyBlocks().then(setCompanyBlocks).catch(() => {});
      });
    }
  }, [auth.isAuthenticated, dashPage, adminPage]);

  // ─── Notification effects ───────────────────────────────────
  useEffect(() => {
    if (auth.isAuthenticated) {
      getUserNotifications().then(setUserNotifs).catch(() => {});
      getNotifUnreadCount().then(r => setNotifUnread(r.count)).catch(() => {});
    }
  }, [auth.isAuthenticated, dashPage, adminPage]);

  // ─── Messaging effects (must be before auth guards) ────────
  useEffect(() => {
    if (auth.isAuthenticated && (dashPage === "messagerie" || adminPage === "admin_messagerie")) {
      getConversations().then(setMsgConversations).catch(() => {});
      getAvailableUsers().then(setMsgUsers).catch(() => {});
    }
  }, [auth.isAuthenticated, dashPage, adminPage]);

  useEffect(() => {
    if (msgActiveConvId) {
      apiGetMessages(msgActiveConvId).then(msgs => { setMsgMessages(msgs); setTimeout(() => msgEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100); }).catch(() => {});
    }
  }, [msgActiveConvId]);

  // ═══ AUTH GUARDS (after all hooks) ════════════════════════
  if (auth.loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: font, background: C.bg }}>
        <style dangerouslySetInnerHTML={{ __html: ANIM_STYLES }} />
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 48, height: 48, borderRadius: "50%", border: `3px solid ${C.border}`, borderTopColor: C.pink, animation: "izPulse 1s ease infinite", margin: "0 auto 16px" }} />
          <div style={{ fontSize: 14, color: C.textLight }}>Chargement...</div>
        </div>
      </div>
    );
  }

  // ─── Reset password page ─────────────────────────────────────
  if (resetMode && !auth.isAuthenticated) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: font, background: `linear-gradient(135deg, ${C.dark} 0%, #2D1B3D 50%, ${C.pink} 100%)` }}>
        <style dangerouslySetInnerHTML={{ __html: ANIM_STYLES }} />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;1,9..40,400&display=swap" rel="stylesheet" />
        <div className="iz-scale-in" style={{ width: 400, background: C.white, borderRadius: 16, padding: "40px 40px 36px", boxShadow: "0 20px 60px rgba(0,0,0,.3)" }}>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{ marginBottom: 8 }}><img src={getLogoFullUri()} alt="Illizeo" style={{ height: 48, objectFit: "contain", display: "block", margin: "0 auto" }} /></div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: C.dark, margin: 0 }}>Nouveau mot de passe</h1>
            <p style={{ fontSize: 13, color: C.textLight, marginTop: 4 }}>Choisissez un nouveau mot de passe pour {resetEmail}</p>
          </div>
          {resetDone ? (
            <div style={{ textAlign: "center" }}>
              <CheckCircle size={32} color={C.green} style={{ marginBottom: 12 }} />
              <div style={{ fontSize: 16, fontWeight: 600, color: C.green, marginBottom: 8 }}>Mot de passe modifié !</div>
              <div style={{ fontSize: 13, color: C.textLight, marginBottom: 20 }}>Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.</div>
              <button onClick={() => { setResetMode(false); setResetDone(false); }} className="iz-btn-pink" style={{ ...sBtn("pink"), width: "100%" }}>Se connecter</button>
            </div>
          ) : (
            <form onSubmit={async (e) => {
              e.preventDefault();
              if (resetPassword.length < 8) return;
              if (resetPassword !== resetConfirm) return;
              setResetLoading(true);
              try {
                await apiFetch('/reset-password', { method: 'POST', body: JSON.stringify({ email: resetEmail, token: resetToken, password: resetPassword, password_confirmation: resetConfirm }) });
                setResetDone(true);
              } catch { setResetDone(false); }
              finally { setResetLoading(false); }
            }}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Nouveau mot de passe</label>
                <input type="password" value={resetPassword} onChange={e => setResetPassword(e.target.value)} placeholder="Minimum 8 caractères" required minLength={8}
                  style={{ ...sInput, background: C.bg }} />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Confirmer le mot de passe</label>
                <input type="password" value={resetConfirm} onChange={e => setResetConfirm(e.target.value)} placeholder="Répétez le mot de passe" required
                  style={{ ...sInput, background: C.bg }} />
                {resetConfirm && resetPassword !== resetConfirm && <div style={{ fontSize: 11, color: C.red, marginTop: 4 }}>Les mots de passe ne correspondent pas</div>}
              </div>
              <button type="submit" disabled={resetLoading || resetPassword.length < 8 || resetPassword !== resetConfirm}
                className="iz-btn-pink" style={{ ...sBtn("pink"), width: "100%", padding: "12px 0", fontSize: 15, opacity: resetLoading ? 0.6 : 1 }}>
                {resetLoading ? "Enregistrement..." : "Enregistrer le mot de passe"}
              </button>
              <div style={{ textAlign: "center", marginTop: 12 }}>
                <button type="button" onClick={() => setResetMode(false)} style={{ background: "none", border: "none", color: C.pink, fontSize: 13, cursor: "pointer", fontFamily: font }}>Retour à la connexion</button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  }

  // ─── 2FA Verification screen ─────────────────────────────────
  if (auth.twoFactorPending) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: font, background: `linear-gradient(135deg, ${C.dark} 0%, #2D1B3D 50%, ${C.pink} 100%)` }}>
        <style dangerouslySetInnerHTML={{ __html: ANIM_STYLES }} />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;1,9..40,400&display=swap" rel="stylesheet" />
        <div className="iz-scale-in" style={{ width: 400, background: C.white, borderRadius: 16, padding: "40px 40px 36px", boxShadow: "0 20px 60px rgba(0,0,0,.3)" }}>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{ marginBottom: 8 }}><img src={getLogoFullUri()} alt="Illizeo" style={{ height: 48, objectFit: "contain", display: "block", margin: "0 auto" }} /></div>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: C.pinkBg, display: "flex", alignItems: "center", justifyContent: "center", margin: "16px auto" }}><ShieldCheck size={28} color={C.pink} /></div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: C.dark, margin: 0 }}>Vérification 2FA</h1>
            <p style={{ fontSize: 13, color: C.textLight, marginTop: 4 }}>Entrez le code de votre application d'authentification</p>
          </div>
          <form onSubmit={async (e) => {
            e.preventDefault();
            try { await auth.verifyTwoFactor(twoFactorCode); } catch { setTwoFactorCode(""); }
          }}>
            <div style={{ marginBottom: 20 }}>
              <input type="text" inputMode="numeric" pattern="[0-9]*" maxLength={6} value={twoFactorCode} onChange={e => setTwoFactorCode(e.target.value.replace(/\D/g, ""))}
                placeholder="000000" autoFocus
                style={{ ...sInput, textAlign: "center", fontSize: 28, fontWeight: 700, letterSpacing: 12, padding: "16px", background: C.bg }} />
            </div>
            {auth.error && <div style={{ fontSize: 12, color: C.red, textAlign: "center", marginBottom: 12 }}>{auth.error}</div>}
            <button type="submit" disabled={twoFactorCode.length !== 6} className="iz-btn-pink" style={{ ...sBtn("pink"), width: "100%", padding: "12px 0", fontSize: 15, opacity: twoFactorCode.length !== 6 ? 0.5 : 1 }}>
              Vérifier
            </button>
            <div style={{ textAlign: "center", marginTop: 16 }}>
              <p style={{ fontSize: 11, color: C.textMuted, marginBottom: 8 }}>Vous pouvez aussi utiliser un code de récupération</p>
              <button type="button" onClick={() => { const tid = localStorage.getItem("illizeo_tenant_id"); auth.logout().catch(() => {}).finally(() => { window.location.href = tid ? `${window.location.pathname}?tenant=${tid}` : window.location.pathname; }); }} style={{ background: "none", border: "none", color: C.pink, fontSize: 13, cursor: "pointer", fontFamily: font }}>Retour à la connexion</button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // ─── Pricing page ───────────────────────────────────────────
  if (showPricing) {
    if (plans.length === 0) getPlans().then(setPlans).catch(() => {});
    const ALL_MODULES = ["onboarding", "offboarding", "crossboarding", "cooptation", "nps", "signature", "sso", "provisioning", "api", "white_label", "gamification"];
    const MODULE_LABELS: Record<string, string> = { onboarding: "Onboarding", offboarding: "Offboarding", crossboarding: "Crossboarding", cooptation: "Cooptation", nps: "NPS & Satisfaction", signature: "Signature électronique", sso: "SSO Microsoft", provisioning: "Provisionnement AD", api: "API", white_label: "White-label", gamification: "Gamification" };
    return (
      <div style={{ minHeight: "100vh", fontFamily: font, background: C.white }}>
        <style dangerouslySetInnerHTML={{ __html: ANIM_STYLES }} />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;1,9..40,400&display=swap" rel="stylesheet" />
        {/* Header */}
        <div style={{ padding: "20px 40px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${C.border}` }}>
          <div style={{ color: C.pink }}><IllizeoLogoFull height={28} /></div>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ display: "flex", gap: 2, padding: 2, background: C.bg, borderRadius: 8 }}>
              {(["monthly", "yearly"] as const).map(b => (
                <button key={b} onClick={() => setPricingBilling(b)} style={{ padding: "6px 16px", borderRadius: 6, fontSize: 12, fontWeight: pricingBilling === b ? 600 : 400, border: "none", cursor: "pointer", fontFamily: font, background: pricingBilling === b ? C.white : "transparent", color: pricingBilling === b ? C.text : C.textMuted, boxShadow: pricingBilling === b ? "0 1px 3px rgba(0,0,0,.1)" : "none", display: "flex", alignItems: "center", gap: 4 }}>
                  {b === "monthly" ? "Mensuel" : "Annuel"}
                  {b === "yearly" && <span style={{ fontSize: 9, padding: "1px 6px", borderRadius: 4, background: C.greenLight, color: C.green, fontWeight: 700 }}>-10%</span>}
                </button>
              ))}
            </div>
            <button onClick={() => setShowPricing(false)} className="iz-btn-outline" style={{ ...sBtn("outline"), fontSize: 13, padding: "8px 20px" }}>{t('misc.return')}</button>
          </div>
        </div>
        {/* Hero */}
        <div style={{ textAlign: "center", padding: "48px 40px 32px" }}>
          <h1 style={{ fontSize: 36, fontWeight: 800, color: C.dark, margin: "0 0 12px" }}>Des tarifs simples et transparents</h1>
          <p style={{ fontSize: 16, color: C.textLight, maxWidth: 600, margin: "0 auto" }}>Une seule plateforme pour l'onboarding, l'offboarding, le crossboarding, la cooptation et la satisfaction.</p>
        </div>
        {/* Plans grid */}
        <div style={{ display: "flex", gap: 24, justifyContent: "center", padding: "0 40px 48px", flexWrap: "wrap" }}>
          {plans.sort((a, b) => a.ordre - b.ordre).map(plan => {
            const monthlyPrice = Number(plan.prix_chf_mensuel);
            const price = pricingBilling === "yearly" ? Math.round(monthlyPrice * 0.9 * 10) / 10 : monthlyPrice;
            const minMensuel = Number(plan.min_mensuel_chf);
            const cur = "CHF";
            const planModules = plan.modules?.map(m => m.module) || [];
            return (
            <div key={plan.id} className="iz-card" style={{ width: 340, borderRadius: 16, border: plan.populaire ? `2px solid ${C.pink}` : `1px solid ${C.border}`, padding: 0, overflow: "hidden", position: "relative", boxShadow: plan.populaire ? "0 8px 30px rgba(194,24,91,.15)" : "0 2px 12px rgba(0,0,0,.04)" }}>
              {plan.populaire && <div style={{ background: C.pink, color: C.white, textAlign: "center", padding: "4px 0", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>Le plus populaire</div>}
              <div style={{ padding: "28px 28px 0" }}>
                <h3 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 4px", color: C.dark }}>{plan.nom}</h3>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 4 }}>
                  <span style={{ fontSize: 40, fontWeight: 800, color: C.dark }}>{price}</span>
                  <span style={{ fontSize: 14, color: C.textMuted }}>{cur}/emp/mois</span>
                </div>
                <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 4 }}>Min. {minMensuel} {cur}/mois · {plan.max_collaborateurs ? `jusqu'à ${plan.max_collaborateurs} collaborateurs` : "Illimité"}</div>
                {pricingBilling === "yearly" && <div style={{ fontSize: 11, color: C.green, fontWeight: 600, marginBottom: 16 }}>Économisez 10% — facturé annuellement ({Math.round(price * 25 * 12)} CHF/an pour 25 emp.)</div>}
                {pricingBilling === "monthly" && <div style={{ marginBottom: 16 }} />}
                {plan.slug === "enterprise" ? (
                  <button onClick={() => window.open("mailto:contact@illizeo.com?subject=Demande Enterprise", "_blank")} className="iz-btn-pink" style={{ ...sBtn("dark"), width: "100%", padding: "12px 0", fontSize: 14 }}>Nous contacter</button>
                ) : (
                  <button onClick={() => {
                    const isSelected = selectedPlanIds.includes(plan.id);
                    if (isSelected) setSelectedPlanIds(prev => prev.filter(id => id !== plan.id));
                    else {
                      // Onboarding plans are exclusive, cooptation is additive
                      const isCoopt = plan.slug === "cooptation";
                      if (isCoopt) setSelectedPlanIds(prev => [...prev, plan.id]);
                      else setSelectedPlanIds(prev => [...prev.filter(id => plans.find(p => p.id === id)?.slug === "cooptation"), plan.id]);
                    }
                  }} style={{
                    width: "100%", padding: "12px 0", fontSize: 14, borderRadius: 8, border: selectedPlanIds.includes(plan.id) ? `2px solid ${C.green}` : `2px solid ${C.pink}`,
                    background: selectedPlanIds.includes(plan.id) ? C.greenLight : C.pink, color: selectedPlanIds.includes(plan.id) ? C.green : C.white,
                    fontWeight: 600, cursor: "pointer", fontFamily: font, transition: "all .15s", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  }}>
                    {selectedPlanIds.includes(plan.id) ? <><CheckCircle size={16} /> Sélectionné</> : "Sélectionner"}
                  </button>
                )}
              </div>
              <div style={{ padding: "20px 28px 28px" }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: C.text, marginBottom: 10 }}>Limites</div>
                <div style={{ fontSize: 12, color: C.textLight, display: "flex", flexDirection: "column", gap: 4, marginBottom: 16 }}>
                  <span>{plan.max_admins ? `${plan.max_admins} admins` : "Admins illimités"}</span>
                  <span>{plan.max_parcours ? `${plan.max_parcours} parcours` : "Parcours illimités"}</span>
                  <span>{plan.max_integrations ? `${plan.max_integrations} intégrations` : "Toutes les intégrations"}</span>
                  <span>{plan.max_workflows ? `${plan.max_workflows} workflows` : "Workflows illimités"}</span>
                </div>
                <div style={{ fontSize: 12, fontWeight: 600, color: C.text, marginBottom: 10 }}>Modules inclus</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {ALL_MODULES.map(mod => {
                    const included = planModules.includes(mod);
                    return (
                    <div key={mod} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: included ? C.text : C.textMuted }}>
                      {included ? <CheckCircle size={14} color={C.green} /> : <XCircle size={14} color={C.border} />}
                      <span style={{ textDecoration: included ? "none" : "line-through" }}>{MODULE_LABELS[mod] || mod}</span>
                    </div>
                    );
                  })}
                </div>
              </div>
            </div>
            );
          })}
        </div>

        {/* Floating bottom bar when plans selected */}
        {selectedPlanIds.length > 0 && (
          <div className="iz-fade-up" style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: C.white, borderTop: `2px solid ${C.pink}`, padding: "16px 40px", display: "flex", alignItems: "center", justifyContent: "center", gap: 20, boxShadow: "0 -4px 20px rgba(0,0,0,.1)", zIndex: 100 }}>
            <div style={{ fontSize: 14, color: C.text }}>
              <b>{selectedPlanIds.length} plan{selectedPlanIds.length > 1 ? "s" : ""} sélectionné{selectedPlanIds.length > 1 ? "s" : ""}</b>
              <span style={{ color: C.textMuted, marginLeft: 8 }}>
                {selectedPlanIds.map(id => plans.find(p => p.id === id)?.nom).filter(Boolean).join(" + ")}
              </span>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => { setPricingBilling("monthly"); }} style={{ padding: "6px 14px", borderRadius: 6, fontSize: 12, fontWeight: pricingBilling === "monthly" ? 600 : 400, border: `1px solid ${C.border}`, background: pricingBilling === "monthly" ? C.pink : C.white, color: pricingBilling === "monthly" ? C.white : C.text, cursor: "pointer", fontFamily: font }}>Mensuel</button>
              <button onClick={() => { setPricingBilling("yearly"); }} style={{ padding: "6px 14px", borderRadius: 6, fontSize: 12, fontWeight: pricingBilling === "yearly" ? 600 : 400, border: `1px solid ${C.border}`, background: pricingBilling === "yearly" ? C.pink : C.white, color: pricingBilling === "yearly" ? C.white : C.text, cursor: "pointer", fontFamily: font, display: "flex", alignItems: "center", gap: 4 }}>Annuel <span style={{ fontSize: 9, padding: "1px 4px", borderRadius: 3, background: C.greenLight, color: C.green, fontWeight: 700 }}>-10%</span></button>
            </div>
            <button onClick={() => { setShowPricing(false); setShowRegister(true); }} className="iz-btn-pink" style={{ ...sBtn("pink"), padding: "12px 32px", fontSize: 15 }}>
              Créer mon espace — Essai gratuit 14 jours
            </button>
          </div>
        )}
      </div>
    );
  }

  // ─── Tenant selection page ───────────────────────────────────
  if (!auth.isAuthenticated && !tenantResolved && !showRegister) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: font, background: `linear-gradient(135deg, ${C.dark} 0%, #2D1B3D 50%, ${C.pink} 100%)` }}>
        <style dangerouslySetInnerHTML={{ __html: ANIM_STYLES }} />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;1,9..40,400&display=swap" rel="stylesheet" />
        <div className="iz-scale-in" style={{ width: 440, background: C.white, borderRadius: 16, padding: "40px 40px 36px", boxShadow: "0 20px 60px rgba(0,0,0,.3)" }}>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{ marginBottom: 8 }}><img src={getLogoFullUri()} alt="Illizeo" style={{ height: 48, objectFit: "contain", display: "block", margin: "0 auto" }} /></div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: C.dark, margin: 0 }}>Bienvenue</h1>
            <p style={{ fontSize: 13, color: C.textLight, marginTop: 4 }}>Entrez le nom de votre espace pour continuer</p>
          </div>
          <form onSubmit={async e => {
            e.preventDefault();
            const slug = tenantInput.toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-|-$/g, "");
            if (!slug) return;
            setTenantError("");
            setTenantChecking(true);
            try {
              const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8001/api/v1";
              const res = await fetch(`${baseUrl}/tenant-check`, { headers: { "X-Tenant": slug, "Accept": "application/json" } });
              if (!res.ok) throw new Error();
              const data = await res.json();
              if (data.status === "ok") {
                localStorage.setItem("illizeo_tenant_id", slug);
                setTenantResolved(true);
              } else { throw new Error(); }
            } catch {
              setTenantError(`L'espace "${slug}" n'existe pas. Vérifiez le nom ou créez un nouvel espace.`);
            } finally { setTenantChecking(false); }
          }}>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Votre espace</label>
              <div style={{ display: "flex", alignItems: "center", borderRadius: 8, border: `1px solid ${C.border}`, overflow: "hidden", background: C.bg }}>
                <input value={tenantInput} onChange={e => { setTenantInput(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "")); setTenantError(""); }} placeholder="mon-entreprise" required
                  style={{ flex: 1, padding: "12px 14px", border: "none", outline: "none", background: "transparent", fontSize: 15, fontFamily: font, color: C.text, fontWeight: 600 }} />
                <span style={{ padding: "12px 14px", fontSize: 13, color: C.textMuted, background: C.white, borderLeft: `1px solid ${C.border}`, whiteSpace: "nowrap" }}>.illizeo.com</span>
              </div>
              {tenantInput && !tenantError && <div style={{ fontSize: 11, color: C.textMuted, marginTop: 6 }}>Vous serez connecté à <span style={{ fontWeight: 600, color: C.pink }}>{tenantInput}.illizeo.com</span></div>}
              {tenantError && <div style={{ fontSize: 12, color: C.red, marginTop: 8, padding: "8px 12px", background: C.redLight, borderRadius: 8 }}>{tenantError}</div>}
            </div>
            <button type="submit" disabled={!tenantInput.trim() || tenantChecking} className="iz-btn-pink" style={{ ...sBtn("pink"), width: "100%", padding: "12px 0", fontSize: 15, opacity: !tenantInput.trim() || tenantChecking ? 0.5 : 1 }}>
              {tenantChecking ? "Vérification..." : "Continuer"}
            </button>
          </form>
          <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0" }}>
            <div style={{ flex: 1, height: 1, background: C.border }} />
            <span style={{ fontSize: 11, color: C.textMuted }}>{t('login.or')}</span>
            <div style={{ flex: 1, height: 1, background: C.border }} />
          </div>
          <button onClick={() => setShowRegister(true)} style={{ width: "100%", padding: "11px 0", borderRadius: 8, border: `1px solid ${C.border}`, background: C.white, cursor: "pointer", fontFamily: font, fontSize: 14, fontWeight: 500, color: C.text, transition: "all .15s" }}
            onMouseEnter={e => (e.currentTarget.style.background = C.bg)} onMouseLeave={e => (e.currentTarget.style.background = C.white)}>
            Créer un nouvel espace
          </button>
          <div style={{ textAlign: "center", marginTop: 12 }}>
            <button onClick={() => setShowPricing(true)} style={{ background: "none", border: "none", color: C.pink, fontSize: 13, cursor: "pointer", fontFamily: font, fontWeight: 500 }}>Voir les tarifs</button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Tenant registration page ────────────────────────────────
  if (!auth.isAuthenticated && showRegister) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: font, background: `linear-gradient(135deg, ${C.dark} 0%, #2D1B3D 50%, ${C.pink} 100%)` }}>
        <style dangerouslySetInnerHTML={{ __html: ANIM_STYLES }} />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;1,9..40,400&display=swap" rel="stylesheet" />
        <div className="iz-scale-in" style={{ width: 480, background: C.white, borderRadius: 16, padding: "36px 40px", boxShadow: "0 20px 60px rgba(0,0,0,.3)" }}>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <div style={{ marginBottom: 8 }}><img src={getLogoFullUri()} alt="Illizeo" style={{ height: 44, objectFit: "contain", display: "block", margin: "0 auto" }} /></div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: C.dark, margin: 0 }}>Créer votre espace</h1>
            <p style={{ fontSize: 13, color: C.textLight, marginTop: 4 }}>Lancez votre plateforme d'onboarding en quelques secondes</p>
          </div>
          <form onSubmit={async (e) => {
            e.preventDefault();
            setRegLoading(true);
            try {
              const res = await registerTenant({ ...regData, admin_name: `${regData.admin_prenom} ${regData.admin_nom}`.trim() });
              // Store tenant ID, mark trial start, skip to subscription page
              localStorage.setItem("illizeo_tenant_id", res.tenant_id);
              localStorage.setItem("illizeo_trial_start", new Date().toISOString());
              localStorage.setItem("illizeo_needs_plan", "true");
              // Navigate with tenant param to skip tenant selection
              window.location.href = `${window.location.pathname}?tenant=${res.tenant_id}`;
            } catch (err: any) {
              let msg = "Erreur lors de la création";
              try { const parsed = JSON.parse(err?.message || ""); msg = parsed?.message || msg; } catch {}
              addToast_admin(msg);
            } finally { setRegLoading(false); }
          }}>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Nom de l'entreprise *</label>
              <input value={regData.company_name} onChange={e => {
                const v = e.target.value;
                setRegData(p => ({ ...p, company_name: v }));
                // Check slug availability with debounce
                const slug = v.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
                setRegTenantSlug(slug);
              }} placeholder="Ex: Acme Corp" required style={sInput} />
              {regTenantSlug && <div style={{ fontSize: 11, color: C.textMuted, marginTop: 4 }}>Votre espace : <span style={{ fontWeight: 600, color: C.pink }}>{regTenantSlug}</span>.illizeo.com</div>}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Prénom *</label>
                <input value={regData.admin_prenom} onChange={e => setRegData(p => ({ ...p, admin_prenom: e.target.value }))} placeholder="Ex: Jean-Pierre" required style={sInput} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Nom *</label>
                <input value={regData.admin_nom} onChange={e => setRegData(p => ({ ...p, admin_nom: e.target.value }))} placeholder="Ex: De La Fontaine" required style={sInput} />
              </div>
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Email professionnel *</label>
              <input type="email" value={regData.admin_email} onChange={e => setRegData(p => ({ ...p, admin_email: e.target.value }))} placeholder="vous@entreprise.com" required style={sInput} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Mot de passe *</label>
                <input type="password" value={regData.password} onChange={e => setRegData(p => ({ ...p, password: e.target.value }))} placeholder="Min. 8 caractères" required minLength={8} style={sInput} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Confirmer *</label>
                <input type="password" value={regData.password_confirmation} onChange={e => setRegData(p => ({ ...p, password_confirmation: e.target.value }))} placeholder="Répéter" required style={sInput} />
                {regData.password_confirmation && regData.password !== regData.password_confirmation && <div style={{ fontSize: 10, color: C.red, marginTop: 2 }}>Non identiques</div>}
              </div>
            </div>
            <button type="submit" disabled={regLoading || !regData.company_name || !regData.admin_prenom || !regData.admin_nom || !regData.admin_email || regData.password.length < 8 || regData.password !== regData.password_confirmation}
              className="iz-btn-pink" style={{ ...sBtn("pink"), width: "100%", padding: "12px 0", fontSize: 15, opacity: regLoading ? 0.6 : 1 }}>
              {regLoading ? "Création en cours..." : "Créer mon espace Illizeo"}
            </button>
            <div style={{ textAlign: "center", marginTop: 16, fontSize: 13 }}>
              <span style={{ color: C.textMuted }}>Déjà un compte ? </span>
              <button type="button" onClick={() => setShowRegister(false)} style={{ background: "none", border: "none", color: C.pink, fontWeight: 600, cursor: "pointer", fontFamily: font, fontSize: 13 }}>Se connecter</button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  if (!auth.isAuthenticated) {
    const loginBg = loginBgImage
      ? `url(${loginBgImage}) center/cover no-repeat`
      : `linear-gradient(135deg, ${C.dark} 0%, #2D1B3D 50%, ${C.pink} 100%)`;
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: font, background: loginBg }}>
        <style dangerouslySetInnerHTML={{ __html: ANIM_STYLES }} />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;1,9..40,400&display=swap" rel="stylesheet" />
        <div className="iz-scale-in" style={{ width: 400, background: C.white, borderRadius: 16, padding: "40px 40px 36px", boxShadow: "0 20px 60px rgba(0,0,0,.3)" }}>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{ marginBottom: 8 }}><img src={getLogoFullUri()} alt="Illizeo" style={{ height: 48, objectFit: "contain", display: "block", margin: "0 auto" }} /></div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: C.dark, margin: 0 }}>{t('login.title')}</h1>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 6 }}>
              <span style={{ fontSize: 12, color: C.textMuted }}>{t('login.space')}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: C.pink }}>{localStorage.getItem("illizeo_tenant_id") || "illizeo"}.illizeo.com</span>
              <button onClick={() => { localStorage.removeItem("illizeo_tenant_id"); setTenantResolved(false); }} style={{ background: "none", border: "none", color: C.textMuted, fontSize: 11, cursor: "pointer", fontFamily: font, textDecoration: "underline" }}>{t('login.change')}</button>
            </div>
          </div>
          {auth.error && (
            <div className="iz-fade-up" style={{ padding: "10px 14px", borderRadius: 8, background: C.redLight, color: C.red, fontSize: 13, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
              <AlertTriangle size={14} /> {auth.error}
            </div>
          )}
          <form onSubmit={async (e) => {
            e.preventDefault();
            setLoginLoading(true);
            try {
              await auth.login(loginEmail, loginPassword);
              // Ensure tenant ID is saved for logout redirect
              const currentTid = new URLSearchParams(window.location.search).get("tenant") || localStorage.getItem("illizeo_tenant_id");
              if (currentTid) localStorage.setItem("illizeo_tenant_id", currentTid);
            } catch {} finally { setLoginLoading(false); }
          }}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Email</label>
              <input type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} placeholder="votre@email.com" required
                style={{ ...sInput, background: C.bg }} />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Mot de passe</label>
              <input type="password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} placeholder="••••••••" required
                style={{ ...sInput, background: C.bg }} />
            </div>
            <button type="submit" disabled={loginLoading} className="iz-btn-pink"
              style={{ ...sBtn("pink"), width: "100%", padding: "12px 0", fontSize: 15, opacity: loginLoading ? 0.7 : 1 }}>
              {loginLoading ? "Connexion..." : "Se connecter"}
            </button>
          </form>
          {/* SSO Microsoft */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "16px 0" }}>
            <div style={{ flex: 1, height: 1, background: C.border }} />
            <span style={{ fontSize: 11, color: C.textMuted }}>{t('login.or')}</span>
            <div style={{ flex: 1, height: 1, background: C.border }} />
          </div>
          <button onClick={async () => {
            try {
              addToast_admin("Redirection vers Microsoft...");
              const res = await apiFetch<{ redirect_url: string }>('/auth/microsoft/redirect');
              if (res.redirect_url) {
                window.location.href = res.redirect_url;
              } else {
                addToast_admin("SSO non configuré");
              }
            } catch (err: any) {
              console.error("SSO error:", err);
              addToast_admin("Erreur SSO : " + (err?.message || "connexion impossible"));
              setLoginLoading(false);
            }
          }} style={{ width: "100%", padding: "11px 0", borderRadius: 8, border: `1px solid ${C.border}`, background: C.white, cursor: "pointer", fontFamily: font, fontSize: 14, fontWeight: 500, color: C.text, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, transition: "all .15s" }}
            onMouseEnter={e => (e.currentTarget.style.background = C.bg)} onMouseLeave={e => (e.currentTarget.style.background = C.white)}>
            <Globe size={18} color="#0078D4" /> {t('login.sso_microsoft')}
          </button>
          <div style={{ textAlign: "center", marginTop: 12 }}>
            <button onClick={() => { setForgotMode(true); setForgotEmail(loginEmail); setForgotSent(false); }} style={{ background: "none", border: "none", color: C.pink, fontSize: 13, cursor: "pointer", fontFamily: font, fontWeight: 500 }}>Mot de passe oublié ?</button>
          </div>
          {forgotMode && (
            <div style={{ marginTop: 16, padding: "16px", background: C.bg, borderRadius: 10 }}>
              {forgotSent ? (
                <div style={{ textAlign: "center" }}>
                  <CheckCircle size={24} color={C.green} style={{ marginBottom: 8 }} />
                  <div style={{ fontSize: 14, fontWeight: 600, color: C.green, marginBottom: 4 }}>Email envoyé !</div>
                  <div style={{ fontSize: 12, color: C.textLight }}>Vérifiez votre boîte de réception pour réinitialiser votre mot de passe.</div>
                  <button onClick={() => setForgotMode(false)} style={{ ...sBtn("outline"), fontSize: 12, padding: "6px 16px", marginTop: 12 }}>Retour à la connexion</button>
                </div>
              ) : (
                <>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 8 }}>Réinitialiser le mot de passe</div>
                  <div style={{ fontSize: 12, color: C.textLight, marginBottom: 12 }}>Entrez votre email, vous recevrez un lien de réinitialisation.</div>
                  <input type="email" value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} placeholder="votre@email.com" style={{ ...sInput, marginBottom: 10 }} />
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => setForgotMode(false)} style={{ ...sBtn("outline"), fontSize: 12, flex: 1 }}>{t('common.cancel')}</button>
                    <button disabled={forgotLoading || !forgotEmail.trim()} onClick={async () => {
                      setForgotLoading(true);
                      try {
                        await apiFetch('/forgot-password', { method: 'POST', body: JSON.stringify({ email: forgotEmail }) });
                        setForgotSent(true);
                      } catch { setForgotSent(true); /* Don't reveal if email exists */ }
                      finally { setForgotLoading(false); }
                    }} className="iz-btn-pink" style={{ ...sBtn("pink"), fontSize: 12, flex: 1, opacity: forgotLoading ? 0.6 : 1 }}>
                      {forgotLoading ? "Envoi..." : "Envoyer"}
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
          <div style={{ textAlign: "center", marginTop: 20, fontSize: 13 }}>
            <span style={{ color: C.textMuted }}>{t('login.no_account')} </span>
            <button onClick={() => setShowRegister(true)} style={{ background: "none", border: "none", color: C.pink, fontWeight: 600, cursor: "pointer", fontFamily: font, fontSize: 13 }}>{t('login.create_space')}</button>
          </div>
        </div>
      </div>
    );
  }

  // ─── EMAIL INVITATION ────────────────────────────────────
  if (step === "email") {
    return (
      <div style={{ minHeight: "100vh", background: "#E8E4DF", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: font }}>
        {/* Email client frame */}
        <div style={{ width: "100%", maxWidth: 720, margin: "24px" }}>
          {/* Email client header bar */}
          <div style={{ background: "#fff", borderRadius: "12px 12px 0 0", padding: "14px 20px", display: "flex", alignItems: "center", gap: 12, borderBottom: `1px solid ${C.border}` }}>
            <div style={{ display: "flex", gap: 6 }}>
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#FF5F57" }} />
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#FFBD2E" }} />
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#28CA41" }} />
            </div>
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ padding: "4px 16px", background: C.bg, borderRadius: 6, fontSize: 12, color: C.textLight }}>
                <Mail size={12} style={{ display: "inline", verticalAlign: "middle", marginRight: 6 }} />
                Boîte de réception — nadia.ferreira@gmail.com
              </div>
            </div>
          </div>
          {/* Email metadata */}
          <div style={{ background: "#fff", padding: "16px 24px", borderBottom: `1px solid ${C.border}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, #C2185B, #E91E8C)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <IllizeoLogo size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>Illizeo Onboard <span style={{ fontWeight: 400, color: C.textLight }}>{"<"}noreply@illizeo.com{">"}</span></div>
                <div style={{ fontSize: 12, color: C.textMuted }}>à moi</div>
              </div>
              <div style={{ fontSize: 12, color: C.textMuted }}>27 mars 2026, 09:15</div>
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, color: C.text }}>Bienvenue chez Illizeo — Votre espace d'intégration est prêt</div>
          </div>
          {/* Email body */}
          <div style={{ background: C.white, padding: "40px 40px 32px", textAlign: "center" }}>
            <div style={{ marginBottom: 20 }}><IllizeoLogo size={56} /></div>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: C.text, marginBottom: 24 }}>Bienvenue Nadia</h2>
            <p style={{ fontSize: 15, lineHeight: 1.7, color: C.text, marginBottom: 16 }}>
              C'est avec une immense joie que nous t'accueillons chez Illizeo !
            </p>
            <p style={{ fontSize: 15, lineHeight: 1.7, color: C.text, marginBottom: 16 }}>
              Nous te remercions pour ta confiance et sommes impatients de t'accueillir dans cette belle aventure le <strong>01/06/2026</strong>.
            </p>
            <p style={{ fontSize: 15, lineHeight: 1.7, color: C.text, marginBottom: 16 }}>
              Nous t'invitons à te connecter dès à présent à <strong>Illizeo Onboard</strong> pour que nous puissions préparer ensemble et au mieux ton arrivée.
            </p>
            <p style={{ fontSize: 15, color: C.text, marginBottom: 32 }}>
              N'hésite pas à nous contacter si tu as des questions.<br /><br />À bientôt,
            </p>
            <button className="iz-btn-pink iz-glow" onClick={() => setStep("welcome_banner")} style={{ ...sBtn("pink"), padding: "14px 48px", borderRadius: 28, fontSize: 16 }}>
              C'est parti
            </button>
            <div style={{ marginTop: 24, fontSize: 12, color: C.textMuted }}>
              Illizeo Onboard, Support Functions
            </div>
          </div>
          {/* Email client footer */}
          <div style={{ background: "#fff", borderRadius: "0 0 12px 12px", padding: "12px 24px", borderTop: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 16, fontSize: 12, color: C.textMuted }}>
            <ArrowRight size={14} /> Répondre
            <span style={{ marginLeft: "auto" }}>Cet email a été envoyé automatiquement par Illizeo Onboard</span>
          </div>
        </div>
      </div>
    );
  }

  // ─── STEP 1: WELCOME (Banner + Video combined) ─────────────
  if (showPreboard && role !== "rh" && step === "welcome_banner") {
    return (
      <div style={{ minHeight: "100vh", fontFamily: font, display: "flex" }}>
        <PreboardSidebar />
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {/* Hero banner — full width */}
          <div className="iz-fade-in" style={{ height: 280, background: "linear-gradient(135deg, #2D1B3D 0%, #4A1942 30%, #C2185B 70%, #E91E8C 100%)", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", position: "relative", flexShrink: 0 }}>
            <div style={{ position: "absolute", top: 20, left: 24 }}><IllizeoLogo size={36} /></div>
            <h1 className="iz-fade-up" style={{ fontSize: 32, fontWeight: 700, color: C.white, textShadow: "0 2px 12px rgba(0,0,0,.2)", textAlign: "center", lineHeight: 1.3 }}>
              Bonjour Nadia !<br /><span style={{ fontWeight: 400, fontSize: 20, opacity: .9 }}>Bienvenue au sein de nos équipes Illizeo</span>
            </h1>
          </div>
          {/* Content */}
          <div style={{ flex: 1, padding: "32px 48px", maxWidth: 700, margin: "0 auto", width: "100%" }}>
            {/* Video section */}
            <div className="iz-fade-up iz-stagger-1" style={{ marginBottom: 32 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: C.pinkBg, display: "flex", alignItems: "center", justifyContent: "center" }}><Play size={16} color={C.pink} /></div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: C.text }}>Mot de bienvenue du Président</div>
                  <div style={{ fontSize: 12, color: C.textLight }}>1 min 21 · Découvre notre vision et nos valeurs</div>
                </div>
              </div>
              <div style={{ width: "100%", height: 300, background: "#1a1a2e", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", cursor: "pointer" }}>
                <div className="iz-glow" style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(255,255,255,.15)", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }}>
                  <Play size={28} color={C.white} fill={C.white} />
                </div>
                <div style={{ position: "absolute", bottom: 12, left: 16, color: C.white, fontSize: 12, opacity: .7 }}>0:00 / 1:21</div>
              </div>
            </div>
            {/* CTA */}
            <div className="iz-fade-up iz-stagger-2" style={{ display: "flex", justifyContent: "center" }}>
              <button onClick={() => setStep("create_account")} className="iz-btn-pink" style={{ ...sBtn("pink"), padding: "14px 64px", fontSize: 16, borderRadius: 12 }}>
                Commencer mon intégration
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── STEP 2: Setup (Account + Info + Photo in one stepper) ──
  if (showPreboard && role !== "rh" && (step === "create_account" || step === "collect_info" || step === "photo_profile")) {
    const setupSteps = [
      { id: "create_account", label: "Compte", icon: ShieldCheck },
      { id: "collect_info", label: "Informations", icon: UserCheck },
      { id: "photo_profile", label: "Photo", icon: Users },
    ] as const;
    const currentIdx = setupSteps.findIndex(s => s.id === step);

    return (
      <div style={{ minHeight: "100vh", fontFamily: font, display: "flex" }}>
        <PreboardSidebar />
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {/* Progress bar */}
          <div style={{ height: 4, background: C.border }}>
            <div style={{ height: "100%", width: `${((currentIdx + 1) / setupSteps.length) * 100}%`, background: `linear-gradient(90deg, ${C.pink}, ${C.pinkSoft})`, transition: "width .4s ease", borderRadius: 2 }} />
          </div>
          {/* Stepper pills */}
          <div style={{ padding: "20px 48px", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, borderBottom: `1px solid ${C.border}` }}>
            {setupSteps.map((s, i) => {
              const done = i < currentIdx;
              const active = i === currentIdx;
              return (
                <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {i > 0 && <div style={{ width: 32, height: 2, background: done ? C.pink : C.border, borderRadius: 1 }} />}
                  <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 20, background: active ? C.pinkBg : done ? C.greenLight : C.bg, border: `1px solid ${active ? C.pink : done ? C.green : C.border}`, transition: "all .3s" }}>
                    {done ? <CheckCircle size={14} color={C.green} /> : <s.icon size={14} color={active ? C.pink : C.textMuted} />}
                    <span style={{ fontSize: 12, fontWeight: active ? 600 : 400, color: active ? C.pink : done ? C.green : C.textLight }}>{s.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
          {/* Content area */}
          <div style={{ flex: 1, padding: "32px 48px", maxWidth: 640, margin: "0 auto", width: "100%", overflow: "auto" }}>
            {/* STEP: Account */}
            {step === "create_account" && (
              <div className="iz-fade-up">
                <h2 style={{ fontSize: 24, fontWeight: 700, color: C.text, marginBottom: 8 }}>Crée ton compte</h2>
                <p style={{ fontSize: 14, color: C.textLight, marginBottom: 28 }}>Ton identifiant a été pré-configuré. Choisis un mot de passe sécurisé pour accéder à ton espace.</p>
                <div style={{ marginBottom: 24 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 6 }}>Identifiant</label>
                  <input value={formData.email} readOnly style={{ ...sInput, background: "#f0f0f5" }} />
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 6 }}>Mot de passe * <span style={{ fontWeight: 400, fontSize: 11, color: C.textMuted }}>Min. 8 caractères, 1 chiffre, 1 caractère spécial</span></label>
                  <div style={{ position: "relative" }}>
                    <input type={passwordVisible ? "text" : "password"} value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} style={sInput} placeholder="Choisis ton mot de passe" />
                    <button onClick={() => setPasswordVisible(!passwordVisible)} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: C.textLight }}>{passwordVisible ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                  </div>
                </div>
                <div style={{ marginBottom: 24 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 6 }}>Confirmer le mot de passe *</label>
                  <div style={{ position: "relative" }}>
                    <input type={passwordVisible ? "text" : "password"} value={formData.confirmPassword} onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })} style={sInput} placeholder="Confirme ton mot de passe" />
                    <button onClick={() => setPasswordVisible(!passwordVisible)} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: C.textLight }}>{passwordVisible ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                  </div>
                </div>
                <label style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 32, cursor: "pointer" }}>
                  <input type="checkbox" checked={acceptCGU} onChange={() => setAcceptCGU(!acceptCGU)} style={{ width: 18, height: 18, accentColor: C.pink, marginTop: 2, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: C.text, lineHeight: 1.5 }}>J'accepte les <span style={{ color: C.blue, textDecoration: "underline" }}>Conditions Générales d'utilisation</span> et la <span style={{ color: C.blue, textDecoration: "underline" }}>politique de confidentialité d'Illizeo</span>.</span>
                </label>
              </div>
            )}
            {/* STEP: Info */}
            {step === "collect_info" && (
              <div className="iz-fade-up">
                <h2 style={{ fontSize: 24, fontWeight: 700, color: C.text, marginBottom: 8 }}>Tes informations</h2>
                <p style={{ fontSize: 14, color: C.textLight, marginBottom: 28 }}>Confirme et complète les informations ci-dessous. Les champs grisés sont pré-remplis par ton employeur.</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px 24px" }}>
                  {[
                    { label: "Prénom *", value: formData.prenom, key: "prenom" },
                    { label: "Nom *", value: formData.nom, key: "nom" },
                    { label: "Date de naissance", value: formData.dateNaissance, key: "dateNaissance", placeholder: "JJ/MM/AAAA" },
                    { label: "Genre", value: formData.genre, key: "genre", isSelect: true, options: ["Homme", "Femme", "Non-binaire", "Ne souhaite pas répondre"] },
                    { label: "Nationalité", value: formData.nationalite, key: "nationalite", isSelect: true, options: ["Suisse", "Française", "Autre"] },
                    { label: "Numéro de téléphone", value: "", key: "tel", placeholder: "+41 XX XXX XX XX" },
                    { label: "Métier", value: formData.metier, key: "metier", readonly: true },
                    { label: "Site", value: formData.site, key: "site", readonly: true },
                    { label: "Département", value: formData.departement, key: "departement", readonly: true },
                    { label: "Date de début", value: formData.dateDebut, key: "dateDebut", readonly: true },
                  ].map((f: any) => (
                    <div key={f.key}>
                      <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 4 }}>{f.label}</label>
                      {f.isSelect ? (
                        <select value={f.value} onChange={(e: any) => setFormData({ ...formData, [f.key]: e.target.value })} style={sInput}>
                          <option value="">— Sélectionner —</option>
                          {(f.options || []).map((o: string) => <option key={o}>{o}</option>)}
                        </select>
                      ) : (
                        <input value={f.value} readOnly={f.readonly} onChange={(e: any) => setFormData({ ...formData, [f.key]: e.target.value })} placeholder={f.placeholder} style={{ ...sInput, background: f.readonly ? "#f0f0f5" : C.white, fontSize: 13 }} />
                      )}
                    </div>
                  ))}
                </div>
                {/* Dynamic custom fields */}
                {fieldConfig.filter(f => f.actif && f.section === "personal").length > 0 && (
                  <>
                    <div style={{ fontSize: 13, fontWeight: 600, color: C.pink, margin: "20px 0 12px", borderTop: `1px solid ${C.border}`, paddingTop: 16 }}>Informations complémentaires</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px 24px" }}>
                      {fieldConfig.filter(f => f.actif && (f.section === "personal" || f.section === "contract" || f.section === "org")).map((fc: any) => {
                        const fKey = fc.field_key;
                        const val = (formData as any)[fKey] || "";
                        const fType = fc.field_type || "text";
                        return (
                          <div key={fc.id} style={{ gridColumn: fKey === "adresse" ? "1 / -1" : undefined }}>
                            <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 4 }}>{lang === "en" && fc.label_en ? fc.label_en : fc.label}{fc.obligatoire ? " *" : ""}</label>
                            {fType === "list" && fc.list_values?.length > 0 ? (
                              <select value={val} onChange={(e: any) => setFormData({ ...formData, [fKey]: e.target.value })} style={sInput}>
                                <option value="">— Sélectionner —</option>
                                {fc.list_values.map((v: string) => <option key={v} value={v}>{v}</option>)}
                              </select>
                            ) : fType === "date" ? (
                              <input type="date" value={val} onChange={(e: any) => setFormData({ ...formData, [fKey]: e.target.value })} style={{ ...sInput, fontSize: 13 }} />
                            ) : fType === "boolean" ? (
                              <div onClick={() => setFormData({ ...formData, [fKey]: val === "true" ? "false" : "true" })} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", padding: "8px 0" }}>
                                <div style={{ width: 36, height: 20, borderRadius: 10, background: val === "true" ? C.green : C.border, position: "relative", transition: "all .2s" }}>
                                  <div style={{ width: 16, height: 16, borderRadius: "50%", background: C.white, position: "absolute", top: 2, left: val === "true" ? 18 : 2, transition: "all .2s", boxShadow: "0 1px 2px rgba(0,0,0,.2)" }} />
                                </div>
                                <span style={{ fontSize: 12, color: C.text }}>{val === "true" ? "Oui" : "Non"}</span>
                              </div>
                            ) : (
                              <input value={val} onChange={(e: any) => setFormData({ ...formData, [fKey]: e.target.value })} placeholder={fc.placeholder || ""} style={{ ...sInput, fontSize: 13 }} />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            )}
            {/* STEP: Photo */}
            {step === "photo_profile" && (
              <div className="iz-fade-up">
                <h2 style={{ fontSize: 24, fontWeight: 700, color: C.text, marginBottom: 8 }}>Ta photo de profil</h2>
                <p style={{ fontSize: 14, color: C.textLight, marginBottom: 28 }}>Cette photo sera visible par tes collègues. Tu peux aussi passer cette étape et l'ajouter plus tard.</p>
                <div style={{ display: "flex", alignItems: "center", gap: 32, justifyContent: "center", marginBottom: 32 }}>
                  {/* Avatar preview */}
                  <div style={{ width: 160, height: 160, borderRadius: "50%", background: formData.photoUploaded ? "linear-gradient(135deg, #E91E8C, #C2185B)" : C.bg, display: "flex", alignItems: "center", justifyContent: "center", border: `4px solid ${formData.photoUploaded ? C.pink : C.border}`, transition: "all .3s" }}>
                    {formData.photoUploaded ? (
                      <span style={{ fontSize: 48, fontWeight: 700, color: C.white }}>NF</span>
                    ) : (
                      <Users size={56} color={C.border} />
                    )}
                  </div>
                  {/* Upload zone */}
                  <div>
                    <button onClick={() => setFormData({ ...formData, photoUploaded: true })} className="iz-btn-pink" style={{ ...sBtn("pink"), display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                      <Upload size={16} /> Importer une photo
                    </button>
                    <p style={{ fontSize: 12, color: C.textMuted, maxWidth: 200, lineHeight: 1.5 }}>JPG ou PNG, max 5 Mo. Un cadrage centré sur le visage est recommandé.</p>
                    {formData.photoUploaded && (
                      <div className="iz-fade-up" style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8, color: C.green, fontSize: 13, fontWeight: 600 }}>
                        <CheckCircle size={16} /> Photo importée avec succès
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            {/* Navigation buttons */}
            <div style={{ display: "flex", gap: 12, justifyContent: "center", paddingTop: 16, borderTop: `1px solid ${C.border}`, marginTop: 24 }}>
              {currentIdx > 0 && (
                <button onClick={() => setStep(setupSteps[currentIdx - 1].id)} className="iz-btn-outline" style={sBtn("outline")}>{t('misc.return')}</button>
              )}
              {currentIdx === 0 && (
                <button onClick={() => setStep("welcome_banner")} className="iz-btn-outline" style={sBtn("outline")}>{t('misc.return')}</button>
              )}
              {step === "photo_profile" && !formData.photoUploaded && (
                <button onClick={() => setShowPreboard(false)} className="iz-btn-outline" style={sBtn("outline")}>Passer</button>
              )}
              <button onClick={() => {
                if (currentIdx < setupSteps.length - 1) {
                  setStep(setupSteps[currentIdx + 1].id);
                } else {
                  setShowPreboard(false);
                }
              }} className="iz-btn-pink" style={{ ...sBtn("pink"), padding: "10px 40px" }}>
                {currentIdx === setupSteps.length - 1 ? "Terminer et accéder à mon espace" : "Continuer"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── DASHBOARD (MAIN APP) ────────────────────────────────
  const SIDEBAR_ITEMS = [
    { section: t('sidebar.my_workspace'), items: [
      { id: "tableau_de_bord" as const, label: t('sidebar.dashboard'), icon: LayoutDashboard },
      { id: "mes_actions" as const, label: t('sidebar.my_actions'), icon: Zap, badge: 7 },
      { id: "suivi" as const, label: t('sidebar.my_tracking'), icon: Target },
      { id: "messagerie" as const, label: t('sidebar.messaging'), icon: MessageCircle },
      { id: "notifications" as const, label: t('sidebar.notifications'), icon: Bell, badge: notifUnread > 0 ? notifUnread : undefined },
    ]},
    { section: t('sidebar.illizeo'), items: [
      { id: "entreprise" as const, label: t('sidebar.company'), icon: Building2 },
      { id: "cooptation" as const, label: t('admin.cooptation'), icon: Handshake },
      { id: "satisfaction" as const, label: t('admin.nps'), icon: Star },
    ]},
  ];

  // ─── RENDER SIDEBAR ──────────────────────────────────────
  const renderSidebar = () => (
    <div style={{ width: 240, minHeight: "100vh", background: C.white, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", flexShrink: 0, position: "sticky", top: 0 }}>
      <div style={{ padding: "20px 16px 12px", color: C.pink }}>
        <IllizeoLogoFull height={24} />
      </div>
      {/* Role switcher — only for admins */}
      {auth.isAdmin && (
        <div style={{ margin: "0 12px 8px", padding: 3, background: C.bg, borderRadius: 10, display: "flex", gap: 3 }}>
          {(["employee", "rh"] as UserRole[]).map(r => {
            const active = role === r;
            return (
              <button key={r} onClick={() => { setRole(r); }} style={{
                flex: 1, padding: "8px 0", borderRadius: 8, fontSize: 12, fontWeight: 600, border: "none", cursor: "pointer", fontFamily: font, transition: "all .2s",
                background: active ? C.white : "transparent", color: active ? C.dark : C.textMuted,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                boxShadow: active ? "0 1px 4px rgba(0,0,0,.08)" : "none",
              }}>
                {r === "rh" ? <><ShieldCheck size={13} /> Admin RH</> : <><UserCheck size={13} /> Employé</>}
              </button>
            );
          })}
        </div>
      )}
      <div style={{ flex: 1, padding: "0 8px" }}>
        {SIDEBAR_ITEMS.map(section => (
          <div key={section.section} style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: C.textMuted, letterSpacing: .5, padding: "12px 12px 6px", textTransform: "uppercase" }}>{section.section}</div>
            {section.items.map(item => {
              const active = dashPage === item.id;
              const Icon = item.icon;
              return (
                <button key={item.id} onClick={() => setDashPage(item.id)} style={{
                  display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 12px", borderRadius: 8, border: "none",
                  background: active ? C.pinkBg : "transparent", color: active ? C.pink : C.text, cursor: "pointer", fontFamily: font, fontSize: 14, fontWeight: active ? 600 : 400, transition: "all .18s ease",
                  borderLeft: active ? `3px solid ${C.pink}` : "3px solid transparent",
                }}>
                  <Icon size={18} />
                  <span style={{ flex: 1, textAlign: "left" }}>{item.label}</span>
                  {item.badge && <span style={{ background: C.pink, color: C.white, fontSize: 11, fontWeight: 700, borderRadius: 10, padding: "2px 8px", minWidth: 20, textAlign: "center" }}>{item.badge}</span>}
                </button>
              );
            })}
          </div>
        ))}
      </div>
      {/* Language selector */}
      <div style={{ padding: "8px 16px", display: "flex", gap: 4, flexWrap: "wrap" }}>
        {activeLanguages.map(l => (
          <button key={l} onClick={() => switchLang(l)} style={{
            flex: 1, minWidth: 40, padding: "5px 0", borderRadius: 6, fontSize: 11, fontWeight: lang === l ? 600 : 400, border: "none", cursor: "pointer", fontFamily: font,
            background: lang === l ? C.pinkBg : "transparent", color: lang === l ? C.pink : C.textMuted, transition: "all .15s",
          }}>{LANG_META[l].flag} {l.toUpperCase()}</button>
        ))}
      </div>
      {/* User avatar bottom */}
      <div style={{ borderTop: `1px solid ${C.border}` }}>
        <button onClick={() => setShowProfile(true)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 20px 4px", background: "none", border: "none", cursor: "pointer", width: "100%" }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, #E91E8C, #C2185B)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 600, color: C.white }}>
            {auth.user?.name?.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() || "?"}
          </div>
          <div style={{ flex: 1, textAlign: "left" }}>
            <div style={{ fontSize: 14, fontWeight: 500, color: C.text }}>{auth.user?.name || "Utilisateur"}</div>
            <div style={{ fontSize: 11, color: C.textMuted }}>{auth.user?.roles?.[0] || ""}</div>
          </div>
        </button>
        <button onClick={() => { const tid = localStorage.getItem("illizeo_tenant_id"); auth.logout().catch(() => {}).finally(() => { window.location.href = tid ? `${window.location.pathname}?tenant=${tid}` : window.location.pathname; }); }} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 20px 14px", background: "none", border: "none", cursor: "pointer", fontSize: 12, color: C.textMuted, fontFamily: font }}>
          <LogOut size={13} /> Déconnexion
        </button>
      </div>
    </div>
  );

  // ─── RENDER ACTION CARD ──────────────────────────────────
  const renderActionCard = (action: typeof ACTIONS[0], showCheckbox = false, staggerIdx = 0) => {
    const isDone = completedActions.has(action.id);
    const liveSubtitle = action.id === 1 ? (docsMissing > 0 ? `Il vous reste ${docsMissing} pièce(s) administrative(s) à fournir` : "Dossier complet") : action.subtitle;
    return (
    <div key={action.id} className={`iz-card iz-fade-up iz-stagger-${Math.min(staggerIdx, 8)}`} onClick={() => setShowActionDetail(action.id)} style={{ ...sCard, padding: "16px 20px", display: "flex", alignItems: "center", gap: 16, cursor: "pointer", marginBottom: 12, opacity: isDone ? 0.6 : 1 }}>
      <div className="iz-avatar" style={{ width: 40, height: 40, borderRadius: 10, background: isDone ? C.greenLight : action.iconBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
        {isDone ? <CheckCircle size={18} color={C.green} /> : (action.icon || <FileText size={18} color={action.iconColor} />)}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: isDone ? C.textLight : C.text, lineHeight: 1.4, textDecoration: isDone ? "line-through" : "none" }}>{action.title}</div>
        {liveSubtitle && !isDone && <div style={{ fontSize: 13, color: action.id === 1 && docsMissing === 0 ? C.green : C.pink, marginTop: 2 }}>{liveSubtitle}</div>}
        {action.date && !isDone && <div style={{ fontSize: 12, color: C.red, marginTop: 2 }}>En retard ({action.date})</div>}
        {isDone && <div style={{ fontSize: 12, color: C.green, marginTop: 2 }}>Terminé</div>}
        {action.badge && (
          <span className="iz-tag" style={{ display: "inline-flex", alignItems: "center", gap: 4, marginTop: 6, padding: "3px 10px", borderRadius: 12, background: C.pinkLight, fontSize: 11, fontWeight: 600, color: C.pink }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: C.pink }} />
            {action.badge}
          </span>
        )}
      </div>
      {action.urgent && !isDone && <button className="iz-btn-pink" onClick={e => { e.stopPropagation(); setShowDocPanel("admin"); }} style={{ ...sBtn("dark"), padding: "8px 20px", fontSize: 13 }}>Compléter</button>}
      {showCheckbox && (
        <div onClick={e => { e.stopPropagation(); if (!isDone) handleCompleteAction(action.id); }} style={{ width: 22, height: 22, borderRadius: "50%", border: `2px solid ${isDone ? C.green : C.border}`, background: isDone ? C.green : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all .2s", cursor: "pointer" }}>
          {isDone && <Check size={14} color={C.white} />}
        </div>
      )}
    </div>
    );
  };

  // ─── TABLEAU DE BORD ─────────────────────────────────────
  const renderDashboard = () => {
    const bannerGradient = `linear-gradient(135deg, ${employeeBannerColor} 0%, ${employeeBannerColor}99 30%, #C2185B 70%, #E91E8C 100%)`;
    const handleBannerMouseMove = (e: React.MouseEvent) => {
      if (!bannerDragging || !bannerRef.current) return;
      const rect = bannerRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
      const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
      setBannerPos({ x, y });
    };
    const handleBannerUpload = () => {
      setBannerImage("https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=400&fit=crop");
      setBannerEditMode(true);
      setEmployeeBannerCustom(false);
      addToast("Image importée — glissez pour repositionner", "success");
    };
    return (
    <div style={{ flex: 1 }}>
      {/* Hero banner */}
      <div ref={bannerRef} className="iz-fade-in" onMouseMove={handleBannerMouseMove} onMouseUp={() => setBannerDragging(false)} onMouseLeave={() => setBannerDragging(false)} style={{ height: 180, background: bannerImage ? `url(${bannerImage})` : bannerGradient, backgroundSize: `${bannerZoom}%`, backgroundPosition: `${bannerPos.x}% ${bannerPos.y}%`, borderRadius: 0, display: "flex", alignItems: "flex-end", padding: "0 40px 24px", position: "relative", transition: bannerDragging ? "none" : "background .4s", cursor: bannerEditMode ? (bannerDragging ? "grabbing" : "grab") : "default", userSelect: "none" as const }}>
        {/* Gradient overlay when image is set */}
        {bannerImage && <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,.1) 0%, rgba(0,0,0,.45) 100%)" }} />}
        <div style={{ display: "flex", alignItems: "center", gap: 16, position: "relative", zIndex: 2 }}>
          <div onClick={() => setShowAvatarEditor(true)} style={{ width: 56, height: 56, borderRadius: "50%", background: avatarImage ? "none" : "linear-gradient(135deg, #E91E8C, #C2185B)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 600, color: C.white, border: `3px solid ${C.white}`, cursor: "pointer", overflow: "hidden", position: "relative" }}>
            {avatarImage ? (
              <img src={avatarImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: `${avatarPos.x}% ${avatarPos.y}%`, transform: `scale(${avatarZoom / 100})` }} />
            ) : "NF"}
            <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.0)", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0, transition: "all .2s" }} onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = "1"; (e.currentTarget as HTMLElement).style.background = "rgba(0,0,0,.4)"; }} onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = "0"; (e.currentTarget as HTMLElement).style.background = "rgba(0,0,0,.0)"; }}>
              <Upload size={16} color={C.white} />
            </div>
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 600, color: C.white, textShadow: "0 1px 8px rgba(0,0,0,.15)" }}>Bonjour Nadia</h1>
        </div>

        {/* Edit mode toolbar */}
        {bannerEditMode && (
          <div className="iz-fade-up" style={{ position: "absolute", top: 12, left: "50%", transform: "translateX(-50%)", background: C.white, borderRadius: 10, padding: "8px 16px", boxShadow: "0 4px 16px rgba(0,0,0,.2)", display: "flex", alignItems: "center", gap: 12, zIndex: 10 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: C.text }}>Repositionner l'image</span>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 10, color: C.textMuted }}>Zoom</span>
              <input type="range" min={100} max={250} value={bannerZoom} onChange={e => setBannerZoom(Number(e.target.value))} onMouseDown={() => setBannerDragging(false)} style={{ width: 80, accentColor: C.pink }} />
              <span style={{ fontSize: 10, color: C.textMuted, minWidth: 30 }}>{bannerZoom}%</span>
            </div>
            <button onMouseDown={e => { e.stopPropagation(); setBannerDragging(true); }} style={{ padding: "4px 10px", borderRadius: 6, border: `1px solid ${C.border}`, background: bannerDragging ? C.pinkBg : C.white, fontSize: 11, fontWeight: 500, cursor: "grab", fontFamily: font, color: C.text }}>Glisser</button>
            <button onClick={() => { setBannerEditMode(false); addToast("Position sauvegardée", "success"); }} className="iz-btn-pink" style={{ ...sBtn("pink"), padding: "4px 14px", fontSize: 11 }}>Valider</button>
            <button onClick={() => { setBannerImage(null); setBannerEditMode(false); setBannerZoom(100); setBannerPos({ x: 50, y: 50 }); addToast("Image retirée", "warning"); }} style={{ background: "none", border: "none", cursor: "pointer", color: C.textMuted }}><X size={16} /></button>
          </div>
        )}

        {/* Customize button — hidden in edit mode */}
        {!bannerEditMode && (
        <button onClick={() => setEmployeeBannerCustom(!employeeBannerCustom)} style={{ position: "absolute", top: 16, right: 16, background: "rgba(255,255,255,.15)", border: "none", borderRadius: 8, padding: "6px 12px", cursor: "pointer", color: C.white, fontSize: 11, fontWeight: 500, fontFamily: font, display: "flex", alignItems: "center", gap: 6, backdropFilter: "blur(4px)", zIndex: 2 }}>
          <PenTool size={12} /> Personnaliser
        </button>
        )}

        {/* Customization panel — rendered at root level for proper z-index */}
        {false && employeeBannerCustom && null}
      </div>
      <div style={{ display: "flex", gap: 24, padding: "24px 32px" }}>
        {/* Main content */}
        <div style={{ flex: 1 }}>
          {/* Phase progress */}
          <div className="iz-card iz-fade-up" style={{ ...sCard, marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: C.text, margin: 0 }}>Phase en cours : Avant date d'arrivée</h3>
              <span style={{ fontSize: 13, fontWeight: 600, color: employeeProgression === 100 ? C.green : C.pink }}>{employeeProgression}%</span>
            </div>
            <div style={{ height: 8, background: C.bg, borderRadius: 4, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${Math.max(employeeProgression, 2)}%`, animation: "izProgressFill .8s ease both", background: employeeProgression === 100 ? C.green : `linear-gradient(90deg, ${C.pink}, ${C.pinkSoft})`, borderRadius: 4, transition: "width .5s ease" }} />
            </div>
          </div>
          {/* Actions */}
          <h3 style={{ fontSize: 18, fontWeight: 600, color: C.text, margin: "0 0 16px" }}>{t('emp.next_actions')}</h3>
          <div style={{ fontSize: 12, fontWeight: 600, color: C.textMuted, textTransform: "uppercase", letterSpacing: .5, marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
            A faire le plus rapidement possible <AlertTriangle size={14} color={C.amber} />
          </div>
          {ACTIONS.filter(a => a.urgent).map((a, i) => renderActionCard(a, false, i))}
          <div style={{ fontSize: 12, fontWeight: 600, color: C.textMuted, textTransform: "uppercase", letterSpacing: .5, marginBottom: 12, marginTop: 24 }}>CETTE SEMAINE</div>
          {ACTIONS.filter(a => a.type === "task").map((a, i) => renderActionCard(a, true, i + 1))}
          <div style={{ fontSize: 12, fontWeight: 600, color: C.textMuted, textTransform: "uppercase", letterSpacing: .5, marginBottom: 12, marginTop: 24 }}>DANS 2 SEMAINES</div>
          {ACTIONS.filter(a => a.type === "future").slice(0, 1).map((a, i) => renderActionCard(a, true, i + 3))}
          <div style={{ fontSize: 12, fontWeight: 600, color: C.textMuted, textTransform: "uppercase", letterSpacing: .5, marginBottom: 12, marginTop: 24 }}>DANS 7 SEMAINES</div>
          {ACTIONS.filter(a => a.type === "future").slice(1).map((a, i) => renderActionCard(a, true, i + 4))}
          {/* Video section */}
          <div style={{ ...sCard, marginTop: 24, padding: 0, overflow: "hidden" }}>
            <div style={{ height: 240, background: "#1a1a2e", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(255,255,255,.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Play size={24} color={C.white} fill={C.white} />
              </div>
              <div style={{ position: "absolute", bottom: 12, left: 16, color: C.white, fontSize: 12 }}>▶ 0:00 / 1:21</div>
            </div>
          </div>
          {/* See all actions link */}
          <div style={{ ...sCard, marginTop: 16, display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => setDashPage("mes_actions")}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: C.greenLight, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Plus size={16} color={C.green} />
            </div>
            <span style={{ fontSize: 14, fontWeight: 500, color: C.text }}>Voir toutes les actions</span>
          </div>
        </div>
        {/* Right sidebar */}
        <div style={{ width: 320, flexShrink: 0 }}>
          {/* Arrival info */}
          <div style={{ ...sCard, marginBottom: 20 }}>
            <h3 className="iz-fade-up iz-stagger-1" style={{ fontSize: 16, fontWeight: 600, color: C.text, margin: "0 0 4px" }}>Les informations pour mon arrivée</h3>
            <p style={{ fontSize: 13, color: C.textLight, margin: "0 0 16px" }}>Tout ce qu'il vous faut pour votre arrivée</p>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
              <Calendar size={20} color={C.blue} />
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>Date</div>
                <div style={{ fontSize: 13, color: C.textLight }}>Rendez-vous le 1er juin 2026</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <MapPin size={20} color={C.pink} />
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>Bureau</div>
                <div style={{ fontSize: 13, color: C.textLight }}>6 Place Ruth-Bösiger, 1201 Genève</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 14 }}>
              <UserCheck size={20} color={C.green} />
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>Personne à demander</div>
                <div style={{ fontSize: 13, color: C.textLight }}>Amira LAROUSSI — Recruteur(se), accueil au 3ème étage</div>
              </div>
            </div>
          </div>
          {/* Team members */}
          <div style={{ ...sCard }}>
            <h3 className="iz-fade-up iz-stagger-2" style={{ fontSize: 16, fontWeight: 600, color: C.text, margin: "0 0 16px" }}>Membres de l'équipe</h3>
            {TEAM_MEMBERS.map((m, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i < TEAM_MEMBERS.length - 1 ? `1px solid ${C.border}` : "none" }}>
                <div className="iz-avatar" style={{ width: 40, height: 40, borderRadius: "50%", background: m.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 600, color: C.white, flexShrink: 0 }}>{m.initials}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: C.text }}>{m.name}</div>
                  <div style={{ fontSize: 12, color: C.textLight }}>{m.role}</div>
                </div>
                <MessageCircle size={16} color={C.textLight} style={{ cursor: "pointer" }} />
                <ChevronRight size={16} color={C.textLight} />
              </div>
            ))}
            <div style={{ textAlign: "center", marginTop: 12 }}>
              <span style={{ fontSize: 13, color: C.text, textDecoration: "underline", cursor: "pointer" }}>Découvrir le reste de mon équipe</span>
            </div>
          </div>
        </div>
      </div>

      {/* My badges */}
      {myBadges.length > 0 && (() => {
        const BADGE_ICON_MAP_EMP: Record<string, any> = {
          "trophy": Trophy, "file-check": FileCheck2, "message-circle": MessageCircle, "calendar-check": CalendarCheck,
          "star": Star, "handshake": Handshake, "smile": Smile, "party-popper": PartyPopper,
          "award": Award, "heart": Heart, "rocket": Rocket, "gem": Gem, "crown": Crown, "target": Target, "zap": Zap, "gift": Gift,
        };
        return (
        <div style={{ marginTop: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}><Trophy size={18} color={C.amber} /> {t('emp.my_badges')}</h3>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {myBadges.map(b => {
              const BadgeIcon = BADGE_ICON_MAP_EMP[b.icon] || Trophy;
              return (
              <div key={b.id} className="iz-card" style={{ ...sCard, padding: "14px 18px", textAlign: "center", width: 130 }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: b.color + "20", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px", border: `2px solid ${b.color}30` }}>
                  <BadgeIcon size={22} color={b.color} />
                </div>
                <div style={{ fontSize: 12, fontWeight: 600, color: C.text }}>{b.nom}</div>
                <div style={{ fontSize: 10, color: C.textMuted }}>{fmtDateShort(b.earned_at)}</div>
                {b.description && <div style={{ fontSize: 9, color: C.textLight, marginTop: 2, lineHeight: 1.4 }}>{b.description}</div>}
              </div>
              );
            })}
          </div>
        </div>
        );
      })()}
    </div>
    );
  };

  // ─── MES ACTIONS ─────────────────────────────────────────
  const renderMesActions = () => (
    <div style={{ flex: 1, padding: "32px 40px" }}>
      <h1 style={{ fontSize: 24, fontWeight: 600, color: C.text, margin: "0 0 20px" }}>{t('emp.my_actions')}</h1>
      <div style={{ display: "flex", gap: 24, marginBottom: 24, borderBottom: `2px solid ${C.border}` }}>
        {(["toutes", "onboarding"] as DashboardTab[]).map(t => (
          <button key={t} onClick={() => setActionTab(t)} style={{ padding: "8px 0 12px", fontSize: 14, fontWeight: actionTab === t ? 600 : 400, color: actionTab === t ? C.pink : C.textLight, background: "none", border: "none", borderBottom: actionTab === t ? `3px solid ${C.pink}` : "3px solid transparent", cursor: "pointer", fontFamily: font, textTransform: "capitalize" }}>
            {t === "toutes" ? "Toutes les actions" : "Onboarding"}
          </button>
        ))}
      </div>
      {/* Filters */}
      <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
        <div style={{ ...sInput, width: 240, display: "flex", alignItems: "center", gap: 8 }}>
          <Search size={16} color={C.textLight} />
          <span style={{ color: C.textMuted, fontSize: 14 }}>Rechercher</span>
        </div>
        <div style={{ ...sInput, width: "auto", display: "flex", alignItems: "center", gap: 8, padding: "8px 16px" }}>
          <span style={{ fontSize: 13, color: C.textLight }}>Statut :</span>
          <span style={{ fontSize: 13, fontWeight: 500 }}>A faire</span>
          <ChevronRight size={14} color={C.textLight} style={{ transform: "rotate(90deg)" }} />
        </div>
        <div style={{ ...sInput, width: "auto", display: "flex", alignItems: "center", gap: 8, padding: "8px 16px" }}>
          <span style={{ fontSize: 13, color: C.textLight }}>Trier par :</span>
          <span style={{ fontSize: 13, fontWeight: 500 }}>Date</span>
          <ChevronRight size={14} color={C.textLight} style={{ transform: "rotate(90deg)" }} />
        </div>
      </div>
      <div style={{ fontSize: 12, fontWeight: 600, color: C.textMuted, textTransform: "uppercase", letterSpacing: .5, marginBottom: 12 }}>CETTE SEMAINE</div>
      {ACTIONS.filter(a => a.type === "task" || a.urgent).map((a, i) => renderActionCard(a, true, i))}
    </div>
  );

  const handleSendMessage = async () => {
    if (!msgInput.trim() || msgSending) return;
    const activeConv = msgConversations.find(c => c.id === msgActiveConvId);
    if (!activeConv) return;
    setMsgSending(true);
    try {
      const msg = await apiSendMessage(activeConv.other_user.id, msgInput.trim());
      setMsgMessages(prev => [...prev, msg]);
      setMsgInput("");
      setTimeout(() => msgEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
      getConversations().then(setMsgConversations).catch(() => {});
    } catch {}
    finally { setMsgSending(false); }
  };

  const renderMessagerie = () => {
    const activeConv = msgConversations.find(c => c.id === msgActiveConvId);
    return (
    <div style={{ flex: 1, display: "flex", height: "100vh" }}>
      {/* Sidebar conversations */}
      <div style={{ width: 320, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", background: C.white }}>
        <div style={{ padding: "16px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${C.border}` }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: C.text, margin: 0 }}>Messagerie</h2>
          <button onClick={() => { setMsgShowNewConv(!msgShowNewConv); setMsgSearchQuery(""); }} className="iz-btn-pink" style={{ width: 32, height: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", padding: 0, border: "none", background: msgShowNewConv ? C.bg : C.pink, color: msgShowNewConv ? C.text : C.white, cursor: "pointer", fontSize: 16 }}>
            {msgShowNewConv ? <X size={16} /> : <Plus size={16} />}
          </button>
        </div>

        {/* New conversation panel */}
        {msgShowNewConv && (
          <div style={{ borderBottom: `1px solid ${C.border}` }}>
            <div style={{ padding: "10px 16px" }}>
              <div style={{ ...sInput, display: "flex", alignItems: "center", gap: 8, padding: "8px 12px" }}>
                <Search size={14} color={C.textLight} />
                <input value={msgSearchQuery} onChange={e => setMsgSearchQuery(e.target.value)} placeholder="Rechercher un utilisateur..." style={{ border: "none", outline: "none", background: "transparent", flex: 1, fontSize: 13, fontFamily: font, color: C.text }} />
              </div>
            </div>
            <div style={{ maxHeight: 200, overflow: "auto" }}>
              {msgUsers.filter(u => !msgSearchQuery || u.name.toLowerCase().includes(msgSearchQuery.toLowerCase()) || u.email.toLowerCase().includes(msgSearchQuery.toLowerCase())).map(u => (
                <button key={u.id} onClick={async () => {
                  // Check if conversation already exists
                  const existing = msgConversations.find(c => c.other_user?.id === u.id);
                  if (existing) {
                    setMsgActiveConvId(existing.id);
                  } else {
                    // Send a placeholder to create the conversation, then refresh
                    try {
                      const msg = await apiSendMessage(u.id, "👋");
                      await getConversations().then(setMsgConversations);
                      setMsgActiveConvId(msg.conversation_id);
                    } catch {}
                  }
                  setMsgShowNewConv(false);
                }} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 16px", border: "none", background: "transparent", cursor: "pointer", fontFamily: font, textAlign: "left", transition: "all .1s" }}
                onMouseEnter={e => (e.currentTarget.style.background = C.bg)} onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: `linear-gradient(135deg, ${C.pinkSoft}, ${C.pink})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, color: C.white, flexShrink: 0 }}>{u.initials}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: C.text }}>{u.name}</div>
                    <div style={{ fontSize: 10, color: C.textMuted }}>{u.email}</div>
                  </div>
                  {u.role && <span style={{ fontSize: 9, fontWeight: 600, padding: "2px 6px", borderRadius: 4, background: C.bg, color: C.textMuted }}>{u.role}</span>}
                </button>
              ))}
              {msgUsers.length === 0 && <div style={{ padding: "16px", textAlign: "center", fontSize: 12, color: C.textMuted }}>Aucun utilisateur disponible</div>}
            </div>
          </div>
        )}

        <div style={{ flex: 1, overflow: "auto" }}>
          {msgConversations.length === 0 && !msgShowNewConv ? (
            <div style={{ padding: "40px 20px", textAlign: "center" }}>
              <MessageCircle size={32} color={C.border} style={{ marginBottom: 12 }} />
              <div style={{ fontSize: 13, color: C.textMuted, marginBottom: 12 }}>Aucune conversation</div>
              <button onClick={() => setMsgShowNewConv(true)} className="iz-btn-outline" style={{ ...sBtn("outline"), fontSize: 12, padding: "6px 16px" }}>Nouvelle conversation</button>
            </div>
          ) : msgConversations.map(conv => (
            <div key={conv.id} onClick={() => setMsgActiveConvId(conv.id)} style={{
              padding: "12px 16px", cursor: "pointer", display: "flex", alignItems: "center", gap: 10,
              background: msgActiveConvId === conv.id ? C.pinkBg : "transparent", borderBottom: `1px solid ${C.border}`, transition: "all .15s",
            }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: `linear-gradient(135deg, ${C.pinkSoft}, ${C.pink})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 600, color: C.white, position: "relative", flexShrink: 0 }}>
                {conv.other_user?.initials || "?"}
                {conv.unread_count > 0 && <div style={{ position: "absolute", top: -2, right: -2, width: 18, height: 18, borderRadius: "50%", background: C.red, color: C.white, fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", border: `2px solid ${C.white}` }}>{conv.unread_count}</div>}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: msgActiveConvId === conv.id ? 600 : (conv.unread_count > 0 ? 600 : 400), color: C.text }}>{conv.other_user?.name || "Utilisateur"}</div>
                <div style={{ fontSize: 11, color: C.textMuted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {conv.last_message?.is_bot ? "🤖 " : ""}{conv.last_message?.content?.substring(0, 50) || ""}
                </div>
              </div>
              {conv.last_message_at && <div style={{ fontSize: 10, color: C.textMuted, flexShrink: 0 }}>{fmtDateShort(conv.last_message_at)}</div>}
            </div>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {!activeConv ? (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 80, height: 80, borderRadius: "50%", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
              <MessageCircle size={36} color={C.pink} />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: C.text, margin: "0 0 8px" }}>Sélectionnez une conversation</h3>
            <p style={{ fontSize: 14, color: C.textLight }}>Choisissez un contact à gauche pour commencer</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div style={{ padding: "14px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 12, background: C.white }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg, ${C.pinkSoft}, ${C.pink})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 600, color: C.white }}>{activeConv.other_user?.initials}</div>
              <div><div style={{ fontSize: 15, fontWeight: 600 }}>{activeConv.other_user?.name}</div><div style={{ fontSize: 11, color: C.textMuted }}>{activeConv.other_user?.email}</div></div>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflow: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: 12 }}>
              {msgMessages.map(msg => {
                const isMe = msg.sender_id === auth.user?.id;
                const isBot = msg.is_bot;
                return (
                  <div key={msg.id} style={{ display: "flex", justifyContent: isBot ? "center" : isMe ? "flex-end" : "flex-start", maxWidth: "100%" }}>
                    {isBot ? (
                      <div style={{ maxWidth: "80%", padding: "12px 16px", background: C.bg, borderRadius: 12, border: `1px solid ${C.border}` }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                          <div style={{ width: 20, height: 20, borderRadius: "50%", background: C.pink, display: "flex", alignItems: "center", justifyContent: "center" }}><Sparkles size={10} color={C.white} /></div>
                          <span style={{ fontSize: 11, fontWeight: 600, color: C.pink }}>IllizeoBot</span>
                          <span style={{ fontSize: 10, color: C.textMuted }}>{fmtDateTimeShort(msg.created_at)}</span>
                        </div>
                        <div style={{ fontSize: 13, color: C.text, lineHeight: 1.5, whiteSpace: "pre-wrap" }}>{msg.content}</div>
                      </div>
                    ) : (
                      <div style={{ maxWidth: "70%" }}>
                        <div style={{ padding: "10px 14px", borderRadius: isMe ? "14px 14px 4px 14px" : "14px 14px 14px 4px", background: isMe ? C.pink : C.white, color: isMe ? C.white : C.text, border: isMe ? "none" : `1px solid ${C.border}`, fontSize: 13, lineHeight: 1.5, whiteSpace: "pre-wrap" }}>{msg.content}</div>
                        <div style={{ fontSize: 10, color: C.textMuted, marginTop: 4, textAlign: isMe ? "right" : "left" }}>
                          {msg.sender_name} · {fmtDateTimeShort(msg.created_at)}
                          {isMe && msg.read_at && <span> · Lu</span>}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              <div ref={msgEndRef} />
            </div>

            {/* Input */}
            <div style={{ padding: "12px 20px", borderTop: `1px solid ${C.border}`, display: "flex", gap: 10, alignItems: "center", background: C.white }}>
              <input value={msgInput} onChange={e => setMsgInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                placeholder="Écrivez votre message..." style={{ ...sInput, flex: 1, fontSize: 14, padding: "12px 16px" }} />
              <button onClick={handleSendMessage} disabled={!msgInput.trim() || msgSending} className="iz-btn-pink" style={{ ...sBtn("pink"), padding: "10px 16px", borderRadius: 10, opacity: !msgInput.trim() ? 0.5 : 1 }}>
                <Send size={18} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
    );
  };

  // ─── ENTREPRISE ──────────────────────────────────────────
  const renderCompanyBlock = (block: any) => {
    const iconMap: Record<string, React.FC<any>> = { building: Building2, sparkles: Sparkles, heart: Gift, rocket: Zap, users: Users, shield: ShieldCheck, star: Star, target: Target };
    switch (block.type) {
      case 'hero':
        return (
          <div key={block.id} style={{ background: `linear-gradient(135deg, ${C.dark} 0%, #2D1B3D 50%, ${C.pink} 100%)`, borderRadius: 16, padding: "48px 40px", color: C.white, marginBottom: 24 }}>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,.6)", marginBottom: 8 }}>{block.data?.subtitle || ""}</div>
            <h1 style={{ fontSize: 28, fontWeight: 700, margin: "0 0 12px" }}>{block.titre}</h1>
            <p style={{ fontSize: 15, lineHeight: 1.6, opacity: .85, maxWidth: 600, margin: 0 }}>{block.contenu}</p>
          </div>
        );
      case 'text':
        const TIcon = iconMap[block.data?.icon] || Building2;
        return (
          <div key={block.id} className="iz-card" style={{ ...sCard, marginBottom: 16, display: "flex", gap: 16, alignItems: "flex-start" }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: C.pinkBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><TIcon size={22} color={C.pink} /></div>
            <div><h3 style={{ fontSize: 16, fontWeight: 600, margin: "0 0 8px" }}>{block.titre}</h3><p style={{ fontSize: 13, lineHeight: 1.7, color: C.textLight, margin: 0 }}>{block.contenu}</p></div>
          </div>
        );
      case 'mission':
        return (
          <div key={block.id} style={{ background: C.dark, borderRadius: 16, padding: "32px 36px", color: C.white, marginBottom: 16, position: "relative", overflow: "hidden" }}>
            <div style={{ fontSize: 48, fontWeight: 800, color: "rgba(255,255,255,.08)", position: "absolute", top: 12, left: 20 }}>{block.data?.number || "01"}</div>
            <h3 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 8px", position: "relative" }}>{block.titre}</h3>
            <p style={{ fontSize: 14, lineHeight: 1.6, opacity: .8, margin: 0, position: "relative" }}>{block.contenu}</p>
          </div>
        );
      case 'stats':
        return (
          <div key={block.id} style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, margin: "0 0 4px" }}>{block.titre}</h3>
            <p style={{ fontSize: 12, color: C.textLight, margin: "0 0 12px" }}>{block.contenu}</p>
            {block.data?.badge && <div style={{ display: "inline-block", padding: "6px 14px", borderRadius: 8, background: C.greenLight, color: C.green, fontSize: 12, fontWeight: 600, marginBottom: 12 }}>{block.data.badge}</div>}
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${(block.data?.items || []).length}, 1fr)`, gap: 12 }}>
              {(block.data?.items || []).map((s: any, i: number) => (
                <div key={i} className="iz-card" style={{ ...sCard, textAlign: "center" }}>
                  <div style={{ fontSize: 32, fontWeight: 800, color: C.pink }}>{s.value}</div>
                  <div style={{ fontSize: 12, color: C.textLight, marginTop: 4, lineHeight: 1.4 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'values':
        return (
          <div key={block.id} style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, margin: "0 0 16px" }}>{block.titre}</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
              {(block.data?.items || []).map((v: any, i: number) => {
                const VIcon = iconMap[v.icon] || Star;
                return (
                  <div key={i} className="iz-card" style={{ ...sCard, display: "flex", gap: 14, alignItems: "flex-start" }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: C.pinkBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><VIcon size={20} color={C.pink} /></div>
                    <div><div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{v.title}</div><div style={{ fontSize: 12, color: C.textLight, lineHeight: 1.5 }}>{v.desc}</div></div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      case 'video':
        return (
          <div key={block.id} style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, margin: "0 0 12px" }}>{block.titre}</h3>
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min((block.data?.videos || []).length, 2)}, 1fr)`, gap: 16 }}>
              {(block.data?.videos || []).map((v: any, i: number) => (
                <div key={i} className="iz-card" style={{ ...sCard, overflow: "hidden", padding: 0 }}>
                  <div style={{ width: "100%", aspectRatio: "16/9", background: C.dark }}>
                    {v.youtube_id ? (
                      <iframe src={`https://www.youtube.com/embed/${v.youtube_id}`} title={v.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen style={{ width: "100%", height: "100%", border: "none" }} />
                    ) : (
                      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #2D1B3D, #7B5EA7)" }}>
                        <Play size={40} color="rgba(255,255,255,.8)" />
                      </div>
                    )}
                  </div>
                  <div style={{ padding: "12px 16px", fontSize: 14, fontWeight: 500 }}>{v.title}</div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'team':
        return (
          <div key={block.id} style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, margin: "0 0 16px" }}>{block.titre}</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
              {(block.data?.members || []).map((m: any, i: number) => (
                <div key={i} className="iz-card" style={{ ...sCard, textAlign: "center" }}>
                  <div style={{ width: 48, height: 48, borderRadius: "50%", background: m.color || C.pink, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 600, color: C.white, margin: "0 auto 10px" }}>{m.initials}</div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{m.name}</div>
                  <div style={{ fontSize: 11, color: C.textLight, marginBottom: 6 }}>{m.role}</div>
                  {m.email && <div style={{ fontSize: 11, color: C.blue, display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}><Mail size={11} />{m.email}</div>}
                  {m.phone && <div style={{ fontSize: 11, color: C.textMuted, display: "flex", alignItems: "center", justifyContent: "center", gap: 4, marginTop: 2 }}><MapPin size={11} />{m.phone}</div>}
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const renderEntreprise = () => (
    <div style={{ flex: 1, padding: "32px 40px", overflow: "auto" }}>
      {companyBlocks.filter(b => b.actif).length === 0 ? (
        <div style={{ textAlign: "center", padding: 60, color: C.textMuted }}>
          <Building2 size={48} color={C.border} style={{ marginBottom: 12 }} />
          <p>Page entreprise non configurée</p>
        </div>
      ) : companyBlocks.filter(b => b.actif).map(renderCompanyBlock)}
    </div>
  );

  const _oldRenderEntreprise = () => (
    <div style={{ flex: 1, padding: "32px 40px" }}>
      <div style={{ display: "flex", gap: 32 }}>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: C.text, margin: "0 0 16px" }}>À propos</h2>
          <div style={{ ...sCard, background: "linear-gradient(135deg, #c8a0d8 0%, #e0b0e8 100%)", color: C.white, marginBottom: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 12px" }}>À PROPOS DE NOUS ?</h3>
            <p style={{ fontSize: 13, lineHeight: 1.6, margin: 0 }}>
              Illizeo est un groupe international de conseil et d'expertises technologiques qui accélère la transformation de ses clients par les leviers de l'innovation, la technologie et la data. Présent sur 5 continents, dans 18 pays, le Groupe, certifié Great Place To Work, qui comptera plus de 7200 collaborateurs fin 2024.
            </p>
          </div>
          <div style={{ ...sCard, background: C.green, color: C.white }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, margin: "0 0 8px" }}>BIENVENUE DANS LA POSITIVE INNOVATION</h3>
            <p style={{ fontSize: 13, lineHeight: 1.6, margin: 0 }}>
              La « Positive innovation » c'est la trajectoire que propose Illizeo à ses clients pour garantir un impact positif dans la conduite de leurs projets et pour accélérer leur transformation.
            </p>
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: C.text, margin: "0 0 16px" }}>Notre mission</h2>
          <div style={{ ...sCard, background: C.dark, color: C.white, marginBottom: 20, position: "relative", overflow: "hidden", height: 200, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
            <div style={{ fontSize: 40, fontWeight: 800, color: "rgba(255,255,255,.2)", position: "absolute", top: 16, left: 20 }}>01</div>
            <h3 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 8px" }}>NOTRE MISSION</h3>
            <p style={{ fontSize: 12, textAlign: "center", color: "rgba(255,255,255,.8)", maxWidth: 280 }}>Accélérer votre transformation par les leviers de la technologie, de la data & de l'innovation</p>
          </div>
        </div>
      </div>
      {/* Great Place to Work */}
      <div style={{ marginTop: 24 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: C.text, margin: "0 0 4px" }}>UN GROUPE FORMIDABLE OÙ TRAVAILLER</h2>
        <p style={{ fontSize: 14, color: C.textLight, margin: "0 0 16px" }}>NOUS SOMMES UNE FORMIDABLE EQUIPE</p>
        <div style={{ display: "flex", gap: 0, borderRadius: 12, overflow: "hidden" }}>
          <div style={{ flex: 1, background: "#6B88B0", padding: 24, color: C.white, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ fontSize: 11, fontWeight: 700, marginBottom: 8 }}>NOTRE ENGAGEMENT EN FAVEUR DE L'ACCRÉDITATION GREAT PLACE TO WORK®</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,.8)" }}>est déployé en France depuis 2014 et sur l'ensemble de nos marchés au niveau mondial depuis 2020</div>
          </div>
          {[
            { pct: "83%", desc: "de nos employés disent qu'Illizeo est un endroit formidable où travailler" },
            { pct: "85%", desc: "de nos employés sont prêts à se surpasser pour que le travail soit fait" },
            { pct: "80%", desc: "confirme que les employés d'Illizeo cherchent à innover" },
          ].map((s, i) => (
            <div key={i} style={{ flex: 1, background: "#2D6B3F", padding: 24, color: C.white, textAlign: "center" }}>
              <div style={{ fontSize: 32, fontWeight: 800, color: C.amber }}>{s.pct}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,.8)", marginTop: 4 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </div>
      {/* Videos section */}
      <div style={{ marginTop: 32 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, color: C.text, margin: "0 0 16px" }}>Vidéos</h2>
        <div style={{ height: 320, background: C.purple, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ width: 60, height: 60, borderRadius: "50%", background: "rgba(255,255,255,.25)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <Play size={28} color={C.white} fill={C.white} />
            </div>
            <div style={{ fontSize: 28, fontWeight: 600, color: C.white }}>
              Dans un monde où la <span style={{ color: C.pink }}>technologie</span>
            </div>
          </div>
          <button style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer" }}><ChevronLeft size={28} color="rgba(255,255,255,.5)" /></button>
          <button style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer" }}><ChevronRight size={28} color="rgba(255,255,255,.5)" /></button>
        </div>
      </div>
    </div>
  );

  // ─── RAPPORTS ────────────────────────────────────────────
  const renderRapports = () => (
    <div style={{ flex: 1, padding: "32px 40px" }}>
      <h1 style={{ fontSize: 24, fontWeight: 600, color: C.text, margin: "0 0 20px" }}>Rapports</h1>
      <div style={{ borderBottom: `2px solid ${C.border}`, marginBottom: 24 }}>
        <button style={{ padding: "8px 0 12px", fontSize: 14, fontWeight: 600, color: C.pink, background: "none", border: "none", borderBottom: `3px solid ${C.pink}`, cursor: "pointer", fontFamily: font }}>Vue d'ensemble</button>
      </div>
      <div style={{ display: "flex", gap: 20, marginBottom: 24 }}>
        <div style={{ ...sCard, flex: 1, display: "flex", alignItems: "center", gap: 12 }}>
          <Clock size={24} color={C.amber} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: C.text }}>0</div>
            <div style={{ fontSize: 13, color: C.textLight }}>Parcours en cours</div>
          </div>
          <button style={sBtn("outline")}>Voir</button>
        </div>
        <div style={{ ...sCard, flex: 1, display: "flex", alignItems: "center", gap: 12 }}>
          <AlertTriangle size={24} color={C.amber} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: C.text }}>0</div>
            <div style={{ fontSize: 13, color: C.textLight }}>Parcours en retard</div>
          </div>
          <button style={sBtn("outline")}>Voir</button>
        </div>
      </div>
      <div style={{ display: "flex", gap: 20 }}>
        <div style={{ ...sCard, flex: 2 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: C.text, margin: "0 0 4px" }}>Répartition par parcours</h3>
          <p style={{ fontSize: 13, color: C.textLight, margin: "0 0 20px" }}>Découvrez la répartition de vos différents parcours</p>
          <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
            <ResponsiveContainer width={180} height={180}>
              <PieChart>
                <Pie data={[{ value: 1 }]} cx="50%" cy="50%" innerRadius={55} outerRadius={75} dataKey="value" stroke="none">
                  <Cell fill="#ccc" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ccc" }} />
              <span style={{ fontSize: 14, color: C.text }}>Onboarding</span>
              <span style={{ background: C.pink, color: C.white, borderRadius: 10, padding: "2px 8px", fontSize: 11, fontWeight: 700, marginLeft: 8 }}>1</span>
            </div>
          </div>
        </div>
        <div style={{ ...sCard, flex: 1 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: C.text, margin: "0 0 4px" }}>Détails par parcours</h3>
          <p style={{ fontSize: 13, color: C.textLight, margin: "0 0 16px" }}>Suivre le détail statistiques par parcours</p>
          <div style={{ ...sInput, marginBottom: 16 }}>Parcours sélectionné : Onboarding</div>
          <div style={{ fontSize: 12, fontWeight: 600, color: C.textMuted, textTransform: "uppercase", marginBottom: 12 }}>GLOBAL</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <Clock size={14} color={C.amber} />
            <span style={{ fontSize: 14, color: C.text, flex: 1 }}>En cours</span>
            <span style={{ fontSize: 14, fontWeight: 600 }}>1</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <AlertTriangle size={14} color={C.amber} />
            <span style={{ fontSize: 14, color: C.text, flex: 1 }}>En retard</span>
            <span style={{ fontSize: 14, fontWeight: 600 }}>0</span>
          </div>
        </div>
      </div>
      {/* Suivi par utilisateur */}
      <div style={{ ...sCard, marginTop: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, color: C.text, margin: "0 0 4px" }}>Suivi par utilisateur</h3>
        <p style={{ fontSize: 13, color: C.textLight, margin: "0 0 16px" }}>Suivre le détail statistiques par parcours</p>
        <div style={{ display: "flex", gap: 20, borderBottom: `2px solid ${C.border}`, marginBottom: 16 }}>
          <button style={{ padding: "6px 0 10px", fontSize: 13, color: C.textLight, background: "none", border: "none", borderBottom: "3px solid transparent", cursor: "pointer", fontFamily: font }}>+ en retard</button>
          <button style={{ padding: "6px 0 10px", fontSize: 13, color: C.pink, fontWeight: 600, background: "none", border: "none", borderBottom: `3px solid ${C.pink}`, cursor: "pointer", fontFamily: font }}>Futurs arrivants</button>
        </div>
        <div style={{ textAlign: "center", padding: "40px 0", color: C.textLight }}>
          <div style={{ marginBottom: 8 }}><Sparkles size={40} color={C.pink} /></div>
          <span style={{ fontSize: 13, textDecoration: "underline", cursor: "pointer" }}>Découvrez le reste des utilisateurs</span>
        </div>
      </div>
    </div>
  );

  // ─── WELCOME MODAL ───────────────────────────────────────
  const renderWelcomeModal = () => (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
      <div style={{ background: C.white, borderRadius: 20, width: 700, padding: "48px 40px", textAlign: "center", position: "relative" }}>
        <button onClick={() => setShowWelcomeModal(false)} style={{ position: "absolute", top: 20, right: 20, background: "none", border: "none", cursor: "pointer" }}><X size={24} color={C.textLight} /></button>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: -8, marginBottom: 24 }}>
          <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg, #E91E8C, #C2185B)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 600, color: C.white, border: `3px solid ${C.white}`, zIndex: 1 }}>NF</div>
          <div style={{ width: 60, height: 60, borderRadius: "50%", background: C.white, display: "flex", alignItems: "center", justifyContent: "center", marginLeft: -16, border: `2px solid ${C.border}` }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: C.pink, letterSpacing: 1 }}>illizeo</span>
          </div>
        </div>
        <h2 style={{ fontSize: 24, fontWeight: 600, color: C.text, margin: "0 0 12px" }}>Bienvenue chez Illizeo Nadia</h2>
        <p style={{ fontSize: 14, color: C.textLight, lineHeight: 1.6, margin: "0 0 32px", maxWidth: 500, marginInline: "auto" }}>
          Pour faciliter votre arrivée, nous avons conçu un parcours d'intégration rien que pour vous. Ce parcours est organisé autour de 4 phases distinctes que voici
        </p>
        {/* Phase stepper */}
        <div style={{ ...sCard, padding: "24px 20px", margin: "0 0 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {[
            { label: "Avant le premier jour", Icon: Hand, active: true },
            { label: "Premier jour", Icon: PartyPopper },
            { label: "Première semaine", Icon: Dumbbell },
            { label: "3 premiers mois", Icon: Package },
          ].map((phase, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 0, width: "100%" }}>
                {i > 0 && <div style={{ flex: 1, height: 4, background: "#eee", borderRadius: 2 }} />}
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: phase.active ? C.green : C.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><phase.Icon size={16} color={phase.active ? C.white : C.textMuted} /></div>
                {i < 3 && <div style={{ flex: 1, height: 4, background: "#eee", borderRadius: 2 }} />}
              </div>
              <span style={{ fontSize: 12, color: C.text, fontWeight: 500, textAlign: "center" }}>{phase.label}</span>
            </div>
          ))}
        </div>
        <button onClick={() => setShowWelcomeModal(false)} style={{ ...sBtn("dark"), padding: "12px 36px", fontSize: 15 }}>Commencer mon parcours</button>
      </div>
    </div>
  );

  // ─── DOCUMENT PANEL ──────────────────────────────────────
  const renderDocPanel = () => {
    if (showDocCategory) {
      const cat = DOC_CATEGORIES.find(c => c.id === showDocCategory);
      if (!cat) return null;
      const isFormulaires = cat.id === "formulaires";
      return (
        <div className="iz-panel" style={{ position: "fixed", top: 0, right: 0, width: 540, height: "100vh", background: C.white, boxShadow: "-4px 0 24px rgba(0,0,0,.1)", zIndex: 1001, display: "flex", flexDirection: "column", overflow: "auto" }}>
          <div style={{ padding: "24px 28px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: C.text, margin: 0 }}>{cat.title}</h2>
              <p style={{ fontSize: 13, color: C.textLight, margin: "4px 0 0" }}>Compléter mon dossier administratif</p>
            </div>
            <button onClick={() => setShowDocCategory(null)} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={22} color={C.textLight} /></button>
          </div>
          <div style={{ flex: 1, padding: "20px 28px", overflow: "auto" }}>
            {cat.id === "suisse" && (
              <div style={{ background: C.pinkBg, borderRadius: 8, padding: 14, marginBottom: 20, fontSize: 13, color: C.text, lineHeight: 1.5 }}>
                Document à soumettre pour toutes les démarches administratives. A faire en amont de l'arrivée du collaborateur – Pièce d'identité ou passeport en cours de validité – Carte AVS (si concerné) – Permis de travail/résidence (si concerné)
              </div>
            )}
            {cat.id === "supplementaires" && (
              <div style={{ background: C.blueLight, borderRadius: 8, padding: 14, marginBottom: 20, fontSize: 13, color: C.text, lineHeight: 1.5 }}>
                Cet espace permet de transmettre des documents administratifs complémentaires, tels que des pièces justificatives.
              </div>
            )}
            {cat.docs.map((doc, i) => {
              const docStatus = employeeDocs[doc] || "manquant";
              return (
              <div key={i} style={{ marginBottom: 28 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                  <label style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{doc}</label>
                  {docStatus !== "manquant" && (
                    <span className="iz-fade-in" style={{ padding: "3px 10px", borderRadius: 12, fontSize: 11, fontWeight: 600,
                      background: docStatus === "valide" ? C.greenLight : docStatus === "en_attente" ? C.amberLight : docStatus === "refuse" ? C.redLight : C.bg,
                      color: docStatus === "valide" ? C.green : docStatus === "en_attente" ? C.amber : docStatus === "refuse" ? C.red : C.textMuted,
                    }}>{docStatus === "valide" ? "Validé" : docStatus === "en_attente" ? "En attente de validation" : docStatus === "refuse" ? "Refusé — resoumettre" : "Soumis"}</span>
                  )}
                </div>
                {isFormulaires ? (
                  <div style={{ marginTop: 8 }}>
                    <div style={{ marginBottom: 4 }}>
                      <strong style={{ fontSize: 14 }}>Étape 1</strong>
                      <div style={{ fontSize: 13, color: C.textLight, marginBottom: 6 }}>Télécharger le fichier et le compléter</div>
                      <button className="iz-btn-pink" style={{ ...sBtn("pink"), padding: "8px 20px", fontSize: 13 }}>Télécharger</button>
                    </div>
                    <div style={{ marginTop: 12 }}>
                      <strong style={{ fontSize: 14 }}>Étape 2</strong>
                      <div style={{ fontSize: 13, color: C.textLight, marginBottom: 6 }}>Importer le fichier complété</div>
                      {docStatus === "manquant" || docStatus === "refuse" ? (
                        <button onClick={() => handleEmployeeSubmitDoc(doc)} className="iz-btn-pink" style={{ display: "flex", alignItems: "center", gap: 6, ...sBtn("pink"), padding: "8px 16px", fontSize: 13 }}>
                          <Plus size={14} /> Ajouter un fichier
                        </button>
                      ) : (
                        <div className="iz-fade-in" style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: C.greenLight, borderRadius: 8, fontSize: 13, color: C.green }}>
                          <CheckCircle size={16} /> Fichier soumis
                        </div>
                      )}
                    </div>
                  </div>
                ) : (docStatus === "manquant" || docStatus === "refuse") ? (
                  <div className="iz-upload-zone" onClick={() => handleEmployeeSubmitDoc(doc)} style={{ marginTop: 8, borderRadius: 12, padding: "28px 20px", textAlign: "center", cursor: "pointer" }}>
                    <Upload size={24} color={C.textLight} style={{ marginBottom: 8 }} />
                    <div style={{ fontSize: 14, color: C.text }}>Glisser-déposer ou <span style={{ color: C.pink, fontWeight: 600, textDecoration: "underline" }}>Importer</span> un fichier</div>
                    <div style={{ fontSize: 12, color: C.textMuted, marginTop: 4 }}>Type de fichier: Image (png, jpeg...), PDF, Office (word, excel, txt, csv...)</div>
                  </div>
                ) : (
                  <div className="iz-fade-in" style={{ marginTop: 8, padding: "16px 20px", background: docStatus === "valide" ? C.greenLight : C.amberLight, borderRadius: 12, display: "flex", alignItems: "center", gap: 10 }}>
                    {docStatus === "valide" ? <CheckCircle size={20} color={C.green} /> : <Clock size={20} color={C.amber} />}
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 500, color: docStatus === "valide" ? C.green : C.amber }}>{docStatus === "valide" ? "Document validé par l'équipe RH" : "Document soumis — en attente de validation"}</div>
                      <div style={{ fontSize: 12, color: C.textLight, marginTop: 2 }}>document_{doc.replace(/[^a-zA-Z]/g, "").toLowerCase().substring(0, 12)}.pdf</div>
                    </div>
                  </div>
                )}
              </div>
              );
            })}
          </div>
          <div style={{ padding: "16px 28px", borderTop: `1px solid ${C.border}`, display: "flex", gap: 12, justifyContent: "flex-end" }}>
            <button style={sBtn("pink")}>Sauvegarder</button>
            {cat.id === "supplementaires" && <button style={sBtn("outline")}>Non concerné</button>}
          </div>
        </div>
      );
    }

    if (showDocPanel === "admin") {
      return (
        <div className="iz-panel" style={{ position: "fixed", top: 0, right: 0, width: 540, height: "100vh", background: C.white, boxShadow: "-4px 0 24px rgba(0,0,0,.1)", zIndex: 1001, display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "24px 28px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: C.text, margin: 0 }}>Compléter mon dossier administratif</h2>
              <p style={{ fontSize: 13, color: C.textLight, margin: "4px 0 0" }}>Administratif</p>
            </div>
            <button onClick={() => setShowDocPanel(null)} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={22} color={C.textLight} /></button>
          </div>
          <div style={{ flex: 1, padding: "20px 28px", overflow: "auto" }}>
            <p style={{ fontSize: 13, color: C.textLight, marginBottom: 20, lineHeight: 1.5 }}>
              Les pièces administratives sont organisées par catégorie. Certaines pièces sont obligatoires, d'autres sont facultatives.
            </p>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 16 }}>Onboarding</div>
            {getLiveDocCategories().map(cat => {
              const allDone = cat.missing === 0;
              return (
              <div key={cat.id} className="iz-card" style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderRadius: 10, border: `1px solid ${allDone ? C.green : C.border}`, marginBottom: 10, background: allDone ? C.greenLight : C.white }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: allDone ? C.green : C.greenLight, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {allDone ? <CheckCircle size={18} color={C.white} /> : <FileText size={18} color={C.green} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: C.text }}>{cat.title}</div>
                  {allDone ? (
                    <div style={{ fontSize: 12, color: C.green, fontWeight: 600 }}>Catégorie complète</div>
                  ) : (
                    <div style={{ fontSize: 12, color: C.amber }}>{cat.missing} information(s) manquante(s)</div>
                  )}
                </div>
                <button onClick={() => setShowDocCategory(cat.id)} className={allDone ? "iz-btn-outline" : "iz-btn-pink"} style={{ ...(allDone ? sBtn("outline") : sBtn("dark")), padding: "6px 16px", fontSize: 12 }}>{allDone ? "Voir" : "Compléter"}</button>
              </div>
              );
            })}
          </div>
          <div style={{ padding: "16px 28px", borderTop: `1px solid ${C.border}`, textAlign: "center" }}>
            <button onClick={() => { if (docsMissing === 0) addToast("Dossier administratif envoyé pour validation finale", "success"); }} className="iz-btn-pink" style={{ ...sBtn(docsMissing === 0 ? "pink" : "outline"), opacity: docsMissing === 0 ? 1 : 0.5 }}>{docsMissing === 0 ? "Envoyer mon dossier administratif finalisé" : `Envoyer mon dossier (${docsMissing} pièce(s) manquante(s))`}</button>
          </div>
        </div>
      );
    }
    return null;
  };

  // ─── ACTION DETAIL PANEL ─────────────────────────────────
  const renderActionDetail = () => {
    if (!showActionDetail) return null;
    const action = ACTIONS.find(a => a.id === showActionDetail);
    if (!action) return null;
    const isDone = completedActions.has(action.id);
    // Find matching template for richer data
    const tpl = ACTION_TEMPLATES.find(t => t.titre === action.title);
    const meta = tpl ? ACTION_TYPE_META[tpl.type] : null;
    return (
      <div className="iz-panel" style={{ position: "fixed", top: 0, right: 0, width: 480, height: "100vh", background: C.white, boxShadow: "-4px 0 24px rgba(0,0,0,.1)", zIndex: 1001, display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "24px 28px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: C.text, margin: 0, lineHeight: 1.4 }}>{action.title}</h2>
            {meta && <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6 }}><meta.Icon size={14} color={meta.color} /><span style={{ fontSize: 13, color: meta.color, fontWeight: 500 }}>{meta.label}</span></div>}
          </div>
          <button onClick={() => setShowActionDetail(null)} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={22} color={C.textLight} /></button>
        </div>
        <div style={{ flex: 1, padding: "20px 28px", overflow: "auto" }}>
          {/* Info grid */}
          <div style={{ display: "grid", gridTemplateColumns: "110px 1fr", gap: "12px 0", fontSize: 14, marginBottom: 20 }}>
            <span style={{ color: C.textLight }}>Date</span>
            <span style={{ fontWeight: 500, color: C.text }}>{action.date || "—"}</span>
            <span style={{ color: C.textLight }}>Statut</span>
            <span style={{ fontWeight: 500, color: isDone ? C.green : action.urgent ? C.red : C.text }}>{isDone ? "Terminé" : action.urgent ? "En retard" : "À faire"}</span>
            {tpl && <><span style={{ color: C.textLight }}>Phase</span><span style={{ fontWeight: 500 }}>{tpl.phase}</span></>}
            {tpl && <><span style={{ color: C.textLight }}>Délai</span><span style={{ fontWeight: 500 }}>{tpl.delaiRelatif}</span></>}
            {tpl && tpl.dureeEstimee && <><span style={{ color: C.textLight }}>Durée estimée</span><span style={{ fontWeight: 500 }}>{tpl.dureeEstimee}</span></>}
            {tpl && <><span style={{ color: C.textLight }}>{t('dash.obligatory')}</span><span style={{ fontWeight: 500, color: tpl.obligatoire ? C.red : C.textLight }}>{tpl.obligatoire ? "Oui" : "Non"}</span></>}
          </div>
          {/* Description */}
          {tpl && (
            <div style={{ padding: "14px 16px", background: C.bg, borderRadius: 10, marginBottom: 16, fontSize: 14, color: C.text, lineHeight: 1.6 }}>
              {tpl.description}
            </div>
          )}
          {/* Action-specific content */}
          {action.type === "admin" && !isDone && (
            <div style={{ padding: "14px 16px", background: C.redLight, borderRadius: 10, marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
              <AlertTriangle size={18} color={C.red} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.red }}>Action urgente</div>
                <div style={{ fontSize: 12, color: C.text }}>{action.subtitle || "Des pièces administratives sont manquantes."}</div>
              </div>
            </div>
          )}
          {tpl && tpl.lienExterne && !isDone && (
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", border: `1px solid ${C.border}`, borderRadius: 8, marginBottom: 16 }}>
              <Link size={16} color={C.blue} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>Accéder à la ressource</div>
                <div style={{ fontSize: 11, color: C.textLight }}>{tpl.lienExterne}</div>
              </div>
              <button className="iz-btn-pink" style={{ ...sBtn("pink"), padding: "6px 16px", fontSize: 12 }}>Accès</button>
            </div>
          )}
          {tpl && tpl.type === "document" && !isDone && (
            <div style={{ marginBottom: 16 }}>
              <button onClick={() => { setShowActionDetail(null); setShowDocPanel("admin"); }} className="iz-btn-outline" style={{ ...sBtn("outline"), width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}><FileUp size={16} /> Ouvrir le panneau documents</button>
            </div>
          )}
          {/* Individual pieces upload */}
          {tpl && tpl.piecesRequises && tpl.piecesRequises.length > 0 && !isDone && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span>Pièces à fournir ({tpl.piecesRequises.filter(p => uploadedPieces[`${tpl.id}-${p}`]).length}/{tpl.piecesRequises.length})</span>
                <span style={{ fontSize: 11, color: C.textMuted }}>Cliquer pour charger</span>
              </div>
              {tpl.piecesRequises.map((piece, pi) => {
                const key = `${tpl.id}-${piece}`;
                const status = uploadedPieces[key];
                return (
                  <div key={pi} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", marginBottom: 6, borderRadius: 8, border: `1px solid ${status === "validated" ? C.green : status === "refused" ? C.red : status === "uploaded" ? C.amber : C.border}`, background: status === "validated" ? C.greenLight : status === "refused" ? C.redLight : status === "uploaded" ? C.amberLight : C.white }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: status === "validated" ? C.green : status === "refused" ? C.red : status === "uploaded" ? C.amber : C.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {status === "validated" && <CheckCircle size={14} color={C.white} />}
                      {status === "refused" && <XCircle size={14} color={C.white} />}
                      {status === "uploaded" && <Clock size={14} color={C.white} />}
                      {!status && <Upload size={14} color={C.textMuted} />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: C.text }}>{piece}</div>
                      <div style={{ fontSize: 11, color: status === "validated" ? C.green : status === "refused" ? C.red : status === "uploaded" ? C.amber : C.textMuted }}>
                        {status === "validated" ? "Validé par RH" : status === "refused" ? "Refusé — à renvoyer" : status === "uploaded" ? "En attente de validation" : "À charger"}
                      </div>
                    </div>
                    {!status && (
                      <button onClick={() => { setUploadedPieces(prev => ({ ...prev, [key]: "uploaded" })); addToast(`"${piece}" chargé avec succès`, "success"); }} className="iz-btn-pink" style={{ ...sBtn("pink"), padding: "5px 14px", fontSize: 11 }}>Charger</button>
                    )}
                    {status === "refused" && (
                      <button onClick={() => { setUploadedPieces(prev => ({ ...prev, [key]: "uploaded" })); addToast(`"${piece}" renvoyé`, "success"); }} className="iz-btn-pink" style={{ ...sBtn("pink"), padding: "5px 14px", fontSize: 11, background: C.red }}>Renvoyer</button>
                    )}
                    {status === "uploaded" && <span style={{ fontSize: 10, color: C.amber, fontWeight: 600 }}>En attente</span>}
                    {status === "validated" && <CheckCircle size={16} color={C.green} />}
                  </div>
                );
              })}
            </div>
          )}
          {tpl && tpl.type === "formulaire" && !isDone && (
            <div style={{ marginBottom: 16 }}>
              <button className="iz-btn-outline" style={{ ...sBtn("outline"), width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}><ClipboardList size={16} /> Remplir le formulaire</button>
            </div>
          )}
          {isDone && (
            <div className="iz-fade-in" style={{ padding: "16px 20px", background: C.greenLight, borderRadius: 10, display: "flex", alignItems: "center", gap: 10 }}>
              <CheckCircle size={20} color={C.green} />
              <span style={{ fontSize: 14, fontWeight: 500, color: C.green }}>Action complétée avec succès</span>
            </div>
          )}
        </div>
        <div style={{ padding: "16px 28px", borderTop: `1px solid ${C.border}`, display: "flex", gap: 10, justifyContent: "flex-end" }}>
          {isDone ? (
            <button className="iz-btn-outline" onClick={() => { setCompletedActions(prev => { const s = new Set(prev); s.delete(action.id); return s; }); }} style={sBtn("outline")}>Rouvrir l'action</button>
          ) : (
            <>
              {action.type === "admin" && <button onClick={() => { setShowActionDetail(null); setShowDocPanel("admin"); }} className="iz-btn-outline" style={sBtn("outline")}>Compléter les documents</button>}
              <button className="iz-btn-pink" onClick={() => { handleCompleteAction(action.id); }} style={{ ...sBtn("pink"), padding: "10px 28px" }}>Marquer comme fait</button>
            </>
          )}
        </div>
      </div>
    );
  };

  // ─── PROFILE MODAL ───────────────────────────────────────
  const renderProfileModal = () => {
    if (!showProfile) return null;
    const tabs = [
      { id: "infos", label: "Informations personnelles" },
      { id: "password", label: "Mot de passe" },
      { id: "notifs", label: "Notifications" },
      { id: "notifs_res", label: "Notifications ressources" },
    ];
    return (
      <div className="iz-overlay" style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
        <div className="iz-modal" style={{ background: C.white, borderRadius: 16, width: 900, maxHeight: "85vh", overflow: "auto", position: "relative" }}>
          <div style={{ padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.pink, letterSpacing: 1 }}>illizeo</div>
            <button onClick={() => setShowProfile(false)} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={22} color={C.textLight} /></button>
          </div>
          <div style={{ textAlign: "center", padding: "0 40px 24px" }}>
            <h1 style={{ fontSize: 36, fontWeight: 300, color: C.text, margin: "0 0 24px" }}>Nadia Ferreira</h1>
            <div style={{ display: "flex", justifyContent: "center", gap: 32, borderBottom: `2px solid ${C.border}` }}>
              {tabs.map(t => (
                <button key={t.id} onClick={() => setProfileTab(t.id)} style={{ padding: "8px 0 12px", fontSize: 14, fontWeight: profileTab === t.id ? 600 : 400, color: profileTab === t.id ? C.text : C.textLight, background: "none", border: "none", borderBottom: profileTab === t.id ? `3px solid ${C.pink}` : "3px solid transparent", cursor: "pointer", fontFamily: font }}>{t.label}</button>
              ))}
            </div>
          </div>
          <div style={{ padding: "24px 56px 40px" }}>
            {profileTab === "infos" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px 32px" }}>
                {[
                  { label: "Prénom", value: formData.prenom },
                  { label: "Nom de famille", value: formData.nom },
                  { label: "Numéro de téléphone", value: "6********", hasPrefix: true },
                  { label: "Date de naissance", value: formData.dateNaissance, optional: true },
                ].map((f, i) => (
                  <div key={i}>
                    <label style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{f.label} {f.optional && <span style={{ color: C.textMuted, fontWeight: 400 }}>Optionnel</span>}</label>
                    <input value={f.value} readOnly style={{ ...sInput, marginTop: 6 }} />
                  </div>
                ))}
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: C.text }}>Genre *</label>
                  <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
                    {["Homme", "Femme", "Neutre"].map(g => (
                      <div key={g} style={{ flex: 1, padding: "10px 16px", borderRadius: 8, border: `2px solid ${formData.genre === g ? C.pink : C.border}`, display: "flex", alignItems: "center", gap: 10, cursor: "pointer", background: formData.genre === g ? C.pinkBg : C.white }}>
                        <div style={{ width: 20, height: 20, borderRadius: "50%", border: `2px solid ${formData.genre === g ? C.pink : C.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {formData.genre === g && <div style={{ width: 10, height: 10, borderRadius: "50%", background: C.pink }} />}
                        </div>
                        <span style={{ fontSize: 14 }}>{g}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: C.text }}>Langue</label>
                  <div style={{ ...sInput, marginTop: 6, display: "flex", justifyContent: "space-between", alignItems: "center" }}>Français <ChevronRight size={14} color={C.textLight} style={{ transform: "rotate(90deg)" }} /></div>
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: C.text }}>Nationalité <span style={{ color: C.textMuted, fontWeight: 400 }}>Optionnel</span></label>
                  <div style={{ ...sInput, marginTop: 6, display: "flex", justifyContent: "space-between", alignItems: "center" }}>Marocaine <ChevronRight size={14} color={C.textLight} style={{ transform: "rotate(90deg)" }} /></div>
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: C.text }}>Fuseau horaire</label>
                  <div style={{ ...sInput, marginTop: 6, display: "flex", justifyContent: "space-between", alignItems: "center" }}>Europe/Paris (UTC +01:00) <ChevronRight size={14} color={C.textLight} style={{ transform: "rotate(90deg)" }} /></div>
                </div>
                <div style={{ gridColumn: "1 / -1", textAlign: "center" }}>
                  <div style={{ ...sCard, padding: 24, marginBottom: 16 }}>
                    <div style={{ width: 100, height: 100, borderRadius: "50%", background: "linear-gradient(135deg, #E91E8C, #C2185B)", margin: "0 auto 12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, color: C.white }}>NF</div>
                    <span style={{ fontSize: 14, textDecoration: "underline", cursor: "pointer", color: C.text }}>Importer</span>
                  </div>
                </div>
                <div><button style={{ ...sBtn("outline"), width: "100%" }}>Accéder aux CGU d'Illizeo</button></div>
                <div><button style={{ ...sBtn("outline"), width: "100%" }}>Accès à la politique de confidentialité d'Illizeo</button></div>
              </div>
            )}
            {profileTab === "password" && (
              <div>
                {["Mot de passe actuel *", "Nouveau mot de passe *", "Confirmer le nouveau mot de passe*"].map((label, i) => (
                  <div key={i} style={{ marginBottom: 24 }}>
                    <label style={{ fontSize: 14, fontWeight: 600, color: C.text }}>
                      {label} {i === 1 && <span style={{ fontWeight: 400, fontSize: 12, color: C.textLight }}>(Le mot de passe doit comporter au moins 8 caractères, 1 chiffre et 1 caractère spécial)</span>}
                    </label>
                    <div style={{ position: "relative", marginTop: 8 }}>
                      <input type="password" placeholder={i === 0 ? "Saisissez votre mot de passe actuel" : "Saisissez votre nouveau mot de passe"} style={sInput} />
                      <Eye size={18} color={C.textLight} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", cursor: "pointer" }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
            {(profileTab === "notifs" || profileTab === "notifs_res") && (
              <div>
                <div style={{ ...sInput, marginBottom: 20, display: "flex", alignItems: "center", gap: 8, maxWidth: 400 }}>
                  <Search size={16} color={C.textLight} />
                  <span style={{ color: C.textMuted, fontSize: 14 }}>Rechercher...</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${C.border}`, marginBottom: 4 }}>
                  <span style={{ flex: 1, fontSize: 12, fontWeight: 600, color: C.textMuted, textTransform: "uppercase" }}>↕ NOM</span>
                  <span style={{ width: 120, textAlign: "center", fontSize: 12, fontWeight: 600, color: C.textMuted }}>E-MAIL</span>
                  <span style={{ width: 120, textAlign: "center", fontSize: 12, fontWeight: 600, color: C.textMuted }}>SMS</span>
                </div>
                {(profileTab === "notifs" ? NOTIFICATIONS_LIST : NOTIF_RESOURCES).map((n, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", padding: "12px 16px", background: i % 2 === 0 ? C.bg : C.white, borderRadius: 6 }}>
                    <span style={{ flex: 1, fontSize: 14, color: C.text }}>{n}</span>
                    <div style={{ width: 120, textAlign: "center" }}>
                      <div style={{ width: 20, height: 20, borderRadius: 4, border: `2px solid ${C.green}`, background: C.greenLight, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                        <Check size={12} color={C.green} />
                      </div>
                    </div>
                    <div style={{ width: 120, textAlign: "center" }}>
                      <div style={{ width: 20, height: 20, borderRadius: 4, border: `2px solid ${C.border}`, display: "inline-block" }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div style={{ textAlign: "center", marginTop: 32 }}>
              <button style={sBtn("pink")}>Sauvegarder</button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ═══════════════════════════════════════════════════════════
  // ═══ ADMIN / RH SECTION ════════════════════════════════════
  // ═══════════════════════════════════════════════════════════


    // addToast_admin is defined at top level

  const PARCOURS_CAT_META: Record<ParcoursCategorie, { label: string; Icon: React.FC<any>; color: string; bg: string }> = {
    onboarding: { label: "Onboarding", Icon: UserPlus, color: "#4CAF50", bg: C.greenLight },
    offboarding: { label: "Offboarding", Icon: LogOut, color: "#E53935", bg: C.redLight },
    crossboarding: { label: "Crossboarding", Icon: ArrowRight, color: "#1A73E8", bg: C.blueLight },
    reboarding: { label: "Reboarding", Icon: Hand, color: "#7B5EA7", bg: C.purple + "15" },
  };

  // ─── MODULE ACCESS CHECK ─────────────────────────────────
    // Map admin pages to required modules. Pages not listed are always accessible.
    const PAGE_MODULE_MAP: Partial<Record<AdminPage, string>> = {
      admin_parcours: "onboarding",
      admin_suivi: "onboarding",
      admin_documents: "onboarding",
      admin_equipes: "onboarding",
      admin_cooptation: "cooptation",
      admin_gamification: "gamification",
      admin_equipements: "onboarding",
      admin_signatures: "onboarding",
      admin_nps: "nps",
      admin_2fa: "sso",
      admin_provisioning: "provisioning",
    };
    const isEditorTenant = (localStorage.getItem("illizeo_tenant_id") || "illizeo") === "illizeo";
    const trialStart = localStorage.getItem("illizeo_trial_start");
    const isInTrial = trialStart && (new Date().getTime() - new Date(trialStart).getTime()) <= 14 * 24 * 60 * 60 * 1000;
    const trialExpired = trialStart && !isInTrial;
    const hasActiveSub = tenantSubscriptions.some((s: any) => s.status === "active" || s.status === "trialing");
    const hasModule = (mod: string) => {
      if (isEditorTenant) return true; // Editor tenant — all access
      if (isInTrial && !hasActiveSub) return true; // In trial, no sub yet — all access
      if (trialExpired && !hasActiveSub) return false; // Trial expired, no sub — blocked
      if (tenantActiveModules.length === 0 && hasActiveSub) return true; // Sub but modules not loaded yet
      return tenantActiveModules.includes(mod);
    };
    const isPageAccessible = (pageId: AdminPage) => {
      const requiredModule = PAGE_MODULE_MAP[pageId];
      return !requiredModule || hasModule(requiredModule);
    };

  // ─── ADMIN SIDEBAR DATA ─────────────────────────────────
    const SIDEBAR = [
      { section: t('admin.dashboard_title'), items: [{ id: "admin_dashboard" as AdminPage, label: t('sidebar.dashboard'), icon: LayoutDashboard }] },
      { section: t('admin.management'), items: [
        { id: "admin_parcours" as AdminPage, label: t('admin.parcours_actions'), icon: Route },
        { id: "admin_suivi" as AdminPage, label: t('admin.collaborateur_tracking'), icon: Users },
        { id: "admin_documents" as AdminPage, label: t('admin.documents'), icon: FileText },
        { id: "admin_equipes" as AdminPage, label: t('admin.teams_groups'), icon: Users },
        { id: "admin_messagerie" as AdminPage, label: t('admin.messaging'), icon: MessageCircle },
      ]},
      { section: t('admin.automation'), items: [
        { id: "admin_workflows" as AdminPage, label: t('admin.workflows'), icon: Zap },
        { id: "admin_templates" as AdminPage, label: t('admin.email_templates'), icon: Mail },
        { id: "admin_notifications" as AdminPage, label: t('admin.notifications'), icon: Bell },
      ]},
      { section: t('admin.content'), items: [
        { id: "admin_entreprise" as AdminPage, label: t('admin.company_page'), icon: Building2 },
        { id: "admin_equipements" as AdminPage, label: t('admin.equipment'), icon: Laptop },
        { id: "admin_signatures" as AdminPage, label: t('admin.signatures'), icon: PenLine },
        { id: "admin_nps" as AdminPage, label: t('admin.nps'), icon: Star },
        { id: "admin_contrats" as AdminPage, label: t('admin.contracts'), icon: FileSignature },
        { id: "admin_cooptation" as AdminPage, label: t('admin.cooptation'), icon: Handshake },
        { id: "admin_gamification" as AdminPage, label: t('admin.gamification'), icon: Trophy },
        { id: "admin_integrations" as AdminPage, label: t('admin.integrations'), icon: Link },
      ]},
      { section: t('admin.settings'), items: [
        { id: "admin_users" as AdminPage, label: t('admin.users_roles'), icon: ShieldCheck },
        { id: "admin_fields" as AdminPage, label: t('admin.collab_fields'), icon: ClipboardList },
        { id: "admin_apparence" as AdminPage, label: t('admin.appearance'), icon: Palette },
        { id: "admin_2fa" as AdminPage, label: t('admin.security'), icon: ShieldCheck },
        { id: "admin_donnees" as AdminPage, label: t('admin.data_rgpd'), icon: DatabaseBackup },
        { id: "admin_provisioning" as AdminPage, label: t('prov.title'), icon: Download },
        ...(!isEditorTenant ? [{ id: "admin_abonnement" as AdminPage, label: t('admin.subscription'), icon: CircleDollarSign }] : []),
      ]},
    ];
  
    // ─── DASHBOARD ─────────────────────────────────────────────
    const renderDashboard_admin = () => {
      // ── Computed KPIs ──
      const totalCollab = COLLABORATEURS.length;
      const enCours = COLLABORATEURS.filter(c => c.status === "en_cours").length;
      const enRetard = COLLABORATEURS.filter(c => c.status === "en_retard").length;
      const termines = COLLABORATEURS.filter(c => c.status === "termine").length;
      const avgProgression = totalCollab > 0 ? Math.round(COLLABORATEURS.reduce((s, c) => s + c.progression, 0) / totalCollab) : 0;
      const totalDocsValides = COLLABORATEURS.reduce((s, c) => s + c.docsValides, 0);
      const totalDocsTotal = COLLABORATEURS.reduce((s, c) => s + c.docsTotal, 0);
      const docsPct = totalDocsTotal > 0 ? Math.round((totalDocsValides / totalDocsTotal) * 100) : 0;
      const totalActionsCompletes = COLLABORATEURS.reduce((s, c) => s + c.actionsCompletes, 0);
      const totalActionsTotal = COLLABORATEURS.reduce((s, c) => s + c.actionsTotal, 0);
      const actionsPct = totalActionsTotal > 0 ? Math.round((totalActionsCompletes / totalActionsTotal) * 100) : 0;

      const kpiCards = [
        { label: t('kpi.total_collabs'), value: totalCollab, icon: Users, color: C.pink, bg: C.pinkBg },
        { label: t('kpi.ongoing'), value: enCours, icon: Play, color: C.blue, bg: C.blueLight },
        { label: t('kpi.late'), value: enRetard, icon: AlertTriangle, color: C.red, bg: C.redLight },
        { label: t('kpi.completed'), value: termines, icon: CheckCircle, color: C.green, bg: C.greenLight },
      ];

      const pieData = [
        { name: t('kpi.ongoing'), value: enCours },
        { name: t('kpi.late'), value: enRetard },
        { name: t('status.completed'), value: termines },
      ];
      const pieColors = [C.blue, C.red, C.green];

      // SVG circular progress
      const circleR = 70;
      const circleCirc = 2 * Math.PI * circleR;
      const circleDash = (avgProgression / 100) * circleCirc;

      // Recent collaborateurs sorted by dateDebut desc
      const recentCollabs = [...COLLABORATEURS].sort((a, b) => {
        const parseD = (d: string) => { const p = d.split("/"); return new Date(`${p[2]}-${p[1]}-${p[0]}`).getTime(); };
        return parseD(b.dateDebut) - parseD(a.dateDebut);
      }).slice(0, 5);

      // Active parcours
      const activeParcours = PARCOURS_TEMPLATES.filter(p => p.status === "actif");

      // Upcoming actions (first 5 sorted by delaiRelatif)
      const upcomingActions = [...ACTION_TEMPLATES]
        .sort((a, b) => {
          const toNum = (d: string) => { const m = d.match(/J([+-]\d+)/); return m ? parseInt(m[1]) : 0; };
          return toNum(a.delaiRelatif) - toNum(b.delaiRelatif);
        })
        .slice(0, 5);

      const sectionTitle: React.CSSProperties = { fontSize: 15, fontWeight: 600, margin: "0 0 16px", color: C.text };

      return (
        <div style={{ flex: 1, padding: "24px 32px", overflow: "auto", fontFamily: font }}>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0, color: C.text }}>{t('dashboard.title')}</h1>
              <div style={{ fontSize: 12, color: C.textMuted, marginTop: 4 }}>{totalCollab} {t('dash.collabs_count')} &middot; {activeParcours.length} {t('dash.active_paths_count')} &middot; {ACTION_TEMPLATES.length} {t('dash.configured_actions')}</div>
            </div>
            <div style={{ fontSize: 11, color: C.textLight, background: C.bg, padding: "6px 14px", borderRadius: 8 }}>{t('kpi.realtime')}</div>
          </div>

          {/* ── Setup wizard banner ── */}
          {!isDemo && setupCompleted.length < SETUP_STEPS.length && (() => {
            const totalReq = SETUP_STEPS.filter(s => s.required).length;
            const doneReq = SETUP_STEPS.filter(s => s.required && setupCompleted.includes(s.id)).length;
            const pct = Math.round((setupCompleted.length / SETUP_STEPS.length) * 100);
            return (
              <div className="iz-card" style={{ ...sCard, padding: 0, overflow: "hidden", marginBottom: 20, border: `1px solid ${C.pink}30` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 20, padding: "16px 24px" }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: C.pinkBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Rocket size={22} color={C.pink} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 4 }}>Configuration de votre espace — {pct}%</div>
                    <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 8 }}>{doneReq}/{totalReq} étapes obligatoires · {setupCompleted.length}/{SETUP_STEPS.length} au total</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ flex: 1, height: 6, borderRadius: 3, background: C.bg, overflow: "hidden" }}>
                        <div style={{ width: `${pct}%`, height: "100%", background: `linear-gradient(90deg, ${C.pink}, #E91E8C)`, borderRadius: 3, transition: "width .3s ease" }} />
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 600, color: C.pink }}>{pct}%</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6, flexShrink: 0 }}>
                    <button onClick={() => { setShowSetupWizard(true); setSetupStep(SETUP_STEPS.findIndex(s => !setupCompleted.includes(s.id)) || 0); }} className="iz-btn-pink" style={{ ...sBtn("pink"), fontSize: 12, padding: "8px 20px", display: "flex", alignItems: "center", gap: 6 }}>
                      <Sparkles size={13} /> {setupCompleted.length === 0 ? "Démarrer" : "Reprendre"}
                    </button>
                    {doneReq >= totalReq && (
                      <button onClick={() => { finishSetupWizard(); }} className="iz-btn-outline" style={{ ...sBtn("outline"), fontSize: 10, padding: "4px 12px", color: C.textMuted }}>Masquer</button>
                    )}
                  </div>
                </div>
                {/* Step dots */}
                <div style={{ display: "flex", gap: 0, borderTop: `1px solid ${C.border}` }}>
                  {SETUP_STEPS.map((step, i) => {
                    const done = setupCompleted.includes(step.id);
                    return (
                      <button key={step.id} onClick={() => { setShowSetupWizard(true); setSetupStep(i); }} title={step.title} style={{
                        flex: 1, padding: "8px 0", border: "none", cursor: "pointer", fontFamily: font, fontSize: 10,
                        background: done ? `${C.green}15` : "transparent", color: done ? C.green : C.textMuted,
                        fontWeight: done ? 600 : 400, display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
                        borderRight: i < SETUP_STEPS.length - 1 ? `1px solid ${C.border}` : "none", transition: "all .15s",
                      }}>
                        {done ? <Check size={10} /> : <span style={{ width: 6, height: 6, borderRadius: "50%", background: step.required ? C.pink : C.border, flexShrink: 0 }} />}
                        {step.title}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {/* ── Row 1: KPI Cards ── */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
            {kpiCards.map((s, i) => (
              <div key={i} className="iz-card iz-fade-up" style={{ ...sCard, display: "flex", alignItems: "center", gap: 16, animationDelay: `${i * .05}s` }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center" }}><s.icon size={22} color={s.color} /></div>
                <div>
                  <div style={{ fontSize: 28, fontWeight: 700, color: s.color, lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: 12, color: C.textLight, marginTop: 2 }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* ── Row 2: Charts ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
            {/* Left: Progression moyenne (SVG circular) */}
            <div className="iz-card iz-fade-up iz-stagger-2" style={{ ...sCard, display: "flex", flexDirection: "column", alignItems: "center" }}>
              <h3 style={sectionTitle}>{t('kpi.avg_progress')}</h3>
              <div style={{ position: "relative", width: 180, height: 180, margin: "8px 0 12px" }}>
                <svg width="180" height="180" viewBox="0 0 180 180">
                  <circle cx="90" cy="90" r={circleR} fill="none" stroke={C.border} strokeWidth="12" />
                  <circle cx="90" cy="90" r={circleR} fill="none" stroke={C.pink} strokeWidth="12" strokeDasharray={`${circleDash} ${circleCirc}`} strokeLinecap="round" transform="rotate(-90 90 90)" style={{ transition: "stroke-dasharray .6s ease" }} />
                </svg>
                <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ fontSize: 36, fontWeight: 700, color: C.text, lineHeight: 1 }}>{avgProgression}%</div>
                  <div style={{ fontSize: 11, color: C.textMuted, marginTop: 4 }}>{t('dash.average')}</div>
                </div>
              </div>
              <div style={{ fontSize: 12, color: C.textLight, textAlign: "center" }}>{totalCollab} {t('dash.collabs_tracked')}</div>
            </div>

            {/* Right: Répartition par statut (PieChart) */}
            <div className="iz-card iz-fade-up iz-stagger-3" style={sCard}>
              <h3 style={sectionTitle}>{t('dash.status_breakdown')}</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={78} dataKey="value" paddingAngle={3}>
                    {pieData.map((_, i) => <Cell key={i} fill={pieColors[i]} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 8 }}>
                {pieData.map((d, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: pieColors[i] }} />
                    <span style={{ color: C.textLight }}>{d.name}</span>
                    <span style={{ fontWeight: 700, color: C.text }}>{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Row 3: Completion rates ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
            {/* Documents completion */}
            <div className="iz-card iz-fade-up iz-stagger-4" style={sCard}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <h3 style={{ ...sectionTitle, margin: 0, display: "flex", alignItems: "center", gap: 8 }}><FileText size={16} color={C.pink} /> {t('dash.docs_rate')}</h3>
                <span style={{ fontSize: 20, fontWeight: 700, color: docsPct >= 75 ? C.green : docsPct >= 50 ? C.amber : C.red }}>{docsPct}%</span>
              </div>
              <div style={{ height: 10, background: C.bg, borderRadius: 5, overflow: "hidden", marginBottom: 8 }}>
                <div style={{ height: "100%", width: `${docsPct}%`, background: docsPct >= 75 ? C.green : docsPct >= 50 ? C.amber : C.red, borderRadius: 5, transition: "width .5s ease" }} />
              </div>
              <div style={{ fontSize: 12, color: C.textLight }}>{totalDocsValides} {t('dash.validated_of')} {totalDocsTotal} {t('table.documents')}</div>
            </div>

            {/* Actions completion */}
            <div className="iz-card iz-fade-up iz-stagger-5" style={sCard}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <h3 style={{ ...sectionTitle, margin: 0, display: "flex", alignItems: "center", gap: 8 }}><ListChecks size={16} color={C.blue} /> {t('dash.actions_rate')}</h3>
                <span style={{ fontSize: 20, fontWeight: 700, color: actionsPct >= 75 ? C.green : actionsPct >= 50 ? C.amber : C.red }}>{actionsPct}%</span>
              </div>
              <div style={{ height: 10, background: C.bg, borderRadius: 5, overflow: "hidden", marginBottom: 8 }}>
                <div style={{ height: "100%", width: `${actionsPct}%`, background: actionsPct >= 75 ? C.green : actionsPct >= 50 ? C.amber : C.red, borderRadius: 5, transition: "width .5s ease" }} />
              </div>
              <div style={{ fontSize: 12, color: C.textLight }}>{totalActionsCompletes} {t('dash.completed_of')} {totalActionsTotal} {t('table.actions')}</div>
            </div>
          </div>

          {/* ── Row 4: Recent collaborateurs table ── */}
          <div className="iz-card iz-fade-up iz-stagger-6" style={{ ...sCard, marginBottom: 24 }}>
            <h3 style={sectionTitle}>{t('dashboard.recent_collabs')}</h3>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1.2fr 1fr 1fr 0.8fr", gap: 0, padding: "8px 12px", background: C.bg, borderRadius: 8, fontSize: 11, fontWeight: 600, color: C.textLight, textTransform: "uppercase", letterSpacing: .3, marginBottom: 4 }}>
              <span>{t('table.collaborateur')}</span><span>{t('table.poste')}</span><span>{t('table.site')}</span><span>{t('table.progression')}</span><span>{t('table.statut')}</span>
            </div>
            {recentCollabs.map(c => (
              <div key={c.id} onClick={() => { setAdminPage("admin_suivi"); setCollabProfileId(c.id); }}
                style={{ display: "grid", gridTemplateColumns: "2fr 1.2fr 1fr 1fr 0.8fr", gap: 0, padding: "12px 12px", borderBottom: `1px solid ${C.border}`, cursor: "pointer", alignItems: "center", transition: "background .1s" }}
                onMouseEnter={e => (e.currentTarget.style.background = C.bg)}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 34, height: 34, borderRadius: "50%", background: c.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, color: C.white, flexShrink: 0 }}>{c.initials}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: C.text }}>{c.prenom} {c.nom}</div>
                    <div style={{ fontSize: 10, color: C.textMuted }}>{c.dateDebut}</div>
                  </div>
                </div>
                <div style={{ fontSize: 12, color: C.textLight }}>{c.poste}</div>
                <div style={{ fontSize: 12, color: C.textLight }}>{c.site}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ flex: 1, height: 6, background: C.bg, borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${c.progression}%`, background: c.status === "termine" ? C.green : c.status === "en_retard" ? C.red : C.blue, borderRadius: 3 }} />
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 600, color: C.textMuted, minWidth: 28, textAlign: "right" }}>{c.progression}%</span>
                </div>
                <span style={{ padding: "3px 10px", borderRadius: 6, fontSize: 10, fontWeight: 600, justifySelf: "start", background: c.status === "termine" ? C.greenLight : c.status === "en_retard" ? C.redLight : C.blueLight, color: c.status === "termine" ? C.green : c.status === "en_retard" ? C.red : C.blue }}>
                  {c.status === "termine" ? t('status.completed') : c.status === "en_retard" ? t('kpi.late') : t('kpi.ongoing')}
                </span>
              </div>
            ))}
          </div>

          {/* ── Row 5: Parcours actifs + Actions à venir ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            {/* Parcours actifs */}
            <div className="iz-card iz-fade-up iz-stagger-7" style={sCard}>
              <h3 style={{ ...sectionTitle, display: "flex", alignItems: "center", gap: 8 }}><Route size={16} color={C.purple} /> {t('dash.active_parcours')}</h3>
              {activeParcours.map(p => (
                <div key={p.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${C.border}` }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: C.text }}>{p.nom}</div>
                    <div style={{ fontSize: 11, color: C.textMuted }}>{p.actionsCount} actions &middot; {p.docsCount} documents &middot; {p.phases.length} phases</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 18, fontWeight: 700, color: C.pink }}>{p.collaborateursActifs}</span>
                    <span style={{ fontSize: 10, color: C.textMuted }}>collabs</span>
                  </div>
                </div>
              ))}
              {activeParcours.length === 0 && <div style={{ padding: 20, textAlign: "center", color: C.textMuted, fontSize: 12 }}>Aucun parcours actif</div>}
            </div>

            {/* Actions à venir */}
            <div className="iz-card iz-fade-up iz-stagger-8" style={sCard}>
              <h3 style={{ ...sectionTitle, display: "flex", alignItems: "center", gap: 8 }}><CalendarClock size={16} color={C.amber} /> {t('dash.upcoming_actions')}</h3>
              {upcomingActions.map(a => (
                <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: `1px solid ${C.border}` }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: a.obligatoire ? C.pinkBg : C.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {a.obligatoire ? <AlertTriangle size={14} color={C.pink} /> : <Clock size={14} color={C.textMuted} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: C.text }}>{a.titre}</div>
                    <div style={{ fontSize: 11, color: C.textMuted }}>{a.parcours} &middot; {a.phase}</div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: C.blue }}>{a.delaiRelatif}</span>
                    {a.obligatoire && <span style={{ fontSize: 9, color: C.red, fontWeight: 600 }}>{t('dash.obligatory')}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    };
  
    // ─── SUIVI COLLABORATEURS ─────────────────────────────────
    const renderSuivi = () => {
      const filtered = COLLABORATEURS
        .filter(c => suiviFilter === "all" || c.status === suiviFilter)
        .filter(c => !suiviSearch || `${c.prenom} ${c.nom} ${c.email || ""} ${c.poste}`.toLowerCase().includes(suiviSearch.toLowerCase()));
      return (
      <div style={{ flex: 1, padding: "24px 32px", overflow: "auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <h1 style={{ fontSize: 22, fontWeight: 600, margin: 0 }}>{t('collab.tracking_title')}</h1>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => { setCollabPanelData({ prenom: "", nom: "", email: "", poste: "", site: "", departement: "", dateDebut: "" }); setCollabPanelMode("create"); }} className="iz-btn-pink" style={{ ...sBtn("pink"), display: "flex", alignItems: "center", gap: 6 }}><UserPlus size={16} /> {t('collab.new')}</button>
          </div>
        </div>

        {/* Search + filter bar (like screenshot) */}
        <div className="iz-card" style={{ ...sCard, marginBottom: 16, display: "flex", alignItems: "center", gap: 12, padding: "10px 16px" }}>
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, background: C.bg, borderRadius: 8, padding: "8px 12px" }}>
            <Search size={16} color={C.textLight} />
            <input value={suiviSearch} onChange={e => setSuiviSearch(e.target.value)} placeholder={t('common.search')} style={{ border: "none", outline: "none", background: "transparent", flex: 1, fontSize: 13, fontFamily: font, color: C.text }} />
          </div>
          <div style={{ display: "flex", gap: 4, padding: 3, background: C.bg, borderRadius: 8 }}>
            {([["all", `Tous (${COLLABORATEURS.length})`], ["en_cours", "En cours"], ["en_retard", "En retard"], ["termine", "Terminé"]] as const).map(([key, label]) => (
              <button key={key} onClick={() => setSuiviFilter(key)} style={{
                padding: "6px 12px", borderRadius: 6, fontSize: 11, fontWeight: suiviFilter === key ? 600 : 400, border: "none", cursor: "pointer", fontFamily: font,
                background: suiviFilter === key ? C.pink : "transparent", color: suiviFilter === key ? C.white : C.textMuted, transition: "all .15s",
              }}>{label}</button>
            ))}
          </div>
        </div>

        {/* Invite bar */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", borderBottom: `1px solid ${C.border}`, cursor: "pointer" }}
          onClick={() => { setCollabPanelData({ prenom: "", nom: "", email: "", poste: "", site: "", departement: "", dateDebut: "" }); setCollabPanelMode("create"); }}>
          <div style={{ width: 28, height: 28, borderRadius: "50%", border: `2px dashed ${C.pink}`, display: "flex", alignItems: "center", justifyContent: "center" }}><Plus size={14} color={C.pink} /></div>
          <span style={{ fontSize: 13, color: C.pink, fontWeight: 500 }}>{t('suivi.invite_people')}</span>
        </div>

        {/* Table header */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1.5fr 1fr 1fr 0.8fr 0.5fr", gap: 0, padding: "10px 16px", background: C.bg, borderBottom: `1px solid ${C.border}`, fontSize: 11, fontWeight: 600, color: C.textLight, textTransform: "uppercase", letterSpacing: .3 }}>
          <span>{t('collab.name')}</span><span>E-mail</span><span>{t('collab.status')}</span><span>{t('collab.start_date')}</span><span>{t('collab.progression')}</span><span></span>
        </div>

        {/* Rows */}
        {filtered.map(c => (
          <div key={c.id} onClick={() => { setCollabProfileId(c.id); setCollabProfileTab("apercu"); }}
            style={{ display: "grid", gridTemplateColumns: "2fr 1.5fr 1fr 1fr 0.8fr 0.5fr", gap: 0, padding: "14px 16px", borderBottom: `1px solid ${C.border}`, cursor: "pointer", alignItems: "center", transition: "all .1s" }}
            className="iz-sidebar-item">
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: c.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600, color: C.white, flexShrink: 0, position: "relative" }}>
                {c.initials}
                <div style={{ position: "absolute", bottom: -1, right: -1, width: 10, height: 10, borderRadius: "50%", background: c.status === "termine" ? C.green : c.status === "en_retard" ? C.red : C.blue, border: `2px solid ${C.white}` }} />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500, color: C.text }}>{c.prenom} {c.nom}</div>
                <div style={{ fontSize: 11, color: C.textMuted }}>{c.poste} · {c.site}</div>
              </div>
            </div>
            <div style={{ fontSize: 13, color: C.textLight }}>{c.email || `${c.prenom.toLowerCase()}.${c.nom.toLowerCase()}@illizeo.com`}</div>
            <span style={{ padding: "3px 10px", borderRadius: 6, fontSize: 10, fontWeight: 600, background: c.status === "termine" ? C.greenLight : c.status === "en_retard" ? C.redLight : C.blueLight, color: c.status === "termine" ? C.green : c.status === "en_retard" ? C.red : C.blue, justifySelf: "start" }}>{c.status === "termine" ? t('status.completed') : c.status === "en_retard" ? t('status.late') : t('status.ongoing')}</span>
            <div style={{ fontSize: 12, color: C.textLight }}>{c.dateDebut}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ flex: 1, height: 6, background: C.bg, borderRadius: 3, overflow: "hidden" }}><div style={{ height: "100%", width: `${c.progression}%`, background: c.status === "termine" ? C.green : c.status === "en_retard" ? C.red : C.blue, borderRadius: 3 }} /></div>
              <span style={{ fontSize: 10, fontWeight: 600, color: C.textMuted }}>{c.progression}%</span>
            </div>
            <div style={{ position: "relative" }}>
              <button onClick={e => { e.stopPropagation(); setCollabMenuId(collabMenuId === c.id ? null : c.id); }} style={{ background: collabMenuId === c.id ? C.bg : "none", border: "none", cursor: "pointer", color: C.textMuted, padding: 4, borderRadius: 6, display: "flex", alignItems: "center" }}><MoreHorizontal size={16} /></button>
              {collabMenuId === c.id && (
                <div style={{ position: "absolute", right: 0, top: "100%", marginTop: 4, background: C.white, borderRadius: 10, boxShadow: "0 4px 24px rgba(0,0,0,.12)", border: `1px solid ${C.border}`, minWidth: 220, zIndex: 100, padding: "6px 0", fontFamily: font }}
                  onClick={e => e.stopPropagation()}>
                  {[
                    { icon: <Eye size={14} />, label: t('common.edit'), action: () => { setCollabPanelData({ id: c.id, prenom: c.prenom, nom: c.nom, email: c.email || "", poste: c.poste, site: c.site, departement: c.departement, dateDebut: c.dateDebut }); setCollabPanelMode("edit"); } },
                    { icon: <Route size={14} />, label: t('menu.assign_journey'), action: () => { setCollabPanelData({ id: c.id, prenom: c.prenom, nom: c.nom, email: c.email || "", poste: c.poste, site: c.site, departement: c.departement, dateDebut: c.dateDebut }); setCollabPanelMode("edit"); } },
                    { icon: <Users size={14} />, label: t('menu.assign_team'), action: () => { setCollabPanelData({ id: c.id, prenom: c.prenom, nom: c.nom, email: c.email || "", poste: c.poste, site: c.site, departement: c.departement, dateDebut: c.dateDebut }); setCollabPanelMode("edit"); } },
                    { icon: <FileSignature size={14} />, label: t('menu.send_contract'), action: () => { setCollabPanelData({ id: c.id, prenom: c.prenom, nom: c.nom, email: c.email || "", poste: c.poste, site: c.site, departement: c.departement, dateDebut: c.dateDebut }); setCollabPanelMode("edit"); } },
                    { icon: <Send size={14} />, label: t('menu.send_message'), action: () => { setAdminPage("admin_messagerie"); } },
                    { icon: <RefreshCw size={14} />, label: t('menu.remind'), action: () => { addToast_admin(`Relance envoyée à ${c.prenom} ${c.nom}`); } },
                    { divider: true },
                    { icon: <UserMinus size={14} />, label: t('menu.deactivate'), action: () => { addToast_admin(`${c.prenom} ${c.nom} désactivé`); }, danger: false },
                    { icon: <Trash2 size={14} />, label: t('menu.delete'), action: () => { showConfirm(`Supprimer ${c.prenom} ${c.nom} ?`, () => { apiDeleteCollab(c.id).catch(() => {}); addToast_admin(`${c.prenom} ${c.nom} supprimé`); }); }, danger: true },
                  ].map((item, i) => 'divider' in item && item.divider ? (
                    <div key={i} style={{ height: 1, background: C.border, margin: "4px 0" }} />
                  ) : (
                    <button key={i} onClick={() => { setCollabMenuId(null); (item as any).action(); }}
                      style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "8px 14px", background: "none", border: "none", cursor: "pointer", fontSize: 13, fontFamily: font, color: (item as any).danger ? C.red : C.text, transition: "background .1s" }}
                      onMouseEnter={e => (e.currentTarget.style.background = C.bg)}
                      onMouseLeave={e => (e.currentTarget.style.background = "none")}>
                      <span style={{ color: (item as any).danger ? C.red : C.textMuted, display: "flex" }}>{(item as any).icon}</span>
                      {(item as any).label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div style={{ padding: "40px 20px", textAlign: "center", color: C.textMuted, fontSize: 13 }}>{t('suivi.no_collab_found')}</div>}
      </div>
      );
    };
  
    // ─── COLLABORATEUR PROFILE VIEW ──────────────────────────────
    const renderCollabProfile = () => {
      const collab = COLLABORATEURS.find(c => c.id === collabProfileId);
      if (!collab) return null;
      // Load real documents for this collaborateur
      if (collabProfileId && realDocs.filter(d => d.collaborateur_id === collabProfileId).length === 0) {
        getDocuments({ collaborateur_id: collabProfileId }).then(docs => setRealDocs(prev => [...prev.filter(d => d.collaborateur_id !== collabProfileId), ...docs])).catch(() => {});
      }
      const collabActions = ACTION_TEMPLATES.filter(a => a.parcours === "Onboarding Standard");
      const profileTabs: { key: typeof collabProfileTab; label: string; icon: JSX.Element }[] = [
        { key: "apercu", label: t('tab.overview'), icon: <LayoutDashboard size={14} /> },
        { key: "infos", label: t('tab.informations'), icon: <ClipboardList size={14} /> },
        { key: "dossier", label: t('suivi.dossier_sirh'), icon: <FileCheck2 size={14} /> },
        { key: "documents", label: t('tab.documents'), icon: <FileText size={14} /> },
        { key: "actions", label: t('tab.actions'), icon: <ListChecks size={14} /> },
        { key: "equipe", label: t('tab.team'), icon: <Users size={14} /> },
        { key: "messages", label: t('tab.messages'), icon: <MessageCircle size={14} /> },
      ];
      const statusLabel = collab.status === "termine" ? t('status.completed') : collab.status === "en_retard" ? t('kpi.late') : t('kpi.ongoing');
      const statusColor = collab.status === "termine" ? C.green : collab.status === "en_retard" ? C.red : C.blue;
      const statusBg = collab.status === "termine" ? C.greenLight : collab.status === "en_retard" ? C.redLight : C.blueLight;

      return (
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 50, background: C.white, overflow: "auto", fontFamily: font }}>
          {/* ── Header ── */}
          <div style={{ padding: "24px 32px", borderBottom: `1px solid ${C.border}`, background: C.bg }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
              <button onClick={() => setCollabProfileId(null)} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 12px", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 500, color: C.text, fontFamily: font }}><ChevronLeft size={16} /> {t('misc.return')}</button>
              <button onClick={() => { setCollabPanelData({ id: collab.id, prenom: collab.prenom, nom: collab.nom, email: collab.email || "", poste: collab.poste, site: collab.site, departement: collab.departement, dateDebut: collab.dateDebut }); setCollabPanelMode("edit"); }} style={{ ...sBtn("pink"), padding: "8px 20px", fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}><FilePen size={14} /> Modifier</button>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: collab.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 700, color: C.white, flexShrink: 0 }}>{collab.initials}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
                  <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, color: C.text }}>{collab.prenom} {collab.nom}</h1>
                  <span style={{ padding: "4px 12px", borderRadius: 6, fontSize: 11, fontWeight: 600, background: statusBg, color: statusColor }}>{statusLabel}</span>
                </div>
                <div style={{ fontSize: 13, color: C.textLight, display: "flex", alignItems: "center", gap: 16 }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}><ClipboardList size={13} /> {collab.poste}</span>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}><MapPin size={13} /> {collab.site}</span>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Building2 size={13} /> {collab.departement}</span>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Calendar size={13} /> {collab.dateDebut}</span>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ position: "relative", width: 56, height: 56 }}>
                    <svg width="56" height="56" viewBox="0 0 56 56"><circle cx="28" cy="28" r="24" fill="none" stroke={C.border} strokeWidth="5" /><circle cx="28" cy="28" r="24" fill="none" stroke={statusColor} strokeWidth="5" strokeDasharray={`${collab.progression * 1.508} 150.8`} strokeLinecap="round" transform="rotate(-90 28 28)" /></svg>
                    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: C.text }}>{collab.progression}%</div>
                  </div>
                  <div style={{ fontSize: 10, color: C.textMuted, marginTop: 4 }}>Progression</div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Tabs ── */}
          <div style={{ display: "flex", gap: 0, borderBottom: `1px solid ${C.border}`, padding: "0 32px", background: C.white }}>
            {profileTabs.map(tab => (
              <button key={tab.key} onClick={() => setCollabProfileTab(tab.key)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "12px 20px", fontSize: 13, fontWeight: collabProfileTab === tab.key ? 600 : 400, color: collabProfileTab === tab.key ? C.pink : C.textLight, background: "none", border: "none", borderBottom: collabProfileTab === tab.key ? `2px solid ${C.pink}` : "2px solid transparent", cursor: "pointer", fontFamily: font, transition: "all .15s" }}>{tab.icon} {tab.label}</button>
            ))}
          </div>

          {/* ── Tab Content ── */}
          <div style={{ padding: "24px 32px" }}>

            {/* ── Aperçu ── */}
            {collabProfileTab === "apercu" && (<>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>
                <div style={{ ...sCard }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: C.textMuted, textTransform: "uppercase", marginBottom: 12 }}>Informations clés</div>
                  {[
                    { label: t('info.start_date'), value: collab.dateDebut, icon: <Calendar size={14} /> },
                    { label: t('info.current_phase'), value: collab.phase, icon: <Route size={14} /> },
                    { label: "Site", value: collab.site, icon: <MapPin size={14} /> },
                    { label: "Département", value: collab.departement, icon: <Building2 size={14} /> },
                    { label: "Poste", value: collab.poste, icon: <ClipboardList size={14} /> },
                  ].map((item, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i < 4 ? `1px solid ${C.border}` : "none" }}>
                      <div style={{ color: C.pink }}>{item.icon}</div>
                      <div>
                        <div style={{ fontSize: 10, color: C.textMuted }}>{item.label}</div>
                        <div style={{ fontSize: 13, fontWeight: 500, color: C.text }}>{item.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ ...sCard }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: C.textMuted, textTransform: "uppercase", marginBottom: 12 }}>Progression</div>
                  <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
                    <div style={{ position: "relative", width: 120, height: 120 }}>
                      <svg width="120" height="120" viewBox="0 0 120 120"><circle cx="60" cy="60" r="52" fill="none" stroke={C.border} strokeWidth="10" /><circle cx="60" cy="60" r="52" fill="none" stroke={statusColor} strokeWidth="10" strokeDasharray={`${collab.progression * 3.267} 326.7`} strokeLinecap="round" transform="rotate(-90 60 60)" /></svg>
                      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                        <div style={{ fontSize: 28, fontWeight: 700, color: C.text }}>{collab.progression}%</div>
                        <div style={{ fontSize: 10, color: C.textMuted }}>complété</div>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 12 }}>
                    <div style={{ flex: 1, padding: 12, background: C.bg, borderRadius: 8, textAlign: "center" }}>
                      <div style={{ fontSize: 18, fontWeight: 700, color: C.green }}>{collab.docsValides}</div>
                      <div style={{ fontSize: 10, color: C.textMuted }}>Docs validés / {collab.docsTotal}</div>
                    </div>
                    <div style={{ flex: 1, padding: 12, background: C.bg, borderRadius: 8, textAlign: "center" }}>
                      <div style={{ fontSize: 18, fontWeight: 700, color: C.blue }}>{collab.actionsCompletes}</div>
                      <div style={{ fontSize: 10, color: C.textMuted }}>Actions / {collab.actionsTotal}</div>
                    </div>
                  </div>
                </div>
                <div style={{ ...sCard }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: C.textMuted, textTransform: "uppercase", marginBottom: 12 }}>Parcours assigné</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", background: C.pinkBg, borderRadius: 10, marginBottom: 16 }}>
                    <Route size={18} color={C.pink} />
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>Onboarding Standard</div>
                      <div style={{ fontSize: 11, color: C.textLight }}>{collabActions.length} actions · 4 phases</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: C.textMuted, textTransform: "uppercase", marginBottom: 8 }}>Équipe d'accompagnement</div>
                  {EQUIPE_ROLES.filter(r => r.obligatoire).map((role, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", borderBottom: i < 2 ? `1px solid ${C.border}` : "none" }}>
                      <UserCheck size={13} color={C.textMuted} />
                      <div style={{ fontSize: 12, color: C.text }}>{role.role}</div>
                      <div style={{ fontSize: 11, color: C.textMuted, marginLeft: "auto" }}>{role.description}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Custom fields from fieldConfig */}
              {(() => {
                const activeFields = fieldConfig.filter(f => f.actif);
                const fieldSections = [
                  { key: "personal", label: "Informations personnelles", icon: Users, color: "#C2185B" },
                  { key: "contract", label: "Informations contractuelles", icon: FileSignature, color: "#1A73E8" },
                  { key: "job", label: "Job Information", icon: ClipboardList, color: "#E65100" },
                  { key: "position", label: "Position Information", icon: Navigation, color: "#00897B" },
                  { key: "org", label: "Informations organisationnelles", icon: Building2, color: "#7B5EA7" },
                ];
                const collabData = (collab as any).custom_fields || {};
                const sectionsWithFields = fieldSections.filter(s => activeFields.some(f => f.section === s.key));
                if (sectionsWithFields.length === 0) return null;
                return (
                  <div style={{ display: "grid", gridTemplateColumns: sectionsWithFields.length >= 3 ? "1fr 1fr 1fr" : sectionsWithFields.length === 2 ? "1fr 1fr" : "1fr", gap: 20, marginTop: 20 }}>
                    {sectionsWithFields.map(section => {
                      const fields = activeFields.filter(f => f.section === section.key);
                      return (
                        <div key={section.key} style={{ ...sCard }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                            <div style={{ width: 24, height: 24, borderRadius: 6, background: `${section.color}15`, display: "flex", alignItems: "center", justifyContent: "center" }}><section.icon size={12} color={section.color} /></div>
                            <div style={{ fontSize: 11, fontWeight: 600, color: C.textMuted, textTransform: "uppercase" }}>{section.label}</div>
                          </div>
                          {fields.map((fc, i) => {
                            const isCustom = fc.field_key.startsWith("custom_");
                            const val = isCustom ? (collabData[fc.field_key] || "—") : ((collab as any)[fc.field_key] || "—");
                            const displayVal = fc.field_type === "boolean" ? (val === "true" ? "Oui" : val === "false" ? "Non" : "—") : (val || "—");
                            return (
                              <div key={fc.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i < fields.length - 1 ? `1px solid ${C.border}` : "none" }}>
                                <div>
                                  <div style={{ fontSize: 10, color: C.textMuted }}>{lang === "en" && fc.label_en ? fc.label_en : fc.label}</div>
                                  <div style={{ fontSize: 13, fontWeight: 500, color: C.text }}>{displayVal}</div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </>)}

            {/* ── Informations (custom fields) ── */}
            {collabProfileTab === "infos" && (() => {
              const activeFields = fieldConfig.filter(f => f.actif);
              const fieldSections = [
                { key: "personal", label: "Informations personnelles", icon: Users, color: "#C2185B" },
                { key: "contract", label: "Informations contractuelles", icon: FileSignature, color: "#1A73E8" },
                { key: "org", label: "Informations organisationnelles", icon: Building2, color: "#7B5EA7" },
              ];
              const collabData = (collab as any).custom_fields || {};
              return (
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  {/* Edit button */}
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <button onClick={() => { setCollabPanelData({ id: collab.id, prenom: collab.prenom, nom: collab.nom, email: collab.email || "", poste: collab.poste, site: collab.site, departement: collab.departement, dateDebut: collab.dateDebut, custom_fields: (collab as any).custom_fields || {} }); setCollabPanelMode("edit"); }} className="iz-btn-pink" style={{ ...sBtn("pink"), fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}><FilePen size={13} /> Modifier les informations</button>
                  </div>
                  {/* Base info card */}
                  <div style={{ ...sCard }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: C.textMuted, textTransform: "uppercase", marginBottom: 12 }}>Informations de base</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                      {[
                        { label: "Prénom", value: collab.prenom },
                        { label: "Nom", value: collab.nom },
                        { label: "Email", value: collab.email || "—" },
                        { label: "Poste", value: collab.poste },
                        { label: "Site", value: collab.site },
                        { label: "Département", value: collab.departement },
                        { label: "Date de début", value: collab.dateDebut },
                        { label: "Phase", value: collab.phase },
                      ].map((item, i) => (
                        <div key={i}>
                          <div style={{ fontSize: 10, color: C.textMuted, marginBottom: 2 }}>{item.label}</div>
                          <div style={{ fontSize: 13, fontWeight: 500, color: C.text }}>{item.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Custom field sections */}
                  {fieldSections.filter(s => activeFields.some(f => f.section === s.key)).map(section => {
                    const fields = activeFields.filter(f => f.section === section.key);
                    return (
                      <div key={section.key} style={{ ...sCard }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                          <div style={{ width: 28, height: 28, borderRadius: 6, background: `${section.color}15`, display: "flex", alignItems: "center", justifyContent: "center" }}><section.icon size={14} color={section.color} /></div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{section.label}</div>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                          {fields.map(fc => {
                            const isCustom = fc.field_key.startsWith("custom_");
                            const val = isCustom ? (collabData[fc.field_key] || "") : ((collab as any)[fc.field_key] || "");
                            const displayVal = fc.field_type === "boolean" ? (val === "true" ? "Oui" : val === "false" ? "Non" : "—") : (val || "—");
                            return (
                              <div key={fc.id}>
                                <div style={{ fontSize: 10, color: C.textMuted, marginBottom: 2 }}>{lang === "en" && fc.label_en ? fc.label_en : fc.label}{fc.obligatoire ? " *" : ""}</div>
                                <div style={{ fontSize: 13, fontWeight: 500, color: displayVal === "—" ? C.textMuted : C.text }}>{displayVal}</div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                  {activeFields.length === 0 && (
                    <div style={{ textAlign: "center", padding: "40px 20px", color: C.textMuted, fontSize: 13 }}>
                      Aucun champ personnalisé activé. Configurez-les dans <button onClick={() => { setCollabProfileId(null); setAdminPage("admin_fields"); }} style={{ background: "none", border: "none", color: C.pink, cursor: "pointer", fontWeight: 600, fontFamily: font, fontSize: 13 }}>Champs collaborateur</button>.
                    </div>
                  )}
                </div>
              );
            })()}

            {/* ── Dossier SIRH ── */}
            {collabProfileTab === "dossier" && (() => {
              // Load dossier check on tab open
              if (!dossierCheck || dossierCheck.collaborateur_id !== collabProfileId) {
                checkDossier(collabProfileId!).then(setDossierCheck).catch(() => {});
              }
              const DOSSIER_STATUS_META: Record<string, { label: string; color: string; bg: string; icon: any }> = {
                incomplet: { label: "Incomplet", color: C.amber, bg: C.amberLight, icon: AlertTriangle },
                complet: { label: "Complet", color: C.blue, bg: C.blueLight, icon: CheckCircle },
                valide: { label: "Validé", color: C.green, bg: C.greenLight, icon: CheckCircle2 },
                exporte: { label: "Exporté vers SIRH", color: "#7B5EA7", bg: C.purple + "15", icon: Download },
              };
              const SIRH_TARGETS = [
                { id: "manual", label: "Export manuel (JSON)", desc: "Téléchargez les données pour import dans votre SIRH" },
                { id: "successfactors", label: "SAP SuccessFactors", desc: "Envoi automatique vers SuccessFactors" },
                { id: "personio", label: "Personio", desc: "Envoi automatique vers Personio" },
                { id: "bamboohr", label: "BambooHR", desc: "Envoi automatique vers BambooHR" },
                { id: "lucca", label: "Lucca", desc: "Envoi automatique vers Lucca" },
              ];
              const ds = dossierCheck;
              const statusMeta = DOSSIER_STATUS_META[ds?.dossier_status || "incomplet"];
              const StatusIcon = statusMeta.icon;
              const reloadDossier = () => checkDossier(collabProfileId!).then(setDossierCheck).catch(() => {});

              return (
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  {/* Status card */}
                  <div className="iz-card" style={{ ...sCard, padding: "24px", display: "flex", alignItems: "center", gap: 20 }}>
                    <div style={{ width: 64, height: 64, borderRadius: 16, background: statusMeta.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <StatusIcon size={28} color={statusMeta.color} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                        <span style={{ fontSize: 18, fontWeight: 700, color: C.text }}>Dossier {collab.prenom} {collab.nom}</span>
                        <span style={{ padding: "4px 12px", borderRadius: 6, fontSize: 11, fontWeight: 600, background: statusMeta.bg, color: statusMeta.color }}>{statusMeta.label}</span>
                      </div>
                      {ds && (
                        <>
                          <div style={{ fontSize: 13, color: C.textLight, marginBottom: 8 }}>{ds.completed_checks}/{ds.total_checks} vérifications passées — {ds.completion_pct}% complet</div>
                          <div style={{ width: "100%", height: 8, borderRadius: 4, background: C.bg, overflow: "hidden" }}>
                            <div style={{ width: `${ds.completion_pct}%`, height: "100%", borderRadius: 4, background: ds.is_complete ? C.green : C.amber, transition: "width .3s ease" }} />
                          </div>
                        </>
                      )}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {ds?.dossier_status === "incomplet" || ds?.dossier_status === "complet" ? (
                        <button onClick={async () => {
                          try { await validateDossier(collabProfileId!); reloadDossier(); refetchCollaborateurs(); addToast_admin("Dossier validé !"); } catch (e: any) {
                            const msg = e?.message; try { const p = JSON.parse(msg); addToast_admin(p.message || "Dossier incomplet"); } catch { addToast_admin("Dossier incomplet — veuillez compléter les éléments manquants"); }
                          }
                        }} className="iz-btn-pink" style={{ ...sBtn("pink"), fontSize: 12, display: "flex", alignItems: "center", gap: 6, opacity: ds?.is_complete ? 1 : 0.5 }}>
                          <CheckCircle2 size={14} /> Valider le dossier
                        </button>
                      ) : ds?.dossier_status === "valide" ? (
                        <button onClick={async () => {
                          try { const res = await exportDossier(collabProfileId!, "manual"); reloadDossier(); refetchCollaborateurs(); addToast_admin(res.message);
                            // Download payload as JSON
                            const blob = new Blob([JSON.stringify(res.payload, null, 2)], { type: "application/json" });
                            const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = `dossier_${collab.prenom}_${collab.nom}.json`; a.click(); URL.revokeObjectURL(url);
                          } catch { addToast_admin("Erreur export"); }
                        }} className="iz-btn-pink" style={{ ...sBtn("pink"), fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}>
                          <Download size={14} /> Exporter vers SIRH
                        </button>
                      ) : (
                        <span style={{ fontSize: 11, color: "#7B5EA7", fontWeight: 600 }}>Déjà exporté</span>
                      )}
                      {ds?.dossier_status !== "incomplet" && (
                        <button onClick={async () => { await resetDossier(collabProfileId!); reloadDossier(); refetchCollaborateurs(); addToast_admin("Statut réinitialisé"); }} className="iz-btn-outline" style={{ ...sBtn("outline"), fontSize: 10, padding: "4px 10px" }}>Réinitialiser</button>
                      )}
                    </div>
                  </div>

                  {/* Missing items */}
                  {ds && ds.missing.length > 0 && (
                    <div className="iz-card" style={{ ...sCard }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: C.red, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}><AlertTriangle size={16} /> Éléments manquants ({ds.missing.length})</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        {ds.missing.map((m, i) => (
                          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", borderRadius: 8, background: C.redLight }}>
                            <div style={{ width: 24, height: 24, borderRadius: 6, background: C.white, display: "flex", alignItems: "center", justifyContent: "center" }}>
                              {m.type === "field" ? <ClipboardList size={12} color={C.red} /> : m.type === "document" ? <FileText size={12} color={C.red} /> : <PenLine size={12} color={C.red} />}
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: 13, fontWeight: 500, color: C.text }}>{m.label}</div>
                              <div style={{ fontSize: 10, color: C.textMuted }}>{m.type === "field" ? "Champ obligatoire non rempli" : m.type === "document" ? `Document ${m.status || "non validé"}` : "Signature en attente"}</div>
                            </div>
                            {m.type === "field" && (
                              <button onClick={() => { setCollabPanelData({ id: collab.id, prenom: collab.prenom, nom: collab.nom, email: collab.email || "", poste: collab.poste, site: collab.site, departement: collab.departement, dateDebut: collab.dateDebut, custom_fields: (collab as any).custom_fields || {} }); setCollabPanelMode("edit"); }} style={{ ...sBtn("outline"), fontSize: 10, padding: "3px 8px" }}>Compléter</button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* All clear */}
                  {ds && ds.missing.length === 0 && (
                    <div className="iz-card" style={{ ...sCard, textAlign: "center", padding: "32px" }}>
                      <CheckCircle size={40} color={C.green} style={{ marginBottom: 12 }} />
                      <div style={{ fontSize: 16, fontWeight: 600, color: C.green, marginBottom: 4 }}>Dossier complet</div>
                      <div style={{ fontSize: 13, color: C.textMuted }}>Toutes les informations, documents et signatures sont en ordre. Le dossier peut être validé et exporté vers votre SIRH.</div>
                    </div>
                  )}

                  {/* Export targets info */}
                  <div className="iz-card" style={{ ...sCard }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 12 }}>Destinations d'export disponibles</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                      {SIRH_TARGETS.map(t => {
                        const isConnected = t.id === "manual"; // TODO: check integration status
                        return (
                          <div key={t.id} style={{ padding: "12px 16px", borderRadius: 10, border: `1px solid ${isConnected ? C.green : C.border}`, background: isConnected ? `${C.greenLight}` : C.white }}>
                            <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 2 }}>{t.label}</div>
                            <div style={{ fontSize: 11, color: C.textMuted }}>{t.desc}</div>
                            {isConnected && <div style={{ fontSize: 10, color: C.green, fontWeight: 600, marginTop: 4 }}>Disponible</div>}
                            {!isConnected && <div style={{ fontSize: 10, color: C.textMuted, marginTop: 4 }}>Configurer dans Intégrations</div>}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* ── Documents ── */}
            {collabProfileTab === "documents" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {ADMIN_DOC_CATEGORIES.map(cat => (
                  <div key={cat.id} style={{ ...sCard }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                      <FolderOpen size={16} color={C.pink} />
                      <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{cat.titre}</div>
                      <span style={{ fontSize: 11, color: C.textMuted, marginLeft: "auto" }}>{cat.pieces.length} {t('misc.pieces')}</span>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                      {cat.pieces.map((piece, pi) => {
                        // Check if there's a real uploaded document for this piece
                        const realDoc = realDocs.find(d => d.nom === piece.nom && d.collaborateur_id === collab.id);
                        const status = realDoc ? realDoc.status : (pi < collab.docsValides && cat === ADMIN_DOC_CATEGORIES[0] ? "valide" : "manquant");
                        const statusMeta: Record<string, { label: string; color: string; bg: string; icon: any }> = {
                          valide: { label: "Validé", color: C.green, bg: C.greenLight, icon: CheckCircle },
                          soumis: { label: "Soumis — En attente de validation", color: C.amber, bg: C.amberLight, icon: Clock },
                          en_attente: { label: "En attente", color: C.amber, bg: C.amberLight, icon: Clock },
                          refuse: { label: "Refusé", color: C.red, bg: C.redLight, icon: XCircle },
                          manquant: { label: "Non chargé", color: C.textMuted, bg: C.bg, icon: Upload },
                        };
                        const sm = statusMeta[status] || statusMeta.manquant;
                        return (
                          <div key={pi} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: sm.bg + "40", borderRadius: 8, border: `1px solid ${C.border}` }}>
                            <sm.icon size={14} color={sm.color} />
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: 12, fontWeight: 500, color: C.text }}>{piece.nom}</div>
                              <div style={{ fontSize: 10, color: sm.color }}>{sm.label}</div>
                              {realDoc?.fichier_original && <div style={{ fontSize: 9, color: C.textMuted }}>{realDoc.fichier_original}</div>}
                            </div>
                            <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                              {/* Download */}
                              {realDoc && realDoc.fichier_path && (
                                <button onClick={() => window.open(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:8001/api/v1"}/documents/${realDoc.id}/download`, "_blank")} title="Télécharger" style={{ background: C.blueLight, border: "none", borderRadius: 5, padding: 4, cursor: "pointer" }}><Download size={12} color={C.blue} /></button>
                              )}
                              {/* Validate */}
                              {realDoc && (status === "soumis" || status === "en_attente") && (
                                <button onClick={async () => { try { await apiValidateDoc(realDoc.id); getDocuments({ collaborateur_id: collab.id }).then(docs => setRealDocs(prev => [...prev.filter(d => d.collaborateur_id !== collab.id), ...docs])); addToast_admin(`"${piece.nom}" validé`); } catch { addToast_admin(t('toast.error')); } }} title="Valider" style={{ background: C.greenLight, border: "none", borderRadius: 5, padding: 4, cursor: "pointer" }}><CheckCircle size={12} color={C.green} /></button>
                              )}
                              {/* Refuse */}
                              {realDoc && (status === "soumis" || status === "en_attente") && (
                                <button onClick={() => showPrompt("Motif du refus :", async (motif) => { try { await apiRefuseDoc(realDoc.id, motif); getDocuments({ collaborateur_id: collab.id }).then(docs => setRealDocs(prev => [...prev.filter(d => d.collaborateur_id !== collab.id), ...docs])); addToast_admin(`"${piece.nom}" refusé`); } catch { addToast_admin(t('toast.error')); } }, { label: "Motif (optionnel)" })} title="Refuser" style={{ background: C.redLight, border: "none", borderRadius: 5, padding: 4, cursor: "pointer" }}><XCircle size={12} color={C.red} /></button>
                              )}
                              {/* Upload (RH can upload on behalf) */}
                              {(!realDoc || status === "refuse" || status === "manquant") && (
                                <label title="Charger un document" style={{ background: C.pinkBg, border: "none", borderRadius: 5, padding: 4, cursor: "pointer", display: "flex" }}>
                                  <Upload size={12} color={C.pink} />
                                  <input type="file" style={{ display: "none" }} accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;
                                    try {
                                      await uploadDocument(file, collab.id, cat.titre, piece.nom);
                                      getDocuments({ collaborateur_id: collab.id }).then(docs => setRealDocs(prev => [...prev.filter(d => d.collaborateur_id !== collab.id), ...docs]));
                                      addToast_admin(`"${piece.nom}" chargé pour ${collab.prenom} ${collab.nom}`);
                                    } catch { addToast_admin("Erreur d'upload"); }
                                  }} />
                                </label>
                              )}
                              {piece.obligatoire && <span style={{ fontSize: 9, fontWeight: 600, color: C.red, background: C.redLight, padding: "2px 6px", borderRadius: 4 }}>Requis</span>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ── Actions ── */}
            {collabProfileTab === "actions" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {collabActions.map((action, i) => {
                  const isCompleted = i < collab.actionsCompletes;
                  const typeColors: Record<string, { bg: string; color: string }> = {
                    document: { bg: C.pinkBg, color: C.pink }, formation: { bg: C.blueLight, color: C.blue },
                    questionnaire: { bg: C.amberLight, color: C.amber }, signature: { bg: C.greenLight, color: C.green },
                    rdv: { bg: C.purpleBg || C.purple + "15", color: C.purple }, message: { bg: C.blueLight, color: C.blue },
                    lecture: { bg: C.bg, color: C.text }, formulaire: { bg: C.pinkBg, color: C.pink },
                    checklist_it: { bg: C.amberLight, color: C.amber }, visite: { bg: C.greenLight, color: C.green },
                    entretien: { bg: C.blueLight, color: C.blue }, passation: { bg: C.redLight, color: C.red },
                  };
                  const tc = typeColors[action.type] || { bg: C.bg, color: C.text };
                  return (
                    <div key={action.id} style={{ ...sCard, display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", opacity: isCompleted ? 0.6 : 1 }}>
                      <div style={{ width: 28, height: 28, borderRadius: "50%", background: isCompleted ? C.greenLight : C.bg, border: `2px solid ${isCompleted ? C.green : C.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        {isCompleted && <Check size={14} color={C.green} />}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 500, color: C.text }}>{action.titre}</div>
                        <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>{action.phase} · {action.delaiRelatif}{action.dureeEstimee ? ` · ${action.dureeEstimee}` : ""}</div>
                      </div>
                      <span style={{ padding: "3px 10px", borderRadius: 6, fontSize: 10, fontWeight: 600, background: tc.bg, color: tc.color }}>{action.type}</span>
                      {action.obligatoire && <span style={{ fontSize: 9, fontWeight: 600, color: C.red, background: C.redLight, padding: "2px 6px", borderRadius: 4 }}>{t('dash.obligatory')}</span>}
                      <span style={{ padding: "3px 10px", borderRadius: 6, fontSize: 10, fontWeight: 600, background: isCompleted ? C.greenLight : C.amberLight, color: isCompleted ? C.green : C.amber }}>{isCompleted ? "Complété" : "En cours"}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* ── Équipe ── */}
            {collabProfileTab === "equipe" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                {EQUIPE_ROLES.map((role, i) => (
                  <div key={i} style={{ ...sCard, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "28px 20px" }}>
                    <div style={{ width: 52, height: 52, borderRadius: "50%", background: role.obligatoire ? C.pinkBg : C.bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                      <UserCheck size={22} color={role.obligatoire ? C.pink : C.textMuted} />
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 4 }}>{role.role}</div>
                    <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 10 }}>{role.description}</div>
                    {role.obligatoire && <span style={{ fontSize: 9, fontWeight: 600, color: C.pink, background: C.pinkBg, padding: "3px 10px", borderRadius: 6 }}>{t('dash.obligatory')}</span>}
                  </div>
                ))}
              </div>
            )}

            {/* ── Messages ── */}
            {collabProfileTab === "messages" && (
              <div style={{ ...sCard, textAlign: "center", padding: "60px 40px" }}>
                <MessageCircle size={48} color={C.textMuted} style={{ marginBottom: 16 }} />
                <h3 style={{ fontSize: 16, fontWeight: 600, color: C.text, margin: "0 0 8px" }}>Messagerie avec {collab.prenom} {collab.nom}</h3>
                <p style={{ fontSize: 13, color: C.textMuted, margin: "0 0 20px" }}>Ouvrez la messagerie pour échanger directement avec ce collaborateur.</p>
                <button onClick={() => { setCollabProfileId(null); setAdminPage("admin_messagerie"); }} style={{ ...sBtn("pink"), display: "inline-flex", alignItems: "center", gap: 8 }}><Send size={14} /> Ouvrir la messagerie</button>
              </div>
            )}

          </div>
        </div>
      );
    };

    // ─── PARCOURS & ACTIONS ───────────────────────────────────
    const renderParcours = () => {
      const assignLabel = (a: any) => a?.mode === "tous" ? "Tous les collaborateurs" : a?.mode === "individuel" ? "Individuel" : a?.valeurs?.join(", ") || "—";
      const filteredActions = ACTION_TEMPLATES.filter(a => actionFilter === "all" || a.parcours === actionFilter);
      return (
      <div style={{ flex: 1, padding: "24px 32px", overflow: "auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <h1 style={{ fontSize: 22, fontWeight: 600, margin: 0 }}>{t('parcours.title')}</h1>
          <div style={{ display: "flex", gap: 8 }}>
            {parcoursTab === "parcours" && <button onClick={() => { setParcoursPanelData({ nom: "", categorie: "onboarding", status: "brouillon" }); resetTr(); setParcoursPanelMode("create"); }} className="iz-btn-pink" style={{ ...sBtn("pink"), display: "flex", alignItems: "center", gap: 6, fontSize: 13, padding: "8px 20px" }}><Plus size={14} /> {t('parcours.new')}</button>}
            {parcoursTab === "phases" && <button onClick={() => { setPhasePanelData({ nom: "", delaiDebut: "J-7", delaiFin: "J-1", couleur: "#4CAF50", parcours_id: null }); resetTr(); setPhasePanelMode("create"); }} className="iz-btn-pink" style={{ ...sBtn("pink"), display: "flex", alignItems: "center", gap: 6, fontSize: 13, padding: "8px 20px" }}><Plus size={14} /> Nouvelle phase</button>}
            {parcoursTab === "actions" && <button onClick={() => { setActionPanelData({ titre: "", type: "tache", phaseIds: [], delaiRelatif: "J+0", obligatoire: false, description: "", lienExterne: "", dureeEstimee: "", options: {} }); resetTr(); setActionPanelMode("create"); }} className="iz-btn-pink" style={{ ...sBtn("pink"), display: "flex", alignItems: "center", gap: 6, fontSize: 13, padding: "8px 20px" }}><Plus size={14} /> {t('parcours.new_action')}</button>}
            {parcoursTab === "groupes" && <button onClick={() => { setGroupePanelData({ nom: "", description: "", couleur: "#C2185B", critereType: "", critereValeur: "", membres: [] }); resetTr(); setGroupePanelMode("create"); }} className="iz-btn-pink" style={{ ...sBtn("pink"), display: "flex", alignItems: "center", gap: 6, fontSize: 13, padding: "8px 20px" }}><Plus size={14} /> {t('parcours.new_group')}</button>}
          </div>
        </div>
        {/* Tabs */}
        <div style={{ display: "flex", gap: 0, borderBottom: `2px solid ${C.border}`, marginBottom: 20 }}>
          {([
            { id: "parcours" as const, label: t('parcours.tab_parcours'), count: PARCOURS_TEMPLATES.filter(p => parcoursFilter === "all" || p.categorie === parcoursFilter).length },
            { id: "phases" as const, label: t('parcours.tab_phases'), count: 4 },
            { id: "actions" as const, label: t('parcours.tab_actions'), count: filteredActions.length },
            { id: "groupes" as const, label: t('parcours.tab_groups'), count: GROUPES.length },
          ]).map(tab => (
            <button key={tab.id} onClick={() => setParcoursTab(tab.id)} style={{ padding: "10px 20px", fontSize: 13, fontWeight: parcoursTab === tab.id ? 600 : 400, color: parcoursTab === tab.id ? C.pink : C.textLight, background: "none", border: "none", borderBottom: parcoursTab === tab.id ? `2px solid ${C.pink}` : "2px solid transparent", cursor: "pointer", fontFamily: font, marginBottom: -2, display: "flex", alignItems: "center", gap: 6 }}>
              {tab.label} <span style={{ fontSize: 10, padding: "1px 6px", borderRadius: 8, background: parcoursTab === tab.id ? C.pinkBg : C.bg, color: parcoursTab === tab.id ? C.pink : C.textMuted }}>{tab.count}</span>
            </button>
          ))}
        </div>

        {/* TAB: Parcours */}
        {parcoursTab === "parcours" && (<>
          <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
            {(["all", "onboarding", "offboarding", "crossboarding", "reboarding"] as const).map(cat => {
              const count = cat === "all" ? PARCOURS_TEMPLATES.length : PARCOURS_TEMPLATES.filter(p => p.categorie === cat).length;
              return (
                <button key={cat} onClick={() => setParcoursFilter(cat)} className="iz-tag" style={{ padding: "5px 12px", borderRadius: 8, fontSize: 11, fontWeight: 600, border: `1px solid ${parcoursFilter === cat ? C.pink : C.border}`, background: parcoursFilter === cat ? C.pinkBg : C.white, color: parcoursFilter === cat ? C.pink : C.text, cursor: "pointer", fontFamily: font, display: "flex", alignItems: "center", gap: 4 }}>
                  {cat !== "all" && (() => { const m = PARCOURS_CAT_META[cat]; return <m.Icon size={12} color={parcoursFilter === cat ? C.pink : m.color} />; })()}
                  {cat === "all" ? "Tous" : PARCOURS_CAT_META[cat].label} ({count})
                </button>
              );
            })}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
            {PARCOURS_TEMPLATES.filter(p => parcoursFilter === "all" || p.categorie === parcoursFilter).map(p => {
              const catMeta = PARCOURS_CAT_META[p.categorie] || PARCOURS_CAT_META.onboarding;
              const pActions = ACTION_TEMPLATES.filter(a => a.parcours === p.nom);
              return (
                <div key={p.id} className="iz-card iz-fade-up" style={{ ...sCard, position: "relative", cursor: "pointer" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: catMeta.bg, display: "flex", alignItems: "center", justifyContent: "center" }}><catMeta.Icon size={20} color={catMeta.color} /></div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 15, fontWeight: 600 }}>{p.nom}</div>
                      <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, background: catMeta.bg, color: catMeta.color, fontWeight: 600 }}>{catMeta.label}</span>
                    </div>
                    <span style={{ padding: "3px 10px", borderRadius: 6, fontSize: 10, fontWeight: 600, background: p.status === "actif" ? C.greenLight : p.status === "brouillon" ? C.amberLight : p.status === "archive" ? C.redLight : C.bg, color: p.status === "actif" ? C.green : p.status === "brouillon" ? C.amber : p.status === "archive" ? C.red : C.textMuted }}>{p.status === "archive" ? t('misc.disabled_label') : p.status === "actif" ? t('misc.active') : p.status === "brouillon" ? t('misc.draft') : p.status}</span>
                  </div>
                  <div style={{ display: "flex", gap: 20, fontSize: 12, color: C.textLight, marginBottom: 10 }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Zap size={12} /> {pActions.length} {t('table.actions')}</span>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}><FileText size={12} /> {p.docsCount} {t('misc.docs')}</span>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Users size={12} /> {p.collaborateursActifs} {t('misc.actifs')}</span>
                  </div>
                  <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 12 }}>{p.phases.map((ph, i) => <span key={i} style={{ padding: "3px 10px", borderRadius: 6, fontSize: 10, background: C.bg, color: C.textLight }}>{ph}</span>)}</div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={() => { setActionFilter(p.nom); setParcoursTab("actions"); }} className="iz-btn-pink" style={{ ...sBtn("pink"), fontSize: 11, padding: "5px 14px", display: "flex", alignItems: "center", gap: 4 }}><Eye size={12} /> {t('misc.view_actions')}</button>
                    <button onClick={() => { setParcoursPanelData({ id: p.id, nom: p.nom, categorie: p.categorie, status: p.status }); setContentTranslations(p.translations || {}); setParcoursPanelMode("edit"); }} className="iz-btn-outline" style={{ ...sBtn("outline"), fontSize: 11, padding: "5px 14px" }}>{t('common.edit')}</button>
                    <button onClick={async () => { try { await apiDuplicateParcours(p.id); refetchParcours(); addToast_admin("Parcours dupliqué"); } catch { addToast_admin("Erreur lors de la duplication"); } }} className="iz-btn-outline" style={{ ...sBtn("outline"), fontSize: 11, padding: "5px 14px" }}>{t('common.duplicate')}</button>
                    {p.status === "actif" && (
                      <button onClick={() => showConfirm(
                        "{t('misc.disable')} ce parcours ? Les onboardings en cours pourront être finalisés, mais il ne sera plus possible de l'attribuer à de nouveaux collaborateurs.",
                        async () => { try { await apiUpdateParcours(p.id, { status: "archive" }); refetchParcours(); addToast_admin("Parcours désactivé"); } catch { addToast_admin(t('toast.error')); } }
                      )} style={{ ...sBtn("outline"), fontSize: 11, padding: "5px 14px", color: C.amber, borderColor: C.amber }}>{t('misc.disable')}</button>
                    )}
                    {p.status === "archive" && (
                      <button onClick={async () => { try { await apiUpdateParcours(p.id, { status: "actif" }); refetchParcours(); addToast_admin("Parcours réactivé"); } catch { addToast_admin(t('toast.error')); } }} style={{ ...sBtn("outline"), fontSize: 11, padding: "5px 14px", color: C.green, borderColor: C.green }}>{t('misc.reactivate')}</button>
                    )}
                    {p.collaborateursActifs === 0 ? (
                      <button onClick={() => showConfirm(
                        "Supprimer définitivement ce parcours ? Cette action est irréversible.",
                        async () => { try { await apiDeleteParcours(p.id); refetchParcours(); addToast_admin("Parcours supprimé"); } catch { addToast_admin(t('toast.error')); } }
                      )} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}><Trash size={14} color={C.red} /></button>
                    ) : (
                      <span title="Impossible de supprimer : des collaborateurs sont en cours d'onboarding" style={{ padding: 4, cursor: "not-allowed", opacity: 0.3 }}><Trash size={14} color={C.textMuted} /></span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>)}

        {/* TAB: Phases */}
        {parcoursTab === "phases" && (
          <div>
            {PHASE_DEFAULTS.map((ph, i) => {
              const PhIcon = PHASE_ICONS[ph.nom];
              const phActions = ACTION_TEMPLATES.filter(a => a.phase === ph.nom);
              return (
                <div key={ph.id} className="iz-card iz-fade-up" style={{ ...sCard, marginBottom: 12, display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: ph.couleur, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {PhIcon ? <PhIcon size={20} color={C.white} /> : <CheckCircle size={20} color={C.white} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 600 }}>{ph.nom}</div>
                    <div style={{ fontSize: 12, color: C.textLight }}>{ph.delaiDebut} → {ph.delaiFin} · {phActions.length} actions</div>
                  </div>
                  <button onClick={() => { setPhasePanelData({ id: ph.id, nom: ph.nom, delaiDebut: ph.delaiDebut, delaiFin: ph.delaiFin, couleur: ph.couleur, parcoursIds: ph.parcoursIds || [] }); setContentTranslations(ph.translations || {}); setPhasePanelMode("edit"); }} className="iz-btn-outline" style={{ ...sBtn("outline"), fontSize: 11, padding: "5px 14px" }}>{t('common.edit')}</button>
                  {phActions.length > 0 ? (
                    <span title={`Impossible de supprimer : ${phActions.length} action(s) associée(s)`} style={{ padding: 4, cursor: "not-allowed", opacity: 0.3 }}><Trash size={14} color={C.textMuted} /></span>
                  ) : (
                    <button onClick={() => showConfirm(`Supprimer la phase "${ph.nom}" ?`, async () => { try { await apiDeletePhase(ph.id); refetchActions(); addToast_admin("Phase supprimée"); } catch { addToast_admin(t('toast.error')); } })} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}><Trash size={14} color={C.red} /></button>
                  )}
                </div>
              );
            })}
            <button onClick={() => { setPhasePanelData({ nom: "", delaiDebut: "J-30", delaiFin: "J-1", couleur: "#4CAF50", parcoursIds: [] }); resetTr(); setPhasePanelMode("create"); }} className="iz-btn-outline" style={{ ...sBtn("outline"), display: "flex", alignItems: "center", gap: 6, marginTop: 8 }}><Plus size={14} /> {t('parcours.new_phase')}</button>
          </div>
        )}

        {/* TAB: Actions & Tâches */}
        {parcoursTab === "actions" && (<>
          <div style={{ display: "flex", gap: 12, marginBottom: 16, alignItems: "center" }}>
            <select value={actionFilter} onChange={e => setActionFilter(e.target.value)} style={{ ...sInput, width: 240, fontSize: 12, padding: "8px 12px" }}>
              <option value="all">Tous les parcours</option>
              {PARCOURS_TEMPLATES.map(p => { const cnt = ACTION_TEMPLATES.filter(a => a.parcours === p.nom).length; return <option key={p.id} value={p.nom}>{p.nom} ({cnt})</option>; })}
            </select>
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              {(Object.entries(ACTION_TYPE_META) as [ActionType, any][]).map(([type, meta]) => {
                const count = filteredActions.filter(a => a.type === type).length;
                if (count === 0) return null;
                return <span key={type} style={{ padding: "3px 8px", borderRadius: 6, fontSize: 10, fontWeight: 600, background: meta.bg, color: meta.color }}>{meta.label} ({count})</span>;
              })}
            </div>
          </div>
          <div className="iz-card" style={{ ...sCard, padding: 0, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead><tr style={{ background: C.bg }}>{["","Action","Type","Phase","Délai","Parcours","Oblig.",""].map((h,i) => <th key={i} style={{ padding: "10px 14px", textAlign: "left", fontWeight: 600, fontSize: 11, color: C.textLight, textTransform: "uppercase", letterSpacing: .3 }}>{h}</th>)}</tr></thead>
              <tbody>
                {filteredActions.map((a, i) => {
                  const meta = ACTION_TYPE_META[a.type] || ACTION_TYPE_META.tache;
                  return (
                    <tr key={a.id} style={{ borderBottom: `1px solid ${C.border}`, cursor: "pointer" }} onClick={() => { const phId = PHASE_DEFAULTS.find(ph => ph.nom === a.phase)?.id; setActionPanelData({ id: a.id, titre: a.titre, type: a.type, phaseIds: phId ? [phId] : [], delaiRelatif: a.delaiRelatif, obligatoire: a.obligatoire, description: a.description || "", lienExterne: (a as any).lienExterne || "", dureeEstimee: (a as any).dureeEstimee || "", options: (a as any).options || {} }); setContentTranslations((a as any).translations || {}); setActionPanelMode("edit"); }}>
                      <td style={{ padding: "10px 14px", width: 36 }}><div style={{ width: 28, height: 28, borderRadius: 6, background: meta.bg, display: "flex", alignItems: "center", justifyContent: "center" }}><meta.Icon size={13} color={meta.color} /></div></td>
                      <td style={{ padding: "10px 14px" }}><div style={{ fontWeight: 500 }}>{a.titre}</div><div style={{ fontSize: 11, color: C.textLight }}>{a.description?.substring(0, 60) || ""}...</div></td>
                      <td style={{ padding: "10px 14px" }}><span style={{ display: "inline-flex", alignItems: "center", gap: 3, padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 600, background: meta.bg, color: meta.color }}>{meta.label}</span></td>
                      <td style={{ padding: "10px 14px", fontSize: 12, color: C.textLight }}>{a.phase}</td>
                      <td style={{ padding: "10px 14px", fontSize: 12 }}>{a.delaiRelatif}</td>
                      <td style={{ padding: "10px 14px" }}><span style={{ fontSize: 10, color: C.pink, fontWeight: 500 }}>{a.parcours?.replace("Onboarding ", "")}</span></td>
                      <td style={{ padding: "10px 14px" }}>{a.obligatoire ? <CheckCircle size={14} color={C.green} /> : <span style={{ color: C.textMuted }}>—</span>}</td>
                      <td style={{ padding: "10px 14px" }}>
                        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                          <button onClick={e => { e.stopPropagation(); const phId = PHASE_DEFAULTS.find(ph => ph.nom === a.phase)?.id; setActionPanelData({ id: a.id, titre: a.titre, type: a.type, phaseIds: phId ? [phId] : [], delaiRelatif: a.delaiRelatif, obligatoire: a.obligatoire, description: a.description || "", lienExterne: (a as any).lienExterne || "", dureeEstimee: (a as any).dureeEstimee || "", options: (a as any).options || {} }); setActionPanelMode("edit"); }} className="iz-btn-outline" style={{ ...sBtn("outline"), padding: "3px 8px", fontSize: 10 }}>{t('common.edit')}</button>
                          <button onClick={e => { e.stopPropagation(); showConfirm(`Supprimer l'action "${a.titre}" ?`, async () => { try { await apiDeleteAction(a.id); refetchActions(); addToast_admin("Action supprimée"); } catch { addToast_admin(t('toast.error')); } }); }} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}><Trash size={12} color={C.red} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>)}

        {/* TAB: Groupes */}
        {parcoursTab === "groupes" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
              {GROUPES.map(g => (
                <div key={g.id} className="iz-card iz-fade-up" style={{ ...sCard }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: g.couleur, display: "flex", alignItems: "center", justifyContent: "center" }}><Users size={16} color={C.white} /></div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{g.nom}</div>
                      <div style={{ fontSize: 11, color: C.textLight }}>{g.description}</div>
                    </div>
                    <button onClick={() => { setGroupePanelData({ id: g.id, nom: g.nom, description: g.description, couleur: g.couleur, critereType: (g.critereAuto as any)?.type || "", critereValeur: (g.critereAuto as any)?.valeur || "", membres: g.membres || [] }); setContentTranslations((g as any).translations || {}); setGroupePanelMode("edit"); }} className="iz-btn-outline" style={{ ...sBtn("outline"), fontSize: 11, padding: "5px 14px" }}>{t('common.edit')}</button>
                    <button onClick={() => showConfirm(`Supprimer le groupe "${g.nom}" ?`, async () => { try { await apiDeleteGroupe(g.id); refetchGroupes(); addToast_admin("Groupe supprimé"); } catch { addToast_admin(t('toast.error')); } })} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}><Trash size={14} color={C.red} /></button>
                  </div>
                  <div style={{ fontSize: 12, color: C.textLight, marginBottom: 8 }}>{(g.membres || []).length} membres{g.critereAuto && <span style={{ marginLeft: 8, padding: "2px 8px", borderRadius: 4, fontSize: 10, background: C.blueLight, color: C.blue }}>Auto: {(g.critereAuto as any).type} = {(g.critereAuto as any).valeur}</span>}</div>
                  <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>{(g.membres || []).map((m: string, mi: number) => <span key={mi} style={{ padding: "2px 8px", borderRadius: 4, fontSize: 10, background: C.bg }}>{m}</span>)}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      );
    };
  
    // ─── DOCUMENTS ─────────────────────────────────────────────
    const renderDocuments = () => {
      const reloadDocs = () => getDocuments().then(setRealDocs).catch(() => {});
      // Use real API documents when available, fallback to mock
      const hasRealDocs = realDocs.length > 0;
      const docSubmissions = hasRealDocs
        ? realDocs.map(d => {
            const collab = COLLABORATEURS.find(c => c.id === d.collaborateur_id);
            return { id: d.id, collabId: d.collaborateur_id, collabName: collab ? `${collab.prenom} ${collab.nom}` : `#${d.collaborateur_id}`, collabInitials: collab?.initials || "?", collabColor: collab?.color || C.textMuted, categorie: d.nom, categorieId: String(d.categorie_id || ""), piece: d.fichier_original || d.nom, obligatoire: false, type: "upload" as const, status: d.status as "soumis" | "valide" | "refuse", submittedAt: d.created_at, key: d.id };
          })
        : COLLABORATEURS.flatMap(collab =>
            ADMIN_DOC_CATEGORIES.flatMap(cat =>
              cat.pieces.map((piece, pi) => {
                const seed = collab.id * 100 + pi;
                const status = collab.progression === 100 ? "valide" : seed % 5 === 0 ? "refuse" : seed % 3 === 0 ? "manquant" : seed % 4 === 0 ? "en_attente" : "valide";
                return { id: seed, collabId: collab.id, collabName: `${collab.prenom} ${collab.nom}`, collabInitials: collab.initials, collabColor: collab.color, categorie: cat.titre, categorieId: cat.id, piece: piece.nom, obligatoire: piece.obligatoire, type: piece.type, status, submittedAt: status !== "manquant" ? `2026-03-${String(10 + (seed % 20)).padStart(2, "0")}` : null, key: seed };
              })
            )
          );

      const allPieces = ADMIN_DOC_CATEGORIES.flatMap(cat => cat.pieces.map(p => ({ ...p, categorie: cat.titre, categorieId: cat.id })));
      const totalTemplates = allPieces.length;
      const pendingValidation = docSubmissions.filter(d => d.status === "en_attente" || d.status === "soumis");
      const missing = docSubmissions.filter(d => d.status === "manquant");
      const refused = docSubmissions.filter(d => d.status === "refuse");

      const DOC_STATUS_META: Record<string, { label: string; color: string; bg: string }> = {
        valide: { label: "Validé", color: C.green, bg: C.greenLight },
        en_attente: { label: "En attente", color: C.amber, bg: C.amberLight },
        refuse: { label: "Refusé", color: C.red, bg: C.redLight },
        manquant: { label: "Manquant", color: C.textMuted, bg: C.bg },
      };

      const toggleValidationSelect = (key: number) => {
        setSelectedDocsForValidation(prev => {
          const next = new Set(prev);
          if (next.has(key)) next.delete(key); else next.add(key);
          return next;
        });
      };

      return (
      <div style={{ flex: 1, padding: "24px 32px", overflow: "auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <h1 style={{ fontSize: 22, fontWeight: 600, margin: 0 }}>{t('doc.title')}</h1>
          <div style={{ display: "flex", gap: 8 }}>
            {gedTab === "templates" && <button onClick={() => { setTplPanelDoc({ nom: "", categorie: ADMIN_DOC_CATEGORIES[0]?.id || "", obligatoire: false, type: "upload", description: "", fichier_modele: "" }); resetTr(); setTplPanelOpen("create"); }} className="iz-btn-pink" style={{ ...sBtn("pink"), display: "flex", alignItems: "center", gap: 6 }}><Plus size={14} /> {t('doc.new_template')}</button>}
            {gedTab === "validation" && selectedDocsForValidation.size > 0 && (
              <button onClick={async () => {
                const ids = Array.from(selectedDocsForValidation);
                if (hasRealDocs) { for (const id of ids) { try { await apiValidateDoc(id); } catch {} } reloadDocs(); }
                addToast_admin(`${ids.length} document(s) validé(s)`); setSelectedDocsForValidation(new Set());
              }} className="iz-btn-pink" style={{ ...sBtn("pink"), display: "flex", alignItems: "center", gap: 6 }}><CheckCircle size={14} /> Valider la sélection ({selectedDocsForValidation.size})</button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
          {[
            { label: "{t('doc.templates_count')}", value: totalTemplates, icon: FileText, color: C.blue, bg: C.blueLight },
            { label: t('doc.pending_validation'), value: pendingValidation.length, icon: Clock, color: C.amber, bg: C.amberLight },
            { label: t('doc.missing'), value: missing.length, icon: AlertTriangle, color: C.red, bg: C.redLight },
            { label: t('doc.refused'), value: refused.length, icon: XCircle, color: "#7B5EA7", bg: C.purple + "15" },
          ].map((s, i) => (
            <div key={i} className="iz-card" style={{ ...sCard, padding: "16px 20px", display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center" }}><s.icon size={18} color={s.color} /></div>
              <div><div style={{ fontSize: 20, fontWeight: 700, color: C.text }}>{s.value}</div><div style={{ fontSize: 11, color: C.textMuted }}>{s.label}</div></div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 0, borderBottom: `2px solid ${C.border}`, marginBottom: 16 }}>
          {([
            { id: "templates" as const, label: t('doc.library'), count: totalTemplates },
            { id: "suivi" as const, label: t('doc.by_collab'), count: COLLABORATEURS.length },
            { id: "validation" as const, label: t('doc.mass_validation'), count: pendingValidation.length },
          ]).map(tab => (
            <button key={tab.id} onClick={() => setGedTab(tab.id)} style={{ padding: "10px 20px", fontSize: 13, fontWeight: gedTab === tab.id ? 600 : 400, color: gedTab === tab.id ? C.pink : C.textLight, background: "none", border: "none", borderBottom: gedTab === tab.id ? `2px solid ${C.pink}` : "2px solid transparent", cursor: "pointer", fontFamily: font, marginBottom: -2, display: "flex", alignItems: "center", gap: 6 }}>
              {tab.label} <span style={{ fontSize: 10, padding: "1px 6px", borderRadius: 8, background: gedTab === tab.id ? C.pinkBg : C.bg, color: gedTab === tab.id ? C.pink : C.textMuted }}>{tab.count}</span>
            </button>
          ))}
        </div>

        {/* ═══ TAB: Bibliothèque de modèles ═══ */}
        {gedTab === "templates" && (<>
          <div className="iz-card" style={{ ...sCard, display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", marginBottom: 16 }}>
            <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, background: C.bg, borderRadius: 8, padding: "8px 12px" }}>
              <Search size={16} color={C.textLight} />
              <input value={gedSearch} onChange={e => setGedSearch(e.target.value)} placeholder="{t('doc.search_placeholder')}" style={{ border: "none", outline: "none", background: "transparent", flex: 1, fontSize: 13, fontFamily: font, color: C.text }} />
            </div>
            <select value={gedCatFilter} onChange={e => setGedCatFilter(e.target.value)} style={{ padding: "8px 14px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 12, fontFamily: font, color: C.text, cursor: "pointer" }}>
              <option value="all">{t('misc.all_categories')}</option>
              {ADMIN_DOC_CATEGORIES.map(cat => <option key={cat.id} value={cat.id}>{cat.titre}</option>)}
            </select>
          </div>

          {ADMIN_DOC_CATEGORIES
            .filter(cat => gedCatFilter === "all" || cat.id === gedCatFilter)
            .map(cat => {
              const catPieces = cat.pieces.filter(p => !gedSearch || p.nom.toLowerCase().includes(gedSearch.toLowerCase()));
              if (catPieces.length === 0) return null;
              return (
              <div key={cat.id} style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <FolderOpen size={16} color={C.pink} />
                  <span style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{cat.titre}</span>
                  <span style={{ fontSize: 11, color: C.textMuted }}>{catPieces.length} {t('misc.pieces')}</span>
                </div>
                <div className="iz-card" style={{ ...sCard, overflow: "hidden" }}>
                  {catPieces.map((piece, pi) => (
                    <div key={pi} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 16px", borderBottom: pi < catPieces.length - 1 ? `1px solid ${C.border}` : "none" }} className="iz-sidebar-item">
                      <div style={{ width: 36, height: 36, borderRadius: 8, background: piece.type === "formulaire" ? C.pinkBg : C.blueLight, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        {piece.type === "formulaire" ? <ClipboardList size={16} color={C.pink} /> : <FileUp size={16} color={C.blue} />}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 500, color: C.text }}>{piece.nom}</div>
                        <div style={{ fontSize: 11, color: C.textMuted, display: "flex", alignItems: "center", gap: 8 }}>
                          <span>{piece.type === "formulaire" ? "{t('misc.form_to_fill')}" : "{t('misc.upload_required')}"}</span>
                          {piece.obligatoire && <span style={{ color: C.red, fontWeight: 600 }}>{t('dash.obligatory')}</span>}
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button onClick={() => addToast_admin(`Modèle "${piece.nom}" téléchargé`)} title="Télécharger le modèle" className="iz-btn-outline" style={{ ...sBtn("outline"), padding: "5px 10px", fontSize: 11, display: "flex", alignItems: "center", gap: 4 }}><Download size={12} /> {t('misc.template')}</button>
                        <button onClick={() => { setTplPanelDoc({ nom: piece.nom, categorie: cat.id, obligatoire: piece.obligatoire, type: piece.type, description: "", fichier_modele: "" }); setContentTranslations((piece as any).translations || {}); setTplPanelOpen("edit"); }} style={{ background: C.bg, border: "none", borderRadius: 6, padding: "5px 8px", cursor: "pointer" }}><FilePen size={14} color={C.textMuted} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              );
            })}
        </>)}

        {/* ═══ TAB: Suivi par collaborateur ═══ */}
        {gedTab === "suivi" && (
          <div>
            {COLLABORATEURS.map(collab => {
              const collabDocs = docSubmissions.filter(d => d.collabId === collab.id);
              const collabMissing = collabDocs.filter(d => d.status === "manquant").length;
              const collabPending = collabDocs.filter(d => d.status === "en_attente").length;
              const collabRefused = collabDocs.filter(d => d.status === "refuse").length;
              const collabValid = collabDocs.filter(d => d.status === "valide").length;
              const total = collabDocs.length;
              const pct = total > 0 ? Math.round((collabValid / total) * 100) : 0;
              return (
              <div key={collab.id} className="iz-card" style={{ ...sCard, marginBottom: 12, padding: 0, overflow: "hidden" }}>
                <div style={{ padding: "14px 20px", display: "flex", alignItems: "center", gap: 14, cursor: "pointer" }}
                  onClick={() => { setCollabPanelData({ id: collab.id, prenom: collab.prenom, nom: collab.nom, email: collab.email || "", poste: collab.poste, site: collab.site, departement: collab.departement, dateDebut: collab.dateDebut }); setCollabPanelMode("edit"); }}>
                  <div style={{ width: 38, height: 38, borderRadius: "50%", background: collab.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600, color: C.white, flexShrink: 0 }}>{collab.initials}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 500, color: C.text }}>{collab.prenom} {collab.nom}</div>
                    <div style={{ fontSize: 11, color: C.textMuted }}>{collab.poste} · {collab.site}</div>
                  </div>
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    {collabMissing > 0 && <span style={{ padding: "3px 10px", borderRadius: 6, fontSize: 10, fontWeight: 600, background: C.redLight, color: C.red }}>{collabMissing} manquant{collabMissing > 1 ? "s" : ""}</span>}
                    {collabPending > 0 && <span style={{ padding: "3px 10px", borderRadius: 6, fontSize: 10, fontWeight: 600, background: C.amberLight, color: C.amber }}>{collabPending} en attente</span>}
                    {collabRefused > 0 && <span style={{ padding: "3px 10px", borderRadius: 6, fontSize: 10, fontWeight: 600, background: C.purple + "15", color: "#7B5EA7" }}>{collabRefused} refusé{collabRefused > 1 ? "s" : ""}</span>}
                    <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 80 }}>
                      <div style={{ flex: 1, height: 6, background: C.bg, borderRadius: 3, overflow: "hidden" }}><div style={{ height: "100%", width: `${pct}%`, background: pct === 100 ? C.green : pct > 60 ? C.blue : C.amber, borderRadius: 3 }} /></div>
                      <span style={{ fontSize: 10, fontWeight: 600, color: C.textMuted }}>{pct}%</span>
                    </div>
                  </div>
                </div>
                {/* Expand: show each doc status for this collab */}
                {(collabMissing > 0 || collabPending > 0 || collabRefused > 0) && (
                  <div style={{ padding: "0 20px 12px", display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {collabDocs.filter(d => d.status !== "valide").map(d => {
                      const sm = DOC_STATUS_META[d.status];
                      return (
                        <span key={d.key} style={{ padding: "3px 10px", borderRadius: 6, fontSize: 10, background: sm.bg, color: sm.color, display: "flex", alignItems: "center", gap: 4 }}>
                          {d.status === "manquant" ? <AlertTriangle size={9} /> : d.status === "refuse" ? <XCircle size={9} /> : <Clock size={9} />}
                          {d.piece}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
              );
            })}
          </div>
        )}

        {/* ═══ TAB: Validation en masse ═══ */}
        {gedTab === "validation" && (
          <div className="iz-card" style={{ ...sCard, overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "40px 1.5fr 2fr 1fr 1fr 0.8fr", gap: 0, padding: "10px 16px", background: C.bg, borderBottom: `1px solid ${C.border}`, fontSize: 11, fontWeight: 600, color: C.textLight, textTransform: "uppercase", letterSpacing: .3 }}>
              <span><input type="checkbox" checked={selectedDocsForValidation.size === pendingValidation.length && pendingValidation.length > 0} onChange={() => {
                if (selectedDocsForValidation.size === pendingValidation.length) setSelectedDocsForValidation(new Set());
                else setSelectedDocsForValidation(new Set(pendingValidation.map(d => d.id)));
              }} style={{ cursor: "pointer" }} /></span>
              <span>Collaborateur</span><span>Document</span><span>Catégorie</span><span>Soumis le</span><span>Actions</span>
            </div>
            {pendingValidation.length === 0 && <div style={{ padding: "40px 20px", textAlign: "center", color: C.textMuted, fontSize: 13 }}>Aucun document en attente de validation</div>}
            {pendingValidation.map(d => (
              <div key={d.id} style={{ display: "grid", gridTemplateColumns: "40px 1.5fr 2fr 1fr 1fr 0.8fr", gap: 0, padding: "12px 16px", borderBottom: `1px solid ${C.border}`, alignItems: "center", fontSize: 13, background: selectedDocsForValidation.has(d.id) ? C.pinkBg + "40" : "transparent" }}
                className="iz-sidebar-item">
                <span><input type="checkbox" checked={selectedDocsForValidation.has(d.id)} onChange={() => toggleValidationSelect(d.id)} style={{ cursor: "pointer" }} /></span>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 30, height: 30, borderRadius: "50%", background: d.collabColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 600, color: C.white }}>{d.collabInitials}</div>
                  <span style={{ fontWeight: 500 }}>{d.collabName}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <FileUp size={14} color={C.blue} />
                  <span>{d.piece}</span>
                  {d.obligatoire && <span style={{ fontSize: 9, fontWeight: 700, color: C.red }}>*</span>}
                </div>
                <div style={{ fontSize: 11, color: C.textMuted }}>{d.categorie.length > 25 ? d.categorie.slice(0, 25) + "…" : d.categorie}</div>
                <div style={{ fontSize: 11, color: C.textMuted }}>{fmtDate(d.submittedAt)}</div>
                <div style={{ display: "flex", gap: 4 }}>
                  <button onClick={async () => { if (hasRealDocs) { try { await apiValidateDoc(d.id); reloadDocs(); } catch {} } addToast_admin(`"${d.piece}" de ${d.collabName} validé`); }} title="Valider" style={{ background: C.greenLight, border: "none", borderRadius: 6, padding: 4, cursor: "pointer" }}><CheckCircle size={14} color={C.green} /></button>
                  <button onClick={() => showPrompt(`Motif du refus pour "${d.piece}" :`, async (motif) => { if (hasRealDocs) { try { await apiRefuseDoc(d.id, motif); reloadDocs(); } catch {} } addToast_admin(`"${d.piece}" de ${d.collabName} refusé`); }, { label: "Motif (optionnel)" })} title="Refuser" style={{ background: C.redLight, border: "none", borderRadius: 6, padding: 4, cursor: "pointer" }}><XCircle size={14} color={C.red} /></button>
                  <button onClick={() => { if (hasRealDocs && d.id) window.open(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001/api/v1'}/documents/${d.id}/download`, '_blank'); else addToast_admin("Aperçu non disponible"); }} title="Voir le fichier" style={{ background: C.bg, border: "none", borderRadius: 6, padding: 4, cursor: "pointer" }}><Eye size={14} color={C.textMuted} /></button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Template create/edit panel ──────────────────────── */}
        {tplPanelOpen !== "closed" && (
          <div className="iz-panel" style={{ position: "fixed", top: 0, right: 0, width: 500, height: "100vh", background: C.white, boxShadow: "-4px 0 24px rgba(0,0,0,.1)", zIndex: 1001, display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "20px 24px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>{tplPanelOpen === "create" ? "Nouveau modèle de document" : "Modifier le modèle"}</h2>
              <button onClick={() => setTplPanelOpen("closed")} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}><X size={18} /></button>
            </div>
            <div style={{ flex: 1, padding: 24, overflow: "auto", display: "flex", flexDirection: "column", gap: 16 }}>
              <div><label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Nom du document *</label><TranslatableField value={tplPanelDoc.nom} onChange={v => setTplPanelDoc({ ...tplPanelDoc, nom: v })} currentLang={lang} activeLangs={activeLanguages} translations={contentTranslations.nom} onTranslationsChange={tr => setTr("nom", tr)} style={sInput} placeholder="Ex: Pièce d'identité / Passeport" /></div>
              <div><label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Catégorie</label>
                <select value={tplPanelDoc.categorie} onChange={e => setTplPanelDoc({ ...tplPanelDoc, categorie: e.target.value })} style={sInput}>
                  {ADMIN_DOC_CATEGORIES.map(cat => <option key={cat.id} value={cat.id}>{cat.titre}</option>)}
                </select>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div><label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Type</label>
                  <select value={tplPanelDoc.type} onChange={e => setTplPanelDoc({ ...tplPanelDoc, type: e.target.value })} style={sInput}>
                    <option value="upload">Upload de fichier</option>
                    <option value="formulaire">{t('misc.form_to_fill')}</option>
                  </select>
                </div>
                <div style={{ display: "flex", alignItems: "end" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", padding: "10px 0" }}>
                    <input type="checkbox" checked={tplPanelDoc.obligatoire} onChange={e => setTplPanelDoc({ ...tplPanelDoc, obligatoire: e.target.checked })} />
                    <span style={{ fontSize: 13, fontWeight: 500 }}>{t('dash.obligatory')}</span>
                  </label>
                </div>
              </div>
              <div><label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Description / Instructions</label><TranslatableField multiline rows={4} value={tplPanelDoc.description || ""} onChange={v => setTplPanelDoc({ ...tplPanelDoc, description: v })} currentLang={lang} activeLangs={activeLanguages} translations={contentTranslations.description} onTranslationsChange={tr => setTr("description", tr)} style={{ ...sInput, minHeight: 80, resize: "vertical" }} placeholder="Instructions pour le collaborateur..." /></div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Fichier modèle (optionnel)</label>
                <div style={{ padding: "20px 16px", borderRadius: 10, border: `2px dashed ${C.border}`, textAlign: "center", cursor: "pointer", fontSize: 13, color: C.textLight }} className="iz-upload-zone">
                  <Upload size={20} color={C.textMuted} style={{ marginBottom: 6 }} /><br />
                  Déposer un fichier modèle ici<br />
                  <span style={{ fontSize: 11, color: C.textMuted }}>PDF, DOCX, XLSX — max 10 Mo</span>
                </div>
              </div>
            </div>
            <div style={{ padding: "16px 24px", borderTop: `1px solid ${C.border}`, display: "flex", gap: 8, justifyContent: "flex-end" }}>
              {tplPanelOpen === "edit" && (
                <button onClick={() => { showConfirm("Supprimer ce modèle de document ?", () => { setTplPanelOpen("closed"); addToast_admin("Modèle supprimé"); }); }} style={{ ...sBtn("outline"), color: C.red, borderColor: C.red, marginRight: "auto" }}>{t('common.delete')}</button>
              )}
              <button onClick={() => setTplPanelOpen("closed")} className="iz-btn-outline" style={sBtn("outline")}>{t('common.cancel')}</button>
              <button onClick={() => { setTplPanelOpen("closed"); addToast_admin(tplPanelOpen === "create" ? "Modèle créé" : "Modèle modifié"); }} className="iz-btn-pink" style={sBtn("pink")}>{tplPanelOpen === "create" ? t('common.create') : t('common.save')}</button>
            </div>
          </div>
        )}
      </div>
      );
    };
  
    // ─── WORKFLOWS ─────────────────────────────────────────────
    const WF_TRIGGERS = [
      "Document soumis", "Document refusé", "Tous documents validés", "Formulaire soumis",
      "Action complétée", "Parcours créé", "Parcours complété à 100%", "Fin de parcours offboarding",
      "Nouveau collaborateur", "J-7 avant date limite", "Période d'essai terminée", "Anniversaire d'embauche",
      "Collaborateur en retard", "Cooptation validée", "Contrat signé", "Questionnaire NPS soumis",
    ];
    const WF_ACTIONS = [
      "Envoyer email de relance", "Envoyer confirmation au collaborateur", "Envoyer pour validation au Manager",
      "Envoyer pour approbation Admin RH", "Notifier l'équipe RH", "Envoyer un message IllizeoBot",
      "Envoyer via Teams", "Envoyer pour signature", "Assigner action automatiquement",
      "Changer statut du parcours", "Attribuer un badge", "Ajouter au groupe", "Générer un document",
    ];
    const WF_RECIPIENTS = [
      "Collaborateur", "Manager direct", "Parrain/Buddy", "N+2",
      "Équipe RH", "Admin RH Suisse", "Tous les participants",
      "Utilisateur spécifique", "Groupe spécifique",
    ];

    const renderWorkflows = () => (
      <div style={{ flex: 1, padding: "24px 32px", overflow: "auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <h1 style={{ fontSize: 22, fontWeight: 600, margin: 0 }}>{t('admin.workflows')}</h1>
          <button onClick={() => { setWfPanelData({ nom: "", declencheur: WF_TRIGGERS[0], action: WF_ACTIONS[0], destinataire: WF_RECIPIENTS[0], actif: true, email_subject: "", email_body: "", bot_message: "", badge_name: "", badge_icon: "trophy", badge_color: "#F9A825", target_user_id: "", target_group_id: "" }); resetTr(); setWfPanelMode("create"); }} className="iz-btn-pink" style={{ ...sBtn("pink"), display: "flex", alignItems: "center", gap: 6 }}><Plus size={16} /> {t('wf.new')}</button>
        </div>
        {WORKFLOW_RULES.map((w: any) => (
          <div key={w.id} className="iz-card iz-fade-up" style={{ ...sCard, marginBottom: 12, display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: w.actif ? C.greenLight : C.bg, display: "flex", alignItems: "center", justifyContent: "center" }}><Zap size={18} color={w.actif ? C.green : C.textMuted} /></div>
            <div style={{ flex: 1, cursor: "pointer" }} onClick={() => { setWfPanelData({ id: w.id, nom: w.nom, declencheur: w.declencheur, action: w.action, destinataire: w.destinataire, actif: w.actif, email_subject: w.email_subject || "", email_body: w.email_body || "", bot_message: w.bot_message || "", badge_name: w.badge_name || "", badge_icon: w.badge_icon || "trophy", badge_color: w.badge_color || "#F9A825", target_user_id: w.target_user_id || "", target_group_id: w.target_group_id || "" }); setContentTranslations(w.translations || {}); setWfPanelMode("edit"); }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{w.nom}</div>
              <div style={{ fontSize: 12, color: C.textLight }}>Déclencheur: {w.declencheur} → {w.action} → {w.destinataire}</div>
            </div>
            <div onClick={async () => {
              try { await apiUpdateWorkflow(w.id, { actif: !w.actif }); refetchActions(); addToast_admin(`${w.nom} : ${!w.actif ? "activé" : "désactivé"}`); } catch {}
            }} style={{ width: 44, height: 24, borderRadius: 12, background: w.actif ? C.green : C.border, cursor: "pointer", position: "relative", transition: "all .2s" }}>
              <div style={{ width: 20, height: 20, borderRadius: "50%", background: C.white, position: "absolute", top: 2, left: w.actif ? 22 : 2, transition: "all .2s", boxShadow: "0 1px 3px rgba(0,0,0,.2)" }} />
            </div>
          </div>
        ))}
        {/* Workflow panel */}
        {wfPanelMode !== "closed" && (
          <>
            <div onClick={() => setWfPanelMode("closed")} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.3)", zIndex: 1000 }} />
            <div className="iz-panel" style={{ position: "fixed", top: 0, right: 0, width: 560, height: "100vh", background: C.white, boxShadow: "-4px 0 24px rgba(0,0,0,.1)", zIndex: 1001, display: "flex", flexDirection: "column" }}>
              <div style={{ padding: "24px 28px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>{wfPanelMode === "create" ? "Nouveau workflow" : "Modifier le workflow"}</h2>
                <button onClick={() => setWfPanelMode("closed")} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={22} color={C.textLight} /></button>
              </div>
              <div style={{ flex: 1, padding: "24px 28px", overflow: "auto" }}>
                <div style={{ marginBottom: 16 }}><label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Nom *</label><TranslatableField value={wfPanelData.nom} onChange={v => setWfPanelData((p: any) => ({ ...p, nom: v }))} currentLang={lang} activeLangs={activeLanguages} translations={contentTranslations.nom} onTranslationsChange={tr => setTr("nom", tr)} /></div>
                <div style={{ marginBottom: 16 }}><label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Déclencheur</label><select value={wfPanelData.declencheur} onChange={e => setWfPanelData((p: any) => ({ ...p, declencheur: e.target.value }))} style={{ ...sInput, cursor: "pointer" }}>{WF_TRIGGERS.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
                <div style={{ marginBottom: 16 }}><label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Action</label><select value={wfPanelData.action} onChange={e => setWfPanelData((p: any) => ({ ...p, action: e.target.value }))} style={{ ...sInput, cursor: "pointer" }}>{WF_ACTIONS.map(a => <option key={a} value={a}>{a}</option>)}</select></div>
                <div style={{ marginBottom: 16 }}><label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Destinataire</label><select value={wfPanelData.destinataire} onChange={e => setWfPanelData((p: any) => ({ ...p, destinataire: e.target.value }))} style={{ ...sInput, cursor: "pointer" }}>{WF_RECIPIENTS.map(r => <option key={r} value={r}>{r}</option>)}</select></div>

                {/* Conditional config fields based on action */}
                {(wfPanelData.action?.includes("email") || wfPanelData.action?.includes("Email") || wfPanelData.action?.includes("relance") || wfPanelData.action?.includes("confirmation") || wfPanelData.action?.includes("validation") || wfPanelData.action?.includes("approbation")) && (
                  <div style={{ padding: 16, background: C.bg, borderRadius: 10, marginBottom: 16 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: C.pink, marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}><Mail size={14} /> Configuration email</div>
                    <div style={{ marginBottom: 10 }}><label style={{ fontSize: 11, color: C.textLight, display: "block", marginBottom: 4 }}>Sujet de l'email (optionnel)</label><input value={wfPanelData.email_subject || ""} onChange={e => setWfPanelData((p: any) => ({ ...p, email_subject: e.target.value }))} style={sInput} placeholder="Laisser vide pour le sujet par défaut" /></div>
                    <div><label style={{ fontSize: 11, color: C.textLight, display: "block", marginBottom: 4 }}>Corps de l'email (optionnel)</label><textarea value={wfPanelData.email_body || ""} onChange={e => setWfPanelData((p: any) => ({ ...p, email_body: e.target.value }))} style={{ ...sInput, minHeight: 70, resize: "vertical" }} placeholder="Laisser vide pour le message par défaut. Variables : {{prenom}}, {{nom}}, {{parcours}}" /></div>
                  </div>
                )}

                {wfPanelData.action === "Envoyer un message IllizeoBot" && (
                  <div style={{ padding: 16, background: C.bg, borderRadius: 10, marginBottom: 16 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: C.pink, marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}><MessageSquare size={14} /> Message IllizeoBot</div>
                    <div><label style={{ fontSize: 11, color: C.textLight, display: "block", marginBottom: 4 }}>Message personnalisé (optionnel)</label><textarea value={wfPanelData.bot_message || ""} onChange={e => setWfPanelData((p: any) => ({ ...p, bot_message: e.target.value }))} style={{ ...sInput, minHeight: 70, resize: "vertical" }} placeholder="Laisser vide pour le message par défaut" /></div>
                  </div>
                )}

                {wfPanelData.action === "Attribuer un badge" && (
                  <div style={{ padding: 16, background: C.bg, borderRadius: 10, marginBottom: 16 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: C.pink, marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}><Award size={14} /> Configuration du badge</div>
                    <div style={{ marginBottom: 10 }}><label style={{ fontSize: 11, color: C.textLight, display: "block", marginBottom: 4 }}>Nom du badge</label><input value={wfPanelData.badge_name || ""} onChange={e => setWfPanelData((p: any) => ({ ...p, badge_name: e.target.value }))} style={sInput} placeholder="Ex: Champion Onboarding" /></div>
                    <div style={{ display: "flex", gap: 12 }}>
                      <div style={{ flex: 1 }}><label style={{ fontSize: 11, color: C.textLight, display: "block", marginBottom: 4 }}>Icône</label>
                        <select value={wfPanelData.badge_icon || "trophy"} onChange={e => setWfPanelData((p: any) => ({ ...p, badge_icon: e.target.value }))} style={sInput}>
                          {["trophy", "star", "award", "target", "sparkles", "gift", "check-circle"].map(i => <option key={i} value={i}>{i}</option>)}
                        </select>
                      </div>
                      <div><label style={{ fontSize: 11, color: C.textLight, display: "block", marginBottom: 4 }}>Couleur</label><input type="color" value={wfPanelData.badge_color || "#F9A825"} onChange={e => setWfPanelData((p: any) => ({ ...p, badge_color: e.target.value }))} style={{ width: 44, height: 38, border: `1px solid ${C.border}`, borderRadius: 8, cursor: "pointer", padding: 2 }} /></div>
                    </div>
                  </div>
                )}

                {wfPanelData.action === "Ajouter au groupe" && (
                  <div style={{ padding: 16, background: C.bg, borderRadius: 10, marginBottom: 16 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: C.pink, marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}><Users size={14} /> Groupe cible</div>
                    <div><label style={{ fontSize: 11, color: C.textLight, display: "block", marginBottom: 4 }}>Groupe</label>
                      <select value={wfPanelData.target_group_id || ""} onChange={e => setWfPanelData((p: any) => ({ ...p, target_group_id: e.target.value ? Number(e.target.value) : null }))} style={sInput}>
                        <option value="">— Sélectionner un groupe —</option>
                        {GROUPES.map((g: any) => <option key={g.id} value={g.id}>{g.nom}</option>)}
                      </select>
                    </div>
                  </div>
                )}

                {wfPanelData.destinataire === "Utilisateur spécifique" && (
                  <div style={{ padding: 16, background: C.bg, borderRadius: 10, marginBottom: 16 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: C.pink, marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}><UserCheck size={14} /> Utilisateur cible</div>
                    <div><label style={{ fontSize: 11, color: C.textLight, display: "block", marginBottom: 4 }}>Utilisateur</label>
                      <select value={wfPanelData.target_user_id || ""} onChange={e => setWfPanelData((p: any) => ({ ...p, target_user_id: e.target.value ? Number(e.target.value) : null }))} style={sInput}>
                        <option value="">— Sélectionner —</option>
                        {adminUsers.map((u: any) => <option key={u.id} value={u.id}>{u.name} ({u.email})</option>)}
                      </select>
                    </div>
                  </div>
                )}

                {wfPanelData.destinataire === "Groupe spécifique" && (
                  <div style={{ padding: 16, background: C.bg, borderRadius: 10, marginBottom: 16 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: C.pink, marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}><Users size={14} /> Groupe destinataire</div>
                    <div><label style={{ fontSize: 11, color: C.textLight, display: "block", marginBottom: 4 }}>Groupe</label>
                      <select value={wfPanelData.target_group_id || ""} onChange={e => setWfPanelData((p: any) => ({ ...p, target_group_id: e.target.value ? Number(e.target.value) : null }))} style={sInput}>
                        <option value="">— Sélectionner un groupe —</option>
                        {GROUPES.map((g: any) => <option key={g.id} value={g.id}>{g.nom}</option>)}
                      </select>
                    </div>
                  </div>
                )}
              </div>
              <div style={{ padding: "16px 28px", borderTop: `1px solid ${C.border}`, display: "flex", gap: 12, justifyContent: "space-between" }}>
                <div>{wfPanelMode === "edit" && <button onClick={() => { setConfirmDialog({ message: "Supprimer ce workflow ?", onConfirm: async () => { try { await apiDeleteWorkflow(wfPanelData.id); addToast_admin("Workflow supprimé"); setWfPanelMode("closed"); refetchActions(); } catch {} setConfirmDialog(null); }}); }} style={{ ...sBtn("outline"), color: C.red, borderColor: C.red, fontSize: 13 }}>{t('common.delete')}</button>}</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => setWfPanelMode("closed")} style={{ ...sBtn("outline"), fontSize: 13 }}>{t('common.cancel')}</button>
                  <button onClick={async () => {
                    try {
                      const wfPayload = { ...wfPanelData, translations: buildTranslationsPayload() };
                      if (wfPanelMode === "create") { await apiCreateWorkflow(wfPayload); addToast_admin("Workflow créé"); }
                      else { await apiUpdateWorkflow(wfPanelData.id, wfPayload); addToast_admin("Workflow modifié"); }
                      setWfPanelMode("closed"); refetchActions();
                    } catch { addToast_admin(t('toast.error')); }
                  }} className="iz-btn-pink" style={{ ...sBtn("pink"), fontSize: 13 }}>{wfPanelMode === "create" ? t('common.create') : t('common.save')}</button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );

    // ─── TEMPLATES EMAILS ─────────────────────────────────────
    const TPL_TRIGGERS = ["Création du parcours", "J-7 avant deadline documents", "Tous documents validés", "J+0", "Parcours complété à 100%", "Action assignée", "Document refusé"];
    const TPL_VARIABLES = ["{{prenom}}", "{{nom}}", "{{date_debut}}", "{{site}}", "{{poste}}", "{{departement}}", "{{parcours_nom}}", "{{nb_docs_manquants}}", "{{date_limite}}", "{{manager}}", "{{adresse}}"];

    const renderTemplates = () => {
      const filteredTpls = EMAIL_TEMPLATES.filter((tpl: any) => tplCatFilter === "all" || guessTplCategory(tpl.nom) === tplCatFilter);
      return (
      <div style={{ flex: 1, padding: "24px 32px", overflow: "auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <h1 style={{ fontSize: 22, fontWeight: 600, margin: 0 }}>{t('admin.email_templates')}</h1>
          <button onClick={() => { setTplPanelData({ nom: "", sujet: "", declencheur: TPL_TRIGGERS[0], variables: [], actif: true, contenu: "" }); resetTr(); setTplPanelMode("create"); }} className="iz-btn-pink" style={{ ...sBtn("pink"), display: "flex", alignItems: "center", gap: 6 }}><Plus size={16} /> Nouveau template</button>
        </div>

        {/* Email config banner */}
        <div className="iz-card" style={{ ...sCard, padding: "14px 20px", marginBottom: 16, display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: C.blueLight, display: "flex", alignItems: "center", justifyContent: "center" }}><Mail size={16} color={C.blue} /></div>
          <div style={{ flex: 1, fontSize: 12 }}>
            <span style={{ fontWeight: 600, color: C.text }}>Expéditeur : </span>
            <span style={{ color: C.textLight }}>{emailConfig.from_name} &lt;{emailConfig.from_address}&gt;</span>
            {emailConfig.single_recipient && <span style={{ marginLeft: 12, padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 600, background: C.amberLight, color: C.amber }}>Single recipient : {emailConfig.single_recipient}</span>}
          </div>
          <button onClick={() => showPrompt("Adresse de redirection (single recipient). Laisser vide pour désactiver.", (val) => {
            setEmailConfig(prev => ({ ...prev, single_recipient: val }));
            addToast_admin(val ? `Emails redirigés vers ${val}` : "Single recipient désactivé");
          }, { label: "Email de redirection", type: "email", defaultValue: emailConfig.single_recipient })} className="iz-btn-outline" style={{ ...sBtn("outline"), padding: "5px 12px", fontSize: 11 }}>Configurer</button>
        </div>

        {/* Category filter */}
        <div style={{ display: "flex", gap: 4, padding: 3, background: C.bg, borderRadius: 8, marginBottom: 16, width: "fit-content" }}>
          <button onClick={() => setTplCatFilter("all")} style={{ padding: "6px 14px", borderRadius: 6, fontSize: 11, fontWeight: tplCatFilter === "all" ? 600 : 400, border: "none", cursor: "pointer", fontFamily: font, background: tplCatFilter === "all" ? C.pink : "transparent", color: tplCatFilter === "all" ? C.white : C.textMuted }}>Tous ({EMAIL_TEMPLATES.length})</button>
          {Object.entries(TPL_CATEGORIES).map(([key, meta]) => {
            const count = EMAIL_TEMPLATES.filter((t: any) => guessTplCategory(t.nom) === key).length;
            if (count === 0) return null;
            return <button key={key} onClick={() => setTplCatFilter(key)} style={{ padding: "6px 14px", borderRadius: 6, fontSize: 11, fontWeight: tplCatFilter === key ? 600 : 400, border: "none", cursor: "pointer", fontFamily: font, background: tplCatFilter === key ? meta.color : "transparent", color: tplCatFilter === key ? C.white : C.textMuted }}>{meta.label} ({count})</button>;
          })}
        </div>

        {/* Template grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
          {filteredTpls.map((tpl: any) => {
            const cat = TPL_CATEGORIES[guessTplCategory(tpl.nom)];
            return (
            <div key={tpl.id} className="iz-card iz-fade-up" style={{ ...sCard, cursor: "pointer", position: "relative" }} onClick={() => { setTplPanelData({ id: tpl.id, nom: tpl.nom, sujet: tpl.sujet, declencheur: tpl.declencheur, variables: tpl.variables || [], actif: tpl.actif, contenu: tpl.contenu || "" }); setContentTranslations(tpl.translations || {}); setTplPanelMode("edit"); setTplPreview(false); }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <Mail size={18} color={tpl.actif ? C.pink : C.textMuted} />
                <div style={{ flex: 1, fontSize: 14, fontWeight: 600 }}>{tpl.nom}</div>
                <span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 600, background: cat?.bg || C.bg, color: cat?.color || C.textMuted }}>{cat?.label || "Autre"}</span>
                <span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 600, background: tpl.actif ? C.greenLight : C.bg, color: tpl.actif ? C.green : C.textMuted }}>{tpl.actif ? "Actif" : "Inactif"}</span>
              </div>
              <div style={{ fontSize: 12, color: C.textLight, marginBottom: 4 }}>Sujet: {tpl.sujet}</div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ fontSize: 11, color: C.textMuted }}>Déclencheur: {tpl.declencheur}</div>
                <div style={{ display: "flex", gap: 4 }} onClick={e => e.stopPropagation()}>
                  <button onClick={async () => { try { await apiDuplicateEmailTpl(tpl.id); refetchActions(); addToast_admin("Template dupliqué"); } catch { addToast_admin(t('toast.error')); } }} title="Dupliquer" style={{ background: C.bg, border: "none", borderRadius: 4, padding: "3px 6px", cursor: "pointer" }}><FolderOpen size={12} color={C.textMuted} /></button>
                </div>
              </div>
            </div>
            );
          })}
        </div>
        {filteredTpls.length === 0 && <div style={{ padding: "40px 20px", textAlign: "center", color: C.textMuted, fontSize: 13 }}>Aucun template dans cette catégorie</div>}
        {/* Template panel */}
        {tplPanelMode !== "closed" && (
          <>
            <div onClick={() => setTplPanelMode("closed")} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.3)", zIndex: 1000 }} />
            <div className="iz-panel" style={{ position: "fixed", top: 0, right: 0, width: 680, height: "100vh", background: C.white, boxShadow: "-4px 0 24px rgba(0,0,0,.1)", zIndex: 1001, display: "flex", flexDirection: "column" }}>
              <div style={{ padding: "20px 28px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>{tplPanelMode === "create" ? "Nouveau template" : "Modifier le template"}</h2>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {tplPanelMode === "edit" && (
                    <div style={{ display: "flex", gap: 4, padding: 2, background: C.bg, borderRadius: 6 }}>
                      <button onClick={() => setTplPreview(false)} style={{ padding: "4px 10px", borderRadius: 4, fontSize: 11, fontWeight: tplPreview ? 400 : 600, border: "none", cursor: "pointer", fontFamily: font, background: !tplPreview ? C.white : "transparent", color: !tplPreview ? C.text : C.textMuted, boxShadow: !tplPreview ? "0 1px 3px rgba(0,0,0,.1)" : "none" }}>Éditer</button>
                      <button onClick={() => setTplPreview(true)} style={{ padding: "4px 10px", borderRadius: 4, fontSize: 11, fontWeight: tplPreview ? 600 : 400, border: "none", cursor: "pointer", fontFamily: font, background: tplPreview ? C.white : "transparent", color: tplPreview ? C.text : C.textMuted, boxShadow: tplPreview ? "0 1px 3px rgba(0,0,0,.1)" : "none" }}>Aperçu</button>
                    </div>
                  )}
                  <button onClick={() => setTplPanelMode("closed")} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={22} color={C.textLight} /></button>
                </div>
              </div>
              <div style={{ flex: 1, padding: "24px 28px", overflow: "auto" }}>
                {!tplPreview ? (<>
                  <div style={{ marginBottom: 16 }}><label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Nom *</label><TranslatableField value={tplPanelData.nom} onChange={v => setTplPanelData((p: any) => ({ ...p, nom: v }))} currentLang={lang} activeLangs={activeLanguages} translations={contentTranslations.nom} onTranslationsChange={tr => setTr("nom", tr)} /></div>
                  <div style={{ marginBottom: 16 }}><label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Sujet de l'email *</label><TranslatableField value={tplPanelData.sujet} onChange={v => setTplPanelData((p: any) => ({ ...p, sujet: v }))} placeholder="Bienvenue chez Illizeo — {{prenom}}" currentLang={lang} activeLangs={activeLanguages} translations={contentTranslations.sujet} onTranslationsChange={tr => setTr("sujet", tr)} /></div>
                  <div style={{ marginBottom: 16 }}><label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Déclencheur</label><select value={tplPanelData.declencheur} onChange={e => setTplPanelData((p: any) => ({ ...p, declencheur: e.target.value }))} style={{ ...sInput, cursor: "pointer" }}>{TPL_TRIGGERS.map(tr => <option key={tr} value={tr}>{tr}</option>)}</select></div>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Corps de l'email</label>
                    <RichEditor
                      value={tplPanelData.contenu || ""}
                      onChange={(html) => setTplPanelData((p: any) => ({ ...p, contenu: html }))}
                      placeholder="Bonjour {{prenom}}, Bienvenue chez Illizeo !"
                    />
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", background: C.bg, borderRadius: 10, cursor: "pointer" }} onClick={() => setTplPanelData((p: any) => ({ ...p, actif: !p.actif }))}>
                    <div style={{ width: 20, height: 20, borderRadius: 4, border: `2px solid ${tplPanelData.actif ? C.pink : C.border}`, background: tplPanelData.actif ? C.pink : C.white, display: "flex", alignItems: "center", justifyContent: "center", transition: "all .15s" }}>{tplPanelData.actif && <Check size={14} color={C.white} />}</div>
                    <span style={{ fontSize: 13, fontWeight: 500 }}>Template actif</span>
                  </div>
                </>) : (
                  /* ── Preview mode ── */
                  <div>
                    <div style={{ border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden" }}>
                      {/* Email header */}
                      <div style={{ background: C.pink, padding: "20px 24px", textAlign: "center" }}>
                        <img src={customLogoFull || ILLIZEO_FULL_LOGO_URI} alt="Logo" style={{ height: 28, objectFit: "contain", filter: "brightness(10)" }} />
                      </div>
                      {/* Email subject */}
                      <div style={{ padding: "16px 24px", borderBottom: `1px solid ${C.border}`, background: C.bg }}>
                        <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 4 }}>Sujet</div>
                        <div style={{ fontSize: 15, fontWeight: 600, color: C.text }}>
                          {(tplPanelData.sujet || "").replace(/\{\{prenom\}\}/g, "Jean").replace(/\{\{nom\}\}/g, "Dupont").replace(/\{\{parcours_nom\}\}/g, "Onboarding Standard").replace(/\{\{action_nom\}\}/g, "Compléter le dossier")}
                        </div>
                      </div>
                      {/* Email body */}
                      <div style={{ padding: "24px", fontSize: 14, lineHeight: 1.7, color: C.text, minHeight: 200, whiteSpace: "pre-wrap" }}>
                        {(tplPanelData.contenu || "Pas de contenu défini.").replace(/\{\{prenom\}\}/g, "Jean").replace(/\{\{nom\}\}/g, "Dupont").replace(/\{\{date_debut\}\}/g, "01/06/2026").replace(/\{\{site\}\}/g, "Genève").replace(/\{\{poste\}\}/g, "Chef de Projet").replace(/\{\{parcours_nom\}\}/g, "Onboarding Standard").replace(/\{\{manager\}\}/g, "Mehdi Kessler").replace(/\{\{nb_docs_manquants\}\}/g, "3").replace(/\{\{date_limite\}\}/g, "15/06/2026").replace(/\{\{lien\}\}/g, "https://app.illizeo.com").replace(/\{\{action_nom\}\}/g, "Compléter le dossier").replace(/\{\{document_nom\}\}/g, "Pièce d'identité").replace(/\{\{collab_nom\}\}/g, "Jean Dupont").replace(/\{\{montant\}\}/g, "500 CHF").replace(/\{\{annees\}\}/g, "1").replace(/\{\{date_depart\}\}/g, "30/06/2026").replace(/\{\{email\}\}/g, "jean.dupont@illizeo.com").replace(/\{\{date_fin_essai\}\}/g, "01/09/2026").replace(/\{\{candidat_nom\}\}/g, "Marc Dupont").replace(/\{\{departement\}\}/g, "Tech").replace(/\{\{adresse\}\}/g, "Rue du Marché 10, Genève")}
                      </div>
                      {/* Email footer */}
                      <div style={{ padding: "16px 24px", borderTop: `1px solid ${C.border}`, background: C.bg, textAlign: "center", fontSize: 11, color: C.textMuted }}>
                        Cet email a été envoyé automatiquement par Illizeo.<br />
                        Vous recevez cet email car vous faites partie d'un parcours d'intégration.<br />
                        <span style={{ color: C.pink }}>illizeo.com</span>
                      </div>
                    </div>
                    {/* Test send */}
                    {tplPanelMode === "edit" && tplPanelData.id && (
                      <div style={{ marginTop: 16, padding: "14px 16px", background: C.bg, borderRadius: 10, display: "flex", alignItems: "center", gap: 10 }}>
                        <Send size={14} color={C.pink} />
                        <span style={{ fontSize: 12, color: C.text, fontWeight: 500 }}>Envoyer un test :</span>
                        <button onClick={() => showPrompt("Envoyer un email de test à :", async (email) => {
                          try { const res = await sendTestEmail(tplPanelData.id, email); addToast_admin(res.message); }
                          catch { addToast_admin("Erreur lors de l'envoi"); }
                        }, { label: "Email destinataire", type: "email", defaultValue: auth.user?.email || "" })} className="iz-btn-outline" style={{ ...sBtn("outline"), padding: "5px 12px", fontSize: 11, display: "flex", alignItems: "center", gap: 4 }}><Send size={12} /> Envoyer un test</button>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div style={{ padding: "16px 28px", borderTop: `1px solid ${C.border}`, display: "flex", gap: 12, justifyContent: "space-between" }}>
                <div style={{ display: "flex", gap: 8 }}>
                  {tplPanelMode === "edit" && <button onClick={() => { setConfirmDialog({ message: "Supprimer ce template ?", onConfirm: async () => { try { await apiDeleteEmailTpl(tplPanelData.id); addToast_admin("Template supprimé"); setTplPanelMode("closed"); refetchActions(); } catch {} setConfirmDialog(null); }}); }} style={{ ...sBtn("outline"), color: C.red, borderColor: C.red, fontSize: 13 }}>{t('common.delete')}</button>}
                  {tplPanelMode === "edit" && tplPanelData.id && <button onClick={async () => { try { await apiDuplicateEmailTpl(tplPanelData.id); addToast_admin("Template dupliqué"); refetchActions(); } catch {} }} style={{ ...sBtn("outline"), fontSize: 13 }}>{t('common.duplicate')}</button>}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => setTplPanelMode("closed")} style={{ ...sBtn("outline"), fontSize: 13 }}>{t('common.cancel')}</button>
                  <button onClick={async () => {
                    try {
                      const payload: Record<string, any> = { nom: tplPanelData.nom, sujet: tplPanelData.sujet, declencheur: tplPanelData.declencheur, variables: tplPanelData.variables, actif: tplPanelData.actif, contenu: tplPanelData.contenu, translations: buildTranslationsPayload() };
                      if (tplPanelMode === "create") { await apiCreateEmailTpl(payload); addToast_admin("Template créé"); }
                      else { await apiUpdateEmailTpl(tplPanelData.id, payload); addToast_admin("Template modifié"); }
                      setTplPanelMode("closed"); refetchActions();
                    } catch { addToast_admin(t('toast.error')); }
                  }} className="iz-btn-pink" style={{ ...sBtn("pink"), fontSize: 13 }}>{tplPanelMode === "create" ? t('common.create') : t('common.save')}</button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      );
    };

    // ─── EQUIPES ───────────────────────────────────────────────
    const ACCOMP_ROLES = [
      { key: "manager", label: t('team_role.manager'), icon: Users, color: "#4CAF50" },
      { key: "hrbp", label: t('team_role.hrbp'), icon: UserCheck, color: "#C2185B" },
      { key: "buddy", label: "Buddy / Parrain", icon: Hand, color: "#F9A825" },
      { key: "it", label: "IT Support", icon: Clock, color: "#1A73E8" },
      { key: "recruteur", label: "Recruteur", icon: Search, color: "#7B5EA7" },
    ];

    const renderEquipes = () => (
      <div style={{ flex: 1, padding: "24px 32px", overflow: "auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 600, margin: 0 }}>{t('admin.teams_groups')}</h1>
            <p style={{ fontSize: 12, color: C.textLight, margin: "4px 0 0" }}>Gérez les équipes d'accompagnement des onboardees</p>
          </div>
          <button onClick={() => { setTeamPanelData({ nom: "", description: "", site: "", members: [] }); resetTr(); setTeamPanelMode("create"); }} className="iz-btn-pink" style={{ ...sBtn("pink"), display: "flex", alignItems: "center", gap: 6 }}><Plus size={16} /> Nouvelle équipe</button>
        </div>

        {/* Workload overview */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, marginBottom: 24 }}>
          {ACCOMP_ROLES.map(r => {
            const count = obTeams.reduce((acc, t) => acc + (t.members || []).filter((m: any) => m.role === r.key).length, 0);
            return (
              <div key={r.key} className="iz-card" style={{ ...sCard, textAlign: "center", padding: 14 }}>
                <r.icon size={20} color={r.color} style={{ marginBottom: 4 }} />
                <div style={{ fontSize: 20, fontWeight: 700, color: r.color }}>{count}</div>
                <div style={{ fontSize: 10, color: C.textLight }}>{r.label}s</div>
              </div>
            );
          })}
        </div>

        {/* Teams */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
          {obTeams.map((team: any) => (
            <div key={team.id} className="iz-card iz-fade-up" style={{ ...sCard }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 600 }}>{team.nom}</div>
                  <div style={{ fontSize: 11, color: C.textLight }}>{team.description}{team.site ? ` · ${team.site}` : ""}</div>
                </div>
                <button onClick={() => { setTeamPanelData({ id: team.id, nom: team.nom, description: team.description || "", site: team.site || "", members: (team.members || []).map((m: any) => ({ user_id: m.user_id, role: m.role, name: m.user?.name })) }); setContentTranslations(team.translations || {}); setTeamPanelMode("edit"); }} className="iz-btn-outline" style={{ ...sBtn("outline"), fontSize: 11, padding: "5px 14px" }}>{t('common.edit')}</button>
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {(team.members || []).map((m: any) => {
                  const roleInfo = ACCOMP_ROLES.find(r => r.key === m.role);
                  return (
                    <div key={m.user_id} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 10px", background: `${roleInfo?.color || C.pink}10`, borderRadius: 8 }}>
                      <div style={{ width: 24, height: 24, borderRadius: "50%", background: roleInfo?.color || C.pink, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 600, color: C.white }}>
                        {m.user?.name?.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                      </div>
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 500 }}>{m.user?.name}</div>
                        <div style={{ fontSize: 9, color: roleInfo?.color }}>{roleInfo?.label}</div>
                      </div>
                    </div>
                  );
                })}
                {(team.members || []).length === 0 && <div style={{ fontSize: 11, color: C.textMuted }}>Aucun membre</div>}
              </div>
            </div>
          ))}
          {obTeams.length === 0 && <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: 40, color: C.textMuted }}>Aucune équipe d'accompagnement. Créez-en une !</div>}
        </div>

        {/* Team panel */}
        {teamPanelMode !== "closed" && (
          <>
            <div onClick={() => setTeamPanelMode("closed")} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.3)", zIndex: 1000 }} />
            <div className="iz-panel" style={{ position: "fixed", top: 0, right: 0, width: 520, height: "100vh", background: C.white, boxShadow: "-4px 0 24px rgba(0,0,0,.1)", zIndex: 1001, display: "flex", flexDirection: "column" }}>
              <div style={{ padding: "24px 28px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>{teamPanelMode === "create" ? "Nouvelle équipe" : "Modifier l'équipe"}</h2>
                <button onClick={() => setTeamPanelMode("closed")} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={22} color={C.textLight} /></button>
              </div>
              <div style={{ flex: 1, padding: "24px 28px", overflow: "auto" }}>
                <div style={{ marginBottom: 16 }}><label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Nom de l'équipe *</label><TranslatableField value={teamPanelData.nom} onChange={v => setTeamPanelData((p: any) => ({ ...p, nom: v }))} placeholder="Ex: Team Genève" currentLang={lang} activeLangs={activeLanguages} translations={contentTranslations.nom} onTranslationsChange={tr => setTr("nom", tr)} /></div>
                <div style={{ marginBottom: 16 }}><label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Description</label><TranslatableField multiline rows={2} value={teamPanelData.description} onChange={v => setTeamPanelData((p: any) => ({ ...p, description: v }))} currentLang={lang} activeLangs={activeLanguages} translations={contentTranslations.description} onTranslationsChange={tr => setTr("description", tr)} /></div>
                <div style={{ marginBottom: 16 }}><label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Site (auto-assignation)</label><select value={teamPanelData.site} onChange={e => setTeamPanelData((p: any) => ({ ...p, site: e.target.value }))} style={{ ...sInput, cursor: "pointer" }}><option value="">Aucun</option>{SITES.map(s => <option key={s} value={s}>{s}</option>)}</select></div>

                {/* Members */}
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 8 }}>Membres de l'équipe</label>
                  {(teamPanelData.members || []).map((m: any, i: number) => (
                    <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "center" }}>
                      <select value={m.role} onChange={e => { const arr = [...teamPanelData.members]; arr[i] = { ...arr[i], role: e.target.value }; setTeamPanelData((p: any) => ({ ...p, members: arr })); }} style={{ ...sInput, width: 130, fontSize: 12, cursor: "pointer" }}>
                        {ACCOMP_ROLES.map(r => <option key={r.key} value={r.key}>{r.label}</option>)}
                      </select>
                      <select value={m.user_id || ""} onChange={e => { const arr = [...teamPanelData.members]; arr[i] = { ...arr[i], user_id: Number(e.target.value) }; setTeamPanelData((p: any) => ({ ...p, members: arr })); }} style={{ ...sInput, flex: 1, fontSize: 12, cursor: "pointer" }}>
                        <option value="">Sélectionner...</option>
                        {adminUsers.filter(u => ["admin_rh", "manager", "super_admin", "admin"].includes(u.role)).map((u: any) => <option key={u.id} value={u.id}>{u.name} ({u.role})</option>)}
                      </select>
                      <button onClick={() => { const arr = teamPanelData.members.filter((_: any, j: number) => j !== i); setTeamPanelData((p: any) => ({ ...p, members: arr })); }} style={{ background: "none", border: "none", cursor: "pointer", color: C.red }}><X size={14} /></button>
                    </div>
                  ))}
                  <button onClick={() => setTeamPanelData((p: any) => ({ ...p, members: [...(p.members || []), { role: "buddy", user_id: null }] }))} style={{ fontSize: 11, color: C.pink, background: "none", border: "none", cursor: "pointer", fontWeight: 600, fontFamily: font }}>+ Ajouter un membre</button>
                </div>
              </div>
              <div style={{ padding: "16px 28px", borderTop: `1px solid ${C.border}`, display: "flex", gap: 12, justifyContent: "space-between" }}>
                <div>{teamPanelMode === "edit" && <button onClick={() => { setConfirmDialog({ message: "Supprimer cette équipe ?", onConfirm: async () => { try { await apiDeleteTeam(teamPanelData.id); addToast_admin("Équipe supprimée"); setTeamPanelMode("closed"); getOnboardingTeams().then(setObTeams); } catch {} setConfirmDialog(null); }}); }} style={{ ...sBtn("outline"), color: C.red, borderColor: C.red, fontSize: 13 }}>{t('common.delete')}</button>}</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => setTeamPanelMode("closed")} style={{ ...sBtn("outline"), fontSize: 13 }}>{t('common.cancel')}</button>
                  <button onClick={async () => {
                    const payload: Record<string, any> = { nom: teamPanelData.nom, description: teamPanelData.description, site: teamPanelData.site, members: teamPanelData.members.filter((m: any) => m.user_id), translations: buildTranslationsPayload() };
                    try {
                      if (teamPanelMode === "create") { await apiCreateTeam(payload); addToast_admin("Équipe créée"); }
                      else { await apiUpdateTeam(teamPanelData.id, payload); addToast_admin("Équipe modifiée"); }
                      setTeamPanelMode("closed"); getOnboardingTeams().then(setObTeams);
                    } catch { addToast_admin(t('toast.error')); }
                  }} className="iz-btn-pink" style={{ ...sBtn("pink"), fontSize: 13 }}>{teamPanelMode === "create" ? t('common.create') : t('common.save')}</button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  
    // ─── NOTIFICATIONS ─────────────────────────────────────────
    const NOTIF_TYPES = [
      { key: "anniversaire", label: t('notifcfg.birthday'), icon: Gift },
      { key: "fin_contrat", label: t('notifcfg.contract_end'), icon: FileSignature },
      { key: "fin_essai", label: t('notifcfg.trial_end'), icon: Clock },
      { key: "nouveau_questionnaire", label: t('notifcfg.new_survey'), icon: ListChecks },
      { key: "nouvelle_tache", label: t('notifcfg.new_task'), icon: ClipboardCheck },
      { key: "relance_retard", label: t('notifcfg.late_reminder'), icon: AlertTriangle },
      { key: "piece_a_valider", label: t('notifcfg.doc_to_validate'), icon: FileUp },
      { key: "piece_completee", label: t('notifcfg.doc_complete'), icon: CheckCircle },
      { key: "piece_refusee", label: t('notifcfg.doc_refused'), icon: XCircle },
      { key: "arrivees_semaine", label: t('notifcfg.weekly_arrivals'), icon: CalendarDays },
      { key: "nouvelle_recrue", label: t('notifcfg.new_hire'), icon: UserPlus },
      { key: "questionnaire_complete", label: t('notifcfg.survey_complete'), icon: CheckCircle },
      { key: "invitation_utilisateur", label: "Invitation d'un utilisateur", icon: Mail },
      { key: "delegation", label: "Délégation créée / modifiée", icon: ArrowRight },
    ];
    const toggleNotif = (key: string, channel: "email" | "push" | "inapp") => {
      setNotifConfig(prev => {
        const next = { ...prev, [key]: { ...prev[key], [channel]: !prev[key]?.[channel] } };
        localStorage.setItem("illizeo_notif_config", JSON.stringify(next));
        updateCompanySettings({ notif_config: JSON.stringify(next) }).then(() => addToast_admin(t('toast.saved'))).catch(() => addToast_admin(t('toast.error')));
        return next;
      });
    };

    const renderNotifications_admin = () => (
      <div style={{ flex: 1, padding: "24px 32px", overflow: "auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <h1 style={{ fontSize: 22, fontWeight: 600, margin: 0 }}>Configuration des notifications</h1>
        </div>
        <p style={{ fontSize: 13, color: C.textMuted, marginBottom: 16 }}>Choisissez quelles notifications sont envoyées et par quel canal.</p>

        <div className="iz-card" style={{ ...sCard, overflow: "hidden", padding: 0 }}>
          {/* Header */}
          <div style={{ display: "grid", gridTemplateColumns: "2fr 80px 80px 80px", gap: 0, padding: "12px 20px", background: C.bg, borderBottom: `1px solid ${C.border}`, fontSize: 11, fontWeight: 600, color: C.textLight, textTransform: "uppercase" }}>
            <span>Notification</span><span style={{ textAlign: "center" }}>Email</span><span style={{ textAlign: "center" }}>Push</span><span style={{ textAlign: "center" }}>In-app</span>
          </div>
          {NOTIF_TYPES.map((n, i) => {
            const cfg = notifConfig[n.key] || { email: true, push: false, inapp: true };
            return (
            <div key={n.key} style={{ display: "grid", gridTemplateColumns: "2fr 80px 80px 80px", gap: 0, padding: "12px 20px", borderBottom: i < NOTIF_TYPES.length - 1 ? `1px solid ${C.border}` : "none", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <n.icon size={15} color={C.textMuted} />
                <span style={{ fontSize: 13 }}>{n.label}</span>
              </div>
              {(["email", "push", "inapp"] as const).map(ch => (
                <div key={ch} style={{ textAlign: "center" }}>
                  <div onClick={() => toggleNotif(n.key, ch)} style={{ width: 38, height: 20, borderRadius: 10, background: cfg[ch] ? C.green : C.border, cursor: "pointer", position: "relative", transition: "all .2s", display: "inline-block" }}>
                    <div style={{ width: 16, height: 16, borderRadius: "50%", background: C.white, position: "absolute", top: 2, left: cfg[ch] ? 20 : 2, transition: "all .2s", boxShadow: "0 1px 3px rgba(0,0,0,.2)" }} />
                  </div>
                </div>
              ))}
            </div>
            );
          })}
        </div>
      </div>
    );
  
    // ─── ENTREPRISE ────────────────────────────────────────────
    const BLOCK_TYPES = [
      { type: "hero", label: "Bannière d'accueil", icon: Clapperboard },
      { type: "text", label: t('block.text'), icon: FileText },
      { type: "mission", label: t('block.mission'), icon: Target },
      { type: "stats", label: t('block.key_figures'), icon: BarChart3 },
      { type: "values", label: t('block.values'), icon: Star },
      { type: "video", label: t('block.videos'), icon: Play },
      { type: "team", label: t('block.team'), icon: Users },
    ];

    const renderEntreprise_admin = () => {
      const editBlock = companyBlocks.find(b => b.id === editingBlockId);
      return (
      <div style={{ flex: 1, padding: "24px 32px", overflow: "auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <h1 style={{ fontSize: 22, fontWeight: 600, margin: 0 }}>Page entreprise</h1>
          <div style={{ display: "flex", gap: 8 }}>
            <select onChange={async e => {
              if (!e.target.value) return;
              const newBlock = await apiCreateBlock({ type: e.target.value, titre: "Nouveau bloc", contenu: "", ordre: companyBlocks.length, actif: true, data: {} });
              setCompanyBlocks(prev => [...prev, newBlock]);
              setEditingBlockId(newBlock.id);
              e.target.value = "";
              addToast_admin("Bloc créé");
            }} style={{ ...sInput, width: 200, fontSize: 12, cursor: "pointer" }}>
              <option value="">+ Ajouter un bloc...</option>
              {BLOCK_TYPES.map(bt => <option key={bt.type} value={bt.type}>{bt.label}</option>)}
            </select>
          </div>
        </div>

        {/* Blocks list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {companyBlocks.map(block => {
            const bt = BLOCK_TYPES.find(t => t.type === block.type);
            const BIcon = bt?.icon || FileText;
            return (
              <div key={block.id} className="iz-card" style={{ ...sCard, display: "flex", alignItems: "center", gap: 14, opacity: block.actif ? 1 : 0.5, padding: "14px 18px" }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: C.pinkBg, display: "flex", alignItems: "center", justifyContent: "center" }}><BIcon size={16} color={C.pink} /></div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{block.titre || bt?.label || block.type}</div>
                  <div style={{ fontSize: 11, color: C.textLight }}>{bt?.label} · Ordre: {block.ordre}</div>
                </div>
                <div onClick={async () => { await apiUpdateBlock(block.id, { actif: !block.actif }); setCompanyBlocks(prev => prev.map(b => b.id === block.id ? { ...b, actif: !b.actif } : b)); addToast_admin(block.actif ? "Bloc désactivé" : "Bloc activé"); }}
                  style={{ width: 40, height: 22, borderRadius: 11, background: block.actif ? C.green : C.border, cursor: "pointer", position: "relative", transition: "all .2s", flexShrink: 0 }}>
                  <div style={{ width: 18, height: 18, borderRadius: "50%", background: C.white, position: "absolute", top: 2, left: block.actif ? 20 : 2, transition: "all .2s", boxShadow: "0 1px 3px rgba(0,0,0,.2)" }} />
                </div>
                <button onClick={() => setEditingBlockId(block.id === editingBlockId ? null : block.id)} className="iz-btn-outline" style={{ ...sBtn("outline"), fontSize: 11, padding: "5px 12px" }}>{t('common.edit')}</button>
                <button onClick={() => {
                  setConfirmDialog({ message: "Supprimer ce bloc ?", onConfirm: async () => {
                    await apiDeleteBlock(block.id);
                    setCompanyBlocks(prev => prev.filter(b => b.id !== block.id));
                    setConfirmDialog(null);
                    addToast_admin("Bloc supprimé");
                  }});
                }} style={{ background: "none", border: "none", cursor: "pointer", color: C.textMuted }}><X size={16} /></button>
              </div>
            );
          })}
        </div>

        {/* Edit panel */}
        {editBlock && (
          <>
            <div onClick={() => setEditingBlockId(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.3)", zIndex: 1000 }} />
            <div className="iz-panel" style={{ position: "fixed", top: 0, right: 0, width: 520, height: "100vh", background: C.white, boxShadow: "-4px 0 24px rgba(0,0,0,.1)", zIndex: 1001, display: "flex", flexDirection: "column" }}>
              <div style={{ padding: "24px 28px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>Modifier le bloc</h2>
                <button onClick={() => setEditingBlockId(null)} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={22} color={C.textLight} /></button>
              </div>
              <div style={{ flex: 1, padding: "24px 28px", overflow: "auto" }}>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Titre</label>
                  <input value={editBlock.titre || ""} onChange={e => setCompanyBlocks(prev => prev.map(b => b.id === editBlock.id ? { ...b, titre: e.target.value } : b))} style={sInput} />
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Contenu</label>
                  <textarea value={editBlock.contenu || ""} onChange={e => setCompanyBlocks(prev => prev.map(b => b.id === editBlock.id ? { ...b, contenu: e.target.value } : b))} rows={4} style={{ ...sInput, resize: "vertical" }} />
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Ordre</label>
                  <input type="number" value={editBlock.ordre} onChange={e => setCompanyBlocks(prev => prev.map(b => b.id === editBlock.id ? { ...b, ordre: Number(e.target.value) } : b))} style={{ ...sInput, width: 80 }} />
                </div>
                {/* Preview */}
                <div style={{ marginTop: 20, padding: "16px", background: C.bg, borderRadius: 10 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: C.textMuted, textTransform: "uppercase", marginBottom: 10 }}>Aperçu</div>
                  {renderCompanyBlock(editBlock)}
                </div>
              </div>
              <div style={{ padding: "16px 28px", borderTop: `1px solid ${C.border}`, display: "flex", gap: 8, justifyContent: "flex-end" }}>
                <button onClick={() => setEditingBlockId(null)} style={{ ...sBtn("outline"), fontSize: 13 }}>{t('common.cancel')}</button>
                <button onClick={async () => {
                  await apiUpdateBlock(editBlock.id, { titre: editBlock.titre, contenu: editBlock.contenu, ordre: editBlock.ordre, data: editBlock.data });
                  addToast_admin("Bloc enregistré");
                  setEditingBlockId(null);
                }} className="iz-btn-pink" style={{ ...sBtn("pink"), fontSize: 13 }}>{t('common.save')}</button>
              </div>
            </div>
          </>
        )}
      </div>
      );
    };
  
    // ─── MESSAGERIE ────────────────────────────────────────────
    const renderMessagerie_admin = () => renderMessagerie();
  
    // ─── NPS ───────────────────────────────────────────────────
    const renderNPS = () => {
      const reloadNps = () => { getNpsSurveys().then(setNpsSurveys).catch(() => {}); getNpsStats().then(setNpsStats).catch(() => {}); };
      const npsColor = (score: number) => score >= 50 ? C.green : score >= 0 ? C.amber : C.red;
      return (
      <div style={{ flex: 1, padding: "24px 32px", overflow: "auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <h1 style={{ fontSize: 22, fontWeight: 600, margin: 0 }}>NPS & Satisfaction</h1>
          <button onClick={() => { setNpsPanelData({ titre: "", description: "", type: "nps", declencheur: "fin_parcours", questions: [{ text: "Sur une échelle de 0 à 10, recommanderiez-vous notre processus d'onboarding ?", type: "nps" }], actif: true }); resetTr(); setNpsPanelMode("create"); }} className="iz-btn-pink" style={{ ...sBtn("pink"), display: "flex", alignItems: "center", gap: 6 }}><Plus size={14} /> Nouveau questionnaire</button>
        </div>

        {/* Explanation */}
        <div style={{ padding: "16px 20px", background: C.blueLight, borderRadius: 10, marginBottom: 20, fontSize: 12, color: C.blue, lineHeight: 1.7 }}>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>Comment fonctionne le NPS & Satisfaction ?</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <b>1. Créez un questionnaire</b> — Cliquez "Nouveau questionnaire" et ajoutez des questions de type NPS (0-10), note (1-5 étoiles), texte libre ou choix multiple.<br/>
              <b>2. Envoyez-le</b> — Cliquez "Envoyer à tous" pour créer une enquête pour chaque collaborateur. L'envoi peut aussi être automatique via un workflow (fin de parcours, date spécifique...).<br/>
              <b>3. Collectez les réponses</b> — Les collaborateurs répondent depuis leur espace "Satisfaction". Vous suivez les résultats ici en temps réel.
            </div>
            <div>
              <b>Score NPS</b> = % Promoteurs (9-10) − % Détracteurs (0-6)<br/>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><div style={{ width: 8, height: 8, borderRadius: 2, background: C.green }} /> Promoteurs (9-10) : recommandent activement</span><br/>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><div style={{ width: 8, height: 8, borderRadius: 2, background: "#F9A825" }} /> Passifs (7-8) : satisfaits mais pas engagés</span><br/>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><div style={{ width: 8, height: 8, borderRadius: 2, background: C.red }} /> Détracteurs (0-6) : insatisfaits</span><br/>
              Un score &gt; 50 est excellent, &gt; 0 est bon, &lt; 0 nécessite des actions.
            </div>
          </div>
        </div>

        {/* KPI cards */}
        {npsStats && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
            <div className="iz-card" style={{ ...sCard, textAlign: "center", padding: "20px 16px" }}>
              <div style={{ fontSize: 36, fontWeight: 800, color: npsColor(npsStats.nps_score) }}>{npsStats.nps_score}</div>
              <div style={{ fontSize: 11, color: C.textMuted }}>Score NPS</div>
            </div>
            <div className="iz-card" style={{ ...sCard, textAlign: "center", padding: "20px 16px" }}>
              <div style={{ fontSize: 36, fontWeight: 800, color: C.amber }}>{npsStats.avg_rating.toFixed(1)}<span style={{ fontSize: 16, color: C.textMuted }}>/5</span></div>
              <div style={{ fontSize: 11, color: C.textMuted }}>Satisfaction moyenne</div>
            </div>
            <div className="iz-card" style={{ ...sCard, textAlign: "center", padding: "20px 16px" }}>
              <div style={{ fontSize: 36, fontWeight: 800, color: C.blue }}>{npsStats.response_rate}%</div>
              <div style={{ fontSize: 11, color: C.textMuted }}>Taux de réponse</div>
            </div>
            <div className="iz-card" style={{ ...sCard, textAlign: "center", padding: "20px 16px" }}>
              <div style={{ fontSize: 36, fontWeight: 800, color: C.text }}>{npsStats.total_completed}<span style={{ fontSize: 16, color: C.textMuted }}>/{npsStats.total_responses}</span></div>
              <div style={{ fontSize: 11, color: C.textMuted }}>Réponses</div>
            </div>
          </div>
        )}

        {/* NPS distribution bar */}
        {npsStats && npsStats.total_completed > 0 && (
          <div className="iz-card" style={{ ...sCard, padding: "16px 20px", marginBottom: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Répartition NPS</div>
            <div style={{ display: "flex", height: 28, borderRadius: 8, overflow: "hidden", marginBottom: 8 }}>
              {npsStats.promoters > 0 && <div style={{ flex: npsStats.promoters, background: C.green, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, color: C.white }}>{npsStats.promoters}</div>}
              {npsStats.passives > 0 && <div style={{ flex: npsStats.passives, background: C.amber, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, color: C.white }}>{npsStats.passives}</div>}
              {npsStats.detractors > 0 && <div style={{ flex: npsStats.detractors, background: C.red, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, color: C.white }}>{npsStats.detractors}</div>}
            </div>
            <div style={{ display: "flex", gap: 16, fontSize: 11 }}>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}><div style={{ width: 8, height: 8, borderRadius: 2, background: C.green }} /> Promoteurs (9-10) : {npsStats.promoters}</span>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}><div style={{ width: 8, height: 8, borderRadius: 2, background: C.amber }} /> Passifs (7-8) : {npsStats.passives}</span>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}><div style={{ width: 8, height: 8, borderRadius: 2, background: C.red }} /> Détracteurs (0-6) : {npsStats.detractors}</span>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: "flex", gap: 0, borderBottom: `2px solid ${C.border}`, marginBottom: 16 }}>
          {([
            { id: "surveys" as const, label: t('nps.surveys'), count: npsSurveys.length },
            { id: "responses" as const, label: t('nps.recent_responses'), count: npsStats?.total_completed || 0 },
          ]).map(tab => (
            <button key={tab.id} onClick={() => { setNpsTab(tab.id); setNpsSelectedSurvey(null); }} style={{ padding: "10px 20px", fontSize: 13, fontWeight: npsTab === tab.id ? 600 : 400, color: npsTab === tab.id ? C.pink : C.textLight, background: "none", border: "none", borderBottom: npsTab === tab.id ? `2px solid ${C.pink}` : "2px solid transparent", cursor: "pointer", fontFamily: font, marginBottom: -2, display: "flex", alignItems: "center", gap: 6 }}>
              {tab.label} <span style={{ fontSize: 10, padding: "1px 6px", borderRadius: 8, background: npsTab === tab.id ? C.pinkBg : C.bg, color: npsTab === tab.id ? C.pink : C.textMuted }}>{tab.count}</span>
            </button>
          ))}
        </div>

        {/* Surveys list */}
        {npsTab === "surveys" && !npsSelectedSurvey && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {npsSurveys.map(s => (
              <div key={s.id} className="iz-card" style={{ ...sCard, cursor: "pointer", padding: 0, overflow: "hidden" }} onClick={async () => { try { const full = await showNpsSurvey(s.id); setNpsSelectedSurvey(full); setNpsTab("responses"); } catch {} }}>
                <div style={{ padding: "16px 20px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 15, fontWeight: 600 }}>{s.titre}</span>
                    <span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 600, background: s.actif ? C.greenLight : C.bg, color: s.actif ? C.green : C.textMuted }}>{s.actif ? "Actif" : "Inactif"}</span>
                  </div>
                  {s.description && <div style={{ fontSize: 12, color: C.textLight, marginBottom: 8 }}>{s.description}</div>}
                  <div style={{ display: "flex", gap: 12, fontSize: 11, color: C.textMuted }}>
                    <span>Type : {s.type === "nps" ? "NPS" : s.type === "satisfaction" ? "Satisfaction" : "Custom"}</span>
                    <span>{s.questions?.length || 0} question{(s.questions?.length || 0) > 1 ? "s" : ""}</span>
                    <span>{s.responses_count || 0} réponse{(s.responses_count || 0) > 1 ? "s" : ""}</span>
                  </div>
                </div>
                <div style={{ padding: "10px 20px", borderTop: `1px solid ${C.border}`, display: "flex", gap: 6 }} onClick={e => e.stopPropagation()}>
                  <button onClick={() => { setNpsPanelData({ id: s.id, titre: s.titre, description: s.description || "", type: s.type, declencheur: s.declencheur, questions: s.questions || [], actif: s.actif }); setContentTranslations((s as any).translations || {}); setNpsPanelMode("edit"); }} className="iz-btn-outline" style={{ ...sBtn("outline"), padding: "5px 12px", fontSize: 11 }}>{t('common.edit')}</button>
                  <button onClick={async () => { try { await apiSendNpsAll(s.id); addToast_admin("Questionnaire envoyé à tous les collaborateurs"); } catch { addToast_admin(t('toast.error')); } }} className="iz-btn-outline" style={{ ...sBtn("outline"), padding: "5px 12px", fontSize: 11, display: "flex", alignItems: "center", gap: 4 }}><Send size={11} /> Envoyer à tous</button>
                </div>
              </div>
            ))}
            {npsSurveys.length === 0 && <div style={{ gridColumn: "1/-1", padding: "40px 20px", textAlign: "center", color: C.textMuted, fontSize: 13 }}>Aucun questionnaire créé</div>}
          </div>
        )}

        {/* Responses detail */}
        {npsTab === "responses" && npsSelectedSurvey && (
          <div>
            <button onClick={() => setNpsSelectedSurvey(null)} style={{ background: "none", border: "none", cursor: "pointer", color: C.pink, fontSize: 13, fontFamily: font, marginBottom: 12, display: "flex", alignItems: "center", gap: 4 }}><ChevronLeft size={14} /> Retour aux questionnaires</button>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>{npsSelectedSurvey.titre} — {npsSelectedSurvey.responses?.length || 0} réponses</h3>
            <div className="iz-card" style={{ ...sCard, overflow: "hidden", padding: 0 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1.5fr 0.6fr 0.6fr 2fr 1fr", gap: 0, padding: "10px 16px", background: C.bg, borderBottom: `1px solid ${C.border}`, fontSize: 11, fontWeight: 600, color: C.textLight, textTransform: "uppercase" }}>
                <span>Collaborateur</span><span>Score NPS</span><span>Note</span><span>Commentaire</span><span>Date</span>
              </div>
              {(npsSelectedSurvey.responses || []).filter(r => r.completed_at).map(r => (
                <div key={r.id} style={{ display: "grid", gridTemplateColumns: "1.5fr 0.6fr 0.6fr 2fr 1fr", gap: 0, padding: "12px 16px", borderBottom: `1px solid ${C.border}`, alignItems: "center", fontSize: 13 }}>
                  <div style={{ fontWeight: 500 }}>{r.collaborateur ? `${r.collaborateur.prenom} ${r.collaborateur.nom}` : `#${r.collaborateur_id}`}</div>
                  <div>{r.score !== null ? <span style={{ fontWeight: 700, color: r.score >= 9 ? C.green : r.score >= 7 ? C.amber : C.red }}>{r.score}/10</span> : "—"}</div>
                  <div>{r.rating !== null ? <span style={{ fontWeight: 600, color: C.amber }}>{r.rating}/5</span> : "—"}</div>
                  <div style={{ fontSize: 12, color: C.textLight, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.comment || "—"}</div>
                  <div style={{ fontSize: 11, color: C.textMuted }}>{fmtDate(r.completed_at)}</div>
                </div>
              ))}
              {(npsSelectedSurvey.responses || []).filter(r => r.completed_at).length === 0 && <div style={{ padding: "30px 20px", textAlign: "center", color: C.textMuted, fontSize: 13 }}>Aucune réponse reçue</div>}
            </div>
          </div>
        )}

        {/* Responses tab (no survey selected) */}
        {npsTab === "responses" && !npsSelectedSurvey && (
          <div style={{ padding: "30px 20px", textAlign: "center", color: C.textMuted, fontSize: 13 }}>Sélectionnez un questionnaire pour voir les réponses</div>
        )}

        {/* Create/Edit panel */}
        {npsPanelMode !== "closed" && (
          <>
            <div onClick={() => setNpsPanelMode("closed")} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.3)", zIndex: 1000 }} />
            <div className="iz-panel" style={{ position: "fixed", top: 0, right: 0, width: 560, height: "100vh", background: C.white, boxShadow: "-4px 0 24px rgba(0,0,0,.1)", zIndex: 1001, display: "flex", flexDirection: "column" }}>
              <div style={{ padding: "20px 24px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>{npsPanelMode === "create" ? "Nouveau questionnaire" : "Modifier le questionnaire"}</h2>
                <button onClick={() => setNpsPanelMode("closed")} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={18} /></button>
              </div>
              <div style={{ flex: 1, padding: 24, overflow: "auto", display: "flex", flexDirection: "column", gap: 14 }}>
                <div><label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Titre *</label><TranslatableField value={npsPanelData.titre} onChange={v => setNpsPanelData((p: any) => ({ ...p, titre: v }))} currentLang={lang} activeLangs={activeLanguages} translations={contentTranslations.titre} onTranslationsChange={tr => setTr("titre", tr)} style={sInput} placeholder="Ex: NPS Onboarding" /></div>
                <div><label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Description</label><TranslatableField multiline rows={3} value={npsPanelData.description || ""} onChange={v => setNpsPanelData((p: any) => ({ ...p, description: v }))} currentLang={lang} activeLangs={activeLanguages} translations={contentTranslations.description} onTranslationsChange={tr => setTr("description", tr)} style={{ ...sInput, minHeight: 60, resize: "vertical" }} /></div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div><label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Type</label>
                    <select value={npsPanelData.type} onChange={e => setNpsPanelData((p: any) => ({ ...p, type: e.target.value }))} style={sInput}>
                      <option value="nps">NPS (0-10)</option><option value="satisfaction">Satisfaction (1-5)</option><option value="custom">Personnalisé</option>
                    </select>
                  </div>
                  <div><label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Déclencheur</label>
                    <select value={npsPanelData.declencheur} onChange={e => setNpsPanelData((p: any) => ({ ...p, declencheur: e.target.value }))} style={sInput}>
                      <option value="fin_parcours">Fin de parcours</option><option value="fin_phase">Fin de phase</option><option value="manuel">Envoi manuel</option><option value="date_specifique">Date spécifique</option>
                    </select>
                  </div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.pink, marginTop: 8 }}>Questions</div>
                {(npsPanelData.questions || []).map((q: any, i: number) => (
                  <div key={i} style={{ padding: 12, background: C.bg, borderRadius: 10, display: "flex", gap: 10, alignItems: "start" }}>
                    <div style={{ flex: 1 }}>
                      <input value={q.text} onChange={e => { const qs = [...npsPanelData.questions]; qs[i] = { ...qs[i], text: e.target.value }; setNpsPanelData((p: any) => ({ ...p, questions: qs })); }} style={{ ...sInput, marginBottom: 6 }} placeholder="Texte de la question" />
                      <select value={q.type} onChange={e => { const qs = [...npsPanelData.questions]; qs[i] = { ...qs[i], type: e.target.value }; setNpsPanelData((p: any) => ({ ...p, questions: qs })); }} style={{ ...sInput, fontSize: 11 }}>
                        <option value="nps">NPS (0-10)</option><option value="rating">Note (1-5 étoiles)</option><option value="text">Texte libre</option><option value="choice">Choix multiple</option>
                      </select>
                    </div>
                    <button onClick={() => { const qs = npsPanelData.questions.filter((_: any, j: number) => j !== i); setNpsPanelData((p: any) => ({ ...p, questions: qs })); }} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}><X size={14} color={C.red} /></button>
                  </div>
                ))}
                <button onClick={() => setNpsPanelData((p: any) => ({ ...p, questions: [...(p.questions || []), { text: "", type: "text" }] }))} style={{ ...sBtn("outline"), fontSize: 12, display: "flex", alignItems: "center", gap: 4, alignSelf: "flex-start" }}><Plus size={12} /> Ajouter une question</button>
              </div>
              <div style={{ padding: "16px 24px", borderTop: `1px solid ${C.border}`, display: "flex", gap: 8, justifyContent: "space-between" }}>
                <div>{npsPanelMode === "edit" && npsPanelData.id && <button onClick={() => showConfirm("Supprimer ce questionnaire ?", async () => { try { await apiDeleteNps(npsPanelData.id); reloadNps(); setNpsPanelMode("closed"); } catch {} })} style={{ ...sBtn("outline"), color: C.red, borderColor: C.red }}>{t('common.delete')}</button>}</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => setNpsPanelMode("closed")} className="iz-btn-outline" style={sBtn("outline")}>{t('common.cancel')}</button>
                  <button onClick={async () => {
                    try {
                      const payload = { titre: npsPanelData.titre, description: npsPanelData.description, type: npsPanelData.type, declencheur: npsPanelData.declencheur, questions: npsPanelData.questions, actif: npsPanelData.actif, translations: buildTranslationsPayload() };
                      if (npsPanelMode === "edit" && npsPanelData.id) await apiUpdateNps(npsPanelData.id, payload);
                      else await apiCreateNps(payload);
                      reloadNps(); setNpsPanelMode("closed"); addToast_admin(npsPanelMode === "create" ? "Questionnaire créé" : "Questionnaire modifié");
                    } catch { addToast_admin(t('toast.error')); }
                  }} className="iz-btn-pink" style={sBtn("pink")}>{npsPanelMode === "create" ? t('common.create') : t('common.save')}</button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      );
    };

    // ─── CONTRATS ──────────────────────────────────────────────
    const renderContrats = () => (
      <div style={{ flex: 1, padding: "24px 32px", overflow: "auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <h1 style={{ fontSize: 22, fontWeight: 600, margin: 0 }}>{t('admin.contracts')}</h1>
          <button onClick={() => { setContratPanelData({ nom: "", type: "CDI", juridiction: "Suisse", actif: true }); resetTr(); setContratPanelMode("create"); }} className="iz-btn-pink" style={{ ...sBtn("pink"), display: "flex", alignItems: "center", gap: 6 }}><Plus size={16} /> {t('contrat.new')}</button>
        </div>
        <div className="iz-card" style={{ ...sCard, padding: 0, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead><tr style={{ background: C.bg }}>{["Nom","Type","Juridiction","Statut",""].map(h => <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontWeight: 600, fontSize: 11, color: C.textLight, textTransform: "uppercase" }}>{h}</th>)}</tr></thead>
            <tbody>
              {contrats.map((c: any) => (
                <tr key={c.id} style={{ borderBottom: `1px solid ${C.border}`, cursor: "pointer" }} onClick={() => { setContratPanelData({ id: c.id, nom: c.nom, type: c.type, juridiction: c.juridiction, actif: c.actif, fichier: c.fichier || "" }); setContentTranslations((c as any).translations || {}); setContratPanelMode("edit"); }}>
                  <td style={{ padding: "10px 14px", fontWeight: 500 }}>{c.nom}</td>
                  <td style={{ padding: "10px 14px" }}>{c.type}</td>
                  <td style={{ padding: "10px 14px" }}>{c.juridiction}</td>
                  <td style={{ padding: "10px 14px" }}><span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 600, background: c.actif ? C.greenLight : C.bg, color: c.actif ? C.green : C.textMuted }}>{c.actif ? "Actif" : "Inactif"}</span></td>
                  <td style={{ padding: "10px 14px" }}><button onClick={e => { e.stopPropagation(); setContratPanelData({ id: c.id, nom: c.nom, type: c.type, juridiction: c.juridiction, actif: c.actif, fichier: c.fichier || "" }); setContratPanelMode("edit"); }} className="iz-btn-outline" style={{ ...sBtn("outline"), padding: "3px 10px", fontSize: 11 }}>{t('common.edit')}</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Contrat panel */}
        {contratPanelMode !== "closed" && (
          <>
            <div onClick={() => setContratPanelMode("closed")} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.3)", zIndex: 1000 }} />
            <div className="iz-panel" style={{ position: "fixed", top: 0, right: 0, width: "65vw", maxWidth: 1100, height: "100vh", background: C.white, boxShadow: "-4px 0 24px rgba(0,0,0,.1)", zIndex: 1001, display: "flex", flexDirection: "column" }}>
              <div style={{ padding: "24px 28px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>{contratPanelMode === "create" ? "Nouveau contrat" : "Modifier le contrat"}</h2>
                <button onClick={() => setContratPanelMode("closed")} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={22} color={C.textLight} /></button>
              </div>
              <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
                {/* Left: form */}
                <div style={{ width: 300, flexShrink: 0, padding: "20px 24px", overflow: "auto", borderRight: `1px solid ${C.border}` }}>
                  <div style={{ marginBottom: 16 }}><label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Nom du contrat *</label><TranslatableField value={contratPanelData.nom} onChange={v => setContratPanelData((p: any) => ({ ...p, nom: v }))} placeholder="Ex: CDI — Droit Suisse" currentLang={lang} activeLangs={activeLanguages} translations={contentTranslations.nom} onTranslationsChange={tr => setTr("nom", tr)} /></div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                    <div><label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Type</label><select value={contratPanelData.type} onChange={e => setContratPanelData((p: any) => ({ ...p, type: e.target.value }))} style={{ ...sInput, cursor: "pointer" }}>{TYPES_CONTRAT.map(t => <option key={t} value={t}>{t}</option>)}<option value="Avenant">Avenant</option></select></div>
                    <div><label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Juridiction</label><select value={contratPanelData.juridiction} onChange={e => setContratPanelData((p: any) => ({ ...p, juridiction: e.target.value }))} style={{ ...sInput, cursor: "pointer" }}><option value="Suisse">Suisse</option><option value="France">France</option><option value="Multi">Multi</option></select></div>
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Fichier template</label>
                    <div style={{ border: `2px dashed ${C.border}`, borderRadius: 10, padding: "20px", textAlign: "center", cursor: "pointer", transition: "all .2s" }}
                      className="iz-upload-zone"
                      onDragOver={e => { e.preventDefault(); e.currentTarget.style.borderColor = C.pink; e.currentTarget.style.background = C.pinkBg; }}
                      onDragLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = "transparent"; }}
                      onDrop={e => { e.preventDefault(); e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = "transparent"; const file = e.dataTransfer.files[0]; if (file) { setContratPanelData((p: any) => ({ ...p, fichier: file.name, _file: file, _previewUrl: file.type === "application/pdf" ? URL.createObjectURL(file) : null })); } }}
                      onClick={() => { const input = document.createElement("input"); input.type = "file"; input.accept = ".docx,.doc,.pdf,.odt"; input.onchange = (e: any) => { const file = e.target.files[0]; if (file) { setContratPanelData((p: any) => ({ ...p, fichier: file.name, _file: file, _previewUrl: file.type === "application/pdf" ? URL.createObjectURL(file) : null })); } }; input.click(); }}>
                      {contratPanelData.fichier ? (
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                          <FileText size={20} color={C.pink} />
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 500, color: C.text }}>{contratPanelData.fichier}</div>
                            <div style={{ fontSize: 10, color: C.pink }}>Cliquez pour remplacer</div>
                          </div>
                        </div>
                      ) : (
                        <>
                          <Upload size={24} color={C.textMuted} style={{ marginBottom: 8 }} />
                          <div style={{ fontSize: 13, color: C.text }}>Glisser-déposer ou <span style={{ color: C.pink, fontWeight: 600 }}>parcourir</span></div>
                          <div style={{ fontSize: 11, color: C.textMuted, marginTop: 4 }}>Word (.docx), PDF, OpenDocument (.odt)</div>
                        </>
                      )}
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", background: C.bg, borderRadius: 10, cursor: "pointer", marginBottom: 16 }} onClick={() => setContratPanelData((p: any) => ({ ...p, actif: !p.actif }))}>
                    <div style={{ width: 20, height: 20, borderRadius: 4, border: `2px solid ${contratPanelData.actif ? C.pink : C.border}`, background: contratPanelData.actif ? C.pink : C.white, display: "flex", alignItems: "center", justifyContent: "center" }}>{contratPanelData.actif && <Check size={14} color={C.white} />}</div>
                    <span style={{ fontSize: 13, fontWeight: 500 }}>Contrat actif</span>
                  </div>
                  <div style={{ padding: "12px 14px", background: C.bg, borderRadius: 10, fontSize: 11, color: C.textLight }}>
                    <div style={{ fontWeight: 600, color: C.text, marginBottom: 4 }}>Signature électronique</div>
                    <div>Les contrats peuvent être envoyés pour signature via DocuSign ou UgoSign depuis le dossier du collaborateur, en utilisant le connecteur configuré dans Intégrations.</div>
                  </div>
                </div>
                {/* Right: preview */}
                <div style={{ flex: 1, background: C.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", overflow: "auto" }}>
                  {contratPanelData._previewUrl ? (
                    <iframe src={contratPanelData._previewUrl} style={{ width: "100%", height: "100%", border: "none" }} title="Prévisualisation" />
                  ) : contratPanelData.fichier ? (
                    <div style={{ textAlign: "center", padding: 40 }}>
                      <FileText size={64} color={C.textMuted} style={{ marginBottom: 16 }} />
                      <div style={{ fontSize: 15, fontWeight: 600, color: C.text, marginBottom: 4 }}>{contratPanelData.fichier}</div>
                      <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 16 }}>
                        {contratPanelData.fichier.endsWith('.pdf') ? 'Chargez un nouveau PDF pour prévisualiser' : 'Prévisualisation disponible pour les fichiers PDF uniquement'}
                      </div>
                      <div style={{ fontSize: 11, color: C.textLight }}>
                        Les fichiers Word (.docx) et OpenDocument (.odt) ne peuvent pas être prévisualisés dans le navigateur.<br/>
                        Uploadez un PDF pour voir l'aperçu ici.
                      </div>
                    </div>
                  ) : (
                    <div style={{ textAlign: "center", padding: 40 }}>
                      <Eye size={48} color={C.border} style={{ marginBottom: 16 }} />
                      <div style={{ fontSize: 14, fontWeight: 500, color: C.textMuted }}>Prévisualisation</div>
                      <div style={{ fontSize: 12, color: C.textLight, marginTop: 4 }}>Chargez un fichier PDF pour voir l'aperçu ici</div>
                    </div>
                  )}
                </div>
              </div>
              <div style={{ padding: "16px 28px", borderTop: `1px solid ${C.border}`, display: "flex", gap: 12, justifyContent: "space-between" }}>
                <div>{contratPanelMode === "edit" && <button onClick={() => { setConfirmDialog({ message: "Supprimer ce contrat ?", onConfirm: async () => { try { await apiDeleteContrat(contratPanelData.id); addToast_admin("Contrat supprimé"); setContratPanelMode("closed"); /* refetch */ } catch {} setConfirmDialog(null); }}); }} style={{ ...sBtn("outline"), color: C.red, borderColor: C.red, fontSize: 13 }}>{t('common.delete')}</button>}</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => setContratPanelMode("closed")} style={{ ...sBtn("outline"), fontSize: 13 }}>{t('common.cancel')}</button>
                  <button onClick={async () => {
                    try {
                      const payload: Record<string, any> = { nom: contratPanelData.nom, type: contratPanelData.type, juridiction: contratPanelData.juridiction, actif: contratPanelData.actif, fichier: contratPanelData.fichier, translations: buildTranslationsPayload() };
                      if (contratPanelMode === "create") { await apiCreateContrat(payload); addToast_admin("Contrat créé"); }
                      else { await apiUpdateContrat(contratPanelData.id, payload); addToast_admin("Contrat modifié"); }
                      setContratPanelMode("closed");
                    } catch { addToast_admin(t('toast.error')); }
                  }} className="iz-btn-pink" style={{ ...sBtn("pink"), fontSize: 13 }}>{contratPanelMode === "create" ? t('common.create') : t('common.save')}</button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  
    // ─── INTÉGRATIONS ──────────────────────────────────────────
    const INTEGRATION_META: Record<string, { desc: string; Icon: React.FC<any>; color: string; oauth?: boolean; apiKey?: boolean; sapConnect?: boolean; teamsConnect?: boolean; fields: { key: string; label: string; type: "text" | "password" | "select"; options?: string[] }[] }> = {
      docusign: { desc: "Signature électronique certifiée", Icon: FileSignature, color: "#FFD700", oauth: true, fields: [
        { key: "integration_key", label: "Integration Key (Client ID)", type: "text" },
        { key: "secret_key", label: "Secret Key", type: "password" },
        { key: "account_id", label: "Account ID (optionnel — récupéré auto)", type: "text" },
        { key: "environment", label: "Environnement", type: "select", options: ["demo", "production_na", "production_eu"] },
      ] },
      ugosign: { desc: "Signature électronique française — eIDAS & RGPD", Icon: PenTool, color: "#1A73E8", apiKey: true, fields: [] },
      native: { desc: "Signature intégrée à Illizeo", Icon: ShieldCheck, color: "#4CAF50", fields: [] },
      entra_id: { desc: "SSO, sync utilisateurs, groupes de sécurité", Icon: ShieldCheck, color: "#0078D4", apiKey: true, fields: [],
        connectEndpoint: "entra/connect", disconnectEndpoint: "entra/disconnect",
        configFields: [
          { key: "tenant_id", label: "Tenant ID (Directory ID)", type: "text" },
          { key: "client_id", label: "Application (Client) ID", type: "text" },
          { key: "client_secret", label: "Client Secret", type: "password" },
        ],
        guide: [
          { title: "1. Azure Portal", text: "portal.azure.com → Microsoft Entra ID → Inscriptions d'applications" },
          { title: "2. App Registration", text: "Sélectionnez ou créez l'app 'Illizeo Onboarding' → Copiez Tenant ID et Client ID" },
          { title: "3. Client Secret", text: "Certificats & secrets → Nouveau secret → Copiez la valeur" },
          { title: "4. Permissions API", text: "Autorisations de l'API → Microsoft Graph → User.Read.All, Group.Read.All, Directory.Read.All → Accorder le consentement admin" },
          { title: "5. Redirect URI", text: "Ajoutez le redirect URI affiché ci-dessous dans l'app Azure" },
        ],
      } as any,
      teams: { desc: "Notifications, bienvenue, réunions", Icon: Users, color: "#6264A7", teamsConnect: true, fields: [] },
      slack: { desc: "Notifications & messagerie d'équipe", Icon: MessageSquare, color: "#611F69", apiKey: true, fields: [],
        connectEndpoint: "ugosign/connect", disconnectEndpoint: "ugosign/disconnect",
        configFields: [
          { key: "webhook_url", label: "Webhook URL", type: "text" },
        ],
        guide: [
          { title: "1. Ouvrir Slack", text: "Allez dans le canal où vous voulez les notifications" },
          { title: "2. Ajouter un webhook", text: "Apps → Incoming Webhooks → Add to Slack" },
          { title: "3. Copier l'URL", text: "Collez l'URL du webhook ci-dessus" },
        ],
      } as any,
      teamtailor: { desc: "ATS — Recrutement européen", Icon: UserPlus, color: "#4834D4", apiKey: true, fields: [],
        connectEndpoint: "teamtailor/connect", disconnectEndpoint: "teamtailor/disconnect",
        configFields: [
          { key: "api_key", label: "Clé API", type: "password" },
        ],
        guide: [
          { title: "1. Accéder aux paramètres", text: "Teamtailor → Settings → Integrations → API Keys" },
          { title: "2. Créer une clé", text: "Cliquez 'New API Key' → Nom : 'Illizeo' → Copiez la clé générée" },
          { title: "3. Fonctionnalité", text: "Import automatique des candidats embauchés (statut 'Hired') pour déclencher l'onboarding" },
        ],
      } as any,
      smartrecruiters: { desc: "ATS — Import candidats automatique", Icon: ClipboardList, color: "#FF6B35", fields: [
        { key: "api_key", label: "Clé API", type: "password" },
        { key: "company_id", label: "Company ID", type: "text" },
      ]},
      sap: { desc: "SIRH — Synchronisation employés", Icon: Building2, color: "#0FAAFF", sapConnect: true, fields: [] },
      personio: { desc: "SIRH — Gestion RH européenne", Icon: Users, color: "#4CAF50", apiKey: true, fields: [],
        connectEndpoint: "personio/connect", disconnectEndpoint: "personio/disconnect",
        configFields: [
          { key: "client_id", label: "Client ID", type: "text" },
          { key: "client_secret", label: "Client Secret", type: "password" },
        ],
        guide: [
          { title: "1. Accéder aux paramètres API", text: "Personio → Settings → Integrations → API Credentials" },
          { title: "2. Générer les identifiants", text: "Cliquez 'Generate new credentials' → Sélectionnez les scopes : Employees (read), Absences (read)" },
          { title: "3. Copier Client ID et Client Secret", text: "Copiez les deux valeurs générées et collez-les ci-dessus" },
        ],
      } as any,
      bamboohr: { desc: "SIRH — Gestion RH pour PME", Icon: Users, color: "#73C41D", apiKey: true, fields: [],
        connectEndpoint: "bamboohr/connect", disconnectEndpoint: "bamboohr/disconnect",
        configFields: [
          { key: "company_domain", label: "Sous-domaine entreprise", type: "text" },
          { key: "api_key", label: "Clé API", type: "password" },
        ],
        guide: [
          { title: "1. Accéder aux paramètres API", text: "BambooHR → Account → API Keys" },
          { title: "2. Générer une clé", text: "Cliquez 'Add New Key' → Nom : 'Illizeo' → Copiez la clé" },
          { title: "3. Sous-domaine", text: "C'est la partie avant .bamboohr.com (ex: si votre URL est acme.bamboohr.com, le sous-domaine est 'acme')" },
        ],
      } as any,
      workday: { desc: "SIRH — HCM grands comptes", Icon: Building2, color: "#F68D2E", apiKey: true, fields: [],
        connectEndpoint: "workday/connect", disconnectEndpoint: "workday/disconnect",
        configFields: [
          { key: "host", label: "Hôte Workday (ex: wd5-impl-services1.workday.com)", type: "text" },
          { key: "tenant", label: "Tenant (ex: illizeo_dpt1)", type: "text" },
          { key: "client_id", label: "Client ID (API Client)", type: "text" },
          { key: "client_secret", label: "Client Secret", type: "password" },
          { key: "refresh_token", label: "Refresh Token", type: "password" },
        ],
        guide: [
          { title: "1. Créer un API Client", text: "Workday → Administration → Register API Client → Scope : Human Resources" },
          { title: "2. Générer les tokens", text: "Dans l'API Client → Generate Token → Copier Client ID, Secret et Refresh Token" },
          { title: "3. Hôte et Tenant", text: "L'hôte est dans l'URL Workday (ex: wd5-impl-services1.workday.com). Le tenant est le nom de votre instance." },
          { title: "4. Permissions", text: "L'ISU (Integration System User) doit avoir les droits : Get Workers, Get Organizations" },
        ],
      } as any,
      lucca: { desc: "SIRH — Timmi, Figgo, Poplee", Icon: Calendar, color: "#FF6B35", apiKey: true, fields: [],
        connectEndpoint: "lucca/connect", disconnectEndpoint: "lucca/disconnect",
        configFields: [
          { key: "subdomain", label: "Sous-domaine (ex: mon-entreprise)", type: "text" },
          { key: "api_key", label: "Clé API", type: "password" },
        ],
        guide: [
          { title: "1. Accéder à l'API Lucca", text: "Lucca → Paramètres → Intégrations → API" },
          { title: "2. Créer une application", text: "Cliquez 'Nouvelle application' → Nom : 'Illizeo' → Droits : Lecture employés, départements" },
          { title: "3. Copier la clé API", text: "Copiez le token généré et collez-le ci-dessus" },
          { title: "4. Sous-domaine", text: "C'est la partie avant .ilucca.net dans votre URL (ex: si votre URL est acme.ilucca.net, le sous-domaine est 'acme')" },
        ],
      } as any,
    };

    const CAT_LABELS: Record<string, string> = { identity: "Identity & SSO", signature: "Signature électronique", communication: "Communication", ats: "ATS (Recrutement)", sirh: "SIRH" };

    // ─── COOPTATION (PARRAINAGE) ───────────────────────────────
    const COOPT_STATUS_META: Record<string, { label: string; color: string; bg: string; icon: any }> = {
      en_attente: { label: "En attente", color: C.amber, bg: C.amberLight, icon: Hourglass },
      embauche: { label: "Embauché", color: C.blue, bg: C.blueLight, icon: UserCheck },
      valide: { label: "Validé", color: C.green, bg: C.greenLight, icon: CheckCircle2 },
      recompense_versee: { label: "Récompense versée", color: "#7B5EA7", bg: C.purple + "15", icon: Gift },
      refuse: { label: "Refusé", color: C.red, bg: C.redLight, icon: Ban },
    };

    const CAMP_PRIORITE_META: Record<string, { label: string; color: string; bg: string }> = {
      basse: { label: "Basse", color: C.textMuted, bg: C.bg },
      normale: { label: "Normale", color: C.blue, bg: C.blueLight },
      haute: { label: "Haute", color: C.amber, bg: C.amberLight },
      urgente: { label: "Urgente", color: C.red, bg: C.redLight },
    };
    const CAMP_STATUT_META: Record<string, { label: string; color: string; bg: string }> = {
      active: { label: "Active", color: C.green, bg: C.greenLight },
      pourvue: { label: "Pourvue", color: C.blue, bg: C.blueLight },
      fermee: { label: "Fermée", color: C.textMuted, bg: C.bg },
    };

    const renderCooptation = () => {
      const filtered = cooptations.filter(c => (cooptFilter === "all" || c.statut === cooptFilter) && (cooptCampaignFilter === "all" || c.campaign_id === cooptCampaignFilter));
      const reloadCoopt = () => {
        getCooptations().then(setCooptations).catch(() => {});
        getCooptationStats().then(setCooptStats).catch(() => {});
        getCooptationLeaderboard().then(setLeaderboard).catch(() => {});
      };
      const reloadCampaigns = () => { getCooptationCampaigns().then(setCampaigns).catch(() => {}); };
      return (
      <div style={{ flex: 1, padding: "24px 32px", overflow: "auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <h1 style={{ fontSize: 22, fontWeight: 600, margin: 0 }}>{t('coopt.title')}</h1>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setCooptSettingsOpen(true)} className="iz-btn-outline" style={{ ...sBtn("outline"), display: "flex", alignItems: "center", gap: 6 }}><Zap size={14} /> Paramètres</button>
            {cooptTab === "cooptations" && <button onClick={() => { setCooptPanelData({ referrer_name: "", referrer_email: "", candidate_name: "", candidate_email: "", candidate_poste: "", type_recompense: cooptSettings?.type_recompense_defaut || "prime", montant_recompense: cooptSettings?.montant_defaut || 500, mois_requis: cooptSettings?.mois_requis_defaut || 6, notes: "", campaign_id: null }); setCooptPanelMode("create"); }} className="iz-btn-pink" style={{ ...sBtn("pink"), display: "flex", alignItems: "center", gap: 6 }}><Plus size={14} /> Nouvelle cooptation</button>}
            {cooptTab === "campagnes" && <button onClick={() => { setCampaignPanelData({ titre: "", description: "", departement: "", site: "", type_contrat: "CDI", type_recompense: "prime", montant_recompense: cooptSettings?.montant_defaut || 500, mois_requis: cooptSettings?.mois_requis_defaut || 6, nombre_postes: 1, priorite: "normale", date_limite: "" }); setCampaignPanelMode("create"); }} className="iz-btn-pink" style={{ ...sBtn("pink"), display: "flex", alignItems: "center", gap: 6 }}><Plus size={14} /> Nouvelle campagne</button>}
          </div>
        </div>

        {/* Stats cards */}
        {cooptStats && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 20 }}>
            {[
              { label: "En cours", value: (cooptStats.en_attente || 0) + (cooptStats.embauche || 0), icon: Hourglass, color: C.blue, bg: C.blueLight },
              { label: "Validées", value: cooptStats.valide || 0, icon: CheckCircle2, color: C.green, bg: C.greenLight },
              { label: "Taux de conversion", value: `${cooptStats.conversion_rate || 0}%`, icon: TrendingUp, color: C.pink, bg: C.pinkBg },
              { label: "Délai moyen embauche", value: `${cooptStats.avg_days_to_hire || 0}j`, icon: Clock, color: "#5C6BC0", bg: C.blueLight },
              { label: "Récompenses versées", value: `${fmtCurrency(cooptStats.total_recompenses_versees || 0)}`, icon: Banknote, color: "#7B5EA7", bg: C.purple + "15" },
              { label: "En attente de versement", value: `${fmtCurrency(cooptStats.recompenses_en_attente || 0)}`, icon: CircleDollarSign, color: C.amber, bg: C.amberLight },
            ].map((s, i) => (
              <div key={i} className="iz-card" style={{ ...sCard, padding: "16px 20px", display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center" }}><s.icon size={18} color={s.color} /></div>
                <div><div style={{ fontSize: 20, fontWeight: 700, color: C.text }}>{s.value}</div><div style={{ fontSize: 11, color: C.textMuted }}>{s.label}</div></div>
              </div>
            ))}
          </div>
        )}

        {/* Main tabs: Cooptations / Campagnes / Classement */}
        <div style={{ display: "flex", gap: 0, borderBottom: `2px solid ${C.border}`, marginBottom: 16 }}>
          {([
            { id: "cooptations" as const, label: t('admin.cooptation'), count: cooptations.length },
            { id: "campagnes" as const, label: t('coopt.campaigns'), count: campaigns.filter(c => c.statut === "active").length },
            { id: "classement" as const, label: t('coopt.leaderboard'), count: leaderboard.length },
          ]).map(tab => (
            <button key={tab.id} onClick={() => setCooptTab(tab.id)} style={{ padding: "10px 20px", fontSize: 13, fontWeight: cooptTab === tab.id ? 600 : 400, color: cooptTab === tab.id ? C.pink : C.textLight, background: "none", border: "none", borderBottom: cooptTab === tab.id ? `2px solid ${C.pink}` : "2px solid transparent", cursor: "pointer", fontFamily: font, marginBottom: -2, display: "flex", alignItems: "center", gap: 6 }}>
              {tab.label} <span style={{ fontSize: 10, padding: "1px 6px", borderRadius: 8, background: cooptTab === tab.id ? C.pinkBg : C.bg, color: cooptTab === tab.id ? C.pink : C.textMuted }}>{tab.count}</span>
            </button>
          ))}
        </div>

        {/* ═══ TAB: Cooptations ═══ */}
        {cooptTab === "cooptations" && (<>
          {/* Filters row */}
          <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16, flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: 4, padding: 3, background: C.bg, borderRadius: 8, width: "fit-content" }}>
            {([["all", `Tous (${cooptations.length})`], ["en_attente", "En attente"], ["embauche", "Embauchés"], ["valide", "Validés"], ["recompense_versee", "Récompensés"], ["refuse", "Refusés"]] as const).map(([key, label]) => (
              <button key={key} onClick={() => setCooptFilter(key as any)} style={{
                padding: "6px 14px", borderRadius: 6, fontSize: 11, fontWeight: cooptFilter === key ? 600 : 400, border: "none", cursor: "pointer", fontFamily: font,
                background: cooptFilter === key ? C.pink : "transparent", color: cooptFilter === key ? C.white : C.textMuted, transition: "all .15s",
              }}>{label}</button>
            ))}
          </div>
          {campaigns.length > 0 && (
            <select value={cooptCampaignFilter} onChange={e => setCooptCampaignFilter(e.target.value === "all" ? "all" : Number(e.target.value))} style={{ ...sInput, width: "auto", fontSize: 11, padding: "6px 10px" }}>
              <option value="all">Toutes les campagnes</option>
              {campaigns.map(c => <option key={c.id} value={c.id}>{c.titre}</option>)}
            </select>
          )}
          </div>

          {/* Table */}
          <div className="iz-card" style={{ ...sCard, overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1.5fr 0.8fr 1fr 1fr 0.8fr 0.5fr", gap: 0, padding: "10px 16px", background: C.bg, borderBottom: `1px solid ${C.border}`, fontSize: 11, fontWeight: 600, color: C.textLight, textTransform: "uppercase", letterSpacing: .3 }}>
              <span>Parrain</span><span>Candidat coopté</span><span>Statut</span><span>Récompense</span><span>Période probatoire</span><span>Poste</span><span></span>
            </div>
            {filtered.length === 0 && <div style={{ padding: "40px 20px", textAlign: "center", color: C.textMuted, fontSize: 13 }}>Aucune cooptation trouvée</div>}
            {filtered.map(c => {
              const meta = COOPT_STATUS_META[c.statut] || COOPT_STATUS_META.en_attente;
              return (
              <div key={c.id} style={{ display: "grid", gridTemplateColumns: "1.5fr 1.5fr 0.8fr 1fr 1fr 0.8fr 0.5fr", gap: 0, padding: "14px 16px", borderBottom: `1px solid ${C.border}`, alignItems: "center", fontSize: 13 }}
                className="iz-sidebar-item">
                <div>
                  <div style={{ fontWeight: 500, color: C.text }}>{c.referrer_name}</div>
                  <div style={{ fontSize: 11, color: C.textMuted }}>{c.referrer_email}</div>
                </div>
                <div>
                  <div style={{ fontWeight: 500, color: C.text }}>{c.candidate_name}</div>
                  <div style={{ fontSize: 11, color: C.textMuted }}>{c.candidate_email}</div>
                  <div style={{ display: "flex", gap: 4, marginTop: 2 }}>
                    {c.linkedin_url && <a href={c.linkedin_url} target="_blank" rel="noopener noreferrer" title="LinkedIn" style={{ color: "#0A66C2" }}><Linkedin size={11} /></a>}
                    {c.telephone && <span title={c.telephone} style={{ color: C.textMuted }}><Phone size={11} /></span>}
                    {c.cv_original_name && <span title={c.cv_original_name} style={{ color: C.green }}><Paperclip size={11} /></span>}
                  </div>
                </div>
                <span style={{ padding: "3px 10px", borderRadius: 6, fontSize: 10, fontWeight: 600, background: meta.bg, color: meta.color, justifySelf: "start", display: "flex", alignItems: "center", gap: 4 }}>
                  <meta.icon size={10} /> {meta.label}
                </span>
                <div>
                  <div style={{ fontWeight: 600, color: c.recompense_versee ? C.green : C.text }}>
                    {c.type_recompense === "prime" ? `${fmtCurrency(c.montant_recompense || 0)}` : c.description_recompense || "Cadeau"}
                  </div>
                  {c.recompense_versee && <div style={{ fontSize: 10, color: C.green }}>Versée le {fmtDate(c.date_versement)}</div>}
                </div>
                <div>
                  {c.date_embauche ? (
                    <div>
                      <div style={{ fontSize: 12 }}>{c.mois_requis} mois requis</div>
                      {c.statut === "embauche" && c.jours_restants !== null && c.jours_restants > 0 ? (
                        <div style={{ fontSize: 10, color: C.blue }}>{c.jours_restants} jours restants</div>
                      ) : c.statut === "embauche" && c.is_validable ? (
                        <div style={{ fontSize: 10, color: C.green, fontWeight: 600 }}>Validable !</div>
                      ) : c.date_validation ? (
                        <div style={{ fontSize: 10, color: C.textMuted }}>Fin : {fmtDate(c.date_validation)}</div>
                      ) : null}
                    </div>
                  ) : <span style={{ color: C.textMuted }}>—</span>}
                </div>
                <div style={{ fontSize: 12, color: C.textLight }}>{c.candidate_poste || "—"}</div>
                <div style={{ display: "flex", gap: 4 }}>
                  {c.statut === "en_attente" && (
                    <button onClick={() => showPrompt("Indiquez la date d'embauche du candidat coopté", (d) => { if (d) cooptationMarkHired(c.id, { date_embauche: d }).then(reloadCoopt).catch(() => addToast_admin(t('toast.error'))); }, { label: "Date d'embauche", type: "date" })} title="Marquer embauché" style={{ background: C.blueLight, border: "none", borderRadius: 6, padding: 4, cursor: "pointer" }}><UserCheck size={14} color={C.blue} /></button>
                  )}
                  {c.statut === "embauche" && c.is_validable && (
                    <button onClick={() => cooptationValidate(c.id).then(reloadCoopt).catch(() => addToast_admin(t('toast.error')))} title="Valider" style={{ background: C.greenLight, border: "none", borderRadius: 6, padding: 4, cursor: "pointer" }}><CheckCircle2 size={14} color={C.green} /></button>
                  )}
                  {c.statut === "valide" && !c.recompense_versee && (
                    <button onClick={() => cooptationMarkRewarded(c.id).then(reloadCoopt).catch(() => addToast_admin(t('toast.error')))} title="Marquer récompensé" style={{ background: C.purple + "15", border: "none", borderRadius: 6, padding: 4, cursor: "pointer" }}><Gift size={14} color="#7B5EA7" /></button>
                  )}
                  {(c.statut === "en_attente" || c.statut === "embauche") && (
                    <button onClick={() => showConfirm("Refuser cette cooptation ?", () => cooptationRefuse(c.id).then(reloadCoopt).catch(() => addToast_admin(t('toast.error'))))} title="Refuser" style={{ background: C.redLight, border: "none", borderRadius: 6, padding: 4, cursor: "pointer" }}><Ban size={14} color={C.red} /></button>
                  )}
                  <button onClick={() => { setCooptPanelData({ ...c }); setCooptPanelMode("edit"); }} title="Modifier" style={{ background: C.bg, border: "none", borderRadius: 6, padding: 4, cursor: "pointer" }}><FilePen size={14} color={C.textMuted} /></button>
                </div>
              </div>
              );
            })}
          </div>
        </>)}

        {/* ═══ TAB: Campagnes ═══ */}
        {cooptTab === "campagnes" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {campaigns.map(camp => {
              const pMeta = CAMP_PRIORITE_META[camp.priorite] || CAMP_PRIORITE_META.normale;
              const sMeta = CAMP_STATUT_META[camp.statut] || CAMP_STATUT_META.active;
              return (
              <div key={camp.id} className="iz-card" style={{ ...sCard, padding: 0, overflow: "hidden", opacity: camp.statut === "fermee" ? 0.6 : 1 }}>
                <div style={{ padding: "16px 20px", borderBottom: `1px solid ${C.border}` }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>{camp.titre}</h3>
                    <div style={{ display: "flex", gap: 6 }}>
                      <span style={{ padding: "2px 8px", borderRadius: 6, fontSize: 10, fontWeight: 600, background: pMeta.bg, color: pMeta.color }}>{pMeta.label}</span>
                      <span style={{ padding: "2px 8px", borderRadius: 6, fontSize: 10, fontWeight: 600, background: sMeta.bg, color: sMeta.color }}>{sMeta.label}</span>
                    </div>
                  </div>
                  {camp.description && <p style={{ fontSize: 12, color: C.textLight, margin: "0 0 8px", lineHeight: 1.5 }}>{camp.description}</p>}
                  <div style={{ display: "flex", gap: 12, fontSize: 11, color: C.textMuted }}>
                    {camp.departement && <span>{camp.departement}</span>}
                    {camp.site && <span>{camp.site}</span>}
                    <span>{camp.type_contrat}</span>
                    <span>{camp.nombre_postes} poste{camp.nombre_postes > 1 ? "s" : ""}</span>
                  </div>
                </div>
                <div style={{ padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", gap: 16, fontSize: 12 }}>
                    <div><span style={{ fontWeight: 600, color: C.text }}>{camp.type_recompense === "prime" ? `${fmtCurrency(camp.montant_recompense || 0)}` : camp.description_recompense || "Cadeau"}</span><br /><span style={{ fontSize: 10, color: C.textMuted }}>Récompense</span></div>
                    <div><span style={{ fontWeight: 600, color: C.text }}>{camp.mois_requis} mois</span><br /><span style={{ fontSize: 10, color: C.textMuted }}>Période probatoire</span></div>
                    <div><span style={{ fontWeight: 600, color: C.text }}>{camp.cooptations_count || 0}</span><br /><span style={{ fontSize: 10, color: C.textMuted }}>Candidatures</span></div>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/cooptation/${camp.share_token}`); addToast_admin("Lien copié !"); }} title="Copier le lien de partage" className="iz-btn-outline" style={{ ...sBtn("outline"), padding: "6px 10px", fontSize: 11, display: "flex", alignItems: "center", gap: 4 }}><Link size={12} /> Partager</button>
                    <button onClick={() => { setCampaignPanelData({ ...camp, date_limite: camp.date_limite || "" }); setCampaignPanelMode("edit"); }} style={{ background: C.bg, border: "none", borderRadius: 6, padding: "6px 8px", cursor: "pointer" }}><FilePen size={14} color={C.textMuted} /></button>
                  </div>
                </div>
                {camp.date_limite && (
                  <div style={{ padding: "6px 20px 12px", fontSize: 10, color: new Date(camp.date_limite) < new Date() ? C.red : C.textMuted }}>
                    <Calendar size={10} style={{ verticalAlign: -1, marginRight: 4 }} />
                    Date limite : {fmtDate(camp.date_limite)}
                  </div>
                )}
              </div>
              );
            })}
            {campaigns.length === 0 && <div style={{ gridColumn: "1/-1", padding: "40px 20px", textAlign: "center", color: C.textMuted, fontSize: 13 }}>Aucune campagne créée</div>}
          </div>
        )}

        {/* ═══ TAB: Classement ═══ */}
        {cooptTab === "classement" && (
          <div className="iz-card" style={{ ...sCard, overflow: "hidden" }}>
            <div style={{ padding: "16px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 10 }}>
              <Trophy size={18} color={C.amber} />
              <span style={{ fontSize: 15, fontWeight: 600 }}>Top Coopteurs</span>
              <span style={{ fontSize: 11, color: C.textMuted, marginLeft: "auto" }}>Points : recommandation (5) + embauche (10) + validation (25) + bonus (15)</span>
            </div>
            {leaderboard.length === 0 && <div style={{ padding: "40px 20px", textAlign: "center", color: C.textMuted, fontSize: 13 }}>Aucun point attribué pour le moment</div>}
            {leaderboard.map((entry, i) => {
              const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : null;
              const initials = entry.referrer_name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
              const colors = ["#C2185B", "#1A73E8", "#4CAF50", "#7B5EA7", "#F9A825"];
              return (
              <div key={entry.referrer_email} style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 20px", borderBottom: `1px solid ${C.border}` }}>
                <div style={{ width: 28, textAlign: "center", fontSize: i < 3 ? 20 : 14, fontWeight: 700, color: i < 3 ? C.text : C.textMuted }}>{medal || `${i + 1}`}</div>
                <div style={{ width: 38, height: 38, borderRadius: "50%", background: colors[i % colors.length], display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 600, color: C.white }}>{initials}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 500, fontSize: 14, color: C.text }}>{entry.referrer_name}</div>
                  <div style={{ fontSize: 11, color: C.textMuted }}>{entry.referrer_email} · {entry.total_cooptations} cooptation{entry.total_cooptations > 1 ? "s" : ""}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Star size={16} color={C.amber} fill={C.amber} />
                  <span style={{ fontSize: 18, fontWeight: 700, color: C.text }}>{entry.total_points}</span>
                  <span style={{ fontSize: 11, color: C.textMuted }}>pts</span>
                </div>
              </div>
              );
            })}
          </div>
        )}

        {/* ── Cooptation Create / Edit panel ──────────────────── */}
        {cooptPanelMode !== "closed" && (
          <div className="iz-panel" style={{ position: "fixed", top: 0, right: 0, width: 520, height: "100vh", background: C.white, boxShadow: "-4px 0 24px rgba(0,0,0,.1)", zIndex: 1001, display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "20px 24px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>{cooptPanelMode === "create" ? "Nouvelle cooptation" : "Modifier la cooptation"}</h2>
              <button onClick={() => setCooptPanelMode("closed")} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}><X size={18} /></button>
            </div>
            <div style={{ flex: 1, padding: 24, overflow: "auto", display: "flex", flexDirection: "column", gap: 14 }}>
              {campaigns.filter(c => c.statut === "active").length > 0 && (
                <div><label style={{ fontSize: 11, color: C.textLight, marginBottom: 4, display: "block" }}>Campagne associée</label>
                  <select value={cooptPanelData.campaign_id || ""} onChange={e => setCooptPanelData({ ...cooptPanelData, campaign_id: e.target.value ? Number(e.target.value) : null })} style={sInput}>
                    <option value="">— Aucune campagne —</option>
                    {campaigns.filter(c => c.statut === "active").map(c => <option key={c.id} value={c.id}>{c.titre} ({c.type_contrat})</option>)}
                  </select>
                </div>
              )}
              <div style={{ fontSize: 13, fontWeight: 600, color: C.pink, marginBottom: -4 }}>Parrain (employé)</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div><label style={{ fontSize: 11, color: C.textLight, marginBottom: 4, display: "block" }}>Nom</label><input value={cooptPanelData.referrer_name} onChange={e => setCooptPanelData({ ...cooptPanelData, referrer_name: e.target.value })} style={sInput} /></div>
                <div><label style={{ fontSize: 11, color: C.textLight, marginBottom: 4, display: "block" }}>Email</label><input value={cooptPanelData.referrer_email} onChange={e => setCooptPanelData({ ...cooptPanelData, referrer_email: e.target.value })} style={sInput} /></div>
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.pink, marginTop: 8, marginBottom: -4 }}>Candidat coopté</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div><label style={{ fontSize: 11, color: C.textLight, marginBottom: 4, display: "block" }}>Nom</label><input value={cooptPanelData.candidate_name} onChange={e => setCooptPanelData({ ...cooptPanelData, candidate_name: e.target.value })} style={sInput} /></div>
                <div><label style={{ fontSize: 11, color: C.textLight, marginBottom: 4, display: "block" }}>Email</label><input value={cooptPanelData.candidate_email} onChange={e => setCooptPanelData({ ...cooptPanelData, candidate_email: e.target.value })} style={sInput} /></div>
              </div>
              <div><label style={{ fontSize: 11, color: C.textLight, marginBottom: 4, display: "block" }}>Poste visé</label><input value={cooptPanelData.candidate_poste || ""} onChange={e => setCooptPanelData({ ...cooptPanelData, candidate_poste: e.target.value })} style={sInput} /></div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div><label style={{ fontSize: 11, color: C.textLight, marginBottom: 4, display: "flex", alignItems: "center", gap: 4 }}><Phone size={10} /> Téléphone</label><input value={cooptPanelData.telephone || ""} onChange={e => setCooptPanelData({ ...cooptPanelData, telephone: e.target.value })} style={sInput} placeholder="+41 79 123 45 67" /></div>
                <div><label style={{ fontSize: 11, color: C.textLight, marginBottom: 4, display: "flex", alignItems: "center", gap: 4 }}><Linkedin size={10} /> LinkedIn</label><input value={cooptPanelData.linkedin_url || ""} onChange={e => setCooptPanelData({ ...cooptPanelData, linkedin_url: e.target.value })} style={sInput} placeholder="https://linkedin.com/in/..." /></div>
              </div>
              {/* CV Upload */}
              <div>
                <label style={{ fontSize: 11, color: C.textLight, marginBottom: 4, display: "flex", alignItems: "center", gap: 4 }}><Paperclip size={10} /> CV / Pièce jointe</label>
                {cooptPanelData.cv_original_name ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", borderRadius: 8, background: C.greenLight, fontSize: 12 }}>
                    <FileText size={14} color={C.green} />
                    <span style={{ flex: 1, color: C.text, fontWeight: 500 }}>{cooptPanelData.cv_original_name}</span>
                    <button type="button" onClick={() => setCooptPanelData({ ...cooptPanelData, cv_path: null, cv_original_name: null })} style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}><X size={12} color={C.red} /></button>
                  </div>
                ) : (
                  <label style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", borderRadius: 8, border: `1px dashed ${C.border}`, cursor: "pointer", fontSize: 12, color: C.textLight, transition: "all .15s" }}>
                    <Upload size={14} /> Glisser ou cliquer pour ajouter un CV (PDF, DOC, max 5 Mo)
                    <input type="file" accept=".pdf,.doc,.docx" style={{ display: "none" }} onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      if (cooptPanelData.id) {
                        try {
                          const res = await uploadCooptationCv(cooptPanelData.id, file);
                          setCooptPanelData({ ...cooptPanelData, cv_original_name: res.filename, cv_path: "uploaded" });
                          addToast_admin("CV uploadé");
                        } catch { addToast_admin("Erreur upload CV"); }
                      } else {
                        setCooptPanelData({ ...cooptPanelData, _pendingCvFile: file, cv_original_name: file.name });
                      }
                    }} />
                  </label>
                )}
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.pink, marginTop: 8, marginBottom: -4 }}>Récompense</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                <div><label style={{ fontSize: 11, color: C.textLight, marginBottom: 4, display: "block" }}>Type</label>
                  <select value={cooptPanelData.type_recompense} onChange={e => setCooptPanelData({ ...cooptPanelData, type_recompense: e.target.value })} style={sInput}>
                    <option value="prime">Prime (CHF)</option>
                    <option value="cadeau">Cadeau</option>
                  </select>
                </div>
                {cooptPanelData.type_recompense === "prime" ? (
                  <div><label style={{ fontSize: 11, color: C.textLight, marginBottom: 4, display: "block" }}>Montant (CHF)</label><input type="number" value={cooptPanelData.montant_recompense || ""} onChange={e => setCooptPanelData({ ...cooptPanelData, montant_recompense: Number(e.target.value) })} style={sInput} /></div>
                ) : (
                  <div><label style={{ fontSize: 11, color: C.textLight, marginBottom: 4, display: "block" }}>Description</label><input value={cooptPanelData.description_recompense || ""} onChange={e => setCooptPanelData({ ...cooptPanelData, description_recompense: e.target.value })} style={sInput} placeholder="Ex: carte cadeau, journée spa..." /></div>
                )}
                <div><label style={{ fontSize: 11, color: C.textLight, marginBottom: 4, display: "block" }}>Mois requis</label><input type="number" value={cooptPanelData.mois_requis} onChange={e => setCooptPanelData({ ...cooptPanelData, mois_requis: Number(e.target.value) })} style={sInput} /></div>
              </div>
              <div><label style={{ fontSize: 11, color: C.textLight, marginBottom: 4, display: "block" }}>Notes</label><textarea value={cooptPanelData.notes || ""} onChange={e => setCooptPanelData({ ...cooptPanelData, notes: e.target.value })} style={{ ...sInput, minHeight: 80, resize: "vertical" }} /></div>
            </div>
            <div style={{ padding: "16px 24px", borderTop: `1px solid ${C.border}`, display: "flex", gap: 8, justifyContent: "flex-end" }}>
              {cooptPanelMode === "edit" && cooptPanelData.id && (
                <button onClick={() => { showConfirm("Supprimer cette cooptation ?", () => { apiDeleteCooptation(cooptPanelData.id).then(reloadCoopt).catch(() => {}); setCooptPanelMode("closed"); }) }} style={{ ...sBtn("outline"), color: C.red, borderColor: C.red, marginRight: "auto" }}>{t('common.delete')}</button>
              )}
              <button onClick={() => setCooptPanelMode("closed")} className="iz-btn-outline" style={sBtn("outline")}>{t('common.cancel')}</button>
              <button onClick={async () => {
                try {
                  const payload = { referrer_name: cooptPanelData.referrer_name, referrer_email: cooptPanelData.referrer_email, candidate_name: cooptPanelData.candidate_name, candidate_email: cooptPanelData.candidate_email, candidate_poste: cooptPanelData.candidate_poste, linkedin_url: cooptPanelData.linkedin_url || null, telephone: cooptPanelData.telephone || null, type_recompense: cooptPanelData.type_recompense, montant_recompense: cooptPanelData.type_recompense === "prime" ? cooptPanelData.montant_recompense : null, description_recompense: cooptPanelData.type_recompense === "cadeau" ? cooptPanelData.description_recompense : null, mois_requis: cooptPanelData.mois_requis, notes: cooptPanelData.notes, campaign_id: cooptPanelData.campaign_id || null, date_cooptation: cooptPanelData.date_cooptation || new Date().toISOString().slice(0, 10) };
                  let created: any;
                  if (cooptPanelMode === "edit" && cooptPanelData.id) await apiUpdateCooptation(cooptPanelData.id, payload);
                  else created = await apiCreateCooptation(payload);
                  // Upload pending CV after creation
                  if (cooptPanelData._pendingCvFile && (created?.id || cooptPanelData.id)) {
                    try { await uploadCooptationCv(created?.id || cooptPanelData.id, cooptPanelData._pendingCvFile); } catch {}
                  }
                  reloadCoopt(); setCooptPanelMode("closed"); addToast_admin(cooptPanelMode === "create" ? "Cooptation créée" : "Cooptation modifiée");
                } catch { addToast_admin("Erreur lors de l'enregistrement"); }
              }} className="iz-btn-pink" style={sBtn("pink")}>{cooptPanelMode === "create" ? t('common.create') : t('common.save')}</button>
            </div>
          </div>
        )}

        {/* ── Campaign Create / Edit panel ────────────────────── */}
        {campaignPanelMode !== "closed" && (
          <div className="iz-panel" style={{ position: "fixed", top: 0, right: 0, width: 560, height: "100vh", background: C.white, boxShadow: "-4px 0 24px rgba(0,0,0,.1)", zIndex: 1001, display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "20px 24px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>{campaignPanelMode === "create" ? "Nouvelle campagne" : "Modifier la campagne"}</h2>
              <button onClick={() => setCampaignPanelMode("closed")} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}><X size={18} /></button>
            </div>
            <div style={{ flex: 1, padding: 24, overflow: "auto", display: "flex", flexDirection: "column", gap: 14 }}>
              <div><label style={{ fontSize: 11, color: C.textLight, marginBottom: 4, display: "block" }}>Titre du poste *</label><input value={campaignPanelData.titre} onChange={e => setCampaignPanelData({ ...campaignPanelData, titre: e.target.value })} style={sInput} placeholder="Ex: Développeur Full Stack" /></div>
              <div><label style={{ fontSize: 11, color: C.textLight, marginBottom: 4, display: "block" }}>Description</label><textarea value={campaignPanelData.description || ""} onChange={e => setCampaignPanelData({ ...campaignPanelData, description: e.target.value })} style={{ ...sInput, minHeight: 80, resize: "vertical" }} placeholder="Décrivez le poste et le profil recherché..." /></div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                <div><label style={{ fontSize: 11, color: C.textLight, marginBottom: 4, display: "block" }}>Département</label><input value={campaignPanelData.departement || ""} onChange={e => setCampaignPanelData({ ...campaignPanelData, departement: e.target.value })} style={sInput} /></div>
                <div><label style={{ fontSize: 11, color: C.textLight, marginBottom: 4, display: "block" }}>Site</label><input value={campaignPanelData.site || ""} onChange={e => setCampaignPanelData({ ...campaignPanelData, site: e.target.value })} style={sInput} /></div>
                <div><label style={{ fontSize: 11, color: C.textLight, marginBottom: 4, display: "block" }}>Type de contrat</label>
                  <select value={campaignPanelData.type_contrat} onChange={e => setCampaignPanelData({ ...campaignPanelData, type_contrat: e.target.value })} style={sInput}>
                    {["CDI", "CDD", "Stage", "Alternance", "Freelance"].map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                <div><label style={{ fontSize: 11, color: C.textLight, marginBottom: 4, display: "block" }}>Nombre de postes</label><input type="number" min={1} value={campaignPanelData.nombre_postes} onChange={e => setCampaignPanelData({ ...campaignPanelData, nombre_postes: Number(e.target.value) })} style={sInput} /></div>
                <div><label style={{ fontSize: 11, color: C.textLight, marginBottom: 4, display: "block" }}>Priorité</label>
                  <select value={campaignPanelData.priorite} onChange={e => setCampaignPanelData({ ...campaignPanelData, priorite: e.target.value })} style={sInput}>
                    {["basse", "normale", "haute", "urgente"].map(p => <option key={p} value={p}>{CAMP_PRIORITE_META[p]?.label || p}</option>)}
                  </select>
                </div>
                <div><label style={{ fontSize: 11, color: C.textLight, marginBottom: 4, display: "block" }}>Date limite</label><input type="date" value={campaignPanelData.date_limite || ""} onChange={e => setCampaignPanelData({ ...campaignPanelData, date_limite: e.target.value })} style={sInput} /></div>
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.pink, marginTop: 8, marginBottom: -4 }}>Récompense pour cette campagne</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                <div><label style={{ fontSize: 11, color: C.textLight, marginBottom: 4, display: "block" }}>Type</label>
                  <select value={campaignPanelData.type_recompense} onChange={e => setCampaignPanelData({ ...campaignPanelData, type_recompense: e.target.value })} style={sInput}>
                    <option value="prime">Prime (CHF)</option>
                    <option value="cadeau">Cadeau</option>
                  </select>
                </div>
                {campaignPanelData.type_recompense === "prime" ? (
                  <div><label style={{ fontSize: 11, color: C.textLight, marginBottom: 4, display: "block" }}>Montant (CHF)</label><input type="number" value={campaignPanelData.montant_recompense || ""} onChange={e => setCampaignPanelData({ ...campaignPanelData, montant_recompense: Number(e.target.value) })} style={sInput} /></div>
                ) : (
                  <div><label style={{ fontSize: 11, color: C.textLight, marginBottom: 4, display: "block" }}>Description</label><input value={campaignPanelData.description_recompense || ""} onChange={e => setCampaignPanelData({ ...campaignPanelData, description_recompense: e.target.value })} style={sInput} /></div>
                )}
                <div><label style={{ fontSize: 11, color: C.textLight, marginBottom: 4, display: "block" }}>Mois requis</label><input type="number" value={campaignPanelData.mois_requis} onChange={e => setCampaignPanelData({ ...campaignPanelData, mois_requis: Number(e.target.value) })} style={sInput} /></div>
              </div>
              {campaignPanelMode === "edit" && (
                <div><label style={{ fontSize: 11, color: C.textLight, marginBottom: 4, display: "block" }}>Statut</label>
                  <select value={campaignPanelData.statut} onChange={e => setCampaignPanelData({ ...campaignPanelData, statut: e.target.value })} style={sInput}>
                    <option value="active">Active</option>
                    <option value="pourvue">Pourvue</option>
                    <option value="fermee">Fermée</option>
                  </select>
                </div>
              )}
            </div>
            <div style={{ padding: "16px 24px", borderTop: `1px solid ${C.border}`, display: "flex", gap: 8, justifyContent: "flex-end" }}>
              {campaignPanelMode === "edit" && campaignPanelData.id && (
                <button onClick={() => { showConfirm("Supprimer cette campagne ?", () => { apiDeleteCampaign(campaignPanelData.id).then(reloadCampaigns).catch(() => {}); setCampaignPanelMode("closed"); }) }} style={{ ...sBtn("outline"), color: C.red, borderColor: C.red, marginRight: "auto" }}>{t('common.delete')}</button>
              )}
              <button onClick={() => setCampaignPanelMode("closed")} className="iz-btn-outline" style={sBtn("outline")}>{t('common.cancel')}</button>
              <button onClick={async () => {
                try {
                  const payload = { titre: campaignPanelData.titre, description: campaignPanelData.description, departement: campaignPanelData.departement, site: campaignPanelData.site, type_contrat: campaignPanelData.type_contrat, type_recompense: campaignPanelData.type_recompense, montant_recompense: campaignPanelData.type_recompense === "prime" ? campaignPanelData.montant_recompense : null, description_recompense: campaignPanelData.type_recompense === "cadeau" ? campaignPanelData.description_recompense : null, mois_requis: campaignPanelData.mois_requis, nombre_postes: campaignPanelData.nombre_postes, priorite: campaignPanelData.priorite, date_limite: campaignPanelData.date_limite || null, ...(campaignPanelMode === "edit" ? { statut: campaignPanelData.statut } : {}) };
                  if (campaignPanelMode === "edit" && campaignPanelData.id) await apiUpdateCampaign(campaignPanelData.id, payload);
                  else await apiCreateCampaign(payload);
                  reloadCampaigns(); setCampaignPanelMode("closed"); addToast_admin(campaignPanelMode === "create" ? "Campagne créée" : "Campagne modifiée");
                } catch { addToast_admin(t('toast.error')); }
              }} className="iz-btn-pink" style={sBtn("pink")}>{campaignPanelMode === "create" ? t('common.create') : t('common.save')}</button>
            </div>
          </div>
        )}

        {/* ── Settings panel ────────────────────────────────── */}
        {cooptSettingsOpen && (
          <div className="iz-panel" style={{ position: "fixed", top: 0, right: 0, width: 440, height: "100vh", background: C.white, boxShadow: "-4px 0 24px rgba(0,0,0,.1)", zIndex: 1001, display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "20px 24px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>Paramètres cooptation</h2>
              <button onClick={() => setCooptSettingsOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}><X size={18} /></button>
            </div>
            <div style={{ flex: 1, padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ padding: 16, background: C.pinkBg, borderRadius: 10, fontSize: 12, color: C.pink }}>
                <Handshake size={16} style={{ marginRight: 6, verticalAlign: -3 }} />
                Ces paramètres servent de valeurs par défaut lors de la création d'une nouvelle cooptation.
              </div>
              <div><label style={{ fontSize: 11, color: C.textLight, marginBottom: 4, display: "block" }}>Mois requis par défaut</label><input type="number" value={cooptSettings?.mois_requis_defaut || 6} onChange={e => setCooptSettings(s => s ? { ...s, mois_requis_defaut: Number(e.target.value) } : s)} style={sInput} /></div>
              <div><label style={{ fontSize: 11, color: C.textLight, marginBottom: 4, display: "block" }}>Type de récompense par défaut</label>
                <select value={cooptSettings?.type_recompense_defaut || "prime"} onChange={e => setCooptSettings(s => s ? { ...s, type_recompense_defaut: e.target.value as any } : s)} style={sInput}>
                  <option value="prime">Prime (CHF)</option>
                  <option value="cadeau">Cadeau</option>
                </select>
              </div>
              <div><label style={{ fontSize: 11, color: C.textLight, marginBottom: 4, display: "block" }}>Montant par défaut (CHF)</label><input type="number" value={cooptSettings?.montant_defaut || 500} onChange={e => setCooptSettings(s => s ? { ...s, montant_defaut: Number(e.target.value) } : s)} style={sInput} /></div>
              <div><label style={{ fontSize: 11, color: C.textLight, marginBottom: 4, display: "block" }}>Description cadeau par défaut</label><input value={cooptSettings?.description_recompense_defaut || ""} onChange={e => setCooptSettings(s => s ? { ...s, description_recompense_defaut: e.target.value } : s)} style={sInput} placeholder="Ex: Carte cadeau Manor 200 CHF" /></div>
            </div>
            <div style={{ padding: "16px 24px", borderTop: `1px solid ${C.border}`, display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button onClick={() => setCooptSettingsOpen(false)} className="iz-btn-outline" style={sBtn("outline")}>{t('common.cancel')}</button>
              <button onClick={async () => {
                if (!cooptSettings) return;
                try {
                  await apiUpdateCooptSettings({ mois_requis_defaut: cooptSettings.mois_requis_defaut, montant_defaut: cooptSettings.montant_defaut, type_recompense_defaut: cooptSettings.type_recompense_defaut, description_recompense_defaut: cooptSettings.description_recompense_defaut });
                  setCooptSettingsOpen(false); addToast_admin("Paramètres sauvegardés");
                } catch { addToast_admin(t('toast.error')); }
              }} className="iz-btn-pink" style={sBtn("pink")}>{t('common.save')}</button>
            </div>
          </div>
        )}
      </div>
      );
    };

    const renderIntegrations = () => {
      const categories = [...new Set((integrations || []).map((i: any) => i.categorie))];
      const selectedIntegration = integrations?.find((i: any) => i.id === integrationPanelId);
      const selectedMeta = selectedIntegration ? INTEGRATION_META[selectedIntegration.provider] : null;

      return (
      <div style={{ flex: 1, padding: "24px 32px", overflow: "auto" }}>
        <h1 style={{ fontSize: 22, fontWeight: 600, margin: "0 0 20px" }}>Intégrations</h1>
        {categories.map((cat: string) => {
          const sigProviders = cat === "signature" ? (integrations || []).filter((i: any) => i.categorie === "signature") : [];
          const activeSignProviders = sigProviders.filter((i: any) => i.connecte || i.provider === "native");
          const defaultSignProvider = sigProviders.find((i: any) => i.config?.is_default)?.provider || "native";
          return (
          <div key={cat} style={{ marginBottom: 28 }}>
            <h2 style={{ fontSize: 14, fontWeight: 600, color: C.textMuted, textTransform: "uppercase", letterSpacing: .5, marginBottom: 12 }}>{CAT_LABELS[cat] || cat}</h2>
            {cat === "signature" && (
              <div className="iz-card" style={{ ...sCard, marginBottom: 12, display: "flex", alignItems: "center", gap: 16, background: C.pinkBg, border: `1px solid ${C.pinkLight}` }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.dark }}>Provider de signature par défaut</div>
                  <div style={{ fontSize: 11, color: C.textLight }}>Utilisé automatiquement lors de la création d'une action de type Signature</div>
                </div>
                <select value={defaultSignProvider} onChange={async (e) => {
                  const newDefault = e.target.value;
                  for (const sp of sigProviders) {
                    const isDefault = sp.provider === newDefault;
                    if ((sp.config?.is_default || false) !== isDefault) {
                      await apiUpdateIntegration(sp.id, { config: { ...sp.config, is_default: isDefault } });
                    }
                  }
                  addToast_admin(`Provider par défaut : ${newDefault}`);
                  refetchIntegrations();
                }} style={{ ...sInput, width: 220, fontSize: 13, cursor: "pointer", background: C.white }}>
                  {activeSignProviders.map((sp: any) => {
                    const meta = INTEGRATION_META[sp.provider];
                    return <option key={sp.id} value={sp.provider}>{sp.nom}{sp.connecte ? " ✓" : ""}</option>;
                  })}
                </select>
              </div>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
              {(integrations || []).filter((i: any) => i.categorie === cat).map((int: any) => {
                const meta = INTEGRATION_META[int.provider] || { desc: "", Icon: Link, color: C.textMuted, fields: [] };
                return (
                  <div key={int.id} className="iz-card iz-fade-up" style={{ ...sCard, cursor: "pointer" }} onClick={() => { setIntegrationPanelId(int.id); setIntegrationConfig(int.config || {}); }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 10, background: int.connecte ? C.greenLight : `${meta.color}15`, display: "flex", alignItems: "center", justifyContent: "center" }}><meta.Icon size={20} color={int.connecte ? C.green : meta.color} /></div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 600 }}>{int.nom}</div>
                        <div style={{ fontSize: 11, color: C.textLight }}>{meta.desc}</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 4, background: int.connecte ? C.greenLight : int.actif ? C.amberLight : C.bg, color: int.connecte ? C.green : int.actif ? C.amber : C.textMuted }}>
                        {int.connecte ? "Connecté" : int.actif ? "Configuré" : "Non configuré"}
                      </span>
                      <span style={{ fontSize: 11, color: C.pink, fontWeight: 500 }}>Configurer →</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          );
        })}

        {/* Integration config panel */}
        {selectedIntegration && selectedMeta && (
          <>
            <div onClick={() => setIntegrationPanelId(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.3)", zIndex: 1000 }} />
            <div className="iz-panel" style={{ position: "fixed", top: 0, right: 0, width: 500, height: "100vh", background: C.white, boxShadow: "-4px 0 24px rgba(0,0,0,.1)", zIndex: 1001, display: "flex", flexDirection: "column" }}>
              <div style={{ padding: "24px 28px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: `${selectedMeta.color}15`, display: "flex", alignItems: "center", justifyContent: "center" }}><selectedMeta.Icon size={20} color={selectedMeta.color} /></div>
                <div style={{ flex: 1 }}>
                  <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>{selectedIntegration.nom}</h2>
                  <div style={{ fontSize: 12, color: C.textLight }}>{selectedMeta.desc}</div>
                </div>
                <button onClick={() => setIntegrationPanelId(null)} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={22} color={C.textLight} /></button>
              </div>
              <div style={{ flex: 1, padding: "24px 28px", overflow: "auto" }}>
                {/* OAuth flow (DocuSign etc.) */}
                {selectedMeta.oauth ? (
                  selectedIntegration.connecte ? (
                    <div>
                      <div style={{ padding: "20px", background: C.greenLight, borderRadius: 12, textAlign: "center", marginBottom: 20 }}>
                        <CheckCircle size={28} color={C.green} style={{ marginBottom: 8 }} />
                        <div style={{ fontSize: 16, fontWeight: 600, color: C.green, marginBottom: 4 }}>Connecté</div>
                        <div style={{ fontSize: 12, color: C.text }}>{integrationConfig.user_name || "Utilisateur"} ({integrationConfig.user_email || ""})</div>
                      </div>
                      <div style={{ padding: "16px", background: C.bg, borderRadius: 10, marginBottom: 16 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: C.text, marginBottom: 8 }}>Détails du compte</div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, fontSize: 12 }}>
                          <div><span style={{ color: C.textMuted }}>Compte</span><div style={{ fontWeight: 500, marginTop: 2 }}>{integrationConfig.account_name || "—"}</div></div>
                          <div><span style={{ color: C.textMuted }}>Account ID</span><div style={{ fontWeight: 500, marginTop: 2, fontSize: 10, fontFamily: "monospace" }}>{integrationConfig.account_id || "—"}</div></div>
                          <div><span style={{ color: C.textMuted }}>Base URI</span><div style={{ fontWeight: 500, marginTop: 2, fontSize: 10 }}>{integrationConfig.base_uri || "—"}</div></div>
                          <div><span style={{ color: C.textMuted }}>Expire</span><div style={{ fontWeight: 500, marginTop: 2, fontSize: 10 }}>{fmtDate(integrationConfig.expires_at)}</div></div>
                        </div>
                      </div>
                      <button onClick={async () => {
                        setConfirmDialog({ message: `Déconnecter ${selectedIntegration.nom} ? Les signatures en cours ne seront pas affectées.`, onConfirm: async () => {
                          try {
                            await apiFetch(`/integrations/${selectedIntegration.id}/docusign/disconnect`, { method: "POST" });
                            addToast_admin(`${selectedIntegration.nom} déconnecté`);
                            refetchIntegrations(); setIntegrationPanelId(null);
                          } catch { addToast_admin(t('toast.error')); }
                          setConfirmDialog(null);
                        }});
                      }} style={{ ...sBtn("outline"), color: C.red, borderColor: C.red, fontSize: 13, width: "100%" }}>Déconnecter</button>
                    </div>
                  ) : (
                    <div>
                      <div style={{ textAlign: "center", marginBottom: 24 }}>
                        <div style={{ width: 64, height: 64, borderRadius: 16, background: `${selectedMeta.color}15`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                          <selectedMeta.Icon size={32} color={selectedMeta.color} />
                        </div>
                        <h3 style={{ fontSize: 17, fontWeight: 600, margin: "0 0 8px" }}>Connecter {selectedIntegration.nom}</h3>
                        <p style={{ fontSize: 13, color: C.textLight, margin: "0 0 20px", lineHeight: 1.5 }}>
                          Connectez votre compte DocuSign pour activer la signature électronique dans vos parcours.
                        </p>
                      </div>

                      {/* Mode 1: ISV — direct connect (keys in .env) */}
                      <button disabled={integrationSaving} onClick={async () => {
                        setIntegrationSaving(true);
                        setIntegrationConfig(prev => ({ ...prev, _oauthError: false, _needKeys: false }));
                        try {
                          const res = await apiFetch<{ redirect_url: string }>(`/integrations/docusign/redirect?integration_id=${selectedIntegration.id}`);
                          window.location.href = res.redirect_url;
                        } catch (err: any) {
                          // If 422 = keys not configured → show self-service form
                          if (err?.status === 422) {
                            setIntegrationConfig(prev => ({ ...prev, _needKeys: true }));
                          } else {
                            setIntegrationConfig(prev => ({ ...prev, _oauthError: true }));
                          }
                          setIntegrationSaving(false);
                        }
                      }} className="iz-btn-pink" style={{ ...sBtn("pink"), fontSize: 15, padding: "14px 0", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                        <Link size={18} /> {integrationSaving ? "Redirection..." : "Connecter à DocuSign"}
                      </button>

                      <div style={{ textAlign: "center", fontSize: 12, color: C.textLight, margin: "16px 0 4px" }}>
                        Vous serez redirigé vers DocuSign pour autoriser la connexion
                      </div>

                      {integrationConfig._oauthError && (
                        <div style={{ marginTop: 12, padding: "10px 14px", background: C.redLight, borderRadius: 8, fontSize: 12, color: C.red, display: "flex", alignItems: "center", gap: 8 }}>
                          <AlertTriangle size={14} /> Erreur de connexion. Réessayez ou utilisez la configuration manuelle ci-dessous.
                        </div>
                      )}

                      {/* Mode 2: Self-service — client enters own keys */}
                      {integrationConfig._needKeys && (
                        <div style={{ marginTop: 20, padding: "20px", background: C.bg, borderRadius: 12 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 4 }}>Configuration manuelle</div>
                          <div style={{ fontSize: 11, color: C.textLight, marginBottom: 16 }}>Si vous avez votre propre app DocuSign, saisissez vos clés ci-dessous.</div>
                          {selectedMeta.fields.map(field => (
                            <div key={field.key} style={{ marginBottom: 12 }}>
                              <label style={{ fontSize: 11, fontWeight: 600, color: C.text, display: "block", marginBottom: 4 }}>{field.label}</label>
                              {field.type === "select" ? (
                                <select value={integrationConfig[field.key] || field.options?.[0] || ""} onChange={e => setIntegrationConfig(prev => ({ ...prev, [field.key]: e.target.value }))} style={{ ...sInput, fontSize: 12, cursor: "pointer" }}>
                                  {field.options?.map(o => <option key={o} value={o}>{o === "demo" ? "Demo (sandbox)" : o === "production_na" ? "Production — Amérique" : o === "production_eu" ? "Production — Europe" : o}</option>)}
                                </select>
                              ) : (
                                <input type={field.type === "password" ? "password" : "text"} value={integrationConfig[field.key] || ""} onChange={e => setIntegrationConfig(prev => ({ ...prev, [field.key]: e.target.value }))} style={{ ...sInput, fontSize: 12 }} />
                              )}
                            </div>
                          ))}
                          <button disabled={integrationSaving || !integrationConfig.integration_key || !integrationConfig.secret_key} onClick={async () => {
                            setIntegrationSaving(true);
                            try {
                              await apiUpdateIntegration(selectedIntegration.id, { config: {
                                integration_key: integrationConfig.integration_key,
                                secret_key: integrationConfig.secret_key,
                                account_id: integrationConfig.account_id || '',
                                environment: integrationConfig.environment || 'demo',
                              }});
                              const res = await apiFetch<{ redirect_url: string }>(`/integrations/docusign/redirect?integration_id=${selectedIntegration.id}`);
                              window.location.href = res.redirect_url;
                            } catch {
                              setIntegrationConfig(prev => ({ ...prev, _oauthError: true }));
                              setIntegrationSaving(false);
                            }
                          }} className="iz-btn-pink" style={{ ...sBtn("pink"), fontSize: 13, padding: "10px 0", width: "100%", opacity: !integrationConfig.integration_key || !integrationConfig.secret_key ? 0.5 : 1 }}>
                            {integrationSaving ? "Redirection..." : "Enregistrer et connecter"}
                          </button>
                          <div style={{ marginTop: 12, fontSize: 10, color: C.textMuted }}>
                            Redirect URI à configurer dans votre app DocuSign :<br/>
                            <code style={{ fontSize: 10, fontFamily: "monospace" }}>{window.location.origin.replace('3000', '8000')}/api/v1/integrations/docusign/callback</code>
                          </div>
                        </div>
                      )}

                      <div style={{ marginTop: 20, padding: "12px 16px", background: C.bg, borderRadius: 8, fontSize: 11, color: C.textLight }}>
                        <div style={{ fontWeight: 600, marginBottom: 4, color: C.text }}>Comment ça marche ?</div>
                        <div>1. Cliquez sur "Connecter à DocuSign"</div>
                        <div>2. Authentifiez-vous avec votre compte DocuSign</div>
                        <div>3. Autorisez Illizeo à accéder à votre compte</div>
                        <div>4. Vous êtes automatiquement redirigé ici</div>
                      </div>
                    </div>
                  )
                ) : selectedMeta.apiKey ? (() => {
                  const cFields = (selectedMeta as any).configFields || [{ key: "api_key", label: "Clé API", type: "password" }];
                  const connectEp = (selectedMeta as any).connectEndpoint || "ugosign/connect";
                  const disconnectEp = (selectedMeta as any).disconnectEndpoint || "ugosign/disconnect";
                  const guide = (selectedMeta as any).guide || [
                    { title: "1. Connectez-vous", text: `Accédez à ${selectedIntegration.nom}` },
                    { title: "2. Paramètres API", text: "Trouvez la section API / Intégrations" },
                    { title: "3. Copiez vos identifiants", text: "Collez-les dans les champs ci-dessus" },
                  ];
                  const allFieldsFilled = cFields.every((f: any) => (integrationConfig[f.key] || "").trim());
                  if (selectedIntegration.connecte) return (
                    <div>
                      <div style={{ padding: "20px", background: C.greenLight, borderRadius: 12, textAlign: "center", marginBottom: 20 }}>
                        <CheckCircle size={28} color={C.green} style={{ marginBottom: 8 }} />
                        <div style={{ fontSize: 16, fontWeight: 600, color: C.green, marginBottom: 4 }}>Connecté</div>
                        <div style={{ fontSize: 12, color: C.text }}>{integrationConfig.organization_name || integrationConfig.subdomain || selectedIntegration.nom}</div>
                      </div>
                      <div style={{ padding: "16px", background: C.bg, borderRadius: 10, marginBottom: 16 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: C.text, marginBottom: 8 }}>Détails</div>
                        <div style={{ fontSize: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                          {integrationConfig.total_employees != null && <div><span style={{ color: C.textMuted }}>Employés</span><div style={{ fontWeight: 500 }}>{integrationConfig.total_employees}</div></div>}
                          {integrationConfig.members_count != null && <div><span style={{ color: C.textMuted }}>Membres</span><div style={{ fontWeight: 500 }}>{integrationConfig.members_count}</div></div>}
                          {integrationConfig.subdomain && <div><span style={{ color: C.textMuted }}>Instance</span><div style={{ fontWeight: 500 }}>{integrationConfig.subdomain}.ilucca.net</div></div>}
                          <div><span style={{ color: C.textMuted }}>Connecté le</span><div style={{ fontWeight: 500 }}>{fmtDate(integrationConfig.connected_at)}</div></div>
                        </div>
                      </div>
                      <button onClick={async () => {
                        setConfirmDialog({ message: `Déconnecter ${selectedIntegration.nom} ?`, onConfirm: async () => {
                          try {
                            await apiFetch(`/integrations/${selectedIntegration.id}/${disconnectEp}`, { method: "POST" });
                            addToast_admin(`${selectedIntegration.nom} déconnecté`);
                            refetchIntegrations(); setIntegrationPanelId(null);
                          } catch { addToast_admin(t('toast.error')); }
                          setConfirmDialog(null);
                        }});
                      }} style={{ ...sBtn("outline"), color: C.red, borderColor: C.red, fontSize: 13, width: "100%" }}>Déconnecter</button>
                    </div>
                  );
                  return (
                    <div>
                      <div style={{ textAlign: "center", marginBottom: 24 }}>
                        <div style={{ width: 64, height: 64, borderRadius: 16, background: `${selectedMeta.color}15`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                          <selectedMeta.Icon size={32} color={selectedMeta.color} />
                        </div>
                        <h3 style={{ fontSize: 17, fontWeight: 600, margin: "0 0 4px" }}>Connecter {selectedIntegration.nom}</h3>
                        <p style={{ fontSize: 12, color: C.textLight, margin: 0 }}>Saisissez vos identifiants pour activer la connexion</p>
                      </div>
                      {cFields.map((f: any) => (
                        <div key={f.key} style={{ marginBottom: 16 }}>
                          <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>{f.label}</label>
                          <input type={f.type === "password" ? "password" : "text"} value={integrationConfig[f.key] || ""} onChange={e => setIntegrationConfig(prev => ({ ...prev, [f.key]: e.target.value }))} placeholder={f.type === "password" ? "••••••••" : ""} style={{ ...sInput, fontSize: 13 }} />
                        </div>
                      ))}
                      <div style={{ padding: "14px 16px", background: C.bg, borderRadius: 10, marginBottom: 20, fontSize: 11, color: C.textLight }}>
                        <div style={{ fontWeight: 600, marginBottom: 6, color: C.text }}>Procédure dans {selectedIntegration.nom}</div>
                        {guide.map((step: any, i: number) => (
                          <div key={i} style={{ marginBottom: 8 }}>
                            <div style={{ fontWeight: 600, color: C.text, marginBottom: 2 }}>{step.title}</div>
                            <div>{step.text}</div>
                          </div>
                        ))}
                      </div>
                      <button disabled={integrationSaving || !allFieldsFilled} onClick={async () => {
                        setIntegrationSaving(true);
                        try {
                          const payload: Record<string, string> = {};
                          cFields.forEach((f: any) => { payload[f.key] = (integrationConfig[f.key] || "").trim(); });
                          const res = await apiFetch<{ success: boolean; message: string }>(`/integrations/${selectedIntegration.id}/${connectEp}`, {
                            method: "POST", body: JSON.stringify(payload),
                          });
                          if (res.success) {
                            addToast_admin(`${selectedIntegration.nom} connecté`);
                            refetchIntegrations(); setIntegrationPanelId(null);
                          } else { addToast_admin(res.message || "Erreur"); }
                        } catch (err: any) {
                          try { const p = JSON.parse(err.message); addToast_admin(p.message || "Erreur de connexion"); } catch { addToast_admin("Identifiants invalides"); }
                        }
                        finally { setIntegrationSaving(false); }
                      }} className="iz-btn-pink" style={{ ...sBtn("pink"), fontSize: 14, padding: "12px 0", width: "100%", opacity: integrationSaving || !allFieldsFilled ? 0.6 : 1 }}>
                        {integrationSaving ? "Vérification..." : "Tester et connecter"}
                      </button>
                    </div>
                  );
                })() : selectedMeta.sapConnect ? (
                  selectedIntegration.connecte ? (
                    <div>
                      <div style={{ padding: "20px", background: C.greenLight, borderRadius: 12, textAlign: "center", marginBottom: 20 }}>
                        <CheckCircle size={28} color={C.green} style={{ marginBottom: 8 }} />
                        <div style={{ fontSize: 16, fontWeight: 600, color: C.green, marginBottom: 4 }}>Connecté</div>
                        <div style={{ fontSize: 12, color: C.text }}>{integrationConfig.company_name || integrationConfig.company_id || "SAP SuccessFactors"}</div>
                      </div>
                      <div style={{ padding: "16px", background: C.bg, borderRadius: 10, marginBottom: 16 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: C.text, marginBottom: 8 }}>Détails de connexion</div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, fontSize: 12 }}>
                          <div><span style={{ color: C.textMuted }}>Company ID</span><div style={{ fontWeight: 500, marginTop: 2 }}>{integrationConfig.company_id || "—"}</div></div>
                          <div><span style={{ color: C.textMuted }}>Pays</span><div style={{ fontWeight: 500, marginTop: 2 }}>{integrationConfig.company_country || "—"}</div></div>
                          <div><span style={{ color: C.textMuted }}>Utilisateur</span><div style={{ fontWeight: 500, marginTop: 2 }}>{integrationConfig.username || "—"}</div></div>
                          <div><span style={{ color: C.textMuted }}>Connecté le</span><div style={{ fontWeight: 500, marginTop: 2 }}>{fmtDate(integrationConfig.connected_at)}</div></div>
                        </div>
                      </div>
                      <div style={{ padding: "12px 16px", background: C.bg, borderRadius: 8, marginBottom: 16, fontSize: 11, color: C.textLight }}>
                        Serveur : {integrationConfig.base_url || "—"}
                      </div>
                      <button onClick={async () => {
                        setConfirmDialog({ message: "Déconnecter SAP SuccessFactors ?", onConfirm: async () => {
                          try {
                            await apiFetch(`/integrations/${selectedIntegration.id}/sap/disconnect`, { method: "POST" });
                            addToast_admin("SuccessFactors déconnecté");
                            refetchIntegrations(); setIntegrationPanelId(null);
                          } catch { addToast_admin(t('toast.error')); }
                          setConfirmDialog(null);
                        }});
                      }} style={{ ...sBtn("outline"), color: C.red, borderColor: C.red, fontSize: 13, width: "100%" }}>Déconnecter</button>
                    </div>
                  ) : (
                    <div>
                      <div style={{ textAlign: "center", marginBottom: 20 }}>
                        <div style={{ width: 64, height: 64, borderRadius: 16, background: `${selectedMeta.color}15`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                          <selectedMeta.Icon size={32} color={selectedMeta.color} />
                        </div>
                        <h3 style={{ fontSize: 17, fontWeight: 600, margin: "0 0 4px" }}>Connecter SAP SuccessFactors</h3>
                        <p style={{ fontSize: 12, color: C.textLight, margin: 0 }}>Synchronisez vos employés depuis votre SIRH</p>
                      </div>
                      <div style={{ marginBottom: 16 }}>
                        <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>URL du serveur API *</label>
                        <select value={integrationConfig.base_url || ""} onChange={e => setIntegrationConfig(prev => ({ ...prev, base_url: e.target.value }))} style={{ ...sInput, fontSize: 12, cursor: "pointer" }}>
                          <option value="">Sélectionner le datacenter...</option>
                          <option value="https://api2.successfactors.eu">Europe (Rot) — api2.successfactors.eu</option>
                          <option value="https://api4.successfactors.com">US East (Ashburn) — api4.successfactors.com</option>
                          <option value="https://api012.successfactors.eu">Europe (Amsterdam) — api012.successfactors.eu</option>
                          <option value="https://api15.sapsf.cn">Chine — api15.sapsf.cn</option>
                          <option value="https://apisalesdemo2.successfactors.eu">Démo EU — apisalesdemo2.successfactors.eu</option>
                          <option value="https://apisalesdemo8.successfactors.com">Démo US — apisalesdemo8.successfactors.com</option>
                        </select>
                      </div>
                      <div style={{ marginBottom: 16 }}>
                        <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Company ID *</label>
                        <input value={integrationConfig.company_id || ""} onChange={e => setIntegrationConfig(prev => ({ ...prev, company_id: e.target.value }))} placeholder="Ex: SFCPART000001" style={{ ...sInput, fontSize: 12 }} />
                      </div>
                      <div style={{ marginBottom: 16 }}>
                        <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Nom d'utilisateur API *</label>
                        <input value={integrationConfig.username || ""} onChange={e => setIntegrationConfig(prev => ({ ...prev, username: e.target.value }))} placeholder="Ex: sfadmin" style={{ ...sInput, fontSize: 12 }} />
                      </div>
                      <div style={{ marginBottom: 20 }}>
                        <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Mot de passe *</label>
                        <input type="password" value={integrationConfig.password || ""} onChange={e => setIntegrationConfig(prev => ({ ...prev, password: e.target.value }))} style={{ ...sInput, fontSize: 12 }} />
                      </div>
                      <button disabled={integrationSaving || !integrationConfig.base_url || !integrationConfig.company_id || !integrationConfig.username || !integrationConfig.password} onClick={async () => {
                        setIntegrationSaving(true);
                        try {
                          const res = await apiFetch<{ success: boolean; message: string }>(`/integrations/${selectedIntegration.id}/sap/connect`, {
                            method: "POST",
                            body: JSON.stringify({ base_url: integrationConfig.base_url, company_id: integrationConfig.company_id, username: integrationConfig.username, password: integrationConfig.password }),
                          });
                          if (res.success) {
                            addToast_admin("SuccessFactors connecté");
                            refetchIntegrations(); setIntegrationPanelId(null);
                          } else {
                            addToast_admin(res.message || "Erreur de connexion");
                          }
                        } catch (err: any) {
                          try { const p = JSON.parse(err.message); addToast_admin(p.message || "Identifiants invalides"); } catch { addToast_admin("Identifiants invalides ou serveur inaccessible"); }
                        }
                        finally { setIntegrationSaving(false); }
                      }} className="iz-btn-pink" style={{ ...sBtn("pink"), fontSize: 14, padding: "12px 0", width: "100%", opacity: integrationSaving || !integrationConfig.base_url || !integrationConfig.company_id || !integrationConfig.username || !integrationConfig.password ? 0.5 : 1 }}>
                        {integrationSaving ? "Vérification..." : "Tester et connecter"}
                      </button>

                      {/* Setup guide */}
                      <div style={{ marginTop: 20, padding: "16px", background: C.bg, borderRadius: 10, fontSize: 11, color: C.textLight }}>
                        <div style={{ fontWeight: 700, fontSize: 12, color: C.text, marginBottom: 4 }}>Procédure dans SuccessFactors</div>
                        <div style={{ padding: "6px 10px", background: C.amberLight, borderRadius: 6, marginBottom: 12, fontSize: 10, color: C.amber }}>
                          Illizeo utilise l'API <b>OData v2</b> (SFAPI est dépréciée depuis août 2018).
                        </div>
                        <div style={{ marginBottom: 12 }}>
                          <div style={{ fontWeight: 600, color: C.text, marginBottom: 4 }}>1. Créer un utilisateur technique</div>
                          <div>Admin Center → <b>Manage Users</b></div>
                          <div>Créez un utilisateur dédié (ex: <b>api_illizeo</b>)</div>
                          <div>Cochez <b>"Can use API"</b> dans les propriétés du user</div>
                        </div>
                        <div style={{ marginBottom: 12 }}>
                          <div style={{ fontWeight: 600, color: C.text, marginBottom: 4 }}>2. Créer un groupe de permissions</div>
                          <div>Admin Center → <b>Manage Permission Groups</b></div>
                          <div>Créez un groupe "Illizeo Integration"</div>
                          <div>Ajoutez l'utilisateur <b>api_illizeo</b> au groupe</div>
                        </div>
                        <div style={{ marginBottom: 12 }}>
                          <div style={{ fontWeight: 600, color: C.text, marginBottom: 4 }}>3. Configurer le rôle de permissions</div>
                          <div>Admin Center → <b>Manage Permission Roles</b></div>
                          <div>Créez un rôle "Illizeo Connector" et assignez-le au groupe</div>
                          <div style={{ marginTop: 4, fontWeight: 500, color: C.text }}>Permissions requises :</div>
                          <div style={{ padding: "8px 10px", background: C.white, borderRadius: 6, marginTop: 4, fontFamily: "monospace", fontSize: 10, lineHeight: 1.6 }}>
                            <b>Admin Privileges</b> → Manage Integration Tools<br/>
                            <b>User</b> → Read (Employee Data)<br/>
                            <b>Employee Central</b> → Read (EmpJob, EmpEmployment)<br/>
                            <b>Metadata</b> → Read (FOCompany, FODepartment, FOLocation, FOJobCode)<br/>
                            <b>OData API</b> → General OData API Access
                          </div>
                        </div>
                        <div style={{ marginBottom: 12 }}>
                          <div style={{ fontWeight: 600, color: C.text, marginBottom: 4 }}>4. Vérifier l'accès API OData</div>
                          <div>Admin Center → <b>API Center</b></div>
                          <div>Vérifiez que les endpoints OData v2 sont activés</div>
                          <div>Testez avec : <code style={{ fontSize: 10, background: C.white, padding: "1px 4px", borderRadius: 3 }}>GET /odata/v2/User?$top=1&$format=json</code></div>
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: C.text, marginBottom: 4 }}>5. Informations à renseigner ci-dessus</div>
                          <div><b>URL du serveur</b> — Sélectionnez votre datacenter (visible dans l'URL de votre instance SF)</div>
                          <div><b>Company ID</b> — Admin Center → Company Settings (affiché en haut de page)</div>
                          <div><b>Utilisateur</b> — Le login du user technique créé en étape 1</div>
                          <div><b>Mot de passe</b> — Le mot de passe de ce user technique</div>
                        </div>
                      </div>
                    </div>
                  )
                ) : selectedMeta.teamsConnect ? (
                  selectedIntegration.connecte ? (
                    <div>
                      <div style={{ padding: "20px", background: C.greenLight, borderRadius: 12, textAlign: "center", marginBottom: 20 }}>
                        <CheckCircle size={28} color={C.green} style={{ marginBottom: 8 }} />
                        <div style={{ fontSize: 16, fontWeight: 600, color: C.green, marginBottom: 4 }}>Connecté</div>
                        <div style={{ fontSize: 12, color: C.text }}>Webhook actif{integrationConfig.graph_connected ? " + Graph API" : ""}</div>
                      </div>
                      <div style={{ padding: "16px", background: C.bg, borderRadius: 10, marginBottom: 16 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: C.text, marginBottom: 10 }}>Fonctionnalités actives</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 12 }}>
                          {[
                            { Icon: PartyPopper, color: "#4CAF50", label: "Message de bienvenue", desc: "Envoyé quand un parcours onboarding démarre", active: true },
                            { Icon: AlertTriangle, color: "#F9A825", label: "Alertes retard", desc: "Actions ou documents en retard", active: true },
                            { Icon: FileText, color: "#1A73E8", label: "Notifications documents", desc: "Soumission, validation, refus", active: true },
                            { Icon: Trophy, color: "#C2185B", label: "Parcours terminé", desc: "Félicitations au collaborateur", active: true },
                            { Icon: CalendarDays, color: "#7B5EA7", label: "Réunions automatiques", desc: "Création de rdv Teams pour le parcours", active: !!integrationConfig.graph_connected },
                            { Icon: Bell, color: "#E65100", label: "Rappels avant deadline", desc: "Notification avant l'échéance", active: true },
                          ].map(f => (
                            <div key={f.label} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", background: C.white, borderRadius: 8 }}>
                              <div style={{ width: 28, height: 28, borderRadius: 6, background: `${(f as any).color || C.pink}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><f.Icon size={14} color={(f as any).color || C.pink} /></div>
                              <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 500, color: C.text }}>{f.label}</div>
                                <div style={{ fontSize: 10, color: C.textMuted }}>{f.desc}</div>
                              </div>
                              <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 4, background: f.active ? C.greenLight : C.bg, color: f.active ? C.green : C.textMuted }}>{f.active ? "Actif" : "Graph API requis"}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <button onClick={async () => {
                        try {
                          await apiFetch(`/integrations/${selectedIntegration.id}/teams/test`, { method: "POST" });
                          addToast_admin("Notification de test envoyée dans Teams");
                        } catch { addToast_admin("Erreur d'envoi"); }
                      }} className="iz-btn-outline" style={{ ...sBtn("outline"), fontSize: 13, width: "100%", marginBottom: 12 }}>Envoyer une notification de test</button>
                      <button onClick={async () => {
                        setConfirmDialog({ message: "Déconnecter Microsoft Teams ?", onConfirm: async () => {
                          try {
                            await apiFetch(`/integrations/${selectedIntegration.id}/teams/disconnect`, { method: "POST" });
                            addToast_admin("Teams déconnecté"); refetchIntegrations(); setIntegrationPanelId(null);
                          } catch { addToast_admin(t('toast.error')); }
                          setConfirmDialog(null);
                        }});
                      }} style={{ ...sBtn("outline"), color: C.red, borderColor: C.red, fontSize: 13, width: "100%" }}>Déconnecter</button>
                    </div>
                  ) : (
                    <div>
                      <div style={{ textAlign: "center", marginBottom: 20 }}>
                        <div style={{ width: 64, height: 64, borderRadius: 16, background: "#6264A715", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                          <Users size={32} color="#6264A7" />
                        </div>
                        <h3 style={{ fontSize: 17, fontWeight: 600, margin: "0 0 4px" }}>Connecter Microsoft Teams</h3>
                        <p style={{ fontSize: 12, color: C.textLight, margin: 0 }}>Automatisez vos processus d'onboarding dans Teams</p>
                      </div>

                      {/* Features covered */}
                      <div style={{ padding: "16px", background: C.white, border: `1px solid ${C.border}`, borderRadius: 10, marginBottom: 16 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: C.text, marginBottom: 10 }}>Fonctionnalités couvertes</div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 11 }}>
                          {[
                            { Icon: PartyPopper, color: "#4CAF50", label: "Message de bienvenue", desc: "Annonce automatique dans le canal quand un nouveau collaborateur arrive" },
                            { Icon: AlertTriangle, color: "#F9A825", label: "Alertes retard", desc: "Notification quand une action ou un document est en retard" },
                            { Icon: FileText, color: "#1A73E8", label: "Documents", desc: "Alerte quand un document est soumis, validé ou refusé" },
                            { Icon: Trophy, color: "#C2185B", label: "Parcours terminé", desc: "Notification de félicitations quand un parcours est complété" },
                            { Icon: CalendarDays, color: "#7B5EA7", label: "Réunions auto", desc: "Création de réunions Teams pour les rdv du parcours (Graph API)" },
                            { Icon: Bell, color: "#E65100", label: "Rappels", desc: "Rappels automatiques avant les deadlines d'actions" },
                          ].map(f => (
                            <div key={f.label} style={{ padding: "10px", background: C.bg, borderRadius: 8 }}>
                              <div style={{ width: 28, height: 28, borderRadius: 6, background: `${(f as any).color || C.pink}15`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 6 }}><f.Icon size={14} color={(f as any).color || C.pink} /></div>
                              <div style={{ fontWeight: 600, color: C.text, marginBottom: 2 }}>{f.label}</div>
                              <div style={{ color: C.textMuted, lineHeight: 1.4 }}>{f.desc}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Step 1: Webhook */}
                      <div style={{ padding: "16px", background: C.bg, borderRadius: 10, marginBottom: 16 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 4 }}>Étape 1 — Workflow Webhook (notifications)</div>
                        <div style={{ fontSize: 11, color: C.textLight, marginBottom: 12 }}>Recevez les alertes d'onboarding dans un canal Teams via Power Automate</div>
                        <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>URL du Workflow Webhook *</label>
                        <input value={integrationConfig.webhook_url || ""} onChange={e => setIntegrationConfig(prev => ({ ...prev, webhook_url: e.target.value }))} placeholder="https://prod-xx.westeurope.logic.azure.com/..." style={{ ...sInput, fontSize: 12 }} />
                      </div>

                      {/* Step 2: Graph API (optional) */}
                      <div style={{ padding: "16px", background: C.bg, borderRadius: 10, marginBottom: 20 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 4 }}>Étape 2 — Graph API (optionnel)</div>
                        <div style={{ fontSize: 11, color: C.textLight, marginBottom: 12 }}>Permet de créer des réunions Teams automatiquement</div>
                        <div style={{ marginBottom: 8 }}>
                          <label style={{ fontSize: 11, fontWeight: 600, color: C.text, display: "block", marginBottom: 4 }}>Tenant ID (Azure AD)</label>
                          <input value={integrationConfig.tenant_id || ""} onChange={e => setIntegrationConfig(prev => ({ ...prev, tenant_id: e.target.value }))} style={{ ...sInput, fontSize: 12 }} />
                        </div>
                        <div style={{ marginBottom: 8 }}>
                          <label style={{ fontSize: 11, fontWeight: 600, color: C.text, display: "block", marginBottom: 4 }}>Client ID (App Registration)</label>
                          <input value={integrationConfig.client_id || ""} onChange={e => setIntegrationConfig(prev => ({ ...prev, client_id: e.target.value }))} style={{ ...sInput, fontSize: 12 }} />
                        </div>
                        <div>
                          <label style={{ fontSize: 11, fontWeight: 600, color: C.text, display: "block", marginBottom: 4 }}>Client Secret</label>
                          <input type="password" value={integrationConfig.client_secret || ""} onChange={e => setIntegrationConfig(prev => ({ ...prev, client_secret: e.target.value }))} style={{ ...sInput, fontSize: 12 }} />
                        </div>
                      </div>

                      <button disabled={integrationSaving || !(integrationConfig.webhook_url || "").trim()} onClick={async () => {
                        setIntegrationSaving(true);
                        try {
                          // Connect webhook
                          const webhookRes = await apiFetch<{ success: boolean; message: string }>(`/integrations/${selectedIntegration.id}/teams/connect-webhook`, {
                            method: "POST", body: JSON.stringify({ webhook_url: integrationConfig.webhook_url }),
                          });
                          if (!webhookRes.success) { addToast_admin(webhookRes.message); setIntegrationSaving(false); return; }

                          // Optionally connect Graph API
                          if (integrationConfig.tenant_id && integrationConfig.client_id && integrationConfig.client_secret) {
                            const graphRes = await apiFetch<{ success: boolean; message: string }>(`/integrations/${selectedIntegration.id}/teams/connect-graph`, {
                              method: "POST", body: JSON.stringify({ tenant_id: integrationConfig.tenant_id, client_id: integrationConfig.client_id, client_secret: integrationConfig.client_secret }),
                            });
                            if (!graphRes.success) addToast_admin("Webhook OK mais Graph API échoué: " + graphRes.message);
                          }

                          addToast_admin("Microsoft Teams connecté"); refetchIntegrations(); setIntegrationPanelId(null);
                        } catch (err: any) {
                          try { const p = JSON.parse(err.message); addToast_admin(p.message || "Erreur"); } catch { addToast_admin("Erreur de connexion"); }
                        }
                        finally { setIntegrationSaving(false); }
                      }} className="iz-btn-pink" style={{ ...sBtn("pink"), fontSize: 14, padding: "12px 0", width: "100%", opacity: !(integrationConfig.webhook_url || "").trim() ? 0.5 : 1 }}>
                        {integrationSaving ? "Connexion..." : "Tester et connecter"}
                      </button>

                      <div style={{ marginTop: 20, padding: "14px 16px", background: C.bg, borderRadius: 10, fontSize: 11, color: C.textLight }}>
                        <div style={{ fontWeight: 700, fontSize: 12, color: C.text, marginBottom: 8 }}>Comment créer un Webhook Teams (via Workflows)</div>
                        <div style={{ padding: "6px 10px", background: C.amberLight, borderRadius: 6, marginBottom: 10, fontSize: 10, color: C.amber }}>
                          Les connecteurs Incoming Webhook classiques sont dépréciés. Utilisez <b>Power Automate Workflows</b>.
                        </div>
                        <div style={{ marginBottom: 8 }}>
                          <div style={{ fontWeight: 600, color: C.text }}>1. Ouvrir le canal Teams</div>
                          <div>Clic droit sur le canal → <b>Workflows</b> (ou <b>⋯</b> → <b>Workflows</b>)</div>
                        </div>
                        <div style={{ marginBottom: 8 }}>
                          <div style={{ fontWeight: 600, color: C.text }}>2. Créer un workflow webhook</div>
                          <div>Cherchez <b>"Post to a channel when a webhook request is received"</b></div>
                          <div>Sélectionnez-le et cliquez <b>Suivant</b></div>
                        </div>
                        <div style={{ marginBottom: 8 }}>
                          <div style={{ fontWeight: 600, color: C.text }}>3. Configurer le workflow</div>
                          <div>Sélectionnez l'<b>équipe</b> et le <b>canal</b> cible → Cliquez <b>Créer le flux</b></div>
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: C.text }}>4. Copier l'URL du workflow</div>
                          <div>L'URL est affichée après la création (commence par <code style={{ fontSize: 10, background: C.white, padding: "1px 3px", borderRadius: 2 }}>https://prod-xx.westeurope.logic.azure.com</code>)</div>
                          <div>Collez-la dans le champ "URL du Webhook" ci-dessus</div>
                        </div>
                      </div>
                    </div>
                  )
                ) : selectedMeta.fields.length === 0 ? (
                  <div style={{ padding: "20px", background: C.greenLight, borderRadius: 10, textAlign: "center" }}>
                    <CheckCircle size={24} color={C.green} style={{ marginBottom: 8 }} />
                    <div style={{ fontSize: 14, fontWeight: 500, color: C.green }}>Intégration native — aucune configuration requise</div>
                  </div>
                ) : (
                  <>
                    <div style={{ padding: "12px 16px", background: C.bg, borderRadius: 8, marginBottom: 20, fontSize: 12, color: C.textLight }}>
                      Configurez vos identifiants API pour connecter {selectedIntegration.nom}. Les secrets sont chiffrés et ne sont jamais exposés.
                    </div>
                    {selectedMeta.fields.map(field => (
                      <div key={field.key} style={{ marginBottom: 16 }}>
                        <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>{field.label}</label>
                        {field.type === "select" ? (
                          <select value={integrationConfig[field.key] || field.options?.[0] || ""} onChange={e => setIntegrationConfig(prev => ({ ...prev, [field.key]: e.target.value }))} style={{ ...sInput, fontSize: 12, cursor: "pointer" }}>
                            {field.options?.map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        ) : (
                          <input type={field.type === "password" ? "password" : "text"} value={integrationConfig[field.key] || ""} onChange={e => setIntegrationConfig(prev => ({ ...prev, [field.key]: e.target.value }))} placeholder={field.type === "password" ? "••••••••" : ""} style={{ ...sInput, fontSize: 12 }} />
                        )}
                      </div>
                    ))}
                  </>
                )}

                {/* Status toggle — only for non-OAuth and non-native */}
                {!selectedMeta.oauth && selectedMeta.fields.length > 0 && (
                <div style={{ marginTop: 20, padding: "14px 16px", background: C.bg, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>Activer l'intégration</div>
                    <div style={{ fontSize: 11, color: C.textLight }}>Rend ce connecteur disponible pour les actions</div>
                  </div>
                  <div onClick={async () => {
                    await apiUpdateIntegration(selectedIntegration.id, { actif: !selectedIntegration.actif });
                    refetchIntegrations();
                  }} style={{ width: 44, height: 24, borderRadius: 12, background: selectedIntegration.actif ? C.green : C.border, cursor: "pointer", position: "relative", transition: "all .2s" }}>
                    <div style={{ width: 20, height: 20, borderRadius: "50%", background: C.white, position: "absolute", top: 2, left: selectedIntegration.actif ? 22 : 2, transition: "all .2s", boxShadow: "0 1px 3px rgba(0,0,0,.2)" }} />
                  </div>
                </div>
                )}
              </div>
              <div style={{ padding: "16px 28px", borderTop: `1px solid ${C.border}`, display: "flex", gap: 8, justifyContent: "flex-end" }}>
                <button onClick={() => setIntegrationPanelId(null)} style={{ ...sBtn("outline"), fontSize: 13 }}>Fermer</button>
                {!selectedMeta.oauth && selectedMeta.fields.length > 0 && (
                  <button disabled={integrationSaving} onClick={async () => {
                    setIntegrationSaving(true);
                    try {
                      await apiUpdateIntegration(selectedIntegration.id, { config: integrationConfig, actif: true, connecte: true });
                      addToast_admin(`${selectedIntegration.nom} configuré avec succès`);
                      refetchIntegrations();
                      setIntegrationPanelId(null);
                    } catch { addToast_admin("Erreur lors de la configuration"); }
                    finally { setIntegrationSaving(false); }
                  }} className="iz-btn-pink" style={{ ...sBtn("pink"), fontSize: 13, opacity: integrationSaving ? 0.6 : 1 }}>
                    {integrationSaving ? "Enregistrement..." : "Enregistrer & connecter"}
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
      );
    };
  
    // ─── SIDEBAR ───────────────────────────────────────────────
    const collapsed = sidebarCollapsed;
    const sidebarW = collapsed ? 64 : 220;
    const renderSidebar_admin = () => (
      <div style={{ width: sidebarW, minHeight: "100vh", background: C.white, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", flexShrink: 0, position: "sticky", top: 0, transition: "width .2s ease", overflow: "hidden" }}>
        {/* Logo + toggle */}
        <div style={{ padding: collapsed ? "16px 0" : "16px 16px", display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "space-between", height: 56 }}>
          {collapsed ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%" }}><IllizeoLogo size={28} /></div>
          ) : (
            <div style={{ color: C.pink }}><IllizeoLogoFull height={22} /></div>
          )}
        </div>
        {/* Expand/collapse toggle */}
        <button onClick={() => setSidebarCollapsed(!collapsed)} style={{ display: "flex", alignItems: "center", justifyContent: "center", width: collapsed ? 64 : "100%", padding: "8px 0", background: "none", border: "none", cursor: "pointer", color: C.textMuted, transition: "all .15s" }}
          onMouseEnter={e => (e.currentTarget.style.color = C.pink)} onMouseLeave={e => (e.currentTarget.style.color = C.textMuted)}>
          {collapsed ? <ChevronsRight size={16} /> : <ChevronsLeft size={16} />}
        </button>
        {/* Nav */}
        <div style={{ flex: 1, padding: collapsed ? "4px 8px" : "0 10px", overflow: "auto" }}>
          {SIDEBAR.map(section => (
            <div key={section.section} style={{ marginBottom: collapsed ? 4 : 8 }}>
              {!collapsed && <div style={{ fontSize: 10, fontWeight: 700, color: C.pink, letterSpacing: .4, padding: "12px 10px 4px", textTransform: "uppercase" }}>{section.section}</div>}
              {collapsed && <div style={{ height: 1, background: C.border, margin: "6px 8px" }} />}
              {section.items.map(item => {
                const active = adminPage === item.id;
                const Icon = item.icon;
                const accessible = isPageAccessible(item.id);
                return (
                  <button key={item.id} onClick={() => {
                    if (trialExpired && !hasActiveSub && !isEditorTenant && item.id !== "admin_abonnement") {
                      setAdminPage("admin_abonnement" as any); setSubView("change");
                      addToast_admin("Votre période d'essai est terminée. Veuillez souscrire un plan.");
                    } else if (accessible) { setAdminPage(item.id); setCollabProfileId(null); }
                    else { addToast_admin("Module non inclus dans votre plan. Mettez à niveau votre abonnement."); }
                  }} title={collapsed ? item.label + (accessible ? "" : " (non inclus)") : undefined} className="iz-sidebar-item" style={{
                    display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "flex-start", gap: 10,
                    width: "100%", padding: collapsed ? "10px 0" : "8px 10px", borderRadius: 8, border: "none",
                    background: active ? C.pinkBg : "transparent",
                    color: active ? C.pink : accessible ? C.textLight : C.border,
                    cursor: accessible ? "pointer" : "not-allowed", fontFamily: font, fontSize: 13, fontWeight: active ? 600 : 400, transition: "all .15s",
                    opacity: accessible ? 1 : 0.4,
                  }}>
                    <Icon size={18} color={active ? C.pink : accessible ? C.textMuted : C.border} />
                    {!collapsed && <span style={{ textAlign: "left", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.label}</span>}
                    {!collapsed && !accessible && <Lock size={12} color={C.border} style={{ marginLeft: "auto" }} />}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
        {/* Bottom: Settings + User */}
        <div style={{ borderTop: `1px solid ${C.border}`, padding: collapsed ? "8px 0" : "8px 10px" }}>
          {/* Super Admin shortcut (visible for super_admin role OR platform admin email) */}
          {isEditorTenant && (auth.user?.email === "wilfrid@illizeo.com" || auth.user?.email === "admin@illizeo.com") && (
            <button onClick={() => { setSuperAdminMode(true); setSaDashData(null); setSaPlans([]); setSaTenants([]); setSaSubscriptions([]); setSaLoaded(false); }} title="Super Admin" className="iz-sidebar-item" style={{
              display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "flex-start", gap: 10,
              width: "100%", padding: collapsed ? "10px 0" : "8px 10px", borderRadius: 8, border: "none",
              background: "transparent", color: C.amber, cursor: "pointer", fontFamily: font, fontSize: 13, transition: "all .15s",
            }}>
              <Crown size={18} />
              {!collapsed && <span>Super Admin</span>}
            </button>
          )}
          {/* Settings shortcut */}
          <button onClick={() => setAdminPage("admin_apparence")} title="Paramètres" className="iz-sidebar-item" style={{
            display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "flex-start", gap: 10,
            width: "100%", padding: collapsed ? "10px 0" : "8px 10px", borderRadius: 8, border: "none",
            background: "transparent", color: C.textMuted, cursor: "pointer", fontFamily: font, fontSize: 13, transition: "all .15s",
          }}>
            <Settings size={18} />
            {!collapsed && <span>Paramètres</span>}
          </button>
        </div>
        {/* User avatar */}
        <div style={{ borderTop: `1px solid ${C.border}`, padding: collapsed ? "12px 0" : "10px 12px", display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "flex-start", gap: 10 }}>
          <div onClick={() => { if (collapsed) setSidebarCollapsed(false); }} style={{ width: 34, height: 34, borderRadius: "50%", background: `linear-gradient(135deg, ${C.pinkSoft}, ${C.pink})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600, color: C.white, cursor: "pointer", flexShrink: 0 }}>
            {auth.user?.name?.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() || "?"}
          </div>
          {!collapsed && (
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: C.dark, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{auth.user?.name || "Admin"}</div>
              <button onClick={() => { const tid = localStorage.getItem("illizeo_tenant_id"); auth.logout().catch(() => {}).finally(() => { window.location.href = tid ? `${window.location.pathname}?tenant=${tid}` : window.location.pathname; }); }} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, color: C.textMuted, fontFamily: font, padding: 0, display: "flex", alignItems: "center", gap: 4 }}>
                <LogOut size={11} /> {t('auth.logout')}
              </button>
            </div>
          )}
        </div>
        {/* Language selector */}
        <div style={{ padding: collapsed ? "6px 4px" : "6px 12px", display: "flex", gap: 3, justifyContent: "center", borderTop: `1px solid ${C.border}` }}>
          {activeLanguages.map(l => (
            <button key={l} onClick={() => switchLang(l)} title={LANG_META[l].nativeName} style={{
              padding: collapsed ? "4px" : "3px 6px", borderRadius: 4, fontSize: collapsed ? 14 : 10, fontWeight: lang === l ? 600 : 400, border: "none", cursor: "pointer", fontFamily: font,
              background: lang === l ? C.pinkBg : "transparent", color: lang === l ? C.pink : C.textMuted, transition: "all .15s",
            }}>{collapsed ? LANG_META[l].flag : `${LANG_META[l].flag} ${l.toUpperCase()}`}</button>
          ))}
        </div>
      </div>
    );
  

  // ─── SUPER ADMIN PANEL ──────────────────────────────────
  if (superAdminMode && auth.isAuthenticated) {
    const loadSA = () => {
      superAdminDashboard().then(setSaDashData).catch(e => { console.error("SA dashboard error:", e); setSaDashData({ total_tenants: 0, active_subscriptions: 0, mrr_eur: 0, mrr_chf: 0, total_collaborateurs: 0 }); });
      superAdminListTenants().then(setSaTenants).catch(() => setSaTenants([]));
      superAdminListPlans().then(setSaPlans).catch(() => setSaPlans([]));
      superAdminListSubscriptions().then(setSaSubscriptions).catch(() => setSaSubscriptions([]));
      superAdminGetStripeConfig().then(setSaStripe).catch(() => setSaStripe({ has_key: false, has_secret: false, has_webhook: false }));
    };
    if (!saLoaded) { setSaLoaded(true); loadSA(); }
    return (
      <div style={{ display: "flex", minHeight: "100vh", fontFamily: font, background: C.white, color: C.text }}>
        <style dangerouslySetInnerHTML={{ __html: ANIM_STYLES }} />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;1,9..40,400&display=swap" rel="stylesheet" />
        {/* Sidebar */}
        <div style={{ width: 220, minHeight: "100vh", background: C.dark, display: "flex", flexDirection: "column", flexShrink: 0 }}>
          <div style={{ padding: "20px 16px", color: C.white, fontSize: 16, fontWeight: 700 }}>Super Admin</div>
          {([
            { id: "dashboard" as const, label: t('sidebar.dashboard'), icon: LayoutDashboard },
            { id: "tenants" as const, label: "Clients", icon: Building2 },
            { id: "plans" as const, label: "Plans & Modules", icon: Package },
            { id: "subscriptions" as const, label: "Abonnements", icon: FileSignature },
            { id: "stripe" as const, label: "Stripe", icon: CircleDollarSign },
          ]).map(item => (
            <button key={item.id} onClick={() => setSaTab(item.id)} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 16px", border: "none", background: saTab === item.id ? "rgba(255,255,255,.1)" : "transparent", color: saTab === item.id ? C.white : "rgba(255,255,255,.5)", cursor: "pointer", fontFamily: font, fontSize: 13, fontWeight: saTab === item.id ? 600 : 400, borderLeft: saTab === item.id ? `3px solid ${C.pink}` : "3px solid transparent" }}>
              <item.icon size={16} /> {item.label}
            </button>
          ))}
          <div style={{ flex: 1 }} />
          <button onClick={() => setSuperAdminMode(false)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 16px", border: "none", background: "none", color: "rgba(255,255,255,.5)", cursor: "pointer", fontFamily: font, fontSize: 12 }}>
            <ChevronLeft size={14} /> Retour à l'app
          </button>
        </div>
        {/* Content */}
        <div style={{ flex: 1, padding: "24px 32px", overflow: "auto" }}>
          {saTab === "dashboard" && (
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 20 }}>Dashboard Plateforme</h1>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
                {[
                  { label: "Clients", value: saDashData?.total_tenants || 0, icon: Building2, color: C.pink },
                  { label: "Abonnements actifs", value: saDashData?.active_subscriptions || 0, icon: CheckCircle, color: C.green },
                  { label: "MRR (EUR)", value: `${saDashData?.mrr_eur?.toLocaleString() || saDashData?.mrr?.toLocaleString() || 0} €`, icon: Banknote, color: C.blue },
                  { label: "MRR (CHF)", value: `${saDashData?.mrr_chf?.toLocaleString() || 0} CHF`, icon: Banknote, color: C.amber },
                ].map((s, i) => (
                  <div key={i} className="iz-card" style={{ ...sCard, padding: "20px", display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 10, background: s.color + "20", display: "flex", alignItems: "center", justifyContent: "center" }}><s.icon size={20} color={s.color} /></div>
                    <div><div style={{ fontSize: 24, fontWeight: 700 }}>{s.value}</div><div style={{ fontSize: 11, color: C.textMuted }}>{s.label}</div></div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {saTab === "tenants" && (
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 20 }}>Clients</h1>
              <div className="iz-card" style={{ ...sCard, overflow: "hidden", padding: 0 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 0.8fr 0.5fr", gap: 0, padding: "10px 16px", background: C.bg, borderBottom: `1px solid ${C.border}`, fontSize: 11, fontWeight: 600, color: C.textLight, textTransform: "uppercase" }}>
                  <span>Tenant</span><span>Plan</span><span>Email facturation</span><span>Statut</span><span></span>
                </div>
                {saTenants.map(t => (
                  <div key={t.id} style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 0.8fr 0.5fr", gap: 0, padding: "12px 16px", borderBottom: `1px solid ${C.border}`, alignItems: "center", fontSize: 13 }}>
                    <div><div style={{ fontWeight: 600 }}>{t.nom || t.id}</div><div style={{ fontSize: 11, color: C.textMuted }}>{t.id}.illizeo.com</div></div>
                    <div style={{ fontSize: 12 }}>{t.plan || "—"}</div>
                    <div style={{ fontSize: 12, color: C.textLight }}>{t.billing_email || "—"}</div>
                    <span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 600, background: t.actif ? C.greenLight : C.redLight, color: t.actif ? C.green : C.red }}>{t.actif ? "Actif" : "Inactif"}</span>
                    <button onClick={() => showConfirm(`Supprimer le tenant ${t.id} et toutes ses données ?`, async () => { try { await superAdminDeleteTenant(t.id); loadSA(); addToast_admin("Tenant supprimé"); } catch { addToast_admin(t('toast.error')); } })} style={{ background: C.redLight, border: "none", borderRadius: 6, padding: 4, cursor: "pointer" }}><Trash size={14} color={C.red} /></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {saTab === "plans" && (
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                <h1 style={{ fontSize: 22, fontWeight: 600, margin: 0 }}>Plans & Modules</h1>
                <button onClick={() => { setSaPlanData({ nom: "", slug: "", description: "", prix_eur_mensuel: 0, prix_chf_mensuel: 0, min_mensuel_eur: 0, min_mensuel_chf: 0, max_collaborateurs: null, max_admins: null, max_parcours: null, max_integrations: null, max_workflows: null, populaire: false, actif: true, ordre: saPlans.length + 1, stripe_price_id_eur: "", stripe_price_id_chf: "" }); setSaPlanPanel("create"); }} className="iz-btn-pink" style={{ ...sBtn("pink"), display: "flex", alignItems: "center", gap: 6 }}><Plus size={14} /> Nouveau plan</button>
              </div>

              {/* Pricing model info */}
              <div style={{ padding: "14px 20px", background: C.blueLight, borderRadius: 10, marginBottom: 20, fontSize: 12, color: C.blue, display: "flex", alignItems: "center", gap: 10 }}>
                <Banknote size={18} />
                <div>
                  <b>Modèle de facturation :</b> CHF uniquement · Mensuel ou annuel (-10%) · Min. 25 employés facturés · Cooptation = forfait mensuel · Paiement : Stripe ou facture
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>
                {saPlans.sort((a, b) => a.ordre - b.ordre).map(plan => {
                  const allModules = ["onboarding","offboarding","crossboarding","cooptation","nps","signature","sso","provisioning","api","white_label","gamification"];
                  const moduleLabels: Record<string, string> = { onboarding: "Onboarding", offboarding: "Offboarding", crossboarding: "Crossboarding", cooptation: "Cooptation", nps: "NPS", signature: "Signature", sso: "SSO", provisioning: "Provisionnement", api: "API", white_label: "White-label", gamification: "Gamification" };
                  return (
                  <div key={plan.id} className="iz-card" style={{ ...sCard, padding: 0, overflow: "hidden", border: plan.populaire ? `2px solid ${C.pink}` : undefined }}>
                    {plan.populaire && <div style={{ background: C.pink, color: C.white, textAlign: "center", padding: "4px 0", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>Le plus populaire</div>}
                    <div style={{ padding: "20px 24px" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                        <h3 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>{plan.nom}</h3>
                        <span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 600, background: plan.actif ? C.greenLight : C.redLight, color: plan.actif ? C.green : C.red }}>{plan.actif ? "Actif" : "Inactif"}</span>
                      </div>

                      {/* Pricing */}
                      <div style={{ background: C.bg, borderRadius: 10, padding: "14px 16px", marginBottom: 16 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Tarification</div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 12 }}>
                          <div><span style={{ color: C.textMuted }}>Mensuel :</span> <b>{plan.prix_chf_mensuel} CHF</b>/emp/mois</div>
                          <div><span style={{ color: C.textMuted }}>Annuel :</span> <b>{(Number(plan.prix_chf_mensuel) * 0.9).toFixed(1)} CHF</b>/emp/mois <span style={{ fontSize: 9, color: C.green, fontWeight: 600 }}>-10%</span></div>
                          <div><span style={{ color: C.textMuted }}>Min :</span> <b>{plan.min_mensuel_chf} CHF</b>/mois</div>
                          <div><span style={{ color: C.textMuted }}>Min annuel :</span> <b>{Math.round(Number(plan.min_mensuel_chf) * 12 * 0.9)} CHF</b>/an</div>
                        </div>
                        <div style={{ marginTop: 8, fontSize: 11, color: C.textMuted }}>Min. 25 collaborateurs facturés · Facturation en CHF uniquement</div>
                      </div>

                      {/* Limits */}
                      <div style={{ marginBottom: 16 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Limites</div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4, fontSize: 12, color: C.textLight }}>
                          <span>Collaborateurs : <b style={{ color: C.text }}>{plan.max_collaborateurs || "∞"}</b></span>
                          <span>Admins : <b style={{ color: C.text }}>{plan.max_admins || "∞"}</b></span>
                          <span>Parcours : <b style={{ color: C.text }}>{plan.max_parcours || "∞"}</b></span>
                          <span>Intégrations : <b style={{ color: C.text }}>{plan.max_integrations || "∞"}</b></span>
                          <span>Workflows : <b style={{ color: C.text }}>{plan.max_workflows || "∞"}</b></span>
                        </div>
                      </div>

                      {/* Stripe IDs */}
                      <div style={{ marginBottom: 16 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Stripe</div>
                        <div style={{ fontSize: 11, color: C.textMuted }}>
                          <div>Price EUR : {plan.stripe_price_id_eur || <span style={{ color: C.amber }}>Non configuré</span>}</div>
                          <div>Price CHF : {plan.stripe_price_id_chf || <span style={{ color: C.amber }}>Non configuré</span>}</div>
                        </div>
                      </div>

                      {/* Modules toggles */}
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Modules inclus</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                          {allModules.map(mod => {
                            const active = plan.modules?.some(m => m.module === mod && m.actif);
                            return (
                            <div key={mod} onClick={async () => {
                              const newModules = allModules.map(m => ({ module: m, actif: m === mod ? !active : (plan.modules?.some(pm => pm.module === m && pm.actif) || false) }));
                              try { await superAdminUpdateModules(plan.id, newModules); loadSA(); addToast_admin(`${moduleLabels[mod]} ${active ? "désactivé" : "activé"}`); } catch { addToast_admin(t('toast.error')); }
                            }} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, cursor: "pointer", padding: "3px 0" }}>
                              <div style={{ width: 34, height: 18, borderRadius: 9, background: active ? C.green : C.border, position: "relative", transition: "all .2s", flexShrink: 0 }}>
                                <div style={{ width: 14, height: 14, borderRadius: "50%", background: C.white, position: "absolute", top: 2, left: active ? 18 : 2, transition: "all .2s", boxShadow: "0 1px 2px rgba(0,0,0,.2)" }} />
                              </div>
                              <span style={{ color: active ? C.text : C.textMuted, fontWeight: active ? 500 : 400 }}>{moduleLabels[mod]}</span>
                            </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Payment modes */}
                    <div style={{ padding: "12px 24px", borderTop: `1px solid ${C.border}`, display: "flex", gap: 6, fontSize: 11 }}>
                      <span style={{ padding: "2px 8px", borderRadius: 4, background: C.blueLight, color: C.blue, fontWeight: 600 }}>Stripe</span>
                      <span style={{ padding: "2px 8px", borderRadius: 4, background: C.amberLight, color: C.amber, fontWeight: 600 }}>Facture</span>
                      {plan.slug === "enterprise" && <span style={{ padding: "2px 8px", borderRadius: 4, background: C.purple + "15", color: "#7B5EA7", fontWeight: 600 }}>Sur devis</span>}
                      <div style={{ flex: 1 }} />
                      <button onClick={() => { setSaPlanData({ ...plan, stripe_price_id_eur: plan.stripe_price_id_eur || "", stripe_price_id_chf: plan.stripe_price_id_chf || "" }); setSaPlanPanel("edit"); }} style={{ background: C.bg, border: "none", borderRadius: 4, padding: "2px 8px", cursor: "pointer", fontSize: 11, color: C.textMuted }}>{t('common.edit')}</button>
                    </div>
                  </div>
                  );
                })}
              </div>
              {saPlans.length === 0 && <div style={{ padding: 40, textAlign: "center", color: C.textMuted }}>Chargement des plans...</div>}

              {/* Plan Create/Edit Panel */}
              {saPlanPanel !== "closed" && (
                <>
                  <div onClick={() => setSaPlanPanel("closed")} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.3)", zIndex: 1000 }} />
                  <div className="iz-panel" style={{ position: "fixed", top: 0, right: 0, width: 600, height: "100vh", background: C.white, boxShadow: "-4px 0 24px rgba(0,0,0,.1)", zIndex: 1001, display: "flex", flexDirection: "column" }}>
                    <div style={{ padding: "20px 24px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>{saPlanPanel === "create" ? "Nouveau plan" : "Modifier le plan"}</h2>
                      <button onClick={() => setSaPlanPanel("closed")} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={18} /></button>
                    </div>
                    <div style={{ flex: 1, padding: 24, overflow: "auto", display: "flex", flexDirection: "column", gap: 14 }}>
                      {/* Quick templates */}
                      {saPlanPanel === "create" && (
                        <div style={{ padding: 14, background: C.pinkBg, borderRadius: 10, marginBottom: 4 }}>
                          <div style={{ fontSize: 12, fontWeight: 600, color: C.pink, marginBottom: 8 }}>Modèles proposés</div>
                          <div style={{ display: "flex", gap: 8 }}>
                            {[
                              { label: "Onboarding Starter", nom: "Onboarding Starter", slug: "onboarding-starter", description: "Onboarding basique — min. 25 collaborateurs", prix: 5.5, min: 137.5, max_c: 100, max_a: 3, max_p: 3, max_i: 2, max_w: 5 },
                              { label: "Onboarding Business", nom: "Onboarding Business", slug: "onboarding-business", description: "Onboarding + Offboarding + Crossboarding complet", prix: 9.5, min: 237.5, max_c: 500, max_a: 10, max_p: null, max_i: 5, max_w: null },
                              { label: "Cooptation", nom: "Cooptation", slug: "cooptation", description: "Module de cooptation — forfait mensuel", prix: 3.5, min: 220, max_c: null, max_a: null, max_p: null, max_i: 2, max_w: null },
                              { label: "Enterprise", nom: "Enterprise", slug: "enterprise", description: "Tous les modules — sur devis", prix: 13, min: 3300, max_c: null, max_a: null, max_p: null, max_i: null, max_w: null },
                            ].map(tpl => (
                              <button key={tpl.slug} onClick={() => setSaPlanData({ ...saPlanData, nom: tpl.nom, slug: tpl.slug, description: tpl.description, prix_eur_mensuel: tpl.prix, prix_chf_mensuel: tpl.prix, min_mensuel_eur: tpl.min, min_mensuel_chf: tpl.min, max_collaborateurs: tpl.max_c, max_admins: tpl.max_a, max_parcours: tpl.max_p, max_integrations: tpl.max_i, max_workflows: tpl.max_w })} className="iz-btn-outline" style={{ ...sBtn("outline"), fontSize: 10, padding: "4px 10px" }}>{tpl.label}</button>
                            ))}
                          </div>
                        </div>
                      )}
                      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12 }}>
                        <div><label style={{ fontSize: 11, color: C.textLight, display: "block", marginBottom: 4 }}>Nom du plan *</label><input value={saPlanData.nom} onChange={e => setSaPlanData((p: any) => ({ ...p, nom: e.target.value }))} style={sInput} placeholder="Ex: Onboarding Business" /></div>
                        <div><label style={{ fontSize: 11, color: C.textLight, display: "block", marginBottom: 4 }}>Slug *</label><input value={saPlanData.slug} onChange={e => setSaPlanData((p: any) => ({ ...p, slug: e.target.value }))} style={sInput} placeholder="onboarding-business" /></div>
                      </div>
                      <div><label style={{ fontSize: 11, color: C.textLight, display: "block", marginBottom: 4 }}>Description</label><textarea value={saPlanData.description || ""} onChange={e => setSaPlanData((p: any) => ({ ...p, description: e.target.value }))} style={{ ...sInput, minHeight: 50, resize: "vertical" }} /></div>

                      <div style={{ fontSize: 13, fontWeight: 600, color: C.pink, marginTop: 4 }}>Tarification (CHF uniquement)</div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                        <div><label style={{ fontSize: 10, color: C.textLight, display: "block", marginBottom: 4 }}>Prix CHF/emp/mois</label><input type="number" step="0.5" value={saPlanData.prix_chf_mensuel} onChange={e => setSaPlanData((p: any) => ({ ...p, prix_chf_mensuel: Number(e.target.value), prix_eur_mensuel: Number(e.target.value) }))} style={sInput} /></div>
                        <div><label style={{ fontSize: 10, color: C.textLight, display: "block", marginBottom: 4 }}>Min CHF/mois (25 emp.)</label><input type="number" value={saPlanData.min_mensuel_chf} onChange={e => setSaPlanData((p: any) => ({ ...p, min_mensuel_chf: Number(e.target.value), min_mensuel_eur: Number(e.target.value) }))} style={sInput} /></div>
                      </div>
                      <div style={{ padding: "8px 12px", background: C.bg, borderRadius: 8, fontSize: 11, color: C.textMuted }}>
                        Annuel : <b>{(Number(saPlanData.prix_chf_mensuel || 0) * 0.9).toFixed(1)} CHF</b>/emp/mois (-10%) · Min annuel : <b>{Math.round(Number(saPlanData.min_mensuel_chf || 0) * 12 * 0.9)} CHF</b>/an
                      </div>

                      <div style={{ fontSize: 13, fontWeight: 600, color: C.pink, marginTop: 4 }}>Limites <span style={{ fontWeight: 400, fontSize: 11, color: C.textMuted }}>(vide = illimité)</span></div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr", gap: 10 }}>
                        {[
                          { key: "max_collaborateurs", label: "Collabs" },
                          { key: "max_admins", label: "Admins" },
                          { key: "max_parcours", label: "Parcours" },
                          { key: "max_integrations", label: "Intégr." },
                          { key: "max_workflows", label: "Workflows" },
                        ].map(f => (
                          <div key={f.key}><label style={{ fontSize: 10, color: C.textLight, display: "block", marginBottom: 4 }}>{f.label}</label><input type="number" value={saPlanData[f.key] ?? ""} onChange={e => setSaPlanData((p: any) => ({ ...p, [f.key]: e.target.value ? Number(e.target.value) : null }))} style={sInput} placeholder="∞" /></div>
                        ))}
                      </div>

                      <div style={{ fontSize: 13, fontWeight: 600, color: C.pink, marginTop: 4 }}>Stripe</div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                        <div><label style={{ fontSize: 10, color: C.textLight, display: "block", marginBottom: 4 }}>Stripe Price ID (EUR)</label><input value={saPlanData.stripe_price_id_eur || ""} onChange={e => setSaPlanData((p: any) => ({ ...p, stripe_price_id_eur: e.target.value }))} style={sInput} placeholder="price_..." /></div>
                        <div><label style={{ fontSize: 10, color: C.textLight, display: "block", marginBottom: 4 }}>Stripe Price ID (CHF)</label><input value={saPlanData.stripe_price_id_chf || ""} onChange={e => setSaPlanData((p: any) => ({ ...p, stripe_price_id_chf: e.target.value }))} style={sInput} placeholder="price_..." /></div>
                      </div>

                      <div style={{ display: "flex", gap: 16, marginTop: 4 }}>
                        <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 13 }}>
                          <input type="checkbox" checked={saPlanData.populaire} onChange={e => setSaPlanData((p: any) => ({ ...p, populaire: e.target.checked }))} style={{ accentColor: C.pink }} /> Populaire
                        </label>
                        <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 13 }}>
                          <input type="checkbox" checked={saPlanData.actif} onChange={e => setSaPlanData((p: any) => ({ ...p, actif: e.target.checked }))} style={{ accentColor: C.green }} /> Actif
                        </label>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}><label style={{ fontSize: 11, color: C.textLight }}>Ordre :</label><input type="number" value={saPlanData.ordre} onChange={e => setSaPlanData((p: any) => ({ ...p, ordre: Number(e.target.value) }))} style={{ ...sInput, width: 60 }} /></div>
                      </div>
                    </div>
                    <div style={{ padding: "16px 24px", borderTop: `1px solid ${C.border}`, display: "flex", gap: 8, justifyContent: "space-between" }}>
                      {saPlanPanel === "edit" && saPlanData.id && (
                        <button onClick={() => showConfirm("Supprimer ce plan ?", async () => { try { await superAdminDeletePlan(saPlanData.id); loadSA(); setSaPlanPanel("closed"); addToast_admin("Plan supprimé"); } catch { addToast_admin(t('toast.error')); } })} style={{ ...sBtn("outline"), color: C.red, borderColor: C.red }}>{t('common.delete')}</button>
                      )}
                      <div style={{ flex: 1 }} />
                      <button onClick={() => setSaPlanPanel("closed")} className="iz-btn-outline" style={sBtn("outline")}>{t('common.cancel')}</button>
                      <button onClick={async () => {
                        try {
                          if (saPlanPanel === "edit" && saPlanData.id) await superAdminUpdatePlan(saPlanData.id, saPlanData);
                          else await superAdminCreatePlan(saPlanData);
                          loadSA(); setSaPlanPanel("closed"); addToast_admin(saPlanPanel === "create" ? "Plan créé" : "Plan modifié");
                        } catch { addToast_admin(t('toast.error')); }
                      }} className="iz-btn-pink" style={sBtn("pink")}>{saPlanPanel === "create" ? t('common.create') : t('common.save')}</button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {saTab === "subscriptions" && (
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 20 }}>Abonnements</h1>
              {saSubscriptions.length === 0 ? <div style={{ padding: 40, textAlign: "center", color: C.textMuted }}>Aucun abonnement</div> : (
                <div className="iz-card" style={{ ...sCard, overflow: "hidden", padding: 0 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr 0.8fr", gap: 0, padding: "10px 16px", background: C.bg, borderBottom: `1px solid ${C.border}`, fontSize: 11, fontWeight: 600, color: C.textLight, textTransform: "uppercase" }}>
                    <span>Tenant</span><span>Plan</span><span>Statut</span><span>Période</span><span>Stripe</span>
                  </div>
                  {saSubscriptions.map(s => (
                    <div key={s.id} style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr 0.8fr", gap: 0, padding: "12px 16px", borderBottom: `1px solid ${C.border}`, alignItems: "center", fontSize: 13 }}>
                      <span style={{ fontWeight: 500 }}>{s.tenant_id}</span>
                      <span>{s.plan?.nom || "—"}</span>
                      <span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 600, background: s.status === "active" ? C.greenLight : C.amberLight, color: s.status === "active" ? C.green : C.amber }}>{s.status}</span>
                      <span style={{ fontSize: 11, color: C.textMuted }}>{fmtDate(s.current_period_start)} → {fmtDate(s.current_period_end)}</span>
                      <span style={{ fontSize: 11, color: C.textMuted }}>{s.stripe_subscription_id || "—"}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {saTab === "stripe" && (
            <div style={{ maxWidth: 600 }}>
              <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 20 }}>Configuration Stripe</h1>
              <div className="iz-card" style={{ ...sCard }}>
                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: saStripe?.has_secret ? C.green : C.red }} />
                    <span style={{ fontSize: 13, fontWeight: 500 }}>{saStripe?.has_secret ? "Stripe connecté" : "Stripe non configuré"}</span>
                  </div>
                </div>
                {[
                  { key: "stripe_key", label: "Publishable Key", placeholder: "pk_..." },
                  { key: "stripe_secret", label: "Secret Key", placeholder: "sk_..." },
                  { key: "stripe_webhook_secret", label: "Webhook Secret", placeholder: "whsec_..." },
                ].map(field => (
                  <div key={field.key} style={{ marginBottom: 14 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>{field.label}</label>
                    <input id={`sa-${field.key}`} type="password" placeholder={field.placeholder} style={sInput} />
                  </div>
                ))}
                <button onClick={async () => {
                  const data: any = {};
                  ["stripe_key", "stripe_secret", "stripe_webhook_secret"].forEach(k => {
                    const el = document.getElementById(`sa-${k}`) as HTMLInputElement;
                    if (el?.value) data[k] = el.value;
                  });
                  if (Object.keys(data).length === 0) { addToast_admin("Aucune clé saisie"); return; }
                  try { await superAdminUpdateStripeConfig(data); loadSA(); addToast_admin("Configuration Stripe enregistrée"); } catch { addToast_admin(t('toast.error')); }
                }} className="iz-btn-pink" style={sBtn("pink")}>{t('common.save')}</button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─── ADMIN MAIN RENDER ───────────────────────────────────
  // ═══ SETUP WIZARD ═══════════════════════════════════════════
  const SETUP_STEPS = [
    { id: "company", title: "Votre entreprise", desc: "Informations de base sur votre organisation", icon: Building2, required: true },
    { id: "appearance", title: "Apparence", desc: "Logo et couleurs de votre espace", icon: Palette, required: false },
    { id: "team", title: "Votre équipe", desc: "Invitez vos premiers collaborateurs", icon: Users, required: true },
    { id: "parcours", title: "Premier parcours", desc: "Configurez votre parcours d'onboarding", icon: Route, required: true },
    { id: "documents", title: "Documents requis", desc: "Pièces à demander aux nouvelles recrues", icon: FileText, required: true },
    { id: "email", title: "Email de bienvenue", desc: "Personnalisez l'invitation envoyée", icon: Mail, required: false },
    { id: "first_collab", title: "Premier collaborateur", desc: "Ajoutez votre première recrue", icon: UserPlus, required: false },
  ];
  const SECTORS = ["Technologie", "Finance & Banque", "Santé", "Industrie", "Commerce & Retail", "Services", "Éducation", "Immobilier", "Hôtellerie & Restauration", "Transport & Logistique", "Conseil", "Autre"];
  const COMPANY_SIZES = ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"];
  const SETUP_DOCS = [
    { id: "piece_identite", label: "Pièce d'identité (CNI / Passeport)" },
    { id: "rib", label: "RIB / Coordonnées bancaires" },
    { id: "attestation_securite_sociale", label: "Attestation sécurité sociale / AVS" },
    { id: "photo_identite", label: "Photo d'identité" },
    { id: "permis_travail", label: "Permis de travail / Titre de séjour" },
    { id: "diplome", label: "Diplôme(s) / Certificat(s)" },
    { id: "cv", label: "CV" },
    { id: "justificatif_domicile", label: "Justificatif de domicile" },
    { id: "certificat_medical", label: "Certificat médical" },
    { id: "casier_judiciaire", label: "Extrait de casier judiciaire" },
    { id: "permis_conduire", label: "Permis de conduire" },
    { id: "contrat_signe", label: "Contrat signé" },
  ];

  const markSetupStepDone = (stepId: string) => {
    const updated = setupCompleted.includes(stepId) ? setupCompleted : [...setupCompleted, stepId];
    setSetupCompleted(updated);
    updateCompanySettings({ setup_steps_done: JSON.stringify(updated) }).catch(() => {});
  };

  const finishSetupWizard = () => {
    updateCompanySettings({ setup_completed: "true" }).catch(() => {});
    setShowSetupWizard(false);
    addToast_admin("Configuration terminée ! Bienvenue sur Illizeo.");
  };

  const renderSetupWizard = () => {
    const currentStep = SETUP_STEPS[setupStep];
    const totalRequired = SETUP_STEPS.filter(s => s.required).length;
    const completedRequired = SETUP_STEPS.filter(s => s.required && setupCompleted.includes(s.id)).length;
    const progress = Math.round((setupCompleted.length / SETUP_STEPS.length) * 100);

    return (
      <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: C.white, fontFamily: font, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Header */}
        <div style={{ padding: "16px 32px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", background: C.white, flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <img src={getLogoFullUri()} alt="Illizeo" style={{ height: 28, objectFit: "contain" }} />
            <div style={{ width: 1, height: 24, background: C.border }} />
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: C.text }}>Configuration de votre espace</div>
              <div style={{ fontSize: 11, color: C.textMuted }}>{completedRequired}/{totalRequired} étapes obligatoires complétées</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 180, height: 6, borderRadius: 3, background: C.bg, overflow: "hidden" }}>
              <div style={{ width: `${progress}%`, height: "100%", background: C.pink, borderRadius: 3, transition: "width .3s ease" }} />
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, color: C.pink }}>{progress}%</span>
            <button onClick={() => {
              if (completedRequired >= totalRequired) { finishSetupWizard(); return; }
              setShowSetupWizard(false);
            }} className="iz-btn-outline" style={{ ...sBtn("outline"), fontSize: 11, padding: "6px 14px" }}>
              {completedRequired >= totalRequired ? "Terminer" : "Continuer plus tard"}
            </button>
          </div>
        </div>

        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
          {/* Sidebar steps */}
          <div style={{ width: 260, borderRight: `1px solid ${C.border}`, padding: "20px 0", overflow: "auto", background: C.bg, flexShrink: 0 }}>
            {SETUP_STEPS.map((step, i) => {
              const done = setupCompleted.includes(step.id);
              const active = i === setupStep;
              const StepIcon = step.icon;
              return (
                <button key={step.id} onClick={() => setSetupStep(i)} style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "12px 20px", width: "100%", border: "none", cursor: "pointer",
                  background: active ? C.white : "transparent", fontFamily: font, textAlign: "left", transition: "all .15s",
                  borderLeft: active ? `3px solid ${C.pink}` : "3px solid transparent",
                }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: done ? C.green : active ? C.pinkBg : C.white, border: done ? "none" : `1.5px solid ${active ? C.pink : C.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all .15s" }}>
                    {done ? <Check size={14} color={C.white} /> : <StepIcon size={14} color={active ? C.pink : C.textMuted} />}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: active ? 600 : 500, color: done ? C.green : active ? C.text : C.textLight }}>
                      {step.title}
                      {step.required && !done && <span style={{ color: C.red, marginLeft: 4, fontSize: 10 }}>*</span>}
                    </div>
                    <div style={{ fontSize: 10, color: C.textMuted }}>{done ? "Complété" : step.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Content area */}
          <div style={{ flex: 1, padding: "32px 48px", overflow: "auto" }}>
            {/* ─── Step 1: Company ─── */}
            {currentStep.id === "company" && (
              <div className="iz-fade-up">
                <h2 style={{ fontSize: 22, fontWeight: 700, color: C.text, margin: "0 0 4px" }}>Parlez-nous de votre entreprise</h2>
                <p style={{ fontSize: 13, color: C.textMuted, margin: "0 0 28px" }}>Ces informations nous aident à personnaliser votre expérience.</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, maxWidth: 600 }}>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Nom de l'entreprise *</label>
                    <input value={setupData.company_name} onChange={e => setSetupData(d => ({ ...d, company_name: e.target.value }))} placeholder="Ex: Acme SA" style={{ ...sInput, fontSize: 14, padding: "12px 16px" }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Secteur d'activité</label>
                    <select value={setupData.sector} onChange={e => setSetupData(d => ({ ...d, sector: e.target.value }))} style={{ ...sInput, fontSize: 13, padding: "12px 16px", cursor: "pointer" }}>
                      <option value="">— Sélectionner —</option>
                      {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Taille de l'entreprise</label>
                    <select value={setupData.company_size} onChange={e => setSetupData(d => ({ ...d, company_size: e.target.value }))} style={{ ...sInput, fontSize: 13, padding: "12px 16px", cursor: "pointer" }}>
                      <option value="">— Sélectionner —</option>
                      {COMPANY_SIZES.map(s => <option key={s} value={s}>{s} employés</option>)}
                    </select>
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Site principal</label>
                    <input value={setupData.site_principal} onChange={e => setSetupData(d => ({ ...d, site_principal: e.target.value }))} placeholder="Ex: Genève, Siège social" style={{ ...sInput, fontSize: 13, padding: "12px 16px" }} />
                  </div>
                </div>
              </div>
            )}

            {/* ─── Step 2: Appearance ─── */}
            {currentStep.id === "appearance" && (
              <div className="iz-fade-up">
                <h2 style={{ fontSize: 22, fontWeight: 700, color: C.text, margin: "0 0 4px" }}>Personnalisez votre espace</h2>
                <p style={{ fontSize: 13, color: C.textMuted, margin: "0 0 28px" }}>Ajoutez le logo de votre entreprise et choisissez une couleur de thème. Vous pourrez modifier ces paramètres plus tard dans Apparence.</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, maxWidth: 600 }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 8 }}>Logo de l'entreprise</label>
                    <div style={{ width: 120, height: 120, borderRadius: 16, border: `2px dashed ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", background: C.bg, cursor: "pointer", position: "relative" }}>
                      <img src={customLogoFull || ILLIZEO_FULL_LOGO_URI} alt="Logo" style={{ maxHeight: 60, maxWidth: 100, objectFit: "contain" }} />
                      <label style={{ position: "absolute", inset: 0, cursor: "pointer", display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 6 }}>
                        <input type="file" accept="image/*" style={{ display: "none" }} onChange={e => {
                          const file = e.target.files?.[0]; if (!file) return;
                          const reader = new FileReader();
                          reader.onload = () => { const url = reader.result as string; saveSetting("custom_logo_full", url, setCustomLogoFull); };
                          reader.readAsDataURL(file);
                        }} />
                        <span style={{ fontSize: 10, color: C.pink, fontWeight: 600, background: "rgba(255,255,255,.9)", padding: "2px 8px", borderRadius: 4 }}>Changer</span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 8 }}>Couleur du thème</label>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {["#C2185B","#1A73E8","#2E7D32","#7B5EA7","#E65100","#37474F","#C62828","#00897B"].map(color => (
                        <button key={color} onClick={() => { saveSetting("theme_color", color, setThemeColor); }} style={{ width: 40, height: 40, borderRadius: "50%", background: color, border: themeColor === color ? `3px solid ${C.text}` : "3px solid transparent", cursor: "pointer", transition: "all .15s" }} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ─── Step 3: Team ─── */}
            {currentStep.id === "team" && (
              <div className="iz-fade-up">
                <h2 style={{ fontSize: 22, fontWeight: 700, color: C.text, margin: "0 0 4px" }}>Invitez votre équipe</h2>
                <p style={{ fontSize: 13, color: C.textMuted, margin: "0 0 28px" }}>Ajoutez les personnes qui vous aideront à gérer l'onboarding. Ils recevront un email d'invitation.</p>
                <div style={{ maxWidth: 550, display: "flex", flexDirection: "column", gap: 12 }}>
                  {setupData.invited_emails.map((email: string, i: number) => (
                    <div key={i} style={{ display: "flex", gap: 10, alignItems: "center" }}>
                      <input value={email} onChange={e => { const arr = [...setupData.invited_emails]; arr[i] = e.target.value; setSetupData(d => ({ ...d, invited_emails: arr })); }} placeholder={`email${i+1}@entreprise.com`} style={{ ...sInput, flex: 2, fontSize: 13, padding: "10px 14px" }} />
                      <select value={setupData.invited_roles[i]} onChange={e => { const arr = [...setupData.invited_roles]; arr[i] = e.target.value; setSetupData(d => ({ ...d, invited_roles: arr })); }} style={{ ...sInput, flex: 1, fontSize: 12, padding: "10px 14px", cursor: "pointer" }}>
                        <option value="admin_rh">Admin RH</option>
                        <option value="manager">Manager</option>
                        <option value="onboardee">Collaborateur</option>
                      </select>
                      {i === setupData.invited_emails.length - 1 && (
                        <button onClick={() => setSetupData(d => ({ ...d, invited_emails: [...d.invited_emails, ""], invited_roles: [...d.invited_roles, "onboardee"] }))} style={{ background: "none", border: "none", cursor: "pointer", color: C.pink, padding: 4 }}><Plus size={18} /></button>
                      )}
                    </div>
                  ))}
                  <button onClick={async () => {
                    const validEmails = setupData.invited_emails.filter((e: string) => e.trim() && e.includes("@"));
                    if (validEmails.length === 0) { addToast_admin("Ajoutez au moins un email valide"); return; }
                    let sent = 0;
                    for (let i = 0; i < setupData.invited_emails.length; i++) {
                      const email = setupData.invited_emails[i].trim();
                      if (!email || !email.includes("@")) continue;
                      try { await apiCreateUser({ email, name: email.split("@")[0], password: "Welcome1!", role: setupData.invited_roles[i] }); sent++; } catch {}
                    }
                    if (sent > 0) { addToast_admin(`${sent} invitation(s) envoyée(s)`); markSetupStepDone("team"); }
                  }} className="iz-btn-pink" style={{ ...sBtn("pink"), alignSelf: "flex-start", display: "flex", alignItems: "center", gap: 6 }}><Send size={14} /> Envoyer les invitations</button>
                </div>
              </div>
            )}

            {/* ─── Step 4: Parcours ─── */}
            {currentStep.id === "parcours" && (
              <div className="iz-fade-up">
                <h2 style={{ fontSize: 22, fontWeight: 700, color: C.text, margin: "0 0 4px" }}>Votre parcours d'intégration</h2>
                <p style={{ fontSize: 13, color: C.textMuted, margin: "0 0 28px" }}>Un parcours "Onboarding Standard" a été créé par défaut avec 4 phases. Vous pouvez le personnaliser maintenant ou plus tard.</p>
                {PARCOURS_TEMPLATES.filter(p => p.status === "actif").length > 0 ? (
                  <div style={{ maxWidth: 600 }}>
                    {PARCOURS_TEMPLATES.filter(p => p.status === "actif").slice(0, 3).map(p => (
                      <div key={p.id} className="iz-card" style={{ ...sCard, padding: "16px 20px", marginBottom: 12, display: "flex", alignItems: "center", gap: 16 }}>
                        <div style={{ width: 44, height: 44, borderRadius: 12, background: C.pinkBg, display: "flex", alignItems: "center", justifyContent: "center" }}><Route size={20} color={C.pink} /></div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 15, fontWeight: 600, color: C.text }}>{p.nom}</div>
                          <div style={{ fontSize: 12, color: C.textMuted }}>{p.phases.length} phases · {p.actionsCount} actions · {p.docsCount} documents</div>
                        </div>
                        <span style={{ padding: "3px 10px", borderRadius: 6, fontSize: 10, fontWeight: 600, background: C.greenLight, color: C.green }}>Actif</span>
                      </div>
                    ))}
                    <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                      <button onClick={() => { markSetupStepDone("parcours"); setSetupStep(s => s + 1); }} className="iz-btn-pink" style={{ ...sBtn("pink"), display: "flex", alignItems: "center", gap: 6 }}><Check size={14} /> Les parcours par défaut me conviennent</button>
                      <button onClick={() => { setShowSetupWizard(false); setAdminPage("admin_parcours"); }} className="iz-btn-outline" style={{ ...sBtn("outline"), display: "flex", alignItems: "center", gap: 6 }}><FilePen size={14} /> Personnaliser</button>
                    </div>
                  </div>
                ) : (
                  <div style={{ padding: "40px 20px", textAlign: "center", color: C.textMuted }}>
                    <Route size={40} color={C.border} style={{ marginBottom: 12 }} />
                    <div style={{ fontSize: 14, marginBottom: 12 }}>Aucun parcours trouvé.</div>
                    <button onClick={() => { setShowSetupWizard(false); setAdminPage("admin_parcours"); }} className="iz-btn-pink" style={{ ...sBtn("pink") }}>Créer un parcours</button>
                  </div>
                )}
              </div>
            )}

            {/* ─── Step 5: Documents ─── */}
            {currentStep.id === "documents" && (
              <div className="iz-fade-up">
                <h2 style={{ fontSize: 22, fontWeight: 700, color: C.text, margin: "0 0 4px" }}>Documents à demander</h2>
                <p style={{ fontSize: 13, color: C.textMuted, margin: "0 0 28px" }}>Cochez les pièces que vous souhaitez demander à chaque nouvelle recrue lors de son onboarding.</p>
                <div style={{ maxWidth: 500, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {SETUP_DOCS.map(doc => {
                    const checked = (setupData.docs_checked as string[]).includes(doc.id);
                    return (
                      <label key={doc.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 8, border: `1px solid ${checked ? C.pink : C.border}`, background: checked ? C.pinkBg : C.white, cursor: "pointer", transition: "all .15s" }}>
                        <input type="checkbox" checked={checked} onChange={() => {
                          setSetupData(d => ({ ...d, docs_checked: checked ? d.docs_checked.filter((id: string) => id !== doc.id) : [...d.docs_checked, doc.id] }));
                        }} style={{ accentColor: C.pink }} />
                        <span style={{ fontSize: 13, color: C.text, fontWeight: checked ? 500 : 400 }}>{doc.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ─── Step 6: Email ─── */}
            {currentStep.id === "email" && (
              <div className="iz-fade-up">
                <h2 style={{ fontSize: 22, fontWeight: 700, color: C.text, margin: "0 0 4px" }}>Email de bienvenue</h2>
                <p style={{ fontSize: 13, color: C.textMuted, margin: "0 0 28px" }}>Cet email sera envoyé automatiquement à chaque nouveau collaborateur. Vous pourrez le personnaliser en détail dans "Templates email".</p>
                <div className="iz-card" style={{ ...sCard, padding: "24px", maxWidth: 550 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: C.pinkBg, display: "flex", alignItems: "center", justifyContent: "center" }}><Mail size={18} color={C.pink} /></div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>Bienvenue chez {"{{entreprise}}"}</div>
                      <div style={{ fontSize: 11, color: C.textMuted }}>Envoyé à la création du collaborateur</div>
                    </div>
                  </div>
                  <div style={{ padding: "16px", background: C.bg, borderRadius: 10, fontSize: 13, color: C.textLight, lineHeight: 1.7 }}>
                    Bonjour <strong>{"{{prenom}}"}</strong>,<br /><br />
                    Bienvenue dans l'équipe ! Nous sommes ravis de vous accueillir.<br /><br />
                    Votre parcours d'intégration commence le <strong>{"{{date_debut}}"}</strong>. Vous trouverez sur votre espace toutes les informations et documents nécessaires.<br /><br />
                    <span style={{ display: "inline-block", padding: "8px 20px", background: C.pink, color: C.white, borderRadius: 6, fontSize: 12, fontWeight: 600 }}>Accéder à mon espace</span>
                  </div>
                  <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                    <button onClick={() => { markSetupStepDone("email"); setSetupStep(s => s + 1); }} className="iz-btn-pink" style={{ ...sBtn("pink"), display: "flex", alignItems: "center", gap: 6 }}><Check size={14} /> Ce modèle me convient</button>
                    <button onClick={() => { setShowSetupWizard(false); setAdminPage("admin_templates"); }} className="iz-btn-outline" style={{ ...sBtn("outline"), display: "flex", alignItems: "center", gap: 6 }}><FilePen size={14} /> Personnaliser</button>
                  </div>
                </div>
              </div>
            )}

            {/* ─── Step 7: First collaborateur ─── */}
            {currentStep.id === "first_collab" && (
              <div className="iz-fade-up">
                <h2 style={{ fontSize: 22, fontWeight: 700, color: C.text, margin: "0 0 4px" }}>Ajoutez votre premier collaborateur</h2>
                <p style={{ fontSize: 13, color: C.textMuted, margin: "0 0 28px" }}>Créez le profil de la première personne qui va vivre l'onboarding. Vous pourrez en ajouter d'autres ensuite.</p>
                <div style={{ maxWidth: 500, display: "flex", flexDirection: "column", gap: 14 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div><label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Prénom *</label>
                      <input value={setupData.first_prenom || ""} onChange={e => setSetupData(d => ({ ...d, first_prenom: e.target.value }))} placeholder="Marie" style={{ ...sInput, fontSize: 13, padding: "10px 14px" }} /></div>
                    <div><label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Nom *</label>
                      <input value={setupData.first_nom || ""} onChange={e => setSetupData(d => ({ ...d, first_nom: e.target.value }))} placeholder="Dupont" style={{ ...sInput, fontSize: 13, padding: "10px 14px" }} /></div>
                  </div>
                  <div><label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Email *</label>
                    <input type="email" value={setupData.first_email || ""} onChange={e => setSetupData(d => ({ ...d, first_email: e.target.value }))} placeholder="marie.dupont@entreprise.com" style={{ ...sInput, fontSize: 13, padding: "10px 14px" }} /></div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div><label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Poste</label>
                      <input value={setupData.first_poste || ""} onChange={e => setSetupData(d => ({ ...d, first_poste: e.target.value }))} placeholder="Développeur" style={{ ...sInput, fontSize: 13, padding: "10px 14px" }} /></div>
                    <div><label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Date de début</label>
                      <input type="date" value={setupData.first_date || ""} onChange={e => setSetupData(d => ({ ...d, first_date: e.target.value }))} style={{ ...sInput, fontSize: 13, padding: "10px 14px" }} /></div>
                  </div>
                  <button onClick={async () => {
                    if (!setupData.first_prenom?.trim() || !setupData.first_nom?.trim() || !setupData.first_email?.trim()) { addToast_admin("Prénom, nom et email sont requis"); return; }
                    try {
                      await apiCreateCollab({ prenom: setupData.first_prenom, nom: setupData.first_nom, email: setupData.first_email, poste: setupData.first_poste || "", site: setupData.site_principal || "", departement: "", dateDebut: setupData.first_date || new Date().toISOString().slice(0, 10) } as any);
                      refetchCollaborateurs();
                      addToast_admin(`${setupData.first_prenom} ajouté(e) avec succès !`);
                      markSetupStepDone("first_collab");
                    } catch { addToast_admin("Erreur lors de la création"); }
                  }} className="iz-btn-pink" style={{ ...sBtn("pink"), alignSelf: "flex-start", display: "flex", alignItems: "center", gap: 6 }}><UserPlus size={14} /> Ajouter ce collaborateur</button>
                </div>

                {/* Completion card */}
                <div style={{ marginTop: 40, padding: "28px 32px", borderRadius: 16, background: `linear-gradient(135deg, ${C.pinkBg} 0%, ${C.amberLight} 100%)`, border: `1px solid ${C.pink}20`, maxWidth: 500 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                    <PartyPopper size={28} color={C.pink} />
                    <div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: C.text }}>Presque terminé !</div>
                      <div style={{ fontSize: 12, color: C.textMuted }}>{setupCompleted.length}/{SETUP_STEPS.length} étapes complétées</div>
                    </div>
                  </div>
                  <p style={{ fontSize: 13, color: C.textLight, lineHeight: 1.6, margin: "0 0 16px" }}>
                    Vous pouvez finaliser la configuration maintenant ou y revenir plus tard. Toutes les fonctionnalités sont accessibles depuis le menu de gauche.
                  </p>
                  <button onClick={finishSetupWizard} className="iz-btn-pink" style={{ ...sBtn("pink"), padding: "12px 28px", fontSize: 14, display: "flex", alignItems: "center", gap: 8 }}>
                    <Sparkles size={16} /> Accéder à mon espace Illizeo
                  </button>
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            {currentStep.id !== "first_collab" && (
              <div style={{ display: "flex", gap: 10, marginTop: 32 }}>
                {setupStep > 0 && <button onClick={() => setSetupStep(s => s - 1)} className="iz-btn-outline" style={sBtn("outline")}>{t('misc.return')}</button>}
                {!currentStep.required && !setupCompleted.includes(currentStep.id) && (
                  <button onClick={() => { setSetupStep(s => s + 1); }} className="iz-btn-outline" style={{ ...sBtn("outline"), color: C.textMuted }}>Passer cette étape</button>
                )}
                <button onClick={() => {
                  // Save step data and mark as done
                  if (currentStep.id === "company" && setupData.company_name.trim()) {
                    updateCompanySettings({ company_name: setupData.company_name, sector: setupData.sector, company_size: setupData.company_size, site_principal: setupData.site_principal }).catch(() => {});
                    markSetupStepDone("company");
                  } else if (currentStep.id === "appearance") { markSetupStepDone("appearance"); }
                  else if (currentStep.id === "documents") { markSetupStepDone("documents"); }
                  if (setupStep < SETUP_STEPS.length - 1) setSetupStep(s => s + 1);
                }} className="iz-btn-pink" style={{ ...sBtn("pink"), display: "flex", alignItems: "center", gap: 6 }}>
                  Continuer <ChevronRight size={14} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (role === "rh") {
    return (
      <div style={{ display: "flex", minHeight: "100vh", fontFamily: font, background: C.white, color: C.text }}>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;1,9..40,400&display=swap" rel="stylesheet" /><style dangerouslySetInnerHTML={{ __html: ANIM_STYLES }} />
        {/* Setup Wizard overlay */}
        {showSetupWizard && renderSetupWizard()}
        {renderSidebar_admin()}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
        {/* Top bar with notification bell */}
        <div style={{ height: 48, minHeight: 48, background: C.white, borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", zIndex: 40, flexShrink: 0 }}>
          {/* Search bar */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: C.bg, borderRadius: 8, padding: "6px 12px", width: 320 }}>
            <Search size={14} color={C.textMuted} />
            <input value={adminSearchQuery} onChange={e => setAdminSearchQuery(e.target.value)} placeholder={t('label.search')} style={{ border: "none", outline: "none", background: "transparent", flex: 1, fontSize: 12, fontFamily: font, color: C.text }} />
            {adminSearchQuery && (
              <div style={{ position: "absolute", top: 44, left: 20, width: 320, background: C.white, borderRadius: 10, boxShadow: "0 8px 30px rgba(0,0,0,.12)", border: `1px solid ${C.border}`, maxHeight: 300, overflow: "auto", zIndex: 100 }}>
                {COLLABORATEURS.filter(c => `${c.prenom} ${c.nom} ${c.email || ""} ${c.poste}`.toLowerCase().includes(adminSearchQuery.toLowerCase())).slice(0, 5).map(c => (
                  <div key={c.id} onClick={() => { setAdminPage("admin_suivi"); setCollabProfileId(c.id); setAdminSearchQuery(""); }} className="iz-sidebar-item" style={{ padding: "10px 14px", display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: c.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 600, color: C.white }}>{c.initials}</div>
                    <div><div style={{ fontSize: 12, fontWeight: 500 }}>{c.prenom} {c.nom}</div><div style={{ fontSize: 10, color: C.textMuted }}>{c.poste} · {c.site}</div></div>
                  </div>
                ))}
                {[
                  { label: "Dashboard", page: "admin_dashboard" as AdminPage },
                  { label: t('admin.parcours_actions'), page: "admin_parcours" as AdminPage },
                  { label: t('admin.collaborateur_tracking'), page: "admin_suivi" as AdminPage },
                  { label: t('admin.documents'), page: "admin_documents" as AdminPage },
                  { label: t('admin.messaging'), page: "admin_messagerie" as AdminPage },
                  { label: t('admin.workflows'), page: "admin_workflows" as AdminPage },
                  { label: t('admin.email_templates'), page: "admin_templates" as AdminPage },
                  { label: t('admin.nps'), page: "admin_nps" as AdminPage },
                  { label: t('admin.cooptation'), page: "admin_cooptation" as AdminPage },
                  { label: t('admin.integrations'), page: "admin_integrations" as AdminPage },
                  { label: t('admin.users_roles'), page: "admin_users" as AdminPage },
                  { label: t('admin.appearance'), page: "admin_apparence" as AdminPage },
                  { label: t('admin.subscription'), page: "admin_abonnement" as AdminPage },
                ].filter(f => f.label.toLowerCase().includes(adminSearchQuery.toLowerCase())).slice(0, 3).map(f => (
                  <div key={f.page} onClick={() => { setAdminPage(f.page); setAdminSearchQuery(""); }} className="iz-sidebar-item" style={{ padding: "10px 14px", display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                    <Navigation size={14} color={C.textMuted} />
                    <span style={{ fontSize: 12 }}>{f.label}</span>
                  </div>
                ))}
                {adminSearchQuery && COLLABORATEURS.filter(c => `${c.prenom} ${c.nom}`.toLowerCase().includes(adminSearchQuery.toLowerCase())).length === 0 && <div style={{ padding: "12px 14px", fontSize: 12, color: C.textMuted }}>{t('misc.no_result')}</div>}
              </div>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* Dark mode toggle */}
            <button onClick={toggleDarkMode} title={darkMode ? "Mode clair" : "Mode sombre"} style={{ background: "none", border: "none", cursor: "pointer", padding: 6, borderRadius: 8, transition: "all .15s" }}>
              {darkMode ? <Sun size={18} color={C.amber} /> : <Moon size={18} color={C.textMuted} />}
            </button>
            {/* Notification bell */}
            <div data-notif-dropdown style={{ position: "relative" }}>
              <button onClick={() => setShowNotifDropdown(!showNotifDropdown)} style={{ background: "none", border: "none", cursor: "pointer", position: "relative", padding: 6 }}>
                <Bell size={20} color={C.textMuted} />
                {notifUnread > 0 && <div style={{ position: "absolute", top: 2, right: 2, width: 16, height: 16, borderRadius: "50%", background: C.red, color: C.white, fontSize: 9, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{notifUnread > 9 ? "9+" : notifUnread}</div>}
              </button>
              {showNotifDropdown && (
                <div style={{ position: "absolute", right: 0, top: "100%", marginTop: 8, width: 380, maxHeight: 480, background: C.white, borderRadius: 12, boxShadow: "0 8px 30px rgba(0,0,0,.15)", border: `1px solid ${C.border}`, zIndex: 100, overflow: "hidden" }}>
                  <div style={{ padding: "14px 16px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 15, fontWeight: 600 }}>Notifications</span>
                    <div style={{ display: "flex", gap: 8 }}>
                      {notifUnread > 0 && <button onClick={async () => { await markAllNotifsRead(); getUserNotifications().then(setUserNotifs); setNotifUnread(0); }} style={{ background: "none", border: "none", color: C.pink, fontSize: 11, cursor: "pointer", fontFamily: font }}>Tout marquer comme lu</button>}
                      <button onClick={() => { setShowNotifDropdown(false); setAdminPage("admin_notifications" as any); }} style={{ background: "none", border: "none", color: C.textMuted, fontSize: 11, cursor: "pointer", fontFamily: font }}>Voir tout</button>
                    </div>
                  </div>
                  <div style={{ maxHeight: 400, overflow: "auto" }}>
                    {userNotifs.length === 0 && <div style={{ padding: "30px 16px", textAlign: "center", color: C.textMuted, fontSize: 13 }}>Aucune notification</div>}
                    {userNotifs.slice(0, 15).map((n: any) => (
                      <div key={n.id} onClick={async () => {
                        if (!n.read_at) { await markNotifRead(n.id); getUserNotifications().then(setUserNotifs); setNotifUnread(Math.max(0, notifUnread - 1)); }
                        setShowNotifDropdown(false);
                        // Navigate to relevant page based on notification type/content
                        const t = ((n.type || "") + " " + (n.titre || n.title || "") + " " + (n.contenu || n.message || "")).toLowerCase();
                        if (t.includes("document") || t.includes("pièce")) setAdminPage("admin_documents");
                        else if (t.includes("parcours") || t.includes("action") || t.includes("tâche")) setAdminPage("admin_parcours");
                        else if (t.includes("message") || t.includes("messagerie")) setAdminPage("admin_messagerie");
                        else if (t.includes("collaborateur") || t.includes("arrivée") || t.includes("recrue")) setAdminPage("admin_suivi");
                        else if (t.includes("workflow")) setAdminPage("admin_workflows");
                        else if (t.includes("signature") || t.includes("contrat")) setAdminPage("admin_contrats");
                        else if (t.includes("cooptation") || t.includes("recommand")) setAdminPage("admin_cooptation");
                        else if (t.includes("nps") || t.includes("satisfaction") || t.includes("questionnaire")) setAdminPage("admin_nps");
                        else if (t.includes("badge") || t.includes("gamification")) setAdminPage("admin_gamification");
                        else if (t.includes("abonnement") || t.includes("plan") || t.includes("facture")) setAdminPage("admin_abonnement" as any);
                      }}
                        style={{ padding: "12px 16px", borderBottom: `1px solid ${C.border}`, cursor: "pointer", background: n.read_at ? "transparent" : C.pinkBg + "30", transition: "background .15s" }}
                        className="iz-sidebar-item">
                        <div style={{ display: "flex", alignItems: "start", gap: 10 }}>
                          <div style={{ width: 8, height: 8, borderRadius: "50%", background: n.read_at ? "transparent" : C.pink, flexShrink: 0, marginTop: 5 }} />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 13, fontWeight: n.read_at ? 400 : 600, color: C.text }}>{n.titre || n.title}</div>
                            <div style={{ fontSize: 11, color: C.textLight, marginTop: 2 }}>{n.contenu || n.message || ""}</div>
                            <div style={{ fontSize: 10, color: C.textMuted, marginTop: 4 }}>{fmtDateTimeShort(n.created_at)}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {/* User avatar */}
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: `linear-gradient(135deg, ${C.pinkSoft}, ${C.pink})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, color: C.white }}>
              {auth.user?.name?.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() || "?"}
            </div>
          </div>
        </div>
        {/* Trial/subscription banner */}
        {!isEditorTenant && !hasActiveSub && (() => {
          const trialDaysLeft = trialStart ? Math.max(0, 14 - Math.floor((new Date().getTime() - new Date(trialStart).getTime()) / (24 * 60 * 60 * 1000))) : 0;
          return isInTrial ? (
            <div style={{ padding: "10px 24px", background: `linear-gradient(90deg, ${C.blue}, #4A90D9)`, color: C.white, display: "flex", alignItems: "center", justifyContent: "center", gap: 16, fontSize: 13, fontWeight: 500, flexShrink: 0 }}>
              <Sparkles size={16} />
              <span>Période d'essai — <b>{trialDaysLeft} jour{trialDaysLeft > 1 ? "s" : ""} restant{trialDaysLeft > 1 ? "s" : ""}</b>. Toutes les fonctionnalités sont accessibles.</span>
              <button onClick={() => { setAdminPage("admin_abonnement" as any); setSubView("change"); }} style={{ padding: "4px 16px", borderRadius: 6, background: C.white, color: C.blue, border: "none", cursor: "pointer", fontFamily: font, fontSize: 12, fontWeight: 600 }}>Souscrire maintenant</button>
            </div>
          ) : trialExpired ? (
            <div style={{ padding: "10px 24px", background: C.red, color: C.white, display: "flex", alignItems: "center", justifyContent: "center", gap: 16, fontSize: 13, fontWeight: 500, flexShrink: 0 }}>
              <AlertTriangle size={16} />
              <span>Votre période d'essai est terminée. Souscrivez un plan pour continuer à utiliser Illizeo.</span>
              <button onClick={() => { setAdminPage("admin_abonnement" as any); setSubView("change"); }} style={{ padding: "4px 16px", borderRadius: 6, background: C.white, color: C.red, border: "none", cursor: "pointer", fontFamily: font, fontSize: 12, fontWeight: 600 }}>Souscrire</button>
            </div>
          ) : null;
        })()}
        <div style={{ flex: 1, overflow: "auto" }}>
        {adminPage === "admin_dashboard" && renderDashboard_admin()}
        {adminPage === "admin_suivi" && renderSuivi()}
        {adminPage === "admin_suivi" && collabProfileId && renderCollabProfile()}
        {adminPage === "admin_parcours" && renderParcours()}
        {adminPage === "admin_documents" && renderDocuments()}
        {adminPage === "admin_equipes" && renderEquipes()}
        {adminPage === "admin_workflows" && renderWorkflows()}
        {adminPage === "admin_templates" && renderTemplates()}
        {adminPage === "admin_messagerie" && renderMessagerie_admin()}
        {adminPage === "admin_notifications" && renderNotifications_admin()}
        {adminPage === "admin_entreprise" && renderEntreprise_admin()}
        {adminPage === "admin_nps" && renderNPS()}
        {adminPage === "admin_contrats" && renderContrats()}
        {adminPage === "admin_integrations" && renderIntegrations()}
        {adminPage === "admin_cooptation" && renderCooptation()}
        {adminPage === "admin_gamification" && (() => {
          const reloadGamif = () => { getBadges().then(setBadges).catch(() => {}); getBadgeTemplates().then(setBadgeTemplates).catch(() => {}); };
          const BADGE_ICON_MAP: Record<string, any> = {
            "trophy": Trophy, "file-check": FileCheck2, "message-circle": MessageCircle, "calendar-check": CalendarCheck,
            "star": Star, "handshake": Handshake, "smile": Smile, "party-popper": PartyPopper,
            "award": Award, "heart": Heart, "rocket": Rocket, "gem": Gem, "crown": Crown, "target": Target, "zap": Zap, "gift": Gift,
          };
          const getBadgeIcon = (iconName: string) => BADGE_ICON_MAP[iconName] || Trophy;
          const BADGE_CRITERE_META: Record<string, { label: string; description: string }> = {
            "manual": { label: "Manuel", description: "Attribué manuellement par un administrateur ou via un workflow" },
            "parcours_complete": { label: "Parcours terminé", description: "Attribué automatiquement quand le collaborateur termine son parcours d'intégration" },
            "docs_complete": { label: "Documents complets", description: "Attribué quand tous les documents administratifs sont validés" },
            "premier_message": { label: "Premier message", description: "Attribué quand le collaborateur envoie son premier message" },
            "first_week": { label: "Première semaine", description: "Attribué après 7 jours dans l'entreprise" },
            "first_month": { label: "Premier mois", description: "Attribué après 30 jours dans l'entreprise" },
            "cooptation": { label: "Cooptation validée", description: "Attribué quand une cooptation du parrain est validée" },
            "nps_complete": { label: "NPS complété", description: "Attribué quand le collaborateur répond à une enquête de satisfaction" },
          };
          const BADGE_COLORS = ["#F9A825", "#C2185B", "#4CAF50", "#1A73E8", "#7B5EA7", "#E91E8C", "#00897B", "#FF6B35", "#E53935", "#FF9800"];
          const BADGE_ICONS = Object.keys(BADGE_ICON_MAP);
          return (
          <div style={{ flex: 1, padding: "24px 32px", overflow: "auto" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <div>
                <h1 style={{ fontSize: 22, fontWeight: 600, margin: 0 }}>{t('admin.gamification')} & Badges</h1>
                <p style={{ fontSize: 12, color: C.textLight, margin: "4px 0 0" }}>Motivez vos collaborateurs avec un système de récompenses visuelles. Les badges s'affichent dans le tableau de bord de chaque collaborateur.</p>
              </div>
              <button onClick={() => { resetTr(); setBadgeTplPanel({ mode: "create", data: { nom: "", description: "", icon: "trophy", color: "#F9A825", critere: "manual", actif: true } }); }} className="iz-btn-pink" style={{ ...sBtn("pink"), display: "flex", alignItems: "center", gap: 6 }}><Plus size={14} /> Nouveau badge</button>
            </div>

            {/* How it works */}
            <div className="iz-card" style={{ ...sCard, padding: "16px 20px", marginBottom: 20, background: `linear-gradient(135deg, ${C.pinkBg} 0%, ${C.amberLight} 100%)`, border: `1px solid ${C.pink}20` }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}><Sparkles size={14} color={C.pink} /> Comment ça marche ?</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, fontSize: 12, color: C.textLight, lineHeight: 1.6 }}>
                <div><span style={{ fontWeight: 600, color: C.text }}>1. Créez des modèles</span> — Définissez les badges avec un nom, une icône, une couleur et un critère d'attribution (manuel ou automatique).</div>
                <div><span style={{ fontWeight: 600, color: C.text }}>2. Attribution</span> — Les badges sont attribués manuellement ci-dessous, ou automatiquement via les <strong>Workflows</strong> (action "Attribuer un badge") et les critères automatiques.</div>
                <div><span style={{ fontWeight: 600, color: C.text }}>3. Visibilité</span> — Les collaborateurs voient leurs badges dans leur tableau de bord. Cela renforce l'engagement et valorise les étapes franchies.</div>
              </div>
            </div>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
              <div className="iz-card" style={{ ...sCard, textAlign: "center", padding: "16px" }}>
                <Trophy size={24} color={C.amber} style={{ marginBottom: 6 }} />
                <div style={{ fontSize: 24, fontWeight: 700, color: C.amber }}>{badges.length}</div>
                <div style={{ fontSize: 11, color: C.textMuted }}>Badges attribués</div>
              </div>
              <div className="iz-card" style={{ ...sCard, textAlign: "center", padding: "16px" }}>
                <Users size={24} color={C.blue} style={{ marginBottom: 6 }} />
                <div style={{ fontSize: 24, fontWeight: 700, color: C.blue }}>{new Set(badges.map(b => b.user_id)).size}</div>
                <div style={{ fontSize: 11, color: C.textMuted }}>Collaborateurs récompensés</div>
              </div>
              <div className="iz-card" style={{ ...sCard, textAlign: "center", padding: "16px" }}>
                <Award size={24} color={C.green} style={{ marginBottom: 6 }} />
                <div style={{ fontSize: 24, fontWeight: 700, color: C.green }}>{badgeTemplates.filter(bt => bt.actif).length}</div>
                <div style={{ fontSize: 11, color: C.textMuted }}>Modèles actifs</div>
              </div>
              <div className="iz-card" style={{ ...sCard, textAlign: "center", padding: "16px" }}>
                <Zap size={24} color="#7B5EA7" style={{ marginBottom: 6 }} />
                <div style={{ fontSize: 24, fontWeight: 700, color: "#7B5EA7" }}>{badgeTemplates.filter(bt => bt.critere !== "manual").length}</div>
                <div style={{ fontSize: 11, color: C.textMuted }}>Attributions auto</div>
              </div>
            </div>

            {/* Badge templates */}
            <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Modèles de badges</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
              {badgeTemplates.map(bt => {
                const IconComp = getBadgeIcon(bt.icon);
                const critMeta = BADGE_CRITERE_META[bt.critere || "manual"] || BADGE_CRITERE_META.manual;
                return (
                <div key={bt.id} className="iz-card iz-sidebar-item" style={{ ...sCard, textAlign: "center", padding: "20px 16px", opacity: bt.actif ? 1 : 0.45, cursor: "pointer", transition: "all .15s" }}
                  onClick={() => { setContentTranslations((bt as any).translations || {}); setBadgeTplPanel({ mode: "edit", data: { ...bt } }); }}>
                  <div style={{ width: 52, height: 52, borderRadius: "50%", background: bt.color + "20", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px", border: `2px solid ${bt.color}40` }}>
                    <IconComp size={24} color={bt.color} />
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{bt.nom}</div>
                  <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 6, minHeight: 30, lineHeight: 1.4 }}>{bt.description || "Pas de description"}</div>
                  <span style={{ display: "inline-block", padding: "2px 8px", borderRadius: 4, fontSize: 9, fontWeight: 600, background: bt.critere === "manual" ? C.bg : C.blueLight, color: bt.critere === "manual" ? C.textMuted : C.blue }}>{critMeta.label}</span>
                  {bt.earned_count !== undefined && bt.earned_count > 0 && (
                    <div style={{ fontSize: 10, color: C.textMuted, marginTop: 6 }}>{bt.earned_count} attribué{bt.earned_count > 1 ? "s" : ""}</div>
                  )}
                  {!bt.actif && <div style={{ fontSize: 9, color: C.red, marginTop: 4, fontWeight: 600 }}>DÉSACTIVÉ</div>}
                </div>
                );
              })}
              {badgeTemplates.length === 0 && <div style={{ gridColumn: "1/-1", padding: "40px 20px", textAlign: "center", color: C.textMuted, fontSize: 13 }}>Aucun modèle de badge. Créez-en un pour commencer !</div>}
            </div>

            {/* Award badge manually */}
            <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Attribuer un badge manuellement</h2>
            <p style={{ fontSize: 12, color: C.textLight, marginBottom: 12 }}>Sélectionnez un collaborateur et un badge pour l'attribuer immédiatement. Le collaborateur recevra une notification.</p>
            <div className="iz-card" style={{ ...sCard, padding: "16px 20px", display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
              <select id="award-user" style={{ ...sInput, flex: 1 }}><option value="">Choisir un collaborateur...</option>{adminUsers.map((u: any) => <option key={u.id} value={u.id}>{u.name} ({u.email})</option>)}</select>
              <select id="award-badge" style={{ ...sInput, flex: 1 }}><option value="">Choisir un badge...</option>{badgeTemplates.filter(bt => bt.actif).map(bt => <option key={bt.id} value={bt.id}>{bt.nom}</option>)}</select>
              <button onClick={async () => {
                const uid = (document.getElementById("award-user") as HTMLSelectElement)?.value;
                const bid = (document.getElementById("award-badge") as HTMLSelectElement)?.value;
                if (!uid || !bid) { addToast_admin("Sélectionnez un collaborateur et un badge"); return; }
                try { await awardBadge(Number(uid), { badge_template_id: Number(bid) }); reloadGamif(); addToast_admin("Badge attribué !"); } catch { addToast_admin(t('toast.error')); }
              }} className="iz-btn-pink" style={{ ...sBtn("pink"), fontSize: 12, whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 6 }}><Award size={14} /> Attribuer</button>
            </div>

            {/* Recent badges */}
            <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Badges récents</h2>
            <div className="iz-card" style={{ ...sCard, overflow: "hidden", padding: 0 }}>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1.5fr 1fr 1fr 0.5fr", gap: 0, padding: "10px 16px", background: C.bg, borderBottom: `1px solid ${C.border}`, fontSize: 11, fontWeight: 600, color: C.textLight, textTransform: "uppercase" }}>
                <span>Collaborateur</span><span>Badge</span><span>Source</span><span>Date</span><span></span>
              </div>
              {badges.slice(0, 20).map(b => {
                const collab = COLLABORATEURS.find(c => c.id === b.collaborateur_id);
                const user = adminUsers.find((u: any) => u.id === b.user_id);
                const IconComp = getBadgeIcon(b.icon);
                return (
                  <div key={b.id} style={{ display: "grid", gridTemplateColumns: "2fr 1.5fr 1fr 1fr 0.5fr", gap: 0, padding: "12px 16px", borderBottom: `1px solid ${C.border}`, alignItems: "center", fontSize: 13 }} className="iz-sidebar-item">
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      {collab ? <div style={{ width: 30, height: 30, borderRadius: "50%", background: collab.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 600, color: C.white }}>{collab.initials}</div>
                        : <div style={{ width: 30, height: 30, borderRadius: "50%", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center" }}><Users size={12} color={C.textMuted} /></div>}
                      <span style={{ fontWeight: 500 }}>{collab ? `${collab.prenom} ${collab.nom}` : user ? user.name : `User #${b.user_id}`}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 24, height: 24, borderRadius: "50%", background: b.color + "20", display: "flex", alignItems: "center", justifyContent: "center" }}><IconComp size={12} color={b.color} /></div>
                      <span>{b.nom}</span>
                    </div>
                    <div style={{ fontSize: 11, color: C.textMuted }}>{b.description?.includes("workflow") ? "Workflow" : b.description?.includes("auto") ? "Auto" : "Manuel"}</div>
                    <div style={{ fontSize: 11, color: C.textMuted }}>{fmtDate(b.earned_at)}</div>
                    <div>
                      <button onClick={() => showConfirm(`Révoquer le badge "${b.nom}" ?`, async () => { try { await revokeBadge(b.id); reloadGamif(); addToast_admin("Badge révoqué"); } catch { addToast_admin(t('toast.error')); } })} title="Révoquer" style={{ background: C.redLight, border: "none", borderRadius: 6, padding: 4, cursor: "pointer" }}><Ban size={12} color={C.red} /></button>
                    </div>
                  </div>
                );
              })}
              {badges.length === 0 && <div style={{ padding: "30px 20px", textAlign: "center", color: C.textMuted, fontSize: 13 }}>Aucun badge attribué pour le moment. Utilisez le formulaire ci-dessus ou configurez un workflow automatique.</div>}
            </div>

            {/* Badge Template Create/Edit Panel */}
            {badgeTplPanel.mode !== "closed" && (<>
              <div onClick={() => setBadgeTplPanel({ mode: "closed", data: {} })} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.3)", zIndex: 1000 }} />
              <div className="iz-panel" style={{ position: "fixed", top: 0, right: 0, width: 480, height: "100vh", background: C.white, boxShadow: "-4px 0 24px rgba(0,0,0,.1)", zIndex: 1001, display: "flex", flexDirection: "column" }}>
                <div style={{ padding: "20px 24px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>{badgeTplPanel.mode === "create" ? "Nouveau modèle de badge" : "Modifier le badge"}</h2>
                  <button onClick={() => setBadgeTplPanel({ mode: "closed", data: {} })} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}><X size={18} /></button>
                </div>
                <div style={{ flex: 1, padding: 24, overflow: "auto", display: "flex", flexDirection: "column", gap: 16 }}>
                  {/* Preview */}
                  <div style={{ textAlign: "center", padding: "20px 0", borderBottom: `1px solid ${C.border}` }}>
                    <div style={{ width: 72, height: 72, borderRadius: "50%", background: (badgeTplPanel.data.color || "#F9A825") + "20", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px", border: `3px solid ${(badgeTplPanel.data.color || "#F9A825")}40` }}>
                      {(() => { const IC = getBadgeIcon(badgeTplPanel.data.icon || "trophy"); return <IC size={32} color={badgeTplPanel.data.color || "#F9A825"} />; })()}
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 600, color: C.text }}>{badgeTplPanel.data.nom || "Nom du badge"}</div>
                    <div style={{ fontSize: 12, color: C.textMuted }}>{badgeTplPanel.data.description || "Description du badge"}</div>
                  </div>

                  <div><label style={{ fontSize: 11, color: C.textLight, display: "block", marginBottom: 4 }}>Nom du badge *</label>
                    <TranslatableField value={badgeTplPanel.data.nom || ""} onChange={v => setBadgeTplPanel(p => ({ ...p, data: { ...p.data, nom: v } }))} currentLang={lang} activeLangs={activeLanguages} translations={contentTranslations.nom} onTranslationsChange={tr => setTr("nom", tr)} style={sInput} placeholder="Ex: Super Coopteur" />
                  </div>
                  <div><label style={{ fontSize: 11, color: C.textLight, display: "block", marginBottom: 4 }}>Description</label>
                    <TranslatableField multiline rows={3} value={badgeTplPanel.data.description || ""} onChange={v => setBadgeTplPanel(p => ({ ...p, data: { ...p.data, description: v } }))} currentLang={lang} activeLangs={activeLanguages} translations={contentTranslations.description} onTranslationsChange={tr => setTr("description", tr)} style={{ ...sInput, minHeight: 60, resize: "vertical" }} placeholder="Ex: Attribué quand un collaborateur termine son parcours" />
                  </div>

                  {/* Icon picker */}
                  <div><label style={{ fontSize: 11, color: C.textLight, display: "block", marginBottom: 4 }}>Icône</label>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {BADGE_ICONS.map(icon => {
                        const IC = BADGE_ICON_MAP[icon];
                        const sel = badgeTplPanel.data.icon === icon;
                        return <button key={icon} type="button" onClick={() => setBadgeTplPanel(p => ({ ...p, data: { ...p.data, icon } }))}
                          style={{ width: 36, height: 36, borderRadius: 8, border: sel ? `2px solid ${C.pink}` : `1px solid ${C.border}`, background: sel ? C.pinkBg : C.white, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all .1s" }}
                          title={icon}><IC size={16} color={sel ? C.pink : C.textMuted} /></button>;
                      })}
                    </div>
                  </div>

                  {/* Color picker */}
                  <div><label style={{ fontSize: 11, color: C.textLight, display: "block", marginBottom: 4 }}>Couleur</label>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {BADGE_COLORS.map(color => (
                        <button key={color} type="button" onClick={() => setBadgeTplPanel(p => ({ ...p, data: { ...p.data, color } }))}
                          style={{ width: 32, height: 32, borderRadius: "50%", background: color, border: badgeTplPanel.data.color === color ? `3px solid ${C.text}` : "3px solid transparent", cursor: "pointer", transition: "all .1s" }} />
                      ))}
                    </div>
                  </div>

                  {/* Critere */}
                  <div><label style={{ fontSize: 11, color: C.textLight, display: "block", marginBottom: 4 }}>Critère d'attribution</label>
                    <select value={badgeTplPanel.data.critere || "manual"} onChange={e => setBadgeTplPanel(p => ({ ...p, data: { ...p.data, critere: e.target.value } }))} style={sInput}>
                      {Object.entries(BADGE_CRITERE_META).map(([key, meta]) => (
                        <option key={key} value={key}>{meta.label}</option>
                      ))}
                    </select>
                    <div style={{ fontSize: 11, color: C.textMuted, marginTop: 4, lineHeight: 1.5 }}>{BADGE_CRITERE_META[badgeTplPanel.data.critere || "manual"]?.description}</div>
                  </div>

                  {/* Actif toggle */}
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div onClick={() => setBadgeTplPanel(p => ({ ...p, data: { ...p.data, actif: !p.data.actif } }))} style={{ width: 40, height: 22, borderRadius: 11, background: badgeTplPanel.data.actif ? C.green : C.border, cursor: "pointer", position: "relative", transition: "all .2s", flexShrink: 0 }}>
                      <div style={{ width: 18, height: 18, borderRadius: "50%", background: C.white, position: "absolute", top: 2, left: badgeTplPanel.data.actif ? 20 : 2, transition: "all .2s", boxShadow: "0 1px 3px rgba(0,0,0,.2)" }} />
                    </div>
                    <span style={{ fontSize: 12, color: C.text }}>{badgeTplPanel.data.actif ? "Actif" : "Désactivé"}</span>
                  </div>
                </div>
                <div style={{ padding: "16px 24px", borderTop: `1px solid ${C.border}`, display: "flex", gap: 8, justifyContent: "flex-end" }}>
                  {badgeTplPanel.mode === "edit" && badgeTplPanel.data.id && (
                    <button onClick={() => showConfirm(`Supprimer le badge "${badgeTplPanel.data.nom}" ?`, async () => {
                      try { await apiDeleteBadgeTpl(badgeTplPanel.data.id); reloadGamif(); setBadgeTplPanel({ mode: "closed", data: {} }); addToast_admin("Badge supprimé"); } catch { addToast_admin(t('toast.error')); }
                    })} style={{ ...sBtn("outline"), color: C.red, borderColor: C.red, marginRight: "auto" }}>{t('common.delete')}</button>
                  )}
                  <button onClick={() => setBadgeTplPanel({ mode: "closed", data: {} })} className="iz-btn-outline" style={sBtn("outline")}>{t('common.cancel')}</button>
                  <button onClick={async () => {
                    if (!badgeTplPanel.data.nom?.trim()) { addToast_admin("Le nom est requis"); return; }
                    try {
                      const payload = { nom: badgeTplPanel.data.nom, description: badgeTplPanel.data.description || "", icon: badgeTplPanel.data.icon || "trophy", color: badgeTplPanel.data.color || "#F9A825", critere: badgeTplPanel.data.critere || "manual", actif: badgeTplPanel.data.actif !== false, translations: buildTranslationsPayload() };
                      if (badgeTplPanel.mode === "edit" && badgeTplPanel.data.id) await apiUpdateBadgeTpl(badgeTplPanel.data.id, payload);
                      else await apiCreateBadgeTpl(payload);
                      reloadGamif(); setBadgeTplPanel({ mode: "closed", data: {} }); addToast_admin(badgeTplPanel.mode === "create" ? "Badge créé" : "Badge modifié");
                    } catch { addToast_admin(t('toast.error')); }
                  }} className="iz-btn-pink" style={sBtn("pink")}>{badgeTplPanel.mode === "create" ? t('common.create') : t('common.save')}</button>
                </div>
              </div>
            </>)}
          </div>
          );
        })()}
        {adminPage === "admin_users" && (() => {
          const ROLE_META: Record<string, { label: string; color: string; bg: string }> = {
            super_admin: { label: t('role.super_admin'), color: "#E53935", bg: C.redLight },
            admin: { label: t('role.admin'), color: "#7B5EA7", bg: C.purple + "15" },
            admin_rh: { label: t('role.admin_rh'), color: "#C2185B", bg: C.pinkBg },
            manager: { label: t('role.manager'), color: "#1A73E8", bg: C.blueLight },
            onboardee: { label: t('role.onboardee'), color: "#4CAF50", bg: C.greenLight },
          };
          const filteredUsers = adminUsers
            .filter(u => userRoleFilter === "all" || u.role === userRoleFilter)
            .filter(u => !userSearch || `${u.name} ${u.email}`.toLowerCase().includes(userSearch.toLowerCase()));
          return (
          <div style={{ flex: 1, padding: "24px 32px", overflow: "auto" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
              <h1 style={{ fontSize: 22, fontWeight: 600, margin: 0 }}>{t('users.title')}</h1>
            </div>

            {/* Search bar + invite button */}
            <div className="iz-card" style={{ ...sCard, display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", marginBottom: 16 }}>
              <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, background: C.bg, borderRadius: 8, padding: "8px 12px" }}>
                <Search size={16} color={C.textLight} />
                <input value={userSearch} onChange={e => setUserSearch(e.target.value)} placeholder="Rechercher ou inviter par e-mail" style={{ border: "none", outline: "none", background: "transparent", flex: 1, fontSize: 13, fontFamily: font, color: C.text }} />
              </div>
              <button onClick={() => { setUserPanelData({ name: "", email: "", password: "", role: "onboardee" }); setUserPanelMode("create"); }} className="iz-btn-pink" style={{ ...sBtn("pink"), display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}><UserPlus size={14} /> {t('suivi.invite_people')}</button>
            </div>

            {/* Role filter dropdown */}
            <div style={{ marginBottom: 16 }}>
              <select value={userRoleFilter} onChange={e => setUserRoleFilter(e.target.value)} style={{ padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 500, border: `1px solid ${C.pink}`, color: C.pink, background: C.white, cursor: "pointer", fontFamily: font, outline: "none" }}>
                <option value="all">Tous les utilisateurs ({adminUsers.length})</option>
                {Object.entries(ROLE_META).map(([role, meta]) => (
                  <option key={role} value={role}>{meta.label} ({adminUsers.filter(u => u.role === role).length})</option>
                ))}
              </select>
            </div>

            {/* Table header */}
            <div style={{ display: "grid", gridTemplateColumns: "2.5fr 1.8fr 1.2fr 1fr 1fr 40px", gap: 0, padding: "10px 16px", borderBottom: `1px solid ${C.border}`, fontSize: 11, fontWeight: 600, color: C.textLight, textTransform: "uppercase", letterSpacing: .3 }}>
              <span>Nom</span><span>E-mail</span><span>Rôle</span><span>Dernière activité</span><span>Invité par</span><span></span>
            </div>

            {/* Invite row */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", borderBottom: `1px solid ${C.border}`, cursor: "pointer" }}
              onClick={() => { setUserPanelData({ name: "", email: "", password: "", role: "onboardee" }); setUserPanelMode("create"); }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", border: `2px dashed ${C.pink}`, display: "flex", alignItems: "center", justifyContent: "center" }}><Plus size={14} color={C.pink} /></div>
              <span style={{ fontSize: 13, color: C.pink, fontWeight: 500 }}>{t('suivi.invite_people')}</span>
            </div>

            {/* User rows */}
            {filteredUsers.map(u => {
              const rm = ROLE_META[u.role] || ROLE_META.onboardee;
              const initials = u.name?.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase() || "?";
              const isOwner = u.role === "super_admin";
              return (
              <div key={u.id} style={{ display: "grid", gridTemplateColumns: "2.5fr 1.8fr 1.2fr 1fr 1fr 40px", gap: 0, padding: "14px 16px", borderBottom: `1px solid ${C.border}`, alignItems: "center", cursor: "pointer" }}
                className="iz-sidebar-item" onClick={() => { setUserPanelData({ id: u.id, name: u.name, email: u.email, password: "", role: u.role }); setUserPanelMode("edit"); }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ position: "relative", flexShrink: 0 }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: rm.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600, color: C.white }}>{initials}</div>
                    <div style={{ position: "absolute", bottom: -1, right: -1, width: 10, height: 10, borderRadius: "50%", background: C.green, border: `2px solid ${C.white}` }} />
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                    <span style={{ fontWeight: 500, fontSize: 14, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.name}</span>
                    {isOwner && <span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 600, background: rm.bg, color: rm.color, flexShrink: 0 }}>Propriétaire</span>}
                  </div>
                </div>
                <div style={{ fontSize: 13, color: C.textLight, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.email}</div>
                <div style={{ fontSize: 13, color: C.textLight }}>{rm.label}</div>
                <div style={{ fontSize: 12, color: C.textMuted }}>{fmtDateShort(u.updated_at || u.created_at)}</div>
                <div style={{ fontSize: 12, color: C.textMuted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{/* invited by — not tracked yet */}—</div>
                <button onClick={e => { e.stopPropagation(); setUserPanelData({ id: u.id, name: u.name, email: u.email, password: "", role: u.role }); setUserPanelMode("edit"); }} style={{ background: "none", border: "none", cursor: "pointer", color: C.textMuted, padding: 4, display: "flex", alignItems: "center" }}><MoreHorizontal size={16} /></button>
              </div>
              );
            })}
            {filteredUsers.length === 0 && <div style={{ padding: "40px 20px", textAlign: "center", color: C.textMuted, fontSize: 13 }}>Aucun utilisateur trouvé</div>}
            {/* Panel create/edit */}
            {userPanelMode !== "closed" && (
              <>
                <div onClick={() => setUserPanelMode("closed")} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.3)", zIndex: 1000 }} />
                <div className="iz-panel" style={{ position: "fixed", top: 0, right: 0, width: 480, height: "100vh", background: C.white, boxShadow: "-4px 0 24px rgba(0,0,0,.1)", zIndex: 1001, display: "flex", flexDirection: "column" }}>
                  <div style={{ padding: "24px 28px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>{userPanelMode === "create" ? "Nouvel utilisateur" : "Modifier l'utilisateur"}</h2>
                    <button onClick={() => setUserPanelMode("closed")} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={22} color={C.textLight} /></button>
                  </div>
                  <div style={{ flex: 1, padding: "24px 28px", overflow: "auto" }}>
                    <div style={{ marginBottom: 20 }}>
                      <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Nom complet *</label>
                      <input value={userPanelData.name} onChange={e => setUserPanelData(prev => ({ ...prev, name: e.target.value }))} placeholder="Prénom Nom" style={sInput} />
                    </div>
                    <div style={{ marginBottom: 20 }}>
                      <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Email *</label>
                      <input type="email" value={userPanelData.email} onChange={e => setUserPanelData(prev => ({ ...prev, email: e.target.value }))} placeholder="email@entreprise.com" style={sInput} />
                    </div>
                    <div style={{ marginBottom: 20 }}>
                      <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>{userPanelMode === "create" ? "Mot de passe *" : "Nouveau mot de passe (laisser vide pour ne pas changer)"}</label>
                      <div style={{ display: "flex", gap: 8 }}>
                        <input type="password" value={userPanelData.password} onChange={e => setUserPanelData(prev => ({ ...prev, password: e.target.value }))} placeholder="••••••••" style={{ ...sInput, flex: 1 }} />
                        {userPanelMode === "edit" && (
                          <button onClick={async () => {
                            const tempPwd = Math.random().toString(36).slice(-10);
                            try {
                              await apiFetch(`/users/${userPanelData.id}/reset-password`, { method: "POST", body: JSON.stringify({ password: tempPwd }) });
                              setUserPanelData(prev => ({ ...prev, password: tempPwd }));
                              addToast_admin(`Mot de passe temporaire : ${tempPwd}`);
                            } catch { addToast_admin(t('toast.error')); }
                          }} className="iz-btn-outline" style={{ ...sBtn("outline"), fontSize: 10, padding: "6px 10px", whiteSpace: "nowrap" }}>Générer</button>
                        )}
                      </div>
                    </div>
                    <div style={{ marginBottom: 20 }}>
                      <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 10 }}>Rôle *</label>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {Object.entries(ROLE_META).map(([role, meta]) => {
                          const active = userPanelData.role === role;
                          const descriptions: Record<string, string> = {
                            super_admin: "Accès total — gestion des tenants et de la plateforme",
                            admin: "Accès complet au tenant — paramètres, facturation, intégrations",
                            admin_rh: "Gestion RH — parcours, actions, documents, collaborateurs",
                            manager: "Vue équipe — suivi de ses collaborateurs, validation",
                            onboardee: "Collaborateur — complète son parcours d'onboarding",
                          };
                          return (
                            <button key={role} onClick={() => setUserPanelData(prev => ({ ...prev, role }))} style={{
                              padding: "12px 14px", borderRadius: 10, border: `2px solid ${active ? meta.color : C.border}`, background: active ? meta.bg : C.white,
                              cursor: "pointer", display: "flex", alignItems: "center", gap: 12, fontFamily: font, textAlign: "left", transition: "all .15s",
                            }}>
                              <div style={{ width: 36, height: 36, borderRadius: 8, background: active ? meta.color : C.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <ShieldCheck size={16} color={active ? C.white : meta.color} />
                              </div>
                              <div>
                                <div style={{ fontSize: 13, fontWeight: active ? 600 : 400, color: active ? meta.color : C.text }}>{meta.label}</div>
                                <div style={{ fontSize: 11, color: C.textMuted }}>{descriptions[role]}</div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  <div style={{ padding: "16px 28px", borderTop: `1px solid ${C.border}`, display: "flex", gap: 12, justifyContent: "space-between" }}>
                    <div>
                      {userPanelMode === "edit" && (
                        <button onClick={() => {
                          if (!userPanelData.id) return;
                          const id = userPanelData.id;
                          setConfirmDialog({ message: "Supprimer cet utilisateur ? Il perdra tous ses accès.", onConfirm: async () => {
                            try { await apiDeleteUser(id); addToast_admin("Utilisateur supprimé"); setUserPanelMode("closed"); getUsers().then(setAdminUsers); } catch { addToast_admin(t('toast.error')); }
                            setConfirmDialog(null);
                          }});
                        }} style={{ ...sBtn("outline"), color: C.red, borderColor: C.red, fontSize: 13 }}>{t('common.delete')}</button>
                      )}
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => setUserPanelMode("closed")} style={{ ...sBtn("outline"), fontSize: 13 }}>{t('common.cancel')}</button>
                      <button disabled={userPanelLoading || !userPanelData.name.trim() || !userPanelData.email.trim() || (userPanelMode === "create" && !userPanelData.password)} onClick={async () => {
                        setUserPanelLoading(true);
                        try {
                          if (userPanelMode === "create") {
                            await apiCreateUser({ name: userPanelData.name, email: userPanelData.email, password: userPanelData.password, role: userPanelData.role });
                            addToast_admin("Utilisateur créé");
                          } else {
                            const payload: any = { name: userPanelData.name, email: userPanelData.email, role: userPanelData.role };
                            if (userPanelData.password) payload.password = userPanelData.password;
                            await apiUpdateUser(userPanelData.id!, payload);
                            addToast_admin("Utilisateur modifié");
                          }
                          setUserPanelMode("closed");
                          getUsers().then(setAdminUsers);
                        } catch { addToast_admin(t('toast.error')); }
                        finally { setUserPanelLoading(false); }
                      }} className="iz-btn-pink" style={{ ...sBtn("pink"), fontSize: 13, opacity: userPanelLoading ? 0.6 : 1 }}>
                        {userPanelLoading ? "..." : userPanelMode === "create" ? "Créer l'utilisateur" : "Enregistrer"}
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
          );
        })()}
        {/* ── Groupe Create/Edit Panel ────────────────────────── */}
        {groupePanelMode !== "closed" && (
          <>
            <div onClick={() => setGroupePanelMode("closed")} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.3)", zIndex: 1000 }} />
            <div className="iz-panel" style={{ position: "fixed", top: 0, right: 0, width: 520, height: "100vh", background: C.white, boxShadow: "-4px 0 24px rgba(0,0,0,.1)", zIndex: 1001, display: "flex", flexDirection: "column" }}>
              <div style={{ padding: "24px 28px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>{groupePanelMode === "create" ? "Nouveau groupe" : "Modifier le groupe"}</h2>
                <button onClick={() => setGroupePanelMode("closed")} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={22} color={C.textLight} /></button>
              </div>
              <div style={{ flex: 1, padding: "24px 28px", overflow: "auto" }}>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Nom du groupe *</label>
                  <TranslatableField value={groupePanelData.nom} onChange={v => setGroupePanelData(prev => ({ ...prev, nom: v }))} placeholder="Ex: Nouveaux arrivants Paris" currentLang={lang} activeLangs={activeLanguages} translations={contentTranslations.nom} onTranslationsChange={tr => setTr("nom", tr)} />
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Description</label>
                  <TranslatableField multiline rows={2} value={groupePanelData.description} onChange={v => setGroupePanelData(prev => ({ ...prev, description: v }))} placeholder="Description du groupe..." currentLang={lang} activeLangs={activeLanguages} translations={contentTranslations.description} onTranslationsChange={tr => setTr("description", tr)} />
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Couleur</label>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {["#C2185B", "#1A73E8", "#4CAF50", "#F9A825", "#7B5EA7", "#E53935", "#00897B", "#F57C00"].map(col => (
                      <button key={col} onClick={() => setGroupePanelData(prev => ({ ...prev, couleur: col }))} style={{
                        width: 36, height: 36, borderRadius: 10, background: col, border: groupePanelData.couleur === col ? `3px solid ${C.dark}` : "3px solid transparent", cursor: "pointer", transition: "all .15s",
                      }} />
                    ))}
                  </div>
                </div>
                <div style={{ marginBottom: 20, padding: "16px", background: C.bg, borderRadius: 10 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: C.text, marginBottom: 10 }}>Critère automatique (optionnel)</div>
                  <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 10 }}>Les collaborateurs correspondants seront ajoutés automatiquement</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 600, color: C.textLight, display: "block", marginBottom: 4 }}>Type</label>
                      <select value={groupePanelData.critereType} onChange={e => setGroupePanelData(prev => ({ ...prev, critereType: e.target.value, critereValeur: "" }))} style={{ ...sInput, fontSize: 12, cursor: "pointer" }}>
                        <option value="">Aucun</option>
                        <option value="site">Site</option>
                        <option value="departement">Département</option>
                        <option value="contrat">Type de contrat</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 600, color: C.textLight, display: "block", marginBottom: 4 }}>Valeur</label>
                      <select value={groupePanelData.critereValeur} onChange={e => setGroupePanelData(prev => ({ ...prev, critereValeur: e.target.value }))} disabled={!groupePanelData.critereType} style={{ ...sInput, fontSize: 12, cursor: "pointer", opacity: groupePanelData.critereType ? 1 : 0.5 }}>
                        <option value="">Sélectionner...</option>
                        {groupePanelData.critereType === "site" && SITES.map(s => <option key={s} value={s}>{s}</option>)}
                        {groupePanelData.critereType === "departement" && DEPARTEMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                        {groupePanelData.critereType === "contrat" && TYPES_CONTRAT.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Membres</label>
                  <div style={{ border: `1px solid ${C.border}`, borderRadius: 8, maxHeight: 200, overflow: "auto" }}>
                    {COLLABORATEURS.map(c => {
                      const fullName = `${c.prenom} ${c.nom}`;
                      const checked = (groupePanelData.membres || []).includes(fullName);
                      return (
                        <label key={c.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", cursor: "pointer", borderBottom: `1px solid ${C.border}`, background: checked ? C.pinkBg : "transparent", transition: "all .15s" }}>
                          <input type="checkbox" checked={checked} onChange={() => {
                            setGroupePanelData(prev => ({
                              ...prev,
                              membres: checked ? prev.membres.filter(m => m !== fullName) : [...prev.membres, fullName],
                            }));
                          }} style={{ accentColor: C.pink }} />
                          <div style={{ width: 28, height: 28, borderRadius: "50%", background: c.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 600, color: C.white, flexShrink: 0 }}>{c.initials}</div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 13, fontWeight: checked ? 600 : 400 }}>{fullName}</div>
                            <div style={{ fontSize: 10, color: C.textMuted }}>{c.poste} · {c.site}</div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                  <div style={{ fontSize: 11, color: C.textMuted, marginTop: 4 }}>{(groupePanelData.membres || []).length} membre(s) sélectionné(s)</div>
                </div>
              </div>
              <div style={{ padding: "16px 28px", borderTop: `1px solid ${C.border}`, display: "flex", gap: 12, justifyContent: "space-between" }}>
                <div>
                  {groupePanelMode === "edit" && (
                    <button onClick={() => {
                      if (!groupePanelData.id) return;
                      const id = groupePanelData.id;
                      setConfirmDialog({ message: "Supprimer ce groupe ?", onConfirm: async () => {
                        try { await apiDeleteGroupe(id); addToast_admin("Groupe supprimé"); setGroupePanelMode("closed"); refetchGroupes(); } catch { addToast_admin(t('toast.error')); }
                        setConfirmDialog(null);
                      }});
                    }} style={{ ...sBtn("outline"), color: C.red, borderColor: C.red, fontSize: 13 }}>{t('common.delete')}</button>
                  )}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => setGroupePanelMode("closed")} style={{ ...sBtn("outline"), fontSize: 13 }}>{t('common.cancel')}</button>
                  <button disabled={groupePanelLoading || !groupePanelData.nom.trim()} onClick={async () => {
                    setGroupePanelLoading(true);
                    const payload: Record<string, any> = { nom: groupePanelData.nom.trim(), description: groupePanelData.description, couleur: groupePanelData.couleur, translations: buildTranslationsPayload() };
                    if (groupePanelData.critereType) { payload.critere_type = groupePanelData.critereType; payload.critere_valeur = groupePanelData.critereValeur; }
                    else { payload.critere_type = null; payload.critere_valeur = null; }
                    try {
                      if (groupePanelMode === "create") { await apiCreateGroupe(payload); addToast_admin("Groupe créé"); }
                      else { await apiUpdateGroupe(groupePanelData.id!, payload); addToast_admin("Groupe modifié"); }
                      setGroupePanelMode("closed"); refetchGroupes();
                    } catch { addToast_admin(t('toast.error')); }
                    finally { setGroupePanelLoading(false); }
                  }} className="iz-btn-pink" style={{ ...sBtn("pink"), fontSize: 13, opacity: groupePanelLoading || !groupePanelData.nom.trim() ? 0.6 : 1 }}>
                    {groupePanelLoading ? "..." : groupePanelMode === "create" ? "Créer le groupe" : "Enregistrer"}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
        {/* ── Action Create/Edit Panel ────────────────────────── */}
        {actionPanelMode !== "closed" && (
          <>
            <div onClick={() => setActionPanelMode("closed")} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.3)", zIndex: 1000 }} />
            <div className="iz-panel" style={{ position: "fixed", top: 0, right: 0, width: 560, height: "100vh", background: C.white, boxShadow: "-4px 0 24px rgba(0,0,0,.1)", zIndex: 1001, display: "flex", flexDirection: "column" }}>
              <div style={{ padding: "24px 28px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>{actionPanelMode === "create" ? "Nouvelle action" : "Modifier l'action"}</h2>
                <button onClick={() => setActionPanelMode("closed")} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={22} color={C.textLight} /></button>
              </div>
              <div style={{ flex: 1, padding: "24px 28px", overflow: "auto" }}>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Titre de l'action *</label>
                  <TranslatableField value={actionPanelData.titre} onChange={v => setActionPanelData(prev => ({ ...prev, titre: v }))} placeholder="Ex: Signer la charte informatique" currentLang={lang} activeLangs={activeLanguages} translations={contentTranslations.titre} onTranslationsChange={tr => setTr("titre", tr)} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Type *</label>
                    <select value={actionPanelData.type} onChange={e => setActionPanelData(prev => ({ ...prev, type: e.target.value as ActionType }))} style={{ ...sInput, cursor: "pointer" }}>
                      {(Object.entries(ACTION_TYPE_META) as [ActionType, any][]).map(([slug, meta]) => (
                        <option key={slug} value={slug}>{meta.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Délai relatif</label>
                    <select value={actionPanelData.delaiRelatif || "J+0"} onChange={e => setActionPanelData(prev => ({ ...prev, delaiRelatif: e.target.value }))} style={{ ...sInput, cursor: "pointer" }}>
                      <option value="J-90">J-90</option><option value="J-60">J-60</option><option value="J-45">J-45</option>
                      <option value="J-30">J-30</option><option value="J-21">J-21</option><option value="J-14">J-14</option>
                      <option value="J-7">J-7</option><option value="J-3">J-3</option><option value="J-1">J-1</option>
                      <option value="J+0">J+0</option><option value="J+1">J+1</option><option value="J+3">J+3</option>
                      <option value="J+7">J+7</option><option value="J+8">J+8</option><option value="J+14">J+14</option>
                      <option value="J+15">J+15</option><option value="J+30">J+30</option><option value="J+60">J+60</option>
                      <option value="J+90">J+90</option>
                    </select>
                  </div>
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Phases associées</label>
                  <div style={{ border: `1px solid ${C.border}`, borderRadius: 8, maxHeight: 220, overflow: "auto" }}>
                    {PHASE_DEFAULTS.map(ph => {
                      const checked = (actionPanelData.phaseIds || []).includes(ph.id);
                      const phParcours = (ph as any).parcoursNoms || [];
                      return (
                        <label key={ph.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", cursor: "pointer", borderBottom: `1px solid ${C.border}`, background: checked ? `${ph.couleur}15` : "transparent", transition: "all .15s" }}>
                          <input type="checkbox" checked={checked} onChange={() => {
                            setActionPanelData(prev => ({
                              ...prev,
                              phaseIds: checked ? prev.phaseIds.filter(id => id !== ph.id) : [...prev.phaseIds, ph.id],
                            }));
                          }} style={{ accentColor: C.pink }} />
                          <div style={{ width: 8, height: 8, borderRadius: "50%", background: ph.couleur, flexShrink: 0 }} />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 13, fontWeight: checked ? 600 : 400, color: C.text }}>{ph.nom}</div>
                            {phParcours.length > 0 && <div style={{ fontSize: 10, color: C.textMuted }}>{phParcours.join(", ")}</div>}
                          </div>
                          <span style={{ fontSize: 10, color: C.textLight }}>{ph.delaiDebut} → {ph.delaiFin}</span>
                        </label>
                      );
                    })}
                  </div>
                  {(actionPanelData.phaseIds || []).length === 0 && (
                    <div style={{ fontSize: 11, color: C.textMuted, marginTop: 4 }}>Aucune phase sélectionnée</div>
                  )}
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Description</label>
                  <TranslatableField multiline rows={3} value={actionPanelData.description} onChange={v => setActionPanelData(prev => ({ ...prev, description: v }))} placeholder="Décrivez l'action..." currentLang={lang} activeLangs={activeLanguages} translations={contentTranslations.description} onTranslationsChange={tr => setTr("description", tr)} style={{ minHeight: 80 }} />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, padding: "12px 14px", background: C.bg, borderRadius: 10, cursor: "pointer" }}
                  onClick={() => setActionPanelData(prev => ({ ...prev, obligatoire: !prev.obligatoire }))}>
                  <div style={{ width: 20, height: 20, borderRadius: 4, border: `2px solid ${actionPanelData.obligatoire ? C.pink : C.border}`, background: actionPanelData.obligatoire ? C.pink : C.white, display: "flex", alignItems: "center", justifyContent: "center", transition: "all .15s" }}>
                    {actionPanelData.obligatoire && <Check size={14} color={C.white} />}
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 500 }}>Action obligatoire</span>
                </div>
                {/* ── Type-specific fields ────────────────────── */}
                <div style={{ padding: "16px", background: C.bg, borderRadius: 10, marginBottom: 20 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: C.textMuted, textTransform: "uppercase", letterSpacing: .5, marginBottom: 12 }}>
                    Options — {(ACTION_TYPE_META[actionPanelData.type] || ACTION_TYPE_META.tache).label}
                  </div>

                  {/* Document */}
                  {actionPanelData.type === "document" && (<>
                    <div style={{ marginBottom: 12 }}>
                      <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Pièces requises</label>
                      {(actionPanelData.options.pieces || []).map((p: string, i: number) => (
                        <div key={i} style={{ display: "flex", gap: 6, marginBottom: 4 }}>
                          <input value={p} onChange={e => { const arr = [...(actionPanelData.options.pieces || [])]; arr[i] = e.target.value; setActionPanelData(prev => ({ ...prev, options: { ...prev.options, pieces: arr } })); }} style={{ ...sInput, flex: 1, padding: "6px 10px", fontSize: 12 }} />
                          <button onClick={() => { const arr = (actionPanelData.options.pieces || []).filter((_: any, j: number) => j !== i); setActionPanelData(prev => ({ ...prev, options: { ...prev.options, pieces: arr } })); }} style={{ background: "none", border: "none", cursor: "pointer", color: C.red }}><X size={14} /></button>
                        </div>
                      ))}
                      <button onClick={() => setActionPanelData(prev => ({ ...prev, options: { ...prev.options, pieces: [...(prev.options.pieces || []), ""] } }))} style={{ fontSize: 11, color: C.pink, background: "none", border: "none", cursor: "pointer", fontWeight: 600, fontFamily: font, padding: "4px 0" }}>+ Ajouter une pièce</button>
                    </div>
                    <div><label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Fichiers acceptés</label>
                      <input value={actionPanelData.options.fichiersAcceptes || ""} onChange={e => setActionPanelData(prev => ({ ...prev, options: { ...prev.options, fichiersAcceptes: e.target.value } }))} placeholder="PDF, Image, Word..." style={{ ...sInput, fontSize: 12 }} />
                    </div>
                  </>)}

                  {/* Formulaire */}
                  {actionPanelData.type === "formulaire" && (<>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Champs du formulaire</label>
                      {(actionPanelData.options.champs || []).map((ch: any, i: number) => (
                        <div key={i} style={{ display: "flex", gap: 6, marginBottom: 4 }}>
                          <input value={ch.label || ""} onChange={e => { const arr = [...(actionPanelData.options.champs || [])]; arr[i] = { ...arr[i], label: e.target.value }; setActionPanelData(prev => ({ ...prev, options: { ...prev.options, champs: arr } })); }} placeholder="Label" style={{ ...sInput, flex: 2, padding: "6px 10px", fontSize: 12 }} />
                          <select value={ch.type || "texte"} onChange={e => { const arr = [...(actionPanelData.options.champs || [])]; arr[i] = { ...arr[i], type: e.target.value }; setActionPanelData(prev => ({ ...prev, options: { ...prev.options, champs: arr } })); }} style={{ ...sInput, flex: 1, padding: "6px 10px", fontSize: 12, cursor: "pointer" }}>
                            <option value="texte">Texte</option><option value="nombre">Nombre</option><option value="date">Date</option><option value="email">Email</option><option value="choix">Choix</option><option value="textarea">Zone texte</option>
                          </select>
                          <button onClick={() => { const arr = (actionPanelData.options.champs || []).filter((_: any, j: number) => j !== i); setActionPanelData(prev => ({ ...prev, options: { ...prev.options, champs: arr } })); }} style={{ background: "none", border: "none", cursor: "pointer", color: C.red }}><X size={14} /></button>
                        </div>
                      ))}
                      <button onClick={() => setActionPanelData(prev => ({ ...prev, options: { ...prev.options, champs: [...(prev.options.champs || []), { label: "", type: "texte" }] } }))} style={{ fontSize: 11, color: C.pink, background: "none", border: "none", cursor: "pointer", fontWeight: 600, fontFamily: font, padding: "4px 0" }}>+ Ajouter un champ</button>
                    </div>
                  </>)}

                  {/* Formation */}
                  {actionPanelData.type === "formation" && (<>
                    <div style={{ marginBottom: 12 }}><label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Lien e-learning</label>
                      <input value={actionPanelData.lienExterne} onChange={e => setActionPanelData(prev => ({ ...prev, lienExterne: e.target.value }))} placeholder="https://..." style={{ ...sInput, fontSize: 12 }} /></div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      <div><label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Durée</label>
                        <input value={actionPanelData.dureeEstimee} onChange={e => setActionPanelData(prev => ({ ...prev, dureeEstimee: e.target.value }))} placeholder="30 min" style={{ ...sInput, fontSize: 12 }} /></div>
                      <div><label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Support</label>
                        <select value={actionPanelData.options.support || "video"} onChange={e => setActionPanelData(prev => ({ ...prev, options: { ...prev.options, support: e.target.value } }))} style={{ ...sInput, fontSize: 12, cursor: "pointer" }}>
                          <option value="video">Vidéo</option><option value="pdf">PDF</option><option value="scorm">SCORM</option><option value="lien">Lien externe</option>
                        </select></div>
                    </div>
                  </>)}

                  {/* Questionnaire */}
                  {actionPanelData.type === "questionnaire" && (<>
                    <div style={{ marginBottom: 12 }}>
                      <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Questions</label>
                      {(actionPanelData.options.questions || []).map((q: any, i: number) => (
                        <div key={i} style={{ display: "flex", gap: 6, marginBottom: 4 }}>
                          <input value={q.question || ""} onChange={e => { const arr = [...(actionPanelData.options.questions || [])]; arr[i] = { ...arr[i], question: e.target.value }; setActionPanelData(prev => ({ ...prev, options: { ...prev.options, questions: arr } })); }} placeholder="Question" style={{ ...sInput, flex: 2, padding: "6px 10px", fontSize: 12 }} />
                          <select value={q.type || "libre"} onChange={e => { const arr = [...(actionPanelData.options.questions || [])]; arr[i] = { ...arr[i], type: e.target.value }; setActionPanelData(prev => ({ ...prev, options: { ...prev.options, questions: arr } })); }} style={{ ...sInput, flex: 1, padding: "6px 10px", fontSize: 12, cursor: "pointer" }}>
                            <option value="libre">Texte libre</option><option value="qcm">QCM</option><option value="note">Note /10</option><option value="oui_non">Oui/Non</option>
                          </select>
                          <button onClick={() => { const arr = (actionPanelData.options.questions || []).filter((_: any, j: number) => j !== i); setActionPanelData(prev => ({ ...prev, options: { ...prev.options, questions: arr } })); }} style={{ background: "none", border: "none", cursor: "pointer", color: C.red }}><X size={14} /></button>
                        </div>
                      ))}
                      <button onClick={() => setActionPanelData(prev => ({ ...prev, options: { ...prev.options, questions: [...(prev.options.questions || []), { question: "", type: "libre" }] } }))} style={{ fontSize: 11, color: C.pink, background: "none", border: "none", cursor: "pointer", fontWeight: 600, fontFamily: font, padding: "4px 0" }}>+ Ajouter une question</button>
                    </div>
                    <div><label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Score minimum requis (%)</label>
                      <input type="number" value={actionPanelData.options.scoreMinimum || ""} onChange={e => setActionPanelData(prev => ({ ...prev, options: { ...prev.options, scoreMinimum: Number(e.target.value) } }))} placeholder="0" min={0} max={100} style={{ ...sInput, fontSize: 12, width: 100 }} /></div>
                  </>)}

                  {/* Tâche */}
                  {actionPanelData.type === "tache" && (<>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Sous-tâches (checklist)</label>
                      {(actionPanelData.options.sousTaches || []).map((st: string, i: number) => (
                        <div key={i} style={{ display: "flex", gap: 6, marginBottom: 4 }}>
                          <input value={st} onChange={e => { const arr = [...(actionPanelData.options.sousTaches || [])]; arr[i] = e.target.value; setActionPanelData(prev => ({ ...prev, options: { ...prev.options, sousTaches: arr } })); }} placeholder="Sous-tâche" style={{ ...sInput, flex: 1, padding: "6px 10px", fontSize: 12 }} />
                          <button onClick={() => { const arr = (actionPanelData.options.sousTaches || []).filter((_: any, j: number) => j !== i); setActionPanelData(prev => ({ ...prev, options: { ...prev.options, sousTaches: arr } })); }} style={{ background: "none", border: "none", cursor: "pointer", color: C.red }}><X size={14} /></button>
                        </div>
                      ))}
                      <button onClick={() => setActionPanelData(prev => ({ ...prev, options: { ...prev.options, sousTaches: [...(prev.options.sousTaches || []), ""] } }))} style={{ fontSize: 11, color: C.pink, background: "none", border: "none", cursor: "pointer", fontWeight: 600, fontFamily: font, padding: "4px 0" }}>+ Ajouter une sous-tâche</button>
                    </div>
                  </>)}

                  {/* Signature */}
                  {actionPanelData.type === "signature" && (<>
                    <div style={{ marginBottom: 12 }}><label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Document à signer</label>
                      <input value={actionPanelData.options.documentNom || ""} onChange={e => setActionPanelData(prev => ({ ...prev, options: { ...prev.options, documentNom: e.target.value } }))} placeholder="Nom du document" style={{ ...sInput, fontSize: 12 }} /></div>
                    <div style={{ marginBottom: 12 }}><label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Fournisseur de signature</label>
                      {(() => {
                      const sigIntegrations = (integrations || []).filter((i: any) => i.categorie === "signature");
                      const defaultProv = sigIntegrations.find((i: any) => i.config?.is_default)?.provider || "native";
                      const currentProv = actionPanelData.options.provider || defaultProv;
                      return (
                      <select value={currentProv} onChange={e => setActionPanelData(prev => ({ ...prev, options: { ...prev.options, provider: e.target.value } }))} style={{ ...sInput, fontSize: 12, cursor: "pointer" }}>
                        {sigIntegrations.map((si: any) => {
                          const connected = si.connecte || si.provider === "native";
                          return <option key={si.id} value={si.provider}>{si.nom}{connected ? "" : " (non connecté)"}</option>;
                        })}
                      </select>
                      );
                    })()}
                      {(actionPanelData.options.provider === "docusign" || actionPanelData.options.provider === "ugosign") && (
                        <div style={{ marginTop: 8, padding: "10px 12px", background: C.amberLight, borderRadius: 8, fontSize: 11, color: C.amber, display: "flex", alignItems: "center", gap: 6 }}>
                          <AlertTriangle size={13} /> Configurez le connecteur dans Intégrations pour activer ce fournisseur
                        </div>
                      )}
                    </div>
                    <div><label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Options</label>
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, cursor: "pointer" }}>
                          <input type="checkbox" checked={actionPanelData.options.rappelAuto !== false} onChange={e => setActionPanelData(prev => ({ ...prev, options: { ...prev.options, rappelAuto: e.target.checked } }))} style={{ accentColor: C.pink }} />
                          Rappel automatique si non signé après 48h
                        </label>
                        <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, cursor: "pointer" }}>
                          <input type="checkbox" checked={!!actionPanelData.options.certifie} onChange={e => setActionPanelData(prev => ({ ...prev, options: { ...prev.options, certifie: e.target.checked } }))} style={{ accentColor: C.pink }} />
                          Signature certifiée (valeur légale)
                        </label>
                      </div>
                    </div>
                  </>)}

                  {/* Lecture */}
                  {actionPanelData.type === "lecture" && (<>
                    <div style={{ marginBottom: 12 }}><label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Document / URL</label>
                      <input value={actionPanelData.lienExterne} onChange={e => setActionPanelData(prev => ({ ...prev, lienExterne: e.target.value }))} placeholder="https://... ou nom du document" style={{ ...sInput, fontSize: 12 }} /></div>
                    <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, cursor: "pointer" }}>
                      <input type="checkbox" checked={actionPanelData.options.confirmationRequise !== false} onChange={e => setActionPanelData(prev => ({ ...prev, options: { ...prev.options, confirmationRequise: e.target.checked } }))} style={{ accentColor: C.pink }} />
                      L'employé doit confirmer avoir lu le document
                    </label>
                  </>)}

                  {/* Rendez-vous */}
                  {actionPanelData.type === "rdv" && (<>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                      <div><label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Durée</label>
                        <input value={actionPanelData.dureeEstimee} onChange={e => setActionPanelData(prev => ({ ...prev, dureeEstimee: e.target.value }))} placeholder="30 min" style={{ ...sInput, fontSize: 12 }} /></div>
                      <div><label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Lieu / Lien visio</label>
                        <input value={actionPanelData.options.lieu || ""} onChange={e => setActionPanelData(prev => ({ ...prev, options: { ...prev.options, lieu: e.target.value } }))} placeholder="Salle A ou https://meet..." style={{ ...sInput, fontSize: 12 }} /></div>
                    </div>
                    <div><label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Participants suggérés</label>
                      <input value={actionPanelData.options.participants || ""} onChange={e => setActionPanelData(prev => ({ ...prev, options: { ...prev.options, participants: e.target.value } }))} placeholder="Manager, Buddy, HRBP..." style={{ ...sInput, fontSize: 12 }} /></div>
                  </>)}

                  {/* Message */}
                  {actionPanelData.type === "message" && (<>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                      <div><label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Canal</label>
                        <select value={actionPanelData.options.canal || "inapp"} onChange={e => setActionPanelData(prev => ({ ...prev, options: { ...prev.options, canal: e.target.value } }))} style={{ ...sInput, fontSize: 12, cursor: "pointer" }}>
                          <option value="inapp">In-app</option><option value="email">Email</option><option value="slack">Slack</option><option value="teams">Teams</option>
                        </select></div>
                      <div><label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Destinataires</label>
                        <input value={actionPanelData.options.destinataires || ""} onChange={e => setActionPanelData(prev => ({ ...prev, options: { ...prev.options, destinataires: e.target.value } }))} placeholder="Équipe, Manager..." style={{ ...sInput, fontSize: 12 }} /></div>
                    </div>
                    <div><label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Template de message</label>
                      <textarea value={actionPanelData.options.template || ""} onChange={e => setActionPanelData(prev => ({ ...prev, options: { ...prev.options, template: e.target.value } }))} placeholder="Bonjour, je suis {{prenom}}..." rows={3} style={{ ...sInput, fontSize: 12, resize: "vertical" }} /></div>
                  </>)}

                  {/* Entretien */}
                  {actionPanelData.type === "entretien" && (<>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                      <div><label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Durée</label>
                        <input value={actionPanelData.dureeEstimee} onChange={e => setActionPanelData(prev => ({ ...prev, dureeEstimee: e.target.value }))} placeholder="45 min" style={{ ...sInput, fontSize: 12 }} /></div>
                      <div><label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Participants</label>
                        <input value={actionPanelData.options.participants || ""} onChange={e => setActionPanelData(prev => ({ ...prev, options: { ...prev.options, participants: e.target.value } }))} placeholder="Manager, HRBP" style={{ ...sInput, fontSize: 12 }} /></div>
                    </div>
                    <div><label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Trame d'entretien</label>
                      {(actionPanelData.options.trame || []).map((q: string, i: number) => (
                        <div key={i} style={{ display: "flex", gap: 6, marginBottom: 4 }}>
                          <input value={q} onChange={e => { const arr = [...(actionPanelData.options.trame || [])]; arr[i] = e.target.value; setActionPanelData(prev => ({ ...prev, options: { ...prev.options, trame: arr } })); }} placeholder="Point à aborder" style={{ ...sInput, flex: 1, padding: "6px 10px", fontSize: 12 }} />
                          <button onClick={() => { const arr = (actionPanelData.options.trame || []).filter((_: any, j: number) => j !== i); setActionPanelData(prev => ({ ...prev, options: { ...prev.options, trame: arr } })); }} style={{ background: "none", border: "none", cursor: "pointer", color: C.red }}><X size={14} /></button>
                        </div>
                      ))}
                      <button onClick={() => setActionPanelData(prev => ({ ...prev, options: { ...prev.options, trame: [...(prev.options.trame || []), ""] } }))} style={{ fontSize: 11, color: C.pink, background: "none", border: "none", cursor: "pointer", fontWeight: 600, fontFamily: font, padding: "4px 0" }}>+ Ajouter un point</button>
                    </div>
                  </>)}

                  {/* Checklist IT */}
                  {actionPanelData.type === "checklist_it" && (<>
                    <div style={{ marginBottom: 12 }}>
                      <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Éléments à vérifier</label>
                      {(actionPanelData.options.items || []).map((it: string, i: number) => (
                        <div key={i} style={{ display: "flex", gap: 6, marginBottom: 4 }}>
                          <input value={it} onChange={e => { const arr = [...(actionPanelData.options.items || [])]; arr[i] = e.target.value; setActionPanelData(prev => ({ ...prev, options: { ...prev.options, items: arr } })); }} placeholder="Email, VPN, Badge..." style={{ ...sInput, flex: 1, padding: "6px 10px", fontSize: 12 }} />
                          <button onClick={() => { const arr = (actionPanelData.options.items || []).filter((_: any, j: number) => j !== i); setActionPanelData(prev => ({ ...prev, options: { ...prev.options, items: arr } })); }} style={{ background: "none", border: "none", cursor: "pointer", color: C.red }}><X size={14} /></button>
                        </div>
                      ))}
                      <button onClick={() => setActionPanelData(prev => ({ ...prev, options: { ...prev.options, items: [...(prev.options.items || []), ""] } }))} style={{ fontSize: 11, color: C.pink, background: "none", border: "none", cursor: "pointer", fontWeight: 600, fontFamily: font, padding: "4px 0" }}>+ Ajouter un élément</button>
                    </div>
                    <div><label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Responsable IT</label>
                      <input value={actionPanelData.options.responsableIT || ""} onChange={e => setActionPanelData(prev => ({ ...prev, options: { ...prev.options, responsableIT: e.target.value } }))} placeholder="Nom ou équipe" style={{ ...sInput, fontSize: 12 }} /></div>
                  </>)}

                  {/* Passation */}
                  {actionPanelData.type === "passation" && (<>
                    <div style={{ marginBottom: 12 }}>
                      <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Éléments à transférer</label>
                      {(actionPanelData.options.elements || []).map((el: string, i: number) => (
                        <div key={i} style={{ display: "flex", gap: 6, marginBottom: 4 }}>
                          <input value={el} onChange={e => { const arr = [...(actionPanelData.options.elements || [])]; arr[i] = e.target.value; setActionPanelData(prev => ({ ...prev, options: { ...prev.options, elements: arr } })); }} placeholder="Projet, Contact, Doc..." style={{ ...sInput, flex: 1, padding: "6px 10px", fontSize: 12 }} />
                          <button onClick={() => { const arr = (actionPanelData.options.elements || []).filter((_: any, j: number) => j !== i); setActionPanelData(prev => ({ ...prev, options: { ...prev.options, elements: arr } })); }} style={{ background: "none", border: "none", cursor: "pointer", color: C.red }}><X size={14} /></button>
                        </div>
                      ))}
                      <button onClick={() => setActionPanelData(prev => ({ ...prev, options: { ...prev.options, elements: [...(prev.options.elements || []), ""] } }))} style={{ fontSize: 11, color: C.pink, background: "none", border: "none", cursor: "pointer", fontWeight: 600, fontFamily: font, padding: "4px 0" }}>+ Ajouter un élément</button>
                    </div>
                    <div><label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Successeur</label>
                      <input value={actionPanelData.options.successeur || ""} onChange={e => setActionPanelData(prev => ({ ...prev, options: { ...prev.options, successeur: e.target.value } }))} placeholder="Nom du successeur" style={{ ...sInput, fontSize: 12 }} /></div>
                  </>)}

                  {/* Visite */}
                  {actionPanelData.type === "visite" && (<>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                      <div><label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Lieu</label>
                        <input value={actionPanelData.options.lieu || ""} onChange={e => setActionPanelData(prev => ({ ...prev, options: { ...prev.options, lieu: e.target.value } }))} placeholder="Bureaux, Usine..." style={{ ...sInput, fontSize: 12 }} /></div>
                      <div><label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Durée</label>
                        <input value={actionPanelData.dureeEstimee} onChange={e => setActionPanelData(prev => ({ ...prev, dureeEstimee: e.target.value }))} placeholder="1h" style={{ ...sInput, fontSize: 12 }} /></div>
                    </div>
                    <div><label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Guide / Accompagnateur</label>
                      <input value={actionPanelData.options.guide || ""} onChange={e => setActionPanelData(prev => ({ ...prev, options: { ...prev.options, guide: e.target.value } }))} placeholder="Buddy, Manager..." style={{ ...sInput, fontSize: 12 }} /></div>
                  </>)}
                </div>
                {/* Assignation section */}
                {actionPanelMode === "edit" && actionPanelData.id && (() => {
                  const items = assignMode === "groupe"
                    ? GROUPES.map(g => ({ id: g.nom, label: g.nom, sub: `${(g.membres || []).length} membres`, color: g.couleur }))
                    : COLLABORATEURS.map(c => ({ id: String(c.id), label: `${c.prenom} ${c.nom}`, sub: `${c.poste} · ${c.site}`, color: c.color }));
                  const filtered = items.filter(i => !assignSearch || i.label.toLowerCase().includes(assignSearch.toLowerCase()));
                  return (
                  <div style={{ padding: "16px", background: C.bg, borderRadius: 10, marginBottom: 20 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: C.text, marginBottom: 10 }}>Assigner cette action</div>

                    {/* Mode tabs */}
                    <div style={{ display: "flex", gap: 4, marginBottom: 12, background: C.white, borderRadius: 8, padding: 3, border: `1px solid ${C.border}` }}>
                      {([["tous", "Tous"], ["individuel", "Par employé"], ["groupe", "Par groupe"]] as const).map(([mode, label]) => (
                        <button key={mode} onClick={() => { setAssignMode(mode); setAssignSelected([]); setAssignSearch(""); }} style={{
                          flex: 1, padding: "7px 0", borderRadius: 6, fontSize: 12, fontWeight: assignMode === mode ? 600 : 400, border: "none", cursor: "pointer", fontFamily: font,
                          background: assignMode === mode ? C.pink : "transparent", color: assignMode === mode ? C.white : C.text, transition: "all .15s",
                        }}>{label}</button>
                      ))}
                    </div>

                    {/* Picklist */}
                    {assignMode !== "tous" && (
                      <div style={{ position: "relative", marginBottom: 12 }}>
                        {/* Selected tags */}
                        <div onClick={() => setAssignOpen(!assignOpen)} style={{
                          ...sInput, minHeight: 40, display: "flex", flexWrap: "wrap", gap: 4, alignItems: "center", cursor: "pointer", padding: "6px 10px",
                          borderColor: assignOpen ? C.pink : C.border, background: C.white,
                        }}>
                          {assignSelected.length === 0 && <span style={{ color: C.textMuted, fontSize: 13 }}>Sélectionner...</span>}
                          {assignSelected.map(id => {
                            const item = items.find(i => i.id === id);
                            return item ? (
                              <span key={id} style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 8px 2px 4px", borderRadius: 6, background: C.pinkBg, fontSize: 11, fontWeight: 500, color: C.pink }}>
                                <div style={{ width: 16, height: 16, borderRadius: "50%", background: item.color || C.pink, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 700, color: C.white }}>{item.label.split(" ").map(n => n[0]).join("").slice(0, 2)}</div>
                                {item.label}
                                <button onClick={e => { e.stopPropagation(); setAssignSelected(prev => prev.filter(x => x !== id)); }} style={{ background: "none", border: "none", cursor: "pointer", color: C.pink, padding: 0, lineHeight: 1 }}><X size={10} /></button>
                              </span>
                            ) : null;
                          })}
                          <ChevronRight size={14} color={C.textMuted} style={{ marginLeft: "auto", transform: assignOpen ? "rotate(270deg)" : "rotate(90deg)", transition: "transform .15s" }} />
                        </div>

                        {/* Dropdown */}
                        {assignOpen && (
                          <div style={{ position: "absolute", top: "100%", left: 0, right: 0, zIndex: 10, background: C.white, border: `1px solid ${C.border}`, borderRadius: 8, boxShadow: "0 8px 24px rgba(0,0,0,.1)", marginTop: 4, maxHeight: 250, display: "flex", flexDirection: "column" }}>
                            {/* Search */}
                            <div style={{ padding: "8px 10px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 6 }}>
                              <Search size={14} color={C.textLight} />
                              <input value={assignSearch} onChange={e => setAssignSearch(e.target.value)} placeholder="Rechercher..." autoFocus style={{ border: "none", outline: "none", flex: 1, fontSize: 13, fontFamily: font, color: C.text, background: "transparent" }} />
                            </div>
                            {/* Items */}
                            <div style={{ overflow: "auto", flex: 1 }}>
                              {filtered.length === 0 ? (
                                <div style={{ padding: "16px", textAlign: "center", fontSize: 12, color: C.textMuted }}>{t('misc.no_result')}</div>
                              ) : filtered.map(item => {
                                const checked = assignSelected.includes(item.id);
                                return (
                                  <div key={item.id} onClick={() => { setAssignSelected(prev => checked ? prev.filter(x => x !== item.id) : [...prev, item.id]); }}
                                    style={{ padding: "9px 12px", display: "flex", alignItems: "center", gap: 10, cursor: "pointer", background: checked ? C.pinkBg : "transparent", transition: "all .1s" }}
                                    onMouseEnter={e => { if (!checked) (e.currentTarget.style.background = C.bg); }} onMouseLeave={e => { if (!checked) (e.currentTarget.style.background = "transparent"); }}>
                                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: item.color || C.pink, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 600, color: C.white, flexShrink: 0 }}>
                                      {item.label.split(" ").map(n => n[0]).join("").slice(0, 2)}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                      <div style={{ fontSize: 13, fontWeight: checked ? 600 : 400, color: C.text }}>{item.label}</div>
                                      {item.sub && <div style={{ fontSize: 10, color: C.textMuted }}>{item.sub}</div>}
                                    </div>
                                    {checked && <CheckCircle size={16} color={C.pink} />}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Summary + button */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ fontSize: 11, color: C.textMuted }}>
                        {assignMode === "tous" ? `${COLLABORATEURS.length} collaborateurs` : `${assignSelected.length} sélectionné(s)`}
                      </div>
                      <button disabled={assignMode !== "tous" && assignSelected.length === 0} onClick={async () => {
                        try {
                          const res = await apiAssignActions([actionPanelData.id!], assignMode, assignSelected);
                          addToast_admin(res.message || "Actions assignées");
                          setAssignSelected([]); setAssignOpen(false);
                        } catch { addToast_admin("Erreur d'assignation"); }
                      }} className="iz-btn-pink" style={{ ...sBtn("pink"), fontSize: 12, padding: "8px 20px", opacity: assignMode !== "tous" && assignSelected.length === 0 ? 0.5 : 1 }}>
                        Assigner
                      </button>
                    </div>
                  </div>
                  );
                })()}
              </div>
              <div style={{ padding: "16px 28px", borderTop: `1px solid ${C.border}`, display: "flex", gap: 12, justifyContent: "space-between" }}>
                <div>
                  {actionPanelMode === "edit" && (
                    <button onClick={() => {
                      if (!actionPanelData.id) return;
                      const id = actionPanelData.id;
                      setConfirmDialog({ message: "Supprimer cette action ? Elle sera retirée de tous les parcours.", onConfirm: async () => {
                        try { await apiDeleteAction(id); addToast_admin("Action supprimée"); setActionPanelMode("closed"); refetchActions(); } catch { addToast_admin("Erreur lors de la suppression"); }
                        setConfirmDialog(null);
                      }});
                    }} style={{ ...sBtn("outline"), color: C.red, borderColor: C.red, fontSize: 13 }}>{t('common.delete')}</button>
                  )}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => setActionPanelMode("closed")} style={{ ...sBtn("outline"), fontSize: 13 }}>{t('common.cancel')}</button>
                  <button disabled={actionPanelLoading || !actionPanelData.titre.trim()} onClick={async () => {
                    setActionPanelLoading(true);
                    const actionTypeId = Object.keys(ACTION_TYPE_META).indexOf(actionPanelData.type) + 1 || 1;
                    const firstPhaseId = actionPanelData.phaseIds?.[0] || null;
                    const payload: Record<string, any> = {
                      titre: actionPanelData.titre.trim(),
                      action_type_id: actionTypeId,
                      phase_id: firstPhaseId,
                      delai_relatif: actionPanelData.delaiRelatif,
                      obligatoire: actionPanelData.obligatoire,
                      description: actionPanelData.description,
                    };
                    if (actionPanelData.lienExterne) payload.lien_externe = actionPanelData.lienExterne;
                    if (actionPanelData.dureeEstimee) payload.duree_estimee = actionPanelData.dureeEstimee;
                    if (Object.keys(actionPanelData.options).length > 0) payload.options = actionPanelData.options;
                    const tr = buildTranslationsPayload(); if (tr) payload.translations = tr;
                    try {
                      if (actionPanelMode === "create") {
                        await apiCreateAction(payload);
                        addToast_admin("Action créée avec succès");
                      } else {
                        await apiUpdateAction(actionPanelData.id!, payload);
                        addToast_admin("Action modifiée avec succès");
                      }
                      setActionPanelMode("closed");
                      refetchActions();
                    } catch { addToast_admin("Erreur lors de l'enregistrement"); }
                    finally { setActionPanelLoading(false); }
                  }} className="iz-btn-pink" style={{ ...sBtn("pink"), fontSize: 13, opacity: actionPanelLoading || !actionPanelData.titre.trim() ? 0.6 : 1 }}>
                    {actionPanelLoading ? "Enregistrement..." : actionPanelMode === "create" ? "Créer l'action" : "Enregistrer"}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
        {/* ── Confirm Dialog ──────────────────────────────────── */}
        {/* ── Subscription page (for non-editor tenants) ───── */}
        {adminPage === "admin_abonnement" && (() => {
          const reloadSub = () => {
            getMySubscription().then(res => { setTenantSubscriptions(res.subscriptions || []); setTenantActiveModules(res.active_modules || []); }).catch(() => {});
            if (plans.length === 0) getAvailablePlans().then(setPlans).catch(() => {});
          };
          if (plans.length === 0) getAvailablePlans().then(setPlans).catch(() => {});
          const activeSubs = tenantSubscriptions.filter(s => s.status === "active" || s.status === "trialing");
          const availablePlans = plans.length > 0 ? plans : saPlans;
          const currentOnboardingSub = activeSubs.filter((s: any) => s.plan?.slug !== "cooptation").sort((a: any, b: any) => (a.canceled_at ? 1 : 0) - (b.canceled_at ? 1 : 0))[0] || null;
          const currentCooptSub = activeSubs.find((s: any) => s.plan?.slug === "cooptation");
          const currentPlan = currentOnboardingSub?.plan;
          const MODULE_LABELS: Record<string, string> = { onboarding: "Onboarding", offboarding: "Offboarding", crossboarding: "Crossboarding", cooptation: "Cooptation", nps: "NPS", signature: "Signature", sso: "SSO", provisioning: "Provisionnement", api: "API", white_label: "White-label", gamification: "Gamification" };
          return (
          <div style={{ flex: 1, padding: "24px 32px", overflow: "auto" }}>
            {/* ═══ HEADER: Current plan ═══ */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, padding: "20px 24px", background: C.white, borderRadius: 12, border: `1px solid ${C.border}` }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                  <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>{currentPlan?.nom || "Aucun plan"}</h1>
                  {currentOnboardingSub && <span style={{ padding: "3px 10px", borderRadius: 6, fontSize: 10, fontWeight: 600, background: C.greenLight, color: C.green }}>Plan {currentOnboardingSub.billing_cycle === "yearly" ? "Annuel" : "Mensuel"}</span>}
                  {!currentOnboardingSub && <span style={{ padding: "3px 10px", borderRadius: 6, fontSize: 10, fontWeight: 600, background: C.amberLight, color: C.amber }}>Aucun abonnement</span>}
                </div>
                <div style={{ fontSize: 13, color: C.textLight }}>{currentPlan?.description || "Choisissez un plan pour activer votre espace"}</div>
                {currentOnboardingSub && <div style={{ fontSize: 12, color: C.textMuted, marginTop: 4 }}>{currentPlan?.prix_chf_mensuel} CHF/emp/mois · {activeSubs.length} abonnement{activeSubs.length > 1 ? "s" : ""} actif{activeSubs.length > 1 ? "s" : ""}</div>}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {currentOnboardingSub && !currentOnboardingSub.canceled_at && (
                  <button onClick={() => {
                    const endDate = currentOnboardingSub.current_period_end;
                    const daysLeft = endDate ? Math.max(0, Math.ceil((new Date(endDate).getTime() - new Date().getTime()) / (24 * 60 * 60 * 1000))) : 0;
                    showConfirm(
                      `Annuler votre plan ${currentPlan?.nom || "Onboarding"} ?\n\nVotre abonnement restera actif pendant encore ${daysLeft} jour${daysLeft > 1 ? "s" : ""} (jusqu'au ${fmtDate(endDate)}).\n\nAprès cette date, l'accès aux fonctionnalités sera bloqué.\n\nVous pourrez réactiver votre abonnement à tout moment.`,
                      async () => {
                        try {
                          const res = await cancelSubscription(currentOnboardingSub.id);
                          reloadSub();
                          addToast_admin(res.message || `Plan annulé — actif jusqu'au ${fmtDate(endDate)}`);
                        } catch { addToast_admin(t('toast.error')); }
                      }
                    );
                  }} className="iz-btn-outline" style={{ ...sBtn("outline"), fontSize: 12 }}>Annuler le plan</button>
                )}
                <button onClick={() => setSubView(subView === "change" ? "overview" : "change")} className="iz-btn-pink" style={{ ...sBtn("pink"), fontSize: 12 }}>{subView === "change" ? "Retour" : (currentOnboardingSub ? "Changer le plan" : "Souscrire maintenant")}</button>
              </div>
            </div>

            {/* ═══ VIEW: Change plan ═══ */}
            {subView === "change" && (() => {
              const onboardingPlans = availablePlans.filter(p => p.slug !== "cooptation").sort((a, b) => a.ordre - b.ordre);
              const cooptationPlan = availablePlans.find(p => p.slug === "cooptation");
              return (
              <div>
                {/* Plan selector + employee count */}
                {/* Trial banner */}
                {isInTrial && !hasActiveSub && (
                  <div style={{ padding: "14px 20px", background: C.blueLight, borderRadius: 10, marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <Sparkles size={18} color={C.blue} />
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: C.blue }}>Période d'essai gratuite — {Math.max(0, 14 - Math.floor((new Date().getTime() - new Date(trialStart!).getTime()) / (24 * 60 * 60 * 1000)))} jours restants</div>
                        <div style={{ fontSize: 11, color: C.textLight }}>Toutes les fonctionnalités sont accessibles pendant l'essai. Souscrivez avant la fin pour continuer.</div>
                      </div>
                    </div>
                    <button onClick={() => { setSubView("overview"); setAdminPage("admin_dashboard" as any); }} className="iz-btn-outline" style={{ ...sBtn("outline"), fontSize: 12, whiteSpace: "nowrap" }}>Passer et essayer gratuitement</button>
                  </div>
                )}
                {trialExpired && !hasActiveSub && (
                  <div style={{ padding: "14px 20px", background: C.redLight, borderRadius: 10, marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
                    <AlertTriangle size={18} color={C.red} />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: C.red }}>Période d'essai expirée</div>
                      <div style={{ fontSize: 11, color: C.textLight }}>Votre essai gratuit est terminé. Souscrivez un plan pour continuer à utiliser Illizeo.</div>
                    </div>
                  </div>
                )}
                <div style={{ display: "flex", gap: 24, marginBottom: 24 }}>
                  <div style={{ flex: 1 }}>
                    <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4, textAlign: "center" }}>Choisissez l'abonnement idéal pour votre entreprise</h2>
                    <p style={{ fontSize: 13, color: C.textMuted, textAlign: "center", marginBottom: 20 }}>Tous nos abonnements sont modulables. Min. 25 employés.</p>
                    <div style={{ display: "grid", gridTemplateColumns: `repeat(${onboardingPlans.length}, 1fr)`, gap: 16 }}>
                      {onboardingPlans.map(plan => {
                        const isCurrent = currentOnboardingSub?.plan_id === plan.id;
                        const isSelected = selectedPlanIds.includes(plan.id);
                        const monthlyPrice = Number(plan.prix_chf_mensuel);
                        const planModules = (plan.modules || []).filter(m => m.actif).map(m => m.module);
                        return (
                        <div key={plan.id} style={{ border: isCurrent ? `2px solid ${C.green}` : isSelected ? `2px solid ${C.pink}` : `1px solid ${C.border}`, borderRadius: 12, padding: "20px", cursor: "pointer", transition: "all .15s", background: isSelected ? C.pinkBg : C.white }}
                          onClick={() => { if (!isCurrent && plan.slug !== "enterprise") { setSelectedPlanIds(prev => prev.includes(plan.id) ? prev.filter(id => id !== plan.id) : [plan.id]); } }}>
                          {isCurrent && <div style={{ fontSize: 10, fontWeight: 700, color: C.green, marginBottom: 6 }}>PLAN ACTUEL</div>}
                          <h3 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 4px" }}>{plan.nom}</h3>
                          <div style={{ fontSize: 11, color: C.textLight, marginBottom: 10 }}>{plan.description}</div>
                          <div style={{ marginBottom: 8 }}><span style={{ fontSize: 24, fontWeight: 800 }}>CHF {monthlyPrice}</span> <span style={{ fontSize: 11, color: C.textMuted }}>/ Mois / Employé</span></div>
                          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                            {planModules.map(mod => <div key={mod} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: C.text }}><CheckCircle size={13} color={C.green} /> {MODULE_LABELS[mod]}</div>)}
                          </div>
                          {plan.slug !== "enterprise" && !isCurrent && (
                            <button onClick={e => { e.stopPropagation(); setSelectedPlanIds([plan.id]); }} className="iz-btn-pink" style={{ ...sBtn(isSelected ? "pink" : "outline"), width: "100%", marginTop: 14, fontSize: 12, padding: "8px 0" }}>{isSelected ? "Sélectionné" : "Sélectionner"}</button>
                          )}
                          {plan.slug === "enterprise" && <button onClick={e => { e.stopPropagation(); window.open("mailto:contact@illizeo.com?subject=Enterprise", "_blank"); }} style={{ ...sBtn("dark"), width: "100%", marginTop: 14, fontSize: 12, padding: "8px 0" }}>Contactez-nous</button>}
                        </div>
                        );
                      })}
                    </div>

                    {/* Cooptation add-on */}
                    {cooptationPlan && (
                      <div style={{ marginTop: 20, border: `1px solid ${C.border}`, borderRadius: 12, padding: "16px 20px", display: "flex", alignItems: "center", gap: 16, background: currentCooptSub ? C.greenLight + "40" : C.white }}>
                        <input type="checkbox" checked={!!currentCooptSub || selectedPlanIds.includes(cooptationPlan.id)} onChange={() => {
                          if (currentCooptSub) return;
                          setSelectedPlanIds(prev => prev.includes(cooptationPlan.id) ? prev.filter(id => id !== cooptationPlan.id) : [...prev, cooptationPlan.id]);
                        }} style={{ width: 18, height: 18, accentColor: C.pink, cursor: currentCooptSub ? "default" : "pointer" }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 14, fontWeight: 600 }}>{cooptationPlan.nom} {currentCooptSub && <span style={{ fontSize: 10, color: C.green, fontWeight: 600 }}>Actif</span>}</div>
                          <div style={{ fontSize: 11, color: C.textMuted }}>{cooptationPlan.description}</div>
                        </div>
                        <div style={{ fontSize: 14, fontWeight: 700 }}>CHF {cooptationPlan.prix_chf_mensuel} <span style={{ fontSize: 11, fontWeight: 400, color: C.textMuted }}>/ emp / mois</span></div>
                      </div>
                    )}
                  </div>

                  {/* Right sidebar: summary */}
                  <div style={{ width: 300, flexShrink: 0 }}>
                    <div style={{ border: `1px solid ${C.border}`, borderRadius: 12, padding: "20px", position: "sticky", top: 24 }}>
                      {/* Billing toggle */}
                      <div style={{ display: "flex", gap: 0, marginBottom: 16, background: C.bg, borderRadius: 8, padding: 3 }}>
                        {(["monthly", "yearly"] as const).map(b => (
                          <button key={b} onClick={() => setPricingBilling(b)} style={{ flex: 1, padding: "8px 0", borderRadius: 6, fontSize: 12, fontWeight: pricingBilling === b ? 600 : 400, border: "none", cursor: "pointer", fontFamily: font, background: pricingBilling === b ? C.pink : "transparent", color: pricingBilling === b ? C.white : C.textMuted }}>
                            {b === "monthly" ? "Mensuellement" : "Annuellement"}
                          </button>
                        ))}
                      </div>
                      {pricingBilling === "yearly" && <div style={{ fontSize: 10, color: C.green, fontWeight: 600, textAlign: "center", marginBottom: 12 }}>10% Réduction</div>}

                      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>1. Choisissez un abonnement</div>
                      <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 12 }}>
                        {selectedPlanIds.length > 0 ? selectedPlanIds.map(id => availablePlans.find(p => p.id === id)?.nom).join(" + ") : currentPlan?.nom || "Aucun"}
                      </div>

                      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>2. Sélectionnez vos employés</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                        <button onClick={() => setSubEmployeeCount(Math.max(25, subEmployeeCount - 5))} style={{ width: 32, height: 32, borderRadius: "50%", border: `1px solid ${C.border}`, background: C.white, cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                        <input type="number" value={subEmployeeCount} onChange={e => setSubEmployeeCount(Math.max(25, Number(e.target.value)))} style={{ width: 60, textAlign: "center", padding: "6px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 15, fontWeight: 700, fontFamily: font }} />
                        <button onClick={() => setSubEmployeeCount(subEmployeeCount + 5)} style={{ width: 32, height: 32, borderRadius: "50%", border: `1px solid ${C.border}`, background: C.white, cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                      </div>

                      {/* Payment method */}
                      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>3. Mode de paiement</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 }}>
                        {([
                          { id: "stripe" as const, label: "Payer par carte", desc: "Visa, Mastercard, SEPA via Stripe", icon: "💳" },
                          { id: "invoice" as const, label: "Payer par facture", desc: "Facture 30 jours, virement bancaire", icon: "📄" },
                        ]).map(pm => (
                          <button key={pm.id} onClick={() => setPaymentMethod(pm.id)} style={{
                            display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 8,
                            border: paymentMethod === pm.id ? `2px solid ${C.pink}` : `1px solid ${C.border}`,
                            background: paymentMethod === pm.id ? C.pinkBg : C.white,
                            cursor: "pointer", fontFamily: font, textAlign: "left", transition: "all .15s",
                          }}>
                            <span style={{ fontSize: 18 }}>{pm.icon}</span>
                            <div>
                              <div style={{ fontSize: 12, fontWeight: paymentMethod === pm.id ? 600 : 400, color: paymentMethod === pm.id ? C.pink : C.text }}>{pm.label}</div>
                              <div style={{ fontSize: 10, color: C.textMuted }}>{pm.desc}</div>
                            </div>
                          </button>
                        ))}
                      </div>

                      {selectedPlanIds.length > 0 && (
                        <button onClick={async () => {
                          for (const pid of selectedPlanIds) {
                            try { await subscribeToPlan(pid, pricingBilling, paymentMethod); } catch {}
                          }
                          reloadSub(); setSubView("overview"); setSelectedPlanIds([]);
                          addToast_admin(paymentMethod === "invoice" ? "Abonnement activé — facture envoyée" : "Abonnement activé — 14 jours d'essai gratuit");
                        }} className="iz-btn-pink" style={{ ...sBtn("pink"), width: "100%", padding: "12px 0", fontSize: 14, marginBottom: 16 }}>
                          {paymentMethod === "invoice" ? "Démarrer — Paiement par facture" : "Démarrer — Paiement par carte"}
                        </button>
                      )}

                      <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 14 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>Prix Total Estimatif</div>
                        <div style={{ fontSize: 24, fontWeight: 800 }}>
                          {(() => {
                            const total = selectedPlanIds.reduce((sum, id) => {
                              const p = availablePlans.find(pl => pl.id === id);
                              const price = Number(p?.prix_chf_mensuel || 0);
                              return sum + (pricingBilling === "yearly" ? price * 0.9 : price) * subEmployeeCount;
                            }, 0);
                            return `${Math.round(total * 100) / 100} CHF`;
                          })()}
                        </div>
                        <div style={{ fontSize: 11, color: C.textMuted }}>( {pricingBilling === "yearly" ? "Annuellement" : "Mensuellement"} )</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              );
            })()}

            {/* ═══ VIEW: Overview ═══ */}
            {subView === "overview" && (<>
              {/* Cancellation warning banner */}
              {currentOnboardingSub?.canceled_at && new Date(currentOnboardingSub.canceled_at) > new Date() && (() => {
                const endDate = currentOnboardingSub.canceled_at;
                const daysLeft = Math.max(0, Math.ceil((new Date(endDate).getTime() - new Date().getTime()) / (24 * 60 * 60 * 1000)));
                return (
                <div style={{ padding: "16px 20px", background: C.amberLight, borderRadius: 12, marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between", border: `1px solid ${C.amber}30` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <AlertTriangle size={20} color={C.amber} />
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>Votre plan {currentPlan?.nom} sera annulé dans {daysLeft} jour{daysLeft > 1 ? "s" : ""}</div>
                      <div style={{ fontSize: 12, color: C.textLight }}>Votre abonnement reste actif jusqu'au {fmtDate(endDate)}. Après cette date, l'accès aux fonctionnalités sera bloqué.</div>
                    </div>
                  </div>
                  <button onClick={async () => {
                    try {
                      await subscribeToPlan(currentOnboardingSub.plan_id, currentOnboardingSub.billing_cycle || "monthly", "stripe");
                      reloadSub();
                      addToast_admin("Abonnement réactivé !");
                    } catch { addToast_admin(t('toast.error')); }
                  }} className="iz-btn-pink" style={{ ...sBtn("pink"), fontSize: 12, whiteSpace: "nowrap" }}>{t('misc.reactivate')} mon abonnement</button>
                </div>
                );
              })()}

              {/* Metrics */}
              {currentOnboardingSub && (
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
                  {[
                    { label: "Modules actifs", value: `${tenantActiveModules.length} module${tenantActiveModules.length > 1 ? "s" : ""}`, max: "inclus dans votre plan" },
                    { label: "Signature électronique", value: signatureUsage ? `${signatureUsage.total} signature${signatureUsage.total > 1 ? "s" : ""} envoyée${signatureUsage.total > 1 ? "s" : ""}` : "Chargement...", max: signatureUsage ? `${signatureUsage.signed} signée${signatureUsage.signed > 1 ? "s" : ""} · ${signatureUsage.sent} en attente · ${signatureUsage.declined} refusée${signatureUsage.declined > 1 ? "s" : ""}` : "" },
                    { label: "Stockage", value: storageUsage ? `${storageUsage.used_formatted} sur ${storageUsage.max_formatted}` : "Chargement...", max: storageUsage ? `${storageUsage.percent} % utilisé · ${storageUsage.file_count} fichier${storageUsage.file_count > 1 ? "s" : ""} · DB: ${storageUsage.db_size}` : "" },
                  ].map((m, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 20px", border: `1px solid ${C.border}`, borderRadius: 8 }}>
                      <span style={{ fontSize: 13, color: C.text }}>{m.label}</span>
                      <span style={{ fontSize: 12, color: C.textMuted }}>{m.value} {m.max && `· ${m.max}`}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Abonnement et paiement */}
              <div style={{ border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden" }}>
                <div style={{ padding: "16px 24px", borderBottom: `1px solid ${C.border}` }}>
                  <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Abonnement et paiement</h2>
                </div>
                {/* Tabs */}
                <div style={{ display: "flex", gap: 0, borderBottom: `1px solid ${C.border}` }}>
                  {([
                    { id: "facturation" as const, label: "Informations de facturation" },
                    { id: "factures" as const, label: "Facturation" },
                    { id: "paiement" as const, label: "Méthode de paiement" },
                    { id: "protection" as const, label: "Informations sur la protection des données" },
                  ]).map(tab => (
                    <button key={tab.id} onClick={() => setSubTab(tab.id)} style={{ padding: "12px 20px", fontSize: 13, fontWeight: subTab === tab.id ? 600 : 400, color: subTab === tab.id ? C.blue : C.textLight, background: "none", border: "none", borderBottom: subTab === tab.id ? `2px solid ${C.blue}` : "2px solid transparent", cursor: "pointer", fontFamily: font, marginBottom: -1 }}>
                      {tab.label}
                    </button>
                  ))}
                </div>
                <div style={{ padding: "24px" }}>
                  {subTab === "facturation" && (
                    <div>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                        <h3 style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>Contact de facturation</h3>
                        <button className="iz-btn-outline" style={{ ...sBtn("outline"), fontSize: 11, padding: "4px 12px" }}>{t('common.edit')}</button>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: "8px 20px", fontSize: 13 }}>
                        <span style={{ color: C.textMuted }}>Prénom</span><span>{billingInfo.prenom || auth.user?.name?.split(" ")[0] || "—"}</span>
                        <span style={{ color: C.textMuted }}>Nom</span><span>{billingInfo.nom || auth.user?.name?.split(" ").slice(1).join(" ") || "—"}</span>
                        <span style={{ color: C.textMuted }}>E-mail</span><span>{billingInfo.email || auth.user?.email || "—"}</span>
                        <span style={{ color: C.textMuted }}>Téléphone</span><span>{billingInfo.telephone || "—"}</span>
                        <span style={{ color: C.textMuted }}>Pays</span><span>{billingInfo.pays}</span>
                      </div>
                      <div style={{ marginTop: 24, display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                        <h3 style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>Informations de facturation</h3>
                        <button className="iz-btn-outline" style={{ ...sBtn("outline"), fontSize: 11, padding: "4px 12px" }}>{t('common.edit')}</button>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: "8px 20px", fontSize: 13 }}>
                        <span style={{ color: C.textMuted }}>Entreprise</span><span>{billingInfo.company || "—"}</span>
                        <span style={{ color: C.textMuted }}>Numéro de TVA</span><span>{billingInfo.vat || "—"}</span>
                        <span style={{ color: C.textMuted }}>Rue</span><span>{billingInfo.rue || "—"}</span>
                        <span style={{ color: C.textMuted }}>Ville</span><span>{billingInfo.ville || "—"}</span>
                        <span style={{ color: C.textMuted }}>Code Postal</span><span>{billingInfo.code_postal || "—"}</span>
                      </div>
                    </div>
                  )}
                  {subTab === "factures" && (
                    <div>
                      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 40px", gap: 0, padding: "8px 0", borderBottom: `1px solid ${C.border}`, fontSize: 11, fontWeight: 600, color: C.textLight }}>
                        <span>Facture</span><span>Statut</span><span>Date</span><span>Montant</span><span></span>
                      </div>
                      {activeSubs.length === 0 && <div style={{ padding: "30px 0", textAlign: "center", color: C.textMuted, fontSize: 13 }}>Aucune facture</div>}
                      {activeSubs.map((sub: any, i: number) => (
                        <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 40px", gap: 0, padding: "12px 0", borderBottom: `1px solid ${C.border}`, alignItems: "center", fontSize: 13 }}>
                          <span style={{ color: C.blue, fontWeight: 500 }}>#INV{String(sub.id).padStart(7, "0")}</span>
                          <span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 600, background: C.greenLight, color: C.green, justifySelf: "start" }}>{sub.status === "trialing" ? "Essai" : "Payée"}</span>
                          <span style={{ color: C.textMuted }}>{fmtDate(sub.current_period_start)}</span>
                          <span style={{ fontWeight: 600 }}>{Number(sub.plan?.prix_chf_mensuel || 0) * 25} CHF</span>
                          <button style={{ background: "none", border: "none", cursor: "pointer", color: C.textMuted }}><MoreHorizontal size={16} /></button>
                        </div>
                      ))}
                    </div>
                  )}
                  {subTab === "paiement" && (
                    <div>
                      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
                        <button className="iz-btn-pink" style={{ ...sBtn("pink"), fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}><Plus size={14} /> Ajouter</button>
                      </div>
                      <div style={{ padding: "30px 0", textAlign: "center", color: C.textMuted, fontSize: 13 }}>
                        Aucune méthode de paiement enregistrée.<br />
                        <span style={{ fontSize: 12 }}>Ajoutez une carte bancaire pour activer le paiement automatique via Stripe.</span>
                      </div>
                    </div>
                  )}
                  {subTab === "protection" && (
                    <div>
                      <p style={{ fontSize: 13, color: C.textLight, marginBottom: 16 }}>Comment Illizeo traite vos données et encadre ses engagements contractuels</p>
                      {[
                        { title: "Annexe relative au traitement des données personnelles", desc: "Toutes les suggestions que nous recevons sont étudiées avec attention par notre équipe produit." },
                        { title: "Mesures de sécurité techniques et organisationnelles (MTO)", desc: "Détail des mesures techniques et organisationnelles mises en œuvre pour protéger vos données." },
                        { title: "Qui peut donner des instructions à Illizeo ?", desc: "Liste des personnes autorisées à donner des instructions concernant le traitement des données." },
                        { title: "Sous-traitants", desc: "Liste des sous-traitants impliqués dans le traitement de vos données." },
                      ].map((item, i) => (
                        <div key={i} style={{ border: `1px solid ${C.border}`, borderRadius: 10, padding: "16px 20px", marginBottom: 8, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }} className="iz-sidebar-item">
                          <div>
                            <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{item.title}</div>
                            <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>{item.desc}</div>
                          </div>
                          <ChevronRight size={18} color={C.textMuted} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Gérer les apps */}
              <div style={{ marginTop: 24 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Gérer les apps</h2>
                  <button onClick={() => setSubView("change")} className="iz-btn-pink" style={{ ...sBtn("pink"), fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}><Plus size={14} /> Ajouter app</button>
                </div>
                {tenantActiveModules.length === 0 ? (
                  <div style={{ padding: "30px 0", textAlign: "center", color: C.textMuted, fontSize: 13 }}>Aucune app active. Souscrivez à un plan pour activer des modules.</div>
                ) : tenantActiveModules.map(mod => {
                  const isCooptMod = mod === "cooptation";
                  const cooptSub = isCooptMod ? activeSubs.find((s: any) => s.plan?.slug === "cooptation") : null;
                  const isScheduledCancel = cooptSub?.canceled_at && new Date(cooptSub.canceled_at) > new Date();
                  return (
                  <div key={mod} style={{ border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 20px", marginBottom: 8, display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: C.greenLight, display: "flex", alignItems: "center", justifyContent: "center" }}><CheckCircle size={18} color={C.green} /></div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{MODULE_LABELS[mod] || mod} <span style={{ fontSize: 10, color: C.green, fontWeight: 600 }}>Actif</span></div>
                      <div style={{ fontSize: 11, color: C.textMuted }}>
                        {isScheduledCancel ? `Désactivation prévue le ${fmtDate(cooptSub.canceled_at)}` : "Inclus dans votre plan"}
                      </div>
                    </div>
                    {isCooptMod && cooptSub && !isScheduledCancel && (
                      <button onClick={() => showConfirm("{t('misc.disable')} le module Cooptation ? La désactivation prendra effet à la fin de votre période de facturation en cours.", async () => {
                        try {
                          const res = await cancelSubscription(cooptSub.id);
                          reloadSub();
                          addToast_admin(res.message || "Cooptation désactivée en fin de période");
                        } catch { addToast_admin(t('toast.error')); }
                      })} style={{ ...sBtn("outline"), fontSize: 11, color: C.red, borderColor: C.red, padding: "5px 12px", whiteSpace: "nowrap" }}>{t('misc.disable')}</button>
                    )}
                    {isScheduledCancel && (
                      <span style={{ padding: "3px 10px", borderRadius: 6, fontSize: 10, fontWeight: 600, background: C.amberLight, color: C.amber, whiteSpace: "nowrap" }}>Fin le {fmtDate(cooptSub.canceled_at)}</span>
                    )}
                  </div>
                  );
                })}
              </div>
            </>)}
          </div>
          );
        })()}

        {confirmDialog && (
          <div className="iz-overlay" style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000 }}>
            <div className="iz-modal" style={{ background: C.white, borderRadius: 16, width: 420, padding: "32px 28px", textAlign: "center" }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: C.redLight, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                <AlertTriangle size={24} color={C.red} />
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 600, margin: "0 0 8px", color: C.dark }}>Confirmation</h3>
              <p style={{ fontSize: 14, color: C.textLight, margin: "0 0 24px", lineHeight: 1.5 }}>{confirmDialog.message}</p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                <button onClick={() => setConfirmDialog(null)} style={{ ...sBtn("outline"), padding: "10px 24px" }}>{t('common.cancel')}</button>
                <button onClick={async () => { await confirmDialog.onConfirm(); setConfirmDialog(null); }} style={{ ...sBtn("pink"), padding: "10px 24px", background: C.red }}>Confirmer</button>
              </div>
            </div>
          </div>
        )}
        {adminPage === "admin_fields" && (
          <div style={{ flex: 1, padding: "24px 32px", overflow: "auto" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <div>
                <h1 style={{ fontSize: 22, fontWeight: 600, margin: 0 }}>{t('fields.title')}</h1>
                <p style={{ fontSize: 12, color: C.textLight, margin: "4px 0 0" }}>Activez, désactivez ou ajoutez des champs personnalisés</p>
              </div>
            </div>
            {/* Add custom field */}
            <div className="iz-card" style={{ ...sCard, marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 10 }}>{t('fields.add')} un champ personnalisé</div>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 10, marginBottom: 10 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: C.text, display: "block", marginBottom: 4 }}>{t('fields.field_name')}</label>
                  <input id="new-field-label" placeholder="Ex: Permis de conduire" style={{ ...sInput, fontSize: 12 }} />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: C.text, display: "block", marginBottom: 4 }}>{t('fields.type')}</label>
                  <select id="new-field-type" style={{ ...sInput, fontSize: 12, cursor: "pointer" }}>
                    <option value="text">Texte</option>
                    <option value="number">Nombre</option>
                    <option value="date">Date</option>
                    <option value="list">Liste</option>
                    <option value="boolean">Oui/Non</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: C.text, display: "block", marginBottom: 4 }}>{t('fields.section')}</label>
                  <select id="new-field-section" style={{ ...sInput, fontSize: 12, cursor: "pointer" }}>
                    <option value="personal">{t('fields.personal')}</option>
                    <option value="contract">{t('fields.contract')}</option>
                    <option value="job">Job Information</option>
                    <option value="position">Position Information</option>
                    <option value="org">{t('fields.org')}</option>
                  </select>
                </div>
              </div>
              <div style={{ display: "flex", gap: 10, alignItems: "end" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 11, fontWeight: 600, color: C.text, display: "block", marginBottom: 4 }}>Valeurs (pour type Liste, séparées par des virgules)</label>
                  <input id="new-field-values" placeholder="Ex: Oui, Non, En cours" style={{ ...sInput, fontSize: 12 }} />
                </div>
                <button onClick={async () => {
                  const labelEl = document.getElementById("new-field-label") as HTMLInputElement;
                  const typeEl = document.getElementById("new-field-type") as HTMLSelectElement;
                  const sectionEl = document.getElementById("new-field-section") as HTMLSelectElement;
                  const valuesEl = document.getElementById("new-field-values") as HTMLInputElement;
                  const label = labelEl?.value?.trim();
                  if (!label) return;
                  const key = label.toLowerCase().replace(/[^a-z0-9]/g, "_").replace(/_+/g, "_");
                  const fieldType = typeEl?.value || "text";
                  const listValues = fieldType === "list" && valuesEl?.value ? valuesEl.value.split(",").map(v => v.trim()).filter(Boolean) : undefined;
                  try {
                    const created = await apiCreateFieldConfig({ field_key: key, label, section: sectionEl?.value || "personal", field_type: fieldType, list_values: listValues } as any);
                    setFieldConfig(prev => [...prev, created]);
                    labelEl.value = ""; valuesEl.value = "";
                    addToast_admin(`Champ "${label}" créé`);
                  } catch { addToast_admin("Erreur — le champ existe peut-être déjà"); }
                }} className="iz-btn-pink" style={{ ...sBtn("pink"), fontSize: 12, padding: "8px 20px", whiteSpace: "nowrap" }}>
                  <Plus size={14} style={{ marginRight: 4 }} /> {t('fields.add')}
                </button>
              </div>
            </div>
            {[
              { key: "personal", label: "Informations personnelles", icon: Users, color: "#C2185B" },
              { key: "contract", label: "Informations contractuelles", icon: FileSignature, color: "#1A73E8" },
              { key: "job", label: "Job Information", icon: ClipboardList, color: "#E65100" },
              { key: "position", label: "Position Information", icon: Navigation, color: "#00897B" },
              { key: "org", label: "Informations organisationnelles", icon: Building2, color: "#7B5EA7" },
            ].map(section => (
              <div key={section.key} style={{ marginBottom: 24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 6, background: `${section.color}15`, display: "flex", alignItems: "center", justifyContent: "center" }}><section.icon size={14} color={section.color} /></div>
                  <h2 style={{ fontSize: 14, fontWeight: 600, color: C.text, margin: 0 }}>{section.label}</h2>
                </div>
                <div className="iz-card" style={{ ...sCard, padding: 0, overflow: "hidden" }}>
                  {fieldConfig.filter(f => f.section === section.key).map((fc, i, arr) => (
                    <div key={fc.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 16px", borderBottom: i < arr.length - 1 ? `1px solid ${C.border}` : "none" }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ fontSize: 13, fontWeight: 500 }}>{lang === "en" && fc.label_en ? fc.label_en : fc.label}</span>
                          <span style={{ fontSize: 9, padding: "1px 5px", borderRadius: 3, background: C.bg, color: C.textMuted, fontWeight: 600 }}>{fc.field_type || "text"}</span>
                          {fc.field_type === "list" && fc.list_values?.length > 0 && <span style={{ fontSize: 9, color: C.textMuted }}>({fc.list_values.join(", ")})</span>}
                        </div>
                        <div style={{ fontSize: 10, color: C.textMuted }}>{fc.field_key}{fc.label_en ? ` · EN: ${fc.label_en}` : ""}</div>
                      </div>
                      <button onClick={() => { setTranslateFieldId(fc.id); setTranslateEN(fc.label_en || ""); }} style={{ background: "none", border: "none", cursor: "pointer", color: C.blue, padding: 2 }} title="Traduire"><Globe size={14} /></button>
                      <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: C.textLight, cursor: "pointer" }}>
                        <input type="checkbox" checked={fc.obligatoire} onChange={async () => {
                          await apiUpdateFieldConfig(fc.id, { obligatoire: !fc.obligatoire });
                          setFieldConfig(prev => prev.map(f => f.id === fc.id ? { ...f, obligatoire: !f.obligatoire } : f));
                          addToast_admin(`${fc.label} : ${!fc.obligatoire ? "obligatoire" : "optionnel"}`);
                        }} style={{ accentColor: C.red }} />
                        Obligatoire
                      </label>
                      <div onClick={async () => {
                        await apiUpdateFieldConfig(fc.id, { actif: !fc.actif });
                        setFieldConfig(prev => prev.map(f => f.id === fc.id ? { ...f, actif: !f.actif } : f));
                        addToast_admin(`${fc.label} : ${!fc.actif ? "activé" : "désactivé"}`);
                      }} style={{ width: 40, height: 22, borderRadius: 11, background: fc.actif ? C.green : C.border, cursor: "pointer", position: "relative", transition: "all .2s", flexShrink: 0 }}>
                        <div style={{ width: 18, height: 18, borderRadius: "50%", background: C.white, position: "absolute", top: 2, left: fc.actif ? 20 : 2, transition: "all .2s", boxShadow: "0 1px 3px rgba(0,0,0,.2)" }} />
                      </div>
                      {fc.field_key.startsWith("custom_") && (
                        <button onClick={() => {
                          setConfirmDialog({ message: `Supprimer le champ "${fc.label}" ?`, onConfirm: async () => {
                            try { await apiDeleteFieldConfig(fc.id); setFieldConfig(prev => prev.filter(f => f.id !== fc.id)); addToast_admin(`Champ "${fc.label}" supprimé`); } catch { addToast_admin(t('toast.error')); }
                            setConfirmDialog(null);
                          }});
                        }} style={{ background: "none", border: "none", cursor: "pointer", color: C.textMuted, padding: 2 }}><X size={14} /></button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        {adminPage === "admin_apparence" && (() => {
          const THEME_PRESETS = [
            { name: "Illizeo Pink", color: "#C2185B" },
            { name: "Ocean Blue", color: "#1A73E8" },
            { name: "Forest Green", color: "#2E7D32" },
            { name: "Royal Purple", color: "#7B5EA7" },
            { name: "Sunset Orange", color: "#E65100" },
            { name: "Slate Dark", color: "#37474F" },
            { name: "Crimson Red", color: "#C62828" },
            { name: "Teal", color: "#00897B" },
          ];
          const REGIONS = [
            { code: "CH", label: "Suisse", flag: "🇨🇭", currency: "CHF" },
            { code: "FR", label: "France", flag: "🇫🇷", currency: "EUR" },
            { code: "BE", label: "Belgique", flag: "🇧🇪", currency: "EUR" },
            { code: "LU", label: "Luxembourg", flag: "🇱🇺", currency: "EUR" },
            { code: "CA", label: "Canada", flag: "🇨🇦", currency: "CAD" },
            { code: "US", label: "États-Unis", flag: "🇺🇸", currency: "USD" },
            { code: "GB", label: "Royaume-Uni", flag: "🇬🇧", currency: "GBP" },
            { code: "DE", label: "Allemagne", flag: "🇩🇪", currency: "EUR" },
          ];
          const TIMEZONES = [
            "Europe/Zurich", "Europe/Paris", "Europe/Brussels", "Europe/Luxembourg",
            "Europe/London", "Europe/Berlin", "America/Montreal", "America/New_York",
            "America/Los_Angeles", "Asia/Tokyo", "Australia/Sydney",
          ];
          const sSection = { marginBottom: 32 } as const;
          const sSectionTitle = { fontSize: 16, fontWeight: 600, color: C.text, margin: "0 0 4px", display: "flex", alignItems: "center", gap: 8 } as const;
          const sSectionDesc = { fontSize: 12, color: C.textMuted, margin: "0 0 16px" } as const;

          const saveTheme = (color: string) => {
            saveSetting("theme_color", color, setThemeColor);
            addToast_admin("Couleur du thème enregistrée");
          };

          return (
          <div style={{ flex: 1, padding: "24px 32px", overflow: "auto", maxWidth: 800 }}>
            <h1 style={{ fontSize: 22, fontWeight: 600, margin: "0 0 8px" }}>{t('admin.appearance')}</h1>
            <p style={{ fontSize: 13, color: C.textMuted, margin: "0 0 28px" }}>Personnalisez l'apparence de votre espace.</p>

            {/* ── Logo ──────────────────────────────────────── */}
            <div style={sSection}>
              <h2 style={sSectionTitle}><Building2 size={18} color={C.blue} /> Logo de l'entreprise</h2>
              <p style={sSectionDesc}>Remplacez le logo Illizeo par celui de votre entreprise. Il apparaîtra dans la sidebar, la page de connexion et les emails.</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                {/* Icône (carré) */}
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 8 }}>Icône (carré)</label>
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{ width: 64, height: 64, borderRadius: 12, border: `2px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", background: C.bg }}>
                      <img src={customLogo || ILLIZEO_LOGO_URI} alt="Logo" style={{ width: 48, height: 48, objectFit: "contain" }} />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      <label style={{ cursor: "pointer" }}>
                        <input type="file" accept="image/*" style={{ display: "none" }} onChange={e => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onload = () => { const url = reader.result as string; saveSetting("custom_logo", url, setCustomLogo); addToast_admin("Icône mise à jour"); };
                          reader.readAsDataURL(file);
                        }} />
                        <span className="iz-btn-outline" style={{ ...sBtn("outline"), padding: "6px 14px", fontSize: 11, display: "inline-flex", alignItems: "center", gap: 4 }}><Upload size={12} /> Changer</span>
                      </label>
                      {customLogo && <button onClick={() => { saveSetting("custom_logo", "", setCustomLogo); addToast_admin("Icône réinitialisée"); }} style={{ background: "none", border: "none", color: C.red, fontSize: 11, cursor: "pointer", padding: 0, textAlign: "left" }}>Réinitialiser</button>}
                    </div>
                  </div>
                  <div style={{ fontSize: 10, color: C.textMuted, marginTop: 6 }}>PNG ou SVG, 128×128px recommandé</div>
                </div>
                {/* Logo complet (horizontal) */}
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 8 }}>Logo complet (horizontal)</label>
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{ width: 180, height: 64, borderRadius: 12, border: `2px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", background: C.bg, padding: "0 12px" }}>
                      <img src={customLogoFull || ILLIZEO_FULL_LOGO_URI} alt="Logo" style={{ height: 32, objectFit: "contain", maxWidth: "100%" }} />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      <label style={{ cursor: "pointer" }}>
                        <input type="file" accept="image/*" style={{ display: "none" }} onChange={e => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onload = () => { const url = reader.result as string; saveSetting("custom_logo_full", url, setCustomLogoFull); addToast_admin("Logo mis à jour"); };
                          reader.readAsDataURL(file);
                        }} />
                        <span className="iz-btn-outline" style={{ ...sBtn("outline"), padding: "6px 14px", fontSize: 11, display: "inline-flex", alignItems: "center", gap: 4 }}><Upload size={12} /> Changer</span>
                      </label>
                      {customLogoFull && <button onClick={() => { saveSetting("custom_logo_full", "", setCustomLogoFull); addToast_admin("Logo réinitialisé"); }} style={{ background: "none", border: "none", color: C.red, fontSize: 11, cursor: "pointer", padding: 0, textAlign: "left" }}>Réinitialiser</button>}
                    </div>
                  </div>
                  <div style={{ fontSize: 10, color: C.textMuted, marginTop: 6 }}>PNG ou SVG, 400×100px recommandé</div>
                </div>
              </div>
              {/* Preview */}
              <div style={{ marginTop: 16, padding: "16px 20px", borderRadius: 10, background: C.bg }}>
                <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 8 }}>Aperçu sidebar :</div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, background: C.white, padding: "12px 16px", borderRadius: 10, border: `1px solid ${C.border}`, width: "fit-content" }}>
                  <img src={customLogo || ILLIZEO_LOGO_URI} alt="" style={{ width: 28, height: 28, objectFit: "contain" }} />
                  <img src={customLogoFull || ILLIZEO_FULL_LOGO_URI} alt="" style={{ height: 22, objectFit: "contain" }} />
                </div>
              </div>
            </div>

            {/* ── Favicon ──────────────────────────────────── */}
            <div style={sSection}>
              <h2 style={sSectionTitle}><Globe size={18} color="#7B5EA7" /> Favicon</h2>
              <p style={sSectionDesc}>L'icône qui apparaît dans l'onglet du navigateur. Format carré recommandé (32×32 ou 64×64px).</p>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: 10, border: `2px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", background: C.bg }}>
                  <img src={customFavicon || ILLIZEO_LOGO_URI} alt="Favicon" style={{ width: 32, height: 32, objectFit: "contain" }} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <label style={{ cursor: "pointer" }}>
                    <input type="file" accept="image/*" style={{ display: "none" }} onChange={e => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = () => { const url = reader.result as string; saveSetting("custom_favicon", url, setCustomFavicon); addToast_admin("Favicon mis à jour"); };
                      reader.readAsDataURL(file);
                    }} />
                    <span className="iz-btn-outline" style={{ ...sBtn("outline"), padding: "6px 14px", fontSize: 11, display: "inline-flex", alignItems: "center", gap: 4 }}><Upload size={12} /> Changer</span>
                  </label>
                  {customFavicon && <button onClick={() => { saveSetting("custom_favicon", "", setCustomFavicon); addToast_admin("Favicon réinitialisé"); }} style={{ background: "none", border: "none", color: C.red, fontSize: 11, cursor: "pointer", padding: 0, textAlign: "left" }}>Réinitialiser</button>}
                </div>
                <div style={{ fontSize: 10, color: C.textMuted }}>PNG, SVG ou ICO — 32×32px recommandé</div>
              </div>
            </div>

            {/* ── Fond page de connexion ─────────────────────── */}
            <div style={sSection}>
              <h2 style={sSectionTitle}><Clapperboard size={18} color={C.pink} /> Fond de la page de connexion</h2>
              <p style={sSectionDesc}>Personnalisez l'arrière-plan derrière la modale de connexion. Si aucune image n'est définie, un dégradé aux couleurs du thème sera utilisé.</p>
              <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
                <div style={{ width: 240, height: 140, borderRadius: 12, border: `2px solid ${C.border}`, overflow: "hidden", background: loginBgImage ? `url(${loginBgImage}) center/cover no-repeat` : `linear-gradient(135deg, ${C.dark} 0%, #2D1B3D 50%, ${C.pink} 100%)`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", flexShrink: 0 }}>
                  <div style={{ width: 80, background: "rgba(255,255,255,.9)", borderRadius: 8, padding: "8px", textAlign: "center" }}>
                    <div style={{ fontSize: 7, fontWeight: 700, color: C.dark }}>Connexion</div>
                    <div style={{ width: "100%", height: 4, borderRadius: 2, background: C.bg, margin: "3px 0" }} />
                    <div style={{ width: "100%", height: 4, borderRadius: 2, background: C.bg, marginBottom: 3 }} />
                    <div style={{ width: "100%", height: 8, borderRadius: 3, background: C.pink }} />
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <label style={{ cursor: "pointer" }}>
                    <input type="file" accept="image/*" style={{ display: "none" }} onChange={e => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      if (file.size > 5 * 1024 * 1024) { addToast_admin("Image trop lourde (max 5 Mo)"); return; }
                      const reader = new FileReader();
                      reader.onload = () => { const url = reader.result as string; saveSetting("login_bg_image", url, setLoginBgImage); addToast_admin("Fond de connexion mis à jour"); };
                      reader.readAsDataURL(file);
                    }} />
                    <span className="iz-btn-pink" style={{ ...sBtn("pink"), padding: "8px 18px", fontSize: 12, display: "inline-flex", alignItems: "center", gap: 6 }}><Upload size={13} /> Choisir une image</span>
                  </label>
                  {loginBgImage && <button onClick={() => { saveSetting("login_bg_image", "", setLoginBgImage); addToast_admin("Fond réinitialisé (dégradé par défaut)"); }} style={{ ...sBtn("outline"), padding: "6px 14px", fontSize: 11, color: C.red, borderColor: C.red }}>Réinitialiser</button>}
                  <div style={{ fontSize: 10, color: C.textMuted, lineHeight: 1.5, maxWidth: 200 }}>JPG ou PNG, résolution recommandée 1920×1080. L'image sera affichée en plein écran derrière la modale de connexion.</div>
                </div>
              </div>
            </div>

            {/* ── Langues ────────────────────────────────────── */}
            <div style={sSection}>
              <h2 style={sSectionTitle}><Moon size={18} color={darkMode ? C.amber : C.textMuted} /> Mode sombre</h2>
              <p style={sSectionDesc}>Activez le mode sombre pour réduire la fatigue oculaire dans les environnements peu éclairés.</p>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
                <div onClick={toggleDarkMode} style={{ width: 52, height: 28, borderRadius: 14, background: darkMode ? C.pink : C.border, cursor: "pointer", position: "relative", transition: "all .2s" }}>
                  <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#fff", position: "absolute", top: 2, left: darkMode ? 26 : 2, transition: "all .2s", boxShadow: "0 1px 3px rgba(0,0,0,.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {darkMode ? <Moon size={12} color={C.pink} /> : <Sun size={12} color={C.amber} />}
                  </div>
                </div>
                <span style={{ fontSize: 13, fontWeight: 500, color: C.text }}>{darkMode ? "Mode sombre activé" : "Mode clair"}</span>
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <div style={{ flex: 1, padding: 16, borderRadius: 10, background: "#fff", border: `2px solid ${!darkMode ? C.pink : C.border}`, cursor: "pointer", textAlign: "center" }} onClick={() => { if (darkMode) toggleDarkMode(); }}>
                  <Sun size={20} color="#F9A825" style={{ marginBottom: 4 }} />
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#333" }}>Clair</div>
                </div>
                <div style={{ flex: 1, padding: 16, borderRadius: 10, background: "#1E1E32", border: `2px solid ${darkMode ? C.pink : "#2A2A3D"}`, cursor: "pointer", textAlign: "center" }} onClick={() => { if (!darkMode) toggleDarkMode(); }}>
                  <Moon size={20} color="#E91E8C" style={{ marginBottom: 4 }} />
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#E8E8EE" }}>Sombre</div>
                </div>
              </div>
            </div>

            {/* ── Langues ────────────────────────────────────── */}
            <div style={sSection}>
              <h2 style={sSectionTitle}><Languages size={18} color={C.blue} /> {t('settings.languages')}</h2>
              <p style={sSectionDesc}>{t('settings.languages_desc')}</p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
                {getAllLangs().map(l => {
                  const meta = LANG_META[l];
                  const isActive = activeLanguages.includes(l);
                  return (
                    <button key={l} onClick={() => {
                      if (l === "fr") return; // FR always active
                      const updated = isActive ? activeLanguages.filter(x => x !== l) : [...activeLanguages, l];
                      setActiveLanguages(updated);
                      localStorage.setItem("illizeo_active_languages", JSON.stringify(updated));
                      updateCompanySettings({ active_languages: JSON.stringify(updated) }).catch(() => {});
                      addToast_admin(`${meta.label} ${isActive ? "désactivé" : "activé"}`);
                    }} style={{
                      display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", borderRadius: 10,
                      border: `2px solid ${isActive ? C.pink : C.border}`, background: isActive ? C.pinkBg : C.white,
                      cursor: l === "fr" ? "default" : "pointer", fontFamily: font, fontSize: 13, fontWeight: isActive ? 600 : 400,
                      color: isActive ? C.pink : C.textMuted, transition: "all .15s", opacity: l === "fr" ? 1 : undefined,
                    }}>
                      <span style={{ fontSize: 20 }}>{meta.flag}</span>
                      <span>{meta.nativeName}</span>
                      {isActive && <CheckCircle size={14} color={C.pink} />}
                      {l === "fr" && <span style={{ fontSize: 9, padding: "1px 6px", borderRadius: 4, background: C.bg, color: C.textMuted }}>par défaut</span>}
                    </button>
                  );
                })}
              </div>
              <div style={{ fontSize: 11, color: C.textMuted }}>Le français est toujours actif. Les collaborateurs pourront choisir parmi les langues activées.</div>
            </div>

            {/* ── Thème couleur ──────────────────────────────── */}
            <div style={sSection}>
              <h2 style={sSectionTitle}><Palette size={18} color={themeColor} /> Couleur du thème</h2>
              <p style={sSectionDesc}>Choisissez la couleur principale de votre interface. Elle s'applique aux boutons, liens et accents.</p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
                {THEME_PRESETS.map(p => (
                  <button key={p.color} onClick={() => saveTheme(p.color)} title={p.name} style={{
                    width: 44, height: 44, borderRadius: 12, background: p.color, border: themeColor === p.color ? `3px solid ${C.text}` : "3px solid transparent",
                    cursor: "pointer", position: "relative", transition: "all .15s", boxShadow: themeColor === p.color ? "0 2px 8px rgba(0,0,0,.2)" : "none",
                  }}>
                    {themeColor === p.color && <Check size={18} color="#fff" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} />}
                  </button>
                ))}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <label style={{ fontSize: 12, color: C.textLight }}>Couleur personnalisée :</label>
                <input type="color" value={themeColor} onChange={e => saveTheme(e.target.value)} style={{ width: 36, height: 36, border: "none", borderRadius: 8, cursor: "pointer", padding: 0, background: "none" }} />
                <span style={{ fontSize: 12, fontFamily: "monospace", color: C.textMuted, background: C.bg, padding: "4px 10px", borderRadius: 6 }}>{themeColor.toUpperCase()}</span>
              </div>
              <div style={{ marginTop: 12, padding: "12px 16px", borderRadius: 10, background: C.bg, display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 12, color: C.textLight }}>Aperçu :</span>
                <button style={{ padding: "6px 16px", borderRadius: 8, background: themeColor, color: "#fff", border: "none", fontSize: 12, fontWeight: 600, fontFamily: font, cursor: "default" }}>Bouton principal</button>
                <span style={{ color: themeColor, fontWeight: 600, fontSize: 12 }}>Lien actif</span>
                <span style={{ padding: "3px 10px", borderRadius: 6, fontSize: 10, fontWeight: 600, background: themeColor + "20", color: themeColor }}>Badge</span>
              </div>
            </div>

            {/* ── Langue & Région ────────────────────────────── */}
            <div style={sSection}>
              <h2 style={sSectionTitle}><Languages size={18} color={C.blue} /> Langue & Région</h2>
              <p style={sSectionDesc}>Définissez la langue d'interface, la région et le fuseau horaire.</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Langue d'interface</label>
                  <div style={{ display: "flex", gap: 8 }}>
                    {(["fr", "en"] as const).map(l => (
                      <button key={l} onClick={() => switchLang(l)} style={{
                        flex: 1, padding: "10px 14px", borderRadius: 10, border: `2px solid ${lang === l ? C.blue : C.border}`,
                        background: lang === l ? C.blueLight : C.white, cursor: "pointer", fontFamily: font, fontSize: 13, fontWeight: lang === l ? 600 : 400,
                        color: lang === l ? C.blue : C.text, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all .15s",
                      }}>
                        <span style={{ fontSize: 18 }}>{l === "fr" ? "🇫🇷" : "🇬🇧"}</span> {l === "fr" ? "Français" : "English"}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Région</label>
                  <select value={region} onChange={e => saveSetting("region", e.target.value, setRegion)} style={sInput}>
                    {REGIONS.map(r => <option key={r.code} value={r.code}>{r.flag} {r.label} ({r.currency})</option>)}
                  </select>
                </div>
              </div>
              <div style={{ marginTop: 16 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Fuseau horaire</label>
                <select value={timezone} onChange={e => saveSetting("timezone", e.target.value, setTimezone)} style={{ ...sInput, maxWidth: 320 }}>
                  {TIMEZONES.map(tz => <option key={tz} value={tz}>{tz.replace("_", " ")}</option>)}
                </select>
              </div>
            </div>

            {/* ── Format date & heure ────────────────────────── */}
            <div style={sSection}>
              <h2 style={sSectionTitle}><Calendar size={18} color={C.amber} /> Format de date & heure</h2>
              <p style={sSectionDesc}>Personnalisez l'affichage des dates et heures dans toute l'application.</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Format de date</label>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {[
                      { value: "DD/MM/YYYY", example: "03/04/2026" },
                      { value: "MM/DD/YYYY", example: "04/03/2026" },
                      { value: "YYYY-MM-DD", example: "2026-04-03" },
                      { value: "DD.MM.YYYY", example: "03.04.2026" },
                      { value: "D MMM YYYY", example: "3 avr. 2026" },
                    ].map(f => (
                      <button key={f.value} onClick={() => saveSetting("date_format", f.value, setDateFormat)} style={{
                        padding: "8px 12px", borderRadius: 8, border: `2px solid ${dateFormat === f.value ? C.amber : C.border}`,
                        background: dateFormat === f.value ? C.amberLight : C.white, cursor: "pointer", fontFamily: font, fontSize: 12,
                        color: C.text, display: "flex", alignItems: "center", justifyContent: "space-between", transition: "all .15s",
                      }}>
                        <span style={{ fontWeight: dateFormat === f.value ? 600 : 400 }}>{f.value}</span>
                        <span style={{ color: C.textMuted, fontSize: 11 }}>{f.example}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Format d'heure</label>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {[
                      { value: "24h", example: "14:30" },
                      { value: "12h", example: "2:30 PM" },
                    ].map(f => (
                      <button key={f.value} onClick={() => saveSetting("time_format", f.value, setTimeFormat)} style={{
                        padding: "10px 14px", borderRadius: 8, border: `2px solid ${timeFormat === f.value ? C.amber : C.border}`,
                        background: timeFormat === f.value ? C.amberLight : C.white, cursor: "pointer", fontFamily: font, fontSize: 13,
                        color: C.text, display: "flex", alignItems: "center", justifyContent: "space-between", transition: "all .15s",
                      }}>
                        <span style={{ fontWeight: timeFormat === f.value ? 600 : 400 }}>{f.value === "24h" ? "24 heures" : "12 heures (AM/PM)"}</span>
                        <span style={{ color: C.textMuted }}>{f.example}</span>
                      </button>
                    ))}
                  </div>
                  <div style={{ marginTop: 16, padding: "12px 16px", borderRadius: 10, background: C.bg }}>
                    <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 4 }}>Aperçu actuel :</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>
                      {fmtDateTime(new Date())}
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
          );
        })()}
        {adminPage === "admin_2fa" && (
          <div style={{ flex: 1, padding: "24px 32px", overflow: "auto", maxWidth: 800 }}>
            <h1 style={{ fontSize: 22, fontWeight: 600, margin: "0 0 8px" }}>Sécurité — Authentification à deux facteurs</h1>
            <p style={{ fontSize: 13, color: C.textMuted, margin: "0 0 24px" }}>Ajoutez une couche de sécurité supplémentaire en exigeant un code à usage unique lors de la connexion.</p>

            {/* Info banner */}
            <div style={{ padding: "14px 20px", background: C.blueLight, borderRadius: 10, marginBottom: 24, display: "flex", alignItems: "center", gap: 12, fontSize: 12, color: C.blue }}>
              <ShieldCheck size={18} />
              <span>Compatible avec <b>Google Authenticator</b>, <b>Microsoft Authenticator</b>, <b>Authy</b> et toute application TOTP.</span>
            </div>

            {!twoFASetup && !twoFAEnabled ? (
              <div className="iz-card" style={{ ...sCard, padding: "24px", display: "flex", alignItems: "center", gap: 20 }}>
                <div style={{ width: 56, height: 56, borderRadius: 12, background: C.bg, display: "flex", alignItems: "center", justifyContent: "center" }}><ShieldCheck size={28} color={C.textMuted} /></div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 16, fontWeight: 600, color: C.text, marginBottom: 4 }}>2FA désactivé</div>
                  <div style={{ fontSize: 13, color: C.textMuted }}>Protégez votre compte en activant l'authentification à deux facteurs. Un code temporaire sera demandé à chaque connexion.</div>
                </div>
                <button onClick={async () => {
                  try { const res = await setup2FA(); setTwoFASetup(res); }
                  catch { addToast_admin("Erreur lors de l'initialisation 2FA"); }
                }} className="iz-btn-pink" style={{ ...sBtn("pink"), whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 6, padding: "12px 24px" }}><ShieldCheck size={16} /> Activer le 2FA</button>
              </div>
            ) : twoFASetup && !twoFAEnabled ? (
              <div className="iz-card" style={{ ...sCard, padding: "28px" }}>
                <div style={{ fontSize: 16, fontWeight: 600, color: C.text, marginBottom: 20 }}>Étape 1 : Scannez le QR code</div>
                <div style={{ display: "flex", gap: 32 }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ width: 220, height: 220, background: C.white, borderRadius: 16, border: `2px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                      <img src={`data:image/svg+xml;base64,${twoFASetup.qr_code_svg}`} alt="QR Code" style={{ width: 200, height: 200 }} />
                    </div>
                    <div style={{ fontSize: 11, color: C.textMuted, marginTop: 10 }}>Scannez avec votre application<br/>d'authentification</div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, color: C.textLight, marginBottom: 8 }}>Ou entrez cette clé manuellement :</div>
                    <div style={{ padding: "10px 14px", background: C.bg, borderRadius: 10, fontFamily: "monospace", fontSize: 14, fontWeight: 600, letterSpacing: 3, marginBottom: 24, wordBreak: "break-all", color: C.text, userSelect: "all" as const }}>{twoFASetup.secret}</div>
                    <div style={{ fontSize: 16, fontWeight: 600, color: C.text, marginBottom: 12 }}>Étape 2 : Entrez le code</div>
                    <div style={{ marginBottom: 16 }}>
                      <input type="text" inputMode="numeric" pattern="[0-9]*" maxLength={6} value={twoFAConfirmCode} onChange={e => setTwoFAConfirmCode(e.target.value.replace(/\D/g, ""))}
                        placeholder="000000" autoFocus style={{ ...sInput, textAlign: "center", fontSize: 24, fontWeight: 700, letterSpacing: 10, padding: "14px" }} />
                    </div>
                    <div style={{ display: "flex", gap: 10 }}>
                      <button onClick={() => { setTwoFASetup(null); setTwoFAConfirmCode(""); }} className="iz-btn-outline" style={{ ...sBtn("outline"), padding: "10px 20px" }}>{t('common.cancel')}</button>
                      <button disabled={twoFAConfirmCode.length !== 6} onClick={async () => {
                        try {
                          const res = await confirm2FA(twoFAConfirmCode);
                          setTwoFAEnabled(true); setTwoFARecoveryCodes(res.recovery_codes);
                          setTwoFASetup(null); setTwoFAConfirmCode("");
                          addToast_admin("2FA activé avec succès !");
                        } catch { addToast_admin("Code invalide"); }
                      }} className="iz-btn-pink" style={{ ...sBtn("pink"), padding: "10px 24px", opacity: twoFAConfirmCode.length !== 6 ? 0.5 : 1 }}>Activer le 2FA</button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div className="iz-card" style={{ ...sCard, padding: "24px", display: "flex", alignItems: "center", gap: 20 }}>
                  <div style={{ width: 56, height: 56, borderRadius: 12, background: C.greenLight, display: "flex", alignItems: "center", justifyContent: "center" }}><ShieldCheck size={28} color={C.green} /></div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 16, fontWeight: 600, color: C.green, marginBottom: 4 }}>2FA activé</div>
                    <div style={{ fontSize: 13, color: C.textMuted }}>Votre compte est protégé. Un code temporaire est demandé à chaque connexion.</div>
                  </div>
                  <button onClick={() => showPrompt("Entrez votre code 2FA actuel pour désactiver", async (code) => {
                    try { await disable2FA(code); setTwoFAEnabled(false); setTwoFARecoveryCodes([]); addToast_admin("2FA désactivé"); }
                    catch { addToast_admin("Code invalide"); }
                  }, { label: "Code 2FA", type: "text" })} style={{ ...sBtn("outline"), color: C.red, borderColor: C.red, whiteSpace: "nowrap", padding: "10px 20px" }}>{t('misc.disable')}</button>
                </div>

                {/* Recovery codes */}
                <div className="iz-card" style={{ ...sCard, padding: "24px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 600, color: C.text, marginBottom: 2 }}>Codes de récupération</div>
                      <div style={{ fontSize: 12, color: C.textMuted }}>Utilisez un de ces codes si vous perdez l'accès à votre application d'authentification. Chaque code est à usage unique.</div>
                    </div>
                    <button onClick={() => showPrompt("Entrez votre code 2FA pour régénérer les codes de récupération", async (code) => {
                      try { const res = await regenerate2FARecoveryCodes(code); setTwoFARecoveryCodes(res.recovery_codes); addToast_admin("Codes régénérés"); }
                      catch { addToast_admin("Code invalide"); }
                    }, { label: "Code 2FA", type: "text" })} className="iz-btn-outline" style={{ ...sBtn("outline"), fontSize: 11, whiteSpace: "nowrap" }}>Régénérer</button>
                  </div>
                  {twoFARecoveryCodes.length > 0 ? (
                    <>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8, marginBottom: 14 }}>
                        {twoFARecoveryCodes.map((code, i) => (
                          <div key={i} style={{ padding: "8px 12px", background: C.bg, borderRadius: 8, fontFamily: "monospace", fontSize: 13, fontWeight: 600, textAlign: "center", color: C.text }}>{code}</div>
                        ))}
                      </div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={() => { navigator.clipboard.writeText(twoFARecoveryCodes.join("\n")); addToast_admin("Codes copiés dans le presse-papier"); }} className="iz-btn-outline" style={{ ...sBtn("outline"), fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}><Download size={12} /> Copier les codes</button>
                      </div>
                    </>
                  ) : (
                    <div style={{ padding: "20px", textAlign: "center", color: C.textMuted, fontSize: 13 }}>Cliquez sur "Régénérer" pour obtenir vos codes de récupération.</div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
        {/* ═══ EQUIPMENT MANAGEMENT ═══════════════════════════════ */}
        {adminPage === "admin_equipements" && (() => {
          const EQUIP_ICON_MAP: Record<string, any> = { laptop: Laptop, monitor: Monitor, phone: Phone, key: KeyRound, headphones: Headphones, mouse: Mouse, armchair: Armchair, car: Car, package: Package };
          const ETAT_META: Record<string, { label: string; color: string; bg: string }> = {
            disponible: { label: "Disponible", color: C.green, bg: C.greenLight },
            attribue: { label: "Attribué", color: C.blue, bg: C.blueLight },
            en_commande: { label: "En commande", color: C.amber, bg: C.amberLight },
            en_reparation: { label: "En réparation", color: "#7B5EA7", bg: C.purple + "15" },
            retire: { label: "Retiré", color: C.textMuted, bg: C.bg },
          };
          const reloadEquip = () => { getEquipments().then(setEquipments).catch(() => {}); getEquipmentStats().then(setEquipStats).catch(() => {}); getEquipmentTypes().then(setEquipTypes).catch(() => {}); };
          const filtered = equipFilter === "all" ? equipments : equipments.filter(e => e.etat === equipFilter);
          return (
          <div style={{ flex: 1, padding: "24px 32px", overflow: "auto" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <div>
                <h1 style={{ fontSize: 22, fontWeight: 600, margin: 0 }}>{t('equip.title')}</h1>
                <p style={{ fontSize: 12, color: C.textLight, margin: "4px 0 0" }}>Suivez l'attribution et la restitution du matériel mis à disposition de vos collaborateurs.</p>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {equipTab === "inventaire" && <button onClick={() => { resetTr(); setEquipPanel({ mode: "create", data: { equipment_type_id: equipTypes[0]?.id || "", nom: "", numero_serie: "", marque: "", modele: "", etat: "disponible", date_achat: "", valeur: "", notes: "" } }); }} className="iz-btn-pink" style={{ ...sBtn("pink"), display: "flex", alignItems: "center", gap: 6 }}><Plus size={14} /> {t('equip.add')}</button>}
                {equipTab === "packages" && <button onClick={() => { resetTr(); setPkgPanel({ mode: "create", data: { nom: "", description: "", icon: "package", couleur: "#C2185B", items: [{ equipment_type_id: equipTypes[0]?.id || "", quantite: 1, notes: "" }] } }); }} className="iz-btn-pink" style={{ ...sBtn("pink"), display: "flex", alignItems: "center", gap: 6 }}><Plus size={14} /> Nouveau package</button>}
                {equipTab === "types" && <button onClick={async () => {
                  const nom = prompt("Nom du type d'équipement :");
                  if (!nom) return;
                  const cat = prompt("Catégorie (materiel ou licence) :", "materiel");
                  try { await apiCreateEquipType({ nom, categorie: cat === "licence" ? "licence" : "materiel", icon: cat === "licence" ? "key" : "package" }); reloadEquip(); addToast_admin("Type créé"); } catch { addToast_admin(t('toast.error')); }
                }} className="iz-btn-pink" style={{ ...sBtn("pink"), display: "flex", alignItems: "center", gap: 6 }}><Plus size={14} /> Nouveau type</button>}
              </div>
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", gap: 0, borderBottom: `2px solid ${C.border}`, marginBottom: 16 }}>
              {([
                { id: "inventaire" as const, label: t('equip.inventory'), count: equipments.length },
                { id: "packages" as const, label: t('equip.packages'), count: equipPackages.length },
                { id: "types" as const, label: t('equip.types'), count: equipTypes.length },
              ]).map(tab => (
                <button key={tab.id} onClick={() => setEquipTab(tab.id)} style={{ padding: "10px 20px", fontSize: 13, fontWeight: equipTab === tab.id ? 600 : 400, color: equipTab === tab.id ? C.pink : C.textLight, background: "none", border: "none", borderBottom: equipTab === tab.id ? `2px solid ${C.pink}` : "2px solid transparent", cursor: "pointer", fontFamily: font, marginBottom: -2, display: "flex", alignItems: "center", gap: 6 }}>
                  {tab.label} <span style={{ fontSize: 10, padding: "1px 6px", borderRadius: 8, background: equipTab === tab.id ? C.pinkBg : C.bg, color: equipTab === tab.id ? C.pink : C.textMuted }}>{tab.count}</span>
                </button>
              ))}
            </div>

            {equipTab === "inventaire" && (<>

            {/* Stats */}
            {equipStats && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, marginBottom: 20 }}>
                {[
                  { label: "Total", value: equipStats.total, icon: Boxes, color: C.text, bg: C.bg },
                  { label: "Disponible", value: equipStats.disponible, icon: CheckCircle, color: C.green, bg: C.greenLight },
                  { label: "Attribué", value: equipStats.attribue, icon: UserCheck, color: C.blue, bg: C.blueLight },
                  { label: "En commande", value: equipStats.enCommande, icon: Clock, color: C.amber, bg: C.amberLight },
                  { label: "Valeur totale", value: fmtCurrency(equipStats.valeurTotale), icon: Banknote, color: C.pink, bg: C.pinkBg },
                ].map((s, i) => (
                  <div key={i} className="iz-card" style={{ ...sCard, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center" }}><s.icon size={16} color={s.color} /></div>
                    <div><div style={{ fontSize: 18, fontWeight: 700, color: s.color }}>{s.value}</div><div style={{ fontSize: 10, color: C.textMuted }}>{s.label}</div></div>
                  </div>
                ))}
              </div>
            )}

            {/* Filter */}
            <div style={{ display: "flex", gap: 4, padding: 3, background: C.bg, borderRadius: 8, marginBottom: 16, width: "fit-content" }}>
              {[["all", "Tous"], ["disponible", "Disponible"], ["attribue", "Attribué"], ["en_commande", "En commande"], ["en_reparation", "En réparation"], ["retire", "Retiré"]].map(([key, label]) => (
                <button key={key} onClick={() => setEquipFilter(key)} style={{ padding: "6px 14px", borderRadius: 6, fontSize: 11, fontWeight: equipFilter === key ? 600 : 400, border: "none", cursor: "pointer", fontFamily: font, background: equipFilter === key ? C.pink : "transparent", color: equipFilter === key ? C.white : C.textMuted, transition: "all .15s" }}>{label}</button>
              ))}
            </div>

            {/* Table */}
            <div className="iz-card" style={{ ...sCard, padding: 0, overflow: "hidden" }}>
              <div style={{ display: "grid", gridTemplateColumns: "0.3fr 1.5fr 1fr 0.8fr 1fr 0.8fr 0.5fr", gap: 0, padding: "10px 16px", background: C.bg, borderBottom: `1px solid ${C.border}`, fontSize: 11, fontWeight: 600, color: C.textLight, textTransform: "uppercase" }}>
                <span></span><span>Matériel</span><span>Type</span><span>État</span><span>Attribué à</span><span>N° série</span><span></span>
              </div>
              {filtered.length === 0 && <div style={{ padding: "40px 20px", textAlign: "center", color: C.textMuted, fontSize: 13 }}>Aucun matériel trouvé</div>}
              {filtered.map(eq => {
                const meta = ETAT_META[eq.etat] || ETAT_META.disponible;
                const TypeIcon = EQUIP_ICON_MAP[eq.type?.icon || "package"] || Package;
                return (
                  <div key={eq.id} className="iz-sidebar-item" style={{ display: "grid", gridTemplateColumns: "0.3fr 1.5fr 1fr 0.8fr 1fr 0.8fr 0.5fr", gap: 0, padding: "12px 16px", borderBottom: `1px solid ${C.border}`, alignItems: "center", fontSize: 13 }}>
                    <div><div style={{ width: 32, height: 32, borderRadius: 8, background: C.bg, display: "flex", alignItems: "center", justifyContent: "center" }}><TypeIcon size={16} color={C.textMuted} /></div></div>
                    <div>
                      <div style={{ fontWeight: 500 }}>{eq.nom}</div>
                      {eq.marque && <div style={{ fontSize: 11, color: C.textMuted }}>{eq.marque} {eq.modele || ""}</div>}
                    </div>
                    <div style={{ fontSize: 12, color: C.textLight }}>{eq.type?.nom || "—"}</div>
                    <span style={{ padding: "3px 10px", borderRadius: 6, fontSize: 10, fontWeight: 600, background: meta.bg, color: meta.color, justifySelf: "start" }}>{meta.label}</span>
                    <div>
                      {eq.collaborateur ? (
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 500 }}>{eq.collaborateur.prenom} {eq.collaborateur.nom}</div>
                          <div style={{ fontSize: 10, color: C.textMuted }}>{eq.assigned_at ? fmtDate(eq.assigned_at) : ""}</div>
                        </div>
                      ) : <span style={{ color: C.textMuted }}>—</span>}
                    </div>
                    <div style={{ fontSize: 11, color: C.textMuted, fontFamily: "monospace" }}>{eq.numero_serie || "—"}</div>
                    <div style={{ display: "flex", gap: 4 }}>
                      {eq.etat === "disponible" && (
                        <button onClick={() => {
                          const collabId = prompt("ID du collaborateur à attribuer :");
                          if (collabId) apiAssignEquip(eq.id, Number(collabId)).then(reloadEquip).catch(() => addToast_admin(t('toast.error')));
                        }} title="Attribuer" style={{ background: C.blueLight, border: "none", borderRadius: 6, padding: 4, cursor: "pointer" }}><UserPlus size={12} color={C.blue} /></button>
                      )}
                      {eq.etat === "attribue" && (
                        <button onClick={() => apiUnassignEquip(eq.id).then(reloadEquip).catch(() => addToast_admin(t('toast.error')))} title="Restituer" style={{ background: C.amberLight, border: "none", borderRadius: 6, padding: 4, cursor: "pointer" }}><RotateCcw size={12} color={C.amber} /></button>
                      )}
                      <button onClick={() => { setContentTranslations((eq as any).translations || {}); setEquipPanel({ mode: "edit", data: { ...eq, equipment_type_id: eq.equipment_type_id } }); }} title="Modifier" style={{ background: C.bg, border: "none", borderRadius: 6, padding: 4, cursor: "pointer" }}><FilePen size={12} color={C.textMuted} /></button>
                      <button onClick={() => showConfirm(`Supprimer "${eq.nom}" ?`, async () => { try { await apiDeleteEquip(eq.id); reloadEquip(); addToast_admin(t('toast.deleted')); } catch {} })} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}><Trash size={12} color={C.red} /></button>
                    </div>
                  </div>
                );
              })}
            </div>

            </>)}

            {/* ═══ TAB: Packages ═══ */}
            {equipTab === "packages" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {equipPackages.map(pkg => (
                  <div key={pkg.id} className="iz-card" style={{ ...sCard, padding: 0, overflow: "hidden", opacity: pkg.actif ? 1 : 0.5 }}>
                    <div style={{ padding: "16px 20px", borderBottom: `1px solid ${C.border}` }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 40, height: 40, borderRadius: 10, background: pkg.couleur + "20", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Package size={18} color={pkg.couleur} />
                          </div>
                          <div>
                            <h3 style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>{pkg.nom}</h3>
                            {pkg.description && <div style={{ fontSize: 11, color: C.textMuted }}>{pkg.description}</div>}
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: 4 }}>
                          <button onClick={() => { setContentTranslations((pkg as any).translations || {}); setPkgPanel({ mode: "edit", data: { ...pkg, items: pkg.items.map(i => ({ equipment_type_id: i.equipment_type_id, quantite: i.quantite, notes: i.notes || "" })) } }); }} style={{ background: C.bg, border: "none", borderRadius: 6, padding: 4, cursor: "pointer" }}><FilePen size={12} color={C.textMuted} /></button>
                          <button onClick={() => showConfirm(`Supprimer le package "${pkg.nom}" ?`, async () => { try { await apiDeletePkg(pkg.id); reloadEquip(); addToast_admin("Package supprimé"); } catch {} })} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}><Trash size={12} color={C.red} /></button>
                        </div>
                      </div>
                    </div>
                    <div style={{ padding: "12px 20px" }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: C.textMuted, textTransform: "uppercase", marginBottom: 8 }}>Contenu ({pkg.items.length} éléments)</div>
                      {pkg.items.map((item, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 0", fontSize: 12 }}>
                          <span style={{ padding: "2px 6px", borderRadius: 4, fontSize: 9, fontWeight: 600, background: item.type?.categorie === "licence" ? C.blueLight : C.bg, color: item.type?.categorie === "licence" ? C.blue : C.textMuted }}>{item.type?.categorie === "licence" ? "Licence" : "Matériel"}</span>
                          <span style={{ fontWeight: 500, color: C.text }}>{item.type?.nom || "?"}</span>
                          {item.quantite > 1 && <span style={{ color: C.textMuted }}>×{item.quantite}</span>}
                          {item.notes && <span style={{ color: C.textLight, fontSize: 10 }}>({item.notes})</span>}
                        </div>
                      ))}
                    </div>
                    <div style={{ padding: "10px 20px", borderTop: `1px solid ${C.border}`, background: C.bg }}>
                      <button onClick={async () => {
                        const collabId = prompt("ID du collaborateur à provisionner :");
                        if (!collabId) return;
                        try { const res = await apiProvisionPkg(pkg.id, Number(collabId)); reloadEquip(); addToast_admin(res.message); } catch { addToast_admin(t('toast.error')); }
                      }} className="iz-btn-outline" style={{ ...sBtn("outline"), fontSize: 11, padding: "5px 14px", display: "flex", alignItems: "center", gap: 4 }}><UserPlus size={12} /> Provisionner à un collaborateur</button>
                    </div>
                  </div>
                ))}
                {equipPackages.length === 0 && <div style={{ gridColumn: "1/-1", padding: "40px 20px", textAlign: "center", color: C.textMuted, fontSize: 13 }}>Aucun package. Créez-en un pour regrouper matériel et licences.</div>}
              </div>
            )}

            {/* ═══ TAB: Types & Licences ═══ */}
            {equipTab === "types" && (
              <div>
                {[{ cat: "materiel", label: "Matériel", color: C.text }, { cat: "licence", label: "Licences logicielles", color: C.blue }].map(section => {
                  const types = equipTypes.filter(t => (t as any).categorie === section.cat || (!( t as any).categorie && section.cat === "materiel"));
                  return (
                    <div key={section.cat} style={{ marginBottom: 24 }}>
                      <h2 style={{ fontSize: 15, fontWeight: 600, color: section.color, marginBottom: 12 }}>{section.label} ({types.length})</h2>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
                        {types.map(t => {
                          const TypeIcon = EQUIP_ICON_MAP[t.icon] || Package;
                          return (
                            <div key={t.id} className="iz-card" style={{ ...sCard, textAlign: "center", padding: "16px", opacity: t.actif ? 1 : 0.4 }}>
                              <div style={{ width: 44, height: 44, borderRadius: 12, background: section.cat === "licence" ? C.blueLight : C.bg, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px" }}>
                                <TypeIcon size={20} color={section.cat === "licence" ? C.blue : C.textMuted} />
                              </div>
                              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{t.nom}</div>
                              <div style={{ fontSize: 10, color: C.textMuted, marginBottom: 6 }}>{t.description || "—"}</div>
                              {t.equipments_count !== undefined && <div style={{ fontSize: 10, color: C.textMuted }}>{t.equipments_count} en inventaire</div>}
                              <div style={{ display: "flex", gap: 4, justifyContent: "center", marginTop: 8 }}>
                                <button onClick={() => showConfirm(`Supprimer le type "${t.nom}" ?`, async () => { try { await apiDeleteEquipType(t.id); reloadEquip(); addToast_admin("Type supprimé"); } catch { addToast_admin("Erreur — des équipements utilisent ce type"); } })} style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}><Trash size={11} color={C.red} /></button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Equipment Create/Edit Panel */}
            {equipPanel.mode !== "closed" && (<>
              <div onClick={() => setEquipPanel({ mode: "closed", data: {} })} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.3)", zIndex: 1000 }} />
              <div className="iz-panel" style={{ position: "fixed", top: 0, right: 0, width: 480, height: "100vh", background: C.white, boxShadow: "-4px 0 24px rgba(0,0,0,.1)", zIndex: 1001, display: "flex", flexDirection: "column" }}>
                <div style={{ padding: "20px 24px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>{equipPanel.mode === "create" ? "Ajouter du matériel" : "Modifier"}</h2>
                  <button onClick={() => setEquipPanel({ mode: "closed", data: {} })} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={18} /></button>
                </div>
                <div style={{ flex: 1, padding: 24, overflow: "auto", display: "flex", flexDirection: "column", gap: 14 }}>
                  <div><label style={{ fontSize: 11, color: C.textLight, display: "block", marginBottom: 4 }}>Type *</label>
                    <select value={equipPanel.data.equipment_type_id || ""} onChange={e => setEquipPanel(p => ({ ...p, data: { ...p.data, equipment_type_id: Number(e.target.value) } }))} style={sInput}>
                      {equipTypes.map(t => <option key={t.id} value={t.id}>{t.nom}</option>)}
                    </select>
                  </div>
                  <div><label style={{ fontSize: 11, color: C.textLight, display: "block", marginBottom: 4 }}>Nom / Description *</label>
                    <TranslatableField value={equipPanel.data.nom || ""} onChange={v => setEquipPanel(p => ({ ...p, data: { ...p.data, nom: v } }))} currentLang={lang} activeLangs={activeLanguages} translations={contentTranslations.nom} onTranslationsChange={tr => setTr("nom", tr)} style={sInput} placeholder="Ex: MacBook Pro 14 pouces" />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div><label style={{ fontSize: 11, color: C.textLight, display: "block", marginBottom: 4 }}>Marque</label>
                      <input value={equipPanel.data.marque || ""} onChange={e => setEquipPanel(p => ({ ...p, data: { ...p.data, marque: e.target.value } }))} style={sInput} placeholder="Apple" /></div>
                    <div><label style={{ fontSize: 11, color: C.textLight, display: "block", marginBottom: 4 }}>Modèle</label>
                      <input value={equipPanel.data.modele || ""} onChange={e => setEquipPanel(p => ({ ...p, data: { ...p.data, modele: e.target.value } }))} style={sInput} placeholder="M3 Pro" /></div>
                  </div>
                  <div><label style={{ fontSize: 11, color: C.textLight, display: "block", marginBottom: 4 }}>Numéro de série</label>
                    <input value={equipPanel.data.numero_serie || ""} onChange={e => setEquipPanel(p => ({ ...p, data: { ...p.data, numero_serie: e.target.value } }))} style={sInput} placeholder="SN-XXXXX" /></div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div><label style={{ fontSize: 11, color: C.textLight, display: "block", marginBottom: 4 }}>État</label>
                      <select value={equipPanel.data.etat || "disponible"} onChange={e => setEquipPanel(p => ({ ...p, data: { ...p.data, etat: e.target.value } }))} style={sInput}>
                        {Object.entries(ETAT_META).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                      </select></div>
                    <div><label style={{ fontSize: 11, color: C.textLight, display: "block", marginBottom: 4 }}>Date d'achat</label>
                      <input type="date" value={equipPanel.data.date_achat || ""} onChange={e => setEquipPanel(p => ({ ...p, data: { ...p.data, date_achat: e.target.value } }))} style={sInput} /></div>
                  </div>
                  <div><label style={{ fontSize: 11, color: C.textLight, display: "block", marginBottom: 4 }}>Valeur (CHF)</label>
                    <input type="number" value={equipPanel.data.valeur || ""} onChange={e => setEquipPanel(p => ({ ...p, data: { ...p.data, valeur: e.target.value } }))} style={sInput} placeholder="0.00" /></div>
                  <div><label style={{ fontSize: 11, color: C.textLight, display: "block", marginBottom: 4 }}>Notes</label>
                    <textarea value={equipPanel.data.notes || ""} onChange={e => setEquipPanel(p => ({ ...p, data: { ...p.data, notes: e.target.value } }))} style={{ ...sInput, minHeight: 60, resize: "vertical" }} /></div>
                </div>
                <div style={{ padding: "16px 24px", borderTop: `1px solid ${C.border}`, display: "flex", gap: 8, justifyContent: "flex-end" }}>
                  {equipPanel.mode === "edit" && equipPanel.data.id && (
                    <button onClick={() => showConfirm("Supprimer ce matériel ?", async () => { try { await apiDeleteEquip(equipPanel.data.id); reloadEquip(); setEquipPanel({ mode: "closed", data: {} }); addToast_admin(t('toast.deleted')); } catch {} })} style={{ ...sBtn("outline"), color: C.red, borderColor: C.red, marginRight: "auto" }}>{t('common.delete')}</button>
                  )}
                  <button onClick={() => setEquipPanel({ mode: "closed", data: {} })} className="iz-btn-outline" style={sBtn("outline")}>{t('common.cancel')}</button>
                  <button onClick={async () => {
                    if (!equipPanel.data.nom?.trim()) { addToast_admin("Le nom est requis"); return; }
                    try {
                      const payload = { equipment_type_id: equipPanel.data.equipment_type_id, nom: equipPanel.data.nom, numero_serie: equipPanel.data.numero_serie || null, marque: equipPanel.data.marque || null, modele: equipPanel.data.modele || null, etat: equipPanel.data.etat || "disponible", date_achat: equipPanel.data.date_achat || null, valeur: equipPanel.data.valeur ? Number(equipPanel.data.valeur) : null, notes: equipPanel.data.notes || null, translations: buildTranslationsPayload() };
                      if (equipPanel.mode === "edit" && equipPanel.data.id) await apiUpdateEquip(equipPanel.data.id, payload);
                      else await apiCreateEquip(payload);
                      reloadEquip(); setEquipPanel({ mode: "closed", data: {} }); addToast_admin(equipPanel.mode === "create" ? "Matériel ajouté" : "Matériel modifié");
                    } catch { addToast_admin(t('toast.error')); }
                  }} className="iz-btn-pink" style={sBtn("pink")}>{equipPanel.mode === "create" ? "Ajouter" : "Enregistrer"}</button>
                </div>
              </div>
            </>)}
            {/* Package Create/Edit Panel */}
            {pkgPanel.mode !== "closed" && (<>
              <div onClick={() => setPkgPanel({ mode: "closed", data: {} })} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.3)", zIndex: 1000 }} />
              <div className="iz-panel" style={{ position: "fixed", top: 0, right: 0, width: 520, height: "100vh", background: C.white, boxShadow: "-4px 0 24px rgba(0,0,0,.1)", zIndex: 1001, display: "flex", flexDirection: "column" }}>
                <div style={{ padding: "20px 24px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>{pkgPanel.mode === "create" ? "Nouveau package" : "Modifier le package"}</h2>
                  <button onClick={() => setPkgPanel({ mode: "closed", data: {} })} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={18} /></button>
                </div>
                <div style={{ flex: 1, padding: 24, overflow: "auto", display: "flex", flexDirection: "column", gap: 14 }}>
                  <div><label style={{ fontSize: 11, color: C.textLight, display: "block", marginBottom: 4 }}>Nom du package *</label>
                    <TranslatableField value={pkgPanel.data.nom || ""} onChange={v => setPkgPanel(p => ({ ...p, data: { ...p.data, nom: v } }))} currentLang={lang} activeLangs={activeLanguages} translations={contentTranslations.nom} onTranslationsChange={tr => setTr("nom", tr)} style={sInput} placeholder="Ex: Package IT Développeur" /></div>
                  <div><label style={{ fontSize: 11, color: C.textLight, display: "block", marginBottom: 4 }}>Description</label>
                    <TranslatableField multiline rows={3} value={pkgPanel.data.description || ""} onChange={v => setPkgPanel(p => ({ ...p, data: { ...p.data, description: v } }))} currentLang={lang} activeLangs={activeLanguages} translations={contentTranslations.description} onTranslationsChange={tr => setTr("description", tr)} style={{ ...sInput, minHeight: 50, resize: "vertical" }} /></div>

                  <div style={{ fontSize: 13, fontWeight: 600, color: C.pink, marginTop: 4 }}>Contenu du package</div>
                  {(pkgPanel.data.items || []).map((item: any, i: number) => (
                    <div key={i} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <select value={item.equipment_type_id || ""} onChange={e => { const arr = [...(pkgPanel.data.items || [])]; arr[i] = { ...arr[i], equipment_type_id: Number(e.target.value) }; setPkgPanel(p => ({ ...p, data: { ...p.data, items: arr } })); }} style={{ ...sInput, flex: 2, fontSize: 12 }}>
                        <option value="">— Type —</option>
                        <optgroup label="Matériel">{equipTypes.filter(t => (t as any).categorie !== "licence").map(t => <option key={t.id} value={t.id}>{t.nom}</option>)}</optgroup>
                        <optgroup label="Licences">{equipTypes.filter(t => (t as any).categorie === "licence").map(t => <option key={t.id} value={t.id}>{t.nom}</option>)}</optgroup>
                      </select>
                      <input type="number" min={1} value={item.quantite || 1} onChange={e => { const arr = [...(pkgPanel.data.items || [])]; arr[i] = { ...arr[i], quantite: Number(e.target.value) }; setPkgPanel(p => ({ ...p, data: { ...p.data, items: arr } })); }} style={{ ...sInput, width: 50, fontSize: 12, textAlign: "center" }} />
                      <input value={item.notes || ""} onChange={e => { const arr = [...(pkgPanel.data.items || [])]; arr[i] = { ...arr[i], notes: e.target.value }; setPkgPanel(p => ({ ...p, data: { ...p.data, items: arr } })); }} style={{ ...sInput, flex: 1, fontSize: 11 }} placeholder="Notes" />
                      <button onClick={() => { const arr = (pkgPanel.data.items || []).filter((_: any, j: number) => j !== i); setPkgPanel(p => ({ ...p, data: { ...p.data, items: arr } })); }} style={{ background: "none", border: "none", cursor: "pointer", color: C.red, padding: 2 }}><X size={14} /></button>
                    </div>
                  ))}
                  <button onClick={() => setPkgPanel(p => ({ ...p, data: { ...p.data, items: [...(p.data.items || []), { equipment_type_id: "", quantite: 1, notes: "" }] } }))} style={{ fontSize: 11, color: C.pink, background: "none", border: "none", cursor: "pointer", fontWeight: 600, fontFamily: font, padding: "4px 0", textAlign: "left" }}>+ Ajouter un élément</button>
                </div>
                <div style={{ padding: "16px 24px", borderTop: `1px solid ${C.border}`, display: "flex", gap: 8, justifyContent: "flex-end" }}>
                  <button onClick={() => setPkgPanel({ mode: "closed", data: {} })} className="iz-btn-outline" style={sBtn("outline")}>{t('common.cancel')}</button>
                  <button onClick={async () => {
                    if (!pkgPanel.data.nom?.trim()) { addToast_admin("Le nom est requis"); return; }
                    const validItems = (pkgPanel.data.items || []).filter((i: any) => i.equipment_type_id);
                    if (validItems.length === 0) { addToast_admin("Ajoutez au moins un élément"); return; }
                    try {
                      const payload = { nom: pkgPanel.data.nom, description: pkgPanel.data.description || null, icon: pkgPanel.data.icon || "package", couleur: pkgPanel.data.couleur || "#C2185B", items: validItems, translations: buildTranslationsPayload() };
                      if (pkgPanel.mode === "edit" && pkgPanel.data.id) await apiUpdatePkg(pkgPanel.data.id, payload);
                      else await apiCreatePkg(payload);
                      reloadEquip(); setPkgPanel({ mode: "closed", data: {} }); addToast_admin(pkgPanel.mode === "create" ? "Package créé" : "Package modifié");
                    } catch { addToast_admin(t('toast.error')); }
                  }} className="iz-btn-pink" style={sBtn("pink")}>{pkgPanel.mode === "create" ? t('common.create') : t('common.save')}</button>
                </div>
              </div>
            </>)}
          </div>
          );
        })()}

        {/* ═══ SIGNATURE DOCUMENTS ═════════════════════════════════ */}
        {adminPage === "admin_signatures" && (() => {
          const reloadSign = () => { getSignatureDocuments().then(setSignDocs).catch(() => {}); };
          return (
          <div style={{ flex: 1, padding: "24px 32px", overflow: "auto" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <div>
                <h1 style={{ fontSize: 22, fontWeight: 600, margin: 0 }}>{t('admin.signatures')}</h1>
                <p style={{ fontSize: 12, color: C.textLight, margin: "4px 0 0" }}>Gérez les documents que vos collaborateurs doivent lire, accepter ou signer (règlement intérieur, droit à l'image, NDA...).</p>
              </div>
              <button onClick={() => { resetTr(); setSignPanel({ mode: "create", data: { titre: "", description: "", type: "lecture", obligatoire: true, actif: true } }); }} className="iz-btn-pink" style={{ ...sBtn("pink"), display: "flex", alignItems: "center", gap: 6 }}><Plus size={14} /> {t('doc.new_template')}</button>
            </div>

            {/* How it works */}
            <div className="iz-card" style={{ ...sCard, padding: "14px 20px", marginBottom: 20, background: `${C.pinkBg}`, border: `1px solid ${C.pink}20` }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, fontSize: 12, color: C.textLight, lineHeight: 1.6 }}>
                <div><strong style={{ color: C.text }}>Type "Lecture"</strong> — Le collaborateur lit le document et confirme "J'ai lu et j'accepte". Parfait pour le règlement intérieur, la charte IT, la politique RGPD.</div>
                <div><strong style={{ color: C.text }}>Type "Signature"</strong> — Le collaborateur signe électroniquement. Pour le droit à l'image, les NDA, les avenants au contrat. Intégrable avec DocuSign/UgoSign.</div>
              </div>
            </div>

            {/* Documents grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {signDocs.map(doc => (
                <div key={doc.id} className="iz-card" style={{ ...sCard, padding: 0, overflow: "hidden", opacity: doc.actif ? 1 : 0.5 }}>
                  <div style={{ padding: "16px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        {doc.type === "lecture" ? <BookOpen size={16} color={C.blue} /> : <PenLine size={16} color={C.pink} />}
                        <h3 style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>{doc.titre}</h3>
                      </div>
                      <div style={{ display: "flex", gap: 4 }}>
                        <span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 600, background: doc.type === "lecture" ? C.blueLight : C.pinkBg, color: doc.type === "lecture" ? C.blue : C.pink }}>{doc.type === "lecture" ? "Lecture + Acceptation" : "Signature"}</span>
                        {doc.obligatoire && <span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 600, background: C.redLight, color: C.red }}>{t('dash.obligatory')}</span>}
                      </div>
                    </div>
                    {doc.description && <p style={{ fontSize: 12, color: C.textLight, margin: "0 0 8px", lineHeight: 1.5 }}>{doc.description}</p>}
                    {doc.fichier_nom && <div style={{ fontSize: 11, color: C.textMuted, display: "flex", alignItems: "center", gap: 4 }}><Paperclip size={11} /> {doc.fichier_nom}</div>}
                  </div>
                  <div style={{ padding: "10px 20px", borderTop: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", background: C.bg }}>
                    <div style={{ display: "flex", gap: 12, fontSize: 12 }}>
                      <span style={{ color: C.text }}><strong>{doc.total_signes || 0}</strong>/{doc.total_envois || 0} signés</span>
                    </div>
                    <div style={{ display: "flex", gap: 4 }}>
                      <button onClick={async () => { try { await sendSignatureDocToAll(doc.id); reloadSign(); addToast_admin("Document envoyé à tous"); } catch { addToast_admin(t('toast.error')); } }} title="Envoyer à tous" className="iz-btn-outline" style={{ ...sBtn("outline"), padding: "4px 10px", fontSize: 10, display: "flex", alignItems: "center", gap: 4 }}><Send size={10} /> Envoyer à tous</button>
                      <button onClick={() => { setContentTranslations((doc as any).translations || {}); setSignPanel({ mode: "edit", data: { ...doc } }); }} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 6, padding: "4px 8px", cursor: "pointer" }}><FilePen size={12} color={C.textMuted} /></button>
                      <button onClick={() => showConfirm(`Supprimer "${doc.titre}" ?`, async () => { try { await apiDeleteSignDoc(doc.id); reloadSign(); addToast_admin(t('toast.deleted')); } catch {} })} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}><Trash size={12} color={C.red} /></button>
                    </div>
                  </div>
                </div>
              ))}
              {signDocs.length === 0 && <div style={{ gridColumn: "1/-1", padding: "40px 20px", textAlign: "center", color: C.textMuted, fontSize: 13 }}>Aucun document. Créez-en un pour commencer.</div>}
            </div>

            {/* Create/Edit Panel */}
            {signPanel.mode !== "closed" && (<>
              <div onClick={() => setSignPanel({ mode: "closed", data: {} })} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.3)", zIndex: 1000 }} />
              <div className="iz-panel" style={{ position: "fixed", top: 0, right: 0, width: 480, height: "100vh", background: C.white, boxShadow: "-4px 0 24px rgba(0,0,0,.1)", zIndex: 1001, display: "flex", flexDirection: "column" }}>
                <div style={{ padding: "20px 24px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>{signPanel.mode === "create" ? "Nouveau document" : "Modifier"}</h2>
                  <button onClick={() => setSignPanel({ mode: "closed", data: {} })} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={18} /></button>
                </div>
                <div style={{ flex: 1, padding: 24, overflow: "auto", display: "flex", flexDirection: "column", gap: 14 }}>
                  <div><label style={{ fontSize: 11, color: C.textLight, display: "block", marginBottom: 4 }}>Titre *</label>
                    <TranslatableField value={signPanel.data.titre || ""} onChange={v => setSignPanel(p => ({ ...p, data: { ...p.data, titre: v } }))} currentLang={lang} activeLangs={activeLanguages} translations={contentTranslations.titre} onTranslationsChange={tr => setTr("titre", tr)} style={sInput} placeholder="Ex: Règlement intérieur" /></div>
                  <div><label style={{ fontSize: 11, color: C.textLight, display: "block", marginBottom: 4 }}>Description</label>
                    <TranslatableField multiline rows={3} value={signPanel.data.description || ""} onChange={v => setSignPanel(p => ({ ...p, data: { ...p.data, description: v } }))} currentLang={lang} activeLangs={activeLanguages} translations={contentTranslations.description} onTranslationsChange={tr => setTr("description", tr)} style={{ ...sInput, minHeight: 60, resize: "vertical" }} placeholder="Décrivez le contenu du document..." /></div>
                  <div><label style={{ fontSize: 11, color: C.textLight, display: "block", marginBottom: 4 }}>Type</label>
                    <div style={{ display: "flex", gap: 8 }}>
                      {[{ id: "lecture", label: "Lecture + Acceptation", icon: BookOpen, desc: "Le collaborateur confirme avoir lu" }, { id: "signature", label: "Signature électronique", icon: PenLine, desc: "Le collaborateur signe le document" }].map(t => (
                        <button key={t.id} onClick={() => setSignPanel(p => ({ ...p, data: { ...p.data, type: t.id } }))} style={{ flex: 1, padding: "12px", borderRadius: 10, border: `2px solid ${signPanel.data.type === t.id ? C.pink : C.border}`, background: signPanel.data.type === t.id ? C.pinkBg : C.white, cursor: "pointer", textAlign: "left", fontFamily: font }}>
                          <t.icon size={18} color={signPanel.data.type === t.id ? C.pink : C.textMuted} style={{ marginBottom: 6 }} />
                          <div style={{ fontSize: 13, fontWeight: 600, color: signPanel.data.type === t.id ? C.pink : C.text }}>{t.label}</div>
                          <div style={{ fontSize: 10, color: C.textMuted }}>{t.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* File upload */}
                  <div><label style={{ fontSize: 11, color: C.textLight, display: "block", marginBottom: 4 }}>Fichier (PDF, DOC)</label>
                    {signPanel.data.fichier_nom ? (
                      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", borderRadius: 8, background: C.greenLight, fontSize: 12 }}>
                        <FileText size={14} color={C.green} />
                        <span style={{ flex: 1, fontWeight: 500 }}>{signPanel.data.fichier_nom}</span>
                      </div>
                    ) : (
                      <label style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", borderRadius: 8, border: `1px dashed ${C.border}`, cursor: "pointer", fontSize: 12, color: C.textLight }}>
                        <Upload size={14} /> Cliquer pour ajouter un fichier (max 10 Mo)
                        <input type="file" accept=".pdf,.doc,.docx" style={{ display: "none" }} onChange={async (e) => {
                          const file = e.target.files?.[0]; if (!file) return;
                          if (signPanel.data.id) {
                            try { const res = await uploadSignatureFile(signPanel.data.id, file); setSignPanel(p => ({ ...p, data: { ...p.data, fichier_nom: res.filename } })); addToast_admin("Fichier uploadé"); } catch { addToast_admin("Erreur upload"); }
                          } else { setSignPanel(p => ({ ...p, data: { ...p.data, _pendingFile: file, fichier_nom: file.name } })); }
                        }} />
                      </label>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: 16 }}>
                    <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, cursor: "pointer" }}>
                      <input type="checkbox" checked={signPanel.data.obligatoire !== false} onChange={() => setSignPanel(p => ({ ...p, data: { ...p.data, obligatoire: !p.data.obligatoire } }))} style={{ accentColor: C.pink }} /> Obligatoire
                    </label>
                    <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, cursor: "pointer" }}>
                      <input type="checkbox" checked={signPanel.data.actif !== false} onChange={() => setSignPanel(p => ({ ...p, data: { ...p.data, actif: !p.data.actif } }))} style={{ accentColor: C.green }} /> Actif
                    </label>
                  </div>
                </div>
                <div style={{ padding: "16px 24px", borderTop: `1px solid ${C.border}`, display: "flex", gap: 8, justifyContent: "flex-end" }}>
                  <button onClick={() => setSignPanel({ mode: "closed", data: {} })} className="iz-btn-outline" style={sBtn("outline")}>{t('common.cancel')}</button>
                  <button onClick={async () => {
                    if (!signPanel.data.titre?.trim()) { addToast_admin("Le titre est requis"); return; }
                    try {
                      const payload = { titre: signPanel.data.titre, description: signPanel.data.description || null, type: signPanel.data.type || "lecture", obligatoire: signPanel.data.obligatoire !== false, actif: signPanel.data.actif !== false, translations: buildTranslationsPayload() };
                      let created: any;
                      if (signPanel.mode === "edit" && signPanel.data.id) await apiUpdateSignDoc(signPanel.data.id, payload);
                      else created = await apiCreateSignDoc(payload);
                      if (signPanel.data._pendingFile && (created?.id || signPanel.data.id)) {
                        try { await uploadSignatureFile(created?.id || signPanel.data.id, signPanel.data._pendingFile); } catch {}
                      }
                      reloadSign(); setSignPanel({ mode: "closed", data: {} }); addToast_admin(signPanel.mode === "create" ? "Document créé" : "Document modifié");
                    } catch { addToast_admin(t('toast.error')); }
                  }} className="iz-btn-pink" style={sBtn("pink")}>{signPanel.mode === "create" ? t('common.create') : t('common.save')}</button>
                </div>
              </div>
            </>)}
          </div>
          );
        })()}

        {adminPage === "admin_donnees" && (() => {
          const downloadBlob = (blob: Blob, filename: string) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a"); a.href = url; a.download = filename; a.click();
            URL.revokeObjectURL(url);
          };
          return (
          <div style={{ flex: 1, padding: "24px 32px", overflow: "auto", maxWidth: 800 }}>
            <h1 style={{ fontSize: 22, fontWeight: 600, margin: "0 0 8px" }}>{t('data.title')}</h1>
            <p style={{ fontSize: 13, color: C.textMuted, margin: "0 0 24px" }}>Conformément au RGPD, vous pouvez exporter ou supprimer les données de votre organisation.</p>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Export all */}
              <div className="iz-card" style={{ ...sCard, padding: "20px 24px", display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: C.blueLight, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Download size={20} color={C.blue} /></div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 2 }}>Exporter toutes les données</div>
                  <div style={{ fontSize: 12, color: C.textMuted }}>Téléchargez une archive JSON contenant toutes les données : collaborateurs, parcours, actions, documents, messages, paramètres.</div>
                </div>
                <button onClick={async () => {
                  addToast_admin("Export en cours...");
                  try { const blob = await exportAllData(); downloadBlob(blob, `illizeo-export-${new Date().toISOString().slice(0, 10)}.json`); addToast_admin("Export téléchargé"); }
                  catch { addToast_admin("Erreur lors de l'export"); }
                }} className="iz-btn-outline" style={{ ...sBtn("outline"), whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 6 }}><Download size={14} /> Exporter JSON</button>
              </div>

              {/* Export collaborateurs */}
              <div className="iz-card" style={{ ...sCard, padding: "20px 24px", display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: C.greenLight, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Users size={20} color={C.green} /></div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 2 }}>Exporter les collaborateurs</div>
                  <div style={{ fontSize: 12, color: C.textMuted }}>Export CSV de tous les collaborateurs avec leurs informations personnelles, progression et statut de parcours.</div>
                </div>
                <button onClick={async () => {
                  addToast_admin("Export CSV en cours...");
                  try { const blob = await exportCollaborateursCSV(); downloadBlob(blob, `collaborateurs-${new Date().toISOString().slice(0, 10)}.csv`); addToast_admin("CSV téléchargé"); }
                  catch { addToast_admin("Erreur lors de l'export"); }
                }} className="iz-btn-outline" style={{ ...sBtn("outline"), whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 6 }}><Download size={14} /> Export CSV</button>
              </div>

              {/* Export audit log */}
              <div className="iz-card" style={{ ...sCard, padding: "20px 24px", display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: C.purple + "15", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Scroll size={20} color="#7B5EA7" /></div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 2 }}>Journal d'audit</div>
                  <div style={{ fontSize: 12, color: C.textMuted }}>Exportez l'historique des actions effectuées sur la plateforme : connexions, modifications, suppressions, validations.</div>
                </div>
                <button onClick={async () => {
                  addToast_admin("Export du journal en cours...");
                  try { const blob = await exportAuditLog(); downloadBlob(blob, `audit-log-${new Date().toISOString().slice(0, 10)}.json`); addToast_admin("Journal téléchargé"); }
                  catch { addToast_admin("Erreur lors de l'export"); }
                }} className="iz-btn-outline" style={{ ...sBtn("outline"), whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 6 }}><Download size={14} /> Export JSON</button>
              </div>

              <div style={{ height: 1, background: C.border, margin: "8px 0" }} />

              {/* Supprimer un collaborateur */}
              <div className="iz-card" style={{ ...sCard, padding: "20px 24px", display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: C.amberLight, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><UserMinus size={20} color={C.amber} /></div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 2 }}>Supprimer les données d'un collaborateur</div>
                  <div style={{ fontSize: 12, color: C.textMuted }}>Droit à l'oubli RGPD — supprime définitivement toutes les données personnelles d'un collaborateur (profil, documents, messages).</div>
                </div>
                <button onClick={() => showPrompt("Saisissez l'email du collaborateur à supprimer", (email) => {
                  showConfirm(`Supprimer définitivement toutes les données de ${email} ? Cette action est irréversible.`, async () => {
                    try { await rgpdDeleteCollaborateur(email); addToast_admin(`Données de ${email} supprimées`); refetchCollaborateurs(); }
                    catch { addToast_admin("Erreur : collaborateur introuvable ou suppression échouée"); }
                  });
                }, { label: "Email du collaborateur", type: "email" })} className="iz-btn-outline" style={{ ...sBtn("outline"), whiteSpace: "nowrap", color: C.amber, borderColor: C.amber, display: "flex", alignItems: "center", gap: 6 }}><UserMinus size={14} /> Supprimer</button>
              </div>

              {/* Supprimer le compte */}
              <div className="iz-card" style={{ ...sCard, padding: "20px 24px", display: "flex", alignItems: "center", gap: 16, border: `1px solid ${C.red}30` }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: C.redLight, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Trash size={20} color={C.red} /></div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: C.red, marginBottom: 2 }}>Supprimer le compte entreprise</div>
                  <div style={{ fontSize: 12, color: C.textMuted }}>Supprime définitivement votre espace Illizeo et toutes les données associées. Cette action est irréversible et prend effet sous 30 jours.</div>
                </div>
                <button onClick={() => showConfirm("ATTENTION : Cette action supprimera définitivement votre espace Illizeo, tous les utilisateurs, collaborateurs, parcours, documents et données associées. Cette action est irréversible. Êtes-vous absolument certain ?", async () => {
                  try { await rgpdDeleteAccount(); addToast_admin("Demande de suppression enregistrée. Vous recevrez un email de confirmation sous 24h."); }
                  catch { addToast_admin("Erreur lors de la demande"); }
                })} style={{ ...sBtn("outline"), whiteSpace: "nowrap", color: C.red, borderColor: C.red, display: "flex", alignItems: "center", gap: 6 }}><Trash size={14} /> Supprimer</button>
              </div>
            </div>
          </div>
          );
        })()}
        {adminPage === "admin_provisioning" && (() => {
          const entraConnected = (integrations || []).some((i: any) => i.provider === "entra_id" && i.connecte);
          const ROLE_COLORS: Record<string, { label: string; color: string; bg: string }> = {
            super_admin: { label: t('role.super_admin'), color: "#E53935", bg: C.redLight },
            admin: { label: t('role.admin'), color: "#7B5EA7", bg: C.purple + "15" },
            admin_rh: { label: t('role.admin_rh'), color: "#C2185B", bg: C.pinkBg },
            manager: { label: t('role.manager'), color: "#1A73E8", bg: C.blueLight },
            onboardee: { label: t('role.onboardee'), color: "#4CAF50", bg: C.greenLight },
          };
          return (
          <div style={{ flex: 1, padding: "24px 32px", overflow: "auto" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <div>
                <h1 style={{ fontSize: 22, fontWeight: 600, margin: 0 }}>Provisionnement des utilisateurs</h1>
                <p style={{ fontSize: 12, color: C.textLight, margin: "4px 0 0" }}>Mappez les groupes Azure AD aux rôles Illizeo pour le provisionnement automatique</p>
              </div>
              <button disabled={syncLoading || !entraConnected} onClick={async () => {
                setSyncLoading(true);
                try {
                  const res = await syncADUsers();
                  addToast_admin(`Sync terminée : ${res.created} créés, ${res.updated} mis à jour, ${res.deprovisioned} dé-provisionnés`);
                  getADGroupMappings().then(setAdMappings);
                } catch { addToast_admin("Erreur de sync"); }
                finally { setSyncLoading(false); }
              }} className="iz-btn-pink" style={{ ...sBtn("pink"), display: "flex", alignItems: "center", gap: 6, opacity: !entraConnected ? 0.5 : 1 }}>
                <Download size={16} /> {syncLoading ? "Synchronisation..." : "Synchroniser maintenant"}
              </button>
            </div>

            {!entraConnected && (
              <div style={{ padding: "20px", background: C.amberLight, borderRadius: 10, marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
                <AlertTriangle size={20} color={C.amber} />
                <div><div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>Entra ID non connecté</div><div style={{ fontSize: 12, color: C.textLight }}>Configurez Microsoft Entra ID dans Intégrations pour activer le provisionnement.</div></div>
              </div>
            )}

            {/* Current mappings */}
            <div className="iz-card" style={{ ...sCard, marginBottom: 20 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, margin: "0 0 12px" }}>Mappings actifs</h3>
              {adMappings.length === 0 ? (
                <div style={{ padding: 16, textAlign: "center", color: C.textMuted, fontSize: 13 }}>Aucun mapping configuré</div>
              ) : adMappings.map((m: any) => {
                const rc = ROLE_COLORS[m.illizeo_role] || ROLE_COLORS.onboardee;
                return (
                  <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: `1px solid ${C.border}` }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: "#0078D415", display: "flex", alignItems: "center", justifyContent: "center" }}><Users size={14} color="#0078D4" /></div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{m.ad_group_name}</div>
                      <div style={{ fontSize: 10, color: C.textMuted, fontFamily: "monospace" }}>{m.ad_group_id}</div>
                    </div>
                    <span style={{ fontSize: 14, color: C.textMuted }}>→</span>
                    <span style={{ padding: "3px 10px", borderRadius: 6, fontSize: 11, fontWeight: 600, background: rc.bg, color: rc.color }}>{rc.label}</span>
                    <div style={{ display: "flex", gap: 4 }}>
                      {m.auto_provision && <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 3, background: C.greenLight, color: C.green }}>Auto-créer</span>}
                      {m.auto_deprovision && <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 3, background: C.redLight, color: C.red }}>Auto-retirer</span>}
                    </div>
                    <button onClick={async () => { await deleteADGroupMapping(m.id); setAdMappings(prev => prev.filter(x => x.id !== m.id)); addToast_admin("Mapping supprimé"); }} style={{ background: "none", border: "none", cursor: "pointer", color: C.textMuted }}><X size={14} /></button>
                  </div>
                );
              })}
            </div>

            {/* Add mapping */}
            {entraConnected && (
              <div className="iz-card" style={{ ...sCard }}>
                <h3 style={{ fontSize: 15, fontWeight: 600, margin: "0 0 12px" }}>Ajouter un mapping</h3>
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr auto", gap: 10, alignItems: "end" }}>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600, color: C.text, display: "block", marginBottom: 4 }}>Groupe Azure AD</label>
                    <select id="ad-group-select" style={{ ...sInput, fontSize: 12, cursor: "pointer" }}>
                      <option value="">Sélectionner un groupe...</option>
                      {adGroups.filter(g => !adMappings.some((m: any) => m.ad_group_id === g.id)).map((g: any) => (
                        <option key={g.id} value={JSON.stringify({ id: g.id, name: g.displayName })}>{g.displayName}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600, color: C.text, display: "block", marginBottom: 4 }}>Rôle Illizeo</label>
                    <select id="ad-role-select" style={{ ...sInput, fontSize: 12, cursor: "pointer" }}>
                      {Object.entries(ROLE_COLORS).map(([key, val]) => <option key={key} value={key}>{val.label}</option>)}
                    </select>
                  </div>
                  <button onClick={async () => {
                    const groupEl = document.getElementById("ad-group-select") as HTMLSelectElement;
                    const roleEl = document.getElementById("ad-role-select") as HTMLSelectElement;
                    if (!groupEl?.value) return;
                    const group = JSON.parse(groupEl.value);
                    try {
                      const created = await createADGroupMapping({ ad_group_id: group.id, ad_group_name: group.name, illizeo_role: roleEl.value, auto_provision: true });
                      setAdMappings(prev => [...prev, created]);
                      groupEl.value = "";
                      addToast_admin(`Mapping créé : ${group.name} → ${roleEl.value}`);
                    } catch { addToast_admin(t('toast.error')); }
                  }} className="iz-btn-pink" style={{ ...sBtn("pink"), fontSize: 12, padding: "8px 16px" }}>Mapper</button>
                </div>
                <div style={{ marginTop: 12, padding: "10px 14px", background: C.bg, borderRadius: 8, fontSize: 11, color: C.textLight }}>
                  <div style={{ fontWeight: 600, color: C.text, marginBottom: 4 }}>Comment ça marche</div>
                  <div>• Lors du SSO, le rôle de l'utilisateur est déterminé par ses groupes Azure AD</div>
                  <div>• Si un utilisateur appartient à plusieurs groupes, le rôle le plus élevé est attribué</div>
                  <div>• "Synchroniser" crée les comptes pour tous les membres des groupes mappés</div>
                  <div>• Les utilisateurs sans groupe mappé obtiennent le rôle "Collaborateur" par défaut</div>
                </div>
              </div>
            )}
          </div>
          );
        })()}
        </div>{/* end content wrapper */}
        </div>{/* end column container */}
        {/* Translation modal */}
        {translateFieldId && (() => {
          const fc = fieldConfig.find(f => f.id === translateFieldId);
          if (!fc) return null;
          return (
            <div className="iz-overlay" style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000 }}>
              <div className="iz-modal" style={{ background: C.white, borderRadius: 16, width: 420, padding: "28px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                  <h3 style={{ fontSize: 17, fontWeight: 600, margin: 0 }}>Traduction du champ</h3>
                  <button onClick={() => setTranslateFieldId(null)} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={20} color={C.textLight} /></button>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Français (FR)</label>
                  <input value={fc.label} disabled style={{ ...sInput, fontSize: 13, background: C.bg, color: C.textMuted }} />
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>English (EN)</label>
                  <input value={translateEN} onChange={e => setTranslateEN(e.target.value)} placeholder="English translation..." style={{ ...sInput, fontSize: 13 }} />
                </div>
                <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                  <button onClick={() => setTranslateFieldId(null)} style={{ ...sBtn("outline"), fontSize: 13 }}>{t('common.cancel')}</button>
                  <button onClick={async () => {
                    await apiUpdateFieldConfig(fc.id, { label_en: translateEN });
                    setFieldConfig(prev => prev.map(f => f.id === fc.id ? { ...f, label_en: translateEN } : f));
                    addToast_admin(`Traduction enregistrée : ${fc.label} → ${translateEN}`);
                    setTranslateFieldId(null);
                  }} className="iz-btn-pink" style={{ ...sBtn("pink"), fontSize: 13 }}>{t('common.save')}</button>
                </div>
              </div>
            </div>
          );
        })()}
        {toast && (
          <div className="iz-fade-up" style={{ position: "fixed", bottom: 24, right: 24, zIndex: 2000, padding: "12px 20px", borderRadius: 10, background: C.dark, color: C.white, fontSize: 13, fontWeight: 500, boxShadow: "0 6px 20px rgba(0,0,0,.2)", display: "flex", alignItems: "center", gap: 8 }}>
            <CheckCircle size={16} /> {toast}
          </div>
        )}
        {/* (confirm modal unified with confirmDialog above) */}
        {/* ── Prompt Modal ─────────────────────────────────── */}
        {promptModal && (
          <div style={{ position: "fixed", inset: 0, zIndex: 3000, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,.35)" }} onClick={() => setPromptModal(null)}>
            <div className="iz-fade-up" onClick={e => e.stopPropagation()} style={{ background: C.white, borderRadius: 16, padding: "28px 32px", width: 420, boxShadow: "0 12px 40px rgba(0,0,0,.18)", fontFamily: font }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: C.blueLight, display: "flex", alignItems: "center", justifyContent: "center" }}><Calendar size={20} color={C.blue} /></div>
                <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0, color: C.text }}>{promptModal.message}</h3>
              </div>
              {promptModal.label && <label style={{ fontSize: 12, color: C.textLight, marginBottom: 6, display: "block" }}>{promptModal.label}</label>}
              <input type={promptModal.type} value={promptValue} onChange={e => setPromptValue(e.target.value)} style={{ ...sInput, marginBottom: 20 }} autoFocus onKeyDown={e => { if (e.key === "Enter" && promptValue) { promptModal.onSubmit(promptValue); setPromptModal(null); } }} />
              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                <button onClick={() => setPromptModal(null)} className="iz-btn-outline" style={{ ...sBtn("outline"), padding: "9px 20px" }}>{t('common.cancel')}</button>
                <button onClick={() => { if (promptValue) { promptModal.onSubmit(promptValue); setPromptModal(null); } }} className="iz-btn-pink" style={{ ...sBtn("pink"), padding: "9px 20px" }}>Valider</button>
              </div>
            </div>
          </div>
        )}
        {/* ── Collaborateur Create/Edit Panel (extended) ─────── */}
        {collabPanelMode !== "closed" && (() => {
          const activeFields = fieldConfig.filter(f => f.actif);
          const sections = [
            { key: "base", label: "Informations de base", fields: null },
            { key: "personal", label: "Informations personnelles", fields: activeFields.filter(f => f.section === "personal") },
            { key: "contract", label: "Informations contractuelles", fields: activeFields.filter(f => f.section === "contract") },
            { key: "job", label: "Job Information", fields: activeFields.filter(f => f.section === "job") },
            { key: "position", label: "Position Information", fields: activeFields.filter(f => f.section === "position") },
            { key: "org", label: "Informations organisationnelles", fields: activeFields.filter(f => f.section === "org") },
          ];
          const renderField = (fc: any) => {
            const isCustom = fc.field_key.startsWith("custom_");
            const val = isCustom ? ((collabPanelData as any).custom_fields || {})[fc.field_key] || "" : (collabPanelData as any)[fc.field_key] || "";
            const onChange = (v: string) => {
              if (isCustom) {
                setCollabPanelData((prev: any) => ({ ...prev, custom_fields: { ...(prev.custom_fields || {}), [fc.field_key]: v } }));
              } else {
                setCollabPanelData((prev: any) => ({ ...prev, [fc.field_key]: v }));
              }
            };
            const fType = fc.field_type || "text";
            if (fType === "list" && fc.list_values?.length > 0) return <select value={val} onChange={e => onChange(e.target.value)} style={{ ...sInput, fontSize: 12, cursor: "pointer" }}><option value="">—</option>{fc.list_values.map((v: string) => <option key={v} value={v}>{v}</option>)}</select>;
            if (fType === "date") return <input type="date" value={val} onChange={e => onChange(e.target.value)} style={{ ...sInput, fontSize: 12 }} />;
            if (fType === "number") return <input type="number" value={val} onChange={e => onChange(e.target.value)} placeholder="0" style={{ ...sInput, fontSize: 12 }} />;
            if (fType === "boolean") return (
              <div onClick={() => onChange(val === "true" ? "false" : "true")} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", padding: "8px 0" }}>
                <div style={{ width: 36, height: 20, borderRadius: 10, background: val === "true" ? C.green : C.border, position: "relative", transition: "all .2s" }}>
                  <div style={{ width: 16, height: 16, borderRadius: "50%", background: C.white, position: "absolute", top: 2, left: val === "true" ? 18 : 2, transition: "all .2s", boxShadow: "0 1px 2px rgba(0,0,0,.2)" }} />
                </div>
                <span style={{ fontSize: 12, color: C.text }}>{val === "true" ? "Oui" : "Non"}</span>
              </div>
            );
            if (fc.field_key === "adresse") return <textarea value={val} onChange={e => onChange(e.target.value)} rows={2} style={{ ...sInput, fontSize: 12, resize: "vertical" }} />;
            return <input value={val} onChange={e => onChange(e.target.value)} style={{ ...sInput, fontSize: 12 }} />;
          };
          return (
          <>
            <div onClick={() => setCollabPanelMode("closed")} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.3)", zIndex: 1000 }} />
            <div className="iz-panel" style={{ position: "fixed", top: 0, right: 0, width: "65vw", maxWidth: 1000, height: "100vh", background: C.white, boxShadow: "-4px 0 24px rgba(0,0,0,.1)", zIndex: 1001, display: "flex", flexDirection: "column" }}>
              <div style={{ padding: "24px 28px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>{collabPanelMode === "create" ? "Nouveau collaborateur" : `${collabPanelData.prenom} ${collabPanelData.nom}`}</h2>
                <button onClick={() => setCollabPanelMode("closed")} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={22} color={C.textLight} /></button>
              </div>
              <div style={{ flex: 1, padding: "24px 28px", overflow: "auto" }}>
                {/* Base fields (always visible) */}
                <div style={{ fontSize: 11, fontWeight: 700, color: C.pink, textTransform: "uppercase", letterSpacing: .5, marginBottom: 10 }}>Informations de base</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                  <div><label style={{ fontSize: 11, fontWeight: 600, color: C.text, display: "block", marginBottom: 4 }}>Prénom *</label><input value={collabPanelData.prenom} onChange={e => setCollabPanelData((prev: any) => ({ ...prev, prenom: e.target.value }))} style={{ ...sInput, fontSize: 12 }} /></div>
                  <div><label style={{ fontSize: 11, fontWeight: 600, color: C.text, display: "block", marginBottom: 4 }}>Nom *</label><input value={collabPanelData.nom} onChange={e => setCollabPanelData((prev: any) => ({ ...prev, nom: e.target.value }))} style={{ ...sInput, fontSize: 12 }} /></div>
                </div>
                <div style={{ marginBottom: 12 }}><label style={{ fontSize: 11, fontWeight: 600, color: C.text, display: "block", marginBottom: 4 }}>Email *</label><input type="email" value={collabPanelData.email} onChange={e => setCollabPanelData((prev: any) => ({ ...prev, email: e.target.value }))} placeholder="prenom.nom@entreprise.com" style={{ ...sInput, fontSize: 12 }} /></div>
                <div style={{ marginBottom: 12 }}><label style={{ fontSize: 11, fontWeight: 600, color: C.text, display: "block", marginBottom: 4 }}>Poste</label><input value={collabPanelData.poste} onChange={e => setCollabPanelData((prev: any) => ({ ...prev, poste: e.target.value }))} style={{ ...sInput, fontSize: 12 }} /></div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                  <div><label style={{ fontSize: 11, fontWeight: 600, color: C.text, display: "block", marginBottom: 4 }}>Site</label><select value={collabPanelData.site} onChange={e => setCollabPanelData((prev: any) => ({ ...prev, site: e.target.value }))} style={{ ...sInput, fontSize: 12, cursor: "pointer" }}><option value="">—</option>{SITES.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
                  <div><label style={{ fontSize: 11, fontWeight: 600, color: C.text, display: "block", marginBottom: 4 }}>Département</label><select value={collabPanelData.departement} onChange={e => setCollabPanelData((prev: any) => ({ ...prev, departement: e.target.value }))} style={{ ...sInput, fontSize: 12, cursor: "pointer" }}><option value="">—</option>{DEPARTEMENTS.map(d => <option key={d} value={d}>{d}</option>)}</select></div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                  <div><label style={{ fontSize: 11, fontWeight: 600, color: C.text, display: "block", marginBottom: 4 }}>Date de début</label><input type="date" value={collabPanelData.dateDebut ? collabPanelData.dateDebut.split("/").reverse().join("-") : ""} onChange={e => { const v = e.target.value; if (v) { const [y, m, d] = v.split("-"); setCollabPanelData((prev: any) => ({ ...prev, dateDebut: `${d}/${m}/${y}` })); }}} style={{ ...sInput, fontSize: 12 }} /></div>
                  {collabPanelMode === "edit" && <div><label style={{ fontSize: 11, fontWeight: 600, color: C.text, display: "block", marginBottom: 4 }}>Parcours</label><select style={{ ...sInput, fontSize: 12, cursor: "pointer" }}><option value="">Aucun</option>{PARCOURS_TEMPLATES.map(p => <option key={p.id} value={p.id}>{p.nom}</option>)}</select></div>}
                </div>

                {/* Dynamic sections from field config */}
                {sections.filter(s => s.fields && s.fields.length > 0).map(section => (
                  <div key={section.key} style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: C.pink, textTransform: "uppercase", letterSpacing: .5, marginBottom: 10, paddingTop: 8, borderTop: `1px solid ${C.border}` }}>{section.label}</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                      {section.fields!.map((fc: any) => (
                        <div key={fc.id} style={{ gridColumn: fc.field_key === "adresse" ? "1 / -1" : undefined }}>
                          <label style={{ fontSize: 11, fontWeight: 600, color: C.text, display: "flex", alignItems: "center", gap: 4, marginBottom: 4 }}>
                            {lang === "en" && fc.label_en ? fc.label_en : fc.label} {fc.obligatoire && <span style={{ color: C.red }}>*</span>}
                          </label>
                          {renderField(fc)}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Documents & Signature */}
                {collabPanelMode === "edit" && (
                  <div style={{ marginTop: 8, paddingTop: 16, borderTop: `1px solid ${C.border}` }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: C.pink, textTransform: "uppercase", letterSpacing: .5, marginBottom: 12 }}>Documents & Signature</div>

                    {/* Send new document */}
                    <div style={{ padding: "16px", background: C.bg, borderRadius: 10, marginBottom: 12 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: C.text, marginBottom: 10 }}>Envoyer un document pour signature</div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 10, alignItems: "end" }}>
                        <div>
                          <select id="collab-contrat-select" style={{ ...sInput, fontSize: 12, cursor: "pointer", marginBottom: 8 }}>
                            <option value="">Sélectionner un contrat...</option>
                            {contrats.filter((c: any) => c.actif).map((c: any) => <option key={c.id} value={c.id}>{c.nom} ({c.type} — {c.juridiction})</option>)}
                          </select>
                          <select id="collab-sign-provider" style={{ ...sInput, fontSize: 12, cursor: "pointer" }}>
                            {(integrations || []).filter((i: any) => i.categorie === "signature" && (i.connecte || i.provider === "native")).map((i: any) => <option key={i.id} value={i.provider}>{i.nom}</option>)}
                          </select>
                        </div>
                        <button onClick={() => {
                          const contratEl = document.getElementById("collab-contrat-select") as HTMLSelectElement;
                          const providerEl = document.getElementById("collab-sign-provider") as HTMLSelectElement;
                          if (!contratEl?.value) { addToast_admin("Sélectionnez un contrat"); return; }
                          const contrat = contrats.find((c: any) => c.id === Number(contratEl.value));
                          addToast_admin(`${contrat?.nom || "Contrat"} envoyé pour signature via ${providerEl?.value || "in-app"} à ${collabPanelData.prenom} ${collabPanelData.nom}`);
                        }} className="iz-btn-pink" style={{ ...sBtn("pink"), fontSize: 12, padding: "8px 16px", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 6 }}>
                          <Send size={14} /> Envoyer
                        </button>
                      </div>
                    </div>

                    {/* Document history */}
                    <div style={{ fontSize: 12, fontWeight: 600, color: C.text, marginBottom: 8 }}>Historique</div>
                    <div style={{ fontSize: 12, color: C.textMuted, padding: "12px", background: C.bg, borderRadius: 8, textAlign: "center" }}>
                      Aucun document envoyé pour le moment
                    </div>
                  </div>
                )}
              </div>
              <div style={{ padding: "16px 28px", borderTop: `1px solid ${C.border}`, display: "flex", gap: 12, justifyContent: "space-between" }}>
                <div>
                  {collabPanelMode === "edit" && (
                    <button onClick={() => {
                      if (!collabPanelData.id) return;
                      const id = collabPanelData.id;
                      setConfirmDialog({ message: "Supprimer ce collaborateur et toutes ses données ?", onConfirm: async () => {
                        try { await apiDeleteCollab(id); addToast_admin("Collaborateur supprimé"); setCollabPanelMode("closed"); refetchCollaborateurs(); } catch { addToast_admin(t('toast.error')); }
                        setConfirmDialog(null);
                      }});
                    }} style={{ ...sBtn("outline"), color: C.red, borderColor: C.red, fontSize: 13 }}>{t('common.delete')}</button>
                  )}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => setCollabPanelMode("closed")} style={{ ...sBtn("outline"), fontSize: 13 }}>{t('common.cancel')}</button>
                  <button disabled={collabPanelLoading || !collabPanelData.prenom.trim() || !collabPanelData.nom.trim()} onClick={async () => {
                    setCollabPanelLoading(true);
                    const [d, m, y] = (collabPanelData.dateDebut || "").split("/");
                    const payload: Record<string, any> = {
                      prenom: collabPanelData.prenom.trim(),
                      nom: collabPanelData.nom.trim().toUpperCase(),
                      email: collabPanelData.email,
                      poste: collabPanelData.poste,
                      site: collabPanelData.site,
                      departement: collabPanelData.departement,
                      date_debut: y && m && d ? `${y}-${m}-${d}` : null,
                    };
                    try {
                      if (collabPanelMode === "create") { await apiCreateCollab(payload); addToast_admin("Collaborateur créé"); }
                      else { await apiUpdateCollab(collabPanelData.id!, payload); addToast_admin("Collaborateur modifié"); }
                      setCollabPanelMode("closed"); refetchCollaborateurs();
                    } catch { addToast_admin("Erreur lors de l'enregistrement"); }
                    finally { setCollabPanelLoading(false); }
                  }} className="iz-btn-pink" style={{ ...sBtn("pink"), fontSize: 13, opacity: collabPanelLoading || !collabPanelData.prenom.trim() || !collabPanelData.nom.trim() ? 0.6 : 1 }}>
                    {collabPanelLoading ? "..." : collabPanelMode === "create" ? "Créer le collaborateur" : "Enregistrer"}
                  </button>
                </div>
              </div>
            </div>
          </>
          );
        })()}
        {/* ── Parcours Create/Edit Panel ─────────────────────── */}
        {parcoursPanelMode !== "closed" && (
          <>
            <div onClick={() => setParcoursPanelMode("closed")} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.3)", zIndex: 1000 }} />
            <div className="iz-panel" style={{ position: "fixed", top: 0, right: 0, width: 540, height: "100vh", background: C.white, boxShadow: "-4px 0 24px rgba(0,0,0,.1)", zIndex: 1001, display: "flex", flexDirection: "column" }}>
              <div style={{ padding: "24px 28px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>{parcoursPanelMode === "create" ? t('panel.new_path') : t('panel.edit_path')}</h2>
                <button onClick={() => setParcoursPanelMode("closed")} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={22} color={C.textLight} /></button>
              </div>
              <div style={{ flex: 1, padding: "24px 28px", overflow: "auto" }}>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>{t('panel.path_name')}</label>
                  <TranslatableField value={parcoursPanelData.nom} onChange={v => setParcoursPanelData(prev => ({ ...prev, nom: v }))} placeholder="Ex: Onboarding Développeurs" currentLang={lang} activeLangs={activeLanguages} translations={contentTranslations.nom} onTranslationsChange={tr => setTr("nom", tr)} />
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>{t('panel.category')}</label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    {(["onboarding", "offboarding", "crossboarding", "reboarding"] as ParcoursCategorie[]).map(cat => {
                      const meta = PARCOURS_CAT_META[cat];
                      const active = parcoursPanelData.categorie === cat;
                      return (
                        <button key={cat} onClick={() => setParcoursPanelData(prev => ({ ...prev, categorie: cat }))} style={{
                          padding: "12px 14px", borderRadius: 10, border: `2px solid ${active ? meta.color : C.border}`, background: active ? meta.bg : C.white,
                          cursor: "pointer", display: "flex", alignItems: "center", gap: 10, fontFamily: font, transition: "all .15s",
                        }}>
                          <div style={{ width: 32, height: 32, borderRadius: 8, background: active ? meta.color : C.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <meta.Icon size={16} color={active ? C.white : meta.color} />
                          </div>
                          <span style={{ fontSize: 13, fontWeight: active ? 600 : 400, color: active ? meta.color : C.text }}>{meta.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>{t('label.status')}</label>
                  <select value={parcoursPanelData.status} onChange={e => setParcoursPanelData(prev => ({ ...prev, status: e.target.value as any }))} style={{ ...sInput, cursor: "pointer" }}>
                    <option value="brouillon">{t('status.draft')}</option>
                    <option value="actif">{t('status.active')}</option>
                    <option value="archive">{t('status.archived')}</option>
                  </select>
                </div>
                {parcoursPanelMode === "edit" && (
                  <div style={{ padding: "14px 16px", background: C.bg, borderRadius: 10, fontSize: 12, color: C.textLight, marginBottom: 20 }}>
                    Les phases et actions de ce parcours sont gérées dans les onglets dédiés.
                  </div>
                )}
              </div>
              <div style={{ padding: "16px 28px", borderTop: `1px solid ${C.border}`, display: "flex", gap: 12, justifyContent: "space-between" }}>
                <div>
                  {parcoursPanelMode === "edit" && (
                    <button onClick={() => {
                      if (!parcoursPanelData.id) return;
                      const id = parcoursPanelData.id;
                      setConfirmDialog({ message: "Supprimer ce parcours ? Cette action est irréversible.", onConfirm: async () => {
                        try { await apiDeleteParcours(id); addToast_admin("Parcours supprimé"); setParcoursPanelMode("closed"); refetchParcours(); } catch { addToast_admin("Erreur lors de la suppression"); }
                        setConfirmDialog(null);
                      }});
                    }} style={{ ...sBtn("outline"), color: C.red, borderColor: C.red, fontSize: 13 }}>{t('common.delete')}</button>
                  )}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => setParcoursPanelMode("closed")} style={{ ...sBtn("outline"), fontSize: 13 }}>{t('common.cancel')}</button>
                  <button disabled={parcoursPanelLoading || !parcoursPanelData.nom.trim()} onClick={async () => {
                    setParcoursPanelLoading(true);
                    const catIdMap: Record<string, number> = { onboarding: 1, offboarding: 2, crossboarding: 3, reboarding: 4 };
                    const payload: Record<string, any> = { nom: parcoursPanelData.nom.trim(), categorie_id: catIdMap[parcoursPanelData.categorie], status: parcoursPanelData.status, translations: buildTranslationsPayload() };
                    try {
                      if (parcoursPanelMode === "create") {
                        await apiCreateParcours(payload);
                        addToast_admin("Parcours créé avec succès");
                      } else {
                        await apiUpdateParcours(parcoursPanelData.id!, payload);
                        addToast_admin("Parcours modifié avec succès");
                      }
                      setParcoursPanelMode("closed");
                      refetchParcours();
                    } catch { addToast_admin("Erreur lors de l'enregistrement"); }
                    finally { setParcoursPanelLoading(false); }
                  }} className="iz-btn-pink" style={{ ...sBtn("pink"), fontSize: 13, opacity: parcoursPanelLoading || !parcoursPanelData.nom.trim() ? 0.6 : 1 }}>
                    {parcoursPanelLoading ? "Enregistrement..." : parcoursPanelMode === "create" ? "Créer le parcours" : "Enregistrer"}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
        {/* ── Phase Create/Edit Panel ────────────────────────── */}
        {phasePanelMode !== "closed" && (
          <>
            <div onClick={() => setPhasePanelMode("closed")} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.3)", zIndex: 1000 }} />
            <div className="iz-panel" style={{ position: "fixed", top: 0, right: 0, width: 500, height: "100vh", background: C.white, boxShadow: "-4px 0 24px rgba(0,0,0,.1)", zIndex: 1001, display: "flex", flexDirection: "column" }}>
              <div style={{ padding: "24px 28px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>{phasePanelMode === "create" ? "Nouvelle phase" : "Modifier la phase"}</h2>
                <button onClick={() => setPhasePanelMode("closed")} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={22} color={C.textLight} /></button>
              </div>
              <div style={{ flex: 1, padding: "24px 28px", overflow: "auto" }}>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Nom de la phase *</label>
                  <TranslatableField value={phasePanelData.nom} onChange={v => setPhasePanelData(prev => ({ ...prev, nom: v }))} placeholder="Ex: Première semaine" currentLang={lang} activeLangs={activeLanguages} translations={contentTranslations.nom} onTranslationsChange={tr => setTr("nom", tr)} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Délai début</label>
                    <select value={phasePanelData.delaiDebut || "J+0"} onChange={e => setPhasePanelData(prev => ({ ...prev, delaiDebut: e.target.value }))} style={{ ...sInput, cursor: "pointer" }}>
                      <option value="J-90">J-90</option><option value="J-60">J-60</option><option value="J-45">J-45</option>
                      <option value="J-30">J-30</option><option value="J-21">J-21</option><option value="J-14">J-14</option>
                      <option value="J-7">J-7</option><option value="J-3">J-3</option><option value="J-1">J-1</option>
                      <option value="J+0">J+0</option><option value="J+1">J+1</option><option value="J+3">J+3</option>
                      <option value="J+7">J+7</option><option value="J+8">J+8</option><option value="J+14">J+14</option>
                      <option value="J+15">J+15</option><option value="J+30">J+30</option><option value="J+60">J+60</option>
                      <option value="J+90">J+90</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Délai fin</label>
                    <select value={phasePanelData.delaiFin || "J+0"} onChange={e => setPhasePanelData(prev => ({ ...prev, delaiFin: e.target.value }))} style={{ ...sInput, cursor: "pointer" }}>
                      <option value="J-90">J-90</option><option value="J-60">J-60</option><option value="J-45">J-45</option>
                      <option value="J-30">J-30</option><option value="J-21">J-21</option><option value="J-14">J-14</option>
                      <option value="J-7">J-7</option><option value="J-3">J-3</option><option value="J-1">J-1</option>
                      <option value="J+0">J+0</option><option value="J+1">J+1</option><option value="J+3">J+3</option>
                      <option value="J+7">J+7</option><option value="J+8">J+8</option><option value="J+14">J+14</option>
                      <option value="J+15">J+15</option><option value="J+30">J+30</option><option value="J+60">J+60</option>
                      <option value="J+90">J+90</option>
                    </select>
                  </div>
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Couleur</label>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {["#4CAF50", "#1A73E8", "#F9A825", "#C2185B", "#7B5EA7", "#E53935", "#00897B", "#F57C00"].map(col => (
                      <button key={col} onClick={() => setPhasePanelData(prev => ({ ...prev, couleur: col }))} style={{
                        width: 36, height: 36, borderRadius: 10, background: col, border: phasePanelData.couleur === col ? `3px solid ${C.dark}` : "3px solid transparent",
                        cursor: "pointer", transition: "all .15s",
                      }} />
                    ))}
                  </div>
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Parcours associés</label>
                  <div style={{ border: `1px solid ${C.border}`, borderRadius: 8, maxHeight: 180, overflow: "auto" }}>
                    {PARCOURS_TEMPLATES.map(p => {
                      const checked = (phasePanelData.parcoursIds || []).includes(p.id);
                      const catMeta = PARCOURS_CAT_META[p.categorie] || PARCOURS_CAT_META.onboarding;
                      return (
                        <label key={p.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", cursor: "pointer", borderBottom: `1px solid ${C.border}`, background: checked ? catMeta.bg : "transparent", transition: "all .15s" }}>
                          <input type="checkbox" checked={checked} onChange={() => {
                            setPhasePanelData(prev => ({
                              ...prev,
                              parcoursIds: checked ? (prev.parcoursIds || []).filter(id => id !== p.id) : [...(prev.parcoursIds || []), p.id],
                            }));
                          }} style={{ accentColor: C.pink }} />
                          <span style={{ fontSize: 13, fontWeight: checked ? 600 : 400, color: C.text }}>{p.nom}</span>
                          <span style={{ fontSize: 10, padding: "2px 6px", borderRadius: 4, background: catMeta.bg, color: catMeta.color, fontWeight: 600, marginLeft: "auto" }}>{catMeta.label}</span>
                        </label>
                      );
                    })}
                  </div>
                  {(phasePanelData.parcoursIds || []).length === 0 && (
                    <div style={{ fontSize: 11, color: C.textMuted, marginTop: 4 }}>Aucun parcours sélectionné (phase globale)</div>
                  )}
                </div>
              </div>
              <div style={{ padding: "16px 28px", borderTop: `1px solid ${C.border}`, display: "flex", gap: 12, justifyContent: "space-between" }}>
                <div>
                  {phasePanelMode === "edit" && (
                    <button onClick={() => {
                      if (!phasePanelData.id) return;
                      const id = phasePanelData.id;
                      setConfirmDialog({ message: "Supprimer cette phase ? Les actions associées seront détachées.", onConfirm: async () => {
                        try { await apiDeletePhase(id); addToast_admin("Phase supprimée"); setPhasePanelMode("closed"); refetchPhases(); } catch { addToast_admin("Erreur lors de la suppression"); }
                        setConfirmDialog(null);
                      }});
                    }} style={{ ...sBtn("outline"), color: C.red, borderColor: C.red, fontSize: 13 }}>{t('common.delete')}</button>
                  )}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => setPhasePanelMode("closed")} style={{ ...sBtn("outline"), fontSize: 13 }}>{t('common.cancel')}</button>
                  <button disabled={phasePanelLoading || !phasePanelData.nom.trim()} onClick={async () => {
                    setPhasePanelLoading(true);
                    const payload: Record<string, any> = { nom: phasePanelData.nom.trim(), delai_debut: phasePanelData.delaiDebut, delai_fin: phasePanelData.delaiFin, couleur: phasePanelData.couleur, parcours_ids: phasePanelData.parcoursIds, translations: buildTranslationsPayload() };
                    try {
                      if (phasePanelMode === "create") {
                        await apiCreatePhase(payload);
                        addToast_admin("Phase créée avec succès");
                      } else {
                        await apiUpdatePhase(phasePanelData.id!, payload);
                        addToast_admin("Phase modifiée avec succès");
                      }
                      setPhasePanelMode("closed");
                      refetchPhases();
                    } catch { addToast_admin("Erreur lors de l'enregistrement"); }
                    finally { setPhasePanelLoading(false); }
                  }} className="iz-btn-pink" style={{ ...sBtn("pink"), fontSize: 13, opacity: phasePanelLoading || !phasePanelData.nom.trim() ? 0.6 : 1 }}>
                    {phasePanelLoading ? "Enregistrement..." : phasePanelMode === "create" ? "Créer la phase" : "Enregistrer"}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }
  // ─── EMPLOYEE MAIN RENDER ────────────────────────────────
  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: font, background: C.white, color: C.text }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;1,9..40,400&display=swap" rel="stylesheet" /><style dangerouslySetInnerHTML={{ __html: ANIM_STYLES }} />
      {renderSidebar()}
      {dashPage === "tableau_de_bord" && renderDashboard()}
      {dashPage === "mes_actions" && renderMesActions()}
      {dashPage === "messagerie" && renderMessagerie()}
      {dashPage === "entreprise" && renderEntreprise()}
      {dashPage === "cooptation" && (() => {
        const activeCampaigns = empCampaigns.filter(c => c.statut === "active");
        const reloadEmpCoopt = () => {
          getCooptations().then(list => setEmpCooptations(list.filter(c => c.referrer_email === auth.user?.email))).catch(() => {});
          getCooptationCampaigns().then(setEmpCampaigns).catch(() => {});
        };
        return (
        <div style={{ flex: 1, padding: "32px 40px", overflow: "auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 600, color: C.text, margin: 0 }}>{t('admin.cooptation')}</h1>
              <p style={{ fontSize: 13, color: C.textMuted, marginTop: 4 }}>Recommandez des talents et gagnez des récompenses</p>
            </div>
          </div>

          {/* My cooptation stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 24 }}>
            <div className="iz-card" style={{ ...sCard, textAlign: "center", padding: "20px" }}>
              <Handshake size={24} color={C.pink} style={{ marginBottom: 8 }} />
              <div style={{ fontSize: 24, fontWeight: 700, color: C.text }}>{empCooptations.length}</div>
              <div style={{ fontSize: 11, color: C.textMuted }}>Mes recommandations</div>
            </div>
            <div className="iz-card" style={{ ...sCard, textAlign: "center", padding: "20px" }}>
              <CheckCircle size={24} color={C.green} style={{ marginBottom: 8 }} />
              <div style={{ fontSize: 24, fontWeight: 700, color: C.green }}>{empCooptations.filter(c => c.statut === "embauche" || c.statut === "valide" || c.statut === "recompense_versee").length}</div>
              <div style={{ fontSize: 11, color: C.textMuted }}>Embauchés</div>
            </div>
            <div className="iz-card" style={{ ...sCard, textAlign: "center", padding: "20px" }}>
              <Gift size={24} color={C.amber} style={{ marginBottom: 8 }} />
              <div style={{ fontSize: 24, fontWeight: 700, color: C.amber }}>{empCooptations.filter(c => c.recompense_versee).length}</div>
              <div style={{ fontSize: 11, color: C.textMuted }}>Récompenses reçues</div>
            </div>
          </div>

          {/* Active campaigns */}
          <h2 style={{ fontSize: 17, fontWeight: 600, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}><Target size={18} color={C.pink} /> {t('emp.open_positions')}</h2>
          {activeCampaigns.length === 0 && <div style={{ padding: "30px 20px", textAlign: "center", color: C.textMuted, fontSize: 13, marginBottom: 24 }}>Aucun poste ouvert à la cooptation pour le moment.</div>}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 32 }}>
            {activeCampaigns.map(camp => (
              <div key={camp.id} className="iz-card" style={{ ...sCard, padding: 0, overflow: "hidden" }}>
                <div style={{ padding: "16px 20px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>{camp.titre}</h3>
                    <span style={{ padding: "2px 8px", borderRadius: 6, fontSize: 10, fontWeight: 600, background: camp.priorite === "urgente" ? C.redLight : camp.priorite === "haute" ? C.amberLight : C.blueLight, color: camp.priorite === "urgente" ? C.red : camp.priorite === "haute" ? C.amber : C.blue }}>{camp.priorite}</span>
                  </div>
                  {camp.description && <p style={{ fontSize: 12, color: C.textLight, margin: "0 0 8px", lineHeight: 1.5 }}>{camp.description}</p>}
                  <div style={{ display: "flex", gap: 12, fontSize: 11, color: C.textMuted }}>
                    {camp.departement && <span>{camp.departement}</span>}
                    {camp.site && <span>{camp.site}</span>}
                    <span>{camp.type_contrat}</span>
                  </div>
                </div>
                <div style={{ padding: "10px 20px", borderTop: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ fontSize: 12 }}>
                    <span style={{ fontWeight: 600, color: C.pink }}>{camp.type_recompense === "prime" ? fmtCurrency(camp.montant_recompense || 0) : camp.description_recompense || "Cadeau"}</span>
                    <span style={{ color: C.textMuted }}> de récompense</span>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/cooptation/${camp.share_token}`); addToast_admin("Lien copié !"); }} title="Copier le lien" className="iz-btn-outline" style={{ ...sBtn("outline"), padding: "5px 10px", fontSize: 11, display: "flex", alignItems: "center", gap: 4 }}><Link size={11} /> Partager</button>
                    <button onClick={() => setEmpCooptForm({ open: true, campaign_id: camp.id, candidate_name: "", candidate_email: "", candidate_poste: camp.titre, telephone: "", linkedin_url: "", message: "" })} className="iz-btn-pink" style={{ ...sBtn("pink"), padding: "5px 14px", fontSize: 11, display: "flex", alignItems: "center", gap: 4 }}><UserPlus size={11} /> {t('emp.recommend')}</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* My cooptations history */}
          <h2 style={{ fontSize: 17, fontWeight: 600, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}><Clock size={18} color={C.blue} /> {t('emp.my_recommendations')}</h2>
          {empCooptations.length === 0 ? (
            <div style={{ padding: "30px 20px", textAlign: "center", color: C.textMuted, fontSize: 13 }}>{t('emp.no_recommendation')}</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {empCooptations.map(c => {
                const timelineSteps = [
                  { key: "en_attente", label: "Recommandé", icon: UserPlus, date: c.date_cooptation },
                  { key: "embauche", label: "Embauché", icon: UserCheck, date: c.date_embauche },
                  { key: "valide", label: "Période validée", icon: CheckCircle2, date: c.date_validation },
                  { key: "recompense_versee", label: "Récompense versée", icon: Gift, date: c.date_versement },
                ];
                const statusOrder = ["en_attente", "embauche", "valide", "recompense_versee"];
                const currentIdx = c.statut === "refuse" ? -1 : statusOrder.indexOf(c.statut);
                return (
                <div key={c.id} className="iz-card" style={{ ...sCard, padding: 0, overflow: "hidden" }}>
                  <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 14, borderBottom: `1px solid ${C.border}` }}>
                    <div style={{ width: 40, height: 40, borderRadius: "50%", background: C.pinkBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <UserPlus size={18} color={C.pink} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 15, fontWeight: 600, color: C.text }}>{c.candidate_name}</div>
                      <div style={{ fontSize: 12, color: C.textMuted }}>{c.candidate_poste || "—"} · {c.candidate_email}</div>
                    </div>
                    {c.statut === "refuse" ? (
                      <span style={{ padding: "4px 12px", borderRadius: 6, fontSize: 11, fontWeight: 600, background: C.redLight, color: C.red }}>Refusé</span>
                    ) : c.recompense_versee ? (
                      <span style={{ padding: "4px 12px", borderRadius: 6, fontSize: 11, fontWeight: 600, background: C.purple + "15", color: "#7B5EA7" }}>{c.type_recompense === "prime" ? fmtCurrency(c.montant_recompense || 0) : "Cadeau reçu"}</span>
                    ) : c.statut === "embauche" && c.jours_restants !== null && c.jours_restants > 0 ? (
                      <span style={{ padding: "4px 12px", borderRadius: 6, fontSize: 11, fontWeight: 600, background: C.blueLight, color: C.blue }}>{c.jours_restants}j restants</span>
                    ) : null}
                  </div>
                  {/* Timeline */}
                  {c.statut !== "refuse" && (
                    <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 0 }}>
                      {timelineSteps.map((step, idx) => {
                        const done = idx <= currentIdx;
                        const StepIcon = step.icon;
                        return (
                        <div key={step.key} style={{ display: "flex", alignItems: "center", flex: idx < timelineSteps.length - 1 ? 1 : "none" }}>
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, minWidth: 60 }}>
                            <div style={{ width: 28, height: 28, borderRadius: "50%", background: done ? C.pink : C.bg, display: "flex", alignItems: "center", justifyContent: "center", transition: "all .3s" }}>
                              <StepIcon size={13} color={done ? C.white : C.textMuted} />
                            </div>
                            <div style={{ fontSize: 10, fontWeight: done ? 600 : 400, color: done ? C.text : C.textMuted, textAlign: "center" }}>{step.label}</div>
                            {step.date && done && <div style={{ fontSize: 9, color: C.textMuted }}>{fmtDateShort(step.date)}</div>}
                          </div>
                          {idx < timelineSteps.length - 1 && (
                            <div style={{ flex: 1, height: 2, background: idx < currentIdx ? C.pink : C.border, marginBottom: 22, transition: "all .3s" }} />
                          )}
                        </div>
                        );
                      })}
                    </div>
                  )}
                </div>
                );
              })}
            </div>
          )}

          {/* Recommend form modal */}
          {empCooptForm.open && (
            <div style={{ position: "fixed", inset: 0, zIndex: 3000, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,.35)" }} onClick={() => setEmpCooptForm(f => ({ ...f, open: false }))}>
              <div className="iz-fade-up" onClick={e => e.stopPropagation()} style={{ background: C.white, borderRadius: 16, padding: "32px", width: 480, boxShadow: "0 12px 40px rgba(0,0,0,.18)", fontFamily: font }}>
                <h3 style={{ fontSize: 18, fontWeight: 600, margin: "0 0 4px" }}>{t('emp.recommend_candidate')}</h3>
                <p style={{ fontSize: 12, color: C.textMuted, margin: "0 0 20px" }}>Vos informations seront automatiquement associées à cette recommandation.</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div><label style={{ fontSize: 11, color: C.textLight, display: "block", marginBottom: 4 }}>Nom du candidat *</label><input value={empCooptForm.candidate_name} onChange={e => setEmpCooptForm(f => ({ ...f, candidate_name: e.target.value }))} style={sInput} placeholder="Prénom Nom" /></div>
                    <div><label style={{ fontSize: 11, color: C.textLight, display: "block", marginBottom: 4 }}>Email *</label><input type="email" value={empCooptForm.candidate_email} onChange={e => setEmpCooptForm(f => ({ ...f, candidate_email: e.target.value }))} style={sInput} placeholder="email@exemple.com" /></div>
                  </div>
                  <div><label style={{ fontSize: 11, color: C.textLight, display: "block", marginBottom: 4 }}>Poste recommandé</label><input value={empCooptForm.candidate_poste} onChange={e => setEmpCooptForm(f => ({ ...f, candidate_poste: e.target.value }))} style={sInput} /></div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div><label style={{ fontSize: 11, color: C.textLight, display: "flex", alignItems: "center", gap: 4, marginBottom: 4 }}><Phone size={10} /> Téléphone</label><input value={empCooptForm.telephone || ""} onChange={e => setEmpCooptForm(f => ({ ...f, telephone: e.target.value }))} style={sInput} placeholder="+41 79 123 45 67" /></div>
                    <div><label style={{ fontSize: 11, color: C.textLight, display: "flex", alignItems: "center", gap: 4, marginBottom: 4 }}><Linkedin size={10} /> LinkedIn</label><input value={empCooptForm.linkedin_url || ""} onChange={e => setEmpCooptForm(f => ({ ...f, linkedin_url: e.target.value }))} style={sInput} placeholder="https://linkedin.com/in/..." /></div>
                  </div>
                  <div><label style={{ fontSize: 11, color: C.textLight, display: "block", marginBottom: 4 }}>Message (optionnel)</label><textarea value={empCooptForm.message} onChange={e => setEmpCooptForm(f => ({ ...f, message: e.target.value }))} style={{ ...sInput, minHeight: 60, resize: "vertical" }} placeholder="Pourquoi recommandez-vous cette personne ?" /></div>
                </div>
                <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 20 }}>
                  <button onClick={() => setEmpCooptForm(f => ({ ...f, open: false }))} className="iz-btn-outline" style={sBtn("outline")}>{t('common.cancel')}</button>
                  <button disabled={!empCooptForm.candidate_name.trim() || !empCooptForm.candidate_email.trim()} onClick={async () => {
                    try {
                      await apiCreateCooptation({
                        referrer_name: auth.user?.name || "",
                        referrer_email: auth.user?.email || "",
                        candidate_name: empCooptForm.candidate_name,
                        candidate_email: empCooptForm.candidate_email,
                        candidate_poste: empCooptForm.candidate_poste,
                        linkedin_url: empCooptForm.linkedin_url || null,
                        telephone: empCooptForm.telephone || null,
                        campaign_id: empCooptForm.campaign_id,
                        notes: empCooptForm.message,
                        date_cooptation: new Date().toISOString().slice(0, 10),
                        type_recompense: "prime",
                        mois_requis: 6,
                      });
                      setEmpCooptForm({ open: false, campaign_id: null, candidate_name: "", candidate_email: "", candidate_poste: "", telephone: "", linkedin_url: "", message: "" });
                      reloadEmpCoopt();
                      addToast_admin("Recommandation envoyée ! Merci pour votre contribution.");
                    } catch { addToast_admin("Erreur lors de l'envoi"); }
                  }} className="iz-btn-pink" style={{ ...sBtn("pink"), opacity: !empCooptForm.candidate_name.trim() || !empCooptForm.candidate_email.trim() ? 0.5 : 1 }}>{t('emp.recommend')}</button>
                </div>
              </div>
            </div>
          )}
        </div>
        );
      })()}
      {dashPage === "satisfaction" && (
        <div style={{ flex: 1, padding: "32px 40px", overflow: "auto" }}>
          <h1 style={{ fontSize: 24, fontWeight: 600, margin: "0 0 8px" }}>Satisfaction & NPS</h1>
          <p style={{ fontSize: 13, color: C.textMuted, margin: "0 0 24px" }}>Aidez-nous à améliorer votre expérience en répondant aux questionnaires ci-dessous.</p>

          {empSurveys.filter(s => s.actif).map(survey => {
            const answered = empNpsAnswers[survey.id]?.submitted;
            return (
            <div key={survey.id} className="iz-card" style={{ ...sCard, marginBottom: 16, padding: 0, overflow: "hidden" }}>
              <div style={{ padding: "20px 24px", borderBottom: answered ? "none" : `1px solid ${C.border}` }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                  <h3 style={{ fontSize: 17, fontWeight: 600, margin: 0 }}>{survey.titre}</h3>
                  {answered && <span style={{ padding: "3px 10px", borderRadius: 6, fontSize: 10, fontWeight: 600, background: C.greenLight, color: C.green }}>Répondu</span>}
                  {!answered && <span style={{ padding: "3px 10px", borderRadius: 6, fontSize: 10, fontWeight: 600, background: C.amberLight, color: C.amber }}>En attente</span>}
                </div>
                <div style={{ fontSize: 12, color: C.textLight }}>{survey.description}</div>
              </div>

              {!answered && (
                <div style={{ padding: "20px 24px" }}>
                  {(survey.questions || []).map((q: any, qi: number) => (
                    <div key={qi} style={{ marginBottom: 20 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: C.text, marginBottom: 10 }}>{qi + 1}. {q.text}</div>

                      {q.type === "nps" && (
                        <div style={{ display: "flex", gap: 6 }}>
                          {Array.from({ length: 11 }, (_, i) => i).map(n => {
                            const selected = empNpsAnswers[survey.id]?.nps === n;
                            const color = n <= 6 ? C.red : n <= 8 ? C.amber : C.green;
                            return (
                            <button key={n} onClick={() => setEmpNpsAnswers(prev => ({ ...prev, [survey.id]: { ...prev[survey.id], nps: n } }))}
                              style={{ width: 36, height: 36, borderRadius: 8, border: selected ? `2px solid ${color}` : `1px solid ${C.border}`, background: selected ? color + "20" : C.white, color: selected ? color : C.text, fontWeight: selected ? 700 : 400, fontSize: 14, cursor: "pointer", fontFamily: font, transition: "all .1s" }}>
                              {n}
                            </button>
                            );
                          })}
                          <div style={{ display: "flex", justifyContent: "space-between", width: "100%", marginTop: 4, fontSize: 10, color: C.textMuted }}>
                            <span>Pas du tout probable</span><span>Très probable</span>
                          </div>
                        </div>
                      )}

                      {q.type === "rating" && (
                        <div style={{ display: "flex", gap: 8 }}>
                          {[1, 2, 3, 4, 5].map(n => {
                            const key = `rating_${qi}`;
                            const selected = (empNpsAnswers[survey.id]?.[key] || 0) >= n;
                            return (
                            <button key={n} onClick={() => setEmpNpsAnswers(prev => ({ ...prev, [survey.id]: { ...prev[survey.id], [key]: n } }))}
                              style={{ background: "none", border: "none", cursor: "pointer", padding: 2, transition: "transform .1s" }}
                              onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.2)")}
                              onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}>
                              <Star size={28} color={C.amber} fill={selected ? C.amber : "none"} />
                            </button>
                            );
                          })}
                        </div>
                      )}

                      {q.type === "text" && (
                        <textarea value={empNpsAnswers[survey.id]?.[`text_${qi}`] || ""} onChange={e => setEmpNpsAnswers(prev => ({ ...prev, [survey.id]: { ...prev[survey.id], [`text_${qi}`]: e.target.value } }))}
                          placeholder="Votre réponse..." style={{ ...sInput, minHeight: 80, resize: "vertical" }} />
                      )}

                      {q.type === "choice" && (q.options || []).map((opt: string, oi: number) => {
                        const selected = empNpsAnswers[survey.id]?.[`choice_${qi}`] === oi;
                        return (
                        <button key={oi} onClick={() => setEmpNpsAnswers(prev => ({ ...prev, [survey.id]: { ...prev[survey.id], [`choice_${qi}`]: oi } }))}
                          style={{ display: "block", width: "100%", padding: "10px 14px", marginBottom: 6, borderRadius: 8, border: selected ? `2px solid ${C.pink}` : `1px solid ${C.border}`, background: selected ? C.pinkBg : C.white, cursor: "pointer", fontFamily: font, fontSize: 13, textAlign: "left", color: selected ? C.pink : C.text, fontWeight: selected ? 600 : 400 }}>
                          {opt}
                        </button>
                        );
                      })}
                    </div>
                  ))}

                  <button onClick={async () => {
                    const answers = empNpsAnswers[survey.id] || {};
                    try {
                      // Find or create a response for this survey
                      await apiFetch(`/nps-surveys/${survey.id}/send`, { method: "POST", body: JSON.stringify({ collaborateur_id: 0 }) }).catch(() => {});
                      // Submit the response (simplified — in prod would use the token flow)
                      addToast_admin("Merci pour votre réponse !");
                      setEmpNpsAnswers(prev => ({ ...prev, [survey.id]: { ...answers, submitted: true } }));
                    } catch { addToast_admin("Erreur lors de l'envoi"); }
                  }} className="iz-btn-pink" style={{ ...sBtn("pink"), padding: "12px 32px", fontSize: 14 }}>
                    Envoyer mes réponses
                  </button>
                </div>
              )}

              {answered && (
                <div style={{ padding: "16px 24px", background: C.greenLight + "40", textAlign: "center" }}>
                  <CheckCircle size={20} color={C.green} style={{ marginBottom: 4 }} />
                  <div style={{ fontSize: 13, fontWeight: 500, color: C.green }}>Merci pour votre participation !</div>
                </div>
              )}
            </div>
            );
          })}

          {empSurveys.filter(s => s.actif).length === 0 && (
            <div style={{ padding: "40px 20px", textAlign: "center", color: C.textMuted, fontSize: 13 }}>
              Aucun questionnaire disponible pour le moment.
            </div>
          )}
        </div>
      )}
      {dashPage === "suivi" && (
        <div style={{ flex: 1, padding: "32px 40px" }}>
          <h1 style={{ fontSize: 24, fontWeight: 600, color: C.text, margin: "0 0 20px" }}>Suivi de mon parcours</h1>
          {/* Progression card */}
          <div className="iz-card iz-fade-up" style={{ ...sCard, marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>Onboarding Standard</h3>
              <span style={{ padding: "4px 12px", borderRadius: 12, fontSize: 12, fontWeight: 600, background: employeeProgression === 100 ? C.greenLight : C.blueLight, color: employeeProgression === 100 ? C.green : C.blue }}>{employeeProgression === 100 ? "Terminé" : "En cours"}</span>
            </div>
            <div style={{ height: 10, background: C.bg, borderRadius: 5, overflow: "hidden", marginBottom: 12 }}>
              <div className="iz-progress-bar" style={{ height: "100%", width: `${Math.max(employeeProgression, 2)}%`, background: employeeProgression === 100 ? C.green : `linear-gradient(90deg, ${C.pink}, ${C.pinkSoft})`, borderRadius: 5 }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
              {[
                { label: "Documents validés", value: `${docsValidated}/${docsTotal}`, color: C.blue },
                { label: "Documents en attente", value: `${Object.values(employeeDocs).filter(s => s === "en_attente").length}`, color: C.amber },
                { label: "Actions terminées", value: `${completedActions.size}/${ACTIONS.length}`, color: C.green },
                { label: "Progression", value: `${employeeProgression}%`, color: C.pink },
              ].map((s, i) => (
                <div key={i} style={{ textAlign: "center", padding: "10px 8px", background: C.bg, borderRadius: 8 }}>
                  <div style={{ fontSize: 20, fontWeight: 700, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: C.textLight }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Phases with actions inside */}
          <div className="iz-card iz-fade-up iz-stagger-1" style={{ ...sCard, marginBottom: 20 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, margin: "0 0 16px" }}>Mon parcours détaillé</h3>
            {phases.map((ph, phIdx) => {
              const PhIcon = PHASE_ICONS[ph.nom];
              // Match actions to phases via ACTION_TEMPLATES
              const phaseActionTpls = ACTION_TEMPLATES.filter(t => t.phase === ph.nom && t.parcours === "Onboarding Standard");
              const phaseActions = ACTIONS.filter(a => {
                const tpl = ACTION_TEMPLATES.find(t => t.titre === a.title);
                return tpl && tpl.phase === ph.nom;
              });
              // Combine: employee ACTIONS that match + remaining templates
              const allPhaseItems = phaseActionTpls.map(tpl => {
                const empAction = ACTIONS.find(a => a.title === tpl.titre);
                return { tpl, empAction, isDone: empAction ? completedActions.has(empAction.id) : false };
              });
              const allDone = allPhaseItems.length > 0 && allPhaseItems.every(a => a.isDone);
              const someDone = allPhaseItems.some(a => a.isDone);
              const isCurrent = !allDone && (phIdx === 0 || phases.slice(0, phIdx).every((_, prevIdx) => {
                const prevTpls = ACTION_TEMPLATES.filter(t => t.phase === phases[prevIdx].nom && t.parcours === "Onboarding Standard");
                const prevActions = prevTpls.map(t => ACTIONS.find(a => a.title === t.titre)).filter(Boolean);
                return prevActions.length > 0 && prevActions.every(a => a && completedActions.has(a.id));
              }));
              const isPast = allDone;
              const isFuture = !isCurrent && !isPast;
              const [expanded, setExpanded] = [phIdx === 0 || isCurrent, null]; // always show current
              return (
                <div key={ph.id} style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: isCurrent ? C.pinkBg : isPast ? C.greenLight : C.bg, borderRadius: 10, borderLeft: isCurrent ? `4px solid ${C.pink}` : isPast ? `4px solid ${C.green}` : "4px solid transparent", cursor: "pointer" }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: isPast ? C.green : ph.couleur, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {isPast ? <Check size={16} color={C.white} /> : PhIcon ? <PhIcon size={16} color={C.white} /> : <CheckCircle size={16} color={C.white} />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{ph.nom}</div>
                      <div style={{ fontSize: 12, color: C.textLight }}>{ph.delaiDebut} → {ph.delaiFin} · {allPhaseItems.length} actions</div>
                    </div>
                    {isCurrent && <span style={{ padding: "3px 10px", borderRadius: 12, fontSize: 11, fontWeight: 600, background: C.pinkLight, color: C.pink }}>En cours</span>}
                    {isPast && <span style={{ padding: "3px 10px", borderRadius: 12, fontSize: 11, fontWeight: 600, background: C.greenLight, color: C.green }}>Terminé</span>}
                    {isFuture && <span style={{ fontSize: 12, color: C.textMuted }}>À venir</span>}
                  </div>
                  {/* Actions in this phase — show for current + past */}
                  {(isCurrent || isPast) && allPhaseItems.length > 0 && (
                    <div style={{ marginLeft: 28, borderLeft: `2px solid ${isPast ? C.green : C.border}`, paddingLeft: 20, marginTop: 8 }}>
                      {allPhaseItems.map((item, ai) => {
                        const empA = item.empAction;
                        return (
                          <div key={ai} className="iz-card" style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", marginBottom: 4, borderRadius: 8, border: `1px solid ${item.isDone ? C.green : C.border}`, background: item.isDone ? C.greenLight : C.white, cursor: empA && !item.isDone ? "pointer" : "default", opacity: item.isDone ? .7 : 1, transition: "all .2s" }} onClick={() => { if (empA && !item.isDone) handleCompleteAction(empA.id); }}>
                            <div style={{ width: 22, height: 22, borderRadius: "50%", border: `2px solid ${item.isDone ? C.green : C.border}`, background: item.isDone ? C.green : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                              {item.isDone && <Check size={12} color={C.white} />}
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: 13, fontWeight: 500, textDecoration: item.isDone ? "line-through" : "none", color: item.isDone ? C.textLight : C.text }}>{item.tpl.titre}</div>
                            </div>
                            {empA?.urgent && !item.isDone && <button onClick={e => { e.stopPropagation(); setShowDocPanel("admin"); }} className="iz-btn-pink" style={{ ...sBtn("pink"), padding: "4px 12px", fontSize: 11 }}>Compléter</button>}
                            {item.isDone && <span style={{ fontSize: 11, color: C.green, fontWeight: 600 }}>Fait</span>}
                            {!item.isDone && !empA && <span style={{ fontSize: 10, color: C.textMuted }}>{item.tpl.delaiRelatif}</span>}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Documents status */}
          <div className="iz-card iz-fade-up iz-stagger-2" style={{ ...sCard, marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>Mes documents</h3>
              <button onClick={() => setShowDocPanel("admin")} className="iz-btn-outline" style={{ ...sBtn("outline"), padding: "4px 14px", fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}><FileText size={14} /> Voir tout</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
              {Object.entries(employeeDocs).slice(0, 6).map(([nom, status], i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 8, background: status === "valide" ? C.greenLight : status === "en_attente" ? C.amberLight : status === "refuse" ? C.redLight : C.bg }}>
                  <div style={{ width: 24, height: 24, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: status === "valide" ? C.green : status === "en_attente" ? C.amber : status === "refuse" ? C.red : C.border }}>
                    {status === "valide" && <CheckCircle size={12} color={C.white} />}
                    {status === "en_attente" && <Clock size={12} color={C.white} />}
                    {status === "refuse" && <XCircle size={12} color={C.white} />}
                    {status === "manquant" && <FileUp size={12} color={C.white} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 500, color: C.text }}>{nom.replace(" *", "")}</div>
                    <div style={{ fontSize: 10, color: status === "valide" ? C.green : status === "en_attente" ? C.amber : status === "refuse" ? C.red : C.textMuted }}>
                      {status === "valide" ? "Validé" : status === "en_attente" ? "En attente" : status === "refuse" ? "Refusé" : "À fournir"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Équipe & contacts */}
          <div className="iz-card iz-fade-up iz-stagger-3" style={{ ...sCard, marginBottom: 20 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, margin: "0 0 12px" }}>Mon équipe</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
              {TEAM_MEMBERS.slice(0, 6).map((m, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: C.bg, borderRadius: 8 }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: m.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, color: C.white }}>{m.initials}</div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 500 }}>{m.name}</div>
                    <div style={{ fontSize: 10, color: C.textLight }}>{m.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activité récente */}
          <div className="iz-card iz-fade-up iz-stagger-4" style={{ ...sCard }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, margin: "0 0 16px" }}>Activité récente</h3>
            {sharedTimeline.slice(0, 6).map((ev, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 0", borderBottom: i < 5 ? `1px solid ${C.border}` : "none" }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: ev.type === "success" ? C.greenLight : ev.type === "email" ? C.blueLight : ev.type === "warning" ? C.amberLight : C.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {ev.type === "success" && <CheckCircle size={14} color={C.green} />}
                  {ev.type === "email" && <Mail size={14} color={C.blue} />}
                  {ev.type === "warning" && <AlertTriangle size={14} color={C.amber} />}
                  {ev.type === "system" && <Clock size={14} color={C.textLight} />}
                  {ev.type === "action" && <Zap size={14} color={C.pink} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{ev.event}</div>
                  <div style={{ fontSize: 11, color: C.textLight }}>{ev.detail}</div>
                </div>
                <div style={{ fontSize: 11, color: C.textMuted, whiteSpace: "nowrap" }}>{ev.date}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      {dashPage === "notifications" && (
        <div style={{ flex: 1, padding: "32px 40px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <h1 style={{ fontSize: 24, fontWeight: 600, color: C.text, margin: 0 }}>
              Notifications {notifUnread > 0 && <span style={{ fontSize: 14, fontWeight: 600, padding: "2px 10px", borderRadius: 10, background: C.pink, color: C.white, marginLeft: 8 }}>{notifUnread}</span>}
            </h1>
            {userNotifs.length > 0 && notifUnread > 0 && (
              <button onClick={async () => { await markAllNotifsRead(); setUserNotifs(prev => prev.map(n => ({ ...n, read_at: n.read_at || new Date().toISOString() }))); setNotifUnread(0); }} className="iz-btn-outline" style={{ ...sBtn("outline"), fontSize: 12, padding: "6px 16px" }}>Tout marquer comme lu</button>
            )}
          </div>
          {userNotifs.length === 0 ? (
            <div style={{ ...sCard, textAlign: "center", padding: 48, color: C.textLight }}>
              <Bell size={48} color={C.border} style={{ marginBottom: 12 }} />
              <p>Aucune notification pour le moment</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {userNotifs.map((n, i) => {
                const iconMap: Record<string, React.FC<any>> = { bell: Bell, check: CheckCircle, alert: AlertTriangle, file: FileText, zap: Zap, trophy: Trophy, mail: Mail, user: UserPlus, clock: Clock, party: PartyPopper };
                const IconComp = iconMap[n.icon] || Bell;
                const isUnread = !n.read_at;
                return (
                  <div key={n.id} className="iz-fade-up" onClick={async () => { if (isUnread) { await markNotifRead(n.id); setUserNotifs(prev => prev.map(x => x.id === n.id ? { ...x, read_at: new Date().toISOString() } : x)); setNotifUnread(prev => Math.max(0, prev - 1)); } }}
                    style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", background: isUnread ? C.pinkBg : (i % 2 === 0 ? C.white : C.bg), borderRadius: 10, cursor: isUnread ? "pointer" : "default", border: isUnread ? `1px solid ${C.pinkLight}` : `1px solid transparent`, transition: "all .15s" }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: `${n.color}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <IconComp size={18} color={n.color} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: isUnread ? 600 : 400, color: C.text }}>{n.title}</div>
                      <div style={{ fontSize: 12, color: C.textLight, marginTop: 2 }}>{n.content}</div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div style={{ fontSize: 10, color: C.textMuted }}>{fmtDateShort(n.created_at)}</div>
                      <div style={{ fontSize: 10, color: C.textMuted }}>{fmtTime(n.created_at)}</div>
                      {isUnread && <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.pink, marginTop: 4, marginLeft: "auto" }} />}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
      {/* Overlays */}
      {showWelcomeModal && renderWelcomeModal()}
      {renderDocPanel()}
      {renderActionDetail()}
      {renderProfileModal()}
      {/* Click overlay to close panels */}
      {(showDocPanel || showDocCategory || showActionDetail) && (
        <div onClick={() => { setShowDocPanel(null); setShowDocCategory(null); setShowActionDetail(null); }} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.3)", zIndex: 1000 }} />
      )}
      {/* Avatar photo editor modal */}
      {showAvatarEditor && (
        <>
        <div onClick={() => setShowAvatarEditor(false)} style={{ position: "fixed", inset: 0, zIndex: 1500, background: "rgba(0,0,0,.4)" }} />
        <div className="iz-scale-in" style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", background: C.white, borderRadius: 20, padding: "28px 32px", boxShadow: "0 20px 60px rgba(0,0,0,.25)", width: 380, zIndex: 1501 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <span style={{ fontSize: 16, fontWeight: 600, color: C.text }}>Ma photo de profil</span>
            <button onClick={() => setShowAvatarEditor(false)} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={18} color={C.textMuted} /></button>
          </div>
          {/* Preview */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
            <div style={{ width: 120, height: 120, borderRadius: "50%", background: avatarImage ? "none" : "linear-gradient(135deg, #E91E8C, #C2185B)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, fontWeight: 600, color: C.white, overflow: "hidden", border: `4px solid ${C.border}` }}>
              {avatarImage ? (
                <img src={avatarImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: `${avatarPos.x}% ${avatarPos.y}%`, transform: `scale(${avatarZoom / 100})` }} />
              ) : "NF"}
            </div>
          </div>
          {avatarImage ? (
            <>
              {/* Zoom */}
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12, fontWeight: 500, color: C.textLight, display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                  <span>Zoom</span><span style={{ fontSize: 11, color: C.textMuted }}>{avatarZoom}%</span>
                </label>
                <input type="range" min={100} max={250} value={avatarZoom} onChange={e => setAvatarZoom(Number(e.target.value))} style={{ width: "100%", accentColor: C.pink }} />
              </div>
              {/* Position */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 500, color: C.textLight, display: "block", marginBottom: 4 }}>Position horizontale</label>
                  <input type="range" min={0} max={100} value={avatarPos.x} onChange={e => setAvatarPos(p => ({ ...p, x: Number(e.target.value) }))} style={{ width: "100%", accentColor: C.pink }} />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 500, color: C.textLight, display: "block", marginBottom: 4 }}>Position verticale</label>
                  <input type="range" min={0} max={100} value={avatarPos.y} onChange={e => setAvatarPos(p => ({ ...p, y: Number(e.target.value) }))} style={{ width: "100%", accentColor: C.pink }} />
                </div>
              </div>
              {/* Actions */}
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => { setShowAvatarEditor(false); addToast("Photo mise à jour", "success"); }} className="iz-btn-pink" style={{ ...sBtn("pink"), flex: 1, fontSize: 13 }}>Valider</button>
                <button onClick={() => document.getElementById("avatar-upload")?.click()} className="iz-btn-outline" style={{ ...sBtn("outline"), fontSize: 13 }}>Changer</button>
                <button onClick={() => { setAvatarImage(null); setAvatarZoom(100); setAvatarPos({ x: 50, y: 50 }); localStorage.removeItem("illizeo_avatar"); updateCompanySettings({ [`avatar_${auth.user?.id}`]: "" }).catch(() => {}); }} style={{ background: "none", border: `1px solid ${C.red}`, borderRadius: 8, padding: "8px 16px", fontSize: 13, color: C.red, cursor: "pointer", fontFamily: font }}>Retirer</button>
              </div>
            </>
          ) : (
            <>
              <input id="avatar-upload" type="file" accept="image/jpeg,image/png" style={{ display: "none" }} onChange={e => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = ev => { const url = ev.target?.result as string; setAvatarImage(url); setAvatarZoom(100); setAvatarPos({ x: 50, y: 50 }); localStorage.setItem("illizeo_avatar", url); updateCompanySettings({ [`avatar_${auth.user?.id}`]: url }).catch(() => {}); };
                  reader.readAsDataURL(file);
                }
              }} />
              <div onClick={() => document.getElementById("avatar-upload")?.click()} style={{ padding: "24px 16px", borderRadius: 12, border: `2px dashed ${C.border}`, textAlign: "center", cursor: "pointer", fontSize: 13, color: C.textLight, transition: "all .2s" }}>
                <Upload size={24} color={C.textMuted} style={{ marginBottom: 8 }} /><br />
                Importer une photo<br />
                <span style={{ fontSize: 11, color: C.textMuted }}>JPG ou PNG · Max 5 Mo · Cadrage visage recommandé</span>
              </div>
            </>
          )}
        </div>
        </>
      )}
      {/* Banner customization modal */}
      {employeeBannerCustom && (
        <>
        <div onClick={() => setEmployeeBannerCustom(false)} style={{ position: "fixed", inset: 0, zIndex: 1500, background: "rgba(0,0,0,.3)" }} />
        <div className="iz-fade-up" style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", background: C.white, borderRadius: 16, padding: "24px 28px", boxShadow: "0 16px 48px rgba(0,0,0,.25)", width: 340, zIndex: 1501 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: C.text }}>Personnaliser mon bandeau</span>
            <button onClick={() => setEmployeeBannerCustom(false)} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={16} color={C.textMuted} /></button>
          </div>
          {!bannerImage && (
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 8 }}>Couleur du bandeau</label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {["#2D1B3D", "#1A1A2E", "#0D3B66", "#1B4332", "#3C1518", "#2B2D42", "#264653", "#6D214F"].map(col => (
                <div key={col} onClick={() => setEmployeeBannerColor(col)} style={{ width: 32, height: 32, borderRadius: "50%", background: col, cursor: "pointer", border: employeeBannerColor === col ? "3px solid #E91E8C" : "3px solid transparent", transition: "all .15s", transform: employeeBannerColor === col ? "scale(1.15)" : "scale(1)" }} />
              ))}
            </div>
          </div>
          )}
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 8 }}>Image de couverture</label>
            {bannerImage ? (
              <div>
                <div style={{ height: 80, borderRadius: 10, background: `url(${bannerImage})`, backgroundSize: "cover", backgroundPosition: `${bannerPos.x}% ${bannerPos.y}%`, marginBottom: 10 }} />
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => { setEmployeeBannerCustom(false); setBannerEditMode(true); }} className="iz-btn-outline" style={{ ...sBtn("outline"), flex: 1, padding: "6px 10px", fontSize: 11 }}>Repositionner</button>
                  <button onClick={() => { setBannerImage("https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=400&fit=crop"); addToast_admin("Image changée"); }} className="iz-btn-outline" style={{ ...sBtn("outline"), flex: 1, padding: "6px 10px", fontSize: 11 }}>Changer</button>
                  <button onClick={() => { setBannerImage(null); setBannerZoom(100); setBannerPos({ x: 50, y: 50 }); addToast_admin("Image retirée"); }} style={{ background: "none", border: `1px solid ${C.red}`, borderRadius: 8, padding: "6px 10px", fontSize: 11, color: C.red, cursor: "pointer", fontFamily: font }}>Retirer</button>
                </div>
              </div>
            ) : (
              <div onClick={() => { setBannerImage("https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=400&fit=crop"); setBannerEditMode(true); setEmployeeBannerCustom(false); addToast_admin("Image importée — repositionnez-la"); }} style={{ padding: "20px 16px", borderRadius: 10, border: `2px dashed ${C.border}`, textAlign: "center", cursor: "pointer", fontSize: 13, color: C.textLight }}>
                <Upload size={20} color={C.textMuted} style={{ marginBottom: 6 }} /><br />Importer une image<br /><span style={{ fontSize: 11, color: C.textMuted }}>Format recommandé : 1200×400 px</span>
              </div>
            )}
          </div>
        </div>
        </>
      )}
      {/* Toast employee notifications */}
      <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 2000, display: "flex", flexDirection: "column", gap: 8 }}>
        {toasts.filter(t => t.role === "employee").map(t => (
          <div key={t.id} className="iz-fade-up" style={{ padding: "12px 20px", borderRadius: 10, background: t.type === "success" ? C.dark : t.type === "warning" ? "#7B2D00" : C.blue, color: C.white, fontSize: 13, fontWeight: 500, boxShadow: "0 6px 20px rgba(0,0,0,.2)", maxWidth: 380, display: "flex", alignItems: "center", gap: 8 }}>
            {t.type === "success" && <CheckCircle size={16} />}
            {t.type === "warning" && <AlertTriangle size={16} />}
            {t.type === "info" && <Bell size={16} />}
            {t.message}
          </div>
        ))}
      </div>
    </div>
  );
}
