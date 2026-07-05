import React, { useState } from 'react';
import type { FootprintReport } from '../types';

interface ReportsProps {
  reports: FootprintReport[];
  onGenerateClick: () => void;
  onUpdateStatus: (id: number, status: 'DRAFT' | 'FINAL') => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export const Reports: React.FC<ReportsProps> = ({
  reports,
  onGenerateClick,
  onUpdateStatus,
  onDelete,
}) => {
  const [selectedReport, setSelectedReport] = useState<FootprintReport | null>(null);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>📋 Footprint Reports</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Generate, evaluate, and finalize corporate carbon footprint audits</p>
        </div>
        <button className="btn btn-primary" onClick={onGenerateClick}>
          ➕ Generate New Report
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selectedReport ? '1.5fr 1fr' : '1fr', gap: '30px', transition: 'all 0.3s ease' }} className="grid-2-resp">
        {/* Reports Table */}
        <div className="glass-panel" style={{ padding: 0 }}>
          {reports.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <p style={{ color: 'var(--text-secondary)' }}>No footprint reports generated yet.</p>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Period</th>
                  <th>Organization</th>
                  <th>Total CO₂</th>
                  <th>Generated At</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => (
                  <tr 
                    key={report.id} 
                    style={{ cursor: 'pointer', background: selectedReport?.id === report.id ? 'rgba(16, 185, 129, 0.05)' : '' }}
                    onClick={() => setSelectedReport(report)}
                  >
                    <td style={{ fontWeight: 600 }}>
                      {report.periodStart} to {report.periodEnd}
                    </td>
                    <td>{report.organizationName}</td>
                    <td style={{ color: '#10b981', fontWeight: 700 }}>
                      {(report.totalEmissions / 1000).toFixed(2)} t CO₂e
                    </td>
                    <td>{new Date(report.generatedAt).toLocaleString()}</td>
                    <td>
                      <span className={`badge ${report.status === 'FINAL' ? 'badge-final' : 'badge-draft'}`}>
                        {report.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                      <div style={{ display: 'inline-flex', gap: '8px' }}>
                        {report.status === 'DRAFT' && (
                          <button 
                            className="btn btn-primary btn-sm" 
                            style={{ padding: '6px 12px' }}
                            onClick={() => onUpdateStatus(report.id, 'FINAL')}
                          >
                            ✔️ Finalize
                          </button>
                        )}
                        <button 
                          className="btn btn-danger btn-sm" 
                          style={{ padding: '6px 12px' }}
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this report?')) {
                              onDelete(report.id);
                              if (selectedReport?.id === report.id) setSelectedReport(null);
                            }
                          }}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Detailed Report View Panel */}
        {selectedReport && (
          <div className="glass-panel" style={{ height: 'fit-content' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 600 }}>Report Summary</h3>
              <button 
                style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', fontSize: '20px', cursor: 'pointer' }}
                onClick={() => setSelectedReport(null)}
              >
                &times;
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>ORGANIZATION</span>
                <p style={{ fontSize: '16px', fontWeight: 600, marginTop: '2px' }}>{selectedReport.organizationName}</p>
              </div>

              <div>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>AUDIT PERIOD</span>
                <p style={{ fontSize: '16px', fontWeight: 600, marginTop: '2px' }}>
                  {selectedReport.periodStart} to {selectedReport.periodEnd}
                </p>
              </div>

              <div>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>GENERATED TIMESTAMP</span>
                <p style={{ fontSize: '14px', marginTop: '2px' }}>{new Date(selectedReport.generatedAt).toLocaleString()}</p>
              </div>

              <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '16px', marginTop: '10px' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>TOTAL NET FOOTPRINT</span>
                <div style={{ fontSize: '28px', fontWeight: 800, color: '#ef4444', marginTop: '4px' }}>
                  {selectedReport.totalEmissions.toLocaleString(undefined, { maximumFractionDigits: 1 })} kg CO₂e
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Equivalent to <strong>{(selectedReport.totalEmissions / 1000).toFixed(2)} metric tons</strong> of Carbon Dioxide.
                </p>
              </div>

              <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '16px', marginTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>STATUS</span>
                  <div style={{ marginTop: '4px' }}>
                    <span className={`badge ${selectedReport.status === 'FINAL' ? 'badge-final' : 'badge-draft'}`}>
                      {selectedReport.status}
                    </span>
                  </div>
                </div>

                {selectedReport.status === 'DRAFT' && (
                  <button 
                    className="btn btn-primary" 
                    onClick={() => {
                      onUpdateStatus(selectedReport.id, 'FINAL');
                      setSelectedReport({ ...selectedReport, status: 'FINAL' });
                    }}
                  >
                    ✔️ Finalize Report
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
