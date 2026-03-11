import { api } from "../api/axios";
import type { TaskSchema } from "../schemas/task/taskSchema";

export async function getTasks(page = 1) {
  const response = await api.get(`/tasks?page=${page}`);
  return response.data;
}

export const createTask = async (data: TaskSchema) => {
  return await api.post("/tasks", data);
};
