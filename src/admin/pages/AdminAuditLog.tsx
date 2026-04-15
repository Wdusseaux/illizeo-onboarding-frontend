// No React hooks — this is a render function, not a component
import { t } from '../../i18n';
import { C, colorWithAlpha, sCard, sBtn, sInput } from '../../constants';
import {
  Download, Search, Clock, ChevronRight, ClipboardCheck,
} from 'lucide-react';
import { exportAuditLog } from '../../api/endpoints';

export function createAdminAuditLog(ctx: any) {
  const {
    auditFilter, setAuditFilter, auditSearch, setAuditSearch,
    auditExpandedEntry, setAuditExpandedEntry,
    auditVisibleCount, setAuditVisibleCount,
    addToast_admin, demoMode,
  } = ctx;

  return function renderAdminAuditLog() {
    const expandedEntry = auditExpandedEntry;
    const setExpandedEntry = setAuditExpandedEntry;
    const visibleCount = auditVisibleCount;
    const setVisibleCount = setAuditVisibleCount;

    const AUDIT_TYPES = {
      collab_created: { label: "Collaborateur cree", cat: "collabs", color: "#4CAF50", bg: "#E8F5E9" },
      collab_updated: { label: "Collaborateur modifié", cat: "collabs", color: "#1A73E8", bg: "#E3F2FD" },
      collab_deleted: { label: "Collaborateur supprimé", cat: "collabs", color: "#E53935", bg: "#FFEBEE" },
      doc_validated: { label: "Document validé", cat: "docs", color: "#4CAF50", bg: "#E8F5E9" },
      doc_refused: { label: "Document refusé", cat: "docs", color: "#E53935", bg: "#FFEBEE" },
      parcours_created: { label: "Parcours créé", cat: "parcours", color: "#4CAF50", bg: "#E8F5E9" },
      parcours_updated: { label: "Parcours modifié", cat: "parcours", color: "#1A73E8", bg: "#E3F2FD" },
      role_assigned: { label: "Rôle assigné", cat: "roles", color: "#7B5EA7", bg: "#F3E5F5" },
      role_updated: { label: "Rôle modifié", cat: "roles", color: "#1A73E8", bg: "#E3F2FD" },
      settings_updated: { label: "Paramètre modifié", cat: "settings", color: "#F9A825", bg: "#FFF8E1" },
      login: { label: "Connexion", cat: "settings", color: "#00897B", bg: "#E0F2F1" },
      password_changed: { label: "Mot de passe changé", cat: "settings", color: "#FF6B35", bg: "#FFF3E0" },
      export_data: { label: "Export de données", cat: "settings", color: "#3F51B5", bg: "#E8EAF6" },
    };
    type AuditType = keyof typeof AUDIT_TYPES;

    const MOCK_USERS = demoMode ? ["Sophie Martin", "Julien Dupont", "Marie Bernard", "Thomas Petit", "Camille Robert", "Admin RH"] : [];
    const now = Date.now();
    const MOCK_ENTRIES = (() => {
      if (!demoMode) return [];
      const types: AuditType[] = Object.keys(AUDIT_TYPES) as AuditType[];
      const entries: { id: number; type: AuditType; description: string; user: string; timestamp: number; details: Record<string, any> }[] = [];
      const descriptions: Record<AuditType, string[]> = {
        collab_created: ["Ajout de Pierre Durand (Dev)", "Ajout de Claire Moreau (Marketing)", "Ajout de Lucas Leroy (Commercial)"],
        collab_updated: ["Modification du poste de J. Dupont", "Changement de département pour M. Bernard", "MAJ coordonnées de T. Petit"],
        collab_deleted: ["Suppression du profil de A. Blanc (départ)", "Archivage du collaborateur R. Morel"],
        doc_validated: ["CNI validée pour P. Durand", "RIB validé pour C. Moreau", "Attestation SS validée pour L. Leroy"],
        doc_refused: ["Justificatif domicile refusé pour T. Petit (illisible)", "Photo identité refusée pour M. Bernard (format)"],
        parcours_created: ["Création du parcours 'Onboarding Dev 2026'", "Nouveau parcours 'Accueil Marketing'"],
        parcours_updated: ["MAJ phases du parcours 'Onboarding Standard'", "Ajout d'une action au parcours 'Commercial'"],
        role_assigned: ["Rôle 'RH Manager' assigné à S. Martin", "Rôle 'Team Lead' assigné à J. Dupont"],
        role_updated: ["Modification des permissions du rôle 'Éditeur'", "Mise à jour du rôle 'Lecteur'"],
        settings_updated: ["Changement du thème de couleur", "MAJ des paramètres de notification", "Activation du module Cooptation"],
        login: ["Connexion depuis 192.168.1.45", "Connexion depuis 10.0.0.12", "Connexion depuis mobile"],
        password_changed: ["Réinitialisation du mot de passe", "Changement de mot de passe (utilisateur)"],
        export_data: ["Export CSV des collaborateurs", "Export du journal d'audit", "Export des documents RH"],
      };
      for (let i = 0; i < 32; i++) {
        const type = types[i % types.length];
        const descs = descriptions[type];
        entries.push({
          id: i + 1,
          type,
          description: descs[i % descs.length],
          user: MOCK_USERS[i % MOCK_USERS.length],
          timestamp: now - i * 3600000 * (2 + Math.floor(i / 5)),
          details: { ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`, agent: "Chrome/126.0", module: AUDIT_TYPES[type].cat },
        });
      }
      return entries;
    })();

    const filterTabs: { key: string; label: string }[] = [
      { key: "all", label: t('audit.all') },
      { key: "collabs", label: t('audit.collabs') },
      { key: "docs", label: t('audit.docs') },
      { key: "parcours", label: t('audit.parcours') },
      { key: "settings", label: t('audit.settings') },
      { key: "roles", label: t('audit.roles') },
    ];

    const search = auditSearch.toLowerCase();
    const filtered = MOCK_ENTRIES.filter(e => {
      if (auditFilter !== "all" && AUDIT_TYPES[e.type].cat !== auditFilter) return false;
      if (search && !e.description.toLowerCase().includes(search) && !e.user.toLowerCase().includes(search) && !AUDIT_TYPES[e.type].label.toLowerCase().includes(search)) return false;
      return true;
    });
    const visible = filtered.slice(0, visibleCount);

    const fmtTs = (ts: number) => {
      const d = new Date(ts);
      const pad = (n: number) => n.toString().padStart(2, "0");
      return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
    };

    const borderColor = (type: AuditType) => {
      const cat = AUDIT_TYPES[type].cat;
      if (cat === "collabs") return "#4CAF50";
      if (cat === "docs") return "#1A73E8";
      if (cat === "parcours") return "#F9A825";
      if (cat === "roles") return "#7B5EA7";
      return "#00897B";
    };

    return (
      <div style={{ flex: 1, padding: "24px 32px", overflow: "auto" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 600, margin: 0 }}>{t('audit.title')}</h1>
            <p style={{ fontSize: 12, color: C.textLight, margin: "4px 0 0" }}>{t('audit.desc')}</p>
          </div>
          <button onClick={() => { exportAuditLog().catch(() => addToast_admin(t('audit.export'), "success")); }}
            className="iz-btn-pink" style={{ ...sBtn("pink"), display: "flex", alignItems: "center", gap: 6 }}>
            <Download size={14} /> {t('audit.export')}
          </button>
        </div>

        {/* Filter tabs */}
        <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
          {filterTabs.map(ft => (
            <button key={ft.key} onClick={() => { setAuditFilter(ft.key); setVisibleCount(15); }}
              style={{
                ...(auditFilter === ft.key ? sBtn("pink") : {}), fontSize: 12, padding: "6px 14px", border: "none", borderRadius: 6, cursor: "pointer",
                background: auditFilter === ft.key ? C.pink : C.bg,
                color: auditFilter === ft.key ? "#fff" : C.text,
              }}>
              {ft.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div style={{ position: "relative", maxWidth: 400, marginBottom: 20 }}>
          <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: C.textMuted }} />
          <input value={auditSearch} onChange={e => { setAuditSearch(e.target.value); setVisibleCount(15); }}
            placeholder={t('org.search')} style={{ ...sInput, paddingLeft: 32, width: "100%" }} />
        </div>

        {/* Timeline */}
        {visible.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: C.textMuted }}>
            <ClipboardCheck size={48} style={{ opacity: 0.3, marginBottom: 12 }} />
            <div style={{ fontSize: 14 }}>{t('audit.no_entries')}</div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {visible.map((entry, idx) => {
              const meta = AUDIT_TYPES[entry.type];
              const isExpanded = expandedEntry === entry.id;
              return (
                <div key={entry.id}
                  onClick={() => setExpandedEntry(isExpanded ? null : entry.id)}
                  style={{
                    cursor: "pointer", padding: "14px 20px", borderLeft: `4px solid ${borderColor(entry.type)}`,
                    background: isExpanded ? colorWithAlpha(meta.color, 0.04) : (idx % 2 === 0 ? C.white : C.bg),
                    borderBottom: `1px solid ${C.border}`, transition: "background 0.15s",
                  }}
                  onMouseOver={e => { if (!isExpanded) e.currentTarget.style.background = colorWithAlpha(meta.color, 0.04); }}
                  onMouseOut={e => { if (!isExpanded) e.currentTarget.style.background = idx % 2 === 0 ? C.white : C.bg; }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}>
                      {/* Type badge */}
                      <span style={{
                        fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 99,
                        background: meta.bg, color: meta.color, whiteSpace: "nowrap",
                      }}>{meta.label}</span>
                      {/* Description */}
                      <span style={{ fontSize: 13, color: C.text, flex: 1 }}>{entry.description}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 16, flexShrink: 0 }}>
                      {/* Timestamp */}
                      <span style={{ fontSize: 11, color: C.textMuted, whiteSpace: "nowrap" }}>
                        <Clock size={11} style={{ verticalAlign: "middle", marginRight: 4 }} />{fmtTs(entry.timestamp)}
                      </span>
                      {/* User */}
                      <span style={{ fontSize: 12, fontWeight: 600, color: C.textLight, minWidth: 120, textAlign: "right" }}>{entry.user}</span>
                      <ChevronRight size={14} color={C.textMuted} style={{ transform: isExpanded ? "rotate(90deg)" : "none", transition: "transform 0.2s" }} />
                    </div>
                  </div>
                  {/* Expanded details */}
                  {isExpanded && (
                    <div style={{ marginTop: 12, padding: "12px 16px", background: C.bg, borderRadius: 8, fontSize: 12, fontFamily: "monospace", color: C.textLight, lineHeight: 1.8 }}>
                      {Object.entries(entry.details).map(([k, v]) => (
                        <div key={k}><span style={{ color: C.pink, fontWeight: 600 }}>"{k}"</span>: <span style={{ color: C.blue }}>"{v}"</span></div>
                      ))}
                      <div><span style={{ color: C.pink, fontWeight: 600 }}>"timestamp"</span>: <span style={{ color: C.blue }}>"{new Date(entry.timestamp).toISOString()}"</span></div>
                      <div><span style={{ color: C.pink, fontWeight: 600 }}>"user"</span>: <span style={{ color: C.blue }}>"{entry.user}"</span></div>
                      <div><span style={{ color: C.pink, fontWeight: 600 }}>"type"</span>: <span style={{ color: C.blue }}>"{entry.type}"</span></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Load more */}
        {visibleCount < filtered.length && (
          <div style={{ textAlign: "center", marginTop: 20 }}>
            <button onClick={() => setVisibleCount(v => v + 15)}
              style={{ ...sBtn("outline"), fontSize: 13, padding: "10px 28px", color: C.pink, border: `1px solid ${C.pink}`, borderRadius: 8 }}>
              {t('audit.all')} ({filtered.length - visibleCount} restants)
            </button>
          </div>
        )}

        {/* Summary bar */}
        <div style={{ display: "flex", gap: 12, marginTop: 24, flexWrap: "wrap" }}>
          {filterTabs.filter(f => f.key !== "all").map(ft => {
            const count = MOCK_ENTRIES.filter(e => AUDIT_TYPES[e.type].cat === ft.key).length;
            const colors: Record<string, string> = { collabs: "#4CAF50", docs: "#1A73E8", parcours: "#F9A825", settings: "#00897B", roles: "#7B5EA7" };
            return (
              <div key={ft.key} className="iz-card" style={{ ...sCard, padding: "10px 16px", display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 120 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: colors[ft.key] || C.blue }} />
                <span style={{ fontSize: 12, color: C.textLight }}>{ft.label}</span>
                <span style={{ fontSize: 16, fontWeight: 700, marginLeft: "auto", color: colors[ft.key] || C.blue }}>{count}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
}
