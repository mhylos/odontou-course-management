import { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { loginSchema } from "@/lib/zod";
import db from "@/lib/prisma";
import { isValidRut, format } from "rutility";
import bcrypt from "bcryptjs";

// Notice this is only an object, not a full Auth.js instance
export default {
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

        if (!isValidPassword) {
          throw new Error("Contraseña incorrecta");
        }

        return user;
      },
    }),
  ],
} satisfies NextAuthConfig;
