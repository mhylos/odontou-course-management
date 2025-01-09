import { forwardRef, InputHTMLAttributes } from "react";

interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "ref"> {
  label: string;
}

const Checkbox = forwardRef(function Checkbox(
  props: CheckboxProps,
  ref: React.ForwardedRef<HTMLInputElement>
) {
  return (
    <>
      <div className={`flex ${props.className ?? ""}`}>
        <div className="flex items-center h-5">
          <input
            aria-describedby="helper-checkbox-text"
            type="checkbox"
            className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
            {...props}
            ref={ref}
          />
        </div>
        <div className="ms-2 text-sm">
          <label
            className={`font-medium text-gray-900 ${
              props.disabled ? "text-gray-300" : ""
            }`}
            htmlFor={props.id}
          >
            {props.label}
          </label>
        </div>
      </div>
    </>
  );
});

export default Checkbox;
