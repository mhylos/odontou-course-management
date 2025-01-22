import { createAcademicSchema, CreateAcademicSchemaType } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import Button from "@/components/common/Button";
import FetchDropdown from "@/components/common/FetchDropdown";
import FloatingInput from "@/components/common/FloatingInput";
import FormFieldset from "@/components/forms/FormFieldset";
import Checkbox from "@/components/common/Checkbox";
import { runFormatter } from "@/lib/utils";
import { createAcademic } from "@/services/academicsServices";
import { toast } from "react-toastify";

interface AcademicFormProps {
  className?: string;
  onClose: () => void;
}

export default function AcademicForm({
  className,
  onClose,
}: AcademicFormProps) {
  const form = useForm<CreateAcademicSchemaType>({
    resolver: zodResolver(createAcademicSchema),
  });

  const onSubmit = async (data: CreateAcademicSchemaType) => {
    try {
      const response = await createAcademic(data);
      toast(response.message, { type: response.success ? "success" : "error" });
      if (response.success) {
        onClose();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form
      className={`flex flex-col gap-2 ${className}`}
      onSubmit={form.handleSubmit(onSubmit)}
      id={"academic-form"}
    >
      <FormFieldset legend="Datos personales">
        <Controller
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <FloatingInput
              label="RUT"
              error={error?.message}
              value={value || ""}
              onChange={(value) => {
                const formatted = runFormatter(value.currentTarget.value);
                onChange(formatted);
              }}
            />
          )}
          name={"rut"}
          control={form.control}
        />
        <FloatingInput
          label="Nombre"
          {...form.register("name")}
          error={form.formState.errors.name?.message}
        />
        <FloatingInput
          label="Email"
          {...form.register("email")}
          error={form.formState.errors.email?.message}
        />
      </FormFieldset>
      <FormFieldset legend="Datos académicos">
        <FetchDropdown
          name="department_fk"
          label="Departamento perteneciente"
          control={form.control}
          fetchUrl="/api/department/options"
        />
        <Checkbox
          id="isFOUCH"
          label="Pertenece a la facultad"
          {...form.register("isFOUCH")}
        />
      </FormFieldset>

      <div className="flex gap-2">
        <Button className="!bg-gray-500 !w-max" onClick={onClose} type="button">
          Volver
        </Button>
        <Button type="submit" form="academic-form">
          Guardar
        </Button>
      </div>
    </form>
  );
}
