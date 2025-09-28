"use client";

import { studentEnrollSchema, StudentEnrollSchemaType } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import FetchDropdown from "../common/FetchDropdown";
import FormFieldset from "@/components/forms/FormFieldset";
import Button from "../common/Button";
import { toast } from "react-toastify";
import { useState } from "react";
import { useSWRConfig } from "swr";
import LoadingSpinner from "../common/LoadingSpinner";
import { upsertStudentEnroll } from "@/services/studentServices";
import StudentForm from "./StudentForm_new";
import {
  capitalize,
  convertToMoney,
  decimalNumberFormat,
  runFormatter,
} from "@/lib/utils";
import Dropdown from "../common/Dropdown";
import FloatingInput from "../common/FloatingInput";
import { formatInTimeZone } from "date-fns-tz";
import Decimal from "decimal.js";
import Checkbox from "../common/Checkbox";
import { EnrollTypes, StudentStatus } from "@prisma/client";
import FloatingTextarea from "../common/FloatingTextarea";

interface StudentEnrollFormProps {
  values?: Partial<StudentEnrollSchemaType>;
  courseId: number;
  enrollValue: number;
}

const enrollTypes = (
  Object.keys(EnrollTypes) as Array<keyof typeof EnrollTypes>
).map((key) => {
  return { value: key, name: capitalize(EnrollTypes[key]) };
});

const statusOptions = (
  Object.keys(StudentStatus) as Array<keyof typeof StudentStatus>
).map((key) => {
  return { value: key, name: capitalize(StudentStatus[key]) };
});

