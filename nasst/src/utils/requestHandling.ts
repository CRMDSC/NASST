import axios from "axios"
import rootStore from "../store/rootStore";
import { Result } from "../models/model";
import Cookies from "js-cookie";

export const errorHandling =  async (error : any) => {
    const { response } = error;
    const originalRequest = error.config;
    
    if (response && response.data && !(response.data instanceof Blob && response.data.size === 0)) {
        const result = response.data 
        if (result.errors) {
            console.log("Error", result.error)
        }
        if (originalRequest.url === "account/RefreshToken") {
            if (response.status === 409)
                return response;
            else if (response.status === 401 || response.status === 404) {
                rootStore.user.logout(false)
                return response;
            }
        }
        return Promise.reject(response.data);
    } else if (response && response.status === 401) {
        if (originalRequest.url === "RefreshToken") {
            var currentRefreshToken = Cookies.get("refreshToken")
            if(currentRefreshToken)
            rootStore.user.logout()
        } else {
            try {
                var refreshTokenRes = await rootStore.user.refreshToken()
                var requestAgainRes
                if (refreshTokenRes && refreshTokenRes.status === 200) {
                    originalRequest.headers.Authorization = "Bearer " + refreshTokenRes.payload.accessToken
                    try {
                        requestAgainRes = await axios(originalRequest)
                        return requestAgainRes
                    } catch (error : any) {
                        const { response } = error;
                        if (response && response.data)
                            return Promise.reject(response.data);
                    }
                } else if (refreshTokenRes && refreshTokenRes.status === 409) {
                    var currentToken = rootStore.token.token
                    var attempts = 30;
                    while (currentToken === originalRequest.headers.Authorization.split(" ")[1] && attempts > 0) {
                        await new Promise(resolve => setTimeout(resolve,100))
                            currentToken = rootStore.token.token
                            attempts--
                    }
                    originalRequest.headers.Authorization = "Bearer " + currentToken
                    try {
                        requestAgainRes = await axios(originalRequest)
                        return requestAgainRes
                    } catch (error : any) {
                        const { response } = error;
                        if (response && response.data)
                            return Promise.reject(response.data);
                    }
                } else if (refreshTokenRes && (refreshTokenRes.status === 401 || refreshTokenRes.status === 404)) {
                    return {
                        data : {
                            payload: null,
                            errors: [{code: "401", description: "Invalid token", path: ""}],
                            status: 401
                        } as Result<any>
                    }
                }
            } catch (err) {
                return {
                    data : {
                        payload: null,
                        errors: [{code: "401", description: "Invalid token", path: ""}],
                        status: 401
                    } as Result<any>
                }
            }
        }
        return Promise.reject(response);
    } else if (originalRequest.url === "account/RefreshToken") {
        
        rootStore.user.logout()
        return {
            data : {
                payload: null,
                errors: [{code: "401", description: "Invalid token", path: ""}],
                status: 401
            } as Result<any>
        }
    }
}