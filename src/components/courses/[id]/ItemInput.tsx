interface ItemInputProps {
  isEditing: boolean;
  value: string;
  className?: string;
}

export default function ItemInput({
  isEditing,
  value,
  className = "",
}: ItemInputProps) {
  if (isEditing) {
    return (
      <div className={("min-w-32 " + className).trimEnd()}>
        <input type="text" value={value} />
        <button>Save</button>
      </div>
    );
  } else {
    return <div className={("min-w-32 " + className).trimEnd()}>{value}</div>;
  }
}
