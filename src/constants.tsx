// ─── CONSTANTS — extracted from Onboarding_v1.tsx ────────────

// ─── COUNTRIES (used as nationality picker too) ─────────────
export const COUNTRIES: { code: string; label: string; flag: string; currency: string }[] = [
  { code: "AF", label: "Afghanistan", flag: "🇦🇫", currency: "AFN" },
  { code: "ZA", label: "Afrique du Sud", flag: "🇿🇦", currency: "ZAR" },
  { code: "AL", label: "Albanie", flag: "🇦🇱", currency: "ALL" },
  { code: "DZ", label: "Algérie", flag: "🇩🇿", currency: "DZD" },
  { code: "DE", label: "Allemagne", flag: "🇩🇪", currency: "EUR" },
  { code: "AD", label: "Andorre", flag: "🇦🇩", currency: "EUR" },
  { code: "AO", label: "Angola", flag: "🇦🇴", currency: "AOA" },
  { code: "SA", label: "Arabie saoudite", flag: "🇸🇦", currency: "SAR" },
  { code: "AR", label: "Argentine", flag: "🇦🇷", currency: "ARS" },
  { code: "AM", label: "Arménie", flag: "🇦🇲", currency: "AMD" },
  { code: "AU", label: "Australie", flag: "🇦🇺", currency: "AUD" },
  { code: "AT", label: "Autriche", flag: "🇦🇹", currency: "EUR" },
  { code: "AZ", label: "Azerbaïdjan", flag: "🇦🇿", currency: "AZN" },
  { code: "BH", label: "Bahreïn", flag: "🇧🇭", currency: "BHD" },
  { code: "BD", label: "Bangladesh", flag: "🇧🇩", currency: "BDT" },
  { code: "BE", label: "Belgique", flag: "🇧🇪", currency: "EUR" },
  { code: "BJ", label: "Bénin", flag: "🇧🇯", currency: "XOF" },
  { code: "BO", label: "Bolivie", flag: "🇧🇴", currency: "BOB" },
  { code: "BA", label: "Bosnie-Herzégovine", flag: "🇧🇦", currency: "BAM" },
  { code: "BW", label: "Botswana", flag: "🇧🇼", currency: "BWP" },
  { code: "BR", label: "Brésil", flag: "🇧🇷", currency: "BRL" },
  { code: "BN", label: "Brunei", flag: "🇧🇳", currency: "BND" },
  { code: "BG", label: "Bulgarie", flag: "🇧🇬", currency: "BGN" },
  { code: "BF", label: "Burkina Faso", flag: "🇧🇫", currency: "XOF" },
  { code: "KH", label: "Cambodge", flag: "🇰🇭", currency: "KHR" },
  { code: "CM", label: "Cameroun", flag: "🇨🇲", currency: "XAF" },
  { code: "CA", label: "Canada", flag: "🇨🇦", currency: "CAD" },
  { code: "CL", label: "Chili", flag: "🇨🇱", currency: "CLP" },
  { code: "CN", label: "Chine", flag: "🇨🇳", currency: "CNY" },
  { code: "CY", label: "Chypre", flag: "🇨🇾", currency: "EUR" },
  { code: "CO", label: "Colombie", flag: "🇨🇴", currency: "COP" },
  { code: "KR", label: "Corée du Sud", flag: "🇰🇷", currency: "KRW" },
  { code: "CR", label: "Costa Rica", flag: "🇨🇷", currency: "CRC" },
  { code: "CI", label: "Côte d'Ivoire", flag: "🇨🇮", currency: "XOF" },
  { code: "HR", label: "Croatie", flag: "🇭🇷", currency: "EUR" },
  { code: "CU", label: "Cuba", flag: "🇨🇺", currency: "CUP" },
  { code: "DK", label: "Danemark", flag: "🇩🇰", currency: "DKK" },
  { code: "EC", label: "Équateur", flag: "🇪🇨", currency: "USD" },
  { code: "EG", label: "Égypte", flag: "🇪🇬", currency: "EGP" },
  { code: "AE", label: "Émirats arabes unis", flag: "🇦🇪", currency: "AED" },
  { code: "ES", label: "Espagne", flag: "🇪🇸", currency: "EUR" },
  { code: "EE", label: "Estonie", flag: "🇪🇪", currency: "EUR" },
  { code: "US", label: "États-Unis", flag: "🇺🇸", currency: "USD" },
  { code: "ET", label: "Éthiopie", flag: "🇪🇹", currency: "ETB" },
  { code: "FI", label: "Finlande", flag: "🇫🇮", currency: "EUR" },
  { code: "FR", label: "France", flag: "🇫🇷", currency: "EUR" },
  { code: "GA", label: "Gabon", flag: "🇬🇦", currency: "XAF" },
  { code: "GE", label: "Géorgie", flag: "🇬🇪", currency: "GEL" },
  { code: "GH", label: "Ghana", flag: "🇬🇭", currency: "GHS" },
  { code: "GR", label: "Grèce", flag: "🇬🇷", currency: "EUR" },
  { code: "GT", label: "Guatemala", flag: "🇬🇹", currency: "GTQ" },
  { code: "GN", label: "Guinée", flag: "🇬🇳", currency: "GNF" },
  { code: "HT", label: "Haïti", flag: "🇭🇹", currency: "HTG" },
  { code: "HN", label: "Honduras", flag: "🇭🇳", currency: "HNL" },
  { code: "HK", label: "Hong Kong", flag: "🇭🇰", currency: "HKD" },
  { code: "HU", label: "Hongrie", flag: "🇭🇺", currency: "HUF" },
  { code: "IN", label: "Inde", flag: "🇮🇳", currency: "INR" },
  { code: "ID", label: "Indonésie", flag: "🇮🇩", currency: "IDR" },
  { code: "IQ", label: "Irak", flag: "🇮🇶", currency: "IQD" },
  { code: "IR", label: "Iran", flag: "🇮🇷", currency: "IRR" },
  { code: "IE", label: "Irlande", flag: "🇮🇪", currency: "EUR" },
  { code: "IS", label: "Islande", flag: "🇮🇸", currency: "ISK" },
  { code: "IT", label: "Italie", flag: "🇮🇹", currency: "EUR" },
  { code: "JM", label: "Jamaïque", flag: "🇯🇲", currency: "JMD" },
  { code: "JP", label: "Japon", flag: "🇯🇵", currency: "JPY" },
  { code: "JO", label: "Jordanie", flag: "🇯🇴", currency: "JOD" },
  { code: "KZ", label: "Kazakhstan", flag: "🇰🇿", currency: "KZT" },
  { code: "KE", label: "Kenya", flag: "🇰🇪", currency: "KES" },
  { code: "KW", label: "Koweït", flag: "🇰🇼", currency: "KWD" },
  { code: "LV", label: "Lettonie", flag: "🇱🇻", currency: "EUR" },
  { code: "LB", label: "Liban", flag: "🇱🇧", currency: "LBP" },
  { code: "LT", label: "Lituanie", flag: "🇱🇹", currency: "EUR" },
  { code: "LU", label: "Luxembourg", flag: "🇱🇺", currency: "EUR" },
  { code: "MG", label: "Madagascar", flag: "🇲🇬", currency: "MGA" },
  { code: "MY", label: "Malaisie", flag: "🇲🇾", currency: "MYR" },
  { code: "ML", label: "Mali", flag: "🇲🇱", currency: "XOF" },
  { code: "MT", label: "Malte", flag: "🇲🇹", currency: "EUR" },
  { code: "MA", label: "Maroc", flag: "🇲🇦", currency: "MAD" },
  { code: "MU", label: "Maurice", flag: "🇲🇺", currency: "MUR" },
  { code: "MX", label: "Mexique", flag: "🇲🇽", currency: "MXN" },
  { code: "MD", label: "Moldavie", flag: "🇲🇩", currency: "MDL" },
  { code: "MC", label: "Monaco", flag: "🇲🇨", currency: "EUR" },
  { code: "MN", label: "Mongolie", flag: "🇲🇳", currency: "MNT" },
  { code: "ME", label: "Monténégro", flag: "🇲🇪", currency: "EUR" },
  { code: "MZ", label: "Mozambique", flag: "🇲🇿", currency: "MZN" },
  { code: "NP", label: "Népal", flag: "🇳🇵", currency: "NPR" },
  { code: "NG", label: "Nigeria", flag: "🇳🇬", currency: "NGN" },
  { code: "NO", label: "Norvège", flag: "🇳🇴", currency: "NOK" },
  { code: "NZ", label: "Nouvelle-Zélande", flag: "🇳🇿", currency: "NZD" },
  { code: "OM", label: "Oman", flag: "🇴🇲", currency: "OMR" },
  { code: "UZ", label: "Ouzbékistan", flag: "🇺🇿", currency: "UZS" },
  { code: "PK", label: "Pakistan", flag: "🇵🇰", currency: "PKR" },
  { code: "PS", label: "Palestine", flag: "🇵🇸", currency: "ILS" },
  { code: "PA", label: "Panama", flag: "🇵🇦", currency: "PAB" },
  { code: "PY", label: "Paraguay", flag: "🇵🇾", currency: "PYG" },
  { code: "NL", label: "Pays-Bas", flag: "🇳🇱", currency: "EUR" },
  { code: "PE", label: "Pérou", flag: "🇵🇪", currency: "PEN" },
  { code: "PH", label: "Philippines", flag: "🇵🇭", currency: "PHP" },
  { code: "PL", label: "Pologne", flag: "🇵🇱", currency: "PLN" },
  { code: "PT", label: "Portugal", flag: "🇵🇹", currency: "EUR" },
  { code: "QA", label: "Qatar", flag: "🇶🇦", currency: "QAR" },
  { code: "DO", label: "Rép. dominicaine", flag: "🇩🇴", currency: "DOP" },
  { code: "RO", label: "Roumanie", flag: "🇷🇴", currency: "RON" },
  { code: "GB", label: "Royaume-Uni", flag: "🇬🇧", currency: "GBP" },
  { code: "RU", label: "Russie", flag: "🇷🇺", currency: "RUB" },
  { code: "RW", label: "Rwanda", flag: "🇷🇼", currency: "RWF" },
  { code: "SN", label: "Sénégal", flag: "🇸🇳", currency: "XOF" },
  { code: "RS", label: "Serbie", flag: "🇷🇸", currency: "RSD" },
  { code: "SG", label: "Singapour", flag: "🇸🇬", currency: "SGD" },
  { code: "SK", label: "Slovaquie", flag: "🇸🇰", currency: "EUR" },
  { code: "SI", label: "Slovénie", flag: "🇸🇮", currency: "EUR" },
  { code: "LK", label: "Sri Lanka", flag: "🇱🇰", currency: "LKR" },
  { code: "SE", label: "Suède", flag: "🇸🇪", currency: "SEK" },
  { code: "CH", label: "Suisse", flag: "🇨🇭", currency: "CHF" },
  { code: "TW", label: "Taïwan", flag: "🇹🇼", currency: "TWD" },
  { code: "TZ", label: "Tanzanie", flag: "🇹🇿", currency: "TZS" },
  { code: "CZ", label: "Tchéquie", flag: "🇨🇿", currency: "CZK" },
  { code: "TH", label: "Thaïlande", flag: "🇹🇭", currency: "THB" },
  { code: "TG", label: "Togo", flag: "🇹🇬", currency: "XOF" },
  { code: "TN", label: "Tunisie", flag: "🇹🇳", currency: "TND" },
  { code: "TR", label: "Turquie", flag: "🇹🇷", currency: "TRY" },
  { code: "UA", label: "Ukraine", flag: "🇺🇦", currency: "UAH" },
  { code: "UY", label: "Uruguay", flag: "🇺🇾", currency: "UYU" },
  { code: "VE", label: "Venezuela", flag: "🇻🇪", currency: "VES" },
  { code: "VN", label: "Vietnam", flag: "🇻🇳", currency: "VND" },
  { code: "ZM", label: "Zambie", flag: "🇿🇲", currency: "ZMW" },
  { code: "ZW", label: "Zimbabwe", flag: "🇿🇼", currency: "ZWL" },
];

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

