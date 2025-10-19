import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiTrash2, FiCheck, FiClock, FiBookmark, FiTrendingUp } from 'react-icons/fi';
import useRitualistStore from '../../stores/useRitualistStore';
import { toast } from 'react-toastify';

const NotificationCenter = () => {
  const navigate = useNavigate();
  const { notifications, scheduledNotifications, markNotificationAsRead, clearAllNotifications } = useRitualistStore();
  const [filterType, setFilterType] = useState('all');

  const filteredNotifications = notifications.filter(notification => {
    if (filterType === 'all') return true;
    return notification.type === filterType;
  });

  const handleMarkAsRead = (notificationId) => {
    markNotificationAsRead(notificationId);
    toast.success('Marked as read');
  };

  const handleClearAll = () => {
    clearAllNotifications();
    toast.success('All notifications cleared');
  };

  const handleMarkAllAsRead = () => {
    notifications.forEach(n => {
      if (!n.read) {
        markNotificationAsRead(n.id);
      }
    });
    toast.success('All marked as read');
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'routine-saved':
        return <FiBookmark className="text-purple-600" size={24} />;
      case 'routine-reminder':
        return <FiClock className="text-blue-600" size={24} />;
      case 'achievement':
        return <FiTrendingUp className="text-green-600" size={24} />;
      default:
        return <FiCheck className="text-gray-600" size={24} />;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
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
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                Notification Center
              </h1>
              <p className="text-gray-600">
                {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
              </p>
            </div>
            {notifications.length > 0 && (
              <div className="flex gap-2">
                <button
                  onClick={handleMarkAllAsRead}
                  className="px-4 py-2 bg-white text-purple-600 border-2 border-purple-600 rounded-lg font-medium hover:bg-purple-50 transition-colors"
                >
                  Mark All Read
                </button>
                <button
                  onClick={handleClearAll}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
                >
                  Clear All
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-6"
        >
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setFilterType('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterType === 'all'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterType('routine-saved')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterType === 'routine-saved'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Saved Routines
            </button>
            <button
              onClick={() => setFilterType('routine-reminder')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterType === 'routine-reminder'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Reminders
            </button>
            <button
              onClick={() => setFilterType('achievement')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterType === 'achievement'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Achievements
            </button>
          </div>
        </motion.div>

        {/* Notifications List */}
        {filteredNotifications.length > 0 ? (
          <div className="space-y-4">
            {filteredNotifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-white rounded-xl shadow-md p-6 transition-all hover:shadow-lg ${
                  !notification.read ? 'border-l-4 border-purple-600' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {notification.title}
                      </h3>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-purple-600 rounded-full flex-shrink-0"></div>
                      )}
                    </div>
                    <p className="text-gray-600 mb-3">{notification.message}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">
                        {new Date(notification.timestamp).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                      <div className="flex gap-2">
                        {!notification.read && (
                          <button
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="px-3 py-1 bg-purple-100 text-purple-600 rounded-lg text-sm font-medium hover:bg-purple-200 transition-colors"
                          >
                            Mark as Read
                          </button>
                        )}
                        {/* Delete functionality to be implemented */}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl shadow-lg p-12 text-center"
          >
            <div className="text-6xl mb-4">🔔</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              No notifications
            </h3>
            <p className="text-gray-600">
              {filterType !== 'all'
                ? 'No notifications in this category'
                : 'You\'re all caught up!'}
            </p>
          </motion.div>
        )}

        {/* Scheduled Notifications Section */}
        {scheduledNotifications.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Scheduled Reminders
            </h2>
            <div className="space-y-4">
              {scheduledNotifications.map((scheduled, index) => (
                <motion.div
                  key={scheduled.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-xl shadow-md p-6"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <FiClock className="text-blue-600" size={24} />
                      <div>
                        <h4 className="font-semibold text-gray-800">
                          Routine Reminder
                        </h4>
                        <p className="text-sm text-gray-600">
                          Scheduled for {new Date(scheduled.scheduledTime).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {/* Edit and Delete functionality to be implemented */}
                      <span className="text-sm text-gray-500">Scheduled</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default NotificationCenter;
