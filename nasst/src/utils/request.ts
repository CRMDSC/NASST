import axios from "axios"
import rootStore from "../store/rootStore";
import { Result } from "../models/model";
import { errorHandling } from './requestHandling';

declare const baseUrl: string;

const service = axios.create({
    baseURL:"http://localhost:5028/api", // url = base url + request url
});

service.interceptors.response.use(
    (response) => {
        if(response.data instanceof Blob){
            return response;
        }
        const data = response.data as Result<any>;
        if (data && data.errors) {
            console.log("Error", data.errors)
        }
        return response;
    },
    async (error) => errorHandling(error)

);

service.interceptors.request.use(
    (config) => {
        // Add X-Access-Token header to every request, you can add other custom headers here
        if (rootStore.token && rootStore.token.token) {
            // eslint-disable-next-line no-param-reassign
            config.headers.Authorization = `Bearer ${rootStore.token.token}`;
        }
        return config;
    },
    (error) => {
        Promise.reject(error);
    },
);

export default service;