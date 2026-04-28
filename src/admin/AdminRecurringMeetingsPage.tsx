import { useEffect, useState } from "react";
import { Plus, Trash2, CalendarClock, Clock, MapPin, Users } from "lucide-react";
import { getRecurringMeetings, createRecurringMeeting, updateRecurringMeeting, deleteRecurringMeeting, type ApiRecurringMeeting } from "../api/endpoints";

const FREQ_LABELS: Record<string, string> = {
  weekly: "Hebdomadaire",
  biweekly: "Bi-mensuelle",
  monthly: "Mensuelle",
  milestone: "Jalons (J+X)",
};
const DOW = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
const ROLES = [
  { id: "manager", label: "Manager" },
  { id: "buddy", label: "Buddy" },
  { id: "rh", label: "RH" },
  { id: "dg", label: "DG" },
  { id: "it", label: "IT" },
];

interface Props {
  C: any;
  sCard: any;
  sBtn: (k: string) => any;
  sInput: any;
  font: string;
  addToast: (msg: string, type?: string) => void;
  parcours: any[];
  collaborateurs: any[];
}

const emptyDraft = (): Partial<ApiRecurringMeeting> => ({
  titre: "",
  description: "",
  frequence: "weekly",
  jour_semaine: 1,
  milestones: [],
  heure: "09:00",
  duree_min: 30,
  lieu: "",
  participants_roles: [],
  parcours_id: null,
  auto_sync_calendar: false,
  actif: true,
});

