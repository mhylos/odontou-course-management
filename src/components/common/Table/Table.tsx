interface TableProps {
  headers: string[];
  rows: Cell[][] | undefined;
  className?: string;
  isFetching?: boolean;
}

type Cell = string | number | JSX.Element | undefined | boolean | null;

interface RowProps {
  currentRow: number;
  row: Cell[];
  isLoading?: boolean;
}

function Row({ row, currentRow, isLoading = false }: RowProps) {
  return (
    <tr className="odd:bg-white even:bg-gray-50 border-b h-16">
      <th
        scope="row"
        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
      >
        {isLoading ? (
          <span className="icon-[line-md--loading-loop]" />
        ) : (
          currentRow
        )}
      </th>
      {row.map((cell, index) => (
        <td className="px-6 py-4" key={index}>
          {cell}
        </td>
      ))}
    </tr>
  );
}

export default function Table({
  headers,
  rows,
  className = "",
  isFetching = false,
}: TableProps) {
  return (
    <div
      className={`relative overflow-auto shadow-md rounded ${className}`.trimEnd()}
    >
      <table className="w-full text-sm text-left rtl:text-right">
        <thead className="text-xs text-gray-700 uppercase bg-gray-100">
          <tr>
            <th scope="col" className="px-6 py-3">
              N°
            </th>
            {headers.map((header) => (
              <th scope="col" className="px-6 py-3" key={header}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="overflow-auto">
          {isFetching &&
            Array.from({ length: 10 }, (_, index) => (
              <Row
                row={Array.from({ length: headers.length }, () => "")}
                currentRow={index + 1}
                key={index}
                isLoading={isFetching}
              />
            ))}
          {!isFetching &&
            rows?.map((row, index) => (
              <Row
                row={row}
                currentRow={index + 1}
                key={row.toString() + index}
              />
            ))}
        </tbody>
      </table>
    </div>
  );
}
