import { Genres, Income, MultiplyWith, Prisma } from "@prisma/client";
import prisma from "./prisma";
import { Optional } from "./utils";

export type User = {
  rut: number;
  name: string;
  email?: string;
};

export type UserCreate = {
  password: string;
} & User;

export type DepartmentCreate = {
  name: string;
  director_fk: User["rut"];
};

export type Course = {
  id: number;
  enroll_value: number;
  direct_hours: number;
  indirect_hours: number;
  inperson_hours: number;
  online_hours: number;
  name: string;
  objective: string;
  additional_comments: string;
  date_from: string;
  date_to: string;
  hour_value: number;

  program: Program;
  department: Department;
  course_director: User;
  coordinator: User;
};

export type CourseCreate = Omit<
  Course,
  "id" | "program" | "department" | "course_director" | "coordinator"
> & {
  department_fk: number;
  program_fk: number;
  course_director_fk: number;
  coordinator_fk: number;
};

export type Program = {
  id: number;
  name: string;
};

export type Department = {
  id: number;
  name: string;
  director: User;
};

export type Student = {
  rut: number;
  genre: Genres;
  name: string;
  email: string;
};

export type PaymentType = {
  id: number;
  name: string;
};

export type StudentCreateBody = Prisma.Args<
  typeof prisma.student,
  "create"
>["data"];

export type PaymentTypeCreateBody = Prisma.Args<
  typeof prisma.paymentTypes,
  "create"
>["data"];

export type LoggerCreateBody = Prisma.Args<
  typeof prisma.logger,
  "create"
>["data"];

export type EnrollCreateBody = Prisma.Args<
  typeof prisma.enrolled,
  "create"
>["data"];

export type AcademicCreateBody = Prisma.Args<
  typeof prisma.academic,
  "create"
>["data"];

export type ExpensesCreateBody = Prisma.Args<
  typeof prisma.expenses,
  "create"
>["data"];

export type UserCreateBody = Prisma.Args<typeof prisma.user, "create">["data"];

export type Enroll = {
  student_fk: Student["rut"];
  course_fk: Course["id"];
  payment_type_fk: PaymentType["id"];
  status: boolean;
  discount: number;
  ticket_num: number | null;
  payment_date: Date | null;
  total: number;
  observation: string;

  student: Student;
};

export type IncomeUpdateBody = Optional<
  Omit<Income, "course_fk" | "editable">,
  "amount" | "comment"
>;

export type AdminCreate = {} & UserCreate;

export type EnrollCreate = Omit<Enroll, "student_fk" | "course_fk" | "student">;

export type MultiplyValues = {
  [key in MultiplyWith]: string;
};

export enum Roles {
  ADMIN = "admin",
  ACADEMIC = "academic",
  DIRECTOR = "director",
  COORDINATOR = "coordinator",
}
