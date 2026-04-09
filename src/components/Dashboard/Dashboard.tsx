/* ══════════════════════════════════════════════════════════
 * 📋 Dashboard — Wedding countdown, stats, todos, payments, focus
 * ══════════════════════════════════════════════════════════ */
import React, { useState, useEffect } from 'react';
import { differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds } from 'date-fns';
import { Users, DollarSign, CheckCircle2, Calendar, AlertCircle, Heart, Clock, Plus, Trash2 } from 'lucide-react';
import { Guest, Vendor, BudgetItem, ChecklistTask, DashboardTodo, ColorScheme, InspirationImage, WeddingSettings } from '../../types';

interface Props {
  settings: WeddingSettings;
  guests: Guest[];
  vendors: Vendor[];
  budgetItems: BudgetItem[];
  checklist: ChecklistTask[];
  todos: DashboardTodo[];
  onUpdateTodos: (todos: DashboardTodo[]) => void;
  activeScheme: ColorScheme;
  inspirationImages: InspirationImage[];
}

const Dashboard: React.FC<Props> = ({ settings, guests, vendors, budgetItems, checklist, todos, onUpdateTodos, activeScheme, inspirationImages }) => {
  // ── Countdown Timer ──
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calc = () => {
      const wedding = new Date(settings.weddingDate + 'T00:00:00');
      const now = new Date();
      if (now >= wedding) { setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 }); return; }
      const totalSec = Math.floor((wedding.getTime() - now.getTime()) / 1000);
      const days = Math.floor(totalSec / 86400);
      const hours = Math.floor((totalSec % 86400) / 3600);
      const minutes = Math.floor((totalSec % 3600) / 60);
      const seconds = totalSec % 60;
      setCountdown({ days, hours, minutes, seconds });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [settings.weddingDate]);

  // ── Stats ──
  const confirmed = guests.filter(g => g.rsvpStatus === 'Confirmed').length;
  const pending = guests.filter(g => g.rsvpStatus === 'Pending').length;
  const declined = guests.filter(g => g.rsvpStatus === 'Declined').length;

  const totalSpent = budgetItems.reduce((s, b) => s + b.paid, 0);
  const totalBudget = settings.totalBudget;
  const budgetPct = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

  const vendorsBooked = vendors.filter(v => v.contractStatus === 'Booked' || v.contractStatus === 'Paid in Full').length;

  // ── Upcoming Payments ──
  const upcomingPayments = vendors
    .filter(v => v.paymentDueDate && v.balanceDue > 0)
    .sort((a, b) => new Date(a.paymentDueDate).getTime() - new Date(b.paymentDueDate).getTime())
    .slice(0, 3);

  // ── Today's Focus: 3 most urgent incomplete checklist tasks ──
  const focusTasks = checklist
    .filter(t => !t.completed)
    .sort((a, b) => {
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    })
    .slice(0, 3);

  // ── Pinned images ──
  const pinnedImages = inspirationImages.filter(i => i.pinned).slice(0, 4);

  // ── Todo handlers ──
  const toggleTodo = (id: string) => onUpdateTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  const addTodo = () => onUpdateTodos([...todos, { id: `dt-${Date.now()}`, text: '', completed: false }]);
  const updateTodoText = (id: string, text: string) => onUpdateTodos(todos.map(t => t.id === id ? { ...t, text } : t));
  const deleteTodo = (id: string) => onUpdateTodos(todos.filter(t => t.id !== id));

  const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

  return (
    <div className="animate-fade-in space-y-6">
      {/* ── Countdown ── */}
      <div className="relative overflow-hidden rounded-2xl p-8 shadow-lg" style={{ background: `linear-gradient(135deg, ${activeScheme.primary}12, ${activeScheme.accent}12)`, borderLeft: `4px solid ${activeScheme.primary}` }}>
        <div className="flex items-center gap-2 mb-3">
          <Clock size={18} style={{ color: activeScheme.primary }} />
          <h2 className="font-serif text-sm font-semibold uppercase tracking-widest" style={{ color: activeScheme.primary }}>Wedding Countdown</h2>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {[
            { val: countdown.days, label: 'Days', color: activeScheme.primary },
            { val: countdown.hours, label: 'Hours', color: activeScheme.secondary },
            { val: countdown.minutes, label: 'Minutes', color: activeScheme.primary },
            { val: countdown.seconds, label: 'Seconds', color: activeScheme.accent },
          ].map(({ val, label, color }) => (
            <div key={label} className="text-center">
              <div className="font-serif text-4xl sm:text-5xl font-bold" style={{ color }}>{val}</div>
              <p className="text-[10px] sm:text-xs uppercase tracking-wider text-gray-500 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Quick Stats ── */}
      <div className="grid gap-4 sm:grid-cols-3">
        {/* Guests */}
        <div className="card-hover bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-serif text-sm font-semibold uppercase tracking-wide text-gray-600">Guests</h3>
            <Users size={18} style={{ color: activeScheme.primary }} />
          </div>
          <div className="text-2xl font-serif font-bold" style={{ color: activeScheme.primary }}>{confirmed}<span className="text-sm text-gray-400 font-sans font-normal"> / {guests.length}</span></div>
          <div className="flex gap-3 mt-2 text-xs text-gray-500">
            <span className="text-green-600">{confirmed} confirmed</span>
            <span className="text-amber-500">{pending} pending</span>
            <span className="text-red-400">{declined} declined</span>
          </div>
        </div>

        {/* Budget */}
        <div className="card-hover bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-serif text-sm font-semibold uppercase tracking-wide text-gray-600">Budget</h3>
            <DollarSign size={18} style={{ color: activeScheme.accent }} />
          </div>
          <div className="text-2xl font-serif font-bold text-gray-800">{fmt(totalSpent)}<span className="text-sm text-gray-400 font-sans font-normal"> of {fmt(totalBudget)}</span></div>
          <div className="h-2 bg-gray-100 rounded-full mt-3 overflow-hidden">
            <div className="h-full rounded-full transition-all duration-500 color-transition" style={{ width: `${Math.min(budgetPct, 100)}%`, background: budgetPct > 100 ? '#ef4444' : budgetPct > 90 ? '#eab308' : activeScheme.accent }} />
          </div>
        </div>

        {/* Vendors */}
        <div className="card-hover bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-serif text-sm font-semibold uppercase tracking-wide text-gray-600">Vendors</h3>
            <CheckCircle2 size={18} style={{ color: activeScheme.primary }} />
          </div>
          <div className="text-2xl font-serif font-bold" style={{ color: activeScheme.primary }}>{vendorsBooked}<span className="text-sm text-gray-400 font-sans font-normal"> / {vendors.length} booked</span></div>
          <div className="h-2 bg-gray-100 rounded-full mt-3 overflow-hidden">
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${vendors.length ? (vendorsBooked / vendors.length) * 100 : 0}%`, background: activeScheme.primary }} />
          </div>
        </div>
      </div>

      {/* ── Two-column: Todos + Focus ── */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* To-Do Checklist */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-serif text-lg font-semibold text-gray-800 mb-4">To-Do Checklist</h3>
          <div className="space-y-1">
            {todos.map(todo => (
              <div key={todo.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors group">
                <input type="checkbox" checked={todo.completed} onChange={() => toggleTodo(todo.id)} className="w-4 h-4 rounded cursor-pointer" style={{ accentColor: activeScheme.primary }} />
                <input type="text" value={todo.text} onChange={e => updateTodoText(todo.id, e.target.value)} placeholder="New task..." className={`flex-1 bg-transparent text-sm outline-none ${todo.completed ? 'line-through text-gray-400' : 'text-gray-800'}`} />
                <button onClick={() => deleteTodo(todo.id)} className="opacity-0 group-hover:opacity-100 p-1 text-gray-300 hover:text-red-400 transition-all"><Trash2 size={14} /></button>
              </div>
            ))}
          </div>
          <button onClick={addTodo} className="mt-3 flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-xl border-2 border-dashed transition-colors" style={{ borderColor: `${activeScheme.primary}40`, color: activeScheme.primary }}>
            <Plus size={14} /> Add Task
          </button>
        </div>

        {/* Today's Focus */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100" style={{ borderLeft: `4px solid ${activeScheme.primary}` }}>
          <div className="flex items-center gap-2 mb-4">
            <Heart size={18} style={{ color: activeScheme.primary }} />
            <h3 className="font-serif text-lg font-semibold text-gray-800">Today's Focus</h3>
          </div>
          {focusTasks.length > 0 ? (
            <div className="space-y-3">
              {focusTasks.map((task, i) => (
                <div key={task.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                  <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ background: activeScheme.accent }}>{i + 1}</span>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{task.task}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{task.timeBucket}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 text-center py-4">All caught up!</p>
          )}
        </div>
      </div>

      {/* ── Upcoming Vendor Payments ── */}
      {upcomingPayments.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle size={18} style={{ color: activeScheme.accent }} />
            <h3 className="font-serif text-lg font-semibold text-gray-800">Upcoming Payments</h3>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {upcomingPayments.map(v => (
              <div key={v.id} className="p-4 bg-gray-50 rounded-xl">
                <p className="font-medium text-sm text-gray-800">{v.businessName}</p>
                <p className="text-xs text-gray-400">{v.category}</p>
                <p className="text-lg font-serif font-bold text-gray-800 mt-2">{fmt(v.balanceDue)}</p>
                <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-500">
                  <Calendar size={12} />
                  {new Date(v.paymentDueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Color Scheme Preview ── */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-serif text-lg font-semibold text-gray-800 mb-4">Active Color Scheme — {activeScheme.name}</h3>
        <div className="flex gap-4 flex-wrap">
          {[
            { label: 'Primary', hex: activeScheme.primary },
            { label: 'Secondary', hex: activeScheme.secondary },
            { label: 'Accent', hex: activeScheme.accent },
            ...(activeScheme.extra ? [{ label: 'Extra', hex: activeScheme.extra }] : []),
          ].map(({ label, hex }) => (
            <div key={label} className="flex flex-col items-center gap-1.5">
              <div className="w-14 h-14 rounded-xl shadow-md color-transition" style={{ background: hex }} />
              <span className="text-[10px] font-medium text-gray-500">{label}</span>
              <span className="text-[10px] font-mono text-gray-400">{hex}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Pinned Mood Board ── */}
      {pinnedImages.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-serif text-lg font-semibold text-gray-800 mb-4">Pinned Mood Board</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {pinnedImages.map(img => (
              <div key={img.id} className="aspect-square rounded-xl overflow-hidden shadow-md">
                <img src={img.src} alt={img.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
