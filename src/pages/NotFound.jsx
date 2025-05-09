import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import getIcon from '../utils/iconUtils';

function NotFound() {
  const AlertTriangleIcon = getIcon('AlertTriangle');
  const ArrowLeftIcon = getIcon('ArrowLeft');

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8 text-center"
      >
        <div>
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-red-100 dark:bg-red-900/20 text-red-500"
          >
            <AlertTriangleIcon size={40} />
          </motion.div>
          <h1 className="mt-6 text-4xl font-extrabold text-surface-900 dark:text-surface-50">
            404
          </h1>
          <p className="mt-2 text-xl text-surface-600 dark:text-surface-400">
            Page not found
          </p>
          <p className="mt-4 text-base text-surface-500 dark:text-surface-400">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        <div>
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Link
              to="/"
              className="inline-flex items-center px-5 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary hover:bg-primary-dark transition-colors"
            >
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Back to home
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export default NotFound;