interface RadioButtonProps {
  label: string;
  description?: string;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  className?: string;
}

export default function RadioButton({
  label,
  description,
  inputProps,
  className = "",
}: RadioButtonProps) {
  return (
    <div className={`flex ${className}`.trimEnd()}>
      <div className="flex items-center h-5">
        <input
          type="radio"
          className="w-4 h-4 text-primary bg-gray-100 border-gray-300"
          {...inputProps}
        />
      </div>
      <div className="ms-2 text-sm">
        <label htmlFor={inputProps?.id} className="font-medium text-gray-900">
          {label}

          {description && (
            <p className="text-xs font-normal text-gray-500 ">{description}</p>
          )}
        </label>
      </div>
    </div>
  );
}
