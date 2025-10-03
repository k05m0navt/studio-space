import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const auth = request.headers.get('authorization') || undefined;
    const response = await fetch(`${request.nextUrl.origin}/api/settings/general`, {
      method: 'GET',
      headers: auth ? { Authorization: auth } : undefined,
      cache: 'no-store'
    });

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      return NextResponse.json(data, { status: response.status });
    } else {
      const text = await response.text();
      return new NextResponse(text, {
        status: response.status,
        headers: { 'Content-Type': contentType || 'text/plain' }
      });
    }
  } catch (error) {
    console.error('Error in settings/general proxy GET:', error);
    return NextResponse.json({ error: 'Failed to fetch general settings' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const auth = request.headers.get('authorization') || undefined;
    const body = await request.text();

    const response = await fetch(`${request.nextUrl.origin}/api/settings/general`, {
      method: 'PUT',
      headers: {
        'Content-Type': request.headers.get('content-type') || 'application/json',
        ...(auth ? { Authorization: auth } : {})
      },
      body
    });

    const data = await response.json().catch(async () => {
      const text = await response.text().catch(() => '');
      return { text };
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error in settings/general proxy PUT:', error);
    return NextResponse.json({ error: 'Failed to proxy update' }, { status: 500 });
  }
}
