import { useState, useRef, useEffect } from "react";
import { Languages, X, Sparkles, Loader2 } from "lucide-react";
import { t, LANG_META, type Lang } from "../i18n";
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
  const [translating, setTranslating] = useState<string | 'all' | null>(null);
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

  const isFrPrimary = currentLang === "fr";
  const displayValue = isFrPrimary ? value : (translations[currentLang] || "");
  const handleDisplayChange = (v: string) => {
    if (isFrPrimary) onChange(v);
    else onTranslationsChange?.({ ...translations, [currentLang]: v });
  };

  // Detect source language: find the first language that has content
  const getSourceLangAndText = (): { sourceLang: Lang; sourceText: string } | null => {
    // Priority: French first, then current lang, then any other
    if (value?.trim()) return { sourceLang: 'fr' as Lang, sourceText: value.trim() };
    if (translations[currentLang]?.trim()) return { sourceLang: currentLang, sourceText: translations[currentLang]!.trim() };
    for (const lang of activeLangs) {
      const text = lang === 'fr' ? value : translations[lang];
      if (text?.trim()) return { sourceLang: lang, sourceText: text.trim() };
    }
    return null;
  };

  const source = getSourceLangAndText();
  const sourceText = source?.sourceText || '';
  const sourceLang = source?.sourceLang || 'fr' as Lang;

  const translateOne = async (targetLang: Lang) => {
    if (!source) return;
    setTranslating(targetLang);
    try {
      const { aiTranslate } = await import('../api/endpoints');
      const result = await aiTranslate(source.sourceText, source.sourceLang, [targetLang]);
      if (result.translations?.[targetLang]) {
        if (targetLang === 'fr') {
          // Translate INTO French → update the main value
          onChange(result.translations[targetLang]);
        } else {
          onTranslationsChange?.({ ...translations, [targetLang]: result.translations[targetLang] });
        }
      }
    } catch (e) {
      console.error('Translation failed:', e);
    }
    setTranslating(null);
  };

  const translateAll = async () => {
    if (!source) return;
    // Translate to all languages that don't have content yet (or all non-source)
    const langsToTranslate = activeLangs.filter(l => l !== source.sourceLang);
    if (langsToTranslate.length === 0) return;
    setTranslating('all');
    try {
      const { aiTranslate } = await import('../api/endpoints');
      const result = await aiTranslate(source.sourceText, source.sourceLang, langsToTranslate);
      if (result.translations) {
        const updated = { ...translations };
        for (const [lang, text] of Object.entries(result.translations)) {
          if (text) {
            if (lang === 'fr') {
              onChange(text as string);
            } else {
              updated[lang as Lang] = text as string;
            }
          }
        }
        onTranslationsChange?.(updated);
      }
    } catch (e) {
      console.error('Translation failed:', e);
    }
    setTranslating(null);
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
          boxShadow: "0 8px 30px rgba(0,0,0,.15)", padding: "20px 22px", minWidth: 420,
          fontFamily: font,
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Languages size={18} color={C.pink} />
              <span style={{ fontSize: 15, fontWeight: 600, color: C.text }}>{t('common.translations')}</span>
              {sourceText && <span style={{ fontSize: 10, color: C.textMuted, marginLeft: 4 }}>depuis {LANG_META[sourceLang]?.flag} {LANG_META[sourceLang]?.nativeName}</span>}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {/* Translate all button */}
              {activeLangs.filter(l => l !== sourceLang).length > 0 && (
                <button
                  onClick={translateAll}
                  disabled={translating !== null || !sourceText}
                  title={sourceText ? `Traduire toutes les langues depuis ${LANG_META[sourceLang]?.nativeName || sourceLang}` : "Saisissez d'abord le texte dans au moins une langue"}
                  style={{
                    display: "flex", alignItems: "center", gap: 5, padding: "5px 12px",
                    borderRadius: 8, border: "none", cursor: !sourceText ? "not-allowed" : translating ? "wait" : "pointer",
                    background: "linear-gradient(135deg, #1a1a2e, #1A73E8)", color: "#fff",
                    fontSize: 11, fontWeight: 600, fontFamily: font, opacity: !sourceText ? 0.4 : translating ? 0.7 : 1,
                  }}
                >
                  {translating === 'all' ? <Loader2 size={12} className="spin" style={{ animation: "spin 1s linear infinite" }} /> : <Sparkles size={12} />}
                  Traduire tout
                </button>
              )}
              <button onClick={() => setOpen(false)} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={18} color={C.textLight} /></button>
            </div>
          </div>

          {/* All languages */}
          {activeLangs.map(lang => {
            const isCurrent = lang === currentLang;
            const isFr = lang === "fr";
            const langValue = isFr ? value : (translations[lang] || "");
            const handleLangChange = (v: string) => {
              if (isFr) onChange(v);
              else onTranslationsChange({ ...translations, [lang]: v });
            };
            const isSourceLang = lang === sourceLang;
            const canTranslate = !isSourceLang && !!sourceText;
            const isTranslatingThis = translating === lang || translating === 'all';

            return (
              <div key={lang} style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 5 }}>
                  <label style={{ fontSize: 11, fontWeight: 600, color: C.textMuted, display: "flex", alignItems: "center", gap: 6 }}>
                    {LANG_META[lang].flag} {LANG_META[lang].nativeName}
                    {isCurrent && <span style={{ fontSize: 10, color: C.textLight, fontWeight: 400 }}>({t('common.primary')})</span>}
                  </label>
                  {!isSourceLang && (
                    <button
                      onClick={() => canTranslate && translateOne(lang)}
                      disabled={isTranslatingThis || !canTranslate}
                      title={canTranslate ? `Traduire en ${LANG_META[lang].nativeName} depuis ${LANG_META[sourceLang]?.nativeName || sourceLang}` : "Saisissez d'abord le texte dans au moins une langue"}
                      style={{
                        display: "flex", alignItems: "center", gap: 4, padding: "2px 8px",
                        borderRadius: 6, border: `1px solid ${C.border}`, background: C.white,
                        cursor: !canTranslate ? "not-allowed" : isTranslatingThis ? "wait" : "pointer", fontSize: 10, fontWeight: 500,
                        color: canTranslate ? C.blue : C.textMuted, fontFamily: font, opacity: !canTranslate ? 0.4 : isTranslatingThis ? 0.6 : 1,
                        transition: "all .15s",
                      }}
                    >
                      {isTranslatingThis ? <Loader2 size={10} style={{ animation: "spin 1s linear infinite" }} /> : <Sparkles size={10} />}
                      IA
                    </button>
                  )}
                </div>
                {multiline ? (
                  <textarea
                    rows={rows}
                    value={langValue}
                    onChange={e => handleLangChange(e.target.value)}
                    placeholder={`(${LANG_META[lang].nativeName})`}
                    style={{ ...sInput, fontSize: 13, resize: "vertical" as const, borderColor: isTranslatingThis ? C.blue : undefined, transition: "border-color .3s" }}
                  />
                ) : (
                  <input
                    value={langValue}
                    onChange={e => handleLangChange(e.target.value)}
                    placeholder={`(${LANG_META[lang].nativeName})`}
                    style={{ ...sInput, fontSize: 13, borderColor: isTranslatingThis ? C.blue : undefined, transition: "border-color .3s" }}
                  />
                )}
              </div>
            );
          })}

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
            <span style={{ fontSize: 10, color: C.textMuted }}>Les traductions IA sont cachées en base de données</span>
            <button onClick={() => setOpen(false)} className="iz-btn-pink" style={{ ...sBtn("pink"), fontSize: 12, padding: "6px 16px" }}>OK</button>
          </div>
        </div>
      )}

      {/* CSS for spin animation */}
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
