import { 
  ChevronUp,
  LayoutDashboard, 
  Eye, 
  // Calendar, 
  AlertTriangle, 
  // Monitor, 
  // FileText,
  Mail,
  // MessageCircle,
  // Settings,
  LogOut,
  UserRound
} from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  
  const menuItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      path: "/Dashboard",
    },
    {
      icon: Eye,
      label: "Live View",
      path: "/live-view",
    },
    // {
    //   icon: Calendar,
    //   label: "Events",
    //   path: "/Events",
    // },
    {
      icon: AlertTriangle,
      label: "Alerts",
      path: "/Alert",
      // notification: "2"
    },
    {
      icon: Mail,
      label: "Email",
      path: "/email",
    },
    // {
    //   icon: MessageCircle,
    //   label: "WhatsApp",
    //   path: "/whatsapp",
    // },
    // {
    //   icon: Monitor,
    //   label: "Devices",
    //   path: "/devices",
    // },
    // {
    //   icon: FileText,
    //   label: "Reports",
    //   path: "/reports",
    // },
    // {
    //   icon: Settings,
    //   label: "Settings",
    //   path: "/settings",
    // },
  ];

  return (
    <div className=" h-screen bg-linear-to-b from-slate-900 to-slate-800 flex flex-col shadow-2xl overflow-hidden">
      <div className="p-6 border-b border-slate-700 shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-blue-500 p-2 rounded-lg">
            <LayoutDashboard className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-white text-xl font-bold">GTRACK-MES</h1>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <li key={index}>
                <Link
                  to={item.path}
                  className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 group ${
                    isActive
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                      : "text-slate-400 hover:bg-slate-700/50 hover:text-white"
                  }`}
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon
                      className={`w-5 h-5 mr-3 ${isActive ? "text-white" : "text-slate-400 group-hover:text-white"}`}
                    />
                  </motion.div>
                  <span className="flex-1 font-medium">{item.label}</span>
                  {item.notification && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold"
                    >
                      {item.notification}
                    </motion.span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="relative p-2 border-t border-slate-700 shrink-0">
        {isProfileMenuOpen && (
          <div className="absolute bottom-[calc(100%-0.5rem)] left-4 right-4 mb-2 overflow-hidden rounded-xl border border-slate-600 bg-slate-800 shadow-2xl">
            <button onClick={() => { setIsProfileMenuOpen(false); navigate('/settings'); }} className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-medium text-slate-200 hover:bg-slate-700">
              <UserRound className="h-4 w-4" /> Profile & Settings
            </button>
            <button onClick={() => navigate('/')} className="flex w-full items-center gap-3 border-t border-slate-700 px-4 py-3 text-left text-sm font-medium text-red-400 hover:bg-slate-700">
              <LogOut className="h-4 w-4" /> Sign Out
            </button>
          </div>
        )}
        <button onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} aria-expanded={isProfileMenuOpen} className="flex w-full items-center gap-3 rounded-xl bg-slate-700/50 p-4 text-left transition-colors hover:bg-slate-700">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">A</span>
            </div>
            <div className="flex-1">
              <p className="text-white font-medium text-sm">Admin User</p>
              <p className="text-slate-400 text-xs">System Administrator</p>
            </div>
            <ChevronUp className={`h-4 w-4 text-slate-400 transition-transform ${isProfileMenuOpen ? '' : 'rotate-180'}`} />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
