import axios, { AxiosResponse } from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL,
    headers: {
        'Access-Control-Allow-Origin': '*'
    },
    validateStatus: status => status === 400 || status === 200
});

export default api;

export interface DefaultResponse {
    success: boolean,
    errors: { field: string, message: string }[]
}

export function buildResponse(response: AxiosResponse<any, any>): DefaultResponse {
    return {
        success: response.status === 200,
        errors: response.data?.errors
    };
}