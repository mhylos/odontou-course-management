import NavigationBar from "@/components/cursos/detalles/[id]/NavigationBar";
import { CourseProvider } from "@/app/context/courseProvider";
import CourseHeader from "@/components/cursos/detalles/[id]/CourseHeader";
import { getCourseById } from "@/services/courseServices";
import { notFound } from "next/navigation";

interface CourseLayoutProps {
  children: React.ReactNode;
  courseModal: React.ReactNode;
  sideform: React.ReactNode;
  params: Promise<{ id: string }>;
}

export default async function CourseLayout({
  children,
  courseModal,
  sideform,
  params,
}: CourseLayoutProps) {
  const id = (await params).id;

  const routes = [
    { title: "Antecedentes Generales", href: `/cursos/detalles/${id}` },
    { title: "Estudiantes", href: `/cursos/detalles/${id}/estudiantes` },
    { title: "Académicos", href: `/cursos/detalles/${id}/academicos` },
    { title: "Ingresos Aranceles", href: `/cursos/detalles/${id}/ingresos` },
    { title: "Gastos", href: `/cursos/detalles/${id}/gastos` },
    { title: "Distribución", href: `/cursos/detalles/${id}/distribucion` },
    {
      title: "Pago de asignaciones y honorarios",
      href: `/cursos/detalles/${id}/pagos`,
    },
  ];

  const course = await getCourseById(id);

  if (!course) {
    return notFound();
  }

  return (
    <CourseProvider course={course}>
      {sideform}
      {courseModal}
      <CourseHeader />
      <div className="flex flex-col overflow-auto gap-2">
        <NavigationBar routes={routes} />
        <div className="flex-1 flex w-full h-full overflow-auto">
          {children}
        </div>
      </div>
    </CourseProvider>
  );
}
