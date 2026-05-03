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
  getCollabAccompagnants, assignAccompagnant, removeAccompagnant as apiRemoveAccompagnant,
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
 * Factory: admin slide-out panels.
 */
export function createAdminPanels(ctx: any) {
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
    collabAccompagnants, setCollabAccompagnants, tenantUsersList, accompagnantDraft, setAccompagnantDraft,
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
    handleBannerFileUpload, handleSendMessage, renderActionCard, renderCompanyBlock, renderMessagerie, SIDEBAR_ITEMS, markSetupStepDone, finishSetupWizard,
    saveSetting, SETUP_STEPS,
  } = ctx;

  const renderGroupePanel = () => (
    <>
        {/* ── Groupe Create/Edit Panel ────────────────────────── */}
        {groupePanelMode !== "closed" && (
          <>
            <div onClick={() => setGroupePanelMode("closed")} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.3)", zIndex: 1000 }} />
            <div className="iz-panel" style={{ position: "fixed", top: 0, right: 0, width: 520, height: "100vh", background: C.white, boxShadow: "-4px 0 24px rgba(0,0,0,.1)", zIndex: 1001, display: "flex", flexDirection: "column" }}>
              <div style={{ padding: "24px 28px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>{groupePanelMode === "create" ? "Nouveau groupe" : "Modifier le groupe"}</h2>
                <button onClick={() => setGroupePanelMode("closed")} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={22} color={C.textLight} /></button>
              </div>
              <div style={{ flex: 1, padding: "24px 28px", overflow: "auto" }}>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Nom du groupe *</label>
                  <TranslatableField value={groupePanelData.nom} onChange={v => setGroupePanelData(prev => ({ ...prev, nom: v }))} placeholder="Ex: Nouveaux arrivants Paris" currentLang={lang} activeLangs={activeLanguages} translations={contentTranslations.nom} onTranslationsChange={tr => setTr("nom", tr)} />
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Description</label>
                  <TranslatableField multiline rows={2} value={groupePanelData.description} onChange={v => setGroupePanelData(prev => ({ ...prev, description: v }))} placeholder="Description du groupe..." currentLang={lang} activeLangs={activeLanguages} translations={contentTranslations.description} onTranslationsChange={tr => setTr("description", tr)} />
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>{t('phase.color')}</label>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {["#E41076", "#1A73E8", "#4CAF50", "#F9A825", "#7B5EA7", "#E53935", "#00897B", "#F57C00"].map(col => (
                      <button key={col} onClick={() => setGroupePanelData(prev => ({ ...prev, couleur: col }))} style={{
                        width: 36, height: 36, borderRadius: 10, background: col, border: groupePanelData.couleur === col ? `3px solid ${C.dark}` : "3px solid transparent", cursor: "pointer", transition: "all .15s",
                      }} />
                    ))}
                  </div>
                </div>
                <div style={{ marginBottom: 20, padding: "16px", background: C.bg, borderRadius: 10 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: C.text, marginBottom: 10 }}>Critère automatique (optionnel)</div>
                  <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 10 }}>Les collaborateurs correspondants seront ajoutés automatiquement</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 600, color: C.textLight, display: "block", marginBottom: 4 }}>Type</label>
                      <select value={groupePanelData.critereType} onChange={e => setGroupePanelData(prev => ({ ...prev, critereType: e.target.value, critereValeur: "" }))} style={{ ...sInput, fontSize: 12, cursor: "pointer" }}>
                        <option value="">Aucun</option>
                        <option value="site">Site</option>
                        <option value="departement">Département</option>
                        <option value="contrat">Type de contrat</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 600, color: C.textLight, display: "block", marginBottom: 4 }}>Valeur</label>
                      <select value={groupePanelData.critereValeur} onChange={e => setGroupePanelData(prev => ({ ...prev, critereValeur: e.target.value }))} disabled={!groupePanelData.critereType} style={{ ...sInput, fontSize: 12, cursor: "pointer", opacity: groupePanelData.critereType ? 1 : 0.5 }}>
                        <option value="">Sélectionner...</option>
                        {groupePanelData.critereType === "site" && SITES.map(s => <option key={s} value={s}>{s}</option>)}
                        {groupePanelData.critereType === "departement" && DEPARTEMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                        {groupePanelData.critereType === "contrat" && TYPES_CONTRAT.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Membres</label>
                  <div style={{ border: `1px solid ${C.border}`, borderRadius: 8, maxHeight: 200, overflow: "auto" }}>
                    {COLLABORATEURS.map(c => {
                      const fullName = `${c.prenom} ${c.nom}`;
                      const checked = (groupePanelData.membres || []).includes(fullName);
                      return (
                        <label key={c.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", cursor: "pointer", borderBottom: `1px solid ${C.border}`, background: checked ? C.pinkBg : "transparent", transition: "all .15s" }}>
                          <input type="checkbox" checked={checked} onChange={() => {
                            setGroupePanelData(prev => ({
                              ...prev,
                              membres: checked ? prev.membres.filter(m => m !== fullName) : [...prev.membres, fullName],
                            }));
                          }} style={{ accentColor: C.pink }} />
                          <div style={{ width: 28, height: 28, borderRadius: "50%", background: c.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 600, color: C.white, flexShrink: 0 }}>{c.initials}</div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 13, fontWeight: checked ? 600 : 400 }}>{fullName}</div>
                            <div style={{ fontSize: 10, color: C.textMuted }}>{c.poste} · {c.site}</div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                  <div style={{ fontSize: 11, color: C.textMuted, marginTop: 4 }}>{(groupePanelData.membres || []).length} membre(s) sélectionné(s)</div>
                </div>
              </div>
              <div style={{ padding: "16px 28px", borderTop: `1px solid ${C.border}`, display: "flex", gap: 12, justifyContent: "space-between" }}>
                <div>
                  {groupePanelMode === "edit" && (
                    <button onClick={() => {
                      if (!groupePanelData.id) return;
                      const id = groupePanelData.id;
                      setConfirmDialog({ message: "Supprimer ce groupe ?", onConfirm: async () => {
                        try { await apiDeleteGroupe(id); addToast_admin("Groupe supprimé"); setGroupePanelMode("closed"); refetchGroupes(); } catch { addToast_admin(t('toast.error')); }
                        setConfirmDialog(null);
                      }});
                    }} style={{ ...sBtn("outline"), color: C.red, borderColor: C.red, fontSize: 13 }}>{t('common.delete')}</button>
                  )}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => setGroupePanelMode("closed")} style={{ ...sBtn("outline"), fontSize: 13 }}>{t('common.cancel')}</button>
                  <button disabled={groupePanelLoading || !groupePanelData.nom.trim()} onClick={async () => {
                    setGroupePanelLoading(true);
                    const payload: Record<string, any> = { nom: groupePanelData.nom.trim(), description: groupePanelData.description, couleur: groupePanelData.couleur, translations: buildTranslationsPayload() };
                    if (groupePanelData.critereType) { payload.critere_type = groupePanelData.critereType; payload.critere_valeur = groupePanelData.critereValeur; }
                    else { payload.critere_type = null; payload.critere_valeur = null; }
                    try {
                      if (groupePanelMode === "create") { await apiCreateGroupe(payload); addToast_admin("Groupe créé"); }
                      else { await apiUpdateGroupe(groupePanelData.id!, payload); addToast_admin("Groupe modifié"); }
                      setGroupePanelMode("closed"); refetchGroupes();
                    } catch { addToast_admin(t('toast.error')); }
                    finally { setGroupePanelLoading(false); }
                  }} className="iz-btn-pink" style={{ ...sBtn("pink"), fontSize: 13, opacity: groupePanelLoading || !groupePanelData.nom.trim() ? 0.6 : 1 }}>
                    {groupePanelLoading ? "..." : groupePanelMode === "create" ? "Créer le groupe" : "Enregistrer"}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
    </>
  );

  const renderActionPanel = () => (
    <>
        {/* ── Action Create/Edit Panel ────────────────────────── */}
        {actionPanelMode !== "closed" && (
          <>
            <div onClick={() => setActionPanelMode("closed")} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.3)", zIndex: 1000 }} />
            <div className="iz-panel" style={{ position: "fixed", top: 0, right: 0, width: 560, height: "100vh", background: C.white, boxShadow: "-4px 0 24px rgba(0,0,0,.1)", zIndex: 1001, display: "flex", flexDirection: "column" }}>
              <div style={{ padding: "24px 28px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>{actionPanelMode === "create" ? "Nouvelle action" : "Modifier l'action"}</h2>
                <button onClick={() => setActionPanelMode("closed")} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={22} color={C.textLight} /></button>
              </div>
              <div style={{ flex: 1, padding: "24px 28px", overflow: "auto" }}>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Titre de l'action *</label>
                  <TranslatableField value={actionPanelData.titre} onChange={v => setActionPanelData(prev => ({ ...prev, titre: v }))} placeholder="Ex: Signer la charte informatique" currentLang={lang} activeLangs={activeLanguages} translations={contentTranslations.titre} onTranslationsChange={tr => setTr("titre", tr)} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Type *</label>
                    <select value={actionPanelData.type} onChange={e => {
                      const newType = e.target.value as ActionType;
                      setActionPanelData(prev => ({ ...prev, type: newType }));
                      // Checklist IT belongs to the IT team, not the onboardee — auto-target
                      // the "Équipe IT" group so the action shows up in their queue, not the
                      // collaborateur's parcours.
                      if (newType === "checklist_it") {
                        const itGroup = (GROUPES as any[])?.find(g => g.nom === "Équipe IT");
                        if (itGroup) { setAssignMode("groupe"); setAssignSelected([itGroup.nom]); }
                      }
                    }} style={{ ...sInput, cursor: "pointer" }}>
                      {(Object.entries(ACTION_TYPE_META) as [ActionType, any][]).map(([slug, meta]) => (
                        <option key={slug} value={slug}>{meta.label}</option>
                      ))}
                    </select>
                    {(() => {
                      const meta: any = ACTION_TYPE_META[actionPanelData.type] || ACTION_TYPE_META.tache;
                      return meta.description ? (
                        <div style={{ marginTop: 8, padding: "8px 12px", background: meta.bg, borderRadius: 6, fontSize: 11, color: meta.color, lineHeight: 1.5, display: "flex", gap: 8, alignItems: "flex-start" }}>
                          <span style={{ flexShrink: 0, fontWeight: 700 }}>ℹ</span>
                          <span style={{ color: C.text }}>{meta.description}</span>
                        </div>
                      ) : null;
                    })()}
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Délai relatif</label>
                    <select value={actionPanelData.delaiRelatif || "J+0"} onChange={e => setActionPanelData(prev => ({ ...prev, delaiRelatif: e.target.value }))} style={{ ...sInput, cursor: "pointer" }}>
                      <option value="J-90">J-90</option><option value="J-60">J-60</option><option value="J-45">J-45</option>
                      <option value="J-30">J-30</option><option value="J-21">J-21</option><option value="J-14">J-14</option>
                      <option value="J-7">J-7</option><option value="J-3">J-3</option><option value="J-1">J-1</option>
                      <option value="J+0">J+0</option><option value="J+1">J+1</option><option value="J+3">J+3</option>
                      <option value="J+7">J+7</option><option value="J+8">J+8</option><option value="J+14">J+14</option>
                      <option value="J+15">J+15</option><option value="J+30">J+30</option><option value="J+60">J+60</option>
                      <option value="J+90">J+90</option>
                    </select>
                  </div>
                </div>

                {/* XP + heure (si meeting) + responsable */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>XP gagnés</label>
                    <input type="number" min={0} max={1000} value={(actionPanelData as any).xp ?? 50}
                      onChange={e => setActionPanelData((prev: any) => ({ ...prev, xp: parseInt(e.target.value, 10) || 0 }))}
                      style={{ ...sInput, fontSize: 12 }} />
                  </div>
                  {(["entretien", "visite", "rdv"].includes(actionPanelData.type)) && (
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>
                        Heure {actionPanelData.type === "entretien" ? "de l'entretien" : actionPanelData.type === "visite" ? "de la visite" : "du RDV"}
                      </label>
                      <input type="time" value={(actionPanelData as any).heureDefault || ""}
                        onChange={e => setActionPanelData((prev: any) => ({ ...prev, heureDefault: e.target.value }))}
                        style={{ ...sInput, fontSize: 12 }} />
                    </div>
                  )}
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Responsable</label>
                    <select value={(actionPanelData as any).accompagnantRole || ""}
                      onChange={e => setActionPanelData((prev: any) => ({ ...prev, accompagnantRole: e.target.value || null }))}
                      style={{ ...sInput, fontSize: 12, cursor: "pointer" }}>
                      <option value="">— Personne assignée —</option>
                      <option value="manager">Manager</option>
                      <option value="buddy">Buddy / Parrain</option>
                      <option value="hrbp">HRBP</option>
                      <option value="it">IT Support</option>
                      <option value="admin_rh">Admin RH</option>
                    </select>
                  </div>
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Phases associées</label>
                  <div style={{ border: `1px solid ${C.border}`, borderRadius: 8, maxHeight: 220, overflow: "auto" }}>
                    {PHASE_DEFAULTS.filter(ph => {
                      // Filter by selected parcours if set
                      if (!actionPanelData.parcours_id) return true;
                      const phParcours = (ph as any).parcours_id || (ph as any).parcours_ids || [];
                      if (Array.isArray(phParcours)) return phParcours.includes(actionPanelData.parcours_id) || phParcours.length === 0;
                      return phParcours === actionPanelData.parcours_id || !phParcours;
                    }).map(ph => {
                      const checked = (actionPanelData.phaseIds || []).includes(ph.id);
                      const phParcours = (ph as any).parcoursNoms || [];
                      return (
                        <label key={ph.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", cursor: "pointer", borderBottom: `1px solid ${C.border}`, background: checked ? `${(ph.couleur || '#999')}15` : "transparent", transition: "all .15s" }}>
                          <input type="checkbox" checked={checked} onChange={() => {
                            setActionPanelData(prev => ({
                              ...prev,
                              phaseIds: checked ? prev.phaseIds.filter(id => id !== ph.id) : [...prev.phaseIds, ph.id],
                            }));
                          }} style={{ accentColor: C.pink }} />
                          <div style={{ width: 8, height: 8, borderRadius: "50%", background: ph.couleur || "#999", flexShrink: 0 }} />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 13, fontWeight: checked ? 600 : 400, color: C.text }}>{ph.nom}</div>
                            {phParcours.length > 0 && <div style={{ fontSize: 10, color: C.textMuted }}>{phParcours.join(", ")}</div>}
                          </div>
                          <span style={{ fontSize: 10, color: C.textLight }}>{ph.delaiDebut} → {ph.delaiFin}</span>
                        </label>
                      );
                    })}
                  </div>
                  {(actionPanelData.phaseIds || []).length === 0 && (
                    <div style={{ fontSize: 11, color: C.textMuted, marginTop: 4 }}>Aucune phase sélectionnée</div>
                  )}
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Description</label>
                  <TranslatableField multiline rows={3} value={actionPanelData.description} onChange={v => setActionPanelData(prev => ({ ...prev, description: v }))} placeholder="Décrivez l'action..." currentLang={lang} activeLangs={activeLanguages} translations={contentTranslations.description} onTranslationsChange={tr => setTr("description", tr)} style={{ minHeight: 80 }} />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, padding: "12px 14px", background: C.bg, borderRadius: 10, cursor: "pointer" }}
                  onClick={() => setActionPanelData(prev => ({ ...prev, obligatoire: !prev.obligatoire }))}>
                  <div style={{ width: 20, height: 20, borderRadius: 4, border: `2px solid ${actionPanelData.obligatoire ? C.pink : C.border}`, background: actionPanelData.obligatoire ? C.pink : C.white, display: "flex", alignItems: "center", justifyContent: "center", transition: "all .15s" }}>
                    {actionPanelData.obligatoire && <Check size={14} color={C.white} />}
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 500 }}>Action obligatoire</span>
                </div>
                {/* ── Type-specific fields ────────────────────── */}
                <div style={{ padding: "16px", background: C.bg, borderRadius: 10, marginBottom: 20 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: C.textMuted, textTransform: "uppercase", letterSpacing: .5, marginBottom: 12 }}>
                    Options — {(ACTION_TYPE_META[actionPanelData.type] || ACTION_TYPE_META.tache).label}
                  </div>

                  {/* Document */}
                  {actionPanelData.type === "document" && (<>
                    <div style={{ marginBottom: 12 }}>
                      <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Pièces requises</label>
                      {(actionPanelData.options.pieces || []).map((p: string, i: number) => (
                        <div key={i} style={{ display: "flex", gap: 6, marginBottom: 4 }}>
                          <input value={p} onChange={e => { const arr = [...(actionPanelData.options.pieces || [])]; arr[i] = e.target.value; setActionPanelData(prev => ({ ...prev, options: { ...prev.options, pieces: arr } })); }} style={{ ...sInput, flex: 1, padding: "6px 10px", fontSize: 12 }} />
                          <button onClick={() => { const arr = (actionPanelData.options.pieces || []).filter((_: any, j: number) => j !== i); setActionPanelData(prev => ({ ...prev, options: { ...prev.options, pieces: arr } })); }} style={{ background: "none", border: "none", cursor: "pointer", color: C.red }}><X size={14} /></button>
                        </div>
                      ))}
                      <button onClick={() => setActionPanelData(prev => ({ ...prev, options: { ...prev.options, pieces: [...(prev.options.pieces || []), ""] } }))} style={{ fontSize: 11, color: C.pink, background: "none", border: "none", cursor: "pointer", fontWeight: 600, fontFamily: font, padding: "4px 0" }}>+ Ajouter une pièce</button>
                    </div>
                    <div><label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Fichiers acceptés</label>
                      <input value={actionPanelData.options.fichiersAcceptes || ""} onChange={e => setActionPanelData(prev => ({ ...prev, options: { ...prev.options, fichiersAcceptes: e.target.value } }))} placeholder="PDF, Image, Word..." style={{ ...sInput, fontSize: 12 }} />
                    </div>
                  </>)}

                  {/* Formulaire */}
                  {actionPanelData.type === "formulaire" && (<>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Champs du formulaire</label>
                      {(actionPanelData.options.champs || []).map((ch: any, i: number) => (
                        <div key={i} style={{ marginBottom: 6 }}>
                          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                            <input value={ch.label || ""} onChange={e => { const arr = [...(actionPanelData.options.champs || [])]; arr[i] = { ...arr[i], label: e.target.value }; setActionPanelData(prev => ({ ...prev, options: { ...prev.options, champs: arr } })); }} placeholder="Label" style={{ ...sInput, flex: 2, padding: "6px 10px", fontSize: 12 }} />
                            <select value={ch.type || "texte"} onChange={e => { const arr = [...(actionPanelData.options.champs || [])]; arr[i] = { ...arr[i], type: e.target.value }; setActionPanelData(prev => ({ ...prev, options: { ...prev.options, champs: arr } })); }} style={{ ...sInput, flex: 1, padding: "6px 10px", fontSize: 12, cursor: "pointer" }}>
                              <option value="texte">Texte</option><option value="nombre">Nombre</option><option value="date">Date</option><option value="email">Email</option><option value="choix">Choix</option><option value="textarea">Zone texte</option><option value="fichier">Fichier</option>
                            </select>
                            <label style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: C.textMuted, cursor: "pointer", whiteSpace: "nowrap" as const }}>
                              <input type="checkbox" checked={!!ch.required} onChange={e => { const arr = [...(actionPanelData.options.champs || [])]; arr[i] = { ...arr[i], required: e.target.checked }; setActionPanelData(prev => ({ ...prev, options: { ...prev.options, champs: arr } })); }} /> Obligatoire
                            </label>
                            <button onClick={() => { const arr = (actionPanelData.options.champs || []).filter((_: any, j: number) => j !== i); setActionPanelData(prev => ({ ...prev, options: { ...prev.options, champs: arr } })); }} style={{ background: "none", border: "none", cursor: "pointer", color: C.red }}><X size={14} /></button>
                          </div>
                          {ch.type === "choix" && (
                            <input
                              value={Array.isArray(ch.options) ? ch.options.join(", ") : ""}
                              onChange={e => { const arr = [...(actionPanelData.options.champs || [])]; arr[i] = { ...arr[i], options: e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean) }; setActionPanelData(prev => ({ ...prev, options: { ...prev.options, champs: arr } })); }}
                              placeholder="Choix possibles, séparés par des virgules : Oui, Non, Peut-être"
                              style={{ ...sInput, marginTop: 4, padding: "6px 10px", fontSize: 11, width: "100%", boxSizing: "border-box" as const }}
                            />
                          )}
                        </div>
                      ))}
                      <button onClick={() => setActionPanelData(prev => ({ ...prev, options: { ...prev.options, champs: [...(prev.options.champs || []), { label: "", type: "texte" }] } }))} style={{ fontSize: 11, color: C.pink, background: "none", border: "none", cursor: "pointer", fontWeight: 600, fontFamily: font, padding: "4px 0" }}>+ Ajouter un champ</button>
                    </div>
                  </>)}

                  {/* Formation */}
                  {actionPanelData.type === "formation" && (<>
                    <div style={{ marginBottom: 12 }}><label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Lien e-learning</label>
                      <input value={actionPanelData.lienExterne} onChange={e => setActionPanelData(prev => ({ ...prev, lienExterne: e.target.value }))} placeholder="https://..." style={{ ...sInput, fontSize: 12 }} /></div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      <div><label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Durée</label>
                        <input value={actionPanelData.dureeEstimee} onChange={e => setActionPanelData(prev => ({ ...prev, dureeEstimee: e.target.value }))} placeholder="30 min" style={{ ...sInput, fontSize: 12 }} /></div>
                      <div><label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Support</label>
                        <select value={actionPanelData.options.support || "video"} onChange={e => setActionPanelData(prev => ({ ...prev, options: { ...prev.options, support: e.target.value } }))} style={{ ...sInput, fontSize: 12, cursor: "pointer" }}>
                          <option value="video">Vidéo</option><option value="pdf">PDF</option><option value="scorm">SCORM</option><option value="lien">Lien externe</option>
                        </select></div>
                    </div>
                  </>)}

                  {/* Questionnaire */}
                  {actionPanelData.type === "questionnaire" && (<>
                    <div style={{ marginBottom: 12 }}>
                      <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Questions</label>
                      {(actionPanelData.options.questions || []).map((q: any, i: number) => (
                        <div key={i} style={{ display: "flex", gap: 6, marginBottom: 4 }}>
                          <input value={q.question || ""} onChange={e => { const arr = [...(actionPanelData.options.questions || [])]; arr[i] = { ...arr[i], question: e.target.value }; setActionPanelData(prev => ({ ...prev, options: { ...prev.options, questions: arr } })); }} placeholder="Question" style={{ ...sInput, flex: 2, padding: "6px 10px", fontSize: 12 }} />
                          <select value={q.type || "libre"} onChange={e => { const arr = [...(actionPanelData.options.questions || [])]; arr[i] = { ...arr[i], type: e.target.value }; setActionPanelData(prev => ({ ...prev, options: { ...prev.options, questions: arr } })); }} style={{ ...sInput, flex: 1, padding: "6px 10px", fontSize: 12, cursor: "pointer" }}>
                            <option value="libre">Texte libre</option><option value="qcm">QCM</option><option value="note">Note /10</option><option value="oui_non">Oui/Non</option>
                          </select>
                          <button onClick={() => { const arr = (actionPanelData.options.questions || []).filter((_: any, j: number) => j !== i); setActionPanelData(prev => ({ ...prev, options: { ...prev.options, questions: arr } })); }} style={{ background: "none", border: "none", cursor: "pointer", color: C.red }}><X size={14} /></button>
                        </div>
                      ))}
                      <button onClick={() => setActionPanelData(prev => ({ ...prev, options: { ...prev.options, questions: [...(prev.options.questions || []), { question: "", type: "libre" }] } }))} style={{ fontSize: 11, color: C.pink, background: "none", border: "none", cursor: "pointer", fontWeight: 600, fontFamily: font, padding: "4px 0" }}>+ Ajouter une question</button>
                    </div>
                    <div><label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Score minimum requis (%)</label>
                      <input type="number" value={actionPanelData.options.scoreMinimum || ""} onChange={e => setActionPanelData(prev => ({ ...prev, options: { ...prev.options, scoreMinimum: Number(e.target.value) } }))} placeholder="0" min={0} max={100} style={{ ...sInput, fontSize: 12, width: 100 }} /></div>
                  </>)}

                  {/* Tâche */}
                  {actionPanelData.type === "tache" && (<>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Sous-tâches (checklist)</label>
                      {(actionPanelData.options.sousTaches || []).map((st: string, i: number) => (
                        <div key={i} style={{ display: "flex", gap: 6, marginBottom: 4 }}>
                          <input value={st} onChange={e => { const arr = [...(actionPanelData.options.sousTaches || [])]; arr[i] = e.target.value; setActionPanelData(prev => ({ ...prev, options: { ...prev.options, sousTaches: arr } })); }} placeholder="Sous-tâche" style={{ ...sInput, flex: 1, padding: "6px 10px", fontSize: 12 }} />
                          <button onClick={() => { const arr = (actionPanelData.options.sousTaches || []).filter((_: any, j: number) => j !== i); setActionPanelData(prev => ({ ...prev, options: { ...prev.options, sousTaches: arr } })); }} style={{ background: "none", border: "none", cursor: "pointer", color: C.red }}><X size={14} /></button>
                        </div>
                      ))}
                      <button onClick={() => setActionPanelData(prev => ({ ...prev, options: { ...prev.options, sousTaches: [...(prev.options.sousTaches || []), ""] } }))} style={{ fontSize: 11, color: C.pink, background: "none", border: "none", cursor: "pointer", fontWeight: 600, fontFamily: font, padding: "4px 0" }}>+ Ajouter une sous-tâche</button>
                    </div>
                  </>)}

                  {/* Signature */}
                  {actionPanelData.type === "signature" && (<>
                    <div style={{ marginBottom: 12 }}>
                      <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Source du document *</label>
                      <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
                        {[{ id: "contrat", label: "Contrat personnalisé", desc: "Variables remplacées par collaborateur" }, { id: "document", label: "Document identique", desc: "Même document pour tous" }].map(src => (
                          <button key={src.id} onClick={() => setActionPanelData(prev => ({ ...prev, options: { ...prev.options, signature_source: src.id, signature_document_id: null, contrat_id: null, documentNom: "" } }))}
                            style={{ flex: 1, padding: "8px 10px", borderRadius: 8, border: `2px solid ${(actionPanelData.options.signature_source || (actionPanelData.options.contrat_id ? "contrat" : "document")) === src.id ? C.pink : C.border}`, background: (actionPanelData.options.signature_source || (actionPanelData.options.contrat_id ? "contrat" : "document")) === src.id ? C.pinkBg : C.white, cursor: "pointer", textAlign: "left", fontFamily: font }}>
                            <div style={{ fontSize: 12, fontWeight: 600, color: (actionPanelData.options.signature_source || (actionPanelData.options.contrat_id ? "contrat" : "document")) === src.id ? C.pink : C.text }}>{src.label}</div>
                            <div style={{ fontSize: 10, color: C.textMuted }}>{src.desc}</div>
                          </button>
                        ))}
                      </div>

                      {/* Contrat selector */}
                      {(actionPanelData.options.signature_source || (actionPanelData.options.contrat_id ? "contrat" : "document")) === "contrat" && (
                        <select value={actionPanelData.options.contrat_id || ""} onChange={e => {
                          const cId = e.target.value ? Number(e.target.value) : null;
                          const c = contrats.find((c: any) => c.id === cId);
                          setActionPanelData(prev => ({ ...prev, options: { ...prev.options, contrat_id: cId, signature_document_id: null, documentNom: c?.nom || "", signature_source: "contrat" } }));
                        }} style={{ ...sInput, fontSize: 12, cursor: "pointer" }}>
                          <option value="">— Sélectionner un contrat —</option>
                          {contrats.filter((c: any) => c.actif).map((c: any) => (
                            <option key={c.id} value={c.id}>{c.nom} ({c.type} — {c.juridiction})</option>
                          ))}
                        </select>
                      )}

                      {/* Document à signer selector */}
                      {(actionPanelData.options.signature_source || "document") === "document" && !actionPanelData.options.contrat_id && (
                        <select value={actionPanelData.options.signature_document_id || ""} onChange={e => {
                          const docId = e.target.value ? Number(e.target.value) : null;
                          const doc = signDocs.find((d: any) => d.id === docId);
                          setActionPanelData(prev => ({ ...prev, options: { ...prev.options, signature_document_id: docId, contrat_id: null, documentNom: doc?.titre || "", signature_source: "document" } }));
                        }} style={{ ...sInput, fontSize: 12, cursor: "pointer" }}>
                          <option value="">— Sélectionner un document —</option>
                          {signDocs.filter((d: any) => d.actif).map((d: any) => (
                            <option key={d.id} value={d.id}>{d.titre} ({d.type === "lecture" ? "Lecture" : "Signature"})</option>
                          ))}
                        </select>
                      )}
                    </div>
                    <div style={{ marginBottom: 12 }}><label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Fournisseur de signature</label>
                      {(() => {
                      const sigIntegrations = (integrations || []).filter((i: any) => i.categorie === "signature");
                      const defaultProv = sigIntegrations.find((i: any) => i.config?.is_default)?.provider || "native";
                      const currentProv = actionPanelData.options.provider || defaultProv;
                      return (
                      <select value={currentProv} onChange={e => setActionPanelData(prev => ({ ...prev, options: { ...prev.options, provider: e.target.value } }))} style={{ ...sInput, fontSize: 12, cursor: "pointer" }}>
                        {sigIntegrations.map((si: any) => {
                          const connected = si.connecte || si.provider === "native";
                          return <option key={si.id} value={si.provider}>{si.nom}{connected ? "" : " (non connecté)"}</option>;
                        })}
                      </select>
                      );
                    })()}
                      {(actionPanelData.options.provider === "docusign" || actionPanelData.options.provider === "ugosign") && (
                        <div style={{ marginTop: 8, padding: "10px 12px", background: C.amberLight, borderRadius: 8, fontSize: 11, color: C.amber, display: "flex", alignItems: "center", gap: 6 }}>
                          <AlertTriangle size={13} /> Configurez le connecteur dans Intégrations pour activer ce fournisseur
                        </div>
                      )}
                    </div>
                    <div><label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Options</label>
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, cursor: "pointer" }}>
                          <input type="checkbox" checked={actionPanelData.options.rappelAuto !== false} onChange={e => setActionPanelData(prev => ({ ...prev, options: { ...prev.options, rappelAuto: e.target.checked } }))} style={{ accentColor: C.pink }} />
                          Rappel automatique si non signé après 48h
                        </label>
                        <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, cursor: "pointer" }}>
                          <input type="checkbox" checked={!!actionPanelData.options.certifie} onChange={e => setActionPanelData(prev => ({ ...prev, options: { ...prev.options, certifie: e.target.checked } }))} style={{ accentColor: C.pink }} />
                          Signature certifiée (valeur légale)
                        </label>
                      </div>
                    </div>
                  </>)}

                  {/* Lecture */}
                  {actionPanelData.type === "lecture" && (() => {
                    const lectureDocs = (signDocs || []).filter((d: any) => d.actif && d.type === "lecture");
                    const currentSource = actionPanelData.options.lecture_source || (actionPanelData.options.signature_document_id ? "document" : "url");
                    return (<>
                      <div style={{ marginBottom: 12 }}>
                        <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Source du document *</label>
                        <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
                          {[{ id: "document", label: "Document interne", desc: "PDF téléversé dans Documents" }, { id: "url", label: "Lien externe", desc: "URL vers une ressource en ligne" }].map(src => (
                            <button key={src.id} onClick={() => setActionPanelData(prev => ({ ...prev, lienExterne: src.id === "url" ? prev.lienExterne : "", options: { ...prev.options, lecture_source: src.id, signature_document_id: src.id === "document" ? prev.options.signature_document_id : null, documentNom: "" } }))}
                              style={{ flex: 1, padding: "8px 10px", borderRadius: 8, border: `2px solid ${currentSource === src.id ? C.pink : C.border}`, background: currentSource === src.id ? C.pinkBg : C.white, cursor: "pointer", textAlign: "left", fontFamily: font }}>
                              <div style={{ fontSize: 12, fontWeight: 600, color: currentSource === src.id ? C.pink : C.text }}>{src.label}</div>
                              <div style={{ fontSize: 10, color: C.textMuted }}>{src.desc}</div>
                            </button>
                          ))}
                        </div>
                        {currentSource === "document" && (
                          <>
                            <select value={actionPanelData.options.signature_document_id || ""} onChange={e => {
                              const docId = e.target.value ? Number(e.target.value) : null;
                              const doc = lectureDocs.find((d: any) => d.id === docId);
                              setActionPanelData(prev => ({ ...prev, lienExterne: "", options: { ...prev.options, signature_document_id: docId, documentNom: doc?.titre || "", lecture_source: "document" } }));
                            }} style={{ ...sInput, fontSize: 12, cursor: "pointer" }}>
                              <option value="">— Sélectionner un document à lire —</option>
                              {lectureDocs.map((d: any) => (
                                <option key={d.id} value={d.id}>{d.titre}{d.fichier_nom ? "" : " (PDF non téléversé)"}</option>
                              ))}
                            </select>
                            {lectureDocs.length === 0 && (
                              <div style={{ marginTop: 8, padding: "8px 12px", background: C.amberLight, borderRadius: 8, fontSize: 11, color: C.amber, display: "flex", alignItems: "center", gap: 6 }}>
                                <AlertTriangle size={13} /> Aucun document de lecture disponible. Créez-en dans <strong>Documents</strong> (type "Lecture").
                              </div>
                            )}
                          </>
                        )}
                        {currentSource === "url" && (
                          <input value={actionPanelData.lienExterne} onChange={e => setActionPanelData(prev => ({ ...prev, lienExterne: e.target.value, options: { ...prev.options, signature_document_id: null, lecture_source: "url" } }))} placeholder="https://..." style={{ ...sInput, fontSize: 12 }} />
                        )}
                      </div>
                      <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, cursor: "pointer" }}>
                        <input type="checkbox" checked={actionPanelData.options.confirmationRequise !== false} onChange={e => setActionPanelData(prev => ({ ...prev, options: { ...prev.options, confirmationRequise: e.target.checked } }))} style={{ accentColor: C.pink }} />
                        L'employé doit confirmer avoir lu le document
                      </label>
                    </>);
                  })()}

                  {/* Rendez-vous */}
                  {actionPanelData.type === "rdv" && (<>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                      <div><label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Durée</label>
                        <input value={actionPanelData.dureeEstimee} onChange={e => setActionPanelData(prev => ({ ...prev, dureeEstimee: e.target.value }))} placeholder="30 min" style={{ ...sInput, fontSize: 12 }} /></div>
                      <div><label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Lieu / Lien visio</label>
                        <input value={actionPanelData.options.lieu || ""} onChange={e => setActionPanelData(prev => ({ ...prev, options: { ...prev.options, lieu: e.target.value } }))} placeholder="Salle A ou https://meet..." style={{ ...sInput, fontSize: 12 }} /></div>
                    </div>
                    <div><label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Participants suggérés</label>
                      <input value={actionPanelData.options.participants || ""} onChange={e => setActionPanelData(prev => ({ ...prev, options: { ...prev.options, participants: e.target.value } }))} placeholder="Manager, Buddy, HRBP..." style={{ ...sInput, fontSize: 12 }} /></div>
                  </>)}

                  {/* Message */}
                  {actionPanelData.type === "message" && (<>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                      <div><label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Canal</label>
                        <select value={actionPanelData.options.canal || "inapp"} onChange={e => setActionPanelData(prev => ({ ...prev, options: { ...prev.options, canal: e.target.value } }))} style={{ ...sInput, fontSize: 12, cursor: "pointer" }}>
                          <option value="inapp">In-app</option><option value="email">Email</option><option value="slack">Slack</option><option value="teams">Teams</option>
                        </select></div>
                      <div><label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Destinataires</label>
                        <input value={actionPanelData.options.destinataires || ""} onChange={e => setActionPanelData(prev => ({ ...prev, options: { ...prev.options, destinataires: e.target.value } }))} placeholder="Équipe, Manager..." style={{ ...sInput, fontSize: 12 }} /></div>
                    </div>
                    <div><label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Template de message</label>
                      <TranslatableField multiline rows={3} value={actionPanelData.options.template || ""} onChange={v => setActionPanelData(prev => ({ ...prev, options: { ...prev.options, template: v } }))} placeholder="Bonjour, je suis {{prenom}}..." currentLang={lang} activeLangs={activeLanguages} translations={contentTranslations.template} onTranslationsChange={tr => setTr("template", tr)} style={{ fontSize: 12 }} /></div>
                  </>)}

                  {/* Entretien */}
                  {actionPanelData.type === "entretien" && (<>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                      <div><label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Durée</label>
                        <input value={actionPanelData.dureeEstimee} onChange={e => setActionPanelData(prev => ({ ...prev, dureeEstimee: e.target.value }))} placeholder="45 min" style={{ ...sInput, fontSize: 12 }} /></div>
                      <div><label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Participants</label>
                        <input value={actionPanelData.options.participants || ""} onChange={e => setActionPanelData(prev => ({ ...prev, options: { ...prev.options, participants: e.target.value } }))} placeholder="Manager, HRBP" style={{ ...sInput, fontSize: 12 }} /></div>
                    </div>
                    <div><label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Trame d'entretien</label>
                      {(actionPanelData.options.trame || []).map((q: string, i: number) => (
                        <div key={i} style={{ display: "flex", gap: 6, marginBottom: 4, alignItems: "flex-start" }}>
                          <div style={{ flex: 1 }}>
                            <TranslatableField value={q} onChange={v => { const arr = [...(actionPanelData.options.trame || [])]; arr[i] = v; setActionPanelData(prev => ({ ...prev, options: { ...prev.options, trame: arr } })); }} placeholder="Point à aborder" currentLang={lang} activeLangs={activeLanguages} translations={contentTranslations[`trame_${i}`]} onTranslationsChange={tr => setTr(`trame_${i}`, tr)} style={{ padding: "6px 10px", fontSize: 12 }} />
                          </div>
                          <button onClick={() => { const arr = (actionPanelData.options.trame || []).filter((_: any, j: number) => j !== i); setActionPanelData(prev => ({ ...prev, options: { ...prev.options, trame: arr } })); }} style={{ background: "none", border: "none", cursor: "pointer", color: C.red, marginTop: 6 }}><X size={14} /></button>
                        </div>
                      ))}
                      <button onClick={() => setActionPanelData(prev => ({ ...prev, options: { ...prev.options, trame: [...(prev.options.trame || []), ""] } }))} style={{ fontSize: 11, color: C.pink, background: "none", border: "none", cursor: "pointer", fontWeight: 600, fontFamily: font, padding: "4px 0" }}>+ Ajouter un point</button>
                    </div>
                  </>)}

                  {/* Checklist IT */}
                  {actionPanelData.type === "checklist_it" && (<>
                    <div style={{ marginBottom: 12 }}>
                      <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Éléments à vérifier</label>
                      {(actionPanelData.options.items || []).map((it: string, i: number) => (
                        <div key={i} style={{ display: "flex", gap: 6, marginBottom: 4, alignItems: "flex-start" }}>
                          <div style={{ flex: 1 }}>
                            <TranslatableField value={it} onChange={v => { const arr = [...(actionPanelData.options.items || [])]; arr[i] = v; setActionPanelData(prev => ({ ...prev, options: { ...prev.options, items: arr } })); }} placeholder="Email, VPN, Badge..." currentLang={lang} activeLangs={activeLanguages} translations={contentTranslations[`item_${i}`]} onTranslationsChange={tr => setTr(`item_${i}`, tr)} style={{ padding: "6px 10px", fontSize: 12 }} />
                          </div>
                          <button onClick={() => { const arr = (actionPanelData.options.items || []).filter((_: any, j: number) => j !== i); setActionPanelData(prev => ({ ...prev, options: { ...prev.options, items: arr } })); }} style={{ background: "none", border: "none", cursor: "pointer", color: C.red, marginTop: 6 }}><X size={14} /></button>
                        </div>
                      ))}
                      <button onClick={() => setActionPanelData(prev => ({ ...prev, options: { ...prev.options, items: [...(prev.options.items || []), ""] } }))} style={{ fontSize: 11, color: C.pink, background: "none", border: "none", cursor: "pointer", fontWeight: 600, fontFamily: font, padding: "4px 0" }}>+ Ajouter un élément</button>
                    </div>
                    <div><label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Responsable IT</label>
                      <input value={actionPanelData.options.responsableIT || ""} onChange={e => setActionPanelData(prev => ({ ...prev, options: { ...prev.options, responsableIT: e.target.value } }))} placeholder="Nom ou équipe" style={{ ...sInput, fontSize: 12 }} /></div>
                  </>)}

                  {/* Passation */}
                  {actionPanelData.type === "passation" && (<>
                    <div style={{ marginBottom: 12 }}>
                      <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Éléments à transférer</label>
                      {(actionPanelData.options.elements || []).map((el: string, i: number) => (
                        <div key={i} style={{ display: "flex", gap: 6, marginBottom: 4, alignItems: "flex-start" }}>
                          <div style={{ flex: 1 }}>
                            <TranslatableField value={el} onChange={v => { const arr = [...(actionPanelData.options.elements || [])]; arr[i] = v; setActionPanelData(prev => ({ ...prev, options: { ...prev.options, elements: arr } })); }} placeholder="Projet, Contact, Doc..." currentLang={lang} activeLangs={activeLanguages} translations={contentTranslations[`element_${i}`]} onTranslationsChange={tr => setTr(`element_${i}`, tr)} style={{ padding: "6px 10px", fontSize: 12 }} />
                          </div>
                          <button onClick={() => { const arr = (actionPanelData.options.elements || []).filter((_: any, j: number) => j !== i); setActionPanelData(prev => ({ ...prev, options: { ...prev.options, elements: arr } })); }} style={{ background: "none", border: "none", cursor: "pointer", color: C.red, marginTop: 6 }}><X size={14} /></button>
                        </div>
                      ))}
                      <button onClick={() => setActionPanelData(prev => ({ ...prev, options: { ...prev.options, elements: [...(prev.options.elements || []), ""] } }))} style={{ fontSize: 11, color: C.pink, background: "none", border: "none", cursor: "pointer", fontWeight: 600, fontFamily: font, padding: "4px 0" }}>+ Ajouter un élément</button>
                    </div>
                    <div><label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Successeur</label>
                      <input value={actionPanelData.options.successeur || ""} onChange={e => setActionPanelData(prev => ({ ...prev, options: { ...prev.options, successeur: e.target.value } }))} placeholder="Nom du successeur" style={{ ...sInput, fontSize: 12 }} /></div>
                  </>)}

                  {/* Visite */}
                  {actionPanelData.type === "visite" && (<>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                      <div><label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Lieu</label>
                        <input value={actionPanelData.options.lieu || ""} onChange={e => setActionPanelData(prev => ({ ...prev, options: { ...prev.options, lieu: e.target.value } }))} placeholder="Bureaux, Usine..." style={{ ...sInput, fontSize: 12 }} /></div>
                      <div><label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Durée</label>
                        <input value={actionPanelData.dureeEstimee} onChange={e => setActionPanelData(prev => ({ ...prev, dureeEstimee: e.target.value }))} placeholder="1h" style={{ ...sInput, fontSize: 12 }} /></div>
                    </div>
                    <div><label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Guide / Accompagnateur</label>
                      {(() => {
                        const guideVal = actionPanelData.options.guide || "";
                        const isKnownToken = /^(buddy:|manager:|rh:|user:\d+)$/.test(guideVal);
                        const isLegacyText = guideVal && !isKnownToken;
                        return (
                          <select
                            value={guideVal}
                            onChange={e => setActionPanelData(prev => ({ ...prev, options: { ...prev.options, guide: e.target.value } }))}
                            style={{ ...sInput, fontSize: 12, cursor: "pointer" }}
                          >
                            <option value="">— Aucun —</option>
                            <optgroup label="Rôles (résolus dynamiquement)">
                              <option value="buddy:">Buddy / Parrain assigné</option>
                              <option value="manager:">Manager direct</option>
                              <option value="rh:">RH / HRBP</option>
                            </optgroup>
                            <optgroup label="Collaborateur spécifique">
                              {COLLABORATEURS.map((c: any) => (
                                <option key={c.id} value={`user:${c.id}`}>{c.prenom} {c.nom}{c.poste ? ` · ${c.poste}` : ""}</option>
                              ))}
                            </optgroup>
                            {isLegacyText && (
                              <option value={guideVal}>Personnalisé : {guideVal}</option>
                            )}
                          </select>
                        );
                      })()}</div>
                  </>)}
                </div>
                {/* Parcours association */}
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Parcours associé</label>
                  <select value={actionPanelData.parcours_id || ""} onChange={e => setActionPanelData(prev => ({ ...prev, parcours_id: e.target.value ? Number(e.target.value) : null }))} style={{ ...sInput, cursor: "pointer" }}>
                    <option value="">— Aucun parcours —</option>
                    {PARCOURS_TEMPLATES.map((p: any) => <option key={p.id} value={p.id}>{p.nom}</option>)}
                  </select>
                </div>

                {/* Assignation section */}
                {actionPanelMode === "create" && (
                  <div style={{ padding: "12px 16px", background: C.bg, borderRadius: 10, marginBottom: 20, fontSize: 12, color: C.textMuted, display: "flex", alignItems: "center", gap: 8 }}>
                    <AlertTriangle size={14} color="#F9A825" />
                    Enregistrez l'action pour pouvoir l'assigner à des collaborateurs.
                  </div>
                )}
                {actionPanelMode === "edit" && actionPanelData.id && (() => {
                  const items = assignMode === "groupe"
                    ? GROUPES.map(g => ({ id: g.nom, label: g.nom, sub: `${(g.membres || []).length} membres`, color: g.couleur }))
                    : COLLABORATEURS.map(c => ({ id: String(c.id), label: `${c.prenom} ${c.nom}`, sub: `${c.poste} · ${c.site}`, color: c.color }));
                  const filtered = items.filter(i => !assignSearch || i.label.toLowerCase().includes(assignSearch.toLowerCase()));
                  return (
                  <div style={{ padding: "16px", background: C.bg, borderRadius: 10, marginBottom: 20 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: C.text, marginBottom: 10 }}>Assigner cette action</div>

                    {/* Mode tabs */}
                    <div style={{ display: "flex", gap: 4, marginBottom: 12, background: C.white, borderRadius: 8, padding: 3, border: `1px solid ${C.border}` }}>
                      {([["tous", "Tous"], ["individuel", "Par employé"], ["groupe", "Par groupe"]] as const).map(([mode, label]) => (
                        <button key={mode} onClick={() => { setAssignMode(mode); setAssignSelected([]); setAssignSearch(""); }} style={{
                          flex: 1, padding: "7px 0", borderRadius: 6, fontSize: 12, fontWeight: assignMode === mode ? 600 : 400, border: "none", cursor: "pointer", fontFamily: font,
                          background: assignMode === mode ? C.pink : "transparent", color: assignMode === mode ? C.white : C.text, transition: "all .15s",
                        }}>{label}</button>
                      ))}
                    </div>

                    {/* Picklist */}
                    {assignMode !== "tous" && (
                      <div style={{ position: "relative", marginBottom: 12 }}>
                        {/* Selected tags */}
                        <div onClick={() => setAssignOpen(!assignOpen)} style={{
                          ...sInput, minHeight: 40, display: "flex", flexWrap: "wrap", gap: 4, alignItems: "center", cursor: "pointer", padding: "6px 10px",
                          borderColor: assignOpen ? C.pink : C.border, background: C.white,
                        }}>
                          {assignSelected.length === 0 && <span style={{ color: C.textMuted, fontSize: 13 }}>Sélectionner...</span>}
                          {assignSelected.map(id => {
                            const item = items.find(i => i.id === id);
                            return item ? (
                              <span key={id} style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 8px 2px 4px", borderRadius: 6, background: C.pinkBg, fontSize: 11, fontWeight: 500, color: C.pink }}>
                                <div style={{ width: 16, height: 16, borderRadius: "50%", background: item.color || C.pink, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 700, color: C.white }}>{item.label.split(" ").map(n => n[0]).join("").slice(0, 2)}</div>
                                {item.label}
                                <button onClick={e => { e.stopPropagation(); setAssignSelected(prev => prev.filter(x => x !== id)); }} style={{ background: "none", border: "none", cursor: "pointer", color: C.pink, padding: 0, lineHeight: 1 }}><X size={10} /></button>
                              </span>
                            ) : null;
                          })}
                          <ChevronRight size={14} color={C.textMuted} style={{ marginLeft: "auto", transform: assignOpen ? "rotate(270deg)" : "rotate(90deg)", transition: "transform .15s" }} />
                        </div>

                        {/* Dropdown */}
                        {assignOpen && (
                          <div style={{ position: "absolute", top: "100%", left: 0, right: 0, zIndex: 10, background: C.white, border: `1px solid ${C.border}`, borderRadius: 8, boxShadow: "0 8px 24px rgba(0,0,0,.1)", marginTop: 4, maxHeight: 250, display: "flex", flexDirection: "column" }}>
                            {/* Search */}
                            <div style={{ padding: "8px 10px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 6 }}>
                              <Search size={14} color={C.textLight} />
                              <input value={assignSearch} onChange={e => setAssignSearch(e.target.value)} placeholder="Rechercher..." autoFocus style={{ border: "none", outline: "none", flex: 1, fontSize: 13, fontFamily: font, color: C.text, background: "transparent" }} />
                            </div>
                            {/* Items */}
                            <div style={{ overflow: "auto", flex: 1 }}>
                              {filtered.length === 0 ? (
                                <div style={{ padding: "16px", textAlign: "center", fontSize: 12, color: C.textMuted }}>{t('misc.no_result')}</div>
                              ) : filtered.map(item => {
                                const checked = assignSelected.includes(item.id);
                                return (
                                  <div key={item.id} onClick={() => { setAssignSelected(prev => checked ? prev.filter(x => x !== item.id) : [...prev, item.id]); }}
                                    style={{ padding: "9px 12px", display: "flex", alignItems: "center", gap: 10, cursor: "pointer", background: checked ? C.pinkBg : "transparent", transition: "all .1s" }}
                                    onMouseEnter={e => { if (!checked) (e.currentTarget.style.background = C.bg); }} onMouseLeave={e => { if (!checked) (e.currentTarget.style.background = "transparent"); }}>
                                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: item.color || C.pink, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 600, color: C.white, flexShrink: 0 }}>
                                      {item.label.split(" ").map(n => n[0]).join("").slice(0, 2)}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                      <div style={{ fontSize: 13, fontWeight: checked ? 600 : 400, color: C.text }}>{item.label}</div>
                                      {item.sub && <div style={{ fontSize: 10, color: C.textMuted }}>{item.sub}</div>}
                                    </div>
                                    {checked && <CheckCircle size={16} color={C.pink} />}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Summary + button */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ fontSize: 11, color: C.textMuted }}>
                        {assignMode === "tous" ? `${COLLABORATEURS.length} collaborateurs` : `${assignSelected.length} sélectionné(s)`}
                      </div>
                      <button disabled={assignMode !== "tous" && assignSelected.length === 0} onClick={async () => {
                        try {
                          const res = await apiAssignActions([actionPanelData.id!], assignMode, assignSelected);
                          addToast_admin(res.message || "Actions assignées");
                          setAssignSelected([]); setAssignOpen(false);
                        } catch { addToast_admin("Erreur d'assignation"); }
                      }} className="iz-btn-pink" style={{ ...sBtn("pink"), fontSize: 12, padding: "8px 20px", opacity: assignMode !== "tous" && assignSelected.length === 0 ? 0.5 : 1 }}>
                        Assigner
                      </button>
                    </div>
                  </div>
                  );
                })()}
              </div>
              <div style={{ padding: "16px 28px", borderTop: `1px solid ${C.border}`, display: "flex", gap: 12, justifyContent: "space-between" }}>
                <div>
                  {actionPanelMode === "edit" && (
                    <button onClick={() => {
                      if (!actionPanelData.id) return;
                      const id = actionPanelData.id;
                      setConfirmDialog({ message: "Supprimer cette action ? Elle sera retirée de tous les parcours.", onConfirm: async () => {
                        try { await apiDeleteAction(id); addToast_admin("Action supprimée"); setActionPanelMode("closed"); refetchActions(); } catch { addToast_admin("Erreur lors de la suppression"); }
                        setConfirmDialog(null);
                      }});
                    }} style={{ ...sBtn("outline"), color: C.red, borderColor: C.red, fontSize: 13 }}>{t('common.delete')}</button>
                  )}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => setActionPanelMode("closed")} style={{ ...sBtn("outline"), fontSize: 13 }}>{t('common.cancel')}</button>
                  <button disabled={actionPanelLoading || !actionPanelData.titre.trim()} onClick={async () => {
                    setActionPanelLoading(true);
                    const firstPhaseId = actionPanelData.phaseIds?.[0] || null;
                    const payload: Record<string, any> = {
                      titre: actionPanelData.titre.trim(),
                      action_type_slug: actionPanelData.type,
                      phase_id: firstPhaseId,
                      delai_relatif: actionPanelData.delaiRelatif,
                      obligatoire: actionPanelData.obligatoire,
                      description: actionPanelData.description,
                      parcours_id: actionPanelData.parcours_id || null,
                    };
                    if (actionPanelData.lienExterne) payload.lien_externe = actionPanelData.lienExterne;
                    if (actionPanelData.dureeEstimee) payload.duree_estimee = actionPanelData.dureeEstimee;
                    if ((actionPanelData as any).xp !== undefined) payload.xp = (actionPanelData as any).xp;
                    payload.heure_default = (actionPanelData as any).heureDefault || null;
                    payload.accompagnant_role = (actionPanelData as any).accompagnantRole || null;
                    if (Object.keys(actionPanelData.options).length > 0) payload.options = actionPanelData.options;
                    // Mirror options.pieces into the dedicated pieces_requises column so /me/collaborateur (which reads pieces_requises) stays in sync.
                    if (Array.isArray(actionPanelData.options?.pieces)) payload.pieces_requises = actionPanelData.options.pieces.filter((p: string) => p && p.trim());
                    const tr = buildTranslationsPayload(); if (tr) payload.translations = tr;
                    try {
                      if (actionPanelMode === "create") {
                        await apiCreateAction(payload);
                        addToast_admin("Action créée avec succès");
                      } else {
                        await apiUpdateAction(actionPanelData.id!, payload);
                        addToast_admin("Action modifiée avec succès");
                      }
                      setActionPanelMode("closed");
                      refetchActions();
                    } catch { addToast_admin(t('phase.save_error')); }
                    finally { setActionPanelLoading(false); }
                  }} className="iz-btn-pink" style={{ ...sBtn("pink"), fontSize: 13, opacity: actionPanelLoading || !actionPanelData.titre.trim() ? 0.6 : 1 }}>
                    {actionPanelLoading ? "Enregistrement..." : actionPanelMode === "create" ? "Créer l'action" : "Enregistrer"}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
    </>
  );

  const renderPromptModal = () => (
    <>
        {/* ── Prompt Modal ─────────────────────────────────── */}
        {promptModal && (
          <div style={{ position: "fixed", inset: 0, zIndex: 3000, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,.35)" }} onClick={() => setPromptModal(null)}>
            <div className="iz-fade-up" onClick={e => e.stopPropagation()} style={{ background: C.white, borderRadius: 16, padding: "28px 32px", width: 420, boxShadow: "0 12px 40px rgba(0,0,0,.18)", fontFamily: font }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: C.blueLight, display: "flex", alignItems: "center", justifyContent: "center" }}><Calendar size={20} color={C.blue} /></div>
                <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0, color: C.text }}>{promptModal.message}</h3>
              </div>
              {promptModal.label && <label style={{ fontSize: 12, color: C.textLight, marginBottom: 6, display: "block" }}>{promptModal.label}</label>}
              {promptModal.options ? (
                <>
                  {promptModal.searchable && (
                    <div style={{ position: "relative", marginBottom: 8 }}>
                      <Search size={14} style={{ position: "absolute", left: 10, top: 10, color: C.textMuted }} />
                      <input value={promptValue} onChange={e => setPromptValue(e.target.value)} placeholder={t('common.search')} style={{ ...sInput, paddingLeft: 30 }} autoFocus />
                    </div>
                  )}
                  <div style={{ maxHeight: 240, overflow: "auto", border: `1px solid ${C.border}`, borderRadius: 8, marginBottom: 20 }}>
                    {promptModal.options.filter(o => !promptValue || o.label.toLowerCase().includes(promptValue.toLowerCase())).map(o => (
                      <div key={o.value} onClick={() => { promptModal.onSubmit(o.value); setPromptModal(null); setPromptValue(""); }}
                        style={{ padding: "10px 14px", cursor: "pointer", borderBottom: `1px solid ${C.border}`, background: "transparent", transition: "all .15s", fontSize: 13 }}
                        onMouseEnter={e => { e.currentTarget.style.background = C.pinkBg; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}>
                        {o.label}
                      </div>
                    ))}
                    {promptModal.options.filter(o => !promptValue || o.label.toLowerCase().includes(promptValue.toLowerCase())).length === 0 && (
                      <div style={{ padding: "16px 14px", color: C.textMuted, fontSize: 12, textAlign: "center" }}>{t('common.no_results')}</div>
                    )}
                  </div>
                </>
              ) : (
                <input type={promptModal.type} value={promptValue} onChange={e => setPromptValue(e.target.value)} style={{ ...sInput, marginBottom: 20 }} autoFocus onKeyDown={e => { if (e.key === "Enter" && promptValue) { promptModal.onSubmit(promptValue); setPromptModal(null); } }} />
              )}
              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                <button onClick={() => { setPromptModal(null); setPromptValue(""); }} className="iz-btn-outline" style={{ ...sBtn("outline"), padding: "9px 20px" }}>{t('common.cancel')}</button>
                {!promptModal.options && <button onClick={() => { if (promptValue) { promptModal.onSubmit(promptValue); setPromptModal(null); } }} className="iz-btn-pink" style={{ ...sBtn("pink"), padding: "9px 20px" }}>{t('common.validate')}</button>}
              </div>
            </div>
          </div>
        )}
    </>
  );

  const renderCollabPanel = () => (
    <>
        {/* ── Collaborateur Create/Edit Panel (extended) ─────── */}
        {collabPanelMode !== "closed" && (() => {
          const activeFields = fieldConfig.filter(f => f.actif);
          const sections = [
            { key: "base", label: "Informations de base", fields: null },
            { key: "personal", label: "Informations personnelles", fields: activeFields.filter(f => f.section === "personal") },
            { key: "contract", label: "Informations contractuelles", fields: activeFields.filter(f => f.section === "contract") },
            { key: "job", label: "Job Information", fields: activeFields.filter(f => f.section === "job") },
            { key: "position", label: "Position Information", fields: activeFields.filter(f => f.section === "position") },
            { key: "org", label: "Informations organisationnelles", fields: activeFields.filter(f => f.section === "org") },
          ];
          const renderField = (fc: any) => {
            const isCustom = fc.field_key.startsWith("custom_");
            const val = isCustom ? ((collabPanelData as any).custom_fields || {})[fc.field_key] || "" : (collabPanelData as any)[fc.field_key] || "";
            const onChange = (v: string) => {
              if (isCustom) {
                setCollabPanelData((prev: any) => ({ ...prev, custom_fields: { ...(prev.custom_fields || {}), [fc.field_key]: v } }));
              } else {
                setCollabPanelData((prev: any) => ({ ...prev, [fc.field_key]: v }));
              }
            };
            const fType = fc.field_type || "text";
            if (fType === "list" && fc.list_values?.length > 0) return <select value={val} onChange={e => onChange(e.target.value)} style={{ ...sInput, fontSize: 12, cursor: "pointer" }}><option value="">—</option>{fc.list_values.map((v: string) => <option key={v} value={v}>{v}</option>)}</select>;
            if (fType === "date") return <input type="date" value={val} onChange={e => onChange(e.target.value)} style={{ ...sInput, fontSize: 12 }} />;
            if (fType === "number") return <input type="number" value={val} onChange={e => onChange(e.target.value)} placeholder="0" style={{ ...sInput, fontSize: 12 }} />;
            if (fType === "boolean") return (
              <div onClick={() => onChange(val === "true" ? "false" : "true")} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", padding: "8px 0" }}>
                <div style={{ width: 36, height: 20, borderRadius: 10, background: val === "true" ? C.green : C.border, position: "relative", transition: "all .2s" }}>
                  <div style={{ width: 16, height: 16, borderRadius: "50%", background: C.white, position: "absolute", top: 2, left: val === "true" ? 18 : 2, transition: "all .2s", boxShadow: "0 1px 2px rgba(0,0,0,.2)" }} />
                </div>
                <span style={{ fontSize: 12, color: C.text }}>{val === "true" ? "Oui" : "Non"}</span>
              </div>
            );
            if (fc.field_key === "adresse") return <textarea value={val} onChange={e => onChange(e.target.value)} rows={2} style={{ ...sInput, fontSize: 12, resize: "vertical" }} />;
            // Manager/HR Manager fields: render collaborateur select
            if (fc.field_key === "manager_id" || fc.field_key === "hr_manager_id" || fc.field_key === "dotted_line_manager" || fc.field_key === "manager_nom") {
              const useNameValue = fc.field_key === "manager_nom" || fc.field_key === "dotted_line_manager";
              return <select value={val} onChange={e => onChange(e.target.value)} style={{ ...sInput, fontSize: 12, cursor: "pointer" }}>
                <option value="">—</option>
                {COLLABORATEURS.filter((co: any) => co.id !== (collabPanelData as any).id).map((co: any) => <option key={co.id} value={useNameValue ? `${co.prenom} ${co.nom}` : co.id}>{co.prenom} {co.nom} — {co.poste || co.departement || ""}</option>)}
              </select>;
            }
            return <input value={val} onChange={e => onChange(e.target.value)} style={{ ...sInput, fontSize: 12 }} />;
          };
          return (
          <>
            <div onClick={() => setCollabPanelMode("closed")} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.3)", zIndex: 1000 }} />
            <div className="iz-panel" style={{ position: "fixed", top: 0, right: 0, width: "65vw", maxWidth: 1000, height: "100vh", background: C.white, boxShadow: "-4px 0 24px rgba(0,0,0,.1)", zIndex: 1001, display: "flex", flexDirection: "column" }}>
              <div style={{ padding: "24px 28px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>{collabPanelMode === "create" ? "Nouveau collaborateur" : `${collabPanelData.prenom} ${collabPanelData.nom}`}</h2>
                <button onClick={() => setCollabPanelMode("closed")} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={22} color={C.textLight} /></button>
              </div>
              <div style={{ flex: 1, padding: "24px 28px", overflow: "auto" }}>
                {/* Base fields (always visible) */}
                <div style={{ fontSize: 11, fontWeight: 700, color: C.pink, textTransform: "uppercase", letterSpacing: .5, marginBottom: 10 }}>Informations de base</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                  <div><label style={{ fontSize: 11, fontWeight: 600, color: C.text, display: "block", marginBottom: 4 }}>Prénom *</label><input value={collabPanelData.prenom} onChange={e => setCollabPanelData((prev: any) => ({ ...prev, prenom: e.target.value }))} style={{ ...sInput, fontSize: 12 }} /></div>
                  <div><label style={{ fontSize: 11, fontWeight: 600, color: C.text, display: "block", marginBottom: 4 }}>Nom *</label><input value={collabPanelData.nom} onChange={e => setCollabPanelData((prev: any) => ({ ...prev, nom: e.target.value }))} style={{ ...sInput, fontSize: 12 }} /></div>
                </div>
                <div style={{ marginBottom: 12 }}><label style={{ fontSize: 11, fontWeight: 600, color: C.text, display: "block", marginBottom: 4 }}>Email *</label><input type="email" value={collabPanelData.email} onChange={e => setCollabPanelData((prev: any) => ({ ...prev, email: e.target.value }))} placeholder="prenom.nom@entreprise.com" style={{ ...sInput, fontSize: 12 }} /></div>
                <div style={{ marginBottom: 12 }}><label style={{ fontSize: 11, fontWeight: 600, color: C.text, display: "block", marginBottom: 4 }}>Poste</label><input value={collabPanelData.poste} onChange={e => setCollabPanelData((prev: any) => ({ ...prev, poste: e.target.value }))} style={{ ...sInput, fontSize: 12 }} /></div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                  <div><label style={{ fontSize: 11, fontWeight: 600, color: C.text, display: "block", marginBottom: 4 }}>Site</label><select value={collabPanelData.site} onChange={e => setCollabPanelData((prev: any) => ({ ...prev, site: e.target.value }))} style={{ ...sInput, fontSize: 12, cursor: "pointer" }}><option value="">—</option>{SITES.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
                  <div><label style={{ fontSize: 11, fontWeight: 600, color: C.text, display: "block", marginBottom: 4 }}>Département</label><select value={collabPanelData.departement} onChange={e => setCollabPanelData((prev: any) => ({ ...prev, departement: e.target.value }))} style={{ ...sInput, fontSize: 12, cursor: "pointer" }}><option value="">—</option>{DEPARTEMENTS.map(d => <option key={d} value={d}>{d}</option>)}</select></div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                  <div><label style={{ fontSize: 11, fontWeight: 600, color: C.text, display: "block", marginBottom: 4 }}>Date de début</label><input type="date" value={collabPanelData.dateDebut ? collabPanelData.dateDebut.split("/").reverse().join("-") : ""} onChange={e => { const v = e.target.value; if (v) { const [y, m, d] = v.split("-"); setCollabPanelData((prev: any) => ({ ...prev, dateDebut: `${d}/${m}/${y}` })); }}} style={{ ...sInput, fontSize: 12 }} /></div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600, color: C.text, display: "block", marginBottom: 4 }}>
                      Parcours {!collabPanelData.parcours_id && <span style={{ color: C.amber, fontWeight: 500 }}>· non assigné</span>}
                    </label>
                    <select
                      value={collabPanelData.parcours_id || ""}
                      onChange={e => setCollabPanelData((prev: any) => ({ ...prev, parcours_id: e.target.value ? Number(e.target.value) : null }))}
                      style={{ ...sInput, fontSize: 12, cursor: "pointer" }}
                    >
                      <option value="">— Aucun parcours —</option>
                      {PARCOURS_TEMPLATES.map(p => <option key={p.id} value={p.id}>{p.nom}</option>)}
                    </select>
                  </div>
                </div>

                {/* Dynamic sections from field config */}
                {sections.filter(s => s.fields && s.fields.length > 0).map(section => (
                  <div key={section.key} style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: C.pink, textTransform: "uppercase", letterSpacing: .5, marginBottom: 10, paddingTop: 8, borderTop: `1px solid ${C.border}` }}>{section.label}</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                      {section.fields!.map((fc: any) => (
                        <div key={fc.id} style={{ gridColumn: fc.field_key === "adresse" ? "1 / -1" : undefined }}>
                          <label style={{ fontSize: 11, fontWeight: 600, color: C.text, display: "flex", alignItems: "center", gap: 4, marginBottom: 4 }}>
                            {lang === "en" && fc.label_en ? fc.label_en : fc.label} {fc.obligatoire && <span style={{ color: C.red }}>*</span>}
                          </label>
                          {renderField(fc)}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Équipe d'accompagnement (edit mode only — needs a saved collab id) */}
                {collabPanelMode === "edit" && collabPanelData.id && (() => {
                  const ROLE_OPTIONS = [
                    { v: "manager", l: "Manager" },
                    { v: "hrbp", l: "HRBP" },
                    { v: "buddy", l: "Buddy / Parrain" },
                    { v: "it", l: "IT Support" },
                    { v: "recruteur", l: "Recruteur(se)" },
                    { v: "admin_rh", l: "Admin RH" },
                    { v: "other", l: "Autre" },
                  ];
                  const ROLE_LABELS: Record<string, string> = Object.fromEntries(ROLE_OPTIONS.map(r => [r.v, r.l]));
                  const ROLE_COLORS: Record<string, string> = { manager: "#1A73E8", hrbp: "#7B5EA7", buddy: "#4CAF50", it: "#F9A825", recruteur: "#00897B", admin_rh: "#E41076", other: "#999" };
                  const usedRoles = new Set(collabAccompagnants.map((a: any) => a.role));
                  const availableRoles = ROLE_OPTIONS.filter(r => !usedRoles.has(r.v));
                  const canAdd = !!accompagnantDraft.role && !!accompagnantDraft.user_id;
                  return (
                    <div style={{ marginTop: 8, paddingTop: 16, borderTop: `1px solid ${C.border}` }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: C.pink, textTransform: "uppercase", letterSpacing: .5, marginBottom: 12 }}>Équipe d'accompagnement</div>
                      {/* Existing accompagnants list */}
                      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 }}>
                        {collabAccompagnants.length === 0 ? (
                          <div style={{ fontSize: 12, color: C.textMuted, fontStyle: "italic", padding: "10px 12px", background: C.bg, borderRadius: 8 }}>
                            Aucun accompagnant assigné. Le collaborateur ne verra personne dans son équipe.
                          </div>
                        ) : collabAccompagnants.map((a: any) => (
                          <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", background: C.bg, borderRadius: 8 }}>
                            <span style={{ width: 26, height: 26, borderRadius: "50%", background: ROLE_COLORS[a.role] || "#999", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                              {(a.user?.name || "?").split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()}
                            </span>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: 12, fontWeight: 600, color: C.text }}>{a.user?.name || "—"}</div>
                              <div style={{ fontSize: 10, color: C.textMuted }}>{ROLE_LABELS[a.role] || a.role} · {a.user?.email || ""}</div>
                            </div>
                            <button onClick={async () => {
                              try { await apiRemoveAccompagnant(a.id); setCollabAccompagnants((prev: any[]) => prev.filter((x: any) => x.id !== a.id)); addToast_admin("Accompagnant retiré"); }
                              catch { addToast_admin("Erreur"); }
                            }} style={{ background: "none", border: "none", cursor: "pointer", color: C.red, padding: 4, fontSize: 11 }}>
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                      {/* Add form */}
                      {availableRoles.length > 0 && (
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr auto", gap: 8, alignItems: "end" }}>
                          <div>
                            <label style={{ fontSize: 10, color: C.textMuted, display: "block", marginBottom: 3 }}>Rôle</label>
                            <select value={accompagnantDraft.role} onChange={e => setAccompagnantDraft((d: any) => ({ ...d, role: e.target.value }))} style={{ ...sInput, fontSize: 12, cursor: "pointer", padding: "7px 10px" }}>
                              <option value="">— Choisir —</option>
                              {availableRoles.map(r => <option key={r.v} value={r.v}>{r.l}</option>)}
                            </select>
                          </div>
                          <div>
                            <label style={{ fontSize: 10, color: C.textMuted, display: "block", marginBottom: 3 }}>Utilisateur</label>
                            <select value={accompagnantDraft.user_id || ""} onChange={e => setAccompagnantDraft((d: any) => ({ ...d, user_id: e.target.value ? Number(e.target.value) : null }))} style={{ ...sInput, fontSize: 12, cursor: "pointer", padding: "7px 10px" }}>
                              <option value="">— Choisir —</option>
                              {tenantUsersList.map((u: any) => <option key={u.id} value={u.id}>{u.name} &lt;{u.email}&gt;</option>)}
                            </select>
                          </div>
                          <button disabled={!canAdd} onClick={async () => {
                            if (!collabPanelData.id) return;
                            try {
                              await assignAccompagnant(collabPanelData.id, { user_id: accompagnantDraft.user_id!, role: accompagnantDraft.role as any });
                              const list = await getCollabAccompagnants(collabPanelData.id);
                              setCollabAccompagnants(list || []);
                              setAccompagnantDraft({ role: "", user_id: null });
                              addToast_admin("Accompagnant ajouté");
                            } catch { addToast_admin("Erreur"); }
                          }} className="iz-btn-pink" style={{ ...sBtn("pink"), fontSize: 12, padding: "8px 14px", opacity: canAdd ? 1 : 0.5 }}>
                            <Plus size={13} /> Ajouter
                          </button>
                        </div>
                      )}
                      {/* AI buddy suggestions — only when role is buddy */}
                      {accompagnantDraft.role === "buddy" && collabPanelData.id && (
                        <div style={{ marginTop: 10 }}>
                          <button onClick={async () => {
                            try {
                              const ep = await import('../api/endpoints');
                              addToast_admin("Analyse IA en cours…");
                              const res = await ep.aiSuggestBuddy(collabPanelData.id);
                              ctx.setBuddyAiSuggestions?.(res.suggestions || []);
                              if (!res.suggestions || res.suggestions.length === 0) {
                                addToast_admin("Aucune suggestion trouvée par l'IA");
                              }
                            } catch (e: any) {
                              let msg = "Erreur IA"; try { const p = JSON.parse(e?.message || ""); msg = p?.error || p?.reply || msg; } catch {}
                              addToast_admin(msg);
                            }
                          }} style={{ background: "none", border: `1px dashed ${C.pink}`, color: C.pink, padding: "6px 12px", borderRadius: 6, fontSize: 11, cursor: "pointer", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 6 }}>
                            ✨ Suggérer un buddy avec l'IA
                          </button>
                          {(ctx.buddyAiSuggestions || []).length > 0 && (
                            <div style={{ marginTop: 10, padding: 12, background: C.pinkBg, borderRadius: 8, border: `1px solid ${C.pink}30` }}>
                              <div style={{ fontSize: 10, fontWeight: 700, color: C.pink, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>✨ Top 3 suggestions IA</div>
                              {(ctx.buddyAiSuggestions || []).slice(0, 3).map((s: any) => (
                                <div key={s.collaborateur_id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", background: C.white, borderRadius: 6, marginBottom: 6 }}>
                                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#4CAF50", color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{(s.nom || "?").split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()}</div>
                                  <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "flex", alignItems: "center", gap: 8 }}>{s.nom} <span style={{ fontSize: 10, padding: "1px 6px", background: C.greenLight, color: C.green, borderRadius: 3 }}>Score {s.score}</span></div>
                                    <div style={{ fontSize: 10, color: C.textMuted, marginBottom: 2 }}>{s.poste} · {s.site}</div>
                                    <div style={{ fontSize: 10, color: C.textLight, fontStyle: "italic" }}>{(s.reasons || []).join(" · ")}</div>
                                  </div>
                                  <button onClick={() => { setAccompagnantDraft((d: any) => ({ ...d, user_id: s.user_id })); ctx.setBuddyAiSuggestions?.([]); }} style={{ background: C.pink, color: "#fff", border: "none", padding: "5px 10px", borderRadius: 4, fontSize: 10, fontWeight: 600, cursor: "pointer" }}>Choisir</button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                      {availableRoles.length === 0 && (
                        <div style={{ fontSize: 11, color: C.textMuted, fontStyle: "italic", marginTop: 6 }}>
                          Tous les rôles sont assignés. Retirez un accompagnant pour libérer un rôle.
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* Documents & Signature */}
                {collabPanelMode === "edit" && (
                  <div style={{ marginTop: 8, paddingTop: 16, borderTop: `1px solid ${C.border}` }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: C.pink, textTransform: "uppercase", letterSpacing: .5, marginBottom: 12 }}>Documents & Signature</div>

                    {/* Send new document */}
                    <div style={{ padding: "16px", background: C.bg, borderRadius: 10, marginBottom: 12 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: C.text, marginBottom: 10 }}>Envoyer un document pour signature</div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 10, alignItems: "end" }}>
                        <div>
                          <select id="collab-contrat-select" style={{ ...sInput, fontSize: 12, cursor: "pointer", marginBottom: 8 }}>
                            <option value="">Sélectionner un contrat...</option>
                            {contrats.filter((c: any) => c.actif).map((c: any) => <option key={c.id} value={c.id}>{c.nom} ({c.type} — {c.juridiction})</option>)}
                          </select>
                          <select id="collab-sign-provider" style={{ ...sInput, fontSize: 12, cursor: "pointer" }}>
                            {(integrations || []).filter((i: any) => i.categorie === "signature" && (i.connecte || i.provider === "native")).map((i: any) => <option key={i.id} value={i.provider}>{i.nom}</option>)}
                          </select>
                        </div>
                        <button onClick={() => {
                          const contratEl = document.getElementById("collab-contrat-select") as HTMLSelectElement;
                          const providerEl = document.getElementById("collab-sign-provider") as HTMLSelectElement;
                          if (!contratEl?.value) { addToast_admin("Sélectionnez un contrat"); return; }
                          const contrat = contrats.find((c: any) => c.id === Number(contratEl.value));
                          addToast_admin(`${contrat?.nom || "Contrat"} envoyé pour signature via ${providerEl?.value || "in-app"} à ${collabPanelData.prenom} ${collabPanelData.nom}`);
                        }} className="iz-btn-pink" style={{ ...sBtn("pink"), fontSize: 12, padding: "8px 16px", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 6 }}>
                          <Send size={14} /> Envoyer
                        </button>
                      </div>
                    </div>

                    {/* Document history */}
                    <div style={{ fontSize: 12, fontWeight: 600, color: C.text, marginBottom: 8 }}>Historique</div>
                    <div style={{ fontSize: 12, color: C.textMuted, padding: "12px", background: C.bg, borderRadius: 8, textAlign: "center" }}>
                      Aucun document envoyé pour le moment
                    </div>
                  </div>
                )}
              </div>
              <div style={{ padding: "16px 28px", borderTop: `1px solid ${C.border}`, display: "flex", gap: 12, justifyContent: "space-between" }}>
                <div>
                  {collabPanelMode === "edit" && (
                    <button onClick={() => {
                      if (!collabPanelData.id) return;
                      const id = collabPanelData.id;
                      setConfirmDialog({ message: "Supprimer ce collaborateur et toutes ses données ?", onConfirm: async () => {
                        try { await apiDeleteCollab(id); addToast_admin("Collaborateur supprimé"); setCollabPanelMode("closed"); refetchCollaborateurs(); } catch { addToast_admin(t('toast.error')); }
                        setConfirmDialog(null);
                      }});
                    }} style={{ ...sBtn("outline"), color: C.red, borderColor: C.red, fontSize: 13 }}>{t('common.delete')}</button>
                  )}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => setCollabPanelMode("closed")} style={{ ...sBtn("outline"), fontSize: 13 }}>{t('common.cancel')}</button>
                  <button disabled={collabPanelLoading || !collabPanelData.prenom.trim() || !collabPanelData.nom.trim()} onClick={async () => {
                    setCollabPanelLoading(true);
                    const [d, m, y] = (collabPanelData.dateDebut || "").split("/");
                    const payload: Record<string, any> = {
                      prenom: collabPanelData.prenom.trim(),
                      nom: collabPanelData.nom.trim().toUpperCase(),
                      email: collabPanelData.email,
                      poste: collabPanelData.poste,
                      site: collabPanelData.site,
                      departement: collabPanelData.departement,
                      date_debut: y && m && d ? `${y}-${m}-${d}` : null,
                      parcours_id: collabPanelData.parcours_id || null,
                    };
                    try {
                      if (collabPanelMode === "create") { await apiCreateCollab(payload); addToast_admin("Collaborateur créé"); }
                      else { await apiUpdateCollab(collabPanelData.id!, payload); addToast_admin("Collaborateur modifié"); }
                      setCollabPanelMode("closed"); refetchCollaborateurs();
                    } catch { addToast_admin(t('phase.save_error')); }
                    finally { setCollabPanelLoading(false); }
                  }} className="iz-btn-pink" style={{ ...sBtn("pink"), fontSize: 13, opacity: collabPanelLoading || !collabPanelData.prenom.trim() || !collabPanelData.nom.trim() ? 0.6 : 1 }}>
                    {collabPanelLoading ? "..." : collabPanelMode === "create" ? "Créer le collaborateur" : "Enregistrer"}
                  </button>
                </div>
              </div>
            </div>
          </>
          );
        })()}
    </>
  );

  const PARCOURS_CAT_META: Record<ParcoursCategorie, { label: string; Icon: React.FC<any>; color: string; bg: string }> = {
    onboarding: { label: "Onboarding", Icon: UserPlus, color: "#4CAF50", bg: C.greenLight },
    offboarding: { label: "Offboarding", Icon: LogOut, color: "#E53935", bg: C.redLight },
    crossboarding: { label: "Crossboarding", Icon: ArrowRight, color: "#1A73E8", bg: C.blueLight },
    reboarding: { label: "Reboarding", Icon: Hand, color: "#7B5EA7", bg: C.purple + "15" },
  };

  const renderParcoursPanel = () => (
    <>
        {/* ── Parcours Create/Edit Panel ─────────────────────── */}
        {parcoursPanelMode !== "closed" && (
          <>
            <div onClick={() => setParcoursPanelMode("closed")} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.3)", zIndex: 1000 }} />
            <div className="iz-panel" style={{ position: "fixed", top: 0, right: 0, width: 540, height: "100vh", background: C.white, boxShadow: "-4px 0 24px rgba(0,0,0,.1)", zIndex: 1001, display: "flex", flexDirection: "column" }}>
              <div style={{ padding: "24px 28px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>{parcoursPanelMode === "create" ? t('panel.new_path') : t('panel.edit_path')}</h2>
                <button onClick={() => setParcoursPanelMode("closed")} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={22} color={C.textLight} /></button>
              </div>
              <div style={{ flex: 1, padding: "24px 28px", overflow: "auto" }}>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>{t('panel.path_name')}</label>
                  <TranslatableField value={parcoursPanelData.nom} onChange={v => setParcoursPanelData(prev => ({ ...prev, nom: v }))} placeholder="Ex: Onboarding Développeurs" currentLang={lang} activeLangs={activeLanguages} translations={contentTranslations.nom} onTranslationsChange={tr => setTr("nom", tr)} />
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>{t('panel.category')}</label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    {(["onboarding", "offboarding", "crossboarding", "reboarding"] as ParcoursCategorie[]).map(cat => {
                      const meta = PARCOURS_CAT_META[cat];
                      const active = parcoursPanelData.categorie === cat;
                      return (
                        <button key={cat} onClick={() => setParcoursPanelData(prev => ({ ...prev, categorie: cat }))} style={{
                          padding: "12px 14px", borderRadius: 10, border: `2px solid ${active ? meta.color : C.border}`, background: active ? meta.bg : C.white,
                          cursor: "pointer", display: "flex", alignItems: "center", gap: 10, fontFamily: font, transition: "all .15s",
                        }}>
                          <div style={{ width: 32, height: 32, borderRadius: 8, background: active ? meta.color : C.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <meta.Icon size={16} color={active ? C.white : meta.color} />
                          </div>
                          <span style={{ fontSize: 13, fontWeight: active ? 600 : 400, color: active ? meta.color : C.text }}>{meta.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>{t('label.status')}</label>
                  <select value={parcoursPanelData.status} onChange={e => setParcoursPanelData(prev => ({ ...prev, status: e.target.value as any }))} style={{ ...sInput, cursor: "pointer" }}>
                    <option value="brouillon">{t('status.draft')}</option>
                    <option value="actif">{t('status.active')}</option>
                    <option value="archive">{t('status.archived')}</option>
                  </select>
                </div>
                {parcoursPanelMode === "edit" && (
                  <div style={{ padding: "14px 16px", background: C.bg, borderRadius: 10, fontSize: 12, color: C.textLight, marginBottom: 20 }}>
                    Les phases et actions de ce parcours sont gérées dans les onglets dédiés.
                  </div>
                )}
              </div>
              <div style={{ padding: "16px 28px", borderTop: `1px solid ${C.border}`, display: "flex", gap: 12, justifyContent: "space-between" }}>
                <div>
                  {parcoursPanelMode === "edit" && (
                    <button onClick={() => {
                      if (!parcoursPanelData.id) return;
                      const id = parcoursPanelData.id;
                      setConfirmDialog({ message: "Supprimer ce parcours ? Cette action est irréversible.", onConfirm: async () => {
                        try { await apiDeleteParcours(id); addToast_admin("Parcours supprimé"); setParcoursPanelMode("closed"); refetchParcours(); } catch { addToast_admin("Erreur lors de la suppression"); }
                        setConfirmDialog(null);
                      }});
                    }} style={{ ...sBtn("outline"), color: C.red, borderColor: C.red, fontSize: 13 }}>{t('common.delete')}</button>
                  )}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => setParcoursPanelMode("closed")} style={{ ...sBtn("outline"), fontSize: 13 }}>{t('common.cancel')}</button>
                  <button disabled={parcoursPanelLoading || !parcoursPanelData.nom.trim()} onClick={async () => {
                    setParcoursPanelLoading(true);
                    const catIdMap: Record<string, number> = { onboarding: 1, offboarding: 2, crossboarding: 3, reboarding: 4 };
                    const payload: Record<string, any> = { nom: parcoursPanelData.nom.trim(), categorie_id: catIdMap[parcoursPanelData.categorie], status: parcoursPanelData.status, translations: buildTranslationsPayload() };
                    try {
                      if (parcoursPanelMode === "create") {
                        await apiCreateParcours(payload);
                        addToast_admin("Parcours créé avec succès");
                      } else {
                        await apiUpdateParcours(parcoursPanelData.id!, payload);
                        addToast_admin("Parcours modifié avec succès");
                      }
                      setParcoursPanelMode("closed");
                      refetchParcours();
                    } catch { addToast_admin(t('phase.save_error')); }
                    finally { setParcoursPanelLoading(false); }
                  }} className="iz-btn-pink" style={{ ...sBtn("pink"), fontSize: 13, opacity: parcoursPanelLoading || !parcoursPanelData.nom.trim() ? 0.6 : 1 }}>
                    {parcoursPanelLoading ? "Enregistrement..." : parcoursPanelMode === "create" ? "Créer le parcours" : "Enregistrer"}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
    </>
  );

  const renderPhasePanel = () => (
    <>
        {/* ── Phase Create/Edit Panel ────────────────────────── */}
        {phasePanelMode !== "closed" && (
          <>
            <div onClick={() => setPhasePanelMode("closed")} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.3)", zIndex: 1000 }} />
            <div className="iz-panel" style={{ position: "fixed", top: 0, right: 0, width: 500, height: "100vh", background: C.white, boxShadow: "-4px 0 24px rgba(0,0,0,.1)", zIndex: 1001, display: "flex", flexDirection: "column" }}>
              <div style={{ padding: "24px 28px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>{phasePanelMode === "create" ? t('parcours.new_phase') : t('phase.edit_title')}</h2>
                <button onClick={() => setPhasePanelMode("closed")} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={22} color={C.textLight} /></button>
              </div>
              <div style={{ flex: 1, padding: "24px 28px", overflow: "auto" }}>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>{t('phase.name_label')}</label>
                  <TranslatableField value={phasePanelData.nom} onChange={v => setPhasePanelData(prev => ({ ...prev, nom: v }))} placeholder={t('phase.name_placeholder')} currentLang={lang} activeLangs={activeLanguages} translations={contentTranslations.nom} onTranslationsChange={tr => setTr("nom", tr)} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>{t('phase.delay_start')}</label>
                    <select value={phasePanelData.delaiDebut || "J+0"} onChange={e => setPhasePanelData(prev => ({ ...prev, delaiDebut: e.target.value }))} style={{ ...sInput, cursor: "pointer" }}>
                      <option value="J-90">J-90</option><option value="J-60">J-60</option><option value="J-45">J-45</option>
                      <option value="J-30">J-30</option><option value="J-21">J-21</option><option value="J-14">J-14</option>
                      <option value="J-7">J-7</option><option value="J-3">J-3</option><option value="J-1">J-1</option>
                      <option value="J+0">J+0</option><option value="J+1">J+1</option><option value="J+3">J+3</option>
                      <option value="J+7">J+7</option><option value="J+8">J+8</option><option value="J+14">J+14</option>
                      <option value="J+15">J+15</option><option value="J+30">J+30</option><option value="J+60">J+60</option>
                      <option value="J+90">J+90</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>{t('phase.delay_end')}</label>
                    <select value={phasePanelData.delaiFin || "J+0"} onChange={e => setPhasePanelData(prev => ({ ...prev, delaiFin: e.target.value }))} style={{ ...sInput, cursor: "pointer" }}>
                      <option value="J-90">J-90</option><option value="J-60">J-60</option><option value="J-45">J-45</option>
                      <option value="J-30">J-30</option><option value="J-21">J-21</option><option value="J-14">J-14</option>
                      <option value="J-7">J-7</option><option value="J-3">J-3</option><option value="J-1">J-1</option>
                      <option value="J+0">J+0</option><option value="J+1">J+1</option><option value="J+3">J+3</option>
                      <option value="J+7">J+7</option><option value="J+8">J+8</option><option value="J+14">J+14</option>
                      <option value="J+15">J+15</option><option value="J+30">J+30</option><option value="J+60">J+60</option>
                      <option value="J+90">J+90</option>
                    </select>
                  </div>
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>{t('phase.color')}</label>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {["#4CAF50", "#1A73E8", "#F9A825", "#E41076", "#7B5EA7", "#E53935", "#00897B", "#F57C00"].map(col => (
                      <button key={col} onClick={() => setPhasePanelData(prev => ({ ...prev, couleur: col }))} style={{
                        width: 36, height: 36, borderRadius: 10, background: col, border: phasePanelData.couleur === col ? `3px solid ${C.dark}` : "3px solid transparent",
                        cursor: "pointer", transition: "all .15s",
                      }} />
                    ))}
                  </div>
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>{t('phase.associated_paths')}</label>
                  <div style={{ border: `1px solid ${C.border}`, borderRadius: 8, maxHeight: 180, overflow: "auto" }}>
                    {PARCOURS_TEMPLATES.map(p => {
                      const checked = (phasePanelData.parcoursIds || []).includes(p.id);
                      const catMeta = PARCOURS_CAT_META[p.categorie] || PARCOURS_CAT_META.onboarding;
                      return (
                        <label key={p.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", cursor: "pointer", borderBottom: `1px solid ${C.border}`, background: checked ? catMeta.bg : "transparent", transition: "all .15s" }}>
                          <input type="checkbox" checked={checked} onChange={() => {
                            setPhasePanelData(prev => ({
                              ...prev,
                              parcoursIds: checked ? (prev.parcoursIds || []).filter(id => id !== p.id) : [...(prev.parcoursIds || []), p.id],
                            }));
                          }} style={{ accentColor: C.pink }} />
                          <span style={{ fontSize: 13, fontWeight: checked ? 600 : 400, color: C.text }}>{p.nom}</span>
                          <span style={{ fontSize: 10, padding: "2px 6px", borderRadius: 4, background: catMeta.bg, color: catMeta.color, fontWeight: 600, marginLeft: "auto" }}>{catMeta.label}</span>
                        </label>
                      );
                    })}
                  </div>
                  {(phasePanelData.parcoursIds || []).length === 0 && (
                    <div style={{ fontSize: 11, color: C.textMuted, marginTop: 4 }}>{t('phase.no_path_selected')}</div>
                  )}
                </div>
                <div style={{ marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", borderRadius: 10, border: `1px solid ${C.border}`, background: (phasePanelData as any).active === false ? C.bgLight : "transparent" }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{t('phase.active')}</div>
                    <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>{t('phase.active_desc')}</div>
                  </div>
                  <button onClick={() => setPhasePanelData(prev => ({ ...prev, active: !(prev as any).active !== false ? false : true } as any))} style={{
                    width: 44, height: 24, borderRadius: 12, border: "none", cursor: "pointer", position: "relative", transition: "all .2s",
                    background: (phasePanelData as any).active === false ? C.border : C.pink,
                  }}>
                    <div style={{
                      width: 18, height: 18, borderRadius: 9, background: C.white, position: "absolute", top: 3,
                      left: (phasePanelData as any).active === false ? 3 : 23, transition: "all .2s", boxShadow: "0 1px 3px rgba(0,0,0,.2)",
                    }} />
                  </button>
                </div>
              </div>
              <div style={{ padding: "16px 28px", borderTop: `1px solid ${C.border}`, display: "flex", gap: 12, justifyContent: "space-between" }}>
                <div>
                  {phasePanelMode === "edit" && (
                    <button onClick={() => {
                      if (!phasePanelData.id) return;
                      const id = phasePanelData.id;
                      setConfirmDialog({ message: t('phase.delete_confirm'), onConfirm: async () => {
                        try { await apiDeletePhase(id); addToast_admin(t('phase.deleted')); setPhasePanelMode("closed"); refetchPhases(); } catch { addToast_admin(t('phase.delete_error')); }
                        setConfirmDialog(null);
                      }});
                    }} style={{ ...sBtn("outline"), color: C.red, borderColor: C.red, fontSize: 13 }}>{t('common.delete')}</button>
                  )}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => setPhasePanelMode("closed")} style={{ ...sBtn("outline"), fontSize: 13 }}>{t('common.cancel')}</button>
                  <button disabled={phasePanelLoading || !phasePanelData.nom.trim()} onClick={async () => {
                    setPhasePanelLoading(true);
                    const payload: Record<string, any> = { nom: phasePanelData.nom.trim(), delai_debut: phasePanelData.delaiDebut, delai_fin: phasePanelData.delaiFin, couleur: phasePanelData.couleur, parcours_ids: phasePanelData.parcoursIds, active: (phasePanelData as any).active !== false, translations: buildTranslationsPayload() };
                    try {
                      if (phasePanelMode === "create") {
                        await apiCreatePhase(payload);
                        addToast_admin(t('phase.created'));
                      } else {
                        await apiUpdatePhase(phasePanelData.id!, payload);
                        addToast_admin(t('phase.updated'));
                      }
                      setPhasePanelMode("closed");
                      refetchPhases();
                    } catch { addToast_admin(t('phase.save_error')); }
                    finally { setPhasePanelLoading(false); }
                  }} className="iz-btn-pink" style={{ ...sBtn("pink"), fontSize: 13, opacity: phasePanelLoading || !phasePanelData.nom.trim() ? 0.6 : 1 }}>
                    {phasePanelLoading ? t('phase.saving') : phasePanelMode === "create" ? t('phase.create_title') : t('common.save')}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
    </>
  );

  return {
    renderGroupePanel,
    renderActionPanel,
    renderPromptModal,
    renderCollabPanel,
    renderParcoursPanel,
    renderPhasePanel,
  };
}
