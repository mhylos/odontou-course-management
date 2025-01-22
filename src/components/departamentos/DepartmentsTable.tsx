"use client";

import { departmentSchema, DepartmentsSchemaType } from "@/lib/zod";
import Table, { Cell, Row } from "../common/Table/Table";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FetchDropdown from "../common/FetchDropdown";
import { useEffect } from "react";
import Button from "../common/Button";
import { toast } from "react-toastify";
import { updateDepartments } from "@/services/departmentServices";

interface DepartmentsTableProps {
  departments: DepartmentsSchemaType;
}

export default function DepartmentsTable({
  departments,
}: DepartmentsTableProps) {
  const {
    control,
    formState: { isDirty, isSubmitting },
    reset,
    handleSubmit,
  } = useForm<DepartmentsSchemaType>({
    defaultValues: departments,
    resolver: zodResolver(departmentSchema),
  });

  const { fields } = useFieldArray({
    control,
    name: "departments",
  });

  const onSubmit = async (data: DepartmentsSchemaType) => {
    return new Promise(async (resolve) => {
      await updateDepartments(data);
      toast.update("save-changes-toast", {
        isLoading: false,
        type: "success",
        render: "Cambios guardados",
        autoClose: 2000,
      });
      reset(data);
      resolve(true);
    });
  };

  useEffect(() => {
    if (isDirty && !isSubmitting) {
      toast(
        <div>
          <p>¿Desea guardar los cambios?</p>
          <div className="flex gap-2 justify-center mt-2">
            <Button type="submit" form="departments-form">
              Guardar
            </Button>
            <Button className="!bg-gray-500" onClick={() => reset()}>
              Deshacer
            </Button>
          </div>
        </div>,
        { autoClose: false, toastId: "save-changes-toast", closeButton: false }
      );
    } else {
      if (isSubmitting) {
        toast.update("save-changes-toast", {
          isLoading: true,
          render: "Guardando cambios...",
        });
      } else toast.dismiss("save-changes-toast");
    }
  }, [isDirty, isSubmitting, reset]);

  return (
    <form id="departments-form" onSubmit={handleSubmit(onSubmit)}>
      <Table
        headers={[{ title: "Nombre" }, { title: "Director", width: "35%" }]}
        className="overflow-visible"
      >
        {fields.map(({ name, departmentId, directorId }, index) => (
          <Row key={departmentId} currentRow={departmentId}>
            <Cell>{name}</Cell>
            <Cell>
              <FetchDropdown
                className="w-full"
                control={control}
                name={`departments.${index}.directorId`}
                fetchUrl="/api/academics/options"
                selectedValue={directorId || undefined}
              />
            </Cell>
          </Row>
        ))}
      </Table>
    </form>
  );
}
