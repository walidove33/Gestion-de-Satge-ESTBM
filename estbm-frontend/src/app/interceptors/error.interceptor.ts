import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  

  return next(req).pipe(
    catchError((error) => {
      if (error.status === 401) {
        alert('Session expirée. Veuillez vous reconnecter.');
        authService.logout();
        router.navigate(['/login']);
        
      }
      return throwError(() => error);
    })
  );
};
