import { forwardRef, InputHTMLAttributes } from "react";
import { FieldError } from "react-hook-form";

interface InputProps
  extends Omit<InputHTMLAttributes<HTMLTextAreaElement>, "ref"> {
  label: string;
  error?: string;
}

const FloatingTextarea = forwardRef(function FloatingTextarea(
  { label, error, ...props }: InputProps,
  ref: React.ForwardedRef<HTMLTextAreaElement>
) {
  return (
    <div className="relative z-0">
      <textarea
        id={`floating_${label}`}
        className={`block py-2.5 px-0 w-full text-sm bg-transparent rounded-md border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 focus:border-primary peer ${
          error ? "border-red-500" : "border-gray-300"
        }`}
        placeholder=" "
        rows={1}
        {...props}
        ref={ref}
      />
      <label
        htmlFor={`floating_${label}`}
        className={`absolute text-sm duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-primary peer-focus:border-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto ${
          error ? "text-red-500" : "text-gray-500"
        }`}
      >
        {label}
      </label>
      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
});

export default FloatingTextarea;
