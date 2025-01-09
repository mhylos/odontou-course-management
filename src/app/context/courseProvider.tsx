"use client";

import { getCourseByIdResponse } from "@/services/courseServices";
import { createContext, useContext, useState } from "react";

type CourseContextType = {
  course: Awaited<getCourseByIdResponse> | undefined;
};

const CourseContext = createContext<CourseContextType>({
  course: undefined,
});

export function CourseProvider({
  children,
  course,
}: {
  children: React.ReactNode;
  course: Awaited<getCourseByIdResponse>;
}) {
  const [state] = useState<Awaited<getCourseByIdResponse>>(course);

  return (
    <CourseContext.Provider
      value={{
        course: state,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
}

export const useCourse = (): CourseContextType => useContext(CourseContext);
