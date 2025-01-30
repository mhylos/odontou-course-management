import { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { loginSchema } from "@/lib/zod";
import db from "@/lib/prisma";
import { isValidRut, format } from "rutility";
import bcrypt from "bcryptjs";
import { Roles } from "./lib/definitions";
import { ACADEMIC_ROUTES, ADMIN_ROUTES } from "./lib/roles.routes";

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

        if (!isValidRut(data.rut)) {
          throw new Error("RUT invalido");
        }

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

        const roles = [];

        const isAdmin = await db.administrator.findUnique({
          where: { user_fk: user.rut },
        });

        if (isAdmin) {
          roles.push(Roles.ADMIN);
        }

        const isAcademic = await db.academic.findUnique({
          where: { user_fk: user.rut },
        });

        if (isAcademic) {
          roles.push(Roles.ACADEMIC);
        }

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
      // const role = auth?.user?.role || Roles.ACADEMIC;

      if (pathname.startsWith("/login") && isLoggedIn) {
        return Response.redirect(new URL("/", nextUrl));
      }

      if (
        !auth?.user?.roles.includes(Roles.ADMIN) &&
        ADMIN_ROUTES.includes(pathname)
      ) {
        return Response.redirect(new URL(ACADEMIC_ROUTES[0], nextUrl));
      }

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
