import { createAcademicSchema, createAcademicSchemaType } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, Form, useForm } from "react-hook-form";
import Button from "@/components/common/Button";
import FetchDropdown from "@/components/common/FetchDropdown";
import FloatingInput from "@/components/common/FloatingInput";
import FormFieldset from "@/components/common/Forms/FormFieldset";
import Checkbox from "@/components/common/Checkbox";
import { runFormatter } from "@/lib/utils";
import { createAcademic } from "@/services/academicsServices";

interface AcademicFormProps {
  className?: string;
  onClose: () => void;
}

export default function AcademicForm({
  className,
  onClose,
}: AcademicFormProps) {
  const form = useForm<createAcademicSchemaType>({
    resolver: zodResolver(createAcademicSchema),
  });

  const onSubmit = async (data: createAcademicSchemaType) => {
    try {
      await createAcademic(data);
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Form
      control={form.control}
      className={className}
      onSubmit={({ data }) => onSubmit(data)}
    >
      <FormFieldset legend="Datos personales">
        <Controller
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <FloatingInput
              label="RUT"
              errors={error}
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
          errors={form.formState.errors.name}
        />
        <FloatingInput
          label="Email"
          {...form.register("email")}
          errors={form.formState.errors.email}
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
          label="Pertenece a la facultad"
          {...form.register("isFOUCH")}
        />
      </FormFieldset>

      <div className="flex gap-2">
        <Button className="bg-gray-400" onClick={onClose}>
          Volver
        </Button>
        <Button type="submit">Guardar</Button>
      </div>
    </Form>
  );
}
