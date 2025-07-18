// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable, BehaviorSubject } from 'rxjs';
// import { tap, catchError } from 'rxjs/operators';
// import { AuthResponse, LoginRequest, RegisterRequest } from '../models/auth.model';
// import { User } from '../models/user.model';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {
//   private baseUrl = 'http://localhost:8081/stages/auth';
//   private currentUserSubject = new BehaviorSubject<User | null>(null);
//   public currentUser$ = this.currentUserSubject.asObservable();

//   constructor(private http: HttpClient) {
//     this.loadCurrentUser();
//   }

//   login(credentials: LoginRequest): Observable<AuthResponse> {
//     return this.http.post<AuthResponse>(`${this.baseUrl}/login`, credentials)
//       .pipe(
//         tap(response => {
//           localStorage.setItem('token', response.token);
//           localStorage.setItem('role', response.role);
//           if (response.user) {
//             localStorage.setItem('user', JSON.stringify(response.user));
//             this.currentUserSubject.next(response.user);
//           } else {
//             this.loadCurrentUser();
//           }
//         }),
//         catchError(error => {
//           console.error('Login error:', error);
//           throw error;
//         })
//       );
//   }

//   register(userData: RegisterRequest): Observable<any> {
//     return this.http.post(`${this.baseUrl}/register`, userData)
//       .pipe(
//         catchError(error => {
//           console.error('Register error:', error);
//           throw error;
//         })
//       );
//   }

//   logout(): void {
//     localStorage.removeItem('token');
//     localStorage.removeItem('role');
//     localStorage.removeItem('user');
//     this.currentUserSubject.next(null);
//   }

//   isAuthenticated(): boolean {
//     const token = this.getToken();
//     if (!token) return false;

//     try {
//       const payload = this.decodeToken(token);
//       return payload.exp > Date.now() / 1000;
//     } catch {
//       return false;
//     }
//   }

//   getUserRole(): string | null {
//     const token = this.getToken();
//     if (!token) return localStorage.getItem('role');

//     try {
//       const payload = this.decodeToken(token);
//       return payload.role || payload.authorities?.[0] || localStorage.getItem('role');
//     } catch {
//       return localStorage.getItem('role');
//     }
//   }

//   getToken(): string | null {
//     return localStorage.getItem('token');
//   }

//   getUserId(): number | null {
//     const token = this.getToken();
//     if (!token) return null;

//     try {
//       const payload = this.decodeToken(token);
//       return payload.userId || payload.id || payload.sub || null;
//     } catch {
//       return null;
//     }
//   }

//   getCurrentUser(): User | null {
//     return this.currentUserSubject.value;
//   }

//   private decodeToken(token: string): any {
//     const payload = token.split('.')[1];
//     return JSON.parse(atob(payload));
//   }

//   private loadCurrentUser(): void {
//     const token = this.getToken();
//     const savedUser = localStorage.getItem('user');

//     if (savedUser) {
//       try {
//         const user = JSON.parse(savedUser);
//         this.currentUserSubject.next(user);
//         return;
//       } catch {
//         localStorage.removeItem('user');
//       }
//     }

//     if (token && this.isAuthenticated()) {
//       try {
//         const payload = this.decodeToken(token);
//         const user: User = {
//           id: payload.userId || payload.id || payload.sub || 1,
//           email: payload.email || payload.username || 'user@example.com',
//           nom: payload.nom || 'Utilisateur',
//           prenom: payload.prenom || 'Test',
//           role: payload.role || payload.authorities?.[0] || this.getUserRole() || 'ETUDIANT',
//           telephone: payload.telephone,
//           codeApogee: payload.codeApogee,
//           codeMassar: payload.codeMassar,
//           dateNaissance: payload.dateNaissance,
//           specialite: payload.specialite,
//         };

//         this.currentUserSubject.next(user);
//         localStorage.setItem('user', JSON.stringify(user));
//       } catch (error) {
//         console.error('Error decoding token:', error);
//         this.logout();
//       }
//     }
//   }

//   refreshUserData(): Observable<User> {
//     return this.http.get<User>(`${this.baseUrl}/me`).pipe(
//       tap(user => {
//         this.currentUserSubject.next(user);
//         localStorage.setItem('user', JSON.stringify(user));
//       }),
//       catchError(error => {
//         console.error('Error refreshing user data:', error);
//         throw error;
//       })
//     );
//   }
// }


// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { AuthResponse, LoginRequest, RegisterRequest } from '../models/auth.model';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = 'http://localhost:8081/stages/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  login(data: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, data).pipe(
      tap(res => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('role', res.role as string);
        const user = res.user as User;
        this.currentUserSubject.next(user);
        localStorage.setItem('user', JSON.stringify(user));
      }),
      catchError(err => throwError(() => err))
    );
  }

  register(data: RegisterRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, data).pipe(
      catchError(err => throwError(() => err))
    );
  }

  logout(): void {
    localStorage.clear();
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    try {
      const { exp } = this.decodeToken(token);
      return exp > Date.now() / 1000;
    } catch {
      return false;
    }
  }

  getUserRole(): 'ETUDIANT' | 'ENCADRANT' | 'ADMIN' | null {
  try {
    const token = this.getToken();
    if (!token) return null;
    const { role } = this.decodeToken(token);
    return role;
  } catch {
    const fallbackRole = localStorage.getItem('role') as 'ETUDIANT' | 'ENCADRANT' | 'ADMIN' | null;
    return fallbackRole;
  }
}


  /** ← NOUVELLE MÉTHODE */
  getUserId(): number | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const { userId, sub, id } = this.decodeToken(token);
      return userId ?? id ?? sub ?? null;
    } catch {
      return null;
    }
  }

  getToken(): string | null {
  return localStorage.getItem('token');
}


  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  fetchProfile(): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/me`).pipe(
      tap(u => {
        this.currentUserSubject.next(u);
        localStorage.setItem('user', JSON.stringify(u));
      }),
      catchError(err => throwError(() => err))
    );
  }

  private loadUserFromStorage(): void {
    const stored = localStorage.getItem('user');
    if (stored) {
      this.currentUserSubject.next(JSON.parse(stored));
    }
  }

  private decodeToken(token: string): any {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  }
}
