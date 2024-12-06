"use client";

import { CourseResponse } from "@/services/courseServices";
import { createContext, useContext } from "react";

const CourseContext = createContext<Awaited<CourseResponse> | undefined>(
  undefined
);

export function CourseProvider({
  children,
  course,
}: {
  children: React.ReactNode;
  course: Awaited<CourseResponse>;
}) {
  return (
    <CourseContext.Provider value={course}>{children}</CourseContext.Provider>
  );
}

export const useCourse = () => useContext(CourseContext);
