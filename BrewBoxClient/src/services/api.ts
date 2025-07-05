import axios, { AxiosError } from 'axios';
import type { ApiError, CreateOrderRequest, LoginRequest, Order } from './service.types';


     const api = axios.create({
       baseURL: 'http://localhost:5196/api',
     });

     export const login = async (request: LoginRequest): Promise<string> => {
       try {
         const response = await api.post<{ token: string }>('/auth/login', request);
         return response.data.token;
       } catch (error) {
         const axiosError = error as AxiosError<ApiError>;
         throw new Error(axiosError.response?.data?.error || axiosError.response?.data?.message || 'Login failed');
       }
     };

     export const getOrders = async (token: string): Promise<Order[]> => {
       try {
         const response = await api.get<Order[]>('/orders', {
           headers: { Authorization: `Bearer ${token}` },
         });
         return response.data;
       } catch (error) {
         const axiosError = error as AxiosError<ApiError>;
         throw new Error(axiosError.response?.data?.message || 'Failed to fetch orders');
       }
     };

     export const getActiveOrders = async (token: string): Promise<Order[]> => {
       try {
         const response = await api.get<Order[]>('/orders/active', {
           headers: { Authorization: `Bearer ${token}` },
         });
         return response.data;
       } catch (error) {
         const axiosError = error as AxiosError<ApiError>;
         throw new Error(axiosError.response?.data?.message || 'Failed to fetch active orders');
       }
     };

     export const createOrder = async (request: CreateOrderRequest, token: string): Promise<Order> => {
       try {
         const response = await api.post<Order>('/orders', request, {
           headers: { Authorization: `Bearer ${token}` },
         });
         return response.data;
       } catch (error) {
         const axiosError = error as AxiosError<ApiError>;
         throw new Error(axiosError.response?.data?.message || 'Failed to create order');
       }
     };