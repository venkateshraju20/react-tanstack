import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef, RowSelectionState } from "@tanstack/react-table";
import axios from "axios";
import IndeterminateCheckbox from "./IndeterminateCheckbox";
import ReactTable from "./ReactTable";

type User = {
  id: number;
  username: string;
  gender: string;
  email: string;
  role?: string;
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
  const [selectedRows, setSelectedRows] = useState<User[]>([]);

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

  if (isLoading) return <p>Loading...</p>;
  if (error instanceof Error) return <p>Error: {error.message}</p>;

  return (
    <>
      <ReactTable
        data={data}
        columns={columns}
        onRowSelectionChange={setSelectedRows}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
      />

      {selectedRows.length > 0 && (
        <pre className="mt-5 bg-gray-100 p-2.5">
          <div>
            <h2>Selected User Details</h2>
            {selectedRows.map((user) => (
              <div key={user.id} className="border border-gray-300 p-4 mb-4">
                <p>
                  <strong>Username:</strong> {user.username}
                </p>
                <p>
                  <strong>Role:</strong> {user.role}
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
