interface CoursePreviewProps {
  // course: Course;
  // onCourseClick: (course: Course) => void;
}

export default function CoursePreview({}: CoursePreviewProps) {
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <img
        className="w-full h-56 object-cover object-center"
        src="https://dummyimage.com/720x400"
        alt="avatar"
      />
      <div className="p-4">
        <p className="text-2xl font-semibold text-gray-800">
          Curso de Odontología
        </p>
        <p className="text-sm font-normal text-gray-500">
          Curso de Odontología
        </p>
        <div className="mt-4">
          <a
            href="#"
            className="text-indigo-600 hover:text-indigo-500 font-semibold text-sm"
          >
            Ver más
          </a>
        </div>
      </div>
    </div>
  );
}
