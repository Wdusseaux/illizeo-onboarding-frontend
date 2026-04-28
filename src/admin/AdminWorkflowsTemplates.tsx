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
  Moon, Sun, Loader2
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { ANIM_STYLES, C, hexToRgb, colorWithAlpha, lighten, REGION_LOCALE, REGION_CURRENCY, getLocaleSettings, fmtDate, fmtDateShort, fmtTime, fmtDateTime, fmtDateTimeShort, fmtCurrency, font, ILLIZEO_LOGO_URI, ILLIZEO_FULL_LOGO_URI, getLogoUri, getLogoFullUri, IllizeoLogoFull, IllizeoLogo, IllizeoLogoBrand, PreboardSidebar, sCard, sBtn, sInput, isDarkMode, applyDarkMode } from '../constants';
import type { OnboardingStep, DashboardPage, DashboardTab, UserRole, AdminPage, AdminModal, Collaborateur, ParcoursCategorie, ParcourTemplate, ActionTemplate, ActionType, AssignTarget, GroupePersonnes, DocCategory, WorkflowRule, EmailTemplate, TeamMember } from '../types';
import RichEditor from '../components/RichEditor';
import TranslatableField, { type Translations } from '../components/TranslatableField';
import WorkflowBuilder from '../components/WorkflowBuilder';
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
  aiTranslate,
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
 * Workflows + Templates + Equipes + Notifications + Entreprise render functions.
 */
