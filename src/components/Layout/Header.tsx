import { Bell, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

interface HeaderProps {
  breadcrumb?: Array<{ label: string; path?: string }>;
  actions?: React.ReactNode;
}

export default function Header({ breadcrumb, actions }: HeaderProps) {
  const { user, logout } = useAuth();

  return (
    <header className="header">
      <div className="header__left">
        {breadcrumb && breadcrumb.length > 0 && (
          <nav className="header__breadcrumb">
            {breadcrumb.map((item, index) => (
              <span key={index} className="header__breadcrumb-item">
                {index > 0 && <span className="header__breadcrumb-sep">/</span>}
                {item.path ? (
                  <Link to={item.path} className="header__breadcrumb-link">{item.label}</Link>
                ) : (
                  <span className="header__breadcrumb-text">{item.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
      </div>

      <div className="header__right">
        {actions && <div className="header__actions" style={{ marginRight: '12px' }}>{actions}</div>}
        <div className="header__notification-wrapper">
          <button className="header__notification" title="Notifications">
            <Bell size={20} />
          </button>
          <span className="header__notification-dot"></span>
        </div>

        <div className="header__user" onClick={logout} title="Click to logout">
          <div className="header__avatar">
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'Admin'}`}
              alt="Avatar"
            />
          </div>
          <div className="header__user-info">
            <span className="header__user-name">{user?.name || 'Alex Wando'}</span>
            <span className="header__user-role">{user?.role || 'Admin'}</span>
          </div>
          <ChevronDown size={16} className="header__chevron" />
        </div>
      </div>
    </header>
  );
}
