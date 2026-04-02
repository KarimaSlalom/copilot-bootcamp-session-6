/**
 * Returns true if the given todo is overdue:
 * incomplete AND dueDate is a valid date strictly before today (local calendar date).
 *
 * @param {string|null} dueDate - ISO date string (YYYY-MM-DD) or null/undefined
 * @param {boolean|number} completed - truthy = done
 * @returns {boolean}
 */
export function isOverdue(dueDate, completed) {
  if (completed) return false;
  if (!dueDate) return false;

  const due = new Date(dueDate);
  if (isNaN(due.getTime())) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return due < today;
}
