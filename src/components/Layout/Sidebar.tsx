import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileEdit,
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
import Logo from '../ui/Logo';
import './Sidebar.css';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/test/create', label: 'Test Creation', icon: FileEdit },
  { path: '/tests/tracking', label: 'Test Tracking', icon: BarChart3 },
];

const iconSidebarItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: FileEdit, label: 'Edit', path: '/test/create' },
  { icon: Bell, label: 'Notifications', path: '' },
  { icon: Calendar, label: 'Calendar', path: '' },
  { icon: Layers, label: 'Layers', path: '' },
  { icon: Users, label: 'Users', path: '' },
  { icon: BookOpen, label: 'Library', path: '' },
  { icon: BarChart3, label: 'Analytics', path: '' },
  { icon: Bookmark, label: 'Bookmarks', path: '' },
  { icon: Shield, label: 'Security', path: '' },
  { icon: HelpCircle, label: 'Help', path: '' },
  { icon: Settings, label: 'Settings', path: '' },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isEditorView = location.pathname.includes('/questions') || location.pathname.includes('/preview');

  return (
    <aside className="sidebar">
      {/* Icon sidebar - narrow rail shown on editor/preview screens */}
      {isEditorView && (
        <div className="sidebar__icons">
          {iconSidebarItems.map((item, i) => {
            const Icon = item.icon;
            const isActive = (item.path === '/dashboard' && location.pathname.startsWith('/dashboard')) ||
              (item.path === '/test/create' && (location.pathname.includes('/test/') || location.pathname.startsWith('/tests')));
            return (
              <button
                key={i}
                className={`sidebar__icon-btn ${isActive ? 'sidebar__icon-btn--active' : ''}`}
                title={item.label}
                onClick={() => item.path && navigate(item.path)}
              >
                <Icon size={18} />
              </button>
            );
          })}
        </div>
      )}

      {/* Main sidebar - standard panel shown on high-level pages */}
      {!isEditorView && (
        <div className="sidebar__main">
          <div className="sidebar__logo-container">
            <div className="sidebar__logo-wrapper">
              <Logo size="lg" />
            </div>
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
      )}
    </aside>
  );
}
