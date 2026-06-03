export type Role = 'admin' | 'manager' | 'collaborator';
export type VacationStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';

export interface Employee {
  id: number;
  name: string;
  email: string;
  role: Role;
  managerId: number | null;
}

export interface VacationRequest {
  id: number;
  employeeId: number;
  startDate: string;
  endDate: string;
  status: VacationStatus;
  reason?: string;
  createdAt: string;
}
