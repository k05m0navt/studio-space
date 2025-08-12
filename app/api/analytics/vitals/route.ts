import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Log the web vitals metrics
    console.log('[Web Vitals]', body);
    
    // Here you would typically send this data to your analytics service
    // Example: await fetch('https://your-analytics-endpoint.com', { method: 'POST', body: JSON.stringify(body) });
    
    // You could also store in your database
    // Example with Prisma: await prisma.webVitals.create({ data: body });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Web Vitals Error]', error);
    return NextResponse.json({ error: 'Failed to process web vitals' }, { status: 500 });
  }
} 