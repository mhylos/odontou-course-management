import {
  boolean,
  object,
  string,
  z,
  number,
  coerce,
  nativeEnum,
  date,
} from "zod";
import { format } from "rutility";
import {
  Genres,
  EnrollTypes,
  MultiplierTypes,
  MultiplyWith,
  AcademicFunctions,
  ResponsibleFunctions,
} from "@prisma/client";
import { FILE_EXTENSIONS } from "./constants";
import { checkFileExtension } from "./utils";

export const loginSchema = object({
  rut: string({ required_error: "El RUT es requerido" })
    .min(9, "El RUT debe tener al menos 9 caracteres")
    .max(12, "El RUT debe tener a lo más 12 caracteres")
    .default(""),
  password: string({ required_error: "La contraseña es requerida" }).default(
    ""
  ),
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
  genre: nativeEnum(Genres, {
    required_error: "El género es requerido",
  }).nullable(),
});

export const enrollSchema = object({
  status: boolean({ required_error: "El estado es requerido" }).default(true),
  ticket_num: coerce
    .number()
    .optional()
    .transform((val) => val ?? null),
  payment_date: coerce
    .date({
      errorMap: (issue, { defaultError }) => ({
        message:
          issue.code === "invalid_date" ? "Fecha invalida" : defaultError,
      }),
    })
    .optional()
    .transform((val) => val ?? null),
  discount: string({ required_error: "El descuento es requerido" }).default(
    "0"
  ),
  total: number({ required_error: "El total es requerido" }),
  payment_type_fk: coerce
    .number()
    .optional()
    .transform((val) => val ?? undefined),
  observation: string().default(""),
  installments: number().default(1),
  paid: coerce.number().default(0),
  file: z
    .instanceof(File)
    .optional()
    .nullable()
    .refine((file) => {
      if (!file) return true;
      return checkFileExtension(file, FILE_EXTENSIONS);
    }, "El archivo no es válido"),
  enroll_type: nativeEnum(EnrollTypes),
});

export const studentEnrollSchema = object({
  student: studentSchema,
  enroll: enrollSchema,
});

export const createCourseSchema = object({
  enroll_value: coerce.number({
    required_error: "El valor de la matrícula es requerido",
  }),
  direct_hours: string({
    required_error: "Las horas directas son requeridas",
  }),
  indirect_hours: string({
    required_error: "Las horas indirectas son requeridas",
  }),
  inperson_hours: string({
    required_error: "Las horas presenciales son requeridas",
  }),
  online_hours: string({
    required_error: "Las horas online son requeridas",
  }),
  name: string({ required_error: "El nombre es requerido" }),
  objective: string({ required_error: "El objetivo es requerido" }),
  additional_comments: string().default(""),
  date_from: coerce.date({
    errorMap: (issue, { defaultError }) => ({
      message: issue.code === "invalid_date" ? "Fecha invalida" : defaultError,
    }),
  }),
  date_to: coerce.date({
    errorMap: (issue, { defaultError }) => ({
      message: issue.code === "invalid_date" ? "Fecha invalida" : defaultError,
    }),
  }),

  department_fk: number({ required_error: "El departamento es requerido" }),
  program_fk: number({ required_error: "El tipo de programa es requerido" }),
  course_director_fk: number({
    required_error: "El director del curso es requerido",
  }),
  coordinator_fk: number({ required_error: "El coordinador es requerido" }),
});

export const academicSchema = object({
  rut: string({ required_error: "El RUT es requerido" })
    .min(9, "El RUT debe tener al menos 9 caracteres")
    .max(12, "El RUT debe tener a lo más 12 caracteres")
    .transform((val) => format.notDotDash(val)),
  name: string({ required_error: "El nombre es requerido" }),
  email: string().email("El email no es válido").optional().nullable(),
  phone: coerce.number().optional().nullable(),
  isFOUCH: boolean().default(true),
  department_fk: number({ required_error: "El departamento es requerido" }),
});

export const createDepartmentSchema = object({
  name: string({ required_error: "El nombre es requerido" }).refine(
    (val) => val.trim().length > 0,
    { message: "El nombre no puede estar vacío" }
  ),
  director_fk: number().optional().nullable(),
});

export const searchCourseSchema = object({
  name: string().default(""),
  payment: string().default(""),
  year: number().optional().nullable(),
});

export const academicParticipationSchema = object({
  academic_fk: number({ required_error: "El académico es requerido" }),
  hierarchy_type_fk: number({
    required_error: "La jerarquía académica es requerida",
  }),
  dedicated_hours: coerce.number().optional().nullable(),
  contract_hours: coerce.number().optional().nullable(),
});

export const incomeSchema = object({
  id: number().optional(),
  name: string({ required_error: "El nombre es requerido" }).refine(
    (val) => val.trim().length > 0,
    { message: "El nombre no puede estar vacío" }
  ),
  amount: coerce
    .string({ required_error: "El monto es requerido" })
    .transform((val) => parseInt(val.replace(/[^0-9]/g, ""))),
  comment: string().optional().nullish(),
});

