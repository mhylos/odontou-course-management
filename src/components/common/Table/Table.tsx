import { CSSProperties } from "react";

interface TableProps {
  headers: {
    title: string;
    width?: CSSProperties["width"];
  }[];
  children?: React.ReactNode;
  className?: string;
  isFetching?: boolean;
}

export interface RowProps {
  currentRow?: number;
  children?: JSX.Element | JSX.Element[];
  isLoading?: boolean;
}

export interface CellProps {
  children?: JSX.Element | JSX.Element[] | string | number;
}

export function Cell({ children }: CellProps) {
  return <td className="px-6 py-4">{children}</td>;
}

export function Row({ currentRow, children, isLoading = false }: RowProps) {
  return (
    <tr className="odd:bg-white even:bg-gray-50 border-b h-16">
      <th
        scope="row"
        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
      >
        {isLoading ? (
          <span className="icon-[line-md--loading-loop]" />
        ) : (
          currentRow ?? ""
        )}
      </th>
      {children}
    </tr>
  );
}

export default function Table({
  headers,
  className = "",
  isFetching = false,
  children,
}: TableProps) {
  return (
    <div
      className={`relative overflow-auto shadow-md rounded ${className}`.trimEnd()}
    >
      <table className="w-full text-sm text-left rtl:text-right table-fixed">
        <thead className="text-xs text-gray-700 uppercase bg-gray-100">
          <tr>
            <th scope="col" className="px-6 py-3 w-[5%]">
              N°
            </th>
            {headers.map((header) => (
              <th
                scope="col"
                className={`px-6 py-3`}
                style={{ width: header.width }}
                key={header.title}
              >
                {header.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="overflow-auto">
          {isFetching &&
            Array.from({ length: 10 }, (_, index) => (
              <Row currentRow={index + 1} key={index} isLoading={isFetching}>
                {headers.map((_, index) => (
                  <Cell key={index}>
                    <span className="icon-[line-md--loading-loop]" />
                  </Cell>
                ))}
              </Row>
            ))}
          {!isFetching && children ? (
            children
          ) : (
            <tr>
              <td colSpan={headers.length + 1} className="text-center p-4">
                No hay datos
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
