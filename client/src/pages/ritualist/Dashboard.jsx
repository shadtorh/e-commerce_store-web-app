import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import useRitualistStore from '../../stores/useRitualistStore';
import { moods } from '../../data/moods';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, stats, savedRoutines, notifications } = useRitualistStore();
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  const handleMoodSelect = (mood) => {
    navigate('/mood-entry', { state: { mood } });
  };

  const unreadNotifications = notifications.filter(n => !n.read).length;

  // Mock mood trend data
  const moodTrendData = [
    { day: 'Mon', score: 7 },
    { day: 'Tue', score: 6 },
    { day: 'Wed', score: 8 },
    { day: 'Thu', score: 7 },
    { day: 'Fri', score: 9 },
    { day: 'Sat', score: 8 },
    { day: 'Sun', score: 8 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            {greeting}, {user?.name || 'shadtorhall'} 👋
          </h1>
          <p className="text-gray-600">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </motion.div>

        {/* Quick Mood Check-in */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-6"
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            How are you feeling today?
          </h2>
          <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 gap-3">
            {moods.slice(0, 12).map((mood) => (
              <motion.button
                key={mood.id}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleMoodSelect(mood)}
                className="aspect-square flex items-center justify-center text-4xl bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl hover:shadow-md transition-shadow"
              >
                {mood.emoji}
              </motion.button>
            ))}
          </div>
          <button
            onClick={() => navigate('/mood-entry')}
            className="mt-4 text-purple-600 hover:text-purple-700 font-medium"
          >
            See all moods →
          </button>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Daily Routine Preview */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Today's Routine
            </h3>
            {savedRoutines.length > 0 ? (
              <div className="space-y-3">
                {savedRoutines[0].routineSteps.slice(0, 3).map((step, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-sm font-medium flex-shrink-0">
                      {index + 1}
                    </div>
                    <p className="text-gray-700">{step.text}</p>
                  </div>
                ))}
                <button
                  onClick={() => navigate('/routine-library')}
                  className="mt-4 text-purple-600 hover:text-purple-700 font-medium"
                >
                  View full routine →
                </button>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No routine scheduled yet</p>
                <button
                  onClick={() => navigate('/mood-entry')}
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Create Routine
                </button>
              </div>
            )}
          </motion.div>

          {/* Mood Trends */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Mood Trends
            </h3>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={moodTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" stroke="#999" />
                <YAxis stroke="#999" />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#8b5cf6" 
                  strokeWidth={2}
                  dot={{ fill: '#8b5cf6', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
        >
          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="text-3xl font-bold text-purple-600">{stats.streak}</div>
            <div className="text-sm text-gray-600">Day Streak 🔥</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="text-3xl font-bold text-blue-600">{stats.weeklyEntries}</div>
            <div className="text-sm text-gray-600">This Week 📊</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="text-3xl font-bold text-pink-600">
              {stats.mostFrequentMood || 'N/A'}
            </div>
            <div className="text-sm text-gray-600">Top Mood 😊</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 relative">
            <div className="text-3xl font-bold text-green-600">{unreadNotifications}</div>
            <div className="text-sm text-gray-600">Notifications 🔔</div>
            {unreadNotifications > 0 && (
              <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></div>
            )}
          </div>
        </motion.div>

        {/* Notification Center Preview */}
        {notifications.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">
                Recent Notifications
              </h3>
              <button
                onClick={() => navigate('/notifications')}
                className="text-purple-600 hover:text-purple-700 font-medium text-sm"
              >
                View All
              </button>
            </div>
            <div className="space-y-3">
              {notifications.slice(0, 3).map((notification) => (
                <div
                  key={notification.id}
                  className={`flex items-start gap-3 p-3 rounded-lg ${
                    notification.read ? 'bg-gray-50' : 'bg-purple-50'
                  }`}
                >
                  <div className="text-2xl">
                    {notification.type === 'routine-saved' ? '💾' : '🔔'}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{notification.title}</p>
                    <p className="text-sm text-gray-600">{notification.message}</p>
                  </div>
                  {!notification.read && (
                    <div className="w-2 h-2 bg-purple-600 rounded-full flex-shrink-0 mt-2"></div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
