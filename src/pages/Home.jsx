import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import MainFeature from '../components/MainFeature';
import getIcon from '../utils/iconUtils';

function Home() {
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    overdue: 0
  });
  
  const ClipboardListIcon = getIcon('ClipboardList');
  const CheckCircleIcon = getIcon('CheckCircle');
  const ClockIcon = getIcon('Clock');
  const AlertCircleIcon = getIcon('AlertCircle');
  
  useEffect(() => {
    // Update stats whenever task list changes
    const updateStats = () => {
      // We'd typically get this from a task list, but for the MVP we'll just use local storage
      const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
      
      const completed = tasks.filter(task => task.status === 'completed').length;
      const pending = tasks.filter(task => task.status === 'pending').length;
      const overdue = tasks.filter(task => {
        if (!task.dueDate || task.status === 'completed') return false;
        return new Date(task.dueDate) < new Date();
      }).length;
      
      setStats({
        total: tasks.length,
        completed,
        pending,
        overdue
      });
    };
    
    updateStats();
    
    // Listen for storage events to update stats when tasks change
    window.addEventListener('storage', updateStats);
    
    // Custom event for task updates within the same window
    window.addEventListener('tasksUpdated', updateStats);
    
    return () => {
      window.removeEventListener('storage', updateStats);
      window.removeEventListener('tasksUpdated', updateStats);
    };
  }, []);

  const welcomeMessage = () => {
    const hour = new Date().getHours();
    
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const today = format(new Date(), 'EEEE, MMMM d, yyyy');
  
  return (
    <div className="space-y-6">
      <section className="mb-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-2"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-surface-900 dark:text-surface-50">
            {welcomeMessage()}!
          </h1>
          <p className="text-surface-600 dark:text-surface-400 mt-1">
            {today}
          </p>
        </motion.div>
      </section>

      <section className="mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="card p-5 bg-gradient-to-br from-primary-light/10 to-primary/5 dark:from-primary/20 dark:to-primary-dark/10"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-surface-600 dark:text-surface-300 text-sm font-medium">Total Tasks</p>
                <h3 className="text-2xl md:text-3xl font-bold mt-1">{stats.total}</h3>
              </div>
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary/10 dark:bg-primary/20 text-primary">
                <ClipboardListIcon size={20} />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="card p-5 bg-gradient-to-br from-green-100 to-green-50 dark:from-green-900/20 dark:to-green-800/10"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-surface-600 dark:text-surface-300 text-sm font-medium">Completed</p>
                <h3 className="text-2xl md:text-3xl font-bold mt-1">{stats.completed}</h3>
              </div>
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-green-500/10 dark:bg-green-500/20 text-green-500">
                <CheckCircleIcon size={20} />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="card p-5 bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/20 dark:to-blue-800/10"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-surface-600 dark:text-surface-300 text-sm font-medium">Pending</p>
                <h3 className="text-2xl md:text-3xl font-bold mt-1">{stats.pending}</h3>
              </div>
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-500/10 dark:bg-blue-500/20 text-blue-500">
                <ClockIcon size={20} />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="card p-5 bg-gradient-to-br from-red-100 to-red-50 dark:from-red-900/20 dark:to-red-800/10"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-surface-600 dark:text-surface-300 text-sm font-medium">Overdue</p>
                <h3 className="text-2xl md:text-3xl font-bold mt-1">{stats.overdue}</h3>
              </div>
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-red-500/10 dark:bg-red-500/20 text-red-500">
                <AlertCircleIcon size={20} />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <MainFeature />
    </div>
  );
}

export default Home;