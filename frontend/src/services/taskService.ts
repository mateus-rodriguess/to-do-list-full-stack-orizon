import { api } from "../api/axios";
import type { TaskSchema } from "../schemas/task/taskSchema";

export async function getTasks(params?: Record<string, unknown>) {
  const response = await api.get(`/tasks`, { params });
  return response.data;
}

export async function getTaskById(id: number) {
  const response = await api.get(`/tasks/${id}`);
  return response.data;
}

export const createTask = async (data: TaskSchema) => {
  return await api.post("/tasks", data);
};

export const updateTask = (id: number, payload: TaskSchema) => {
  return api.patch(`/tasks/${id}`, payload);
};

export const deleteTask = (id: number) => {
  return api.delete(`/tasks/${id}`);
};