export default function StudentEnrollForm({
  values,
  courseId,
  enrollValue,
}: StudentEnrollFormProps) {
  const form = useForm<StudentEnrollSchemaType>({
    resolver: zodResolver(studentEnrollSchema),
    defaultValues: {
      ...values,
      enroll: {
        ...values?.enroll,
        total: values?.enroll?.total ?? enrollValue,
        discount: values?.enroll?.discount.toString() ?? "0",
        // @ts-expect-error the values requires date in "yyyy-MM-dd" format string, but the input internally manages Date objects
        payment_date: formatInTimeZone(
          values?.enroll?.payment_date ?? new Date(),
          "UTC",
          "yyyy-MM-dd"
        ),
      },
    },
  });

  const [createStudent, setCreateStudent] = useState(false);
  const { mutate } = useSWRConfig();
  const isUpdate = !!values;

  const onSubmit = async (data: StudentEnrollSchemaType) => {
    try {
      return new Promise(async (resolve) => {
        const response = await upsertStudentEnroll(courseId, data);
        toast(response.message, {
          type: response.success ? "success" : "error",
        });
        resolve(response);
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleFormClose = () => {
    mutate("/api/students/options");
    setCreateStudent(false);
  };

  const [isInstallments, setInstallments] = useState(
    form.getValues("enroll.installments") > 1
  );

  const installments = form.watch("enroll.installments");
  const isRefund = form.watch("enroll.refund");

  return (
    <>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={createStudent ? "hidden" : ""}
      >
        <FormFieldset legend="Estudiante">
          <Controller
            name="rut"
            control={form.control}
            render={({
              field: { value, onChange, name },
              fieldState: { error },
            }) => (
              <FetchDropdown
                label="Selección del estudiante por RUT"
                id={name}
                fetchUrl="/api/students/options"
                fetchDefaultUrl={
                  values ? `/api/students/options/${values.rut}` : undefined
                }
                error={error?.message}
                filterName="rut"
                create={() => setCreateStudent(true)}
                selectedValue={value}
                onChange={(option) => onChange(option.value)}
                clearable={!isUpdate}
                disabled={isUpdate}
                inputProps={{
                  onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                    const formatted = runFormatter(e.currentTarget.value);
                    e.currentTarget.value = formatted;
                    return e;
                  },
                }}
              />
            )}
          />
        </FormFieldset>
        <FormFieldset legend="Datos de la matrícula">
          <div className="w-full grid grid-cols-2 gap-2 items-center">
            <Controller
              name="enroll.detailed_status"
              control={form.control}
              render={({
                field: { value, onChange, name },
                fieldState: { error },
              }) => (
                <Dropdown
                  label="Estado de la matrícula"
                  id={name}
                  options={statusOptions}
                  error={error?.message}
                  selected={statusOptions.find(
                    (option) => option.value == value
                  )}
                  onChange={(option) => onChange(option.value)}
                />
              )}
            />
            <FloatingInput
              {...form.register("enroll.ticket_num")}
              label="N° boleta"
              type="number"
              error={form.formState.errors.enroll?.ticket_num?.message}
            />

            <FloatingInput
              label="Fecha de pago"
              type="date"
              error={form.formState.errors.enroll?.payment_date?.message}
              {...form.register("enroll.payment_date", {})}
            />
            <div className="relative">
              <Controller
                render={({ field, fieldState: { error } }) => {
                  const percentage = new Decimal(
                    !field.value ? 0 : field.value
                  ).dividedBy(100);
                  const moneyDiscounted = percentage.times(enrollValue);
                  return (
                    <FloatingInput
                      {...field}
                      label={`Descuento (-${convertToMoney(
                        moneyDiscounted.toNumber()
                      )})`}
                      type="text"
                      value={field.value ?? "0"}
                      error={error?.message}
                      onChange={(e) => {
                        const value = decimalNumberFormat(e.target.value);
                        const n = new Decimal(!value ? 0 : value);

                        if (n.greaterThan(100)) {
                          return;
                        }

                        form.setValue(
                          "enroll.total",
                          enrollValue -
                            n
                              .dividedBy(100)
                              .times(enrollValue)
                              .floor()
                              .toNumber()
                        );
                        field.onChange(value);
                      }}
                    />
                  );
                }}
                name="enroll.discount"
                control={form.control}
              />
              <span className="absolute right-2 bottom-2 text-gray-400 select-none col-span-2">
                %
              </span>
            </div>
            <div className="col-span-2">
              <Controller
                render={({ field, fieldState: { error } }) => (
                  <FloatingInput
                    {...field}
                    label="Valor total"
                    type="text"
                    value={
                      convertToMoney(field.value) ?? convertToMoney(enrollValue)
                    }
                    disabled={true}
                    error={error?.message}
                    className="text-right text-2xl"
                    labelClassName="right-0 -translate-y-8 scale-100"
                  />
                )}
                name="enroll.total"
                control={form.control}
              />
            </div>
          </div>
        </FormFieldset>

        <FormFieldset legend="Datos del pago">
          <div className="grid grid-cols-2 gap-2 items-center w-full">
            <Controller
              render={({
                field: { onChange, value, name },
                fieldState: { error },
              }) => (
                <FetchDropdown
                  label="Método de pago"
                  id={name}
                  fetchUrl="/api/courses/payment-types/options"
                  fetchDefaultUrl={
                    values?.enroll?.payment_type_fk
                      ? `/api/courses/payment-types/options/${values?.enroll?.payment_type_fk}`
                      : undefined
                  }
                  clearable
                  error={error?.message}
                  selectedValue={value}
                  onChange={(option) => onChange(option.value)}
                />
              )}
              name="enroll.payment_type_fk"
              control={form.control}
            />

            <Controller
              render={({
                field: { onChange, value, name },
                fieldState: { error },
              }) => (
                <Dropdown
                  label="Tipo de matrícula"
                  error={error?.message}
                  id={name}
                  options={enrollTypes}
                  selected={enrollTypes.find(
                    (option) => option.value === value
                  )}
                  onChange={(option) => onChange(option.value)}
                />
              )}
              name="enroll.enroll_type"
              control={form.control}
            />
          </div>

          <Checkbox
            id="isInstallments"
            label={"Pago en cuotas"}
            checked={isInstallments}
            onChange={() => {
              setInstallments(!isInstallments);
            }}
          />

          {isInstallments ? (
            <div className="grid grid-cols-2 gap-2 items-center w-full">
              <Controller
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <FloatingInput
                    label="N° de cuotas"
                    error={error?.message}
                    type="number"
                    value={Number(value).toString()}
                    onChange={(e) => {
                      let n = parseInt(e.currentTarget.value);
                      if (isNaN(n)) {
                        n = 0;
                      }
                      onChange(n);
                    }}
                    onBlur={(e) => {
                      if (parseInt(e.currentTarget.value) < 1) {
                        onChange(1);
                      }
                    }}
                  />
                )}
                name="enroll.installments"
                control={form.control}
              />
              <Controller
                rules={{
                  validate: (value) => {
                    if (value > form.getValues("enroll.installments")) {
                      return "No puede ser mayor al número de cuotas";
                    }
                    return true;
                  },
                }}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <FloatingInput
                    label="Cuotas pagadas"
                    error={error?.message}
                    type="number"
                    value={Number(value).toString()}
                    onChange={(e) => {
                      let n = parseInt(e.currentTarget.value);
                      if (isNaN(n)) {
                        n = 0;
                      }
                      if (n > installments) {
                        n = installments;
                      }
                      onChange(n);
                    }}
                    onBlur={(e) => {
                      let n = parseInt(e.currentTarget.value);
                      if (n < 0 || isNaN(n)) {
                        n = 0;
                      }
                      onChange(n);
                    }}
                  />
                )}
                name="enroll.paid"
                control={form.control}
              />
            </div>
          ) : (
            <Checkbox
              label={"Pagado"}
              {...form.register("enroll.paid")}
              id="paid"
            />
          )}

          <Checkbox
            label={"Devuelto"}
            {...form.register("enroll.refund")}
            id="refund"
          />

          {isRefund && (
            <FloatingTextarea
              label="Motivo de la devolución"
              {...form.register("enroll.refund_explanation")}
              error={form.formState.errors.enroll?.refund_explanation?.message}
              rows={2}
            />
          )}
        </FormFieldset>
        <FormFieldset legend="Otras observaciones">
          <FloatingTextarea
            label="Observaciones"
            {...form.register("enroll.observation")}
            error={form.formState.errors.enroll?.observation?.message}
            rows={2}
            className="col-span-2"
          />
        </FormFieldset>
        <div className="flex gap-2 mt-2">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? (
              <LoadingSpinner className="text-gray-500" />
            ) : (
              "Guardar"
            )}
          </Button>
        </div>
      </form>
      {createStudent && <StudentForm onClose={handleFormClose} />}
    </>
  );
}
