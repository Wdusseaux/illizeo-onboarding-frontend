// No hooks — this is a factory render function, not a React component
import { t } from '../../i18n';
import { C, font, sCard, sBtn, sInput, fmtDate } from '../../constants';
import {
  Check, CheckCircle, AlertTriangle, Sparkles, ChevronRight, X, FileText,
  Users, BarChart3, Globe, Zap, Package, Shield, Laptop, Award,
} from 'lucide-react';
import {
  subscribeToPlan, cancelSubscription, getMySubscription, getAvailablePlans,
  validateVatNumber, computeVat, convertExchangeRate,
  type PlanData,
} from '../../api/endpoints';

// Module-level billing state — survit aux re-renders du factory
let _billingCountry = "CH";
let _billingDisplayCurrency = "CHF"; // ce que voit le client (CHF/EUR/USD/GBP/...)
let _billingCustomerType: "company" | "individual" | "freelance" = "company";
let _billingVatNumber = "";
let _billingVatValidation: { valid: boolean; name: string | null; error: string | null } | null = null;
let _billingComputedVat: { rate: number; amount_ht_cents: number; vat_amount_cents: number; amount_ttc_cents: number; treatment: string; mention: string } | null = null;
let _billingVatChecking = false;
let _billingFxRate: number | null = null; // 1 CHF = X display_currency

// Liste des pays courants — auto-charge_currency
// charge_currency = CHF par défaut (sauf EU = EUR), display_currency = devise locale
const COUNTRIES_BILLING: { code: string; name: string; charge: "CHF" | "EUR"; display: string }[] = [
  // CHF (encaissement direct, affichage CHF)
  { code: "CH", name: "Suisse",         charge: "CHF", display: "CHF" },
  { code: "LI", name: "Liechtenstein",  charge: "CHF", display: "CHF" },
  // EU (encaissement EUR, affichage EUR)
  { code: "FR", name: "France",         charge: "EUR", display: "EUR" },
  { code: "BE", name: "Belgique",       charge: "EUR", display: "EUR" },
  { code: "DE", name: "Allemagne",      charge: "EUR", display: "EUR" },
  { code: "LU", name: "Luxembourg",     charge: "EUR", display: "EUR" },
  { code: "IT", name: "Italie",         charge: "EUR", display: "EUR" },
  { code: "ES", name: "Espagne",        charge: "EUR", display: "EUR" },
  { code: "PT", name: "Portugal",       charge: "EUR", display: "EUR" },
  { code: "NL", name: "Pays-Bas",       charge: "EUR", display: "EUR" },
  { code: "AT", name: "Autriche",       charge: "EUR", display: "EUR" },
  { code: "IE", name: "Irlande",        charge: "EUR", display: "EUR" },
  { code: "FI", name: "Finlande",       charge: "EUR", display: "EUR" },
  { code: "GR", name: "Grèce",          charge: "EUR", display: "EUR" },
  { code: "PL", name: "Pologne",        charge: "EUR", display: "PLN" },
  { code: "SE", name: "Suède",          charge: "EUR", display: "SEK" },
  { code: "DK", name: "Danemark",       charge: "EUR", display: "DKK" },
  { code: "CZ", name: "Tchéquie",       charge: "EUR", display: "CZK" },
  // Autres (encaissement CHF, affichage devise locale en estimation)
  { code: "GB", name: "Royaume-Uni",    charge: "CHF", display: "GBP" },
  { code: "US", name: "États-Unis",     charge: "CHF", display: "USD" },
  { code: "CA", name: "Canada",         charge: "CHF", display: "CAD" },
  { code: "AU", name: "Australie",      charge: "CHF", display: "AUD" },
  { code: "JP", name: "Japon",          charge: "CHF", display: "JPY" },
  { code: "SG", name: "Singapour",      charge: "CHF", display: "SGD" },
  { code: "AE", name: "Émirats arabes",  charge: "CHF", display: "AED" },
  { code: "IL", name: "Israël",         charge: "CHF", display: "ILS" },
  { code: "NO", name: "Norvège",        charge: "CHF", display: "NOK" },
  { code: "BR", name: "Brésil",         charge: "CHF", display: "BRL" },
];
const EU_COUNTRY_CODES = ["AT","BE","BG","CY","CZ","DE","DK","EE","ES","FI","FR","GR","HR","HU","IE","IT","LT","LU","LV","MT","NL","PL","PT","RO","SE","SI","SK"];

