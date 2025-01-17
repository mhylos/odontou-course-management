import { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { loginSchema } from "@/lib/zod";
import db from "@/lib/prisma";
import { isValidRut, format } from "rutility";
import bcrypt from "bcryptjs";
import { Roles } from "./lib/definitions";

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

        const isAdmin = await db.administrator.findUnique({
          where: { user_fk: user.rut },
        });

        if (!isValidPassword) {
          throw new Error("Contraseña incorrecta");
        }

        return { ...user, role: isAdmin ? Roles.ADMIN : Roles.ACADEMIC };
      },
    }),
  ],
  callbacks: {
    authorized({ request: { nextUrl }, auth }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = nextUrl;
      const role = auth?.user?.role || Roles.ACADEMIC;

      if (pathname.startsWith("/login") && isLoggedIn) {
        return Response.redirect(new URL("/", nextUrl));
      }

      return !!auth;
    },
    session({ session, token }) {
      session.user.rut = token.rut;
      session.user.role = token.role;
      return session;
    },
    jwt({ token, user }) {
      if (user) {
        token.rut = user.rut;
        token.role = user.role;
      }
      return token;
    },
  },
} satisfies NextAuthConfig;
