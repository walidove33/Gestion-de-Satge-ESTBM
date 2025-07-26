import { Injectable } from "@angular/core"
import  { HttpClient } from "@angular/common/http"
import { type Observable, throwError } from "rxjs"
import { catchError } from "rxjs/operators"
import type { User } from "../models/user.model"
import { CreateAdminRequest } from '../models/user.model';
import { CreateEncadrantRequest } from '../models/user.model';



@Injectable({
  providedIn: "root",
})
export class UserService {
  private baseUrl = "http://localhost:8081/stages"

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/admin/users`).pipe(catchError(this.handleError))
  }

  getUsersByRole(role: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/admin/users/role/${role}`).pipe(catchError(this.handleError))
  }

  getStudents(): Observable<User[]> {
    return this.getUsersByRole("ETUDIANT")
  }

  
  getEncadrants(): Observable<User[]> {
    return this.getUsersByRole("ENCADRANT")
  }

  createUser(user: Partial<User>): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/admin/users`, user).pipe(catchError(this.handleError))
  }

  updateUser(id: number, user: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/admin/users/${id}`, user).pipe(catchError(this.handleError))
  }

   getAdmins(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/admins`);
  }

 createAdmin(admin: CreateAdminRequest): Observable<User> {
  return this.http.post<User>(`${this.baseUrl}/admins`, admin);
}


  deleteAdmin(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/admins/${id}`);
  }

createEncadrant(encadrant: CreateEncadrantRequest): Observable<any> {
  return this.http.post(`${this.baseUrl}/encadrants`, encadrant);
}

  deleteEncadrant(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/encadrants/${id}`);
  }

 

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/admin/users/${id}`).pipe(catchError(this.handleError))
  }

  private handleError = (error: any): Observable<never> => {
    console.error("🚨 UserService error:", error)
    let errorMessage = "Une erreur est survenue"

    if (error.status === 401) {
      errorMessage = "Session expirée. Veuillez vous reconnecter."
    } else if (error.status === 403) {
      errorMessage = "Accès refusé."
    } else if (error.status === 404) {
      errorMessage = "Utilisateur non trouvé."
    } else if (error.status === 0) {
      errorMessage = "Impossible de se connecter au serveur."
    } else if (error.error?.message) {
      errorMessage = error.error.message
    }

    return throwError(() => new Error(errorMessage))
  }
}
