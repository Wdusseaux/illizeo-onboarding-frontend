// No React hooks — this is a render function, not a component
import { t } from '../../i18n';
import { C, colorWithAlpha, sCard, sBtn, sInput } from '../../constants';
import {
  Download, Search, Clock, ChevronRight, ClipboardCheck, RefreshCw,
} from 'lucide-react';
import { exportAuditLog, getAuditLogs } from '../../api/endpoints';

export function createAdminAuditLog(ctx: any) {
  const {
    auditFilter, setAuditFilter, auditSearch, setAuditSearch,
    auditExpandedEntry, setAuditExpandedEntry,
    auditVisibleCount, setAuditVisibleCount,
    auditEntries, setAuditEntries, auditLoaded, setAuditLoaded,
    addToast_admin,
  } = ctx;

  return function renderAdminAuditLog() {
    const expandedEntry = auditExpandedEntry;
    const setExpandedEntry = setAuditExpandedEntry;
    const visibleCount = auditVisibleCount;
    const setVisibleCount = setAuditVisibleCount;

    // Action → display metadata
    const ACTION_META: Record<string, { label: string; cat: string; color: string; bg: string }> = {
      collaborateur_created: { label: "Collaborateur créé", cat: "collabs", color: "#4CAF50", bg: "#E8F5E9" },
      collaborateur_updated: { label: "Collaborateur modifié", cat: "collabs", color: "#1A73E8", bg: "#E3F2FD" },
      collaborateur_deleted: { label: "Collaborateur supprimé", cat: "collabs", color: "#E53935", bg: "#FFEBEE" },
      document_created: { label: "Document ajouté", cat: "docs", color: "#4CAF50", bg: "#E8F5E9" },
      document_updated: { label: "Document modifié", cat: "docs", color: "#1A73E8", bg: "#E3F2FD" },
      document_deleted: { label: "Document supprimé", cat: "docs", color: "#E53935", bg: "#FFEBEE" },
      signaturedocument_created: { label: "Signature créée", cat: "docs", color: "#4CAF50", bg: "#E8F5E9" },
      signaturedocument_updated: { label: "Signature modifiée", cat: "docs", color: "#1A73E8", bg: "#E3F2FD" },
      signaturedocument_deleted: { label: "Signature supprimée", cat: "docs", color: "#E53935", bg: "#FFEBEE" },
      parcours_created: { label: "Parcours créé", cat: "parcours", color: "#4CAF50", bg: "#E8F5E9" },
      parcours_updated: { label: "Parcours modifié", cat: "parcours", color: "#1A73E8", bg: "#E3F2FD" },
      parcours_deleted: { label: "Parcours supprimé", cat: "parcours", color: "#E53935", bg: "#FFEBEE" },
      action_created: { label: "Action créée", cat: "parcours", color: "#4CAF50", bg: "#E8F5E9" },
      action_updated: { label: "Action modifiée", cat: "parcours", color: "#1A73E8", bg: "#E3F2FD" },
      action_deleted: { label: "Action supprimée", cat: "parcours", color: "#E53935", bg: "#FFEBEE" },
      phase_created: { label: "Phase créée", cat: "parcours", color: "#4CAF50", bg: "#E8F5E9" },
      phase_updated: { label: "Phase modifiée", cat: "parcours", color: "#1A73E8", bg: "#E3F2FD" },
      phase_deleted: { label: "Phase supprimée", cat: "parcours", color: "#E53935", bg: "#FFEBEE" },
      user_created: { label: "Utilisateur créé", cat: "roles", color: "#4CAF50", bg: "#E8F5E9" },
      user_updated: { label: "Utilisateur modifié", cat: "roles", color: "#1A73E8", bg: "#E3F2FD" },
      user_deleted: { label: "Utilisateur supprimé", cat: "roles", color: "#E53935", bg: "#FFEBEE" },
      role_created: { label: "Rôle créé", cat: "roles", color: "#7B5EA7", bg: "#F3E5F5" },
      role_updated: { label: "Rôle modifié", cat: "roles", color: "#1A73E8", bg: "#E3F2FD" },
      role_deleted: { label: "Rôle supprimé", cat: "roles", color: "#E53935", bg: "#FFEBEE" },
      login: { label: "Connexion", cat: "settings", color: "#00897B", bg: "#E0F2F1" },
      logout: { label: "Déconnexion", cat: "settings", color: "#607D8B", bg: "#ECEFF1" },
      password_changed: { label: "Mot de passe changé", cat: "settings", color: "#FF6B35", bg: "#FFF3E0" },
      export_data: { label: "Export de données", cat: "settings", color: "#3F51B5", bg: "#E8EAF6" },
      companysetting_updated: { label: "Paramètre modifié", cat: "settings", color: "#F9A825", bg: "#FFF8E1" },
      integration_updated: { label: "Intégration modifiée", cat: "settings", color: "#1A73E8", bg: "#E3F2FD" },
      workflow_created: { label: "Workflow créé", cat: "settings", color: "#4CAF50", bg: "#E8F5E9" },
      workflow_updated: { label: "Workflow modifié", cat: "settings", color: "#1A73E8", bg: "#E3F2FD" },
      workflow_deleted: { label: "Workflow supprimé", cat: "settings", color: "#E53935", bg: "#FFEBEE" },
      equipment_created: { label: "Matériel créé", cat: "collabs", color: "#4CAF50", bg: "#E8F5E9" },
      equipment_updated: { label: "Matériel modifié", cat: "collabs", color: "#1A73E8", bg: "#E3F2FD" },
      equipment_deleted: { label: "Matériel supprimé", cat: "collabs", color: "#E53935", bg: "#FFEBEE" },
      contrat_created: { label: "Contrat créé", cat: "docs", color: "#4CAF50", bg: "#E8F5E9" },
      contrat_updated: { label: "Contrat modifié", cat: "docs", color: "#1A73E8", bg: "#E3F2FD" },
      contrat_deleted: { label: "Contrat supprimé", cat: "docs", color: "#E53935", bg: "#FFEBEE" },
      cooptation_created: { label: "Cooptation créée", cat: "collabs", color: "#E91E8C", bg: "#FCE4EC" },
      cooptation_updated: { label: "Cooptation modifiée", cat: "collabs", color: "#1A73E8", bg: "#E3F2FD" },
      cooptation_deleted: { label: "Cooptation supprimée", cat: "collabs", color: "#E53935", bg: "#FFEBEE" },
      groupe_created: { label: "Groupe créé", cat: "collabs", color: "#4CAF50", bg: "#E8F5E9" },
      groupe_updated: { label: "Groupe modifié", cat: "collabs", color: "#1A73E8", bg: "#E3F2FD" },
      groupe_deleted: { label: "Groupe supprimé", cat: "collabs", color: "#E53935", bg: "#FFEBEE" },
      emailtemplate_created: { label: "Template email créé", cat: "settings", color: "#4CAF50", bg: "#E8F5E9" },
      emailtemplate_updated: { label: "Template email modifié", cat: "settings", color: "#1A73E8", bg: "#E3F2FD" },
      emailtemplate_deleted: { label: "Template email supprimé", cat: "settings", color: "#E53935", bg: "#FFEBEE" },
    };

    const DEFAULT_META = { label: "Action", cat: "settings", color: "#607D8B", bg: "#ECEFF1" };

    // Load entries from API
    if (!auditLoaded) {
      setAuditLoaded(true);
      getAuditLogs({ limit: 200 }).then(setAuditEntries).catch(() => {});
    }

    const reload = () => {
      setAuditLoaded(false);
      getAuditLogs({ category: auditFilter !== "all" ? auditFilter : undefined, search: auditSearch || undefined, limit: 200 })
        .then(setAuditEntries).catch(() => {});
      setAuditLoaded(true);
    };

    const filterTabs: { key: string; label: string }[] = [
      { key: "all", label: t('audit.all') },
      { key: "collabs", label: t('audit.collabs') },
      { key: "docs", label: t('audit.docs') },
      { key: "parcours", label: t('audit.parcours') },
      { key: "settings", label: t('audit.settings') },
      { key: "roles", label: t('audit.roles') },
    ];

    const entries: any[] = auditEntries || [];
    const search = auditSearch.toLowerCase();
    const filtered = entries.filter((e: any) => {
      const meta = ACTION_META[e.action] || DEFAULT_META;
      if (auditFilter !== "all" && meta.cat !== auditFilter) return false;
      if (search && !(e.description || "").toLowerCase().includes(search) && !(e.user_name || "").toLowerCase().includes(search) && !(e.entity_label || "").toLowerCase().includes(search)) return false;
      return true;
    });
    const visible = filtered.slice(0, visibleCount);

    const fmtTs = (ts: string) => {
      const d = new Date(ts);
      const pad = (n: number) => n.toString().padStart(2, "0");
      return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
    };

    const borderColor = (action: string) => {
      const cat = (ACTION_META[action] || DEFAULT_META).cat;
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
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={reload}
              className="iz-btn-outline" style={{ ...sBtn("outline"), display: "flex", alignItems: "center", gap: 6 }}>
              <RefreshCw size={14} /> Actualiser
            </button>
            <button onClick={async () => {
              try {
                const blob = await exportAuditLog();
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a'); a.href = url; a.download = `audit-log-${new Date().toISOString().slice(0, 10)}.json`; a.click(); URL.revokeObjectURL(url);
                addToast_admin(t('audit.export'));
              } catch { addToast_admin("Erreur d'export"); }
            }}
              className="iz-btn-pink" style={{ ...sBtn("pink"), display: "flex", alignItems: "center", gap: 6 }}>
              <Download size={14} /> {t('audit.export')}
            </button>
          </div>
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
            <div style={{ fontSize: 14 }}>{entries.length === 0 ? "Aucune activité enregistrée" : t('audit.no_entries')}</div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {visible.map((entry: any, idx: number) => {
              const meta = ACTION_META[entry.action] || DEFAULT_META;
              const isExpanded = expandedEntry === entry.id;
              return (
                <div key={entry.id}
                  onClick={() => setExpandedEntry(isExpanded ? null : entry.id)}
                  style={{
                    cursor: "pointer", padding: "14px 20px", borderLeft: `4px solid ${borderColor(entry.action)}`,
                    background: isExpanded ? colorWithAlpha(meta.color, 0.04) : (idx % 2 === 0 ? C.white : C.bg),
                    borderBottom: `1px solid ${C.border}`, transition: "background 0.15s",
                  }}
                  onMouseOver={e => { if (!isExpanded) e.currentTarget.style.background = colorWithAlpha(meta.color, 0.04); }}
                  onMouseOut={e => { if (!isExpanded) e.currentTarget.style.background = idx % 2 === 0 ? C.white : C.bg; }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}>
                      <span style={{
                        fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 99,
                        background: meta.bg, color: meta.color, whiteSpace: "nowrap",
                      }}>{meta.label}</span>
                      <span style={{ fontSize: 13, color: C.text, flex: 1 }}>{entry.description || entry.entity_label || entry.action}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 16, flexShrink: 0 }}>
                      <span style={{ fontSize: 11, color: C.textMuted, whiteSpace: "nowrap" }}>
                        <Clock size={11} style={{ verticalAlign: "middle", marginRight: 4 }} />{fmtTs(entry.created_at)}
                      </span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: C.textLight, minWidth: 120, textAlign: "right" }}>{entry.user_name || "—"}</span>
                      <ChevronRight size={14} color={C.textMuted} style={{ transform: isExpanded ? "rotate(90deg)" : "none", transition: "transform 0.2s" }} />
                    </div>
                  </div>
                  {isExpanded && (
                    <div style={{ marginTop: 12, padding: "12px 16px", background: C.bg, borderRadius: 8, fontSize: 12, fontFamily: "monospace", color: C.textLight, lineHeight: 1.8 }}>
                      {entry.ip_address && <div><span style={{ color: C.pink, fontWeight: 600 }}>"ip"</span>: <span style={{ color: C.blue }}>"{entry.ip_address}"</span></div>}
                      <div><span style={{ color: C.pink, fontWeight: 600 }}>"action"</span>: <span style={{ color: C.blue }}>"{entry.action}"</span></div>
                      {entry.entity_type && <div><span style={{ color: C.pink, fontWeight: 600 }}>"entity"</span>: <span style={{ color: C.blue }}>"{entry.entity_type}#{entry.entity_id}"</span></div>}
                      <div><span style={{ color: C.pink, fontWeight: 600 }}>"user"</span>: <span style={{ color: C.blue }}>"{entry.user_name}"</span></div>
                      <div><span style={{ color: C.pink, fontWeight: 600 }}>"timestamp"</span>: <span style={{ color: C.blue }}>"{entry.created_at}"</span></div>
                      {entry.old_values && Object.keys(entry.old_values).length > 0 && (
                        <div style={{ marginTop: 8 }}>
                          <div style={{ fontWeight: 600, color: C.red, marginBottom: 4 }}>Anciennes valeurs :</div>
                          {Object.entries(entry.old_values).map(([k, v]) => (
                            <div key={k} style={{ paddingLeft: 12 }}><span style={{ color: C.textMuted }}>{k}:</span> <span style={{ color: C.red }}>{String(v)}</span></div>
                          ))}
                        </div>
                      )}
                      {entry.new_values && Object.keys(entry.new_values).length > 0 && (
                        <div style={{ marginTop: 8 }}>
                          <div style={{ fontWeight: 600, color: C.green, marginBottom: 4 }}>Nouvelles valeurs :</div>
                          {Object.entries(entry.new_values).map(([k, v]) => (
                            <div key={k} style={{ paddingLeft: 12 }}><span style={{ color: C.textMuted }}>{k}:</span> <span style={{ color: C.green }}>{String(v)}</span></div>
                          ))}
                        </div>
                      )}
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
            <button onClick={() => setVisibleCount((v: number) => v + 15)}
              style={{ ...sBtn("outline"), fontSize: 13, padding: "10px 28px", color: C.pink, border: `1px solid ${C.pink}`, borderRadius: 8 }}>
              Voir plus ({filtered.length - visibleCount} restants)
            </button>
          </div>
        )}

        {/* Summary bar */}
        <div style={{ display: "flex", gap: 12, marginTop: 24, flexWrap: "wrap" }}>
          {filterTabs.filter(f => f.key !== "all").map(ft => {
            const count = entries.filter((e: any) => (ACTION_META[e.action] || DEFAULT_META).cat === ft.key).length;
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
