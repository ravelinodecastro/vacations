// ─── Backend DTO types (exact API contract) ───────────────────────────────────
// These mirror the Java records/DTOs from the Spring Boot backend.
// Do NOT use these directly in UI components — use the mapped frontend types.

export interface ApiEmployee {
  id: string;
  name: string;
  email: string;
  managerId: string | null;
  managerName: string | null;
}

export type ApiVacationStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';

export interface ApiVacationRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  startDate: string;  // ISO-8601 date, e.g. "2025-08-01"
  endDate: string;
  status: ApiVacationStatus;
}

export interface ApiPage<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  last: boolean;
}

// ─── Request bodies ────────────────────────────────────────────────────────────

export interface CreateEmployeeBody {
  name: string;
  email: string;
  managerId?: string;
  sub?: string;       // Keycloak subject — links employee to a Keycloak user
}

export interface CreateVacationBody {
  startDate: string;  // YYYY-MM-DD
  endDate: string;
}
