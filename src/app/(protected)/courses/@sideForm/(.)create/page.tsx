"use client";

import AcademicForm from "@/components/common/Forms/AcademicForm";
import CreateCourseForm from "@/components/common/Forms/CreateCourseForm";
import { useState } from "react";

export default function CreateCourse() {
  const [currentForm, setCurrentForm] = useState("");

  function Form({ currentForm }: { currentForm: string }) {
    switch (currentForm) {
      case "department":
        return;
      case "director":
        return <AcademicForm onClose={() => setCurrentForm("")} />;
      case "coordinator":
        return <AcademicForm onClose={() => setCurrentForm("")} />;
      default:
        return null;
    }
  }

  return (
    <>
      <CreateCourseForm
        departmentCreate={() => setCurrentForm("department")}
        directorCreate={() => setCurrentForm("director")}
        coordinatorCreate={() => setCurrentForm("coordinator")}
        className={currentForm ? "hidden" : ""}
      />
      <Form currentForm={currentForm} />
    </>
  );
}
