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
  Moon, Sun, HelpCircle
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { ANIM_STYLES, C, hexToRgb, colorWithAlpha, lighten, REGION_LOCALE, REGION_CURRENCY, getLocaleSettings, fmtDate, fmtDateShort, fmtTime, fmtDateTime, fmtDateTimeShort, fmtCurrency, font, fontDisplay, ILLIZEO_LOGO_URI, ILLIZEO_FULL_LOGO_URI, getLogoUri, getLogoFullUri, IllizeoLogoFull, IllizeoLogo, IllizeoLogoBrand, PreboardSidebar, sCard, sBtn, sInput, isDarkMode, applyDarkMode, COUNTRIES } from '../constants';
import type { OnboardingStep, DashboardPage, DashboardTab, UserRole, AdminPage, AdminModal, Collaborateur, ParcoursCategorie, ParcourTemplate, ActionTemplate, ActionType, AssignTarget, GroupePersonnes, DocCategory, WorkflowRule, EmailTemplate, TeamMember } from '../types';
import RichEditor from '../components/RichEditor';
import TranslatableField, { type Translations } from '../components/TranslatableField';
import { DOC_CATEGORIES, ACTIONS, _MOCK_NOTIFICATIONS_LIST, NOTIF_RESOURCES, TEAM_MEMBERS, ACTION_TYPE_META, PHASE_ICONS, SITES, DEPARTEMENTS, TYPES_CONTRAT, _MOCK_COLLABORATEURS, _MOCK_PARCOURS_TEMPLATES, _MOCK_ACTION_TEMPLATES, _MOCK_ADMIN_DOC_CATEGORIES, _MOCK_WORKFLOW_RULES, _MOCK_EMAIL_TEMPLATES, _MOCK_PHASE_DEFAULTS, _MOCK_GROUPES, EQUIPE_ROLES, TPL_CATEGORIES, guessTplCategory } from '../mockData';

import { presenceLabel } from '../api/endpoints';
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
  saveMyBanner,
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
  uploadSignatureFile, sendSignatureDocToAll, getDocAcknowledgements, acknowledgeDoc, getMyPendingSignatures, getMyAcknowledgement,
  type SignatureDoc, type DocAcknowledgement,
  checkDossier, validateDossier, exportDossier, resetDossier, type DossierCheck,
  postAiChat,
} from "../api/endpoints";
import { apiFetch } from "../api/client";

