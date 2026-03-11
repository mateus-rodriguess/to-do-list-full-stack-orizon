import { api } from "../api/axios";

export type User = {
  id: string;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
};

type UserResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  result: User[];
};

export async function getUsers(page = 1): Promise<UserResponse> {
  const response = await api.get(`users?page=${page}`);
  return response.data;
}

export async function getAllUsersPage(): Promise<User[]> {
  let page = 1;
  let allUsers: User[] = [];
  let hasNext = true;

  while (hasNext) {
    const data = await getUsers(page);

    allUsers = [...allUsers, ...data.result];

    if (data.next) {
      page++;
    } else {
      hasNext = false;
    }
  }

  return allUsers;
}
