import { useEffect, useState } from "react";
import { Plus, Trash2, Lock } from "lucide-react";
import { getQuotes, createQuote, updateQuote, toggleQuote, deleteQuote, type ApiQuote } from "../api/endpoints";

interface Props {
  C: any;
  sCard: any;
  sBtn: (k: string) => any;
  sInput: any;
  font: string;
  addToast: (msg: string, type?: string) => void;
}

export default function AdminQuotesPage({ C, sCard, sBtn, sInput, font, addToast }: Props) {
  const [quotes, setQuotes] = useState<ApiQuote[]>([]);
  const [filter, setFilter] = useState<"all" | "active" | "inactive" | "tenant" | "system">("all");
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState({ text: "", author: "" });
  const [loading, setLoading] = useState(true);

  const reload = () => {
    setLoading(true);
    getQuotes().then(setQuotes).catch(() => addToast("Erreur chargement citations", "warning")).finally(() => setLoading(false));
  };
  useEffect(() => { reload(); }, []);

  const filtered = quotes.filter(q => {
    if (filter === "active" && !q.actif) return false;
    if (filter === "inactive" && q.actif) return false;
    if (filter === "tenant" && q.source !== "tenant") return false;
    if (filter === "system" && q.source !== "system") return false;
    if (search && !`${q.text} ${q.author || ""}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });
  const stats = {
    total: quotes.length,
    active: quotes.filter(q => q.actif).length,
    system: quotes.filter(q => q.source === "system").length,
    tenant: quotes.filter(q => q.source === "tenant").length,
  };

  const handleCreate = async () => {
    if (!draft.text.trim()) { addToast("Texte requis", "warning"); return; }
    try {
      const created = await createQuote({ text: draft.text.trim(), author: draft.author.trim() || null });
      setQuotes(prev => [created, ...prev]);
      setDraft({ text: "", author: "" });
      addToast("Citation ajoutée", "success");
    } catch { addToast("Erreur création", "warning"); }
  };

  const handleToggle = async (q: ApiQuote) => {
    try {
      const updated = await toggleQuote(q.id);
      setQuotes(prev => prev.map(x => x.id === q.id ? updated : x));
    } catch { addToast("Erreur", "warning"); }
  };

  const handleDelete = async (q: ApiQuote) => {
    if (q.source === "system") { addToast("Citation système — désactivez-la à la place", "info"); return; }
    if (!confirm(`Supprimer définitivement « ${q.text.slice(0, 60)}... » ?`)) return;
    try {
      await deleteQuote(q.id);
      setQuotes(prev => prev.filter(x => x.id !== q.id));
      addToast("Citation supprimée", "success");
    } catch { addToast("Erreur suppression", "warning"); }
  };

  const handleEdit = async (q: ApiQuote, text: string, author: string) => {
    if (q.source === "system") return;
    try {
      const updated = await updateQuote(q.id, { text, author: author || null });
      setQuotes(prev => prev.map(x => x.id === q.id ? updated : x));
      addToast("Citation modifiée", "success");
    } catch { addToast("Erreur", "warning"); }
  };

  return (
    <div style={{ flex: 1, padding: "24px 32px", overflow: "auto" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 600, margin: 0 }}>Citations du jour</h1>
          <div style={{ fontSize: 12, color: C.textMuted, marginTop: 4 }}>Référentiel de citations affichées en rotation sur le dashboard employé. Une citation différente chaque jour.</div>
        </div>
      </div>

      {/* KPI */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
        {[
          { label: "TOTAL", value: stats.total, color: C.text },
          { label: "ACTIVES", value: stats.active, color: C.green },
          { label: "RÉFÉRENTIEL", value: stats.system, color: "#9C27B0" },
          { label: "AJOUTÉES PAR VOUS", value: stats.tenant, color: C.pink },
        ].map(k => (
          <div key={k.label} className="iz-card" style={{ ...sCard, padding: "14px 16px" }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: C.textMuted, letterSpacing: 1 }}>{k.label}</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: k.color, marginTop: 4 }}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Add new */}
      <div className="iz-card" style={{ ...sCard, padding: "16px 18px", marginBottom: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 10 }}>Ajouter une citation</div>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr auto", gap: 10 }}>
          <input value={draft.text} onChange={e => setDraft(d => ({ ...d, text: e.target.value }))} placeholder="« La meilleure façon de prédire l'avenir, c'est de le créer. »" style={{ ...sInput, fontSize: 13 }} />
          <input value={draft.author} onChange={e => setDraft(d => ({ ...d, author: e.target.value }))} placeholder="Auteur (optionnel)" style={{ ...sInput, fontSize: 13 }} />
          <button onClick={handleCreate} className="iz-btn-pink" style={{ ...sBtn("pink"), padding: "0 18px", fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}><Plus size={14} /> Ajouter</button>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 14 }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher…" style={{ ...sInput, fontSize: 12, maxWidth: 260 }} />
        <div style={{ display: "flex", gap: 4, padding: 3, background: C.bg, borderRadius: 8 }}>
          {[
            { id: "all", label: `Toutes (${stats.total})` },
            { id: "active", label: `Actives (${stats.active})` },
            { id: "inactive", label: `Désactivées (${stats.total - stats.active})` },
            { id: "system", label: `Référentiel (${stats.system})` },
            { id: "tenant", label: `Mes ajouts (${stats.tenant})` },
          ].map(f => (
            <button key={f.id} onClick={() => setFilter(f.id as any)} style={{ padding: "5px 12px", borderRadius: 6, fontSize: 11, fontWeight: filter === f.id ? 600 : 400, border: "none", cursor: "pointer", fontFamily: font, background: filter === f.id ? C.pink : "transparent", color: filter === f.id ? "#fff" : C.textMuted }}>{f.label}</button>
          ))}
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div style={{ padding: 40, textAlign: "center", color: C.textMuted }}>Chargement…</div>
      ) : filtered.length === 0 ? (
        <div style={{ padding: 40, textAlign: "center", color: C.textMuted }}>Aucune citation ne correspond aux filtres</div>
      ) : (
        <div className="iz-card" style={{ ...sCard, padding: 0, overflow: "hidden" }}>
          {filtered.map((q, i) => (
            <QuoteRow key={q.id} q={q} C={C} sBtn={sBtn} sInput={sInput} font={font}
              isLast={i === filtered.length - 1}
              onToggle={() => handleToggle(q)}
              onDelete={() => handleDelete(q)}
              onEdit={(text, author) => handleEdit(q, text, author)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function QuoteRow({ q, C, sBtn, sInput, font, isLast, onToggle, onDelete, onEdit }: any) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(q.text);
  const [author, setAuthor] = useState(q.author || "");
  const isSystem = q.source === "system";
  return (
    <div style={{ display: "grid", gridTemplateColumns: "auto 1fr 200px 140px 80px", padding: "12px 18px", alignItems: "center", borderBottom: isLast ? "none" : `1px solid ${C.border}`, gap: 14, background: q.actif ? "transparent" : C.bg, opacity: q.actif ? 1 : 0.65 }}>
      <div style={{ width: 6, height: 36, borderRadius: 3, background: isSystem ? "#9C27B0" : C.pink }} />
      <div style={{ minWidth: 0 }}>
        {editing && !isSystem ? (
          <>
            <input value={text} onChange={e => setText(e.target.value)} style={{ ...sInput, fontSize: 13, marginBottom: 6 }} />
            <input value={author} onChange={e => setAuthor(e.target.value)} placeholder="Auteur" style={{ ...sInput, fontSize: 11 }} />
          </>
        ) : (
          <>
            <div style={{ fontSize: 13, color: C.text, fontStyle: "italic", lineHeight: 1.4 }}>« {q.text} »</div>
            {q.author && <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>— {q.author}</div>}
          </>
        )}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        {isSystem ? (
          <span style={{ display: "flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 10, fontSize: 10, fontWeight: 700, background: "#9C27B033", color: "#9C27B0" }}>
            <Lock size={11} /> Référentiel
          </span>
        ) : (
          <span style={{ padding: "3px 10px", borderRadius: 10, fontSize: 10, fontWeight: 700, background: C.pinkBg, color: C.pink }}>Personnalisée</span>
        )}
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
        <span style={{ fontSize: 11, color: C.textMuted }}>{q.actif ? "Active" : "Désactivée"}</span>
        <div onClick={onToggle} style={{ width: 36, height: 20, borderRadius: 10, background: q.actif ? C.green : C.border, cursor: "pointer", position: "relative", transition: "all .2s", flexShrink: 0 }}>
          <div style={{ width: 16, height: 16, borderRadius: "50%", background: "#fff", position: "absolute", top: 2, left: q.actif ? 18 : 2, transition: "all .2s", boxShadow: "0 1px 2px rgba(0,0,0,.2)" }} />
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 4 }}>
        {!isSystem && !editing && <button onClick={() => setEditing(true)} style={{ ...sBtn("outline"), padding: "5px 10px", fontSize: 11 }}>✎</button>}
        {!isSystem && editing && (
          <>
            <button onClick={() => { onEdit(text, author); setEditing(false); }} className="iz-btn-pink" style={{ ...sBtn("pink"), padding: "5px 10px", fontSize: 11 }}>OK</button>
            <button onClick={() => { setEditing(false); setText(q.text); setAuthor(q.author || ""); }} style={{ ...sBtn("outline"), padding: "5px 10px", fontSize: 11 }}>×</button>
          </>
        )}
        {!isSystem && !editing && <button onClick={onDelete} style={{ ...sBtn("outline"), padding: "5px 10px", fontSize: 11, color: C.red, borderColor: C.red }}><Trash2 size={11} /></button>}
      </div>
    </div>
  );
}
