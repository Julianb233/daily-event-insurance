import { NextRequest, NextResponse } from 'next/server';
import { auth } from './auth';
import { logAudit } from '@/lib/audit';

// SECURITY: Dev mode auth bypass requires explicit opt-in
// Bypass ONLY if ALL conditions are met:
// 1. NODE_ENV === 'development'
// 2. DEV_AUTH_BYPASS === 'true' (explicit opt-in)
// 3. AUTH_SECRET is NOT set (prevents bypass in prod-like environments)
const shouldBypassAuth =
  process.env.NODE_ENV === 'development' &&
  process.env.DEV_AUTH_BYPASS === 'true' &&
  !process.env.AUTH_SECRET;

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
  if (shouldBypassAuth) {
    console.warn('[DEV MODE] Auth bypassed - set AUTH_SECRET to disable');
    return handler(request, MOCK_ADMIN);
  }

  try {
    const session = await auth();

    // Security Audit: Log authentication attempt
    // Note: We intentionally don't await this to avoid latency, 
    // unless strict auditing is required. Here we await for safety.
    await logAudit({
      action: 'login_attempt',
      resource: 'auth_session',
      actorType: 'system',
      metadata: {
        path: request.nextUrl.pathname,
      },
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown'
    });

    if (!session?.user?.id) {
      await logAudit({
        action: 'login_failed',
        resource: 'auth_session',
        actorType: 'system',
        metadata: { reason: 'no_session' }
      });
      
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
    await logAudit({
      action: 'system_error',
      resource: 'auth_middleware',
      actorType: 'system', 
      metadata: { error: String(error) }
    });
    
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
  // SECURITY: Bypass requires explicit DEV_AUTH_BYPASS=true
  if (shouldBypassAuth) {
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
  // SECURITY: Bypass requires explicit DEV_AUTH_BYPASS=true
  if (shouldBypassAuth) {
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
