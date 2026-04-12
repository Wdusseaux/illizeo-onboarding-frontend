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
 * Dashboard + Suivi + CollabProfile render functions.
 */
export function createAdminDashboardSuivi(ctx: any) {
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
    apiKeyInput, setApiKeyInput, suiviFilter, setSuiviFilter, suiviSearch, setSuiviSearch, suiviParcoursFilter, setSuiviParcoursFilter, collabMenuId, setCollabMenuId,
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
          {setupCompleted.length < SETUP_STEPS.length && (() => {
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
                    <div style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 4 }}>{t('wiz.config_space')} — {pct}%</div>
                    <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 8 }}>{doneReq}/{totalReq} {t('wiz.required_steps')} · {setupCompleted.length}/{SETUP_STEPS.length}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ flex: 1, height: 6, borderRadius: 3, background: C.bg, overflow: "hidden" }}>
                        <div style={{ width: `${pct}%`, height: "100%", background: `linear-gradient(90deg, ${C.pink}, #E91E8C)`, borderRadius: 3, transition: "width .3s ease" }} />
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 600, color: C.pink }}>{pct}%</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6, flexShrink: 0 }}>
                    <button onClick={() => { setShowSetupWizard(true); setSetupStep(SETUP_STEPS.findIndex(s => !setupCompleted.includes(s.id)) || 0); }} className="iz-btn-pink" style={{ ...sBtn("pink"), fontSize: 12, padding: "8px 20px", display: "flex", alignItems: "center", gap: 6 }}>
                      <Sparkles size={13} /> {setupCompleted.length === 0 ? (lang === "fr" ? "Démarrer" : "Start") : (lang === "fr" ? "Reprendre" : "Resume")}
                    </button>
                    {doneReq >= totalReq && (
                      <button onClick={() => { finishSetupWizard(); }} className="iz-btn-outline" style={{ ...sBtn("outline"), fontSize: 10, padding: "4px 12px", color: C.textMuted }}>{lang === "fr" ? "Masquer" : "Hide"}</button>
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
                <div key={p.id} onClick={() => { setSuiviParcoursFilter(p.nom); setAdminPage("admin_suivi"); }} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${C.border}`, cursor: "pointer", borderRadius: 6, transition: "background .15s" }} className="iz-sidebar-item">
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
      // Associate collaborateurs to parcours (deterministic mapping for demo)
      const activeParcoursList = PARCOURS_TEMPLATES.filter(p => p.status === "actif");
      const getCollabParcours = (collabId: number) => {
        if (activeParcoursList.length === 0) return null;
        return activeParcoursList[collabId % activeParcoursList.length];
      };

      const filtered = COLLABORATEURS
        .filter(c => suiviFilter === "all" || c.status === suiviFilter)
        .filter(c => !suiviSearch || `${c.prenom} ${c.nom} ${c.email || ""} ${c.poste}`.toLowerCase().includes(suiviSearch.toLowerCase()))
        .filter(c => !suiviParcoursFilter || getCollabParcours(c.id)?.nom === suiviParcoursFilter);
      return (
      <div style={{ flex: 1, padding: "24px 32px", overflow: "auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <h1 style={{ fontSize: 22, fontWeight: 600, margin: 0 }}>{t('collab.tracking_title')}</h1>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => { setCollabPanelData({ prenom: "", nom: "", email: "", poste: "", site: "", departement: "", dateDebut: "" }); setCollabPanelMode("create"); }} className="iz-btn-pink" style={{ ...sBtn("pink"), display: "flex", alignItems: "center", gap: 6 }}><UserPlus size={16} /> {t('collab.new')}</button>
          </div>
        </div>

        {/* Active parcours filter badge */}
        {suiviParcoursFilter && (
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 8, background: C.pinkBg, color: C.pink, fontSize: 12, fontWeight: 600, marginBottom: 12 }}>
            <Route size={14} />
            {suiviParcoursFilter}
            <button onClick={() => setSuiviParcoursFilter(null)} style={{ background: "none", border: "none", cursor: "pointer", color: C.pink, padding: 0, display: "flex" }}><X size={14} /></button>
          </div>
        )}

        {/* Search + filter bar */}
        <div className="iz-card" style={{ ...sCard, marginBottom: 16, display: "flex", alignItems: "center", gap: 12, padding: "10px 16px" }}>
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, background: C.bg, borderRadius: 8, padding: "8px 12px" }}>
            <Search size={16} color={C.textLight} />
            <input value={suiviSearch} onChange={e => setSuiviSearch(e.target.value)} placeholder={t('common.search')} style={{ border: "none", outline: "none", background: "transparent", flex: 1, fontSize: 13, fontFamily: font, color: C.text }} />
          </div>
          <div style={{ display: "flex", gap: 4, padding: 3, background: C.bg, borderRadius: 8 }}>
            {([["all", `${t('misc.all')} (${COLLABORATEURS.length})`], ["en_cours", t('status.ongoing')], ["en_retard", t('status.late')], ["termine", t('status.completed')]] as const).map(([key, label]) => (
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

  return {
    renderDashboard_admin,
    renderSuivi,
    renderCollabProfile,
    PARCOURS_CAT_META,
    PAGE_MODULE_MAP,
    hasModule,
    isPageAccessible,
    isEditorTenant,
    isInTrial,
    trialExpired,
    hasActiveSub,
    SIDEBAR,
  };
}
