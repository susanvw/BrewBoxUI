import type { IDrink } from "../Drinks/drink.type";

/**
 * Represents the various statuses an order can have throughout its lifecycle.
 *
 * @remarks
 * The `EOrderStatus` enum is used to track and manage the state of an order
 * from creation to completion or cancellation.
 *
 * @enum {number}
 * @property {number} Placed - The order has been placed by the customer.
 * @property {number} Claimed - The order has been claimed for processing.
 * @property {number} InProgress - The order is currently being prepared.
 * @property {number} Ready - The order is ready for collection.
 * @property {number} Collected - The order has been collected by the customer.
 * @property {number} Cancelled - The order has been cancelled.
 * @property {number} Paid - The order has been Paid.
 */
export enum EOrderStatus {
    Placed = 'Placed',
    Claimed = 'Claimed',
    InProgress = 'InProgress',
    Ready = 'Ready',
    Collected = 'Collected',
    Cancelled = 'Cancelled',
    Paid = 'Paid'
}

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
  customer: string;
  barista?: string;
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