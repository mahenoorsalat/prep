import { Outlet, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import './AppLayout.css';

export default function AppLayout() {
  const location = useLocation();
  const isEditorView = location.pathname.includes('/questions') || location.pathname.includes('/preview');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const handleToggle = () => setMobileSidebarOpen((prev) => !prev);
    const handleClose = () => setMobileSidebarOpen(false);

    window.addEventListener('toggle-sidebar', handleToggle);
    window.addEventListener('close-sidebar', handleClose);

    // Auto close sidebar when route changes
    handleClose();

    return () => {
      window.removeEventListener('toggle-sidebar', handleToggle);
      window.removeEventListener('close-sidebar', handleClose);
    };
  }, [location.pathname]);

  const mainClassName = `app-layout__main ${
    isEditorView ? 'app-layout__main--editor' : 'app-layout__main--standard'
  }`;

  return (
    <div className="app-layout">
      <Sidebar isOpen={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />
      <main className={mainClassName}>
        <Outlet />
      </main>
    </div>
  );
}