// Searchable country/nationality picker with flags. Used in formulaire fields
// whose label looks like "Nationalité". Native <select> drops emoji flags on
// Windows, so we build our own dropdown.
function CountryPicker({ value, onChange, placeholder = "— Sélectionner —" }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const selected = COUNTRIES.find(c => c.label === value);
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);
  const q = search.trim().toLowerCase();
  const filtered = q ? COUNTRIES.filter(c => c.label.toLowerCase().includes(q) || c.code.toLowerCase().includes(q)) : COUNTRIES;
  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button type="button" onClick={() => setOpen(o => !o)} style={{ ...sInput, width: "100%", display: "flex", alignItems: "center", gap: 8, background: C.white, border: `1px solid ${C.border}`, cursor: "pointer", textAlign: "left", fontFamily: font }}>
        {selected ? <><img src={`https://flagcdn.com/24x18/${selected.code.toLowerCase()}.png`} alt="" loading="lazy" style={{ width: 22, height: 16, objectFit: "contain", borderRadius: 2 }} /><span>{selected.label}</span></> : <span style={{ color: C.textMuted }}>{placeholder}</span>}
        <span style={{ marginLeft: "auto", color: C.textMuted, fontSize: 11 }}>▾</span>
      </button>
      {open && (
        <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, background: C.white, border: `1px solid ${C.border}`, borderRadius: 8, boxShadow: "0 8px 24px rgba(0,0,0,.1)", zIndex: 1100, maxHeight: 280, display: "flex", flexDirection: "column" }}>
          <div style={{ padding: 8, borderBottom: `1px solid ${C.border}` }}>
            <input autoFocus value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher…" style={{ ...sInput, width: "100%", padding: "6px 10px", fontSize: 12, fontFamily: font }} />
          </div>
          <div style={{ overflowY: "auto", flex: 1 }}>
            {filtered.length === 0 ? (
              <div style={{ padding: "10px 12px", fontSize: 12, color: C.textMuted, textAlign: "center" }}>Aucun résultat</div>
            ) : filtered.map(c => (
              <button key={c.code} type="button" onClick={() => { onChange(c.label); setOpen(false); setSearch(""); }} style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "8px 12px", background: c.label === value ? C.pinkBg : "transparent", border: "none", cursor: "pointer", fontFamily: font, fontSize: 13, color: C.text, textAlign: "left" }} onMouseEnter={e => { if (c.label !== value) e.currentTarget.style.background = C.bg; }} onMouseLeave={e => { if (c.label !== value) e.currentTarget.style.background = "transparent"; }}>
                <img src={`https://flagcdn.com/24x18/${c.code.toLowerCase()}.png`} alt="" loading="lazy" style={{ width: 22, height: 16, objectFit: "contain", borderRadius: 2, flexShrink: 0 }} />
                <span style={{ flex: 1 }}>{c.label}</span>
                <span style={{ fontSize: 10, color: C.textMuted }}>{c.code}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Factory that creates all employee render functions.
 */
export function createEmployeeRenders(ctx: any) {
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
    campaignPanelData, setCampaignPanelData, companyBlocks, setCompanyBlocks, cultureQuizState, leaderboardData, dashboardActionsView, setDashboardActionsView, calendarWeekOffset, setCalendarWeekOffset, dashboardFocusActionId, setDashboardFocusActionId, mesActionsView, setMesActionsView, isMobile, editingBlockId, setEditingBlockId, userNotifs, setUserNotifs,
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
    showActionDetail, setShowActionDetail, sigActionAck, setSigActionAck, sigActionLoading, setSigActionLoading, sigContratData, setSigContratData, actionTab, setActionTab, showProfile, setShowProfile, showTeamModal, setShowTeamModal, selectedTeamMember, setSelectedTeamMember,
    profileTab, setProfileTab, profileForm, setProfileForm, formData, setFormData, passwordVisible, setPasswordVisible, acceptCGU, setAcceptCGU,
    employeeDocs, setEmployeeDocs, completedActions, setCompletedActions, sharedTimeline, setSharedTimeline, toasts, setToasts,
    auth, _needsPlan, isDemo, apiEnabled, COLLABORATEURS, refetchCollaborateurs, PARCOURS_TEMPLATES, refetchParcours,
    ACTION_TEMPLATES, refetchActions, GROUPES, refetchGroupes, PHASE_DEFAULTS, refetchPhases, WORKFLOW_RULES, EMAIL_TEMPLATES,
    ADMIN_DOC_CATEGORIES, NOTIFICATIONS_LIST, integrations, refetchIntegrations, apiContrats, authRole, addToast_admin, showConfirm,
    showPrompt, switchLang, toggleDarkMode, resetTr, setTr, buildTranslationsPayload, addToast, addTimelineEntry,
    handleEmployeeSubmitDoc, handleRHValidateDoc, handleRHRefuseDoc, handleCompleteAction, handleReactivateAction, handleRelance, docsSubmitted, docsValidated, docsTotal,
    docsMissing, employeeProgression, getLiveCollaborateurs, getLiveDocCategories, msgEndRef, bannerRef, messageRef, toastIdRef,
    SIDEBAR_ITEMS, markSetupStepDone, finishSetupWizard,
  } = ctx;

  // ─── Form state for expandable formulaires (passed from ctx) ────
  const { expandedFormId, setExpandedFormId, formFieldValues, setFormFieldValues } = ctx;

  // ─── EMPLOYEE ACTIONS (from real parcours) ────────────────
  const { myCollabProfile, subtaskChecks, setSubtaskChecks } = ctx;
  const myCollab = myCollabProfile || COLLABORATEURS.find((c: any) => c.email === auth.user?.email);
  const myParcours = myCollab ? PARCOURS_TEMPLATES.find((p: any) => p.id === myCollab.parcours_id) : null;
  // hasRealParcours: the collab actually has a parcours_id in the DB. Without it we
  // must NOT pretend they're on a real parcours — the previous "Onboarding Standard"
  // fallback was misleading employees into thinking they had a configured journey
  // when in reality nothing was assigned and 0 actions would ever appear.
  const hasRealParcours = !!((myCollab as any)?.parcours_id || (myCollab as any)?.parcours_nom);
  const myParcoursName = hasRealParcours ? ((myCollab as any)?.parcours_nom || myParcours?.nom || "Parcours") : "";
  const myParcoursCategorie = (myCollab as any)?.parcours_categorie || myParcours?.categorie || "onboarding";
  const CAT_LABELS_MAP: Record<string, string> = { onboarding: "Onboarding", offboarding: "Offboarding", crossboarding: "Crossboarding", reboarding: "Reboarding" };
  // Use actions from /me/collaborateur first, fallback to ACTION_TEMPLATES filtered by parcours name
  const myProfileActions = (myCollab as any)?.parcours_actions || [];
  // Gate by assignation target — see Onboarding_v1.tsx _isTargeted for the same logic.
  const myFullName = `${(myCollab as any)?.prenom || ""} ${(myCollab as any)?.nom || ""}`.trim();
  const isTargetedAction = (a: any): boolean => {
    const mode = a.assignation?.mode || a.assignation_mode;
    const valeurs: string[] = a.assignation?.valeurs || a.assignation_valeurs || [];
    if (!mode || mode === "tous") return true;
    if (mode === "site") return !(myCollab as any)?.site || valeurs.includes((myCollab as any).site);
    if (mode === "contrat") return !(myCollab as any)?.type_contrat || valeurs.includes((myCollab as any).type_contrat);
    if (mode === "parcours") return valeurs.includes(myParcoursName);
    if (mode === "groupe") {
      if (!GROUPES || GROUPES.length === 0 || !myFullName) return true;
      return valeurs.some((gn: string) => {
        const g = (GROUPES as any[]).find(x => x.nom === gn);
        return !!g && (g.membres || []).includes(myFullName);
      });
    }
    return true;
  };
  const myActions = (myProfileActions.length > 0 ? myProfileActions : ACTION_TEMPLATES.filter((a: any) => a.parcours === myParcoursName))
    .filter(isTargetedAction);
  const ACTION_TYPE_COLORS: Record<string, { bg: string; color: string }> = {
    document: { bg: C.redLight, color: C.red },
    signature: { bg: "#FFF8E1", color: "#F9A825" },
    formation: { bg: C.greenLight, color: C.green },
    questionnaire: { bg: C.blueLight, color: C.blue },
    tache: { bg: C.bg, color: C.textMuted },
    formulaire: { bg: C.pinkBg, color: C.pink },
    lecture: { bg: C.blueLight, color: C.blue },
    entretien: { bg: "#F3E5F5", color: "#7B5EA7" },
    visite: { bg: C.greenLight, color: "#00897B" },
    passation: { bg: "#FFF3E0", color: "#E65100" },
    checklist_it: { bg: C.amberLight, color: C.amber },
    message: { bg: C.blueLight, color: C.blue },
  };
  const EMPLOYEE_ACTIONS = myActions.length > 0 ? myActions.map((a: any, i: number) => {
    const actionType = a.type || "tache";
    const typeColors = ACTION_TYPE_COLORS[actionType] || { bg: C.bg, color: C.textMuted };
    return {
      id: a.id || i + 1,
      title: a.titre,
      subtitle: a.description || "",
      date: a.delaiRelatif || a.delai_relatif,
      badge: CAT_LABELS_MAP[myParcoursCategorie] || myParcoursName,
      iconBg: typeColors.bg,
      iconColor: typeColors.color,
      urgent: i === 0,
      type: ("task") as "admin" | "task" | "future",
      actionType: actionType,
      icon: null,
      assignment_id: a.assignment_id || null,
      assignment_status: a.assignment_status || "a_faire",
      options: a.options || undefined,
      duree_estimee: a.duree_estimee || null,
      xp: a.xp ?? 50,
      heure_default: a.heure_default || null,
      accompagnant: a.accompagnant || null,
      lienExterne: a.lienExterne || a.lien_externe || null,
      dureeEstimee: a.dureeEstimee || a.duree_estimee || null,
      piecesRequises: a.piecesRequises || a.pieces_requises || undefined,
    };
  }) : ACTIONS;

  // Pre-populate completedActions from backend assignment_status (no hooks — sync inline)
  if (EMPLOYEE_ACTIONS.length > 0 && !(EMPLOYEE_ACTIONS as any)._synced) {
    const doneIds = EMPLOYEE_ACTIONS.filter((a: any) => a.assignment_status === "termine").map((a: any) => a.id);
    if (doneIds.length > 0) {
      const current = completedActions;
      const needsUpdate = doneIds.some((id: number) => !current.has(id));
      if (needsUpdate) {
        const updated = new Set(current);
        doneIds.forEach((id: number) => updated.add(id));
        setCompletedActions(updated);
      }
    }
    (EMPLOYEE_ACTIONS as any)._synced = true;
  }

  // ─── RENDER SIDEBAR ──────────────────────────────────────
  const toggleSidebar = () => {
    const next = !sidebarCollapsed;
    try { localStorage.setItem("illizeo_sidebar_collapsed", next ? "1" : "0"); } catch {}
    setSidebarCollapsed?.(next);
  };
  const renderSidebar = () => (
    <div style={{ width: sidebarCollapsed ? 68 : 240, minHeight: "100vh", background: C.white, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", flexShrink: 0, position: "sticky", top: 0, transition: "width .2s ease" }}>
      <div style={{ padding: sidebarCollapsed ? "20px 0 12px" : "20px 16px 12px", color: C.pink, display: "flex", alignItems: "center", justifyContent: sidebarCollapsed ? "center" : "space-between", gap: 8 }}>
        {sidebarCollapsed ? <IllizeoLogo size={32} /> : <IllizeoLogoFull height={24} />}
        {!sidebarCollapsed && (
          <button onClick={toggleSidebar} title="Réduire la sidebar" style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 6, width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <ChevronsLeft size={14} color={C.textMuted} />
          </button>
        )}
      </div>
      {sidebarCollapsed && (
        <div style={{ padding: "0 12px 8px", display: "flex", justifyContent: "center" }}>
          <button onClick={toggleSidebar} title="Étendre la sidebar" style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 6, width: 32, height: 26, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <ChevronsRight size={14} color={C.textMuted} />
          </button>
        </div>
      )}
      {/* Role switcher — only for admins, hidden when collapsed */}
      {auth.isAdmin && !sidebarCollapsed && (
        <div style={{ margin: "0 12px 8px", padding: 3, background: C.bg, borderRadius: 10, display: "flex", gap: 3 }}>
          {(["employee", "rh"] as UserRole[]).map(r => {
            const active = role === r;
            return (
              <button key={r} onClick={() => { setRole(r); }} style={{
                flex: 1, padding: "8px 0", borderRadius: 8, fontSize: 12, fontWeight: 600, border: "none", cursor: "pointer", fontFamily: font, transition: "all .2s",
                background: active ? C.white : "transparent", color: active ? C.dark : C.textMuted,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                boxShadow: active ? "0 1px 4px rgba(0,0,0,.08)" : "none",
              }}>
                {r === "rh" ? <><ShieldCheck size={13} /> {t('role.admin_rh')}</> : <><UserCheck size={13} /> {t('role.onboardee')}</>}
              </button>
            );
          })}
        </div>
      )}
      <div style={{ flex: 1, padding: "0 8px" }}>
        {SIDEBAR_ITEMS.map(section => (
          <div key={section.section} style={{ marginBottom: 8 }}>
            {!sidebarCollapsed && <div style={{ fontSize: 11, fontWeight: 600, color: C.textMuted, letterSpacing: .5, padding: "12px 12px 6px", textTransform: "uppercase" }}>{section.section}</div>}
            {sidebarCollapsed && <div style={{ height: 1, margin: "10px 12px", background: C.border }} />}
            {section.items.map(item => {
              const active = dashPage === item.id;
              const Icon = item.icon;
              return (
                <button key={item.id} onClick={() => setDashPage(item.id)} title={sidebarCollapsed ? item.label : ""} style={{
                  display: "flex", alignItems: "center", gap: 10, width: "100%",
                  padding: sidebarCollapsed ? "10px 0" : "10px 12px",
                  justifyContent: sidebarCollapsed ? "center" : "flex-start",
                  borderRadius: 8, border: "none",
                  background: active ? C.pinkBg : "transparent", color: active ? C.pink : C.text, cursor: "pointer", fontFamily: font, fontSize: 14, fontWeight: active ? 600 : 400, transition: "all .18s ease",
                  borderLeft: active && !sidebarCollapsed ? `3px solid ${C.pink}` : "3px solid transparent",
                  position: "relative",
                }}>
                  <Icon size={18} />
                  {!sidebarCollapsed && <span style={{ flex: 1, textAlign: "left" }}>{item.label}</span>}
                  {item.badge && (
                    sidebarCollapsed
                      ? <span style={{ position: "absolute", top: 2, right: 6, background: C.pink, color: C.white, fontSize: 9, fontWeight: 700, borderRadius: 10, padding: "1px 5px", minWidth: 14, textAlign: "center" }}>{item.badge}</span>
                      : <span style={{ background: C.pink, color: C.white, fontSize: 11, fontWeight: 700, borderRadius: 10, padding: "2px 8px", minWidth: 20, textAlign: "center" }}>{item.badge}</span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );

  // ─── EMPLOYEE TOPBAR (avatar dropdown + dark mode) ──────────
  const renderEmployeeTopbar = () => {
    const initials = auth.user?.name?.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase() || "?";
    const fullName = auth.user?.name || "Utilisateur";
    const role = auth.user?.roles?.[0] || "";
    const open = !!ctx.avatarMenuOpen;
    const setOpen = (v: boolean) => ctx.setAvatarMenuOpen?.(v);
    return (
      <div data-emp-topbar style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 10, padding: "12px 32px", borderBottom: `1px solid ${C.border}`, background: C.white, position: "sticky", top: 0, zIndex: 90 }}>
        {/* Dark mode toggle */}
        <button onClick={toggleDarkMode} title={darkMode ? t('settings.light_mode') : t('settings.dark_mode')}
          style={{ width: 36, height: 36, borderRadius: 8, border: `1px solid ${C.border}`, background: C.bg, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all .15s" }}>
          {darkMode ? <Sun size={16} color={C.amber} /> : <Moon size={16} color={C.textMuted} />}
        </button>
        {/* Notification bell — même pattern que le topbar admin. La page
            "Notifications" a été retirée de la sidebar employé en faveur de
            ce dropdown contextuel. */}
        <div data-notif-dropdown style={{ position: "relative" }}>
          <button onClick={() => ctx.setShowNotifDropdown?.(!ctx.showNotifDropdown)}
            title={t('sidebar.notifications')}
            style={{ width: 36, height: 36, borderRadius: 8, border: `1px solid ${C.border}`, background: C.bg, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", transition: "all .15s" }}>
            <Bell size={16} color={C.textMuted} />
            {(ctx.notifUnread || 0) > 0 && (
              <div style={{ position: "absolute", top: -3, right: -3, minWidth: 16, height: 16, padding: "0 4px", borderRadius: 8, background: C.pink, color: C.white, fontSize: 9, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {ctx.notifUnread > 9 ? "9+" : ctx.notifUnread}
              </div>
            )}
          </button>
          {ctx.showNotifDropdown && (
            <>
              <div onClick={() => ctx.setShowNotifDropdown?.(false)} style={{ position: "fixed", inset: 0, zIndex: 100 }} />
              <div className="iz-fade-up" style={{ position: "absolute", top: "calc(100% + 6px)", right: 0, width: 380, maxHeight: 480, background: C.white, borderRadius: 12, boxShadow: "0 8px 28px rgba(0,0,0,.15)", border: `1px solid ${C.border}`, zIndex: 101, overflow: "hidden" }}>
                <div style={{ padding: "14px 16px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 15, fontWeight: 600 }}>{t('sidebar.notifications')}</span>
                  {(ctx.notifUnread || 0) > 0 && (
                    <button onClick={async () => {
                      try { await (await import('../api/endpoints')).markAllNotifsRead(); } catch {}
                      try { ctx.setUserNotifs?.(await (await import('../api/endpoints')).getUserNotifications()); } catch {}
                      ctx.setNotifUnread?.(0);
                    }} style={{ background: "none", border: "none", color: C.pink, fontSize: 11, cursor: "pointer", fontFamily: font }}>{lang === "fr" ? "Tout marquer comme lu" : "Mark all read"}</button>
                  )}
                </div>
                <div style={{ maxHeight: 400, overflow: "auto" }}>
                  {(!ctx.userNotifs || ctx.userNotifs.length === 0) && (
                    <div style={{ padding: "30px 16px", textAlign: "center", color: C.textMuted, fontSize: 13 }}>{lang === "fr" ? "Aucune notification" : "No notifications"}</div>
                  )}
                  {(ctx.userNotifs || []).slice(0, 15).map((n: any) => (
                    <div key={n.id} onClick={async () => {
                      if (!n.read_at) {
                        try {
                          const ep = await import('../api/endpoints');
                          await ep.markNotifRead(n.id);
                          ctx.setUserNotifs?.(await ep.getUserNotifications());
                          ctx.setNotifUnread?.(Math.max(0, (ctx.notifUnread || 0) - 1));
                        } catch {}
                      }
                      ctx.setShowNotifDropdown?.(false);
                      // Route the user to the relevant page based on the
                      // notification type. Badge notifications open the
                      // badges gallery.
                      const type = n.type || "";
                      const titleLower = (n.titre || n.title || "").toLowerCase();
                      if (type === "badge_earned" || titleLower.includes("badge")) {
                        ctx.setDashPage?.("badges");
                      }
                    }}
                      style={{ padding: "12px 16px", borderBottom: `1px solid ${C.border}`, cursor: "pointer", background: n.read_at ? "transparent" : C.pinkBg + "30", transition: "background .15s" }}
                      className="iz-sidebar-item">
                      <div style={{ display: "flex", alignItems: "start", gap: 10 }}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: n.read_at ? "transparent" : C.pink, flexShrink: 0, marginTop: 5 }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: n.read_at ? 400 : 600, color: C.text }}>{n.titre || n.title}</div>
                          <div style={{ fontSize: 11, color: C.textLight, marginTop: 2 }}>{n.contenu || n.message || ""}</div>
                          <div style={{ fontSize: 10, color: C.textMuted, marginTop: 4 }}>{fmtDateTimeShort(n.created_at)}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
        {/* Avatar dropdown */}
        <div style={{ position: "relative" }}>
          <button onClick={() => setOpen(!open)}
            style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 12px 6px 6px", background: open ? C.bg : "transparent", border: `1px solid ${open ? C.border : "transparent"}`, borderRadius: 22, cursor: "pointer", fontFamily: font, transition: "all .15s" }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: avatarImage ? "none" : "linear-gradient(135deg, #E91E8C, #E41076)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600, color: C.white, overflow: "hidden" }}>
              {avatarImage ? (
                <img src={avatarImage} alt="" style={{
                  width: `${avatarZoom || 100}%`, height: `${avatarZoom || 100}%`, objectFit: "cover", position: "relative",
                  left: `${(50 - (avatarPos?.x || 50)) * ((avatarZoom || 100) - 100) / 100}%`,
                  top: `${(50 - (avatarPos?.y || 50)) * ((avatarZoom || 100) - 100) / 100}%`,
                }} />
              ) : initials}
            </div>
            <div style={{ textAlign: "left", lineHeight: 1.2 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{fullName}</div>
              {role && <div style={{ fontSize: 10, color: C.textMuted }}>{role}</div>}
            </div>
            <ChevronRight size={14} color={C.textMuted} style={{ transform: open ? "rotate(90deg)" : "rotate(0)", transition: "transform .15s" }} />
          </button>
          {open && (
            <>
              <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 100 }} />
              <div className="iz-fade-up" style={{ position: "absolute", top: "calc(100% + 6px)", right: 0, width: 260, background: C.white, borderRadius: 12, boxShadow: "0 8px 28px rgba(0,0,0,.12)", border: `1px solid ${C.border}`, zIndex: 101, overflow: "hidden" }}>
                <div style={{ padding: "16px 18px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: "50%", background: avatarImage ? "none" : "linear-gradient(135deg, #E91E8C, #E41076)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 600, color: C.white, overflow: "hidden" }}>
                    {avatarImage ? (
                      <img src={avatarImage} alt="" style={{
                        width: `${avatarZoom || 100}%`, height: `${avatarZoom || 100}%`, objectFit: "cover", position: "relative",
                        left: `${(50 - (avatarPos?.x || 50)) * ((avatarZoom || 100) - 100) / 100}%`,
                        top: `${(50 - (avatarPos?.y || 50)) * ((avatarZoom || 100) - 100) / 100}%`,
                      }} />
                    ) : initials}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{fullName}</div>
                    {auth.user?.email && <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>{auth.user.email}</div>}
                  </div>
                </div>
                <div style={{ padding: "6px 0" }}>
                  {[
                    { id: "infos", label: "Informations personnelles", Icon: UserCheck },
                    { id: "password", label: "Mot de passe", Icon: KeyRound },
                    { id: "notifs", label: "Notifications", Icon: Bell },
                    { id: "notifs_res", label: "Notifications ressources", Icon: Inbox },
                  ].map(item => {
                    const Icon = item.Icon;
                    return (
                      <button key={item.id} onClick={() => { setProfileTab(item.id); setShowProfile(true); setOpen(false); }}
                        style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "10px 18px", background: "none", border: "none", cursor: "pointer", fontFamily: font, fontSize: 13, color: C.text, transition: "background .12s" }}
                        onMouseEnter={e => e.currentTarget.style.background = C.bg}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                        <Icon size={15} color={C.textMuted} />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
                {/* Language selector */}
                <div style={{ borderTop: `1px solid ${C.border}`, padding: "10px 18px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                    <Languages size={15} color={C.textMuted} />
                    <span style={{ fontSize: 13, color: C.text }}>Langue</span>
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
                    onClick={() => { setOpen(false); const tid = localStorage.getItem("illizeo_tenant_id"); auth.logout().catch(() => {}).finally(() => { window.location.href = tid ? `/${tid}` : "/"; }); }}
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
    );
  };

  // ─── BANNER IMAGE UPLOAD ─────────────────────────────────
  const handleBannerFileUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      if (file.size > 5 * 1024 * 1024) { addToast("Image trop lourde (max 5 Mo)", "warning"); return; }
      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = ev.target?.result as string;
        setBannerImage(dataUrl);
        localStorage.setItem("illizeo_banner_image", dataUrl);
        saveMyBanner({ image: dataUrl }).catch(() => {});
        setBannerEditMode(true);
        setEmployeeBannerCustom(false);
        setBannerZoom(100);
        setBannerPos({ x: 50, y: 50 });
        addToast("Image importée — glissez pour repositionner", "success");
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  // ─── RENDER ACTION CARD ──────────────────────────────────
  const renderActionCard = (action: typeof ACTIONS[0], showCheckbox = false, staggerIdx = 0) => {
    const isDone = completedActions.has(action.id);
    const liveSubtitle = action.id === 1 ? (docsMissing > 0 ? `${lang === "fr" ? "Il vous reste" : "You have"} ${docsMissing} ${t('emp.docs_remaining')}` : t('emp.docs_file_complete')) : action.subtitle;
    // If the action carries required pieces (document/admin), clicking it should
    // jump straight to the per-piece upload panel — same UX as Mon profil > Documents administratifs.
    const actionPieces: string[] = (action as any).piecesRequises || (action as any).pieces_requises || [];
    const opensUploadPanel = Array.isArray(actionPieces) && actionPieces.length > 0;
    const openAction = () => opensUploadPanel ? setShowDocCategory(`action_${action.id}`) : setShowActionDetail(action.id);
    return (
    <div key={action.id} className={`iz-card iz-fade-up iz-stagger-${Math.min(staggerIdx, 8)}`} onClick={openAction} style={{ ...sCard, padding: "16px 20px", display: "flex", alignItems: "center", gap: 16, cursor: "pointer", marginBottom: 12, opacity: isDone ? 0.6 : 1 }}>
      <div className="iz-avatar" style={{ width: 40, height: 40, borderRadius: 10, background: isDone ? C.greenLight : action.iconBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
        {isDone ? <CheckCircle size={18} color={C.green} /> : (action.icon || <FileText size={18} color={action.iconColor} />)}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: isDone ? C.textLight : C.text, lineHeight: 1.4, textDecoration: isDone ? "line-through" : "none" }}>{action.title}</div>
        {liveSubtitle && !isDone && <div style={{ fontSize: 13, color: action.id === 1 && docsMissing === 0 ? C.green : C.pink, marginTop: 2 }}>{liveSubtitle}</div>}
        {action.date && !isDone && <div style={{ fontSize: 12, color: C.red, marginTop: 2 }}>{t('emp.late')} ({action.date})</div>}
        {isDone && <div style={{ fontSize: 12, color: C.green, marginTop: 2 }}>{t('emp.done')}</div>}
        {action.badge && (
          <span className="iz-tag" style={{ display: "inline-flex", alignItems: "center", gap: 4, marginTop: 6, padding: "3px 10px", borderRadius: 12, background: C.pinkLight, fontSize: 11, fontWeight: 600, color: C.pink }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: C.pink }} />
            {action.badge}
          </span>
        )}
      </div>
      {action.urgent && !isDone && (() => {
        const tplMatch = ACTION_TEMPLATES.find((tp: any) => tp.titre === action.title);
        const isSignatureAction = tplMatch?.type === "signature" || tplMatch?.type === "lecture";
        return <button className="iz-btn-pink" onClick={e => {
          e.stopPropagation();
          if (isSignatureAction) setShowActionDetail(action.id);
          else if (opensUploadPanel) setShowDocCategory(`action_${action.id}`);
          else setShowDocPanel("admin");
        }} style={{ ...sBtn("dark"), padding: "8px 20px", fontSize: 13 }}>{isSignatureAction ? t('emp.sign_btn') || "Signer" : t('emp.complete_btn')}</button>;
      })()}
      {showCheckbox && (
        <div onClick={e => { e.stopPropagation(); if (isDone) { handleReactivateAction(action.id, (action as any).assignment_id); } else { handleCompleteAction(action.id, (action as any).assignment_id); } }} style={{ width: 22, height: 22, borderRadius: "50%", border: `2px solid ${isDone ? C.green : C.border}`, background: isDone ? C.green : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all .2s", cursor: "pointer" }}>
          {isDone && <Check size={14} color={C.white} />}
        </div>
      )}
    </div>
    );
  };

  // ─── TABLEAU DE BORD ─────────────────────────────────────
  const renderDashboard = () => {
    const bannerGradient = `linear-gradient(135deg, ${employeeBannerColor} 0%, ${employeeBannerColor}99 30%, #E41076 70%, #E91E8C 100%)`;
    const handleBannerMouseMove = (e: React.MouseEvent) => {
      if (!bannerDragging || !bannerRef.current) return;
      const rect = bannerRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
      const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
      setBannerPos({ x, y });
    };
    const handleBannerUpload = handleBannerFileUpload;
    // Pre-arrival detection — when dateDebut is in the future, show the
    // "Compte à rebours" hero banner instead of the classic gradient one.
    // Cache the variant in localStorage so the correct banner is rendered on the
    // first paint after a refresh, before the API has returned the profile.
    const _bannerCacheKey = `illizeo_banner_variant_${auth.user?.id || "anon"}`;
    const _preArrivalDateDebut = myCollab?.dateDebut || (myCollab as any)?.date_debut;
    const _parseArrivalForBanner = (s: string): Date | null => {
      if (!s) return null;
      const str = String(s).trim();
      if (str.includes("T")) { const d = new Date(str); return isNaN(d.getTime()) ? null : d; }
      let m = str.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
      if (m) return new Date(parseInt(m[1], 10), parseInt(m[2], 10) - 1, parseInt(m[3], 10), 9, 0, 0);
      m = str.match(/^(\d{1,2})[/\-](\d{1,2})[/\-](\d{4})$/);
      if (m) return new Date(parseInt(m[3], 10), parseInt(m[2], 10) - 1, parseInt(m[1], 10), 9, 0, 0);
      const d = new Date(str); return isNaN(d.getTime()) ? null : d;
    };
    const _bannerArrival = _preArrivalDateDebut ? _parseArrivalForBanner(_preArrivalDateDebut) : null;
    const _bannerNow = new Date(ctx.nowTick || Date.now());
    const _bannerProfileReady = !!myCollabProfile;
    const _bannerComputedPreArrival = !!(_bannerArrival && _bannerArrival.getTime() > _bannerNow.getTime());
    // Persist the variant once the profile is loaded so future renders skip the flash.
    if (_bannerProfileReady) {
      try { localStorage.setItem(_bannerCacheKey, _bannerComputedPreArrival ? "preArrival" : "classic"); } catch {}
    }
    const _bannerCachedVariant = (() => { try { return localStorage.getItem(_bannerCacheKey); } catch { return null; } })();
    const _bannerInPreArrival = _bannerProfileReady ? _bannerComputedPreArrival : _bannerCachedVariant === "preArrival";
    const _bannerDays = _bannerArrival ? Math.max(0, Math.floor((_bannerArrival.getTime() - _bannerNow.getTime()) / 86400000)) : 0;
    const _bannerFirstName = auth.user?.name?.split(" ")[0] || "";
    const _bannerPoste = (myCollab as any)?.poste || (myCollab as any)?.metier || "";
    const _bannerArrivalLabel = _bannerArrival ? new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long" }).format(_bannerArrival) : "";
    const _bannerAccompagnants = (myCollab as any)?.accompagnants || [];
    const _bannerBuddy = _bannerAccompagnants.find((a: any) => (a.role || '').toLowerCase().includes('buddy') || (a.role || '').toLowerCase().includes('parrain')) || _bannerAccompagnants[0];
    const _bannerBuddyName = _bannerBuddy ? (_bannerBuddy.name || _bannerBuddy.nom || `${_bannerBuddy.prenom || ""} ${_bannerBuddy.nom || ""}`.trim()) : "";

    return (
    <div style={{ flex: 1 }}>
      {/* Hero banner — pre-arrival "Compte à rebours" variant when dateDebut is in the future, classic gradient otherwise */}
      {_bannerInPreArrival ? (
        <div className="iz-fade-in" style={{
          background: `linear-gradient(110deg, ${C.pinkBg} 0%, ${C.white} 60%, ${C.pinkLight} 100%)`,
          padding: "36px 40px", position: "relative", overflow: "hidden",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, minHeight: 260,
        }}>
          <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 28, flex: 1, minWidth: 0 }}>
            {/* Photo collab */}
            <div onClick={() => setShowAvatarEditor(true)} title="Modifier la photo" style={{
              width: 110, height: 110, borderRadius: "50%", flexShrink: 0,
              background: avatarImage ? "none" : "linear-gradient(135deg, #E91E8C, #E41076)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 36, fontWeight: 600, color: "#fff",
              border: `4px solid ${C.white}`, boxShadow: "0 6px 24px rgba(228,16,118,.18)",
              cursor: "pointer", overflow: "hidden", position: "relative",
            }}>
              {avatarImage ? (
                <img src={avatarImage} alt="" style={{
                  width: `${avatarZoom}%`, height: `${avatarZoom}%`, objectFit: "cover", position: "relative",
                  left: `${(50 - avatarPos.x) * (avatarZoom - 100) / 100}%`,
                  top: `${(50 - avatarPos.y) * (avatarZoom - 100) / 100}%`,
                }} />
              ) : (auth.user?.name?.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() || "?")}
            </div>
            {/* Texte */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "5px 13px", borderRadius: 999, background: C.pinkLight, marginBottom: 14 }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: C.pink }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: C.pink, letterSpacing: 1.2, textTransform: "uppercase" }}>Compte à rebours</span>
              </div>
              <h1 style={{ fontSize: 34, fontWeight: 700, color: "#1f2937", lineHeight: 1.15, margin: "0 0 10px", fontFamily: font }}>
                On vous attend, {_bannerFirstName}.
              </h1>
              <div style={{ fontSize: 14, fontStyle: "italic", color: "#52525b", marginBottom: 4 }}>
                {[_bannerPoste, _bannerArrivalLabel].filter(Boolean).join(" · ")}
              </div>
              {_bannerBuddyName && (
                <div style={{ fontSize: 14, fontStyle: "italic", color: "#52525b", marginBottom: 18, maxWidth: 560 }}>
                  {_bannerBuddyName} sera votre point de contact — il/elle a déjà préparé votre première semaine.
                </div>
              )}
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button onClick={() => setDashPage("mes_actions" as any)} className="iz-btn-pink" style={{ ...sBtn("pink"), fontSize: 13, padding: "10px 20px", display: "flex", alignItems: "center", gap: 8, borderRadius: 999 }}>
                  Voir mon programme <ArrowRight size={14} />
                </button>
                <button onClick={() => setDashPage("organigramme" as any)} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 999, padding: "10px 20px", fontSize: 13, fontWeight: 600, color: C.text, cursor: "pointer", fontFamily: font }}>
                  Présenter l'équipe
                </button>
              </div>
            </div>
          </div>
          {/* Big J-X */}
          <div style={{ position: "relative", zIndex: 1, flexShrink: 0, display: "flex", alignItems: "baseline", color: C.pink, fontFamily: '"Playfair Display", Georgia, "Times New Roman", serif', fontStyle: "italic", lineHeight: 1, paddingRight: 8 }}>
            <span style={{ fontSize: 84, fontWeight: 500 }}>J–</span>
            <span style={{ fontSize: 148, fontWeight: 600 }}>{_bannerDays}</span>
          </div>
        </div>
      ) : (
      <div ref={bannerRef} className="iz-fade-in" onMouseMove={handleBannerMouseMove} onMouseUp={() => setBannerDragging(false)} onMouseLeave={() => setBannerDragging(false)} style={{ height: 180, background: bannerImage ? `url(${bannerImage})` : bannerGradient, backgroundSize: `${bannerZoom}%`, backgroundPosition: `${bannerPos.x}% ${bannerPos.y}%`, borderRadius: 0, display: "flex", alignItems: "flex-end", padding: "0 40px 24px", position: "relative", transition: bannerDragging ? "none" : "background .4s", cursor: bannerEditMode ? (bannerDragging ? "grabbing" : "grab") : "default", userSelect: "none" as const }}>
        {/* Gradient overlay when image is set */}
        {bannerImage && <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,.1) 0%, rgba(0,0,0,.45) 100%)" }} />}
        <div style={{ display: "flex", alignItems: "center", gap: 16, position: "relative", zIndex: 2 }}>
          <div onClick={() => setShowAvatarEditor(true)} style={{ width: 56, height: 56, borderRadius: "50%", background: avatarImage ? "none" : "linear-gradient(135deg, #E91E8C, #E41076)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 600, color: "#fff", border: "3px solid #fff", cursor: "pointer", overflow: "hidden", position: "relative" }}>
            {avatarImage ? (
              <img src={avatarImage} alt="" style={{
                width: `${avatarZoom}%`, height: `${avatarZoom}%`,
                objectFit: "cover",
                position: "relative",
                left: `${(50 - avatarPos.x) * (avatarZoom - 100) / 100}%`,
                top: `${(50 - avatarPos.y) * (avatarZoom - 100) / 100}%`,
              }} />
            ) : (auth.user?.name?.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() || "?")}
            <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.0)", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0, transition: "all .2s" }} onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = "1"; (e.currentTarget as HTMLElement).style.background = "rgba(0,0,0,.4)"; }} onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = "0"; (e.currentTarget as HTMLElement).style.background = "rgba(0,0,0,.0)"; }}>
              <Upload size={16} color={C.white} />
            </div>
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 600, color: "#fff", textShadow: "0 1px 8px rgba(0,0,0,.3)" }}>{t('emp.hello')} {auth.user?.name?.split(" ")[0] || ""}</h1>
        </div>

        {/* Edit mode toolbar */}
        {bannerEditMode && (
          <div className="iz-fade-up" style={{ position: "absolute", top: 12, left: "50%", transform: "translateX(-50%)", background: C.white, borderRadius: 10, padding: "8px 16px", boxShadow: "0 4px 16px rgba(0,0,0,.2)", display: "flex", alignItems: "center", gap: 12, zIndex: 10 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: C.text }}>Repositionner l'image</span>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 10, color: C.textMuted }}>Zoom</span>
              <input type="range" min={100} max={250} value={bannerZoom} onChange={e => setBannerZoom(Number(e.target.value))} onMouseDown={() => setBannerDragging(false)} style={{ width: 80, accentColor: C.pink }} />
              <span style={{ fontSize: 10, color: C.textMuted, minWidth: 30 }}>{bannerZoom}%</span>
            </div>
            <button onMouseDown={e => { e.stopPropagation(); setBannerDragging(true); }} style={{ padding: "4px 10px", borderRadius: 6, border: `1px solid ${C.border}`, background: bannerDragging ? C.pinkBg : C.white, fontSize: 11, fontWeight: 500, cursor: "grab", fontFamily: font, color: C.text }}>Glisser</button>
            <button onClick={() => { setBannerEditMode(false); localStorage.setItem("illizeo_banner_zoom", String(bannerZoom)); localStorage.setItem("illizeo_banner_pos", JSON.stringify(bannerPos)); addToast("Position sauvegardée", "success"); }} className="iz-btn-pink" style={{ ...sBtn("pink"), padding: "4px 14px", fontSize: 11 }}>Valider</button>
            <button onClick={() => { setBannerImage(null); setBannerEditMode(false); setBannerZoom(100); setBannerPos({ x: 50, y: 50 }); localStorage.removeItem("illizeo_banner_image"); localStorage.removeItem("illizeo_banner_zoom"); localStorage.removeItem("illizeo_banner_pos"); saveMyBanner({ image: "" }).catch(() => {}); addToast("Image retirée", "warning"); }} style={{ background: "none", border: "none", cursor: "pointer", color: C.textMuted }}><X size={16} /></button>
          </div>
        )}

        {/* Customize button — hidden in edit mode */}
        {!bannerEditMode && (
        <button onClick={() => setEmployeeBannerCustom(!employeeBannerCustom)} style={{ position: "absolute", top: 16, right: 16, background: "rgba(255,255,255,.15)", border: "none", borderRadius: 8, padding: "6px 12px", cursor: "pointer", color: C.white, fontSize: 11, fontWeight: 500, fontFamily: font, display: "flex", alignItems: "center", gap: 6, backdropFilter: "blur(4px)", zIndex: 2 }}>
          <PenTool size={12} /> {t('emp.customize')}
        </button>
        )}

        {/* Customization panel — rendered at root level for proper z-index */}
        {false && employeeBannerCustom && null}
      </div>
      )}

      {/* ── Pre-arrival hero section (J-X countdown) ── */}
      {(() => {
        const dateDebut = myCollab?.dateDebut || (myCollab as any)?.date_debut;
        if (!dateDebut) return null;
        // Parse robustly: accepts "YYYY-MM-DD", "DD/MM/YYYY", "DD-MM-YYYY", or full ISO
        const parseArrival = (s: string): Date | null => {
          if (!s) return null;
          const str = String(s).trim();
          // Already a full ISO datetime?
          if (str.includes("T")) { const d = new Date(str); return isNaN(d.getTime()) ? null : d; }
          // YYYY-MM-DD (ISO date)
          let m = str.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
          if (m) return new Date(parseInt(m[1], 10), parseInt(m[2], 10) - 1, parseInt(m[3], 10), 9, 0, 0);
          // DD/MM/YYYY or DD-MM-YYYY (French)
          m = str.match(/^(\d{1,2})[/\-](\d{1,2})[/\-](\d{4})$/);
          if (m) return new Date(parseInt(m[3], 10), parseInt(m[2], 10) - 1, parseInt(m[1], 10), 9, 0, 0);
          // Fallback: native parser
          const d = new Date(str);
          return isNaN(d.getTime()) ? null : d;
        };
        const arrival = parseArrival(dateDebut);
        if (!arrival) return null;
        // Use nowTick from ctx to force re-render every second
        const now = new Date(ctx.nowTick || Date.now());
        const diffMs = arrival.getTime() - now.getTime();
        if (diffMs <= 0) return null;

        const totalSec = Math.floor(diffMs / 1000);
        const days = Math.floor(totalSec / 86400);
        const hours = Math.floor((totalSec % 86400) / 3600);
        const minutes = Math.floor((totalSec % 3600) / 60);
        const seconds = totalSec % 60;
        const firstName = auth.user?.name?.split(" ")[0] || "";

        return (
          <div style={{ padding: "24px 32px 0" }}>
            {/* Top bar: badge + J'ai hâte */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 500 }}>Avant J1 · Espace pré-arrivée</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: C.pink, fontFamily: font }}>Bienvenue {firstName} !</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <button onClick={async () => {
                  try {
                    const { apiFetch } = await import('../api/client');
                    const res: any = await apiFetch('/employee/excited', { method: 'POST' });
                    addToast(res?.message || "Votre enthousiasme a été partagé à l'équipe RH ! 🎉", "success");
                  } catch (err: any) {
                    let body: any = null;
                    try { body = err?.message ? JSON.parse(err.message) : null; } catch { body = null; }
                    if (err?.status === 429) {
                      addToast(body?.message || "Vous avez déjà partagé votre enthousiasme aujourd'hui", "info");
                    } else {
                      addToast(body?.message || "Impossible de partager pour le moment", "warning");
                    }
                  }
                }} className="iz-btn-pink" style={{ ...sBtn("pink"), display: "flex", alignItems: "center", gap: 6, fontSize: 13, padding: "8px 18px" }}>
                  J'ai hâte ! 🎉
                </button>
              </div>
            </div>

            {/* Pink hero with countdown */}
            <div className="iz-fade-up" style={{
              background: `linear-gradient(135deg, ${C.pinkLight} 0%, ${C.pinkBg} 50%, ${C.pinkLight} 100%)`,
              borderRadius: 20, padding: "40px 48px", position: "relative", overflow: "hidden", marginBottom: 24,
            }}>
              {/* Decorative circles */}
              <div style={{ position: "absolute", top: -80, right: -80, width: 320, height: 320, borderRadius: "50%", background: `${C.pink}15` }} />
              <div style={{ position: "absolute", bottom: -100, right: 120, width: 200, height: 200, borderRadius: "50%", background: `${C.pink}10` }} />

              <div style={{ position: "relative", zIndex: 1, maxWidth: 620 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.pink, letterSpacing: 1.5, marginBottom: 14, textTransform: "uppercase" }}>NOTRE ÉQUIPE VOUS ACCUEILLE</div>
                <h1 style={{ fontSize: 40, fontWeight: 700, color: C.pink, lineHeight: 1.1, marginBottom: 20, fontFamily: font }}>
                  Préparez votre arrivée<br />en toute sérénité.
                </h1>
                <p style={{ fontSize: 14, color: "#1f2937", lineHeight: 1.6, marginBottom: 24, maxWidth: 520 }}>
                  {firstName}, voici tout ce qu'il faut savoir avant le grand jour. Quelques formalités à compléter, l'équipe à rencontrer, et le programme de votre première semaine.
                </p>
                <div style={{ display: "flex", gap: 12, marginBottom: 32, flexWrap: "wrap" }}>
                  <button onClick={() => setDashPage("actions" as any)} className="iz-btn-pink" style={{ ...sBtn("pink"), fontSize: 14, padding: "12px 24px", display: "flex", alignItems: "center", gap: 8 }}>
                    Commencer les formalités <ArrowRight size={16} />
                  </button>
                  <button onClick={() => setDashPage("organigramme" as any)} style={{ background: C.white, border: "none", borderRadius: 8, padding: "12px 24px", fontSize: 14, fontWeight: 600, color: C.text, cursor: "pointer", fontFamily: font }}>
                    Découvrir l'équipe
                  </button>
                </div>

                {/* Countdown */}
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  {[
                    { value: days, label: "JOURS" },
                    { value: hours, label: "HEURES" },
                    { value: minutes, label: "MINUTES" },
                    { value: seconds, label: "SECONDES" },
                  ].map(c => (
                    <div key={c.label} style={{
                      background: C.white, borderRadius: 14, padding: "16px 20px", minWidth: 110,
                      textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,.04)",
                    }}>
                      <div style={{ fontSize: 32, fontWeight: 700, color: C.pink, lineHeight: 1, fontFamily: font }}>{String(c.value).padStart(2, "0")}</div>
                      <div style={{ fontSize: 10, fontWeight: 600, color: C.textMuted, letterSpacing: 1, marginTop: 4 }}>{c.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      <div style={{ display: "flex", gap: 24, padding: "24px 32px" }}>
        {/* Main content */}
        <div style={{ flex: 1 }}>
          {/* "Vous êtes sur les rails" card with circular progression */}
          {(() => {
            const totalActions = ACTION_TEMPLATES.length || 1;
            const totalDocs = docsTotal || 0;
            const totalRdvs = (myCollab?.accompagnants || []).length;
            const completedActionsCount = completedActions.size;
            const validatedDocs = docsValidated;
            const docsRemaining = totalDocs - validatedDocs;
            const obligatoryFormations = (ACTION_TEMPLATES.filter((a: any) => a.type === 'formation' && a.obligatoire) || []).length || 6;
            const completedFormations = (ACTION_TEMPLATES.filter((a: any) => a.type === 'formation' && a.obligatoire && completedActions.has(a.id)) || []).length;
            const radius = 36, circumference = 2 * Math.PI * radius;
            const offset = circumference - (employeeProgression / 100) * circumference;

            return (
              <>
                <div className="iz-card iz-fade-up" style={{
                  background: `linear-gradient(135deg, ${C.pinkBg} 0%, ${C.amberLight} 100%)`,
                  borderRadius: 16, padding: "24px 32px", marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24,
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: C.pink, letterSpacing: 1, marginBottom: 8, textTransform: "uppercase" }}>VOUS ÊTES SUR LES RAILS</div>
                    <h2 style={{ fontSize: 24, fontWeight: 700, color: "#1f2937", marginBottom: 6, fontFamily: font }}>
                      Vous avez complété {employeeProgression}% de votre intégration
                    </h2>
                    <p style={{ fontSize: 13, color: "#52525b", marginBottom: 16 }}>
                      {(() => { const remaining = Math.max(0, totalActions - completedActionsCount); return `${completedActionsCount} étape${completedActionsCount > 1 ? 's' : ''} validée${completedActionsCount > 1 ? 's' : ''} · ${remaining} action${remaining > 1 ? 's' : ''} restante${remaining > 1 ? 's' : ''}`; })()}
                    </p>
                    <div style={{ display: "flex", gap: 10 }}>
                      <button onClick={() => setDashPage("mes_actions" as any)} className="iz-btn-pink" style={{ ...sBtn("pink"), fontSize: 13, padding: "10px 20px" }}>
                        Continuer mon parcours →
                      </button>
                      <button onClick={() => setDashPage("suivi" as any)} style={{ background: C.white, border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 13, fontWeight: 600, color: C.text, cursor: "pointer", fontFamily: font }}>
                        Voir le programme
                      </button>
                    </div>
                  </div>
                  {/* Circular progress */}
                  <div style={{ position: "relative", width: 110, height: 110, flexShrink: 0 }}>
                    <svg width={110} height={110} style={{ transform: "rotate(-90deg)" }}>
                      <circle cx={55} cy={55} r={radius} stroke={C.white} strokeWidth={10} fill="none" />
                      <circle cx={55} cy={55} r={radius}
                        stroke={`url(#gradProg)`} strokeWidth={10} fill="none"
                        strokeDasharray={circumference} strokeDashoffset={offset}
                        strokeLinecap="round" style={{ transition: "stroke-dashoffset .8s ease" }}
                      />
                      <defs>
                        <linearGradient id="gradProg" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor={C.pink} />
                          <stop offset="100%" stopColor={C.amber} />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, fontWeight: 700, color: C.pink, fontFamily: font }}>
                      {employeeProgression}%
                    </div>
                  </div>
                </div>

                {/* 4 KPI cards */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
                  {[
                    { label: "TÂCHES J1", value: `${completedActionsCount}/${totalActions}`, sub: completedActionsCount === totalActions ? "Toutes terminées" : `${totalActions - completedActionsCount} restantes`, color: completedActionsCount === totalActions ? C.green : C.pink, icon: ListChecks },
                    { label: "FORMATIONS OBL.", value: `${completedFormations}/${obligatoryFormations}`, sub: obligatoryFormations - completedFormations > 0 ? `${obligatoryFormations - completedFormations} à faire` : "Toutes terminées", color: C.pink, icon: GraduationCap },
                    { label: "RDV INTÉGRATION", value: String(totalRdvs || 0), sub: totalRdvs > 0 ? "Prochain à venir" : "Aucun planifié", color: C.purple, icon: Calendar },
                    { label: "DOCUMENTS", value: `${validatedDocs}/${totalDocs}`, sub: docsRemaining > 0 ? `${docsRemaining} à signer` : "Tous signés", color: docsRemaining > 0 ? C.amber : C.green, icon: FileText },
                  ].map(kpi => {
                    const Icon = kpi.icon;
                    return (
                      <div key={kpi.label} className="iz-card" style={{ ...sCard, padding: "16px 18px" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                          <span style={{ fontSize: 9, fontWeight: 700, color: C.textMuted, letterSpacing: 1 }}>{kpi.label}</span>
                          <Icon size={14} color={kpi.color} />
                        </div>
                        <div style={{ fontSize: 28, fontWeight: 700, color: kpi.color, lineHeight: 1, fontFamily: font }}>{kpi.value}</div>
                        <div style={{ fontSize: 11, color: C.textMuted, marginTop: 4 }}>{kpi.sub}</div>
                      </div>
                    );
                  })}
                </div>
              </>
            );
          })()}

          {/* Gamification card */}
          {(() => {
            // Prefer server-computed XP (cumulative from actions/badges/quiz, same formula
            // as other cohort members) so my row matches the leaderboard. Fall back to a
            // local estimate when the leaderboard hasn't loaded yet.
            const xpFromActions = completedActions.size * 50;
            const quizBlockLocal = (companyBlocks || []).find((b: any) => b.type === "culture_quiz" && b.actif);
            const QUIZ_QS = (quizBlockLocal?.data?.questions && quizBlockLocal.data.questions.length > 0) ? quizBlockLocal.data.questions : null;
            const QUIZ_XP_PER = quizBlockLocal?.data?.xp_per_correct ?? 10;
            const xpFromQuiz = (() => {
              if (!cultureQuizState || !QUIZ_QS) return 0;
              return Object.entries(cultureQuizState.answers || {}).filter(([qi, ans]) => QUIZ_QS[parseInt(qi, 10)]?.correct === ans).length * QUIZ_XP_PER;
            })();
            const xpFromCheckin = ((ctx as any)._checkinJ7?.submitted ? 30 : 0);
            const localXP = xpFromActions + xpFromQuiz + xpFromCheckin;
            const totalXP = leaderboardData?.my_xp ?? localXP;
            const LEVELS = [
              { name: "Explorateur", min: 0, max: 200, color: "#9C27B0", icon: Rocket },
              { name: "Découvreur", min: 200, max: 500, color: "#1A73E8", icon: Sparkles },
              { name: "Acclimaté", min: 500, max: 900, color: "#00897B", icon: Heart },
              { name: "Autonome", min: 900, max: 1400, color: "#F9A825", icon: Award },
              { name: "Pionnier(ère)", min: 1400, max: 9999, color: "#E91E8C", icon: Trophy },
            ];
            const lvl = [...LEVELS].reverse().find(l => totalXP >= l.min) || LEVELS[0];
            const lvlIdx = LEVELS.indexOf(lvl);
            const lvlPct = lvl.max < 9999 ? Math.min(100, ((totalXP - lvl.min) / (lvl.max - lvl.min)) * 100) : 100;
            const LvlIcon = lvl.icon;
            const allQuestsBlocks = (companyBlocks || []).filter((b: any) => b.type === "gamification_quests");
            const questsBlock = allQuestsBlocks.find((b: any) => b.actif);
            const hasDisabledQuestsBlock = allQuestsBlocks.length > 0 && !questsBlock;
            const tenantId = localStorage.getItem("illizeo_tenant_id") || "";
            const isDemoTenantQuests = tenantId === "illizeo" || tenantId === "illizeo2";
            const inferIcon = (title: string) => {
              const t = (title || "").toLowerCase();
              if (t.includes("action") || t.includes("checklist") || t.includes("tâche")) return ListChecks;
              if (t.includes("quiz") || t.includes("culture")) return BookMarked;
              if (t.includes("check-in") || t.includes("ressenti") || t.includes("émo")) return Heart;
              if (t.includes("bureau") || t.includes("lieu") || t.includes("salle") || t.includes("tour")) return MapPin;
              if (t.includes("collègue") || t.includes("équipe") || t.includes("rencontr")) return Users;
              if (t.includes("formation")) return GraduationCap;
              if (t.includes("doc")) return FileText;
              return Target;
            };
            const inferDone = (title: string) => {
              const t = (title || "").toLowerCase();
              if (t.includes("action") && t.match(/(\d+)/)) {
                const n = parseInt(t.match(/(\d+)/)![1], 10);
                return completedActions.size >= n;
              }
              if (t.includes("quiz")) return xpFromQuiz > 0;
              if (t.includes("lieu") || t.includes("bureau")) {
                const m = t.match(/(\d+)/);
                const n = m ? parseInt(m[1], 10) : 5;
                return ((ctx as any)._officeTour?.visited || []).length >= n;
              }
              return false;
            };
            const QUESTS_FALLBACK = [
              { id: "q1", icon: ListChecks, title: "Compléter 3 actions urgentes", reward: 60, done: completedActions.size >= 3 },
              { id: "q2", icon: BookMarked, title: "Quiz culture : 4/5 bonnes réponses", reward: 40, done: xpFromQuiz >= 40 },
              { id: "q4", icon: Users, title: "Rencontrer 3 collègues hors équipe", reward: 50, done: false },
              { id: "q5", icon: MapPin, title: "Découvrir 5 lieux du bureau", reward: 40, done: ((ctx as any)._officeTour?.visited || []).length >= 5 },
            ];
            const adminQuests = questsBlock?.data?.quests || [];
            const QUESTS = adminQuests.length > 0
              ? adminQuests.map((q: any, i: number) => ({
                  id: `cfg_${i}`,
                  icon: inferIcon(q.title),
                  title: q.title,
                  reward: q.reward ?? 50,
                  done: inferDone(q.title),
                }))
              : (hasDisabledQuestsBlock ? [] : (isDemoTenantQuests ? QUESTS_FALLBACK : []));
            // Real cohort = peers in the same parcours, fetched from /me/leaderboard.
            // While the request is in flight, fall back to a single-row "Vous" so the
            // card still renders without flashing fake names.
            const COHORT = (leaderboardData?.cohort && leaderboardData.cohort.length > 0)
              ? leaderboardData.cohort.map((r: any) => ({ name: r.is_me ? "Vous" : r.name, initials: r.initials || "?", color: r.is_me ? lvl.color : r.color, xp: r.xp, isMe: r.is_me }))
              : [{ name: "Vous", initials: (auth.user?.name || "Vous").split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase(), color: lvl.color, xp: totalXP, isMe: true }];
            const myRank = leaderboardData?.my_rank ?? (COHORT.findIndex(c => (c as any).isMe) + 1);
            const cohortLoading = !leaderboardData;
            return (
              <div className="iz-card iz-fade-up" style={{ ...sCard, marginTop: 24, padding: 0, overflow: "hidden", border: `2px solid ${lvl.color}33` }}>
                {/* Header */}
                <div style={{ padding: "20px 24px", background: `linear-gradient(135deg, ${lvl.color}E6, ${lvl.color}CC)`, color: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(255,255,255,.2)", border: "3px solid rgba(255,255,255,.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <LvlIcon size={26} color="#fff" />
                    </div>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, opacity: 0.9 }}>NIVEAU {lvlIdx + 1} / {LEVELS.length}</div>
                      <div style={{ fontSize: 22, fontWeight: 700, marginTop: 2 }}>{lvl.name}</div>
                      <div style={{ fontSize: 12, opacity: 0.85, marginTop: 2 }}>{totalXP} XP · classé #{myRank} dans votre cohorte</div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 11, opacity: 0.85 }}>Prochain niveau</div>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>{lvl.max < 9999 ? LEVELS[lvlIdx + 1]?.name : "Niveau max"}</div>
                    <div style={{ fontSize: 11, opacity: 0.85, marginTop: 2 }}>{lvl.max < 9999 ? `${lvl.max - totalXP} XP restants` : "🎉"}</div>
                  </div>
                </div>
                {/* Progress bar */}
                <div style={{ height: 8, background: C.bg }}>
                  <div style={{ height: "100%", width: `${lvlPct}%`, background: `linear-gradient(90deg, ${lvl.color}, ${lvl.color}CC)`, transition: "width .6s ease" }} />
                </div>
                {/* Body */}
                <div style={{ padding: "20px 24px", display: "grid", gridTemplateColumns: QUESTS.length === 0 ? "1fr" : "1.4fr 1fr", gap: 24 }}>
                  {/* Quests */}
                  {QUESTS.length > 0 && (
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, letterSpacing: 1, marginBottom: 12 }}>QUÊTES DU MOMENT</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {QUESTS.map(q => {
                        const QIcon = q.icon;
                        return (
                          <div key={q.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 10, border: `1px solid ${q.done ? C.green : C.border}`, background: q.done ? C.greenLight : C.white }}>
                            <div style={{ width: 32, height: 32, borderRadius: 8, background: q.done ? C.green : lvl.color + "22", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                              {q.done ? <Check size={16} color="#fff" /> : <QIcon size={15} color={lvl.color} />}
                            </div>
                            <div style={{ flex: 1, fontSize: 13, fontWeight: q.done ? 500 : 600, color: q.done ? C.textLight : C.text, textDecoration: q.done ? "line-through" : "none" }}>{q.title}</div>
                            <div style={{ padding: "3px 10px", borderRadius: 12, background: q.done ? C.green : lvl.color, color: "#fff", fontSize: 11, fontWeight: 700 }}>+{q.reward} XP</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  )}
                  {/* Leaderboard */}
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, letterSpacing: 1, marginBottom: 12 }}>CLASSEMENT COHORTE</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {COHORT.map((c, i) => {
                        const isMe = (c as any).isMe;
                        const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : "";
                        return (
                          <div key={`${c.name}-${i}`} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", borderRadius: 8, background: isMe ? C.pinkBg : "transparent", border: isMe ? `1px solid ${C.pink}` : "1px solid transparent" }}>
                            <div style={{ width: 24, fontSize: 12, fontWeight: 700, color: C.textMuted, textAlign: "center" }}>{medal || `#${i + 1}`}</div>
                            <div style={{ width: 28, height: 28, borderRadius: "50%", background: c.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff", flexShrink: 0 }}>{c.initials}</div>
                            <div style={{ flex: 1, fontSize: 12, fontWeight: isMe ? 700 : 500, color: isMe ? C.pink : C.text }}>{c.name}</div>
                            <div style={{ fontSize: 11, fontWeight: 700, color: isMe ? C.pink : C.textLight }}>{c.xp} XP</div>
                          </div>
                        );
                      })}
                      {!cohortLoading && COHORT.length === 1 && (
                        <div style={{ fontSize: 11, color: C.textMuted, fontStyle: "italic", padding: "8px 12px", marginTop: 4 }}>
                          Vous êtes seul(e) dans votre cohorte pour le moment. D'autres collaborateurs apparaîtront ici lorsqu'ils rejoindront le même parcours.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Actions — Timeline (V1) + Calendrier (V7) views */}
          {(() => {
            // Parse "J+5" / "J-25" / "J+0" → numeric day offset relative to today
            const parseDayOffset = (s: any): number => {
              if (typeof s !== "string") return 0;
              const m = s.match(/^J([+\-]?\d+)$/i);
              return m ? parseInt(m[1], 10) : 0;
            };
            // Compute current day J from date_debut (today = J+1 on first day)
            const dateDebutStr = (myCollab as any)?.dateDebut || (myCollab as any)?.date_debut || "";
            const startDate = dateDebutStr ? (() => {
              const parts = dateDebutStr.includes("/") ? dateDebutStr.split("/") : dateDebutStr.split("-");
              if (parts.length === 3) {
                const [a, b, c] = parts.map((p: string) => parseInt(p, 10));
                return dateDebutStr.includes("/") ? new Date(c, b - 1, a) : new Date(a, b - 1, c);
              }
              return new Date();
            })() : new Date();
            const today = new Date(); today.setHours(0, 0, 0, 0);
            const dayJ = Math.max(0, Math.floor((today.getTime() - startDate.getTime()) / (86400000)));

            // Enrich actions with computed offset relative to TODAY (negative = past/late, 0 = today, positive = upcoming)
            // The action's `date` is "J+X" relative to date_debut → offset_today = X - dayJ
            const enrichedActions = EMPLOYEE_ACTIONS.map((a: any, i: number) => {
              const targetDayJ = parseDayOffset(a.date);
              const offsetToday = targetDayJ - dayJ;
              return { ...a, _targetDayJ: targetDayJ, _offsetToday: offsetToday, _idx: i };
            });
            const totalSteps = enrichedActions.length;
            const doneCount = enrichedActions.filter((a: any) => completedActions.has(a.id)).length;
            const progressPct = totalSteps > 0 ? Math.round((doneCount / totalSteps) * 100) : 0;
            // Smart priority order for the default focus action:
            // 1. Late & required first (most urgent)
            // 2. Then today's required
            // 3. Then late optional
            // 4. Then today's optional
            // 5. Then upcoming required, then upcoming optional
            // Within each bucket, higher XP wins (= more strategic action)
            const priorityScore = (a: any) => {
              if (completedActions.has(a.id)) return 9999; // sink completed
              const obli = a.obligatoire ? 0 : 1;
              let bucket = 4; // upcoming
              if (a._offsetToday < 0) bucket = 0; // late
              else if (a._offsetToday === 0) bucket = 2; // today
              return bucket + obli; // 0..5 ascending
            };
            const sortedForFocus = [...enrichedActions].sort((a: any, b: any) => {
              const sa = priorityScore(a), sb = priorityScore(b);
              if (sa !== sb) return sa - sb;
              const xa = a.xp ?? 50, xb = b.xp ?? 50;
              if (xa !== xb) return xb - xa;
              return a._offsetToday - b._offsetToday;
            });
            // Focus action: explicit selection (clicked dot) wins, otherwise top of priority sort
            const focusAction = (dashboardFocusActionId
              ? enrichedActions.find((a: any) => a.id === dashboardFocusActionId)
              : null) || sortedForFocus.find((a: any) => !completedActions.has(a.id)) || sortedForFocus[0];

            const statusColor = (offset: number, done: boolean) => {
              if (done) return C.green;
              if (offset < 0) return C.red;
              if (offset === 0) return "#7B5EA7";
              return C.border;
            };

            // ─── MOBILE: Focus du jour + list ───────────────────
            if (isMobile) {
              return (
                <div style={{ marginTop: 24 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 600, color: C.text, margin: "0 0 6px" }}>{t('emp.next_actions')}</h3>
                  <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 12 }}>Jour {dayJ} chez {(myCollab as any)?.entreprise_nom || "vous"} · {doneCount}/{totalSteps} étapes</div>
                  <div style={{ height: 6, borderRadius: 3, background: C.bg, overflow: "hidden", marginBottom: 16 }}>
                    <div style={{ height: "100%", width: `${progressPct}%`, background: `linear-gradient(90deg, ${C.pink}, #7B5EA7)`, borderRadius: 3 }} />
                  </div>
                  {focusAction && (
                    <div className="iz-card" style={{ ...sCard, marginBottom: 16, background: C.pinkBg, border: `1px solid ${C.pink}33` }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: C.pink, textTransform: "uppercase", letterSpacing: .5, marginBottom: 6, display: "inline-flex", alignItems: "center", gap: 4 }}>
                        <Target size={11} /> Focus du jour
                      </div>
                      <h4 style={{ fontSize: 16, fontWeight: 600, margin: "0 0 6px", color: C.text }}>{focusAction.title}</h4>
                      {focusAction.subtitle && <p style={{ fontSize: 12, color: C.textLight, margin: "0 0 8px" }}>{focusAction.subtitle}</p>}
                      {focusAction.accompagnant?.name && (
                        <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 10, display: "inline-flex", alignItems: "center", gap: 4 }}>
                          <UserCheck size={11} /> Avec <b style={{ color: C.text, marginLeft: 2 }}>{focusAction.accompagnant.name}</b>
                          <span>· {focusAction.accompagnant.role}</span>
                        </div>
                      )}
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          {focusAction.duree_estimee && <span style={{ fontSize: 11, color: C.textMuted, display: "inline-flex", alignItems: "center", gap: 3 }}><Clock size={11} /> {focusAction.duree_estimee}</span>}
                          <span style={{ padding: "3px 10px", borderRadius: 12, background: "#7B5EA7", color: "#fff", fontSize: 11, fontWeight: 700 }}>+{focusAction.xp ?? 50} XP</span>
                        </div>
                        <button onClick={() => { if (focusAction.assignment_id) handleCompleteAction(focusAction.id, focusAction.assignment_id); else handleCompleteAction(focusAction.id); }}
                          className="iz-btn-pink" style={{ ...sBtn("pink"), fontSize: 13, padding: "8px 18px" }}>Démarrer</button>
                      </div>
                    </div>
                  )}
                  <div style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, textTransform: "uppercase", letterSpacing: .5, marginBottom: 8 }}>Ensuite cette semaine</div>
                  {enrichedActions.filter((a: any) => !completedActions.has(a.id) && a !== focusAction).slice(0, 8).map((a: any, i: number) => (
                    <div key={a.id} className="iz-card" onClick={() => setShowActionDetail(a.id)}
                      style={{ ...sCard, marginBottom: 8, padding: "12px 14px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
                      <div style={{ width: 36, height: 36, borderRadius: 8, background: a.iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <FileText size={16} color={a.iconColor} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.title}</div>
                        <div style={{ fontSize: 11, color: a._offsetToday < 0 ? C.red : C.textMuted, fontWeight: a._offsetToday < 0 ? 600 : 400 }}>
                          {a._offsetToday < 0 ? `En retard (J${a.date})` : a._offsetToday === 0 ? "Aujourd'hui" : a.date}
                        </div>
                      </div>
                      <span style={{ padding: "3px 8px", borderRadius: 10, background: "#7B5EA722", color: "#7B5EA7", fontSize: 10, fontWeight: 700, flexShrink: 0 }}>+50 XP</span>
                    </div>
                  ))}
                </div>
              );
            }

            // ─── DESKTOP: header + tabs + selected view ─────────
            return (
              <div style={{ marginTop: 24 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
                  <div>
                    <h3 style={{ fontSize: 18, fontWeight: 600, color: C.text, margin: 0 }}>{t('emp.next_actions')}</h3>
                    <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>{doneCount} / {totalSteps} étapes · {(myCollab as any)?.parcours_nom || ""}</div>
                  </div>
                  <div style={{ display: "flex", gap: 4, padding: 3, background: C.bg, borderRadius: 10 }}>
                    {(["timeline", "calendar"] as const).map(v => {
                      const Icon = v === "timeline" ? CalendarClock : CalendarDays;
                      return (
                        <button key={v} onClick={() => setDashboardActionsView(v)} style={{
                          padding: "7px 14px", borderRadius: 7, fontSize: 12, fontWeight: dashboardActionsView === v ? 600 : 400,
                          border: "none", cursor: "pointer", fontFamily: font,
                          background: dashboardActionsView === v ? C.white : "transparent",
                          color: dashboardActionsView === v ? C.pink : C.textMuted,
                          boxShadow: dashboardActionsView === v ? "0 1px 3px rgba(0,0,0,.06)" : "none",
                          display: "inline-flex", alignItems: "center", gap: 6,
                        }}><Icon size={13} /> {v === "timeline" ? "Timeline" : "Calendrier"}</button>
                      );
                    })}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="iz-card" style={{ ...sCard, marginBottom: 16, padding: "16px 20px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{doneCount} / {totalSteps} étapes</div>
                    <div style={{ fontSize: 12, color: C.textMuted }}>{progressPct}%</div>
                  </div>
                  <div style={{ height: 8, borderRadius: 4, background: C.bg, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${progressPct}%`, background: `linear-gradient(90deg, ${C.pink}, #7B5EA7)`, borderRadius: 4, transition: "width .4s" }} />
                  </div>
                </div>

                {dashboardActionsView === "timeline" && (() => {
                  // Build 8 day markers around today: -25,-20,-15,-10,0,+7,+14,+21
                  const markers = [-25, -20, -15, -10, 0, 7, 14, 21];
                  const minOffset = -25, maxOffset = 21, range = maxOffset - minOffset;
                  return (
                    <div className="iz-card" style={{ ...sCard, padding: "28px 28px 32px" }}>
                      {/* Day axis — clean geometry: line passes through dot centers,
                          labels sit clearly below, action dots on a separate row underneath */}
                      <div style={{ position: "relative", marginBottom: 24, paddingTop: 4 }}>
                        {/* Line — vertically centered on the 12px dots (their center = top 4 + 6 = 10) */}
                        <div style={{ position: "absolute", left: "6%", right: "6%", top: 9, height: 3, background: `linear-gradient(90deg, ${C.pink} 0%, ${C.pink} ${((0 - minOffset) / range) * 100}%, ${C.border} ${((0 - minOffset) / range) * 100}%, ${C.border} 100%)`, borderRadius: 2, zIndex: 0 }} />
                        {/* Day markers (dots + labels) */}
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "0 4%", position: "relative", zIndex: 2 }}>
                          {markers.map(off => {
                            const isToday = off === 0;
                            const passed = off < 0;
                            return (
                              <div key={off} style={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
                                <div style={{
                                  width: isToday ? 18 : 12, height: isToday ? 18 : 12, borderRadius: "50%",
                                  background: isToday ? "#7B5EA7" : passed ? C.pink : C.border,
                                  border: isToday ? `4px solid ${C.white}` : `2px solid ${C.white}`,
                                  boxShadow: isToday ? `0 0 0 3px #7B5EA755` : "none",
                                  marginTop: isToday ? -3 : 0,
                                }} />
                                <div style={{ marginTop: 18, fontSize: 11, fontWeight: isToday ? 700 : 500, color: isToday ? "#7B5EA7" : passed ? C.pink : C.textMuted, whiteSpace: "nowrap" }}>
                                  {isToday ? "Aujourd'hui" : off > 0 ? `J+${off}` : `J${off}`}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        {/* Action dots overlay — clicking a dot focuses that action in the card below */}
                        <div style={{ marginTop: 12, height: 12, position: "relative", padding: "0 6%" }}>
                          {enrichedActions.filter((a: any) => a._offsetToday >= minOffset && a._offsetToday <= maxOffset).map((a: any) => {
                            const pct = ((a._offsetToday - minOffset) / range) * 100;
                            const done = completedActions.has(a.id);
                            const isFocus = focusAction?.id === a.id;
                            return (
                              <div key={a.id} title={a.title}
                                onClick={() => setDashboardFocusActionId(a.id)}
                                style={{
                                  position: "absolute", left: `calc(6% + ${pct}% * 0.88)`, top: 0, transform: "translateX(-50%)",
                                  width: isFocus ? 12 : 8, height: isFocus ? 12 : 8, borderRadius: "50%",
                                  background: statusColor(a._offsetToday, done), cursor: "pointer",
                                  border: `2px solid ${C.white}`,
                                  boxShadow: isFocus ? `0 0 0 2px ${statusColor(a._offsetToday, done)}66` : "none",
                                  transition: "all .15s",
                                }} />
                            );
                          })}
                        </div>
                      </div>

                      {/* Focus action card — click title to open detail; selectable via dots above */}
                      {focusAction && (
                        <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 18px", border: `1px solid ${dashboardFocusActionId ? "#7B5EA7" : C.border}`, borderRadius: 12, background: C.white, transition: "border-color .15s" }}>
                          <div style={{ width: 40, height: 40, borderRadius: 10, background: focusAction.iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <FileText size={18} color={focusAction.iconColor} />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                              <span style={{ padding: "2px 10px", borderRadius: 10, background: C.amberLight, color: C.amber, fontSize: 11, fontWeight: 600 }}>{focusAction.badge}</span>
                              <span style={{ fontSize: 11, color: C.textMuted, display: "inline-flex", alignItems: "center", gap: 3 }}>
                                <Clock size={11} /> {focusAction.duree_estimee || "—"} · {focusAction._offsetToday === 0 ? "Aujourd'hui" : focusAction._offsetToday < 0 ? `En retard (J${focusAction.date})` : focusAction.date}
                              </span>
                              <span style={{ padding: "2px 10px", borderRadius: 10, background: "#7B5EA722", color: "#7B5EA7", fontSize: 11, fontWeight: 700 }}>+{focusAction.xp ?? 50} XP</span>
                              {dashboardFocusActionId && (
                                <button onClick={() => setDashboardFocusActionId(null)}
                                  style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: C.pink, fontSize: 11, fontWeight: 600, padding: "2px 6px", borderRadius: 4, fontFamily: font }}>
                                  ↺ Focus auto
                                </button>
                              )}
                            </div>
                            <div onClick={() => setShowActionDetail(focusAction.id)} style={{ fontSize: 14, fontWeight: 600, color: C.text, cursor: "pointer" }}>{focusAction.title}</div>
                            {focusAction.subtitle && <div style={{ fontSize: 12, color: C.textLight, marginTop: 2 }}>{focusAction.subtitle}</div>}
                            {focusAction.accompagnant?.name && (
                              <div style={{ fontSize: 11, color: C.textMuted, marginTop: 4, display: "inline-flex", alignItems: "center", gap: 4 }}>
                                <UserCheck size={11} /> Avec <b style={{ color: C.text, marginLeft: 2 }}>{focusAction.accompagnant.name}</b> <span>· {focusAction.accompagnant.role}</span>
                              </div>
                            )}
                          </div>
                          <button onClick={() => { if (focusAction.assignment_id) handleCompleteAction(focusAction.id, focusAction.assignment_id); else handleCompleteAction(focusAction.id); }}
                            style={{ padding: "10px 22px", borderRadius: 10, background: "#1A1A2E", color: "#fff", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: font, flexShrink: 0 }}>
                            Compléter
                          </button>
                        </div>
                      )}

                      {/* Legend */}
                      <div style={{ display: "flex", gap: 20, marginTop: 18, fontSize: 11, color: C.textMuted }}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><span style={{ width: 8, height: 8, borderRadius: "50%", background: C.red }} /> En retard</span>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><span style={{ width: 8, height: 8, borderRadius: "50%", background: "#7B5EA7" }} /> Aujourd'hui</span>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><span style={{ width: 8, height: 8, borderRadius: "50%", background: C.border }} /> À venir</span>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><span style={{ width: 8, height: 8, borderRadius: "50%", background: C.green }} /> Terminé</span>
                      </div>
                    </div>
                  );
                })()}

                {dashboardActionsView === "calendar" && (() => {
                  // Build the displayed week (Mon-Fri), shifted by calendarWeekOffset
                  const dow = (today.getDay() + 6) % 7; // 0 = Mon, 6 = Sun
                  const weekStart = new Date(today);
                  weekStart.setDate(today.getDate() - dow + (calendarWeekOffset * 7));
                  const days = Array.from({ length: 5 }, (_, i) => { const d = new Date(weekStart); d.setDate(weekStart.getDate() + i); return d; });
                  const dayLabels = ["LUN", "MAR", "MER", "JEU", "VEN"];
                  // Human label for the displayed week (e.g. "27 oct - 31 oct" or "Cette semaine")
                  const weekRangeLabel = (() => {
                    if (calendarWeekOffset === 0) return "Cette semaine";
                    if (calendarWeekOffset === -1) return "Semaine précédente";
                    if (calendarWeekOffset === 1) return "Semaine prochaine";
                    const fmt = (d: Date) => d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
                    return `${fmt(days[0])} → ${fmt(days[4])}`;
                  })();
                  // Each action is placed at: day = today + offsetToday, hour = 9 + (idx % 8)
                  const placed: { dayIdx: number; hour: number; action: any }[] = [];
                  const unscheduled: any[] = [];
                  enrichedActions.forEach((a: any) => {
                    if (completedActions.has(a.id)) return;
                    const targetDay = new Date(today); targetDay.setDate(today.getDate() + a._offsetToday);
                    const dayIdx = days.findIndex(d => d.toDateString() === targetDay.toDateString());
                    if (dayIdx === -1) { unscheduled.push(a); return; }
                    const hour = 9 + (a._idx % 8);
                    placed.push({ dayIdx, hour, action: a });
                  });
                  const hours = [9, 10, 11, 12, 13, 14, 15, 16, 17];
                  return (
                    <div className="iz-card" style={{ ...sCard, padding: 0, overflow: "hidden" }}>
                      {/* Week navigation toolbar */}
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: `1px solid ${C.border}`, background: C.bg }}>
                        <button onClick={() => setCalendarWeekOffset(calendarWeekOffset - 1)}
                          className="iz-btn-outline"
                          style={{ ...sBtn("outline"), padding: "6px 10px", fontSize: 12, display: "inline-flex", alignItems: "center", gap: 4 }}>
                          <ChevronLeft size={14} /> Précédente
                        </button>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{weekRangeLabel}</span>
                          {calendarWeekOffset !== 0 && (
                            <button onClick={() => setCalendarWeekOffset(0)}
                              style={{ background: "none", border: "none", cursor: "pointer", color: C.pink, fontSize: 11, fontWeight: 600, fontFamily: font, padding: "4px 8px", borderRadius: 6 }}>
                              Aujourd'hui
                            </button>
                          )}
                        </div>
                        <button onClick={() => setCalendarWeekOffset(calendarWeekOffset + 1)}
                          className="iz-btn-outline"
                          style={{ ...sBtn("outline"), padding: "6px 10px", fontSize: 12, display: "inline-flex", alignItems: "center", gap: 4 }}>
                          Suivante <ChevronRight size={14} />
                        </button>
                      </div>
                      {/* Day header */}
                      <div style={{ display: "grid", gridTemplateColumns: "60px repeat(5, 1fr)", borderBottom: `1px solid ${C.border}` }}>
                        <div />
                        {days.map((d, i) => {
                          const isToday = d.toDateString() === today.toDateString();
                          return (
                            <div key={i} style={{ padding: "12px 8px", textAlign: "center", borderLeft: `1px solid ${C.border}`, background: isToday ? C.pinkBg : "transparent" }}>
                              <div style={{ fontSize: 10, fontWeight: 600, color: isToday ? C.pink : C.textMuted, letterSpacing: .5 }}>{dayLabels[i]}</div>
                              <div style={{ fontSize: 18, fontWeight: 700, color: isToday ? C.pink : C.text, marginTop: 2 }}>{d.getDate()}</div>
                              {isToday && <div style={{ fontSize: 9, color: C.pink, fontWeight: 600, letterSpacing: .5 }}>AUJOURD'HUI</div>}
                            </div>
                          );
                        })}
                      </div>
                      {/* Hour rows */}
                      {hours.map(h => (
                        <div key={h} style={{ display: "grid", gridTemplateColumns: "60px repeat(5, 1fr)", borderBottom: `1px solid ${C.border}`, minHeight: 56 }}>
                          <div style={{ padding: "8px 10px", fontSize: 11, color: C.textMuted, textAlign: "right" }}>{h}:00</div>
                          {days.map((_, di) => {
                            const cell = placed.find(p => p.dayIdx === di && p.hour === h);
                            return (
                              <div key={di} style={{ borderLeft: `1px solid ${C.border}`, padding: 4, position: "relative" }}>
                                {cell && (
                                  <div onClick={() => setShowActionDetail(cell.action.id)}
                                    style={{ background: cell.action.iconBg, borderLeft: `3px solid ${cell.action.iconColor}`, padding: "6px 8px", borderRadius: 6, cursor: "pointer", height: "100%" }}
                                    title={cell.action.title}>
                                    <div style={{ fontSize: 11, fontWeight: 600, color: C.text, lineHeight: 1.3, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as any }}>{cell.action.title}</div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ))}
                      {/* Unscheduled (outside this week) */}
                      {unscheduled.length > 0 && (
                        <div style={{ padding: "16px 20px", background: C.bg, borderTop: `1px solid ${C.border}` }}>
                          <div style={{ fontSize: 10, fontWeight: 700, color: C.textMuted, letterSpacing: .5, marginBottom: 10 }}>À CASER QUAND TU PEUX</div>
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 8 }}>
                            {unscheduled.slice(0, 6).map((a: any) => (
                              <div key={a.id} onClick={() => setShowActionDetail(a.id)}
                                style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", border: `1px dashed ${C.border}`, borderRadius: 8, cursor: "pointer", background: C.white }}>
                                <div style={{ width: 26, height: 26, borderRadius: 6, background: a.iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                  <FileText size={13} color={a.iconColor} />
                                </div>
                                <div style={{ fontSize: 11, fontWeight: 500, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.title}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            );
          })()}
          {/* Video section — from company blocks with dashboard_featured flag */}
          {(() => {
            const videoBlock = (companyBlocks || []).find((b: any) => b.type === "video" && b.actif);
            const videos = videoBlock?.data?.videos || [];
            const featured = videos.find((v: any) => v.dashboard_featured) || videos[0];
            if (!featured?.youtube_id) return null;
            return (
              <div style={{ ...sCard, marginTop: 24, padding: 0, overflow: "hidden" }}>
                <div style={{ width: "100%", aspectRatio: "16/9" }}>
                  <iframe src={`https://www.youtube.com/embed/${featured.youtube_id}`} title={featured.title || ""} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen style={{ width: "100%", height: "100%", border: "none" }} />
                </div>
                {featured.title && <div style={{ padding: "10px 16px", fontSize: 13, fontWeight: 500 }}>{featured.title}</div>}
              </div>
            );
          })()}
          {/* See all actions link */}
          <div style={{ ...sCard, marginTop: 16, display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => setDashPage("mes_actions")}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: C.greenLight, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Plus size={16} color={C.green} />
            </div>
            <span style={{ fontSize: 14, fontWeight: 500, color: C.text }}>{t('emp.see_all_actions')}</span>
          </div>
        </div>
        {/* Right sidebar */}
        <div style={{ width: 320, flexShrink: 0 }}>
          {/* Arrival info card */}
          {myCollab && (
            <div className="iz-card iz-fade-up" style={{ ...sCard, marginBottom: 16 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: C.text, margin: "0 0 4px" }}>{t('emp.arrival_info') || "Les informations pour mon arrivée"}</h3>
              <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 14 }}>{t('emp.arrival_subtitle')}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: `1px solid ${C.border}` }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: C.blueLight, display: "flex", alignItems: "center", justifyContent: "center" }}><Calendar size={16} color={C.blue} /></div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: C.text }}>Date</div>
                  <div style={{ fontSize: 11, color: C.textMuted }}>{myCollab.dateDebut ? `Rendez-vous le ${myCollab.dateDebut}` : "À définir"}</div>
                </div>
              </div>
              {myCollab.site && (
                <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0" }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: C.redLight, display: "flex", alignItems: "center", justifyContent: "center" }}><MapPin size={16} color={C.red} /></div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: C.text }}>Bureau</div>
                    <div style={{ fontSize: 11, color: C.textMuted }}>{myCollab.site}</div>
                  </div>
                </div>
              )}
            </div>
          )}
          {/* Buddy card — highlighted */}
          {(() => {
            const accompagnants = (myCollab as any)?.accompagnants || [];
            const buddy = accompagnants.find((a: any) => (a.role || '').toLowerCase().includes('buddy') || (a.role || '').toLowerCase().includes('parrain')) || accompagnants[0];
            if (!buddy) return null;
            const buddyName = buddy.name || buddy.nom || `${buddy.prenom || ""} ${buddy.nom || ""}`.trim();
            const buddyInitials = buddyName.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();
            return (
              <div className="iz-card iz-fade-up" style={{
                background: `linear-gradient(135deg, ${C.pinkBg} 0%, ${C.pinkLight} 100%)`,
                borderRadius: 14, padding: "16px 18px", marginBottom: 16,
              }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: C.pink, letterSpacing: 1, marginBottom: 10, textTransform: "uppercase" }}>VOTRE BUDDY DISPONIBLE</div>
                {(() => {
                  const presence = presenceLabel(buddy.last_seen_at);
                  return (
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                      <div style={{ position: "relative", flexShrink: 0 }}>
                        <div style={{ width: 44, height: 44, borderRadius: "50%", background: buddy.couleur || C.green, display: "flex", alignItems: "center", justifyContent: "center", color: C.white, fontWeight: 700, fontSize: 14 }}>{buddyInitials}</div>
                        <div style={{ position: "absolute", bottom: 0, right: 0, width: 12, height: 12, borderRadius: "50%", background: presence.dotColor, border: `2px solid ${C.white}` }} />
                      </div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{buddyName}</div>
                        <div style={{ fontSize: 11, color: presence.color, display: "flex", alignItems: "center", gap: 4 }}>
                          <span style={{ width: 6, height: 6, borderRadius: "50%", background: presence.dotColor, display: "inline-block" }} />
                          {presence.label}
                        </div>
                      </div>
                    </div>
                  );
                })()}
                <button onClick={async () => {
                  const user = msgUsers.find(u => u.name === buddyName);
                  if (user) {
                    const existing = msgConversations.find(c => c.other_user?.id === user.id);
                    if (existing) { setMsgActiveConvId(existing.id); }
                    else { try { const msg = await apiSendMessage(user.id, "👋"); await getConversations().then(setMsgConversations); setMsgActiveConvId(msg.conversation_id); } catch {} }
                  }
                  setDashPage("messagerie");
                }} className="iz-btn-pink" style={{ ...sBtn("pink"), width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontSize: 13, padding: "10px 0" }}>
                  <MessageCircle size={14} /> Lui écrire
                </button>
              </div>
            );
          })()}

          {/* Citation du jour — fetched from API */}
          {(() => {
            const c = ctx.dailyQuote;
            if (!c) return null;
            return (
              <div className="iz-card iz-fade-up" style={{ ...sCard, marginBottom: 16, padding: "14px 18px" }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: C.textMuted, letterSpacing: 1, marginBottom: 8, textTransform: "uppercase" }}>CITATION DU JOUR</div>
                <p style={{ fontSize: 13, fontStyle: "italic", color: C.text, margin: "0 0 6px", lineHeight: 1.5 }}>« {c.text} »</p>
                {c.author && <div style={{ fontSize: 11, color: C.textMuted }}>{c.author}</div>}
              </div>
            );
          })()}

          {/* Team members — real accompagnants or fallback to mock */}
          <div style={{ ...sCard }}>
            <h3 className="iz-fade-up iz-stagger-2" style={{ fontSize: 16, fontWeight: 600, color: C.text, margin: "0 0 16px" }}>{t('emp.team_members')}</h3>
            {(() => {
              const accompagnants = (myCollab as any)?.accompagnants || [];
              const teamList = accompagnants.length > 0
                ? accompagnants.map((a: any) => ({ name: a.name || a.nom || `${a.prenom || ""} ${a.nom || ""}`.trim(), role: a.role || a.fonction || "Accompagnant", initials: (a.name || a.nom || "?").split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase(), color: a.couleur || "#E41076" }))
                : TEAM_MEMBERS;
              return teamList.map((m: any, i: number) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i < teamList.length - 1 ? `1px solid ${C.border}` : "none" }}>
                  <div className="iz-avatar" style={{ width: 40, height: 40, borderRadius: "50%", background: m.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 600, color: C.white, flexShrink: 0 }}>{m.initials}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 500, color: C.text }}>{m.name}</div>
                    <div style={{ fontSize: 12, color: C.textLight }}>{m.role}</div>
                  </div>
                  <button
                    title={`Envoyer un message à ${m.name}`}
                    onClick={async () => {
                      const user = msgUsers.find(u => u.name === m.name) || msgUsers.find(u => u.email && m.email && u.email === m.email);
                      if (user) {
                        const existing = msgConversations.find(c => c.other_user?.id === user.id);
                        if (existing) { setMsgActiveConvId(existing.id); }
                        else {
                          try { const msg = await apiSendMessage(user.id, "👋"); await getConversations().then(setMsgConversations); setMsgActiveConvId(msg.conversation_id); } catch {}
                        }
                      }
                      setDashPage("messagerie");
                    }}
                    style={{ background: "none", border: "none", padding: 6, cursor: "pointer", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = C.bg; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                  >
                    <MessageCircle size={16} color={C.pink} />
                  </button>
                </div>
              ));
            })()}
            <div style={{ textAlign: "center", marginTop: 12 }}>
              <span onClick={() => setDashPage("organigramme" as any)} style={{ fontSize: 13, color: C.text, textDecoration: "underline", cursor: "pointer" }}>{t('emp.discover_team')}</span>
            </div>
          </div>
        </div>
      </div>

    </div>
    );
  };

  // ─── MES ACTIONS ─────────────────────────────────────────
  const renderMesActions = () => {
    const view = mesActionsView;
    const setView = setMesActionsView;

    // Group actions by status for kanban
    const todoActions = EMPLOYEE_ACTIONS.filter(a => !completedActions.has(a.id));
    const doneActions = EMPLOYEE_ACTIONS.filter(a => completedActions.has(a.id));

    // Timeline: derive a real date from collab.date_debut + delaiRelatif (J+X), and
    // a time only for meeting-type actions (entretien / visite / rdv) — purely
    // chronological actions get a date but no fake hour.
    const dateDebutStrML = (myCollab as any)?.dateDebut || (myCollab as any)?.date_debut || "";
    const startDateML = dateDebutStrML ? (() => {
      const parts = dateDebutStrML.includes("/") ? dateDebutStrML.split("/") : dateDebutStrML.split("-");
      if (parts.length === 3) {
        const [a, b, c] = parts.map((p: string) => parseInt(p, 10));
        return dateDebutStrML.includes("/") ? new Date(c, b - 1, a) : new Date(a, b - 1, c);
      }
      return new Date();
    })() : new Date();
    const parseJoffset = (s: any): number => {
      if (typeof s !== "string") return 0;
      const m = s.match(/^J([+\-]?\d+)$/i);
      return m ? parseInt(m[1], 10) : 0;
    };
    const MEETING_TYPES = new Set(["entretien", "visite", "rdv"]);
    const fmtDayShort = (d: Date) => d.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' });
    const timelineActions = EMPLOYEE_ACTIONS.map((a: any) => {
      const offset = parseJoffset(a.date);
      const d = new Date(startDateML); d.setDate(startDateML.getDate() + offset);
      const isMeeting = MEETING_TYPES.has(a.actionType);
      return { ...a, _date: d, _isMeeting: isMeeting };
    }).sort((x: any, y: any) => x._date.getTime() - y._date.getTime());

    return (
    <div style={{ flex: 1, padding: "32px 40px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <h1 style={{ fontSize: 24, fontWeight: 600, color: C.text, margin: 0 }}>Checklist Jour 1</h1>
        {/* View toggle */}
        <div style={{ display: "flex", background: C.bg, borderRadius: 8, padding: 3 }}>
          {[
            { key: "list", label: "Liste", icon: ListChecks },
            { key: "timeline", label: "Timeline", icon: Clock },
            { key: "kanban", label: "Kanban", icon: LayoutDashboard },
          ].map(v => {
            const Icon = v.icon;
            const active = view === v.key;
            return (
              <button key={v.key} onClick={() => setView(v.key)} style={{
                padding: "6px 14px", borderRadius: 6, fontSize: 12, fontWeight: active ? 600 : 400,
                border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 5,
                background: active ? C.pink : "transparent", color: active ? "#fff" : C.text, fontFamily: font,
              }}>
                <Icon size={13} /> {v.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* LIST VIEW */}
      {view === "list" && (
        <>
          <div style={{ fontSize: 12, fontWeight: 600, color: C.textMuted, textTransform: "uppercase", letterSpacing: .5, marginBottom: 12 }}>{t('emp.this_week')}</div>
          {EMPLOYEE_ACTIONS.map((a, i) => renderActionCard(a, true, i))}
        </>
      )}

      {/* TIMELINE VIEW — chronologic by computed date; meeting types also show heure */}
      {view === "timeline" && (
        <div className="iz-card" style={{ ...sCard, padding: "20px 24px" }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: C.text }}>Programme</h3>
          <div style={{ position: "relative", paddingLeft: 130 }}>
            {/* Vertical line */}
            <div style={{ position: "absolute", left: 120, top: 12, bottom: 12, width: 2, background: C.border }} />
            {timelineActions.map((a: any) => {
              const done = completedActions.has(a.id);
              const dateLabel = fmtDayShort(a._date);
              const hourLabel = a._isMeeting ? (a.heure_default || "à fixer") : null;
              return (
                <div key={a.id} onClick={() => setShowActionDetail(a.id)}
                  style={{ display: "flex", alignItems: "flex-start", marginBottom: 18, position: "relative", cursor: "pointer", borderRadius: 8, padding: "4px 8px", transition: "background .15s" }}
                  onMouseEnter={e => { e.currentTarget.style.background = C.bg; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}>
                  <div style={{ position: "absolute", left: -130, top: 1, width: 110, textAlign: "right", paddingTop: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: C.text }}>{dateLabel}</div>
                    {hourLabel && <div style={{ fontSize: 11, color: C.pink, fontWeight: 600 }}>{hourLabel}</div>}
                  </div>
                  <div style={{ position: "absolute", left: 0, top: 6, width: 14, height: 14, borderRadius: "50%", background: done ? C.green : C.pink, border: `3px solid ${C.white}`, boxShadow: `0 0 0 2px ${done ? C.green : C.pink}` }} />
                  <div style={{ flex: 1, paddingLeft: 24 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: C.text, textDecoration: done ? "line-through" : "none", opacity: done ? 0.6 : 1 }}>{a.title}</div>
                    {a.subtitle && <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>{a.subtitle}</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* KANBAN VIEW */}
      {view === "kanban" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
          {[
            { key: "todo", label: "À FAIRE", color: C.amber, bg: C.amberLight, items: todoActions },
            { key: "doing", label: "EN COURS", color: C.blue, bg: C.blueLight, items: [] as typeof todoActions },
            { key: "done", label: "TERMINÉ", color: C.green, bg: C.greenLight, items: doneActions },
          ].map(col => (
            <div key={col.key} style={{ background: C.bg, borderRadius: 12, padding: 12, minHeight: 400 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 8px", marginBottom: 10 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: col.color, letterSpacing: 1 }}>{col.label}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.textMuted }}>{col.items.length}</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {col.items.map((a: any) => (
                  <div key={a.id} onClick={() => setShowActionDetail(a.id)}
                    style={{ background: C.white, borderRadius: 10, padding: "12px 14px", border: `1px solid ${C.border}`, cursor: "pointer", boxShadow: "0 1px 2px rgba(0,0,0,.03)", transition: "all .15s" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = col.color; e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 3px 8px rgba(0,0,0,.06)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 1px 2px rgba(0,0,0,.03)"; }}>
                    <div style={{ display: "inline-block", padding: "2px 8px", borderRadius: 4, fontSize: 9, fontWeight: 700, background: col.bg, color: col.color, marginBottom: 6, letterSpacing: 1 }}>{(a.actionType || a.category || a.type || "Action").toUpperCase()}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 4 }}>{a.title}</div>
                    {a.subtitle && <div style={{ fontSize: 11, color: C.textMuted }}>{a.subtitle}</div>}
                  </div>
                ))}
                {col.items.length === 0 && (
                  <div style={{ fontSize: 11, color: C.textMuted, textAlign: "center", padding: 20, fontStyle: "italic" }}>Aucune tâche</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    );
  };

  const handleSendMessage = async () => {
    if (!msgInput.trim() || msgSending) return;
    const activeConv = msgConversations.find(c => c.id === msgActiveConvId);
    if (!activeConv) return;
    setMsgSending(true);
    try {
      const msg = await apiSendMessage(activeConv.other_user.id, msgInput.trim());
      setMsgMessages(prev => [...prev, msg]);
      setMsgInput("");
      setTimeout(() => msgEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
      getConversations().then(setMsgConversations).catch(() => {});
    } catch {}
    finally { setMsgSending(false); }
  };

  const renderMessagerie = () => {
    const activeConv = msgConversations.find(c => c.id === msgActiveConvId);
    return (
    <div style={{ flex: 1, display: "flex", height: "100vh" }}>
      {/* Sidebar conversations */}
      <div style={{ width: 320, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", background: C.white }}>
        <div style={{ padding: "16px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${C.border}` }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: C.text, margin: 0 }}>{t('msg.title')}</h2>
          <button onClick={() => { setMsgShowNewConv(!msgShowNewConv); setMsgSearchQuery(""); }} className="iz-btn-pink" style={{ width: 32, height: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", padding: 0, border: "none", background: msgShowNewConv ? C.bg : C.pink, color: msgShowNewConv ? C.text : C.white, cursor: "pointer", fontSize: 16 }}>
            {msgShowNewConv ? <X size={16} /> : <Plus size={16} />}
          </button>
        </div>

        {/* New conversation panel */}
        {msgShowNewConv && (
          <div style={{ borderBottom: `1px solid ${C.border}` }}>
            <div style={{ padding: "10px 16px" }}>
              <div style={{ ...sInput, display: "flex", alignItems: "center", gap: 8, padding: "8px 12px" }}>
                <Search size={14} color={C.textLight} />
                <input value={msgSearchQuery} onChange={e => setMsgSearchQuery(e.target.value)} placeholder={t('msg.search_user')} style={{ border: "none", outline: "none", background: "transparent", flex: 1, fontSize: 13, fontFamily: font, color: C.text }} />
              </div>
            </div>
            <div style={{ maxHeight: 200, overflow: "auto" }}>
              {msgUsers.filter(u => !msgSearchQuery || u.name.toLowerCase().includes(msgSearchQuery.toLowerCase()) || u.email.toLowerCase().includes(msgSearchQuery.toLowerCase())).map(u => (
                <button key={u.id} onClick={async () => {
                  // Check if conversation already exists
                  const existing = msgConversations.find(c => c.other_user?.id === u.id);
                  if (existing) {
                    setMsgActiveConvId(existing.id);
                  } else {
                    // Send a placeholder to create the conversation, then refresh
                    try {
                      const msg = await apiSendMessage(u.id, "👋");
                      await getConversations().then(setMsgConversations);
                      setMsgActiveConvId(msg.conversation_id);
                    } catch {}
                  }
                  setMsgShowNewConv(false);
                }} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 16px", border: "none", background: "transparent", cursor: "pointer", fontFamily: font, textAlign: "left", transition: "all .1s" }}
                onMouseEnter={e => (e.currentTarget.style.background = C.bg)} onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: `linear-gradient(135deg, ${C.pinkSoft}, ${C.pink})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, color: C.white, flexShrink: 0 }}>{u.initials}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: C.text }}>{u.name}</div>
                    <div style={{ fontSize: 10, color: C.textMuted }}>{u.email}</div>
                  </div>
                  {u.role && <span style={{ fontSize: 9, fontWeight: 600, padding: "2px 6px", borderRadius: 4, background: C.bg, color: C.textMuted }}>{u.role}</span>}
                </button>
              ))}
              {msgUsers.length === 0 && <div style={{ padding: "16px", textAlign: "center", fontSize: 12, color: C.textMuted }}>{t('emp.no_users')}</div>}
            </div>
          </div>
        )}

        <div style={{ flex: 1, overflow: "auto" }}>
          {msgConversations.length === 0 && !msgShowNewConv ? (
            <div style={{ padding: "40px 20px", textAlign: "center" }}>
              <MessageCircle size={32} color={C.border} style={{ marginBottom: 12 }} />
              <div style={{ fontSize: 13, color: C.textMuted, marginBottom: 12 }}>{t('msg.no_conversations')}</div>
              <button onClick={() => setMsgShowNewConv(true)} className="iz-btn-outline" style={{ ...sBtn("outline"), fontSize: 12, padding: "6px 16px" }}>{t('msg.new_conversation')}</button>
            </div>
          ) : msgConversations.map(conv => (
            <div key={conv.id} onClick={() => setMsgActiveConvId(conv.id)} style={{
              padding: "12px 16px", cursor: "pointer", display: "flex", alignItems: "center", gap: 10,
              background: msgActiveConvId === conv.id ? C.pinkBg : "transparent", borderBottom: `1px solid ${C.border}`, transition: "all .15s",
            }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: `linear-gradient(135deg, ${C.pinkSoft}, ${C.pink})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 600, color: C.white, position: "relative", flexShrink: 0 }}>
                {conv.other_user?.initials || "?"}
                {conv.unread_count > 0 && <div style={{ position: "absolute", top: -2, right: -2, width: 18, height: 18, borderRadius: "50%", background: C.red, color: C.white, fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", border: `2px solid ${C.white}` }}>{conv.unread_count}</div>}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: msgActiveConvId === conv.id ? 600 : (conv.unread_count > 0 ? 600 : 400), color: C.text }}>{conv.other_user?.name || "Utilisateur"}</div>
                <div style={{ fontSize: 11, color: C.textMuted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {conv.last_message?.is_bot ? "🤖 " : ""}{conv.last_message?.content?.substring(0, 50) || ""}
                </div>
              </div>
              {conv.last_message_at && <div style={{ fontSize: 10, color: C.textMuted, flexShrink: 0 }}>{fmtDateShort(conv.last_message_at)}</div>}
            </div>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {!activeConv ? (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 80, height: 80, borderRadius: "50%", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
              <MessageCircle size={36} color={C.pink} />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: C.text, margin: "0 0 8px" }}>{t('msg.select_conversation')}</h3>
            <p style={{ fontSize: 14, color: C.textLight }}>{t('msg.select_contact')}</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div style={{ padding: "14px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 12, background: C.white }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg, ${C.pinkSoft}, ${C.pink})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 600, color: C.white }}>{activeConv.other_user?.initials}</div>
              <div><div style={{ fontSize: 15, fontWeight: 600 }}>{activeConv.other_user?.name}</div><div style={{ fontSize: 11, color: C.textMuted }}>{activeConv.other_user?.email}</div></div>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflow: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: 12 }}>
              {msgMessages.map(msg => {
                const isMe = msg.sender_id === auth.user?.id;
                const isBot = msg.is_bot;
                return (
                  <div key={msg.id} style={{ display: "flex", justifyContent: isBot ? "center" : isMe ? "flex-end" : "flex-start", maxWidth: "100%" }}>
                    {isBot ? (
                      <div style={{ maxWidth: "80%", padding: "12px 16px", background: C.bg, borderRadius: 12, border: `1px solid ${C.border}` }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                          <div style={{ width: 20, height: 20, borderRadius: "50%", background: C.pink, display: "flex", alignItems: "center", justifyContent: "center" }}><Sparkles size={10} color={C.white} /></div>
                          <span style={{ fontSize: 11, fontWeight: 600, color: C.pink }}>IllizeoBot</span>
                          <span style={{ fontSize: 10, color: C.textMuted }}>{fmtDateTimeShort(msg.created_at)}</span>
                        </div>
                        <div style={{ fontSize: 13, color: C.text, lineHeight: 1.5, whiteSpace: "pre-wrap" }}>{msg.content}</div>
                      </div>
                    ) : (
                      <div style={{ maxWidth: "70%" }}>
                        <div style={{ padding: "10px 14px", borderRadius: isMe ? "14px 14px 4px 14px" : "14px 14px 14px 4px", background: isMe ? C.pink : C.white, color: isMe ? C.white : C.text, border: isMe ? "none" : `1px solid ${C.border}`, fontSize: 13, lineHeight: 1.5, whiteSpace: "pre-wrap" }}>{msg.content}</div>
                        <div style={{ fontSize: 10, color: C.textMuted, marginTop: 4, textAlign: isMe ? "right" : "left" }}>
                          {msg.sender_name} · {fmtDateTimeShort(msg.created_at)}
                          {isMe && msg.read_at && <span> · Lu</span>}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              <div ref={msgEndRef} />
            </div>

            {/* Input */}
            <div style={{ padding: "12px 20px", borderTop: `1px solid ${C.border}`, display: "flex", gap: 10, alignItems: "center", background: C.white }}>
              <input value={msgInput} onChange={e => setMsgInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                placeholder={t('msg.placeholder')} style={{ ...sInput, flex: 1, fontSize: 14, padding: "12px 16px" }} />
              <button onClick={handleSendMessage} disabled={!msgInput.trim() || msgSending} className="iz-btn-pink" style={{ ...sBtn("pink"), padding: "10px 16px", borderRadius: 10, opacity: !msgInput.trim() ? 0.5 : 1 }}>
                <Send size={18} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
    );
  };

  // ─── ENTREPRISE ──────────────────────────────────────────
  const renderCompanyBlock = (block: any, idx?: number) => {
    const iconMap: Record<string, React.FC<any>> = { building: Building2, sparkles: Sparkles, heart: Gift, rocket: Zap, users: Users, shield: ShieldCheck, star: Star, target: Target };
    const tr = (field: string) => {
      const val = block.translations?.[field]?.[lang];
      return val || (block as any)[field] || "";
    };
    const sectionPad = "80px 64px";
    const numLabel = idx !== undefined && idx > 0 ? String(idx).padStart(2, "0") : null;
    const eyebrowText = (defaultLabel: string) => {
      const custom = block.data?.eyebrow as string | undefined;
      const label = (custom || defaultLabel || "").toUpperCase();
      return numLabel ? `${numLabel} — ${label}` : label;
    };
    switch (block.type) {
      case 'hero': {
        // Hero title supports the {prenom} placeholder. If the admin doesn't set a
        // titre, we fall back to "Bienvenue, {prenom}.". The first name is rendered
        // in pink while the rest of the title uses a darker rose for visual rhythm.
        const heroFirstName = auth.user?.name?.split(" ")[0] || "";
        const heroTitleRaw = (tr('titre') || `Bienvenue, {prenom}.`).replace(/\{prenom\}/gi, heroFirstName);
        return (
          <section key={block.id} style={{ padding: sectionPad, borderBottom: `1px solid ${C.border}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22 }}>
              <span style={{ width: 32, height: 1, background: C.pink }} />
              <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2, color: C.pink, textTransform: "uppercase" }}>{(block.data?.subtitle as string) || "Votre aventure commence ici"}</span>
            </div>
            <h1 style={{ fontSize: 72, fontWeight: 800, lineHeight: 1.05, margin: "0 0 24px", fontFamily: fontDisplay, letterSpacing: -2, color: C.pink }}>
              {heroTitleRaw}
            </h1>
            {tr('contenu') && (
              <p style={{ fontSize: 17, lineHeight: 1.6, color: C.textLight, margin: 0, maxWidth: 720 }}>{tr('contenu')}</p>
            )}
          </section>
        );
      }
      case 'text':
        return (
          <section key={block.id} style={{ padding: sectionPad, borderBottom: `1px solid ${C.border}`, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "start" }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, letterSpacing: 2, marginBottom: 18, textTransform: "uppercase" }}>{eyebrowText("À propos de nous")}</div>
              <h2 style={{ fontSize: 26, fontWeight: 700, color: C.text, lineHeight: 1.3, margin: 0, fontFamily: font }}>{tr('titre')}</h2>
            </div>
            <div style={{ fontSize: 15, lineHeight: 1.75, color: C.text }}>{tr('contenu')}</div>
          </section>
        );
      case 'mission':
        return (
          <section key={block.id} style={{ padding: sectionPad, borderBottom: `1px solid ${C.border}`, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "start" }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, letterSpacing: 2, marginBottom: 18, textTransform: "uppercase" }}>{eyebrowText(block.data?.number ? `Section ${block.data.number}` : "Notre mission")}</div>
              <h2 style={{ fontSize: 30, fontWeight: 700, color: C.text, lineHeight: 1.25, margin: 0, fontFamily: font }}>{tr('titre')}</h2>
            </div>
            <div>
              {tr('contenu') && (
                <p style={{ fontSize: 15, lineHeight: 1.7, color: C.text, margin: "0 0 24px" }}>{tr('contenu')}</p>
              )}
              {block.data?.highlight_title && (
                <div style={{ borderLeft: `3px solid ${C.pink}`, padding: "12px 18px", background: C.pinkBg + "80", borderRadius: "0 8px 8px 0" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.pink, marginBottom: 6 }}>{block.data.highlight_title}</div>
                  <div style={{ fontSize: 13, lineHeight: 1.6, color: C.text }}>{block.data.highlight_text || ""}</div>
                </div>
              )}
            </div>
          </section>
        );
      case 'stats':
        return (
          <section key={block.id} style={{ padding: sectionPad, borderBottom: `1px solid ${C.border}` }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 24, marginBottom: 36, flexWrap: "wrap" }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, letterSpacing: 2, marginBottom: 18, textTransform: "uppercase" }}>{eyebrowText("Un groupe formidable où travailler")}</div>
                <h2 style={{ fontSize: 30, fontWeight: 700, color: C.text, lineHeight: 1.25, margin: 0, fontFamily: font }}>{tr('titre') || "Nous sommes une formidable équipe"}</h2>
              </div>
              {block.data?.badge && (
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 999, background: C.greenLight, color: C.green, fontSize: 12, fontWeight: 600 }}>
                  <Check size={14} /> {block.data.badge}
                </div>
              )}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.max(1, (block.data?.items || []).length)}, 1fr)`, gap: 0, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden" }}>
              {(block.data?.items || []).map((s: any, i: number) => (
                <div key={i} style={{ padding: "44px 36px", borderRight: i < (block.data?.items || []).length - 1 ? `1px solid ${C.border}` : "none" }}>
                  <div style={{ fontSize: 88, fontWeight: 600, color: C.pink, lineHeight: 1, fontFamily: '"Playfair Display", Georgia, serif', fontStyle: "italic", letterSpacing: -2, marginBottom: 24 }}>{s.value}</div>
                  <div style={{ fontSize: 13, color: C.textLight, lineHeight: 1.55 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </section>
        );
      case 'values':
        return (
          <section key={block.id} style={{ padding: sectionPad, borderBottom: `1px solid ${C.border}` }}>
            <div style={{ marginBottom: 36 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, letterSpacing: 2, marginBottom: 18, textTransform: "uppercase" }}>{eyebrowText("Nos valeurs")}</div>
              <h2 style={{ fontSize: 30, fontWeight: 700, color: C.text, lineHeight: 1.25, margin: 0, fontFamily: font }}>{tr('titre') || "Ce qui nous anime"}</h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(4, Math.max(1, (block.data?.items || []).length))}, 1fr)`, gap: 32 }}>
              {(block.data?.items || []).map((v: any, i: number) => {
                const VIcon = iconMap[v.icon] || Star;
                return (
                  <div key={i} style={{ paddingTop: 24, borderTop: `2px solid ${C.pink}` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: C.pink, letterSpacing: .5 }}>{String(i + 1).padStart(2, "0")}</span>
                      <VIcon size={14} color={C.pink} />
                    </div>
                    <div style={{ fontSize: 17, fontWeight: 700, color: C.text, marginBottom: 8, fontFamily: font }}>{v.title}</div>
                    <div style={{ fontSize: 13, color: C.textLight, lineHeight: 1.55 }}>{v.desc}</div>
                  </div>
                );
              })}
            </div>
          </section>
        );
      case 'video':
        return (
          <section key={block.id} style={{ padding: sectionPad, borderBottom: `1px solid ${C.border}` }}>
            <div style={{ marginBottom: 36 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, letterSpacing: 2, marginBottom: 18, textTransform: "uppercase" }}>{eyebrowText("Découvrir Illizeo en vidéo")}</div>
              <h2 style={{ fontSize: 30, fontWeight: 700, color: C.text, lineHeight: 1.25, margin: 0, fontFamily: font }}>{tr('titre') || "Voir Illizeo en action"}</h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(2, Math.max(1, (block.data?.videos || []).length))}, 1fr)`, gap: 24 }}>
              {(block.data?.videos || []).map((v: any, i: number) => (
                <div key={i}>
                  <div style={{ width: "100%", aspectRatio: "16/9", borderRadius: 12, overflow: "hidden", background: C.dark }}>
                    {v.youtube_id ? (
                      <iframe src={`https://www.youtube.com/embed/${v.youtube_id}`} title={v.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen style={{ width: "100%", height: "100%", border: "none" }} />
                    ) : (
                      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #2D1B3D, #7B5EA7)" }}>
                        <Play size={40} color="rgba(255,255,255,.8)" />
                      </div>
                    )}
                  </div>
                  <div style={{ padding: "12px 0 0", fontSize: 13, color: C.textLight }}>{v.title}</div>
                </div>
              ))}
            </div>
          </section>
        );
      case 'team':
        return (
          <section key={block.id} style={{ padding: sectionPad, borderBottom: `1px solid ${C.border}` }}>
            <div style={{ marginBottom: 36 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, letterSpacing: 2, marginBottom: 18, textTransform: "uppercase" }}>{eyebrowText("L'équipe qui vous accompagne")}</div>
              <h2 style={{ fontSize: 30, fontWeight: 700, color: C.text, lineHeight: 1.25, margin: 0, fontFamily: font }}>{tr('titre') || "Vos contacts"}</h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(4, Math.max(1, (block.data?.members || []).length))}, 1fr)`, gap: 18 }}>
              {(block.data?.members || []).map((m: any, i: number) => (
                <div key={i} style={{ padding: "22px 22px 24px", border: `1px solid ${C.border}`, borderRadius: 12, background: C.white }}>
                  <div style={{ width: 44, height: 44, borderRadius: "50%", background: m.color || C.pink, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: C.white, marginBottom: 18 }}>{m.initials}</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 2, fontFamily: font }}>{m.name}</div>
                  <div style={{ fontSize: 12, color: C.textLight, marginBottom: 14 }}>{m.role}</div>
                  {m.email && <div style={{ fontSize: 12, color: C.textLight, display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}><Mail size={12} color={C.textMuted} />{m.email}</div>}
                  {m.phone && <div style={{ fontSize: 12, color: C.textLight, display: "flex", alignItems: "center", gap: 6 }}><Phone size={12} color={C.textMuted} />{m.phone}</div>}
                </div>
              ))}
            </div>
          </section>
        );
      case 'culture_quiz': {
        const questions = block.data?.questions || [];
        const xp = block.data?.xp_per_correct ?? 10;
        const category = block.data?.category || "";
        return (
          <div key={block.id} className="iz-card" style={{ ...sCard, marginBottom: 16, padding: "20px 24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: C.pinkBg, display: "flex", alignItems: "center", justifyContent: "center" }}><BookMarked size={18} color={C.pink} /></div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>{tr('titre')}</h3>
                {category && <div style={{ fontSize: 11, color: C.textLight, marginTop: 2 }}>{category} · {questions.length} question{questions.length > 1 ? "s" : ""} · +{xp} XP / bonne réponse</div>}
              </div>
            </div>
            {questions.length === 0 ? (
              <div style={{ fontSize: 12, color: C.textMuted, fontStyle: "italic" }}>Aucune question — ajoutez-en au moins une.</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {questions.map((q: any, qi: number) => (
                  <div key={qi} style={{ padding: "10px 12px", border: `1px solid ${C.border}`, borderRadius: 8, background: C.white }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: C.text, marginBottom: 6 }}>{qi + 1}. {q.q || <span style={{ color: C.textMuted, fontWeight: 400, fontStyle: "italic" }}>(question vide)</span>}</div>
                    <div style={{ display: "grid", gap: 4 }}>
                      {(q.options || []).map((opt: string, oi: number) => (
                        <div key={oi} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: oi === q.correct ? C.green : C.textLight }}>
                          {oi === q.correct ? <CheckCircle size={12} /> : <span style={{ width: 12, height: 12, borderRadius: "50%", border: `1.5px solid ${C.border}`, display: "inline-block" }} />}
                          <span>{opt || <span style={{ fontStyle: "italic", color: C.textMuted }}>(option vide)</span>}</span>
                        </div>
                      ))}
                    </div>
                    {q.explain && <div style={{ fontSize: 10, color: C.textMuted, marginTop: 6, fontStyle: "italic" }}>💡 {q.explain}</div>}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      }
      default:
        return null;
    }
  };

  const renderEntreprise = () => {
    const active = companyBlocks.filter(b => b.actif);
    // Editorial section numbering — hero blocks (intro) don't get a number,
    // every other section gets 01, 02, 03… in order.
    let n = 0;
    return (
      <div style={{ flex: 1, overflow: "auto", background: C.white }}>
        {active.length === 0 ? (
          <div style={{ textAlign: "center", padding: 60, color: C.textMuted }}>
            <Building2 size={48} color={C.border} style={{ marginBottom: 12 }} />
            <p>Page entreprise non configurée</p>
          </div>
        ) : (
          active.map(b => {
            const idx = b.type === "hero" ? 0 : ++n;
            return renderCompanyBlock(b, idx);
          })
        )}
      </div>
    );
  };

  const _oldRenderEntreprise = () => (
    <div style={{ flex: 1, padding: "32px 40px" }}>
      <div style={{ display: "flex", gap: 32 }}>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: C.text, margin: "0 0 16px" }}>À propos</h2>
          <div style={{ ...sCard, background: "linear-gradient(135deg, #c8a0d8 0%, #e0b0e8 100%)", color: C.white, marginBottom: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 12px" }}>À PROPOS DE NOUS ?</h3>
            <p style={{ fontSize: 13, lineHeight: 1.6, margin: 0 }}>
              Illizeo est un groupe international de conseil et d'expertises technologiques qui accélère la transformation de ses clients par les leviers de l'innovation, la technologie et la data. Présent sur 5 continents, dans 18 pays, le Groupe, certifié Great Place To Work, qui comptera plus de 7200 collaborateurs fin 2024.
            </p>
          </div>
          <div style={{ ...sCard, background: C.green, color: C.white }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, margin: "0 0 8px" }}>BIENVENUE DANS LA POSITIVE INNOVATION</h3>
            <p style={{ fontSize: 13, lineHeight: 1.6, margin: 0 }}>
              La « Positive innovation » c'est la trajectoire que propose Illizeo à ses clients pour garantir un impact positif dans la conduite de leurs projets et pour accélérer leur transformation.
            </p>
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: C.text, margin: "0 0 16px" }}>Notre mission</h2>
          <div style={{ ...sCard, background: C.dark, color: C.white, marginBottom: 20, position: "relative", overflow: "hidden", height: 200, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
            <div style={{ fontSize: 40, fontWeight: 800, color: "rgba(255,255,255,.2)", position: "absolute", top: 16, left: 20 }}>01</div>
            <h3 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 8px" }}>NOTRE MISSION</h3>
            <p style={{ fontSize: 12, textAlign: "center", color: "rgba(255,255,255,.8)", maxWidth: 280 }}>Accélérer votre transformation par les leviers de la technologie, de la data & de l'innovation</p>
          </div>
        </div>
      </div>
      {/* Great Place to Work */}
      <div style={{ marginTop: 24 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: C.text, margin: "0 0 4px" }}>UN GROUPE FORMIDABLE OÙ TRAVAILLER</h2>
        <p style={{ fontSize: 14, color: C.textLight, margin: "0 0 16px" }}>NOUS SOMMES UNE FORMIDABLE EQUIPE</p>
        <div style={{ display: "flex", gap: 0, borderRadius: 12, overflow: "hidden" }}>
          <div style={{ flex: 1, background: "#6B88B0", padding: 24, color: C.white, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ fontSize: 11, fontWeight: 700, marginBottom: 8 }}>NOTRE ENGAGEMENT EN FAVEUR DE L'ACCRÉDITATION GREAT PLACE TO WORK®</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,.8)" }}>est déployé en France depuis 2014 et sur l'ensemble de nos marchés au niveau mondial depuis 2020</div>
          </div>
          {[
            { pct: "83%", desc: "de nos employés disent qu'Illizeo est un endroit formidable où travailler" },
            { pct: "85%", desc: "de nos employés sont prêts à se surpasser pour que le travail soit fait" },
            { pct: "80%", desc: "confirme que les employés d'Illizeo cherchent à innover" },
          ].map((s, i) => (
            <div key={i} style={{ flex: 1, background: "#2D6B3F", padding: 24, color: C.white, textAlign: "center" }}>
              <div style={{ fontSize: 32, fontWeight: 800, color: C.amber }}>{s.pct}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,.8)", marginTop: 4 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </div>
      {/* Videos section */}
      <div style={{ marginTop: 32 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, color: C.text, margin: "0 0 16px" }}>Vidéos</h2>
        <div style={{ height: 320, background: C.purple, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ width: 60, height: 60, borderRadius: "50%", background: "rgba(255,255,255,.25)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <Play size={28} color={C.white} fill={C.white} />
            </div>
            <div style={{ fontSize: 28, fontWeight: 600, color: C.white }}>
              Dans un monde où la <span style={{ color: C.pink }}>technologie</span>
            </div>
          </div>
          <button style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer" }}><ChevronLeft size={28} color="rgba(255,255,255,.5)" /></button>
          <button style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer" }}><ChevronRight size={28} color="rgba(255,255,255,.5)" /></button>
        </div>
      </div>
    </div>
  );

  // ─── RAPPORTS ────────────────────────────────────────────
  const renderRapports = () => (
    <div style={{ flex: 1, padding: "32px 40px" }}>
      <h1 style={{ fontSize: 24, fontWeight: 600, color: C.text, margin: "0 0 20px" }}>Rapports</h1>
      <div style={{ borderBottom: `2px solid ${C.border}`, marginBottom: 24 }}>
        <button style={{ padding: "8px 0 12px", fontSize: 14, fontWeight: 600, color: C.pink, background: "none", border: "none", borderBottom: `3px solid ${C.pink}`, cursor: "pointer", fontFamily: font }}>Vue d'ensemble</button>
      </div>
      <div style={{ display: "flex", gap: 20, marginBottom: 24 }}>
        <div style={{ ...sCard, flex: 1, display: "flex", alignItems: "center", gap: 12 }}>
          <Clock size={24} color={C.amber} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: C.text }}>0</div>
            <div style={{ fontSize: 13, color: C.textLight }}>Parcours en cours</div>
          </div>
          <button style={sBtn("outline")}>Voir</button>
        </div>
        <div style={{ ...sCard, flex: 1, display: "flex", alignItems: "center", gap: 12 }}>
          <AlertTriangle size={24} color={C.amber} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: C.text }}>0</div>
            <div style={{ fontSize: 13, color: C.textLight }}>Parcours en retard</div>
          </div>
          <button style={sBtn("outline")}>Voir</button>
        </div>
      </div>
      <div style={{ display: "flex", gap: 20 }}>
        <div style={{ ...sCard, flex: 2 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: C.text, margin: "0 0 4px" }}>Répartition par parcours</h3>
          <p style={{ fontSize: 13, color: C.textLight, margin: "0 0 20px" }}>Découvrez la répartition de vos différents parcours</p>
          <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
            <ResponsiveContainer width={180} height={180}>
              <PieChart>
                <Pie data={[{ value: 1 }]} cx="50%" cy="50%" innerRadius={55} outerRadius={75} dataKey="value" stroke="none">
                  <Cell fill="#ccc" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ccc" }} />
              <span style={{ fontSize: 14, color: C.text }}>Onboarding</span>
              <span style={{ background: C.pink, color: C.white, borderRadius: 10, padding: "2px 8px", fontSize: 11, fontWeight: 700, marginLeft: 8 }}>1</span>
            </div>
          </div>
        </div>
        <div style={{ ...sCard, flex: 1 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: C.text, margin: "0 0 4px" }}>Détails par parcours</h3>
          <p style={{ fontSize: 13, color: C.textLight, margin: "0 0 16px" }}>Suivre le détail statistiques par parcours</p>
          <div style={{ ...sInput, marginBottom: 16 }}>Parcours sélectionné : Onboarding</div>
          <div style={{ fontSize: 12, fontWeight: 600, color: C.textMuted, textTransform: "uppercase", marginBottom: 12 }}>GLOBAL</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <Clock size={14} color={C.amber} />
            <span style={{ fontSize: 14, color: C.text, flex: 1 }}>En cours</span>
            <span style={{ fontSize: 14, fontWeight: 600 }}>1</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <AlertTriangle size={14} color={C.amber} />
            <span style={{ fontSize: 14, color: C.text, flex: 1 }}>En retard</span>
            <span style={{ fontSize: 14, fontWeight: 600 }}>0</span>
          </div>
        </div>
      </div>
      {/* Suivi par utilisateur */}
      <div style={{ ...sCard, marginTop: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, color: C.text, margin: "0 0 4px" }}>Suivi par utilisateur</h3>
        <p style={{ fontSize: 13, color: C.textLight, margin: "0 0 16px" }}>Suivre le détail statistiques par parcours</p>
        <div style={{ display: "flex", gap: 20, borderBottom: `2px solid ${C.border}`, marginBottom: 16 }}>
          <button style={{ padding: "6px 0 10px", fontSize: 13, color: C.textLight, background: "none", border: "none", borderBottom: "3px solid transparent", cursor: "pointer", fontFamily: font }}>+ en retard</button>
          <button style={{ padding: "6px 0 10px", fontSize: 13, color: C.pink, fontWeight: 600, background: "none", border: "none", borderBottom: `3px solid ${C.pink}`, cursor: "pointer", fontFamily: font }}>Futurs arrivants</button>
        </div>
        <div style={{ textAlign: "center", padding: "40px 0", color: C.textLight }}>
          <div style={{ marginBottom: 8 }}><Sparkles size={40} color={C.pink} /></div>
          <span style={{ fontSize: 13, textDecoration: "underline", cursor: "pointer" }}>Découvrez le reste des utilisateurs</span>
        </div>
      </div>
    </div>
  );

  // ─── WELCOME MODAL ───────────────────────────────────────
  const renderWelcomeModal = () => {
    const welcomeFirstName = auth.user?.name?.split(" ")[0] || "";
    const welcomeInitials = auth.user?.name?.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() || "?";
    return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
      <div style={{ background: C.white, borderRadius: 20, width: 700, padding: "48px 40px", textAlign: "center", position: "relative" }}>
        <button onClick={() => setShowWelcomeModal(false)} style={{ position: "absolute", top: 20, right: 20, background: "none", border: "none", cursor: "pointer" }}><X size={24} color={C.textLight} /></button>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: -8, marginBottom: 24 }}>
          <div style={{ width: 80, height: 80, borderRadius: "50%", background: avatarImage ? "none" : "linear-gradient(135deg, #E91E8C, #E41076)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 600, color: C.white, border: `3px solid ${C.white}`, zIndex: 1, overflow: "hidden", position: "relative" }}>
            {avatarImage ? (
              <img src={avatarImage} alt="" style={{
                width: `${avatarZoom || 100}%`, height: `${avatarZoom || 100}%`, objectFit: "cover", position: "relative",
                left: `${(50 - (avatarPos?.x || 50)) * ((avatarZoom || 100) - 100) / 100}%`,
                top: `${(50 - (avatarPos?.y || 50)) * ((avatarZoom || 100) - 100) / 100}%`,
              }} />
            ) : welcomeInitials}
          </div>
          <div style={{ width: 60, height: 60, borderRadius: "50%", background: C.white, display: "flex", alignItems: "center", justifyContent: "center", marginLeft: -16, border: `2px solid ${C.border}` }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: C.pink, letterSpacing: 1 }}>illizeo</span>
          </div>
        </div>
        <h2 style={{ fontSize: 24, fontWeight: 600, color: C.pink, margin: "0 0 12px" }}>Bienvenue chez Illizeo {welcomeFirstName}</h2>
        <p style={{ fontSize: 14, color: C.textLight, lineHeight: 1.6, margin: "0 0 32px", maxWidth: 500, marginInline: "auto" }}>
          Pour faciliter votre arrivée, nous avons conçu un parcours d'intégration rien que pour vous. Ce parcours est organisé autour de 4 phases distinctes que voici
        </p>
        {/* Phase stepper */}
        <div style={{ ...sCard, padding: "24px 20px", margin: "0 0 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {[
            { label: "Avant le premier jour", Icon: Hand, active: true },
            { label: "Premier jour", Icon: PartyPopper },
            { label: "Première semaine", Icon: Dumbbell },
            { label: "3 premiers mois", Icon: Package },
          ].map((phase, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 0, width: "100%" }}>
                {i > 0 && <div style={{ flex: 1, height: 4, background: "#eee", borderRadius: 2 }} />}
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: phase.active ? C.green : C.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><phase.Icon size={16} color={phase.active ? C.white : C.textMuted} /></div>
                {i < 3 && <div style={{ flex: 1, height: 4, background: "#eee", borderRadius: 2 }} />}
              </div>
              <span style={{ fontSize: 12, color: C.text, fontWeight: 500, textAlign: "center" }}>{phase.label}</span>
            </div>
          ))}
        </div>
        <button onClick={() => setShowWelcomeModal(false)} style={{ ...sBtn("dark"), padding: "12px 36px", fontSize: 15 }}>Commencer mon parcours</button>
      </div>
    </div>
    );
  };

  // ─── DOCUMENT PANEL ──────────────────────────────────────
  const renderDocPanel = () => {
    if (showDocCategory) {
      const liveCats = getLiveDocCategories();
      const cat: any = liveCats.find((c: any) => c.id === showDocCategory) || DOC_CATEGORIES.find(c => c.id === showDocCategory);
      if (!cat) return null;
      const isFormulaires = (cat as any).type === "formulaire" || cat.id === "formulaires";
      return (
        <div className="iz-panel" style={{ position: "fixed", top: 0, right: 0, width: 540, height: "100vh", background: C.white, boxShadow: "-4px 0 24px rgba(0,0,0,.1)", zIndex: 1001, display: "flex", flexDirection: "column", overflow: "auto" }}>
          <div style={{ padding: "24px 28px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: C.text, margin: 0 }}>{cat.title}</h2>
              <p style={{ fontSize: 13, color: C.textLight, margin: "4px 0 0" }}>Compléter mon dossier administratif</p>
            </div>
            <button onClick={() => setShowDocCategory(null)} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={22} color={C.textLight} /></button>
          </div>
          <div style={{ flex: 1, padding: "20px 28px", overflow: "auto" }}>
            {cat.id === "suisse" && (
              <div style={{ background: C.pinkBg, borderRadius: 8, padding: 14, marginBottom: 20, fontSize: 13, color: C.text, lineHeight: 1.5 }}>
                Document à soumettre pour toutes les démarches administratives. A faire en amont de l'arrivée du collaborateur – Pièce d'identité ou passeport en cours de validité – Carte d'assuré social (si concerné) – Permis de travail/résidence (si concerné)
              </div>
            )}
            {cat.id === "supplementaires" && (
              <div style={{ background: C.blueLight, borderRadius: 8, padding: 14, marginBottom: 20, fontSize: 13, color: C.text, lineHeight: 1.5 }}>
                Cet espace permet de transmettre des documents administratifs complémentaires, tels que des pièces justificatives.
              </div>
            )}
            {cat.docs.map((doc, i) => {
              const docStatus = employeeDocs[doc] || "manquant";
              return (
              <div key={i} style={{ marginBottom: 28 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                  <label style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{doc}</label>
                  {docStatus !== "manquant" && (
                    <span className="iz-fade-in" style={{ padding: "3px 10px", borderRadius: 12, fontSize: 11, fontWeight: 600,
                      background: docStatus === "valide" ? C.greenLight : docStatus === "en_attente" ? C.amberLight : docStatus === "refuse" ? C.redLight : C.bg,
                      color: docStatus === "valide" ? C.green : docStatus === "en_attente" ? C.amber : docStatus === "refuse" ? C.red : C.textMuted,
                    }}>{docStatus === "valide" ? "Validé" : docStatus === "en_attente" ? "En attente de validation" : docStatus === "refuse" ? "Refusé — resoumettre" : "Soumis"}</span>
                  )}
                </div>
                {isFormulaires ? (
                  <div style={{ marginTop: 8 }}>
                    <div style={{ marginBottom: 4 }}>
                      <strong style={{ fontSize: 14 }}>Étape 1</strong>
                      <div style={{ fontSize: 13, color: C.textLight, marginBottom: 6 }}>Télécharger le fichier et le compléter</div>
                      <button className="iz-btn-pink" style={{ ...sBtn("pink"), padding: "8px 20px", fontSize: 13 }}>Télécharger</button>
                    </div>
                    <div style={{ marginTop: 12 }}>
                      <strong style={{ fontSize: 14 }}>Étape 2</strong>
                      <div style={{ fontSize: 13, color: C.textLight, marginBottom: 6 }}>Importer le fichier complété</div>
                      {docStatus === "manquant" || docStatus === "refuse" ? (
                        <label className="iz-btn-pink" style={{ display: "inline-flex", alignItems: "center", gap: 6, ...sBtn("pink"), padding: "8px 16px", fontSize: 13, cursor: "pointer" }}>
                          <input type="file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx,.txt,.csv" style={{ display: "none" }} onChange={async e => {
                            const file = e.target.files?.[0]; if (!file) return;
                            try {
                              if (myCollab?.id) await uploadDocument(file, myCollab.id, cat.title, doc);
                              handleEmployeeSubmitDoc(doc);
                            } catch (err: any) {
                              addToast(`Échec de l'envoi: ${err?.message || err}`, "error");
                            } finally { e.target.value = ""; }
                          }} />
                          <Plus size={14} /> Ajouter un fichier
                        </label>
                      ) : (
                        <div className="iz-fade-in" style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: C.greenLight, borderRadius: 8, fontSize: 13, color: C.green }}>
                          <CheckCircle size={16} /> Fichier soumis
                        </div>
                      )}
                    </div>
                  </div>
                ) : (docStatus === "manquant" || docStatus === "refuse") ? (
                  <label className="iz-upload-zone" style={{ marginTop: 8, borderRadius: 12, padding: "28px 20px", textAlign: "center", cursor: "pointer", display: "block" }}>
                    <input type="file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx,.txt,.csv" style={{ display: "none" }} onChange={async e => {
                      const file = e.target.files?.[0]; if (!file) return;
                      try {
                        if (myCollab?.id) await uploadDocument(file, myCollab.id, cat.title, doc);
                        handleEmployeeSubmitDoc(doc);
                      } catch (err: any) {
                        addToast(`Échec de l'envoi: ${err?.message || err}`, "error");
                      } finally { e.target.value = ""; }
                    }} />
                    <Upload size={24} color={C.textLight} style={{ marginBottom: 8 }} />
                    <div style={{ fontSize: 14, color: C.text }}>Glisser-déposer ou <span style={{ color: C.pink, fontWeight: 600, textDecoration: "underline" }}>Importer</span> un fichier</div>
                    <div style={{ fontSize: 12, color: C.textMuted, marginTop: 4 }}>Type de fichier: Image (png, jpeg...), PDF, Office (word, excel, txt, csv...)</div>
                  </label>
                ) : (
                  <div className="iz-fade-in" style={{ marginTop: 8, padding: "16px 20px", background: docStatus === "valide" ? C.greenLight : C.amberLight, borderRadius: 12, display: "flex", alignItems: "center", gap: 10 }}>
                    {docStatus === "valide" ? <CheckCircle size={20} color={C.green} /> : <Clock size={20} color={C.amber} />}
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 500, color: docStatus === "valide" ? C.green : C.amber }}>{docStatus === "valide" ? "Document validé par l'équipe RH" : "Document soumis — en attente de validation"}</div>
                      <div style={{ fontSize: 12, color: C.textLight, marginTop: 2 }}>document_{doc.replace(/[^a-zA-Z]/g, "").toLowerCase().substring(0, 12)}.pdf</div>
                    </div>
                  </div>
                )}
              </div>
              );
            })}
          </div>
          <div style={{ padding: "16px 28px", borderTop: `1px solid ${C.border}`, display: "flex", gap: 12, justifyContent: "flex-end" }}>
            <button style={sBtn("pink")}>Sauvegarder</button>
            {cat.id === "supplementaires" && <button style={sBtn("outline")}>Non concerné</button>}
          </div>
        </div>
      );
    }

    if (showDocPanel === "admin") {
      return (
        <div className="iz-panel" style={{ position: "fixed", top: 0, right: 0, width: 540, height: "100vh", background: C.white, boxShadow: "-4px 0 24px rgba(0,0,0,.1)", zIndex: 1001, display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "24px 28px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: C.text, margin: 0 }}>Compléter mon dossier administratif</h2>
              <p style={{ fontSize: 13, color: C.textLight, margin: "4px 0 0" }}>Administratif</p>
            </div>
            <button onClick={() => setShowDocPanel(null)} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={22} color={C.textLight} /></button>
          </div>
          <div style={{ flex: 1, padding: "20px 28px", overflow: "auto" }}>
            <p style={{ fontSize: 13, color: C.textLight, marginBottom: 20, lineHeight: 1.5 }}>
              Les pièces administratives sont organisées par catégorie. Certaines pièces sont obligatoires, d'autres sont facultatives.
            </p>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 16 }}>Onboarding</div>
            {getLiveDocCategories().map(cat => {
              const allDone = cat.missing === 0;
              return (
              <div key={cat.id} className="iz-card" style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderRadius: 10, border: `1px solid ${allDone ? C.green : C.border}`, marginBottom: 10, background: allDone ? C.greenLight : C.white }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: allDone ? C.green : C.greenLight, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {allDone ? <CheckCircle size={18} color={C.white} /> : <FileText size={18} color={C.green} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: C.text }}>{cat.title}</div>
                  {allDone ? (
                    <div style={{ fontSize: 12, color: C.green, fontWeight: 600 }}>Catégorie complète</div>
                  ) : (
                    <div style={{ fontSize: 12, color: C.amber }}>{cat.missing} information(s) manquante(s)</div>
                  )}
                </div>
                <button onClick={() => setShowDocCategory(cat.id)} className={allDone ? "iz-btn-outline" : "iz-btn-pink"} style={{ ...(allDone ? sBtn("outline") : sBtn("dark")), padding: "6px 16px", fontSize: 12 }}>{allDone ? "Voir" : "Compléter"}</button>
              </div>
              );
            })}
          </div>
          <div style={{ padding: "16px 28px", borderTop: `1px solid ${C.border}`, textAlign: "center" }}>
            <button onClick={() => { if (docsMissing === 0) addToast("Dossier administratif envoyé pour validation finale", "success"); }} className="iz-btn-pink" style={{ ...sBtn(docsMissing === 0 ? "pink" : "outline"), opacity: docsMissing === 0 ? 1 : 0.5 }}>{docsMissing === 0 ? "Envoyer mon dossier administratif finalisé" : `Envoyer mon dossier (${docsMissing} pièce(s) manquante(s))`}</button>
          </div>
        </div>
      );
    }
    return null;
  };

  // ─── ACTION DETAIL PANEL ─────────────────────────────────
  const renderActionDetail = () => {
    if (!showActionDetail) return null;
    const action = EMPLOYEE_ACTIONS.find((a: any) => a.id === showActionDetail) || ACTIONS.find(a => a.id === showActionDetail);
    if (!action) return null;
    const isDone = completedActions.has(action.id);
    const assignmentId = (action as any).assignment_id;
    // Find matching template for richer data — fallback to action's own data for employees
    const tpl = ACTION_TEMPLATES.find(t => t.titre === action.title) || ((action as any).actionType ? {
      titre: action.title, type: (action as any).actionType, phase: (action as any).date || "",
      delaiRelatif: (action as any).date, obligatoire: false, description: (action as any).subtitle,
      options: (action as any).options, piecesRequises: (action as any).piecesRequises, dureeEstimee: (action as any).dureeEstimee || (action as any).duree_estimee, lienExterne: (action as any).lienExterne, parcours: (action as any).badge || "",
    } as any : null);
    const meta = tpl ? ACTION_TYPE_META[tpl.type] : null;
    return (
      <>
      <div onClick={() => setShowActionDetail(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.2)", zIndex: 1000 }} />
      <div className="iz-panel" style={{ position: "fixed", top: 0, right: 0, width: 480, height: "100vh", background: C.white, boxShadow: "-4px 0 24px rgba(0,0,0,.1)", zIndex: 1001, display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "24px 28px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: C.text, margin: 0, lineHeight: 1.4 }}>{action.title}</h2>
            {action.subtitle && <div style={{ fontSize: 13, color: C.textLight, marginTop: 4 }}>{action.subtitle}</div>}
            {meta && <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6 }}><meta.Icon size={14} color={meta.color} /><span style={{ fontSize: 13, color: meta.color, fontWeight: 500 }}>{meta.label}</span></div>}
          </div>
          <button onClick={() => setShowActionDetail(null)} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={22} color={C.textLight} /></button>
        </div>
        <div style={{ flex: 1, padding: "20px 28px", overflow: "auto" }}>
          {/* Info grid */}
          <div style={{ display: "grid", gridTemplateColumns: "110px 1fr", gap: "12px 0", fontSize: 14, marginBottom: 20 }}>
            <span style={{ color: C.textLight }}>Date</span>
            <span style={{ fontWeight: 500, color: C.text }}>{action.date || "—"}</span>
            <span style={{ color: C.textLight }}>Statut</span>
            <span><span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "3px 10px", borderRadius: 12, fontSize: 12, fontWeight: 600, background: isDone ? C.greenLight : action.urgent ? C.redLight : C.bg, color: isDone ? C.green : action.urgent ? C.red : C.text }}>{isDone ? "Terminé" : action.urgent ? "En retard" : "À faire"}</span></span>
            {action.badge && <><span style={{ color: C.textLight }}>Parcours</span><span><span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 10px", borderRadius: 12, background: C.pinkLight, fontSize: 11, fontWeight: 600, color: C.pink }}><span style={{ width: 6, height: 6, borderRadius: "50%", background: C.pink }} />{action.badge}</span></span></>}
            {tpl && <><span style={{ color: C.textLight }}>Phase</span><span style={{ fontWeight: 500 }}>{tpl.phase}</span></>}
            {tpl && <><span style={{ color: C.textLight }}>Délai</span><span style={{ fontWeight: 500 }}>{tpl.delaiRelatif}</span></>}
            {tpl && tpl.dureeEstimee && <><span style={{ color: C.textLight }}>Durée estimée</span><span style={{ fontWeight: 500 }}>{tpl.dureeEstimee}</span></>}
            {tpl && <><span style={{ color: C.textLight }}>{t('dash.obligatory')}</span><span style={{ fontWeight: 500, color: tpl.obligatoire ? C.red : C.textLight }}>{tpl.obligatoire ? "Oui" : "Non"}</span></>}
          </div>
          {/* Description */}
          {tpl && (
            <div style={{ padding: "14px 16px", background: C.bg, borderRadius: 10, marginBottom: 16, fontSize: 14, color: C.text, lineHeight: 1.6 }}>
              {tpl.description}
            </div>
          )}
          {/* Action-specific content */}
          {((action as any).actionType === "document" || action.type === "admin") && !isDone && (
            <div style={{ padding: "14px 16px", background: C.redLight, borderRadius: 10, marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
              <AlertTriangle size={18} color={C.red} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.red }}>Action urgente</div>
                <div style={{ fontSize: 12, color: C.text }}>{action.subtitle || "Des pièces administratives sont manquantes."}</div>
              </div>
            </div>
          )}
          {/* RDV / Visite / Entretien — meeting info */}
          {tpl && (tpl.type === "rdv" || tpl.type === "visite" || tpl.type === "entretien") && (() => {
            const opts = (tpl as any).options || {};
            const lieu = opts.lieu;
            const participants = opts.participants;
            const heure = opts.heureDefault || (tpl as any).heureDefault;
            const trame = Array.isArray(opts.trame) ? opts.trame.filter(Boolean) : [];
            const isVisio = lieu && /https?:\/\//i.test(lieu);
            const meetingLabel = tpl.type === "visite" ? "Visite" : tpl.type === "entretien" ? "Entretien" : "Rendez-vous";
            // Resolve guide token (buddy:, manager:, rh:, user:<id>) to a display name
            const accompagnants = (myCollab as any)?.accompagnants || [];
            const matchRole = (regex: RegExp) => {
              const a = accompagnants.find((x: any) => regex.test((x.role || "").toLowerCase()));
              return a ? (a.name || `${a.prenom || ""} ${a.nom || ""}`.trim() || null) : null;
            };
            const resolveGuide = (g: string | undefined): string | null => {
              if (!g) return null;
              if (g === "buddy:") return matchRole(/buddy|parrain/) || "Buddy non assigné";
              if (g === "manager:") return matchRole(/manager/) || "Manager non assigné";
              if (g === "rh:") return matchRole(/hrbp|^rh|admin_?rh/) || "RH non assigné";
              const m = g.match(/^user:(\d+)$/);
              if (m) {
                const a = accompagnants.find((x: any) => String(x.user_id || x.id) === m[1]);
                return a ? (a.name || `${a.prenom || ""} ${a.nom || ""}`.trim()) : "Personne désignée";
              }
              return g; // legacy free text
            };
            const guideName = resolveGuide(opts.guide);
            return (
              <div style={{ padding: "14px 16px", background: C.bg, borderRadius: 10, marginBottom: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, letterSpacing: 1, marginBottom: 10, textTransform: "uppercase" }}>Informations {meetingLabel.toLowerCase()}</div>
                <div style={{ display: "grid", gridTemplateColumns: "20px 1fr", gap: "10px 10px", fontSize: 13, color: C.text, alignItems: "center" }}>
                  {heure && (<>
                    <Clock size={14} color={C.textMuted} />
                    <span><strong style={{ color: C.textLight, fontWeight: 500 }}>Heure :</strong> {heure}</span>
                  </>)}
                  {lieu && (<>
                    {isVisio ? <Link size={14} color={C.blue} /> : <MapPin size={14} color={C.textMuted} />}
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
                      <strong style={{ color: C.textLight, fontWeight: 500 }}>{isVisio ? "Lien visio :" : "Lieu :"}</strong>{" "}
                      {isVisio ? (
                        <a href={lieu} target="_blank" rel="noopener noreferrer" style={{ color: C.blue, textDecoration: "none" }}>{lieu}</a>
                      ) : lieu}
                    </span>
                  </>)}
                  {participants && (<>
                    <Users size={14} color={C.textMuted} />
                    <span><strong style={{ color: C.textLight, fontWeight: 500 }}>Participants :</strong> {participants}</span>
                  </>)}
                  {guideName && (<>
                    <UserCheck size={14} color={C.textMuted} />
                    <span><strong style={{ color: C.textLight, fontWeight: 500 }}>{tpl.type === "visite" ? "Guide :" : "Accompagnateur :"}</strong> {guideName}</span>
                  </>)}
                  {!lieu && !participants && !heure && !guideName && (
                    <div style={{ gridColumn: "1/-1", fontSize: 12, color: C.textMuted, fontStyle: "italic" }}>Détails à confirmer avec votre RH/manager.</div>
                  )}
                </div>
                {tpl.type === "entretien" && trame.length > 0 && (
                  <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px dashed ${C.border}` }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: C.text, marginBottom: 6 }}>Points abordés</div>
                    <ul style={{ margin: 0, paddingLeft: 20, fontSize: 12, color: C.textLight, lineHeight: 1.7 }}>
                      {trame.map((q: string, i: number) => <li key={i}>{q}</li>)}
                    </ul>
                  </div>
                )}
                {isVisio && !isDone && (
                  <a href={lieu} target="_blank" rel="noopener noreferrer" className="iz-btn-pink" style={{ ...sBtn("pink"), padding: "8px 16px", fontSize: 12, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, marginTop: 12 }}>
                    <Link size={14} /> Rejoindre la visio
                  </a>
                )}
              </div>
            );
          })()}
          {/* Message — channel info + template preview with variable substitution */}
          {tpl && tpl.type === "message" && (() => {
            const opts = (tpl as any).options || {};
            const canal = opts.canal || "inapp";
            const destinataires = opts.destinataires;
            const rawTemplate: string = opts.template || "";
            const vars: Record<string, string> = {
              prenom: myCollab?.prenom || "",
              nom: myCollab?.nom || "",
              poste: myCollab?.poste || "",
              departement: myCollab?.departement || myCollab?.departement_nom || "",
              site: myCollab?.site || "",
              manager: myCollab?.manager_nom || "",
            };
            const filledTemplate = rawTemplate.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, k) => vars[k] ?? `{{${k}}}`);
            const canalMeta: Record<string, { label: string; icon: any; color: string }> = {
              inapp: { label: "In-app", icon: Bell, color: C.blue },
              email: { label: "Email", icon: Send, color: C.pink },
              slack: { label: "Slack", icon: MessageSquare, color: "#611F69" },
              teams: { label: "Teams", icon: MessageSquare, color: "#5059C9" },
            };
            const meta = canalMeta[canal] || canalMeta.inapp;
            const CanalIcon = meta.icon;
            return (
              <div style={{ padding: "14px 16px", background: C.bg, borderRadius: 10, marginBottom: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, letterSpacing: 1, marginBottom: 10, textTransform: "uppercase" }}>Informations message</div>
                <div style={{ display: "grid", gridTemplateColumns: "20px 1fr", gap: "10px 10px", fontSize: 13, color: C.text, alignItems: "center", marginBottom: rawTemplate ? 12 : 0 }}>
                  <CanalIcon size={14} color={meta.color} />
                  <span><strong style={{ color: C.textLight, fontWeight: 500 }}>Canal :</strong> {meta.label}</span>
                  {destinataires && (<>
                    <Users size={14} color={C.textMuted} />
                    <span><strong style={{ color: C.textLight, fontWeight: 500 }}>Destinataires :</strong> {destinataires}</span>
                  </>)}
                </div>
                {rawTemplate && (
                  <>
                    <div style={{ fontSize: 12, fontWeight: 600, color: C.text, marginBottom: 6, paddingTop: 8, borderTop: `1px dashed ${C.border}` }}>Message à envoyer</div>
                    <div style={{ padding: "10px 12px", background: C.white, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 13, color: C.text, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{filledTemplate}</div>
                    {!isDone && (
                      <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                        <button onClick={() => { navigator.clipboard.writeText(filledTemplate).then(() => addToast("Message copié dans le presse-papier", "success")).catch(() => addToast("Copie impossible", "error")); }} className="iz-btn-outline" style={{ ...sBtn("outline"), padding: "8px 14px", fontSize: 12, display: "inline-flex", alignItems: "center", gap: 6 }}>
                          <FileText size={14} /> Copier le message
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })()}
          {/* Passation — handover items + successor */}
          {tpl && tpl.type === "passation" && (() => {
            const elements: string[] = ((tpl as any).options?.elements || []).filter(Boolean);
            const successeur = (tpl as any).options?.successeur;
            if (elements.length === 0 && !successeur) return null;
            const checked = subtaskChecks[tpl.id] || {};
            const doneCount = elements.filter((_, i) => checked[i]).length;
            return (
              <div style={{ padding: "14px 16px", background: C.bg, borderRadius: 10, marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, letterSpacing: 1, textTransform: "uppercase" }}>Éléments à transférer ({doneCount}/{elements.length})</div>
                  {successeur && <span style={{ fontSize: 11, color: C.textMuted }}>Successeur : <strong style={{ color: C.text }}>{successeur}</strong></span>}
                </div>
                {elements.map((el: string, i: number) => {
                  const isChecked = !!checked[i];
                  return (
                    <label key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 6, cursor: "pointer", background: isChecked ? C.greenLight : C.white, border: `1px solid ${isChecked ? C.green : C.border}`, marginBottom: 6 }}>
                      <input type="checkbox" checked={isChecked} onChange={() => setSubtaskChecks(prev => ({ ...prev, [tpl.id]: { ...(prev[tpl.id] || {}), [i]: !isChecked } }))} style={{ accentColor: C.pink }} />
                      <span style={{ fontSize: 13, color: C.text, textDecoration: isChecked ? "line-through" : "none", opacity: isChecked ? 0.7 : 1 }}>{el}</span>
                    </label>
                  );
                })}
              </div>
            );
          })()}
          {tpl && tpl.lienExterne && !isDone && (() => {
            const isFormation = tpl.type === "formation";
            const support = (tpl as any).options?.support;
            const duree = (tpl as any).dureeEstimee || (tpl as any).duree_estimee;
            return (
              <div style={{ padding: "12px 16px", border: `1px solid ${C.border}`, borderRadius: 8, marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <Link size={16} color={C.blue} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{isFormation ? "Accéder à l'e-learning" : "Accéder à la ressource"}</div>
                    <div style={{ fontSize: 11, color: C.textLight, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{tpl.lienExterne}</div>
                  </div>
                  <a href={tpl.lienExterne} target="_blank" rel="noopener noreferrer" className="iz-btn-pink" style={{ ...sBtn("pink"), padding: "6px 16px", fontSize: 12, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}>Accès</a>
                </div>
                {isFormation && (duree || support) && (
                  <div style={{ display: "flex", gap: 14, marginTop: 10, paddingTop: 10, borderTop: `1px dashed ${C.border}`, fontSize: 12, color: C.textLight }}>
                    {duree && <span><strong style={{ color: C.text }}>Durée :</strong> {duree}</span>}
                    {support && <span><strong style={{ color: C.text }}>Support :</strong> {support}</span>}
                  </div>
                )}
              </div>
            );
          })()}
          {/* Individual pieces upload — rich dropzone per piece */}
          {tpl && tpl.piecesRequises && tpl.piecesRequises.length > 0 && !isDone && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span>Pièces à fournir ({tpl.piecesRequises.filter(p => uploadedPieces[`${tpl.id}-${p}`]).length}/{tpl.piecesRequises.length})</span>
                <span style={{ fontSize: 11, color: C.textMuted }}>Glissez ou cliquez</span>
              </div>
              {tpl.piecesRequises.map((piece, pi) => {
                const key = `${tpl.id}-${piece}`;
                const status = uploadedPieces[key];
                const handleFile = async (file: File) => {
                  if (!myCollab?.id) { addToast("Profil collaborateur introuvable", "error"); return; }
                  setUploadedPieces(prev => ({ ...prev, [key]: "uploaded" }));
                  try {
                    await uploadDocument(file, myCollab.id, action.title, piece);
                    addToast(`"${piece}" envoyé`, "success");
                  } catch (err: any) {
                    setUploadedPieces(prev => { const s = { ...prev }; delete s[key]; return s; });
                    addToast(`Échec de l'envoi : ${err?.message || "erreur inconnue"}`, "error");
                  }
                };
                return (
                  <div key={pi} style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 6 }}>{piece}</div>
                    {status === "validated" ? (
                      <div className="iz-fade-in" style={{ padding: "14px 16px", background: C.greenLight, borderRadius: 12, display: "flex", alignItems: "center", gap: 10 }}>
                        <CheckCircle size={18} color={C.green} />
                        <div style={{ fontSize: 13, fontWeight: 500, color: C.green }}>Validé par RH</div>
                      </div>
                    ) : status === "uploaded" ? (
                      <div className="iz-fade-in" style={{ padding: "14px 16px", background: C.amberLight, borderRadius: 12, display: "flex", alignItems: "center", gap: 10 }}>
                        <Clock size={18} color={C.amber} />
                        <div style={{ fontSize: 13, fontWeight: 500, color: C.amber }}>En attente de validation</div>
                      </div>
                    ) : (
                      <label
                        className="iz-upload-zone"
                        style={{ display: "block", borderRadius: 12, padding: "24px 20px", textAlign: "center", cursor: "pointer", border: `2px dashed ${status === "refused" ? C.red : C.border}`, background: status === "refused" ? C.redLight : "transparent", transition: "border-color .15s, background .15s" }}
                        onDragOver={e => { e.preventDefault(); (e.currentTarget as HTMLElement).style.borderColor = C.pink; (e.currentTarget as HTMLElement).style.background = C.pinkBg; }}
                        onDragLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = status === "refused" ? C.red : C.border; (e.currentTarget as HTMLElement).style.background = status === "refused" ? C.redLight : "transparent"; }}
                        onDrop={async e => {
                          e.preventDefault();
                          (e.currentTarget as HTMLElement).style.borderColor = status === "refused" ? C.red : C.border;
                          (e.currentTarget as HTMLElement).style.background = status === "refused" ? C.redLight : "transparent";
                          const file = e.dataTransfer.files?.[0];
                          if (file) await handleFile(file);
                        }}
                      >
                        <input type="file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx,.txt,.csv" style={{ display: "none" }} onChange={async e => {
                          const file = e.target.files?.[0]; if (!file) return;
                          await handleFile(file);
                          e.target.value = "";
                        }} />
                        <Upload size={22} color={status === "refused" ? C.red : C.textLight} style={{ marginBottom: 6 }} />
                        <div style={{ fontSize: 13, color: C.text }}>Glisser-déposer ou <span style={{ color: status === "refused" ? C.red : C.pink, fontWeight: 600, textDecoration: "underline" }}>{status === "refused" ? "Renvoyer" : "Importer"}</span> un fichier</div>
                        <div style={{ fontSize: 11, color: C.textMuted, marginTop: 4 }}>Image (png, jpeg…), PDF, Office (word, excel, txt, csv…)</div>
                        {status === "refused" && <div style={{ fontSize: 11, color: C.red, fontWeight: 600, marginTop: 6 }}>Document refusé — merci de le renvoyer</div>}
                      </label>
                    )}
                  </div>
                );
              })}
            </div>
          )}
          {tpl && tpl.type === "formulaire" && !isDone && (() => {
            const formId = (tpl as any).id ?? action.id;
            const isOpen = expandedFormId === formId;
            const champs: any[] = ((tpl as any).options?.champs) || [];
            return (
              <div style={{ marginBottom: 16 }}>
                <button onClick={() => setExpandedFormId(isOpen ? null : formId)} className="iz-btn-outline" style={{ ...sBtn("outline"), width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  <ClipboardList size={16} /> {isOpen ? "Fermer le formulaire" : "Remplir le formulaire"}
                </button>
                {isOpen && (
                  <div style={{ marginTop: 12, padding: "16px 18px", background: C.bg, borderRadius: 10, border: `1px solid ${C.border}` }}>
                    {champs.length === 0 ? (
                      <div style={{ fontSize: 13, color: C.textMuted, textAlign: "center", padding: "16px 0" }}>
                        Aucun champ n'est configuré pour ce formulaire. Contactez votre RH.
                      </div>
                    ) : (
                      <>
                        <div style={{ display: "grid", gap: 14, marginBottom: 16 }}>
                          {champs.map((ch: any, ci: number) => {
                            const fieldKey = `${formId}_${ci}_${(ch.label || "").replace(/\s+/g, "_")}`;
                            const val = formFieldValues[fieldKey] ?? "";
                            const setVal = (v: any) => setFormFieldValues((prev: any) => ({ ...prev, [fieldKey]: v }));
                            const inputStyle = { ...sInput, width: "100%", boxSizing: "border-box" as const, fontFamily: font, background: C.white, border: `1px solid ${C.border}` };
                            const labelLower = (ch.label || "").toLowerCase();
                            const isNationalityField = /nationalit/.test(labelLower) || /pays|country/.test(labelLower);
                            return (
                              <div key={ci}>
                                <label style={{ fontSize: 12, fontWeight: 600, color: C.textMuted, display: "block", marginBottom: 4 }}>{ch.label || `Champ ${ci + 1}`}</label>
                                {isNationalityField ? (
                                  <CountryPicker value={val} onChange={setVal} />
                                ) : ch.type === "date" ? (
                                  <input type="date" value={val} onChange={e => setVal(e.target.value)} style={inputStyle} />
                                ) : ch.type === "nombre" ? (
                                  <input type="number" value={val} onChange={e => setVal(e.target.value)} style={inputStyle} />
                                ) : ch.type === "email" ? (
                                  <input type="email" value={val} onChange={e => setVal(e.target.value)} style={inputStyle} />
                                ) : ch.type === "textarea" ? (
                                  <textarea rows={3} value={val} onChange={e => setVal(e.target.value)} style={{ ...inputStyle, resize: "vertical" as const }} />
                                ) : ch.type === "choix" ? (
                                  <select value={val} onChange={e => setVal(e.target.value)} style={inputStyle}>
                                    <option value="">— Sélectionner —</option>
                                    {(ch.options || []).map((o: string, oi: number) => <option key={oi} value={o}>{o}</option>)}
                                  </select>
                                ) : (
                                  <input type="text" value={val} onChange={e => setVal(e.target.value)} style={inputStyle} />
                                )}
                              </div>
                            );
                          })}
                        </div>
                        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                          <button onClick={() => setExpandedFormId(null)} style={{ ...sBtn("outline"), fontSize: 13, padding: "8px 16px" }}>Annuler</button>
                          <button onClick={() => {
                            handleCompleteAction(action.id, (action as any).assignment_id);
                            setExpandedFormId(null);
                            addToast("Formulaire sauvegardé", "success");
                          }} style={{ ...sBtn("pink"), padding: "8px 24px", fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
                            <Check size={14} /> Sauvegarder
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })()}
          {tpl && (tpl.type === "tache" || tpl.type === "checklist_it") && !isDone && (() => {
            const formId = (tpl as any).id ?? action.id;
            const items: string[] = ((tpl as any).options?.sousTaches) || ((tpl as any).options?.items) || [];
            if (items.length === 0) return null;
            const isChecked = (idx: number) => formFieldValues[`${formId}_st${idx}`] === "true";
            const toggle = (idx: number) => setFormFieldValues((prev: any) => ({ ...prev, [`${formId}_st${idx}`]: prev[`${formId}_st${idx}`] === "true" ? "false" : "true" }));
            const doneCount = items.filter((_, i) => isChecked(i)).length;
            const allDone = doneCount === items.length;
            const heading = tpl.type === "checklist_it" ? "Éléments à vérifier" : "Sous-tâches";
            return (
              <div style={{ marginBottom: 16, padding: "16px 18px", background: C.bg, borderRadius: 10, border: `1px solid ${C.border}` }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{heading}</div>
                  <div style={{ fontSize: 11, color: allDone ? C.green : C.textMuted, fontWeight: 600 }}>{doneCount}/{items.length}</div>
                </div>
                <div style={{ display: "grid", gap: 6, marginBottom: 14 }}>
                  {items.map((label: string, i: number) => {
                    const checked = isChecked(i);
                    return (
                      <button key={i} type="button" onClick={() => toggle(i)} style={{
                        display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 8,
                        background: checked ? C.greenLight : C.white,
                        border: `1px solid ${checked ? C.green : C.border}`,
                        cursor: "pointer", fontFamily: font, fontSize: 13, textAlign: "left" as const,
                        color: checked ? C.green : C.text, textDecoration: checked ? "line-through" : "none",
                      }}>
                        <div style={{ width: 18, height: 18, borderRadius: 4, border: `2px solid ${checked ? C.green : C.textMuted}`, background: checked ? C.green : C.white, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          {checked && <Check size={12} color={C.white} />}
                        </div>
                        <span style={{ flex: 1 }}>{label}</span>
                      </button>
                    );
                  })}
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <button disabled={!allDone} onClick={() => {
                    handleCompleteAction(action.id, (action as any).assignment_id);
                    addToast("Action marquée comme terminée", "success");
                  }} style={{ ...sBtn(allDone ? "pink" : "outline"), padding: "8px 20px", fontSize: 13, opacity: allDone ? 1 : 0.5, cursor: allDone ? "pointer" : "not-allowed", display: "flex", alignItems: "center", gap: 6 }}>
                    <Check size={14} /> {allDone ? "Marquer comme terminée" : `${items.length - doneCount} restante(s)`}
                  </button>
                </div>
              </div>
            );
          })()}
          {tpl && tpl.type === "questionnaire" && !isDone && (() => {
            const formId = (tpl as any).id ?? action.id;
            const isOpen = expandedFormId === formId;
            const questions: any[] = ((tpl as any).options?.questions) || [];
            return (
              <div style={{ marginBottom: 16 }}>
                <button onClick={() => setExpandedFormId(isOpen ? null : formId)} className="iz-btn-outline" style={{ ...sBtn("outline"), width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  <ClipboardList size={16} /> {isOpen ? "Fermer le questionnaire" : "Répondre au questionnaire"}
                </button>
                {isOpen && (
                  <div style={{ marginTop: 12, padding: "16px 18px", background: C.bg, borderRadius: 10, border: `1px solid ${C.border}` }}>
                    {questions.length === 0 ? (
                      <div style={{ fontSize: 13, color: C.textMuted, textAlign: "center", padding: "16px 0" }}>
                        Aucune question n'est configurée pour ce questionnaire. Contactez votre RH.
                      </div>
                    ) : (
                      <>
                        <div style={{ display: "grid", gap: 16, marginBottom: 16 }}>
                          {questions.map((q: any, qi: number) => {
                            const fieldKey = `${formId}_q${qi}`;
                            const val = formFieldValues[fieldKey] ?? "";
                            const setVal = (v: any) => setFormFieldValues((prev: any) => ({ ...prev, [fieldKey]: v }));
                            const inputStyle = { ...sInput, width: "100%", boxSizing: "border-box" as const, fontFamily: font, background: C.white, border: `1px solid ${C.border}` };
                            return (
                              <div key={qi}>
                                <label style={{ fontSize: 13, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>{qi + 1}. {q.question || `Question ${qi + 1}`}</label>
                                {q.type === "oui_non" ? (
                                  <div style={{ display: "flex", gap: 8 }}>
                                    {(["oui", "non"] as const).map(opt => (
                                      <button key={opt} type="button" onClick={() => setVal(opt)} style={{
                                        flex: 1, padding: "10px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600, fontFamily: font, cursor: "pointer",
                                        border: `1px solid ${val === opt ? C.pink : C.border}`,
                                        background: val === opt ? C.pinkBg : C.white,
                                        color: val === opt ? C.pink : C.text,
                                        textTransform: "capitalize" as const,
                                      }}>{opt}</button>
                                    ))}
                                  </div>
                                ) : q.type === "note" ? (
                                  <div style={{ display: "flex", gap: 4, flexWrap: "wrap" as const }}>
                                    {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
                                      <button key={n} type="button" onClick={() => setVal(String(n))} style={{
                                        width: 36, height: 36, borderRadius: 8, fontSize: 13, fontWeight: 600, fontFamily: font, cursor: "pointer",
                                        border: `1px solid ${String(n) === val ? C.pink : C.border}`,
                                        background: String(n) === val ? C.pink : C.white,
                                        color: String(n) === val ? C.white : C.text,
                                      }}>{n}</button>
                                    ))}
                                  </div>
                                ) : q.type === "qcm" && Array.isArray(q.options) && q.options.length > 0 ? (
                                  <div style={{ display: "grid", gap: 6 }}>
                                    {q.options.map((opt: string, oi: number) => (
                                      <button key={oi} type="button" onClick={() => setVal(opt)} style={{
                                        padding: "10px 14px", borderRadius: 8, fontSize: 13, fontWeight: 500, fontFamily: font, cursor: "pointer", textAlign: "left" as const,
                                        border: `1px solid ${val === opt ? C.pink : C.border}`,
                                        background: val === opt ? C.pinkBg : C.white,
                                        color: val === opt ? C.pink : C.text,
                                      }}>{opt}</button>
                                    ))}
                                  </div>
                                ) : (
                                  <textarea rows={3} value={val} onChange={e => setVal(e.target.value)} placeholder="Votre réponse…" style={{ ...inputStyle, resize: "vertical" as const }} />
                                )}
                              </div>
                            );
                          })}
                        </div>
                        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                          <button onClick={() => setExpandedFormId(null)} style={{ ...sBtn("outline"), fontSize: 13, padding: "8px 16px" }}>Annuler</button>
                          <button onClick={() => {
                            handleCompleteAction(action.id, (action as any).assignment_id);
                            setExpandedFormId(null);
                            addToast("Questionnaire envoyé. Merci !", "success");
                          }} style={{ ...sBtn("pink"), padding: "8px 24px", fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
                            <Check size={14} /> Envoyer
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })()}
          {/* ── Signature action: show document + sign button ── */}
          {tpl && tpl.type === "signature" && !isDone && !tpl.options?.signature_document_id && !tpl.options?.contrat_id && (
            <div style={{ padding: "14px 16px", background: C.amberLight, borderRadius: 10, marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
              <AlertTriangle size={16} color={C.amber} />
              <span style={{ fontSize: 13, color: C.amber }}>Aucun document lié à cette action.</span>
            </div>
          )}
          {/* ── Personalized contrat ── */}
          {tpl && tpl.type === "signature" && !isDone && tpl.options?.contrat_id && (
            <div style={{ marginBottom: 16 }}>
              {sigContratData ? (
                <div style={{ padding: "16px", background: C.bg, borderRadius: 10, marginBottom: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <FileSignature size={18} color={C.pink} />
                    <span style={{ fontSize: 15, fontWeight: 600 }}>{sigContratData.contrat?.nom}</span>
                  </div>
                  <div style={{ fontSize: 12, color: C.textLight, marginBottom: 12 }}>Document personnalisé pour {sigContratData.collaborateur?.prenom} {sigContratData.collaborateur?.nom}</div>
                  {/* Variables preview */}
                  <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: "6px 12px", fontSize: 12, padding: "12px", background: C.white, borderRadius: 8, border: `1px solid ${C.border}` }}>
                    {Object.entries(sigContratData.variables || {}).filter(([_, v]) => v).slice(0, 8).map(([key, val]) => (
                      <><span style={{ color: C.textMuted, fontWeight: 500 }}>{key.replace(/_/g, ' ')}</span><span style={{ color: C.text }}>{String(val)}</span></>
                    ))}
                  </div>
                  {sigContratData.contrat?.fichier && (
                    <div style={{ marginTop: 8, fontSize: 11, color: C.textMuted, display: "flex", alignItems: "center", gap: 4 }}><Paperclip size={11} /> {sigContratData.contrat.fichier}</div>
                  )}
                </div>
              ) : (
                <div style={{ padding: "12px 16px", background: C.bg, borderRadius: 10, textAlign: "center", fontSize: 13, color: C.textMuted }}>Chargement du contrat...</div>
              )}
              {sigContratData && (
                <button disabled={sigActionLoading} onClick={async () => {
                  setSigActionLoading(true);
                  try {
                    handleCompleteAction(action.id, assignmentId);
                    addToast("Contrat signé avec succès", "success");
                  } catch { addToast("Erreur lors de la signature", "error"); }
                  setSigActionLoading(false);
                }} className="iz-btn-pink" style={{ ...sBtn("pink"), width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  <PenTool size={16} /> {sigActionLoading ? "En cours..." : "Signer le contrat"}
                </button>
              )}
            </div>
          )}
          {tpl && (tpl.type === "signature" || tpl.type === "lecture") && !isDone && tpl.options?.signature_document_id && !tpl.options?.contrat_id && (
            <div style={{ marginBottom: 16 }}>
              {sigActionAck?.document && (() => {
                const doc = sigActionAck.document;
                const apiBase = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8001/api/v1';
                const tenantId = localStorage.getItem('illizeo_tenant_id') || (import.meta as any).env?.VITE_TENANT_ID || 'illizeo';
                const token = localStorage.getItem('illizeo_token') || '';
                const fileUrl = (inline: boolean) => `${apiBase}/signature-documents/${doc.id}/file?${inline ? 'inline=1&' : ''}token=${encodeURIComponent(token)}&tenant=${encodeURIComponent(tenantId)}`;
                const friendlyError = (status: number) => {
                  if (status === 404) return "Ce document n'a pas encore été téléversé par votre RH. Contactez-les pour qu'ils ajoutent le PDF.";
                  if (status === 403) return "Vous n'êtes pas autorisé(e) à consulter ce document.";
                  return `Erreur ${status}`;
                };
                const fetchAuth = async (inline: boolean) => {
                  const res = await fetch(`${apiBase}/signature-documents/${doc.id}/file${inline ? '?inline=1' : ''}`, {
                    headers: { Authorization: `Bearer ${token}`, 'X-Tenant': tenantId },
                  });
                  if (!res.ok) { const e: any = new Error(friendlyError(res.status)); e.status = res.status; throw e; }
                  return res.blob();
                };
                const openInline = async () => {
                  try {
                    const blob = await fetchAuth(true);
                    const url = URL.createObjectURL(blob);
                    window.open(url, '_blank', 'noopener,noreferrer');
                    setTimeout(() => URL.revokeObjectURL(url), 60000);
                  } catch (err: any) {
                    addToast(err?.message || "Impossible d'ouvrir le document", 'error');
                  }
                };
                const downloadFile = async () => {
                  try {
                    const blob = await fetchAuth(false);
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url; a.download = doc.fichier_nom || `document-${doc.id}.pdf`;
                    document.body.appendChild(a); a.click(); a.remove();
                    setTimeout(() => URL.revokeObjectURL(url), 60000);
                  } catch (err: any) {
                    addToast(err?.message || 'Téléchargement impossible', 'error');
                  }
                };
                const hasFile = !!doc.fichier_nom;
                return (
                  <div style={{ padding: "14px 16px", background: C.bg, borderRadius: 10, marginBottom: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                      {doc.type === "lecture" ? <BookOpen size={16} color={C.blue} /> : <PenTool size={16} color={C.pink} />}
                      <span style={{ fontSize: 14, fontWeight: 600 }}>{doc.titre}</span>
                    </div>
                    {doc.description && <p style={{ fontSize: 12, color: C.textLight, margin: "0 0 8px", lineHeight: 1.5 }}>{doc.description}</p>}
                    {doc.fichier_nom && <div style={{ fontSize: 11, color: C.textMuted, display: "flex", alignItems: "center", gap: 4, marginBottom: 10 }}><Paperclip size={11} /> {doc.fichier_nom}</div>}
                    {hasFile ? (
                      <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={openInline} style={{ ...sBtn("outline"), padding: "8px 14px", fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}>
                          <BookOpen size={14} /> Lire le document
                        </button>
                        <button onClick={downloadFile} style={{ ...sBtn("outline"), padding: "8px 14px", fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}>
                          <Paperclip size={14} /> Télécharger
                        </button>
                      </div>
                    ) : (
                      <div style={{ padding: "10px 12px", background: C.amberLight, borderRadius: 8, display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: C.amber }}>
                        <AlertTriangle size={14} />
                        <span>Le PDF n'a pas encore été téléversé par votre RH.</span>
                      </div>
                    )}
                  </div>
                );
              })()}
              {sigActionAck && (sigActionAck.statut === 'signe' || sigActionAck.statut === 'lu') ? (
                <div style={{ padding: "12px 16px", background: C.greenLight, borderRadius: 10, display: "flex", alignItems: "center", gap: 8 }}>
                  <CheckCircle size={16} color={C.green} />
                  <span style={{ fontSize: 13, fontWeight: 500, color: C.green }}>{sigActionAck.document?.type === "lecture" ? "Document lu et confirmé" : "Document signé"}</span>
                </div>
              ) : sigActionAck ? (
                <button disabled={sigActionLoading} onClick={async () => {
                  setSigActionLoading(true);
                  try {
                    await acknowledgeDoc(sigActionAck.id);
                    setSigActionAck({ ...sigActionAck, statut: sigActionAck.document?.type === "lecture" ? "lu" : "signe" });
                    handleCompleteAction(action.id, assignmentId);
                    addToast(sigActionAck.document?.type === "lecture" ? "Lecture confirmée" : "Document signé avec succès", "success");
                  } catch { addToast("Erreur lors de la signature", "error"); }
                  setSigActionLoading(false);
                }} className="iz-btn-pink" style={{ ...sBtn("pink"), width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  <PenTool size={16} /> {sigActionLoading ? "En cours..." : sigActionAck.document?.type === "lecture" ? "Confirmer la lecture" : "Signer le document"}
                </button>
              ) : (
                <div style={{ padding: "12px 16px", background: C.bg, borderRadius: 10, textAlign: "center", fontSize: 13, color: C.textMuted }}>Chargement du document...</div>
              )}
            </div>
          )}
          {isDone && (
            <div className="iz-fade-in" style={{ padding: "16px 20px", background: C.greenLight, borderRadius: 10, display: "flex", alignItems: "center", gap: 10 }}>
              <CheckCircle size={20} color={C.green} />
              <span style={{ fontSize: 14, fontWeight: 500, color: C.green }}>Action complétée avec succès</span>
            </div>
          )}
        </div>
        <div style={{ padding: "16px 28px", borderTop: `1px solid ${C.border}`, display: "flex", gap: 10, justifyContent: "flex-end" }}>
          {isDone ? (
            <button className="iz-btn-outline" onClick={() => { handleReactivateAction(action.id, assignmentId); }} style={sBtn("outline")}>Réactiver</button>
          ) : (
            <button className="iz-btn-pink" onClick={() => { handleCompleteAction(action.id, assignmentId); }} style={{ ...sBtn("pink"), padding: "10px 28px" }}>Marquer comme terminé</button>
          )}
        </div>
      </div>
      </>
    );
  };

  // ─── PROFILE MODAL ───────────────────────────────────────
  const renderProfileModal = () => {
    if (!showProfile) return null;
    const tabs = [
      { id: "infos", label: "Informations personnelles" },
      { id: "password", label: "Mot de passe" },
      { id: "notifs", label: "Notifications" },
      { id: "notifs_res", label: "Notifications ressources" },
    ];
    return (
      <div className="iz-overlay" style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
        {/* overflow:hidden + flex column ensures the rounded corners clip the
            inner scrollbar properly. Without ça, le scrollbar natif bleed
            jusqu'au bord droit et écrase l'arrondi. */}
        <div className="iz-modal" style={{ background: C.white, borderRadius: 16, width: 900, maxHeight: "85vh", overflow: "hidden", position: "relative", display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.pink, letterSpacing: 1 }}>illizeo</div>
            <button onClick={() => setShowProfile(false)} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={22} color={C.textLight} /></button>
          </div>
          <div style={{ flex: 1, overflow: "auto" }}>
          <div style={{ textAlign: "center", padding: "0 40px 24px" }}>
            <h1 style={{ fontSize: 36, fontWeight: 300, color: C.text, margin: "0 0 24px" }}>{(`${formData.prenom || ""} ${formData.nom || ""}`).trim() || auth.user?.name || "Mon profil"}</h1>
            <div style={{ display: "flex", justifyContent: "center", gap: 32, borderBottom: `2px solid ${C.border}` }}>
              {tabs.map(t => (
                <button key={t.id} onClick={() => setProfileTab(t.id)} style={{ padding: "8px 0 12px", fontSize: 14, fontWeight: profileTab === t.id ? 600 : 400, color: profileTab === t.id ? C.text : C.textLight, background: "none", border: "none", borderBottom: profileTab === t.id ? `3px solid ${C.pink}` : "3px solid transparent", cursor: "pointer", fontFamily: font }}>{t.label}</button>
              ))}
            </div>
          </div>
          <div style={{ padding: "24px 56px 40px" }}>
            {profileTab === "infos" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px 32px" }}>
                {/* Prénom + Nom — éditables, bindés sur profileForm. À la
                    sauvegarde, concaténés en user.name. */}
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: C.text }}>Prénom</label>
                  <input value={profileForm.prenom || ""} onChange={e => setProfileForm((p: any) => ({ ...p, prenom: e.target.value }))} style={{ ...sInput, marginTop: 6 }} />
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: C.text }}>Nom de famille</label>
                  <input value={profileForm.nom || ""} onChange={e => setProfileForm((p: any) => ({ ...p, nom: e.target.value }))} style={{ ...sInput, marginTop: 6 }} />
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: C.text }}>Email</label>
                  <input type="email" value={profileForm.email || ""} onChange={e => setProfileForm((p: any) => ({ ...p, email: e.target.value }))} style={{ ...sInput, marginTop: 6 }} />
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: C.text }}>Date de naissance <span style={{ color: C.textMuted, fontWeight: 400 }}>Optionnel</span></label>
                  <input value={formData.dateNaissance || ""} readOnly style={{ ...sInput, marginTop: 6 }} />
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: C.text }}>Genre *</label>
                  <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
                    {["Homme", "Femme", "Neutre"].map(g => (
                      <div key={g} style={{ flex: 1, padding: "10px 16px", borderRadius: 8, border: `2px solid ${formData.genre === g ? C.pink : C.border}`, display: "flex", alignItems: "center", gap: 10, cursor: "pointer", background: formData.genre === g ? C.pinkBg : C.white }}>
                        <div style={{ width: 20, height: 20, borderRadius: "50%", border: `2px solid ${formData.genre === g ? C.pink : C.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {formData.genre === g && <div style={{ width: 10, height: 10, borderRadius: "50%", background: C.pink }} />}
                        </div>
                        <span style={{ fontSize: 14 }}>{g}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: C.text }}>Langue</label>
                  <div style={{ ...sInput, marginTop: 6, display: "flex", justifyContent: "space-between", alignItems: "center" }}>Français <ChevronRight size={14} color={C.textLight} style={{ transform: "rotate(90deg)" }} /></div>
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: C.text }}>Nationalité <span style={{ color: C.textMuted, fontWeight: 400 }}>Optionnel</span></label>
                  <div style={{ ...sInput, marginTop: 6, display: "flex", justifyContent: "space-between", alignItems: "center" }}>Marocaine <ChevronRight size={14} color={C.textLight} style={{ transform: "rotate(90deg)" }} /></div>
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: C.text }}>Fuseau horaire</label>
                  <div style={{ ...sInput, marginTop: 6, display: "flex", justifyContent: "space-between", alignItems: "center" }}>Europe/Paris (UTC +01:00) <ChevronRight size={14} color={C.textLight} style={{ transform: "rotate(90deg)" }} /></div>
                </div>
                <div style={{ gridColumn: "1 / -1", textAlign: "center" }}>
                  <div style={{ ...sCard, padding: 24, marginBottom: 16 }}>
                    <div style={{ width: 100, height: 100, borderRadius: "50%", background: "linear-gradient(135deg, #E91E8C, #E41076)", margin: "0 auto 12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, color: C.white }}>NF</div>
                    <span style={{ fontSize: 14, textDecoration: "underline", cursor: "pointer", color: C.text }}>Importer</span>
                  </div>
                </div>
                <div><button onClick={() => window.open("https://illizeo.com/mentions-legales-et-conditions-dutilisation/", "_blank", "noopener,noreferrer")} style={{ ...sBtn("outline"), width: "100%" }}>Accéder aux CGU d'Illizeo</button></div>
                <div><button onClick={() => window.open("https://illizeo.com/politique-de-confidentialite/", "_blank", "noopener,noreferrer")} style={{ ...sBtn("outline"), width: "100%" }}>Accès à la politique de confidentialité d'Illizeo</button></div>
              </div>
            )}
            {profileTab === "password" && (
              <div>
                {/* 3 inputs password bindés sur profileForm. Submit = POST
                    /change-password (verifie current_password + applique). */}
                {[
                  { key: "password_current", label: "Mot de passe actuel *", placeholder: "Saisissez votre mot de passe actuel" },
                  { key: "password_new", label: "Nouveau mot de passe *", placeholder: "Saisissez votre nouveau mot de passe", hint: true },
                  { key: "password_confirm", label: "Confirmer le nouveau mot de passe*", placeholder: "Répétez le nouveau mot de passe" },
                ].map(field => (
                  <div key={field.key} style={{ marginBottom: 24 }}>
                    <label style={{ fontSize: 14, fontWeight: 600, color: C.text }}>
                      {field.label} {field.hint && <span style={{ fontWeight: 400, fontSize: 12, color: C.textLight }}>(Le mot de passe doit comporter au moins 8 caractères, 1 chiffre et 1 caractère spécial)</span>}
                    </label>
                    <div style={{ position: "relative", marginTop: 8 }}>
                      <input type="password" value={profileForm[field.key] || ""} onChange={e => setProfileForm((p: any) => ({ ...p, [field.key]: e.target.value }))} placeholder={field.placeholder} style={sInput} autoComplete={field.key === "password_current" ? "current-password" : "new-password"} />
                      <Eye size={18} color={C.textLight} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", cursor: "pointer" }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
            {(profileTab === "notifs" || profileTab === "notifs_res") && (
              <div>
                <div style={{ ...sInput, marginBottom: 20, display: "flex", alignItems: "center", gap: 8, maxWidth: 400 }}>
                  <Search size={16} color={C.textLight} />
                  <span style={{ color: C.textMuted, fontSize: 14 }}>Rechercher...</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${C.border}`, marginBottom: 4 }}>
                  <span style={{ flex: 1, fontSize: 12, fontWeight: 600, color: C.textMuted, textTransform: "uppercase" }}>↕ NOM</span>
                  <span style={{ width: 120, textAlign: "center", fontSize: 12, fontWeight: 600, color: C.textMuted }}>E-MAIL</span>
                  <span style={{ width: 120, textAlign: "center", fontSize: 12, fontWeight: 600, color: C.textMuted }}>SMS</span>
                </div>
                {(profileTab === "notifs" ? NOTIFICATIONS_LIST : NOTIF_RESOURCES).map((n, i) => {
                  // Cabling : profileForm.notif_prefs[notifId] = { email: bool, sms: bool }
                  // Defaults email=true, sms=false comme avant.
                  const notifId = (profileTab === "notifs" ? "n" : "r") + "_" + i;
                  const cur = (profileForm.notif_prefs && profileForm.notif_prefs[notifId]) || { email: true, sms: false };
                  const toggle = (channel: "email" | "sms") => setProfileForm((p: any) => ({
                    ...p,
                    notif_prefs: { ...(p.notif_prefs || {}), [notifId]: { ...cur, [channel]: !cur[channel] } },
                  }));
                  const Box = ({ on, onClick }: { on: boolean; onClick: () => void }) => (
                    <div onClick={onClick} style={{ width: 20, height: 20, borderRadius: 4, border: `2px solid ${on ? C.green : C.border}`, background: on ? C.greenLight : "transparent", display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                      {on && <Check size={12} color={C.green} />}
                    </div>
                  );
                  return (
                    <div key={i} style={{ display: "flex", alignItems: "center", padding: "12px 16px", background: i % 2 === 0 ? C.bg : C.white, borderRadius: 6 }}>
                      <span style={{ flex: 1, fontSize: 14, color: C.text }}>{n}</span>
                      <div style={{ width: 120, textAlign: "center" }}><Box on={!!cur.email} onClick={() => toggle("email")} /></div>
                      <div style={{ width: 120, textAlign: "center" }}><Box on={!!cur.sms} onClick={() => toggle("sms")} /></div>
                    </div>
                  );
                })}
              </div>
            )}
            <div style={{ textAlign: "center", marginTop: 32 }}>
              <button onClick={async () => {
                // Save handler par tab — câblé sur de vrais endpoints.
                try {
                  if (profileTab === "infos") {
                    const ep = await import('../api/endpoints');
                    const fullName = `${profileForm.prenom || ''} ${profileForm.nom || ''}`.trim();
                    if (!fullName) { addToast?.('Prénom et nom requis', 'error'); return; }
                    await ep.updateMyProfile({
                      name: fullName,
                      email: profileForm.email || auth.user?.email,
                      preferred_language: lang,
                    });
                    addToast?.('Profil mis à jour', 'success');
                  } else if (profileTab === "password") {
                    if (!profileForm.password_current || !profileForm.password_new) { addToast?.('Renseignez les mots de passe', 'error'); return; }
                    if (profileForm.password_new !== profileForm.password_confirm) { addToast?.('Les nouveaux mots de passe ne correspondent pas', 'error'); return; }
                    const ep = await import('../api/endpoints');
                    await ep.changeMyPassword({ current_password: profileForm.password_current, password: profileForm.password_new, password_confirmation: profileForm.password_confirm });
                    addToast?.('Mot de passe modifié', 'success');
                    setProfileForm((p: any) => ({ ...p, password_current: '', password_new: '', password_confirm: '' }));
                  } else if (profileTab === "notifs" || profileTab === "notifs_res") {
                    const ep = await import('../api/endpoints');
                    await ep.updateMyNotificationPreferences(profileForm.notif_prefs || {});
                    addToast?.('Préférences notifications enregistrées', 'success');
                  }
                } catch (e: any) {
                  let msg = e?.message || 'Erreur de sauvegarde';
                  try { const parsed = JSON.parse(msg); msg = parsed.message || msg; } catch {}
                  addToast?.(msg, 'error');
                }
              }} style={sBtn("pink")}>Sauvegarder</button>
            </div>
          </div>
          </div>
        </div>
      </div>
    );
  };

  // ═══ MON PROFIL — Full profile page with 5 tabs ═════════════
  const renderMonProfil = () => {
    const { loginGradientStart, loginGradientEnd } = ctx;
    // Use auth user data first, then collab profile from API, then mock
    const authName = auth.user?.name || "";
    const authParts = authName.split(" ");
    const c = myCollabProfile && myCollabProfile.email === auth.user?.email ? myCollabProfile : null;
    const prenom = c?.prenom || authParts[0] || formData.prenom || "—";
    const nom = c?.nom || authParts.slice(1).join(" ") || formData.nom || "—";
    const initials = `${(prenom[0] || "").toUpperCase()}${(nom[0] || "").toUpperCase()}`;
    const poste = c?.poste || c?.metier || auth.user?.role || "—";
    const emailPro = auth.user?.email || c?.email || "—";
    const gradStart = loginGradientStart || themeColor || "#1a1a2e";
    const gradEnd = loginGradientEnd || C.pink;

    const PROFILE_TABS = [
      { id: "parcours", label: "Parcours", icon: Route },
      { id: "informations", label: "Informations", icon: UserCheck },
      { id: "administratif", label: "Administratif", icon: FileText },
      { id: "ressources", label: "Ressources", icon: Package },
    ];
    // Default to "parcours" when profileTab holds a value from the legacy profile
    // modal (infos/password/notifs/notifs_res) that the new full-page profile
    // doesn't render — otherwise the page shows blank.
    const validTabs = ["parcours", "informations", "administratif", "ressources"];
    const activeTab = validTabs.includes(profileTab) ? profileTab : "parcours";

    // ── Parcours data ────────────────
    const phases = (c as any)?.parcours_phases || [];
    const actions = (c as any)?.parcours_actions || myActions;
    const totalActions = actions.length;
    const doneActions = actions.filter((a: any) => a.assignment_status === "termine" || completedActions.has(a.id)).length;
    const progressPct = totalActions > 0 ? Math.round((doneActions / totalActions) * 100) : 0;

    // Action type stats
    const typeStats: Record<string, { total: number; done: number }> = {};
    actions.forEach((a: any) => {
      const tp = a.type || "tache";
      if (!typeStats[tp]) typeStats[tp] = { total: 0, done: 0 };
      typeStats[tp].total++;
      if (a.assignment_status === "termine" || completedActions.has(a.id)) typeStats[tp].done++;
    });
    const TYPE_LABELS: Record<string, string> = {
      document: "Documents", formation: "Formations", questionnaire: "Questionnaires",
      tache: "Tâches", formulaire: "Formulaires", signature: "Signatures",
      lecture: "Lectures", entretien: "Entretiens", visite: "Visites",
      passation: "Passations", checklist_it: "Checklist IT", message: "Messages",
    };
    const TYPE_ICONS: Record<string, any> = {
      document: FileText, formation: GraduationCap, questionnaire: ClipboardList,
      tache: CheckCircle, formulaire: PenTool, signature: FileSignature,
      lecture: BookOpen, entretien: MessageSquare, visite: MapPin,
      passation: ChevronsRight, checklist_it: Laptop, message: Mail,
    };

    // Accompagnants
    const accompagnants = (c as any)?.accompagnants || [];
    const ROLE_LABELS: Record<string, string> = { hrbp: "HRBP", manager: "Manager", buddy: "Buddy / Parrain", it: "IT Support", admin_rh: "Admin RH" };
    const ROLE_COLORS: Record<string, string> = { hrbp: "#7B5EA7", manager: "#1A73E8", buddy: "#4CAF50", it: "#F9A825", admin_rh: "#E41076" };

    const { bannerImage, bannerZoom, bannerPos, employeeBannerColor, avatarImage, avatarZoom, avatarPos } = ctx;
    const bannerGradient = `linear-gradient(135deg, ${employeeBannerColor} 0%, ${employeeBannerColor}99 30%, #E41076 70%, #E91E8C 100%)`;

    return (
      <div style={{ flex: 1, overflow: "auto", background: C.bg }}>
        {/* ── Banner — same as Dashboard ── */}
        <div className="iz-fade-in" style={{ height: 180, background: bannerImage ? `url(${bannerImage})` : bannerGradient, backgroundSize: `${bannerZoom || 100}%`, backgroundPosition: `${bannerPos?.x || 50}% ${bannerPos?.y || 50}%`, borderRadius: 0, display: "flex", alignItems: "flex-end", padding: "0 40px 24px", position: "relative" }}>
          {bannerImage && <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,.1) 0%, rgba(0,0,0,.45) 100%)" }} />}
          <div style={{ display: "flex", alignItems: "center", gap: 16, position: "relative", zIndex: 2 }}>
            <div onClick={() => setShowAvatarEditor(true)} style={{ width: 56, height: 56, borderRadius: "50%", background: avatarImage ? "none" : `linear-gradient(135deg, ${gradEnd}, ${gradStart})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 600, color: "#fff", border: "3px solid #fff", overflow: "hidden", cursor: "pointer", position: "relative" }}>
              {avatarImage ? (
                <img src={avatarImage} alt="" style={{ width: `${avatarZoom || 100}%`, height: `${avatarZoom || 100}%`, objectFit: "cover", position: "relative", left: `${(50 - (avatarPos?.x || 50)) * ((avatarZoom || 100) - 100) / 100}%`, top: `${(50 - (avatarPos?.y || 50)) * ((avatarZoom || 100) - 100) / 100}%` }} />
              ) : initials}
              <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0)", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0, transition: "all .2s" }} onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = "1"; (e.currentTarget as HTMLElement).style.background = "rgba(0,0,0,.4)"; }} onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = "0"; (e.currentTarget as HTMLElement).style.background = "rgba(0,0,0,0)"; }}>
                <Upload size={16} color="#fff" />
              </div>
            </div>
            <h1 style={{ fontSize: 28, fontWeight: 600, color: "#fff", textShadow: "0 1px 8px rgba(0,0,0,.3)" }}>{prenom} {nom}</h1>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 40px" }}>
          <div style={{ display: "flex", gap: 4, marginTop: 16, borderBottom: `2px solid ${C.border}` }}>
            {PROFILE_TABS.map(tab => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button key={tab.id} onClick={() => setProfileTab(tab.id)}
                  style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 18px", fontSize: 13, fontWeight: active ? 600 : 400, color: active ? C.pink : C.textLight, background: "none", border: "none", borderBottom: active ? `3px solid ${C.pink}` : "3px solid transparent", cursor: "pointer", fontFamily: font, transition: "all .15s" }}>
                  <Icon size={15} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Tab content ── */}
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 40px 60px" }}>

          {/* ═══ TAB: Parcours ═══ */}
          {activeTab === "parcours" && !hasRealParcours && (
            <div className="iz-card" style={{ ...sCard, textAlign: "center", padding: "48px 24px", maxWidth: 600, margin: "0 auto" }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: C.amberLight, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                <AlertTriangle size={28} color={C.amber} />
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: C.text, margin: "0 0 8px" }}>Aucun parcours assigné</h3>
              <p style={{ fontSize: 13, color: C.textLight, margin: 0, lineHeight: 1.6 }}>
                Votre RH n'a pas encore associé de parcours d'intégration à votre compte.
                Contactez-le ou attendez son activation — vos actions et étapes apparaîtront ici dès qu'un parcours vous sera assigné.
              </p>
            </div>
          )}
          {activeTab === "parcours" && hasRealParcours && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 24 }}>
              {/* Left: actions by phase */}
              <div>
                {/* Progress header */}
                <div className="iz-card" style={{ ...sCard, marginBottom: 20 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                    <div>
                      <h2 style={{ fontSize: 17, fontWeight: 600, margin: 0, color: C.text }}>{myParcoursName}</h2>
                      <p style={{ fontSize: 12, color: C.textLight, margin: "4px 0 0" }}>{CAT_LABELS_MAP[myParcoursCategorie] || myParcoursCategorie}</p>
                    </div>
                    <div style={{ fontSize: 24, fontWeight: 700, color: C.pink }}>{progressPct}%</div>
                  </div>
                  <div style={{ height: 8, borderRadius: 4, background: C.bg, overflow: "hidden" }}>
                    <div className="iz-progress-bar" style={{ height: "100%", borderRadius: 4, background: `linear-gradient(90deg, ${gradStart}, ${gradEnd})`, width: `${progressPct}%` }} />
                  </div>
                  <div style={{ fontSize: 11, color: C.textMuted, marginTop: 6 }}>{doneActions}/{totalActions} actions terminées</div>
                </div>

                {/* Actions grouped by phase */}
                {phases.length > 0 ? phases.map((phase: any, pi: number) => {
                  const phaseActions = actions.filter((a: any) => a.phase_id === phase.id);
                  if (phaseActions.length === 0) return null;
                  const phaseDone = phaseActions.filter((a: any) => a.assignment_status === "termine" || completedActions.has(a.id)).length;
                  return (
                    <div key={phase.id || pi} className="iz-fade-up" style={{ marginBottom: 16 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                        <div style={{ width: 28, height: 28, borderRadius: "50%", background: C.pinkBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Route size={14} color={C.pink} />
                        </div>
                        <span style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{phase.nom || `Phase ${pi + 1}`}</span>
                        <span style={{ fontSize: 11, color: C.textMuted, marginLeft: "auto" }}>{phaseDone}/{phaseActions.length}</span>
                      </div>
                      {phaseActions.map((a: any, ai: number) => {
                        const isDone = a.assignment_status === "termine" || completedActions.has(a.id);
                        const tp = a.type || "tache";
                        const colors = ACTION_TYPE_COLORS[tp] || { bg: C.bg, color: C.textMuted };
                        const Icon = TYPE_ICONS[tp] || CheckCircle;
                        return (
                          <div key={a.id || ai} className="iz-card" style={{ ...sCard, padding: "12px 16px", marginBottom: 8, display: "flex", alignItems: "center", gap: 12, opacity: isDone ? .65 : 1 }}>
                            <div style={{ width: 32, height: 32, borderRadius: 8, background: colors.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                              <Icon size={16} color={colors.color} />
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: 13, fontWeight: 500, color: C.text, textDecoration: isDone ? "line-through" : "none" }}>{a.titre}</div>
                              {a.delai_relatif && <div style={{ fontSize: 11, color: C.textMuted }}>{a.delai_relatif}</div>}
                            </div>
                            <div style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${isDone ? C.green : C.border}`, background: isDone ? C.greenLight : "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                              onClick={() => { if (!isDone) handleCompleteAction(a.id); }}>
                              {isDone && <Check size={13} color={C.green} />}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                }) : (
                  /* Flat list when no phases */
                  <div>
                    {actions.map((a: any, ai: number) => {
                      const isDone = a.assignment_status === "termine" || completedActions.has(a.id);
                      const tp = a.type || "tache";
                      const colors = ACTION_TYPE_COLORS[tp] || { bg: C.bg, color: C.textMuted };
                      const Icon = TYPE_ICONS[tp] || CheckCircle;
                      return (
                        <div key={a.id || ai} className="iz-card" style={{ ...sCard, padding: "12px 16px", marginBottom: 8, display: "flex", alignItems: "center", gap: 12, opacity: isDone ? .65 : 1 }}>
                          <div style={{ width: 32, height: 32, borderRadius: 8, background: colors.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <Icon size={16} color={colors.color} />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 13, fontWeight: 500, color: C.text, textDecoration: isDone ? "line-through" : "none" }}>{a.titre}</div>
                            {(a.delaiRelatif || a.delai_relatif) && <div style={{ fontSize: 11, color: C.textMuted }}>{a.delaiRelatif || a.delai_relatif}</div>}
                          </div>
                          <div style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${isDone ? C.green : C.border}`, background: isDone ? C.greenLight : "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                            onClick={() => { if (!isDone) handleCompleteAction(a.id); }}>
                            {isDone && <Check size={13} color={C.green} />}
                          </div>
                        </div>
                      );
                    })}
                    {actions.length === 0 && (
                      <div className="iz-card iz-fade-up" style={{ ...sCard, textAlign: "center", padding: "48px 24px" }}>
                        <div style={{ width: 64, height: 64, borderRadius: "50%", background: C.pinkBg, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                          <Rocket size={28} color={C.pink} />
                        </div>
                        <h3 style={{ fontSize: 16, fontWeight: 600, color: C.text, margin: "0 0 8px" }}>Votre parcours va bientôt commencer</h3>
                        <p style={{ fontSize: 13, color: C.textLight, margin: 0, maxWidth: 400, marginLeft: "auto", marginRight: "auto" }}>
                          Vos actions et étapes d'intégration seront affichées ici dès qu'elles vous seront assignées. En attendant, explorez les autres onglets.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Right sidebar: stats by type */}
              <div>
                <div className="iz-card" style={{ ...sCard }}>
                  <h3 style={{ fontSize: 14, fontWeight: 600, margin: "0 0 16px", color: C.text }}>Avancement par type</h3>
                  {Object.entries(typeStats).map(([tp, st]) => {
                    const Icon = TYPE_ICONS[tp] || CheckCircle;
                    const pct = st.total > 0 ? Math.round((st.done / st.total) * 100) : 0;
                    const colors = ACTION_TYPE_COLORS[tp] || { bg: C.bg, color: C.textMuted };
                    return (
                      <div key={tp} style={{ marginBottom: 14 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                          <Icon size={14} color={colors.color} />
                          <span style={{ fontSize: 12, fontWeight: 500, color: C.text, flex: 1 }}>{TYPE_LABELS[tp] || tp}</span>
                          <span style={{ fontSize: 11, color: C.textMuted }}>{st.done}/{st.total}</span>
                        </div>
                        <div style={{ height: 5, borderRadius: 3, background: C.bg, overflow: "hidden" }}>
                          <div style={{ height: "100%", borderRadius: 3, background: colors.color, width: `${pct}%`, transition: "width .4s ease" }} />
                        </div>
                      </div>
                    );
                  })}
                  {Object.keys(typeStats).length === 0 && (
                    <div style={{ fontSize: 12, color: C.textMuted, textAlign: "center", padding: "20px 0" }}>
                      <Target size={24} color={C.border} style={{ marginBottom: 6 }} />
                      <div>L'avancement par type s'affichera quand vos actions seront assignées</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ═══ TAB: Informations ═══ */}
          {activeTab === "informations" && (() => {
            const renderField = (label: string, value: any) => value && value !== "—" ? (
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: C.textMuted, textTransform: "uppercase", marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: 14, color: C.text }}>{value}</div>
              </div>
            ) : null;

            const { editingInfoSection, setEditingInfoSection, editInfoData, setEditInfoData } = ctx;

            const startEdit = (section: string) => {
              setEditingInfoSection(section);
              setEditInfoData({
                telephone: c?.telephone || "",
                adresse: c?.adresse || "",
                ville: c?.ville || "",
                code_postal: c?.code_postal || "",
                pays: c?.pays || "",
                presentation: c?.presentation || "",
                passions: c?.passions || "",
              });
            };

            const saveEdit = async () => {
              try {
                if (c?.id) {
                  await apiUpdateCollab(c.id, editInfoData);
                }
                try {
                  await apiFetch('/me/collaborateur', { method: 'PUT', body: JSON.stringify(editInfoData) });
                } catch {}
                setEditingInfoSection(null);
                if (addToast) addToast("Informations mises à jour", "success");
              } catch {
                if (addToast) addToast("Erreur lors de la sauvegarde", "error");
              }
            };

            const cancelEdit = () => setEditingInfoSection(null);

            const renderEditField = (label: string, key: string, type?: string) => (
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: C.textMuted, textTransform: "uppercase", display: "block", marginBottom: 4 }}>{label}</label>
                {type === "textarea" ? (
                  <textarea value={editInfoData[key] || ""} onChange={e => setEditInfoData({ ...editInfoData, [key]: e.target.value })}
                    style={{ ...sInput, width: "100%", boxSizing: "border-box" as const, minHeight: 60, resize: "vertical" as const, fontFamily: font, fontSize: 13 }} />
                ) : (
                  <input value={editInfoData[key] || ""} onChange={e => setEditInfoData({ ...editInfoData, [key]: e.target.value })}
                    style={{ ...sInput, width: "100%", boxSizing: "border-box" as const, fontSize: 13 }} />
                )}
              </div>
            );

            const readOnlySections = [
              { title: "Identité", icon: UserCheck, fields: [
                { label: "Prénom", value: prenom },
                { label: "Nom", value: nom },
                { label: "Email professionnel", value: emailPro },
                { label: "Téléphone", value: c?.telephone },
                { label: "Date de naissance", value: c?.date_naissance ? fmtDate(c.date_naissance) : null },
                { label: "Nationalité", value: c?.nationalite },
              ]},
              { title: "Poste & Entreprise", icon: Building2, fields: [
                { label: "Poste / Métier", value: poste !== "—" ? poste : null },
                { label: "Département", value: c?.departement },
                { label: "Site", value: c?.site },
                { label: "Date d'arrivée", value: c?.date_debut ? fmtDate(c.date_debut) : (c?.dateDebut ? fmtDate(c.dateDebut) : null) },
                { label: "Type de contrat", value: c?.type_contrat },
                { label: "Manager", value: c?.manager_nom || (c?.manager ? `${c.manager.prenom} ${c.manager.nom}` : null) },
              ]},
            ];

            return (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              {/* Read-only sections */}
              {readOnlySections.map((sec, si) => {
                const filledFields = sec.fields.filter(f => f.value && f.value !== "—");
                const Icon = sec.icon;
                return (
                  <div key={si} className={`iz-card iz-fade-up iz-stagger-${si + 1}`} style={{ ...sCard }}>
                    <h3 style={{ fontSize: 14, fontWeight: 600, margin: "0 0 16px", display: "flex", alignItems: "center", gap: 8, color: C.text }}>
                      <Icon size={16} color={C.pink} /> {sec.title}
                    </h3>
                    {filledFields.length > 0 ? (
                      <div style={{ display: "grid", gridTemplateColumns: filledFields.length > 3 ? "1fr 1fr" : "1fr", gap: "14px 24px" }}>
                        {filledFields.map((f, fi) => renderField(f.label, f.value))}
                      </div>
                    ) : (
                      <div style={{ fontSize: 12, color: C.textMuted, textAlign: "center", padding: "16px 0" }}>Aucune information renseignée</div>
                    )}
                  </div>
                );
              })}

              {/* Coordonnées — editable */}
              <div className="iz-card iz-fade-up iz-stagger-3" style={{ ...sCard }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 600, margin: 0, display: "flex", alignItems: "center", gap: 8, color: C.text }}>
                    <MapPin size={16} color={C.pink} /> Coordonnées
                  </h3>
                  {editingInfoSection !== "coordonnees" && (
                    <button onClick={() => startEdit("coordonnees")} style={{ ...sBtn("outline"), padding: "4px 12px", fontSize: 11 }}>Modifier</button>
                  )}
                </div>
                {editingInfoSection === "coordonnees" ? (
                  <div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
                      {renderEditField("Adresse", "adresse")}
                      {renderEditField("Ville", "ville")}
                      {renderEditField("Code postal", "code_postal")}
                      {renderEditField("Pays", "pays")}
                    </div>
                    <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                      <button onClick={cancelEdit} style={{ ...sBtn("outline"), padding: "6px 16px", fontSize: 12 }}>Annuler</button>
                      <button onClick={saveEdit} className="iz-btn-pink" style={{ ...sBtn("pink"), padding: "6px 16px", fontSize: 12 }}>Enregistrer</button>
                    </div>
                  </div>
                ) : (
                  (() => {
                    const fields = [
                      { label: "Adresse", value: c?.adresse },
                      { label: "Ville", value: c?.ville },
                      { label: "Code postal", value: c?.code_postal },
                      { label: "Pays", value: c?.pays },
                    ].filter(f => f.value);
                    return fields.length > 0 ? (
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 24px" }}>
                        {fields.map((f, i) => renderField(f.label, f.value))}
                      </div>
                    ) : (
                      <div style={{ fontSize: 12, color: C.textMuted, textAlign: "center", padding: "16px 0" }}>
                        Aucune adresse renseignée — <span onClick={() => startEdit("coordonnees")} style={{ color: C.pink, cursor: "pointer", fontWeight: 500 }}>ajouter</span>
                      </div>
                    );
                  })()
                )}
              </div>

              {/* À propos de moi — editable */}
              <div className="iz-card iz-fade-up iz-stagger-4" style={{ ...sCard }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 600, margin: 0, display: "flex", alignItems: "center", gap: 8, color: C.text }}>
                    <Heart size={16} color={C.pink} /> À propos de moi
                  </h3>
                  {editingInfoSection !== "apropos" && (
                    <button onClick={() => startEdit("apropos")} style={{ ...sBtn("outline"), padding: "4px 12px", fontSize: 11 }}>Modifier</button>
                  )}
                </div>
                {editingInfoSection === "apropos" ? (
                  <div>
                    <div style={{ display: "grid", gap: 12, marginBottom: 14 }}>
                      {renderEditField("Présentation courte", "presentation", "textarea")}
                      {renderEditField("Passions", "passions")}
                      {renderEditField("Téléphone", "telephone")}
                    </div>
                    <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                      <button onClick={cancelEdit} style={{ ...sBtn("outline"), padding: "6px 16px", fontSize: 12 }}>Annuler</button>
                      <button onClick={saveEdit} className="iz-btn-pink" style={{ ...sBtn("pink"), padding: "6px 16px", fontSize: 12 }}>Enregistrer</button>
                    </div>
                  </div>
                ) : (
                  (() => {
                    const fields = [
                      { label: "Présentation courte", value: c?.presentation },
                      { label: "Passions", value: c?.passions },
                      { label: "Fuseau horaire", value: c?.fuseau_horaire || timezone },
                    ].filter(f => f.value);
                    return fields.length > 0 ? (
                      <div style={{ display: "grid", gap: "14px" }}>
                        {fields.map((f, i) => renderField(f.label, f.value))}
                      </div>
                    ) : (
                      <div style={{ fontSize: 12, color: C.textMuted, textAlign: "center", padding: "16px 0" }}>
                        Présentez-vous — <span onClick={() => startEdit("apropos")} style={{ color: C.pink, cursor: "pointer", fontWeight: 500 }}>ajouter</span>
                      </div>
                    );
                  })()
                )}
              </div>
            </div>
            );
          })()}

          {/* ═══ TAB: Administratif ═══ */}
          {activeTab === "administratif" && (
            <div className="iz-fade-up">
              <div className="iz-card" style={{ ...sCard, marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 600, margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
                    <FolderOpen size={18} color={C.pink} /> Documents administratifs
                  </h3>
                  <div style={{ fontSize: 12, color: C.textMuted }}>{docsSubmitted + docsValidated}/{docsTotal} documents</div>
                </div>
                {ADMIN_DOC_CATEGORIES.length > 0 ? ADMIN_DOC_CATEGORIES.map((cat: any) => {
                  const catDocs = employeeDocs.filter((d: any) => d.category_id === cat.id || d.categorie === cat.nom);
                  return (
                    <div key={cat.id} style={{ marginBottom: 16 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                        <FileText size={14} color={C.textLight} />
                        <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{cat.nom}</span>
                        <span style={{ fontSize: 11, color: C.textMuted }}>({catDocs.length} document{catDocs.length !== 1 ? "s" : ""})</span>
                      </div>
                      {cat.pieces && cat.pieces.length > 0 ? cat.pieces.map((piece: any, pi: number) => {
                        const uploaded = catDocs.find((d: any) => d.piece_id === piece.id || d.nom === piece.nom);
                        return (
                          <div key={piece.id || pi} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: C.bg, borderRadius: 8, marginBottom: 6 }}>
                            <FileText size={16} color={uploaded ? C.green : C.textMuted} />
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: 13, color: C.text }}>{piece.nom || piece.label}</div>
                              {piece.obligatoire && <span style={{ fontSize: 10, color: C.red }}>Obligatoire</span>}
                            </div>
                            {uploaded ? (
                              <span style={{ padding: "2px 10px", borderRadius: 6, fontSize: 10, fontWeight: 600, background: uploaded.statut === "valide" ? C.greenLight : C.amberLight, color: uploaded.statut === "valide" ? C.green : C.amber }}>
                                {uploaded.statut === "valide" ? "Validé" : "En attente"}
                              </span>
                            ) : (
                              <label style={{ padding: "4px 12px", borderRadius: 6, fontSize: 11, fontWeight: 500, background: C.pinkBg, color: C.pink, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                                <Upload size={12} /> Envoyer
                                <input type="file" style={{ display: "none" }} onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handleEmployeeSubmitDoc(cat.id, piece.id || piece.nom, file);
                                }} />
                              </label>
                            )}
                          </div>
                        );
                      }) : (
                        <div style={{ fontSize: 12, color: C.textMuted, padding: "8px 14px" }}>Aucune pièce définie</div>
                      )}
                    </div>
                  );
                }) : (
                  <button
                    type="button"
                    onClick={() => setShowDocPanel("admin")}
                    style={{ display: "block", width: "100%", textAlign: "center", padding: "48px 24px", background: "transparent", border: `1px dashed ${C.border}`, borderRadius: 12, cursor: "pointer", fontFamily: font, transition: "background .15s, border-color .15s" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = C.pinkBg + "55"; (e.currentTarget as HTMLElement).style.borderColor = C.pink; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.borderColor = C.border; }}
                  >
                    <div style={{ width: 64, height: 64, borderRadius: "50%", background: C.pinkBg, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                      <FolderOpen size={28} color={C.pink} />
                    </div>
                    <h3 style={{ fontSize: 16, fontWeight: 600, color: C.text, margin: "0 0 8px" }}>Documents administratifs</h3>
                    <p style={{ fontSize: 13, color: C.textLight, margin: "0 0 12px", maxWidth: 400, marginLeft: "auto", marginRight: "auto" }}>
                      Cliquez pour ouvrir le panneau et envoyer vos pièces administratives.
                    </p>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 8, background: C.pink, color: C.white, fontSize: 12, fontWeight: 600 }}>
                      <Upload size={14} /> Compléter mon dossier
                    </span>
                  </button>
                )}
              </div>

              {/* ── Formulaires à remplir ── */}
              {(() => {
                const formActions = actions.filter((a: any) => {
                  const tp = (a.type || "").toLowerCase();
                  // Strict match — "form" substring would falsely capture "formation", "formateur", etc.
                  return tp === "formulaire" || tp === "form";
                });
                if (formActions.length === 0) return null;
                return (
                  <div className="iz-card iz-fade-up iz-stagger-1" style={{ ...sCard }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                      <h3 style={{ fontSize: 15, fontWeight: 600, margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
                        <PenTool size={18} color={C.pink} /> Formulaires à remplir et à renvoyer
                      </h3>
                      <div style={{ fontSize: 12, color: C.textMuted }}>
                        {formActions.filter((a: any) => a.assignment_status === "termine" || completedActions.has(a.id)).length}/{formActions.length} complété{formActions.length !== 1 ? "s" : ""}
                      </div>
                    </div>
                    {formActions.map((fa: any) => {
                      const isDone = fa.assignment_status === "termine" || completedActions.has(fa.id);
                      const isExpanded = expandedFormId === fa.id;
                      return (
                        <div key={fa.id} style={{ marginBottom: 10 }}>
                          {/* Form header row */}
                          <div
                            onClick={() => setExpandedFormId(isExpanded ? null : fa.id)}
                            style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: C.bg, borderRadius: isExpanded ? "10px 10px 0 0" : 10, cursor: "pointer", transition: "all .15s" }}
                          >
                            <div style={{ width: 32, height: 32, borderRadius: 8, background: C.pinkBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                              <PenTool size={16} color={C.pink} />
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: 13, fontWeight: 500, color: C.text }}>{fa.titre}</div>
                              {fa.description && <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>{fa.description}</div>}
                            </div>
                            <span style={{
                              padding: "3px 10px", borderRadius: 6, fontSize: 10, fontWeight: 600,
                              background: isDone ? C.greenLight : C.redLight,
                              color: isDone ? C.green : C.red
                            }}>
                              {isDone ? "Complété" : "À compléter"}
                            </span>
                            <ChevronRight size={16} color={C.textMuted} style={{ transform: isExpanded ? "rotate(90deg)" : "none", transition: "transform .2s" }} />
                          </div>

                          {/* Expanded form fields */}
                          {isExpanded && (
                            <div style={{ background: C.bg, borderRadius: "0 0 10px 10px", padding: "16px 20px", borderTop: `1px solid ${C.border}` }}>
                              {isDone ? (
                                <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 0", color: C.green, fontSize: 13 }}>
                                  <CheckCircle size={16} /> Ce formulaire a été complété avec succès.
                                </div>
                              ) : (() => {
                                // Read dynamic fields configured by admin from action.options.champs
                                const opts = (fa as any).options || {};
                                const champs: Array<{ label: string; type: string; options?: string[]; required?: boolean }> = Array.isArray(opts.champs) ? opts.champs.filter((c: any) => c && c.label) : [];
                                if (champs.length === 0) {
                                  return (
                                    <div style={{ padding: "16px 0", fontSize: 13, color: C.textMuted, textAlign: "center", fontStyle: "italic" }}>
                                      Aucun champ n'a été configuré pour ce formulaire. Contactez votre RH.
                                    </div>
                                  );
                                }
                                return (
                                  <div>
                                    <div style={{ display: "grid", gap: 14, marginBottom: 16 }}>
                                      {champs.map((ch, ci) => {
                                        const key = `${fa.id}_field_${ci}`;
                                        const val = formFieldValues[key] ?? "";
                                        const setVal = (v: any) => setFormFieldValues((prev: any) => ({ ...prev, [key]: v }));
                                        const labelEl = (
                                          <label style={{ fontSize: 12, fontWeight: 600, color: C.textMuted, display: "block", marginBottom: 4 }}>
                                            {ch.label}{ch.required && <span style={{ color: C.red, marginLeft: 4 }}>*</span>}
                                          </label>
                                        );
                                        const baseStyle = { ...sInput, width: "100%", boxSizing: "border-box" as const };
                                        switch (ch.type) {
                                          case "textarea":
                                            return (
                                              <div key={ci}>{labelEl}
                                                <textarea rows={3} value={val} onChange={e => setVal(e.target.value)} style={{ ...baseStyle, resize: "vertical" as const, fontFamily: font }} />
                                              </div>
                                            );
                                          case "nombre":
                                            return (<div key={ci}>{labelEl}<input type="number" value={val} onChange={e => setVal(e.target.value)} style={baseStyle} /></div>);
                                          case "date":
                                            return (<div key={ci}>{labelEl}<input type="date" value={val} onChange={e => setVal(e.target.value)} style={baseStyle} /></div>);
                                          case "email":
                                            return (<div key={ci}>{labelEl}<input type="email" value={val} onChange={e => setVal(e.target.value)} style={baseStyle} /></div>);
                                          case "choix": {
                                            const choices = Array.isArray(ch.options) && ch.options.length > 0 ? ch.options : [];
                                            return (
                                              <div key={ci}>{labelEl}
                                                <select value={val} onChange={e => setVal(e.target.value)} style={{ ...baseStyle, cursor: "pointer" }}>
                                                  <option value="">— Sélectionner —</option>
                                                  {choices.map((o: string, oi: number) => <option key={oi} value={o}>{o}</option>)}
                                                </select>
                                              </div>
                                            );
                                          }
                                          case "fichier":
                                          case "file":
                                            return (
                                              <div key={ci}>{labelEl}
                                                <label style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, background: C.pinkBg, color: C.pink, fontSize: 12, fontWeight: 500, cursor: "pointer" }}>
                                                  <Upload size={14} />
                                                  {formFieldValues[`${key}_name`] || "Choisir un fichier"}
                                                  <input type="file" style={{ display: "none" }} onChange={e => {
                                                    const file = e.target.files?.[0];
                                                    if (file) setFormFieldValues((prev: any) => ({ ...prev, [key]: file, [`${key}_name`]: file.name }));
                                                  }} />
                                                </label>
                                              </div>
                                            );
                                          case "texte":
                                          default:
                                            return (<div key={ci}>{labelEl}<input type="text" value={val} onChange={e => setVal(e.target.value)} style={baseStyle} /></div>);
                                        }
                                      })}
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                      <button
                                        onClick={() => {
                                          handleCompleteAction(fa.id, (fa as any).assignment_id);
                                          setExpandedFormId(null);
                                          if (addToast) addToast("Formulaire sauvegardé avec succès", "success");
                                        }}
                                        style={{ ...sBtn("pink"), padding: "8px 24px", fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}
                                      >
                                        <Check size={14} /> Sauvegarder
                                      </button>
                                    </div>
                                  </div>
                                );
                              })()}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
          )}

          {/* ═══ TAB: Ressources ═══ */}
          {activeTab === "ressources" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 20 }}>
              {/* Équipements */}
              <div className="iz-card iz-fade-up" style={{ ...sCard }}>
                <h3 style={{ fontSize: 15, fontWeight: 600, margin: "0 0 16px", display: "flex", alignItems: "center", gap: 8 }}>
                  <Laptop size={18} color={C.blue} /> Équipements
                </h3>
                {equipments && equipments.filter((eq: any) => eq.collaborateur_id === c?.id || eq.assigned_to === c?.id).length > 0 ? (
                  equipments.filter((eq: any) => eq.collaborateur_id === c?.id || eq.assigned_to === c?.id).map((eq: any) => (
                    <div key={eq.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: C.bg, borderRadius: 8, marginBottom: 8 }}>
                      <Monitor size={16} color={C.blue} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 500, color: C.text }}>{eq.nom || eq.name}</div>
                        <div style={{ fontSize: 11, color: C.textMuted }}>{eq.type || eq.categorie || ""}</div>
                      </div>
                      <span style={{ padding: "2px 8px", borderRadius: 6, fontSize: 10, fontWeight: 600, background: eq.statut === "attribue" ? C.greenLight : C.amberLight, color: eq.statut === "attribue" ? C.green : C.amber }}>{eq.statut || "—"}</span>
                    </div>
                  ))
                ) : (
                  <div style={{ textAlign: "center", padding: "24px", color: C.textMuted, fontSize: 13 }}>Aucun équipement attribué</div>
                )}
              </div>

              {/* Formations */}
              <div className="iz-card iz-fade-up iz-stagger-1" style={{ ...sCard }}>
                <h3 style={{ fontSize: 15, fontWeight: 600, margin: "0 0 16px", display: "flex", alignItems: "center", gap: 8 }}>
                  <GraduationCap size={18} color={C.green} /> Formations
                </h3>
                {(() => {
                  const formations = actions.filter((a: any) => a.type === "formation");
                  return formations.length > 0 ? formations.map((a: any, i: number) => {
                    const isDone = a.assignment_status === "termine" || completedActions.has(a.id);
                    const lien = (a as any).lienExterne || (a as any).lien_externe || (a as any).options?.lienExterne || (a as any).options?.lien_externe;
                    const handleClick = () => {
                      if (lien) {
                        window.open(lien, "_blank", "noopener,noreferrer");
                      } else {
                        setShowActionDetail(a.id);
                      }
                    };
                    return (
                      <div
                        key={a.id || i}
                        onClick={handleClick}
                        title={lien ? `Ouvrir : ${lien}` : "Voir le détail"}
                        style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: C.bg, borderRadius: 8, marginBottom: 8, cursor: "pointer", transition: "background .15s" }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = C.greenLight; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = C.bg; }}
                      >
                        <GraduationCap size={16} color={isDone ? C.green : C.textMuted} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 500, color: C.text, textDecoration: isDone ? "line-through" : "none" }}>{a.titre}</div>
                        </div>
                        {lien && !isDone && <Link size={13} color={C.green} />}
                        {isDone && <Check size={14} color={C.green} />}
                        {!isDone && <ChevronRight size={14} color={C.textMuted} />}
                      </div>
                    );
                  }) : (
                    <div style={{ textAlign: "center", padding: "24px", color: C.textMuted, fontSize: 13 }}>Aucune formation</div>
                  );
                })()}
              </div>

              {/* Documents à lire */}
              <div className="iz-card iz-fade-up iz-stagger-2" style={{ ...sCard }}>
                <h3 style={{ fontSize: 15, fontWeight: 600, margin: "0 0 16px", display: "flex", alignItems: "center", gap: 8 }}>
                  <BookOpen size={18} color={C.amber} /> Documents à lire
                </h3>
                {(() => {
                  const lectures = actions.filter((a: any) => a.type === "lecture");
                  return lectures.length > 0 ? lectures.map((a: any, i: number) => {
                    const isDone = a.assignment_status === "termine" || completedActions.has(a.id);
                    return (
                      <div
                        key={a.id || i}
                        onClick={() => setShowActionDetail(a.id)}
                        title="Lire le document"
                        style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: C.bg, borderRadius: 8, marginBottom: 8, cursor: "pointer", transition: "background .15s" }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = C.amberLight; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = C.bg; }}
                      >
                        <BookOpen size={16} color={isDone ? C.green : C.amber} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 500, color: C.text }}>{a.titre}</div>
                        </div>
                        {isDone && <Check size={14} color={C.green} />}
                        {!isDone && <ChevronRight size={14} color={C.textMuted} />}
                      </div>
                    );
                  }) : (
                    <div style={{ textAlign: "center", padding: "24px", color: C.textMuted, fontSize: 13 }}>Aucun document</div>
                  );
                })()}
              </div>

              {/* Questionnaires */}
              <div className="iz-card iz-fade-up iz-stagger-3" style={{ ...sCard }}>
                <h3 style={{ fontSize: 15, fontWeight: 600, margin: "0 0 16px", display: "flex", alignItems: "center", gap: 8 }}>
                  <ClipboardList size={18} color={C.purple} /> Questionnaires
                </h3>
                {(() => {
                  const quizzes = actions.filter((a: any) => a.type === "questionnaire");
                  return quizzes.length > 0 ? quizzes.map((a: any, i: number) => {
                    const isDone = a.assignment_status === "termine" || completedActions.has(a.id);
                    return (
                      <div
                        key={a.id || i}
                        onClick={() => setShowActionDetail(a.id)}
                        title="Remplir le questionnaire"
                        style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: C.bg, borderRadius: 8, marginBottom: 8, cursor: "pointer", transition: "background .15s" }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = C.purple + "15"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = C.bg; }}
                      >
                        <ClipboardList size={16} color={isDone ? C.green : C.purple} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 500, color: C.text }}>{a.titre}</div>
                        </div>
                        {isDone && <Check size={14} color={C.green} />}
                        {!isDone && <ChevronRight size={14} color={C.textMuted} />}
                      </div>
                    );
                  }) : (
                    <div style={{ textAlign: "center", padding: "24px", color: C.textMuted, fontSize: 13 }}>Aucun questionnaire</div>
                  );
                })()}
              </div>
            </div>
          )}

        </div>
      </div>
    );
  };

  // ─── MON ÉQUIPE (page dédiée, accessible depuis la sidebar) ────
  const renderMonEquipe = () => {
    const c = myCollabProfile || COLLABORATEURS.find((x: any) => x.email === auth.user?.email);
    const accompagnants = (c as any)?.accompagnants || [];
    const ROLE_LABELS: Record<string, string> = { hrbp: "HRBP", manager: "Manager", buddy: "Buddy / Parrain", it: "IT Support", admin_rh: "Admin RH", recruteur: "Recruteur(se)", dsi: "DSI" };
    const ROLE_COLORS: Record<string, string> = { hrbp: "#7B5EA7", manager: "#1A73E8", buddy: "#4CAF50", it: "#F9A825", admin_rh: "#E41076", recruteur: "#00897B", dsi: "#9C27B0" };
    const list = accompagnants.length > 0 ? accompagnants : TEAM_MEMBERS.slice(0, 6);
    return (
      <div style={{ flex: 1, padding: "32px 40px", overflow: "auto" }}>
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: C.pink, margin: 0 }}>Mon équipe d'accompagnement</h1>
          <div style={{ fontSize: 12, color: C.textMuted, marginTop: 4 }}>Manager, HRBP, buddy et autres interlocuteurs clés de votre intégration.</div>
        </div>
        {list.length === 0 ? (
          <div className="iz-card iz-fade-up" style={{ ...sCard, textAlign: "center", padding: "48px 24px" }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: C.pinkBg, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <Users size={28} color={C.pink} />
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: C.text, margin: "0 0 8px" }}>Aucun accompagnant assigné</h3>
            <p style={{ fontSize: 13, color: C.textLight, margin: 0, maxWidth: 420, marginLeft: "auto", marginRight: "auto" }}>
              Votre manager, HRBP et buddy seront affichés ici dès qu'ils vous seront assignés par votre RH.
            </p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
            {list.map((m: any, i: number) => {
              const memberName = m.name || m.nom || `${m.prenom || ""} ${m.nom || ""}`.trim();
              const memberRole = m.role ? (ROLE_LABELS[m.role] || m.role) : (m.fonction || "Membre");
              const memberInit = memberName.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();
              const memberColor = m.role ? (ROLE_COLORS[m.role] || C.pink) : C.pink;
              return (
                <div key={m.id || i} className="iz-card" style={{ ...sCard, padding: "24px 20px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                  <div style={{ position: "relative", marginBottom: 14 }}>
                    <div style={{ width: 64, height: 64, borderRadius: "50%", background: memberColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 600, color: "#fff" }}>
                      {memberInit}
                    </div>
                    {(() => {
                      const pres = presenceLabel(m.last_seen_at);
                      return (
                        <div title={pres.label} style={{ position: "absolute", bottom: 0, right: 0, width: 16, height: 16, borderRadius: "50%", background: pres.dotColor, border: `3px solid ${C.white}` }} />
                      );
                    })()}
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: C.text, marginBottom: 2 }}>{memberName}</div>
                  <div style={{ fontSize: 12, color: C.textLight, marginBottom: 4 }}>{memberRole}{m.poste ? ` · ${m.poste}` : ""}</div>
                  {(() => {
                    const pres = presenceLabel(m.last_seen_at);
                    return (
                      <div style={{ fontSize: 11, color: pres.color, marginBottom: 10, display: "inline-flex", alignItems: "center", gap: 4 }}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: pres.dotColor }} />
                        {pres.label}
                      </div>
                    );
                  })()}
                  {/* Contact info — clickable mailto: / tel: */}
                  {(m.email || m.telephone) && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 14, width: "100%" }}>
                      {m.email && (
                        <a href={`mailto:${m.email}`} onClick={e => e.stopPropagation()}
                          style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6, fontSize: 11, color: C.text, textDecoration: "none", padding: "5px 8px", borderRadius: 6, background: C.bg, transition: "all .15s" }}
                          onMouseEnter={e => { e.currentTarget.style.background = C.pinkBg; e.currentTarget.style.color = C.pink; }}
                          onMouseLeave={e => { e.currentTarget.style.background = C.bg; e.currentTarget.style.color = C.text; }}>
                          <Mail size={12} /> {m.email}
                        </a>
                      )}
                      {m.telephone && (
                        <a href={`tel:${m.telephone.replace(/\s/g, "")}`} onClick={e => e.stopPropagation()}
                          style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6, fontSize: 11, color: C.text, textDecoration: "none", padding: "5px 8px", borderRadius: 6, background: C.bg, transition: "all .15s" }}
                          onMouseEnter={e => { e.currentTarget.style.background = C.pinkBg; e.currentTarget.style.color = C.pink; }}
                          onMouseLeave={e => { e.currentTarget.style.background = C.bg; e.currentTarget.style.color = C.text; }}>
                          <Phone size={12} /> {m.telephone}
                        </a>
                      )}
                    </div>
                  )}
                  <button onClick={async () => {
                    const user = msgUsers.find(u => u.name === memberName) || (m.email ? msgUsers.find(u => u.email === m.email) : undefined);
                    if (user) {
                      const existing = msgConversations.find(c => c.other_user?.id === user.id);
                      if (existing) { setMsgActiveConvId(existing.id); }
                      else {
                        try { const msg = await apiSendMessage(user.id, "👋"); await getConversations().then(setMsgConversations); setMsgActiveConvId(msg.conversation_id); } catch {}
                      }
                    }
                    setDashPage("messagerie");
                  }} className="iz-btn-pink" style={{ ...sBtn("pink"), padding: "8px 18px", fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}>
                    <MessageCircle size={13} /> Envoyer un message
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  // ─── ASSISTANT IA ──────────────────────────────────────────
  const renderAssistantIA = () => {
    const { aiChatMessages, setAiChatMessages, aiChatInput, setAiChatInput, aiChatLoading, setAiChatLoading, aiChatEndRef } = ctx;
    const { themeColor } = ctx;
    const gradStart = themeColor || "#1a1a2e";
    const gradEnd = C.pink;

    const QUICK_PROMPTS = [
      { icon: Calendar, label: "Mon parcours", prompt: "Où en suis-je dans mon parcours d'intégration ?" },
      { icon: FileText, label: "Mes documents", prompt: "Quels documents dois-je encore fournir ?" },
      { icon: Users, label: "Mon équipe", prompt: "Qui sont mes interlocuteurs clés ?" },
      { icon: HelpCircle, label: "FAQ", prompt: "Quelles sont les informations pratiques pour mes premiers jours ?" },
    ];

    const handleSendAiMessage = async (messageOverride?: string) => {
      const content = messageOverride || aiChatInput.trim();
      if (!content || aiChatLoading) return;
      const userMsg = { role: "user" as const, content, timestamp: new Date().toISOString() };
      const newMessages = [...aiChatMessages, userMsg];
      setAiChatMessages(newMessages);
      setAiChatInput("");
      setAiChatLoading(true);
      setTimeout(() => aiChatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);

      try {
        const history = newMessages.map((m: any) => ({ role: m.role, content: m.content }));
        const res = await postAiChat(content, history);
        setAiChatMessages((prev: any) => [...prev, { role: "assistant", content: res.reply, timestamp: new Date().toISOString() }]);
      } catch {
        // Fallback — simulate a contextual answer
        const fallbackReplies: Record<string, string> = {
          parcours: `Vous êtes actuellement sur le parcours "${myParcoursName}". Votre progression globale est visible dans l'onglet "Mon suivi". N'hésitez pas à consulter vos actions en cours dans "Mes actions".`,
          document: "Rendez-vous dans votre onglet \"Mon profil\" > \"Administratif\" pour voir la liste des documents demandés et leur statut. Les documents marqués comme obligatoires doivent être fournis en priorité.",
          equipe: "Vous pouvez retrouver votre équipe d'accompagnement dans \"Mon profil\" > onglet \"Équipe\". Votre manager, HRBP et buddy y sont listés avec la possibilité de leur envoyer un message.",
          default: "Je suis votre assistant Illizeo. Je peux vous aider avec votre parcours d'intégration, vos documents, vos actions à réaliser, ou vous mettre en contact avec les bonnes personnes. Que souhaitez-vous savoir ?",
        };
        const key = content.toLowerCase().includes("parcours") || content.toLowerCase().includes("intégration") ? "parcours"
          : content.toLowerCase().includes("document") || content.toLowerCase().includes("fournir") ? "document"
          : content.toLowerCase().includes("équipe") || content.toLowerCase().includes("contact") || content.toLowerCase().includes("interlocuteur") ? "equipe"
          : "default";
        setAiChatMessages((prev: any) => [...prev, { role: "assistant", content: fallbackReplies[key], timestamp: new Date().toISOString() }]);
      }
      setAiChatLoading(false);
      setTimeout(() => aiChatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    };

    return (
      <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100vh", background: C.bg }}>

        {/* Messages area */}
        <div style={{ flex: 1, overflow: "auto", padding: "20px 0" }}>
          <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px" }}>

            {/* Welcome state when no messages */}
            {aiChatMessages.length === 0 && (
              <div className="iz-fade-up" style={{ textAlign: "center", paddingTop: 60 }}>
                <div style={{ width: 72, height: 72, borderRadius: "50%", background: `linear-gradient(135deg, ${gradStart}, ${gradEnd})`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", boxShadow: "0 8px 32px rgba(194,24,91,.2)" }}>
                  <Sparkles size={32} color="#fff" />
                </div>
                <h2 style={{ fontSize: 24, fontWeight: 700, color: C.text, margin: "0 0 8px" }}>Comment puis-je vous aider ?</h2>
                <p style={{ fontSize: 14, color: C.textLight, margin: "0 0 40px", maxWidth: 460, marginLeft: "auto", marginRight: "auto" }}>
                  Je suis votre assistant Illizeo. Posez-moi vos questions sur votre parcours, vos documents, votre équipe ou toute autre information.
                </p>

                {/* Quick prompts grid */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, maxWidth: 520, margin: "0 auto" }}>
                  {QUICK_PROMPTS.map((qp, i) => {
                    const Icon = qp.icon;
                    return (
                      <button key={i} onClick={() => handleSendAiMessage(qp.prompt)}
                        className={`iz-card iz-fade-up iz-stagger-${i + 1}`}
                        style={{ ...sCard, padding: "16px", cursor: "pointer", border: `1px solid ${C.border}`, textAlign: "left", display: "flex", alignItems: "flex-start", gap: 12, transition: "all .15s", background: C.white }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = C.pink; e.currentTarget.style.boxShadow = "0 4px 16px rgba(194,24,91,.08)"; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = "none"; }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: C.pinkBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <Icon size={18} color={C.pink} />
                        </div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 2 }}>{qp.label}</div>
                          <div style={{ fontSize: 11, color: C.textMuted, lineHeight: 1.4 }}>{qp.prompt}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Chat messages */}
            {aiChatMessages.map((msg: any, i: number) => (
              <div key={i} className="iz-fade-up" style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start", marginBottom: 16 }}>
                {msg.role === "assistant" && (
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: `linear-gradient(135deg, ${gradStart}, ${gradEnd})`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginRight: 10, marginTop: 4 }}>
                    <Sparkles size={14} color="#fff" />
                  </div>
                )}
                <div style={{ maxWidth: "70%" }}>
                  <div style={{
                    padding: "12px 16px", borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                    background: msg.role === "user" ? C.pink : C.white,
                    color: msg.role === "user" ? "#fff" : C.text,
                    border: msg.role === "user" ? "none" : `1px solid ${C.border}`,
                    fontSize: 13, lineHeight: 1.6, whiteSpace: "pre-wrap",
                    boxShadow: msg.role === "assistant" ? "0 2px 8px rgba(0,0,0,.04)" : "none",
                  }}>{msg.content}</div>
                  <div style={{ fontSize: 10, color: C.textMuted, marginTop: 4, textAlign: msg.role === "user" ? "right" : "left" }}>
                    {msg.role === "assistant" ? "Assistant Illizeo" : "Vous"} · {fmtDateTimeShort(msg.timestamp)}
                  </div>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {aiChatLoading && (
              <div className="iz-fade-up" style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: `linear-gradient(135deg, ${gradStart}, ${gradEnd})`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Sparkles size={14} color="#fff" />
                </div>
                <div style={{ padding: "12px 16px", borderRadius: "16px 16px 16px 4px", background: C.white, border: `1px solid ${C.border}`, display: "flex", gap: 4 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.textMuted, animation: "iz-typing 1.4s infinite", animationDelay: "0s" }} />
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.textMuted, animation: "iz-typing 1.4s infinite", animationDelay: "0.2s" }} />
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.textMuted, animation: "iz-typing 1.4s infinite", animationDelay: "0.4s" }} />
                </div>
              </div>
            )}

            <div ref={aiChatEndRef} />
          </div>
        </div>

        {/* Input bar */}
        <div style={{ borderTop: `1px solid ${C.border}`, background: C.white, padding: "16px 24px" }}>
          <div style={{ maxWidth: 800, margin: "0 auto" }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <input
                value={aiChatInput}
                onChange={e => setAiChatInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSendAiMessage(); } }}
                placeholder="Posez votre question..."
                style={{ ...sInput, flex: 1, fontSize: 14, padding: "14px 18px", borderRadius: 12 }}
              />
              <button
                onClick={() => handleSendAiMessage()}
                disabled={!aiChatInput.trim() || aiChatLoading}
                style={{ ...sBtn("pink"), padding: "12px 18px", borderRadius: 12, opacity: !aiChatInput.trim() || aiChatLoading ? 0.5 : 1, display: "flex", alignItems: "center", gap: 6 }}
              >
                <Send size={18} />
              </button>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
              <div style={{ fontSize: 10, color: C.textMuted }}>
                <Sparkles size={10} style={{ display: "inline", verticalAlign: "middle", marginRight: 4 }} />
                L'IA peut commettre des erreurs. Il est recommandé de vérifier les informations importantes.
              </div>
              {aiChatMessages.length > 0 && (
                <button onClick={() => setAiChatMessages([])} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 10, color: C.textMuted, display: "flex", alignItems: "center", gap: 4 }}>
                  <RotateCcw size={10} /> Nouvelle conversation
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ─── BADGES — Mes badges (Galerie) ────────────────────────
  const renderBadges = () => {
    // 9 prod Illizeo badges, mirroring BackofficeController seeds.
    // Curated metadata for the 9 reference Illizeo badges (cat/rarity/xp/day/hint).
    // Other badges loaded from the DB get sensible defaults inferred from name/critere.
    const STATIC_META: Record<string, { cat: string; rarity: string; xp: number; day: number; hint: string; trigger: string }> = {
      "explorateur":      { cat: "Démarrage",   rarity: "common",    xp: 50,   day: 1,   hint: "Envoyer son premier message",    trigger: "premier_message" },
      "première semaine": { cat: "Démarrage",   rarity: "common",    xp: 75,   day: 7,   hint: "Disponible à J+7",               trigger: "j_plus_7" },
      "intégré":          { cat: "Conformité",  rarity: "uncommon",  xp: 100,  day: 14,  hint: "Valider tous les documents",     trigger: "docs_complete" },
      "apprenant":        { cat: "Formation",   rarity: "uncommon",  xp: 120,  day: 30,  hint: "Compléter une formation",        trigger: "formation_complete" },
      "voix entendue":    { cat: "Engagement",  rarity: "rare",      xp: 150,  day: 45,  hint: "Compléter le sondage NPS",       trigger: "nps_complete" },
      "mentor":           { cat: "Cooptation",  rarity: "rare",      xp: 200,  day: 90,  hint: "Soumettre une cooptation",       trigger: "cooptation" },
      "ambassadeur":      { cat: "Cooptation",  rarity: "epic",      xp: 500,  day: 180, hint: "0 / 3 cooptations validées",     trigger: "cooptation_3" },
      "cap des 100j":     { cat: "Démarrage",   rarity: "epic",      xp: 750,  day: 100, hint: "Disponible à J+100",             trigger: "j_plus_100" },
      "champion":         { cat: "Performance", rarity: "legendary", xp: 1500, day: 365, hint: "Compléter tous les modules",     trigger: "parcours_termine" },
    };

    // Infer category from a critere/trigger string when no static metadata exists.
    const inferCat = (critere: string | null | undefined, nom: string): string => {
      const c = (critere || "").toLowerCase();
      const n = nom.toLowerCase();
      if (c.includes("reboarding") || n.includes("retour") || n.includes("réadapt") || n.includes("réintégr")) return "Reboarding";
      if (c.includes("offboarding") || n.includes("transparence") || n.includes("transmission") || n.includes("bonne route")) return "Offboarding";
      if (c.includes("crossboarding") || n.includes("mobilité") || n.includes("polyvalent") || n.includes("évolution")) return "Crossboarding";
      if (c.includes("cooptation")) return "Cooptation";
      if (c.includes("nps") || c.includes("feedback")) return "Engagement";
      if (c.includes("formation") || c.includes("apprenant")) return "Formation";
      if (c.includes("docs") || c.includes("document")) return "Conformité";
      if (c.includes("parcours") || c.includes("first_") || c.includes("j_plus")) return "Démarrage";
      return "Parcours";
    };

    // Infer relative day & rarity from category for ordering / progress display.
    const inferDay = (cat: string, critere: string | null | undefined): number => {
      const c = (critere || "").toLowerCase();
      if (c.includes("_j1")) return 1;
      if (c.includes("_j7") || c.includes("first_week")) return 7;
      if (c.includes("_j14")) return 14;
      if (c.includes("_j30") || c.includes("first_month")) return 30;
      if (c.includes("_j60")) return 60;
      if (c.includes("_j100") || c.includes("j_plus_100")) return 100;
      if (cat === "Reboarding" || cat === "Offboarding" || cat === "Crossboarding") return 30;
      return 45;
    };

    // Build the badges list dynamically from DB templates, falling back to the
    // static 9 if the DB is empty (initial load / non-seeded tenant).
    const dbTemplates = (badgeTemplates || []).filter((t: any) => t.actif !== false);
    const ILLIZEO_BADGES = (dbTemplates.length > 0 ? dbTemplates : [
      // Fallback when DB hasn't loaded yet — keeps the gallery non-empty
      { id: -1, nom: "Explorateur", description: "Premier message envoyé. La conversation est lancée !", icon: "rocket", color: "#9C27B0", critere: "premier_message" },
      { id: -2, nom: "Première semaine", description: "Sept jours dans l'aventure. Le pli est pris.", icon: "calendar-check", color: "#26A69A", critere: "j_plus_7" },
      { id: -3, nom: "Intégré", description: "Tous les documents administratifs sont validés.", icon: "check-circle", color: "#4CAF50", critere: "docs_complete" },
      { id: -4, nom: "Apprenant", description: "Première formation terminée avec succès.", icon: "book-open", color: "#7B5EA7", critere: "formation_complete" },
      { id: -5, nom: "Voix entendue", description: "Vos retours comptent. Le NPS a été soumis.", icon: "message-circle", color: "#1A73E8", critere: "nps_complete" },
      { id: -6, nom: "Mentor", description: "Une cooptation soumise. Faire grandir l'équipe.", icon: "users", color: "#FF9800", critere: "cooptation" },
      { id: -7, nom: "Ambassadeur", description: "Trois cooptations validées. La culture en marche.", icon: "award", color: "#D81B60", critere: "cooptation_3" },
      { id: -8, nom: "Cap des 100j", description: "100 jours d'aventure. Le sprint devient marathon.", icon: "target", color: "#EF6C00", critere: "j_plus_100" },
      { id: -9, nom: "Champion", description: "Parcours d'onboarding complété à 100%. Bravo !", icon: "trophy", color: "#F9A825", critere: "parcours_termine" },
    ]).map((t: any) => {
      const key = (t.nom || "").toLowerCase().trim();
      const meta = STATIC_META[key];
      const cat = meta?.cat || inferCat(t.critere, t.nom);
      return {
        slug: `t${t.id}`,
        nom: t.nom,
        cat,
        trigger: meta?.trigger || t.critere || "",
        icon: t.icon || "rocket",
        color: t.color || "#9C27B0",
        rarity: meta?.rarity || "uncommon",
        xp: meta?.xp || 100,
        day: meta?.day ?? inferDay(cat, t.critere),
        desc: t.description || "",
        hint: meta?.hint || (t.critere ? `Déclencheur : ${t.critere}` : ""),
      };
    });

    const BADGE_ICON_MAP: Record<string, any> = {
      "trophy": Trophy, "file-check": FileCheck2, "message-circle": MessageCircle, "calendar-check": CalendarCheck,
      "star": Star, "handshake": Handshake, "smile": Smile, "party-popper": PartyPopper,
      "award": Award, "heart": Heart, "rocket": Rocket, "gem": Gem, "crown": Crown, "target": Target, "zap": Zap, "gift": Gift,
      "check-circle": CheckCircle, "book-open": BookOpen, "users": Users,
    };

    const RARITY_META: Record<string, { label: string; color: string; rank: number }> = {
      common:    { label: "Commun",     color: "#9CA3AF", rank: 1 },
      uncommon:  { label: "Peu commun", color: "#10B981", rank: 2 },
      rare:      { label: "Rare",       color: "#3B82F6", rank: 3 },
      epic:      { label: "Épique",     color: "#A855F7", rank: 4 },
      legendary: { label: "Légendaire", color: "#FFB300", rank: 5 },
    };

    // Resolve start date of the journey — used to position locked/in-progress
    // badges along the axis. Falls back to "today − 30d" so the canvas is never empty.
    const dateDebutStr = (myCollab as any)?.dateDebut || (myCollab as any)?.date_debut || "";
    const startDate = dateDebutStr ? (() => {
      const parts = dateDebutStr.includes("/") ? dateDebutStr.split("/") : dateDebutStr.split("-");
      if (parts.length === 3) {
        const [a, b, c] = parts.map((p: string) => parseInt(p, 10));
        return dateDebutStr.includes("/") ? new Date(c, b - 1, a) : new Date(a, b - 1, c);
      }
      return new Date(Date.now() - 30 * 86400000);
    })() : new Date(Date.now() - 30 * 86400000);

    const today = new Date();
    const daysSinceStart = Math.max(1, Math.floor((today.getTime() - startDate.getTime()) / 86400000));

    // Match each illizeo template against earned myBadges by name
    const earnedByName: Record<string, any> = {};
    (myBadges || []).forEach((b: any) => {
      const key = (b.nom || "").toLowerCase().trim();
      earnedByName[key] = b;
    });

    // Build enriched badges (chronological by tpl.day)
    const ordered = ILLIZEO_BADGES.slice().sort((a, b) => a.day - b.day).map(tpl => {
      const earned = earnedByName[tpl.nom.toLowerCase().trim()];
      let state: "earned-recent" | "earned" | "in-progress" | "locked";
      let progress = 0;
      let next = "";
      if (earned) {
        const earnedDate = new Date(earned.earned_at);
        const ageDays = (today.getTime() - earnedDate.getTime()) / 86400000;
        state = ageDays < 7 ? "earned-recent" : "earned";
        progress = 100;
      } else if (tpl.day <= daysSinceStart + 30) {
        state = "in-progress";
        progress = Math.max(5, Math.min(95, Math.round((daysSinceStart / Math.max(1, tpl.day)) * 100)));
        next = tpl.hint;
      } else {
        state = "locked";
      }
      return { ...tpl, earned, state, progress, next };
    });

    // Inject earned badges that don't match any static template (e.g. reboarding,
    // offboarding, crossboarding milestones — "De retour", "Bonne route", etc.).
    // Without this, badges awarded by journey milestones never appear in the gallery.
    const knownNames = new Set(ILLIZEO_BADGES.map(b => b.nom.toLowerCase().trim()));
    (myBadges || []).forEach((b: any, idx: number) => {
      const nameKey = (b.nom || "").toLowerCase().trim();
      if (!nameKey || knownNames.has(nameKey)) return;
      const earnedDate = b.earned_at ? new Date(b.earned_at) : today;
      const ageDays = (today.getTime() - earnedDate.getTime()) / 86400000;
      ordered.push({
        slug: `extra_${b.id || idx}`,
        nom: b.nom,
        cat: b.categorie || "Parcours",
        trigger: b.trigger || "",
        icon: b.icon || "rocket",
        color: b.color || "#9C27B0",
        rarity: "uncommon",
        xp: b.xp || 100,
        day: 1,
        desc: b.description || "Badge attribué via votre parcours.",
        hint: "",
        earned: b,
        state: ageDays < 7 ? "earned-recent" : "earned",
        progress: 100,
        next: "",
      } as any);
    });

    // Stats
    const earnedCount = ordered.filter(b => b.earned).length;
    const inProgressCount = ordered.filter(b => b.state === "in-progress").length;
    const lockedCount = ordered.filter(b => b.state === "locked").length;
    const totalXp = ordered.filter(b => b.earned).reduce((sum, b) => sum + b.xp, 0);

    // Filter state — ctx-backed so it survives renders
    if (!ctx.badgeFilter) ctx.badgeFilter = "all";
    const activeFilter = ctx.badgeFilter;
    const setFilter = (f: string) => { ctx.badgeFilter = f; setMyBadges([...(myBadges || [])]); };
    const matchesFilter = (b: any) => {
      if (activeFilter === "all") return true;
      if (activeFilter === "earned") return b.state === "earned" || b.state === "earned-recent";
      if (activeFilter === "in-progress") return b.state === "in-progress";
      if (activeFilter === "locked") return b.state === "locked";
      return b.cat === activeFilter; // category match
    };
    const visibleBadges = ordered.filter(matchesFilter);
    const cats = Array.from(new Set(ILLIZEO_BADGES.map(b => b.cat)));

    // Modal state — local React refs aren't possible in a render function.
    // We piggy-back on a controlled state stored on ctx (lazy init).
    if (!ctx.badgeModalState) ctx.badgeModalState = { open: null };
    const openBadge: any = ctx.badgeModalState.open;
    const setOpenBadge = (b: any) => {
      ctx.badgeModalState.open = b;
      // Force a re-render of the parent by bumping the myBadges array identity.
      setMyBadges([...(myBadges || [])]);
    };

    // ── Hover-triggered confetti for earned badges ────────
    // ctx-backed so the state survives renders. We reset the timer on each
    // hover (no early-return) so a stuck `active=true` from a previous
    // navigation never blocks future triggers, and rapid hovers restart the
    // animation cleanly via a fresh `seed` (used as the layer key).
    if (!ctx.badgeConfettiState) ctx.badgeConfettiState = { active: false, slug: null, color: null, seed: 0 };
    const confettiState = ctx.badgeConfettiState;
    const triggerHoverConfetti = (slug: string, color: string) => {
      if (ctx.badgeConfettiTimer) clearTimeout(ctx.badgeConfettiTimer);
      confettiState.active = true;
      confettiState.slug = slug;
      confettiState.color = color;
      confettiState.seed = Date.now();
      setMyBadges([...(myBadges || [])]);
      ctx.badgeConfettiTimer = setTimeout(() => {
        confettiState.active = false;
        confettiState.slug = null;
        ctx.badgeConfettiTimer = null;
        setMyBadges([...(myBadges || [])]);
      }, 3500);
    };

    // ── Tokens & helpers ────────
    const INK_900 = "#0d0a14";
    const INK_600 = "#4a4356";
    const INK_500 = "#6b6376";
    const INK_400 = "#948c9e";
    const INK_300 = "#c9c3d0";
    const INK_200 = "#e6e3ea";
    const MAGENTA = "#e6007e";
    const MAGENTA_600 = "#c80070";
    const MAGENTA_50 = "#fde8f1";
    const SERIF = `'Instrument Serif', Georgia, 'Times New Roman', serif`;

    // hex → soft pastel rgba for badge color tints
    const softPastel = (hex: string, alpha = 0.16) => {
      const h = hex.replace("#", "");
      const r = parseInt(h.slice(0, 2), 16);
      const g = parseInt(h.slice(2, 4), 16);
      const bl = parseInt(h.slice(4, 6), 16);
      return `rgba(${r},${g},${bl},${alpha})`;
    };

    const fmtBadgeDate = (b: any) => {
      if (b.earned?.earned_at) {
        return new Date(b.earned.earned_at).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
      }
      return "—";
    };

    const STATE_LABEL: Record<string, string> = {
      "earned-recent": "Récemment acquis",
      "earned":        "Acquis",
      "in-progress":   "En cours",
      "locked":        "À débloquer",
    };

    // ── Single gallery card (vertical, ~220×340) ────────
    // Returns plain JSX so React reuses DOM nodes across re-renders.
    const renderBadgeCard = (b: any, idx: number) => {
      const isLocked = b.state === "locked";
      const isInProgress = b.state === "in-progress";
      const isEarned = b.state === "earned" || b.state === "earned-recent";
      const isRecent = b.state === "earned-recent";
      const Icon = BADGE_ICON_MAP[b.icon] || Trophy;

      const stateLabel = STATE_LABEL[b.state];
      const chipBg = isRecent ? INK_900 : "#fff";
      const chipText = isRecent ? "#fff" : isEarned || isInProgress ? b.color : INK_500;
      const chipBorder = isRecent ? "transparent" : softPastel(b.color, 0.3);

      return (
        <div
          key={b.slug}
          className="iz-bg-card"
          role="button"
          tabIndex={0}
          onClick={() => setOpenBadge(b)}
          onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setOpenBadge(b); } }}
          onMouseEnter={isEarned ? () => triggerHoverConfetti(b.slug, b.color) : undefined}
          onFocus={isEarned ? () => triggerHoverConfetti(b.slug, b.color) : undefined}
          aria-label={`${b.nom} — ${stateLabel} — ${b.cat}`}
          style={{
            position: "relative",
            aspectRatio: "0.62",
            borderRadius: 14,
            overflow: "hidden",
            background: "#fff",
            border: `1px solid ${INK_200}`,
            display: "flex",
            flexDirection: "column",
            cursor: "pointer",
            isolation: "isolate",
            ["--iz-card-shadow" as any]: `0 14px 36px ${softPastel(b.color, 0.22)}`,
            animationDelay: `${idx * 50}ms`,
          } as React.CSSProperties}
        >
          {/* Pastel hero gradient */}
          <div style={{
            position: "absolute", inset: 0, zIndex: 0,
            background: isLocked
              ? "linear-gradient(180deg, #f5f3f7 0%, #ffffff 60%)"
              : `linear-gradient(180deg, ${softPastel(b.color, 0.22)} 0%, ${softPastel(b.color, 0.12)} 45%, #ffffff 80%)`,
          }} />
          {/* Halo top-right */}
          <div style={{
            position: "absolute", top: "-22%", right: "-28%",
            width: "78%", aspectRatio: 1, borderRadius: "50%",
            background: isLocked
              ? "radial-gradient(circle, rgba(13,10,20,0.06) 0%, transparent 70%)"
              : `radial-gradient(circle, ${softPastel(b.color, 0.45)} 0%, ${softPastel(b.color, 0.18)} 50%, transparent 75%)`,
            zIndex: 0, filter: "blur(2px)", pointerEvents: "none",
          }} />
          {/* Halo bottom-left */}
          <div style={{
            position: "absolute", bottom: "-25%", left: "-30%",
            width: "70%", aspectRatio: 1, borderRadius: "50%",
            background: isLocked ? "transparent" : `radial-gradient(circle, ${softPastel(b.color, 0.18)} 0%, transparent 70%)`,
            zIndex: 0, filter: "blur(4px)", pointerEvents: "none",
          }} />

          {/* Chips row */}
          <div style={{ position: "relative", zIndex: 2, display: "flex", alignItems: "center", gap: 6, padding: "12px 14px 0" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              padding: "4px 9px", borderRadius: 999,
              background: chipBg, color: chipText,
              fontSize: 9, fontWeight: 700, letterSpacing: 0.7, textTransform: "uppercase",
              border: `1px solid ${chipBorder}`,
            }}>
              {isRecent && <span style={{ width: 5, height: 5, borderRadius: "50%", background: b.color }} />}
              {stateLabel}
            </div>
            <div style={{
              padding: "4px 9px",
              fontSize: 9, fontWeight: 700, color: INK_600,
              letterSpacing: 0.8, textTransform: "uppercase",
            }}>{b.cat}</div>
          </div>

          {/* Icon disc */}
          <div style={{
            position: "relative", zIndex: 2,
            margin: "14px 14px 0",
            width: 56, height: 56, borderRadius: "50%",
            background: "#fff",
            border: isLocked ? `2px solid ${INK_300}` : `2px solid ${b.color}`,
            display: "grid", placeItems: "center",
            boxShadow: isLocked ? "none" : `0 4px 14px ${softPastel(b.color, 0.3)}`,
            animation: isRecent ? "izBgGlow 2.6s ease-in-out infinite" : "none",
          }}>
            {isLocked
              ? <Lock size={26} color={INK_400} strokeWidth={1.8} />
              : <Icon size={26} color={b.color} strokeWidth={1.8} />}
          </div>

          <div style={{ flex: 1 }} />

          {/* Title + desc */}
          <div style={{ position: "relative", zIndex: 2, padding: "0 16px 12px" }}>
            <h3 style={{
              margin: 0,
              fontFamily: SERIF,
              fontSize: 26, lineHeight: 1.05, fontWeight: 400,
              color: INK_900, letterSpacing: -0.3,
            }}>{b.nom}</h3>
            <p style={{
              margin: "6px 0 0",
              fontSize: 11.5, lineHeight: 1.45,
              color: INK_600,
              display: "-webkit-box",
              WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}>{b.desc}</p>
            {isInProgress && (
              <div style={{ marginTop: 10 }}>
                <div style={{ height: 4, borderRadius: 999, background: "rgba(13,10,20,0.07)", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${b.progress}%`, background: b.color, borderRadius: 999 }} />
                </div>
                <div style={{
                  marginTop: 5, fontSize: 10, fontWeight: 600, color: b.color,
                  fontVariantNumeric: "tabular-nums",
                }}>{b.progress}%{b.next ? ` · ${b.next}` : ""}</div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div style={{
            position: "relative", zIndex: 2,
            padding: "10px 14px",
            borderTop: `1px solid ${softPastel(b.color, 0.18)}`,
            display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8,
            background: "rgba(255,255,255,0.55)",
            backdropFilter: "blur(2px)",
          }}>
            <span style={{ fontSize: 9.5, fontWeight: 500, color: INK_500, letterSpacing: 0.2 }}>
              {isEarned ? `Acquis le ${fmtBadgeDate(b)}`
                : isInProgress ? "En cours"
                : b.hint || "À débloquer"}
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              <span style={{
                fontFamily: `'JetBrains Mono', ui-monospace, SFMono-Regular, monospace`,
                fontSize: 8.5, fontWeight: 500, color: INK_400, letterSpacing: 0.4,
              }}>{b.trigger}</span>
              <span style={{
                fontSize: 9.5, fontWeight: 700, color: b.color,
                fontVariantNumeric: "tabular-nums", letterSpacing: 0.4,
              }}>+{b.xp} XP</span>
            </span>
          </div>
        </div>
      );
    };

    return (
      <div style={{ flex: 1, padding: "32px 40px", background: C.white }}>
        {/* Animation keyframes & classes for the gallery */}
        <style>{`
          @keyframes izBgFadeUp {
            from { opacity: 0; transform: translateY(12px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes izBgGlow {
            0%, 100% { box-shadow: 0 4px 14px rgba(230,0,126,0.25); }
            50%      { box-shadow: 0 6px 22px rgba(230,0,126,0.5); }
          }
          .iz-bg-card {
            opacity: 0;
            animation: izBgFadeUp .45s cubic-bezier(.2,.8,.2,1) both;
            transition: transform .18s ease, box-shadow .18s ease;
          }
          .iz-bg-card:hover, .iz-bg-card:focus-visible {
            transform: translateY(-3px);
            box-shadow: var(--iz-card-shadow, 0 14px 36px rgba(0,0,0,.08)), 0 2px 6px rgba(13,10,20,.05);
            outline: none;
          }
          @keyframes izConfettiFall {
            0%   { transform: translate3d(0, -10vh, 0) rotate(0deg);   opacity: 1; }
            70%  { opacity: 1; }
            100% { transform: translate3d(var(--iz-cfx, 0), 110vh, 0) rotate(var(--iz-cfr, 720deg)); opacity: 0; }
          }
          .iz-confetti-layer {
            position: fixed;
            inset: 0;
            pointer-events: none;
            z-index: 1300;
            overflow: hidden;
          }
          .iz-confetti-piece {
            position: absolute;
            top: 0;
            will-change: transform, opacity;
            animation-name: izConfettiFall;
            animation-timing-function: cubic-bezier(.2,.6,.4,1);
            animation-fill-mode: forwards;
          }
          @media (prefers-reduced-motion: reduce) {
            .iz-bg-card, .iz-confetti-piece {
              animation: none !important; opacity: 1 !important; transform: none !important;
            }
            .iz-confetti-layer { display: none; }
          }
        `}</style>

        {/* Gallery header — magenta tag, big serif title, intro + quick stats */}
        <div style={{
          display: "flex", alignItems: "flex-end", justifyContent: "space-between",
          gap: 32, marginBottom: 8, paddingBottom: 20,
          borderBottom: `1px solid ${INK_200}`,
          flexWrap: "wrap",
        }}>
          <div>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "5px 11px", borderRadius: 999,
              background: MAGENTA_50, color: MAGENTA_600,
              fontSize: 10, fontWeight: 700, letterSpacing: 0.8, textTransform: "uppercase",
              marginBottom: 14,
            }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: MAGENTA }} />
              Mon parcours · Galerie
            </div>
            <h1 style={{
              margin: 0,
              fontFamily: SERIF,
              fontSize: 56, lineHeight: 1, fontWeight: 400,
              letterSpacing: -1.2, color: INK_900,
            }}>Mes badges</h1>
            <p style={{ margin: "12px 0 0", fontSize: 15, lineHeight: 1.55, color: INK_600, whiteSpace: "nowrap" }}>
              Chaque badge marque une étape de ton parcours. Garde-les comme souvenirs, partage-les comme fierté.
            </p>
          </div>
          <div style={{ display: "flex", gap: 32 }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.8, textTransform: "uppercase", color: INK_400, marginBottom: 4 }}>
                Acquis
              </div>
              <div style={{ fontFamily: SERIF, fontSize: 38, lineHeight: 1, fontWeight: 400, color: INK_900, fontVariantNumeric: "tabular-nums" }}>
                {earnedCount}<span style={{ color: INK_300, fontSize: 22 }}> / {ILLIZEO_BADGES.length}</span>
              </div>
            </div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.8, textTransform: "uppercase", color: INK_400, marginBottom: 4 }}>
                XP
              </div>
              <div style={{ fontFamily: SERIF, fontSize: 38, lineHeight: 1, fontWeight: 400, color: MAGENTA, fontVariantNumeric: "tabular-nums" }}>
                {totalXp}
              </div>
            </div>
          </div>
        </div>

        {/* Filter chips */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "24px 0 32px" }}>
          {[
            { id: "all",         label: `Tous · ${ILLIZEO_BADGES.length}` },
            { id: "earned",      label: `Acquis · ${earnedCount}` },
            { id: "in-progress", label: `En cours · ${inProgressCount}` },
            { id: "locked",      label: `À débloquer · ${lockedCount}` },
            ...cats.map(c => ({ id: c, label: c })),
          ].map(f => {
            const active = activeFilter === f.id;
            return (
              <button key={String(f.id)} onClick={() => setFilter(String(f.id))} style={{
                padding: "7px 13px", borderRadius: 999,
                background: active ? INK_900 : "#fff",
                color: active ? "#fff" : INK_600,
                border: `1px solid ${active ? INK_900 : INK_200}`,
                fontFamily: font, fontSize: 12, fontWeight: 600, letterSpacing: 0.2,
                cursor: "pointer",
                transition: "background .15s, color .15s, border-color .15s",
              }}>{f.label as any}</button>
            );
          })}
        </div>

        {/* Cards grid */}
        {visibleBadges.length === 0 ? (
          <div style={{ padding: "48px 24px", textAlign: "center", color: INK_500, fontSize: 13 }}>
            Aucun badge ne correspond à ce filtre.
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: 18,
          }}>
            {visibleBadges.map((b, i) => renderBadgeCard(b, i))}
          </div>
        )}

        {/* Footer hint */}
        <div style={{
          marginTop: 48,
          paddingTop: 24,
          borderTop: `1px solid ${INK_200}`,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          gap: 24, flexWrap: "wrap",
        }}>
          <div style={{ fontSize: 12, color: INK_500 }}>
            Les badges restent acquis à vie. Tu peux les afficher sur ton profil ou les partager.
          </div>
        </div>

        {/* Confetti burst — fires when:
            - the modal opens for a recently earned badge
            - the user hovers any earned badge (ctx.badgeConfettiState.active) */}
        {(openBadge?.state === "earned-recent" || confettiState.active) && (() => {
          const accent = openBadge?.state === "earned-recent" ? openBadge.color : (confettiState.color || C.pink);
          const palette = ["#FF6B9D", "#E41076", "#FFC93C", "#10B981", "#3B82F6", "#A855F7", "#FB923C", accent];
          const N = 60;
          // Bump key on each fresh burst so the layer remounts and the
          // animation restarts from frame 0.
          const burstKey = openBadge?.state === "earned-recent"
            ? `modal-${openBadge.slug}`
            : `hover-${confettiState.slug}-${confettiState.seed}`;
          return (
            <div key={burstKey} className="iz-confetti-layer" aria-hidden="true">
              {Array.from({ length: N }, (_, i) => {
                const left = Math.random() * 100;
                const dur = 2.4 + Math.random() * 2.2;          // 2.4–4.6s
                const delay = Math.random() * 0.6;              // 0–600ms
                const w = 6 + Math.random() * 6;                // 6–12px
                const isRect = Math.random() < 0.55;
                const h = isRect ? w * (1.6 + Math.random()) : w;
                const isCircle = !isRect && Math.random() < 0.4;
                const startRot = Math.random() * 360;
                const endRot = 480 + Math.random() * 540;       // 480–1020deg
                const drift = (Math.random() - 0.5) * 20;       // ±10vw drift
                const color = palette[i % palette.length];
                return (
                  <span
                    key={i}
                    className="iz-confetti-piece"
                    style={{
                      left: `${left}%`,
                      width: w,
                      height: h,
                      background: color,
                      borderRadius: isCircle ? "50%" : 2,
                      transform: `rotate(${startRot}deg)`,
                      animationDuration: `${dur}s`,
                      animationDelay: `${delay}s`,
                      ["--iz-cfx" as any]: `${drift}vw`,
                      ["--iz-cfr" as any]: `${endRot}deg`,
                    } as React.CSSProperties}
                  />
                );
              })}
            </div>
          );
        })()}

        {/* Badge modal */}
        {openBadge && (() => {
          const b = openBadge;
          const meta = RARITY_META[b.rarity];
          const Icon = BADGE_ICON_MAP[b.icon] || Trophy;
          const isEarned = !!b.earned;
          const isLocked = b.state === "locked";
          return (
            <div onClick={() => setOpenBadge(null)} style={{
              position: "fixed", inset: 0, background: "rgba(15,15,30,.55)",
              display: "flex", alignItems: "center", justifyContent: "center",
              zIndex: 1200, padding: 20, animation: "izFadeIn .2s ease",
            }}>
              <div onClick={e => e.stopPropagation()} style={{
                background: C.white, borderRadius: 18, maxWidth: 440, width: "100%",
                padding: 32, position: "relative", animation: "izScaleIn .25s ease",
                border: `1px solid ${C.border}`,
                boxShadow: "0 20px 60px rgba(0,0,0,.25)",
              }}>
                <button onClick={() => setOpenBadge(null)} aria-label="Fermer" style={{
                  position: "absolute", top: 12, right: 12,
                  width: 32, height: 32, borderRadius: 8, border: "none",
                  background: C.bg, cursor: "pointer", display: "flex",
                  alignItems: "center", justifyContent: "center",
                }}>
                  <X size={16} color={C.textMuted} />
                </button>
                <div style={{
                  width: 96, height: 96, borderRadius: "50%", margin: "0 auto 16px",
                  background: isLocked ? C.bgSubtle : `${b.color}20`,
                  border: `3px solid ${isLocked ? C.borderStrong : b.color}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  filter: isLocked ? "grayscale(.6)" : "none",
                }}>
                  {isLocked ? <Lock size={36} color={C.textMuted} /> : <Icon size={42} color={b.color} />}
                </div>
                <div style={{ fontSize: 22, fontWeight: 700, color: C.text, textAlign: "center", fontFamily: fontDisplay, marginBottom: 6 }}>{b.nom}</div>
                <div style={{ textAlign: "center", marginBottom: 14 }}>
                  <span style={{
                    display: "inline-block", padding: "4px 12px", borderRadius: 999,
                    background: `${meta.color}1A`, color: meta.color,
                    fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em",
                  }}>{meta.label} · {b.xp} XP</span>
                </div>
                <p style={{ fontSize: 14, color: C.textLight, textAlign: "center", lineHeight: 1.5, margin: "0 0 16px" }}>{b.desc}</p>
                <div style={{
                  padding: "12px 14px", borderRadius: 10, background: C.bg,
                  fontSize: 12, color: C.textLight, textAlign: "center",
                }}>
                  {isEarned && b.earned?.earned_at
                    ? <>Acquis le <strong style={{ color: C.text }}>{fmtDate(b.earned.earned_at)}</strong></>
                    : isLocked
                      ? <>{b.hint || "À débloquer plus tard"}</>
                      : <>En cours — {b.next || "proche de l'objectif !"}</>
                  }
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    );
  };

  return {
    renderSidebar,
    renderEmployeeTopbar,
    renderActionCard,
    renderDashboard,
    renderMesActions,
    renderMessagerie,
    renderCompanyBlock,
    renderEntreprise,
    renderRapports,
    renderWelcomeModal,
    renderDocPanel,
    renderActionDetail,
    renderProfileModal,
    renderMonProfil,
    renderMonEquipe,
    renderAssistantIA,
    renderBadges,
    handleBannerFileUpload,
    handleSendMessage,
  };
}
