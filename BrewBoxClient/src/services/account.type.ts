/**
 * Represents the possible user roles within the application.
 *
 * @enum {string}
 * @property {string} Customer - Represents a customer user.
 * @property {string} Barista - Represents a barista user.
 */
export enum ERole {
  Customer = 'Customer',
  Barista = 'Barista'
}

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
  role: ERole;
}

/**
 * Represents the response returned after a user registration attempt.
 *
 * @property result - An optional string containing additional result information, or null if not applicable.
 * @property success - Indicates whether the registration was successful.
 * @property errors - An optional array of error messages, or null if there were no errors.
 */
export interface IRegisterResponse {
  result?: string | null;
  success: boolean;
  errors?: string[] | null;
}
