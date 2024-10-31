import { serialize } from "object-to-formdata";
import { LoginInput, LoginView, RegisterInput, Result, SportPlayersCategory, SportTypeInput, SportTypeView, UpdateSportTypeInput, User, UserView, } from "../models/model";
import request from "../utils/request";

export async function addSportType(input: SportTypeInput) {
    const formData = new FormData();

    formData.append("name", input.name as string);
    formData.append("teamsCount", input.teamsCount.toString());
    formData.append("teamAdminId", input.teamAdminId ?? "");
    formData.append("registrationTime", input.registrationTime.toString());
    formData.append("replacementTime", input.replacementTime.toString());
    // Append arrays in indexed format
    input.sportPlayersCategories?.forEach((item, index) => {
        formData.append(`sportPlayersCategories[${index}].id`, item.id.toString());
        formData.append(`sportPlayersCategories[${index}].categoryId`, item.categoryId.toString());
        formData.append(`sportPlayersCategories[${index}].playersCount`, item.playersCount.toString());
        // Add other properties as needed
    });

    input.sportAdditionalInfo?.forEach((item, index) => {
        formData.append(`sportAdditionalInfo[${index}].id`, item.id.toString());
        formData.append(`sportAdditionalInfo[${index}].name`, item.name);
        // Add other properties as needed
    });

    input.sportDocumentType?.forEach((item, index) => {
        formData.append(`sportDocumentType[${index}].id`, item.id.toString());
        formData.append(`sportDocumentType[${index}].type`, item.type);
        // Add other properties as needed
    });

    if (input.logo) {
        formData.append("logo", input.logo);
    }

    console.log("formData entries:", Array.from(formData.entries()));

    const response = await request.post<Result<boolean>>("sporttype/AddSportType", formData);

    return response.data;
}

// export async function editSportType(input: UpdateSportTypeInput) {
//     const response = await request.post<Result<boolean>>("sporttype/UpdateSportType", input);
//     return response.data;
// }
export async function editSportType(input: UpdateSportTypeInput) {
    const formData = new FormData();

    formData.append("id", input.id.toString() )
    formData.append("name", input.name as string);
    formData.append("teamsCount", input.teamsCount.toString());
    formData.append("teamAdminId", input.teamAdminId ?? "");
    formData.append("registrationTime", input.registrationTime.toString());
    formData.append("replacementTime", input.replacementTime.toString());
    formData.append("logoUrl", input.logoUrl ?? "");
    // Append arrays in indexed format
    input.sportPlayersCategories?.forEach((item, index) => {
        formData.append(`sportPlayersCategories[${index}].id`, item.id.toString());
        formData.append(`sportPlayersCategories[${index}].categoryId`, item.categoryId.toString());
        formData.append(`sportPlayersCategories[${index}].playersCount`, item.playersCount.toString());
        // Add other properties as needed
    });

    input.sportAdditionalInfo?.forEach((item, index) => {
        formData.append(`sportAdditionalInfo[${index}].id`, item.id.toString());
        formData.append(`sportAdditionalInfo[${index}].name`, item.name);
        // Add other properties as needed
    });

    input.sportDocumentType?.forEach((item, index) => {
        formData.append(`sportDocumentType[${index}].id`, item.id.toString());
        formData.append(`sportDocumentType[${index}].type`, item.type);
        // Add other properties as needed
    });

    if (input.logo) {
        formData.append("logo", input.logo);
    }

    console.log("formData entries:", Array.from(formData.entries()));

    const response = await request.post<Result<boolean>>("sporttype/UpdateSportType", formData);

    return response.data;
}


export async function getAllSportsTypes() {
    const response = await request.get<Result<SportTypeView[]>>("sporttype/GetAllSportsType");
    return response.data;
}
export async function getSportType(id: number) {
    const response = await request.get<Result<SportTypeView>>(`sporttype/GetSportType/${id}`);
    return response.data;
}
export async function deleteSportType(id: number) {
    const response = await request.post<Result<boolean>>(`sporttype/DeleteSportType/${id}`);
    return response.data;
}
export async function getAllUsers() {
    const response = await request.get<Result<UserView[]>>("account/GetAllUsers");
    return response.data;
}
