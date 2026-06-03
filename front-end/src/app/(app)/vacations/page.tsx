import { auth } from '@/app/auth/auth';
import { getVacations } from '@/lib/api/vacations';
import { getEmployees } from '@/lib/api/employees';
import { VacationsTable } from '@/components/vacations/VacationsTable';
import type { Employee, Role, VacationRequest } from '@/types';

export default async function VacationsPage() {
  const session = await auth();
  const sessionRole = session!.user.role as Role;

  let vacations: VacationRequest[] = [];
  let employees: Employee[] = [];
  let fetchError: string | null = null;

  try {
    if (sessionRole === 'admin') {
      [vacations, employees] = await Promise.all([getVacations(), getEmployees()]);
    } else if (sessionRole === 'manager') {
      // Manager can list vacations; employee details come embedded in each VacationRequest
      vacations = await getVacations();
    }
    // COLLABORATOR: GET /api/vacations requires ADMIN or MANAGER (backend restriction).
    // The collaborator can create requests via the form — results appear after admin/manager loads.
  } catch {
    fetchError = 'Não foi possível carregar os pedidos. Verifique se o backend está disponível.';
  }

  return (
    <VacationsTable
      vacations={vacations}
      employees={employees}
      sessionRole={sessionRole}
      fetchError={fetchError}
    />
  );
}
