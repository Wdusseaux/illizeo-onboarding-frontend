import { t } from '../../i18n';
import { C, font, sCard, sBtn, sInput } from '../../constants';
import {
  Plus, X, Download, Search, Users, Building2, FolderOpen, MapPin, Landmark,
  EyeOff, Eye, AlertTriangle, ShieldCheck, Settings, XCircle, Check, Target, Trash, ChevronRight, KeyRound, Lock, RotateCcw, Timer,
} from 'lucide-react';
import {
  getRoles, createRole as apiCreateRole, updateRole as apiUpdateRole, deleteRole as apiDeleteRole,
  assignRoleUser, removeRoleUser, duplicateRole as apiDuplicateRole, getPermissionLogs,
} from '../../api/endpoints';

export function createAdminRoles(ctx: any) {
  const {
    lang,
    adminUsers, adminRoles, setAdminRoles,
    rolePanelMode, setRolePanelMode, rolePanelData, setRolePanelData,
    roleTab, setRoleTab, selectedRoleId, setSelectedRoleId,
    permMatrixFilter, setPermMatrixFilter,
    visibleRoleIds, setVisibleRoleIds, rolesDropdownOpen, setRolesDropdownOpen, effectivePermUserId, setEffectivePermUserId,
    permissionLogs, setPermissionLogs, securitySubTab, setSecuritySubTab,
    auditVisibleCount, setAuditVisibleCount,
    addToast_admin, showConfirm, showPrompt,
  } = ctx;

  return function renderAdminRoles() {
    const PERM_MODULES = [
      { key: "parcours", label: t('perm.parcours'), section: "management" },
      { key: "collaborateurs", label: t('perm.collaborateurs'), section: "management" },
      { key: "documents", label: t('perm.documents'), section: "management" },
      { key: "equipements", label: t('perm.equipements'), section: "content" },
      { key: "nps", label: t('perm.nps'), section: "content" },
      { key: "workflows", label: t('perm.workflows'), section: "automation" },
      { key: "company_page", label: t('perm.company_page'), section: "content" },
      { key: "cooptation", label: t('perm.cooptation'), section: "content" },
      { key: "contrats", label: t('perm.contrats'), section: "content" },
      { key: "signatures", label: t('perm.signatures'), section: "content" },
      { key: "gamification", label: t('perm.gamification'), section: "content" },
      { key: "integrations", label: t('perm.integrations'), section: "settings" },
      { key: "settings", label: t('perm.settings'), section: "settings" },
      { key: "reports", label: t('perm.reports'), section: "settings" },
    ];
    const PERM_LEVELS = ["admin", "edit", "view", "none"] as const;
    const PERM_LEVEL_META: Record<string, { label: string; color: string; bg: string }> = {
      admin: { label: t('roles.perm_admin'), color: "#E53935", bg: "#FFEBEE" },
      edit: { label: t('roles.perm_edit'), color: "#F9A825", bg: "#FFF8E1" },
      view: { label: t('roles.perm_view'), color: "#1A73E8", bg: "#E3F2FD" },
      none: { label: t('roles.perm_none'), color: C.textMuted, bg: C.bg },
    };
    const SECTIONS: Record<string, string> = { management: "Management", automation: "Automation", content: "Content", settings: "Settings" };

    const reloadRoles = () => { getRoles().then(setAdminRoles).catch(() => {}); };
    const selectedRole = adminRoles.find(r => r.id === selectedRoleId);
    const filteredModules = PERM_MODULES.filter(m => !permMatrixFilter || m.label.toLowerCase().includes(permMatrixFilter.toLowerCase()));
    const displayedRoles = visibleRoleIds.length === 0 ? adminRoles : adminRoles.filter(r => visibleRoleIds.includes(r.id));

    const cyclePerm = async (roleId: number, moduleKey: string, currentLevel: string) => {
      const idx = PERM_LEVELS.indexOf(currentLevel as any);
      const next = PERM_LEVELS[(idx + 1) % PERM_LEVELS.length];
      const role = adminRoles.find(r => r.id === roleId);
      if (!role) return;
      const newPerms = { ...role.permissions, [moduleKey]: next };
      try {
        await apiUpdateRole(roleId, { permissions: newPerms });
        setAdminRoles(prev => prev.map(r => r.id === roleId ? { ...r, permissions: newPerms } : r));
      } catch { addToast_admin(t('toast.error')); }
    };

    return (
      <div style={{ flex: 1, padding: "24px 32px", overflow: "auto" }}>
        {/* Header */}
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ fontSize: 22, fontWeight: 600, margin: 0 }}>{t('roles.title')}</h1>
          <p style={{ fontSize: 12, color: C.textLight, margin: "4px 0 0" }}>{t('roles.desc')}</p>
        </div>

        {/* Role cards */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
          {adminRoles.map(role => (
            <div key={role.id} onClick={() => setSelectedRoleId(role.id === selectedRoleId ? null : role.id)}
              className="iz-card" style={{
                ...sCard, padding: "12px 16px", cursor: "pointer", minWidth: 160, maxWidth: 220, position: "relative",
                border: selectedRoleId === role.id ? `2px solid ${role.couleur}` : `2px solid transparent`,
                opacity: role.actif ? 1 : 0.5,
              }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: role.couleur }} />
                <span style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{role.nom}</span>
                {role.is_system && <span style={{ fontSize: 8, padding: "1px 5px", borderRadius: 3, background: role.couleur + "20", color: role.couleur, fontWeight: 700, textTransform: "uppercase" }}>{t('roles.system')}</span>}
                {role.users_count > 0 && <span style={{ fontSize: 10, fontWeight: 600, color: C.white, background: role.couleur, borderRadius: "50%", width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center", marginLeft: "auto" }}>{role.users_count}</span>}
              </div>
              <div style={{ fontSize: 11, color: C.textLight, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{role.description || "—"}</div>
              {selectedRoleId === role.id && (
                <div style={{ display: "flex", gap: 6, marginTop: 8, fontSize: 10 }} onClick={e => e.stopPropagation()}>
                  <button title={t('roles.duplicate')} onClick={async () => { try { await apiDuplicateRole(role.id); reloadRoles(); addToast_admin(t('roles.duplicated')); } catch { addToast_admin(t('toast.error')); } }} style={{ background: C.bg, border: "none", borderRadius: 6, cursor: "pointer", padding: 4, display: "flex", alignItems: "center", justifyContent: "center" }}><FolderOpen size={13} color={C.pink} /></button>
                  {!role.is_system && <button title={t('common.delete')} onClick={() => showConfirm(t('roles.delete_confirm'), async () => { try { await apiDeleteRole(role.id); reloadRoles(); setSelectedRoleId(null); addToast_admin(t('roles.deleted')); } catch { addToast_admin(t('toast.error')); } })} style={{ background: C.bg, border: "none", borderRadius: 6, cursor: "pointer", padding: 4, display: "flex", alignItems: "center", justifyContent: "center" }}><Trash size={13} color={C.red} /></button>}
                  <button title={role.actif ? t('roles.deactivate') : t('roles.activate')} onClick={async () => { try { await apiUpdateRole(role.id, { actif: !role.actif }); reloadRoles(); } catch {} }} style={{ background: C.bg, border: "none", borderRadius: 6, cursor: "pointer", padding: 4, display: "flex", alignItems: "center", justifyContent: "center" }}>{role.actif ? <EyeOff size={13} color={C.textMuted} /> : <Eye size={13} color={C.green} />}</button>
                </div>
              )}
            </div>
          ))}
          {/* New role button */}
          <div onClick={() => { setRolePanelData({ nom: "", slug: "", description: "", couleur: "#C2185B", permissions: Object.fromEntries(PERM_MODULES.map(m => [m.key, "none"])), scope_type: "global" }); setRolePanelMode("create"); }}
            style={{ minWidth: 120, padding: "16px", border: `2px dashed ${C.border}`, borderRadius: 12, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, transition: "all .2s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.pink; }} onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; }}>
            <Plus size={20} color={C.textMuted} />
            <span style={{ fontSize: 11, color: C.textMuted }}>{t('roles.new')}</span>
          </div>
        </div>

        {/* Selected role detail */}
        {selectedRole && (
          <div className="iz-card" style={{ ...sCard, marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 20px", borderBottom: `1px solid ${C.border}` }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: selectedRole.couleur }} />
              <h2 style={{ fontSize: 16, fontWeight: 600, margin: 0, color: selectedRole.couleur }}>{selectedRole.nom}</h2>
              <div style={{ marginLeft: "auto", display: "flex", gap: 0 }}>
                {(["scope", "exclusions", "members", "security", "history"] as const).map(tab => (
                  <button key={tab} onClick={() => setRoleTab(tab)} style={{ padding: "8px 16px", fontSize: 12, fontWeight: roleTab === tab ? 600 : 400, color: roleTab === tab ? C.pink : C.textLight, background: "none", border: "none", borderBottom: roleTab === tab ? `2px solid ${C.pink}` : "2px solid transparent", cursor: "pointer", fontFamily: font }}>
                    {tab === "scope" ? t('roles.scope') : tab === "exclusions" ? t('roles.exclusions') : tab === "members" ? `${t('roles.members')} (${selectedRole.users_count || 0})` : tab === "security" ? t('roles.security') : t('roles.history')}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ padding: "20px" }}>
              {/* -- SCOPE TAB -- */}
              {roleTab === "scope" && (
                <div>
                  <div style={{ padding: "12px 16px", background: selectedRole.temporary ? "#FFF8E1" : C.bg, borderRadius: 8, marginBottom: 12, border: selectedRole.temporary ? "1.5px solid #F9A825" : "1.5px solid transparent" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <EyeOff size={14} color={selectedRole.temporary ? "#F9A825" : C.textMuted} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: selectedRole.temporary ? "#F9A825" : C.text }}>{t('roles.temporary')}</div>
                        <div style={{ fontSize: 10, color: C.textMuted }}>{t('roles.temporary_desc')}</div>
                      </div>
                      <div onClick={async () => { await apiUpdateRole(selectedRole.id, { temporary: !selectedRole.temporary }); reloadRoles(); }}
                        style={{ width: 40, height: 22, borderRadius: 11, background: selectedRole.temporary ? "#F9A825" : C.border, cursor: "pointer", position: "relative", transition: "all .2s" }}>
                        <div style={{ width: 18, height: 18, borderRadius: 9, background: C.white, position: "absolute", top: 2, left: selectedRole.temporary ? 20 : 2, transition: "all .2s", boxShadow: "0 1px 3px rgba(0,0,0,.2)" }} />
                      </div>
                    </div>
                    {selectedRole.temporary && (
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12, paddingTop: 12, borderTop: "1px solid #F9A82530" }}>
                        <div>
                          <label style={{ fontSize: 11, fontWeight: 600, color: C.text, display: "block", marginBottom: 4 }}>{lang === "fr" ? "Date de début" : "Start date"}</label>
                          <input type="date" defaultValue={new Date().toISOString().slice(0, 10)} onChange={async (e) => { await apiUpdateRole(selectedRole.id, { starts_at: e.target.value }); }} style={{ ...sInput, fontSize: 12 }} />
                        </div>
                        <div>
                          <label style={{ fontSize: 11, fontWeight: 600, color: C.text, display: "block", marginBottom: 4 }}>{lang === "fr" ? "Date de fin (auto-désactivation)" : "End date (auto-deactivation)"}</label>
                          <input type="date" defaultValue={selectedRole.expires_at ? new Date(selectedRole.expires_at).toISOString().slice(0, 10) : ""} onChange={async (e) => { await apiUpdateRole(selectedRole.id, { expires_at: e.target.value }); reloadRoles(); }} style={{ ...sInput, fontSize: 12 }} />
                        </div>
                      </div>
                    )}
                  </div>
                  {(() => {
                    const impactOpen = (selectedRole as any)._impactOpen;
                    const affectedUsers = (selectedRole.users || []);
                    const count = selectedRole.users_count || affectedUsers.length;
                    return (
                      <div style={{ marginBottom: 16, border: `1.5px solid #1A73E830`, borderRadius: 8, overflow: "hidden" }}>
                        <div onClick={() => { const updated = adminRoles.map(r => r.id === selectedRole.id ? { ...r, _impactOpen: !impactOpen } : r); setAdminRoles(updated); }}
                          style={{ padding: "10px 16px", background: "#E3F2FD", display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                          <AlertTriangle size={14} color="#1A73E8" />
                          <span style={{ fontSize: 12, fontWeight: 500, color: "#1A73E8", flex: 1 }}>{t('roles.impact')} : {count} {t('roles.affected')}</span>
                          <ChevronRight size={14} color="#1A73E8" style={{ transform: impactOpen ? "rotate(90deg)" : "none", transition: "transform .2s" }} />
                        </div>
                        {impactOpen && (
                          <div style={{ padding: "10px 16px", display: "flex", gap: 6, flexWrap: "wrap" }}>
                            {affectedUsers.length > 0 ? affectedUsers.map((u: any) => (
                              <span key={u.id} style={{ padding: "4px 10px", background: "#E3F2FD", borderRadius: 6, fontSize: 11, color: "#1A73E8", fontWeight: 500 }}>{u.name}</span>
                            )) : (
                              <span style={{ fontSize: 11, color: C.textMuted }}>{count > 0 ? `${count} ${lang === "fr" ? "membre(s) assigné(s)" : "member(s) assigned"}` : (lang === "fr" ? "Aucun membre assigné" : "No members assigned")}</span>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })()}
                  {(() => {
                    const SCOPE_CRITERIA = [
                      { key: "societe", label: lang === "fr" ? "Société" : "Company", Icon: Building2, color: "#1A73E8" },
                      { key: "sous_societe", label: lang === "fr" ? "Sous-société" : "Sub-company", Icon: Building2, color: "#00897B" },
                      { key: "departement", label: lang === "fr" ? "Département" : "Department", Icon: FolderOpen, color: "#7B5EA7" },
                      { key: "bureau", label: "Bureau", Icon: MapPin, color: "#F9A825" },
                      { key: "equipe", label: lang === "fr" ? "Équipe" : "Team", Icon: Users, color: "#4CAF50" },
                      { key: "poste", label: lang === "fr" ? "Poste" : "Position", Icon: Landmark, color: "#E65100" },
                      { key: "employe", label: lang === "fr" ? "Employé" : "Employee", Icon: Users, color: C.pink },
                      { key: "n1_manager", label: lang === "fr" ? "Mes N-1 (Manager)" : "My reports (Manager)", Icon: Users, color: "#0D47A1", dynamic: true },
                      { key: "population_rh", label: lang === "fr" ? "Ma population RH" : "My HR population", Icon: Users, color: "#2E7D32", dynamic: true },
                    ];
                    const scopeGroups: any[] = (selectedRole as any).scope_groups || [];
                    const isGlobal = selectedRole.scope_type === "global" && scopeGroups.length === 0;

                    const saveScope = (groups: any[], scopeType: string) => {
                      const patched = adminRoles.map(r => r.id === selectedRole.id ? { ...r, scope_groups: groups, scope_type: scopeType } : r);
                      setAdminRoles(patched);
                      apiUpdateRole(selectedRole.id, { scope_groups: groups, scope_type: scopeType }).catch(() => {});
                    };
                    const addGroup = () => {
                      saveScope([...scopeGroups, { id: Date.now(), criteria: [] }], "custom");
                    };
                    const removeGroup = (gid: number) => {
                      const updated = scopeGroups.filter((g: any) => g.id !== gid);
                      saveScope(updated, updated.length === 0 ? "global" : "custom");
                    };
                    const addCriterion = (gid: number, criterionKey: string) => {
                      const updated = scopeGroups.map((g: any) => g.id === gid ? { ...g, criteria: [...g.criteria, { key: criterionKey, values: [] }] } : g);
                      saveScope(updated, "custom");
                    };
                    const removeCriterion = (gid: number, cKey: string) => {
                      const updated = scopeGroups.map((g: any) => g.id === gid ? { ...g, criteria: g.criteria.filter((c: any) => c.key !== cKey) } : g);
                      saveScope(updated, "custom");
                    };
                    const setGlobal = () => {
                      saveScope([], "global");
                    };

                    return (
                      <div>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                          <div style={{ fontSize: 12, color: C.textLight }}>
                            {t('roles.criteria_and')} <b>ET</b>. {t('roles.groups_or')} <b style={{ color: C.pink }}>OU</b>.
                          </div>
                          <div style={{ display: "flex", gap: 6 }}>
                            <button onClick={setGlobal} style={{ padding: "4px 12px", borderRadius: 6, fontSize: 11, fontWeight: 600, background: isGlobal ? "#1A73E8" : C.bg, color: isGlobal ? C.white : C.textMuted, border: "none", cursor: "pointer", fontFamily: font }}>Global</button>
                            <button onClick={addGroup} className="iz-btn-outline" style={{ ...sBtn("outline"), fontSize: 11, padding: "4px 12px", color: "#1A73E8", borderColor: "#1A73E8" }}>{t('roles.add_group')}</button>
                          </div>
                        </div>

                        {isGlobal && (
                          <div style={{ padding: "14px 16px", background: "#1A73E808", border: "1.5px solid #1A73E830", borderRadius: 10 }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                              <span style={{ fontSize: 13, fontWeight: 500, color: "#1A73E8" }}>{t('roles.scope_global')}</span>
                              <button onClick={addGroup} className="iz-btn-outline" style={{ ...sBtn("outline"), fontSize: 11, padding: "4px 12px" }}>{t('roles.restrict')}</button>
                            </div>
                          </div>
                        )}

                        {scopeGroups.map((group: any, gIdx: number) => {
                          const usedKeys = group.criteria.map((c: any) => c.key);
                          const availableCriteria = SCOPE_CRITERIA.filter(sc => !usedKeys.includes(sc.key));
                          return (
                            <div key={group.id}>
                              {gIdx > 0 && (
                                <div style={{ textAlign: "center", padding: "8px 0" }}>
                                  <span style={{ padding: "2px 12px", borderRadius: 10, fontSize: 10, fontWeight: 700, background: C.pinkBg, color: C.pink }}>OU</span>
                                </div>
                              )}
                              <div style={{ border: `1.5px solid ${C.border}`, borderRadius: 10, overflow: "hidden", marginBottom: 8 }}>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px", background: C.bg }}>
                                  <span style={{ fontSize: 12, fontWeight: 600 }}>{lang === "fr" ? "Groupe" : "Group"} {gIdx + 1} — {group.criteria.length} {lang === "fr" ? "critère(s)" : "criteria"} (ET)</span>
                                  <button onClick={() => removeGroup(group.id)} style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}><X size={14} color={C.textMuted} /></button>
                                </div>
                                <div style={{ padding: "12px 16px" }}>
                                  {group.criteria.map((criterion: any, cIdx: number) => {
                                    const meta = SCOPE_CRITERIA.find(sc => sc.key === criterion.key);
                                    if (!meta) return null;
                                    return (
                                      <div key={criterion.key} style={{ padding: "10px 14px", border: `1px solid ${meta.dynamic ? "#4CAF5030" : C.border}`, borderRadius: 8, marginBottom: 8, background: meta.dynamic ? "#4CAF5008" : "transparent" }}>
                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: meta.dynamic ? 8 : 4 }}>
                                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                            <meta.Icon size={13} color={meta.color} />
                                            <span style={{ fontSize: 12, fontWeight: 600, color: meta.color }}>{meta.label}</span>
                                            {meta.dynamic && <span style={{ padding: "1px 6px", borderRadius: 3, fontSize: 8, fontWeight: 700, background: "#4CAF5020", color: "#4CAF50", textTransform: "uppercase" }}>dynamique</span>}
                                            {cIdx > 0 && <span style={{ padding: "1px 6px", borderRadius: 3, fontSize: 9, fontWeight: 700, background: C.bg, color: C.textMuted }}>ET</span>}
                                          </div>
                                          <button onClick={() => removeCriterion(group.id, criterion.key)} style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}><X size={12} color={C.textMuted} /></button>
                                        </div>
                                        {meta.dynamic ? (
                                          <div style={{ fontSize: 11, color: C.textMuted }}>
                                            {criterion.key === "n1_manager" ? (lang === "fr" ? "Chaque membre voit uniquement ses subordonnés directs (champ Manager du Job Information)" : "Each member sees only their direct reports (Manager field in Job Information)") :
                                            (lang === "fr" ? "Chaque membre voit uniquement sa population RH assignée (champ HR Manager du Job Relationship)" : "Each member sees only their assigned HR population (HR Manager field in Job Relationship)")}
                                          </div>
                                        ) : (
                                          <div>
                                            <div style={{ fontSize: 10, color: C.textMuted, marginBottom: 4 }}>{lang === "fr" ? "Toutes" : "All"}</div>
                                            <select style={{ ...sInput, fontSize: 12, cursor: "pointer" }}>
                                              <option value="">{lang === "fr" ? "Sélectionner..." : "Select..."}</option>
                                            </select>
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                  {availableCriteria.length > 0 && (
                                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 4 }}>
                                      {availableCriteria.map(sc => (
                                        <button key={sc.key} onClick={() => addCriterion(group.id, sc.key)} style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 6, border: `1px dashed ${C.border}`, background: "transparent", cursor: "pointer", fontSize: 10, fontWeight: 500, color: C.textMuted, fontFamily: font, transition: "all .15s" }}
                                          onMouseEnter={e => { e.currentTarget.style.borderColor = sc.color; e.currentTarget.style.color = sc.color; }}
                                          onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textMuted; }}>
                                          + <sc.Icon size={10} /> {sc.label}
                                        </button>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* -- EXCLUSIONS TAB -- */}
              {roleTab === "exclusions" && (() => {
                const EXCL_CRITERIA = [
                  { key: "employe", label: t('perm.collaborateurs'), Icon: Users, color: C.pink },
                  { key: "societe", label: lang === "fr" ? "Société" : "Company", Icon: Building2, color: "#1A73E8" },
                  { key: "sous_societe", label: lang === "fr" ? "Sous-société" : "Sub-company", Icon: Building2, color: "#00897B" },
                  { key: "departement", label: lang === "fr" ? "Département" : "Department", Icon: FolderOpen, color: "#7B5EA7" },
                  { key: "bureau", label: "Bureau", Icon: MapPin, color: "#F9A825" },
                  { key: "equipe", label: lang === "fr" ? "Équipe" : "Team", Icon: Users, color: "#4CAF50" },
                  { key: "poste", label: lang === "fr" ? "Poste" : "Position", Icon: Landmark, color: "#E65100" },
                ];
                const excludeSelf = selectedRole.exclude_self || false;
                const exclGroups: any[] = selectedRole.exclusion_groups || [];

                const saveExcl = (groups: any[], selfExcl?: boolean) => {
                  const patch: any = { exclusion_groups: groups };
                  if (selfExcl !== undefined) patch.exclude_self = selfExcl;
                  const patched = adminRoles.map(r => r.id === selectedRole.id ? { ...r, ...patch } : r);
                  setAdminRoles(patched);
                  apiUpdateRole(selectedRole.id, patch).catch(() => {});
                };
                const toggleSelf = () => saveExcl(exclGroups, !excludeSelf);
                const addExclGroup = () => saveExcl([...exclGroups, { id: Date.now(), criteria: [] }]);
                const removeExclGroup = (gid: number) => saveExcl(exclGroups.filter((g: any) => g.id !== gid));
                const addExclCriterion = (gid: number, key: string) => saveExcl(exclGroups.map((g: any) => g.id === gid ? { ...g, criteria: [...g.criteria, { key, values: [] }] } : g));
                const removeExclCriterion = (gid: number, key: string) => saveExcl(exclGroups.map((g: any) => g.id === gid ? { ...g, criteria: g.criteria.filter((c: any) => c.key !== key) } : g));

                return (
                  <div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                      <div style={{ fontSize: 12, color: C.textLight }}>
                        {lang === "fr" ? "Les exclusions sont prioritaires. Groupes combinés en" : "Exclusions take priority. Groups combined with"} <b style={{ color: C.pink }}>OU</b>, {lang === "fr" ? "critères dans un groupe en" : "criteria within a group with"} <b>ET</b>.
                      </div>
                      <button onClick={addExclGroup} className="iz-btn-outline" style={{ ...sBtn("outline"), fontSize: 11, padding: "4px 12px", color: C.pink, borderColor: C.pink, whiteSpace: "nowrap" }}>+ {lang === "fr" ? "Ajouter un groupe d'exclusion" : "Add exclusion group"}</button>
                    </div>

                    {/* Exclude self toggle */}
                    <div onClick={toggleSelf} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", background: excludeSelf ? C.pinkBg : C.bg, borderRadius: 8, marginBottom: 16, cursor: "pointer", border: excludeSelf ? `1.5px solid ${C.pink}30` : "1.5px solid transparent", transition: "all .2s" }}>
                      <div style={{ width: 40, height: 22, borderRadius: 11, background: excludeSelf ? C.pink : C.border, position: "relative", transition: "all .2s", flexShrink: 0 }}>
                        <div style={{ width: 18, height: 18, borderRadius: 9, background: C.white, position: "absolute", top: 2, left: excludeSelf ? 20 : 2, transition: "all .2s", boxShadow: "0 1px 3px rgba(0,0,0,.2)" }} />
                      </div>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: excludeSelf ? C.pink : C.text }}>{lang === "fr" ? "Exclure l'employé lui-même" : "Exclude employee themselves"}</div>
                        <div style={{ fontSize: 10, color: C.textMuted }}>{lang === "fr" ? "Le titulaire du rôle ne peut pas voir/modifier ses propres données salariales" : "Role holder cannot view/edit their own salary data"}</div>
                      </div>
                    </div>

                    {/* Exclusion groups */}
                    {exclGroups.map((group: any, gIdx: number) => {
                      const usedKeys = group.criteria.map((c: any) => c.key);
                      const available = EXCL_CRITERIA.filter(ec => !usedKeys.includes(ec.key));
                      return (
                        <div key={group.id}>
                          {gIdx > 0 && <div style={{ textAlign: "center", padding: "8px 0" }}><span style={{ padding: "2px 12px", borderRadius: 10, fontSize: 10, fontWeight: 700, background: C.pinkBg, color: C.pink }}>OU</span></div>}
                          <div style={{ border: `1.5px solid ${C.pink}20`, borderRadius: 10, overflow: "hidden", marginBottom: 8 }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px", background: C.pinkBg }}>
                              <span style={{ fontSize: 12, fontWeight: 600, color: C.pink }}>Exclusion {gIdx + 1} — {group.criteria.length} {lang === "fr" ? "critère(s) (ET)" : "criteria (AND)"}</span>
                              <button onClick={() => removeExclGroup(group.id)} style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}><X size={14} color={C.textMuted} /></button>
                            </div>
                            <div style={{ padding: "12px 16px" }}>
                              {group.criteria.map((criterion: any, cIdx: number) => {
                                const meta = EXCL_CRITERIA.find(ec => ec.key === criterion.key);
                                if (!meta) return null;
                                return (
                                  <div key={criterion.key} style={{ padding: "10px 14px", border: `1px solid ${C.border}`, borderRadius: 8, marginBottom: 8 }}>
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                        <meta.Icon size={13} color={meta.color} />
                                        <span style={{ fontSize: 12, fontWeight: 600, color: meta.color }}>{meta.label}</span>
                                        {cIdx > 0 && <span style={{ padding: "1px 6px", borderRadius: 3, fontSize: 9, fontWeight: 700, background: C.bg, color: C.textMuted }}>ET</span>}
                                        <span style={{ fontSize: 10, color: C.textMuted }}>{lang === "fr" ? "Aucun" : "None"}</span>
                                      </div>
                                      <button onClick={() => removeExclCriterion(group.id, criterion.key)} style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}><X size={12} color={C.textMuted} /></button>
                                    </div>
                                    <select style={{ ...sInput, fontSize: 12, cursor: "pointer" }}>
                                      <option value="">{lang === "fr" ? "Sélectionner..." : "Select..."}</option>
                                    </select>
                                  </div>
                                );
                              })}
                              {available.length > 0 && (
                                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 4 }}>
                                  {available.map(ec => (
                                    <button key={ec.key} onClick={() => addExclCriterion(group.id, ec.key)} style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 6, border: `1px dashed ${ec.color}40`, background: "transparent", cursor: "pointer", fontSize: 10, fontWeight: 500, color: ec.color, fontFamily: font }}
                                      onMouseEnter={e => { e.currentTarget.style.borderColor = ec.color; }} onMouseLeave={e => { e.currentTarget.style.borderColor = ec.color + "40"; }}>
                                      + <ec.Icon size={10} /> {ec.label}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {exclGroups.length === 0 && (
                      <div style={{ padding: "16px", border: `1.5px dashed ${C.border}`, borderRadius: 10, textAlign: "center" }}>
                        <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 8 }}>{lang === "fr" ? "Aucune exclusion configurée." : "No exclusions configured."}</div>
                        <div style={{ display: "flex", gap: 6, justifyContent: "center", flexWrap: "wrap" }}>
                          {EXCL_CRITERIA.map(c => (
                            <button key={c.key} onClick={() => { addExclGroup(); setTimeout(() => { const newGroups = [...exclGroups, { id: Date.now(), criteria: [{ key: c.key, values: [] }] }]; saveExcl(newGroups); }, 0); }} style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 6, border: `1px dashed ${c.color}40`, background: "transparent", cursor: "pointer", fontSize: 10, fontWeight: 500, color: c.color, fontFamily: font }}>
                              <Plus size={10} /> <c.Icon size={10} /> {c.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* -- MEMBERS TAB -- */}
              {roleTab === "members" && (
                <div>
                  {/* Individual members */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <Users size={14} color={C.text} />
                      <span style={{ fontSize: 14, fontWeight: 600 }}>{lang === "fr" ? "Membres individuels" : "Individual members"}</span>
                      <span style={{ fontSize: 11, color: C.textMuted }}>({(selectedRole.users || []).length})</span>
                    </div>
                    <button onClick={() => {
                      showPrompt(t('roles.select_employee'), async (userId) => {
                        try { await assignRoleUser(selectedRole.id, Number(userId)); reloadRoles(); addToast_admin(t('roles.assigned')); } catch { addToast_admin(t('toast.error')); }
                      }, { options: (adminUsers || []).map(u => ({ value: String(u.id), label: `${u.name} — ${u.email}` })), searchable: true });
                    }} className="iz-btn-pink" style={{ ...sBtn("pink"), fontSize: 11, padding: "6px 14px", display: "flex", alignItems: "center", gap: 4 }}><Plus size={12} /> {lang === "fr" ? "Ajouter" : "Add"}</button>
                  </div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
                    {(selectedRole.users || []).map((u: any) => (
                      <div key={u.id} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 12px", background: C.bg, borderRadius: 20 }}>
                        <div style={{ width: 24, height: 24, borderRadius: "50%", background: selectedRole.couleur, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: C.white }}>{(u.name || "?").substring(0, 2).toUpperCase()}</div>
                        <span style={{ fontSize: 12, fontWeight: 500 }}>{u.name}</span>
                        <button onClick={async () => { try { await removeRoleUser(selectedRole.id, u.id); reloadRoles(); addToast_admin(t('roles.removed')); } catch {} }} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}><X size={12} color={C.textMuted} /></button>
                      </div>
                    ))}
                    {(selectedRole.users || []).length === 0 && <span style={{ fontSize: 12, color: C.textMuted }}>{lang === "fr" ? "Aucun membre assigné" : "No members assigned"}</span>}
                  </div>

                  {/* Automatic members */}
                  {(() => {
                    const COLLABS: any[] = ctx.COLLABORATEURS || [];
                    const autoManagersEnabled = (selectedRole as any).auto_managers !== false;
                    const autoHREnabled = (selectedRole as any).auto_hr_managers !== false;
                    // Real data: use managerId and hrManagerId fields from collaborateurs
                    const managerIds = [...new Set(COLLABS.map((c: any) => c.managerId).filter(Boolean))];
                    const managers = managerIds.map(id => COLLABS.find((c: any) => c.id === id)).filter(Boolean);
                    const hrManagerIds = [...new Set(COLLABS.map((c: any) => c.hrManagerId).filter(Boolean))];
                    const hrManagers = hrManagerIds.map(id => COLLABS.find((c: any) => c.id === id)).filter(Boolean);
                    const managerReports: Record<string, any[]> = {};
                    managers.forEach((m: any) => { managerReports[m.id] = COLLABS.filter((c: any) => c.managerId === m.id); });

                    const toggleAutoManagers = () => {
                      const patched = adminRoles.map(r => r.id === selectedRole.id ? { ...r, auto_managers: !autoManagersEnabled } : r);
                      setAdminRoles(patched);
                    };
                    const toggleAutoHR = () => {
                      const patched = adminRoles.map(r => r.id === selectedRole.id ? { ...r, auto_hr_managers: !autoHREnabled } : r);
                      setAdminRoles(patched);
                    };

                    const resolvedManagerCount = autoManagersEnabled ? COLLABS.filter((_: any, i: number) => managers.some((m: any) => managerReports[m.id]?.length > 0)).length : 0;
                    const resolvedHRCount = autoHREnabled ? hrManagers.length : 0;
                    const totalMembers = (selectedRole.users || []).length + (autoManagersEnabled ? managers.length : 0) + (autoHREnabled ? hrManagers.length : 0);

                    return (
                      <>
                        <div style={{ marginBottom: 24 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                            <span style={{ fontSize: 14, fontWeight: 600 }}>{lang === "fr" ? "Membres automatiques" : "Automatic members"}</span>
                            <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, background: C.greenLight, color: C.green, fontWeight: 600 }}>{lang === "fr" ? "depuis les profils employés" : "from employee profiles"}</span>
                          </div>
                          <div style={{ fontSize: 11, color: C.textLight, marginBottom: 12 }}>{lang === "fr" ? "Toute personne assignée comme Manager ou HR Manager dans le profil d'un employé est automatiquement membre de ce rôle." : "Anyone assigned as Manager or HR Manager in an employee profile is automatically a member of this role."}</div>

                          {/* Managers toggle */}
                          <div style={{ padding: "12px 16px", background: autoManagersEnabled ? "#4CAF5008" : C.bg, border: autoManagersEnabled ? "1.5px solid #4CAF5030" : "1.5px solid transparent", borderRadius: 8, marginBottom: 8 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: autoManagersEnabled ? 10 : 0 }}>
                              <div onClick={toggleAutoManagers} style={{ width: 40, height: 22, borderRadius: 11, background: autoManagersEnabled ? "#4CAF50" : C.border, cursor: "pointer", position: "relative", transition: "all .2s", flexShrink: 0 }}>
                                <div style={{ width: 18, height: 18, borderRadius: 9, background: C.white, position: "absolute", top: 2, left: autoManagersEnabled ? 20 : 2, transition: "all .2s", boxShadow: "0 1px 3px rgba(0,0,0,.2)" }} />
                              </div>
                              <Landmark size={14} color={autoManagersEnabled ? "#4CAF50" : C.textMuted} />
                              <div style={{ flex: 1 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                  <span style={{ fontSize: 12, fontWeight: 600, color: C.text }}>Managers (Job Information)</span>
                                  {autoManagersEnabled && <span style={{ fontSize: 10, padding: "1px 6px", borderRadius: 4, background: "#4CAF5015", color: "#4CAF50", fontWeight: 600 }}>{managers.length} {lang === "fr" ? "résolu(s)" : "resolved"}</span>}
                                </div>
                                <div style={{ fontSize: 10, color: C.textMuted }}>{lang === "fr" ? "Toute personne assignée comme Manager dans le profil d'un employé" : "Anyone assigned as Manager in an employee profile"}</div>
                              </div>
                            </div>
                            {autoManagersEnabled && managers.length > 0 && (
                              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                                {managers.map((m: any) => {
                                  const reports = managerReports[m.id] || [];
                                  return (
                                    <div key={m.id} style={{ padding: "6px 10px", background: C.white, borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 11 }}>
                                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: reports.length > 0 ? 4 : 0 }}>
                                        <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#4CAF50", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 700, color: C.white }}>{(m.prenom || "?")[0]}{(m.nom || "?")[0]}</div>
                                        <span style={{ fontWeight: 600 }}>{m.prenom} {m.nom}</span>
                                        <span style={{ color: C.textMuted }}>— {reports.length} {lang === "fr" ? "employé(s)" : "employee(s)"}</span>
                                      </div>
                                      {reports.length > 0 && (
                                        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginLeft: 26 }}>
                                          {reports.slice(0, 6).map((r: any) => <span key={r.id} style={{ padding: "1px 6px", borderRadius: 4, background: C.bg, fontSize: 10, color: C.textLight }}>{r.prenom} {r.nom}</span>)}
                                          {reports.length > 6 && <span style={{ fontSize: 10, color: C.textMuted }}>+{reports.length - 6}</span>}
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>

                          {/* HR Managers toggle */}
                          <div style={{ padding: "12px 16px", background: autoHREnabled ? "#4CAF5008" : C.bg, border: autoHREnabled ? "1.5px solid #4CAF5030" : "1.5px solid transparent", borderRadius: 8 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: autoHREnabled ? 10 : 0 }}>
                              <div onClick={toggleAutoHR} style={{ width: 40, height: 22, borderRadius: 11, background: autoHREnabled ? "#4CAF50" : C.border, cursor: "pointer", position: "relative", transition: "all .2s", flexShrink: 0 }}>
                                <div style={{ width: 18, height: 18, borderRadius: 9, background: C.white, position: "absolute", top: 2, left: autoHREnabled ? 20 : 2, transition: "all .2s", boxShadow: "0 1px 3px rgba(0,0,0,.2)" }} />
                              </div>
                              <Users size={14} color={autoHREnabled ? "#4CAF50" : C.textMuted} />
                              <div style={{ flex: 1 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                  <span style={{ fontSize: 12, fontWeight: 600, color: C.text }}>HR Managers (Job Relationship)</span>
                                  {autoHREnabled && <span style={{ fontSize: 10, padding: "1px 6px", borderRadius: 4, background: "#4CAF5015", color: "#4CAF50", fontWeight: 600 }}>{hrManagers.length} {lang === "fr" ? "résolu(s)" : "resolved"}</span>}
                                </div>
                                <div style={{ fontSize: 10, color: C.textMuted }}>{lang === "fr" ? "Toute personne assignée comme HR Manager dans le profil de l'employé" : "Anyone assigned as HR Manager in an employee profile"}</div>
                              </div>
                            </div>
                            {autoHREnabled && hrManagers.length > 0 && (
                              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                                {hrManagers.map((m: any) => {
                                  const population = COLLABS.filter((c: any) => c.hrManagerId === m.id);
                                  return (
                                    <div key={m.id} style={{ padding: "6px 10px", background: C.white, borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 11 }}>
                                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: population.length > 0 ? 4 : 0 }}>
                                        <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#4CAF50", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 700, color: C.white }}>{(m.prenom || "?")[0]}{(m.nom || "?")[0]}</div>
                                        <span style={{ fontWeight: 600 }}>{m.prenom} {m.nom}</span>
                                        <span style={{ color: C.textMuted }}>— {population.length} {lang === "fr" ? "employé(s)" : "employee(s)"}</span>
                                      </div>
                                      {population.length > 0 && (
                                        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginLeft: 26 }}>
                                          {population.slice(0, 6).map((r: any) => <span key={r.id} style={{ padding: "1px 6px", borderRadius: 4, background: C.bg, fontSize: 10, color: C.textLight }}>{r.prenom} {r.nom}</span>)}
                                          {population.length > 6 && <span style={{ fontSize: 10, color: C.textMuted }}>+{population.length - 6}</span>}
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Dynamic members */}
                        {(() => {
                          const DYN_CRITERIA = [
                            { key: "sous_societe", label: lang === "fr" ? "Sous-société" : "Sub-company", Icon: Building2, color: "#00897B" },
                            { key: "departement", label: lang === "fr" ? "Département" : "Department", Icon: FolderOpen, color: "#7B5EA7" },
                            { key: "bureau", label: "Bureau", Icon: MapPin, color: "#F9A825" },
                            { key: "equipe", label: lang === "fr" ? "Équipe" : "Team", Icon: Users, color: "#4CAF50" },
                            { key: "poste", label: lang === "fr" ? "Poste" : "Position", Icon: Landmark, color: "#E65100" },
                          ];
                          const dynGroups: any[] = (selectedRole as any).member_dynamic_groups || [];
                          const addDynGroup = () => {
                            const updated = [...dynGroups, { id: Date.now(), criteria: [] }];
                            const patched = adminRoles.map(r => r.id === selectedRole.id ? { ...r, member_dynamic_groups: updated } : r);
                            setAdminRoles(patched);
                          };
                          const removeDynGroup = (gid: number) => {
                            const updated = dynGroups.filter((g: any) => g.id !== gid);
                            const patched = adminRoles.map(r => r.id === selectedRole.id ? { ...r, member_dynamic_groups: updated } : r);
                            setAdminRoles(patched);
                          };
                          const addDynCriterion = (gid: number, key: string) => {
                            const updated = dynGroups.map((g: any) => g.id === gid ? { ...g, criteria: [...g.criteria, { key, values: [] }] } : g);
                            const patched = adminRoles.map(r => r.id === selectedRole.id ? { ...r, member_dynamic_groups: updated } : r);
                            setAdminRoles(patched);
                          };
                          const removeDynCriterion = (gid: number, key: string) => {
                            const updated = dynGroups.map((g: any) => g.id === gid ? { ...g, criteria: g.criteria.filter((c: any) => c.key !== key) } : g);
                            const patched = adminRoles.map(r => r.id === selectedRole.id ? { ...r, member_dynamic_groups: updated } : r);
                            setAdminRoles(patched);
                          };

                          // Resolve dynamic members: collabs matching ALL criteria in ANY group
                          const dynamicMembers: any[] = [];
                          if (dynGroups.length > 0) {
                            dynGroups.forEach((g: any) => {
                              if (g.criteria.length === 0) return;
                              COLLABS.forEach((c: any) => {
                                if (dynamicMembers.some((dm: any) => dm.id === c.id)) return;
                                // A collab matches a group if it matches ALL criteria in the group (for now, just having the criterion = match, since no values selected yet)
                                const matches = g.criteria.every((cr: any) => {
                                  if (cr.values && cr.values.length > 0) return cr.values.includes(c[cr.key]);
                                  return true; // No value filter = matches all
                                });
                                if (matches) dynamicMembers.push(c);
                              });
                            });
                          }

                          return (
                            <div style={{ marginBottom: 16 }}>
                              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                  <Users size={14} color={C.pink} />
                                  <span style={{ fontSize: 14, fontWeight: 600 }}>{lang === "fr" ? "Membres dynamiques (par critères)" : "Dynamic members (by criteria)"}</span>
                                </div>
                                <button onClick={addDynGroup} className="iz-btn-outline" style={{ ...sBtn("outline"), fontSize: 11, padding: "4px 12px", color: C.pink, borderColor: C.pink }}>{t('roles.add_group')}</button>
                              </div>
                              <div style={{ fontSize: 11, color: C.textLight, marginBottom: 8 }}>
                                {t('roles.criteria_and')} <b>ET</b>. {t('roles.groups_or')} <b style={{ color: C.pink }}>OU</b>.
                              </div>

                              {dynGroups.map((group: any, gIdx: number) => {
                                const usedKeys = group.criteria.map((c: any) => c.key);
                                const available = DYN_CRITERIA.filter(dc => !usedKeys.includes(dc.key));
                                return (
                                  <div key={group.id} style={{ border: `1.5px solid ${C.border}`, borderRadius: 10, overflow: "hidden", marginBottom: 8 }}>
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 16px", background: C.bg }}>
                                      <span style={{ fontSize: 12, fontWeight: 600 }}>{lang === "fr" ? "Groupe" : "Group"} {gIdx + 1}</span>
                                      <button onClick={() => removeDynGroup(group.id)} style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}><X size={14} color={C.textMuted} /></button>
                                    </div>
                                    <div style={{ padding: "10px 16px" }}>
                                      {group.criteria.map((criterion: any) => {
                                        const meta = DYN_CRITERIA.find(dc => dc.key === criterion.key);
                                        if (!meta) return null;
                                        const uniqueValues = [...new Set(COLLABS.map((c: any) => c[criterion.key]).filter(Boolean))];
                                        return (
                                          <div key={criterion.key} style={{ padding: "8px 12px", border: `1px solid ${C.border}`, borderRadius: 8, marginBottom: 6 }}>
                                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                                              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                                <meta.Icon size={12} color={meta.color} />
                                                <span style={{ fontSize: 12, fontWeight: 600, color: meta.color }}>{meta.label}</span>
                                              </div>
                                              <button onClick={() => removeDynCriterion(group.id, criterion.key)} style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}><X size={12} color={C.textMuted} /></button>
                                            </div>
                                            <select multiple style={{ ...sInput, fontSize: 11, minHeight: 50, cursor: "pointer" }} onChange={e => {
                                              const selected = Array.from(e.target.selectedOptions).map(o => o.value);
                                              const updated = dynGroups.map((g: any) => g.id === group.id ? { ...g, criteria: g.criteria.map((c: any) => c.key === criterion.key ? { ...c, values: selected } : c) } : g);
                                              const patched = adminRoles.map(r => r.id === selectedRole.id ? { ...r, member_dynamic_groups: updated } : r);
                                              setAdminRoles(patched);
                                            }}>
                                              {uniqueValues.map(v => <option key={v} value={v}>{v}</option>)}
                                            </select>
                                          </div>
                                        );
                                      })}
                                      {available.length > 0 && (
                                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 4 }}>
                                          {available.map(dc => (
                                            <button key={dc.key} onClick={() => addDynCriterion(group.id, dc.key)} style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 8px", borderRadius: 6, border: `1px dashed ${C.border}`, background: "transparent", cursor: "pointer", fontSize: 10, fontWeight: 500, color: C.textMuted, fontFamily: font }}
                                              onMouseEnter={e => { e.currentTarget.style.borderColor = dc.color; e.currentTarget.style.color = dc.color; }}
                                              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textMuted; }}>
                                              + <dc.Icon size={10} /> {dc.label}
                                            </button>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}

                              {dynGroups.length === 0 && (
                                <div style={{ padding: "20px", border: `1.5px dashed ${C.border}`, borderRadius: 10, textAlign: "center", color: C.textMuted, fontSize: 12 }}>
                                  {lang === "fr" ? "Aucun groupe de critères. Cliquez sur « Ajouter un groupe » pour créer un premier pool dynamique." : "No criteria groups. Click \"Add group\" to create a first dynamic pool."}
                                </div>
                              )}
                            </div>
                          );
                        })()}

                        {/* Result count */}
                        {(() => {
                          const dynGroups2: any[] = (selectedRole as any).member_dynamic_groups || [];
                          const dynMembers: any[] = [];
                          dynGroups2.forEach((g: any) => {
                            COLLABS.forEach((c: any) => {
                              if (dynMembers.some((d: any) => d.id === c.id)) return;
                              const matches = g.criteria.length === 0 || g.criteria.every((cr: any) => !cr.values || cr.values.length === 0 || cr.values.includes(c[cr.key]));
                              if (matches && g.criteria.length > 0) dynMembers.push(c);
                            });
                          });
                          const allMembers = [
                            ...(selectedRole.users || []).map((u: any) => ({ ...u, _src: "individual" })),
                            ...(autoManagersEnabled ? managers.map((m: any) => ({ ...m, name: `${m.prenom} ${m.nom}`, _src: "manager" })) : []),
                            ...dynMembers.map((c: any) => ({ ...c, name: `${c.prenom} ${c.nom}`, _src: "dynamic" })),
                          ];
                          // Deduplicate by id
                          const seen = new Set();
                          const unique = allMembers.filter(m => { if (seen.has(m.id)) return false; seen.add(m.id); return true; });
                          const dynCount = dynMembers.length;

                          return (
                            <div style={{ marginTop: 16 }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <span style={{ fontSize: 13, fontWeight: 600 }}>{lang === "fr" ? "Résultat" : "Result"} : {unique.length} {lang === "fr" ? "membre(s)" : "member(s)"}</span>
                                {dynCount > 0 && <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, background: C.pinkBg, color: C.pink, fontWeight: 600 }}>{lang === "fr" ? `dont ${dynCount} dynamique(s)` : `including ${dynCount} dynamic`}</span>}
                              </div>
                              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 }}>
                                {unique.map((m: any) => (
                                  <span key={m.id} style={{ padding: "4px 10px", borderRadius: 6, fontSize: 11, background: m._src === "dynamic" ? C.pinkBg : m._src === "manager" ? "#4CAF5010" : C.bg, color: m._src === "dynamic" ? C.pink : m._src === "manager" ? "#4CAF50" : C.text }}>{m.name}</span>
                                ))}
                              </div>
                            </div>
                          );
                        })()}
                      </>
                    );
                  })()}
                </div>
              )}

              {/* -- SECURITY TAB (2FA only — password policy is in Paramètres > Sécurité) -- */}
              {roleTab === "security" && (() => {
                return (
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <ShieldCheck size={16} color={C.text} />
                      <span style={{ fontSize: 14, fontWeight: 600 }}>{lang === "fr" ? "Double authentification (2FA)" : "Two-factor authentication (2FA)"}</span>
                    </div>
                    {(() => {
                      const twoFALevel = (selectedRole as any).security_2fa || "optional";
                      const twoFALevels = [
                        { key: "required", label: lang === "fr" ? "Obligatoire" : "Required", desc: lang === "fr" ? "Les employés doivent activer la 2FA pour accéder à l'app" : "Employees must enable 2FA to access the app", Icon: ShieldCheck, color: C.red, bg: C.redLight },
                        { key: "recommended", label: lang === "fr" ? "Recommandé" : "Recommended", desc: lang === "fr" ? "Une bannière persistante invite à activer la 2FA" : "A persistent banner invites users to enable 2FA", Icon: AlertTriangle, color: C.amber, bg: C.amberLight },
                        { key: "optional", label: lang === "fr" ? "Optionnel" : "Optional", desc: lang === "fr" ? "Les employés peuvent activer dans leurs paramètres" : "Employees can enable in their settings", Icon: Settings, color: C.green, bg: C.greenLight },
                        { key: "disabled", label: lang === "fr" ? "Désactivé" : "Disabled", desc: lang === "fr" ? "La 2FA n'est pas disponible pour ce rôle" : "2FA is not available for this role", Icon: XCircle, color: C.textMuted, bg: C.bg },
                      ];
                      const methods = (selectedRole as any).security_2fa_methods || ((selectedRole.scope_values as any)?._2fa_methods) || ["totp", "email"];
                      const toggleMethod = (method: string) => {
                        const current = [...methods];
                        const idx = current.indexOf(method);
                        if (idx >= 0) current.splice(idx, 1); else current.push(method);
                        if (current.length === 0) current.push(method);
                        const patched = adminRoles.map(r => r.id === selectedRole.id ? { ...r, security_2fa_methods: current } : r);
                        setAdminRoles(patched);
                        apiUpdateRole(selectedRole.id, { scope_values: { ...(selectedRole.scope_values || {}), _2fa_methods: current } }).catch(() => {});
                      };
                      return (
                        <div>
                          <div style={{ fontSize: 12, color: C.textLight, marginBottom: 16 }}>{lang === "fr" ? "Définir le niveau d'exigence 2FA pour ce rôle" : "Set the 2FA requirement level for this role"}</div>
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 24 }}>
                            {twoFALevels.map(l => (
                              <div key={l.key} onClick={() => {
                                const patched = adminRoles.map(r => r.id === selectedRole.id ? { ...r, security_2fa: l.key } : r);
                                setAdminRoles(patched);
                                apiUpdateRole(selectedRole.id, { security_2fa: l.key }).then(() => addToast_admin(lang === "fr" ? "Niveau 2FA mis à jour" : "2FA level updated")).catch(() => {});
                              }} style={{ padding: "14px 12px", borderRadius: 10, border: twoFALevel === l.key ? `2px solid ${l.color}` : `2px solid ${C.border}`, background: twoFALevel === l.key ? l.bg : C.white, cursor: "pointer", transition: "all .15s" }}>
                                <l.Icon size={16} color={l.color} style={{ marginBottom: 6 }} />
                                <div style={{ fontSize: 12, fontWeight: 600, color: twoFALevel === l.key ? l.color : C.text, marginBottom: 4 }}>{l.label}</div>
                                <div style={{ fontSize: 10, color: C.textMuted, lineHeight: 1.4 }}>{l.desc}</div>
                              </div>
                            ))}
                          </div>
                          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>{lang === "fr" ? "Méthodes autorisées" : "Authorized methods"}</div>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 24 }}>
                            {[
                              { key: "totp", label: "App d'authentification (TOTP)", desc: "Google Authenticator, Authy, 1Password..." },
                              { key: "email", label: "Code Email", desc: lang === "fr" ? "Code unique envoyé par email professionnel" : "Unique code sent to work email" },
                            ].map(m => {
                              const active = methods.includes(m.key);
                              return (
                                <div key={m.key} onClick={() => toggleMethod(m.key)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", background: active ? C.bg : C.white, borderRadius: 8, cursor: "pointer", border: `1.5px solid ${active ? C.blue + "40" : C.border}`, transition: "all .15s" }}>
                                  <div style={{ width: 24, height: 24, borderRadius: "50%", background: active ? C.blue : C.border, display: "flex", alignItems: "center", justifyContent: "center", transition: "all .15s" }}>{active && <Check size={12} color={C.white} />}</div>
                                  <div><div style={{ fontSize: 12, fontWeight: 600, color: active ? C.text : C.textMuted }}>{m.label}</div><div style={{ fontSize: 10, color: C.textMuted }}>{m.desc}</div></div>
                                </div>
                              );
                            })}
                          </div>
                          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>{lang === "fr" ? `Statut de conformité — ${selectedRole.nom}` : `Compliance status — ${selectedRole.nom}`}</div>
                          <div style={{ padding: "16px", background: C.bg, borderRadius: 10 }}>
                            <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 8 }}>
                              <span style={{ fontSize: 28, fontWeight: 800 }}>{selectedRole.users_count || 0}</span>
                              <span style={{ fontSize: 14, color: C.textMuted }}>/ {selectedRole.users_count || 0}</span>
                              <span style={{ marginLeft: "auto", fontSize: 14, fontWeight: 600, color: C.green }}>100%</span>
                            </div>
                            <div style={{ height: 8, borderRadius: 4, background: C.border, overflow: "hidden" }}>
                              <div style={{ height: "100%", width: "100%", borderRadius: 4, background: `linear-gradient(90deg, ${C.green}, ${C.amber})` }} />
                            </div>
                          </div>
                        </div>
                      );
                    })()}

                  </div>
                );
              })()}

              {/* -- HISTORY TAB -- */}
              {roleTab === "history" && (() => {
                // Load real logs on first open (use _historyLoaded flag to avoid infinite loop)
                if (!(permissionLogs as any)._loaded) {
                  (permissionLogs as any)._loaded = true;
                  getPermissionLogs().then((res: any) => {
                    const data = res.data || res;
                    const arr = Array.isArray(data) ? data : [];
                    arr._loaded = true;
                    setPermissionLogs(arr);
                  }).catch(() => { const empty: any = []; empty._loaded = true; setPermissionLogs(empty); });
                }
                const ACTION_META: Record<string, { label: string; color: string }> = {
                  role_created: { label: lang === "fr" ? "Rôle créé" : "Role created", color: "#4CAF50" },
                  role_updated: { label: lang === "fr" ? "Rôle modifié" : "Role updated", color: "#1A73E8" },
                  role_deleted: { label: lang === "fr" ? "Rôle supprimé" : "Role deleted", color: "#E53935" },
                  role_duplicated: { label: lang === "fr" ? "Rôle dupliqué" : "Role duplicated", color: "#7B5EA7" },
                  user_assigned: { label: lang === "fr" ? "Membre ajouté" : "Member added", color: "#4CAF50" },
                  user_removed: { label: lang === "fr" ? "Membre retiré" : "Member removed", color: "#E53935" },
                  permission_updated: { label: lang === "fr" ? "Permission modifiée" : "Permission modified", color: "#F9A825" },
                };
                const allLogs = permissionLogs;
                const PAGE_SIZE = 10;
                const totalPages = Math.ceil(allLogs.length / PAGE_SIZE);
                const currentPage = Math.min(auditVisibleCount, totalPages) || 1;
                const logs = allLogs.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
                const fmtLogDate = (d: string) => { try { const dt = new Date(d); return dt.toLocaleDateString(lang === "fr" ? "fr-FR" : "en-GB", { day: "2-digit", month: "2-digit", year: "numeric" }) + " " + dt.toLocaleTimeString(lang === "fr" ? "fr-FR" : "en-GB", { hour: "2-digit", minute: "2-digit" }); } catch { return d; } };
                return (
                  <div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                      <span style={{ fontSize: 12, color: C.textLight }}>
                        {lang === "fr" ? "Journal de toutes les modifications apportées aux rôles et permissions." : "Log of all changes made to roles and permissions."}
                        {allLogs.length > 0 && <span style={{ marginLeft: 8, fontWeight: 600, color: C.text }}> ({allLogs.length} {lang === "fr" ? "entrées" : "entries"})</span>}
                      </span>
                      <button onClick={() => { setPermissionLogs([]); setAuditVisibleCount(1); }} className="iz-btn-outline" style={{ ...sBtn("outline"), fontSize: 11, padding: "5px 12px", display: "flex", alignItems: "center", gap: 4 }}><Download size={12} /> {lang === "fr" ? "Rafraîchir" : "Refresh"}</button>
                    </div>
                    {allLogs.length === 0 && (
                      <div style={{ padding: "40px 20px", textAlign: "center", color: C.textMuted, fontSize: 13 }}>
                        {lang === "fr" ? "Aucun événement enregistré pour le moment. Les modifications de rôles et permissions seront tracées ici." : "No events recorded yet. Role and permission changes will be tracked here."}
                      </div>
                    )}
                    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                      {logs.map((log: any, i: number) => {
                        const meta = ACTION_META[log.action] || { label: log.action, color: C.textMuted };
                        const details = log.details || {};
                        const desc = details.role_nom ? `${meta.label} — ${details.role_nom}` : (details.user_name ? `${details.user_name} — ${details.role_nom || ""}` : JSON.stringify(details).substring(0, 100));
                        return (
                          <div key={log.id || i} style={{ display: "flex", gap: 12, padding: "14px 0", borderBottom: i < logs.length - 1 ? `1px solid ${C.border}` : "none" }}>
                            <div style={{ width: 3, borderRadius: 2, background: meta.color, flexShrink: 0 }} />
                            <div style={{ flex: 1 }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                                <span style={{ fontSize: 11, fontWeight: 700, color: meta.color }}>{meta.label}</span>
                                <span style={{ fontSize: 10, color: C.textMuted }}>{fmtLogDate(log.created_at)}</span>
                              </div>
                              <div style={{ fontSize: 12, color: C.text }}>{desc}</div>
                            </div>
                            {log.user && <span style={{ fontSize: 11, color: C.textMuted, whiteSpace: "nowrap" }}>{lang === "fr" ? "par" : "by"} {log.user.name}</span>}
                          </div>
                        );
                      })}
                    </div>
                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 16, paddingTop: 16, borderTop: `1px solid ${C.border}` }}>
                        <button disabled={currentPage <= 1} onClick={() => setAuditVisibleCount(currentPage - 1)} style={{ padding: "4px 10px", borderRadius: 6, fontSize: 11, fontWeight: 500, border: `1px solid ${C.border}`, background: C.white, cursor: currentPage <= 1 ? "not-allowed" : "pointer", color: currentPage <= 1 ? C.border : C.text, fontFamily: font }}>←</button>
                        {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                          let page: number;
                          if (totalPages <= 7) { page = i + 1; }
                          else if (currentPage <= 4) { page = i + 1; }
                          else if (currentPage >= totalPages - 3) { page = totalPages - 6 + i; }
                          else { page = currentPage - 3 + i; }
                          return (
                            <button key={page} onClick={() => setAuditVisibleCount(page)} style={{ padding: "4px 10px", borderRadius: 6, fontSize: 11, fontWeight: currentPage === page ? 600 : 400, border: "none", background: currentPage === page ? C.pink : "transparent", color: currentPage === page ? C.white : C.textMuted, cursor: "pointer", fontFamily: font, minWidth: 30 }}>{page}</button>
                          );
                        })}
                        <button disabled={currentPage >= totalPages} onClick={() => setAuditVisibleCount(currentPage + 1)} style={{ padding: "4px 10px", borderRadius: 6, fontSize: 11, fontWeight: 500, border: `1px solid ${C.border}`, background: C.white, cursor: currentPage >= totalPages ? "not-allowed" : "pointer", color: currentPage >= totalPages ? C.border : C.text, fontFamily: font }}>→</button>
                        <span style={{ fontSize: 10, color: C.textMuted, marginLeft: 8 }}>{lang === "fr" ? "Page" : "Page"} {currentPage}/{totalPages}</span>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* Effective permissions per employee */}
        <div className="iz-card" style={{ ...sCard, marginBottom: 24, padding: "16px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <Users size={16} color={C.pink} />
            <span style={{ fontSize: 14, fontWeight: 600 }}>{t('roles.effective_perms')}</span>
            <span style={{ fontSize: 11, color: C.textMuted }}>— {t('roles.effective_desc')}</span>
          </div>
          <select value={effectivePermUserId || ""} onChange={e => setEffectivePermUserId(e.target.value ? Number(e.target.value) : null)} style={{ ...sInput, width: 280, fontSize: 12, cursor: "pointer", marginBottom: 12 }}>
            <option value="">{t('roles.select_employee')}</option>
            {(adminUsers || []).map(u => <option key={u.id} value={u.id}>{u.name} ({u.email})</option>)}
          </select>
          {effectivePermUserId && (() => {
            const user = (adminUsers || []).find((u: any) => u.id === effectivePermUserId);
            if (!user) return null;
            const userRolesList: string[] = user.roles || [user.role];
            const userRolesData = adminRoles.filter(r => userRolesList.includes(r.slug) || userRolesList.includes(r.name));
            // Merge permissions: take highest level per module
            const LEVEL_VAL: Record<string, number> = { admin: 3, edit: 2, view: 1, none: 0 };
            const VAL_LEVEL = ["none", "view", "edit", "admin"];
            const merged: Record<string, { level: string; source: string }> = {};
            PERM_MODULES.forEach(mod => {
              let best = 0; let src = "—";
              userRolesData.forEach(r => {
                const lv = LEVEL_VAL[(r.permissions || {})[mod.key] || "none"] || 0;
                if (lv > best) { best = lv; src = r.nom; }
              });
              merged[mod.key] = { level: VAL_LEVEL[best], source: src };
            });
            const counts = { admin: 0, edit: 0, view: 0, none: 0 };
            Object.values(merged).forEach(m => { counts[m.level as keyof typeof counts]++; });
            return (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>{user.name}</span>
                  <span style={{ color: C.textMuted }}>→</span>
                  {userRolesData.map(r => (
                    <span key={r.id} style={{ padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 600, background: r.couleur + "15", color: r.couleur }}>{r.nom}</span>
                  ))}
                  {userRolesData.length === 0 && <span style={{ fontSize: 11, color: C.textMuted }}>{lang === "fr" ? "Aucun rôle assigné" : "No roles assigned"}</span>}
                </div>
                <div style={{ display: "flex", gap: 8, marginBottom: 12, fontSize: 11 }}>
                  {PERM_LEVELS.map(l => {
                    const meta = PERM_LEVEL_META[l];
                    return <span key={l} style={{ padding: "2px 8px", borderRadius: 4, fontWeight: 600, background: meta.bg, color: meta.color }}>{meta.label} : {counts[l]}</span>;
                  })}
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                  <thead>
                    <tr style={{ background: C.bg }}>
                      <th style={{ padding: "8px 12px", textAlign: "left", fontWeight: 600, fontSize: 11, color: C.textLight }}>{lang === "fr" ? "Fonctionnalité" : "Feature"}</th>
                      <th style={{ padding: "8px 12px", textAlign: "right", fontWeight: 600, fontSize: 11, color: C.textLight }}>{lang === "fr" ? "Niveau effectif" : "Effective level"}</th>
                      <th style={{ padding: "8px 12px", textAlign: "right", fontWeight: 600, fontSize: 11, color: C.textLight }}>Source</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PERM_MODULES.map(mod => {
                      const m = merged[mod.key];
                      const meta = PERM_LEVEL_META[m.level];
                      return (
                        <tr key={mod.key} style={{ borderBottom: `1px solid ${C.border}` }}>
                          <td style={{ padding: "8px 12px", fontWeight: 500 }}>{mod.label}</td>
                          <td style={{ padding: "8px 12px", textAlign: "right" }}><span style={{ padding: "2px 10px", borderRadius: 4, fontSize: 10, fontWeight: 600, background: meta.bg, color: meta.color }}>{meta.label}</span></td>
                          <td style={{ padding: "8px 12px", textAlign: "right", fontSize: 11, color: C.textMuted }}>{m.source}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            );
          })()}
        </div>

        {/* Permission counts legend */}
        <div style={{ display: "flex", gap: 12, marginBottom: 12, fontSize: 11 }}>
          {PERM_LEVELS.map(l => {
            const meta = PERM_LEVEL_META[l];
            const count = adminRoles.reduce((acc, r) => acc + Object.values(r.permissions || {}).filter(v => v === l).length, 0);
            return <span key={l} style={{ padding: "3px 10px", borderRadius: 6, fontWeight: 600, background: meta.bg, color: meta.color }}>{meta.label} : {count}</span>;
          })}
          <div style={{ marginLeft: "auto", position: "relative" }}>
            <button onClick={() => setRolesDropdownOpen(!rolesDropdownOpen)} style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 12px", borderRadius: 6, border: `1px solid ${C.pink}`, background: C.pinkBg, color: C.pink, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: font }}>
              <Users size={12} /> {t('roles.roles_displayed')} ({(visibleRoleIds.length === 0 ? adminRoles.length : visibleRoleIds.length)}/{adminRoles.length})
            </button>
            {rolesDropdownOpen && (
              <div style={{ position: "absolute", top: "100%", right: 0, marginTop: 4, background: C.white, borderRadius: 10, boxShadow: "0 8px 24px rgba(0,0,0,.15)", border: `1px solid ${C.border}`, zIndex: 100, minWidth: 240, padding: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 600 }}>{lang === "fr" ? "Rôles dans la matrice" : "Roles in matrix"}</span>
                  <div style={{ display: "flex", gap: 4 }}>
                    <button onClick={() => { setVisibleRoleIds([]); }} style={{ padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 600, background: visibleRoleIds.length === 0 ? C.pink : C.bg, color: visibleRoleIds.length === 0 ? C.white : C.textMuted, border: "none", cursor: "pointer", fontFamily: font }}>{lang === "fr" ? "Tous" : "All"}</button>
                  </div>
                </div>
                {adminRoles.map(role => {
                  const checked = visibleRoleIds.length === 0 || visibleRoleIds.includes(role.id);
                  return (
                    <label key={role.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 4px", cursor: "pointer", borderRadius: 6 }}
                      onMouseEnter={e => { e.currentTarget.style.background = C.bg; }} onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}>
                      <input type="checkbox" checked={checked} onChange={() => {
                        if (visibleRoleIds.length === 0) {
                          setVisibleRoleIds(adminRoles.filter(r => r.id !== role.id).map(r => r.id));
                        } else {
                          setVisibleRoleIds(checked ? visibleRoleIds.filter(id => id !== role.id) : [...visibleRoleIds, role.id]);
                        }
                      }} style={{ accentColor: role.couleur }} />
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: role.couleur }} />
                      <span style={{ fontSize: 12, fontWeight: 500, flex: 1 }}>{role.nom}</span>
                      {role.is_system && <span style={{ fontSize: 8, padding: "1px 4px", borderRadius: 3, color: role.couleur, fontWeight: 700 }}>{t('roles.system')}</span>}
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Permissions Matrix */}
        <div className="iz-card" style={{ ...sCard, padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "12px 16px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 12 }}>
            <Target size={14} color={C.pink} />
            <span style={{ fontSize: 14, fontWeight: 600 }}>{t('roles.matrix')} — {PERM_MODULES.length} {t('roles.fields')} × {displayedRoles.length} {t('parcours.tab_groups').toLowerCase()}</span>
            <div style={{ marginLeft: "auto", position: "relative" }}>
              <Search size={14} style={{ position: "absolute", left: 8, top: 8, color: C.textMuted }} />
              <input value={permMatrixFilter} onChange={e => setPermMatrixFilter(e.target.value)} placeholder={t('roles.filter')} style={{ ...sInput, paddingLeft: 28, width: 200, fontSize: 11 }} />
            </div>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr style={{ background: C.bg }}>
                  <th style={{ padding: "10px 16px", textAlign: "left", fontWeight: 600, fontSize: 11, color: C.textLight, position: "sticky", left: 0, background: C.bg, zIndex: 1, minWidth: 200 }}>{t('roles.section_field')}</th>
                  {displayedRoles.map(role => (
                    <th key={role.id} style={{ padding: "10px 12px", textAlign: "center", minWidth: 100 }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                        <div style={{ width: 28, height: 28, borderRadius: "50%", border: `2px solid ${role.couleur}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <div style={{ width: 8, height: 8, borderRadius: "50%", background: role.couleur }} />
                        </div>
                        <span style={{ fontSize: 11, fontWeight: 600, color: role.couleur }}>{role.nom}</span>
                        <span style={{ fontSize: 9, color: C.textMuted }}>{role.users_count || 0} {t('roles.members').toLowerCase()}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.entries(SECTIONS).map(([sKey, sLabel]) => {
                  const sectionModules = filteredModules.filter(m => m.section === sKey);
                  if (sectionModules.length === 0) return null;
                  return [
                    <tr key={`section-${sKey}`}>
                      <td colSpan={displayedRoles.length + 1} style={{ padding: "8px 16px", fontWeight: 700, fontSize: 11, color: C.textLight, textTransform: "uppercase", letterSpacing: .5, background: C.bg, borderTop: `1px solid ${C.border}` }}>{sLabel}</td>
                    </tr>,
                    ...sectionModules.map(mod => (
                      <tr key={mod.key} style={{ borderBottom: `1px solid ${C.border}` }}>
                        <td style={{ padding: "10px 16px", fontWeight: 500, position: "sticky", left: 0, background: C.white, zIndex: 1 }}>{mod.label}</td>
                        {displayedRoles.map(role => {
                          const level = (role.permissions || {})[mod.key] || "none";
                          const meta = PERM_LEVEL_META[level];
                          return (
                            <td key={role.id} style={{ padding: "6px 8px", textAlign: "center" }}>
                              <button onClick={() => cyclePerm(role.id, mod.key, level)} title={t('roles.click_to_change')}
                                style={{ padding: "3px 10px", borderRadius: 4, fontSize: 10, fontWeight: 600, background: meta.bg, color: meta.color, border: "none", cursor: "pointer", fontFamily: font, transition: "all .15s", minWidth: 55 }}>
                                {meta.label}
                              </button>
                            </td>
                          );
                        })}
                      </tr>
                    )),
                  ];
                })}
              </tbody>
            </table>
          </div>
          <div style={{ padding: "8px 16px", borderTop: `1px solid ${C.border}`, fontSize: 10, color: C.textMuted }}>
            {t('roles.click_to_change')} — Admin → Edit → View → None → Admin
          </div>
        </div>

        {/* Create/Edit Role Panel */}
        {rolePanelMode !== "closed" && (
          <>
            <div onClick={() => setRolePanelMode("closed")} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.3)", zIndex: 1000 }} />
            <div className="iz-panel" style={{ position: "fixed", top: 0, right: 0, width: 480, height: "100vh", background: C.white, boxShadow: "-4px 0 24px rgba(0,0,0,.1)", zIndex: 1001, display: "flex", flexDirection: "column" }}>
              <div style={{ padding: "20px 24px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>{rolePanelMode === "create" ? t('roles.new') : t('common.edit')}</h2>
                <button onClick={() => setRolePanelMode("closed")} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={22} color={C.textLight} /></button>
              </div>
              <div style={{ flex: 1, padding: "20px 24px", overflow: "auto" }}>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, display: "block", marginBottom: 6 }}>{t('tpl.name')} *</label>
                  <input value={rolePanelData.nom || ""} onChange={e => setRolePanelData((p: any) => ({ ...p, nom: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, "_") }))} style={sInput} />
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, display: "block", marginBottom: 6 }}>Slug</label>
                  <input value={rolePanelData.slug || ""} onChange={e => setRolePanelData((p: any) => ({ ...p, slug: e.target.value }))} style={{ ...sInput, fontFamily: "monospace", fontSize: 12 }} />
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, display: "block", marginBottom: 6 }}>Description</label>
                  <textarea value={rolePanelData.description || ""} onChange={e => setRolePanelData((p: any) => ({ ...p, description: e.target.value }))} style={{ ...sInput, resize: "vertical" }} rows={2} />
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, display: "block", marginBottom: 6 }}>{t('phase.color')}</label>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {["#E53935", "#C2185B", "#7B5EA7", "#1A73E8", "#00897B", "#4CAF50", "#F9A825", "#78909C"].map(col => (
                      <button key={col} onClick={() => setRolePanelData((p: any) => ({ ...p, couleur: col }))} style={{ width: 28, height: 28, borderRadius: 8, background: col, border: rolePanelData.couleur === col ? "3px solid #333" : "3px solid transparent", cursor: "pointer" }} />
                    ))}
                  </div>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, display: "block", marginBottom: 8 }}>Permissions</label>
                  {PERM_MODULES.map(mod => (
                    <div key={mod.key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${C.border}` }}>
                      <span style={{ fontSize: 12, fontWeight: 500 }}>{mod.label}</span>
                      <div style={{ display: "flex", gap: 4 }}>
                        {PERM_LEVELS.map(l => {
                          const meta = PERM_LEVEL_META[l];
                          const isActive = (rolePanelData.permissions || {})[mod.key] === l;
                          return <button key={l} onClick={() => setRolePanelData((p: any) => ({ ...p, permissions: { ...p.permissions, [mod.key]: l } }))} style={{ padding: "3px 8px", borderRadius: 4, fontSize: 10, fontWeight: 600, background: isActive ? meta.bg : "transparent", color: isActive ? meta.color : C.textMuted, border: isActive ? `1px solid ${meta.color}30` : `1px solid transparent`, cursor: "pointer", fontFamily: font }}>{meta.label}</button>;
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ padding: "16px 24px", borderTop: `1px solid ${C.border}`, display: "flex", gap: 8, justifyContent: "flex-end" }}>
                <button onClick={() => setRolePanelMode("closed")} className="iz-btn-outline" style={{ ...sBtn("outline"), fontSize: 13 }}>{t('common.cancel')}</button>
                <button onClick={async () => {
                  try {
                    if (rolePanelMode === "create") {
                      await apiCreateRole(rolePanelData);
                      addToast_admin(t('roles.created'));
                    } else {
                      await apiUpdateRole(rolePanelData.id, rolePanelData);
                      addToast_admin(t('roles.updated'));
                    }
                    reloadRoles(); setRolePanelMode("closed");
                  } catch { addToast_admin(t('toast.error')); }
                }} className="iz-btn-pink" style={{ ...sBtn("pink"), fontSize: 13 }}>{rolePanelMode === "create" ? t('common.create') : t('common.save')}</button>
              </div>
            </div>
          </>
        )}
      </div>
    );
  };
}
