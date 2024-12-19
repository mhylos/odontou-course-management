import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import { Student } from "@/lib/definitions";
import Section from "./Section";
import SectionItem from "./SectionItem";
import { useState } from "react";
import { capitalize, runFormatter } from "@/lib/utils";
import { isStudentEnrolled } from "@/services/courseServices";
import Dropdown from "@/components/common/Dropdown";
import { studentSchemaType } from "@/lib/zod";
import { Controller, UseFormReturn } from "react-hook-form";
import { Genres } from "@prisma/client";

interface StudentFormProps {
  student?: Partial<Student>;
  courseId: number;
  form: UseFormReturn<studentSchemaType>;
}

const genreOptions = [
  { value: Genres.masculino, name: capitalize(Genres.masculino) },
  { value: Genres.femenino, name: capitalize(Genres.femenino) },
];

export default function StudentForm({
  student,
  courseId,
  form,
}: StudentFormProps) {
  const [creatingStudent, setCreatingStudent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInput = (rut: string) => {
    if (!creatingStudent) {
      form.reset();
      form.setValue("rut", rut);
    }
    if (rut.length < 11) {
      return;
    }

    setIsLoading(true);
    handleSearch(rut);
  };

  const handleSearch = async (rut: string) => {
    const student = await isStudentEnrolled(courseId, rut);
    setIsLoading(false);
    if (!student) {
      return;
    }
    form.setValue("name", student.name);
    form.setValue("email", student.email);
    form.setValue("genre", student.genre);
    triggerValidation();
  };

  const triggerValidation = async () => {
    await form.trigger();
  };

  return (
    <Section title="Datos personales">
      <div className="flex">
        <SectionItem title="RUT" className="flex-1">
          <div className="items-center flex gap-2">
            <Controller
              render={({ field: { onChange, value } }) => (
                <Input
                  value={value || ""}
                  onChange={(e) => {
                    const rut = runFormatter(e.currentTarget.value);
                    onChange(rut);
                    handleInput(rut);
                    triggerValidation();
                  }}
                />
              )}
              name="rut"
              control={form.control}
            />
            <Button
              disabled={isLoading || !!student || creatingStudent}
              className={`text-xl w-max`}
              onClick={() => {
                setCreatingStudent(true);
              }}
            >
              <span
                className={
                  isLoading
                    ? "icon-[line-md--loading-loop]"
                    : student
                    ? "icon-[ph--check-bold]"
                    : "icon-[ph--plus-bold]"
                }
              />
            </Button>
          </div>
        </SectionItem>
      </div>
      <SectionItem title="Nombre">
        <Controller
          render={({ field: { onChange, value } }) => (
            <Input
              disabled={!creatingStudent}
              value={value ?? ""}
              onChange={(e) => {
                onChange(e);
                triggerValidation();
              }}
            />
          )}
          name="name"
          control={form.control}
        />
      </SectionItem>
      <SectionItem title="Email">
        <Controller
          render={({ field: { onChange, value } }) => (
            <Input
              disabled={!creatingStudent}
              value={value ?? ""}
              onChange={(e) => {
                onChange(e);
                triggerValidation();
              }}
            />
          )}
          name="email"
          control={form.control}
        />
      </SectionItem>
      <SectionItem title="Género">
        <Controller
          render={({ field: { onChange, value } }) => (
            <Dropdown
              disabled={!creatingStudent}
              options={genreOptions}
              selected={genreOptions.find((option) => option.value === value)}
              onChange={(option) => {
                onChange(option.value);
                triggerValidation();
              }}
            />
          )}
          name="genre"
          control={form.control}
        />
      </SectionItem>
    </Section>
  );
}
