import { useState } from 'react';
import { Pencil, Trash2, Check, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { deleteTodo, updateTodo } from '../services/todoService';

const priorityColors = {
  low: 'bg-green-500/20 text-green-400 border-green-500/30',
  medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  high: 'bg-red-500/20 text-red-400 border-red-500/30',
};

function TodoCard({ todo, onChanged, onEdit }) {
  const [busy, setBusy] = useState(false);

  const toggleStatus = async () => {
    setBusy(true);
    try {
      const newStatus = todo.status === 'completed' ? 'pending' : 'completed';
      await updateTodo(todo.id, {
        title: todo.title,
        description: todo.description,
        priority: todo.priority,
        status: newStatus,
        due_date: todo.due_date ? todo.due_date.split('T')[0] : null,
      });
      toast.success(newStatus === 'completed' ? 'Marked complete!' : 'Marked pending');
      onChanged();
    } catch (error) {
      console.log('UPDATE ERROR:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Failed to update');
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this todo?')) return;
    setBusy(true);
    try {
      await deleteTodo(todo.id);
      toast.success('Todo deleted');
      onChanged();
    } catch {
      toast.error('Failed to delete');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 flex items-start gap-3 hover:border-white/20 transition">
      {/* Checkbox */}
      <button
        onClick={toggleStatus}
        disabled={busy}
        title={todo.status === 'completed' ? 'Mark as pending' : 'Mark as complete'}
        className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all duration-200 ${
          todo.status === 'completed'
            ? 'bg-purple-600 border-purple-600'
            : 'border-gray-600 hover:border-purple-400'
        }`}
      >
        {todo.status === 'completed' && <Check size={12} className="text-white" strokeWidth={3} />}
      </button>

      <div className="flex-1 min-w-0">
        <h3 className={`font-semibold text-sm sm:text-base ${todo.status === 'completed' ? 'text-gray-500 line-through' : 'text-white'}`}>
          {todo.title}
        </h3>
        {todo.description && (
          <p className="text-gray-400 text-xs sm:text-sm mt-1">{todo.description}</p>
        )}
        <div className="flex items-center gap-2 mt-3 flex-wrap">
          <span className={`text-xs px-2 py-0.5 rounded-full border ${priorityColors[todo.priority]}`}>
            {todo.priority}
          </span>
          {todo.due_date && (
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <Clock size={12} />
              {new Date(todo.due_date).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>

      <div className="flex gap-2 shrink-0">
        <button onClick={() => onEdit(todo)} className="text-gray-400 hover:text-white transition">
          <Pencil size={16} />
        </button>
        <button onClick={handleDelete} className="text-gray-400 hover:text-red-400 transition">
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}

export default TodoCard;