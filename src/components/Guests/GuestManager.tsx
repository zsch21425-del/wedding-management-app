import React, { useState, useRef } from 'react';
import {
  UserPlus,
  Search,
  Filter,
  Download,
  Upload,
  Edit2,
  Trash2,
  X,
  Users,
  ChevronDown,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Guest, RSVPStatus, MealPreference, Relationship } from '../../types';

interface Props {
  guests: Guest[];
  onUpdateGuests: (guests: Guest[]) => void;
}

interface FormData {
  id?: string;
  name: string;
  email: string;
  phone: string;
  relationship: Relationship;
  rsvpStatus: RSVPStatus;
  mealPreference: MealPreference;
  dietaryRestrictions: string;
  tableAssignment: number | '';
  notes: string;
}

interface Filters {
  searchTerm: string;
  rsvpStatus: RSVPStatus | 'All';
  relationship: Relationship | 'All';
}

const DEFAULT_FORM_DATA: FormData = {
  name: '',
  email: '',
  phone: '',
  relationship: 'Friend',
  rsvpStatus: 'Pending',
  mealPreference: 'Chicken',
  dietaryRestrictions: '',
  tableAssignment: '',
  notes: '',
};

const RSVP_COLORS: Record<RSVPStatus, string> = {
  Confirmed: '#10b981',
  Declined: '#ef4444',
  Pending: '#f59e0b',
  'No Response': '#6b7280',
};

