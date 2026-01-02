import { NextRequest, NextResponse } from 'next/server';
import { auth } from './auth';

// Development mode - bypass auth when NextAuth isn't configured
const isDevMode = !process.env.AUTH_SECRET;

// Mock users for development
const MOCK_ADMIN = {
  id: 'dev_admin_001',
  email: 'admin@dailyeventinsurance.com',
  name: 'Demo Admin',
  role: 'admin' as const,
};

const MOCK_PARTNER = {
  id: 'dev_partner_001',
  email: 'partner@demo.com',
  name: 'Demo Partner',
  role: 'partner' as const,
};

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'partner' | 'user';
}

type AuthHandler<T> = (request: NextRequest, user: AuthUser) => Promise<T>;
type AdminHandler<T> = () => Promise<T>;

/**
 * Middleware wrapper that requires authentication
 * Usage: withAuth(request, async (req, user) => { ... })
 */
export async function withAuth<T>(
  request: NextRequest,
  handler: AuthHandler<T>
): Promise<T | NextResponse> {
  // Dev mode bypass
  if (isDevMode) {
    console.log('[DEV MODE] Auth bypassed - using mock admin');
    return handler(request, MOCK_ADMIN);
  }

  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const user: AuthUser = {
      id: session.user.id,
      email: session.user.email || '',
      name: session.user.name || '',
      role: (session.user.role as AuthUser['role']) || 'user',
    };

    return handler(request, user);
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { success: false, error: 'Authentication failed' },
      { status: 401 }
    );
  }
}

/**
 * Middleware that requires admin role
 * Must be used inside withAuth callback
 * Usage: requireAdmin(user, async () => { ... })
 */
export async function requireAdmin<T>(
  user: AuthUser,
  handler: AdminHandler<T>
): Promise<T | NextResponse> {
  // Dev mode always grants admin access
  if (isDevMode) {
    return handler();
  }

  if (user.role !== 'admin') {
    return NextResponse.json(
      { success: false, error: 'Admin access required' },
      { status: 403 }
    );
  }

  return handler();
}

/**
 * Middleware that requires partner or admin role
 * Must be used inside withAuth callback
 */
export async function requirePartner<T>(
  user: AuthUser,
  handler: AdminHandler<T>
): Promise<T | NextResponse> {
  // Dev mode always grants partner access
  if (isDevMode) {
    return handler();
  }

  if (user.role !== 'partner' && user.role !== 'admin') {
    return NextResponse.json(
      { success: false, error: 'Partner access required' },
      { status: 403 }
    );
  }

  return handler();
}
