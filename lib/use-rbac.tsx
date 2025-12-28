'use client';

/**
 * Client-Side RBAC Hooks
 *
 * React hooks for role-based access control in client components.
 * These hooks use NextAuth's session to check roles.
 *
 * IMPORTANT: Client-side checks are for UI only. Always verify permissions
 * on the server for actual security.
 */

import { useSession } from 'next-auth/react';
import { useMemo } from 'react';

/**
 * Hook to get the current user's role
 *
 * @returns The user's primary role or 'user' as default
 */
export function useUserRole(): string {
  const { data: session } = useSession();

  return useMemo(() => {
    return session?.user?.role || 'user';
  }, [session?.user?.role]);
}

/**
 * Hook to get all roles assigned to the current user
 *
 * @returns Array of roles (currently single role as array)
 */
export function useUserRoles(): string[] {
  const { data: session } = useSession();

  return useMemo(() => {
    const role = session?.user?.role;
    return role ? [role] : ['user'];
  }, [session?.user?.role]);
}

/**
 * Hook to check if the current user has a specific role
 *
 * @param role - The role to check for
 * @returns True if user has the specified role
 */
export function useHasRole(role: string): boolean {
  const { data: session } = useSession();

  return useMemo(() => {
    return session?.user?.role === role;
  }, [session?.user?.role, role]);
}

/**
 * Hook to check if the current user has any of the specified roles
 *
 * @param roles - Array of roles to check
 * @returns True if user has at least one of the specified roles
 */
export function useHasAnyRole(roles: string[]): boolean {
  const userRole = useUserRole();

  return useMemo(() => {
    return roles.includes(userRole);
  }, [userRole, roles]);
}

/**
 * Hook to check if the current user has all of the specified roles
 *
 * @param roles - Array of roles to check
 * @returns True if user has all specified roles (for single role, checks if in array)
 */
export function useHasAllRoles(roles: string[]): boolean {
  const userRole = useUserRole();

  return useMemo(() => {
    // With single role system, can only have all roles if there's only one required
    return roles.length === 1 && roles[0] === userRole;
  }, [userRole, roles]);
}

/**
 * Hook to check if user is authenticated
 *
 * @returns True if user is logged in
 */
export function useIsAuthenticated(): boolean {
  const { data: session, status } = useSession();
  return status === 'authenticated' && !!session?.user;
}

/**
 * Hook to check if user is an admin
 *
 * @returns True if user has admin role
 */
export function useIsAdmin(): boolean {
  return useHasRole('admin');
}

/**
 * Hook to check if user is a moderator or admin
 *
 * @returns True if user can moderate
 */
export function useCanModerate(): boolean {
  return useHasAnyRole(['admin', 'moderator']);
}

/**
 * Hook to check if user is a partner
 *
 * @returns True if user has partner role
 */
export function useIsPartner(): boolean {
  return useHasAnyRole(['partner', 'admin']);
}

/**
 * Permission definitions - maps permissions to required roles
 */
const PERMISSIONS: Record<string, string[]> = {
  // Admin permissions
  'manage:users': ['admin'],
  'manage:partners': ['admin'],
  'manage:settings': ['admin'],
  'view:analytics': ['admin', 'partner'],
  'view:reports': ['admin', 'partner'],

  // Partner permissions
  'create:quotes': ['admin', 'partner'],
  'view:policies': ['admin', 'partner'],
  'manage:products': ['admin', 'partner'],

  // Moderator permissions
  'moderate:content': ['admin', 'moderator'],

  // User permissions
  'view:dashboard': ['admin', 'partner', 'moderator', 'user'],
};

/**
 * Hook to check if user has a specific permission
 *
 * @param permission - The permission to check
 * @returns True if user has the permission
 */
export function useHasPermission(permission: string): boolean {
  const role = useUserRole();

  return useMemo(() => {
    const allowedRoles = PERMISSIONS[permission] || [];
    return allowedRoles.includes(role);
  }, [role, permission]);
}

/**
 * Combined RBAC hook that returns all role info
 *
 * @returns Object with role, roles, and check functions
 */
export function useRBAC() {
  const role = useUserRole();
  const roles = useUserRoles();
  const isAuthenticated = useIsAuthenticated();
  const isAdmin = useIsAdmin();
  const canModerate = useCanModerate();
  const isPartner = useIsPartner();

  return {
    // Current role info
    role,
    roles,

    // Authentication status
    isAuthenticated,

    // Convenience flags
    isAdmin,
    canModerate,
    isPartner,

    // Check functions
    hasRole: (roleToCheck: string) => role === roleToCheck,
    hasAnyRole: (rolesToCheck: string[]) => rolesToCheck.includes(role),
    hasPermission: (permission: string) => {
      const allowedRoles = PERMISSIONS[permission] || [];
      return allowedRoles.includes(role);
    },
    permissions: Object.keys(PERMISSIONS).filter(perm => {
      const allowedRoles = PERMISSIONS[perm] || [];
      return allowedRoles.includes(role);
    }),
  };
}

/**
 * Higher-Order Component to protect client components
 *
 * @param Component - The component to protect
 * @param requiredRole - The required role
 * @param fallback - Optional fallback component
 * @returns Protected component
 */
export function withRole<P extends object>(
  Component: React.ComponentType<P>,
  requiredRole: string,
  fallback?: React.ReactNode
) {
  return function ProtectedComponent(props: P) {
    const hasRole = useHasRole(requiredRole);

    if (!hasRole) {
      return <>{fallback || <div>Access Denied</div>}</>;
    }

    return <Component {...props} />;
  };
}

/**
 * Higher-Order Component to protect client components (any role)
 *
 * @param Component - The component to protect
 * @param requiredRoles - Array of acceptable roles
 * @param fallback - Optional fallback component
 * @returns Protected component
 */
export function withAnyRole<P extends object>(
  Component: React.ComponentType<P>,
  requiredRoles: string[],
  fallback?: React.ReactNode
) {
  return function ProtectedComponent(props: P) {
    const hasRole = useHasAnyRole(requiredRoles);

    if (!hasRole) {
      return <>{fallback || <div>Access Denied</div>}</>;
    }

    return <Component {...props} />;
  };
}
