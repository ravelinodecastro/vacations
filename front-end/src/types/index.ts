export type Role = 'admin' | 'manager' | 'collaborator';
export type VacationStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';

// Matches backend EmployeeResponse DTO (roles are managed in Keycloak, not stored here)
export interface Employee {
  id: string;           // UUID
  name: string;
  email: string;
  managerId: string | null;
  managerName: string | null;
}

// Matches backend VacationResponse DTO
export interface VacationRequest {
  id: string;           // UUID
  employeeId: string;   // UUID
  employeeName: string;
  startDate: string;    // YYYY-MM-DD
  endDate: string;
  status: VacationStatus;
}
