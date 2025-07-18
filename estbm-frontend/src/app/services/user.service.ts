// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { User, CreateEncadrantRequest, CreateAdminRequest } from '../models/user.model';

// @Injectable({
//   providedIn: 'root'
// })
// export class UserService {
//   private baseUrl = 'http://localhost:8081/stages/admin';

//   constructor(private http: HttpClient) {}

//   // Encadrant management
//   createEncadrant(encadrantData: CreateEncadrantRequest): Observable<User> {
//     return this.http.post<User>(`${this.baseUrl}/encadrants`, encadrantData);
//   }

//   listEncadrants(): Observable<User[]> {
//     return this.http.get<User[]>(`${this.baseUrl}/encadrants`);
//   }

//   updateEncadrant(id: number, encadrantData: Partial<CreateEncadrantRequest>): Observable<User> {
//     return this.http.put<User>(`${this.baseUrl}/encadrants/${id}`, encadrantData);
//   }

//   deleteEncadrant(id: number): Observable<void> {
//     return this.http.delete<void>(`${this.baseUrl}/encadrants/${id}`);
//   }

//   // Admin management
//   createAdmin(adminData: CreateAdminRequest): Observable<User> {
//     return this.http.post<User>(`${this.baseUrl}/admins`, adminData);
//   }

//   listAdmins(): Observable<User[]> {
//     return this.http.get<User[]>(`${this.baseUrl}/admins`);
//   }

//   updateAdmin(id: number, adminData: Partial<CreateAdminRequest>): Observable<User> {
//     return this.http.put<User>(`${this.baseUrl}/admins/${id}`, adminData);
//   }

//   deleteAdmin(id: number): Observable<void> {
//     return this.http.delete<void>(`${this.baseUrl}/admins/${id}`);
//   }
// }




// src/app/services/user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User, CreateEncadrantRequest, CreateAdminRequest } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private baseUrl = 'http://localhost:8081/stages/admin';

  constructor(private http: HttpClient) {}

  // Encadrants
  createEncadrant(data: CreateEncadrantRequest): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/encadrants`, data).pipe(
      catchError(err => throwError(() => err))
    );
  }

  getEncadrants(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/encadrants`).pipe(
      catchError(err => throwError(() => err))
    );
  }

  updateEncadrant(id: number, data: Partial<CreateEncadrantRequest>): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/encadrants/${id}`, data).pipe(
      catchError(err => throwError(() => err))
    );
  }

  deleteEncadrant(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/encadrants/${id}`).pipe(
      catchError(err => throwError(() => err))
    );
  }

  // Administrateurs
  createAdmin(data: CreateAdminRequest): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/admins`, data).pipe(
      catchError(err => throwError(() => err))
    );
  }

  getAdmins(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/admins`).pipe(
      catchError(err => throwError(() => err))
    );
  }

  updateAdmin(id: number, data: Partial<CreateAdminRequest>): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/admins/${id}`, data).pipe(
      catchError(err => throwError(() => err))
    );
  }

  deleteAdmin(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/admins/${id}`).pipe(
      catchError(err => throwError(() => err))
    );
  }
}
