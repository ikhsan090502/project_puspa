import { NextRequest, NextResponse } from 'next/server';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS';

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return proxyRequest(request, 'GET', params.path);
}

export async function POST(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return proxyRequest(request, 'POST', params.path);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return proxyRequest(request, 'PUT', params.path);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return proxyRequest(request, 'DELETE', params.path);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return proxyRequest(request, 'PATCH', params.path);
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    },
  });
}

async function proxyRequest(
  request: NextRequest,
  method: HttpMethod,
  pathSegments: string[]
) {
  try {
    // Construct the external API URL
    const path = pathSegments.join('/');
    const externalUrl = `https://puspa.sinus.ac.id/api/v1/${path}`;

    // Handle query parameters
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    const finalExternalUrl = searchParams.toString()
      ? `${externalUrl}?${searchParams.toString()}`
      : externalUrl;

    // Get request body for POST, PUT, PATCH requests
    let body = null;
    if (['POST', 'PUT', 'PATCH'].includes(method)) {
      try {
        body = await request.arrayBuffer();
      } catch (error) {
        // If body parsing fails, continue without body
      }
    }

    // Prepare headers - copy important headers from original request
    const headers = new Headers();

    // Copy specific headers
    const contentType = request.headers.get('content-type');
    const authorization = request.headers.get('authorization');

    if (contentType) headers.set('Content-Type', contentType);
    if (authorization) headers.set('Authorization', authorization);

    // Set other common headers
    headers.set('Accept', 'application/json');
    headers.set('User-Agent', 'Next.js Proxy');

    // Make the request to external API
    const response = await fetch(finalExternalUrl, {
      method,
      headers,
      body: body || undefined,
    });

    // Get response data
    let responseData;
    const responseContentType = response.headers.get('content-type');

    if (responseContentType && responseContentType.includes('application/json')) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }

    // Create Next.js response with external API data
    const nextResponse = new NextResponse(
      responseContentType && responseContentType.includes('application/json')
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
    nextResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    nextResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

    return nextResponse;

  } catch (error) {
    console.error('Proxy error:', error);

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