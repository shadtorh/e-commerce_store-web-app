import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiFilter, FiClock, FiCheckCircle } from 'react-icons/fi';
import useRitualistStore from '../../stores/useRitualistStore';

const RoutineLibrary = () => {
  const navigate = useNavigate();
  const { savedRoutines } = useRitualistStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredRoutines = savedRoutines.filter(routine => {
    const matchesSearch = routine.routineTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || 
      (filterStatus === 'completed' && routine.completedAt) ||
      (filterStatus === 'pending' && !routine.completedAt);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate('/dashboard')}
            className="text-purple-600 hover:text-purple-700 mb-4"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Routine Library
          </h1>
          <p className="text-gray-600">
            Browse and manage your saved routines
          </p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-6"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search routines..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:outline-none"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                  filterStatus === 'all'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterStatus('completed')}
                className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                  filterStatus === 'completed'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Completed
              </button>
              <button
                onClick={() => setFilterStatus('pending')}
                className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                  filterStatus === 'pending'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Pending
              </button>
            </div>
          </div>
        </motion.div>

        {/* Routines Grid */}
        {filteredRoutines.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRoutines.map((routine, index) => (
              <motion.div
                key={routine.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 cursor-pointer"
                onClick={() => navigate('/routine-display', { state: { routine } })}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{routine.mood.emoji}</span>
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {routine.routineTitle}
                      </h3>
                      <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                        <FiClock size={14} />
                        <span>{routine.routineDuration} min</span>
                      </div>
                    </div>
                  </div>
                  {routine.completedAt && (
                    <FiCheckCircle className="text-green-500" size={24} />
                  )}
                </div>
                
                <div className="space-y-2 mb-4">
                  {routine.routineSteps.slice(0, 2).map((step, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="text-purple-600">•</span>
                      <span>{step.text}</span>
                    </div>
                  ))}
                  {routine.routineSteps.length > 2 && (
                    <p className="text-sm text-gray-400">
                      +{routine.routineSteps.length - 2} more steps
                    </p>
                  )}
                </div>

                <button className="w-full bg-purple-100 text-purple-600 py-2 rounded-lg font-medium hover:bg-purple-200 transition-colors">
                  View Routine
                </button>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl shadow-lg p-12 text-center"
          >
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              No routines found
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filterStatus !== 'all'
                ? 'Try adjusting your filters'
                : 'Start by creating your first routine'}
            </p>
            <button
              onClick={() => navigate('/mood-entry')}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700"
            >
              Create Routine
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default RoutineLibrary;
