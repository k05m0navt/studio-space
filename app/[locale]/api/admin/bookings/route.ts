import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Forward the request to the base API without locale
    const response = await fetch(`${request.nextUrl.origin}/api/admin/bookings`, {
      method: 'GET',
      headers: request.headers,
      cache: 'no-store'
    });

    // If the response is not ok, throw an error
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    // Check for content-type to handle potential non-JSON responses
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      return NextResponse.json(data);
    } else {
      // Handle text or other response types
      const text = await response.text();
      return new NextResponse(text, {
        status: response.status,
        headers: {
          'Content-Type': contentType || 'text/plain',
        },
      });
    }
  } catch (error) {
    console.error("Error in bookings proxy:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Forward the request to the base API without locale
    const response = await fetch(`${request.nextUrl.origin}/api/admin/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...request.headers
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in bookings proxy:", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
} 