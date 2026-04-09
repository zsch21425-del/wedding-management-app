/* ══════════════════════════════════════════════════════════
 * 🎨 Color Scheme Visualizer — The showcase feature
 * High-end design tool with live mockup previews, preset palettes,
 * save/switch schemes, and vendor-sharing export.
 * ══════════════════════════════════════════════════════════ */
import React, { useState, useCallback } from 'react';
import { Palette, Copy, Check, Download, Plus, Trash2, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { ColorScheme } from '../../types';
import { colorPresets } from '../../data/presets';

interface Props {
  activeScheme: ColorScheme;
  savedSchemes: ColorScheme[];
  onSetActive: (scheme: ColorScheme) => void;
  onSaveScheme: (scheme: ColorScheme) => void;
  onDeleteScheme: (id: string) => void;
}

/* ── Utility: determine readable text color for a background ── */
function contrastText(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? '#1a1a1a' : '#ffffff';
}

/* ── Utility: lighten a hex color ── */
function lighten(hex: string, amount: number): string {
  const r = Math.min(255, parseInt(hex.slice(1, 3), 16) + amount);
  const g = Math.min(255, parseInt(hex.slice(3, 5), 16) + amount);
  const b = Math.min(255, parseInt(hex.slice(5, 7), 16) + amount);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

export default function ColorSchemeVisualizer({ activeScheme, savedSchemes, onSetActive, onSaveScheme, onDeleteScheme }: Props) {
  const [editScheme, setEditScheme] = useState<ColorScheme>({ ...activeScheme });
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [showPresets, setShowPresets] = useState(true);
  const [showExportPreview, setShowExportPreview] = useState(false);

  // Sync edit scheme when active changes externally
  React.useEffect(() => {
    setEditScheme({ ...activeScheme });
  }, [activeScheme]);

  // Copy hex to clipboard
  const copyHex = useCallback((hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1500);
  }, []);

  // Apply current edits as active scheme
  const applyScheme = () => {
    onSetActive({ ...editScheme });
  };

  // Save current as new named scheme
  const saveAsNew = () => {
    if (!newName.trim()) return;
    const scheme: ColorScheme = {
      ...editScheme,
      id: `custom-${Date.now()}`,
      name: newName.trim(),
      isPreset: false,
    };
    onSaveScheme(scheme);
    setNewName('');
  };

  // Generate vendor export HTML
  const generateExportHTML = () => {
    const s = editScheme;
    return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>${s.name} — Wedding Color Palette</title>
<style>
  body{font-family:'Segoe UI',system-ui,sans-serif;display:flex;justify-content:center;align-items:center;min-height:100vh;background:#fafafa;margin:0}
  .card{background:#fff;border-radius:16px;box-shadow:0 4px 24px rgba(0,0,0,.08);padding:48px;max-width:480px;width:100%;text-align:center}
  h1{font-family:Georgia,serif;font-size:28px;color:#333;margin-bottom:8px}
  .sub{color:#888;margin-bottom:32px;font-size:14px}
  .swatches{display:flex;gap:12px;justify-content:center;margin-bottom:24px}
  .swatch{width:80px;height:80px;border-radius:12px;display:flex;align-items:flex-end;justify-content:center;padding-bottom:8px;font-size:11px;font-weight:600;letter-spacing:.5px;box-shadow:0 2px 8px rgba(0,0,0,.1)}
  .labels{display:flex;gap:12px;justify-content:center;font-size:12px;color:#666}
  .labels span{width:80px;text-align:center}
</style></head><body>
<div class="card">
  <h1>${s.name}</h1>
  <p class="sub">Wedding Color Palette</p>
  <div class="swatches">
    <div class="swatch" style="background:${s.primary};color:${contrastText(s.primary)}">${s.primary}</div>
    <div class="swatch" style="background:${s.secondary};color:${contrastText(s.secondary)}">${s.secondary}</div>
    <div class="swatch" style="background:${s.accent};color:${contrastText(s.accent)}">${s.accent}</div>
    ${s.extra ? `<div class="swatch" style="background:${s.extra};color:${contrastText(s.extra)}">${s.extra}</div>` : ''}
  </div>
  <div class="labels">
    <span>Primary</span><span>Secondary</span><span>Accent</span>${s.extra ? '<span>Extra</span>' : ''}
  </div>
</div></body></html>`;
  };

  const exportPalette = () => {
    const html = generateExportHTML();
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${editScheme.name.replace(/\s+/g, '-').toLowerCase()}-palette.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const { primary, secondary, accent, extra } = editScheme;

  return (
    <div className="animate-fade-in space-y-8">
      {/* ── Header ── */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center color-transition" style={{ background: primary }}>
          <Palette size={20} color={contrastText(primary)} />
        </div>
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900">Color Scheme Visualizer</h1>
          <p className="text-sm text-gray-500">Design your wedding palette with live previews</p>
        </div>
      </div>

      {/* ── Color Pickers ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-serif font-semibold mb-4">Edit Palette</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Primary', key: 'primary' as const, val: primary },
            { label: 'Secondary', key: 'secondary' as const, val: secondary },
            { label: 'Accent', key: 'accent' as const, val: accent },
            { label: 'Extra', key: 'extra' as const, val: extra || '#FFFFFF' },
          ].map(({ label, key, val }) => (
            <div key={key} className="space-y-2">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={val}
                  onChange={(e) => setEditScheme(prev => ({ ...prev, [key]: e.target.value }))}
                  className="w-10 h-10 rounded-lg border-2 border-gray-200 cursor-pointer"
                  style={{ padding: 0 }}
                />
                <input
                  type="text"
                  value={val.toUpperCase()}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (/^#[0-9A-Fa-f]{0,6}$/.test(v)) {
                      setEditScheme(prev => ({ ...prev, [key]: v }));
                    }
                  }}
                  className="flex-1 text-sm font-mono px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/30"
                  placeholder="#000000"
                />
                <button onClick={() => copyHex(val)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Copy hex">
                  {copiedHex === val ? <Check size={14} className="text-green-500" /> : <Copy size={14} className="text-gray-400" />}
                </button>
              </div>
              {/* Live swatch */}
              <div className="h-8 rounded-lg color-transition shadow-inner" style={{ background: val }} />
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 mt-5">
          <button onClick={applyScheme} className="px-5 py-2.5 text-sm font-medium rounded-xl text-white shadow-md hover:shadow-lg transition-all color-transition" style={{ background: primary }}>
            Apply Palette
          </button>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Scheme name..."
              className="text-sm px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold/30"
            />
            <button onClick={saveAsNew} disabled={!newName.trim() || savedSchemes.length >= 6} className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium bg-gray-900 text-white rounded-xl hover:bg-gray-800 disabled:opacity-40 transition-colors">
              <Plus size={14} /> Save
            </button>
          </div>
        </div>
        {savedSchemes.length >= 6 && <p className="text-xs text-amber-600 mt-2">Maximum 6 saved schemes reached. Delete one to save a new one.</p>}
      </div>

      {/* ── Saved Schemes ── */}
      {savedSchemes.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-serif font-semibold mb-4">Saved Schemes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {savedSchemes.map((s) => (
              <button
                key={s.id}
                onClick={() => onSetActive(s)}
                className={`relative group p-4 rounded-xl border-2 transition-all text-left ${activeScheme.id === s.id ? 'border-gray-900 shadow-md' : 'border-gray-100 hover:border-gray-300'}`}
              >
                <div className="flex gap-1.5 mb-2">
                  {[s.primary, s.secondary, s.accent, s.extra].filter(Boolean).map((c, i) => (
                    <div key={i} className="w-8 h-8 rounded-full color-transition shadow-sm" style={{ background: c }} />
                  ))}
                </div>
                <p className="text-sm font-medium text-gray-800">{s.name}</p>
                {activeScheme.id === s.id && <span className="absolute top-2 right-2 text-xs bg-gray-900 text-white px-2 py-0.5 rounded-full">Active</span>}
                {!s.isPreset && (
                  <button
                    onClick={(e) => { e.stopPropagation(); onDeleteScheme(s.id); }}
                    className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 p-1.5 bg-red-50 text-red-400 rounded-lg hover:bg-red-100 transition-all"
                  >
                    <Trash2 size={12} />
                  </button>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Preset Palettes ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <button onClick={() => setShowPresets(!showPresets)} className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-gold" />
            <h2 className="text-lg font-serif font-semibold">2026 Trending Palettes</h2>
          </div>
          {showPresets ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        {showPresets && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
            {colorPresets.map((preset) => (
              <button
                key={preset.id}
                onClick={() => { onSetActive(preset); setEditScheme({ ...preset }); }}
                className={`p-4 rounded-xl border-2 transition-all text-left card-hover ${activeScheme.id === preset.id ? 'border-gray-900 shadow-md' : 'border-gray-100 hover:border-gray-300'}`}
              >
                <div className="flex gap-1 mb-2">
                  {[preset.primary, preset.secondary, preset.accent, preset.extra].filter(Boolean).map((c, i) => (
                    <div key={i} className="flex-1 h-10 first:rounded-l-lg last:rounded-r-lg color-transition" style={{ background: c }} />
                  ))}
                </div>
                <p className="text-xs font-medium text-gray-700">{preset.name}</p>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════
       * LIVE MOCKUP PREVIEWS — update in real-time as colors change
       * ══════════════════════════════════════════════════════════ */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-serif font-semibold mb-6">Live Mockup Previews</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* ── 1. Invitation Card ── */}
          <div className="rounded-xl overflow-hidden shadow-lg color-transition" style={{ background: extra || '#FFFFF0' }}>
            <div className="p-8 text-center space-y-3" style={{ borderTop: `4px solid ${accent}` }}>
              <p className="text-xs uppercase tracking-[4px] font-medium color-transition" style={{ color: secondary }}>Together with their families</p>
              <h3 className="text-3xl font-serif font-bold color-transition" style={{ color: primary }}>Sarah & James</h3>
              <div className="w-16 h-0.5 mx-auto color-transition" style={{ background: accent }} />
              <p className="text-sm color-transition" style={{ color: secondary }}>request the pleasure of your company<br />at their wedding celebration</p>
              <p className="text-lg font-serif font-semibold color-transition" style={{ color: primary }}>October 17, 2026</p>
              <p className="text-xs color-transition" style={{ color: secondary }}>Rosewood Estate · Napa Valley, CA</p>
              <div className="flex justify-center gap-2 pt-2">
                {[primary, secondary, accent].map((c, i) => (
                  <div key={i} className="w-3 h-3 rounded-full color-transition" style={{ background: c }} />
                ))}
              </div>
            </div>
          </div>

          {/* ── 2. Table Centerpiece Swatch Card ── */}
          <div className="rounded-xl overflow-hidden shadow-lg bg-white p-6 text-center space-y-4">
            <p className="text-xs uppercase tracking-[3px] text-gray-400 font-medium">Table Centerpiece</p>
            <div className="flex justify-center gap-3">
              {[primary, secondary, accent, extra || '#F5F5F5'].map((c, i) => (
                <div key={i} className="text-center">
                  <div className="w-16 h-16 rounded-xl shadow-md color-transition" style={{ background: c }} />
                  <p className="text-[10px] font-mono mt-1.5 text-gray-400">{c?.toUpperCase()}</p>
                </div>
              ))}
            </div>
            <div className="h-20 rounded-xl color-transition relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${primary}22, ${secondary}22, ${accent}22)` }}>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-16 rounded-full color-transition" style={{ background: primary, opacity: 0.3 }} />
                <div className="w-10 h-14 rounded-full color-transition -ml-3" style={{ background: secondary, opacity: 0.3 }} />
                <div className="w-8 h-12 rounded-full color-transition -ml-3" style={{ background: accent, opacity: 0.3 }} />
              </div>
            </div>
          </div>

          {/* ── 3. Bridesmaid Dress Silhouettes ── */}
          <div className="rounded-xl overflow-hidden shadow-lg bg-white p-6">
            <p className="text-xs uppercase tracking-[3px] text-gray-400 font-medium text-center mb-4">Bridesmaid Dresses</p>
            <div className="flex justify-center gap-6">
              {[primary, secondary, accent].map((c, i) => (
                <div key={i} className="text-center">
                  {/* SVG dress silhouette */}
                  <svg viewBox="0 0 60 100" className="w-16 h-24 mx-auto">
                    <ellipse cx="30" cy="12" rx="8" ry="10" fill={lighten(c, 40)} className="color-transition" />
                    <path d={`M22 20 Q20 35 16 55 Q14 65 10 80 L50 80 Q46 65 44 55 Q40 35 38 20 Z`} fill={c} className="color-transition" />
                    <path d={`M10 80 Q8 88 8 95 L52 95 Q52 88 50 80 Z`} fill={lighten(c, -15)} className="color-transition" />
                  </svg>
                  <p className="text-[10px] font-mono mt-2 text-gray-400">{c.toUpperCase()}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── 4. Groomsmen Tie & Boutonniere ── */}
          <div className="rounded-xl overflow-hidden shadow-lg bg-white p-6">
            <p className="text-xs uppercase tracking-[3px] text-gray-400 font-medium text-center mb-4">Groomsmen Accents</p>
            <div className="flex justify-center gap-8">
              {[primary, secondary, accent].map((c, i) => (
                <div key={i} className="text-center">
                  {/* Tie */}
                  <svg viewBox="0 0 40 80" className="w-10 h-20 mx-auto">
                    <polygon points="15,0 25,0 22,10 18,10" fill={c} className="color-transition" />
                    <polygon points="18,10 22,10 26,45 20,55 14,45" fill={c} className="color-transition" />
                    <line x1="20" y1="12" x2="20" y2="50" stroke={lighten(c, 30)} strokeWidth="0.5" opacity="0.5" />
                  </svg>
                  {/* Small boutonniere dot */}
                  <div className="w-5 h-5 rounded-full mx-auto mt-2 shadow-sm color-transition" style={{ background: c, border: `2px solid ${lighten(c, 40)}` }} />
                  <p className="text-[10px] font-mono mt-1 text-gray-400">{c.toUpperCase()}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── 5. Floral Arrangement Color Card ── */}
          <div className="rounded-xl overflow-hidden shadow-lg p-6 color-transition" style={{ background: `linear-gradient(160deg, ${primary}15, ${extra || secondary}15)` }}>
            <p className="text-xs uppercase tracking-[3px] text-gray-400 font-medium text-center mb-4">Floral Arrangement</p>
            <div className="flex justify-center items-end gap-2">
              {[
                { c: primary, size: 'w-12 h-12' },
                { c: accent, size: 'w-10 h-10' },
                { c: secondary, size: 'w-14 h-14' },
                { c: extra || lighten(primary, 40), size: 'w-9 h-9' },
                { c: lighten(accent, 20), size: 'w-11 h-11' },
              ].map(({ c, size }, i) => (
                <div key={i} className={`${size} rounded-full color-transition shadow-md`} style={{ background: c }} />
              ))}
            </div>
            <div className="flex justify-center gap-1 mt-3">
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="w-1 rounded-full color-transition" style={{ height: 20 + Math.random() * 15, background: '#7D9B76' + '88' }} />
              ))}
            </div>
          </div>

          {/* ── 6. Wedding Cake 3-Tier ── */}
          <div className="rounded-xl overflow-hidden shadow-lg bg-white p-6 text-center">
            <p className="text-xs uppercase tracking-[3px] text-gray-400 font-medium mb-4">Wedding Cake</p>
            <div className="flex flex-col items-center gap-0">
              {/* Topper */}
              <div className="w-4 h-6 color-transition" style={{ background: accent, borderRadius: '50% 50% 0 0' }} />
              {/* Tier 1 — small */}
              <div className="w-20 h-14 rounded-lg color-transition shadow-md relative" style={{ background: extra || lighten(primary, 50) }}>
                <div className="absolute bottom-0 left-0 right-0 h-2 rounded-b-lg color-transition" style={{ background: accent }} />
              </div>
              {/* Tier 2 — medium */}
              <div className="w-28 h-16 rounded-lg color-transition shadow-md relative -mt-0.5" style={{ background: secondary }}>
                <div className="absolute bottom-0 left-0 right-0 h-2 rounded-b-lg color-transition" style={{ background: accent }} />
                <div className="absolute top-3 left-3 right-3 flex justify-center gap-2">
                  {[primary, accent, primary].map((c, i) => (
                    <div key={i} className="w-2.5 h-2.5 rounded-full color-transition" style={{ background: c }} />
                  ))}
                </div>
              </div>
              {/* Tier 3 — large */}
              <div className="w-36 h-20 rounded-lg color-transition shadow-md relative -mt-0.5" style={{ background: primary }}>
                <div className="absolute bottom-0 left-0 right-0 h-3 rounded-b-lg color-transition" style={{ background: accent }} />
                <div className="absolute top-4 left-4 right-4 flex justify-center gap-3">
                  {[secondary, extra || accent, secondary, accent].map((c, i) => (
                    <div key={i} className="w-3 h-3 rounded-full color-transition" style={{ background: c }} />
                  ))}
                </div>
              </div>
              {/* Base plate */}
              <div className="w-40 h-3 bg-gray-100 rounded-b-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* ── Copyable Palette Card ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-serif font-semibold">Vendor Palette Card</h2>
          <button onClick={exportPalette} className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors">
            <Download size={14} /> Share with Vendor
          </button>
        </div>
        <div className="flex flex-wrap gap-4 mb-4">
          {[
            { label: 'Primary', hex: primary },
            { label: 'Secondary', hex: secondary },
            { label: 'Accent', hex: accent },
            ...(extra ? [{ label: 'Extra', hex: extra }] : []),
          ].map(({ label, hex }) => (
            <button key={label} onClick={() => copyHex(hex)} className="group flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div className="w-10 h-10 rounded-lg shadow-sm color-transition" style={{ background: hex }} />
              <div className="text-left">
                <p className="text-xs text-gray-400">{label}</p>
                <p className="text-sm font-mono font-medium text-gray-700">{hex.toUpperCase()}</p>
              </div>
              {copiedHex === hex ? <Check size={14} className="text-green-500" /> : <Copy size={14} className="text-gray-300 group-hover:text-gray-500" />}
            </button>
          ))}
        </div>
        <button onClick={() => setShowExportPreview(!showExportPreview)} className="text-xs text-gray-400 hover:text-gray-600 underline">
          {showExportPreview ? 'Hide' : 'Preview'} export card
        </button>
        {showExportPreview && (
          <div className="mt-3 p-4 bg-gray-50 rounded-xl">
            <div className="text-center space-y-2">
              <h3 className="font-serif text-xl font-bold" style={{ color: primary }}>{editScheme.name}</h3>
              <p className="text-xs text-gray-400">Wedding Color Palette</p>
              <div className="flex justify-center gap-2">
                {[primary, secondary, accent, extra].filter(Boolean).map((c, i) => (
                  <div key={i} className="w-14 h-14 rounded-lg shadow-md color-transition" style={{ background: c }}>
                    <span className="text-[8px] font-mono flex items-end justify-center h-full pb-1" style={{ color: contrastText(c!) }}>{c?.toUpperCase()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
