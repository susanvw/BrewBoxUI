import type { AxiosError } from "axios";
import { api, type ApiError } from "../../services/api";
import type { ILoginResponse, LoginRequest } from "./auth.type";


export const login = async (request: LoginRequest): Promise<ILoginResponse> => {
  try {
    const response = await api.post<ILoginResponse>('/Auth/login', request);

    if (response.status !== 200) {
      return {
        success: false,
        errors: [response.statusText]
      } as ILoginResponse;
    }
    const data = response.data.result;
    console.log(data);

    if (!response.data) {
      return {
        success: false,
        errors: ['Could not authenticate user.']
      } as ILoginResponse;
    }

    if (!response.data.success) {
      return response.data;
    }

    if (data) {
      localStorage.setItem('jwtToken', data.token);
      localStorage.setItem('userRoles', data.roles?.join(',') ?? '');
    }
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>;
    throw new Error(axiosError.response?.data?.message || 'Login failed');
  }
};


export const logout = (): void => {
  localStorage.removeItem('jwtToken');
};