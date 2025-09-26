import Overlay from "@/components/common/Overlay";
import RightSidebar from "@/components/common/RightSidebar";
import StudentEnrollForm from "@/components/forms/StudentEnrollForm";
import { getCourseById } from "@/services/courseServices";

interface AddStudentProps {
  params: Promise<{ id: string }>;
}

export default async function AddStudent({ params }: AddStudentProps) {
  const id = (await params).id;
  const course = await getCourseById(id);

  // if (!searchParams.tab || !Object.values(Tabs).includes(searchParams.tab)) {
  //   redirect(`?tab=${Tabs.studentData}`);
  // }

  if (!course) {
    return null;
  }

  return (
    <>
      <Overlay backHref={`/cursos/detalles/${id}/estudiantes`} />
      <RightSidebar
        title="Ingresar estudiante"
        backHref={`/cursos/detalles/${id}/estudiantes`}
      >
        <StudentEnrollForm
          courseId={course.id}
          enrollValue={course.enroll_value}
        />
        {/* <StudentEnrollTabs tab={searchParams.tab} /> */}
      </RightSidebar>
    </>
  );
}
