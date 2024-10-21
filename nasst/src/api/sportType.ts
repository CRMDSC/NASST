import { serialize } from "object-to-formdata";
import { LoginInput, LoginView, RegisterInput, Result, SportTypeInput, SportTypeView, UpdateSportTypeInput, User, UserView, } from "../models/model";
import request from "../utils/request";

export async function addSportType(input: SportTypeInput) {
    const response = await request.post<Result<boolean>>("sporttype/AddSportType", input);
    return response.data;
}
export async function editSportType(input: UpdateSportTypeInput) {
    const response = await request.post<Result<boolean>>("sporttype/UpdateSportType", input);
    return response.data;
}
export async function getAllSportsTypes() {
    const response = await request.get<Result<SportTypeView[]>>("sporttype/GetAllSportsType");
    return response.data;
}
export async function getSportType(id : number) {
    const response = await request.get<Result<SportTypeView>>(`sporttype/GetSportType/${id}`);
    return response.data;
}
export async function deleteSportType(id : number) {
    const response = await request.post<Result<boolean>>(`sporttype/DeleteSportType/`, id);
    return response.data;
}

