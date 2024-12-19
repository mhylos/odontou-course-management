"use client";

import { useCourse } from "@/app/context/courseProvider";
import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal/Modal";
import ModalHeader from "@/components/common/Modal/ModalHeader";
import EnrollForm from "@/components/courses/[id]/EnrollForm";
import StudentForm from "@/components/courses/[id]/StudentForm";
import { Student } from "@/lib/definitions";
import {
  enrollSchema,
  enrollSchemaType,
  studentSchema,
  studentSchemaType,
} from "@/lib/zod";
import { addStudentToCourse } from "@/services/studentServices";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

export default function AddStudent() {
  const { course } = useCourse();
  const router = useRouter();
  const studentForm = useForm<studentSchemaType>({
    resolver: zodResolver(studentSchema),
  });
  const enrollForm = useForm<enrollSchemaType>({
    resolver: zodResolver(enrollSchema),
    defaultValues: {
      status: false,
      discount: 0,
      total: course?.enroll_value,
    },
  });
  const [student] = useState<Partial<Student>>();
  const [isLoading, setIsLoading] = useState(false);

  if (!course) {
    return null;
  }

  const validateEnroll = async () => {
    await studentForm.trigger();
    await enrollForm.trigger();

    if (!studentForm.formState.isValid) {
      const error = Object.values(studentForm.formState.errors)[0];
      toast.error(error?.message);
      setIsLoading(false);
      return false;
    } else if (!enrollForm.formState.isValid) {
      const error = Object.values(enrollForm.formState.errors)[0];
      toast.error(error?.message);
      console.log(enrollForm.formState.errors);

      setIsLoading(false);
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    setIsLoading(true);
    if (!(await validateEnroll())) return;
    const studentValues = studentSchema.parse(studentForm.getValues());
    const enrollValues = enrollSchema.parse(enrollForm.getValues());

    await addStudentToCourse(course.id, studentValues, enrollValues);

    // addEnrollToContext(response);
    toast.success("Estudiante guardado");
    closeModal();
  };

  const closeModal = () => {
    router.back();
  };

  return (
    <Modal onClose={() => closeModal()}>
      <ModalHeader onClose={() => closeModal()}>
        <div>
          <h3 className="text-4xl">Nuevo estudiante</h3>
        </div>
      </ModalHeader>
      <div className="w-full h-full grid grid-cols-2 gap-2">
        <StudentForm
          courseId={course.id}
          student={student}
          form={studentForm}
        />
        <EnrollForm
          enrollValue={course.enroll_value}
          disabled={!studentForm.formState.isValid}
          form={enrollForm}
        />
      </div>
      <div className="w-full flex justify-end">
        <Button disabled={isLoading} className="max-w-max" onClick={handleSave}>
          <span className={isLoading ? "icon-[line-md--loading-loop]" : ""}>
            {isLoading ? "" : "Guardar"}
          </span>
        </Button>
      </div>
    </Modal>
  );
}
