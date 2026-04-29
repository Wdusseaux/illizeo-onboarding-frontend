import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useApiData } from "./api/useApiData";
import { apiFetch } from "./api/client";
import { useAuth } from "./api/useAuth";
import { t, getLang, setLang, getAllLangs, LANG_META, type Lang } from "./i18n";
import { parseCurrentUrl, pushAdminPage, pushEmployeePage, pushSuperAdmin, replaceCurrentPage, pushTenantRoot } from "./router";
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
  getCompanySettings, updateCompanySettings, getTenantBranding,
  saveMyAvatar, deleteMyAvatar, saveMyBanner,
  getBadges, getMyBadges, getBadgeTemplates, createBadgeTemplate as apiCreateBadgeTpl, updateBadgeTemplate as apiUpdateBadgeTpl, deleteBadgeTemplate as apiDeleteBadgeTpl, awardBadge, revokeBadge,
  type Badge, type BadgeTemplate,
  getPlans, type PlanData,
  superAdminDashboard, superAdminListTenants, superAdminUpdateTenant, superAdminDeleteTenant,
  superAdminListPlans, superAdminCreatePlan, superAdminUpdatePlan, superAdminDeletePlan,
  superAdminUpdateModules, superAdminListSubscriptions, superAdminListInvoices,
  superAdminGetStripeConfig, superAdminUpdateStripeConfig,
  getMySubscription, subscribeToPlan, cancelSubscription, getAvailablePlans, getActiveModules, getStorageUsage, getSignatureUsage, getMonthlyConsumption,
  getDocuments, uploadDocument, validateDocument as apiValidateDoc, refuseDocument as apiRefuseDoc,
  type UploadedDocument,
  getNpsSurveys, createNpsSurvey as apiCreateNps, updateNpsSurvey as apiUpdateNps, deleteNpsSurvey as apiDeleteNps,
  showNpsSurvey, getNpsStats, sendNpsSurveyToAll as apiSendNpsAll,
  getMyNpsSurveys, submitNpsResponse,
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
  Moon, Sun, Lightbulb, Bug, Briefcase, BarChart3
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

