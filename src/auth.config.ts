import { AuthError, type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { loginSchema } from "./lib/zod";
import { ZodError } from "zod";

// Notice this is only an object, not a full Auth.js instance
export default {
  providers: [
    Credentials({
      credentials: {
        rut: { label: "RUT", type: "text" },
        password: { label: "Contraseña", type: "password" },
      },
      authorize: async (credentials) => {
        let user = null;
        if (credentials.rut === "11.111.111-1") {
          user = {
            rut: credentials.rut,
            name: "John Doe",
            email: "",
          };
        } else {
          throw new Error("Credenciales inválidas");
        }

        return user;
      },
    }),
  ],
} satisfies NextAuthConfig;
