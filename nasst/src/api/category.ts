import { Category, Result } from "../models/model";
import request from "../utils/request";

export async function addCategory(input: Category) {
  const response = await request.post<Result<Category>>("category/AddCategory", input);
  return response.data;
}
export async function getCategories() {
  const response = await request.get<Result<Category[]>>("category/GetCategories");
  return response.data;
}
export async function getCategoryById(id: number) {
  const response = await request.get<Result<Category[]>>(`category/GetCategory/${id}`);
  return response.data;
}
export async function editCategory(input: Category) {
  const response = await request.post<Result<boolean>>("category/UpdateCategory", input);
  return response.data;
}
export async function deleteCategory(id: number) {
  const response = await request.post<Result<boolean>>("category/DeleteCategory", id, {
    headers: {
        'Content-Type': 'application/json' 
    }
});
return response.data;
}