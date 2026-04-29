import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";

// ─── COLLAB SEARCH PICKER (file-level for stable component identity) ───
// Defined outside any factory so its reference is stable across renders;
// otherwise React would unmount/remount it on every parent re-render and reset its open state.
type CollabSearchPickerProps = {
  collaborateurs: any[];
  value: number | null;
  onChange: (id: number) => void;
  inputStyle?: React.CSSProperties;
  colors: { white: string; border: string; bg: string; pink: string; pinkBg: string; text: string; textMuted: string };
  companySettings?: Record<string, any>;
};
const resolveAvatar = (c: any, settings?: Record<string, any>): string | null => {
  return c?.avatar_url || c?.avatar || c?.photo_url || c?.photo || (c?.user_id && settings ? (settings[`avatar_${c.user_id}`] || null) : null);
};
const CollabSearchPicker: React.FC<CollabSearchPickerProps> = ({ collaborateurs, value, onChange, inputStyle, colors, companySettings }) => {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number; width: number } | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const selected = collaborateurs.find((c: any) => c.id === value);
  const q = query.trim().toLowerCase();
  const filtered = q
    ? collaborateurs.filter((c: any) => `${c.prenom} ${c.nom} ${c.poste || ""} ${c.site || ""} ${c.email || ""}`.toLowerCase().includes(q))
    : collaborateurs;

  const updatePos = useCallback(() => {
    if (!inputRef.current) return;
    const r = inputRef.current.getBoundingClientRect();
    setPos({ top: r.bottom + 4, left: r.left, width: r.width });
  }, []);

  useEffect(() => {
    if (!open) return;
    updatePos();
    const onScroll = () => updatePos();
    const onResize = () => updatePos();
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onResize);
    return () => { window.removeEventListener("scroll", onScroll, true); window.removeEventListener("resize", onResize); };
  }, [open, updatePos]);

  useEffect(() => {
    if (!open) return;
    const onDocDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (inputRef.current?.contains(target)) return;
      if (dropdownRef.current?.contains(target)) return;
      setOpen(false);
    };
    const id = window.setTimeout(() => document.addEventListener("mousedown", onDocDown), 0);
    return () => { window.clearTimeout(id); document.removeEventListener("mousedown", onDocDown); };
  }, [open]);

  const selectedAvatarUrl = selected ? resolveAvatar(selected, companySettings) : null;
  const selectedInitials = selected ? (selected.initials || `${(selected.prenom || '?').charAt(0)}${(selected.nom || '').charAt(0)}`.toUpperCase()) : "";
  const showPrefix = !!selected && !open;
  return (
    <div style={{ position: "relative" }}>
      {showPrefix && (
        <div style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", width: 26, height: 26, borderRadius: "50%", background: selectedAvatarUrl ? "transparent" : (selected.color || colors.pink), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 600, color: colors.white, overflow: "hidden", pointerEvents: "none", zIndex: 1 }}>
          {selectedAvatarUrl ? <img src={selectedAvatarUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : selectedInitials}
        </div>
      )}
      <input
        ref={inputRef}
        type="text"
        value={open ? query : (selected ? `${selected.prenom} ${selected.nom} — ${selected.poste || ""} (${selected.site || ""})` : "")}
        onChange={e => { setQuery(e.target.value); setOpen(true); }}
        onFocus={() => { setQuery(""); setOpen(true); }}
        placeholder="Rechercher un collaborateur (nom, poste, site, email)…"
        style={{ ...(inputStyle || {}), fontSize: 13, width: "100%", paddingLeft: showPrefix ? 42 : ((inputStyle as any)?.paddingLeft || 12) }}
      />
      {open && pos && createPortal(
        <div
          ref={dropdownRef}
          style={{ position: "fixed", top: pos.top, left: pos.left, width: pos.width, maxHeight: 280, overflow: "auto", background: colors.white, border: `1px solid ${colors.border}`, borderRadius: 8, boxShadow: "0 8px 24px rgba(0,0,0,.18)", zIndex: 2000 }}
        >
          {filtered.length === 0 ? (
            <div style={{ padding: "12px 14px", fontSize: 12, color: colors.textMuted }}>Aucun collaborateur trouvé</div>
          ) : filtered.slice(0, 50).map((c: any) => {
            const initials = c.initials || `${(c.prenom || '?').charAt(0)}${(c.nom || '').charAt(0)}`.toUpperCase();
            const avatarUrl = resolveAvatar(c, companySettings);
            return (
              <div
                key={c.id}
                onClick={() => { onChange(c.id); setOpen(false); setQuery(""); }}
                style={{ padding: "8px 12px", fontSize: 13, cursor: "pointer", borderBottom: `1px solid ${colors.border}`, background: c.id === value ? colors.pinkBg : "transparent", display: "flex", alignItems: "center", gap: 10 }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = colors.bg; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = c.id === value ? colors.pinkBg : "transparent"; }}
              >
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: avatarUrl ? "transparent" : (c.color || colors.pink), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, color: colors.white, flexShrink: 0, overflow: "hidden" }}>
                  {avatarUrl ? <img src={avatarUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : initials}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 500, color: colors.text }}>{c.prenom} {c.nom}</div>
                  <div style={{ fontSize: 11, color: colors.textMuted, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.poste || "—"}{c.site ? ` · ${c.site}` : ""}{c.email ? ` · ${c.email}` : ""}</div>
                </div>
              </div>
            );
          })}
          {filtered.length > 50 && (
            <div style={{ padding: "8px 12px", fontSize: 11, color: colors.textMuted, fontStyle: "italic", borderTop: `1px solid ${colors.border}` }}>
              {filtered.length - 50} autres résultats — affinez votre recherche
            </div>
          )}
        </div>,
        document.body
      )}
    </div>
  );
};
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
  createContrat as apiCreateContrat, updateContrat as apiUpdateContrat, deleteContrat as apiDeleteContrat, uploadContratFile, getContratGenerated, downloadContratMerged,
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
 * NPS + Contrats render functions.
 */
