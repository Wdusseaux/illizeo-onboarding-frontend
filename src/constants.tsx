// ─── CONSTANTS — extracted from Onboarding_v1.tsx ────────────

// ─── ANIMATIONS CSS (injected once) ─────────────────────────
export const ANIM_STYLES = `
@keyframes izFadeUp { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
@keyframes izFadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes izSlideRight { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
@keyframes izSlideLeft { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
@keyframes izScaleIn { from { opacity: 0; transform: scale(.92); } to { opacity: 1; transform: scale(1); } }
@keyframes izPulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
@keyframes izShimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
@keyframes izSlidePanel { from { transform: translateX(100%); } to { transform: translateX(0); } }
@keyframes izProgressFill { from { width: 0; } }
@keyframes izBounceIn { 0% { opacity:0; transform:scale(.3); } 50% { transform:scale(1.05); } 70% { transform:scale(.95); } 100% { opacity:1; transform:scale(1); } }
@keyframes izFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
@keyframes izGlow { 0%,100% { box-shadow: 0 0 8px var(--iz-pink-shadow, rgba(194,24,91,.15)); } 50% { box-shadow: 0 0 20px var(--iz-pink-shadow, rgba(194,24,91,.3)); } }

.iz-fade-up { animation: izFadeUp .45s ease both; }
.iz-fade-in { animation: izFadeIn .35s ease both; }
.iz-slide-r { animation: izSlideRight .4s ease both; }
.iz-slide-l { animation: izSlideLeft .4s ease both; }
.iz-scale-in { animation: izScaleIn .35s ease both; }
.iz-panel { animation: izSlidePanel .3s ease both; }
.iz-bounce { animation: izBounceIn .5s ease both; }
.iz-float { animation: izFloat 3s ease-in-out infinite; }
.iz-glow { animation: izGlow 2s ease-in-out infinite; }

.iz-card { transition: transform .2s ease, box-shadow .2s ease; }
.iz-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,.08); }

.iz-btn-pink { transition: all .15s ease; }
.iz-btn-pink:hover { transform: translateY(-1px); box-shadow: 0 4px 14px var(--iz-pink-shadow, rgba(194,24,91,.3)); }
.iz-btn-pink:active { transform: translateY(0); }

.iz-btn-outline { transition: all .15s ease; }
.iz-btn-outline:hover { background: #F5F5FA !important; border-color: var(--iz-pink) !important; color: var(--iz-pink) !important; }

.iz-sidebar-item { transition: all .15s ease; }
.iz-sidebar-item:hover { background: var(--iz-pink-hover, rgba(194,24,91,.06)); }

.iz-avatar { transition: transform .2s ease; }
.iz-avatar:hover { transform: scale(1.08); }

.iz-progress-bar { animation: izProgressFill .8s ease both; }

.iz-stagger-1 { animation-delay: .05s; }
.iz-stagger-2 { animation-delay: .1s; }
.iz-stagger-3 { animation-delay: .15s; }
.iz-stagger-4 { animation-delay: .2s; }
.iz-stagger-5 { animation-delay: .25s; }
.iz-stagger-6 { animation-delay: .3s; }
.iz-stagger-7 { animation-delay: .35s; }
.iz-stagger-8 { animation-delay: .4s; }

.iz-overlay { animation: izFadeIn .2s ease both; }
.iz-modal { animation: izScaleIn .3s ease both; }

.iz-timeline-dot { transition: transform .2s ease; }
.iz-timeline-dot:hover { transform: scale(1.3); }

.iz-upload-zone { transition: all .2s ease; border: 2px dashed var(--iz-border); background: transparent; }
.iz-upload-zone:hover { border-color: var(--iz-pink); background: var(--iz-pink-bg); color: var(--iz-text); }

.iz-tag { transition: all .15s ease; }
.iz-tag:hover { transform: scale(1.05); }

/* Dark mode CSS variable overrides — applied globally */
:root { --iz-bg: #F5F5FA; --iz-white: #fff; --iz-text: #333; --iz-text-light: #888; --iz-text-muted: #aaa; --iz-border: #E8E8EE; --iz-pink: #C2185B; --iz-pink-bg: #FFF0F5; }
body { background: var(--iz-bg); color: var(--iz-text); transition: background .3s, color .3s; }
input, select, textarea { background: var(--iz-bg) !important; color: var(--iz-text) !important; border-color: var(--iz-border) !important; }
input::placeholder, textarea::placeholder { color: var(--iz-text-muted) !important; }
`;

// ─── ILLIZEO DESIGN TOKENS ───────────────────────────────────
export function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}
export function colorWithAlpha(hex: string, alpha: number): string {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r},${g},${b},${alpha})`;
}
export function lighten(hex: string, amount: number): string {
  const [r, g, b] = hexToRgb(hex);
  const lr = Math.round(r + (255 - r) * amount), lg = Math.round(g + (255 - g) * amount), lb = Math.round(b + (255 - b) * amount);
  return `#${lr.toString(16).padStart(2, "0")}${lg.toString(16).padStart(2, "0")}${lb.toString(16).padStart(2, "0")}`;
}
const LIGHT_COLORS: Record<string, string> = {
  pink: "#C2185B",
  pinkLight: "#F8E1EA",
  pinkSoft: "#E91E8C",
  pinkBg: "#FFF0F5",
  dark: "#1a1a2e",
  text: "#333",
  textLight: "#888",
  textMuted: "#aaa",
  border: "#E8E8EE",
  bg: "#F5F5FA",
  white: "#fff",
  green: "#4CAF50",
  greenLight: "#E8F5E9",
  red: "#E53935",
  redLight: "#FFEBEE",
  amber: "#F9A825",
  amberLight: "#FFF8E1",
  blue: "#1A73E8",
  blueLight: "#E3F2FD",
  purple: "#7B5EA7",
  purpleBg: "linear-gradient(135deg, #9B7FC4 0%, #C4A8E0 30%, #D4BDE8 60%, #E8D5F0 100%)",
};

