import { FieldError } from "react-hook-form";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  errors?: FieldError;
}

export default function FloatingInput(props: InputProps) {
  return (
    <div className="relative z-0">
      <input
        id={`floating_${props.label}`}
        className="block py-2.5 px-0 w-full text-sm bg-transparent rounded-md border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-primary peer"
        placeholder=" "
        {...props}
      />
      <label
        htmlFor={`floating_${props.label}`}
        className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-primary peer-focus:border-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
      >
        {props.label}
      </label>
      <span className="text-sm text-red-500">{props.errors?.message}</span>
    </div>
  );
}
