import { Fragment } from 'react';
import { t } from '../../i18n';
import { C, font, sCard, sBtn, sInput } from '../../constants';
import {
  ChevronLeft, ChevronRight, UserPlus, CalendarDays, GraduationCap, AlertTriangle, Clock,
  X, FileText, Briefcase, Search, Filter,
} from 'lucide-react';

type CalEvent = {
  date: Date;
  type: string;
  title: string;
  subtitle: string;
  color: string;
  collaborateur_id?: number;
  action_id?: number;
};

export function createAdminCalendar(ctx: any) {
  const {
    calendarMonth, setCalendarMonth, calendarView, setCalendarView,
    calendarListFilter, setCalendarListFilter,
    calendarEvents, setCalendarEvents, calendarEventsKey, setCalendarEventsKey,
    COLLABORATEURS, addToast_admin, showPrompt,
  } = ctx;

  return function renderAdminCalendar() {
    const DAY_KEYS = ['calendar.mon', 'calendar.tue', 'calendar.wed', 'calendar.thu', 'calendar.fri', 'calendar.sat', 'calendar.sun'];
    const VIEW_OPTS: { key: "month" | "week" | "list"; label: string }[] = [
      { key: "month", label: t('calendar.month') },
      { key: "week", label: t('calendar.week') },
      { key: "list", label: t('calendar.list') },
    ];

    const today = new Date();
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();

    // ── Load events from backend ONLY (no frontend duplication) ──
    const calKey = `${year}-${month}`;
    if (calendarEventsKey !== calKey && setCalendarEvents) {
      setCalendarEventsKey(calKey);
      import('../../api/endpoints').then(m => m.getCalendarEvents(year, month + 1)).then((apiEvents: any[]) => {
        setCalendarEvents((apiEvents || []).map((e: any) => ({
          date: new Date(e.date + 'T00:00:00'),
          type: e.type,
          title: e.title,
          subtitle: e.subtitle || '',
          color: e.color,
          collaborateur_id: e.collaborateur_id,
          action_id: e.action_id,
        })));
      }).catch(() => setCalendarEvents([]));
    }

    const events: CalEvent[] = calendarEvents || [];

    // ── Collab filter ──
    const collabFilter = ctx._calCollabFilter || '';
    const filteredEvents = collabFilter
      ? events.filter(e => e.collaborateur_id === Number(collabFilter))
      : events;

    // ── Selected event detail ──
    const selectedEvent: CalEvent | null = ctx._calSelectedEvent || null;

    // ── Helpers ──
    const isSameDay = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
    const isToday = (d: Date) => isSameDay(d, today);
    const eventsForDay = (d: Date) => filteredEvents.filter(e => isSameDay(e.date, d));

    const monthName = calendarMonth.toLocaleString('fr-CH', { month: 'long', year: 'numeric' });
    const prevMonth = () => { setCalendarMonth(new Date(year, month - 1, 1)); };
    const nextMonth = () => { setCalendarMonth(new Date(year, month + 1, 1)); };
    const goToday = () => setCalendarMonth(new Date());

    const selectEvent = (ev: CalEvent) => {
      ctx._calSelectedEvent = ev;
      setCalendarEvents([...events]); // trigger re-render
    };
    const closeDetail = () => {
      ctx._calSelectedEvent = null;
      setCalendarEvents([...events]);
    };

    // ── Event icon ──
    const EventIcon = ({ type, size = 12 }: { type: string; size?: number }) => {
      switch (type) {
        case 'arrival': return <UserPlus size={size} />;
        case 'meeting': case 'entretien': case 'rdv': return <CalendarDays size={size} />;
        case 'training': case 'formation': return <GraduationCap size={size} />;
        case 'probation_end': return <AlertTriangle size={size} />;
        case 'document': case 'signature': return <FileText size={size} />;
        default: return <Clock size={size} />;
      }
    };

    // ── Event type label ──
    const typeLabel = (type: string) => {
      const labels: Record<string, string> = {
        arrival: 'Arrivée', probation_end: 'Fin période essai', meeting: 'Réunion',
        training: 'Formation', entretien: 'Entretien', rdv: 'Rendez-vous',
        visite: 'Visite', formation: 'Formation', document: 'Document',
        signature: 'Signature', questionnaire: 'Questionnaire', deadline: 'Échéance',
      };
      return labels[type] || type;
    };

    // ── Build month grid ──
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    let startDow = firstDay.getDay();
    startDow = startDow === 0 ? 6 : startDow - 1;
    const gridDays: Date[] = [];
    for (let i = startDow - 1; i >= 0; i--) gridDays.push(new Date(year, month, -i));
    for (let d = 1; d <= lastDay.getDate(); d++) gridDays.push(new Date(year, month, d));
    while (gridDays.length % 7 !== 0) gridDays.push(new Date(year, month + 1, gridDays.length - startDow - lastDay.getDate() + 1));

    // ── Week days ──
    const getWeekDays = (): Date[] => {
      const d = new Date(calendarMonth);
      let dow = d.getDay();
      dow = dow === 0 ? 6 : dow - 1;
      const mon = new Date(d);
      mon.setDate(d.getDate() - dow);
      return Array.from({ length: 7 }, (_, i) => { const r = new Date(mon); r.setDate(mon.getDate() + i); return r; });
    };

    // ── Stats ──
    const monthEvents = filteredEvents.filter(e => e.date.getMonth() === month && e.date.getFullYear() === year);
    const statsArrivals = monthEvents.filter(e => e.type === 'arrival').length;
    const statsDeadlines = monthEvents.filter(e => e.type === 'deadline' || e.type === 'probation_end').length;
    const statsActions = monthEvents.filter(e => !['arrival', 'probation_end'].includes(e.type)).length;

    // ── Upcoming ──
    const upcoming = filteredEvents.filter(e => e.date >= today).sort((a, b) => a.date.getTime() - b.date.getTime()).slice(0, 6);

    // ── List view events ──
    const futureEvents = filteredEvents.filter(e => e.date >= new Date(today.getFullYear(), today.getMonth(), today.getDate())).sort((a, b) => a.date.getTime() - b.date.getTime());
    const eventsByDay: Record<string, CalEvent[]> = {};
    futureEvents.forEach(e => {
      const key = e.date.toISOString().slice(0, 10);
      if (!eventsByDay[key]) eventsByDay[key] = [];
      eventsByDay[key].push(e);
    });

    // ── Pill style ──
    const pillBtn = (active: boolean): React.CSSProperties => ({
      padding: "6px 16px", borderRadius: 20, fontSize: 13, fontWeight: active ? 600 : 400, cursor: "pointer",
      border: active ? `2px solid ${C.pink}` : `1px solid ${C.border}`, fontFamily: font, transition: "all .15s",
      background: active ? C.pink : C.white, color: active ? "#fff" : C.text,
    });

    // ── Unique collabs for filter ──
    const collabIds = [...new Set(events.map(e => e.collaborateur_id).filter(Boolean))];
    const collabOptions = collabIds.map(id => {
      const c = (COLLABORATEURS || []).find((c: any) => c.id === id);
      return c ? { id, label: `${c.prenom} ${c.nom}` } : { id, label: `#${id}` };
    }).sort((a, b) => a.label.localeCompare(b.label));

    // ── Week view: distribute events by type into time slots ──
    const typeToHour: Record<string, number> = {
      arrival: 9, probation_end: 9, entretien: 10, rdv: 11, meeting: 10,
      visite: 14, formation: 15, training: 15, document: 11, signature: 13,
      questionnaire: 16, deadline: 17, tache: 14,
    };

    return (
      <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Header */}
          <div style={{ ...sCard, marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
              <div>
                <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: C.text, fontFamily: font }}>{t('calendar.title')}</h2>
                <p style={{ margin: "4px 0 0", fontSize: 13, color: C.textMuted }}>{t('calendar.desc')}</p>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                {VIEW_OPTS.map(v => (
                  <button key={v.key} onClick={() => setCalendarView(v.key)} style={pillBtn(calendarView === v.key)}>{v.label}</button>
                ))}
              </div>
            </div>
            {/* Navigation + collab filter */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <button onClick={prevMonth} style={{ ...sBtn("outline"), padding: "6px 10px", borderRadius: 8, cursor: "pointer" }}><ChevronLeft size={18} /></button>
              <span style={{ fontSize: 16, fontWeight: 600, color: C.text, fontFamily: font, textTransform: "capitalize", minWidth: 160, textAlign: "center" }}>{monthName}</span>
              <button onClick={nextMonth} style={{ ...sBtn("outline"), padding: "6px 10px", borderRadius: 8, cursor: "pointer" }}><ChevronRight size={18} /></button>
              <button onClick={goToday} className="iz-btn-pink" style={{ ...sBtn("pink"), padding: "6px 16px", fontSize: 13 }}>{t('calendar.today')}</button>
              <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6 }}>
                <Filter size={13} color={C.textMuted} />
                <select
                  value={collabFilter}
                  onChange={e => { ctx._calCollabFilter = e.target.value; setCalendarEvents([...events]); }}
                  style={{ ...sInput, padding: "5px 10px", fontSize: 12, minWidth: 160 }}
                >
                  <option value="">Tous les collaborateurs</option>
                  {collabOptions.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* MONTH VIEW */}
          {calendarView === "month" && (
            <div style={{ ...sCard }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 1, marginBottom: 4 }}>
                {DAY_KEYS.map((dk, i) => (
                  <div key={dk} style={{ textAlign: "center", fontSize: 12, fontWeight: 600, color: i >= 5 ? C.textMuted : C.textLight, padding: "8px 0", fontFamily: font }}>{t(dk)}</div>
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 1 }}>
                {gridDays.map((day, idx) => {
                  const isCurrentMonth = day.getMonth() === month;
                  const dayEvents = eventsForDay(day);
                  const isTodayCell = isToday(day);
                  const isWeekend = idx % 7 >= 5;
                  return (
                    <div key={idx} style={{
                      minHeight: 90, padding: 6, borderRadius: 8, border: `1px solid ${isTodayCell ? C.pink : 'transparent'}`,
                      background: isTodayCell ? (C.pink + '10') : isWeekend ? C.bg : C.white,
                      opacity: isCurrentMonth ? 1 : 0.4,
                    }}>
                      <div style={{ fontSize: 13, fontWeight: isTodayCell ? 700 : 500, color: isTodayCell ? C.pink : C.text, marginBottom: 4, fontFamily: font }}>{day.getDate()}</div>
                      {dayEvents.slice(0, 3).map((ev, ei) => (
                        <div key={ei} onClick={() => selectEvent(ev)} style={{
                          display: "flex", alignItems: "center", gap: 4, padding: "2px 6px", borderRadius: 4,
                          background: ev.color + '18', marginBottom: 2, cursor: "pointer",
                        }}>
                          <div style={{ width: 6, height: 6, borderRadius: "50%", background: ev.color, flexShrink: 0 }} />
                          <span style={{ fontSize: 10, color: C.text, fontFamily: font, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ev.title}</span>
                        </div>
                      ))}
                      {dayEvents.length > 3 && <div style={{ fontSize: 10, color: C.textMuted, paddingLeft: 6, fontFamily: font }}>+{dayEvents.length - 3}</div>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* WEEK VIEW */}
          {calendarView === "week" && (
            <div style={{ ...sCard }}>
              <div style={{ display: "grid", gridTemplateColumns: "60px repeat(7, 1fr)", gap: 1 }}>
                <div style={{ padding: 8 }} />
                {getWeekDays().map((day, i) => (
                  <div key={i} style={{ textAlign: "center", padding: "8px 4px", borderBottom: `1px solid ${C.border}`, background: isToday(day) ? (C.pink + '10') : 'transparent', borderRadius: "8px 8px 0 0" }}>
                    <div style={{ fontSize: 11, color: C.textMuted, fontFamily: font }}>{t(DAY_KEYS[i])}</div>
                    <div style={{ fontSize: 18, fontWeight: isToday(day) ? 700 : 500, color: isToday(day) ? C.pink : C.text, fontFamily: font }}>{day.getDate()}</div>
                  </div>
                ))}
                {Array.from({ length: 11 }, (_, h) => h + 8).map(hour => (
                  <Fragment key={hour}>
                    <div style={{ fontSize: 11, color: C.textMuted, padding: "8px 4px", textAlign: "right", fontFamily: font, borderRight: `1px solid ${C.border}` }}>{hour}h</div>
                    {getWeekDays().map((day, di) => {
                      const dayEvs = eventsForDay(day);
                      const slotEvs = dayEvs.filter(e => (typeToHour[e.type] || 14) === hour);
                      return (
                        <div key={di} style={{
                          minHeight: 40, padding: 2, borderBottom: `1px solid ${C.border}`, borderRight: di < 6 ? `1px solid ${C.border}` : 'none',
                          background: isToday(day) ? (C.pink + '06') : 'transparent',
                        }}>
                          {slotEvs.map((ev, ei) => (
                            <div key={ei} onClick={() => selectEvent(ev)} style={{
                              display: "flex", alignItems: "center", gap: 4, padding: "3px 6px", borderRadius: 6,
                              background: ev.color + '20', borderLeft: `3px solid ${ev.color}`, marginBottom: 2, cursor: "pointer",
                            }}>
                              <EventIcon type={ev.type} />
                              <span style={{ fontSize: 10, fontWeight: 600, color: C.text, fontFamily: font, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ev.title}</span>
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </Fragment>
                ))}
              </div>
            </div>
          )}

          {/* LIST VIEW */}
          {calendarView === "list" && (
            <div style={{ ...sCard }}>
              <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
                {[
                  { key: 'all', label: 'Tous' },
                  { key: 'arrival', label: 'Arrivées' },
                  { key: 'probation_end', label: 'Fins essai' },
                  { key: 'entretien', label: 'Entretiens' },
                  { key: 'formation', label: 'Formations' },
                  { key: 'document', label: 'Documents' },
                ].map(f => (
                  <button key={f.key} onClick={() => setCalendarListFilter(f.key)} style={pillBtn(calendarListFilter === f.key)}>{f.label}</button>
                ))}
              </div>
              {Object.keys(eventsByDay).length === 0 && (
                <div style={{ textAlign: "center", padding: 40, color: C.textMuted, fontFamily: font }}>{t('calendar.no_events')}</div>
              )}
              {Object.entries(eventsByDay).map(([dateStr, dayEvts]) => {
                const filtered = calendarListFilter === 'all' ? dayEvts : dayEvts.filter(e => e.type === calendarListFilter);
                if (filtered.length === 0) return null;
                const d = new Date(dateStr + 'T00:00:00');
                return (
                  <div key={dateStr} style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: isToday(d) ? C.pink : C.text, marginBottom: 8, fontFamily: font, textTransform: "capitalize" }}>
                      {d.toLocaleDateString('fr-CH', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                      {isToday(d) && <span style={{ marginLeft: 8, fontSize: 11, background: C.pink, color: '#fff', padding: "2px 8px", borderRadius: 10 }}>{t('calendar.today')}</span>}
                    </div>
                    {filtered.map((ev, i) => (
                      <div key={i} onClick={() => selectEvent(ev)} style={{
                        display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 8,
                        border: `1px solid ${C.border}`, marginBottom: 6, background: C.white, cursor: "pointer", transition: "all .15s",
                      }}>
                        <div style={{ width: 10, height: 10, borderRadius: "50%", background: ev.color, flexShrink: 0 }} />
                        <div style={{ color: ev.color, flexShrink: 0 }}><EventIcon type={ev.type} /></div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 14, fontWeight: 600, color: C.text, fontFamily: font }}>{ev.title}</div>
                          {ev.subtitle && <div style={{ fontSize: 12, color: C.textMuted, fontFamily: font }}>{ev.subtitle}</div>}
                        </div>
                        <span style={{ fontSize: 10, fontWeight: 600, padding: "3px 10px", borderRadius: 10, background: ev.color + '18', color: ev.color, fontFamily: font }}>
                          {typeLabel(ev.type)}
                        </span>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* SIDEBAR */}
        <div style={{ width: 280, flexShrink: 0 }}>
          {/* Event detail modal (if selected) */}
          {selectedEvent && (
            <div style={{ ...sCard, marginBottom: 16, border: `2px solid ${selectedEvent.color}` }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, color: selectedEvent.color }}>
                  <EventIcon type={selectedEvent.type} size={16} />
                  <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase" }}>{typeLabel(selectedEvent.type)}</span>
                </div>
                <button onClick={closeDetail} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={16} color={C.textMuted} /></button>
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 4 }}>{selectedEvent.title}</div>
              {selectedEvent.subtitle && <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 8 }}>{selectedEvent.subtitle}</div>}
              <div style={{ fontSize: 12, color: C.textLight, marginBottom: 12 }}>
                {selectedEvent.date.toLocaleDateString('fr-CH', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
              {selectedEvent.collaborateur_id && (() => {
                const collab = (COLLABORATEURS || []).find((c: any) => c.id === selectedEvent.collaborateur_id);
                if (!collab) return null;
                return (
                  <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: 8, background: C.bg }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: collab.color || C.pink, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 10 }}>
                      {collab.initials || `${(collab.prenom||'')[0]}${(collab.nom||'')[0]}`}
                    </div>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600 }}>{collab.prenom} {collab.nom}</div>
                      <div style={{ fontSize: 10, color: C.textMuted }}>{collab.poste || collab.departement}</div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* Upcoming events */}
          <div style={{ ...sCard, marginBottom: 16 }}>
            <h3 style={{ margin: "0 0 12px", fontSize: 15, fontWeight: 700, color: C.text, fontFamily: font }}>{t('calendar.upcoming')}</h3>
            {upcoming.length === 0 && <div style={{ fontSize: 13, color: C.textMuted, fontFamily: font }}>{t('calendar.no_events')}</div>}
            {upcoming.map((ev, i) => (
              <div key={i} onClick={() => selectEvent(ev)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i < upcoming.length - 1 ? `1px solid ${C.border}` : 'none', cursor: "pointer" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: ev.color, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.text, fontFamily: font, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ev.title}</div>
                  <div style={{ fontSize: 11, color: C.textMuted, fontFamily: font }}>{ev.date.toLocaleDateString('fr-CH', { day: 'numeric', month: 'short' })}</div>
                </div>
                <div style={{ color: ev.color }}><EventIcon type={ev.type} /></div>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div style={{ ...sCard }}>
            <h3 style={{ margin: "0 0 12px", fontSize: 15, fontWeight: 700, color: C.text, fontFamily: font }}>Stats du mois</h3>
            {[
              { count: statsArrivals, label: 'Arrivées', color: '#4CAF50', icon: <UserPlus size={14} /> },
              { count: statsDeadlines, label: 'Fins essai / échéances', color: '#F9A825', icon: <AlertTriangle size={14} /> },
              { count: statsActions, label: 'Actions / événements', color: '#1A73E8', icon: <CalendarDays size={14} /> },
            ].map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i < 2 ? `1px solid ${C.border}` : 'none' }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: s.color + '18', display: "flex", alignItems: "center", justifyContent: "center", color: s.color }}>{s.icon}</div>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: C.text, fontFamily: font }}>{s.count}</div>
                  <div style={{ fontSize: 11, color: C.textMuted, fontFamily: font }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
}
