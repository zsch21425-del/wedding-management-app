import React, { useState } from 'react';
import {
  MapPin,
  Clock,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Car,
  Accessibility,
  Navigation,
  Building2,
  X,
} from 'lucide-react';
import { VenueLocation, TimeBlock } from '../../types';

interface Props {
  venues: VenueLocation[];
  onUpdateVenues: (venues: VenueLocation[]) => void;
  timeline: TimeBlock[];
  onUpdateTimeline: (timeline: TimeBlock[]) => void;
}

interface EditingVenue {
  id: string;
  data: VenueLocation;
}

interface EditingTimeBlock {
  id: string;
  data: TimeBlock;
}

/**
 * VenuePlanner Component
 * Manages ceremony and reception venue details, accessibility information,
 * guest notes, and day-of timeline with editable time blocks.
 */
const VenuePlanner: React.FC<Props> = ({
  venues,
  onUpdateVenues,
  timeline,
  onUpdateTimeline,
}) => {
  const [editingVenue, setEditingVenue] = useState<EditingVenue | null>(null);
  const [editingTimeBlock, setEditingTimeBlock] = useState<EditingTimeBlock | null>(null);
  const [showVenueForm, setShowVenueForm] = useState(false);
  const [showTimeBlockForm, setShowTimeBlockForm] = useState(false);

  // ===== VENUE MANAGEMENT =====

  const handleSaveVenue = (updatedVenue: VenueLocation) => {
    if (editingVenue) {
      // Update existing venue
      const updated = venues.map((v) => (v.id === editingVenue.id ? updatedVenue : v));
      onUpdateVenues(updated);
    } else {
      // Add new venue
      onUpdateVenues([...venues, updatedVenue]);
    }
    setEditingVenue(null);
    setShowVenueForm(false);
  };

  const handleDeleteVenue = (id: string) => {
    onUpdateVenues(venues.filter((v) => v.id !== id));
  };

  const handleEditVenue = (venue: VenueLocation) => {
    setEditingVenue({ id: venue.id, data: venue });
    setShowVenueForm(true);
  };

  const handleAddVenue = () => {
    setEditingVenue(null);
    setShowVenueForm(true);
  };

  // ===== TIMELINE MANAGEMENT =====

  const handleSaveTimeBlock = (updatedBlock: TimeBlock) => {
    if (editingTimeBlock) {
      // Update existing time block
      const updated = timeline.map((b) =>
        b.id === editingTimeBlock.id ? updatedBlock : b
      );
      onUpdateTimeline(updated);
    } else {
      // Add new time block
      onUpdateTimeline([...timeline, updatedBlock]);
    }
    setEditingTimeBlock(null);
    setShowTimeBlockForm(false);
  };

  const handleDeleteTimeBlock = (id: string) => {
    onUpdateTimeline(timeline.filter((b) => b.id !== id));
  };

  const handleEditTimeBlock = (block: TimeBlock) => {
    setEditingTimeBlock({ id: block.id, data: block });
    setShowTimeBlockForm(true);
  };

  const handleAddTimeBlock = () => {
    setEditingTimeBlock(null);
    setShowTimeBlockForm(true);
  };

  // ===== RENDER: VENUE CARD =====

  const renderVenueCard = (venue: VenueLocation) => (
    <div
      key={venue.id}
      className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow"
    >
      {/* Header with venue type and actions */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <Building2 className="w-5 h-5 text-rose-600" />
          <h3 className="font-serif text-xl text-gray-800">
            {venue.name || 'Unnamed Venue'}
          </h3>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleEditVenue(venue)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Edit venue"
          >
            <Edit2 className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={() => handleDeleteVenue(venue.id)}
            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete venue"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </button>
        </div>
      </div>

      {/* Venue Details Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Address */}
        {venue.address && (
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Address
            </p>
            <p className="text-sm text-gray-700">{venue.address}</p>
          </div>
        )}

        {/* Capacity */}
        {venue.capacity && (
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Capacity
            </p>
            <p className="text-sm text-gray-700">{venue.capacity} guests</p>
          </div>
        )}

        {/* Contact */}
        {venue.contact && (
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Contact
            </p>
            <p className="text-sm text-gray-700">{venue.contact}</p>
          </div>
        )}

        {/* Website */}
        {venue.website && (
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Website
            </p>
            <a
              href={venue.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-rose-600 hover:text-rose-700 flex items-center gap-1"
            >
              Visit <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}
      </div>

      {/* Contract Status */}
      {venue.contractStatus && (
        <div className="mb-4 p-3 bg-gray-50 rounded">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Contract Status
          </p>
          <p className="text-sm text-gray-700">{venue.contractStatus}</p>
        </div>
      )}

      {/* Parking Notes */}
      {venue.parkingNotes && (
        <div className="mb-4 p-3 bg-blue-50 rounded flex gap-2">
          <Car className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide">
              Parking
            </p>
            <p className="text-sm text-blue-900">{venue.parkingNotes}</p>
          </div>
        </div>
      )}

      {/* Accessibility Notes */}
      {venue.accessibilityNotes && (
        <div className="mb-4 p-3 bg-green-50 rounded flex gap-2">
          <Accessibility className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-green-700 uppercase tracking-wide">
              Accessibility
            </p>
            <p className="text-sm text-green-900">{venue.accessibilityNotes}</p>
          </div>
        </div>
      )}

      {/* Guest Directions & Lodging Notes */}
      {venue.directionsNotes && (
        <div className="mb-4 p-3 bg-purple-50 rounded flex gap-2">
          <Navigation className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-purple-700 uppercase tracking-wide">
              Directions & Lodging
            </p>
            <p className="text-sm text-purple-900">{venue.directionsNotes}</p>
          </div>
        </div>
      )}

      {/* General Notes */}
      {venue.notes && (
        <div className="p-3 bg-gray-50 rounded">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Notes
          </p>
          <p className="text-sm text-gray-700">{venue.notes}</p>
        </div>
      )}
    </div>
  );

  // ===== RENDER: VENUE FORM =====

  const renderVenueForm = () => {
    const initialVenue: VenueLocation = editingVenue?.data || {
      id: `venue-${Date.now()}`,
      type: 'ceremony',
      name: '',
      address: '',
      capacity: 0,
      contact: '',
      website: '',
      contractStatus: '',
      notes: '',
      parkingNotes: '',
      accessibilityNotes: '',
      directionsNotes: '',
    };

    return (
      <VenueFormModal
        venue={initialVenue}
        onSave={handleSaveVenue}
        onCancel={() => {
          setEditingVenue(null);
          setShowVenueForm(false);
        }}
      />
    );
  };

  // ===== RENDER: TIME BLOCK FORM =====

  const renderTimeBlockForm = () => {
    const initialBlock: TimeBlock = editingTimeBlock?.data || {
      id: `block-${Date.now()}`,
      time: '12:00 PM',
      label: '',
    };

    return (
      <TimeBlockFormModal
        timeBlock={initialBlock}
        onSave={handleSaveTimeBlock}
        onCancel={() => {
          setEditingTimeBlock(null);
          setShowTimeBlockForm(false);
        }}
      />
    );
  };

  // ===== RENDER: TIME BLOCK CARD =====

  const renderTimeBlockCard = (block: TimeBlock) => (
    <div
      key={block.id}
      className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 flex justify-between items-center hover:shadow-md transition-shadow"
    >
      <div className="flex items-center gap-4">
        <Clock className="w-5 h-5 text-rose-600 flex-shrink-0" />
        <div>
          <p className="font-serif text-lg text-gray-800">{block.time}</p>
          <p className="text-sm text-gray-600">{block.label}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => handleEditTimeBlock(block)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Edit time block"
        >
          <Edit2 className="w-4 h-4 text-gray-600" />
        </button>
        <button
          onClick={() => handleDeleteTimeBlock(block.id)}
          className="p-2 hover:bg-red-50 rounded-lg transition-colors"
          title="Delete time block"
        >
          <Trash2 className="w-4 h-4 text-red-600" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in space-y-8">
      {/* ===== VENUES SECTION ===== */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-serif text-3xl text-gray-900">Venues & Locations</h2>
          <button
            onClick={handleAddVenue}
            className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Venue
          </button>
        </div>

        {showVenueForm && renderVenueForm()}

        {venues.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No venues added yet. Click "Add Venue" to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {venues.map((venue) => renderVenueCard(venue))}
          </div>
        )}
      </section>

      {/* ===== TIMELINE SECTION ===== */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-serif text-3xl text-gray-900">Day-of Timeline</h2>
          <button
            onClick={handleAddTimeBlock}
            className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Time Block
          </button>
        </div>

        {showTimeBlockForm && renderTimeBlockForm()}

        {timeline.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">
              No timeline blocks added yet. Click "Add Time Block" to create your day-of schedule.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {timeline.map((block) => renderTimeBlockCard(block))}
          </div>
        )}
      </section>
    </div>
  );
};

// ===== VENUE FORM MODAL COMPONENT =====

interface VenueFormModalProps {
  venue: VenueLocation;
  onSave: (venue: VenueLocation) => void;
  onCancel: () => void;
}

const VenueFormModal: React.FC<VenueFormModalProps> = ({ venue, onSave, onCancel }) => {
  const [formData, setFormData] = useState(venue);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h3 className="font-serif text-2xl text-gray-900">
            {venue.id && venue.name ? 'Edit Venue' : 'Add New Venue'}
          </h3>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Venue Name */}
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Venue Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Grand Ballroom"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                required
              />
            </div>

            {/* Address */}
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="123 Main St, City, State 12345"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            {/* Capacity */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Capacity (guests)
              </label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                placeholder="150"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            {/* Contact */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Contact
              </label>
              <input
                type="text"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                placeholder="Phone or Email"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            {/* Website */}
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Website
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            {/* Contract Status */}
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Contract Status
              </label>
              <input
                type="text"
                name="contractStatus"
                value={formData.contractStatus}
                onChange={handleChange}
                placeholder="e.g., Signed, Pending, Negotiating"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            {/* Parking Notes */}
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Parking Notes
              </label>
              <textarea
                name="parkingNotes"
                value={formData.parkingNotes}
                onChange={handleChange}
                placeholder="Describe parking availability, costs, or restrictions..."
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            {/* Accessibility Notes */}
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Accessibility Notes
              </label>
              <textarea
                name="accessibilityNotes"
                value={formData.accessibilityNotes}
                onChange={handleChange}
                placeholder="Wheelchair access, restroom locations, parking for disabled guests..."
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            {/* Guest Directions & Lodging */}
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Guest Directions & Lodging Notes
              </label>
              <textarea
                name="directionsNotes"
                value={formData.directionsNotes}
                onChange={handleChange}
                placeholder="Directions for guests, recommended hotels, parking tips..."
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            {/* General Notes */}
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                General Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Any additional notes about the venue..."
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-rose-600 rounded-lg hover:bg-rose-700 transition-colors"
            >
              Save Venue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ===== TIME BLOCK FORM MODAL COMPONENT =====

interface TimeBlockFormModalProps {
  timeBlock: TimeBlock;
  onSave: (block: TimeBlock) => void;
  onCancel: () => void;
}

const TimeBlockFormModal: React.FC<TimeBlockFormModalProps> = ({
  timeBlock,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState(timeBlock);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h3 className="font-serif text-2xl text-gray-900">
            {timeBlock.id ? 'Edit Time Block' : 'Add Time Block'}
          </h3>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Time */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Time *
            </label>
            <input
              type="text"
              name="time"
              value={formData.time}
              onChange={handleChange}
              placeholder="3:00 PM"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
              required
            />
          </div>

          {/* Label */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Event Label *
            </label>
            <input
              type="text"
              name="label"
              value={formData.label}
              onChange={handleChange}
              placeholder="e.g., Ceremony, Cocktail Hour, Reception"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
              required
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-rose-600 rounded-lg hover:bg-rose-700 transition-colors"
            >
              Save Time Block
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VenuePlanner;
