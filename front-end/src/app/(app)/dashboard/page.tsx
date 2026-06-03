import { auth } from '@/app/auth/auth';
import { getVacations } from '@/lib/api/vacations';
import { getEmployees } from '@/lib/api/employees';
import { StatsGrid } from '@/components/dashboard/StatsGrid';
import { RecentRequests } from '@/components/dashboard/RecentRequests';
import type { Employee, Role, VacationRequest } from '@/types';

export default async function DashboardPage() {
  const session = await auth();
  const sessionRole = session!.user.role as Role;

  let vacations: VacationRequest[] = [];
  let employees: Employee[] = [];
  let fetchError: string | null = null;

  try {
    if (sessionRole === 'admin') {
      [vacations, employees] = await Promise.all([getVacations(), getEmployees()]);
    } else if (sessionRole === 'manager') {
      vacations = await getVacations();
    }
    // Collaborators cannot list vacation requests via the current API
  } catch {
    fetchError = 'Não foi possível carregar os dados. Verifique se o backend está disponível.';
  }

  return (
    <div>
      <h1 className="text-xl font-semibold text-gray-900 mb-1">Dashboard</h1>
      <p className="text-sm text-gray-500 mb-7">
        Bem-vindo(a), {session!.user.name}
      </p>

      {fetchError && (
        <div className="mb-6 px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
          {fetchError}
        </div>
      )}

      <StatsGrid
        vacations={vacations}
        employees={employees}
        sessionRole={sessionRole}
      />

      <h2 className="text-base font-semibold text-gray-900 mt-8 mb-3.5">Pedidos recentes</h2>
      <RecentRequests vacations={vacations} />
    </div>
  );
}
