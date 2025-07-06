
import axios, { AxiosError } from 'axios';

export interface Order {
  id: string;
  customerId: string;
  status: string;
  totalPrice: number;
  pickupTime: string;
  tip?: number;
  paid: boolean;
  drinks: Drink[];
}

export interface Drink {
  id: string;
  type: string;
  size: string;
  price: number;
}

export interface LoginRequest {
  email: string;
  password: string;
  mfaType?: string;
  mfaToken?: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface MfaRequest {
  token: string;
}

export interface CreateOrderRequest {
  pickupTime: string;
  tip?: number;
  drinks: { type: string; size: string; price: number }[];
}

export interface ApiError {
  error?: string;
  message?: string;
  details?: string[];
}

export interface LoginResponse {
  token: string;
  requiresMfa: boolean;
  succeeded?: boolean;
}

const api = axios.create({
  baseURL: 'http://localhost:5196/api'
});

export const register = async (request: RegisterRequest): Promise<void> => {
  try {
    const response = await api.post('/auth/register', request);
    console.log('Register response:', response.data);
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>;
    console.error('Register error:', axiosError.response?.data);
    throw new Error(
      axiosError.response?.data?.error ||
        axiosError.response?.data?.message ||
        'Registration failed'
    );
  }
};

export const login = async (request: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await api.post<any>('/auth/login', request);
    const result = response.data?.result as LoginResponse;
    // Store token on successful login
    if (result?.succeeded && result?.token) {
      localStorage.setItem('jwtToken', result.token);
    }
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>;
    console.error('Login error:', axiosError.response?.data);
    throw new Error(
      axiosError.response?.data?.error ||
        axiosError.response?.data?.message ||
        'Login failed'
    );
  }
};

export const verifyGoogleMfa = async (request: MfaRequest): Promise<string> => {
  try {
    const response = await api.post<{ token: string; requiresMfa: boolean }>(
      '/auth/mfa/google',
      request
    );
    console.log('Google MFA response:', response.data);
    return response.data.token;
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>;
    console.error('Google MFA error:', axiosError.response?.data);
    throw new Error(
      axiosError.response?.data?.error ||
        axiosError.response?.data?.message ||
        'Google MFA failed'
    );
  }
};

export const verifyAppleMfa = async (request: MfaRequest): Promise<string> => {
  try {
    const response = await api.post<{ token: string; requiresMfa: boolean }>(
      '/auth/mfa/apple',
      request
    );
    console.log('Apple MFA response:', response.data);
    return response.data.token;
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>;
    console.error('Apple MFA error:', axiosError.response?.data);
    throw new Error(
      axiosError.response?.data?.error ||
        axiosError.response?.data?.message ||
        'Apple MFA failed'
    );
  }
};

export const getOrders = async (): Promise<Order[]> => {
  try {
    var token = localStorage.getItem('jwtToken');
    console.log('Fetching orders with token:', token);
    const response = await api.get<Order[]>('/orders', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Orders response:', response.data);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>;
    console.error('Get orders error:', axiosError.response?.data);
    throw new Error(
      axiosError.response?.data?.message || 'Failed to fetch orders'
    );
  }
};

export const getActiveOrders = async (token: string): Promise<Order[]> => {
  try {
    console.log('Fetching active orders with token:', token);
    const response = await api.get<Order[]>('/orders/active', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Active orders response:', response.data);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>;
    console.error('Get active orders error:', axiosError.response?.data);
    throw new Error(
      axiosError.response?.data?.message || 'Failed to fetch active orders'
    );
  }
};

export const createOrder = async (
  request: CreateOrderRequest,
  token: string
): Promise<Order> => {
  try {
    console.log('Creating order with token:', token, 'Request:', request);
    const response = await api.post<Order>('/orders', request, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Create order response:', response.data);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>;
    console.error('Create order error:', axiosError.response?.data);
    throw new Error(
      axiosError.response?.data?.message || 'Failed to create order'
    );
  }
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('jwtToken');
  if (!token) return false;

  // Basic token validation (could be enhanced with JWT decoding)
  try {
    // Optionally decode JWT to check expiration (requires jwt-decode library)
    return true;
  } catch {
    localStorage.removeItem('jwtToken');
    return false;
  }
};

export const logout = (): void => {
  localStorage.removeItem('jwtToken');
};
