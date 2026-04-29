import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { t, getLang, setLang, getAllLangs, LANG_META, type Lang } from "../i18n";
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
import { ANIM_STYLES, C, hexToRgb, colorWithAlpha, lighten, REGION_LOCALE, REGION_CURRENCY, getLocaleSettings, fmtDate, fmtDateShort, fmtTime, fmtDateTime, fmtDateTimeShort, fmtCurrency, font, fontDisplay, ILLIZEO_LOGO_URI, ILLIZEO_FULL_LOGO_URI, getLogoUri, getLogoFullUri, IllizeoLogoFull, IllizeoLogo, IllizeoLogoBrand, PreboardSidebar, sCard, sBtn, sInput, isDarkMode, applyDarkMode } from '../constants';

import type { OnboardingStep, DashboardPage, DashboardTab, UserRole, AdminPage, AdminModal, Collaborateur, ParcoursCategorie, ParcourTemplate, ActionTemplate, ActionType, AssignTarget, GroupePersonnes, DocCategory, WorkflowRule, EmailTemplate, TeamMember } from '../types';

// Inbox keyboard shortcuts component — registers global keydown listeners while
// the inbox tab is active. Returns null. Ignores keys when typing in inputs.
function InboxShortcuts({ enabled, items, selectedId, onSelect, onAdvance, onRefuse, onAddNote, onSearchFocus }: {
  enabled: boolean;
  items: any[];
  selectedId: number | null;
  onSelect: (id: number | null) => void;
  onAdvance: (c: any) => void;
  onRefuse: (c: any) => void;
  onAddNote: (c: any) => void;
  onSearchFocus: () => void;
}) {
  useEffect(() => {
    if (!enabled) return;
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault(); onSearchFocus(); return;
      }
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      const isTyping = tag === "input" || tag === "textarea" || (e.target as HTMLElement)?.isContentEditable;
      if (isTyping) return;
      const idx = selectedId !== null ? items.findIndex(i => i.id === selectedId) : -1;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (items.length === 0) return;
        const newIdx = idx < items.length - 1 ? idx + 1 : 0;
        onSelect(items[newIdx]?.id ?? null);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (items.length === 0) return;
        const newIdx = idx > 0 ? idx - 1 : items.length - 1;
        onSelect(items[newIdx]?.id ?? null);
      } else if (e.key.toLowerCase() === "e") {
        const c = items.find(i => i.id === selectedId);
        if (c) { e.preventDefault(); onAdvance(c); }
      } else if (e.key.toLowerCase() === "r") {
        const c = items.find(i => i.id === selectedId);
        if (c) { e.preventDefault(); onRefuse(c); }
      } else if (e.key.toLowerCase() === "n") {
        const c = items.find(i => i.id === selectedId);
        if (c) { e.preventDefault(); onAddNote(c); }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [enabled, items, selectedId, onSelect, onAdvance, onRefuse, onAddNote, onSearchFocus]);
  return null;
}
import RichEditor from '../components/RichEditor';
import TranslatableField, { type Translations } from '../components/TranslatableField';
import { DOC_CATEGORIES, ACTIONS, _MOCK_NOTIFICATIONS_LIST, NOTIF_RESOURCES, TEAM_MEMBERS, ACTION_TYPE_META, PHASE_ICONS, SITES, DEPARTEMENTS, TYPES_CONTRAT, _MOCK_COLLABORATEURS, _MOCK_PARCOURS_TEMPLATES, _MOCK_ACTION_TEMPLATES, _MOCK_ADMIN_DOC_CATEGORIES, _MOCK_WORKFLOW_RULES, _MOCK_EMAIL_TEMPLATES, _MOCK_PHASE_DEFAULTS, _MOCK_GROUPES, EQUIPE_ROLES, TPL_CATEGORIES, guessTplCategory } from '../mockData';

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
} from "../api/endpoints";
import { apiFetch } from "../api/client";

/**
 * Factory that creates all admin render functions.
 * Receives the full component context (state + helpers) as parameter.
 */
/**
 * Cooptation render functions.
 */
