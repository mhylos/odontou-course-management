import db from "@/lib/prisma";
import { loginSchema } from "@/lib/zod";
import bcrypt from "bcryptjs";
import { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { format } from "rutility";
import { Roles } from "./lib/definitions";
import {
  ACADEMIC_ROUTES,
  ADMIN_ROUTES,
  COORDINATOR_ROUTES,
  DIRECTOR_ROUTES,
  NOT_PROTECTED_ROUTES,
} from "./lib/roles.routes";
import { getUserRoles } from "./services/userServices";

// Notice this is only an object, not a full Auth.js instance
export default {
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      credentials: {
        rut: { label: "RUT", type: "text" },
        password: { label: "Contraseña", type: "password" },
      },
      authorize: async (credentials) => {
        const { data, success } = loginSchema.safeParse(credentials);

        if (!success) {
          throw new Error("Credenciales invalidas");
        }

        // if (!isValidRut(data.rut)) {
        //   throw new Error("RUT invalido");
        // }

        const user = await db.user.findFirst({
          where: {
            rut: parseInt(format.notDotDash(data.rut)),
          },
        });

        if (!user) {
          throw new Error("RUT no registrado");
        }

        const isValidPassword = await bcrypt.compare(
          data.password,
          user.password
        );

        const roles = await getUserRoles(user.rut);

        if (!isValidPassword) {
          throw new Error("Contraseña incorrecta");
        }

        return { ...user, roles: roles };
      },
    }),
  ],
  callbacks: {
    authorized({ request: { nextUrl }, auth }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = nextUrl;
      const roles = auth?.user?.roles;

      if (pathname.startsWith("/login") && isLoggedIn) {
        return Response.redirect(new URL("/", nextUrl));
      }

      const routes: string[] = [];
      roles?.forEach((role) => {
        switch (role) {
          case Roles.ADMIN:
            routes.push(...ADMIN_ROUTES);
            break;
          case Roles.ACADEMIC:
            routes.push(...ACADEMIC_ROUTES);
            break;
          case Roles.COORDINATOR:
            routes.push(...COORDINATOR_ROUTES);
            break;
          case Roles.DIRECTOR:
            routes.push(...DIRECTOR_ROUTES);
            break;
        }
      });

      routes.push(...NOT_PROTECTED_ROUTES);

      // if (!routes.includes(pathname.split("/")[1])) {
      //   return Response.redirect(new URL("/403", nextUrl));
      // }

      return !!auth;
    },
    session({ session, token }) {
      session.user.rut = token.rut;
      session.user.roles = token.roles;
      session.user.email = token.email ?? "";
      session.user.name = token.name;
      return session;
    },
    jwt({ token, user }) {
      if (user) {
        token.rut = user.rut;
        token.roles = user.roles;
        token.email = user.email ?? "";
        token.name = user.name ?? "";
      }
      return token;
    },
  },
} satisfies NextAuthConfig;
