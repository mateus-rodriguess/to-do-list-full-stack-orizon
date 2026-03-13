import { api } from "../api/axios";
import type { CategorySchema } from "../schemas/category/categorySchema";

export type Category = {
  id: number;
  name: string;
  is_active: boolean;
};

type CategoryResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  result: Category[];
};

export const createCategory = async (data: CategorySchema) => {
  const response = await api.post("/categories", data);

  return response;
};

export async function getCategories(params?: {
  page?: number;
  page_size?: number;
  name?: string;
  search?: string;
}): Promise<CategoryResponse> {
  const response = await api.get(`/categories`, { params });

  return response.data;
}

export async function getAllCategories(): Promise<Category[]> {
  let page = 1;
  let allCategories: Category[] = [];
  let hasNext = true;

  while (hasNext) {
    const data = await getCategories({ page });

    allCategories = [...allCategories, ...data.result];

    if (data.next) {
      page++;
    } else {
      hasNext = false;
    }
  }

  return allCategories;
}

export const updateCategory = async (id: number, data: CategorySchema) => {
  return await api.patch(`/categories/${id}`, data);
};
