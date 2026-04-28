// No hooks — this is a factory render function, not a React component
import { t } from '../../i18n';
import { C, font, sCard, sBtn, sInput, fmtDate } from '../../constants';
import {
  Check, CheckCircle, AlertTriangle, Sparkles, ChevronRight, X, FileText,
  Users, BarChart3, Globe, Zap, Package, Shield, Laptop, Award,
} from 'lucide-react';
import {
  subscribeToPlan, cancelSubscription, getMySubscription, getAvailablePlans,
  type PlanData,
} from '../../api/endpoints';

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

    // ── Price calculation ──
    const calcTotal = () => {
      return selectedPlanIds.reduce((sum: number, id: number) => {
        const p = availablePlans.find(pl => pl.id === id) as any;
        if (!p) return sum;
        const price = Number(p.prix_chf_mensuel || 0);
        const isAddon = p.is_addon || p.slug === "cooptation";
        if (p.addon_type === "ai") return sum + price; // AI = fixed, no per-employee
        if (isAddon) return sum + price * subEmployeeCount; // Cooptation = per employee
        return sum + (pricingBilling === "yearly" ? price * 0.9 : price) * subEmployeeCount;
      }, 0);
    };

    const total = calcTotal();
    const tax = Math.round(total * 0.081 * 100) / 100;
    const perEmployee = selectedMainPlan ? (pricingBilling === "yearly" ? Number(selectedMainPlan.prix_chf_mensuel) * 0.9 : Number(selectedMainPlan.prix_chf_mensuel)) : 0;

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
            const monthlyPrice = Number(plan.prix_chf_mensuel);
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
                  <span style={{ fontSize: 28, fontWeight: 800 }}>CHF {displayPrice}</span>
                  <span style={{ fontSize: 12, color: C.textMuted, marginLeft: 6 }}>/ Month / User</span>
                </div>
                <div style={{ fontSize: 12, color: C.green, fontWeight: 600, marginBottom: 20 }}>≈ {minMonthly} CHF / Month</div>

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
            const price = Number(plan.prix_chf_mensuel);
            const isAi = (plan as any).addon_type === "ai";
            const priceLabel = isAi ? `CHF ${price} / mois` : `Starts at CHF ${price} / Per Active Employee`;

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
                  <div style={{ fontSize: 11, color: C.textLight }}>( {perEmployee} CHF Per Active Employee)</div>
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
              <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                <button onClick={() => setStep("plan")} style={{ ...sBtn("outline"), fontSize: 12, padding: "8px 16px" }}>Back</button>
                <button onClick={async () => {
                  for (const pid of selectedPlanIds) {
                    try { await subscribeToPlan(pid, pricingBilling, paymentMethod, subEmployeeCount); } catch {}
                  }
                  reloadSub(); setSubView("overview"); setSelectedPlanIds([]);
                  addToast_admin(paymentMethod === "invoice" ? "Abonnement activé — facture envoyée" : "Abonnement activé — 14 jours d'essai gratuit");
                }} style={{
                  flex: 1, padding: "10px 0", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer",
                  border: "none", background: "#1565C0", color: "#fff", fontFamily: font,
                }}>
                  Access Summary
                </button>
              </div>
            </>
          )}

          {/* Total */}
          <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 16 }}>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Estimated Total Price</div>
            <div style={{ fontSize: 28, fontWeight: 800 }}>{Math.round(total * 100) / 100} CHF</div>
            <div style={{ fontSize: 12, color: C.textMuted }}>( {pricingBilling === "yearly" ? "Yearly" : "Monthly"} )</div>
            <div style={{ fontSize: 12, color: C.textMuted, marginTop: 4 }}>Inclusive Tax rate of 8.10% : {Math.round((total + tax) * 100) / 100} CHF</div>
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
