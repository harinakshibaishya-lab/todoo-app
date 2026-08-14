import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Plus, ListTodo, CheckCircle2, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { getTodos, updateTodo } from '../services/todoService';
import AddTodoModal from '../components/AddTodoModal';
import TodoCard from '../components/TodoCard';
import ReminderPopup from '../components/ReminderPopup';
import { useTaskReminders } from '../hooks/useTaskReminders';

function Dashboard() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));

  const { activeReminder, dismissCurrent, snoozeCurrent, clearCurrent } = useTaskReminders(todos);

  const fetchTodos = async () => {
    setLoading(true);
    try {
      const data = await getTodos();
      setTodos(data);
    } catch {
      toast.error('Failed to load todos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const data = await getTodos();
        if (!ignore) setTodos(data);
      } catch {
        if (!ignore) toast.error('Failed to load todos');
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => { ignore = true; };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const openAddModal = () => {
    setEditingTodo(null);
    setIsModalOpen(true);
  };

  const openEditModal = (todo) => {
    setEditingTodo(todo);
    setIsModalOpen(true);
  };

  const handleReminderDone = async () => {
    const todo = todos.find((t) => String(t.id) === String(activeReminder.todoId));
    if (todo) {
      try {
        await updateTodo(todo.id, { ...todo, status: 'completed' });
        fetchTodos();
        toast.success('Marked complete!');
      } catch {
        toast.error('Failed to update');
      }
    }
    clearCurrent();
  };

  const handleReminderSnooze = () => {
    snoozeCurrent(5);
    toast('Snoozed for 5 minutes', { icon: '⏰' });
  };

  const completedCount = todos.filter((t) => t.status === 'completed').length;
  const pendingCount = todos.filter((t) => t.status !== 'completed').length;
  const highPriorityCount = todos.filter((t) => t.priority === 'high' && t.status !== 'completed').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-950 p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8 max-w-5xl mx-auto"
      >
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Hey, {user?.name} 👋</h1>
          <p className="text-gray-400 text-sm sm:text-base">Here's what's on your list</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition self-start sm:self-auto"
        >
          <LogOut size={18} />
          Logout
        </button>
      </motion.div>

      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-3 sm:gap-4 mb-6"
        >
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-3 sm:p-4">
            <div className="flex items-center gap-2 text-purple-400 mb-1">
              <ListTodo size={16} />
              <span className="text-xs sm:text-sm text-gray-400">Pending</span>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-white">{pendingCount}</p>
          </div>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-3 sm:p-4">
            <div className="flex items-center gap-2 text-green-400 mb-1">
              <CheckCircle2 size={16} />
              <span className="text-xs sm:text-sm text-gray-400">Completed</span>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-white">{completedCount}</p>
          </div>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-3 sm:p-4">
            <div className="flex items-center gap-2 text-red-400 mb-1">
              <Clock size={16} />
              <span className="text-xs sm:text-sm text-gray-400">Urgent</span>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-white">{highPriorityCount}</p>
          </div>
        </motion.div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium px-4 py-2.5 rounded-lg hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition mb-6"
        >
          <Plus size={18} />
          Add Todo
        </button>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 h-20 animate-pulse" />
            ))}
          </div>
        ) : todos.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <p className="text-5xl mb-4">📝</p>
            <p className="text-gray-400">No todos yet. Add your first one!</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <AnimatePresence>
              {todos.map((todo) => (
                <motion.div
                  key={todo.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <TodoCard todo={todo} onChanged={fetchTodos} onEdit={openEditModal} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <AddTodoModal
        key={editingTodo ? editingTodo.id : 'new'}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onTodoAdded={fetchTodos}
        editingTodo={editingTodo}
      />

      <ReminderPopup
        reminder={activeReminder}
        onDone={handleReminderDone}
        onSnooze={handleReminderSnooze}
        onDismiss={dismissCurrent}
      />
    </div>
  );
}

export default Dashboard;