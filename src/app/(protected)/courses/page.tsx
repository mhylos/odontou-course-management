import TitlePage from "@/components/common/TitlePage";
import CourseList from "@/components/courses/CourseList";
import CoursePreview from "@/components/courses/CoursePreview";
import SearchCourses from "@/components/courses/SearchCourses";
import Link from "next/link";
import { Suspense } from "react";

interface CoursesProps {
  searchParams?: Promise<{ name?: string; payment: string }>;
}

async function Courses({ searchParams }: CoursesProps) {
  const filters = await searchParams;

  return (
    <Suspense
      key={(filters?.name ?? "") + (filters?.payment ?? "")}
      fallback={
        <>
          {Array.from({ length: 10 }).map((_, i) => (
            <CoursePreview key={i} />
          ))}
        </>
      }
    >
      <CourseList filters={filters} />
    </Suspense>
  );
}

export default function CoursesPage({ searchParams }: CoursesProps) {
  return (
    <>
      <div className="grid grid-cols-[1fr_10rem] grid-rows-[1fr_auto] gap-2">
        <TitlePage className="col-span-2 text-ellipsis overflow-hidden">
          Cursos
        </TitlePage>
        <SearchCourses />
        <Link
          href="courses/create"
          className="bg-primary hover:brightness-90 text-white rounded grid place-items-center"
        >
          Crear curso
        </Link>
      </div>

      <ul className="grid grid-cols-3 gap-2 h-full overflow-y-auto pe-3">
        <Courses searchParams={searchParams} />
      </ul>
    </>
  );
}
