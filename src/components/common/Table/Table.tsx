interface TableProps {
  headers: string[];
  rows: Cell[][];
}

type Cell = string | number | JSX.Element;

interface RowProps {
  currentRow: number;
  row: Cell[];
}

function Row({ row, currentRow }: RowProps) {
  return (
    <tr className="odd:bg-white even:bg-gray-50 border-b">
      <th
        scope="row"
        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
      >
        {currentRow}
      </th>
      {row.map((cell) => (
        <td className="px-6 py-4" key={cell.toString()}>
          {cell}
        </td>
      ))}
    </tr>
  );
}

export default function Table({ headers, rows }: TableProps) {
  return (
    <div className="relative overflow-auto shadow-md rounded">
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
          {rows.map((row, index) => (
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
