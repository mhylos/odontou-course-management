import BackButton from "@/components/common/BackButton";

export default function CreateCourseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-4xl font-light">Crear curso</h2>
        <BackButton>
          <span className="icon-[material-symbols--close-rounded] text-3xl cursor-pointer" />
        </BackButton>
      </div>
      {children}
    </div>
  );
}
