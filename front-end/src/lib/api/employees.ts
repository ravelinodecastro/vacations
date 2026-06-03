import { httpClient } from './client';
import type { ApiEmployee, ApiPage, CreateEmployeeBody } from './types';
import type { Employee } from '@/types';

function toEmployee(api: ApiEmployee): Employee {
  return {
    id:          api.id,
    name:        api.name,
    email:       api.email,
    managerId:   api.managerId,
    managerName: api.managerName,
  };
}

export async function getEmployees(page = 0, size = 100): Promise<Employee[]> {
  const data = await httpClient.get<ApiPage<ApiEmployee>>(
    `/api/employees?page=${page}&size=${size}`,
  );
  return data.content.map(toEmployee);
}

export async function getEmployee(id: string): Promise<Employee> {
  const data = await httpClient.get<ApiEmployee>(`/api/employees/${id}`);
  return toEmployee(data);
}

export async function createEmployee(body: CreateEmployeeBody): Promise<Employee> {
  const data = await httpClient.post<ApiEmployee>('/api/employees', body);
  return toEmployee(data);
}

export async function updateEmployee(id: string, body: CreateEmployeeBody): Promise<Employee> {
  const data = await httpClient.put<ApiEmployee>(`/api/employees/${id}`, body);
  return toEmployee(data);
}

export async function deleteEmployee(id: string): Promise<void> {
  await httpClient.delete(`/api/employees/${id}`);
}
