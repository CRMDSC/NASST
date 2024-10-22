import {  AdditionalInformation, DocumentType, Result } from "../models/model";
import request from "../utils/request";

export async function addInformation(input: AdditionalInformation) {
  const response = await request.post<Result<AdditionalInformation>>("additionalInformation/AddInformation", input);
  return response.data;
}
export async function getInformation() {
  const response = await request.get<Result<AdditionalInformation[]>>("additionalInformation/GetInformation");
  return response.data;
}
export async function getInformationById(id: number) {
  const response = await request.get<Result<AdditionalInformation[]>>(`additionalInformation/GetInformation/${id}`);
  return response.data;
}
export async function updateAdditionalInformation(input: AdditionalInformation) {
  const response = await request.post<Result<boolean>>("additionalInformation/UpdateAdditionalInformation", input);
  return response.data;
}
export async function deleteAdditionalInformation(id: number) {
  const response = await request.post<Result<boolean>>("additionalInformation/DeleteAdditionalInformation", id, {
    headers: {
        'Content-Type': 'application/json' 
    }
});
return response.data;
}