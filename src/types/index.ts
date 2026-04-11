// ── Color Scheme ──
export interface ColorScheme {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  extra?: string;
  isPreset?: boolean;
}

// ── Guest ──
export type RSVPStatus = 'Confirmed' | 'Declined' | 'Pending' | 'No Response';
export type MealPreference = 'Beef' | 'Chicken' | 'Vegetarian' | 'Vegan' | 'Kids Meal';
export type Relationship = 'Family' | 'Friend' | 'Colleague' | 'Plus-One';

export interface Guest {
  id: string;
  name: string;
  email: string;
  phone: string;
  relationship: Relationship;
  rsvpStatus: RSVPStatus;
  mealPreference: MealPreference;
  dietaryRestrictions: string;
  tableAssignment: number | null;
  notes: string;
}

// ── Vendor ──
export type VendorCategory =
  | 'Venue' | 'Caterer' | 'Photographer' | 'Videographer'
  | 'Florist' | 'DJ/Band' | 'Hair & Makeup' | 'Wedding Planner'
  | 'Officiant' | 'Transportation' | 'Cake' | 'Invitations'
  | 'Lighting' | 'Rentals' | 'Other';

export type ContractStatus =
  | 'Contacted' | 'Proposal Received' | 'Booked' | 'Paid in Full' | 'Cancelled';

export interface Vendor {
  id: string;
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
  balanceDue: number;
  paymentDueDate: string;
  notes: string;
}

// ── Budget ──
export type BudgetCategory =
  | 'Venue' | 'Catering' | 'Photography' | 'Videography'
  | 'Florals' | 'Music/DJ' | 'Attire' | 'Hair & Makeup'
  | 'Invitations & Stationery' | 'Transportation'
  | 'Cake & Desserts' | 'D\u00e9cor & Rentals' | 'Officiant'
  | 'Honeymoon' | 'Miscellaneous';

export interface BudgetItem {
  id: string;
  category: BudgetCategory;
  estimated: number;
  actual: number;
  paid: number;
}

// ── Checklist ──
export type Assignee = 'Me' | 'Partner' | 'Planner' | 'Family';
export type TimeBucket =
  | '12+ Months Out' | '9-12 Months Out' | '6-9 Months Out'
  | '4-6 Months Out' | '2-4 Months Out' | '1-2 Months Out'
  | '2-4 Weeks Out' | '1 Week Out' | 'Day Before' | 'Day Of';

export interface ChecklistTask {
  id: string;
  task: string;
  notes: string;
  assignee: Assignee;
  dueDate: string;
  completed: boolean;
  timeBucket: TimeBucket;
}

// ── Venue ──
export interface VenueLocation {
  id: string;
  type: 'ceremony' | 'reception';
  name: string;
  address: string;
  capacity: number;
  contact: string;
  website: string;
  contractStatus: string;
  parkingNotes: string;
  accessibilityNotes: string;
  directionsNotes: string;
  notes: string;
}

export interface TimeBlock {
  id: string;
  time: string;
  label: string;
}

// ── Trends / Articles ──
export type ArticleCategory = 'Trends' | 'Budget Tips' | 'D\u00e9cor' | 'Food & Drink' | 'Attire' | 'Venues' | 'Entertainment';

export interface Article {
  id: string;
  title: string;
  summary: string;
  category: ArticleCategory;
  url: string;
  gradient: string;
}

// ── Inspiration Board ──
export type InspirationTag = 'Florals' | 'Venue' | 'Dress' | 'D\u00e9cor' | 'Food' | 'Cake' | 'Hair' | 'Invitations' | 'Color Scheme';

export interface InspirationImage {
  id: string;
  src: string;
  name: string;
  tags: InspirationTag[];
  pinned: boolean;
  overlayColor: string;
  overlayIntensity: number;
}

// ── Settings ──
export interface WeddingSettings {
  weddingDate: string;
  bride: string;
  partner: string;
  weddingTitle: string;
  totalBudget: number;
}

// ── Dashboard To-Do ──
export interface DashboardTodo {
  id: string;
  text: string;
  completed: boolean;
}

// ── App State ──
export type AppPage =
  | 'dashboard' | 'colors' | 'guests' | 'vendors'
  | 'budget' | 'checklist' | 'venue' | 'trends'
  | 'inspiration' | 'hiit' | 'settings';