export const incomesSchema = object({
  incomes: z.array(incomeSchema),
});

export const expenseSchema = object({
  id: number().optional(),
  name: string({ required_error: "El nombre es requerido" }).refine(
    (val) => val.trim().length > 0,
    { message: "El nombre no puede estar vacío" }
  ),
  type: nativeEnum(MultiplierTypes),
  multiplier: string({
    required_error: "El multiplicador es requerido",
  }).transform((val) => val.replace(/[^0-9.]/g, "")),
  multiply: nativeEnum(MultiplyWith).optional().nullish(),
  amount: coerce.number().default(0),
});

export const expensesSchema = object({
  expenses: z.array(expenseSchema),
});

export const distributionSchema = object({
  id: number().optional(),
  name: string({ required_error: "El nombre es requerido" }).refine(
    (val) => val.trim().length > 0,
    { message: "El nombre no puede estar vacío" }
  ),
  percentage: string({
    required_error: "El porcentaje es requerido",
  }),
});

export const distributionsSchema = object({
  distributions: z.array(distributionSchema),
});

export const responsibleHonorariumSchema = object({
  responsible_honorarium_id: number(),
  academic_rut: number(),
  academic_name: string(),
  function: nativeEnum(ResponsibleFunctions),
  percentage: string({ required_error: "Las horas son requeridas" }).refine(
    (val) => parseFloat(val) >= 0 && parseFloat(val) <= 100,
    { message: "El porcentaje debe estar entre 0 y 100" }
  ),
});

export const academicHonorariumSchema = object({
  honorarium_id: number(),
  academic_rut: number({ required_error: "El académico es requerido" }),
  academic_name: string(),
  functions: z.array(
    object({
      academic_honorarium_id: number().optional(),
      function: nativeEnum(AcademicFunctions),
      hours: string({ required_error: "Las horas son requeridas" }),
    })
  ),
});

export const honorariumsSchema = object({
  responsiblesHonorariums: z.array(responsibleHonorariumSchema),
  academicsHonorariums: z.array(academicHonorariumSchema),
});

export const departmentSchema = object({
  departmentId: number(),
  name: string(),
  directorId: number().optional().nullable(),
});

export const departmentsSchema = object({
  departments: z.array(departmentSchema),
});

export const paymentSchema = object({
  honorarium_id: number(),
  id: number().optional().nullable(),
  amount: number({ required_error: "El monto es requerido" }),
  observation: string().optional().nullable(),
  paid: boolean(),
  payment_date: date({ required_error: "La fecha del pago es requerida" }),
  next_payment_date: date({
    required_error: "La fecha del proximo pago es requerida",
  }),
});

export const changePasswordSchema = object({
  oldPassword: string({ required_error: "La contraseña es requerida" }),
  newPassword: string({ required_error: "La contraseña es requerida" }),
  confirmNewPassword: string({ required_error: "La contraseña es requerida" }),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "Las contraseñas no coinciden",
  path: ["unmatched_passwords"],
});

export type ChangePasswordSchemaType = z.infer<typeof changePasswordSchema>;
export type PaymentSchemaType = z.infer<typeof paymentSchema>;
export type DepartmentsSchemaType = z.infer<typeof departmentsSchema>;
export type DepartmentSchemaType = z.infer<typeof departmentSchema>;
export type AcademicHonorariumSchemaType = z.infer<
  typeof academicHonorariumSchema
>;
export type ResponsibleHonorariumSchemaType = z.infer<
  typeof responsibleHonorariumSchema
>;
export type HonorariumsSchemaType = z.infer<typeof honorariumsSchema>;
export type DistributionSchemaType = z.infer<typeof distributionSchema>;
export type DistributionsSchemaType = z.infer<typeof distributionsSchema>;
export type IncomeSchemaType = z.infer<typeof incomeSchema>;
export type IncomesSchemaType = z.infer<typeof incomesSchema>;
export type ExpenseSchemaType = z.infer<typeof expenseSchema>;
export type ExpensesSchemaType = z.infer<typeof expensesSchema>;
export type AcademicParticipationSchemaType = z.infer<
  typeof academicParticipationSchema
>;
export type SearchCourseSchemaType = z.infer<typeof searchCourseSchema>;
export type CreateDepartmentSchemaType = z.infer<typeof createDepartmentSchema>;
export type AcademicSchemaType = z.infer<typeof academicSchema>;
export type CreateCourseSchemaType = z.infer<typeof createCourseSchema>;
export type StudentSchemaType = z.infer<typeof studentSchema>;
export type EnrollSchemaType = z.infer<typeof enrollSchema>;
export type StudentEnrollSchemaType = z.infer<typeof studentEnrollSchema>;
export type LoginSchemaType = z.infer<typeof loginSchema>;
export type RegisterSchemaType = z.infer<typeof registerSchema>;