// Trouve l'entrée pays + détermine charge currency
const findCountry = (code: string) => COUNTRIES_BILLING.find(c => c.code === code) || { code, name: code, charge: "CHF" as const, display: "CHF" };
// Pour la facturation Stripe : si charge="CHF" → utilise stripe_price_id_chf, si "EUR" → stripe_price_id_eur
const getChargeCurrency = (countryCode: string): "CHF" | "EUR" => findCountry(countryCode).charge;

// ─── Plan features mapping (matches illizeo.com design) ────────
const PLAN_FEATURES: Record<string, string[]> = {
  starter: [
    "Digital HR File",
    "Custom Documents & Reports",
    "Preliminary Payroll",
    "Google / LinkedIn Integration",
    "People Analytics",
    "Email + Phone Support",
    "Limited Electronic Signature",
  ],
  business: [
    "All existing features on Illizeo Core",
    "Connection with OAuth 2.0",
    "API",
    "Unlimited Electronic Signature",
    "Dedicated Consultant",
  ],
  enterprise: [],
};

const PLAN_DISPLAY: Record<string, { title: string; subtitle: string }> = {
  starter: { title: "Illizeo Core", subtitle: "Extended functionalities for your holistic HR work and your monthly Preliminary Payroll" },
  business: { title: "Illizeo Core Extended", subtitle: "Extended functionalities for your holistic HR work and your monthly Preliminary Payroll" },
  enterprise: { title: "Illizeo Custom", subtitle: "A custom HR solution, tailored to your unique needs" },
};

// ─── App icons for add-ons ─────────────────────────────────────
const APP_ICON_MAP: Record<string, any> = {
  cooptation: Users,
  ia_starter: Sparkles,
  ia_business: Sparkles,
  ia_enterprise: Sparkles,
};

const APP_DISPLAY: Record<string, { name: string; desc: string; icon: any; color: string }> = {
  cooptation: { name: "Cooptation", desc: "Programme de cooptation et parrainage interne", icon: Users, color: "#E91E8C" },
  ia_starter: { name: "IA Starter", desc: "OCR pièces d'identité + génération contrats IA", icon: Sparkles, color: "#2196F3" },
  ia_business: { name: "IA Business", desc: "OCR + IllizeoBot + génération contrats IA avancée", icon: Sparkles, color: "#2196F3" },
  ia_enterprise: { name: "IA Enterprise", desc: "OCR haute précision + IllizeoBot avancé + génération illimitée", icon: Sparkles, color: "#2196F3" },
};

