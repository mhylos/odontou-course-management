import { boolean, object, string, z, number, date } from "zod";
import { format } from "rutility";

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

export const studentSchema = object({
  rut: string({ required_error: "El RUT es requerido" })
    .min(9, "El RUT debe tener al menos 9 caracteres")
    .max(12, "El RUT debe tener a lo más 12 caracteres")
    .transform((val) => format.dotDash(val)),
  name: string({ required_error: "El nombre es requerido" }),
  email: string({ required_error: "El email es requerido" }).email(
    "El email no es válido"
  ),
  genre: string({ required_error: "El género es requerido" }),
});

export const enrollSchema = object({
  status: boolean({ required_error: "El estado es requerido" }).default(true),
  ticket_num: number()
    .optional()
    .nullish()
    .transform((val) => val ?? null),
  payment_date: date({
    required_error: "La fecha de pago es requerida",
  })
    .optional()
    .nullish()
    .transform((val) => val ?? null),
  discount: number({ required_error: "El descuento es requerido" })
    .min(0)
    .max(100)
    .default(0),
  total: number({ required_error: "El total es requerido" }),
  payment_type: string({ required_error: "El tipo de pago es requerido" }),
  observation: string().default(""),
});

export type studentSchemaType = z.infer<typeof studentSchema>;
export type enrollSchemaType = z.infer<typeof enrollSchema>;
export type loginSchemaType = z.infer<typeof loginSchema>;
export type registerSchemaType = z.infer<typeof registerSchema>;
