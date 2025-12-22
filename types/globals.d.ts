/**
 * Global TypeScript type declarations
 *
 * This file extends Clerk's types to include custom metadata fields
 * for role-based access control (RBAC).
 */

export {};

/**
 * Custom metadata structure for user roles and permissions
 */
export interface CustomMetadata {
  role?: 'admin' | 'user' | 'moderator' | 'viewer';
  roles?: Array<'admin' | 'user' | 'moderator' | 'viewer'>;
  permissions?: string[];
  department?: string;
  organization?: string;
}

declare global {
  /**
   * Extend Clerk's CustomJwtSessionClaims interface to include our custom metadata
   *
   * This allows TypeScript to recognize the metadata field in sessionClaims
   * throughout the application.
   *
   * @see https://clerk.com/docs/backend-requests/making/custom-session-token
   */
  interface CustomJwtSessionClaims {
    metadata?: CustomMetadata;
  }

  /**
   * Optional: Extend the User interface if you store metadata on the user object
   */
  interface UserPublicMetadata {
    role?: 'admin' | 'user' | 'moderator' | 'viewer';
    roles?: Array<'admin' | 'user' | 'moderator' | 'viewer'>;
    permissions?: string[];
    department?: string;
    organization?: string;
  }

  /**
   * Window type extensions (if needed for client-side)
   */
  interface Window {
    // Add any custom window properties here
  }
}
