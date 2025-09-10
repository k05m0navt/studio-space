import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const auth = request.headers.get('authorization') || undefined;
    const body = await request.json();

    const response = await fetch(`${request.nextUrl.origin}/api/bookings/confirm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(auth ? { Authorization: auth } : {}),
      },
      body: JSON.stringify(body),
    });

    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const data = await response.json();
      return NextResponse.json(data, { status: response.status });
    }

    const text = await response.text();
    return new NextResponse(text, { status: response.status, headers: { 'Content-Type': contentType || 'text/plain' } });
  } catch (error) {
    console.error('Error in bookings confirm proxy:', error);
    return NextResponse.json({ error: 'Failed to proxy booking confirm' }, { status: 500 });
  }
}
