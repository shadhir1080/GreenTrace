import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import type { Organization } from '../types';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (orgId: number, periodStart: string, periodEnd: string) => Promise<void>;
  organizations: Organization[];
  currentUserOrgId: number | null;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  onGenerate,
  organizations,
  currentUserOrgId,
}) => {
  const [orgId, setOrgId] = useState<number>(0);
  const [periodStart, setPeriodStart] = useState<string>('');
  const [periodEnd, setPeriodEnd] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setError(null);
      setOrgId(currentUserOrgId || (organizations[0]?.id || 0));
      // Default to current year range
      const year = new Date().getFullYear();
      setPeriodStart(`${year}-01-01`);
      setPeriodEnd(`${year}-12-31`);
    }
  }, [isOpen, currentUserOrgId, organizations]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgId || !periodStart || !periodEnd) {
      setError('Please select organization and correct date range.');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      await onGenerate(orgId, periodStart, periodEnd);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to generate report.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="📋 Generate Footprint Report">
      <form onSubmit={handleSubmit}>
        {error && (
          <div style={{ color: 'var(--error)', background: 'rgba(239, 68, 68, 0.1)', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px' }}>
            {error}
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Organization</label>
          {currentUserOrgId ? (
            <input
              type="text"
              className="form-input"
              value={organizations.find((o) => o.id === currentUserOrgId)?.name || ''}
              disabled
            />
          ) : (
            <select
              className="form-select"
              value={orgId}
              onChange={(e) => setOrgId(Number(e.target.value))}
            >
              <option value="0">Select Organization</option>
              {organizations.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.name} ({org.industry})
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">Period Start</label>
            <input
              type="date"
              className="form-input"
              value={periodStart}
              onChange={(e) => setPeriodStart(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Period End</label>
            <input
              type="date"
              className="form-input"
              value={periodEnd}
              onChange={(e) => setPeriodEnd(e.target.value)}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
          <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Generating...' : 'Generate Report'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