@keyframes iz-typing { 0%, 60%, 100% { opacity: .3; transform: scale(.8); } 30% { opacity: 1; transform: scale(1); } }

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
:root { --iz-bg: #F5F5FA; --iz-white: #fff; --iz-text: #333; --iz-text-light: #888; --iz-text-muted: #aaa; --iz-border: #E8E8EE; --iz-pink: #E41076; --iz-pink-bg: #FFF0F5; }
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
// Illizeo Brand — design system from official Figma
const LIGHT_COLORS: Record<string, string> = {
  pink: "#E41076",          // brand-primary
  pinkLight: "#FDE8F2",     // brand-primary-soft
  pinkSoft: "#FA709A",      // brand-accent-soft
  pinkBg: "#FDE8F2",
  pinkHover: "#C80A64",     // brand-primary-hover
  dark: "#071437",          // fg-1 (headings)
  text: "#1E2129",          // fg-2 (body primary)
  textSecondary: "#252F4A", // fg-3
  textLight: "#4B5675",     // fg-4 (muted, most common)
  textMuted: "#78829D",     // fg-5 (placeholder/tertiary)
  textDisabled: "#99A1B7",  // fg-6
  border: "#F1F1F4",        // border-1 (default card)
  borderInput: "#DBDFE9",   // border-2 (input/button)
  borderStrong: "#CBD1DD",  // border-3
  bg: "#FBFBFB",            // bg-app (page bg)
  bgSubtle: "#FCFCFC",      // bg-subtle (inputs/toolbars)
  bgMuted: "#F9F9F9",
  bgCanvas: "#F5F5F3",      // paper-y section bg
  bgPanel: "#F2F2F7",       // grey panel
  bgWarm: "#FFF4ED",        // warm doc bg
  white: "#FFFFFF",         // bg-surface (cards)
  green: "#17C653",         // success
  greenLight: "#EAFFF1",    // success-50
  red: "#E41076",           // danger uses pink in Illizeo
  redPure: "#DC2626",       // danger-pure
  redLight: "#FEEBF2",      // danger-50
  amber: "#FAA61A",         // warning
  amberLight: "#FFF7EB",    // warning-50
  blue: "#1B84FF",          // blue-600 (primary blue)
  blueDark: "#0075FF",      // blue-700
  blueLight: "#EFF6FF",     // blue-50
  purple: "#7239EA",        // purple-600
  purpleSoft: "#986DFF",    // purple-500
  purpleLight: "#F8F5FF",   // purple-50
  purpleBg: "linear-gradient(135deg, #986DFF 0%, #B597FF 30%, #C4ACFF 60%, #D8C3FF 100%)",
};

const DARK_COLORS: Record<string, string> = {
  pink: "#E41076",
  pinkLight: "#3D1A2E",
  pinkSoft: "#FA709A",
  pinkBg: "#2D1525",
  pinkHover: "#C80A64",
  dark: "#0D0D1A",
  text: "#E0E0EE",
  textSecondary: "#C0C0D5",
  textLight: "#9A9AB0",
  textMuted: "#6B6B80",
  textDisabled: "#4D4D60",
  border: "#2E2E44",
  borderInput: "#3A3A50",
  borderStrong: "#4A4A60",
  bg: "#161628",
  bgSubtle: "#1A1A2E",
  bgMuted: "#1F1F35",
  bgCanvas: "#22223A",
  bgPanel: "#1E1E32",
  bgWarm: "#2A1F1A",
  white: "#1C1C30",
  green: "#39CD6C",
  greenLight: "#1B2E1B",
  red: "#E41076",
  redPure: "#EF4444",
  redLight: "#2E1B1B",
  amber: "#FFB74D",
  amberLight: "#2E2A1B",
  blue: "#42A5F5",
  blueDark: "#1E88E5",
  blueLight: "#1B2238",
  purple: "#986DFF",
  purpleSoft: "#B597FF",
  purpleLight: "#2D2040",
  purpleBg: "linear-gradient(135deg, #2D2040 0%, #3D2850 30%, #4D3060 60%, #5D3870 100%)",
};

export const C: Record<string, string> = { ...LIGHT_COLORS };

export function isDarkMode(): boolean {
  return localStorage.getItem("illizeo_dark_mode") === "true";
}

export function applyDarkMode(dark: boolean): void {
  const colors = dark ? DARK_COLORS : LIGHT_COLORS;
  let customPink = localStorage.getItem("illizeo_theme_color");
  // Migrate legacy burgundy color from localStorage to new Illizeo brand
  if (customPink === "#C2185B") {
    customPink = "#E41076";
    localStorage.setItem("illizeo_theme_color", "#E41076");
  }
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
export const REGION_LOCALE: Record<string, string> = {
  AF:"fa-AF",AL:"sq-AL",DZ:"ar-DZ",AD:"ca-AD",AO:"pt-AO",AR:"es-AR",AM:"hy-AM",AU:"en-AU",AT:"de-AT",AZ:"az-AZ",
  BH:"ar-BH",BD:"bn-BD",BE:"fr-BE",BJ:"fr-BJ",BO:"es-BO",BA:"bs-BA",BW:"en-BW",BR:"pt-BR",BN:"ms-BN",BG:"bg-BG",
  BF:"fr-BF",KH:"km-KH",CM:"fr-CM",CA:"fr-CA",CL:"es-CL",CN:"zh-CN",CO:"es-CO",KR:"ko-KR",CR:"es-CR",CI:"fr-CI",
  HR:"hr-HR",CU:"es-CU",CY:"el-CY",CZ:"cs-CZ",DK:"da-DK",DO:"es-DO",EC:"es-EC",EG:"ar-EG",AE:"ar-AE",EE:"et-EE",
  ET:"am-ET",FI:"fi-FI",FR:"fr-FR",GA:"fr-GA",GE:"ka-GE",DE:"de-DE",GH:"en-GH",GR:"el-GR",GT:"es-GT",GN:"fr-GN",
  HT:"fr-HT",HN:"es-HN",HK:"zh-HK",HU:"hu-HU",IS:"is-IS",IN:"hi-IN",ID:"id-ID",IR:"fa-IR",IQ:"ar-IQ",IE:"en-IE",
  IL:"he-IL",IT:"it-IT",JM:"en-JM",JP:"ja-JP",JO:"ar-JO",KZ:"kk-KZ",KE:"sw-KE",KW:"ar-KW",LV:"lv-LV",LB:"ar-LB",
  LT:"lt-LT",LU:"fr-LU",MG:"fr-MG",MY:"ms-MY",ML:"fr-ML",MT:"mt-MT",MA:"fr-MA",MU:"fr-MU",MX:"es-MX",MD:"ro-MD",
  MC:"fr-MC",MN:"mn-MN",ME:"sr-ME",MZ:"pt-MZ",NP:"ne-NP",NL:"nl-NL",NZ:"en-NZ",NG:"en-NG",NO:"nb-NO",OM:"ar-OM",
  PK:"ur-PK",PA:"es-PA",PY:"es-PY",PE:"es-PE",PH:"en-PH",PL:"pl-PL",PT:"pt-PT",QA:"ar-QA",RO:"ro-RO",RU:"ru-RU",
  RW:"rw-RW",SA:"ar-SA",SN:"fr-SN",RS:"sr-RS",SG:"en-SG",SK:"sk-SK",SI:"sl-SI",ZA:"en-ZA",ES:"es-ES",LK:"si-LK",
  SE:"sv-SE",CH:"fr-CH",TW:"zh-TW",TZ:"sw-TZ",TH:"th-TH",TG:"fr-TG",TN:"fr-TN",TR:"tr-TR",UA:"uk-UA",GB:"en-GB",
  US:"en-US",UY:"es-UY",UZ:"uz-UZ",VE:"es-VE",VN:"vi-VN",ZM:"en-ZM",ZW:"en-ZW",
};
export const REGION_CURRENCY: Record<string, string> = {
  AF:"AFN",AL:"ALL",DZ:"DZD",AD:"EUR",AO:"AOA",AR:"ARS",AM:"AMD",AU:"AUD",AT:"EUR",AZ:"AZN",
  BH:"BHD",BD:"BDT",BE:"EUR",BJ:"XOF",BO:"BOB",BA:"BAM",BW:"BWP",BR:"BRL",BN:"BND",BG:"BGN",
  BF:"XOF",KH:"KHR",CM:"XAF",CA:"CAD",CL:"CLP",CN:"CNY",CO:"COP",KR:"KRW",CR:"CRC",CI:"XOF",
  HR:"EUR",CU:"CUP",CY:"EUR",CZ:"CZK",DK:"DKK",DO:"DOP",EC:"USD",EG:"EGP",AE:"AED",EE:"EUR",
  ET:"ETB",FI:"EUR",FR:"EUR",GA:"XAF",GE:"GEL",DE:"EUR",GH:"GHS",GR:"EUR",GT:"GTQ",GN:"GNF",
  HT:"HTG",HN:"HNL",HK:"HKD",HU:"HUF",IS:"ISK",IN:"INR",ID:"IDR",IR:"IRR",IQ:"IQD",IE:"EUR",
  IL:"ILS",IT:"EUR",JM:"JMD",JP:"JPY",JO:"JOD",KZ:"KZT",KE:"KES",KW:"KWD",LV:"EUR",LB:"LBP",
  LT:"EUR",LU:"EUR",MG:"MGA",MY:"MYR",ML:"XOF",MT:"EUR",MA:"MAD",MU:"MUR",MX:"MXN",MD:"MDL",
  MC:"EUR",MN:"MNT",ME:"EUR",MZ:"MZN",NP:"NPR",NL:"EUR",NZ:"NZD",NG:"NGN",NO:"NOK",OM:"OMR",
  PK:"PKR",PA:"PAB",PY:"PYG",PE:"PEN",PH:"PHP",PL:"PLN",PT:"EUR",QA:"QAR",RO:"RON",RU:"RUB",
  RW:"RWF",SA:"SAR",SN:"XOF",RS:"RSD",SG:"SGD",SK:"EUR",SI:"EUR",ZA:"ZAR",ES:"EUR",LK:"LKR",
  SE:"SEK",CH:"CHF",TW:"TWD",TZ:"TZS",TH:"THB",TG:"XOF",TN:"TND",TR:"TRY",UA:"UAH",GB:"GBP",
  US:"USD",UY:"UYU",UZ:"UZS",VE:"VES",VN:"VND",ZM:"ZMW",ZW:"ZWL",
};

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

export const font = `'Inter', -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif`;

// ─── ILLIZEO LOGO SVG ────────────────────────────────────────
export const ILLIZEO_LOGO_URI = "/HR_Core_module_logo_O.png";


export const ILLIZEO_FULL_LOGO_URI = "/illizeo-Logo-site.png";
export const ILLIZEO_FULL_LOGO_URI_OLD = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyBpZD0iTUFJTl9MT0dPIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHZpZXdCb3g9IjAgMCA0NS44NCAxMC44Ij4KICA8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMzAuMS4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogMi4xLjEgQnVpbGQgMTM2KSAgLS0+CiAgPGcgaWQ9IklDT05feEEwX0ltYWdlIj4KICAgIDxpbWFnZSBpZD0iSUNPTl94QTBfSW1hZ2UxIiBkYXRhLW5hbWU9IklDT05feEEwX0ltYWdlIiB3aWR0aD0iNDUiIGhlaWdodD0iNDUiIHRyYW5zZm9ybT0ic2NhbGUoLjI0KSIgeGxpbms6aHJlZj0iZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFDNEFBQUFzQ0FZQUFBQWFjWW84QUFBQUNYQklXWE1BQUM0akFBQXVJd0Y0cFQ5MkFBQUhPVWxFUVZSWWhkV1piWXhjVlJuSGY4OXo3c3krekxaTVN4dDBoL3BlalNhVUtDUWJSRU0xaWlFUll5SmlFdzBFaVI4a3BVV3JiVHJHTHlhTVlvaWd4aGRzcVRHeDhFRlVJQTIrWUVIQ1ZsUVNvRlpsMjFvWDI1MVNVbW1uM2U3TzduYnVlZnh3N3N6TzdNN3V6dTdPZlBDZjNNeWRtL1B5dS8vN25IT2VjNit3Q0JXeitUN2dHOENkUU5SQ2xXdHpwY0tmRnROSHEycWxjd0NLMmZ4VzRENUFGdEYrZXRGRUxXcEI4R0kydnhiNERYRFZFdHJYSmRScFNmT0NGN1A1YTRHbldMcHpmb24xRnRTY2poU3orVThCZ3l6dmNVOHRvKzY4YWdwZXpPYXZCeDVwUS90bjI5QkdVODBDTDJiemJ3Y2VhNld5QUlJaXpjZnJybHlwOFBMeThPYldyQmozMkY1RnV1ZXJGREREUFplcFVERy9mNFZFK3cyT0FvZUJZN2xTWVh3NVlNVnN2aGQ0RzNBNFZ5cGNuQmQ4ZU9XT25kN2JBQmlpMHRSSlFRRmgxQ1laNlI0dkhrK1BiN3J0eEo3QjVVQTJnYjRTMkFkY1RnalpUOC9tU0hSc3hmWitVWWJGSkIzUUJKMEJMK3FvK0ppajZmT01wTWYzM2pxeTUzUHRCRTZnZHdLRkdaZHZ6cFVLdjZpL1VJdnhHTDh6OXBiMlpzU0F4L0RlOEZoeWg0NXo4UVFITXFjWjdoNjdwMFBRanpTQkJzalB2Q0FBUTMzYjFvaklLd0lacVE0M0NWNUhLRTZWb3BRNTFGZkNJWHR1UGZIZzdXMEdUZ01IZ0t2bktYWkRybFQ0YmZXUEFzVFlKbStXOFlBUlhQYm1FY0FoRE9zRkRxNG8wV1Y2cU4zUWlSNVlBQnJnOC9WL0ZNRGdwZ0FiampnSmo3UUp3OUVZUTMyalpHSWxaYktsQTlBQXFSYktmRHhKUHdEUWc1bTdMdmRtMXhsVnQ4SE02RUlwNmdSSE1xUDB4SXBESHJ1NXVPdVBIUUwvWVF0bGVvQWJhdUF4dHNGanhJbmJIcVBMaEROMmthRVZGMGliRWlFWS9LQkQwQ1NwN3hNdEZCMm9nWnZaVlY2c0Z0dmlZVXFNZjYwY3d6QlNKaGdjLzB4eDE1T2RBay8weXhiS1hGUE01cThBMEZqc0N1L0RZSXd4VXNCSTd3U2pya0szYVJMdFBOMDUzcHFlQUNvTGxIa1BzQUZBd1hKZXdvQk1lU2k1Q3ErbEorbnlOV2lBNXpxR215aFhLcHdDamkxUXJBdDRFNEI2czB0TkFxSUJwL3FtaURGY1k0VVRiU2R0cnBFV3lxd0dVSzhXZVRPY2gxSjNoZk91UXBjMXVBMXdvUU9RelhTNmhUSzlBT3FGMkNRTXpGSTZucXR3eTN2VDVjaXdWdmF6QWlGVVhzY2I1YlNuSE1XNDVuVlh0WlZ3RHNXd3RrWTJ0OG9BNnNWT1NneGw1NmxvOHkyUklodmFUdGxFTWJZdXhtYUc2VXlWSU16amY0OGpZN0tyZVhFMUlUTDVTTnNwWitob2RzYzZnL1dlNll5MGlUekpBRll2OW54TVNHWHJKUWlSYVRpOHZuOWYveDN2NkNSNGpIM0NVMDJwbWN2M2w0R0RBUno3bXpjZlZzM2Fwa3lJTERsRWNDcEV5SjBkQlRmYlZIVzdtWkdKbnMyVkNpOEE2RWRIZDUySUhVOTVNY1FNRnh3bU1zR0o0aENjQ1ZFc1cvWmZ0dm1kbllCK0tidnRreDc3UUd3aHlhdkNWMmE3ZnFCNm9nRGU3R0ZGaU5CcGx5VTU5K0Z3WGtqRitrQzdvWjlmOWVWMERQY0hZSWpOMStDck41RG9kZURSQm5BVCs3bUxPUlY1eFluZ2tsQnhGb0NkcjUxdmZHN1ZYZDlxSjdnWDIydGliL2JKV21JMWFHbzNrTVQ3cjNLbFFtMGhWSUNQalQ0NEVYbjdjVXJDWUhSMVRrZGVjVjREUEVMS1pNZEwyVzFmYUFmMDROcXRlN3pZVFhFQ0hTYzVVNXlrMTlYQm11eUJ2MTlmdHpadGkzUDNSc2JwS01RenpnczY3WFRZZTVyaVVGS21QL2xkLytaWkc5aFc5ZVFiTjEveTlCdTJQQnVMM1JZcmVERzhKRTRuOEw0QjNuNjJydlROUS9WdE5DeFNmN2hzOCsxcTdIWmVVUlBVUUtYdUJoRFVoQlJDeXBUalBlUC9MbmFYdjNMTGYzYi91aFhneC91L21FbWgyNTNKMTFWRVhQSlU2dzFTRXh3a0prRWtPaW13Zm4zcG5vWkViOWJxK3N5YUxZODc0MFpONGwyTnBER1ovZ1hTcG5TcjQ3Z2I1MWhtYkVUZzBSN3ZCZzFlQkY0bHZQRHNKYVNoQTRwODJIbHVWS1MzT2xNNVpvMmgwRWN5RlN1Q1ErNTQ5N2x2LzJnbTV5end3VXUzWmgzeUQvWFNYKyt5RW5iOHRmOWhiaWVGWTVTTEhPNDl6NW5VRkQzZWtUSlhObXdDeUZEM3RsY1JuQWVIaHZZc0NVRlBHRWZHdFB2aGVHakR1WHMvMit6cE5jMW4vckw2UzFkR1hsNVFSRjJkeTRxRXAwRGp0WEJtRkhXYzRjdzRaWTNwalIwdTdGVWJwRWFZQUpJMkhFbW8rQ1E4UEZYWC8zcjEyZThNekthcm10QkVBMmZ1TzZqSUI2TTZhSmRBVnp1TGtsOGdtYndnNS9zWUdGMXRieTFudkJmc2dxc3dKWTN2OXIxUW16MnE4N1JYdzFjSGFmZ2RBajQwRi9TY2psZjF6MHUrK2k2SEREcVJOVUl5YU9wZUxEZkxKaVJaR3Fhb1VJd21PTjAxS1dPdWt1eXFwSnEwSmJQVWRCaUtDR2t2cEdQOWMrVGx1bXYrZS8rOEh3VVdUTnlQck55ZVNhbnVVMlNqSTRRR2MwQTNOcXBKT1UvSkxuSTJmWkZ5S3FaTWhVa05UOEVSWnBVMFNrL0ZZY0x1amE5OXI2VTFvdVV2YU1Wc2ZvdkFkeGZJbFpzMExuWGRoRlZ3RWwvTFF4eENDamtlb2JmMGwrNStabkZ0dDZpVDJmenE1TVhRcHNYVWEreXNvY3RYZ0svMWwrNSthR2x0TFZMRmJQNHR3RTdDRGF4Y1pQVlhnZDhEUDgyVkNpMDdQRk5MQXErcW1NMzNBTmNEN3dQZVMvajBzWW93ZDA4U1BsNmRCSWFBSThDTG5mclMvSCtqL3dFeEF5YmNnOEJuUFFBQUFBQkpSVTVFcmtKZ2dnPT0iLz4KICA8L2c+CiAgPGcgaWQ9IlRFWFQiPgogICAgPGcgaWQ9Il94M0NfR3JvdXBlX3gzRV8iPgogICAgICA8ZyBpZD0iX3gzQ19Hcm91cGVfeDNFX194QTBfSW1hZ2UiPgogICAgICAgIDxpbWFnZSBpZD0iX3gzQ19Hcm91cGVfeDNFX194QTBfSW1hZ2UxIiBkYXRhLW5hbWU9Il94M0NfR3JvdXBlX3gzRV9feEEwX0ltYWdlIiB3aWR0aD0iNTMiIGhlaWdodD0iOCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTIuOTYgOC44OCkgc2NhbGUoLjI0KSIgeGxpbms6aHJlZj0iZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFEWUFBQUFIQ0FZQUFBQkRZNzdWQUFBQUNYQklXWE1BQUM0akFBQXVJd0Y0cFQ5MkFBQUNBVWxFUVZRNGpkM1RUNmhXVlJRRjhOL3pEeWFhcGp3TndaNzRENmtnQlJIQldhSURBNkVVSERoeDVraUNJUFpSYzVJZ2VEYWlrd2pVZ2FCVFVWRFJJQ09vTElNRzZpUko1U0hsb05LSDlVUWFhWVB2UFBpNHZPODFiOFBsbm4zV1d2dXV2ZTg1UTFBejErRkNpVmloUmMzOENSZEx4SkdXUDhDbkplSnN6YnhYSWxZYkVEVnpEMDdoTHQ0dEVXTTFjeE91WUZYTGwrTWJiQzRSOTZhb2RSMDNTOFNobXZrN0Z1T05FdkZielJ6SDFoSnhzNnViMGQ3TE1MT0QvWWt0VFF3TDhMaXRYNm1aUnh2blRJa1k2MmcveEFtOGczMDRQTWg0WHdOTGNhQnY2M0tKK0tKRHU0TlorQXp2WXh3dmF1WkhXTlU0dDByRTZXbFRmT3R2dklWZDJJMjVyUkM5Z1d6RFRzenJHSHdWSXlWaVA4N2h2UVlOL1Vkdk16SFNubVhkdWkzZXhBZFlXak1QNGphbVk3aFBOenhoY0ZDc3h2RVNVWnZoKzFpQmIvR3NSS3dkb0Z1UDRacDVEV3Z3ZXRzZng4dk8zeDNDRXlnUm85ZytoUitZZzZkNkorSUdmc1h6RXZGSmx6alIyR3dzNldEenNiSXZIK25qajlUTXZSakZMeVhpWVIvdkdIN0dWN2lJa3pWenU5NUFGdGJNSFhpRU1iMzdzcU5tanVKR2lmaG5rbVlXTlMvd0dqYVVpTzlyNW8vWWlHZVRUV0RpS0Q3Q3BRNzJKVzcxNVpmd3NBLzdHQ2V4ZVlKUU00ZndCL2FXaUdNbDRoU080dTBTOFJRL3RMemlPYzYzT3A5ajRXUUc4YlhlM1lLcitLdXRkK003dkJ5ZyszL0d2emNXcUU1UFhta0tBQUFBQUVsRlRrU3VRbUNDIi8+CiAgICAgIDwvZz4KICAgICAgPGcgaWQ9Il94M0NfVHJhY8OpX3RyYW5zcGFyZW50X3gzRV9feEEwX194MkJfX3hBMF9feDNDX1RyYWPDqV90cmFuc3BhcmVudF94M0VfX3hBMF9feDJCX194QTBfX3gzQ19UcmFjw6lfdHJhbnNwYXJlbnRfeDNFX194QTBfX3gyQl9feEEwX194M0NfVHJhY8OpX3RyYW5zcGFyZW50X3gzRV9feEEwX194MkJfX3hBMF9feDNDX1RyYWPDqV90cmFuc3BhcmVudF94M0VfX3hBMF9feDJCX194QTBfX3gzQ19UcmFjw6lfdHJhbnNwYXJlbnRfeDNFX194QTBfX3gyQl9feEEwX194M0NfVHJhY8OpX3RyYW5zcGFyZW50X3gzRV9feEEwX194MkJfX3hBMF9feDNDX1RyYWPDqV90cmFuc3BhcmVudF94M0VfX3hBMF9feDJCX194QTBfX3gzQ19UcmFjw6lfdHJhbnNwYXJlbnRfeDNFX194QTBfX3gyQl9feEEwX194M0NfVHJhY8OpX3RyYW5zcGFyZW50X3gzRV9feEEwX194MkJfX3hBMF9feDNDX1RyYWPDqV90cmFuc3BhcmVudF94M0VfX3hBMF9feDJCX194QTBfX3gzQ19UcmFjw6lfdHJhX3hBMF9JbWFnZS4uLiI+CiAgICAgICAgPGltYWdlIGlkPSJfeDNDX1RyYWPDqV90cmFuc3BhcmVudF94M0VfX3hBMF9feDJCX194QTBfX3gzQ19UcmFjw6lfdHJhbnNwYXJlbnRfeDNFX194QTBfX3gyQl9feEEwX194M0NfVHJhY8OpX3RyYW5zcGFyZW50X3gzRV9feEEwX194MkJfX3hBMF9feDNDX1RyYWPDqV90cmFuc3BhcmVudF94M0VfX3hBMF9feDJCX194QTBfX3gzQ19UcmFjw6lfdHJhbnNwYXJlbnRfeDNFX194QTBfX3gyQl9feEEwX194M0NfVHJhY8OpX3RyYW5zcGFyZW50X3gzRV9feEEwX194MkJfX3hBMF9feDNDX1RyYWPDqV90cmFuc3BhcmVudF94M0VfX3hBMF9feDJCX194QTBfX3gzQ19UcmFjw6lfdHJhbnNwYXJlbnRfeDNFX194QTBfX3gyQl9feEEwX194M0NfVHJhY8OpX3RyYW5zcGFyZW50X3gzRV9feEEwX194MkJfX3hBMF9feDNDX1RyYWPDqV90cmFuc3BhcmVudF94M0VfX3hBMF9feDJCX194QTBfX3gzQ19UcmFjw6lfdHJhbnNwYXJlbnRfeDNFX194QTBfX3gyQl9feEEwX194M0NfVHJhY8OpX3RyYV94QTBfSW1hZ2UuLi4xIiBkYXRhLW5hbWU9Il94M0NfVHJhY8OpX3RyYW5zcGFyZW50X3gzRV9feEEwX194MkJfX3hBMF9feDNDX1RyYWPDqV90cmFuc3BhcmVudF94M0VfX3hBMF9feDJCX194QTBfX3gzQ19UcmFjw6lfdHJhbnNwYXJlbnRfeDNFX194QTBfX3gyQl9feEEwX194M0NfVHJhY8OpX3RyYW5zcGFyZW50X3gzRV9feEEwX194MkJfX3hBMF9feDNDX1RyYWPDqV90cmFuc3BhcmVudF94M0VfX3hBMF9feDJCX194QTBfX3gzQ19UcmFjw6lfdHJhbnNwYXJlbnRfeDNFX194QTBfX3gyQl9feEEwX194M0NfVHJhY8OpX3RyYW5zcGFyZW50X3gzRV9feEEwX194MkJfX3hBMF9feDNDX1RyYWPDqV90cmFuc3BhcmVudF94M0VfX3hBMF9feDJCX194QTBfX3gzQ19UcmFjw6lfdHJhbnNwYXJlbnRfeDNFX194QTBfX3gyQl9feEEwX194M0NfVHJhY8OpX3RyYW5zcGFyZW50X3gzRV9feEEwX194MkJfX3hBMF9feDNDX1RyYWPDqV90cmFuc3BhcmVudF94M0VfX3hBMF9feDJCX194QTBfX3gzQ19UcmFjw6lfdHJhX3hBMF9JbWFnZS4uLiIgd2lkdGg9IjgzIiBoZWlnaHQ9IjgiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDI1LjkyIDguODgpIHNjYWxlKC4yNCkiIHhsaW5rOmhyZWY9ImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBRlFBQUFBSENBWUFBQUNXY1dxWUFBQUFDWEJJV1hNQUFDNGpBQUF1SXdGNHBUOTJBQUFEY2tsRVFWUklpZTNWU2NpV1ZSUUg4Ti8zcWRsb1ZxUVZOaGlXVkZTTEZnV1ZWRkphdURFczA0VlJVUlFWVFhodVFXMkUwSHMrb2FMQklwVUdhQkVTQmkxS0Nvc3NhTUJ5WTRNdW1wR2lTUnZNL0xURmMxOThlNmxkeS83dzh0N3puT2RNLzN2T2VZWnE1cm5ZZ0VVbDRsbW9tYi9oeFJLeG9HYmVpQlZZV1NLdXI1bXJNYTFFektpWkgyQ2tSRHhuQURYelRLd3BFU2MxK1VLc0toRW4xc3lWbUZBaXJxeVppL0IwaVJqcXMvMFZTMHBFclpraitMWkVqTlRNcGJnYnd5VmliODA4RDIvaVdJekRPa3d2RVh1YW53OWIzby9VekluWWlMa2xZbFBObklEUE1LbEU3SzZaUjJJTFRzRkViTVpwSldKenpUd1lPM0JyODdVUzErR21FdkY0elZ3SEplS1NZU3pETnoweUd4WmdkanRQd2V1NHFHWWVqWS9SSy80SFhGWXo1OWJNa3djNC9RMEgxc3g1TlhNV1ptSlgwKzNDQWUxOE12NGNzSDBSeTJybS9CS3h1RVNNdE9kWFkzR0oyTnNLMklDM2NCTyt3OTRCUC84azkySk5iblVjMWVROTdmY1Ric05MSldKemkvTUxIc1JkN2QzRDhEN3ViUExYUFU2R01RbGZEQVQrQnFQdGZFaExlakZXTjV2ZFRmY2o1aUF4YThESGR0MU5qN1JrYnRDUkRCL2g0dGFKVncvYWxvaUZ1QmRQMWN4dE5YTktVKzNFcHdOeHZzU1I5bDF5UDRiNjZoalZFVHJjNU1IL0hzWTJmOXNHbm4raUl4eU93d040dm1ZdWJ6bnM3amw3QytjTUdNL3VTM0FjemlnUkwrQWczTk5YMUZUY1VTSk9LaEVQRC9pWXJPdjhxU1hpRkN6RW9VMTNBcDdCMDloV0l0YjNHOWJNU1NYaS9oSnhnSzd6MWpiVkhsd3hFT2NpdklzeEdPMk5lOE1FN1JKTHhBN2RWSXo2ZHd6cGlIa1A1dy9vNXVrYXFJZnBKZUplek5VMXhWYTYyN2dEYzJybUc3aWxGYnNFTnpiRGlmYU54VjB0K1I0eFkzRjJ6WHdidjVlSS9rNGZ4aEUxYzBLSjJJN0RteTg2c29kTHhNS2F1YmRtTGlvUnovVFp2bG96eCtOUzdLL2JkWEF6WHE2WnIrbEdydWdtYkJWT3h6RTE4MVQ4V1NLMk5HS1cxc3hOdUxibHNMWDVHdFB5NlhYb1VKT242aVpxYWMxOENFL3ExdFZNbk5YSHliUjJYbzdIY0xCVzFNK054Q1B3RHRiZzloTHhSRFA0cXBkRWlYaFB0MC9ITmQwR1hLNzdNQ3p6ZC95dTI3Yzk3T2lUdjdCdmZCN0ZmUU8ybDJNOE51SDdKaXNScitBcVBLNjcyQXR3Zk51cDIvRUwxbU50elJ4VEl1YTNXTy9nR3N3b0ViMGQrb2R1OWZUazBTWWZVaUoyNHJRVzY5MVcyNlVsWW1ON2R3cytiem10MEsyRC9meVAveDUvQWVaeVMvekE5eWprQUFBQUFFbEZUa1N1UW1DQyIvPgogICAgICA8L2c+CiAgICA8L2c+CiAgICA8ZyBpZD0iX3gzQ19Hcm91cGVfeDNFX194QTBfSW1hZ2UyIiBkYXRhLW5hbWU9Il94M0NfR3JvdXBlX3gzRV9feEEwX0ltYWdlIj4KICAgICAgPGltYWdlIGlkPSJfeDNDX0dyb3VwZV94M0VfX3hBMF9JbWFnZTMiIGRhdGEtbmFtZT0iX3gzQ19Hcm91cGVfeDNFX194QTBfSW1hZ2UiIHdpZHRoPSIxMzciIGhlaWdodD0iMjYiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEyLjk2IDEuNjgpIHNjYWxlKC4yNCkiIHhsaW5rOmhyZWY9ImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBSW9BQUFBWUNBWUFBQUFsS1dVc0FBQUFDWEJJV1hNQUFDNGpBQUF1SXdGNHBUOTJBQUFGT0VsRVFWUm9nZTJhYlloVlJSakhmL2VxYTFJYVEyb1VZNit1NVBhbVVaRnBGT0pMRk5FYlZHVDVvWll5ckE5RlRZaVdJRll5WkZCUUVhYWdoVUdXUlNDMTlJWm11V1VXV0xZVnExUk9XNkl4Z3ByYmF0bUhPYXZYY2M2NTU1eDdkai9VK2NQaDNubWVPZjk1enIzUG1YbG1ucWRpaEZvT3pPUm90RWlyT3dqQUNEVUZlTjhUYjVWV2p3NzFUd01qVkFYNENUak5VMDJSVm4vWUFPOXc0QmRnU0kxNHRiVDY1a0Rmc2NCM2VjZnljTHUwK2pXUC8yWGc3Z1o1MTBtcnIwenFZSVJxQlpZa2RPbVFWcmRrSFhoZzFodit3L2dkK0F3NEVUaVVrNk1DSENEc2NEWW5aeTEySlNtTlVETkpkcEllb0QzUHdLV2pSSkJXVzJCaUh3N3hPTEFVNTB4WkhiRVNmVzZQNjJDRU9oZFlIcU4rRTFnR2JJaWVNek5LUitrblNLdjNBOS8zNFJEdkJtUmR3RzNTNmsreUVCbWhwZ0d6Z2FlazFlMVFPa3Evd1FqVkJJeXFFVzJYVnZjVXhIMlh4dzF1cVJzbnJkNlpnV2NRTUIrWUc0bWFnUmFBYWdGMi9pOWhoQnBoaERvL3d5MExnTTZhYTNHQjVzd0p5S1ptY1pJSUQzTEVTUURHR3FFbVF1a29qV0FUc05rSU5UMWwvK0ZlZTJRUlJoaWhtZ0YveDdsU1dyMHBCOTNuQWRtdFVEcEtMaGloMW5Ga3FuL1BDTlVhYmZHVDhLZlgvclVnY3lZSFpJdnlFRW1yMXdKZmV1SkpVTVlvbVdHRVdnRmM0WW1YQUcwazdFb0N1TW9JZFFOdU94MzN3bGFCYmRMcWJ4SjRtcjMySDhDV0RIYjRhQU11cm1tZkFxV2paSUlSYWpGd1owQzFBSGNPa3dYamdiZFM5TnNDbkplZ0grcTFmNVJXLzVQUmxxUHVEL0dYanBJU1JxZzV3RU1CMVVKcDlmdytISHB2SGIxL0p2TjNYeGhSeGlncEVCMkxQeGxRYVduMVkzMDgvSWc2K2oxZWUweUtlQ2tKL2xLMkQ4b1pwUzZNVU5jUVBoWi9SbHI5YUFQVVBjQzNRTkl5VVFFK3JjUGpMeFVqZ1RIQUR6bnRtdWExZDBEcEtJa3dRbDBDckFtb25wWldQOUlnL2V2UzZsQzhreFVmQjJRUEFQZG5KVEpDblExYzZvazNRTG4weE1JSU5ScFlIMUM5VklDVFFEU2xOd3BwZFNmSHppcXpqVkIrSmo0TlhnbklWa1BwS0VFWW9VYmlzcXhObm1xcHRIcFdRY1A0M0kzZ2lZQnNyUkhxK0xRRVJxaEZ3QVJQdkYxYTNRYkZPY3FCZ25oOGRQVVJieXlNVUVOd2gwNG5lYW9sMHVyV0FvY3FaRVlCa0ZhdkFINzJ4R2NBSGRIeW1RZ2oxSXRBS042NnQvZExVVEhLcVVhb3liZy9Ob2x6bTdUYVA2Rk13Z3dqMUVwY1VCZUs1Q3ZBTG1uMWJ4azQ2NkdkWXhOc2k2WFZEeGM0QnNEcFJxakJ1R0EyelM2bElxMytLMEYvRXk2dFVJdFJ3QmRHcUZkeEpRNGJwZFg3akZCVjRNem9udnVpN3o1V1Nhc1BaNlNMY3BSaFFKcEt0TGVCR3pQd3p1WG9KRlVJdTQxUVVscmQwQnNhVGROdkFCY0UxT2RFSjdKRGNiOVpGUmpnWFpYbzh5QXdLNjVDc0FiWDRYWVVxUjNGQ0xWR1dqMGpwSlJXZjJXRW1nMDhIMURmRVYxN2pWQzdjY3RlVXE2cFExcDlTNjJndjNjOWhTVENQQXpEUFhpalUvazQ0T29ZM2JVWnVjWUQ5UndGWERWZEZvU2MrRENrMVM4WW9RWUN6OFowT1NHNmtyQVp1TndYVm9IQmdjNERFb2dHMVJrb0NRY1RkTWZsNUV5S2owTFBGeGRFYmdTMjVyVEJSM2RBVmtUd1d1K1VGbW4xYzhEMVFKN2xlSm0wK3NMUTdGd2wvRU1uRmRSa2lURjhKSzJ4ZVFQckp1THREU1hjZ3ROOFZFUjBUMDRiZk93UHlCckp2L1FpMVltcnRQb2Q0Q3pjYnFpelR2ZHVYS25rWmRMcTJPTHZnYmhvZDFXTklYdnFrSzhIcHVNcTI5TStmTzhEZmgxU1Nxc1BSY0Z3YjFDVnRxYTBDblRGeFNmU2FtdUVtb1NyQmVubGpNM0VTcXMvTWtKTkFFNG0zeDlieGIwTW9YaHRJYTVjc1pHYTJkU2xsTkxxYm1BZU1NOElOUlc0Q0pjSkhvWnpqcDI0ODVjUHBOVTdNdHBUb2tRWS93S0lqSGNVNHdTbk9nQUFBQUJKUlU1RXJrSmdnZz09Ii8+CiAgICA8L2c+CiAgPC9nPgo8L3N2Zz4=";
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
