import { useState } from "react";
import useSWR from "swr";
import Dropdown, { DropdownProps, Option } from "@/components/common/Dropdown";
import { fetcher } from "@/lib/utils";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { useDebouncedCallback } from "use-debounce";

interface FetchDropdownProps<T extends FieldValues>
  extends Omit<DropdownProps, "options" | "onChange"> {
  name: Path<T>;
  label: string;
  control: Control<T>;
  fetchUrl: string;
}

export default function FetchDropdown<T extends FieldValues>(
  props: FetchDropdownProps<T>
) {
  const [filter, setFilter] = useState("");
  const { data: options, isLoading } = useSWR<Option[]>(
    `${props.fetchUrl}${filter}`,
    fetcher
  );

  const handleSearch = useDebouncedCallback((search: string) => {
    setFilter("?name=" + search);
  }, 500);

  return (
    <Controller
      render={({ field: { value, onChange } }) => (
        <Dropdown
          {...props}
          label={props.label}
          options={options?.map((option) => ({
            name: option.name,
            value: option.value,
          }))}
          selected={options?.find((option) => option.value == value)}
          isLoading={isLoading}
          onChange={(option) => onChange(option.value)}
          onSearch={handleSearch}
          onRemove={() => setFilter("")}
        />
      )}
      name={props.name}
      control={props.control}
    />
  );
}
