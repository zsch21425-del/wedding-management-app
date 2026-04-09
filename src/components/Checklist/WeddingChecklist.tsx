/* ══════════════════════════════════════════════════════════
 * ✅ Wedding Checklist & Timeline — Tasks by time bucket
 * ══════════════════════════════════════════════════════════ */
import React, { useState } from 'react';
import { CheckCircle2, Circle, Plus, Trash2, ChevronDown, ChevronRight, ListChecks, Calendar, User } from 'lucide-react';
import { ChecklistTask, Assignee, TimeBucket } from '../../types';

interface Props {
  checklist: ChecklistTask[];
  onUpdateChecklist: (checklist: ChecklistTask[]) => void;
}

const TIME_BUCKETS: TimeBucket[] = [
  '12+ Months Out', '9-12 Months Out', '6-9 Months Out',
  '4-6 Months Out', '2-4 Months Out', '1-2 Months Out',
  '2-4 Weeks Out', '1 Week Out', 'Day Before', 'Day Of',
];

const ASSIGNEES: Assignee[] = ['Me', 'Partner', 'Planner', 'Family'];

export default function WeddingChecklist({ checklist, onUpdateChecklist }: Props) {
  // Track which buckets are expanded
  const [expanded, setExpanded] = useState<Set<TimeBucket>>(new Set(TIME_BUCKETS));
  // Track which bucket has the "add task" form open
  const [addingTo, setAddingTo] = useState<TimeBucket | null>(null);
  // New task form state
  const [newTask, setNewTask] = useState('');
  // Track which task notes are expanded
  const [expandedNotes, setExpandedNotes] = useState<Set<string>>(new Set());

  // ── Overall progress ──
  const totalTasks = checklist.length;
  const completedTasks = checklist.filter(t => t.completed).length;
  const progressPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // ── Toggle bucket expansion ──
  const toggleBucket = (bucket: TimeBucket) => {
    setExpanded(prev => {
      const next = new Set(prev);
      next.has(bucket) ? next.delete(bucket) : next.add(bucket);
      return next;
    });
  };

  // ── Toggle task completion ──
  const toggleTask = (id: string) => {
    onUpdateChecklist(checklist.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  // ── Update task field ──
  const updateTask = (id: string, field: Partial<ChecklistTask>) => {
    onUpdateChecklist(checklist.map(t => t.id === id ? { ...t, ...field } : t));
  };

  // ── Delete task ──
  const deleteTask = (id: string) => {
    onUpdateChecklist(checklist.filter(t => t.id !== id));
  };

  // ── Add new task to bucket ──
  const addTask = (bucket: TimeBucket) => {
    if (!newTask.trim()) return;
    const task: ChecklistTask = {
      id: `ck-${Date.now()}`,
      task: newTask.trim(),
      notes: '',
      assignee: 'Me',
      dueDate: '',
      completed: false,
      timeBucket: bucket,
    };
    onUpdateChecklist([...checklist, task]);
    setNewTask('');
    setAddingTo(null);
  };

  // ── Toggle notes visibility ──
  const toggleNotes = (id: string) => {
    setExpandedNotes(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="animate-fade-in space-y-6">
      {/* ── Header ── */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center">
          <ListChecks size={20} className="text-rose-500" />
        </div>
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900">Wedding Checklist</h1>
          <p className="text-sm text-gray-500">{completedTasks} of {totalTasks} tasks completed</p>
        </div>
      </div>

      {/* ── Overall Progress Bar ── */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">Overall Progress</span>
          <span className="text-sm font-bold text-gray-800">{progressPct}%</span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-rose-400 rounded-full transition-all duration-700" style={{ width: `${progressPct}%` }} />
        </div>
      </div>

      {/* ── Time Bucket Sections ── */}
      {TIME_BUCKETS.map(bucket => {
        const tasks = checklist.filter(t => t.timeBucket === bucket);
        const done = tasks.filter(t => t.completed).length;
        const isExpanded = expanded.has(bucket);

        return (
          <div key={bucket} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Bucket Header */}
            <button onClick={() => toggleBucket(bucket)} className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                {isExpanded ? <ChevronDown size={18} className="text-gray-400" /> : <ChevronRight size={18} className="text-gray-400" />}
                <h3 className="font-serif text-lg font-semibold text-gray-800">{bucket}</h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">{done}/{tasks.length}</span>
              </div>
              {tasks.length > 0 && (
                <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-400 rounded-full" style={{ width: `${tasks.length > 0 ? (done / tasks.length) * 100 : 0}%` }} />
                </div>
              )}
            </button>

            {/* Tasks */}
            {isExpanded && (
              <div className="px-5 pb-5 space-y-1">
                {tasks.map(task => (
                  <div key={task.id} className="group">
                    <div className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors">
                      {/* Checkbox */}
                      <button onClick={() => toggleTask(task.id)} className="shrink-0">
                        {task.completed
                          ? <CheckCircle2 size={20} className="text-rose-400" />
                          : <Circle size={20} className="text-gray-300 hover:text-rose-300" />
                        }
                      </button>

                      {/* Task name */}
                      <span className={`flex-1 text-sm ${task.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>{task.task}</span>

                      {/* Assignee */}
                      <select
                        value={task.assignee}
                        onChange={e => updateTask(task.id, { assignee: e.target.value as Assignee })}
                        className="text-xs px-2 py-1 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none"
                      >
                        {ASSIGNEES.map(a => <option key={a} value={a}>{a}</option>)}
                      </select>

                      {/* Due date */}
                      <input
                        type="date"
                        value={task.dueDate}
                        onChange={e => updateTask(task.id, { dueDate: e.target.value })}
                        className="text-xs px-2 py-1 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none"
                      />

                      {/* Notes toggle */}
                      <button onClick={() => toggleNotes(task.id)} className="p-1 text-gray-300 hover:text-gray-500 text-xs">notes</button>

                      {/* Delete */}
                      <button onClick={() => deleteTask(task.id)} className="opacity-0 group-hover:opacity-100 p-1 text-gray-300 hover:text-red-400 transition-all">
                        <Trash2 size={14} />
                      </button>
                    </div>

                    {/* Expandable notes */}
                    {expandedNotes.has(task.id) && (
                      <div className="ml-10 mb-2">
                        <textarea
                          value={task.notes}
                          onChange={e => updateTask(task.id, { notes: e.target.value })}
                          placeholder="Add notes..."
                          className="w-full text-xs px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-200 resize-none"
                          rows={2}
                        />
                      </div>
                    )}
                  </div>
                ))}

                {/* Add task form */}
                {addingTo === bucket ? (
                  <div className="flex items-center gap-2 mt-2 pl-10">
                    <input
                      type="text"
                      value={newTask}
                      onChange={e => setNewTask(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && addTask(bucket)}
                      placeholder="New task name..."
                      className="flex-1 text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-200"
                      autoFocus
                    />
                    <button onClick={() => addTask(bucket)} className="px-3 py-2 bg-rose-400 text-white text-sm rounded-lg hover:bg-rose-500 transition-colors">Add</button>
                    <button onClick={() => { setAddingTo(null); setNewTask(''); }} className="px-3 py-2 text-sm text-gray-400 hover:text-gray-600">Cancel</button>
                  </div>
                ) : (
                  <button onClick={() => setAddingTo(bucket)} className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-600 mt-2 ml-10 font-medium transition-colors">
                    <Plus size={14} /> Add task
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
