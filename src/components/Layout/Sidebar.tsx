import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FileEdit,
  ClipboardList,
  Settings,
  HelpCircle,
  BarChart3,
  Users,
  BookOpen,
  Calendar,
  Bell,
  Shield,
  Layers,
  Bookmark,
} from 'lucide-react';
import './Sidebar.css';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/test/create', label: 'Test Creation', icon: FileEdit },
  { path: '/tests/tracking', label: 'Test Tracking', icon: ClipboardList },
];

const iconSidebarItems = [
  { icon: LayoutDashboard, label: 'Dashboard' },
  { icon: FileEdit, label: 'Edit' },
  { icon: Bell, label: 'Notifications' },
  { icon: Calendar, label: 'Calendar' },
  { icon: Layers, label: 'Layers' },
  { icon: Users, label: 'Users' },
  { icon: BookOpen, label: 'Library' },
  { icon: BarChart3, label: 'Analytics' },
  { icon: Bookmark, label: 'Bookmarks' },
  { icon: Shield, label: 'Security' },
  { icon: HelpCircle, label: 'Help' },
  { icon: Settings, label: 'Settings' },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="sidebar">
      {/* Icon sidebar */}
      <div className="sidebar__icons">
        {iconSidebarItems.map((item, i) => {
          const Icon = item.icon;
          return (
            <button key={i} className="sidebar__icon-btn" title={item.label}>
              <Icon size={18} />
            </button>
          );
        })}
      </div>

      {/* Main sidebar */}
      <div className="sidebar__main">
        <div className="sidebar__logo">
          <span className="sidebar__logo-p">P</span>
          <span className="sidebar__logo-text">rep</span>
          <span className="sidebar__logo-route">route</span>
        </div>

        <nav className="sidebar__nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path) || 
              (item.path === '/test/create' && location.pathname.includes('/test/'));
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`sidebar__nav-item ${isActive ? 'sidebar__nav-item--active' : ''}`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
