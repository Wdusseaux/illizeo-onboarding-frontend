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
  getMySubscription, subscribeToPlan, cancelSubscription, getAvailablePlans, getActiveModules, getStorageUsage, getSignatureUsage, getMonthlyConsumption, getInvoices, getSupportAccesses, grantSupportAccess, revokeSupportAccess, getIpWhitelist, addIpWhitelist, toggleIpWhitelist, removeIpWhitelist, getSecuritySessions, revokeSession as apiRevokeSession, revokeAllOtherSessions, getLoginHistory, getAllLoginHistory, getSecuritySettings, updateSecuritySettings, createAccessSchedule, deleteAccessSchedule, seedDemoData, type ConsumptionUser,
  createStripeSetupIntent, getStripePaymentMethods, setDefaultPaymentMethod, deleteStripePaymentMethod, saveInvoiceConfig as apiSaveInvoiceConfig, saveBillingContact, saveBillingInfo as apiSaveBillingInfo, getPaymentConfig,
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
// Stripe is loaded lazily — see lazyLoadStripe() below — so the SDK isn't in the
// main bundle and js.stripe.com / m.stripe.network are only contacted when the
// user actually clicks a payment button.
import { Elements, CardElement, IbanElement, useStripe, useElements } from "@stripe/react-stripe-js";

// Cache the dynamic import so we only fetch @stripe/stripe-js once per session
let _stripeJsModule: typeof import("@stripe/stripe-js") | null = null;
const lazyLoadStripe = async (publishableKey: string) => {
  if (!_stripeJsModule) {
    _stripeJsModule = await import("@stripe/stripe-js");
  }
  return _stripeJsModule.loadStripe(publishableKey);
};
import { createAdminRoles } from './pages/AdminRoles';
import { createAdminCalendar } from './pages/AdminCalendar';
import { createAdminOrgChart } from './pages/AdminOrgChart';
import { createAdminBuddy } from './pages/AdminBuddy';
import { createAdminAuditLog } from './pages/AdminAuditLog';


/** Stripe Card Form — proper React component so hooks work */
function StripeCardFormInner({ billingInfo, auth, stripeMethods, setStripeMethods, setPaymentMethod, setStripeModalOpen, addToast_admin, loadMethods, onCardSaved, isSepa }: any) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const BRAND_ICONS: Record<string, string> = { visa: "Visa", mastercard: "Mastercard", amex: "Amex", discover: "Discover" };
  const handleSubmit = async () => {
    if (!stripe || !elements) return;
    setLoading(true); setError("");
    try {
      const intent = await createStripeSetupIntent();
      const billingDetails = { name: `${billingInfo.prenom} ${billingInfo.nom}`.trim() || auth.user?.name || "", email: billingInfo.email || auth.user?.email || "" };
      let result: any;
      if (isSepa) {
        const ibanEl = elements.getElement(IbanElement);
        if (!ibanEl) { setError("Élément IBAN non disponible"); setLoading(false); return; }
        result = await stripe.confirmSepaDebitSetup(intent.client_secret, { payment_method: { sepa_debit: ibanEl, billing_details: billingDetails } });
      } else {
        const cardEl = elements.getElement(CardElement);
        if (!cardEl) { setError("Élément de carte non disponible"); setLoading(false); return; }
        result = await stripe.confirmCardSetup(intent.client_secret, { payment_method: { card: cardEl, billing_details: billingDetails } });
      }
      if (result.error) { setError(result.error.message || "Erreur Stripe"); setLoading(false); return; }
      if (result.setupIntent?.payment_method) {
        await setDefaultPaymentMethod(result.setupIntent.payment_method as string);
      }
      const methods = await getStripePaymentMethods();
      setStripeMethods(methods.methods || []);
      setPaymentMethod(isSepa ? "sepa" : "stripe");
      setStripeModalOpen(false);
      addToast_admin(isSepa ? "Prélèvement SEPA configuré avec succès !" : "Carte enregistrée avec succès !");
      if (onCardSaved) onCardSaved();
    } catch (err: any) { setError(err.message || "Erreur lors de l'enregistrement"); }
    setLoading(false);
  };
  const accentColor = isSepa ? "#00897B" : "#635BFF";
  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 8 }}>{isSepa ? "IBAN" : "Informations de la carte"}</label>
        <div style={{ border: `1px solid ${C.border}`, borderRadius: 8, padding: "12px 14px", background: C.white }}>
          {isSepa ? (
            <IbanElement options={{ supportedCountries: ['SEPA'], style: { base: { fontSize: "15px", color: C.text, fontFamily: font, "::placeholder": { color: C.textMuted } }, invalid: { color: C.red } } }} />
          ) : (
            <CardElement options={{ style: { base: { fontSize: "15px", color: C.text, fontFamily: font, "::placeholder": { color: C.textMuted } }, invalid: { color: C.red } }, hidePostalCode: true }} />
          )}
        </div>
        {isSepa && <div style={{ fontSize: 10, color: C.textMuted, marginTop: 6 }}>En fournissant votre IBAN, vous autorisez Illizeo à débiter votre compte conformément au mandat SEPA.</div>}
      </div>
      {error && <div style={{ fontSize: 12, color: C.red, marginBottom: 12, padding: "8px 12px", background: "#FFF0F0", borderRadius: 6 }}>{error}</div>}
      {stripeMethods.filter((m: any) => isSepa ? m.type === "sepa_debit" : m.type === "card").length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 8 }}>{isSepa ? "Comptes enregistrés" : "Cartes enregistrées"}</label>
          {stripeMethods.filter((m: any) => isSepa ? m.type === "sepa_debit" : m.type === "card").map((m: any) => (
            <div key={m.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", border: `1px solid ${m.is_default ? accentColor : C.border}`, borderRadius: 8, marginBottom: 6, background: m.is_default ? accentColor + "08" : C.white }}>
              <span style={{ fontSize: 13 }}>{m.type === "sepa_debit" ? `SEPA •••• ${m.last4} ${m.country || ""}` : `${BRAND_ICONS[m.brand] || m.brand} •••• ${m.last4} — ${String(m.exp_month).padStart(2, "0")}/${m.exp_year}`} {m.is_default && <span style={{ fontSize: 9, fontWeight: 700, color: accentColor, marginLeft: 6 }}>PAR DÉFAUT</span>}</span>
              <div style={{ display: "flex", gap: 6 }}>
                {!m.is_default && <button onClick={async () => { try { await setDefaultPaymentMethod(m.id); loadMethods(); addToast_admin("Méthode par défaut mise à jour"); } catch { addToast_admin("Erreur"); } }} style={{ background: "none", border: "none", fontSize: 11, color: accentColor, cursor: "pointer", fontWeight: 600 }}>Par défaut</button>}
                <button onClick={async () => { try { await deleteStripePaymentMethod(m.id); loadMethods(); addToast_admin("Méthode supprimée"); } catch { addToast_admin("Erreur"); } }} style={{ background: "none", border: "none", fontSize: 11, color: C.red, cursor: "pointer" }}>Supprimer</button>
              </div>
            </div>
          ))}
        </div>
      )}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
        <button onClick={() => setStripeModalOpen(false)} style={{ padding: "8px 20px", fontSize: 12, background: "none", border: `1px solid ${C.border}`, borderRadius: 8, cursor: "pointer", color: C.text }}>Fermer</button>
        <button onClick={handleSubmit} disabled={loading || !stripe} style={{ fontSize: 12, padding: "8px 20px", opacity: loading ? 0.6 : 1, background: accentColor, color: "#fff", border: "none", borderRadius: 8, fontWeight: 600, cursor: loading ? "wait" : "pointer" }}>
          {loading ? "Enregistrement..." : isSepa ? "Enregistrer le prélèvement" : "Enregistrer la carte"}
        </button>
      </div>
    </div>
  );
}

/** Checkout payment section — Stripe Card or SEPA, save logic exposed via submitRef */
function CheckoutPaymentSection({ billingInfo, auth, submitRef, paymentMethod }: any) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState("");

  submitRef.current = async (): Promise<boolean> => {
    if (!stripe || !elements) return false;
    setError("");
    try {
      const intent = await createStripeSetupIntent();
      const billingDetails = { name: `${billingInfo.prenom} ${billingInfo.nom}`.trim() || auth.user?.name || "", email: billingInfo.email || auth.user?.email || "" };

      if (paymentMethod === "sepa") {
        const ibanEl = elements.getElement(IbanElement);
        if (!ibanEl) { setError("Élément IBAN non disponible"); return false; }
        const { error: stripeErr, setupIntent } = await stripe.confirmSepaDebitSetup(intent.client_secret, {
          payment_method: { sepa_debit: ibanEl, billing_details: billingDetails }
        });
        if (stripeErr) { setError(stripeErr.message || "Erreur SEPA"); return false; }
        if (setupIntent?.payment_method) await setDefaultPaymentMethod(setupIntent.payment_method as string);
      } else {
        const cardEl = elements.getElement(CardElement);
        if (!cardEl) { setError("Élément de carte non disponible"); return false; }
        const { error: stripeErr, setupIntent } = await stripe.confirmCardSetup(intent.client_secret, {
          payment_method: { card: cardEl, billing_details: billingDetails }
        });
        if (stripeErr) { setError(stripeErr.message || "Erreur Stripe"); return false; }
        if (setupIntent?.payment_method) await setDefaultPaymentMethod(setupIntent.payment_method as string);
      }
      return true;
    } catch (err: any) { setError(err.message || "Erreur"); return false; }
  };

  return (
    <div>
      {paymentMethod === "sepa" ? (
        <>
          <div style={{ border: `1px solid ${C.border}`, borderRadius: 8, padding: "12px 14px", background: C.white, marginBottom: 12 }}>
            <IbanElement options={{ supportedCountries: ['SEPA'], style: { base: { fontSize: "15px", color: C.text, fontFamily: font, "::placeholder": { color: C.textMuted } }, invalid: { color: C.red } } }} />
          </div>
          <div style={{ fontSize: 10, color: C.textMuted, marginBottom: 8 }}>En fournissant votre IBAN, vous autorisez Illizeo à envoyer des instructions à votre banque pour débiter votre compte conformément au mandat SEPA.</div>
        </>
      ) : (
        <>
          <div style={{ border: `1px solid ${C.border}`, borderRadius: 8, padding: "12px 14px", background: C.white, marginBottom: 12 }}>
            <CardElement options={{ style: { base: { fontSize: "15px", color: C.text, fontFamily: font, "::placeholder": { color: C.textMuted } }, invalid: { color: C.red } }, hidePostalCode: true }} />
          </div>
          <div style={{ fontSize: 10, color: C.textMuted, marginBottom: 8 }}>Paiement sécurisé via Stripe avec 3D Secure.</div>
        </>
      )}
      {error && <div style={{ fontSize: 12, color: C.red, marginBottom: 12, padding: "8px 12px", background: "#FFF0F0", borderRadius: 6 }}>{error}</div>}
    </div>
  );
}

