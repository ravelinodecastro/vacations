import { auth } from '@/app/auth/auth';
import { getEmployees } from '@/lib/api/employees';
import { CollaboratorsTable } from '@/components/collaborators/CollaboratorsTable';
import type { Employee, Role } from '@/types';

export default async function CollaboratorsPage() {
  const session = await auth();
  const sessionRole = session!.user.role as Role;

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

  // Deriva o URL da consola Keycloak a partir do issuer configurado
  const issuer = process.env.AUTH_KEYCLOAK_ISSUER ?? 'http://localhost:8080/realms/lbc';
  const [keycloakBase, realm] = issuer.split('/realms/');
  const keycloakUsersUrl = `${keycloakBase}/admin/master/console/#/${realm ?? 'lbc'}/users`;

  return (
    <CollaboratorsTable
      employees={employees}
      fetchError={fetchError}
      keycloakUsersUrl={keycloakUsersUrl}
    />
  );
}
