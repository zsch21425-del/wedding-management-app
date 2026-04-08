import { ChecklistTask, TimeBucket } from '../types';

let _id = 0;
const t = (timeBucket: TimeBucket, task: string, completed = false): ChecklistTask => ({
  id: `ck-${++_id}`,
  task,
  notes: '',
  assignee: 'Me',
  dueDate: '',
  completed,
  timeBucket,
});

export const defaultChecklist: ChecklistTask[] = [
  // 12+ Months Out
  t('12+ Months Out', 'Set a wedding budget', true),
  t('12+ Months Out', 'Create a guest list draft', true),
  t('12+ Months Out', 'Research and book venue', true),
  t('12+ Months Out', 'Choose wedding date'),
  t('12+ Months Out', 'Hire a wedding planner (if desired)'),
  t('12+ Months Out', 'Start researching photographers'),

  // 9-12 Months Out
  t('9-12 Months Out', 'Book photographer and videographer', true),
  t('9-12 Months Out', 'Book caterer or confirm venue catering'),
  t('9-12 Months Out', 'Choose wedding party members'),
  t('9-12 Months Out', 'Start shopping for wedding dress'),
  t('9-12 Months Out', 'Book officiant'),
  t('9-12 Months Out', 'Research florists'),

  // 6-9 Months Out
  t('6-9 Months Out', 'Book florist', true),
  t('6-9 Months Out', 'Book DJ or band'),
  t('6-9 Months Out', 'Order save-the-dates'),
  t('6-9 Months Out', 'Plan honeymoon destination'),
  t('6-9 Months Out', 'Register for gifts'),
  t('6-9 Months Out', 'Schedule cake tastings'),

  // 4-6 Months Out
  t('4-6 Months Out', 'Book hair and makeup artist'),
  t('4-6 Months Out', 'Order wedding invitations'),
  t('4-6 Months Out', 'Plan ceremony details'),
  t('4-6 Months Out', 'Arrange transportation'),
  t('4-6 Months Out', 'Book rehearsal dinner venue'),

  // 2-4 Months Out
  t('2-4 Months Out', 'Send invitations'),
  t('2-4 Months Out', 'Finalize menu with caterer'),
  t('2-4 Months Out', 'Order wedding cake'),
  t('2-4 Months Out', 'Purchase wedding bands'),
  t('2-4 Months Out', 'Plan seating chart (first draft)'),

  // 1-2 Months Out
  t('1-2 Months Out', 'Final dress fitting'),
  t('1-2 Months Out', 'Confirm all vendor contracts'),
  t('1-2 Months Out', 'Create day-of timeline'),
  t('1-2 Months Out', 'Apply for marriage license'),
  t('1-2 Months Out', 'Write vows'),

  // 2-4 Weeks Out
  t('2-4 Weeks Out', 'Confirm final guest count with caterer'),
  t('2-4 Weeks Out', 'Finalize seating chart'),
  t('2-4 Weeks Out', 'Create final day-of timeline for wedding party'),
  t('2-4 Weeks Out', 'Break in wedding shoes'),

  // 1 Week Out
  t('1 Week Out', 'Confirm all vendor arrival times'),
  t('1 Week Out', 'Pack for honeymoon'),
  t('1 Week Out', 'Prepare vendor payments and tips'),
  t('1 Week Out', 'Attend rehearsal and rehearsal dinner'),

  // Day Before
  t('Day Before', 'Deliver final items to venue'),
  t('Day Before', 'Lay out wedding day outfit and accessories'),
  t('Day Before', 'Get a good night\'s sleep!'),

  // Day Of
  t('Day Of', 'Eat breakfast!'),
  t('Day Of', 'Hair and makeup'),
  t('Day Of', 'Exchange gifts with partner'),
  t('Day Of', 'Enjoy every moment!'),
];
