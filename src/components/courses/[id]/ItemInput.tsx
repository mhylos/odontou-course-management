import Input from "@/components/common/Input";

interface ItemInputProps {
  isEditing: boolean;
  value?: string | null;
  isFetching?: boolean;
  className?: string;
}

export default function ItemInput({
  isEditing,
  isFetching = false,
  value,
  className = "",
}: ItemInputProps) {
  if (isEditing) {
    return (
      <div className={("min-w-32 " + className).trimEnd()}>
        <Input />
      </div>
    );
  } else {
    return (
      <div
        className={`min-w-32 ${
          isFetching ? "animate-pulse bg-gray-200 rounded" : ""
        }`.trimEnd()}
      >
        {value}
      </div>
    );
  }
}