const DARK_COLORS: Record<string, string> = {
  pink: "#E91E8C",
  pinkLight: "#3D1A2E",
  pinkSoft: "#E91E8C",
  pinkBg: "#2D1525",
  dark: "#0D0D1A",
  text: "#E0E0EE",
  textLight: "#9A9AB0",
  textMuted: "#6B6B80",
  border: "#2E2E44",
  bg: "#161628",
  white: "#1C1C30",
  green: "#66BB6A",
  greenLight: "#1B2E1B",
  red: "#EF5350",
  redLight: "#2E1B1B",
  amber: "#FFB74D",
  amberLight: "#2E2A1B",
  blue: "#42A5F5",
  blueLight: "#1B2238",
  purple: "#9B7FC4",
  purpleBg: "linear-gradient(135deg, #2D2040 0%, #3D2850 30%, #4D3060 60%, #5D3870 100%)",
};

export const C: Record<string, string> = { ...LIGHT_COLORS };

export function isDarkMode(): boolean {
  return localStorage.getItem("illizeo_dark_mode") === "true";
}

export function applyDarkMode(dark: boolean): void {
  const colors = dark ? DARK_COLORS : LIGHT_COLORS;
  const customPink = localStorage.getItem("illizeo_theme_color");
  Object.assign(C, colors);
  if (customPink) C.pink = customPink;
  localStorage.setItem("illizeo_dark_mode", dark ? "true" : "false");
  // Apply CSS custom properties for elements using hardcoded colors
  const root = document.documentElement;
  root.style.setProperty('--iz-bg', C.bg);
  root.style.setProperty('--iz-white', C.white);
  root.style.setProperty('--iz-text', C.text);
  root.style.setProperty('--iz-text-light', C.textLight);
  root.style.setProperty('--iz-text-muted', C.textMuted);
  root.style.setProperty('--iz-border', C.border);
  root.style.setProperty('--iz-pink', C.pink);
  root.style.setProperty('--iz-pink-bg', C.pinkBg);
  // Force body background
  document.body.style.background = C.bg;
  document.body.style.color = C.text;
}

// Apply on load
applyDarkMode(isDarkMode());

// ─── LOCALE HELPERS ────────────────────────────────────────────
export const REGION_LOCALE: Record<string, string> = { CH: "fr-CH", FR: "fr-FR", BE: "fr-BE", LU: "fr-LU", CA: "fr-CA", US: "en-US", GB: "en-GB", DE: "de-DE" };
export const REGION_CURRENCY: Record<string, string> = { CH: "CHF", FR: "EUR", BE: "EUR", LU: "EUR", CA: "CAD", US: "USD", GB: "GBP", DE: "EUR" };

export function getLocaleSettings() {
  const r = localStorage.getItem("illizeo_region") || "CH";
  const df = localStorage.getItem("illizeo_date_format") || "DD/MM/YYYY";
  const tf = localStorage.getItem("illizeo_time_format") || "24h";
  const tz = localStorage.getItem("illizeo_timezone") || "Europe/Zurich";
  return { region: r, locale: REGION_LOCALE[r] || "fr-CH", currency: REGION_CURRENCY[r] || "CHF", dateFormat: df, timeFormat: tf, timezone: tz };
}

export function fmtDate(date: string | Date | null | undefined): string {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date.replace(" ", "T")) : date;
  if (isNaN(d.getTime())) return "—";
  const { dateFormat, timezone, locale } = getLocaleSettings();
  const opts: Intl.DateTimeFormatOptions = { timeZone: timezone, year: "numeric", month: "2-digit", day: "2-digit" };
  // en-CA gives YYYY-MM-DD format reliably
  const parts = d.toLocaleDateString("en-CA", opts).split("-");
  const year = parts[0] || String(d.getFullYear());
  const month = parts[1] || String(d.getMonth() + 1).padStart(2, "0");
  const day = parts[2] || String(d.getDate()).padStart(2, "0");
  const monthShort = d.toLocaleDateString(locale, { timeZone: timezone, month: "short" });
  switch (dateFormat) {
    case "MM/DD/YYYY": return `${month}/${day}/${year}`;
    case "YYYY-MM-DD": return `${year}-${month}-${day}`;
    case "DD.MM.YYYY": return `${day}.${month}.${year}`;
    case "D MMM YYYY": return `${parseInt(day)} ${monthShort} ${year}`;
    default: return `${day}/${month}/${year}`;
  }
}

export function fmtDateShort(date: string | Date | null | undefined): string {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date.replace(" ", "T")) : date;
  if (isNaN(d.getTime())) return "—";
  const { locale, timezone } = getLocaleSettings();
  return d.toLocaleDateString(locale, { timeZone: timezone, month: "short", day: "numeric" });
}

export function fmtTime(date: string | Date | null | undefined): string {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date.replace(" ", "T")) : date;
  if (isNaN(d.getTime())) return "—";
  const { locale, timezone, timeFormat } = getLocaleSettings();
  return d.toLocaleTimeString(locale, { timeZone: timezone, hour: "2-digit", minute: "2-digit", hour12: timeFormat === "12h" });
}

