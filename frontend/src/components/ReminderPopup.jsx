import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Clock } from 'lucide-react';
import SpiderHero from './SpiderHero';

function ReminderPopup({ reminder, onDone, onSnooze, onDismiss }) {
  return (
    <AnimatePresence>
      {reminder && (
        <motion.div
          key={reminder.todoId}
          initial={{ x: 300, y: -100, opacity: 0, rotate: 15 }}
          animate={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
          exit={{ x: 300, y: -50, opacity: 0, rotate: 10, transition: { duration: 0.3 } }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          className="fixed top-6 right-6 z-[100] w-full max-w-xs sm:max-w-sm"
        >
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-white/10 rounded-2xl shadow-2xl shadow-red-500/10 p-4 flex gap-3 items-start">
            <div className="shrink-0 -mt-2 -ml-1">
              <SpiderHero />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm leading-snug">Hey! Don't forget to complete:</p>
              <p className="text-purple-300 font-bold text-sm mt-0.5 truncate">{reminder.title}</p>
              <div className="flex gap-2 mt-3">
                <button onClick={onDone} className="flex items-center gap-1 bg-green-600/20 text-green-400 border border-green-600/30 px-2.5 py-1 rounded-lg text-xs font-medium hover:bg-green-600/30 transition">
                  <Check size={12} /> Done
                </button>
                <button onClick={onSnooze} className="flex items-center gap-1 bg-white/5 text-gray-300 border border-white/10 px-2.5 py-1 rounded-lg text-xs font-medium hover:bg-white/10 transition">
                  <Clock size={12} /> Snooze
                </button>
                <button onClick={onDismiss} className="flex items-center gap-1 text-gray-500 px-2 py-1 rounded-lg text-xs hover:text-gray-300 transition">
                  <X size={12} />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ReminderPopup;