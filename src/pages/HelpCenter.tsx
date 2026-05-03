import { useState, useEffect, useMemo } from 'react';
import { marked } from 'marked';
import {
  Search, ChevronRight, Rocket, Sparkles, LogOut, RotateCcw, FileText,
  Handshake, Laptop, ShieldCheck, CircleDollarSign, Users, Plug, HelpCircle,
  ArrowLeft, X, BookOpen, Home,
} from 'lucide-react';
import { C, font, sCard, sInput, IllizeoLogoFull } from '../constants';
import { DOCS_SECTIONS, getArticleContent, findArticle, getTotalArticleCount, type DocSection, type DocArticle } from '../docs/registry';

const ICON_MAP: Record<string, any> = {
  Rocket, Sparkles, LogOut, RotateCcw, FileText, Handshake,
  Laptop, ShieldCheck, CircleDollarSign, Users, Plug, HelpCircle,
};

// Configure marked once (no plugins to keep bundle small)
marked.setOptions({
  gfm: true,
  breaks: false,
});

interface HelpCenterProps {
  initialSlug?: string;
  onClose?: () => void;
}

export default function HelpCenter({ initialSlug, onClose }: HelpCenterProps) {
  const [activeSlug, setActiveSlug] = useState<string | null>(
    initialSlug || DOCS_SECTIONS[0]?.articles[0]?.slug || null
  );
  const [search, setSearch] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false); // mobile

  // Sync URL ?article=xxx with state
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const slugFromUrl = params.get('article');
    if (slugFromUrl && slugFromUrl !== activeSlug) {
      setActiveSlug(slugFromUrl);
    }
  }, []);

  // Update URL when slug changes
  useEffect(() => {
    if (typeof window === 'undefined' || !activeSlug) return;
    const params = new URLSearchParams(window.location.search);
    if (params.get('article') !== activeSlug) {
      params.set('article', activeSlug);
      const newUrl = `${window.location.pathname}?${params.toString()}`;
      window.history.replaceState({}, '', newUrl);
    }
  }, [activeSlug]);

  const found = activeSlug ? findArticle(activeSlug) : null;
  const currentSection = found?.section;
  const currentArticle = found?.article;
  const articleHtml = useMemo(() => {
    if (!currentArticle) return '';
    const md = getArticleContent(currentArticle.file);
    return marked.parse(md, { async: false }) as string;
  }, [currentArticle]);

  // Filter sections by search query
  const filteredSections = useMemo(() => {
    if (!search.trim()) return DOCS_SECTIONS;
    const q = search.toLowerCase();
    return DOCS_SECTIONS.map((s) => ({
      ...s,
      articles: s.articles.filter((a) =>
        a.title.toLowerCase().includes(q) ||
        a.slug.toLowerCase().includes(q) ||
        (a.keywords || []).some((k) => k.toLowerCase().includes(q))
      ),
    })).filter((s) => s.articles.length > 0);
  }, [search]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: font, background: C.white, color: C.text }}>
      {/* Sidebar */}
      <aside style={{
        width: 300,
        minWidth: 300,
        background: '#FAFAFB',
        borderRight: `1px solid ${C.border}`,
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{ padding: '20px 20px 14px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: 'inherit' }}>
            <IllizeoLogoFull height={20} />
          </a>
          {onClose && (
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: C.textMuted }} title="Fermer">
              <X size={18} />
            </button>
          )}
        </div>

        {/* Title */}
        <div style={{ padding: '14px 20px 10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <BookOpen size={16} color={C.pink} />
            <h2 style={{ fontSize: 14, fontWeight: 700, margin: 0, color: C.text }}>Centre d'aide</h2>
          </div>
          <p style={{ fontSize: 11, color: C.textMuted, margin: 0 }}>
            {getTotalArticleCount()} articles · Tout savoir sur Illizeo
          </p>
        </div>

        {/* Search */}
        <div style={{ padding: '0 16px 12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px', background: C.white, border: `1px solid ${C.border}`, borderRadius: 8 }}>
            <Search size={14} color={C.textMuted} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un article…"
              style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 12, fontFamily: font, color: C.text }}
            />
            {search && (
              <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: C.textMuted }}>
                <X size={12} />
              </button>
            )}
          </div>
        </div>

        {/* Sections */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 12px 20px' }}>
          {filteredSections.length === 0 && (
            <div style={{ padding: '20px 12px', fontSize: 12, color: C.textMuted, textAlign: 'center' }}>
              Aucun article ne correspond à votre recherche.
            </div>
          )}
          {filteredSections.map((section) => {
            const Icon = ICON_MAP[section.iconName] || HelpCircle;
            return (
              <div key={section.id} style={{ marginBottom: 4 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 10px 6px', fontSize: 10, fontWeight: 700, color: C.pink, textTransform: 'uppercase', letterSpacing: 1 }}>
                  <Icon size={12} />
                  <span>{section.title}</span>
                </div>
                {section.articles.map((article) => (
                  <button
                    key={article.slug}
                    onClick={() => setActiveSlug(article.slug)}
                    style={{
                      display: 'block',
                      width: '100%',
                      textAlign: 'left',
                      padding: '7px 10px 7px 28px',
                      fontSize: 12,
                      lineHeight: 1.4,
                      color: activeSlug === article.slug ? C.pink : C.textLight,
                      background: activeSlug === article.slug ? C.pinkBg : 'transparent',
                      border: 'none',
                      borderRadius: 6,
                      cursor: 'pointer',
                      fontFamily: font,
                      fontWeight: activeSlug === article.slug ? 600 : 400,
                      marginBottom: 1,
                      transition: 'all .12s',
                    }}
                    onMouseEnter={(e) => { if (activeSlug !== article.slug) e.currentTarget.style.background = C.bg; }}
                    onMouseLeave={(e) => { if (activeSlug !== article.slug) e.currentTarget.style.background = 'transparent'; }}
                  >
                    {article.title}
                  </button>
                ))}
              </div>
            );
          })}
        </div>
      </aside>

      {/* Article viewer */}
      <main style={{ flex: 1, overflow: 'auto', padding: '40px 56px 80px' }}>
        {!currentArticle && (
          <div style={{ textAlign: 'center', padding: '80px 20px', color: C.textMuted }}>
            <BookOpen size={48} color={C.border} style={{ marginBottom: 12 }} />
            <div style={{ fontSize: 16, fontWeight: 600, color: C.text, marginBottom: 6 }}>Sélectionnez un article</div>
            <div style={{ fontSize: 13 }}>Choisissez un sujet dans la barre latérale.</div>
          </div>
        )}
        {currentArticle && (
          <div style={{ maxWidth: 760, margin: '0 auto' }}>
            {/* Breadcrumb */}
            <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 4, letterSpacing: .5 }}>
              <Home size={11} />
              <span>Centre d'aide</span>
              <ChevronRight size={10} />
              <span>{currentSection?.title}</span>
            </div>

            {/* Article body */}
            <div
              className="iz-help-content"
              dangerouslySetInnerHTML={{ __html: articleHtml }}
            />

            {/* Footer nav: prev/next */}
            <ArticleNav activeSlug={activeSlug!} onNavigate={setActiveSlug} />

            {/* Was this helpful */}
            <div style={{ marginTop: 60, padding: '20px 24px', background: '#FAFAFB', borderRadius: 12, textAlign: 'center', border: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 13, color: C.textMuted, marginBottom: 8 }}>Cet article vous a-t-il aidé ?</div>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                <button style={{ padding: '8px 18px', borderRadius: 8, border: `1px solid ${C.border}`, background: C.white, fontSize: 12, fontWeight: 600, color: C.text, cursor: 'pointer', fontFamily: font }}>👍 Oui</button>
                <button style={{ padding: '8px 18px', borderRadius: 8, border: `1px solid ${C.border}`, background: C.white, fontSize: 12, fontWeight: 600, color: C.text, cursor: 'pointer', fontFamily: font }}>👎 Non</button>
              </div>
              <div style={{ fontSize: 11, color: C.textMuted, marginTop: 12 }}>
                Une question ? Contactez-nous à <a href="mailto:contact@illizeo.com" style={{ color: C.pink }}>contact@illizeo.com</a>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Markdown styling */}
      <style>{`
        .iz-help-content { font-size: 15px; line-height: 1.7; color: ${C.text}; }
        .iz-help-content h1 { font-size: 32px; font-weight: 800; line-height: 1.2; margin: 0 0 8px; color: ${C.text}; letter-spacing: -0.5px; }
        .iz-help-content h2 { font-size: 22px; font-weight: 700; line-height: 1.3; margin: 36px 0 12px; color: ${C.text}; padding-top: 16px; border-top: 1px solid ${C.border}; }
        .iz-help-content h2:first-of-type { padding-top: 0; border-top: none; margin-top: 28px; }
        .iz-help-content h3 { font-size: 17px; font-weight: 700; line-height: 1.3; margin: 24px 0 8px; color: ${C.text}; }
        .iz-help-content p { margin: 0 0 14px; color: #444; }
        .iz-help-content a { color: ${C.pink}; text-decoration: none; border-bottom: 1px solid ${C.pink}40; transition: border-color .15s; }
        .iz-help-content a:hover { border-bottom-color: ${C.pink}; }
        .iz-help-content strong { font-weight: 700; color: ${C.text}; }
        .iz-help-content em { font-style: italic; }
        .iz-help-content ul, .iz-help-content ol { margin: 0 0 14px; padding-left: 24px; }
        .iz-help-content li { margin: 6px 0; }
        .iz-help-content code { background: ${C.bg}; padding: 2px 6px; border-radius: 4px; font-size: 13px; font-family: 'SF Mono', 'Consolas', monospace; color: ${C.pink}; }
        .iz-help-content pre { background: ${C.dark}; color: #e0e0e0; padding: 14px 18px; border-radius: 8px; overflow-x: auto; margin: 0 0 16px; font-size: 13px; line-height: 1.5; }
        .iz-help-content pre code { background: transparent; color: inherit; padding: 0; }
        .iz-help-content blockquote { border-left: 4px solid ${C.pink}; padding: 4px 16px; margin: 0 0 16px; background: ${C.pinkBg}; color: ${C.text}; border-radius: 0 8px 8px 0; }
        .iz-help-content blockquote p { margin: 8px 0; }
        .iz-help-content table { width: 100%; border-collapse: collapse; margin: 0 0 16px; font-size: 13px; }
        .iz-help-content th, .iz-help-content td { padding: 8px 12px; border: 1px solid ${C.border}; text-align: left; }
        .iz-help-content th { background: ${C.bg}; font-weight: 700; }
        .iz-help-content hr { border: none; border-top: 1px solid ${C.border}; margin: 32px 0; }
        .iz-help-content img { max-width: 100%; height: auto; border-radius: 8px; margin: 16px 0; }
      `}</style>
    </div>
  );
}

