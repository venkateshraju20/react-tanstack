// ReactTable.tsx
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import { useEffect } from "react";

type DataTableProps<T> = {
  data: T[];
  columns: ColumnDef<T>[];
  onRowSelectionChange: (selected: T[]) => void;
  rowSelection?: Record<string, boolean>;
  setRowSelection?: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;
};

export const ReactTable = <T,>({
  data,
  columns,
  onRowSelectionChange,
  rowSelection,
  setRowSelection,
}: DataTableProps<T>) => {
  const table = useReactTable({
    data,
    columns,
    state: {
      rowSelection,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  useEffect(() => {
    if (onRowSelectionChange) {
      const selected = table
        .getSelectedRowModel()
        .flatRows.map((row) => row.original);
      onRowSelectionChange(selected);
    }
  }, [rowSelection, table, onRowSelectionChange]);

  return (
    <>
      <table className="table-auto w-full min-w-full text-left">
        <thead className="sticky top-0 z-10">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="bg-gray-200">
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="pl-2 py-3"
                  //style={{ width: header.column.getSize() }}
                >
                  <div
                    className={`flex items-center gap-0 ${
                      header.column.id === "select" ? "justify-center" : ""
                    }`}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="odd:bg-white even:bg-gray-100">
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="pl-2 py-2"
                  //style={{ width: cell.column.getSize() }}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default ReactTable;
