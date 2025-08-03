import type { AxiosError } from "axios";
import { api, type ApiError } from "../../services/api";
import type { IRegisterRequest, IRegisterResponse } from "./account.type";


export const register = async (
  request: IRegisterRequest
): Promise<IRegisterResponse> => {
  try {
    const response = await api.post<IRegisterResponse>(
      '/Account/register',
      request
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>;
    throw new Error(
      axiosError.response?.data?.message || 'Registration failed'
    );
  }
};