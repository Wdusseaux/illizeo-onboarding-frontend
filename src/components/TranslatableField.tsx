import { useState, useRef, useEffect } from "react";
import { Languages, X } from "lucide-react";
import { LANG_META, type Lang } from "../i18n";
import { C, sInput, sBtn, font } from "../constants";

export type Translations = Partial<Record<Lang, string>>;

interface Props {
  value: string;
  onChange: (v: string) => void;
  translations?: Translations;
  onTranslationsChange?: (t: Translations) => void;
  currentLang: Lang;
  activeLangs: Lang[];
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
  style?: React.CSSProperties;
  disabled?: boolean;
}

export default function TranslatableField({
  value, onChange, translations = {}, onTranslationsChange,
  currentLang, activeLangs, placeholder, multiline, rows = 3, style, disabled,
}: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);

  const otherLangs = activeLangs.filter(l => l !== currentLang);
  const hasTranslations = otherLangs.some(l => {
    if (l === "fr") return !!value?.trim();
    return !!translations[l]?.trim();
  });

  // The displayed value in the main field depends on currentLang:
  // - If currentLang is "fr", show/edit `value` directly
  // - If currentLang is another lang, show/edit `translations[currentLang]`
  const isFrPrimary = currentLang === "fr";
  const displayValue = isFrPrimary ? value : (translations[currentLang] || "");
  const handleDisplayChange = (v: string) => {
    if (isFrPrimary) {
      onChange(v);
    } else {
      onTranslationsChange?.({ ...translations, [currentLang]: v });
    }
  };

  if (otherLangs.length === 0 || !onTranslationsChange) {
    return multiline
      ? <textarea value={displayValue} onChange={e => handleDisplayChange(e.target.value)} placeholder={placeholder} rows={rows} disabled={disabled} style={{ ...sInput, resize: "vertical" as const, ...style }} />
      : <input value={displayValue} onChange={e => handleDisplayChange(e.target.value)} placeholder={placeholder} disabled={disabled} style={{ ...sInput, ...style }} />;
  }

  return (
    <div style={{ position: "relative" }} ref={ref}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 6 }}>
        <div style={{ flex: 1 }}>
          {multiline
            ? <textarea value={displayValue} onChange={e => handleDisplayChange(e.target.value)} placeholder={placeholder} rows={rows} disabled={disabled} style={{ ...sInput, resize: "vertical" as const, ...style }} />
            : <input value={displayValue} onChange={e => handleDisplayChange(e.target.value)} placeholder={placeholder} disabled={disabled} style={{ ...sInput, ...style }} />
          }
        </div>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          title="Traduire"
          style={{
            background: "none", border: `1px solid ${hasTranslations ? C.pink : C.border}`,
            borderRadius: 8, padding: "8px 8px", cursor: "pointer",
            color: hasTranslations ? C.pink : C.textMuted,
            display: "flex", alignItems: "center", justifyContent: "center",
            marginTop: 1, transition: "all .15s",
          }}
        >
          <Languages size={18} />
        </button>
      </div>

      {open && (
        <div style={{
          position: "absolute", right: 0, top: "100%", marginTop: 6, zIndex: 2100,
          background: C.white, border: `1px solid ${C.border}`, borderRadius: 14,
          boxShadow: "0 8px 30px rgba(0,0,0,.15)", padding: "20px 22px", minWidth: 380,
          fontFamily: font,
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Languages size={18} color={C.pink} />
              <span style={{ fontSize: 15, fontWeight: 600, color: C.text }}>Traductions</span>
            </div>
            <button onClick={() => setOpen(false)} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={18} color={C.textLight} /></button>
          </div>

          {/* All languages — current lang is primary (read-only), others are editable */}
          {activeLangs.map(lang => {
            const isCurrent = lang === currentLang;
            const langValue = lang === "fr" ? value : (translations[lang] || "");
            const handleLangChange = (v: string) => {
              if (lang === "fr") onChange(v);
              else onTranslationsChange({ ...translations, [lang]: v });
            };
            return (
              <div key={lang} style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 11, fontWeight: 600, color: C.textMuted, display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
                  {LANG_META[lang].flag} {LANG_META[lang].nativeName}
                  {isCurrent && <span style={{ fontSize: 10, color: C.textLight, fontWeight: 400 }}>(principal)</span>}
                </label>
                {multiline ? (
                  <textarea
                    rows={rows}
                    value={langValue}
                    onChange={e => handleLangChange(e.target.value)}
                    placeholder={`(${LANG_META[lang].nativeName})`}
                    style={{ ...sInput, fontSize: 13, resize: "vertical" as const }}
                  />
                ) : (
                  <input
                    value={langValue}
                    onChange={e => handleLangChange(e.target.value)}
                    placeholder={`(${LANG_META[lang].nativeName})`}
                    style={{ ...sInput, fontSize: 13 }}
                  />
                )}
              </div>
            );
          })}

          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 4 }}>
            <button onClick={() => setOpen(false)} className="iz-btn-pink" style={{ ...sBtn("pink"), fontSize: 12, padding: "6px 16px" }}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
}
