import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function middleware(request: NextRequest) {
  // Klón létrehozása a válaszról
  const response = NextResponse.next();

  // Cache-Control fejléc beállítása, hogy letiltsa a gyorsítótárazást
  response.headers.set('Cache-Control', 'no-store, max-age=0, must-revalidate');
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Expires', '0');

  return response;
}

// Minden útvonalra alkalmazza a middleware-t
export const config = {
  matcher: [
    // Összes útvonal, kivéve a statikus fájlokat
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
