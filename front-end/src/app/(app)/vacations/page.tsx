import { auth } from '@/app/auth/auth';
import { getVacations, getMyVacations } from '@/lib/api/vacations';
import { VacationsTable } from '@/components/vacations/VacationsTable';
import type { Role, VacationRequest } from '@/types';

export default async function VacationsPage() {
  const session = await auth();
  const sessionRole = session!.user.role as Role;

  let vacations: VacationRequest[] = [];
  let fetchError: string | null = null;

  try {
    if (sessionRole === 'admin' || sessionRole === 'manager') {
      vacations = await getVacations();
    } else {
      // COLLABORATOR: devolve apenas os seus próprios pedidos via JWT sub
      vacations = await getMyVacations();
    }
  } catch{
    fetchError = 'Não foi possível carregar os pedidos. Verifique se o backend está disponível.';
  }

  return (
    <VacationsTable
      vacations={vacations}
      sessionRole={sessionRole}
      fetchError={fetchError}
    />
  );
}
