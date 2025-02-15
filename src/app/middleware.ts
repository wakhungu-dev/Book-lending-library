import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request: Request) {
  const token = request.headers.get('Authorization')?.split(' ')[1]; // Get JWT token

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET as string);
    const { payload } = await jwtVerify(token, secret);
    
    if (!payload.userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    request.headers.set('userId', payload.userId as string);
    return NextResponse.next();
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}

export const config = {
  matcher: ['/api/user/borrowed', '/api/borrow', '/api/return/:id'],
};
