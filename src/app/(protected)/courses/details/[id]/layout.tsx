import NavigationBar from "@/components/courses/[id]/NavigationBar";
import { CourseProvider } from "@/app/context/courseProvider";
import CourseHeader from "@/components/courses/[id]/CourseHeader";
import { getCourseById } from "@/services/courseServices";

export default async function CourseLayout({
  children,
  courseModal,
  params,
}: {
  children: React.ReactNode;
  courseModal: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;

  const routes = [
    { title: "Antecedentes Generales", href: `/courses/details/${id}` },
    { title: "Estudiantes", href: `/courses/details/${id}/students` },
    { title: "Académicos", href: `/courses/details/${id}/academics` },
    { title: "Ingresos Aranceles", href: `/courses/details/${id}/incomes` },
    { title: "Gastos", href: `/courses/details/${id}/expenses` },
    // { title: "Distribución", href: `/courses/${id}/distribution` },
    {
      title: "Pago de asignaciones y honorarios",
      href: `/courses/details/${id}/payments`,
    },
  ];

  const course = await getCourseById(id);

  if (!course) {
    return <div>El curso no existe</div>;
  }

  return (
    <CourseProvider course={course}>
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
