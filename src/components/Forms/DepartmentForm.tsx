import { createDepartmentSchema, CreateDepartmentSchemaType } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Button from "@/components/common/Button";
import FetchDropdown from "@/components/common/FetchDropdown";
import FloatingInput from "@/components/common/FloatingInput";
import FormFieldset from "@/components/forms/FormFieldset";
import { createDepartment } from "@/services/departmentServices";
import { toast } from "react-toastify";

interface DepartmentFormProps {
  className?: string;
  onClose: () => void;
}

export default function DepartmentForm({
  className,
  onClose,
}: DepartmentFormProps) {
  const form = useForm<CreateDepartmentSchemaType>({
    resolver: zodResolver(createDepartmentSchema),
  });

  const onSubmit = async (data: CreateDepartmentSchemaType) => {
    try {
      const response = await createDepartment(data);
      toast(response.message, { type: response.success ? "success" : "error" });
      if (response.success) {
        onClose();
        return;
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form
      className={`flex flex-col gap-2 ${className}`}
      onSubmit={form.handleSubmit(onSubmit)}
      id="department-form"
    >
      <FormFieldset legend="Departamento">
        <FloatingInput
          label="Nombre"
          {...form.register("name")}
          error={form.formState.errors.name?.message}
        />

        <FetchDropdown
          name="director_fk"
          label="Director del departamento"
          control={form.control}
          fetchUrl="/api/academics/options"
          error={form.formState.errors.director_fk?.message}
        />
      </FormFieldset>

      <div className="flex gap-2">
        <Button className="!bg-gray-500 !w-max" onClick={onClose} type="button">
          Volver
        </Button>
        <Button type="submit" form="department-form">
          Guardar
        </Button>
      </div>
    </form>
  );
}
