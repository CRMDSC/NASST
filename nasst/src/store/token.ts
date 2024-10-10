// import { observable } from "mobx";
// import Cookies from "js-cookie";

// export class TokenStore {
  
//   rootStore: RootStore;

//   static tokenKey = "Blu.Attendance.Token";
//   static refreshTokenKey = "refreshToken";

//   @observable private m_token: string | null = null;
//   @observable private m_refreshToken: string | null = null;

//   constructor(rootStore: RootStore) {
//     this.rootStore = rootStore;
//     this.m_token = Cookies.get(TokenStore.tokenKey) || this.m_token;
//     // this.m_refreshToken = localStorage.getItem(TokenStore.refreshTokenKey) || this.m_refreshToken;
//   }

//   set token(token: string | null) {
//     if (token == null) {
//       this.m_token = null;
//       Cookies.remove(TokenStore.tokenKey);
//     } else {
//       this.m_token = token;
//       Cookies.set(TokenStore.tokenKey, token, {sameSite: "None", secure: true});
//     }
//   }
  
//   get token() {
//     return this.m_token;
//   }
  
//   get refreshToken() {
//     return Cookies.get(TokenStore.refreshTokenKey);
//   }

// }

// // export default new TokenStore();