// Module-level spending cap cache to avoid infinite re-render loops
let _spendingCapCache: any = null;
let _spendingCapLoading = false;
let _autoRechargeCache: any = null;
let _autoRechargeLoading = false;

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
    subView, setSubView, subEmployeeCount, setSubEmployeeCount, billingInfo, setBillingInfo, paymentMethod, setPaymentMethod, subStep, setSubStep,
    stripeModalOpen, setStripeModalOpen, stripeMethods, setStripeMethods,
    invoiceConfigOpen, setInvoiceConfigOpen, invoiceConfig, setInvoiceConfig,
    billingContactEdit, setBillingContactEdit, billingModalOpen, setBillingModalOpen, billingModalCallback, invoicesList, setInvoicesList, supportAccesses, setSupportAccesses, supportAccessForm, setSupportAccessForm, billingInfoEdit, setBillingInfoEdit,
    stripePromise, setStripePromise,
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
    securitySubTab, setSecuritySubTab, pwdPolicy, setPwdPolicy, ipWhitelist, setIpWhitelist, secSessions, setSecSessions, secLoginHistory, setSecLoginHistory, secSettings, setSecSettings,
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
    selectedContratId, setSelectedContratId, entrepriseBlocs, setEntrepriseBlocs, entrepriseVideos, setEntrepriseVideos, gradientColor, setGradientColor, loginGradientStart, setLoginGradientStart, loginGradientEnd, setLoginGradientEnd,
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
          const BADGE_COLORS = ["#F9A825", "#E41076", "#4CAF50", "#1A73E8", "#7B5EA7", "#E91E8C", "#00897B", "#FF6B35", "#E53935", "#FF9800"];
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
              admin_rh: { label: t('role.admin_rh'), color: "#E41076", bg: C.pinkBg },
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

  let _abonnementDataLoaded = false;
  let _invoicesLoaded = false;
  let _supportAccessLoaded = false;
  const renderAdminAbonnement = () => {
          const trialStart = localStorage.getItem("illizeo_trial_start");
          const isInTrial = trialStart && (new Date().getTime() - new Date(trialStart).getTime()) <= 14 * 24 * 60 * 60 * 1000;
          const trialExpired = trialStart && !isInTrial;
          const hasActiveSub = tenantSubscriptions.some((s: any) => s.status === "active" || s.status === "trialing");
          const reloadSub = () => {
            getMySubscription().then(res => { setTenantSubscriptions(res.subscriptions || []); setTenantActiveModules(res.active_modules || []); }).catch(() => {});
            if (plans.length === 0) getAvailablePlans().then(setPlans).catch(() => {});
            getStripePaymentMethods().then(r => setStripeMethods(r.methods || [])).catch(() => {});
            getPaymentConfig().then((cfg: any) => {
              if (cfg) {
                if (cfg.invoice_email || cfg.po_number) setInvoiceConfig({ invoice_email: cfg.invoice_email || "", po_number: cfg.po_number || "" });
                // Merge billing contact — use auth user as fallback for empty fields
                const contact = cfg.billing_contact || {};
                const userName = auth.user?.name || "";
                const nameParts = userName.split(" ");
                setBillingInfo((prev: any) => ({
                  ...prev,
                  prenom: contact.prenom || prev.prenom || nameParts[0] || "",
                  nom: contact.nom || prev.nom || nameParts.slice(1).join(" ") || "",
                  email: contact.email || prev.email || auth.user?.email || "",
                  telephone: contact.telephone || prev.telephone || "",
                  pays: contact.pays || prev.pays || "Suisse",
                }));
                // Merge billing info (company, address)
                if (cfg.billing) {
                  setBillingInfo((prev: any) => ({
                    ...prev,
                    company: cfg.billing.company || prev.company || "",
                    vat: cfg.billing.vat || prev.vat || "",
                    rue: cfg.billing.rue || prev.rue || "",
                    numero: cfg.billing.numero || prev.numero || "",
                    complement: cfg.billing.complement || prev.complement || "",
                    case_postale: cfg.billing.case_postale || prev.case_postale || "",
                    localite: cfg.billing.localite || prev.localite || "",
                    code_postal: cfg.billing.code_postal || prev.code_postal || "",
                    ville: cfg.billing.ville || prev.ville || "",
                    canton: cfg.billing.canton || prev.canton || "",
                    pays_facturation: cfg.billing.pays || prev.pays_facturation || "Suisse",
                  }));
                }
                if (cfg.payment_method) setPaymentMethod(cfg.payment_method);
              }
            }).catch(() => {});
          };
          if (!_abonnementDataLoaded) {
            _abonnementDataLoaded = true;
            if (plans.length === 0) getAvailablePlans().then(setPlans).catch(() => {});
            if (stripeMethods.length === 0) getStripePaymentMethods().then(r => setStripeMethods(r.methods || [])).catch(() => {});
            // Load billing info on first render
            if (!billingInfo.prenom && !billingInfo.nom) {
              getPaymentConfig().then((cfg: any) => {
                if (cfg) {
                  const contact = cfg.billing_contact || {};
                  const userName = auth.user?.name || "";
                  const nameParts = userName.split(" ");
                  setBillingInfo((prev: any) => ({
                    ...prev,
                    prenom: contact.prenom || nameParts[0] || "",
                    nom: contact.nom || nameParts.slice(1).join(" ") || "",
                    email: contact.email || auth.user?.email || "",
                    telephone: contact.telephone || "",
                    pays: contact.pays || "Suisse",
                    ...(cfg.billing ? {
                      company: cfg.billing.company || "",
                      vat: cfg.billing.vat || "",
                      rue: cfg.billing.rue || "",
                      numero: cfg.billing.numero || "",
                      complement: cfg.billing.complement || "",
                      case_postale: cfg.billing.case_postale || "",
                      localite: cfg.billing.localite || "",
                      code_postal: cfg.billing.code_postal || "",
                      ville: cfg.billing.ville || "",
                      canton: cfg.billing.canton || "",
                      pays_facturation: cfg.billing.pays || "Suisse",
                    } : {}),
                  }));
                  if (cfg.payment_method) setPaymentMethod(cfg.payment_method);
                  if (cfg.invoice_email || cfg.po_number) setInvoiceConfig({ invoice_email: cfg.invoice_email || "", po_number: cfg.po_number || "" });
                }
              }).catch(() => {});
            }
          }
          const activeSubs = tenantSubscriptions.filter(s => s.status === "active" || s.status === "trialing");
          const availablePlans = plans.length > 0 ? plans : saPlans;
          const currentOnboardingSub = activeSubs.filter((s: any) => s.plan?.slug !== "cooptation" && s.plan?.addon_type !== "ai" && !s.plan?.is_addon).sort((a: any, b: any) => (a.canceled_at ? 1 : 0) - (b.canceled_at ? 1 : 0))[0] || null;
          const currentCooptSub = activeSubs.find((s: any) => s.plan?.slug === "cooptation");
          const currentPlan = currentOnboardingSub?.plan;
          const onboardingPlans = availablePlans.filter((p: any) => !p.is_addon && p.addon_type !== "ai" && p.slug !== "cooptation").sort((a, b) => a.ordre - b.ordre);
          const cooptationPlan = availablePlans.find(p => p.slug === "cooptation");
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
                <div style={{ fontSize: 13, color: C.textLight }}>{currentPlan?.description || (currentOnboardingSub ? "Votre abonnement est actif" : "Choisissez un plan pour activer votre espace")}</div>
                {currentOnboardingSub && (() => { const appCount = activeSubs.filter((s: any) => s.plan?.is_addon || s.plan?.addon_type === "ai" || s.plan?.slug === "cooptation").length; return <div style={{ fontSize: 12, color: C.textMuted, marginTop: 4 }}>{currentPlan?.prix_chf_mensuel} CHF/emp/mois · 1 plan{appCount > 0 ? ` + ${appCount} app${appCount > 1 ? "s" : ""}` : ""}</div>; })()}
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
                <button onClick={() => { if (subView === "change") { setSubView("overview"); } else { setSubStep("plan"); setSubView("change"); } }} className="iz-btn-pink" style={{ ...sBtn("pink"), fontSize: 12 }}>{subView === "change" ? "Retour" : (currentOnboardingSub ? "Changer le plan" : "Souscrire maintenant")}</button>
              </div>
            </div>

            {/* ═══ VIEW: Change plan ═══ */}
            {subView === "change" && (() => {
              return (
              <div>
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
                {(() => {
                  const step = subStep || "plan";
                  const selectedMainPlan = onboardingPlans.find(p => selectedPlanIds.includes(p.id));
                  const appPlans = availablePlans.filter((p: any) => p.is_addon || p.addon_type === "ai" || p.slug === "cooptation").sort((a, b) => a.ordre - b.ordre);
                  const perEmployee = selectedMainPlan ? (pricingBilling === "yearly" ? Number(selectedMainPlan.prix_chf_mensuel) * 0.9 : Number(selectedMainPlan.prix_chf_mensuel)) : 0;
                  const total = selectedPlanIds.reduce((sum: number, id: number) => {
                    const p = availablePlans.find(pl => pl.id === id) as any;
                    if (!p) return sum;
                    const price = Number(p.prix_chf_mensuel || 0);
                    const isAi = p.addon_type === "ai";
                    if (isAi) return sum + price;
                    const isAddon = p.is_addon || p.slug === "cooptation";
                    if (isAddon) return sum + price * subEmployeeCount;
                    return sum + (pricingBilling === "yearly" ? price * 0.9 : price) * subEmployeeCount;
                  }, 0);
                  const isSwiss = (billingInfo.pays || "").toLowerCase().includes("suisse") || (billingInfo.pays || "").toLowerCase().includes("switzerland") || (billingInfo.pays || "").toUpperCase() === "CH";
                  const tax = isSwiss ? Math.round(total * 0.081 * 100) / 100 : 0;

                  const APP_ICONS: Record<string, any> = { cooptation: Users, ia_starter: Sparkles, ia_business: Sparkles, ia_enterprise: Sparkles };

                  return (
                  <div>
                    <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4, textAlign: "center" }}>Choisissez l'abonnement idéal pour votre entreprise</h2>
                    <p style={{ fontSize: 13, color: C.textMuted, textAlign: "center", marginBottom: 24 }}>Tous nos abonnements sont modulables grâce à notre suite d'applications sur mesure.</p>

                    <div style={{ display: "flex", gap: 24 }}>
                      {/* ── LEFT: Plan cards or Apps ── */}
                      <div style={{ flex: 1 }}>
                        {step === "plan" && (
                          <div style={{ display: "grid", gridTemplateColumns: `repeat(${onboardingPlans.length}, 1fr)`, gap: 20 }}>
                            {onboardingPlans.map(plan => {
                              const isSelected = selectedPlanIds.includes(plan.id);
                              const isCurrent = currentOnboardingSub?.plan_id === plan.id;
                              const isEnterprise = plan.slug === "enterprise";
                              const monthlyPrice = Number(plan.prix_chf_mensuel);
                              const displayPrice = pricingBilling === "yearly" ? Math.round(monthlyPrice * 0.9 * 100) / 100 : monthlyPrice;
                              const planModules = (plan.modules || []).filter(m => m.actif).map(m => m.module);

                              return (
                                <div key={plan.id} style={{
                                  borderRadius: 12, padding: "32px 24px", cursor: "pointer", transition: "all .15s",
                                  border: isSelected ? `2px solid ${C.pink}` : isCurrent ? `2px solid ${C.green}` : `1px solid ${C.border}`,
                                  background: C.white, display: "flex", flexDirection: "column",
                                }} onClick={() => { if (!isCurrent) setSelectedPlanIds((prev: number[]) => [plan.id, ...prev.filter((id: number) => !onboardingPlans.some(op => op.id === id))]); }}>
                                  {isCurrent && <div style={{ fontSize: 10, fontWeight: 700, color: C.green, marginBottom: 6, textTransform: "uppercase" }}>Plan actuel</div>}
                                  {plan.populaire && !isCurrent && <div style={{ fontSize: 10, fontWeight: 700, color: C.pink, marginBottom: 6, textTransform: "uppercase" }}>Populaire</div>}

                                  <h3 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 8px" }}>{plan.nom}</h3>
                                  <p style={{ fontSize: 13, color: C.textLight, marginBottom: 20, lineHeight: 1.5 }}>{plan.description}</p>

                                  <div style={{ marginBottom: 4 }}>
                                    <span style={{ fontSize: 28, fontWeight: 800 }}>CHF {displayPrice}</span>
                                    <span style={{ fontSize: 12, color: C.textMuted, marginLeft: 6 }}>/ Mois / Employé</span>
                                  </div>
                                  <div style={{ fontSize: 12, color: C.green, fontWeight: 600, marginBottom: 20 }}>Min. {plan.min_mensuel_chf || displayPrice} CHF / Mois</div>

                                  {/* Modules */}
                                  <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16, flex: 1 }}>
                                    {planModules.map(mod => (
                                      <div key={mod} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13 }}>
                                        <Check size={16} color={C.green} style={{ flexShrink: 0, marginTop: 1 }} />
                                        <span>{MODULE_LABELS[mod] || mod}</span>
                                      </div>
                                    ))}
                                  </div>

                                  {/* Limits */}
                                  <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 10, display: "flex", flexDirection: "column", gap: 4, marginBottom: 16 }}>
                                    {[
                                      { label: "Parcours", value: plan.max_parcours },
                                      { label: "Intégrations", value: plan.max_integrations },
                                      { label: "Workflows", value: plan.max_workflows },
                                    ].map(limit => (
                                      <div key={limit.label} style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: C.textMuted }}>
                                        <span>{limit.label}</span>
                                        <span style={{ fontWeight: 600, color: limit.value ? C.text : C.green }}>{limit.value ?? "Illimité"}</span>
                                      </div>
                                    ))}
                                  </div>

                                  {isCurrent ? (
                                    <div style={{ width: "100%", padding: "12px 0", borderRadius: 8, fontSize: 14, fontWeight: 600, textAlign: "center", background: C.greenLight, color: C.green, fontFamily: font }}>
                                      Plan actuel
                                    </div>
                                  ) : (
                                    <button onClick={e => { e.stopPropagation(); setSelectedPlanIds((prev: number[]) => [plan.id, ...prev.filter((id: number) => !onboardingPlans.some(op => op.id === id))]); }}
                                      style={{
                                        width: "100%", padding: "12px 0", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer",
                                        border: "none", fontFamily: font, transition: "all .15s",
                                        background: isSelected ? C.pink : "#1565C0", color: "#fff",
                                      }}>
                                      {isSelected ? "Sélectionné" : "Sélectionner"}
                                    </button>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {step === "apps" && (
                          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                            {appPlans.map((plan: any) => {
                              const isCurrentApp = activeSubs.some((s: any) => s.plan_id === plan.id && !s.canceled_at);
                              const isSelected = isCurrentApp || selectedPlanIds.includes(plan.id);
                              const IconComp = APP_ICONS[plan.slug] || Package;
                              const price = Number(plan.prix_chf_mensuel);
                              const isAi = plan.addon_type === "ai";
                              const priceLabel = isAi ? `CHF ${price} / mois (fixe)` : `CHF ${price} / employé actif / mois`;
                              const iconColor = isAi ? "#2196F3" : plan.slug === "cooptation" ? "#E91E8C" : C.textMuted;

                              return (
                                <div key={plan.id} onClick={() => { if (isCurrentApp) return; setSelectedPlanIds((prev: number[]) => {
                                  if (prev.includes(plan.id)) return prev.filter((id: number) => id !== plan.id);
                                  if (isAi) return [...prev.filter((id: number) => !appPlans.some((ap: any) => ap.addon_type === "ai" && ap.id === id)), plan.id];
                                  return [...prev, plan.id];
                                }); }}
                                  style={{
                                    border: isCurrentApp ? `2px solid ${C.green}` : isSelected ? `2px solid ${iconColor}` : `1px solid ${C.border}`,
                                    borderRadius: 12, padding: "20px 24px", cursor: isCurrentApp ? "default" : "pointer", transition: "all .15s",
                                    background: isCurrentApp ? C.greenLight + "30" : isSelected ? iconColor + "08" : C.white,
                                    display: "flex", alignItems: "center", gap: 16,
                                  }}>
                                  <div style={{ width: 44, height: 44, borderRadius: 10, background: isCurrentApp ? C.greenLight : iconColor + "15", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                    {isCurrentApp ? <CheckCircle size={22} color={C.green} /> : <IconComp size={22} color={iconColor} />}
                                  </div>
                                  <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: 15, fontWeight: 700 }}>{plan.nom} {isCurrentApp && <span style={{ fontSize: 10, color: C.green, fontWeight: 600 }}>Actif</span>}</div>
                                    <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>{plan.description}</div>
                                    <div style={{ fontSize: 12, color: C.textLight, marginTop: 6, fontWeight: 600 }}>{priceLabel}</div>
                                    {isAi && (
                                      <div style={{ display: "flex", gap: 12, marginTop: 6, fontSize: 11, color: C.textMuted }}>
                                        {plan.ai_ocr_scans && <span>OCR: {plan.ai_ocr_scans}/mois</span>}
                                        {plan.ai_bot_messages > 0 && <span>Bot: {plan.ai_bot_messages} msgs</span>}
                                        {plan.ai_contrat_generations && <span>Contrats IA: {plan.ai_contrat_generations}/mois</span>}
                                        {plan.ai_translations && <span>Traductions IA: {plan.ai_translations}/mois</span>}
                                      </div>
                                    )}
                                  </div>
                                  {!isCurrentApp && <div style={{
                                    width: 24, height: 24, borderRadius: 6, border: isSelected ? `2px solid ${iconColor}` : `2px solid ${C.border}`,
                                    background: isSelected ? iconColor : "transparent",
                                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all .15s",
                                  }}>
                                    {isSelected && <Check size={14} color="#fff" />}
                                  </div>}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* ── RIGHT SIDEBAR ── */}
                      <div style={{ width: 320, flexShrink: 0 }}>
                        <div style={{ border: `1px solid ${C.border}`, borderRadius: 12, padding: "24px", position: "sticky", top: 24, background: C.white }}>
                          {/* Billing toggle */}
                          <div style={{ display: "flex", gap: 0, marginBottom: 8, background: C.bg, borderRadius: 8, padding: 3 }}>
                            {(["monthly", "yearly"] as const).map(b => (
                              <button key={b} onClick={() => setPricingBilling(b)} style={{
                                flex: 1, padding: "10px 0", borderRadius: 6, fontSize: 13, fontWeight: pricingBilling === b ? 600 : 400,
                                border: "none", cursor: "pointer", fontFamily: font,
                                background: pricingBilling === b ? C.pink : "transparent",
                                color: pricingBilling === b ? C.white : C.textMuted,
                              }}>
                                {b === "monthly" ? "Mensuellement" : "Annuellement"}
                              </button>
                            ))}
                          </div>
                          {pricingBilling === "yearly" && (
                            <div style={{ fontSize: 11, color: C.green, fontWeight: 700, textAlign: "right", marginBottom: 12, padding: "2px 8px", background: C.greenLight, borderRadius: 4, display: "inline-block", float: "right" }}>10% Réduction</div>
                          )}
                          <div style={{ clear: "both" }} />

                          {/* Step 1: Plan */}
                          <div style={{ marginTop: 16, marginBottom: 16 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
                              <span style={{ fontSize: 14, fontWeight: 700 }}>1. Choisissez un plan</span>
                              {selectedMainPlan && <span style={{ fontSize: 13, fontWeight: 700 }}>{Math.round(perEmployee * subEmployeeCount * 100) / 100} CHF</span>}
                            </div>
                            <div style={{ fontSize: 13, color: C.textMuted }}>
                              {selectedMainPlan ? (
                                <>
                                  {selectedMainPlan.nom}
                                  <div style={{ fontSize: 11, color: C.textLight }}>( {perEmployee} CHF / employé actif )</div>
                                </>
                              ) : "Aucun plan sélectionné"}
                            </div>
                          </div>

                          {/* Step 2: Employees */}
                          <div style={{ marginBottom: 16 }}>
                            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>2. Nombre d'employés</div>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <button onClick={() => setSubEmployeeCount(Math.max(25, subEmployeeCount - 5))} style={{ width: 36, height: 36, borderRadius: "50%", border: `1px solid ${C.border}`, background: C.white, cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: font }}>−</button>
                              <input type="number" value={subEmployeeCount} onChange={(e: any) => setSubEmployeeCount(Math.max(25, Number(e.target.value)))} style={{ width: 60, textAlign: "center", padding: "8px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 16, fontWeight: 700, fontFamily: font }} />
                              <button onClick={() => setSubEmployeeCount(subEmployeeCount + 5)} style={{ width: 36, height: 36, borderRadius: "50%", border: `1px solid ${C.border}`, background: C.white, cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: font }}>+</button>
                            </div>
                          </div>

                          {/* Navigation buttons */}
                          {step === "plan" && selectedMainPlan && (
                            <button onClick={() => setSubStep("apps")} style={{
                              width: "100%", padding: "12px 0", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer",
                              border: "none", background: "#1565C0", color: "#fff", fontFamily: font, marginBottom: 16,
                            }}>
                              Choisir les applications
                            </button>
                          )}

                          {step === "apps" && (
                            <>
                              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>3. Applications</div>
                              <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 12 }}>Sélectionnez les applications nécessaires.</div>

                              {/* Payment method */}
                              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>4. Mode de paiement</div>
                              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 }}>
                                {([
                                  { id: "stripe" as const, label: "Payer par carte", desc: "Visa, Mastercard — 3D Secure", icon: "💳" },
                                  { id: "sepa" as const, label: "Prélèvement SEPA", desc: "Débit direct sur votre compte bancaire (IBAN)", icon: "🏦" },
                                  { id: "invoice" as const, label: "Payer par facture", desc: "Facture 30 jours, virement bancaire", icon: "📄" },
                                ] as const).map(pm => (
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

                              <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                                <button onClick={() => setSubStep("plan")} style={{ ...sBtn("outline"), fontSize: 12, padding: "10px 16px" }}>Retour</button>
                                <button onClick={async () => {
                                  // Always open checkout modal
                                  if ((paymentMethod === "stripe" || paymentMethod === "sepa") && !stripePromise) {
                                    try {
                                      const r = await createStripeSetupIntent();
                                      if (r.publishable_key) setStripePromise(lazyLoadStripe(r.publishable_key));
                                    } catch { addToast_admin("Impossible de charger Stripe"); return; }
                                  }
                                  setBillingModalOpen(true);
                                }} style={{
                                  flex: 1, padding: "10px 0", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer",
                                  border: "none", background: "#1565C0", color: "#fff", fontFamily: font,
                                }}>
                                  {paymentMethod === "invoice" ? "Souscrire — Facture" : paymentMethod === "sepa" ? "Souscrire — Prélèvement" : "Souscrire — Carte"}
                                </button>
                              </div>

                              {/* Saved cards */}
                              {paymentMethod === "stripe" && stripeMethods.length > 0 && (
                                <div style={{ marginBottom: 14 }}>
                                  <div style={{ fontSize: 11, fontWeight: 600, color: C.textMuted, marginBottom: 6 }}>Carte enregistrée</div>
                                  {stripeMethods.filter((m: any) => m.is_default).map((m: any) => (
                                    <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", border: `1px solid #635BFF`, borderRadius: 8, background: "#635BFF08", fontSize: 12 }}>
                                      <span style={{ fontWeight: 600 }}>{m.brand?.toUpperCase()}</span>
                                      <span>•••• {m.last4}</span>
                                      <span style={{ color: C.textMuted }}>{String(m.exp_month).padStart(2, "0")}/{m.exp_year}</span>
                                      <button onClick={() => { if (!stripePromise) createStripeSetupIntent().then(r => { if (r.publishable_key) setStripePromise(lazyLoadStripe(r.publishable_key)); }).catch(() => {}); setStripeModalOpen(true); }} style={{ marginLeft: "auto", background: "none", border: "none", fontSize: 10, color: "#635BFF", cursor: "pointer", fontWeight: 600 }}>Modifier</button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </>
                          )}

                          {/* Total */}
                          <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 16 }}>
                            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Prix Total Estimatif</div>
                            <div style={{ fontSize: 28, fontWeight: 800 }}>{Math.round(total * 100) / 100} CHF</div>
                            <div style={{ fontSize: 12, color: C.textMuted }}>( {pricingBilling === "yearly" ? "Annuellement" : "Mensuellement"} )</div>
                            {isSwiss
                              ? <div style={{ fontSize: 12, color: C.textMuted, marginTop: 4 }}>TVA 8.10% incluse : {Math.round((total + tax) * 100) / 100} CHF</div>
                              : <div style={{ fontSize: 12, color: C.textMuted, marginTop: 4 }}>Hors taxes (TVA non applicable)</div>
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  );
                })()}
              </div>
              );
            })()}


            {/* ═══ Unified Checkout Modal ═══ */}
            {billingModalOpen && (() => {
              const checkoutCardRef = { current: null as ((() => Promise<boolean>) | null) };
              const doSubscribe = async () => {
                // 1. Validate billing
                if (!billingInfo.prenom || !billingInfo.nom || !billingInfo.email) {
                  addToast_admin("Prénom, Nom et E-mail sont obligatoires");
                  return;
                }
                // 2. Save billing info
                try {
                  await saveBillingContact({ prenom: billingInfo.prenom, nom: billingInfo.nom, email: billingInfo.email, telephone: billingInfo.telephone, pays: billingInfo.pays });
                  await apiSaveBillingInfo({ company: billingInfo.company, vat: billingInfo.vat, rue: billingInfo.rue, numero: billingInfo.numero, complement: billingInfo.complement, case_postale: billingInfo.case_postale, localite: billingInfo.localite, code_postal: billingInfo.code_postal, ville: billingInfo.ville, canton: billingInfo.canton, pays: billingInfo.pays_facturation || billingInfo.pays });
                } catch { addToast_admin("Erreur lors de la sauvegarde des informations"); return; }
                // 3. If stripe/sepa + no payment method saved → save via Stripe
                if ((paymentMethod === "stripe" || paymentMethod === "sepa") && stripeMethods.length === 0) {
                  if (checkoutCardRef.current) {
                    const ok = await checkoutCardRef.current();
                    if (!ok) return;
                    const methods = await getStripePaymentMethods();
                    setStripeMethods(methods.methods || []);
                  }
                }
                // 4. Subscribe
                for (const pid of selectedPlanIds) {
                  try { await subscribeToPlan(pid, pricingBilling, paymentMethod, subEmployeeCount); } catch {}
                }
                setBillingModalOpen(false);
                reloadSub(); setSubView("overview"); setSelectedPlanIds([]); setSubStep("plan");
                addToast_admin("Abonnement activé avec succès !");
              };

              return (
              <div style={{ position: "fixed", inset: 0, zIndex: 10000, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,.45)" }} onClick={() => setBillingModalOpen(false)}>
                <div style={{ background: C.white, borderRadius: 16, width: 640, maxWidth: "95vw", maxHeight: "90vh", overflow: "auto", padding: 28, boxShadow: "0 20px 60px rgba(0,0,0,.2)" }} onClick={e => e.stopPropagation()}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
                    <div>
                      <h3 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Finaliser votre souscription</h3>
                      <p style={{ fontSize: 12, color: C.textMuted, margin: 0 }}>Complétez vos informations et {paymentMethod === "stripe" ? "enregistrez votre carte" : "confirmez"} pour activer votre abonnement</p>
                    </div>
                    <button onClick={() => setBillingModalOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}><X size={18} color={C.textMuted} /></button>
                  </div>

                  {/* ── Section 1: Contact ── */}
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10, color: C.text }}>1. Contact de facturation</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
                    <div><label style={{ fontSize: 11, color: C.textMuted, display: "block", marginBottom: 4 }}>Prénom *</label><input style={{ ...sInput, width: "100%" }} value={billingInfo.prenom} onChange={e => setBillingInfo({ ...billingInfo, prenom: e.target.value })} /></div>
                    <div><label style={{ fontSize: 11, color: C.textMuted, display: "block", marginBottom: 4 }}>Nom *</label><input style={{ ...sInput, width: "100%" }} value={billingInfo.nom} onChange={e => setBillingInfo({ ...billingInfo, nom: e.target.value })} /></div>
                    <div><label style={{ fontSize: 11, color: C.textMuted, display: "block", marginBottom: 4 }}>E-mail *</label><input type="email" style={{ ...sInput, width: "100%" }} value={billingInfo.email} onChange={e => setBillingInfo({ ...billingInfo, email: e.target.value })} /></div>
                    <div><label style={{ fontSize: 11, color: C.textMuted, display: "block", marginBottom: 4 }}>Téléphone</label><input style={{ ...sInput, width: "100%" }} value={billingInfo.telephone} onChange={e => setBillingInfo({ ...billingInfo, telephone: e.target.value })} /></div>
                    <div><label style={{ fontSize: 11, color: C.textMuted, display: "block", marginBottom: 4 }}>Pays</label><input style={{ ...sInput, width: "100%" }} value={billingInfo.pays} onChange={e => setBillingInfo({ ...billingInfo, pays: e.target.value })} /></div>
                  </div>

                  {/* ── Section 2: Company ── */}
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10, color: C.text }}>2. Adresse de facturation</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
                    <div style={{ gridColumn: "1/-1" }}><label style={{ fontSize: 11, color: C.textMuted, display: "block", marginBottom: 4 }}>Entreprise</label><input style={{ ...sInput, width: "100%" }} value={billingInfo.company} onChange={e => setBillingInfo({ ...billingInfo, company: e.target.value })} /></div>
                    <div><label style={{ fontSize: 11, color: C.textMuted, display: "block", marginBottom: 4 }}>Numéro de TVA</label><input style={{ ...sInput, width: "100%" }} value={billingInfo.vat} onChange={e => setBillingInfo({ ...billingInfo, vat: e.target.value })} placeholder="CHE-xxx.xxx.xxx" /></div>
                    <div><label style={{ fontSize: 11, color: C.textMuted, display: "block", marginBottom: 4 }}>Rue</label><input style={{ ...sInput, width: "100%" }} value={billingInfo.rue} onChange={e => setBillingInfo({ ...billingInfo, rue: e.target.value })} /></div>
                    <div><label style={{ fontSize: 11, color: C.textMuted, display: "block", marginBottom: 4 }}>Numéro</label><input style={{ ...sInput, width: "100%" }} value={billingInfo.numero} onChange={e => setBillingInfo({ ...billingInfo, numero: e.target.value })} /></div>
                    <div><label style={{ fontSize: 11, color: C.textMuted, display: "block", marginBottom: 4 }}>Code postal</label><input style={{ ...sInput, width: "100%" }} value={billingInfo.code_postal} onChange={e => setBillingInfo({ ...billingInfo, code_postal: e.target.value })} /></div>
                    <div><label style={{ fontSize: 11, color: C.textMuted, display: "block", marginBottom: 4 }}>Ville</label><input style={{ ...sInput, width: "100%" }} value={billingInfo.ville} onChange={e => setBillingInfo({ ...billingInfo, ville: e.target.value })} /></div>
                    <div><label style={{ fontSize: 11, color: C.textMuted, display: "block", marginBottom: 4 }}>Canton / Région</label><input style={{ ...sInput, width: "100%" }} value={billingInfo.canton} onChange={e => setBillingInfo({ ...billingInfo, canton: e.target.value })} /></div>
                  </div>

                  {/* ── Section 3: Payment ── */}
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10, color: C.text }}>3. Mode de paiement</div>
                    {(paymentMethod === "stripe" || paymentMethod === "sepa") && stripeMethods.length === 0 && (
                      stripePromise ? (
                        <Elements stripe={stripePromise}>
                          <CheckoutPaymentSection billingInfo={billingInfo} auth={auth} submitRef={checkoutCardRef} paymentMethod={paymentMethod} />
                        </Elements>
                      ) : (
                        <div style={{ textAlign: "center", padding: "20px 0", color: C.textMuted, fontSize: 13 }}>Chargement de Stripe...</div>
                      )
                    )}
                    {(paymentMethod === "stripe" || paymentMethod === "sepa") && stripeMethods.length > 0 && (
                      stripeMethods.filter((m: any) => m.is_default).map((m: any) => (
                        <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", border: `1px solid #635BFF`, borderRadius: 8, background: "#635BFF08", fontSize: 13 }}>
                          {m.type === "sepa_debit" ? <Landmark size={16} color="#635BFF" /> : <span style={{ fontWeight: 600 }}>{m.brand?.toUpperCase()}</span>}
                          <span>•••• {m.last4}</span>
                          {m.type !== "sepa_debit" && <span style={{ color: C.textMuted }}>exp. {String(m.exp_month).padStart(2, "0")}/{m.exp_year}</span>}
                          {m.type === "sepa_debit" && m.country && <span style={{ color: C.textMuted }}>{m.country}</span>}
                          <CheckCircle size={16} color={C.green} style={{ marginLeft: "auto" }} />
                        </div>
                      ))
                    )}
                    {paymentMethod === "invoice" && (
                      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", border: `1px solid ${C.blue}`, borderRadius: 8, background: C.blueLight + "30", fontSize: 13 }}>
                        <FileText size={18} color={C.blue} />
                        <span>Paiement par facture — 30 jours, virement bancaire</span>
                        <CheckCircle size={16} color={C.green} style={{ marginLeft: "auto" }} />
                      </div>
                    )}
                  </div>

                  {/* ── Actions ── */}
                  <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, borderTop: `1px solid ${C.border}`, paddingTop: 16 }}>
                    <button onClick={() => setBillingModalOpen(false)} style={{ padding: "12px 20px", fontSize: 13, background: "none", border: `1px solid ${C.border}`, borderRadius: 8, cursor: "pointer", color: C.text, fontFamily: font }}>Annuler</button>
                    <button onClick={doSubscribe} style={{ padding: "12px 28px", fontSize: 14, fontWeight: 600, background: C.pink, color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontFamily: font }}>
                      Confirmer la souscription
                    </button>
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
                    { label: "Modules actifs", value: (() => { const appSubs = activeSubs.filter((s: any) => s.plan?.is_addon || s.plan?.addon_type === "ai" || s.plan?.slug === "cooptation"); return currentOnboardingSub ? `1 plan${appSubs.length > 0 ? ` + ${appSubs.length} app${appSubs.length > 1 ? "s" : ""}` : ""}` : `${tenantActiveModules.length} module${tenantActiveModules.length > 1 ? "s" : ""}`; })(), max: "inclus dans votre plan" },
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
                    { id: "consommation" as const, label: "Consommation" },
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
                  {subTab === "consommation" && (() => {
                    const { consoData, setConsoData, consoMonth, setConsoMonth, consoLoading, setConsoLoading, consoFilter, setConsoFilter, consoSearch, setConsoSearch, loadConsumption } = ctx;

                    const prevMonth = () => {
                      setConsoMonth(prev => prev.month === 1 ? { year: prev.year - 1, month: 12 } : { ...prev, month: prev.month - 1 });
                    };
                    const nextMonth = () => {
                      const now = new Date();
                      const cur = consoMonth.year * 12 + consoMonth.month;
                      const max = now.getFullYear() * 12 + (now.getMonth() + 1);
                      if (cur < max) setConsoMonth(prev => prev.month === 12 ? { year: prev.year + 1, month: 1 } : { ...prev, month: prev.month + 1 });
                    };

                    const filteredUsers = (consoData?.users || [])
                      .filter(u => consoFilter === "all" || u.role === consoFilter)
                      .filter(u => !consoSearch || `${u.prenom} ${u.nom} ${u.email} ${u.site}`.toLowerCase().includes(consoSearch.toLowerCase()));

                    return (
                      <div>
                        <p style={{ fontSize: 13, color: C.textLight, marginBottom: 16 }}>Facturation par employé actif consommé. Minimum 25 employés facturés par mois.</p>

                        {/* Month navigator */}
                        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                          <button onClick={prevMonth} style={{ border: `1px solid ${C.border}`, borderRadius: 8, background: C.white, cursor: "pointer", padding: "6px 12px", fontFamily: font }}><ChevronLeft size={14} /></button>
                          <span style={{ fontSize: 15, fontWeight: 600, textTransform: "capitalize", minWidth: 160, textAlign: "center" }}>{consoData?.month_label || `${consoMonth.month}/${consoMonth.year}`}</span>
                          <button onClick={nextMonth} style={{ border: `1px solid ${C.border}`, borderRadius: 8, background: C.white, cursor: "pointer", padding: "6px 12px", fontFamily: font }}><ChevronRight size={14} /></button>
                        </div>

                        {consoLoading ? (
                          <div style={{ textAlign: "center", padding: 40, color: C.textMuted }}>Chargement...</div>
                        ) : consoData ? (
                          <>
                            {/* Summary cards */}
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 20 }}>
                              <div style={{ padding: "14px 16px", borderRadius: 10, background: C.blueLight, border: `1px solid ${C.blue}20` }}>
                                <div style={{ fontSize: 24, fontWeight: 700, color: C.blue }}>{consoData.total_active}</div>
                                <div style={{ fontSize: 11, color: C.blue, fontWeight: 600 }}>Utilisateurs actifs</div>
                              </div>
                              <div style={{ padding: "14px 16px", borderRadius: 10, background: "#FFF3E0", border: "1px solid #FF980020" }}>
                                <div style={{ fontSize: 24, fontWeight: 700, color: "#E65100" }}>{consoData.admin_count}</div>
                                <div style={{ fontSize: 11, color: "#E65100", fontWeight: 600 }}>Admins</div>
                              </div>
                              <div style={{ padding: "14px 16px", borderRadius: 10, background: "#E8F5E9", border: "1px solid #4CAF5020" }}>
                                <div style={{ fontSize: 24, fontWeight: 700, color: "#2E7D32" }}>{consoData.employee_count}</div>
                                <div style={{ fontSize: 11, color: "#2E7D32", fontWeight: 600 }}>Employés</div>
                              </div>
                            </div>

                            {/* Billed count */}
                            <div style={{ padding: "12px 16px", background: C.bg, borderRadius: 8, marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <span style={{ fontSize: 13, color: C.text }}>Employés facturés ce mois</span>
                              <span style={{ fontSize: 16, fontWeight: 700, color: C.pink }}>{consoData.billed_count} <span style={{ fontSize: 11, fontWeight: 400, color: C.textMuted }}>(min. 25)</span></span>
                            </div>

                            {/* Filters */}
                            <div style={{ display: "flex", gap: 8, marginBottom: 12, alignItems: "center" }}>
                              <div style={{ display: "flex", gap: 0, background: C.bg, borderRadius: 8, padding: 2 }}>
                                {([["all", "Tous"], ["admin", "Admins"], ["employé", "Employés"]] as const).map(([val, label]) => (
                                  <button key={val} onClick={() => setConsoFilter(val as any)} style={{ padding: "5px 12px", borderRadius: 6, fontSize: 11, fontWeight: consoFilter === val ? 600 : 400, border: "none", cursor: "pointer", fontFamily: font, background: consoFilter === val ? C.pink : "transparent", color: consoFilter === val ? C.white : C.textMuted }}>{label}</button>
                                ))}
                              </div>
                              <div style={{ flex: 1 }} />
                              <div style={{ display: "flex", alignItems: "center", gap: 6, background: C.bg, borderRadius: 8, padding: "5px 10px" }}>
                                <Search size={12} color={C.textMuted} />
                                <input value={consoSearch} onChange={e => setConsoSearch(e.target.value)} placeholder="Rechercher..." style={{ border: "none", outline: "none", background: "transparent", fontSize: 12, fontFamily: font, color: C.text, width: 140 }} />
                              </div>
                            </div>

                            {/* User table */}
                            <div style={{ border: `1px solid ${C.border}`, borderRadius: 10, overflow: "hidden" }}>
                              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                                <thead>
                                  <tr style={{ background: C.bg }}>
                                    <th style={{ padding: "10px 14px", textAlign: "left", fontWeight: 600, fontSize: 11, color: C.textLight, textTransform: "uppercase" }}>Prénom</th>
                                    <th style={{ padding: "10px 14px", textAlign: "left", fontWeight: 600, fontSize: 11, color: C.textLight, textTransform: "uppercase" }}>Nom</th>
                                    <th style={{ padding: "10px 14px", textAlign: "left", fontWeight: 600, fontSize: 11, color: C.textLight, textTransform: "uppercase" }}>Site</th>
                                    <th style={{ padding: "10px 14px", textAlign: "left", fontWeight: 600, fontSize: 11, color: C.textLight, textTransform: "uppercase" }}>Département</th>
                                    <th style={{ padding: "10px 14px", textAlign: "center", fontWeight: 600, fontSize: 11, color: C.textLight, textTransform: "uppercase" }}>Rôle</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {filteredUsers.map((u, i) => (
                                    <tr key={u.id} style={{ borderTop: `1px solid ${C.border}`, background: i % 2 === 0 ? "transparent" : C.bg + "60" }}>
                                      <td style={{ padding: "8px 14px" }}>{u.prenom}</td>
                                      <td style={{ padding: "8px 14px", fontWeight: 500 }}>{u.nom}</td>
                                      <td style={{ padding: "8px 14px", color: C.textMuted }}>{u.site}</td>
                                      <td style={{ padding: "8px 14px", color: C.textMuted }}>{u.departement}</td>
                                      <td style={{ padding: "8px 14px", textAlign: "center" }}>
                                        <span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 600, background: u.role === "admin" ? "#FFF3E0" : "#E8F5E9", color: u.role === "admin" ? "#E65100" : "#2E7D32" }}>{u.role === "admin" ? "Admin" : "Employé"}</span>
                                      </td>
                                    </tr>
                                  ))}
                                  {filteredUsers.length === 0 && (
                                    <tr><td colSpan={5} style={{ padding: 20, textAlign: "center", color: C.textMuted, fontSize: 12 }}>Aucun utilisateur trouvé</td></tr>
                                  )}
                                </tbody>
                              </table>
                            </div>

                            <div style={{ marginTop: 16, padding: "12px 16px", background: C.blueLight, borderRadius: 8, fontSize: 12, color: C.blue }}>
                              Un employé actif dans le mois (même 1 seconde) est facturé pour le mois entier. Les admins comptent comme des employés actifs consommés.
                            </div>

                            {/* AI Consumption */}
                            {(() => {
                              const hasAiPlan = tenantSubscriptions.some((s: any) => (s.status === "active" || s.status === "trialing") && s.plan?.addon_type === "ai");
                              const aiPlan = tenantSubscriptions.find((s: any) => (s.status === "active" || s.status === "trialing") && s.plan?.addon_type === "ai")?.plan;
                              if (!hasAiPlan) return null;

                              const { aiUsageData, setAiUsageData } = ctx;
                              if (!aiUsageData && !ctx._aiUsageLoaded) {
                                ctx._aiUsageLoaded = true;
                                import('../api/endpoints').then(m => m.apiFetch?.('/ai/quota') || fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001/api/v1'}/ai/quota`, { headers: { 'X-Tenant': localStorage.getItem('illizeo_tenant_id') || 'illizeo', Authorization: `Bearer ${localStorage.getItem('illizeo_token')}` } }).then(r => r.json()))
                                  .then((d: any) => ctx.setAiUsageData?.(d)).catch(() => {});
                              }

                              if (!aiUsageData) return null;

                              const usage = aiUsageData.usage || {};
                              const billedChf = aiUsageData.billed_chf || 0;
                              const costChf = aiUsageData.cost_chf || 0;
                              const planMonthly = aiUsageData.plan_monthly_chf || 0;

                              const items = [
                                { label: "Assistant employé", count: usage.chat_employee || 0, color: C.blue, Icon: MessageCircle },
                                { label: "Assistant admin", count: usage.chat_admin || 0, color: "#7B5EA7", Icon: UserCheck },
                                { label: "Scans OCR", count: usage.ocr_scans || 0, color: "#1A73E8", Icon: Search },
                                { label: "Contrats IA", count: usage.contrat_generations || 0, color: C.pink, Icon: FileSignature },
                                { label: "Génération parcours", count: usage.generate_parcours || 0, color: C.green, Icon: Route },
                                { label: "Insights IA", count: usage.insights || 0, color: "#F9A825", Icon: Sparkles },
                                { label: "Traductions IA", count: usage.translation || 0, color: "#00897B", Icon: Languages },
                              ];

                              return (
                                <div style={{ marginTop: 24 }}>
                                  <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4, display: "flex", alignItems: "center", gap: 8 }}><Sparkles size={16} color={C.blue} /> Consommation IA — {aiUsageData.plan_name || aiPlan?.nom}</h3>
                                  <p style={{ fontSize: 12, color: C.textMuted, marginBottom: 16 }}>Facturation à l'usage · Mois en cours</p>

                                  {/* Usage cost summary */}
                                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                                    <div style={{ padding: "16px 20px", borderRadius: 10, background: C.bg }}>
                                      <div style={{ fontSize: 10, color: C.textMuted, marginBottom: 4 }}>Forfait mensuel</div>
                                      <div style={{ fontSize: 22, fontWeight: 700, color: C.text }}>{planMonthly} <span style={{ fontSize: 12, fontWeight: 400 }}>CHF</span></div>
                                    </div>
                                    <div style={{ padding: "16px 20px", borderRadius: 10, background: billedChf > planMonthly ? "#FFF3E0" : C.greenLight }}>
                                      <div style={{ fontSize: 10, color: billedChf > planMonthly ? "#E65100" : C.green, marginBottom: 4 }}>Consommation ce mois</div>
                                      <div style={{ fontSize: 22, fontWeight: 700, color: billedChf > planMonthly ? "#E65100" : C.green }}>{billedChf < 0.01 && billedChf > 0 ? billedChf.toFixed(4) : billedChf.toFixed(2)} <span style={{ fontSize: 12, fontWeight: 400 }}>CHF</span></div>
                                    </div>
                                  </div>

                                  {/* Usage counts — all AI features */}
                                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 16 }}>
                                    {items.filter(it => it.count > 0 || ["Assistant employé", "Assistant admin", "Scans OCR", "Traductions IA"].includes(it.label)).map(it => (
                                      <div key={it.label} style={{ padding: "12px 14px", borderRadius: 10, border: `1px solid ${C.border}`, textAlign: "center" }}>
                                        <div style={{ marginBottom: 2, display: "flex", justifyContent: "center" }}><it.Icon size={20} color={it.color} /></div>
                                        <div style={{ fontSize: 18, fontWeight: 700, color: it.color }}>{it.count}</div>
                                        <div style={{ fontSize: 10, color: C.textMuted, marginTop: 2 }}>{it.label}</div>
                                      </div>
                                    ))}
                                  </div>

                                  {/* Spending cap */}
                                  {(() => {
                                    const maxCap = planMonthly * 3;
                                    if (!_spendingCapLoading && !_spendingCapCache) {
                                      _spendingCapLoading = true;
                                      apiFetch('/ai/spending-cap').then((d: any) => {
                                        if (d && typeof d === 'object' && 'spending_cap_chf' in d) {
                                          _spendingCapCache = d;
                                        } else {
                                          _spendingCapCache = { spending_cap_chf: planMonthly || 29, current_billed_chf: 0, current_cost_chf: 0, percent_used: 0 };
                                        }
                                        setAiUsageData((prev: any) => ({ ...prev, _capTick: Date.now() }));
                                      }).catch(() => {
                                        _spendingCapCache = { spending_cap_chf: planMonthly || 29, current_billed_chf: 0, current_cost_chf: 0, percent_used: 0 };
                                        setAiUsageData((prev: any) => ({ ...prev, _capTick: Date.now() }));
                                      });
                                    }
                                    const cap = _spendingCapCache;
                                    return (
                                      <div style={{ padding: "14px 16px", borderRadius: 10, border: `1px solid ${C.border}`, background: C.white }}>
                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                            <ShieldCheck size={14} color={C.blue} />
                                            <span style={{ fontSize: 12, fontWeight: 600, color: C.text }}>Plafond de dépense mensuel</span>
                                          </div>
                                          {cap && <span style={{ fontSize: 11, color: cap.percent_used > 80 ? C.red : C.textMuted }}>{cap.percent_used}% utilisé</span>}
                                        </div>
                                        {cap ? (
                                          <>
                                            <div style={{ height: 6, borderRadius: 3, background: C.bg, overflow: "hidden", marginBottom: 8 }}>
                                              <div style={{ height: "100%", borderRadius: 3, width: `${Math.min(100, cap.percent_used)}%`, background: cap.percent_used > 80 ? C.red : cap.percent_used > 50 ? "#FF9800" : C.green, transition: "width .3s" }} />
                                            </div>
                                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 11 }}>
                                              <span style={{ color: C.textMuted }}>{cap.current_billed_chf} CHF consommés / {cap.spending_cap_chf} CHF max</span>
                                              <button onClick={() => {
                                                showPrompt(`Plafond mensuel en CHF (max ${maxCap} CHF = 3× votre forfait, 0 = illimité) :`, async (val: string) => {
                                                  const num = Number(val);
                                                  if (isNaN(num) || num < 0) { addToast_admin("Montant invalide"); return; }
                                                  if (num > 0 && num > maxCap) { addToast_admin(`Le plafond ne peut pas dépasser ${maxCap} CHF (3× votre forfait de ${planMonthly} CHF)`); return; }
                                                  try {
                                                    await apiFetch('/ai/spending-cap', { method: 'POST', body: JSON.stringify({ spending_cap_chf: num }) });
                                                    _spendingCapCache = null; _spendingCapLoading = false;
                                                    setAiUsageData((prev: any) => ({ ...prev, _capTick: Date.now() }));
                                                    addToast_admin("Plafond mis à jour");
                                                  } catch { addToast_admin("Erreur"); }
                                                }, { label: `Montant en CHF (max ${maxCap})`, defaultValue: String(cap.spending_cap_chf) });
                                              }} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 10, color: C.blue, fontWeight: 500 }}>Modifier</button>
                                            </div>
                                          </>
                                        ) : (
                                          <div style={{ fontSize: 11, color: C.textMuted }}>Chargement...</div>
                                        )}
                                      </div>
                                    );
                                  })()}

                                  {/* Auto-recharge IA */}
                                  {(() => {
                                    if (!_autoRechargeLoading && !_autoRechargeCache) {
                                      _autoRechargeLoading = true;
                                      apiFetch('/ai/auto-recharge').then((d: any) => {
                                        if (d && typeof d === 'object') _autoRechargeCache = d;
                                        else _autoRechargeCache = { enabled: false, threshold_percent: 90, recharge_amount_chf: 50, recharge_credits: 100, max_recharges_per_month: 3, recharges_this_month: 0 };
                                        setAiUsageData((prev: any) => ({ ...prev, _rechargeTick: Date.now() }));
                                      }).catch(() => {
                                        _autoRechargeCache = { enabled: false, threshold_percent: 90, recharge_amount_chf: 50, recharge_credits: 100, max_recharges_per_month: 3, recharges_this_month: 0 };
                                        setAiUsageData((prev: any) => ({ ...prev, _rechargeTick: Date.now() }));
                                      });
                                    }
                                    const rc = _autoRechargeCache;
                                    if (!rc) return null;

                                    const saveRecharge = async (updates: any) => {
                                      const newConfig = { ...rc, ...updates };
                                      try {
                                        await apiFetch('/ai/auto-recharge', { method: 'POST', body: JSON.stringify(newConfig) });
                                        _autoRechargeCache = newConfig;
                                        setAiUsageData((prev: any) => ({ ...prev, _rechargeTick: Date.now() }));
                                        addToast_admin("Configuration mise à jour");
                                      } catch { addToast_admin("Erreur"); }
                                    };

                                    return (
                                      <div style={{ padding: "14px 16px", borderRadius: 10, border: `1px solid ${C.border}`, background: C.white, marginTop: 12 }}>
                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                            <Zap size={14} color="#F9A825" />
                                            <span style={{ fontSize: 12, fontWeight: 600, color: C.text }}>Recharge automatique</span>
                                          </div>
                                          <button
                                            onClick={() => saveRecharge({ enabled: !rc.enabled })}
                                            style={{
                                              position: "relative", width: 36, height: 20, borderRadius: 10, border: "none", cursor: "pointer",
                                              background: rc.enabled ? C.green : C.border, transition: "background .2s",
                                            }}
                                          >
                                            <div style={{
                                              position: "absolute", top: 2, left: rc.enabled ? 18 : 2, width: 16, height: 16,
                                              borderRadius: "50%", background: "#fff", transition: "left .2s", boxShadow: "0 1px 3px rgba(0,0,0,.2)",
                                            }} />
                                          </button>
                                        </div>

                                        {rc.enabled ? (
                                          <div style={{ fontSize: 11, color: C.textMuted }}>
                                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
                                              <div>
                                                <div style={{ marginBottom: 2, fontWeight: 500, color: C.text }}>Seuil de déclenchement</div>
                                                <select
                                                  value={rc.threshold_percent}
                                                  onChange={(e) => saveRecharge({ threshold_percent: Number(e.target.value) })}
                                                  style={{ width: "100%", padding: "6px 8px", borderRadius: 6, border: `1px solid ${C.border}`, fontSize: 11, background: C.white, color: C.text }}
                                                >
                                                  {[50, 60, 70, 80, 90].map(v => <option key={v} value={v}>{v}% du plafond</option>)}
                                                </select>
                                              </div>
                                              <div>
                                                <div style={{ marginBottom: 2, fontWeight: 500, color: C.text }}>Montant par recharge</div>
                                                <select
                                                  value={rc.recharge_amount_chf}
                                                  onChange={(e) => saveRecharge({ recharge_amount_chf: Number(e.target.value) })}
                                                  style={{ width: "100%", padding: "6px 8px", borderRadius: 6, border: `1px solid ${C.border}`, fontSize: 11, background: C.white, color: C.text }}
                                                >
                                                  {[10, 20, 50, 100, 200].map(v => <option key={v} value={v}>{v} CHF</option>)}
                                                </select>
                                              </div>
                                              <div>
                                                <div style={{ marginBottom: 2, fontWeight: 500, color: C.text }}>Max recharges / mois</div>
                                                <select
                                                  value={rc.max_recharges_per_month}
                                                  onChange={(e) => saveRecharge({ max_recharges_per_month: Number(e.target.value) })}
                                                  style={{ width: "100%", padding: "6px 8px", borderRadius: 6, border: `1px solid ${C.border}`, fontSize: 11, background: C.white, color: C.text }}
                                                >
                                                  {[1, 2, 3, 5, 10].map(v => <option key={v} value={v}>{v} fois</option>)}
                                                </select>
                                              </div>
                                              <div>
                                                <div style={{ marginBottom: 2, fontWeight: 500, color: C.text }}>Recharges ce mois</div>
                                                <div style={{ padding: "6px 8px", borderRadius: 6, background: C.bg, fontWeight: 600, color: C.text }}>{rc.recharges_this_month} / {rc.max_recharges_per_month}</div>
                                              </div>
                                            </div>
                                            <div style={{ padding: "8px 10px", borderRadius: 6, background: C.blueLight, color: C.blue, fontSize: 10 }}>
                                              Quand votre consommation atteint {rc.threshold_percent}% du plafond, {rc.recharge_amount_chf} CHF de crédits sont ajoutés automatiquement (max {rc.max_recharges_per_month}×/mois).
                                            </div>
                                          </div>
                                        ) : (
                                          <div style={{ fontSize: 11, color: C.textMuted }}>
                                            Activez la recharge automatique pour ne jamais être bloqué quand votre plafond IA est atteint.
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })()}

                                  {/* Acheter des crédits + historique */}
                                  <div style={{ padding: "14px 16px", borderRadius: 10, border: `1px solid ${C.border}`, background: C.white, marginTop: 12 }}>
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                        <Plus size={14} color={C.green} />
                                        <span style={{ fontSize: 12, fontWeight: 600, color: C.text }}>Acheter des crédits IA</span>
                                      </div>
                                    </div>
                                    <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 10 }}>
                                      Achetez des crédits supplémentaires pour augmenter votre quota ce mois-ci. 1 CHF = 2 crédits IA.
                                    </div>
                                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                                      {[10, 20, 50, 100].map(amt => (
                                        <button key={amt} onClick={async () => {
                                          if (!confirm(`Acheter ${amt * 2} crédits pour ${amt} CHF ? Le montant sera débité sur votre carte.`)) return;
                                          try {
                                            const res = await apiFetch('/ai/recharge', { method: 'POST', body: JSON.stringify({ amount_chf: amt }) });
                                            if ((res as any).success) {
                                              addToast_admin(`${(res as any).credits_added} crédits ajoutés pour ${amt} CHF`);
                                              _spendingCapCache = null; _spendingCapLoading = false;
                                              _autoRechargeCache = null; _autoRechargeLoading = false;
                                              setAiUsageData((prev: any) => ({ ...prev, _capTick: Date.now() }));
                                            } else {
                                              addToast_admin((res as any).error || "Erreur de paiement");
                                            }
                                          } catch (e: any) {
                                            addToast_admin(e?.message || "Erreur de paiement");
                                          }
                                        }} style={{
                                          padding: "8px 16px", borderRadius: 8, border: `1px solid ${C.border}`,
                                          background: C.white, cursor: "pointer", fontSize: 11, fontWeight: 600,
                                          color: C.text, transition: "all .2s",
                                        }}>
                                          {amt} CHF <span style={{ color: C.textMuted, fontWeight: 400 }}>({amt * 2} crédits)</span>
                                        </button>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Historique des recharges */}
                                  {(() => {
                                    if (!ctx._rechargeHistoryLoaded) {
                                      ctx._rechargeHistoryLoaded = true;
                                      apiFetch('/ai/recharges').then((d: any) => {
                                        ctx._rechargeHistory = Array.isArray(d) ? d : [];
                                        setAiUsageData((prev: any) => ({ ...prev, _histTick: Date.now() }));
                                      }).catch(() => { ctx._rechargeHistory = []; });
                                    }
                                    const history = ctx._rechargeHistory;
                                    if (!history || history.length === 0) return null;

                                    return (
                                      <div style={{ padding: "14px 16px", borderRadius: 10, border: `1px solid ${C.border}`, background: C.white, marginTop: 12 }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                                          <Clock size={14} color={C.textMuted} />
                                          <span style={{ fontSize: 12, fontWeight: 600, color: C.text }}>Historique des recharges</span>
                                        </div>
                                        <div style={{ maxHeight: 200, overflow: "auto" }}>
                                          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
                                            <thead>
                                              <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                                                <th style={{ textAlign: "left", padding: "4px 8px", color: C.textMuted, fontWeight: 500 }}>Date</th>
                                                <th style={{ textAlign: "left", padding: "4px 8px", color: C.textMuted, fontWeight: 500 }}>Type</th>
                                                <th style={{ textAlign: "right", padding: "4px 8px", color: C.textMuted, fontWeight: 500 }}>Crédits</th>
                                                <th style={{ textAlign: "right", padding: "4px 8px", color: C.textMuted, fontWeight: 500 }}>Montant</th>
                                                <th style={{ textAlign: "center", padding: "4px 8px", color: C.textMuted, fontWeight: 500 }}>Statut</th>
                                              </tr>
                                            </thead>
                                            <tbody>
                                              {history.map((r: any) => (
                                                <tr key={r.id} style={{ borderBottom: `1px solid ${C.bg}` }}>
                                                  <td style={{ padding: "6px 8px" }}>{new Date(r.created_at).toLocaleDateString('fr-CH')}</td>
                                                  <td style={{ padding: "6px 8px" }}>{r.trigger === 'auto' ? 'Auto' : 'Manuel'}</td>
                                                  <td style={{ padding: "6px 8px", textAlign: "right", fontWeight: 600 }}>+{r.credits_added}</td>
                                                  <td style={{ padding: "6px 8px", textAlign: "right" }}>{r.amount_chf} CHF</td>
                                                  <td style={{ padding: "6px 8px", textAlign: "center" }}>
                                                    <span style={{
                                                      fontSize: 9, fontWeight: 600, padding: "2px 6px", borderRadius: 4,
                                                      background: r.status === 'charged' ? C.greenLight : r.status === 'failed' ? C.redLight : C.bg,
                                                      color: r.status === 'charged' ? C.green : r.status === 'failed' ? C.red : C.textMuted,
                                                    }}>{r.status === 'charged' ? 'Payé' : r.status === 'failed' ? 'Échoué' : 'En cours'}</span>
                                                  </td>
                                                </tr>
                                              ))}
                                            </tbody>
                                          </table>
                                        </div>
                                        {history.some((r: any) => r.invoice_number) && (
                                          <div style={{ fontSize: 10, color: C.textMuted, marginTop: 8 }}>
                                            Les recharges apparaissent sur votre prochaine facture mensuelle.
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })()}
                                </div>
                              );
                            })()}
                          </>
                        ) : (
                          <div style={{ textAlign: "center", padding: 40, color: C.textMuted }}>Données non disponibles</div>
                        )}
                      </div>
                    );
                  })()}
                  {subTab === "facturation" && (
                    <div>
                      {/* ── Contact de facturation ── */}
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                        <h3 style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>Contact de facturation</h3>
                        <button onClick={() => setBillingContactEdit(!billingContactEdit)} className="iz-btn-outline" style={{ ...sBtn("outline"), fontSize: 11, padding: "4px 12px" }}>
                          {billingContactEdit ? "Annuler" : t('common.edit')}
                        </button>
                      </div>
                      {billingContactEdit ? (
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
                          <div><label style={{ fontSize: 11, color: C.textMuted, display: "block", marginBottom: 4 }}>Prénom</label><input style={{ ...sInput, width: "100%" }} value={billingInfo.prenom} onChange={e => setBillingInfo({ ...billingInfo, prenom: e.target.value })} /></div>
                          <div><label style={{ fontSize: 11, color: C.textMuted, display: "block", marginBottom: 4 }}>Nom</label><input style={{ ...sInput, width: "100%" }} value={billingInfo.nom} onChange={e => setBillingInfo({ ...billingInfo, nom: e.target.value })} /></div>
                          <div><label style={{ fontSize: 11, color: C.textMuted, display: "block", marginBottom: 4 }}>E-mail</label><input type="email" style={{ ...sInput, width: "100%" }} value={billingInfo.email} onChange={e => setBillingInfo({ ...billingInfo, email: e.target.value })} /></div>
                          <div><label style={{ fontSize: 11, color: C.textMuted, display: "block", marginBottom: 4 }}>Téléphone</label><input style={{ ...sInput, width: "100%" }} value={billingInfo.telephone} onChange={e => setBillingInfo({ ...billingInfo, telephone: e.target.value })} /></div>
                          <div><label style={{ fontSize: 11, color: C.textMuted, display: "block", marginBottom: 4 }}>Pays</label><input style={{ ...sInput, width: "100%" }} value={billingInfo.pays} onChange={e => setBillingInfo({ ...billingInfo, pays: e.target.value })} /></div>
                          <div style={{ gridColumn: "1/-1", display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 4 }}>
                            <button onClick={() => setBillingContactEdit(false)} className="iz-btn-outline" style={{ ...sBtn("outline"), fontSize: 11, padding: "6px 16px" }}>Annuler</button>
                            <button onClick={async () => {
                              try {
                                await saveBillingContact({ prenom: billingInfo.prenom, nom: billingInfo.nom, email: billingInfo.email, telephone: billingInfo.telephone, pays: billingInfo.pays });
                                setBillingContactEdit(false);
                                addToast_admin("Contact de facturation enregistré");
                              } catch { addToast_admin("Erreur lors de la sauvegarde"); }
                            }} className="iz-btn-pink" style={{ ...sBtn("pink"), fontSize: 11, padding: "6px 16px" }}>Enregistrer</button>
                          </div>
                        </div>
                      ) : (
                        <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: "8px 20px", fontSize: 13 }}>
                          <span style={{ color: C.textMuted }}>Prénom</span><span>{billingInfo.prenom || "—"}</span>
                          <span style={{ color: C.textMuted }}>Nom</span><span>{billingInfo.nom || "—"}</span>
                          <span style={{ color: C.textMuted }}>E-mail</span><span>{billingInfo.email || "—"}</span>
                          <span style={{ color: C.textMuted }}>Téléphone</span><span>{billingInfo.telephone || "—"}</span>
                          <span style={{ color: C.textMuted }}>Pays</span><span>{billingInfo.pays}</span>
                        </div>
                      )}
                      {/* ── Informations de facturation ── */}
                      <div style={{ marginTop: 24, display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                        <h3 style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>Informations de facturation</h3>
                        <button onClick={() => setBillingInfoEdit(!billingInfoEdit)} className="iz-btn-outline" style={{ ...sBtn("outline"), fontSize: 11, padding: "4px 12px" }}>
                          {billingInfoEdit ? "Annuler" : t('common.edit')}
                        </button>
                      </div>
                      {billingInfoEdit ? (
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
                          <div style={{ gridColumn: "1/-1" }}><label style={{ fontSize: 11, color: C.textMuted, display: "block", marginBottom: 4 }}>Entreprise</label><input style={{ ...sInput, width: "100%" }} value={billingInfo.company} onChange={e => setBillingInfo({ ...billingInfo, company: e.target.value })} /></div>
                          <div><label style={{ fontSize: 11, color: C.textMuted, display: "block", marginBottom: 4 }}>Numéro de TVA</label><input style={{ ...sInput, width: "100%" }} value={billingInfo.vat} onChange={e => setBillingInfo({ ...billingInfo, vat: e.target.value })} placeholder="CHE-xxx.xxx.xxx" /></div>
                          <div><label style={{ fontSize: 11, color: C.textMuted, display: "block", marginBottom: 4 }}>Rue</label><input style={{ ...sInput, width: "100%" }} value={billingInfo.rue} onChange={e => setBillingInfo({ ...billingInfo, rue: e.target.value })} /></div>
                          <div><label style={{ fontSize: 11, color: C.textMuted, display: "block", marginBottom: 4 }}>Numéro</label><input style={{ ...sInput, width: "100%" }} value={billingInfo.numero} onChange={e => setBillingInfo({ ...billingInfo, numero: e.target.value })} /></div>
                          <div><label style={{ fontSize: 11, color: C.textMuted, display: "block", marginBottom: 4 }}>Complément d'adresse</label><input style={{ ...sInput, width: "100%" }} value={billingInfo.complement} onChange={e => setBillingInfo({ ...billingInfo, complement: e.target.value })} /></div>
                          <div><label style={{ fontSize: 11, color: C.textMuted, display: "block", marginBottom: 4 }}>Case postale</label><input style={{ ...sInput, width: "100%" }} value={billingInfo.case_postale} onChange={e => setBillingInfo({ ...billingInfo, case_postale: e.target.value })} /></div>
                          <div><label style={{ fontSize: 11, color: C.textMuted, display: "block", marginBottom: 4 }}>Localité</label><input style={{ ...sInput, width: "100%" }} value={billingInfo.localite} onChange={e => setBillingInfo({ ...billingInfo, localite: e.target.value })} /></div>
                          <div><label style={{ fontSize: 11, color: C.textMuted, display: "block", marginBottom: 4 }}>Code postal</label><input style={{ ...sInput, width: "100%" }} value={billingInfo.code_postal} onChange={e => setBillingInfo({ ...billingInfo, code_postal: e.target.value })} /></div>
                          <div><label style={{ fontSize: 11, color: C.textMuted, display: "block", marginBottom: 4 }}>Ville</label><input style={{ ...sInput, width: "100%" }} value={billingInfo.ville} onChange={e => setBillingInfo({ ...billingInfo, ville: e.target.value })} /></div>
                          <div><label style={{ fontSize: 11, color: C.textMuted, display: "block", marginBottom: 4 }}>Canton / Région</label><input style={{ ...sInput, width: "100%" }} value={billingInfo.canton} onChange={e => setBillingInfo({ ...billingInfo, canton: e.target.value })} /></div>
                          <div><label style={{ fontSize: 11, color: C.textMuted, display: "block", marginBottom: 4 }}>Pays</label><input style={{ ...sInput, width: "100%" }} value={billingInfo.pays_facturation || billingInfo.pays} onChange={e => setBillingInfo({ ...billingInfo, pays_facturation: e.target.value })} /></div>
                          <div style={{ gridColumn: "1/-1", display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 4 }}>
                            <button onClick={() => setBillingInfoEdit(false)} className="iz-btn-outline" style={{ ...sBtn("outline"), fontSize: 11, padding: "6px 16px" }}>Annuler</button>
                            <button onClick={async () => {
                              try {
                                await apiSaveBillingInfo({ company: billingInfo.company, vat: billingInfo.vat, rue: billingInfo.rue, numero: billingInfo.numero, complement: billingInfo.complement, case_postale: billingInfo.case_postale, localite: billingInfo.localite, code_postal: billingInfo.code_postal, ville: billingInfo.ville, canton: billingInfo.canton, pays_facturation: billingInfo.pays_facturation || billingInfo.pays });
                                setBillingInfoEdit(false);
                                addToast_admin("Informations de facturation enregistrées");
                              } catch { addToast_admin("Erreur lors de la sauvegarde"); }
                            }} className="iz-btn-pink" style={{ ...sBtn("pink"), fontSize: 11, padding: "6px 16px" }}>Enregistrer</button>
                          </div>
                        </div>
                      ) : (
                        <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: "8px 20px", fontSize: 13 }}>
                          <span style={{ color: C.textMuted }}>Entreprise</span><span>{billingInfo.company || "—"}</span>
                          <span style={{ color: C.textMuted }}>Numéro de TVA</span><span>{billingInfo.vat || "—"}</span>
                          <span style={{ color: C.textMuted }}>Rue</span><span>{billingInfo.rue || "—"}</span>
                          <span style={{ color: C.textMuted }}>Numéro</span><span>{billingInfo.numero || "—"}</span>
                          <span style={{ color: C.textMuted }}>Complément d'adresse</span><span>{billingInfo.complement || "—"}</span>
                          <span style={{ color: C.textMuted }}>Case postale</span><span>{billingInfo.case_postale || "—"}</span>
                          <span style={{ color: C.textMuted }}>Localité</span><span>{billingInfo.localite || "—"}</span>
                          <span style={{ color: C.textMuted }}>Code postal</span><span>{billingInfo.code_postal || "—"}</span>
                          <span style={{ color: C.textMuted }}>Ville</span><span>{billingInfo.ville || "—"}</span>
                          <span style={{ color: C.textMuted }}>Canton / Région</span><span>{billingInfo.canton || "—"}</span>
                          <span style={{ color: C.textMuted }}>Pays</span><span>{billingInfo.pays_facturation || billingInfo.pays || "—"}</span>
                        </div>
                      )}
                    </div>
                  )}
                  {subTab === "factures" && (() => {
                    const STATUS_LABELS: Record<string, { label: string; bg: string; color: string }> = {
                      draft: { label: "Brouillon", bg: C.bg, color: C.textMuted },
                      sent: { label: "Envoyée", bg: C.blueLight, color: C.blue },
                      paid: { label: "Payée", bg: C.greenLight, color: C.green },
                      processing: { label: "En cours", bg: C.amberLight, color: C.amber },
                      failed: { label: "Échouée", bg: C.redLight, color: C.red },
                      canceled: { label: "Annulée", bg: C.bg, color: C.textMuted },
                      refunded: { label: "Remboursée", bg: C.amberLight, color: C.amber },
                      disputed: { label: "Contestée", bg: C.redLight, color: C.red },
                    };
                    // Load invoices on first display
                    if (!(_invoicesLoaded)) {
                      _invoicesLoaded = true;
                      getInvoices().then(setInvoicesList).catch(() => {});
                    }
                    return (
                    <div>
                      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", gap: 0, padding: "8px 0", borderBottom: `1px solid ${C.border}`, fontSize: 11, fontWeight: 600, color: C.textLight }}>
                        <span>Facture</span><span>Plan</span><span>Statut</span><span>Date</span><span>Montant TTC</span>
                      </div>
                      {invoicesList.length === 0 && <div style={{ padding: "30px 0", textAlign: "center", color: C.textMuted, fontSize: 13 }}>Aucune facture</div>}
                      {invoicesList.map((inv: any) => {
                        const st = STATUS_LABELS[inv.status] || STATUS_LABELS.draft;
                        return (
                        <div key={inv.id} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", gap: 0, padding: "12px 0", borderBottom: `1px solid ${C.border}`, alignItems: "center", fontSize: 13 }}>
                          <span style={{ color: C.blue, fontWeight: 500 }}>{inv.invoice_number}</span>
                          <span style={{ fontSize: 12, color: C.textMuted }}>{inv.plan?.nom || "—"}</span>
                          <span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 600, background: st.bg, color: st.color, justifySelf: "start" }}>{st.label}</span>
                          <span style={{ color: C.textMuted }}>{fmtDate(inv.date_emission)}</span>
                          <span style={{ fontWeight: 600 }}>{inv.montant_ttc} {inv.currency?.toUpperCase()}</span>
                        </div>
                        );
                      })}
                    </div>
                    );
                  })()}
                  {subTab === "paiement" && (() => {
                    const stripeConfigured = stripeMethods.length > 0;
                    const defaultCard = stripeMethods.find(m => m.is_default) || stripeMethods[0];
                    const activeMethod = paymentMethod || (stripeConfigured ? "stripe" : "invoice");
                    const BRAND_ICONS: Record<string, string> = { visa: "💳 Visa", mastercard: "💳 Mastercard", amex: "💳 Amex", discover: "💳 Discover" };
                    const loadMethods = () => { getStripePaymentMethods().then(r => setStripeMethods(r.methods || [])).catch(() => {}); };

                    return (
                    <div>
                      <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Méthode de paiement active</h3>
                      <p style={{ fontSize: 12, color: C.textMuted, marginBottom: 16 }}>Sélectionnez votre méthode de paiement préférée. Au moins une méthode doit être active.</p>
                      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        {/* ── Stripe Card ── */}
                        <div style={{ border: activeMethod === "stripe" ? `2px solid #635BFF` : `1px solid ${C.border}`, borderRadius: 10, padding: "16px 20px", cursor: "pointer", transition: "all .2s", background: activeMethod === "stripe" ? "#635BFF08" : C.white }}
                          onClick={async () => { if (stripeConfigured) { setPaymentMethod("stripe"); try { await updateCompanySettings({ payment_method: "stripe" }); addToast_admin("Mode de paiement mis à jour : Carte bancaire"); } catch {} } else { if (!stripePromise) createStripeSetupIntent().then(r => { if (r.publishable_key) setStripePromise(lazyLoadStripe(r.publishable_key)); }).catch(() => addToast_admin("Impossible de charger Stripe")); setStripeModalOpen(true); } }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              <div style={{ width: 40, height: 40, borderRadius: 8, background: "#635BFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <span style={{ color: "#fff", fontSize: 14, fontWeight: 700 }}>S</span>
                              </div>
                              <div>
                                <div style={{ fontSize: 14, fontWeight: 600, color: C.text, display: "flex", alignItems: "center", gap: 8 }}>
                                  Paiement par carte (Stripe)
                                  {activeMethod === "stripe" && <span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 9, fontWeight: 700, background: "#635BFF", color: "#fff" }}>ACTIF</span>}
                                </div>
                                <div style={{ fontSize: 12, color: C.textMuted }}>Visa, Mastercard, SEPA — Paiement automatique mensuel</div>
                              </div>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              {!stripeConfigured && <span style={{ fontSize: 10, color: "#FF9800", fontWeight: 600 }}>Non configuré</span>}
                              <div style={{ width: 22, height: 22, borderRadius: "50%", border: activeMethod === "stripe" ? "none" : `2px solid ${C.border}`, background: activeMethod === "stripe" ? "#635BFF" : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                {activeMethod === "stripe" && <Check size={13} color="#fff" />}
                              </div>
                            </div>
                          </div>
                          <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: "6px 16px", fontSize: 12, padding: "10px 14px", background: C.bg, borderRadius: 8 }}>
                            <span style={{ color: C.textMuted }}>Statut</span>
                            <span style={{ display: "flex", alignItems: "center", gap: 6 }}><div style={{ width: 8, height: 8, borderRadius: "50%", background: stripeConfigured ? C.green : C.textMuted }} /> {stripeConfigured ? "Configuré" : "Non configuré"}</span>
                            <span style={{ color: C.textMuted }}>Carte enregistrée</span>
                            <span>{defaultCard ? `${BRAND_ICONS[defaultCard.brand] || defaultCard.brand} •••• ${defaultCard.last4} — exp. ${String(defaultCard.exp_month).padStart(2, "0")}/${defaultCard.exp_year}` : "—"}</span>
                            <span style={{ color: C.textMuted }}>Prochaine facturation</span><span>{currentOnboardingSub?.current_period_end ? fmtDate(currentOnboardingSub.current_period_end) : "—"}</span>
                          </div>
                          <div style={{ display: "flex", gap: 8, marginTop: 12 }} onClick={e => e.stopPropagation()}>
                            <button onClick={() => { if (!stripePromise) createStripeSetupIntent().then(r => { if (r.publishable_key) setStripePromise(lazyLoadStripe(r.publishable_key)); }).catch(() => addToast_admin("Impossible de charger Stripe")); loadMethods(); setStripeModalOpen(true); }} className="iz-btn-outline" style={{ ...sBtn("outline"), fontSize: 11, padding: "5px 14px", borderColor: "#635BFF", color: "#635BFF" }}>
                              {stripeConfigured ? "Gérer les cartes" : "Configurer"}
                            </button>
                            {stripeMethods.length > 1 && stripeMethods.filter(m => !m.is_default).map(m => (
                              <button key={m.id} onClick={async () => {
                                try { await deleteStripePaymentMethod(m.id); loadMethods(); addToast_admin("Carte supprimée"); } catch { addToast_admin("Erreur"); }
                              }} style={{ background: "none", border: "none", fontSize: 11, color: C.red, cursor: "pointer" }}>
                                Supprimer •••• {m.last4}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* ── SEPA Direct Debit ── */}
                        <div style={{ border: activeMethod === "sepa" ? `2px solid #00897B` : `1px solid ${C.border}`, borderRadius: 10, padding: "16px 20px", cursor: "pointer", transition: "all .2s", background: activeMethod === "sepa" ? "#E0F2F108" : C.white }}
                          onClick={async () => {
                            const sepaMethod = stripeMethods.find((m: any) => m.type === "sepa_debit");
                            if (sepaMethod) { setPaymentMethod("sepa"); try { await updateCompanySettings({ payment_method: "sepa" }); addToast_admin("Mode de paiement mis à jour : Prélèvement SEPA"); } catch {} }
                            else { if (!stripePromise) createStripeSetupIntent().then(r => { if (r.publishable_key) setStripePromise(lazyLoadStripe(r.publishable_key)); }).catch(() => addToast_admin("Impossible de charger Stripe")); setPaymentMethod("sepa"); setStripeModalOpen(true); }
                          }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              <div style={{ width: 40, height: 40, borderRadius: 8, background: "#00897B", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <Landmark size={18} color="#fff" />
                              </div>
                              <div>
                                <div style={{ fontSize: 14, fontWeight: 600, color: C.text, display: "flex", alignItems: "center", gap: 8 }}>
                                  Prélèvement SEPA
                                  {activeMethod === "sepa" && <span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 9, fontWeight: 700, background: "#00897B", color: "#fff" }}>ACTIF</span>}
                                </div>
                                <div style={{ fontSize: 12, color: C.textMuted }}>Débit direct sur votre compte bancaire via IBAN</div>
                              </div>
                            </div>
                            <div style={{ width: 22, height: 22, borderRadius: "50%", border: activeMethod === "sepa" ? "none" : `2px solid ${C.border}`, background: activeMethod === "sepa" ? "#00897B" : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              {activeMethod === "sepa" && <Check size={13} color="#fff" />}
                            </div>
                          </div>
                          <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: "6px 16px", fontSize: 12, padding: "10px 14px", background: C.bg, borderRadius: 8 }}>
                            <span style={{ color: C.textMuted }}>Statut</span>
                            {(() => { const sepaMethod = stripeMethods.find((m: any) => m.type === "sepa_debit"); return (
                              <span style={{ display: "flex", alignItems: "center", gap: 6 }}><div style={{ width: 8, height: 8, borderRadius: "50%", background: sepaMethod ? C.green : C.textMuted }} /> {sepaMethod ? "Configuré" : "Non configuré"}</span>
                            ); })()}
                            <span style={{ color: C.textMuted }}>IBAN enregistré</span>
                            {(() => { const sepaMethod = stripeMethods.find((m: any) => m.type === "sepa_debit"); return (
                              <span>{sepaMethod ? `•••• ${sepaMethod.last4} ${sepaMethod.country || ""}` : "—"}</span>
                            ); })()}
                            <span style={{ color: C.textMuted }}>Délai de prélèvement</span><span>5-7 jours ouvrés</span>
                          </div>
                        </div>

                        {/* ── Invoice ── */}
                        <div style={{ border: activeMethod === "invoice" ? `2px solid ${C.blue}` : `1px solid ${C.border}`, borderRadius: 10, padding: "16px 20px", cursor: "pointer", transition: "all .2s", background: activeMethod === "invoice" ? C.blueLight + "30" : C.white }}
                          onClick={async () => { setPaymentMethod("invoice"); try { await updateCompanySettings({ payment_method: "invoice" }); addToast_admin("Mode de paiement mis à jour : Facture"); } catch {} }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              <div style={{ width: 40, height: 40, borderRadius: 8, background: C.blue, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <FileText size={18} color="#fff" />
                              </div>
                              <div>
                                <div style={{ fontSize: 14, fontWeight: 600, color: C.text, display: "flex", alignItems: "center", gap: 8 }}>
                                  Paiement par facture
                                  {activeMethod === "invoice" && <span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 9, fontWeight: 700, background: C.blue, color: "#fff" }}>ACTIF</span>}
                                </div>
                                <div style={{ fontSize: 12, color: C.textMuted }}>Facture 30 jours, virement bancaire (IBAN)</div>
                              </div>
                            </div>
                            <div style={{ width: 22, height: 22, borderRadius: "50%", border: activeMethod === "invoice" ? "none" : `2px solid ${C.border}`, background: activeMethod === "invoice" ? C.blue : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              {activeMethod === "invoice" && <Check size={13} color="#fff" />}
                            </div>
                          </div>
                          <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: "6px 16px", fontSize: 12, padding: "10px 14px", background: C.bg, borderRadius: 8 }}>
                            <span style={{ color: C.textMuted }}>Coordonnées bancaires</span>
                            <div>
                              <div style={{ fontWeight: 600 }}>Illizeo Sàrl</div>
                              <div style={{ color: C.textMuted }}>Chemin des Saules 12a, 1260 Nyon</div>
                              <div style={{ marginTop: 6 }}>IBAN: <span style={{ fontWeight: 600, letterSpacing: 0.5 }}>CH59 0022 8228 1610 9501 U</span></div>
                              <div>BIC: <span style={{ fontWeight: 600 }}>UBSWCHZH80A</span></div>
                              <div style={{ color: C.textMuted, marginTop: 6, fontSize: 11 }}>UBS Switzerland AG, Bahnhofstrasse 45, 8048 Zürich</div>
                            </div>
                            <span style={{ color: C.textMuted }}>Email de réception</span><span>{invoiceConfig.invoice_email || billingInfo.email || auth.user?.email || "—"}</span>
                            <span style={{ color: C.textMuted }}>Numéro PO</span><span>{invoiceConfig.po_number || "—"}</span>
                            <span style={{ color: C.textMuted }}>Délai de paiement</span><span>30 jours net</span>
                          </div>
                          <div style={{ display: "flex", gap: 8, marginTop: 12 }} onClick={e => e.stopPropagation()}>
                            <button onClick={() => setInvoiceConfigOpen(true)} className="iz-btn-outline" style={{ ...sBtn("outline"), fontSize: 11, padding: "5px 14px" }}>
                              Configurer facture
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* ── Stripe Card Modal ── */}
                      {stripeModalOpen && (() => {
                        const isSepaMode = paymentMethod === "sepa";
                        const modalColor = isSepaMode ? "#00897B" : "#635BFF";
                        return (
                        <div style={{ position: "fixed", inset: 0, zIndex: 10000, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,.45)" }} onClick={() => setStripeModalOpen(false)}>
                          <div style={{ background: C.white, borderRadius: 16, width: 520, maxWidth: "95vw", padding: 28, boxShadow: "0 20px 60px rgba(0,0,0,.2)" }} onClick={e => e.stopPropagation()}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <div style={{ width: 36, height: 36, borderRadius: 8, background: modalColor, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                  {isSepaMode ? <Landmark size={18} color="#fff" /> : <span style={{ color: "#fff", fontWeight: 700, fontSize: 13 }}>S</span>}
                                </div>
                                <div>
                                  <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>{isSepaMode ? "Configurer prélèvement SEPA" : "Configurer carte bancaire"}</h3>
                                  <p style={{ fontSize: 12, color: C.textMuted, margin: 0 }}>{isSepaMode ? "Débit direct sur votre compte bancaire" : "Paiement sécurisé via Stripe"}</p>
                                </div>
                              </div>
                              <button onClick={() => setStripeModalOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}><X size={18} color={C.textMuted} /></button>
                            </div>
                            {stripePromise ? (
                              <Elements stripe={stripePromise}>
                                <StripeCardFormInner billingInfo={billingInfo} auth={auth} stripeMethods={stripeMethods} setStripeMethods={setStripeMethods} setPaymentMethod={setPaymentMethod} setStripeModalOpen={setStripeModalOpen} addToast_admin={addToast_admin} loadMethods={loadMethods} isSepa={isSepaMode} />
                              </Elements>
                            ) : (
                              <div style={{ textAlign: "center", padding: "30px 0", color: C.textMuted, fontSize: 13 }}>Chargement de Stripe...</div>
                            )}
                          </div>
                        </div>
                        );
                      })()}

                      {/* ── Invoice Config Modal ── */}
                      {invoiceConfigOpen && (
                        <div style={{ position: "fixed", inset: 0, zIndex: 10000, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,.45)" }} onClick={() => setInvoiceConfigOpen(false)}>
                          <div style={{ background: C.white, borderRadius: 16, width: 460, maxWidth: "95vw", padding: 28, boxShadow: "0 20px 60px rgba(0,0,0,.2)" }} onClick={e => e.stopPropagation()}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <div style={{ width: 36, height: 36, borderRadius: 8, background: C.blue, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                  <FileText size={18} color="#fff" />
                                </div>
                                <div>
                                  <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Configuration facture</h3>
                                  <p style={{ fontSize: 12, color: C.textMuted, margin: 0 }}>Paramètres de réception des factures</p>
                                </div>
                              </div>
                              <button onClick={() => setInvoiceConfigOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}><X size={18} color={C.textMuted} /></button>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                              <div>
                                <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Email de réception des factures</label>
                                <input type="email" style={{ ...sInput, width: "100%" }} value={invoiceConfig.invoice_email} onChange={e => setInvoiceConfig({ ...invoiceConfig, invoice_email: e.target.value })} placeholder={billingInfo.email || auth.user?.email || "comptabilite@entreprise.ch"} />
                                <p style={{ fontSize: 11, color: C.textMuted, marginTop: 4 }}>Adresse email où les factures seront envoyées</p>
                              </div>
                              <div>
                                <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Numéro de bon de commande (PO)</label>
                                <input style={{ ...sInput, width: "100%" }} value={invoiceConfig.po_number} onChange={e => setInvoiceConfig({ ...invoiceConfig, po_number: e.target.value })} placeholder="PO-2024-001 (optionnel)" />
                                <p style={{ fontSize: 11, color: C.textMuted, marginTop: 4 }}>Référence interne à inclure sur les factures</p>
                              </div>
                            </div>
                            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 20 }}>
                              <button onClick={() => setInvoiceConfigOpen(false)} className="iz-btn-outline" style={{ ...sBtn("outline"), fontSize: 12, padding: "8px 20px" }}>Annuler</button>
                              <button onClick={async () => {
                                try {
                                  await apiSaveInvoiceConfig({ invoice_email: invoiceConfig.invoice_email, po_number: invoiceConfig.po_number });
                                  setInvoiceConfigOpen(false);
                                  addToast_admin("Configuration facture enregistrée");
                                } catch { addToast_admin("Erreur lors de la sauvegarde"); }
                              }} className="iz-btn-pink" style={{ ...sBtn("pink"), fontSize: 12, padding: "8px 20px" }}>Enregistrer</button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    );
                  })()}
                  {subTab === "protection" && (() => {
                    const [openSection, setOpenSection] = [ctx.protectionOpenSection ?? null, ctx.setProtectionOpenSection ?? (() => {})];
                    const sections = [
                      { id: "annexe", title: "Annexe relative au traitement des données personnelles", content: `Illizeo SA, dont le siège est à Genève (Suisse), agit en qualité de sous-traitant (au sens du RGPD et de la nLPD) pour le compte du Client, responsable de traitement.

**Finalités du traitement :** Gestion de l'onboarding, de l'offboarding, du crossboarding et du reboarding des collaborateurs du Client. Cela inclut la collecte et le stockage des données personnelles des collaborateurs (identité, coordonnées, informations contractuelles, documents administratifs).

**Catégories de données traitées :**
- Données d'identification : nom, prénom, date de naissance, nationalité, photo, numéro AVS
- Données de contact : adresse, email, téléphone
- Données contractuelles : type de contrat, poste, département, site, date de début/fin, salaire
- Documents administratifs : pièces d'identité, permis de travail, IBAN, certificats
- Données d'utilisation : logs de connexion, actions effectuées, progression dans les parcours

**Durée de conservation :** Les données sont conservées pendant la durée de la relation contractuelle entre Illizeo et le Client, puis supprimées dans un délai de 90 jours après la résiliation, sauf obligation légale de conservation plus longue.

**Droits des personnes concernées :** Les collaborateurs peuvent exercer leurs droits (accès, rectification, suppression, portabilité) en contactant leur employeur (le Client). Illizeo assiste le Client dans la réponse à ces demandes.

**Transferts internationaux :** Les données sont hébergées en Suisse (Infomaniak, datacenter de Genève). Aucun transfert hors Suisse/EEE n'est effectué, sauf usage explicite d'intégrations tierces configurées par le Client (ex: DocuSign, Microsoft, Slack).` },
                      { id: "mto", title: "Mesures de sécurité techniques et organisationnelles (MTO)", content: `**Mesures techniques :**
- Chiffrement TLS 1.3 pour toutes les communications (HTTPS)
- Chiffrement des mots de passe (bcrypt, 12 rounds)
- Authentification par tokens Sanctum (Bearer tokens, expiration configurable)
- Authentification à deux facteurs (2FA) disponible pour tous les comptes admin
- Isolation des données par tenant (base de données séparée par client)
- Sauvegardes quotidiennes automatiques
- Hébergement sur infrastructure Infomaniak (certifiée ISO 27001, datacenter en Suisse)

**Mesures organisationnelles :**
- Accès aux données de production limité aux administrateurs systèmes autorisés
- Politique de mots de passe configurable par le Client (longueur, complexité, expiration)
- Journal d'audit complet de toutes les actions sensibles (connexions, modifications, suppressions)
- Processus de suppression des données en cas de résiliation (RGPD/nLPD)
- Gestion des rôles et permissions granulaire (admin, HRBP, manager, collaborateur)
- Revue régulière des accès et des permissions

**Gestion des incidents :**
- Notification au Client dans un délai de 72 heures en cas de violation de données
- Procédure documentée de réponse aux incidents
- Contact DPO : privacy@illizeo.com` },
                      { id: "instructions", title: "Qui peut donner des instructions à Illizeo ?", content: `Seules les personnes suivantes sont autorisées à donner des instructions à Illizeo concernant le traitement des données personnelles :

**Côté Client :**
- Le représentant légal du Client (signataire du contrat)
- L'administrateur principal désigné lors de la création du compte
- Les utilisateurs disposant du rôle « Admin RH » ou « Super Admin » dans la plateforme

**Côté Illizeo :**
- Le Directeur Général
- Le Responsable Technique (CTO)
- Le Délégué à la Protection des Données (DPO)

Les instructions doivent être transmises par écrit (email ou via la plateforme). Illizeo n'exécute aucune instruction verbale concernant le traitement de données personnelles.

Tout changement dans la liste des personnes autorisées doit être notifié à Illizeo par le représentant légal du Client.` },
                      { id: "soustraitants", title: "Sous-traitants", html: true, content: `<p>Illizeo fait appel aux sous-traitants suivants pour le traitement des données :</p>
<table style="width:100%;border-collapse:collapse;margin:12px 0;font-size:13px">
<thead><tr style="background:#f8f9fa;text-align:left"><th style="padding:8px 12px;border:1px solid #e0e0e0;font-weight:600">Sous-traitant</th><th style="padding:8px 12px;border:1px solid #e0e0e0;font-weight:600">Fonction</th><th style="padding:8px 12px;border:1px solid #e0e0e0;font-weight:600">Localisation</th></tr></thead>
<tbody>
<tr><td style="padding:8px 12px;border:1px solid #e0e0e0"><strong>Infomaniak</strong></td><td style="padding:8px 12px;border:1px solid #e0e0e0">Hébergement serveurs et bases de données</td><td style="padding:8px 12px;border:1px solid #e0e0e0">Suisse (Genève)</td></tr>
<tr><td style="padding:8px 12px;border:1px solid #e0e0e0"><strong>Anthropic (Claude)</strong></td><td style="padding:8px 12px;border:1px solid #e0e0e0">Intelligence artificielle — OCR pièces d'identité, analyse de documents (si add-on IA souscrit)</td><td style="padding:8px 12px;border:1px solid #e0e0e0">États-Unis*</td></tr>
<tr><td style="padding:8px 12px;border:1px solid #e0e0e0"><strong>Mailtrap</strong></td><td style="padding:8px 12px;border:1px solid #e0e0e0">Envoi d'emails transactionnels</td><td style="padding:8px 12px;border:1px solid #e0e0e0">UE (Pologne)</td></tr>
</tbody></table>
<p style="font-size:11px;color:#888;margin-top:8px">*Anthropic : les données envoyées à l'API Claude (images de documents) ne sont pas stockées par Anthropic et ne sont pas utilisées pour l'entraînement des modèles (politique zero-retention de l'API). Le traitement est ponctuel et les données ne transitent que le temps de l'analyse.</p>
<p style="font-weight:600;margin-top:16px">Intégrations optionnelles configurées par le Client :</p>
<p>Ces services ne sont activés que si le Client les configure explicitement dans les paramètres d'intégration :</p>
<ul style="margin:8px 0;padding-left:20px">
<li>DocuSign / UgoSign — Signature électronique (localisation selon le fournisseur)</li>
<li>Microsoft Entra ID — SSO et provisionnement (Microsoft, UE/US)</li>
<li>Slack / Microsoft Teams — Notifications (localisation selon le fournisseur)</li>
<li>SIRH tiers (Personio, BambooHR, Workday, Lucca, etc.) — Synchronisation des données RH</li>
</ul>
<p>Le Client est informé préalablement de tout changement de sous-traitant et dispose d'un droit d'opposition.</p>` },
                    ];
                    return (
                    <div>
                      <p style={{ fontSize: 13, color: C.textLight, marginBottom: 16 }}>Comment Illizeo traite vos données et encadre ses engagements contractuels</p>
                      {sections.map(section => (
                        <div key={section.id} style={{ border: `1px solid ${openSection === section.id ? C.pink : C.border}`, borderRadius: 10, marginBottom: 8, overflow: "hidden", transition: "all .2s" }}>
                          <div onClick={() => setOpenSection(openSection === section.id ? null : section.id)} style={{ padding: "16px 20px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", background: openSection === section.id ? C.pinkBg + "40" : "transparent" }}>
                            <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{section.title}</div>
                            <div style={{ width: 32, height: 32, borderRadius: "50%", background: openSection === section.id ? C.pink : C.bg, display: "flex", alignItems: "center", justifyContent: "center", transition: "all .2s" }}>
                              {openSection === section.id ? <ChevronLeft size={16} color={C.white} style={{ transform: "rotate(-90deg)" }} /> : <ChevronRight size={16} color={C.textMuted} />}
                            </div>
                          </div>
                          {openSection === section.id && (
                            <div style={{ padding: "0 20px 20px", fontSize: 13, color: C.text, lineHeight: 1.7 }}>
                              {(section as any).html ? <div dangerouslySetInnerHTML={{ __html: section.content }} /> : section.content.split("\n").map((line: string, li: number) => {
                                // Parse bold **text**
                                const parts = line.split(/\*\*(.*?)\*\*/g);
                                const rendered = parts.map((part: string, pi: number) => pi % 2 === 1 ? <b key={pi}>{part}</b> : part);
                                // Detect list items
                                const trimmed = line.trim();
                                if (trimmed.startsWith("- ") || trimmed.startsWith("| ")) {
                                  return <div key={li} style={{ paddingLeft: trimmed.startsWith("| ") ? 0 : 12, marginBottom: 2 }}>{rendered}</div>;
                                }
                                if (trimmed === "") return <div key={li} style={{ height: 8 }} />;
                                return <div key={li} style={{ marginBottom: 4 }}>{rendered}</div>;
                              })}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    );
                  })()}
                </div>
              </div>

              {/* ═══ Support Access — visible in protection tab ═══ */}
              {subTab === "protection" && (() => {
                if (!_supportAccessLoaded) { _supportAccessLoaded = true; getSupportAccesses().then(setSupportAccesses).catch(() => {}); }
                const MODULE_OPTIONS = ["onboarding","offboarding","crossboarding","cooptation","nps","signature","api"];
                return (
                <div style={{ marginTop: 24, border: `1px solid ${C.border}`, borderRadius: 12, padding: "20px 24px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                    <div>
                      <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Accès support Illizeo</h3>
                      <p style={{ fontSize: 12, color: C.textMuted, margin: "4px 0 0" }}>Accordez un accès temporaire à un employé Illizeo pour le diagnostic de bugs. Toutes les actions sont tracées.</p>
                    </div>
                    <button onClick={() => setSupportAccessForm({ open: true, email: "support@illizeo.com", modules: null, reason: "", hours: 24 })} className="iz-btn-pink" style={{ ...sBtn("pink"), fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}><Plus size={14} /> Accorder un accès</button>
                  </div>

                  {/* Grant form */}
                  {supportAccessForm?.open && (
                    <div style={{ border: `1px solid ${C.blue}`, borderRadius: 10, padding: "16px 20px", marginBottom: 16, background: C.blueLight + "20" }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                        <div><label style={{ fontSize: 11, color: C.textMuted, display: "block", marginBottom: 4 }}>Email du support *</label><input style={{ ...sInput, width: "100%" }} value={supportAccessForm.email} onChange={e => setSupportAccessForm({ ...supportAccessForm, email: e.target.value })} /></div>
                        <div><label style={{ fontSize: 11, color: C.textMuted, display: "block", marginBottom: 4 }}>Durée (heures)</label>
                          <select style={{ ...sInput, width: "100%" }} value={supportAccessForm.hours} onChange={e => setSupportAccessForm({ ...supportAccessForm, hours: Number(e.target.value) })}>
                            <option value={1}>1 heure</option><option value={4}>4 heures</option><option value={8}>8 heures</option>
                            <option value={24}>24 heures</option><option value={72}>3 jours</option><option value={168}>7 jours</option>
                          </select>
                        </div>
                        <div style={{ gridColumn: "1/-1" }}><label style={{ fontSize: 11, color: C.textMuted, display: "block", marginBottom: 4 }}>Raison</label><input style={{ ...sInput, width: "100%" }} value={supportAccessForm.reason} onChange={e => setSupportAccessForm({ ...supportAccessForm, reason: e.target.value })} placeholder="Ex: Bug sur la page parcours" /></div>
                        <div style={{ gridColumn: "1/-1" }}>
                          <label style={{ fontSize: 11, color: C.textMuted, display: "block", marginBottom: 6 }}>Modules autorisés</label>
                          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                            <button onClick={() => setSupportAccessForm({ ...supportAccessForm, modules: null })} style={{ fontSize: 11, padding: "4px 10px", borderRadius: 6, border: `1px solid ${supportAccessForm.modules === null ? C.pink : C.border}`, background: supportAccessForm.modules === null ? C.pinkBg : C.white, color: supportAccessForm.modules === null ? C.pink : C.text, cursor: "pointer", fontFamily: font }}>Tous</button>
                            {MODULE_OPTIONS.map(m => {
                              const sel = supportAccessForm.modules?.includes(m);
                              return <button key={m} onClick={() => {
                                const curr = supportAccessForm.modules || [];
                                setSupportAccessForm({ ...supportAccessForm, modules: sel ? curr.filter((x: string) => x !== m) : [...curr, m] });
                              }} style={{ fontSize: 11, padding: "4px 10px", borderRadius: 6, border: `1px solid ${sel ? C.blue : C.border}`, background: sel ? C.blueLight : C.white, color: sel ? C.blue : C.text, cursor: "pointer", fontFamily: font }}>{m}</button>;
                            })}
                          </div>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                        <button onClick={() => setSupportAccessForm(null)} style={{ ...sBtn("outline"), fontSize: 11, padding: "6px 16px" }}>Annuler</button>
                        <button onClick={async () => {
                          try {
                            const res = await grantSupportAccess({ email: supportAccessForm.email, allowed_modules: supportAccessForm.modules, reason: supportAccessForm.reason, duration_hours: supportAccessForm.hours });
                            addToast_admin(res.message || "Accès accordé");
                            setSupportAccessForm(null);
                            _supportAccessLoaded = false;
                            getSupportAccesses().then(setSupportAccesses).catch(() => {});
                          } catch { addToast_admin("Erreur lors de l'octroi de l'accès"); }
                        }} className="iz-btn-pink" style={{ ...sBtn("pink"), fontSize: 11, padding: "6px 16px" }}>Accorder l'accès</button>
                      </div>
                    </div>
                  )}

                  {/* Active accesses list */}
                  {(supportAccesses || []).length === 0 && <div style={{ padding: "20px 0", textAlign: "center", color: C.textMuted, fontSize: 13 }}>Aucun accès support en cours</div>}
                  {(supportAccesses || []).map((a: any) => (
                    <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 16px", border: `1px solid ${a.is_active ? C.green : C.border}`, borderRadius: 8, marginBottom: 6, background: a.is_active ? C.greenLight + "20" : C.bg }}>
                      <div style={{ width: 36, height: 36, borderRadius: 8, background: a.is_active ? C.greenLight : C.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {a.is_active ? <CheckCircle size={18} color={C.green} /> : <Clock size={18} color={C.textMuted} />}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{a.email} {a.is_active && <span style={{ fontSize: 10, color: C.green, fontWeight: 600 }}>Actif</span>}{!a.is_active && <span style={{ fontSize: 10, color: C.textMuted }}>Expiré</span>}</div>
                        <div style={{ fontSize: 11, color: C.textMuted }}>{a.reason || "—"} · Modules : {a.allowed_modules ? a.allowed_modules.join(", ") : "Tous"} · Par {a.granted_by}</div>
                        <div style={{ fontSize: 10, color: C.textMuted }}>Expire : {fmtDateTime(a.expires_at)}{a.last_used_at ? ` · Dernière utilisation : ${fmtDateTime(a.last_used_at)}` : ""}</div>
                      </div>
                      {a.is_active && (
                        <button onClick={async () => {
                          try { await revokeSupportAccess(a.id); addToast_admin("Accès révoqué"); _supportAccessLoaded = false; getSupportAccesses().then(setSupportAccesses).catch(() => {}); } catch { addToast_admin("Erreur"); }
                        }} style={{ ...sBtn("outline"), fontSize: 11, padding: "5px 12px", color: C.red, borderColor: C.red }}>Révoquer</button>
                      )}
                    </div>
                  ))}
                </div>
                );
              })()}

              {/* Gérer les apps — visible uniquement dans l'onglet Facturation si un plan est souscrit */}
              {hasActiveSub && subTab === "factures" && <div style={{ marginTop: 24 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Gérer les apps</h2>
                  <button onClick={() => { setSubStep("apps"); setSubView("change"); }} className="iz-btn-pink" style={{ ...sBtn("pink"), fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}><Plus size={14} /> Ajouter app</button>
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
              </div>}
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
    { key: "personal", label: t('fields.personal'), icon: Users, color: "#E41076" },
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
            { name: "Illizeo Pink", color: "#E41076" },
            { name: "Ocean Blue", color: "#1A73E8" },
            { name: "Forest Green", color: "#2E7D32" },
            { name: "Royal Purple", color: "#7B5EA7" },
            { name: "Sunset Orange", color: "#E65100" },
            { name: "Slate Dark", color: "#37474F" },
            { name: "Crimson Red", color: "#C62828" },
            { name: "Teal", color: "#00897B" },
          ];
          const REGIONS = [
            { code: "AF", label: "Afghanistan", flag: "🇦🇫", currency: "AFN" },
            { code: "AL", label: "Albanie", flag: "🇦🇱", currency: "ALL" },
            { code: "DZ", label: "Algérie", flag: "🇩🇿", currency: "DZD" },
            { code: "AD", label: "Andorre", flag: "🇦🇩", currency: "EUR" },
            { code: "AO", label: "Angola", flag: "🇦🇴", currency: "AOA" },
            { code: "AR", label: "Argentine", flag: "🇦🇷", currency: "ARS" },
            { code: "AM", label: "Arménie", flag: "🇦🇲", currency: "AMD" },
            { code: "AU", label: "Australie", flag: "🇦🇺", currency: "AUD" },
            { code: "AT", label: "Autriche", flag: "🇦🇹", currency: "EUR" },
            { code: "AZ", label: "Azerbaïdjan", flag: "🇦🇿", currency: "AZN" },
            { code: "BH", label: "Bahreïn", flag: "🇧🇭", currency: "BHD" },
            { code: "BD", label: "Bangladesh", flag: "🇧🇩", currency: "BDT" },
            { code: "BE", label: "Belgique", flag: "🇧🇪", currency: "EUR" },
            { code: "BJ", label: "Bénin", flag: "🇧🇯", currency: "XOF" },
            { code: "BO", label: "Bolivie", flag: "🇧🇴", currency: "BOB" },
            { code: "BA", label: "Bosnie-Herzégovine", flag: "🇧🇦", currency: "BAM" },
            { code: "BW", label: "Botswana", flag: "🇧🇼", currency: "BWP" },
            { code: "BR", label: "Brésil", flag: "🇧🇷", currency: "BRL" },
            { code: "BN", label: "Brunei", flag: "🇧🇳", currency: "BND" },
            { code: "BG", label: "Bulgarie", flag: "🇧🇬", currency: "BGN" },
            { code: "BF", label: "Burkina Faso", flag: "🇧🇫", currency: "XOF" },
            { code: "KH", label: "Cambodge", flag: "🇰🇭", currency: "KHR" },
            { code: "CM", label: "Cameroun", flag: "🇨🇲", currency: "XAF" },
            { code: "CA", label: "Canada", flag: "🇨🇦", currency: "CAD" },
            { code: "CL", label: "Chili", flag: "🇨🇱", currency: "CLP" },
            { code: "CN", label: "Chine", flag: "🇨🇳", currency: "CNY" },
            { code: "CO", label: "Colombie", flag: "🇨🇴", currency: "COP" },
            { code: "KR", label: "Corée du Sud", flag: "🇰🇷", currency: "KRW" },
            { code: "CR", label: "Costa Rica", flag: "🇨🇷", currency: "CRC" },
            { code: "CI", label: "Côte d'Ivoire", flag: "🇨🇮", currency: "XOF" },
            { code: "HR", label: "Croatie", flag: "🇭🇷", currency: "EUR" },
            { code: "CU", label: "Cuba", flag: "🇨🇺", currency: "CUP" },
            { code: "CY", label: "Chypre", flag: "🇨🇾", currency: "EUR" },
            { code: "CZ", label: "Tchéquie", flag: "🇨🇿", currency: "CZK" },
            { code: "DK", label: "Danemark", flag: "🇩🇰", currency: "DKK" },
            { code: "DO", label: "Rép. dominicaine", flag: "🇩🇴", currency: "DOP" },
            { code: "EC", label: "Équateur", flag: "🇪🇨", currency: "USD" },
            { code: "EG", label: "Égypte", flag: "🇪🇬", currency: "EGP" },
            { code: "AE", label: "Émirats arabes unis", flag: "🇦🇪", currency: "AED" },
            { code: "EE", label: "Estonie", flag: "🇪🇪", currency: "EUR" },
            { code: "ET", label: "Éthiopie", flag: "🇪🇹", currency: "ETB" },
            { code: "FI", label: "Finlande", flag: "🇫🇮", currency: "EUR" },
            { code: "FR", label: "France", flag: "🇫🇷", currency: "EUR" },
            { code: "GA", label: "Gabon", flag: "🇬🇦", currency: "XAF" },
            { code: "GE", label: "Géorgie", flag: "🇬🇪", currency: "GEL" },
            { code: "DE", label: "Allemagne", flag: "🇩🇪", currency: "EUR" },
            { code: "GH", label: "Ghana", flag: "🇬🇭", currency: "GHS" },
            { code: "GR", label: "Grèce", flag: "🇬🇷", currency: "EUR" },
            { code: "GT", label: "Guatemala", flag: "🇬🇹", currency: "GTQ" },
            { code: "GN", label: "Guinée", flag: "🇬🇳", currency: "GNF" },
            { code: "HT", label: "Haïti", flag: "🇭🇹", currency: "HTG" },
            { code: "HN", label: "Honduras", flag: "🇭🇳", currency: "HNL" },
            { code: "HK", label: "Hong Kong", flag: "🇭🇰", currency: "HKD" },
            { code: "HU", label: "Hongrie", flag: "🇭🇺", currency: "HUF" },
            { code: "IS", label: "Islande", flag: "🇮🇸", currency: "ISK" },
            { code: "IN", label: "Inde", flag: "🇮🇳", currency: "INR" },
            { code: "ID", label: "Indonésie", flag: "🇮🇩", currency: "IDR" },
            { code: "IR", label: "Iran", flag: "🇮🇷", currency: "IRR" },
            { code: "IQ", label: "Irak", flag: "🇮🇶", currency: "IQD" },
            { code: "IE", label: "Irlande", flag: "🇮🇪", currency: "EUR" },
            { code: "IT", label: "Italie", flag: "🇮🇹", currency: "EUR" },
            { code: "JM", label: "Jamaïque", flag: "🇯🇲", currency: "JMD" },
            { code: "JP", label: "Japon", flag: "🇯🇵", currency: "JPY" },
            { code: "JO", label: "Jordanie", flag: "🇯🇴", currency: "JOD" },
            { code: "KZ", label: "Kazakhstan", flag: "🇰🇿", currency: "KZT" },
            { code: "KE", label: "Kenya", flag: "🇰🇪", currency: "KES" },
            { code: "KW", label: "Koweït", flag: "🇰🇼", currency: "KWD" },
            { code: "LV", label: "Lettonie", flag: "🇱🇻", currency: "EUR" },
            { code: "LB", label: "Liban", flag: "🇱🇧", currency: "LBP" },
            { code: "LT", label: "Lituanie", flag: "🇱🇹", currency: "EUR" },
            { code: "LU", label: "Luxembourg", flag: "🇱🇺", currency: "EUR" },
            { code: "MG", label: "Madagascar", flag: "🇲🇬", currency: "MGA" },
            { code: "MY", label: "Malaisie", flag: "🇲🇾", currency: "MYR" },
            { code: "ML", label: "Mali", flag: "🇲🇱", currency: "XOF" },
            { code: "MT", label: "Malte", flag: "🇲🇹", currency: "EUR" },
            { code: "MA", label: "Maroc", flag: "🇲🇦", currency: "MAD" },
            { code: "MU", label: "Maurice", flag: "🇲🇺", currency: "MUR" },
            { code: "MX", label: "Mexique", flag: "🇲🇽", currency: "MXN" },
            { code: "MD", label: "Moldavie", flag: "🇲🇩", currency: "MDL" },
            { code: "MC", label: "Monaco", flag: "🇲🇨", currency: "EUR" },
            { code: "MN", label: "Mongolie", flag: "🇲🇳", currency: "MNT" },
            { code: "ME", label: "Monténégro", flag: "🇲🇪", currency: "EUR" },
            { code: "MZ", label: "Mozambique", flag: "🇲🇿", currency: "MZN" },
            { code: "NP", label: "Népal", flag: "🇳🇵", currency: "NPR" },
            { code: "NL", label: "Pays-Bas", flag: "🇳🇱", currency: "EUR" },
            { code: "NZ", label: "Nouvelle-Zélande", flag: "🇳🇿", currency: "NZD" },
            { code: "NG", label: "Nigeria", flag: "🇳🇬", currency: "NGN" },
            { code: "NO", label: "Norvège", flag: "🇳🇴", currency: "NOK" },
            { code: "OM", label: "Oman", flag: "🇴🇲", currency: "OMR" },
            { code: "PK", label: "Pakistan", flag: "🇵🇰", currency: "PKR" },
            { code: "PS", label: "Palestine", flag: "🇵🇸", currency: "ILS" },
            { code: "PA", label: "Panama", flag: "🇵🇦", currency: "PAB" },
            { code: "PY", label: "Paraguay", flag: "🇵🇾", currency: "PYG" },
            { code: "PE", label: "Pérou", flag: "🇵🇪", currency: "PEN" },
            { code: "PH", label: "Philippines", flag: "🇵🇭", currency: "PHP" },
            { code: "PL", label: "Pologne", flag: "🇵🇱", currency: "PLN" },
            { code: "PT", label: "Portugal", flag: "🇵🇹", currency: "EUR" },
            { code: "QA", label: "Qatar", flag: "🇶🇦", currency: "QAR" },
            { code: "RO", label: "Roumanie", flag: "🇷🇴", currency: "RON" },
            { code: "RU", label: "Russie", flag: "🇷🇺", currency: "RUB" },
            { code: "RW", label: "Rwanda", flag: "🇷🇼", currency: "RWF" },
            { code: "SA", label: "Arabie saoudite", flag: "🇸🇦", currency: "SAR" },
            { code: "SN", label: "Sénégal", flag: "🇸🇳", currency: "XOF" },
            { code: "RS", label: "Serbie", flag: "🇷🇸", currency: "RSD" },
            { code: "SG", label: "Singapour", flag: "🇸🇬", currency: "SGD" },
            { code: "SK", label: "Slovaquie", flag: "🇸🇰", currency: "EUR" },
            { code: "SI", label: "Slovénie", flag: "🇸🇮", currency: "EUR" },
            { code: "ZA", label: "Afrique du Sud", flag: "🇿🇦", currency: "ZAR" },
            { code: "ES", label: "Espagne", flag: "🇪🇸", currency: "EUR" },
            { code: "LK", label: "Sri Lanka", flag: "🇱🇰", currency: "LKR" },
            { code: "SE", label: "Suède", flag: "🇸🇪", currency: "SEK" },
            { code: "CH", label: "Suisse", flag: "🇨🇭", currency: "CHF" },
            { code: "TW", label: "Taïwan", flag: "🇹🇼", currency: "TWD" },
            { code: "TZ", label: "Tanzanie", flag: "🇹🇿", currency: "TZS" },
            { code: "TH", label: "Thaïlande", flag: "🇹🇭", currency: "THB" },
            { code: "TG", label: "Togo", flag: "🇹🇬", currency: "XOF" },
            { code: "TN", label: "Tunisie", flag: "🇹🇳", currency: "TND" },
            { code: "TR", label: "Turquie", flag: "🇹🇷", currency: "TRY" },
            { code: "UA", label: "Ukraine", flag: "🇺🇦", currency: "UAH" },
            { code: "GB", label: "Royaume-Uni", flag: "🇬🇧", currency: "GBP" },
            { code: "US", label: "États-Unis", flag: "🇺🇸", currency: "USD" },
            { code: "UY", label: "Uruguay", flag: "🇺🇾", currency: "UYU" },
            { code: "UZ", label: "Ouzbékistan", flag: "🇺🇿", currency: "UZS" },
            { code: "VE", label: "Venezuela", flag: "🇻🇪", currency: "VES" },
            { code: "VN", label: "Vietnam", flag: "🇻🇳", currency: "VND" },
            { code: "ZM", label: "Zambie", flag: "🇿🇲", currency: "ZMW" },
            { code: "ZW", label: "Zimbabwe", flag: "🇿🇼", currency: "ZWL" },
          ];
          const TIMEZONES = [
            "Europe/Zurich", "Europe/Paris", "Europe/Brussels", "Europe/Luxembourg",
            "Europe/London", "Europe/Berlin", "Europe/Amsterdam", "Europe/Vienna",
            "Europe/Madrid", "Europe/Rome", "Europe/Lisbon", "Europe/Warsaw",
            "Europe/Prague", "Europe/Budapest", "Europe/Bucharest", "Europe/Athens",
            "Europe/Helsinki", "Europe/Stockholm", "Europe/Oslo", "Europe/Copenhagen",
            "Europe/Dublin", "Europe/Istanbul", "Europe/Moscow", "Europe/Kiev",
            "America/Montreal", "America/New_York", "America/Chicago", "America/Denver",
            "America/Los_Angeles", "America/Toronto", "America/Vancouver", "America/Mexico_City",
            "America/Sao_Paulo", "America/Buenos_Aires", "America/Bogota", "America/Lima",
            "Asia/Tokyo", "Asia/Shanghai", "Asia/Hong_Kong", "Asia/Singapore",
            "Asia/Seoul", "Asia/Taipei", "Asia/Bangkok", "Asia/Jakarta",
            "Asia/Kolkata", "Asia/Dubai", "Asia/Riyadh", "Asia/Karachi",
            "Africa/Casablanca", "Africa/Tunis", "Africa/Lagos", "Africa/Nairobi",
            "Africa/Johannesburg", "Africa/Dakar", "Africa/Abidjan",
            "Australia/Sydney", "Australia/Melbourne", "Australia/Perth",
            "Pacific/Auckland",
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
                {equipTab === "packages" && <button onClick={() => { resetTr(); setPkgPanel({ mode: "create", data: { nom: "", description: "", icon: "package", couleur: "#E41076", items: [{ equipment_type_id: equipTypes[0]?.id || "", quantite: 1, notes: "" }] } }); }} className="iz-btn-pink" style={{ ...sBtn("pink"), display: "flex", alignItems: "center", gap: 6 }}><Plus size={14} /> {t('equip.new_package')}</button>}
                {equipTab === "types" && <button onClick={() => {
                  setEquipPanel({ mode: "type" as any, data: { nom: "", description: "", icon: "package", categorie: "materiel", actif: true } });
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
                        <button onClick={() => setEquipPanel({ mode: "return" as any, data: { id: eq.id, nom: eq.nom, collaborateur_name: eq.collaborateur ? `${eq.collaborateur.prenom} ${eq.collaborateur.nom}` : "", returned_at: new Date().toISOString().slice(0, 10), etat: "disponible", notes: "" } })} title="Restituer" style={{ background: C.amberLight, border: "none", borderRadius: 6, padding: 4, cursor: "pointer" }}><RotateCcw size={12} color={C.amber} /></button>
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
                                <button onClick={() => setEquipPanel({ mode: "type_edit" as any, data: { id: et.id, nom: et.nom, description: et.description || "", icon: et.icon || "package", categorie: (et as any).categorie || "materiel", actif: et.actif } })} title="Modifier" style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}><FilePen size={11} color={C.textMuted} /></button>
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

            {/* Equipment Type Create/Edit Panel */}
            {((equipPanel.mode as string) === "type" || (equipPanel.mode as string) === "type_edit") && (<>
              <div onClick={() => setEquipPanel({ mode: "closed", data: {} })} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.3)", zIndex: 1000 }} />
              <div className="iz-panel" style={{ position: "fixed", top: 0, right: 0, width: 460, height: "100vh", background: C.white, boxShadow: "-4px 0 24px rgba(0,0,0,.1)", zIndex: 1001, display: "flex", flexDirection: "column" }}>
                <div style={{ padding: "20px 24px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>{(equipPanel.mode as string) === "type" ? "Nouveau type de matériel" : "Modifier le type"}</h2>
                  <button onClick={() => setEquipPanel({ mode: "closed", data: {} })} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={20} color={C.textLight} /></button>
                </div>
                <div style={{ flex: 1, padding: 24, overflow: "auto", display: "flex", flexDirection: "column", gap: 16 }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Nom du type *</label>
                    <input value={equipPanel.data.nom || ""} onChange={e => setEquipPanel(p => ({ ...p, data: { ...p.data, nom: e.target.value } }))} placeholder="Ex: Ordinateur portable, Badge, Licence Office 365..." style={sInput} />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Description</label>
                    <TranslatableField multiline rows={3} value={equipPanel.data.description || ""} onChange={v => setEquipPanel(p => ({ ...p, data: { ...p.data, description: v } }))} placeholder="Description du type de matériel, usage, remarques..." currentLang={lang} activeLangs={activeLanguages} translations={contentTranslations.equip_description} onTranslationsChange={tr => setTr("equip_description", tr)} style={{ minHeight: 70 }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Catégorie *</label>
                    <div style={{ display: "flex", gap: 8 }}>
                      {[
                        { value: "materiel", label: "Matériel physique", icon: Package, color: C.text },
                        { value: "licence", label: "Licence / Logiciel", icon: KeyRound, color: C.blue },
                      ].map(opt => (
                        <button key={opt.value} onClick={() => setEquipPanel(p => ({ ...p, data: { ...p.data, categorie: opt.value, icon: opt.value === "licence" ? "key" : (p.data.icon === "key" ? "package" : p.data.icon) } }))}
                          style={{ flex: 1, padding: "12px 10px", borderRadius: 10, border: `2px solid ${equipPanel.data.categorie === opt.value ? opt.color : C.border}`, background: equipPanel.data.categorie === opt.value ? (opt.value === "licence" ? C.blueLight : C.bg) : C.white, cursor: "pointer", fontFamily: font, fontSize: 12, fontWeight: equipPanel.data.categorie === opt.value ? 600 : 400, color: equipPanel.data.categorie === opt.value ? opt.color : C.textLight, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                          <opt.icon size={14} /> {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Icône</label>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {Object.entries(EQUIP_ICON_MAP).map(([key, Icon]) => (
                        <button key={key} onClick={() => setEquipPanel(p => ({ ...p, data: { ...p.data, icon: key } }))}
                          style={{ width: 40, height: 40, borderRadius: 8, border: `2px solid ${equipPanel.data.icon === key ? C.pink : C.border}`, background: equipPanel.data.icon === key ? C.pinkBg : C.white, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Icon size={18} color={equipPanel.data.icon === key ? C.pink : C.textMuted} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: C.text }}>Actif</label>
                    <div onClick={() => setEquipPanel(p => ({ ...p, data: { ...p.data, actif: !p.data.actif } }))} style={{ width: 40, height: 22, borderRadius: 11, background: equipPanel.data.actif ? C.green : C.border, cursor: "pointer", position: "relative", transition: "all .2s" }}>
                      <div style={{ width: 18, height: 18, borderRadius: "50%", background: C.white, position: "absolute", top: 2, left: equipPanel.data.actif ? 20 : 2, transition: "all .2s", boxShadow: "0 1px 3px rgba(0,0,0,.2)" }} />
                    </div>
                    <span style={{ fontSize: 11, color: C.textMuted }}>{equipPanel.data.actif ? "Visible dans l'inventaire" : "Masqué"}</span>
                  </div>
                </div>
                <div style={{ padding: "16px 24px", borderTop: `1px solid ${C.border}`, display: "flex", gap: 8, justifyContent: "flex-end" }}>
                  {(equipPanel.mode as string) === "type_edit" && equipPanel.data.id && (
                    <button onClick={() => showConfirm(`Supprimer "${equipPanel.data.nom}" ?`, async () => { try { await apiDeleteEquipType(equipPanel.data.id); reloadEquip(); setEquipPanel({ mode: "closed", data: {} }); addToast_admin(t('toast.deleted')); } catch { addToast_admin(t('toast.error')); } })} style={{ ...sBtn("outline"), color: C.red, borderColor: C.red, marginRight: "auto" }}>{t('common.delete')}</button>
                  )}
                  <button onClick={() => setEquipPanel({ mode: "closed", data: {} })} className="iz-btn-outline" style={sBtn("outline")}>{t('common.cancel')}</button>
                  <button disabled={!equipPanel.data.nom?.trim()} onClick={async () => {
                    try {
                      const payload = { nom: equipPanel.data.nom, description: equipPanel.data.description || null, icon: equipPanel.data.icon || "package", actif: equipPanel.data.actif, categorie: equipPanel.data.categorie || "materiel" };
                      if ((equipPanel.mode as string) === "type_edit" && equipPanel.data.id) await apiUpdateEquipType(equipPanel.data.id, payload);
                      else await apiCreateEquipType(payload);
                      reloadEquip(); setEquipPanel({ mode: "closed", data: {} }); addToast_admin((equipPanel.mode as string) === "type" ? t('equip.type_created') : t('toast.saved'));
                    } catch { addToast_admin(t('toast.error')); }
                  }} className="iz-btn-pink" style={{ ...sBtn("pink"), opacity: !equipPanel.data.nom?.trim() ? 0.5 : 1 }}>{(equipPanel.mode as string) === "type" ? "Créer le type" : t('common.save')}</button>
                </div>
              </div>
            </>)}

            {/* Equipment Return Modal */}
            {(equipPanel.mode as string) === "return" && (<>
              <div onClick={() => setEquipPanel({ mode: "closed", data: {} })} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.4)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div onClick={e => e.stopPropagation()} style={{ width: 440, background: C.white, borderRadius: 16, padding: "28px 32px", boxShadow: "0 20px 60px rgba(0,0,0,.2)" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                    <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>Restitution de matériel</h2>
                    <button onClick={() => setEquipPanel({ mode: "closed", data: {} })} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={20} color={C.textLight} /></button>
                  </div>
                  <div style={{ padding: "12px 16px", background: C.bg, borderRadius: 10, marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
                    <RotateCcw size={18} color={C.amber} />
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{equipPanel.data.nom}</div>
                      <div style={{ fontSize: 12, color: C.textMuted }}>Attribué à {equipPanel.data.collaborateur_name}</div>
                    </div>
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Date de retour *</label>
                    <input type="date" value={equipPanel.data.returned_at || ""} onChange={e => setEquipPanel(p => ({ ...p, data: { ...p.data, returned_at: e.target.value } }))} style={sInput} />
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>État à la restitution *</label>
                    <div style={{ display: "flex", gap: 8 }}>
                      {[
                        { value: "disponible", label: "Bon état", color: C.green, bg: C.greenLight },
                        { value: "en_reparation", label: "À réparer", color: C.amber, bg: C.amberLight },
                        { value: "retire", label: "Hors service", color: C.red, bg: C.redLight },
                      ].map(opt => (
                        <button key={opt.value} onClick={() => setEquipPanel(p => ({ ...p, data: { ...p.data, etat: opt.value } }))}
                          style={{ flex: 1, padding: "10px 8px", borderRadius: 8, border: `2px solid ${equipPanel.data.etat === opt.value ? opt.color : C.border}`, background: equipPanel.data.etat === opt.value ? opt.bg : C.white, cursor: "pointer", fontFamily: font, fontSize: 12, fontWeight: equipPanel.data.etat === opt.value ? 600 : 400, color: equipPanel.data.etat === opt.value ? opt.color : C.textLight, transition: "all .15s" }}>
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div style={{ marginBottom: 20 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Notes de restitution</label>
                    <textarea value={equipPanel.data.notes || ""} onChange={e => setEquipPanel(p => ({ ...p, data: { ...p.data, notes: e.target.value } }))} placeholder="État constaté, accessoires manquants, remarques..." style={{ ...sInput, minHeight: 80, resize: "vertical" }} />
                  </div>
                  <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                    <button onClick={() => setEquipPanel({ mode: "closed", data: {} })} className="iz-btn-outline" style={sBtn("outline")}>{t('common.cancel')}</button>
                    <button onClick={async () => {
                      try {
                        await apiUnassignEquip(equipPanel.data.id, { returned_at: equipPanel.data.returned_at, etat: equipPanel.data.etat, notes: equipPanel.data.notes || undefined });
                        reloadEquip();
                        setEquipPanel({ mode: "closed", data: {} });
                        addToast_admin("Matériel restitué");
                      } catch { addToast_admin(t('toast.error')); }
                    }} className="iz-btn-pink" style={sBtn("pink")}>Confirmer la restitution</button>
                  </div>
                </div>
              </div>
            </>)}

            {/* Equipment Create/Edit Panel */}
            {equipPanel.mode !== "closed" && (equipPanel.mode as string) !== "return" && (<>
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
                  {(() => {
                    const selectedType = equipTypes.find(t => t.id === equipPanel.data.equipment_type_id);
                    const isLicence = (selectedType as any)?.categorie === "licence";
                    return (<>
                  <div><label style={{ fontSize: 11, color: C.textLight, display: "block", marginBottom: 4 }}>{t('equip.name_label')} *</label>
                    <TranslatableField value={equipPanel.data.nom || ""} onChange={v => setEquipPanel(p => ({ ...p, data: { ...p.data, nom: v } }))} currentLang={lang} activeLangs={activeLanguages} translations={contentTranslations.nom} onTranslationsChange={tr => setTr("nom", tr)} style={sInput} placeholder={isLicence ? "Ex: Licence Microsoft 365 — Jean Dupont" : "Ex: MacBook Pro 14 pouces"} />
                  </div>

                  {!isLicence && (<>
                    {/* ── Champs matériel physique ── */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      <div><label style={{ fontSize: 11, color: C.textLight, display: "block", marginBottom: 4 }}>{t('equip.brand')}</label>
                        <input value={equipPanel.data.marque || ""} onChange={e => setEquipPanel(p => ({ ...p, data: { ...p.data, marque: e.target.value } }))} style={sInput} placeholder="Apple" /></div>
                      <div><label style={{ fontSize: 11, color: C.textLight, display: "block", marginBottom: 4 }}>{t('equip.model')}</label>
                        <input value={equipPanel.data.modele || ""} onChange={e => setEquipPanel(p => ({ ...p, data: { ...p.data, modele: e.target.value } }))} style={sInput} placeholder="M3 Pro" /></div>
                    </div>
                    <div><label style={{ fontSize: 11, color: C.textLight, display: "block", marginBottom: 4 }}>{t('equip.serial_number')}</label>
                      <input value={equipPanel.data.numero_serie || ""} onChange={e => setEquipPanel(p => ({ ...p, data: { ...p.data, numero_serie: e.target.value } }))} style={sInput} placeholder="SN-XXXXX" /></div>
                  </>)}

                  {isLicence && (<>
                    {/* ── Champs licence / logiciel ── */}
                    <div><label style={{ fontSize: 11, color: C.textLight, display: "block", marginBottom: 4 }}>Clé de licence / N° de compte</label>
                      <input value={equipPanel.data.numero_serie || ""} onChange={e => setEquipPanel(p => ({ ...p, data: { ...p.data, numero_serie: e.target.value } }))} style={sInput} placeholder="XXXXX-XXXXX-XXXXX ou ID de compte" /></div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      <div><label style={{ fontSize: 11, color: C.textLight, display: "block", marginBottom: 4 }}>Fournisseur</label>
                        <input value={equipPanel.data.marque || ""} onChange={e => setEquipPanel(p => ({ ...p, data: { ...p.data, marque: e.target.value } }))} style={sInput} placeholder="Microsoft, Atlassian..." /></div>
                      <div><label style={{ fontSize: 11, color: C.textLight, display: "block", marginBottom: 4 }}>Plan / Édition</label>
                        <input value={equipPanel.data.modele || ""} onChange={e => setEquipPanel(p => ({ ...p, data: { ...p.data, modele: e.target.value } }))} style={sInput} placeholder="Business Premium, Pro..." /></div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      <div><label style={{ fontSize: 11, color: C.textLight, display: "block", marginBottom: 4 }}>Date d'expiration</label>
                        <input type="date" value={equipPanel.data.date_expiration || ""} onChange={e => setEquipPanel(p => ({ ...p, data: { ...p.data, date_expiration: e.target.value } }))} style={sInput} /></div>
                      <div><label style={{ fontSize: 11, color: C.textLight, display: "block", marginBottom: 4 }}>Nombre de sièges</label>
                        <input type="number" value={equipPanel.data.nombre_sieges || ""} onChange={e => setEquipPanel(p => ({ ...p, data: { ...p.data, nombre_sieges: e.target.value } }))} style={sInput} placeholder="25" /></div>
                    </div>
                    <div><label style={{ fontSize: 11, color: C.textLight, display: "block", marginBottom: 4 }}>Coût de renouvellement (CHF/an)</label>
                      <input type="number" value={equipPanel.data.cout_renouvellement || ""} onChange={e => setEquipPanel(p => ({ ...p, data: { ...p.data, cout_renouvellement: e.target.value } }))} style={sInput} placeholder="0.00" /></div>
                  </>)}

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div><label style={{ fontSize: 11, color: C.textLight, display: "block", marginBottom: 4 }}>{t('equip.state')}</label>
                      <select value={equipPanel.data.etat || "disponible"} onChange={e => setEquipPanel(p => ({ ...p, data: { ...p.data, etat: e.target.value } }))} style={sInput}>
                        {Object.entries(ETAT_META).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                      </select></div>
                    <div><label style={{ fontSize: 11, color: C.textLight, display: "block", marginBottom: 4 }}>{isLicence ? "Date d'achat / souscription" : t('equip.purchase_date')}</label>
                      <input type="date" value={equipPanel.data.date_achat || ""} onChange={e => setEquipPanel(p => ({ ...p, data: { ...p.data, date_achat: e.target.value } }))} style={sInput} /></div>
                  </div>
                  <div><label style={{ fontSize: 11, color: C.textLight, display: "block", marginBottom: 4 }}>{isLicence ? "Coût de la licence (CHF)" : t('equip.value')}</label>
                    <input type="number" value={equipPanel.data.valeur || ""} onChange={e => setEquipPanel(p => ({ ...p, data: { ...p.data, valeur: e.target.value } }))} style={sInput} placeholder="0.00" /></div>
                  <div><label style={{ fontSize: 11, color: C.textLight, display: "block", marginBottom: 4 }}>{t('equip.notes')}</label>
                    <textarea value={equipPanel.data.notes || ""} onChange={e => setEquipPanel(p => ({ ...p, data: { ...p.data, notes: e.target.value } }))} style={{ ...sInput, minHeight: 60, resize: "vertical" }} placeholder={isLicence ? "Conditions, restrictions, informations de connexion..." : ""} /></div>
                    </>); })()}
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
                      const payload = { nom: pkgPanel.data.nom, description: pkgPanel.data.description || null, icon: pkgPanel.data.icon || "package", couleur: pkgPanel.data.couleur || "#E41076", items: validItems, translations: buildTranslationsPayload() };
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
                    if (newVal) {
                      // Activate demo mode + seed demo data
                      try {
                        await seedDemoData();
                        setDemoMode(true); localStorage.setItem("illizeo_demo_mode", "true");
                        refetchCollaborateurs();
                        addToast_admin("Mode démo activé — données de démonstration créées");
                      } catch { addToast_admin("Erreur lors de la création des données démo"); }
                    } else {
                      setDemoMode(false); localStorage.setItem("illizeo_demo_mode", "false");
                      await updateCompanySettings({ demo_mode: "false" }).catch(() => {});
                      addToast_admin("Mode démo désactivé");
                    }
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
            admin_rh: { label: t('role.admin_rh'), color: "#E41076", bg: C.pinkBg },
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
          <h1 style={{ fontSize: 22, fontWeight: 600, margin: 0 }}>Sécurité</h1>
          <p style={{ fontSize: 12, color: C.textLight, margin: "4px 0 0" }}>Gérez la politique de mot de passe et les restrictions d'accès IP.</p>
        </div>

        {/* Security tabs */}
        <div style={{ display: "flex", gap: 0, borderBottom: `1px solid ${C.border}`, marginBottom: 20 }}>
          {([
            { id: "password" as const, label: "Mot de passe" },
            { id: "ip_whitelist" as const, label: "IP Whitelist" },
            { id: "sessions" as const, label: "Sessions" },
            { id: "login_history" as const, label: "Connexions" },
            { id: "advanced" as const, label: "Avancé" },
          ]).map(tab => (
            <button key={tab.id} onClick={() => setSecuritySubTab(tab.id)} style={{ padding: "12px 20px", fontSize: 13, fontWeight: securitySubTab === tab.id ? 600 : 400, color: securitySubTab === tab.id ? C.blue : C.textLight, background: "none", border: "none", borderBottom: securitySubTab === tab.id ? `2px solid ${C.blue}` : "2px solid transparent", cursor: "pointer", fontFamily: font, marginBottom: -1 }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* ═══ IP Whitelist Tab ═══ */}
        {securitySubTab === "ip_whitelist" && (() => {
          if (!ipWhitelist) { getIpWhitelist().then(setIpWhitelist).catch(() => {}); }
          const wl = ipWhitelist || { enabled: false, entries: [], current_ip: "" };
          return (
          <div>
            {/* Current IP info */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 20px", background: C.blueLight, borderRadius: 10, marginBottom: 20 }}>
              <Globe size={18} color={C.blue} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.blue }}>Votre adresse IP actuelle</div>
                <div style={{ fontSize: 15, fontWeight: 700, fontFamily: "monospace" }}>{wl.current_ip || "..."}</div>
              </div>
              {wl.current_ip && !wl.entries.some((e: any) => e.ip_address === wl.current_ip) && (
                <button onClick={async () => {
                  try {
                    await addIpWhitelist({ ip_address: wl.current_ip, label: "Mon IP actuelle" });
                    addToast_admin("Votre IP a été ajoutée à la whitelist");
                    getIpWhitelist().then(setIpWhitelist).catch(() => {});
                  } catch (err: any) { addToast_admin(err.message || "Erreur"); }
                }} className="iz-btn-pink" style={{ ...sBtn("pink"), fontSize: 11, marginLeft: "auto" }}>
                  Ajouter mon IP
                </button>
              )}
              {wl.current_ip && wl.entries.some((e: any) => e.ip_address === wl.current_ip) && (
                <span style={{ marginLeft: "auto", fontSize: 11, color: C.green, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}><CheckCircle size={14} /> Autorisée</span>
              )}
            </div>

            {/* Toggle */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", border: `1px solid ${wl.enabled ? C.green : C.border}`, borderRadius: 10, marginBottom: 20, background: wl.enabled ? C.greenLight + "20" : C.white }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600 }}>Restriction par IP {wl.enabled && <span style={{ fontSize: 10, color: C.green, fontWeight: 700 }}>ACTIVÉE</span>}</div>
                <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>
                  {wl.enabled
                    ? "Seules les adresses IP listées peuvent accéder à la plateforme."
                    : "Toutes les adresses IP peuvent accéder à la plateforme."}
                </div>
              </div>
              <button onClick={async () => {
                try {
                  const res = await toggleIpWhitelist(!wl.enabled);
                  addToast_admin(res.message);
                  getIpWhitelist().then(setIpWhitelist).catch(() => {});
                } catch (err: any) { addToast_admin(err.error || err.message || "Erreur"); }
              }} style={{
                width: 50, height: 28, borderRadius: 14, border: "none", cursor: "pointer", position: "relative",
                background: wl.enabled ? C.green : C.border, transition: "background 0.2s",
              }}>
                <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: wl.enabled ? 25 : 3, transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,.2)" }} />
              </button>
            </div>

            {wl.enabled && wl.entries.length === 0 && (
              <div style={{ padding: "14px 20px", background: C.amberLight, borderRadius: 10, marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
                <AlertTriangle size={18} color={C.amber} />
                <div style={{ fontSize: 12, color: C.amber, fontWeight: 600 }}>Attention : la whitelist est activée mais aucune IP n'est listée. Tous les accès seront bloqués sauf les Super Admins Illizeo.</div>
              </div>
            )}

            {/* Add IP form */}
            <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
              <input id="ip-input" placeholder="Adresse IP ou CIDR (ex: 192.168.1.0/24)" style={{ ...sInput, flex: 1 }} />
              <input id="ip-label" placeholder="Label (ex: Bureau Nyon)" style={{ ...sInput, width: 200 }} />
              <button onClick={async () => {
                const ipEl = document.getElementById("ip-input") as HTMLInputElement;
                const labelEl = document.getElementById("ip-label") as HTMLInputElement;
                if (!ipEl?.value) return;
                try {
                  await addIpWhitelist({ ip_address: ipEl.value, label: labelEl?.value || undefined });
                  addToast_admin("IP ajoutée");
                  ipEl.value = ""; if (labelEl) labelEl.value = "";
                  getIpWhitelist().then(setIpWhitelist).catch(() => {});
                } catch (err: any) { addToast_admin(err.error || err.message || "Format IP invalide"); }
              }} className="iz-btn-pink" style={{ ...sBtn("pink"), fontSize: 12 }}>Ajouter</button>
            </div>

            {/* IP list */}
            {wl.entries.length === 0 ? (
              <div style={{ padding: "40px 0", textAlign: "center", color: C.textMuted, fontSize: 13 }}>Aucune adresse IP dans la whitelist</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {wl.entries.map((entry: any) => (
                  <div key={entry.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 16px", border: `1px solid ${C.border}`, borderRadius: 8, background: C.white }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: C.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Globe size={18} color={C.textMuted} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, fontFamily: "monospace" }}>{entry.ip_address}</div>
                      <div style={{ fontSize: 11, color: C.textMuted }}>{entry.label || "—"} · Ajouté par {entry.created_by?.name || "—"} · {fmtDateTime(entry.created_at)}</div>
                    </div>
                    {entry.ip_address === wl.current_ip && <span style={{ fontSize: 10, color: C.green, fontWeight: 600 }}>Votre IP</span>}
                    <button onClick={async () => {
                      try {
                        await removeIpWhitelist(entry.id);
                        addToast_admin("IP retirée");
                        getIpWhitelist().then(setIpWhitelist).catch(() => {});
                      } catch (err: any) { addToast_admin(err.error || err.message || "Erreur"); }
                    }} style={{ background: "none", border: "none", cursor: "pointer", color: C.red, fontSize: 11 }}>Supprimer</button>
                  </div>
                ))}
              </div>
            )}

            {/* Info */}
            <div style={{ marginTop: 24, padding: "14px 20px", background: C.bg, borderRadius: 8, fontSize: 12, color: C.textMuted }}>
              <div style={{ fontWeight: 600, marginBottom: 6 }}>Notes :</div>
              <ul style={{ margin: 0, paddingLeft: 16 }}>
                <li>Les Super Admins Illizeo ne sont jamais bloqués par la whitelist.</li>
                <li>Les accès support temporaires ne sont pas affectés.</li>
                <li>Utilisez la notation CIDR pour autoriser un réseau entier (ex: 10.0.0.0/8).</li>
                <li>Les tentatives d'accès bloquées sont enregistrées dans le journal d'audit.</li>
              </ul>
            </div>
          </div>
          );
        })()}

        {/* ═══ Sessions Tab ═══ */}
        {securitySubTab === "sessions" && (() => {
          if (!secSessions) { getSecuritySessions().then((r: any) => setSecSessions(r.sessions || [])).catch(() => {}); }
          return (
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div>
                <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Sessions actives</h2>
                <p style={{ fontSize: 12, color: C.textMuted, margin: "4px 0 0" }}>Gérez vos sessions de connexion sur tous vos appareils.</p>
              </div>
              <button onClick={async () => { try { const res = await revokeAllOtherSessions(); addToast_admin(res.message); setSecSessions(null); } catch {} }} style={{ ...sBtn("outline"), fontSize: 11, color: C.red, borderColor: C.red }}>Déconnecter toutes les autres sessions</button>
            </div>
            {!(secSessions || []).length ? <div style={{ padding: "30px 0", textAlign: "center", color: C.textMuted, fontSize: 13 }}>Chargement...</div> : (secSessions || []).map((s: any) => (
              <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 16px", border: `1px solid ${s.is_current ? C.green : C.border}`, borderRadius: 8, marginBottom: 6, background: s.is_current ? C.greenLight + "20" : C.white }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: C.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {s.platform === "Windows" ? <Monitor size={20} color={C.textMuted} /> : s.platform === "macOS" ? <Laptop size={20} color={C.textMuted} /> : s.platform === "iOS" || s.platform === "Android" ? <Phone size={20} color={C.textMuted} /> : <Globe size={20} color={C.textMuted} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{s.device} {s.is_current && <span style={{ fontSize: 10, color: C.green, fontWeight: 600 }}>Session actuelle</span>}</div>
                  <div style={{ fontSize: 11, color: C.textMuted }}>IP: {s.ip_address} · Dernière activité: {fmtDateTime(s.last_activity_at)}</div>
                </div>
                {!s.is_current && <button onClick={async () => { try { await apiRevokeSession(s.id); addToast_admin("Session révoquée"); setSecSessions(null); } catch {} }} style={{ ...sBtn("outline"), fontSize: 11, color: C.red, borderColor: C.red, padding: "4px 12px" }}>Révoquer</button>}
              </div>
            ))}
          </div>
          );
        })()}

        {/* ═══ Login History Tab ═══ */}
        {securitySubTab === "login_history" && (() => {
          if (!secLoginHistory) { getAllLoginHistory().then(setSecLoginHistory).catch(() => {}); }
          return (
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 16px" }}>Historique des connexions</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr 1fr 1fr 0.8fr", gap: 0, padding: "8px 0", borderBottom: `1px solid ${C.border}`, fontSize: 11, fontWeight: 600, color: C.textLight }}>
              <span>Date</span><span>Utilisateur</span><span>Appareil</span><span>IP</span><span>Méthode</span><span>Statut</span>
            </div>
            {!(secLoginHistory || []).length ? <div style={{ padding: "30px 0", textAlign: "center", color: C.textMuted, fontSize: 13 }}>Aucune connexion enregistrée</div> : (secLoginHistory || []).map((h: any, i: number) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr 1fr 1fr 0.8fr", gap: 0, padding: "10px 0", borderBottom: `1px solid ${C.border}`, fontSize: 12, alignItems: "center" }}>
                <span style={{ color: C.textMuted }}>{fmtDateTime(h.created_at)}</span>
                <span style={{ fontWeight: 500 }}>{h.email || "—"}</span>
                <span>{h.device || "—"}</span>
                <span style={{ fontFamily: "monospace", fontSize: 11 }}>{h.ip_address}</span>
                <span>{h.method === "password" ? "Mot de passe" : h.method === "sso" ? "SSO" : h.method === "support_token" ? "Support" : h.method}</span>
                <span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 600, justifySelf: "start", background: h.success ? C.greenLight : C.redLight, color: h.success ? C.green : C.red }}>{h.success ? "Succès" : h.failure_reason || "Échoué"}</span>
              </div>
            ))}
          </div>
          );
        })()}

        {/* ═══ Advanced Security Tab ═══ */}
        {securitySubTab === "advanced" && (() => {
          if (!secSettings) { getSecuritySettings().then(setSecSettings).catch(() => {}); }
          const ss = secSettings || { force_sso: false, force_2fa: false, force_2fa_roles: [], session_timeout_minutes: 0, security_notifications: true, access_schedule_enabled: false, access_schedules: [] };
          const TIMEOUT_OPTIONS = [{ v: 0, l: "Jamais" }, { v: 30, l: "30 min" }, { v: 60, l: "1 heure" }, { v: 240, l: "4 heures" }, { v: 480, l: "8 heures" }, { v: 1440, l: "24 heures" }];
          const DAY_LABELS = ["", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

          const saveSetting = async (key: string, value: any) => {
            try { await updateSecuritySettings({ [key]: value }); setSecSettings({ ...ss, [key]: value }); addToast_admin("Paramètre mis à jour"); } catch { addToast_admin("Erreur"); }
          };

          return (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Session timeout */}
            <div style={{ border: `1px solid ${C.border}`, borderRadius: 10, padding: "16px 20px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600 }}>Expiration de session</div>
                  <div style={{ fontSize: 12, color: C.textMuted }}>Déconnecter automatiquement après une période d'inactivité.</div>
                </div>
                <select value={ss.session_timeout_minutes} onChange={e => saveSetting("session_timeout_minutes", Number(e.target.value))} style={{ ...sInput, width: 140 }}>
                  {TIMEOUT_OPTIONS.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                </select>
              </div>
            </div>

            {/* Force 2FA */}
            <div style={{ border: `1px solid ${ss.force_2fa ? C.green : C.border}`, borderRadius: 10, padding: "16px 20px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600 }}>2FA obligatoire</div>
                  <div style={{ fontSize: 12, color: C.textMuted }}>Tous les utilisateurs doivent activer l'authentification à deux facteurs.</div>
                </div>
                <button onClick={() => saveSetting("force_2fa", !ss.force_2fa)} style={{ width: 50, height: 28, borderRadius: 14, border: "none", cursor: "pointer", position: "relative", background: ss.force_2fa ? C.green : C.border }}>
                  <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: ss.force_2fa ? 25 : 3, transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,.2)" }} />
                </button>
              </div>
            </div>

            {/* Force SSO */}
            <div style={{ border: `1px solid ${ss.force_sso ? C.green : C.border}`, borderRadius: 10, padding: "16px 20px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600 }}>SSO obligatoire</div>
                  <div style={{ fontSize: 12, color: C.textMuted }}>Désactiver la connexion par email/mot de passe. Seul le SSO Microsoft sera disponible.</div>
                </div>
                <button onClick={() => saveSetting("force_sso", !ss.force_sso)} style={{ width: 50, height: 28, borderRadius: 14, border: "none", cursor: "pointer", position: "relative", background: ss.force_sso ? C.green : C.border }}>
                  <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: ss.force_sso ? 25 : 3, transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,.2)" }} />
                </button>
              </div>
            </div>

            {/* Security notifications */}
            <div style={{ border: `1px solid ${ss.security_notifications ? C.green : C.border}`, borderRadius: 10, padding: "16px 20px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600 }}>Notifications de sécurité</div>
                  <div style={{ fontSize: 12, color: C.textMuted }}>Email automatique en cas de : nouvelle IP, tentatives échouées, changement de mot de passe.</div>
                </div>
                <button onClick={() => saveSetting("security_notifications", !ss.security_notifications)} style={{ width: 50, height: 28, borderRadius: 14, border: "none", cursor: "pointer", position: "relative", background: ss.security_notifications ? C.green : C.border }}>
                  <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: ss.security_notifications ? 25 : 3, transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,.2)" }} />
                </button>
              </div>
            </div>

            {/* Access schedule */}
            <div style={{ border: `1px solid ${ss.access_schedule_enabled ? C.green : C.border}`, borderRadius: 10, padding: "16px 20px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: ss.access_schedule_enabled ? 16 : 0 }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600 }}>Restriction horaire</div>
                  <div style={{ fontSize: 12, color: C.textMuted }}>Limiter l'accès à certaines plages horaires.</div>
                </div>
                <button onClick={() => saveSetting("access_schedule_enabled", !ss.access_schedule_enabled)} style={{ width: 50, height: 28, borderRadius: 14, border: "none", cursor: "pointer", position: "relative", background: ss.access_schedule_enabled ? C.green : C.border }}>
                  <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: ss.access_schedule_enabled ? 25 : 3, transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,.2)" }} />
                </button>
              </div>
              {ss.access_schedule_enabled && (
                <div>
                  {(ss.access_schedules || []).map((sched: any) => (
                    <div key={sched.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", border: `1px solid ${C.border}`, borderRadius: 6, marginBottom: 6 }}>
                      <span style={{ flex: 1, fontSize: 13 }}>{sched.label || "Plage"} — {(sched.days || []).map((d: number) => DAY_LABELS[d]).join(", ")} · {sched.start_time}–{sched.end_time} ({sched.timezone})</span>
                      <button onClick={async () => { await deleteAccessSchedule(sched.id); setSecSettings(null); getSecuritySettings().then(setSecSettings).catch(() => {}); addToast_admin("Plage supprimée"); }} style={{ background: "none", border: "none", cursor: "pointer", color: C.red, fontSize: 11 }}>Supprimer</button>
                    </div>
                  ))}
                  <div style={{ display: "flex", gap: 6, marginTop: 8, alignItems: "center" }}>
                    <input id="sched-label" placeholder="Label" style={{ ...sInput, width: 120 }} />
                    <div style={{ display: "flex", gap: 2 }}>
                      {[1,2,3,4,5,6,7].map(d => <button key={d} id={`day-${d}`} onClick={e => { const el = e.currentTarget; el.dataset.sel = el.dataset.sel === "1" ? "0" : "1"; el.style.background = el.dataset.sel === "1" ? C.blue : C.bg; el.style.color = el.dataset.sel === "1" ? "#fff" : C.text; }} data-sel={d <= 5 ? "1" : "0"} style={{ width: 28, height: 28, borderRadius: 4, border: "none", fontSize: 10, cursor: "pointer", background: d <= 5 ? C.blue : C.bg, color: d <= 5 ? "#fff" : C.text, fontFamily: font }}>{DAY_LABELS[d]}</button>)}
                    </div>
                    <input id="sched-start" type="time" defaultValue="07:00" style={{ ...sInput, width: 90 }} />
                    <span style={{ fontSize: 13 }}>—</span>
                    <input id="sched-end" type="time" defaultValue="20:00" style={{ ...sInput, width: 90 }} />
                    <button onClick={async () => {
                      const days = [1,2,3,4,5,6,7].filter(d => (document.getElementById(`day-${d}`) as any)?.dataset?.sel === "1");
                      const start = (document.getElementById("sched-start") as HTMLInputElement)?.value;
                      const end = (document.getElementById("sched-end") as HTMLInputElement)?.value;
                      const label = (document.getElementById("sched-label") as HTMLInputElement)?.value;
                      if (!days.length || !start || !end) { addToast_admin("Sélectionnez des jours et heures"); return; }
                      try { await createAccessSchedule({ label, days, start_time: start, end_time: end }); setSecSettings(null); getSecuritySettings().then(setSecSettings).catch(() => {}); addToast_admin("Plage ajoutée"); } catch { addToast_admin("Erreur"); }
                    }} className="iz-btn-pink" style={{ ...sBtn("pink"), fontSize: 11, padding: "6px 12px" }}>Ajouter</button>
                  </div>
                </div>
              )}
            </div>
          </div>
          );
        })()}

        {/* ═══ Password Policy Tab ═══ */}
        {securitySubTab === "password" && (<div>

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
        </div>)}
      </div>
    );
  };

  const renderAdminCalendar = createAdminCalendar(ctx);
  const renderAdminOrgChart = createAdminOrgChart(ctx);
  const renderAdminBuddy = createAdminBuddy(ctx);
  const renderAdminAuditLog = createAdminAuditLog(ctx);

  // ─── ADMIN ASSISTANT IA ─────────────────────────────────
  const renderAdminAssistantIA = () => {
    const { aiChatMessages, setAiChatMessages, aiChatInput, setAiChatInput, aiChatLoading, setAiChatLoading, aiChatEndRef, themeColor } = ctx;
    const gradStart = themeColor || "#1a1a2e";
    const gradEnd = C.pink;

    const ADMIN_QUICK_PROMPTS = [
      { icon: Users, label: "Collaborateurs en retard", prompt: "Quels collaborateurs sont en retard dans leur parcours ?" },
      { icon: BarChart3, label: "Stats onboarding", prompt: "Donne-moi un résumé des statistiques d'onboarding ce mois." },
      { icon: FileText, label: "Documents manquants", prompt: "Quels collaborateurs n'ont pas fourni tous leurs documents obligatoires ?" },
      { icon: AlertTriangle, label: "Alertes & actions", prompt: "Y a-t-il des alertes ou des actions urgentes à traiter ?" },
      { icon: Calendar, label: "Périodes d'essai", prompt: "Quels collaborateurs terminent leur période d'essai dans les 30 prochains jours ?" },
      { icon: Target, label: "Taux de complétion", prompt: "Quel est le taux de complétion moyen des parcours actifs ?" },
    ];

    const handleSendAdminAiMessage = async (messageOverride?: string) => {
      const content = messageOverride || aiChatInput.trim();
      if (!content || aiChatLoading) return;
      const userMsg = { role: "user" as const, content, timestamp: new Date().toISOString() };
      const newMessages = [...aiChatMessages, userMsg];
      setAiChatMessages(newMessages);
      setAiChatInput("");
      setAiChatLoading(true);
      setTimeout(() => aiChatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);

      try {
        const { postAdminAiChat } = await import('../api/endpoints');
        const history = newMessages.map((m: any) => ({ role: m.role, content: m.content }));
        const res = await postAdminAiChat(content, history);
        setAiChatMessages((prev: any) => [...prev, { role: "assistant", content: res.reply, timestamp: new Date().toISOString() }]);
      } catch {
        setAiChatMessages((prev: any) => [...prev, { role: "assistant", content: "Désolé, l'assistant IA admin n'est pas disponible pour le moment. Vérifiez que le module IA est activé dans votre abonnement.", timestamp: new Date().toISOString() }]);
      }
      setAiChatLoading(false);
      setTimeout(() => aiChatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    };

    return (
      <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "calc(100vh - 60px)", background: C.bg }}>
        <div style={{ flex: 1, overflow: "auto", padding: "20px 0" }}>
          <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 24px" }}>
            {aiChatMessages.length === 0 && (
              <div className="iz-fade-up" style={{ textAlign: "center", paddingTop: 40 }}>
                <div style={{ width: 72, height: 72, borderRadius: "50%", background: `linear-gradient(135deg, ${gradStart}, ${gradEnd})`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", boxShadow: "0 8px 32px rgba(194,24,91,.2)" }}>
                  <Sparkles size={32} color="#fff" />
                </div>
                <h2 style={{ fontSize: 24, fontWeight: 700, color: C.text, margin: "0 0 8px" }}>Assistant IA — Administration</h2>
                <p style={{ fontSize: 14, color: C.textLight, margin: "0 0 36px", maxWidth: 520, marginLeft: "auto", marginRight: "auto" }}>
                  Posez vos questions sur vos collaborateurs, parcours, documents, statistiques. L'IA a accès aux données en temps réel.
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, maxWidth: 720, margin: "0 auto" }}>
                  {ADMIN_QUICK_PROMPTS.map((qp, i) => {
                    const Icon = qp.icon;
                    return (
                      <button key={i} onClick={() => handleSendAdminAiMessage(qp.prompt)}
                        className={`iz-card iz-fade-up iz-stagger-${i + 1}`}
                        style={{ ...sCard, padding: "14px", cursor: "pointer", border: `1px solid ${C.border}`, textAlign: "left", display: "flex", alignItems: "flex-start", gap: 10, transition: "all .15s", background: C.white }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = C.pink; e.currentTarget.style.boxShadow = "0 4px 16px rgba(194,24,91,.08)"; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = "none"; }}>
                        <div style={{ width: 32, height: 32, borderRadius: 8, background: C.pinkBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <Icon size={16} color={C.pink} />
                        </div>
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 600, color: C.text, marginBottom: 2 }}>{qp.label}</div>
                          <div style={{ fontSize: 10, color: C.textMuted, lineHeight: 1.4 }}>{qp.prompt}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

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

        <div style={{ borderTop: `1px solid ${C.border}`, background: C.white, padding: "16px 24px" }}>
          <div style={{ maxWidth: 860, margin: "0 auto" }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <input value={aiChatInput} onChange={e => setAiChatInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSendAdminAiMessage(); } }}
                placeholder="Posez votre question RH..." style={{ ...sInput, flex: 1, fontSize: 14, padding: "14px 18px", borderRadius: 12 }} />
              <button onClick={() => handleSendAdminAiMessage()} disabled={!aiChatInput.trim() || aiChatLoading}
                style={{ ...sBtn("pink"), padding: "12px 18px", borderRadius: 12, opacity: !aiChatInput.trim() || aiChatLoading ? 0.5 : 1, display: "flex", alignItems: "center", gap: 6 }}>
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
    renderAdminAssistantIA,
  };
}
/* END OF createAdminInlinePages — extracted pages are in ./pages/ */
