'use server';

import { revalidatePath } from 'next/cache';
import {
  createVacation,
  approveVacation,
  rejectVacation,
  cancelVacation,
} from '@/lib/api/vacations';
import { ApiError } from '@/lib/api/client';
import type { VacationRequest } from '@/types';

export interface ActionResult<T = void> {
  data?: T;
  error?: string;
}

export async function createVacationAction(
  employeeId: string,
  body: { startDate: string; endDate: string },
): Promise<ActionResult<VacationRequest>> {
  try {
    const data = await createVacation(employeeId, body);
    revalidatePath('/vacations');
    revalidatePath('/dashboard');
    return { data };
  } catch (err) {
    const message = err instanceof ApiError ? err.detail : 'Erro ao criar pedido de férias.';
    return { error: message };
  }
}

export async function approveVacationAction(
  id: string,
): Promise<ActionResult<VacationRequest>> {
  try {
    const data = await approveVacation(id);
    revalidatePath('/vacations');
    revalidatePath('/dashboard');
    return { data };
  } catch (err) {
    const message = err instanceof ApiError ? err.detail : 'Erro ao aprovar pedido.';
    return { error: message };
  }
}

export async function rejectVacationAction(
  id: string,
): Promise<ActionResult<VacationRequest>> {
  try {
    const data = await rejectVacation(id);
    revalidatePath('/vacations');
    revalidatePath('/dashboard');
    return { data };
  } catch (err) {
    const message = err instanceof ApiError ? err.detail : 'Erro ao rejeitar pedido.';
    return { error: message };
  }
}

export async function cancelVacationAction(
  id: string,
): Promise<ActionResult<VacationRequest>> {
  try {
    const data = await cancelVacation(id);
    revalidatePath('/vacations');
    revalidatePath('/dashboard');
    return { data };
  } catch (err) {
    const message = err instanceof ApiError ? err.detail : 'Erro ao cancelar pedido.';
    return { error: message };
  }
}
