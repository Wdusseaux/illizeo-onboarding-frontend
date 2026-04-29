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
  getUsers, createUser as apiCreateUser, inviteUser, updateUser as apiUpdateUser, deleteUser as apiDeleteUser,
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
  purgeDemoCollaborateurs,
} from "../api/endpoints";
import { apiFetch } from "../api/client";

/**
 * Factory that creates the setup wizard render function.
 */
export function createSetupWizard(ctx: any) {
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
    handleBannerFileUpload, handleSendMessage, renderActionCard, renderCompanyBlock, renderMessagerie, SIDEBAR_ITEMS, saveSetting,
  } = ctx;

  const SETUP_STEPS = [
    { id: "company", title: t('wiz.step_company'), desc: t('wiz.step_company_desc'), icon: Building2, required: true },
    { id: "appearance", title: t('wiz.step_appearance'), desc: t('wiz.step_appearance_desc'), icon: Palette, required: false },
    { id: "team", title: t('wiz.step_team'), desc: t('wiz.step_team_desc'), icon: Users, required: true },
    { id: "parcours", title: t('wiz.step_parcours'), desc: t('wiz.step_parcours_desc'), icon: Route, required: true },
  ];
  const SECTORS = ["Technologie", "Finance & Banque", "Santé", "Industrie", "Commerce & Retail", "Services", "Éducation", "Immobilier", "Hôtellerie & Restauration", "Transport & Logistique", "Conseil", "Autre"];
  const COMPANY_SIZES = ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"];
  const SETUP_DOCS_DATA: Record<string, { fr: string; en: string }> = {
    piece_identite: { fr: "Pièce d'identité (CNI / Passeport)", en: "ID document (ID card / Passport)" },
    rib: { fr: "RIB / Coordonnées bancaires", en: "Bank details / IBAN" },
    attestation_securite_sociale: { fr: "Attestation sécurité sociale / AVS", en: "Social security certificate" },
    photo_identite: { fr: "Photo d'identité", en: "ID photo" },
    permis_travail: { fr: "Permis de travail / Titre de séjour", en: "Work permit / Residence permit" },
    diplome: { fr: "Diplôme(s) / Certificat(s)", en: "Diploma(s) / Certificate(s)" },
    cv: { fr: "CV", en: "Resume / CV" },
    justificatif_domicile: { fr: "Justificatif de domicile", en: "Proof of address" },
    certificat_medical: { fr: "Certificat médical", en: "Medical certificate" },
    casier_judiciaire: { fr: "Extrait de casier judiciaire", en: "Criminal record extract" },
    permis_conduire: { fr: "Permis de conduire", en: "Driving license" },
    contrat_signe: { fr: "Contrat signé", en: "Signed contract" },
  };
  const SETUP_DOCS = Object.entries(SETUP_DOCS_DATA).map(([id, labels]) => ({ id, label: lang === "fr" ? labels.fr : labels.en }));

  const markSetupStepDone = (stepId: string) => {
    const updated = setupCompleted.includes(stepId) ? setupCompleted : [...setupCompleted, stepId];
    setSetupCompleted(updated);
    updateCompanySettings({ setup_steps_done: JSON.stringify(updated) }).catch(() => {});
  };

  const finishSetupWizard = () => {
    updateCompanySettings({ setup_completed: "true" }).catch(() => {});
    setShowSetupWizard(false);
    addToast_admin(t('wiz.config_done'));
  };

  const renderSetupWizard = () => {
    const currentStep = SETUP_STEPS[setupStep];
    const totalRequired = SETUP_STEPS.filter(s => s.required).length;
    const completedRequired = SETUP_STEPS.filter(s => s.required && setupCompleted.includes(s.id)).length;
    const progress = Math.round((setupCompleted.length / SETUP_STEPS.length) * 100);

    return (
      <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: C.white, color: C.text, fontFamily: font, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Header */}
        <div style={{ padding: "16px 32px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", background: C.white, flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <img src={getLogoFullUri()} alt="Illizeo" style={{ height: 28, objectFit: "contain" }} />
            <div style={{ width: 1, height: 24, background: C.border }} />
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: C.text }}>{t('wiz.config_space')}</div>
              <div style={{ fontSize: 11, color: C.textMuted }}>{completedRequired}/{totalRequired} {t('wiz.required_steps')}</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ display: "flex", gap: 4 }}>
              {(["fr", "en"] as const).map(l => (
                <button key={l} onClick={() => switchLang(l)} style={{ padding: "4px 10px", borderRadius: 6, fontSize: 11, fontWeight: lang === l ? 600 : 400, border: `1px solid ${lang === l ? C.pink : C.border}`, cursor: "pointer", fontFamily: font, background: lang === l ? C.pinkBg : C.white, color: lang === l ? C.pink : C.textMuted, transition: "all .15s" }}>{LANG_META[l].flag} {l.toUpperCase()}</button>
              ))}
            </div>
            <div style={{ width: 180, height: 6, borderRadius: 3, background: C.bg, overflow: "hidden" }}>
              <div style={{ width: `${progress}%`, height: "100%", background: C.pink, borderRadius: 3, transition: "width .3s ease" }} />
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, color: C.pink }}>{progress}%</span>
            <button onClick={() => {
              if (completedRequired >= totalRequired) { finishSetupWizard(); return; }
              setShowSetupWizard(false);
            }} className="iz-btn-outline" style={{ ...sBtn("outline"), fontSize: 11, padding: "6px 14px" }}>
              {completedRequired >= totalRequired ? t('wiz.finish') : t('wiz.later')}
            </button>
          </div>
        </div>

        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
          {/* Sidebar steps */}
          <div style={{ width: 260, borderRight: `1px solid ${C.border}`, padding: "20px 0", overflow: "auto", background: C.bg, flexShrink: 0 }}>
            {SETUP_STEPS.map((step, i) => {
              const done = setupCompleted.includes(step.id);
              const active = i === setupStep;
              const StepIcon = step.icon;
              return (
                <button key={step.id} onClick={() => setSetupStep(i)} style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "12px 20px", width: "100%", border: "none", cursor: "pointer",
                  background: active ? C.white : "transparent", fontFamily: font, textAlign: "left", transition: "all .15s",
                  borderLeft: active ? `3px solid ${C.pink}` : "3px solid transparent",
                }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: done ? C.green : active ? C.pinkBg : C.white, border: done ? "none" : `1.5px solid ${active ? C.pink : C.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all .15s" }}>
                    {done ? <Check size={14} color={C.white} /> : <StepIcon size={14} color={active ? C.pink : C.textMuted} />}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: active ? 600 : 500, color: done ? C.green : active ? C.text : C.textLight }}>
                      {step.title}
                      {step.required && !done && <span style={{ color: C.red, marginLeft: 4, fontSize: 10 }}>*</span>}
                    </div>
                    <div style={{ fontSize: 10, color: C.textMuted }}>{done ? t('wiz.completed') : step.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Content area */}
          <div style={{ flex: 1, padding: "32px 48px", overflow: "auto" }}>
            {/* ─── Step 1: Company ─── */}
            {currentStep.id === "company" && (
              <div className="iz-fade-up">
                <h2 style={{ fontSize: 22, fontWeight: 700, color: C.text, margin: "0 0 4px" }}>{t('wiz.tell_us')}</h2>
                <p style={{ fontSize: 13, color: C.textMuted, margin: "0 0 28px" }}>{t('wiz.tell_us_desc')}</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, maxWidth: 600 }}>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>{t('wiz.company_name')} *</label>
                    <input value={setupData.company_name} onChange={e => setSetupData(d => ({ ...d, company_name: e.target.value }))} placeholder="Ex: Acme SA" style={{ ...sInput, fontSize: 14, padding: "12px 16px" }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>{t('wiz.sector')}</label>
                    <select value={setupData.sector} onChange={e => setSetupData(d => ({ ...d, sector: e.target.value }))} style={{ ...sInput, fontSize: 13, padding: "12px 16px", cursor: "pointer" }}>
                      <option value="">{t('wiz.select')}</option>
                      {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>{t('wiz.company_size')}</label>
                    <select value={setupData.company_size} onChange={e => setSetupData(d => ({ ...d, company_size: e.target.value }))} style={{ ...sInput, fontSize: 13, padding: "12px 16px", cursor: "pointer" }}>
                      <option value="">{t('wiz.select')}</option>
                      {COMPANY_SIZES.map(s => <option key={s} value={s}>{s} {t('wiz.employees')}</option>)}
                    </select>
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>{t('wiz.main_site')}</label>
                    <input value={setupData.site_principal} onChange={e => setSetupData(d => ({ ...d, site_principal: e.target.value }))} placeholder={lang === "fr" ? "Ex: Genève, Siège social" : "E.g.: Geneva, Headquarters"} style={{ ...sInput, fontSize: 13, padding: "12px 16px" }} />
                  </div>
                </div>
              </div>
            )}

            {/* ─── Step 2: Appearance ─── */}
            {currentStep.id === "appearance" && (
              <div className="iz-fade-up">
                <h2 style={{ fontSize: 22, fontWeight: 700, color: C.text, margin: "0 0 4px" }}>{t('wiz.customize')}</h2>
                <p style={{ fontSize: 13, color: C.textMuted, margin: "0 0 28px" }}>{t('wiz.customize_desc')}</p>
                {/* Logo upload retiré : le logo Illizeo est hardcodé sur le
                    shell auth et la sidebar (politique brand). Le client ne
                    peut plus le changer ici. Seule la couleur de thème reste
                    customisable. */}
                <div style={{ maxWidth: 600 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 8 }}>{t('wiz.theme_color')}</label>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {["#E41076","#1A73E8","#2E7D32","#7B5EA7","#E65100","#37474F","#C62828","#00897B"].map(color => (
                      <button key={color} onClick={() => { saveSetting("theme_color", color, setThemeColor); }} style={{ width: 40, height: 40, borderRadius: "50%", background: color, border: themeColor === color ? `3px solid ${C.text}` : "3px solid transparent", cursor: "pointer", transition: "all .15s" }} />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ─── Step 3: Team ─── */}
            {currentStep.id === "team" && (
              <div className="iz-fade-up">
                <h2 style={{ fontSize: 22, fontWeight: 700, color: C.text, margin: "0 0 4px" }}>{t('wiz.invite_team')}</h2>
                <p style={{ fontSize: 13, color: C.textMuted, margin: "0 0 28px" }}>{t('wiz.invite_team_desc')}</p>
                <div style={{ maxWidth: 550, display: "flex", flexDirection: "column", gap: 12 }}>
                  {setupData.invited_emails.map((email: string, i: number) => (
                    <div key={i} style={{ display: "flex", gap: 10, alignItems: "center" }}>
                      <input value={email} onChange={e => { const arr = [...setupData.invited_emails]; arr[i] = e.target.value; setSetupData(d => ({ ...d, invited_emails: arr })); }} placeholder={`email${i+1}@entreprise.com`} style={{ ...sInput, flex: 2, fontSize: 13, padding: "10px 14px" }} />
                      <select value={setupData.invited_roles[i]} onChange={e => { const arr = [...setupData.invited_roles]; arr[i] = e.target.value; setSetupData(d => ({ ...d, invited_roles: arr })); }} style={{ ...sInput, flex: 1, fontSize: 12, padding: "10px 14px", cursor: "pointer" }}>
                        <option value="admin_rh">Admin RH</option>
                        <option value="manager">Manager</option>
                        <option value="onboardee">Collaborateur</option>
                      </select>
                      {i === setupData.invited_emails.length - 1 && (
                        <button onClick={() => setSetupData(d => ({ ...d, invited_emails: [...d.invited_emails, ""], invited_roles: [...d.invited_roles, "onboardee"] }))} style={{ background: "none", border: "none", cursor: "pointer", color: C.pink, padding: 4 }}><Plus size={18} /></button>
                      )}
                    </div>
                  ))}
                  <button onClick={async () => {
                    const validEmails = setupData.invited_emails.filter((e: string) => e.trim() && e.includes("@"));
                    if (validEmails.length === 0) { addToast_admin(t('wiz.add_valid_email')); return; }
                    let sent = 0;
                    let failed = 0;
                    // Use the new inviteUser endpoint: backend generates an
                    // unguessable random password + a signup token, and emails
                    // a "set your password" link. No more shared "Welcome1!"
                    // password sitting in everyone's account.
                    for (let i = 0; i < setupData.invited_emails.length; i++) {
                      const email = setupData.invited_emails[i].trim();
                      if (!email || !email.includes("@")) continue;
                      try {
                        await inviteUser({ email, name: email.split("@")[0], role: setupData.invited_roles[i] });
                        sent++;
                      } catch { failed++; }
                    }
                    if (sent > 0) { addToast_admin(`${sent} ${t('wiz.invitations_sent')}`); markSetupStepDone("team"); }
                    if (failed > 0) addToast_admin(`${failed} ${lang === "fr" ? "invitation(s) échouée(s) — adresse déjà utilisée ou erreur" : "invitation(s) failed — email already used or error"}`);
                  }} className="iz-btn-pink" style={{ ...sBtn("pink"), alignSelf: "flex-start", display: "flex", alignItems: "center", gap: 6 }}><Send size={14} /> {t('wiz.send_invitations')}</button>
                </div>
              </div>
            )}

            {/* ─── Step 4: Parcours ─── */}
            {currentStep.id === "parcours" && (
              <div className="iz-fade-up">
                <h2 style={{ fontSize: 22, fontWeight: 700, color: C.text, margin: "0 0 4px" }}>{t('wiz.onboarding_path')}</h2>
                <p style={{ fontSize: 13, color: C.textMuted, margin: "0 0 28px" }}>{t('wiz.onboarding_path_desc')}</p>
                {PARCOURS_TEMPLATES.filter(p => p.status === "actif").length > 0 ? (
                  <div style={{ maxWidth: 600 }}>
                    {PARCOURS_TEMPLATES.filter(p => p.status === "actif").slice(0, 3).map(p => (
                      <div key={p.id} className="iz-card" style={{ ...sCard, padding: "16px 20px", marginBottom: 12, display: "flex", alignItems: "center", gap: 16 }}>
                        <div style={{ width: 44, height: 44, borderRadius: 12, background: C.pinkBg, display: "flex", alignItems: "center", justifyContent: "center" }}><Route size={20} color={C.pink} /></div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 15, fontWeight: 600, color: C.text }}>{p.nom}</div>
                          <div style={{ fontSize: 12, color: C.textMuted }}>{p.phases.length} {t('wiz.phases')} · {p.actionsCount} {t('wiz.actions')} · {p.docsCount} {t('wiz.documents')}</div>
                        </div>
                        <span style={{ padding: "3px 10px", borderRadius: 6, fontSize: 10, fontWeight: 600, background: C.greenLight, color: C.green }}>{t('wiz.active')}</span>
                      </div>
                    ))}
                    <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                      <button onClick={() => { markSetupStepDone("parcours"); }} className="iz-btn-pink" style={{ ...sBtn("pink"), display: "flex", alignItems: "center", gap: 6 }}><Check size={14} /> {t('wiz.default_ok')}</button>
                      <button onClick={() => { setShowSetupWizard(false); setAdminPage("admin_parcours"); }} className="iz-btn-outline" style={{ ...sBtn("outline"), display: "flex", alignItems: "center", gap: 6 }}><FilePen size={14} /> {t('wiz.customize_btn')}</button>
                    </div>

                    {/* Completion card — Parcours est désormais la dernière
                        étape du wizard (4 étapes au total : Entreprise ·
                        Apparence · Équipe · Parcours). */}
                    <div style={{ marginTop: 32, padding: "28px 32px", borderRadius: 16, background: C.bg, border: `1px solid ${C.border}` }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                        <PartyPopper size={28} color={C.pink} />
                        <div>
                          <div style={{ fontSize: 18, fontWeight: 700, color: C.text }}>{t('wiz.almost_done')}</div>
                          <div style={{ fontSize: 12, color: C.textMuted }}>{setupCompleted.length}/{SETUP_STEPS.length} {t('wiz.steps_completed')}</div>
                        </div>
                      </div>
                      <p style={{ fontSize: 13, color: C.textLight, lineHeight: 1.6, margin: "0 0 16px" }}>
                        {t('wiz.finalize_desc')}
                      </p>
                      <label style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "12px 14px", borderRadius: 10, background: C.white, border: `1px solid ${C.border}`, cursor: "pointer", marginBottom: 16 }}>
                        <input type="checkbox" id="purge-demo" style={{ marginTop: 2, accentColor: C.pink, width: 16, height: 16 }} />
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{t('wiz.purge_demo')}</div>
                          <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>{t('wiz.purge_demo_desc')}</div>
                        </div>
                      </label>
                      <button onClick={async () => {
                        const purgeCheckbox = document.getElementById('purge-demo') as HTMLInputElement;
                        if (purgeCheckbox?.checked) {
                          try {
                            const res = await purgeDemoCollaborateurs();
                            addToast_admin(t('wiz.demo_purged') || `${res.deleted} collaborateur(s) de démo supprimé(s)`);
                            refetchCollaborateurs();
                          } catch { /* ignore */ }
                        }
                        finishSetupWizard();
                      }} className="iz-btn-pink" style={{ ...sBtn("pink"), padding: "12px 28px", fontSize: 14, display: "flex", alignItems: "center", gap: 8 }}>
                        <Sparkles size={16} /> {t('wiz.access_space')}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ padding: "40px 20px", textAlign: "center", color: C.textMuted }}>
                    <Route size={40} color={C.border} style={{ marginBottom: 12 }} />
                    <div style={{ fontSize: 14, marginBottom: 12 }}>{t('wiz.no_parcours')}</div>
                    <button onClick={() => { setShowSetupWizard(false); setAdminPage("admin_parcours"); }} className="iz-btn-pink" style={{ ...sBtn("pink") }}>{t('wiz.create_parcours')}</button>
                  </div>
                )}
              </div>
            )}

            {/* Navigation buttons */}
            {(
              <div style={{ display: "flex", gap: 10, marginTop: 32 }}>
                {setupStep > 0 && <button onClick={() => setSetupStep(s => s - 1)} className="iz-btn-outline" style={sBtn("outline")}>{t('misc.return')}</button>}
                {!currentStep.required && !setupCompleted.includes(currentStep.id) && (
                  <button onClick={() => { setSetupStep(s => s + 1); }} className="iz-btn-outline" style={{ ...sBtn("outline"), color: C.textMuted }}>{t('wiz.skip_step')}</button>
                )}
                <button onClick={async () => {
                  // Save step data and mark as done
                  if (currentStep.id === "company" && setupData.company_name.trim()) {
                    updateCompanySettings({ company_name: setupData.company_name, sector: setupData.sector, company_size: setupData.company_size, site_principal: setupData.site_principal }).catch(() => {});
                    markSetupStepDone("company");
                  } else if (currentStep.id === "appearance") { markSetupStepDone("appearance"); }
                  if (setupStep < SETUP_STEPS.length - 1) setSetupStep(s => s + 1);
                }} className="iz-btn-pink" style={{ ...sBtn("pink"), display: "flex", alignItems: "center", gap: 6 }}>
                  {t('wiz.continue')} <ChevronRight size={14} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return { renderSetupWizard, markSetupStepDone, finishSetupWizard, SETUP_STEPS };
}
