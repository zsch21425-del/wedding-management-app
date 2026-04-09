import React, { useState } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Phone,
  Mail,
  Globe,
  Calendar,
  DollarSign,
  FileText,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { Vendor, VendorCategory, ContractStatus } from '../../types';

interface Props {
  vendors: Vendor[];
  onUpdateVendors: (vendors: Vendor[]) => void;
}

// Form state for add/edit modal
interface FormData {
  id?: string;
  businessName: string;
  category: VendorCategory;
  contactName: string;
  phone: string;
  email: string;
  website: string;
  contractStatus: ContractStatus;
  contractFile: string;
  totalCost: number;
  depositPaid: number;
  notes: string;
  paymentDueDate: string;
}

// Initial form state
const getEmptyForm = (): FormData => ({
  businessName: '',
  category: 'Venue',
  contactName: '',
  phone: '',
  email: '',
  website: '',
  contractStatus: 'Contacted',
  contractFile: '',
  totalCost: 0,
  depositPaid: 0,
  notes: '',
  paymentDueDate: '',
});

// Contract status color mapping for badge styling
const contractStatusColors: Record<ContractStatus, { bg: string; text: string }> = {
  'Contacted': { bg: 'bg-blue-100', text: 'text-blue-800' },
  'Proposal Received': { bg: 'bg-amber-100', text: 'text-amber-800' },
  'Booked': { bg: 'bg-green-100', text: 'text-green-800' },
  'Paid in Full': { bg: 'bg-purple-100', text: 'text-purple-800' },
  'Cancelled': { bg: 'bg-gray-100', text: 'text-gray-800' },
};

// Vendor category options
const vendorCategories: VendorCategory[] = [
  'Venue',
  'Caterer',
  'Photographer',
  'Videographer',
  'Florist',
  'DJ/Band',
  'Hair & Makeup',
  'Wedding Planner',
  'Officiant',
  'Transportation',
  'Cake',
  'Invitations',
  'Lighting',
  'Rentals',
  'Other',
];

const contractStatuses: ContractStatus[] = [
  'Contacted',
  'Proposal Received',
  'Booked',
  'Paid in Full',
  'Cancelled',
];

// Currency formatter for displaying amounts
const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/**
 * VendorManager Component
 * Manages wedding vendors with full CRUD operations, payment tracking, and contract status management
 */
