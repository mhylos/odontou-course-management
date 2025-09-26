import { forwardRef, InputHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

export interface FloatingInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "ref"> {
  label: string;
  labelClassName?: string;
  error?: string;
}

const FloatingInput = forwardRef(function FloatingInput(
  { label, error, className, labelClassName, ...props }: FloatingInputProps,
  ref: React.ForwardedRef<HTMLInputElement>
) {
  return (
    <div className="relative z-0 mt-4">
      <input
        id={`floating_${label}`}
        className={twMerge(
          "block h-11 px-2 w-full text-sm bg-transparent rounded-md border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 focus:border-primary peer disabled:disable",
          error ? "border-red-500" : "border-gray-300",
          className
        )}
        placeholder=" "
        autoComplete="off"
        {...props}
        ref={ref}
      />
      <label
        htmlFor={`floating_${label}`}
        className={twMerge(
          `absolute text-sm duration-300 transform -translate-y-6 scale-75 top-3 z-10 origin-[0] peer-focus:start-0 peer-focus:text-primary peer-focus:border-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto`,
          props.disabled ? "text-gray-500" : "",
          error ? "text-red-500" : "text-gray-500",
          labelClassName
        )}
      >
        {label}
      </label>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
});

export default FloatingInput;
