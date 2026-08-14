import { useState, useEffect, useRef, useCallback } from 'react';
import { getAllReminders, saveReminder, removeReminder } from '../utils/reminderStorage';

const TICK_MS = 15000;

export function useTaskReminders(todos) {
  const [queue, setQueue] = useState([]);
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      const reminders = getAllReminders();
      const now = Date.now();

      Object.entries(reminders).forEach(([todoId, r]) => {
        const todo = todos.find((t) => String(t.id) === String(todoId));

        if (!todo || todo.status === 'completed') {
          removeReminder(todoId);
          return;
        }

        if (r.nextTrigger && now >= r.nextTrigger) {
          setQueue((prev) => {
            if (prev.some((q) => q.todoId === todoId)) return prev;
            return [...prev, { todoId, title: todo.title }];
          });
          saveReminder(todoId, { ...r, nextTrigger: now + r.intervalMinutes * 60000 });
        }
      });
    }, TICK_MS);

    return () => clearInterval(intervalRef.current);
  }, [todos]);

  const dismissCurrent = useCallback(() => {
    setQueue((prev) => prev.slice(1));
  }, []);

  const snoozeCurrent = useCallback((minutes = 5) => {
    setQueue((prev) => {
      if (prev.length === 0) return prev;
      const [current, ...rest] = prev;
      const r = getAllReminders()[current.todoId];
      if (r) {
        saveReminder(current.todoId, { ...r, nextTrigger: Date.now() + minutes * 60000 });
      }
      return rest;
    });
  }, []);

  const clearCurrent = useCallback(() => {
    setQueue((prev) => {
      if (prev.length === 0) return prev;
      const [current, ...rest] = prev;
      removeReminder(current.todoId);
      return rest;
    });
  }, []);

  return { activeReminder: queue[0] || null, dismissCurrent, snoozeCurrent, clearCurrent };
}