"use client";

import { useCourse } from "@/app/context/courseProvider";
import SearchInput from "@/components/common/SearchInput";
import Table from "@/components/common/Table/Table";
import { convertToMoney, formatDate } from "@/lib/utils";
import { removeEnrollByRut } from "@/services/studentServices";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-toastify";
import { format, calculateDv } from "rutility";

export default function CourseStudents() {
  const [rowChanging, setRowChanging] = useState<number>();
  const { course } = useCourse();

  if (!course) return;

  const ViewDetails = (rut: number) => (
    <Link
      href={`students/${rut}`}
      className="bg-secondary text-white grid place-items-center h-full aspect-square p-2 rounded"
    >
      <span className="icon-[mdi--account-details] text-xl" />
    </Link>
  );

  const removeStudent = (rut: number) => {
    const handleRemove = async () => {
      setRowChanging(rut);
      const response = await removeEnrollByRut(rut, course.id);
      if (response) {
        toast.success("Estudiante eliminado con éxito");
        course.enrolled = course.enrolled.filter(
          (enroll) => enroll.student.rut !== rut
        );
      } else {
        toast.error("Error al eliminar estudiante");
      }
      setRowChanging(undefined);
    };

    return (
      <button
        onClick={handleRemove}
        className="bg-red-400 text-white grid place-items-center h-full aspect-square p-2 rounded"
      >
        <span className="icon-[mdi--account-remove-outline] text-xl"></span>
      </button>
    );
  };

  const Actions = (rut: number) => {
    if (rowChanging === rut) {
      return <span className="icon-[line-md--loading-loop] text-2xl" />;
    }
    return (
      <div className="flex gap-2">
        {ViewDetails(rut)}
        {removeStudent(rut)}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-2 w-full h-full">
      <div className="flex gap-2">
        <SearchInput label={"Buscar"} className="flex-1" />
        <Link
          href={"students/add"}
          className="group bg-primary text-white rounded place-items-center flex flex-col justify-center px-2"
        >
          <div>
            <span className="icon-[ph--student] text-2xl group-hover:icon-[ph--student-fill]" />
            <span className="icon-[ph--plus] text-xs align-top group-hover:icon-[ph--plus-bold]" />
          </div>
          <span className="col-span-2 text-xs">(Agregar estudiante)</span>
        </Link>
      </div>
      <Table
        headers={[
          "Nombre",
          "RUT",
          "Estado",
          "N° Boleta",
          "Fecha pago",
          "Dcto.",
          "Total",
          "Acciones",
        ]}
        rows={course?.enrolled.map((enroll) => [
          enroll.student.name,
          format.dotDash(
            enroll.student.rut.toString() + calculateDv(enroll.student.rut)
          ),
          enroll.status ? "Matriculado" : "No matriculado",
          enroll.ticket_num,
          enroll.payment_date ? formatDate(enroll.payment_date) : "Sin pago",
          `${enroll.discount} %`,
          convertToMoney(enroll.total),
          Actions(enroll.student.rut),
        ])}
      />
    </div>
  );
}
