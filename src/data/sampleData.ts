/* ══════════════════════════════════════════════════
 * Sample Data — Pre-populated so the app feels alive on first load
 * ══════════════════════════════════════════════════ */
import { Guest, Vendor, BudgetItem, WeddingSettings, DashboardTodo, VenueLocation, TimeBlock } from '../types';

// ── 10 Sample Guests ──
export const sampleGuests: Guest[] = [
  { id: 'g1', name: 'Sarah Mitchell', email: 'sarah.m@email.com', phone: '(555) 123-4567', relationship: 'Family', rsvpStatus: 'Confirmed', mealPreference: 'Chicken', dietaryRestrictions: '', tableAssignment: 1, notes: 'Bride\'s sister' },
  { id: 'g2', name: 'James Mitchell', email: 'james.m@email.com', phone: '(555) 123-4568', relationship: 'Family', rsvpStatus: 'Confirmed', mealPreference: 'Beef', dietaryRestrictions: '', tableAssignment: 1, notes: 'Bride\'s father' },
  { id: 'g3', name: 'Emily Chen', email: 'emily.c@email.com', phone: '(555) 234-5678', relationship: 'Friend', rsvpStatus: 'Confirmed', mealPreference: 'Vegetarian', dietaryRestrictions: 'Gluten-free', tableAssignment: 3, notes: 'College roommate' },
  { id: 'g4', name: 'Marcus Johnson', email: 'marcus.j@email.com', phone: '(555) 345-6789', relationship: 'Friend', rsvpStatus: 'Pending', mealPreference: 'Beef', dietaryRestrictions: '', tableAssignment: 3, notes: 'Best man' },
  { id: 'g5', name: 'Rachel Kim', email: 'rachel.k@email.com', phone: '(555) 456-7890', relationship: 'Colleague', rsvpStatus: 'Confirmed', mealPreference: 'Vegan', dietaryRestrictions: 'Nut allergy', tableAssignment: 5, notes: '' },
  { id: 'g6', name: 'David Thompson', email: 'david.t@email.com', phone: '(555) 567-8901', relationship: 'Family', rsvpStatus: 'Declined', mealPreference: 'Chicken', dietaryRestrictions: '', tableAssignment: null, notes: 'Will be traveling abroad' },
  { id: 'g7', name: 'Olivia Parker', email: 'olivia.p@email.com', phone: '(555) 678-9012', relationship: 'Friend', rsvpStatus: 'Confirmed', mealPreference: 'Chicken', dietaryRestrictions: '', tableAssignment: 4, notes: 'Maid of honor' },
  { id: 'g8', name: 'Liam Rodriguez', email: 'liam.r@email.com', phone: '(555) 789-0123', relationship: 'Plus-One', rsvpStatus: 'Pending', mealPreference: 'Beef', dietaryRestrictions: '', tableAssignment: 4, notes: 'Olivia\'s +1' },
  { id: 'g9', name: 'Sophia Wang', email: 'sophia.w@email.com', phone: '(555) 890-1234', relationship: 'Colleague', rsvpStatus: 'No Response', mealPreference: 'Vegetarian', dietaryRestrictions: '', tableAssignment: null, notes: 'Works in marketing dept' },
  { id: 'g10', name: 'Noah & Emma Davis', email: 'davis.family@email.com', phone: '(555) 901-2345', relationship: 'Family', rsvpStatus: 'Confirmed', mealPreference: 'Kids Meal', dietaryRestrictions: '', tableAssignment: 2, notes: 'Partner\'s cousins, bringing 2 kids' },
];

// ── 4 Sample Vendors ──
export const sampleVendors: Vendor[] = [
  {
    id: 'v1', businessName: 'Rosewood Estate', category: 'Venue', contactName: 'Margaret Hayes',
    phone: '(555) 100-2000', email: 'events@rosewoodvenue.com', website: 'https://rosewoodvenue.com',
    contractStatus: 'Booked', contractFile: 'rosewood-contract.pdf', totalCost: 12000,
    depositPaid: 6000, balanceDue: 6000, paymentDueDate: '2026-09-01', notes: 'Includes ceremony garden + ballroom reception. 150 max capacity.',
  },
  {
    id: 'v2', businessName: 'Capture the Light Photography', category: 'Photographer', contactName: 'Alex Rivera',
    phone: '(555) 200-3000', email: 'alex@capturethelight.com', website: 'https://capturethelight.com',
    contractStatus: 'Booked', contractFile: 'photography-contract.pdf', totalCost: 4500,
    depositPaid: 1500, balanceDue: 3000, paymentDueDate: '2026-10-01', notes: '8-hour coverage, 2 photographers, engagement shoot included.',
  },
  {
    id: 'v3', businessName: 'Bloom & Vine Florals', category: 'Florist', contactName: 'Patricia Nguyen',
    phone: '(555) 300-4000', email: 'hello@bloomandvine.com', website: 'https://bloomandvine.com',
    contractStatus: 'Proposal Received', contractFile: '', totalCost: 3200,
    depositPaid: 0, balanceDue: 3200, paymentDueDate: '2026-08-15', notes: 'Proposal includes bridal bouquet, 10 centerpieces, ceremony arch, boutonnieres.',
  },
  {
    id: 'v4', businessName: 'BeatDrop Entertainment', category: 'DJ/Band', contactName: 'Jordan Cole',
    phone: '(555) 400-5000', email: 'bookings@beatdropent.com', website: 'https://beatdropent.com',
    contractStatus: 'Contacted', contractFile: '', totalCost: 2000,
    depositPaid: 0, balanceDue: 2000, paymentDueDate: '', notes: 'Waiting for availability confirmation for October date.',
  },
];

