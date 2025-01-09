"use client";

import { createCourseSchema, createCourseSchemaType } from "@/lib/zod";
import { Controller, useForm } from "react-hook-form";
import Button from "@/components/common/Button";
import FloatingInput from "@/components/common/FloatingInput";
import FloatingTextarea from "@/components/common/FloatingTextarea";
import { createCourse, updateCourse } from "@/services/courseServices";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import BackButton from "@/components/common/BackButton";
import FetchDropdown from "@/components/common/FetchDropdown";
import FormFieldset from "@/components/Forms/FormFieldset";
import { toast } from "react-toastify";
import DepartmentForm from "./DepartmentForm";
import AcademicForm from "./AcademicForm";
import { useSWRConfig } from "swr";
import Decimal from "decimal.js";

interface CourseFormProps {
  className?: string;
  values?: createCourseSchemaType;
  editId?: number; // course id to edit
}

export default function CourseForm({
  className = "",
  values,
  editId,
}: CourseFormProps) {
  const form = useForm<createCourseSchemaType>({
    resolver: zodResolver(createCourseSchema),
    defaultValues: {
      enroll_value: 0,
      ...values,
    },
  });
  const [currentForm, setCurrentForm] = useState<
    "department" | "director" | "coordinator"
  >();
  const { mutate } = useSWRConfig();

  const hours = form.watch([
    "direct_hours",
    "indirect_hours",
    "inperson_hours",
    "online_hours",
  ]);

  const onSubmit = async (data: createCourseSchemaType) => {
    try {
      let response;
      if (editId) {
        response = await updateCourse(editId, data);
      } else {
        response = await createCourse(data);
      }
      toast(response.message, {
        type: response.success ? "success" : "error",
      });
      if (response.success) {
        form.reset(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleFormClose = () => {
    mutate("/api/department/options");
    mutate("/api/academics/options");
    setCurrentForm(undefined);
  };

  return (
    <>
      <form
        className={`space-y-2 ${
          !!currentForm ? "hidden" : ""
        } ${className}`.trimEnd()}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormFieldset legend="Información general">
          <FloatingInput
            label="Nombre"
            {...form.register("name")}
            autoComplete="off"
            error={form.formState.errors.name?.message}
          />
          <FloatingTextarea
            label="Objetivo"
            {...form.register("objective")}
            error={form.formState.errors.objective?.message}
          />
          <FloatingTextarea
            label="Comentarios"
            {...form.register("additional_comments")}
            error={form.formState.errors.additional_comments?.message}
          />
          <FetchDropdown
            label="Tipo de programa"
            name="program_fk"
            control={form.control}
            fetchUrl="/api/courses/programs/options"
            selectedValue={values?.program_fk}
            error={form.formState.errors.program_fk?.message}
          />

          <div className="grid grid-cols-2 gap-x-2 gap-y-5">
            <Controller
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <FloatingInput
                  label="Inicio"
                  type="date"
                  error={error?.message}
                  max={form.getValues("date_to")?.toISOString().split("T")[0]}
                  value={value ? value.toISOString().split("T")[0] : ""}
                  onChange={(e) => {
                    onChange(new Date(e.target.value));
                  }}
                />
              )}
              name="date_from"
              control={form.control}
            />

            <Controller
              render={({ field: { onChange, value } }) => (
                <FloatingInput
                  label="Termino"
                  type="date"
                  error={form.formState.errors.date_to?.message}
                  min={form.getValues("date_from")?.toISOString().split("T")[0]}
                  value={value ? value.toISOString().split("T")[0] : ""}
                  onChange={(e) => {
                    onChange(new Date(e.target.value));
                  }}
                />
              )}
              name="date_to"
              control={form.control}
            />
            <div className="col-start-2 flex items-center gap-2">
              <span>$</span>
              <Controller
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <FloatingInput
                    label="Valor del arancel"
                    error={error?.message}
                    value={
                      !isNaN(value) ? Number(value).toLocaleString("es-CL") : 0
                    }
                    onChange={(e) => {
                      const parsedValue = Number(
                        e.target.value.replace(/\D/g, "")
                      );
                      onChange(parsedValue);
                    }}
                  />
                )}
                name="enroll_value"
                control={form.control}
              />
            </div>
          </div>
        </FormFieldset>

        <FormFieldset legend={"Responsables"}>
          <FetchDropdown
            label="Departamento Ejecutor"
            name="department_fk"
            control={form.control}
            fetchUrl="/api/department/options"
            create={() => setCurrentForm("department")}
            selectedValue={values?.department_fk}
            error={form.formState.errors.department_fk?.message}
          />
          <FetchDropdown
            label="Director del programa"
            name="course_director_fk"
            control={form.control}
            fetchUrl="/api/academics/options"
            create={() => setCurrentForm("director")}
            selectedValue={values?.course_director_fk}
            error={form.formState.errors.course_director_fk?.message}
          />
          <FetchDropdown
            label="Coordinador del programa"
            name="coordinator_fk"
            control={form.control}
            fetchUrl="/api/academics/options"
            create={() => setCurrentForm("coordinator")}
            selectedValue={values?.coordinator_fk}
            error={form.formState.errors.coordinator_fk?.message}
          />
        </FormFieldset>
        <FormFieldset legend={"Horas"}>
          <div className="grid grid-cols-[1fr_1fr_auto] grid-rows-2 gap-2">
            <FloatingInput
              label="Horas directas"
              {...form.register("direct_hours")}
              autoComplete="off"
              error={form.formState.errors.direct_hours?.message}
            />
            <FloatingInput
              label="Horas indirectas"
              {...form.register("indirect_hours")}
              autoComplete="off"
              error={form.formState.errors.indirect_hours?.message}
            />
            <div className="row-span-2 flex items-center justify-center flex-col gap-2">
              <span>
                {Decimal.sum(
                  ...hours.map((hour) => Number(hour) || 0)
                ).toString()}
              </span>
              <span className="text-xs text-gray-500">Horas totales</span>
            </div>
            <FloatingInput
              label="Horas presenciales"
              {...form.register("inperson_hours")}
              autoComplete="off"
              error={form.formState.errors.inperson_hours?.message}
            />
            <FloatingInput
              label="Horas online"
              {...form.register("online_hours")}
              autoComplete="off"
              error={form.formState.errors.online_hours?.message}
            />
          </div>
        </FormFieldset>
        <div className="flex gap-2 mt-2">
          <BackButton className="flex cursor-pointer">
            <span className="button !bg-gray-500">Cancelar</span>
          </BackButton>
          <Button type="submit" disabled={!!currentForm}>
            Guardar
          </Button>
        </div>
      </form>
      {currentForm &&
        (currentForm == "department" ? (
          <DepartmentForm onClose={handleFormClose} />
        ) : (
          <AcademicForm onClose={handleFormClose} />
        ))}
    </>
  );
}
