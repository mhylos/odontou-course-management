import { boolean, object, string, z, number, coerce, nativeEnum } from "zod";
import { format } from "rutility";
import { Genres } from "@prisma/client";

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
  genre: nativeEnum(Genres).nullable(),
});

export const enrollSchema = object({
  status: boolean({ required_error: "El estado es requerido" }).default(true),
  ticket_num: number()
    .optional()
    .nullish()
    .transform((val) => val ?? null),
  payment_date: coerce
    .date()
    .optional()
    .nullish()
    .transform((val) => val ?? null),
  discount: number({ required_error: "El descuento es requerido" })
    .min(0)
    .max(100)
    .default(0),
  total: number({ required_error: "El total es requerido" }),
  payment_type_fk: coerce
    .number()
    .optional()
    .transform((val) => val ?? undefined),
  observation: string().default(""),
});

export const createCourseSchema = object({
  enroll_value: coerce.number({
    required_error: "El valor de la matrícula es requerido",
  }),
  direct_hours: coerce.number({
    required_error: "Las horas directas son requeridas",
  }),
  indirect_hours: coerce.number({
    required_error: "Las horas indirectas son requeridas",
  }),
  inperson_hours: coerce.number({
    required_error: "Las horas presenciales son requeridas",
  }),
  online_hours: coerce.number({
    required_error: "Las horas online son requeridas",
  }),
  name: string({ required_error: "El nombre es requerido" }),
  objective: string({ required_error: "El objetivo es requerido" }),
  additional_comments: string().default(""),
  date_from: coerce.date({ required_error: "La fecha de inicio es requerida" }),
  date_to: coerce.date({ required_error: "La fecha de término es requerida" }),

  department_fk: number({ required_error: "El departamento es requerido" }),
  program_fk: number({ required_error: "El tipo de programa es requerido" }),
  course_director_fk: number({
    required_error: "El director del curso es requerido",
  }),
  coordinator_fk: number({ required_error: "El coordinador es requerido" }),
});

export const createDepartmentSchema = object({
  name: string({ required_error: "El nombre es requerido" }),
});

export const createAcademicSchema = object({
  rut: string({ required_error: "El RUT es requerido" })
    .min(9, "El RUT debe tener al menos 9 caracteres")
    .max(12, "El RUT debe tener a lo más 12 caracteres")
    .transform((val) => format.notDotDash(val)),
  name: string({ required_error: "El nombre es requerido" }),
  email: string().email("El email no es válido").optional().nullable(),
  isFOUCH: boolean().default(true),
  department_fk: number({ required_error: "El departamento es requerido" }),
});

export type createAcademicSchemaType = z.infer<typeof createAcademicSchema>;
export type createCourseSchemaType = z.infer<typeof createCourseSchema>;
export type studentSchemaType = z.infer<typeof studentSchema>;
export type enrollSchemaType = z.infer<typeof enrollSchema>;
export type loginSchemaType = z.infer<typeof loginSchema>;
export type registerSchemaType = z.infer<typeof registerSchema>;
