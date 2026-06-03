import { redirect } from 'next/navigation';
import { auth, signOut } from '@/app/auth/auth';
import { getVacations } from '@/lib/api/vacations';
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

  // Pending count shown in the sidebar badge (only relevant for admin/manager)
  let pendingCount = 0;
  if (sessionRole === 'admin' || sessionRole === 'manager') {
    try {
      const vacations = await getVacations();
      pendingCount = vacations.filter(v => v.status === 'pending').length;
    } catch {
      // Badge stays 0 if the backend is unavailable
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
