import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Color from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import Placeholder from '@tiptap/extension-placeholder';
import { useEffect, useState } from 'react';

const C = {
  pink: "#C2185B",
  text: "#333",
  textMuted: "#aaa",
  textLight: "#888",
  border: "#E8E8EE",
  bg: "#F5F5FA",
  white: "#fff",
  pinkBg: "#FFF0F5",
};

const font = `'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif`;

const VARIABLES = [
  "{{prenom}}", "{{nom}}", "{{email}}", "{{date_debut}}", "{{site}}",
  "{{poste}}", "{{departement}}", "{{parcours_nom}}", "{{manager}}",
  "{{nb_docs_manquants}}", "{{date_limite}}", "{{lien}}",
  "{{action_nom}}", "{{document_nom}}", "{{collab_nom}}",
  "{{montant}}", "{{annees}}", "{{date_depart}}", "{{date_fin_essai}}",
  "{{candidat_nom}}", "{{adresse}}", "{{formulaire_nom}}",
];

interface RichEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export default function RichEditor({ value, onChange, placeholder }: RichEditorProps) {
  const [showHtml, setShowHtml] = useState(false);
  const [htmlSource, setHtmlSource] = useState(value);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ link: false }),
      Underline,
      TextStyle,
      Color,
      Link.configure({ openOnClick: false, HTMLAttributes: { style: 'color: #C2185B; text-decoration: underline;' } }),
      Image.configure({ inline: true }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({ placeholder: placeholder || 'Rédigez votre email...' }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
      setHtmlSource(html);
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '');
      setHtmlSource(value);
    }
  }, [value]);

  if (!editor) return null;

  const btn = (active: boolean, onClick: () => void, children: React.ReactNode, title?: string) => (
    <button type="button" title={title} onClick={onClick} style={{
      padding: "4px 8px", borderRadius: 4, border: "none", cursor: "pointer",
      background: active ? C.pinkBg : "transparent", color: active ? C.pink : C.text,
      fontWeight: active ? 700 : 400, fontSize: 13, fontFamily: font, display: "flex", alignItems: "center",
      transition: "all .1s",
    }}>{children}</button>
  );

  const sep = () => <div style={{ width: 1, height: 20, background: C.border, margin: "0 2px" }} />;

  return (
    <div style={{ border: `1px solid ${C.border}`, borderRadius: 8, overflow: "hidden" }}>
      {/* Toolbar */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 2, padding: "6px 8px", borderBottom: `1px solid ${C.border}`, background: C.bg, alignItems: "center" }}>
        {btn(editor.isActive('bold'), () => editor.chain().focus().toggleBold().run(), <b>B</b>, "Gras")}
        {btn(editor.isActive('italic'), () => editor.chain().focus().toggleItalic().run(), <i>I</i>, "Italique")}
        {btn(editor.isActive('underline'), () => editor.chain().focus().toggleUnderline().run(), <u>U</u>, "Souligné")}
        {btn(editor.isActive('strike'), () => editor.chain().focus().toggleStrike().run(), <s>S</s>, "Barré")}
        {sep()}
        {btn(editor.isActive('heading', { level: 1 }), () => editor.chain().focus().toggleHeading({ level: 1 }).run(), "H1", "Titre 1")}
        {btn(editor.isActive('heading', { level: 2 }), () => editor.chain().focus().toggleHeading({ level: 2 }).run(), "H2", "Titre 2")}
        {btn(editor.isActive('heading', { level: 3 }), () => editor.chain().focus().toggleHeading({ level: 3 }).run(), "H3", "Titre 3")}
        {sep()}
        {btn(editor.isActive('bulletList'), () => editor.chain().focus().toggleBulletList().run(), "• —", "Liste à puces")}
        {btn(editor.isActive('orderedList'), () => editor.chain().focus().toggleOrderedList().run(), "1.", "Liste numérotée")}
        {sep()}
        {btn(editor.isActive({ textAlign: 'left' }), () => editor.chain().focus().setTextAlign('left').run(), "⫷", "Aligner à gauche")}
        {btn(editor.isActive({ textAlign: 'center' }), () => editor.chain().focus().setTextAlign('center').run(), "⫸⫷", "Centrer")}
        {btn(editor.isActive({ textAlign: 'right' }), () => editor.chain().focus().setTextAlign('right').run(), "⫸", "Aligner à droite")}
        {sep()}
        {btn(false, () => {
          const url = prompt("URL du lien :");
          if (url) editor.chain().focus().setLink({ href: url }).run();
        }, "🔗", "Insérer un lien")}
        {btn(false, () => {
          const url = prompt("URL de l'image :");
          if (url) editor.chain().focus().setImage({ src: url }).run();
        }, "🖼", "Insérer une image")}
        {btn(false, () => editor.chain().focus().setHorizontalRule().run(), "—", "Séparateur")}
        {sep()}
        {/* CTA Button */}
        {btn(false, () => {
          const text = prompt("Texte du bouton :", "Accéder à Illizeo");
          const url = prompt("URL du bouton :", "{{lien}}");
          if (text && url) {
            editor.chain().focus().insertContent(
              `<a href="${url}" style="display:inline-block;padding:10px 28px;background:#C2185B;color:#fff;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">${text}</a>`
            ).run();
          }
        }, "⬛ Bouton", "Insérer un bouton CTA")}
        {sep()}
        {/* HTML toggle */}
        {btn(showHtml, () => {
          if (showHtml) {
            editor.commands.setContent(htmlSource);
            onChange(htmlSource);
          }
          setShowHtml(!showHtml);
        }, showHtml ? "Visuel" : "</>", showHtml ? "Mode visuel" : "Mode HTML")}
      </div>

      {/* Variables bar */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 3, padding: "6px 8px", borderBottom: `1px solid ${C.border}`, background: C.white }}>
        <span style={{ fontSize: 10, color: C.textMuted, lineHeight: "22px", marginRight: 4 }}>Variables :</span>
        {VARIABLES.map(v => (
          <button key={v} type="button" onClick={() => {
            if (showHtml) {
              setHtmlSource(prev => prev + v);
            } else {
              editor.chain().focus().insertContent(v).run();
            }
          }} style={{
            padding: "2px 6px", borderRadius: 3, fontSize: 9, background: C.pinkBg, color: C.pink,
            border: "none", cursor: "pointer", fontFamily: "monospace", fontWeight: 500,
          }}>{v}</button>
        ))}
      </div>

      {/* Editor / HTML source */}
      {showHtml ? (
        <textarea
          value={htmlSource}
          onChange={e => setHtmlSource(e.target.value)}
          style={{
            width: "100%", minHeight: 250, padding: "12px", border: "none", outline: "none",
            fontFamily: "monospace", fontSize: 12, lineHeight: 1.6, color: C.text, resize: "vertical",
            background: "#1a1a2e", color: "#e0e0e0",
          }}
        />
      ) : (
        <div style={{ padding: "12px", minHeight: 250 }}>
          <EditorContent editor={editor} />
        </div>
      )}

      <style>{`
        .tiptap { outline: none; font-family: ${font}; font-size: 14px; line-height: 1.7; color: ${C.text}; }
        .tiptap p { margin: 0 0 8px; }
        .tiptap h1 { font-size: 22px; font-weight: 700; margin: 16px 0 8px; }
        .tiptap h2 { font-size: 18px; font-weight: 600; margin: 14px 0 6px; }
        .tiptap h3 { font-size: 15px; font-weight: 600; margin: 12px 0 4px; }
        .tiptap ul, .tiptap ol { padding-left: 20px; margin: 8px 0; }
        .tiptap a { color: ${C.pink}; text-decoration: underline; }
        .tiptap img { max-width: 100%; border-radius: 8px; margin: 8px 0; }
        .tiptap hr { border: none; border-top: 1px solid ${C.border}; margin: 16px 0; }
        .tiptap .is-editor-empty:first-child::before { content: attr(data-placeholder); color: ${C.textMuted}; float: left; height: 0; pointer-events: none; }
        .tiptap blockquote { border-left: 3px solid ${C.pink}; padding-left: 12px; color: ${C.textLight}; margin: 8px 0; }
      `}</style>
    </div>
  );
}
