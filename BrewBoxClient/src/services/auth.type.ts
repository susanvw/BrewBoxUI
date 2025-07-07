/**
 * Represents the payload required to perform a login request.
 *
 * @property email - The user's email address used for authentication.
 * @property password - The user's password used for authentication.
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Represents a request object for multi-factor authentication (MFA).
 *
 * @property token - The MFA token provided by the user for authentication.
 */
export interface MfaRequest {
  token: string;
}


/**
 * Represents the response returned after a login attempt.
 *
 * @property token - The authentication token issued upon successful login. Optional; may be absent if login fails or further authentication is required.
 * @property requiresMfa - Indicates whether multi-factor authentication (MFA) is required to complete the login process.
 * @property succeeded - Specifies whether the login attempt was successful.
 */
export interface ILoginResponse {
  token?: string | null;
  roles?: string[] | null;
  requiresMfa: boolean;
  succeeded: boolean;
  message?: string | null;
}