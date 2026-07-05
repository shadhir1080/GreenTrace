import type { 
  AuthResponse, 
  CarbonActivity, 
  EmissionFactor, 
  FootprintReport, 
  Organization, 
  UserRole 
} from './types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

function getHeaders(): HeadersInit {
  const token = localStorage.getItem('token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = `HTTP error! status: ${response.status}`;
    try {
      const parsed = JSON.parse(errorText);
      errorMessage = parsed.message || errorMessage;
    } catch {
      errorMessage = errorText || errorMessage;
    }
    throw new Error(errorMessage);
  }
  
  if (response.status === 204) {
    return {} as T;
  }
  
  return response.json();
}

export const api = {
  auth: {
    login: async (email: string, password: string): Promise<AuthResponse> => {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      return handleResponse<AuthResponse>(res);
    },
    register: async (name: string, email: string, password: string, role: UserRole, organizationId?: number | null): Promise<AuthResponse> => {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role, organizationId }),
      });
      return handleResponse<AuthResponse>(res);
    }
  },

  organizations: {
    getAll: async (): Promise<Organization[]> => {
      // Direct array is expected if custom, but endpoint returns pageable or array.
      // Let's check how the backend returned it.
      // Controller returns Page<OrganizationResponse> or similar, let's fetch list or page.
      // Wait, let's look at OrganizationController or query pageable.
      const res = await fetch(`${API_BASE_URL}/organizations`, {
        headers: getHeaders(),
      });
      const data = await handleResponse<any>(res);
      return data.content || data; // handle both raw array and Spring Page
    },
    create: async (name: string, industry: string, country: string): Promise<Organization> => {
      const res = await fetch(`${API_BASE_URL}/organizations`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ name, industry, country }),
      });
      return handleResponse<Organization>(res);
    }
  },

  activities: {
    getAll: async (orgId?: number): Promise<CarbonActivity[]> => {
      const url = orgId 
        ? `${API_BASE_URL}/activities?organizationId=${orgId}&size=1000` 
        : `${API_BASE_URL}/activities?size=1000`;
      const res = await fetch(url, {
        headers: getHeaders(),
      });
      const data = await handleResponse<any>(res);
      return data.content || data;
    },
    create: async (activity: {
      organizationId: number;
      emissionFactorId: number;
      quantity: number;
      activityDate: string;
      notes?: string;
    }): Promise<CarbonActivity> => {
      const res = await fetch(`${API_BASE_URL}/activities`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(activity),
      });
      return handleResponse<CarbonActivity>(res);
    },
    update: async (id: number, activity: {
      organizationId: number;
      emissionFactorId: number;
      quantity: number;
      activityDate: string;
      notes?: string;
    }): Promise<CarbonActivity> => {
      const res = await fetch(`${API_BASE_URL}/activities/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(activity),
      });
      return handleResponse<CarbonActivity>(res);
    },
    delete: async (id: number): Promise<void> => {
      const res = await fetch(`${API_BASE_URL}/activities/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      await handleResponse<void>(res);
    }
  },

  emissionFactors: {
    getAll: async (): Promise<EmissionFactor[]> => {
      const res = await fetch(`${API_BASE_URL}/emission-factors?size=1000`, {
        headers: getHeaders(),
      });
      const data = await handleResponse<any>(res);
      return data.content || data;
    }
  },

  reports: {
    getAll: async (orgId?: number): Promise<FootprintReport[]> => {
      const url = orgId 
        ? `${API_BASE_URL}/reports?organizationId=${orgId}&size=1000` 
        : `${API_BASE_URL}/reports?size=1000`;
      const res = await fetch(url, {
        headers: getHeaders(),
      });
      const data = await handleResponse<any>(res);
      return data.content || data;
    },
    generate: async (orgId: number, start: string, end: string): Promise<FootprintReport> => {
      const res = await fetch(`${API_BASE_URL}/reports/generate`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ organizationId: orgId, periodStart: start, periodEnd: end }),
      });
      return handleResponse<FootprintReport>(res);
    },
    updateStatus: async (id: number, status: 'DRAFT' | 'FINAL'): Promise<FootprintReport> => {
      const res = await fetch(`${API_BASE_URL}/reports/${id}/status`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ status }),
      });
      return handleResponse<FootprintReport>(res);
    },
    delete: async (id: number): Promise<void> => {
      const res = await fetch(`${API_BASE_URL}/reports/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      await handleResponse<void>(res);
    }
  }
};
