import type { Employee, VacationRequest } from '@/types';

export const INITIAL_EMPLOYEES: Employee[] = [
  { id: 1, name: 'Ana Costa',     email: 'ana@taskflow.com',    role: 'admin',        managerId: null },
  { id: 2, name: 'Bruno Silva',   email: 'bruno@taskflow.com',  role: 'manager',      managerId: 1    },
  { id: 3, name: 'Carla Mendes',  email: 'carla@taskflow.com',  role: 'manager',      managerId: 1    },
  { id: 4, name: 'Daniel Faria',  email: 'daniel@taskflow.com', role: 'collaborator', managerId: 2    },
  { id: 5, name: 'Eva Rodrigues', email: 'eva@taskflow.com',    role: 'collaborator', managerId: 2    },
  { id: 6, name: 'Fábio Lopes',   email: 'fabio@taskflow.com',  role: 'collaborator', managerId: 3    },
  { id: 7, name: 'Gisela Nunes',  email: 'gisela@taskflow.com', role: 'collaborator', managerId: 3    },
];

export const INITIAL_REQUESTS: VacationRequest[] = [
  { id: 1, employeeId: 4, startDate: '2025-08-01', endDate: '2025-08-05', status: 'approved', reason: 'Férias de verão',  createdAt: '2025-06-01' },
  { id: 2, employeeId: 5, startDate: '2025-08-10', endDate: '2025-08-15', status: 'pending',  reason: 'Descanso',         createdAt: '2025-06-02' },
  { id: 3, employeeId: 6, startDate: '2025-09-01', endDate: '2025-09-07', status: 'pending',  reason: 'Viagem familiar',  createdAt: '2025-06-03' },
  { id: 4, employeeId: 7, startDate: '2025-07-14', endDate: '2025-07-20', status: 'rejected', reason: 'Férias',           createdAt: '2025-05-20' },
  { id: 5, employeeId: 4, startDate: '2025-10-01', endDate: '2025-10-05', status: 'pending',  reason: 'Natal antecipado', createdAt: '2025-06-04' },
];