const VendorManager: React.FC<Props> = ({ vendors, onUpdateVendors }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>(getEmptyForm());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'category' | 'dueDate'>('category');

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const parsedValue = type === 'number' ? (value === '' ? 0 : parseFloat(value)) : value;

    setFormData(prev => ({
      ...prev,
      [name]: parsedValue,
    }));
  };

  // Open modal for creating new vendor
  const handleOpenModal = () => {
    setEditingId(null);
    setFormData(getEmptyForm());
    setIsModalOpen(true);
  };

  // Open modal for editing existing vendor
  const handleEditVendor = (vendor: Vendor) => {
    setEditingId(vendor.id);
    setFormData({
      id: vendor.id,
      businessName: vendor.businessName,
      category: vendor.category,
      contactName: vendor.contactName,
      phone: vendor.phone,
      email: vendor.email,
      website: vendor.website,
      contractStatus: vendor.contractStatus,
      contractFile: vendor.contractFile,
      totalCost: vendor.totalCost,
      depositPaid: vendor.depositPaid,
      notes: vendor.notes,
      paymentDueDate: vendor.paymentDueDate,
    });
    setIsModalOpen(true);
  };

  // Close modal and reset form
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData(getEmptyForm());
  };

  // Save vendor (add or update)
  const handleSaveVendor = () => {
    // Validation
    if (!formData.businessName.trim() || !formData.contactName.trim()) {
      alert('Please fill in Business Name and Contact Name');
      return;
    }

    if (editingId) {
      // Update existing vendor
      const updatedVendors = vendors.map(v =>
        v.id === editingId
          ? { ...v, ...formData, id: editingId }
          : v
      );
      onUpdateVendors(updatedVendors);
    } else {
      // Create new vendor
      const newVendor: Vendor = {
        id: Date.now().toString(),
        ...formData,
        balanceDue: formData.totalCost - formData.depositPaid,
      };
      onUpdateVendors([...vendors, newVendor]);
    }

    handleCloseModal();
  };

  // Delete vendor
  const handleDeleteVendor = (id: string) => {
    if (window.confirm('Are you sure you want to delete this vendor?')) {
      onUpdateVendors(vendors.filter(v => v.id !== id));
    }
  };

  // Calculate balance due
  const getBalanceDue = (totalCost: number, depositPaid: number): number => {
    return totalCost - depositPaid;
  };

  // Get sorted vendors based on current sort option
  const getSortedVendors = (): Vendor[] => {
    if (sortBy === 'dueDate') {
      return [...vendors].sort((a, b) => {
        if (!a.paymentDueDate) return 1;
        if (!b.paymentDueDate) return -1;
        return new Date(a.paymentDueDate).getTime() - new Date(b.paymentDueDate).getTime();
      });
    }
    // Sort by category
    return [...vendors].sort((a, b) => a.category.localeCompare(b.category));
  };

  // Get upcoming payments (sorted by due date)
  const upcomingPayments = vendors
    .filter(v => v.paymentDueDate && getBalanceDue(v.totalCost, v.depositPaid) > 0)
    .sort((a, b) => new Date(a.paymentDueDate).getTime() - new Date(b.paymentDueDate).getTime())
    .slice(0, 5);

  const sortedVendors = getSortedVendors();

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl font-bold text-gray-900">Vendors</h1>
        <button
          onClick={handleOpenModal}
          className="flex items-center gap-2 rounded-lg bg-pink-600 px-4 py-2 text-white hover:bg-pink-700 transition-colors"
        >
          <Plus size={20} />
          Add Vendor
        </button>
      </div>

      {/* Upcoming Payments Section */}
      {upcomingPayments.length > 0 && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
          <div className="mb-4 flex items-center gap-2">
            <Calendar className="text-amber-600" size={20} />
            <h2 className="font-serif text-lg font-semibold text-amber-900">
              Upcoming Payments
            </h2>
          </div>
          <div className="space-y-2">
            {upcomingPayments.map(vendor => (
              <div
                key={vendor.id}
                className="flex items-center justify-between rounded bg-white p-3 text-sm"
              >
                <div>
                  <p className="font-sans font-semibold text-gray-900">
                    {vendor.businessName}
                  </p>
                  <p className="text-gray-600">
                    Due: {new Date(vendor.paymentDueDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-sans font-bold text-amber-700">
                    {currencyFormatter.format(getBalanceDue(vendor.totalCost, vendor.depositPaid))}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sort Controls */}
      {vendors.length > 0 && (
        <div className="flex gap-2">
          <button
            onClick={() => setSortBy('category')}
            className={`rounded px-4 py-2 text-sm font-medium transition-colors ${
              sortBy === 'category'
                ? 'bg-pink-600 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            Sort by Category
          </button>
          <button
            onClick={() => setSortBy('dueDate')}
            className={`rounded px-4 py-2 text-sm font-medium transition-colors ${
              sortBy === 'dueDate'
                ? 'bg-pink-600 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            Sort by Due Date
          </button>
        </div>
      )}

      {/* Vendors Grid */}
      {sortedVendors.length === 0 ? (
        <div className="rounded-lg bg-gray-50 p-12 text-center">
          <AlertCircle className="mx-auto mb-4 text-gray-400" size={40} />
          <p className="font-sans text-gray-600">No vendors added yet. Click "Add Vendor" to get started.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sortedVendors.map(vendor => {
            const balanceDue = getBalanceDue(vendor.totalCost, vendor.depositPaid);
            const statusColors = contractStatusColors[vendor.contractStatus];

            return (
              <div
                key={vendor.id}
                className="card-hover rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition-all"
              >
                {/* Header with Category and Status Badge */}
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {vendor.category}
                    </p>
                    <h3 className="font-serif text-lg font-semibold text-gray-900">
                      {vendor.businessName}
                    </h3>
                  </div>
                  <span
                    className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${statusColors.bg} ${statusColors.text}`}
                  >
                    {vendor.contractStatus}
                  </span>
                </div>

                {/* Contact Information */}
                <div className="mb-4 space-y-2 border-b border-gray-200 pb-4">
                  <p className="font-sans text-sm text-gray-900">
                    <span className="font-semibold">Contact:</span> {vendor.contactName}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {vendor.phone && (
                      <a
                        href={`tel:${vendor.phone}`}
                        className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                      >
                        <Phone size={16} />
                        {vendor.phone}
                      </a>
                    )}
                    {vendor.email && (
                      <a
                        href={`mailto:${vendor.email}`}
                        className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                      >
                        <Mail size={16} />
                        {vendor.email}
                      </a>
                    )}
                    {vendor.website && (
                      <a
                        href={vendor.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                      >
                        <Globe size={16} />
                        Website
                      </a>
                    )}
                  </div>
                </div>

                {/* Financial Information */}
                <div className="mb-4 space-y-2 border-b border-gray-200 pb-4">
                  <div className="flex items-center justify-between">
                    <span className="font-sans text-sm text-gray-700">Total Cost:</span>
                    <span className="font-sans font-bold text-gray-900">
                      {currencyFormatter.format(vendor.totalCost)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-sans text-sm text-gray-700">Deposit Paid:</span>
                    <span className="font-sans font-semibold text-green-700">
                      {currencyFormatter.format(vendor.depositPaid)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-sans text-sm text-gray-700">Balance Due:</span>
                    <span
                      className={`font-sans font-bold ${
                        balanceDue > 0 ? 'text-red-700' : 'text-green-700'
                      }`}
                    >
                      {currencyFormatter.format(balanceDue)}
                    </span>
                  </div>
                </div>

                {/* Contract and Additional Info */}
                <div className="mb-4 space-y-2">
                  {vendor.contractFile && (
                    <div className="flex items-center gap-2">
                      <FileText size={16} className="text-gray-500" />
                      <span className="font-sans text-sm text-gray-700">
                        {vendor.contractFile}
                      </span>
                    </div>
                  )}
                  {vendor.paymentDueDate && (
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-gray-500" />
                      <span className="font-sans text-sm text-gray-700">
                        Due: {new Date(vendor.paymentDueDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {vendor.notes && (
                    <p className="font-sans text-sm italic text-gray-600">
                      "{vendor.notes}"
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditVendor(vendor)}
                    className="flex flex-1 items-center justify-center gap-1 rounded bg-blue-100 px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-200 transition-colors"
                  >
                    <Edit2 size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteVendor(vendor.id)}
                    className="flex flex-1 items-center justify-center gap-1 rounded bg-red-100 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-200 transition-colors"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-h-[90vh] max-w-2xl overflow-y-auto rounded-lg bg-white shadow-xl">
            {/* Modal Header */}
            <div className="sticky top-0 flex items-center justify-between border-b border-gray-200 bg-gray-50 px-6 py-4">
              <h2 className="font-serif text-2xl font-bold text-gray-900">
                {editingId ? 'Edit Vendor' : 'Add New Vendor'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="rounded-lg p-1 hover:bg-gray-200 transition-colors"
              >
                <X size={24} className="text-gray-600" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-4 p-6">
              {/* Row 1: Business Name and Contact Name */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block font-sans text-sm font-semibold text-gray-900 mb-1">
                    Business Name *
                  </label>
                  <input
                    type="text"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleInputChange}
                    className="w-full rounded border border-gray-300 px-3 py-2 font-sans text-sm focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none"
                    placeholder="Enter business name"
                  />
                </div>
                <div>
                  <label className="block font-sans text-sm font-semibold text-gray-900 mb-1">
                    Contact Name *
                  </label>
                  <input
                    type="text"
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleInputChange}
                    className="w-full rounded border border-gray-300 px-3 py-2 font-sans text-sm focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none"
                    placeholder="Enter contact person name"
                  />
                </div>
              </div>

              {/* Row 2: Category and Contract Status */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block font-sans text-sm font-semibold text-gray-900 mb-1">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full rounded border border-gray-300 px-3 py-2 font-sans text-sm focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none"
                  >
                    {vendorCategories.map(cat => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-sans text-sm font-semibold text-gray-900 mb-1">
                    Contract Status
                  </label>
                  <select
                    name="contractStatus"
                    value={formData.contractStatus}
                    onChange={handleInputChange}
                    className="w-full rounded border border-gray-300 px-3 py-2 font-sans text-sm focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none"
                  >
                    {contractStatuses.map(status => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 3: Phone and Email */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block font-sans text-sm font-semibold text-gray-900 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full rounded border border-gray-300 px-3 py-2 font-sans text-sm focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none"
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div>
                  <label className="block font-sans text-sm font-semibold text-gray-900 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full rounded border border-gray-300 px-3 py-2 font-sans text-sm focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none"
                    placeholder="vendor@example.com"
                  />
                </div>
              </div>

              {/* Row 4: Website and Contract Upload */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block font-sans text-sm font-semibold text-gray-900 mb-1">
                    Website
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    className="w-full rounded border border-gray-300 px-3 py-2 font-sans text-sm focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none"
                    placeholder="https://example.com"
                  />
                </div>
                <div>
                  <label className="block font-sans text-sm font-semibold text-gray-900 mb-1">
                    Contract File
                  </label>
                  <input
                    type="text"
                    name="contractFile"
                    value={formData.contractFile}
                    onChange={handleInputChange}
                    className="w-full rounded border border-gray-300 px-3 py-2 font-sans text-sm focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none"
                    placeholder="contract.pdf"
                  />
                </div>
              </div>

              {/* Row 5: Total Cost, Deposit Paid */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block font-sans text-sm font-semibold text-gray-900 mb-1">
                    Total Cost
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      name="totalCost"
                      value={formData.totalCost || ''}
                      onChange={handleInputChange}
                      className="w-full rounded border border-gray-300 px-3 py-2 pl-7 font-sans text-sm focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none"
                      placeholder="0"
                      min="0"
                      step="100"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-sans text-sm font-semibold text-gray-900 mb-1">
                    Deposit Paid
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      name="depositPaid"
                      value={formData.depositPaid || ''}
                      onChange={handleInputChange}
                      className="w-full rounded border border-gray-300 px-3 py-2 pl-7 font-sans text-sm focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none"
                      placeholder="0"
                      min="0"
                      step="100"
                    />
                  </div>
                </div>
              </div>

              {/* Row 6: Payment Due Date */}
              <div>
                <label className="block font-sans text-sm font-semibold text-gray-900 mb-1">
                  Payment Due Date
                </label>
                <input
                  type="date"
                  name="paymentDueDate"
                  value={formData.paymentDueDate}
                  onChange={handleInputChange}
                  className="w-full rounded border border-gray-300 px-3 py-2 font-sans text-sm focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block font-sans text-sm font-semibold text-gray-900 mb-1">
                  Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="w-full rounded border border-gray-300 px-3 py-2 font-sans text-sm focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none"
                  placeholder="Add any additional notes..."
                  rows={3}
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 flex gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4">
              <button
                onClick={handleCloseModal}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 font-sans font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveVendor}
                className="flex-1 rounded-lg bg-pink-600 px-4 py-2 font-sans font-semibold text-white hover:bg-pink-700 transition-colors"
              >
                {editingId ? 'Update Vendor' : 'Add Vendor'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorManager;
