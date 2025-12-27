/**
 * Global TypeScript type declarations
 *
 * This file contains custom type extensions for the application.
 */

export {};

/**
 * Custom metadata structure for user roles and permissions
 */
export interface CustomMetadata {
  role?: 'admin' | 'user' | 'moderator' | 'viewer' | 'partner';
  permissions?: string[];
  department?: string;
  organization?: string;
}

declare global {
  /**
   * Window type extensions (if needed for client-side)
   */
  interface Window {
    // Add any custom window properties here
  }
}
