"use client";

import { useEffect, useState } from "react";

export interface DropdownProps {
  label?: string;
  options?: Option[];
  selected?: Option;
  clearable?: boolean;
  disabled?: boolean;
  onChange: (option: Option) => void;
  onRemove?: () => void;
  isLoading?: boolean;
  className?: string;
  onSearch?: (search: string) => void;
  create?: () => void;
}

export interface Option {
  name: string;
  value: number | string | boolean | object;
}

const ACTIVE_CLASSNAMES =
  "transition ease-out duration-100 transform opacity-100 scale-100 visible";
const INACTIVE_CLASSNAMES =
  "transition ease-in duration-75 transform opacity-0 scale-95 invisible";

export default function Dropdown({
  label,
  options,
  selected,
  disabled,
  clearable = false,
  onChange,
  onRemove = () => {},
  isLoading,
  className = "",
  onSearch,
  create,
}: DropdownProps) {
  const [optionsList, setOptionsList] = useState<Option[]>(options || []);

  const [selectedOption, setSelectedOption] = useState<Option | undefined>(
    selected
  );
  const [search, setSearch] = useState<string>();
  const [isOpen, setIsOpen] = useState(false);
  let isClosable = true;

  useEffect(() => {
    setOptionsList(options || []);
    if (selected) {
      setSelectedOption(selected);
    }
  }, [selected, options]);

  const handleOptionClick = (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    option: Option
  ) => {
    e.stopPropagation();
    setSearch(undefined);
    setSelectedOption(option);
    onChange(option);
    setIsOpen(false);
  };

  const handleRemoveOption = (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>
  ) => {
    e.stopPropagation();
    setSelectedOption(undefined);
    onRemove();
  };

  return (
    <div className={`relative inline-block text-left ${className}`.trimEnd()}>
      <div
        className={`outline-none flex justify-between w-full p-2.5 ps-2 text-sm text-gray-900 border border-gray-300 rounded bg-gray-50 focus:ring-blue-500 focus:border-blue-500  group ${
          disabled
            ? "pointer-events-none bg-gray-100 cursor-not-allowed border-gray-300 "
            : "cursor-pointer"
        }`}
        id="menu-button"
        aria-disabled={disabled || isLoading}
        onFocus={() => setIsOpen(true)}
        onBlur={() => isClosable && setIsOpen(false)}
        tabIndex={0}
      >
        <span
          className={
            "absolute text-sm text-gray-500 duration-300 transform origin-[0] pointer-events-none " +
            (!selectedOption && !search
              ? "scale-100 translate-y-0"
              : "scale-75 -translate-y-8 group-focus:text-primary start-0")
          }
        >
          {label}
        </span>
        {!!onSearch ? (
          <input
            value={search || selectedOption?.name}
            onChange={(e) => {
              if (e.currentTarget.value === "" && selectedOption) {
                setSelectedOption(undefined);
              }
              onSearch(e.currentTarget.value);
              setSearch(e.currentTarget.value);
            }}
            onInput={(e) => setSearch(e.currentTarget.value)}
            className="w-full bg-transparent outline-none"
          />
        ) : (
          <span className="text-sm text-gray-900">
            {selectedOption ? selectedOption.name : ""}
          </span>
        )}
        <div className="flex gap-2">
          {clearable && (
            <span
              className={`icon-[charm--cross] text-gray-400 text-xl transition-opacity ${
                !selectedOption ? "opacity-0" : "opacity-100"
              }`}
              onClick={handleRemoveOption}
            />
          )}
          {isLoading ? (
            <span className="icon-[line-md--loading-loop] text-gray-400 text-xl animate-spin" />
          ) : (
            <span
              className={`icon-[ci--chevron-down] text-gray-400 text-xl transition-transform ${
                isOpen ? "rotate-180" : "rotate-0"
              }`}
            />
          )}
        </div>
      </div>

      <div
        className={`absolute right-0 z-10 mt-2 w-full origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none max-h-44 overflow-y-auto ${
          isOpen ? ACTIVE_CLASSNAMES : INACTIVE_CLASSNAMES
        }`}
        tabIndex={-1}
        role="menu"
        onMouseEnter={() => (isClosable = false)}
        onMouseLeave={() => (isClosable = true)}
      >
        {create && (
          <span
            onClick={() => {
              setIsOpen(false);
              create();
            }}
            className=" px-4 py-2 text-sm text-white bg-primary cursor-pointer hover:brightness-90 flex content-center place-content-center"
          >
            <span className="icon-[ph--plus] text-xl" />
            Crear
          </span>
        )}
        {optionsList.length > 0 ? (
          optionsList.map((option, index) => (
            <span
              key={index}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
              tabIndex={-1}
              id={`menu-item-${index}`}
              onClick={(e) => handleOptionClick(e, option)}
            >
              {option.name}
            </span>
          ))
        ) : (
          <span className="block px-4 py-2 text-sm text-gray-700">
            No hay opciones
          </span>
        )}
      </div>
    </div>
  );
}
