"use client";

import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal/Modal";
import ModalHeader from "@/components/common/Modal/ModalHeader";
import EnrollForm from "@/components/forms/EnrollForm";
import StudentForm from "@/components/forms/StudentForm";
import {
  enrollSchema,
  EnrollSchemaType,
  studentSchema,
  StudentSchemaType,
} from "@/lib/zod";
import { upsertStudentEnroll } from "@/services/studentServices";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

interface EnrollModalProps {
  course: { id: number; enroll_value: number };
  values?: { student: StudentSchemaType; enroll: EnrollSchemaType };
}

export default function EnrollModal({ course, values }: EnrollModalProps) {
  const studentForm = useForm<StudentSchemaType>({
    resolver: zodResolver(studentSchema),
    defaultValues: values?.student,
  });
  const enrollForm = useForm<EnrollSchemaType>({
    resolver: zodResolver(enrollSchema),
    defaultValues: values?.enroll ?? {
      status: false,
      discount: "0",
      total: course?.enroll_value,
      installments: 1,
      paid: 0,
      enroll_type: "autofinanciado",
    },
  });
  console.log(values);

  const [isLoading, setIsLoading] = useState(false);

  if (!course) {
    return null;
  }

  const handleSave = async () => {
    setIsLoading(true);
    const studentValues = studentForm.getValues();
    const enrollValues = enrollForm.getValues();
    const studentValuesParsed = studentSchema.safeParse(
      studentForm.getValues()
    );
    const enrollValuesParsed = enrollSchema.safeParse(enrollForm.getValues());

    if (!studentValuesParsed.success || !enrollValuesParsed.success) {
      const errors = {
        ...studentValuesParsed.error?.errors,
        ...enrollValuesParsed.error?.errors,
      };
      toast.error(errors[0].message);

      setIsLoading(false);
      return;
    }

    // const formData = new FormData();
    // formData.append("file", enrollValuesParsed.data.file || "");
    // formData.append("student", JSON.stringify(studentValuesParsed.data));
    // enrollValuesParsed.data.file = null;
    // formData.append("enroll", JSON.stringify(enrollValuesParsed.data));

    const response = await upsertStudentEnroll(
      course.id,
      studentValuesParsed.data,
      enrollValuesParsed.data
    );

    if (response.success) {
      studentForm.reset(studentValues);
      enrollForm.reset(enrollValues);
    }

    toast(response.message, { type: response.success ? "success" : "error" });
    setIsLoading(false);
  };

  return (
    <Modal
      prevPath={`/cursos/detalles/${course.id}/estudiantes`}
      className="w-3/4"
    >
      <ModalHeader prevPath={`/cursos/detalles/${course.id}/estudiantes`}>
        <div>
          <h3 className="text-4xl">
            {values ? "Modificación matrícula" : "Nueva matrícula"}
          </h3>
        </div>
      </ModalHeader>
      <div className="w-full h-full grid grid-cols-2 gap-2">
        <StudentForm
          courseId={course.id}
          form={studentForm}
          disableRunInput={!!values}
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
