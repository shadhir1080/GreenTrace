export type UserRole = 'ROLE_SYSTEM_GOVERNOR' | 'ROLE_ENVIRONMENTAL_AUDITOR';
export type ReportStatus = 'DRAFT' | 'FINAL';

export interface Organization {
  id: number;
  name: string;
  industry: string;
  country: string;
  createdAt: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  organizationId: number | null;
  organizationName: string | null;
  createdAt: string;
}

export interface EmissionFactor {
  id: number;
  activityType: string;
  description: string;
  kgCo2PerUnit: number;
  unit: string;
  createdAt: string;
}

export interface CarbonActivity {
  id: number;
  organizationId: number;
  organizationName: string;
  emissionFactorId: number;
  activityType: string;
  kgCo2PerUnit: number;
  unit: string;
  quantity: number;
  calculatedCo2: number;
  activityDate: string;
  notes: string;
  recordedById: number;
  recordedByName: string;
  createdAt: string;
}

export interface FootprintReport {
  id: number;
  organizationId: number;
  organizationName: string;
  periodStart: string;
  periodEnd: string;
  totalEmissions: number;
  generatedAt: string;
  status: ReportStatus;
}

export interface AuthResponse {
  token: string;
  userId: number;
  email: string;
  name: string;
  role: UserRole;
  organizationId: number | null;
}
