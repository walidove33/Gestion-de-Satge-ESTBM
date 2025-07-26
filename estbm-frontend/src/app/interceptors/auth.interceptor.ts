

// import { inject } from '@angular/core';
// import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
// import { Observable } from 'rxjs';

// export const authInterceptor: HttpInterceptorFn = (
//   req: HttpRequest<any>, 
//   next: HttpHandlerFn
// ): Observable<HttpEvent<any>> => {
//   const token = localStorage.getItem('token');
  
//   console.log('🔍 Interceptor - URL:', req.url);
//   console.log('🔍 Interceptor - Token exists:', !!token);
  
//   // Skip auth for login and register endpoints
//   if (req.url.includes('/auth/login') || req.url.includes('/auth/register')) {
//     console.log('🚫 Skipping auth for:', req.url);
//     return next(req);
//   }

//   if (token) {
//     const authReq = req.clone({
//       headers: req.headers.set('Authorization', `Bearer ${token}`)
//     });
//     console.log('✅ Adding Authorization header');
//     console.log('📄 Headers:', authReq.headers.get('Authorization'));
//     return next(authReq);
//   }

//   console.log('❌ No token found, proceeding without auth');
//   return next(req);
// };


import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  
  // Ne pas ajouter le token pour les routes d'authentification
  if (req.url.includes('/auth/login') || req.url.includes('/auth/register')) {
    return next(req);
  }

  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(cloned);
  }
  
  return next(req);
};