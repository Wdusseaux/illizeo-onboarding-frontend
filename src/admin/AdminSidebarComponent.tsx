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
import { ANIM_STYLES, C, hexToRgb, colorWithAlpha, lighten, REGION_LOCALE, REGION_CURRENCY, getLocaleSettings, fmtDate, fmtDateShort, fmtTime, fmtDateTime, fmtDateTimeShort, fmtCurrency, font, ILLIZEO_LOGO_URI, ILLIZEO_FULL_LOGO_URI, getLogoUri, getLogoFullUri, IllizeoLogoFull, IllizeoLogo, IllizeoLogoBrand, PreboardSidebar, sCard, sBtn, sInput, isDarkMode, applyDarkMode } from '../constants';
import type { OnboardingStep, DashboardPage, DashboardTab, UserRole, AdminPage, AdminModal, Collaborateur, ParcoursCategorie, ParcourTemplate, ActionTemplate, ActionType, AssignTarget, GroupePersonnes, DocCategory, WorkflowRule, EmailTemplate, TeamMember } from '../types';
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
 * Sidebar + Super Admin render functions.
 */
export function createAdminSidebarComponent(ctx: any) {
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
    hasPermission, isSuperAdmin,
    userPanelMode, setUserPanelMode, userPanelData, setUserPanelData, userPanelLoading, setUserPanelLoading, userSearch, setUserSearch,
    userRoleFilter, setUserRoleFilter, gedTab, setGedTab, gedSearch, setGedSearch, gedCatFilter, setGedCatFilter,
    tplPanelOpen, setTplPanelOpen, tplPanelDoc, setTplPanelDoc, selectedDocsForValidation, setSelectedDocsForValidation, realDocs, setRealDocs,
    emailConfig, setEmailConfig, tplCatFilter, setTplCatFilter, tplPreview, setTplPreview, themeColor, setThemeColor,
    region, setRegion, dateFormat, setDateFormat, timeFormat, setTimeFormat, timezone, setTimezone,
    customLogo, setCustomLogo, customLogoFull, setCustomLogoFull, loginBgImage, setLoginBgImage, customFavicon, setCustomFavicon,
    cooptations, setCooptations, cooptStats, setCooptStats, cooptSettings, setCooptSettings, cooptFilter, setCooptFilter,
    cooptCampaignFilter, setCooptCampaignFilter, cooptPanelMode, setCooptPanelMode, cooptPanelData, setCooptPanelData, cooptSettingsOpen, setCooptSettingsOpen,
    cooptTab, setCooptTab, campaigns, setCampaigns, leaderboard, setLeaderboard, campaignPanelMode, setCampaignPanelMode,
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
      admin_feedback_hub: "nps",
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
      { section: t('admin.dashboard_title'), items: [
        { id: "admin_dashboard" as AdminPage, label: t('sidebar.dashboard'), icon: LayoutDashboard },
        { id: "admin_assistant_ia" as AdminPage, label: "Assistant IA", icon: Sparkles },
      ] },
      { section: t('admin.management'), items: [
        { id: "admin_parcours" as AdminPage, label: t('admin.parcours_actions'), icon: Route },
        { id: "admin_suivi" as AdminPage, label: t('admin.collaborateur_tracking'), icon: Users },
        { id: "admin_manager_view" as AdminPage, label: "Vue Manager", icon: UserCheck },
        { id: "admin_documents" as AdminPage, label: t('admin.documents'), icon: FileText },
        { id: "admin_equipes" as AdminPage, label: t('admin.teams_groups'), icon: Users },
        { id: "admin_messagerie" as AdminPage, label: t('admin.messaging'), icon: MessageCircle },
        { id: "admin_calendar" as AdminPage, label: t('calendar.title'), icon: CalendarDays },
        { id: "admin_buddy" as AdminPage, label: t('buddy.title'), icon: Handshake },
      ]},
      { section: t('admin.automation'), items: [
        { id: "admin_workflows" as AdminPage, label: t('admin.workflows'), icon: Zap },
        { id: "admin_templates" as AdminPage, label: t('admin.email_templates'), icon: Mail },
        { id: "admin_notifications" as AdminPage, label: t('admin.notifications'), icon: Bell },
      ]},
      { section: t('admin.content'), items: [
        { id: "admin_entreprise" as AdminPage, label: t('admin.company_page'), icon: Building2 },
        { id: "admin_quotes" as AdminPage, label: "Citations du jour", icon: BookOpen },
        { id: "admin_recurring_meetings" as AdminPage, label: "RDV récurrents", icon: CalendarClock },
        { id: "admin_equipements" as AdminPage, label: t('admin.equipment'), icon: Laptop },
        { id: "admin_nps" as AdminPage, label: t('admin.nps'), icon: Star },
        { id: "admin_feedback_hub" as AdminPage, label: "Feedback collaborateurs", icon: MessageSquare },
        { id: "admin_contrats" as AdminPage, label: t('admin.contracts_signatures'), icon: FileSignature },
        { id: "admin_cooptation" as AdminPage, label: t('admin.cooptation'), icon: Handshake },
        { id: "admin_gamification" as AdminPage, label: t('admin.gamification'), icon: Trophy },
        { id: "admin_integrations" as AdminPage, label: t('admin.integrations'), icon: Link },
        { id: "admin_provisioning" as AdminPage, label: t('prov.title'), icon: Download },
      ]},
      { section: t('admin.settings'), items: [
        { id: "admin_audit" as AdminPage, label: t('audit.title'), icon: ClipboardCheck },
        { id: "admin_users" as AdminPage, label: t('admin.users_roles'), icon: ShieldCheck },
        { id: "admin_roles" as AdminPage, label: t('roles.title'), icon: Crown },
        { id: "admin_fields" as AdminPage, label: t('admin.collab_fields'), icon: ClipboardList },
        { id: "admin_apparence" as AdminPage, label: t('admin.appearance'), icon: Palette },
        { id: "admin_password_policy" as AdminPage, label: lang === "fr" ? "Sécurité" : "Security", icon: ShieldCheck },
        { id: "admin_donnees" as AdminPage, label: t('admin.data_rgpd'), icon: DatabaseBackup },
        ...(!isEditorTenant ? [{ id: "admin_abonnement" as AdminPage, label: t('admin.subscription'), icon: CircleDollarSign }] : []),
      ]},
    ];
  
    // ─── DASHBOARD ─────────────────────────────────────────────


    const sidebarW = sidebarCollapsed ? 64 : 220;
    const collapsed = sidebarCollapsed;

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
                const _locked = !isEditorTenant && !isInTrial && !hasActiveSub;
                const isExempt = item.id === "admin_abonnement" || item.id === "admin_donnees";
                const accessible = isExempt || (!_locked && isPageAccessible(item.id));
                // Hide non-accessible module pages (don't hide when globally locked — those show as locked)
                if (!accessible && !_locked) return null;
                return (
                  <button key={item.id} onClick={() => {
                    if (_locked && !isExempt) {
                      setAdminPage("admin_abonnement" as any); setSubView("change");
                      addToast_admin("Veuillez souscrire un plan pour accéder à cette fonctionnalité.");
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
            <button onClick={() => { setSuperAdminMode(true); setSaDashData(null); setSaPlans([]); setSaTenants([]); setSaSubscriptions([]); setSaLoaded(false); }} title={t('role.super_admin')} className="iz-sidebar-item" style={{
              display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "flex-start", gap: 10,
              width: "100%", padding: collapsed ? "10px 0" : "8px 10px", borderRadius: 8, border: "none",
              background: "transparent", color: C.amber, cursor: "pointer", fontFamily: font, fontSize: 13, transition: "all .15s",
            }}>
              <Crown size={18} />
              {!collapsed && <span>{t('role.super_admin')}</span>}
            </button>
          )}
          {/* Settings shortcut — hidden for now */}
        </div>
        {/* User avatar + menu */}
        <div style={{ borderTop: `1px solid ${C.border}`, padding: collapsed ? "12px 0" : "10px 12px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "flex-start", gap: 10 }}>
            <div onClick={() => { if (collapsed) setSidebarCollapsed(false); }} style={{ width: 34, height: 34, borderRadius: "50%", background: `linear-gradient(135deg, ${C.pinkSoft}, ${C.pink})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600, color: C.white, cursor: "pointer", flexShrink: 0 }}>
              {auth.user?.name?.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() || "?"}
            </div>
            {!collapsed && (
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: C.dark, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{auth.user?.name || "Admin"}</div>
              </div>
            )}
          </div>
          {/* Langue / Mon 2FA / Déconnexion ont été déplacés dans le dropdown
              avatar du topbar admin (cohérent avec le portail employé). */}
        </div>
      </div>
    );

  


  // ─── SUPER ADMIN PANEL ──────────────────────────────────
  const renderSuperAdminPanel = () => {
    const loadSA = () => {
      superAdminDashboard().then(setSaDashData).catch(e => { console.error("SA dashboard error:", e); setSaDashData({ total_tenants: 0, active_subscriptions: 0, mrr_eur: 0, mrr_chf: 0, total_collaborateurs: 0 }); });
      superAdminListTenants().then(setSaTenants).catch(() => setSaTenants([]));
      superAdminListPlans().then(data => { console.log('SA plans loaded:', data?.length); setSaPlans(data || []); }).catch(e => { console.error('SA plans error:', e); setSaPlans([]); });
      superAdminListSubscriptions().then(setSaSubscriptions).catch(() => setSaSubscriptions([]));
      superAdminGetStripeConfig().then(setSaStripe).catch(() => setSaStripe({ has_key: false, has_secret: false, has_webhook: false }));
    };
    if (!saLoaded) { setSaLoaded(true); loadSA(); }
    return (
      <div style={{ display: "flex", minHeight: "100vh", fontFamily: font, background: C.white, color: C.text }}>
        <style dangerouslySetInnerHTML={{ __html: ANIM_STYLES }} />
        <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;1,9..40,400&display=swap" rel="stylesheet" />
        {/* Sidebar */}
        <div style={{ width: 220, minHeight: "100vh", background: C.dark, display: "flex", flexDirection: "column", flexShrink: 0 }}>
          <div style={{ padding: "20px 16px", color: C.white, fontSize: 16, fontWeight: 700 }}>{t('role.super_admin')}</div>
          {([
            { id: "dashboard" as const, label: t('sidebar.dashboard'), icon: LayoutDashboard },
            { id: "tenants" as const, label: t('sa.clients'), icon: Building2 },
            { id: "plans" as const, label: t('sa.plans_modules'), icon: Package },
            { id: "subscriptions" as const, label: t('sa.subscriptions'), icon: FileSignature },
            { id: "stripe" as const, label: "Stripe", icon: CircleDollarSign },
            { id: "ai" as const, label: "IA & Claude", icon: Sparkles },
            { id: "ai_protection" as const, label: "Protection IA", icon: ShieldCheck },
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
                {saTenants.map(tn => (
                  <div key={tn.id} onClick={() => { ctx._saSelectedTenant = tn; ctx._saSelectedTenantDetail = null; apiFetch(`/super-admin/tenants/${tn.id}`).then((d: any) => { ctx._saSelectedTenantDetail = d; loadSA(); }).catch(() => {}); loadSA(); }}
                    style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 0.8fr 0.5fr", gap: 0, padding: "12px 16px", borderBottom: `1px solid ${C.border}`, alignItems: "center", fontSize: 13, cursor: "pointer", transition: "background .1s" }}
                    onMouseEnter={e => e.currentTarget.style.background = C.bg} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <div><div style={{ fontWeight: 600 }}>{tn.nom || tn.id}</div><div style={{ fontSize: 11, color: C.textMuted }}>{tn.id}.illizeo.com</div></div>
                    <div style={{ fontSize: 12 }}>{tn.plan || "—"}</div>
                    <div style={{ fontSize: 12, color: C.textLight }}>{tn.billing_email || "—"}</div>
                    <span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 600, background: tn.actif ? C.greenLight : C.redLight, color: tn.actif ? C.green : C.red }}>{tn.actif ? "Actif" : "Inactif"}</span>
                    <button onClick={(e) => { e.stopPropagation(); showConfirm(`Supprimer le tenant ${tn.id} et toutes ses données ?`, async () => { try { await superAdminDeleteTenant(tn.id); loadSA(); addToast_admin("Tenant supprimé"); } catch { addToast_admin("Erreur"); } }); }} style={{ background: C.redLight, border: "none", borderRadius: 6, padding: 4, cursor: "pointer" }}><Trash size={14} color={C.red} /></button>
                  </div>
                ))}
              </div>

              {/* ── Tenant Detail Panel ── */}
              {ctx._saSelectedTenant && (() => {
                const tn = ctx._saSelectedTenant;
                const detail = ctx._saSelectedTenantDetail;
                const aiUsage = (ctx.saAiTenantUsage || []).find((u: any) => u.tenant_id === tn.id);
                return (
                  <>
                    <div onClick={() => { ctx._saSelectedTenant = null; loadSA(); }} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.3)", zIndex: 1000 }} />
                    <div className="iz-panel" style={{ position: "fixed", top: 0, right: 0, width: 640, height: "100vh", background: C.white, boxShadow: "-4px 0 24px rgba(0,0,0,.1)", zIndex: 1001, display: "flex", flexDirection: "column" }}>
                      <div style={{ padding: "20px 24px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div>
                          <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>{tn.nom || tn.id}</h2>
                          <div style={{ fontSize: 12, color: C.textMuted }}>{tn.id}.illizeo.com</div>
                        </div>
                        <button onClick={() => { ctx._saSelectedTenant = null; loadSA(); }} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={18} /></button>
                      </div>
                      <div style={{ flex: 1, padding: 24, overflow: "auto" }}>

                        {/* Info cards */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 20 }}>
                          <div style={{ padding: "14px 16px", borderRadius: 10, background: C.bg }}>
                            <div style={{ fontSize: 10, color: C.textMuted, marginBottom: 4 }}>Plan</div>
                            <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{tn.plan || "—"}</div>
                          </div>
                          <div style={{ padding: "14px 16px", borderRadius: 10, background: tn.actif ? C.greenLight : C.redLight }}>
                            <div style={{ fontSize: 10, color: tn.actif ? C.green : C.red, marginBottom: 4 }}>Statut</div>
                            <div style={{ fontSize: 14, fontWeight: 600, color: tn.actif ? C.green : C.red }}>{tn.actif ? "Actif" : "Inactif"}</div>
                          </div>
                          <div style={{ padding: "14px 16px", borderRadius: 10, background: C.blueLight }}>
                            <div style={{ fontSize: 10, color: C.blue, marginBottom: 4 }}>Collaborateurs</div>
                            <div style={{ fontSize: 14, fontWeight: 600, color: C.blue }}>{tn.nombre_collaborateurs || 0}</div>
                          </div>
                        </div>

                        {/* Subscription details */}
                        <div className="iz-card" style={{ ...sCard, marginBottom: 16 }}>
                          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Abonnement</h3>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 12 }}>
                            <div><span style={{ color: C.textMuted }}>Email facturation :</span> <b>{tn.billing_email || "—"}</b></div>
                            <div><span style={{ color: C.textMuted }}>Statut :</span> <b>{tn.subscription_status || "—"}</b></div>
                            <div><span style={{ color: C.textMuted }}>Créé le :</span> <b>{tn.created_at ? fmtDate(tn.created_at) : "—"}</b></div>
                            {detail?.subscription && <div><span style={{ color: C.textMuted }}>Période :</span> <b>{fmtDate(detail.subscription.current_period_start)} → {fmtDate(detail.subscription.current_period_end)}</b></div>}
                          </div>
                        </div>

                        {/* AI Usage */}
                        {aiUsage && (
                          <div className="iz-card" style={{ ...sCard, marginBottom: 16 }}>
                            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}><Sparkles size={14} color={C.blue} /> Consommation IA</h3>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 12 }}>
                              <div style={{ textAlign: "center", padding: "10px", borderRadius: 8, background: C.bg }}>
                                <div style={{ fontSize: 18, fontWeight: 700, color: C.blue }}>{aiUsage.ocr_scans}</div>
                                <div style={{ fontSize: 10, color: C.textMuted }}>OCR</div>
                              </div>
                              <div style={{ textAlign: "center", padding: "10px", borderRadius: 8, background: C.bg }}>
                                <div style={{ fontSize: 18, fontWeight: 700, color: "#7B5EA7" }}>{aiUsage.bot_messages}</div>
                                <div style={{ fontSize: 10, color: C.textMuted }}>Messages IA</div>
                              </div>
                              <div style={{ textAlign: "center", padding: "10px", borderRadius: 8, background: C.bg }}>
                                <div style={{ fontSize: 18, fontWeight: 700, color: C.pink }}>{aiUsage.contrat_generations}</div>
                                <div style={{ fontSize: 10, color: C.textMuted }}>Contrats IA</div>
                              </div>
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                              <div style={{ padding: "8px 12px", borderRadius: 8, background: C.bg, fontSize: 12 }}>
                                <div style={{ color: C.textMuted, fontSize: 10 }}>Coût Claude</div>
                                <div style={{ fontWeight: 600 }}>{aiUsage.cost_chf?.toFixed(2)} CHF</div>
                              </div>
                              <div style={{ padding: "8px 12px", borderRadius: 8, background: C.greenLight, fontSize: 12 }}>
                                <div style={{ color: C.green, fontSize: 10 }}>Facturé (x2)</div>
                                <div style={{ fontWeight: 600, color: C.green }}>{aiUsage.billed_chf?.toFixed(2)} CHF</div>
                              </div>
                              <div style={{ padding: "8px 12px", borderRadius: 8, background: "#E8F5E9", fontSize: 12 }}>
                                <div style={{ color: "#2E7D32", fontSize: 10 }}>Marge</div>
                                <div style={{ fontWeight: 600, color: "#2E7D32" }}>{aiUsage.margin_chf?.toFixed(2)} CHF</div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Invoices */}
                        {detail?.invoices && detail.invoices.length > 0 && (
                          <div className="iz-card" style={{ ...sCard }}>
                            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Factures ({detail.invoices.length})</h3>
                            {detail.invoices.slice(0, 10).map((inv: any) => (
                              <div key={inv.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${C.border}`, fontSize: 12 }}>
                                <span>{inv.numero || `#${inv.id}`}</span>
                                <span style={{ color: C.textMuted }}>{fmtDate(inv.date || inv.created_at)}</span>
                                <span style={{ fontWeight: 600 }}>{inv.montant_chf || inv.montant || 0} CHF</span>
                                <span style={{ padding: "2px 6px", borderRadius: 4, fontSize: 9, fontWeight: 600, background: inv.statut === "payee" ? C.greenLight : C.amberLight, color: inv.statut === "payee" ? C.green : C.amber }}>{inv.statut || "—"}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                );
              })()}
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

              {/* ── Section Plans ── */}
              <h2 style={{ fontSize: 16, fontWeight: 600, margin: "0 0 12px", display: "flex", alignItems: "center", gap: 8 }}><Package size={18} color={C.pink} /> Plans</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, marginBottom: 32 }}>
                {saPlans.filter(p => !p.is_addon && !p.addon_type).sort((a, b) => a.ordre - b.ordre).map(plan => {
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
                          <div><span style={{ color: C.textMuted }}>Mensuel :</span> <b>{plan.prix_chf_mensuel} CHF</b>{plan.addon_type === "ai" ? "/mois" : "/emp/mois"}</div>
                          {plan.addon_type !== "ai" && <div><span style={{ color: C.textMuted }}>Annuel :</span> <b>{(Number(plan.prix_chf_mensuel) * 0.9).toFixed(1)} CHF</b>/emp/mois <span style={{ fontSize: 9, color: C.green, fontWeight: 600 }}>-10%</span></div>}
                          {plan.addon_type === "ai" && <div><span style={{ color: C.textMuted, fontSize: 10 }}>Pas de réduction annuelle</span></div>}
                          <div><span style={{ color: C.textMuted }}>Min :</span> <b>{plan.min_mensuel_chf} CHF</b>/mois</div>
                          {plan.addon_type !== "ai" && <div><span style={{ color: C.textMuted }}>Min annuel :</span> <b>{Math.round(Number(plan.min_mensuel_chf) * 12 * 0.9)} CHF</b>/an</div>}
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

              {/* ── Section Apps / Add-ons ── */}
              {saPlans.filter(p => p.is_addon || p.addon_type).length > 0 && (
                <>
                  <h2 style={{ fontSize: 16, fontWeight: 600, margin: "0 0 12px", display: "flex", alignItems: "center", gap: 8 }}><Sparkles size={18} color={C.blue} /> Apps & Modules complémentaires</h2>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, marginBottom: 20 }}>
                    {saPlans.filter(p => p.is_addon || p.addon_type).sort((a, b) => a.ordre - b.ordre).map(plan => {
                      const allModules = ["onboarding","offboarding","crossboarding","cooptation","nps","signature","sso","provisioning","api","white_label","gamification"];
                      const moduleLabels: Record<string, string> = { onboarding: "Onboarding", offboarding: "Offboarding", crossboarding: "Crossboarding", cooptation: "Cooptation", nps: "NPS", signature: "Signature", sso: "SSO", provisioning: "Provisionnement", api: "API", white_label: "White-label", gamification: "Gamification" };
                      const isAi = plan.addon_type === "ai" || plan.slug?.startsWith("ia_");
                      const addonColor = isAi ? C.blue : "#7B5EA7";
                      const addonLabel = isAi ? "IA" : plan.addon_type === "cooptation" ? "Cooptation" : "Add-on";
                      return (
                      <div key={plan.id} className="iz-card" style={{ ...sCard, padding: 0, overflow: "hidden", borderTop: `3px solid ${addonColor}` }}>
                        <div style={{ padding: "20px 24px" }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                            <span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 9, fontWeight: 700, background: addonColor + "15", color: addonColor, textTransform: "uppercase", letterSpacing: .5 }}>{addonLabel}</span>
                            <span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 600, background: plan.actif ? C.greenLight : C.redLight, color: plan.actif ? C.green : C.red }}>{plan.actif ? "Actif" : "Inactif"}</span>
                          </div>
                          <h3 style={{ fontSize: 18, fontWeight: 700, margin: "8px 0 12px" }}>{plan.nom}</h3>

                          <div style={{ background: C.bg, borderRadius: 10, padding: "12px 14px", marginBottom: 14 }}>
                            <div style={{ fontSize: 22, fontWeight: 700, color: C.text }}>{plan.prix_chf_mensuel} <span style={{ fontSize: 12, fontWeight: 400, color: C.textMuted }}>CHF/mois</span></div>
                            {plan.description && <div style={{ fontSize: 11, color: C.textMuted, marginTop: 4 }}>{plan.description}</div>}
                          </div>

                          {/* AI quotas */}
                          {isAi && (
                            <div style={{ marginBottom: 14 }}>
                              <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6, color: addonColor }}>Quotas IA</div>
                              <div style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 11, color: C.textLight }}>
                                {plan.ai_ocr_scans > 0 && <span>OCR : <b style={{ color: C.text }}>{plan.ai_ocr_scans}</b> scans/mois</span>}
                                {plan.ai_bot_messages > 0 && <span>Messages IA : <b style={{ color: C.text }}>{plan.ai_bot_messages}</b>/mois</span>}
                                {plan.ai_contrat_generations > 0 && <span>Contrats IA : <b style={{ color: C.text }}>{plan.ai_contrat_generations}</b>/mois</span>}
                                {plan.ai_translations > 0 && <span>Traductions IA : <b style={{ color: C.text }}>{plan.ai_translations}</b>/mois</span>}
                                {plan.ai_model && <span>Modèle : <b style={{ color: C.text }}>{plan.ai_model}</b></span>}
                              </div>
                            </div>
                          )}

                          {/* Price conversions */}
                          {(() => {
                            const rates = ctx._exchangeRates?.rates;
                            if (!rates && !ctx._exchangeRatesLoaded) {
                              ctx._exchangeRatesLoaded = true;
                              import('../api/endpoints').then(m => m.getExchangeRates()).then((d: any) => {
                                ctx._exchangeRates = d;
                                loadSA();
                              }).catch(() => {});
                            }
                            const chf = Number(plan.prix_chf_mensuel) || 0;
                            return rates ? (
                              <div style={{ fontSize: 10, color: C.textMuted, marginBottom: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
                                <span>≈ {(chf * (rates.EUR || 1.09)).toFixed(0)} EUR</span>
                                <span>≈ {(chf * (rates.USD || 1.28)).toFixed(0)} USD</span>
                                <span>≈ {(chf * (rates.GBP || 0.95)).toFixed(0)} GBP</span>
                              </div>
                            ) : null;
                          })()}

                          {/* Stripe */}
                          <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 10 }}>
                            <div>Stripe : {plan.stripe_price_id_chf || <span style={{ color: C.amber }}>Non configuré</span>}</div>
                          </div>
                        </div>
                        <div style={{ padding: "10px 24px", borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "flex-end" }}>
                          <button onClick={() => { setSaPlanData({ ...plan, stripe_price_id_eur: plan.stripe_price_id_eur || "", stripe_price_id_chf: plan.stripe_price_id_chf || "" }); setSaPlanPanel("edit"); }} style={{ background: C.bg, border: "none", borderRadius: 4, padding: "4px 12px", cursor: "pointer", fontSize: 11, color: C.textMuted }}>{t('common.edit')}</button>
                        </div>
                      </div>
                      );
                    })}
                  </div>
                </>
              )}

              {saPlans.length === 0 && <div style={{ padding: 40, textAlign: "center", color: C.textMuted }}>{saLoaded ? "Aucun plan trouvé. Vérifiez la connexion API." : "Chargement des plans..."}</div>}

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
                      {saPlanData.addon_type !== "ai" ? (
                        <div style={{ padding: "8px 12px", background: C.bg, borderRadius: 8, fontSize: 11, color: C.textMuted }}>
                          Annuel : <b>{(Number(saPlanData.prix_chf_mensuel || 0) * 0.9).toFixed(1)} CHF</b>/emp/mois (-10%) · Min annuel : <b>{Math.round(Number(saPlanData.min_mensuel_chf || 0) * 12 * 0.9)} CHF</b>/an
                        </div>
                      ) : (
                        <div style={{ padding: "8px 12px", background: "#FFF3E0", borderRadius: 8, fontSize: 11, color: "#E65100" }}>
                          Plan IA — prix fixe mensuel, pas de réduction annuelle
                        </div>
                      )}

                      {/* Limites — only for main plans, not add-ons */}
                      {!saPlanData.is_addon && !saPlanData.addon_type && (
                        <>
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
                        </>
                      )}

                      <div style={{ fontSize: 13, fontWeight: 600, color: C.pink, marginTop: 4 }}>Stripe (CHF)</div>
                      <div>
                        <label style={{ fontSize: 10, color: C.textLight, display: "block", marginBottom: 4 }}>Stripe Price ID (CHF)</label>
                        <input value={saPlanData.stripe_price_id_chf || ""} onChange={e => setSaPlanData((p: any) => ({ ...p, stripe_price_id_chf: e.target.value }))} style={sInput} placeholder="price_..." />
                      </div>

                      {/* AI config — only for AI addon plans */}
                      {(saPlanData.addon_type === "ai" || saPlanData.slug?.startsWith("ia_")) && (
                        <>
                          <div style={{ fontSize: 13, fontWeight: 600, color: C.blue, marginTop: 4, display: "flex", alignItems: "center", gap: 6 }}><Sparkles size={14} /> Configuration IA</div>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                            <div><label style={{ fontSize: 10, color: C.textLight, display: "block", marginBottom: 4 }}>Modèle Claude</label>
                              <select value={saPlanData.ai_model || "claude-opus-4-6"} onChange={e => setSaPlanData((p: any) => ({ ...p, ai_model: e.target.value }))} style={sInput}>
                                <option value="claude-opus-4-7">Opus 4.7 (top)</option>
                                <option value="claude-opus-4-6">Opus 4.6</option>
                                <option value="claude-sonnet-4-6">Sonnet 4.6</option>
                                <option value="claude-haiku-4-5-20251001">Haiku 4.5</option>
                              </select>
                            </div>
                            <div><label style={{ fontSize: 10, color: C.textLight, display: "block", marginBottom: 4 }}>Prix scan suppl. (CHF)</label><input type="number" step="0.01" value={saPlanData.ai_extra_scan_price_chf ?? ""} onChange={e => setSaPlanData((p: any) => ({ ...p, ai_extra_scan_price_chf: e.target.value ? Number(e.target.value) : null }))} style={sInput} placeholder="0.10" /></div>
                          </div>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                            <div><label style={{ fontSize: 10, color: C.textLight, display: "block", marginBottom: 4 }}>Scans OCR/mois</label><input type="number" value={saPlanData.ai_ocr_scans ?? ""} onChange={e => setSaPlanData((p: any) => ({ ...p, ai_ocr_scans: e.target.value ? Number(e.target.value) : null }))} style={sInput} /></div>
                            <div><label style={{ fontSize: 10, color: C.textLight, display: "block", marginBottom: 4 }}>Messages bot/mois</label><input type="number" value={saPlanData.ai_bot_messages ?? ""} onChange={e => setSaPlanData((p: any) => ({ ...p, ai_bot_messages: e.target.value ? Number(e.target.value) : null }))} style={sInput} /></div>
                            <div><label style={{ fontSize: 10, color: C.textLight, display: "block", marginBottom: 4 }}>Contrats IA/mois</label><input type="number" value={saPlanData.ai_contrat_generations ?? ""} onChange={e => setSaPlanData((p: any) => ({ ...p, ai_contrat_generations: e.target.value ? Number(e.target.value) : null }))} style={sInput} /></div>
                            <div><label style={{ fontSize: 10, color: C.textLight, display: "block", marginBottom: 4 }}>Traductions IA/mois</label><input type="number" value={saPlanData.ai_translations ?? ""} onChange={e => setSaPlanData((p: any) => ({ ...p, ai_translations: e.target.value ? Number(e.target.value) : null }))} style={sInput} /></div>
                          </div>
                        </>
                      )}

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
            <div style={{ maxWidth: 640 }}>
              <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 20 }}>Configuration Stripe</h1>

              {/* ── Mode Toggle ── */}
              <div className="iz-card" style={{ ...sCard, marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: saStripe?.has_secret ? C.green : C.red }} />
                    <span style={{ fontSize: 13, fontWeight: 500 }}>{saStripe?.has_secret ? "Stripe connecté" : "Stripe non configuré"}</span>
                    {saStripe?.mode && (
                      <span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 700, background: saStripe.mode === "test" ? "#FF980020" : "#4CAF5020", color: saStripe.mode === "test" ? "#FF9800" : "#4CAF50" }}>
                        {saStripe.mode === "test" ? "MODE TEST" : "PRODUCTION"}
                      </span>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: 0, background: C.bg, borderRadius: 6, padding: 2 }}>
                    {(["live", "test"] as const).map(mode => (
                      <button key={mode} onClick={async () => {
                        try {
                          await superAdminUpdateStripeConfig({ stripe_mode: mode });
                          loadSA();
                          addToast_admin(mode === "test" ? "Mode test activé — cartes test uniquement" : "Mode production activé");
                        } catch { addToast_admin(t('toast.error')); }
                      }} style={{ padding: "5px 14px", fontSize: 11, fontWeight: saStripe?.mode === mode ? 600 : 400, borderRadius: 5, border: "none", cursor: "pointer", background: saStripe?.mode === mode ? (mode === "test" ? "#FF9800" : C.green) : "transparent", color: saStripe?.mode === mode ? "#fff" : C.textMuted, transition: "all .15s" }}>
                        {mode === "live" ? "Production" : "Test"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── Live Keys ── */}
              <div className="iz-card" style={{ ...sCard, marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: saStripe?.live_configured ? C.green : C.textMuted }} />
                  <span style={{ fontSize: 14, fontWeight: 600 }}>Clés Production</span>
                  <span style={{ fontSize: 10, color: C.textMuted }}>(live)</span>
                </div>
                {saStripe?.live_configured ? (
                  <>
                    <div style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: "6px 16px", fontSize: 13, marginBottom: 14 }}>
                      <span style={{ color: C.textMuted }}>Publishable Key</span><span style={{ fontFamily: "monospace", fontSize: 12 }}>pk_live_•••••••••</span>
                      <span style={{ color: C.textMuted }}>Secret Key</span><span style={{ fontFamily: "monospace", fontSize: 12 }}>sk_live_•••••••••</span>
                      <span style={{ color: C.textMuted }}>Webhook Secret</span><span style={{ fontFamily: "monospace", fontSize: 12 }}>whsec_•••••••••</span>
                    </div>
                    <button onClick={() => showConfirm("Supprimer les clés production Stripe ?", async () => {
                      try {
                        await superAdminUpdateStripeConfig({ stripe_key: "", stripe_secret: "", stripe_webhook_secret: "" });
                        loadSA();
                        addToast_admin("Clés production supprimées");
                      } catch { addToast_admin(t('toast.error')); }
                    })} style={{ ...sBtn("outline"), color: C.red, borderColor: C.red, fontSize: 11, padding: "4px 12px" }}>Supprimer clés live</button>
                  </>
                ) : (
                  <>
                    {[
                      { key: "stripe_key", label: "Publishable Key", placeholder: "pk_live_..." },
                      { key: "stripe_secret", label: "Secret Key", placeholder: "sk_live_..." },
                      { key: "stripe_webhook_secret", label: "Webhook Secret", placeholder: "whsec_..." },
                    ].map(field => (
                      <div key={field.key} style={{ marginBottom: 10 }}>
                        <label style={{ fontSize: 11, fontWeight: 600, color: C.text, display: "block", marginBottom: 4 }}>{field.label}</label>
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
                      try { await superAdminUpdateStripeConfig(data); loadSA(); addToast_admin("Clés production enregistrées"); } catch { addToast_admin(t('toast.error')); }
                    }} className="iz-btn-pink" style={{ ...sBtn("pink"), fontSize: 12 }}>Enregistrer clés live</button>
                  </>
                )}
              </div>

              {/* ── Test Keys ── */}
              <div className="iz-card" style={{ ...sCard }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: saStripe?.test_configured ? "#FF9800" : C.textMuted }} />
                  <span style={{ fontSize: 14, fontWeight: 600 }}>Clés Test</span>
                  <span style={{ fontSize: 10, color: C.textMuted }}>(sandbox)</span>
                </div>
                {saStripe?.test_configured ? (
                  <>
                    <div style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: "6px 16px", fontSize: 13, marginBottom: 14 }}>
                      <span style={{ color: C.textMuted }}>Publishable Key</span><span style={{ fontFamily: "monospace", fontSize: 12 }}>pk_test_•••••••••</span>
                      <span style={{ color: C.textMuted }}>Secret Key</span><span style={{ fontFamily: "monospace", fontSize: 12 }}>sk_test_•••••••••</span>
                      <span style={{ color: C.textMuted }}>Webhook Secret</span><span style={{ fontFamily: "monospace", fontSize: 12 }}>whsec_•••••••••</span>
                    </div>
                    <button onClick={() => showConfirm("Supprimer les clés test Stripe ?", async () => {
                      try {
                        await superAdminUpdateStripeConfig({ stripe_test_key: "", stripe_test_secret: "", stripe_test_webhook_secret: "" });
                        loadSA();
                        addToast_admin("Clés test supprimées");
                      } catch { addToast_admin(t('toast.error')); }
                    })} style={{ ...sBtn("outline"), color: "#FF9800", borderColor: "#FF9800", fontSize: 11, padding: "4px 12px" }}>Supprimer clés test</button>
                  </>
                ) : (
                  <>
                    {[
                      { key: "stripe_test_key", label: "Publishable Key", placeholder: "pk_test_..." },
                      { key: "stripe_test_secret", label: "Secret Key", placeholder: "sk_test_..." },
                      { key: "stripe_test_webhook_secret", label: "Webhook Secret", placeholder: "whsec_..." },
                    ].map(field => (
                      <div key={field.key} style={{ marginBottom: 10 }}>
                        <label style={{ fontSize: 11, fontWeight: 600, color: C.text, display: "block", marginBottom: 4 }}>{field.label}</label>
                        <input id={`sa-${field.key}`} type="password" placeholder={field.placeholder} style={sInput} />
                      </div>
                    ))}
                    <button onClick={async () => {
                      const data: any = {};
                      ["stripe_test_key", "stripe_test_secret", "stripe_test_webhook_secret"].forEach(k => {
                        const el = document.getElementById(`sa-${k}`) as HTMLInputElement;
                        if (el?.value) data[k] = el.value;
                      });
                      if (Object.keys(data).length === 0) { addToast_admin("Aucune clé saisie"); return; }
                      try { await superAdminUpdateStripeConfig(data); loadSA(); addToast_admin("Clés test enregistrées"); } catch { addToast_admin(t('toast.error')); }
                    }} style={{ ...sBtn("outline"), borderColor: "#FF9800", color: "#FF9800", fontSize: 12, fontWeight: 600 }}>Enregistrer clés test</button>
                  </>
                )}
              </div>
            </div>
          )}

          {saTab === "ai" && (() => {
            const [aiConfig, setAiConfig] = [ctx.saAiConfig || { api_key: "", model: "claude-opus-4-6", key_set: false }, ctx.setSaAiConfig || (() => {})];
            const [aiTenantUsage, setAiTenantUsage] = [ctx.saAiTenantUsage || [], ctx.setSaAiTenantUsage || (() => {})];

            // Load AI config on first render
            if (!ctx._aiLoaded) {
              ctx._aiLoaded = true;
              // Fetch current config
              apiFetch('/super-admin/ai-config').then((d: any) => ctx.setSaAiConfig?.(d)).catch(() => {});
              // Fetch usage per tenant
              apiFetch('/super-admin/ai-usage').then((d: any) => ctx.setSaAiTenantUsage?.(d)).catch(() => {});
            }

            return (
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}><Sparkles size={22} color={C.blue} /> IA & Claude</h1>

              {/* API Config */}
              <div className="iz-card" style={{ ...sCard, marginBottom: 24 }}>
                <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Configuration API Anthropic</h3>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: aiConfig.key_set ? C.green : C.red }} />
                  <span style={{ fontSize: 13, fontWeight: 500 }}>{aiConfig.key_set ? "Clé API configurée" : "Clé API non configurée"}</span>
                  {aiConfig.key_set && <span style={{ fontSize: 11, color: C.textMuted }}>sk-ant-...{aiConfig.key_preview || ""}</span>}
                </div>
                <div style={{ marginBottom: 14 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Clé API Anthropic</label>
                  <input id="sa-anthropic-key" type="password" placeholder="sk-ant-api03-..." style={sInput} />
                </div>
                <div style={{ marginBottom: 14 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Modèle par défaut</label>
                  <select id="sa-anthropic-model" defaultValue={aiConfig.model || "claude-opus-4-6"} style={sInput}>
                    <option value="claude-opus-4-7">Claude Opus 4.7 (le plus performant)</option>
                    <option value="claude-opus-4-6">Claude Opus 4.6 (recommandé)</option>
                    <option value="claude-sonnet-4-6">Claude Sonnet 4.6 (rapide)</option>
                    <option value="claude-haiku-4-5-20251001">Claude Haiku 4.5 (économique)</option>
                  </select>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 14, fontSize: 12 }}>
                  <div style={{ padding: "8px 12px", background: C.bg, borderRadius: 8 }}>
                    <div style={{ color: C.textMuted, fontSize: 10 }}>Opus 4.6</div>
                    <div style={{ fontWeight: 600 }}>$5 / $25 /MTok</div>
                  </div>
                  <div style={{ padding: "8px 12px", background: C.bg, borderRadius: 8 }}>
                    <div style={{ color: C.textMuted, fontSize: 10 }}>Sonnet 4.6</div>
                    <div style={{ fontWeight: 600 }}>$3 / $15 /MTok</div>
                  </div>
                  <div style={{ padding: "8px 12px", background: C.bg, borderRadius: 8 }}>
                    <div style={{ color: C.textMuted, fontSize: 10 }}>Haiku 4.5</div>
                    <div style={{ fontWeight: 600 }}>$1 / $5 /MTok</div>
                  </div>
                </div>
                <button onClick={async () => {
                  const key = (document.getElementById("sa-anthropic-key") as HTMLInputElement)?.value;
                  const model = (document.getElementById("sa-anthropic-model") as HTMLSelectElement)?.value;
                  const data: any = {};
                  if (key) data.api_key = key;
                  if (model) data.model = model;
                  if (Object.keys(data).length === 0) { addToast_admin("Aucune modification"); return; }
                  try {
                    await apiFetch('/super-admin/ai-config', { method: 'POST', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } });
                    addToast_admin("Configuration IA enregistrée");
                    apiFetch('/super-admin/ai-config').then((d: any) => ctx.setSaAiConfig?.(d)).catch(() => {});
                  } catch { addToast_admin(t('toast.error')); }
                }} className="iz-btn-pink" style={sBtn("pink")}>{t('common.save')}</button>
              </div>

              {/* Usage per tenant */}
              <div className="iz-card" style={{ ...sCard }}>
                <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Consommation IA par client</h3>
                <p style={{ fontSize: 12, color: C.textMuted, marginBottom: 16 }}>Mois en cours — marge x2 sur le coût Claude</p>

                {/* Summary cards */}
                {aiTenantUsage.length > 0 && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12, marginBottom: 20 }}>
                    <div style={{ padding: "12px 16px", borderRadius: 10, background: C.bg }}>
                      <div style={{ fontSize: 10, color: C.textMuted, marginBottom: 4 }}>Coût Claude total</div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: C.text }}>{aiTenantUsage.reduce((s: number, t: any) => s + (t.cost_chf || 0), 0).toFixed(2)} <span style={{ fontSize: 11, fontWeight: 400 }}>CHF</span></div>
                    </div>
                    <div style={{ padding: "12px 16px", borderRadius: 10, background: C.greenLight }}>
                      <div style={{ fontSize: 10, color: C.green, marginBottom: 4 }}>Facturé clients (x2)</div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: C.green }}>{aiTenantUsage.reduce((s: number, t: any) => s + (t.billed_chf || 0), 0).toFixed(2)} <span style={{ fontSize: 11, fontWeight: 400 }}>CHF</span></div>
                    </div>
                    <div style={{ padding: "12px 16px", borderRadius: 10, background: "#E8F5E9" }}>
                      <div style={{ fontSize: 10, color: "#2E7D32", marginBottom: 4 }}>Marge</div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: "#2E7D32" }}>{aiTenantUsage.reduce((s: number, t: any) => s + (t.margin_chf || 0), 0).toFixed(2)} <span style={{ fontSize: 11, fontWeight: 400 }}>CHF</span></div>
                    </div>
                    <div style={{ padding: "12px 16px", borderRadius: 10, background: C.blueLight }}>
                      <div style={{ fontSize: 10, color: C.blue, marginBottom: 4 }}>Tokens ce mois</div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: C.blue }}>{Math.round(aiTenantUsage.reduce((s: number, t: any) => s + (t.input_tokens || 0) + (t.output_tokens || 0), 0) / 1000)} <span style={{ fontSize: 11, fontWeight: 400 }}>k tokens</span></div>
                    </div>
                  </div>
                )}

                {aiTenantUsage.length === 0 ? (
                  <div style={{ textAlign: "center", padding: 20, color: C.textMuted, fontSize: 13 }}>Aucune consommation IA ce mois</div>
                ) : (
                  <div style={{ border: `1px solid ${C.border}`, borderRadius: 10, overflow: "hidden" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                      <thead>
                        <tr style={{ background: C.bg }}>
                          <th style={{ padding: "8px 12px", textAlign: "left", fontWeight: 600, fontSize: 10, textTransform: "uppercase", color: C.textLight }}>Tenant</th>
                          <th style={{ padding: "8px 12px", textAlign: "center", fontWeight: 600, fontSize: 10, textTransform: "uppercase", color: C.textLight }}>Plan IA</th>
                          <th style={{ padding: "8px 12px", textAlign: "center", fontWeight: 600, fontSize: 10, textTransform: "uppercase", color: C.textLight }}>OCR</th>
                          <th style={{ padding: "8px 12px", textAlign: "center", fontWeight: 600, fontSize: 10, textTransform: "uppercase", color: C.textLight }}>Bot</th>
                          <th style={{ padding: "8px 12px", textAlign: "center", fontWeight: 600, fontSize: 10, textTransform: "uppercase", color: C.textLight }}>Contrats</th>
                          <th style={{ padding: "8px 12px", textAlign: "right", fontWeight: 600, fontSize: 10, textTransform: "uppercase", color: C.textLight }}>Coût Claude</th>
                          <th style={{ padding: "8px 12px", textAlign: "right", fontWeight: 600, fontSize: 10, textTransform: "uppercase", color: C.textLight }}>Facturé (x2)</th>
                          <th style={{ padding: "8px 12px", textAlign: "right", fontWeight: 600, fontSize: 10, textTransform: "uppercase", color: C.textLight }}>Marge</th>
                        </tr>
                      </thead>
                      <tbody>
                        {aiTenantUsage.map((t: any, i: number) => (
                          <tr key={t.tenant_id} style={{ borderTop: `1px solid ${C.border}`, background: i % 2 ? C.bg + "60" : "transparent" }}>
                            <td style={{ padding: "8px 12px", fontWeight: 500 }}>{t.tenant_name || t.tenant_id}</td>
                            <td style={{ padding: "8px 12px", textAlign: "center" }}>
                              <span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 600, background: C.blueLight, color: C.blue }}>{t.plan_name}</span>
                              <div style={{ fontSize: 9, color: C.textMuted, marginTop: 2 }}>{t.plan_price_chf} CHF/mois</div>
                            </td>
                            <td style={{ padding: "8px 12px", textAlign: "center", fontWeight: 600 }}>{t.ocr_scans || 0}</td>
                            <td style={{ padding: "8px 12px", textAlign: "center", fontWeight: 600 }}>{t.bot_messages || 0}</td>
                            <td style={{ padding: "8px 12px", textAlign: "center", fontWeight: 600 }}>{t.contrat_generations || 0}</td>
                            <td style={{ padding: "8px 12px", textAlign: "right", fontSize: 11, color: C.textMuted }}>{t.cost_chf?.toFixed(2)} CHF</td>
                            <td style={{ padding: "8px 12px", textAlign: "right", fontWeight: 600, color: C.text }}>{t.billed_chf?.toFixed(2)} CHF</td>
                            <td style={{ padding: "8px 12px", textAlign: "right", fontWeight: 600, color: C.green }}>{t.margin_chf?.toFixed(2)} CHF</td>
                          </tr>
                        ))}
                        {/* Totals row */}
                        <tr style={{ borderTop: `2px solid ${C.text}`, background: C.bg, fontWeight: 700 }}>
                          <td style={{ padding: "10px 12px" }} colSpan={5}>Total</td>
                          <td style={{ padding: "10px 12px", textAlign: "right", fontSize: 11, color: C.textMuted }}>{aiTenantUsage.reduce((s: number, t: any) => s + (t.cost_chf || 0), 0).toFixed(2)} CHF</td>
                          <td style={{ padding: "10px 12px", textAlign: "right", color: C.text }}>{aiTenantUsage.reduce((s: number, t: any) => s + (t.billed_chf || 0), 0).toFixed(2)} CHF</td>
                          <td style={{ padding: "10px 12px", textAlign: "right", color: C.green }}>{aiTenantUsage.reduce((s: number, t: any) => s + (t.margin_chf || 0), 0).toFixed(2)} CHF</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
            );
          })()}

          {saTab === "ai_protection" && (() => {
            // Load spending caps per tenant
            if (!ctx._protLoaded) {
              ctx._protLoaded = true;
              // Reuse tenant usage data
              apiFetch('/super-admin/ai-usage').then((d: any) => ctx.setSaAiTenantUsage?.(d)).catch(() => {});
            }
            const tenantUsage = ctx.saAiTenantUsage || [];

            return (
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 8, display: "flex", alignItems: "center", gap: 10 }}><ShieldCheck size={22} color={C.green} /> Protection IA</h1>
              <p style={{ fontSize: 13, color: C.textMuted, marginBottom: 24 }}>Protections actives contre la surconsommation IA par tenant</p>

              {/* Active protections */}
              <div className="iz-card" style={{ ...sCard, marginBottom: 24 }}>
                <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Protections actives</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div style={{ padding: "14px 16px", borderRadius: 10, background: C.greenLight, border: `1px solid ${C.green}30` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.green }} />
                      <span style={{ fontSize: 12, fontWeight: 600, color: C.green }}>Rate Limiting</span>
                    </div>
                    <div style={{ fontSize: 11, color: C.text }}>Max <b>10 appels/minute</b> par tenant</div>
                    <div style={{ fontSize: 10, color: C.textMuted, marginTop: 4 }}>Empêche les appels trop fréquents</div>
                  </div>
                  <div style={{ padding: "14px 16px", borderRadius: 10, background: C.greenLight, border: `1px solid ${C.green}30` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.green }} />
                      <span style={{ fontSize: 12, fontWeight: 600, color: C.green }}>Anti-boucle</span>
                    </div>
                    <div style={{ fontSize: 11, color: C.text }}>Max <b>20 appels/5 minutes</b> — blocage 5 min</div>
                    <div style={{ fontSize: 10, color: C.textMuted, marginTop: 4 }}>Détecte les boucles infinies frontend</div>
                  </div>
                  <div style={{ padding: "14px 16px", borderRadius: 10, background: C.greenLight, border: `1px solid ${C.green}30` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.green }} />
                      <span style={{ fontSize: 12, fontWeight: 600, color: C.green }}>Plafond mensuel</span>
                    </div>
                    <div style={{ fontSize: 11, color: C.text }}>Max <b>200 CHF/mois</b> facturés par tenant (configurable)</div>
                    <div style={{ fontSize: 10, color: C.textMuted, marginTop: 4 }}>Le tenant peut modifier son plafond</div>
                  </div>
                  <div style={{ padding: "14px 16px", borderRadius: 10, background: C.greenLight, border: `1px solid ${C.green}30` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.green }} />
                      <span style={{ fontSize: 12, fontWeight: 600, color: C.green }}>Logs & Alertes</span>
                    </div>
                    <div style={{ fontSize: 11, color: C.text }}>Chaque déclenchement est <b>loggé</b></div>
                    <div style={{ fontSize: 10, color: C.textMuted, marginTop: 4 }}>Warning/Error dans laravel.log</div>
                  </div>
                </div>
              </div>

              {/* Spending per tenant */}
              <div className="iz-card" style={{ ...sCard }}>
                <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Consommation par tenant — ce mois</h3>
                <p style={{ fontSize: 12, color: C.textMuted, marginBottom: 16 }}>Coût Claude réel vs montant facturé (x2)</p>

                {tenantUsage.length === 0 ? (
                  <div style={{ textAlign: "center", padding: 20, color: C.textMuted, fontSize: 13 }}>Aucune donnée</div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {tenantUsage.map((t: any) => {
                      const costChf = t.cost_chf || 0;
                      const billedChf = t.billed_chf || 0;
                      const cap = 200; // default
                      const pct = cap > 0 ? Math.min(100, Math.round((billedChf / cap) * 100)) : 0;
                      return (
                        <div key={t.tenant_id} style={{ padding: "16px 20px", borderRadius: 10, border: `1px solid ${C.border}` }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                            <div>
                              <span style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{t.tenant_name || t.tenant_id}</span>
                              <span style={{ marginLeft: 8, padding: "2px 8px", borderRadius: 4, fontSize: 9, fontWeight: 600, background: C.blueLight, color: C.blue }}>{t.plan_name}</span>
                            </div>
                            <div style={{ textAlign: "right" }}>
                              <div style={{ fontSize: 16, fontWeight: 700, color: billedChf > cap * 0.8 ? C.red : C.text }}>{billedChf.toFixed(2)} CHF</div>
                              <div style={{ fontSize: 10, color: C.textMuted }}>facturé / {cap} CHF plafond</div>
                            </div>
                          </div>
                          <div style={{ height: 6, borderRadius: 3, background: C.bg, overflow: "hidden", marginBottom: 8 }}>
                            <div style={{ height: "100%", borderRadius: 3, width: `${pct}%`, background: pct > 80 ? C.red : pct > 50 ? "#FF9800" : C.green, transition: "width .3s" }} />
                          </div>
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8, fontSize: 11 }}>
                            <div><span style={{ color: C.textMuted }}>OCR:</span> <b>{t.ocr_scans || 0}</b></div>
                            <div><span style={{ color: C.textMuted }}>Bot:</span> <b>{t.bot_messages || 0}</b></div>
                            <div><span style={{ color: C.textMuted }}>Contrats:</span> <b>{t.contrat_generations || 0}</b></div>
                            <div><span style={{ color: C.textMuted }}>Trad:</span> <b>{t.translation || 0}</b></div>
                            <div><span style={{ color: C.textMuted }}>Coût:</span> <b>{costChf.toFixed(2)} CHF</b></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
            );
          })()}
        </div>
      </div>
    );
  };

  return {
    renderSidebar_admin,
    renderSuperAdminPanel,
  };
}
