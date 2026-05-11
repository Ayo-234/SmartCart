import { NextResponse } from 'next/server';
import { testAIConnection } from '@/lib/ai';

export async function GET() {
  try {
    const result = await testAIConnection();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
