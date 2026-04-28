import { Fragment } from 'react';
import { t } from '../../i18n';
import { C, colorWithAlpha, sCard, sBtn, sInput } from '../../constants';
import {
  Search, Users, Building2, ListChecks, ChevronDown, ChevronRight, User,
} from 'lucide-react';
import type { Collaborateur } from '../../types';

interface OrgNode {
  collab: Collaborateur;
  children: OrgNode[];
}

export function createAdminOrgChart(ctx: any) {
  const {
    COLLABORATEURS,
    orgView, setOrgView, orgSearch, setOrgSearch,
    orgExpandedNodes, setOrgExpandedNodes,
    orgSortCol, setOrgSortCol, orgSortDir, setOrgSortDir,
  } = ctx;

  return function renderAdminOrgChart() {
    const collabs: Collaborateur[] = COLLABORATEURS;

    // ── Build real hierarchy from manager_id ──
    const collabMap = new Map<number, Collaborateur>();
    collabs.forEach(c => collabMap.set(c.id, c));

    // Find children for each person
    const childrenMap = new Map<number, Collaborateur[]>();
    const hasParent = new Set<number>();

    collabs.forEach(c => {
      const mgrId = (c as any).manager_id;
      if (mgrId && collabMap.has(mgrId)) {
        hasParent.add(c.id);
        if (!childrenMap.has(mgrId)) childrenMap.set(mgrId, []);
        childrenMap.get(mgrId)!.push(c);
      }
    });

    // Root nodes = people without a manager (or whose manager is not in the list)
    const roots = collabs.filter(c => !hasParent.has(c.id));

    // Build tree recursively
    const buildTree = (collab: Collaborateur): OrgNode => ({
      collab,
      children: (childrenMap.get(collab.id) || []).map(buildTree),
    });
    const tree: OrgNode[] = roots.map(buildTree);

    // Department colors
    const departments = [...new Set(collabs.map(c => c.departement).filter(Boolean))];
    const palette = ["#1A73E8", "#E53935", "#F9A825", "#4CAF50", "#7B5EA7", "#00897B", "#FF6B35", "#E91E8C", "#3F51B5", "#009688"];
    const DEPT_COLORS: Record<string, string> = {};
    departments.forEach((d, i) => { DEPT_COLORS[d] = palette[i % palette.length]; });

    // Search
    const search = orgSearch.toLowerCase();
    const matchesSearch = (c: Collaborateur) => !search || `${c.prenom} ${c.nom} ${c.poste} ${c.departement}`.toLowerCase().includes(search);

    // Check if a node or any descendant matches search
    const treeMatchesSearch = (node: OrgNode): boolean => {
      if (matchesSearch(node.collab)) return true;
      return node.children.some(treeMatchesSearch);
    };

    const toggleNode = (id: string) => {
      setOrgExpandedNodes((prev: string[]) => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };

    // Count all reports (direct + indirect)
    const countReports = (node: OrgNode): number => {
      let count = node.children.length;
      node.children.forEach(ch => { count += countReports(ch); });
      return count;
    };

    // Get manager name for a collaborateur
    const getManagerName = (c: Collaborateur): string | null => {
      const mgrId = (c as any).manager_id;
      if (!mgrId) return null;
      const mgr = collabMap.get(mgrId);
      return mgr ? `${mgr.prenom} ${mgr.nom}` : null;
    };

    // ── Render a tree node recursively ──
    const renderTreeNode = (node: OrgNode, depth: number = 0, isLast: boolean = true) => {
      const c = node.collab;
      const nodeId = `node_${c.id}`;
      const isExpanded = orgExpandedNodes.includes(nodeId);
      const hasChildren = node.children.length > 0;
      const totalReports = countReports(node);
      const isRoot = depth === 0;
      const highlighted = search && matchesSearch(c);
      const deptColor = DEPT_COLORS[c.departement] || C.blue;

      if (search && !treeMatchesSearch(node)) return null;

      return (
        <div key={c.id} style={{ display: "flex", flexDirection: "column", alignItems: depth === 0 ? "center" : "flex-start" }}>
          {/* Vertical connector from parent */}
          {depth > 0 && <div style={{ width: 2, height: 16, background: C.border, marginLeft: 28 }} />}

          {/* Node card */}
          <div
            onClick={() => hasChildren && toggleNode(nodeId)}
            style={{
              cursor: hasChildren ? "pointer" : "default",
              background: isRoot ? `linear-gradient(135deg, ${C.pink}, ${C.blue})` : C.white,
              borderRadius: 12, padding: isRoot ? "16px 24px" : "10px 16px",
              minWidth: isRoot ? 220 : 200,
              border: isRoot ? "none" : `2px solid ${highlighted ? C.pink : C.border}`,
              boxShadow: highlighted ? `0 0 12px ${colorWithAlpha(C.pink, 0.3)}` : isRoot ? "0 4px 16px rgba(0,0,0,0.12)" : "0 1px 4px rgba(0,0,0,0.06)",
              display: "flex", alignItems: "center", gap: 12, transition: "all 0.2s",
              color: isRoot ? "#fff" : C.text,
            }}
          >
            <div style={{
              width: isRoot ? 44 : 36, height: isRoot ? 44 : 36, borderRadius: "50%", flexShrink: 0,
              background: isRoot ? "rgba(255,255,255,0.25)" : c.color || deptColor,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontWeight: 700, fontSize: isRoot ? 16 : 12,
              border: hasChildren && !isRoot ? `2px solid ${deptColor}` : "none",
            }}>
              {c.initials || `${(c.prenom || '')[0]}${(c.nom || '')[0]}`}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: isRoot ? 15 : 13 }}>{c.prenom} {c.nom}</div>
              <div style={{ fontSize: 11, opacity: isRoot ? 0.85 : 1, color: isRoot ? "#fff" : C.textLight }}>{c.poste || c.departement}</div>
              {hasChildren && (
                <div style={{ fontSize: 10, opacity: 0.7, marginTop: 2, display: "flex", alignItems: "center", gap: 4 }}>
                  {isExpanded ? <ChevronDown size={10} /> : <ChevronRight size={10} />}
                  {totalReports} collaborateur{totalReports > 1 ? 's' : ''}
                </div>
              )}
            </div>
            {!isRoot && c.departement && (
              <span style={{
                fontSize: 9, padding: "2px 6px", borderRadius: 99, fontWeight: 600, flexShrink: 0,
                background: colorWithAlpha(deptColor, 0.12), color: deptColor,
              }}>{c.departement}</span>
            )}
          </div>

          {/* Children */}
          {isExpanded && hasChildren && (
            <div style={{ paddingLeft: depth === 0 ? 0 : 28, display: "flex", flexDirection: depth === 0 ? "row" : "column", gap: depth === 0 ? 16 : 0, flexWrap: "wrap", justifyContent: depth === 0 ? "center" : "flex-start", marginTop: depth === 0 ? 8 : 0 }}>
              {depth === 0 && <div style={{ width: "100%", display: "flex", justifyContent: "center" }}><div style={{ width: 2, height: 16, background: C.border }} /></div>}
              {node.children.map((child, i) => (
                <Fragment key={child.collab.id}>
                  {renderTreeNode(child, depth + 1, i === node.children.length - 1)}
                </Fragment>
              ))}
            </div>
          )}
        </div>
      );
    };

    // ── View tabs ──
    const viewTabs: { key: "tree" | "list" | "dept"; label: string; icon: any }[] = [
      { key: "tree", label: t('org.view_tree'), icon: Users },
      { key: "list", label: t('org.view_list'), icon: ListChecks },
      { key: "dept", label: t('org.view_dept'), icon: Building2 },
    ];

    // ── Department map for dept view ──
    const deptMap: Record<string, Collaborateur[]> = {};
    collabs.forEach(c => {
      const d = c.departement || 'Sans département';
      if (!deptMap[d]) deptMap[d] = [];
      deptMap[d].push(c);
    });

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
        {orgView === "tree" && collabs.length === 0 && (
          <div style={{ padding: "60px 20px", textAlign: "center", color: C.textMuted }}>
            <Users size={48} color={C.border} style={{ marginBottom: 16 }} />
            <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 4 }}>Aucun collaborateur</div>
            <div style={{ fontSize: 13 }}>Ajoutez des collaborateurs pour voir l'organigramme.</div>
          </div>
        )}
        {orgView === "tree" && collabs.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
            {tree.length === 0 ? (
              <div style={{ padding: "40px 20px", textAlign: "center", color: C.textMuted, fontSize: 13 }}>
                Aucun collaborateur sans manager trouvé. Vérifiez les relations manager.
              </div>
            ) : tree.length === 1 ? (
              // Single root — clean single-tree display
              renderTreeNode(tree[0], 0)
            ) : (
              // Multiple roots — show each as a separate tree
              <div style={{ display: "flex", gap: 32, flexWrap: "wrap", justifyContent: "center", alignItems: "flex-start" }}>
                {tree.map(node => (
                  <div key={node.collab.id}>
                    {renderTreeNode(node, 0)}
                  </div>
                ))}
              </div>
            )}

            {/* Info banner if no manager_id set */}
            {collabs.length > 0 && collabs.every((c: any) => !c.manager_id) && (
              <div style={{ marginTop: 24, padding: "12px 20px", borderRadius: 10, background: "#FFF3E0", border: "1px solid #FFE0B2", fontSize: 12, color: "#E65100", maxWidth: 500, textAlign: "center" }}>
                <strong>Conseil :</strong> Assignez un manager à chaque collaborateur (champ "Manager" dans la fiche collaborateur) pour construire une hiérarchie réelle.
              </div>
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
            { key: "nom", label: "Nom", render: (c: Collaborateur) => (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: c.color || C.pink, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 10 }}>{c.initials || `${(c.prenom||'')[0]}${(c.nom||'')[0]}`}</div>
                <span style={{ fontWeight: 600 }}>{c.prenom} {c.nom}</span>
              </div>
            )},
            { key: "poste", label: "Poste", render: (c: Collaborateur) => c.poste || <span style={{ color: C.textMuted }}>—</span> },
            { key: "departement", label: t('org.department'), render: (c: Collaborateur) => c.departement ? (
              <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 99, fontWeight: 600, background: colorWithAlpha(DEPT_COLORS[c.departement] || C.blue, 0.12), color: DEPT_COLORS[c.departement] || C.blue }}>{c.departement}</span>
            ) : <span style={{ color: C.textMuted }}>—</span> },
            { key: "site", label: "Site", render: (c: Collaborateur) => c.site || <span style={{ color: C.textMuted }}>—</span> },
            { key: "manager", label: "Manager", render: (c: Collaborateur) => {
              const name = getManagerName(c);
              return name ? (
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <User size={11} color={C.textMuted} />
                  <span>{name}</span>
                </div>
              ) : <span style={{ color: C.textMuted, fontStyle: "italic" }}>{t('org.no_manager')}</span>;
            }},
            { key: "status", label: "Statut", render: (c: Collaborateur) => {
              const colors: Record<string, { bg: string; fg: string; label: string }> = {
                pre_onboarding: { bg: "#F3E5F5", fg: "#7B1FA2", label: "Pré-onboarding" },
                en_cours: { bg: "#E3F2FD", fg: "#1A73E8", label: "En cours" },
                en_retard: { bg: "#FFF3E0", fg: "#E65100", label: "En retard" },
                termine: { bg: "#E8F5E9", fg: "#2E7D32", label: "Terminé" },
              };
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
            {Object.keys(deptMap).map(dept => {
              const members = deptMap[dept].filter(matchesSearch);
              if (search && members.length === 0) return null;
              const deptColor = DEPT_COLORS[dept] || C.blue;
              // Find actual managers in this department (those who have direct reports)
              const deptManagerIds = new Set<number>();
              members.forEach(m => {
                if (childrenMap.has(m.id)) deptManagerIds.add(m.id);
              });
              return (
                <div key={dept} className="iz-card" style={{ ...sCard, overflow: "hidden" }}>
                  <div style={{ padding: "14px 20px", background: colorWithAlpha(deptColor, 0.08), borderBottom: `2px solid ${deptColor}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <Building2 size={18} color={deptColor} />
                      <span style={{ fontWeight: 700, fontSize: 15, color: deptColor }}>{dept}</span>
                    </div>
                    <span style={{ fontSize: 12, color: C.textMuted }}>{members.length} {t('org.employees')}</span>
                  </div>
                  <div style={{ padding: 16, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
                    {members.map(c => {
                      const isManager = deptManagerIds.has(c.id);
                      const mgrName = getManagerName(c);
                      return (
                        <div key={c.id} style={{
                          background: C.white, borderRadius: 10, padding: "14px 16px", border: `1px solid ${C.border}`,
                          display: "flex", alignItems: "center", gap: 12,
                          boxShadow: isManager ? `0 0 0 2px ${colorWithAlpha(deptColor, 0.3)}` : "none",
                        }}>
                          <div style={{
                            width: 36, height: 36, borderRadius: "50%", background: c.color || deptColor, display: "flex",
                            alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 12,
                            border: isManager ? `2px solid ${deptColor}` : "none",
                          }}>{c.initials || `${(c.prenom||'')[0]}${(c.nom||'')[0]}`}</div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 600, fontSize: 13 }}>{c.prenom} {c.nom}</div>
                            <div style={{ fontSize: 11, color: C.textLight }}>{c.poste}</div>
                            {isManager && <div style={{ fontSize: 10, color: deptColor, fontWeight: 600, marginTop: 1 }}>Manager</div>}
                            {!isManager && mgrName && <div style={{ fontSize: 10, color: C.textMuted, marginTop: 1 }}>→ {mgrName}</div>}
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
      </div>
    );
  };
}