function ArticleNav({ activeSlug, onNavigate }: { activeSlug: string; onNavigate: (slug: string) => void }) {
  // Build a flat ordered list of articles
  const flat: DocArticle[] = DOCS_SECTIONS.flatMap((s) => s.articles);
  const idx = flat.findIndex((a) => a.slug === activeSlug);
  const prev = idx > 0 ? flat[idx - 1] : null;
  const next = idx >= 0 && idx < flat.length - 1 ? flat[idx + 1] : null;

  if (!prev && !next) return null;

  return (
    <div style={{ display: 'flex', gap: 12, marginTop: 48, paddingTop: 24, borderTop: `1px solid ${C.border}` }}>
      <div style={{ flex: 1 }}>
        {prev && (
          <button onClick={() => onNavigate(prev.slug)} style={{ ...sCard, padding: '14px 18px', textAlign: 'left', cursor: 'pointer', background: C.white, border: `1px solid ${C.border}`, width: '100%', fontFamily: font, transition: 'border-color .15s' }} onMouseEnter={(e) => (e.currentTarget.style.borderColor = C.pink)} onMouseLeave={(e) => (e.currentTarget.style.borderColor = C.border)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, color: C.textMuted, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>
              <ArrowLeft size={11} /> Précédent
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{prev.title}</div>
          </button>
        )}
      </div>
      <div style={{ flex: 1 }}>
        {next && (
          <button onClick={() => onNavigate(next.slug)} style={{ ...sCard, padding: '14px 18px', textAlign: 'right', cursor: 'pointer', background: C.white, border: `1px solid ${C.border}`, width: '100%', fontFamily: font, transition: 'border-color .15s' }} onMouseEnter={(e) => (e.currentTarget.style.borderColor = C.pink)} onMouseLeave={(e) => (e.currentTarget.style.borderColor = C.border)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, color: C.textMuted, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4, justifyContent: 'flex-end' }}>
              Suivant <ChevronRight size={11} />
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{next.title}</div>
          </button>
        )}
      </div>
    </div>
  );
}
