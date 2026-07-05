import React, { useState } from 'react';
import type { CarbonActivity } from '../types';

interface ActivitiesProps {
  activities: CarbonActivity[];
  onDelete: (id: number) => Promise<void>;
  onEdit: (activity: CarbonActivity) => void;
  openAddModal: () => void;
}

export const Activities: React.FC<ActivitiesProps> = ({
  activities,
  onDelete,
  onEdit,
  openAddModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter activities by search keyword
  const filtered = activities.filter((act) => {
    const term = searchTerm.toLowerCase();
    return (
      act.activityType.toLowerCase().includes(term) ||
      act.organizationName.toLowerCase().includes(term) ||
      (act.notes && act.notes.toLowerCase().includes(term))
    );
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>🍃 Carbon Activities</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Log, calculate, and audit carbon offset and emissions activities</p>
        </div>
        <button className="btn btn-primary" onClick={openAddModal}>
          ➕ Record New Activity
        </button>
      </div>

      <div className="glass-panel" style={{ padding: '20px', marginBottom: '30px' }}>
        <input
          type="text"
          className="form-input search-input"
          placeholder="🔍 Search activities (type, notes, or organization)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '60px 0' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>No carbon activities match your search.</p>
        </div>
      ) : (
        <div className="table-container glass-panel" style={{ padding: 0 }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Organization</th>
                <th>Activity Type</th>
                <th>Quantity</th>
                <th>CO₂ Emitted</th>
                <th>Recorded By</th>
                <th>Notes</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((activity) => (
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
                  <td style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{activity.notes || '-'}</td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '8px' }}>
                      <button 
                        className="btn btn-secondary btn-sm" 
                        onClick={() => onEdit(activity)}
                        style={{ padding: '6px 12px' }}
                      >
                        ✏️ Edit
                      </button>
                      <button 
                        className="btn btn-danger btn-sm" 
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this activity?')) {
                            onDelete(activity.id);
                          }
                        }}
                        style={{ padding: '6px 12px' }}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
