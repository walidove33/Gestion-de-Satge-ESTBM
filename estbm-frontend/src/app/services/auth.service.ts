import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthResponse, LoginRequest, RegisterRequest } from '../models/auth.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8081/stages/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadCurrentUser();
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, credentials)
      .pipe(
        tap(response => {
          localStorage.setItem('token', response.token);
          localStorage.setItem('role', response.role);
          this.loadCurrentUser();
        })
      );
  }

  register(userData: RegisterRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, userData);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getUserRole(): string | null {
    return localStorage.getItem('role');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  private loadCurrentUser(): void {
    const token = this.getToken();
    const role = this.getUserRole();
    
    if (token && role) {
      // In a real app, you'd decode the JWT or make an API call
      // For now, we'll create a mock user based on the stored role
      const mockUser: User = {
        id: 1,
        email: 'user@example.com',
        nom: 'Utilisateur',
        prenom: 'Test',
        role: role as any
      };
      this.currentUserSubject.next(mockUser);
    }
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getUserId(): number | null {
  const token = this.getToken();
  if (!token) return null;

  const payload = JSON.parse(atob(token.split('.')[1]));
  return payload.id || payload.userId || null; // selon comment le backend encode le JWT
}

}

// import { Injectable } from "@angular/core"
// import  { HttpClient } from "@angular/common/http"
// import { type Observable, BehaviorSubject } from "rxjs"
// import { tap } from "rxjs/operators"
// import type { AuthResponse, LoginRequest, RegisterRequest } from "../models/auth.model"
// import type { User } from "../models/user.model"

// @Injectable({
//   providedIn: "root",
// })
// export class AuthService {
//   private baseUrl = "http://localhost:8081/stages/auth"
//   private currentUserSubject = new BehaviorSubject<User | null>(null)
//   public currentUser$ = this.currentUserSubject.asObservable()

//   constructor(private http: HttpClient) {
//     this.loadCurrentUser()
//   }

//   login(credentials: LoginRequest): Observable<AuthResponse> {
//     return this.http.post<AuthResponse>(`${this.baseUrl}/login`, credentials).pipe(
//       tap((response) => {
//         localStorage.setItem("token", response.token)
//         localStorage.setItem("role", response.role)
//         this.loadCurrentUser()
//       }),
//     )
//   }

//   register(userData: RegisterRequest): Observable<any> {
//     return this.http.post(`${this.baseUrl}/register`, userData)
//   }

//   logout(): void {
//     localStorage.removeItem("token")
//     localStorage.removeItem("role")
//     localStorage.removeItem("user")
//     this.currentUserSubject.next(null)
//   }

//   isAuthenticated(): boolean {
//     const token = this.getToken()
//     if (!token) return false

//     try {
//       const payload = this.decodeToken(token)
//       return payload.exp > Date.now() / 1000
//     } catch {
//       return false
//     }
//   }

//   getUserRole(): string | null {
//     const token = this.getToken()
//     if (!token) return null

//     try {
//       const payload = this.decodeToken(token)
//       return payload.role || payload.authorities?.[0] || null
//     } catch {
//       return null
//     }
//   }

//   getToken(): string | null {
//     return localStorage.getItem("token")
//   }

//   getUserId(): number | null {
//     const token = this.getToken()
//     if (!token) return null

//     try {
//       const payload = this.decodeToken(token)
//       return payload.userId || payload.id || payload.sub || null
//     } catch {
//       return null
//     }
//   }

//   getCurrentUser(): User | null {
//     return this.currentUserSubject.value
//   }

//   private decodeToken(token: string): any {
//     const payload = token.split(".")[1]
//     return JSON.parse(atob(payload))
//   }

//   private loadCurrentUser(): void {
//     const token = this.getToken()

//     if (token && this.isAuthenticated()) {
//       try {
//         const payload = this.decodeToken(token)
//         const user: User = {
//           id: payload.userId || payload.id || payload.sub,
//           email: payload.email || payload.username,
//           nom: payload.nom || "Utilisateur",
//           prenom: payload.prenom || "Test",
//           role: payload.role || payload.authorities?.[0] || "ETUDIANT",
//           telephone: payload.telephone,
//           codeApogee: payload.codeApogee,
//           codeMassar: payload.codeMassar,
//           dateNaissance: payload.dateNaissance,
//           specialite: payload.specialite,
//         }

//         this.currentUserSubject.next(user)
//         localStorage.setItem("user", JSON.stringify(user))
//       } catch (error) {
//         console.error("Erreur lors du décodage du token:", error)
//         this.logout()
//       }
//     } else {
//       const savedUser = localStorage.getItem("user")
//       if (savedUser) {
//         try {
//           this.currentUserSubject.next(JSON.parse(savedUser))
//         } catch {
//           this.logout()
//         }
//       }
//     }
//   }

//   refreshUserData(): Observable<User> {
//     return this.http.get<User>(`${this.baseUrl}/me`).pipe(
//       tap((user) => {
//         this.currentUserSubject.next(user)
//         localStorage.setItem("user", JSON.stringify(user))
//       }),
//     )
//   }
// }
