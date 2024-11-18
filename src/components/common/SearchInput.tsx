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
        <input
          type="search"
          id={id}
          className="block outline-none w-full p-4 ps-5 text-sm text-gray-900 border border-gray-300 rounded bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          type="submit"
          className="text-white absolute end-2.5 top-0 bottom-0 my-2 bg-primary hover:bg-primary/90 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded w-10  grid place-items-center"
        >
          <span className="icon-[ic--round-search] text-white text-2xl" />
        </button>
      </div>
    </fieldset>
  );
}
