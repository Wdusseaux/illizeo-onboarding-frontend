import { useEffect, useRef, useState } from "react";
import { Upload, Trash, Check, X, Image as ImageIcon } from "lucide-react";
import { ILLIZEO_FULL_LOGO_URI } from "../constants";
import { updateCompanySettings } from "../api/endpoints";

const FRAME_W = 600;
const FRAME_H = 150;
const PREVIEW_SCALE = 1.5;
const PREVIEW_W = FRAME_W / PREVIEW_SCALE;
const PREVIEW_H = FRAME_H / PREVIEW_SCALE;

type Props = {
  customLogoFull: string;
  setCustomLogoFull: (v: string) => void;
  themeColor: string;
  addToast: (msg: string, kind?: "success" | "error" | "info") => void;
  C: any;
  sBtn: (variant?: "pink" | "dark" | "outline") => any;
};

export default function LogoUploadCard({ customLogoFull, setCustomLogoFull, themeColor, addToast, C, sBtn }: Props) {
  const [rawImage, setRawImage] = useState<string>("");
  const [zoom, setZoom] = useState(100);
  const [posX, setPosX] = useState(50);
  const [posY, setPosY] = useState(50);
  const [imgSize, setImgSize] = useState<{ w: number; h: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!rawImage) { setImgSize(null); return; }
    const img = new Image();
    img.onload = () => setImgSize({ w: img.naturalWidth, h: img.naturalHeight });
    img.src = rawImage;
  }, [rawImage]);

  const handleFile = (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      addToast("Image trop volumineuse (max 5 Mo)", "error");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setRawImage(String(ev.target?.result || ""));
      setZoom(100);
      setPosX(50);
      setPosY(50);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!rawImage || !imgSize) return;
    const img = new Image();
    img.onload = async () => {
      const canvas = document.createElement("canvas");
      canvas.width = FRAME_W;
      canvas.height = FRAME_H;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, FRAME_W, FRAME_H);
      const baseScale = Math.min(FRAME_W / img.width, FRAME_H / img.height);
      const scale = baseScale * (zoom / 100);
      const drawW = img.width * scale;
      const drawH = img.height * scale;
      const playX = drawW - FRAME_W;
      const playY = drawH - FRAME_H;
      const dx = -playX * (posX / 100);
      const dy = -playY * (posY / 100);
      ctx.drawImage(img, dx, dy, drawW, drawH);
      const dataUrl = canvas.toDataURL("image/png");
      setCustomLogoFull(dataUrl);
      localStorage.setItem("illizeo_custom_logo_full", dataUrl);
      try {
        await updateCompanySettings({ custom_logo_full: dataUrl });
        addToast("Logo enregistré", "success");
      } catch {
        addToast("Échec de l'enregistrement", "error");
      }
      setRawImage("");
    };
    img.src = rawImage;
  };

  const handleRemove = async () => {
    setCustomLogoFull("");
    localStorage.removeItem("illizeo_custom_logo_full");
    try {
      await updateCompanySettings({ custom_logo_full: "" });
      addToast("Logo supprimé", "success");
    } catch {
      addToast("Erreur lors de la suppression", "error");
    }
  };

  const renderLivePreview = () => {
    if (!imgSize) return null;
    const baseScale = Math.min(PREVIEW_W / imgSize.w, PREVIEW_H / imgSize.h);
    const scale = baseScale * (zoom / 100);
    const drawW = imgSize.w * scale;
    const drawH = imgSize.h * scale;
    const playX = drawW - PREVIEW_W;
    const playY = drawH - PREVIEW_H;
    const dx = -playX * (posX / 100);
    const dy = -playY * (posY / 100);
    return (
      <img src={rawImage} alt="Logo" draggable={false} style={{
        position: "absolute",
        left: dx,
        top: dy,
        width: drawW,
        height: drawH,
        maxWidth: "none",
        maxHeight: "none",
        userSelect: "none",
        pointerEvents: "none",
      }} />
    );
  };

  return (
    <div style={{ marginBottom: 32 }}>
      <h2 style={{ fontSize: 16, fontWeight: 600, color: C.text, margin: "0 0 4px", display: "flex", alignItems: "center", gap: 8 }}>
        <ImageIcon size={18} color={themeColor} /> Logo de votre entreprise
      </h2>
      <p style={{ fontSize: 12, color: C.textMuted, margin: "0 0 16px", lineHeight: 1.5 }}>
        Logo affiché dans les emails envoyés à vos collaborateurs (notifications, rappels, invitations…).
        Format conseillé : horizontal, fond transparent, ratio 4:1. Si aucun logo n'est défini, le logo Illizeo est utilisé par défaut.
      </p>

      <div style={{ display: "flex", gap: 24, flexWrap: "wrap", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 6, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>Aperçu (taille email)</div>
          <div style={{
            width: PREVIEW_W,
            height: PREVIEW_H,
            border: `2px dashed ${rawImage ? themeColor : C.border}`,
            borderRadius: 12,
            background: "#ffffff",
            position: "relative",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundImage: rawImage ? "none" : "linear-gradient(45deg, #f5f5f5 25%, transparent 25%), linear-gradient(-45deg, #f5f5f5 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f5f5f5 75%), linear-gradient(-45deg, transparent 75%, #f5f5f5 75%)",
            backgroundSize: rawImage ? undefined : "16px 16px",
            backgroundPosition: rawImage ? undefined : "0 0, 0 8px, 8px -8px, -8px 0px",
          }}>
            {rawImage ? (
              renderLivePreview()
            ) : customLogoFull ? (
              <img src={customLogoFull} alt="Logo" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
            ) : (
              <img src={ILLIZEO_FULL_LOGO_URI} alt="Logo Illizeo (par défaut)" style={{ maxWidth: "60%", maxHeight: "60%", objectFit: "contain", opacity: 0.35 }} />
            )}
          </div>
          <div style={{ fontSize: 10, color: C.textMuted, marginTop: 6, textAlign: "center" }}>
            Cadre cible {FRAME_W} × {FRAME_H} px
          </div>
        </div>

        <div style={{ flex: 1, minWidth: 240 }}>
          {!rawImage ? (
            <>
              <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/svg+xml,image/webp" style={{ display: "none" }} onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }} />
              <button onClick={() => fileInputRef.current?.click()} style={{ ...sBtn("pink"), display: "flex", alignItems: "center", gap: 8 }}>
                <Upload size={16} /> {customLogoFull ? "Remplacer le logo" : "Importer un logo"}
              </button>
              {customLogoFull && (
                <button onClick={handleRemove} style={{ ...sBtn("outline"), marginTop: 10, display: "flex", alignItems: "center", gap: 8, color: C.red, borderColor: C.red }}>
                  <Trash size={14} /> Supprimer
                </button>
              )}
              <p style={{ fontSize: 11, color: C.textMuted, marginTop: 14, lineHeight: 1.5 }}>
                PNG, JPG, SVG ou WebP, max 5 Mo. L'image sera redimensionnée et centrée pour s'adapter au cadre.
              </p>
            </>
          ) : (
            <>
              <div style={{ marginBottom: 10 }}>
                <label style={{ fontSize: 11, fontWeight: 600, color: C.textLight, display: "flex", justifyContent: "space-between" }}>
                  <span>Zoom</span><span style={{ color: C.textMuted }}>{zoom}%</span>
                </label>
                <input type="range" min={50} max={300} value={zoom} onChange={e => setZoom(Number(e.target.value))} style={{ width: "100%", accentColor: themeColor }} />
              </div>
              <div style={{ marginBottom: 10 }}>
                <label style={{ fontSize: 11, fontWeight: 600, color: C.textLight, display: "flex", justifyContent: "space-between" }}>
                  <span>Position horizontale</span><span style={{ color: C.textMuted }}>{posX}%</span>
                </label>
                <input type="range" min={0} max={100} value={posX} onChange={e => setPosX(Number(e.target.value))} style={{ width: "100%", accentColor: themeColor }} />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 11, fontWeight: 600, color: C.textLight, display: "flex", justifyContent: "space-between" }}>
                  <span>Position verticale</span><span style={{ color: C.textMuted }}>{posY}%</span>
                </label>
                <input type="range" min={0} max={100} value={posY} onChange={e => setPosY(Number(e.target.value))} style={{ width: "100%", accentColor: themeColor }} />
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={handleSave} style={{ ...sBtn("pink"), display: "flex", alignItems: "center", gap: 6 }}>
                  <Check size={14} /> Enregistrer
                </button>
                <button onClick={() => setRawImage("")} style={{ ...sBtn("outline"), display: "flex", alignItems: "center", gap: 6 }}>
                  <X size={14} /> Annuler
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
