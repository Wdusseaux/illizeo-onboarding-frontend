import { useEffect, useMemo, useState } from "react";
import { Calendar, MapPin, Video, RefreshCw, Check } from "lucide-react";
import { getRecurringMeetingInstances, syncRecurringInstance } from "../api/endpoints";

interface Props {
  C: any;
  sCard: any;
  sBtn: (k: string) => any;
  font: string;
  myCollab: any;
  actionTemplates: any[];
}

const FREQ_LABEL: Record<string, string> = {
  weekly: "Hebdomadaire",
  biweekly: "Bi-mensuelle",
  monthly: "Mensuelle",
  milestone: "Jalon",
};
const ROLE_LABELS: Record<string, string> = { manager: "Manager", buddy: "Buddy", rh: "RH", dg: "DG", it: "IT" };

const fmtDate = (d: Date) => {
  const days = ["DIMANCHE", "LUNDI", "MARDI", "MERCREDI", "JEUDI", "VENDREDI", "SAMEDI"];
  const months = ["JAN", "FÉV", "MAR", "AVR", "MAI", "JUIN", "JUI", "AOÛ", "SEP", "OCT", "NOV", "DÉC"];
  return `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]}`;
};
const fmtTime = (d: Date) => `${d.getHours()}h${d.getMinutes() > 0 ? String(d.getMinutes()).padStart(2, "0") : ""}`;

const parseStartDate = (s: any): Date | null => {
  if (!s) return null;
  const str = String(s).trim();
  if (str.includes("T")) { const d = new Date(str); return isNaN(d.getTime()) ? null : d; }
  let m = str.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (m) return new Date(parseInt(m[1], 10), parseInt(m[2], 10) - 1, parseInt(m[3], 10), 9, 0, 0);
  m = str.match(/^(\d{1,2})[/\-](\d{1,2})[/\-](\d{4})$/);
  if (m) return new Date(parseInt(m[3], 10), parseInt(m[2], 10) - 1, parseInt(m[1], 10), 9, 0, 0);
  const d = new Date(str);
  return isNaN(d.getTime()) ? null : d;
};

