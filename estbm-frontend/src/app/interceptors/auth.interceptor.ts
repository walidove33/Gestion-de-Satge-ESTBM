import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  
  // Skip auth for login and register endpoints
  if (req.url.includes('/login') || req.url.includes('/register')) {
    return next(req);
  }

  const token = authService.getToken();
  if (token) {
    const authReq = req.clone({
      setHeaders: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': req.headers.get('Content-Type') || 'application/json'
      }
    });
    return next(authReq);
  }

  return next(req);
};