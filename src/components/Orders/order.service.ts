import type { AxiosError } from "axios";
import { api, type ApiError } from "../../services/api";
import { EOrderStatus, type CreateOrderRequest, type IOrder, type UpdateOrderStatusRequest } from "./order.type";


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