import { ANIM_STYLES, C, hexToRgb, colorWithAlpha, lighten, REGION_LOCALE, REGION_CURRENCY, getLocaleSettings, fmtDate, fmtDateShort, fmtTime, fmtDateTime, fmtDateTimeShort, fmtCurrency, font, fontDisplay, ILLIZEO_LOGO_URI, ILLIZEO_FULL_LOGO_URI, getLogoUri, getLogoFullUri, IllizeoLogoFull, IllizeoLogo, IllizeoLogoBrand, PreboardSidebar, sCard, sBtn, sInput, isDarkMode, applyDarkMode } from './constants';
import type { OnboardingStep, DashboardPage, DashboardTab, UserRole, AdminPage, AdminModal, Collaborateur, ParcoursCategorie, ParcourTemplate, ActionTemplate, ActionType, AssignTarget, GroupePersonnes, DocCategory, WorkflowRule, EmailTemplate, TeamMember } from './types';
import RichEditor from './components/RichEditor';
import AdminQuotesPage from './admin/AdminQuotesPage';
import AdminRecurringMeetingsPage from './admin/AdminRecurringMeetingsPage';
import EmployeeMyRdvPage from './pages/EmployeeMyRdvPage';
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
  const [subTab, setSubTab] = useState<"facturation" | "factures" | "paiement" | "protection" | "consommation">("facturation");
  const [subView, setSubView] = useState<"overview" | "change" | "apps">(_needsPlan ? "change" : "overview");
  const [subEmployeeCount, setSubEmployeeCount] = useState(25);
  const [billingInfo, setBillingInfo] = useState({ company: "", email: "", prenom: "", nom: "", telephone: "", pays: "Suisse", rue: "", numero: "", complement: "", case_postale: "", localite: "", ville: "", code_postal: "", canton: "", pays_facturation: "", vat: "" });
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "invoice">("stripe");
  const [stripeModalOpen, setStripeModalOpen] = useState(false);
  const [stripeMethods, setStripeMethods] = useState<{ id: string; brand: string; last4: string; exp_month: number; exp_year: number; is_default: boolean }[]>([]);
  const [invoiceConfigOpen, setInvoiceConfigOpen] = useState(false);
  const [invoiceConfig, setInvoiceConfig] = useState({ invoice_email: "", po_number: "" });
  const [billingContactEdit, setBillingContactEdit] = useState(false);
  const [billingModalOpen, setBillingModalOpen] = useState(false);
  const [invoicesList, setInvoicesList] = useState<any[]>([]);
  const [supportAccesses, setSupportAccesses] = useState<any[]>([]);
  const [supportAccessForm, setSupportAccessForm] = useState<any>(null);
  const billingModalCallback = useRef<(() => void) | null>(null);
  const [billingInfoEdit, setBillingInfoEdit] = useState(false);
  const [stripePromise, setStripePromise] = useState<any>(null);
  const [subStep, setSubStep] = useState<"plan" | "apps">("plan");
  const [storageUsage, setStorageUsage] = useState<{ used_formatted: string; max_formatted: string; percent: number; file_count: number; db_size: string } | null>(null);
  const [signatureUsage, setSignatureUsage] = useState<{ total: number; signed: number; sent: number; declined: number } | null>(null);
  // Pricing & Super Admin
  const [showPricing, setShowPricing] = useState(false);
  const [plans, setPlans] = useState<PlanData[]>([]);
  const [pricingBilling, setPricingBilling] = useState<"monthly" | "yearly">("monthly");
  const [superAdminMode, _setSuperAdminMode] = useState(false);
  const setSuperAdminMode = useCallback((v: boolean) => {
    _setSuperAdminMode(v);
    if (v) pushSuperAdmin();
    else pushAdminPage("admin_dashboard" as AdminPage);
  }, []);
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
    // 2. URL path starts with /:tenantId (e.g. /acme/calendrier)
    const parsed = parseCurrentUrl();
    if (parsed.tenantId) {
      localStorage.setItem("illizeo_tenant_id", parsed.tenantId);
      return true;
    }
    // 3. URL has ?tenant= param
    const qparams = new URLSearchParams(window.location.search);
    const tenantParam = qparams.get("tenant");
    if (tenantParam) {
      localStorage.setItem("illizeo_tenant_id", tenantParam);
      return true;
    }
    // 4. Just registered (needs plan selection) — skip tenant selection
    if (_needsPlan && localStorage.getItem("illizeo_tenant_id")) return true;
    // 5. Already have a tenant in localStorage
    if (localStorage.getItem("illizeo_tenant_id")) return true;
    // Otherwise show tenant selection
    return false;
  });
  // Note: tenant resolution is handled in useState initializer above
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
  // Badge celebration (confetti modal when a new badge is earned)
  const [celebrationBadge, setCelebrationBadge] = useState<Badge | null>(null);
  const [celebrationQueue, setCelebrationQueue] = useState<Badge[]>([]);
  // Employee NPS
  const [empSurveys, setEmpSurveys] = useState<any[]>([]);
  const [empNpsAnswers, setEmpNpsAnswers] = useState<Record<string, any>>({});
  // Feedback hub local state
  const [feedbackTab, setFeedbackTab] = useState<"surveys" | "mood" | "suggestion" | "buddy">("surveys");
  const [openSurveyId, setOpenSurveyId] = useState<number | null>(null);
  // Admin feedback hub state
  const [adminFeedbackTab, setAdminFeedbackTab] = useState<"mood" | "suggestion" | "buddy" | "excited">("mood");
  const [adminMoods, setAdminMoods] = useState<{ entries: any[]; stats: any } | null>(null);
  const [adminSuggestions, setAdminSuggestions] = useState<any[] | null>(null);
  const [adminSuggStatusFilter, setAdminSuggStatusFilter] = useState<"" | "open" | "reviewing" | "done" | "dismissed">("");
  const [adminBuddyRatings, setAdminBuddyRatings] = useState<{ entries: any[]; stats: any } | null>(null);
  const [adminExcited, setAdminExcited] = useState<{ entries: any[]; total: number } | null>(null);
  const [moodHistory, setMoodHistory] = useState<any[]>([]);
  const [moodHistoryLoaded, setMoodHistoryLoaded] = useState(false);
  const [moodDraft, setMoodDraft] = useState<{ mood: number | null; comment: string }>({ mood: null, comment: "" });
  const [suggestionDraft, setSuggestionDraft] = useState<{ category: "suggestion" | "bug" | "improvement" | "other"; content: string; anonymous: boolean }>({ category: "suggestion", content: "", anonymous: false });
  const [buddyRatingDraft, setBuddyRatingDraft] = useState<{ target_type: "buddy" | "manager"; rating: number; comment: string }>({ target_type: "buddy", rating: 0, comment: "" });
  // Lazy-load mood history the first time the user opens the mood tab.
  // Using a separate "loaded" flag so an empty history doesn't trigger an
  // infinite re-fetch loop (length === 0 stays true forever otherwise).
  useEffect(() => {
    if (feedbackTab !== "mood" || moodHistoryLoaded) return;
    setMoodHistoryLoaded(true);
    import('./api/endpoints').then(async m => {
      try { const list = await m.getMyMoods(); if (list) setMoodHistory(list); } catch {}
    });
  }, [feedbackTab, moodHistoryLoaded]);
  // Notification bell
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  // Employee cooptation
  const [empCampaigns, setEmpCampaigns] = useState<CooptationCampaign[]>([]);
  const [empCooptations, setEmpCooptations] = useState<Cooptation[]>([]);
  const [empCooptForm, setEmpCooptForm] = useState<{ open: boolean; campaign_id: number | null; candidate_name: string; candidate_email: string; candidate_poste: string; telephone: string; linkedin_url: string; message: string; step?: 1 | 2; source?: "linkedin" | "manual" | null; reward?: number | null }>({ open: false, campaign_id: null, candidate_name: "", candidate_email: "", candidate_poste: "", telephone: "", linkedin_url: "", message: "", step: 1, source: null, reward: null });
  const [shareModal, setShareModal] = useState<{ open: boolean; campaign: any | null }>({ open: false, campaign: null });
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
  const [dailyQuote, setDailyQuote] = useState<{ text: string; author: string | null } | null>(null);
  const [journeyData, setJourneyData] = useState<{ milestones: any[]; day_j: number; categorie: string | null } | null>(null);
  const [cultureQuizState, setCultureQuizState] = useState<{ idx: number; answers: Record<number, number>; finished: boolean }>({ idx: 0, answers: {}, finished: false });
  const [leaderboardData, setLeaderboardData] = useState<{ cohort: any[]; my_rank: number | null; my_xp: number; my_breakdown: any } | null>(null);
  const [employeeSignatureDocs, setEmployeeSignatureDocs] = useState<any[]>([]);
  const [employeeSignatureHistory, setEmployeeSignatureHistory] = useState<any[]>([]);
  const [suiviView, setSuiviView] = useState<"chrono" | "phases">("chrono");
  const [dashboardActionsView, setDashboardActionsView] = useState<"timeline" | "calendar">("timeline");
  // Number of weeks offset from "current week" (0). Negative = past, positive = future.
  const [calendarWeekOffset, setCalendarWeekOffset] = useState<number>(0);
  // Selected action for the timeline focus card. Null = use default priority order.
  const [dashboardFocusActionId, setDashboardFocusActionId] = useState<number | null>(null);
  // Accompagnants management in collab edit panel
  const [collabAccompagnants, setCollabAccompagnants] = useState<any[]>([]);
  const [tenantUsersList, setTenantUsersList] = useState<any[]>([]);
  const [accompagnantDraft, setAccompagnantDraft] = useState<{ role: string; user_id: number | null }>({ role: "", user_id: null });
  const [mesActionsView, setMesActionsView] = useState<"list" | "timeline" | "kanban">("list");
  // Track viewport width (single global listener) so child components can render
  // a mobile-optimised layout below 768px without each one wiring its own resize.
  const [viewportWidth, setViewportWidth] = useState<number>(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const onResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  const isMobile = viewportWidth < 768;
  const [officeTourState, setOfficeTourState] = useState<any>(null);
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(() => {
    try { return localStorage.getItem("illizeo_sidebar_collapsed") === "1"; } catch { return false; }
  });
  useEffect(() => {
    if (auth.isAuthenticated) {
      import('./api/endpoints').then(m => m.getQuoteOfTheDay()).then(q => { if (q) setDailyQuote({ text: q.text, author: q.author }); }).catch(() => {});
      // Fetch journey config + auto-award reached milestones
      import('./api/endpoints').then(async m => {
        try {
          const j = await m.getMyJourney();
          setJourneyData(j);
          const result = await m.checkMilestones();
          if (result?.awarded?.length > 0) {
            // Refresh notifications so the badge notification appears
            (m.getUserNotifications as any)?.().then(setUserNotifs).catch(() => {});
            (m.getNotifUnreadCount as any)?.().then((c: any) => setNotifUnread(c.count ?? c)).catch(() => {});
          }
        } catch {}
        try {
          const lb = await (m as any).getMyLeaderboard?.();
          if (lb) setLeaderboardData(lb);
        } catch {}
        try {
          const docs = await (m as any).getMySignatureDocuments?.();
          if (docs) setEmployeeSignatureDocs(docs);
        } catch {}
        try {
          const hist = await (m as any).getMySignatureHistory?.();
          if (hist) setEmployeeSignatureHistory(hist);
        } catch {}
      });
    }
  }, [auth.isAuthenticated]);
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
  // Admin-scoped preloads: backend gates these behind admin permissions, so don't
  // fire them for plain employees (they'd 403 and pollute the console for nothing).
  const adminApiEnabled = { enabled: auth.isAuthenticated && auth.isAdmin };
  // Only show mock data for the editor tenant (illizeo). Other tenants get empty arrays.
  const isDemo = (localStorage.getItem("illizeo_tenant_id") || "illizeo") === "illizeo";
  const [demoMode, setDemoMode] = useState<boolean>(localStorage.getItem("illizeo_demo_mode") === "true");
  const { data: COLLABORATEURS, refetch: refetchCollaborateurs } = useApiData(getCollaborateurs, isDemo ? _MOCK_COLLABORATEURS : [], adminApiEnabled);
  const { data: PARCOURS_TEMPLATES, refetch: refetchParcours } = useApiData(getParcours, isDemo ? _MOCK_PARCOURS_TEMPLATES : [], adminApiEnabled);
  const { data: ACTION_TEMPLATES, refetch: refetchActions } = useApiData(getActions, isDemo ? _MOCK_ACTION_TEMPLATES as any : [], adminApiEnabled);
  const { data: GROUPES, refetch: refetchGroupes } = useApiData(getGroupes, isDemo ? _MOCK_GROUPES as any : [], adminApiEnabled);
  const { data: PHASE_DEFAULTS, refetch: refetchPhases } = useApiData(getPhases, isDemo ? _MOCK_PHASE_DEFAULTS : [], adminApiEnabled);
  const { data: WORKFLOW_RULES, refetch: refetchWorkflows } = useApiData(getWorkflows, isDemo ? _MOCK_WORKFLOW_RULES : [], adminApiEnabled);
  const { data: EMAIL_TEMPLATES, refetch: refetchEmailTemplates } = useApiData(getEmailTemplates, isDemo ? _MOCK_EMAIL_TEMPLATES : [], adminApiEnabled);
  const { data: ADMIN_DOC_CATEGORIES } = useApiData(getDocumentCategories, isDemo ? _MOCK_ADMIN_DOC_CATEGORIES : [], adminApiEnabled);
  const { data: NOTIFICATIONS_LIST } = useApiData(getNotificationsConfig, isDemo ? _MOCK_NOTIFICATIONS_LIST as string[] : [], adminApiEnabled);
  const { data: integrations, refetch: refetchIntegrations } = useApiData(getIntegrations, [] as any[], adminApiEnabled);

  const authRole: UserRole = auth.isAdmin ? "rh" : "employee";
  const [role, setRole] = useState<UserRole>(authRole);
  useEffect(() => { setRole(authRole); }, [authRole]);
  const [step, setStep] = useState<OnboardingStep>("dashboard");
  const [showPreboard, setShowPreboard] = useState(false); // Set to true to show preboarding
  const _initialRoute = useMemo(() => parseCurrentUrl(), []);
  const [dashPage, _setDashPage] = useState<DashboardPage>(_initialRoute.employeePage || "tableau_de_bord");
  // Backward-compat: redirect retired admin pages to their replacements
  const _initialAdminPage = (() => {
    const p = _initialRoute.adminPage as any;
    if (p === "admin_cohorte_rh") return "admin_suivi";
    if (p === "admin_templates_profil") return "admin_parcours";
    return p || "admin_dashboard";
  })();
  const [adminPage, _setAdminPage] = useState<AdminPage>(_needsPlan ? "admin_abonnement" : _initialAdminPage);

  // Wrap setters to also update URL
  const setDashPage = useCallback((page: DashboardPage) => {
    _setDashPage(page);
    pushEmployeePage(page);
  }, []);
  const setAdminPage = useCallback((page: AdminPage) => {
    _setAdminPage(page);
    pushAdminPage(page);
  }, []);
  // ─── URL SYNC: popstate (back/forward) + initial URL set ────
  useEffect(() => {
    // Set initial URL if not already matching a page
    const tid = localStorage.getItem("illizeo_tenant_id");
    if (tid && auth.isAuthenticated) {
      const route = parseCurrentUrl();
      if (!route.adminPage && !route.employeePage && !route.superAdmin) {
        // No page in URL yet — set it
        if (role === "rh") replaceCurrentPage("rh", adminPage);
        else replaceCurrentPage("employee", undefined, dashPage);
      }
      if (_initialRoute.superAdmin) _setSuperAdminMode(true);
    }
    // Listen for back/forward
    const onPopState = () => {
      const route = parseCurrentUrl();
      if (route.superAdmin) { _setSuperAdminMode(true); return; }
      _setSuperAdminMode(false);
      if (route.adminPage) _setAdminPage(route.adminPage);
      else if (route.employeePage) _setDashPage(route.employeePage);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [auth.isAuthenticated]);

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
  // Auto-load accompagnants + tenant users when entering collab edit mode (so the
  // admin panel section can render them without each call site wiring its own load)
  useEffect(() => {
    if (collabPanelMode !== "edit" || !collabPanelData.id) {
      setCollabAccompagnants([]);
      return;
    }
    import('./api/endpoints').then(async m => {
      try { const list = await m.getCollabAccompagnants(collabPanelData.id!); setCollabAccompagnants(list || []); } catch { setCollabAccompagnants([]); }
      if (tenantUsersList.length === 0) {
        try { const users = await m.getUsers(); setTenantUsersList(users || []); } catch {}
      }
    });
  }, [collabPanelMode, collabPanelData.id]);
  // Collaborateur profile view
  const [collabProfileId, setCollabProfileId] = useState<number | null>(null);
  const [collabProfileTab, setCollabProfileTab] = useState<"apercu" | "infos" | "documents" | "actions" | "equipe" | "messages" | "dossier">("apercu");
  const [dossierCheck, setDossierCheck] = useState<DossierCheck | null>(null);
  // Relance email modal (manual reminder)
  const [relanceCollabId, setRelanceCollabId] = useState<number | null>(null);
  const [relanceDraft, setRelanceDraft] = useState<{ subject: string; body: string } | null>(null);
  const [relanceSending, setRelanceSending] = useState(false);
  // Cached company settings (so admin can resolve per-user avatar URLs from `avatar_${userId}` keys)
  const [allCompanySettings, setAllCompanySettings] = useState<Record<string, any>>({});
  // Groupe CRUD panel
  const [groupePanelMode, setGroupePanelMode] = useState<"closed" | "create" | "edit">("closed");
  const [groupePanelData, setGroupePanelData] = useState<{
    id?: number; nom: string; description: string; couleur: string;
    critereType: string; critereValeur: string; membres: string[];
  }>({ nom: "", description: "", couleur: "#E41076", critereType: "", critereValeur: "", membres: [] });
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
  const [suiviScope, setSuiviScope] = useState<"actifs" | "tous">("actifs");
  const [suiviSiteFilter, setSuiviSiteFilter] = useState("");
  const [suiviDeptFilter, setSuiviDeptFilter] = useState("");
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
  const [securitySubTab, setSecuritySubTab] = useState<"password" | "ip_whitelist" | "sessions" | "login_history" | "advanced">("password");
  const [ipWhitelist, setIpWhitelist] = useState<{ enabled: boolean; entries: any[]; current_ip: string } | null>(null);
  const [secSessions, setSecSessions] = useState<any[] | null>(null);
  const [secLoginHistory, setSecLoginHistory] = useState<any[] | null>(null);
  const [secSettings, setSecSettings] = useState<any>(null);
  const [pwdPolicy, setPwdPolicy] = useState<Record<string, any> | null>(null);
  const [permissionLogs, setPermissionLogs] = useState<any[]>([]);
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [calendarEvents, setCalendarEvents] = useState<any[] | null>(null);
  const [calendarEventsKey, setCalendarEventsKey] = useState("");
  const [calendarView, setCalendarView] = useState<"month" | "week" | "list">("month");
  const [calendarListFilter, setCalendarListFilter] = useState("all");
  const [orgView, setOrgView] = useState<"tree" | "list" | "dept">("tree");
  const [orgSearch, setOrgSearch] = useState("");
  const [auditFilter, setAuditFilter] = useState("all");
  const [auditSearch, setAuditSearch] = useState("");
  const [auditEntries, setAuditEntries] = useState<any[]>([]);
  const [auditLoaded, setAuditLoaded] = useState(false);
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
  // Live tick for countdowns (updates every second)
  const [nowTick, setNowTick] = useState(Date.now());
  useEffect(() => {
    const interval = setInterval(() => setNowTick(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Apparence & settings
  const [themeColor, setThemeColor] = useState(() => {
    const saved = localStorage.getItem("illizeo_theme_color");
    // Migrate old default color to new Illizeo brand color
    if (!saved || saved === "#C2185B") {
      localStorage.setItem("illizeo_theme_color", "#E41076");
      return "#E41076";
    }
    return saved;
  });
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
  const [cooptTab, setCooptTab] = useState<"priorite" | "inbox" | "cooptations" | "campagnes" | "classement">("priorite");
  const [inboxCategory, setInboxCategory] = useState<string>("boite");
  const [inboxSelectedId, setInboxSelectedId] = useState<number | null>(null);
  const [inboxSearch, setInboxSearch] = useState<string>("");
  const [campaigns, setCampaigns] = useState<CooptationCampaign[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [campaignPanelMode, setCampaignPanelMode] = useState<"closed" | "create" | "edit">("closed");
  const [campaignPanelData, setCampaignPanelData] = useState<any>({ titre: "", description: "", departement: "", site: "", type_contrat: "CDI", type_recompense: "prime", montant_recompense: 500, mois_requis: 6, nombre_postes: 1, priorite: "normale", date_limite: "", boost_active: false, boost_multiplier: 2, boost_label: "Urgent · besoin critique", boost_until: "" });
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
  const [groupeColor, setGroupeColor] = useState("#E41076");
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
  const [loginGradientStart, setLoginGradientStart] = useState(() => localStorage.getItem("illizeo_login_gradient_start") || "#1a1a2e");
  const [loginGradientEnd, setLoginGradientEnd] = useState(() => localStorage.getItem("illizeo_login_gradient_end") || "#E41076");
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
  // Per-action subtask checkbox state (UI-only, keyed by action template id → index → checked)
  const [subtaskChecks, setSubtaskChecks] = useState<Record<string | number, Record<number, boolean>>>({});
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
  const [expandedFormId, setExpandedFormId] = useState<number | string | null>(null);
  const [formFieldValues, setFormFieldValues] = useState<Record<string, any>>({});
  const [aiChatMessages, setAiChatMessages] = useState<{ role: "user" | "assistant"; content: string; timestamp: string }[]>([]);
  const [aiChatInput, setAiChatInput] = useState("");
  const [aiChatLoading, setAiChatLoading] = useState(false);
  const aiChatEndRef = useRef<HTMLDivElement>(null);
  const [aiParcoursModal, setAiParcoursModal] = useState(false);
  const [aiParcoursPrompt, setAiParcoursPrompt] = useState("");
  const [aiParcoursLoading, setAiParcoursLoading] = useState(false);
  const [aiParcoursResult, setAiParcoursResult] = useState<any>(null);
  const [aiParcoursError, setAiParcoursError] = useState("");
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [selectedTeamMember, setSelectedTeamMember] = useState<any>(null);
  const [ocrModal, setOcrModal] = useState<any>(null);
  const [ocrFile, setOcrFile] = useState<File | null>(null);
  const [ocrPreview, setOcrPreview] = useState<string | null>(null);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrResult, setOcrResult] = useState<any>(null);
  const [ocrError, setOcrError] = useState<string | null>(null);
  const [ocrWarning, setOcrWarning] = useState<any>(null);
  const [ocrUsage, setOcrUsage] = useState<any>(null);
  const [saAiConfig, setSaAiConfig] = useState<any>(null);
  const [saAiTenantUsage, setSaAiTenantUsage] = useState<any[]>([]);
  const [aiUsageData, setAiUsageData] = useState<any>(null);
  const [aiInsights, setAiInsights] = useState<any>(null);
  const [aiInsightsModalOpen, setAiInsightsModalOpen] = useState(false);
  const [aiBriefingHistory, setAiBriefingHistory] = useState<{ role: string; content: string }[]>([]);
  const [aiBriefingReply, setAiBriefingReply] = useState<string>("");
  const [aiBriefingLoading, setAiBriefingLoading] = useState(false);
  const [editingInfoSection, setEditingInfoSection] = useState<string | null>(null);
  const [editInfoData, setEditInfoData] = useState<Record<string, string>>({});
  const [protectionOpenSection, setProtectionOpenSection] = useState<string | null>(null);
  const [generateContrat, setGenerateContrat] = useState<any>(null);
  const [generateCollabId, setGenerateCollabId] = useState<number | null>(null);
  const [generateData, setGenerateData] = useState<any>(null);
  const [generateLoading, setGenerateLoading] = useState(false);
  const [consoData, setConsoData] = useState<any>(null);
  const [consoMonth, setConsoMonth] = useState(() => { const n = new Date(); return { year: n.getFullYear(), month: n.getMonth() + 1 }; });
  const [consoLoading, setConsoLoading] = useState(false);
  const [consoFilter, setConsoFilter] = useState<"all" | "admin" | "employé">("all");
  const [consoSearch, setConsoSearch] = useState("");
  const loadConsumption = useCallback(() => {
    setConsoLoading(true);
    getMonthlyConsumption(consoMonth.year, consoMonth.month)
      .then(setConsoData)
      .catch(() => setConsoData(null))
      .finally(() => setConsoLoading(false));
  }, [consoMonth.year, consoMonth.month]);
  useEffect(() => { if (subTab === "consommation") loadConsumption(); }, [consoMonth.year, consoMonth.month, subTab]);
  const [profileTab, setProfileTab] = useState("infos");
  const [formData, setFormData] = useState({
    prenom: "", nom: "", dateNaissance: "", genre: "",
    nationalite: "", metier: "", site: "",
    departement: "", fuseau: "Europe/Paris (UTC +01:00)", dateDebut: "",
    email: "", password: "", confirmPassword: "", photoUploaded: false,
  });
  // Hydrate formData from authenticated user + collaborateur profile
  useEffect(() => {
    if (!auth.isAuthenticated) return;
    const u: any = auth.user || {};
    const c: any = myCollabProfile || {};
    const fullName = u.name || `${c.prenom || ""} ${c.nom || ""}`.trim();
    const parts = fullName.split(" ");
    const prenom = c.prenom || parts[0] || "";
    const nom = c.nom || parts.slice(1).join(" ") || "";
    setFormData(prev => ({
      ...prev,
      prenom, nom,
      email: u.email || c.email || prev.email,
      metier: c.poste || u.poste || prev.metier,
      site: c.site || prev.site,
      departement: c.departement || prev.departement,
      dateDebut: c.dateDebut || c.date_debut || prev.dateDebut,
      dateNaissance: c.date_naissance || c.dateNaissance || prev.dateNaissance,
      genre: c.genre || prev.genre,
      nationalite: c.nationalite || prev.nationalite,
      fuseau: c.fuseau || c.timezone || prev.fuseau,
    }));
  }, [auth.isAuthenticated, auth.user, myCollabProfile]);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [acceptCGU, setAcceptCGU] = useState(false);

  // ═══ SHARED STATE — Cross-role data flow ═══════════════════
  type DocStatus = "manquant" | "soumis" | "en_attente" | "valide" | "refuse";
  type TimelineEntry = { date: string; heure: string; event: string; type: "system" | "success" | "email" | "warning" | "action"; detail: string };
  type Toast = { id: number; message: string; type: "success" | "info" | "warning"; role: UserRole };

  const [employeeDocs, setEmployeeDocs] = useState<Record<string, DocStatus>>({
    "IBAN/BIC *": "manquant",
    "Certificats De Travail et Diplômes *": "manquant",
    "Pièce d'identité / Passeport *": "manquant",
    "Carte d'assuré social": "manquant",
    "Permis de travail ou de résidence": "manquant",
    "Photo d'identité *": "manquant",
    "Pièce justificative": "manquant",
  });

  const [completedActions, setCompletedActions] = useState<Set<number>>(new Set());

  const [sharedTimeline, setSharedTimeline] = useState<TimelineEntry[]>(demoMode ? [
    { date: "15/02/2026", heure: "10:30", event: "Parcours onboarding créé", type: "system", detail: "Parcours « Onboarding Standard » assigné par Admin RH" },
    { date: "15/02/2026", heure: "10:31", event: "Email d'invitation envoyé", type: "email", detail: `Email envoyé à ${auth.user?.email || "l'employé"}` },
  ] : []);

  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastIdRef = useRef(0);

  const addToast = useCallback((message: string, type: Toast["type"] = "success", targetRole?: UserRole) => {
    const id = ++toastIdRef.current;
    setToasts(prev => [...prev, { id, message, type, role: targetRole || role }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, [role]);

  // ─── Refresh allCompanySettings when admin opens collab listings ─────
  // Employees upload their avatar to company_settings[avatar_{userId}], but admin
  // loads settings only once at auth time. Without this, an admin would keep
  // seeing initials until next login. Refresh on entry to suivi / dashboard.
  useEffect(() => {
    if (!auth.isAuthenticated || !auth.isAdmin) return;
    if (adminPage !== "admin_suivi" && adminPage !== "admin_dashboard") return;
    getCompanySettings().then(s => setAllCompanySettings(s || {})).catch(() => {});
  }, [adminPage, auth.isAuthenticated, auth.isAdmin]);

  // ─── AI-blocked global listener ─────────────────────────────
  // Triggered by api/client.ts when any AI call returns 402 (spending cap, quota
  // exceeded, or no AI plan). One toast per minute to avoid spam when the same
  // page makes several blocked calls in a row.
  const lastAiBlockToastRef = useRef(0);
  useEffect(() => {
    const handler = (e: Event) => {
      const detail: any = (e as CustomEvent).detail || {};
      const now = Date.now();
      if (now - lastAiBlockToastRef.current < 60_000) return;
      lastAiBlockToastRef.current = now;

      let msg = detail.reply || detail.error || "Fonctionnalité IA temporairement indisponible";
      if (detail.no_plan) {
        msg = "Module IA non activé. Souscrivez un add-on IA pour utiliser cette fonctionnalité.";
      } else if (detail.error === 'spending_cap') {
        msg = `Plafond IA atteint (${detail.billed_chf} / ${detail.cap_chf} CHF). Augmentez le plafond ou achetez des crédits.`;
      } else if (detail.quota_exceeded && detail.quota_status) {
        msg = `Quota IA mensuel atteint (${detail.quota_status.used}/${detail.quota_status.effective_limit}). Achetez des crédits ou changez de plan.`;
      }
      addToast(msg, "warning");
    };
    window.addEventListener('illizeo:ai-blocked', handler);
    return () => window.removeEventListener('illizeo:ai-blocked', handler);
  }, [addToast]);

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
    const refreshAfter = () => import('./api/endpoints').then(async m => {
      try { const lb = await (m as any).getMyLeaderboard?.(); if (lb) setLeaderboardData(lb); } catch {}
      // Refetch badges so newly-awarded ones trigger the celebration modal
      try { const b = await (m as any).getMyBadges?.(); if (b) setMyBadges(b); } catch {}
    });
    if (assignmentId) {
      apiCompleteMyAction(assignmentId).then(refreshAfter).catch(() => {});
    } else {
      apiCompleteByAction(actionId).then(refreshAfter).catch(() => {});
    }
  }, [formData.prenom, addTimelineEntry, addToast]);

  // Employee reactivates an action
  const handleReactivateAction = useCallback(async (actionId: number, assignmentId?: number) => {
    setCompletedActions(prev => { const s = new Set(prev); s.delete(actionId); return s; });
    const action = ACTIONS.find(a => a.id === actionId);
    if (action) {
      addToast(`Action "${action.title.substring(0, 40)}..." réactivée`, "info");
    }
    try {
      if (assignmentId) {
        await apiReactivateMyAction(assignmentId);
      } else {
        await apiReactivateByAction(actionId);
      }
      // Refetch profile so EMPLOYEE_ACTIONS sees the fresh assignment_status="a_faire".
      // Without this, the inline _synced re-sync would re-add the action to completedActions
      // because the cached myCollabProfile.parcours_actions still has assignment_status="termine".
      const fresh = await getMyCollaborateur();
      if (fresh) setMyCollabProfile(fresh);
    } catch {
      // API failed — revert the optimistic update
      setCompletedActions(prev => { const s = new Set(prev); s.add(actionId); return s; });
      addToast("Impossible de réactiver l'action", "error");
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
    PHASE_DEFAULTS, refetchPhases, WORKFLOW_RULES, refetchWorkflows, EMAIL_TEMPLATES, refetchEmailTemplates,
    ADMIN_DOC_CATEGORIES, NOTIFICATIONS_LIST, integrations, refetchIntegrations,
    apiContrats, authRole,
    // Helpers
    addToast_admin, showConfirm, showPrompt, switchLang, toggleDarkMode,
    resetTr, setTr, buildTranslationsPayload,
    addToast, addTimelineEntry, nowTick, handleEmployeeSubmitDoc, handleRHValidateDoc,
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
    stripeModalOpen, setStripeModalOpen,
    stripeMethods, setStripeMethods,
    invoiceConfigOpen, setInvoiceConfigOpen,
    invoiceConfig, setInvoiceConfig,
    billingContactEdit, setBillingContactEdit,
    billingModalOpen, setBillingModalOpen, billingModalCallback, invoicesList, setInvoicesList, supportAccesses, setSupportAccesses, supportAccessForm, setSupportAccessForm,
    billingInfoEdit, setBillingInfoEdit,
    stripePromise, setStripePromise,
    subStep, setSubStep,
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
    collabProfileId, setCollabProfileId, relanceCollabId, setRelanceCollabId, relanceDraft, setRelanceDraft, relanceSending, setRelanceSending, allCompanySettings, setAllCompanySettings,
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
    suiviScope, setSuiviScope,
    suiviSiteFilter, setSuiviSiteFilter,
    suiviDeptFilter, setSuiviDeptFilter,
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
    hasPermission, isSuperAdmin, userPermissions, userRoleSlugs, myCollabProfile, dailyQuote, avatarMenuOpen, setAvatarMenuOpen, sidebarCollapsed, setSidebarCollapsed,
    roleTab, setRoleTab, selectedRoleId, setSelectedRoleId, permMatrixFilter, setPermMatrixFilter,
    visibleRoleIds, setVisibleRoleIds, rolesDropdownOpen, setRolesDropdownOpen, effectivePermUserId, setEffectivePermUserId,
    permissionLogs, setPermissionLogs, securitySubTab, setSecuritySubTab, pwdPolicy, setPwdPolicy, ipWhitelist, setIpWhitelist, secSessions, setSecSessions, secLoginHistory, setSecLoginHistory, secSettings, setSecSettings,
    calendarMonth, setCalendarMonth, calendarView, setCalendarView, calendarListFilter, setCalendarListFilter, calendarEvents, setCalendarEvents, calendarEventsKey, setCalendarEventsKey,
    orgView, setOrgView, orgSearch, setOrgSearch, auditFilter, setAuditFilter, auditSearch, setAuditSearch, auditEntries, setAuditEntries, auditLoaded, setAuditLoaded, buddyPairs, setBuddyPairs, selectedBuddyPair, setSelectedBuddyPair,
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
    inboxCategory, setInboxCategory,
    inboxSelectedId, setInboxSelectedId,
    inboxSearch, setInboxSearch,
    campaigns, setCampaigns,
    leaderboard, setLeaderboard,
    campaignPanelMode, setCampaignPanelMode,
    campaignPanelData, setCampaignPanelData,
    companyBlocks, setCompanyBlocks,
    cultureQuizState, setCultureQuizState,
    leaderboardData, setLeaderboardData,
    dashboardActionsView, setDashboardActionsView,
    calendarWeekOffset, setCalendarWeekOffset,
    dashboardFocusActionId, setDashboardFocusActionId,
    collabAccompagnants, setCollabAccompagnants,
    tenantUsersList, setTenantUsersList,
    accompagnantDraft, setAccompagnantDraft,
    mesActionsView, setMesActionsView,
    isMobile, viewportWidth,
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
    gradientColor, setGradientColor, loginGradientStart, setLoginGradientStart, loginGradientEnd, setLoginGradientEnd,
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
    subtaskChecks, setSubtaskChecks,
    phases, setPhases,
    selectedPhaseId, setSelectedPhaseId,
    messageCanal, setMessageCanal,
    messageBody, setMessageBody,
    showWelcomeModal, setShowWelcomeModal,
    showDocPanel, setShowDocPanel,
    showDocCategory, setShowDocCategory,
    showActionDetail, setShowActionDetail, sigActionAck, setSigActionAck, sigActionLoading, setSigActionLoading, sigContratData, setSigContratData,
    actionTab, setActionTab,
    showProfile, setShowProfile, expandedFormId, setExpandedFormId, formFieldValues, setFormFieldValues,
    aiChatMessages, setAiChatMessages, aiChatInput, setAiChatInput, aiChatLoading, setAiChatLoading, aiChatEndRef,
    aiParcoursModal, setAiParcoursModal, aiParcoursPrompt, setAiParcoursPrompt, aiParcoursLoading, setAiParcoursLoading, aiParcoursResult, setAiParcoursResult, aiParcoursError, setAiParcoursError,
    showTeamModal, setShowTeamModal, selectedTeamMember, setSelectedTeamMember,
    ocrModal, setOcrModal, ocrFile, setOcrFile, ocrPreview, setOcrPreview, ocrLoading, setOcrLoading, ocrResult, setOcrResult, ocrError, setOcrError, ocrWarning, setOcrWarning, ocrUsage, setOcrUsage,
    saAiConfig, setSaAiConfig, saAiTenantUsage, setSaAiTenantUsage, aiUsageData, setAiUsageData, aiInsights, setAiInsights, aiInsightsModalOpen, setAiInsightsModalOpen,
    aiBriefingHistory, setAiBriefingHistory, aiBriefingReply, setAiBriefingReply, aiBriefingLoading, setAiBriefingLoading,
    editingInfoSection, setEditingInfoSection, editInfoData, setEditInfoData, protectionOpenSection, setProtectionOpenSection,
    generateContrat, setGenerateContrat, generateCollabId, setGenerateCollabId, generateData, setGenerateData, generateLoading, setGenerateLoading,
    consoData, setConsoData, consoMonth, setConsoMonth, consoLoading, setConsoLoading, consoFilter, setConsoFilter, consoSearch, setConsoSearch, loadConsumption,
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

  // Returns one category per action of the *current employee's parcours* that
  // exposes `piecesRequises` — any action type (document, formulaire, signature, …).
  // Strict: no mock fallback, no cross-parcours preview. If the user has no
  // parcours, or the parcours has no action with pieces, returns []. The panel
  // is responsible for rendering an empty state in that case.
  const getLiveDocCategories = useCallback(() => {
    const myCollab: any = myCollabProfile || COLLABORATEURS.find((c: any) => c.email === auth.user?.email);
    const profileActions = myCollab?.parcours_actions || [];

    let candidateActions: any[] = [];
    if (profileActions.length > 0) {
      candidateActions = profileActions;
    } else if (myCollab?.parcours_id || myCollab?.parcours_nom) {
      const parcoursName = myCollab?.parcours_nom
        || PARCOURS_TEMPLATES.find((p: any) => p.id === myCollab?.parcours_id)?.nom
        || "";
      candidateActions = ACTION_TEMPLATES.filter((a: any) =>
        (myCollab?.parcours_id && a.parcours_id === myCollab.parcours_id)
        || (parcoursName && a.parcours === parcoursName)
      );
    }

    return candidateActions
      .map((a: any) => {
        const pieces: string[] = a.piecesRequises || a.pieces_requises || [];
        return { action: a, pieces };
      })
      .filter(({ pieces }: any) => Array.isArray(pieces) && pieces.length > 0)
      .map(({ action, pieces }: any) => {
        const missing = pieces.filter((p: string) => {
          const status = employeeDocs[p];
          return !status || status === "manquant" || status === "refuse";
        }).length;
        return {
          id: `action_${action.id}`,
          title: action.titre,
          docs: pieces,
          missing,
          type: action.type || "document",
        };
      });
  }, [employeeDocs, myCollabProfile, COLLABORATEURS, PARCOURS_TEMPLATES, ACTION_TEMPLATES, auth.user]);

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

  // ─── Load tenant branding before auth (for login page gradient) ──
  useEffect(() => {
    if (tenantResolved && !auth.isAuthenticated) {
      getTenantBranding().then(s => {
        if (s.login_gradient_start) { setLoginGradientStart(s.login_gradient_start); localStorage.setItem("illizeo_login_gradient_start", s.login_gradient_start); }
        if (s.login_gradient_end) { setLoginGradientEnd(s.login_gradient_end); localStorage.setItem("illizeo_login_gradient_end", s.login_gradient_end); }
        if (s.login_bg_image) { setLoginBgImage(s.login_bg_image); localStorage.setItem("illizeo_login_bg_image", s.login_bg_image); }
        if (s.custom_logo) { setCustomLogo(s.custom_logo); localStorage.setItem("illizeo_custom_logo", s.custom_logo); }
        if (s.custom_logo_full) { setCustomLogoFull(s.custom_logo_full); localStorage.setItem("illizeo_custom_logo_full", s.custom_logo_full); }
      }).catch(() => {});
    }
  }, [tenantResolved, auth.isAuthenticated]);

  // ─── Company settings effects ──────────────────────────────
  useEffect(() => {
    if (auth.isAuthenticated) {
      getCompanySettings().then(s => {
        setAllCompanySettings(s || {});
        if (s.theme_color) {
          // Migrate legacy burgundy color from DB to new Illizeo brand color
          const themeColor = s.theme_color === "#C2185B" ? "#E41076" : s.theme_color;
          setThemeColor(themeColor);
          localStorage.setItem("illizeo_theme_color", themeColor);
        }
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
        if (s.login_gradient_start) { setLoginGradientStart(s.login_gradient_start); localStorage.setItem("illizeo_login_gradient_start", s.login_gradient_start); }
        if (s.login_gradient_end) { setLoginGradientEnd(s.login_gradient_end); localStorage.setItem("illizeo_login_gradient_end", s.login_gradient_end); }
        // Setup wizard: show for new tenants (no setup_completed flag).
        // Hydrate de setupData ALWAYS run (même si déjà setup) — le wizard peut
        // être réouvert manuellement et doit afficher la valeur sauvegardée.
        if (s.company_name) setSetupData(prev => ({ ...prev, company_name: s.company_name }));
        if (s.sector) setSetupData(prev => ({ ...prev, sector: s.sector }));
        if (s.company_size) setSetupData(prev => ({ ...prev, company_size: s.company_size }));
        if (auth.isAdmin && !s.setup_completed) {
          setShowSetupWizard(true);
          if (s.setup_steps_done) try { setSetupCompleted(JSON.parse(s.setup_steps_done)); } catch {}
        }
        // Load avatar & banner per user
        const avatarKey = `avatar_${auth.user?.id}`;
        if (s[avatarKey]) {
          setAvatarImage(s[avatarKey]);
          localStorage.setItem("illizeo_avatar", s[avatarKey]);
        } else if (auth.user?.id) {
          // Self-heal: avatar in localStorage but missing from backend (previous
          // updateCompanySettings calls were 403 for non-admins). Push it now via
          // the new /me/avatar endpoint so admins can finally see it.
          const localAv = localStorage.getItem("illizeo_avatar");
          if (localAv && localAv.length > 100) {
            saveMyAvatar(localAv).catch(() => {});
          }
        }
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
    } else if (actionType === "lecture") {
      const sigDocId = actionOptions?.signature_document_id;
      if (sigDocId) {
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
      getMyNpsSurveys().then(setEmpSurveys).catch(() => getNpsSurveys().then(s => setEmpSurveys(s.map(sv => ({ survey: sv, token: null, completed: false, completed_at: null })))).catch(() => {}));
    }
  }, [auth.isAuthenticated, dashPage]);

  // Detect newly-earned badges and queue confetti celebration
  useEffect(() => {
    if (!auth.isAuthenticated || auth.isAdmin) return;
    if (!myBadges || myBadges.length === 0) return;
    const userKey = `iz_celebrated_badges_${auth.user?.id || "anon"}`;
    let celebrated: number[] = [];
    try { celebrated = JSON.parse(localStorage.getItem(userKey) || "[]"); } catch {}
    // First-ever load: mark existing badges as already seen so we don't replay history
    if (celebrated.length === 0) {
      localStorage.setItem(userKey, JSON.stringify(myBadges.map(b => b.id)));
      return;
    }
    const fresh = myBadges.filter(b => !celebrated.includes(b.id));
    if (fresh.length > 0) {
      setCelebrationQueue(prev => [...prev, ...fresh]);
      localStorage.setItem(userKey, JSON.stringify([...celebrated, ...fresh.map(b => b.id)]));
    }
  }, [myBadges, auth.isAuthenticated, auth.isAdmin, auth.user?.id]);

  // Show next badge from the queue when modal is closed
  useEffect(() => {
    if (!celebrationBadge && celebrationQueue.length > 0) {
      setCelebrationBadge(celebrationQueue[0]);
      setCelebrationQueue(prev => prev.slice(1));
    }
  }, [celebrationBadge, celebrationQueue]);

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

  // ─── Favicon effect — hardcoded to the Illizeo brand mark, never customized
  // by tenants. Runs once on mount to override any link[rel=icon] that the
  // index.html might already provide (kept here for SPA route-change cases).
  useEffect(() => {
    let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement | null;
    if (!link) { link = document.createElement("link"); link.rel = "icon"; document.head.appendChild(link); }
    link.href = ILLIZEO_LOGO_URI;
  }, []);

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

        const isInTrialNow = trialStart && (new Date().getTime() - new Date(trialStart).getTime()) <= 14 * 24 * 60 * 60 * 1000;
        if (!hasActiveSub && !isInTrialNow && trialStart) {
          // Trial expired or sub not renewed → force subscription page
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
  // Compute employee-side counters
  const myActionsTotal = ACTIONS.length;
  const myActionsCompleted = completedActions.size;
  const checklistBadge = myActionsTotal > 0 ? `${myActionsCompleted}/${myActionsTotal}` : undefined;
  const docsRemaining = docsTotal - docsValidated;
  const docsBadge = docsRemaining > 0 ? docsRemaining : undefined;

  const tenantId = (typeof localStorage !== "undefined" ? localStorage.getItem("illizeo_tenant_id") : "") || "";
  const isDemoTenant = tenantId === "illizeo" || tenantId === "illizeo2";
  const hasOfficeTour = isDemoTenant || (companyBlocks || []).some((b: any) => b.type === "office_tour" && b.actif && (b.data?.rooms || []).length > 0);
  const SIDEBAR_ITEMS = [
    { section: t('sidebar.my_workspace'), items: [
      { id: "tableau_de_bord" as const, label: "Mon onboarding", icon: LayoutDashboard, emoji: "🏠" },
      { id: "mes_actions" as const, label: "Checklist J1", icon: ListChecks, badge: checklistBadge },
      { id: "suivi" as const, label: "Parcours 100j", icon: Target },
      { id: "organigramme" as const, label: "Mon équipe", icon: Users },
      { id: "mes_rdv" as const, label: "Mes RDV", icon: Calendar },
      { id: "mes_signatures" as const, label: "Mes signatures", icon: FileSignature, badge: docsBadge },
      { id: "badges" as const, label: "Badges", icon: Award },
      ...(hasOfficeTour ? [{ id: "bureaux" as const, label: "Bureaux", icon: MapPin }] : []),
      { id: "satisfaction" as const, label: "Feedback", icon: MessageSquare },
    ]},
    { section: "Plus", items: [
      { id: "messagerie" as const, label: t('sidebar.messaging'), icon: MessageCircle },
      { id: "entreprise" as const, label: t('sidebar.company'), icon: Building2 },
      { id: "mon_profil" as const, label: "Mon profil", icon: UserCheck },
      { id: "assistant_ia" as const, label: "Assistant IA", icon: Sparkles },
      { id: "cooptation" as const, label: t('admin.cooptation'), icon: Handshake },
      // Notifications retirées de la sidebar : la cloche dans le topbar
      // employé (à côté de l'avatar) ouvre désormais le dropdown notif —
      // cohérent avec le pattern admin.
    ]},
  ];
  ctx.SIDEBAR_ITEMS = SIDEBAR_ITEMS;

  const empRenders = createEmployeeRenders(ctx);
  const {
    renderSidebar, renderEmployeeTopbar, renderActionCard, renderDashboard, renderMesActions, renderMonEquipe,
    renderMessagerie, renderCompanyBlock, renderEntreprise, renderRapports,
    renderWelcomeModal, renderDocPanel, renderActionDetail, renderProfileModal,
    renderMonProfil, renderAssistantIA, handleBannerFileUpload, handleSendMessage,
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
    renderNPS, renderContrats, renderGenerateContratModal, renderCooptation, renderIntegrations,
    renderSidebar_admin: _renderSidebar_admin, renderSuperAdminPanel, renderOcrModal, renderRelanceModal, PARCOURS_CAT_META, hasModule, isPageAccessible,
    isEditorTenant, isInTrial, trialExpired, hasActiveSub, SIDEBAR,
  } = adminRenders as any;
  const renderSidebar_admin = typeof _renderSidebar_admin === "function" ? _renderSidebar_admin : () => <div style={{ width: 220, minHeight: "100vh", background: "#fff", borderRight: "1px solid #e0e0e0" }} />;

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
          <div className="iz-fade-in" style={{ height: 280, background: "linear-gradient(135deg, #2D1B3D 0%, #4A1942 30%, #E41076 70%, #E91E8C 100%)", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", position: "relative", flexShrink: 0 }}>
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
                  <div style={{ width: 160, height: 160, borderRadius: "50%", background: avatarImage ? "none" : (formData.photoUploaded ? "linear-gradient(135deg, #E91E8C, #E41076)" : C.bg), display: "flex", alignItems: "center", justifyContent: "center", border: `4px solid ${avatarImage || formData.photoUploaded ? C.pink : C.border}`, transition: "all .3s", overflow: "hidden" }}>
                    {avatarImage ? (
                      <img src={avatarImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : formData.photoUploaded ? (
                      <span style={{ fontSize: 48, fontWeight: 700, color: C.white }}>
                        {(auth.user?.name || `${formData.prenom} ${formData.nom}`).split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase() || "?"}
                      </span>
                    ) : (
                      <Users size={56} color={C.border} />
                    )}
                  </div>
                  {/* Upload zone */}
                  <div>
                    <input id="setup-photo-upload" type="file" accept="image/jpeg,image/png" style={{ display: "none" }} onChange={e => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = ev => {
                        const dataUrl = ev.target?.result as string;
                        const img = new Image();
                        img.onload = () => {
                          const MAX = 256;
                          const ratio = Math.min(1, MAX / Math.max(img.width, img.height));
                          const w = Math.round(img.width * ratio);
                          const h = Math.round(img.height * ratio);
                          const canvas = document.createElement("canvas");
                          canvas.width = w; canvas.height = h;
                          const cctx = canvas.getContext("2d");
                          if (!cctx) { addToast("Erreur lors du traitement de l'image", "error"); return; }
                          cctx.drawImage(img, 0, 0, w, h);
                          const compressed = canvas.toDataURL("image/jpeg", 0.85);
                          setAvatarImage(compressed);
                          setAvatarZoom(100);
                          setAvatarPos({ x: 50, y: 50 });
                          localStorage.setItem("illizeo_avatar", compressed);
                          if (auth.user?.id) {
                            saveMyAvatar(compressed)
                              .then(() => addToast("Photo enregistrée", "success"))
                              .catch((err: any) => addToast("Échec de l'enregistrement : " + (err?.message || ""), "error"));
                          }
                          setFormData({ ...formData, photoUploaded: true });
                        };
                        img.onerror = () => addToast("Image invalide", "error");
                        img.src = dataUrl;
                      };
                      reader.readAsDataURL(file);
                    }} />
                    <button onClick={() => document.getElementById("setup-photo-upload")?.click()} className="iz-btn-pink" style={{ ...sBtn("pink"), display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                      <Upload size={16} /> Importer une photo
                    </button>
                    <p style={{ fontSize: 12, color: C.textMuted, maxWidth: 200, lineHeight: 1.5 }}>JPG ou PNG, max 5 Mo. Un cadrage centré sur le visage est recommandé.</p>
                    {avatarImage && (
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
              {step === "photo_profile" && !avatarImage && (
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

  // ─── SUPER ADMIN PANEL ──────────────────────────────────
  if (superAdminMode && auth.isAuthenticated && renderSuperAdminPanel) {
    return renderSuperAdminPanel();
  }

  // ─── DASHBOARD (MAIN APP) ────────────────────────────────
  if (role === "rh") {
    return (
      <div style={{ display: "flex", height: "100vh", overflow: "hidden", fontFamily: font, background: C.white, color: C.text }}>
        <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;1,9..40,400&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" /><style dangerouslySetInnerHTML={{ __html: ANIM_STYLES }} />
        {/* Setup Wizard overlay */}
        {showSetupWizard && renderSetupWizard()}
        {renderSidebar_admin()}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden", minWidth: 0 }}>
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
            {/* User avatar dropdown — même style que le topbar employé. Le
                bas de la sidebar admin ne contient plus que le nom de l'admin ;
                Langue / Mon 2FA / Déconnexion ont été déplacés ici. */}
            <div style={{ position: "relative" }} data-admin-avatar-menu>
              <button onClick={() => setAvatarMenuOpen(!avatarMenuOpen)}
                style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 8px 4px 4px", background: avatarMenuOpen ? C.bg : "transparent", border: `1px solid ${avatarMenuOpen ? C.border : "transparent"}`, borderRadius: 22, cursor: "pointer", fontFamily: font, transition: "all .15s" }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: `linear-gradient(135deg, ${C.pinkSoft}, ${C.pink})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, color: C.white }}>
                  {auth.user?.name?.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() || "?"}
                </div>
                <ChevronRight size={14} color={C.textMuted} style={{ transform: avatarMenuOpen ? "rotate(90deg)" : "rotate(0)", transition: "transform .15s" }} />
              </button>
              {avatarMenuOpen && (
                <>
                  <div onClick={() => setAvatarMenuOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 100 }} />
                  <div className="iz-fade-up" style={{ position: "absolute", top: "calc(100% + 6px)", right: 0, width: 260, background: C.white, borderRadius: 12, boxShadow: "0 8px 28px rgba(0,0,0,.12)", border: `1px solid ${C.border}`, zIndex: 101, overflow: "hidden" }}>
                    <div style={{ padding: "16px 18px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 44, height: 44, borderRadius: "50%", background: `linear-gradient(135deg, ${C.pinkSoft}, ${C.pink})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 600, color: C.white }}>
                        {auth.user?.name?.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() || "?"}
                      </div>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: C.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{auth.user?.name || "Admin"}</div>
                        {auth.user?.email && <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{auth.user.email}</div>}
                      </div>
                    </div>
                    <div style={{ padding: "6px 0" }}>
                      {/* Items personnels (réutilisent le ProfileModal employé
                          qui a déjà les onglets Infos / Mot de passe / Notifs).
                          Le modal est rendu globalement à la fin du component
                          via renderProfileModal() — il suffit de le déclencher
                          avec le bon tab. */}
                      {[
                        { id: "infos", label: lang === "fr" ? "Mon profil" : "My profile", Icon: UserCheck },
                        { id: "password", label: lang === "fr" ? "Mot de passe" : "Password", Icon: KeyRound },
                        { id: "notifs", label: lang === "fr" ? "Préférences notifications" : "Notification preferences", Icon: Bell },
                      ].map(item => {
                        const Icon = item.Icon;
                        return (
                          <button key={item.id} onClick={() => { setAvatarMenuOpen(false); setProfileTab(item.id); setShowProfile(true); }}
                            style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "10px 18px", background: "none", border: "none", cursor: "pointer", fontFamily: font, fontSize: 13, color: C.text, transition: "background .12s" }}
                            onMouseEnter={e => e.currentTarget.style.background = C.bg}
                            onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                            <Icon size={15} color={C.textMuted} />
                            <span>{item.label}</span>
                          </button>
                        );
                      })}
                      <button onClick={() => { setAvatarMenuOpen(false); setAdminPage("admin_2fa" as any); }}
                        style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "10px 18px", background: "none", border: "none", cursor: "pointer", fontFamily: font, fontSize: 13, color: C.text, transition: "background .12s" }}
                        onMouseEnter={e => e.currentTarget.style.background = C.bg}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                        <ShieldCheck size={15} color={C.textMuted} />
                        <span>{lang === "fr" ? "Mon 2FA" : "My 2FA"}</span>
                      </button>
                      {/* Super Admin — visible seulement pour les comptes
                          plateforme Illizeo, pas pour les tenants clients. */}
                      {isEditorTenant && (auth.user?.email === "wilfrid@illizeo.com" || auth.user?.email === "admin@illizeo.com") && (
                        <button onClick={() => { setAvatarMenuOpen(false); setSuperAdminMode(true); setSaDashData(null); setSaPlans([]); setSaTenants([]); setSaSubscriptions([]); setSaLoaded(false); }}
                          style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "10px 18px", background: "none", border: "none", cursor: "pointer", fontFamily: font, fontSize: 13, color: C.amber, transition: "background .12s" }}
                          onMouseEnter={e => e.currentTarget.style.background = C.bg}
                          onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                          <Crown size={15} color={C.amber} />
                          <span>{t('role.super_admin')}</span>
                        </button>
                      )}
                    </div>
                    {/* Language selector */}
                    <div style={{ borderTop: `1px solid ${C.border}`, padding: "10px 18px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                        <Languages size={15} color={C.textMuted} />
                        <span style={{ fontSize: 13, color: C.text }}>{lang === "fr" ? "Langue" : "Language"}</span>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(activeLanguages.length, 3)}, 1fr)`, gap: 4 }}>
                        {activeLanguages.map((l: any) => (
                          <button key={l} onClick={() => switchLang(l)} style={{
                            padding: "6px 8px", borderRadius: 6, fontSize: 11, fontWeight: lang === l ? 600 : 400,
                            border: `1px solid ${lang === l ? C.pink : C.border}`,
                            background: lang === l ? C.pinkBg : C.white,
                            color: lang === l ? C.pink : C.textMuted,
                            cursor: "pointer", fontFamily: font, transition: "all .15s",
                            display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
                          }}>
                            <span>{LANG_META[l].flag}</span>
                            <span>{l.toUpperCase()}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div style={{ borderTop: `1px solid ${C.border}`, padding: "6px 0" }}>
                      <button
                        onClick={() => { setAvatarMenuOpen(false); const tid = localStorage.getItem("illizeo_tenant_id"); auth.logout().catch(() => {}).finally(() => { window.location.href = tid ? `/${tid}` : "/"; }); }}
                        style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "10px 18px", background: "none", border: "none", cursor: "pointer", fontFamily: font, fontSize: 13, color: C.red, transition: "background .12s" }}
                        onMouseEnter={e => e.currentTarget.style.background = "#FFEBEE"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                        <LogOut size={15} color={C.red} />
                        <span>{t('auth.logout')}</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
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
        {/* ── Trial expired lock: only allow abonnement + RGPD ── */}
        {!isEditorTenant && trialExpired && !hasActiveSub && adminPage !== "admin_abonnement" && adminPage !== "admin_donnees" && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", padding: "60px 40px", textAlign: "center" }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: C.redLight, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
              <Lock size={28} color={C.red} />
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: C.dark, margin: "0 0 8px" }}>Période d'essai terminée</h2>
            <p style={{ fontSize: 14, color: C.textMuted, maxWidth: 400, lineHeight: 1.6, margin: "0 0 24px" }}>
              Votre essai gratuit de 14 jours est terminé. Souscrivez un plan pour continuer à utiliser Illizeo et accéder à toutes vos données.
            </p>
            <button onClick={() => { setAdminPage("admin_abonnement" as any); setSubView("change"); }} className="iz-btn-pink" style={{ ...sBtn("pink"), padding: "12px 32px", fontSize: 14 }}>
              Choisir un plan
            </button>
          </div>
        )}
        {/* ── Subscription page + RGPD: always accessible ───── */}
        {adminPage === "admin_abonnement" && adminInline.renderAdminAbonnement()}
        {adminPage === "admin_donnees" && adminInline.renderAdminDonnees()}

        {/* ── All other pages: locked when trial expired ──── */}
        {(() => {
          const _locked = !isEditorTenant && !hasActiveSub && !isInTrial;
          if (_locked && adminPage !== "admin_abonnement" && adminPage !== "admin_donnees") {
            return (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", padding: "60px 40px", textAlign: "center" }}>
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: C.redLight, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                  <Lock size={28} color={C.red} />
                </div>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: C.dark, margin: "0 0 8px" }}>Période d'essai terminée</h2>
                <p style={{ fontSize: 14, color: C.textMuted, maxWidth: 400, lineHeight: 1.6, margin: "0 0 24px" }}>
                  Votre essai gratuit de 14 jours est terminé. Souscrivez un plan pour continuer à utiliser Illizeo et accéder à toutes vos données.
                </p>
                <button onClick={() => { setAdminPage("admin_abonnement" as any); setSubView("change"); }} className="iz-btn-pink" style={{ ...sBtn("pink"), padding: "12px 32px", fontSize: 14 }}>
                  Choisir un plan
                </button>
              </div>
            );
          }
          if (_locked) return null;
          return (<>
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
        {adminPage === "admin_feedback_hub" && (() => {
          // Lazy-load tab data on first view
          const fetchTab = async () => {
            const m = await import('./api/endpoints');
            try {
              if (adminFeedbackTab === "mood" && !adminMoods) {
                const d = await (m as any).adminGetMoods?.(); if (d) setAdminMoods(d);
              } else if (adminFeedbackTab === "suggestion" && adminSuggestions === null) {
                const d = await (m as any).adminGetSuggestions?.(adminSuggStatusFilter || undefined); if (d) setAdminSuggestions(d);
              } else if (adminFeedbackTab === "buddy" && !adminBuddyRatings) {
                const d = await (m as any).adminGetBuddyRatings?.(); if (d) setAdminBuddyRatings(d);
              } else if (adminFeedbackTab === "excited" && !adminExcited) {
                const d = await (m as any).adminGetExcited?.(); if (d) setAdminExcited(d);
              }
            } catch {}
          };
          // Trigger fetch via setTimeout to avoid setState-during-render warning
          setTimeout(fetchTab, 0);

          const moodEmoji = (n: number) => ["", "😞", "😟", "😐", "🙂", "😄"][n] || "•";
          const statusBadge: Record<string, { bg: string; fg: string; label: string }> = {
            open: { bg: C.amberLight, fg: C.amber, label: "Ouvert" },
            reviewing: { bg: C.blueLight, fg: C.blue, label: "En revue" },
            done: { bg: C.greenLight, fg: C.green, label: "Traité" },
            dismissed: { bg: C.bg, fg: C.textMuted, label: "Rejeté" },
          };
          const catMeta: Record<string, { label: string; icon: any }> = {
            suggestion: { label: "Suggestion", icon: Lightbulb },
            improvement: { label: "Amélioration", icon: Sparkles },
            bug: { label: "Bug", icon: Bug },
            other: { label: "Autre", icon: MessageCircle },
          };

          return (
            <div style={{ flex: 1, padding: "24px 32px", overflow: "auto" }}>
              <h1 style={{ fontSize: 22, fontWeight: 600, margin: "0 0 6px" }}>Feedback collaborateurs</h1>
              <p style={{ fontSize: 12, color: C.textMuted, margin: "0 0 20px" }}>Mood pulses, suggestions/bugs et évaluations buddy/manager remontés par les collaborateurs.</p>

              {/* Sub-tabs */}
              <div style={{ display: "flex", gap: 4, padding: 4, background: C.bg, borderRadius: 10, marginBottom: 20, width: "fit-content" }}>
                {([
                  { id: "mood", label: "Mood pulses", icon: Smile },
                  { id: "suggestion", label: "Suggestions / bugs", icon: Lightbulb },
                  { id: "buddy", label: "Buddy / manager", icon: Star },
                  { id: "excited", label: "J'ai hâte", icon: Heart },
                ] as const).map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button key={tab.id} onClick={() => setAdminFeedbackTab(tab.id)} style={{
                      padding: "8px 16px", borderRadius: 6, fontSize: 12, fontWeight: adminFeedbackTab === tab.id ? 600 : 400,
                      border: "none", cursor: "pointer", fontFamily: font,
                      background: adminFeedbackTab === tab.id ? C.white : "transparent",
                      color: adminFeedbackTab === tab.id ? C.pink : C.textMuted,
                      boxShadow: adminFeedbackTab === tab.id ? "0 1px 3px rgba(0,0,0,.06)" : "none",
                      display: "inline-flex", alignItems: "center", gap: 6,
                    }}><Icon size={14} /> {tab.label}</button>
                  );
                })}
              </div>

              {adminFeedbackTab === "mood" && (
                <div>
                  {adminMoods?.stats && (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
                      <div className="iz-card" style={{ ...sCard, textAlign: "center" }}>
                        <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 600 }}>MOY. 30J</div>
                        <div style={{ fontSize: 28, fontWeight: 700, color: C.pink }}>{adminMoods.stats.avg_30d ?? "—"}<span style={{ fontSize: 14, color: C.textMuted }}>/5</span></div>
                      </div>
                      <div className="iz-card" style={{ ...sCard, textAlign: "center" }}>
                        <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 600 }}>CHECK-INS 30J</div>
                        <div style={{ fontSize: 28, fontWeight: 700, color: C.text }}>{adminMoods.stats.count_30d}</div>
                      </div>
                      <div className="iz-card" style={{ ...sCard, textAlign: "center" }}>
                        <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 600 }}>NOTES BASSES (≤2)</div>
                        <div style={{ fontSize: 28, fontWeight: 700, color: C.red }}>{adminMoods.stats.low_mood_count_30d}</div>
                      </div>
                      <div className="iz-card" style={{ ...sCard }}>
                        <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 600, marginBottom: 6 }}>DISTRIBUTION 30J</div>
                        <div style={{ display: "flex", gap: 4, alignItems: "flex-end", height: 36 }}>
                          {[1, 2, 3, 4, 5].map(n => {
                            const v = adminMoods.stats.distribution_30d?.[n] ?? 0;
                            const max = Math.max(1, ...Object.values(adminMoods.stats.distribution_30d || {}) as number[]);
                            return (
                              <div key={n} style={{ flex: 1, textAlign: "center" }}>
                                <div style={{ height: `${(v / max) * 100}%`, minHeight: 2, background: n <= 2 ? C.red : n === 3 ? C.amber : C.green, borderRadius: 2 }} title={`${v}`} />
                                <div style={{ fontSize: 14 }}>{moodEmoji(n)}</div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="iz-card" style={{ ...sCard, padding: 0 }}>
                    <div style={{ padding: "12px 16px", borderBottom: `1px solid ${C.border}`, fontSize: 12, fontWeight: 600 }}>Derniers check-ins</div>
                    {(adminMoods?.entries || []).map((e: any) => {
                      const c = e.collaborateur;
                      const name = c ? `${c.prenom} ${c.nom}` : `User #${e.user_id}`;
                      return (
                        <div key={e.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 16px", borderBottom: `1px solid ${C.border}` }}>
                          <div style={{ fontSize: 24 }}>{moodEmoji(e.mood)}</div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 13, fontWeight: 600 }}>{name}</div>
                            <div style={{ fontSize: 11, color: C.textLight }}>{e.comment || <span style={{ fontStyle: "italic", color: C.textMuted }}>(sans commentaire)</span>}</div>
                          </div>
                          <div style={{ fontSize: 11, color: C.textMuted, whiteSpace: "nowrap" }}>{new Date(e.created_at).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}</div>
                        </div>
                      );
                    })}
                    {(!adminMoods || adminMoods.entries.length === 0) && (
                      <div style={{ padding: "32px 16px", textAlign: "center", color: C.textMuted, fontSize: 12 }}>Aucun mood check-in pour le moment.</div>
                    )}
                  </div>
                </div>
              )}

              {adminFeedbackTab === "suggestion" && (
                <div>
                  <div style={{ display: "flex", gap: 6, marginBottom: 14, alignItems: "center" }}>
                    <span style={{ fontSize: 11, color: C.textMuted, fontWeight: 600 }}>FILTRE :</span>
                    {(["", "open", "reviewing", "done", "dismissed"] as const).map(s => (
                      <button key={s} onClick={() => { setAdminSuggStatusFilter(s); setAdminSuggestions(null); }} style={{
                        padding: "5px 12px", borderRadius: 14, fontSize: 11, border: "none", cursor: "pointer", fontFamily: font,
                        background: adminSuggStatusFilter === s ? C.pink : C.bg,
                        color: adminSuggStatusFilter === s ? "#fff" : C.textLight,
                      }}>{s === "" ? "Tous" : statusBadge[s]?.label}</button>
                    ))}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {(adminSuggestions || []).map((s: any) => {
                      const c = s.collaborateur;
                      const name = s.anonymous ? "Anonyme" : (c ? `${c.prenom} ${c.nom}` : `User #${s.user_id}`);
                      const sb = statusBadge[s.status] || statusBadge.open;
                      return (
                        <div key={s.id} className="iz-card" style={{ ...sCard }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                            <span style={{ padding: "3px 10px", borderRadius: 6, fontSize: 11, fontWeight: 600, background: C.pinkBg, color: C.pink, display: "inline-flex", alignItems: "center", gap: 4 }}>
                              {(() => { const Icon = catMeta[s.category]?.icon || MessageCircle; return <Icon size={11} />; })()}
                              {catMeta[s.category]?.label || s.category}
                            </span>
                            <span style={{ padding: "3px 10px", borderRadius: 6, fontSize: 11, fontWeight: 600, background: sb.bg, color: sb.fg }}>{sb.label}</span>
                            <div style={{ flex: 1 }} />
                            <div style={{ fontSize: 11, color: C.textMuted, display: "inline-flex", alignItems: "center", gap: 4 }}>
                              {s.anonymous && <EyeOff size={11} />}
                              {name} · {new Date(s.created_at).toLocaleDateString('fr-FR')}
                            </div>
                          </div>
                          <div style={{ fontSize: 13, color: C.text, lineHeight: 1.5, marginBottom: 10, whiteSpace: "pre-wrap" }}>{s.content}</div>
                          <div style={{ display: "flex", gap: 6 }}>
                            {(["open", "reviewing", "done", "dismissed"] as const).filter(st => st !== s.status).map(st => (
                              <button key={st} onClick={async () => {
                                try {
                                  const m = await import('./api/endpoints');
                                  await (m as any).adminUpdateSuggestionStatus?.(s.id, st);
                                  setAdminSuggestions(prev => (prev || []).map((x: any) => x.id === s.id ? { ...x, status: st } : x));
                                  addToast_admin("Statut mis à jour");
                                } catch { addToast_admin("Erreur"); }
                              }} className="iz-btn-outline" style={{ ...sBtn("outline"), fontSize: 11, padding: "4px 10px" }}>→ {statusBadge[st].label}</button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                    {adminSuggestions !== null && adminSuggestions.length === 0 && (
                      <div className="iz-card" style={{ ...sCard, textAlign: "center", color: C.textMuted, fontSize: 12, padding: 32 }}>Aucune suggestion {adminSuggStatusFilter ? `avec le statut "${statusBadge[adminSuggStatusFilter]?.label}"` : ""}.</div>
                    )}
                  </div>
                </div>
              )}

              {adminFeedbackTab === "buddy" && (
                <div>
                  {adminBuddyRatings?.stats && (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 20 }}>
                      <div className="iz-card" style={{ ...sCard, textAlign: "center" }}>
                        <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 600 }}>MOY. BUDDY</div>
                        <div style={{ fontSize: 28, fontWeight: 700, color: C.amber }}>{adminBuddyRatings.stats.avg_buddy ?? "—"}<span style={{ fontSize: 14, color: C.textMuted }}>/5</span></div>
                      </div>
                      <div className="iz-card" style={{ ...sCard, textAlign: "center" }}>
                        <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 600 }}>MOY. MANAGER</div>
                        <div style={{ fontSize: 28, fontWeight: 700, color: C.amber }}>{adminBuddyRatings.stats.avg_manager ?? "—"}<span style={{ fontSize: 14, color: C.textMuted }}>/5</span></div>
                      </div>
                      <div className="iz-card" style={{ ...sCard, textAlign: "center" }}>
                        <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 600 }}>NOTES BASSES (≤2)</div>
                        <div style={{ fontSize: 28, fontWeight: 700, color: C.red }}>{adminBuddyRatings.stats.low_count}</div>
                      </div>
                    </div>
                  )}
                  <div className="iz-card" style={{ ...sCard, padding: 0 }}>
                    <div style={{ padding: "12px 16px", borderBottom: `1px solid ${C.border}`, fontSize: 12, fontWeight: 600 }}>Toutes les évaluations</div>
                    {(adminBuddyRatings?.entries || []).map((r: any) => {
                      const c = r.collaborateur;
                      const name = c ? `${c.prenom} ${c.nom}` : `User #${r.user_id}`;
                      return (
                        <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 16px", borderBottom: `1px solid ${C.border}` }}>
                          <div style={{ width: 80, fontSize: 11, fontWeight: 600, color: C.text, display: "inline-flex", alignItems: "center", gap: 4 }}>
                            {r.target_type === "buddy" ? <Star size={12} /> : <Briefcase size={12} />}
                            {r.target_type === "buddy" ? "Buddy" : "Manager"}
                          </div>
                          <div style={{ display: "flex", gap: 2 }}>{[1,2,3,4,5].map(n => <span key={n} style={{ color: n <= r.rating ? C.amber : C.border, fontSize: 16 }}>★</span>)}</div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 13, fontWeight: 600 }}>{name}</div>
                            <div style={{ fontSize: 11, color: C.textLight }}>{r.comment || <span style={{ fontStyle: "italic", color: C.textMuted }}>(sans commentaire)</span>}</div>
                          </div>
                          <div style={{ fontSize: 11, color: C.textMuted, whiteSpace: "nowrap" }}>{new Date(r.created_at).toLocaleDateString('fr-FR')}</div>
                        </div>
                      );
                    })}
                    {(!adminBuddyRatings || adminBuddyRatings.entries.length === 0) && (
                      <div style={{ padding: "32px 16px", textAlign: "center", color: C.textMuted, fontSize: 12 }}>Aucune évaluation pour le moment.</div>
                    )}
                  </div>
                </div>
              )}

              {adminFeedbackTab === "excited" && (
                <div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12, marginBottom: 20 }}>
                    <div className="iz-card" style={{ ...sCard, textAlign: "center" }}>
                      <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 600 }}>TOTAL "J'AI HÂTE"</div>
                      <div style={{ fontSize: 28, fontWeight: 700, color: C.pink }}>{adminExcited?.total ?? 0}</div>
                    </div>
                    <div className="iz-card" style={{ ...sCard, textAlign: "center" }}>
                      <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 600 }}>DERNIER 30J</div>
                      <div style={{ fontSize: 28, fontWeight: 700, color: C.text }}>
                        {(adminExcited?.entries || []).filter((e: any) => new Date(e.created_at).getTime() > Date.now() - 30 * 86400000).length}
                      </div>
                    </div>
                  </div>
                  <div className="iz-card" style={{ ...sCard, padding: 0 }}>
                    <div style={{ padding: "12px 16px", borderBottom: `1px solid ${C.border}`, fontSize: 12, fontWeight: 600 }}>
                      Collaborateurs ayant manifesté leur enthousiasme avant l'arrivée
                    </div>
                    {(adminExcited?.entries || []).map((e: any) => (
                      <div key={e.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 16px", borderBottom: `1px solid ${C.border}` }}>
                        <div style={{ width: 36, height: 36, borderRadius: "50%", background: C.pinkBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <Heart size={16} color={C.pink} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{e.employee_name}</div>
                          <div style={{ fontSize: 11, color: C.textLight }}>
                            {e.date_debut ? `Arrivée prévue le ${new Date(e.date_debut).toLocaleDateString('fr-FR')}` : "Date d'arrivée non renseignée"}
                          </div>
                        </div>
                        <div style={{ fontSize: 11, color: C.textMuted, whiteSpace: "nowrap" }}>{new Date(e.created_at).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
                      </div>
                    ))}
                    {(!adminExcited || adminExcited.entries.length === 0) && (
                      <div style={{ padding: "32px 16px", textAlign: "center", color: C.textMuted, fontSize: 12 }}>
                        Aucun collaborateur n'a encore cliqué sur "J'ai hâte".
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })()}
        {adminPage === "admin_contrats" && renderContrats()}
        {adminPage === "admin_integrations" && renderIntegrations()}
        {adminPage === "admin_cooptation" && renderCooptation()}
        {adminPage === "admin_gamification" && adminInline.renderAdminGamification()}
        {adminPage === "admin_users" && adminInline.renderAdminUsers()}
        {adminPanels.renderGroupePanel()}
        {adminPanels.renderActionPanel()}
        {adminPage === "admin_fields" && adminInline.renderAdminFields()}
        {adminPage === "admin_apparence" && adminInline.renderAdminApparence()}
        {adminPage === "admin_2fa" && adminInline.renderAdmin2FA()}
        {adminPage === "admin_password_policy" && adminInline.renderAdminPasswordPolicy()}
        {adminPage === "admin_equipements" && adminInline.renderAdminEquipements()}
        {adminPage === "admin_provisioning" && adminInline.renderAdminProvisioning()}
        {adminPage === "admin_roles" && adminInline.renderAdminRoles()}
        {adminPage === "admin_calendar" && adminInline.renderAdminCalendar()}
        {adminPage === "admin_orgchart" && adminInline.renderAdminOrgChart()}
        {adminPage === "admin_buddy" && adminInline.renderAdminBuddy()}
        {adminPage === "admin_audit" && adminInline.renderAdminAuditLog()}
        {adminPage === "admin_assistant_ia" && adminInline.renderAdminAssistantIA()}

        {/* VUE MANAGER */}
        {adminPage === "admin_manager_view" && (() => {
          const myUserId = (auth.user as any)?.id;
          const myName = (auth.user as any)?.name || "Manager";
          const PALETTE = ["#E91E8C", "#1A73E8", "#9C27B0", "#00897B", "#F9A825", "#E53935", "#1A1A2E"];
          const now = Date.now();
          const sevenDaysMs = 7 * 86400000;

          const parseDate = (s: any): Date => {
            if (!s) return new Date();
            const str = String(s);
            const m1 = str.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
            if (m1) return new Date(+m1[1], +m1[2] - 1, +m1[3]);
            const m2 = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
            if (m2) return new Date(+m2[3], +m2[2] - 1, +m2[1]);
            return new Date(str);
          };

          const isManagerInvolved = (action: any): boolean => {
            const opts = action.options || {};
            const roles = opts.participants_roles || [];
            if (Array.isArray(roles) && roles.includes("manager")) return true;
            const parts = String(opts.participants || "").toLowerCase();
            return parts.includes("manager") || parts.includes("n+1");
          };

          const realArrivants = COLLABORATEURS
            .filter((c: any) => c.status !== "termine")
            .filter((c: any) => {
              if (!myUserId) return false;
              return c.manager?.user_id === myUserId
                || (c.accompagnants || []).some((a: any) => a.role === "manager" && a.user_id === myUserId)
                || (c.accompagnants || []).some((a: any) => a.role === "manager" && (a.id === myUserId || a.user?.id === myUserId));
            })
            .map((c: any, i: number) => {
              const startDate = parseDate(c.dateDebut || c.date_debut);
              const j = Math.max(1, Math.floor((now - startDate.getTime()) / 86400000) + 1);
              const buddy = (c.accompagnants || []).find((a: any) => a.role === "buddy")?.name || "—";
              const actions = c.parcours_actions || [];

              const todo = actions
                .filter((a: any) => (a.type === "rdv" || a.type === "entretien") && a.assignment_status !== "termine" && isManagerInvolved(a))
                .map((a: any) => {
                  const m = (a.delaiRelatif || a.delai_relatif || "J+0").match(/J([+-]?\d+)/);
                  const offset = m ? parseInt(m[1], 10) : 0;
                  const dueAt = new Date(startDate); dueAt.setDate(dueAt.getDate() + offset);
                  const daysToDue = Math.round((dueAt.getTime() - now) / 86400000);
                  return { titre: a.titre, dueAt, daysToDue };
                })
                .filter((x: any) => x.daysToDue >= -1 && x.daysToDue <= 14)
                .sort((a: any, b: any) => a.dueAt.getTime() - b.dueAt.getTime())
                .slice(0, 3)
                .map((x: any) => x.daysToDue <= 0 ? `${x.titre} (aujourd'hui)` : x.daysToDue === 1 ? `${x.titre} (demain)` : `${x.titre} (dans ${x.daysToDue}j)`);

              const done = actions
                .filter((a: any) => a.assignment_status === "termine")
                .map((a: any) => {
                  const completedAt = a.assignment_completed_at ? new Date(a.assignment_completed_at) : null;
                  return { titre: a.titre, completedAt };
                })
                .filter((x: any) => x.completedAt && (now - x.completedAt.getTime()) <= sevenDaysMs)
                .sort((a: any, b: any) => (b.completedAt?.getTime() || 0) - (a.completedAt?.getTime() || 0))
                .slice(0, 3)
                .map((x: any) => x.titre);

              return {
                id: c.id,
                initials: c.initials, color: c.color || PALETTE[i % PALETTE.length],
                name: `${c.prenom} ${c.nom}`, role: c.poste, j, buddy, pct: c.progression,
                todo, done,
              };
            });

          const ARRIVANTS = realArrivants;
          const totalTodo = ARRIVANTS.reduce((acc: number, a: any) => acc + a.todo.length, 0);
          const totalDoneRecent = ARRIVANTS.reduce((acc: number, a: any) => acc + a.done.length, 0);
          const avgPct = ARRIVANTS.length > 0 ? Math.round(ARRIVANTS.reduce((acc: number, a: any) => acc + a.pct, 0) / ARRIVANTS.length) : 0;
          if (ARRIVANTS.length === 0) {
            return (
              <div style={{ flex: 1, padding: "32px 40px", overflow: "auto" }}>
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 4 }}>{myName} · 0 personne en intégration</div>
                  <h1 style={{ fontSize: 24, fontWeight: 700, color: C.pink, margin: 0 }}>Mes nouveaux arrivants</h1>
                </div>
                <div className="iz-card" style={{ ...sCard, padding: 40, textAlign: "center", color: C.textMuted }}>
                  <Users size={36} color={C.border} style={{ marginBottom: 12 }} />
                  <div style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 4 }}>Aucun arrivant assigné</div>
                  <div style={{ fontSize: 12, lineHeight: 1.5, maxWidth: 480, margin: "0 auto" }}>
                    Cette page liste les collaborateurs en cours d'intégration <b>dont vous êtes le manager direct</b>.
                    Si vous attendez un arrivant, demandez à votre RH de vous assigner comme manager dans la fiche collaborateur (champ "Manager").
                  </div>
                </div>
              </div>
            );
          }
          return (
            <div style={{ flex: 1, padding: "32px 40px", overflow: "auto" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                <div>
                  <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 4 }}>{myName} · {ARRIVANTS.length} personne{ARRIVANTS.length > 1 ? "s" : ""} en intégration</div>
                  <h1 style={{ fontSize: 24, fontWeight: 700, color: C.pink, margin: 0 }}>Mes nouveaux arrivants</h1>
                </div>
                <button className="iz-btn-pink" style={{ ...sBtn("pink"), padding: "10px 22px", fontSize: 13 }}>+ Préparer un arrivant</button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
                {[
                  { label: "EN COURS", value: ARRIVANTS.length, color: C.pink },
                  { label: "ACTIONS À FAIRE", value: totalTodo, sub: `${totalDoneRecent} validé${totalDoneRecent > 1 ? "s" : ""} 7j`, color: C.amber },
                  { label: "SCORE MOYEN", value: `${avgPct}%`, color: C.green },
                  { label: "DÉLAI ONBOARDING", value: "100j", color: "#9C27B0" },
                ].map(k => (
                  <div key={k.label} className="iz-card" style={{ ...sCard, padding: "16px 18px" }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: C.textMuted, letterSpacing: 1 }}>{k.label}</div>
                    <div style={{ fontSize: 28, fontWeight: 700, color: k.color, marginTop: 4 }}>{k.value}</div>
                    {k.sub && <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>{k.sub}</div>}
                  </div>
                ))}
              </div>
              {ARRIVANTS.map(a => (
                <div key={a.name} className="iz-card" style={{ ...sCard, marginBottom: 14, padding: 0, overflow: "hidden" }}>
                  <div style={{ padding: "16px 22px", display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 48, height: 48, borderRadius: "50%", background: a.color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700 }}>{a.initials}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 16, fontWeight: 700, color: C.text }}>{a.name}</div>
                      <div style={{ fontSize: 12, color: C.textMuted }}>{a.role} · J+{a.j} sur 100 · Buddy : {a.buddy}</div>
                    </div>
                    <div style={{ minWidth: 220 }}>
                      <div style={{ height: 6, background: C.bg, borderRadius: 3, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${a.pct}%`, background: `linear-gradient(90deg, ${C.pink}, #9C27B0)` }} />
                      </div>
                      <div style={{ fontSize: 11, color: C.textMuted, marginTop: 4, textAlign: "right" }}>{a.pct}% complété</div>
                    </div>
                    <button onClick={() => { setAdminPage("admin_suivi"); if (a.id) setCollabProfileId(a.id); }} style={{ ...sBtn("outline"), padding: "8px 16px", fontSize: 12 }}>Fiche</button>
                    <button onClick={() => { setAdminPage("admin_messagerie"); }} className="iz-btn-pink" style={{ ...sBtn("pink"), padding: "8px 16px", fontSize: 12 }}>1:1</button>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", padding: "0 22px 18px", gap: 24 }}>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: C.amber, letterSpacing: .5, marginBottom: 8 }}>⚠ VOS ACTIONS À FAIRE</div>
                      {a.todo.length === 0 ? (
                        <div style={{ fontSize: 12, color: C.textMuted, fontStyle: "italic", padding: "6px 0" }}>Aucune action en attente</div>
                      ) : a.todo.map((tt: string, i: number) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0" }}>
                          <div style={{ width: 16, height: 16, borderRadius: 4, border: `2px solid ${C.amber}` }} />
                          <span style={{ fontSize: 13, color: C.text }}>{tt}</span>
                        </div>
                      ))}
                    </div>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: C.green, letterSpacing: .5, marginBottom: 8 }}>✓ RÉCEMMENT VALIDÉ (7j)</div>
                      {a.done.length === 0 ? (
                        <div style={{ fontSize: 12, color: C.textMuted, fontStyle: "italic", padding: "6px 0" }}>Aucune validation cette semaine</div>
                      ) : a.done.map((d: string, i: number) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0" }}>
                          <div style={{ width: 16, height: 16, borderRadius: 4, background: C.green, display: "flex", alignItems: "center", justifyContent: "center" }}><Check size={11} color="#fff" /></div>
                          <span style={{ fontSize: 13, color: C.textLight }}>{d}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          );
        })()}

        {/* CITATIONS DU JOUR — référentiel admin */}
        {adminPage === "admin_quotes" && (
          <AdminQuotesPage C={C} sCard={sCard} sBtn={sBtn} sInput={sInput} font={font} addToast={addToast_admin} />
        )}

        {/* RDV RÉCURRENTS — admin CRUD */}
        {adminPage === "admin_recurring_meetings" && (
          <AdminRecurringMeetingsPage C={C} sCard={sCard} sBtn={sBtn} sInput={sInput} font={font} addToast={addToast_admin} parcours={PARCOURS_TEMPLATES} collaborateurs={COLLABORATEURS} />
        )}
          </>);
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
                  <input value={fc.label} onChange={e => setFieldConfig(prev => prev.map(f => f.id === fc.id ? { ...f, label: e.target.value } : f))} style={{ ...sInput, fontSize: 13 }} />
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>{LANG_META.en.nativeName} (EN)</label>
                  <input value={translateEN} onChange={e => setTranslateEN(e.target.value)} placeholder={`${LANG_META.en.nativeName}...`} style={{ ...sInput, fontSize: 13 }} />
                </div>
                <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                  <button onClick={() => setTranslateFieldId(null)} style={{ ...sBtn("outline"), fontSize: 13 }}>{t('common.cancel')}</button>
                  <button onClick={async () => {
                    await apiUpdateFieldConfig(fc.id, { label: fc.label, label_en: translateEN });
                    setFieldConfig(prev => prev.map(f => f.id === fc.id ? { ...f, label: fc.label, label_en: translateEN } : f));
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
        {typeof renderOcrModal === "function" && renderOcrModal()}
        {typeof renderRelanceModal === "function" && renderRelanceModal()}
        {typeof renderGenerateContratModal === "function" && renderGenerateContratModal()}
        {adminPanels.renderCollabPanel()}
        {adminPanels.renderParcoursPanel()}
        {adminPanels.renderPhasePanel()}
      </div>
    );
  }
  // ─── EMPLOYEE MAIN RENDER ────────────────────────────────
  // Lock employee pages when no active subscription (trial expired or sub not renewed)
  if (!isEditorTenant && !hasActiveSub && !isInTrial) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", fontFamily: font, background: C.white, color: C.text, padding: "60px 40px", textAlign: "center" }}>
        <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;1,9..40,400&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <div style={{ marginBottom: 24 }}><IllizeoLogoBrand style={{ height: 32 }} /></div>
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#FFF3E0", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
          <Lock size={28} color="#E65100" />
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: C.dark, margin: "0 0 8px" }}>Plateforme en maintenance</h2>
        <p style={{ fontSize: 14, color: C.textMuted, maxWidth: 400, lineHeight: 1.6, margin: 0 }}>
          La plateforme est temporairement indisponible. Veuillez contacter votre service RH pour plus d'informations.
        </p>
      </div>
    );
  }
  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: font, background: C.white, color: C.text }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;1,9..40,400&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" /><style dangerouslySetInnerHTML={{ __html: ANIM_STYLES }} />
      {renderSidebar()}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
      {renderEmployeeTopbar()}
      {dashPage === "tableau_de_bord" && renderDashboard()}
      {dashPage === "mes_actions" && renderMesActions()}
      {dashPage === "messagerie" && renderMessagerie()}
      {dashPage === "mon_profil" && renderMonProfil()}
      {dashPage === "organigramme" && renderMonEquipe()}
      {dashPage === "assistant_ia" && renderAssistantIA()}
      {dashPage === "entreprise" && renderEntreprise()}
      {dashPage === "cooptation" && (() => {
        const activeCampaigns = empCampaigns.filter(c => c.statut === "active");
        const reloadEmpCoopt = () => {
          getCooptations().then(list => setEmpCooptations(list.filter(c => c.referrer_email === auth.user?.email))).catch(() => {});
          getCooptationCampaigns().then(setEmpCampaigns).catch(() => {});
        };
        // Boost helpers: a campaign is "boosted live" if boost_active and the
        // optional end date hasn't passed. Effective reward = base × multiplier.
        const isBoosted = (c: any) => !!(c?.boost_active && (!c.boost_until || new Date(c.boost_until) >= new Date(new Date().toDateString())));
        const effectiveReward = (c: any) => {
          const base = Number(c?.montant_recompense) || 0;
          return isBoosted(c) ? base * (Number(c.boost_multiplier) || 1) : base;
        };
        const daysUntil = (dateStr?: string | null) => {
          if (!dateStr) return null;
          const target = new Date(dateStr);
          const today = new Date(new Date().toDateString());
          return Math.max(0, Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
        };
        const boostedCampaigns = activeCampaigns.filter(isBoosted);
        const regularCampaigns = activeCampaigns.filter(c => !isBoosted(c));
        // Total potential = sum of effective rewards across all open positions.
        const totalPotential = activeCampaigns.reduce((sum, c) => sum + effectiveReward(c), 0);
        // My recommendation stats (real data from the user's own cooptations).
        const myActive = empCooptations.filter(c => c.statut === "en_attente" || c.statut === "embauche").length;
        const myRewarded = empCooptations.filter(c => c.recompense_versee).length;
        const openRecommend = (campaignId: number | null, poste: string, reward: number | null, prefill?: Partial<{ candidate_name: string; candidate_poste: string; linkedin_url: string }>) => {
          setEmpCooptForm({
            open: true,
            campaign_id: campaignId,
            candidate_name: prefill?.candidate_name || "",
            candidate_email: "",
            candidate_poste: prefill?.candidate_poste || poste,
            telephone: "",
            linkedin_url: prefill?.linkedin_url || "",
            message: "",
            step: 1,
            source: null,
            reward: reward,
          });
        };
        return (
        <div style={{ flex: 1, padding: "32px 40px", overflow: "auto" }}>
          {/* ── Hero ── */}
          <div className="iz-fade-up" style={{
            position: "relative", overflow: "hidden",
            borderRadius: 20, padding: "40px 48px",
            background: `linear-gradient(135deg, ${C.pinkLight} 0%, ${C.pinkBg} 50%, ${C.pinkLight} 100%)`,
            marginBottom: 28,
          }}>
            {/* Decorative network graph (right side) */}
            <svg viewBox="0 0 320 240" style={{ position: "absolute", right: 24, top: "50%", transform: "translateY(-50%)", width: 360, height: 260, opacity: .92, pointerEvents: "none" }}>
              <line x1="160" y1="120" x2="60" y2="48" stroke={C.pink} strokeWidth="1.5" strokeOpacity=".35" />
              <line x1="160" y1="120" x2="280" y2="60" stroke={C.pink} strokeWidth="1.5" strokeOpacity=".35" />
              <line x1="160" y1="120" x2="270" y2="170" stroke={C.pink} strokeWidth="1.5" strokeOpacity=".35" />
              <line x1="160" y1="120" x2="60" y2="160" stroke={C.pink} strokeWidth="1.5" strokeOpacity=".35" />
              <line x1="160" y1="120" x2="180" y2="200" stroke={C.pink} strokeWidth="1" strokeOpacity=".25" />
              <line x1="160" y1="120" x2="220" y2="40" stroke={C.pink} strokeWidth="1" strokeOpacity=".25" />
              <line x1="60" y1="48" x2="220" y2="40" stroke={C.pink} strokeWidth="1" strokeOpacity=".15" />
              <line x1="280" y1="60" x2="270" y2="170" stroke={C.pink} strokeWidth="1" strokeOpacity=".15" />
              <line x1="60" y1="160" x2="180" y2="200" stroke={C.pink} strokeWidth="1" strokeOpacity=".15" />
              {/* central node = current user — photo if available, otherwise initials */}
              <defs>
                <clipPath id="coopt-me-clip"><circle cx="160" cy="120" r="22" /></clipPath>
              </defs>
              <circle cx="160" cy="120" r="34" fill={C.pink} fillOpacity=".15" />
              {avatarImage ? (
                <>
                  <image href={avatarImage} x="138" y="98" width="44" height="44" clipPath="url(#coopt-me-clip)" preserveAspectRatio="xMidYMid slice" />
                  <circle cx="160" cy="120" r="22" fill="none" stroke={C.pink} strokeWidth="2.5" />
                </>
              ) : (
                <>
                  <circle cx="160" cy="120" r="22" fill={C.pink} />
                  <text x="160" y="125" textAnchor="middle" fontSize="11" fontWeight="700" fill="#fff" fontFamily={font}>{(auth.user?.name || "").split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() || "MOI"}</text>
                </>
              )}
              {/* peripheral nodes */}
              <circle cx="60" cy="48" r="14" fill="#a78bfa" />
              <circle cx="60" cy="48" r="20" fill="#a78bfa" fillOpacity=".18" />
              <circle cx="280" cy="60" r="14" fill="#10b981" />
              <circle cx="280" cy="60" r="20" fill="#10b981" fillOpacity=".18" />
              <circle cx="270" cy="170" r="11" fill="#f59e0b" />
              <circle cx="60" cy="160" r="11" fill="#3b82f6" />
              <circle cx="60" cy="160" r="17" fill="#3b82f6" fillOpacity=".18" />
              <circle cx="180" cy="200" r="8" fill="#cbd5e1" />
              <circle cx="220" cy="40" r="8" fill="#cbd5e1" />
            </svg>

            <div style={{ position: "relative", zIndex: 1, maxWidth: 580 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.pink, letterSpacing: 1.5, marginBottom: 14, textTransform: "uppercase" }}>{t('admin.cooptation') || 'Cooptation'}</div>
              <h1 style={{ fontSize: 44, fontWeight: 800, color: C.text, lineHeight: 1.05, margin: "0 0 16px", fontFamily: fontDisplay, letterSpacing: -1 }}>
                Recommandez,<br /><span style={{ color: C.pink }}>débloquez {fmtCurrency(totalPotential || 0)}</span>.
              </h1>
              <p style={{ fontSize: 14, color: C.textLight, lineHeight: 1.6, margin: "0 0 24px", maxWidth: 440 }}>
                {activeCampaigns.length > 0
                  ? `${activeCampaigns.length} poste${activeCampaigns.length > 1 ? "s" : ""} ouvert${activeCampaigns.length > 1 ? "s" : ""} attend${activeCampaigns.length > 1 ? "ent" : ""} votre recommandation. Une embauche issue de votre réseau, c'est une récompense versée.`
                  : "Aucun poste ouvert pour l'instant. Revenez quand l'équipe RH lancera de nouvelles campagnes."}
              </p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <div style={{ background: C.white, borderRadius: 12, padding: "12px 18px", minWidth: 130 }}>
                  <div style={{ fontSize: 24, fontWeight: 700, color: C.text, fontFamily: fontDisplay, letterSpacing: -0.4 }}>{activeCampaigns.length}</div>
                  <div style={{ fontSize: 10, color: C.textMuted, textTransform: "uppercase", letterSpacing: .4, marginTop: 2 }}>postes ouverts</div>
                </div>
                <div style={{ background: C.pinkLight, borderRadius: 12, padding: "12px 18px", minWidth: 130 }}>
                  <div style={{ fontSize: 24, fontWeight: 700, color: C.pink, fontFamily: fontDisplay, letterSpacing: -0.4 }}>{myActive}</div>
                  <div style={{ fontSize: 10, color: C.pink, opacity: .8, textTransform: "uppercase", letterSpacing: .4, marginTop: 2 }}>recommandations en cours</div>
                </div>
                <div style={{ background: C.pinkLight, borderRadius: 12, padding: "12px 18px", minWidth: 130 }}>
                  <div style={{ fontSize: 24, fontWeight: 700, color: C.pink, fontFamily: fontDisplay, letterSpacing: -0.4 }}>{myRewarded}</div>
                  <div style={{ fontSize: 10, color: C.pink, opacity: .8, textTransform: "uppercase", letterSpacing: .4, marginTop: 2 }}>récompenses reçues</div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Boosted cooptations ── */}
          {boostedCampaigns.length > 0 && (
            <div style={{ marginBottom: 32 }}>
              {boostedCampaigns.map(camp => {
                const base = Number(camp.montant_recompense) || 0;
                const mult = Number(camp.boost_multiplier) || 1;
                const boosted = base * mult;
                const days = daysUntil(camp.boost_until);
                const tags = [camp.departement, camp.site, camp.type_contrat].filter(Boolean) as string[];
                return (
                  <div key={camp.id} className="iz-fade-up" style={{ marginBottom: 20 }}>
                    {/* Outer banner */}
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 10, background: "linear-gradient(135deg, #f97316, #f59e0b)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(249,115,22,.35)" }}>
                        <Rocket size={18} color="#fff" />
                      </div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{camp.boost_label || "Urgent · besoin critique"}</div>
                        <div style={{ fontSize: 12, color: C.textMuted }}>Cooptation prioritaire — bonus ×{mult}{days != null ? ` pendant ${days} jour${days > 1 ? "s" : ""}` : ""}</div>
                      </div>
                    </div>
                    {/* Dark gradient card */}
                    <div style={{ position: "relative", borderRadius: 18, overflow: "hidden",
                      background: "linear-gradient(135deg, #1a1a2e 0%, #2D1B3D 50%, #4a2a5a 100%)",
                      color: "#fff", padding: "24px 28px",
                      boxShadow: "0 12px 32px rgba(45,27,61,.35)" }}>
                      {/* Decorative blob */}
                      <div style={{ position: "absolute", right: -60, bottom: -60, width: 240, height: 240, borderRadius: "50%", background: `${C.pink}22`, pointerEvents: "none" }} />
                      <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 24 }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 6, background: "rgba(255,107,153,.18)", border: "1px solid rgba(255,107,153,.4)", fontSize: 10, fontWeight: 700, color: "#ff8fb8", letterSpacing: 1 }}>
                            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#ff6b99" }} /> BONUS ×{mult}{days != null ? ` · ${days} JOUR${days > 1 ? "S" : ""}` : ""}
                          </span>
                          <h3 style={{ fontSize: 32, fontWeight: 800, color: "#fff", margin: "12px 0 10px", fontFamily: fontDisplay, letterSpacing: -0.8, lineHeight: 1.05 }}>{camp.titre}</h3>
                          {camp.description && <p style={{ fontSize: 13, color: "rgba(255,255,255,.78)", lineHeight: 1.55, margin: "0 0 14px", maxWidth: 460 }}>{camp.description}</p>}
                          {tags.length > 0 && (
                            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
                              {tags.map((tag, i) => (
                                <span key={i} style={{ padding: "4px 10px", borderRadius: 6, background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.12)", fontSize: 11, color: "rgba(255,255,255,.85)" }}>{tag}</span>
                              ))}
                            </div>
                          )}
                          <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12, color: "rgba(255,255,255,.7)" }}>
                            <div style={{ width: 28, height: 28, borderRadius: "50%", background: C.pink, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>
                              {(auth.user?.name || "RH").split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                            </div>
                            <span>Hiring : <strong style={{ color: "#fff", fontWeight: 600 }}>{auth.user?.name || "Équipe RH"}</strong></span>
                            {(camp.site || camp.type_contrat) && (
                              <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                                <span style={{ opacity: .4 }}>·</span>
                                <MapPin size={11} color={C.pink} />
                                {[camp.site, camp.type_contrat].filter(Boolean).join(" · ")}
                              </span>
                            )}
                          </div>
                        </div>
                        {/* Reward block */}
                        <div style={{ textAlign: "right" as const, flexShrink: 0 }}>
                          <div style={{ fontSize: 10, color: "#fbbf24", fontWeight: 700, letterSpacing: 1.5, marginBottom: 8 }}>RÉCOMPENSE × {mult}</div>
                          <div style={{ fontSize: 42, fontWeight: 800, color: "#fff", lineHeight: 1, fontFamily: fontDisplay, letterSpacing: -1.2 }}>
                            {boosted.toLocaleString('fr-CH')}<span style={{ fontSize: 16, fontWeight: 600, color: "rgba(255,255,255,.7)", marginLeft: 4 }}>CHF</span>
                          </div>
                          <div style={{ fontSize: 11, color: "rgba(255,255,255,.5)", marginTop: 6, textDecoration: "line-through" }}>au lieu de {fmtCurrency(base)}</div>
                          <div style={{ display: "flex", gap: 8, marginTop: 18, justifyContent: "flex-end" }}>
                            <button onClick={() => openRecommend(camp.id, camp.titre, boosted)}
                              style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "11px 22px", borderRadius: 10, border: "none", background: C.pink, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: font, boxShadow: "0 4px 12px rgba(233,30,140,.4)" }}>
                              <Plus size={14} /> Recommander
                            </button>
                            <button onClick={() => setShareModal({ open: true, campaign: camp })} style={{ padding: "11px 18px", borderRadius: 10, border: "1px solid rgba(255,255,255,.2)", background: "rgba(255,255,255,.06)", color: "#fff", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: font }}>
                              Partager
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── Open positions ── */}
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 17, fontWeight: 600, marginBottom: 12, display: "flex", alignItems: "center", gap: 8, color: C.text }}>
              <Target size={18} color={C.pink} /> {t('emp.open_positions')}
            </h2>
            {regularCampaigns.length === 0 ? (
              <div style={{ padding: "30px 20px", textAlign: "center", color: C.textMuted, fontSize: 13, border: `1px dashed ${C.border}`, borderRadius: 12 }}>
                {boostedCampaigns.length > 0 ? "Tous les autres postes sont actuellement boostés ci-dessus." : t('emp.no_open_positions')}
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 14 }}>
                {regularCampaigns.map(camp => (
                  <div key={camp.id} className="iz-card" style={{ ...sCard, padding: 0, overflow: "hidden" }}>
                    <div style={{ padding: "16px 20px" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6, gap: 8 }}>
                        <h3 style={{ fontSize: 14, fontWeight: 600, margin: 0, color: C.text }}>{camp.titre}</h3>
                        <span style={{ padding: "2px 8px", borderRadius: 6, fontSize: 10, fontWeight: 600, background: camp.priorite === "urgente" ? C.redLight : camp.priorite === "haute" ? C.amberLight : C.blueLight, color: camp.priorite === "urgente" ? C.red : camp.priorite === "haute" ? C.amber : C.blue }}>{camp.priorite}</span>
                      </div>
                      {camp.description && <p style={{ fontSize: 12, color: C.textLight, margin: "0 0 8px", lineHeight: 1.5 }}>{camp.description}</p>}
                      <div style={{ display: "flex", gap: 12, fontSize: 11, color: C.textMuted, flexWrap: "wrap" }}>
                        {camp.departement && <span>{camp.departement}</span>}
                        {camp.site && <span>{camp.site}</span>}
                        <span>{camp.type_contrat}</span>
                      </div>
                    </div>
                    <div style={{ padding: "10px 20px", borderTop: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                      <div style={{ fontSize: 12 }}>
                        <span style={{ fontWeight: 700, color: C.pink }}>{camp.type_recompense === "prime" ? fmtCurrency(camp.montant_recompense || 0) : camp.description_recompense || "Cadeau"}</span>
                        <span style={{ color: C.textMuted, marginLeft: 4 }}>{t('emp.reward_label')}</span>
                      </div>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button onClick={() => setShareModal({ open: true, campaign: camp })} title={t('emp.share')} className="iz-btn-outline" style={{ ...sBtn("outline"), padding: "5px 10px", fontSize: 11, display: "flex", alignItems: "center", gap: 4 }}><Link size={11} /> {t('emp.share')}</button>
                        <button onClick={() => openRecommend(camp.id, camp.titre, camp.montant_recompense || null)} className="iz-btn-pink" style={{ ...sBtn("pink"), padding: "5px 14px", fontSize: 11, display: "flex", alignItems: "center", gap: 4 }}><UserPlus size={11} /> {t('emp.recommend')}</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── My recommendations ── */}
          <h2 style={{ fontSize: 17, fontWeight: 600, marginBottom: 12, display: "flex", alignItems: "center", gap: 8, color: C.text }}>
            <Clock size={18} color={C.blue} /> {t('emp.my_recommendations')}
          </h2>
          {empCooptations.length === 0 ? (
            <div style={{ padding: "30px 20px", textAlign: "center", color: C.textMuted, fontSize: 13, border: `1px dashed ${C.border}`, borderRadius: 12 }}>{t('emp.no_recommendation')}</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
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

          {/* ── 2-step recommend modal ── */}
          {empCooptForm.open && (() => {
            const step = empCooptForm.step ?? 1;
            const reward = empCooptForm.reward ?? 0;
            const close = () => setEmpCooptForm(f => ({ ...f, open: false, step: 1, source: null }));
            const goNext = () => setEmpCooptForm(f => ({ ...f, step: 2 }));
            const goBack = () => setEmpCooptForm(f => ({ ...f, step: 1 }));
            const submit = async () => {
              // Client-side guards before hitting the API — gives the user
              // immediate feedback instead of a silent backend 422.
              const name = empCooptForm.candidate_name.trim();
              const email = empCooptForm.candidate_email.trim();
              if (!name) { addToast("Le nom du candidat est requis", "warning"); setEmpCooptForm(f => ({ ...f, step: 1 })); return; }
              if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { addToast("L'email du candidat n'est pas valide", "warning"); setEmpCooptForm(f => ({ ...f, step: 1 })); return; }
              try {
                const created = await apiCreateCooptation({
                  referrer_name: auth.user?.name || "",
                  referrer_email: auth.user?.email || "",
                  candidate_name: name,
                  candidate_email: email,
                  candidate_poste: empCooptForm.candidate_poste,
                  linkedin_url: empCooptForm.linkedin_url || null,
                  telephone: empCooptForm.telephone || null,
                  campaign_id: empCooptForm.campaign_id,
                  notes: empCooptForm.message,
                  date_cooptation: new Date().toISOString().slice(0, 10),
                  type_recompense: "prime",
                  mois_requis: 6,
                });
                if ((empCooptForm as any)._cvFile && created?.id) {
                  try { await uploadCooptationCv(created.id, (empCooptForm as any)._cvFile); } catch {}
                }
                close();
                reloadEmpCoopt();
                addToast(t('emp.recommendation_sent') || "Recommandation envoyée", "success");
              } catch (err: any) {
                // Surface the backend validation message if any (Laravel sends
                // a JSON body with `errors`/`message` inside err.message).
                let detail = "";
                try { const body = err?.message ? JSON.parse(err.message) : null; if (body?.message) detail = body.message; if (body?.errors) detail = Object.values(body.errors).flat().join(" · "); } catch {}
                addToast(detail || t('emp.send_error') || "Impossible d'envoyer la recommandation", "error");
              }
            };
            // Field-level validation — drives the red border, error label
            // under each input, and the disabled state on Continue/Submit.
            const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const linkedinRe = /^(https?:\/\/)?([a-z]{2,3}\.)?linkedin\.com\/in\/[A-Za-z0-9\-_%]+\/?(\?.*)?$/i;
            const trimmedEmail = empCooptForm.candidate_email.trim();
            const trimmedLinkedin = (empCooptForm.linkedin_url || "").trim();
            const emailValid = !trimmedEmail || emailRe.test(trimmedEmail);
            const linkedinValid = !trimmedLinkedin || linkedinRe.test(trimmedLinkedin);
            const canSubmit = empCooptForm.candidate_name.trim() && trimmedEmail && emailValid && linkedinValid;
            const canContinue = !!(empCooptForm.candidate_name.trim() && trimmedEmail && emailValid && linkedinValid);
            const fieldStyle = (ok: boolean) => ({ ...sInput, borderColor: ok ? C.border : C.red, boxShadow: ok ? undefined : `0 0 0 2px ${C.redLight}` });
            return (
              <div style={{ position: "fixed", inset: 0, zIndex: 3000, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,.4)" }} onClick={close}>
                <div className="iz-fade-up" onClick={e => e.stopPropagation()} style={{ background: C.white, borderRadius: 16, width: 540, maxWidth: "92vw", boxShadow: "0 20px 60px rgba(0,0,0,.25)", fontFamily: font, overflow: "hidden" }}>
                  {/* Header */}
                  <div style={{ padding: "24px 28px 18px" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 14 }}>
                      <div style={{ width: 38, height: 38, borderRadius: 10, background: `linear-gradient(135deg, ${C.pink}, #a855f7)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <UserPlus size={18} color="#fff" />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h3 style={{ fontSize: 17, fontWeight: 600, color: C.text, margin: 0, lineHeight: 1.3 }}>Recommander pour {empCooptForm.candidate_poste || "ce poste"}</h3>
                        <p style={{ fontSize: 13, color: C.textMuted, margin: "4px 0 0" }}>Étape {step} sur 2 · récompense de <strong style={{ color: C.pink, fontWeight: 700 }}>{fmtCurrency(reward)}</strong></p>
                      </div>
                      <button onClick={close} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: C.textLight }}><X size={20} /></button>
                    </div>
                    {/* Progress bar */}
                    <div style={{ height: 4, borderRadius: 2, background: C.bg, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: step === 1 ? "50%" : "100%", background: `linear-gradient(90deg, ${C.pink}, #a855f7)`, transition: "width .3s ease" }} />
                    </div>
                  </div>

                  {/* Body */}
                  <div style={{ padding: "8px 28px 24px" }}>
                    {step === 1 ? (
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                        <div>
                          <label style={{ fontSize: 12, color: C.text, display: "block", marginBottom: 6, fontWeight: 500 }}>Nom complet *</label>
                          <input value={empCooptForm.candidate_name} onChange={e => setEmpCooptForm(f => ({ ...f, candidate_name: e.target.value }))} style={sInput} placeholder="Prénom Nom" />
                        </div>
                        <div>
                          <label style={{ fontSize: 12, color: C.text, display: "block", marginBottom: 6, fontWeight: 500 }}>Email *</label>
                          <input type="email" value={empCooptForm.candidate_email} onChange={e => setEmpCooptForm(f => ({ ...f, candidate_email: e.target.value }))} style={fieldStyle(emailValid)} placeholder="email@exemple.com" />
                          {!emailValid && <div style={{ fontSize: 11, color: C.red, marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}><AlertTriangle size={11} /> Format d'email invalide</div>}
                        </div>
                        <div>
                          <label style={{ fontSize: 12, color: C.text, display: "block", marginBottom: 6, fontWeight: 500 }}>Téléphone</label>
                          <input value={empCooptForm.telephone || ""} onChange={e => setEmpCooptForm(f => ({ ...f, telephone: e.target.value }))} style={sInput} placeholder="+41 79 ..." />
                        </div>
                        <div>
                          <label style={{ fontSize: 12, color: C.text, display: "block", marginBottom: 6, fontWeight: 500 }}>LinkedIn (optionnel)</label>
                          <input value={empCooptForm.linkedin_url || ""} onChange={e => setEmpCooptForm(f => ({ ...f, linkedin_url: e.target.value }))} style={fieldStyle(linkedinValid)} placeholder="linkedin.com/in/..." />
                          {!linkedinValid && <div style={{ fontSize: 11, color: C.red, marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}><AlertTriangle size={11} /> URL LinkedIn invalide (ex : linkedin.com/in/prenom-nom)</div>}
                        </div>
                      </div>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                        {/* Candidate summary card (read-only — collected in step 1) */}
                        <div style={{ padding: "14px 16px", borderRadius: 10, background: C.bg, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 12 }}>
                          <div style={{ width: 40, height: 40, borderRadius: "50%", background: C.pink, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
                            {(empCooptForm.candidate_name || "?").split(" ").map((p: string) => p[0]).join("").slice(0, 2).toUpperCase()}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{empCooptForm.candidate_name || "—"}</div>
                            <div style={{ fontSize: 12, color: C.textMuted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{empCooptForm.candidate_email || "—"}{empCooptForm.candidate_poste ? ` · ${empCooptForm.candidate_poste}` : ""}</div>
                          </div>
                          <button type="button" onClick={goBack} style={{ background: "none", border: "none", color: C.pink, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: font, padding: "6px 10px" }}>Modifier</button>
                        </div>
                        <div>
                          <label style={{ fontSize: 12, color: C.text, display: "block", marginBottom: 6, fontWeight: 500 }}>{t('emp.message_optional')}</label>
                          <textarea value={empCooptForm.message} onChange={e => setEmpCooptForm(f => ({ ...f, message: e.target.value }))} style={{ ...sInput, minHeight: 80, resize: "vertical" }} placeholder={t('emp.message_placeholder') || "Expliquez en quelques mots pourquoi cette personne est un bon fit…"} />
                        </div>
                        <div>
                          <label style={{ fontSize: 12, color: C.text, display: "flex", alignItems: "center", gap: 6, marginBottom: 6, fontWeight: 500 }}><Paperclip size={12} /> CV / Pièce jointe</label>
                          {(empCooptForm as any)._cvFile ? (
                            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", borderRadius: 8, background: C.greenLight, fontSize: 12 }}>
                              <FileText size={14} color={C.green} />
                              <span style={{ flex: 1, color: C.text, fontWeight: 500 }}>{((empCooptForm as any)._cvFile as File).name}</span>
                              <button type="button" onClick={() => setEmpCooptForm(f => { const copy = { ...f }; delete (copy as any)._cvFile; return copy; })} style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}><X size={12} color={C.red} /></button>
                            </div>
                          ) : (
                            <label style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 14px", borderRadius: 8, border: `1px dashed ${C.border}`, cursor: "pointer", fontSize: 12, color: C.textLight }}>
                              <Upload size={14} /> Glisser ou cliquer pour ajouter un CV (PDF, DOC, max 5 Mo)
                              <input type="file" accept=".pdf,.doc,.docx" style={{ display: "none" }} onChange={e => {
                                const file = e.target.files?.[0];
                                if (file) setEmpCooptForm(f => ({ ...f, _cvFile: file } as any));
                              }} />
                            </label>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div style={{ padding: "16px 28px", borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, background: C.bg }}>
                    {step === 1 ? (
                      <>
                        <button onClick={close} className="iz-btn-outline" style={{ ...sBtn("outline"), padding: "10px 20px" }}>{t('common.cancel')}</button>
                        <button disabled={!canContinue} onClick={goNext} className="iz-btn-pink" style={{ ...sBtn("pink"), padding: "10px 22px", display: "inline-flex", alignItems: "center", gap: 6, opacity: canContinue ? 1 : 0.5 }}>
                          Continuer <ArrowRight size={14} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button onClick={goBack} className="iz-btn-outline" style={{ ...sBtn("outline"), padding: "10px 18px", display: "inline-flex", alignItems: "center", gap: 6 }}>
                          <ChevronLeft size={14} /> Retour
                        </button>
                        <button disabled={!canSubmit} onClick={submit} className="iz-btn-pink" style={{ ...sBtn("pink"), padding: "10px 22px", display: "inline-flex", alignItems: "center", gap: 6, opacity: canSubmit ? 1 : 0.5 }}>
                          <Send size={14} /> Envoyer la recommandation
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* ── Share modal ── */}
          {shareModal.open && shareModal.campaign && (() => {
            const camp = shareModal.campaign;
            const close = () => setShareModal({ open: false, campaign: null });
            const reward = effectiveReward(camp);
            const baseReward = Number(camp.montant_recompense) || 0;
            // Public-shareable URL — includes tenant slug so the landing page
            // can resolve the right database without login.
            const tenantSlug = localStorage.getItem("illizeo_tenant_id") || "illizeo";
            const url = `${window.location.origin}/${tenantSlug}/c/${camp.share_token || ""}`;
            const tenant = (auth.user as any)?.tenant_name || "nous";
            const linkedinPost = `🚀 On recherche un·e ${camp.titre} chez ${tenant} !\n\n${camp.description ? camp.description.slice(0, 220) : "Une opportunité pour rejoindre une équipe qui a du sens."}\n\n💰 Prime de cooptation : ${fmtCurrency(reward)}\n📍 ${[camp.site, camp.type_contrat].filter(Boolean).join(" · ")}\n\nIntéressé·e ou tu connais quelqu'un ? Envoie-moi un message ou découvre l'offre 👇\n${url}\n\n#recrutement #${(camp.titre || "job").replace(/\s+/g, "")} #cooptation`;
            const text = `On recrute ! Poste de ${camp.titre} chez ${tenant} — ${camp.description ? camp.description.slice(0, 140) : "rejoins une équipe qui a du sens"}. Prime de cooptation : ${fmtCurrency(reward)}.`;
            const shareLinkedIn = async () => {
              // LinkedIn no longer supports pre-filled post text via URL params.
              // Workaround: copy the post body to clipboard first, then open
              // LinkedIn — user pastes with Ctrl+V into the text field.
              try {
                if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(linkedinPost);
                else { const ta = document.createElement("textarea"); ta.value = linkedinPost; ta.style.position = "fixed"; ta.style.opacity = "0"; document.body.appendChild(ta); ta.select(); document.execCommand("copy"); document.body.removeChild(ta); }
                addToast("Texte copié — collez-le (Ctrl+V) dans la fenêtre LinkedIn", "success");
              } catch { addToast("LinkedIn ouvert — copiez votre texte manuellement", "warning"); }
              const u = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
              window.open(u, "_blank", "noopener,noreferrer,width=600,height=720");
              close();
            };
            const shareEmail = () => {
              const subject = `Opportunité : ${camp.titre}${reward > 0 ? ` — prime ${fmtCurrency(reward)}` : ""}`;
              const body = `${text}\n\nPlus d'infos et candidature : ${url}\n\n— Partagé via Illizeo`;
              window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, "_blank");
              close();
            };
            const copyLink = async () => {
              try {
                if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(url);
                else { const ta = document.createElement("textarea"); ta.value = url; ta.style.position = "fixed"; ta.style.opacity = "0"; document.body.appendChild(ta); ta.select(); document.execCommand("copy"); document.body.removeChild(ta); }
                addToast(t('emp.link_copied') || "Lien copié !", "success");
                close();
              } catch { prompt(lang === "fr" ? "Copiez ce lien :" : "Copy this link:", url); }
            };
            return (
              <div onClick={close} style={{ position: "fixed", inset: 0, zIndex: 3000, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,.4)", padding: 24 }}>
                <div onClick={e => e.stopPropagation()} className="iz-fade-up" style={{ background: C.white, borderRadius: 16, width: 520, maxWidth: "94vw", boxShadow: "0 20px 60px rgba(0,0,0,.25)", fontFamily: font, overflow: "hidden" }}>
                  <div style={{ padding: "22px 26px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: C.pink, letterSpacing: 1.5, textTransform: "uppercase" }}>Partager le poste</div>
                      <h3 style={{ fontSize: 18, fontWeight: 700, color: C.text, margin: "4px 0 4px", lineHeight: 1.2, fontFamily: fontDisplay, letterSpacing: -0.4 }}>{camp.titre}</h3>
                      <div style={{ fontSize: 12, color: C.textMuted }}>
                        Prime <strong style={{ color: C.pink }}>{fmtCurrency(reward)}</strong>{isBoosted(camp) && reward !== baseReward && <span style={{ color: C.textMuted, textDecoration: "line-through", marginLeft: 6 }}>{fmtCurrency(baseReward)}</span>}
                      </div>
                    </div>
                    <button onClick={close} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: C.textLight }}><X size={20} /></button>
                  </div>

                  <div style={{ padding: "20px 26px" }}>
                    <div style={{ display: "grid", gap: 10, marginBottom: 18 }}>
                      <button onClick={shareLinkedIn} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderRadius: 12, border: `1px solid ${C.border}`, background: C.white, cursor: "pointer", fontFamily: font, textAlign: "left" as const, transition: "all .12s" }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#0A66C2"; (e.currentTarget as HTMLElement).style.background = "#f0f7ff"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = C.border; (e.currentTarget as HTMLElement).style.background = C.white; }}>
                        <div style={{ width: 38, height: 38, borderRadius: 8, background: "#0A66C2", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <Linkedin size={18} color="#fff" />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>Publier sur LinkedIn</div>
                          <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>Ouvre la fenêtre de publication LinkedIn avec le lien pré-rempli</div>
                        </div>
                        <ChevronRight size={16} color={C.textMuted} />
                      </button>

                      <button onClick={shareEmail} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderRadius: 12, border: `1px solid ${C.border}`, background: C.white, cursor: "pointer", fontFamily: font, textAlign: "left" as const, transition: "all .12s" }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = C.pink; (e.currentTarget as HTMLElement).style.background = C.pinkBg; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = C.border; (e.currentTarget as HTMLElement).style.background = C.white; }}>
                        <div style={{ width: 38, height: 38, borderRadius: 8, background: C.pink, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <Mail size={18} color="#fff" />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>Envoyer par email</div>
                          <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>Ouvre votre client mail avec un message pré-rédigé</div>
                        </div>
                        <ChevronRight size={16} color={C.textMuted} />
                      </button>

                      <button onClick={copyLink} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderRadius: 12, border: `1px solid ${C.border}`, background: C.white, cursor: "pointer", fontFamily: font, textAlign: "left" as const, transition: "all .12s" }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = C.text; (e.currentTarget as HTMLElement).style.background = C.bg; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = C.border; (e.currentTarget as HTMLElement).style.background = C.white; }}>
                        <div style={{ width: 38, height: 38, borderRadius: 8, background: C.text, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <Link size={18} color="#fff" />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>Copier le lien</div>
                          <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>À coller dans Slack, Teams, WhatsApp ou ailleurs</div>
                        </div>
                        <ChevronRight size={16} color={C.textMuted} />
                      </button>
                    </div>

                    <div style={{ padding: "10px 12px", borderRadius: 8, background: C.bg, fontSize: 11, color: C.textMuted, display: "flex", alignItems: "center", gap: 8, fontFamily: "monospace" as const, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      <Link size={11} style={{ flexShrink: 0 }} />
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{url}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

        </div>
        );
      })()}
      {dashPage === "satisfaction" && (
        <div style={{ flex: 1, padding: "32px 40px", overflow: "auto" }}>
          <h1 style={{ fontSize: 24, fontWeight: 600, margin: "0 0 8px" }}>Feedback</h1>
          <p style={{ fontSize: 13, color: C.textMuted, margin: "0 0 24px" }}>
            Plusieurs canaux pour partager votre ressenti, vos idées ou signaler une situation.
          </p>

          {/* Feedback hub tabs */}
          <div style={{ display: "flex", gap: 4, padding: 4, background: C.bg, borderRadius: 10, marginBottom: 20, width: "fit-content", flexWrap: "wrap" }}>
            {([
              { id: "surveys", label: "Mes sondages", icon: BarChart3 },
              { id: "mood", label: "Mood check-in", icon: Smile },
              { id: "suggestion", label: "Suggestion / bug", icon: Lightbulb },
              { id: "buddy", label: "Évaluer buddy / manager", icon: Star },
            ] as const).map(tab => {
              const Icon = tab.icon;
              return (
                <button key={tab.id} onClick={() => setFeedbackTab(tab.id)} style={{
                  padding: "8px 14px", borderRadius: 6, fontSize: 12, fontWeight: feedbackTab === tab.id ? 600 : 400,
                  border: "none", cursor: "pointer", fontFamily: font,
                  background: feedbackTab === tab.id ? C.white : "transparent",
                  color: feedbackTab === tab.id ? C.pink : C.textMuted,
                  boxShadow: feedbackTab === tab.id ? "0 1px 3px rgba(0,0,0,.06)" : "none",
                  display: "inline-flex", alignItems: "center", gap: 6,
                }}><Icon size={14} /> {tab.label}</button>
              );
            })}
          </div>

          {feedbackTab === "mood" && (
            <div className="iz-card" style={{ ...sCard, marginBottom: 16 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, margin: "0 0 6px" }}>Comment vous sentez-vous aujourd'hui ?</h3>
              <p style={{ fontSize: 12, color: C.textMuted, margin: "0 0 16px" }}>Pulse rapide pour suivre votre ressenti dans le temps. Une note ≤ 2 alerte automatiquement les RH.</p>
              <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
                {[
                  { v: 1, e: "😞", l: "Très mauvais" },
                  { v: 2, e: "😟", l: "Mauvais" },
                  { v: 3, e: "😐", l: "Neutre" },
                  { v: 4, e: "🙂", l: "Bon" },
                  { v: 5, e: "😄", l: "Excellent" },
                ].map(m => {
                  const sel = moodDraft.mood === m.v;
                  return (
                    <button key={m.v} onClick={() => setMoodDraft(d => ({ ...d, mood: m.v }))} style={{
                      flex: 1, padding: "16px 8px", borderRadius: 12,
                      border: sel ? `2px solid ${C.pink}` : `1px solid ${C.border}`,
                      background: sel ? C.pinkBg : C.white, cursor: "pointer", fontFamily: font,
                      display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                    }}>
                      <div style={{ fontSize: 28 }}>{m.e}</div>
                      <div style={{ fontSize: 10, color: sel ? C.pink : C.textLight, fontWeight: sel ? 600 : 400 }}>{m.l}</div>
                    </button>
                  );
                })}
              </div>
              <textarea value={moodDraft.comment} onChange={e => setMoodDraft(d => ({ ...d, comment: e.target.value }))} placeholder="Un commentaire (optionnel)…" style={{ ...sInput, minHeight: 70, marginBottom: 12, resize: "vertical" }} />
              <button disabled={!moodDraft.mood} onClick={async () => {
                try {
                  const m = await import('./api/endpoints');
                  await m.postMood(moodDraft.mood!, moodDraft.comment || undefined);
                  addToast("Merci, votre ressenti a bien été enregistré 💙", "success");
                  setMoodDraft({ mood: null, comment: "" });
                  const list = await m.getMyMoods(); setMoodHistory(list || []);
                } catch { addToast("Impossible d'enregistrer pour le moment", "warning"); }
              }} className="iz-btn-pink" style={{ ...sBtn("pink"), opacity: moodDraft.mood ? 1 : 0.4 }}>Envoyer</button>

              {moodHistory.length > 0 && (
                <div style={{ marginTop: 24, paddingTop: 16, borderTop: `1px solid ${C.border}` }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: C.textMuted, marginBottom: 10 }}>VOS DERNIERS CHECK-INS</div>
                  {moodHistory.slice(0, 7).map((m: any) => {
                    const emoji = ["", "😞", "😟", "😐", "🙂", "😄"][m.mood] || "•";
                    return (
                      <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0", borderBottom: `1px solid ${C.border}` }}>
                        <div style={{ fontSize: 22 }}>{emoji}</div>
                        <div style={{ flex: 1, fontSize: 12, color: C.text }}>{m.comment || <span style={{ color: C.textMuted, fontStyle: "italic" }}>(sans commentaire)</span>}</div>
                        <div style={{ fontSize: 11, color: C.textMuted }}>{new Date(m.created_at).toLocaleDateString('fr-FR')}</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {feedbackTab === "suggestion" && (
            <div className="iz-card" style={{ ...sCard, marginBottom: 16 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, margin: "0 0 6px" }}>Boîte à suggestions</h3>
              <p style={{ fontSize: 12, color: C.textMuted, margin: "0 0 16px" }}>Une idée d'amélioration, un bug à signaler ou un retour libre ? Envoyez-le aux RH.</p>
              <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
                {([
                  { v: "suggestion", l: "Suggestion", icon: Lightbulb },
                  { v: "improvement", l: "Amélioration", icon: Sparkles },
                  { v: "bug", l: "Bug", icon: Bug },
                  { v: "other", l: "Autre", icon: MessageCircle },
                ] as const).map(c => {
                  const Icon = c.icon;
                  return (
                    <button key={c.v} onClick={() => setSuggestionDraft(d => ({ ...d, category: c.v }))} style={{
                      padding: "6px 14px", borderRadius: 16, fontSize: 12,
                      border: suggestionDraft.category === c.v ? `1.5px solid ${C.pink}` : `1px solid ${C.border}`,
                      background: suggestionDraft.category === c.v ? C.pinkBg : C.white,
                      color: suggestionDraft.category === c.v ? C.pink : C.text,
                      cursor: "pointer", fontFamily: font, fontWeight: suggestionDraft.category === c.v ? 600 : 400,
                      display: "inline-flex", alignItems: "center", gap: 6,
                    }}><Icon size={13} /> {c.l}</button>
                  );
                })}
              </div>
              <textarea value={suggestionDraft.content} onChange={e => setSuggestionDraft(d => ({ ...d, content: e.target.value }))} placeholder="Décrivez votre suggestion, bug ou retour…" style={{ ...sInput, minHeight: 120, marginBottom: 12, resize: "vertical" }} />
              <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: C.text, marginBottom: 12, cursor: "pointer" }}>
                <input type="checkbox" checked={suggestionDraft.anonymous} onChange={e => setSuggestionDraft(d => ({ ...d, anonymous: e.target.checked }))} />
                Envoyer anonymement (les RH ne verront pas votre identité)
              </label>
              <button disabled={!suggestionDraft.content.trim()} onClick={async () => {
                try {
                  const m = await import('./api/endpoints');
                  await m.postSuggestion({ category: suggestionDraft.category, content: suggestionDraft.content, anonymous: suggestionDraft.anonymous });
                  addToast("Merci, votre message a été transmis aux RH 🙏", "success");
                  setSuggestionDraft({ category: "suggestion", content: "", anonymous: false });
                } catch { addToast("Impossible d'envoyer pour le moment", "warning"); }
              }} className="iz-btn-pink" style={{ ...sBtn("pink"), opacity: suggestionDraft.content.trim() ? 1 : 0.4 }}>Envoyer</button>
            </div>
          )}

          {feedbackTab === "buddy" && (
            <div className="iz-card" style={{ ...sCard, marginBottom: 16 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, margin: "0 0 6px" }}>Évaluez votre buddy ou manager</h3>
              <p style={{ fontSize: 12, color: C.textMuted, margin: "0 0 16px" }}>Votre retour est confidentiel — utilisé pour suivre la qualité de l'accompagnement.</p>
              <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                {([
                  { v: "buddy" as const, l: "Mon buddy", icon: Star },
                  { v: "manager" as const, l: "Mon manager", icon: Briefcase },
                ]).map(t => {
                  const Icon = t.icon;
                  return (
                    <button key={t.v} onClick={() => setBuddyRatingDraft(d => ({ ...d, target_type: t.v }))} style={{
                      padding: "8px 18px", borderRadius: 8, fontSize: 13,
                      border: buddyRatingDraft.target_type === t.v ? `1.5px solid ${C.pink}` : `1px solid ${C.border}`,
                      background: buddyRatingDraft.target_type === t.v ? C.pinkBg : C.white,
                      color: buddyRatingDraft.target_type === t.v ? C.pink : C.text, cursor: "pointer", fontFamily: font,
                      fontWeight: buddyRatingDraft.target_type === t.v ? 600 : 400,
                      display: "inline-flex", alignItems: "center", gap: 6,
                    }}><Icon size={14} /> {t.l}</button>
                  );
                })}
              </div>
              <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
                {[1, 2, 3, 4, 5].map(n => {
                  const filled = n <= buddyRatingDraft.rating;
                  return (
                    <button key={n} onClick={() => setBuddyRatingDraft(d => ({ ...d, rating: n }))} style={{
                      width: 44, height: 44, borderRadius: 8,
                      border: filled ? `2px solid ${C.amber}` : `1px solid ${C.border}`,
                      background: filled ? C.amber + "20" : C.white, cursor: "pointer", fontSize: 22,
                    }}>{filled ? "★" : "☆"}</button>
                  );
                })}
              </div>
              <textarea value={buddyRatingDraft.comment} onChange={e => setBuddyRatingDraft(d => ({ ...d, comment: e.target.value }))} placeholder="Un commentaire (optionnel)…" style={{ ...sInput, minHeight: 80, marginBottom: 12, resize: "vertical" }} />
              <button disabled={!buddyRatingDraft.rating} onClick={async () => {
                try {
                  const m = await import('./api/endpoints');
                  await m.postBuddyRating({ target_type: buddyRatingDraft.target_type, rating: buddyRatingDraft.rating, comment: buddyRatingDraft.comment || undefined });
                  addToast("Merci, votre évaluation a été enregistrée 🙏", "success");
                  setBuddyRatingDraft({ target_type: "buddy", rating: 0, comment: "" });
                } catch { addToast("Impossible d'enregistrer pour le moment", "warning"); }
              }} className="iz-btn-pink" style={{ ...sBtn("pink"), opacity: buddyRatingDraft.rating ? 1 : 0.4 }}>Envoyer</button>
            </div>
          )}

          {feedbackTab === "surveys" && (<>
          <h2 style={{ fontSize: 17, fontWeight: 600, margin: "0 0 6px" }}>{t('emp.nps_title')}</h2>
          <p style={{ fontSize: 12, color: C.textMuted, margin: "0 0 16px" }}>{t('emp.nps_subtitle')}</p>

          {/* Tile grid view — shown when no survey is open */}
          {!openSurveyId && (() => {
            const list = empSurveys.filter((s: any) => s.survey?.actif ?? s.actif);
            if (list.length === 0) return (
              <div style={{ padding: "40px 20px", textAlign: "center", color: C.textMuted, fontSize: 13 }}>{t('emp.nps_no_surveys')}</div>
            );
            const typeMeta: Record<string, { icon: any; color: string }> = {
              nps: { icon: TrendingUp, color: C.pink },
              satisfaction: { icon: Smile, color: C.green },
              custom: { icon: ClipboardList, color: C.blue },
            };
            return (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
                {list.map((entry: any) => {
                  const survey = entry.survey || entry;
                  const answered = entry.completed || empNpsAnswers[survey.id]?.submitted;
                  const meta = typeMeta[survey.type] || typeMeta.custom;
                  const Icon = meta.icon;
                  return (
                    <div key={survey.id} className="iz-card" onClick={() => { if (!answered) setOpenSurveyId(survey.id); }}
                      style={{ ...sCard, padding: "20px 22px", cursor: answered ? "default" : "pointer", border: `1px solid ${answered ? C.green : C.border}`, transition: "all .15s", opacity: answered ? 0.75 : 1 }}
                      onMouseEnter={e => { if (!answered) { e.currentTarget.style.borderColor = meta.color; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,.06)"; } }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = answered ? C.green : C.border; e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                        <div style={{ width: 38, height: 38, borderRadius: 10, background: meta.color + "1A", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Icon size={18} color={meta.color} />
                        </div>
                        {answered
                          ? <span style={{ padding: "3px 10px", borderRadius: 6, fontSize: 10, fontWeight: 600, background: C.greenLight, color: C.green }}>{t('emp.nps_answered')}</span>
                          : <span style={{ padding: "3px 10px", borderRadius: 6, fontSize: 10, fontWeight: 600, background: C.amberLight, color: C.amber }}>{t('emp.nps_pending')}</span>}
                      </div>
                      <div style={{ fontSize: 15, fontWeight: 600, color: C.text, marginBottom: 6 }}>{survey.titre}</div>
                      <div style={{ fontSize: 12, color: C.textLight, lineHeight: 1.5, marginBottom: 12, minHeight: 36 }}>{survey.description || ""}</div>
                      {!answered && (
                        <div style={{ fontSize: 12, fontWeight: 600, color: meta.color, display: "flex", alignItems: "center", gap: 4 }}>
                          Répondre <ArrowRight size={13} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })()}

          {/* Detail view — only the selected survey, with a back button */}
          {openSurveyId && (
            <div>
              <button onClick={() => setOpenSurveyId(null)} className="iz-btn-outline" style={{ ...sBtn("outline"), marginBottom: 16, display: "inline-flex", alignItems: "center", gap: 6 }}>
                <ChevronLeft size={14} /> Retour aux sondages
              </button>
            </div>
          )}

          {openSurveyId && empSurveys.filter((s: any) => {
            const sv = s.survey || s;
            return (sv.actif ?? true) && sv.id === openSurveyId;
          }).map((entry: any) => {
            const survey = entry.survey || entry;
            const token = entry.token;
            const answered = entry.completed || empNpsAnswers[survey.id]?.submitted;
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

                      {q.type === "mood" && (() => {
                        const MOODS = [
                          { v: 1, emoji: "😣", label: "Mal", color: "#E53935" },
                          { v: 2, emoji: "😐", label: "Mitigé", color: "#FB8C00" },
                          { v: 3, emoji: "🙂", label: "Bien", color: "#43A047" },
                          { v: 4, emoji: "😊", label: "Très bien", color: "#E91E8C" },
                          { v: 5, emoji: "🤩", label: "Super", color: "#9C27B0" },
                        ];
                        const moodKey = `mood_${qi}`;
                        const cur = empNpsAnswers[survey.id]?.[moodKey];
                        return (
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10 }}>
                            {MOODS.map(m => {
                              const selected = cur === m.v;
                              return (
                                <button key={m.v} onClick={() => setEmpNpsAnswers(prev => ({ ...prev, [survey.id]: { ...prev[survey.id], [moodKey]: m.v } }))}
                                  style={{ padding: "16px 8px", borderRadius: 10, border: `2px solid ${selected ? m.color : C.border}`, background: selected ? m.color + "12" : C.white, cursor: "pointer", transition: "all .15s", fontFamily: font, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                                  <span style={{ fontSize: 32 }}>{m.emoji}</span>
                                  <span style={{ fontSize: 12, fontWeight: selected ? 700 : 500, color: selected ? m.color : C.textLight }}>{m.label}</span>
                                </button>
                              );
                            })}
                          </div>
                        );
                      })()}

                      {q.type === "multi_slider" && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                          {(q.dimensions || []).map((dim: string, di: number) => {
                            const sliderKey = `slider_${qi}_${di}`;
                            const v = empNpsAnswers[survey.id]?.[sliderKey] ?? 50;
                            return (
                              <div key={di} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                                <div style={{ width: 200, fontSize: 13, color: C.text }}>{dim}</div>
                                <input type="range" min={0} max={100} value={v}
                                  onChange={e => setEmpNpsAnswers(prev => ({ ...prev, [survey.id]: { ...prev[survey.id], [sliderKey]: parseInt((e.target as HTMLInputElement).value, 10) } }))}
                                  style={{ flex: 1, accentColor: C.pink, cursor: "pointer" }} />
                                <div style={{ minWidth: 44, textAlign: "center", padding: "3px 10px", borderRadius: 6, background: C.pink, color: "#fff", fontSize: 12, fontWeight: 700 }}>{v}</div>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {q.type === "tags" && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                          {(q.tags || []).map((tag: string, ti: number) => {
                            const tagsKey = `tags_${qi}`;
                            const cur: string[] = empNpsAnswers[survey.id]?.[tagsKey] || [];
                            const selected = cur.includes(tag);
                            return (
                              <button key={ti} onClick={() => {
                                const next = selected ? cur.filter(x => x !== tag) : [...cur, tag];
                                setEmpNpsAnswers(prev => ({ ...prev, [survey.id]: { ...prev[survey.id], [tagsKey]: next } }));
                              }} style={{ padding: "7px 16px", borderRadius: 16, fontSize: 13, fontWeight: selected ? 600 : 400, border: `1px solid ${selected ? C.pink : C.border}`, background: selected ? C.pinkBg : C.white, color: selected ? C.pink : C.textLight, cursor: "pointer", fontFamily: font, transition: "all .15s" }}>
                                {tag}
                              </button>
                            );
                          })}
                        </div>
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
                      // Build payload from collected answers
                      const npsScore = answers.nps ?? null;
                      const ratingVal = Object.entries(answers).find(([k]) => k.startsWith("rating_"))?.[1] as number | undefined;
                      const comment = Object.entries(answers).find(([k]) => k.startsWith("text_"))?.[1] as string | undefined;
                      const allAnswers: Record<string, any> = {};
                      Object.entries(answers).forEach(([k, v]) => { if (k !== "nps" && k !== "submitted") allAnswers[k] = v; });

                      if (token) {
                        // Real submission via token endpoint
                        await submitNpsResponse(token, { score: npsScore, rating: ratingVal ?? null, answers: allAnswers, comment: comment || "" });
                      } else {
                        // Fallback: no token available
                        await apiFetch(`/nps-surveys/${survey.id}/send`, { method: "POST", body: JSON.stringify({ collaborateur_id: 0 }) }).catch(() => {});
                      }
                      addToast_admin(t('emp.nps_thanks_toast'));
                      setEmpNpsAnswers(prev => ({ ...prev, [survey.id]: { ...answers, submitted: true } }));
                      // Reload surveys to reflect completed status, then return to the tile grid
                      getMyNpsSurveys().then(setEmpSurveys).catch(() => {});
                      setOpenSurveyId(null);
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

          </>)}

        </div>
      )}
      {dashPage === "suivi" && (() => {
        const _myCollab = myCollabProfile || COLLABORATEURS.find((c: any) => c.email === auth.user?.email);
        const _myParcours = _myCollab ? PARCOURS_TEMPLATES.find((p: any) => p.id === _myCollab.parcours_id) : null;
        const _myParcoursName = (_myCollab as any)?.parcours_nom || _myParcours?.nom || "Onboarding Standard";
        const _myProfileActions = (_myCollab as any)?.parcours_actions || [];
        // Gate actions by assignation target so an onboardee doesn't see actions owned by
        // another team (e.g. checklist_it assigned to the "Équipe IT" group). Permissive on
        // missing data: if we cannot resolve membership, the action is shown rather than hidden.
        const _myFullName = `${(_myCollab as any)?.prenom || ""} ${(_myCollab as any)?.nom || ""}`.trim();
        const _isTargeted = (a: any): boolean => {
          const mode = a.assignation?.mode || a.assignation_mode;
          const valeurs: string[] = a.assignation?.valeurs || a.assignation_valeurs || [];
          if (!mode || mode === "tous") return true;
          if (mode === "site") return !_myCollab?.site || valeurs.includes((_myCollab as any).site);
          if (mode === "contrat") return !(_myCollab as any)?.type_contrat || valeurs.includes((_myCollab as any).type_contrat);
          if (mode === "parcours") return valeurs.includes(_myParcoursName);
          if (mode === "groupe") {
            if (!GROUPES || GROUPES.length === 0 || !_myFullName) return true;
            return valeurs.some((gn: string) => {
              const g = (GROUPES as any[]).find(x => x.nom === gn);
              return !!g && (g.membres || []).includes(_myFullName);
            });
          }
          return true;
        };
        const _myActionTpls = (_myProfileActions.length > 0 ? _myProfileActions : ACTION_TEMPLATES.filter((a: any) => a.parcours === _myParcoursName))
          .filter(_isTargeted);
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

          {/* View toggle: Chronologique vs Phases */}
          <div style={{ display: "flex", gap: 0, background: C.bg, borderRadius: 10, padding: 3, marginBottom: 20, maxWidth: 460 }}>
            {[
              { key: "chrono" as const, label: "Chronologique 100j", icon: CalendarClock },
              { key: "phases" as const, label: "Par phases", icon: Target },
            ].map(v => {
              const active = suiviView === v.key;
              const Icon = v.icon;
              return (
                <button key={v.key} onClick={() => setSuiviView(v.key)} style={{
                  flex: 1, padding: "10px 16px", borderRadius: 8, fontSize: 13, fontWeight: active ? 600 : 400,
                  background: active ? C.white : "transparent", color: active ? C.pink : C.textMuted,
                  border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  boxShadow: active ? "0 1px 4px rgba(0,0,0,.06)" : "none", fontFamily: font, transition: "all .15s",
                }}>
                  <Icon size={14} /> {v.label}
                </button>
              );
            })}
          </div>

          {/* CHRONOLOGIQUE 100J VIEW */}
          {suiviView === "chrono" && (() => {
            const dateDebutStr = (_myCollab as any)?.dateDebut || (_myCollab as any)?.date_debut || "";
            const startDate = dateDebutStr ? (() => {
              const parts = dateDebutStr.includes("/") ? dateDebutStr.split("/") : dateDebutStr.split("-");
              if (parts.length === 3) {
                const [a, b, c] = parts.map((p: string) => parseInt(p, 10));
                return dateDebutStr.includes("/") ? new Date(c, b - 1, a) : new Date(a, b - 1, c);
              }
              return new Date();
            })() : new Date();
            const today = new Date();
            const dayJ = journeyData?.day_j || Math.max(1, Math.min(120, Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1));
            const completedRatio = _myActions.length > 0 ? (completedActions.size / _myActions.length) : 0;
            // Read milestones from API only — no hardcoded fallback
            const ICON_MAP: Record<string, any> = { rocket: Rocket, sparkles: Sparkles, award: Award, star: Star, trophy: Trophy, heart: Heart, gem: Gem, crown: Crown, mail: Mail, "arrow-right": ArrowRight };
            const apiMilestones = journeyData?.milestones && journeyData.milestones.length > 0 ? journeyData.milestones : [];
            const milestones = apiMilestones.map((m: any) => ({
              day: m.day,
              label: `J+${m.day}`,
              title: m.label,
              icon: ICON_MAP[m.icon] || Trophy,
              badge: m.badge_name,
              badgeColor: m.badge_color || "#E91E8C",
              desc: m.description || "",
            }));
            return (
              <>
                {/* Vertical chrono timeline — hidden when no milestones configured */}
                {milestones.length > 0 && (
                <div className="iz-card iz-fade-up iz-stagger-1" style={{ ...sCard, marginBottom: 20, padding: "24px 28px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                    <div>
                      <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0, color: C.text }}>Votre voyage des 100 jours</h3>
                      <div style={{ fontSize: 12, color: C.textMuted, marginTop: 4 }}>Vous êtes au <b style={{ color: C.pink }}>jour {dayJ}</b> de votre intégration</div>
                    </div>
                    <div style={{ padding: "6px 14px", borderRadius: 14, background: C.pinkBg, color: C.pink, fontSize: 12, fontWeight: 700 }}>
                      {milestones.filter(m => dayJ >= m.day).length} / {milestones.length} étapes franchies
                    </div>
                  </div>
                  <div style={{ position: "relative", paddingLeft: 60 }}>
                    <div style={{ position: "absolute", left: 50, top: 18, bottom: 18, width: 3, background: `linear-gradient(180deg, ${C.green} 0%, ${C.pink} ${Math.min(100, dayJ)}%, ${C.border} ${Math.min(100, dayJ)}%)`, borderRadius: 2 }} />
                    {milestones.map((m, mi) => {
                      const reached = dayJ >= m.day;
                      const current = mi === milestones.findIndex(x => dayJ < x.day) - 1 || (mi === milestones.length - 1 && dayJ >= 100);
                      const Icon = m.icon;
                      return (
                        <div key={m.day} style={{ display: "flex", alignItems: "flex-start", marginBottom: mi < milestones.length - 1 ? 22 : 0, position: "relative" }}>
                          <div style={{ position: "absolute", left: -60, top: 0, width: 50, textAlign: "center" }}>
                            <div style={{ width: 44, height: 44, borderRadius: "50%", background: reached ? m.badgeColor : C.white, border: `3px solid ${reached ? m.badgeColor : C.border}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto", boxShadow: current ? `0 0 0 6px ${m.badgeColor}33` : "none", transition: "all .3s" }}>
                              <Icon size={18} color={reached ? "#fff" : C.textMuted} />
                            </div>
                            <div style={{ fontSize: 10, fontWeight: 700, color: reached ? m.badgeColor : C.textMuted, marginTop: 4, letterSpacing: .5 }}>{m.label}</div>
                          </div>
                          <div style={{ flex: 1, paddingLeft: 18, paddingTop: 2 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                              <h4 style={{ fontSize: 14, fontWeight: 600, margin: 0, color: reached ? C.text : C.textMuted }}>{m.title}</h4>
                              <span style={{ padding: "2px 10px", borderRadius: 10, fontSize: 10, fontWeight: 700, background: reached ? m.badgeColor + "1F" : C.bg, color: reached ? m.badgeColor : C.textMuted, letterSpacing: .3 }}>
                                🏆 {m.badge}
                              </span>
                              {current && <span style={{ padding: "2px 8px", borderRadius: 8, fontSize: 9, fontWeight: 700, background: C.pink, color: "#fff", letterSpacing: .5 }}>EN COURS</span>}
                              {reached && !current && <CheckCircle size={14} color={C.green} />}
                            </div>
                            <div style={{ fontSize: 12, color: C.textLight, lineHeight: 1.5 }}>{m.desc}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                )}

                {/* Quiz culture card */}
                {(() => {
                  const _quizState = cultureQuizState;
                  const setQuizState = (s: any) => setCultureQuizState(s);
                  const quizBlock = (companyBlocks || []).find((b: any) => b.type === "culture_quiz" && b.actif);
                  const QUIZ_FALLBACK = [
                    { q: "Notre raison d'être tient en une phrase. Laquelle ?", options: ["Maximiser le profit", "Faire grandir les hommes pour faire grandir l'industrie", "Dominer notre marché", "Innover à tout prix"], correct: 1, explain: "C'est exactement notre boussole. Cette phrase guide chaque décision stratégique." },
                    { q: "Quelle valeur place-t-on en premier dans nos prises de décision ?", options: ["Vitesse", "Bienveillance", "Qualité", "Profit"], correct: 1, explain: "La bienveillance est notre socle relationnel et opérationnel." },
                    { q: "Quel rituel d'équipe est sacré chez nous ?", options: ["Le café du lundi 9h", "Le all-hands mensuel", "Le retro vendredi", "Tout cela"], correct: 3, explain: "Tous nos rituels comptent — ils tissent la culture au quotidien." },
                    { q: "Que signifie être 'Illizéen' au quotidien ?", options: ["Suivre les process à la lettre", "Oser, partager, transmettre", "Travailler seul efficacement", "Maximiser ses KPIs"], correct: 1, explain: "Trois verbes simples qui résument notre ADN." },
                    { q: "Combien de jours dure votre parcours d'intégration ?", options: ["30 jours", "60 jours", "100 jours", "Une année"], correct: 2, explain: "100 jours pour vous accompagner pas à pas, jusqu'à votre pleine autonomie." },
                  ];
                  const QUIZ = (quizBlock?.data?.questions && quizBlock.data.questions.length > 0) ? quizBlock.data.questions : QUIZ_FALLBACK;
                  const QUIZ_XP = quizBlock?.data?.xp_per_correct ?? 10;
                  const QUIZ_CATEGORY = quizBlock?.data?.category || "Notre raison d'être";
                  const QUIZ_TITLE = quizBlock?.titre || "Quiz découverte du groupe";
                  if (QUIZ.length === 0) return null;
                  const correctCount = Object.entries(_quizState.answers).filter(([qi, ans]) => QUIZ[parseInt(qi, 10)]?.correct === ans).length;
                  // XP awarded only on a perfect score
                  const PERFECT_BONUS_XP = QUIZ_XP * QUIZ.length;
                  const totalXP = correctCount === QUIZ.length ? PERFECT_BONUS_XP : 0;
                  if (_quizState.finished) {
                    const isPerfect = correctCount === QUIZ.length;
                    const CONFETTI_COLORS = ["#E91E8C", "#1A73E8", "#4CAF50", "#F9A825", "#9C27B0", "#FF5722", "#00BCD4"];
                    return (
                      <div className="iz-card iz-fade-up iz-stagger-2" style={{ ...sCard, marginBottom: 20, padding: "32px 28px", background: `linear-gradient(135deg, ${C.pinkBg} 0%, #F3E5F5 100%)`, textAlign: "center", position: "relative", overflow: "hidden" }}>
                        {isPerfect && (
                          <>
                            <div aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
                              {Array.from({ length: 70 }).map((_, ci) => {
                                const left = Math.random() * 100;
                                const delay = Math.random() * 2.5;
                                const duration = 2.8 + Math.random() * 2.5;
                                const color = CONFETTI_COLORS[ci % CONFETTI_COLORS.length];
                                const size = 6 + Math.random() * 7;
                                const rot = Math.random() * 360;
                                return (
                                  <span key={ci} className="iz-confetti-piece" style={{
                                    position: "absolute", top: "-24px", left: `${left}%`,
                                    width: size, height: size * 1.6, background: color, borderRadius: 2,
                                    animation: `iz-confetti-fall ${duration}s linear ${delay}s forwards`,
                                    transform: `rotate(${rot}deg)`,
                                  }} />
                                );
                              })}
                            </div>
                            <style>{`@keyframes iz-confetti-fall { 0% { transform: translateY(-30px) rotate(0deg); opacity: 1; } 100% { transform: translateY(420px) rotate(720deg); opacity: 0.3; } }`}</style>
                          </>
                        )}
                        <Trophy size={48} color={isPerfect ? "#F9A825" : C.pink} style={{ marginBottom: 12, position: "relative" }} />
                        <h3 style={{ fontSize: 18, fontWeight: 700, color: C.text, margin: "0 0 6px", position: "relative" }}>
                          {isPerfect ? "Sans-faute, bravo ! 🎉" : "Quiz culture terminé !"}
                        </h3>
                        <p style={{ fontSize: 13, color: C.textLight, margin: "0 0 16px", position: "relative" }}>
                          {isPerfect ? (
                            <>Score parfait : <b style={{ color: C.pink }}>{correctCount}/{QUIZ.length}</b> · <b style={{ color: C.pink }}>+{totalXP} XP</b></>
                          ) : (
                            <>{correctCount}/{QUIZ.length} bonnes réponses — visez le sans-faute pour gagner <b style={{ color: C.pink }}>+{PERFECT_BONUS_XP} XP</b></>
                          )}
                        </p>
                        {!isPerfect && (
                          <button onClick={() => setQuizState({ idx: 0, answers: {}, finished: false })} className="iz-btn-pink" style={{ ...sBtn("pink"), padding: "10px 24px", fontSize: 13, position: "relative" }}>Recommencer</button>
                        )}
                      </div>
                    );
                  }
                  const cur = QUIZ[_quizState.idx];
                  const userAns = _quizState.answers[_quizState.idx];
                  const answered = userAns !== undefined;
                  return (
                    <div className="iz-card iz-fade-up iz-stagger-2" style={{ ...sCard, marginBottom: 20, padding: "24px 28px" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <span style={{ padding: "3px 10px", borderRadius: 12, fontSize: 11, fontWeight: 700, background: C.pinkBg, color: C.pink, letterSpacing: .5 }}>{QUIZ_CATEGORY.toUpperCase()}</span>
                          <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0, color: C.text }}>{QUIZ_TITLE}</h3>
                        </div>
                        <div style={{ fontSize: 12, color: C.textMuted, fontWeight: 600 }}>Question {_quizState.idx + 1} / {QUIZ.length}</div>
                      </div>
                      <div style={{ height: 4, background: C.bg, borderRadius: 2, overflow: "hidden", marginBottom: 18 }}>
                        <div style={{ height: "100%", width: `${((_quizState.idx + (answered ? 1 : 0)) / QUIZ.length) * 100}%`, background: `linear-gradient(90deg, ${C.pink}, #9C27B0)`, transition: "width .3s" }} />
                      </div>
                      <div style={{ fontSize: 16, fontWeight: 600, color: C.text, marginBottom: 16 }}>{cur.q}</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
                        {cur.options.map((opt, oi) => {
                          const selected = userAns === oi;
                          const isCorrect = answered && oi === cur.correct;
                          const isWrongSelected = answered && selected && oi !== cur.correct;
                          const letter = String.fromCharCode(65 + oi);
                          return (
                            <button key={oi} onClick={() => { if (!answered) setQuizState({ ..._quizState, answers: { ..._quizState.answers, [_quizState.idx]: oi } }); }}
                              disabled={answered}
                              style={{
                                display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", borderRadius: 10,
                                border: `2px solid ${isCorrect ? C.green : isWrongSelected ? C.red : selected ? C.pink : C.border}`,
                                background: isCorrect ? C.greenLight : isWrongSelected ? C.redLight : selected ? C.pinkBg : C.white,
                                cursor: answered ? "default" : "pointer", textAlign: "left", fontFamily: font, fontSize: 14, color: C.text,
                                transition: "all .15s",
                              }}>
                              <div style={{ width: 28, height: 28, borderRadius: "50%", background: isCorrect ? C.green : isWrongSelected ? C.red : C.bg, color: isCorrect || isWrongSelected ? "#fff" : C.textMuted, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                                {letter}
                              </div>
                              <span style={{ flex: 1 }}>{opt}</span>
                              {isCorrect && <Check size={18} color={C.green} />}
                              {isWrongSelected && <X size={18} color={C.red} />}
                            </button>
                          );
                        })}
                      </div>
                      {answered && (
                        <div style={{ padding: "12px 16px", borderRadius: 10, background: userAns === cur.correct ? C.greenLight : C.amberLight, marginBottom: 16 }}>
                          <div style={{ fontSize: 13, color: C.text }}>
                            <b style={{ color: userAns === cur.correct ? C.green : C.amber }}>{userAns === cur.correct ? "Bravo !" : "Pas tout à fait..."}</b> {cur.explain}
                          </div>
                        </div>
                      )}
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <button onClick={() => { if (_quizState.idx > 0) setQuizState({ ..._quizState, idx: _quizState.idx - 1 }); }}
                          disabled={_quizState.idx === 0}
                          style={{ ...sBtn("outline"), padding: "8px 18px", fontSize: 12, opacity: _quizState.idx === 0 ? 0.4 : 1 }}>← Précédent</button>
                        <div style={{ fontSize: 12, color: C.textMuted }}>+{PERFECT_BONUS_XP} XP au sans-faute · {correctCount}/{QUIZ.length} bonnes réponses</div>
                        <button onClick={() => {
                          if (_quizState.idx === QUIZ.length - 1) {
                            setQuizState({ ..._quizState, finished: true });
                            // Persist quiz completion — only award XP on a perfect score
                            const isPerfect = correctCount === QUIZ.length;
                            import('./api/endpoints').then(async m => {
                              try {
                                await (m as any).submitQuizCompletion?.({
                                  block_id: quizBlock?.id ?? null,
                                  correct: correctCount,
                                  total: QUIZ.length,
                                  xp_per_correct: isPerfect ? QUIZ_XP : 0,
                                  answers: _quizState.answers,
                                });
                                const lb = await (m as any).getMyLeaderboard?.();
                                if (lb) setLeaderboardData(lb);
                              } catch {}
                            });
                          } else setQuizState({ ..._quizState, idx: _quizState.idx + 1 });
                        }} disabled={!answered} className="iz-btn-pink" style={{ ...sBtn("pink"), padding: "8px 22px", fontSize: 13, opacity: answered ? 1 : 0.4 }}>
                          {_quizState.idx === QUIZ.length - 1 ? "Terminer →" : "Question suivante →"}
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </>
            );
          })()}

          {/* Phases with actions inside */}
          {suiviView === "phases" && (
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
              // Phase activation is action-driven, NOT date-driven: a phase only becomes
              // "En cours" once every action of every previous phase is done. Reaching J+0
              // / J+1 / J+8 does NOT auto-activate "Premier jour" / "Première semaine" /
              // "3 premiers mois" — the employee must finish prerequisite actions first.
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
          )}

          {/* Documents status — only show actual pieces required by parcours actions */}
          {(() => {
            // Build the real list of pieces required by the user's parcours
            const requiredPieces: string[] = [];
            const seen = new Set<string>();
            for (const cat of getLiveDocCategories()) {
              for (const p of cat.docs as string[]) {
                if (!seen.has(p)) { seen.add(p); requiredPieces.push(p); }
              }
            }
            if (requiredPieces.length === 0) return null;
            return (
              <div className="iz-card iz-fade-up iz-stagger-2" style={{ ...sCard, marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>{t('emp.my_documents')}</h3>
                  <button onClick={() => setShowDocPanel("admin")} className="iz-btn-outline" style={{ ...sBtn("outline"), padding: "4px 14px", fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}><FileText size={14} /> {t('emp.see_all')}</button>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
                  {requiredPieces.slice(0, 6).map((nom, i) => {
                    const status = (employeeDocs[nom] || employeeDocs[`${nom} *`] || "manquant") as DocStatus;
                    return (
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
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {/* Équipe & contacts — only render with real accompagnants */}
          {(_myCollab as any)?.accompagnants?.length > 0 && (
          <div className="iz-card iz-fade-up iz-stagger-3" style={{ ...sCard, marginBottom: 20 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, margin: "0 0 12px" }}>{t('emp.my_team')}</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
              {(_myCollab as any).accompagnants.map((a: any) => {
                const ROLE_LABELS: Record<string, string> = { hrbp: "HRBP", manager: "Manager", buddy: "Buddy / Parrain", it: "IT Support", admin_rh: "Admin RH" };
                const ROLE_COLORS: Record<string, string> = { hrbp: "#7B5EA7", manager: "#1A73E8", buddy: "#4CAF50", it: "#F9A825", admin_rh: "#E41076" };
                const initials = (a.name || "").split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();
                return { name: a.name, role: ROLE_LABELS[a.role] || a.role, initials, color: ROLE_COLORS[a.role] || "#888" };
              }).map((m: any, i: number) => (
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
          )}

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
      {/* MES RDV PAGE */}
      {dashPage === "mes_rdv" && (
        <EmployeeMyRdvPage
          C={C}
          sCard={sCard}
          sBtn={sBtn}
          font={font}
          myCollab={myCollabProfile || COLLABORATEURS.find((c: any) => c.email === auth.user?.email)}
          actionTemplates={ACTION_TEMPLATES}
        />
      )}

      {/* MES SIGNATURES (formerly Documents) — pending + history merged */}
      {(dashPage === "mes_signatures" || dashPage === "documents") && (() => {
        // History endpoint returns ALL completed acks across all versions (audit trail).
        const completed = (employeeSignatureHistory || [])
          .slice()
          .sort((a: any, b: any) => {
            const da = a.signed_at ? new Date(a.signed_at).getTime() : 0;
            const db = b.signed_at ? new Date(b.signed_at).getTime() : 0;
            return db - da;
          });
        const pending = (employeeSignatureDocs || []).filter((d: any) => d.status === "à signer" || d.status === "à lire" || d.status === "à compléter");
        const allDocs = employeeSignatureDocs || [];
        const kpiUrgents = allDocs.filter((d: any) => d.urgent).length;
        const kpiASigner = allDocs.filter((d: any) => d.status === "à signer").length;
        const kpiACompleter = allDocs.filter((d: any) => d.status === "à compléter").length;
        const kpiValides = allDocs.filter((d: any) => d.status === "signé" || d.status === "lu").length;
        const openSignedDoc = async (docId: number, inline: boolean) => {
          const apiBase = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8001/api/v1';
          const tenantId = localStorage.getItem('illizeo_tenant_id') || (import.meta as any).env?.VITE_TENANT_ID || 'illizeo';
          const token = localStorage.getItem('illizeo_token') || '';
          try {
            const res = await fetch(`${apiBase}/signature-documents/${docId}/file${inline ? '?inline=1' : ''}`, {
              headers: { Authorization: `Bearer ${token}`, 'X-Tenant': tenantId },
            });
            if (!res.ok) {
              addToast(res.status === 404 ? "Le PDF n'est plus disponible" : `Erreur ${res.status}`, 'error');
              return;
            }
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            if (inline) {
              window.open(url, '_blank', 'noopener,noreferrer');
            } else {
              const a = document.createElement('a');
              a.href = url; a.download = `document-${docId}.pdf`;
              document.body.appendChild(a); a.click(); a.remove();
            }
            setTimeout(() => URL.revokeObjectURL(url), 60000);
          } catch {
            addToast("Impossible d'ouvrir le document", 'error');
          }
        };
        return (
          <div style={{ flex: 1, padding: "32px 40px", overflow: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 4 }}>{kpiASigner} à signer · {kpiACompleter} à compléter · {kpiValides} signés</div>
                <h1 style={{ fontSize: 24, fontWeight: 700, color: C.pink, margin: 0 }}>Mes signatures</h1>
                <p style={{ fontSize: 13, color: C.textLight, marginTop: 8, maxWidth: 720, lineHeight: 1.5 }}>
                  Historique chronologique de tous les documents que vous avez signés ou lus. Chaque enregistrement comporte la date et l'horodatage à valeur de preuve (RGPD, conformité interne).
                </p>
              </div>
              {pending.length > 0 && <button className="iz-btn-pink" style={{ ...sBtn("pink"), padding: "10px 20px", fontSize: 13 }}>Tout signer (signature électronique)</button>}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
              {[
                { label: "URGENTS", value: kpiUrgents, color: C.red },
                { label: "À SIGNER", value: kpiASigner, color: C.pink },
                { label: "À COMPLÉTER", value: kpiACompleter, color: C.amber },
                { label: "VALIDÉS", value: kpiValides, color: C.green },
              ].map(k => (
                <div key={k.label} className="iz-card" style={{ ...sCard, padding: "16px 18px" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: C.textMuted, letterSpacing: 1 }}>{k.label}</div>
                  <div style={{ fontSize: 32, fontWeight: 700, color: k.color, marginTop: 4 }}>{k.value}</div>
                </div>
              ))}
            </div>

            {pending.length > 0 && (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <Clock size={16} color={C.amber} />
                  <h2 style={{ fontSize: 14, fontWeight: 700, color: C.text, margin: 0, textTransform: "uppercase", letterSpacing: 1 }}>En attente de votre action ({pending.length})</h2>
                </div>
                <div className="iz-card" style={{ ...sCard, padding: 0, overflow: "hidden", marginBottom: 24, border: `1px solid ${C.amber}` }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 110px 110px 240px", padding: "12px 20px", borderBottom: `1px solid ${C.border}`, fontSize: 10, fontWeight: 700, color: C.textMuted, letterSpacing: 1, background: C.amberLight }}>
                    <div>DOCUMENT</div>
                    <div>TYPE</div>
                    <div>STATUT</div>
                    <div></div>
                  </div>
                  {pending.map((d: any, i: number) => {
                    const isLecture = d.type === "lecture" || d.status === "à lire";
                    const statusLabel = d.status === "à signer" ? "À signer" : d.status === "à lire" ? "À lire" : "À compléter";
                    return (
                      <div key={d.id || i} style={{ display: "grid", gridTemplateColumns: "1fr 110px 110px 240px", padding: "14px 20px", alignItems: "center", borderBottom: i < pending.length - 1 ? `1px solid ${C.border}` : "none", background: i % 2 === 0 ? C.white : C.bg }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <div style={{ width: 32, height: 32, borderRadius: 6, background: isLecture ? C.blueLight : C.pinkBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            {isLecture ? <BookOpen size={16} color={C.blue} /> : <PenTool size={16} color={C.pink} />}
                          </div>
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{d.name}</div>
                            {d.urgent && <div style={{ fontSize: 10, fontWeight: 700, color: C.red, marginTop: 2 }}>⚠ URGENT</div>}
                            {d.description && <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>{d.description.length > 80 ? d.description.substring(0, 80) + "…" : d.description}</div>}
                          </div>
                        </div>
                        <div>
                          <span style={{ padding: "3px 10px", borderRadius: 10, fontSize: 11, fontWeight: 600, background: isLecture ? C.blueLight : C.pinkBg, color: isLecture ? C.blue : C.pink }}>
                            {isLecture ? "Lecture" : "Signature"}
                          </span>
                        </div>
                        <div>
                          <span style={{ padding: "3px 10px", borderRadius: 10, fontSize: 11, fontWeight: 600, background: C.amberLight, color: C.amber }}>{statusLabel}</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 6 }}>
                          <button onClick={() => openSignedDoc(d.id, true)} title="Lire le document" style={{ ...sBtn("outline"), padding: "5px 10px", fontSize: 11, display: "flex", alignItems: "center", gap: 4 }}>
                            <BookOpen size={12} /> Lire
                          </button>
                          <button onClick={() => openSignedDoc(d.id, false)} title="Télécharger le document" style={{ background: "none", border: `1px solid ${C.border}`, borderRadius: 6, padding: 5, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Download size={12} color={C.textMuted} />
                          </button>
                          <button onClick={() => setDashPage("mes_actions")} className="iz-btn-pink" style={{ ...sBtn("pink"), padding: "6px 14px", fontSize: 11 }}>{isLecture ? "Confirmer" : "Signer"}</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <CheckCircle size={16} color={C.green} />
                  <h2 style={{ fontSize: 14, fontWeight: 700, color: C.text, margin: 0, textTransform: "uppercase", letterSpacing: 1 }}>Historique ({completed.length})</h2>
                </div>
              </>
            )}

            <div className="iz-card" style={{ ...sCard, padding: 0, overflow: "hidden" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 140px 200px 160px", padding: "12px 20px", borderBottom: `1px solid ${C.border}`, fontSize: 10, fontWeight: 700, color: C.textMuted, letterSpacing: 1 }}>
                <div>DOCUMENT</div>
                <div>TYPE</div>
                <div>SIGNÉ LE</div>
                <div></div>
              </div>
              {completed.length === 0 ? (
                <div style={{ padding: "60px 20px", textAlign: "center", color: C.textMuted }}>
                  <FileSignature size={32} color={C.textMuted} style={{ marginBottom: 12, opacity: .5 }} />
                  <div style={{ fontSize: 14, fontWeight: 500, color: C.text, marginBottom: 4 }}>Aucune signature pour le moment</div>
                  <div style={{ fontSize: 12 }}>Vos documents signés apparaîtront ici dès que vous aurez complété une action de signature ou de lecture.</div>
                </div>
              ) : completed.map((d: any, i: number) => {
                const isLecture = d.statut === "lu" || d.document_type === "lecture";
                const dateStr = d.signed_at ? new Date(d.signed_at).toLocaleString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : "—";
                const ver = d.signed_version || 1;
                const isOutdated = !!d.is_outdated;
                return (
                  <div key={d.ack_id || i} style={{ display: "grid", gridTemplateColumns: "1fr 140px 200px 160px", padding: "14px 20px", alignItems: "center", borderBottom: i < completed.length - 1 ? `1px solid ${C.border}` : "none", background: i % 2 === 0 ? C.white : C.bg, opacity: isOutdated ? 0.75 : 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 6, background: isOutdated ? C.bg : C.greenLight, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <CheckCircle size={16} color={isOutdated ? C.textMuted : C.green} />
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: C.text, display: "flex", alignItems: "center", gap: 6 }}>
                          {d.document_title}
                          <span style={{ padding: "1px 6px", borderRadius: 4, fontSize: 10, fontWeight: 700, background: C.bg, color: C.textMuted, border: `1px solid ${C.border}` }}>v{ver}</span>
                          {isOutdated && <span style={{ padding: "1px 6px", borderRadius: 4, fontSize: 10, fontWeight: 600, background: C.amberLight, color: C.amber }}>Version remplacée</span>}
                        </div>
                        {d.document_description && <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>{d.document_description.length > 80 ? d.document_description.substring(0, 80) + "…" : d.document_description}</div>}
                      </div>
                    </div>
                    <div>
                      <span style={{ padding: "3px 10px", borderRadius: 10, fontSize: 11, fontWeight: 600, background: isLecture ? C.blueLight : C.greenLight, color: isLecture ? C.blue : C.green }}>
                        {isLecture ? "Lecture confirmée" : "Signé"}
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: C.text }}>{dateStr}</div>
                    <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 6 }}>
                      <button onClick={() => openSignedDoc(d.document_id, true)} title="Ouvrir le document" style={{ ...sBtn("outline"), padding: "5px 10px", fontSize: 11, display: "flex", alignItems: "center", gap: 4 }}>
                        <BookOpen size={12} /> Voir
                      </button>
                      <button onClick={() => openSignedDoc(d.document_id, false)} title="Télécharger le document" style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
                        <Download size={14} color={C.textMuted} />
                      </button>
                      <span title={d.ip_address ? `Signé depuis ${d.ip_address}` : "Preuve horodatée disponible auprès de votre RH"} style={{ fontSize: 11, color: C.textMuted }}>✓</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}

      {/* FORMATIONS PAGE */}
      {dashPage === "formations" && (() => {
        const FORMATIONS = [
          { id: "sst", code: "SST", title: "Sécurité au travail (SST init.)", duration: "2h", deadline: "Avant J+15", color: C.red, status: "todo", obligatoire: true },
          { id: "inc", code: "INC", title: "Évacuation incendie", duration: "30 min", deadline: "Avant J+5", color: C.amber, status: "in_progress", obligatoire: true },
          { id: "rgpd", code: "RGPD", title: "RGPD essentiels", duration: "1h", deadline: "Avant J+30", color: C.blue, status: "todo", obligatoire: true },
          { id: "cyb", code: "CYB", title: "Cybersécurité — bonnes pratiques", duration: "45 min", deadline: "Avant J+30", color: "#9C27B0", status: "todo", obligatoire: true },
          { id: "eth", code: "ETH", title: "Éthique & anti-corruption", duration: "30 min", deadline: "Avant J+45", color: C.green, status: "todo", obligatoire: true },
          { id: "qse", code: "QSE", title: "Qualité Sécurité Environnement", duration: "1h30", deadline: "Avant J+60", color: C.pink, status: "todo", obligatoire: true },
        ];
        const validated = FORMATIONS.filter(f => f.status === "done").length;
        const totalH = FORMATIONS.reduce((acc, f) => acc + (f.duration.includes("h") ? parseFloat(f.duration) : parseFloat(f.duration) / 60), 0);
        const pct = Math.round((validated / FORMATIONS.length) * 100);
        const radius = 50, circ = 2 * Math.PI * radius;
        return (
          <div style={{ flex: 1, padding: "32px 40px", overflow: "auto" }}>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 4 }}>{FORMATIONS.length} modules · {totalH.toFixed(1)}h au total</div>
              <h1 style={{ fontSize: 24, fontWeight: 700, color: C.pink, margin: 0 }}>Mon parcours formation d'intégration</h1>
            </div>
            <div className="iz-card iz-fade-up" style={{ ...sCard, marginBottom: 20, padding: "24px 32px", background: `linear-gradient(135deg, ${C.pinkBg} 0%, #F3E5F5 100%)`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.pink, letterSpacing: 1, marginBottom: 6 }}>FORMATIONS OBLIGATOIRES</div>
                <h3 style={{ fontSize: 22, fontWeight: 700, color: C.text, margin: "0 0 6px" }}>{validated} module{validated > 1 ? 's' : ''} validé{validated > 1 ? 's' : ''} · {FORMATIONS.length - validated} à venir</h3>
                <div style={{ fontSize: 13, color: C.textLight }}>Toutes vos échéances sont respectées 👍 · Prochaine deadline : J+5 (Évacuation incendie)</div>
              </div>
              <div style={{ position: "relative", width: 110, height: 110 }}>
                <svg width={110} height={110} style={{ transform: "rotate(-90deg)" }}>
                  <circle cx={55} cy={55} r={radius} stroke={C.white} strokeWidth={8} fill="none" />
                  <circle cx={55} cy={55} r={radius} stroke={C.pink} strokeWidth={8} fill="none" strokeDasharray={circ} strokeDashoffset={circ - (pct / 100) * circ} strokeLinecap="round" />
                </svg>
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 700, color: C.pink }}>{pct}%</div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
              {FORMATIONS.map(f => (
                <div key={f.id} className="iz-card" style={{ ...sCard, padding: "16px 18px", display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 56, height: 56, borderRadius: 10, background: f.color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, flexShrink: 0 }}>{f.code}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{f.title}</div>
                      {f.obligatoire && <span style={{ padding: "2px 8px", borderRadius: 8, fontSize: 9, fontWeight: 700, background: C.pinkBg, color: C.pink }}>Obligatoire</span>}
                    </div>
                    <div style={{ fontSize: 11, color: C.textMuted }}>⏱ {f.duration} · 📅 {f.deadline}</div>
                  </div>
                  <button className="iz-btn-pink" style={{ ...sBtn("pink"), padding: "8px 18px", fontSize: 12 }}>{f.status === "in_progress" ? "Reprendre" : "Démarrer"}</button>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* BUREAUX PAGE */}
      {dashPage === "bureaux" && (() => {
        const tourBlock = (companyBlocks || []).find((b: any) => b.type === "office_tour" && b.actif);
        const data = tourBlock?.data || {};
        const ROOMS_FALLBACK = [
          { id: "openspace", title: "Open-space RSE", subtitle: "✓ Votre poste · 4.12", span: 1 },
          { id: "atrium", title: "Salle Atrium", subtitle: "✓ Petit-déj équipe", span: 1 },
          { id: "cafet", title: "Cafét' du 4e", subtitle: "● Prochain stop", span: 1 },
          { id: "vision", title: "Salle Vision", subtitle: "RDV avec DG (J+13)", span: 1 },
          { id: "phone", title: "Phone box", subtitle: "×4", span: 1 },
          { id: "babyfoot", title: "Détente", subtitle: "Babyfoot 🎮", span: 1 },
          { id: "directionrh", title: "Direction & RH", subtitle: "Marie · Hélène", span: 2 },
          { id: "brainstorm", title: "Salle Brainstorm", subtitle: "16 places", span: 1 },
        ];
        const ROOMS = ((data.rooms && data.rooms.length > 0) ? data.rooms : ROOMS_FALLBACK).map((r: any, i: number) => ({
          id: r.id || `room_${i}`, title: r.title, subtitle: r.subtitle || "", span: r.span || 1,
        }));
        const SITE = data.site || "Siège Paris";
        const ETAGE = data.etage || "Étage 4";
        const TREASURE_TITLE = data.treasure_title || "Trouvez la mascotte !";
        const TREASURE_DESC = data.treasure_desc || "Une peluche cachée à chaque étage. Photo + #welcome = mug collector.";

        const STORAGE_KEY = `illizeo_office_tour_${tourBlock?.id || "default"}`;
        const _tour = officeTourState || (() => {
          try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) return JSON.parse(raw);
          } catch {}
          return { visited: [] as string[], current: ROOMS[0]?.id, treasure: false };
        })();
        const persist = (s: any) => {
          try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch {}
          setOfficeTourState(s);
        };
        const visit = (id: string) => {
          const v = _tour.visited.includes(id) ? _tour.visited : [..._tour.visited, id];
          persist({ ..._tour, visited: v, current: id });
          if (v.length === ROOMS.length && !_tour.allDone) {
            persist({ ..._tour, visited: v, current: id, allDone: true });
            addToast(`🎉 Tour terminé ! ${ROOMS.length} lieux découverts.`, "success");
          }
        };
        const reset = () => persist({ visited: [], current: ROOMS[0]?.id, treasure: false });
        const toggleTreasure = () => persist({ ..._tour, treasure: !_tour.treasure });
        const colorFor = (rid: string) => {
          if (_tour.visited.includes(rid)) return { bg: C.greenLight, border: C.green };
          if (_tour.current === rid) return { bg: C.pinkBg, border: C.pink };
          return { bg: C.white, border: C.border };
        };
        if (ROOMS.length === 0) return (
          <div style={{ flex: 1, padding: "32px 40px" }}>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: C.pink, margin: "0 0 12px" }}>Tour des bureaux</h1>
            <div className="iz-card" style={{ ...sCard, padding: 32, textAlign: "center", color: C.textMuted }}>Aucun lieu configuré. Demandez à votre admin RH d'activer un bloc "Tour des bureaux" depuis la page Entreprise.</div>
          </div>
        );
        // Hidden mascot location: stable hash of tourBlock id → one of the rooms
        const mascotIdx = (() => {
          const seed = String(tourBlock?.id || "default").split("").reduce((a, c) => a + c.charCodeAt(0), 0);
          return seed % ROOMS.length;
        })();
        const mascotRoomId = ROOMS[mascotIdx]?.id;
        const mascotFound = _tour.foundMascot;
        return (
          <div style={{ flex: 1, padding: "32px 40px", overflow: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 4 }}>{SITE} · {ETAGE}</div>
                <h1 style={{ fontSize: 24, fontWeight: 700, color: C.pink, margin: 0 }}>{tourBlock?.titre || "Tour des bureaux"}</h1>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {_tour.visited.length > 0 && <button onClick={reset} style={{ ...sBtn("outline"), padding: "10px 16px", fontSize: 12 }}>↻ Réinitialiser</button>}
                <button onClick={toggleTreasure} className={_tour.treasure ? "" : "iz-btn-pink"} style={{ ...(_tour.treasure ? sBtn("outline") : sBtn("pink")), padding: "10px 20px", fontSize: 13, ...(_tour.treasure ? { borderColor: C.pink, color: C.pink, background: C.pinkBg } : {}) }}>
                  {_tour.treasure ? "✓ Mode chasse activé" : "Mode chasse au trésor 🐾"}
                </button>
              </div>
            </div>
            {_tour.treasure && (
              <div style={{ marginBottom: 16, padding: "14px 18px", background: `linear-gradient(135deg, ${C.pinkBg}, #FFF7CC)`, borderRadius: 12, border: `2px dashed ${C.pink}`, display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ fontSize: 28 }}>🐾</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.pink }}>Mode chasse au trésor activé</div>
                  <div style={{ fontSize: 11, color: C.text, marginTop: 2 }}>
                    {mascotFound
                      ? `🎉 Bravo ! Vous avez trouvé la mascotte dans ${ROOMS.find((r:any) => r.id === mascotRoomId)?.title} !`
                      : "Une peluche est cachée dans l'un des lieux. Cliquez sur les salles pour la trouver !"}
                  </div>
                </div>
                {!mascotFound && <div style={{ fontSize: 11, fontWeight: 700, color: C.pink, padding: "4px 10px", background: C.white, borderRadius: 10 }}>{_tour.visited.length} / {ROOMS.length} explorés</div>}
              </div>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20 }}>
              <div className="iz-card" style={{ ...sCard, padding: 20, background: "linear-gradient(180deg, #F8F9FB, #EEF2F7)" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, letterSpacing: 1, marginBottom: 12 }}>PLAN {ETAGE.toUpperCase()}</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                  {ROOMS.map((r: any) => {
                    const c = colorFor(r.id);
                    const isVisited = _tour.visited.includes(r.id);
                    const isCurrent = _tour.current === r.id;
                    const hasMascot = _tour.treasure && r.id === mascotRoomId && isVisited;
                    return (
                      <button key={r.id} onClick={() => {
                        visit(r.id);
                        if (_tour.treasure && r.id === mascotRoomId && !mascotFound) {
                          setTimeout(() => {
                            const v = _tour.visited.includes(r.id) ? _tour.visited : [..._tour.visited, r.id];
                            persist({ ..._tour, visited: v, current: r.id, foundMascot: true });
                            addToast(`🎉 Mascotte trouvée dans ${r.title} !`, "success");
                          }, 250);
                        }
                      }} style={{
                        background: c.bg, border: `2px solid ${c.border}`, borderRadius: 10, padding: "16px 14px", textAlign: "left", cursor: "pointer", fontFamily: font, transition: "all .15s",
                        gridColumn: `span ${Math.min(3, r.span || 1)}`,
                        minHeight: 90, position: "relative",
                      }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: isVisited ? C.green : isCurrent ? C.pink : C.text }}>{r.title}</div>
                        <div style={{ fontSize: 11, color: isVisited ? C.green : isCurrent ? C.pink : C.textMuted, marginTop: 4 }}>{r.subtitle}</div>
                        {hasMascot && <div style={{ position: "absolute", top: 6, right: 8, fontSize: 18 }}>🐾</div>}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div className="iz-card" style={{ ...sCard, padding: "16px 18px" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, letterSpacing: 1, marginBottom: 8 }}>ÉTAPES DU TOUR</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 10 }}>{_tour.visited.length} / {ROOMS.length} lieux découverts</div>
                  <div style={{ height: 4, background: C.bg, borderRadius: 2, marginBottom: 14 }}>
                    <div style={{ height: "100%", width: `${(_tour.visited.length / ROOMS.length) * 100}%`, background: `linear-gradient(90deg, ${C.green}, ${C.pink})`, borderRadius: 2, transition: "width .3s" }} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    {ROOMS.map((s: any) => {
                      const v = _tour.visited.includes(s.id);
                      const cur = _tour.current === s.id;
                      return (
                        <button key={s.id} onClick={() => visit(s.id)} style={{
                          display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 6,
                          border: "none", background: cur && !v ? C.pinkBg : "transparent", cursor: "pointer", fontFamily: font, textAlign: "left", width: "100%",
                          transition: "background .15s",
                        }}
                        onMouseEnter={e => { if (!v) e.currentTarget.style.background = C.bg; }}
                        onMouseLeave={e => { if (!v) e.currentTarget.style.background = cur ? C.pinkBg : "transparent"; }}>
                          {v ? (
                            <div style={{ width: 20, height: 20, borderRadius: "50%", background: C.green, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Check size={11} color="#fff" /></div>
                          ) : cur ? (
                            <div style={{ width: 20, height: 20, borderRadius: "50%", border: `2px solid ${C.pink}`, flexShrink: 0 }} />
                          ) : (
                            <div style={{ width: 20, height: 20, borderRadius: "50%", border: `2px solid ${C.border}`, flexShrink: 0 }} />
                          )}
                          <span style={{ fontSize: 13, fontWeight: cur ? 600 : 400, color: v ? C.green : cur ? C.pink : C.textLight }}>{s.title}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="iz-card" style={{ ...sCard, padding: "16px 18px", background: C.pinkBg }}>
                  <div style={{ fontSize: 32, marginBottom: 6 }}>🎁</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 4 }}>{TREASURE_TITLE}</div>
                  <div style={{ fontSize: 11, color: C.textLight, lineHeight: 1.5 }}>{TREASURE_DESC}</div>
                  {!_tour.treasure && (
                    <button onClick={toggleTreasure} className="iz-btn-pink" style={{ ...sBtn("pink"), marginTop: 10, padding: "6px 12px", fontSize: 11, width: "100%" }}>Activer le mode chasse 🐾</button>
                  )}
                </div>
              </div>
            </div>
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
      </div>
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
      {/* Team member detail modal */}
      {selectedTeamMember && (
        <div className="iz-overlay" onClick={() => setSelectedTeamMember(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1100 }}>
          <div className="iz-modal iz-scale-in" onClick={e => e.stopPropagation()} style={{ background: C.white, borderRadius: 16, width: 400, position: "relative", overflow: "hidden" }}>
            {/* Header with avatar */}
            <div style={{ background: `linear-gradient(135deg, ${selectedTeamMember.color}, ${selectedTeamMember.color}CC)`, padding: "32px 24px", textAlign: "center" }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(255,255,255,.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 700, color: "#fff", margin: "0 auto 12px", border: "3px solid rgba(255,255,255,.4)" }}>{selectedTeamMember.initials}</div>
              <div style={{ fontSize: 18, fontWeight: 600, color: "#fff" }}>{selectedTeamMember.name}</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,.8)", marginTop: 4 }}>{selectedTeamMember.role}</div>
            </div>
            <button onClick={() => setSelectedTeamMember(null)} style={{ position: "absolute", top: 12, right: 12, background: "rgba(255,255,255,.2)", border: "none", borderRadius: "50%", width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><X size={14} color="#fff" /></button>
            {/* Info */}
            <div style={{ padding: "20px 24px" }}>
              {selectedTeamMember.email && (
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <Mail size={15} color={C.textMuted} />
                  <span style={{ fontSize: 13, color: C.text }}>{selectedTeamMember.email}</span>
                </div>
              )}
              {selectedTeamMember.phone && (
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <Phone size={15} color={C.textMuted} />
                  <span style={{ fontSize: 13, color: C.text }}>{selectedTeamMember.phone}</span>
                </div>
              )}
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <Users size={15} color={C.textMuted} />
                <span style={{ fontSize: 13, color: C.text }}>{selectedTeamMember.role}</span>
              </div>
              {/* Action button */}
              <button onClick={async () => {
                const user = msgUsers.find((u: any) => u.name === selectedTeamMember.name);
                if (user) {
                  const existing = msgConversations.find((c: any) => c.other_user?.id === user.id);
                  if (existing) { setMsgActiveConvId(existing.id); }
                  else { try { const msg = await apiSendMessage(user.id, "👋"); await getConversations().then(setMsgConversations); setMsgActiveConvId(msg.conversation_id); } catch {} }
                }
                setSelectedTeamMember(null);
                setDashPage("messagerie");
              }} className="iz-btn-pink" style={{ ...sBtn("pink"), width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "10px 0", fontSize: 13 }}>
                <MessageCircle size={14} /> Envoyer un message
              </button>
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
            <div style={{ width: 120, height: 120, borderRadius: "50%", background: avatarImage ? "none" : "linear-gradient(135deg, #E91E8C, #E41076)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, fontWeight: 600, color: C.white, overflow: "hidden", border: `4px solid ${C.border}` }}>
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
          <input id="avatar-upload" type="file" accept="image/jpeg,image/png" style={{ display: "none" }} onChange={e => {
            const file = e.target.files?.[0];
            (e.target as HTMLInputElement).value = "";
            if (!file) return;
            // Resize/compress avatar to max 256x256 JPEG ~80% before upload (avoids
            // hitting MySQL TEXT/LONGTEXT body limits and keeps the data URL small).
            const reader = new FileReader();
            reader.onload = ev => {
              const dataUrl = ev.target?.result as string;
              const img = new Image();
              img.onload = () => {
                const MAX = 256;
                const ratio = Math.min(1, MAX / Math.max(img.width, img.height));
                const w = Math.round(img.width * ratio);
                const h = Math.round(img.height * ratio);
                const canvas = document.createElement("canvas");
                canvas.width = w; canvas.height = h;
                const cctx = canvas.getContext("2d");
                if (!cctx) { addToast("Erreur lors du traitement de l'image", "error"); return; }
                cctx.drawImage(img, 0, 0, w, h);
                const compressed = canvas.toDataURL("image/jpeg", 0.85);
                setAvatarImage(compressed); setAvatarZoom(100); setAvatarPos({ x: 50, y: 50 });
                localStorage.setItem("illizeo_avatar", compressed);
                if (auth.user?.id) {
                  saveMyAvatar(compressed)
                    .then(() => addToast("Photo enregistrée", "success"))
                    .catch((err: any) => { addToast("Échec de l'enregistrement de la photo : " + (err?.message || ""), "error"); });
                }
              };
              img.onerror = () => addToast("Image invalide", "error");
              img.src = dataUrl;
            };
            reader.readAsDataURL(file);
          }} />
          {avatarImage ? (
            <>
              {/* Zoom */}
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12, fontWeight: 500, color: C.textLight, display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                  <span>Zoom</span><span style={{ fontSize: 11, color: C.textMuted }}>{avatarZoom}%</span>
                </label>
                <input type="range" min={100} max={250} value={avatarZoom} onChange={e => setAvatarZoom(Number(e.target.value))} style={{ width: "100%", accentColor: C.pink }} />
              </div>
              {/* Position — only effective when zoomed in */}
              {avatarZoom > 100 ? (
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
              ) : (
                <div style={{ fontSize: 11, color: C.textMuted, textAlign: "center", marginBottom: 16 }}>Zoomez pour ajuster la position</div>
              )}
              {/* Actions */}
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => { setShowAvatarEditor(false); localStorage.setItem("illizeo_avatar_zoom", String(avatarZoom)); localStorage.setItem("illizeo_avatar_pos", JSON.stringify(avatarPos)); addToast("Photo mise à jour", "success"); }} className="iz-btn-pink" style={{ ...sBtn("pink"), flex: 1, fontSize: 13 }}>Valider</button>
                <button onClick={() => document.getElementById("avatar-upload")?.click()} className="iz-btn-outline" style={{ ...sBtn("outline"), fontSize: 13 }}>Changer</button>
                <button onClick={() => { setAvatarImage(null); setAvatarZoom(100); setAvatarPos({ x: 50, y: 50 }); localStorage.removeItem("illizeo_avatar"); localStorage.removeItem("illizeo_avatar_zoom"); localStorage.removeItem("illizeo_avatar_pos"); deleteMyAvatar().catch(() => {}); }} style={{ background: "none", border: `1px solid ${C.red}`, borderRadius: 8, padding: "8px 16px", fontSize: 13, color: C.red, cursor: "pointer", fontFamily: font }}>Retirer</button>
              </div>
            </>
          ) : (
            <div onClick={() => document.getElementById("avatar-upload")?.click()} style={{ padding: "24px 16px", borderRadius: 12, border: `2px dashed ${C.border}`, textAlign: "center", cursor: "pointer", fontSize: 13, color: C.textLight, transition: "all .2s" }}>
              <Upload size={24} color={C.textMuted} style={{ marginBottom: 8 }} /><br />
              Importer une photo<br />
              <span style={{ fontSize: 11, color: C.textMuted }}>JPG ou PNG · Max 5 Mo · Cadrage visage recommandé</span>
            </div>
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
                <div key={col} onClick={() => { setEmployeeBannerColor(col); localStorage.setItem("illizeo_banner_color", col); saveMyBanner({ color: col }).catch(() => {}); }} style={{ width: 32, height: 32, borderRadius: "50%", background: col, cursor: "pointer", border: employeeBannerColor === col ? "3px solid #E91E8C" : "3px solid transparent", transition: "all .15s", transform: employeeBannerColor === col ? "scale(1.15)" : "scale(1)" }} />
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
                  <button onClick={() => { setBannerImage(null); setBannerZoom(100); setBannerPos({ x: 50, y: 50 }); localStorage.removeItem("illizeo_banner_image"); localStorage.removeItem("illizeo_banner_zoom"); localStorage.removeItem("illizeo_banner_pos"); saveMyBanner({ image: "" }).catch(() => {}); addToast_admin("Image retirée"); }} style={{ background: "none", border: `1px solid ${C.red}`, borderRadius: 8, padding: "6px 10px", fontSize: 11, color: C.red, cursor: "pointer", fontFamily: font }}>Retirer</button>
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
      {/* Badge celebration modal — confetti rain when a new badge is earned */}
      {celebrationBadge && (() => {
        const COLORS = ["#E91E8C", "#1A73E8", "#4CAF50", "#F9A825", "#9C27B0", "#FF5722", "#00BCD4"];
        return (
          <div onClick={() => setCelebrationBadge(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.55)", zIndex: 3000, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div onClick={e => e.stopPropagation()} style={{ position: "relative", background: C.white, borderRadius: 20, padding: "44px 48px 36px", minWidth: 360, maxWidth: 460, textAlign: "center", overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,.35)" }}>
              <div aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
                {Array.from({ length: 90 }).map((_, ci) => {
                  const left = Math.random() * 100;
                  const delay = Math.random() * 2.5;
                  const duration = 3 + Math.random() * 2.5;
                  const color = COLORS[ci % COLORS.length];
                  const size = 6 + Math.random() * 8;
                  const rot = Math.random() * 360;
                  return (
                    <span key={ci} style={{
                      position: "absolute", top: "-30px", left: `${left}%`,
                      width: size, height: size * 1.6, background: color, borderRadius: 2,
                      animation: `iz-badge-confetti ${duration}s linear ${delay}s forwards`,
                      transform: `rotate(${rot}deg)`,
                    }} />
                  );
                })}
              </div>
              <style>{`@keyframes iz-badge-confetti { 0% { transform: translateY(-30px) rotate(0deg); opacity: 1; } 100% { transform: translateY(560px) rotate(720deg); opacity: 0.2; } } @keyframes iz-badge-pop { 0% { transform: scale(0); opacity: 0; } 60% { transform: scale(1.15); opacity: 1; } 100% { transform: scale(1); opacity: 1; } }`}</style>
              <div style={{ position: "relative" }}>
                <div style={{
                  width: 96, height: 96, borderRadius: "50%",
                  background: `linear-gradient(135deg, ${celebrationBadge.color || C.pink} 0%, ${C.pink} 100%)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 48, margin: "0 auto 16px",
                  boxShadow: `0 8px 24px ${(celebrationBadge.color || C.pink) + "55"}`,
                  animation: "iz-badge-pop .6s cubic-bezier(.34,1.56,.64,1) forwards",
                }}>🏆</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.pink, letterSpacing: 2, marginBottom: 8 }}>NOUVEAU BADGE DÉBLOQUÉ</div>
                <h2 style={{ fontSize: 24, fontWeight: 700, color: C.text, margin: "0 0 8px" }}>{celebrationBadge.nom}</h2>
                {celebrationBadge.description && <p style={{ fontSize: 13, color: C.textLight, margin: "0 0 24px", lineHeight: 1.5 }}>{celebrationBadge.description}</p>}
                <button onClick={() => setCelebrationBadge(null)} className="iz-btn-pink" style={{ ...sBtn("pink"), padding: "10px 32px", fontSize: 14 }}>Génial !</button>
              </div>
            </div>
          </div>
        );
      })()}
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
