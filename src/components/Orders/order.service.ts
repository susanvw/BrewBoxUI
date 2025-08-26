import type { AxiosError } from 'axios';
import { api, type ApiError } from '../../services/api';
import {
  EOrderStatus,
  type CreateOrderRequest,
  type IOrder,
  type UpdateOrderStatusRequest
} from './order.type';

const controller = '/Orders';

export const getOrders = async (): Promise<IOrder[]> => {
  try {
    const response = await api.get<any>(controller);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>;
    throw new Error(
      axiosError.response?.data?.message || 'Failed to fetch orders'
    );
  }
};

export const getActiveOrders = async (
  isCustomer: boolean
): Promise<IOrder[]> => {
  try {
    const route = isCustomer
      ? `${controller}/customer`
      : `${controller}/barista`;
    const response = await api.get<any>(route);
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
    const response = await api.get<any>(`${controller}/${id}`);
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
    const response = await api.post<any>(controller, request);
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
    await api.put(`${controller}/${id}/status`, {
      status: EOrderStatus.Claimed
    });
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
    await api.put(`${controller}/${id}/status`, request);
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>;
    throw new Error(
      axiosError.response?.data?.message || 'Failed to update order status'
    );
  }
};
