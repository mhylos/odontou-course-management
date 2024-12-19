interface FormFieldsetProps {
  legend: string;
  children: React.ReactNode;
}

export default function FormFieldset({ legend, children }: FormFieldsetProps) {
  return (
    <fieldset className="flex flex-col gap-5 border-2 border-gray-200 pt-2 pb-5 px-4 rounded">
      <legend className="mb-1 text-xl">{legend}</legend>
      {children}
    </fieldset>
  );
}
