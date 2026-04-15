import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useApiData } from "./api/useApiData";
import { apiFetch } from "./api/client";
import { useAuth } from "./api/useAuth";
import { t, getLang, setLang, getAllLangs, LANG_META, type Lang } from "./i18n";
const _BUILD_VERSION = "2.1.0";
import {
  getCollaborateurs, getParcours, getActions, getGroupes, getPhases,
  getWorkflows, getEmailTemplates, getContrats, getDocumentCategories, createDocumentTemplate,
  getNotificationsConfig,
  getConversations, getMessages as apiGetMessages, sendMessage as apiSendMessage, getAvailableUsers,
  getUserNotifications, markNotifRead, markAllNotifsRead, getNotifUnreadCount,
  getCompanyBlocks, getAllCompanyBlocks, updateCompanyBlock as apiUpdateBlock, createCompanyBlock as apiCreateBlock, deleteCompanyBlock as apiDeleteBlock,
  assignActions as apiAssignActions,
  createWorkflow as apiCreateWorkflow, updateWorkflow as apiUpdateWorkflow, deleteWorkflow as apiDeleteWorkflow,
  createEmailTemplate as apiCreateEmailTpl, updateEmailTemplate as apiUpdateEmailTpl, deleteEmailTemplate as apiDeleteEmailTpl,
  createContrat as apiCreateContrat, updateContrat as apiUpdateContrat, deleteContrat as apiDeleteContrat,
  getUsers, createUser as apiCreateUser, updateUser as apiUpdateUser, deleteUser as apiDeleteUser,
  getRoles, createRole as apiCreateRole, updateRole as apiUpdateRole, deleteRole as apiDeleteRole, assignRoleUser, removeRoleUser, duplicateRole as apiDuplicateRole, getEffectivePermissions, getMyPermissions, getMyCollaborateur,
  completeMyActionByActionId as apiCompleteByAction, reactivateMyActionByActionId as apiReactivateByAction,
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
  uploadSignatureFile, sendSignatureDocToAll, getDocAcknowledgements, acknowledgeDoc, getMyPendingSignatures, getMyAcknowledgement, getContratGenerated,
  type SignatureDoc, type DocAcknowledgement,
  checkDossier, validateDossier, exportDossier, resetDossier, type DossierCheck,
  completeMyAction as apiCompleteMyAction, reactivateMyAction as apiReactivateMyAction,
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

// ─── EXTRACTED MODULES ──────────────────────────────────
import { createAdminRenders } from './admin/AdminRenderFunctions';
import { createAdminInlinePages } from './admin/AdminInlinePages';
import { createAdminPanels } from './admin/AdminPanels';
import { createEmployeeRenders } from './pages/EmployeePages';
import { createSetupWizard } from './pages/SetupWizard';
import { createAuthPages } from './pages/AuthPages';
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
    // 1. URL contains tenant subdomain (e.g. acme.illizeo.com) but NOT product subdomains like onboarding.illizeo.com
    const host = window.location.hostname;
    const parts = host.split(".");
    const productSubdomains = ["onboarding", "www", "api", "app"];
    if (parts.length >= 3 && parts[1] === "illizeo" && !productSubdomains.includes(parts[0])) {
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

  // ═══ PERMISSIONS ═══════════════════════════════════════════════
  const [userPermissions, setUserPermissions] = useState<Record<string, string>>({});
  const [userRoleSlugs, setUserRoleSlugs] = useState<string[]>([]);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [myCollabProfile, setMyCollabProfile] = useState<any>(null);
  useEffect(() => {
    if (auth.isAuthenticated) {
      getMyCollaborateur().then(c => { if (c) setMyCollabProfile(c); }).catch(() => {});
      getMyPermissions().then(res => {
        setUserPermissions(res.permissions || {});
        setUserRoleSlugs(res.roles || []);
        setIsSuperAdmin(res.is_super_admin || false);
      }).catch(() => {
        // Fallback: admin users get full access if endpoint not available yet
        if (auth.isAdmin) setIsSuperAdmin(true);
      });
    }
  }, [auth.isAuthenticated]);

  const PERM_LEVEL_VALUES: Record<string, number> = { admin: 3, edit: 2, view: 1, none: 0 };
  const hasPermission = (module: string, requiredLevel: string = "view"): boolean => {
    if (isSuperAdmin || auth.isAdmin) return true; // Super admin / legacy admin bypass
    const userLevel = userPermissions[module] || "none";
    return (PERM_LEVEL_VALUES[userLevel] || 0) >= (PERM_LEVEL_VALUES[requiredLevel] || 0);
  };

  // ═══ API DATA (fallback-first — only fetch when authenticated) ═══
  const apiEnabled = { enabled: auth.isAuthenticated };
  // Only show mock data for the editor tenant (illizeo). Other tenants get empty arrays.
  const isDemo = (localStorage.getItem("illizeo_tenant_id") || "illizeo") === "illizeo";
  const [demoMode, setDemoMode] = useState<boolean>(localStorage.getItem("illizeo_demo_mode") === "true");
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
  const [promptModal, setPromptModal] = useState<{ message: string; label: string; type: string; defaultValue: string; options?: { value: string; label: string }[]; searchable?: boolean; onSubmit: (val: string) => void } | null>(null);
  const [promptValue, setPromptValue] = useState("");
  const showPrompt = (message: string, onSubmit: (val: string) => void, opts?: { label?: string; type?: string; defaultValue?: string; options?: { value: string; label: string }[]; searchable?: boolean }) => {
    const dv = opts?.defaultValue || "";
    setPromptValue(dv);
    setPromptModal({ message, label: opts?.label || "", type: opts?.type || "text", defaultValue: dv, options: opts?.options, searchable: opts?.searchable, onSubmit });
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
  const [integrationMappings, setIntegrationMappings] = useState<any[]>([]);
  const [integrationMappingTab, setIntegrationMappingTab] = useState<"fields" | "values" | "parcours">("fields");
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [apiTab, setApiTab] = useState<"keys" | "webhooks" | "docs" | "logs">("keys");
  const [apiKeys, setApiKeys] = useState<any[]>([]);
  const [apiWebhooks, setApiWebhooks] = useState<any[]>([]);
  const [apiLogs, setApiLogs] = useState<any[]>([]);
  // Confirm dialog
  // Suivi filters
  const [suiviFilter, setSuiviFilter] = useState<"all" | "en_cours" | "en_retard" | "termine">("all");
  const [suiviSearch, setSuiviSearch] = useState("");
  const [suiviParcoursFilter, setSuiviParcoursFilter] = useState<string | null>(null);
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
  const [contratsPageTab, setContratsPageTab] = useState<"contrats" | "signatures">("contrats");
  // Language
  const [lang, setLangState] = useState<Lang>(getLang());
  const switchLang = (l: Lang) => { setLang(l); setLangState(l); updateCompanySettings({ interface_language: l }).catch(() => {}); };
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
  const [adminRoles, setAdminRoles] = useState<any[]>([]);
  const [rolePanelMode, setRolePanelMode] = useState<"closed" | "create" | "edit">("closed");
  const [rolePanelData, setRolePanelData] = useState<any>({});
  const [roleTab, setRoleTab] = useState<"scope" | "exclusions" | "members" | "security" | "history">("scope");
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
  const [permMatrixFilter, setPermMatrixFilter] = useState("");
  const [visibleRoleIds, setVisibleRoleIds] = useState<number[]>([]);
  const [rolesDropdownOpen, setRolesDropdownOpen] = useState(false);
  const [effectivePermUserId, setEffectivePermUserId] = useState<number | null>(null);
  const [securitySubTab, setSecuritySubTab] = useState<"2fa" | "password">("2fa");
  const [pwdPolicy, setPwdPolicy] = useState<Record<string, any> | null>(null);
  const [permissionLogs, setPermissionLogs] = useState<any[]>([]);
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [calendarView, setCalendarView] = useState<"month" | "week" | "list">("month");
  const [calendarListFilter, setCalendarListFilter] = useState("all");
  const [orgView, setOrgView] = useState<"tree" | "list" | "dept">("tree");
  const [orgSearch, setOrgSearch] = useState("");
  const [auditFilter, setAuditFilter] = useState("all");
  const [auditSearch, setAuditSearch] = useState("");
  const [buddyPairs, setBuddyPairs] = useState<any[]>([]);
  const [selectedBuddyPair, setSelectedBuddyPair] = useState<number | null>(null);
  // Org chart states
  const [orgExpandedNodes, setOrgExpandedNodes] = useState<string[]>(["ceo"]);
  const [orgSortCol, setOrgSortCol] = useState("nom");
  const [orgSortDir, setOrgSortDir] = useState<"asc" | "desc">("asc");
  // Buddy states
  const [buddyTab, setBuddyTab] = useState<"checklist" | "notes" | "feedback">("checklist");
  const [buddyNoteInput, setBuddyNoteInput] = useState("");
  const [buddyFeedbackRating, setBuddyFeedbackRating] = useState(0);
  const [buddyFeedbackComment, setBuddyFeedbackComment] = useState("");
  // Audit states
  const [auditExpandedEntry, setAuditExpandedEntry] = useState<number | null>(null);
  const [auditVisibleCount, setAuditVisibleCount] = useState(15);
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
  const [actionTypeFilters, setActionTypeFilters] = useState<Set<ActionType>>(new Set());
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
  const { data: apiContrats } = useApiData(getContrats, isDemo ? _mockContrats : [], { enabled: auth.isAuthenticated && auth.isAdmin });
  const [contrats, setContrats] = useState(_mockContrats);
  useEffect(() => { setContrats(apiContrats); }, [apiContrats]);
  const [contractTypes, setContractTypes] = useState<string[]>(TYPES_CONTRAT);
  const [jurisdictions, setJurisdictions] = useState<string[]>(["Suisse", "France", "Multi"]);
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
  const [employeeBannerColor, setEmployeeBannerColor] = useState(() => localStorage.getItem("illizeo_banner_color") || "#2D1B3D");
  const [employeeBannerCustom, setEmployeeBannerCustom] = useState(false);
  const [bannerImage, setBannerImage] = useState<string | null>(() => localStorage.getItem("illizeo_banner_image") || null);
  const [avatarImage, setAvatarImage] = useState<string | null>(() => localStorage.getItem("illizeo_avatar") || null);
  const [avatarZoom, setAvatarZoom] = useState(() => Number(localStorage.getItem("illizeo_avatar_zoom")) || 100);
  const [avatarPos, setAvatarPos] = useState(() => { try { return JSON.parse(localStorage.getItem("illizeo_avatar_pos") || "null") || { x: 50, y: 50 }; } catch { return { x: 50, y: 50 }; } });
  const [showAvatarEditor, setShowAvatarEditor] = useState(false);
  const [bannerZoom, setBannerZoom] = useState(() => Number(localStorage.getItem("illizeo_banner_zoom")) || 100);
  const [bannerPos, setBannerPos] = useState(() => { try { return JSON.parse(localStorage.getItem("illizeo_banner_pos") || "null") || { x: 50, y: 50 }; } catch { return { x: 50, y: 50 }; } });
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
  const [sigActionAck, setSigActionAck] = useState<any>(null);
  const [sigActionLoading, setSigActionLoading] = useState(false);
  const [sigContratData, setSigContratData] = useState<any>(null);
  const [actionTab, setActionTab] = useState<DashboardTab>("toutes");
  const [showProfile, setShowProfile] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);
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

  const [sharedTimeline, setSharedTimeline] = useState<TimelineEntry[]>(demoMode ? [
    { date: "15/02/2026", heure: "10:30", event: "Parcours onboarding créé", type: "system", detail: "Parcours « Onboarding Standard » assigné par Admin RH" },
    { date: "15/02/2026", heure: "10:31", event: "Email d'invitation envoyé", type: "email", detail: "Email envoyé à nadia.ferreira@gmail.com" },
  ] : []);

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
  const handleCompleteAction = useCallback((actionId: number, assignmentId?: number) => {
    setCompletedActions(prev => new Set(prev).add(actionId));
    const action = ACTIONS.find(a => a.id === actionId);
    if (action) {
      addTimelineEntry(`Action complétée : ${action.title}`, "success", `Marquée comme terminée par ${formData.prenom}`);
      addToast(`Action "${action.title.substring(0, 40)}..." terminée`, "success");
      addToast(`${formData.prenom} a complété : ${action.title.substring(0, 40)}...`, "info", "rh");
    }
    // Call API — use assignment ID if available, otherwise use action ID
    if (assignmentId) {
      apiCompleteMyAction(assignmentId).catch(() => {});
    } else {
      apiCompleteByAction(actionId).catch(() => {});
    }
  }, [formData.prenom, addTimelineEntry, addToast]);

  // Employee reactivates an action
  const handleReactivateAction = useCallback((actionId: number, assignmentId?: number) => {
    setCompletedActions(prev => { const s = new Set(prev); s.delete(actionId); return s; });
    const action = ACTIONS.find(a => a.id === actionId);
    if (action) {
      addToast(`Action "${action.title.substring(0, 40)}..." réactivée`, "info");
    }
    // Call API — use assignment ID if available, otherwise use action ID
    if (assignmentId) {
      apiReactivateMyAction(assignmentId).catch(() => {});
    } else {
      apiReactivateByAction(actionId).catch(() => {});
    }
  }, [addToast]);

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

  // ═══ CONTEXT OBJECT ════════════════════════════════════════
  // Builds the shared context passed to all extracted modules.
  const ctx: any = {
    // Auth
    auth, _needsPlan, isDemo, apiEnabled,
    // API data
    COLLABORATEURS, refetchCollaborateurs, PARCOURS_TEMPLATES, refetchParcours,
    ACTION_TEMPLATES, refetchActions, GROUPES, refetchGroupes,
    PHASE_DEFAULTS, refetchPhases, WORKFLOW_RULES, EMAIL_TEMPLATES,
    ADMIN_DOC_CATEGORIES, NOTIFICATIONS_LIST, integrations, refetchIntegrations,
    apiContrats, authRole,
    // Helpers
    addToast_admin, showConfirm, showPrompt, switchLang, toggleDarkMode,
    resetTr, setTr, buildTranslationsPayload,
    addToast, addTimelineEntry, handleEmployeeSubmitDoc, handleRHValidateDoc,
    handleRHRefuseDoc, handleCompleteAction, handleReactivateAction, handleRelance,
    // Computed
    docsSubmitted, docsValidated, docsTotal, docsMissing, employeeProgression,
    getLiveCollaborateurs,
    // Refs
    msgEndRef, bannerRef, messageRef, toastIdRef,
    // State (252 pairs)
    loginEmail, setLoginEmail,
    loginPassword, setLoginPassword,
    loginLoading, setLoginLoading,
    forgotMode, setForgotMode,
    forgotEmail, setForgotEmail,
    forgotSent, setForgotSent,
    forgotLoading, setForgotLoading,
    resetMode, setResetMode,
    resetToken, setResetToken,
    resetEmail, setResetEmail,
    resetPassword, setResetPassword,
    resetConfirm, setResetConfirm,
    resetLoading, setResetLoading,
    resetDone, setResetDone,
    twoFactorCode, setTwoFactorCode,
    showRegister, setShowRegister,
    tenantActiveModules, setTenantActiveModules,
    tenantSubscriptions, setTenantSubscriptions,
    selectedPlanIds, setSelectedPlanIds,
    subTab, setSubTab,
    subView, setSubView,
    subEmployeeCount, setSubEmployeeCount,
    billingInfo, setBillingInfo,
    paymentMethod, setPaymentMethod,
    storageUsage, setStorageUsage,
    signatureUsage, setSignatureUsage,
    showPricing, setShowPricing,
    plans, setPlans,
    pricingBilling, setPricingBilling,
    superAdminMode, setSuperAdminMode,
    saTab, setSaTab,
    saDashData, setSaDashData,
    saTenants, setSaTenants,
    saPlans, setSaPlans,
    saSubscriptions, setSaSubscriptions,
    saStripe, setSaStripe,
    saLoaded, setSaLoaded,
    saPlanPanel, setSaPlanPanel,
    saPlanData, setSaPlanData,
    tenantError, setTenantError,
    tenantChecking, setTenantChecking,
    tenantResolved, setTenantResolved,
    tenantInput, setTenantInput,
    regData, setRegData,
    regLoading, setRegLoading,
    regTenantSlug, setRegTenantSlug,
    twoFASetup, setTwoFASetup,
    twoFAEnabled, setTwoFAEnabled,
    twoFARecoveryCodes, setTwoFARecoveryCodes,
    twoFAConfirmCode, setTwoFAConfirmCode,
    npsSurveys, setNpsSurveys,
    npsStats, setNpsStats,
    npsTab, setNpsTab,
    npsPanelMode, setNpsPanelMode,
    npsPanelData, setNpsPanelData,
    npsSelectedSurvey, setNpsSelectedSurvey,
    badges, setBadges,
    badgeTemplates, setBadgeTemplates,
    myBadges, setMyBadges,
    badgeTplPanel, setBadgeTplPanel,
    empSurveys, setEmpSurveys,
    empNpsAnswers, setEmpNpsAnswers,
    showNotifDropdown, setShowNotifDropdown,
    empCampaigns, setEmpCampaigns,
    empCooptations, setEmpCooptations,
    empCooptForm, setEmpCooptForm,
    notifConfig, setNotifConfig,
    equipTypes, setEquipTypes,
    equipments, setEquipments,
    equipStats, setEquipStats,
    equipPanel, setEquipPanel,
    equipFilter, setEquipFilter,
    equipTab, setEquipTab,
    equipPackages, setEquipPackages,
    pkgPanel, setPkgPanel,
    signDocs, setSignDocs,
    signPanel, setSignPanel,
    signAcks, setSignAcks,
    signSelectedDoc, setSignSelectedDoc,
    myPendingSigs, setMyPendingSigs,
    showSetupWizard, setShowSetupWizard,
    setupStep, setSetupStep,
    setupData, setSetupData,
    setupCompleted, setSetupCompleted,
    role, setRole,
    step, setStep,
    showPreboard, setShowPreboard,
    dashPage, setDashPage,
    adminPage, setAdminPage,
    sidebarCollapsed, setSidebarCollapsed,
    adminModal, setAdminModal,
    parcoursFilter, setParcoursFilter,
    actionFilter, setActionFilter,
    toast, setToast,
    promptModal, setPromptModal,
    promptValue, setPromptValue,
    selectedCollab, setSelectedCollab,
    selectedParcours, setSelectedParcours,
    adminSearchQuery, setAdminSearchQuery,
    adminActionsTab, setAdminActionsTab,
    parcoursTab, setParcoursTab,
    parcoursCat, setParcoursCat,
    selectedParcoursId, setSelectedParcoursId,
    parcoursPanelMode, setParcoursPanelMode,
    parcoursPanelData, setParcoursPanelData,
    parcoursPanelLoading, setParcoursPanelLoading,
    phasePanelMode, setPhasePanelMode,
    phasePanelData, setPhasePanelData,
    phasePanelLoading, setPhasePanelLoading,
    actionPanelMode, setActionPanelMode,
    actionPanelData, setActionPanelData,
    actionPanelLoading, setActionPanelLoading,
    assignMode, setAssignMode,
    assignSelected, setAssignSelected,
    assignSearch, setAssignSearch,
    assignOpen, setAssignOpen,
    collabPanelMode, setCollabPanelMode,
    collabPanelData, setCollabPanelData,
    collabPanelLoading, setCollabPanelLoading,
    collabProfileId, setCollabProfileId,
    collabProfileTab, setCollabProfileTab,
    dossierCheck, setDossierCheck,
    groupePanelMode, setGroupePanelMode,
    groupePanelData, setGroupePanelData,
    groupePanelLoading, setGroupePanelLoading,
    integrationPanelId, setIntegrationPanelId,
    integrationConfig, setIntegrationConfig,
    integrationSaving, setIntegrationSaving,
    integrationMappings, setIntegrationMappings, integrationMappingTab, setIntegrationMappingTab,
    apiKeyInput, setApiKeyInput,
    apiTab, setApiTab, apiKeys, setApiKeys, apiWebhooks, setApiWebhooks, apiLogs, setApiLogs,
    suiviFilter, setSuiviFilter,
    suiviSearch, setSuiviSearch,
    suiviParcoursFilter, setSuiviParcoursFilter,
    collabMenuId, setCollabMenuId,
    adMappings, setAdMappings,
    adGroups, setAdGroups,
    syncLoading, setSyncLoading,
    obTeams, setObTeams,
    teamPanelMode, setTeamPanelMode,
    teamPanelData, setTeamPanelData,
    wfPanelMode, setWfPanelMode,
    wfPanelData, setWfPanelData,
    tplPanelMode, setTplPanelMode,
    tplPanelData, setTplPanelData,
    contratPanelMode, setContratPanelMode,
    contratPanelData, setContratPanelData,
    contratsPageTab, setContratsPageTab,
    lang, setLangState,
    darkMode, setDarkMode, demoMode, setDemoMode,
    activeLanguages, setActiveLanguages,
    contentTranslations, setContentTranslations,
    fieldConfig, setFieldConfig,
    translateFieldId, setTranslateFieldId,
    translateEN, setTranslateEN,
    adminUsers, setAdminUsers,
    adminRoles, setAdminRoles, rolePanelMode, setRolePanelMode, rolePanelData, setRolePanelData,
    hasPermission, isSuperAdmin, userPermissions, userRoleSlugs, myCollabProfile,
    roleTab, setRoleTab, selectedRoleId, setSelectedRoleId, permMatrixFilter, setPermMatrixFilter,
    visibleRoleIds, setVisibleRoleIds, rolesDropdownOpen, setRolesDropdownOpen, effectivePermUserId, setEffectivePermUserId,
    permissionLogs, setPermissionLogs, securitySubTab, setSecuritySubTab, pwdPolicy, setPwdPolicy,
    calendarMonth, setCalendarMonth, calendarView, setCalendarView, calendarListFilter, setCalendarListFilter,
    orgView, setOrgView, orgSearch, setOrgSearch, auditFilter, setAuditFilter, auditSearch, setAuditSearch, buddyPairs, setBuddyPairs, selectedBuddyPair, setSelectedBuddyPair,
    orgExpandedNodes, setOrgExpandedNodes, orgSortCol, setOrgSortCol, orgSortDir, setOrgSortDir,
    buddyTab, setBuddyTab, buddyNoteInput, setBuddyNoteInput, buddyFeedbackRating, setBuddyFeedbackRating, buddyFeedbackComment, setBuddyFeedbackComment,
    auditExpandedEntry, setAuditExpandedEntry, auditVisibleCount, setAuditVisibleCount,
    userPanelMode, setUserPanelMode,
    userPanelData, setUserPanelData,
    userPanelLoading, setUserPanelLoading,
    userSearch, setUserSearch,
    userRoleFilter, setUserRoleFilter,
    gedTab, setGedTab,
    gedSearch, setGedSearch,
    gedCatFilter, setGedCatFilter,
    tplPanelOpen, setTplPanelOpen,
    tplPanelDoc, setTplPanelDoc,
    selectedDocsForValidation, setSelectedDocsForValidation,
    realDocs, setRealDocs,
    emailConfig, setEmailConfig,
    tplCatFilter, setTplCatFilter,
    tplPreview, setTplPreview,
    themeColor, setThemeColor,
    region, setRegion,
    dateFormat, setDateFormat,
    timeFormat, setTimeFormat,
    timezone, setTimezone,
    customLogo, setCustomLogo,
    customLogoFull, setCustomLogoFull,
    loginBgImage, setLoginBgImage,
    customFavicon, setCustomFavicon,
    cooptations, setCooptations,
    cooptStats, setCooptStats,
    cooptSettings, setCooptSettings,
    cooptFilter, setCooptFilter,
    cooptCampaignFilter, setCooptCampaignFilter,
    cooptPanelMode, setCooptPanelMode,
    cooptPanelData, setCooptPanelData,
    cooptSettingsOpen, setCooptSettingsOpen,
    cooptTab, setCooptTab,
    campaigns, setCampaigns,
    leaderboard, setLeaderboard,
    campaignPanelMode, setCampaignPanelMode,
    campaignPanelData, setCampaignPanelData,
    companyBlocks, setCompanyBlocks,
    editingBlockId, setEditingBlockId,
    userNotifs, setUserNotifs,
    notifUnread, setNotifUnread,
    msgConversations, setMsgConversations,
    msgActiveConvId, setMsgActiveConvId,
    msgMessages, setMsgMessages,
    msgInput, setMsgInput,
    msgSending, setMsgSending,
    msgUsers, setMsgUsers,
    msgShowNewConv, setMsgShowNewConv,
    msgSearchQuery, setMsgSearchQuery,
    confirmDialog, setConfirmDialog,
    selectedAction, setSelectedAction,
    actionTypeFilters, setActionTypeFilters,
    actionParcoursFilter, setActionParcoursFilter,
    selectedActionType, setSelectedActionType,
    suspendedParcours, setSuspendedParcours,
    docPieces, setDocPieces,
    parcoursStatut, setParcoursStatut,
    groupeColor, setGroupeColor,
    groupeMembres, setGroupeMembres,
    contrats, setContrats, contractTypes, setContractTypes, jurisdictions, setJurisdictions,
    selectedContratId, setSelectedContratId,
    entrepriseBlocs, setEntrepriseBlocs,
    entrepriseVideos, setEntrepriseVideos,
    gradientColor, setGradientColor,
    bannerUploaded, setBannerUploaded,
    employeeBannerColor, setEmployeeBannerColor,
    employeeBannerCustom, setEmployeeBannerCustom,
    bannerImage, setBannerImage,
    avatarImage, setAvatarImage,
    avatarZoom, setAvatarZoom,
    avatarPos, setAvatarPos,
    showAvatarEditor, setShowAvatarEditor,
    bannerZoom, setBannerZoom,
    bannerPos, setBannerPos,
    bannerDragging, setBannerDragging,
    bannerEditMode, setBannerEditMode,
    uploadedPieces, setUploadedPieces,
    modalPieces, setModalPieces,
    modalFormFields, setModalFormFields,
    modalQuestions, setModalQuestions,
    modalSubtasks, setModalSubtasks,
    phases, setPhases,
    selectedPhaseId, setSelectedPhaseId,
    messageCanal, setMessageCanal,
    messageBody, setMessageBody,
    showWelcomeModal, setShowWelcomeModal,
    showDocPanel, setShowDocPanel,
    showDocCategory, setShowDocCategory,
    showActionDetail, setShowActionDetail, sigActionAck, setSigActionAck, sigActionLoading, setSigActionLoading, sigContratData, setSigContratData,
    actionTab, setActionTab,
    showProfile, setShowProfile,
    showTeamModal, setShowTeamModal,
    profileTab, setProfileTab,
    formData, setFormData,
    passwordVisible, setPasswordVisible,
    acceptCGU, setAcceptCGU,
    employeeDocs, setEmployeeDocs,
    completedActions, setCompletedActions,
    sharedTimeline, setSharedTimeline,
    toasts, setToasts,
  };

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
        if (s.interface_language && ['fr','en','de','it','es'].includes(s.interface_language)) { setLang(s.interface_language as Lang); setLangState(s.interface_language as Lang); }
        if (s.active_languages) { try { const langs = JSON.parse(s.active_languages); setActiveLanguages(langs); localStorage.setItem("illizeo_active_languages", s.active_languages); } catch {} }
        // Contract types & jurisdictions from company settings
        if (s.contract_types) try { setContractTypes(JSON.parse(s.contract_types)); } catch {}
        if (s.jurisdictions) try { setJurisdictions(JSON.parse(s.jurisdictions)); } catch {}
        if (s.demo_mode !== undefined) { const dm = s.demo_mode === "true" || s.demo_mode === true; setDemoMode(dm); localStorage.setItem("illizeo_demo_mode", String(dm)); }
        // Setup wizard: show for new tenants (no setup_completed flag)
        if (auth.isAdmin && !s.setup_completed) {
          setShowSetupWizard(true);
          if (s.setup_steps_done) try { setSetupCompleted(JSON.parse(s.setup_steps_done)); } catch {}
          if (s.company_name) setSetupData(prev => ({ ...prev, company_name: s.company_name }));
        }
        // Load avatar & banner per user
        const avatarKey = `avatar_${auth.user?.id}`;
        if (s[avatarKey]) { setAvatarImage(s[avatarKey]); localStorage.setItem("illizeo_avatar", s[avatarKey]); }
        const bannerColorKey = `banner_color_${auth.user?.id}`;
        if (s[bannerColorKey]) { setEmployeeBannerColor(s[bannerColorKey]); localStorage.setItem("illizeo_banner_color", s[bannerColorKey]); }
        const bannerImageKey = `banner_image_${auth.user?.id}`;
        if (s[bannerImageKey]) { setBannerImage(s[bannerImageKey]); localStorage.setItem("illizeo_banner_image", s[bannerImageKey]); }
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
    if (auth.isAuthenticated && auth.isAdmin && adminPage === "admin_contrats") {
      getSignatureDocuments().then(setSignDocs).catch(() => {});
    }
  }, [auth.isAuthenticated, adminPage]);
  // Load employee pending signatures
  useEffect(() => {
    if (auth.isAuthenticated && !auth.isAdmin) {
      getMyPendingSignatures().then(setMyPendingSigs).catch(() => {});
    }
  }, [auth.isAuthenticated]);
  // Load signature acknowledgement when opening a signature-type action detail
  useEffect(() => {
    if (!showActionDetail) { setSigActionAck(null); setSigContratData(null); return; }
    // Try admin templates first, then employee's own actions
    const empActions = (myCollabProfile as any)?.parcours_actions || [];
    const empAction = empActions.find((a: any) => a.id === showActionDetail);
    const mockAction = ACTIONS.find((a: any) => a.id === showActionDetail);
    const tpl = ACTION_TEMPLATES.find((t: any) => t.titre === (empAction?.titre || mockAction?.title));
    const actionOptions = tpl?.options || empAction?.options;
    const actionType = tpl?.type || empAction?.type;
    if (actionType === "signature") {
      const contratId = actionOptions?.contrat_id;
      const sigDocId = actionOptions?.signature_document_id;
      if (contratId) {
        // Personalized contrat
        setSigContratData(null); setSigActionAck(null);
        getContratGenerated(contratId).then(setSigContratData).catch(() => {});
      } else if (sigDocId) {
        // Generic document to sign
        setSigActionAck(null); setSigContratData(null);
        getMyAcknowledgement(sigDocId).then(setSigActionAck).catch(() => {});
      }
    }
  }, [showActionDetail]);
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
      getRoles().then(setAdminRoles).catch(() => {});
    }
  }, [auth.isAuthenticated, adminPage]);

  // ─── Roles effects ──────────────────────────────────────────
  useEffect(() => {
    if (auth.isAuthenticated && auth.isAdmin && adminPage === "admin_roles") {
      getRoles().then(setAdminRoles).catch(() => {});
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

  // ═══ EXTRACTED MODULE FACTORIES ════════════════════════════
  // Must be after all hooks/effects but before early returns
  ctx.getLiveDocCategories = getLiveDocCategories;
  ctx.saveSetting = saveSetting;
  ctx.hasTrackedOnboard = hasTrackedOnboard;

  // SIDEBAR_ITEMS must be built before factories since EmployeePages destructures it
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
  ctx.SIDEBAR_ITEMS = SIDEBAR_ITEMS;

  const empRenders = createEmployeeRenders(ctx);
  const {
    renderSidebar, renderActionCard, renderDashboard, renderMesActions,
    renderMessagerie, renderCompanyBlock, renderEntreprise, renderRapports,
    renderWelcomeModal, renderDocPanel, renderActionDetail, renderProfileModal,
    handleBannerFileUpload, handleSendMessage,
  } = empRenders;

  ctx.renderActionCard = renderActionCard;
  ctx.renderCompanyBlock = renderCompanyBlock;
  ctx.renderMessagerie = renderMessagerie;
  ctx.handleBannerFileUpload = handleBannerFileUpload;
  ctx.handleSendMessage = handleSendMessage;

  const setupWiz = createSetupWizard(ctx);
  const { renderSetupWizard, markSetupStepDone, finishSetupWizard, SETUP_STEPS } = setupWiz;
  ctx.markSetupStepDone = markSetupStepDone;
  ctx.finishSetupWizard = finishSetupWizard;
  ctx.SETUP_STEPS = SETUP_STEPS;

  const trialStart = localStorage.getItem("illizeo_trial_start");

  const authPages = createAuthPages(ctx);
  const adminRenders = createAdminRenders(ctx);
  const {
    renderDashboard_admin, renderSuivi, renderCollabProfile, renderParcours,
    renderDocuments, renderWorkflows, renderTemplates, renderEquipes,
    renderNotifications_admin, renderEntreprise_admin, renderMessagerie_admin,
    renderNPS, renderContrats, renderCooptation, renderIntegrations,
    renderSidebar_admin, PARCOURS_CAT_META, hasModule, isPageAccessible,
    isEditorTenant, isInTrial, trialExpired, hasActiveSub, SIDEBAR,
  } = adminRenders as any;

  const adminInline = createAdminInlinePages(ctx);
  const adminPanels = createAdminPanels(ctx);

  // ─── AUTH GUARDS (early returns) ─────────────────────────
  if (resetMode && !auth.isAuthenticated) return authPages.renderResetPassword();
  if (auth.twoFactorPending) return authPages.renderTwoFactorVerify();
  if (showPricing) return authPages.renderPricing();
  if (!auth.isAuthenticated && !tenantResolved && !showRegister) return authPages.renderTenantSelection();
  if (!auth.isAuthenticated && showRegister) return authPages.renderRegister();
  if (!auth.isAuthenticated) return authPages.renderLogin();
  if (step === "email") return authPages.renderEmailInvitation();
  // ─── STEP 1: WELCOME (Banner + Video combined) ─────────────
  if (showPreboard && role !== "rh" && step === "welcome_banner") {
    return (
      <div style={{ minHeight: "100vh", fontFamily: font, display: "flex" }}>
        <PreboardSidebar />
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {/* Hero banner — full width */}
          <div className="iz-fade-in" style={{ height: 280, background: "linear-gradient(135deg, #2D1B3D 0%, #4A1942 30%, #C2185B 70%, #E91E8C 100%)", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", position: "relative", flexShrink: 0 }}>
            <div style={{ position: "absolute", top: 20, left: 24 }}><IllizeoLogo size={36} /></div>
            <h1 className="iz-fade-up" style={{ fontSize: 32, fontWeight: 700, color: "#fff", textShadow: "0 2px 12px rgba(0,0,0,.2)", textAlign: "center", lineHeight: 1.3 }}>
              {lang === "fr" ? "Bonjour" : "Hello"} {auth.user?.name?.split(" ")[0] || ""} !<br /><span style={{ fontWeight: 400, fontSize: 20, opacity: .9 }}>{lang === "fr" ? "Bienvenue au sein de nos équipes" : "Welcome to the team"}</span>
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
              <span>{t('trial.banner')} — <b>{trialDaysLeft} {t('trial.days_left')}</b>. {t('trial.all_features')}</span>
              <button onClick={() => { setAdminPage("admin_abonnement" as any); setSubView("change"); }} style={{ padding: "4px 16px", borderRadius: 6, background: C.white, color: C.blue, border: "none", cursor: "pointer", fontFamily: font, fontSize: 12, fontWeight: 600 }}>{t('trial.subscribe')}</button>
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
        {adminPage === "admin_gamification" && adminInline.renderAdminGamification()}
        {adminPage === "admin_users" && adminInline.renderAdminUsers()}
        {adminPanels.renderGroupePanel()}
        {adminPanels.renderActionPanel()}
        {/* ── Confirm Dialog ──────────────────────────────────── */}
        {/* ── Subscription page (for non-editor tenants) ───── */}
        {adminPage === "admin_abonnement" && adminInline.renderAdminAbonnement()}

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
        {adminPage === "admin_fields" && adminInline.renderAdminFields()}
        {adminPage === "admin_apparence" && adminInline.renderAdminApparence()}
        {adminPage === "admin_2fa" && adminInline.renderAdmin2FA()}
        {adminPage === "admin_password_policy" && adminInline.renderAdminPasswordPolicy()}
        {/* ═══ EQUIPMENT MANAGEMENT ═══════════════════════════════ */}
        {adminPage === "admin_equipements" && adminInline.renderAdminEquipements()}

        {adminPage === "admin_donnees" && adminInline.renderAdminDonnees()}
        {adminPage === "admin_provisioning" && adminInline.renderAdminProvisioning()}
        {/* ═══ ROLES & PERMISSIONS ═════════════════════════════════ */}
        {adminPage === "admin_roles" && adminInline.renderAdminRoles()}
        {/* ═══ CALENDAR ═══════════════════════════════════════════ */}
        {adminPage === "admin_calendar" && adminInline.renderAdminCalendar()}
        {/* ═══ ORG CHART ═══════════════════════════════════════════ */}
        {adminPage === "admin_orgchart" && adminInline.renderAdminOrgChart()}
        {/* ═══ BUDDY / PARRAIN ════════════════════════════════════ */}
        {adminPage === "admin_buddy" && adminInline.renderAdminBuddy()}
        {/* ═══ AUDIT LOG ═══════════════════════════════════════════ */}
        {adminPage === "admin_audit" && adminInline.renderAdminAuditLog()}
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
                  <h3 style={{ fontSize: 17, fontWeight: 600, margin: 0 }}>{t('fields.translate_title')}</h3>
                  <button onClick={() => setTranslateFieldId(null)} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={20} color={C.textLight} /></button>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>{LANG_META.fr.nativeName} (FR)</label>
                  <input value={fc.label} disabled style={{ ...sInput, fontSize: 13, background: C.bg, color: C.textMuted }} />
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>{LANG_META.en.nativeName} (EN)</label>
                  <input value={translateEN} onChange={e => setTranslateEN(e.target.value)} placeholder={`${LANG_META.en.nativeName}...`} style={{ ...sInput, fontSize: 13 }} />
                </div>
                <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                  <button onClick={() => setTranslateFieldId(null)} style={{ ...sBtn("outline"), fontSize: 13 }}>{t('common.cancel')}</button>
                  <button onClick={async () => {
                    await apiUpdateFieldConfig(fc.id, { label_en: translateEN });
                    setFieldConfig(prev => prev.map(f => f.id === fc.id ? { ...f, label_en: translateEN } : f));
                    addToast_admin(`${t('fields.translation_saved')} : ${fc.label} → ${translateEN}`);
                    setTranslateFieldId(null);
                  }} className="iz-btn-pink" style={{ ...sBtn("pink"), fontSize: 13 }}>{t('common.save')}</button>
                </div>
              </div>
            </div>
          );
        })()}
        {toast && (
          <div className="iz-fade-up" style={{ position: "fixed", bottom: 24, right: 24, zIndex: 2000, padding: "12px 20px", borderRadius: 10, background: darkMode ? C.white : C.dark, color: darkMode ? C.dark : C.white, fontSize: 13, fontWeight: 500, boxShadow: "0 6px 20px rgba(0,0,0,.3)", display: "flex", alignItems: "center", gap: 8 }}>
            <CheckCircle size={16} /> {toast}
          </div>
        )}
        {/* (confirm modal unified with confirmDialog above) */}
        {adminPanels.renderPromptModal()}
        {adminPanels.renderCollabPanel()}
        {adminPanels.renderParcoursPanel()}
        {adminPanels.renderPhasePanel()}
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
              <p style={{ fontSize: 13, color: C.textMuted, marginTop: 4 }}>{t('emp.referral_subtitle')}</p>
            </div>
          </div>

          {/* My cooptation stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 24 }}>
            <div className="iz-card" style={{ ...sCard, textAlign: "center", padding: "20px" }}>
              <Handshake size={24} color={C.pink} style={{ marginBottom: 8 }} />
              <div style={{ fontSize: 24, fontWeight: 700, color: C.text }}>{empCooptations.length}</div>
              <div style={{ fontSize: 11, color: C.textMuted }}>{t('emp.my_referrals_count')}</div>
            </div>
            <div className="iz-card" style={{ ...sCard, textAlign: "center", padding: "20px" }}>
              <CheckCircle size={24} color={C.green} style={{ marginBottom: 8 }} />
              <div style={{ fontSize: 24, fontWeight: 700, color: C.green }}>{empCooptations.filter(c => c.statut === "embauche" || c.statut === "valide" || c.statut === "recompense_versee").length}</div>
              <div style={{ fontSize: 11, color: C.textMuted }}>{t('emp.hired')}</div>
            </div>
            <div className="iz-card" style={{ ...sCard, textAlign: "center", padding: "20px" }}>
              <Gift size={24} color={C.amber} style={{ marginBottom: 8 }} />
              <div style={{ fontSize: 24, fontWeight: 700, color: C.amber }}>{empCooptations.filter(c => c.recompense_versee).length}</div>
              <div style={{ fontSize: 11, color: C.textMuted }}>{t('emp.rewards_received')}</div>
            </div>
          </div>

          {/* Active campaigns */}
          <h2 style={{ fontSize: 17, fontWeight: 600, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}><Target size={18} color={C.pink} /> {t('emp.open_positions')}</h2>
          {activeCampaigns.length === 0 && <div style={{ padding: "30px 20px", textAlign: "center", color: C.textMuted, fontSize: 13, marginBottom: 24 }}>{t('emp.no_open_positions')}</div>}
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
                    <span style={{ color: C.textMuted }}> {t('emp.reward_label')}</span>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/cooptation/${camp.share_token}`); addToast_admin(t('emp.link_copied')); }} title={t('emp.share')} className="iz-btn-outline" style={{ ...sBtn("outline"), padding: "5px 10px", fontSize: 11, display: "flex", alignItems: "center", gap: 4 }}><Link size={11} /> {t('emp.share')}</button>
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
                  { key: "en_attente", label: t('emp.timeline_recommended'), icon: UserPlus, date: c.date_cooptation },
                  { key: "embauche", label: t('emp.timeline_hired'), icon: UserCheck, date: c.date_embauche },
                  { key: "valide", label: t('emp.timeline_validated'), icon: CheckCircle2, date: c.date_validation },
                  { key: "recompense_versee", label: t('emp.timeline_rewarded'), icon: Gift, date: c.date_versement },
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
                      <span style={{ padding: "4px 12px", borderRadius: 6, fontSize: 11, fontWeight: 600, background: C.redLight, color: C.red }}>{t('emp.refused')}</span>
                    ) : c.recompense_versee ? (
                      <span style={{ padding: "4px 12px", borderRadius: 6, fontSize: 11, fontWeight: 600, background: C.purple + "15", color: "#7B5EA7" }}>{c.type_recompense === "prime" ? fmtCurrency(c.montant_recompense || 0) : t('emp.gift_received')}</span>
                    ) : c.statut === "embauche" && c.jours_restants !== null && c.jours_restants > 0 ? (
                      <span style={{ padding: "4px 12px", borderRadius: 6, fontSize: 11, fontWeight: 600, background: C.blueLight, color: C.blue }}>{c.jours_restants} {t('emp.days_remaining')}</span>
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
                <p style={{ fontSize: 12, color: C.textMuted, margin: "0 0 20px" }}>{t('emp.recommend_info')}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div><label style={{ fontSize: 11, color: C.textLight, display: "block", marginBottom: 4 }}>{t('emp.candidate_name')} *</label><input value={empCooptForm.candidate_name} onChange={e => setEmpCooptForm(f => ({ ...f, candidate_name: e.target.value }))} style={sInput} placeholder={t('label.firstname') + " " + t('label.lastname')} /></div>
                    <div><label style={{ fontSize: 11, color: C.textLight, display: "block", marginBottom: 4 }}>{t('label.email')} *</label><input type="email" value={empCooptForm.candidate_email} onChange={e => setEmpCooptForm(f => ({ ...f, candidate_email: e.target.value }))} style={sInput} placeholder="email@exemple.com" /></div>
                  </div>
                  <div><label style={{ fontSize: 11, color: C.textLight, display: "block", marginBottom: 4 }}>{t('emp.recommended_position')}</label><input value={empCooptForm.candidate_poste} onChange={e => setEmpCooptForm(f => ({ ...f, candidate_poste: e.target.value }))} style={sInput} /></div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div><label style={{ fontSize: 11, color: C.textLight, display: "flex", alignItems: "center", gap: 4, marginBottom: 4 }}><Phone size={10} /> {t('label.phone')}</label><input value={empCooptForm.telephone || ""} onChange={e => setEmpCooptForm(f => ({ ...f, telephone: e.target.value }))} style={sInput} placeholder="+41 79 123 45 67" /></div>
                    <div><label style={{ fontSize: 11, color: C.textLight, display: "flex", alignItems: "center", gap: 4, marginBottom: 4 }}><Linkedin size={10} /> LinkedIn</label><input value={empCooptForm.linkedin_url || ""} onChange={e => setEmpCooptForm(f => ({ ...f, linkedin_url: e.target.value }))} style={sInput} placeholder="https://linkedin.com/in/..." /></div>
                  </div>
                  <div><label style={{ fontSize: 11, color: C.textLight, display: "block", marginBottom: 4 }}>{t('emp.message_optional')}</label><textarea value={empCooptForm.message} onChange={e => setEmpCooptForm(f => ({ ...f, message: e.target.value }))} style={{ ...sInput, minHeight: 60, resize: "vertical" }} placeholder={t('emp.message_placeholder')} /></div>
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
                      addToast_admin(t('emp.recommendation_sent'));
                    } catch { addToast_admin(t('emp.send_error')); }
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
          <h1 style={{ fontSize: 24, fontWeight: 600, margin: "0 0 8px" }}>{t('emp.nps_title')}</h1>
          <p style={{ fontSize: 13, color: C.textMuted, margin: "0 0 24px" }}>{t('emp.nps_subtitle')}</p>

          {empSurveys.filter(s => s.actif).map(survey => {
            const answered = empNpsAnswers[survey.id]?.submitted;
            return (
            <div key={survey.id} className="iz-card" style={{ ...sCard, marginBottom: 16, padding: 0, overflow: "hidden" }}>
              <div style={{ padding: "20px 24px", borderBottom: answered ? "none" : `1px solid ${C.border}` }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                  <h3 style={{ fontSize: 17, fontWeight: 600, margin: 0 }}>{survey.titre}</h3>
                  {answered && <span style={{ padding: "3px 10px", borderRadius: 6, fontSize: 10, fontWeight: 600, background: C.greenLight, color: C.green }}>{t('emp.nps_answered')}</span>}
                  {!answered && <span style={{ padding: "3px 10px", borderRadius: 6, fontSize: 10, fontWeight: 600, background: C.amberLight, color: C.amber }}>{t('emp.nps_pending')}</span>}
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
                            <span>{t('emp.nps_not_likely')}</span><span>{t('emp.nps_very_likely')}</span>
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
                          placeholder={t('emp.nps_placeholder')} style={{ ...sInput, minHeight: 80, resize: "vertical" }} />
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
                      addToast_admin(t('emp.nps_thanks_toast'));
                      setEmpNpsAnswers(prev => ({ ...prev, [survey.id]: { ...answers, submitted: true } }));
                    } catch { addToast_admin(t('emp.send_error')); }
                  }} className="iz-btn-pink" style={{ ...sBtn("pink"), padding: "12px 32px", fontSize: 14 }}>
                    {t('emp.nps_submit')}
                  </button>
                </div>
              )}

              {answered && (
                <div style={{ padding: "16px 24px", background: C.greenLight + "40", textAlign: "center" }}>
                  <CheckCircle size={20} color={C.green} style={{ marginBottom: 4 }} />
                  <div style={{ fontSize: 13, fontWeight: 500, color: C.green }}>{t('emp.nps_thanks')}</div>
                </div>
              )}
            </div>
            );
          })}

          {empSurveys.filter(s => s.actif).length === 0 && (
            <div style={{ padding: "40px 20px", textAlign: "center", color: C.textMuted, fontSize: 13 }}>
              {t('emp.nps_no_surveys')}
            </div>
          )}
        </div>
      )}
      {dashPage === "suivi" && (() => {
        const _myCollab = myCollabProfile || COLLABORATEURS.find((c: any) => c.email === auth.user?.email);
        const _myParcours = _myCollab ? PARCOURS_TEMPLATES.find((p: any) => p.id === _myCollab.parcours_id) : null;
        const _myParcoursName = (_myCollab as any)?.parcours_nom || _myParcours?.nom || "Onboarding Standard";
        const _myProfileActions = (_myCollab as any)?.parcours_actions || [];
        const _myActionTpls = _myProfileActions.length > 0 ? _myProfileActions : ACTION_TEMPLATES.filter((a: any) => a.parcours === _myParcoursName);
        const _myActions = _myActionTpls.length > 0 ? _myActionTpls.map((a: any, i: number) => ({
          id: a.id || i + 1, title: a.titre, subtitle: a.description || "",
        })) : ACTIONS;
        return (
        <div style={{ flex: 1, padding: "32px 40px" }}>
          <h1 style={{ fontSize: 24, fontWeight: 600, color: C.text, margin: "0 0 20px" }}>{t('emp.tracking_title')}</h1>
          {/* Progression card */}
          <div className="iz-card iz-fade-up" style={{ ...sCard, marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>{_myParcoursName}</h3>
              <span style={{ padding: "4px 12px", borderRadius: 12, fontSize: 12, fontWeight: 600, background: employeeProgression === 100 ? C.greenLight : C.blueLight, color: employeeProgression === 100 ? C.green : C.blue }}>{employeeProgression === 100 ? t('emp.completed') : t('emp.in_progress')}</span>
            </div>
            <div style={{ height: 10, background: C.bg, borderRadius: 5, overflow: "hidden", marginBottom: 12 }}>
              <div className="iz-progress-bar" style={{ height: "100%", width: `${Math.max(employeeProgression, 2)}%`, background: employeeProgression === 100 ? C.green : `linear-gradient(90deg, ${C.pink}, ${C.pinkSoft})`, borderRadius: 5 }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
              {[
                { label: t('emp.docs_validated'), value: `${docsValidated}/${docsTotal}`, color: C.blue },
                { label: t('emp.docs_pending'), value: `${Object.values(employeeDocs).filter(s => s === "en_attente").length}`, color: C.amber },
                { label: t('emp.actions_completed'), value: `${completedActions.size}/${_myActions.length}`, color: C.green },
                { label: t('emp.progression'), value: `${employeeProgression}%`, color: C.pink },
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
            <h3 style={{ fontSize: 15, fontWeight: 600, margin: "0 0 16px" }}>{t('emp.detailed_path')}</h3>
            {((_myCollab as any)?.parcours_phases?.length > 0
              ? (_myCollab as any).parcours_phases.map((p: any) => ({ id: p.id, nom: p.nom, delaiDebut: p.delai_debut, delaiFin: p.delai_fin, couleur: p.couleur }))
              : phases
            ).map((ph: any, phIdx: number) => {
              const PhIcon = PHASE_ICONS[ph.nom];
              // Match actions to phases — use employee data directly
              const phaseActionTpls = _myActionTpls.filter((t: any) => t.phase === ph.nom);
              // Combine: employee ACTIONS that match
              const allPhaseItems = phaseActionTpls.map((tpl: any) => {
                const empAction = _myActions.find((a: any) => a.title === tpl.titre);
                return { tpl, empAction, isDone: empAction ? completedActions.has(empAction.id) : (tpl.assignment_status === "termine") };
              });
              const allDone = allPhaseItems.length > 0 && allPhaseItems.every(a => a.isDone);
              const someDone = allPhaseItems.some(a => a.isDone);
              // Use local data for phase progression
              const allPhases = ((_myCollab as any)?.parcours_phases?.length > 0
                ? (_myCollab as any).parcours_phases.map((p: any) => ({ id: p.id, nom: p.nom }))
                : phases);
              const isCurrent = !allDone && (phIdx === 0 || allPhases.slice(0, phIdx).every((_: any, prevIdx: number) => {
                const prevPhaseName = allPhases[prevIdx]?.nom;
                const prevTpls = _myActionTpls.filter((t: any) => t.phase === prevPhaseName);
                return prevTpls.length > 0 && prevTpls.every((t: any) => {
                  const ea = _myActions.find((a: any) => a.title === t.titre);
                  return ea ? completedActions.has(ea.id) : (t.assignment_status === "termine");
                });
              }));
              const isPast = allDone;
              const isFuture = !isCurrent && !isPast;
              const [expanded, setExpanded] = [phIdx === 0 || isCurrent, null]; // always show current
              return (
                <div key={ph.id} style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: isCurrent ? C.pinkBg : isPast ? C.greenLight : C.bg, borderRadius: 10, border: `1px solid ${isCurrent ? C.pink : isPast ? C.green : C.border}`, borderLeft: isCurrent ? `4px solid ${C.pink}` : isPast ? `4px solid ${C.green}` : "4px solid transparent", cursor: "pointer", color: C.text }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: isPast ? C.green : ph.couleur, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {isPast ? <Check size={16} color="#fff" /> : PhIcon ? <PhIcon size={16} color="#fff" /> : <CheckCircle size={16} color="#fff" />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{ph.nom}</div>
                      <div style={{ fontSize: 12, color: C.textLight }}>{ph.delaiDebut} → {ph.delaiFin} · {allPhaseItems.length} actions</div>
                    </div>
                    {isCurrent && <span style={{ padding: "3px 10px", borderRadius: 12, fontSize: 11, fontWeight: 600, background: C.pink, color: "#fff" }}>{t('emp.in_progress')}</span>}
                    {isPast && <span style={{ padding: "3px 10px", borderRadius: 12, fontSize: 11, fontWeight: 600, background: C.green, color: "#fff" }}>{t('emp.completed')}</span>}
                    {isFuture && <span style={{ fontSize: 12, color: C.textMuted }}>{t('emp.upcoming')}</span>}
                  </div>
                  {/* Actions in this phase — show for current + past */}
                  {(isCurrent || isPast) && allPhaseItems.length > 0 && (
                    <div style={{ marginLeft: 28, borderLeft: `2px solid ${isPast ? C.green : C.border}`, paddingLeft: 20, marginTop: 8 }}>
                      {allPhaseItems.map((item, ai) => {
                        const empA = item.empAction;
                        return (
                          <div key={ai} className="iz-card" style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", marginBottom: 4, borderRadius: 8, border: `1px solid ${item.isDone ? C.green : C.border}`, background: item.isDone ? C.greenLight : C.white, cursor: "pointer", opacity: item.isDone ? .7 : 1, transition: "all .2s" }} onClick={() => { if (empA) { if (item.isDone) { handleReactivateAction(empA.id, (empA as any).assignment_id); } else { setShowActionDetail(empA.id); } } }}>
                            <div style={{ width: 22, height: 22, borderRadius: "50%", border: `2px solid ${item.isDone ? C.green : C.border}`, background: item.isDone ? C.green : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                              {item.isDone && <Check size={12} color={C.white} />}
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: 13, fontWeight: 500, textDecoration: item.isDone ? "line-through" : "none", color: item.isDone ? C.textLight : C.text }}>{item.tpl.titre}</div>
                            </div>
                            {item.isDone && empA && <button onClick={e => { e.stopPropagation(); handleReactivateAction(empA.id, (empA as any).assignment_id); }} className="iz-btn-outline" style={{ ...sBtn("outline"), padding: "4px 12px", fontSize: 11 }}><RotateCcw size={11} style={{ marginRight: 4 }} /> Réactiver</button>}
                            {!item.isDone && empA && <button onClick={e => { e.stopPropagation(); setShowActionDetail(empA.id); }} className="iz-btn-outline" style={{ ...sBtn("outline"), padding: "4px 12px", fontSize: 11 }}>{t('emp.complete_btn')}</button>}
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

          {/* Documents status — only show for onboarding parcours */}
          {((_myCollab as any)?.parcours_categorie === "onboarding" || (!(_myCollab as any)?.parcours_categorie && Object.keys(employeeDocs).length > 0)) && (
          <div className="iz-card iz-fade-up iz-stagger-2" style={{ ...sCard, marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>{t('emp.my_documents')}</h3>
              <button onClick={() => setShowDocPanel("admin")} className="iz-btn-outline" style={{ ...sBtn("outline"), padding: "4px 14px", fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}><FileText size={14} /> {t('emp.see_all')}</button>
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
                      {status === "valide" ? t('emp.doc_validated') : status === "en_attente" ? t('emp.doc_pending') : status === "refuse" ? t('emp.doc_refused') : t('emp.doc_missing')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          )}

          {/* Équipe & contacts */}
          <div className="iz-card iz-fade-up iz-stagger-3" style={{ ...sCard, marginBottom: 20 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, margin: "0 0 12px" }}>{t('emp.my_team')}</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
              {((_myCollab as any)?.accompagnants?.length > 0
                ? (_myCollab as any).accompagnants.map((a: any) => {
                    const ROLE_LABELS: Record<string, string> = { hrbp: "HRBP", manager: "Manager", buddy: "Buddy / Parrain", it: "IT Support", admin_rh: "Admin RH" };
                    const ROLE_COLORS: Record<string, string> = { hrbp: "#7B5EA7", manager: "#1A73E8", buddy: "#4CAF50", it: "#F9A825", admin_rh: "#C2185B" };
                    const initials = (a.name || "").split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();
                    return { name: a.name, role: ROLE_LABELS[a.role] || a.role, initials, color: ROLE_COLORS[a.role] || "#888" };
                  })
                : TEAM_MEMBERS.slice(0, 6)
              ).map((m: any, i: number) => (
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

          {/* Activité récente — only show if there's data */}
          {sharedTimeline.length > 0 && (
          <div className="iz-card iz-fade-up iz-stagger-4" style={{ ...sCard }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, margin: "0 0 16px" }}>{t('emp.recent_activity')}</h3>
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
          )}
        </div>
        );
      })()}
      {dashPage === "notifications" && (
        <div style={{ flex: 1, padding: "32px 40px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <h1 style={{ fontSize: 24, fontWeight: 600, color: C.text, margin: 0 }}>
              {t('notif.title')} {notifUnread > 0 && <span style={{ fontSize: 14, fontWeight: 600, padding: "2px 10px", borderRadius: 10, background: C.pink, color: "#fff", marginLeft: 8 }}>{notifUnread}</span>}
            </h1>
            {userNotifs.length > 0 && notifUnread > 0 && (
              <button onClick={async () => { await markAllNotifsRead(); setUserNotifs(prev => prev.map(n => ({ ...n, read_at: n.read_at || new Date().toISOString() }))); setNotifUnread(0); }} className="iz-btn-outline" style={{ ...sBtn("outline"), fontSize: 12, padding: "6px 16px" }}>{t('notif.mark_all_read')}</button>
            )}
          </div>
          {userNotifs.length === 0 ? (
            <div style={{ ...sCard, textAlign: "center", padding: 48, color: C.textLight }}>
              <Bell size={48} color={C.border} style={{ marginBottom: 12 }} />
              <p>{t('notif.none')}</p>
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
      {/* Team modal */}
      {showTeamModal && (
        <div className="iz-overlay" onClick={() => setShowTeamModal(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1100 }}>
          <div className="iz-modal" onClick={e => e.stopPropagation()} style={{ background: C.white, borderRadius: 16, width: 560, maxHeight: "80vh", overflow: "auto", position: "relative" }}>
            <div style={{ padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${C.border}` }}>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: C.text, margin: 0 }}>{t('emp.team_members')}</h2>
              <button onClick={() => setShowTeamModal(false)} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={20} color={C.textLight} /></button>
            </div>
            <div style={{ padding: "16px 24px" }}>
              {TEAM_MEMBERS.map((m, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 0", borderBottom: i < TEAM_MEMBERS.length - 1 ? `1px solid ${C.border}` : "none" }}>
                  <div style={{ width: 44, height: 44, borderRadius: "50%", background: m.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 600, color: "#fff", flexShrink: 0 }}>{m.initials}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 500, color: C.text }}>{m.name}</div>
                    <div style={{ fontSize: 12, color: C.textLight }}>{m.role}</div>
                  </div>
                  <button onClick={() => { setShowTeamModal(false); setDashPage("messagerie"); }} style={{ background: "none", border: `1px solid ${C.border}`, borderRadius: 8, padding: "6px 12px", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: C.textLight, fontFamily: font, transition: "all .15s" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = C.pink; e.currentTarget.style.color = C.pink; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textLight; }}>
                    <MessageCircle size={13} /> {t('sidebar.messaging')}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
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
                <img src={avatarImage} alt="" style={{
                  width: `${avatarZoom}%`, height: `${avatarZoom}%`,
                  objectFit: "cover",
                  position: "relative",
                  left: `${(50 - avatarPos.x) * (avatarZoom - 100) / 100}%`,
                  top: `${(50 - avatarPos.y) * (avatarZoom - 100) / 100}%`,
                }} />
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
                <button onClick={() => { setShowAvatarEditor(false); localStorage.setItem("illizeo_avatar_zoom", String(avatarZoom)); localStorage.setItem("illizeo_avatar_pos", JSON.stringify(avatarPos)); addToast("Photo mise à jour", "success"); }} className="iz-btn-pink" style={{ ...sBtn("pink"), flex: 1, fontSize: 13 }}>Valider</button>
                <button onClick={() => document.getElementById("avatar-upload")?.click()} className="iz-btn-outline" style={{ ...sBtn("outline"), fontSize: 13 }}>Changer</button>
                <button onClick={() => { setAvatarImage(null); setAvatarZoom(100); setAvatarPos({ x: 50, y: 50 }); localStorage.removeItem("illizeo_avatar"); localStorage.removeItem("illizeo_avatar_zoom"); localStorage.removeItem("illizeo_avatar_pos"); updateCompanySettings({ [`avatar_${auth.user?.id}`]: "" }).catch(() => {}); }} style={{ background: "none", border: `1px solid ${C.red}`, borderRadius: 8, padding: "8px 16px", fontSize: 13, color: C.red, cursor: "pointer", fontFamily: font }}>Retirer</button>
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
                <div key={col} onClick={() => { setEmployeeBannerColor(col); localStorage.setItem("illizeo_banner_color", col); updateCompanySettings({ [`banner_color_${auth.user?.id}`]: col }).catch(() => {}); }} style={{ width: 32, height: 32, borderRadius: "50%", background: col, cursor: "pointer", border: employeeBannerColor === col ? "3px solid #E91E8C" : "3px solid transparent", transition: "all .15s", transform: employeeBannerColor === col ? "scale(1.15)" : "scale(1)" }} />
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
                  <button onClick={() => { handleBannerFileUpload(); }} className="iz-btn-outline" style={{ ...sBtn("outline"), flex: 1, padding: "6px 10px", fontSize: 11 }}>Changer</button>
                  <button onClick={() => { setBannerImage(null); setBannerZoom(100); setBannerPos({ x: 50, y: 50 }); localStorage.removeItem("illizeo_banner_image"); localStorage.removeItem("illizeo_banner_zoom"); localStorage.removeItem("illizeo_banner_pos"); updateCompanySettings({ [`banner_image_${auth.user?.id}`]: "" }).catch(() => {}); addToast_admin("Image retirée"); }} style={{ background: "none", border: `1px solid ${C.red}`, borderRadius: 8, padding: "6px 10px", fontSize: 11, color: C.red, cursor: "pointer", fontFamily: font }}>Retirer</button>
                </div>
              </div>
            ) : (
              <div onClick={() => { handleBannerFileUpload(); }} style={{ padding: "20px 16px", borderRadius: 10, border: `2px dashed ${C.border}`, textAlign: "center", cursor: "pointer", fontSize: 13, color: C.textLight }}>
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
