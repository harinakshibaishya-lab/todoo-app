const REMINDER_KEY = 'todo_reminders';

export function getAllReminders() {
  try {
    const raw = localStorage.getItem(REMINDER_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveReminder(todoId, settings) {
  const all = getAllReminders();
  all[todoId] = settings;
  localStorage.setItem(REMINDER_KEY, JSON.stringify(all));
}

export function removeReminder(todoId) {
  const all = getAllReminders();
  delete all[todoId];
  localStorage.setItem(REMINDER_KEY, JSON.stringify(all));
}

export function getReminder(todoId) {
  return getAllReminders()[todoId] || null;
}