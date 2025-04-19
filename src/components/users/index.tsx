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
import IndeterminateCheckbox from "./IndeterminateCheckbox";

type User = {
  id: number;
  username: string;
  gender: string;
  email: string;
  role?: string; // not in the API, but if you plan to inject it
  company: {
    name: string;
    address: {
      country: string;
    };
  };
};

const fetchUsers = async (): Promise<User[]> => {
  const { data } = await axios.get("https://dummyjson.com/users");
  return data.users;
};

export const UsersTable = () => {
  const {
    data = [],
    isLoading,
    error,
  } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const columns: ColumnDef<User>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <IndeterminateCheckbox
          {...{
            checked: table.getIsAllRowsSelected(),
            indeterminate: table.getIsSomeRowsSelected(),
            onChange: table.getToggleAllRowsSelectedHandler(),
          }}
        />
      ),
      cell: ({ row }) => (
        <div className="px-1">
          <IndeterminateCheckbox
            {...{
              checked: row.getIsSelected(),
              disabled: !row.getCanSelect(),
              indeterminate: row.getIsSomeSelected(),
              onChange: row.getToggleSelectedHandler(),
            }}
          />
        </div>
      ),
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
      header: "Gender",
      accessorKey: "gender",
    },
    {
      header: "Role",
      accessorKey: "role",
    },
    {
      header: "Company",
      accessorFn: (row) => row.company.name ?? "N/A",
      id: "name",
    },
    {
      header: "Country",
      accessorFn: (row) => row.company.address.country ?? "N/A",
      id: "country",
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

  const selectedUsers = table
    .getSelectedRowModel()
    .rows.map((row) => row.original);

  if (isLoading) return <p>Loading...</p>;
  if (error instanceof Error) return <p>Error: {error.message}</p>;

  return (
    <>
      <table className="table-auto w-full border-collapse">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="bg-gray-200">
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="px-2 py-2 text-left">
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
            <tr key={row.id} className="odd:bg-white even:bg-gray-100">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-2 py-2 text-left">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {selectedUsers.length > 0 && (
        <pre className="mt-5 bg-gray-100 p-2.5">
          <div>
            <h2>Selected User Details</h2>
            {selectedUsers.map((user) => (
              <div key={user.id} className="border border-gray-300 p-4 mb-4">
                <p>
                  <strong>Username:</strong> {user.username}
                </p>
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
                <p>
                  <strong>Website:</strong> {user.email}
                </p>
                <p>
                  <strong>Country:</strong>{" "}
                  {user.company.address.country ?? "N/A"}
                </p>
              </div>
            ))}
          </div>
        </pre>
      )}
    </>
  );
};

export default UsersTable;
