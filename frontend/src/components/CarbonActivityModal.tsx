import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import type { CarbonActivity, EmissionFactor, Organization } from '../types';

interface CarbonActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (activity: {
    organizationId: number;
    emissionFactorId: number;
    quantity: number;
    activityDate: string;
    notes?: string;
  }) => Promise<void>;
  activityToEdit?: CarbonActivity | null;
  emissionFactors: EmissionFactor[];
  organizations: Organization[];
  currentUserOrgId: number | null;
}

export const CarbonActivityModal: React.FC<CarbonActivityModalProps> = ({
  isOpen,
  onClose,
  onSave,
  activityToEdit,
  emissionFactors,
  organizations,
  currentUserOrgId,
}) => {
  const [orgId, setOrgId] = useState<number>(0);
  const [factorId, setFactorId] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(0);
  const [activityDate, setActivityDate] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [calculatedCo2, setCalculatedCo2] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Set initial dates and values
  useEffect(() => {
    if (isOpen) {
      setError(null);
      if (activityToEdit) {
        setOrgId(activityToEdit.organizationId);
        setFactorId(activityToEdit.emissionFactorId);
        setQuantity(activityToEdit.quantity);
        setActivityDate(activityToEdit.activityDate);
        setNotes(activityToEdit.notes || '');
      } else {
        setOrgId(currentUserOrgId || (organizations[0]?.id || 0));
        setFactorId(emissionFactors[0]?.id || 0);
        setQuantity(0);
        setActivityDate(new Date().toISOString().split('T')[0]);
        setNotes('');
      }
    }
  }, [isOpen, activityToEdit, currentUserOrgId, organizations, emissionFactors]);

  // Recalculate calculatedCo2 locally for display helper
  useEffect(() => {
    const factor = emissionFactors.find((f) => f.id === factorId);
    if (factor && quantity > 0) {
      setCalculatedCo2(quantity * factor.kgCo2PerUnit);
    } else {
      setCalculatedCo2(0);
    }
  }, [factorId, quantity, emissionFactors]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgId || !factorId || quantity <= 0 || !activityDate) {
      setError('Please fill in all fields with valid details.');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      await onSave({
        organizationId: orgId,
        emissionFactorId: factorId,
        quantity,
        activityDate,
        notes,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save carbon activity.');
    } finally {
      setLoading(false);
    }
  };

  const selectedFactor = emissionFactors.find((f) => f.id === factorId);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={activityToEdit ? '✏️ Edit Carbon Activity' : '🍃 Record Carbon Activity'}
    >
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

        <div className="form-group">
          <label className="form-label">Emission Factor / Activity Type</label>
          <select
            className="form-select"
            value={factorId}
            onChange={(e) => setFactorId(Number(e.target.value))}
          >
            {emissionFactors.map((factor) => (
              <option key={factor.id} value={factor.id}>
                {factor.activityType} ({factor.kgCo2PerUnit} kg CO₂/{factor.unit})
              </option>
            ))}
          </select>
        </div>

        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">Quantity {selectedFactor ? `(${selectedFactor.unit})` : ''}</label>
            <input
              type="number"
              step="any"
              className="form-input"
              value={quantity || ''}
              onChange={(e) => setQuantity(Number(e.target.value))}
              placeholder="e.g. 150"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Activity Date</label>
            <input
              type="date"
              className="form-input"
              value={activityDate}
              onChange={(e) => setActivityDate(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Notes / Description</label>
          <input
            type="text"
            className="form-input"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Q1 heating bills"
          />
        </div>

        {calculatedCo2 > 0 && (
          <div className="total-pill">
            🔥 Estimated Emissions: {calculatedCo2.toFixed(2)} kg CO₂
          </div>
        )}

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
          <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save Activity'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