export default function EmployeeMyRdvPage({ C, sCard, sBtn, font, myCollab, actionTemplates }: Props) {
  const [recurring, setRecurring] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [requestOpen, setRequestOpen] = useState(false);
  const [requestDraft, setRequestDraft] = useState<{ recipient_role: string; recipient_user_id: number | null; preferred_date: string; preferred_time: string; reason: string }>({ recipient_role: "", recipient_user_id: null, preferred_date: "", preferred_time: "", reason: "" });
  const [requestSending, setRequestSending] = useState(false);
  const [prepareRdv, setPrepareRdv] = useState<any | null>(null);

  const startDate = parseStartDate(myCollab?.dateDebut || myCollab?.date_debut);

  useEffect(() => {
    if (!myCollab?.id) { setLoading(false); return; }
    getRecurringMeetingInstances(myCollab.id)
      .then(r => setRecurring(r.instances || []))
      .catch(() => setRecurring([]))
      .finally(() => setLoading(false));
  }, [myCollab?.id]);

  // Build individual RDV from parcours actions of type 'rdv' or 'entretien'
  const individualRdv = useMemo(() => {
    if (!startDate) return [];
    const profileActions = (myCollab as any)?.parcours_actions || [];
    const tpls = profileActions.length > 0
      ? profileActions
      : actionTemplates.filter((a: any) => a.parcours === ((myCollab as any)?.parcours_nom));
    return tpls
      .filter((a: any) => a.type === "rdv" || a.type === "entretien" || a.type === "visite")
      .map((a: any) => {
        const m = (a.delaiRelatif || a.delai_relatif || "").match(/J([+-]?\d+)/);
        const offset = m ? parseInt(m[1], 10) : 0;
        const date = new Date(startDate);
        date.setDate(date.getDate() + offset);
        return {
          id: `action_${a.id}`,
          title: a.titre,
          date,
          duree: a.dureeEstimee || a.duree_estimee || `${a.options?.duree_min || 30} min`,
          lieu: a.options?.lieu || "—",
          participants: a.options?.participants || "",
          type: a.type,
          source: "action",
        };
      });
  }, [myCollab, actionTemplates, startDate?.toISOString()]);

  // Recurring instances merged into the same flat list
  const recurringRdv = useMemo(() => {
    return recurring.map((r: any) => ({
      id: `rec_${r.recurring_meeting_id}_${r.scheduled_at}`,
      title: r.titre,
      date: new Date(r.scheduled_at),
      duree: `${r.duree_min} min`,
      lieu: r.lieu || "—",
      participants: (r.participants_roles || []).map((x: string) => ROLE_LABELS[x] || x).join(", "),
      type: "rdv_recurrent",
      source: "recurring",
      recurring_meeting_id: r.recurring_meeting_id,
      external_provider: r.external_provider,
      external_join_url: r.external_join_url,
      synced_at: r.synced_at,
    }));
  }, [recurring]);

  const all = [...individualRdv, ...recurringRdv].sort((a, b) => a.date.getTime() - b.date.getTime());
  const upcoming = all.filter(r => r.date.getTime() >= Date.now() - 86400000);

  // Group recurring by meeting for the bottom section
  const recurringSummary = useMemo(() => {
    const grouped: Record<number, any> = {};
    recurring.forEach(r => {
      if (!grouped[r.recurring_meeting_id]) {
        grouped[r.recurring_meeting_id] = {
          id: r.recurring_meeting_id,
          titre: r.titre,
          frequence: r.frequence,
          count: 0,
          next: null as Date | null,
        };
      }
      grouped[r.recurring_meeting_id].count++;
      const d = new Date(r.scheduled_at);
      if (d.getTime() > Date.now() && (!grouped[r.recurring_meeting_id].next || d < grouped[r.recurring_meeting_id].next)) {
        grouped[r.recurring_meeting_id].next = d;
      }
    });
    return Object.values(grouped);
  }, [recurring]);

  const handleSync = async (rdv: any, provider: "microsoft" | "google") => {
    try {
      const res = await syncRecurringInstance({
        recurring_meeting_id: rdv.recurring_meeting_id,
        collaborateur_id: myCollab.id,
        scheduled_at: rdv.date.toISOString(),
        provider,
      });
      if (res?.ok) {
        // refetch
        const updated = await getRecurringMeetingInstances(myCollab.id);
        setRecurring(updated.instances || []);
      } else {
        alert("Sync impossible. Vérifiez la connexion " + (provider === "microsoft" ? "Microsoft Teams" : "Google Calendar") + " dans Intégrations.");
      }
    } catch {
      alert("Erreur lors de la synchronisation");
    }
  };

  return (
    <div style={{ flex: 1, padding: "32px 40px", overflow: "auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 4 }}>
            {upcoming.length} RDV programmé{upcoming.length > 1 ? "s" : ""} sur 100 jours
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: C.pink, margin: 0 }}>Mes RDV d'intégration</h1>
        </div>
        <button onClick={() => setRequestOpen(true)} className="iz-btn-pink" style={{ ...sBtn("pink"), padding: "10px 20px", fontSize: 13 }}>+ Demander un RDV</button>
      </div>

      {loading ? (
        <div style={{ padding: 40, textAlign: "center", color: C.textMuted }}>Chargement…</div>
      ) : all.length === 0 ? (
        <div className="iz-card" style={{ ...sCard, padding: 40, textAlign: "center", color: C.textMuted }}>
          <Calendar size={36} color={C.border} style={{ marginBottom: 12 }} />
          <div style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 4 }}>Aucun RDV planifié pour l'instant</div>
          <div style={{ fontSize: 12 }}>
            Les RDV apparaîtront ici dès que votre parcours contient des actions de type Rendez-vous, ou que des RDV récurrents sont configurés par votre RH.
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {all.map(r => {
            const past = r.date.getTime() < Date.now() - 3600000;
            const isToday = r.date.toDateString() === new Date().toDateString();
            return (
              <div key={r.id} className="iz-card" style={{ ...sCard, padding: "16px 20px", display: "flex", alignItems: "center", gap: 18, opacity: past ? 0.55 : 1 }}>
                <div style={{ background: isToday ? "#FFF3E0" : C.pinkBg, borderRadius: 10, padding: "12px 16px", textAlign: "center", minWidth: 120, border: isToday ? `2px solid ${C.amber}` : "none" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: isToday ? C.amber : C.pink, letterSpacing: .5 }}>{fmtDate(r.date)}</div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: isToday ? C.amber : C.pink, marginTop: 4 }}>{fmtTime(r.date)}</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <div style={{ fontSize: 16, fontWeight: 600, color: C.text }}>{r.title}</div>
                    {r.source === "recurring" && <span style={{ padding: "2px 8px", borderRadius: 8, fontSize: 9, fontWeight: 700, background: "#9C27B033", color: "#9C27B0" }}>RÉCURRENT</span>}
                    {r.source === "action" && <span style={{ padding: "2px 8px", borderRadius: 8, fontSize: 9, fontWeight: 700, background: C.pinkBg, color: C.pink }}>{(r.type || "rdv").toUpperCase()}</span>}
                    {r.synced_at && <span style={{ display: "flex", alignItems: "center", gap: 3, padding: "2px 8px", borderRadius: 8, fontSize: 9, fontWeight: 700, background: C.greenLight, color: C.green }}><Check size={10} /> SYNC {r.external_provider?.toUpperCase()}</span>}
                  </div>
                  <div style={{ fontSize: 12, color: C.textMuted, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                    <span>⏱ {r.duree}</span>
                    {r.lieu && r.lieu !== "—" && <span style={{ display: "flex", alignItems: "center", gap: 3 }}><MapPin size={11} /> {r.lieu}</span>}
                    {r.participants && <span>👥 {r.participants}</span>}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "flex-end" }}>
                  {r.external_join_url && <a href={r.external_join_url} target="_blank" rel="noreferrer" className="iz-btn-pink" style={{ ...sBtn("pink"), padding: "6px 12px", fontSize: 11, textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}><Video size={11} /> Rejoindre</a>}
                  {r.source === "recurring" && !r.synced_at && !past && (
                    <>
                      <button onClick={() => handleSync(r, "microsoft")} style={{ ...sBtn("outline"), padding: "6px 12px", fontSize: 11, display: "flex", alignItems: "center", gap: 4 }}><RefreshCw size={11} /> Teams</button>
                      <button onClick={() => handleSync(r, "google")} style={{ ...sBtn("outline"), padding: "6px 12px", fontSize: 11, display: "flex", alignItems: "center", gap: 4 }}><RefreshCw size={11} /> Google</button>
                    </>
                  )}
                  {!past && <button onClick={() => setPrepareRdv(r)} style={{ ...sBtn("outline"), padding: "6px 12px", fontSize: 11 }}>Préparer</button>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Recurring schedule summary */}
      {recurringSummary.length > 0 && (
        <div className="iz-card" style={{ ...sCard, marginTop: 24, padding: "20px 24px" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.pink, letterSpacing: 1, marginBottom: 4 }}>RDV RÉCURRENTS AUTOMATIQUES</div>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: C.text, margin: "0 0 4px" }}>Votre rythme d'intégration</h3>
          <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 14 }}>
            Ces rendez-vous sont calculés automatiquement à partir de votre date d'arrivée et de la configuration de votre RH. Vous pouvez les synchroniser un par un avec votre calendrier Microsoft ou Google.
          </div>
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(4, recurringSummary.length)}, 1fr)`, gap: 12 }}>
            {recurringSummary.map((r: any) => (
              <div key={r.id} style={{ padding: "12px 14px", background: C.bg, borderRadius: 10 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{r.titre}</div>
                <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>
                  {FREQ_LABEL[r.frequence] || r.frequence} · {r.count} occurrence{r.count > 1 ? "s" : ""}
                </div>
                {r.next && <div style={{ fontSize: 10, color: C.pink, marginTop: 4, fontWeight: 600 }}>Prochain : {fmtDate(r.next)} {fmtTime(r.next)}</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Prepare RDV modal */}
      {prepareRdv && (() => {
        const r = prepareRdv;
        const dt = r.date instanceof Date ? r.date : new Date(r.date);
        // Build a default checklist + agenda. Custom agenda from action.options.agenda wins if present.
        const customAgenda: string[] = (r.options?.agenda || r.agenda || "").split("\n").map((s: string) => s.trim()).filter(Boolean);
        const defaultChecklist = r.type === "entretien" ? [
          "Préparer 2-3 questions à poser",
          "Lister les sujets prioritaires à aborder",
          "Vérifier vos notes du précédent point",
          "Tester votre micro/caméra si visio",
        ] : r.type === "visite" ? [
          "Identifier les bureaux/salles à visiter",
          "Prévoir une tenue adaptée",
          "Apporter votre badge si déjà reçu",
        ] : [
          "Lire l'ordre du jour",
          "Préparer questions / commentaires",
          "Tester votre matériel",
        ];
        // Build an .ics file content for calendar export
        const fmtIcsDate = (d: Date) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
        const durationMin = parseInt(String(r.duree || "30").replace(/\D/g, ""), 10) || 30;
        const endDate = new Date(dt.getTime() + durationMin * 60000);
        const ics = [
          "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Illizeo//Onboarding//FR",
          "BEGIN:VEVENT",
          `UID:rdv-${r.id}@illizeo.com`,
          `DTSTAMP:${fmtIcsDate(new Date())}`,
          `DTSTART:${fmtIcsDate(dt)}`,
          `DTEND:${fmtIcsDate(endDate)}`,
          `SUMMARY:${r.title}`,
          r.lieu && r.lieu !== "—" ? `LOCATION:${r.lieu}` : "",
          r.external_join_url ? `URL:${r.external_join_url}` : "",
          "END:VEVENT", "END:VCALENDAR",
        ].filter(Boolean).join("\r\n");
        const downloadIcs = () => {
          const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url; a.download = `${r.title.replace(/[^\w\-]/g, "_")}.ics`;
          document.body.appendChild(a); a.click(); document.body.removeChild(a);
          URL.revokeObjectURL(url);
        };
        const googleCalLink = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(r.title)}&dates=${fmtIcsDate(dt).replace(/Z$/, "")}/${fmtIcsDate(endDate).replace(/Z$/, "")}${r.lieu && r.lieu !== "—" ? `&location=${encodeURIComponent(r.lieu)}` : ""}${r.external_join_url ? `&details=${encodeURIComponent("Lien : " + r.external_join_url)}` : ""}`;
        return (
          <>
            <div onClick={() => setPrepareRdv(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.4)", zIndex: 1000 }} />
            <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 520, maxWidth: "95vw", background: C.white, borderRadius: 14, boxShadow: "0 20px 60px rgba(0,0,0,.2)", zIndex: 1001, display: "flex", flexDirection: "column", maxHeight: "90vh" }}>
              <div style={{ padding: "20px 24px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: C.pink, letterSpacing: .5, marginBottom: 4 }}>{fmtDate(dt)} · {fmtTime(dt)}</div>
                  <h3 style={{ fontSize: 17, fontWeight: 600, margin: 0, color: C.text }}>{r.title}</h3>
                  {r.lieu && r.lieu !== "—" && <div style={{ fontSize: 12, color: C.textMuted, marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}><MapPin size={12} /> {r.lieu}</div>}
                </div>
                <button onClick={() => setPrepareRdv(null)} style={{ background: "none", border: "none", cursor: "pointer", color: C.textLight, fontSize: 22, padding: 0, lineHeight: 1 }}>×</button>
              </div>
              <div style={{ padding: "20px 24px", overflow: "auto" }}>
                {customAgenda.length > 0 && (
                  <div style={{ marginBottom: 18 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, letterSpacing: .5, marginBottom: 8 }}>ORDRE DU JOUR</div>
                    {customAgenda.map((line, i) => (
                      <div key={i} style={{ display: "flex", gap: 8, fontSize: 13, color: C.text, marginBottom: 6 }}>
                        <span style={{ color: C.pink, fontWeight: 700 }}>{i + 1}.</span> {line}
                      </div>
                    ))}
                  </div>
                )}
                <div style={{ marginBottom: 18 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, letterSpacing: .5, marginBottom: 8 }}>CHECKLIST DE PRÉPARATION</div>
                  {defaultChecklist.map((item, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: C.bg, borderRadius: 8, marginBottom: 6, fontSize: 13, color: C.text }}>
                      <Check size={14} color={C.pink} /> {item}
                    </div>
                  ))}
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, letterSpacing: .5, marginBottom: 8 }}>AJOUTER À VOTRE CALENDRIER</div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <a href={googleCalLink} target="_blank" rel="noreferrer" style={{ ...sBtn("outline"), padding: "8px 14px", fontSize: 12, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, color: C.text }}>
                      <Calendar size={13} /> Google Calendar
                    </a>
                    <button onClick={downloadIcs} style={{ ...sBtn("outline"), padding: "8px 14px", fontSize: 12, display: "inline-flex", alignItems: "center", gap: 6 }}>
                      <Calendar size={13} /> Télécharger .ics (Outlook/Apple)
                    </button>
                    {r.external_join_url && (
                      <a href={r.external_join_url} target="_blank" rel="noreferrer" className="iz-btn-pink" style={{ ...sBtn("pink"), padding: "8px 14px", fontSize: 12, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}>
                        <Video size={13} /> Lien de réunion
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      })()}

      {/* Request RDV modal */}
      {requestOpen && (() => {
        const accompagnants = (myCollab as any)?.accompagnants || [];
        const ROLE_LABELS_LOCAL: Record<string, string> = { hrbp: "HRBP", manager: "Manager", buddy: "Buddy / Parrain", it: "IT Support", admin_rh: "Admin RH" };
        const recipients = accompagnants.length > 0
          ? accompagnants.map((a: any) => ({ value: `${a.role}:${a.user_id || ""}`, label: `${a.name || "—"} · ${ROLE_LABELS_LOCAL[a.role] || a.role}`, role: a.role, user_id: a.user_id }))
          : [
              { value: "manager:", label: "Mon manager", role: "manager", user_id: null },
              { value: "buddy:", label: "Mon buddy", role: "buddy", user_id: null },
              { value: "hrbp:", label: "Mon HRBP", role: "hrbp", user_id: null },
            ];
        const canSend = !!requestDraft.recipient_role && !!requestDraft.preferred_date && !!requestDraft.reason.trim();
        return (
          <>
            <div onClick={() => !requestSending && setRequestOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.4)", zIndex: 1000 }} />
            <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 460, maxWidth: "95vw", background: C.white, borderRadius: 14, boxShadow: "0 20px 60px rgba(0,0,0,.2)", zIndex: 1001, display: "flex", flexDirection: "column", maxHeight: "90vh" }}>
              <div style={{ padding: "20px 24px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0, color: C.text }}>Demander un RDV</h3>
                <button onClick={() => !requestSending && setRequestOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: C.textLight, fontSize: 22, padding: 0 }}>×</button>
              </div>
              <div style={{ padding: "20px 24px", overflow: "auto" }}>
                <div style={{ marginBottom: 14 }}>
                  <label style={{ fontSize: 11, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Avec qui ?</label>
                  <select value={requestDraft.recipient_role ? `${requestDraft.recipient_role}:${requestDraft.recipient_user_id || ""}` : ""}
                    onChange={e => { const r = recipients.find((x: any) => x.value === e.target.value); setRequestDraft(d => ({ ...d, recipient_role: r?.role || "", recipient_user_id: r?.user_id || null })); }}
                    style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 13, fontFamily: font, background: C.white, cursor: "pointer" }}>
                    <option value="">— Choisir un interlocuteur —</option>
                    {recipients.map((r: any) => <option key={r.value} value={r.value}>{r.label}</option>)}
                  </select>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Date souhaitée</label>
                    <input type="date" value={requestDraft.preferred_date} onChange={e => setRequestDraft(d => ({ ...d, preferred_date: e.target.value }))}
                      min={new Date().toISOString().split("T")[0]}
                      style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 13, fontFamily: font, background: C.white }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Heure (optionnelle)</label>
                    <input type="time" value={requestDraft.preferred_time} onChange={e => setRequestDraft(d => ({ ...d, preferred_time: e.target.value }))}
                      style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 13, fontFamily: font, background: C.white }} />
                  </div>
                </div>
                <div style={{ marginBottom: 14 }}>
                  <label style={{ fontSize: 11, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Motif</label>
                  <textarea value={requestDraft.reason} onChange={e => setRequestDraft(d => ({ ...d, reason: e.target.value }))}
                    placeholder="Ex: J'aurais besoin de faire un point sur mes objectifs des 3 prochains mois."
                    style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 13, fontFamily: font, minHeight: 100, resize: "vertical", background: C.white }} />
                </div>
              </div>
              <div style={{ padding: "16px 24px", borderTop: `1px solid ${C.border}`, display: "flex", gap: 10, justifyContent: "flex-end" }}>
                <button onClick={() => !requestSending && setRequestOpen(false)} disabled={requestSending} style={{ ...sBtn("outline"), padding: "8px 18px", fontSize: 13 }}>Annuler</button>
                <button disabled={!canSend || requestSending} onClick={async () => {
                  setRequestSending(true);
                  try {
                    const m = await import('../api/endpoints');
                    await (m as any).postSuggestion?.({
                      category: "other",
                      content: `📅 Demande de RDV avec ${ROLE_LABELS_LOCAL[requestDraft.recipient_role] || requestDraft.recipient_role}\nDate souhaitée : ${requestDraft.preferred_date}${requestDraft.preferred_time ? ` à ${requestDraft.preferred_time}` : ""}\n\nMotif :\n${requestDraft.reason}`,
                      anonymous: false,
                    });
                    setRequestOpen(false);
                    setRequestDraft({ recipient_role: "", recipient_user_id: null, preferred_date: "", preferred_time: "", reason: "" });
                    alert("Votre demande a été envoyée. Vous serez notifié(e) dès qu'elle est planifiée.");
                  } catch { alert("Impossible d'envoyer la demande. Réessayez plus tard."); }
                  finally { setRequestSending(false); }
                }} className="iz-btn-pink" style={{ ...sBtn("pink"), padding: "8px 18px", fontSize: 13, opacity: canSend && !requestSending ? 1 : 0.5 }}>
                  {requestSending ? "Envoi…" : "Envoyer la demande"}
                </button>
              </div>
            </div>
          </>
        );
      })()}
    </div>
  );
}
