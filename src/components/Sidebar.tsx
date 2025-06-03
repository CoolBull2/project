import { useNavigate, useLocation } from 'react-router-dom';
import { Home, FileText ,Network} from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: <Home className="w-5 h-5" /> },
    { path: '/reports', label: 'Reports', icon: <FileText className="w-5 h-5" /> },
    { path: '/network-ai',label :'ChatBot',icon:<Network className="w-5 h-5" />}
  ];

  return (
    <div className="fixed top-0 left-0 h-screen w-64 bg-white/80 dark:bg-gray-800/80 shadow-lg">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Network Doctor</h2>
      </div>
      <nav className="mt-6">
        {menuItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`w-full flex items-center gap-3 px-6 py-3 text-left transition-colors ${
              location.pathname === item.path
                ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
            }`}
          >
            {item.icon}
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;