export function createAdminSubscription(ctx: any) {
  const {
    tenantActiveModules, setTenantActiveModules,
    tenantSubscriptions, setTenantSubscriptions,
    selectedPlanIds, setSelectedPlanIds,
    subView, setSubView,
    subEmployeeCount, setSubEmployeeCount,
    billingInfo, paymentMethod, setPaymentMethod,
    plans, setPlans, saPlans,
    pricingBilling, setPricingBilling,
    subStep, setSubStep,
    addToast_admin, showConfirm,
    auth, _needsPlan,
  } = ctx;

  return function renderSubscriptionFlow() {
    const step = subStep || "plan";
    const setStep = setSubStep;
    const availablePlans: PlanData[] = plans.length > 0 ? plans : saPlans;
    const activeSubs = tenantSubscriptions.filter((s: any) => s.status === "active" || s.status === "trialing");
    const currentOnboardingSub = activeSubs.filter((s: any) => s.plan?.slug !== "cooptation" && s.plan?.addon_type !== "ai").sort((a: any, b: any) => (a.canceled_at ? 1 : 0) - (b.canceled_at ? 1 : 0))[0] || null;

    const onboardingPlans = availablePlans.filter((p: any) => !p.is_addon && p.addon_type !== "ai" && p.slug !== "cooptation").sort((a, b) => a.ordre - b.ordre);
    const appPlans = availablePlans.filter((p: any) => p.is_addon || p.slug === "cooptation").sort((a, b) => a.ordre - b.ordre);

    const selectedMainPlan = onboardingPlans.find(p => selectedPlanIds.includes(p.id));
    const selectedAppIds = selectedPlanIds.filter(id => appPlans.some(p => p.id === id));

    const reloadSub = () => {
      getMySubscription().then(res => { setTenantSubscriptions(res.subscriptions || []); setTenantActiveModules(res.active_modules || []); }).catch(() => {});
      if (plans.length === 0) getAvailablePlans().then(setPlans).catch(() => {});
    };

    // ── Currency selection ──
    // Pour les pays "estimation" (US/GB/CA/AU/JP/...), on a maintenant des Stripe Prices
    // natifs dans leur devise. On utilise donc directement la display currency comme charge.
    const NATIVE_STRIPE_CURRENCIES = ["CHF", "EUR", "USD", "GBP", "CAD", "AUD", "JPY"];
    const countryEntry = findCountry(_billingCountry);
    const chargeCurrency = NATIVE_STRIPE_CURRENCIES.includes(countryEntry.display)
      ? countryEntry.display // On charge directement dans la devise locale du client
      : countryEntry.charge; // Fallback : EUR pour PL/SE/CZ/etc., CHF sinon
    const priceField = ({
      "CHF": "prix_chf_mensuel", "EUR": "prix_eur_mensuel",
      "USD": "prix_usd_mensuel", "GBP": "prix_gbp_mensuel",
      "CAD": "prix_cad_mensuel", "AUD": "prix_aud_mensuel",
      "JPY": "prix_jpy_mensuel",
    } as Record<string, string>)[chargeCurrency] || "prix_chf_mensuel";
    const calcTotal = () => {
      return selectedPlanIds.reduce((sum: number, id: number) => {
        const p = availablePlans.find(pl => pl.id === id) as any;
        if (!p) return sum;
        const price = Number(p[priceField] || 0);
        const isAddon = p.is_addon || p.slug === "cooptation";
        if (p.addon_type === "ai") return sum + price;
        if (isAddon) return sum + price * subEmployeeCount;
        return sum + (pricingBilling === "yearly" ? price * 0.9 : price) * subEmployeeCount;
      }, 0);
    };

    const total = calcTotal();
    const perEmployee = selectedMainPlan ? (pricingBilling === "yearly" ? Number((selectedMainPlan as any)[priceField]) * 0.9 : Number((selectedMainPlan as any)[priceField])) : 0;

    // ── Recalcul TVA quand pays/n° TVA/total change ──
    const recomputeVat = async () => {
      if (total <= 0) { _billingComputedVat = null; setSubEmployeeCount(subEmployeeCount); return; }
      try {
        const r = await computeVat(
          Math.round(total * 100),
          _billingCountry,
          _billingCustomerType,
          _billingVatNumber || undefined,
          _billingVatValidation?.valid || false,
        );
        _billingComputedVat = r;
        setSubEmployeeCount(subEmployeeCount); // force re-render
      } catch {}
    };

    const handleValidateVat = async () => {
      if (!_billingVatNumber || !EU_COUNTRY_CODES.includes(_billingCountry)) return;
      _billingVatChecking = true;
      setSubEmployeeCount(subEmployeeCount);
      try {
        const v = await validateVatNumber(_billingCountry, _billingVatNumber);
        _billingVatValidation = { valid: v.valid, name: v.name, error: v.error };
      } catch (e) {
        _billingVatValidation = { valid: false, name: null, error: "Erreur de vérification" };
      }
      _billingVatChecking = false;
      await recomputeVat();
    };

    const handleCountryChange = async (code: string) => {
      _billingCountry = code;
      _billingDisplayCurrency = findCountry(code).display;
      _billingVatValidation = null; // reset
      // Récupère le taux de change si la display currency n'est ni CHF ni la charge currency
      if (_billingDisplayCurrency !== "CHF" && _billingDisplayCurrency !== "EUR") {
        try {
          const r = await convertExchangeRate(1, _billingDisplayCurrency);
          _billingFxRate = r.amount_target;
        } catch { _billingFxRate = null; }
      } else {
        _billingFxRate = null;
      }
      await recomputeVat();
    };

    // Helpers d'affichage
    const fmt = (amount: number, currency: string) => `${(Math.round(amount * 100) / 100).toFixed(2)} ${currency}`;
    const displayCurrency = _billingDisplayCurrency || chargeCurrency;
    const totalChargeCurrency = total;
    const totalDisplayCurrency = (displayCurrency === chargeCurrency || _billingFxRate === null)
      ? totalChargeCurrency
      : (chargeCurrency === "CHF" ? totalChargeCurrency * (_billingFxRate || 1) : totalChargeCurrency); // EUR→display via FX seulement si display différent

    // ══════════════════════════════════════════════════════
    // STEP 1: Plan selection (3 cards like illizeo.com)
    // ══════════════════════════════════════════════════════
    const renderPlanStep = () => (
      <div style={{ flex: 1 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>
          {onboardingPlans.map((plan, idx) => {
            const isSelected = selectedPlanIds.includes(plan.id);
            const isCurrent = currentOnboardingSub?.plan_id === plan.id;
            const isEnterprise = plan.slug === "enterprise";
            const display = PLAN_DISPLAY[plan.slug] || { title: plan.nom, subtitle: plan.description || "" };
            const features = PLAN_FEATURES[plan.slug] || [];
            const monthlyPrice = Number((plan as any)[priceField] || plan.prix_chf_mensuel);
            const displayPrice = pricingBilling === "yearly" ? Math.round(monthlyPrice * 0.9 * 100) / 100 : monthlyPrice;
            const minMonthly = Math.round(displayPrice * 100) / 100;

            if (isEnterprise) {
              // Enterprise = pink card with "Contact Us"
              return (
                <div key={plan.id} style={{
                  borderRadius: 12, padding: "32px 24px", position: "relative", overflow: "hidden",
                  background: "linear-gradient(135deg, #E91E63 0%, #E41076 100%)", color: "#fff",
                  display: "flex", flexDirection: "column",
                  border: isSelected ? "3px solid #E91E63" : "1px solid transparent",
                }}>
                  <h3 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 8px", color: "#fff" }}>{display.title}</h3>
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,.8)", marginBottom: 24, lineHeight: 1.5 }}>{display.subtitle}</p>
                  <button onClick={() => window.open("mailto:contact@illizeo.com?subject=Illizeo Custom", "_blank")}
                    style={{ padding: "10px 24px", borderRadius: 8, border: "2px solid rgba(255,255,255,.7)", background: "transparent", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer", marginTop: "auto" }}>
                    Contact Us
                  </button>
                </div>
              );
            }

            return (
              <div key={plan.id} style={{
                borderRadius: 12, padding: "32px 24px", cursor: "pointer", transition: "all .15s",
                border: isSelected ? `2px solid ${C.pink}` : isCurrent ? `2px solid ${C.green}` : `1px solid ${C.border}`,
                background: C.white, display: "flex", flexDirection: "column",
              }} onClick={() => { if (!isCurrent) setSelectedPlanIds((prev: number[]) => [plan.id, ...prev.filter((id: number) => !onboardingPlans.some(op => op.id === id))]); }}>
                {isCurrent && <div style={{ fontSize: 10, fontWeight: 700, color: C.green, marginBottom: 6, textTransform: "uppercase" }}>Plan actuel</div>}

                <h3 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 8px" }}>{display.title}</h3>
                <p style={{ fontSize: 13, color: C.textLight, marginBottom: 20, lineHeight: 1.5 }}>{display.subtitle}</p>

                <div style={{ marginBottom: 4 }}>
                  <span style={{ fontSize: 28, fontWeight: 800 }}>{chargeCurrency} {displayPrice}</span>
                  <span style={{ fontSize: 12, color: C.textMuted, marginLeft: 6 }}>/ mois / employé</span>
                </div>
                <div style={{ fontSize: 12, color: C.green, fontWeight: 600, marginBottom: 20 }}>≈ {minMonthly} {chargeCurrency} / mois</div>

                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24, flex: 1 }}>
                  {features.map(f => (
                    <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13 }}>
                      <Check size={16} color={C.green} style={{ flexShrink: 0, marginTop: 1 }} />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>

                {!isCurrent && (
                  <button onClick={e => { e.stopPropagation(); setSelectedPlanIds((prev: number[]) => [plan.id, ...prev.filter((id: number) => !onboardingPlans.some(op => op.id === id))]); }}
                    style={{
                      width: "100%", padding: "12px 0", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer",
                      border: "none", fontFamily: font, transition: "all .15s",
                      background: isSelected ? C.pink : "#1565C0", color: "#fff",
                    }}>
                    {isSelected ? "Selected" : "Select Plan"}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );

    // ══════════════════════════════════════════════════════
    // STEP 2: Apps selection (Cooptation, IA plans)
    // ══════════════════════════════════════════════════════
    const renderAppsStep = () => (
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {appPlans.map(plan => {
            const isSelected = selectedPlanIds.includes(plan.id);
            const display = APP_DISPLAY[plan.slug] || { name: plan.nom, desc: plan.description || "", icon: Package, color: C.textMuted };
            const IconComp = display.icon;
            const price = Number((plan as any)[priceField] || plan.prix_chf_mensuel);
            const isAi = (plan as any).addon_type === "ai";
            const priceLabel = isAi ? `${chargeCurrency} ${price} / mois` : `À partir de ${chargeCurrency} ${price} / employé actif`;

            return (
              <div key={plan.id} onClick={() => setSelectedPlanIds((prev: number[]) => prev.includes(plan.id) ? prev.filter((id: number) => id !== plan.id) : [...prev, plan.id])}
                style={{
                  border: isSelected ? `2px solid ${display.color}` : `1px solid ${C.border}`,
                  borderRadius: 12, padding: "20px 24px", cursor: "pointer", transition: "all .15s",
                  background: isSelected ? display.color + "08" : C.white,
                  display: "flex", alignItems: "center", gap: 16,
                }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: display.color + "15", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <IconComp size={22} color={display.color} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>{display.name}</div>
                  <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>{display.desc}</div>
                  <div style={{ fontSize: 12, color: C.textLight, marginTop: 6, fontWeight: 600 }}>{priceLabel}</div>
                </div>
                <div style={{
                  width: 24, height: 24, borderRadius: 6, border: isSelected ? `2px solid ${display.color}` : `2px solid ${C.border}`,
                  background: isSelected ? display.color : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all .15s",
                }}>
                  {isSelected && <Check size={14} color="#fff" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );

    // ══════════════════════════════════════════════════════
    // RIGHT SIDEBAR: Summary (sticky)
    // ══════════════════════════════════════════════════════
    const renderSidebar = () => (
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
                {b === "monthly" ? "Monthly" : "Yearly"}
              </button>
            ))}
          </div>
          {pricingBilling === "yearly" && (
            <div style={{ fontSize: 11, color: C.green, fontWeight: 700, textAlign: "right", marginBottom: 12, padding: "2px 8px", background: C.greenLight, borderRadius: 4, display: "inline-block", float: "right" }}>10% Reduction</div>
          )}
          <div style={{ clear: "both" }} />

          {/* Step 1: Plan */}
          <div style={{ marginTop: 16, marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
              <span style={{ fontSize: 14, fontWeight: 700 }}>1. Choose a plan</span>
              {selectedMainPlan && <span style={{ fontSize: 13, fontWeight: 700 }}>{Math.round(perEmployee * subEmployeeCount * 100) / 100} CHF</span>}
            </div>
            <div style={{ fontSize: 13, color: C.textMuted }}>
              {selectedMainPlan ? (
                <>
                  {PLAN_DISPLAY[selectedMainPlan.slug]?.title || selectedMainPlan.nom}
                  <div style={{ fontSize: 11, color: C.textLight }}>( {perEmployee} {chargeCurrency} / employé actif)</div>
                </>
              ) : "Aucun plan sélectionné"}
            </div>
          </div>

          {/* Step 2: Employees */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>2. Select your employees</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button onClick={() => setSubEmployeeCount(Math.max(25, subEmployeeCount - 5))} style={{ width: 36, height: 36, borderRadius: "50%", border: `1px solid ${C.border}`, background: C.white, cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: font }}>−</button>
              <input type="number" value={subEmployeeCount} onChange={(e: any) => setSubEmployeeCount(Math.max(25, Number(e.target.value)))} style={{ width: 60, textAlign: "center", padding: "8px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 16, fontWeight: 700, fontFamily: font }} />
              <button onClick={() => setSubEmployeeCount(subEmployeeCount + 5)} style={{ width: 36, height: 36, borderRadius: "50%", border: `1px solid ${C.border}`, background: C.white, cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: font }}>+</button>
            </div>
          </div>

          {/* Step 3: Action button */}
          {step === "plan" && selectedMainPlan && (
            <button onClick={() => setStep("apps")} style={{
              width: "100%", padding: "12px 0", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer",
              border: "none", background: "#1565C0", color: "#fff", fontFamily: font, marginBottom: 16,
            }}>
              Access Apps
            </button>
          )}

          {step === "apps" && (
            <>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>3. Choose your apps</div>
              <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 12 }}>Select the necessary applications to get started.</div>

              {/* ── Récap pré-confirmation ── */}
              {(() => {
                const countryName = COUNTRIES_BILLING.find(c => c.code === _billingCountry)?.name || _billingCountry;
                const customerTypeLabel = ({ company: "Société", freelance: "Indépendant", individual: "Particulier" } as any)[_billingCustomerType];
                const vatLine = _billingComputedVat ? (
                  _billingComputedVat.rate > 0
                    ? `+ TVA ${_billingComputedVat.rate}% : ${fmt(_billingComputedVat.vat_amount_cents / 100, chargeCurrency)}`
                    : (_billingComputedVat.treatment === "eu_reverse_charge"
                      ? "0% TVA — autoliquidation (reverse charge)"
                      : _billingComputedVat.treatment === "export"
                        ? "0% TVA — export de services hors-EU"
                        : "0% TVA")
                ) : null;
                const totalHt = total;
                const totalTtc = _billingComputedVat ? _billingComputedVat.amount_ttc_cents / 100 : totalHt;
                const periodLabel = pricingBilling === "yearly" ? "/ an" : "/ mois";
                return (
                  <div style={{ background: "linear-gradient(135deg, #FFF5FB 0%, #FFF 100%)", border: `1.5px solid ${C.pink}30`, borderRadius: 10, padding: "14px 16px", marginBottom: 14 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: C.pink, letterSpacing: .8, marginBottom: 8, textTransform: "uppercase" }}>
                      📋 Récapitulatif avant paiement
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "4px 12px", fontSize: 12, marginBottom: 10 }}>
                      <span style={{ color: C.textMuted }}>Pays :</span><span style={{ fontWeight: 600 }}>{countryName}</span>
                      <span style={{ color: C.textMuted }}>Profil :</span><span style={{ fontWeight: 600 }}>{customerTypeLabel}</span>
                      {_billingVatNumber && <><span style={{ color: C.textMuted }}>N° TVA :</span><span style={{ fontFamily: "monospace", fontSize: 11 }}>{_billingVatNumber} {_billingVatValidation?.valid ? "✓" : ""}</span></>}
                      <span style={{ color: C.textMuted }}>Cycle :</span><span style={{ fontWeight: 600 }}>{pricingBilling === "yearly" ? "Annuel (-10%)" : "Mensuel"}</span>
                    </div>
                    <div style={{ borderTop: `1px dashed ${C.pink}30`, paddingTop: 10 }}>
                      <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 4 }}>Vous serez facturé :</div>
                      <div style={{ fontSize: 22, fontWeight: 800, color: C.text }}>{fmt(totalTtc, chargeCurrency)} <span style={{ fontSize: 13, fontWeight: 400, color: C.textMuted }}>{periodLabel}</span></div>
                      <div style={{ fontSize: 11, color: C.textMuted, marginTop: 4 }}>Total HT : {fmt(totalHt, chargeCurrency)}{vatLine && ` · ${vatLine}`}</div>
                      {chargeCurrency !== "CHF" && chargeCurrency !== "EUR" && (
                        <div style={{ fontSize: 10, color: C.textMuted, marginTop: 6, fontStyle: "italic" }}>
                          ℹ️ Stripe convertira votre paiement en CHF lors de la réception (taux Stripe ~1%).
                        </div>
                      )}
                      {_billingComputedVat?.treatment === "eu_reverse_charge" && (
                        <div style={{ fontSize: 10, color: C.green, marginTop: 6 }}>
                          ✓ TVA due par votre entreprise via autoliquidation (art. 196 directive 2006/112/CE)
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}

              <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                <button onClick={() => setStep("plan")} style={{ ...sBtn("outline"), fontSize: 12, padding: "8px 16px" }}>Retour</button>
                <button onClick={async () => {
                  const billing = {
                    currency: chargeCurrency,
                    country: _billingCountry,
                    customer_type: _billingCustomerType,
                    vat_number: _billingVatValidation?.valid ? _billingVatNumber : undefined,
                  };
                  for (const pid of selectedPlanIds) {
                    try { await subscribeToPlan(pid, pricingBilling, paymentMethod, subEmployeeCount, billing); } catch {}
                  }
                  reloadSub(); setSubView("overview"); setSelectedPlanIds([]);
                  addToast_admin(paymentMethod === "invoice" ? "Abonnement activé — facture envoyée" : "Abonnement activé — 14 jours d'essai gratuit");
                }} style={{
                  flex: 1, padding: "10px 0", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer",
                  border: "none", background: C.pink, color: "#fff", fontFamily: font,
                }}>
                  ✓ Confirmer la souscription
                </button>
              </div>
            </>
          )}

          {/* ── Informations de facturation ── */}
          <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 16, marginTop: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>📍 Informations de facturation</div>

            {/* Pays */}
            <div style={{ marginBottom: 10 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: C.textLight, display: "block", marginBottom: 4 }}>Pays</label>
              <select value={_billingCountry} onChange={(e: any) => { handleCountryChange(e.target.value); }} style={{ ...sInput, fontSize: 12, cursor: "pointer" }}>
                {COUNTRIES_BILLING.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
              </select>
            </div>

            {/* Type de client */}
            <div style={{ marginBottom: 10 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: C.textLight, display: "block", marginBottom: 4 }}>Type de client</label>
              <select value={_billingCustomerType} onChange={(e: any) => { _billingCustomerType = e.target.value; recomputeVat(); }} style={{ ...sInput, fontSize: 12, cursor: "pointer" }}>
                <option value="company">Société</option>
                <option value="freelance">Indépendant</option>
                <option value="individual">Particulier</option>
              </select>
            </div>

            {/* N° TVA — uniquement EU + société/freelance */}
            {EU_COUNTRY_CODES.includes(_billingCountry) && _billingCustomerType !== "individual" && (
              <div style={{ marginBottom: 10 }}>
                <label style={{ fontSize: 11, fontWeight: 600, color: C.textLight, display: "block", marginBottom: 4 }}>
                  N° TVA <span style={{ fontWeight: 400 }}>(pour autoliquidation)</span>
                </label>
                <input value={_billingVatNumber} onChange={(e: any) => { _billingVatNumber = e.target.value.toUpperCase().replace(/\s/g, ""); _billingVatValidation = null; setSubEmployeeCount(subEmployeeCount); }}
                  onBlur={handleValidateVat}
                  placeholder={`Ex: ${_billingCountry}12345678901`}
                  style={{ ...sInput, fontSize: 12, fontFamily: "monospace" }} />
                {_billingVatChecking && <div style={{ fontSize: 10, color: C.textMuted, marginTop: 4 }}>⏳ Vérification VIES...</div>}
                {_billingVatValidation && _billingVatValidation.valid && (
                  <div style={{ fontSize: 10, color: C.green, marginTop: 4, fontWeight: 600 }}>✓ Validé via VIES{_billingVatValidation.name ? ` — ${_billingVatValidation.name}` : ""}</div>
                )}
                {_billingVatValidation && !_billingVatValidation.valid && _billingVatNumber && (
                  <div style={{ fontSize: 10, color: C.red, marginTop: 4 }}>✗ {_billingVatValidation.error || "N° TVA invalide"}</div>
                )}
              </div>
            )}
          </div>

          {/* ── Total ── */}
          <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 16, marginTop: 16 }}>
            <div style={{ fontSize: 13, color: C.textMuted, marginBottom: 4 }}>Total HT ({pricingBilling === "yearly" ? "annuel" : "mensuel"})</div>
            <div style={{ fontSize: 24, fontWeight: 800 }}>{fmt(total, chargeCurrency)}</div>
            {_billingFxRate && _billingDisplayCurrency !== chargeCurrency && (
              <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>
                ≈ {fmt(total * _billingFxRate / (chargeCurrency === "CHF" ? 1 : 1), _billingDisplayCurrency)} <span style={{ fontStyle: "italic" }}>(estimation, facturé en {chargeCurrency})</span>
              </div>
            )}
            {_billingComputedVat && _billingComputedVat.rate > 0 && (
              <>
                <div style={{ fontSize: 12, color: C.textMuted, marginTop: 6 }}>+ TVA {_billingComputedVat.rate}% : {fmt(_billingComputedVat.vat_amount_cents / 100, chargeCurrency)}</div>
                <div style={{ fontSize: 14, fontWeight: 700, marginTop: 4, paddingTop: 6, borderTop: `1px dashed ${C.border}` }}>
                  Total TTC : {fmt(_billingComputedVat.amount_ttc_cents / 100, chargeCurrency)}
                </div>
              </>
            )}
            {_billingComputedVat && _billingComputedVat.rate === 0 && _billingComputedVat.mention && (
              <div style={{ fontSize: 10, color: C.textMuted, marginTop: 6, padding: "6px 8px", background: C.bg, borderRadius: 6, lineHeight: 1.4, fontStyle: "italic" }}>
                {_billingComputedVat.mention}
              </div>
            )}
          </div>
        </div>
      </div>
    );

    // ══════════════════════════════════════════════════════
    // MAIN LAYOUT
    // ══════════════════════════════════════════════════════
    return (
      <div>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4, textAlign: "center" }}>Choose the ideal subscription for your business</h2>
        <p style={{ fontSize: 13, color: C.textMuted, textAlign: "center", marginBottom: 24 }}>All our subscriptions are modular thanks to our suite of custom applications.</p>

        <div style={{ display: "flex", gap: 24 }}>
          {step === "plan" && renderPlanStep()}
          {step === "apps" && renderAppsStep()}
          {renderSidebar()}
        </div>
      </div>
    );
  };
}
