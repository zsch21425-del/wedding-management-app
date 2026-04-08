/* ═══════════════════════════════════════════════════════
 * ⚙️ Settings — Wedding date, names, budget, data backup/restore
 * ═══════════════════════════════════════════════════════ */
import React, { useState, useRef } from 'react';
import { Settings as SettingsIcon, Calendar, Heart, DollarSign, Download, Upload, Trash2, AlertTriangle } from 'lucide-react';
import { WeddingSettings } from '../../types';

interface Props {
  settings: WeddingSettings;
  onUpdateSettings: (s: WeddingSettings) => void;
  onExportAll: () => string;
  onImportAll: (json: string) => boolean;
  onResetAll: () => void;
}

export default function Settings({ settings, onUpdateSettings, onExportAll, onImportAll, onResetAll }: Props) {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [importMsg, setImportMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  /* ── Export all data as JSON ── */
  const handleExport = () => {
    const json = onExportAll();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wedding-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  /* ── Import data from JSON backup ── */
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const json = ev.target?.result as string;
        const ok = onImportAll(json);
        setImportMsg(ok
          ? { type: 'success', text: 'Data imported successfully! Refresh to see changes.' }
          : { type: 'error', text: 'Import failed — invalid data format.' }
        );
      } catch {
        setImportMsg({ type: 'error', text: 'Import failed — could not read file.' });
      }
    };
    reader.readAsText(file);
    // Reset file input
    if (fileRef.current) fileRef.current.value = '';
  };

  /* ── Update a single field ── */
  const update = (field: keyof WeddingSettings, value: string | number) => {
    onUpdateSettings({ ...settings, [field]: value });
  };

  return (
    <div className="animate-fade-in space-y-8 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
          <SettingsIcon size={20} className="text-gray-600" />
        </div>
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-500">Manage your wedding details and app data</p>
        </div>
      </div>

      {/* ── Wedding Details ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
        <h2 className="text-lg font-serif font-semibold flex items-center gap-2">
          <Heart size={18} className="text-rose-400" /> Wedding Details
        </h2>

        {/* Wedding Date */}
        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
            <Calendar size={12} className="inline mr-1" /> Wedding Date
          </label>
          <input
            type="date"
            value={settings.weddingDate}
            onChange={(e) => update('weddingDate', e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/30"
          />
        </div>

        {/* Names */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Your Name</label>
            <input
              type="text"
              value={settings.bride}
              onChange={(e) => update('bride', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/30"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Partner's Name</label>
            <input
              type="text"
              value={settings.partner}
              onChange={(e) => update('partner', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/30"
              placeholder="Partner's name"
            />
          </div>
        </div>

        {/* Wedding Title */}
        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Wedding Title / Theme</label>
          <input
            type="text"
            value={settings.weddingTitle}
            onChange={(e) => update('weddingTitle', e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/30"
            placeholder="e.g., An Autumn Celebration"
          />
        </div>

        {/* Budget */}
        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
            <DollarSign size={12} className="inline mr-1" /> Total Budget
          </label>
          <input
            type="number"
            value={settings.totalBudget}
            onChange={(e) => update('totalBudget', Number(e.target.value))}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/30"
            min={0}
            step={500}
          />
        </div>
      </div>

      {/* ── Data Management ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
        <h2 className="text-lg font-serif font-semibold">Data Management</h2>

        {/* Export */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleExport}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-colors"
          >
            <Download size={16} /> Export All Data (JSON)
          </button>

          {/* Import */}
          <label className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
            <Upload size={16} /> Import from Backup
            <input ref={fileRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
          </label>
        </div>
        {importMsg && (
          <p className={`text-sm ${importMsg.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
            {importMsg.text}
          </p>
        )}

        {/* Reset */}
        <div className="pt-4 border-t border-gray-100">
          {!showResetConfirm ? (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-red-50 text-red-600 text-sm font-medium rounded-xl hover:bg-red-100 transition-colors"
            >
              <Trash2 size={16} /> Reset All Data
            </button>
          ) : (
            <div className="p-4 bg-red-50 rounded-xl space-y-3">
              <div className="flex items-center gap-2 text-red-700">
                <AlertTriangle size={18} />
                <p className="text-sm font-medium">Are you sure? This will delete all your wedding data permanently.</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => { onResetAll(); setShowResetConfirm(false); }}
                  className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
                >
                  Yes, Delete Everything
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="px-4 py-2 bg-white text-gray-600 text-sm font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
