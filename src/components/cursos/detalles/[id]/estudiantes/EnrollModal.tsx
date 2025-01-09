"use client";

import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal/Modal";
import ModalHeader from "@/components/common/Modal/ModalHeader";
import EnrollForm from "@/components/Forms/EnrollForm";
import StudentForm from "@/components/Forms/StudentForm";
import {
  enrollSchema,
  enrollSchemaType,
  studentSchema,
  studentSchemaType,
} from "@/lib/zod";
import { upsertStudentEnroll } from "@/services/studentServices";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

interface EnrollModalProps {
  course: { id: number; enroll_value: number };
  values?: { student: studentSchemaType; enroll: enrollSchemaType };
}

export default function EnrollModal({ course, values }: EnrollModalProps) {
  const studentForm = useForm<studentSchemaType>({
    resolver: zodResolver(studentSchema),
    defaultValues: values?.student,
  });
  const enrollForm = useForm<enrollSchemaType>({
    resolver: zodResolver(enrollSchema),
    defaultValues: values?.enroll ?? {
      status: false,
      discount: 0,
      total: course?.enroll_value,
      installments: 1,
      paid: 0,
      enroll_type: "autofinanciado",
    },
  });
  const [isLoading, setIsLoading] = useState(false);

  if (!course) {
    return null;
  }

  const handleSave = async () => {
    setIsLoading(true);
    const studentValues = studentSchema.safeParse(studentForm.getValues());
    const enrollValues = enrollSchema.safeParse(enrollForm.getValues());

    if (!studentValues.success || !enrollValues.success) {
      const errors = {
        ...studentValues.error?.errors,
        ...enrollValues.error?.errors,
      };
      toast.error(errors[0].message);

      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("file", enrollValues.data.file || "");
    formData.append("student", JSON.stringify(studentValues.data));
    enrollValues.data.file = null;
    formData.append("enroll", JSON.stringify(enrollValues.data));

    const response = await upsertStudentEnroll(course.id, formData);

    toast(response.message, { type: response.success ? "success" : "error" });
    setIsLoading(false);
  };

  return (
    <Modal prevPath={`/cursos/detalles/${course.id}/estudiantes`}>
      <ModalHeader prevPath={`/cursos/detalles/${course.id}/estudiantes`}>
        <div>
          <h3 className="text-4xl">
            {values ? "Modificación matrícula" : "Nueva matrícula"}
          </h3>
        </div>
      </ModalHeader>
      <div className="w-full h-full grid grid-cols-2 gap-2">
        <StudentForm courseId={course.id} form={studentForm} />
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
