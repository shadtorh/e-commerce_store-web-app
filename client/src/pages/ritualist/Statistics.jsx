import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import useRitualistStore from '../../stores/useRitualistStore';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const Statistics = () => {
  const navigate = useNavigate();
  const { moodHistory, routineHistory, stats } = useRitualistStore();
  const [timePeriod, setTimePeriod] = useState(30);

  // Mock data for demonstration (replace with real data from store)
  const moodTrendData = [
    { date: 'Jan 1', positive: 5, neutral: 3, negative: 2 },
    { date: 'Jan 8', positive: 6, neutral: 2, negative: 2 },
    { date: 'Jan 15', positive: 7, neutral: 2, negative: 1 },
    { date: 'Jan 22', positive: 8, neutral: 1, negative: 1 },
    { date: 'Jan 29', positive: 7, neutral: 3, negative: 0 },
  ];

  const moodDistribution = [
    { name: 'Positive', value: 45, color: '#10b981' },
    { name: 'Neutral', value: 30, color: '#f59e0b' },
    { name: 'Negative', value: 25, color: '#ef4444' },
  ];

  const weeklyActivity = [
    { day: 'Mon', routines: 3, moods: 2 },
    { day: 'Tue', routines: 2, moods: 3 },
    { day: 'Wed', routines: 4, moods: 2 },
    { day: 'Thu', routines: 3, moods: 3 },
    { day: 'Fri', routines: 5, moods: 4 },
    { day: 'Sat', routines: 2, moods: 2 },
    { day: 'Sun', routines: 3, moods: 3 },
  ];

  const engagementRate = (moodHistory.length > 0 && routineHistory.length > 0)
    ? Math.round((routineHistory.length / moodHistory.length) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
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
            Statistics & Analytics
          </h1>
          <p className="text-gray-600">
            Track your mood patterns and routine completion over time
          </p>
        </motion.div>

        {/* Time Period Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-6"
        >
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setTimePeriod(7)}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                timePeriod === 7
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => setTimePeriod(30)}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                timePeriod === 30
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              30 Days
            </button>
            <button
              onClick={() => setTimePeriod(90)}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                timePeriod === 90
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              90 Days
            </button>
          </div>
        </motion.div>

        {/* Stat Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
        >
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl shadow-lg p-6">
            <div className="text-sm mb-2">Most Frequent Mood</div>
            <div className="text-3xl font-bold">{stats.mostFrequentMood || 'N/A'}</div>
            <div className="text-sm opacity-80 mt-1">This period</div>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl shadow-lg p-6">
            <div className="text-sm mb-2">Weekly Entries</div>
            <div className="text-3xl font-bold">{stats.weeklyEntries}</div>
            <div className="text-sm opacity-80 mt-1">Last 7 days</div>
          </div>
          <div className="bg-gradient-to-br from-pink-500 to-pink-600 text-white rounded-xl shadow-lg p-6">
            <div className="text-sm mb-2">Engagement Rate</div>
            <div className="text-3xl font-bold">{engagementRate}%</div>
            <div className="text-sm opacity-80 mt-1">Routine completion</div>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl shadow-lg p-6">
            <div className="text-sm mb-2">Current Streak</div>
            <div className="text-3xl font-bold">{stats.streak} 🔥</div>
            <div className="text-sm opacity-80 mt-1">Days</div>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Mood Trend Line Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Mood Trends Over Time
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={moodTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#999" />
                <YAxis stroke="#999" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="positive" stroke="#10b981" strokeWidth={2} />
                <Line type="monotone" dataKey="neutral" stroke="#f59e0b" strokeWidth={2} />
                <Line type="monotone" dataKey="negative" stroke="#ef4444" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Mood Distribution Pie Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Mood Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={moodDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {moodDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Weekly Activity Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-6"
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Weekly Activity
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyActivity}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" stroke="#999" />
              <YAxis stroke="#999" />
              <Tooltip />
              <Legend />
              <Bar dataKey="routines" fill="#8b5cf6" name="Routines Completed" />
              <Bar dataKey="moods" fill="#3b82f6" name="Mood Entries" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Sentiment Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Sentiment Analysis
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-700 font-medium">Positive Moods</span>
                <span className="text-green-600 font-bold">45%</span>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-700 font-medium">Neutral Moods</span>
                <span className="text-yellow-600 font-bold">30%</span>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-500 rounded-full" style={{ width: '30%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-700 font-medium">Negative Moods</span>
                <span className="text-red-600 font-bold">25%</span>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-red-500 rounded-full" style={{ width: '25%' }}></div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Statistics;
