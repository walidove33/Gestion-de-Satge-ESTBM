  import { Injectable } from "@angular/core"
  import  { HttpClient } from "@angular/common/http"
  import {  Observable, BehaviorSubject, throwError } from "rxjs"
  import { tap, catchError } from "rxjs/operators"
  import  { AuthResponse, LoginRequest, RegisterRequest } from "../models/auth.model"
  import  { User } from "../models/user.model"

  @Injectable({ providedIn: "root" })
  export class AuthService {
    private baseUrl = "http://localhost:8081/stages/auth"
    private currentUserSubject = new BehaviorSubject<User | null>(null)
    public currentUser$ = this.currentUserSubject.asObservable()

    constructor(private http: HttpClient) {
      this.loadUserFromStorage()
    }

    login(data: LoginRequest): Observable<AuthResponse> {
      console.log("🔐 Attempting login for:", data.email)
      return this.http.post<AuthResponse>(`${this.baseUrl}/login`, data).pipe(
        tap((res) => {
          console.log("✅ Login successful:", res)
          localStorage.setItem("token", res.token)
          if (res.refreshToken) {
            localStorage.setItem("refreshToken", res.refreshToken)
          }
          localStorage.setItem("role", res.role as string)
          const user = res.user as User
          localStorage.setItem("user", JSON.stringify(user))
          this.currentUserSubject.next(user)
          console.log("💾 User data saved to localStorage")
        }),
        catchError((err) => {
          console.error("❌ Login failed:", err)
          return throwError(() => err)
        }),
      )
    }

    register(data: RegisterRequest): Observable<any> {
      return this.http.post(`${this.baseUrl}/register`, data).pipe(catchError((err) => throwError(() => err)))
    }

    logout(): void {
      console.log("🚪 Logging out user")
      localStorage.clear()
      this.currentUserSubject.next(null)
    }

    // isAuthenticated(): boolean {
    //   const token = this.getToken()
    //   if (!token) {
    //     console.log("❌ No token found")
    //     return false
    //   }

    //   try {
    //     const decoded = this.decodeToken(token)
    //     const isValid = decoded.exp > Date.now() / 1000
    //     console.log("🕐 Token valid:", isValid, "Expires:", new Date(decoded.exp * 1000))
    //     if (!isValid) {
    //       console.log("🕐 Token expired, clearing localStorage")
    //       localStorage.clear()
    //       this.currentUserSubject.next(null)
    //     }
    //     return isValid
    //   } catch (error) {
    //     console.error("❌ Token decode error:", error)
    //     localStorage.clear()
    //     this.currentUserSubject.next(null)
    //     return false
    //   }
    // }


    isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decoded = this.decodeToken(token);
      const now = Date.now() / 1000;
      return decoded.exp > now; // Vérifie si le token est expiré
    } catch {
      return false;
    }
  }

  refreshToken(): Observable<AuthResponse> {
    const refreshToken = localStorage.getItem('refreshToken');
    return this.http.post<AuthResponse>(`${this.baseUrl}/refresh`, { refreshToken });
  }

    getUserRole(): "ETUDIANT" | "ENCADRANT" | "ADMIN" | null {
      try {
        const token = this.getToken()
        if (!token) return null
        const decoded = this.decodeToken(token)
        const role = decoded.role || decoded.authorities?.[0]?.replace("ROLE_", "") || null
        console.log("👤 User role from token:", role)
        return role
      } catch {
        const fallbackRole = localStorage.getItem("role") as "ETUDIANT" | "ENCADRANT" | "ADMIN" | null
        console.log("👤 User role from fallback:", fallbackRole)
        return fallbackRole
      }
    }

    getUserId(): number | null {
      const user = this.getCurrentUser();
    return user ? user.id : null;
    }

    getUserEmail(): string | null {
      const user = this.getCurrentUser();
    return user ? user.email : null;
    }

    getToken(): string | null {
      const token = localStorage.getItem("token")
      console.log("🎫 Retrieved token:", token ? "Present" : "Not found")
      return token
    }

    getCurrentUser(): User | null {
      return this.currentUserSubject.value
    }

    fetchProfile(): Observable<User> {
      return this.http.get<User>(`${this.baseUrl}/me`).pipe(
        tap((u) => {
          this.currentUserSubject.next(u)
          localStorage.setItem("user", JSON.stringify(u))
        }),
        catchError((err) => throwError(() => err)),
      )
    }

    private loadUserFromStorage(): void {
      const stored = localStorage.getItem("user")
      if (stored) {
        try {
          const user = JSON.parse(stored)
          this.currentUserSubject.next(user)
          console.log("👤 Loaded user from storage:", user)
        } catch (error) {
          console.error("❌ Error parsing stored user:", error)
          localStorage.removeItem("user")
        }
      }
    }

    private decodeToken(token: string): any {
      try {
        const payload = token.split(".")[1]
        const decoded = JSON.parse(atob(payload))
        console.log("🔍 Decoded token:", decoded)
        return decoded
      } catch (error) {
        console.error("❌ Error decoding token:", error)
        throw error
      }
    }



  }

