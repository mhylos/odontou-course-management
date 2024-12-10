import Button from "@/components/common/Button";
import { convertToMoney } from "@/lib/utils";
import { getAllCoursesResponse } from "@/services/courseServices";
import Link from "next/link";

interface CoursePreviewProps {
  course: Awaited<getAllCoursesResponse>[number];
}

export default function CoursePreview({ course }: CoursePreviewProps) {
  return (
    <div className="bg-white shadow-lg rounded-lg p-5 grid grid-rows-[2.5fr_1fr_1fr_1fr_2fr] gap-1 hover:scale-[101%] transition-transform h-96 ">
      <h2 className="text-2xl font-medium line-clamp-3">{course.name}</h2>
      <div className="flex flex-col">
        <span>Modalidad</span>
        <span className="text-xl">{course.program.name}</span>
      </div>
      <div className="flex flex-col">
        <span>Total de horas</span>
        <span className="text-xl">
          {(
            course.direct_hours +
            course.indirect_hours +
            course.inperson_hours +
            course.online_hours
          ).toFixed(1)}
        </span>
      </div>
      <div className="flex flex-col">
        <span>Pagos</span>
        <span className="text-xl">Completos</span>
      </div>
      <div className="self-end grid grid-cols-[1fr_5rem] gap-2">
        <div className="flex gap-1 justify-items-center">
          <span className="2xl:text-xl">
            Valor
            <br />
            arancel:
          </span>
          <div className="p-3 text-2xl border-b-2 text-nowrap flex-1">
            {convertToMoney(course.enroll_value)}
          </div>
        </div>
        <Link href={`/courses/${course.id}`}>
          <Button>
            <span className="icon-[icon-park-outline--preview-open] text-white text-2xl" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
