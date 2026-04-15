import { Fragment } from 'react';
import { t } from '../../i18n';
import { C, font, sCard, sBtn, sInput } from '../../constants';
import {
  ChevronLeft, ChevronRight, UserPlus, CalendarDays, GraduationCap, AlertTriangle, Clock,
} from 'lucide-react';

export function createAdminCalendar(ctx: any) {
  const {
    calendarMonth, setCalendarMonth, calendarView, setCalendarView,
    calendarListFilter, setCalendarListFilter,
    COLLABORATEURS, demoMode,
  } = ctx;

  return function renderAdminCalendar() {
    const DAY_KEYS = ['calendar.mon', 'calendar.tue', 'calendar.wed', 'calendar.thu', 'calendar.fri', 'calendar.sat', 'calendar.sun'];
    const VIEW_OPTS: { key: "month" | "week" | "list"; label: string }[] = [
      { key: "month", label: t('calendar.month') },
      { key: "week", label: t('calendar.week') },
      { key: "list", label: t('calendar.list') },
    ];

    // -- Generate events from COLLABORATEURS --
    type CalEvent = { date: Date; type: 'arrival' | 'deadline' | 'meeting' | 'training' | 'probation_end'; title: string; subtitle: string; color: string };
    const events: CalEvent[] = [];

    (COLLABORATEURS || []).forEach((c: any) => {
      if (c.dateDebut) {
        events.push({ date: new Date(c.dateDebut), type: 'arrival', title: `${c.prenom} ${c.nom}`, subtitle: c.poste || c.departement || '', color: '#4CAF50' });
        const d = new Date(c.dateDebut);
        d.setMonth(d.getMonth() + 3);
        events.push({ date: d, type: 'probation_end', title: `${t('calendar.probation_end')} — ${c.prenom} ${c.nom}`, subtitle: '', color: '#F9A825' });
      }
    });

    const today = new Date();
    if (demoMode) {
      events.push(
        { date: new Date(today.getFullYear(), today.getMonth(), 15), type: 'meeting', title: 'Point RH mensuel', subtitle: 'Salle A - 10h00', color: '#1A73E8' },
        { date: new Date(today.getFullYear(), today.getMonth(), 18), type: 'training', title: 'Formation sécurité', subtitle: 'En ligne - 14h00', color: '#7B5EA7' },
        { date: new Date(today.getFullYear(), today.getMonth(), 22), type: 'meeting', title: 'Revue onboarding Q2', subtitle: 'Salle B - 11h00', color: '#1A73E8' },
      );
    }

    // -- Helpers --
    const isSameDay = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
    const isToday = (d: Date) => isSameDay(d, today);
    const eventsForDay = (d: Date) => events.filter(e => isSameDay(e.date, d));

    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const monthName = calendarMonth.toLocaleString('default', { month: 'long', year: 'numeric' });

    const prevMonth = () => { const d = new Date(year, month - 1, 1); setCalendarMonth(d); };
    const nextMonth = () => { const d = new Date(year, month + 1, 1); setCalendarMonth(d); };
    const goToday = () => setCalendarMonth(new Date());

    // Build grid days for month view
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    let startDow = firstDay.getDay(); // 0=Sun
    startDow = startDow === 0 ? 6 : startDow - 1; // convert to 0=Mon

    const gridDays: Date[] = [];
    // Fill days before month
    for (let i = startDow - 1; i >= 0; i--) {
      gridDays.push(new Date(year, month, -i));
    }
    // Days of month
    for (let d = 1; d <= lastDay.getDate(); d++) {
      gridDays.push(new Date(year, month, d));
    }
    // Fill to complete last week (up to 42 cells max)
    while (gridDays.length % 7 !== 0) {
      gridDays.push(new Date(year, month + 1, gridDays.length - startDow - lastDay.getDate() + 1));
    }

    // Week view: get current week (Mon-Sun)
    const getWeekDays = (): Date[] => {
      const d = new Date(calendarMonth);
      let dow = d.getDay();
      dow = dow === 0 ? 6 : dow - 1;
      const mon = new Date(d);
      mon.setDate(d.getDate() - dow);
      return Array.from({ length: 7 }, (_, i) => { const r = new Date(mon); r.setDate(mon.getDate() + i); return r; });
    };

    // Event icon component
    const EventIcon = ({ type }: { type: string }) => {
      const size = 12;
      switch (type) {
        case 'arrival': return <UserPlus size={size} />;
        case 'meeting': return <CalendarDays size={size} />;
        case 'training': return <GraduationCap size={size} />;
        case 'probation_end': return <AlertTriangle size={size} />;
        default: return <Clock size={size} />;
      }
    };

    // Upcoming events (next 5)
    const upcoming = events
      .filter(e => e.date >= today)
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, 5);

    // Stats for current month
    const monthEvents = events.filter(e => e.date.getMonth() === month && e.date.getFullYear() === year);
    const statsArrivals = monthEvents.filter(e => e.type === 'arrival').length;
    const statsDeadlines = monthEvents.filter(e => e.type === 'deadline' || e.type === 'probation_end').length;
    const statsMeetings = monthEvents.filter(e => e.type === 'meeting').length;

    // Group events by day for list view
    const futureEvents = events.filter(e => e.date >= new Date(today.getFullYear(), today.getMonth(), today.getDate())).sort((a, b) => a.date.getTime() - b.date.getTime());
    const eventsByDay: Record<string, CalEvent[]> = {};
    futureEvents.forEach(e => {
      const key = e.date.toISOString().slice(0, 10);
      if (!eventsByDay[key]) eventsByDay[key] = [];
      eventsByDay[key].push(e);
    });

    // -- Pill button style --
    const pillBtn = (active: boolean): React.CSSProperties => ({
      padding: "6px 16px", borderRadius: 20, fontSize: 13, fontWeight: active ? 600 : 400, cursor: "pointer",
      border: active ? `2px solid ${C.pink}` : `1px solid ${C.border}`, fontFamily: font, transition: "all .15s",
      background: active ? C.pink : C.white, color: active ? "#fff" : C.text,
    });

    // -- Render --
    return (
      <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
        {/* Main content */}
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
            {/* Month navigation */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <button onClick={prevMonth} style={{ ...sBtn("outline"), padding: "6px 10px", borderRadius: 8, cursor: "pointer" }}><ChevronLeft size={18} /></button>
              <span style={{ fontSize: 16, fontWeight: 600, color: C.text, fontFamily: font, textTransform: "capitalize", minWidth: 160, textAlign: "center" }}>{monthName}</span>
              <button onClick={nextMonth} style={{ ...sBtn("outline"), padding: "6px 10px", borderRadius: 8, cursor: "pointer" }}><ChevronRight size={18} /></button>
              <button onClick={goToday} className="iz-btn-pink" style={{ ...sBtn("pink"), padding: "6px 16px", fontSize: 13 }}>{t('calendar.today')}</button>
            </div>
          </div>

          {/* -- MONTH VIEW -- */}
          {calendarView === "month" && (
            <div style={{ ...sCard }}>
              {/* Day headers */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 1, marginBottom: 4 }}>
                {DAY_KEYS.map((dk, i) => (
                  <div key={dk} style={{ textAlign: "center", fontSize: 12, fontWeight: 600, color: i >= 5 ? C.textMuted : C.textLight, padding: "8px 0", fontFamily: font }}>{t(dk)}</div>
                ))}
              </div>
              {/* Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 1 }}>
                {gridDays.map((day, idx) => {
                  const isCurrentMonth = day.getMonth() === month;
                  const dayEvents = eventsForDay(day);
                  const isTodayCell = isToday(day);
                  const isWeekend = idx % 7 >= 5;
                  return (
                    <div key={idx} style={{
                      minHeight: 90, padding: 6, borderRadius: 8, border: `1px solid ${isTodayCell ? C.pink : 'transparent'}`,
                      background: isTodayCell ? (C.pink + '10') : isWeekend ? (C.bg) : C.white,
                      opacity: isCurrentMonth ? 1 : 0.4, transition: "all .15s",
                    }}>
                      <div style={{ fontSize: 13, fontWeight: isTodayCell ? 700 : 500, color: isTodayCell ? C.pink : C.text, marginBottom: 4, fontFamily: font }}>
                        {day.getDate()}
                      </div>
                      {dayEvents.slice(0, 3).map((ev, ei) => (
                        <div key={ei} style={{
                          display: "flex", alignItems: "center", gap: 4, padding: "2px 6px", borderRadius: 4,
                          background: ev.color + '18', marginBottom: 2, cursor: "pointer",
                        }}>
                          <div style={{ width: 6, height: 6, borderRadius: "50%", background: ev.color, flexShrink: 0 }} />
                          <span style={{ fontSize: 10, color: C.text, fontFamily: font, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ev.title}</span>
                        </div>
                      ))}
                      {dayEvents.length > 3 && (
                        <div style={{ fontSize: 10, color: C.textMuted, paddingLeft: 6, fontFamily: font }}>+{dayEvents.length - 3} {t('calendar.more')}</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* -- WEEK VIEW -- */}
          {calendarView === "week" && (
            <div style={{ ...sCard }}>
              <div style={{ display: "grid", gridTemplateColumns: "60px repeat(7, 1fr)", gap: 1 }}>
                {/* Header row */}
                <div style={{ padding: 8 }} />
                {getWeekDays().map((day, i) => (
                  <div key={i} style={{
                    textAlign: "center", padding: "8px 4px", borderBottom: `1px solid ${C.border}`,
                    background: isToday(day) ? (C.pink + '10') : 'transparent', borderRadius: "8px 8px 0 0",
                  }}>
                    <div style={{ fontSize: 11, color: C.textMuted, fontFamily: font }}>{t(DAY_KEYS[i])}</div>
                    <div style={{ fontSize: 18, fontWeight: isToday(day) ? 700 : 500, color: isToday(day) ? C.pink : C.text, fontFamily: font }}>{day.getDate()}</div>
                  </div>
                ))}
                {/* Time slots */}
                {Array.from({ length: 11 }, (_, h) => h + 8).map(hour => (
                  <Fragment key={hour}>
                    <div style={{ fontSize: 11, color: C.textMuted, padding: "8px 4px", textAlign: "right", fontFamily: font, borderRight: `1px solid ${C.border}` }}>{hour}h</div>
                    {getWeekDays().map((day, di) => {
                      const dayEvs = eventsForDay(day);
                      // Show events roughly in the morning slot (8-12 first half, 12+ second half)
                      const slotEvs = hour === 9 ? dayEvs.filter(e => e.type === 'arrival' || e.type === 'probation_end') :
                                      hour === 10 ? dayEvs.filter(e => e.type === 'meeting') :
                                      hour === 14 ? dayEvs.filter(e => e.type === 'training') :
                                      [];
                      return (
                        <div key={di} style={{
                          minHeight: 40, padding: 2, borderBottom: `1px solid ${C.border}`, borderRight: di < 6 ? `1px solid ${C.border}` : 'none',
                          background: isToday(day) ? (C.pink + '06') : 'transparent',
                        }}>
                          {slotEvs.map((ev, ei) => (
                            <div key={ei} style={{
                              display: "flex", alignItems: "center", gap: 4, padding: "3px 6px", borderRadius: 6,
                              background: ev.color + '20', borderLeft: `3px solid ${ev.color}`, marginBottom: 2,
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

          {/* -- LIST VIEW -- */}
          {calendarView === "list" && (
            <div style={{ ...sCard }}>
              {/* Filter buttons */}
              <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
                {[
                  { key: 'all', label: t('calendar.all') },
                  { key: 'arrival', label: t('calendar.arrivals') },
                  { key: 'probation_end', label: t('calendar.deadlines') },
                  { key: 'meeting', label: t('calendar.meetings') },
                  { key: 'training', label: t('calendar.trainings') },
                ].map(f => (
                  <button key={f.key} onClick={() => setCalendarListFilter(f.key)}
                    style={pillBtn(calendarListFilter === f.key)}>{f.label}</button>
                ))}
              </div>
              {/* Event list grouped by day */}
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
                      {d.toLocaleDateString('default', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                      {isToday(d) && <span style={{ marginLeft: 8, fontSize: 11, background: C.pink, color: '#fff', padding: "2px 8px", borderRadius: 10 }}>{t('calendar.today')}</span>}
                    </div>
                    {filtered.map((ev, i) => (
                      <div key={i} style={{
                        display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 8,
                        border: `1px solid ${C.border}`, marginBottom: 6, background: C.white, transition: "all .15s",
                      }}>
                        <div style={{ width: 10, height: 10, borderRadius: "50%", background: ev.color, flexShrink: 0 }} />
                        <div style={{ color: ev.color, flexShrink: 0 }}><EventIcon type={ev.type} /></div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 14, fontWeight: 600, color: C.text, fontFamily: font }}>{ev.title}</div>
                          {ev.subtitle && <div style={{ fontSize: 12, color: C.textMuted, fontFamily: font }}>{ev.subtitle}</div>}
                        </div>
                        <span style={{
                          fontSize: 10, fontWeight: 600, padding: "3px 10px", borderRadius: 10,
                          background: ev.color + '18', color: ev.color, fontFamily: font, textTransform: "capitalize",
                        }}>
                          {ev.type === 'arrival' ? t('calendar.arrivals') : ev.type === 'meeting' ? t('calendar.meetings') : ev.type === 'training' ? t('calendar.trainings') : ev.type === 'probation_end' ? t('calendar.probation_end') : t('calendar.deadlines')}
                        </span>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* -- Sidebar: Upcoming + Stats -- */}
        {calendarView === "month" && (
          <div style={{ width: 280, flexShrink: 0 }}>
            {/* Upcoming events */}
            <div style={{ ...sCard, marginBottom: 16 }}>
              <h3 style={{ margin: "0 0 12px", fontSize: 15, fontWeight: 700, color: C.text, fontFamily: font }}>{t('calendar.upcoming')}</h3>
              {upcoming.length === 0 && <div style={{ fontSize: 13, color: C.textMuted, fontFamily: font }}>{t('calendar.no_events')}</div>}
              {upcoming.map((ev, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i < upcoming.length - 1 ? `1px solid ${C.border}` : 'none' }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: ev.color, flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: C.text, fontFamily: font, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ev.title}</div>
                    <div style={{ fontSize: 11, color: C.textMuted, fontFamily: font }}>{ev.date.toLocaleDateString('default', { day: 'numeric', month: 'short' })}</div>
                  </div>
                  <div style={{ color: ev.color }}><EventIcon type={ev.type} /></div>
                </div>
              ))}
            </div>
            {/* Quick stats */}
            <div style={{ ...sCard }}>
              <h3 style={{ margin: "0 0 12px", fontSize: 15, fontWeight: 700, color: C.text, fontFamily: font }}>Stats</h3>
              {[
                { count: statsArrivals, label: t('calendar.arrivals_month'), color: '#4CAF50', icon: <UserPlus size={14} /> },
                { count: statsDeadlines, label: t('calendar.deadlines_month'), color: '#F9A825', icon: <AlertTriangle size={14} /> },
                { count: statsMeetings, label: t('calendar.meetings_month'), color: '#1A73E8', icon: <CalendarDays size={14} /> },
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
        )}
      </div>
    );
  };
}