export default function AdminRecurringMeetingsPage({ C, sCard, sBtn, sInput, font, addToast, parcours }: Props) {
  const [list, setList] = useState<ApiRecurringMeeting[]>([]);
  const [editing, setEditing] = useState<Partial<ApiRecurringMeeting> | null>(null);
  const [loading, setLoading] = useState(true);

  const reload = () => {
    setLoading(true);
    getRecurringMeetings().then(setList).catch(() => addToast("Erreur chargement", "warning")).finally(() => setLoading(false));
  };
  useEffect(() => { reload(); }, []);

  const save = async () => {
    if (!editing) return;
    if (!editing.titre?.trim()) { addToast("Titre requis", "warning"); return; }
    try {
      if (editing.id) {
        const updated = await updateRecurringMeeting(editing.id, editing);
        setList(prev => prev.map(x => x.id === updated.id ? updated : x));
        addToast("RDV récurrent modifié", "success");
      } else {
        const created = await createRecurringMeeting(editing);
        setList(prev => [...prev, created]);
        addToast("RDV récurrent créé", "success");
      }
      setEditing(null);
    } catch { addToast("Erreur sauvegarde", "warning"); }
  };

  const remove = async (m: ApiRecurringMeeting) => {
    if (!confirm(`Supprimer « ${m.titre} » ? Toutes les instances futures seront retirées.`)) return;
    try {
      await deleteRecurringMeeting(m.id);
      setList(prev => prev.filter(x => x.id !== m.id));
      addToast("Supprimé", "success");
    } catch { addToast("Erreur", "warning"); }
  };

  const summary = (m: ApiRecurringMeeting) => {
    if (m.frequence === "milestone") return `Jalons : ${(m.milestones || []).map(j => `J+${j}`).join(", ") || "—"}`;
    const day = m.jour_semaine ? DOW[m.jour_semaine - 1] : "—";
    return `${FREQ_LABELS[m.frequence]} · ${day} ${m.heure}`;
  };

  return (
    <div style={{ flex: 1, padding: "24px 32px", overflow: "auto" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 600, margin: 0 }}>RDV récurrents automatiques</h1>
          <div style={{ fontSize: 12, color: C.textMuted, marginTop: 4, maxWidth: 720 }}>
            Configurez les rendez-vous qui seront <b>générés automatiquement</b> pour chaque nouveau collaborateur en fonction de sa date d'arrivée. Chaque RDV peut être synchronisé avec Microsoft Teams ou Google Calendar.
          </div>
        </div>
        <button onClick={() => setEditing(emptyDraft())} className="iz-btn-pink" style={{ ...sBtn("pink"), display: "flex", alignItems: "center", gap: 6, fontSize: 13, padding: "8px 18px" }}>
          <Plus size={14} /> Nouveau RDV récurrent
        </button>
      </div>

      {loading ? (
        <div style={{ padding: 40, textAlign: "center", color: C.textMuted }}>Chargement…</div>
      ) : list.length === 0 ? (
        <div className="iz-card" style={{ ...sCard, padding: 40, textAlign: "center", color: C.textMuted }}>
          <CalendarClock size={36} color={C.border} style={{ marginBottom: 12 }} />
          <div style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 4 }}>Aucun RDV récurrent configuré</div>
          <div style={{ fontSize: 12 }}>Créez par exemple « Café buddy hebdo lundi 9h » ou « Check-in RH J+7, J+30, J+60 ».</div>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
          {list.map(m => (
            <div key={m.id} className="iz-card" style={{ ...sCard, padding: "16px 18px", opacity: m.actif ? 1 : 0.6 }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, marginBottom: 8 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{m.titre}</div>
                  <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>{summary(m)} · {m.duree_min} min</div>
                </div>
                <div style={{ display: "flex", gap: 4 }}>
                  <button onClick={() => setEditing({ ...m })} style={{ ...sBtn("outline"), padding: "5px 10px", fontSize: 11 }}>✎</button>
                  <button onClick={() => remove(m)} style={{ ...sBtn("outline"), padding: "5px 10px", fontSize: 11, color: C.red, borderColor: C.red }}><Trash2 size={11} /></button>
                </div>
              </div>
              {m.description && <div style={{ fontSize: 12, color: C.textLight, marginBottom: 8 }}>{m.description}</div>}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
                {m.lieu && <span style={{ display: "flex", alignItems: "center", gap: 4, padding: "3px 8px", borderRadius: 8, fontSize: 10, background: C.bg, color: C.textMuted }}><MapPin size={10} /> {m.lieu}</span>}
                {(m.participants_roles || []).map(r => <span key={r} style={{ display: "flex", alignItems: "center", gap: 4, padding: "3px 8px", borderRadius: 8, fontSize: 10, background: C.pinkBg, color: C.pink }}><Users size={10} /> {ROLES.find(x => x.id === r)?.label || r}</span>)}
                {m.parcours && <span style={{ padding: "3px 8px", borderRadius: 8, fontSize: 10, background: "#9C27B033", color: "#9C27B0" }}>Parcours : {m.parcours.nom}</span>}
                {!m.parcours_id && <span style={{ padding: "3px 8px", borderRadius: 8, fontSize: 10, background: C.greenLight, color: C.green }}>Tous parcours</span>}
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 8, borderTop: `1px solid ${C.border}` }}>
                <span style={{ fontSize: 11, color: m.auto_sync_calendar ? C.green : C.textMuted }}>
                  {m.auto_sync_calendar ? "🔄 Sync calendar auto" : "Sync calendar manuelle"}
                </span>
                <span style={{ padding: "3px 10px", borderRadius: 10, fontSize: 10, fontWeight: 700, background: m.actif ? C.greenLight : C.bg, color: m.actif ? C.green : C.textMuted }}>
                  {m.actif ? "ACTIF" : "INACTIF"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Editor panel */}
      {editing && (
        <>
          <div onClick={() => setEditing(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.4)", zIndex: 1000 }} />
          <div style={{ position: "fixed", top: 0, right: 0, width: 560, maxWidth: "92vw", height: "100vh", background: C.white, boxShadow: "-4px 0 24px rgba(0,0,0,.1)", zIndex: 1001, display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "20px 24px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ fontSize: 17, fontWeight: 600, margin: 0 }}>{editing.id ? "Modifier le RDV récurrent" : "Nouveau RDV récurrent"}</h2>
              <button onClick={() => setEditing(null)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 22, color: C.textMuted }}>×</button>
            </div>
            <div style={{ flex: 1, padding: 22, overflow: "auto", display: "flex", flexDirection: "column", gap: 14 }}>
              <Field label="Titre *">
                <input value={editing.titre || ""} onChange={e => setEditing({ ...editing, titre: e.target.value })} placeholder="Ex: Café buddy hebdo" style={{ ...sInput, fontSize: 13 }} />
              </Field>
              <Field label="Description">
                <textarea value={editing.description || ""} onChange={e => setEditing({ ...editing, description: (e.target as HTMLTextAreaElement).value })} rows={2} placeholder="Format, objectif, points clés..." style={{ ...sInput, fontSize: 12, resize: "vertical" }} />
              </Field>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Field label="Fréquence *">
                  <select value={editing.frequence} onChange={e => setEditing({ ...editing, frequence: e.target.value as any })} style={{ ...sInput, fontSize: 13, cursor: "pointer" }}>
                    {Object.entries(FREQ_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </Field>
                <Field label="Heure">
                  <input type="time" value={editing.heure || "09:00"} onChange={e => setEditing({ ...editing, heure: e.target.value })} style={{ ...sInput, fontSize: 13 }} />
                </Field>
              </div>

              {editing.frequence !== "milestone" ? (
                <Field label="Jour de la semaine">
                  <select value={editing.jour_semaine ?? 1} onChange={e => setEditing({ ...editing, jour_semaine: Number(e.target.value) })} style={{ ...sInput, fontSize: 13, cursor: "pointer" }}>
                    {DOW.map((d, i) => <option key={d} value={i + 1}>{d}</option>)}
                  </select>
                </Field>
              ) : (
                <Field label="Jalons (J+X) — séparés par virgules">
                  <input
                    value={(editing.milestones || []).join(", ")}
                    onChange={e => setEditing({ ...editing, milestones: e.target.value.split(",").map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n) && n > 0) })}
                    placeholder="7, 30, 60, 90"
                    style={{ ...sInput, fontSize: 13 }}
                  />
                </Field>
              )}

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Field label="Durée (min)">
                  <input type="number" min={5} max={480} value={editing.duree_min ?? 30} onChange={e => setEditing({ ...editing, duree_min: Number(e.target.value) })} style={{ ...sInput, fontSize: 13 }} />
                </Field>
                <Field label="Lieu / Lien visio">
                  <input value={editing.lieu || ""} onChange={e => setEditing({ ...editing, lieu: e.target.value })} placeholder="Salle Atrium ou https://meet.google.com/..." style={{ ...sInput, fontSize: 13 }} />
                </Field>
              </div>

              <Field label="Participants (rôles à inviter)">
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {ROLES.map(r => {
                    const selected = (editing.participants_roles || []).includes(r.id);
                    return (
                      <button key={r.id} onClick={() => {
                        const cur = editing.participants_roles || [];
                        const next = selected ? cur.filter(x => x !== r.id) : [...cur, r.id];
                        setEditing({ ...editing, participants_roles: next });
                      }} style={{ padding: "6px 14px", borderRadius: 16, fontSize: 12, fontWeight: selected ? 600 : 400, border: `1px solid ${selected ? C.pink : C.border}`, background: selected ? C.pinkBg : C.white, color: selected ? C.pink : C.textLight, cursor: "pointer", fontFamily: font }}>
                        {r.label}
                      </button>
                    );
                  })}
                </div>
              </Field>

              <Field label="Appliquer à">
                <select value={editing.parcours_id ?? ""} onChange={e => setEditing({ ...editing, parcours_id: e.target.value ? Number(e.target.value) : null })} style={{ ...sInput, fontSize: 13, cursor: "pointer" }}>
                  <option value="">Tous les parcours</option>
                  {(parcours || []).map((p: any) => <option key={p.id} value={p.id}>{p.nom}</option>)}
                </select>
              </Field>

              <label style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: C.bg, borderRadius: 8, cursor: "pointer" }}>
                <input type="checkbox" checked={!!editing.auto_sync_calendar} onChange={e => setEditing({ ...editing, auto_sync_calendar: e.target.checked })} style={{ accentColor: C.pink }} />
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: C.text }}>Sync automatique vers le calendrier</div>
                  <div style={{ fontSize: 10, color: C.textMuted }}>Crée un événement Microsoft Teams ou Google Calendar dès qu'une instance est générée. Nécessite une intégration Calendar connectée.</div>
                </div>
              </label>

              <label style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: C.bg, borderRadius: 8, cursor: "pointer" }}>
                <input type="checkbox" checked={!!editing.actif} onChange={e => setEditing({ ...editing, actif: e.target.checked })} style={{ accentColor: C.green }} />
                <div style={{ fontSize: 12, fontWeight: 600, color: C.text }}>Actif</div>
              </label>
            </div>
            <div style={{ padding: "14px 24px", borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <button onClick={() => setEditing(null)} style={{ ...sBtn("outline"), fontSize: 13 }}>Annuler</button>
              <button onClick={save} className="iz-btn-pink" style={{ ...sBtn("pink"), fontSize: 13, padding: "8px 22px" }}>{editing.id ? "Sauvegarder" : "Créer"}</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: any }) {
  return (
    <div>
      <label style={{ fontSize: 12, fontWeight: 600, display: "block", marginBottom: 6 }}>{label}</label>
      {children}
    </div>
  );
}
