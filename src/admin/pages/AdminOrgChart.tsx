import { Fragment } from 'react';
import { t } from '../../i18n';
import { C, colorWithAlpha, font, sCard, sBtn, sInput } from '../../constants';
import {
  Search, Users, Building2, ListChecks, ChevronLeft,
} from 'lucide-react';
import type { Collaborateur } from '../../types';

export function createAdminOrgChart(ctx: any) {
  const {
    COLLABORATEURS,
    orgView, setOrgView, orgSearch, setOrgSearch,
    orgExpandedNodes, setOrgExpandedNodes,
    orgSortCol, setOrgSortCol, orgSortDir, setOrgSortDir,
  } = ctx;

  return function renderAdminOrgChart() {
    const collabs: Collaborateur[] = COLLABORATEURS;

    // Group by department, first person per dept = manager
    const deptMap: Record<string, Collaborateur[]> = {};
    collabs.forEach(c => {
      if (!deptMap[c.departement]) deptMap[c.departement] = [];
      deptMap[c.departement].push(c);
    });
    const departments = Object.keys(deptMap);
    const DEPT_COLORS: Record<string, string> = {};
    const palette = ["#1A73E8", "#E53935", "#F9A825", "#4CAF50", "#7B5EA7", "#00897B", "#FF6B35", "#E91E8C", "#3F51B5", "#009688"];
    departments.forEach((d, i) => { DEPT_COLORS[d] = palette[i % palette.length]; });

    const search = orgSearch.toLowerCase();
    const matchesSearch = (c: Collaborateur) => !search || `${c.prenom} ${c.nom} ${c.poste} ${c.departement}`.toLowerCase().includes(search);

    const toggleNode = (id: string) => {
      setOrgExpandedNodes((prev: string[]) => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };

    const renderNodeCard = (c: Collaborateur, isManager: boolean = false) => {
      const highlighted = search && matchesSearch(c);
      return (
        <div key={c.id} style={{
          background: C.white, borderRadius: 12, padding: "12px 16px", minWidth: 180,
          border: `2px solid ${highlighted ? C.pink : C.border}`,
          boxShadow: highlighted ? `0 0 12px ${colorWithAlpha(C.pink, 0.3)}` : "0 1px 4px rgba(0,0,0,0.06)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 6, transition: "all 0.2s",
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: "50%", background: c.color, display: "flex",
            alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 14,
            border: isManager ? `3px solid ${DEPT_COLORS[c.departement] || C.blue}` : "none",
          }}>{c.initials}</div>
          <div style={{ fontWeight: 600, fontSize: 13, textAlign: "center" }}>{c.prenom} {c.nom}</div>
          <div style={{ fontSize: 11, color: C.textLight, textAlign: "center" }}>{c.poste}</div>
          <span style={{
            fontSize: 10, padding: "2px 8px", borderRadius: 99, fontWeight: 600,
            background: colorWithAlpha(DEPT_COLORS[c.departement] || C.blue, 0.12),
            color: DEPT_COLORS[c.departement] || C.blue,
          }}>{c.departement}</span>
        </div>
      );
    };

    const viewTabs: { key: "tree" | "list" | "dept"; label: string; icon: any }[] = [
      { key: "tree", label: t('org.view_tree'), icon: Users },
      { key: "list", label: t('org.view_list'), icon: ListChecks },
      { key: "dept", label: t('org.view_dept'), icon: Building2 },
    ];

    return (
      <div style={{ flex: 1, padding: "24px 32px", overflow: "auto" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 600, margin: 0 }}>{t('org.title')}</h1>
            <p style={{ fontSize: 12, color: C.textLight, margin: "4px 0 0" }}>{t('org.desc')}</p>
          </div>
        </div>

        {/* Toolbar */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <div style={{ position: "relative", flex: 1, maxWidth: 320 }}>
            <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: C.textMuted }} />
            <input value={orgSearch} onChange={e => setOrgSearch(e.target.value)} placeholder={t('org.search')}
              style={{ ...sInput, paddingLeft: 32, width: "100%" }} />
          </div>
          <div style={{ display: "flex", background: C.bg, borderRadius: 8, padding: 3 }}>
            {viewTabs.map(vt => (
              <button key={vt.key} onClick={() => setOrgView(vt.key)}
                style={{
                  ...(orgView === vt.key ? sBtn("pink") : {}), fontSize: 12, padding: "6px 14px",
                  display: "flex", alignItems: "center", gap: 5, border: "none", borderRadius: 6, cursor: "pointer",
                  background: orgView === vt.key ? C.pink : "transparent",
                  color: orgView === vt.key ? "#fff" : C.text,
                }}>
                <vt.icon size={13} /> {vt.label}
              </button>
            ))}
          </div>
          <div style={{ fontSize: 12, color: C.textMuted }}>{collabs.length} {t('org.employees')}</div>
        </div>

        {/* TREE VIEW */}
        {orgView === "tree" && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
            {/* CEO Node */}
            <div onClick={() => toggleNode("ceo")} style={{ cursor: "pointer" }}>
              <div style={{
                background: `linear-gradient(135deg, ${C.pink}, ${C.blue})`, borderRadius: 14, padding: "16px 24px",
                color: "#fff", textAlign: "center", minWidth: 200, boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
              }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px", fontWeight: 700, fontSize: 18 }}>DG</div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>Direction Generale</div>
                <div style={{ fontSize: 11, opacity: 0.85 }}>CEO</div>
                <div style={{ fontSize: 10, marginTop: 4, opacity: 0.7 }}>{departments.length} {t('org.direct_reports')}</div>
              </div>
            </div>

            {/* Connector line from CEO */}
            {orgExpandedNodes.includes("ceo") && (
              <>
                <div style={{ width: 2, height: 24, background: C.border }} />
                <div style={{ display: "flex", position: "relative", justifyContent: "center" }}>
                  {/* Horizontal connector */}
                  {departments.length > 1 && (
                    <div style={{ position: "absolute", top: 0, left: "calc(50% - " + ((departments.length - 1) * 120) + "px)", right: "calc(50% - " + ((departments.length - 1) * 120) + "px)", height: 2, background: C.border }} />
                  )}
                </div>
                <div style={{ display: "flex", gap: 24, flexWrap: "wrap", justifyContent: "center" }}>
                  {departments.map(dept => {
                    const members = deptMap[dept];
                    const manager = members[0];
                    const team = members.slice(1).filter(matchesSearch);
                    const nodeId = `dept_${dept}`;
                    const isExpanded = orgExpandedNodes.includes(nodeId);
                    const managerMatches = matchesSearch(manager);
                    if (search && !managerMatches && team.length === 0) return null;

                    return (
                      <div key={dept} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <div style={{ width: 2, height: 20, background: C.border }} />
                        <div onClick={() => toggleNode(nodeId)} style={{ cursor: "pointer", position: "relative" }}>
                          {renderNodeCard(manager, true)}
                          {members.length > 1 && (
                            <div style={{
                              position: "absolute", bottom: -8, left: "50%", transform: "translateX(-50%)",
                              background: C.pink, color: "#fff", borderRadius: 99, width: 20, height: 20,
                              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700,
                            }}>
                              {isExpanded ? <ChevronLeft size={10} style={{ transform: "rotate(-90deg)" }} /> : members.length - 1}
                            </div>
                          )}
                        </div>
                        {isExpanded && team.length > 0 && (
                          <>
                            <div style={{ width: 2, height: 16, background: C.border }} />
                            <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "center" }}>
                              {team.map(m => (
                                <Fragment key={m.id}>
                                  {renderNodeCard(m)}
                                </Fragment>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}

        {/* LIST VIEW */}
        {orgView === "list" && (() => {
          const filtered = collabs.filter(matchesSearch);
          const sortCol = orgSortCol;
          const sortDir = orgSortDir;
          const sorted = [...filtered].sort((a: any, b: any) => {
            const va = (a[sortCol] || "").toString().toLowerCase();
            const vb = (b[sortCol] || "").toString().toLowerCase();
            return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
          });
          const toggleSort = (col: string) => {
            if (sortCol === col) setOrgSortDir((d: any) => d === "asc" ? "desc" : "asc");
            else { setOrgSortCol(col); setOrgSortDir("asc"); }
          };
          const cols = [
            { key: "nom", label: "Name", render: (c: Collaborateur) => (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: c.color, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 10 }}>{c.initials}</div>
                <span style={{ fontWeight: 600 }}>{c.prenom} {c.nom}</span>
              </div>
            )},
            { key: "poste", label: "Poste", render: (c: Collaborateur) => c.poste },
            { key: "departement", label: t('org.department'), render: (c: Collaborateur) => (
              <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 99, fontWeight: 600, background: colorWithAlpha(DEPT_COLORS[c.departement] || C.blue, 0.12), color: DEPT_COLORS[c.departement] || C.blue }}>{c.departement}</span>
            )},
            { key: "site", label: "Site", render: (c: Collaborateur) => c.site },
            { key: "manager", label: "Manager", render: (c: Collaborateur) => {
              const mgr = deptMap[c.departement]?.[0];
              return mgr && mgr.id !== c.id ? `${mgr.prenom} ${mgr.nom}` : <span style={{ color: C.textMuted, fontStyle: "italic" }}>{t('org.no_manager')}</span>;
            }},
            { key: "status", label: "Status", render: (c: Collaborateur) => {
              const colors: Record<string, { bg: string; fg: string; label: string }> = { en_cours: { bg: "#E3F2FD", fg: "#1A73E8", label: "En cours" }, en_retard: { bg: "#FFF3E0", fg: "#E65100", label: "En retard" }, termine: { bg: "#E8F5E9", fg: "#2E7D32", label: "Termine" } };
              const s = colors[c.status] || colors.en_cours;
              return <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 99, fontWeight: 600, background: s.bg, color: s.fg }}>{s.label}</span>;
            }},
          ];
          return (
            <div className="iz-card" style={{ ...sCard, overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ background: C.bg }}>
                    {cols.map(col => (
                      <th key={col.key} onClick={() => toggleSort(col.key)}
                        style={{ padding: "10px 14px", textAlign: "left", fontWeight: 600, fontSize: 11, color: C.textLight, cursor: "pointer", userSelect: "none", borderBottom: `1px solid ${C.border}` }}>
                        {col.label} {sortCol === col.key ? (sortDir === "asc" ? " ↑" : " ↓") : ""}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sorted.map(c => (
                    <tr key={c.id} style={{ borderBottom: `1px solid ${C.border}` }}
                      onMouseOver={e => (e.currentTarget.style.background = C.bg)}
                      onMouseOut={e => (e.currentTarget.style.background = "transparent")}>
                      {cols.map(col => (
                        <td key={col.key} style={{ padding: "10px 14px" }}>{col.render(c)}</td>
                      ))}
                    </tr>
                  ))}
                  {sorted.length === 0 && (
                    <tr><td colSpan={cols.length} style={{ textAlign: "center", padding: 32, color: C.textMuted }}>{t('audit.no_entries')}</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          );
        })()}

        {/* DEPARTMENT VIEW */}
        {orgView === "dept" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {departments.map(dept => {
              const members = deptMap[dept].filter(matchesSearch);
              if (search && members.length === 0) return null;
              const deptColor = DEPT_COLORS[dept] || C.blue;
              return (
                <div key={dept} className="iz-card" style={{ ...sCard, overflow: "hidden" }}>
                  <div style={{ padding: "14px 20px", background: colorWithAlpha(deptColor, 0.08), borderBottom: `2px solid ${deptColor}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <Building2 size={18} color={deptColor} />
                      <span style={{ fontWeight: 700, fontSize: 15, color: deptColor }}>{dept}</span>
                    </div>
                    <span style={{ fontSize: 12, color: C.textMuted }}>{members.length} {t('org.employees')}</span>
                  </div>
                  <div style={{ padding: 16, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
                    {members.map((c, idx) => (
                      <div key={c.id} style={{
                        background: C.white, borderRadius: 10, padding: "14px 16px", border: `1px solid ${C.border}`,
                        display: "flex", alignItems: "center", gap: 12,
                        boxShadow: idx === 0 ? `0 0 0 2px ${colorWithAlpha(deptColor, 0.3)}` : "none",
                      }}>
                        <div style={{
                          width: 36, height: 36, borderRadius: "50%", background: c.color, display: "flex",
                          alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 12,
                          border: idx === 0 ? `2px solid ${deptColor}` : "none",
                        }}>{c.initials}</div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 13 }}>{c.prenom} {c.nom}</div>
                          <div style={{ fontSize: 11, color: C.textLight }}>{c.poste}</div>
                          {idx === 0 && <div style={{ fontSize: 10, color: deptColor, fontWeight: 600, marginTop: 2 }}>Manager</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };
}
