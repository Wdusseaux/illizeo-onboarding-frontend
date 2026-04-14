import { t } from '../../i18n';
import { C, colorWithAlpha, sCard, sBtn, sInput } from '../../constants';
import {
  Plus, Handshake, CheckCircle, Star, Clock, ArrowRight, Check,
} from 'lucide-react';
import { getBuddyPairs, createBuddyPair, updateBuddyPair, deleteBuddyPair, addBuddyNote, completeBuddyPair } from '../../api/endpoints';

export function createAdminBuddy(ctx: any) {
  const {
    COLLABORATEURS, showPrompt, addToast_admin,
    buddyPairs, setBuddyPairs, selectedBuddyPair, setSelectedBuddyPair,
    buddyTab, setBuddyTab,
    buddyNoteInput, setBuddyNoteInput,
    buddyFeedbackRating, setBuddyFeedbackRating,
    buddyFeedbackComment, setBuddyFeedbackComment,
    lang,
  } = ctx;

  const reloadPairs = () => { getBuddyPairs().then(setBuddyPairs).catch(() => {}); };

  return function renderAdminBuddy() {
    const noteInput = buddyNoteInput;
    const setNoteInput = setBuddyNoteInput;
    const feedbackRating = buddyFeedbackRating;
    const setFeedbackRating = setBuddyFeedbackRating;
    const feedbackComment = buddyFeedbackComment;
    const setFeedbackComment = setBuddyFeedbackComment;

    // Load from API if empty
    if (buddyPairs.length === 0 && (buddyPairs as any)._loaded !== true) {
      (buddyPairs as any)._loaded = true;
      reloadPairs();
    }

    const CHECKLIST_KEYS = [
      'buddy.checklist_tour', 'buddy.checklist_lunch', 'buddy.checklist_intro', 'buddy.checklist_tools',
      'buddy.checklist_culture', 'buddy.checklist_coffee', 'buddy.checklist_week1', 'buddy.checklist_month1',
    ];

    const activePairs = buddyPairs.filter((p: any) => p.status === 'active');
    const completedPairs = buddyPairs.filter((p: any) => p.status === 'completed');
    const ratingsArr = buddyPairs.filter((p: any) => p.rating != null).map((p: any) => p.rating);
    const avgRating = ratingsArr.length > 0 ? (ratingsArr.reduce((a: number, b: number) => a + b, 0) / ratingsArr.length).toFixed(1) : '—';
    const feedbackPending = buddyPairs.filter((p: any) => p.status === 'active' && p.checklist.some((c: boolean) => !c)).length;

    const selectedPair = buddyPairs.find((p: any) => p.id === selectedBuddyPair);

    const toggleChecklist = (pairId: number, idx: number) => {
      const pair = buddyPairs.find((p: any) => p.id === pairId);
      if (!pair) return;
      const cl = [...(pair.checklist || [])];
      cl[idx] = !cl[idx];
      // Optimistic update
      setBuddyPairs((prev: any[]) => prev.map((p: any) => p.id !== pairId ? p : { ...p, checklist: cl }));
      // Persist
      updateBuddyPair(pairId, { checklist: cl }).catch(() => {});
      if (cl.every(Boolean)) completeBuddyPair(pairId).then(() => reloadPairs()).catch(() => {});
    };

    const addNote = (pairId: number) => {
      if (!noteInput.trim()) return;
      addBuddyNote(pairId, noteInput.trim()).then(() => {
        reloadPairs();
        setNoteInput("");
      }).catch(() => {});
    };

    const submitFeedback = (pairId: number) => {
      if (feedbackRating === 0) return;
      updateBuddyPair(pairId, { rating: feedbackRating, feedback_comment: feedbackComment }).then(() => {
        reloadPairs();
        setFeedbackRating(0);
        setFeedbackComment("");
        addToast_admin(lang === "fr" ? "Feedback enregistré" : "Feedback saved");
      }).catch(() => {});
    };

    const getProgress = (checklist: boolean[]) => {
      const done = checklist.filter(Boolean).length;
      return { done, total: checklist.length, pct: Math.round((done / checklist.length) * 100) };
    };

    const fmtD = (iso: string) => {
      const d = new Date(iso);
      const pad = (n: number) => n.toString().padStart(2, "0");
      return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
    };

    return (
      <div style={{ flex: 1, padding: "24px 32px", overflow: "auto" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 600, margin: 0 }}>{t('buddy.title')}</h1>
            <p style={{ fontSize: 12, color: C.textLight, margin: "4px 0 0" }}>{t('buddy.desc')}</p>
          </div>
          <button onClick={() => {
            if (COLLABORATEURS.length < 2) return;
            showPrompt(t('buddy.newcomer'), (newcomerId: string) => {
              if (!newcomerId) return;
              const nc = COLLABORATEURS.find((c: any) => String(c.id) === newcomerId);
              if (!nc) return;
              setTimeout(() => showPrompt(t('buddy.mentor'), (buddyId: string) => {
                if (!buddyId) return;
                const bd = COLLABORATEURS.find((c: any) => String(c.id) === buddyId);
                if (!bd) return;
                createBuddyPair({ newcomer_id: nc.id, buddy_id: bd.id }).then(() => {
                  reloadPairs();
                  addToast_admin(lang === "fr" ? "Binôme créé" : "Pair created");
                }).catch(() => addToast_admin(lang === "fr" ? "Erreur" : "Error"));
              }, { options: COLLABORATEURS.filter((c: any) => String(c.id) !== newcomerId).map((c: any) => ({ value: String(c.id), label: `${c.prenom} ${c.nom} — ${c.poste || c.departement || ""}` })), searchable: true }), 100);
            }, { options: COLLABORATEURS.map((c: any) => ({ value: String(c.id), label: `${c.prenom} ${c.nom} — ${c.poste || c.departement || ""}` })), searchable: true });
          }} className="iz-btn-pink" style={{ ...sBtn("pink"), display: "flex", alignItems: "center", gap: 6 }}>
            <Plus size={14} /> {t('buddy.assign')}
          </button>
        </div>

        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
          {[
            { label: t('buddy.stats_active'), value: activePairs.length, color: C.pink, icon: Handshake },
            { label: t('buddy.stats_completed'), value: completedPairs.length, color: "#4CAF50", icon: CheckCircle },
            { label: t('buddy.stats_avg_rating'), value: avgRating, color: "#F9A825", icon: Star },
            { label: t('buddy.feedback_pending'), value: feedbackPending, color: C.blue, icon: Clock },
          ].map((s, i) => (
            <div key={i} className="iz-card" style={{ ...sCard, textAlign: "center", padding: "16px" }}>
              <s.icon size={24} color={s.color} style={{ marginBottom: 6 }} />
              <div style={{ fontSize: 24, fontWeight: 700, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 11, color: C.textLight, marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {buddyPairs.length === 0 && (
          <div className="iz-card" style={{ ...sCard, padding: "48px 24px", textAlign: "center" }}>
            <Handshake size={48} color={C.textLight} style={{ marginBottom: 12, opacity: 0.4 }} />
            <p style={{ color: C.textLight, fontSize: 13 }}>{t('buddy.no_pairs')}</p>
          </div>
        )}

        {/* Main layout: list + detail */}
        {buddyPairs.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: selectedPair ? "360px 1fr" : "1fr", gap: 16 }}>
            {/* Pairs list */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {buddyPairs.map((pair: any) => {
                const prog = getProgress(pair.checklist);
                const isSelected = selectedBuddyPair === pair.id;
                return (
                  <div key={pair.id} onClick={() => setSelectedBuddyPair(isSelected ? null : pair.id)}
                    className="iz-card" style={{
                      ...sCard, padding: "14px 16px", cursor: "pointer", transition: "all .15s",
                      border: isSelected ? `2px solid ${C.pink}` : `1px solid ${C.border}`,
                      background: isSelected ? colorWithAlpha(C.pink, 0.04) : C.white,
                    }}>
                    {/* Newcomer <-> Buddy */}
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <div style={{ width: 32, height: 32, borderRadius: "50%", background: pair.newcomer.color, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 11, fontWeight: 700 }}>
                        {pair.newcomer.initials}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {pair.newcomer.prenom} {pair.newcomer.nom}
                        </div>
                        <div style={{ fontSize: 10, color: C.textLight }}>{t('buddy.newcomer')}</div>
                      </div>
                      <ArrowRight size={14} color={C.textLight} />
                      <div style={{ width: 32, height: 32, borderRadius: "50%", background: pair.buddy.color, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 11, fontWeight: 700 }}>
                        {pair.buddy.initials}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {pair.buddy.prenom} {pair.buddy.nom}
                        </div>
                        <div style={{ fontSize: 10, color: C.textLight }}>{t('buddy.mentor')}</div>
                      </div>
                    </div>
                    {/* Progress + status */}
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ flex: 1, height: 6, borderRadius: 3, background: C.grayLight }}>
                        <div style={{ width: `${prog.pct}%`, height: "100%", borderRadius: 3, background: prog.pct === 100 ? "#4CAF50" : C.pink, transition: "width .3s" }} />
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 600, color: prog.pct === 100 ? "#4CAF50" : C.pink }}>{prog.done}/{prog.total}</span>
                      <span style={{
                        fontSize: 10, padding: "2px 8px", borderRadius: 8, fontWeight: 600,
                        background: pair.status === 'completed' ? "#E8F5E9" : colorWithAlpha(C.pink, 0.12),
                        color: pair.status === 'completed' ? "#4CAF50" : C.pink,
                      }}>
                        {pair.status === 'completed' ? t('buddy.stats_completed') : t('buddy.stats_active')}
                      </span>
                    </div>
                    <div style={{ fontSize: 10, color: C.textLight, marginTop: 6 }}>{t('buddy.since')} {fmtD(pair.created_at || pair.startDate)}</div>
                  </div>
                );
              })}
            </div>

            {/* Detail panel */}
            {selectedPair && (
              <div className="iz-card" style={{ ...sCard, padding: "20px 24px" }}>
                {/* Header */}
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, paddingBottom: 16, borderBottom: `1px solid ${C.border}` }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: selectedPair.newcomer.color, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 13, fontWeight: 700 }}>
                    {selectedPair.newcomer.initials}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>{selectedPair.newcomer.prenom} {selectedPair.newcomer.nom}</div>
                    <div style={{ fontSize: 11, color: C.textLight }}>{selectedPair.newcomer.poste}</div>
                  </div>
                  <ArrowRight size={16} color={C.textLight} style={{ margin: "0 4px" }} />
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: selectedPair.buddy.color, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 13, fontWeight: 700 }}>
                    {selectedPair.buddy.initials}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>{selectedPair.buddy.prenom} {selectedPair.buddy.nom}</div>
                    <div style={{ fontSize: 11, color: C.textLight }}>{selectedPair.buddy.poste}</div>
                  </div>
                </div>

                {/* Tabs */}
                <div style={{ display: "flex", gap: 0, marginBottom: 16, borderBottom: `1px solid ${C.border}` }}>
                  {([
                    { key: "checklist" as const, label: t('buddy.checklist') },
                    { key: "notes" as const, label: t('buddy.notes') },
                    { key: "feedback" as const, label: t('buddy.feedback') },
                  ]).map(tab => (
                    <button key={tab.key} onClick={() => setBuddyTab(tab.key)}
                      style={{
                        padding: "8px 16px", fontSize: 12, fontWeight: buddyTab === tab.key ? 700 : 500, cursor: "pointer",
                        background: "none", border: "none", borderBottom: buddyTab === tab.key ? `2px solid ${C.pink}` : "2px solid transparent",
                        color: buddyTab === tab.key ? C.pink : C.textLight, transition: "all .15s",
                      }}>
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Checklist tab */}
                {buddyTab === "checklist" && (
                  <div>
                    {(() => {
                      const prog = getProgress(selectedPair.checklist);
                      return (
                        <div style={{ marginBottom: 16 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                            <span style={{ fontSize: 12, fontWeight: 600 }}>{t('buddy.progress')}</span>
                            <span style={{ fontSize: 12, fontWeight: 700, color: prog.pct === 100 ? "#4CAF50" : C.pink }}>{prog.done}/{prog.total} ({prog.pct}%)</span>
                          </div>
                          <div style={{ height: 8, borderRadius: 4, background: C.grayLight }}>
                            <div style={{ width: `${prog.pct}%`, height: "100%", borderRadius: 4, background: prog.pct === 100 ? "#4CAF50" : C.pink, transition: "width .3s" }} />
                          </div>
                        </div>
                      );
                    })()}
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {CHECKLIST_KEYS.map((key, idx) => (
                        <label key={key} style={{
                          display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 8, cursor: "pointer",
                          background: selectedPair.checklist[idx] ? colorWithAlpha("#4CAF50", 0.06) : C.grayLight,
                          border: `1px solid ${selectedPair.checklist[idx] ? colorWithAlpha("#4CAF50", 0.2) : C.border}`,
                          transition: "all .15s",
                        }}>
                          <input type="checkbox" checked={selectedPair.checklist[idx]} onChange={() => toggleChecklist(selectedPair.id, idx)}
                            style={{ accentColor: C.pink, width: 16, height: 16, cursor: "pointer" }} />
                          <span style={{ fontSize: 13, fontWeight: selectedPair.checklist[idx] ? 600 : 400, color: selectedPair.checklist[idx] ? "#4CAF50" : C.text, textDecoration: selectedPair.checklist[idx] ? "line-through" : "none" }}>
                            {t(key)}
                          </span>
                          {selectedPair.checklist[idx] && <Check size={14} color="#4CAF50" style={{ marginLeft: "auto" }} />}
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes tab */}
                {buddyTab === "notes" && (
                  <div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
                      {selectedPair.notes.length === 0 && (
                        <p style={{ fontSize: 12, color: C.textLight, textAlign: "center", padding: 20 }}>—</p>
                      )}
                      {selectedPair.notes.map((note: any, idx: number) => (
                        <div key={idx} style={{ padding: "10px 14px", borderRadius: 8, background: C.grayLight, border: `1px solid ${C.border}` }}>
                          <div style={{ fontSize: 13 }}>{note.text}</div>
                          <div style={{ fontSize: 10, color: C.textLight, marginTop: 4 }}>{fmtD(note.date)}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <input value={noteInput} onChange={(e) => setNoteInput(e.target.value)} placeholder={t('buddy.notes') + '...'}
                        onKeyDown={(e) => { if (e.key === 'Enter') addNote(selectedPair.id); }}
                        style={{ ...sInput, flex: 1, fontSize: 12 }} />
                      <button onClick={() => addNote(selectedPair.id)} className="iz-btn-pink" style={{ ...sBtn("pink"), fontSize: 12 }}>{t('buddy.add_note')}</button>
                    </div>
                  </div>
                )}

                {/* Feedback tab */}
                {buddyTab === "feedback" && (
                  <div>
                    {/* Existing rating display */}
                    {selectedPair.rating != null && (
                      <div style={{ padding: "14px 16px", borderRadius: 10, background: colorWithAlpha("#F9A825", 0.08), border: `1px solid ${colorWithAlpha("#F9A825", 0.2)}`, marginBottom: 16 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6 }}>{t('buddy.rating')}</div>
                        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          {[1, 2, 3, 4, 5].map(s => (
                            <Star key={s} size={20} fill={s <= Math.round(selectedPair.rating) ? "#F9A825" : "none"} color={s <= Math.round(selectedPair.rating) ? "#F9A825" : C.textLight} />
                          ))}
                          <span style={{ fontSize: 14, fontWeight: 700, marginLeft: 8, color: "#F9A825" }}>{selectedPair.rating}/5</span>
                        </div>
                        {selectedPair.feedback_comment || selectedPair.feedbackComment && (
                          <div style={{ fontSize: 12, color: C.text, marginTop: 8, fontStyle: "italic" }}>"{selectedPair.feedback_comment || selectedPair.feedbackComment}"</div>
                        )}
                      </div>
                    )}

                    {/* Rating form */}
                    <div style={{ padding: "16px", borderRadius: 10, background: C.grayLight, border: `1px solid ${C.border}` }}>
                      <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 10 }}>{selectedPair.rating != null ? t('buddy.rating') + ' (modifier)' : t('buddy.rating')}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 12 }}>
                        {[1, 2, 3, 4, 5].map(s => (
                          <Star key={s} size={28} onClick={() => setFeedbackRating(s)} style={{ cursor: "pointer", transition: "transform .1s" }}
                            fill={s <= feedbackRating ? "#F9A825" : "none"} color={s <= feedbackRating ? "#F9A825" : C.textLight}
                            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.2)")}
                            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")} />
                        ))}
                        {feedbackRating > 0 && <span style={{ fontSize: 14, fontWeight: 700, marginLeft: 8, color: "#F9A825" }}>{feedbackRating}/5</span>}
                      </div>
                      <textarea value={feedbackComment} onChange={(e) => setFeedbackComment(e.target.value)}
                        placeholder={t('buddy.comment') + '...'}
                        rows={3} style={{ ...sInput, width: "100%", fontSize: 12, resize: "vertical", marginBottom: 10 }} />
                      <button onClick={() => submitFeedback(selectedPair.id)} disabled={feedbackRating === 0}
                        className="iz-btn-pink" style={{ ...sBtn("pink"), fontSize: 12, opacity: feedbackRating === 0 ? 0.5 : 1 }}>
                        {t('buddy.submit_feedback')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };
}