export default function GuestManager({ guests, onUpdateGuests }: Props) {
  // State management
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<FormData>(DEFAULT_FORM_DATA);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({
    searchTerm: '',
    rsvpStatus: 'All',
    relationship: 'All',
  });
  const [showFilters, setShowFilters] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter and search guests
  const filteredGuests = guests.filter((guest) => {
    const matchesSearch = guest.name
      .toLowerCase()
      .includes(filters.searchTerm.toLowerCase());
    const matchesRsvp =
      filters.rsvpStatus === 'All' || guest.rsvpStatus === filters.rsvpStatus;
    const matchesRelationship =
      filters.relationship === 'All' ||
      guest.relationship === filters.relationship;

    return matchesSearch && matchesRsvp && matchesRelationship;
  });

  // Calculate RSVP summary data
  const rsvpSummary = {
    Confirmed: guests.filter((g) => g.rsvpStatus === 'Confirmed').length,
    Declined: guests.filter((g) => g.rsvpStatus === 'Declined').length,
    Pending: guests.filter((g) => g.rsvpStatus === 'Pending').length,
    'No Response': guests.filter((g) => g.rsvpStatus === 'No Response').length,
  };

  const rsvpChartData = Object.entries(rsvpSummary)
    .map(([status, count]) => ({
      name: status,
      value: count,
      color: RSVP_COLORS[status as RSVPStatus],
    }))
    .filter((item) => item.value > 0);

  // Group guests by table for seating view
  const guestsByTable = guests.reduce(
    (acc, guest) => {
      if (guest.tableAssignment) {
        if (!acc[guest.tableAssignment]) {
          acc[guest.tableAssignment] = [];
        }
        acc[guest.tableAssignment].push(guest);
      }
      return acc;
    },
    {} as Record<number, Guest[]>
  );

  const sortedTables = Object.keys(guestsByTable)
    .map(Number)
    .sort((a, b) => a - b);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert('Please enter a guest name');
      return;
    }

    let updatedGuests = [...guests];

    if (editingId) {
      // Update existing guest
      updatedGuests = updatedGuests.map((guest) =>
        guest.id === editingId
          ? {
              ...guest,
              ...formData,
              tableAssignment:
                formData.tableAssignment === ''
                  ? null
                  : Number(formData.tableAssignment),
            }
          : guest
      );
    } else {
      // Add new guest
      const newGuest: Guest = {
        id: Date.now().toString(),
        ...formData,
        tableAssignment:
          formData.tableAssignment === ''
            ? null
            : Number(formData.tableAssignment),
      };
      updatedGuests.push(newGuest);
    }

    onUpdateGuests(updatedGuests);
    resetForm();
  };

  // Reset form and close modal
  const resetForm = () => {
    setFormData(DEFAULT_FORM_DATA);
    setEditingId(null);
    setShowModal(false);
  };

  // Open form for editing
  const handleEdit = (guest: Guest) => {
    setFormData({
      id: guest.id,
      name: guest.name,
      email: guest.email,
      phone: guest.phone,
      relationship: guest.relationship,
      rsvpStatus: guest.rsvpStatus,
      mealPreference: guest.mealPreference,
      dietaryRestrictions: guest.dietaryRestrictions,
      tableAssignment: guest.tableAssignment || '',
      notes: guest.notes,
    });
    setEditingId(guest.id);
    setShowModal(true);
  };

  // Delete guest
  const handleDelete = (guestId: string) => {
    if (window.confirm('Are you sure you want to delete this guest?')) {
      onUpdateGuests(guests.filter((g) => g.id !== guestId));
    }
  };

  // CSV import handler
  const handleCSVImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const csv = event.target?.result as string;
        const lines = csv.split('\n').filter((line) => line.trim());

        // Skip header row
        const dataRows = lines.slice(1);

        const importedGuests: Guest[] = dataRows
          .map((line) => {
            const [
              name,
              email,
              phone,
              relationship,
              rsvpStatus,
              mealPreference,
              dietaryRestrictions,
              tableAssignment,
              notes,
            ] = line.split(',').map((field) => field.trim());

            if (!name) return null;

            return {
              id: Date.now().toString() + Math.random(),
              name,
              email: email || '',
              phone: phone || '',
              relationship: (relationship as Relationship) || 'Friend',
              rsvpStatus: (rsvpStatus as RSVPStatus) || 'Pending',
              mealPreference: (mealPreference as MealPreference) || 'Chicken',
              dietaryRestrictions: dietaryRestrictions || '',
              tableAssignment: tableAssignment ? Number(tableAssignment) : null,
              notes: notes || '',
            };
          })
          .filter((guest): guest is NonNullable<typeof guest> => guest !== null) as Guest[];

        onUpdateGuests([...guests, ...importedGuests]);
        alert(`Successfully imported ${importedGuests.length} guests`);
      } catch (error) {
        alert('Error importing CSV. Please check the format and try again.');
      }
    };
    reader.readAsText(file);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // CSV export handler
  const handleCSVExport = () => {
    const headers =
      'Name,Email,Phone,Relationship,RSVP Status,Meal Preference,Dietary Restrictions,Table Assignment,Notes';
    const rows = guests.map(
      (guest) =>
        `"${guest.name}","${guest.email}","${guest.phone}","${guest.relationship}","${guest.rsvpStatus}","${guest.mealPreference}","${guest.dietaryRestrictions}","${guest.tableAssignment || ''}","${guest.notes}"`
    );

    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `wedding-guests-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900">
            Guest List
          </h1>
          <p className="text-gray-600 font-sans mt-1">
            Manage {guests.length} guest{guests.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition font-sans"
          >
            <UserPlus size={18} />
            Add Guest
          </button>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-sans"
          >
            <Filter size={18} />
            Filters
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-sans"
          >
            <Upload size={18} />
            Import
          </button>

          <button
            onClick={handleCSVExport}
            disabled={guests.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed font-sans"
          >
            <Download size={18} />
            Export
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleCSVImport}
            className="hidden"
          />
        </div>
      </div>

      {/* Filter Section */}
      {showFilters && (
        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-3 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search by name..."
                value={filters.searchTerm}
                onChange={(e) =>
                  setFilters({ ...filters, searchTerm: e.target.value })
                }
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 font-sans"
              />
            </div>

            {/* RSVP Status Filter */}
            <select
              value={filters.rsvpStatus}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  rsvpStatus: e.target.value as RSVPStatus | 'All',
                })
              }
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 font-sans"
            >
              <option value="All">All RSVP Status</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Declined">Declined</option>
              <option value="Pending">Pending</option>
              <option value="No Response">No Response</option>
            </select>

            {/* Relationship Filter */}
            <select
              value={filters.relationship}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  relationship: e.target.value as Relationship | 'All',
                })
              }
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 font-sans"
            >
              <option value="All">All Relationships</option>
              <option value="Family">Family</option>
              <option value="Friend">Friend</option>
              <option value="Colleague">Colleague</option>
              <option value="Plus-One">Plus-One</option>
            </select>
          </div>

          {(filters.searchTerm ||
            filters.rsvpStatus !== 'All' ||
            filters.relationship !== 'All') && (
            <p className="text-sm text-gray-600 font-sans">
              Showing {filteredGuests.length} of {guests.length} guests
            </p>
          )}
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Guest List */}
        <div className="lg:col-span-2 space-y-4">
          {filteredGuests.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <Users size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-600 font-sans">
                {guests.length === 0
                  ? 'No guests yet. Add one to get started!'
                  : 'No guests match your filters.'}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredGuests.map((guest) => (
                <div
                  key={guest.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-serif font-semibold text-gray-900">
                          {guest.name}
                        </h3>
                        <span
                          className={`text-xs px-2 py-1 rounded-full text-white ${
                            guest.rsvpStatus === 'Confirmed'
                              ? 'bg-green-500'
                              : guest.rsvpStatus === 'Declined'
                                ? 'bg-red-500'
                                : guest.rsvpStatus === 'Pending'
                                  ? 'bg-amber-500'
                                  : 'bg-gray-500'
                          }`}
                        >
                          {guest.rsvpStatus}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-sm font-sans text-gray-600">
                        <div>
                          <span className="font-semibold">Email:</span>{' '}
                          {guest.email || 'N/A'}
                        </div>
                        <div>
                          <span className="font-semibold">Phone:</span>{' '}
                          {guest.phone || 'N/A'}
                        </div>
                        <div>
                          <span className="font-semibold">Relationship:</span>{' '}
                          {guest.relationship}
                        </div>
                        <div>
                          <span className="font-semibold">Meal:</span>{' '}
                          {guest.mealPreference}
                        </div>
                        {guest.dietaryRestrictions && (
                          <div className="col-span-2">
                            <span className="font-semibold">Dietary:</span>{' '}
                            {guest.dietaryRestrictions}
                          </div>
                        )}
                        {guest.tableAssignment && (
                          <div>
                            <span className="font-semibold">Table:</span>{' '}
                            {guest.tableAssignment}
                          </div>
                        )}
                        {guest.notes && (
                          <div className="col-span-2">
                            <span className="font-semibold">Notes:</span>{' '}
                            {guest.notes}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleEdit(guest)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded transition"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(guest.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Summary & Seating */}
        <div className="space-y-6">
          {/* RSVP Summary Chart */}
          {rsvpChartData.length > 0 && (
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h2 className="text-lg font-serif font-semibold text-gray-900 mb-4">
                RSVP Summary
              </h2>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={rsvpChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {rsvpChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value} guests`} />
                </PieChart>
              </ResponsiveContainer>

              {/* RSVP Stats */}
              <div className="space-y-2 mt-4">
                {Object.entries(rsvpSummary).map(([status, count]) => (
                  <div
                    key={status}
                    className="flex items-center justify-between text-sm font-sans"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: RSVP_COLORS[status as RSVPStatus] }}
                      />
                      <span>{status}</span>
                    </div>
                    <span className="font-semibold">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Seating View */}
          {sortedTables.length > 0 && (
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h2 className="text-lg font-serif font-semibold text-gray-900 mb-4">
                Seating Arrangement
              </h2>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {sortedTables.map((tableNum) => (
                  <div
                    key={tableNum}
                    className="border border-gray-200 rounded-lg p-3 bg-gray-50"
                  >
                    <h3 className="font-serif font-semibold text-gray-900 mb-2">
                      Table {tableNum}
                    </h3>
                    <ul className="space-y-1 text-sm font-sans text-gray-700">
                      {guestsByTable[tableNum].map((guest) => (
                        <li key={guest.id} className="flex items-center gap-2">
                          <ChevronDown size={14} className="text-gray-400" />
                          <span>{guest.name}</span>
                          <span className="text-xs text-gray-500 ml-auto">
                            {guest.mealPreference}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Unassigned Guests */}
          {guests.filter((g) => !g.tableAssignment).length > 0 && (
            <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
              <p className="font-sans text-sm text-yellow-800">
                <span className="font-semibold">
                  {guests.filter((g) => !g.tableAssignment).length} guest
                  {guests.filter((g) => !g.tableAssignment).length !== 1
                    ? 's'
                    : ''}{' '}
                </span>
                not yet assigned to a table
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal for Add/Edit Guest */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
              <h2 className="text-2xl font-serif font-bold text-gray-900">
                {editingId ? 'Edit Guest' : 'Add Guest'}
              </h2>
              <button
                onClick={resetForm}
                className="p-1 hover:bg-gray-100 rounded transition"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Row 1: Name and Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1 font-sans">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 font-sans"
                    placeholder="Guest name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1 font-sans">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 font-sans"
                    placeholder="guest@example.com"
                  />
                </div>
              </div>

              {/* Row 2: Phone and Relationship */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1 font-sans">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 font-sans"
                    placeholder="(123) 456-7890"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1 font-sans">
                    Relationship
                  </label>
                  <select
                    value={formData.relationship}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        relationship: e.target.value as Relationship,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 font-sans"
                  >
                    <option value="Family">Family</option>
                    <option value="Friend">Friend</option>
                    <option value="Colleague">Colleague</option>
                    <option value="Plus-One">Plus-One</option>
                  </select>
                </div>
              </div>

              {/* Row 3: RSVP Status and Meal Preference */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1 font-sans">
                    RSVP Status
                  </label>
                  <select
                    value={formData.rsvpStatus}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        rsvpStatus: e.target.value as RSVPStatus,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 font-sans"
                  >
                    <option value="Confirmed">Confirmed</option>
                    <option value="Declined">Declined</option>
                    <option value="Pending">Pending</option>
                    <option value="No Response">No Response</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1 font-sans">
                    Meal Preference
                  </label>
                  <select
                    value={formData.mealPreference}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        mealPreference: e.target.value as MealPreference,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 font-sans"
                  >
                    <option value="Beef">Beef</option>
                    <option value="Chicken">Chicken</option>
                    <option value="Vegetarian">Vegetarian</option>
                    <option value="Vegan">Vegan</option>
                    <option value="Kids Meal">Kids Meal</option>
                  </select>
                </div>
              </div>

              {/* Row 4: Dietary Restrictions and Table */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1 font-sans">
                    Dietary Restrictions
                  </label>
                  <input
                    type="text"
                    value={formData.dietaryRestrictions}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        dietaryRestrictions: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 font-sans"
                    placeholder="e.g., Nut allergy, Gluten-free"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1 font-sans">
                    Table Assignment
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.tableAssignment}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        tableAssignment: e.target.value === '' ? '' : Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 font-sans"
                    placeholder="Table #"
                  />
                </div>
              </div>

              {/* Row 5: Notes */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 font-sans">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 font-sans"
                  placeholder="Any additional notes about the guest..."
                  rows={3}
                />
              </div>

              {/* Modal Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition font-sans font-semibold"
                >
                  {editingId ? 'Update Guest' : 'Add Guest'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-sans font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