export function createAdminWorkflowsTemplates(ctx: any) {
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
    ACTION_TEMPLATES, refetchActions, GROUPES, refetchGroupes, PHASE_DEFAULTS, refetchPhases, WORKFLOW_RULES, refetchWorkflows, EMAIL_TEMPLATES, refetchEmailTemplates,
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


    const renderWorkflows = () => (
      <div style={{ flex: 1, padding: "24px 32px", overflow: "auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 600, margin: 0 }}>{t('admin.workflows')}</h1>
            <p style={{ fontSize: 12, color: C.textMuted, margin: "4px 0 0" }}>Automatisez vos parcours avec des workflows personnalisables multi-étapes</p>
          </div>
          <button onClick={() => { setWfPanelData({ nom: "", description: "", declencheur: "Document soumis", action: "Envoyer email de relance", destinataire: "Collaborateur", actif: true, steps: [], email_subject: "", email_body: "", bot_message: "", badge_name: "", badge_icon: "trophy", badge_color: "#F9A825", target_user_id: "", target_group_id: "" }); resetTr(); setWfPanelMode("create"); }} className="iz-btn-pink" style={{ ...sBtn("pink"), display: "flex", alignItems: "center", gap: 6 }}><Plus size={16} /> {t('wf.new')}</button>
        </div>

        {/* Workflow cards grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
          {WORKFLOW_RULES.map((w: any) => {
            const stepCount = w.steps?.length || 1;
            return (
              <div key={w.id} className="iz-card iz-fade-up" style={{ ...sCard, cursor: "pointer", position: "relative", transition: "box-shadow .2s" }}
                onClick={() => { setWfPanelData({ ...w, steps: w.steps || [] }); setContentTranslations(w.translations || {}); setWfPanelMode("edit"); }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: w.actif ? C.greenLight : C.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Zap size={16} color={w.actif ? C.green : C.textMuted} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{w.nom}</div>
                    {w.description && <div style={{ fontSize: 11, color: C.textMuted }}>{w.description}</div>}
                  </div>
                  <div onClick={(e) => { e.stopPropagation(); (async () => { try { await apiUpdateWorkflow(w.id, { actif: !w.actif }); refetchWorkflows(); addToast_admin(`${w.nom} : ${!w.actif ? "activé" : "désactivé"}`); } catch {} })(); }}
                    style={{ width: 40, height: 22, borderRadius: 11, background: w.actif ? C.green : C.border, cursor: "pointer", position: "relative", transition: "all .2s", flexShrink: 0 }}>
                    <div style={{ width: 18, height: 18, borderRadius: "50%", background: C.white, position: "absolute", top: 2, left: w.actif ? 20 : 2, transition: "all .2s", boxShadow: "0 1px 3px rgba(0,0,0,.2)" }} />
                  </div>
                </div>
                {/* Visual flow preview */}
                <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                  <span style={{ padding: "3px 8px", borderRadius: 6, fontSize: 10, fontWeight: 600, background: "#E3F2FD", color: "#1565C0" }}>{w.declencheur}</span>
                  <ArrowRight size={10} color={C.textMuted} />
                  {(w.steps && w.steps.length > 0) ? w.steps.slice(0, 3).map((s: any, i: number) => (
                    <span key={i} style={{ padding: "3px 8px", borderRadius: 6, fontSize: 10, fontWeight: 500, background: s.type === 'condition' ? "#FFF3E0" : s.type === 'delay' ? "#F3E5F5" : "#E8F5E9", color: s.type === 'condition' ? "#E65100" : s.type === 'delay' ? "#7B1FA2" : "#2E7D32" }}>
                      {s.type === 'condition' ? 'Si...' : s.type === 'delay' ? `⏱ ${s.delay_value || 1}j` : (s.action || w.action)?.split(' ').slice(0, 2).join(' ')}
                    </span>
                  )) : (
                    <span style={{ padding: "3px 8px", borderRadius: 6, fontSize: 10, fontWeight: 500, background: "#E8F5E9", color: "#2E7D32" }}>{w.action}</span>
                  )}
                  {w.steps?.length > 3 && <span style={{ fontSize: 10, color: C.textMuted }}>+{w.steps.length - 3}</span>}
                  <ArrowRight size={10} color={C.textMuted} />
                  <span style={{ padding: "3px 8px", borderRadius: 6, fontSize: 10, fontWeight: 500, background: "#FCE4EC", color: "#E41076" }}>{w.destinataire}</span>
                </div>
                <div style={{ marginTop: 8, fontSize: 10, color: C.textMuted }}>{stepCount} étape{stepCount > 1 ? 's' : ''}</div>
              </div>
            );
          })}
        </div>
        {WORKFLOW_RULES.length === 0 && <div style={{ padding: "60px 20px", textAlign: "center", color: C.textMuted, fontSize: 13 }}>Aucun workflow. Créez votre premier workflow automatisé.</div>}

        {/* Workflow builder panel — full width with visual canvas */}
        {wfPanelMode !== "closed" && (
          <>
            <div onClick={() => setWfPanelMode("closed")} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.4)", zIndex: 1000 }} />
            <div className="iz-panel" style={{ position: "fixed", top: 0, right: 0, width: "min(900px, 85vw)", height: "100vh", background: C.white, boxShadow: "-4px 0 24px rgba(0,0,0,.12)", zIndex: 1001, display: "flex", flexDirection: "column" }}>
              {/* Header */}
              <div style={{ padding: "16px 24px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <Zap size={20} color={C.pink} />
                  <div>
                    <div>
                      <TranslatableField
                        value={wfPanelData.nom}
                        onChange={v => setWfPanelData((p: any) => ({ ...p, nom: v, _nomError: false }))}
                        placeholder="Nom du workflow *"
                        currentLang={lang} activeLangs={activeLanguages}
                        translations={contentTranslations.nom}
                        onTranslationsChange={tr => setTr("nom", tr)}
                        style={{ border: "none", fontSize: 16, fontWeight: 600, outline: "none", width: 300, color: wfPanelData._nomError ? C.red : C.text, borderBottom: wfPanelData._nomError ? `2px solid ${C.red}` : "2px solid transparent", paddingBottom: 2 }}
                      />
                      {wfPanelData._nomError && <div style={{ fontSize: 10, color: C.red, marginTop: 2, fontWeight: 500 }}>Le nom du workflow est obligatoire</div>}
                    </div>
                    <TranslatableField
                      value={wfPanelData.description || ""}
                      onChange={v => setWfPanelData((p: any) => ({ ...p, description: v }))}
                      placeholder="Description (optionnel)"
                      currentLang={lang} activeLangs={activeLanguages}
                      translations={contentTranslations.description}
                      onTranslationsChange={tr => setTr("description", tr)}
                      style={{ border: "none", fontSize: 11, outline: "none", width: 300, color: C.textMuted, display: "block", marginTop: 2 }}
                    />
                  </div>
                </div>
                <button onClick={() => setWfPanelMode("closed")} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={22} color={C.textLight} /></button>
              </div>

              {/* Visual workflow builder canvas */}
              <div style={{ flex: 1, overflow: "hidden" }}>
                <WorkflowBuilder
                  workflow={wfPanelData}
                  onChange={(updated: any) => setWfPanelData(updated)}
                  groups={GROUPES}
                  users={adminUsers}
                />
              </div>

              {/* Footer */}
              <div style={{ padding: "12px 24px", borderTop: `1px solid ${C.border}`, display: "flex", gap: 12, justifyContent: "space-between" }}>
                <div>{wfPanelMode === "edit" && <button onClick={() => { setConfirmDialog({ message: "Supprimer ce workflow ?", onConfirm: async () => { try { await apiDeleteWorkflow(wfPanelData.id); addToast_admin("Workflow supprimé"); setWfPanelMode("closed"); refetchWorkflows(); } catch {} setConfirmDialog(null); }}); }} style={{ ...sBtn("outline"), color: C.red, borderColor: C.red, fontSize: 13 }}>{t('common.delete')}</button>}</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => setWfPanelMode("closed")} style={{ ...sBtn("outline"), fontSize: 13 }}>{t('common.cancel')}</button>
                  <button onClick={async () => {
                    if (!wfPanelData.nom?.trim()) {
                      setWfPanelData((p: any) => ({ ...p, _nomError: true }));
                      addToast_admin("Veuillez donner un nom au workflow");
                      return;
                    }
                    try {
                      const { _nomError, ...cleanData } = wfPanelData;
                      const wfPayload = { ...cleanData, translations: buildTranslationsPayload() };
                      if (wfPanelMode === "create") { await apiCreateWorkflow(wfPayload); addToast_admin("Workflow créé"); }
                      else { await apiUpdateWorkflow(wfPanelData.id, wfPayload); addToast_admin("Workflow modifié"); }
                      setWfPanelMode("closed"); refetchWorkflows();
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
    const TPL_TRIGGERS = [
      { value: "Création du parcours", label: t('tpl.trigger_parcours_created') },
      { value: "J-7 avant deadline documents", label: t('tpl.trigger_docs_deadline') },
      { value: "Tous documents validés", label: t('tpl.trigger_all_docs') },
      { value: "J+0", label: t('tpl.trigger_day0') },
      { value: "Parcours complété à 100%", label: t('tpl.trigger_complete') },
      { value: "Action assignée", label: t('tpl.trigger_action_assigned') },
      { value: "Document refusé", label: t('tpl.trigger_doc_refused') },
    ];
    const TPL_VARIABLES = ["{{prenom}}", "{{nom}}", "{{date_debut}}", "{{site}}", "{{poste}}", "{{departement}}", "{{parcours_nom}}", "{{nb_docs_manquants}}", "{{date_limite}}", "{{manager}}", "{{adresse}}"];


    const renderTemplates = () => {
      const filteredTpls = EMAIL_TEMPLATES.filter((tpl: any) => tplCatFilter === "all" || guessTplCategory(tpl.nom) === tplCatFilter);
      return (
      <div style={{ flex: 1, padding: "24px 32px", overflow: "auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <h1 style={{ fontSize: 22, fontWeight: 600, margin: 0 }}>{t('admin.email_templates')}</h1>
          <button onClick={() => { setTplPanelData({ nom: "", sujet: "", declencheur: TPL_TRIGGERS[0], variables: [], actif: true, contenu: "" }); resetTr(); setTplPanelMode("create"); }} className="iz-btn-pink" style={{ ...sBtn("pink"), display: "flex", alignItems: "center", gap: 6 }}><Plus size={16} /> {t('doc.new_template')}</button>
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
                <div style={{ flex: 1, fontSize: 14, fontWeight: 600 }}>{(lang !== "fr" && tpl.translations?.nom?.[lang]) || tpl.nom}</div>
                <span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 600, background: cat?.bg || C.bg, color: cat?.color || C.textMuted }}>{cat?.label || "Autre"}</span>
                <span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 600, background: tpl.actif ? C.greenLight : C.bg, color: tpl.actif ? C.green : C.textMuted }}>{tpl.actif ? t('tpl.status_active') : t('tpl.status_inactive')}</span>
              </div>
              <div style={{ fontSize: 12, color: C.textLight, marginBottom: 4 }}>{t('tpl.subject_label')}: {(lang !== "fr" && tpl.translations?.sujet?.[lang]) || tpl.sujet}</div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ fontSize: 11, color: C.textMuted }}>{t('common.trigger')}: {TPL_TRIGGERS.find(tr => tr.value === tpl.declencheur)?.label || tpl.declencheur}</div>
                <div style={{ display: "flex", gap: 4 }} onClick={e => e.stopPropagation()}>
                  <button onClick={async () => { try { await apiDuplicateEmailTpl(tpl.id); refetchEmailTemplates(); addToast_admin(t('tpl.duplicated')); } catch { addToast_admin(t('toast.error')); } }} title="Dupliquer" style={{ background: C.bg, border: "none", borderRadius: 4, padding: "3px 6px", cursor: "pointer" }}><FolderOpen size={12} color={C.textMuted} /></button>
                </div>
              </div>
            </div>
            );
          })}
        </div>
        {filteredTpls.length === 0 && <div style={{ padding: "40px 20px", textAlign: "center", color: C.textMuted, fontSize: 13 }}>{t('tpl.no_template')}</div>}
        {/* Template panel */}
        {tplPanelMode !== "closed" && (
          <>
            <div onClick={() => setTplPanelMode("closed")} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.3)", zIndex: 1000 }} />
            <div className="iz-panel" style={{ position: "fixed", top: 0, right: 0, width: 680, height: "100vh", background: C.white, boxShadow: "-4px 0 24px rgba(0,0,0,.1)", zIndex: 1001, display: "flex", flexDirection: "column" }}>
              <div style={{ padding: "20px 28px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>{tplPanelMode === "create" ? t('doc.new_template') : t('doc.edit_template')}</h2>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {tplPanelMode === "edit" && (
                    <div style={{ display: "flex", gap: 4, padding: 2, background: C.bg, borderRadius: 6 }}>
                      <button onClick={() => setTplPreview(false)} style={{ padding: "4px 10px", borderRadius: 4, fontSize: 11, fontWeight: tplPreview ? 400 : 600, border: "none", cursor: "pointer", fontFamily: font, background: !tplPreview ? C.white : "transparent", color: !tplPreview ? C.text : C.textMuted, boxShadow: !tplPreview ? "0 1px 3px rgba(0,0,0,.1)" : "none" }}>{t('tpl.edit')}</button>
                      <button onClick={() => setTplPreview(true)} style={{ padding: "4px 10px", borderRadius: 4, fontSize: 11, fontWeight: tplPreview ? 600 : 400, border: "none", cursor: "pointer", fontFamily: font, background: tplPreview ? C.white : "transparent", color: tplPreview ? C.text : C.textMuted, boxShadow: tplPreview ? "0 1px 3px rgba(0,0,0,.1)" : "none" }}>{t('tpl.preview_label')}</button>
                    </div>
                  )}
                  <button onClick={() => setTplPanelMode("closed")} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={22} color={C.textLight} /></button>
                </div>
              </div>
              <div style={{ flex: 1, padding: "24px 28px", overflow: "auto" }}>
                {!tplPreview ? (<>
                  <div style={{ marginBottom: 16 }}><label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>{t('tpl.name')} *</label><TranslatableField value={tplPanelData.nom} onChange={v => setTplPanelData((p: any) => ({ ...p, nom: v }))} currentLang={lang} activeLangs={activeLanguages} translations={contentTranslations.nom} onTranslationsChange={tr => setTr("nom", tr)} /></div>
                  <div style={{ marginBottom: 16 }}><label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>{t('tpl.subject')} *</label><TranslatableField value={tplPanelData.sujet} onChange={v => setTplPanelData((p: any) => ({ ...p, sujet: v }))} placeholder="Bienvenue chez Illizeo — {{prenom}}" currentLang={lang} activeLangs={activeLanguages} translations={contentTranslations.sujet} onTranslationsChange={tr => setTr("sujet", tr)} /></div>
                  <div style={{ marginBottom: 16 }}><label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>{t('tpl.trigger')}</label><select value={tplPanelData.declencheur} onChange={e => setTplPanelData((p: any) => ({ ...p, declencheur: e.target.value }))} style={{ ...sInput, cursor: "pointer" }}>{TPL_TRIGGERS.map(tr => <option key={tr.value} value={tr.value}>{tr.label}</option>)}</select></div>
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                      <label style={{ fontSize: 12, fontWeight: 600, color: C.text }}>{t('tpl.email_body')}</label>
                      {activeLanguages.length > 1 && (
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          {(() => {
                            const bodyLang = (tplPanelData._bodyLang || "fr") as Lang;
                            const frBody = bodyLang === "fr" ? (tplPanelData.contenu || "") : (tplPanelData._contenu_fr || "");
                            const targets = activeLanguages.filter((l: Lang) => l !== "fr");
                            const isTranslating = !!tplPanelData._translating;
                            const canTranslate = !!frBody.trim() && targets.length > 0 && !isTranslating;
                            return (
                              <button
                                type="button"
                                disabled={!canTranslate}
                                onClick={async () => {
                                  if (!canTranslate) return;
                                  setTplPanelData((p: any) => ({ ...p, _translating: true }));
                                  try {
                                    const result = await aiTranslate(frBody, "fr", targets);
                                    if (result.translations) {
                                      const updated = { ...(contentTranslations.contenu || {}), ...result.translations };
                                      setTr("contenu", updated);
                                      // If currently displaying a translated lang, refresh editor with new content
                                      if (bodyLang !== "fr" && updated[bodyLang]) {
                                        setTplPanelData((p: any) => ({ ...p, contenu: updated[bodyLang], _translating: false }));
                                      } else {
                                        setTplPanelData((p: any) => ({ ...p, _translating: false }));
                                      }
                                      addToast_admin(`Corps traduit en ${targets.length} langue${targets.length > 1 ? "s" : ""}`);
                                    } else {
                                      setTplPanelData((p: any) => ({ ...p, _translating: false }));
                                    }
                                  } catch (e) {
                                    console.error("AI translate failed:", e);
                                    addToast_admin("Échec de la traduction IA");
                                    setTplPanelData((p: any) => ({ ...p, _translating: false }));
                                  }
                                }}
                                title={!frBody.trim() ? "Saisissez d'abord le corps en français" : `Traduire le corps en ${targets.map((l: Lang) => LANG_META[l]?.nativeName).join(", ")}`}
                                style={{
                                  display: "flex", alignItems: "center", gap: 5, padding: "4px 10px",
                                  borderRadius: 6, border: "none", fontSize: 10, fontWeight: 600, fontFamily: font,
                                  cursor: !canTranslate ? "not-allowed" : "pointer",
                                  background: "linear-gradient(135deg, #1a1a2e, #1A73E8)", color: "#fff",
                                  opacity: !canTranslate ? 0.4 : 1,
                                }}
                              >
                                {isTranslating ? <Loader2 size={11} style={{ animation: "spin 1s linear infinite" }} /> : <Sparkles size={11} />}
                                Traduire avec IA
                              </button>
                            );
                          })()}
                          <div style={{ display: "flex", gap: 4 }}>
                          {activeLanguages.map(l => (
                            <button key={l} onClick={() => {
                              // Save current content for current lang before switching
                              if (lang === "fr") {
                                // value is already in tplPanelData.contenu
                              } else {
                                setTr("contenu", { ...contentTranslations.contenu, [lang]: tplPanelData.contenu });
                              }
                              // Load content for target lang
                              if (l === "fr") {
                                // Restore FR content from the original value
                                const frVal = tplPanelData._contenu_fr ?? tplPanelData.contenu;
                                setTplPanelData((p: any) => ({ ...p, contenu: frVal, _bodyLang: "fr" }));
                              } else {
                                // Save FR if first switch
                                if (!tplPanelData._contenu_fr && (tplPanelData._bodyLang || "fr") === "fr") {
                                  setTplPanelData((p: any) => ({ ...p, _contenu_fr: p.contenu }));
                                }
                                setTplPanelData((p: any) => ({ ...p, contenu: contentTranslations.contenu?.[l] || "", _bodyLang: l }));
                              }
                            }} style={{
                              padding: "3px 8px", borderRadius: 5, fontSize: 10, fontWeight: 600, border: "none", cursor: "pointer", fontFamily: font,
                              background: (tplPanelData._bodyLang || "fr") === l ? C.pink : C.bg,
                              color: (tplPanelData._bodyLang || "fr") === l ? C.white : C.textMuted,
                            }}>{LANG_META[l as Lang]?.flag} {l.toUpperCase()}</button>
                          ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <RichEditor
                      value={tplPanelData.contenu || ""}
                      onChange={(html) => {
                        setTplPanelData((p: any) => ({ ...p, contenu: html }));
                        // Also update translation for non-FR lang
                        const bodyLang = tplPanelData._bodyLang || "fr";
                        if (bodyLang !== "fr") {
                          setTr("contenu", { ...contentTranslations.contenu, [bodyLang]: html });
                        }
                      }}
                      placeholder="Bonjour {{prenom}}, Bienvenue chez Illizeo !"
                    />
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", background: C.bg, borderRadius: 10, cursor: "pointer" }} onClick={() => setTplPanelData((p: any) => ({ ...p, actif: !p.actif }))}>
                    <div style={{ width: 20, height: 20, borderRadius: 4, border: `2px solid ${tplPanelData.actif ? C.pink : C.border}`, background: tplPanelData.actif ? C.pink : C.white, display: "flex", alignItems: "center", justifyContent: "center", transition: "all .15s" }}>{tplPanelData.actif && <Check size={14} color={C.white} />}</div>
                    <span style={{ fontSize: 13, fontWeight: 500 }}>{t('tpl.active')}</span>
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
                        <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 4 }}>{t('tpl.subject_label')}</div>
                        <div style={{ fontSize: 15, fontWeight: 600, color: C.text }}>
                          {(tplPanelData.sujet || "").replace(/\{\{prenom\}\}/g, "Jean").replace(/\{\{nom\}\}/g, "Dupont").replace(/\{\{parcours_nom\}\}/g, "Onboarding Standard").replace(/\{\{action_nom\}\}/g, "Compléter le dossier")}
                        </div>
                      </div>
                      {/* Email body */}
                      <div style={{ padding: "24px", fontSize: 14, lineHeight: 1.7, color: C.text, minHeight: 200, whiteSpace: "pre-wrap" }}>
                        {(tplPanelData.contenu || t('tpl.no_content')).replace(/\{\{prenom\}\}/g, "Jean").replace(/\{\{nom\}\}/g, "Dupont").replace(/\{\{date_debut\}\}/g, "01/06/2026").replace(/\{\{site\}\}/g, "Genève").replace(/\{\{poste\}\}/g, "Chef de Projet").replace(/\{\{parcours_nom\}\}/g, "Onboarding Standard").replace(/\{\{manager\}\}/g, "Mehdi Kessler").replace(/\{\{nb_docs_manquants\}\}/g, "3").replace(/\{\{date_limite\}\}/g, "15/06/2026").replace(/\{\{lien\}\}/g, "https://app.illizeo.com").replace(/\{\{action_nom\}\}/g, "Compléter le dossier").replace(/\{\{document_nom\}\}/g, "Pièce d'identité").replace(/\{\{collab_nom\}\}/g, "Jean Dupont").replace(/\{\{montant\}\}/g, "500 CHF").replace(/\{\{annees\}\}/g, "1").replace(/\{\{date_depart\}\}/g, "30/06/2026").replace(/\{\{email\}\}/g, "jean.dupont@illizeo.com").replace(/\{\{date_fin_essai\}\}/g, "01/09/2026").replace(/\{\{candidat_nom\}\}/g, "Marc Dupont").replace(/\{\{departement\}\}/g, "Tech").replace(/\{\{adresse\}\}/g, "Rue du Marché 10, Genève")}
                      </div>
                      {/* Email footer */}
                      <div style={{ padding: "16px 24px", borderTop: `1px solid ${C.border}`, background: C.bg, textAlign: "center", fontSize: 11, color: C.textMuted }}>
                        {t('tpl.footer_auto')}<br />
                        {t('tpl.footer_reason')}<br />
                        <span style={{ color: C.pink }}>illizeo.com</span>
                      </div>
                    </div>
                    {/* Test send */}
                    {tplPanelMode === "edit" && tplPanelData.id && (
                      <div style={{ marginTop: 16, padding: "14px 16px", background: C.bg, borderRadius: 10, display: "flex", alignItems: "center", gap: 10 }}>
                        <Send size={14} color={C.pink} />
                        <span style={{ fontSize: 12, color: C.text, fontWeight: 500 }}>{t('tpl.send_test')} :</span>
                        <button onClick={() => showPrompt(t('tpl.send_test_to'), async (email) => {
                          try { const res = await sendTestEmail(tplPanelData.id, email); addToast_admin(res.message); }
                          catch { addToast_admin(t('tpl.send_error')); }
                        }, { label: t('tpl.recipient_email'), type: "email", defaultValue: auth.user?.email || "" })} className="iz-btn-outline" style={{ ...sBtn("outline"), padding: "5px 12px", fontSize: 11, display: "flex", alignItems: "center", gap: 4 }}><Send size={12} /> {t('tpl.send_test')}</button>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div style={{ padding: "16px 28px", borderTop: `1px solid ${C.border}`, display: "flex", gap: 12, justifyContent: "space-between" }}>
                <div style={{ display: "flex", gap: 8 }}>
                  {tplPanelMode === "edit" && <button onClick={() => { setConfirmDialog({ message: t('tpl.delete_confirm'), onConfirm: async () => { try { await apiDeleteEmailTpl(tplPanelData.id); addToast_admin(t('tpl.deleted')); setTplPanelMode("closed"); refetchEmailTemplates(); } catch {} setConfirmDialog(null); }}); }} style={{ ...sBtn("outline"), color: C.red, borderColor: C.red, fontSize: 13 }}>{t('common.delete')}</button>}
                  {tplPanelMode === "edit" && tplPanelData.id && <button onClick={async () => { try { await apiDuplicateEmailTpl(tplPanelData.id); addToast_admin(t('tpl.duplicated')); refetchEmailTemplates(); } catch {} }} style={{ ...sBtn("outline"), fontSize: 13 }}>{t('common.duplicate')}</button>}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => setTplPanelMode("closed")} style={{ ...sBtn("outline"), fontSize: 13 }}>{t('common.cancel')}</button>
                  <button onClick={async () => {
                    try {
                      const payload: Record<string, any> = { nom: tplPanelData.nom, sujet: tplPanelData.sujet, declencheur: tplPanelData.declencheur, variables: tplPanelData.variables, actif: tplPanelData.actif, contenu: tplPanelData.contenu, translations: buildTranslationsPayload() };
                      if (tplPanelMode === "create") { await apiCreateEmailTpl(payload); addToast_admin(t('tpl.created')); }
                      else { await apiUpdateEmailTpl(tplPanelData.id, payload); addToast_admin(t('tpl.updated')); }
                      setTplPanelMode("closed"); refetchEmailTemplates();
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
      { key: "hrbp", label: t('team_role.hrbp'), icon: UserCheck, color: "#E41076" },
      { key: "buddy", label: t('team_role.buddy'), icon: Hand, color: "#F9A825" },
      { key: "it", label: t('team_role.it_support'), icon: Clock, color: "#1A73E8" },
      { key: "recruteur", label: t('team_role.recruiter'), icon: Search, color: "#7B5EA7" },
    ];


    const renderEquipes = () => (
      <div style={{ flex: 1, padding: "24px 32px", overflow: "auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 600, margin: 0 }}>{t('admin.teams_groups')}</h1>
            <p style={{ fontSize: 12, color: C.textLight, margin: "4px 0 0" }}>{t('team.subtitle')}</p>
          </div>
          <button onClick={() => { setTeamPanelData({ nom: "", description: "", site: "", members: [] }); resetTr(); setTeamPanelMode("create"); }} className="iz-btn-pink" style={{ ...sBtn("pink"), display: "flex", alignItems: "center", gap: 6 }}><Plus size={16} /> {t('team.new')}</button>
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
                {(team.members || []).length === 0 && <div style={{ fontSize: 11, color: C.textMuted }}>{t('team.no_member')}</div>}
              </div>
            </div>
          ))}
          {obTeams.length === 0 && <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: 40, color: C.textMuted }}>{t('team.no_team')}</div>}
        </div>

        {/* Team panel */}
        {teamPanelMode !== "closed" && (
          <>
            <div onClick={() => setTeamPanelMode("closed")} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.3)", zIndex: 1000 }} />
            <div className="iz-panel" style={{ position: "fixed", top: 0, right: 0, width: 520, height: "100vh", background: C.white, boxShadow: "-4px 0 24px rgba(0,0,0,.1)", zIndex: 1001, display: "flex", flexDirection: "column" }}>
              <div style={{ padding: "24px 28px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>{teamPanelMode === "create" ? t('team.new') : t('team.edit')}</h2>
                <button onClick={() => setTeamPanelMode("closed")} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={22} color={C.textLight} /></button>
              </div>
              <div style={{ flex: 1, padding: "24px 28px", overflow: "auto" }}>
                <div style={{ marginBottom: 16 }}><label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>{t('team.name_label')}</label><TranslatableField value={teamPanelData.nom} onChange={v => setTeamPanelData((p: any) => ({ ...p, nom: v }))} placeholder="Ex: Team Genève" currentLang={lang} activeLangs={activeLanguages} translations={contentTranslations.nom} onTranslationsChange={tr => setTr("nom", tr)} /></div>
                <div style={{ marginBottom: 16 }}><label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>{t('common.description')}</label><TranslatableField multiline rows={2} value={teamPanelData.description} onChange={v => setTeamPanelData((p: any) => ({ ...p, description: v }))} currentLang={lang} activeLangs={activeLanguages} translations={contentTranslations.description} onTranslationsChange={tr => setTr("description", tr)} /></div>
                <div style={{ marginBottom: 16 }}><label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>{t('team.site_label')}</label><select value={teamPanelData.site} onChange={e => setTeamPanelData((p: any) => ({ ...p, site: e.target.value }))} style={{ ...sInput, cursor: "pointer" }}><option value="">{t('team.none')}</option>{SITES.map(s => <option key={s} value={s}>{s}</option>)}</select></div>

                {/* Members */}
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 8 }}>{t('team.members_label')}</label>
                  {(teamPanelData.members || []).map((m: any, i: number) => (
                    <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "center" }}>
                      <select value={m.role} onChange={e => { const arr = [...teamPanelData.members]; arr[i] = { ...arr[i], role: e.target.value }; setTeamPanelData((p: any) => ({ ...p, members: arr })); }} style={{ ...sInput, width: 130, fontSize: 12, cursor: "pointer" }}>
                        {ACCOMP_ROLES.map(r => <option key={r.key} value={r.key}>{r.label}</option>)}
                      </select>
                      <select value={m.user_id || ""} onChange={e => { const arr = [...teamPanelData.members]; arr[i] = { ...arr[i], user_id: Number(e.target.value) }; setTeamPanelData((p: any) => ({ ...p, members: arr })); }} style={{ ...sInput, flex: 1, fontSize: 12, cursor: "pointer" }}>
                        <option value="">{t('team.select_user')}</option>
                        {adminUsers.filter(u => ["admin_rh", "manager", "super_admin", "admin"].includes(u.role)).map((u: any) => <option key={u.id} value={u.id}>{u.name} ({u.role})</option>)}
                      </select>
                      <button onClick={() => { const arr = teamPanelData.members.filter((_: any, j: number) => j !== i); setTeamPanelData((p: any) => ({ ...p, members: arr })); }} style={{ background: "none", border: "none", cursor: "pointer", color: C.red }}><X size={14} /></button>
                    </div>
                  ))}
                  <button onClick={() => setTeamPanelData((p: any) => ({ ...p, members: [...(p.members || []), { role: "buddy", user_id: null }] }))} style={{ fontSize: 11, color: C.pink, background: "none", border: "none", cursor: "pointer", fontWeight: 600, fontFamily: font }}>{t('team.add_member')}</button>
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
      { key: "invitation_utilisateur", label: t('notifcfg.user_invitation'), icon: Mail },
      { key: "delegation", label: t('notifcfg.delegation'), icon: ArrowRight },
      // New notifications
      { key: "nouveau_message", label: t('notifcfg.new_message'), icon: MessageSquare },
      { key: "document_valide", label: t('notifcfg.doc_validated'), icon: CheckCircle2 },
      { key: "badge_obtenu", label: t('notifcfg.badge_earned'), icon: Award },
      { key: "cooptation_statut", label: t('notifcfg.cooptation_status'), icon: Handshake },
      { key: "parcours_termine", label: t('notifcfg.path_completed'), icon: Trophy },
      { key: "signature_requise", label: t('notifcfg.signature_required'), icon: PenTool },
      { key: "rappel_pre_arrivee", label: t('notifcfg.pre_arrival_reminder'), icon: Rocket },
      { key: "feedback_buddy", label: t('notifcfg.buddy_feedback'), icon: Hand },
      { key: "mobilite_interne", label: t('notifcfg.internal_mobility'), icon: Route },
      { key: "retour_conge", label: t('notifcfg.return_from_leave'), icon: Heart },
      { key: "resume_hebdo", label: t('notifcfg.weekly_summary'), icon: CalendarCheck },
      { key: "nps_enquete", label: t('notifcfg.nps_survey'), icon: Star },
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
          <h1 style={{ fontSize: 22, fontWeight: 600, margin: 0 }}>{t('admin.notif_config')}</h1>
        </div>
        <p style={{ fontSize: 13, color: C.textMuted, marginBottom: 16 }}>{t('notifcfg.subtitle')}</p>

        <div className="iz-card" style={{ ...sCard, overflow: "hidden", padding: 0 }}>
          {/* Header */}
          <div style={{ display: "grid", gridTemplateColumns: "2fr 80px 80px 80px", gap: 0, padding: "12px 20px", background: C.bg, borderBottom: `1px solid ${C.border}`, fontSize: 11, fontWeight: 600, color: C.textLight, textTransform: "uppercase" }}>
            <span>{t('notifcfg.notification')}</span><span style={{ textAlign: "center" }}>Email</span><span style={{ textAlign: "center" }}>Push</span><span style={{ textAlign: "center" }}>In-app</span>
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
      { type: "hero", label: t('block.hero'), icon: Clapperboard },
      { type: "text", label: t('block.text'), icon: FileText },
      { type: "mission", label: t('block.mission'), icon: Target },
      { type: "stats", label: t('block.key_figures'), icon: BarChart3 },
      { type: "values", label: t('block.values'), icon: Star },
      { type: "video", label: t('block.videos'), icon: Play },
      { type: "team", label: t('block.team'), icon: Users },
      { type: "office_tour", label: "Tour des bureaux", icon: MapPin },
      { type: "culture_quiz", label: "Quiz culture", icon: BookMarked },
      { type: "gamification_quests", label: "Quêtes gamification", icon: Trophy },
      { type: "journey_milestones", label: "Jalons parcours 100j", icon: Award },
    ];

    // Defaults used to seed a freshly-created block so the editor isn't empty.
    // For culture_quiz, mirror the 5 starter questions that the employee view falls back to.
    const BLOCK_DEFAULTS: Record<string, { titre?: string; data?: any }> = {
      culture_quiz: {
        titre: "Quiz culture",
        data: {
          category: "Notre raison d'être",
          xp_per_correct: 10,
          questions: [
            { q: "Notre raison d'être tient en une phrase. Laquelle ?", options: ["Maximiser le profit", "Faire grandir les hommes pour faire grandir l'industrie", "Dominer notre marché", "Innover à tout prix"], correct: 1, explain: "C'est exactement notre boussole. Cette phrase guide chaque décision stratégique." },
            { q: "Quelle valeur place-t-on en premier dans nos prises de décision ?", options: ["Vitesse", "Bienveillance", "Qualité", "Profit"], correct: 1, explain: "La bienveillance est notre socle relationnel et opérationnel." },
            { q: "Quel rituel d'équipe est sacré chez nous ?", options: ["Le café du lundi 9h", "Le all-hands mensuel", "Le retro vendredi", "Tout cela"], correct: 3, explain: "Tous nos rituels comptent — ils tissent la culture au quotidien." },
            { q: "Que signifie être 'Illizéen' au quotidien ?", options: ["Suivre les process à la lettre", "Oser, partager, transmettre", "Travailler seul efficacement", "Maximiser ses KPIs"], correct: 1, explain: "Trois verbes simples qui résument notre ADN." },
            { q: "Combien de jours dure votre parcours d'intégration ?", options: ["30 jours", "60 jours", "100 jours", "Une année"], correct: 2, explain: "100 jours pour vous accompagner pas à pas, jusqu'à votre pleine autonomie." },
          ],
        },
      },
    };


    // Drag & drop state for block reordering (plain closure vars, no hooks)
    let _dragFromIdx: number | null = null;
    let _dragToIdx: number | null = null;

    const handleBlockDragStart = (idx: number) => {
      _dragFromIdx = idx;
    };

    const handleBlockDragOver = (e: React.DragEvent, idx: number) => {
      e.preventDefault();
      _dragToIdx = idx;
      // Visual feedback via DOM (avoids needing useState in factory)
      document.querySelectorAll('[data-block-drag]').forEach(el => {
        (el as HTMLElement).style.borderTopColor = 'transparent';
      });
      const target = document.querySelector(`[data-block-drag="${idx}"]`) as HTMLElement;
      if (target) target.style.borderTopColor = C.pink;
    };

    const handleBlockDrop = async () => {
      document.querySelectorAll('[data-block-drag]').forEach(el => {
        (el as HTMLElement).style.borderTopColor = 'transparent';
      });
      if (_dragFromIdx === null || _dragToIdx === null || _dragFromIdx === _dragToIdx) return;
      const reordered = [...companyBlocks];
      const [moved] = reordered.splice(_dragFromIdx, 1);
      reordered.splice(_dragToIdx, 0, moved);
      const updated = reordered.map((b, i) => ({ ...b, ordre: i + 1 }));
      setCompanyBlocks(updated);
      _dragFromIdx = null;
      _dragToIdx = null;
      for (const b of updated) {
        apiUpdateBlock(b.id, { ordre: b.ordre }).catch(() => {});
      }
      addToast_admin(t('toast.order_saved') || "Ordre enregistré");
    };

    const renderEntreprise_admin = () => {
      const editBlock = companyBlocks.find(b => b.id === editingBlockId);
      return (
      <div style={{ flex: 1, padding: "24px 32px", overflow: "auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <h1 style={{ fontSize: 22, fontWeight: 600, margin: 0 }}>{t('admin.company_page')}</h1>
        </div>

        {/* Add block tiles */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 8, marginBottom: 20 }}>
          {BLOCK_TYPES.map(bt => {
            const BtIcon = bt.icon;
            return (
              <button key={bt.type} className="iz-sidebar-item" onClick={async () => {
                const defaults = BLOCK_DEFAULTS[bt.type] || {};
                const newBlock = await apiCreateBlock({ type: bt.type, titre: defaults.titre || "Nouveau bloc", contenu: "", ordre: companyBlocks.length + 1, actif: true, data: defaults.data || {} });
                setCompanyBlocks(prev => [...prev, newBlock]);
                setEditingBlockId(newBlock.id);
                addToast_admin(t('block.created'));
              }} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", borderRadius: 8, border: `1.5px dashed ${C.border}`, background: C.white, cursor: "pointer", fontFamily: font, fontSize: 11, fontWeight: 500, color: C.textLight, transition: "all .2s", whiteSpace: "nowrap" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.pink; e.currentTarget.style.color = C.pink; e.currentTarget.style.background = C.pinkBg; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textLight; e.currentTarget.style.background = C.white; }}>
                <BtIcon size={14} />
                {bt.label}
              </button>
            );
          })}
        </div>

        {/* Blocks list — drag & drop reorderable */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {companyBlocks.map((block, idx) => {
            const bt = BLOCK_TYPES.find(t => t.type === block.type);
            const BIcon = bt?.icon || FileText;
            return (
              <div
                key={block.id}
                data-block-drag={idx}
                draggable
                onDragStart={() => handleBlockDragStart(idx)}
                onDragOver={(e) => handleBlockDragOver(e, idx)}
                onDragEnd={() => { document.querySelectorAll('[data-block-drag]').forEach(el => { (el as HTMLElement).style.borderTopColor = 'transparent'; }); }}
                onDrop={handleBlockDrop}
                className="iz-card"
                style={{
                  ...sCard,
                  display: "flex", alignItems: "center", gap: 14,
                  opacity: block.actif ? 1 : 0.5,
                  padding: "14px 18px",
                  cursor: "grab",
                  borderTop: "2px solid transparent",
                  transition: "border-color .15s, opacity .2s",
                }}>
                {/* Drag handle */}
                <div style={{ display: "flex", flexDirection: "column", gap: 2, cursor: "grab", padding: "4px 2px", flexShrink: 0, color: C.textMuted }}>
                  <div style={{ width: 12, display: "flex", flexWrap: "wrap", gap: 2 }}>
                    {[...Array(6)].map((_, i) => <div key={i} style={{ width: 3, height: 3, borderRadius: "50%", background: C.textMuted }} />)}
                  </div>
                </div>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: C.pinkBg, display: "flex", alignItems: "center", justifyContent: "center" }}><BIcon size={16} color={C.pink} /></div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{(lang !== "fr" && block.translations?.titre?.[lang]) || block.titre || bt?.label || block.type}</div>
                  <div style={{ fontSize: 11, color: C.textLight }}>{bt?.label} · {t('block.order')}: {block.ordre}</div>
                </div>
                <div onClick={async () => { await apiUpdateBlock(block.id, { actif: !block.actif }); setCompanyBlocks(prev => prev.map(b => b.id === block.id ? { ...b, actif: !b.actif } : b)); addToast_admin(block.actif ? t('block.disabled') : t('block.enabled')); }}
                  style={{ width: 40, height: 22, borderRadius: 11, background: block.actif ? C.green : C.border, cursor: "pointer", position: "relative", transition: "all .2s", flexShrink: 0 }}>
                  <div style={{ width: 18, height: 18, borderRadius: "50%", background: C.white, position: "absolute", top: 2, left: block.actif ? 20 : 2, transition: "all .2s", boxShadow: "0 1px 3px rgba(0,0,0,.2)" }} />
                </div>
                <button onClick={() => {
                  setContentTranslations((block as any).translations || {});
                  // Seed empty blocks with starter data so the editor isn't blank
                  // (covers blocks created before the create-time defaults were added).
                  const defaults = BLOCK_DEFAULTS[block.type];
                  const isEmpty = !block.data || Object.keys(block.data).length === 0
                    || (block.type === "culture_quiz" && !(block.data?.questions?.length));
                  if (defaults && isEmpty) {
                    setCompanyBlocks(prev => prev.map(b => b.id === block.id ? {
                      ...b,
                      titre: (b.titre && b.titre !== "Nouveau bloc") ? b.titre : (defaults.titre || b.titre),
                      data: { ...(defaults.data || {}), ...(b.data || {}) },
                    } : b));
                  }
                  setEditingBlockId(block.id === editingBlockId ? null : block.id);
                }} className="iz-btn-outline" style={{ ...sBtn("outline"), fontSize: 11, padding: "5px 12px" }}>{t('common.edit')}</button>
                <button onClick={() => {
                  setConfirmDialog({ message: t('block.delete_confirm'), onConfirm: async () => {
                    await apiDeleteBlock(block.id);
                    setCompanyBlocks(prev => prev.filter(b => b.id !== block.id));
                    setConfirmDialog(null);
                    addToast_admin(t('block.deleted'));
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
            <div className="iz-panel" style={{ position: "fixed", top: 0, right: 0, width: 720, maxWidth: "90vw", height: "100vh", background: C.white, boxShadow: "-4px 0 24px rgba(0,0,0,.1)", zIndex: 1001, display: "flex", flexDirection: "column" }}>
              <div style={{ padding: "24px 28px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>{t('common.edit_block')}</h2>
                <button onClick={() => setEditingBlockId(null)} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={22} color={C.textLight} /></button>
              </div>
              <div style={{ flex: 1, padding: "24px 28px", overflow: "auto" }}>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>{t('common.title')}</label>
                  <TranslatableField value={editBlock.titre || ""} onChange={v => setCompanyBlocks(prev => prev.map(b => b.id === editBlock.id ? { ...b, titre: v } : b))} currentLang={lang} activeLangs={activeLanguages} translations={contentTranslations.titre} onTranslationsChange={tr => setTr("titre", tr)} style={sInput} />
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>{t('common.content')}</label>
                  <TranslatableField value={editBlock.contenu || ""} onChange={v => setCompanyBlocks(prev => prev.map(b => b.id === editBlock.id ? { ...b, contenu: v } : b))} currentLang={lang} activeLangs={activeLanguages} translations={contentTranslations.contenu} onTranslationsChange={tr => setTr("contenu", tr)} style={{ ...sInput, resize: "vertical" }} multiline rows={4} />
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>{t('common.order')}</label>
                  <input type="number" value={editBlock.ordre} onChange={e => setCompanyBlocks(prev => prev.map(b => b.id === editBlock.id ? { ...b, ordre: Number(e.target.value) } : b))} style={{ ...sInput, width: 80 }} />
                </div>
                {/* Video items editor — only for video blocks */}
                {editBlock.type === "video" && (
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 8 }}>{lang === "fr" ? "Vidéos" : "Videos"}</label>
                    {(editBlock.data?.videos || []).map((v: any, vi: number) => (
                      <div key={vi} style={{ padding: "12px", border: `1px solid ${C.border}`, borderRadius: 8, marginBottom: 8 }}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
                          <div>
                            <label style={{ fontSize: 10, color: C.textMuted, display: "block", marginBottom: 4 }}>{lang === "fr" ? "Titre" : "Title"}</label>
                            <input value={v.title || ""} onChange={e => { const vids = [...(editBlock.data?.videos || [])]; vids[vi] = { ...vids[vi], title: e.target.value }; setCompanyBlocks(prev => prev.map(b => b.id === editBlock.id ? { ...b, data: { ...b.data, videos: vids } } : b)); }} style={{ ...sInput, fontSize: 11 }} />
                          </div>
                          <div>
                            <label style={{ fontSize: 10, color: C.textMuted, display: "block", marginBottom: 4 }}>YouTube ID</label>
                            <input value={v.youtube_id || ""} onChange={e => { const vids = [...(editBlock.data?.videos || [])]; vids[vi] = { ...vids[vi], youtube_id: e.target.value }; setCompanyBlocks(prev => prev.map(b => b.id === editBlock.id ? { ...b, data: { ...b.data, videos: vids } } : b)); }} placeholder="dQw4w9WgXcQ" style={{ ...sInput, fontSize: 11, fontFamily: "monospace" }} />
                          </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 11 }}>
                            <input type="checkbox" checked={v.dashboard_featured || false} onChange={e => {
                              const vids = (editBlock.data?.videos || []).map((vid: any, idx: number) => ({ ...vid, dashboard_featured: idx === vi ? e.target.checked : false }));
                              setCompanyBlocks(prev => prev.map(b => b.id === editBlock.id ? { ...b, data: { ...b.data, videos: vids } } : b));
                            }} style={{ accentColor: C.pink }} />
                            <span style={{ fontWeight: v.dashboard_featured ? 600 : 400, color: v.dashboard_featured ? C.pink : C.textMuted }}>
                              {lang === "fr" ? "Afficher sur le dashboard employé" : "Show on employee dashboard"}
                            </span>
                          </label>
                          <button onClick={() => { const vids = (editBlock.data?.videos || []).filter((_: any, idx: number) => idx !== vi); setCompanyBlocks(prev => prev.map(b => b.id === editBlock.id ? { ...b, data: { ...b.data, videos: vids } } : b)); }} style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}><X size={14} color={C.red} /></button>
                        </div>
                      </div>
                    ))}
                    <button onClick={() => { const vids = [...(editBlock.data?.videos || []), { title: "", youtube_id: "", dashboard_featured: false }]; setCompanyBlocks(prev => prev.map(b => b.id === editBlock.id ? { ...b, data: { ...b.data, videos: vids } } : b)); }} className="iz-btn-outline" style={{ ...sBtn("outline"), fontSize: 11, padding: "5px 12px" }}>+ {lang === "fr" ? "Ajouter une vidéo" : "Add video"}</button>
                  </div>
                )}

                {/* OFFICE TOUR EDITOR */}
                {editBlock.type === "office_tour" && (
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
                      <div>
                        <label style={{ fontSize: 11, color: C.textMuted, display: "block", marginBottom: 4 }}>Site (ex: Siège Paris)</label>
                        <input value={editBlock.data?.site || ""} onChange={e => setCompanyBlocks(prev => prev.map(b => b.id === editBlock.id ? { ...b, data: { ...b.data, site: e.target.value } } : b))} style={{ ...sInput, fontSize: 12 }} />
                      </div>
                      <div>
                        <label style={{ fontSize: 11, color: C.textMuted, display: "block", marginBottom: 4 }}>Étage / zone (ex: Étage 4)</label>
                        <input value={editBlock.data?.etage || ""} onChange={e => setCompanyBlocks(prev => prev.map(b => b.id === editBlock.id ? { ...b, data: { ...b.data, etage: e.target.value } } : b))} style={{ ...sInput, fontSize: 12 }} />
                      </div>
                    </div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 8 }}>Salles & lieux</label>
                    {(editBlock.data?.rooms || []).map((r: any, ri: number) => (
                      <div key={ri} style={{ padding: "12px", border: `1px solid ${C.border}`, borderRadius: 8, marginBottom: 8 }}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 80px", gap: 8, marginBottom: 8 }}>
                          <div>
                            <label style={{ fontSize: 10, color: C.textMuted, display: "block", marginBottom: 4 }}>Nom *</label>
                            <input value={r.title || ""} onChange={e => { const rs = [...(editBlock.data?.rooms || [])]; rs[ri] = { ...rs[ri], title: e.target.value }; setCompanyBlocks(prev => prev.map(b => b.id === editBlock.id ? { ...b, data: { ...b.data, rooms: rs } } : b)); }} placeholder="Open-space RSE" style={{ ...sInput, fontSize: 11 }} />
                          </div>
                          <div>
                            <label style={{ fontSize: 10, color: C.textMuted, display: "block", marginBottom: 4 }}>Description</label>
                            <input value={r.subtitle || ""} onChange={e => { const rs = [...(editBlock.data?.rooms || [])]; rs[ri] = { ...rs[ri], subtitle: e.target.value }; setCompanyBlocks(prev => prev.map(b => b.id === editBlock.id ? { ...b, data: { ...b.data, rooms: rs } } : b)); }} placeholder="Votre poste · 4.12" style={{ ...sInput, fontSize: 11 }} />
                          </div>
                          <div>
                            <label style={{ fontSize: 10, color: C.textMuted, display: "block", marginBottom: 4 }}>Largeur</label>
                            <select value={r.span || 1} onChange={e => { const rs = [...(editBlock.data?.rooms || [])]; rs[ri] = { ...rs[ri], span: Number(e.target.value) }; setCompanyBlocks(prev => prev.map(b => b.id === editBlock.id ? { ...b, data: { ...b.data, rooms: rs } } : b)); }} style={{ ...sInput, fontSize: 11 }}>
                              <option value={1}>1 col</option>
                              <option value={2}>2 col</option>
                              <option value={3}>3 col</option>
                            </select>
                          </div>
                        </div>
                        <button onClick={() => { const rs = (editBlock.data?.rooms || []).filter((_: any, i: number) => i !== ri); setCompanyBlocks(prev => prev.map(b => b.id === editBlock.id ? { ...b, data: { ...b.data, rooms: rs } } : b)); }} style={{ background: "none", border: "none", cursor: "pointer", padding: 2, color: C.red, fontSize: 11 }}>Supprimer</button>
                      </div>
                    ))}
                    <button onClick={() => { const rs = [...(editBlock.data?.rooms || []), { title: "", subtitle: "", span: 1 }]; setCompanyBlocks(prev => prev.map(b => b.id === editBlock.id ? { ...b, data: { ...b.data, rooms: rs } } : b)); }} className="iz-btn-outline" style={{ ...sBtn("outline"), fontSize: 11, padding: "5px 12px", marginBottom: 14 }}>+ Ajouter un lieu</button>
                    <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 14 }}>
                      <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 8 }}>🎁 Chasse au trésor</label>
                      <div style={{ display: "grid", gap: 8 }}>
                        <input value={editBlock.data?.treasure_title || ""} onChange={e => setCompanyBlocks(prev => prev.map(b => b.id === editBlock.id ? { ...b, data: { ...b.data, treasure_title: e.target.value } } : b))} placeholder="Trouvez la mascotte !" style={{ ...sInput, fontSize: 12 }} />
                        <textarea value={editBlock.data?.treasure_desc || ""} onChange={e => setCompanyBlocks(prev => prev.map(b => b.id === editBlock.id ? { ...b, data: { ...b.data, treasure_desc: (e.target as HTMLTextAreaElement).value } } : b))} placeholder="Une peluche cachée à chaque étage. Photo + #welcome = mug collector." style={{ ...sInput, fontSize: 12, minHeight: 60, resize: "vertical" }} />
                      </div>
                    </div>
                  </div>
                )}

                {/* CULTURE QUIZ EDITOR */}
                {editBlock.type === "culture_quiz" && (
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
                      <div>
                        <label style={{ fontSize: 11, color: C.textMuted, display: "block", marginBottom: 4 }}>Catégorie (badge)</label>
                        <input value={editBlock.data?.category || ""} onChange={e => setCompanyBlocks(prev => prev.map(b => b.id === editBlock.id ? { ...b, data: { ...b.data, category: e.target.value } } : b))} placeholder="Notre raison d'être" style={{ ...sInput, fontSize: 12 }} />
                      </div>
                      <div>
                        <label style={{ fontSize: 11, color: C.textMuted, display: "block", marginBottom: 4 }}>XP par bonne réponse</label>
                        <input type="number" value={editBlock.data?.xp_per_correct ?? 10} onChange={e => setCompanyBlocks(prev => prev.map(b => b.id === editBlock.id ? { ...b, data: { ...b.data, xp_per_correct: Number(e.target.value) } } : b))} style={{ ...sInput, fontSize: 12 }} />
                      </div>
                    </div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 8 }}>Questions</label>
                    {(editBlock.data?.questions || []).map((q: any, qi: number) => (
                      <div key={qi} style={{ padding: "12px", border: `1px solid ${C.border}`, borderRadius: 8, marginBottom: 8 }}>
                        <div style={{ marginBottom: 8 }}>
                          <label style={{ fontSize: 10, color: C.textMuted, display: "block", marginBottom: 4 }}>Question</label>
                          <input value={q.q || ""} onChange={e => { const qs = [...(editBlock.data?.questions || [])]; qs[qi] = { ...qs[qi], q: e.target.value }; setCompanyBlocks(prev => prev.map(b => b.id === editBlock.id ? { ...b, data: { ...b.data, questions: qs } } : b)); }} style={{ ...sInput, fontSize: 11 }} />
                        </div>
                        <div style={{ marginBottom: 8 }}>
                          <label style={{ fontSize: 10, color: C.textMuted, display: "block", marginBottom: 4 }}>Options (une par ligne) — préfixer la bonne réponse par * (ex: *Bonne réponse)</label>
                          <textarea
                            value={(q.options || []).map((o: string, oi: number) => oi === q.correct ? `*${o}` : o).join("\n")}
                            onChange={e => {
                              const lines = (e.target as HTMLTextAreaElement).value.split("\n");
                              const opts: string[] = [];
                              let correct = 0;
                              lines.forEach((l, idx) => {
                                if (l.startsWith("*")) { correct = idx; opts.push(l.slice(1)); }
                                else opts.push(l);
                              });
                              const qs = [...(editBlock.data?.questions || [])];
                              qs[qi] = { ...qs[qi], options: opts, correct };
                              setCompanyBlocks(prev => prev.map(b => b.id === editBlock.id ? { ...b, data: { ...b.data, questions: qs } } : b));
                            }}
                            style={{ ...sInput, fontSize: 11, minHeight: 90, resize: "vertical" }}
                            placeholder="Option A&#10;*Bonne réponse&#10;Option C&#10;Option D"
                          />
                        </div>
                        <div style={{ marginBottom: 8 }}>
                          <label style={{ fontSize: 10, color: C.textMuted, display: "block", marginBottom: 4 }}>Explication (affichée après réponse)</label>
                          <input value={q.explain || ""} onChange={e => { const qs = [...(editBlock.data?.questions || [])]; qs[qi] = { ...qs[qi], explain: e.target.value }; setCompanyBlocks(prev => prev.map(b => b.id === editBlock.id ? { ...b, data: { ...b.data, questions: qs } } : b)); }} style={{ ...sInput, fontSize: 11 }} />
                        </div>
                        <button onClick={() => { const qs = (editBlock.data?.questions || []).filter((_: any, i: number) => i !== qi); setCompanyBlocks(prev => prev.map(b => b.id === editBlock.id ? { ...b, data: { ...b.data, questions: qs } } : b)); }} style={{ background: "none", border: "none", cursor: "pointer", padding: 2, color: C.red, fontSize: 11 }}>Supprimer la question</button>
                      </div>
                    ))}
                    <button onClick={() => { const qs = [...(editBlock.data?.questions || []), { q: "", options: ["", "", "", ""], correct: 0, explain: "" }]; setCompanyBlocks(prev => prev.map(b => b.id === editBlock.id ? { ...b, data: { ...b.data, questions: qs } } : b)); }} className="iz-btn-outline" style={{ ...sBtn("outline"), fontSize: 11, padding: "5px 12px" }}>+ Ajouter une question</button>
                  </div>
                )}

                {/* JOURNEY MILESTONES EDITOR */}
                {editBlock.type === "journey_milestones" && (
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ marginBottom: 14 }}>
                      <label style={{ fontSize: 11, color: C.textMuted, display: "block", marginBottom: 4 }}>S'applique à</label>
                      <select value={editBlock.data?.categorie || ""} onChange={e => setCompanyBlocks(prev => prev.map(b => b.id === editBlock.id ? { ...b, data: { ...b.data, categorie: e.target.value } } : b))} style={{ ...sInput, fontSize: 12, cursor: "pointer" }}>
                        <option value="">Tous les parcours (générique)</option>
                        <option value="onboarding">Onboarding</option>
                        <option value="offboarding">Offboarding</option>
                        <option value="reboarding">Reboarding</option>
                        <option value="crossboarding">Crossboarding</option>
                      </select>
                      <div style={{ fontSize: 10, color: C.textMuted, marginTop: 4, lineHeight: 1.4 }}>
                        Si une catégorie spécifique est choisie, ce bloc s'applique uniquement aux collaborateurs en parcours de cette catégorie. La catégorie la plus précise gagne sur le générique.
                      </div>
                    </div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 8 }}>Jalons (badges débloqués automatiquement)</label>
                    {(editBlock.data?.milestones || []).map((m: any, mi: number) => (
                      <div key={mi} style={{ padding: "12px", border: `1px solid ${C.border}`, borderRadius: 8, marginBottom: 8 }}>
                        <div style={{ display: "grid", gridTemplateColumns: "80px 1fr 1fr", gap: 8, marginBottom: 8 }}>
                          <div>
                            <label style={{ fontSize: 10, color: C.textMuted, display: "block", marginBottom: 4 }}>Jour J+</label>
                            <input type="number" value={m.day || ""} onChange={e => { const ms = [...(editBlock.data?.milestones || [])]; ms[mi] = { ...ms[mi], day: parseInt(e.target.value, 10) || 0 }; setCompanyBlocks(prev => prev.map(b => b.id === editBlock.id ? { ...b, data: { ...b.data, milestones: ms } } : b)); }} style={{ ...sInput, fontSize: 11 }} />
                          </div>
                          <div>
                            <label style={{ fontSize: 10, color: C.textMuted, display: "block", marginBottom: 4 }}>Libellé du jalon</label>
                            <input value={m.label || ""} onChange={e => { const ms = [...(editBlock.data?.milestones || [])]; ms[mi] = { ...ms[mi], label: e.target.value }; setCompanyBlocks(prev => prev.map(b => b.id === editBlock.id ? { ...b, data: { ...b.data, milestones: ms } } : b)); }} placeholder="Ex: Premier mois" style={{ ...sInput, fontSize: 11 }} />
                          </div>
                          <div>
                            <label style={{ fontSize: 10, color: C.textMuted, display: "block", marginBottom: 4 }}>Nom du badge</label>
                            <input value={m.badge_name || ""} onChange={e => { const ms = [...(editBlock.data?.milestones || [])]; ms[mi] = { ...ms[mi], badge_name: e.target.value }; setCompanyBlocks(prev => prev.map(b => b.id === editBlock.id ? { ...b, data: { ...b.data, milestones: ms } } : b)); }} placeholder="Ex: Autonome" style={{ ...sInput, fontSize: 11 }} />
                          </div>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 100px 100px", gap: 8, marginBottom: 8 }}>
                          <div>
                            <label style={{ fontSize: 10, color: C.textMuted, display: "block", marginBottom: 4 }}>Description (affichée à l'employé)</label>
                            <input value={m.description || ""} onChange={e => { const ms = [...(editBlock.data?.milestones || [])]; ms[mi] = { ...ms[mi], description: e.target.value }; setCompanyBlocks(prev => prev.map(b => b.id === editBlock.id ? { ...b, data: { ...b.data, milestones: ms } } : b)); }} placeholder="Vous êtes opérationnel..." style={{ ...sInput, fontSize: 11 }} />
                          </div>
                          <div>
                            <label style={{ fontSize: 10, color: C.textMuted, display: "block", marginBottom: 4 }}>Couleur</label>
                            <input type="color" value={m.badge_color || "#E91E8C"} onChange={e => { const ms = [...(editBlock.data?.milestones || [])]; ms[mi] = { ...ms[mi], badge_color: e.target.value }; setCompanyBlocks(prev => prev.map(b => b.id === editBlock.id ? { ...b, data: { ...b.data, milestones: ms } } : b)); }} style={{ ...sInput, fontSize: 11, padding: "2px 4px", height: 32 }} />
                          </div>
                          <div>
                            <label style={{ fontSize: 10, color: C.textMuted, display: "block", marginBottom: 4 }}>Icône</label>
                            <select value={m.icon || "trophy"} onChange={e => { const ms = [...(editBlock.data?.milestones || [])]; ms[mi] = { ...ms[mi], icon: e.target.value }; setCompanyBlocks(prev => prev.map(b => b.id === editBlock.id ? { ...b, data: { ...b.data, milestones: ms } } : b)); }} style={{ ...sInput, fontSize: 11 }}>
                              <option value="rocket">🚀 Rocket</option>
                              <option value="sparkles">✨ Sparkles</option>
                              <option value="award">🏅 Award</option>
                              <option value="star">⭐ Star</option>
                              <option value="trophy">🏆 Trophy</option>
                              <option value="heart">❤️ Heart</option>
                              <option value="gem">💎 Gem</option>
                              <option value="crown">👑 Crown</option>
                            </select>
                          </div>
                        </div>
                        <button onClick={() => { const ms = (editBlock.data?.milestones || []).filter((_: any, i: number) => i !== mi); setCompanyBlocks(prev => prev.map(b => b.id === editBlock.id ? { ...b, data: { ...b.data, milestones: ms } } : b)); }} style={{ background: "none", border: "none", cursor: "pointer", padding: 2, color: C.red, fontSize: 11 }}>Supprimer ce jalon</button>
                      </div>
                    ))}
                    <button onClick={() => { const ms = [...(editBlock.data?.milestones || []), { day: 1, label: "", badge_name: "", description: "", badge_color: "#E91E8C", icon: "trophy" }]; setCompanyBlocks(prev => prev.map(b => b.id === editBlock.id ? { ...b, data: { ...b.data, milestones: ms } } : b)); }} className="iz-btn-outline" style={{ ...sBtn("outline"), fontSize: 11, padding: "5px 12px" }}>+ Ajouter un jalon</button>
                    <div style={{ marginTop: 12, padding: "10px 12px", background: C.amberLight, borderRadius: 8, fontSize: 11, color: C.text, lineHeight: 1.5 }}>
                      <b style={{ color: C.amber }}>💡 Auto-attribution :</b> Quand un collaborateur dépasse le J+X d'un jalon, le badge correspondant lui est automatiquement décerné. Une notification est envoyée à l'employé, son manager et son RH (in-app + Teams + Slack si connectés).
                    </div>
                  </div>
                )}

                {/* GAMIFICATION QUESTS EDITOR */}
                {editBlock.type === "gamification_quests" && (
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 8 }}>Quêtes du moment</label>
                    {(editBlock.data?.quests || []).map((q: any, qi: number) => (
                      <div key={qi} style={{ padding: "12px", border: `1px solid ${C.border}`, borderRadius: 8, marginBottom: 8, display: "grid", gridTemplateColumns: "2fr 100px 50px", gap: 8, alignItems: "end" }}>
                        <div>
                          <label style={{ fontSize: 10, color: C.textMuted, display: "block", marginBottom: 4 }}>Titre de la quête</label>
                          <input value={q.title || ""} onChange={e => { const qs = [...(editBlock.data?.quests || [])]; qs[qi] = { ...qs[qi], title: e.target.value }; setCompanyBlocks(prev => prev.map(b => b.id === editBlock.id ? { ...b, data: { ...b.data, quests: qs } } : b)); }} style={{ ...sInput, fontSize: 11 }} placeholder="Ex: Compléter 3 actions urgentes" />
                        </div>
                        <div>
                          <label style={{ fontSize: 10, color: C.textMuted, display: "block", marginBottom: 4 }}>Récompense XP</label>
                          <input type="number" value={q.reward ?? 50} onChange={e => { const qs = [...(editBlock.data?.quests || [])]; qs[qi] = { ...qs[qi], reward: Number(e.target.value) }; setCompanyBlocks(prev => prev.map(b => b.id === editBlock.id ? { ...b, data: { ...b.data, quests: qs } } : b)); }} style={{ ...sInput, fontSize: 11 }} />
                        </div>
                        <button onClick={() => { const qs = (editBlock.data?.quests || []).filter((_: any, i: number) => i !== qi); setCompanyBlocks(prev => prev.map(b => b.id === editBlock.id ? { ...b, data: { ...b.data, quests: qs } } : b)); }} style={{ background: "none", border: `1px solid ${C.red}`, borderRadius: 6, cursor: "pointer", padding: "6px 8px", color: C.red, fontSize: 11 }}>×</button>
                      </div>
                    ))}
                    <button onClick={() => { const qs = [...(editBlock.data?.quests || []), { title: "", reward: 50 }]; setCompanyBlocks(prev => prev.map(b => b.id === editBlock.id ? { ...b, data: { ...b.data, quests: qs } } : b)); }} className="iz-btn-outline" style={{ ...sBtn("outline"), fontSize: 11, padding: "5px 12px" }}>+ Ajouter une quête</button>
                  </div>
                )}

                {/* Preview */}
                <div style={{ marginTop: 20, padding: "16px", background: C.bg, borderRadius: 10 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: C.textMuted, textTransform: "uppercase", marginBottom: 10 }}>{t('common.preview')}</div>
                  {renderCompanyBlock(editBlock)}
                </div>
              </div>
              <div style={{ padding: "16px 28px", borderTop: `1px solid ${C.border}`, display: "flex", gap: 8, justifyContent: "flex-end" }}>
                <button onClick={() => setEditingBlockId(null)} style={{ ...sBtn("outline"), fontSize: 13 }}>{t('common.cancel')}</button>
                <button onClick={async () => {
                  await apiUpdateBlock(editBlock.id, { titre: editBlock.titre, contenu: editBlock.contenu, ordre: editBlock.ordre, data: editBlock.data, translations: contentTranslations });
                  addToast_admin(t('toast.saved'));
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

  return {
    renderWorkflows,
    renderTemplates,
    renderEquipes,
    renderNotifications_admin,
    renderEntreprise_admin,
    renderMessagerie_admin,
  };
}
