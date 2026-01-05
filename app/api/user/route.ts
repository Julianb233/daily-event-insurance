import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db, isDbConfigured, users } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { isDevMode, MOCK_USER } from '@/lib/mock-data';

/**
 * GET /api/user
 *
 * Returns current authenticated user data from NextAuth session
 * Requires authentication
 *
 * @returns User data or 401 if not authenticated
 */
export async function GET() {
  // Dev mode - return mock user
  if (isDevMode) {
    return NextResponse.json({
      id: 'mock-user-id',
      email: 'demo@partner.dev',
      name: 'Demo User',
      role: 'partner',
    });
  }

  const session = await auth();

  if (!session?.user) {
    return NextResponse.json(
      { error: 'Not authenticated' },
      { status: 401 }
    );
  }

  // Get full user data from database if available
  if (isDbConfigured() && db) {
    try {
      const userResult = await db
        .select()
        .from(users)
        .where(eq(users.id, session.user.id))
        .limit(1);

      if (userResult.length > 0) {
        const user = userResult[0];
        return NextResponse.json({
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        });
      }
    } catch (error) {
      console.error('Error fetching user from database:', error);
    }
  }

  // Fallback to session data (image not available in session)
  return NextResponse.json({
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
    role: session.user.role,
  });
}

/**
 * PATCH /api/user
 *
 * Updates user profile data
 *
 * @returns Updated user data or error
 */
export async function PATCH(request: Request) {
  // Dev mode - simulate update
  if (isDevMode) {
    const body = await request.json();
    return NextResponse.json({
      message: 'User updated (dev mode)',
      receivedData: body,
    });
  }

  const session = await auth();

  if (!session?.user) {
    return NextResponse.json(
      { error: 'Not authenticated' },
      { status: 401 }
    );
  }

  if (!isDbConfigured() || !db) {
    return NextResponse.json(
      { error: 'Database not configured' },
      { status: 503 }
    );
  }

  const body = await request.json();
  const { name, image } = body;

  // Build update object with only provided fields
  const updateData: Partial<{ name: string; image: string; updatedAt: Date }> = {};
  if (name !== undefined) updateData.name = name;
  if (image !== undefined) updateData.image = image;

  if (Object.keys(updateData).length === 0) {
    return NextResponse.json(
      { error: 'No fields to update' },
      { status: 400 }
    );
  }

  updateData.updatedAt = new Date();

  try {
    const updated = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, session.user.id))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const user = updated[0];
    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      image: user.image,
      role: user.role,
      updatedAt: user.updatedAt,
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}
