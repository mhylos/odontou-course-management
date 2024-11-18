import Button from "@/components/common/Button";

interface CoursePreviewProps {
  // course: Course;
  // onCourseClick: (course: Course) => void;
}

export default function CoursePreview({}: CoursePreviewProps) {
  return (
    <div className="bg-white shadow-lg rounded-lg p-5 grid grid-rows-[2fr_1fr_1fr_1fr_2fr] gap-1 hover:scale-[101%] transition-transform h-96 ">
      <h2 className="text-2xl font-medium line-clamp-2">Title</h2>
      <div className="flex flex-col">
        <span>Modalidad</span>
        <span className="text-xl">E-Learning</span>
      </div>
      <div className="flex flex-col">
        <span>Total de horas</span>
        <span className="text-xl">120 Horas</span>
      </div>
      <div className="flex flex-col">
        <span>Pagos</span>
        <span className="text-xl">Completos</span>
      </div>
      <div className="self-end grid grid-cols-[1fr_5rem] gap-2">
        <div className="flex gap-1 justify-items-center">
          <span className="text-xl">
            Valor
            <br />
            arancel:
          </span>
          <div className="p-3 text-2xl border-b-2 text-nowrap flex-1">
            $ 1.000.000
          </div>
        </div>
        <Button>
          <span className="icon-[icon-park-outline--preview-open] text-white text-2xl" />
        </Button>
      </div>
    </div>
  );
}
