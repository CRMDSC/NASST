import { observable, action, IObservableArray, computed } from "mobx";
import { RootStore } from "./rootStore";
import { LoginInput } from "../models/model";
import * as Account from "../api/account"


export class UserStore {
    rootStore: RootStore;
    @observable userId = "";
    @observable isLoggedIn = false;
    @observable username = "";
    @observable firstName = "";
    @observable lastName = "";
    @observable fullname = "";
    @observable loading = true;
    @observable role = "";

    @computed get token() {
        return this.rootStore.token ? this.rootStore.token.token : undefined;
    }

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
    }

    @action
    async login(input: LoginInput) {
        this.loading = true
        const data = await Account.login(input);
        if (data) {
            console.log("this is the login data", data)
            this.rootStore.token.token = data.payload.accessToken;
            this.isLoggedIn = true;
            await this.getUserInfo();
        }
        this.loading = false;
        return data;
    }
    @action
    async refreshToken() {
        const data = await Account.refreshToken();
        if (data && data.status === 200) {
            this.rootStore.token.token = data.payload.accessToken;
        }
        return data;
    }
    @action
    async logout(withRequest: boolean = true) {
        let res
        if (this.token && withRequest)
            res = await Account.logout();
        if (res || !withRequest) {
            this.rootStore.token.token = null;
            this.isLoggedIn = false;
            this.role = "";
            return new Promise<void>((resolve) => setTimeout(() => resolve(), 1000));
        }
    }

    @action
    async getUserInfo() {
        try {
            const info = await Account.getUserInfo();
            console.log(info.payload);
            if (info.status === 200) {
                this.userId = info.payload.userId;
                this.role = info.payload.role;
                this.isLoggedIn = true;
                this.firstName = info.payload.firstName;
                this.lastName = info.payload.lastName;
                this.fullname = info.payload.fullName;

            }
            else {
                this.isLoggedIn = false;
            }
            this.loading = false;
        } catch (error) {
            console.log(error)
            this.loading = false;
        }
    }
}