export function createAdminCooptation(ctx: any) {
  const {
    loginEmail, setLoginEmail, loginPassword, setLoginPassword, loginLoading, setLoginLoading, forgotMode, setForgotMode,
    forgotEmail, setForgotEmail, forgotSent, setForgotSent, forgotLoading, setForgotLoading, resetMode, setResetMode,
    resetToken, setResetToken, resetEmail, setResetEmail, resetPassword, setResetPassword, resetConfirm, setResetConfirm,
    resetLoading, setResetLoading, resetDone, setResetDone, twoFactorCode, setTwoFactorCode, showRegister, setShowRegister,
    tenantActiveModules, setTenantActiveModules, tenantSubscriptions, setTenantSubscriptions, selectedPlanIds, setSelectedPlanIds, subTab, setSubTab,
    subView, setSubView, subEmployeeCount, setSubEmployeeCount, billingInfo, setBillingInfo, paymentMethod, setPaymentMethod,
    storageUsage, setStorageUsage, signatureUsage, setSignatureUsage, showPricing, setShowPricing, plans, setPlans,
    pricingBilling, setPricingBilling, superAdminMode, setSuperAdminMode, saTab, setSaTab, saDashData, setSaDashData,
    saTenants, setSaTenants, saPlans, setSaPlans, saSubscriptions, setSaSubscriptions, saStripe, setSaStripe,
    saLoaded, setSaLoaded, saPlanPanel, setSaPlanPanel, saPlanData, setSaPlanData, tenantError, setTenantError,
    tenantChecking, setTenantChecking, tenantResolved, setTenantResolved, tenantInput, setTenantInput, regData, setRegData,
    regLoading, setRegLoading, regTenantSlug, setRegTenantSlug, twoFASetup, setTwoFASetup, twoFAEnabled, setTwoFAEnabled,
    twoFARecoveryCodes, setTwoFARecoveryCodes, twoFAConfirmCode, setTwoFAConfirmCode, npsSurveys, setNpsSurveys, npsStats, setNpsStats,
    npsTab, setNpsTab, npsPanelMode, setNpsPanelMode, npsPanelData, setNpsPanelData, npsSelectedSurvey, setNpsSelectedSurvey,
    badges, setBadges, badgeTemplates, setBadgeTemplates, myBadges, setMyBadges, badgeTplPanel, setBadgeTplPanel,
    empSurveys, setEmpSurveys, empNpsAnswers, setEmpNpsAnswers, showNotifDropdown, setShowNotifDropdown, empCampaigns, setEmpCampaigns,
    empCooptations, setEmpCooptations, empCooptForm, setEmpCooptForm, notifConfig, setNotifConfig, equipTypes, setEquipTypes,
    equipments, setEquipments, equipStats, setEquipStats, equipPanel, setEquipPanel, equipFilter, setEquipFilter,
    equipTab, setEquipTab, equipPackages, setEquipPackages, pkgPanel, setPkgPanel, signDocs, setSignDocs,
    signPanel, setSignPanel, signAcks, setSignAcks, signSelectedDoc, setSignSelectedDoc, myPendingSigs, setMyPendingSigs,
    showSetupWizard, setShowSetupWizard, setupStep, setSetupStep, setupData, setSetupData, setupCompleted, setSetupCompleted,
    role, setRole, step, setStep, showPreboard, setShowPreboard, dashPage, setDashPage,
    adminPage, setAdminPage, sidebarCollapsed, setSidebarCollapsed, adminModal, setAdminModal, parcoursFilter, setParcoursFilter,
    actionFilter, setActionFilter, toast, setToast, promptModal, setPromptModal, promptValue, setPromptValue,
    selectedCollab, setSelectedCollab, selectedParcours, setSelectedParcours, adminSearchQuery, setAdminSearchQuery, adminActionsTab, setAdminActionsTab,
    parcoursTab, setParcoursTab, parcoursCat, setParcoursCat, selectedParcoursId, setSelectedParcoursId, parcoursPanelMode, setParcoursPanelMode,
    parcoursPanelData, setParcoursPanelData, parcoursPanelLoading, setParcoursPanelLoading, phasePanelMode, setPhasePanelMode, phasePanelData, setPhasePanelData,
    phasePanelLoading, setPhasePanelLoading, actionPanelMode, setActionPanelMode, actionPanelData, setActionPanelData, actionPanelLoading, setActionPanelLoading,
    assignMode, setAssignMode, assignSelected, setAssignSelected, assignSearch, setAssignSearch, assignOpen, setAssignOpen,
    collabPanelMode, setCollabPanelMode, collabPanelData, setCollabPanelData, collabPanelLoading, setCollabPanelLoading, collabProfileId, setCollabProfileId,
    collabProfileTab, setCollabProfileTab, dossierCheck, setDossierCheck, groupePanelMode, setGroupePanelMode, groupePanelData, setGroupePanelData,
    groupePanelLoading, setGroupePanelLoading, integrationPanelId, setIntegrationPanelId, integrationConfig, setIntegrationConfig, integrationSaving, setIntegrationSaving,
    apiKeyInput, setApiKeyInput, suiviFilter, setSuiviFilter, suiviSearch, setSuiviSearch, collabMenuId, setCollabMenuId,
    adMappings, setAdMappings, adGroups, setAdGroups, syncLoading, setSyncLoading, obTeams, setObTeams,
    teamPanelMode, setTeamPanelMode, teamPanelData, setTeamPanelData, wfPanelMode, setWfPanelMode, wfPanelData, setWfPanelData,
    tplPanelMode, setTplPanelMode, tplPanelData, setTplPanelData, contratPanelMode, setContratPanelMode, contratPanelData, setContratPanelData,
    lang, setLangState, darkMode, setDarkMode, activeLanguages, setActiveLanguages, contentTranslations, setContentTranslations,
    fieldConfig, setFieldConfig, translateFieldId, setTranslateFieldId, translateEN, setTranslateEN, adminUsers, setAdminUsers,
    userPanelMode, setUserPanelMode, userPanelData, setUserPanelData, userPanelLoading, setUserPanelLoading, userSearch, setUserSearch,
    userRoleFilter, setUserRoleFilter, gedTab, setGedTab, gedSearch, setGedSearch, gedCatFilter, setGedCatFilter,
    tplPanelOpen, setTplPanelOpen, tplPanelDoc, setTplPanelDoc, selectedDocsForValidation, setSelectedDocsForValidation, realDocs, setRealDocs,
    emailConfig, setEmailConfig, tplCatFilter, setTplCatFilter, tplPreview, setTplPreview, themeColor, setThemeColor,
    region, setRegion, dateFormat, setDateFormat, timeFormat, setTimeFormat, timezone, setTimezone,
    customLogo, setCustomLogo, customLogoFull, setCustomLogoFull, loginBgImage, setLoginBgImage, customFavicon, setCustomFavicon,
    cooptations, setCooptations, cooptStats, setCooptStats, cooptSettings, setCooptSettings, cooptFilter, setCooptFilter,
    cooptCampaignFilter, setCooptCampaignFilter, cooptPanelMode, setCooptPanelMode, cooptPanelData, setCooptPanelData, cooptSettingsOpen, setCooptSettingsOpen,
    cooptTab, setCooptTab, inboxCategory, setInboxCategory, inboxSelectedId, setInboxSelectedId, inboxSearch, setInboxSearch, campaigns, setCampaigns, leaderboard, setLeaderboard, campaignPanelMode, setCampaignPanelMode,
    campaignPanelData, setCampaignPanelData, companyBlocks, setCompanyBlocks, editingBlockId, setEditingBlockId, userNotifs, setUserNotifs,
    notifUnread, setNotifUnread, msgConversations, setMsgConversations, msgActiveConvId, setMsgActiveConvId, msgMessages, setMsgMessages,
    msgInput, setMsgInput, msgSending, setMsgSending, msgUsers, setMsgUsers, msgShowNewConv, setMsgShowNewConv,
    msgSearchQuery, setMsgSearchQuery, confirmDialog, setConfirmDialog, selectedAction, setSelectedAction, actionTypeFilters, setActionTypeFilters,
    actionParcoursFilter, setActionParcoursFilter, selectedActionType, setSelectedActionType, suspendedParcours, setSuspendedParcours, docPieces, setDocPieces,
    parcoursStatut, setParcoursStatut, groupeColor, setGroupeColor, groupeMembres, setGroupeMembres, contrats, setContrats,
    selectedContratId, setSelectedContratId, entrepriseBlocs, setEntrepriseBlocs, entrepriseVideos, setEntrepriseVideos, gradientColor, setGradientColor,
    bannerUploaded, setBannerUploaded, employeeBannerColor, setEmployeeBannerColor, employeeBannerCustom, setEmployeeBannerCustom, bannerImage, setBannerImage,
    avatarImage, setAvatarImage, avatarZoom, setAvatarZoom, avatarPos, setAvatarPos, showAvatarEditor, setShowAvatarEditor,
    bannerZoom, setBannerZoom, bannerPos, setBannerPos, bannerDragging, setBannerDragging, bannerEditMode, setBannerEditMode,
    uploadedPieces, setUploadedPieces, modalPieces, setModalPieces, modalFormFields, setModalFormFields, modalQuestions, setModalQuestions,
    modalSubtasks, setModalSubtasks, phases, setPhases, selectedPhaseId, setSelectedPhaseId, messageCanal, setMessageCanal,
    messageBody, setMessageBody, showWelcomeModal, setShowWelcomeModal, showDocPanel, setShowDocPanel, showDocCategory, setShowDocCategory,
    showActionDetail, setShowActionDetail, actionTab, setActionTab, showProfile, setShowProfile, showTeamModal, setShowTeamModal,
    profileTab, setProfileTab, formData, setFormData, passwordVisible, setPasswordVisible, acceptCGU, setAcceptCGU,
    employeeDocs, setEmployeeDocs, completedActions, setCompletedActions, sharedTimeline, setSharedTimeline, toasts, setToasts,
    auth, _needsPlan, isDemo, apiEnabled, COLLABORATEURS, refetchCollaborateurs, PARCOURS_TEMPLATES, refetchParcours,
    ACTION_TEMPLATES, refetchActions, GROUPES, refetchGroupes, PHASE_DEFAULTS, refetchPhases, WORKFLOW_RULES, EMAIL_TEMPLATES,
    ADMIN_DOC_CATEGORIES, NOTIFICATIONS_LIST, integrations, refetchIntegrations, apiContrats, authRole, addToast_admin, showConfirm,
    showPrompt, switchLang, toggleDarkMode, resetTr, setTr, buildTranslationsPayload, addToast, addTimelineEntry,
    handleEmployeeSubmitDoc, handleRHValidateDoc, handleRHRefuseDoc, handleCompleteAction, handleRelance, docsSubmitted, docsValidated, docsTotal,
    docsMissing, employeeProgression, getLiveCollaborateurs, getLiveDocCategories, msgEndRef, bannerRef, messageRef, toastIdRef,
    handleBannerFileUpload, handleSendMessage, renderActionCard, renderCompanyBlock, renderMessagerie, SIDEBAR_ITEMS, markSetupStepDone, finishSetupWizard, SETUP_STEPS,
  } = ctx;

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
      admin_nps: "nps",
      admin_2fa: "sso",
      admin_provisioning: "provisioning",
    };
    const isEditorTenant = ["illizeo", "illizeo2"].includes(localStorage.getItem("illizeo_tenant_id") || "illizeo");
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
        { id: "admin_nps" as AdminPage, label: t('admin.nps'), icon: Star },
        { id: "admin_contrats" as AdminPage, label: t('admin.contracts_signatures'), icon: FileSignature },
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


    const COOPT_STATUS_META: Record<string, { label: string; color: string; bg: string; icon: any }> = {
      en_attente: { label: t('coopt.pending'), color: C.amber, bg: C.amberLight, icon: Hourglass },
      embauche: { label: t('coopt.hired'), color: C.blue, bg: C.blueLight, icon: UserCheck },
      valide: { label: t('coopt.validated'), color: C.green, bg: C.greenLight, icon: CheckCircle2 },
      recompense_versee: { label: t('coopt.rewarded'), color: "#7B5EA7", bg: C.purple + "15", icon: Gift },
      refuse: { label: t('coopt.refused'), color: C.red, bg: C.redLight, icon: Ban },
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
      // Derived data for hero/AI/alert sections
      const inProgress = cooptations.filter(c => !c.recompense_versee && (c.statut === "en_attente" || c.statut === "embauche"));
      const totalReward = inProgress.reduce((sum, c) => sum + (Number(c.montant_recompense) || 0), 0);
      const hotProfiles = inProgress.slice(0, Math.min(4, inProgress.length));
      const hires12m = cooptations.filter(c => c.statut === "valide" || c.statut === "recompense_versee").length;
      const totalRecommendations = cooptations.length;
      // Days since cooptation for "alert" detection (>= 4 days waiting)
      const dayDiff = (dateStr: string | null | undefined) => {
        if (!dateStr) return 0;
        return Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24));
      };
      const stalePending = inProgress
        .filter(c => c.statut === "en_attente" && dayDiff(c.date_cooptation) >= 4)
        .sort((a, b) => dayDiff(b.date_cooptation) - dayDiff(a.date_cooptation));
      const oldestStale = stalePending[0];
      // Priority cards — uses real AI scoring stored on the cooptation row
      // (priority_score / priority_reason / priority_action populated by the
      // CooptationScoringService backend service via Claude Haiku).
      // Falls back to static rules when an item has not been scored yet.
      const dayFallback = (c: any) => c.statut === "embauche" ? 75 : Math.max(50, 90 - dayDiff(c.date_cooptation) * 2);
      const fallbackReason = (c: any) => c.notes ? c.notes.slice(0, 80)
        : c.statut === "embauche" ? `Embauché·e — finalisez le suivi`
        : dayDiff(c.date_cooptation) >= 4 ? `${dayDiff(c.date_cooptation)} jours d'attente — un parrain mécontent peut nuire à l'image`
        : dayDiff(c.date_cooptation) >= 2 ? `Cooptation il y a ${dayDiff(c.date_cooptation)} jours, dossier complet — examiner sous 48h`
        : `Profil pertinent, premier appel à programmer`;
      const fallbackAction = (c: any) => c.statut === "embauche" ? "Faire une offre"
        : dayDiff(c.date_cooptation) >= 2 ? "Examiner" : "Programmer entretien";
      const colors = ["#7B5EA7", "#10b981", "#3b82f6", "#f59e0b", C.pink];
      const priorityCards = [...inProgress]
        .map(c => ({ ...c, _score: c.priority_score != null ? Number(c.priority_score) : dayFallback(c) }))
        .sort((a, b) => b._score - a._score)
        .slice(0, 5)
        .map((c: any, idx: number) => {
          const initials = (c.candidate_name || "?").split(" ").map((p: string) => p[0]).join("").slice(0, 2).toUpperCase();
          const matchPct = Math.round(c._score);
          const action = { label: c.priority_action || fallbackAction(c), primary: true };
          const why = c.priority_reason || fallbackReason(c);
          return { coopt: c, initials, color: colors[idx % colors.length], matchPct, action, why, isAI: c.priority_score != null };
        });
      const lastScoredAt = inProgress
        .map(c => c.priority_computed_at ? new Date(c.priority_computed_at).getTime() : 0)
        .reduce((a, b) => Math.max(a, b), 0);
      const totalScored = inProgress.filter(c => c.priority_score != null).length;
      const recomputeAll = async () => {
        try {
          addToast_admin("Recalcul des priorités IA en cours…");
          const { apiFetch } = await import('../api/client');
          await apiFetch('/cooptations/score-all', { method: 'POST' });
          reloadCoopt();
          addToast_admin("Scores IA mis à jour");
        } catch { addToast_admin("Erreur lors du recalcul IA"); }
      };
      const totalPotentialReward = inProgress.reduce((sum, c) => sum + (Number(c.montant_recompense) || 0), 0) * 4; // savings vs cabinet (assume 4× the bonus)

      return (
      <div style={{ flex: 1, padding: "24px 32px", overflow: "auto" }}>
        {/* ── Hero éditorial ── */}
        <div className="iz-fade-up" style={{
          position: "relative", overflow: "hidden",
          borderRadius: 20, padding: "36px 40px",
          background: `linear-gradient(135deg, ${C.pinkLight} 0%, ${C.pinkBg} 60%, ${C.pinkLight} 100%)`,
          marginBottom: 22,
        }}>
          {/* Decorative network graph (right) */}
          <svg viewBox="0 0 360 280" style={{ position: "absolute", right: 24, top: "50%", transform: "translateY(-50%)", width: 380, height: 290, opacity: .92, pointerEvents: "none" }}>
            <line x1="180" y1="140" x2="80" y2="60" stroke={C.pink} strokeWidth="1.5" strokeOpacity=".35" />
            <line x1="180" y1="140" x2="310" y2="80" stroke={C.pink} strokeWidth="1.5" strokeOpacity=".35" />
            <line x1="180" y1="140" x2="320" y2="200" stroke={C.pink} strokeWidth="1.5" strokeOpacity=".35" />
            <line x1="180" y1="140" x2="80" y2="220" stroke={C.pink} strokeWidth="1.5" strokeOpacity=".35" />
            <line x1="180" y1="140" x2="240" y2="40" stroke={C.pink} strokeWidth="1" strokeOpacity=".25" />
            <line x1="180" y1="140" x2="160" y2="240" stroke={C.pink} strokeWidth="1" strokeOpacity=".25" />
            {/* central node */}
            <circle cx="180" cy="140" r="42" fill={C.pink} fillOpacity=".18" />
            <circle cx="180" cy="140" r="30" fill={C.pink} />
            <text x="180" y="138" textAnchor="middle" fontSize="14" fontWeight="800" fill="#fff" fontFamily={fontDisplay}>{hires12m}</text>
            <text x="180" y="152" textAnchor="middle" fontSize="7" fontWeight="700" fill="#fff" fontFamily={font} letterSpacing="1">EMBAUCHES</text>
            {/* peripheral nodes (team labels) */}
            <circle cx="80" cy="60" r="18" fill="#a78bfa" />
            <circle cx="80" cy="60" r="26" fill="#a78bfa" fillOpacity=".18" />
            <text x="80" y="64" textAnchor="middle" fontSize="9" fontWeight="700" fill="#fff" fontFamily={font}>ENG</text>
            <circle cx="310" cy="80" r="18" fill="#10b981" />
            <circle cx="310" cy="80" r="26" fill="#10b981" fillOpacity=".18" />
            <text x="310" y="84" textAnchor="middle" fontSize="9" fontWeight="700" fill="#fff" fontFamily={font}>UX</text>
            <circle cx="80" cy="220" r="14" fill="#3b82f6" />
            <circle cx="80" cy="220" r="20" fill="#3b82f6" fillOpacity=".18" />
            <text x="80" y="223" textAnchor="middle" fontSize="8" fontWeight="700" fill="#fff" fontFamily={font}>PM</text>
            <circle cx="320" cy="200" r="14" fill="#f59e0b" />
            <circle cx="320" cy="200" r="20" fill="#f59e0b" fillOpacity=".18" />
            <text x="320" y="203" textAnchor="middle" fontSize="8" fontWeight="700" fill="#fff" fontFamily={font}>DATA</text>
            <circle cx="240" cy="40" r="8" fill="#cbd5e1" />
            <circle cx="160" cy="240" r="8" fill="#cbd5e1" />
          </svg>

          <div style={{ position: "relative", zIndex: 1, maxWidth: 640 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.pink, letterSpacing: 1.5, marginBottom: 12, textTransform: "uppercase" }}>
              Cooptation · Vue admin
            </div>
            <h1 style={{ fontSize: 40, fontWeight: 800, color: C.text, lineHeight: 1.05, margin: "0 0 14px", fontFamily: fontDisplay, letterSpacing: -1 }}>
              Votre vivier vaut <span style={{ background: C.text, color: C.white, padding: "0 10px", borderRadius: 4 }}>{fmtCurrency(totalPotentialReward)}</span>.
            </h1>
            <p style={{ fontSize: 14, color: C.textLight, lineHeight: 1.6, margin: "0 0 22px", maxWidth: 520 }}>
              {`${inProgress.length} cooptation${inProgress.length > 1 ? "s" : ""} en cours, dont ${hotProfiles.length} profil${hotProfiles.length > 1 ? "s chauds" : " chaud"} à traiter en priorité. Économies réalisées vs cabinet de recrutement sur 6 mois.`}
            </p>
            {/* Stat boxes */}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {([
                { value: inProgress.length, label: "cooptations en cours", tone: "default" },
                { value: hotProfiles.length, label: "profils chauds IA", tone: "pink" },
                { value: `${hires12m} · 6 mois`, label: "embauches", tone: "pink" },
                { value: totalRecommendations, label: "recommandations totales", tone: "default" },
              ]).map((s: any, i: number) => (
                <div key={i} style={{
                  background: s.tone === "pink" ? C.pinkLight : s.tone === "red" ? C.redLight : C.white,
                  borderRadius: 12, padding: "12px 18px", minWidth: 130, flex: "0 1 auto",
                }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: s.tone === "pink" ? C.pink : s.tone === "red" ? C.red : C.text, fontFamily: fontDisplay, letterSpacing: -0.4, display: "flex", alignItems: "center", gap: 6 }}>
                    {s.icon && <span style={{ fontSize: 16 }}>{s.icon}</span>}{s.value}
                  </div>
                  <div style={{ fontSize: 10, color: s.tone === "pink" ? C.pink : s.tone === "red" ? C.red : C.textMuted, opacity: .85, textTransform: "uppercase", letterSpacing: .4, marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Alert banner (stale pending cooptation) ── */}
        {oldestStale && (
          <div className="iz-fade-up" style={{
            display: "flex", alignItems: "center", gap: 14, padding: "14px 20px",
            background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 12, marginBottom: 24,
          }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#fef3c7", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <AlertTriangle size={14} color="#d97706" />
            </div>
            <div style={{ flex: 1, fontSize: 13, color: C.text }}>
              <strong style={{ fontWeight: 600 }}>1 cooptation en attente depuis plus de {dayDiff(oldestStale.date_cooptation)} jours</strong>
              <span style={{ color: C.textLight }}> · un parrain mécontent en parle 7 fois autour de lui</span>
            </div>
            <button onClick={() => { setCooptPanelData({ ...oldestStale }); setCooptPanelMode("edit"); }} className="iz-btn-pink" style={{ ...sBtn("pink"), padding: "8px 16px", fontSize: 12, display: "inline-flex", alignItems: "center", gap: 6 }}>
              Traiter en priorité <ArrowRight size={12} />
            </button>
          </div>
        )}

        {/* ── À traiter en priorité (AI cards) ── */}
        {priorityCards.length > 0 && (
          <div style={{ marginBottom: 28 }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14, gap: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: `linear-gradient(135deg, ${C.pink}, #a855f7)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Sparkles size={16} color="#fff" />
                </div>
                <div>
                  <h2 style={{ fontSize: 17, fontWeight: 600, margin: 0, color: C.text }}>À traiter en priorité · {priorityCards.length} cooptations</h2>
                  <p style={{ fontSize: 12, color: C.textMuted, margin: "2px 0 0" }}>
                    {totalScored > 0
                      ? `Claude Haiku a scoré ${totalScored}/${inProgress.length} cooptations${lastScoredAt ? ` · dernier calcul ${new Date(lastScoredAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}` : ""}`
                      : "Cliquez sur Recalculer pour lancer l'analyse IA des cooptations en cours"}
                  </p>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                <button onClick={recomputeAll} style={{ padding: "8px 14px", border: `1px solid ${C.pink}`, borderRadius: 8, background: C.pinkBg, fontSize: 12, fontWeight: 600, fontFamily: font, color: C.pink, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <Sparkles size={12} /> Recalculer
                </button>
                <button onClick={() => setCooptTab("cooptations")} style={{ padding: "8px 14px", border: `1px solid ${C.border}`, borderRadius: 8, background: C.white, fontSize: 12, fontWeight: 500, fontFamily: font, color: C.text, cursor: "pointer" }}>
                  Voir toutes →
                </button>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 14 }}>
              {priorityCards.map(({ coopt, initials, color, matchPct, action, why }) => (
                <div key={coopt.id} className="iz-card iz-fade-up" style={{ ...sCard, padding: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
                  <div style={{ padding: "14px 18px", display: "flex", alignItems: "flex-start", gap: 12 }}>
                    <div style={{ width: 42, height: 42, borderRadius: "50%", background: color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>{initials}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: 14, fontWeight: 600, color: C.text, display: "flex", alignItems: "center", gap: 5 }}>
                            {coopt.candidate_name}{matchPct >= 95 && <span style={{ fontSize: 13 }}>🔥</span>}
                          </div>
                          <div style={{ fontSize: 12, color: C.textLight, marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{coopt.candidate_poste || "—"}</div>
                          <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>recommandé·e par {coopt.referrer_name}</div>
                        </div>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 8px", borderRadius: 12, background: matchPct >= 90 ? "#dcfce7" : "#dbeafe", color: matchPct >= 90 ? "#15803d" : "#1d4ed8", fontSize: 10, fontWeight: 600, flexShrink: 0 }}>
                          <span style={{ width: 6, height: 6, borderRadius: "50%", background: matchPct >= 90 ? "#15803d" : "#1d4ed8" }} /> {matchPct}% potentiel
                        </span>
                      </div>
                    </div>
                  </div>
                  <div style={{ margin: "0 18px 12px", padding: "10px 12px", borderRadius: 8, background: C.pinkBg, fontSize: 12, color: C.text, lineHeight: 1.45, display: "flex", alignItems: "flex-start", gap: 6 }}>
                    <Sparkles size={13} color={C.pink} style={{ flexShrink: 0, marginTop: 1 }} />
                    <div><strong style={{ fontWeight: 600 }}>Pourquoi :</strong> {why}</div>
                  </div>
                  <div style={{ margin: "0 18px 12px", padding: "8px 14px", borderRadius: 8, background: C.pinkLight, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ fontSize: 9, color: C.text, opacity: .6, fontWeight: 500, textTransform: "uppercase", letterSpacing: .5 }}>Statut</div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: C.text, marginTop: 1, textTransform: "uppercase", letterSpacing: .5 }}>{(COOPT_STATUS_META[coopt.statut]?.label || coopt.statut).toUpperCase()}</div>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: C.pink, fontFamily: fontDisplay, whiteSpace: "nowrap" }}>+{fmtCurrency(Number(coopt.montant_recompense) || 0)}</div>
                  </div>
                  <div style={{ padding: "0 18px 16px", display: "flex", gap: 6, marginTop: "auto" }}>
                    <button onClick={() => { setCooptPanelData({ ...coopt }); setCooptPanelMode("edit"); }} className="iz-btn-pink" style={{ ...sBtn("pink"), flex: 1, padding: "9px 12px", fontSize: 12, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                      {action.label}
                    </button>
                    <button title="Note" style={{ padding: "9px 14px", border: `1px solid ${C.border}`, borderRadius: 8, background: C.white, fontSize: 12, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4, fontFamily: font, color: C.text }}>
                      <PenLine size={12} /> Note
                    </button>
                    <button title="Refuser" onClick={() => showConfirm("Refuser cette cooptation ?", () => cooptationRefuse(coopt.id).then(reloadCoopt).catch(() => addToast_admin(t('toast.error'))))} style={{ width: 36, height: 36, borderRadius: 8, border: `1px solid ${C.border}`, background: C.white, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: C.textMuted }}>
                      <X size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Settings + new buttons (compact, when not in pipeline mode) */}
        {(
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginBottom: 14 }}>
            <button onClick={() => setCooptSettingsOpen(true)} className="iz-btn-outline" style={{ ...sBtn("outline"), display: "flex", alignItems: "center", gap: 6 }}><Zap size={14} /> {t('coopt.settings')}</button>
            {cooptTab === "cooptations" && <button onClick={() => { setCooptPanelData({ referrer_name: "", referrer_email: "", candidate_name: "", candidate_email: "", candidate_poste: "", type_recompense: cooptSettings?.type_recompense_defaut || "prime", montant_recompense: cooptSettings?.montant_defaut || 500, mois_requis: cooptSettings?.mois_requis_defaut || 6, notes: "", campaign_id: null }); setCooptPanelMode("create"); }} className="iz-btn-pink" style={{ ...sBtn("pink"), display: "flex", alignItems: "center", gap: 6 }}><Plus size={14} /> {t('coopt.new')}</button>}
            {cooptTab === "campagnes" && <button onClick={() => { setCampaignPanelData({ titre: "", description: "", departement: "", site: "", type_contrat: "CDI", type_recompense: "prime", montant_recompense: cooptSettings?.montant_defaut || 500, mois_requis: cooptSettings?.mois_requis_defaut || 6, nombre_postes: 1, priorite: "normale", date_limite: "" }); setCampaignPanelMode("create"); }} className="iz-btn-pink" style={{ ...sBtn("pink"), display: "flex", alignItems: "center", gap: 6 }}><Plus size={14} /> {t('coopt.new_campaign')}</button>}
          </div>
        )}

        {/* Main tabs */}
        <div style={{ display: "flex", gap: 0, borderBottom: `2px solid ${C.border}`, marginBottom: 16 }}>
          {([
            { id: "priorite" as const, label: "À traiter en priorité", count: cooptations.filter(c => c.statut === "en_attente" && !c.recompense_versee && (Number(c.priority_score || 0) >= 80 || dayDiff(c.date_cooptation) < 2)).length, hot: true },
            { id: "inbox" as const, label: "Inbox", count: cooptations.filter(c => c.statut !== "refuse" && !c.recompense_versee).length },
            { id: "cooptations" as const, label: "Toutes", count: cooptations.length },
            { id: "campagnes" as const, label: t('coopt.campaigns'), count: campaigns.filter(c => c.statut === "active").length },
            { id: "classement" as const, label: t('coopt.leaderboard'), count: leaderboard.length },
          ]).map(tab => (
            <button key={tab.id} onClick={() => setCooptTab(tab.id)} style={{ padding: "10px 20px", fontSize: 13, fontWeight: cooptTab === tab.id ? 600 : 400, color: cooptTab === tab.id ? C.pink : C.textLight, background: "none", border: "none", borderBottom: cooptTab === tab.id ? `2px solid ${C.pink}` : "2px solid transparent", cursor: "pointer", fontFamily: font, marginBottom: -2, display: "flex", alignItems: "center", gap: 6 }}>
              {tab.label} <span style={{ fontSize: 10, padding: "1px 6px", borderRadius: 8, background: cooptTab === tab.id ? C.pinkBg : C.bg, color: cooptTab === tab.id ? C.pink : C.textMuted }}>{tab.count}</span>
            </button>
          ))}
        </div>

        {/* ═══ TAB: À traiter en priorité ═══ */}
        {cooptTab === "priorite" && (() => {
          const priorityList = cooptations
            .filter(c => c.statut === "en_attente" && !c.recompense_versee && (Number(c.priority_score || 0) >= 80 || dayDiff(c.date_cooptation) < 2))
            .sort((a, b) => Number(b.priority_score || 0) - Number(a.priority_score || 0));
          return (
            <>
              <div className="iz-card iz-fade-up" style={{ ...sCard, padding: "22px 28px", marginBottom: 16, background: `linear-gradient(115deg, ${C.pinkBg} 0%, ${C.white} 60%, ${C.amberLight} 100%)` }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.pink, letterSpacing: 1.5, marginBottom: 8, textTransform: "uppercase" }}>Action requise</div>
                <h1 style={{ fontSize: 28, fontWeight: 800, color: C.text, lineHeight: 1.1, margin: "0 0 8px", fontFamily: fontDisplay, letterSpacing: -.6 }}>
                  À traiter en priorité · <em style={{ color: C.pink, fontStyle: "italic" }}>{priorityList.length} cooptation{priorityList.length > 1 ? "s" : ""}</em>
                </h1>
                <div style={{ fontSize: 13, color: C.textLight, lineHeight: 1.5, maxWidth: 560 }}>
                  Profils chauds avec score IA &gt;= 80 ou cooptés depuis moins de 2 jours. Ne laissez pas refroidir.
                </div>
              </div>
              {priorityList.length === 0 ? (
                <div className="iz-card" style={{ ...sCard, padding: "60px 20px", textAlign: "center" }}>
                  <div style={{ fontSize: 36, marginBottom: 12 }}>🌟</div>
                  <div style={{ fontSize: 14, color: C.textLight }}>Aucune cooptation prioritaire — tout est sous contrôle.</div>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: 14 }}>
                  {priorityList.map(c => {
                    const initials = (c.candidate_name || "?").split(" ").map((p: string) => p[0]).join("").slice(0, 2).toUpperCase();
                    const refInitials = (c.referrer_name || "?").split(" ").map((p: string) => p[0]).join("").slice(0, 2).toUpperCase();
                    const days = dayDiff(c.date_cooptation);
                    const score = Number(c.priority_score || 0);
                    return (
                      <div key={c.id} className="iz-card" style={{ ...sCard, padding: 18, cursor: "pointer", borderLeft: `4px solid ${C.pink}` }} onClick={() => { setCooptPanelData({ ...c }); setCooptPanelMode("edit"); }}>
                        <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 12 }}>
                          <div style={{ width: 44, height: 44, borderRadius: "50%", background: C.pink, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, flexShrink: 0 }}>{initials}</div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 15, fontWeight: 700, color: C.text, display: "flex", alignItems: "center", gap: 6 }}>{c.candidate_name} <span>🔥</span></div>
                            <div style={{ fontSize: 11, color: C.textMuted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.candidate_email}</div>
                            {c.candidate_poste && <div style={{ fontSize: 11, color: C.textLight, marginTop: 2 }}>{c.candidate_poste}</div>}
                          </div>
                          {score > 0 && (
                            <div style={{ flexShrink: 0, padding: "3px 9px", background: C.pinkLight, color: C.pink, fontSize: 10, fontWeight: 700, borderRadius: 999, letterSpacing: .4 }}>{score}/100</div>
                          )}
                        </div>
                        {c.priority_reason && (
                          <div style={{ padding: 10, background: C.pinkBg, borderRadius: 8, fontSize: 11, color: C.text, lineHeight: 1.45, marginBottom: 10, display: "flex", gap: 6 }}>
                            <Sparkles size={12} color={C.pink} style={{ flexShrink: 0, marginTop: 1 }} />
                            <span>{c.priority_reason}</span>
                          </div>
                        )}
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 10, borderTop: `1px solid ${C.border}` }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: C.textMuted }}>
                            <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#94a3b8", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700 }}>{refInitials}</div>
                            <span>{c.referrer_name}</span>
                            <span>·</span>
                            <span style={{ color: days < 1 ? C.pink : C.textMuted, fontWeight: 600 }}>{days === 0 ? "aujourd'hui" : days === 1 ? "hier" : `${days} jours`}</span>
                          </div>
                          <button onClick={(e) => { e.stopPropagation(); showPrompt("Date d'embauche", (d: string) => { if (d) cooptationMarkHired(c.id, { date_embauche: d }).then(reloadCoopt).then(() => addToast_admin("Marquée embauchée")).catch(() => addToast_admin(t('toast.error'))); }, { label: "Date d'embauche", type: "date" }); }} className="iz-btn-pink" style={{ ...sBtn("pink"), fontSize: 11, padding: "6px 12px" }}>
                            Programmer entretien
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          );
        })()}

        {/* ═══ TAB: Inbox (3-column triage view) ═══ */}
        {cooptTab === "inbox" && (() => {
          const INBOX_CATS = [
            { key: "boite", label: "Boîte de réception", icon: "📥", count: cooptations.filter(c => c.statut === "en_attente" && !c.recompense_versee).length },
            { key: "chauds", label: "Profils chauds", icon: "🔥", count: cooptations.filter(c => c.statut === "en_attente" && !c.recompense_versee && (Number(c.priority_score || 0) >= 80 || dayDiff(c.date_cooptation) < 2)).length },
            { key: "entretien", label: "En entretien", icon: "💬", count: cooptations.filter(c => c.statut === "en_attente" && !c.recompense_versee && dayDiff(c.date_cooptation) >= 5).length },
            { key: "offres", label: "Offres en attente", icon: "⏳", count: cooptations.filter(c => c.statut === "embauche" && !c.is_validable).length },
            { key: "probatoire", label: "Période probatoire", icon: "🧪", count: cooptations.filter(c => c.statut === "embauche").length },
            { key: "recompenser", label: "À récompenser", icon: "🎁", count: cooptations.filter(c => c.statut === "valide" && !c.recompense_versee).length },
            { key: "archivees", label: "Archivées", icon: "📦", count: cooptations.filter(c => c.statut === "refuse" || c.recompense_versee).length },
          ];
          const filterByCategory = (cs: any[], cat: string): any[] => {
            switch (cat) {
              case "boite": return cs.filter(c => c.statut === "en_attente" && !c.recompense_versee);
              case "chauds": return cs.filter(c => c.statut === "en_attente" && !c.recompense_versee && (Number(c.priority_score || 0) >= 80 || dayDiff(c.date_cooptation) < 2));
              case "entretien": return cs.filter(c => c.statut === "en_attente" && !c.recompense_versee && dayDiff(c.date_cooptation) >= 5);
              case "offres": return cs.filter(c => c.statut === "embauche" && !c.is_validable);
              case "probatoire": return cs.filter(c => c.statut === "embauche");
              case "recompenser": return cs.filter(c => c.statut === "valide" && !c.recompense_versee);
              case "archivees": return cs.filter(c => c.statut === "refuse" || c.recompense_versee);
              default: return cs;
            }
          };
          const _inboxBaseItems = filterByCategory(cooptations, inboxCategory).sort((a, b) => new Date(b.date_cooptation).getTime() - new Date(a.date_cooptation).getTime());
          const _inboxQuery = (inboxSearch || "").trim().toLowerCase();
          const inboxItems = _inboxQuery
            ? _inboxBaseItems.filter(c => (c.candidate_name || "").toLowerCase().includes(_inboxQuery) || (c.candidate_email || "").toLowerCase().includes(_inboxQuery) || (c.candidate_poste || "").toLowerCase().includes(_inboxQuery) || (c.referrer_name || "").toLowerCase().includes(_inboxQuery))
            : _inboxBaseItems;
          const selectedCoopt = inboxSelectedId ? cooptations.find(c => c.id === inboxSelectedId) : null;
          // Shortcut handlers — reused by both keyboard shortcuts and detail panel buttons
          const inboxAdvance = (c: any) => {
            if (c.statut === "en_attente") showPrompt("Date d'embauche", (d: string) => { if (d) cooptationMarkHired(c.id, { date_embauche: d }).then(reloadCoopt).then(() => addToast_admin("Marquée embauchée")).catch(() => addToast_admin(t('toast.error'))); }, { label: "Date d'embauche", type: "date" });
            else if (c.statut === "embauche" && c.is_validable) cooptationValidate(c.id).then(reloadCoopt).then(() => addToast_admin("Cooptation validée")).catch(() => addToast_admin(t('toast.error')));
            else if (c.statut === "valide" && !c.recompense_versee) cooptationMarkRewarded(c.id).then(reloadCoopt).then(() => addToast_admin("Récompense versée")).catch(() => addToast_admin(t('toast.error')));
            else addToast_admin("Aucune étape suivante disponible pour cette cooptation");
          };
          const inboxRefuse = (c: any) => {
            if (c.statut === "refuse" || c.recompense_versee) return;
            showConfirm("Refuser cette cooptation ?", () => cooptationRefuse(c.id).then(reloadCoopt).then(() => addToast_admin("Cooptation refusée")).catch(() => addToast_admin(t('toast.error'))));
          };
          const inboxAddNote = (c: any) => {
            showPrompt("Ajouter une note", (note: string) => {
              if (!note) return;
              const newNotes = c.notes ? `${c.notes}\n— ${new Date().toLocaleDateString("fr-FR")} : ${note}` : note;
              apiUpdateCooptation(c.id, { notes: newNotes }).then(reloadCoopt).then(() => addToast_admin("Note ajoutée")).catch(() => addToast_admin(t('toast.error')));
            }, { label: "Note", type: "text" });
          };
          const focusInboxSearch = () => { const el = document.getElementById("inbox-search-input") as HTMLInputElement | null; if (el) el.focus(); };
          const statusBadge = (c: any) => {
            if (c.recompense_versee) return { label: "RÉCOMPENSÉ", color: "#7B5EA7", bg: "#7B5EA715" };
            if (c.statut === "refuse") return { label: "REFUSÉ", color: C.red, bg: C.redLight };
            if (c.statut === "valide") return { label: "À RÉCOMPENSER", color: C.green, bg: C.greenLight };
            if (c.statut === "embauche") return { label: c.is_validable ? "PROBATOIRE OK" : "EN OFFRE", color: C.amber, bg: C.amberLight };
            const days = dayDiff(c.date_cooptation);
            if (days < 2) return { label: "REÇUE", color: C.pink, bg: C.pinkLight };
            if (days < 5) return { label: "À EXAMINER", color: C.blue, bg: C.blueLight };
            return { label: "EN ENTRETIEN", color: "#a855f7", bg: "#a855f715" };
          };
          const formatRelative = (dateStr: string) => {
            const d = dayDiff(dateStr);
            if (d === 0) return "aujourd'hui";
            if (d === 1) return "hier";
            if (d < 7) return `${d} jours`;
            if (d < 30) return `${Math.floor(d / 7)} sem.`;
            return `${Math.floor(d / 30)} mois`;
          };
          // Build a small network graph from active cooptations grouped by candidate department.
          // The first word of `candidate_poste` becomes the dept tag; we map common roles to colors.
          const _deptColor = (poste: string): { tag: string; color: string } => {
            const p = (poste || "").toLowerCase();
            if (/ux|ui|design|product/.test(p)) return { tag: "UX", color: "#a855f7" };
            if (/dev|eng|stack|backend|frontend|full|software/.test(p)) return { tag: "ENG", color: "#3b82f6" };
            if (/data|analyst|scientist|ml|ai/.test(p)) return { tag: "DATA", color: "#10b981" };
            if (/pm|product manager|chef|projet|po|scrum/.test(p)) return { tag: "PM", color: "#f59e0b" };
            if (/sales|commercial|account|business/.test(p)) return { tag: "SALES", color: "#ef4444" };
            if (/hr|rh|talent|people/.test(p)) return { tag: "HR", color: "#ec4899" };
            return { tag: (poste || "JOB").split(" ")[0]?.slice(0, 3).toUpperCase() || "JOB", color: "#64748b" };
          };
          const _activeForGraph = cooptations.filter(c => c.statut !== "refuse" && !c.recompense_versee);
          const _deptBuckets: Record<string, { tag: string; color: string; count: number }> = {};
          _activeForGraph.forEach(c => {
            const d = _deptColor(c.candidate_poste || "");
            if (!_deptBuckets[d.tag]) _deptBuckets[d.tag] = { tag: d.tag, color: d.color, count: 0 };
            _deptBuckets[d.tag].count += 1;
          });
          const _deptList = Object.values(_deptBuckets).sort((a, b) => b.count - a.count).slice(0, 6);
          // Position each satellite on a ring around the center node.
          const _graphW = 280, _graphH = 200, _cx = _graphW - 70, _cy = _graphH / 2, _ringR = 65;
          const _hotCount = cooptations.filter(c => c.statut === "en_attente" && !c.recompense_versee && (Number(c.priority_score || 0) >= 80 || dayDiff(c.date_cooptation) < 2)).length;
          // Build activity timeline events for the selected coopt.
          const _buildTimeline = (c: any) => {
            const events: { date: string; icon: string; color: string; title: string; subtitle?: string }[] = [];
            if (c.date_cooptation) events.push({ date: c.date_cooptation, icon: "✨", color: C.pink, title: `Recommandée par ${c.referrer_name || "—"}`, subtitle: c.candidate_poste ? `Pour le poste de ${c.candidate_poste}` : undefined });
            // Parse dated notes formatted like "— DD/MM/YYYY : note text"
            if (c.notes) {
              const noteLines = String(c.notes).split("\n");
              noteLines.forEach((line: string) => {
                const m = line.match(/^—\s*(\d{1,2}\/\d{1,2}\/\d{4})\s*:\s*(.+)$/);
                if (m) {
                  const [d, mm, y] = m[1].split("/");
                  const iso = `${y}-${mm.padStart(2, "0")}-${d.padStart(2, "0")}`;
                  events.push({ date: iso, icon: "📝", color: C.textMuted, title: "Note ajoutée", subtitle: m[2] });
                }
              });
            }
            if (c.date_embauche) events.push({ date: c.date_embauche, icon: "🤝", color: C.amber, title: "Marquée embauchée", subtitle: c.mois_requis ? `Période probatoire ${c.mois_requis} mois` : undefined });
            if (c.date_validation) events.push({ date: c.date_validation, icon: "✅", color: C.green, title: "Cooptation validée" });
            if (c.date_versement) events.push({ date: c.date_versement, icon: "🎁", color: "#7B5EA7", title: "Récompense versée", subtitle: fmtCurrency(Number(c.montant_recompense) || 0) });
            if (c.statut === "refuse") events.push({ date: c.updated_at || c.date_cooptation, icon: "🚫", color: C.red, title: "Cooptation refusée" });
            if (c.priority_reason) events.push({ date: c.priority_computed_at || c.date_cooptation, icon: "✨", color: C.pink, title: `Insight IA · score ${c.priority_score || "—"}`, subtitle: c.priority_reason });
            return events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
          };
          return (
            <>
            <InboxShortcuts
              enabled={cooptTab === "inbox"}
              items={inboxItems}
              selectedId={inboxSelectedId}
              onSelect={setInboxSelectedId}
              onAdvance={inboxAdvance}
              onRefuse={inboxRefuse}
              onAddNote={inboxAddNote}
              onSearchFocus={focusInboxSearch}
            />
            {/* Header: title + network graph */}
            <div className="iz-card iz-fade-up" style={{ ...sCard, padding: "20px 28px", marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, background: `linear-gradient(115deg, ${C.pinkBg} 0%, ${C.white} 50%, ${C.amberLight} 100%)` }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.pink, letterSpacing: 1.5, marginBottom: 8, textTransform: "uppercase" }}>Cooptation · Inbox triage</div>
                <h1 style={{ fontSize: 28, fontWeight: 800, color: C.text, lineHeight: 1.1, margin: "0 0 8px", fontFamily: fontDisplay, letterSpacing: -.6 }}>
                  Boîte de réception · <em style={{ color: C.pink, fontStyle: "italic" }}>{_activeForGraph.length} dossier{_activeForGraph.length > 1 ? "s" : ""}</em>
                </h1>
                <div style={{ fontSize: 13, color: C.textLight, lineHeight: 1.5, maxWidth: 560 }}>
                  Triez les cooptations comme un email. {_hotCount > 0 ? `${_hotCount} profil${_hotCount > 1 ? "s" : ""} chaud${_hotCount > 1 ? "s" : ""} en attente · ` : ""}raccourcis clavier{" "}
                  <kbd style={{ fontSize: 9, padding: "1px 4px", borderRadius: 3, background: C.bg, border: `1px solid ${C.border}`, color: C.textMuted }}>↑↓</kbd>{" "}
                  <kbd style={{ fontSize: 9, padding: "1px 4px", borderRadius: 3, background: C.bg, border: `1px solid ${C.border}`, color: C.textMuted }}>E</kbd>{" "}
                  <kbd style={{ fontSize: 9, padding: "1px 4px", borderRadius: 3, background: C.bg, border: `1px solid ${C.border}`, color: C.textMuted }}>R</kbd>{" "}
                  <kbd style={{ fontSize: 9, padding: "1px 4px", borderRadius: 3, background: C.bg, border: `1px solid ${C.border}`, color: C.textMuted }}>N</kbd>.
                </div>
              </div>
              {/* Network graph SVG */}
              <svg width={_graphW} height={_graphH} style={{ flexShrink: 0 }} viewBox={`0 0 ${_graphW} ${_graphH}`}>
                {/* Connection lines first, so they sit under the nodes */}
                {_deptList.map((d, i) => {
                  const angle = (Math.PI * 2 * i) / Math.max(_deptList.length, 1) - Math.PI / 2;
                  const x = _cx + Math.cos(angle) * _ringR;
                  const y = _cy + Math.sin(angle) * _ringR;
                  return <line key={`l-${d.tag}`} x1={_cx} y1={_cy} x2={x} y2={y} stroke={d.color} strokeWidth={1.4} strokeOpacity={0.35} strokeDasharray="3 3" />;
                })}
                {/* Center node */}
                <circle cx={_cx} cy={_cy} r={36} fill={C.pink} />
                <text x={_cx} y={_cy - 2} textAnchor="middle" fontSize="16" fontWeight="800" fill="#fff" fontFamily={fontDisplay}>{_activeForGraph.length}</text>
                <text x={_cx} y={_cy + 13} textAnchor="middle" fontSize="8" fontWeight="700" fill="#fff" letterSpacing="1">EN COURS</text>
                {/* Satellite nodes */}
                {_deptList.map((d, i) => {
                  const angle = (Math.PI * 2 * i) / Math.max(_deptList.length, 1) - Math.PI / 2;
                  const x = _cx + Math.cos(angle) * _ringR;
                  const y = _cy + Math.sin(angle) * _ringR;
                  return (
                    <g key={`s-${d.tag}`}>
                      <circle cx={x} cy={y} r={18} fill={d.color} />
                      <text x={x} y={y + 3} textAnchor="middle" fontSize="9" fontWeight="800" fill="#fff" letterSpacing=".5">{d.tag}</text>
                      <text x={x} y={y + 32} textAnchor="middle" fontSize="9" fontWeight="600" fill={C.textMuted}>{d.count}</text>
                    </g>
                  );
                })}
              </svg>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "240px 1fr 380px", gap: 12, height: "calc(100vh - 380px)", minHeight: 520 }}>
              {/* ── Column 1: Categories sidebar ── */}
              <div className="iz-card" style={{ ...sCard, padding: 12, overflowY: "auto" }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: C.text, fontFamily: fontDisplay, padding: "4px 8px 12px", letterSpacing: -.4 }}>
                  Boîte
                  <button onClick={() => { setCooptPanelData({ referrer_name: "", referrer_email: "", candidate_name: "", candidate_email: "", candidate_poste: "", type_recompense: cooptSettings?.type_recompense_defaut || "prime", montant_recompense: cooptSettings?.montant_defaut || 500, mois_requis: cooptSettings?.mois_requis_defaut || 6, notes: "", campaign_id: null }); setCooptPanelMode("create"); }} style={{ float: "right", width: 28, height: 28, borderRadius: "50%", background: C.pink, color: C.white, border: "none", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center" }} title="Nouvelle cooptation"><Plus size={14} /></button>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {INBOX_CATS.map(cat => {
                    const active = inboxCategory === cat.key;
                    return (
                      <button key={cat.key} onClick={() => { setInboxCategory(cat.key); setInboxSelectedId(null); }} style={{
                        display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 8, border: "none",
                        background: active ? C.pinkBg : "transparent", color: active ? C.pink : C.text,
                        fontWeight: active ? 600 : 400, fontSize: 13, cursor: "pointer", fontFamily: font, textAlign: "left",
                      }}>
                        <span style={{ fontSize: 14 }}>{cat.icon}</span>
                        <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{cat.label}</span>
                        <span style={{ fontSize: 11, padding: "1px 7px", borderRadius: 999, background: active ? C.pink : C.bg, color: active ? C.white : C.textMuted, fontWeight: 600 }}>{cat.count}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ── Column 2: Cards list ── */}
              <div className="iz-card" style={{ ...sCard, padding: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
                <div style={{ padding: "12px 14px", borderBottom: `1px solid ${C.border}`, display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{INBOX_CATS.find(c => c.key === inboxCategory)?.label}</div>
                    <span style={{ fontSize: 11, color: C.textMuted }}>· {inboxItems.length} dossier{inboxItems.length > 1 ? "s" : ""}</span>
                  </div>
                  <div style={{ position: "relative" }}>
                    <input id="inbox-search-input" type="text" value={inboxSearch} onChange={e => setInboxSearch(e.target.value)} placeholder="Rechercher candidat, parrain, poste…" style={{ ...sInput, fontSize: 12, padding: "6px 30px 6px 30px", height: 30 }} />
                    <span style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", color: C.textMuted, fontSize: 12, pointerEvents: "none" }}>🔍</span>
                    <kbd style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", fontSize: 9, fontWeight: 600, padding: "2px 5px", borderRadius: 3, background: C.bg, color: C.textMuted, border: `1px solid ${C.border}`, fontFamily: font, pointerEvents: "none" }}>⌘K</kbd>
                  </div>
                </div>
                <div style={{ flex: 1, overflowY: "auto" }}>
                  {inboxItems.length === 0 && (
                    <div style={{ padding: "40px 20px", textAlign: "center", color: C.textMuted, fontSize: 12, fontStyle: "italic" }}>Aucune cooptation dans cette catégorie</div>
                  )}
                  {inboxItems.map(c => {
                    const initials = (c.candidate_name || "?").split(" ").map((p: string) => p[0]).join("").slice(0, 2).toUpperCase();
                    const isSelected = inboxSelectedId === c.id;
                    const isHot = Number(c.priority_score || 0) >= 80 || (c.statut === "en_attente" && dayDiff(c.date_cooptation) < 2);
                    const badge = statusBadge(c);
                    return (
                      <div key={c.id} onClick={() => setInboxSelectedId(c.id)} style={{
                        padding: "12px 16px", borderBottom: `1px solid ${C.border}`, cursor: "pointer",
                        background: isSelected ? C.pinkBg : "transparent", borderLeft: isSelected ? `3px solid ${C.pink}` : "3px solid transparent",
                        transition: "background .12s",
                      }}>
                        <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                          <div style={{ width: 36, height: 36, borderRadius: "50%", background: C.pink, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{initials}</div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8, marginBottom: 2 }}>
                              <div style={{ fontSize: 13, fontWeight: 600, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.candidate_name}{isHot && <span style={{ marginLeft: 4 }}>🔥</span>}</div>
                              <div style={{ fontSize: 10, color: C.textMuted, flexShrink: 0 }}>{formatRelative(c.date_cooptation)}</div>
                            </div>
                            <div style={{ fontSize: 11, color: C.textLight, marginBottom: 6, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.candidate_poste || "—"}</div>
                            <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                              <span style={{ fontSize: 9, fontWeight: 700, color: badge.color, background: badge.bg, padding: "2px 7px", borderRadius: 4, letterSpacing: .4 }}>{badge.label}</span>
                              <span style={{ fontSize: 10, color: C.textMuted }}>par {c.referrer_name || "—"}</span>
                              {c.cv_original_name && <Paperclip size={10} color={C.textMuted} />}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ── Column 3: Detail panel ── */}
              <div className="iz-card" style={{ ...sCard, padding: 0, overflowY: "auto" }}>
                {!selectedCoopt ? (
                  <div style={{ padding: "60px 20px", textAlign: "center", color: C.textMuted, fontSize: 13 }}>
                    <div style={{ fontSize: 36, marginBottom: 12 }}>👈</div>
                    Sélectionnez un dossier pour voir les détails
                  </div>
                ) : (() => {
                  const c = selectedCoopt;
                  const initials = (c.candidate_name || "?").split(" ").map((p: string) => p[0]).join("").slice(0, 2).toUpperCase();
                  const refInitials = (c.referrer_name || "?").split(" ").map((p: string) => p[0]).join("").slice(0, 2).toUpperCase();
                  const badge = statusBadge(c);
                  return (
                    <>
                      <div style={{ padding: "20px 22px", borderBottom: `1px solid ${C.border}` }}>
                        <span style={{ fontSize: 9, fontWeight: 700, color: badge.color, background: badge.bg, padding: "3px 9px", borderRadius: 4, letterSpacing: .5 }}>{badge.label}</span>
                        <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 14 }}>
                          <div style={{ width: 56, height: 56, borderRadius: "50%", background: C.pink, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, flexShrink: 0 }}>{initials}</div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 18, fontWeight: 700, color: C.text, fontFamily: fontDisplay, letterSpacing: -.3 }}>{c.candidate_name}</div>
                            <div style={{ fontSize: 12, color: C.textMuted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.candidate_email}</div>
                          </div>
                        </div>
                        {c.candidate_poste && (
                          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 10, padding: "3px 9px", background: C.bg, borderRadius: 4 }}>
                            <span style={{ fontSize: 9, fontWeight: 700, color: C.textMuted, textTransform: "uppercase", letterSpacing: .5 }}>{(c.candidate_poste.split(" ")[0] || "JOB").slice(0, 8)}</span>
                            <span style={{ fontSize: 11, color: C.text }}>{c.candidate_poste}</span>
                          </div>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div style={{ padding: "14px 22px", display: "flex", gap: 6, flexWrap: "wrap", borderBottom: `1px solid ${C.border}` }}>
                        {c.statut === "en_attente" && (
                          <button onClick={() => showPrompt("Date d'embauche", (d: string) => { if (d) cooptationMarkHired(c.id, { date_embauche: d }).then(reloadCoopt).then(() => addToast_admin("Marquée embauchée")).catch(() => addToast_admin(t('toast.error'))); }, { label: "Date d'embauche", type: "date" })} className="iz-btn-pink" style={{ ...sBtn("pink"), fontSize: 12, padding: "8px 14px", flex: 1 }}>
                            Programmer entretien
                          </button>
                        )}
                        {c.statut === "embauche" && c.is_validable && (
                          <button onClick={() => cooptationValidate(c.id).then(reloadCoopt).then(() => addToast_admin("Cooptation validée")).catch(() => addToast_admin(t('toast.error')))} className="iz-btn-pink" style={{ ...sBtn("pink"), fontSize: 12, padding: "8px 14px", flex: 1 }}>
                            Valider
                          </button>
                        )}
                        {c.statut === "valide" && !c.recompense_versee && (
                          <button onClick={() => cooptationMarkRewarded(c.id).then(reloadCoopt).then(() => addToast_admin("Récompense versée")).catch(() => addToast_admin(t('toast.error')))} className="iz-btn-pink" style={{ ...sBtn("pink"), fontSize: 12, padding: "8px 14px", flex: 1, background: "#7B5EA7" }}>
                            🎁 Récompenser
                          </button>
                        )}
                        {!c.recompense_versee && c.statut !== "refuse" && (
                          <button onClick={() => showConfirm("Refuser ?", () => cooptationRefuse(c.id).then(reloadCoopt).then(() => addToast_admin("Cooptation refusée")).catch(() => addToast_admin(t('toast.error'))))} style={{ ...sBtn("outline"), fontSize: 12, padding: "8px 14px", color: C.red, borderColor: C.red }}>
                            Refuser
                          </button>
                        )}
                        <button onClick={() => { setCooptPanelData({ ...c }); setCooptPanelMode("edit"); }} style={{ ...sBtn("outline"), fontSize: 12, padding: "8px 14px" }}>Modifier</button>
                      </div>

                      {/* Activity timeline */}
                      <div style={{ padding: "16px 22px", borderBottom: `1px solid ${C.border}` }}>
                        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 10 }}>
                          <div style={{ fontSize: 10, fontWeight: 700, color: C.textMuted, letterSpacing: .5, textTransform: "uppercase" }}>Historique &amp; activité</div>
                          <button onClick={() => inboxAddNote(c)} style={{ background: "none", border: `1px solid ${C.border}`, borderRadius: 6, padding: "3px 8px", fontSize: 10, fontWeight: 600, color: C.textLight, cursor: "pointer", fontFamily: font, display: "inline-flex", alignItems: "center", gap: 4 }}>
                            <Plus size={10} /> Note
                          </button>
                        </div>
                        {(() => {
                          const events = _buildTimeline(c);
                          if (events.length === 0) return <div style={{ fontSize: 11, color: C.textMuted, fontStyle: "italic" }}>Aucune activité</div>;
                          return (
                            <div style={{ position: "relative", paddingLeft: 20 }}>
                              {/* Vertical line */}
                              <div style={{ position: "absolute", left: 7, top: 6, bottom: 6, width: 1, background: C.border }} />
                              {events.map((ev, i) => (
                                <div key={i} style={{ position: "relative", marginBottom: i === events.length - 1 ? 0 : 12 }}>
                                  <div style={{ position: "absolute", left: -20, top: 0, width: 16, height: 16, borderRadius: "50%", background: ev.color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, border: `2px solid ${C.white}`, boxShadow: `0 0 0 1px ${C.border}` }}>{ev.icon}</div>
                                  <div style={{ fontSize: 12, fontWeight: 600, color: C.text, lineHeight: 1.3 }}>{ev.title}</div>
                                  {ev.subtitle && <div style={{ fontSize: 11, color: C.textLight, lineHeight: 1.4, marginTop: 2 }}>{ev.subtitle}</div>}
                                  <div style={{ fontSize: 10, color: C.textMuted, marginTop: 2 }}>{fmtDate(ev.date)}</div>
                                </div>
                              ))}
                            </div>
                          );
                        })()}
                      </div>

                      {/* Quick info: parrain, récompense, dates */}
                      <div style={{ padding: "16px 22px" }}>
                        <div style={{ marginBottom: 16 }}>
                          <div style={{ fontSize: 10, fontWeight: 700, color: C.textMuted, letterSpacing: .5, textTransform: "uppercase", marginBottom: 8 }}>Parrain</div>
                          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: 10, background: C.bg, borderRadius: 8 }}>
                            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#94a3b8", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>{refInitials}</div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: 12, fontWeight: 600, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.referrer_name || "—"}</div>
                              <div style={{ fontSize: 10, color: C.textMuted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.referrer_email || ""}</div>
                            </div>
                          </div>
                        </div>

                        <div style={{ marginBottom: 16 }}>
                          <div style={{ fontSize: 10, fontWeight: 700, color: C.textMuted, letterSpacing: .5, textTransform: "uppercase", marginBottom: 6 }}>Récompense</div>
                          <div style={{ fontSize: 22, fontWeight: 800, color: C.pink, fontFamily: fontDisplay }}>{fmtCurrency(Number(c.montant_recompense) || 0)}</div>
                          {c.description_recompense && <div style={{ fontSize: 11, color: C.textLight, marginTop: 2 }}>{c.description_recompense}</div>}
                        </div>

                        <div style={{ marginBottom: 16 }}>
                          <div style={{ fontSize: 10, fontWeight: 700, color: C.textMuted, letterSpacing: .5, textTransform: "uppercase", marginBottom: 6 }}>Dates clés</div>
                          <div style={{ fontSize: 12, color: C.text, lineHeight: 1.7 }}>
                            <div>Cooptée le <b>{fmtDate(c.date_cooptation)}</b></div>
                            {c.date_embauche && <div>Embauchée le <b>{fmtDate(c.date_embauche)}</b></div>}
                            {c.date_validation && <div>Validée le <b>{fmtDate(c.date_validation)}</b></div>}
                            {c.date_versement && <div>Récompensée le <b>{fmtDate(c.date_versement)}</b></div>}
                          </div>
                        </div>

                        {c.notes && (
                          <div style={{ marginBottom: 16 }}>
                            <div style={{ fontSize: 10, fontWeight: 700, color: C.textMuted, letterSpacing: .5, textTransform: "uppercase", marginBottom: 6 }}>Notes</div>
                            <div style={{ fontSize: 12, color: C.text, lineHeight: 1.5, padding: 10, background: C.bg, borderRadius: 8, whiteSpace: "pre-wrap" }}>{c.notes}</div>
                          </div>
                        )}

                        {c.priority_reason && (
                          <div style={{ padding: 10, background: C.pinkBg, borderRadius: 8, fontSize: 11, color: C.text, lineHeight: 1.5 }}>
                            <div style={{ fontWeight: 700, color: C.pink, marginBottom: 4, display: "flex", alignItems: "center", gap: 4 }}><Sparkles size={11} /> Insight IA · score {c.priority_score || "—"}</div>
                            {c.priority_reason}
                          </div>
                        )}
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
            {/* Keyboard shortcuts hint footer */}
            <div style={{ display: "flex", gap: 14, alignItems: "center", padding: "10px 16px", marginTop: 8, background: C.bg, borderRadius: 8, fontSize: 11, color: C.textMuted, flexWrap: "wrap" }}>
              <span style={{ fontWeight: 700, color: C.textLight, letterSpacing: .4, textTransform: "uppercase", fontSize: 10 }}>Raccourcis</span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><kbd style={{ fontSize: 10, padding: "1px 5px", borderRadius: 3, background: C.white, border: `1px solid ${C.border}`, fontFamily: font }}>↑↓</kbd> Naviguer</span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><kbd style={{ fontSize: 10, padding: "1px 5px", borderRadius: 3, background: C.white, border: `1px solid ${C.border}`, fontFamily: font }}>E</kbd> Avancer étape</span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><kbd style={{ fontSize: 10, padding: "1px 5px", borderRadius: 3, background: C.white, border: `1px solid ${C.border}`, fontFamily: font }}>R</kbd> Refuser</span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><kbd style={{ fontSize: 10, padding: "1px 5px", borderRadius: 3, background: C.white, border: `1px solid ${C.border}`, fontFamily: font }}>N</kbd> Ajouter une note</span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><kbd style={{ fontSize: 10, padding: "1px 5px", borderRadius: 3, background: C.white, border: `1px solid ${C.border}`, fontFamily: font }}>⌘K</kbd> Recherche</span>
            </div>
            </>
          );
        })()}

        {/* ═══ TAB: Cooptations ═══ */}
        {cooptTab === "cooptations" && (<>
          {/* Filters row */}
          <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16, flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: 4, padding: 3, background: C.bg, borderRadius: 8, width: "fit-content" }}>
            {([["all", `${t('coopt.all')} (${cooptations.length})`], ["en_attente", t('coopt.pending')], ["embauche", t('coopt.hired')], ["valide", t('coopt.validated')], ["recompense_versee", t('coopt.rewarded')], ["refuse", t('coopt.refused')]] as const).map(([key, label]) => (
              <button key={key} onClick={() => setCooptFilter(key as any)} style={{
                padding: "6px 14px", borderRadius: 6, fontSize: 11, fontWeight: cooptFilter === key ? 600 : 400, border: "none", cursor: "pointer", fontFamily: font,
                background: cooptFilter === key ? C.pink : "transparent", color: cooptFilter === key ? C.white : C.textMuted, transition: "all .15s",
              }}>{label}</button>
            ))}
          </div>
          {campaigns.length > 0 && (
            <select value={cooptCampaignFilter} onChange={e => setCooptCampaignFilter(e.target.value === "all" ? "all" : Number(e.target.value))} style={{ ...sInput, width: "auto", fontSize: 11, padding: "6px 10px" }}>
              <option value="all">{t('coopt.all_campaigns')}</option>
              {campaigns.map(c => <option key={c.id} value={c.id}>{c.titre}</option>)}
            </select>
          )}
          </div>

          {/* Table */}
          <div className="iz-card" style={{ ...sCard, overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1.5fr 0.8fr 1fr 1fr 0.8fr 0.5fr", gap: 0, padding: "10px 16px", background: C.bg, borderBottom: `1px solid ${C.border}`, fontSize: 11, fontWeight: 600, color: C.textLight, textTransform: "uppercase", letterSpacing: .3 }}>
              <span>{t('coopt.referrer')}</span><span>{t('coopt.candidate')}</span><span>{t('contrat.status')}</span><span>{t('coopt.reward')}</span><span>{t('coopt.probation')}</span><span>{t('coopt.position')}</span><span></span>
            </div>
            {filtered.length === 0 && <div style={{ padding: "40px 20px", textAlign: "center", color: C.textMuted, fontSize: 13 }}>{t('coopt.no_referrals')}</div>}
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
                  {c.recompense_versee && <div style={{ fontSize: 10, color: C.green }}>{t('coopt.paid_on')} {fmtDate(c.date_versement)}</div>}
                </div>
                <div>
                  {c.date_embauche ? (
                    <div>
                      <div style={{ fontSize: 12 }}>{c.mois_requis} {t('coopt.months_required')}</div>
                      {c.statut === "embauche" && c.jours_restants !== null && c.jours_restants > 0 ? (
                        <div style={{ fontSize: 10, color: C.blue }}>{c.jours_restants} {t('coopt.days_left')}</div>
                      ) : c.statut === "embauche" && c.is_validable ? (
                        <div style={{ fontSize: 10, color: C.green, fontWeight: 600 }}>{t('coopt.validable')}</div>
                      ) : c.date_validation ? (
                        <div style={{ fontSize: 10, color: C.textMuted }}>{t('coopt.end_date')} {fmtDate(c.date_validation)}</div>
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
                    <span>{camp.nombre_postes} {t('coopt.posts')}{camp.nombre_postes > 1 ? "s" : ""}</span>
                  </div>
                </div>
                <div style={{ padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", gap: 16, fontSize: 12 }}>
                    <div><span style={{ fontWeight: 600, color: C.text }}>{camp.type_recompense === "prime" ? `${fmtCurrency(camp.montant_recompense || 0)}` : camp.description_recompense || "Cadeau"}</span><br /><span style={{ fontSize: 10, color: C.textMuted }}>{t('coopt.reward')}</span></div>
                    <div><span style={{ fontWeight: 600, color: C.text }}>{camp.mois_requis} mois</span><br /><span style={{ fontSize: 10, color: C.textMuted }}>{t('coopt.probation')}</span></div>
                    <div><span style={{ fontWeight: 600, color: C.text }}>{camp.cooptations_count || 0}</span><br /><span style={{ fontSize: 10, color: C.textMuted }}>{t('coopt.applications')}</span></div>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={() => {
                      const shareUrl = `${window.location.origin}/cooptation/${camp.share_token}`;
                      navigator.clipboard.writeText(shareUrl).then(() => addToast_admin(t('emp.link_copied') || "Lien copié !")).catch(() => {
                        prompt(lang === "fr" ? "Copiez ce lien :" : "Copy this link:", shareUrl);
                      });
                    }} title={t('coopt.share')} className="iz-btn-outline" style={{ ...sBtn("outline"), padding: "6px 10px", fontSize: 11, display: "flex", alignItems: "center", gap: 4 }}><Link size={12} /> {t('coopt.share')}</button>
                    <button onClick={() => {
                      // Form options are 1.5/2/2.5/3/4/5 — clamp DB multiplier
                      // (default 1 when boost not active) to a valid option so the
                      // <select> has a matching value and the live preview is correct.
                      const dbMult = Number(camp.boost_multiplier);
                      const formMult = [1.5, 2, 2.5, 3, 4, 5].includes(dbMult) ? dbMult : 2;
                      setCampaignPanelData({ ...camp, date_limite: camp.date_limite || "", boost_active: !!camp.boost_active, boost_multiplier: formMult, boost_label: camp.boost_label || "Urgent · besoin critique", boost_until: camp.boost_until || "" });
                      setCampaignPanelMode("edit");
                    }} style={{ background: C.bg, border: "none", borderRadius: 6, padding: "6px 8px", cursor: "pointer" }}><FilePen size={14} color={C.textMuted} /></button>
                  </div>
                </div>
                {camp.date_limite && (
                  <div style={{ padding: "6px 20px 12px", fontSize: 10, color: new Date(camp.date_limite) < new Date() ? C.red : C.textMuted }}>
                    <Calendar size={10} style={{ verticalAlign: -1, marginRight: 4 }} />
                    {t('coopt.deadline')} {fmtDate(camp.date_limite)}
                  </div>
                )}
              </div>
              );
            })}
            {campaigns.length === 0 && <div style={{ gridColumn: "1/-1", padding: "40px 20px", textAlign: "center", color: C.textMuted, fontSize: 13 }}>{t('coopt.no_campaigns')}</div>}
          </div>
        )}

        {/* ═══ TAB: Classement ═══ */}
        {cooptTab === "classement" && (
          <div className="iz-card" style={{ ...sCard, overflow: "hidden" }}>
            <div style={{ padding: "16px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 10 }}>
              <Trophy size={18} color={C.amber} />
              <span style={{ fontSize: 15, fontWeight: 600 }}>{t('coopt.top_referrers')}</span>
              <span style={{ fontSize: 11, color: C.textMuted, marginLeft: "auto" }}>{t('coopt.points_desc')}</span>
            </div>
            {leaderboard.length === 0 && <div style={{ padding: "40px 20px", textAlign: "center", color: C.textMuted, fontSize: 13 }}>{t('coopt.no_points')}</div>}
            {leaderboard.map((entry, i) => {
              const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : null;
              const initials = entry.referrer_name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
              const colors = ["#E41076", "#1A73E8", "#4CAF50", "#7B5EA7", "#F9A825"];
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
              <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>{cooptPanelMode === "create" ? t('coopt.new') : t('coopt.edit')}</h2>
              <button onClick={() => setCooptPanelMode("closed")} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}><X size={18} /></button>
            </div>
            <div style={{ flex: 1, padding: 24, overflow: "auto", display: "flex", flexDirection: "column", gap: 14 }}>
              {(campaigns.length > 0 || cooptPanelData.campaign_id) && (
                <div><label style={{ fontSize: 11, color: C.textLight, marginBottom: 4, display: "block" }}>{t('coopt.associated_campaign')}</label>
                  <select value={cooptPanelData.campaign_id || ""} onChange={e => setCooptPanelData({ ...cooptPanelData, campaign_id: e.target.value ? Number(e.target.value) : null })} style={sInput}>
                    <option value="">{t('coopt.no_campaign')}</option>
                    {campaigns.map(c => <option key={c.id} value={c.id}>{c.titre} ({c.type_contrat}){c.statut !== "active" ? ` — ${c.statut}` : ""}</option>)}
                  </select>
                </div>
              )}
              <div style={{ fontSize: 13, fontWeight: 600, color: C.pink, marginBottom: -4 }}>{t('coopt.referrer_employee')}</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div><label style={{ fontSize: 11, color: C.textLight, marginBottom: 4, display: "block" }}>Nom</label><input value={cooptPanelData.referrer_name} onChange={e => setCooptPanelData({ ...cooptPanelData, referrer_name: e.target.value })} style={sInput} /></div>
                <div><label style={{ fontSize: 11, color: C.textLight, marginBottom: 4, display: "block" }}>Email</label><input value={cooptPanelData.referrer_email} onChange={e => setCooptPanelData({ ...cooptPanelData, referrer_email: e.target.value })} style={sInput} /></div>
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.pink, marginTop: 8, marginBottom: -4 }}>{t('coopt.referred_candidate')}</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div><label style={{ fontSize: 11, color: C.textLight, marginBottom: 4, display: "block" }}>Nom</label><input value={cooptPanelData.candidate_name} onChange={e => setCooptPanelData({ ...cooptPanelData, candidate_name: e.target.value })} style={sInput} /></div>
                <div><label style={{ fontSize: 11, color: C.textLight, marginBottom: 4, display: "block" }}>Email</label><input value={cooptPanelData.candidate_email} onChange={e => setCooptPanelData({ ...cooptPanelData, candidate_email: e.target.value })} style={sInput} /></div>
              </div>
              <div><label style={{ fontSize: 11, color: C.textLight, marginBottom: 4, display: "block" }}>{t('coopt.target_position')}</label><input value={cooptPanelData.candidate_poste || ""} onChange={e => setCooptPanelData({ ...cooptPanelData, candidate_poste: e.target.value })} style={sInput} /></div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div><label style={{ fontSize: 11, color: C.textLight, marginBottom: 4, display: "flex", alignItems: "center", gap: 4 }}><Phone size={10} /> {t('coopt.phone')}</label><input value={cooptPanelData.telephone || ""} onChange={e => setCooptPanelData({ ...cooptPanelData, telephone: e.target.value })} style={sInput} placeholder="+41 79 123 45 67" /></div>
                <div><label style={{ fontSize: 11, color: C.textLight, marginBottom: 4, display: "flex", alignItems: "center", gap: 4 }}><Linkedin size={10} /> LinkedIn</label><input value={cooptPanelData.linkedin_url || ""} onChange={e => setCooptPanelData({ ...cooptPanelData, linkedin_url: e.target.value })} style={sInput} placeholder="https://linkedin.com/in/..." /></div>
              </div>
              {/* CV Upload */}
              <div>
                <label style={{ fontSize: 11, color: C.textLight, marginBottom: 4, display: "flex", alignItems: "center", gap: 4 }}><Paperclip size={10} /> {t('coopt.cv_attachment')}</label>
                {cooptPanelData.cv_original_name ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", borderRadius: 8, background: C.greenLight, fontSize: 12 }}>
                    <FileText size={14} color={C.green} />
                    <span style={{ flex: 1, color: C.text, fontWeight: 500 }}>{cooptPanelData.cv_original_name}</span>
                    <button type="button" onClick={() => setCooptPanelData({ ...cooptPanelData, cv_path: null, cv_original_name: null })} style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}><X size={12} color={C.red} /></button>
                  </div>
                ) : (
                  <label style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", borderRadius: 8, border: `1px dashed ${C.border}`, cursor: "pointer", fontSize: 12, color: C.textLight, transition: "all .15s" }}>
                    <Upload size={14} /> {t('coopt.drop_cv')}
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
              <div style={{ fontSize: 13, fontWeight: 600, color: C.pink, marginTop: 8, marginBottom: -4 }}>{t('coopt.reward')}</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                <div><label style={{ fontSize: 11, color: C.textLight, marginBottom: 4, display: "block" }}>{t('coopt.reward_type')}</label>
                  <select value={cooptPanelData.type_recompense} onChange={e => setCooptPanelData({ ...cooptPanelData, type_recompense: e.target.value })} style={sInput}>
                    <option value="prime">Prime (CHF)</option>
                    <option value="cadeau">Cadeau</option>
                  </select>
                </div>
                {cooptPanelData.type_recompense === "prime" ? (
                  <div><label style={{ fontSize: 11, color: C.textLight, marginBottom: 4, display: "block" }}>{t('coopt.amount')}</label><input type="number" value={cooptPanelData.montant_recompense || ""} onChange={e => setCooptPanelData({ ...cooptPanelData, montant_recompense: Number(e.target.value) })} style={sInput} /></div>
                ) : (
                  <div><label style={{ fontSize: 11, color: C.textLight, marginBottom: 4, display: "block" }}>Description</label><input value={cooptPanelData.description_recompense || ""} onChange={e => setCooptPanelData({ ...cooptPanelData, description_recompense: e.target.value })} style={sInput} placeholder="Ex: carte cadeau, journée spa..." /></div>
                )}
                <div><label style={{ fontSize: 11, color: C.textLight, marginBottom: 4, display: "block" }}>{t('coopt.months_req')}</label><input type="number" value={cooptPanelData.mois_requis} onChange={e => setCooptPanelData({ ...cooptPanelData, mois_requis: Number(e.target.value) })} style={sInput} /></div>
              </div>
              <div><label style={{ fontSize: 11, color: C.textLight, marginBottom: 4, display: "block" }}>{t('coopt.notes')}</label><textarea value={cooptPanelData.notes || ""} onChange={e => setCooptPanelData({ ...cooptPanelData, notes: e.target.value })} style={{ ...sInput, minHeight: 80, resize: "vertical" }} /></div>
              {cooptPanelMode === "edit" && cooptPanelData.id && (
                <div>
                  <label style={{ fontSize: 11, color: C.textLight, marginBottom: 4, display: "block" }}>Statut</label>
                  <select value={cooptPanelData.statut || "en_attente"} onChange={async e => {
                    const newStatut = e.target.value;
                    const oldStatut = cooptPanelData.statut;
                    if (newStatut === oldStatut && !(newStatut === "recompense_versee" && !cooptPanelData.recompense_versee)) return;
                    try {
                      if (newStatut === "embauche") {
                        if (!cooptPanelData.date_embauche) {
                          showPrompt("Date d'embauche", (d: string) => {
                            if (d) cooptationMarkHired(cooptPanelData.id, { date_embauche: d }).then(reloadCoopt).then((res: any) => { setCooptPanelData((p: any) => ({ ...p, statut: "embauche", date_embauche: d, ...(res || {}) })); addToast_admin("Cooptation marquée embauchée"); }).catch(() => addToast_admin(t('toast.error')));
                          }, { label: "Date d'embauche", type: "date" });
                          return;
                        }
                        await apiUpdateCooptation(cooptPanelData.id, { statut: "embauche" });
                      } else if (newStatut === "valide") {
                        await cooptationValidate(cooptPanelData.id);
                      } else if (newStatut === "recompense_versee") {
                        await cooptationMarkRewarded(cooptPanelData.id);
                      } else if (newStatut === "refuse") {
                        await cooptationRefuse(cooptPanelData.id);
                      } else {
                        await apiUpdateCooptation(cooptPanelData.id, { statut: newStatut });
                      }
                      setCooptPanelData({ ...cooptPanelData, statut: newStatut, recompense_versee: newStatut === "recompense_versee" ? true : cooptPanelData.recompense_versee });
                      reloadCoopt();
                      addToast_admin("Statut mis à jour");
                    } catch { addToast_admin(t('toast.error') || "Erreur lors du changement de statut"); }
                  }} style={sInput}>
                    <option value="en_attente">{t('coopt.pending') || "En attente"}</option>
                    <option value="embauche">{t('coopt.hired') || "Embauché"}</option>
                    <option value="valide">{t('coopt.validated') || "Validé"}</option>
                    <option value="recompense_versee">{t('coopt.rewarded') || "Récompensé"}</option>
                    <option value="refuse">{t('coopt.refused') || "Refusé"}</option>
                  </select>
                  <div style={{ fontSize: 10, color: C.textMuted, marginTop: 4, fontStyle: "italic" }}>Le statut est appliqué immédiatement (pas besoin d'enregistrer).</div>
                </div>
              )}
            </div>
            <div style={{ padding: "16px 24px", borderTop: `1px solid ${C.border}`, display: "flex", gap: 8, justifyContent: "flex-end" }}>
              {cooptPanelMode === "edit" && cooptPanelData.id && (
                <button onClick={() => { showConfirm("Supprimer cette cooptation ?", () => { apiDeleteCooptation(cooptPanelData.id).then(reloadCoopt).catch(() => {}); setCooptPanelMode("closed"); }) }} style={{ ...sBtn("outline"), color: C.red, borderColor: C.red, marginRight: "auto" }}>{t('common.delete')}</button>
              )}
              <button onClick={() => setCooptPanelMode("closed")} className="iz-btn-outline" style={sBtn("outline")}>{t('common.cancel')}</button>
              <button onClick={async () => {
                try {
                  const payload = { referrer_name: cooptPanelData.referrer_name, referrer_email: cooptPanelData.referrer_email, candidate_name: cooptPanelData.candidate_name, candidate_email: cooptPanelData.candidate_email, candidate_poste: cooptPanelData.candidate_poste, linkedin_url: cooptPanelData.linkedin_url || null, telephone: cooptPanelData.telephone || null, type_recompense: cooptPanelData.type_recompense, montant_recompense: cooptPanelData.type_recompense === "prime" ? cooptPanelData.montant_recompense : null, description_recompense: cooptPanelData.type_recompense === "cadeau" ? cooptPanelData.description_recompense : null, mois_requis: cooptPanelData.mois_requis, notes: cooptPanelData.notes, campaign_id: cooptPanelData.campaign_id || null, date_cooptation: cooptPanelData.date_cooptation || new Date().toISOString().slice(0, 10) };
                  // Empêcher les doublons : un même candidate_email ne peut être coopté qu'une fois (sauf si la précédente a été refusée).
                  const emailNormalized = (payload.candidate_email || "").trim().toLowerCase();
                  if (emailNormalized) {
                    const duplicate = cooptations.find(c => (c.candidate_email || "").trim().toLowerCase() === emailNormalized && c.statut !== "refuse" && (cooptPanelMode !== "edit" || c.id !== cooptPanelData.id));
                    if (duplicate) {
                      addToast_admin(`Ce candidat est déjà coopté (par ${duplicate.referrer_name || "—"})`);
                      return;
                    }
                  }
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
                <div><label style={{ fontSize: 11, color: C.textLight, marginBottom: 4, display: "block" }}>{t('coopt.months_req')}</label><input type="number" value={campaignPanelData.mois_requis} onChange={e => setCampaignPanelData({ ...campaignPanelData, mois_requis: Number(e.target.value) })} style={sInput} /></div>
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

              {/* ── Boost section ── */}
              <div style={{ marginTop: 8, padding: "14px 16px", borderRadius: 12, background: campaignPanelData.boost_active ? `linear-gradient(135deg, #2D1B3D 0%, #4a2a5a 100%)` : C.bg, color: campaignPanelData.boost_active ? "#fff" : C.text, transition: "all .2s" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: campaignPanelData.boost_active ? 12 : 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: campaignPanelData.boost_active ? "rgba(255,255,255,.18)" : C.pinkLight, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Rocket size={16} color={campaignPanelData.boost_active ? "#fff" : C.pink} />
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>Booster cette cooptation</div>
                      <div style={{ fontSize: 11, opacity: .7 }}>Multiplier la récompense pendant une période limitée</div>
                    </div>
                  </div>
                  <button type="button" onClick={() => {
                    const turningOn = !campaignPanelData.boost_active;
                    const currentMult = Number(campaignPanelData.boost_multiplier);
                    const validMult = [1.5, 2, 2.5, 3, 4, 5].includes(currentMult) ? currentMult : 2;
                    setCampaignPanelData({ ...campaignPanelData, boost_active: turningOn, boost_multiplier: validMult });
                  }}
                    style={{ position: "relative", width: 40, height: 22, borderRadius: 11, border: "none", cursor: "pointer", padding: 0,
                      background: campaignPanelData.boost_active ? C.pink : "rgba(0,0,0,.15)", transition: "background .15s" }}>
                    <span style={{ position: "absolute", top: 2, left: campaignPanelData.boost_active ? 20 : 2, width: 18, height: 18, borderRadius: "50%", background: "#fff", transition: "left .15s" }} />
                  </button>
                </div>
                {campaignPanelData.boost_active && (
                  <div className="iz-fade-in" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
                    <div>
                      <label style={{ fontSize: 10, color: "rgba(255,255,255,.7)", textTransform: "uppercase", letterSpacing: .5, fontWeight: 600, marginBottom: 6, display: "block" }}>Multiplicateur</label>
                      <select value={campaignPanelData.boost_multiplier || 2} onChange={e => setCampaignPanelData({ ...campaignPanelData, boost_multiplier: Number(e.target.value) })}
                        style={{ ...sInput, background: "rgba(255,255,255,.12)", border: "1px solid rgba(255,255,255,.25)", color: "#fff" }}>
                        {[1.5, 2, 2.5, 3, 4, 5].map(n => <option key={n} value={n} style={{ color: C.text }}>×{n}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: 10, color: "rgba(255,255,255,.7)", textTransform: "uppercase", letterSpacing: .5, fontWeight: 600, marginBottom: 6, display: "block" }}>Jusqu'au</label>
                      <input type="date" value={campaignPanelData.boost_until || ""} onChange={e => setCampaignPanelData({ ...campaignPanelData, boost_until: e.target.value })}
                        style={{ ...sInput, background: "rgba(255,255,255,.12)", border: "1px solid rgba(255,255,255,.25)", color: "#fff", colorScheme: "dark" }} />
                    </div>
                    <div style={{ gridColumn: "1 / -1" }}>
                      <label style={{ fontSize: 10, color: "rgba(255,255,255,.7)", textTransform: "uppercase", letterSpacing: .5, fontWeight: 600, marginBottom: 6, display: "block" }}>Libellé du boost</label>
                      <input value={campaignPanelData.boost_label || ""} onChange={e => setCampaignPanelData({ ...campaignPanelData, boost_label: e.target.value })}
                        placeholder="Urgent · besoin critique"
                        style={{ ...sInput, background: "rgba(255,255,255,.12)", border: "1px solid rgba(255,255,255,.25)", color: "#fff" }} />
                    </div>
                    <div style={{ gridColumn: "1 / -1", padding: "10px 12px", borderRadius: 8, background: "rgba(255,255,255,.08)", fontSize: 12, lineHeight: 1.5 }}>
                      Récompense affichée : <strong style={{ color: "#fff" }}>{fmtCurrency((Number(campaignPanelData.montant_recompense) || 0) * (Number(campaignPanelData.boost_multiplier) || 1))}</strong>
                      <span style={{ opacity: .65 }}> au lieu de {fmtCurrency(Number(campaignPanelData.montant_recompense) || 0)}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div style={{ padding: "16px 24px", borderTop: `1px solid ${C.border}`, display: "flex", gap: 8, justifyContent: "flex-end" }}>
              {campaignPanelMode === "edit" && campaignPanelData.id && (
                <button onClick={() => { showConfirm("Supprimer cette campagne ?", () => { apiDeleteCampaign(campaignPanelData.id).then(reloadCampaigns).catch(() => {}); setCampaignPanelMode("closed"); }) }} style={{ ...sBtn("outline"), color: C.red, borderColor: C.red, marginRight: "auto" }}>{t('common.delete')}</button>
              )}
              <button onClick={() => setCampaignPanelMode("closed")} className="iz-btn-outline" style={sBtn("outline")}>{t('common.cancel')}</button>
              <button onClick={async () => {
                try {
                  const payload = { titre: campaignPanelData.titre, description: campaignPanelData.description, departement: campaignPanelData.departement, site: campaignPanelData.site, type_contrat: campaignPanelData.type_contrat, type_recompense: campaignPanelData.type_recompense, montant_recompense: campaignPanelData.type_recompense === "prime" ? campaignPanelData.montant_recompense : null, description_recompense: campaignPanelData.type_recompense === "cadeau" ? campaignPanelData.description_recompense : null, mois_requis: campaignPanelData.mois_requis, nombre_postes: campaignPanelData.nombre_postes, priorite: campaignPanelData.priorite, date_limite: campaignPanelData.date_limite || null, boost_active: !!campaignPanelData.boost_active, boost_multiplier: campaignPanelData.boost_active ? (Number(campaignPanelData.boost_multiplier) || 2) : 1, boost_label: campaignPanelData.boost_active ? (campaignPanelData.boost_label || null) : null, boost_until: campaignPanelData.boost_active ? (campaignPanelData.boost_until || null) : null, ...(campaignPanelMode === "edit" ? { statut: campaignPanelData.statut } : {}) };
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
              <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>{t('coopt.settings_title')}</h2>
              <button onClick={() => setCooptSettingsOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}><X size={18} /></button>
            </div>
            <div style={{ flex: 1, padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ padding: 16, background: C.pinkBg, borderRadius: 10, fontSize: 12, color: C.pink }}>
                <Handshake size={16} style={{ marginRight: 6, verticalAlign: -3 }} />
                {t('coopt.settings_hint')}
              </div>
              <div><label style={{ fontSize: 11, color: C.textLight, marginBottom: 4, display: "block" }}>{t('coopt.default_months')}</label><input type="number" value={cooptSettings?.mois_requis_defaut || 6} onChange={e => setCooptSettings(s => s ? { ...s, mois_requis_defaut: Number(e.target.value) } : s)} style={sInput} /></div>
              <div><label style={{ fontSize: 11, color: C.textLight, marginBottom: 4, display: "block" }}>{t('coopt.default_reward_type')}</label>
                <select value={cooptSettings?.type_recompense_defaut || "prime"} onChange={e => setCooptSettings(s => s ? { ...s, type_recompense_defaut: e.target.value as any } : s)} style={sInput}>
                  <option value="prime">Prime (CHF)</option>
                  <option value="cadeau">Cadeau</option>
                </select>
              </div>
              <div><label style={{ fontSize: 11, color: C.textLight, marginBottom: 4, display: "block" }}>{t('coopt.default_amount')}</label><input type="number" value={cooptSettings?.montant_defaut || 500} onChange={e => setCooptSettings(s => s ? { ...s, montant_defaut: Number(e.target.value) } : s)} style={sInput} /></div>
              <div><label style={{ fontSize: 11, color: C.textLight, marginBottom: 4, display: "block" }}>{t('coopt.default_gift_desc')}</label><input value={cooptSettings?.description_recompense_defaut || ""} onChange={e => setCooptSettings(s => s ? { ...s, description_recompense_defaut: e.target.value } : s)} style={sInput} placeholder="Ex: Carte cadeau Manor 200 CHF" /></div>
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



  return {
    renderCooptation,
  };
}
