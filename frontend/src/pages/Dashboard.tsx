import React from 'react';
import type { CarbonActivity, FootprintReport, Organization } from '../types';

interface DashboardProps {
  activities: CarbonActivity[];
  reports: FootprintReport[];
  organizations: Organization[];
  currentUserOrgId: number | null;
  setCurrentTab: (tab: string) => void;
  openActivityModal: () => void;
  openReportModal: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  activities,
  reports,
  organizations,
  currentUserOrgId,
  setCurrentTab,
  openActivityModal,
  openReportModal,
}) => {
  // Filter activities and reports if user is constrained to a specific org
  const orgActivities = currentUserOrgId
    ? activities.filter((a) => a.organizationId === currentUserOrgId)
    : activities;

  const orgReports = currentUserOrgId
    ? reports.filter((r) => r.organizationId === currentUserOrgId)
    : reports;

  const totalEmissions = orgActivities.reduce((acc, curr) => acc + curr.calculatedCo2, 0);

  // Group activities by type for chart
  const typeGroups = orgActivities.reduce((acc: { [key: string]: number }, curr) => {
    acc[curr.activityType] = (acc[curr.activityType] || 0) + curr.calculatedCo2;
    return acc;
  }, {});

  const typeData = Object.keys(typeGroups).map((key) => ({
    name: key,
    value: typeGroups[key],
  }));

  const maxEmissionsVal = Math.max(...typeData.map((d) => d.value), 1);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>📊 Overview Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Real-time audit of greenhouse gas calculations and carbon activities</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-primary" onClick={openActivityModal}>
            🍃 Record Activity
          </button>
          <button className="btn btn-secondary" onClick={openReportModal}>
            📋 New Report
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="dashboard-grid">
        <div className="glass-panel stat-card">
          <span className="stat-label">Total Calculated Footprint</span>
          <span className="stat-value">{(totalEmissions / 1000).toFixed(2)} t CO₂e</span>
          <span className="stat-desc">Accumulated from {orgActivities.length} recorded items</span>
        </div>

        <div className="glass-panel stat-card">
          <span className="stat-label">Organizations Tracked</span>
          <span className="stat-value">
            {currentUserOrgId 
              ? 1 
              : organizations.length}
          </span>
          <span className="stat-desc">
            {currentUserOrgId 
              ? organizations.find((o) => o.id === currentUserOrgId)?.name || 'Auditor Scope'
              : 'Registered corporate entities'}
          </span>
        </div>

        <div className="glass-panel stat-card">
          <span className="stat-label">Environmental Audits</span>
          <span className="stat-value">{orgReports.length}</span>
          <span className="stat-desc">
            {orgReports.filter((r) => r.status === 'FINAL').length} finalized,{' '}
            {orgReports.filter((r) => r.status === 'DRAFT').length} drafts
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', margin: '40px 0', alignItems: 'start' }} className="grid-2-resp">
        {/* Emission breakdown chart */}
        <div className="glass-panel">
          <h3 style={{ fontSize: '18px', marginBottom: '20px', fontWeight: 600 }}>🔥 Emission Breakdown (by Activity Type)</h3>
          {typeData.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '40px 0' }}>No activity records found to calculate breakdown.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {typeData.map((data, index) => {
                const percentage = (data.value / totalEmissions) * 100;
                const barWidth = (data.value / maxEmissionsVal) * 100;
                return (
                  <div key={index}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '6px' }}>
                      <span style={{ fontWeight: 500 }}>{data.name}</span>
                      <span style={{ color: 'var(--text-secondary)' }}>
                        {data.value.toLocaleString(undefined, { maximumFractionDigits: 1 })} kg ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${barWidth}%`,
                          height: '100%',
                          background: 'var(--primary-gradient)',
                          borderRadius: '4px',
                          transition: 'width 1s ease-out',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Audits / Reports List */}
        <div className="glass-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 600 }}>📋 Footprint Audits</h3>
            <a href="#" onClick={(e) => { e.preventDefault(); setCurrentTab('reports'); }} style={{ color: '#10b981', textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}>
              View all
            </a>
          </div>
          {orgReports.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '40px 0' }}>No generated footprint reports available.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {orgReports.slice(0, 4).map((report) => (
                <div
                  key={report.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '14px 18px',
                    borderRadius: '12px',
                    background: 'rgba(15, 23, 42, 0.4)',
                    border: '1px solid var(--glass-border)',
                  }}
                >
                  <div>
                    <p style={{ fontWeight: 600, fontSize: '14px' }}>
                      {report.periodStart} to {report.periodEnd}
                    </p>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      {report.organizationName}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontWeight: 700, color: '#10b981', fontSize: '14px' }}>
                      {(report.totalEmissions / 1000).toFixed(2)} t CO₂e
                    </p>
                    <span 
                      className={`badge ${report.status === 'FINAL' ? 'badge-final' : 'badge-draft'}`} 
                      style={{ fontSize: '9px', padding: '2px 6px', marginTop: '4px', display: 'inline-block' }}
                    >
                      {report.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Activities Section */}
      <div className="glass-panel" style={{ marginTop: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 600 }}>🍃 Recent Carbon Activities</h3>
          <a href="#" onClick={(e) => { e.preventDefault(); setCurrentTab('activities'); }} style={{ color: '#10b981', textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}>
            View all
          </a>
        </div>

        {orgActivities.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '40px 0' }}>No carbon activities recorded yet.</p>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Organization</th>
                  <th>Activity Type</th>
                  <th>Quantity</th>
                  <th>CO₂ Footprint</th>
                  <th>Recorded By</th>
                </tr>
              </thead>
              <tbody>
                {orgActivities.slice(0, 5).map((activity) => (
                  <tr key={activity.id}>
                    <td>{activity.activityDate}</td>
                    <td style={{ fontWeight: 600 }}>{activity.organizationName}</td>
                    <td>{activity.activityType}</td>
                    <td>
                      {activity.quantity} {activity.unit}
                    </td>
                    <td style={{ fontWeight: 700, color: '#ef4444' }}>
                      {activity.calculatedCo2.toLocaleString(undefined, { maximumFractionDigits: 1 })} kg
                    </td>
                    <td>{activity.recordedByName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
