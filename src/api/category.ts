import api from "./index";

export interface Category {
  id: string;
  name: string;
  target: number;
}

export interface CreateCategoryInput {
  name: string;
  target: number;
}

export const getAllCategories = async (): Promise<Category[]> => {
  const response = await api.get("/categories/all");
  return response.data;
};

export const createCategory = async (
  data: CreateCategoryInput,
): Promise<Category> => {
  const response = await api.post("/categories", data);
  return response.data;
};

export const updateCategory = async (
  id: string,
  data: CreateCategoryInput,
): Promise<Category> => {
  const response = await api.put(`/categories/${id}`, data);
  return response.data;
};

export const deleteCategory = async (id: string): Promise<void> => {
  await api.delete(`/categories/${id}`);
};
