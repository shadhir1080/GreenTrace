import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import type { Organization, UserRole } from '../types';

export const Login: React.FC = () => {
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [organizations, setOrganizations] = useState<Organization[]>([]);

  // Form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('ROLE_ENVIRONMENTAL_AUDITOR');
  const [orgId, setOrgId] = useState<number | null>(null);

  // States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newOrgName, setNewOrgName] = useState('');
  const [newOrgIndustry, setNewOrgIndustry] = useState('');
  const [newOrgCountry, setNewOrgCountry] = useState('');
  const [showCreateOrg, setShowCreateOrg] = useState(false);

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      const list = await api.organizations.getAll();
      setOrganizations(list);
      if (list.length > 0) {
        setOrgId(list[0].id);
      }
    } catch (err) {
      console.error("Failed to load organizations", err);
    }
  };

  const handleCreateOrg = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!newOrgName || !newOrgIndustry || !newOrgCountry) {
      setError('Please fill in all details for the new organization.');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const org = await api.organizations.create(newOrgName, newOrgIndustry, newOrgCountry);
      setOrganizations([...organizations, org]);
      setOrgId(org.id);
      setShowCreateOrg(false);
      setNewOrgName('');
      setNewOrgIndustry('');
      setNewOrgCountry('');
    } catch (err: any) {
      setError(err.message || 'Failed to create organization.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (isRegister && !name)) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      if (isRegister) {
        // Registering
        const selectedOrgId = role === 'ROLE_SYSTEM_GOVERNOR' ? null : orgId;
        await register(name, email, password, role, selectedOrgId);
      } else {
        // Logging in
        await login(email, password);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="glass-panel" style={{ width: '100%', maxWidth: '480px' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 800, fontFamily: 'var(--font-heading)', background: 'var(--primary-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            🍃 GreenTrace
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
            {isRegister ? 'Register your Environmental Governance Account' : 'Sign in to access Carbon Footprints'}
          </p>
        </div>

        {error && (
          <div style={{ color: 'var(--error)', background: 'rgba(239, 68, 68, 0.1)', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px' }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ravi Kumar"
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. admin@greentrace.com"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          {isRegister && (
            <>
              <div className="form-group">
                <label className="form-label">System Role</label>
                <select
                  className="form-select"
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                >
                  <option value="ROLE_ENVIRONMENTAL_AUDITOR">Environmental Auditor</option>
                  <option value="ROLE_SYSTEM_GOVERNOR">System Governor (Admin)</option>
                </select>
              </div>

              {role === 'ROLE_ENVIRONMENTAL_AUDITOR' && (
                <div style={{ border: '1px solid var(--glass-border)', padding: '16px', borderRadius: '12px', background: 'rgba(15, 23, 42, 0.4)', marginBottom: '20px' }}>
                  {!showCreateOrg ? (
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Organization</span>
                        <a 
                          href="#" 
                          onClick={(e) => { e.preventDefault(); setShowCreateOrg(true); }}
                          style={{ color: '#10b981', textDecoration: 'none', fontWeight: 600 }}
                        >
                          + Create New
                        </a>
                      </label>
                      <select
                        className="form-select"
                        value={orgId || 0}
                        onChange={(e) => setOrgId(Number(e.target.value))}
                      >
                        {organizations.map((org) => (
                          <option key={org.id} value={org.id}>
                            {org.name} ({org.industry})
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div>
                      <h4 style={{ marginBottom: '12px', fontSize: '14px' }}>Create New Organization</h4>
                      <div className="form-group">
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Organization Name"
                          value={newOrgName}
                          onChange={(e) => setNewOrgName(e.target.value)}
                        />
                      </div>
                      <div className="grid-2">
                        <div className="form-group">
                          <input
                            type="text"
                            className="form-input"
                            placeholder="Industry"
                            value={newOrgIndustry}
                            onChange={(e) => setNewOrgIndustry(e.target.value)}
                          />
                        </div>
                        <div className="form-group">
                          <input
                            type="text"
                            className="form-input"
                            placeholder="Country"
                            value={newOrgCountry}
                            onChange={(e) => setNewOrgCountry(e.target.value)}
                          />
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowCreateOrg(false)}>Cancel</button>
                        <button type="button" className="btn btn-primary btn-sm" onClick={handleCreateOrg}>Add Org</button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }} disabled={loading}>
            {loading ? 'Processing...' : isRegister ? 'Register Account' : 'Sign In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            {isRegister ? 'Already have an account?' : "Don't have an account yet?"}{' '}
            <span
              style={{ color: '#10b981', cursor: 'pointer', fontWeight: 600 }}
              onClick={() => {
                setIsRegister(!isRegister);
                setError(null);
              }}
            >
              {isRegister ? 'Sign In' : 'Register Here'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};
