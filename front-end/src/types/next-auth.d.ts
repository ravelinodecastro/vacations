import type { Role } from './index';

declare module 'next-auth' {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: Role;
    };
    accessToken?: string;
    idToken?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: string;
    accessToken?: string;
    idToken?: string;
  }
}
