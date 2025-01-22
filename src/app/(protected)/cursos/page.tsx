import TitlePage from "@/components/common/TitlePage";
import CourseList from "@/components/cursos/CourseList";
import CoursePreview from "@/components/cursos/CoursePreview";
import SearchCourses from "@/components/cursos/SearchCourses";
import Link from "next/link";
import { Suspense } from "react";

interface CoursesProps {
  searchParams?: Promise<{ nombre?: string; pagos: string; fecha?: string }>;
}

async function Courses({ searchParams }: CoursesProps) {
  const filters = await searchParams;

  return <CourseList filters={filters} />;
}

function CourseListSkeleton() {
  return (
    <>
      {[...Array(6)].map((_, index) => (
        <CoursePreview key={index} />
      ))}
    </>
  );
}

export default function CoursesPage({ searchParams }: CoursesProps) {
  return (
    <>
      <div className="grid grid-cols-[1fr_10rem] grid-rows-[1fr_auto] gap-2">
        <TitlePage className="col-span-2 text-ellipsis overflow-hidden">
          Cursos
        </TitlePage>
        <Suspense fallback={<></>}>
          <SearchCourses />
        </Suspense>
        <Link
          href="cursos/ingresar"
          className="bg-primary hover:brightness-90 text-white rounded grid place-items-center"
        >
          Ingresar curso
        </Link>
      </div>

      <ul className="grid grid-cols-3 gap-2 h-full overflow-y-auto pe-3">
        <Suspense fallback={<CourseListSkeleton />}>
          <Courses searchParams={searchParams} />
        </Suspense>
      </ul>
    </>
  );
}
