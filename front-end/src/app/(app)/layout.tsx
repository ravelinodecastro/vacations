import { redirect } from 'next/navigation';
import { auth, signOut } from '@/app/auth/auth';
import { AppProvider } from '@/contexts/AppContext';
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

  async function handleSignOut() {
    'use server';
    const keycloakIssuer = process.env.AUTH_KEYCLOAK_ISSUER ?? '';
    const idToken        = (session as any).idToken as string | undefined;

    await signOut({ redirect: false });

    if (keycloakIssuer && idToken) {
      const logoutUrl =
        `${keycloakIssuer}/protocol/openid-connect/logout` +
        `?id_token_hint=${idToken}` +
        `&post_logout_redirect_uri=${encodeURIComponent(process.env.AUTH_URL ?? 'http://localhost:3000')}`;
      redirect(logoutUrl);
    } else {
      redirect('/api/auth/signin');
    }
  }

  return (
    <AppProvider sessionRole={sessionRole}>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar sessionUser={sessionUser} onSignOut={handleSignOut} />
        <main className="flex-1 px-10 py-9 overflow-y-auto min-w-0">{children}</main>
      </div>
    </AppProvider>
  );
}
