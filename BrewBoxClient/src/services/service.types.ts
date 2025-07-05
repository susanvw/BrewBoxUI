
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