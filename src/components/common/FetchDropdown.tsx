import { useEffect, useMemo, useRef, useState } from "react";
import useSWR from "swr";
import Dropdown, {
  DropdownProps,
  DropdownRef,
  Option,
} from "@/components/common/Dropdown";
import { fetcher } from "@/lib/utils";
import { useDebouncedCallback } from "use-debounce";

interface FetchDropdownProps extends DropdownProps {
  fetchUrl: string;
  selectedValue?: Option["value"];
  fetchDefaultUrl?: string;
  filterName?: string;
}

export default function FetchDropdown({
  fetchUrl,
  selectedValue,
  filterName = "name",
  ...props
}: FetchDropdownProps) {
  const dropdownRef = useRef<DropdownRef>(null);
  const [filter, setFilter] = useState("");
  let fetchDefaultUrl = props.fetchDefaultUrl;
  const { data: options, isLoading: optionsLoading } = useSWR<Option[]>(
    `${fetchUrl}${filter}`,
    fetcher
  );

  const { data: defaultOption, isLoading: defaultOptionLoading } =
    useSWR<Option>(() => fetchDefaultUrl ?? null, fetcher);

  const handleSearch = useDebouncedCallback((search: string) => {
    fetchDefaultUrl = undefined;
    setFilter(`?${filterName}=${search}`);
  }, 500);

  useEffect(() => {
    // Reset the dropdown if the selectedValue prop is cleared
    if (!selectedValue) {
      dropdownRef.current?.reset();
    }
  }, [selectedValue]);

  const concatenatedOptions = useMemo(() => {
    return (options || []).concat(defaultOption ? [defaultOption] : []);
  }, [options, defaultOption]);

  const optionSelected = useMemo(() => {
    if (selectedValue && concatenatedOptions) {
      return concatenatedOptions.find(
        (option) => option.value == selectedValue
      );
    }
  }, [selectedValue, defaultOption]); // debe ser defaultOption para que no refresque al escribir

  return (
    <Dropdown
      key={optionSelected?.value.toString() ?? "none"}
      {...props}
      ref={dropdownRef}
      options={concatenatedOptions}
      selected={optionSelected}
      isLoading={optionsLoading || defaultOptionLoading}
      onChange={(option) => {
        fetchDefaultUrl = undefined;
        props.onChange?.(option);
        // field.onChange(option.value);
      }}
      onSearch={handleSearch}
      onRemove={() => {
        fetchDefaultUrl = undefined;
        props.onRemove?.();
        setFilter("");
      }}
    />
  );
}
