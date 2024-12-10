"use client";

import { Enroll } from "@/lib/definitions";
import { getCourseByIdResponse } from "@/services/courseServices";
import { createContext, useContext, useState } from "react";

type CourseContextType = {
  course: Awaited<getCourseByIdResponse> | undefined;
  addStudentToCourse: (enroll: Enroll) => void;
};

const CourseContext = createContext<CourseContextType>({
  course: undefined,
  addStudentToCourse: () => {},
});

export function CourseProvider({
  children,
  course,
}: {
  children: React.ReactNode;
  course: Awaited<getCourseByIdResponse>;
}) {
  const [state, setState] = useState<Awaited<getCourseByIdResponse>>(course);

  const addStudentToCourse = (enroll: Enroll) => {
    setState((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        enrolled: [...prev.enrolled, enroll],
      };
    });
  };

  return (
    <CourseContext.Provider
      value={{
        course: state,
        addStudentToCourse: addStudentToCourse,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
}

export const useCourse = (): CourseContextType => useContext(CourseContext);
