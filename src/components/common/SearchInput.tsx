import Input from "@/components/common/Input";

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  className?: string;
}

export default function SearchInput({
  label,
  id,
  className,
}: SearchInputProps) {
  return (
    <fieldset className={className}>
      <label htmlFor={id} className="mb-2 text-md text-gray-900 ">
        {label}
      </label>
      <div className="relative">
        <Input type="search" id={id} className="w-full" />
        <button
          type="submit"
          className="text-white absolute end-2.5 top-0 bottom-0 my-1 bg-primary hover:bg-primary/90 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded w-10  grid place-items-center"
        >
          <span className="icon-[ic--round-search] text-white text-xl" />
        </button>
      </div>
    </fieldset>
  );
}
