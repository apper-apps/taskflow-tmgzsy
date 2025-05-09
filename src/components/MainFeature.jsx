import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';

function MainFeature() {
  // Icons
  const PlusIcon = getIcon('Plus');
  const CalendarIcon = getIcon('Calendar');
  const FlagIcon = getIcon('Flag');
  const EditIcon = getIcon('Edit');
  const TrashIcon = getIcon('Trash');
  const CheckIcon = getIcon('Check');
  const XIcon = getIcon('X');

  // States
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: format(new Date(Date.now() + 86400000), 'yyyy-MM-dd'), // Tomorrow
    priority: 'medium',
    status: 'pending'
  });
  const [editingTask, setEditingTask] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('all');

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    setTasks(savedTasks);
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    
    // Dispatch a custom event to notify other components about the change
    window.dispatchEvent(new Event('tasksUpdated'));
  }, [tasks]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask(prev => ({ ...prev, [name]: value }));
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingTask(prev => ({ ...prev, [name]: value }));
  };

  const addTask = (e) => {
    e.preventDefault();
    
    if (!newTask.title.trim()) {
      toast.error("Task title cannot be empty!");
      return;
    }
    
    const task = {
      ...newTask,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    
    setTasks(prev => [task, ...prev]);
    setNewTask({
      title: '',
      description: '',
      dueDate: format(new Date(Date.now() + 86400000), 'yyyy-MM-dd'),
      priority: 'medium',
      status: 'pending'
    });
    
    setShowForm(false);
    toast.success("Task added successfully!");
  };

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(task => task.id !== id));
    toast.info("Task deleted");
  };

  const startEdit = (task) => {
    setEditingTask(task);
  };

  const cancelEdit = () => {
    setEditingTask(null);
  };

  const saveEdit = () => {
    if (!editingTask.title.trim()) {
      toast.error("Task title cannot be empty!");
      return;
    }
    
    setTasks(prev => 
      prev.map(task => task.id === editingTask.id ? editingTask : task)
    );
    
    setEditingTask(null);
    toast.success("Task updated!");
  };

  const toggleStatus = (id) => {
    setTasks(prev => 
      prev.map(task => {
        if (task.id === id) {
          const newStatus = task.status === 'completed' ? 'pending' : 'completed';
          toast.info(`Task marked as ${newStatus}`);
          return { ...task, status: newStatus };
        }
        return task;
      })
    );
  };

  // Get filtered tasks
  const getFilteredTasks = () => {
    switch (filter) {
      case 'completed':
        return tasks.filter(task => task.status === 'completed');
      case 'pending':
        return tasks.filter(task => task.status === 'pending');
      case 'high':
        return tasks.filter(task => task.priority === 'high');
      case 'overdue':
        return tasks.filter(task => {
          if (task.status === 'completed') return false;
          return new Date(task.dueDate) < new Date() && task.status !== 'completed';
        });
      default:
        return tasks;
    }
  };

  const filteredTasks = getFilteredTasks();

  // Get priority badge class
  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
    }
  };

  // Check if a task is overdue
  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date() ? 'text-red-500 dark:text-red-400' : '';
  };

  return (
    <section className="space-y-6 mb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">My Tasks</h2>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-auto">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="appearance-none w-full sm:w-44 py-2 pl-3 pr-10 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-800 text-surface-800 dark:text-surface-200 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Tasks</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="high">High Priority</option>
              <option value="overdue">Overdue</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-surface-700 dark:text-surface-300">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowForm(prev => !prev)}
            className="w-full sm:w-auto btn btn-primary flex items-center justify-center gap-2"
          >
            {showForm ? <XIcon size={18} /> : <PlusIcon size={18} />}
            {showForm ? "Cancel" : "Add New Task"}
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <form onSubmit={addTask} className="card p-5 mb-6 space-y-4">
              <h3 className="text-xl font-semibold mb-2">Create New Task</h3>
              
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={newTask.title}
                  onChange={handleInputChange}
                  className="input"
                  placeholder="Enter task title"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={newTask.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="input"
                  placeholder="Enter task description (optional)"
                ></textarea>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="dueDate" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                    Due Date
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <CalendarIcon size={16} className="text-surface-400" />
                    </div>
                    <input
                      type="date"
                      id="dueDate"
                      name="dueDate"
                      value={newTask.dueDate}
                      onChange={handleInputChange}
                      className="input pl-10"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="priority" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                    Priority
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FlagIcon size={16} className="text-surface-400" />
                    </div>
                    <select
                      id="priority"
                      name="priority"
                      value={newTask.priority}
                      onChange={handleInputChange}
                      className="input pl-10 appearance-none"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-surface-700 dark:text-surface-300">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end pt-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="btn btn-primary flex items-center gap-2"
                >
                  <PlusIcon size={18} />
                  Add Task
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-10"
          >
            <div className="mx-auto w-20 h-20 rounded-full bg-surface-100 dark:bg-surface-800 flex items-center justify-center mb-4">
              <ClipboardIcon className="w-10 h-10 text-surface-400" />
            </div>
            <h3 className="text-xl font-medium text-surface-700 dark:text-surface-300">No tasks found</h3>
            <p className="text-surface-500 dark:text-surface-400 mt-2">
              {filter !== 'all' 
                ? `No ${filter} tasks available. Try changing the filter or add a new task.`
                : "You don't have any tasks yet. Add your first task to get started!"}
            </p>
          </motion.div>
        ) : (
          <AnimatePresence>
            {filteredTasks.map(task => (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="card p-4 sm:p-5 hover:shadow-md dark:hover:bg-surface-700/50 transition-all duration-200"
              >
                {editingTask && editingTask.id === task.id ? (
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="edit-title" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                        Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="edit-title"
                        name="title"
                        value={editingTask.title}
                        onChange={handleEditChange}
                        className="input"
                        placeholder="Enter task title"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="edit-description" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                        Description
                      </label>
                      <textarea
                        id="edit-description"
                        name="description"
                        value={editingTask.description}
                        onChange={handleEditChange}
                        rows="2"
                        className="input"
                        placeholder="Enter task description (optional)"
                      ></textarea>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="edit-dueDate" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                          Due Date
                        </label>
                        <input
                          type="date"
                          id="edit-dueDate"
                          name="dueDate"
                          value={editingTask.dueDate}
                          onChange={handleEditChange}
                          className="input"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="edit-priority" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                          Priority
                        </label>
                        <select
                          id="edit-priority"
                          name="priority"
                          value={editingTask.priority}
                          onChange={handleEditChange}
                          className="input appearance-none"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        onClick={cancelEdit}
                        className="btn btn-outline flex items-center gap-1"
                      >
                        <XIcon size={16} />
                        Cancel
                      </button>
                      <button
                        onClick={saveEdit}
                        className="btn btn-primary flex items-center gap-1"
                      >
                        <CheckIcon size={16} />
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-start sm:items-center justify-between flex-col sm:flex-row gap-2 sm:gap-0">
                      <div className="flex items-center gap-3 w-full sm:w-auto">
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={task.status === 'completed'}
                            onChange={() => toggleStatus(task.id)}
                            className="sr-only"
                            id={`task-${task.id}`}
                          />
                          <label 
                            htmlFor={`task-${task.id}`}
                            className={`flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border-2 ${
                              task.status === 'completed' 
                                ? 'bg-primary border-primary' 
                                : 'border-surface-300 dark:border-surface-600'
                            }`}
                          >
                            {task.status === 'completed' && (
                              <CheckIcon className="h-3 w-3 text-white" />
                            )}
                          </label>
                        </div>
                        <div className="flex-1">
                          <h3 className={`text-base sm:text-lg font-medium ${
                            task.status === 'completed' 
                              ? 'line-through text-surface-500 dark:text-surface-400' 
                              : 'text-surface-900 dark:text-surface-50'
                          }`}>
                            {task.title}
                          </h3>
                          {task.description && (
                            <p className="text-surface-600 dark:text-surface-400 text-sm mt-1 line-clamp-2">
                              {task.description}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                        <div className="flex items-center gap-3">
                          <span className={`task-tag ${getPriorityBadgeClass(task.priority)}`}>
                            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                          </span>
                          
                          <span className={`text-sm ${isOverdue(task.dueDate)}`}>
                            {format(new Date(task.dueDate), 'MMM d, yyyy')}
                          </span>
                        </div>
                        
                        <div className="flex gap-1">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => startEdit(task)}
                            className="p-1.5 rounded-full text-surface-600 hover:text-primary dark:text-surface-300 dark:hover:text-primary-light hover:bg-surface-100 dark:hover:bg-surface-700"
                            aria-label="Edit task"
                          >
                            <EditIcon size={18} />
                          </motion.button>
                          
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => deleteTask(task.id)}
                            className="p-1.5 rounded-full text-surface-600 hover:text-red-500 dark:text-surface-300 dark:hover:text-red-400 hover:bg-surface-100 dark:hover:bg-surface-700"
                            aria-label="Delete task"
                          >
                            <TrashIcon size={18} />
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </section>
  );
}

// ClipboardIcon used in empty state
function ClipboardIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
      <path d="M12 11h4"></path>
      <path d="M12 16h4"></path>
      <path d="M8 11h.01"></path>
      <path d="M8 16h.01"></path>
    </svg>
  );
}

export default MainFeature;