export function fmtDateTime(date: string | Date | null | undefined): string {
  if (!date) return "—";
  return `${fmtDate(date)} ${fmtTime(date)}`;
}

export function fmtDateTimeShort(date: string | Date | null | undefined): string {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date.replace(" ", "T")) : date;
  if (isNaN(d.getTime())) return "—";
  const { locale, timezone, timeFormat } = getLocaleSettings();
  return d.toLocaleString(locale, { timeZone: timezone, day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit", hour12: timeFormat === "12h" });
}

export function fmtCurrency(amount: number): string {
  const { locale, currency } = getLocaleSettings();
  return amount.toLocaleString(locale) + " " + currency;
}

export const font = `'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif`;

// ─── ILLIZEO LOGO SVG ────────────────────────────────────────
export const ILLIZEO_LOGO_URI = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Cpath d='M20 4C29.941 4 38 12.059 38 22' stroke='%23C2185B' stroke-width='4' stroke-linecap='round' fill='none'/%3E%3Cpath d='M20 12C25.523 12 30 16.477 30 22' stroke='%23E91E8C' stroke-width='3' stroke-linecap='round' fill='none'/%3E%3C/svg%3E";


export const ILLIZEO_FULL_LOGO_URI = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyBpZD0iTUFJTl9MT0dPIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHZpZXdCb3g9IjAgMCA0NS44NCAxMC44Ij4KICA8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMzAuMS4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogMi4xLjEgQnVpbGQgMTM2KSAgLS0+CiAgPGcgaWQ9IklDT05feEEwX0ltYWdlIj4KICAgIDxpbWFnZSBpZD0iSUNPTl94QTBfSW1hZ2UxIiBkYXRhLW5hbWU9IklDT05feEEwX0ltYWdlIiB3aWR0aD0iNDUiIGhlaWdodD0iNDUiIHRyYW5zZm9ybT0ic2NhbGUoLjI0KSIgeGxpbms6aHJlZj0iZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFDNEFBQUFzQ0FZQUFBQWFjWW84QUFBQUNYQklXWE1BQUM0akFBQXVJd0Y0cFQ5MkFBQUhPVWxFUVZSWWhkV1piWXhjVlJuSGY4OXo3c3krekxaTVN4dDBoL3BlalNhVUtDUWJSRU0xaWlFUll5SmlFdzBFaVI4a3BVV3JiVHJHTHlhTVlvaWd4aGRzcVRHeDhFRlVJQTIrWUVIQ1ZsUVNvRlpsMjFvWDI1MVNVbW1uM2U3TzduYnVlZnh3N3N6TzdNN3V6dTdPZlBDZjNNeWRtL1B5dS8vN25IT2VjNit3Q0JXeitUN2dHOENkUU5SQ2xXdHpwY0tmRnROSHEycWxjd0NLMmZ4VzRENUFGdEYrZXRGRUxXcEI4R0kydnhiNERYRFZFdHJYSmRScFNmT0NGN1A1YTRHbldMcHpmb24xRnRTY2poU3orVThCZ3l6dmNVOHRvKzY4YWdwZXpPYXZCeDVwUS90bjI5QkdVODBDTDJiemJ3Y2VhNld5QUlJaXpjZnJybHlwOFBMeThPYldyQmozMkY1RnV1ZXJGREREUFplcFVERy9mNFZFK3cyT0FvZUJZN2xTWVh3NVlNVnN2aGQ0RzNBNFZ5cGNuQmQ4ZU9XT25kN2JBQmlpMHRSSlFRRmgxQ1laNlI0dkhrK1BiN3J0eEo3QjVVQTJnYjRTMkFkY1RnalpUOC9tU0hSc3hmWitVWWJGSkIzUUJKMEJMK3FvK0ppajZmT01wTWYzM2pxeTUzUHRCRTZnZHdLRkdaZHZ6cFVLdjZpL1VJdnhHTDh6OXBiMlpzU0F4L0RlOEZoeWg0NXo4UVFITXFjWjdoNjdwMFBRanpTQkJzalB2Q0FBUTMzYjFvaklLd0lacVE0M0NWNUhLRTZWb3BRNTFGZkNJWHR1UGZIZzdXMEdUZ01IZ0t2bktYWkRybFQ0YmZXUEFzVFlKbStXOFlBUlhQYm1FY0FoRE9zRkRxNG8wV1Y2cU4zUWlSNVlBQnJnOC9WL0ZNRGdwZ0FiampnSmo3UUp3OUVZUTMyalpHSWxaYktsQTlBQXFSYktmRHhKUHdEUWc1bTdMdmRtMXhsVnQ4SE02RUlwNmdSSE1xUDB4SXBESHJ1NXVPdVBIUUwvWVF0bGVvQWJhdUF4dHNGanhJbmJIcVBMaEROMmthRVZGMGliRWlFWS9LQkQwQ1NwN3hNdEZCMm9nWnZaVlY2c0Z0dmlZVXFNZjYwY3d6QlNKaGdjLzB4eDE1T2RBay8weXhiS1hGUE01cThBMEZqc0N1L0RZSXd4VXNCSTd3U2pya0szYVJMdFBOMDUzcHFlQUNvTGxIa1BzQUZBd1hKZXdvQk1lU2k1Q3ErbEorbnlOV2lBNXpxR215aFhLcHdDamkxUXJBdDRFNEI2czB0TkFxSUJwL3FtaURGY1k0VVRiU2R0cnBFV3lxd0dVSzhXZVRPY2gxSjNoZk91UXBjMXVBMXdvUU9RelhTNmhUSzlBT3FGMkNRTXpGSTZucXR3eTN2VDVjaXdWdmF6QWlGVVhzY2I1YlNuSE1XNDVuVlh0WlZ3RHNXd3RrWTJ0OG9BNnNWT1NneGw1NmxvOHkyUklodmFUdGxFTWJZdXhtYUc2VXlWSU16amY0OGpZN0tyZVhFMUlUTDVTTnNwWitob2RzYzZnL1dlNll5MGlUekpBRll2OW54TVNHWHJKUWlSYVRpOHZuOWYveDN2NkNSNGpIM0NVMDJwbWN2M2w0R0RBUno3bXpjZlZzM2Fwa3lJTERsRWNDcEV5SjBkQlRmYlZIVzdtWkdKbnMyVkNpOEE2RWRIZDUySUhVOTVNY1FNRnh3bU1zR0o0aENjQ1ZFc1cvWmZ0dm1kbllCK0tidnRreDc3UUd3aHlhdkNWMmE3ZnFCNm9nRGU3R0ZGaU5CcGx5VTU5K0Z3WGtqRitrQzdvWjlmOWVWMERQY0hZSWpOMStDck41RG9kZURSQm5BVCs3bUxPUlY1eFluZ2tsQnhGb0NkcjUxdmZHN1ZYZDlxSjdnWDIydGliL2JKV21JMWFHbzNrTVQ3cjNLbFFtMGhWSUNQalQ0NEVYbjdjVXJDWUhSMVRrZGVjVjREUEVMS1pNZEwyVzFmYUFmMDROcXRlN3pZVFhFQ0hTYzVVNXlrMTlYQm11eUJ2MTlmdHpadGkzUDNSc2JwS01RenpnczY3WFRZZTVyaVVGS21QL2xkLytaWkc5aFc5ZVFiTjEveTlCdTJQQnVMM1JZcmVERzhKRTRuOEw0QjNuNjJydlROUS9WdE5DeFNmN2hzOCsxcTdIWmVVUlBVUUtYdUJoRFVoQlJDeXBUalBlUC9MbmFYdjNMTGYzYi91aFhneC91L21FbWgyNTNKMTFWRVhQSlU2dzFTRXh3a0prRWtPaW13Zm4zcG5vWkViOWJxK3N5YUxZODc0MFpONGwyTnBER1ovZ1hTcG5TcjQ3Z2I1MWhtYkVUZzBSN3ZCZzFlQkY0bHZQRHNKYVNoQTRwODJIbHVWS1MzT2xNNVpvMmgwRWN5RlN1Q1ErNTQ5N2x2LzJnbTV5end3VXUzWmgzeUQvWFNYKyt5RW5iOHRmOWhiaWVGWTVTTEhPNDl6NW5VRkQzZWtUSlhObXdDeUZEM3RsY1JuQWVIaHZZc0NVRlBHRWZHdFB2aGVHakR1WHMvMit6cE5jMW4vckw2UzFkR1hsNVFSRjJkeTRxRXAwRGp0WEJtRkhXYzRjdzRaWTNwalIwdTdGVWJwRWFZQUpJMkhFbW8rQ1E4UEZYWC8zcjEyZThNekthcm10QkVBMmZ1TzZqSUI2TTZhSmRBVnp1TGtsOGdtYndnNS9zWUdGMXRieTFudkJmc2dxc3dKWTN2OXIxUW16MnE4N1JYdzFjSGFmZ2RBajQwRi9TY2psZjF6MHUrK2k2SEREcVJOVUl5YU9wZUxEZkxKaVJaR3Fhb1VJd21PTjAxS1dPdWt1eXFwSnEwSmJQVWRCaUtDR2t2cEdQOWMrVGx1bXYrZS8rOEh3VVdUTnlQck55ZVNhbnVVMlNqSTRRR2MwQTNOcXBKT1UvSkxuSTJmWkZ5S3FaTWhVa05UOEVSWnBVMFNrL0ZZY0x1amE5OXI2VTFvdVV2YU1Wc2ZvdkFkeGZJbFpzMExuWGRoRlZ3RWwvTFF4eENDamtlb2JmMGwrNStabkZ0dDZpVDJmenE1TVhRcHNYVWEreXNvY3RYZ0svMWwrNSthR2x0TFZMRmJQNHR3RTdDRGF4Y1pQVlhnZDhEUDgyVkNpMDdQRk5MQXErcW1NMzNBTmNEN3dQZVMvajBzWW93ZDA4U1BsNmRCSWFBSThDTG5mclMvSCtqL3dFeEF5YmNnOEJuUFFBQUFBQkpSVTVFcmtKZ2dnPT0iLz4KICA8L2c+CiAgPGcgaWQ9IlRFWFQiPgogICAgPGcgaWQ9Il94M0NfR3JvdXBlX3gzRV8iPgogICAgICA8ZyBpZD0iX3gzQ19Hcm91cGVfeDNFX194QTBfSW1hZ2UiPgogICAgICAgIDxpbWFnZSBpZD0iX3gzQ19Hcm91cGVfeDNFX194QTBfSW1hZ2UxIiBkYXRhLW5hbWU9Il94M0NfR3JvdXBlX3gzRV9feEEwX0ltYWdlIiB3aWR0aD0iNTMiIGhlaWdodD0iOCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTIuOTYgOC44OCkgc2NhbGUoLjI0KSIgeGxpbms6aHJlZj0iZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFEWUFBQUFIQ0FZQUFBQkRZNzdWQUFBQUNYQklXWE1BQUM0akFBQXVJd0Y0cFQ5MkFBQUNBVWxFUVZRNGpkM1RUNmhXVlJRRjhOL3pEeWFhcGp3TndaNzRENmtnQlJIQldhSURBNkVVSERoeDVraUNJUFpSYzVJZ2VEYWlrd2pVZ2FCVFVWRFJJQ09vTElNRzZpUko1U0hsb05LSDlVUWFhWVB2UFBpNHZPODFiOFBsbm4zV1d2dXV2ZTg1UTFBejErRkNpVmloUmMzOENSZEx4SkdXUDhDbkplSnN6YnhYSWxZYkVEVnpEMDdoTHQ0dEVXTTFjeE91WUZYTGwrTWJiQzRSOTZhb2RSMDNTOFNobXZrN0Z1T05FdkZielJ6SDFoSnhzNnViMGQ3TE1MT0QvWWt0VFF3TDhMaXRYNm1aUnh2blRJa1k2MmcveEFtOGczMDRQTWg0WHdOTGNhQnY2M0tKK0tKRHU0TlorQXp2WXh3dmF1WkhXTlU0dDByRTZXbFRmT3R2dklWZDJJMjVyUkM5Z1d6RFRzenJHSHdWSXlWaVA4N2h2UVlOL1Vkdk16SFNubVhkdWkzZXhBZFlXak1QNGphbVk3aFBOenhoY0ZDc3h2RVNVWnZoKzFpQmIvR3NSS3dkb0Z1UDRacDVEV3Z3ZXRzZng4dk8zeDNDRXlnUm85ZytoUitZZzZkNkorSUdmc1h6RXZGSmx6alIyR3dzNldEenNiSXZIK25qajlUTXZSakZMeVhpWVIvdkdIN0dWN2lJa3pWenU5NUFGdGJNSFhpRU1iMzdzcU5tanVKR2lmaG5rbVlXTlMvd0dqYVVpTzlyNW8vWWlHZVRUV0RpS0Q3Q3BRNzJKVzcxNVpmd3NBLzdHQ2V4ZVlKUU00ZndCL2FXaUdNbDRoU080dTBTOFJRL3RMemlPYzYzT3A5ajRXUUc4YlhlM1lLcitLdXRkK003dkJ5ZyszL0d2emNXcUU1UFhta0tBQUFBQUVsRlRrU3VRbUNDIi8+CiAgICAgIDwvZz4KICAgICAgPGcgaWQ9Il94M0NfVHJhY8OpX3RyYW5zcGFyZW50X3gzRV9feEEwX194MkJfX3hBMF9feDNDX1RyYWPDqV90cmFuc3BhcmVudF94M0VfX3hBMF9feDJCX194QTBfX3gzQ19UcmFjw6lfdHJhbnNwYXJlbnRfeDNFX194QTBfX3gyQl9feEEwX194M0NfVHJhY8OpX3RyYW5zcGFyZW50X3gzRV9feEEwX194MkJfX3hBMF9feDNDX1RyYWPDqV90cmFuc3BhcmVudF94M0VfX3hBMF9feDJCX194QTBfX3gzQ19UcmFjw6lfdHJhbnNwYXJlbnRfeDNFX194QTBfX3gyQl9feEEwX194M0NfVHJhY8OpX3RyYW5zcGFyZW50X3gzRV9feEEwX194MkJfX3hBMF9feDNDX1RyYWPDqV90cmFuc3BhcmVudF94M0VfX3hBMF9feDJCX194QTBfX3gzQ19UcmFjw6lfdHJhbnNwYXJlbnRfeDNFX194QTBfX3gyQl9feEEwX194M0NfVHJhY8OpX3RyYW5zcGFyZW50X3gzRV9feEEwX194MkJfX3hBMF9feDNDX1RyYWPDqV90cmFuc3BhcmVudF94M0VfX3hBMF9feDJCX194QTBfX3gzQ19UcmFjw6lfdHJhX3hBMF9JbWFnZS4uLiI+CiAgICAgICAgPGltYWdlIGlkPSJfeDNDX1RyYWPDqV90cmFuc3BhcmVudF94M0VfX3hBMF9feDJCX194QTBfX3gzQ19UcmFjw6lfdHJhbnNwYXJlbnRfeDNFX194QTBfX3gyQl9feEEwX194M0NfVHJhY8OpX3RyYW5zcGFyZW50X3gzRV9feEEwX194MkJfX3hBMF9feDNDX1RyYWPDqV90cmFuc3BhcmVudF94M0VfX3hBMF9feDJCX194QTBfX3gzQ19UcmFjw6lfdHJhbnNwYXJlbnRfeDNFX194QTBfX3gyQl9feEEwX194M0NfVHJhY8OpX3RyYW5zcGFyZW50X3gzRV9feEEwX194MkJfX3hBMF9feDNDX1RyYWPDqV90cmFuc3BhcmVudF94M0VfX3hBMF9feDJCX194QTBfX3gzQ19UcmFjw6lfdHJhbnNwYXJlbnRfeDNFX194QTBfX3gyQl9feEEwX194M0NfVHJhY8OpX3RyYW5zcGFyZW50X3gzRV9feEEwX194MkJfX3hBMF9feDNDX1RyYWPDqV90cmFuc3BhcmVudF94M0VfX3hBMF9feDJCX194QTBfX3gzQ19UcmFjw6lfdHJhbnNwYXJlbnRfeDNFX194QTBfX3gyQl9feEEwX194M0NfVHJhY8OpX3RyYV94QTBfSW1hZ2UuLi4xIiBkYXRhLW5hbWU9Il94M0NfVHJhY8OpX3RyYW5zcGFyZW50X3gzRV9feEEwX194MkJfX3hBMF9feDNDX1RyYWPDqV90cmFuc3BhcmVudF94M0VfX3hBMF9feDJCX194QTBfX3gzQ19UcmFjw6lfdHJhbnNwYXJlbnRfeDNFX194QTBfX3gyQl9feEEwX194M0NfVHJhY8OpX3RyYW5zcGFyZW50X3gzRV9feEEwX194MkJfX3hBMF9feDNDX1RyYWPDqV90cmFuc3BhcmVudF94M0VfX3hBMF9feDJCX194QTBfX3gzQ19UcmFjw6lfdHJhbnNwYXJlbnRfeDNFX194QTBfX3gyQl9feEEwX194M0NfVHJhY8OpX3RyYW5zcGFyZW50X3gzRV9feEEwX194MkJfX3hBMF9feDNDX1RyYWPDqV90cmFuc3BhcmVudF94M0VfX3hBMF9feDJCX194QTBfX3gzQ19UcmFjw6lfdHJhbnNwYXJlbnRfeDNFX194QTBfX3gyQl9feEEwX194M0NfVHJhY8OpX3RyYW5zcGFyZW50X3gzRV9feEEwX194MkJfX3hBMF9feDNDX1RyYWPDqV90cmFuc3BhcmVudF94M0VfX3hBMF9feDJCX194QTBfX3gzQ19UcmFjw6lfdHJhX3hBMF9JbWFnZS4uLiIgd2lkdGg9IjgzIiBoZWlnaHQ9IjgiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDI1LjkyIDguODgpIHNjYWxlKC4yNCkiIHhsaW5rOmhyZWY9ImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBRlFBQUFBSENBWUFBQUNXY1dxWUFBQUFDWEJJV1hNQUFDNGpBQUF1SXdGNHBUOTJBQUFEY2tsRVFWUklpZTNWU2NpV1ZSUUg4Ti8zcWRsb1ZxUVZOaGlXVkZTTEZnV1ZWRkphdURFczA0VlJVUlFWVFhodVFXMkUwSHMrb2FMQklwVUdhQkVTQmkxS0Nvc3NhTUJ5WTRNdW1wR2lTUnZNL0xURmMxOThlNmxkeS83dzh0N3puT2RNLzN2T2VZWnE1cm5ZZ0VVbDRsbW9tYi9oeFJLeG9HYmVpQlZZV1NLdXI1bXJNYTFFektpWkgyQ2tSRHhuQURYelRLd3BFU2MxK1VLc0toRW4xc3lWbUZBaXJxeVppL0IwaVJqcXMvMFZTMHBFclpraitMWkVqTlRNcGJnYnd5VmliODA4RDIvaVdJekRPa3d2RVh1YW53OWIzby9VekluWWlMa2xZbFBObklEUE1LbEU3SzZaUjJJTFRzRkViTVpwSldKenpUd1lPM0JyODdVUzErR21FdkY0elZ3SEplS1NZU3pETnoweUd4WmdkanRQd2V1NHFHWWVqWS9SSy80SFhGWXo1OWJNa3djNC9RMEgxc3g1TlhNV1ptSlgwKzNDQWUxOE12NGNzSDBSeTJybS9CS3h1RVNNdE9kWFkzR0oyTnNLMklDM2NCTyt3OTRCUC84azkySk5iblVjMWVROTdmY1Ric05MSldKemkvTUxIc1JkN2QzRDhEN3ViUExYUFU2R01RbGZEQVQrQnFQdGZFaExlakZXTjV2ZFRmY2o1aUF4YThESGR0MU5qN1JrYnRDUkRCL2g0dGFKVncvYWxvaUZ1QmRQMWN4dE5YTktVKzNFcHdOeHZzU1I5bDF5UDRiNjZoalZFVHJjNU1IL0hzWTJmOXNHbm4raUl4eU93d040dm1ZdWJ6bnM3amw3QytjTUdNL3VTM0FjemlnUkwrQWczTk5YMUZUY1VTSk9LaEVQRC9pWXJPdjhxU1hpRkN6RW9VMTNBcDdCMDloV0l0YjNHOWJNU1NYaS9oSnhnSzd6MWpiVkhsd3hFT2NpdklzeEdPMk5lOE1FN1JKTHhBN2RWSXo2ZHd6cGlIa1A1dy9vNXVrYXFJZnBKZUplek5VMXhWYTYyN2dEYzJybUc3aWxGYnNFTnpiRGlmYU54VjB0K1I0eFkzRjJ6WHdidjVlSS9rNGZ4aEUxYzBLSjJJN0RteTg2c29kTHhNS2F1YmRtTGlvUnovVFp2bG96eCtOUzdLL2JkWEF6WHE2WnIrbEdydWdtYkJWT3h6RTE4MVQ4V1NLMk5HS1cxc3hOdUxibHNMWDVHdFB5NlhYb1VKT242aVpxYWMxOENFL3ExdFZNbk5YSHliUjJYbzdIY0xCVzFNK054Q1B3RHRiZzloTHhSRFA0cXBkRWlYaFB0MC9ITmQwR1hLNzdNQ3p6ZC95dTI3Yzk3T2lUdjdCdmZCN0ZmUU8ybDJNOE51SDdKaXNScitBcVBLNjcyQXR3Zk51cDIvRUwxbU50elJ4VEl1YTNXTy9nR3N3b0ViMGQrb2R1OWZUazBTWWZVaUoyNHJRVzY5MVcyNlVsWW1ON2R3cytiem10MEsyRC9meVAveDUvQWVaeVMvekE5eWprQUFBQUFFbEZUa1N1UW1DQyIvPgogICAgICA8L2c+CiAgICA8L2c+CiAgICA8ZyBpZD0iX3gzQ19Hcm91cGVfeDNFX194QTBfSW1hZ2UyIiBkYXRhLW5hbWU9Il94M0NfR3JvdXBlX3gzRV9feEEwX0ltYWdlIj4KICAgICAgPGltYWdlIGlkPSJfeDNDX0dyb3VwZV94M0VfX3hBMF9JbWFnZTMiIGRhdGEtbmFtZT0iX3gzQ19Hcm91cGVfeDNFX194QTBfSW1hZ2UiIHdpZHRoPSIxMzciIGhlaWdodD0iMjYiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEyLjk2IDEuNjgpIHNjYWxlKC4yNCkiIHhsaW5rOmhyZWY9ImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBSW9BQUFBWUNBWUFBQUFsS1dVc0FBQUFDWEJJV1hNQUFDNGpBQUF1SXdGNHBUOTJBQUFGT0VsRVFWUm9nZTJhYlloVlJSakhmL2VxYTFJYVEyb1VZNit1NVBhbVVaRnBGT0pMRk5FYlZHVDVvWll5ckE5RlRZaVdJRll5WkZCUUVhYWdoVUdXUlNDMTlJWm11V1VXV0xZVnExUk9XNkl4Z3ByYmF0bUhPYXZYY2M2NTU1eDdkai9VK2NQaDNubWVPZjk1enIzUG1YbG1ucWRpaEZvT3pPUm90RWlyT3dqQUNEVUZlTjhUYjVWV2p3NzFUd01qVkFYNENUak5VMDJSVm4vWUFPOXc0QmRnU0kxNHRiVDY1a0Rmc2NCM2VjZnljTHUwK2pXUC8yWGc3Z1o1MTBtcnIwenFZSVJxQlpZa2RPbVFWcmRrSFhoZzFodit3L2dkK0F3NEVUaVVrNk1DSENEc2NEWW5aeTEySlNtTlVETkpkcEllb0QzUHdLV2pSSkJXVzJCaUh3N3hPTEFVNTB4WkhiRVNmVzZQNjJDRU9oZFlIcU4rRTFnR2JJaWVNek5LUitrblNLdjNBOS8zNFJEdkJtUmR3RzNTNmsreUVCbWhwZ0d6Z2FlazFlMVFPa3Evd1FqVkJJeXFFVzJYVnZjVXhIMlh4dzF1cVJzbnJkNlpnV2NRTUIrWUc0bWFnUmFBYWdGMi9pOWhoQnBoaERvL3d5MExnTTZhYTNHQjVzd0p5S1ptY1pJSUQzTEVTUURHR3FFbVF1a29qV0FUc05rSU5UMWwvK0ZlZTJRUlJoaWhtZ0YveDdsU1dyMHBCOTNuQWRtdFVEcEtMaGloMW5Ga3FuL1BDTlVhYmZHVDhLZlgvclVnY3lZSFpJdnlFRW1yMXdKZmV1SkpVTVlvbVdHRVdnRmM0WW1YQUcwazdFb0N1TW9JZFFOdU94MzN3bGFCYmRMcWJ4SjRtcjMySDhDV0RIYjRhQU11cm1tZkFxV2paSUlSYWpGd1owQzFBSGNPa3dYamdiZFM5TnNDbkplZ0grcTFmNVJXLzVQUmxxUHVEL0dYanBJU1JxZzV3RU1CMVVKcDlmdytISHB2SGIxL0p2TjNYeGhSeGlncEVCMkxQeGxRYVduMVkzMDgvSWc2K2oxZWUweUtlQ2tKL2xLMkQ4b1pwUzZNVU5jUVBoWi9SbHI5YUFQVVBjQzNRTkl5VVFFK3JjUGpMeFVqZ1RIQUR6bnRtdWExZDBEcEtJa3dRbDBDckFtb25wWldQOUlnL2V2UzZsQzhreFVmQjJRUEFQZG5KVEpDblExYzZvazNRTG4weE1JSU5ScFlIMUM5VklDVFFEU2xOd3BwZFNmSHppcXpqVkIrSmo0TlhnbklWa1BwS0VFWW9VYmlzcXhObm1xcHRIcFdRY1A0M0kzZ2lZQnNyUkhxK0xRRVJxaEZ3QVJQdkYxYTNRYkZPY3FCZ25oOGRQVVJieXlNVUVOd2gwNG5lYW9sMHVyV0FvY3FaRVlCa0ZhdkFINzJ4R2NBSGRIeW1RZ2oxSXRBS042NnQvZExVVEhLcVVhb3liZy9Ob2x6bTdUYVA2Rk13Z3dqMUVwY1VCZUs1Q3ZBTG1uMWJ4azQ2NkdkWXhOc2k2WFZEeGM0QnNEcFJxakJ1R0EyelM2bElxMytLMEYvRXk2dFVJdFJ3QmRHcUZkeEpRNGJwZFg3akZCVjRNem9udnVpN3o1V1Nhc1BaNlNMY3BSaFFKcEt0TGVCR3pQd3p1WG9KRlVJdTQxUVVscmQwQnNhVGROdkFCY0UxT2RFSjdKRGNiOVpGUmpnWFpYbzh5QXdLNjVDc0FiWDRYWVVxUjNGQ0xWR1dqMGpwSlJXZjJXRW1nMDhIMURmRVYxN2pWQzdjY3RlVXE2cFExcDlTNjJndjNjOWhTVENQQXpEUFhpalUvazQ0T29ZM2JVWnVjWUQ5UndGWERWZEZvU2MrRENrMVM4WW9RWUN6OFowT1NHNmtyQVp1TndYVm9IQmdjNERFb2dHMVJrb0NRY1RkTWZsNUV5S2owTFBGeGRFYmdTMjVyVEJSM2RBVmtUd1d1K1VGbW4xYzhEMVFKN2xlSm0wK3NMUTdGd2wvRU1uRmRSa2lURjhKSzJ4ZVFQckp1THREU1hjZ3ROOFZFUjBUMDRiZk93UHlCckp2L1FpMVltcnRQb2Q0Q3pjYnFpelR2ZHVYS25rWmRMcTJPTHZnYmhvZDFXTklYdnFrSzhIcHVNcTI5TStmTzhEZmgxU1Nxc1BSY0Z3YjFDVnRxYTBDblRGeFNmU2FtdUVtb1NyQmVubGpNM0VTcXMvTWtKTkFFNG0zeDlieGIwTW9YaHRJYTVjc1pHYTJkU2xsTkxxYm1BZU1NOElOUlc0Q0pjSkhvWnpqcDI0ODVjUHBOVTdNdHBUb2tRWS93S0lqSGNVNHdTbk9nQUFBQUJKUlU1RXJrSmdnZz09Ii8+CiAgICA8L2c+CiAgPC9nPgo8L3N2Zz4=";
export const getLogoUri = () => localStorage.getItem("illizeo_custom_logo") || ILLIZEO_LOGO_URI;
export const getLogoFullUri = () => localStorage.getItem("illizeo_custom_logo_full") || ILLIZEO_FULL_LOGO_URI;

export const IllizeoLogoFull = ({ height = 32 }: { height?: number }) => (
  <img src={getLogoFullUri()} alt="Illizeo" style={ { height, objectFit: "contain" as const } } />
);

export const IllizeoLogo = ({ size = 80 }: { size?: number }) => (
  <img src={getLogoUri()} alt="Illizeo" style={{ width: size, height: size, objectFit: "contain" }} />
);

export const IllizeoLogoBrand = ({ size = 28 }: { size?: number }) => (
  <img src={getLogoUri()} alt="Illizeo" style={{ width: size, height: size, objectFit: "contain" }} />
);

// Sidebar for pre-boarding steps
export const PreboardSidebar = ({ children }: { children?: React.ReactNode }) => (
  <div style={{ width: 320, minHeight: "100vh", background: "linear-gradient(180deg, #2D1B3D 0%, #1A1025 50%, #2D1B3D 100%)", position: "relative", flexShrink: 0, display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: 32, overflow: "hidden" }}>
    {/* Decorative circles */}
    <div style={{ position: "absolute", top: -60, right: -60, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(194,24,91,.15) 0%, transparent 70%)" }} />
    <div style={{ position: "absolute", bottom: 120, left: -40, width: 160, height: 160, borderRadius: "50%", background: "radial-gradient(circle, rgba(233,30,140,.1) 0%, transparent 70%)" }} />
    {/* Logo */}
    <div style={{ position: "absolute", top: 40, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: .12 }}>
      <IllizeoLogo size={140} />
    </div>
    <div style={{ position: "relative", zIndex: 1 }}>
      <div style={{ color: C.white }}><IllizeoLogoFull height={24} /></div>
      <div style={{ fontSize: 28, fontWeight: 700, color: C.white, marginTop: 12, marginBottom: 4 }}>Nadia</div>
      <div style={{ fontSize: 13, color: "rgba(255,255,255,.6)" }}>Chef de Projet, B030-Switzerland</div>
    </div>
  </div>
);

// ─── SHARED STYLES ───────────────────────────────────────────
// Style helpers — use spread to get fresh C values each render
export const sCard = { get background() { return C.white; }, borderRadius: 12, get border() { return `1px solid ${C.border}`; }, padding: 24 };
export const sBtn = (variant: "pink" | "dark" | "outline" = "pink") => ({
  padding: "10px 28px", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", border: "none", fontFamily: font, transition: "all .15s",
  ...(variant === "pink" ? { background: C.pink, color: "#fff" } : variant === "dark" ? { background: C.dark, color: "#fff" } : { background: C.white, color: C.text, border: `1px solid ${C.border}` }),
}) as const;
export const sInput = { get width() { return "100%" as const; }, padding: "10px 14px", borderRadius: 8, get border() { return `1px solid ${C.border}`; }, fontSize: 14, fontFamily: font, get background() { return C.bg; }, outline: "none", get color() { return C.text; }, boxSizing: "border-box" as const };
