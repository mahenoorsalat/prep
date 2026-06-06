import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import './AppLayout.css';

export default function AppLayout() {
  const location = useLocation();
  const isEditorView = location.pathname.includes('/questions') || location.pathname.includes('/preview');

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="app-layout__main" style={{ marginLeft: isEditorView ? '60px' : '240px' }}>
        <Outlet />
      </main>
    </div>
  );
}
