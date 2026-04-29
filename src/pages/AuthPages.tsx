import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { t, getLang, setLang, getAllLangs, LANG_META, type Lang } from "../i18n";
import { pushTenantRoot } from "../router";
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
import { ANIM_STYLES, C, hexToRgb, colorWithAlpha, lighten, REGION_LOCALE, REGION_CURRENCY, getLocaleSettings, fmtDate, fmtDateShort, fmtTime, fmtDateTime, fmtDateTimeShort, fmtCurrency, font, fontDisplay, ILLIZEO_LOGO_URI, ILLIZEO_FULL_LOGO_URI, getLogoUri, getLogoFullUri, IllizeoLogoFull, IllizeoLogo, IllizeoLogoBrand, PreboardSidebar, sCard, sBtn, sInput, isDarkMode, applyDarkMode } from '../constants';
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
  getCompanySettings, updateCompanySettings, getPasswordPolicy, type PasswordPolicy,
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

// ─── Recent tenants tracking ─────────────────────────────────
// Stored as JSON array [{slug, lastSeen, members?}] in localStorage. Fed by every
// successful tenant-check + every authenticated session boot. Keeps last 5.
type RecentTenant = { slug: string; lastSeen: number; members?: number };
const RECENT_KEY = 'illizeo_recent_tenants';
function getRecentTenants(): RecentTenant[] {
  try { return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]') as RecentTenant[]; } catch { return []; }
}
export function addRecentTenant(slug: string, members?: number) {
  if (!slug) return;
  const list = getRecentTenants().filter(r => r.slug !== slug);
  list.unshift({ slug, lastSeen: Date.now(), ...(typeof members === 'number' ? { members } : {}) });
  localStorage.setItem(RECENT_KEY, JSON.stringify(list.slice(0, 5)));
}

/**
 * Factory that creates auth page render functions.
 * Each function returns JSX for a specific auth page.
 */
