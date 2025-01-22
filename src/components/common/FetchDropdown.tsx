import { useState } from "react";
import useSWR from "swr";
import Dropdown, { DropdownProps, Option } from "@/components/common/Dropdown";
import { fetcher } from "@/lib/utils";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { useDebouncedCallback } from "use-debounce";

interface FetchDropdownProps<T extends FieldValues>
  extends Partial<DropdownProps> {
  name: Path<T>;
  control?: Control<T>;
  fetchUrl: string;
  selectedValue?: Option["value"];
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
      render={({ field: { onChange } }) => (
        <Dropdown
          {...props}
          id={props.name}
          label={props.label}
          options={options}
          selected={options?.find(
            (option) => option.value == props.selectedValue
          )}
          isLoading={isLoading}
          onChange={(option) => {
            props.onChange?.(option);
            onChange(option.value);
          }}
          onSearch={handleSearch}
          onRemove={() => {
            props.onRemove?.();
            setFilter("");
          }}
        />
      )}
      name={props.name}
      control={props.control}
    />
  );
}
