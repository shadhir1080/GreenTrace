import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Sidebar } from './components/Sidebar';
import { Login } from './pages/Login';
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { Activities } from './pages/Activities';
import { EmissionFactors } from './pages/EmissionFactors';
import { Reports } from './pages/Reports';
import { CarbonActivityModal } from './components/CarbonActivityModal';
import { ReportModal } from './components/ReportModal';
import { api } from './api';
import type { CarbonActivity, EmissionFactor, FootprintReport, Organization } from './types';

// App content wrapper that uses useAuth
const AppContent: React.FC = () => {
  const { isAuthenticated, organizationId } = useAuth();
  const [currentTab, setCurrentTab] = useState('dashboard');

  // Modal open states
  const [isActivityOpen, setIsActivityOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [activityToEdit, setActivityToEdit] = useState<CarbonActivity | null>(null);

  // Loaded database items
  const [activities, setActivities] = useState<CarbonActivity[]>([]);
  const [reports, setReports] = useState<FootprintReport[]>([]);
  const [emissionFactors, setEmissionFactors] = useState<EmissionFactor[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadInitialData();
    }
  }, [isAuthenticated, organizationId]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [acts, reps, factors, orgs] = await Promise.all([
        api.activities.getAll(organizationId || undefined),
        api.reports.getAll(organizationId || undefined),
        api.emissionFactors.getAll(),
        api.organizations.getAll(),
      ]);
      setActivities(acts);
      setReports(reps);
      setEmissionFactors(factors);
      setOrganizations(orgs);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveActivity = async (payload: {
    organizationId: number;
    emissionFactorId: number;
    quantity: number;
    activityDate: string;
    notes?: string;
  }) => {
    if (activityToEdit) {
      // Edit
      const updated = await api.activities.update(activityToEdit.id, payload);
      setActivities(activities.map((a) => (a.id === updated.id ? updated : a)));
    } else {
      // Create
      const created = await api.activities.create(payload);
      setActivities([created, ...activities]);
    }
    // Refresh reports list in case carbon values changed
    const updatedReports = await api.reports.getAll(organizationId || undefined);
    setReports(updatedReports);
  };

  const handleDeleteActivity = async (id: number) => {
    await api.activities.delete(id);
    setActivities(activities.filter((a) => a.id !== id));
    // Refresh reports list
    const updatedReports = await api.reports.getAll(organizationId || undefined);
    setReports(updatedReports);
  };

  const handleGenerateReport = async (orgId: number, start: string, end: string) => {
    const report = await api.reports.generate(orgId, start, end);
    setReports([report, ...reports]);
  };

  const handleUpdateReportStatus = async (id: number, status: 'DRAFT' | 'FINAL') => {
    const updated = await api.reports.updateStatus(id, status);
    setReports(reports.map((r) => (r.id === updated.id ? updated : r)));
  };

  const [showAuth, setShowAuth] = useState(false);

  const handleDeleteReport = async (id: number) => {
    await api.reports.delete(id);
    setReports(reports.filter((r) => r.id !== id));
  };

  if (!isAuthenticated) {
    if (!showAuth) {
      return (
        <LandingPage 
          onGetStarted={() => setShowAuth(true)} 
          onLoginClick={() => setShowAuth(true)} 
        />
      );
    }
    return (
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', top: '24px', left: '24px', zIndex: 100 }}>
          <button className="btn btn-secondary btn-sm" onClick={() => setShowAuth(false)}>
            ⬅️ Back to Home
          </button>
        </div>
        <Login />
      </div>
    );
  }

  if (loading && activities.length === 0) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--bg-primary)' }}>
        <div style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', fontWeight: 600 }}>🍃 Loading environmental audit data...</div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />

      <main className="main-content">
        {currentTab === 'dashboard' && (
          <Dashboard
            activities={activities}
            reports={reports}
            organizations={organizations}
            currentUserOrgId={organizationId}
            setCurrentTab={setCurrentTab}
            openActivityModal={() => {
              setActivityToEdit(null);
              setIsActivityOpen(true);
            }}
            openReportModal={() => setIsReportOpen(true)}
          />
        )}

        {currentTab === 'activities' && (
          <Activities
            activities={activities}
            onDelete={handleDeleteActivity}
            onEdit={(activity) => {
              setActivityToEdit(activity);
              setIsActivityOpen(true);
            }}
            openAddModal={() => {
              setActivityToEdit(null);
              setIsActivityOpen(true);
            }}
          />
        )}

        {currentTab === 'factors' && <EmissionFactors emissionFactors={emissionFactors} />}

        {currentTab === 'reports' && (
          <Reports
            reports={reports}
            onGenerateClick={() => setIsReportOpen(true)}
            onUpdateStatus={handleUpdateReportStatus}
            onDelete={handleDeleteReport}
          />
        )}
      </main>

      {/* Modals */}
      <CarbonActivityModal
        isOpen={isActivityOpen}
        onClose={() => {
          setIsActivityOpen(false);
          setActivityToEdit(null);
        }}
        onSave={handleSaveActivity}
        activityToEdit={activityToEdit}
        emissionFactors={emissionFactors}
        organizations={organizations}
        currentUserOrgId={organizationId}
      />

      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        onGenerate={handleGenerateReport}
        organizations={organizations}
        currentUserOrgId={organizationId}
      />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
