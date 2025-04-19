// ReactTable.tsx
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  ColumnDef,
  RowSelectionState,
} from "@tanstack/react-table";
import { useState } from "react";

type DataTableProps<T> = {
  data: T[];
  columns: ColumnDef<T>[];
  onRowSelectionChange: (selectedRows: T[]) => void;
};

export const ReactTable = <T,>({
  data,
  columns,
  onRowSelectionChange,
}: DataTableProps<T>) => {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const table = useReactTable({
    data,
    columns,
    state: {
      rowSelection,
    },
    enableRowSelection: true,
    onRowSelectionChange: (updater) => {
      const newState =
        typeof updater === "function" ? updater(rowSelection) : updater;
      setRowSelection(newState);

      // Access the selected rows directly from the table
      const selectedRows = table
        .getSelectedRowModel()
        .rows.map((row) => row.original);

      // Pass the selected rows to the parent component
      onRowSelectionChange(selectedRows);
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <table className="table-auto w-full border-collapse">
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th
                key={header.id}
                className="border border-gray-300 p-2 text-left"
                style={{ whiteSpace: "nowrap" }}
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td
                key={cell.id}
                className="border border-gray-300 p-2 text-left"
                style={{ whiteSpace: "nowrap" }}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ReactTable;
