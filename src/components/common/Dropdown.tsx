"use client";

import { useState } from "react";

interface DropdownProps {
  label: string;
  options: Option[];
}

interface Option {
  name: string;
  value: number;
}

const DEFAULT_OPTION = { name: "Opciones", value: -1 };

const ACTIVE_CLASSNAMES =
  "transition ease-out duration-100 transform opacity-100 scale-100 visible";
const INACTIVE_CLASSNAMES =
  "transition ease-in duration-75 transform opacity-0 scale-95 invisible";

export default function Dropdown({ label, options }: DropdownProps) {
  const [selectedOption, setSelectedOption] = useState<Option>(DEFAULT_OPTION);
  const [isOpen, setIsOpen] = useState(false);

  const handleDropdownClick = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    option: Option
  ) => {
    e.stopPropagation();
    setSelectedOption(option);
    setIsOpen(false);
  };

  const handleRemoveOption = (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>
  ) => {
    e.stopPropagation();
    setSelectedOption(DEFAULT_OPTION);
  };

  return (
    <div className="relative inline-block text-left">
      <label htmlFor="default-search" className="mb-2 text-md text-gray-900">
        {label}
      </label>
      <button
        type="button"
        className="outline-none flex justify-between w-full p-4 ps-5 text-sm text-gray-900 border border-gray-300 rounded bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
        id="menu-button"
        onClick={handleDropdownClick}
      >
        {selectedOption.name}
        <div className="flex gap-2">
          <span
            className={`icon-[charm--cross] text-gray-400 text-xl transition-opacity ${
              selectedOption.value == DEFAULT_OPTION.value
                ? "opacity-0"
                : "opacity-100"
            }`}
            onClick={handleRemoveOption}
          />
          <span
            className={`icon-[ci--chevron-down] text-gray-400 text-xl transition-transform ${
              isOpen ? "rotate-180" : "rotate-0"
            }`}
          />
        </div>
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
