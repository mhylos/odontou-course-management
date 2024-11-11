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

export type LoginSchema = z.infer<typeof loginSchema>;
