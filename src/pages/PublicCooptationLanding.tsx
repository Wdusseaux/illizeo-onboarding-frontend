// Public landing page for a cooptation campaign — accessible via the share
// link sent on LinkedIn / email / WhatsApp. No login required. Tenant slug
// comes from the URL path (e.g. /illizeo2/c/<token>) and is set into
// localStorage before the API call so the tenant middleware resolves correctly.

import React, { useEffect, useState } from "react";
import { apiFetch } from "../api/client";
import { C, font, fontDisplay, fmtCurrency, ILLIZEO_FULL_LOGO_URI } from "../constants";
import { Briefcase, MapPin, Sparkles, CheckCircle, Send, AlertTriangle, Linkedin } from "lucide-react";

interface PublicCampaign {
  titre: string;
  description: string | null;
  departement: string | null;
  site: string | null;
  type_contrat: string;
  type_recompense: string;
  montant_recompense: number | null;
  description_recompense: string | null;
  boost_active: boolean;
  boost_multiplier: number;
  boost_label: string | null;
  boost_until: string | null;
  tenant_name: string | null;
}

export default function PublicCooptationLanding({ tenantId, shareToken }: { tenantId: string; shareToken: string }) {
  const [data, setData] = useState<PublicCampaign | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ candidate_name: "", candidate_email: "", candidate_phone: "", candidate_linkedin: "", message: "" });

  useEffect(() => {
    // Persist the tenant id so apiFetch sends the right X-Tenant header.
    localStorage.setItem("illizeo_tenant_id", tenantId);
    apiFetch<PublicCampaign>(`/cooptation/public/${shareToken}`)
      .then(setData)
      .catch(() => setError("Cette opportunité n'est plus disponible ou le lien a expiré."));
  }, [tenantId, shareToken]);

  const submit = async () => {
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.candidate_name.trim()) return alert("Votre nom est requis");
    if (!emailRe.test(form.candidate_email.trim())) return alert("Email invalide");
    setSubmitting(true);
    try {
      await apiFetch(`/cooptation/public/${shareToken}`, { method: "POST", body: JSON.stringify(form) });
      setSubmitted(true);
    } catch {
      alert("Impossible d'envoyer votre candidature. Réessayez plus tard.");
    } finally {
      setSubmitting(false);
    }
  };

  const isBoosted = data?.boost_active && (!data.boost_until || new Date(data.boost_until) >= new Date(new Date().toDateString()));
  const baseReward = Number(data?.montant_recompense) || 0;
  const reward = isBoosted ? baseReward * (Number(data?.boost_multiplier) || 1) : baseReward;
  const tenantDisplay = data?.tenant_name || tenantId;

  if (error) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: font, padding: 40, textAlign: "center" }}>
        <AlertTriangle size={48} color={C.amber} style={{ marginBottom: 16 }} />
        <h1 style={{ fontSize: 22, fontWeight: 700, color: C.text, margin: "0 0 8px" }}>Opportunité indisponible</h1>
        <p style={{ fontSize: 14, color: C.textMuted, maxWidth: 400 }}>{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: font, color: C.textMuted }}>
        Chargement…
      </div>
    );
  }

  if (submitted) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: font, padding: 40, textAlign: "center", background: `linear-gradient(180deg, ${C.pinkLight} 0%, ${C.white} 60%)` }}>
        <div style={{ width: 80, height: 80, borderRadius: "50%", background: C.greenLight, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
          <CheckCircle size={40} color={C.green} />
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: C.text, margin: "0 0 12px", fontFamily: fontDisplay, letterSpacing: -0.6 }}>Merci, candidature reçue !</h1>
        <p style={{ fontSize: 15, color: C.textLight, maxWidth: 480, lineHeight: 1.5 }}>
          L'équipe RH de <strong>{tenantDisplay}</strong> a bien reçu votre candidature pour le poste de <strong>{data.titre}</strong>. Vous serez recontacté·e très bientôt.
        </p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", fontFamily: font, color: C.text, background: C.white }}>
      {/* Header */}
      <div style={{ padding: "20px 32px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <img src={ILLIZEO_FULL_LOGO_URI} alt="Illizeo" style={{ height: 26 }} />
        <div style={{ fontSize: 12, color: C.textMuted }}>via Illizeo · partagé par {tenantDisplay}</div>
      </div>

      {/* Hero */}
      <div style={{ background: `linear-gradient(135deg, ${C.pinkLight} 0%, ${C.pinkBg} 60%, ${C.pinkLight} 100%)`, padding: "56px 32px 64px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.pink, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 14 }}>
            {tenantDisplay} recrute
          </div>
          <h1 style={{ fontSize: 48, fontWeight: 800, lineHeight: 1.05, margin: "0 0 16px", fontFamily: fontDisplay, letterSpacing: -1.2 }}>
            <span style={{ color: C.text }}>On recherche</span><br />
            <span style={{ color: C.pink }}>{data.titre}</span>
          </h1>
          {data.description && (
            <p style={{ fontSize: 15, color: C.text, lineHeight: 1.6, margin: "0 0 24px", maxWidth: 600 }}>{data.description}</p>
          )}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
            {data.departement && <span style={{ padding: "5px 12px", borderRadius: 8, background: C.white, fontSize: 12, fontWeight: 500, color: C.text, display: "inline-flex", alignItems: "center", gap: 4 }}><Briefcase size={11} /> {data.departement}</span>}
            {data.site && <span style={{ padding: "5px 12px", borderRadius: 8, background: C.white, fontSize: 12, fontWeight: 500, color: C.text, display: "inline-flex", alignItems: "center", gap: 4 }}><MapPin size={11} /> {data.site}</span>}
            <span style={{ padding: "5px 12px", borderRadius: 8, background: C.white, fontSize: 12, fontWeight: 500, color: C.text }}>{data.type_contrat}</span>
          </div>
          {reward > 0 && (
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "12px 18px", borderRadius: 12, background: C.white, border: `1px dashed ${C.pink}` }}>
              <Sparkles size={16} color={C.pink} />
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: C.pink, letterSpacing: 1, textTransform: "uppercase" }}>Prime de cooptation</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: C.text, fontFamily: fontDisplay }}>
                  {fmtCurrency(reward)}
                  {isBoosted && reward !== baseReward && <span style={{ fontSize: 12, color: C.textMuted, textDecoration: "line-through", marginLeft: 8 }}>{fmtCurrency(baseReward)}</span>}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Form */}
      <div style={{ padding: "48px 32px" }}>
        <div style={{ maxWidth: 540, margin: "0 auto" }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: C.text, margin: "0 0 8px", fontFamily: fontDisplay, letterSpacing: -0.4 }}>Postuler ou recommander</h2>
          <p style={{ fontSize: 14, color: C.textLight, margin: "0 0 24px", lineHeight: 1.5 }}>
            Remplissez ce formulaire si vous êtes intéressé·e ou si vous connaissez la personne idéale pour ce poste. L'équipe RH vous recontactera.
          </p>
          <div style={{ display: "grid", gap: 14 }}>
            <div>
              <label style={{ fontSize: 12, color: C.text, display: "block", marginBottom: 6, fontWeight: 500 }}>Nom complet *</label>
              <input value={form.candidate_name} onChange={e => setForm(f => ({ ...f, candidate_name: e.target.value }))} placeholder="Prénom Nom" style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 14, fontFamily: font, boxSizing: "border-box" }} />
            </div>
            <div>
              <label style={{ fontSize: 12, color: C.text, display: "block", marginBottom: 6, fontWeight: 500 }}>Email *</label>
              <input type="email" value={form.candidate_email} onChange={e => setForm(f => ({ ...f, candidate_email: e.target.value }))} placeholder="email@exemple.com" style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 14, fontFamily: font, boxSizing: "border-box" }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, color: C.text, display: "block", marginBottom: 6, fontWeight: 500 }}>Téléphone</label>
                <input value={form.candidate_phone} onChange={e => setForm(f => ({ ...f, candidate_phone: e.target.value }))} placeholder="+41 79 ..." style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 14, fontFamily: font, boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ fontSize: 12, color: C.text, display: "block", marginBottom: 6, fontWeight: 500 }}><Linkedin size={11} style={{ display: "inline", verticalAlign: -1, marginRight: 4 }} />LinkedIn</label>
                <input value={form.candidate_linkedin} onChange={e => setForm(f => ({ ...f, candidate_linkedin: e.target.value }))} placeholder="linkedin.com/in/..." style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 14, fontFamily: font, boxSizing: "border-box" }} />
              </div>
            </div>
            <div>
              <label style={{ fontSize: 12, color: C.text, display: "block", marginBottom: 6, fontWeight: 500 }}>Message (optionnel)</label>
              <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} placeholder="Quelques mots sur votre parcours et votre motivation…" rows={5} style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 14, fontFamily: font, boxSizing: "border-box", resize: "vertical" }} />
            </div>
            <button onClick={submit} disabled={submitting}
              style={{ marginTop: 8, padding: "14px 24px", borderRadius: 10, border: "none", background: C.pink, color: "#fff", fontSize: 15, fontWeight: 600, cursor: submitting ? "wait" : "pointer", fontFamily: font, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, opacity: submitting ? 0.6 : 1, boxShadow: "0 4px 16px rgba(233,30,140,.3)" }}>
              <Send size={16} /> {submitting ? "Envoi…" : "Envoyer ma candidature"}
            </button>
            <p style={{ fontSize: 11, color: C.textMuted, margin: "8px 0 0", textAlign: "center" as const, lineHeight: 1.5 }}>
              Vos données sont traitées par {tenantDisplay} pour cette candidature uniquement. Aucun spam, jamais.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
