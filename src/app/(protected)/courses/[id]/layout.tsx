import TitlePage from "@/components/common/TitlePage";
import NavigationBar from "@/components/courses/[id]/NavigationBar";

const routes = [
  { title: "Antecedentes Generales", href: "/courses/1" },
  { title: "Estudiantes", href: "/courses/1/students" },
  { title: "Académicos", href: "/courses/1/academics" },
  { title: "Ingresos Aranceles", href: "/courses/1/incomes" },
  { title: "Gastos", href: "/courses/1/expenses" },
  { title: "Distribución", href: "/courses/1/distribution" },
  { title: "Pago de asignaciones y honorarios", href: "/courses/1/payments" },
];

export default function CourseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <TitlePage>
        Curso Ultrasonografía Maxilofacial: Fundamentos Imagenológicos y
        Anatómicos
      </TitlePage>
      <div className="flex flex-col overflow-auto gap-2">
        <NavigationBar routes={routes} />
        <div className="py-5 flex-1 overflow-auto">{children}</div>
      </div>
    </>
  );
}
