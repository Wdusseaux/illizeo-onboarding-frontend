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
  Moon, Sun, Code, Copy, Activity, Key, ExternalLink, Webhook
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
 * Integrations render functions.
 */
export function createAdminIntegrations(ctx: any) {
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
    integrationMappings, setIntegrationMappings, integrationMappingTab, setIntegrationMappingTab,
    apiKeyInput, setApiKeyInput, apiTab, setApiTab, apiKeys, setApiKeys, apiWebhooks, setApiWebhooks, apiLogs, setApiLogs,
    suiviFilter, setSuiviFilter, suiviSearch, setSuiviSearch, collabMenuId, setCollabMenuId,
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


    const CAT_LABELS: Record<string, string> = { identity: t('integ.cat_identity'), signature: t('integ.cat_signature'), communication: t('integ.cat_communication'), ats: t('integ.cat_ats'), sirh: t('integ.cat_sirh') };

    const INTEGRATION_META: Record<string, { desc: string; Icon: React.FC<any>; color: string; oauth?: boolean; apiKey?: boolean; sapConnect?: boolean; teamsConnect?: boolean; fields: { key: string; label: string; type: "text" | "password" | "select"; options?: string[] }[] }> = {
      docusign: { desc: t('integ.desc_docusign'), Icon: FileSignature, color: "#FFD700", oauth: true, fields: [
        { key: "integration_key", label: "Integration Key (Client ID)", type: "text" },
        { key: "secret_key", label: "Secret Key", type: "password" },
        { key: "account_id", label: "Account ID", type: "text" },
        { key: "environment", label: "Environment", type: "select", options: ["demo", "production_na", "production_eu"] },
      ] },
      ugosign: { desc: t('integ.desc_ugosign'), Icon: PenTool, color: "#1A73E8", apiKey: true, fields: [] },
      native: { desc: t('integ.desc_native'), Icon: ShieldCheck, color: "#4CAF50", fields: [] },
      entra_id: { desc: t('integ.desc_entra'), Icon: ShieldCheck, color: "#0078D4", apiKey: true, fields: [] } as any,
      teams: { desc: t('integ.desc_teams'), Icon: Users, color: "#6264A7", teamsConnect: true, fields: [] },
      slack: { desc: t('integ.desc_slack'), Icon: MessageSquare, color: "#611F69", apiKey: true, fields: [] } as any,
      teamtailor: { desc: t('integ.desc_teamtailor'), Icon: UserPlus, color: "#4834D4", apiKey: true, fields: [] } as any,
      smartrecruiters: { desc: t('integ.desc_smartrecruiters'), Icon: ClipboardList, color: "#FF6B35", fields: [
        { key: "api_key", label: "API Key", type: "password" },
        { key: "company_id", label: "Company ID", type: "text" },
      ]},
      taleez: { desc: t('integ.desc_taleez'), Icon: UserPlus, color: "#6C5CE7", apiKey: true, fields: [],
        connectEndpoint: "taleez/connect", disconnectEndpoint: "taleez/disconnect",
        configFields: [
          { key: "api_key", label: lang === 'fr' ? "Clé API" : "API Key", type: "password" },
          { key: "company_slug", label: lang === 'fr' ? "Slug entreprise (optionnel)" : "Company slug (optional)", type: "text" },
        ],
        guide: lang === 'fr' ? [
          { title: "1. Accéder aux paramètres API", text: "Taleez → Paramètres → Intégrations → API" },
          { title: "2. Générer une clé API", text: "Cliquez 'Générer une clé API' → Copiez la clé générée" },
          { title: "3. Fonctionnalité", text: "Import automatique des candidats embauchés pour déclencher l'onboarding. Synchronisation des offres d'emploi et du statut des candidatures." },
        ] : [
          { title: "1. Access API settings", text: "Taleez → Settings → Integrations → API" },
          { title: "2. Generate an API key", text: "Click 'Generate API key' → Copy the generated key" },
          { title: "3. Feature", text: "Automatic import of hired candidates to trigger onboarding. Job offers and application status synchronization." },
        ],
      } as any,
      sap: { desc: t('integ.desc_sap'), Icon: Building2, color: "#0FAAFF", sapConnect: true, fields: [] },
      personio: { desc: t('integ.desc_personio'), Icon: Users, color: "#4CAF50", apiKey: true, fields: [] } as any,
      bamboohr: { desc: t('integ.desc_bamboohr'), Icon: Users, color: "#73C41D", apiKey: true, fields: [] } as any,
      workday: { desc: t('integ.desc_workday'), Icon: Building2, color: "#F68D2E", apiKey: true, fields: [] } as any,
      lucca: { desc: t('integ.desc_lucca'), Icon: Calendar, color: "#FF6B35", apiKey: true, fields: [] } as any,
    };

    const renderIntegrations = () => {
      const categories = [...new Set((integrations || []).map((i: any) => i.categorie))];
      const selectedIntegration = integrations?.find((i: any) => i.id === integrationPanelId);
      const selectedMeta = selectedIntegration ? INTEGRATION_META[selectedIntegration.provider] : null;

      return (
      <div style={{ flex: 1, padding: "24px 32px", overflow: "auto" }}>
        <h1 style={{ fontSize: 22, fontWeight: 600, margin: "0 0 20px" }}>Intégrations</h1>

        {/* How it works */}
        <div style={{ padding: "16px 20px", background: C.blueLight, borderRadius: 10, marginBottom: 20, fontSize: 12, color: C.blue, lineHeight: 1.7 }}>
          <div style={{ fontWeight: 700, marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}><Sparkles size={14} /> {t('integ.how_title')}</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
            <div><strong>{t('integ.step1')}</strong> — {t('integ.step1_desc')}</div>
            <div><strong>{t('integ.step2')}</strong> — {t('integ.step2_desc')}</div>
            <div><strong>{t('integ.step3')}</strong> — {t('integ.step3_desc')}</div>
          </div>
        </div>

        {categories.map((cat: string) => {
          const sigProviders = cat === "signature" ? (integrations || []).filter((i: any) => i.categorie === "signature") : [];
          const activeSignProviders = sigProviders.filter((i: any) => i.connecte || i.provider === "native");
          const defaultSignProvider = sigProviders.find((i: any) => i.config?.is_default)?.provider || "native";
          return (
          <div key={cat} style={{ marginBottom: 28 }}>
            <h2 style={{ fontSize: 14, fontWeight: 600, color: C.textMuted, textTransform: "uppercase", letterSpacing: .5, marginBottom: 12 }}>{CAT_LABELS[cat] || cat}</h2>
            {cat === "signature" && (
              <div className="iz-card" style={{ ...sCard, marginBottom: 12, display: "flex", alignItems: "center", gap: 16, background: C.blueLight, border: `1px solid ${C.blue}30` }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.blue }}>{t('integ.default_provider')}</div>
                  <div style={{ fontSize: 11, color: C.blue, opacity: 0.7 }}>{t('integ.default_provider_desc')}</div>
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
                }} style={{ ...sInput, width: 220, fontSize: 13, cursor: "pointer", background: C.blueLight, color: C.blue, border: `1px solid ${C.blue}40` }}>
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
                        {int.connecte ? t('common.connected') : int.actif ? t('common.configure') : t('common.not_configured')}
                      </span>
                      <span style={{ fontSize: 11, color: C.pink, fontWeight: 500 }}>{t('common.configure')} →</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          );
        })}

        {/* ─── API & WEBHOOKS SECTION ──────────────────────── */}
        {(() => {
          const mockKeys = apiKeys.length > 0 ? apiKeys : [
            { id: 1, name: "Production App", key: "ilz_live_sk_7f3a9b2c...d4e8", prefix: "ilz_live_sk_7f3a", scopes: ["collaborateurs:read", "parcours:read", "documents:read", "actions:read"], created_at: "2026-03-15", last_used: "2026-04-13T14:32:00", active: true },
            { id: 2, name: "Staging/Test", key: "ilz_test_sk_2b8c4d6e...a1f3", prefix: "ilz_test_sk_2b8c", scopes: ["collaborateurs:read", "collaborateurs:write", "parcours:read", "parcours:write"], created_at: "2026-04-01", last_used: null, active: true },
            { id: 3, name: "Legacy Integration", key: "ilz_live_sk_9e1f...deprecated", prefix: "ilz_live_sk_9e1f", scopes: ["collaborateurs:read"], created_at: "2025-11-20", last_used: "2026-01-15T09:00:00", active: false },
          ];
          const mockWebhooks = apiWebhooks.length > 0 ? apiWebhooks : [
            { id: 1, url: "https://erp.example.com/api/illizeo/webhook", events: ["collaborateur.created", "collaborateur.updated", "document.validated"], secret: "whsec_a8f3...b2c1", active: true, last_triggered: "2026-04-13T10:15:00", success_rate: 98.5 },
            { id: 2, url: "https://slack-bot.internal/onboarding-events", events: ["parcours.completed", "action.overdue"], secret: "whsec_d4e7...f6a9", active: true, last_triggered: "2026-04-12T16:45:00", success_rate: 100 },
          ];
          const mockLogs = apiLogs.length > 0 ? apiLogs : [
            { id: 1, method: "GET", endpoint: "/api/v1/collaborateurs", status: 200, response_time_ms: 45, api_key_name: "Production App", timestamp: "2026-04-13T14:32:00" },
            { id: 2, method: "POST", endpoint: "/api/v1/collaborateurs", status: 201, response_time_ms: 120, api_key_name: "Production App", timestamp: "2026-04-13T14:30:12" },
            { id: 3, method: "GET", endpoint: "/api/v1/parcours", status: 200, response_time_ms: 38, api_key_name: "Production App", timestamp: "2026-04-13T14:28:55" },
            { id: 4, method: "GET", endpoint: "/api/v1/documents", status: 200, response_time_ms: 52, api_key_name: "Staging/Test", timestamp: "2026-04-13T14:25:00" },
            { id: 5, method: "PUT", endpoint: "/api/v1/collaborateurs/42", status: 200, response_time_ms: 89, api_key_name: "Production App", timestamp: "2026-04-13T14:20:30" },
            { id: 6, method: "POST", endpoint: "/api/v1/documents/upload", status: 201, response_time_ms: 340, api_key_name: "Production App", timestamp: "2026-04-13T14:15:00" },
            { id: 7, method: "GET", endpoint: "/api/v1/collaborateurs/99", status: 404, response_time_ms: 12, api_key_name: "Staging/Test", timestamp: "2026-04-13T14:10:00" },
            { id: 8, method: "GET", endpoint: "/api/v1/actions", status: 200, response_time_ms: 41, api_key_name: "Production App", timestamp: "2026-04-13T14:05:22" },
            { id: 9, method: "POST", endpoint: "/api/v1/nps-surveys/3/send", status: 200, response_time_ms: 210, api_key_name: "Production App", timestamp: "2026-04-13T13:55:00" },
            { id: 10, method: "GET", endpoint: "/api/v1/equipments", status: 200, response_time_ms: 33, api_key_name: "Staging/Test", timestamp: "2026-04-13T13:50:00" },
            { id: 11, method: "GET", endpoint: "/api/v1/collaborateurs", status: 401, response_time_ms: 8, api_key_name: "Legacy Integration", timestamp: "2026-04-13T13:45:00" },
            { id: 12, method: "POST", endpoint: "/api/v1/parcours", status: 201, response_time_ms: 156, api_key_name: "Production App", timestamp: "2026-04-13T13:40:00" },
            { id: 13, method: "GET", endpoint: "/api/v1/nps-surveys", status: 200, response_time_ms: 29, api_key_name: "Staging/Test", timestamp: "2026-04-13T13:35:00" },
            { id: 14, method: "PUT", endpoint: "/api/v1/collaborateurs/15", status: 400, response_time_ms: 15, api_key_name: "Production App", timestamp: "2026-04-13T13:30:00" },
            { id: 15, method: "GET", endpoint: "/api/v1/parcours", status: 500, response_time_ms: 2100, api_key_name: "Production App", timestamp: "2026-04-13T13:25:00" },
            { id: 16, method: "GET", endpoint: "/api/v1/documents", status: 200, response_time_ms: 47, api_key_name: "Staging/Test", timestamp: "2026-04-13T13:20:00" },
            { id: 17, method: "POST", endpoint: "/api/v1/collaborateurs", status: 403, response_time_ms: 10, api_key_name: "Legacy Integration", timestamp: "2026-04-13T13:15:00" },
            { id: 18, method: "GET", endpoint: "/api/v1/actions", status: 200, response_time_ms: 36, api_key_name: "Production App", timestamp: "2026-04-13T13:10:00" },
            { id: 19, method: "DELETE", endpoint: "/api/v1/collaborateurs/101", status: 200, response_time_ms: 65, api_key_name: "Production App", timestamp: "2026-04-13T13:05:00" },
            { id: 20, method: "GET", endpoint: "/api/v1/collaborateurs", status: 200, response_time_ms: 42, api_key_name: "Staging/Test", timestamp: "2026-04-13T13:00:00" },
          ];

          const SCOPE_COLORS: Record<string, string> = { "collaborateurs:read": "#4CAF50", "collaborateurs:write": "#E53935", "parcours:read": "#1A73E8", "parcours:write": "#7B5EA7", "documents:read": "#F9A825", "documents:write": "#E65100", "actions:read": "#00BCD4" };
          const METHOD_COLORS: Record<string, string> = { GET: "#4CAF50", POST: "#1A73E8", PUT: "#F9A825", DELETE: "#E53935", PATCH: "#7B5EA7" };
          const STATUS_COLOR = (s: number) => s >= 200 && s < 300 ? C.green : s >= 400 && s < 500 ? "#F9A825" : s >= 500 ? C.red : C.textMuted;
          const STATUS_BG = (s: number) => s >= 200 && s < 300 ? C.greenLight : s >= 400 && s < 500 ? "#FFF8E1" : s >= 500 ? C.redLight : C.bg;

          const tabs: { key: "keys" | "webhooks" | "docs" | "logs"; label: string; Icon: React.FC<any> }[] = [
            { key: "keys", label: t('api.keys'), Icon: Key },
            { key: "webhooks", label: t('api.webhooks'), Icon: Webhook },
            { key: "docs", label: t('api.docs'), Icon: BookOpen },
            { key: "logs", label: t('api.logs'), Icon: Activity },
          ];

          const endpoints = [
            { module: "Collaborateurs", items: [
              { method: "GET", path: "/collaborateurs", desc: lang === 'fr' ? "Lister tous les collaborateurs" : "List all employees" },
              { method: "POST", path: "/collaborateurs", desc: lang === 'fr' ? "Creer un collaborateur" : "Create employee" },
              { method: "GET", path: "/collaborateurs/{id}", desc: lang === 'fr' ? "Obtenir un collaborateur" : "Get employee" },
              { method: "PUT", path: "/collaborateurs/{id}", desc: lang === 'fr' ? "Mettre a jour un collaborateur" : "Update employee" },
            ]},
            { module: "Parcours", items: [
              { method: "GET", path: "/parcours", desc: lang === 'fr' ? "Lister tous les parcours" : "List all paths" },
              { method: "POST", path: "/parcours", desc: lang === 'fr' ? "Creer un parcours" : "Create path" },
            ]},
            { module: "Documents", items: [
              { method: "GET", path: "/documents", desc: lang === 'fr' ? "Lister les documents" : "List documents" },
              { method: "POST", path: "/documents/upload", desc: lang === 'fr' ? "Uploader un document" : "Upload document" },
            ]},
            { module: "Actions", items: [
              { method: "GET", path: "/actions", desc: lang === 'fr' ? "Lister les actions" : "List actions" },
            ]},
            { module: "NPS & Surveys", items: [
              { method: "GET", path: "/nps-surveys", desc: lang === 'fr' ? "Lister les enquetes" : "List surveys" },
              { method: "POST", path: "/nps-surveys/{id}/send", desc: lang === 'fr' ? "Envoyer une enquete" : "Send survey" },
            ]},
            { module: "Equipment", items: [
              { method: "GET", path: "/equipments", desc: lang === 'fr' ? "Lister les equipements" : "List equipment" },
            ]},
          ];

          const webhookEvents = [
            { group: "Collaborateur", events: ["collaborateur.created", "collaborateur.updated", "collaborateur.deleted"] },
            { group: "Document", events: ["document.submitted", "document.validated", "document.refused"] },
            { group: "Parcours", events: ["parcours.created", "parcours.completed"] },
            { group: "Action", events: ["action.assigned", "action.completed", "action.overdue"] },
          ];

          return (
            <div style={{ marginTop: 12, marginBottom: 28 }}>
              {/* Section header */}
              <div className="iz-card" style={{ ...sCard, marginBottom: 16, padding: "20px 24px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: `${C.pink}15`, display: "flex", alignItems: "center", justifyContent: "center" }}><Code size={20} color={C.pink} /></div>
                  <div>
                    <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>{t('api.title')}</h2>
                    <div style={{ fontSize: 12, color: C.textLight }}>{t('api.desc')}</div>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div style={{ display: "flex", gap: 4, padding: 3, background: C.bg, borderRadius: 8, marginBottom: 16 }}>
                {tabs.map(tb => (
                  <button key={tb.key} onClick={() => setApiTab(tb.key)} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "8px 12px", borderRadius: 6, fontSize: 12, fontWeight: apiTab === tb.key ? 600 : 400, border: "none", cursor: "pointer", fontFamily: font, background: apiTab === tb.key ? C.white : "transparent", color: apiTab === tb.key ? C.pink : C.textMuted, boxShadow: apiTab === tb.key ? "0 1px 3px rgba(0,0,0,.1)" : "none", transition: "all .2s" }}>
                    <tb.Icon size={14} /> {tb.label}
                  </button>
                ))}
              </div>

              {/* ── Tab: API Keys ── */}
              {apiTab === "keys" && (
                <div>
                  <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
                    <button onClick={() => {
                      const newKey = { id: Date.now(), name: "New Key", key: "ilz_live_sk_" + Math.random().toString(36).slice(2, 10) + "...", prefix: "ilz_live_sk_" + Math.random().toString(36).slice(2, 6), scopes: ["collaborateurs:read"], created_at: new Date().toISOString().slice(0, 10), last_used: null, active: true };
                      setApiKeys([newKey, ...mockKeys]);
                      addToast_admin(t('api.new_key'));
                    }} className="iz-btn-pink" style={{ ...sBtn("pink"), fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}><Plus size={14} /> {t('api.new_key')}</button>
                  </div>
                  {mockKeys.length === 0 ? (
                    <div style={{ padding: "40px 20px", textAlign: "center", color: C.textMuted, fontSize: 13 }}><Key size={28} style={{ marginBottom: 8, opacity: .4 }} /><div>{t('api.no_keys')}</div></div>
                  ) : mockKeys.map((k: any) => (
                    <div key={k.id} className="iz-card iz-fade-up" style={{ ...sCard, marginBottom: 10, padding: "16px 20px" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 32, height: 32, borderRadius: 8, background: k.active ? C.greenLight : C.redLight, display: "flex", alignItems: "center", justifyContent: "center" }}><Key size={16} color={k.active ? C.green : C.red} /></div>
                          <div>
                            <div style={{ fontSize: 14, fontWeight: 600 }}>{k.name}</div>
                            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
                              <code style={{ fontSize: 11, fontFamily: "monospace", color: C.textMuted, background: C.bg, padding: "2px 6px", borderRadius: 4 }}>{k.prefix}...</code>
                              <button onClick={() => { navigator.clipboard.writeText(k.key); addToast_admin(t('api.copied')); }} style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}><Copy size={12} color={C.textMuted} /></button>
                            </div>
                          </div>
                        </div>
                        <span style={{ fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 4, background: k.active ? C.greenLight : C.redLight, color: k.active ? C.green : C.red }}>{k.active ? t('api.active') : t('api.revoked')}</span>
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 10 }}>
                        {(k.scopes || []).map((s: string) => (
                          <span key={s} style={{ fontSize: 10, padding: "2px 8px", borderRadius: 10, background: `${SCOPE_COLORS[s] || C.textMuted}15`, color: SCOPE_COLORS[s] || C.textMuted, fontWeight: 500 }}>{s}</span>
                        ))}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 11, color: C.textMuted }}>
                        <div style={{ display: "flex", gap: 16 }}>
                          <span>{t('api.created_at')}: {fmtDate(k.created_at)}</span>
                          <span>{t('api.last_used')}: {k.last_used ? fmtDateTime(k.last_used) : t('api.never')}</span>
                        </div>
                        {k.active && (
                          <button onClick={() => {
                            showConfirm(t('api.revoke_confirm'), () => {
                              const updated = mockKeys.map((mk: any) => mk.id === k.id ? { ...mk, active: false } : mk);
                              setApiKeys(updated);
                              addToast_admin(t('api.revoke'));
                            });
                          }} style={{ ...sBtn("outline"), fontSize: 11, color: C.red, borderColor: C.red, padding: "4px 12px" }}>{t('api.revoke')}</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ── Tab: Webhooks ── */}
              {apiTab === "webhooks" && (
                <div>
                  <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
                    <button onClick={() => {
                      const newWh = { id: Date.now(), url: "https://", events: [], secret: "whsec_" + Math.random().toString(36).slice(2, 10), active: true, last_triggered: null, success_rate: 100 };
                      setApiWebhooks([newWh, ...mockWebhooks]);
                      addToast_admin(t('api.new_webhook'));
                    }} className="iz-btn-pink" style={{ ...sBtn("pink"), fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}><Plus size={14} /> {t('api.new_webhook')}</button>
                  </div>
                  {mockWebhooks.length === 0 ? (
                    <div style={{ padding: "40px 20px", textAlign: "center", color: C.textMuted, fontSize: 13 }}><Webhook size={28} style={{ marginBottom: 8, opacity: .4 }} /><div>{t('api.no_webhooks')}</div></div>
                  ) : mockWebhooks.map((wh: any) => (
                    <div key={wh.id} className="iz-card iz-fade-up" style={{ ...sCard, marginBottom: 10, padding: "16px 20px" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 0 }}>
                          <div style={{ width: 32, height: 32, borderRadius: 8, background: wh.active ? C.greenLight : C.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Webhook size={16} color={wh.active ? C.green : C.textMuted} /></div>
                          <div style={{ minWidth: 0, flex: 1 }}>
                            <div style={{ fontSize: 12, fontFamily: "monospace", color: C.text, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{wh.url}</div>
                            <div style={{ fontSize: 10, color: C.textMuted, marginTop: 2 }}>{t('api.webhook_secret')}: {wh.secret}</div>
                          </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                          <div onClick={() => {
                            const updated = mockWebhooks.map((w: any) => w.id === wh.id ? { ...w, active: !w.active } : w);
                            setApiWebhooks(updated);
                          }} style={{ width: 36, height: 20, borderRadius: 10, background: wh.active ? C.green : C.border, cursor: "pointer", position: "relative", transition: "all .2s" }}>
                            <div style={{ width: 16, height: 16, borderRadius: "50%", background: C.white, position: "absolute", top: 2, left: wh.active ? 18 : 2, transition: "all .2s", boxShadow: "0 1px 3px rgba(0,0,0,.2)" }} />
                          </div>
                          <span style={{ fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 4, background: wh.success_rate >= 99 ? C.greenLight : wh.success_rate >= 90 ? "#FFF8E1" : C.redLight, color: wh.success_rate >= 99 ? C.green : wh.success_rate >= 90 ? "#F9A825" : C.red }}>{wh.success_rate}%</span>
                        </div>
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 10 }}>
                        {(wh.events || []).map((ev: string) => (
                          <span key={ev} style={{ fontSize: 10, padding: "2px 8px", borderRadius: 10, background: `${C.blue}12`, color: C.blue, fontWeight: 500 }}>{ev}</span>
                        ))}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 11, color: C.textMuted }}>
                        <span>{t('api.last_triggered')}: {wh.last_triggered ? fmtDateTime(wh.last_triggered) : t('api.never')}</span>
                        <button onClick={() => {
                          showConfirm(lang === 'fr' ? "Supprimer ce webhook ?" : "Delete this webhook?", () => {
                            const updated = mockWebhooks.filter((w: any) => w.id !== wh.id);
                            setApiWebhooks(updated);
                            addToast_admin(t('api.delete'));
                          });
                        }} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}><Trash2 size={14} color={C.red} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ── Tab: Documentation ── */}
              {apiTab === "docs" && (
                <div>
                  {/* Reference card */}
                  <div className="iz-card" style={{ ...sCard, marginBottom: 16, padding: "20px 24px" }}>
                    <h3 style={{ fontSize: 15, fontWeight: 600, margin: "0 0 16px" }}>{lang === 'fr' ? "Reference API" : "API Reference"}</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
                      <div style={{ padding: "10px 14px", background: C.bg, borderRadius: 8 }}>
                        <div style={{ fontSize: 10, color: C.textMuted, fontWeight: 600, textTransform: "uppercase", marginBottom: 4 }}>{t('api.base_url')}</div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <code style={{ fontSize: 12, fontFamily: "monospace", color: C.pink, fontWeight: 500 }}>https://onboarding.illizeo.com/api/v1</code>
                          <button onClick={() => { navigator.clipboard.writeText("https://onboarding.illizeo.com/api/v1"); addToast_admin(t('api.copied')); }} style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}><Copy size={12} color={C.textMuted} /></button>
                        </div>
                      </div>
                      <div style={{ padding: "10px 14px", background: C.bg, borderRadius: 8 }}>
                        <div style={{ fontSize: 10, color: C.textMuted, fontWeight: 600, textTransform: "uppercase", marginBottom: 4 }}>{t('api.version')}</div>
                        <span style={{ fontSize: 12, fontWeight: 600, color: C.text }}>v1</span>
                      </div>
                      <div style={{ padding: "10px 14px", background: C.bg, borderRadius: 8 }}>
                        <div style={{ fontSize: 10, color: C.textMuted, fontWeight: 600, textTransform: "uppercase", marginBottom: 4 }}>{t('api.auth_header')}</div>
                        <code style={{ fontSize: 11, fontFamily: "monospace", color: C.text }}>Authorization: Bearer {'{'}<span style={{ color: C.pink }}>api_key</span>{'}'}</code>
                      </div>
                      <div style={{ padding: "10px 14px", background: C.bg, borderRadius: 8 }}>
                        <div style={{ fontSize: 10, color: C.textMuted, fontWeight: 600, textTransform: "uppercase", marginBottom: 4 }}>{t('api.rate_limit')}</div>
                        <span style={{ fontSize: 12, fontWeight: 600, color: C.text }}>1 000 {lang === 'fr' ? "requetes/heure" : "requests/hour"}</span>
                      </div>
                    </div>

                    {/* Endpoints by module */}
                    <h4 style={{ fontSize: 13, fontWeight: 600, margin: "0 0 12px", color: C.text }}>Endpoints</h4>
                    {endpoints.map(mod => (
                      <div key={mod.module} style={{ marginBottom: 16 }}>
                        <div style={{ fontSize: 11, fontWeight: 600, color: C.textMuted, textTransform: "uppercase", letterSpacing: .5, marginBottom: 6 }}>{mod.module}</div>
                        {mod.items.map((ep, i) => (
                          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 10px", background: i % 2 === 0 ? C.bg : "transparent", borderRadius: 6, fontSize: 12 }}>
                            <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 4, background: `${METHOD_COLORS[ep.method]}15`, color: METHOD_COLORS[ep.method], minWidth: 44, textAlign: "center", fontFamily: "monospace" }}>{ep.method}</span>
                            <code style={{ fontFamily: "monospace", fontSize: 11, color: C.text, fontWeight: 500 }}>{ep.path}</code>
                            <span style={{ color: C.textMuted, fontSize: 11, marginLeft: "auto" }}>{ep.desc}</span>
                          </div>
                        ))}
                      </div>
                    ))}

                    {/* Webhook events reference */}
                    <h4 style={{ fontSize: 13, fontWeight: 600, margin: "16px 0 12px", color: C.text }}>Webhook Events</h4>
                    {webhookEvents.map(grp => (
                      <div key={grp.group} style={{ marginBottom: 10 }}>
                        <div style={{ fontSize: 11, fontWeight: 600, color: C.textMuted, marginBottom: 4 }}>{grp.group}</div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                          {grp.events.map(ev => (
                            <code key={ev} style={{ fontSize: 10, fontFamily: "monospace", padding: "3px 8px", borderRadius: 4, background: `${C.blue}10`, color: C.blue }}>{ev}</code>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Tab: Call Logs ── */}
              {apiTab === "logs" && (
                <div className="iz-card" style={{ ...sCard, padding: 0, overflow: "hidden" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                    <thead>
                      <tr style={{ background: C.bg, borderBottom: `1px solid ${C.border}` }}>
                        <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 600, color: C.textMuted, fontSize: 10, textTransform: "uppercase" }}>{t('api.method')}</th>
                        <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 600, color: C.textMuted, fontSize: 10, textTransform: "uppercase" }}>{t('api.endpoint')}</th>
                        <th style={{ padding: "10px 12px", textAlign: "center", fontWeight: 600, color: C.textMuted, fontSize: 10, textTransform: "uppercase" }}>{t('api.status')}</th>
                        <th style={{ padding: "10px 12px", textAlign: "right", fontWeight: 600, color: C.textMuted, fontSize: 10, textTransform: "uppercase" }}>{t('api.response_time')}</th>
                        <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 600, color: C.textMuted, fontSize: 10, textTransform: "uppercase" }}>{t('api.key_name')}</th>
                        <th style={{ padding: "10px 12px", textAlign: "right", fontWeight: 600, color: C.textMuted, fontSize: 10, textTransform: "uppercase" }}>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockLogs.map((log: any) => (
                        <tr key={log.id} style={{ borderBottom: `1px solid ${C.border}`, background: log.status >= 500 ? `${C.red}06` : log.status >= 200 && log.status < 300 ? "transparent" : "transparent" }}>
                          <td style={{ padding: "8px 12px" }}>
                            <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 4, background: `${METHOD_COLORS[log.method] || C.textMuted}15`, color: METHOD_COLORS[log.method] || C.textMuted, fontFamily: "monospace" }}>{log.method}</span>
                          </td>
                          <td style={{ padding: "8px 12px" }}>
                            <code style={{ fontSize: 11, fontFamily: "monospace", color: C.text }}>{log.endpoint}</code>
                          </td>
                          <td style={{ padding: "8px 12px", textAlign: "center" }}>
                            <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 4, background: STATUS_BG(log.status), color: STATUS_COLOR(log.status) }}>{log.status}</span>
                          </td>
                          <td style={{ padding: "8px 12px", textAlign: "right", fontFamily: "monospace", fontSize: 11, color: log.response_time_ms > 1000 ? C.red : C.textMuted }}>{log.response_time_ms}ms</td>
                          <td style={{ padding: "8px 12px", fontSize: 11, color: C.textMuted }}>{log.api_key_name}</td>
                          <td style={{ padding: "8px 12px", textAlign: "right", fontSize: 11, color: C.textMuted }}>{fmtDateTime(log.timestamp)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })()}

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
                        <div style={{ fontSize: 16, fontWeight: 600, color: C.green, marginBottom: 4 }}>{t('common.connected')}</div>
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
                      }} style={{ ...sBtn("outline"), color: C.red, borderColor: C.red, fontSize: 13, width: "100%" }}>{t('common.disconnect')}</button>
                    </div>
                  ) : (
                    <div>
                      <div style={{ textAlign: "center", marginBottom: 24 }}>
                        <div style={{ width: 64, height: 64, borderRadius: 16, background: `${selectedMeta.color}15`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                          <selectedMeta.Icon size={32} color={selectedMeta.color} />
                        </div>
                        <h3 style={{ fontSize: 17, fontWeight: 600, margin: "0 0 8px" }}>{t('integ.connect')} {selectedIntegration.nom}</h3>
                        <p style={{ fontSize: 13, color: C.textLight, margin: "0 0 20px", lineHeight: 1.5 }}>
                          {t('integ.connect_desc')}
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
                        <Link size={18} /> {integrationSaving ? t('integ.redirecting') : `${t('integ.connect_to')} DocuSign`}
                      </button>

                      <div style={{ textAlign: "center", fontSize: 12, color: C.textLight, margin: "16px 0 4px" }}>
                        {t('integ.redirect_hint')}
                      </div>

                      {integrationConfig._oauthError && (
                        <div style={{ marginTop: 12, padding: "10px 14px", background: C.redLight, borderRadius: 8, fontSize: 12, color: C.red, display: "flex", alignItems: "center", gap: 8 }}>
                          <AlertTriangle size={14} /> {t('integ.oauth_error')}
                        </div>
                      )}

                      {/* Mode 2: Self-service — client enters own keys */}
                      {integrationConfig._needKeys && (
                        <div style={{ marginTop: 20, padding: "20px", background: C.bg, borderRadius: 12 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 4 }}>{t('integ.manual_config')}</div>
                          <div style={{ fontSize: 11, color: C.textLight, marginBottom: 16 }}>{t('integ.manual_desc')}</div>
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
                            {integrationSaving ? t('integ.redirecting') : t('integ.save_connect')}
                          </button>
                          <div style={{ marginTop: 12, fontSize: 10, color: C.textMuted }}>
                            Redirect URI à configurer dans votre app DocuSign :<br/>
                            <code style={{ fontSize: 10, fontFamily: "monospace" }}>{window.location.origin.replace('3000', '8000')}/api/v1/integrations/docusign/callback</code>
                          </div>
                        </div>
                      )}

                      <div style={{ marginTop: 20, padding: "12px 16px", background: C.bg, borderRadius: 8, fontSize: 11, color: C.textLight }}>
                        <div style={{ fontWeight: 600, marginBottom: 4, color: C.text }}>{t('integ.how_works')}</div>
                        <div>1. {lang === 'fr' ? 'Cliquez sur "Connecter à DocuSign"' : `Click "${t('integ.connect_to')} DocuSign"`}</div>
                        <div>2. {lang === 'fr' ? 'Authentifiez-vous avec votre compte DocuSign' : 'Authenticate with your DocuSign account'}</div>
                        <div>3. {lang === 'fr' ? 'Autorisez Illizeo à accéder à votre compte' : 'Authorize Illizeo to access your account'}</div>
                        <div>4. {lang === 'fr' ? 'Vous êtes automatiquement redirigé ici' : 'You are automatically redirected here'}</div>
                      </div>
                    </div>
                  )
                ) : selectedMeta.apiKey ? (() => {
                  const cFields = (selectedMeta as any).configFields || [{ key: "api_key", label: "Clé API", type: "password" }];
                  const connectEp = (selectedMeta as any).connectEndpoint || "ugosign/connect";
                  const disconnectEp = (selectedMeta as any).disconnectEndpoint || "ugosign/disconnect";
                  const guide = (selectedMeta as any).guide || [
                    { title: `1. ${t('integ.step_login')}`, text: `${lang === 'fr' ? 'Accédez à' : 'Access'} ${selectedIntegration.nom}` },
                    { title: `2. ${t('integ.step_api')}`, text: t('integ.step_api_desc') },
                    { title: `3. ${t('integ.step_copy')}`, text: t('integ.step_copy_desc') },
                  ];
                  const allFieldsFilled = cFields.every((f: any) => (integrationConfig[f.key] || "").trim());
                  if (selectedIntegration.connecte) return (
                    <div>
                      <div style={{ padding: "20px", background: C.greenLight, borderRadius: 12, textAlign: "center", marginBottom: 20 }}>
                        <CheckCircle size={28} color={C.green} style={{ marginBottom: 8 }} />
                        <div style={{ fontSize: 16, fontWeight: 600, color: C.green, marginBottom: 4 }}>{t('common.connected')}</div>
                        <div style={{ fontSize: 12, color: C.text }}>{integrationConfig.organization_name || integrationConfig.subdomain || selectedIntegration.nom}</div>
                      </div>
                      <div style={{ padding: "16px", background: C.bg, borderRadius: 10, marginBottom: 16 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: C.text, marginBottom: 8 }}>Détails</div>
                        <div style={{ fontSize: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                          {integrationConfig.total_employees != null && <div><span style={{ color: C.textMuted }}>Employés</span><div style={{ fontWeight: 500 }}>{integrationConfig.total_employees}</div></div>}
                          {integrationConfig.members_count != null && <div><span style={{ color: C.textMuted }}>Membres</span><div style={{ fontWeight: 500 }}>{integrationConfig.members_count}</div></div>}
                          {integrationConfig.subdomain && <div><span style={{ color: C.textMuted }}>Instance</span><div style={{ fontWeight: 500 }}>{integrationConfig.subdomain}.ilucca.net</div></div>}
                          <div><span style={{ color: C.textMuted }}>{t('common.connected_on')}</span><div style={{ fontWeight: 500 }}>{fmtDate(integrationConfig.connected_at)}</div></div>
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
                      }} style={{ ...sBtn("outline"), color: C.red, borderColor: C.red, fontSize: 13, width: "100%" }}>{t('common.disconnect')}</button>
                    </div>
                  );
                  return (
                    <div>
                      <div style={{ textAlign: "center", marginBottom: 24 }}>
                        <div style={{ width: 64, height: 64, borderRadius: 16, background: `${selectedMeta.color}15`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                          <selectedMeta.Icon size={32} color={selectedMeta.color} />
                        </div>
                        <h3 style={{ fontSize: 17, fontWeight: 600, margin: "0 0 4px" }}>{t('integ.connect')} {selectedIntegration.nom}</h3>
                        <p style={{ fontSize: 12, color: C.textLight, margin: 0 }}>{t('integ.connect_api_desc')}</p>
                      </div>
                      {cFields.map((f: any) => (
                        <div key={f.key} style={{ marginBottom: 16 }}>
                          <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>{f.label}</label>
                          <input type={f.type === "password" ? "password" : "text"} value={integrationConfig[f.key] || ""} onChange={e => setIntegrationConfig(prev => ({ ...prev, [f.key]: e.target.value }))} placeholder={f.type === "password" ? "••••••••" : ""} style={{ ...sInput, fontSize: 13 }} />
                        </div>
                      ))}
                      <div style={{ padding: "14px 16px", background: C.bg, borderRadius: 10, marginBottom: 20, fontSize: 11, color: C.textLight }}>
                        <div style={{ fontWeight: 600, marginBottom: 6, color: C.text }}>{t('integ.procedure')} {selectedIntegration.nom}</div>
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
                        {integrationSaving ? t('common.checking') : t('common.test_connect')}
                      </button>
                    </div>
                  );
                })() : selectedMeta.sapConnect ? (
                  selectedIntegration.connecte ? (
                    <div>
                      <div style={{ padding: "20px", background: C.greenLight, borderRadius: 12, textAlign: "center", marginBottom: 20 }}>
                        <CheckCircle size={28} color={C.green} style={{ marginBottom: 8 }} />
                        <div style={{ fontSize: 16, fontWeight: 600, color: C.green, marginBottom: 4 }}>{t('common.connected')}</div>
                        <div style={{ fontSize: 12, color: C.text }}>{integrationConfig.company_name || integrationConfig.company_id || "SAP SuccessFactors"}</div>
                      </div>
                      <div style={{ padding: "16px", background: C.bg, borderRadius: 10, marginBottom: 16 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: C.text, marginBottom: 8 }}>{t('sap.connection_details')}</div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, fontSize: 12 }}>
                          <div><span style={{ color: C.textMuted }}>Company ID</span><div style={{ fontWeight: 500, marginTop: 2 }}>{integrationConfig.company_id || "—"}</div></div>
                          <div><span style={{ color: C.textMuted }}>{t('sap.country')}</span><div style={{ fontWeight: 500, marginTop: 2 }}>{integrationConfig.company_country || "—"}</div></div>
                          <div><span style={{ color: C.textMuted }}>{t('sap.user')}</span><div style={{ fontWeight: 500, marginTop: 2 }}>{integrationConfig.username || integrationConfig.saml_user || "—"}</div></div>
                          <div><span style={{ color: C.textMuted }}>{t('common.connected_on')}</span><div style={{ fontWeight: 500, marginTop: 2 }}>{fmtDate(integrationConfig.connected_at)}</div></div>
                        </div>
                      </div>
                      <div style={{ padding: "12px 16px", background: C.bg, borderRadius: 8, marginBottom: 16, fontSize: 11, color: C.textLight }}>
                        {t('sap.server')} : {integrationConfig.base_url || "—"}
                      </div>
                      <button onClick={async () => {
                        setConfirmDialog({ message: t('sap.disconnect_confirm'), onConfirm: async () => {
                          try {
                            await apiFetch(`/integrations/${selectedIntegration.id}/sap/disconnect`, { method: "POST" });
                            addToast_admin(t('sap.disconnected'));
                            refetchIntegrations(); setIntegrationPanelId(null);
                          } catch { addToast_admin(t('toast.error')); }
                          setConfirmDialog(null);
                        }});
                      }} style={{ ...sBtn("outline"), color: C.red, borderColor: C.red, fontSize: 13, width: "100%" }}>{t('common.disconnect')}</button>
                    </div>
                  ) : (() => {
                    const sapAuthMode = integrationConfig.auth_mode || "oauth2";
                    const sapOAuthReady = sapAuthMode === "oauth2" && integrationConfig.base_url && integrationConfig.company_id && integrationConfig.client_id && integrationConfig.client_secret && integrationConfig.saml_user;
                    const sapBasicReady = sapAuthMode === "basic" && integrationConfig.base_url && integrationConfig.company_id && integrationConfig.username && integrationConfig.password;
                    return (
                    <div>
                      <div style={{ textAlign: "center", marginBottom: 20 }}>
                        <div style={{ width: 64, height: 64, borderRadius: 16, background: `${selectedMeta.color}15`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                          <selectedMeta.Icon size={32} color={selectedMeta.color} />
                        </div>
                        <h3 style={{ fontSize: 17, fontWeight: 600, margin: "0 0 4px" }}>{t('sap.connect_title')}</h3>
                        <p style={{ fontSize: 12, color: C.textLight, margin: 0 }}>{t('sap.connect_desc')}</p>
                      </div>

                      {/* Auth mode toggle */}
                      <div style={{ marginBottom: 16 }}>
                        <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>{t('sap.auth_mode')}</label>
                        <div style={{ display: "flex", gap: 4, padding: 2, background: C.bg, borderRadius: 6 }}>
                          <button onClick={() => setIntegrationConfig(prev => ({ ...prev, auth_mode: "oauth2" }))} style={{ flex: 1, padding: "6px 10px", borderRadius: 4, fontSize: 11, fontWeight: sapAuthMode === "oauth2" ? 600 : 400, border: "none", cursor: "pointer", fontFamily: font, background: sapAuthMode === "oauth2" ? C.white : "transparent", color: sapAuthMode === "oauth2" ? C.pink : C.textMuted, boxShadow: sapAuthMode === "oauth2" ? "0 1px 3px rgba(0,0,0,.1)" : "none" }}>{t('sap.auth_oauth')}</button>
                          <button onClick={() => setIntegrationConfig(prev => ({ ...prev, auth_mode: "basic" }))} style={{ flex: 1, padding: "6px 10px", borderRadius: 4, fontSize: 11, fontWeight: sapAuthMode === "basic" ? 600 : 400, border: "none", cursor: "pointer", fontFamily: font, background: sapAuthMode === "basic" ? C.white : "transparent", color: sapAuthMode === "basic" ? C.text : C.textMuted, boxShadow: sapAuthMode === "basic" ? "0 1px 3px rgba(0,0,0,.1)" : "none" }}>{t('sap.auth_basic')}</button>
                        </div>
                      </div>

                      <div style={{ marginBottom: 16 }}>
                        <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>{t('sap.api_url')}</label>
                        <select value={integrationConfig.base_url || ""} onChange={e => setIntegrationConfig(prev => ({ ...prev, base_url: e.target.value }))} style={{ ...sInput, fontSize: 12, cursor: "pointer" }}>
                          <option value="">{t('sap.select_dc')}</option>
                          <optgroup label="Production — Europe">
                            <option value="https://api2.successfactors.eu">DC2 — Rot, Germany — api2.successfactors.eu</option>
                            <option value="https://api012.successfactors.eu">DC12 — Amsterdam, Netherlands — api012.successfactors.eu</option>
                            <option value="https://api55.successfactors.eu">DC55 — Frankfurt, Germany — api55.successfactors.eu</option>
                          </optgroup>
                          <optgroup label="Production — North America">
                            <option value="https://api4.successfactors.com">DC4 — Ashburn, Virginia — api4.successfactors.com</option>
                            <option value="https://api8.successfactors.com">DC8 — Chandler, Arizona — api8.successfactors.com</option>
                            <option value="https://api10.successfactors.com">DC10 — Sterling, Virginia — api10.successfactors.com</option>
                            <option value="https://api17.sapsf.com">DC17 — Colorado Springs — api17.sapsf.com</option>
                            <option value="https://api18.sapsf.com">DC18 — Toronto, Canada — api18.sapsf.com</option>
                          </optgroup>
                          <optgroup label="Production — Asia Pacific">
                            <option value="https://api16.sapsf.com">DC16 — Sydney, Australia — api16.sapsf.com</option>
                            <option value="https://api19.sapsf.com">DC19 — Seoul, South Korea — api19.sapsf.com</option>
                            <option value="https://api35.sapsf.com">DC35 — Tokyo, Japan — api35.sapsf.com</option>
                            <option value="https://api45.sapsf.com">DC45 — Singapore — api45.sapsf.com</option>
                          </optgroup>
                          <optgroup label="Production — Middle East / Africa">
                            <option value="https://api56.sapsf.com">DC56 — UAE (Riyadh) — api56.sapsf.com</option>
                            <option value="https://api22.sapsf.com">DC22 — Riyadh, KSA — api22.sapsf.com</option>
                          </optgroup>
                          <optgroup label="Production — China">
                            <option value="https://api15.sapsf.cn">DC15 — Shanghai — api15.sapsf.cn</option>
                          </optgroup>
                          <optgroup label="Production — Brazil">
                            <option value="https://api28.sapsf.com">DC28 — São Paulo — api28.sapsf.com</option>
                          </optgroup>
                          <optgroup label="Demo / Sandbox">
                            <option value="https://apisalesdemo2.successfactors.eu">Sales Demo EU — apisalesdemo2.successfactors.eu</option>
                            <option value="https://apisalesdemo4.successfactors.com">Sales Demo US (DC4) — apisalesdemo4.successfactors.com</option>
                            <option value="https://apisalesdemo8.successfactors.com">Sales Demo US (DC8) — apisalesdemo8.successfactors.com</option>
                          </optgroup>
                        </select>
                      </div>
                      <div style={{ marginBottom: 16 }}>
                        <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Company ID *</label>
                        <input value={integrationConfig.company_id || ""} onChange={e => setIntegrationConfig(prev => ({ ...prev, company_id: e.target.value }))} placeholder="Ex: SFCPART000001" style={{ ...sInput, fontSize: 12 }} />
                      </div>

                      {sapAuthMode === "oauth2" ? (
                        <>
                          <div style={{ marginBottom: 16 }}>
                            <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>{t('sap.client_id')}</label>
                            <input value={integrationConfig.client_id || ""} onChange={e => setIntegrationConfig(prev => ({ ...prev, client_id: e.target.value }))} style={{ ...sInput, fontSize: 12 }} />
                          </div>
                          <div style={{ marginBottom: 16 }}>
                            <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>{t('sap.client_secret')}</label>
                            <input type="password" value={integrationConfig.client_secret || ""} onChange={e => setIntegrationConfig(prev => ({ ...prev, client_secret: e.target.value }))} style={{ ...sInput, fontSize: 12 }} />
                          </div>
                          <div style={{ marginBottom: 16 }}>
                            <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>{t('sap.saml_user')}</label>
                            <input value={integrationConfig.saml_user || ""} onChange={e => setIntegrationConfig(prev => ({ ...prev, saml_user: e.target.value }))} placeholder="Ex: api_illizeo" style={{ ...sInput, fontSize: 12 }} />
                          </div>
                          <div style={{ marginBottom: 20 }}>
                            <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>{t('sap.token_url')}</label>
                            <input value={integrationConfig.token_url || ""} onChange={e => setIntegrationConfig(prev => ({ ...prev, token_url: e.target.value }))} placeholder={`${integrationConfig.base_url || "https://api2.successfactors.eu"}/oauth/token`} style={{ ...sInput, fontSize: 12 }} />
                          </div>
                        </>
                      ) : (
                        <>
                          <div style={{ marginBottom: 16 }}>
                            <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>{t('sap.api_user')}</label>
                            <input value={integrationConfig.username || ""} onChange={e => setIntegrationConfig(prev => ({ ...prev, username: e.target.value }))} placeholder="Ex: sfadmin" style={{ ...sInput, fontSize: 12 }} />
                          </div>
                          <div style={{ marginBottom: 20 }}>
                            <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>{t('sap.password')}</label>
                            <input type="password" value={integrationConfig.password || ""} onChange={e => setIntegrationConfig(prev => ({ ...prev, password: e.target.value }))} style={{ ...sInput, fontSize: 12 }} />
                          </div>
                        </>
                      )}

                      <button disabled={integrationSaving || !(sapOAuthReady || sapBasicReady)} onClick={async () => {
                        setIntegrationSaving(true);
                        try {
                          const payload = sapAuthMode === "oauth2"
                            ? { auth_mode: "oauth2", base_url: integrationConfig.base_url, company_id: integrationConfig.company_id, client_id: integrationConfig.client_id, client_secret: integrationConfig.client_secret, saml_user: integrationConfig.saml_user, token_url: integrationConfig.token_url }
                            : { auth_mode: "basic", base_url: integrationConfig.base_url, company_id: integrationConfig.company_id, username: integrationConfig.username, password: integrationConfig.password };
                          const res = await apiFetch<{ success: boolean; message: string }>(`/integrations/${selectedIntegration.id}/sap/connect`, {
                            method: "POST", body: JSON.stringify(payload),
                          });
                          if (res.success) {
                            addToast_admin(t('sap.connected'));
                            refetchIntegrations(); setIntegrationPanelId(null);
                          } else {
                            addToast_admin(res.message || t('toast.error'));
                          }
                        } catch (err: any) {
                          try { const p = JSON.parse(err.message); addToast_admin(p.message || t('sap.invalid_creds')); } catch { addToast_admin(t('sap.invalid_creds')); }
                        }
                        finally { setIntegrationSaving(false); }
                      }} className="iz-btn-pink" style={{ ...sBtn("pink"), fontSize: 14, padding: "12px 0", width: "100%", opacity: integrationSaving || !(sapOAuthReady || sapBasicReady) ? 0.5 : 1 }}>
                        {integrationSaving ? t('common.checking') : t('common.test_connect')}
                      </button>

                      {/* Setup guide */}
                      <div style={{ marginTop: 20, padding: "16px", background: C.bg, borderRadius: 10, fontSize: 11, color: C.textLight }}>
                        <div style={{ fontWeight: 700, fontSize: 12, color: C.text, marginBottom: 4 }}>{t('integ.procedure')} SuccessFactors</div>
                        <div style={{ padding: "6px 10px", background: C.amberLight, borderRadius: 6, marginBottom: 12, fontSize: 10, color: C.amber }} dangerouslySetInnerHTML={{ __html: t('sap.odata_warning') }} />
                        <div style={{ padding: "8px 10px", background: C.white, borderRadius: 6, marginBottom: 12, fontFamily: "monospace", fontSize: 10, lineHeight: 1.6 }}>
                          <b>Admin Privileges</b> → Manage Integration Tools<br/>
                          <b>User</b> → Read (Employee Data)<br/>
                          <b>Employee Central</b> → Read (EmpJob, EmpEmployment)<br/>
                          <b>Metadata</b> → Read (FOCompany, FODepartment, FOLocation, FOJobCode)<br/>
                          <b>OData API</b> → General OData API Access
                        </div>
                      </div>
                    </div>
                    );
                  })()
                ) : selectedMeta.teamsConnect ? (
                  selectedIntegration.connecte ? (
                    <div>
                      <div style={{ padding: "20px", background: C.greenLight, borderRadius: 12, textAlign: "center", marginBottom: 20 }}>
                        <CheckCircle size={28} color={C.green} style={{ marginBottom: 8 }} />
                        <div style={{ fontSize: 16, fontWeight: 600, color: C.green, marginBottom: 4 }}>{t('common.connected')}</div>
                        <div style={{ fontSize: 12, color: C.text }}>{t('teams.webhook_active')}{integrationConfig.graph_connected ? " + Graph API" : ""}</div>
                      </div>
                      <div style={{ padding: "16px", background: C.bg, borderRadius: 10, marginBottom: 16 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: C.text, marginBottom: 10 }}>{t('teams.active_features')}</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 12 }}>
                          {[
                            { Icon: PartyPopper, color: "#4CAF50", label: t('teams.welcome'), desc: t('teams.welcome_desc'), active: true },
                            { Icon: AlertTriangle, color: "#F9A825", label: t('teams.late_alerts'), desc: t('teams.late_alerts_desc'), active: true },
                            { Icon: FileText, color: "#1A73E8", label: t('teams.documents'), desc: t('teams.documents_desc'), active: true },
                            { Icon: Trophy, color: "#C2185B", label: t('teams.path_complete'), desc: t('teams.path_complete_desc'), active: true },
                            { Icon: CalendarDays, color: "#7B5EA7", label: t('teams.auto_meetings'), desc: t('teams.auto_meetings_desc'), active: !!integrationConfig.graph_connected },
                            { Icon: Bell, color: "#E65100", label: t('teams.reminders'), desc: t('teams.reminders_desc'), active: true },
                          ].map(f => (
                            <div key={f.label} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", background: C.white, borderRadius: 8 }}>
                              <div style={{ width: 28, height: 28, borderRadius: 6, background: `${(f as any).color || C.pink}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><f.Icon size={14} color={(f as any).color || C.pink} /></div>
                              <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 500, color: C.text }}>{f.label}</div>
                                <div style={{ fontSize: 10, color: C.textMuted }}>{f.desc}</div>
                              </div>
                              <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 4, background: f.active ? C.greenLight : C.bg, color: f.active ? C.green : C.textMuted }}>{f.active ? t('tpl.status_active') : t('teams.graph_required')}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <button onClick={async () => {
                        try {
                          await apiFetch(`/integrations/${selectedIntegration.id}/teams/test`, { method: "POST" });
                          addToast_admin(t('teams.test_sent'));
                        } catch { addToast_admin(t('toast.error')); }
                      }} className="iz-btn-outline" style={{ ...sBtn("outline"), fontSize: 13, width: "100%", marginBottom: 12 }}>{t('teams.send_test')}</button>
                      <button onClick={async () => {
                        setConfirmDialog({ message: t('teams.disconnect_confirm'), onConfirm: async () => {
                          try {
                            await apiFetch(`/integrations/${selectedIntegration.id}/teams/disconnect`, { method: "POST" });
                            addToast_admin(t('teams.disconnected')); refetchIntegrations(); setIntegrationPanelId(null);
                          } catch { addToast_admin(t('toast.error')); }
                          setConfirmDialog(null);
                        }});
                      }} style={{ ...sBtn("outline"), color: C.red, borderColor: C.red, fontSize: 13, width: "100%" }}>{t('common.disconnect')}</button>
                    </div>
                  ) : (
                    <div>
                      <div style={{ textAlign: "center", marginBottom: 20 }}>
                        <div style={{ width: 64, height: 64, borderRadius: 16, background: "#6264A715", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                          <Users size={32} color="#6264A7" />
                        </div>
                        <h3 style={{ fontSize: 17, fontWeight: 600, margin: "0 0 4px" }}>{t('integ.connect')} Microsoft Teams</h3>
                        <p style={{ fontSize: 12, color: C.textLight, margin: 0 }}>{lang === 'fr' ? "Automatisez vos processus d'onboarding dans Teams" : "Automate your onboarding processes in Teams"}</p>
                      </div>

                      {/* Features covered */}
                      <div style={{ padding: "16px", background: C.white, border: `1px solid ${C.border}`, borderRadius: 10, marginBottom: 16 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: C.text, marginBottom: 10 }}>{t('teams.features_included')}</div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 11 }}>
                          {[
                            { Icon: PartyPopper, color: "#4CAF50", label: t('teams.welcome'), desc: t('teams.welcome_desc') },
                            { Icon: AlertTriangle, color: "#F9A825", label: t('teams.late_alerts'), desc: t('teams.late_alerts_desc') },
                            { Icon: FileText, color: "#1A73E8", label: t('teams.documents'), desc: t('teams.documents_desc') },
                            { Icon: Trophy, color: "#C2185B", label: t('teams.path_complete'), desc: t('teams.path_complete_desc') },
                            { Icon: CalendarDays, color: "#7B5EA7", label: t('teams.auto_meetings'), desc: t('teams.auto_meetings_desc') },
                            { Icon: Bell, color: "#E65100", label: t('teams.reminders'), desc: t('teams.reminders_desc') },
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
                        <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 4 }}>{t('teams.step1_title')}</div>
                        <div style={{ fontSize: 11, color: C.textLight, marginBottom: 12 }}>{t('teams.step1_desc')}</div>
                        <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>{t('teams.webhook_url')}</label>
                        <input value={integrationConfig.webhook_url || ""} onChange={e => setIntegrationConfig(prev => ({ ...prev, webhook_url: e.target.value }))} placeholder="https://prod-xx.westeurope.logic.azure.com/..." style={{ ...sInput, fontSize: 12 }} />
                      </div>

                      {/* Step 2: Graph API (optional) */}
                      <div style={{ padding: "16px", background: C.bg, borderRadius: 10, marginBottom: 20 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 4 }}>{t('teams.step2_title')}</div>
                        <div style={{ fontSize: 11, color: C.textLight, marginBottom: 12 }}>{t('teams.step2_desc')}</div>
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
                            if (!graphRes.success) addToast_admin("Webhook OK — Graph API: " + graphRes.message);
                          }

                          addToast_admin(t('teams.connected')); refetchIntegrations(); setIntegrationPanelId(null);
                        } catch (err: any) {
                          try { const p = JSON.parse(err.message); addToast_admin(p.message || "Erreur"); } catch { addToast_admin("Erreur de connexion"); }
                        }
                        finally { setIntegrationSaving(false); }
                      }} className="iz-btn-pink" style={{ ...sBtn("pink"), fontSize: 14, padding: "12px 0", width: "100%", opacity: !(integrationConfig.webhook_url || "").trim() ? 0.5 : 1 }}>
                        {integrationSaving ? t('common.connecting') : t('common.test_connect')}
                      </button>

                      <div style={{ marginTop: 20, padding: "14px 16px", background: C.bg, borderRadius: 10, fontSize: 11, color: C.textLight }}>
                        <div style={{ fontWeight: 700, fontSize: 12, color: C.text, marginBottom: 8 }}>{t('teams.how_to_title')}</div>
                        <div style={{ padding: "6px 10px", background: C.amberLight, borderRadius: 6, marginBottom: 10, fontSize: 10, color: C.amber }} dangerouslySetInnerHTML={{ __html: t('teams.how_to_warning') }} />
                        <div style={{ marginBottom: 8 }}>
                          <div style={{ fontWeight: 600, color: C.text }}>{t('teams.step_open')}</div>
                          <div dangerouslySetInnerHTML={{ __html: t('teams.step_open_desc') }} />
                        </div>
                        <div style={{ marginBottom: 8 }}>
                          <div style={{ fontWeight: 600, color: C.text }}>{t('teams.step_create')}</div>
                          <div dangerouslySetInnerHTML={{ __html: t('teams.step_create_desc') }} />
                        </div>
                        <div style={{ marginBottom: 8 }}>
                          <div style={{ fontWeight: 600, color: C.text }}>{t('teams.step_configure')}</div>
                          <div dangerouslySetInnerHTML={{ __html: t('teams.step_configure_desc') }} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: C.text }}>{t('teams.step_copy')}</div>
                          <div dangerouslySetInnerHTML={{ __html: t('teams.step_copy_desc') }} />
                        </div>
                      </div>
                    </div>
                  )
                ) : selectedMeta.fields.length === 0 ? (
                  <div style={{ padding: "20px", background: C.greenLight, borderRadius: 10, textAlign: "center" }}>
                    <CheckCircle size={24} color={C.green} style={{ marginBottom: 8 }} />
                    <div style={{ fontSize: 14, fontWeight: 500, color: C.green }}>{t('integ.native_ok')}</div>
                  </div>
                ) : (
                  <>
                    <div style={{ padding: "12px 16px", background: C.bg, borderRadius: 8, marginBottom: 20, fontSize: 12, color: C.textLight }}>
                      {lang === 'fr' ? `Configurez vos identifiants API pour connecter ${selectedIntegration.nom}. Les secrets sont chiffrés et ne sont jamais exposés.` : `Configure your API credentials to connect ${selectedIntegration.nom}. Secrets are encrypted and never exposed.`}
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

                {/* ─── FIELD MAPPING SECTION ─── */}
                {selectedIntegration.connecte && (() => {
                  const ILLIZEO_FIELDS = [
                    { key: "prenom", label: "Prénom", required: true, group: "identity" },
                    { key: "nom", label: "Nom", required: true, group: "identity" },
                    { key: "email", label: "Email", required: true, group: "identity" },
                    { key: "date_debut", label: "Date de début", required: true, group: "identity" },
                    { key: "poste", label: "Poste / Fonction", required: false, group: "job" },
                    { key: "departement", label: "Département", required: false, group: "job" },
                    { key: "site", label: "Site / Bureau", required: false, group: "job" },
                    { key: "manager_email", label: "Email du manager", required: false, group: "job" },
                    { key: "type_contrat", label: "Type de contrat", required: false, group: "contract" },
                    { key: "date_fin_essai", label: "Date fin période d'essai", required: false, group: "contract" },
                    { key: "date_fin_contrat", label: "Date fin de contrat", required: false, group: "contract" },
                    { key: "salaire", label: "Salaire (pour info RH)", required: false, group: "contract" },
                    { key: "telephone", label: "Téléphone", required: false, group: "personal" },
                    { key: "adresse", label: "Adresse", required: false, group: "personal" },
                    { key: "nationalite", label: "Nationalité", required: false, group: "personal" },
                    { key: "numero_avs", label: "Numéro AVS / SS", required: false, group: "personal" },
                  ];

                  const SOURCE_FIELDS: Record<string, string[]> = {
                    sap: ["PerPersonal.firstName", "PerPersonal.lastName", "PerEmail.emailAddress", "EmpJob.startDate", "EmpJob.jobTitle", "EmpJob.department", "EmpJob.location", "EmpJob.managerId", "EmpEmployment.employmentType", "EmpJob.probationEndDate", "EmpEmployment.endDate", "EmpCompensation.payGrade", "PerPhone.phoneNumber", "PerAddressDEFLT.address1", "PerPersonal.nationality", "PerNationalId.nationalId"],
                    personio: ["first_name", "last_name", "email", "hire_date", "position", "department", "office", "supervisor.email", "employment_type", "probation_end", "contract_end_date", "salary", "phone", "address", "nationality", "social_security"],
                    bamboohr: ["firstName", "lastName", "workEmail", "hireDate", "jobTitle", "department", "location", "supervisorEmail", "employmentStatus", "customProbationEnd", "terminationDate", "payRate", "mobilePhone", "homeAddress", "nationality", "ssn"],
                    workday: ["Worker.Name.First", "Worker.Name.Last", "Worker.Email", "Worker.HireDate", "Position.Title", "Organization.Name", "Location.Name", "Manager.Email", "Worker.ContractType", "Worker.ProbationEnd", "Worker.ContractEnd", "Compensation.Amount", "Worker.Phone", "Worker.Address", "Worker.Nationality", "Worker.NationalID"],
                    lucca: ["firstName", "lastName", "mail", "dtContractStart", "jobTitle", "department.name", "legalEntity.name", "manager.mail", "contract", "dtContractEnd", "dtContractEnd", "salary", "phonePro", "address", "nationality", "registrationNumber"],
                    taleez: ["candidate.firstName", "candidate.lastName", "candidate.email", "hiring.startDate", "job.title", "job.department", "job.location", "hiring.managerEmail", "hiring.contractType", "hiring.probationEnd", "hiring.contractEnd", "hiring.salary", "candidate.phone", "candidate.address", "candidate.nationality", "candidate.socialSecurityNumber"],
                    default: ["first_name", "last_name", "email", "start_date", "job_title", "department", "location", "manager_email", "contract_type", "probation_end", "contract_end", "salary", "phone", "address", "nationality", "social_security_number"],
                  };

                  const provider = selectedIntegration.provider;
                  const sourceFields = SOURCE_FIELDS[provider] || SOURCE_FIELDS.default;
                  const mappedCount = integrationMappings.filter((m: any) => m.source).length;
                  const totalCount = ILLIZEO_FIELDS.length;

                  const GROUP_LABELS: Record<string, string> = {
                    identity: lang === "fr" ? "Identité" : "Identity",
                    job: lang === "fr" ? "Poste" : "Job",
                    contract: lang === "fr" ? "Contrat" : "Contract",
                    personal: lang === "fr" ? "Personnel" : "Personal",
                  };

                  const TRANSFORM_OPTIONS = [
                    { value: "none", label: t("mapping.none") },
                    { value: "uppercase", label: lang === "fr" ? "Majuscules" : "Uppercase" },
                    { value: "lowercase", label: lang === "fr" ? "Minuscules" : "Lowercase" },
                    { value: "date_format", label: lang === "fr" ? "Format date" : "Date format" },
                    { value: "custom", label: "Custom" },
                  ];

                  const getMapping = (targetKey: string) => integrationMappings.find((m: any) => m.target === targetKey) || { target: targetKey, source: "", transform: "none" };

                  const updateMapping = (targetKey: string, field: string, value: string) => {
                    const exists = integrationMappings.find((m: any) => m.target === targetKey);
                    if (exists) {
                      setIntegrationMappings(integrationMappings.map((m: any) => m.target === targetKey ? { ...m, [field]: value } : m));
                    } else {
                      setIntegrationMappings([...integrationMappings, { target: targetKey, source: field === "source" ? value : "", transform: field === "transform" ? value : "none" }]);
                    }
                  };

                  const autoDetect = () => {
                    const newMappings = ILLIZEO_FIELDS.map((f, i) => ({
                      target: f.key,
                      source: sourceFields[i] || "",
                      transform: "none",
                    }));
                    setIntegrationMappings(newMappings);
                  };

                  const tabs: { key: "fields" | "values" | "parcours"; label: string }[] = [
                    { key: "fields", label: t("mapping.fields") },
                    { key: "values", label: t("mapping.values") },
                    { key: "parcours", label: t("mapping.parcours") },
                  ];

                  return (
                    <div style={{ marginTop: 24, borderTop: `1px solid ${C.border}`, paddingTop: 20 }}>
                      {/* Section header */}
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <Sparkles size={18} color={C.pink} />
                          <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>{t("mapping.title")}</h3>
                        </div>
                        <span style={{ fontSize: 11, color: C.textMuted }}>{mappedCount}/{totalCount} {t("mapping.mapped").toLowerCase()}</span>
                      </div>
                      <div style={{ fontSize: 12, color: C.textLight, marginBottom: 14 }}>{t("mapping.desc")}</div>

                      {/* Sub-tabs */}
                      <div style={{ display: "flex", gap: 4, marginBottom: 16, background: C.bg, borderRadius: 8, padding: 3 }}>
                        {tabs.map(tab => (
                          <button key={tab.key} onClick={() => setIntegrationMappingTab(tab.key)} style={{
                            flex: 1, padding: "7px 0", fontSize: 12, fontWeight: 600, border: "none", borderRadius: 6, cursor: "pointer",
                            background: integrationMappingTab === tab.key ? C.white : "transparent",
                            color: integrationMappingTab === tab.key ? C.pink : C.textMuted,
                            boxShadow: integrationMappingTab === tab.key ? "0 1px 3px rgba(0,0,0,.08)" : "none",
                            transition: "all .15s",
                          }}>{tab.label}</button>
                        ))}
                      </div>

                      {/* ─── TAB: FIELDS ─── */}
                      {integrationMappingTab === "fields" && (
                        <div>
                          {/* Auto-detect + progress */}
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <div style={{ width: 120, height: 6, borderRadius: 3, background: C.bg, overflow: "hidden" }}>
                                <div style={{ width: `${(mappedCount / totalCount) * 100}%`, height: "100%", borderRadius: 3, background: mappedCount === totalCount ? C.green : C.pink, transition: "width .3s" }} />
                              </div>
                              <span style={{ fontSize: 11, color: mappedCount === totalCount ? C.green : C.textMuted, fontWeight: 500 }}>{mappedCount}/{totalCount}</span>
                            </div>
                            <button onClick={autoDetect} style={{ ...sBtn("outline"), fontSize: 11, padding: "5px 12px", display: "flex", alignItems: "center", gap: 4 }}>
                              <Sparkles size={12} /> {t("mapping.auto_detect")}
                            </button>
                          </div>

                          {/* Grouped field rows */}
                          {(["identity", "job", "contract", "personal"] as const).map(group => {
                            const groupFields = ILLIZEO_FIELDS.filter(f => f.group === group);
                            return (
                              <div key={group} style={{ marginBottom: 16 }}>
                                <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: C.textMuted, marginBottom: 8 }}>{GROUP_LABELS[group]}</div>
                                {groupFields.map(field => {
                                  const mapping = getMapping(field.key);
                                  const isMapped = !!mapping.source;
                                  return (
                                    <div key={field.key} style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto auto", gap: 8, alignItems: "center", marginBottom: 6, padding: "6px 10px", background: C.bg, borderRadius: 8, border: `1px solid ${isMapped ? C.greenLight : C.border}` }}>
                                      {/* Illizeo field label */}
                                      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 500 }}>
                                        <span>{field.label}</span>
                                        {field.required && <span style={{ fontSize: 9, fontWeight: 700, padding: "1px 5px", borderRadius: 3, background: C.redLight, color: C.red }}>{t("mapping.required")}</span>}
                                      </div>
                                      {/* Source field dropdown */}
                                      <select value={mapping.source} onChange={e => updateMapping(field.key, "source", e.target.value)} style={{ ...sInput, fontSize: 11, padding: "4px 6px", margin: 0 }}>
                                        <option value="">-- {t("mapping.source")} --</option>
                                        {sourceFields.map(sf => <option key={sf} value={sf}>{sf}</option>)}
                                      </select>
                                      {/* Transform dropdown */}
                                      <select value={mapping.transform || "none"} onChange={e => updateMapping(field.key, "transform", e.target.value)} style={{ ...sInput, fontSize: 10, padding: "4px 6px", margin: 0, width: 100 }}>
                                        {TRANSFORM_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                      </select>
                                      {/* Status badge */}
                                      <span style={{ fontSize: 9, fontWeight: 600, padding: "2px 8px", borderRadius: 4, background: isMapped ? C.greenLight : C.amberLight, color: isMapped ? C.green : C.amber, whiteSpace: "nowrap" }}>
                                        {isMapped ? t("mapping.mapped") : t("mapping.unmapped")}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            );
                          })}

                          {/* Save mapping button */}
                          <button onClick={() => addToast_admin(t("mapping.saved"))} style={{ ...sBtn("pink"), fontSize: 12, padding: "10px 0", width: "100%", marginTop: 8 }}>
                            <CheckCircle size={14} style={{ marginRight: 6 }} /> {t("mapping.save_mapping")}
                          </button>
                        </div>
                      )}

                      {/* ─── TAB: VALUES ─── */}
                      {integrationMappingTab === "values" && (
                        <div>
                          <div style={{ fontSize: 12, color: C.textLight, marginBottom: 12 }}>
                            {lang === "fr" ? "Transformez les valeurs du système source en valeurs Illizeo." : "Transform source system values into Illizeo values."}
                          </div>

                          {/* Value mapping rules */}
                          {(integrationMappings.filter((m: any) => m.type === "value").length === 0 ? [
                            { type: "value", sourceField: "department", sourceValue: "MKTG", targetValue: "Marketing" },
                            { type: "value", sourceField: "employment_type", sourceValue: "FT", targetValue: "CDI" },
                            { type: "value", sourceField: "employment_type", sourceValue: "PT", targetValue: "CDD" },
                          ] : integrationMappings.filter((m: any) => m.type === "value")).map((rule: any, idx: number) => (
                            <div key={idx} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8, padding: "8px 10px", background: C.bg, borderRadius: 8, border: `1px solid ${C.border}` }}>
                              {/* Source field */}
                              <select value={rule.sourceField || ""} onChange={e => {
                                const valueMappings = integrationMappings.filter((m: any) => m.type === "value");
                                const others = integrationMappings.filter((m: any) => m.type !== "value");
                                const updated = [...valueMappings];
                                updated[idx] = { ...rule, sourceField: e.target.value, type: "value" };
                                setIntegrationMappings([...others, ...updated]);
                              }} style={{ ...sInput, fontSize: 11, padding: "4px 6px", margin: 0, flex: 1 }}>
                                <option value="">-- {t("mapping.source")} --</option>
                                {sourceFields.map(sf => <option key={sf} value={sf}>{sf}</option>)}
                              </select>
                              {/* Source value */}
                              <input value={rule.sourceValue || ""} placeholder={t("mapping.source_value")} onChange={e => {
                                const valueMappings = integrationMappings.filter((m: any) => m.type === "value");
                                const others = integrationMappings.filter((m: any) => m.type !== "value");
                                const updated = [...valueMappings];
                                updated[idx] = { ...rule, sourceValue: e.target.value, type: "value" };
                                setIntegrationMappings([...others, ...updated]);
                              }} style={{ ...sInput, fontSize: 11, padding: "4px 6px", margin: 0, flex: 1 }} />
                              {/* Arrow */}
                              <ArrowRight size={14} color={C.textMuted} style={{ flexShrink: 0 }} />
                              {/* Target value */}
                              <input value={rule.targetValue || ""} placeholder={t("mapping.target_value")} onChange={e => {
                                const valueMappings = integrationMappings.filter((m: any) => m.type === "value");
                                const others = integrationMappings.filter((m: any) => m.type !== "value");
                                const updated = [...valueMappings];
                                updated[idx] = { ...rule, targetValue: e.target.value, type: "value" };
                                setIntegrationMappings([...others, ...updated]);
                              }} style={{ ...sInput, fontSize: 11, padding: "4px 6px", margin: 0, flex: 1 }} />
                              {/* Delete */}
                              <button onClick={() => {
                                const valueMappings = integrationMappings.filter((m: any) => m.type === "value");
                                const others = integrationMappings.filter((m: any) => m.type !== "value");
                                valueMappings.splice(idx, 1);
                                setIntegrationMappings([...others, ...valueMappings]);
                              }} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
                                <Trash2 size={14} color={C.red} />
                              </button>
                            </div>
                          ))}

                          {/* Add rule button */}
                          <button onClick={() => {
                            setIntegrationMappings([...integrationMappings, { type: "value", sourceField: "", sourceValue: "", targetValue: "" }]);
                          }} style={{ ...sBtn("outline"), fontSize: 11, padding: "7px 14px", display: "flex", alignItems: "center", gap: 4, marginTop: 4 }}>
                            <Plus size={12} /> {t("mapping.add_rule")}
                          </button>

                          {/* Save */}
                          <button onClick={() => addToast_admin(t("mapping.saved"))} style={{ ...sBtn("pink"), fontSize: 12, padding: "10px 0", width: "100%", marginTop: 16 }}>
                            <CheckCircle size={14} style={{ marginRight: 6 }} /> {t("mapping.save_mapping")}
                          </button>
                        </div>
                      )}

                      {/* ─── TAB: PARCOURS ─── */}
                      {integrationMappingTab === "parcours" && (
                        <div>
                          <div style={{ fontSize: 12, color: C.textLight, marginBottom: 12 }}>
                            {lang === "fr" ? "Définissez quel parcours d'onboarding assigner automatiquement selon les données du collaborateur." : "Define which onboarding path to automatically assign based on employee data."}
                          </div>

                          {/* Parcours rules */}
                          {(integrationMappings.filter((m: any) => m.type === "parcours").length === 0 ? [
                            { type: "parcours", field: "departement", operator: "=", value: "Tech", parcours: "Onboarding Développeur" },
                            { type: "parcours", field: "type_contrat", operator: "=", value: "Stage", parcours: "Onboarding Stagiaire" },
                          ] : integrationMappings.filter((m: any) => m.type === "parcours")).map((rule: any, idx: number) => (
                            <div key={idx} style={{ padding: "12px 14px", background: C.bg, borderRadius: 10, border: `1px solid ${C.border}`, marginBottom: 8 }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                                <span style={{ fontSize: 11, fontWeight: 700, color: C.pink }}>IF</span>
                                {/* Field */}
                                <select value={rule.field || ""} onChange={e => {
                                  const parcoursMappings = integrationMappings.filter((m: any) => m.type === "parcours");
                                  const others = integrationMappings.filter((m: any) => m.type !== "parcours");
                                  const updated = [...parcoursMappings];
                                  updated[idx] = { ...rule, field: e.target.value, type: "parcours" };
                                  setIntegrationMappings([...others, ...updated]);
                                }} style={{ ...sInput, fontSize: 11, padding: "4px 6px", margin: 0, width: "auto", minWidth: 120 }}>
                                  <option value="">-- {lang === "fr" ? "Champ" : "Field"} --</option>
                                  {ILLIZEO_FIELDS.map(f => <option key={f.key} value={f.key}>{f.label}</option>)}
                                </select>
                                {/* Operator */}
                                <select value={rule.operator || "="} onChange={e => {
                                  const parcoursMappings = integrationMappings.filter((m: any) => m.type === "parcours");
                                  const others = integrationMappings.filter((m: any) => m.type !== "parcours");
                                  const updated = [...parcoursMappings];
                                  updated[idx] = { ...rule, operator: e.target.value, type: "parcours" };
                                  setIntegrationMappings([...others, ...updated]);
                                }} style={{ ...sInput, fontSize: 11, padding: "4px 6px", margin: 0, width: 80 }}>
                                  <option value="=">=</option>
                                  <option value="contains">{lang === "fr" ? "contient" : "contains"}</option>
                                  <option value="starts_with">{lang === "fr" ? "commence par" : "starts with"}</option>
                                </select>
                                {/* Value */}
                                <input value={rule.value || ""} placeholder={lang === "fr" ? "Valeur" : "Value"} onChange={e => {
                                  const parcoursMappings = integrationMappings.filter((m: any) => m.type === "parcours");
                                  const others = integrationMappings.filter((m: any) => m.type !== "parcours");
                                  const updated = [...parcoursMappings];
                                  updated[idx] = { ...rule, value: e.target.value, type: "parcours" };
                                  setIntegrationMappings([...others, ...updated]);
                                }} style={{ ...sInput, fontSize: 11, padding: "4px 6px", margin: 0, width: 100 }} />
                                <span style={{ fontSize: 11, fontWeight: 700, color: C.green }}>{t("mapping.then_assign")}</span>
                                {/* Parcours dropdown */}
                                <select value={rule.parcours || ""} onChange={e => {
                                  const parcoursMappings = integrationMappings.filter((m: any) => m.type === "parcours");
                                  const others = integrationMappings.filter((m: any) => m.type !== "parcours");
                                  const updated = [...parcoursMappings];
                                  updated[idx] = { ...rule, parcours: e.target.value, type: "parcours" };
                                  setIntegrationMappings([...others, ...updated]);
                                }} style={{ ...sInput, fontSize: 11, padding: "4px 6px", margin: 0, width: "auto", minWidth: 140 }}>
                                  <option value="">-- Parcours --</option>
                                  {(PARCOURS_TEMPLATES || []).map((p: any) => <option key={p.id} value={p.nom}>{p.nom}</option>)}
                                </select>
                                {/* Delete */}
                                <button onClick={() => {
                                  const parcoursMappings = integrationMappings.filter((m: any) => m.type === "parcours");
                                  const others = integrationMappings.filter((m: any) => m.type !== "parcours");
                                  parcoursMappings.splice(idx, 1);
                                  setIntegrationMappings([...others, ...parcoursMappings]);
                                }} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, marginLeft: "auto" }}>
                                  <Trash2 size={14} color={C.red} />
                                </button>
                              </div>
                            </div>
                          ))}

                          {/* Default rule */}
                          <div style={{ padding: "10px 14px", background: C.amberLight, borderRadius: 8, marginBottom: 8, display: "flex", alignItems: "center", gap: 8, fontSize: 12 }}>
                            <span style={{ fontWeight: 700, color: C.amber }}>{lang === "fr" ? "Sinon" : "Otherwise"}</span>
                            <ArrowRight size={12} color={C.amber} />
                            <span style={{ fontWeight: 500, color: C.amber }}>{lang === "fr" ? "Onboarding Standard" : "Standard Onboarding"}</span>
                          </div>

                          {/* Add rule button */}
                          <button onClick={() => {
                            setIntegrationMappings([...integrationMappings, { type: "parcours", field: "", operator: "=", value: "", parcours: "" }]);
                          }} style={{ ...sBtn("outline"), fontSize: 11, padding: "7px 14px", display: "flex", alignItems: "center", gap: 4, marginTop: 4 }}>
                            <Plus size={12} /> {t("mapping.add_rule")}
                          </button>

                          {/* Save */}
                          <button onClick={() => addToast_admin(t("mapping.saved"))} style={{ ...sBtn("pink"), fontSize: 12, padding: "10px 0", width: "100%", marginTop: 16 }}>
                            <CheckCircle size={14} style={{ marginRight: 6 }} /> {t("mapping.save_mapping")}
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* Status toggle — only for non-OAuth and non-native */}
                {!selectedMeta.oauth && selectedMeta.fields.length > 0 && (
                <div style={{ marginTop: 20, padding: "14px 16px", background: C.bg, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{lang === 'fr' ? "Activer l'intégration" : "Enable integration"}</div>
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
                <button onClick={() => setIntegrationPanelId(null)} style={{ ...sBtn("outline"), fontSize: 13 }}>{t('common.close')}</button>
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
                    {integrationSaving ? t('common.checking') : t('integ.save_connect')}
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
      );
    };

  
  return {
    renderIntegrations,
  };
}
