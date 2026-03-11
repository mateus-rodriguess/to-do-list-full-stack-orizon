import axios from "axios";
import { api } from "../api/axios";
import type { RegisterSchema } from "../schemas/user/registerSchema";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const login = async (username: string, password: string) => {
  const response = await api.post("/auth/token", {
    username,
    password,
  });

  return response.data;
};

export const createUser = async (data: RegisterSchema) => {
  const response = await axios.post(`${baseUrl}/users`, {
    first_name: data.first_name,
    last_name: data.last_name,
    email: data.email,
    username: data.username,
    password: data.password,
  });

  return response;
};
