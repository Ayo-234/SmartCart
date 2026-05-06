import { jwtVerify } from 'jose';

export async function verifyAuth(request) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) return null;

    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || 'fallback_secret_key_change_me'
    );

    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch {
    return null;
  }
}

export async function verifyAdmin(request) {
  const payload = await verifyAuth(request);
  if (!payload) return null;
  if (payload.role !== 'admin') return null;
  return payload;
}
