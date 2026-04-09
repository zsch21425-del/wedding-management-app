/* ══════════════════════════════════════════════════════════
 * 💰 Budget Tracker — Per-category tracking with progress bars
 * ══════════════════════════════════════════════════════════ */
import React, { useState } from 'react';
import { DollarSign, TrendingUp, AlertTriangle, Edit2, Check, X, CheckCircle2 } from 'lucide-react';
import { BudgetItem, BudgetCategory } from '../../types';

interface Props {
  totalBudget: number;
  budgetItems: BudgetItem[];
  onUpdateBudget: (items: BudgetItem[]) => void;
}

const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

export default function BudgetTracker({ totalBudget, budgetItems, onUpdateBudget }: Props) {
  // Track which cell is being edited: "itemId-field"
  const [editing, setEditing] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  // ── Totals ──
  const totalEstimated = budgetItems.reduce((s, b) => s + b.estimated, 0);
  const totalActual = budgetItems.reduce((s, b) => s + b.actual, 0);
  const totalPaid = budgetItems.reduce((s, b) => s + b.paid, 0);
  const totalBalance = totalActual - totalPaid;

  // ── Budget health ──
  const budgetUsedPct = totalBudget > 0 ? (totalActual / totalBudget) * 100 : 0;
  const healthColor = budgetUsedPct > 100 ? '#ef4444' : budgetUsedPct > 90 ? '#eab308' : '#22c55e';
  const healthLabel = budgetUsedPct > 100 ? 'Over Budget' : budgetUsedPct > 90 ? 'Near Limit' : 'On Track';

  // ── Start editing a cell ──
  const startEdit = (id: string, field: string, value: number) => {
    setEditing(`${id}-${field}`);
    setEditValue(value.toString());
  };

  // ── Save edit ──
  const saveEdit = (id: string, field: 'estimated' | 'actual' | 'paid') => {
    const num = parseFloat(editValue) || 0;
    onUpdateBudget(budgetItems.map(b => b.id === id ? { ...b, [field]: Math.max(0, num) } : b));
    setEditing(null);
  };

  // ── Editable cell component ──
  const EditableCell = ({ item, field }: { item: BudgetItem; field: 'estimated' | 'actual' | 'paid' }) => {
    const key = `${item.id}-${field}`;
    const value = item[field];
    if (editing === key) {
      return (
        <div className="flex items-center gap-1">
          <input type="number" value={editValue} onChange={e => setEditValue(e.target.value)} onKeyDown={e => e.key === 'Enter' && saveEdit(item.id, field)} className="w-24 px-2 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/30" autoFocus />
          <button onClick={() => saveEdit(item.id, field)} className="p-1 text-green-500 hover:bg-green-50 rounded"><Check size={14} /></button>
          <button onClick={() => setEditing(null)} className="p-1 text-gray-400 hover:bg-gray-50 rounded"><X size={14} /></button>
        </div>
      );
    }
    return (
      <button onClick={() => startEdit(item.id, field, value)} className="group flex items-center gap-1 hover:bg-gray-50 px-2 py-1 rounded-lg transition-colors text-left">
        <span className="text-sm text-gray-700">{fmt(value)}</span>
        <Edit2 size={12} className="text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
      </button>
    );
  };

  return (
    <div className="animate-fade-in space-y-6">
      {/* ── Header ── */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
          <DollarSign size={20} className="text-green-600" />
        </div>
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900">Budget Tracker</h1>
          <p className="text-sm text-gray-500">Total budget: {fmt(totalBudget)}</p>
        </div>
      </div>

      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Estimated</p>
          <p className="text-xl font-serif font-bold text-gray-800">{fmt(totalEstimated)}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Actual</p>
          <p className="text-xl font-serif font-bold text-gray-800">{fmt(totalActual)}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Paid</p>
          <p className="text-xl font-serif font-bold text-green-600">{fmt(totalPaid)}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Remaining</p>
          <p className="text-xl font-serif font-bold" style={{ color: totalBalance > 0 ? '#ef4444' : '#22c55e' }}>{fmt(totalBalance)}</p>
        </div>
      </div>

      {/* ── Budget Health Meter ── */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {budgetUsedPct > 100 ? <AlertTriangle size={18} className="text-red-500" /> : budgetUsedPct > 90 ? <AlertTriangle size={18} className="text-amber-500" /> : <CheckCircle2 size={18} className="text-green-500" />}
            <span className="text-sm font-medium" style={{ color: healthColor }}>{healthLabel}</span>
          </div>
          <span className="text-sm text-gray-500">{Math.round(budgetUsedPct)}% of budget used</span>
        </div>
        <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-700" style={{ width: `${Math.min(budgetUsedPct, 100)}%`, background: healthColor }} />
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-400">
          <span>{fmt(0)}</span>
          <span>{fmt(totalBudget)}</span>
        </div>
      </div>

      {/* ── Category Breakdown Table ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Estimated</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Actual</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Paid</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider w-32">Progress</th>
              </tr>
            </thead>
            <tbody>
              {budgetItems.map(item => {
                const balance = item.actual - item.paid;
                const pct = item.estimated > 0 ? (item.actual / item.estimated) * 100 : 0;
                const overBudget = pct > 100;
                return (
                  <tr key={item.id} className={`border-b border-gray-50 hover:bg-gray-50/50 transition-colors ${overBudget ? 'bg-red-50/30' : ''}`}>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {overBudget && <AlertTriangle size={14} className="text-red-500" />}
                        <span className="text-sm font-medium text-gray-800">{item.category}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4"><EditableCell item={item} field="estimated" /></td>
                    <td className="py-3 px-4"><EditableCell item={item} field="actual" /></td>
                    <td className="py-3 px-4"><EditableCell item={item} field="paid" /></td>
                    <td className="py-3 px-4">
                      <span className={`text-sm font-medium ${balance > 0 ? 'text-red-500' : 'text-green-600'}`}>
                        {fmt(balance)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.min(pct, 100)}%`,
                            background: pct > 100 ? '#ef4444' : pct > 90 ? '#eab308' : '#22c55e',
                          }}
                        />
                      </div>
                      <span className="text-[10px] text-gray-400">{Math.round(pct)}%</span>
                    </td>
                  </tr>
                );
              })}
              {/* Totals row */}
              <tr className="bg-gray-50 font-semibold">
                <td className="py-3 px-4 text-sm text-gray-800">TOTAL</td>
                <td className="py-3 px-4 text-sm text-gray-800">{fmt(totalEstimated)}</td>
                <td className="py-3 px-4 text-sm text-gray-800">{fmt(totalActual)}</td>
                <td className="py-3 px-4 text-sm text-green-600">{fmt(totalPaid)}</td>
                <td className="py-3 px-4 text-sm" style={{ color: totalBalance > 0 ? '#ef4444' : '#22c55e' }}>{fmt(totalBalance)}</td>
                <td className="py-3 px-4"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
