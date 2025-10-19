import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Forward the request to the external API
    const response = await fetch('https://puspa.sinus.ac.id/api/v1/registration', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(body),
    });

    // Get response data
    let responseData;
    const contentType = response.headers.get('content-type');

    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }

    // Create Next.js response with external API data
    const nextResponse = new NextResponse(
      contentType && contentType.includes('application/json')
        ? JSON.stringify(responseData)
        : responseData,
      {
        status: response.status,
        statusText: response.statusText,
      }
    );

    // Copy response headers from external API
    response.headers.forEach((value, key) => {
      nextResponse.headers.set(key, value);
    });

    // Add CORS headers to allow frontend access
    nextResponse.headers.set('Access-Control-Allow-Origin', request.headers.get('origin') || '*');
    nextResponse.headers.set('Access-Control-Allow-Credentials', 'true');
    nextResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    nextResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

    return nextResponse;

  } catch (error) {
    console.error('Proxy registration error:', error);

    return new NextResponse(
      JSON.stringify({
        error: 'Proxy server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': request.headers.get('origin') || '*',
        },
      }
    );
  }
}

// Handle preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    },
  });
}