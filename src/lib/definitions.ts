export type User = {
  rut: number;
  name: string;
  email?: string;
};

export type UserCreate = {
  password: string;
} & User;

export type AcademicCreate = {
  department_fk: number;
  isFOUCH: boolean;
} & UserCreate;

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
  genre: string;
  name: string;
  email: string;
};

export type Enroll = {
  student_fk: Student["rut"];
  course_fk: Course["id"];
  status: boolean;
  payment_type: string;
  discount: number;
  ticket_num: number | null;
  payment_date: Date | null;
  total: number;
  observation: string;

  student: Student;
};

export type EnrollCreate = Omit<Enroll, "student_fk" | "course_fk" | "student">;
