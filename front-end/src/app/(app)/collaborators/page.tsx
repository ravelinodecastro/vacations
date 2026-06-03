import { auth } from '@/app/auth/auth';
import { getEmployees } from '@/lib/api/employees';
import { CollaboratorsTable } from '@/components/collaborators/CollaboratorsTable';
import type { Employee, Role } from '@/types';

export default async function CollaboratorsPage() {
  const session = await auth();
  const sessionRole = session!.user.role as Role;

  // Only admins can manage employees (backend enforces this via @PreAuthorize)
  if (sessionRole !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <p className="text-gray-500 text-sm">Acesso restrito a administradores.</p>
      </div>
    );
  }

  let employees: Employee[] = [];
  let fetchError: string | null = null;

  try {
    employees = await getEmployees();
  } catch {
    fetchError = 'Não foi possível carregar os colaboradores. Verifique se o backend está disponível.';
  }

  return (
    <CollaboratorsTable
      employees={employees}
      fetchError={fetchError}
    />
  );
}
