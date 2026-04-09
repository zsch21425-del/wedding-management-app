/* ══════════════════════════════════════════════════════════
 * 🖼️ Inspiration Board & Image Gallery
 * Upload/link images, tag, filter, overlay colors, lightbox, pin to dashboard
 * ══════════════════════════════════════════════════════════ */
import React, { useState, useRef } from 'react';
import { ImagePlus, Pin, PinOff, Trash2, X, Maximize2, Palette, Filter, Link } from 'lucide-react';
import { InspirationImage, InspirationTag, ColorScheme } from '../../types';

interface Props {
  images: InspirationImage[];
  onUpdateImages: (images: InspirationImage[]) => void;
  activeScheme: ColorScheme;
}

const ALL_TAGS: InspirationTag[] = ['Florals', 'Venue', 'Dress', 'Décor', 'Food', 'Cake', 'Hair', 'Invitations', 'Color Scheme'];

export default function InspirationBoard({ images, onUpdateImages, activeScheme }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [urlInput, setUrlInput] = useState('');
  const [filterTag, setFilterTag] = useState<InspirationTag | null>(null);
  const [lightboxId, setLightboxId] = useState<string | null>(null);
  const [overlayId, setOverlayId] = useState<string | null>(null);

  // ── Upload file(s) ──
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach(file => {
      const valid = ['image/jpeg', 'image/png', 'image/webp'];
      if (!valid.includes(file.type)) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const newImg: InspirationImage = {
          id: `img-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          src: ev.target?.result as string,
          name: file.name,
          tags: [],
          pinned: false,
          overlayColor: '',
          overlayIntensity: 0,
        };
        onUpdateImages([...images, newImg]);
      };
      reader.readAsDataURL(file);
    });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // ── Add by URL ──
  const handleUrlAdd = () => {
    if (!urlInput.trim()) return;
    const newImg: InspirationImage = {
      id: `img-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      src: urlInput.trim(),
      name: 'Linked image',
      tags: [],
      pinned: false,
      overlayColor: '',
      overlayIntensity: 0,
    };
    onUpdateImages([...images, newImg]);
    setUrlInput('');
  };

  // ── Update an image ──
  const updateImage = (id: string, patch: Partial<InspirationImage>) => {
    onUpdateImages(images.map(img => img.id === id ? { ...img, ...patch } : img));
  };

  // ── Delete image ──
  const deleteImage = (id: string) => {
    onUpdateImages(images.filter(img => img.id !== id));
    if (lightboxId === id) setLightboxId(null);
    if (overlayId === id) setOverlayId(null);
  };

  // ── Toggle tag on image ──
  const toggleTag = (id: string, tag: InspirationTag) => {
    const img = images.find(i => i.id === id);
    if (!img) return;
    const tags = img.tags.includes(tag) ? img.tags.filter(t => t !== tag) : [...img.tags, tag];
    updateImage(id, { tags });
  };

  // ── Filter images ──
  const filtered = filterTag ? images.filter(img => img.tags.includes(filterTag)) : images;

  // ── Get lightbox image ──
  const lightboxImg = lightboxId ? images.find(i => i.id === lightboxId) : null;
  // ── Get overlay tool image ──
  const overlayImg = overlayId ? images.find(i => i.id === overlayId) : null;

  return (
    <div className="animate-fade-in space-y-6">
      {/* ── Header ── */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
          <ImagePlus size={20} className="text-purple-500" />
        </div>
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900">Inspiration Board</h1>
          <p className="text-sm text-gray-500">{images.length} images · {images.filter(i => i.pinned).length} pinned</p>
        </div>
      </div>

      {/* ── Upload / Add ── */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-wrap gap-3">
          <label className="flex items-center gap-2 px-4 py-2.5 bg-purple-50 text-purple-600 text-sm font-medium rounded-xl hover:bg-purple-100 cursor-pointer transition-colors">
            <ImagePlus size={16} /> Upload Images
            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={handleFileUpload} className="hidden" />
          </label>
          <div className="flex items-center gap-2">
            <input type="text" value={urlInput} onChange={e => setUrlInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleUrlAdd()} placeholder="Paste image URL..." className="text-sm px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-200 w-64" />
            <button onClick={handleUrlAdd} className="flex items-center gap-1.5 px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-colors">
              <Link size={14} /> Add
            </button>
          </div>
        </div>
      </div>

      {/* ── Filter by Tag ── */}
      <div className="flex flex-wrap gap-2 items-center">
        <Filter size={16} className="text-gray-400" />
        <button onClick={() => setFilterTag(null)} className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${!filterTag ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>All</button>
        {ALL_TAGS.map(tag => (
          <button key={tag} onClick={() => setFilterTag(tag)} className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${filterTag === tag ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{tag}</button>
        ))}
      </div>

      {/* ── Image Gallery Grid ── */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <ImagePlus size={48} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">No inspiration images yet. Upload or link some to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(img => (
            <div key={img.id} className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden card-hover">
              {/* Image with overlay */}
              <div className="relative aspect-[4/3] overflow-hidden cursor-pointer" onClick={() => setLightboxId(img.id)}>
                <img src={img.src} alt={img.name} className="w-full h-full object-cover" />
                {/* Color overlay */}
                {img.overlayColor && img.overlayIntensity > 0 && (
                  <div className="absolute inset-0" style={{ background: img.overlayColor, opacity: img.overlayIntensity / 100, mixBlendMode: 'multiply' }} />
                )}
                {/* Hover actions */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <button onClick={e => { e.stopPropagation(); setLightboxId(img.id); }} className="p-2 bg-white/90 rounded-full"><Maximize2 size={16} /></button>
                  <button onClick={e => { e.stopPropagation(); setOverlayId(img.id); }} className="p-2 bg-white/90 rounded-full"><Palette size={16} /></button>
                </div>
                {/* Pinned badge */}
                {img.pinned && (
                  <div className="absolute top-2 left-2 px-2 py-0.5 bg-white/90 text-xs font-medium text-purple-600 rounded-full flex items-center gap-1">
                    <Pin size={10} /> Pinned
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div className="p-3 space-y-2">
                <p className="text-sm font-medium text-gray-700 truncate">{img.name}</p>
                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {ALL_TAGS.map(tag => (
                    <button key={tag} onClick={() => toggleTag(img.id, tag)} className={`text-[10px] px-2 py-0.5 rounded-full transition-colors ${img.tags.includes(tag) ? 'bg-purple-100 text-purple-700' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}>{tag}</button>
                  ))}
                </div>
                {/* Actions */}
                <div className="flex items-center gap-2 pt-1">
                  <button onClick={() => updateImage(img.id, { pinned: !img.pinned })} className={`flex items-center gap-1 text-xs px-2 py-1 rounded-lg transition-colors ${img.pinned ? 'bg-purple-100 text-purple-600' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}>
                    {img.pinned ? <><PinOff size={12} /> Unpin</> : <><Pin size={12} /> Pin</>}
                  </button>
                  <button onClick={() => deleteImage(img.id)} className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors">
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ══ Lightbox ══ */}
      {lightboxImg && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setLightboxId(null)}>
          <button className="absolute top-4 right-4 p-2 text-white/70 hover:text-white"><X size={24} /></button>
          <img src={lightboxImg.src} alt={lightboxImg.name} className="max-w-full max-h-[90vh] object-contain rounded-lg" onClick={e => e.stopPropagation()} />
        </div>
      )}

      {/* ══ Color Overlay Tool Modal ══ */}
      {overlayImg && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setOverlayId(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-semibold">Color Overlay Tool</h3>
              <button onClick={() => setOverlayId(null)} className="p-1 text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>

            {/* Preview */}
            <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100">
              <img src={overlayImg.src} alt={overlayImg.name} className="w-full h-full object-cover" />
              {overlayImg.overlayColor && overlayImg.overlayIntensity > 0 && (
                <div className="absolute inset-0" style={{ background: overlayImg.overlayColor, opacity: overlayImg.overlayIntensity / 100, mixBlendMode: 'multiply' }} />
              )}
            </div>

            {/* Color picker */}
            <div>
              <p className="text-xs text-gray-500 mb-2">Overlay Color — Quick picks from your palette:</p>
              <div className="flex gap-2 flex-wrap">
                {[activeScheme.primary, activeScheme.secondary, activeScheme.accent, activeScheme.extra].filter(Boolean).map((c, i) => (
                  <button key={i} onClick={() => updateImage(overlayImg.id, { overlayColor: c! })} className={`w-10 h-10 rounded-xl shadow-sm border-2 transition-all ${overlayImg.overlayColor === c ? 'border-gray-900 scale-110' : 'border-gray-200'}`} style={{ background: c }} />
                ))}
                <input type="color" value={overlayImg.overlayColor || '#000000'} onChange={e => updateImage(overlayImg.id, { overlayColor: e.target.value })} className="w-10 h-10 rounded-xl border border-gray-200 cursor-pointer" />
              </div>
            </div>

            {/* Intensity slider */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs text-gray-500">Overlay Intensity</p>
                <span className="text-xs text-gray-400">{overlayImg.overlayIntensity}%</span>
              </div>
              <input type="range" min={0} max={100} value={overlayImg.overlayIntensity} onChange={e => updateImage(overlayImg.id, { overlayIntensity: Number(e.target.value) })} className="w-full" />
            </div>

            {/* Clear overlay */}
            <button onClick={() => updateImage(overlayImg.id, { overlayColor: '', overlayIntensity: 0 })} className="text-xs text-gray-400 hover:text-gray-600 underline">Clear overlay</button>
          </div>
        </div>
      )}
    </div>
  );
}
