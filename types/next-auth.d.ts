import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { Roles } from "@/lib/definitions";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface User {
    roles: Roles[];
    rut: number;
    email: string;
    name: string;
  }

  interface Session {
    user: {
      roles: Roles[];
      rut: number;
      email: string;
      name: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    roles: Roles[];
    rut: number;
    email: string;
    name: string;
  }
}
