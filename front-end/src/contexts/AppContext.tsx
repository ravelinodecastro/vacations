'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import type { Employee, VacationRequest, Role } from '@/types';
import { INITIAL_EMPLOYEES, INITIAL_REQUESTS } from '@/lib/mock-data';
import { datesOverlap } from '@/lib/utils';

interface CreateEmployeeData {
  name: string;
  email: string;
  role: Role;
  managerId: number | null;
}

interface CreateVacationData {
  employeeId: number;
  startDate: string;
  endDate: string;
  reason?: string;
}

interface UpdateVacationData {
  startDate: string;
  endDate: string;
  reason?: string;
}

interface OpResult {
  error?: string;
}

interface AppContextType {
  employees: Employee[];
  vacationRequests: VacationRequest[];
  currentUser: Employee;

  createEmployee: (data: CreateEmployeeData) => OpResult;
  updateEmployee: (id: number, data: Partial<CreateEmployeeData>) => OpResult;
  deleteEmployee: (id: number) => void;

  createVacationRequest: (data: CreateVacationData) => OpResult;
  updateVacationRequest: (id: number, data: UpdateVacationData) => OpResult;
  approveRequest: (id: number) => void;
  rejectRequest: (id: number) => void;
  cancelRequest: (id: number) => void;
}

const AppContext = createContext<AppContextType | null>(null);

interface AppProviderProps {
  children: ReactNode;
  sessionRole: Role;
}

export function AppProvider({ children, sessionRole }: AppProviderProps) {
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [vacationRequests, setVacationRequests] = useState<VacationRequest[]>(INITIAL_REQUESTS);

  // Derive the current user from the session role — always the first employee of that role.
  const currentUser = useMemo<Employee>(
    () => employees.find(e => e.role === sessionRole) ?? employees[0],
    [employees, sessionRole],
  );

  const createEmployee = useCallback(
    (data: CreateEmployeeData): OpResult => {
      if (employees.some(e => e.email === data.email)) {
        return { error: 'Já existe um colaborador com este email.' };
      }
      setEmployees(prev => [...prev, { id: Date.now(), ...data }]);
      return {};
    },
    [employees],
  );

  const updateEmployee = useCallback(
    (id: number, data: Partial<CreateEmployeeData>): OpResult => {
      if (data.email && employees.some(e => e.email === data.email && e.id !== id)) {
        return { error: 'Já existe um colaborador com este email.' };
      }
      setEmployees(prev => prev.map(e => (e.id === id ? { ...e, ...data } : e)));
      return {};
    },
    [employees],
  );

  const deleteEmployee = useCallback((id: number) => {
    setEmployees(prev => prev.filter(e => e.id !== id));
    setVacationRequests(prev => prev.filter(r => r.employeeId !== id));
  }, []);

  const createVacationRequest = useCallback(
    (data: CreateVacationData): OpResult => {
      const conflict = vacationRequests.find(
        r =>
          r.status !== 'rejected' &&
          r.status !== 'cancelled' &&
          datesOverlap(data.startDate, data.endDate, r.startDate, r.endDate),
      );
      if (conflict) {
        const who = employees.find(e => e.id === conflict.employeeId);
        return { error: `Sobreposição com férias de ${who?.name ?? 'outro colaborador'}.` };
      }
      setVacationRequests(prev => [
        ...prev,
        {
          id: Date.now(),
          ...data,
          status: 'pending',
          createdAt: new Date().toISOString().split('T')[0],
        },
      ]);
      return {};
    },
    [vacationRequests, employees],
  );

  const updateVacationRequest = useCallback(
    (id: number, data: UpdateVacationData): OpResult => {
      const conflict = vacationRequests.find(
        r =>
          r.id !== id &&
          r.status !== 'rejected' &&
          r.status !== 'cancelled' &&
          datesOverlap(data.startDate, data.endDate, r.startDate, r.endDate),
      );
      if (conflict) {
        const who = employees.find(e => e.id === conflict.employeeId);
        return { error: `Sobreposição com férias de ${who?.name ?? 'outro colaborador'}.` };
      }
      setVacationRequests(prev => prev.map(r => (r.id === id ? { ...r, ...data } : r)));
      return {};
    },
    [vacationRequests, employees],
  );

  const approveRequest = useCallback((id: number) => {
    setVacationRequests(prev =>
      prev.map(r => (r.id === id ? { ...r, status: 'approved' } : r)),
    );
  }, []);

  const rejectRequest = useCallback((id: number) => {
    setVacationRequests(prev =>
      prev.map(r => (r.id === id ? { ...r, status: 'rejected' } : r)),
    );
  }, []);

  const cancelRequest = useCallback((id: number) => {
    setVacationRequests(prev =>
      prev.map(r => (r.id === id ? { ...r, status: 'cancelled' } : r)),
    );
  }, []);

  return (
    <AppContext.Provider
      value={{
        employees,
        vacationRequests,
        currentUser,
        createEmployee,
        updateEmployee,
        deleteEmployee,
        createVacationRequest,
        updateVacationRequest,
        approveRequest,
        rejectRequest,
        cancelRequest,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextType {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
