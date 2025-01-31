import React from "react";
import { SidebarRoute } from "@/components/common/Sidebar/Sidebar";

export const ADMIN_SIDEBAR_ROUTES: SidebarRoute[] = [
  {
    title: "Inicio",
    description: "Ultimas operaciones",
    href: "/",
    icon: <span className="icon-[ph--house]" />,
  },
  {
    title: "Cursos",
    description: "Gestión de cursos",
    href: "/cursos",
    icon: <span className="icon-[ph--graduation-cap]" />,
  },
  {
    title: "Académicos",
    description: "Gestión de académicos",
    href: "/academicos",
    icon: <span className="icon-[ph--users-three]" />,
  },
  {
    title: "Estudiantes",
    description: "Gestión de estudiantes",
    href: "/estudiantes",
    icon: <span className="icon-[ph--student]" />,
  },
  {
    title: "Departamentos",
    description: "Gestión de departamentos",
    href: "/departamentos",
    icon: <span className="icon-[ph--buildings]" />,
  },
  {
    title: "Administradores",
    description: "Gestión de administradores",
    href: "/administradores",
    icon: <span className="icon-[ph--user-gear]" />,
  },
];

export const ACADEMIC_SIDEBAR_ROUTES: SidebarRoute[] = [
  {
    title: "Honorarios",
    description: "Por participación en cursos",
    href: "/honorarios",
    icon: <span className="icon-[ph--receipt]" />,
  },
];