export function createAuthPages(ctx: any) {
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
    customLogo, setCustomLogo, customLogoFull, setCustomLogoFull, loginBgImage, setLoginBgImage, customFavicon, setCustomFavicon, loginGradientStart, loginGradientEnd,
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
    handleBannerFileUpload, handleSendMessage, renderActionCard, renderCompanyBlock, renderMessagerie, SIDEBAR_ITEMS, markSetupStepDone, finishSetupWizard,
    pwdPolicy, setPwdPolicy,
  } = ctx;

  // Load password policy from public endpoint (no auth required)
  const loadPwdPolicy = () => {
    if (pwdPolicy) return;
    getPasswordPolicy().then((p: PasswordPolicy) => setPwdPolicy(p)).catch(() => {
      setPwdPolicy({ min_length: 8, uppercase: true, lowercase: true, number: true, special: false, no_common: true, no_name: false, max_attempts: 5, history_count: 3, expiry_days: 0 });
    });
  };

  /** Check each password rule against the current value */
  const checkPwdRules = (pwd: string, policy: PasswordPolicy | null) => {
    if (!policy) return [];
    const rules: { key: string; label: string; met: boolean }[] = [];
    rules.push({ key: "min_length", label: `Minimum ${policy.min_length} caract\u00e8res`, met: pwd.length >= policy.min_length });
    if (policy.uppercase) rules.push({ key: "uppercase", label: "Une majuscule (A-Z)", met: /[A-Z]/.test(pwd) });
    if (policy.lowercase) rules.push({ key: "lowercase", label: "Une minuscule (a-z)", met: /[a-z]/.test(pwd) });
    if (policy.number) rules.push({ key: "number", label: "Un chiffre (0-9)", met: /[0-9]/.test(pwd) });
    if (policy.special) rules.push({ key: "special", label: "Un caract\u00e8re sp\u00e9cial (!@#$...)", met: /[!@#$%^&*(),.?":{}|<>]/.test(pwd) });
    return rules;
  };

  /** Render the password checklist */
  const renderPwdChecklist = (pwd: string, policy: PasswordPolicy | null) => {
    const rules = checkPwdRules(pwd, policy);
    if (rules.length === 0) return null;
    return (
      <div style={{ marginTop: 6, marginBottom: 4 }}>
        {rules.map(r => (
          <div key={r.key} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, lineHeight: 1.8, color: r.met ? C.green : C.red }}>
            {r.met ? <Check size={12} /> : <X size={12} />}
            <span>{r.label}</span>
          </div>
        ))}
      </div>
    );
  };

  /** Check if all rules pass */
  const allPwdRulesMet = (pwd: string, policy: PasswordPolicy | null) => {
    return checkPwdRules(pwd, policy).every(r => r.met);
  };

  const renderResetPassword = () => {
    loadPwdPolicy();
    const leftBody = resetDone ? (
      <div style={{ maxWidth: 540, padding: "28px 30px", borderRadius: 16, background: "rgba(0,0,0,.18)", border: "1px solid rgba(255,255,255,.18)" }}>
        <CheckCircle size={32} color="#A8FFD2" style={{ marginBottom: 14 }} />
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>Mot de passe modifié !</div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,.8)", marginBottom: 22, lineHeight: 1.5 }}>Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.</div>
        <button onClick={() => { setResetMode(false); setResetDone(false); }} style={sShellPrimaryBtn(false)}>
          Se connecter <ArrowRight size={18} />
        </button>
      </div>
    ) : (
      <form onSubmit={async (e) => {
        e.preventDefault();
        if (!allPwdRulesMet(resetPassword, pwdPolicy)) return;
        if (resetPassword !== resetConfirm) return;
        setResetLoading(true);
        try {
          await apiFetch('/reset-password', { method: 'POST', body: JSON.stringify({ email: resetEmail, token: resetToken, password: resetPassword, password_confirmation: resetConfirm }) });
          setResetDone(true);
        } catch { setResetDone(false); }
        finally { setResetLoading(false); }
      }} style={{ maxWidth: 540 }}>
        <div style={{ marginBottom: 14 }}>
          <label style={sShellLabel}>Nouveau mot de passe</label>
          <input type="password" value={resetPassword} onChange={e => setResetPassword(e.target.value)} placeholder={`Min. ${pwdPolicy?.min_length ?? 8} caractères`} required style={sShellInput} />
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={sShellLabel}>Confirmer le mot de passe</label>
          <input type="password" value={resetConfirm} onChange={e => setResetConfirm(e.target.value)} placeholder="Répétez le mot de passe" required style={sShellInput} />
        </div>
        {resetPassword && (
          <div style={{ marginBottom: 16, padding: "12px 14px", background: "rgba(0,0,0,.18)", borderRadius: 10, border: "1px solid rgba(255,255,255,.12)" }}>
            {checkPwdRules(resetPassword, pwdPolicy).map(r => (
              <div key={r.key} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, lineHeight: 1.7, color: r.met ? "#A8FFD2" : "rgba(255,255,255,.7)" }}>
                {r.met ? <Check size={12} /> : <X size={12} />}<span>{r.label}</span>
              </div>
            ))}
            {resetConfirm && resetPassword !== resetConfirm && (
              <div style={{ fontSize: 11, color: "#FFD0D0", marginTop: 4 }}>Les mots de passe ne correspondent pas</div>
            )}
          </div>
        )}
        <button type="submit" disabled={resetLoading || !allPwdRulesMet(resetPassword, pwdPolicy) || resetPassword !== resetConfirm}
          style={sShellPrimaryBtn(resetLoading || !allPwdRulesMet(resetPassword, pwdPolicy) || resetPassword !== resetConfirm)}>
          {resetLoading ? "Enregistrement…" : "Enregistrer le mot de passe"} <ArrowRight size={18} />
        </button>
      </form>
    );

    const rightPanel = (
      <div style={{ background: "rgba(0,0,0,.18)", border: "1px solid rgba(255,255,255,.18)", borderRadius: 18, padding: "28px 30px", backdropFilter: "blur(8px)" }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", color: "rgba(255,255,255,.85)", marginBottom: 18 }}>↳ Conseils sécurité</div>
        {[
          "Choisissez un mot de passe unique, jamais réutilisé sur un autre service.",
          "Mélangez majuscules, minuscules, chiffres et caractères spéciaux.",
          "Activez la double authentification (2FA) une fois connecté pour plus de sécurité.",
          "Ne partagez jamais votre mot de passe par email ou message.",
        ].map((line, idx) => (
          <div key={idx} style={{ display: "flex", gap: 10, marginBottom: 12, fontSize: 13, lineHeight: 1.5, color: "rgba(255,255,255,.85)" }}>
            <span style={{ color: "#A8FFD2", flexShrink: 0 }}>✓</span>
            <span>{line}</span>
          </div>
        ))}
      </div>
    );

    return renderAuthShell({
      badge: `Réinitialisation · ${resetEmail || ''}`,
      title: <>NOUVEAU<br /><span style={{ color: "rgba(255,255,255,.55)" }}>MOT DE</span><br />PASSE.</>,
      subtitle: "Choisissez un mot de passe robuste pour protéger votre espace Illizeo.",
      leftBody,
      rightPanel,
      backLink: { label: "Retour à la connexion", onClick: () => setResetMode(false) },
    });
  };

  const renderTwoFactorVerify = () => {
    const leftBody = (
      <form onSubmit={async (e) => {
        e.preventDefault();
        try { await auth.verifyTwoFactor(twoFactorCode); } catch { setTwoFactorCode(""); }
      }} style={{ maxWidth: 540 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "8px 14px", borderRadius: 999, border: "1px solid rgba(255,255,255,.25)", background: "rgba(0,0,0,.18)", fontSize: 12, marginBottom: 22 }}>
          <ShieldCheck size={14} /> Authentification à deux facteurs requise
        </div>
        <div style={{ marginBottom: 18 }}>
          <label style={sShellLabel}>Code à 6 chiffres</label>
          <input type="text" inputMode="numeric" pattern="[0-9]*" maxLength={6} value={twoFactorCode} onChange={e => setTwoFactorCode(e.target.value.replace(/\D/g, ""))} placeholder="000000" autoFocus
            style={{ ...sShellInput, textAlign: "center", fontSize: 28, fontWeight: 700, letterSpacing: 12, padding: "20px" }} />
        </div>
        {auth.error && <div style={{ fontSize: 12, color: "#FFD0D0", marginBottom: 12 }}>{auth.error}</div>}
        <button type="submit" disabled={twoFactorCode.length !== 6} style={sShellPrimaryBtn(twoFactorCode.length !== 6)}>
          Vérifier <ArrowRight size={18} />
        </button>
        <div style={{ marginTop: 14, fontSize: 12, color: "rgba(255,255,255,.7)" }}>
          Vous pouvez aussi utiliser un code de récupération à la place du code 2FA.
        </div>
      </form>
    );

    return renderAuthShell({
      badge: "Vérification 2FA",
      title: <>SÉCURITÉ<br /><span style={{ color: "rgba(255,255,255,.55)" }}>DOUBLE</span><br />AUTHENTIFICATION.</>,
      subtitle: "Entrez le code à 6 chiffres généré par votre application d'authentification.",
      leftBody,
      backLink: { label: "Retour à la connexion", onClick: () => { const tid = localStorage.getItem("illizeo_tenant_id"); auth.logout().catch(() => {}).finally(() => { window.location.href = tid ? `/${tid}` : "/"; }); } },
    });
  };

  const renderPricing = () => {
    if (plans.length === 0) getPlans().then(setPlans).catch(() => {});
    const ALL_MODULES = ["onboarding", "offboarding", "crossboarding", "cooptation", "nps", "signature", "sso", "provisioning", "api", "white_label", "gamification"];
    const MODULE_LABELS: Record<string, string> = { onboarding: "Onboarding", offboarding: "Offboarding", crossboarding: "Crossboarding", cooptation: "Cooptation", nps: "NPS & Satisfaction", signature: "Signature électronique", sso: "SSO Microsoft", provisioning: "Provisionnement AD", api: "API", white_label: "White-label", gamification: "Gamification" };
    return (
      <div style={{ minHeight: "100vh", fontFamily: font, background: C.white }}>
        <style dangerouslySetInnerHTML={{ __html: ANIM_STYLES }} />
        <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;1,9..40,400&display=swap" rel="stylesheet" />
        {/* Header */}
        <div style={{ padding: "20px 40px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${C.border}` }}>
          <div style={{ color: C.pink }}><IllizeoLogoFull height={28} /></div>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ display: "flex", gap: 2, padding: 2, background: C.bg, borderRadius: 8 }}>
              {(["monthly", "yearly"] as const).map(b => (
                <button key={b} onClick={() => setPricingBilling(b)} style={{ padding: "6px 16px", borderRadius: 6, fontSize: 12, fontWeight: pricingBilling === b ? 600 : 400, border: "none", cursor: "pointer", fontFamily: font, background: pricingBilling === b ? C.white : "transparent", color: pricingBilling === b ? C.text : C.textMuted, boxShadow: pricingBilling === b ? "0 1px 3px rgba(0,0,0,.1)" : "none", display: "flex", alignItems: "center", gap: 4 }}>
                  {b === "monthly" ? "Mensuel" : "Annuel"}
                  {b === "yearly" && <span style={{ fontSize: 9, padding: "1px 6px", borderRadius: 4, background: C.greenLight, color: C.green, fontWeight: 700 }}>-10%</span>}
                </button>
              ))}
            </div>
            <button onClick={() => setShowPricing(false)} className="iz-btn-outline" style={{ ...sBtn("outline"), fontSize: 13, padding: "8px 20px" }}>{t('misc.return')}</button>
          </div>
        </div>
        {/* Hero */}
        <div style={{ textAlign: "center", padding: "48px 40px 32px" }}>
          <h1 style={{ fontSize: 36, fontWeight: 800, color: C.dark, margin: "0 0 12px" }}>Des tarifs simples et transparents</h1>
          <p style={{ fontSize: 16, color: C.textLight, maxWidth: 600, margin: "0 auto" }}>Une seule plateforme pour l'onboarding, l'offboarding, le crossboarding, la cooptation et la satisfaction.</p>
        </div>
        {/* Plans grid */}
        <div style={{ display: "flex", gap: 24, justifyContent: "center", padding: "0 40px 48px", flexWrap: "wrap" }}>
          {plans.sort((a, b) => a.ordre - b.ordre).map(plan => {
            const monthlyPrice = Number(plan.prix_chf_mensuel);
            const price = pricingBilling === "yearly" ? Math.round(monthlyPrice * 0.9 * 10) / 10 : monthlyPrice;
            const minMensuel = Number(plan.min_mensuel_chf);
            const cur = "CHF";
            const planModules = plan.modules?.map(m => m.module) || [];
            return (
            <div key={plan.id} className="iz-card" style={{ width: 340, borderRadius: 16, border: plan.populaire ? `2px solid ${C.pink}` : `1px solid ${C.border}`, padding: 0, overflow: "hidden", position: "relative", boxShadow: plan.populaire ? "0 8px 30px rgba(194,24,91,.15)" : "0 2px 12px rgba(0,0,0,.04)" }}>
              {plan.populaire && <div style={{ background: C.pink, color: C.white, textAlign: "center", padding: "4px 0", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>Le plus populaire</div>}
              <div style={{ padding: "28px 28px 0" }}>
                <h3 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 4px", color: C.dark }}>{plan.nom}</h3>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 4 }}>
                  <span style={{ fontSize: 40, fontWeight: 800, color: C.dark }}>{price}</span>
                  <span style={{ fontSize: 14, color: C.textMuted }}>{cur}/emp/mois</span>
                </div>
                <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 4 }}>Min. {minMensuel} {cur}/mois · {plan.max_collaborateurs ? `jusqu'à ${plan.max_collaborateurs} collaborateurs` : "Illimité"}</div>
                {pricingBilling === "yearly" && <div style={{ fontSize: 11, color: C.green, fontWeight: 600, marginBottom: 16 }}>Économisez 10% — facturé annuellement ({Math.round(price * 25 * 12)} CHF/an pour 25 emp.)</div>}
                {pricingBilling === "monthly" && <div style={{ marginBottom: 16 }} />}
                {plan.slug === "enterprise" ? (
                  <button onClick={() => window.open("mailto:contact@illizeo.com?subject=Demande Enterprise", "_blank")} className="iz-btn-pink" style={{ ...sBtn("dark"), width: "100%", padding: "12px 0", fontSize: 14 }}>Nous contacter</button>
                ) : (
                  <button onClick={() => {
                    const isSelected = selectedPlanIds.includes(plan.id);
                    if (isSelected) setSelectedPlanIds(prev => prev.filter(id => id !== plan.id));
                    else {
                      // Onboarding plans are exclusive, cooptation is additive
                      const isCoopt = plan.slug === "cooptation";
                      if (isCoopt) setSelectedPlanIds(prev => [...prev, plan.id]);
                      else setSelectedPlanIds(prev => [...prev.filter(id => plans.find(p => p.id === id)?.slug === "cooptation"), plan.id]);
                    }
                  }} style={{
                    width: "100%", padding: "12px 0", fontSize: 14, borderRadius: 8, border: selectedPlanIds.includes(plan.id) ? `2px solid ${C.green}` : `2px solid ${C.pink}`,
                    background: selectedPlanIds.includes(plan.id) ? C.greenLight : C.pink, color: selectedPlanIds.includes(plan.id) ? C.green : C.white,
                    fontWeight: 600, cursor: "pointer", fontFamily: font, transition: "all .15s", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  }}>
                    {selectedPlanIds.includes(plan.id) ? <><CheckCircle size={16} /> Sélectionné</> : "Sélectionner"}
                  </button>
                )}
              </div>
              <div style={{ padding: "20px 28px 28px" }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: C.text, marginBottom: 10 }}>Limites</div>
                <div style={{ fontSize: 12, color: C.textLight, display: "flex", flexDirection: "column", gap: 4, marginBottom: 16 }}>
                  <span>{plan.max_admins ? `${plan.max_admins} admins` : "Admins illimités"}</span>
                  <span>{plan.max_parcours ? `${plan.max_parcours} parcours` : "Parcours illimités"}</span>
                  <span>{plan.max_integrations ? `${plan.max_integrations} intégrations` : "Toutes les intégrations"}</span>
                  <span>{plan.max_workflows ? `${plan.max_workflows} workflows` : "Workflows illimités"}</span>
                </div>
                <div style={{ fontSize: 12, fontWeight: 600, color: C.text, marginBottom: 10 }}>Modules inclus</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {ALL_MODULES.map(mod => {
                    const included = planModules.includes(mod);
                    return (
                    <div key={mod} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: included ? C.text : C.textMuted }}>
                      {included ? <CheckCircle size={14} color={C.green} /> : <XCircle size={14} color={C.border} />}
                      <span style={{ textDecoration: included ? "none" : "line-through" }}>{MODULE_LABELS[mod] || mod}</span>
                    </div>
                    );
                  })}
                </div>
              </div>
            </div>
            );
          })}
        </div>

        {/* Floating bottom bar when plans selected */}
        {selectedPlanIds.length > 0 && (
          <div className="iz-fade-up" style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: C.white, borderTop: `2px solid ${C.pink}`, padding: "16px 40px", display: "flex", alignItems: "center", justifyContent: "center", gap: 20, boxShadow: "0 -4px 20px rgba(0,0,0,.1)", zIndex: 100 }}>
            <div style={{ fontSize: 14, color: C.text }}>
              <b>{selectedPlanIds.length} plan{selectedPlanIds.length > 1 ? "s" : ""} sélectionné{selectedPlanIds.length > 1 ? "s" : ""}</b>
              <span style={{ color: C.textMuted, marginLeft: 8 }}>
                {selectedPlanIds.map(id => plans.find(p => p.id === id)?.nom).filter(Boolean).join(" + ")}
              </span>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => { setPricingBilling("monthly"); }} style={{ padding: "6px 14px", borderRadius: 6, fontSize: 12, fontWeight: pricingBilling === "monthly" ? 600 : 400, border: `1px solid ${C.border}`, background: pricingBilling === "monthly" ? C.pink : C.white, color: pricingBilling === "monthly" ? C.white : C.text, cursor: "pointer", fontFamily: font }}>Mensuel</button>
              <button onClick={() => { setPricingBilling("yearly"); }} style={{ padding: "6px 14px", borderRadius: 6, fontSize: 12, fontWeight: pricingBilling === "yearly" ? 600 : 400, border: `1px solid ${C.border}`, background: pricingBilling === "yearly" ? C.pink : C.white, color: pricingBilling === "yearly" ? C.white : C.text, cursor: "pointer", fontFamily: font, display: "flex", alignItems: "center", gap: 4 }}>Annuel <span style={{ fontSize: 9, padding: "1px 4px", borderRadius: 3, background: C.greenLight, color: C.green, fontWeight: 700 }}>-10%</span></button>
            </div>
            <button onClick={() => { setShowPricing(false); setShowRegister(true); }} className="iz-btn-pink" style={{ ...sBtn("pink"), padding: "12px 32px", fontSize: 15 }}>
              Créer mon espace — Essai gratuit 14 jours
            </button>
          </div>
        )}
      </div>
    );
  };

  // ─── Auth shell — full-screen magenta layout shared by all auth pages ──
  // Mirrors the illizeo.com aesthetic: solid C.pink background, white wordmark
  // top-left, ".COM" link top-right, big display title + form on the left,
  // contextual right panel, footer line. Tenants do NOT customize this layer
  // — it is the public Illizeo brand surface, before any tenant context.
  const ILLIZEO_BG = C.pink; // solid magenta — no gradient, no image
  const renderAuthShell = (opts: {
    badge?: string;
    title: React.ReactNode;
    subtitle?: string;
    leftBody: React.ReactNode;
    rightPanel?: React.ReactNode;
    backLink?: { label: string; onClick: () => void };
  }) => (
    <div style={{ minHeight: "100vh", background: ILLIZEO_BG, fontFamily: font, color: C.white, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <style dangerouslySetInnerHTML={{ __html: ANIM_STYLES }} />
      <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;0,9..40,900;1,9..40,400&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      {/* Decorative corner sparks (visual flourish from the design) */}
      <div aria-hidden style={{ position: "absolute", top: 60, right: -40, width: 200, height: 200, opacity: .15, background: "radial-gradient(circle, #fff 0%, transparent 60%)", pointerEvents: "none" }} />
      <div aria-hidden style={{ position: "absolute", bottom: 80, left: -60, width: 240, height: 240, opacity: .12, background: "radial-gradient(circle, #fff 0%, transparent 60%)", pointerEvents: "none" }} />

      {/* Top bar */}
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "32px 56px", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, filter: "brightness(0) invert(1)" }}>
          <IllizeoLogoFull height={28} />
        </div>
        <a href="https://illizeo.com" target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 18px", borderRadius: 999, border: "1px solid rgba(255,255,255,.5)", color: C.white, fontSize: 12, fontWeight: 600, textDecoration: "none", letterSpacing: 1, textTransform: "uppercase" }}>
          <ArrowRight size={12} style={{ transform: "rotate(-45deg)" }} /> ILLIZEO.COM
        </a>
      </header>

      {/* Main 2-column grid */}
      <main style={{ flex: 1, display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 60, padding: "20px 56px 24px", maxWidth: 1480, width: "100%", margin: "0 auto", boxSizing: "border-box" }}>
        {/* Left column */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", maxWidth: 620 }}>
          {opts.badge && (
            <div style={{ display: "inline-flex", alignSelf: "flex-start", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 999, border: "1px solid rgba(255,255,255,.4)", background: "rgba(255,255,255,.08)", fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", marginBottom: 28 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff" }} />
              {opts.badge}
            </div>
          )}
          <h1 style={{ fontFamily: fontDisplay, fontSize: "clamp(48px, 6.5vw, 88px)", fontWeight: 800, lineHeight: 0.95, letterSpacing: "-0.02em", margin: "0 0 24px", color: C.white }}>
            {opts.title}
          </h1>
          {opts.subtitle && <p style={{ fontSize: 16, lineHeight: 1.5, color: "rgba(255,255,255,.85)", maxWidth: 520, margin: "0 0 36px" }}>{opts.subtitle}</p>}
          <div>{opts.leftBody}</div>
          {opts.backLink && (
            <button onClick={opts.backLink.onClick} style={{ background: "none", border: "none", color: "rgba(255,255,255,.85)", fontSize: 13, cursor: "pointer", fontFamily: font, fontWeight: 500, marginTop: 16, alignSelf: "flex-start", padding: 0 }}>
              ← {opts.backLink.label}
            </button>
          )}
        </div>

        {/* Right column */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
          {opts.rightPanel}
        </div>
      </main>

      {/* Footer */}
      <footer style={{ padding: "22px 56px", display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 11, color: "rgba(255,255,255,.7)", letterSpacing: 1, textTransform: "uppercase", borderTop: "1px solid rgba(255,255,255,.15)", flexShrink: 0 }}>
        <span>© ILLIZEO · {new Date().getFullYear()}</span>
        <span>+1 200 entreprises · ont choisi illizeo</span>
      </footer>
    </div>
  );

  // Helper: build the right-side "recent spaces" panel used by the tenant selector
  const renderRecentSpacesPanel = () => {
    const recents = getRecentTenants();
    return (
      <div style={{ background: "rgba(0,0,0,.18)", border: "1px solid rgba(255,255,255,.18)", borderRadius: 18, padding: "26px 28px", backdropFilter: "blur(8px)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
          <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", color: "rgba(255,255,255,.85)" }}>↳ Vos espaces récents</span>
          <span style={{ fontSize: 10, color: "rgba(255,255,255,.65)", letterSpacing: 1, textTransform: "uppercase" }}>{recents.length} accès</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {recents.length === 0 && (
            <div style={{ padding: "20px 4px", fontSize: 13, color: "rgba(255,255,255,.7)", lineHeight: 1.5 }}>
              Aucun espace consulté récemment. Entrez le nom de votre espace pour commencer.
            </div>
          )}
          {recents.map((r, idx) => {
            const initial = r.slug.charAt(0).toUpperCase();
            const num = String(idx + 1).padStart(2, '0');
            return (
              <button key={r.slug} onClick={() => {
                localStorage.setItem("illizeo_tenant_id", r.slug);
                pushTenantRoot(r.slug);
                setTenantResolved(true);
              }} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderRadius: 12, border: "1px solid rgba(255,255,255,.12)", background: "rgba(255,255,255,.06)", color: C.white, cursor: "pointer", fontFamily: font, textAlign: "left", transition: "all .15s" }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,.12)"; e.currentTarget.style.transform = "translateX(2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,.06)"; e.currentTarget.style.transform = "translateX(0)"; }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: "rgba(0,0,0,.25)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14, flexShrink: 0 }}>{initial}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.2, marginBottom: 2 }}>{r.slug.charAt(0).toUpperCase() + r.slug.slice(1).replace(/-/g, ' ')}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,.65)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.slug}.onboarding.illizeo.com{r.members ? ` · ${r.members} pers.` : ''}</div>
                </div>
                <span style={{ fontSize: 10, color: "rgba(255,255,255,.5)", letterSpacing: 1 }}>{num}</span>
                <ArrowRight size={16} color="rgba(255,255,255,.7)" />
              </button>
            );
          })}
          <button onClick={() => setShowRegister(true)} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderRadius: 12, border: "1px dashed rgba(255,255,255,.25)", background: "transparent", color: C.white, cursor: "pointer", fontFamily: font, textAlign: "left", transition: "all .15s" }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,.08)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, border: "1px dashed rgba(255,255,255,.4)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Plus size={18} /></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 2 }}>Créer un nouvel espace</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,.65)" }}>Lancez Illizeo pour votre entreprise</div>
            </div>
            <ArrowRight size={16} color="rgba(255,255,255,.7)" />
          </button>
        </div>
      </div>
    );
  };

  const renderTenantSelection = () => {
    const submit = async (e?: React.FormEvent) => {
      e?.preventDefault();
      const slug = tenantInput.toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-|-$/g, "");
      if (!slug) return;
      setTenantError("");
      setTenantChecking(true);
      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8001/api/v1";
        const res = await fetch(`${baseUrl}/tenant-check`, { headers: { "X-Tenant": slug, "Accept": "application/json" } });
        if (!res.ok) throw new Error();
        const data = await res.json();
        if (data.status === "ok") {
          localStorage.setItem("illizeo_tenant_id", slug);
          addRecentTenant(slug, data.members);
          pushTenantRoot(slug);
          setTenantResolved(true);
        } else { throw new Error(); }
      } catch {
        setTenantError(`L'espace "${slug}" n'existe pas. Vérifiez le nom ou créez un nouvel espace.`);
      } finally { setTenantChecking(false); }
    };

    const leftBody = (
      <form onSubmit={submit} style={{ maxWidth: 540 }}>
        <label style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", color: "rgba(255,255,255,.8)", display: "block", marginBottom: 10 }}>Votre espace</label>
        <div style={{ display: "flex", alignItems: "stretch", borderRadius: 10, overflow: "hidden", background: "rgba(0,0,0,.22)", border: "1px solid rgba(255,255,255,.18)", marginBottom: 14 }}>
          <input value={tenantInput} autoFocus onChange={e => { setTenantInput(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "")); setTenantError(""); }} placeholder="acme-corp" required
            style={{ flex: 1, padding: "16px 18px", border: "none", outline: "none", background: "transparent", fontSize: 16, fontFamily: font, color: C.white, fontWeight: 700 }} />
          <span style={{ padding: "16px 18px", fontSize: 13, color: "rgba(255,255,255,.6)", background: "rgba(0,0,0,.15)", whiteSpace: "nowrap", display: "flex", alignItems: "center" }}>.onboarding.illizeo.com</span>
        </div>
        {tenantError && <div style={{ fontSize: 12, color: "#FFE0E0", marginBottom: 12, padding: "8px 12px", background: "rgba(0,0,0,.25)", borderRadius: 8, border: "1px solid rgba(255,255,255,.2)" }}>{tenantError}</div>}
        <button type="submit" disabled={!tenantInput.trim() || tenantChecking}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, width: "100%", padding: "18px 0", borderRadius: 10, border: "none", background: C.white, color: C.dark, fontSize: 15, fontWeight: 700, fontFamily: font, cursor: !tenantInput.trim() || tenantChecking ? "not-allowed" : "pointer", opacity: !tenantInput.trim() || tenantChecking ? 0.6 : 1, letterSpacing: 1, textTransform: "uppercase", transition: "transform .15s" }}
          onMouseEnter={e => { if (!e.currentTarget.disabled) e.currentTarget.style.transform = "translateY(-1px)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}>
          {tenantChecking ? "Vérification…" : "Continuer"} <ArrowRight size={18} />
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 18, fontSize: 13 }}>
          <button type="button" onClick={() => addToast_admin("Saisissez l'URL fournie par votre administrateur, ou contactez votre RH.")} style={{ background: "none", border: "none", color: "rgba(255,255,255,.85)", cursor: "pointer", fontFamily: font, padding: 0, display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 14, height: 14, borderRadius: "50%", border: "1px solid currentColor", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 9 }}>?</span> J'ai oublié l'URL de mon espace
          </button>
          <span style={{ width: 1, height: 12, background: "rgba(255,255,255,.3)" }} />
          <button type="button" onClick={() => setShowPricing(true)} style={{ background: "none", border: "none", color: "rgba(255,255,255,.85)", cursor: "pointer", fontFamily: font, padding: 0 }}>
            Voir les tarifs
          </button>
          <button type="button" onClick={() => window.open("mailto:support@illizeo.com", "_blank")} style={{ background: "none", border: "none", color: "rgba(255,255,255,.85)", cursor: "pointer", fontFamily: font, padding: 0 }}>
            Besoin d'aide ?
          </button>
        </div>
      </form>
    );

    return renderAuthShell({
      badge: "Bienvenue · +1 200 entreprises",
      title: <>VOS RH,<br /><span style={{ color: "rgba(255,255,255,.55)" }}>EN UN SEUL</span><br />ESPACE.</>,
      subtitle: "La solution RH tout-en-un. Onboarding, paie, congés et talents — réunis pour vos équipes.",
      leftBody,
      rightPanel: renderRecentSpacesPanel(),
    });
  };

  // Default policy for tenant registration (no tenant context yet)
  const defaultPolicy: PasswordPolicy = { min_length: 8, uppercase: true, lowercase: true, number: true, special: false, no_common: true, no_name: false, max_attempts: 5, history_count: 3, expiry_days: 0 };

  // Dark inputs styled for the magenta auth shell
  const sShellInput: React.CSSProperties = {
    width: "100%", padding: "14px 16px", borderRadius: 10, border: "1px solid rgba(255,255,255,.22)",
    background: "rgba(0,0,0,.22)", outline: "none", fontSize: 14, fontFamily: font, color: C.white,
    fontWeight: 500, boxSizing: "border-box",
  };
  const sShellLabel: React.CSSProperties = {
    fontSize: 11, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase",
    color: "rgba(255,255,255,.8)", display: "block", marginBottom: 8,
  };
  const sShellPrimaryBtn = (disabled?: boolean): React.CSSProperties => ({
    display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
    width: "100%", padding: "16px 0", borderRadius: 10, border: "none",
    background: C.white, color: C.dark, fontSize: 14, fontWeight: 700, fontFamily: font,
    cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.55 : 1,
    letterSpacing: 1, textTransform: "uppercase",
  });

  const renderRegisterFormLeft = () => (
    <form onSubmit={async (e) => {
      e.preventDefault();
      setRegLoading(true);
      try {
        const res = await registerTenant({ ...regData, admin_name: `${regData.admin_prenom} ${regData.admin_nom}`.trim() });
        localStorage.setItem("illizeo_tenant_id", res.tenant_id);
        localStorage.setItem("illizeo_trial_start", new Date().toISOString());
        localStorage.setItem("illizeo_needs_plan", "true");
        addRecentTenant(res.tenant_id);
        window.location.href = `/${res.tenant_id}`;
      } catch (err: any) {
        let msg = "Erreur lors de la création";
        try { const parsed = JSON.parse(err?.message || ""); msg = parsed?.message || msg; } catch {}
        addToast_admin(msg);
      } finally { setRegLoading(false); }
    }} style={{ maxWidth: 540 }}>
      <div style={{ marginBottom: 14 }}>
        <label style={sShellLabel}>Nom de l'entreprise *</label>
        <input value={regData.company_name} onChange={e => {
          const v = e.target.value;
          setRegData((p: any) => ({ ...p, company_name: v }));
          const slug = v.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
          setRegTenantSlug(slug);
        }} placeholder="Acme Corp" required style={sShellInput} />
        {regTenantSlug && <div style={{ fontSize: 11, color: "rgba(255,255,255,.7)", marginTop: 6 }}>Votre espace : <span style={{ fontWeight: 700, color: C.white }}>{regTenantSlug}</span>.onboarding.illizeo.com</div>}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
        <div>
          <label style={sShellLabel}>Prénom *</label>
          <input value={regData.admin_prenom} onChange={e => setRegData((p: any) => ({ ...p, admin_prenom: e.target.value }))} placeholder="Jean-Pierre" required style={sShellInput} />
        </div>
        <div>
          <label style={sShellLabel}>Nom *</label>
          <input value={regData.admin_nom} onChange={e => setRegData((p: any) => ({ ...p, admin_nom: e.target.value }))} placeholder="Dupont" required style={sShellInput} />
        </div>
      </div>
      <div style={{ marginBottom: 14 }}>
        <label style={sShellLabel}>Email professionnel *</label>
        <input type="email" value={regData.admin_email} onChange={e => setRegData((p: any) => ({ ...p, admin_email: e.target.value }))} placeholder="vous@entreprise.com" required style={sShellInput} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
        <div>
          <label style={sShellLabel}>Mot de passe *</label>
          <input type="password" value={regData.password} onChange={e => setRegData((p: any) => ({ ...p, password: e.target.value }))} placeholder={`Min. ${defaultPolicy.min_length} caractères`} required style={sShellInput} />
        </div>
        <div>
          <label style={sShellLabel}>Confirmer *</label>
          <input type="password" value={regData.password_confirmation} onChange={e => setRegData((p: any) => ({ ...p, password_confirmation: e.target.value }))} placeholder="Répéter" required style={sShellInput} />
        </div>
      </div>
      {regData.password && (
        <div style={{ marginBottom: 16, padding: "12px 14px", background: "rgba(0,0,0,.18)", borderRadius: 10, border: "1px solid rgba(255,255,255,.12)" }}>
          {checkPwdRules(regData.password, defaultPolicy).map(r => (
            <div key={r.key} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, lineHeight: 1.7, color: r.met ? "#A8FFD2" : "rgba(255,255,255,.7)" }}>
              {r.met ? <Check size={12} /> : <X size={12} />}<span>{r.label}</span>
            </div>
          ))}
          {regData.password_confirmation && regData.password !== regData.password_confirmation && (
            <div style={{ fontSize: 11, color: "#FFD0D0", marginTop: 4 }}>Les mots de passe ne correspondent pas</div>
          )}
        </div>
      )}
      <button type="submit" disabled={regLoading || !regData.company_name || !regData.admin_prenom || !regData.admin_nom || !regData.admin_email || !allPwdRulesMet(regData.password, defaultPolicy) || regData.password !== regData.password_confirmation}
        style={sShellPrimaryBtn(regLoading || !regData.company_name || !regData.admin_prenom || !regData.admin_nom || !regData.admin_email || !allPwdRulesMet(regData.password, defaultPolicy) || regData.password !== regData.password_confirmation)}>
        {regLoading ? "Création en cours…" : "Créer mon espace Illizeo"} <ArrowRight size={18} />
      </button>
    </form>
  );

  const renderRegisterRightPanel = () => (
    <div style={{ background: "rgba(0,0,0,.18)", border: "1px solid rgba(255,255,255,.18)", borderRadius: 18, padding: "28px 30px", backdropFilter: "blur(8px)" }}>
      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", color: "rgba(255,255,255,.85)", marginBottom: 22 }}>↳ Tout inclus dès le 1er jour</div>
      {[
        { icon: Sparkles, title: "Essai 14 jours offerts", desc: "Aucune carte requise. Annulez à tout moment." },
        { icon: Users, title: "Onboarding & Offboarding", desc: "Workflows complets, parcours, signatures, documents." },
        { icon: Zap, title: "IA intégrée", desc: "OCR, génération de contrats, chatbot RH." },
        { icon: ShieldCheck, title: "Conforme RGPD & Suisse", desc: "Hébergement Suisse, audit complet." },
      ].map(({ icon: Icon, title, desc }) => (
        <div key={title} style={{ display: "flex", gap: 14, marginBottom: 18 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(255,255,255,.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Icon size={18} /></div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 2 }}>{title}</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,.7)", lineHeight: 1.5 }}>{desc}</div>
          </div>
        </div>
      ))}
      <button onClick={() => setShowPricing(true)} style={{ marginTop: 8, padding: "10px 20px", borderRadius: 999, border: "1px solid rgba(255,255,255,.45)", background: "transparent", color: C.white, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: font, letterSpacing: 1, textTransform: "uppercase" }}>
        Voir les tarifs détaillés →
      </button>
    </div>
  );

  const renderRegister = () => renderAuthShell({
    badge: "Créer un espace · Essai 14 jours",
    title: <>LANCEZ<br /><span style={{ color: "rgba(255,255,255,.55)" }}>VOTRE ESPACE</span><br />ILLIZEO.</>,
    subtitle: "Quelques minutes pour configurer votre plateforme RH. Pas de carte bancaire, pas d'engagement.",
    leftBody: renderRegisterFormLeft(),
    rightPanel: renderRegisterRightPanel(),
    backLink: { label: "Déjà un compte ? Se connecter", onClick: () => setShowRegister(false) },
  });

  const renderLogin = () => {
    const tenantId = localStorage.getItem("illizeo_tenant_id") || "illizeo";
    const submit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoginLoading(true);
      try {
        await auth.login(loginEmail, loginPassword);
        const currentTid = new URLSearchParams(window.location.search).get("tenant") || localStorage.getItem("illizeo_tenant_id");
        if (currentTid) { localStorage.setItem("illizeo_tenant_id", currentTid); addRecentTenant(currentTid); }
      } catch {} finally { setLoginLoading(false); }
    };

    const leftBody = (
      <div style={{ maxWidth: 540 }}>
        {/* Current space chip */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "8px 14px", borderRadius: 999, border: "1px solid rgba(255,255,255,.25)", background: "rgba(0,0,0,.18)", fontSize: 12, marginBottom: 22 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#A8FFD2" }} />
          <span style={{ color: "rgba(255,255,255,.8)" }}>{t('login.space')}</span>
          <span style={{ fontWeight: 700 }}>{tenantId}</span>
          <button onClick={() => { localStorage.removeItem("illizeo_tenant_id"); window.history.replaceState({}, "", "/"); setTenantResolved(false); }}
            style={{ background: "none", border: "none", color: "rgba(255,255,255,.7)", fontSize: 11, cursor: "pointer", fontFamily: font, textDecoration: "underline" }}>{t('login.change')}</button>
        </div>

        {auth.error && (
          <div style={{ padding: "12px 16px", borderRadius: 10, background: "rgba(0,0,0,.25)", border: "1px solid rgba(255,255,255,.25)", color: "#FFE0E0", fontSize: 13, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
            <AlertTriangle size={14} /> {auth.error}
          </div>
        )}

        <form onSubmit={submit}>
          <div style={{ marginBottom: 14 }}>
            <label style={sShellLabel}>Email</label>
            <input type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} placeholder="votre@email.com" required autoFocus style={sShellInput} />
          </div>
          <div style={{ marginBottom: 18 }}>
            <label style={sShellLabel}>Mot de passe</label>
            <input type="password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} placeholder="••••••••" required style={sShellInput} />
          </div>
          <button type="submit" disabled={loginLoading} style={sShellPrimaryBtn(loginLoading)}>
            {loginLoading ? "Connexion…" : "Se connecter"} <ArrowRight size={18} />
          </button>
        </form>

        {/* SSO */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "20px 0", color: "rgba(255,255,255,.55)" }}>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,.2)" }} />
          <span style={{ fontSize: 11, letterSpacing: 1, textTransform: "uppercase" }}>{t('login.or')}</span>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,.2)" }} />
        </div>
        <button onClick={async () => {
          try {
            addToast_admin("Redirection vers Microsoft…");
            const res = await apiFetch<{ redirect_url: string }>('/auth/microsoft/redirect');
            if (res.redirect_url) { window.location.href = res.redirect_url; } else { addToast_admin("SSO non configuré"); }
          } catch (err: any) {
            addToast_admin("Erreur SSO : " + (err?.message || "connexion impossible"));
            setLoginLoading(false);
          }
        }} style={{ width: "100%", padding: "14px 0", borderRadius: 10, border: "1px solid rgba(255,255,255,.3)", background: "rgba(255,255,255,.08)", color: C.white, fontFamily: font, fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, letterSpacing: 1, textTransform: "uppercase" }}>
          <Globe size={16} /> {t('login.sso_microsoft')}
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 18, fontSize: 13 }}>
          <button onClick={() => { setForgotMode(true); setForgotEmail(loginEmail); setForgotSent(false); }}
            style={{ background: "none", border: "none", color: "rgba(255,255,255,.85)", cursor: "pointer", fontFamily: font, padding: 0 }}>
            Mot de passe oublié ?
          </button>
          <span style={{ width: 1, height: 12, background: "rgba(255,255,255,.3)" }} />
          <button onClick={() => setShowRegister(true)} style={{ background: "none", border: "none", color: "rgba(255,255,255,.85)", cursor: "pointer", fontFamily: font, padding: 0 }}>
            {t('login.create_space')}
          </button>
        </div>

        {forgotMode && (
          <div style={{ marginTop: 18, padding: "18px 20px", background: "rgba(0,0,0,.22)", border: "1px solid rgba(255,255,255,.18)", borderRadius: 12 }}>
            {forgotSent ? (
              <div style={{ textAlign: "center" }}>
                <CheckCircle size={24} color="#A8FFD2" style={{ marginBottom: 8 }} />
                <div style={{ fontSize: 14, fontWeight: 700, color: "#A8FFD2", marginBottom: 4 }}>Email envoyé !</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,.8)" }}>Vérifiez votre boîte de réception.</div>
                <button onClick={() => setForgotMode(false)} style={{ marginTop: 12, padding: "8px 16px", borderRadius: 8, border: "1px solid rgba(255,255,255,.4)", background: "transparent", color: C.white, fontSize: 12, cursor: "pointer", fontFamily: font }}>Retour à la connexion</button>
              </div>
            ) : (
              <>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 6 }}>Réinitialiser le mot de passe</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,.75)", marginBottom: 12 }}>Entrez votre email pour recevoir un lien.</div>
                <input type="email" value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} placeholder="votre@email.com" style={{ ...sShellInput, marginBottom: 10 }} />
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => setForgotMode(false)} style={{ flex: 1, padding: "10px 0", borderRadius: 8, border: "1px solid rgba(255,255,255,.3)", background: "transparent", color: C.white, fontSize: 12, cursor: "pointer", fontFamily: font }}>{t('common.cancel')}</button>
                  <button disabled={forgotLoading || !forgotEmail.trim()} onClick={async () => {
                    setForgotLoading(true);
                    try { await apiFetch('/forgot-password', { method: 'POST', body: JSON.stringify({ email: forgotEmail }) }); setForgotSent(true); }
                    catch { setForgotSent(true); }
                    finally { setForgotLoading(false); }
                  }} style={{ flex: 1, padding: "10px 0", borderRadius: 8, border: "none", background: C.white, color: C.dark, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: font, opacity: forgotLoading ? 0.6 : 1 }}>
                    {forgotLoading ? "Envoi…" : "Envoyer"}
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    );

    return renderAuthShell({
      badge: `Connexion · ${tenantId}.onboarding.illizeo.com`,
      title: <>BIENVENUE,<br /><span style={{ color: "rgba(255,255,255,.55)" }}>RECONNECTEZ-VOUS</span><br />À VOTRE ESPACE.</>,
      subtitle: "Retrouvez vos collaborateurs, parcours, signatures et tous vos outils RH au même endroit.",
      leftBody,
      rightPanel: renderRecentSpacesPanel(),
    });
  };

  const renderEmailInvitation = () => {
    return (
      <div style={{ minHeight: "100vh", background: "#E8E4DF", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: font }}>
        {/* Email client frame */}
        <div style={{ width: "100%", maxWidth: 720, margin: "24px" }}>
          {/* Email client header bar */}
          <div style={{ background: "#fff", borderRadius: "12px 12px 0 0", padding: "14px 20px", display: "flex", alignItems: "center", gap: 12, borderBottom: `1px solid ${C.border}` }}>
            <div style={{ display: "flex", gap: 6 }}>
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#FF5F57" }} />
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#FFBD2E" }} />
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#28CA41" }} />
            </div>
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ padding: "4px 16px", background: C.bg, borderRadius: 6, fontSize: 12, color: C.textLight }}>
                <Mail size={12} style={{ display: "inline", verticalAlign: "middle", marginRight: 6 }} />
                Boîte de réception — nadia.ferreira@gmail.com
              </div>
            </div>
          </div>
          {/* Email metadata */}
          <div style={{ background: "#fff", padding: "16px 24px", borderBottom: `1px solid ${C.border}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, #E41076, #E91E8C)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <IllizeoLogo size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>Illizeo Onboard <span style={{ fontWeight: 400, color: C.textLight }}>{"<"}noreply@illizeo.com{">"}</span></div>
                <div style={{ fontSize: 12, color: C.textMuted }}>à moi</div>
              </div>
              <div style={{ fontSize: 12, color: C.textMuted }}>27 mars 2026, 09:15</div>
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, color: C.text }}>Bienvenue chez Illizeo — Votre espace d'intégration est prêt</div>
          </div>
          {/* Email body */}
          <div style={{ background: C.white, padding: "40px 40px 32px", textAlign: "center" }}>
            <div style={{ marginBottom: 20 }}><IllizeoLogo size={56} /></div>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: C.text, marginBottom: 24 }}>Bienvenue Nadia</h2>
            <p style={{ fontSize: 15, lineHeight: 1.7, color: C.text, marginBottom: 16 }}>
              C'est avec une immense joie que nous t'accueillons chez Illizeo !
            </p>
            <p style={{ fontSize: 15, lineHeight: 1.7, color: C.text, marginBottom: 16 }}>
              Nous te remercions pour ta confiance et sommes impatients de t'accueillir dans cette belle aventure le <strong>01/06/2026</strong>.
            </p>
            <p style={{ fontSize: 15, lineHeight: 1.7, color: C.text, marginBottom: 16 }}>
              Nous t'invitons à te connecter dès à présent à <strong>Illizeo Onboard</strong> pour que nous puissions préparer ensemble et au mieux ton arrivée.
            </p>
            <p style={{ fontSize: 15, color: C.text, marginBottom: 32 }}>
              N'hésite pas à nous contacter si tu as des questions.<br /><br />À bientôt,
            </p>
            <button className="iz-btn-pink iz-glow" onClick={() => setStep("welcome_banner")} style={{ ...sBtn("pink"), padding: "14px 48px", borderRadius: 28, fontSize: 16 }}>
              C'est parti
            </button>
            <div style={{ marginTop: 24, fontSize: 12, color: C.textMuted }}>
              Illizeo Onboard, Support Functions
            </div>
          </div>
          {/* Email client footer */}
          <div style={{ background: "#fff", borderRadius: "0 0 12px 12px", padding: "12px 24px", borderTop: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 16, fontSize: 12, color: C.textMuted }}>
            <ArrowRight size={14} /> Répondre
            <span style={{ marginLeft: "auto" }}>Cet email a été envoyé automatiquement par Illizeo Onboard</span>
          </div>
        </div>
      </div>
    );
  };

  return {
    renderResetPassword,
    renderTwoFactorVerify,
    renderPricing,
    renderTenantSelection,
    renderRegister,
    renderLogin,
    renderEmailInvitation,
  };
}
