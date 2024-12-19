"use client";

import { createCourseSchema, createCourseSchemaType } from "@/lib/zod";
import { Form, useForm } from "react-hook-form";
import Button from "@/components/common/Button";
import FloatingInput from "@/components/common/FloatingInput";
import FloatingTextarea from "@/components/common/FloatingTextarea";
import { createCourse } from "@/services/courseServices";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import BackButton from "@/components/common/BackButton";
import FetchDropdown from "@/components/common/FetchDropdown";
import FormFieldset from "@/components/common/Forms/FormFieldset";
import { toast } from "react-toastify";

interface CreateCourseFormProps {
  departmentCreate: () => void;
  directorCreate: () => void;
  coordinatorCreate: () => void;
  className?: string;
}

export default function CreateCourseForm({
  departmentCreate,
  directorCreate,
  coordinatorCreate,
  className = "",
}: CreateCourseFormProps) {
  const form = useForm<createCourseSchemaType>({
    resolver: zodResolver(createCourseSchema),
  });

  const [totalHours, setTotalHours] = useState(0);

  const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hoursNames = [
      "direct_hours",
      "indirect_hours",
      "inperson_hours",
      "online_hours",
    ];
    let total = Number(e.target.value);

    for (const name of hoursNames) {
      if (e.target.name !== name) {
        total += Number(form.getValues(name as keyof createCourseSchemaType));
      }
    }

    setTotalHours(total);
  };

  const onSubmit = async (data: createCourseSchemaType) => {
    try {
      const response = await createCourse(data);
      toast(response.message, {
        type: response.success ? "success" : "error",
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Form
      control={form.control}
      className={`space-y-2 ${className}`.trimEnd()}
      onSubmit={({ data }) => onSubmit(data)}
    >
      <FormFieldset legend="Información general">
        <FloatingInput label="Nombre" {...form.register("name")} />
        <FloatingTextarea label="Objetivo" {...form.register("objective")} />
        <FloatingTextarea label="Comentarios" />
        <FetchDropdown
          label="Tipo de programa"
          name="program_fk"
          control={form.control}
          fetchUrl="/api/courses/programs/options"
          className="mt-2"
        />

        <div className="grid grid-cols-2 gap-x-2 gap-y-5">
          <FloatingInput
            label="Inicio"
            type="date"
            {...form.register("date_from")}
          />
          <FloatingInput
            label="Término"
            type="date"
            {...form.register("date_to")}
          />
          <div className="col-start-2 flex items-center gap-2">
            <span>$</span>
            <FloatingInput
              label="Valor del arancel"
              {...form.register("enroll_value")}
              onFocus={(e) => {
                e.target.value = e.target.value.replace(/\D/g, "");
              }}
              onBlur={(e) => {
                e.target.value = Number(e.target.value).toLocaleString("es-CL");
              }}
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
          create={departmentCreate}
          className="mt-2"
        />
        <FetchDropdown
          label="Director del programa"
          name="course_director_fk"
          control={form.control}
          fetchUrl="/api/academics/options"
          create={directorCreate}
          className="mt-2"
        />
        <FetchDropdown
          label="Coordinador del programa"
          name="coordinator_fk"
          control={form.control}
          fetchUrl="/api/academics/options"
          create={coordinatorCreate}
          className="mt-2"
        />
      </FormFieldset>
      <FormFieldset legend={"Horas"}>
        <div className="grid grid-cols-[1fr_1fr_auto] grid-rows-2 gap-2">
          <FloatingInput
            label="Horas directas"
            {...form.register("direct_hours")}
            type="number"
            onInput={handleHourChange}
          />
          <FloatingInput
            label="Horas indirectas"
            {...form.register("indirect_hours")}
            type="number"
            onInput={handleHourChange}
          />
          <div className="row-span-2 flex items-center justify-center flex-col gap-2">
            <span>{totalHours}</span>
            <span className="text-xs text-gray-500">Horas totales</span>
          </div>
          <FloatingInput
            label="Horas presenciales"
            {...form.register("inperson_hours")}
            type="number"
            onInput={handleHourChange}
          />
          <FloatingInput
            label="Horas online"
            {...form.register("online_hours")}
            type="number"
            onInput={handleHourChange}
          />
        </div>
      </FormFieldset>
      <div className="flex gap-2 mt-2">
        <BackButton>
          <Button className="bg-gray-400">Cancelar</Button>
        </BackButton>
        <Button type="submit">Guardar</Button>
      </div>
    </Form>
  );
}
