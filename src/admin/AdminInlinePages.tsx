import { useState, useEffect, useRef, useCallback, useMemo, Fragment } from "react";
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
  getCompanySettings, updateCompanySettings, purgeDemoCollaborateurs,
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
  getRoles, createRole as apiCreateRole, updateRole as apiUpdateRole, deleteRole as apiDeleteRole, assignRoleUser, removeRoleUser, duplicateRole as apiDuplicateRole, getEffectivePermissions,
  type ApiRole,
} from "../api/endpoints";
import { apiFetch } from "../api/client";
import { createAdminRoles } from './pages/AdminRoles';
import { createAdminCalendar } from './pages/AdminCalendar';
import { createAdminOrgChart } from './pages/AdminOrgChart';
import { createAdminBuddy } from './pages/AdminBuddy';
import { createAdminAuditLog } from './pages/AdminAuditLog';


/**
 * Factory: inline admin page render functions.
 */
export function createAdminInlinePages(ctx: any) {
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
    lang, setLangState, darkMode, setDarkMode, demoMode, setDemoMode, activeLanguages, setActiveLanguages, contentTranslations, setContentTranslations,
    fieldConfig, setFieldConfig, translateFieldId, setTranslateFieldId, translateEN, setTranslateEN, adminUsers, setAdminUsers,
    adminRoles, setAdminRoles, rolePanelMode, setRolePanelMode, rolePanelData, setRolePanelData,
    roleTab, setRoleTab, selectedRoleId, setSelectedRoleId, permMatrixFilter, setPermMatrixFilter,
    securitySubTab, setSecuritySubTab, pwdPolicy, setPwdPolicy,
    calendarMonth, setCalendarMonth, calendarView, setCalendarView, calendarListFilter, setCalendarListFilter,
    orgView, setOrgView, orgSearch, setOrgSearch, auditFilter, setAuditFilter, auditSearch, setAuditSearch, buddyPairs, setBuddyPairs, selectedBuddyPair, setSelectedBuddyPair,
    orgExpandedNodes, setOrgExpandedNodes, orgSortCol, setOrgSortCol, orgSortDir, setOrgSortDir,
    buddyTab, setBuddyTab, buddyNoteInput, setBuddyNoteInput, buddyFeedbackRating, setBuddyFeedbackRating, buddyFeedbackComment, setBuddyFeedbackComment,
    auditExpandedEntry, setAuditExpandedEntry, auditVisibleCount, setAuditVisibleCount,
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
    handleBannerFileUpload, handleSendMessage, renderActionCard, renderCompanyBlock, renderMessagerie, SIDEBAR_ITEMS, markSetupStepDone, finishSetupWizard,
    saveSetting, SETUP_STEPS,
  } = ctx;

  const renderAdminGamification = () => {
          const reloadGamif = () => { getBadges().then(setBadges).catch(() => {}); getBadgeTemplates().then(setBadgeTemplates).catch(() => {}); };
          const BADGE_ICON_MAP: Record<string, any> = {
            "trophy": Trophy, "file-check": FileCheck2, "message-circle": MessageCircle, "calendar-check": CalendarCheck,
            "star": Star, "handshake": Handshake, "smile": Smile, "party-popper": PartyPopper,
            "award": Award, "heart": Heart, "rocket": Rocket, "gem": Gem, "crown": Crown, "target": Target, "zap": Zap, "gift": Gift,
          };
          const getBadgeIcon = (iconName: string) => BADGE_ICON_MAP[iconName] || Trophy;
          const BADGE_CRITERE_META: Record<string, { label: string; description: string }> = {
            "manual": { label: t('badge.crit_manual'), description: t('badge.crit_manual_desc') },
            "parcours_complete": { label: t('badge.crit_parcours'), description: t('badge.crit_parcours_desc') },
            "docs_complete": { label: t('badge.crit_docs'), description: t('badge.crit_docs_desc') },
            "premier_message": { label: t('badge.crit_message'), description: t('badge.crit_message_desc') },
            "first_week": { label: t('badge.crit_week'), description: t('badge.crit_week_desc') },
            "first_month": { label: t('badge.crit_month'), description: t('badge.crit_month_desc') },
            "cooptation": { label: t('badge.crit_coopt'), description: t('badge.crit_coopt_desc') },
            "nps_complete": { label: t('badge.crit_nps'), description: t('badge.crit_nps_desc') },
          };
          const BADGE_COLORS = ["#F9A825", "#C2185B", "#4CAF50", "#1A73E8", "#7B5EA7", "#E91E8C", "#00897B", "#FF6B35", "#E53935", "#FF9800"];
          const BADGE_ICONS = Object.keys(BADGE_ICON_MAP);
          return (
          <div style={{ flex: 1, padding: "24px 32px", overflow: "auto" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <div>
                <h1 style={{ fontSize: 22, fontWeight: 600, margin: 0 }}>{t('admin.gamification')}</h1>
                <p style={{ fontSize: 12, color: C.textLight, margin: "4px 0 0" }}>{t('badge.desc')}</p>
              </div>
              <button onClick={() => { resetTr(); setBadgeTplPanel({ mode: "create", data: { nom: "", description: "", icon: "trophy", color: "#F9A825", critere: "manual", actif: true } }); }} className="iz-btn-pink" style={{ ...sBtn("pink"), display: "flex", alignItems: "center", gap: 6 }}><Plus size={14} /> {t('badge.new')}</button>
            </div>

            {/* How it works */}
            <div style={{ padding: "16px 20px", background: C.blueLight, borderRadius: 10, marginBottom: 20, fontSize: 12, color: C.blue, lineHeight: 1.7 }}>
              <div style={{ fontWeight: 700, marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}><Sparkles size={14} /> {t('badge.how_title')}</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                <div><strong>{t('badge.step1')}</strong> — {t('badge.step1_desc')}</div>
                <div dangerouslySetInnerHTML={{ __html: `<strong>${t('badge.step2')}</strong> — ${t('badge.step2_desc')}` }} />
                <div><strong>{t('badge.step3')}</strong> — {t('badge.step3_desc')}</div>
              </div>
            </div>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
              <div className="iz-card" style={{ ...sCard, textAlign: "center", padding: "16px" }}>
                <Trophy size={24} color={C.amber} style={{ marginBottom: 6 }} />
                <div style={{ fontSize: 24, fontWeight: 700, color: C.amber }}>{badges.length}</div>
                <div style={{ fontSize: 11, color: C.textMuted }}>{t('badge.awarded')}</div>
              </div>
              <div className="iz-card" style={{ ...sCard, textAlign: "center", padding: "16px" }}>
                <Users size={24} color={C.blue} style={{ marginBottom: 6 }} />
                <div style={{ fontSize: 24, fontWeight: 700, color: C.blue }}>{new Set(badges.map(b => b.user_id)).size}</div>
                <div style={{ fontSize: 11, color: C.textMuted }}>{t('badge.rewarded_users')}</div>
              </div>
              <div className="iz-card" style={{ ...sCard, textAlign: "center", padding: "16px" }}>
                <Award size={24} color={C.green} style={{ marginBottom: 6 }} />
                <div style={{ fontSize: 24, fontWeight: 700, color: C.green }}>{badgeTemplates.filter(bt => bt.actif).length}</div>
                <div style={{ fontSize: 11, color: C.textMuted }}>{t('badge.active_templates')}</div>
              </div>
              <div className="iz-card" style={{ ...sCard, textAlign: "center", padding: "16px" }}>
                <Zap size={24} color="#7B5EA7" style={{ marginBottom: 6 }} />
                <div style={{ fontSize: 24, fontWeight: 700, color: "#7B5EA7" }}>{badgeTemplates.filter(bt => bt.critere !== "manual").length}</div>
                <div style={{ fontSize: 11, color: C.textMuted }}>{t('badge.auto_awards')}</div>
              </div>
            </div>

            {/* Badge templates */}
            <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>{t('badge.templates')}</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
              {badgeTemplates.map(bt => {
                const IconComp = getBadgeIcon(bt.icon);
                const critMeta = BADGE_CRITERE_META[bt.critere || "manual"] || BADGE_CRITERE_META.manual;
                return (
                <div key={bt.id} className="iz-card iz-sidebar-item" style={{ ...sCard, textAlign: "center", padding: "20px 16px", opacity: bt.actif ? 1 : 0.45, cursor: "pointer", transition: "all .15s" }}
                  onClick={() => { setContentTranslations((bt as any).translations || {}); setBadgeTplPanel({ mode: "edit", data: { ...bt } }); }}>
                  <div style={{ width: 52, height: 52, borderRadius: "50%", background: bt.color + "20", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px", border: `2px solid ${bt.color}40` }}>
                    <IconComp size={24} color={bt.color} />
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{bt.nom}</div>
                  <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 6, minHeight: 30, lineHeight: 1.4 }}>{bt.description || t('badge.no_desc')}</div>
                  <span style={{ display: "inline-block", padding: "2px 8px", borderRadius: 4, fontSize: 9, fontWeight: 600, background: bt.critere === "manual" ? C.bg : C.blueLight, color: bt.critere === "manual" ? C.textMuted : C.blue }}>{critMeta.label}</span>
                  {bt.earned_count !== undefined && bt.earned_count > 0 && (
                    <div style={{ fontSize: 10, color: C.textMuted, marginTop: 6 }}>{bt.earned_count} {t('badge.x_awarded')}{bt.earned_count > 1 ? "s" : ""}</div>
                  )}
                  {!bt.actif && <div style={{ fontSize: 9, color: C.red, marginTop: 4, fontWeight: 600 }}>{t('badge.disabled')}</div>}
                </div>
                );
              })}
              {badgeTemplates.length === 0 && <div style={{ gridColumn: "1/-1", padding: "40px 20px", textAlign: "center", color: C.textMuted, fontSize: 13 }}>{t('badge.no_templates')}</div>}
            </div>

            {/* Award badge manually */}
            <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>{t('badge.award_manually')}</h2>
            <p style={{ fontSize: 12, color: C.textLight, marginBottom: 12 }}>{t('badge.award_desc')}</p>
            <div className="iz-card" style={{ ...sCard, padding: "16px 20px", display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
              <select id="award-user" style={{ ...sInput, flex: 1 }}><option value="">{t('badge.choose_user')}</option>{adminUsers.map((u: any) => <option key={u.id} value={u.id}>{u.name} ({u.email})</option>)}</select>
              <select id="award-badge" style={{ ...sInput, flex: 1 }}><option value="">{t('badge.choose_badge')}</option>{badgeTemplates.filter(bt => bt.actif).map(bt => <option key={bt.id} value={bt.id}>{bt.nom}</option>)}</select>
              <button onClick={async () => {
                const uid = (document.getElementById("award-user") as HTMLSelectElement)?.value;
                const bid = (document.getElementById("award-badge") as HTMLSelectElement)?.value;
                if (!uid || !bid) { addToast_admin("Sélectionnez un collaborateur et un badge"); return; }
                try { await awardBadge(Number(uid), { badge_template_id: Number(bid) }); reloadGamif(); addToast_admin("Badge attribué !"); } catch { addToast_admin(t('toast.error')); }
              }} className="iz-btn-pink" style={{ ...sBtn("pink"), fontSize: 12, whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 6 }}><Award size={14} /> {t('badge.award')}</button>
            </div>

            {/* Recent badges */}
            <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>{t('badge.recent')}</h2>
            <div className="iz-card" style={{ ...sCard, overflow: "hidden", padding: 0 }}>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1.5fr 1fr 1fr 0.5fr", gap: 0, padding: "10px 16px", background: C.bg, borderBottom: `1px solid ${C.border}`, fontSize: 11, fontWeight: 600, color: C.textLight, textTransform: "uppercase" }}>
                <span>{t('nps.collaborator')}</span><span>Badge</span><span>{t('badge.source')}</span><span>{t('nps.date')}</span><span></span>
              </div>
              {badges.slice(0, 20).map(b => {
                const collab = COLLABORATEURS.find(c => c.id === b.collaborateur_id);
                const user = adminUsers.find((u: any) => u.id === b.user_id);
                const IconComp = getBadgeIcon(b.icon);
                return (
                  <div key={b.id} style={{ display: "grid", gridTemplateColumns: "2fr 1.5fr 1fr 1fr 0.5fr", gap: 0, padding: "12px 16px", borderBottom: `1px solid ${C.border}`, alignItems: "center", fontSize: 13 }} className="iz-sidebar-item">
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      {collab ? <div style={{ width: 30, height: 30, borderRadius: "50%", background: collab.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 600, color: C.white }}>{collab.initials}</div>
                        : <div style={{ width: 30, height: 30, borderRadius: "50%", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center" }}><Users size={12} color={C.textMuted} /></div>}
                      <span style={{ fontWeight: 500 }}>{collab ? `${collab.prenom} ${collab.nom}` : user ? user.name : `User #${b.user_id}`}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 24, height: 24, borderRadius: "50%", background: b.color + "20", display: "flex", alignItems: "center", justifyContent: "center" }}><IconComp size={12} color={b.color} /></div>
                      <span>{b.nom}</span>
                    </div>
                    <div style={{ fontSize: 11, color: C.textMuted }}>{b.description?.includes("workflow") ? "Workflow" : b.description?.includes("auto") ? "Auto" : "Manuel"}</div>
                    <div style={{ fontSize: 11, color: C.textMuted }}>{fmtDate(b.earned_at)}</div>
                    <div>
                      <button onClick={() => showConfirm(`Révoquer le badge "${b.nom}" ?`, async () => { try { await revokeBadge(b.id); reloadGamif(); addToast_admin("Badge révoqué"); } catch { addToast_admin(t('toast.error')); } })} title="Révoquer" style={{ background: C.redLight, border: "none", borderRadius: 6, padding: 4, cursor: "pointer" }}><Ban size={12} color={C.red} /></button>
                    </div>
                  </div>
                );
              })}
              {badges.length === 0 && <div style={{ padding: "30px 20px", textAlign: "center", color: C.textMuted, fontSize: 13 }}>{t('badge.no_badges')}</div>}
            </div>

            {/* Badge Template Create/Edit Panel */}
            {badgeTplPanel.mode !== "closed" && (<>
              <div onClick={() => setBadgeTplPanel({ mode: "closed", data: {} })} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.3)", zIndex: 1000 }} />
              <div className="iz-panel" style={{ position: "fixed", top: 0, right: 0, width: 480, height: "100vh", background: C.white, boxShadow: "-4px 0 24px rgba(0,0,0,.1)", zIndex: 1001, display: "flex", flexDirection: "column" }}>
                <div style={{ padding: "20px 24px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>{badgeTplPanel.mode === "create" ? t('badge.new_template') : t('badge.edit')}</h2>
                  <button onClick={() => setBadgeTplPanel({ mode: "closed", data: {} })} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}><X size={18} /></button>
                </div>
                <div style={{ flex: 1, padding: 24, overflow: "auto", display: "flex", flexDirection: "column", gap: 16 }}>
                  {/* Preview */}
                  <div style={{ textAlign: "center", padding: "20px 0", borderBottom: `1px solid ${C.border}` }}>
                    <div style={{ width: 72, height: 72, borderRadius: "50%", background: (badgeTplPanel.data.color || "#F9A825") + "20", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px", border: `3px solid ${(badgeTplPanel.data.color || "#F9A825")}40` }}>
                      {(() => { const IC = getBadgeIcon(badgeTplPanel.data.icon || "trophy"); return <IC size={32} color={badgeTplPanel.data.color || "#F9A825"} />; })()}
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 600, color: C.text }}>{badgeTplPanel.data.nom || t('badge.name')}</div>
                    <div style={{ fontSize: 12, color: C.textMuted }}>{badgeTplPanel.data.description || t('badge.no_desc')}</div>
                  </div>

                  <div><label style={{ fontSize: 11, color: C.textLight, display: "block", marginBottom: 4 }}>{t('badge.name')} *</label>
                    <TranslatableField value={badgeTplPanel.data.nom || ""} onChange={v => setBadgeTplPanel(p => ({ ...p, data: { ...p.data, nom: v } }))} currentLang={lang} activeLangs={activeLanguages} translations={contentTranslations.nom} onTranslationsChange={tr => setTr("nom", tr)} style={sInput} placeholder="Ex: Super Coopteur" />
                  </div>
                  <div><label style={{ fontSize: 11, color: C.textLight, display: "block", marginBottom: 4 }}>Description</label>
                    <TranslatableField multiline rows={3} value={badgeTplPanel.data.description || ""} onChange={v => setBadgeTplPanel(p => ({ ...p, data: { ...p.data, description: v } }))} currentLang={lang} activeLangs={activeLanguages} translations={contentTranslations.description} onTranslationsChange={tr => setTr("description", tr)} style={{ ...sInput, minHeight: 60, resize: "vertical" }} placeholder="Ex: Attribué quand un collaborateur termine son parcours" />
                  </div>

                  {/* Icon picker */}
                  <div><label style={{ fontSize: 11, color: C.textLight, display: "block", marginBottom: 4 }}>Icône</label>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {BADGE_ICONS.map(icon => {
                        const IC = BADGE_ICON_MAP[icon];
                        const sel = badgeTplPanel.data.icon === icon;
                        return <button key={icon} type="button" onClick={() => setBadgeTplPanel(p => ({ ...p, data: { ...p.data, icon } }))}
                          style={{ width: 36, height: 36, borderRadius: 8, border: sel ? `2px solid ${C.pink}` : `1px solid ${C.border}`, background: sel ? C.pinkBg : C.white, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all .1s" }}
                          title={icon}><IC size={16} color={sel ? C.pink : C.textMuted} /></button>;
                      })}
                    </div>
                  </div>

                  {/* Color picker */}
                  <div><label style={{ fontSize: 11, color: C.textLight, display: "block", marginBottom: 4 }}>Couleur</label>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {BADGE_COLORS.map(color => (
                        <button key={color} type="button" onClick={() => setBadgeTplPanel(p => ({ ...p, data: { ...p.data, color } }))}
                          style={{ width: 32, height: 32, borderRadius: "50%", background: color, border: badgeTplPanel.data.color === color ? `3px solid ${C.text}` : "3px solid transparent", cursor: "pointer", transition: "all .1s" }} />
                      ))}
                    </div>
                  </div>

                  {/* Critere */}
                  <div><label style={{ fontSize: 11, color: C.textLight, display: "block", marginBottom: 4 }}>Critère d'attribution</label>
                    <select value={badgeTplPanel.data.critere || "manual"} onChange={e => setBadgeTplPanel(p => ({ ...p, data: { ...p.data, critere: e.target.value } }))} style={sInput}>
                      {Object.entries(BADGE_CRITERE_META).map(([key, meta]) => (
                        <option key={key} value={key}>{meta.label}</option>
                      ))}
                    </select>
                    <div style={{ fontSize: 11, color: C.textMuted, marginTop: 4, lineHeight: 1.5 }}>{BADGE_CRITERE_META[badgeTplPanel.data.critere || "manual"]?.description}</div>
                  </div>

                  {/* Actif toggle */}
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div onClick={() => setBadgeTplPanel(p => ({ ...p, data: { ...p.data, actif: !p.data.actif } }))} style={{ width: 40, height: 22, borderRadius: 11, background: badgeTplPanel.data.actif ? C.green : C.border, cursor: "pointer", position: "relative", transition: "all .2s", flexShrink: 0 }}>
                      <div style={{ width: 18, height: 18, borderRadius: "50%", background: C.white, position: "absolute", top: 2, left: badgeTplPanel.data.actif ? 20 : 2, transition: "all .2s", boxShadow: "0 1px 3px rgba(0,0,0,.2)" }} />
                    </div>
                    <span style={{ fontSize: 12, color: C.text }}>{badgeTplPanel.data.actif ? "Actif" : "Désactivé"}</span>
                  </div>
                </div>
                <div style={{ padding: "16px 24px", borderTop: `1px solid ${C.border}`, display: "flex", gap: 8, justifyContent: "flex-end" }}>
                  {badgeTplPanel.mode === "edit" && badgeTplPanel.data.id && (
                    <button onClick={() => showConfirm(`Supprimer le badge "${badgeTplPanel.data.nom}" ?`, async () => {
                      try { await apiDeleteBadgeTpl(badgeTplPanel.data.id); reloadGamif(); setBadgeTplPanel({ mode: "closed", data: {} }); addToast_admin("Badge supprimé"); } catch { addToast_admin(t('toast.error')); }
                    })} style={{ ...sBtn("outline"), color: C.red, borderColor: C.red, marginRight: "auto" }}>{t('common.delete')}</button>
                  )}
                  <button onClick={() => setBadgeTplPanel({ mode: "closed", data: {} })} className="iz-btn-outline" style={sBtn("outline")}>{t('common.cancel')}</button>
                  <button onClick={async () => {
                    if (!badgeTplPanel.data.nom?.trim()) { addToast_admin("Le nom est requis"); return; }
                    try {
                      const payload = { nom: badgeTplPanel.data.nom, description: badgeTplPanel.data.description || "", icon: badgeTplPanel.data.icon || "trophy", color: badgeTplPanel.data.color || "#F9A825", critere: badgeTplPanel.data.critere || "manual", actif: badgeTplPanel.data.actif !== false, translations: buildTranslationsPayload() };
                      if (badgeTplPanel.mode === "edit" && badgeTplPanel.data.id) await apiUpdateBadgeTpl(badgeTplPanel.data.id, payload);
                      else await apiCreateBadgeTpl(payload);
                      reloadGamif(); setBadgeTplPanel({ mode: "closed", data: {} }); addToast_admin(badgeTplPanel.mode === "create" ? "Badge créé" : "Badge modifié");
                    } catch { addToast_admin(t('toast.error')); }
                  }} className="iz-btn-pink" style={sBtn("pink")}>{badgeTplPanel.mode === "create" ? t('common.create') : t('common.save')}</button>
                </div>
              </div>
            </>)}
          </div>
          );
  };

  const renderAdminUsers = () => {
          // Build ROLE_META from API roles (adminRoles) with fallback to hardcoded
          const ROLE_META: Record<string, { label: string; color: string; bg: string }> = adminRoles.length > 0
            ? Object.fromEntries(adminRoles.filter((r: any) => r.actif).map((r: any) => [r.slug, { label: r.nom, color: r.couleur, bg: r.couleur + "15" }]))
            : {
              super_admin: { label: t('role.super_admin'), color: "#E53935", bg: C.redLight },
              admin: { label: t('role.admin'), color: "#7B5EA7", bg: C.purple + "15" },
              admin_rh: { label: t('role.admin_rh'), color: "#C2185B", bg: C.pinkBg },
              manager: { label: t('role.manager'), color: "#1A73E8", bg: C.blueLight },
              onboardee: { label: t('role.onboardee'), color: "#4CAF50", bg: C.greenLight },
            };
          const filteredUsers = adminUsers
            .filter(u => userRoleFilter === "all" || u.role === userRoleFilter)
            .filter(u => !userSearch || `${u.name} ${u.email}`.toLowerCase().includes(userSearch.toLowerCase()));
          return (
          <div style={{ flex: 1, padding: "24px 32px", overflow: "auto" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
              <h1 style={{ fontSize: 22, fontWeight: 600, margin: 0 }}>{t('users.title')}</h1>
            </div>

            {/* Search bar + invite button */}
            <div className="iz-card" style={{ ...sCard, display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", marginBottom: 16 }}>
              <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, background: C.bg, borderRadius: 8, padding: "8px 12px" }}>
                <Search size={16} color={C.textLight} />
                <input value={userSearch} onChange={e => setUserSearch(e.target.value)} placeholder={t('users.search_placeholder')} style={{ border: "none", outline: "none", background: "transparent", flex: 1, fontSize: 13, fontFamily: font, color: C.text }} />
              </div>
              <button onClick={() => { setUserPanelData({ name: "", email: "", password: "", role: "onboardee" }); setUserPanelMode("create"); }} className="iz-btn-pink" style={{ ...sBtn("pink"), display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}><UserPlus size={14} /> {t('suivi.invite_people')}</button>
            </div>

            {/* Role filter tiles */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
              {[
                { key: "all", label: t('users.all'), count: adminUsers.length, color: C.pink, bg: C.pinkBg },
                ...Object.entries(ROLE_META).map(([role, meta]) => ({ key: role, label: meta.label, count: adminUsers.filter(u => u.role === role).length, color: meta.color, bg: meta.bg })),
              ].map(tile => {
                const active = userRoleFilter === tile.key;
                return (
                  <button key={tile.key} onClick={() => setUserRoleFilter(tile.key)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 10, border: `1.5px solid ${active ? tile.color : C.border}`, background: active ? tile.bg : C.white, cursor: "pointer", fontFamily: font, fontSize: 12, fontWeight: active ? 600 : 500, color: active ? tile.color : C.textLight, transition: "all .2s" }}
                  onMouseEnter={e => { if (!active) { e.currentTarget.style.borderColor = tile.color; e.currentTarget.style.color = tile.color; } }}
                  onMouseLeave={e => { if (!active) { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textLight; } }}>
                    {tile.label} <span style={{ fontSize: 10, padding: "1px 6px", borderRadius: 8, background: active ? tile.color + "20" : C.bg, color: active ? tile.color : C.textMuted, fontWeight: 600 }}>{tile.count}</span>
                  </button>
                );
              })}
            </div>

            {/* Table header */}
            <div style={{ display: "grid", gridTemplateColumns: "2.5fr 1.8fr 1.2fr 1fr 1fr 40px", gap: 0, padding: "10px 16px", borderBottom: `1px solid ${C.border}`, fontSize: 11, fontWeight: 600, color: C.textLight, textTransform: "uppercase", letterSpacing: .3 }}>
              <span>{t('users.col_name')}</span><span>{t('users.col_email')}</span><span>{t('users.col_role')}</span><span>{t('users.col_last_activity')}</span><span>{t('users.col_invited_by')}</span><span></span>
            </div>

            {/* Invite row */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", borderBottom: `1px solid ${C.border}`, cursor: "pointer" }}
              onClick={() => { setUserPanelData({ name: "", email: "", password: "", role: "onboardee" }); setUserPanelMode("create"); }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", border: `2px dashed ${C.pink}`, display: "flex", alignItems: "center", justifyContent: "center" }}><Plus size={14} color={C.pink} /></div>
              <span style={{ fontSize: 13, color: C.pink, fontWeight: 500 }}>{t('suivi.invite_people')}</span>
            </div>

            {/* User rows */}
            {filteredUsers.map(u => {
              const rm = ROLE_META[u.role] || ROLE_META.collaborateur || ROLE_META.onboardee || { label: u.role || "—", color: "#78909C", bg: "#78909C15" };
              const initials = u.name?.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase() || "?";
              const isOwner = u.role === "super_admin";
              return (
              <div key={u.id} style={{ display: "grid", gridTemplateColumns: "2.5fr 1.8fr 1.2fr 1fr 1fr 40px", gap: 0, padding: "14px 16px", borderBottom: `1px solid ${C.border}`, alignItems: "center", cursor: "pointer" }}
                className="iz-sidebar-item" onClick={() => { setUserPanelData({ id: u.id, name: u.name, email: u.email, password: "", role: u.role, roles: u.roles || [u.role] }); setUserPanelMode("edit"); }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ position: "relative", flexShrink: 0 }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: rm.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600, color: C.white }}>{initials}</div>
                    <div style={{ position: "absolute", bottom: -1, right: -1, width: 10, height: 10, borderRadius: "50%", background: C.green, border: `2px solid ${C.white}` }} />
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                    <span style={{ fontWeight: 500, fontSize: 14, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.name}</span>
                    {isOwner && <span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 600, background: rm.bg, color: rm.color, flexShrink: 0 }}>{t('users.owner')}</span>}
                  </div>
                </div>
                <div style={{ fontSize: 13, color: C.textLight, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.email}</div>
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                  {(u.roles || [u.role]).map((r: string) => { const m = ROLE_META[r]; return m ? <span key={r} style={{ padding: "2px 6px", borderRadius: 4, fontSize: 9, fontWeight: 600, background: m.bg, color: m.color }}>{m.label}</span> : null; })}
                </div>
                <div style={{ fontSize: 12, color: C.textMuted }}>{fmtDateShort(u.updated_at || u.created_at)}</div>
                <div style={{ fontSize: 12, color: C.textMuted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{/* invited by — not tracked yet */}—</div>
                <button onClick={e => { e.stopPropagation(); setUserPanelData({ id: u.id, name: u.name, email: u.email, password: "", role: u.role, roles: u.roles || [u.role] }); setUserPanelMode("edit"); }} style={{ background: "none", border: "none", cursor: "pointer", color: C.textMuted, padding: 4, display: "flex", alignItems: "center" }}><MoreHorizontal size={16} /></button>
              </div>
              );
            })}
            {filteredUsers.length === 0 && <div style={{ padding: "40px 20px", textAlign: "center", color: C.textMuted, fontSize: 13 }}>{t('users.none_found')}</div>}
            {/* Panel create/edit */}
            {userPanelMode !== "closed" && (
              <>
                <div onClick={() => setUserPanelMode("closed")} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.3)", zIndex: 1000 }} />
                <div className="iz-panel" style={{ position: "fixed", top: 0, right: 0, width: 480, height: "100vh", background: C.white, boxShadow: "-4px 0 24px rgba(0,0,0,.1)", zIndex: 1001, display: "flex", flexDirection: "column" }}>
                  <div style={{ padding: "24px 28px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>{userPanelMode === "create" ? t('users.new') : t('users.edit')}</h2>
                    <button onClick={() => setUserPanelMode("closed")} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={22} color={C.textLight} /></button>
                  </div>
                  <div style={{ flex: 1, padding: "24px 28px", overflow: "auto" }}>
                    <div style={{ marginBottom: 20 }}>
                      <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>{t('users.full_name')} *</label>
                      <input value={userPanelData.name} onChange={e => setUserPanelData(prev => ({ ...prev, name: e.target.value }))} placeholder="Prénom Nom" style={sInput} />
                    </div>
                    <div style={{ marginBottom: 20 }}>
                      <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Email *</label>
                      <input type="email" value={userPanelData.email} onChange={e => setUserPanelData(prev => ({ ...prev, email: e.target.value }))} placeholder="email@entreprise.com" style={sInput} />
                    </div>
                    <div style={{ marginBottom: 20 }}>
                      <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>{userPanelMode === "create" ? `${t('users.password')} *` : t('users.password_edit')}</label>
                      <div style={{ display: "flex", gap: 8 }}>
                        <input type="password" value={userPanelData.password} onChange={e => setUserPanelData(prev => ({ ...prev, password: e.target.value }))} placeholder="••••••••" style={{ ...sInput, flex: 1 }} />
                        {userPanelMode === "edit" && (
                          <button onClick={async () => {
                            const tempPwd = Math.random().toString(36).slice(-10);
                            try {
                              await apiFetch(`/users/${userPanelData.id}/reset-password`, { method: "POST", body: JSON.stringify({ password: tempPwd }) });
                              setUserPanelData(prev => ({ ...prev, password: tempPwd }));
                              addToast_admin(`${t('users.temp_pwd')} : ${tempPwd}`);
                            } catch { addToast_admin(t('toast.error')); }
                          }} className="iz-btn-outline" style={{ ...sBtn("outline"), fontSize: 10, padding: "6px 10px", whiteSpace: "nowrap" }}>{t('users.generate_pwd')}</button>
                        )}
                      </div>
                    </div>
                    <div style={{ marginBottom: 20 }}>
                      <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 4 }}>{t('users.role')} *</label>
                      <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 10 }}>{lang === "fr" ? "Sélectionnez un ou plusieurs rôles (cumulatifs)" : "Select one or more roles (cumulative)"}</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {(adminRoles.length > 0 ? adminRoles.filter((r: any) => r.actif) : Object.entries(ROLE_META).map(([slug, meta]) => ({ slug, nom: meta.label, couleur: meta.color, description: "" }))).map((role: any) => {
                          const slug = role.slug;
                          const userRoles: string[] = Array.isArray(userPanelData.roles) ? userPanelData.roles : (userPanelData.role ? [userPanelData.role] : ["collaborateur"]);
                          const active = userRoles.includes(slug);
                          const color = role.couleur || "#78909C";
                          const apiRole = adminRoles.find((r: any) => r.slug === slug);
                          return (
                            <button key={slug} onClick={() => {
                              const current: string[] = Array.isArray(userPanelData.roles) ? userPanelData.roles : (userPanelData.role ? [userPanelData.role] : ["collaborateur"]);
                              const next = active ? current.filter(r => r !== slug) : [...current, slug];
                              if (next.length === 0) next.push("collaborateur");
                              setUserPanelData((prev: any) => ({ ...prev, roles: next, role: next[0] }));
                            }} style={{
                              padding: "12px 14px", borderRadius: 10, border: `2px solid ${active ? color : C.border}`, background: active ? color + "12" : C.white,
                              cursor: "pointer", display: "flex", alignItems: "center", gap: 12, fontFamily: font, textAlign: "left", transition: "all .15s",
                            }}>
                              <div style={{ width: 24, height: 24, borderRadius: 6, border: `2px solid ${active ? color : C.border}`, background: active ? color : C.white, display: "flex", alignItems: "center", justifyContent: "center", transition: "all .15s", flexShrink: 0 }}>
                                {active && <Check size={14} color={C.white} />}
                              </div>
                              <div style={{ flex: 1 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                  <span style={{ fontSize: 13, fontWeight: active ? 600 : 400, color: active ? color : C.text }}>{role.nom}</span>
                                  {apiRole?.is_system && <span style={{ fontSize: 8, padding: "1px 5px", borderRadius: 3, background: color + "20", color, fontWeight: 700, textTransform: "uppercase" }}>{t('roles.system')}</span>}
                                  {apiRole?.is_default && <span style={{ fontSize: 8, padding: "1px 5px", borderRadius: 3, background: C.greenLight, color: C.green, fontWeight: 700 }}>{lang === "fr" ? "Défaut" : "Default"}</span>}
                                </div>
                                {role.description && <div style={{ fontSize: 11, color: C.textMuted }}>{role.description}</div>}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  <div style={{ padding: "16px 28px", borderTop: `1px solid ${C.border}`, display: "flex", gap: 12, justifyContent: "space-between" }}>
                    <div>
                      {userPanelMode === "edit" && (
                        <button onClick={() => {
                          if (!userPanelData.id) return;
                          const id = userPanelData.id;
                          setConfirmDialog({ message: t('users.delete_confirm'), onConfirm: async () => {
                            try { await apiDeleteUser(id); addToast_admin(t('users.deleted')); setUserPanelMode("closed"); getUsers().then(setAdminUsers); } catch { addToast_admin(t('toast.error')); }
                            setConfirmDialog(null);
                          }});
                        }} style={{ ...sBtn("outline"), color: C.red, borderColor: C.red, fontSize: 13 }}>{t('common.delete')}</button>
                      )}
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => setUserPanelMode("closed")} style={{ ...sBtn("outline"), fontSize: 13 }}>{t('common.cancel')}</button>
                      <button disabled={userPanelLoading || !userPanelData.name.trim() || !userPanelData.email.trim() || (userPanelMode === "create" && !userPanelData.password)} onClick={async () => {
                        setUserPanelLoading(true);
                        try {
                          if (userPanelMode === "create") {
                            const roles = Array.isArray(userPanelData.roles) ? userPanelData.roles : [userPanelData.role || "collaborateur"];
                            await apiCreateUser({ name: userPanelData.name, email: userPanelData.email, password: userPanelData.password, role: roles[0], roles });
                            addToast_admin(t('users.created'));
                          } else {
                            const roles = Array.isArray(userPanelData.roles) ? userPanelData.roles : [userPanelData.role || "collaborateur"];
                            const payload: any = { name: userPanelData.name, email: userPanelData.email, role: roles[0], roles };
                            if (userPanelData.password) payload.password = userPanelData.password;
                            await apiUpdateUser(userPanelData.id!, payload);
                            addToast_admin(t('users.updated'));
                          }
                          setUserPanelMode("closed");
                          getUsers().then(setAdminUsers);
                        } catch { addToast_admin(t('toast.error')); }
                        finally { setUserPanelLoading(false); }
                      }} className="iz-btn-pink" style={{ ...sBtn("pink"), fontSize: 13, opacity: userPanelLoading ? 0.6 : 1 }}>
                        {userPanelLoading ? "..." : userPanelMode === "create" ? t('users.create_btn') : t('common.save')}
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
          );
  };

  const renderAdminAbonnement = () => {
          const reloadSub = () => {
            getMySubscription().then(res => { setTenantSubscriptions(res.subscriptions || []); setTenantActiveModules(res.active_modules || []); }).catch(() => {});
            if (plans.length === 0) getAvailablePlans().then(setPlans).catch(() => {});
          };
          if (plans.length === 0) getAvailablePlans().then(setPlans).catch(() => {});
          const activeSubs = tenantSubscriptions.filter(s => s.status === "active" || s.status === "trialing");
          const availablePlans = plans.length > 0 ? plans : saPlans;
          const currentOnboardingSub = activeSubs.filter((s: any) => s.plan?.slug !== "cooptation").sort((a: any, b: any) => (a.canceled_at ? 1 : 0) - (b.canceled_at ? 1 : 0))[0] || null;
          const currentCooptSub = activeSubs.find((s: any) => s.plan?.slug === "cooptation");
          const currentPlan = currentOnboardingSub?.plan;
          const MODULE_LABELS: Record<string, string> = { onboarding: "Onboarding", offboarding: "Offboarding", crossboarding: "Crossboarding", cooptation: "Cooptation", nps: "NPS", signature: "Signature", sso: "SSO", provisioning: "Provisionnement", api: "API", white_label: "White-label", gamification: "Gamification" };
          return (
          <div style={{ flex: 1, padding: "24px 32px", overflow: "auto" }}>
            {/* ═══ HEADER: Current plan ═══ */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, padding: "20px 24px", background: C.white, borderRadius: 12, border: `1px solid ${C.border}` }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                  <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>{currentPlan?.nom || "Aucun plan"}</h1>
                  {currentOnboardingSub && <span style={{ padding: "3px 10px", borderRadius: 6, fontSize: 10, fontWeight: 600, background: C.greenLight, color: C.green }}>Plan {currentOnboardingSub.billing_cycle === "yearly" ? "Annuel" : "Mensuel"}</span>}
                  {!currentOnboardingSub && <span style={{ padding: "3px 10px", borderRadius: 6, fontSize: 10, fontWeight: 600, background: C.amberLight, color: C.amber }}>Aucun abonnement</span>}
                </div>
                <div style={{ fontSize: 13, color: C.textLight }}>{currentPlan?.description || "Choisissez un plan pour activer votre espace"}</div>
                {currentOnboardingSub && <div style={{ fontSize: 12, color: C.textMuted, marginTop: 4 }}>{currentPlan?.prix_chf_mensuel} CHF/emp/mois · {activeSubs.length} abonnement{activeSubs.length > 1 ? "s" : ""} actif{activeSubs.length > 1 ? "s" : ""}</div>}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {currentOnboardingSub && !currentOnboardingSub.canceled_at && (
                  <button onClick={() => {
                    const endDate = currentOnboardingSub.current_period_end;
                    const daysLeft = endDate ? Math.max(0, Math.ceil((new Date(endDate).getTime() - new Date().getTime()) / (24 * 60 * 60 * 1000))) : 0;
                    showConfirm(
                      `Annuler votre plan ${currentPlan?.nom || "Onboarding"} ?\n\nVotre abonnement restera actif pendant encore ${daysLeft} jour${daysLeft > 1 ? "s" : ""} (jusqu'au ${fmtDate(endDate)}).\n\nAprès cette date, l'accès aux fonctionnalités sera bloqué.\n\nVous pourrez réactiver votre abonnement à tout moment.`,
                      async () => {
                        try {
                          const res = await cancelSubscription(currentOnboardingSub.id);
                          reloadSub();
                          addToast_admin(res.message || `Plan annulé — actif jusqu'au ${fmtDate(endDate)}`);
                        } catch { addToast_admin(t('toast.error')); }
                      }
                    );
                  }} className="iz-btn-outline" style={{ ...sBtn("outline"), fontSize: 12 }}>Annuler le plan</button>
                )}
                <button onClick={() => setSubView(subView === "change" ? "overview" : "change")} className="iz-btn-pink" style={{ ...sBtn("pink"), fontSize: 12 }}>{subView === "change" ? "Retour" : (currentOnboardingSub ? "Changer le plan" : "Souscrire maintenant")}</button>
              </div>
            </div>

            {/* ═══ VIEW: Change plan ═══ */}
            {subView === "change" && (() => {
              const onboardingPlans = availablePlans.filter(p => p.slug !== "cooptation").sort((a, b) => a.ordre - b.ordre);
              const cooptationPlan = availablePlans.find(p => p.slug === "cooptation");
              return (
              <div>
                {/* Plan selector + employee count */}
                {/* Trial banner */}
                {isInTrial && !hasActiveSub && (
                  <div style={{ padding: "14px 20px", background: C.blueLight, borderRadius: 10, marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <Sparkles size={18} color={C.blue} />
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: C.blue }}>{t('trial.banner')} — {Math.max(0, 14 - Math.floor((new Date().getTime() - new Date(trialStart!).getTime()) / (24 * 60 * 60 * 1000)))} {t('trial.days_left')}</div>
                        <div style={{ fontSize: 11, color: C.textLight }}>Toutes les fonctionnalités sont accessibles pendant l'essai. Souscrivez avant la fin pour continuer.</div>
                      </div>
                    </div>
                    <button onClick={() => { setSubView("overview"); setAdminPage("admin_dashboard" as any); }} className="iz-btn-outline" style={{ ...sBtn("outline"), fontSize: 12, whiteSpace: "nowrap" }}>Passer et essayer gratuitement</button>
                  </div>
                )}
                {trialExpired && !hasActiveSub && (
                  <div style={{ padding: "14px 20px", background: C.redLight, borderRadius: 10, marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
                    <AlertTriangle size={18} color={C.red} />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: C.red }}>Période d'essai expirée</div>
                      <div style={{ fontSize: 11, color: C.textLight }}>Votre essai gratuit est terminé. Souscrivez un plan pour continuer à utiliser Illizeo.</div>
                    </div>
                  </div>
                )}
                <div style={{ display: "flex", gap: 24, marginBottom: 24 }}>
                  <div style={{ flex: 1 }}>
                    <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4, textAlign: "center" }}>Choisissez l'abonnement idéal pour votre entreprise</h2>
                    <p style={{ fontSize: 13, color: C.textMuted, textAlign: "center", marginBottom: 20 }}>Tous nos abonnements sont modulables. Min. 25 employés.</p>
                    <div style={{ display: "grid", gridTemplateColumns: `repeat(${onboardingPlans.length}, 1fr)`, gap: 16 }}>
                      {onboardingPlans.map(plan => {
                        const isCurrent = currentOnboardingSub?.plan_id === plan.id;
                        const isSelected = selectedPlanIds.includes(plan.id);
                        const monthlyPrice = Number(plan.prix_chf_mensuel);
                        const planModules = (plan.modules || []).filter(m => m.actif).map(m => m.module);
                        return (
                        <div key={plan.id} style={{ border: isCurrent ? `2px solid ${C.green}` : isSelected ? `2px solid ${C.pink}` : `1px solid ${C.border}`, borderRadius: 12, padding: "20px", cursor: "pointer", transition: "all .15s", background: isSelected ? C.pinkBg : C.white }}
                          onClick={() => { if (!isCurrent && plan.slug !== "enterprise") { setSelectedPlanIds(prev => prev.includes(plan.id) ? prev.filter(id => id !== plan.id) : [plan.id]); } }}>
                          {isCurrent && <div style={{ fontSize: 10, fontWeight: 700, color: C.green, marginBottom: 6 }}>PLAN ACTUEL</div>}
                          <h3 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 4px" }}>{plan.nom}</h3>
                          <div style={{ fontSize: 11, color: C.textLight, marginBottom: 10 }}>{plan.description}</div>
                          <div style={{ marginBottom: 8 }}><span style={{ fontSize: 24, fontWeight: 800 }}>CHF {monthlyPrice}</span> <span style={{ fontSize: 11, color: C.textMuted }}>/ Mois / Employé</span></div>
                          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                            {planModules.map(mod => <div key={mod} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: C.text }}><CheckCircle size={13} color={C.green} /> {MODULE_LABELS[mod]}</div>)}
                          </div>
                          {plan.slug !== "enterprise" && !isCurrent && (
                            <button onClick={e => { e.stopPropagation(); setSelectedPlanIds([plan.id]); }} className="iz-btn-pink" style={{ ...sBtn(isSelected ? "pink" : "outline"), width: "100%", marginTop: 14, fontSize: 12, padding: "8px 0" }}>{isSelected ? "Sélectionné" : "Sélectionner"}</button>
                          )}
                          {plan.slug === "enterprise" && <button onClick={e => { e.stopPropagation(); window.open("mailto:contact@illizeo.com?subject=Enterprise", "_blank"); }} style={{ ...sBtn("dark"), width: "100%", marginTop: 14, fontSize: 12, padding: "8px 0" }}>Contactez-nous</button>}
                        </div>
                        );
                      })}
                    </div>

                    {/* Cooptation add-on */}
                    {cooptationPlan && (
                      <div style={{ marginTop: 20, border: `1px solid ${C.border}`, borderRadius: 12, padding: "16px 20px", display: "flex", alignItems: "center", gap: 16, background: currentCooptSub ? C.greenLight + "40" : C.white }}>
                        <input type="checkbox" checked={!!currentCooptSub || selectedPlanIds.includes(cooptationPlan.id)} onChange={() => {
                          if (currentCooptSub) return;
                          setSelectedPlanIds(prev => prev.includes(cooptationPlan.id) ? prev.filter(id => id !== cooptationPlan.id) : [...prev, cooptationPlan.id]);
                        }} style={{ width: 18, height: 18, accentColor: C.pink, cursor: currentCooptSub ? "default" : "pointer" }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 14, fontWeight: 600 }}>{cooptationPlan.nom} {currentCooptSub && <span style={{ fontSize: 10, color: C.green, fontWeight: 600 }}>Actif</span>}</div>
                          <div style={{ fontSize: 11, color: C.textMuted }}>{cooptationPlan.description}</div>
                        </div>
                        <div style={{ fontSize: 14, fontWeight: 700 }}>CHF {cooptationPlan.prix_chf_mensuel} <span style={{ fontSize: 11, fontWeight: 400, color: C.textMuted }}>/ emp / mois</span></div>
                      </div>
                    )}
                  </div>

                  {/* Right sidebar: summary */}
                  <div style={{ width: 300, flexShrink: 0 }}>
                    <div style={{ border: `1px solid ${C.border}`, borderRadius: 12, padding: "20px", position: "sticky", top: 24 }}>
                      {/* Billing toggle */}
                      <div style={{ display: "flex", gap: 0, marginBottom: 16, background: C.bg, borderRadius: 8, padding: 3 }}>
                        {(["monthly", "yearly"] as const).map(b => (
                          <button key={b} onClick={() => setPricingBilling(b)} style={{ flex: 1, padding: "8px 0", borderRadius: 6, fontSize: 12, fontWeight: pricingBilling === b ? 600 : 400, border: "none", cursor: "pointer", fontFamily: font, background: pricingBilling === b ? C.pink : "transparent", color: pricingBilling === b ? C.white : C.textMuted }}>
                            {b === "monthly" ? "Mensuellement" : "Annuellement"}
                          </button>
                        ))}
                      </div>
                      {pricingBilling === "yearly" && <div style={{ fontSize: 10, color: C.green, fontWeight: 600, textAlign: "center", marginBottom: 12 }}>10% Réduction</div>}

                      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>1. Choisissez un abonnement</div>
                      <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 12 }}>
                        {selectedPlanIds.length > 0 ? selectedPlanIds.map(id => availablePlans.find(p => p.id === id)?.nom).join(" + ") : currentPlan?.nom || "Aucun"}
                      </div>

                      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>2. Sélectionnez vos employés</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                        <button onClick={() => setSubEmployeeCount(Math.max(25, subEmployeeCount - 5))} style={{ width: 32, height: 32, borderRadius: "50%", border: `1px solid ${C.border}`, background: C.white, cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                        <input type="number" value={subEmployeeCount} onChange={e => setSubEmployeeCount(Math.max(25, Number(e.target.value)))} style={{ width: 60, textAlign: "center", padding: "6px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 15, fontWeight: 700, fontFamily: font }} />
                        <button onClick={() => setSubEmployeeCount(subEmployeeCount + 5)} style={{ width: 32, height: 32, borderRadius: "50%", border: `1px solid ${C.border}`, background: C.white, cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                      </div>

                      {/* Payment method */}
                      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>3. Mode de paiement</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 }}>
                        {([
                          { id: "stripe" as const, label: "Payer par carte", desc: "Visa, Mastercard, SEPA via Stripe", icon: "💳" },
                          { id: "invoice" as const, label: "Payer par facture", desc: "Facture 30 jours, virement bancaire", icon: "📄" },
                        ]).map(pm => (
                          <button key={pm.id} onClick={() => setPaymentMethod(pm.id)} style={{
                            display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 8,
                            border: paymentMethod === pm.id ? `2px solid ${C.pink}` : `1px solid ${C.border}`,
                            background: paymentMethod === pm.id ? C.pinkBg : C.white,
                            cursor: "pointer", fontFamily: font, textAlign: "left", transition: "all .15s",
                          }}>
                            <span style={{ fontSize: 18 }}>{pm.icon}</span>
                            <div>
                              <div style={{ fontSize: 12, fontWeight: paymentMethod === pm.id ? 600 : 400, color: paymentMethod === pm.id ? C.pink : C.text }}>{pm.label}</div>
                              <div style={{ fontSize: 10, color: C.textMuted }}>{pm.desc}</div>
                            </div>
                          </button>
                        ))}
                      </div>

                      {selectedPlanIds.length > 0 && (
                        <button onClick={async () => {
                          for (const pid of selectedPlanIds) {
                            try { await subscribeToPlan(pid, pricingBilling, paymentMethod); } catch {}
                          }
                          reloadSub(); setSubView("overview"); setSelectedPlanIds([]);
                          addToast_admin(paymentMethod === "invoice" ? "Abonnement activé — facture envoyée" : "Abonnement activé — 14 jours d'essai gratuit");
                        }} className="iz-btn-pink" style={{ ...sBtn("pink"), width: "100%", padding: "12px 0", fontSize: 14, marginBottom: 16 }}>
                          {paymentMethod === "invoice" ? "Démarrer — Paiement par facture" : "Démarrer — Paiement par carte"}
                        </button>
                      )}

                      <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 14 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>Prix Total Estimatif</div>
                        <div style={{ fontSize: 24, fontWeight: 800 }}>
                          {(() => {
                            const total = selectedPlanIds.reduce((sum, id) => {
                              const p = availablePlans.find(pl => pl.id === id);
                              const price = Number(p?.prix_chf_mensuel || 0);
                              return sum + (pricingBilling === "yearly" ? price * 0.9 : price) * subEmployeeCount;
                            }, 0);
                            return `${Math.round(total * 100) / 100} CHF`;
                          })()}
                        </div>
                        <div style={{ fontSize: 11, color: C.textMuted }}>( {pricingBilling === "yearly" ? "Annuellement" : "Mensuellement"} )</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              );
            })()}

            {/* ═══ VIEW: Overview ═══ */}
            {subView === "overview" && (<>
              {/* Cancellation warning banner */}
              {currentOnboardingSub?.canceled_at && new Date(currentOnboardingSub.canceled_at) > new Date() && (() => {
                const endDate = currentOnboardingSub.canceled_at;
                const daysLeft = Math.max(0, Math.ceil((new Date(endDate).getTime() - new Date().getTime()) / (24 * 60 * 60 * 1000)));
                return (
                <div style={{ padding: "16px 20px", background: C.amberLight, borderRadius: 12, marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between", border: `1px solid ${C.amber}30` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <AlertTriangle size={20} color={C.amber} />
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>Votre plan {currentPlan?.nom} sera annulé dans {daysLeft} jour{daysLeft > 1 ? "s" : ""}</div>
                      <div style={{ fontSize: 12, color: C.textLight }}>Votre abonnement reste actif jusqu'au {fmtDate(endDate)}. Après cette date, l'accès aux fonctionnalités sera bloqué.</div>
                    </div>
                  </div>
                  <button onClick={async () => {
                    try {
                      await subscribeToPlan(currentOnboardingSub.plan_id, currentOnboardingSub.billing_cycle || "monthly", "stripe");
                      reloadSub();
                      addToast_admin("Abonnement réactivé !");
                    } catch { addToast_admin(t('toast.error')); }
                  }} className="iz-btn-pink" style={{ ...sBtn("pink"), fontSize: 12, whiteSpace: "nowrap" }}>{t('misc.reactivate')} mon abonnement</button>
                </div>
                );
              })()}

              {/* Metrics */}
              {currentOnboardingSub && (
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
                  {[
                    { label: "Modules actifs", value: `${tenantActiveModules.length} module${tenantActiveModules.length > 1 ? "s" : ""}`, max: "inclus dans votre plan" },
                    { label: "Signature électronique", value: signatureUsage ? `${signatureUsage.total} signature${signatureUsage.total > 1 ? "s" : ""} envoyée${signatureUsage.total > 1 ? "s" : ""}` : "Chargement...", max: signatureUsage ? `${signatureUsage.signed} signée${signatureUsage.signed > 1 ? "s" : ""} · ${signatureUsage.sent} en attente · ${signatureUsage.declined} refusée${signatureUsage.declined > 1 ? "s" : ""}` : "" },
                    { label: "Stockage", value: storageUsage ? `${storageUsage.used_formatted} sur ${storageUsage.max_formatted}` : "Chargement...", max: storageUsage ? `${storageUsage.percent} % utilisé · ${storageUsage.file_count} fichier${storageUsage.file_count > 1 ? "s" : ""} · DB: ${storageUsage.db_size}` : "" },
                  ].map((m, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 20px", border: `1px solid ${C.border}`, borderRadius: 8 }}>
                      <span style={{ fontSize: 13, color: C.text }}>{m.label}</span>
                      <span style={{ fontSize: 12, color: C.textMuted }}>{m.value} {m.max && `· ${m.max}`}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Abonnement et paiement */}
              <div style={{ border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden" }}>
                <div style={{ padding: "16px 24px", borderBottom: `1px solid ${C.border}` }}>
                  <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Abonnement et paiement</h2>
                </div>
                {/* Tabs */}
                <div style={{ display: "flex", gap: 0, borderBottom: `1px solid ${C.border}` }}>
                  {([
                    { id: "facturation" as const, label: "Informations de facturation" },
                    { id: "factures" as const, label: "Facturation" },
                    { id: "paiement" as const, label: "Méthode de paiement" },
                    { id: "protection" as const, label: "Informations sur la protection des données" },
                  ]).map(tab => (
                    <button key={tab.id} onClick={() => setSubTab(tab.id)} style={{ padding: "12px 20px", fontSize: 13, fontWeight: subTab === tab.id ? 600 : 400, color: subTab === tab.id ? C.blue : C.textLight, background: "none", border: "none", borderBottom: subTab === tab.id ? `2px solid ${C.blue}` : "2px solid transparent", cursor: "pointer", fontFamily: font, marginBottom: -1 }}>
                      {tab.label}
                    </button>
                  ))}
                </div>
                <div style={{ padding: "24px" }}>
                  {subTab === "facturation" && (
                    <div>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                        <h3 style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>Contact de facturation</h3>
                        <button className="iz-btn-outline" style={{ ...sBtn("outline"), fontSize: 11, padding: "4px 12px" }}>{t('common.edit')}</button>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: "8px 20px", fontSize: 13 }}>
                        <span style={{ color: C.textMuted }}>Prénom</span><span>{billingInfo.prenom || auth.user?.name?.split(" ")[0] || "—"}</span>
                        <span style={{ color: C.textMuted }}>Nom</span><span>{billingInfo.nom || auth.user?.name?.split(" ").slice(1).join(" ") || "—"}</span>
                        <span style={{ color: C.textMuted }}>E-mail</span><span>{billingInfo.email || auth.user?.email || "—"}</span>
                        <span style={{ color: C.textMuted }}>Téléphone</span><span>{billingInfo.telephone || "—"}</span>
                        <span style={{ color: C.textMuted }}>Pays</span><span>{billingInfo.pays}</span>
                      </div>
                      <div style={{ marginTop: 24, display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                        <h3 style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>Informations de facturation</h3>
                        <button className="iz-btn-outline" style={{ ...sBtn("outline"), fontSize: 11, padding: "4px 12px" }}>{t('common.edit')}</button>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: "8px 20px", fontSize: 13 }}>
                        <span style={{ color: C.textMuted }}>Entreprise</span><span>{billingInfo.company || "—"}</span>
                        <span style={{ color: C.textMuted }}>Numéro de TVA</span><span>{billingInfo.vat || "—"}</span>
                        <span style={{ color: C.textMuted }}>Rue</span><span>{billingInfo.rue || "—"}</span>
                        <span style={{ color: C.textMuted }}>Ville</span><span>{billingInfo.ville || "—"}</span>
                        <span style={{ color: C.textMuted }}>Code Postal</span><span>{billingInfo.code_postal || "—"}</span>
                      </div>
                    </div>
                  )}
                  {subTab === "factures" && (
                    <div>
                      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 40px", gap: 0, padding: "8px 0", borderBottom: `1px solid ${C.border}`, fontSize: 11, fontWeight: 600, color: C.textLight }}>
                        <span>Facture</span><span>Statut</span><span>Date</span><span>Montant</span><span></span>
                      </div>
                      {activeSubs.length === 0 && <div style={{ padding: "30px 0", textAlign: "center", color: C.textMuted, fontSize: 13 }}>Aucune facture</div>}
                      {activeSubs.map((sub: any, i: number) => (
                        <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 40px", gap: 0, padding: "12px 0", borderBottom: `1px solid ${C.border}`, alignItems: "center", fontSize: 13 }}>
                          <span style={{ color: C.blue, fontWeight: 500 }}>#INV{String(sub.id).padStart(7, "0")}</span>
                          <span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 600, background: C.greenLight, color: C.green, justifySelf: "start" }}>{sub.status === "trialing" ? "Essai" : "Payée"}</span>
                          <span style={{ color: C.textMuted }}>{fmtDate(sub.current_period_start)}</span>
                          <span style={{ fontWeight: 600 }}>{Number(sub.plan?.prix_chf_mensuel || 0) * 25} CHF</span>
                          <button style={{ background: "none", border: "none", cursor: "pointer", color: C.textMuted }}><MoreHorizontal size={16} /></button>
                        </div>
                      ))}
                    </div>
                  )}
                  {subTab === "paiement" && (
                    <div>
                      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
                        <button className="iz-btn-pink" style={{ ...sBtn("pink"), fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}><Plus size={14} /> Ajouter</button>
                      </div>
                      <div style={{ padding: "30px 0", textAlign: "center", color: C.textMuted, fontSize: 13 }}>
                        Aucune méthode de paiement enregistrée.<br />
                        <span style={{ fontSize: 12 }}>Ajoutez une carte bancaire pour activer le paiement automatique via Stripe.</span>
                      </div>
                    </div>
                  )}
                  {subTab === "protection" && (
                    <div>
                      <p style={{ fontSize: 13, color: C.textLight, marginBottom: 16 }}>Comment Illizeo traite vos données et encadre ses engagements contractuels</p>
                      {[
                        { title: "Annexe relative au traitement des données personnelles", desc: "Toutes les suggestions que nous recevons sont étudiées avec attention par notre équipe produit." },
                        { title: "Mesures de sécurité techniques et organisationnelles (MTO)", desc: "Détail des mesures techniques et organisationnelles mises en œuvre pour protéger vos données." },
                        { title: "Qui peut donner des instructions à Illizeo ?", desc: "Liste des personnes autorisées à donner des instructions concernant le traitement des données." },
                        { title: "Sous-traitants", desc: "Liste des sous-traitants impliqués dans le traitement de vos données." },
                      ].map((item, i) => (
                        <div key={i} style={{ border: `1px solid ${C.border}`, borderRadius: 10, padding: "16px 20px", marginBottom: 8, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }} className="iz-sidebar-item">
                          <div>
                            <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{item.title}</div>
                            <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>{item.desc}</div>
                          </div>
                          <ChevronRight size={18} color={C.textMuted} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Gérer les apps */}
              <div style={{ marginTop: 24 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Gérer les apps</h2>
                  <button onClick={() => setSubView("change")} className="iz-btn-pink" style={{ ...sBtn("pink"), fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}><Plus size={14} /> Ajouter app</button>
                </div>
                {tenantActiveModules.length === 0 ? (
                  <div style={{ padding: "30px 0", textAlign: "center", color: C.textMuted, fontSize: 13 }}>Aucune app active. Souscrivez à un plan pour activer des modules.</div>
                ) : tenantActiveModules.map(mod => {
                  const isCooptMod = mod === "cooptation";
                  const cooptSub = isCooptMod ? activeSubs.find((s: any) => s.plan?.slug === "cooptation") : null;
                  const isScheduledCancel = cooptSub?.canceled_at && new Date(cooptSub.canceled_at) > new Date();
                  return (
                  <div key={mod} style={{ border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 20px", marginBottom: 8, display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: C.greenLight, display: "flex", alignItems: "center", justifyContent: "center" }}><CheckCircle size={18} color={C.green} /></div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{MODULE_LABELS[mod] || mod} <span style={{ fontSize: 10, color: C.green, fontWeight: 600 }}>Actif</span></div>
                      <div style={{ fontSize: 11, color: C.textMuted }}>
                        {isScheduledCancel ? `Désactivation prévue le ${fmtDate(cooptSub.canceled_at)}` : "Inclus dans votre plan"}
                      </div>
                    </div>
                    {isCooptMod && cooptSub && !isScheduledCancel && (
                      <button onClick={() => showConfirm("{t('misc.disable')} le module Cooptation ? La désactivation prendra effet à la fin de votre période de facturation en cours.", async () => {
                        try {
                          const res = await cancelSubscription(cooptSub.id);
                          reloadSub();
                          addToast_admin(res.message || "Cooptation désactivée en fin de période");
                        } catch { addToast_admin(t('toast.error')); }
                      })} style={{ ...sBtn("outline"), fontSize: 11, color: C.red, borderColor: C.red, padding: "5px 12px", whiteSpace: "nowrap" }}>{t('misc.disable')}</button>
                    )}
                    {isScheduledCancel && (
                      <span style={{ padding: "3px 10px", borderRadius: 6, fontSize: 10, fontWeight: 600, background: C.amberLight, color: C.amber, whiteSpace: "nowrap" }}>Fin le {fmtDate(cooptSub.canceled_at)}</span>
                    )}
                  </div>
                  );
                })}
              </div>
            </>)}
          </div>
          );
  };

  // ── Drag & drop for field reordering ──
  let _fieldDragFrom: { section: string; idx: number } | null = null;
  let _fieldDragTo: { section: string; idx: number } | null = null;

  const handleFieldDragStart = (section: string, idx: number) => {
    _fieldDragFrom = { section, idx };
  };
  const handleFieldDragOver = (e: React.DragEvent, section: string, idx: number) => {
    e.preventDefault();
    _fieldDragTo = { section, idx };
    document.querySelectorAll('[data-field-drag]').forEach(el => {
      (el as HTMLElement).style.borderTopColor = 'transparent';
    });
    const target = document.querySelector(`[data-field-drag="${section}-${idx}"]`) as HTMLElement;
    if (target) target.style.borderTopColor = C.pink;
  };
  const handleFieldDrop = async () => {
    document.querySelectorAll('[data-field-drag]').forEach(el => {
      (el as HTMLElement).style.borderTopColor = 'transparent';
    });
    if (!_fieldDragFrom || !_fieldDragTo || (_fieldDragFrom.section === _fieldDragTo.section && _fieldDragFrom.idx === _fieldDragTo.idx)) return;
    const sectionFields = fieldConfig.filter(f => f.section === _fieldDragFrom!.section);
    const otherFields = fieldConfig.filter(f => f.section !== _fieldDragFrom!.section);

    if (_fieldDragFrom.section === _fieldDragTo.section) {
      // Reorder within same section
      const [moved] = sectionFields.splice(_fieldDragFrom.idx, 1);
      sectionFields.splice(_fieldDragTo.idx, 0, moved);
      const updated = sectionFields.map((f, i) => ({ ...f, ordre: i + 1 }));
      setFieldConfig([...otherFields, ...updated]);
      for (const f of updated) apiUpdateFieldConfig(f.id, { ordre: f.ordre }).catch(() => {});
    } else {
      // Move to different section
      const [moved] = sectionFields.splice(_fieldDragFrom.idx, 1);
      moved.section = _fieldDragTo.section;
      const targetFields = fieldConfig.filter(f => f.section === _fieldDragTo!.section);
      targetFields.splice(_fieldDragTo.idx, 0, moved);
      const updatedTarget = targetFields.map((f, i) => ({ ...f, ordre: i + 1 }));
      const updatedSource = sectionFields.map((f, i) => ({ ...f, ordre: i + 1 }));
      const rest = fieldConfig.filter(f => f.section !== _fieldDragFrom!.section && f.section !== _fieldDragTo!.section);
      setFieldConfig([...rest, ...updatedSource, ...updatedTarget]);
      apiUpdateFieldConfig(moved.id, { section: moved.section, ordre: moved.ordre }).catch(() => {});
      for (const f of updatedTarget) apiUpdateFieldConfig(f.id, { ordre: f.ordre }).catch(() => {});
      for (const f of updatedSource) apiUpdateFieldConfig(f.id, { ordre: f.ordre }).catch(() => {});
    }
    addToast_admin(t('toast.order_saved') || "Ordre enregistré");
    _fieldDragFrom = null;
    _fieldDragTo = null;
  };

  // ── Drag & drop for section reordering ──
  let _sectionDragFrom: number | null = null;
  let _sectionDragTo: number | null = null;
  // Sections order stored in state-like closure
  const SECTION_DEFS_DEFAULT = [
    { key: "personal", label: t('fields.personal'), icon: Users, color: "#C2185B" },
    { key: "contract", label: t('fields.contract'), icon: FileSignature, color: "#1A73E8" },
    { key: "job", label: t('fields.job'), icon: ClipboardList, color: "#E65100" },
    { key: "position", label: t('fields.position'), icon: Navigation, color: "#00897B" },
    { key: "org", label: t('fields.org'), icon: Building2, color: "#7B5EA7" },
  ];

  const renderAdminFields = () => {
    // Sort fields by ordre within each section
    const sortedFieldConfig = [...fieldConfig].sort((a, b) => (a.ordre || 0) - (b.ordre || 0));

    return (
          <div style={{ flex: 1, padding: "24px 32px", overflow: "auto" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <div>
                <h1 style={{ fontSize: 22, fontWeight: 600, margin: 0 }}>{t('fields.title')}</h1>
                <p style={{ fontSize: 12, color: C.textLight, margin: "4px 0 0" }}>{t('fields.subtitle')}</p>
              </div>
            </div>
            {/* Add custom field */}
            <div className="iz-card" style={{ ...sCard, marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 10 }}>{t('fields.add_custom')}</div>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 10, marginBottom: 10 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: C.text, display: "block", marginBottom: 4 }}>{t('fields.field_name')}</label>
                  <input id="new-field-label" placeholder={t('fields.field_name_placeholder')} style={{ ...sInput, fontSize: 12 }} />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: C.text, display: "block", marginBottom: 4 }}>{t('fields.type')}</label>
                  <select id="new-field-type" style={{ ...sInput, fontSize: 12, cursor: "pointer" }}>
                    <option value="text">{t('fields.type_text')}</option>
                    <option value="number">{t('fields.type_number')}</option>
                    <option value="date">{t('fields.type_date')}</option>
                    <option value="list">{t('fields.type_list')}</option>
                    <option value="boolean">{t('fields.type_boolean')}</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: C.text, display: "block", marginBottom: 4 }}>{t('fields.section')}</label>
                  <select id="new-field-section" style={{ ...sInput, fontSize: 12, cursor: "pointer" }}>
                    <option value="personal">{t('fields.personal')}</option>
                    <option value="contract">{t('fields.contract')}</option>
                    <option value="job">{t('fields.job')}</option>
                    <option value="position">{t('fields.position')}</option>
                    <option value="org">{t('fields.org')}</option>
                  </select>
                </div>
              </div>
              <div style={{ display: "flex", gap: 10, alignItems: "end" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 11, fontWeight: 600, color: C.text, display: "block", marginBottom: 4 }}>{t('fields.list_values')}</label>
                  <input id="new-field-values" placeholder={t('fields.list_values_placeholder')} style={{ ...sInput, fontSize: 12 }} />
                </div>
                <button onClick={async () => {
                  const labelEl = document.getElementById("new-field-label") as HTMLInputElement;
                  const typeEl = document.getElementById("new-field-type") as HTMLSelectElement;
                  const sectionEl = document.getElementById("new-field-section") as HTMLSelectElement;
                  const valuesEl = document.getElementById("new-field-values") as HTMLInputElement;
                  const label = labelEl?.value?.trim();
                  if (!label) return;
                  const key = label.toLowerCase().replace(/[^a-z0-9]/g, "_").replace(/_+/g, "_");
                  const fieldType = typeEl?.value || "text";
                  const listValues = fieldType === "list" && valuesEl?.value ? valuesEl.value.split(",").map(v => v.trim()).filter(Boolean) : undefined;
                  try {
                    const created = await apiCreateFieldConfig({ field_key: key, label, section: sectionEl?.value || "personal", field_type: fieldType, list_values: listValues } as any);
                    setFieldConfig(prev => [...prev, created]);
                    labelEl.value = ""; valuesEl.value = "";
                    addToast_admin(`${t('fields.field_created')} : ${label}`);
                  } catch { addToast_admin(t('fields.field_exists')); }
                }} className="iz-btn-pink" style={{ ...sBtn("pink"), fontSize: 12, padding: "8px 20px", whiteSpace: "nowrap" }}>
                  <Plus size={14} style={{ marginRight: 4 }} /> {t('fields.add')}
                </button>
              </div>
            </div>
            {SECTION_DEFS_DEFAULT.map(section => (
              <div key={section.key} style={{ marginBottom: 24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 6, background: `${section.color}15`, display: "flex", alignItems: "center", justifyContent: "center" }}><section.icon size={14} color={section.color} /></div>
                  <h2 style={{ fontSize: 14, fontWeight: 600, color: C.text, margin: 0 }}>{section.label}</h2>
                  <span style={{ fontSize: 10, color: C.textMuted }}>({sortedFieldConfig.filter(f => f.section === section.key).length})</span>
                </div>
                <div className="iz-card" style={{ ...sCard, padding: 0, overflow: "hidden" }}
                  onDragOver={(e) => {
                    // Allow drop on empty sections
                    const sectionFields = sortedFieldConfig.filter(f => f.section === section.key);
                    if (sectionFields.length === 0) {
                      e.preventDefault();
                      _fieldDragTo = { section: section.key, idx: 0 };
                    }
                  }}
                  onDrop={() => { if (sortedFieldConfig.filter(f => f.section === section.key).length === 0) handleFieldDrop(); }}>
                  {sortedFieldConfig.filter(f => f.section === section.key).length === 0 && (
                    <div style={{ padding: "16px", textAlign: "center", fontSize: 11, color: C.textMuted, borderTop: "2px solid transparent" }} data-field-drag={`${section.key}-0`}>
                      {t('fields.drop_here') || "Glissez un champ ici"}
                    </div>
                  )}
                  {sortedFieldConfig.filter(f => f.section === section.key).map((fc, i, arr) => (
                    <div key={fc.id}
                      data-field-drag={`${section.key}-${i}`}
                      draggable
                      onDragStart={() => handleFieldDragStart(section.key, i)}
                      onDragOver={(e) => handleFieldDragOver(e, section.key, i)}
                      onDragEnd={() => { document.querySelectorAll('[data-field-drag]').forEach(el => { (el as HTMLElement).style.borderTopColor = 'transparent'; }); }}
                      onDrop={handleFieldDrop}
                      style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 16px", borderBottom: i < arr.length - 1 ? `1px solid ${C.border}` : "none", borderTop: "2px solid transparent", transition: "border-color .15s", cursor: "grab" }}>
                      {/* Drag handle */}
                      <div style={{ display: "flex", flexDirection: "column", gap: 2, padding: "4px 2px", flexShrink: 0, color: C.textMuted }}>
                        <div style={{ width: 12, display: "flex", flexWrap: "wrap", gap: 2 }}>
                          {[...Array(6)].map((_, di) => <div key={di} style={{ width: 3, height: 3, borderRadius: "50%", background: C.border }} />)}
                        </div>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ fontSize: 13, fontWeight: 500 }}>{lang !== "fr" && fc.label_en ? fc.label_en : fc.label}</span>
                          <span style={{ fontSize: 9, padding: "1px 5px", borderRadius: 3, background: C.bg, color: C.textMuted, fontWeight: 600 }}>{fc.field_type || "text"}</span>
                          {fc.field_type === "list" && fc.list_values?.length > 0 && <span style={{ fontSize: 9, color: C.textMuted }}>({fc.list_values.join(", ")})</span>}
                        </div>
                        <div style={{ fontSize: 10, color: C.textMuted }}>{lang === "fr" ? fc.label_en || fc.field_key : fc.label || fc.field_key}</div>
                      </div>
                      <button onClick={() => { setTranslateFieldId(fc.id); setTranslateEN(fc.label_en || ""); }} style={{ background: "none", border: "none", cursor: "pointer", color: C.blue, padding: 2 }} title="Traduire"><Globe size={14} /></button>
                      <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: C.textLight, cursor: "pointer" }}>
                        <input type="checkbox" checked={fc.obligatoire} onChange={async () => {
                          await apiUpdateFieldConfig(fc.id, { obligatoire: !fc.obligatoire });
                          setFieldConfig(prev => prev.map(f => f.id === fc.id ? { ...f, obligatoire: !f.obligatoire } : f));
                          addToast_admin(`${fc.label} : ${!fc.obligatoire ? t('fields.required') : t('fields.optional')}`);
                        }} style={{ accentColor: C.red }} />
                        {t('fields.required')}
                      </label>
                      <div onClick={async () => {
                        await apiUpdateFieldConfig(fc.id, { actif: !fc.actif });
                        setFieldConfig(prev => prev.map(f => f.id === fc.id ? { ...f, actif: !f.actif } : f));
                        addToast_admin(`${fc.label} : ${!fc.actif ? t('fields.enabled') : t('fields.disabled')}`);
                      }} style={{ width: 40, height: 22, borderRadius: 11, background: fc.actif ? C.green : C.border, cursor: "pointer", position: "relative", transition: "all .2s", flexShrink: 0 }}>
                        <div style={{ width: 18, height: 18, borderRadius: "50%", background: C.white, position: "absolute", top: 2, left: fc.actif ? 20 : 2, transition: "all .2s", boxShadow: "0 1px 3px rgba(0,0,0,.2)" }} />
                      </div>
                      {fc.field_key.startsWith("custom_") && (
                        <button onClick={() => {
                          setConfirmDialog({ message: `${t('fields.delete_confirm')} "${fc.label}" ?`, onConfirm: async () => {
                            try { await apiDeleteFieldConfig(fc.id); setFieldConfig(prev => prev.filter(f => f.id !== fc.id)); addToast_admin(`${t('fields.field_deleted')} : ${fc.label}`); } catch { addToast_admin(t('toast.error')); }
                            setConfirmDialog(null);
                          }});
                        }} style={{ background: "none", border: "none", cursor: "pointer", color: C.textMuted, padding: 2 }}><X size={14} /></button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
    );
  };

  const renderAdminApparence = () => {
          const THEME_PRESETS = [
            { name: "Illizeo Pink", color: "#C2185B" },
            { name: "Ocean Blue", color: "#1A73E8" },
            { name: "Forest Green", color: "#2E7D32" },
            { name: "Royal Purple", color: "#7B5EA7" },
            { name: "Sunset Orange", color: "#E65100" },
            { name: "Slate Dark", color: "#37474F" },
            { name: "Crimson Red", color: "#C62828" },
            { name: "Teal", color: "#00897B" },
          ];
          const REGIONS = [
            { code: "CH", label: "Suisse", flag: "🇨🇭", currency: "CHF" },
            { code: "FR", label: "France", flag: "🇫🇷", currency: "EUR" },
            { code: "BE", label: "Belgique", flag: "🇧🇪", currency: "EUR" },
            { code: "LU", label: "Luxembourg", flag: "🇱🇺", currency: "EUR" },
            { code: "CA", label: "Canada", flag: "🇨🇦", currency: "CAD" },
            { code: "US", label: "États-Unis", flag: "🇺🇸", currency: "USD" },
            { code: "GB", label: "Royaume-Uni", flag: "🇬🇧", currency: "GBP" },
            { code: "DE", label: "Allemagne", flag: "🇩🇪", currency: "EUR" },
          ];
          const TIMEZONES = [
            "Europe/Zurich", "Europe/Paris", "Europe/Brussels", "Europe/Luxembourg",
            "Europe/London", "Europe/Berlin", "America/Montreal", "America/New_York",
            "America/Los_Angeles", "Asia/Tokyo", "Australia/Sydney",
          ];
          const sSection = { marginBottom: 32 } as const;
          const sSectionTitle = { fontSize: 16, fontWeight: 600, color: C.text, margin: "0 0 4px", display: "flex", alignItems: "center", gap: 8 } as const;
          const sSectionDesc = { fontSize: 12, color: C.textMuted, margin: "0 0 16px" } as const;

          const saveTheme = (color: string) => {
            saveSetting("theme_color", color, setThemeColor);
            addToast_admin(t('toast.saved'));
          };

          return (
          <div style={{ flex: 1, padding: "24px 32px", overflow: "auto", maxWidth: 800 }}>
            <h1 style={{ fontSize: 22, fontWeight: 600, margin: "0 0 8px" }}>{t('admin.appearance')}</h1>
            <p style={{ fontSize: 13, color: C.textMuted, margin: "0 0 28px" }}>{t('settings.appearance_desc')}</p>

            {/* ── Logo ──────────────────────────────────────── */}
            <div style={sSection}>
              <h2 style={sSectionTitle}><Building2 size={18} color={C.blue} /> {t('settings.company_logo')}</h2>
              <p style={sSectionDesc}>{t('settings.logo_desc')}</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                {/* Icône (carré) */}
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 8 }}>{t('settings.icon_square')}</label>
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{ width: 64, height: 64, borderRadius: 12, border: `2px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", background: C.bg }}>
                      <img src={customLogo || ILLIZEO_LOGO_URI} alt="Logo" style={{ width: 48, height: 48, objectFit: "contain" }} />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      <label style={{ cursor: "pointer" }}>
                        <input type="file" accept="image/*" style={{ display: "none" }} onChange={e => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onload = () => { const url = reader.result as string; saveSetting("custom_logo", url, setCustomLogo); addToast_admin(t('settings.icon_updated')); };
                          reader.readAsDataURL(file);
                        }} />
                        <span className="iz-btn-outline" style={{ ...sBtn("outline"), padding: "6px 14px", fontSize: 11, display: "inline-flex", alignItems: "center", gap: 4 }}><Upload size={12} /> {t('settings.change')}</span>
                      </label>
                      {customLogo && <button onClick={() => { saveSetting("custom_logo", "", setCustomLogo); addToast_admin(t('settings.reset')); }} style={{ background: "none", border: "none", color: C.red, fontSize: 11, cursor: "pointer", padding: 0, textAlign: "left" }}>{t('settings.reset')}</button>}
                    </div>
                  </div>
                  <div style={{ fontSize: 10, color: C.textMuted, marginTop: 6 }}>{t('settings.logo_hint_icon')}</div>
                </div>
                {/* Logo complet (horizontal) */}
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 8 }}>{t('settings.logo_horizontal')}</label>
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{ width: 180, height: 64, borderRadius: 12, border: `2px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", background: C.bg, padding: "0 12px" }}>
                      <img src={customLogoFull || ILLIZEO_FULL_LOGO_URI} alt="Logo" style={{ height: 32, objectFit: "contain", maxWidth: "100%" }} />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      <label style={{ cursor: "pointer" }}>
                        <input type="file" accept="image/*" style={{ display: "none" }} onChange={e => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onload = () => { const url = reader.result as string; saveSetting("custom_logo_full", url, setCustomLogoFull); addToast_admin(t('settings.logo_updated')); };
                          reader.readAsDataURL(file);
                        }} />
                        <span className="iz-btn-outline" style={{ ...sBtn("outline"), padding: "6px 14px", fontSize: 11, display: "inline-flex", alignItems: "center", gap: 4 }}><Upload size={12} /> {t('settings.change')}</span>
                      </label>
                      {customLogoFull && <button onClick={() => { saveSetting("custom_logo_full", "", setCustomLogoFull); addToast_admin(t('settings.reset')); }} style={{ background: "none", border: "none", color: C.red, fontSize: 11, cursor: "pointer", padding: 0, textAlign: "left" }}>{t('settings.reset')}</button>}
                    </div>
                  </div>
                  <div style={{ fontSize: 10, color: C.textMuted, marginTop: 6 }}>{t('settings.logo_hint_full')}</div>
                </div>
              </div>
              {/* Preview */}
              <div style={{ marginTop: 16, padding: "16px 20px", borderRadius: 10, background: C.bg }}>
                <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 8 }}>{t('settings.sidebar_preview')}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, background: C.white, padding: "12px 16px", borderRadius: 10, border: `1px solid ${C.border}`, width: "fit-content" }}>
                  <img src={customLogo || ILLIZEO_LOGO_URI} alt="" style={{ width: 28, height: 28, objectFit: "contain" }} />
                  <img src={customLogoFull || ILLIZEO_FULL_LOGO_URI} alt="" style={{ height: 22, objectFit: "contain" }} />
                </div>
              </div>
            </div>

            {/* ── Favicon ──────────────────────────────────── */}
            <div style={sSection}>
              <h2 style={sSectionTitle}><Globe size={18} color="#7B5EA7" /> {t('settings.favicon')}</h2>
              <p style={sSectionDesc}>{t('settings.favicon_desc')}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: 10, border: `2px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", background: C.bg }}>
                  <img src={customFavicon || ILLIZEO_LOGO_URI} alt="Favicon" style={{ width: 32, height: 32, objectFit: "contain" }} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <label style={{ cursor: "pointer" }}>
                    <input type="file" accept="image/*" style={{ display: "none" }} onChange={e => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = () => { const url = reader.result as string; saveSetting("custom_favicon", url, setCustomFavicon); addToast_admin(t('settings.favicon_updated')); };
                      reader.readAsDataURL(file);
                    }} />
                    <span className="iz-btn-outline" style={{ ...sBtn("outline"), padding: "6px 14px", fontSize: 11, display: "inline-flex", alignItems: "center", gap: 4 }}><Upload size={12} /> {t('settings.change')}</span>
                  </label>
                  {customFavicon && <button onClick={() => { saveSetting("custom_favicon", "", setCustomFavicon); addToast_admin(t('settings.reset')); }} style={{ background: "none", border: "none", color: C.red, fontSize: 11, cursor: "pointer", padding: 0, textAlign: "left" }}>{t('settings.reset')}</button>}
                </div>
                <div style={{ fontSize: 10, color: C.textMuted }}>{t('settings.favicon_hint')}</div>
              </div>
            </div>

            {/* ── Fond page de connexion ─────────────────────── */}
            <div style={sSection}>
              <h2 style={sSectionTitle}><Clapperboard size={18} color={C.pink} /> {t('settings.login_bg')}</h2>
              <p style={sSectionDesc}>{t('settings.login_bg_desc')}</p>
              <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
                <div style={{ width: 240, height: 140, borderRadius: 12, border: `2px solid ${C.border}`, overflow: "hidden", background: loginBgImage ? `url(${loginBgImage}) center/cover no-repeat` : `linear-gradient(135deg, ${C.dark} 0%, #2D1B3D 50%, ${C.pink} 100%)`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", flexShrink: 0 }}>
                  <div style={{ width: 80, background: "rgba(255,255,255,.9)", borderRadius: 8, padding: "8px", textAlign: "center" }}>
                    <div style={{ fontSize: 7, fontWeight: 700, color: C.dark }}>Connexion</div>
                    <div style={{ width: "100%", height: 4, borderRadius: 2, background: C.bg, margin: "3px 0" }} />
                    <div style={{ width: "100%", height: 4, borderRadius: 2, background: C.bg, marginBottom: 3 }} />
                    <div style={{ width: "100%", height: 8, borderRadius: 3, background: C.pink }} />
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <label style={{ cursor: "pointer" }}>
                    <input type="file" accept="image/*" style={{ display: "none" }} onChange={e => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      if (file.size > 5 * 1024 * 1024) { addToast_admin(t('settings.image_too_large')); return; }
                      const reader = new FileReader();
                      reader.onload = () => { const url = reader.result as string; saveSetting("login_bg_image", url, setLoginBgImage); addToast_admin(t('settings.login_bg_updated')); };
                      reader.readAsDataURL(file);
                    }} />
                    <span className="iz-btn-pink" style={{ ...sBtn("pink"), padding: "8px 18px", fontSize: 12, display: "inline-flex", alignItems: "center", gap: 6 }}><Upload size={13} /> {t('settings.choose_image')}</span>
                  </label>
                  {loginBgImage && <button onClick={() => { saveSetting("login_bg_image", "", setLoginBgImage); addToast_admin(t('settings.reset')); }} style={{ ...sBtn("outline"), padding: "6px 14px", fontSize: 11, color: C.red, borderColor: C.red }}>{t('settings.reset')}</button>}
                  <div style={{ fontSize: 10, color: C.textMuted, lineHeight: 1.5, maxWidth: 200 }}>{t('settings.login_bg_hint')}</div>
                </div>
              </div>
            </div>

            {/* ── Langues ────────────────────────────────────── */}
            <div style={sSection}>
              <h2 style={sSectionTitle}><Moon size={18} color={darkMode ? C.amber : C.textMuted} /> {t('settings.dark_mode')}</h2>
              <p style={sSectionDesc}>{t('settings.dark_mode_desc')}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
                <div onClick={toggleDarkMode} style={{ width: 52, height: 28, borderRadius: 14, background: darkMode ? C.pink : C.border, cursor: "pointer", position: "relative", transition: "all .2s" }}>
                  <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#fff", position: "absolute", top: 2, left: darkMode ? 26 : 2, transition: "all .2s", boxShadow: "0 1px 3px rgba(0,0,0,.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {darkMode ? <Moon size={12} color={C.pink} /> : <Sun size={12} color={C.amber} />}
                  </div>
                </div>
                <span style={{ fontSize: 13, fontWeight: 500, color: C.text }}>{darkMode ? t('settings.dark_enabled') : t('settings.light_mode')}</span>
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <div style={{ flex: 1, padding: 16, borderRadius: 10, background: "#fff", border: `2px solid ${!darkMode ? C.pink : C.border}`, cursor: "pointer", textAlign: "center" }} onClick={() => { if (darkMode) toggleDarkMode(); }}>
                  <Sun size={20} color="#F9A825" style={{ marginBottom: 4 }} />
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#333" }}>{t('settings.light')}</div>
                </div>
                <div style={{ flex: 1, padding: 16, borderRadius: 10, background: "#1E1E32", border: `2px solid ${darkMode ? C.pink : "#2A2A3D"}`, cursor: "pointer", textAlign: "center" }} onClick={() => { if (!darkMode) toggleDarkMode(); }}>
                  <Moon size={20} color="#E91E8C" style={{ marginBottom: 4 }} />
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#E8E8EE" }}>{t('settings.dark')}</div>
                </div>
              </div>
            </div>

            {/* ── Langues ────────────────────────────────────── */}
            <div style={sSection}>
              <h2 style={sSectionTitle}><Languages size={18} color={C.blue} /> {t('settings.languages')}</h2>
              <p style={sSectionDesc}>{t('settings.languages_desc')}</p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
                {(["fr", "en"] as const).map(l => {
                  const meta = LANG_META[l];
                  const isActive = activeLanguages.includes(l);
                  return (
                    <button key={l} onClick={() => {
                      if (l === "fr") return; // FR always active
                      const updated = isActive ? activeLanguages.filter(x => x !== l) : [...activeLanguages, l];
                      setActiveLanguages(updated);
                      localStorage.setItem("illizeo_active_languages", JSON.stringify(updated));
                      updateCompanySettings({ active_languages: JSON.stringify(updated) }).catch(() => {});
                      addToast_admin(`${meta.nativeName} ${isActive ? t('fields.disabled') : t('fields.enabled')}`);
                    }} style={{
                      display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", borderRadius: 10,
                      border: `2px solid ${isActive ? C.pink : C.border}`, background: isActive ? C.pinkBg : C.white,
                      cursor: l === "fr" ? "default" : "pointer", fontFamily: font, fontSize: 13, fontWeight: isActive ? 600 : 400,
                      color: isActive ? C.pink : C.textMuted, transition: "all .15s", opacity: l === "fr" ? 1 : undefined,
                    }}>
                      <span style={{ fontSize: 20 }}>{meta.flag}</span>
                      <span>{meta.nativeName}</span>
                      {isActive && <CheckCircle size={14} color={C.pink} />}
                      {l === "fr" && <span style={{ fontSize: 9, padding: "1px 6px", borderRadius: 4, background: C.bg, color: C.textMuted }}>{t('settings.default')}</span>}
                    </button>
                  );
                })}
              </div>
              <div style={{ fontSize: 11, color: C.textMuted }}>{t('settings.fr_always')}</div>
            </div>

            {/* ── Thème couleur ──────────────────────────────── */}
            <div style={sSection}>
              <h2 style={sSectionTitle}><Palette size={18} color={themeColor} /> {t('settings.theme_color')}</h2>
              <p style={sSectionDesc}>{t('settings.theme_desc')}</p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
                {THEME_PRESETS.map(p => (
                  <button key={p.color} onClick={() => saveTheme(p.color)} title={p.name} style={{
                    width: 44, height: 44, borderRadius: 12, background: p.color, border: themeColor === p.color ? `3px solid ${C.text}` : "3px solid transparent",
                    cursor: "pointer", position: "relative", transition: "all .15s", boxShadow: themeColor === p.color ? "0 2px 8px rgba(0,0,0,.2)" : "none",
                  }}>
                    {themeColor === p.color && <Check size={18} color="#fff" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} />}
                  </button>
                ))}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <label style={{ fontSize: 12, color: C.textLight }}>{t('settings.custom_color')}</label>
                <input type="color" value={themeColor} onChange={e => saveTheme(e.target.value)} style={{ width: 36, height: 36, border: "none", borderRadius: 8, cursor: "pointer", padding: 0, background: "none" }} />
                <span style={{ fontSize: 12, fontFamily: "monospace", color: C.textMuted, background: C.bg, padding: "4px 10px", borderRadius: 6 }}>{themeColor.toUpperCase()}</span>
              </div>
              <div style={{ marginTop: 12, padding: "12px 16px", borderRadius: 10, background: C.bg, display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 12, color: C.textLight }}>{t('common.preview')} :</span>
                <button style={{ padding: "6px 16px", borderRadius: 8, background: themeColor, color: "#fff", border: "none", fontSize: 12, fontWeight: 600, fontFamily: font, cursor: "default" }}>{t('settings.main_button')}</button>
                <span style={{ color: themeColor, fontWeight: 600, fontSize: 12 }}>{t('settings.active_link')}</span>
                <span style={{ padding: "3px 10px", borderRadius: 6, fontSize: 10, fontWeight: 600, background: themeColor + "20", color: themeColor }}>Badge</span>
              </div>
            </div>

            {/* ── Langue & Région ────────────────────────────── */}
            <div style={sSection}>
              <h2 style={sSectionTitle}><Languages size={18} color={C.blue} /> {t('settings.lang_region')}</h2>
              <p style={sSectionDesc}>{t('settings.lang_region_desc')}</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>{t('settings.interface_lang')}</label>
                  <div style={{ display: "flex", gap: 8 }}>
                    {(["fr", "en"] as const).map(l => (
                      <button key={l} onClick={() => switchLang(l)} style={{
                        flex: 1, padding: "10px 14px", borderRadius: 10, border: `2px solid ${lang === l ? C.blue : C.border}`,
                        background: lang === l ? C.blueLight : C.white, cursor: "pointer", fontFamily: font, fontSize: 13, fontWeight: lang === l ? 600 : 400,
                        color: lang === l ? C.blue : C.text, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all .15s",
                      }}>
                        <span style={{ fontSize: 18 }}>{LANG_META[l].flag}</span> {LANG_META[l].nativeName}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>{t('settings.region')}</label>
                  <select value={region} onChange={e => saveSetting("region", e.target.value, setRegion)} style={sInput}>
                    {REGIONS.map(r => <option key={r.code} value={r.code}>{r.flag} {r.label} ({r.currency})</option>)}
                  </select>
                </div>
              </div>
              <div style={{ marginTop: 16 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>{t('settings.timezone')}</label>
                <select value={timezone} onChange={e => saveSetting("timezone", e.target.value, setTimezone)} style={{ ...sInput, maxWidth: 320 }}>
                  {TIMEZONES.map(tz => <option key={tz} value={tz}>{tz.replace("_", " ")}</option>)}
                </select>
              </div>
            </div>

            {/* ── Format date & heure ────────────────────────── */}
            <div style={sSection}>
              <h2 style={sSectionTitle}><Calendar size={18} color={C.amber} /> {t('settings.date_time')}</h2>
              <p style={sSectionDesc}>{t('settings.date_time_desc')}</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>{t('settings.date_format')}</label>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {[
                      { value: "DD/MM/YYYY", example: "03/04/2026" },
                      { value: "MM/DD/YYYY", example: "04/03/2026" },
                      { value: "YYYY-MM-DD", example: "2026-04-03" },
                      { value: "DD.MM.YYYY", example: "03.04.2026" },
                      { value: "D MMM YYYY", example: "3 avr. 2026" },
                    ].map(f => (
                      <button key={f.value} onClick={() => saveSetting("date_format", f.value, setDateFormat)} style={{
                        padding: "8px 12px", borderRadius: 8, border: `2px solid ${dateFormat === f.value ? C.amber : C.border}`,
                        background: dateFormat === f.value ? C.amberLight : C.white, cursor: "pointer", fontFamily: font, fontSize: 12,
                        color: C.text, display: "flex", alignItems: "center", justifyContent: "space-between", transition: "all .15s",
                      }}>
                        <span style={{ fontWeight: dateFormat === f.value ? 600 : 400 }}>{f.value}</span>
                        <span style={{ color: C.textMuted, fontSize: 11 }}>{f.example}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>{t('settings.time_format')}</label>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {[
                      { value: "24h", example: "14:30" },
                      { value: "12h", example: "2:30 PM" },
                    ].map(f => (
                      <button key={f.value} onClick={() => saveSetting("time_format", f.value, setTimeFormat)} style={{
                        padding: "10px 14px", borderRadius: 8, border: `2px solid ${timeFormat === f.value ? C.amber : C.border}`,
                        background: timeFormat === f.value ? C.amberLight : C.white, cursor: "pointer", fontFamily: font, fontSize: 13,
                        color: C.text, display: "flex", alignItems: "center", justifyContent: "space-between", transition: "all .15s",
                      }}>
                        <span style={{ fontWeight: timeFormat === f.value ? 600 : 400 }}>{f.value === "24h" ? "24 heures" : "12 heures (AM/PM)"}</span>
                        <span style={{ color: C.textMuted }}>{f.example}</span>
                      </button>
                    ))}
                  </div>
                  <div style={{ marginTop: 16, padding: "12px 16px", borderRadius: 10, background: C.bg }}>
                    <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 4 }}>{t('settings.current_preview')}</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>
                      {fmtDateTime(new Date())}
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
          );
  };

  const renderAdmin2FA = () => {
    return (
          <div style={{ flex: 1, padding: "24px 32px", overflow: "auto", maxWidth: 800 }}>
            <h1 style={{ fontSize: 22, fontWeight: 600, margin: "0 0 8px" }}>{t('twofa.heading')}</h1>
            <p style={{ fontSize: 13, color: C.textMuted, margin: "0 0 24px" }}>{t('twofa.subtitle')}</p>

            {/* Info banner */}
            <div style={{ padding: "14px 20px", background: C.blueLight, borderRadius: 10, marginBottom: 24, display: "flex", alignItems: "center", gap: 12, fontSize: 12, color: C.blue }}>
              <ShieldCheck size={18} />
              <span dangerouslySetInnerHTML={{ __html: t('twofa.compatible') }} />
            </div>

            {!twoFASetup && !twoFAEnabled ? (
              <div className="iz-card" style={{ ...sCard, padding: "24px", display: "flex", alignItems: "center", gap: 20 }}>
                <div style={{ width: 56, height: 56, borderRadius: 12, background: C.bg, display: "flex", alignItems: "center", justifyContent: "center" }}><ShieldCheck size={28} color={C.textMuted} /></div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 16, fontWeight: 600, color: C.text, marginBottom: 4 }}>{t('twofa.disabled')}</div>
                  <div style={{ fontSize: 13, color: C.textMuted }}>{t('twofa.disabled_desc')}</div>
                </div>
                <button onClick={async () => {
                  try { const res = await setup2FA(); setTwoFASetup(res); }
                  catch { addToast_admin(t('twofa.init_error')); }
                }} className="iz-btn-pink" style={{ ...sBtn("pink"), whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 6, padding: "12px 24px" }}><ShieldCheck size={16} /> {t('twofa.enable')}</button>
              </div>
            ) : twoFASetup && !twoFAEnabled ? (
              <div className="iz-card" style={{ ...sCard, padding: "28px" }}>
                <div style={{ fontSize: 16, fontWeight: 600, color: C.text, marginBottom: 20 }}>{t('twofa.step1')}</div>
                <div style={{ display: "flex", gap: 32 }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ width: 220, height: 220, background: C.white, borderRadius: 16, border: `2px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                      <img src={`data:image/svg+xml;base64,${twoFASetup.qr_code_svg}`} alt="QR Code" style={{ width: 200, height: 200 }} />
                    </div>
                    <div style={{ fontSize: 11, color: C.textMuted, marginTop: 10 }}>{t('twofa.scan_hint')}</div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, color: C.textLight, marginBottom: 8 }}>{t('twofa.manual_key')}</div>
                    <div style={{ padding: "10px 14px", background: C.bg, borderRadius: 10, fontFamily: "monospace", fontSize: 14, fontWeight: 600, letterSpacing: 3, marginBottom: 24, wordBreak: "break-all", color: C.text, userSelect: "all" as const }}>{twoFASetup.secret}</div>
                    <div style={{ fontSize: 16, fontWeight: 600, color: C.text, marginBottom: 12 }}>{t('twofa.step2')}</div>
                    <div style={{ marginBottom: 16 }}>
                      <input type="text" inputMode="numeric" pattern="[0-9]*" maxLength={6} value={twoFAConfirmCode} onChange={e => setTwoFAConfirmCode(e.target.value.replace(/\D/g, ""))}
                        placeholder="000000" autoFocus style={{ ...sInput, textAlign: "center", fontSize: 24, fontWeight: 700, letterSpacing: 10, padding: "14px" }} />
                    </div>
                    <div style={{ display: "flex", gap: 10 }}>
                      <button onClick={() => { setTwoFASetup(null); setTwoFAConfirmCode(""); }} className="iz-btn-outline" style={{ ...sBtn("outline"), padding: "10px 20px" }}>{t('common.cancel')}</button>
                      <button disabled={twoFAConfirmCode.length !== 6} onClick={async () => {
                        try {
                          const res = await confirm2FA(twoFAConfirmCode);
                          setTwoFAEnabled(true); setTwoFARecoveryCodes(res.recovery_codes);
                          setTwoFASetup(null); setTwoFAConfirmCode("");
                          addToast_admin(t('twofa.success'));
                        } catch { addToast_admin(t('twofa.invalid_code')); }
                      }} className="iz-btn-pink" style={{ ...sBtn("pink"), padding: "10px 24px", opacity: twoFAConfirmCode.length !== 6 ? 0.5 : 1 }}>{t('twofa.enable')}</button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div className="iz-card" style={{ ...sCard, padding: "24px", display: "flex", alignItems: "center", gap: 20 }}>
                  <div style={{ width: 56, height: 56, borderRadius: 12, background: C.greenLight, display: "flex", alignItems: "center", justifyContent: "center" }}><ShieldCheck size={28} color={C.green} /></div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 16, fontWeight: 600, color: C.green, marginBottom: 4 }}>{t('twofa.enabled')}</div>
                    <div style={{ fontSize: 13, color: C.textMuted }}>{t('twofa.enabled_desc')}</div>
                  </div>
                  <button onClick={() => showPrompt(t('twofa.disable_prompt'), async (code) => {
                    try { await disable2FA(code); setTwoFAEnabled(false); setTwoFARecoveryCodes([]); addToast_admin(t('twofa.disabled_toast')); }
                    catch { addToast_admin(t('twofa.invalid_code')); }
                  }, { label: t('twofa.code_label'), type: "text" })} style={{ ...sBtn("outline"), color: C.red, borderColor: C.red, whiteSpace: "nowrap", padding: "10px 20px" }}>{t('misc.disable')}</button>
                </div>

                {/* Recovery codes */}
                <div className="iz-card" style={{ ...sCard, padding: "24px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 600, color: C.text, marginBottom: 2 }}>{t('twofa.recovery_codes')}</div>
                      <div style={{ fontSize: 12, color: C.textMuted }}>{t('twofa.recovery_desc')}</div>
                    </div>
                    <button onClick={() => showPrompt(t('twofa.regenerate_prompt'), async (code) => {
                      try { const res = await regenerate2FARecoveryCodes(code); setTwoFARecoveryCodes(res.recovery_codes); addToast_admin(t('twofa.codes_regenerated')); }
                      catch { addToast_admin(t('twofa.invalid_code')); }
                    }, { label: t('twofa.code_label'), type: "text" })} className="iz-btn-outline" style={{ ...sBtn("outline"), fontSize: 11, whiteSpace: "nowrap" }}>{t('twofa.regenerate')}</button>
                  </div>
                  {twoFARecoveryCodes.length > 0 ? (
                    <>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8, marginBottom: 14 }}>
                        {twoFARecoveryCodes.map((code, i) => (
                          <div key={i} style={{ padding: "8px 12px", background: C.bg, borderRadius: 8, fontFamily: "monospace", fontSize: 13, fontWeight: 600, textAlign: "center", color: C.text }}>{code}</div>
                        ))}
                      </div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={() => { navigator.clipboard.writeText(twoFARecoveryCodes.join("\n")); addToast_admin(t('twofa.codes_copied')); }} className="iz-btn-outline" style={{ ...sBtn("outline"), fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}><Download size={12} /> {t('twofa.copy_codes')}</button>
                      </div>
                    </>
                  ) : (
                    <div style={{ padding: "20px", textAlign: "center", color: C.textMuted, fontSize: 13 }}>{t('twofa.no_codes')}</div>
                  )}
                </div>
              </div>
            )}
          </div>
    );
  };

  const renderAdminEquipements = () => {
          const EQUIP_ICON_MAP: Record<string, any> = { laptop: Laptop, monitor: Monitor, phone: Phone, key: KeyRound, headphones: Headphones, mouse: Mouse, armchair: Armchair, car: Car, package: Package };
          const ETAT_META: Record<string, { label: string; color: string; bg: string }> = {
            disponible: { label: t('equip.state_available'), color: C.green, bg: C.greenLight },
            attribue: { label: t('equip.state_assigned'), color: C.blue, bg: C.blueLight },
            en_commande: { label: t('equip.state_ordered'), color: C.amber, bg: C.amberLight },
            en_reparation: { label: t('equip.state_repair'), color: "#7B5EA7", bg: C.purple + "15" },
            retire: { label: t('equip.state_retired'), color: C.textMuted, bg: C.bg },
          };
          const reloadEquip = () => { getEquipments().then(setEquipments).catch(() => {}); getEquipmentStats().then(setEquipStats).catch(() => {}); getEquipmentTypes().then(setEquipTypes).catch(() => {}); };
          const filtered = equipFilter === "all" ? equipments : equipments.filter(e => e.etat === equipFilter);
          return (
          <div style={{ flex: 1, padding: "24px 32px", overflow: "auto" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <div>
                <h1 style={{ fontSize: 22, fontWeight: 600, margin: 0 }}>{t('equip.title')}</h1>
                <p style={{ fontSize: 12, color: C.textLight, margin: "4px 0 0" }}>{t('equip.desc')}</p>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {equipTab === "inventaire" && <button onClick={() => { resetTr(); setEquipPanel({ mode: "create", data: { equipment_type_id: equipTypes[0]?.id || "", nom: "", numero_serie: "", marque: "", modele: "", etat: "disponible", date_achat: "", valeur: "", notes: "" } }); }} className="iz-btn-pink" style={{ ...sBtn("pink"), display: "flex", alignItems: "center", gap: 6 }}><Plus size={14} /> {t('equip.add')}</button>}
                {equipTab === "packages" && <button onClick={() => { resetTr(); setPkgPanel({ mode: "create", data: { nom: "", description: "", icon: "package", couleur: "#C2185B", items: [{ equipment_type_id: equipTypes[0]?.id || "", quantite: 1, notes: "" }] } }); }} className="iz-btn-pink" style={{ ...sBtn("pink"), display: "flex", alignItems: "center", gap: 6 }}><Plus size={14} /> {t('equip.new_package')}</button>}
                {equipTab === "types" && <button onClick={() => {
                  showPrompt(t('equip.type_prompt'), (nom) => {
                    if (!nom) return;
                    showPrompt(t('equip.cat_prompt'), async (cat) => {
                      try { await apiCreateEquipType({ nom, categorie: cat === "licence" ? "licence" : "materiel", icon: cat === "licence" ? "key" : "package" }); reloadEquip(); addToast_admin(t('equip.type_created')); } catch { addToast_admin(t('toast.error')); }
                    }, { label: t('equip.cat_label'), defaultValue: "materiel" });
                  });
                }} className="iz-btn-pink" style={{ ...sBtn("pink"), display: "flex", alignItems: "center", gap: 6 }}><Plus size={14} /> {t('equip.new_type')}</button>}
              </div>
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", gap: 0, borderBottom: `2px solid ${C.border}`, marginBottom: 16 }}>
              {([
                { id: "inventaire" as const, label: t('equip.inventory'), count: equipments.length },
                { id: "packages" as const, label: t('equip.packages'), count: equipPackages.length },
                { id: "types" as const, label: t('equip.types'), count: equipTypes.length },
              ]).map(tab => (
                <button key={tab.id} onClick={() => setEquipTab(tab.id)} style={{ padding: "10px 20px", fontSize: 13, fontWeight: equipTab === tab.id ? 600 : 400, color: equipTab === tab.id ? C.pink : C.textLight, background: "none", border: "none", borderBottom: equipTab === tab.id ? `2px solid ${C.pink}` : "2px solid transparent", cursor: "pointer", fontFamily: font, marginBottom: -2, display: "flex", alignItems: "center", gap: 6 }}>
                  {tab.label} <span style={{ fontSize: 10, padding: "1px 6px", borderRadius: 8, background: equipTab === tab.id ? C.pinkBg : C.bg, color: equipTab === tab.id ? C.pink : C.textMuted }}>{tab.count}</span>
                </button>
              ))}
            </div>

            {equipTab === "inventaire" && (<>

            {/* Stats */}
            {equipStats && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, marginBottom: 20 }}>
                {[
                  { label: t('equip.total'), value: equipStats.total, icon: Boxes, color: C.text, bg: C.bg },
                  { label: t('equip.available'), value: equipStats.disponible, icon: CheckCircle, color: C.green, bg: C.greenLight },
                  { label: t('equip.assigned'), value: equipStats.attribue, icon: UserCheck, color: C.blue, bg: C.blueLight },
                  { label: t('equip.on_order'), value: equipStats.enCommande, icon: Clock, color: C.amber, bg: C.amberLight },
                  { label: t('equip.total_value'), value: fmtCurrency(equipStats.valeurTotale), icon: Banknote, color: C.pink, bg: C.pinkBg },
                ].map((s, i) => (
                  <div key={i} className="iz-card" style={{ ...sCard, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center" }}><s.icon size={16} color={s.color} /></div>
                    <div><div style={{ fontSize: 18, fontWeight: 700, color: s.color }}>{s.value}</div><div style={{ fontSize: 10, color: C.textMuted }}>{s.label}</div></div>
                  </div>
                ))}
              </div>
            )}

            {/* Filter */}
            <div style={{ display: "flex", gap: 4, padding: 3, background: C.bg, borderRadius: 8, marginBottom: 16, width: "fit-content" }}>
              {[["all", t('equip.all')], ["disponible", t('equip.available')], ["attribue", t('equip.assigned')], ["en_commande", t('equip.on_order')], ["en_reparation", t('equip.in_repair')], ["retire", t('equip.retired')]].map(([key, label]) => (
                <button key={key} onClick={() => setEquipFilter(key)} style={{ padding: "6px 14px", borderRadius: 6, fontSize: 11, fontWeight: equipFilter === key ? 600 : 400, border: "none", cursor: "pointer", fontFamily: font, background: equipFilter === key ? C.pink : "transparent", color: equipFilter === key ? C.white : C.textMuted, transition: "all .15s" }}>{label}</button>
              ))}
            </div>

            {/* Table */}
            <div className="iz-card" style={{ ...sCard, padding: 0, overflow: "hidden" }}>
              <div style={{ display: "grid", gridTemplateColumns: "0.3fr 1.5fr 1fr 0.8fr 1fr 0.8fr 0.5fr", gap: 0, padding: "10px 16px", background: C.bg, borderBottom: `1px solid ${C.border}`, fontSize: 11, fontWeight: 600, color: C.textLight, textTransform: "uppercase" }}>
                <span></span><span>{t('equip.equipment')}</span><span>{t('equip.type')}</span><span>{t('equip.status')}</span><span>{t('equip.assigned_to')}</span><span>{t('equip.serial')}</span><span></span>
              </div>
              {filtered.length === 0 && <div style={{ padding: "40px 20px", textAlign: "center", color: C.textMuted, fontSize: 13 }}>{t('equip.none_found')}</div>}
              {filtered.map(eq => {
                const meta = ETAT_META[eq.etat] || ETAT_META.disponible;
                const TypeIcon = EQUIP_ICON_MAP[eq.type?.icon || "package"] || Package;
                return (
                  <div key={eq.id} className="iz-sidebar-item" style={{ display: "grid", gridTemplateColumns: "0.3fr 1.5fr 1fr 0.8fr 1fr 0.8fr 0.5fr", gap: 0, padding: "12px 16px", borderBottom: `1px solid ${C.border}`, alignItems: "center", fontSize: 13 }}>
                    <div><div style={{ width: 32, height: 32, borderRadius: 8, background: C.bg, display: "flex", alignItems: "center", justifyContent: "center" }}><TypeIcon size={16} color={C.textMuted} /></div></div>
                    <div>
                      <div style={{ fontWeight: 500 }}>{eq.nom}</div>
                      {eq.marque && <div style={{ fontSize: 11, color: C.textMuted }}>{eq.marque} {eq.modele || ""}</div>}
                    </div>
                    <div style={{ fontSize: 12, color: C.textLight }}>{eq.type?.nom || "—"}</div>
                    <span style={{ padding: "3px 10px", borderRadius: 6, fontSize: 10, fontWeight: 600, background: meta.bg, color: meta.color, justifySelf: "start" }}>{meta.label}</span>
                    <div>
                      {eq.collaborateur ? (
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 500 }}>{eq.collaborateur.prenom} {eq.collaborateur.nom}</div>
                          <div style={{ fontSize: 10, color: C.textMuted }}>{eq.assigned_at ? fmtDate(eq.assigned_at) : ""}</div>
                        </div>
                      ) : <span style={{ color: C.textMuted }}>—</span>}
                    </div>
                    <div style={{ fontSize: 11, color: C.textMuted, fontFamily: "monospace" }}>{eq.numero_serie || "—"}</div>
                    <div style={{ display: "flex", gap: 4 }}>
                      {eq.etat === "disponible" && (
                        <button onClick={() => {
                          showPrompt(t('equip.assign_prompt'), (collabId) => {
                            if (collabId) apiAssignEquip(eq.id, Number(collabId)).then(reloadEquip).catch(() => addToast_admin(t('toast.error')));
                          }, { options: COLLABORATEURS.map(c => ({ value: String(c.id), label: `${c.prenom} ${c.nom} — ${c.poste || c.departement || ""}` })), searchable: true });
                        }} title={t('equip.assign')} style={{ background: C.blueLight, border: "none", borderRadius: 6, padding: 4, cursor: "pointer" }}><UserPlus size={12} color={C.blue} /></button>
                      )}
                      {eq.etat === "attribue" && (
                        <button onClick={() => apiUnassignEquip(eq.id).then(reloadEquip).catch(() => addToast_admin(t('toast.error')))} title="Restituer" style={{ background: C.amberLight, border: "none", borderRadius: 6, padding: 4, cursor: "pointer" }}><RotateCcw size={12} color={C.amber} /></button>
                      )}
                      <button onClick={() => { setContentTranslations((eq as any).translations || {}); setEquipPanel({ mode: "edit", data: { ...eq, equipment_type_id: eq.equipment_type_id } }); }} title="Modifier" style={{ background: C.bg, border: "none", borderRadius: 6, padding: 4, cursor: "pointer" }}><FilePen size={12} color={C.textMuted} /></button>
                      <button onClick={() => showConfirm(`Supprimer "${eq.nom}" ?`, async () => { try { await apiDeleteEquip(eq.id); reloadEquip(); addToast_admin(t('toast.deleted')); } catch {} })} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}><Trash size={12} color={C.red} /></button>
                    </div>
                  </div>
                );
              })}
            </div>

            </>)}

            {/* ═══ TAB: Packages ═══ */}
            {equipTab === "packages" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {equipPackages.map(pkg => (
                  <div key={pkg.id} className="iz-card" style={{ ...sCard, padding: 0, overflow: "hidden", opacity: pkg.actif ? 1 : 0.5 }}>
                    <div style={{ padding: "16px 20px", borderBottom: `1px solid ${C.border}` }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 40, height: 40, borderRadius: 10, background: pkg.couleur + "20", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Package size={18} color={pkg.couleur} />
                          </div>
                          <div>
                            <h3 style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>{pkg.nom}</h3>
                            {pkg.description && <div style={{ fontSize: 11, color: C.textMuted }}>{pkg.description}</div>}
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: 4 }}>
                          <button onClick={() => { setContentTranslations((pkg as any).translations || {}); setPkgPanel({ mode: "edit", data: { ...pkg, items: pkg.items.map(i => ({ equipment_type_id: i.equipment_type_id, quantite: i.quantite, notes: i.notes || "" })) } }); }} style={{ background: C.bg, border: "none", borderRadius: 6, padding: 4, cursor: "pointer" }}><FilePen size={12} color={C.textMuted} /></button>
                          <button onClick={() => showConfirm(`Supprimer le package "${pkg.nom}" ?`, async () => { try { await apiDeletePkg(pkg.id); reloadEquip(); addToast_admin("Package supprimé"); } catch {} })} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}><Trash size={12} color={C.red} /></button>
                        </div>
                      </div>
                    </div>
                    <div style={{ padding: "12px 20px" }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: C.textMuted, textTransform: "uppercase", marginBottom: 8 }}>{t('equip.content')} ({pkg.items.length} {t('equip.elements')})</div>
                      {pkg.items.map((item, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 0", fontSize: 12 }}>
                          <span style={{ padding: "2px 6px", borderRadius: 4, fontSize: 9, fontWeight: 600, background: item.type?.categorie === "licence" ? C.blueLight : C.bg, color: item.type?.categorie === "licence" ? C.blue : C.textMuted }}>{item.type?.categorie === "licence" ? t('equip.licence') : t('equip.hardware')}</span>
                          <span style={{ fontWeight: 500, color: C.text }}>{item.type?.nom || "?"}</span>
                          {item.quantite > 1 && <span style={{ color: C.textMuted }}>×{item.quantite}</span>}
                          {item.notes && <span style={{ color: C.textLight, fontSize: 10 }}>({item.notes})</span>}
                        </div>
                      ))}
                    </div>
                    <div style={{ padding: "10px 20px", borderTop: `1px solid ${C.border}`, background: C.bg }}>
                      <button onClick={() => {
                        showPrompt(t('equip.provision_prompt'), async (collabId) => {
                          if (!collabId) return;
                          try { const res = await apiProvisionPkg(pkg.id, Number(collabId)); reloadEquip(); addToast_admin(res.message); } catch { addToast_admin(t('toast.error')); }
                        }, { options: COLLABORATEURS.map(c => ({ value: String(c.id), label: `${c.prenom} ${c.nom} — ${c.poste || c.departement || ""}` })), searchable: true });
                      }} className="iz-btn-outline" style={{ ...sBtn("outline"), fontSize: 11, padding: "5px 14px", display: "flex", alignItems: "center", gap: 4 }}><UserPlus size={12} /> {t('equip.provision')}</button>
                    </div>
                  </div>
                ))}
                {equipPackages.length === 0 && <div style={{ gridColumn: "1/-1", padding: "40px 20px", textAlign: "center", color: C.textMuted, fontSize: 13 }}>{t('equip.no_package')}</div>}
              </div>
            )}

            {/* ═══ TAB: Types & Licences ═══ */}
            {equipTab === "types" && (
              <div>
                {[{ cat: "materiel", label: t('equip.hardware_section'), color: C.text }, { cat: "licence", label: t('equip.licence_section'), color: C.blue }].map(section => {
                  const types = equipTypes.filter(t => (t as any).categorie === section.cat || (!( t as any).categorie && section.cat === "materiel"));
                  return (
                    <div key={section.cat} style={{ marginBottom: 24 }}>
                      <h2 style={{ fontSize: 15, fontWeight: 600, color: section.color, marginBottom: 12 }}>{section.label} ({types.length})</h2>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
                        {types.map(et => {
                          const TypeIcon = EQUIP_ICON_MAP[et.icon] || Package;
                          return (
                            <div key={et.id} className="iz-card" style={{ ...sCard, textAlign: "center", padding: "16px", opacity: et.actif ? 1 : 0.4 }}>
                              <div style={{ width: 44, height: 44, borderRadius: 12, background: section.cat === "licence" ? C.blueLight : C.bg, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px" }}>
                                <TypeIcon size={20} color={section.cat === "licence" ? C.blue : C.textMuted} />
                              </div>
                              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{et.nom}</div>
                              <div style={{ fontSize: 10, color: C.textMuted, marginBottom: 6 }}>{et.description || "—"}</div>
                              {et.equipments_count !== undefined && <div style={{ fontSize: 10, color: C.textMuted }}>{et.equipments_count} {t('equip.in_inventory')}</div>}
                              <div style={{ display: "flex", gap: 4, justifyContent: "center", marginTop: 8 }}>
                                <button onClick={() => showConfirm(`${t('common.delete')} "${et.nom}" ?`, async () => { try { await apiDeleteEquipType(et.id); reloadEquip(); addToast_admin(t('toast.deleted')); } catch { addToast_admin(t('toast.error')); } })} style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}><Trash size={11} color={C.red} /></button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Equipment Create/Edit Panel */}
            {equipPanel.mode !== "closed" && (<>
              <div onClick={() => setEquipPanel({ mode: "closed", data: {} })} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.3)", zIndex: 1000 }} />
              <div className="iz-panel" style={{ position: "fixed", top: 0, right: 0, width: 480, height: "100vh", background: C.white, boxShadow: "-4px 0 24px rgba(0,0,0,.1)", zIndex: 1001, display: "flex", flexDirection: "column" }}>
                <div style={{ padding: "20px 24px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>{equipPanel.mode === "create" ? t('equip.add') : t('common.edit')}</h2>
                  <button onClick={() => setEquipPanel({ mode: "closed", data: {} })} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={18} /></button>
                </div>
                <div style={{ flex: 1, padding: 24, overflow: "auto", display: "flex", flexDirection: "column", gap: 14 }}>
                  <div><label style={{ fontSize: 11, color: C.textLight, display: "block", marginBottom: 4 }}>Type *</label>
                    <select value={equipPanel.data.equipment_type_id || ""} onChange={e => setEquipPanel(p => ({ ...p, data: { ...p.data, equipment_type_id: Number(e.target.value) } }))} style={sInput}>
                      {equipTypes.map(t => <option key={t.id} value={t.id}>{t.nom}</option>)}
                    </select>
                  </div>
                  <div><label style={{ fontSize: 11, color: C.textLight, display: "block", marginBottom: 4 }}>{t('equip.name_label')} *</label>
                    <TranslatableField value={equipPanel.data.nom || ""} onChange={v => setEquipPanel(p => ({ ...p, data: { ...p.data, nom: v } }))} currentLang={lang} activeLangs={activeLanguages} translations={contentTranslations.nom} onTranslationsChange={tr => setTr("nom", tr)} style={sInput} placeholder="Ex: MacBook Pro 14 pouces" />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div><label style={{ fontSize: 11, color: C.textLight, display: "block", marginBottom: 4 }}>{t('equip.brand')}</label>
                      <input value={equipPanel.data.marque || ""} onChange={e => setEquipPanel(p => ({ ...p, data: { ...p.data, marque: e.target.value } }))} style={sInput} placeholder="Apple" /></div>
                    <div><label style={{ fontSize: 11, color: C.textLight, display: "block", marginBottom: 4 }}>{t('equip.model')}</label>
                      <input value={equipPanel.data.modele || ""} onChange={e => setEquipPanel(p => ({ ...p, data: { ...p.data, modele: e.target.value } }))} style={sInput} placeholder="M3 Pro" /></div>
                  </div>
                  <div><label style={{ fontSize: 11, color: C.textLight, display: "block", marginBottom: 4 }}>{t('equip.serial_number')}</label>
                    <input value={equipPanel.data.numero_serie || ""} onChange={e => setEquipPanel(p => ({ ...p, data: { ...p.data, numero_serie: e.target.value } }))} style={sInput} placeholder="SN-XXXXX" /></div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div><label style={{ fontSize: 11, color: C.textLight, display: "block", marginBottom: 4 }}>{t('equip.state')}</label>
                      <select value={equipPanel.data.etat || "disponible"} onChange={e => setEquipPanel(p => ({ ...p, data: { ...p.data, etat: e.target.value } }))} style={sInput}>
                        {Object.entries(ETAT_META).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                      </select></div>
                    <div><label style={{ fontSize: 11, color: C.textLight, display: "block", marginBottom: 4 }}>{t('equip.purchase_date')}</label>
                      <input type="date" value={equipPanel.data.date_achat || ""} onChange={e => setEquipPanel(p => ({ ...p, data: { ...p.data, date_achat: e.target.value } }))} style={sInput} /></div>
                  </div>
                  <div><label style={{ fontSize: 11, color: C.textLight, display: "block", marginBottom: 4 }}>{t('equip.value')}</label>
                    <input type="number" value={equipPanel.data.valeur || ""} onChange={e => setEquipPanel(p => ({ ...p, data: { ...p.data, valeur: e.target.value } }))} style={sInput} placeholder="0.00" /></div>
                  <div><label style={{ fontSize: 11, color: C.textLight, display: "block", marginBottom: 4 }}>{t('equip.notes')}</label>
                    <textarea value={equipPanel.data.notes || ""} onChange={e => setEquipPanel(p => ({ ...p, data: { ...p.data, notes: e.target.value } }))} style={{ ...sInput, minHeight: 60, resize: "vertical" }} /></div>
                </div>
                <div style={{ padding: "16px 24px", borderTop: `1px solid ${C.border}`, display: "flex", gap: 8, justifyContent: "flex-end" }}>
                  {equipPanel.mode === "edit" && equipPanel.data.id && (
                    <button onClick={() => showConfirm(t('equip.delete_confirm'), async () => { try { await apiDeleteEquip(equipPanel.data.id); reloadEquip(); setEquipPanel({ mode: "closed", data: {} }); addToast_admin(t('toast.deleted')); } catch {} })} style={{ ...sBtn("outline"), color: C.red, borderColor: C.red, marginRight: "auto" }}>{t('common.delete')}</button>
                  )}
                  <button onClick={() => setEquipPanel({ mode: "closed", data: {} })} className="iz-btn-outline" style={sBtn("outline")}>{t('common.cancel')}</button>
                  <button onClick={async () => {
                    if (!equipPanel.data.nom?.trim()) { addToast_admin(t('equip.name_required')); return; }
                    try {
                      const payload = { equipment_type_id: equipPanel.data.equipment_type_id, nom: equipPanel.data.nom, numero_serie: equipPanel.data.numero_serie || null, marque: equipPanel.data.marque || null, modele: equipPanel.data.modele || null, etat: equipPanel.data.etat || "disponible", date_achat: equipPanel.data.date_achat || null, valeur: equipPanel.data.valeur ? Number(equipPanel.data.valeur) : null, notes: equipPanel.data.notes || null, translations: buildTranslationsPayload() };
                      if (equipPanel.mode === "edit" && equipPanel.data.id) await apiUpdateEquip(equipPanel.data.id, payload);
                      else await apiCreateEquip(payload);
                      reloadEquip(); setEquipPanel({ mode: "closed", data: {} }); addToast_admin(equipPanel.mode === "create" ? t('equip.added') : t('equip.updated'));
                    } catch { addToast_admin(t('toast.error')); }
                  }} className="iz-btn-pink" style={sBtn("pink")}>{equipPanel.mode === "create" ? t('equip.add_btn') : t('common.save')}</button>
                </div>
              </div>
            </>)}
            {/* Package Create/Edit Panel */}
            {pkgPanel.mode !== "closed" && (<>
              <div onClick={() => setPkgPanel({ mode: "closed", data: {} })} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.3)", zIndex: 1000 }} />
              <div className="iz-panel" style={{ position: "fixed", top: 0, right: 0, width: 520, height: "100vh", background: C.white, boxShadow: "-4px 0 24px rgba(0,0,0,.1)", zIndex: 1001, display: "flex", flexDirection: "column" }}>
                <div style={{ padding: "20px 24px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>{pkgPanel.mode === "create" ? "Nouveau package" : "Modifier le package"}</h2>
                  <button onClick={() => setPkgPanel({ mode: "closed", data: {} })} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={18} /></button>
                </div>
                <div style={{ flex: 1, padding: 24, overflow: "auto", display: "flex", flexDirection: "column", gap: 14 }}>
                  <div><label style={{ fontSize: 11, color: C.textLight, display: "block", marginBottom: 4 }}>Nom du package *</label>
                    <TranslatableField value={pkgPanel.data.nom || ""} onChange={v => setPkgPanel(p => ({ ...p, data: { ...p.data, nom: v } }))} currentLang={lang} activeLangs={activeLanguages} translations={contentTranslations.nom} onTranslationsChange={tr => setTr("nom", tr)} style={sInput} placeholder="Ex: Package IT Développeur" /></div>
                  <div><label style={{ fontSize: 11, color: C.textLight, display: "block", marginBottom: 4 }}>Description</label>
                    <TranslatableField multiline rows={3} value={pkgPanel.data.description || ""} onChange={v => setPkgPanel(p => ({ ...p, data: { ...p.data, description: v } }))} currentLang={lang} activeLangs={activeLanguages} translations={contentTranslations.description} onTranslationsChange={tr => setTr("description", tr)} style={{ ...sInput, minHeight: 50, resize: "vertical" }} /></div>

                  <div style={{ fontSize: 13, fontWeight: 600, color: C.pink, marginTop: 4 }}>Contenu du package</div>
                  {(pkgPanel.data.items || []).map((item: any, i: number) => (
                    <div key={i} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <select value={item.equipment_type_id || ""} onChange={e => { const arr = [...(pkgPanel.data.items || [])]; arr[i] = { ...arr[i], equipment_type_id: Number(e.target.value) }; setPkgPanel(p => ({ ...p, data: { ...p.data, items: arr } })); }} style={{ ...sInput, flex: 2, fontSize: 12 }}>
                        <option value="">— Type —</option>
                        <optgroup label="Matériel">{equipTypes.filter(t => (t as any).categorie !== "licence").map(t => <option key={t.id} value={t.id}>{t.nom}</option>)}</optgroup>
                        <optgroup label="Licences">{equipTypes.filter(t => (t as any).categorie === "licence").map(t => <option key={t.id} value={t.id}>{t.nom}</option>)}</optgroup>
                      </select>
                      <input type="number" min={1} value={item.quantite || 1} onChange={e => { const arr = [...(pkgPanel.data.items || [])]; arr[i] = { ...arr[i], quantite: Number(e.target.value) }; setPkgPanel(p => ({ ...p, data: { ...p.data, items: arr } })); }} style={{ ...sInput, width: 50, fontSize: 12, textAlign: "center" }} />
                      <input value={item.notes || ""} onChange={e => { const arr = [...(pkgPanel.data.items || [])]; arr[i] = { ...arr[i], notes: e.target.value }; setPkgPanel(p => ({ ...p, data: { ...p.data, items: arr } })); }} style={{ ...sInput, flex: 1, fontSize: 11 }} placeholder="Notes" />
                      <button onClick={() => { const arr = (pkgPanel.data.items || []).filter((_: any, j: number) => j !== i); setPkgPanel(p => ({ ...p, data: { ...p.data, items: arr } })); }} style={{ background: "none", border: "none", cursor: "pointer", color: C.red, padding: 2 }}><X size={14} /></button>
                    </div>
                  ))}
                  <button onClick={() => setPkgPanel(p => ({ ...p, data: { ...p.data, items: [...(p.data.items || []), { equipment_type_id: "", quantite: 1, notes: "" }] } }))} style={{ fontSize: 11, color: C.pink, background: "none", border: "none", cursor: "pointer", fontWeight: 600, fontFamily: font, padding: "4px 0", textAlign: "left" }}>+ Ajouter un élément</button>
                </div>
                <div style={{ padding: "16px 24px", borderTop: `1px solid ${C.border}`, display: "flex", gap: 8, justifyContent: "flex-end" }}>
                  <button onClick={() => setPkgPanel({ mode: "closed", data: {} })} className="iz-btn-outline" style={sBtn("outline")}>{t('common.cancel')}</button>
                  <button onClick={async () => {
                    if (!pkgPanel.data.nom?.trim()) { addToast_admin("Le nom est requis"); return; }
                    const validItems = (pkgPanel.data.items || []).filter((i: any) => i.equipment_type_id);
                    if (validItems.length === 0) { addToast_admin("Ajoutez au moins un élément"); return; }
                    try {
                      const payload = { nom: pkgPanel.data.nom, description: pkgPanel.data.description || null, icon: pkgPanel.data.icon || "package", couleur: pkgPanel.data.couleur || "#C2185B", items: validItems, translations: buildTranslationsPayload() };
                      if (pkgPanel.mode === "edit" && pkgPanel.data.id) await apiUpdatePkg(pkgPanel.data.id, payload);
                      else await apiCreatePkg(payload);
                      reloadEquip(); setPkgPanel({ mode: "closed", data: {} }); addToast_admin(pkgPanel.mode === "create" ? "Package créé" : "Package modifié");
                    } catch { addToast_admin(t('toast.error')); }
                  }} className="iz-btn-pink" style={sBtn("pink")}>{pkgPanel.mode === "create" ? t('common.create') : t('common.save')}</button>
                </div>
              </div>
            </>)}
          </div>
          );
  };

  const renderAdminDonnees = () => {
          const downloadBlob = (blob: Blob, filename: string) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a"); a.href = url; a.download = filename; a.click();
            URL.revokeObjectURL(url);
          };
          return (
          <div style={{ flex: 1, padding: "24px 32px", overflow: "auto", maxWidth: 800 }}>
            <h1 style={{ fontSize: 22, fontWeight: 600, margin: "0 0 8px" }}>{t('data.title')}</h1>
            <p style={{ fontSize: 13, color: C.textMuted, margin: "0 0 24px" }}>{t('data.subtitle')}</p>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Demo mode toggle */}
              <div className="iz-card" style={{ ...sCard, padding: "20px 24px", display: "flex", alignItems: "center", gap: 16, border: demoMode ? `2px solid ${C.amber}` : `1px solid ${C.border}` }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: demoMode ? C.amberLight : C.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Boxes size={20} color={demoMode ? C.amber : C.textMuted} /></div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 2 }}>Mode démonstration</div>
                  <div style={{ fontSize: 12, color: C.textMuted }}>
                    {demoMode
                      ? "Activé — Des collaborateurs et données fictives sont affichés pour la démonstration."
                      : "Désactivé — Seules les vraies données sont affichées."}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  {demoMode && (
                    <button onClick={() => showConfirm("Supprimer toutes les données de démo ? Les collaborateurs fictifs, messages et notifications seront supprimés. La configuration (parcours, actions, documents) sera conservée.", async () => {
                      try {
                        await purgeDemoCollaborateurs();
                        await updateCompanySettings({ demo_mode: "false" });
                        setDemoMode(false); localStorage.setItem("illizeo_demo_mode", "false");
                        refetchCollaborateurs();
                        addToast_admin("Données de démo supprimées");
                      } catch { addToast_admin("Erreur"); }
                    })} style={{ ...sBtn("outline"), whiteSpace: "nowrap", color: C.red, borderColor: C.red, fontSize: 12, display: "flex", alignItems: "center", gap: 4 }}><Trash size={12} /> Purger les données démo</button>
                  )}
                  <div onClick={async () => {
                    const newVal = !demoMode;
                    setDemoMode(newVal); localStorage.setItem("illizeo_demo_mode", String(newVal));
                    await updateCompanySettings({ demo_mode: String(newVal) }).catch(() => {});
                    addToast_admin(newVal ? "Mode démo activé" : "Mode démo désactivé");
                  }} style={{ width: 44, height: 24, borderRadius: 12, background: demoMode ? C.amber : C.border, cursor: "pointer", position: "relative", transition: "all .2s" }}>
                    <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#fff", position: "absolute", top: 2, left: demoMode ? 22 : 2, transition: "all .2s", boxShadow: "0 1px 3px rgba(0,0,0,.2)" }} />
                  </div>
                </div>
              </div>

              <div style={{ height: 1, background: C.border, margin: "4px 0" }} />

              {/* Export all */}
              <div className="iz-card" style={{ ...sCard, padding: "20px 24px", display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: C.blueLight, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Download size={20} color={C.blue} /></div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 2 }}>{t('data.export_all')}</div>
                  <div style={{ fontSize: 12, color: C.textMuted }}>{t('data.export_all_desc')}</div>
                </div>
                <button onClick={async () => {
                  addToast_admin(t('data.exporting'));
                  try { const blob = await exportAllData(); downloadBlob(blob, `illizeo-export-${new Date().toISOString().slice(0, 10)}.json`); addToast_admin(t('data.exported')); }
                  catch { addToast_admin(t('data.export_error')); }
                }} className="iz-btn-outline" style={{ ...sBtn("outline"), whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 6 }}><Download size={14} /> {t('data.export_json')}</button>
              </div>

              {/* Export collaborateurs */}
              <div className="iz-card" style={{ ...sCard, padding: "20px 24px", display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: C.greenLight, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Users size={20} color={C.green} /></div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 2 }}>{t('data.export_collab')}</div>
                  <div style={{ fontSize: 12, color: C.textMuted }}>{t('data.export_collab_desc')}</div>
                </div>
                <button onClick={async () => {
                  addToast_admin(t('data.exporting'));
                  try { const blob = await exportCollaborateursCSV(); downloadBlob(blob, `collaborateurs-${new Date().toISOString().slice(0, 10)}.csv`); addToast_admin(t('data.exported')); }
                  catch { addToast_admin(t('data.export_error')); }
                }} className="iz-btn-outline" style={{ ...sBtn("outline"), whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 6 }}><Download size={14} /> {t('data.export_csv')}</button>
              </div>

              {/* Export audit log */}
              <div className="iz-card" style={{ ...sCard, padding: "20px 24px", display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: C.purple + "15", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Scroll size={20} color="#7B5EA7" /></div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 2 }}>{t('data.audit_log')}</div>
                  <div style={{ fontSize: 12, color: C.textMuted }}>{t('data.audit_desc')}</div>
                </div>
                <button onClick={async () => {
                  addToast_admin(t('data.audit_exporting'));
                  try { const blob = await exportAuditLog(); downloadBlob(blob, `audit-log-${new Date().toISOString().slice(0, 10)}.json`); addToast_admin(t('data.audit_exported')); }
                  catch { addToast_admin(t('data.export_error')); }
                }} className="iz-btn-outline" style={{ ...sBtn("outline"), whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 6 }}><Download size={14} /> {t('data.export_json')}</button>
              </div>

              <div style={{ height: 1, background: C.border, margin: "8px 0" }} />

              {/* Supprimer un collaborateur */}
              <div className="iz-card" style={{ ...sCard, padding: "20px 24px", display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: C.amberLight, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><UserMinus size={20} color={C.amber} /></div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 2 }}>{t('data.delete_collab')}</div>
                  <div style={{ fontSize: 12, color: C.textMuted }}>{t('data.delete_collab_desc')}</div>
                </div>
                <button onClick={() => showPrompt(t('data.delete_collab_prompt'), (email) => {
                  showConfirm(`${t('data.delete_collab_confirm')} ${email} ?`, async () => {
                    try { await rgpdDeleteCollaborateur(email); addToast_admin(`${t('data.delete_collab_success')} : ${email}`); refetchCollaborateurs(); }
                    catch { addToast_admin(t('data.delete_collab_error')); }
                  });
                }, { label: t('data.delete_collab_email'), type: "email" })} className="iz-btn-outline" style={{ ...sBtn("outline"), whiteSpace: "nowrap", color: C.amber, borderColor: C.amber, display: "flex", alignItems: "center", gap: 6 }}><UserMinus size={14} /> {t('common.delete')}</button>
              </div>

              {/* Supprimer le compte */}
              <div className="iz-card" style={{ ...sCard, padding: "20px 24px", display: "flex", alignItems: "center", gap: 16, border: `1px solid ${C.red}30` }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: C.redLight, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Trash size={20} color={C.red} /></div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: C.red, marginBottom: 2 }}>{t('data.delete_account')}</div>
                  <div style={{ fontSize: 12, color: C.textMuted }}>{t('data.delete_account_desc')}</div>
                </div>
                <button onClick={() => showConfirm(t('data.delete_account_confirm'), async () => {
                  try { await rgpdDeleteAccount(); addToast_admin(t('data.delete_account_success')); }
                  catch { addToast_admin(t('data.request_error')); }
                })} style={{ ...sBtn("outline"), whiteSpace: "nowrap", color: C.red, borderColor: C.red, display: "flex", alignItems: "center", gap: 6 }}><Trash size={14} /> {t('common.delete')}</button>
              </div>
            </div>
          </div>
          );
  };

  const renderAdminProvisioning = () => {
          const entraConnected = (integrations || []).some((i: any) => i.provider === "entra_id" && i.connecte);
          const ROLE_COLORS: Record<string, { label: string; color: string; bg: string }> = {
            super_admin: { label: t('role.super_admin'), color: "#E53935", bg: C.redLight },
            admin: { label: t('role.admin'), color: "#7B5EA7", bg: C.purple + "15" },
            admin_rh: { label: t('role.admin_rh'), color: "#C2185B", bg: C.pinkBg },
            manager: { label: t('role.manager'), color: "#1A73E8", bg: C.blueLight },
            onboardee: { label: t('role.onboardee'), color: "#4CAF50", bg: C.greenLight },
          };
          return (
          <div style={{ flex: 1, padding: "24px 32px", overflow: "auto" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <div>
                <h1 style={{ fontSize: 22, fontWeight: 600, margin: 0 }}>{t('prov.heading')}</h1>
                <p style={{ fontSize: 12, color: C.textLight, margin: "4px 0 0" }}>{t('prov.subtitle')}</p>
              </div>
              <button disabled={syncLoading || !entraConnected} onClick={async () => {
                setSyncLoading(true);
                try {
                  const res = await syncADUsers();
                  addToast_admin(`${t('prov.sync_done')} : ${res.created} ${t('prov.created')}, ${res.updated} ${t('prov.updated')}, ${res.deprovisioned} ${t('prov.deprovisioned')}`);
                  getADGroupMappings().then(setAdMappings);
                } catch { addToast_admin(t('prov.sync_error')); }
                finally { setSyncLoading(false); }
              }} className="iz-btn-pink" style={{ ...sBtn("pink"), display: "flex", alignItems: "center", gap: 6, opacity: !entraConnected ? 0.5 : 1 }}>
                <Download size={16} /> {syncLoading ? t('prov.syncing') : t('prov.sync_now')}
              </button>
            </div>

            {!entraConnected && (
              <div style={{ padding: "20px", background: C.amberLight, borderRadius: 10, marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
                <AlertTriangle size={20} color={C.amber} />
                <div><div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{t('prov.not_connected')}</div><div style={{ fontSize: 12, color: C.textLight }}>{t('prov.not_connected_desc')}</div></div>
              </div>
            )}

            {/* Current mappings */}
            <div className="iz-card" style={{ ...sCard, marginBottom: 20 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, margin: "0 0 12px" }}>{t('prov.active_mappings')}</h3>
              {adMappings.length === 0 ? (
                <div style={{ padding: 16, textAlign: "center", color: C.textMuted, fontSize: 13 }}>{t('prov.no_mappings')}</div>
              ) : adMappings.map((m: any) => {
                const rc = ROLE_COLORS[m.illizeo_role] || ROLE_COLORS.onboardee;
                return (
                  <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: `1px solid ${C.border}` }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: "#0078D415", display: "flex", alignItems: "center", justifyContent: "center" }}><Users size={14} color="#0078D4" /></div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{m.ad_group_name}</div>
                      <div style={{ fontSize: 10, color: C.textMuted, fontFamily: "monospace" }}>{m.ad_group_id}</div>
                    </div>
                    <span style={{ fontSize: 14, color: C.textMuted }}>→</span>
                    <span style={{ padding: "3px 10px", borderRadius: 6, fontSize: 11, fontWeight: 600, background: rc.bg, color: rc.color }}>{rc.label}</span>
                    <div style={{ display: "flex", gap: 4 }}>
                      {m.auto_provision && <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 3, background: C.greenLight, color: C.green }}>{t('prov.auto_create')}</span>}
                      {m.auto_deprovision && <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 3, background: C.redLight, color: C.red }}>{t('prov.auto_remove')}</span>}
                    </div>
                    <button onClick={async () => { await deleteADGroupMapping(m.id); setAdMappings(prev => prev.filter(x => x.id !== m.id)); addToast_admin(t('prov.mapping_deleted')); }} style={{ background: "none", border: "none", cursor: "pointer", color: C.textMuted }}><X size={14} /></button>
                  </div>
                );
              })}
            </div>

            {/* Add mapping */}
            {entraConnected && (
              <div className="iz-card" style={{ ...sCard }}>
                <h3 style={{ fontSize: 15, fontWeight: 600, margin: "0 0 12px" }}>{t('prov.add_mapping')}</h3>
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr auto", gap: 10, alignItems: "end" }}>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600, color: C.text, display: "block", marginBottom: 4 }}>{t('prov.ad_group')}</label>
                    <select id="ad-group-select" style={{ ...sInput, fontSize: 12, cursor: "pointer" }}>
                      <option value="">{t('prov.select_group')}</option>
                      {adGroups.filter(g => !adMappings.some((m: any) => m.ad_group_id === g.id)).map((g: any) => (
                        <option key={g.id} value={JSON.stringify({ id: g.id, name: g.displayName })}>{g.displayName}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600, color: C.text, display: "block", marginBottom: 4 }}>{t('prov.illizeo_role')}</label>
                    <select id="ad-role-select" style={{ ...sInput, fontSize: 12, cursor: "pointer" }}>
                      {Object.entries(ROLE_COLORS).map(([key, val]) => <option key={key} value={key}>{val.label}</option>)}
                    </select>
                  </div>
                  <button onClick={async () => {
                    const groupEl = document.getElementById("ad-group-select") as HTMLSelectElement;
                    const roleEl = document.getElementById("ad-role-select") as HTMLSelectElement;
                    if (!groupEl?.value) return;
                    const group = JSON.parse(groupEl.value);
                    try {
                      const created = await createADGroupMapping({ ad_group_id: group.id, ad_group_name: group.name, illizeo_role: roleEl.value, auto_provision: true });
                      setAdMappings(prev => [...prev, created]);
                      groupEl.value = "";
                      addToast_admin(`${t('prov.mapping_created')} : ${group.name} → ${roleEl.value}`);
                    } catch { addToast_admin(t('toast.error')); }
                  }} className="iz-btn-pink" style={{ ...sBtn("pink"), fontSize: 12, padding: "8px 16px" }}>{t('prov.map_btn')}</button>
                </div>
                <div style={{ marginTop: 12, padding: "10px 14px", background: C.bg, borderRadius: 8, fontSize: 11, color: C.textLight }}>
                  <div style={{ fontWeight: 600, color: C.text, marginBottom: 4 }}>{t('prov.how_it_works')}</div>
                  <div>• {t('prov.help_1')}</div>
                  <div>• {t('prov.help_2')}</div>
                  <div>• {t('prov.help_3')}</div>
                  <div>• {t('prov.help_4')}</div>
                </div>
              </div>
            )}
          </div>
          );
  };

  const renderAdminRoles = createAdminRoles(ctx);
  const renderAdminPasswordPolicy = () => {
    const roles = adminRoles.length > 0 ? adminRoles : [];
    const secTab = securitySubTab;
    return (
      <div style={{ flex: 1, padding: "24px 32px", overflow: "auto" }}>
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ fontSize: 22, fontWeight: 600, margin: 0 }}>{lang === "fr" ? "Sécurité — Politique de mot de passe" : "Security — Password Policy"}</h1>
          <p style={{ fontSize: 12, color: C.textLight, margin: "4px 0 0" }}>{lang === "fr" ? "Ces règles s'appliquent à tous les utilisateurs lors de l'inscription, la connexion et la réinitialisation." : "These rules apply to all users during sign-up, sign-in, and password reset."}</p>
        </div>

        {(() => {
          // Load password policy from API on first render
          if (!pwdPolicy) {
            getCompanySettings().then((settings: any) => {
              try {
                const raw = settings.password_policy;
                const parsed = typeof raw === "string" ? JSON.parse(raw) : (raw || {});
                setPwdPolicy({ min_length: 8, expiry_days: 0, max_attempts: 5, history_count: 3, uppercase: true, lowercase: true, number: true, special: false, no_common: true, no_name: false, ...parsed });
              } catch {
                setPwdPolicy({ min_length: 8, expiry_days: 0, max_attempts: 5, history_count: 3, uppercase: true, lowercase: true, number: true, special: false, no_common: true, no_name: false });
              }
            }).catch(() => {
              setPwdPolicy({ min_length: 8, expiry_days: 0, max_attempts: 5, history_count: 3, uppercase: true, lowercase: true, number: true, special: false, no_common: true, no_name: false });
            });
            return <div style={{ padding: 40, textAlign: "center", color: C.textMuted, fontSize: 13 }}>{lang === "fr" ? "Chargement..." : "Loading..."}</div>;
          }
          const pol = pwdPolicy;
          const save = (patch: any) => {
            const updated = { ...pol, ...patch };
            setPwdPolicy(updated);
            updateCompanySettings({ password_policy: JSON.stringify(updated) }).then(() => {
              addToast_admin(lang === "fr" ? "Politique mise à jour" : "Policy updated");
            }).catch(() => {
              addToast_admin(lang === "fr" ? "Erreur lors de la sauvegarde" : "Save error");
            });
          };
          return (
            <div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
                <div style={{ padding: "16px", background: C.bg, borderRadius: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <Lock size={14} color={C.text} />
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{lang === "fr" ? "Longueur minimale" : "Minimum length"}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <input type="number" min={6} max={32} value={pol.min_length} onChange={e => save({ min_length: Number(e.target.value) })} style={{ ...sInput, width: 70, fontSize: 16, fontWeight: 700, textAlign: "center" }} />
                    <span style={{ fontSize: 12, color: C.textMuted }}>{lang === "fr" ? "caractères" : "characters"}</span>
                  </div>
                </div>
                <div style={{ padding: "16px", background: C.bg, borderRadius: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <Clock size={14} color={C.text} />
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{lang === "fr" ? "Expiration du mot de passe" : "Password expiration"}</span>
                  </div>
                  <select value={pol.expiry_days} onChange={e => save({ expiry_days: Number(e.target.value) })} style={{ ...sInput, fontSize: 13, cursor: "pointer" }}>
                    <option value={0}>{lang === "fr" ? "Jamais" : "Never"}</option>
                    <option value={30}>30 {lang === "fr" ? "jours" : "days"}</option>
                    <option value={60}>60 {lang === "fr" ? "jours" : "days"}</option>
                    <option value={90}>90 {lang === "fr" ? "jours" : "days"}</option>
                    <option value={180}>180 {lang === "fr" ? "jours" : "days"}</option>
                    <option value={365}>365 {lang === "fr" ? "jours" : "days"}</option>
                  </select>
                </div>
              </div>

              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 10 }}>{lang === "fr" ? "Règles de complexité" : "Complexity rules"}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
                {[
                  { key: "uppercase", label: lang === "fr" ? "Au moins une majuscule (A-Z)" : "At least one uppercase letter (A-Z)" },
                  { key: "lowercase", label: lang === "fr" ? "Au moins une minuscule (a-z)" : "At least one lowercase letter (a-z)" },
                  { key: "number", label: lang === "fr" ? "Au moins un chiffre (0-9)" : "At least one number (0-9)" },
                  { key: "special", label: lang === "fr" ? "Au moins un caractère spécial (!@#$...)" : "At least one special character (!@#$...)" },
                  { key: "no_common", label: lang === "fr" ? "Interdire les mots de passe courants (top 10 000)" : "Reject common passwords (top 10,000)" },
                  { key: "no_name", label: lang === "fr" ? "Ne peut pas contenir le nom ou l'email" : "Cannot contain name or email" },
                ].map(rule => {
                  const active = pol[rule.key];
                  return (
                    <div key={rule.key} onClick={() => save({ [rule.key]: !active })} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", background: active ? C.bg : C.white, borderRadius: 8, cursor: "pointer", border: `1.5px solid ${active ? C.green + "40" : C.border}`, transition: "all .15s" }}>
                      <div style={{ width: 24, height: 24, borderRadius: 6, border: `2px solid ${active ? C.green : C.border}`, background: active ? C.green : C.white, display: "flex", alignItems: "center", justifyContent: "center", transition: "all .15s", flexShrink: 0 }}>{active && <Check size={14} color={C.white} />}</div>
                      <span style={{ fontSize: 13, fontWeight: active ? 500 : 400, color: active ? C.text : C.textMuted }}>{rule.label}</span>
                    </div>
                  );
                })}
              </div>

              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 10 }}>{lang === "fr" ? "Historique et verrouillage" : "History & lockout"}</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
                <div style={{ padding: "16px", background: C.bg, borderRadius: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <RotateCcw size={14} color={C.text} />
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{lang === "fr" ? "Historique de mots de passe" : "Password history"}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <input type="number" min={0} max={24} value={pol.history_count} onChange={e => save({ history_count: Number(e.target.value) })} style={{ ...sInput, width: 60, fontSize: 16, fontWeight: 700, textAlign: "center" }} />
                    <span style={{ fontSize: 11, color: C.textMuted }}>{lang === "fr" ? "derniers mots de passe interdits" : "last passwords forbidden"}</span>
                  </div>
                </div>
                <div style={{ padding: "16px", background: C.bg, borderRadius: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <Lock size={14} color={C.red} />
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{lang === "fr" ? "Verrouillage après échecs" : "Lockout after failures"}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <input type="number" min={0} max={20} value={pol.max_attempts} onChange={e => save({ max_attempts: Number(e.target.value) })} style={{ ...sInput, width: 60, fontSize: 16, fontWeight: 700, textAlign: "center" }} />
                    <span style={{ fontSize: 11, color: C.textMuted }}>{lang === "fr" ? "tentatives (0 = illimité)" : "attempts (0 = unlimited)"}</span>
                  </div>
                </div>
              </div>

              <div style={{ padding: "16px", background: "#1a1a2e08", border: `1px solid ${C.border}`, borderRadius: 10 }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>{lang === "fr" ? "Aperçu (affiché à l'utilisateur)" : "Preview (shown to user)"}</div>
                <div style={{ fontSize: 12, color: C.textLight, lineHeight: 1.8 }}>
                  • {lang === "fr" ? "Minimum" : "Minimum"} {pol.min_length} {lang === "fr" ? "caractères" : "characters"}<br/>
                  {pol.uppercase && <span>• {lang === "fr" ? "Une majuscule" : "One uppercase"}<br/></span>}
                  {pol.lowercase && <span>• {lang === "fr" ? "Une minuscule" : "One lowercase"}<br/></span>}
                  {pol.number && <span>• {lang === "fr" ? "Un chiffre" : "One number"}<br/></span>}
                  {pol.special && <span>• {lang === "fr" ? "Un caractère spécial" : "One special character"}<br/></span>}
                  {pol.expiry_days > 0 && <span>• {lang === "fr" ? `Expire tous les ${pol.expiry_days} jours` : `Expires every ${pol.expiry_days} days`}<br/></span>}
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    );
  };

  const renderAdminCalendar = createAdminCalendar(ctx);
  const renderAdminOrgChart = createAdminOrgChart(ctx);
  const renderAdminBuddy = createAdminBuddy(ctx);
  const renderAdminAuditLog = createAdminAuditLog(ctx);

  return {
    renderAdminGamification,
    renderAdminUsers,
    renderAdminAbonnement,
    renderAdminFields,
    renderAdminApparence,
    renderAdmin2FA,
    renderAdminPasswordPolicy,
    renderAdminEquipements,
    renderAdminDonnees,
    renderAdminProvisioning,
    renderAdminRoles,
    renderAdminCalendar,
    renderAdminOrgChart,
    renderAdminBuddy,
    renderAdminAuditLog,
  };
}
/* END OF createAdminInlinePages — extracted pages are in ./pages/ */
