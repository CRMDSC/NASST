import {  DocumentType, Result } from "../models/model";
import request from "../utils/request";

export async function addDocumentType(input: DocumentType) {
  const response = await request.post<Result<DocumentType>>("documentType/AddDocumentType", input);
  return response.data;
}
export async function getDocs() {
  const response = await request.get<Result<DocumentType[]>>("documentType/GetDocumentType");
  return response.data;
}
export async function getDocument(id: number) {
  const response = await request.get<Result<DocumentType[]>>(`documentType/GetDocument/${id}`);
  return response.data;
}
export async function updateDocumentType(input: DocumentType) {
  const response = await request.post<Result<boolean>>("documentType/UpdateDocumentType", input);
  return response.data;
}
export async function deleteDocumentType(id: number) {
  const response = await request.post<Result<boolean>>("documentType/DeleteDocumentType", id, {
    headers: {
        'Content-Type': 'application/json' 
    }
});
return response.data;
}