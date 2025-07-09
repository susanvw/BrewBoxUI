import axios, { AxiosError } from 'axios';
import type { IRegisterRequest, IRegisterResponse } from './account.type';
import type { LoginRequest, ILoginResponse, MfaRequest } from './auth.type';
import {
  EOrderStatus,
  type CreateOrderRequest,
  type IOrder,
  type UpdateOrderStatusRequest,
  type UpdatePaymentRequest
} from './order.type';
export interface ApiError {
  error?: string;
  message?: string;
  details?: string[];
}

const apiUrl = import.meta.env.VITE_APP_API_URL;
const api = axios.create({
  baseURL: `${apiUrl}/api`,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to include token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwtToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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

export const verifyGoogleMfa = async (
  request: MfaRequest
): Promise<ILoginResponse> => {
  try {
    const response = await api.post<ILoginResponse>(
      '/Account/mfa/google',
      request
    );
    if (response.data.success && response.data.result?.token) {
      localStorage.setItem('jwtToken', response.data.result?.token);
      localStorage.setItem('userRoles', response.data.result?.roles.join(','));
    }
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>;
    throw new Error(axiosError.response?.data?.message || 'Google MFA failed');
  }
};

export const verifyAppleMfa = async (
  request: MfaRequest
): Promise<ILoginResponse> => {
  try {
    const response = await api.post<ILoginResponse>(
      '/Account/mfa/apple',
      request
    );
    if (response.data.success && response.data.result) {
      localStorage.setItem('jwtToken', response.data.result?.token);
      localStorage.setItem('userRoles', response.data.result?.roles.join(','));
    }
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>;
    throw new Error(axiosError.response?.data?.message || 'Apple MFA failed');
  }
};

export const getOrders = async (): Promise<IOrder[]> => {
  try {
    const response = await api.get<any>('/Orders');
    console.log(response);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>;
    throw new Error(
      axiosError.response?.data?.message || 'Failed to fetch orders'
    );
  }
};

export const getActiveOrders = async (): Promise<IOrder[]> => {
  try {
    const response = await api.get<any>('/Orders/active');
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>;
    throw new Error(
      axiosError.response?.data?.message || 'Failed to fetch active orders'
    );
  }
};

export const getCurrentOrders = async (): Promise<IOrder[]> => {
  try {
    const response = await api.get<any>('/Orders/current');
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>;
    throw new Error(
      axiosError.response?.data?.message || 'Failed to fetch active orders'
    );
  }
};

export const getOrderById = async (id: string): Promise<IOrder> => {
  try {
    const response = await api.get<any>(`/Orders/${id}`);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>;
    throw new Error(
      axiosError.response?.data?.message || 'Failed to fetch order'
    );
  }
};

export const createOrder = async (
  request: CreateOrderRequest
): Promise<IOrder> => {
  try {
    const response = await api.post<any>('/Orders', request);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>;
    throw new Error(
      axiosError.response?.data?.message || 'Failed to create order'
    );
  }
};

export const claimOrder = async (id: string): Promise<void> => {
  try {
    await api.put(`/Orders/${id}/status`, { status: EOrderStatus.Claimed });
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>;
    throw new Error(
      axiosError.response?.data?.message || 'Failed to claim order'
    );
  }
};

export const updateOrderStatus = async (
  id: string,
  request: UpdateOrderStatusRequest
): Promise<void> => {
  try {
    await api.put(`/Orders/${id}/status`, request);
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>;
    throw new Error(
      axiosError.response?.data?.message || 'Failed to update order status'
    );
  }
};

export const updatePaymentStatus = async (
  id: string,
  request: UpdatePaymentRequest
): Promise<void> => {
  try {
    await api.put(`/Orders/${id}/payment`, request);
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>;
    throw new Error(
      axiosError.response?.data?.message || 'Failed to update payment status'
    );
  }
};

export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('jwtToken');
  if (!token) return false;
  return true;
};

export const logout = (): void => {
  localStorage.removeItem('jwtToken');
};

export function registerFcmToken() {
  throw new Error('Function not implemented.');
}
