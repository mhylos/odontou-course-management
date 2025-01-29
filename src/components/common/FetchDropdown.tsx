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
  fetchDefaultUrl?: string;
}

export default function FetchDropdown<T extends FieldValues>(
  props: FetchDropdownProps<T>
) {
  let fetchDefaultUrl = props.fetchDefaultUrl;
  const [filter, setFilter] = useState("");
  const { data: options, isLoading: optionsLoading } = useSWR<Option[]>(
    `${props.fetchUrl}${filter}`,
    fetcher
  );

  const { data: defaultOption, isLoading: defaultOptionLoading } =
    useSWR<Option>(() => fetchDefaultUrl ?? null, fetcher);

  const handleSearch = useDebouncedCallback((search: string) => {
    fetchDefaultUrl = undefined;
    setFilter("?name=" + search);
  }, 500);

  return (
    <Controller
      render={({ field: { onChange } }) => (
        <Dropdown
          id={props.name}
          label={props.label}
          options={options}
          selected={
            options?.find((option) => option.value == props.selectedValue) ||
            fetchDefaultUrl
              ? defaultOption
              : undefined
          }
          isLoading={optionsLoading || defaultOptionLoading}
          onChange={(option) => {
            fetchDefaultUrl = undefined;
            props.onChange?.(option);
            onChange(option.value);
          }}
          onSearch={handleSearch}
          onRemove={() => {
            fetchDefaultUrl = undefined;
            props.onRemove?.();
            setFilter("");
          }}
          {...props}
        />
      )}
      name={props.name}
      control={props.control}
    />
  );
}
