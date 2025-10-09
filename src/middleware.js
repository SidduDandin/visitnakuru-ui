import { NextResponse } from 'next/server';

export async function middleware(req) {
  const path = req.nextUrl.pathname;

  const adminAuthToken = req.cookies.get('authToken')?.value;
  // const userAuthToken = req.cookies.get('userAuthToken')?.value;
  const isAdminUser = req.cookies.get('isAdmin')?.value === 'true';

  const publicAdminAuthPaths = [
    '/admin/login',
    '/admin/forgot-password',
    '/admin/reset-password',
  ];
  const protectedAdminPaths = ['/admin'];

  // const publicUserAuthPaths = [
  //   '/login',
  //   '/register',
  // ];
  // const protectedUserPaths = ['/dashboard', '/profile'];


//new 
  if (isAdminUser && !adminAuthToken && !publicAdminAuthPaths.some(p => path.startsWith(p))) {
    const response = NextResponse.redirect(new URL('/admin/login', req.url));
    response.cookies.delete('isAdmin');
    return response;
  }

  // Admin Auth Pages
  if (publicAdminAuthPaths.some(p => path.startsWith(p))) {
    if (adminAuthToken && isAdminUser && path === '/admin/login') {
      return NextResponse.redirect(new URL('/admin', req.url));
    }
    return NextResponse.next();
  }

  // Admin Protected Pages
  if (protectedAdminPaths.some(p => path.startsWith(p))) {
    if (!adminAuthToken || !isAdminUser) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
    return NextResponse.next();
  }

  // // User Auth Pages
  // if (publicUserAuthPaths.some(p => path.startsWith(p))) {
  //   if (userAuthToken && !isAdminUser && path === '/login') {
  //     return NextResponse.redirect(new URL('/dashboard', req.url));
  //   }
  //   return NextResponse.next();
  // }

  // // User Protected Pages
  // if (protectedUserPaths.some(p => path.startsWith(p))) {
  //   if (!userAuthToken) {
  //     return NextResponse.redirect(new URL('/login', req.url));
  //   }
  //   return NextResponse.next();
  // }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};
