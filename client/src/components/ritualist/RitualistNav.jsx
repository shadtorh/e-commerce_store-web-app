import { useNavigate, useLocation } from 'react-router-dom';
import { FiHome, FiActivity, FiBarChart2, FiBell, FiBook, FiLogOut } from 'react-icons/fi';
import useRitualistStore from '../../stores/useRitualistStore';

const RitualistNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, notifications } = useRitualistStore();

  const unreadCount = notifications.filter(n => !n.read).length;

  const navItems = [
    { path: '/dashboard', icon: FiHome, label: 'Dashboard' },
    { path: '/mood-entry', icon: FiActivity, label: 'Mood' },
    { path: '/routine-library', icon: FiBook, label: 'Library' },
    { path: '/statistics', icon: FiBarChart2, label: 'Stats' },
    { path: '/notifications', icon: FiBell, label: 'Notifications', badge: unreadCount },
  ];

  const handleLogout = () => {
    logout();
    navigate('/ritualist-login');
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-50">
      <div className="flex justify-around items-center py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors relative ${
                isActive
                  ? 'text-purple-600'
                  : 'text-gray-600 hover:text-purple-600'
              }`}
            >
              <Icon size={24} />
              <span className="text-xs mt-1">{item.label}</span>
              {item.badge > 0 && (
                <div className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {item.badge}
                </div>
              )}
            </button>
          );
        })}
        <button
          onClick={handleLogout}
          className="flex flex-col items-center justify-center p-2 rounded-lg transition-colors text-gray-600 hover:text-red-600"
        >
          <FiLogOut size={24} />
          <span className="text-xs mt-1">Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default RitualistNav;
