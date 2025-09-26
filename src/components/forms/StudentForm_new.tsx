"use client";

import Button from "@/components/common/Button";
import { capitalize, runFormatter } from "@/lib/utils";
import Dropdown from "@/components/common/Dropdown";
import { studentSchema, StudentSchemaType } from "@/lib/zod";
import { Controller, useForm } from "react-hook-form";
import { Genres } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";
import FloatingInput from "../common/FloatingInput";
import FormFieldset from "./FormFieldset";
import { toast } from "react-toastify";
import { upsertStudent } from "@/services/studentServices";

interface StudentFormProps {
  defaultValues?: Partial<StudentSchemaType>;
  onClose?: () => void;
}

const genreOptions = [
  { value: Genres.masculino, name: capitalize(Genres.masculino) },
  { value: Genres.femenino, name: capitalize(Genres.femenino) },
];

export default function StudentForm({
  defaultValues,
  onClose,
}: StudentFormProps) {
  const form = useForm<StudentSchemaType>({
    defaultValues: {
      rut: "",
      ...defaultValues,
    },
    resolver: zodResolver(studentSchema),
  });

  const isUpdate = defaultValues?.rut ? true : false;

  const onSubmit = async (data: StudentSchemaType) => {
    try {
      return new Promise(async (resolve) => {
        const response = await upsertStudent(data);
        toast(response.message, {
          type: response.success ? "success" : "error",
        });
        if (response.success) {
          if (onClose) onClose();
        }
        resolve(response);
      });
    } catch (error) {
      console.error(error);
      toast("Error al guardar el estudiante", { type: "error" });
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <FormFieldset legend="Datos personales">
        <Controller
          disabled={isUpdate}
          render={({ field, fieldState: { error } }) => (
            <FloatingInput
              {...field}
              label="RUT"
              error={error?.message}
              onChange={(value) => {
                const formatted = runFormatter(value.currentTarget.value);
                field.onChange(formatted);
              }}
            />
          )}
          name={"rut"}
          control={form.control}
        />
        <FloatingInput
          label="Nombre completo"
          {...form.register("name")}
          error={form.formState.errors.name?.message}
        />
        <FloatingInput
          label="Email"
          {...form.register("email")}
          error={form.formState.errors.email?.message}
        />
        <Controller
          render={({
            field: { onChange, value, name },
            fieldState: { error },
          }) => (
            <Dropdown
              error={error?.message}
              label="Género"
              id={name}
              options={genreOptions}
              selected={genreOptions.find((option) => option.value === value)}
              onChange={(option) => {
                onChange(option.value);
              }}
            />
          )}
          name="genre"
          control={form.control}
        />
      </FormFieldset>
      <div className="flex gap-4 justify-end">
        {onClose && (
          <Button className="bg-gray-500 w-max" onClick={onClose} type="button">
            Volver
          </Button>
        )}
        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="w-full"
        >
          {isUpdate ? "Actualizar estudiante" : "Agregar estudiante"}
        </Button>
      </div>
    </form>
  );
}
