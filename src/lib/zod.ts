import { object, string, z } from "zod";

export const loginSchema = object({
  rut: string({ required_error: "El RUT es requerido" })
    .min(9, "El RUT debe tener al menos 9 caracteres")
    .max(12, "El RUT debe tener a lo más 12 caracteres")
    .default(""),
  password: string({ required_error: "La contraseña es requerida" })
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .default(""),
});

export const registerSchema = object({
  name: string({ required_error: "El nombre es requerido" }),
  email: string({ required_error: "El email es requerido" }).email(
    "El email no es válido"
  ),
  rut: string({ required_error: "El RUT es requerido" })
    .min(9, "El RUT debe tener al menos 9 caracteres")
    .max(12, "El RUT debe tener a lo más 12 caracteres")
    .default(""),
  password: string({ required_error: "La contraseña es requerida" })
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .default(""),
});

export type loginSchemaType = z.infer<typeof loginSchema>;
export type registerSchemaType = z.infer<typeof registerSchema>;
