import { convertToMoney } from "@/lib/utils";
import { getAllCoursesResponse } from "@/services/courseServices";
import Decimal from "decimal.js";
import Link from "next/link";
import Skeleton from "react-loading-skeleton";

interface CoursePreviewProps {
  course?: Awaited<getAllCoursesResponse>[number];
}

export default function CoursePreview({ course }: CoursePreviewProps) {
  const totalHours = Decimal.sum(
    course?.direct_hours || 0,
    course?.inperson_hours || 0,
    course?.online_hours || 0,
    course?.indirect_hours || 0
  );

  return (
    <div className="bg-white shadow-lg rounded-lg p-5 grid grid-rows-[2.5fr_1fr_1fr_1fr_2fr] gap-1 hover:scale-[101%] transition-transform h-96">
      <h2 className={"text-2xl font-medium line-clamp-3"}>
        {course?.name || <Skeleton className="h-full" />}
      </h2>
      <div className={"flex flex-col"}>
        <span>{course ? "Modalidad" : <Skeleton />}</span>
        <span className="text-xl">{course?.program.name || <Skeleton />}</span>
      </div>
      <div className={"flex flex-col"}>
        <span>{course ? "Total de horas" : <Skeleton />}</span>
        <span className="text-xl">
          {course ? totalHours.toString() + " horas" : <Skeleton />}
        </span>
      </div>
      <div className={"flex flex-col"}>
        <span>{course ? "Pagos" : <Skeleton />}</span>
        <span className="text-xl">
          <Skeleton />
        </span>
      </div>
      <div className={"self-end grid grid-cols-[1fr_5rem] gap-2"}>
        <div className="flex gap-1 justify-items-center">
          {course ? (
            <span className="2xl:text-xl">
              Valor
              <br />
              arancel:
            </span>
          ) : (
            <Skeleton />
          )}
          <div className="p-3 text-2xl border-b-2 text-nowrap flex-1">
            {course ? convertToMoney(course.enroll_value) : <Skeleton />}
          </div>
        </div>
        {course ? (
          <Link href={{ pathname: `/cursos/detalles/${course.id}` }}>
            <div className="bg-primary text-white grid place-items-center rounded h-full hover:brightness-90">
              <span className="icon-[icon-park-outline--preview-open] text-white text-2xl" />
            </div>
          </Link>
        ) : (
          <Skeleton className="h-full" />
        )}
      </div>
    </div>
  );
}