// ── Sample Budget (6 categories) ──
export const sampleBudget: BudgetItem[] = [
  { id: 'b1', category: 'Venue', estimated: 12000, actual: 12000, paid: 6000 },
  { id: 'b2', category: 'Catering', estimated: 8000, actual: 0, paid: 0 },
  { id: 'b3', category: 'Photography', estimated: 5000, actual: 4500, paid: 1500 },
  { id: 'b4', category: 'Florals', estimated: 3500, actual: 3200, paid: 0 },
  { id: 'b5', category: 'Music/DJ', estimated: 2500, actual: 2000, paid: 0 },
  { id: 'b6', category: 'Attire', estimated: 3000, actual: 0, paid: 0 },
  { id: 'b7', category: 'Videography', estimated: 0, actual: 0, paid: 0 },
  { id: 'b8', category: 'Hair & Makeup', estimated: 0, actual: 0, paid: 0 },
  { id: 'b9', category: 'Invitations & Stationery', estimated: 0, actual: 0, paid: 0 },
  { id: 'b10', category: 'Transportation', estimated: 0, actual: 0, paid: 0 },
  { id: 'b11', category: 'Cake & Desserts', estimated: 0, actual: 0, paid: 0 },
  { id: 'b12', category: 'Décor & Rentals', estimated: 0, actual: 0, paid: 0 },
  { id: 'b13', category: 'Officiant', estimated: 0, actual: 0, paid: 0 },
  { id: 'b14', category: 'Honeymoon', estimated: 0, actual: 0, paid: 0 },
  { id: 'b15', category: 'Miscellaneous', estimated: 0, actual: 0, paid: 0 },
];

// ── Default Settings ──
export const defaultSettings: WeddingSettings = {
  weddingDate: '2026-10-17',
  bride: 'Zach',
  partner: 'Partner',
  weddingTitle: 'Our Wedding',
  totalBudget: 40000,
};

// ── Dashboard Todos ──
export const sampleDashboardTodos: DashboardTodo[] = [
  { id: 'dt1', text: 'Finalize florist proposal', completed: false },
  { id: 'dt2', text: 'Schedule cake tasting appointment', completed: false },
  { id: 'dt3', text: 'Send save-the-dates', completed: true },
  { id: 'dt4', text: 'Book DJ for reception', completed: false },
  { id: 'dt5', text: 'Research honeymoon destinations', completed: false },
];

// ── Sample Venue Locations ──
export const sampleVenues: VenueLocation[] = [
  {
    id: 'vl1', type: 'ceremony', name: 'Rosewood Estate — Garden',
    address: '1234 Rosewood Lane, Napa Valley, CA 94558', capacity: 150,
    contact: 'Margaret Hayes — (555) 100-2000', website: 'https://rosewoodvenue.com',
    contractStatus: 'Booked', parkingNotes: 'Complimentary valet parking for up to 80 cars',
    accessibilityNotes: 'Wheelchair-accessible paths through garden',
    directionsNotes: 'Take Hwy 29 N, exit Rosewood Lane. 90 min from SF.',
    notes: 'Outdoor ceremony in the rose garden. Backup indoor space available for rain.',
  },
  {
    id: 'vl2', type: 'reception', name: 'Rosewood Estate — Grand Ballroom',
    address: '1234 Rosewood Lane, Napa Valley, CA 94558', capacity: 150,
    contact: 'Margaret Hayes — (555) 100-2000', website: 'https://rosewoodvenue.com',
    contractStatus: 'Booked', parkingNotes: 'Same lot as ceremony',
    accessibilityNotes: 'Elevator access to ballroom on 2nd floor',
    directionsNotes: 'Same location as ceremony venue',
    notes: 'Crystal chandeliers, hardwood dance floor, floor-to-ceiling windows.',
  },
];

// ── Sample Day-of Timeline ──
export const sampleTimeline: TimeBlock[] = [
  { id: 'tb1', time: '12:00 PM', label: 'Bridal party hair & makeup begins' },
  { id: 'tb2', time: '2:00 PM', label: 'First look & couple photos' },
  { id: 'tb3', time: '3:00 PM', label: 'Wedding party photos' },
  { id: 'tb4', time: '4:00 PM', label: 'Ceremony' },
  { id: 'tb5', time: '4:45 PM', label: 'Cocktail hour' },
  { id: 'tb6', time: '5:45 PM', label: 'Grand entrance & first dance' },
  { id: 'tb7', time: '6:15 PM', label: 'Dinner service' },
  { id: 'tb8', time: '7:30 PM', label: 'Toasts & speeches' },
  { id: 'tb9', time: '8:00 PM', label: 'Cake cutting' },
  { id: 'tb10', time: '8:30 PM', label: 'Open dancing' },
  { id: 'tb11', time: '10:30 PM', label: 'Last dance & sparkler exit' },
];
