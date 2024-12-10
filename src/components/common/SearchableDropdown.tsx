"use client";

import { useDebouncedCallback } from "use-debounce";
import { useState } from "react";

interface DropdownProps {
  label?: string;
  options: Option[];
  search: (value: string) => void;
}

interface Option {
  name: string;
  value: unknown;
}

const ACTIVE_CLASSNAMES =
  "transition ease-out duration-100 transform opacity-100 scale-100 visible";
const INACTIVE_CLASSNAMES =
  "transition ease-in duration-75 transform opacity-0 scale-95 invisible";

export default function SearchableDropdown({
  label,
  options,
  search,
}: DropdownProps) {
  const [selectedOption, setSelectedOption] = useState<Option | undefined>();
  const [isOpen, setIsOpen] = useState(
    options || !selectedOption ? true : false
  );

  // const handleDropdownClick = () => {
  //   setIsOpen(!isOpen);
  // };

  const handleOptionClick = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    option: Option
  ) => {
    e.stopPropagation();
    setSelectedOption(option);
    setIsOpen(false);
  };

  const handleSearch = useDebouncedCallback((value: string) => {
    return search(value);
  }, 300);

  const onInput = (e: React.FormEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget as HTMLInputElement;
    handleSearch(value);
  };

  return (
    <div className="relative inline-block text-left">
      {label && (
        <label htmlFor="search" className="mb-2 text-md text-gray-900">
          {label}
        </label>
      )}
      <button
        type="button"
        className="outline-none flex justify-between w-full text-sm text-gray-900 border border-gray-300 rounded bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
        id="menu-button"
        // onClick={handleDropdownClick}
      >
        <input type="text" onInput={onInput} className="outline-none" />
      </button>

      <div
        className={`absolute right-0 z-10 mt-2 w-full origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none ${
          isOpen ? ACTIVE_CLASSNAMES : INACTIVE_CLASSNAMES
        }`}
        tabIndex={-1}
      >
        {options.map((option, index) => (
          <a
            key={index}
            href="#"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            tabIndex={-1}
            id={`menu-item-${index}`}
            onClick={(e) => handleOptionClick(e, option)}
          >
            {option.name}
          </a>
        ))}
      </div>
    </div>
  );
}
