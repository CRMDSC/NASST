import { observable } from "mobx";
import Cookies from "js-cookie";
import { RootStore } from "./rootStore";

export class TokenStore {
  
  rootStore: RootStore;

  static tokenKey = "naast.Token";
  static refreshTokenKey = "refreshToken";

  @observable private _token: string | null = null;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    this._token = Cookies.get(TokenStore.tokenKey) || this._token;
  }

  set token(token: string | null) {
    if (token == null) {
      this._token = null;
      Cookies.remove(TokenStore.tokenKey);
    } else {
      this._token = token;
      Cookies.set(TokenStore.tokenKey, token, {sameSite: "None", secure: true});
    }
  }
  
  get token() {
    return this._token;
  }
  
  get refreshToken() {
    return Cookies.get(TokenStore.refreshTokenKey);
  }

}
