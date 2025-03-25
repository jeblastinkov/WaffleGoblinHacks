import { apiRequest } from "./queryClient";
import { LifehackModel, CategoryModel } from "@shared/schema";

// Lifehack APIs
export async function fetchDailyLifehack(): Promise<LifehackModel> {
  const res = await apiRequest("GET", "/api/lifehacks/today");
  return await res.json();
}

export async function fetchPreviousLifehacks(): Promise<LifehackModel[]> {
  const res = await apiRequest("GET", "/api/lifehacks/previous");
  return await res.json();
}

export async function fetchAllLifehacks(): Promise<LifehackModel[]> {
  const res = await apiRequest("GET", "/api/lifehacks/all");
  return await res.json();
}

export async function fetchLifehacksByCategory(categoryId: number): Promise<LifehackModel[]> {
  const res = await apiRequest("GET", `/api/lifehacks/category/${categoryId}`);
  return await res.json();
}

export async function fetchLifehackById(id: number): Promise<LifehackModel> {
  const res = await apiRequest("GET", `/api/lifehacks/${id}`);
  return await res.json();
}

// Category APIs
export async function fetchAllCategories(): Promise<CategoryModel[]> {
  const res = await apiRequest("GET", "/api/categories");
  return await res.json();
}

export async function fetchCategoryById(id: number): Promise<CategoryModel> {
  const res = await apiRequest("GET", `/api/categories/${id}`);
  return await res.json();
}
