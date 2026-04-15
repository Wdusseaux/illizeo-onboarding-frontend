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
 * Parcours + Documents render functions.
 */
export function createAdminParcoursDocs(ctx: any) {
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


    const renderParcours = () => {
      const assignLabel = (a: any) => a?.mode === "tous" ? "Tous les collaborateurs" : a?.mode === "individuel" ? "Individuel" : a?.valeurs?.join(", ") || "—";
      const parcoursFilteredActions = ACTION_TEMPLATES.filter(a => actionFilter === "all" || a.parcours === actionFilter);
      const filteredActions = parcoursFilteredActions.filter(a => actionTypeFilters.size === 0 || actionTypeFilters.has(a.type as ActionType));
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
                <div key={ph.id} className="iz-card iz-fade-up" style={{ ...sCard, marginBottom: 12, display: "flex", alignItems: "center", gap: 16, opacity: ph.active === false ? 0.5 : 1 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: ph.couleur, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {PhIcon ? <PhIcon size={20} color={C.white} /> : <CheckCircle size={20} color={C.white} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 600 }}>{ph.nom}</div>
                    <div style={{ fontSize: 12, color: C.textLight }}>{ph.delaiDebut} → {ph.delaiFin} · {phActions.length} actions</div>
                  </div>
                  {ph.active === false && <span style={{ fontSize: 10, fontWeight: 600, color: C.textMuted, padding: "2px 8px", borderRadius: 4, background: C.bg }}>{t('common.inactive')}</span>}
                  <button onClick={() => { setPhasePanelData({ id: ph.id, nom: ph.nom, delaiDebut: ph.delaiDebut, delaiFin: ph.delaiFin, couleur: ph.couleur, parcoursIds: ph.parcoursIds || [], active: ph.active !== false }); setContentTranslations(ph.translations || {}); setPhasePanelMode("edit"); }} className="iz-btn-outline" style={{ ...sBtn("outline"), fontSize: 11, padding: "5px 14px" }}>{t('common.edit')}</button>
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
                const count = parcoursFilteredActions.filter(a => a.type === type).length;
                if (count === 0) return null;
                const isActive = actionTypeFilters.has(type);
                return <button key={type} onClick={() => setActionTypeFilters(prev => { const next = new Set(prev); if (next.has(type)) next.delete(type); else next.add(type); return next; })} style={{ padding: "3px 8px", borderRadius: 6, fontSize: 10, fontWeight: 600, background: isActive ? meta.color : meta.bg, color: isActive ? "#fff" : meta.color, border: "none", cursor: "pointer", fontFamily: font, opacity: actionTypeFilters.size > 0 && !isActive ? 0.5 : 1, transition: "all .15s" }}>{meta.label} ({count})</button>;
              })}
              {actionTypeFilters.size > 0 && <button onClick={() => setActionTypeFilters(new Set())} style={{ padding: "3px 8px", borderRadius: 6, fontSize: 10, fontWeight: 500, background: "none", border: `1px solid ${C.border}`, color: C.textMuted, cursor: "pointer", fontFamily: font }}>✕ Reset</button>}
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

    // Translate known document category titles
    const DOC_CAT_I18N: Record<string, string> = {
      "complementaires": t('doccat.complementaires'),
      "formulaires": t('doccat.formulaires'),
      "suisse": t('doccat.suisse'),
      "supplementaires": t('doccat.supplementaires'),
    };
    const trCatTitre = (cat: any) => DOC_CAT_I18N[cat.id] || DOC_CAT_I18N[cat.slug] || cat.titre;

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
                return { id: seed, collabId: collab.id, collabName: `${collab.prenom} ${collab.nom}`, collabInitials: collab.initials, collabColor: collab.color, categorie: trCatTitre(cat), categorieId: cat.id, piece: piece.nom, obligatoire: piece.obligatoire, type: piece.type, status, submittedAt: status !== "manquant" ? `2026-03-${String(10 + (seed % 20)).padStart(2, "0")}` : null, key: seed };
              })
            )
          );

      const allPieces = ADMIN_DOC_CATEGORIES.flatMap(cat => cat.pieces.map(p => ({ ...p, categorie: trCatTitre(cat), categorieId: cat.id })));
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
            { label: t('doc.templates_count'), value: totalTemplates, icon: FileText, color: C.blue, bg: C.blueLight },
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
              <input value={gedSearch} onChange={e => setGedSearch(e.target.value)} placeholder={t('doc.search_placeholder')} style={{ border: "none", outline: "none", background: "transparent", flex: 1, fontSize: 13, fontFamily: font, color: C.text }} />
            </div>
            <select value={gedCatFilter} onChange={e => setGedCatFilter(e.target.value)} style={{ padding: "8px 14px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 12, fontFamily: font, color: C.text, cursor: "pointer" }}>
              <option value="all">{t('misc.all_categories')}</option>
              {ADMIN_DOC_CATEGORIES.map(cat => <option key={cat.id} value={cat.id}>{trCatTitre(cat)}</option>)}
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
                  <span style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{trCatTitre(cat)}</span>
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
                          <span>{piece.type === "formulaire" ? t('misc.form_to_fill') : t('misc.upload_required')}</span>
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
              <span>{t('doc.col_employee')}</span><span>{t('doc.col_document')}</span><span>{t('doc.col_category')}</span><span>{t('doc.col_submitted')}</span><span>{t('doc.col_actions')}</span>
            </div>
            {pendingValidation.length === 0 && <div style={{ padding: "40px 20px", textAlign: "center", color: C.textMuted, fontSize: 13 }}>{t('doc.no_pending')}</div>}
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
                  {ADMIN_DOC_CATEGORIES.map(cat => <option key={cat.id} value={cat.id}>{trCatTitre(cat)}</option>)}
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


  return {
    renderParcours,
    renderDocuments,
  };
}