export function createAdminNPSContrats(ctx: any) {
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
    tplPanelMode, setTplPanelMode, tplPanelData, setTplPanelData, contratPanelMode, setContratPanelMode, contratPanelData, setContratPanelData, contractTypes, setContractTypes, jurisdictions, setJurisdictions, contratsPageTab, setContratsPageTab,
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


    const renderNPS = () => {
      const reloadNps = () => { getNpsSurveys().then(setNpsSurveys).catch(() => {}); getNpsStats().then(setNpsStats).catch(() => {}); };
      const npsColor = (score: number) => score >= 50 ? C.green : score >= 0 ? C.amber : C.red;
      return (
      <div style={{ flex: 1, padding: "24px 32px", overflow: "auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <h1 style={{ fontSize: 22, fontWeight: 600, margin: 0 }}>{t('admin.nps')}</h1>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => {
                setNpsPanelData({
                  titre: "Mon ressenti d'intégration",
                  description: "Comment s'est passée votre première semaine ? Vos réponses sont anonymisées avant d'être partagées avec votre manager.",
                  type: "checkin_emo",
                  declencheur: "j_plus_7",
                  actif: true,
                  questions: [
                    { text: "Globalement, vous diriez que votre intégration se passe…", type: "mood" },
                    { text: "Sur ces dimensions, comment vous sentez-vous ?", type: "multi_slider", dimensions: ["Accueil de l'équipe", "Clarté de mes missions", "Outils & accès", "Charge de travail", "Disponibilité de mon manager", "Disponibilité de mon buddy"] },
                    { text: "Un mot pour décrire votre semaine", type: "tags", tags: ["Stimulante", "Dense", "Sereine", "Bienveillante", "Confuse", "Excitante", "Fatigante", "Inspirante", "Surprenante", "Chaleureuse"] },
                    { text: "Si vous deviez améliorer une chose dans votre onboarding…", type: "text" },
                  ],
                });
                resetTr();
                setNpsPanelMode("create");
              }}
              style={{ ...sBtn("outline"), display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}
            >💙 Pré-remplir Check-in J+7</button>
            <button onClick={() => { setNpsPanelData({ titre: "", description: "", type: "nps", declencheur: "fin_parcours", questions: [{ text: "", type: "nps" }], actif: true }); resetTr(); setNpsPanelMode("create"); }} className="iz-btn-pink" style={{ ...sBtn("pink"), display: "flex", alignItems: "center", gap: 6 }}><Plus size={14} /> {t('nps.new_survey')}</button>
          </div>
        </div>

        {/* Explanation */}
        <div style={{ padding: "16px 20px", background: C.blueLight, borderRadius: 10, marginBottom: 20, fontSize: 12, color: C.blue, lineHeight: 1.7 }}>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>{t('nps.how_title')}</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <b>{t('nps.step1')}</b> — {t('nps.step1_desc')}<br/>
              <b>{t('nps.step2')}</b> — {t('nps.step2_desc')}<br/>
              <b>{t('nps.step3')}</b> — {t('nps.step3_desc')}
            </div>
            <div>
              <b>{t('nps.score_formula')}</b><br/>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><div style={{ width: 8, height: 8, borderRadius: 2, background: C.green }} /> {t('nps.promoters')}</span><br/>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><div style={{ width: 8, height: 8, borderRadius: 2, background: "#F9A825" }} /> {t('nps.passives')}</span><br/>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><div style={{ width: 8, height: 8, borderRadius: 2, background: C.red }} /> {t('nps.detractors')}</span><br/>
              {t('nps.score_guide')}
            </div>
          </div>
        </div>

        {/* KPI cards */}
        {npsStats && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
            <div className="iz-card" style={{ ...sCard, textAlign: "center", padding: "20px 16px" }}>
              <div style={{ fontSize: 36, fontWeight: 800, color: npsColor(npsStats.nps_score) }}>{npsStats.nps_score}</div>
              <div style={{ fontSize: 11, color: C.textMuted }}>{t('nps.score_nps')}</div>
            </div>
            <div className="iz-card" style={{ ...sCard, textAlign: "center", padding: "20px 16px" }}>
              <div style={{ fontSize: 36, fontWeight: 800, color: C.amber }}>{npsStats.avg_rating.toFixed(1)}<span style={{ fontSize: 16, color: C.textMuted }}>/5</span></div>
              <div style={{ fontSize: 11, color: C.textMuted }}>{t('nps.avg_satisfaction')}</div>
            </div>
            <div className="iz-card" style={{ ...sCard, textAlign: "center", padding: "20px 16px" }}>
              <div style={{ fontSize: 36, fontWeight: 800, color: C.blue }}>{npsStats.response_rate}%</div>
              <div style={{ fontSize: 11, color: C.textMuted }}>{t('nps.response_rate')}</div>
            </div>
            <div className="iz-card" style={{ ...sCard, textAlign: "center", padding: "20px 16px" }}>
              <div style={{ fontSize: 36, fontWeight: 800, color: C.text }}>{npsStats.total_completed}<span style={{ fontSize: 16, color: C.textMuted }}>/{npsStats.total_responses}</span></div>
              <div style={{ fontSize: 11, color: C.textMuted }}>{t('nps.responses')}</div>
            </div>
          </div>
        )}

        {/* NPS distribution bar */}
        {npsStats && npsStats.total_completed > 0 && (
          <div className="iz-card" style={{ ...sCard, padding: "16px 20px", marginBottom: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>{t('nps.distribution')}</div>
            <div style={{ display: "flex", height: 28, borderRadius: 8, overflow: "hidden", marginBottom: 8 }}>
              {npsStats.promoters > 0 && <div style={{ flex: npsStats.promoters, background: C.green, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, color: C.white }}>{npsStats.promoters}</div>}
              {npsStats.passives > 0 && <div style={{ flex: npsStats.passives, background: C.amber, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, color: C.white }}>{npsStats.passives}</div>}
              {npsStats.detractors > 0 && <div style={{ flex: npsStats.detractors, background: C.red, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, color: C.white }}>{npsStats.detractors}</div>}
            </div>
            <div style={{ display: "flex", gap: 16, fontSize: 11 }}>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}><div style={{ width: 8, height: 8, borderRadius: 2, background: C.green }} /> {t('nps.promoters').split(':')[0]} : {npsStats.promoters}</span>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}><div style={{ width: 8, height: 8, borderRadius: 2, background: C.amber }} /> {t('nps.passives').split(':')[0]} : {npsStats.passives}</span>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}><div style={{ width: 8, height: 8, borderRadius: 2, background: C.red }} /> {t('nps.detractors').split(':')[0]} : {npsStats.detractors}</span>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: "flex", gap: 0, borderBottom: `2px solid ${C.border}`, marginBottom: 16 }}>
          {([
            { id: "surveys" as const, label: t('nps.surveys'), count: npsSurveys.length },
            { id: "responses" as const, label: t('nps.recent_responses'), count: npsStats?.total_completed || 0 },
          ]).map(tab => (
            <button key={tab.id} onClick={() => { setNpsTab(tab.id); setNpsSelectedSurvey(null); }} style={{ padding: "10px 20px", fontSize: 13, fontWeight: npsTab === tab.id ? 600 : 400, color: npsTab === tab.id ? C.pink : C.textLight, background: "none", border: "none", borderBottom: npsTab === tab.id ? `2px solid ${C.pink}` : "2px solid transparent", cursor: "pointer", fontFamily: font, marginBottom: -2, display: "flex", alignItems: "center", gap: 6 }}>
              {tab.label} <span style={{ fontSize: 10, padding: "1px 6px", borderRadius: 8, background: npsTab === tab.id ? C.pinkBg : C.bg, color: npsTab === tab.id ? C.pink : C.textMuted }}>{tab.count}</span>
            </button>
          ))}
        </div>

        {/* Surveys list */}
        {npsTab === "surveys" && !npsSelectedSurvey && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {npsSurveys.map(s => (
              <div key={s.id} className="iz-card" style={{ ...sCard, cursor: "pointer", padding: 0, overflow: "hidden" }} onClick={async () => { try { const full = await showNpsSurvey(s.id); setNpsSelectedSurvey(full); setNpsTab("responses"); } catch {} }}>
                <div style={{ padding: "16px 20px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 15, fontWeight: 600 }}>{s.titre}</span>
                    <span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 600, background: s.actif ? C.greenLight : C.bg, color: s.actif ? C.green : C.textMuted }}>{s.actif ? t('nps.active') : t('nps.inactive')}</span>
                  </div>
                  {s.description && <div style={{ fontSize: 12, color: C.textLight, marginBottom: 8 }}>{s.description}</div>}
                  <div style={{ display: "flex", gap: 12, fontSize: 11, color: C.textMuted }}>
                    <span>Type : {s.type === "nps" ? "NPS" : s.type === "satisfaction" ? "Satisfaction" : t('nps.type_custom')}</span>
                    <span>{s.questions?.length || 0} {t('nps.question')}{(s.questions?.length || 0) > 1 ? "s" : ""}</span>
                    <span>{s.responses_count || 0} {t('nps.response')}{(s.responses_count || 0) > 1 ? "s" : ""}</span>
                  </div>
                </div>
                <div style={{ padding: "10px 20px", borderTop: `1px solid ${C.border}`, display: "flex", gap: 6, alignItems: "center" }} onClick={e => e.stopPropagation()}>
                  <button onClick={() => { setNpsPanelData({ id: s.id, titre: s.titre, description: s.description || "", type: s.type, declencheur: s.declencheur, delai_jours: (s as any).delai_jours ?? null, phase_id: (s as any).phase_id ?? null, date_envoi: (s as any).date_envoi ?? null, questions: s.questions || [], actif: s.actif }); setContentTranslations((s as any).translations || {}); setNpsPanelMode("edit"); }} className="iz-btn-outline" style={{ ...sBtn("outline"), padding: "5px 12px", fontSize: 11 }}>{t('common.edit')}</button>
                  <button onClick={async () => { try { await apiSendNpsAll(s.id); addToast_admin(t('toast.saved')); } catch { addToast_admin(t('toast.error')); } }} className="iz-btn-outline" style={{ ...sBtn("outline"), padding: "5px 12px", fontSize: 11, display: "flex", alignItems: "center", gap: 4 }}><Send size={11} /> {t('nps.send_all')}</button>
                  <div style={{ marginLeft: "auto", display: "flex", gap: 6, alignItems: "center" }}>
                    <div onClick={async () => { try { await apiUpdateNps(s.id, { actif: !s.actif }); reloadNps(); addToast_admin(s.actif ? t('nps.deactivated') : t('nps.activated')); } catch { addToast_admin(t('toast.error')); } }}
                      style={{ width: 36, height: 20, borderRadius: 10, background: s.actif ? C.green : C.border, cursor: "pointer", position: "relative", transition: "all .2s", flexShrink: 0 }}>
                      <div style={{ width: 16, height: 16, borderRadius: 8, background: C.white, position: "absolute", top: 2, left: s.actif ? 18 : 2, transition: "all .2s", boxShadow: "0 1px 3px rgba(0,0,0,.2)" }} />
                    </div>
                    <button onClick={() => showConfirm(t('nps.delete_confirm'), async () => { try { await apiDeleteNps(s.id); reloadNps(); addToast_admin(t('nps.deleted')); } catch { addToast_admin(t('toast.error')); } })} style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}><Trash size={13} color={C.red} /></button>
                  </div>
                </div>
              </div>
            ))}
            {npsSurveys.length === 0 && <div style={{ gridColumn: "1/-1", padding: "40px 20px", textAlign: "center", color: C.textMuted, fontSize: 13 }}>{t('nps.no_surveys')}</div>}
          </div>
        )}

        {/* Responses detail */}
        {npsTab === "responses" && npsSelectedSurvey && (
          <div>
            <button onClick={() => setNpsSelectedSurvey(null)} style={{ background: "none", border: "none", cursor: "pointer", color: C.pink, fontSize: 13, fontFamily: font, marginBottom: 12, display: "flex", alignItems: "center", gap: 4 }}><ChevronLeft size={14} /> {t('nps.back_surveys')}</button>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>{npsSelectedSurvey.titre} — {npsSelectedSurvey.responses?.length || 0} {t('nps.responses').toLowerCase()}</h3>
            <div className="iz-card" style={{ ...sCard, overflow: "hidden", padding: 0 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1.5fr 0.6fr 0.6fr 2fr 1fr", gap: 0, padding: "10px 16px", background: C.bg, borderBottom: `1px solid ${C.border}`, fontSize: 11, fontWeight: 600, color: C.textLight, textTransform: "uppercase" }}>
                <span>{t('nps.collaborator')}</span><span>{t('nps.score')}</span><span>{t('nps.rating')}</span><span>{t('nps.comment')}</span><span>{t('nps.date')}</span>
              </div>
              {(npsSelectedSurvey.responses || []).filter(r => r.completed_at).map(r => (
                <div key={r.id} style={{ display: "grid", gridTemplateColumns: "1.5fr 0.6fr 0.6fr 2fr 1fr", gap: 0, padding: "12px 16px", borderBottom: `1px solid ${C.border}`, alignItems: "center", fontSize: 13 }}>
                  <div style={{ fontWeight: 500 }}>{r.collaborateur ? `${r.collaborateur.prenom} ${r.collaborateur.nom}` : `#${r.collaborateur_id}`}</div>
                  <div>{r.score !== null ? <span style={{ fontWeight: 700, color: r.score >= 9 ? C.green : r.score >= 7 ? C.amber : C.red }}>{r.score}/10</span> : "—"}</div>
                  <div>{r.rating !== null ? <span style={{ fontWeight: 600, color: C.amber }}>{r.rating}/5</span> : "—"}</div>
                  <div style={{ fontSize: 12, color: C.textLight, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.comment || "—"}</div>
                  <div style={{ fontSize: 11, color: C.textMuted }}>{fmtDate(r.completed_at)}</div>
                </div>
              ))}
              {(npsSelectedSurvey.responses || []).filter(r => r.completed_at).length === 0 && <div style={{ padding: "30px 20px", textAlign: "center", color: C.textMuted, fontSize: 13 }}>{t('nps.no_responses')}</div>}
            </div>
          </div>
        )}

        {/* Responses tab (no survey selected) */}
        {npsTab === "responses" && !npsSelectedSurvey && (
          <div style={{ padding: "30px 20px", textAlign: "center", color: C.textMuted, fontSize: 13 }}>{t('nps.select_survey')}</div>
        )}

        {/* Create/Edit panel */}
        {npsPanelMode !== "closed" && (
          <>
            <div onClick={() => setNpsPanelMode("closed")} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.3)", zIndex: 1000 }} />
            <div className="iz-panel" style={{ position: "fixed", top: 0, right: 0, width: 560, height: "100vh", background: C.white, boxShadow: "-4px 0 24px rgba(0,0,0,.1)", zIndex: 1001, display: "flex", flexDirection: "column" }}>
              <div style={{ padding: "20px 24px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>{npsPanelMode === "create" ? t('nps.new_survey') : t('nps.edit_survey')}</h2>
                <button onClick={() => setNpsPanelMode("closed")} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={18} /></button>
              </div>
              <div style={{ flex: 1, padding: 24, overflow: "auto", display: "flex", flexDirection: "column", gap: 14 }}>
                <div><label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>{t('common.title')} *</label><TranslatableField value={npsPanelData.titre} onChange={v => setNpsPanelData((p: any) => ({ ...p, titre: v }))} currentLang={lang} activeLangs={activeLanguages} translations={contentTranslations.titre} onTranslationsChange={tr => setTr("titre", tr)} style={sInput} placeholder="Ex: NPS Onboarding" /></div>
                <div><label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Description</label><TranslatableField multiline rows={3} value={npsPanelData.description || ""} onChange={v => setNpsPanelData((p: any) => ({ ...p, description: v }))} currentLang={lang} activeLangs={activeLanguages} translations={contentTranslations.description} onTranslationsChange={tr => setTr("description", tr)} style={{ ...sInput, minHeight: 60, resize: "vertical" }} /></div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div><label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Type</label>
                    <select value={npsPanelData.type} onChange={e => setNpsPanelData((p: any) => ({ ...p, type: e.target.value }))} style={sInput}>
                      <option value="nps">{t('nps.q_type_nps')}</option>
                      <option value="satisfaction">{t('nps.type_satisfaction')}</option>
                      <option value="checkin_emo">💙 Check-in émotionnel</option>
                      <option value="custom">{t('nps.type_custom')}</option>
                    </select>
                  </div>
                  <div><label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>{t('common.trigger')}</label>
                    <select
                      value={(() => {
                        const d = npsPanelData.declencheur;
                        // Legacy presets map to a hidden delai_relatif underneath
                        if (d === "delai_relatif") {
                          const j = npsPanelData.delai_jours;
                          if (j === 7 || j === 30 || j === 60 || j === 90) return `j_plus_${j}`;
                          return "delai_relatif";
                        }
                        return d;
                      })()}
                      onChange={e => {
                        const v = e.target.value;
                        const m = v.match(/^j_plus_(\d+)$/);
                        if (m) setNpsPanelData((p: any) => ({ ...p, declencheur: "delai_relatif", delai_jours: parseInt(m[1], 10) }));
                        else if (v === "delai_relatif") setNpsPanelData((p: any) => ({ ...p, declencheur: "delai_relatif", delai_jours: p.delai_jours ?? 14 }));
                        else setNpsPanelData((p: any) => ({ ...p, declencheur: v }));
                      }}
                      style={sInput}
                    >
                      <option value="fin_parcours">{t('nps.trigger_end_path')}</option>
                      <option value="fin_phase">{t('nps.trigger_end_phase')}</option>
                      <option value="j_plus_7">J+7 (1 semaine)</option>
                      <option value="j_plus_30">J+30 (1 mois)</option>
                      <option value="j_plus_60">J+60 (2 mois)</option>
                      <option value="j_plus_90">J+90 (3 mois)</option>
                      <option value="delai_relatif">J+X · délai personnalisé</option>
                      <option value="manuel">{t('nps.trigger_manual')}</option>
                      <option value="date_specifique">{t('nps.trigger_date')}</option>
                    </select>
                    {/* Conditional fields based on the selected trigger */}
                    {npsPanelData.declencheur === "delai_relatif" && ![7, 30, 60, 90].includes(npsPanelData.delai_jours) && (
                      <div style={{ marginTop: 8 }}>
                        <label style={{ fontSize: 11, color: C.textMuted, display: "block", marginBottom: 4 }}>Nombre de jours après l'arrivée du collaborateur</label>
                        <input type="number" min={0} max={3650} value={npsPanelData.delai_jours ?? 14} onChange={e => setNpsPanelData((p: any) => ({ ...p, delai_jours: parseInt(e.target.value, 10) || 0 }))} style={{ ...sInput, width: 120 }} />
                        <span style={{ fontSize: 11, color: C.textMuted, marginLeft: 8 }}>jours après date_debut</span>
                      </div>
                    )}
                    {npsPanelData.declencheur === "fin_phase" && (
                      <div style={{ marginTop: 8 }}>
                        <label style={{ fontSize: 11, color: C.textMuted, display: "block", marginBottom: 4 }}>Phase à compléter</label>
                        <select value={npsPanelData.phase_id ?? ""} onChange={e => setNpsPanelData((p: any) => ({ ...p, phase_id: e.target.value ? parseInt(e.target.value, 10) : null }))} style={sInput}>
                          <option value="">— Choisir une phase —</option>
                          {(PHASE_DEFAULTS || []).map((ph: any) => (
                            <option key={ph.id} value={ph.id}>{ph.nom}</option>
                          ))}
                        </select>
                      </div>
                    )}
                    {npsPanelData.declencheur === "date_specifique" && (
                      <div style={{ marginTop: 8 }}>
                        <label style={{ fontSize: 11, color: C.textMuted, display: "block", marginBottom: 4 }}>Date d'envoi</label>
                        <input type="date" value={npsPanelData.date_envoi || ""} onChange={e => setNpsPanelData((p: any) => ({ ...p, date_envoi: e.target.value }))} style={{ ...sInput, width: 200 }} />
                      </div>
                    )}
                  </div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.pink, marginTop: 8 }}>{t('nps.questions')}</div>
                {(npsPanelData.questions || []).map((q: any, i: number) => (
                  <div key={i} style={{ padding: 12, background: C.bg, borderRadius: 10, display: "flex", gap: 10, alignItems: "start" }}>
                    <div style={{ flex: 1 }}>
                      <TranslatableField value={q.text} onChange={v => { const qs = [...npsPanelData.questions]; qs[i] = { ...qs[i], text: v }; setNpsPanelData((p: any) => ({ ...p, questions: qs })); }} currentLang={lang} activeLangs={activeLanguages} translations={contentTranslations[`question_${i}`]} onTranslationsChange={tr => setTr(`question_${i}`, tr)} style={{ ...sInput, marginBottom: 6 }} placeholder={t('nps.question_text')} />
                      <select value={q.type} onChange={e => { const qs = [...npsPanelData.questions]; qs[i] = { ...qs[i], type: e.target.value }; setNpsPanelData((p: any) => ({ ...p, questions: qs })); }} style={{ ...sInput, fontSize: 11 }}>
                        <option value="nps">{t('nps.q_type_nps')}</option>
                        <option value="rating">{t('nps.q_type_rating')}</option>
                        <option value="text">{t('nps.q_type_text')}</option>
                        <option value="choice">{t('nps.q_type_choice')}</option>
                        <option value="mood">😊 Mood (5 emojis)</option>
                        <option value="multi_slider">🎚 Sliders multi-dimensions</option>
                        <option value="tags">🏷 Tags cliquables</option>
                      </select>
                      {/* Configuration spécifique par type */}
                      {q.type === "multi_slider" && (
                        <div style={{ marginTop: 8 }}>
                          <label style={{ fontSize: 10, fontWeight: 600, color: C.textMuted, display: "block", marginBottom: 4 }}>Dimensions (une par ligne)</label>
                          <textarea
                            value={(q.dimensions || []).join("\n")}
                            onChange={e => { const dims = (e.target as HTMLTextAreaElement).value.split("\n").map(s => s.trim()).filter(Boolean); const qs = [...npsPanelData.questions]; qs[i] = { ...qs[i], dimensions: dims }; setNpsPanelData((p: any) => ({ ...p, questions: qs })); }}
                            placeholder="Accueil de l'équipe&#10;Clarté de mes missions&#10;Outils & accès&#10;Charge de travail&#10;Disponibilité de mon manager&#10;Disponibilité de mon buddy"
                            style={{ ...sInput, fontSize: 11, minHeight: 100, resize: "vertical" }}
                          />
                        </div>
                      )}
                      {q.type === "tags" && (
                        <div style={{ marginTop: 8 }}>
                          <label style={{ fontSize: 10, fontWeight: 600, color: C.textMuted, display: "block", marginBottom: 4 }}>Tags proposés (une par ligne)</label>
                          <textarea
                            value={(q.tags || []).join("\n")}
                            onChange={e => { const tags = (e.target as HTMLTextAreaElement).value.split("\n").map(s => s.trim()).filter(Boolean); const qs = [...npsPanelData.questions]; qs[i] = { ...qs[i], tags }; setNpsPanelData((p: any) => ({ ...p, questions: qs })); }}
                            placeholder="Stimulante&#10;Dense&#10;Sereine&#10;Bienveillante&#10;Confuse&#10;Excitante&#10;Fatigante&#10;Inspirante"
                            style={{ ...sInput, fontSize: 11, minHeight: 100, resize: "vertical" }}
                          />
                        </div>
                      )}
                      {q.type === "mood" && (
                        <div style={{ marginTop: 8, padding: "8px 10px", background: C.pinkBg, borderRadius: 6, fontSize: 10, color: C.textMuted }}>
                          😣 Mal · 😐 Mitigé · 🙂 Bien · 😊 Très bien · 🤩 Super (preset)
                        </div>
                      )}
                      {q.type === "choice" && (
                        <div style={{ marginTop: 8 }}>
                          <label style={{ fontSize: 10, fontWeight: 600, color: C.textMuted, display: "block", marginBottom: 4 }}>Options (une par ligne)</label>
                          <textarea
                            value={(q.options || []).join("\n")}
                            onChange={e => { const options = (e.target as HTMLTextAreaElement).value.split("\n").map(s => s.trim()).filter(Boolean); const qs = [...npsPanelData.questions]; qs[i] = { ...qs[i], options }; setNpsPanelData((p: any) => ({ ...p, questions: qs })); }}
                            placeholder="Option 1&#10;Option 2&#10;Option 3"
                            style={{ ...sInput, fontSize: 11, minHeight: 80, resize: "vertical" }}
                          />
                        </div>
                      )}
                    </div>
                    <button onClick={() => { const qs = npsPanelData.questions.filter((_: any, j: number) => j !== i); setNpsPanelData((p: any) => ({ ...p, questions: qs })); }} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}><X size={14} color={C.red} /></button>
                  </div>
                ))}
                <button onClick={() => setNpsPanelData((p: any) => ({ ...p, questions: [...(p.questions || []), { text: "", type: "text" }] }))} style={{ ...sBtn("outline"), fontSize: 12, display: "flex", alignItems: "center", gap: 4, alignSelf: "flex-start" }}><Plus size={12} /> {t('nps.add_question')}</button>
              </div>
              <div style={{ padding: "16px 24px", borderTop: `1px solid ${C.border}`, display: "flex", gap: 8, justifyContent: "space-between" }}>
                <div>{npsPanelMode === "edit" && npsPanelData.id && <button onClick={() => showConfirm(t('nps.delete_confirm'), async () => { try { await apiDeleteNps(npsPanelData.id); reloadNps(); setNpsPanelMode("closed"); addToast_admin(t('nps.deleted')); } catch { addToast_admin(t('toast.error')); } })} style={{ ...sBtn("outline"), color: C.red, borderColor: C.red }}>{t('common.delete')}</button>}</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => setNpsPanelMode("closed")} className="iz-btn-outline" style={sBtn("outline")}>{t('common.cancel')}</button>
                  <button onClick={async () => {
                    try {
                      const payload: any = { titre: npsPanelData.titre, description: npsPanelData.description, type: npsPanelData.type, declencheur: npsPanelData.declencheur, delai_jours: npsPanelData.delai_jours ?? null, phase_id: npsPanelData.phase_id ?? null, date_envoi: npsPanelData.date_envoi ?? null, questions: npsPanelData.questions, actif: npsPanelData.actif, translations: buildTranslationsPayload() };
                      if (npsPanelMode === "edit" && npsPanelData.id) await apiUpdateNps(npsPanelData.id, payload);
                      else await apiCreateNps(payload);
                      reloadNps(); setNpsPanelMode("closed"); addToast_admin(npsPanelMode === "create" ? "Questionnaire créé" : "Questionnaire modifié");
                    } catch { addToast_admin(t('toast.error')); }
                  }} className="iz-btn-pink" style={sBtn("pink")}>{npsPanelMode === "create" ? t('common.create') : t('common.save')}</button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      );
    };


    // ─── CONTRATS ──────────────────────────────────────────────

    // ─── SIGNATURES TAB CONTENT ──────────────────────────────
    const renderSignaturesTab = () => {
      const reloadSign = () => { getSignatureDocuments().then(setSignDocs).catch(() => {}); };
      return (<>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <p style={{ fontSize: 12, color: C.textLight, margin: 0 }}>{t('sign.desc')}</p>
          <button onClick={() => { resetTr(); setSignPanel({ mode: "create", data: { titre: "", description: "", type: "lecture", obligatoire: true, actif: true } }); }} className="iz-btn-pink" style={{ ...sBtn("pink"), display: "flex", alignItems: "center", gap: 6 }}><Plus size={14} /> {t('doc.new_template')}</button>
        </div>

        {/* How it works */}
        <div style={{ padding: "16px 20px", background: C.blueLight, borderRadius: 10, marginBottom: 20, fontSize: 12, color: C.blue, lineHeight: 1.7 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>{t('sign.read_desc')}</div>
            <div>{t('sign.sign_desc')}</div>
          </div>
        </div>

        {/* Documents grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {signDocs.map((doc: any) => (
            <div key={doc.id} className="iz-card" style={{ ...sCard, padding: 0, overflow: "hidden", opacity: doc.actif ? 1 : 0.5 }}>
              <div style={{ padding: "16px 20px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {doc.type === "lecture" ? <BookOpen size={16} color={C.blue} /> : <PenLine size={16} color={C.pink} />}
                    <h3 style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>{doc.titre}</h3>
                  </div>
                  <div style={{ display: "flex", gap: 4 }}>
                    <span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 600, background: doc.type === "lecture" ? C.blueLight : C.pinkBg, color: doc.type === "lecture" ? C.blue : C.pink }}>{doc.type === "lecture" ? t('sign.type_read') : t('sign.type_sign')}</span>
                    {doc.obligatoire && <span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 600, background: C.redLight, color: C.red }}>{t('dash.obligatory')}</span>}
                  </div>
                </div>
                {doc.description && <p style={{ fontSize: 12, color: C.textLight, margin: "0 0 8px", lineHeight: 1.5 }}>{doc.description}</p>}
                {doc.fichier_nom && <div style={{ fontSize: 11, color: C.textMuted, display: "flex", alignItems: "center", gap: 4 }}><Paperclip size={11} /> {doc.fichier_nom}</div>}
              </div>
              <div style={{ padding: "10px 20px", borderTop: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", background: C.bg }}>
                <div style={{ display: "flex", gap: 12, fontSize: 12 }}>
                  <span style={{ color: C.text }}><strong>{doc.total_signes || 0}</strong>/{doc.total_envois || 0} {t('sign.signed')}</span>
                </div>
                <div style={{ display: "flex", gap: 4 }}>
                  <button onClick={async () => { try { const acks = await getDocAcknowledgements(doc.id); setSignAcks(acks); setSignSelectedDoc(doc.id); } catch { addToast_admin(t('toast.error')); } }} title="Voir le détail des confirmations" className="iz-btn-outline" style={{ ...sBtn("outline"), padding: "4px 10px", fontSize: 10, display: "flex", alignItems: "center", gap: 4 }}><Eye size={10} /> Détail</button>
                  <button onClick={async () => { try { await sendSignatureDocToAll(doc.id); reloadSign(); addToast_admin("Document envoyé à tous"); } catch { addToast_admin(t('toast.error')); } }} title={t('sign.send_all')} className="iz-btn-outline" style={{ ...sBtn("outline"), padding: "4px 10px", fontSize: 10, display: "flex", alignItems: "center", gap: 4 }}><Send size={10} /> {t('sign.send_all')}</button>
                  <button onClick={() => { setContentTranslations((doc as any).translations || {}); setSignPanel({ mode: "edit", data: { ...doc } }); }} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 6, padding: "4px 8px", cursor: "pointer" }}><FilePen size={12} color={C.textMuted} /></button>
                  <button onClick={() => showConfirm(`Supprimer "${doc.titre}" ?`, async () => { try { await apiDeleteSignDoc(doc.id); reloadSign(); addToast_admin(t('toast.deleted')); } catch {} })} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}><Trash size={12} color={C.red} /></button>
                </div>
              </div>
            </div>
          ))}
          {signDocs.length === 0 && <div style={{ gridColumn: "1/-1", padding: "40px 20px", textAlign: "center", color: C.textMuted, fontSize: 13 }}>{t('sign.no_docs')}</div>}
        </div>

        {/* Create/Edit Panel */}
        {signPanel.mode !== "closed" && (<>
          <div onClick={() => setSignPanel({ mode: "closed", data: {} })} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.3)", zIndex: 1000 }} />
          <div className="iz-panel" style={{ position: "fixed", top: 0, right: 0, width: 480, height: "100vh", background: C.white, boxShadow: "-4px 0 24px rgba(0,0,0,.1)", zIndex: 1001, display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "20px 24px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>{signPanel.mode === "create" ? t('sign.new_doc') : t('common.edit')}</h2>
              <button onClick={() => setSignPanel({ mode: "closed", data: {} })} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={18} /></button>
            </div>
            <div style={{ flex: 1, padding: 24, overflow: "auto", display: "flex", flexDirection: "column", gap: 14 }}>
              <div><label style={{ fontSize: 11, color: C.textLight, display: "block", marginBottom: 4 }}>{t('sign.title_label')}</label>
                <TranslatableField value={signPanel.data.titre || ""} onChange={(v: string) => setSignPanel((p: any) => ({ ...p, data: { ...p.data, titre: v } }))} currentLang={lang} activeLangs={activeLanguages} translations={contentTranslations.titre} onTranslationsChange={(tr: any) => setTr("titre", tr)} style={sInput} placeholder="Ex: Règlement intérieur" /></div>
              <div><label style={{ fontSize: 11, color: C.textLight, display: "block", marginBottom: 4 }}>{t('sign.desc_label')}</label>
                <TranslatableField multiline rows={3} value={signPanel.data.description || ""} onChange={(v: string) => setSignPanel((p: any) => ({ ...p, data: { ...p.data, description: v } }))} currentLang={lang} activeLangs={activeLanguages} translations={contentTranslations.description} onTranslationsChange={(tr: any) => setTr("description", tr)} style={{ ...sInput, minHeight: 60, resize: "vertical" }} /></div>
              <div><label style={{ fontSize: 11, color: C.textLight, display: "block", marginBottom: 4 }}>{t('sign.type_label')}</label>
                <div style={{ display: "flex", gap: 8 }}>
                  {[{ id: "lecture", label: t('sign.type_read_label'), icon: BookOpen, desc: t('sign.type_read_desc') }, { id: "signature", label: t('sign.type_sign_label'), icon: PenLine, desc: t('sign.type_sign_desc') }].map(tp => (
                    <button key={tp.id} onClick={() => setSignPanel((p: any) => ({ ...p, data: { ...p.data, type: tp.id } }))} style={{ flex: 1, padding: "12px", borderRadius: 10, border: `2px solid ${signPanel.data.type === tp.id ? C.pink : C.border}`, background: signPanel.data.type === tp.id ? C.pinkBg : C.white, cursor: "pointer", textAlign: "left", fontFamily: font }}>
                      <tp.icon size={18} color={signPanel.data.type === tp.id ? C.pink : C.textMuted} style={{ marginBottom: 6 }} />
                      <div style={{ fontSize: 13, fontWeight: 600, color: signPanel.data.type === tp.id ? C.pink : C.text }}>{tp.label}</div>
                      <div style={{ fontSize: 10, color: C.textMuted }}>{tp.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
              {/* File upload */}
              <div><label style={{ fontSize: 11, color: C.textLight, display: "block", marginBottom: 4 }}>{t('sign.file_label')}</label>
                {signPanel.data.fichier_nom ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", borderRadius: 8, background: C.greenLight, fontSize: 12 }}>
                    <FileText size={14} color={C.green} />
                    <span style={{ flex: 1, fontWeight: 500 }}>{signPanel.data.fichier_nom}</span>
                  </div>
                ) : (
                  <label style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", borderRadius: 8, border: `1px dashed ${C.border}`, cursor: "pointer", fontSize: 12, color: C.textLight }}>
                    <Upload size={14} /> {t('sign.click_upload')}
                    <input type="file" accept=".pdf,.doc,.docx" style={{ display: "none" }} onChange={async (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0]; if (!file) return;
                      if (signPanel.data.id) {
                        try { const res = await uploadSignatureFile(signPanel.data.id, file); setSignPanel((p: any) => ({ ...p, data: { ...p.data, fichier_nom: res.filename } })); addToast_admin(t('sign.file_uploaded')); } catch { addToast_admin(t('sign.upload_error')); }
                      } else { setSignPanel((p: any) => ({ ...p, data: { ...p.data, _pendingFile: file, fichier_nom: file.name } })); }
                    }} />
                  </label>
                )}
              </div>
              <div style={{ display: "flex", gap: 16 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, cursor: "pointer" }}>
                  <input type="checkbox" checked={signPanel.data.obligatoire !== false} onChange={() => setSignPanel((p: any) => ({ ...p, data: { ...p.data, obligatoire: !p.data.obligatoire } }))} style={{ accentColor: C.pink }} /> {t('sign.mandatory')}
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, cursor: "pointer" }}>
                  <input type="checkbox" checked={signPanel.data.actif !== false} onChange={() => setSignPanel((p: any) => ({ ...p, data: { ...p.data, actif: !p.data.actif } }))} style={{ accentColor: C.green }} /> {t('sign.active')}
                </label>
              </div>
            </div>
            <div style={{ padding: "16px 24px", borderTop: `1px solid ${C.border}`, display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button onClick={() => setSignPanel({ mode: "closed", data: {} })} className="iz-btn-outline" style={sBtn("outline")}>{t('common.cancel')}</button>
              <button onClick={async () => {
                if (!signPanel.data.titre?.trim()) { addToast_admin(t('sign.title_required')); return; }
                try {
                  const payload = { titre: signPanel.data.titre, description: signPanel.data.description || null, type: signPanel.data.type || "lecture", obligatoire: signPanel.data.obligatoire !== false, actif: signPanel.data.actif !== false, translations: buildTranslationsPayload() };
                  let created: any;
                  if (signPanel.mode === "edit" && signPanel.data.id) await apiUpdateSignDoc(signPanel.data.id, payload);
                  else created = await apiCreateSignDoc(payload);
                  if (signPanel.data._pendingFile && (created?.id || signPanel.data.id)) {
                    try { await uploadSignatureFile(created?.id || signPanel.data.id, signPanel.data._pendingFile); } catch {}
                  }
                  reloadSign(); setSignPanel({ mode: "closed", data: {} }); addToast_admin(signPanel.mode === "create" ? "Document créé" : "Document modifié");
                } catch { addToast_admin(t('toast.error')); }
              }} className="iz-btn-pink" style={sBtn("pink")}>{signPanel.mode === "create" ? t('common.create') : t('common.save')}</button>
            </div>
          </div>
        </>)}

        {/* Acknowledgements detail panel */}
        {signSelectedDoc !== null && (() => {
          const selectedDoc: any = signDocs.find((d: any) => d.id === signSelectedDoc);
          const close = () => { setSignSelectedDoc(null); setSignAcks([]); };
          const isLecture = selectedDoc?.type === "lecture";
          const sortedAcks = [...signAcks].sort((a: any, b: any) => {
            const order: Record<string, number> = { en_attente: 0, refuse: 1, lu: 2, signe: 2 };
            return (order[a.statut] ?? 99) - (order[b.statut] ?? 99);
          });
          const counts = signAcks.reduce((acc: any, a: any) => { acc[a.statut] = (acc[a.statut] || 0) + 1; return acc; }, {});
          const doneCount = (counts.signe || 0) + (counts.lu || 0);
          return (<>
            <div onClick={close} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.3)", zIndex: 1000 }} />
            <div className="iz-panel" style={{ position: "fixed", top: 0, right: 0, width: 560, height: "100vh", background: C.white, boxShadow: "-4px 0 24px rgba(0,0,0,.1)", zIndex: 1001, display: "flex", flexDirection: "column" }}>
              <div style={{ padding: "20px 24px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    {isLecture ? <BookOpen size={16} color={C.blue} /> : <PenLine size={16} color={C.pink} />}
                    <h2 style={{ fontSize: 16, fontWeight: 600, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{selectedDoc?.titre || "Document"}</h2>
                  </div>
                  <div style={{ fontSize: 12, color: C.textLight }}>{isLecture ? "Confirmations de lecture" : "Statut des signatures"}</div>
                </div>
                <button onClick={close} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={18} /></button>
              </div>

              {/* Stats summary */}
              <div style={{ padding: "16px 24px", borderBottom: `1px solid ${C.border}`, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
                <div style={{ padding: "10px", borderRadius: 8, background: C.bg, textAlign: "center" }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: C.text }}>{signAcks.length}</div>
                  <div style={{ fontSize: 10, color: C.textMuted }}>Total envoyé</div>
                </div>
                <div style={{ padding: "10px", borderRadius: 8, background: C.greenLight, textAlign: "center" }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: C.green }}>{doneCount}</div>
                  <div style={{ fontSize: 10, color: C.green }}>{isLecture ? "Lus" : "Signés"}</div>
                </div>
                <div style={{ padding: "10px", borderRadius: 8, background: C.amberLight, textAlign: "center" }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: C.amber }}>{counts.en_attente || 0}</div>
                  <div style={{ fontSize: 10, color: C.amber }}>En attente</div>
                </div>
                <div style={{ padding: "10px", borderRadius: 8, background: C.redLight, textAlign: "center" }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: C.red }}>{counts.refuse || 0}</div>
                  <div style={{ fontSize: 10, color: C.red }}>Refusés</div>
                </div>
              </div>

              {/* List */}
              <div style={{ flex: 1, padding: "8px 24px 24px", overflow: "auto" }}>
                {sortedAcks.length === 0 ? (
                  <div style={{ padding: "40px 20px", textAlign: "center", color: C.textMuted, fontSize: 13 }}>Aucun envoi pour ce document.</div>
                ) : sortedAcks.map((ack: any) => {
                  const collab = ack.collaborateur || {};
                  const statutMeta: Record<string, { label: string; bg: string; color: string; Icon: any }> = {
                    en_attente: { label: "En attente", bg: C.amberLight, color: C.amber, Icon: Clock as any },
                    lu: { label: "Lu et confirmé", bg: C.greenLight, color: C.green, Icon: CheckCircle as any },
                    signe: { label: "Signé", bg: C.greenLight, color: C.green, Icon: CheckCircle as any },
                    refuse: { label: "Refusé", bg: C.redLight, color: C.red, Icon: X as any },
                  };
                  const meta = statutMeta[ack.statut] || statutMeta.en_attente;
                  const fullName = collab.prenom || collab.nom ? `${collab.prenom || ""} ${collab.nom || ""}`.trim() : (collab.email || `Collab #${ack.collaborateur_id}`);
                  return (
                    <div key={ack.id} style={{ padding: "12px 14px", marginTop: 8, border: `1px solid ${C.border}`, borderRadius: 10, display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 36, height: 36, borderRadius: "50%", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 13, fontWeight: 600, color: C.textLight }}>
                        {(collab.prenom?.[0] || collab.nom?.[0] || "?").toUpperCase()}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{fullName}</div>
                        {collab.email && <div style={{ fontSize: 11, color: C.textMuted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{collab.email}</div>}
                        {ack.signed_at && <div style={{ fontSize: 10, color: C.textLight, marginTop: 2 }}>{fmtDateTimeShort(ack.signed_at)}{ack.ip_address ? ` · IP ${ack.ip_address}` : ""}</div>}
                        {ack.commentaire && <div style={{ fontSize: 11, color: C.red, marginTop: 4, fontStyle: "italic" }}>« {ack.commentaire} »</div>}
                      </div>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 12, fontSize: 11, fontWeight: 600, background: meta.bg, color: meta.color, flexShrink: 0 }}>
                        <meta.Icon size={11} /> {meta.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </>);
        })()}
      </>);
    };

    // ─── CONTRATS & SIGNATURES (merged page) ──────────────────
    const { generateContrat, setGenerateContrat, generateCollabId, setGenerateCollabId, generateData, setGenerateData, generateLoading, setGenerateLoading } = ctx;

    const renderContrats = () => (
      <div style={{ flex: 1, padding: "24px 32px", overflow: "auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <h1 style={{ fontSize: 22, fontWeight: 600, margin: 0 }}>{t('admin.contracts_signatures')}</h1>
          {contratsPageTab === "contrats" ? (
            <button onClick={() => { setContratPanelData({ nom: "", type: "CDI", juridiction: "Suisse", actif: true }); resetTr(); setContratPanelMode("create"); }} className="iz-btn-pink" style={{ ...sBtn("pink"), display: "flex", alignItems: "center", gap: 6 }}><Plus size={16} /> {t('contrat.new')}</button>
          ) : null}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 0, marginBottom: 20, borderBottom: `2px solid ${C.border}` }}>
          {([
            { id: "contrats" as const, label: t('admin.tab_contracts'), icon: FileSignature },
            { id: "signatures" as const, label: t('admin.tab_signatures'), icon: PenLine },
          ]).map(tab => (
            <button key={tab.id} onClick={() => setContratsPageTab(tab.id)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 20px", fontSize: 13, fontWeight: contratsPageTab === tab.id ? 600 : 400, color: contratsPageTab === tab.id ? C.pink : C.textMuted, background: "none", border: "none", borderBottom: `2px solid ${contratsPageTab === tab.id ? C.pink : "transparent"}`, marginBottom: -2, cursor: "pointer", transition: "all .15s", fontFamily: font }}>
              <tab.icon size={15} /> {tab.label}
            </button>
          ))}
        </div>

        {contratsPageTab === "contrats" && (<>
        {/* Config: contract types & jurisdictions */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
          {[
            { label: t('contrat.type'), items: contractTypes, setItems: setContractTypes, settingKey: "contract_types" },
            { label: t('contrat.jurisdiction'), items: jurisdictions, setItems: setJurisdictions, settingKey: "jurisdictions" },
          ].map(cfg => (
            <div key={cfg.settingKey} className="iz-card" style={{ ...sCard, padding: "14px 18px" }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: C.text, marginBottom: 8 }}>{cfg.label}</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
                {cfg.items.map((item, i) => (
                  <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 6, background: C.bg, fontSize: 11, fontWeight: 500 }}>
                    {item}
                    <button onClick={() => {
                      const updated = cfg.items.filter((_, j) => j !== i);
                      cfg.setItems(updated);
                      updateCompanySettings({ [cfg.settingKey]: JSON.stringify(updated) }).catch(() => {});
                    }} style={{ background: "none", border: "none", cursor: "pointer", color: C.textMuted, padding: 0, display: "flex" }}><X size={12} /></button>
                  </span>
                ))}
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <input id={`add-${cfg.settingKey}`} placeholder={t('contrat.add_value')} style={{ ...sInput, fontSize: 11, flex: 1, padding: "5px 10px" }} onKeyDown={e => {
                  if (e.key === "Enter") {
                    const input = e.target as HTMLInputElement;
                    const val = input.value.trim();
                    if (val && !cfg.items.includes(val)) {
                      const updated = [...cfg.items, val];
                      cfg.setItems(updated);
                      updateCompanySettings({ [cfg.settingKey]: JSON.stringify(updated) }).catch(() => {});
                      input.value = "";
                    }
                  }
                }} />
                <button onClick={() => {
                  const input = document.getElementById(`add-${cfg.settingKey}`) as HTMLInputElement;
                  const val = input?.value?.trim();
                  if (val && !cfg.items.includes(val)) {
                    const updated = [...cfg.items, val];
                    cfg.setItems(updated);
                    updateCompanySettings({ [cfg.settingKey]: JSON.stringify(updated) }).catch(() => {});
                    input.value = "";
                  }
                }} className="iz-btn-outline" style={{ ...sBtn("outline"), fontSize: 10, padding: "4px 10px" }}><Plus size={12} /></button>
              </div>
            </div>
          ))}
        </div>

        {/* Card grid layout — same look & feel as the Documents à signer tab */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {contrats.map((c: any) => (
            <div key={c.id} className="iz-card" style={{ ...sCard, padding: 0, overflow: "hidden", opacity: c.actif ? 1 : 0.5 }}>
              <div style={{ padding: "16px 20px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6, gap: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                    <FileSignature size={16} color={C.pink} />
                    <h3 style={{ fontSize: 15, fontWeight: 600, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.nom}</h3>
                  </div>
                  <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                    <span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 600, background: C.pinkBg, color: C.pink }}>{c.type}</span>
                    <span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 600, background: C.blueLight, color: C.blue }}>{c.juridiction}</span>
                  </div>
                </div>
                <p style={{ fontSize: 12, color: C.textLight, margin: "0 0 8px", lineHeight: 1.5 }}>
                  Modèle de contrat avec variables personnalisées par collaborateur ({c.type} · {c.juridiction}).
                </p>
                {c.fichier && <div style={{ fontSize: 11, color: C.textMuted, display: "flex", alignItems: "center", gap: 4 }}><Paperclip size={11} /> {c.fichier}</div>}
                {!c.fichier && <div style={{ fontSize: 11, color: C.amber, display: "flex", alignItems: "center", gap: 4 }}><AlertTriangle size={11} /> Aucun template uploadé</div>}
              </div>
              <div style={{ padding: "10px 20px", borderTop: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", background: C.bg }}>
                <div style={{ fontSize: 12 }}>
                  <span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 600, background: c.actif ? C.greenLight : C.bg, color: c.actif ? C.green : C.textMuted }}>{c.actif ? t('nps.active') : t('nps.inactive')}</span>
                </div>
                <div style={{ display: "flex", gap: 4 }}>
                  {c.fichier && <button onClick={() => setGenerateContrat(c)} title="Prévisualiser" style={{ ...sBtn("outline"), padding: "4px 10px", fontSize: 10, display: "flex", alignItems: "center", gap: 4 }}><Eye size={10} /> Prévisualiser</button>}
                  <button onClick={() => { setContratPanelData({ id: c.id, nom: c.nom, type: c.type, juridiction: c.juridiction, actif: c.actif, fichier: c.fichier || "" }); setContentTranslations((c as any).translations || {}); setContratPanelMode("edit"); }} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 6, padding: "4px 8px", cursor: "pointer" }}><FilePen size={12} color={C.textMuted} /></button>
                </div>
              </div>
            </div>
          ))}
          {contrats.length === 0 && <div style={{ gridColumn: "1/-1", padding: "40px 20px", textAlign: "center", color: C.textMuted, fontSize: 13 }}>Aucun modèle de contrat. Cliquez sur "Nouveau contrat" pour en créer un.</div>}
        </div>
        {/* Contrat panel */}
        {contratPanelMode !== "closed" && (
          <>
            <div onClick={() => setContratPanelMode("closed")} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.3)", zIndex: 1000 }} />
            <div className="iz-panel" style={{ position: "fixed", top: 0, right: 0, width: "65vw", maxWidth: 1100, height: "100vh", background: C.white, boxShadow: "-4px 0 24px rgba(0,0,0,.1)", zIndex: 1001, display: "flex", flexDirection: "column" }}>
              <div style={{ padding: "24px 28px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>{contratPanelMode === "create" ? t('contrat.new') : t('contrat.edit')}</h2>
                <button onClick={() => setContratPanelMode("closed")} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={22} color={C.textLight} /></button>
              </div>
              <div style={{ flex: 1, display: "flex" }}>
                {/* Left: form */}
                <div style={{ width: 300, flexShrink: 0, padding: "20px 24px", overflow: "visible", borderRight: `1px solid ${C.border}`, position: "relative", zIndex: 10 }}>
                  <div style={{ marginBottom: 16 }}><label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>{t('contrat.contract_name')} *</label><TranslatableField value={contratPanelData.nom} onChange={v => setContratPanelData((p: any) => ({ ...p, nom: v }))} placeholder="Ex: CDI — Droit Suisse" currentLang={lang} activeLangs={activeLanguages} translations={contentTranslations.nom} onTranslationsChange={tr => setTr("nom", tr)} /></div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                    <div><label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>{t('contrat.type')}</label><select value={contratPanelData.type} onChange={e => setContratPanelData((p: any) => ({ ...p, type: e.target.value }))} style={{ ...sInput, cursor: "pointer" }}>{contractTypes.map(tc => <option key={tc} value={tc}>{tc}</option>)}</select></div>
                    <div><label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>{t('contrat.jurisdiction')}</label><select value={contratPanelData.juridiction} onChange={e => setContratPanelData((p: any) => ({ ...p, juridiction: e.target.value }))} style={{ ...sInput, cursor: "pointer" }}>{jurisdictions.map(j => <option key={j} value={j}>{j}</option>)}</select></div>
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>{t('contrat.template_file')}</label>
                    <div style={{ border: `2px dashed ${C.border}`, borderRadius: 10, padding: "20px", textAlign: "center", cursor: "pointer", transition: "all .2s" }}
                      className="iz-upload-zone"
                      onDragOver={e => { e.preventDefault(); e.currentTarget.style.borderColor = C.pink; e.currentTarget.style.background = C.pinkBg; }}
                      onDragLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = "transparent"; }}
                      onDrop={e => { e.preventDefault(); e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = "transparent"; const file = e.dataTransfer.files[0]; if (file) { setContratPanelData((p: any) => ({ ...p, fichier: file.name, _file: file, _previewUrl: file.type === "application/pdf" ? URL.createObjectURL(file) : null })); } }}
                      onClick={() => { const input = document.createElement("input"); input.type = "file"; input.accept = ".docx,.doc,.pdf,.odt"; input.onchange = (e: any) => { const file = e.target.files[0]; if (file) { setContratPanelData((p: any) => ({ ...p, fichier: file.name, _file: file, _previewUrl: file.type === "application/pdf" ? URL.createObjectURL(file) : null })); } }; input.click(); }}>
                      {contratPanelData.fichier ? (
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                          <FileText size={20} color={C.pink} />
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 500, color: C.text }}>{contratPanelData.fichier}</div>
                            <div style={{ fontSize: 10, color: C.pink }}>{t('contrat.click_replace')}</div>
                          </div>
                        </div>
                      ) : (
                        <>
                          <Upload size={24} color={C.textMuted} style={{ marginBottom: 8 }} />
                          <div style={{ fontSize: 13, color: C.text }}>{t('contrat.drag_drop')} <span style={{ color: C.pink, fontWeight: 600 }}>{t('contrat.browse')}</span></div>
                          <div style={{ fontSize: 11, color: C.textMuted, marginTop: 4 }}>Word (.docx) — recommandé · PDF, OpenDocument (.odt)</div>
                        </>
                      )}
                    </div>
                    {contratPanelData.fichier && /\.pdf$/i.test(contratPanelData.fichier) && (
                      <div style={{ marginTop: 10, padding: "10px 14px", background: C.amberLight, border: `1px solid ${C.amber}`, borderRadius: 8, display: "flex", gap: 10, alignItems: "flex-start" }}>
                        <AlertTriangle size={16} color={C.amber} style={{ flexShrink: 0, marginTop: 2 }} />
                        <div style={{ fontSize: 11, color: C.text, lineHeight: 1.5 }}>
                          <div style={{ fontWeight: 700, color: C.amber, marginBottom: 2 }}>Pas de fusion possible avec un PDF</div>
                          Les variables <code style={{ background: C.white, padding: "1px 4px", borderRadius: 3 }}>{`{first_name}`}</code>, <code style={{ background: C.white, padding: "1px 4px", borderRadius: 3 }}>{`{position}`}</code>, etc. ne seront pas remplacées : le PDF est livré tel quel à l'employé. Pour une personnalisation auto avec les infos du collaborateur, uploadez un fichier <b>.docx</b>.
                        </div>
                      </div>
                    )}
                    {contratPanelData.fichier && /\.(docx|doc|odt)$/i.test(contratPanelData.fichier) && (
                      <div style={{ marginTop: 10, padding: "10px 14px", background: C.greenLight, border: `1px solid ${C.green}`, borderRadius: 8, display: "flex", gap: 10, alignItems: "flex-start" }}>
                        <CheckCircle size={16} color={C.green} style={{ flexShrink: 0, marginTop: 2 }} />
                        <div style={{ fontSize: 11, color: C.text, lineHeight: 1.5 }}>
                          <div style={{ fontWeight: 700, color: C.green, marginBottom: 2 }}>Fusion automatique activée</div>
                          Les placeholders <code style={{ background: C.white, padding: "1px 4px", borderRadius: 3 }}>{`{first_name}`}</code>, <code style={{ background: C.white, padding: "1px 4px", borderRadius: 3 }}>{`{position}`}</code>, <code style={{ background: C.white, padding: "1px 4px", borderRadius: 3 }}>{`\${hire_date}`}</code> et tous les champs custom seront remplacés par les données du collaborateur lors de la signature.
                        </div>
                      </div>
                    )}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", background: C.bg, borderRadius: 10, cursor: "pointer", marginBottom: 16 }} onClick={() => setContratPanelData((p: any) => ({ ...p, actif: !p.actif }))}>
                    <div style={{ width: 20, height: 20, borderRadius: 4, border: `2px solid ${contratPanelData.actif ? C.pink : C.border}`, background: contratPanelData.actif ? C.pink : C.white, display: "flex", alignItems: "center", justifyContent: "center" }}>{contratPanelData.actif && <Check size={14} color={C.white} />}</div>
                    <span style={{ fontSize: 13, fontWeight: 500 }}>{t('contrat.active_contract')}</span>
                  </div>
                  <div style={{ padding: "12px 14px", background: C.bg, borderRadius: 10, fontSize: 11, color: C.textLight }}>
                    <div style={{ fontWeight: 600, color: C.text, marginBottom: 4 }}>{t('contrat.esign_title')}</div>
                    <div>{t('contrat.esign_desc')}</div>
                  </div>
                </div>
                {/* Right: preview */}
                <div style={{ flex: 1, background: C.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", overflow: "auto" }}>
                  {contratPanelData._previewUrl ? (
                    <iframe src={contratPanelData._previewUrl} style={{ width: "100%", height: "100%", border: "none" }} title="Prévisualisation" />
                  ) : contratPanelData.fichier ? (
                    <div style={{ textAlign: "center", padding: 40 }}>
                      <FileText size={64} color={C.textMuted} style={{ marginBottom: 16 }} />
                      <div style={{ fontSize: 15, fontWeight: 600, color: C.text, marginBottom: 4 }}>{contratPanelData.fichier}</div>
                      <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 16 }}>
                        {contratPanelData.fichier.endsWith('.pdf') ? t('contrat.upload_pdf') : t('contrat.pdf_only')}
                      </div>
                      <div style={{ fontSize: 11, color: C.textLight }}>
                        Les fichiers Word (.docx) et OpenDocument (.odt) ne peuvent pas être prévisualisés dans le navigateur.<br/>
                        Uploadez un PDF pour voir l'aperçu ici.
                      </div>
                    </div>
                  ) : (
                    <div style={{ textAlign: "center", padding: 40 }}>
                      <Eye size={48} color={C.border} style={{ marginBottom: 16 }} />
                      <div style={{ fontSize: 14, fontWeight: 500, color: C.textMuted }}>{t('contrat.preview')}</div>
                      <div style={{ fontSize: 12, color: C.textLight, marginTop: 4 }}>{t('contrat.upload_pdf')}</div>
                    </div>
                  )}
                </div>
              </div>
              <div style={{ padding: "16px 28px", borderTop: `1px solid ${C.border}`, display: "flex", gap: 12, justifyContent: "space-between" }}>
                <div>{contratPanelMode === "edit" && <button onClick={() => { setConfirmDialog({ message: t('contrat.delete_confirm'), onConfirm: async () => { try { await apiDeleteContrat(contratPanelData.id); addToast_admin(t('contrat.deleted')); setContratPanelMode("closed"); /* refetch */ } catch {} setConfirmDialog(null); }}); }} style={{ ...sBtn("outline"), color: C.red, borderColor: C.red, fontSize: 13 }}>{t('common.delete')}</button>}</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => setContratPanelMode("closed")} style={{ ...sBtn("outline"), fontSize: 13 }}>{t('common.cancel')}</button>
                  <button onClick={async () => {
                    try {
                      const payload: Record<string, any> = { nom: contratPanelData.nom, type: contratPanelData.type, juridiction: contratPanelData.juridiction, actif: contratPanelData.actif, fichier: contratPanelData.fichier, translations: buildTranslationsPayload() };
                      let contratId = contratPanelData.id;
                      if (contratPanelMode === "create") {
                        const created = await apiCreateContrat(payload);
                        contratId = (created as any).id;
                        addToast_admin(t('contrat.created'));
                      } else {
                        await apiUpdateContrat(contratPanelData.id, payload);
                        addToast_admin(t('contrat.updated'));
                      }
                      // Upload pending file if any
                      if (contratPanelData._file && contratId) {
                        try { await uploadContratFile(contratId, contratPanelData._file); } catch {}
                      }
                      setContratPanelMode("closed");
                    } catch { addToast_admin(t('toast.error')); }
                  }} className="iz-btn-pink" style={{ ...sBtn("pink"), fontSize: 13 }}>{contratPanelMode === "create" ? t('common.create') : t('common.save')}</button>
                </div>
              </div>
            </div>
          </>
        )}
        </>)}

        {contratsPageTab === "signatures" && renderSignaturesTab()}
      </div>
    );

    // ─── INTÉGRATIONS ──────────────────────────────────────────
    const INTEGRATION_META: Record<string, { desc: string; Icon: React.FC<any>; color: string; oauth?: boolean; apiKey?: boolean; sapConnect?: boolean; teamsConnect?: boolean; fields: { key: string; label: string; type: "text" | "password" | "select"; options?: string[] }[] }> = {
      docusign: { desc: t('integ.desc_docusign'), Icon: FileSignature, color: "#FFD700", oauth: true, fields: [
        { key: "integration_key", label: "Integration Key (Client ID)", type: "text" },
        { key: "secret_key", label: "Secret Key", type: "password" },
        { key: "account_id", label: "Account ID (optionnel — récupéré auto)", type: "text" },
        { key: "environment", label: "Environnement", type: "select", options: ["demo", "production_na", "production_eu"] },
      ] },
      ugosign: { desc: t('integ.desc_ugosign'), Icon: PenTool, color: "#1A73E8", apiKey: true, fields: [] },
      native: { desc: t('integ.desc_native'), Icon: ShieldCheck, color: "#4CAF50", fields: [] },
      entra_id: { desc: t('integ.desc_entra'), Icon: ShieldCheck, color: "#0078D4", apiKey: true, fields: [],
        connectEndpoint: "entra/connect", disconnectEndpoint: "entra/disconnect",
        configFields: [
          { key: "tenant_id", label: "Tenant ID (Directory ID)", type: "text" },
          { key: "client_id", label: "Application (Client) ID", type: "text" },
          { key: "client_secret", label: "Client Secret", type: "password" },
        ],
        guide: lang === 'fr' ? [
          { title: "1. Azure Portal", text: "portal.azure.com → Microsoft Entra ID → Inscriptions d'applications" },
          { title: "2. App Registration", text: "Sélectionnez ou créez l'app 'Illizeo Onboarding' → Copiez Tenant ID et Client ID" },
          { title: "3. Client Secret", text: "Certificats & secrets → Nouveau secret → Copiez la valeur" },
          { title: "4. Permissions API", text: "Autorisations de l'API → Microsoft Graph → User.Read.All, Group.Read.All, Directory.Read.All → Accorder le consentement admin" },
          { title: "5. Redirect URI", text: "Ajoutez le redirect URI affiché ci-dessous dans l'app Azure" },
        ] : [
          { title: "1. Azure Portal", text: "portal.azure.com → Microsoft Entra ID → App registrations" },
          { title: "2. App Registration", text: "Select or create 'Illizeo Onboarding' app → Copy Tenant ID and Client ID" },
          { title: "3. Client Secret", text: "Certificates & secrets → New secret → Copy the value" },
          { title: "4. API Permissions", text: "API permissions → Microsoft Graph → User.Read.All, Group.Read.All, Directory.Read.All → Grant admin consent" },
          { title: "5. Redirect URI", text: "Add the redirect URI shown below in the Azure app" },
        ],
      } as any,
      teams: { desc: t('integ.desc_teams'), Icon: Users, color: "#6264A7", teamsConnect: true, fields: [] },
      slack: { desc: t('integ.desc_slack'), Icon: MessageSquare, color: "#611F69", apiKey: true, fields: [],
        connectEndpoint: "ugosign/connect", disconnectEndpoint: "ugosign/disconnect",
        configFields: [
          { key: "webhook_url", label: "Webhook URL", type: "text" },
        ],
        guide: lang === 'fr' ? [
          { title: "1. Ouvrir Slack", text: "Allez dans le canal où vous voulez les notifications" },
          { title: "2. Ajouter un webhook", text: "Apps → Incoming Webhooks → Add to Slack" },
          { title: "3. Copier l'URL", text: "Collez l'URL du webhook ci-dessus" },
        ] : [
          { title: "1. Open Slack", text: "Go to the channel where you want notifications" },
          { title: "2. Add a webhook", text: "Apps → Incoming Webhooks → Add to Slack" },
          { title: "3. Copy the URL", text: "Paste the webhook URL above" },
        ],
      } as any,
      teamtailor: { desc: t('integ.desc_teamtailor'), Icon: UserPlus, color: "#4834D4", apiKey: true, fields: [],
        connectEndpoint: "teamtailor/connect", disconnectEndpoint: "teamtailor/disconnect",
        configFields: [
          { key: "api_key", label: lang === 'fr' ? "Clé API" : "API Key", type: "password" },
        ],
        guide: lang === 'fr' ? [
          { title: "1. Accéder aux paramètres", text: "Teamtailor → Settings → Integrations → API Keys" },
          { title: "2. Créer une clé", text: "Cliquez 'New API Key' → Nom : 'Illizeo' → Copiez la clé générée" },
          { title: "3. Fonctionnalité", text: "Import automatique des candidats embauchés (statut 'Hired') pour déclencher l'onboarding" },
        ] : [
          { title: "1. Access settings", text: "Teamtailor → Settings → Integrations → API Keys" },
          { title: "2. Create a key", text: "Click 'New API Key' → Name: 'Illizeo' → Copy the generated key" },
          { title: "3. Feature", text: "Automatic import of hired candidates ('Hired' status) to trigger onboarding" },
        ],
      } as any,
      smartrecruiters: { desc: t('integ.desc_smartrecruiters'), Icon: ClipboardList, color: "#FF6B35", fields: [
        { key: "api_key", label: lang === 'fr' ? "Clé API" : "API Key", type: "password" },
        { key: "company_id", label: "Company ID", type: "text" },
      ]},
      taleez: { desc: t('integ.desc_taleez'), Icon: UserPlus, color: "#6C5CE7", apiKey: true, fields: [] } as any,
      sap: { desc: t('integ.desc_sap'), Icon: Building2, color: "#0FAAFF", sapConnect: true, fields: [] },
      personio: { desc: t('integ.desc_personio'), Icon: Users, color: "#4CAF50", apiKey: true, fields: [],
        connectEndpoint: "personio/connect", disconnectEndpoint: "personio/disconnect",
        configFields: [
          { key: "client_id", label: "Client ID", type: "text" },
          { key: "client_secret", label: "Client Secret", type: "password" },
        ],
        guide: lang === 'fr' ? [
          { title: "1. Accéder aux paramètres API", text: "Personio → Settings → Integrations → API Credentials" },
          { title: "2. Générer les identifiants", text: "Cliquez 'Generate new credentials' → Sélectionnez les scopes : Employees (read), Absences (read)" },
          { title: "3. Copier Client ID et Client Secret", text: "Copiez les deux valeurs générées et collez-les ci-dessus" },
        ] : [
          { title: "1. Access API settings", text: "Personio → Settings → Integrations → API Credentials" },
          { title: "2. Generate credentials", text: "Click 'Generate new credentials' → Select scopes: Employees (read), Absences (read)" },
          { title: "3. Copy Client ID and Client Secret", text: "Copy both generated values and paste them above" },
        ],
      } as any,
      bamboohr: { desc: t('integ.desc_bamboohr'), Icon: Users, color: "#73C41D", apiKey: true, fields: [],
        connectEndpoint: "bamboohr/connect", disconnectEndpoint: "bamboohr/disconnect",
        configFields: [
          { key: "company_domain", label: lang === 'fr' ? "Sous-domaine entreprise" : "Company subdomain", type: "text" },
          { key: "api_key", label: lang === 'fr' ? "Clé API" : "API Key", type: "password" },
        ],
        guide: lang === 'fr' ? [
          { title: "1. Accéder aux paramètres API", text: "BambooHR → Account → API Keys" },
          { title: "2. Générer une clé", text: "Cliquez 'Add New Key' → Nom : 'Illizeo' → Copiez la clé" },
          { title: "3. Sous-domaine", text: "C'est la partie avant .bamboohr.com (ex: si votre URL est acme.bamboohr.com, le sous-domaine est 'acme')" },
        ] : [
          { title: "1. Access API settings", text: "BambooHR → Account → API Keys" },
          { title: "2. Generate a key", text: "Click 'Add New Key' → Name: 'Illizeo' → Copy the key" },
          { title: "3. Subdomain", text: "It's the part before .bamboohr.com (e.g. if your URL is acme.bamboohr.com, the subdomain is 'acme')" },
        ],
      } as any,
      workday: { desc: t('integ.desc_workday'), Icon: Building2, color: "#F68D2E", apiKey: true, fields: [],
        connectEndpoint: "workday/connect", disconnectEndpoint: "workday/disconnect",
        configFields: [
          { key: "host", label: lang === 'fr' ? "Hôte Workday (ex: wd5-impl-services1.workday.com)" : "Workday Host (e.g. wd5-impl-services1.workday.com)", type: "text" },
          { key: "tenant", label: "Tenant (ex: illizeo_dpt1)", type: "text" },
          { key: "client_id", label: "Client ID (API Client)", type: "text" },
          { key: "client_secret", label: "Client Secret", type: "password" },
          { key: "refresh_token", label: "Refresh Token", type: "password" },
        ],
        guide: lang === 'fr' ? [
          { title: "1. Créer un API Client", text: "Workday → Administration → Register API Client → Scope : Human Resources" },
          { title: "2. Générer les tokens", text: "Dans l'API Client → Generate Token → Copier Client ID, Secret et Refresh Token" },
          { title: "3. Hôte et Tenant", text: "L'hôte est dans l'URL Workday (ex: wd5-impl-services1.workday.com). Le tenant est le nom de votre instance." },
          { title: "4. Permissions", text: "L'ISU (Integration System User) doit avoir les droits : Get Workers, Get Organizations" },
        ] : [
          { title: "1. Create an API Client", text: "Workday → Administration → Register API Client → Scope: Human Resources" },
          { title: "2. Generate tokens", text: "In API Client → Generate Token → Copy Client ID, Secret and Refresh Token" },
          { title: "3. Host and Tenant", text: "The host is in the Workday URL (e.g. wd5-impl-services1.workday.com). The tenant is your instance name." },
          { title: "4. Permissions", text: "The ISU (Integration System User) must have: Get Workers, Get Organizations" },
        ],
      } as any,
      lucca: { desc: t('integ.desc_lucca'), Icon: Calendar, color: "#FF6B35", apiKey: true, fields: [],
        connectEndpoint: "lucca/connect", disconnectEndpoint: "lucca/disconnect",
        configFields: [
          { key: "subdomain", label: lang === 'fr' ? "Sous-domaine (ex: mon-entreprise)" : "Subdomain (e.g. my-company)", type: "text" },
          { key: "api_key", label: lang === 'fr' ? "Clé API" : "API Key", type: "password" },
        ],
        guide: lang === 'fr' ? [
          { title: "1. Accéder à l'API Lucca", text: "Lucca → Paramètres → Intégrations → API" },
          { title: "2. Créer une application", text: "Cliquez 'Nouvelle application' → Nom : 'Illizeo' → Droits : Lecture employés, départements" },
          { title: "3. Copier la clé API", text: "Copiez le token généré et collez-le ci-dessus" },
          { title: "4. Sous-domaine", text: "C'est la partie avant .ilucca.net dans votre URL (ex: si votre URL est acme.ilucca.net, le sous-domaine est 'acme')" },
        ] : [
          { title: "1. Access Lucca API", text: "Lucca → Settings → Integrations → API" },
          { title: "2. Create an application", text: "Click 'New application' → Name: 'Illizeo' → Rights: Read employees, departments" },
          { title: "3. Copy the API key", text: "Copy the generated token and paste it above" },
          { title: "4. Subdomain", text: "It's the part before .ilucca.net in your URL (e.g. if your URL is acme.ilucca.net, the subdomain is 'acme')" },
        ],
      } as any,
    };

    const CAT_LABELS: Record<string, string> = { identity: t('integ.cat_identity'), signature: t('integ.cat_signature'), communication: t('integ.cat_communication'), ats: t('integ.cat_ats'), sirh: t('integ.cat_sirh') };

    // ─── COOPTATION (PARRAINAGE) ───────────────────────────────
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



  // ─── GLOBAL CONTRACT GENERATION MODAL ───────────────────
  // Rendered globally so it works from any page (e.g. collab profile)

  const renderGenerateContratModal = () => {
    if (!generateContrat) return null;
    const close = () => { setGenerateContrat(null); setGenerateData(null); setGenerateCollabId(null); };
    return (
      <div onClick={close} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.4)", zIndex: 1100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <div className="iz-modal iz-scale-in" onClick={e => e.stopPropagation()} style={{ background: C.white, borderRadius: 16, width: 640, maxWidth: "100%", maxHeight: "85vh", overflow: "auto", zIndex: 1101 }}>
          <div style={{ padding: "20px 24px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <h2 style={{ fontSize: 17, fontWeight: 600, margin: 0 }}>Prévisualiser un contrat</h2>
              <p style={{ fontSize: 12, color: C.textMuted, margin: "2px 0 0" }}>{generateContrat.nom} — {generateContrat.type}</p>
            </div>
            <button onClick={close} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={20} color={C.textLight} /></button>
          </div>
          <div style={{ padding: "20px 24px" }}>
            {/* Contract template selector — pre-filled by smart matching, but editable */}
            {(() => {
              const allContrats = (ctx.contrats || []).filter((c: any) => c.actif);
              if (allContrats.length <= 1) return null;
              return (
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Modèle de contrat</label>
                  <select
                    value={generateContrat.id}
                    onChange={e => {
                      const id = Number(e.target.value);
                      const found = allContrats.find((c: any) => c.id === id);
                      if (found) { setGenerateContrat(found); setGenerateData(null); }
                    }}
                    style={{ ...sInput, fontSize: 13, width: "100%", cursor: "pointer" }}
                  >
                    {allContrats.map((c: any) => (
                      <option key={c.id} value={c.id}>
                        {c.nom}{c.type ? ` — ${c.type}` : ""}{c.juridiction ? ` — ${c.juridiction}` : ""}
                      </option>
                    ))}
                  </select>
                  <div style={{ fontSize: 11, color: C.textMuted, marginTop: 4 }}>
                    Pré-sélectionné automatiquement selon le type de contrat et le pays du collaborateur.
                  </div>
                </div>
              );
            })()}
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>1. Sélectionnez un collaborateur</label>
              <CollabSearchPicker
                collaborateurs={COLLABORATEURS}
                value={generateCollabId}
                onChange={(id) => { setGenerateCollabId(id); setGenerateData(null); }}
                inputStyle={sInput}
                colors={{ white: C.white, border: C.border, bg: C.bg, pink: C.pink, pinkBg: C.pinkBg, text: C.text, textMuted: C.textMuted }}
                companySettings={ctx.allCompanySettings}
              />
            </div>
            {generateCollabId && !generateData && (
              <button onClick={async () => {
                setGenerateLoading(true);
                try {
                  const data = await getContratGenerated(generateContrat.id, generateCollabId);
                  setGenerateData(data);
                } catch { addToast_admin("Erreur lors de la génération"); }
                finally { setGenerateLoading(false); }
              }} className="iz-btn-pink" style={{ ...sBtn("pink"), fontSize: 13, marginBottom: 16 }}>
                {generateLoading ? "Chargement..." : "2. Prévisualiser les variables"}
              </button>
            )}
            {generateData && (
              <>
                {generateData.template_missing && (
                  <div style={{ marginBottom: 16, padding: "12px 14px", background: C.amberLight, border: `1px solid ${C.amber}`, borderRadius: 10, display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <AlertTriangle size={18} color={C.amber} style={{ flexShrink: 0, marginTop: 1 }} />
                    <div style={{ fontSize: 12, color: C.text, lineHeight: 1.5 }}>
                      <div style={{ fontWeight: 700, color: C.amber, marginBottom: 2 }}>Aucun template uploadé sur ce contrat</div>
                      La génération réelle d'un fichier (DOCX/PDF) nécessite un template. Vous pouvez voir ci-dessous les variables qui SERAIENT remplacées. Pour activer le téléchargement, éditez ce contrat et uploadez un fichier <code style={{ background: C.white, padding: "1px 4px", borderRadius: 3 }}>.docx</code>.
                    </div>
                  </div>
                )}
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 8 }}>2. Variables du contrat</label>
                  <div style={{ border: `1px solid ${C.border}`, borderRadius: 10, overflow: "auto", maxHeight: 300 }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                      <thead>
                        <tr style={{ background: C.bg }}>
                          <th style={{ padding: "8px 12px", textAlign: "left", fontWeight: 600, fontSize: 10, color: C.textLight, textTransform: "uppercase" }}>Variable</th>
                          <th style={{ padding: "8px 12px", textAlign: "left", fontWeight: 600, fontSize: 10, color: C.textLight, textTransform: "uppercase" }}>Valeur</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(generateData.variables).map(([key, val]: [string, any]) => (
                          <tr key={key} style={{ borderTop: `1px solid ${C.border}` }}>
                            <td style={{ padding: "6px 12px", fontFamily: "monospace", fontSize: 11, color: C.pink }}>${'{' + key + '}'}</td>
                            <td style={{ padding: "6px 12px", color: val ? C.text : C.textMuted }}>{val || "—"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 8 }}>3. Télécharger le contrat généré</label>
                  <div style={{ display: "flex", gap: 10 }}>
                    <button disabled={generateData.template_missing} onClick={async () => {
                      try { await downloadContratMerged(generateContrat.id, generateCollabId!, 'docx'); addToast_admin("Contrat DOCX téléchargé"); }
                      catch { addToast_admin("Erreur lors du téléchargement"); }
                    }} className="iz-btn-outline" style={{ ...sBtn("outline"), fontSize: 13, display: "flex", alignItems: "center", gap: 6, flex: 1, justifyContent: "center", opacity: generateData.template_missing ? 0.5 : 1, cursor: generateData.template_missing ? "not-allowed" : "pointer" }}>
                      <Download size={14} /> DOCX
                    </button>
                    <button disabled={generateData.template_missing} onClick={async () => {
                      try { await downloadContratMerged(generateContrat.id, generateCollabId!, 'pdf'); addToast_admin("Contrat PDF téléchargé"); }
                      catch { addToast_admin("Erreur lors du téléchargement PDF"); }
                    }} className="iz-btn-pink" style={{ ...sBtn("pink"), fontSize: 13, display: "flex", alignItems: "center", gap: 6, flex: 1, justifyContent: "center", opacity: generateData.template_missing ? 0.5 : 1, cursor: generateData.template_missing ? "not-allowed" : "pointer" }}>
                      <Download size={14} /> PDF
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  return {
    renderNPS,
    renderContrats,
    renderGenerateContratModal,
  };
}
