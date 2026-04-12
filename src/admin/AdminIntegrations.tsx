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
                        <div style={{ fontSize: 12, fontWeight: 600, color: C.text, marginBottom: 8 }}>Détails de connexion</div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, fontSize: 12 }}>
                          <div><span style={{ color: C.textMuted }}>Company ID</span><div style={{ fontWeight: 500, marginTop: 2 }}>{integrationConfig.company_id || "—"}</div></div>
                          <div><span style={{ color: C.textMuted }}>Pays</span><div style={{ fontWeight: 500, marginTop: 2 }}>{integrationConfig.company_country || "—"}</div></div>
                          <div><span style={{ color: C.textMuted }}>Utilisateur</span><div style={{ fontWeight: 500, marginTop: 2 }}>{integrationConfig.username || "—"}</div></div>
                          <div><span style={{ color: C.textMuted }}>{t('common.connected_on')}</span><div style={{ fontWeight: 500, marginTop: 2 }}>{fmtDate(integrationConfig.connected_at)}</div></div>
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
                      }} style={{ ...sBtn("outline"), color: C.red, borderColor: C.red, fontSize: 13, width: "100%" }}>{t('common.disconnect')}</button>
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
                        {integrationSaving ? t('common.checking') : t('common.test_connect')}
                      </button>

                      {/* Setup guide */}
                      <div style={{ marginTop: 20, padding: "16px", background: C.bg, borderRadius: 10, fontSize: 11, color: C.textLight }}>
                        <div style={{ fontWeight: 700, fontSize: 12, color: C.text, marginBottom: 4 }}>{t('integ.procedure')} SuccessFactors</div>
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
                        <div style={{ fontSize: 16, fontWeight: 600, color: C.green, marginBottom: 4 }}>{t('common.connected')}</div>
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
                        <div style={{ fontSize: 12, fontWeight: 600, color: C.text, marginBottom: 10 }}>{lang === 'fr' ? 'Fonctionnalités couvertes' : 'Features included'}</div>
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
                        {integrationSaving ? t('common.connecting') : t('common.test_connect')}
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

  
    // ─── SIDEBAR ───────────────────────────────────────────────
    const collapsed = sidebarCollapsed;
    const sidebarW = collapsed ? 64 : 220;

  return {
    renderIntegrations,
  };
}
