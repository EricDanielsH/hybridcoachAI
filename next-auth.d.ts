// types/next-auth.d.ts
import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  // Extend User interface to include 'hasAccess'
  interface User extends DefaultUser {
    hasAccess?: boolean;
  }

  // Extend Session interface to include 'hasAccess'
  interface Session {
    user?: {
      id?: string;
      hasAccess?: boolean;
    } & DefaultSession["user"];
  }

  // Extend JWT interface to include 'hasAccess'
  interface JWT {
    id?: string;
    hasAccess?: boolean;
  }
}
