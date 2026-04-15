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
      return (
      <div style={{ flex: 1, padding: "24px 32px", overflow: "auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <h1 style={{ fontSize: 22, fontWeight: 600, margin: 0 }}>{t('coopt.title')}</h1>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setCooptSettingsOpen(true)} className="iz-btn-outline" style={{ ...sBtn("outline"), display: "flex", alignItems: "center", gap: 6 }}><Zap size={14} /> {t('coopt.settings')}</button>
            {cooptTab === "cooptations" && <button onClick={() => { setCooptPanelData({ referrer_name: "", referrer_email: "", candidate_name: "", candidate_email: "", candidate_poste: "", type_recompense: cooptSettings?.type_recompense_defaut || "prime", montant_recompense: cooptSettings?.montant_defaut || 500, mois_requis: cooptSettings?.mois_requis_defaut || 6, notes: "", campaign_id: null }); setCooptPanelMode("create"); }} className="iz-btn-pink" style={{ ...sBtn("pink"), display: "flex", alignItems: "center", gap: 6 }}><Plus size={14} /> {t('coopt.new')}</button>}
            {cooptTab === "campagnes" && <button onClick={() => { setCampaignPanelData({ titre: "", description: "", departement: "", site: "", type_contrat: "CDI", type_recompense: "prime", montant_recompense: cooptSettings?.montant_defaut || 500, mois_requis: cooptSettings?.mois_requis_defaut || 6, nombre_postes: 1, priorite: "normale", date_limite: "" }); setCampaignPanelMode("create"); }} className="iz-btn-pink" style={{ ...sBtn("pink"), display: "flex", alignItems: "center", gap: 6 }}><Plus size={14} /> {t('coopt.new_campaign')}</button>}
          </div>
        </div>

        {/* Stats cards */}
        {cooptStats && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 20 }}>
            {[
              { label: t('coopt.in_progress'), value: (cooptStats.en_attente || 0) + (cooptStats.embauche || 0), icon: Hourglass, color: C.blue, bg: C.blueLight },
              { label: t('coopt.validated'), value: cooptStats.valide || 0, icon: CheckCircle2, color: C.green, bg: C.greenLight },
              { label: t('coopt.conversion_rate'), value: `${cooptStats.conversion_rate || 0}%`, icon: TrendingUp, color: C.pink, bg: C.pinkBg },
              { label: t('coopt.avg_hire_time'), value: `${cooptStats.avg_days_to_hire || 0}j`, icon: Clock, color: "#5C6BC0", bg: C.blueLight },
              { label: t('coopt.rewards_paid'), value: `${fmtCurrency(cooptStats.total_recompenses_versees || 0)}`, icon: Banknote, color: "#7B5EA7", bg: C.purple + "15" },
              { label: t('coopt.pending_payment'), value: `${fmtCurrency(cooptStats.recompenses_en_attente || 0)}`, icon: CircleDollarSign, color: C.amber, bg: C.amberLight },
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
                    <button onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/cooptation/${camp.share_token}`); addToast_admin(t('toast.saved')); }} title={t('coopt.share')} className="iz-btn-outline" style={{ ...sBtn("outline"), padding: "6px 10px", fontSize: 11, display: "flex", alignItems: "center", gap: 4 }}><Link size={12} /> {t('coopt.share')}</button>
                    <button onClick={() => { setCampaignPanelData({ ...camp, date_limite: camp.date_limite || "" }); setCampaignPanelMode("edit"); }} style={{ background: C.bg, border: "none", borderRadius: 6, padding: "6px 8px", cursor: "pointer" }}><FilePen size={14} color={C.textMuted} /></button>
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
              <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>{cooptPanelMode === "create" ? t('coopt.new') : t('coopt.edit')}</h2>
              <button onClick={() => setCooptPanelMode("closed")} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}><X size={18} /></button>
            </div>
            <div style={{ flex: 1, padding: 24, overflow: "auto", display: "flex", flexDirection: "column", gap: 14 }}>
              {campaigns.filter(c => c.statut === "active").length > 0 && (
                <div><label style={{ fontSize: 11, color: C.textLight, marginBottom: 4, display: "block" }}>{t('coopt.associated_campaign')}</label>
                  <select value={cooptPanelData.campaign_id || ""} onChange={e => setCooptPanelData({ ...cooptPanelData, campaign_id: e.target.value ? Number(e.target.value) : null })} style={sInput}>
                    <option value="">{t('coopt.no_campaign')}</option>
                    {campaigns.filter(c => c.statut === "active").map(c => <option key={c.id} value={c.id}>{c.titre} ({c.type_contrat})</option>)}
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
