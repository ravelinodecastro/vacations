'use server';

import { revalidatePath } from 'next/cache';
import {
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from '@/lib/api/employees';
import { ApiError } from '@/lib/api/client';
import type { Employee } from '@/types';
import type { CreateEmployeeBody } from '@/lib/api/types';

export interface ActionResult<T = void> {
  data?: T;
  error?: string;
}

export async function createEmployeeAction(
  body: CreateEmployeeBody,
): Promise<ActionResult<Employee>> {
  try {
    const data = await createEmployee(body);
    revalidatePath('/collaborators');
    revalidatePath('/dashboard');
    return { data };
  } catch (err) {
    const message = err instanceof ApiError ? err.detail : 'Erro ao criar colaborador.';
    return { error: message };
  }
}

export async function updateEmployeeAction(
  id: string,
  body: CreateEmployeeBody,
): Promise<ActionResult<Employee>> {
  try {
    const data = await updateEmployee(id, body);
    revalidatePath('/collaborators');
    return { data };
  } catch (err) {
    const message = err instanceof ApiError ? err.detail : 'Erro ao atualizar colaborador.';
    return { error: message };
  }
}

export async function deleteEmployeeAction(id: string): Promise<ActionResult> {
  try {
    await deleteEmployee(id);
    revalidatePath('/collaborators');
    revalidatePath('/dashboard');
    return {};
  } catch (err) {
    const message = err instanceof ApiError ? err.detail : 'Erro ao remover colaborador.';
    return { error: message };
  }
}
