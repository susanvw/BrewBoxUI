/**
 * Represents the possible roles a user can have within the system.
 * 
 * - `'Customer'`: A user who interacts with the service as a customer.
 * - `'Barista'`: A user who operates as a barista within the service.
 */
export type ERole = 'Customer' | 'Barista';


/**
 * Represents the data required to register a new user account.
 *
 * @property email - The email address of the user.
 * @property password - The password for the new account.
 * @property role - The role assigned to the user, as defined by the {@link ERole} enum.
 */
export interface IRegisterRequest {
  email: string;
  password: string;
  role: ERole
}