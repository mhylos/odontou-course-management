import { forwardRef } from "react";
import LoadingSpinner from "./LoadingSpinner";

function FileInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      type="file"
      className={`flex h-11 px-2 w-full text-sm bg-transparent rounded border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-primary
      disabled:disable ${props.className}`.trimEnd()}
      placeholder=" "
    />
  );
}

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  isLoading?: boolean;
  error?: string;
}

const Input = forwardRef(function Input(
  { isLoading, error, ...props }: InputProps,
  ref: React.ForwardedRef<HTMLInputElement>
) {
  if (props.type === "file") {
    return <FileInput {...props} />;
  }

  return (
    <div className="relative">
      <input
        {...props}
        ref={ref}
        className={`flex h-11 px-2 w-full text-sm bg-transparent rounded border appearance-none focus:outline-none focus:ring-0 focus:border-primary disabled:disable ${
          error ? "border-red-500" : "border-gray-300"
        } ${props.className}`.trimEnd()}
        placeholder=" "
      />
      {isLoading && (
        <LoadingSpinner className="absolute right-2 top-0 bottom-0 my-auto !text-gray-500" />
      )}
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
});

export default Input;
