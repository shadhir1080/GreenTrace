import React, { useState } from 'react';
import type { EmissionFactor } from '../types';

interface EmissionFactorsProps {
  emissionFactors: EmissionFactor[];
}

export const EmissionFactors: React.FC<EmissionFactorsProps> = ({ emissionFactors }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = emissionFactors.filter((ef) =>
    ef.activityType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ef.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>🧬 Carbon Emission Factors</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Reference standard index variables for calculating CO₂ greenhouse gas equivalencies</p>
      </div>

      <div className="glass-panel" style={{ padding: '20px', marginBottom: '30px' }}>
        <input
          type="text"
          className="form-input search-input"
          placeholder="🔍 Search emission factors..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="factors-grid">
        {filtered.map((factor) => (
          <div key={factor.id} className="glass-panel factor-card">
            <div className="factor-name">{factor.activityType}</div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '14px', minHeight: '36px' }}>
              {factor.description}
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span className="factor-value">{factor.kgCo2PerUnit}</span>
              <span className="factor-unit">kg CO₂ / {factor.unit}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
