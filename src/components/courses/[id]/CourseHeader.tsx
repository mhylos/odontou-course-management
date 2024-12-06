"use client";

import { useCourse } from "@/app/context/courseProvider";
import TitlePage from "@/components/common/TitlePage";

export default function CourseHeader() {
  const course = useCourse();

  return <TitlePage>{course?.name}</TitlePage>;
}
