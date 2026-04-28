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
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: font, background: loginBgImage ? `url(${loginBgImage}) center/cover no-repeat` : `linear-gradient(135deg, ${loginGradientStart || C.dark} 0%, ${loginGradientEnd || C.pink} 100%)` }}>
        <style dangerouslySetInnerHTML={{ __html: ANIM_STYLES }} />
        <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;1,9..40,400&display=swap" rel="stylesheet" />
        <div className="iz-scale-in" style={{ width: 400, background: C.white, borderRadius: 16, padding: "40px 40px 36px", boxShadow: "0 20px 60px rgba(0,0,0,.3)" }}>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{ marginBottom: 8 }}><img src={getLogoFullUri()} alt="Illizeo" style={{ height: 48, objectFit: "contain", display: "block", margin: "0 auto" }} /></div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: C.dark, margin: 0 }}>Nouveau mot de passe</h1>
            <p style={{ fontSize: 13, color: C.textLight, marginTop: 4 }}>Choisissez un nouveau mot de passe pour {resetEmail}</p>
          </div>
          {resetDone ? (
            <div style={{ textAlign: "center" }}>
              <CheckCircle size={32} color={C.green} style={{ marginBottom: 12 }} />
              <div style={{ fontSize: 16, fontWeight: 600, color: C.green, marginBottom: 8 }}>Mot de passe modifié !</div>
              <div style={{ fontSize: 13, color: C.textLight, marginBottom: 20 }}>Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.</div>
              <button onClick={() => { setResetMode(false); setResetDone(false); }} className="iz-btn-pink" style={{ ...sBtn("pink"), width: "100%" }}>Se connecter</button>
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
            }}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Nouveau mot de passe</label>
                <input type="password" value={resetPassword} onChange={e => setResetPassword(e.target.value)} placeholder={`Minimum ${pwdPolicy?.min_length ?? 8} caract\u00e8res`} required
                  style={{ ...sInput, background: C.bg }} />
                {resetPassword && renderPwdChecklist(resetPassword, pwdPolicy)}
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Confirmer le mot de passe</label>
                <input type="password" value={resetConfirm} onChange={e => setResetConfirm(e.target.value)} placeholder="R\u00e9p\u00e9tez le mot de passe" required
                  style={{ ...sInput, background: C.bg }} />
                {resetConfirm && resetPassword !== resetConfirm && <div style={{ fontSize: 11, color: C.red, marginTop: 4 }}>Les mots de passe ne correspondent pas</div>}
              </div>
              <button type="submit" disabled={resetLoading || !allPwdRulesMet(resetPassword, pwdPolicy) || resetPassword !== resetConfirm}
                className="iz-btn-pink" style={{ ...sBtn("pink"), width: "100%", padding: "12px 0", fontSize: 15, opacity: resetLoading ? 0.6 : 1 }}>
                {resetLoading ? "Enregistrement..." : "Enregistrer le mot de passe"}
              </button>
              <div style={{ textAlign: "center", marginTop: 12 }}>
                <button type="button" onClick={() => setResetMode(false)} style={{ background: "none", border: "none", color: C.pink, fontSize: 13, cursor: "pointer", fontFamily: font }}>Retour à la connexion</button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  };

  const renderTwoFactorVerify = () => {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: font, background: loginBgImage ? `url(${loginBgImage}) center/cover no-repeat` : `linear-gradient(135deg, ${loginGradientStart || C.dark} 0%, ${loginGradientEnd || C.pink} 100%)` }}>
        <style dangerouslySetInnerHTML={{ __html: ANIM_STYLES }} />
        <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;1,9..40,400&display=swap" rel="stylesheet" />
        <div className="iz-scale-in" style={{ width: 400, background: C.white, borderRadius: 16, padding: "40px 40px 36px", boxShadow: "0 20px 60px rgba(0,0,0,.3)" }}>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{ marginBottom: 8 }}><img src={getLogoFullUri()} alt="Illizeo" style={{ height: 48, objectFit: "contain", display: "block", margin: "0 auto" }} /></div>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: C.pinkBg, display: "flex", alignItems: "center", justifyContent: "center", margin: "16px auto" }}><ShieldCheck size={28} color={C.pink} /></div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: C.dark, margin: 0 }}>Vérification 2FA</h1>
            <p style={{ fontSize: 13, color: C.textLight, marginTop: 4 }}>Entrez le code de votre application d'authentification</p>
          </div>
          <form onSubmit={async (e) => {
            e.preventDefault();
            try { await auth.verifyTwoFactor(twoFactorCode); } catch { setTwoFactorCode(""); }
          }}>
            <div style={{ marginBottom: 20 }}>
              <input type="text" inputMode="numeric" pattern="[0-9]*" maxLength={6} value={twoFactorCode} onChange={e => setTwoFactorCode(e.target.value.replace(/\D/g, ""))}
                placeholder="000000" autoFocus
                style={{ ...sInput, textAlign: "center", fontSize: 28, fontWeight: 700, letterSpacing: 12, padding: "16px", background: C.bg }} />
            </div>
            {auth.error && <div style={{ fontSize: 12, color: C.red, textAlign: "center", marginBottom: 12 }}>{auth.error}</div>}
            <button type="submit" disabled={twoFactorCode.length !== 6} className="iz-btn-pink" style={{ ...sBtn("pink"), width: "100%", padding: "12px 0", fontSize: 15, opacity: twoFactorCode.length !== 6 ? 0.5 : 1 }}>
              Vérifier
            </button>
            <div style={{ textAlign: "center", marginTop: 16 }}>
              <p style={{ fontSize: 11, color: C.textMuted, marginBottom: 8 }}>Vous pouvez aussi utiliser un code de récupération</p>
              <button type="button" onClick={() => { const tid = localStorage.getItem("illizeo_tenant_id"); auth.logout().catch(() => {}).finally(() => { window.location.href = tid ? `/${tid}` : "/"; }); }} style={{ background: "none", border: "none", color: C.pink, fontSize: 13, cursor: "pointer", fontFamily: font }}>Retour à la connexion</button>
            </div>
          </form>
        </div>
      </div>
    );
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

  // Default Illizeo gradient — used for tenant selection page (not customizable by clients)
  const ILLIZEO_DEFAULT_GRADIENT = "linear-gradient(135deg, #1a1a2e 0%, #2D1B3D 50%, #E41076 100%)";

  const renderTenantSelection = () => {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: font, background: ILLIZEO_DEFAULT_GRADIENT }}>
        <style dangerouslySetInnerHTML={{ __html: ANIM_STYLES }} />
        <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;1,9..40,400&display=swap" rel="stylesheet" />
        <div className="iz-scale-in" style={{ width: 440, background: C.white, borderRadius: 16, padding: "40px 40px 36px", boxShadow: "0 20px 60px rgba(0,0,0,.3)" }}>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{ marginBottom: 8 }}><img src={getLogoFullUri()} alt="Illizeo" style={{ height: 48, objectFit: "contain", display: "block", margin: "0 auto" }} /></div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: C.dark, margin: 0 }}>Bienvenue</h1>
            <p style={{ fontSize: 13, color: C.textLight, marginTop: 4 }}>Entrez le nom de votre espace pour continuer</p>
          </div>
          <form onSubmit={async e => {
            e.preventDefault();
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
                pushTenantRoot(slug);
                setTenantResolved(true);
              } else { throw new Error(); }
            } catch {
              setTenantError(`L'espace "${slug}" n'existe pas. Vérifiez le nom ou créez un nouvel espace.`);
            } finally { setTenantChecking(false); }
          }}>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Votre espace</label>
              <div style={{ display: "flex", alignItems: "center", borderRadius: 8, border: `1px solid ${C.border}`, overflow: "hidden", background: C.bg }}>
                <input value={tenantInput} onChange={e => { setTenantInput(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "")); setTenantError(""); }} placeholder="mon-entreprise" required
                  style={{ flex: 1, padding: "12px 14px", border: "none", outline: "none", background: "transparent", fontSize: 15, fontFamily: font, color: C.text, fontWeight: 600 }} />
                <span style={{ padding: "12px 14px", fontSize: 13, color: C.textMuted, background: C.white, borderLeft: `1px solid ${C.border}`, whiteSpace: "nowrap" }}>.onboarding.illizeo.com</span>
              </div>
              {tenantInput && !tenantError && <div style={{ fontSize: 11, color: C.textMuted, marginTop: 6 }}>Vous serez connecté à <span style={{ fontWeight: 600, color: C.pink }}>{tenantInput}.onboarding.illizeo.com</span></div>}
              {tenantError && <div style={{ fontSize: 12, color: C.red, marginTop: 8, padding: "8px 12px", background: C.redLight, borderRadius: 8 }}>{tenantError}</div>}
            </div>
            <button type="submit" disabled={!tenantInput.trim() || tenantChecking} className="iz-btn-pink" style={{ ...sBtn("pink"), width: "100%", padding: "12px 0", fontSize: 15, opacity: !tenantInput.trim() || tenantChecking ? 0.5 : 1 }}>
              {tenantChecking ? "Vérification..." : "Continuer"}
            </button>
          </form>
          <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0" }}>
            <div style={{ flex: 1, height: 1, background: C.border }} />
            <span style={{ fontSize: 11, color: C.textMuted }}>{t('login.or')}</span>
            <div style={{ flex: 1, height: 1, background: C.border }} />
          </div>
          <button onClick={() => setShowRegister(true)} style={{ width: "100%", padding: "11px 0", borderRadius: 8, border: `1px solid ${C.border}`, background: C.white, cursor: "pointer", fontFamily: font, fontSize: 14, fontWeight: 500, color: C.text, transition: "all .15s" }}
            onMouseEnter={e => (e.currentTarget.style.background = C.bg)} onMouseLeave={e => (e.currentTarget.style.background = C.white)}>
            Créer un nouvel espace
          </button>
          <div style={{ textAlign: "center", marginTop: 12 }}>
            <button onClick={() => setShowPricing(true)} style={{ background: "none", border: "none", color: C.pink, fontSize: 13, cursor: "pointer", fontFamily: font, fontWeight: 500 }}>Voir les tarifs</button>
          </div>
        </div>
      </div>
    );
  };

  // Default policy for tenant registration (no tenant context yet)
  const defaultPolicy: PasswordPolicy = { min_length: 8, uppercase: true, lowercase: true, number: true, special: false, no_common: true, no_name: false, max_attempts: 5, history_count: 3, expiry_days: 0 };

  const renderRegister = () => {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: font, background: loginBgImage ? `url(${loginBgImage}) center/cover no-repeat` : `linear-gradient(135deg, ${loginGradientStart || C.dark} 0%, ${loginGradientEnd || C.pink} 100%)` }}>
        <style dangerouslySetInnerHTML={{ __html: ANIM_STYLES }} />
        <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;1,9..40,400&display=swap" rel="stylesheet" />
        <div className="iz-scale-in" style={{ width: 480, background: C.white, borderRadius: 16, padding: "36px 40px", boxShadow: "0 20px 60px rgba(0,0,0,.3)" }}>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <div style={{ marginBottom: 8 }}><img src={getLogoFullUri()} alt="Illizeo" style={{ height: 44, objectFit: "contain", display: "block", margin: "0 auto" }} /></div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: C.dark, margin: 0 }}>Créer votre espace</h1>
            <p style={{ fontSize: 13, color: C.textLight, marginTop: 4 }}>Lancez votre plateforme d'onboarding en quelques secondes</p>
          </div>
          <form onSubmit={async (e) => {
            e.preventDefault();
            setRegLoading(true);
            try {
              const res = await registerTenant({ ...regData, admin_name: `${regData.admin_prenom} ${regData.admin_nom}`.trim() });
              // Store tenant ID, mark trial start, skip to subscription page
              localStorage.setItem("illizeo_tenant_id", res.tenant_id);
              localStorage.setItem("illizeo_trial_start", new Date().toISOString());
              localStorage.setItem("illizeo_needs_plan", "true");
              // Navigate with tenant param to skip tenant selection
              window.location.href = `/${res.tenant_id}`;
            } catch (err: any) {
              let msg = "Erreur lors de la création";
              try { const parsed = JSON.parse(err?.message || ""); msg = parsed?.message || msg; } catch {}
              addToast_admin(msg);
            } finally { setRegLoading(false); }
          }}>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Nom de l'entreprise *</label>
              <input value={regData.company_name} onChange={e => {
                const v = e.target.value;
                setRegData(p => ({ ...p, company_name: v }));
                // Check slug availability with debounce
                const slug = v.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
                setRegTenantSlug(slug);
              }} placeholder="Ex: Acme Corp" required style={sInput} />
              {regTenantSlug && <div style={{ fontSize: 11, color: C.textMuted, marginTop: 4 }}>Votre espace : <span style={{ fontWeight: 600, color: C.pink }}>{regTenantSlug}</span>.onboarding.illizeo.com</div>}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Prénom *</label>
                <input value={regData.admin_prenom} onChange={e => setRegData(p => ({ ...p, admin_prenom: e.target.value }))} placeholder="Ex: Jean-Pierre" required style={sInput} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Nom *</label>
                <input value={regData.admin_nom} onChange={e => setRegData(p => ({ ...p, admin_nom: e.target.value }))} placeholder="Ex: De La Fontaine" required style={sInput} />
              </div>
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Email professionnel *</label>
              <input type="email" value={regData.admin_email} onChange={e => setRegData(p => ({ ...p, admin_email: e.target.value }))} placeholder="vous@entreprise.com" required style={sInput} />
            </div>
            <div style={{ marginBottom: 8 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Mot de passe *</label>
                  <input type="password" value={regData.password} onChange={e => setRegData(p => ({ ...p, password: e.target.value }))} placeholder={`Min. ${defaultPolicy.min_length} caract\u00e8res`} required style={sInput} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Confirmer *</label>
                  <input type="password" value={regData.password_confirmation} onChange={e => setRegData(p => ({ ...p, password_confirmation: e.target.value }))} placeholder="R\u00e9p\u00e9ter" required style={sInput} />
                  {regData.password_confirmation && regData.password !== regData.password_confirmation && <div style={{ fontSize: 10, color: C.red, marginTop: 2 }}>Non identiques</div>}
                </div>
              </div>
              {regData.password && renderPwdChecklist(regData.password, defaultPolicy)}
            </div>
            <button type="submit" disabled={regLoading || !regData.company_name || !regData.admin_prenom || !regData.admin_nom || !regData.admin_email || !allPwdRulesMet(regData.password, defaultPolicy) || regData.password !== regData.password_confirmation}
              className="iz-btn-pink" style={{ ...sBtn("pink"), width: "100%", padding: "12px 0", fontSize: 15, opacity: regLoading ? 0.6 : 1 }}>
              {regLoading ? "Création en cours..." : "Créer mon espace Illizeo"}
            </button>
            <div style={{ textAlign: "center", marginTop: 16, fontSize: 13 }}>
              <span style={{ color: C.textMuted }}>Déjà un compte ? </span>
              <button type="button" onClick={() => setShowRegister(false)} style={{ background: "none", border: "none", color: C.pink, fontWeight: 600, cursor: "pointer", fontFamily: font, fontSize: 13 }}>Se connecter</button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const renderLogin = () => {
    const loginBg = loginBgImage
      ? `url(${loginBgImage}) center/cover no-repeat`
      : `linear-gradient(135deg, ${loginGradientStart || C.dark} 0%, ${loginGradientEnd || C.pink} 100%)`;
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: font, background: loginBg }}>
        <style dangerouslySetInnerHTML={{ __html: ANIM_STYLES }} />
        <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;1,9..40,400&display=swap" rel="stylesheet" />
        <div className="iz-scale-in" style={{ width: 400, background: C.white, borderRadius: 16, padding: "40px 40px 36px", boxShadow: "0 20px 60px rgba(0,0,0,.3)" }}>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{ marginBottom: 8 }}><img src={getLogoFullUri()} alt="Illizeo" style={{ height: 48, objectFit: "contain", display: "block", margin: "0 auto" }} /></div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: C.dark, margin: 0 }}>{t('login.title')}</h1>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 6 }}>
              <span style={{ fontSize: 12, color: C.textMuted }}>{t('login.space')}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: C.pink }}>{localStorage.getItem("illizeo_tenant_id") || "illizeo"}</span>
              <button onClick={() => { localStorage.removeItem("illizeo_tenant_id"); window.history.replaceState({}, "", "/"); setTenantResolved(false); }} style={{ background: "none", border: "none", color: C.textMuted, fontSize: 11, cursor: "pointer", fontFamily: font, textDecoration: "underline" }}>{t('login.change')}</button>
            </div>
          </div>
          {auth.error && (
            <div className="iz-fade-up" style={{ padding: "10px 14px", borderRadius: 8, background: C.redLight, color: C.red, fontSize: 13, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
              <AlertTriangle size={14} /> {auth.error}
            </div>
          )}
          <form onSubmit={async (e) => {
            e.preventDefault();
            setLoginLoading(true);
            try {
              await auth.login(loginEmail, loginPassword);
              // Ensure tenant ID is saved for logout redirect
              const currentTid = new URLSearchParams(window.location.search).get("tenant") || localStorage.getItem("illizeo_tenant_id");
              if (currentTid) localStorage.setItem("illizeo_tenant_id", currentTid);
            } catch {} finally { setLoginLoading(false); }
          }}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Email</label>
              <input type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} placeholder="votre@email.com" required
                style={{ ...sInput, background: C.bg }} />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Mot de passe</label>
              <input type="password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} placeholder="••••••••" required
                style={{ ...sInput, background: C.bg }} />
            </div>
            <button type="submit" disabled={loginLoading} className="iz-btn-pink"
              style={{ ...sBtn("pink"), width: "100%", padding: "12px 0", fontSize: 15, opacity: loginLoading ? 0.7 : 1 }}>
              {loginLoading ? "Connexion..." : "Se connecter"}
            </button>
          </form>
          {/* SSO Microsoft */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "16px 0" }}>
            <div style={{ flex: 1, height: 1, background: C.border }} />
            <span style={{ fontSize: 11, color: C.textMuted }}>{t('login.or')}</span>
            <div style={{ flex: 1, height: 1, background: C.border }} />
          </div>
          <button onClick={async () => {
            try {
              addToast_admin("Redirection vers Microsoft...");
              const res = await apiFetch<{ redirect_url: string }>('/auth/microsoft/redirect');
              if (res.redirect_url) {
                window.location.href = res.redirect_url;
              } else {
                addToast_admin("SSO non configuré");
              }
            } catch (err: any) {
              console.error("SSO error:", err);
              addToast_admin("Erreur SSO : " + (err?.message || "connexion impossible"));
              setLoginLoading(false);
            }
          }} style={{ width: "100%", padding: "11px 0", borderRadius: 8, border: `1px solid ${C.border}`, background: C.white, cursor: "pointer", fontFamily: font, fontSize: 14, fontWeight: 500, color: C.text, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, transition: "all .15s" }}
            onMouseEnter={e => (e.currentTarget.style.background = C.bg)} onMouseLeave={e => (e.currentTarget.style.background = C.white)}>
            <Globe size={18} color="#0078D4" /> {t('login.sso_microsoft')}
          </button>
          <div style={{ textAlign: "center", marginTop: 12 }}>
            <button onClick={() => { setForgotMode(true); setForgotEmail(loginEmail); setForgotSent(false); }} style={{ background: "none", border: "none", color: C.pink, fontSize: 13, cursor: "pointer", fontFamily: font, fontWeight: 500 }}>Mot de passe oublié ?</button>
          </div>
          {forgotMode && (
            <div style={{ marginTop: 16, padding: "16px", background: C.bg, borderRadius: 10 }}>
              {forgotSent ? (
                <div style={{ textAlign: "center" }}>
                  <CheckCircle size={24} color={C.green} style={{ marginBottom: 8 }} />
                  <div style={{ fontSize: 14, fontWeight: 600, color: C.green, marginBottom: 4 }}>Email envoyé !</div>
                  <div style={{ fontSize: 12, color: C.textLight }}>Vérifiez votre boîte de réception pour réinitialiser votre mot de passe.</div>
                  <button onClick={() => setForgotMode(false)} style={{ ...sBtn("outline"), fontSize: 12, padding: "6px 16px", marginTop: 12 }}>Retour à la connexion</button>
                </div>
              ) : (
                <>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 8 }}>Réinitialiser le mot de passe</div>
                  <div style={{ fontSize: 12, color: C.textLight, marginBottom: 12 }}>Entrez votre email, vous recevrez un lien de réinitialisation.</div>
                  <input type="email" value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} placeholder="votre@email.com" style={{ ...sInput, marginBottom: 10 }} />
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => setForgotMode(false)} style={{ ...sBtn("outline"), fontSize: 12, flex: 1 }}>{t('common.cancel')}</button>
                    <button disabled={forgotLoading || !forgotEmail.trim()} onClick={async () => {
                      setForgotLoading(true);
                      try {
                        await apiFetch('/forgot-password', { method: 'POST', body: JSON.stringify({ email: forgotEmail }) });
                        setForgotSent(true);
                      } catch { setForgotSent(true); /* Don't reveal if email exists */ }
                      finally { setForgotLoading(false); }
                    }} className="iz-btn-pink" style={{ ...sBtn("pink"), fontSize: 12, flex: 1, opacity: forgotLoading ? 0.6 : 1 }}>
                      {forgotLoading ? "Envoi..." : "Envoyer"}
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
          <div style={{ textAlign: "center", marginTop: 20, fontSize: 13 }}>
            <span style={{ color: C.textMuted }}>{t('login.no_account')} </span>
            <button onClick={() => setShowRegister(true)} style={{ background: "none", border: "none", color: C.pink, fontWeight: 600, cursor: "pointer", fontFamily: font, fontSize: 13 }}>{t('login.create_space')}</button>
          </div>
        </div>
      </div>
    );
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
