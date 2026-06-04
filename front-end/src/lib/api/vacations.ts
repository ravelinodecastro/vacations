import { httpClient } from './client';
import type { ApiVacationRequest, ApiVacationStatus, CreateVacationBody } from './types';
import type { VacationRequest, VacationStatus } from '@/types';

function toStatus(s: ApiVacationStatus): VacationStatus {
  return s.toLowerCase() as VacationStatus;
}

function toVacation(api: ApiVacationRequest): VacationRequest {
  return {
    id:           api.id,
    employeeId:   api.employeeId,
    employeeName: api.employeeName,
    startDate:    api.startDate,
    endDate:      api.endDate,
    status:       toStatus(api.status),
  };
}

export async function getVacations(): Promise<VacationRequest[]> {
  const data = await httpClient.get<ApiVacationRequest[]>('/api/vacations');
  return data.map(toVacation);
}

/** Devolve os pedidos do próprio colaborador autenticado (usa o sub do JWT). */
export async function getMyVacations(): Promise<VacationRequest[]> {
  const data = await httpClient.get<ApiVacationRequest[]>('/api/vacations/my');
  return data.map(toVacation);
}

/**
 * Cria um pedido de férias para o colaborador autenticado.
 * O backend identifica automaticamente o employee pelo sub do JWT.
 */
export async function createMyVacation(
  body: CreateVacationBody,
): Promise<VacationRequest> {
  const data = await httpClient.post<ApiVacationRequest>('/api/vacations/my', body);
  return toVacation(data);
}

export async function createVacation(
  employeeId: string,
  body: CreateVacationBody,
): Promise<VacationRequest> {
  const data = await httpClient.post<ApiVacationRequest>(
    `/api/vacations/employee/${employeeId}`,
    body,
  );
  return toVacation(data);
}

export async function approveVacation(id: string): Promise<VacationRequest> {
  const data = await httpClient.patch<ApiVacationRequest>(`/api/vacations/${id}/approve`);
  return toVacation(data);
}

export async function rejectVacation(id: string): Promise<VacationRequest> {
  const data = await httpClient.patch<ApiVacationRequest>(`/api/vacations/${id}/reject`);
  return toVacation(data);
}

export async function cancelVacation(id: string): Promise<VacationRequest> {
  const data = await httpClient.patch<ApiVacationRequest>(`/api/vacations/${id}/cancel`);
  return toVacation(data);
}
