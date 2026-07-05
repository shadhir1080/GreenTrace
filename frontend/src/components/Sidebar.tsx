import React from 'react';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, setCurrentTab }) => {
  const { name, role, logout } = useAuth();

  return (
    <div className="sidebar">
      <div className="brand">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '4px' }}>
          <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="url(#brand-grad)" />
          <defs>
            <linearGradient id="brand-grad" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
              <stop stopColor="#10b981" />
              <stop offset="1" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
        </svg>
        GreenTrace
      </div>

      <div style={{ marginBottom: '30px', padding: '0 8px' }}>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Logged in as</p>
        <p style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '4px' }}>{name}</p>
        <span className="badge badge-final" style={{ fontSize: '10px', marginTop: '6px', display: 'inline-block' }}>
          {role === 'ROLE_SYSTEM_GOVERNOR' ? 'Governor / Admin' : 'Auditor'}
        </span>
      </div>

      <ul className="nav-links">
        <li>
          <a
            onClick={() => setCurrentTab('dashboard')}
            className={`nav-link ${currentTab === 'dashboard' ? 'active' : ''}`}
          >
            📊 Dashboard
          </a>
        </li>
        <li>
          <a
            onClick={() => setCurrentTab('activities')}
            className={`nav-link ${currentTab === 'activities' ? 'active' : ''}`}
          >
            🍃 Activities
          </a>
        </li>
        <li>
          <a
            onClick={() => setCurrentTab('factors')}
            className={`nav-link ${currentTab === 'factors' ? 'active' : ''}`}
          >
            🧬 Emission Factors
          </a>
        </li>
        <li>
          <a
            onClick={() => setCurrentTab('reports')}
            className={`nav-link ${currentTab === 'reports' ? 'active' : ''}`}
          >
            📋 Reports
          </a>
        </li>
      </ul>

      <button className="btn logout-btn" onClick={logout}>
        🚪 Log Out
      </button>
    </div>
  );
};
