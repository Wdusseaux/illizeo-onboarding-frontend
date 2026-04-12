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
    SIDEBAR_ITEMS, markSetupStepDone, finishSetupWizard,
  } = ctx;

  // ─── RENDER SIDEBAR ──────────────────────────────────────
  const renderSidebar = () => (
    <div style={{ width: 240, minHeight: "100vh", background: C.white, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", flexShrink: 0, position: "sticky", top: 0 }}>
      <div style={{ padding: "20px 16px 12px", color: C.pink }}>
        <IllizeoLogoFull height={24} />
      </div>
      {/* Role switcher — only for admins */}
      {auth.isAdmin && (
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
            <div style={{ fontSize: 11, fontWeight: 600, color: C.textMuted, letterSpacing: .5, padding: "12px 12px 6px", textTransform: "uppercase" }}>{section.section}</div>
            {section.items.map(item => {
              const active = dashPage === item.id;
              const Icon = item.icon;
              return (
                <button key={item.id} onClick={() => setDashPage(item.id)} style={{
                  display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 12px", borderRadius: 8, border: "none",
                  background: active ? C.pinkBg : "transparent", color: active ? C.pink : C.text, cursor: "pointer", fontFamily: font, fontSize: 14, fontWeight: active ? 600 : 400, transition: "all .18s ease",
                  borderLeft: active ? `3px solid ${C.pink}` : "3px solid transparent",
                }}>
                  <Icon size={18} />
                  <span style={{ flex: 1, textAlign: "left" }}>{item.label}</span>
                  {item.badge && <span style={{ background: C.pink, color: C.white, fontSize: 11, fontWeight: 700, borderRadius: 10, padding: "2px 8px", minWidth: 20, textAlign: "center" }}>{item.badge}</span>}
                </button>
              );
            })}
          </div>
        ))}
      </div>
      {/* Language selector */}
      <div style={{ padding: "8px 16px", display: "flex", gap: 4, flexWrap: "wrap" }}>
        {activeLanguages.map(l => (
          <button key={l} onClick={() => switchLang(l)} style={{
            flex: 1, minWidth: 40, padding: "5px 0", borderRadius: 6, fontSize: 11, fontWeight: lang === l ? 600 : 400, border: "none", cursor: "pointer", fontFamily: font,
            background: lang === l ? C.pinkBg : "transparent", color: lang === l ? C.pink : C.textMuted, transition: "all .15s",
          }}>{LANG_META[l].flag} {l.toUpperCase()}</button>
        ))}
      </div>
      {/* Dark mode toggle */}
      <div style={{ padding: "6px 16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <button onClick={toggleDarkMode} title={darkMode ? t('settings.light_mode') : t('settings.dark_mode')} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 8, border: `1px solid ${C.border}`, background: C.bg, cursor: "pointer", fontFamily: font, fontSize: 11, color: C.textMuted, transition: "all .15s", width: "100%" }}>
          {darkMode ? <Sun size={14} color={C.amber} /> : <Moon size={14} color={C.textMuted} />}
          <span>{darkMode ? t('settings.light_mode') : t('settings.dark_mode')}</span>
        </button>
      </div>
      {/* User avatar bottom */}
      <div style={{ borderTop: `1px solid ${C.border}` }}>
        <button onClick={() => setShowProfile(true)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 20px 4px", background: "none", border: "none", cursor: "pointer", width: "100%" }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, #E91E8C, #C2185B)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 600, color: C.white }}>
            {auth.user?.name?.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() || "?"}
          </div>
          <div style={{ flex: 1, textAlign: "left" }}>
            <div style={{ fontSize: 14, fontWeight: 500, color: C.text }}>{auth.user?.name || "Utilisateur"}</div>
            <div style={{ fontSize: 11, color: C.textMuted }}>{auth.user?.roles?.[0] || ""}</div>
          </div>
        </button>
        <button onClick={() => { const tid = localStorage.getItem("illizeo_tenant_id"); auth.logout().catch(() => {}).finally(() => { window.location.href = tid ? `${window.location.pathname}?tenant=${tid}` : window.location.pathname; }); }} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 20px 14px", background: "none", border: "none", cursor: "pointer", fontSize: 12, color: C.textMuted, fontFamily: font }}>
          <LogOut size={13} /> {t('auth.logout')}
        </button>
      </div>
    </div>
  );

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
        updateCompanySettings({ [`banner_image_${auth.user?.id}`]: dataUrl }).catch(() => {});
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
    return (
    <div key={action.id} className={`iz-card iz-fade-up iz-stagger-${Math.min(staggerIdx, 8)}`} onClick={() => setShowActionDetail(action.id)} style={{ ...sCard, padding: "16px 20px", display: "flex", alignItems: "center", gap: 16, cursor: "pointer", marginBottom: 12, opacity: isDone ? 0.6 : 1 }}>
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
      {action.urgent && !isDone && <button className="iz-btn-pink" onClick={e => { e.stopPropagation(); setShowDocPanel("admin"); }} style={{ ...sBtn("dark"), padding: "8px 20px", fontSize: 13 }}>{t('emp.complete_btn')}</button>}
      {showCheckbox && (
        <div onClick={e => { e.stopPropagation(); if (!isDone) handleCompleteAction(action.id); }} style={{ width: 22, height: 22, borderRadius: "50%", border: `2px solid ${isDone ? C.green : C.border}`, background: isDone ? C.green : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all .2s", cursor: "pointer" }}>
          {isDone && <Check size={14} color={C.white} />}
        </div>
      )}
    </div>
    );
  };

  // ─── TABLEAU DE BORD ─────────────────────────────────────
  const renderDashboard = () => {
    const bannerGradient = `linear-gradient(135deg, ${employeeBannerColor} 0%, ${employeeBannerColor}99 30%, #C2185B 70%, #E91E8C 100%)`;
    const handleBannerMouseMove = (e: React.MouseEvent) => {
      if (!bannerDragging || !bannerRef.current) return;
      const rect = bannerRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
      const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
      setBannerPos({ x, y });
    };
    const handleBannerUpload = handleBannerFileUpload;
    return (
    <div style={{ flex: 1 }}>
      {/* Hero banner */}
      <div ref={bannerRef} className="iz-fade-in" onMouseMove={handleBannerMouseMove} onMouseUp={() => setBannerDragging(false)} onMouseLeave={() => setBannerDragging(false)} style={{ height: 180, background: bannerImage ? `url(${bannerImage})` : bannerGradient, backgroundSize: `${bannerZoom}%`, backgroundPosition: `${bannerPos.x}% ${bannerPos.y}%`, borderRadius: 0, display: "flex", alignItems: "flex-end", padding: "0 40px 24px", position: "relative", transition: bannerDragging ? "none" : "background .4s", cursor: bannerEditMode ? (bannerDragging ? "grabbing" : "grab") : "default", userSelect: "none" as const }}>
        {/* Gradient overlay when image is set */}
        {bannerImage && <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,.1) 0%, rgba(0,0,0,.45) 100%)" }} />}
        <div style={{ display: "flex", alignItems: "center", gap: 16, position: "relative", zIndex: 2 }}>
          <div onClick={() => setShowAvatarEditor(true)} style={{ width: 56, height: 56, borderRadius: "50%", background: avatarImage ? "none" : "linear-gradient(135deg, #E91E8C, #C2185B)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 600, color: "#fff", border: "3px solid #fff", cursor: "pointer", overflow: "hidden", position: "relative" }}>
            {avatarImage ? (
              <img src={avatarImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: `${avatarPos.x}% ${avatarPos.y}%`, transform: `scale(${avatarZoom / 100})` }} />
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
            <button onClick={() => { setBannerImage(null); setBannerEditMode(false); setBannerZoom(100); setBannerPos({ x: 50, y: 50 }); localStorage.removeItem("illizeo_banner_image"); localStorage.removeItem("illizeo_banner_zoom"); localStorage.removeItem("illizeo_banner_pos"); updateCompanySettings({ [`banner_image_${auth.user?.id}`]: "" }).catch(() => {}); addToast("Image retirée", "warning"); }} style={{ background: "none", border: "none", cursor: "pointer", color: C.textMuted }}><X size={16} /></button>
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
      <div style={{ display: "flex", gap: 24, padding: "24px 32px" }}>
        {/* Main content */}
        <div style={{ flex: 1 }}>
          {/* Phase progress */}
          <div className="iz-card iz-fade-up" style={{ ...sCard, marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: C.text, margin: 0 }}>{t('emp.current_phase')} Avant date d'arrivée</h3>
              <span style={{ fontSize: 13, fontWeight: 600, color: employeeProgression === 100 ? C.green : C.pink }}>{employeeProgression}%</span>
            </div>
            <div style={{ height: 8, background: C.bg, borderRadius: 4, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${Math.max(employeeProgression, 2)}%`, animation: "izProgressFill .8s ease both", background: employeeProgression === 100 ? C.green : `linear-gradient(90deg, ${C.pink}, ${C.pinkSoft})`, borderRadius: 4, transition: "width .5s ease" }} />
            </div>
          </div>
          {/* Actions */}
          <h3 style={{ fontSize: 18, fontWeight: 600, color: C.text, margin: "0 0 16px" }}>{t('emp.next_actions')}</h3>
          <div style={{ fontSize: 12, fontWeight: 600, color: C.textMuted, textTransform: "uppercase", letterSpacing: .5, marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
            {t('emp.asap')} <AlertTriangle size={14} color={C.amber} />
          </div>
          {ACTIONS.filter(a => a.urgent).map((a, i) => renderActionCard(a, false, i))}
          <div style={{ fontSize: 12, fontWeight: 600, color: C.textMuted, textTransform: "uppercase", letterSpacing: .5, marginBottom: 12, marginTop: 24 }}>{t('emp.this_week')}</div>
          {ACTIONS.filter(a => a.type === "task").map((a, i) => renderActionCard(a, true, i + 1))}
          <div style={{ fontSize: 12, fontWeight: 600, color: C.textMuted, textTransform: "uppercase", letterSpacing: .5, marginBottom: 12, marginTop: 24 }}>{t('emp.in_2_weeks')}</div>
          {ACTIONS.filter(a => a.type === "future").slice(0, 1).map((a, i) => renderActionCard(a, true, i + 3))}
          <div style={{ fontSize: 12, fontWeight: 600, color: C.textMuted, textTransform: "uppercase", letterSpacing: .5, marginBottom: 12, marginTop: 24 }}>{t('emp.in_7_weeks')}</div>
          {ACTIONS.filter(a => a.type === "future").slice(1).map((a, i) => renderActionCard(a, true, i + 4))}
          {/* Video section */}
          <div style={{ ...sCard, marginTop: 24, padding: 0, overflow: "hidden" }}>
            <div style={{ height: 240, background: "#1a1a2e", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(255,255,255,.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Play size={24} color={C.white} fill={C.white} />
              </div>
              <div style={{ position: "absolute", bottom: 12, left: 16, color: C.white, fontSize: 12 }}>▶ 0:00 / 1:21</div>
            </div>
          </div>
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
          {/* Arrival info */}
          <div style={{ ...sCard, marginBottom: 20 }}>
            <h3 className="iz-fade-up iz-stagger-1" style={{ fontSize: 16, fontWeight: 600, color: C.text, margin: "0 0 4px" }}>{t('emp.arrival_info')}</h3>
            <p style={{ fontSize: 13, color: C.textLight, margin: "0 0 16px" }}>{t('emp.arrival_subtitle')}</p>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
              <Calendar size={20} color={C.blue} />
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{t('emp.arrival_date')}</div>
                <div style={{ fontSize: 13, color: C.textLight }}>Rendez-vous le 1er juin 2026</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <MapPin size={20} color={C.pink} />
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{t('emp.arrival_office')}</div>
                <div style={{ fontSize: 13, color: C.textLight }}>6 Place Ruth-Bösiger, 1201 Genève</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 14 }}>
              <UserCheck size={20} color={C.green} />
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{t('emp.arrival_contact')}</div>
                <div style={{ fontSize: 13, color: C.textLight }}>Amira LAROUSSI — Recruteur(se), accueil au 3ème étage</div>
              </div>
            </div>
          </div>
          {/* Team members */}
          <div style={{ ...sCard }}>
            <h3 className="iz-fade-up iz-stagger-2" style={{ fontSize: 16, fontWeight: 600, color: C.text, margin: "0 0 16px" }}>{t('emp.team_members')}</h3>
            {TEAM_MEMBERS.map((m, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i < TEAM_MEMBERS.length - 1 ? `1px solid ${C.border}` : "none" }}>
                <div className="iz-avatar" style={{ width: 40, height: 40, borderRadius: "50%", background: m.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 600, color: C.white, flexShrink: 0 }}>{m.initials}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: C.text }}>{m.name}</div>
                  <div style={{ fontSize: 12, color: C.textLight }}>{m.role}</div>
                </div>
                <MessageCircle size={16} color={C.textLight} style={{ cursor: "pointer" }} />
                <ChevronRight size={16} color={C.textLight} />
              </div>
            ))}
            <div style={{ textAlign: "center", marginTop: 12 }}>
              <span onClick={() => setShowTeamModal(true)} style={{ fontSize: 13, color: C.text, textDecoration: "underline", cursor: "pointer" }}>{t('emp.discover_team')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* My badges */}
      {myBadges.length > 0 && (() => {
        const BADGE_ICON_MAP_EMP: Record<string, any> = {
          "trophy": Trophy, "file-check": FileCheck2, "message-circle": MessageCircle, "calendar-check": CalendarCheck,
          "star": Star, "handshake": Handshake, "smile": Smile, "party-popper": PartyPopper,
          "award": Award, "heart": Heart, "rocket": Rocket, "gem": Gem, "crown": Crown, "target": Target, "zap": Zap, "gift": Gift,
        };
        return (
        <div style={{ marginTop: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}><Trophy size={18} color={C.amber} /> {t('emp.my_badges')}</h3>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {myBadges.map(b => {
              const BadgeIcon = BADGE_ICON_MAP_EMP[b.icon] || Trophy;
              return (
              <div key={b.id} className="iz-card" style={{ ...sCard, padding: "14px 18px", textAlign: "center", width: 130 }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: b.color + "20", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px", border: `2px solid ${b.color}30` }}>
                  <BadgeIcon size={22} color={b.color} />
                </div>
                <div style={{ fontSize: 12, fontWeight: 600, color: C.text }}>{b.nom}</div>
                <div style={{ fontSize: 10, color: C.textMuted }}>{fmtDateShort(b.earned_at)}</div>
                {b.description && <div style={{ fontSize: 9, color: C.textLight, marginTop: 2, lineHeight: 1.4 }}>{b.description}</div>}
              </div>
              );
            })}
          </div>
        </div>
        );
      })()}
    </div>
    );
  };

  // ─── MES ACTIONS ─────────────────────────────────────────
  const renderMesActions = () => (
    <div style={{ flex: 1, padding: "32px 40px" }}>
      <h1 style={{ fontSize: 24, fontWeight: 600, color: C.text, margin: "0 0 20px" }}>{t('emp.my_actions')}</h1>
      <div style={{ display: "flex", gap: 24, marginBottom: 24, borderBottom: `2px solid ${C.border}` }}>
        {(["toutes", "onboarding"] as DashboardTab[]).map(tab => (
          <button key={tab} onClick={() => setActionTab(tab)} style={{ padding: "8px 0 12px", fontSize: 14, fontWeight: actionTab === tab ? 600 : 400, color: actionTab === tab ? C.pink : C.textLight, background: "none", border: "none", borderBottom: actionTab === tab ? `3px solid ${C.pink}` : "3px solid transparent", cursor: "pointer", fontFamily: font, textTransform: "capitalize" }}>
            {tab === "toutes" ? t('emp.all_actions_tab') : "Onboarding"}
          </button>
        ))}
      </div>
      {/* Filters */}
      <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
        <div style={{ ...sInput, width: 240, display: "flex", alignItems: "center", gap: 8 }}>
          <Search size={16} color={C.textLight} />
          <span style={{ color: C.textMuted, fontSize: 14 }}>{t('emp.search')}</span>
        </div>
        <div style={{ ...sInput, width: "auto", display: "flex", alignItems: "center", gap: 8, padding: "8px 16px" }}>
          <span style={{ fontSize: 13, color: C.textLight }}>{t('emp.status_label')}</span>
          <span style={{ fontSize: 13, fontWeight: 500 }}>{t('emp.status_todo')}</span>
          <ChevronRight size={14} color={C.textLight} style={{ transform: "rotate(90deg)" }} />
        </div>
        <div style={{ ...sInput, width: "auto", display: "flex", alignItems: "center", gap: 8, padding: "8px 16px" }}>
          <span style={{ fontSize: 13, color: C.textLight }}>{t('emp.sort_by')}</span>
          <span style={{ fontSize: 13, fontWeight: 500 }}>{t('emp.arrival_date')}</span>
          <ChevronRight size={14} color={C.textLight} style={{ transform: "rotate(90deg)" }} />
        </div>
      </div>
      <div style={{ fontSize: 12, fontWeight: 600, color: C.textMuted, textTransform: "uppercase", letterSpacing: .5, marginBottom: 12 }}>{t('emp.this_week')}</div>
      {ACTIONS.filter(a => a.type === "task" || a.urgent).map((a, i) => renderActionCard(a, true, i))}
    </div>
  );

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
  const renderCompanyBlock = (block: any) => {
    const iconMap: Record<string, React.FC<any>> = { building: Building2, sparkles: Sparkles, heart: Gift, rocket: Zap, users: Users, shield: ShieldCheck, star: Star, target: Target };
    const tr = (field: string) => {
      const val = block.translations?.[field]?.[lang];
      return val || (block as any)[field] || "";
    };
    switch (block.type) {
      case 'hero':
        return (
          <div key={block.id} style={{ background: `linear-gradient(135deg, #1a1a2e 0%, #2D1B3D 50%, ${C.pink} 100%)`, borderRadius: 16, padding: "48px 40px", color: "#fff", marginBottom: 24 }}>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,.6)", marginBottom: 8 }}>{block.data?.subtitle || ""}</div>
            <h1 style={{ fontSize: 28, fontWeight: 700, margin: "0 0 12px", color: "#fff" }}>{tr('titre')}</h1>
            <p style={{ fontSize: 15, lineHeight: 1.6, opacity: .85, maxWidth: 600, margin: 0, color: "#fff" }}>{tr('contenu')}</p>
          </div>
        );
      case 'text':
        const TIcon = iconMap[block.data?.icon] || Building2;
        return (
          <div key={block.id} className="iz-card" style={{ ...sCard, marginBottom: 16, display: "flex", gap: 16, alignItems: "flex-start" }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: C.pinkBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><TIcon size={22} color={C.pink} /></div>
            <div><h3 style={{ fontSize: 16, fontWeight: 600, margin: "0 0 8px" }}>{tr('titre')}</h3><p style={{ fontSize: 13, lineHeight: 1.7, color: C.textLight, margin: 0 }}>{tr('contenu')}</p></div>
          </div>
        );
      case 'mission':
        return (
          <div key={block.id} style={{ background: "#1a1a2e", borderRadius: 16, padding: "32px 36px", color: "#fff", marginBottom: 16, position: "relative", overflow: "hidden", border: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 48, fontWeight: 800, color: "rgba(255,255,255,.08)", position: "absolute", top: 12, left: 20 }}>{block.data?.number || "01"}</div>
            <h3 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 8px", position: "relative", color: "#fff" }}>{tr('titre')}</h3>
            <p style={{ fontSize: 14, lineHeight: 1.6, opacity: .8, margin: 0, position: "relative", color: "#fff" }}>{tr('contenu')}</p>
          </div>
        );
      case 'stats':
        return (
          <div key={block.id} style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, margin: "0 0 4px" }}>{tr('titre')}</h3>
            <p style={{ fontSize: 12, color: C.textLight, margin: "0 0 12px" }}>{tr('contenu')}</p>
            {block.data?.badge && <div style={{ display: "inline-block", padding: "6px 14px", borderRadius: 8, background: C.greenLight, color: C.green, fontSize: 12, fontWeight: 600, marginBottom: 12 }}>{block.data.badge}</div>}
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${(block.data?.items || []).length}, 1fr)`, gap: 12 }}>
              {(block.data?.items || []).map((s: any, i: number) => (
                <div key={i} className="iz-card" style={{ ...sCard, textAlign: "center" }}>
                  <div style={{ fontSize: 32, fontWeight: 800, color: C.pink }}>{s.value}</div>
                  <div style={{ fontSize: 12, color: C.textLight, marginTop: 4, lineHeight: 1.4 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'values':
        return (
          <div key={block.id} style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, margin: "0 0 16px" }}>{tr('titre')}</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
              {(block.data?.items || []).map((v: any, i: number) => {
                const VIcon = iconMap[v.icon] || Star;
                return (
                  <div key={i} className="iz-card" style={{ ...sCard, display: "flex", gap: 14, alignItems: "flex-start" }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: C.pinkBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><VIcon size={20} color={C.pink} /></div>
                    <div><div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{v.title}</div><div style={{ fontSize: 12, color: C.textLight, lineHeight: 1.5 }}>{v.desc}</div></div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      case 'video':
        return (
          <div key={block.id} style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, margin: "0 0 12px" }}>{tr('titre')}</h3>
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min((block.data?.videos || []).length, 2)}, 1fr)`, gap: 16 }}>
              {(block.data?.videos || []).map((v: any, i: number) => (
                <div key={i} className="iz-card" style={{ ...sCard, overflow: "hidden", padding: 0 }}>
                  <div style={{ width: "100%", aspectRatio: "16/9", background: C.dark }}>
                    {v.youtube_id ? (
                      <iframe src={`https://www.youtube.com/embed/${v.youtube_id}`} title={v.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen style={{ width: "100%", height: "100%", border: "none" }} />
                    ) : (
                      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #2D1B3D, #7B5EA7)" }}>
                        <Play size={40} color="rgba(255,255,255,.8)" />
                      </div>
                    )}
                  </div>
                  <div style={{ padding: "12px 16px", fontSize: 14, fontWeight: 500 }}>{v.title}</div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'team':
        return (
          <div key={block.id} style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, margin: "0 0 16px" }}>{tr('titre')}</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
              {(block.data?.members || []).map((m: any, i: number) => (
                <div key={i} className="iz-card" style={{ ...sCard, textAlign: "center" }}>
                  <div style={{ width: 48, height: 48, borderRadius: "50%", background: m.color || C.pink, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 600, color: C.white, margin: "0 auto 10px" }}>{m.initials}</div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{m.name}</div>
                  <div style={{ fontSize: 11, color: C.textLight, marginBottom: 6 }}>{m.role}</div>
                  {m.email && <div style={{ fontSize: 11, color: C.blue, display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}><Mail size={11} />{m.email}</div>}
                  {m.phone && <div style={{ fontSize: 11, color: C.textMuted, display: "flex", alignItems: "center", justifyContent: "center", gap: 4, marginTop: 2 }}><MapPin size={11} />{m.phone}</div>}
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const renderEntreprise = () => (
    <div style={{ flex: 1, padding: "32px 40px", overflow: "auto" }}>
      {companyBlocks.filter(b => b.actif).length === 0 ? (
        <div style={{ textAlign: "center", padding: 60, color: C.textMuted }}>
          <Building2 size={48} color={C.border} style={{ marginBottom: 12 }} />
          <p>Page entreprise non configurée</p>
        </div>
      ) : companyBlocks.filter(b => b.actif).map(renderCompanyBlock)}
    </div>
  );

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
  const renderWelcomeModal = () => (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
      <div style={{ background: C.white, borderRadius: 20, width: 700, padding: "48px 40px", textAlign: "center", position: "relative" }}>
        <button onClick={() => setShowWelcomeModal(false)} style={{ position: "absolute", top: 20, right: 20, background: "none", border: "none", cursor: "pointer" }}><X size={24} color={C.textLight} /></button>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: -8, marginBottom: 24 }}>
          <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg, #E91E8C, #C2185B)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 600, color: C.white, border: `3px solid ${C.white}`, zIndex: 1 }}>NF</div>
          <div style={{ width: 60, height: 60, borderRadius: "50%", background: C.white, display: "flex", alignItems: "center", justifyContent: "center", marginLeft: -16, border: `2px solid ${C.border}` }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: C.pink, letterSpacing: 1 }}>illizeo</span>
          </div>
        </div>
        <h2 style={{ fontSize: 24, fontWeight: 600, color: C.text, margin: "0 0 12px" }}>Bienvenue chez Illizeo Nadia</h2>
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

  // ─── DOCUMENT PANEL ──────────────────────────────────────
  const renderDocPanel = () => {
    if (showDocCategory) {
      const cat = DOC_CATEGORIES.find(c => c.id === showDocCategory);
      if (!cat) return null;
      const isFormulaires = cat.id === "formulaires";
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
                Document à soumettre pour toutes les démarches administratives. A faire en amont de l'arrivée du collaborateur – Pièce d'identité ou passeport en cours de validité – Carte AVS (si concerné) – Permis de travail/résidence (si concerné)
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
                        <button onClick={() => handleEmployeeSubmitDoc(doc)} className="iz-btn-pink" style={{ display: "flex", alignItems: "center", gap: 6, ...sBtn("pink"), padding: "8px 16px", fontSize: 13 }}>
                          <Plus size={14} /> Ajouter un fichier
                        </button>
                      ) : (
                        <div className="iz-fade-in" style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: C.greenLight, borderRadius: 8, fontSize: 13, color: C.green }}>
                          <CheckCircle size={16} /> Fichier soumis
                        </div>
                      )}
                    </div>
                  </div>
                ) : (docStatus === "manquant" || docStatus === "refuse") ? (
                  <div className="iz-upload-zone" onClick={() => handleEmployeeSubmitDoc(doc)} style={{ marginTop: 8, borderRadius: 12, padding: "28px 20px", textAlign: "center", cursor: "pointer" }}>
                    <Upload size={24} color={C.textLight} style={{ marginBottom: 8 }} />
                    <div style={{ fontSize: 14, color: C.text }}>Glisser-déposer ou <span style={{ color: C.pink, fontWeight: 600, textDecoration: "underline" }}>Importer</span> un fichier</div>
                    <div style={{ fontSize: 12, color: C.textMuted, marginTop: 4 }}>Type de fichier: Image (png, jpeg...), PDF, Office (word, excel, txt, csv...)</div>
                  </div>
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
    const action = ACTIONS.find(a => a.id === showActionDetail);
    if (!action) return null;
    const isDone = completedActions.has(action.id);
    // Find matching template for richer data
    const tpl = ACTION_TEMPLATES.find(t => t.titre === action.title);
    const meta = tpl ? ACTION_TYPE_META[tpl.type] : null;
    return (
      <div className="iz-panel" style={{ position: "fixed", top: 0, right: 0, width: 480, height: "100vh", background: C.white, boxShadow: "-4px 0 24px rgba(0,0,0,.1)", zIndex: 1001, display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "24px 28px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: C.text, margin: 0, lineHeight: 1.4 }}>{action.title}</h2>
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
            <span style={{ fontWeight: 500, color: isDone ? C.green : action.urgent ? C.red : C.text }}>{isDone ? "Terminé" : action.urgent ? "En retard" : "À faire"}</span>
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
          {action.type === "admin" && !isDone && (
            <div style={{ padding: "14px 16px", background: C.redLight, borderRadius: 10, marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
              <AlertTriangle size={18} color={C.red} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.red }}>Action urgente</div>
                <div style={{ fontSize: 12, color: C.text }}>{action.subtitle || "Des pièces administratives sont manquantes."}</div>
              </div>
            </div>
          )}
          {tpl && tpl.lienExterne && !isDone && (
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", border: `1px solid ${C.border}`, borderRadius: 8, marginBottom: 16 }}>
              <Link size={16} color={C.blue} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>Accéder à la ressource</div>
                <div style={{ fontSize: 11, color: C.textLight }}>{tpl.lienExterne}</div>
              </div>
              <button className="iz-btn-pink" style={{ ...sBtn("pink"), padding: "6px 16px", fontSize: 12 }}>Accès</button>
            </div>
          )}
          {tpl && tpl.type === "document" && !isDone && (
            <div style={{ marginBottom: 16 }}>
              <button onClick={() => { setShowActionDetail(null); setShowDocPanel("admin"); }} className="iz-btn-outline" style={{ ...sBtn("outline"), width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}><FileUp size={16} /> Ouvrir le panneau documents</button>
            </div>
          )}
          {/* Individual pieces upload */}
          {tpl && tpl.piecesRequises && tpl.piecesRequises.length > 0 && !isDone && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span>Pièces à fournir ({tpl.piecesRequises.filter(p => uploadedPieces[`${tpl.id}-${p}`]).length}/{tpl.piecesRequises.length})</span>
                <span style={{ fontSize: 11, color: C.textMuted }}>Cliquer pour charger</span>
              </div>
              {tpl.piecesRequises.map((piece, pi) => {
                const key = `${tpl.id}-${piece}`;
                const status = uploadedPieces[key];
                return (
                  <div key={pi} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", marginBottom: 6, borderRadius: 8, border: `1px solid ${status === "validated" ? C.green : status === "refused" ? C.red : status === "uploaded" ? C.amber : C.border}`, background: status === "validated" ? C.greenLight : status === "refused" ? C.redLight : status === "uploaded" ? C.amberLight : C.white }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: status === "validated" ? C.green : status === "refused" ? C.red : status === "uploaded" ? C.amber : C.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {status === "validated" && <CheckCircle size={14} color={C.white} />}
                      {status === "refused" && <XCircle size={14} color={C.white} />}
                      {status === "uploaded" && <Clock size={14} color={C.white} />}
                      {!status && <Upload size={14} color={C.textMuted} />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: C.text }}>{piece}</div>
                      <div style={{ fontSize: 11, color: status === "validated" ? C.green : status === "refused" ? C.red : status === "uploaded" ? C.amber : C.textMuted }}>
                        {status === "validated" ? "Validé par RH" : status === "refused" ? "Refusé — à renvoyer" : status === "uploaded" ? "En attente de validation" : "À charger"}
                      </div>
                    </div>
                    {!status && (
                      <button onClick={() => { setUploadedPieces(prev => ({ ...prev, [key]: "uploaded" })); addToast(`"${piece}" chargé avec succès`, "success"); }} className="iz-btn-pink" style={{ ...sBtn("pink"), padding: "5px 14px", fontSize: 11 }}>Charger</button>
                    )}
                    {status === "refused" && (
                      <button onClick={() => { setUploadedPieces(prev => ({ ...prev, [key]: "uploaded" })); addToast(`"${piece}" renvoyé`, "success"); }} className="iz-btn-pink" style={{ ...sBtn("pink"), padding: "5px 14px", fontSize: 11, background: C.red }}>Renvoyer</button>
                    )}
                    {status === "uploaded" && <span style={{ fontSize: 10, color: C.amber, fontWeight: 600 }}>En attente</span>}
                    {status === "validated" && <CheckCircle size={16} color={C.green} />}
                  </div>
                );
              })}
            </div>
          )}
          {tpl && tpl.type === "formulaire" && !isDone && (
            <div style={{ marginBottom: 16 }}>
              <button className="iz-btn-outline" style={{ ...sBtn("outline"), width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}><ClipboardList size={16} /> Remplir le formulaire</button>
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
            <button className="iz-btn-outline" onClick={() => { setCompletedActions(prev => { const s = new Set(prev); s.delete(action.id); return s; }); }} style={sBtn("outline")}>Rouvrir l'action</button>
          ) : (
            <>
              {action.type === "admin" && <button onClick={() => { setShowActionDetail(null); setShowDocPanel("admin"); }} className="iz-btn-outline" style={sBtn("outline")}>Compléter les documents</button>}
              <button className="iz-btn-pink" onClick={() => { handleCompleteAction(action.id); }} style={{ ...sBtn("pink"), padding: "10px 28px" }}>Marquer comme fait</button>
            </>
          )}
        </div>
      </div>
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
        <div className="iz-modal" style={{ background: C.white, borderRadius: 16, width: 900, maxHeight: "85vh", overflow: "auto", position: "relative" }}>
          <div style={{ padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.pink, letterSpacing: 1 }}>illizeo</div>
            <button onClick={() => setShowProfile(false)} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={22} color={C.textLight} /></button>
          </div>
          <div style={{ textAlign: "center", padding: "0 40px 24px" }}>
            <h1 style={{ fontSize: 36, fontWeight: 300, color: C.text, margin: "0 0 24px" }}>Nadia Ferreira</h1>
            <div style={{ display: "flex", justifyContent: "center", gap: 32, borderBottom: `2px solid ${C.border}` }}>
              {tabs.map(t => (
                <button key={t.id} onClick={() => setProfileTab(t.id)} style={{ padding: "8px 0 12px", fontSize: 14, fontWeight: profileTab === t.id ? 600 : 400, color: profileTab === t.id ? C.text : C.textLight, background: "none", border: "none", borderBottom: profileTab === t.id ? `3px solid ${C.pink}` : "3px solid transparent", cursor: "pointer", fontFamily: font }}>{t.label}</button>
              ))}
            </div>
          </div>
          <div style={{ padding: "24px 56px 40px" }}>
            {profileTab === "infos" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px 32px" }}>
                {[
                  { label: "Prénom", value: formData.prenom },
                  { label: "Nom de famille", value: formData.nom },
                  { label: "Numéro de téléphone", value: "6********", hasPrefix: true },
                  { label: "Date de naissance", value: formData.dateNaissance, optional: true },
                ].map((f, i) => (
                  <div key={i}>
                    <label style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{f.label} {f.optional && <span style={{ color: C.textMuted, fontWeight: 400 }}>Optionnel</span>}</label>
                    <input value={f.value} readOnly style={{ ...sInput, marginTop: 6 }} />
                  </div>
                ))}
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
                    <div style={{ width: 100, height: 100, borderRadius: "50%", background: "linear-gradient(135deg, #E91E8C, #C2185B)", margin: "0 auto 12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, color: C.white }}>NF</div>
                    <span style={{ fontSize: 14, textDecoration: "underline", cursor: "pointer", color: C.text }}>Importer</span>
                  </div>
                </div>
                <div><button style={{ ...sBtn("outline"), width: "100%" }}>Accéder aux CGU d'Illizeo</button></div>
                <div><button style={{ ...sBtn("outline"), width: "100%" }}>Accès à la politique de confidentialité d'Illizeo</button></div>
              </div>
            )}
            {profileTab === "password" && (
              <div>
                {["Mot de passe actuel *", "Nouveau mot de passe *", "Confirmer le nouveau mot de passe*"].map((label, i) => (
                  <div key={i} style={{ marginBottom: 24 }}>
                    <label style={{ fontSize: 14, fontWeight: 600, color: C.text }}>
                      {label} {i === 1 && <span style={{ fontWeight: 400, fontSize: 12, color: C.textLight }}>(Le mot de passe doit comporter au moins 8 caractères, 1 chiffre et 1 caractère spécial)</span>}
                    </label>
                    <div style={{ position: "relative", marginTop: 8 }}>
                      <input type="password" placeholder={i === 0 ? "Saisissez votre mot de passe actuel" : "Saisissez votre nouveau mot de passe"} style={sInput} />
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
                {(profileTab === "notifs" ? NOTIFICATIONS_LIST : NOTIF_RESOURCES).map((n, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", padding: "12px 16px", background: i % 2 === 0 ? C.bg : C.white, borderRadius: 6 }}>
                    <span style={{ flex: 1, fontSize: 14, color: C.text }}>{n}</span>
                    <div style={{ width: 120, textAlign: "center" }}>
                      <div style={{ width: 20, height: 20, borderRadius: 4, border: `2px solid ${C.green}`, background: C.greenLight, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                        <Check size={12} color={C.green} />
                      </div>
                    </div>
                    <div style={{ width: 120, textAlign: "center" }}>
                      <div style={{ width: 20, height: 20, borderRadius: 4, border: `2px solid ${C.border}`, display: "inline-block" }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div style={{ textAlign: "center", marginTop: 32 }}>
              <button style={sBtn("pink")}>Sauvegarder</button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return {
    renderSidebar,
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
    handleBannerFileUpload,
    handleSendMessage,
  };
}
