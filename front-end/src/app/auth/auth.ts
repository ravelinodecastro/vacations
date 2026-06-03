import nextAuth from 'next-auth';
import Keycloak from 'next-auth/providers/keycloak';
import type { Role } from '@/types';

function mapRole(realmRoles: string[]): Role {
  if (realmRoles.includes('Admin')) return 'admin';
  if (realmRoles.includes('Manager')) return 'manager';
  return 'collaborator';
}

export const { handlers, auth, signIn, signOut } = nextAuth({
  debug: process.env.NODE_ENV === 'development',
  providers: [Keycloak],
  callbacks: {
    jwt({ token, account }) {
      if (account?.access_token) {
        try {
          const payload = JSON.parse(
            Buffer.from(account.access_token.split('.')[1], 'base64url').toString(),
          );
          token.role = mapRole(payload.realm_access?.roles ?? []);
          token.idToken = account.id_token;
        } catch {
          token.role = 'collaborator' as Role;
        }
      }
      return token;
    },
    session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          role: (token.role ?? 'collaborator') as Role,
        },
        idToken: token.idToken as string | undefined,
      };
    },
  },
});
