import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { createTodo, updateTodo } from '../services/todoService';
import { saveReminder, removeReminder, getReminder } from '../utils/reminderStorage';

function AddTodoModal({ isOpen, onClose, onTodoAdded, editingTodo }) {
  const [title, setTitle] = useState(editingTodo?.title || '');
  const [description, setDescription] = useState(editingTodo?.description || '');
  const [priority, setPriority] = useState(editingTodo?.priority || 'medium');
  const [dueDate, setDueDate] = useState(editingTodo?.due_date ? editingTodo.due_date.split('T')[0] : '');
  const [loading, setLoading] = useState(false);

  const existingReminder = editingTodo ? getReminder(editingTodo.id) : null;
  const [reminderInterval, setReminderInterval] = useState(
    existingReminder ? String(existingReminder.intervalMinutes) : 'none'
  );
  const [customMinutes, setCustomMinutes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let todoId = editingTodo?.id;

      if (editingTodo) {
        await updateTodo(editingTodo.id, {
          ...editingTodo,
          title,
          description,
          priority,
          due_date: dueDate || null,
        });
        toast.success('Todo updated!');
      } else {
        const result = await createTodo({ title, description, priority, due_date: dueDate || null });
        todoId = result.todoId;
        toast.success('Todo created!');
      }

      if (reminderInterval === 'none') {
        removeReminder(todoId);
      } else {
        const minutes = reminderInterval === 'custom' ? Number(customMinutes) : Number(reminderInterval);
        if (minutes > 0) {
          saveReminder(todoId, {
            intervalMinutes: minutes,
            nextTrigger: Date.now() + minutes * 60000,
          });
        }
      }

      onTodoAdded();
      onClose();
    } catch (error) {
      const message = error.response?.data?.message || 'Something went wrong';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 border border-white/10 rounded-2xl shadow-2xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">{editingTodo ? 'Edit Todo' : 'New Todo'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add more details (optional)"
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="low" className="bg-gray-900">Low</option>
                <option value="medium" className="bg-gray-900">Medium</option>
                <option value="high" className="bg-gray-900">High</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Reminder</label>
            <select
              value={reminderInterval}
              onChange={(e) => setReminderInterval(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="none" className="bg-gray-900">No reminder</option>
              <option value="2" className="bg-gray-900">Every 2 minutes</option>
              <option value="5" className="bg-gray-900">Every 5 minutes</option>
              <option value="10" className="bg-gray-900">Every 10 minutes</option>
              <option value="custom" className="bg-gray-900">Custom</option>
            </select>

            {reminderInterval === 'custom' && (
              <input
                type="number"
                min="1"
                value={customMinutes}
                onChange={(e) => setCustomMinutes(e.target.value)}
                placeholder="Minutes"
                className="w-full mt-2 bg-white/5 border border-white/10 rounded-lg py-2.5 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-3 rounded-lg hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                {editingTodo ? 'Updating...' : 'Creating...'}
              </>
            ) : editingTodo ? 'Update Todo' : 'Create Todo'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddTodoModal;