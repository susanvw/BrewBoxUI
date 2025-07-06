import type { IDrink } from './drink.type';

/**
 * Represents the possible statuses for an order in the system.
 *
 * - `'New'`: The order has been created but not yet processed.
 * - `'Claimed'`: The order has been claimed by a staff member or system for processing.
 * - `'InProgress'`: The order is currently being prepared or processed.
 * - `'Ready'`: The order is ready for pickup or delivery.
 * - `'Completed'`: The order has been fulfilled and completed.
 */
export type EOrderStatus =
  | 'New'
  | 'Claimed'
  | 'InProgress'
  | 'Ready'
  | 'Completed';

/**
 * Represents an order placed by a customer.
 *
 * @property {string} id - Unique identifier for the order.
 * @property {string} createdById - Identifier of the user who created the order.
 * @property {string} [baristaId] - Optional identifier of the barista assigned to the order.
 * @property {EOrderStatus} status - Current status of the order.
 * @property {string} pickupTime - Scheduled pickup time for the order (ISO 8601 format).
 * @property {number} totalPrice - Total price of the order, excluding tip.
 * @property {number} [tip] - Optional tip amount for the order.
 * @property {boolean} paid - Indicates whether the order has been paid.
 * @property {IDrink[]} drinks - List of drinks included in the order.
 */
export interface IOrder {
  id: string;
  createdById: string;
  baristaId?: string;
  status: EOrderStatus;
  pickupTime: string;
  totalPrice: number;
  tip?: number;
  paid: boolean;
  drinks: IDrink[];
}


export interface CreateOrderRequest {
  pickupTime: string;
  tip?: number;
  drinks: { type: string; size: string; price: number }[];
}

export interface UpdateOrderStatusRequest {
  status: EOrderStatus
}

export interface UpdatePaymentRequest {
  paid: boolean;
}