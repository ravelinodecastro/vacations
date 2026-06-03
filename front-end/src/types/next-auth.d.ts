import type { Role } from './index';

declare module 'next-auth' {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: Role;
    };
    idToken?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: string;
    idToken?: string;
  }
}
