import React, { useState } from 'react';

interface LandingPageProps {
  onGetStarted: () => void;
  onLoginClick: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onLoginClick }) => {
  // Simple landing page carbon calculator state
  const [calcType, setCalcType] = useState('electricity');
  const [calcQty, setCalcQty] = useState<number>(100);

  const getCalculatedCo2 = () => {
    switch (calcType) {
      case 'electricity': return calcQty * 0.82; // 0.82 kg CO2 per kWh
      case 'gas': return calcQty * 2.04; // 2.04 kg CO2 per m3
      case 'diesel': return calcQty * 2.68; // 2.68 kg CO2 per liter
      case 'petrol': return calcQty * 2.31; // 2.31 kg CO2 per liter
      default: return 0;
    }
  };

  const getUnitName = () => {
    switch (calcType) {
      case 'electricity': return 'kWh';
      case 'gas': return 'cubic meters';
      default: return 'liters';
    }
  };

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '24px 5%', 
        borderBottom: '1px solid var(--glass-border)',
        background: 'rgba(8, 12, 20, 0.6)',
        backdropFilter: 'blur(10px)',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '22px', fontWeight: 800, fontFamily: 'var(--font-heading)', background: 'var(--primary-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="url(#brand-grad-land)" />
            <defs>
              <linearGradient id="brand-grad-land" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                <stop stopColor="#10b981" />
                <stop offset="1" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
          </svg>
          GreenTrace
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button className="btn btn-secondary btn-sm" onClick={onLoginClick}>Sign In</button>
          <button className="btn btn-primary btn-sm" onClick={onGetStarted}>Get Started</button>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{ 
        padding: '100px 5% 80px', 
        textAlign: 'center', 
        background: 'radial-gradient(circle at 50% 30%, rgba(16, 185, 129, 0.1) 0%, transparent 60%)',
        position: 'relative'
      }}>
        <h1 style={{ 
          fontSize: '64px', 
          fontWeight: 800, 
          fontFamily: 'var(--font-heading)', 
          maxWidth: '850px', 
          margin: '0 auto 24px',
          lineHeight: '1.1',
          letterSpacing: '-0.03em'
        }}>
          Corporate Carbon Auditing, <span style={{ background: 'var(--primary-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Simplified & Transparent</span>
        </h1>
        <p style={{ 
          color: 'var(--text-secondary)', 
          fontSize: '20px', 
          maxWidth: '650px', 
          margin: '0 auto 40px',
          lineHeight: '1.6'
        }}>
          GreenTrace enables corporations and auditors to log activities, calculate emissions automatically, and generate compliant greenhouse gas reports.
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <button className="btn btn-primary" style={{ padding: '16px 36px', fontSize: '16px' }} onClick={onGetStarted}>
            Begin Footprint Audit
          </button>
          <button className="btn btn-secondary" style={{ padding: '16px 36px', fontSize: '16px' }} onClick={() => {
            const el = document.getElementById('calculator-demo');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}>
            Try Live Calculator
          </button>
        </div>
      </section>

      {/* Info Stats Row */}
      <section style={{ padding: '0 5% 80px' }}>
        <div className="dashboard-grid" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="glass-panel" style={{ textAlign: 'center', padding: '30px' }}>
            <h3 style={{ fontSize: '40px', fontWeight: 800, color: '#10b981', fontFamily: 'var(--font-heading)' }}>540k+</h3>
            <p style={{ color: 'var(--text-secondary)', marginTop: '8px', fontSize: '15px' }}>Metric Tons CO₂ Audited</p>
          </div>
          <div className="glass-panel" style={{ textAlign: 'center', padding: '30px' }}>
            <h3 style={{ fontSize: '40px', fontWeight: 800, color: '#06b6d4', fontFamily: 'var(--font-heading)' }}>10+</h3>
            <p style={{ color: 'var(--text-secondary)', marginTop: '8px', fontSize: '15px' }}>Emission Factor Indices</p>
          </div>
          <div className="glass-panel" style={{ textAlign: 'center', padding: '30px' }}>
            <h3 style={{ fontSize: '40px', fontWeight: 800, color: '#f59e0b', fontFamily: 'var(--font-heading)' }}>100%</h3>
            <p style={{ color: 'var(--text-secondary)', marginTop: '8px', fontSize: '15px' }}>Verifiable Audit Trail</p>
          </div>
        </div>
      </section>

      {/* Feature Demo & Calculator */}
      <section id="calculator-demo" style={{ 
        padding: '80px 5%', 
        background: 'rgba(15, 23, 42, 0.4)',
        borderTop: '1px solid var(--glass-border)',
        borderBottom: '1px solid var(--glass-border)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '60px', alignItems: 'center' }} className="grid-2-resp">
          <div>
            <h2 style={{ fontSize: '38px', fontWeight: 800, fontFamily: 'var(--font-heading)', marginBottom: '20px' }}>
              Interactive Calculator Preview
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '16px', lineHeight: '1.6', marginBottom: '30px' }}>
              GreenTrace applies pre-audited carbon equivalent factors dynamically. Try typing a consumption quantity below to preview the calculated CO₂ impact in real-time.
            </p>

            <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="form-group">
                <label className="form-label">Select Consumption Type</label>
                <select 
                  className="form-select" 
                  value={calcType}
                  onChange={(e) => setCalcType(e.target.value)}
                >
                  <option value="electricity">⚡ Grid Electricity</option>
                  <option value="gas">🔥 Natural Gas</option>
                  <option value="diesel">🚛 Diesel Combustion</option>
                  <option value="petrol">🚗 Petrol / Gasoline</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Quantity ({getUnitName()})</label>
                <input 
                  type="number" 
                  className="form-input" 
                  value={calcQty} 
                  onChange={(e) => setCalcQty(Math.max(0, Number(e.target.value)))}
                />
              </div>

              <div className="total-pill" style={{ margin: 0, padding: '20px' }}>
                💥 CO₂ Output: {getCalculatedCo2().toFixed(2)} kg CO₂
              </div>
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px', fontFamily: 'var(--font-heading)' }}>Platform Capability Suite</h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <li style={{ display: 'flex', gap: '16px' }}>
                <span style={{ fontSize: '24px' }}>🛡️</span>
                <div>
                  <h4 style={{ fontWeight: 600, fontSize: '16px' }}>Secure Audit Records</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>Immutable ledger history recorded under corporate accounts with automatic compliance tags.</p>
                </div>
              </li>
              <li style={{ display: 'flex', gap: '16px' }}>
                <span style={{ fontSize: '24px' }}>📊</span>
                <div>
                  <h4 style={{ fontWeight: 600, fontSize: '16px' }}>Analytical Breakdown</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>Evaluate your main emission generators (grid consumption, logistics, travel) instantly.</p>
                </div>
              </li>
              <li style={{ display: 'flex', gap: '16px' }}>
                <span style={{ fontSize: '24px' }}>📋</span>
                <div>
                  <h4 style={{ fontWeight: 600, fontSize: '16px' }}>Quarterly & Annual Reports</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>Generate footprint reports, transition them from draft states, and submit audit summaries.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '40px 5%', textAlign: 'center', marginTop: 'auto', borderTop: '1px solid var(--glass-border)', color: 'var(--text-muted)', fontSize: '14px' }}>
        © {new Date().getFullYear()} GreenTrace Inc. All rights reserved. Empowering transparent ESG compliance.
      </footer>
    </div>
  );
};
