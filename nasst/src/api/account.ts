import { serialize } from "object-to-formdata";
import { LoginInput, LoginView, RegisterInput, Result, User, UserView, } from "../models/model";
import request from "../utils/request";

export async function login(input: LoginInput) {
  const response = await request.post<Result<LoginView>>("account/login", input);
  return response.data;
}
export async function register(input: RegisterInput) {
    const response = await request.post<Result<User>>("account/register", input);
    return response.data;
  }
  

export async function logout() {
  const response = await request.post("account/Logout", { removeFcmToken : false });
  return response.data;
}

export async function refreshToken() {
  const response = await request.post<Result<LoginView>>("account/RefreshToken");
  return response.data;
}

export async function getUserInfo() {
  const response = await request.get<Result<UserView>>("account");
  return response.data;
}

// export async function resetPassword(input: PasswordResetInput) {
//   const response = await request.post<Result<boolean>>("account/password/reset", input);
//   return response.data;
// }


// export async function changePassword(input: ChangePasswordInput) {
//   const response = await request.post<Result<boolean>>("account/password", input);
//   return response.data;
// }

// export async function getUser(id: string) {
//   const response = await request.get<Result<UserView>>(`account/${id}`);
//   return response.data;
// }
