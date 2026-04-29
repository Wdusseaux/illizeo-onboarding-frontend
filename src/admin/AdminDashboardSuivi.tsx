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
  ocrExtractIdentity, type OcrIdentityResult,
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
/**
 * SearchableSelect — replacement for native <select> with an integrated search
 * input. Used by the suivi page for site / department / parcours filters where
 * a tenant may have dozens of values and scrolling a native dropdown is slow.
 *
 * Behavior: click the trigger to open, type to filter, click an option (or the
 * "Tous les …" sentinel) to select. Closes on outside click or Escape.
 */
function SearchableSelect({ value, onChange, options, allLabel, minWidth = 140 }: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  allLabel: string;
  minWidth?: number;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", handler);
    document.addEventListener("keydown", esc);
    setTimeout(() => inputRef.current?.focus(), 50);
    return () => { document.removeEventListener("mousedown", handler); document.removeEventListener("keydown", esc); };
  }, [open]);

  const filtered = options.filter(o => !query || o.label.toLowerCase().includes(query.toLowerCase()));
  const selected = options.find(o => o.value === value);
  const displayLabel = selected ? selected.label : allLabel;

  return (
    <div ref={ref} style={{ position: "relative", minWidth }}>
      <button type="button" onClick={() => setOpen(o => !o)}
        style={{
          ...sInput, padding: "6px 10px", paddingRight: 28, fontSize: 11, width: "100%",
          textAlign: "left", cursor: "pointer", color: value ? C.text : C.textMuted,
          display: "flex", alignItems: "center", gap: 6,
        }}>
        <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{displayLabel}</span>
        <ChevronRight size={12} color={C.textMuted} style={{ transform: open ? "rotate(90deg)" : "rotate(90deg)", transition: "transform .15s", flexShrink: 0, position: "absolute", right: 8, top: "50%", marginTop: -6 }} />
      </button>
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, minWidth: 220,
          background: C.white, border: `1px solid ${C.border}`, borderRadius: 8, boxShadow: "0 8px 24px rgba(0,0,0,.12)",
          zIndex: 50, overflow: "hidden",
        }}>
          <div style={{ padding: "8px 10px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 6, background: C.bg }}>
            <Search size={12} color={C.textLight} />
            <input ref={inputRef} value={query} onChange={e => setQuery(e.target.value)} placeholder="Rechercher…"
              style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontSize: 12, fontFamily: font, color: C.text, minWidth: 0 }} />
            {query && (
              <button type="button" onClick={() => setQuery("")} style={{ background: "none", border: "none", cursor: "pointer", color: C.textMuted, padding: 0, display: "flex" }}>
                <X size={12} />
              </button>
            )}
          </div>
          <div style={{ maxHeight: 240, overflowY: "auto" }}>
            <button type="button" onClick={() => { onChange(""); setOpen(false); setQuery(""); }}
              style={{ width: "100%", padding: "8px 12px", border: "none", background: !value ? C.pinkLight : "transparent", color: !value ? C.pink : C.text, fontSize: 12, fontFamily: font, fontWeight: !value ? 600 : 400, cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ flex: 1 }}>{allLabel}</span>
              {!value && <Check size={12} color={C.pink} />}
            </button>
            {filtered.length === 0 ? (
              <div style={{ padding: "12px", fontSize: 12, color: C.textMuted, textAlign: "center" }}>Aucun résultat</div>
            ) : filtered.map(o => (
              <button key={o.value} type="button" onClick={() => { onChange(o.value); setOpen(false); setQuery(""); }}
                style={{ width: "100%", padding: "8px 12px", border: "none", background: o.value === value ? C.pinkLight : "transparent", color: o.value === value ? C.pink : C.text, fontSize: 12, fontFamily: font, fontWeight: o.value === value ? 600 : 400, cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 8 }}
                onMouseEnter={e => { if (o.value !== value) e.currentTarget.style.background = C.bg; }}
                onMouseLeave={e => { if (o.value !== value) e.currentTarget.style.background = "transparent"; }}>
                <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{o.label}</span>
                {o.value === value && <Check size={12} color={C.pink} />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

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
    collabPanelMode, setCollabPanelMode, collabPanelData, setCollabPanelData, collabPanelLoading, setCollabPanelLoading, collabProfileId, setCollabProfileId, relanceCollabId, setRelanceCollabId,
    collabProfileTab, setCollabProfileTab, dossierCheck, setDossierCheck, groupePanelMode, setGroupePanelMode, groupePanelData, setGroupePanelData,
    groupePanelLoading, setGroupePanelLoading, integrationPanelId, setIntegrationPanelId, integrationConfig, setIntegrationConfig, integrationSaving, setIntegrationSaving,
    apiKeyInput, setApiKeyInput, suiviFilter, setSuiviFilter, suiviSearch, setSuiviSearch, suiviParcoursFilter, setSuiviParcoursFilter, suiviScope, setSuiviScope, suiviSiteFilter, setSuiviSiteFilter, suiviDeptFilter, setSuiviDeptFilter, collabMenuId, setCollabMenuId,
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

      // ── Briefing data ──
      const firstName = auth.user?.name?.split(" ")[0] || (lang === "fr" ? "RH" : "HR");
      const todayLabel = new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" }).toUpperCase();
      const enParcours = enCours + enRetard; // collaborateurs actifs sur un parcours
      const topRetard = COLLABORATEURS.filter(c => c.status === "en_retard").slice(0, 1)[0];
      const totalDocsManquants = totalDocsTotal - totalDocsValides;
      const collabsAvecDocsManquants = COLLABORATEURS.filter(c => c.docsValides < c.docsTotal).length;
      const collabsSansParcours = COLLABORATEURS.filter(c => !(c as any).parcours_id);
      const nbSansParcours = collabsSansParcours.length;
      const parseFrDate = (d: string): Date | null => { if (!d) return null; const p = d.split("/"); return p.length === 3 ? new Date(`${p[2]}-${p[1]}-${p[0]}`) : null; };
      const today0 = new Date(); today0.setHours(0, 0, 0, 0);
      const sameDay = (a: Date | null, b: Date) => a && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
      const todayArrivals = COLLABORATEURS.filter(c => sameDay(parseFrDate(c.dateDebut), today0));
      const firstArrival = todayArrivals[0];
      const todayDepartures = COLLABORATEURS.filter(c => sameDay(parseFrDate((c as any).dateFin || (c as any).date_fin || ""), today0));
      const firstDeparture = todayDepartures[0];

      // Stats line (6 stats — NPS removed until backend endpoint exists)
      const statsLine = [
        { label: "En parcours", value: enParcours, color: C.text },
        { label: "En cours", value: enCours, color: C.pink },
        { label: "En retard", value: enRetard, color: C.red },
        { label: "Terminés", value: termines, color: C.green },
        { label: "Progression", value: `${avgProgression}%`, color: C.text },
        { label: "Documents", value: `${docsPct}%`, color: C.text },
      ];

      // Today events — no time field until real schedule data is wired in
      const todayEvents: { name: string; sub: string; initials: string; color: string; userId?: number; avatarUrl?: string }[] = [];
      todayArrivals.forEach((c: any) => todayEvents.push({ name: `${c.prenom} ${c.nom}`, sub: "Premier jour", initials: c.initials, color: c.color, userId: c.user_id, avatarUrl: c.avatar_url || c.avatar }));
      todayDepartures.forEach((c: any) => todayEvents.push({ name: `${c.prenom} ${c.nom}`, sub: "Fin de contrat", initials: c.initials, color: c.color, userId: c.user_id, avatarUrl: c.avatar_url || c.avatar }));

      // Planning 8 semaines (S-2 → S+5): count arrivals/departures per week
      const weekStart = new Date(today0); weekStart.setDate(today0.getDate() - today0.getDay() + 1); // Monday this week
      const weeks = Array.from({ length: 8 }, (_, i) => {
        const start = new Date(weekStart); start.setDate(weekStart.getDate() + (i - 2) * 7);
        const end = new Date(start); end.setDate(start.getDate() + 7);
        const arrivals = COLLABORATEURS.filter(c => { const d = parseFrDate(c.dateDebut); return !!d && d >= start && d < end; }).length;
        const departures = COLLABORATEURS.filter(c => { const d = parseFrDate((c as any).dateFin || (c as any).date_fin || ""); return !!d && d >= start && d < end; }).length;
        return { label: i < 2 ? `S-${2 - i}` : i === 2 ? "S0" : `S+${i - 2}`, arrivals, departures };
      });
      const maxWeek = Math.max(1, ...weeks.map(w => Math.max(w.arrivals, w.departures)));

      return (
        <div style={{ flex: 1, padding: "32px 40px", overflow: "auto", fontFamily: font, background: "#FAFAFB" }}>
          {/* ── Header: date + actions ── */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, letterSpacing: 1.5, textTransform: "uppercase" }}>
              {todayLabel} · {lang === "fr" ? "Vue RH globale" : "Global HR view"}
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setAdminPage("admin_suivi")} style={{ padding: "9px 18px", borderRadius: 999, border: `1px solid ${C.border}`, background: C.white, fontSize: 13, fontFamily: font, color: C.text, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                <Search size={14} /> {lang === "fr" ? "Rechercher" : "Search"}
              </button>
              <button onClick={() => { setAdminPage("admin_suivi"); ctx.setShowNewCollabModal && ctx.setShowNewCollabModal(true); }} style={{ padding: "9px 20px", borderRadius: 999, border: "none", background: C.pink, color: C.white, fontSize: 13, fontFamily: font, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                <Plus size={14} /> {lang === "fr" ? "Nouveau collaborateur" : "New employee"}
              </button>
            </div>
          </div>

          {/* ── Hero AI Briefing ── */}
          <div style={{ background: `linear-gradient(135deg, ${C.pinkLight} 0%, #FFF8FC 50%, #F9C5DA 100%)`, borderRadius: 22, padding: "30px 36px 22px", marginBottom: 30, color: C.text, position: "relative", overflow: "hidden", border: `1px solid ${C.pinkLight}` }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 20 }}>
              <div style={{ width: 60, height: 60, borderRadius: 16, background: C.white, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 4px 14px rgba(233,30,140,.18)" }}>
                <Sparkles size={28} color={C.pink} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.pink, letterSpacing: 1.6, textTransform: "uppercase", marginBottom: 10 }}>
                  {lang === "fr" ? "Briefing du matin · IA Illizeo" : "Morning briefing · Illizeo AI"}
                </div>
                <h1 style={{ fontSize: 28, fontWeight: 400, fontFamily: 'Georgia, "Times New Roman", serif', lineHeight: 1.35, margin: "0 0 18px", letterSpacing: -0.3, color: C.text }}>
                  <em style={{ fontStyle: "italic", color: C.textMuted }}>{lang === "fr" ? "Bonjour" : "Hello"} {firstName},</em> {lang === "fr" ? "voici votre journée RH résumée par l'IA Illizeo." : "here is your HR day summarized by Illizeo AI."}
                </h1>
                <div style={{ fontSize: 14, lineHeight: 2, color: C.text, marginBottom: 22 }}>
                  {lang === "fr" ? "Sur vos " : "Among your "}
                  <span style={{ background: C.white, padding: "2px 10px", borderRadius: 6, fontWeight: 600, color: C.text, border: `1px solid ${C.pinkLight}` }}>{enParcours} {lang === "fr" ? "collaborateurs en parcours" : "employees on a journey"}</span>
                  {topRetard && <>, <span style={{ color: "#C46500", borderBottom: "1px dashed #E89500", padding: "2px 0", fontWeight: 600 }}>{enRetard} {lang === "fr" ? "ont pris du retard" : "are running late"}</span> {lang === "fr" ? "dont" : "including"} <span style={{ background: C.white, padding: "2px 10px", borderRadius: 6, fontWeight: 600, color: C.text, border: `1px solid ${C.pinkLight}` }}>{topRetard.prenom} {topRetard.nom.toUpperCase()}</span></>}
                  .
                  {(firstArrival || firstDeparture) && <><br />{lang === "fr" ? "Aujourd'hui : " : "Today: "}
                    {firstArrival && <><span style={{ background: C.white, padding: "2px 10px", borderRadius: 6, fontWeight: 600, color: C.text, border: `1px solid ${C.pinkLight}` }}>{firstArrival.prenom} {firstArrival.nom}</span> {lang === "fr" ? "commence" : "starts"}</>}
                    {firstArrival && firstDeparture && (lang === "fr" ? ", et " : ", and ")}
                    {firstDeparture && <><span style={{ background: C.white, padding: "2px 10px", borderRadius: 6, fontWeight: 600, color: C.text, border: `1px solid ${C.pinkLight}` }}>{firstDeparture.prenom} {firstDeparture.nom}</span> {lang === "fr" ? "termine son contrat" : "ends their contract"}</>}.</>}
                  {totalDocsManquants > 0 && <> <span style={{ background: C.white, padding: "2px 10px", borderRadius: 6, fontWeight: 600, color: C.text, border: `1px solid ${C.pinkLight}` }}>{totalDocsManquants} {lang === "fr" ? "documents" : "documents"}</span> {lang === "fr" ? `sont encore manquants chez ${collabsAvecDocsManquants} collaborateurs.` : `are still missing for ${collabsAvecDocsManquants} employees.`}</>}
                  {nbSansParcours > 0 && (
                    <><br /><span style={{ display: "inline-flex", alignItems: "center", gap: 4, color: "#C46500", fontWeight: 600 }}>
                      <AlertTriangle size={13} /> {lang === "fr" ? "Attention" : "Attention"}
                    </span> : <span style={{ background: C.white, padding: "2px 10px", borderRadius: 6, fontWeight: 600, color: C.text, border: `1px solid ${C.pinkLight}` }}>{nbSansParcours} {lang === "fr" ? (nbSansParcours > 1 ? "collaborateurs n'ont" : "collaborateur n'a") : (nbSansParcours > 1 ? "employees have" : "employee has")} {lang === "fr" ? "pas de parcours assigné" : "no journey assigned"}</span>
                    {collabsSansParcours.slice(0, 2).map((c: any, i: number) => (
                      <span key={c.id}> {i === 0 ? (lang === "fr" ? "(" : "(") : ", "}<span style={{ fontWeight: 600 }}>{c.prenom} {c.nom}</span>{i === Math.min(1, collabsSansParcours.length - 1) ? (collabsSansParcours.length > 2 ? `, +${collabsSansParcours.length - 2})` : ")") : ""}</span>
                    ))}.</>
                  )}
                </div>
                {/* CTA pills */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {topRetard && (
                    <button onClick={() => { ctx.setRelanceCollabId && ctx.setRelanceCollabId(topRetard.id); }} style={{ padding: "8px 16px", borderRadius: 999, background: C.pink, color: C.white, border: "none", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: font, display: "flex", alignItems: "center", gap: 6 }}>
                      <Send size={11} /> {lang === "fr" ? `Envoyer la relance à ${topRetard.prenom}` : `Nudge ${topRetard.prenom}`}
                    </button>
                  )}
                  {totalDocsManquants > 0 && (
                    <button onClick={() => { setAdminPage("admin_suivi"); ctx.setSuiviScope && ctx.setSuiviScope("actifs"); }} style={{ padding: "8px 16px", borderRadius: 999, background: C.white, color: C.text, border: `1px solid ${C.pinkLight}`, fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: font, display: "flex", alignItems: "center", gap: 6 }}>
                      <FileText size={11} color={C.pink} /> {lang === "fr" ? `Voir les ${totalDocsManquants} documents manquants` : `View ${totalDocsManquants} missing documents`}
                    </button>
                  )}
                  {nbSansParcours > 0 && (
                    <button onClick={() => { setAdminPage("admin_suivi"); ctx.setSuiviScope && ctx.setSuiviScope("actifs"); ctx.setSuiviFilter && ctx.setSuiviFilter("sans_parcours"); }} style={{ padding: "8px 16px", borderRadius: 999, background: C.white, color: "#C46500", border: `1px solid #FFD9A8`, fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: font, display: "flex", alignItems: "center", gap: 6 }}>
                      <AlertTriangle size={11} color="#C46500" /> {lang === "fr" ? `Assigner un parcours à ${nbSansParcours} collaborateur${nbSansParcours > 1 ? "s" : ""}` : `Assign a journey to ${nbSansParcours} employee${nbSansParcours > 1 ? "s" : ""}`}
                    </button>
                  )}
                  <button onClick={() => { setAdminPage("admin_assistant_ia" as any); }} style={{ padding: "8px 16px", borderRadius: 999, background: C.white, color: C.text, border: `1px solid ${C.pinkLight}`, fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: font, display: "flex", alignItems: "center", gap: 6 }}>
                    <MessageCircle size={11} color={C.pink} /> {lang === "fr" ? "Demander autre chose à l'IA" : "Ask the AI something else"}
                  </button>
                </div>
              </div>
            </div>
            {/* AI reply bubble — shown after a successful response */}
            {(ctx.aiBriefingReply || ctx.aiBriefingLoading) && (
              <div style={{ marginTop: 22, padding: "14px 18px", background: C.white, borderRadius: 12, border: `1px solid ${C.pinkLight}`, display: "flex", alignItems: "flex-start", gap: 12 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: C.pinkBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Sparkles size={14} color={C.pink} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  {ctx.aiBriefingLoading ? (
                    <div style={{ fontSize: 13, color: C.textMuted, fontStyle: "italic" }}>
                      {lang === "fr" ? "L'IA réfléchit…" : "AI is thinking…"}
                    </div>
                  ) : (
                    <div style={{ fontSize: 13, color: C.text, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{ctx.aiBriefingReply}</div>
                  )}
                </div>
                {!ctx.aiBriefingLoading && (
                  <button onClick={() => { ctx.setAiBriefingReply(""); ctx.setAiBriefingHistory([]); }} style={{ background: "none", border: "none", cursor: "pointer", color: C.textMuted, padding: 0, flexShrink: 0 }} title={lang === "fr" ? "Effacer" : "Clear"}>
                    <X size={14} />
                  </button>
                )}
              </div>
            )}
            {/* IA prompt input */}
            <div style={{ marginTop: 26, paddingTop: 18, borderTop: `1px solid ${C.pinkLight}`, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
              <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 10 }}>
                <Sparkles size={14} color={C.pink} style={{ flexShrink: 0 }} />
                <input
                  id="iz-ai-briefing-input"
                  type="text"
                  disabled={ctx.aiBriefingLoading}
                  placeholder={lang === "fr" ? "Demandez à l'IA : « combien de collaborateurs ont fini leur intégration ce trimestre ? »" : "Ask the AI: « how many employees finished onboarding this quarter? »"}
                  onKeyDown={e => {
                    if (e.key === "Enter" && !ctx.aiBriefingLoading) {
                      const v = (e.target as HTMLInputElement).value.trim();
                      if (!v) return;
                      const inputEl = e.target as HTMLInputElement;
                      const history = ctx.aiBriefingHistory || [];
                      ctx.setAiBriefingLoading(true);
                      ctx.setAiBriefingReply("");
                      import('../api/endpoints').then(m => m.postAdminAiChat(v, history)).then((res: any) => {
                        ctx.setAiBriefingReply(res.reply || (lang === "fr" ? "Aucune réponse." : "No reply."));
                        ctx.setAiBriefingHistory([...history, { role: "user", content: v }, { role: "assistant", content: res.reply || "" }]);
                        inputEl.value = "";
                      }).catch((err: any) => {
                        let msg = err?.message || (lang === "fr" ? "L'IA est indisponible (vérifiez votre plan IA Business)." : "AI is unavailable (check your AI Business plan).");
                        try { const parsed = JSON.parse(msg); if (parsed && typeof parsed === 'object' && parsed.reply) msg = parsed.reply; } catch {}
                        ctx.setAiBriefingReply(msg);
                        addToast_admin(msg, "error");
                      }).finally(() => ctx.setAiBriefingLoading(false));
                    }
                  }}
                  style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontSize: 13, fontStyle: "italic", color: C.text, fontFamily: font, opacity: ctx.aiBriefingLoading ? 0.5 : 1 }}
                />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 11, color: C.textMuted }}>{lang === "fr" ? "Entrée ↵" : "Enter ↵"}</span>
                <button disabled={ctx.aiBriefingLoading} onClick={() => {
                  const inp = document.getElementById('iz-ai-briefing-input') as HTMLInputElement | null;
                  const v = inp?.value.trim();
                  if (!v) { inp?.focus(); return; }
                  const history = ctx.aiBriefingHistory || [];
                  ctx.setAiBriefingLoading(true);
                  ctx.setAiBriefingReply("");
                  import('../api/endpoints').then(m => m.postAdminAiChat(v, history)).then((res: any) => {
                    ctx.setAiBriefingReply(res.reply || (lang === "fr" ? "Aucune réponse." : "No reply."));
                    ctx.setAiBriefingHistory([...history, { role: "user", content: v }, { role: "assistant", content: res.reply || "" }]);
                    if (inp) inp.value = "";
                  }).catch((err: any) => {
                    const msg = err?.message || (lang === "fr" ? "L'IA est indisponible (vérifiez votre plan IA Business)." : "AI is unavailable (check your AI Business plan).");
                    ctx.setAiBriefingReply(msg);
                    addToast_admin(msg, "error");
                  }).finally(() => ctx.setAiBriefingLoading(false));
                }} style={{ padding: "8px 18px", borderRadius: 999, background: ctx.aiBriefingLoading ? C.textMuted : C.pink, color: C.white, border: "none", fontSize: 12, fontFamily: font, fontWeight: 600, cursor: ctx.aiBriefingLoading ? "wait" : "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                  <Send size={12} /> {ctx.aiBriefingLoading ? (lang === "fr" ? "Envoi…" : "Sending…") : (lang === "fr" ? "Envoyer" : "Send")}
                </button>
              </div>
            </div>
          </div>

          {/* ── Stats horizontales ── */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 0, background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: "20px 8px", marginBottom: 28 }}>
            {statsLine.map((s, i) => (
              <div key={i} style={{ textAlign: "center", borderRight: i < statsLine.length - 1 ? `1px solid ${C.border}` : "none" }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: C.textMuted, letterSpacing: 1.3, textTransform: "uppercase", marginBottom: 8 }}>{s.label}</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: s.color, lineHeight: 1 }}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* ── Grid: Collaborateurs + Aujourd'hui/Actions ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 16, marginBottom: 28 }}>
            {/* Collaborateurs en parcours */}
            <div style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.border}`, padding: "22px 24px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: C.text }}>{lang === "fr" ? "Collaborateurs en parcours" : "Employees on a journey"}</h3>
                <button onClick={() => setAdminPage("admin_suivi")} style={{ background: "none", border: `1px solid ${C.border}`, fontSize: 11, padding: "5px 14px", borderRadius: 999, cursor: "pointer", fontFamily: font, color: C.text, fontWeight: 500 }}>{lang === "fr" ? "Voir tous" : "See all"}</button>
              </div>
              <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 18 }}>{recentCollabs.length} {lang === "fr" ? "sur l'ensemble" : "of total"}</div>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1.1fr 0.6fr 1.4fr 0.9fr", gap: 12, padding: "10px 0", borderBottom: `1px solid ${C.border}`, fontSize: 10, fontWeight: 700, color: C.textMuted, letterSpacing: 1, textTransform: "uppercase" }}>
                <span>{lang === "fr" ? "Collaborateur" : "Employee"}</span>
                <span>{lang === "fr" ? "Site" : "Site"}</span>
                <span>{lang === "fr" ? "Jour" : "Day"}</span>
                <span>{lang === "fr" ? "Progression" : "Progress"}</span>
                <span>{lang === "fr" ? "Statut" : "Status"}</span>
              </div>
              {recentCollabs.map(c => {
                const dStart = parseFrDate(c.dateDebut);
                const dayJ = dStart ? Math.round((today0.getTime() - dStart.getTime()) / 86400000) : 0;
                const dayLabel = dayJ >= 0 ? `J+${dayJ}` : `J${dayJ}`;
                return (
                  <div key={c.id} onClick={() => { setAdminPage("admin_suivi"); setCollabProfileId(c.id); }}
                    style={{ display: "grid", gridTemplateColumns: "2fr 1.1fr 0.6fr 1.4fr 0.9fr", gap: 12, padding: "12px 0", borderBottom: `1px solid ${C.border}`, cursor: "pointer", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      {(() => {
                        const av = (c as any).avatar_url || (c as any).avatar || (c as any).photo_url || (c as any).photo || ((c as any).user_id ? ((ctx.allCompanySettings || {})[`avatar_${(c as any).user_id}`] || null) : null);
                        return (
                          <div style={{ width: 32, height: 32, borderRadius: "50%", background: av ? "transparent" : c.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, color: C.white, flexShrink: 0, overflow: "hidden" }}>
                            {av ? <img src={av} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : c.initials}
                          </div>
                        );
                      })()}
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 500, color: C.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.prenom} {c.nom}</div>
                        <div style={{ fontSize: 10, color: C.textMuted }}>{c.poste}</div>
                      </div>
                    </div>
                    <div style={{ fontSize: 12, color: C.textLight }}>{c.site}</div>
                    <div style={{ fontSize: 12, color: C.textLight, fontWeight: 500 }}>{dayLabel}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ flex: 1, height: 6, background: C.bg, borderRadius: 3, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${c.progression}%`, background: c.status === "termine" ? C.green : c.status === "en_retard" ? C.red : C.pink, borderRadius: 3 }} />
                      </div>
                      <span style={{ fontSize: 10, fontWeight: 600, color: C.textMuted, minWidth: 32, textAlign: "right" }}>{c.progression}%</span>
                    </div>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 500, justifySelf: "start", color: c.status === "termine" ? C.green : c.status === "en_retard" ? C.red : C.pink, background: c.status === "termine" ? C.greenLight : c.status === "en_retard" ? C.redLight : C.pinkBg }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: c.status === "termine" ? C.green : c.status === "en_retard" ? C.red : C.pink }} />
                      {c.status === "termine" ? (lang === "fr" ? "Terminé" : "Completed") : c.status === "en_retard" ? (lang === "fr" ? "En retard" : "Late") : (lang === "fr" ? "En cours" : "In progress")}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Sidebar: Aujourd'hui + Actions à venir */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.border}`, padding: "20px 22px" }}>
                <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: C.text }}>{lang === "fr" ? "Aujourd'hui" : "Today"}</h3>
                <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 14 }}>{todayEvents.length} {lang === "fr" ? "événements" : "events"}</div>
                {todayEvents.length === 0 ? (
                  <div style={{ fontSize: 12, color: C.textMuted, padding: "8px 0" }}>{lang === "fr" ? "Rien de prévu aujourd'hui." : "Nothing scheduled today."}</div>
                ) : todayEvents.map((e: any, i: number) => {
                  const av = e.avatarUrl || (e.userId ? ((ctx.allCompanySettings || {})[`avatar_${e.userId}`] || null) : null);
                  return (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i < todayEvents.length - 1 ? `1px solid ${C.border}` : "none" }}>
                      <div style={{ width: 32, height: 32, borderRadius: "50%", background: av ? "transparent" : e.color, color: C.white, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, flexShrink: 0, overflow: "hidden" }}>
                        {av ? <img src={av} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : e.initials}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 500, color: C.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{e.name}</div>
                        <div style={{ fontSize: 11, color: C.textMuted }}>{e.sub}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.border}`, padding: "20px 22px" }}>
                <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: C.text }}>{lang === "fr" ? "Actions à venir" : "Upcoming actions"}</h3>
                <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 14 }}>{upcomingActions.length} {lang === "fr" ? "cette semaine" : "this week"}</div>
                {upcomingActions.map((a, i) => (
                  <div key={a.id} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "8px 0", borderBottom: i < upcomingActions.length - 1 ? `1px solid ${C.border}` : "none" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: C.pink, minWidth: 36, padding: "3px 0", textAlign: "center", background: C.pinkBg, borderRadius: 6 }}>{a.delaiRelatif}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 500, color: C.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{a.titre}</div>
                      <div style={{ fontSize: 11, color: C.textMuted }}>{a.parcours}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Setup wizard banner (preserved) ── */}
          {setupCompleted.length < SETUP_STEPS.length && (() => {
            const totalReq = SETUP_STEPS.filter(s => s.required).length;
            const doneReq = SETUP_STEPS.filter(s => s.required && setupCompleted.includes(s.id)).length;
            const pct = Math.round((setupCompleted.length / SETUP_STEPS.length) * 100);
            return (
              <div className="iz-card" style={{ background: C.white, padding: 0, overflow: "hidden", marginBottom: 28, borderRadius: 14, border: `1px solid ${C.border}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "16px 22px" }}>
                  <div style={{ width: 42, height: 42, borderRadius: 10, background: C.pinkBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Zap size={20} color={C.pink} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 4 }}>{lang === "fr" ? "Votre espace n'est pas encore configuré" : "Your space is not yet configured"}</div>
                    <div style={{ fontSize: 12, color: C.textMuted }}>{lang === "fr" ? `${SETUP_STEPS.length} étapes guidées en 8 minutes.` : `${SETUP_STEPS.length} guided steps in 8 minutes.`} · {doneReq}/{totalReq} {t('wiz.required_steps')} · {pct}%</div>
                  </div>
                  <button onClick={() => { setShowSetupWizard(true); setSetupStep(SETUP_STEPS.findIndex(s => !setupCompleted.includes(s.id)) || 0); }} style={{ padding: "9px 18px", borderRadius: 999, background: C.pink, color: C.white, border: "none", fontSize: 12, fontFamily: font, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                    <Sparkles size={13} /> {lang === "fr" ? "Configurer mon espace" : "Configure my space"}
                  </button>
                </div>
              </div>
            );
          })()}

          {/* ── Footer: Parcours actifs + Planning 8 semaines ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: 16, marginBottom: 28 }}>
            <div style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.border}`, padding: "20px 22px" }}>
              <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: C.text }}>{lang === "fr" ? "Parcours actifs" : "Active journeys"}</h3>
              <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 16 }}>{PARCOURS_TEMPLATES.length} {lang === "fr" ? "templates" : "templates"}</div>
              {PARCOURS_TEMPLATES.map(p => {
                const realCount = COLLABORATEURS.filter((c: any) => c.parcours_id === p.id && c.status !== "termine").length;
                const cat = (p as any).categorie || "onboarding";
                const colorMap: Record<string, string> = { onboarding: C.pink, offboarding: "#E53935", reboarding: "#7B5EA7", crossboarding: C.blue };
                const accent = colorMap[cat] || C.pink;
                return (
                  <div key={p.id} onClick={() => { setSuiviParcoursFilter(p.nom); setSuiviScope("actifs"); setAdminPage("admin_suivi"); }} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: `1px solid ${C.border}`, cursor: "pointer" }}>
                    <div style={{ width: 3, height: 30, background: accent, borderRadius: 2, flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: C.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.nom}</div>
                      <div style={{ fontSize: 11, color: C.textMuted }}>{p.actionsCount} actions · {p.docsCount} docs</div>
                    </div>
                    <span style={{ fontSize: 18, fontWeight: 700, color: realCount > 0 ? accent : C.textMuted }}>{realCount}</span>
                  </div>
                );
              })}
              {PARCOURS_TEMPLATES.length === 0 && <div style={{ padding: 20, textAlign: "center", color: C.textMuted, fontSize: 12 }}>{lang === "fr" ? "Aucun parcours" : "No journey"}</div>}
            </div>

            <div style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.border}`, padding: "20px 22px" }}>
              <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: C.text }}>{lang === "fr" ? "Planning · 8 semaines" : "Planning · 8 weeks"}</h3>
              <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 18 }}>{lang === "fr" ? "Arrivées & départs" : "Arrivals & departures"}</div>
              <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 12, height: 160, padding: "0 4px" }}>
                {weeks.map((w, i) => {
                  const arrH = (w.arrivals / maxWeek) * 130;
                  const depH = (w.departures / maxWeek) * 130;
                  return (
                    <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                      <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 130, width: "100%", justifyContent: "center" }}>
                        {w.arrivals > 0 && <div title={`${w.arrivals} arrivée(s)`} style={{ width: 14, height: arrH, background: C.pink, borderRadius: "3px 3px 0 0", transition: "height .4s ease" }} />}
                        {w.departures > 0 && <div title={`${w.departures} départ(s)`} style={{ width: 14, height: depH, background: "#C9A961", borderRadius: "3px 3px 0 0", transition: "height .4s ease" }} />}
                        {w.arrivals === 0 && w.departures === 0 && <div style={{ width: 14, height: 2, background: C.border, borderRadius: 1 }} />}
                      </div>
                      <div style={{ fontSize: 11, color: i === 2 ? C.pink : C.textMuted, fontWeight: i === 2 ? 700 : 400 }}>{w.label}</div>
                    </div>
                  );
                })}
              </div>
              <div style={{ display: "flex", gap: 16, marginTop: 14, fontSize: 11, color: C.textLight }}>
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ width: 10, height: 10, background: C.pink, borderRadius: 2 }} /> {lang === "fr" ? "Arrivées" : "Arrivals"}</span>
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ width: 10, height: 10, background: "#C9A961", borderRadius: 2 }} /> {lang === "fr" ? "Départs" : "Departures"}</span>
              </div>
            </div>
          </div>

        </div>
      );
    };

  
    // ─── SUIVI COLLABORATEURS ─────────────────────────────────

    const renderSuivi = () => {
      // Resolve parcours filter name → id
      const filterParcoursId = suiviParcoursFilter
        ? PARCOURS_TEMPLATES.find(p => p.nom === suiviParcoursFilter)?.id ?? null
        : null;

      const siteFilter = suiviSiteFilter || '';
      const deptFilter = suiviDeptFilter || '';
      const scope: "actifs" | "tous" = suiviScope;
      const setScope = setSuiviScope;

      const totalAll = COLLABORATEURS.length;
      const totalActifs = COLLABORATEURS.filter(c => c.status !== "termine").length;
      const cohortActifs = COLLABORATEURS.filter(c => c.status !== "termine");
      const rails = cohortActifs.filter(c => c.status === "en_cours" && c.progression >= 30).length;
      const attention = cohortActifs.filter(c => c.status === "en_cours" && c.progression < 30).length;
      const enRetard = cohortActifs.filter(c => c.status === "en_retard").length;
      const firstAttention = cohortActifs.find(c => c.status === "en_cours" && c.progression < 30);
      const firstRetard = cohortActifs.find(c => c.status === "en_retard");
      const shortName = (n: string) => { const p = n.split(" "); return p[0] + (p[1] ? " " + p[1][0] + "." : ""); };

      const filtered = COLLABORATEURS
        .filter(c => scope === "tous" ? true : c.status !== "termine")
        .filter(c => suiviFilter === "all" || c.status === suiviFilter)
        .filter(c => !suiviSearch || `${c.prenom} ${c.nom} ${c.email || ""} ${c.poste}`.toLowerCase().includes(suiviSearch.toLowerCase()))
        .filter(c => !filterParcoursId || (c as any).parcours_id === filterParcoursId)
        .filter(c => !siteFilter || c.site === siteFilter)
        .filter(c => !deptFilter || c.departement === deptFilter);

      const uniqueSites = [...new Set(COLLABORATEURS.map(c => c.site).filter(Boolean))].sort();
      const uniqueDepts = [...new Set(COLLABORATEURS.map(c => c.departement).filter(Boolean))].sort();
      const activeFilterCount = [siteFilter, deptFilter, suiviParcoursFilter].filter(Boolean).length;
      return (
      <div style={{ flex: 1, padding: "24px 32px", overflow: "auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 600, margin: 0 }}>{t('collab.tracking_title')}</h1>
            <div style={{ fontSize: 12, color: C.textMuted, marginTop: 4 }}>
              {scope === "actifs" ? `${totalActifs} arrivant${totalActifs > 1 ? "s" : ""} en cours d'intégration` : `${totalAll} collaborateur${totalAll > 1 ? "s" : ""} (incluant terminés)`}
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => { setCollabPanelData({ prenom: "", nom: "", email: "", poste: "", site: "", departement: "", dateDebut: "" }); setCollabPanelMode("create"); }} className="iz-btn-pink" style={{ ...sBtn("pink"), display: "flex", alignItems: "center", gap: 6 }}><UserPlus size={16} /> {t('collab.new')}</button>
          </div>
        </div>

        {/* Scope toggle: Actifs / Tous */}
        <div style={{ display: "flex", gap: 4, padding: 4, background: C.bg, borderRadius: 10, marginBottom: 16, width: "fit-content" }}>
          {([
            { id: "actifs", label: `Actifs (${totalActifs})` },
            { id: "tous", label: `Tous (${totalAll})` },
          ] as const).map(s => (
            <button key={s.id} onClick={() => setScope(s.id)} style={{
              padding: "8px 18px", borderRadius: 6, fontSize: 13, fontWeight: scope === s.id ? 600 : 400,
              border: "none", cursor: "pointer", fontFamily: font,
              background: scope === s.id ? C.white : "transparent",
              color: scope === s.id ? C.pink : C.textMuted,
              boxShadow: scope === s.id ? "0 1px 3px rgba(0,0,0,.06)" : "none",
              transition: "all .15s",
            }}>{s.label}</button>
          ))}
        </div>

        {/* KPI cards — only on Actifs scope */}
        {scope === "actifs" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, marginBottom: 20 }}>
            {[
              { label: "EFFECTIF EN COURS", value: totalActifs, sub: `${totalActifs} actif${totalActifs > 1 ? "s" : ""}`, color: C.text },
              { label: "SUR LES RAILS", value: rails, sub: totalActifs > 0 ? `${Math.round(rails / totalActifs * 100)}%` : "0%", color: C.green },
              { label: "À SURVEILLER", value: attention, sub: firstAttention ? shortName(`${firstAttention.prenom} ${firstAttention.nom}`) : "—", color: C.amber },
              { label: "EN RETARD", value: enRetard, sub: firstRetard ? shortName(`${firstRetard.prenom} ${firstRetard.nom}`) : "—", color: C.red },
              { label: "SCORE eNPS", value: "+47", sub: "Excellent", color: C.pink },
            ].map(k => (
              <div key={k.label} className="iz-card" style={{ ...sCard, padding: "14px 16px" }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: C.textMuted, letterSpacing: 1 }}>{k.label}</div>
                <div style={{ fontSize: 26, fontWeight: 700, color: k.color, marginTop: 4 }}>{k.value}</div>
                <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>{k.sub}</div>
              </div>
            ))}
          </div>
        )}

        {/* Active filters badge removed — now using dropdown selects above */}

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

        {/* Advanced filters */}
        <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap", alignItems: "center" }}>
          <SearchableSelect
            value={siteFilter}
            onChange={v => setSuiviSiteFilter(v)}
            options={uniqueSites.map(s => ({ value: s, label: s }))}
            allLabel="Tous les sites"
          />
          <SearchableSelect
            value={deptFilter}
            onChange={v => setSuiviDeptFilter(v)}
            options={uniqueDepts.map(d => ({ value: d, label: d }))}
            allLabel="Tous les départements"
          />
          <SearchableSelect
            value={suiviParcoursFilter || ''}
            onChange={v => setSuiviParcoursFilter(v || null)}
            options={PARCOURS_TEMPLATES.map((p: any) => ({ value: p.nom, label: p.nom }))}
            allLabel="Tous les parcours"
          />
          {activeFilterCount > 0 && (
            <button onClick={() => { setSuiviSiteFilter(''); setSuiviDeptFilter(''); setSuiviParcoursFilter(null); }}
              style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, color: C.pink, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
              <X size={12} /> Effacer les filtres ({activeFilterCount})
            </button>
          )}
          <span style={{ marginLeft: "auto", fontSize: 11, color: C.textMuted }}>{filtered.length} / {COLLABORATEURS.length} collaborateurs</span>
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
              {(() => {
                const avatarUrl = (c as any).avatar_url || (c as any).avatar || (c as any).photo_url || (c as any).photo || (c.user_id ? ((ctx.allCompanySettings || {})[`avatar_${c.user_id}`] || null) : null);
                return (
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: avatarUrl ? "transparent" : c.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600, color: C.white, flexShrink: 0, position: "relative", overflow: "hidden" }}>
                    {avatarUrl ? <img src={avatarUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : c.initials}
                    <div style={{ position: "absolute", bottom: -1, right: -1, width: 10, height: 10, borderRadius: "50%", background: c.status === "termine" ? C.green : c.status === "en_retard" ? C.red : C.blue, border: `2px solid ${C.white}` }} />
                  </div>
                );
              })()}
              <div>
                <div style={{ fontSize: 14, fontWeight: 500, color: C.text, display: "flex", alignItems: "center", gap: 6 }}>
                  {c.prenom} {c.nom}
                  {!(c as any).parcours_id && (
                    <span title="Aucun parcours assigné — ce collaborateur ne voit aucune action" style={{ display: "inline-flex", alignItems: "center", gap: 3, padding: "2px 7px", borderRadius: 10, fontSize: 10, fontWeight: 600, background: C.amberLight, color: C.amber, lineHeight: 1 }}>
                      <AlertTriangle size={10} /> Sans parcours
                    </span>
                  )}
                </div>
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
                    { icon: <Eye size={14} />, label: t('common.edit'), action: () => { setCollabPanelData({ ...c, email: c.email || "" }); setCollabPanelMode("edit"); } },
                    { icon: <Route size={14} />, label: t('menu.assign_journey'), action: () => { setCollabPanelData({ ...c, email: c.email || "" }); setCollabPanelMode("edit"); } },
                    { icon: <Users size={14} />, label: t('menu.assign_team'), action: () => { setCollabPanelData({ ...c, email: c.email || "" }); setCollabPanelMode("edit"); } },
                    { icon: <FileSignature size={14} />, label: t('menu.send_contract'), action: () => { setCollabPanelData({ ...c, email: c.email || "" }); setCollabPanelMode("edit"); } },
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

    // ─── OCR Identity Scanner ─────────────────────────────────
    const { ocrModal, setOcrModal, ocrFile, setOcrFile, ocrPreview, setOcrPreview, ocrLoading, setOcrLoading, ocrResult, setOcrResult, ocrError, setOcrError } = ctx;

    const [ocrWarning, setOcrWarning] = ctx.ocrWarning !== undefined ? [ctx.ocrWarning, ctx.setOcrWarning] : [null, () => {}];
    const [ocrUsage, setOcrUsage] = ctx.ocrUsage !== undefined ? [ctx.ocrUsage, ctx.setOcrUsage] : [null, () => {}];

    const handleOcrScan = async () => {
      if (!ocrFile) return;
      setOcrLoading(true);
      setOcrError(null);
      try {
        const res = await ocrExtractIdentity(ocrFile);
        setOcrResult(res.data);
        if (res.usage) setOcrUsage(res.usage);
        if (res.warning) setOcrWarning(res.warning);
      } catch (e: any) {
        const msg = e.message || "Erreur lors de l'extraction";
        // Check if it's a quota error with upgrade info
        if (msg.includes("Quota") || msg.includes("quota") || msg.includes("plan IA")) {
          setOcrError(msg);
        } else {
          setOcrError(msg);
        }
      } finally {
        setOcrLoading(false);
      }
    };

    const handleOcrApply = async () => {
      if (!ocrResult || !ocrModal) return;
      const updates: Record<string, any> = {};
      if (ocrResult.first_name) updates.prenom = ocrResult.first_name;
      if (ocrResult.last_name) updates.nom = ocrResult.last_name;
      if (ocrResult.birth_date) updates.date_naissance = ocrResult.birth_date;
      if (ocrResult.nationality) updates.nationalite = ocrResult.nationality;
      if (ocrResult.gender) updates.civilite = ocrResult.gender === 'M' ? 'M.' : 'Mme';
      if (ocrResult.avs_number) updates.numero_avs = ocrResult.avs_number;
      if (ocrResult.address) updates.adresse = ocrResult.address;
      try {
        await apiUpdateCollab(ocrModal.collabId, updates);
        refetchCollaborateurs();
        addToast_admin("Fiche collaborateur mise à jour avec les données extraites");
        setOcrModal(null); setOcrFile(null); setOcrPreview(null); setOcrResult(null);
      } catch { addToast_admin("Erreur lors de la mise à jour"); }
    };

    const renderOcrModal = () => {
      if (!ocrModal) return null;
      const OCR_FIELDS: { key: keyof OcrIdentityResult; label: string; collabField?: string }[] = [
        { key: "document_type", label: "Type de document" },
        { key: "document_number", label: "N° du document" },
        { key: "last_name", label: "Nom", collabField: "nom" },
        { key: "first_name", label: "Prénom", collabField: "prenom" },
        { key: "birth_date", label: "Date de naissance", collabField: "date_naissance" },
        { key: "birth_place", label: "Lieu de naissance" },
        { key: "nationality", label: "Nationalité", collabField: "nationalite" },
        { key: "gender", label: "Genre", collabField: "civilite" },
        { key: "avs_number", label: "N° AVS", collabField: "numero_avs" },
        { key: "address", label: "Adresse", collabField: "adresse" },
        { key: "expiry_date", label: "Date d'expiration" },
        { key: "issue_date", label: "Date de délivrance" },
        { key: "issuing_country", label: "Pays de délivrance" },
      ];
      return (
        <>
          <div onClick={() => { setOcrModal(null); setOcrFile(null); setOcrPreview(null); setOcrResult(null); setOcrError(null); }} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.4)", zIndex: 1200, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div className="iz-modal iz-scale-in" onClick={e => e.stopPropagation()} style={{ background: C.white, borderRadius: 16, width: 700, maxHeight: "85vh", overflow: "auto", zIndex: 1201 }}>
            <div style={{ padding: "20px 24px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <h2 style={{ fontSize: 17, fontWeight: 600, margin: 0, display: "flex", alignItems: "center", gap: 8 }}><Eye size={18} color={C.blue} /> Scanner une pièce d'identité</h2>
                <p style={{ fontSize: 12, color: C.textMuted, margin: "2px 0 0" }}>{ocrModal.collab.prenom} {ocrModal.collab.nom}</p>
              </div>
              <button onClick={() => { setOcrModal(null); setOcrFile(null); setOcrPreview(null); setOcrResult(null); setOcrError(null); }} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={20} color={C.textLight} /></button>
            </div>
            <div style={{ padding: "20px 24px" }}>
              {/* Upload zone */}
              {!ocrResult && (
                <div style={{ marginBottom: 20 }}>
                  <div
                    onDragOver={e => { e.preventDefault(); e.currentTarget.style.borderColor = C.pink; }}
                    onDragLeave={e => { e.currentTarget.style.borderColor = C.border; }}
                    onDrop={e => { e.preventDefault(); e.currentTarget.style.borderColor = C.border; const f = e.dataTransfer.files[0]; if (f) { setOcrFile(f); setOcrPreview(URL.createObjectURL(f)); } }}
                    onClick={() => { const inp = document.createElement('input'); inp.type = 'file'; inp.accept = 'image/*,.pdf'; inp.onchange = (ev: any) => { const f = ev.target.files[0]; if (f) { setOcrFile(f); setOcrPreview(URL.createObjectURL(f)); } }; inp.click(); }}
                    style={{ border: `2px dashed ${ocrFile ? C.green : C.border}`, borderRadius: 12, padding: ocrPreview ? 0 : "40px 20px", textAlign: "center", cursor: "pointer", transition: "all .2s", background: ocrFile ? C.greenLight + "20" : C.bg, overflow: "hidden" }}>
                    {ocrPreview && ocrFile ? (
                      ocrFile.type === "application/pdf" ? (
                        <div style={{ padding: "30px 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                          <FileText size={40} color={C.pink} />
                          <div style={{ fontSize: 14, fontWeight: 500, color: C.text }}>{ocrFile.name}</div>
                          <div style={{ fontSize: 12, color: C.textMuted }}>{(ocrFile.size / 1024).toFixed(0)} KB — PDF</div>
                        </div>
                      ) : (
                        <img src={ocrPreview} alt="Document" style={{ maxWidth: "100%", maxHeight: 300, display: "block", margin: "0 auto" }} />
                      )
                    ) : (
                      <>
                        <Upload size={32} color={C.textMuted} style={{ marginBottom: 8 }} />
                        <div style={{ fontSize: 14, fontWeight: 500, color: C.text }}>Déposez une photo ou un scan</div>
                        <div style={{ fontSize: 12, color: C.textMuted, marginTop: 4 }}>Passeport, carte d'identité, permis de séjour — JPG, PNG ou PDF</div>
                      </>
                    )}
                  </div>
                  {ocrFile && (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12 }}>
                      <span style={{ fontSize: 12, color: C.textMuted }}>{ocrFile.name} ({(ocrFile.size / 1024).toFixed(0)} KB)</span>
                      <button onClick={handleOcrScan} disabled={ocrLoading} className="iz-btn-pink" style={{ ...sBtn("pink"), padding: "10px 24px", fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}>
                        {ocrLoading ? <><Timer size={14} /> Analyse en cours...</> : <><Sparkles size={14} /> Extraire les informations</>}
                      </button>
                    </div>
                  )}
                  {ocrError && <div style={{ marginTop: 12, padding: "10px 14px", background: C.redLight, borderRadius: 8, fontSize: 12, color: C.red }}>{ocrError}</div>}
                </div>
              )}

              {/* Results */}
              {ocrResult && (
                <>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                    <CheckCircle size={18} color={C.green} />
                    <span style={{ fontSize: 14, fontWeight: 600, color: C.green }}>Extraction réussie</span>
                    <span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 600,
                      background: ocrResult.confidence === "high" ? C.greenLight : ocrResult.confidence === "medium" ? "#FFF3E0" : C.redLight,
                      color: ocrResult.confidence === "high" ? C.green : ocrResult.confidence === "medium" ? "#E65100" : C.red,
                    }}>Confiance : {ocrResult.confidence === "high" ? "Haute" : ocrResult.confidence === "medium" ? "Moyenne" : "Faible"}</span>
                  </div>

                  <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 8, fontStyle: "italic" }}>Vous pouvez modifier les valeurs avant de les appliquer.</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px", background: C.border, borderRadius: 10, overflow: "hidden", marginBottom: 20 }}>
                    {OCR_FIELDS.map(f => {
                      const val = ocrResult[f.key] || "";
                      return (
                        <div key={f.key} style={{ padding: "10px 14px", background: C.white }}>
                          <div style={{ fontSize: 10, fontWeight: 600, color: C.textMuted, textTransform: "uppercase", marginBottom: 4, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            {f.label}
                            {f.collabField && val && <span style={{ fontSize: 9, color: C.blue, fontStyle: "normal" }}>→ {f.collabField}</span>}
                          </div>
                          <input
                            value={val}
                            onChange={e => setOcrResult((prev: any) => prev ? { ...prev, [f.key]: e.target.value } : prev)}
                            placeholder="—"
                            style={{ width: "100%", border: `1px solid ${C.border}`, borderRadius: 6, padding: "5px 8px", fontSize: 13, fontWeight: 500, color: C.text, fontFamily: font, outline: "none", background: f.collabField ? C.blueLight + "30" : "transparent" }}
                          />
                        </div>
                      );
                    })}
                  </div>

                  {/* Usage + warning */}
                  {ocrUsage && (
                    <div style={{ padding: "8px 12px", background: C.bg, borderRadius: 8, fontSize: 11, color: C.textMuted, marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span>Scans OCR ce mois : <b>{ocrUsage.used}/{ocrUsage.limit}</b></span>
                      <div style={{ width: 100, height: 6, background: C.border, borderRadius: 3, overflow: "hidden" }}>
                        <div style={{ height: "100%", borderRadius: 3, width: `${Math.min(100, ocrUsage.percent)}%`, background: ocrUsage.percent >= 90 ? C.red : ocrUsage.percent >= 70 ? "#FF9800" : C.green, transition: "width .3s" }} />
                      </div>
                    </div>
                  )}
                  {ocrWarning && (
                    <div style={{ padding: "10px 14px", background: "#FFF3E0", borderRadius: 8, fontSize: 12, color: "#E65100", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                      <AlertTriangle size={16} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600 }}>Quota bientôt atteint — {ocrWarning.remaining} scans restants</div>
                        <div style={{ fontSize: 11, marginTop: 2 }}>Passez au plan supérieur ou achetez des crédits supplémentaires.</div>
                      </div>
                      <button onClick={() => { setAdminPage("admin_abonnement" as any); setOcrModal(null); }} style={{ ...sBtn("outline"), fontSize: 10, padding: "4px 10px", whiteSpace: "nowrap", borderColor: "#E65100", color: "#E65100" }}>Upgrader</button>
                    </div>
                  )}

                  <div style={{ display: "flex", gap: 10 }}>
                    <button onClick={() => { setOcrResult(null); setOcrFile(null); setOcrPreview(null); setOcrWarning(null); setOcrUsage(null); }} className="iz-btn-outline" style={{ ...sBtn("outline"), flex: 1, fontSize: 13 }}>Rescanner</button>
                    <button onClick={handleOcrApply} className="iz-btn-pink" style={{ ...sBtn("pink"), flex: 2, fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}><CheckCircle size={14} /> Appliquer à la fiche collaborateur</button>
                  </div>
                </>
              )}
            </div>
          </div>
          </div>
        </>
      );
    };

    const renderCollabProfile = () => {
      const collab = COLLABORATEURS.find(c => c.id === collabProfileId);
      if (!collab) return null;
      // Load real documents for this collaborateur
      if (collabProfileId && realDocs.filter(d => d.collaborateur_id === collabProfileId).length === 0) {
        getDocuments({ collaborateur_id: collabProfileId }).then(docs => setRealDocs(prev => [...prev.filter(d => d.collaborateur_id !== collabProfileId), ...docs])).catch(() => {});
      }
      const collabParcours = PARCOURS_TEMPLATES.find(p => p.id === (collab as any).parcours_id) || null;
      const collabActions = collabParcours
        ? ACTION_TEMPLATES.filter(a => a.parcours === collabParcours.nom)
        : ACTION_TEMPLATES.filter(a => a.parcours === "Onboarding Standard");
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
              <button onClick={() => { setCollabPanelData({ ...collab, email: collab.email || "" }); setCollabPanelMode("edit"); }} style={{ ...sBtn("pink"), padding: "8px 20px", fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}><FilePen size={14} /> Modifier</button>
              {/* Relancer (manual reminder email) */}
              <button onClick={() => setRelanceCollabId(collab.id)} style={{ ...sBtn("outline"), padding: "8px 20px", fontSize: 13, display: "flex", alignItems: "center", gap: 6, borderColor: C.pink, color: C.pink }}>
                <Send size={14} /> Relancer
              </button>
              {/* Générer un contrat */}
              <button onClick={() => {
                const contrats = ctx.contrats || [];
                const activeContrats = contrats.filter((c: any) => c.actif);
                if (activeContrats.length === 0) {
                  addToast_admin("Aucun modèle de contrat actif. Créez-en un dans Contrats & Documents.");
                  return;
                }
                // Smart pre-selection: score each contract by matching type_contrat + juridiction (country derived from site)
                const collabType = (collab.type_contrat || "").toLowerCase().trim();
                const collabSite = (collab.site || "").toLowerCase();
                const inferCountry = (site: string) => {
                  if (/suisse|switzerland|gen[èe]ve|lausanne|z[uü]rich|bern|basel|nyon/.test(site)) return "suisse";
                  if (/france|paris|lyon|marseille|toulouse|nice|nantes|bordeaux/.test(site)) return "france";
                  if (/belg|bruxelles|brussels|anvers|li[èe]ge/.test(site)) return "belgique";
                  if (/luxemb/.test(site)) return "luxembourg";
                  return "";
                };
                const collabCountry = inferCountry(collabSite);
                const scored = activeContrats.map((c: any) => {
                  let score = 0;
                  const cType = (c.type || "").toLowerCase().trim();
                  const cJur = (c.juridiction || "").toLowerCase();
                  if (collabType && cType && cType === collabType) score += 10;
                  if (collabCountry && cJur.includes(collabCountry)) score += 5;
                  return { c, score };
                }).sort((a: any, b: any) => b.score - a.score);
                ctx.setGenerateContrat(scored[0].c);
                ctx.setGenerateCollabId(collab.id);
              }} style={{ ...sBtn("outline"), padding: "8px 20px", fontSize: 13, display: "flex", alignItems: "center", gap: 6, borderColor: C.green, color: C.green }}>
                <FileSignature size={14} /> Générer un contrat
              </button>
              {/* Scanner OCR */}
              {(() => {
                const hasAiPlan = tenantSubscriptions.some((s: any) => (s.status === "active" || s.status === "trialing") && s.plan?.addon_type === "ai");
                return hasAiPlan ? (
                  <button onClick={() => setOcrModal({ collabId: collab.id, collab })} style={{ ...sBtn("outline"), padding: "8px 20px", fontSize: 13, display: "flex", alignItems: "center", gap: 6, borderColor: C.blue, color: C.blue }}><Eye size={14} /> Scanner pièce d'identité</button>
                ) : (
                  <button onClick={() => { setAdminPage("admin_abonnement" as any); setSubView("change"); addToast_admin("Souscrivez un add-on IA pour utiliser le scanner de pièce d'identité."); }} title="Nécessite un add-on IA" style={{ ...sBtn("outline"), padding: "8px 20px", fontSize: 13, display: "flex", alignItems: "center", gap: 6, borderColor: C.border, color: C.textMuted, opacity: 0.6 }}><Eye size={14} /> Scanner pièce d'identité</button>
                );
              })()}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              {(() => {
                const av = (collab as any).avatar_url || (collab as any).avatar || (collab as any).photo_url || (collab as any).photo || ((collab as any).user_id ? ((ctx.allCompanySettings || {})[`avatar_${(collab as any).user_id}`] || null) : null);
                return (
                  <div style={{ width: 64, height: 64, borderRadius: "50%", background: av ? "transparent" : collab.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 700, color: C.white, flexShrink: 0, overflow: "hidden" }}>
                    {av ? <img src={av} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : collab.initials}
                  </div>
                );
              })()}
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
                  {(() => {
                    const catMeta = collabParcours ? PARCOURS_CAT_META[collabParcours.categorie as ParcoursCategorie] : null;
                    const parcoursName = collabParcours?.nom || "Aucun parcours";
                    const phaseCount = collabParcours?.phases?.length || 0;
                    return (
                      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", background: catMeta?.bg || C.pinkBg, borderRadius: 10, marginBottom: 16 }}>
                        <Route size={18} color={catMeta?.color || C.pink} />
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{parcoursName}</div>
                            {catMeta && <span style={{ fontSize: 9, fontWeight: 600, padding: "2px 8px", borderRadius: 6, background: catMeta.bg, color: catMeta.color }}>{catMeta.label}</span>}
                          </div>
                          <div style={{ fontSize: 11, color: C.textLight }}>{collabActions.length} actions · {phaseCount} phases</div>
                        </div>
                      </div>
                    );
                  })()}
                  <div style={{ fontSize: 11, fontWeight: 600, color: C.textMuted, textTransform: "uppercase", marginBottom: 8 }}>Équipe d'accompagnement</div>
                  {(() => {
                    const mgr = (collab as any).manager;
                    const hrbp = (collab as any).hrManager;
                    const teamEntries: { label: string; name: string | null }[] = [
                      { label: "Manager", name: mgr ? `${mgr.prenom} ${mgr.nom}` : null },
                      { label: "HRBP", name: hrbp ? `${hrbp.prenom} ${hrbp.nom}` : null },
                    ];
                    const hasReal = teamEntries.some(e => e.name);
                    if (hasReal) {
                      return (<>
                        {teamEntries.filter(e => e.name).map((entry, i) => (
                          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", borderBottom: i < teamEntries.filter(e => e.name).length - 1 ? `1px solid ${C.border}` : "none" }}>
                            <UserCheck size={13} color={C.pink} />
                            <div style={{ fontSize: 12, fontWeight: 500, color: C.text }}>{entry.label}: {entry.name}</div>
                          </div>
                        ))}
                      </>);
                    }
                    return EQUIPE_ROLES.filter(r => r.obligatoire).map((role, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", borderBottom: i < 2 ? `1px solid ${C.border}` : "none" }}>
                        <UserCheck size={13} color={C.textMuted} />
                        <div style={{ fontSize: 12, color: C.text }}>{role.role}</div>
                        <div style={{ fontSize: 11, color: C.textMuted, marginLeft: "auto" }}>{role.description}</div>
                      </div>
                    ));
                  })()}
                </div>
              </div>

              {/* Custom fields from fieldConfig */}
              {(() => {
                const activeFields = fieldConfig.filter(f => f.actif);
                const fieldSections = [
                  { key: "personal", label: "Informations personnelles", icon: Users, color: "#E41076" },
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
                { key: "personal", label: lang === "fr" ? "Informations personnelles" : "Personal information", icon: Users, color: "#E41076" },
                { key: "contract", label: lang === "fr" ? "Informations contractuelles" : "Contract information", icon: FileSignature, color: "#1A73E8" },
                { key: "job", label: "Job Information", icon: ClipboardList, color: "#E65100" },
                { key: "position", label: "Position Information", icon: Navigation, color: "#00897B" },
                { key: "org", label: lang === "fr" ? "Informations organisationnelles" : "Organizational information", icon: Building2, color: "#7B5EA7" },
              ];
              const collabData = (collab as any).custom_fields || {};
              return (
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  {/* Edit button */}
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <button onClick={() => { setCollabPanelData({ ...collab, email: collab.email || "", custom_fields: (collab as any).custom_fields || {} }); setCollabPanelMode("edit"); }} className="iz-btn-pink" style={{ ...sBtn("pink"), fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}><FilePen size={13} /> Modifier les informations</button>
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
                            let val = isCustom ? (collabData[fc.field_key] || "") : ((collab as any)[fc.field_key] || "");
                            // Resolve manager IDs to names
                            if ((fc.field_key === "manager_id" || fc.field_key === "hr_manager_id") && val) {
                              const mgr = COLLABORATEURS.find((co: any) => String(co.id) === String(val));
                              if (mgr) val = `${mgr.prenom} ${mgr.nom}`;
                            }
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
                              <button onClick={() => { setCollabPanelData({ ...collab, email: collab.email || "", custom_fields: (collab as any).custom_fields || {} }); setCollabPanelMode("edit"); }} style={{ ...sBtn("outline"), fontSize: 10, padding: "3px 8px" }}>Compléter</button>
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
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {/* Real team members from API */}
                {(() => {
                  const mgr = (collab as any).manager;
                  const hrbp = (collab as any).hrManager;
                  const realMembers: { name: string; role: string; initials: string; color: string }[] = [];
                  if (mgr) realMembers.push({ name: `${mgr.prenom} ${mgr.nom}`, role: "Manager", initials: `${mgr.prenom[0]}${mgr.nom[0]}`, color: "#4CAF50" });
                  if (hrbp) realMembers.push({ name: `${hrbp.prenom} ${hrbp.nom}`, role: "HRBP", initials: `${hrbp.prenom[0]}${hrbp.nom[0]}`, color: "#8D6E63" });
                  if (realMembers.length === 0) return null;
                  return (
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 600, color: C.textMuted, textTransform: "uppercase", marginBottom: 12 }}>Équipe assignée</div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                        {realMembers.map((m, i) => (
                          <div key={i} style={{ ...sCard, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "28px 20px" }}>
                            <div style={{ width: 52, height: 52, borderRadius: "50%", background: m.color + "20", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12, fontSize: 18, fontWeight: 700, color: m.color }}>
                              {m.initials}
                            </div>
                            <div style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 4 }}>{m.name}</div>
                            <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 10 }}>{m.role}</div>
                            <span style={{ fontSize: 9, fontWeight: 600, color: C.green, background: C.greenLight, padding: "3px 10px", borderRadius: 6 }}>Assigné</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
                {/* Generic roles (unfilled positions) */}
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: C.textMuted, textTransform: "uppercase", marginBottom: 12 }}>
                    {(collab as any).manager || (collab as any).hrManager ? "Rôles à pourvoir" : "Rôles d'accompagnement"}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                    {EQUIPE_ROLES
                      .filter(role => {
                        if ((collab as any).manager && role.role === "Manager") return false;
                        if ((collab as any).hrManager && role.role === "HRBP") return false;
                        return true;
                      })
                      .map((role, i) => (
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
                </div>
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

  // ─── RELANCE MODAL (manual reminder email) ────────────────
  const renderRelanceModal = () => {
    if (relanceCollabId == null) return null;
    const collab = COLLABORATEURS.find((c: any) => c.id === relanceCollabId);
    if (!collab) return null;
    const close = () => { setRelanceCollabId(null); ctx.setRelanceDraft && ctx.setRelanceDraft(null); };
    const draft = ctx.relanceDraft || {
      subject: `Rappel : avancement de votre parcours d'intégration`,
      body: `Bonjour ${collab.prenom},\n\nJe me permets de revenir vers vous concernant votre parcours d'intégration. Quelques actions sont encore en attente de votre côté et un rappel pourrait vous aider à les finaliser sereinement.\n\nN'hésitez pas si vous avez besoin d'aide.\n\nBien cordialement,\n${(ctx.auth?.user?.name || "")}`,
    };
    const setDraft = (d: any) => ctx.setRelanceDraft && ctx.setRelanceDraft({ ...draft, ...d });
    const sending = !!ctx.relanceSending;
    const sendIt = async () => {
      if (!draft.subject.trim() || !draft.body.trim()) { addToast_admin("Sujet et message requis", "warning"); return; }
      ctx.setRelanceSending && ctx.setRelanceSending(true);
      try {
        const m = await import('../api/endpoints');
        await m.relancerCollaborateur(collab.id, { subject: draft.subject.trim(), body: draft.body.trim() });
        addToast_admin(`Relance envoyée à ${collab.prenom} ${collab.nom}`, "success");
        close();
      } catch (err: any) {
        addToast_admin(err?.message || "Échec de l'envoi de la relance", "error");
      } finally {
        ctx.setRelanceSending && ctx.setRelanceSending(false);
      }
    };
    return (
      <div onClick={close} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.4)", zIndex: 1200, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="iz-modal iz-scale-in" onClick={e => e.stopPropagation()} style={{ background: C.white, borderRadius: 16, width: 620, maxHeight: "85vh", overflow: "auto", zIndex: 1201 }}>
          <div style={{ padding: "20px 24px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <h2 style={{ fontSize: 17, fontWeight: 600, margin: 0, display: "flex", alignItems: "center", gap: 8 }}><Send size={18} color={C.pink} /> Relancer le collaborateur</h2>
              <p style={{ fontSize: 12, color: C.textMuted, margin: "2px 0 0" }}>{collab.prenom} {collab.nom} · {collab.email || "email non renseigné"}</p>
            </div>
            <button onClick={close} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={20} color={C.textLight} /></button>
          </div>
          <div style={{ padding: "20px 24px" }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: C.textLight, marginBottom: 6 }}>Sujet</label>
            <input value={draft.subject} onChange={e => setDraft({ subject: e.target.value })} style={{ ...sInput, fontSize: 13, marginBottom: 16 }} />
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: C.textLight, marginBottom: 6 }}>Message</label>
            <textarea value={draft.body} onChange={e => setDraft({ body: e.target.value })} rows={10} style={{ ...sInput, fontSize: 13, fontFamily: font, resize: "vertical", lineHeight: 1.6 }} />
            <div style={{ fontSize: 11, color: C.textMuted, marginTop: 8 }}>L'email sera envoyé à l'adresse du collaborateur depuis votre adresse RH par défaut.</div>
          </div>
          <div style={{ padding: "16px 24px", borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "flex-end", gap: 10 }}>
            <button onClick={close} disabled={sending} style={{ ...sBtn("outline"), padding: "8px 18px", fontSize: 13 }}>Annuler</button>
            <button onClick={sendIt} disabled={sending || !collab.email} className="iz-btn-pink" style={{ ...sBtn("pink"), padding: "8px 22px", fontSize: 13, display: "flex", alignItems: "center", gap: 6, opacity: !collab.email ? 0.5 : 1 }}>
              <Send size={14} /> {sending ? "Envoi…" : "Envoyer la relance"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return {
    renderDashboard_admin,
    renderSuivi,
    renderCollabProfile,
    renderOcrModal,
    renderRelanceModal,
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
