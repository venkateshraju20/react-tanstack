import { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  ColumnDef,
  RowSelectionState,
} from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

type User = {
  id: number;
  name: string;
  username: string;
  email: string;
  website: string;
  address: {
    country?: string;
    city?: string;
    street?: string;
    zipcode?: string;
    geo?: {
      lat: string;
      lng: string;
    };
  };
};

const fetchUsers = async (): Promise<User[]> => {
  const { data } = await axios.get(
    "https://jsonplaceholder.typicode.com/users"
  );
  return data;
};

export const UsersTable = () => {
  const { data = [], isLoading } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const columns: ColumnDef<User>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <input
          type="checkbox"
          checked={table.getIsAllRowsSelected()}
          onChange={table.getToggleAllRowsSelectedHandler()}
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={row.getIsSelected()}
          disabled={!row.getCanSelect()}
          onChange={row.getToggleSelectedHandler()}
        />
      ),
    },
    {
      header: "Name",
      accessorKey: "name",
    },
    {
      header: "Username",
      accessorKey: "username",
    },
    {
      header: "Email",
      accessorKey: "email",
    },
    {
      header: "Website",
      accessorKey: "website",
    },
    {
      header: "Country",
      accessorFn: (row) => row.address?.city || "Unknown",
    },
  ];

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
    getFilteredRowModel: getFilteredRowModel(),
  });

  if (isLoading) return <p>Loading...</p>;

  return (
    <>
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  style={{ border: "1px solid #ccc", padding: "8px" }}
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
                  style={{ border: "1px solid #ccc", padding: "8px" }}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <pre
        style={{ marginTop: "20px", background: "#f0f0f0", padding: "10px" }}
      >
        Selected Row IDs:{" "}
        {JSON.stringify(
          table.getSelectedRowModel().rows.map((row) => row.original.id),
          null,
          2
        )}
      </pre>
    </>
  );
};

export default UsersTable;
