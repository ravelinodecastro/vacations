import { redirect } from 'next/navigation';
import { auth, signOut } from '@/app/auth/auth';
import { getVacations } from '@/lib/api/vacations';
import { ensureMyEmployee } from '@/lib/api/employees';
import { Sidebar } from '@/components/layout/Sidebar';
import type { Role } from '@/types';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    redirect('/api/auth/signin');
  }

  const sessionRole = session.user.role as Role;
  const sessionUser = {
    name:  session.user.name  ?? 'Utilizador',
    email: session.user.email ?? '',
    role:  sessionRole,
  };

  // Auto-registo: garante que o utilizador tem registo de employee no backend.
  // Usa o sub do JWT para encontrar ou criar o registo.
  try {
    await ensureMyEmployee();
  } catch {
    // Continuar mesmo se o backend estiver indisponível
  }

  // Contagem de pedidos pendentes para o badge na sidebar (só admin/manager)
  let pendingCount = 0;
  if (sessionRole === 'admin' || sessionRole === 'manager') {
    try {
      const vacations = await getVacations();
      pendingCount = vacations.filter(v => v.status === 'pending').length;
    } catch {
      // Badge fica em 0 se o backend estiver indisponível
    }
  }

  async function handleSignOut() {
    'use server';
    const keycloakIssuer = process.env.AUTH_KEYCLOAK_ISSUER ?? '';
    const idToken        = (session as unknown as { idToken?: string })?.idToken;

    await signOut({ redirect: false });

    if (keycloakIssuer && idToken) {
      const postLogout = encodeURIComponent(process.env.AUTH_URL ?? 'http://localhost:3000');
      redirect(
        `${keycloakIssuer}/protocol/openid-connect/logout` +
        `?id_token_hint=${idToken}&post_logout_redirect_uri=${postLogout}`,
      );
    } else {
      redirect('/api/auth/signin');
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        sessionUser={sessionUser}
        pendingCount={pendingCount}
        onSignOut={handleSignOut}
      />
      <main className="flex-1 px-10 py-9 overflow-y-auto min-w-0">{children}</main>
    </div>
  );
}
