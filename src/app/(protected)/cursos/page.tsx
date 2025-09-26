import Pagination from "@/components/common/ParamsPagination";
import TitlePage from "@/components/common/TitlePage";
import CourseList from "@/components/cursos/CourseList";
import CoursePreview from "@/components/cursos/CoursePreview";
import SearchCourses from "@/components/cursos/SearchCourses";
import { RECORDS_PER_PAGE } from "@/lib/constants";
import {
  searchCourseFiltersSchema,
  SearchCourseFiltersSchemaType,
} from "@/lib/zod";
import { getCoursesCount } from "@/services/courseServices";
import Link from "next/link";
import { Suspense } from "react";

interface CoursesProps {
  searchParams?: Promise<{
    nombre?: string;
    pagos?: string;
    fecha?: string;
    pagina?: string;
  }>;
}

async function PaginationComponent({ searchParams }: CoursesProps) {
  const filters = await searchParams;

  const parsedFilters = searchCourseFiltersSchema.safeParse({
    name: filters?.nombre,
    payments: filters?.pagos,
    year: filters?.fecha,
  });

  if (!parsedFilters.success) return null;

  const totalCourses = await getCoursesCount(parsedFilters.data);

  if (totalCourses <= RECORDS_PER_PAGE) return null;

  const page = filters?.pagina ? parseInt(filters.pagina) : 1;
  if (
    isNaN(page) ||
    page < 1 ||
    (totalCourses > 0 && (page - 1) * RECORDS_PER_PAGE >= totalCourses)
  ) {
    filters!.pagina = "1";
  }

  return (
    <Pagination
      className="text-base"
      currentPage={page}
      totalPages={Math.ceil(totalCourses / RECORDS_PER_PAGE)}
    />
  );
}

async function Courses({ searchParams }: CoursesProps) {
  const filters = await searchParams;

  const parsedFilters = searchCourseFiltersSchema.safeParse({
    name: filters?.nombre,
    payments: filters?.pagos,
    year: filters?.fecha,
  });

  const totalCourses = await getCoursesCount(parsedFilters.data);

  const page = filters?.pagina ? parseInt(filters.pagina) : 1;
  if (
    isNaN(page) ||
    page < 1 ||
    (totalCourses > 0 && (page - 1) * RECORDS_PER_PAGE >= totalCourses)
  ) {
    filters!.pagina = "1";
  }

  return (
    <>
      <CourseList
        filters={parsedFilters.success ? parsedFilters.data : undefined}
        pagination={{ page, pageSize: RECORDS_PER_PAGE }}
      />
    </>
  );
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
        <div className="col-span-2 flex items-start justify-between">
          <TitlePage className="text-ellipsis overflow-hidden ">
            Cursos
          </TitlePage>
          <Suspense fallback={<></>}>
            <PaginationComponent searchParams={searchParams} />
          </Suspense>
        </div>
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

      <ul className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-2 h-full overflow-y-auto pe-3">
        <Suspense fallback={<CourseListSkeleton />}>
          <Courses searchParams={searchParams} />
        </Suspense>
      </ul>
    </>
  );
}
