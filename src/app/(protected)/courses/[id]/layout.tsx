import TitlePage from "@/components/common/TitlePage";
import NavigationBar from "@/components/courses/[id]/NavigationBar";

const MENU_ITEMS = [
  "Antecedentes Generales",
  "Estudiantes",
  "Académicos",
  "Ingresos Aranceles",
  "Gastos",
  "Distribución",
  "Pago de asignaciones y honorarios",
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
      <div>
        <NavigationBar menuItems={MENU_ITEMS} />
        {children}
      </div>
    </>
  );
}
