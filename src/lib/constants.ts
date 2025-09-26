import {
  AcademicFunctions,
  Actions,
  ResponsibleFunctions,
} from "@prisma/client";

export const MAX_FILE_SIZE_MB = 5;
export const FILE_EXTENSIONS = ["pdf", "doc", "docx", "pdf", "jpg", "jpeg"];
export const DEFAULT_PROGRAMS = [
  "E-Learning",
  "Presencial",
  "Semi-Presencial",
  "Presencial externo",
  "Semi-Presencial externo",
];
export const DEFAULT_HIERARCHY_TYPES = [
  "Ayudante",
  "Instructor",
  "Profesor asistente",
  "Profesor adjunto",
  "Profesor asociado ordinario",
  "Profesor asociado docente",
  "Profesor titular ordinario",
  "Profesor titular docente",
  "Sin jerarquía",
];
export const DEFAULT_PAYMENT_TYPES = [
  "Efectivo",
  "Transferencia",
  "Cheque",
  "Webpay",
];

export const DEFAULT_DEPARTMENTS = [
  "DPTO ODONTOLOGIA DEL NIÑO Y ORTOPEDIA DENTO MAXILAR",
  "DPTO REHABILITACION ORAL",
  "DPTO ODONTOLOGÍA RESTAURADORA",
  "DPTO CIRUGIA Y TRAUMATOLOGÍA BUCAL Y MAXILO FACIAL",
  "DPTO PATOLOGIA Y MEDICINA ORAL",
  "ODONTOLOGIA CONSERVADORA",
  "ICOD",
  "ESC. PREGRADO",
  "ESC. GRADUADOS",
  "ESC GRADUADOS IMPLANTOLOGIA",
  "DECANATO",
  "EXTENSIÓN",
];

export const OVERHEAD_PERCENTAGE = 6; // 6%

export const DISTRIBUTION_EXTERNAL_PERCENTAGE = 72.5;
export const DISTRIBUTION_INTERNAL_PERCENTAGE = 47.5;
export const DISTRIBUTION_TYPE_TOTAL = 95;
export const DEFAULT_DIRECTOR_PERCENTAGE = 7;
export const DEFAULT_COORDINATOR_PERCENTAGE = 5;

export const HONORARIUMS_FUNCTIONS_DICTIONARY = {
  [ResponsibleFunctions.coordinator]: "Coordinador",
  [ResponsibleFunctions.director]: "Director",
  [AcademicFunctions.instructor]: "Dictante",
  [AcademicFunctions.tutor]: "Tutor",
};

export const ACTIONS_DICTIONARY = {
  [Actions.create]: "Creación",
  [Actions.update]: "Actualización",
  [Actions.delete]: "Eliminación",
  [Actions.login]: "Inicio de sesión",
  [Actions.logout]: "Cierre de sesión",
};

export const RECORDS_PER_PAGE = 6 as const;
