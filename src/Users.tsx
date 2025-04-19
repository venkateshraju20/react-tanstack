import { useQuery } from "@tanstack/react-query";
import axios from "axios";

type User = {
  id: number;
  name: string;
  email: string;
  username: string;
};

const fetchUsers = async (): Promise<User[]> => {
  const { data } = await axios.get<User[]>(
    "https://jsonplaceholder.typicode.com/users"
  );
  return data;
};

const Users = () => {
  const { data, isLoading, error } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  if (isLoading) return <p>Loading...</p>;
  if (error instanceof Error) return <p>Error: {error.message}</p>;

  return (
    <ul>
      {data?.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
};

export default Users;
