// import { Injectable } from "@angular/core"
// import {  HttpClient, HttpParams } from "@angular/common/http"
// import {  Observable, throwError } from "rxjs"
// import { catchError } from "rxjs/operators"
// import  { Stage, StageRequest, Rapport, AssignmentRequest, StudentAssignment } from "../models/stage.model"
// import  { AuthService } from "./auth.service"

// @Injectable({
//   providedIn: "root",
// })
// export class StageService {
//   private baseUrl = "http://localhost:8081/stages/stages"
//   private adminUrl = "http://localhost:8081/stages/admin"
//   private encadrantUrl = "http://localhost:8081/stages/encadrants"; // Ajouter cette ligne


//   constructor(
//     private http: HttpClient,
//     private authService: AuthService,
//   ) {}

//   // ==================== STUDENT METHODS ====================

//   getMyStages(): Observable<Stage[]> {
//     const userEmail = this.authService.getUserEmail()
//     if (!userEmail) {
//       return throwError(() => new Error("User not authenticated"))
//     }

//     console.log("📋 Fetching stages for user email:", userEmail)

//     // Utiliser l'endpoint qui récupère les stages par email d'étudiant
//     return this.http.get<Stage[]>(`${this.baseUrl}/etudiant/mes-stages`).pipe(catchError(this.handleError))
//   }

//   createDemande(data: StageRequest): Observable<Stage> {
//     console.log("📝 Creating stage request:", data)
//     return this.http.post<Stage>(`${this.baseUrl}/demande`, data).pipe(catchError(this.handleError))
//   }

//   getMyStageStatus(): Observable<string> {
//     return this.http.get<string>(`${this.baseUrl}/etat/mes-demandes`).pipe(catchError(this.handleError))
//   }

//   submitRapport(stageId: number, rapport: File): Observable<any> {
//     const formData = new FormData()
//     formData.append("rapport", rapport)

//     const params = new HttpParams().set("idStage", stageId.toString())

//     return this.http.post(`${this.baseUrl}/rapport`, formData, { params }).pipe(catchError(this.handleError))
//   }

//   downloadConvention(stageId: number): Observable<Blob> {
//     const params = new HttpParams().set("idStage", stageId.toString())
//     return this.http
//       .get(`${this.baseUrl}/convention`, {
//         params,
//         responseType: "blob",
//       })
//       .pipe(catchError(this.handleError))
//   }

//   downloadAssurance(stageId: number): Observable<Blob> {
//     return this.http
//       .get(`${this.baseUrl}/${stageId}/documents`, {
//         responseType: "blob",
//       })
//       .pipe(catchError(this.handleError))
//   }

//   // ==================== ENCADRANT METHODS ====================
// getMyAssignedStages(): Observable<Stage[]> {
//   return this.http.get<Stage[]>(`${this.encadrantUrl}/me/stages`); // Utiliser la nouvelle URL
// }

//   approveStage(stageId: number, note?: string): Observable<any> {
//     const userId = this.getCurrentUserId()
//     if (!userId) {
//       return throwError(() => new Error("User not authenticated"))
//     }

//     const params = new HttpParams().set("commentaire", note || "")
//     return this.http
//       .put(`/stages/encadrants/${userId}/stage/${stageId}/valider`, {}, { params })
//       .pipe(catchError(this.handleError))
//   }

//   rejectStage(stageId: number, note: string): Observable<any> {
//     const userId = this.getCurrentUserId()
//     if (!userId) {
//       return throwError(() => new Error("User not authenticated"))
//     }

//     return this.http
//       .put(
//         `/stages/encadrants/${userId}/stage/${stageId}/refuser`,
//         {},
//         {
//           params: new HttpParams().set("commentaire", note),
//         },
//       )
//       .pipe(catchError(this.handleError))
//   }

//   addNote(stageId: number, note: string): Observable<any> {
//     const userId = this.getCurrentUserId()
//     if (!userId) {
//       return throwError(() => new Error("User not authenticated"))
//     }

//     return this.http
//       .put(
//         `/stages/encadrants/${userId}/stage/${stageId}/note`,
//         {},
//         {
//           params: new HttpParams().set("commentaire", note),
//         },
//       )
//       .pipe(catchError(this.handleError))
//   }

//   getRapportsForEncadrant(): Observable<Rapport[]> {
//   return this.http.get<Rapport[]>(`${this.encadrantUrl}/me/rapports`); // Utiliser la nouvelle URL
// }

//   validateRapport(rapportId: number, commentaire?: string): Observable<Rapport> {
//     return this.http
//       .put<Rapport>(`/stages/encadrants/rapports/${rapportId}/validate`, {
//         commentaire: commentaire || "",
//       })
//       .pipe(catchError(this.handleError))
//   }

//   rejectRapport(rapportId: number, commentaire: string): Observable<Rapport> {
//     return this.http
//       .put<Rapport>(`/stages/encadrants/rapports/${rapportId}/reject`, {
//         commentaire,
//       })
//       .pipe(catchError(this.handleError))
//   }

//   downloadRapport(rapportId: number): Observable<Blob> {
//     return this.http
//       .get(`/stages/encadrants/rapports/${rapportId}/download`, {
//         responseType: "blob",
//       })
//       .pipe(catchError(this.handleError))
//   }

//   // ==================== ADMIN METHODS ====================
//   getAllStages(): Observable<Stage[]> {
//     return this.http.get<Stage[]>(`${this.adminUrl}/stages`).pipe(catchError(this.handleError))
//   }

//   getStageStats(): Observable<any> {
//   return this.http.get<any>(`${this.adminUrl}/statistiques`); // Ajouter le slash manquant
// }

//  assignEncadrant(dto: AssignmentRequest): Observable<AssignmentRequest> {
//   return this.http.post<AssignmentRequest>(
//     `${this.adminUrl}/assigner-encadrant`, 
//     dto
//   ).pipe(catchError(this.handleError));
// }

// getAssignments(): Observable<AssignmentRequest[]> {
//   return this.http.get<AssignmentRequest[]>(`${this.adminUrl}/assignments`)
//     .pipe(catchError(this.handleError));
// }

//   removeAssignment(assignmentId: number): Observable<void> {
//     return this.http.delete<void>(`${this.adminUrl}/assignments/${assignmentId}`).pipe(catchError(this.handleError))
//   }

//   uploadStageDocuments(stageId: number, assurance: File, convention: File): Observable<any> {
//     const formData = new FormData()
//     formData.append("files", assurance)
//     formData.append("files", convention)
//     formData.append("types", "ASSURANCE")
//     formData.append("types", "CONVENTION")

//     return this.http.put(`${this.adminUrl}/${stageId}/documents`, formData).pipe(catchError(this.handleError))
//   }

//   // ==================== UTILITY METHODS ====================
//   private getCurrentUserId(): number | null {
//     return this.authService.getUserId()
//   }

//   private handleError = (error: any): Observable<never> => {
//     console.error("🚨 StageService error:", error)
//     let errorMessage = "Une erreur est survenue"

//     if (error.status === 401) {
//       errorMessage = "Session expirée. Veuillez vous reconnecter."
//     } else if (error.status === 403) {
//       errorMessage = "Accès refusé."
//     } else if (error.status === 404) {
//       errorMessage = "Ressource non trouvée."
//     } else if (error.status === 0) {
//       errorMessage = "Impossible de se connecter au serveur."
//     } else if (error.error?.message) {
//       errorMessage = error.error.message
//     }

//     return throwError(() => new Error(errorMessage))
//   }


 

  
 
//   // Admin Methods
 

  
  

  


  
// }


import { Injectable } from "@angular/core"
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http"
import { Observable, throwError } from "rxjs"
import { catchError } from "rxjs/operators"
import { Stage, StageRequest, Rapport, AssignmentRequest } from "../models/stage.model"
import { AuthService } from "./auth.service"
import {environment} from "../environement"
import { DecisionDto } from '../models/stage.model';
import { of } from 'rxjs'; // Ajouter cette importation


@Injectable({
  providedIn: "root",
})
export class StageService {
  // private baseUrl = "http://localhost:8081/stages/stages"
  private baseUrl = `${environment.apiUrl}/stages/stages`; // Utilisez environment.apiUrl
  private adminUrl = "http://localhost:8081/stages/admin"
private encadrantUrl = `${environment.apiUrl}/stages/encadrants`;
  private etudUrl = "http://localhost:8081/stages/etudiants"
  private rapportUrl = "http://localhost:8081/stages/rapports";



  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {}

  // ==================== STUDENT METHODS ====================

  getMyStages(): Observable<Stage[]> {
    const userEmail = this.authService.getUserEmail()
    if (!userEmail) {
      return throwError(() => new Error("User not authenticated"))
    }

    console.log("📋 Fetching stages for user email:", userEmail)
    return this.http.get<Stage[]>(`${this.etudUrl}/mes-stages`).pipe(catchError(this.handleError))
  }

  // createDemande(data: StageRequest): Observable<Stage> {
  //   console.log("📝 Creating stage request:", data)
  //   return this.http.post<Stage>(`${this.etudUrl}/demande`, data).pipe(catchError(this.handleError))
  // }


  createDemande(data: StageRequest): Observable<Stage> {
  const token = this.authService.getToken();
  return this.http.post<Stage>(
    `${environment.apiUrl}/stages/etudiants/demande`,
    data,
    { headers: new HttpHeaders().set('Authorization', `Bearer ${token}`) }
  ).pipe(catchError(this.handleError));
}

  getMyStageStatus(): Observable<string> {
    return this.http.get<string>(`${this.baseUrl}/etat/mes-demandes`).pipe(catchError(this.handleError))
  }

//   submitRapport(stageId: number, rapport: File): Observable<string> {
//   const formData = new FormData();
//   formData.append("file", rapport);
//   return this.http
//     .post<string>(`${this.rapportUrl}/${stageId}`, formData)
//     .pipe(catchError(this.handleError));
// }

submitRapport(stageId: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    const token = this.authService.getToken(); // Utilisez le service d'authentification
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post(`${this.rapportUrl}/${stageId}`, formData, { headers });
  }

  getRapportUrl(stageId: number): Observable<string> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get(`${this.encadrantUrl}/${stageId}/url`, { 
      headers, 
      responseType: 'text' 
    });
  }



  downloadConvention(stageId: number): Observable<Blob> {
    const params = new HttpParams().set("idStage", stageId.toString())
    return this.http
      .get(`${this.baseUrl}/convention`, {
        params,
        responseType: "blob",
      })
      .pipe(catchError(this.handleError))
  }

  downloadAssurance(stageId: number): Observable<Blob> {
    return this.http
      .get(`${this.baseUrl}/${stageId}/documents`, {
        responseType: "blob",
      })
      .pipe(catchError(this.handleError))
  }

  // ==================== ENCADRANT METHODS ====================
  getMyAssignedStages(): Observable<Stage[]> {
    return this.http.get<Stage[]>(`${this.encadrantUrl}/me/stages`).pipe(catchError(this.handleError))
  }

  // approveStage(stageId: number, note?: string): Observable<any> {
  //   const userId = this.getCurrentUserId()
  //   if (!userId) {
  //     return throwError(() => new Error("User not authenticated"))
  //   }

  //   const params = new HttpParams().set("commentaire", note || "")
  //   return this.http
  //     .put(`${this.encadrantUrl}/${userId}/stage/${stageId}/valider`, {}, { params })
  //     .pipe(catchError(this.handleError))
  // }




//   approveDecision(dto: { idStage: number; approuver: boolean; }): Observable<string> {
//   return this.http
//     .post<string>(`${this.encadrantUrl}/decision`, dto)
//     .pipe(catchError(this.handleError));
// }

// approveDecision(dto: DecisionDto): Observable<string> {
//   return this.http
//     .post<string>(`${this.encadrantUrl}/decision`, dto)  // + interceptor injecte le Bearer
//     .pipe(catchError(this.handleError));
// }

// stage.service.ts




// approveDecision(dto: DecisionDto): Observable<string> {
//   return this.http.post(
//     `${this.encadrantUrl}/decision`, 
//     dto,
//     { responseType: 'text' } // Spécifiez le type de réponse
//   ).pipe(catchError(this.handleError));
// }

// rejectStage(stageId: number, commentaire: string): Observable<string> {
//   const userId = this.authService.getUserId();
//   if (!userId) {
//     return throwError(() => new Error("User not authenticated"));
//   }
  
//   const params = new HttpParams().set("commentaire", commentaire);
  
//   return this.http.put(
//     `${this.encadrantUrl}/${userId}/stage/${stageId}/refuser`, 
//     {}, 
//     { 
//       params,
//       responseType: 'text' // Spécifiez le type de réponse
//     }
//   ).pipe(catchError(this.handleError));
// }



approveDecision(dto: DecisionDto): Observable<string> {
  return this.http.post(
    `${this.encadrantUrl}/decision`, 
    dto,
    { 
      responseType: 'text',
      headers: new HttpHeaders().set('Content-Type', 'text/plain') // Spécifier explicitement
    }
  ).pipe(catchError(this.handleError));
}

rejectStage(stageId: number, commentaire: string): Observable<string> {
  const userId = this.authService.getUserId();
  if (!userId) return throwError(() => new Error("User not authenticated"));
  
  return this.http.put(
    `${this.encadrantUrl}/${userId}/stage/${stageId}/refuser`, 
    { commentaire }, // Envoyer dans le body plutôt que params
    { 
      responseType: 'text',
      headers: new HttpHeaders().set('Content-Type', 'text/plain')
    }
  ).pipe(catchError(this.handleError));
}

//  rejectStage(stageId: number, commentaire: string): Observable<string> {
//   const userId = this.authService.getUserId();
//   if (!userId) {
//     return throwError(() => new Error("User not authenticated"));
//   }
//   const params = new HttpParams().set("commentaire", commentaire);
//   return this.http
//     .put<string>(`${this.encadrantUrl}/${userId}/stage/${stageId}/refuser`, {}, { params })
//     .pipe(catchError(this.handleError));
// }

  addNote(stageId: number, note: string): Observable<any> {
    const userId = this.getCurrentUserId()
    if (!userId) {
      return throwError(() => new Error("User not authenticated"))
    }

    return this.http
      .put(
        `${this.encadrantUrl}/${userId}/stage/${stageId}/note`,
        {},
        {
          params: new HttpParams().set("commentaire", note),
        },
      )
      .pipe(catchError(this.handleError))
  }

  getRapportsForEncadrant(): Observable<Rapport[]> {
    return this.http
      .get<Rapport[]>(`${this.encadrantUrl}/me/rapports`)
      .pipe(catchError(this.handleError));
  }


  /** Liste les rapports (métadonnées) pour un stage */
getRapportsByStage(stageId: number): Observable<Rapport[]> {
  return this.http
    .get<Rapport[]>(`${this.rapportUrl}/stage/${stageId}`)
    .pipe(catchError(this.handleError));
}


// downloadReport(rapport: Rapport): void {
//   if (rapport.cloudinaryUrl) {
//     // Ajoutez un paramètre aléatoire pour contourner le cache
//     const url = rapport.cloudinaryUrl + '?' + new Date().getTime();
//     window.open(url, '_blank');
//   } 
// }


// downloadRapport(stageId: number): Observable<Blob> {
//   return this.http.get(`${this.rapportUrl}/${stageId}/download`, {
//     responseType: 'blob'
//   });
// }


downloadRapport(stageId: number): Observable<Blob> {
  return this.http.get(
    `${this.rapportUrl}/${stageId}/download`,
    { 
      responseType: 'blob',
      withCredentials: true // Important pour les cookies de session
    }
  );
}
//  downloadReport(rapportId: number): Observable<Blob> {
//     return this.http
//       .get(`${this.rapportUrl}/${rapportId}/download`, { responseType: "blob" })
//       .pipe(catchError(this.handleError));
//   }


  validateRapport(rapportId: number, commentaire?: string): Observable<Rapport> {
    return this.http
      .put<Rapport>(`${this.encadrantUrl}/rapports/${rapportId}/validate`, {
        commentaire: commentaire || "",
      })
      .pipe(catchError(this.handleError))
  }

  rejectRapport(rapportId: number, commentaire: string): Observable<Rapport> {
    return this.http
      .put<Rapport>(`${this.encadrantUrl}/rapports/${rapportId}/reject`, {
        commentaire,
      })
      .pipe(catchError(this.handleError))
  }

  // downloadRapport(rapportId: number): Observable<Blob> {
  //   return this.http
  //     .get(`${this.encadrantUrl}/rapports/${rapportId}/download`, {
  //       responseType: "blob",
  //     })
  //     .pipe(catchError(this.handleError))
  // }

  // ==================== ADMIN METHODS ====================



  
  getAllStages(): Observable<Stage[]> {
    return this.http.get<Stage[]>(`${this.adminUrl}/stages`).pipe(catchError(this.handleError))
  }

  getStageStats(): Observable<any> {
    return this.http.get<any>(`${this.adminUrl}/statistiques`).pipe(catchError(this.handleError))
  }

  assignEncadrant(dto: AssignmentRequest): Observable<any> {
    return this.http.post<any>(
      `${this.adminUrl}/assigner-encadrant`, 
      dto
    ).pipe(catchError(this.handleError));
  }

 getAssignments(): Observable<any[]> {
  return this.http.get<any[]>(`${this.adminUrl}/assignments`)
    .pipe(catchError((): Observable<any[]> => {
      return new Observable(observer => {
        observer.next([]);
        observer.complete();
      });
    }));
}


  removeAssignment(assignmentId: number): Observable<void> {
    return this.http.delete<void>(`${this.adminUrl}/assignments/${assignmentId}`)
      .pipe(catchError(this.handleError))
  }

  uploadStageDocuments(stageId: number, assurance: File, convention: File): Observable<any> {
    const formData = new FormData()
    formData.append("files", assurance)
    formData.append("files", convention)
    formData.append("types", "ASSURANCE")
    formData.append("types", "CONVENTION")

    return this.http.put(`${this.adminUrl}/${stageId}/documents`, formData).pipe(catchError(this.handleError))
  }

  // ==================== UTILITY METHODS ====================
  private getCurrentUserId(): number | null {
    return this.authService.getUserId()
  }

  private handleError = (error: any): Observable<never> => {
    console.error("🚨 StageService error:", error)
    let errorMessage = "Une erreur est survenue"

    if (error.status === 401) {
      errorMessage = "Session expirée. Veuillez vous reconnecter."
    } else if (error.status === 403) {
      errorMessage = "Accès refusé."
    } else if (error.status === 404) {
      errorMessage = "Ressource non trouvée."
    } else if (error.status === 0) {
      errorMessage = "Impossible de se connecter au serveur."
    } else if (error.error?.message) {
      errorMessage = error.error.message
    }

    return throwError(() => new Error(errorMessage))
  }

  getMesDemandes(): Observable<Stage[]> {
    return this.http
      .get<Stage[]>(`${this.encadrantUrl}/me/demandes`)
      .pipe(catchError(this.handleError));
  }

  // stage.service.ts

// Ajouter une méthode pour récupérer le rapport existant
getExistingRapport(stageId: number): Observable<Rapport | null> {
  const token = this.authService.getToken();
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });

  // Correction de l'URL pour pointer vers le bon endpoint
  return this.http.get<Rapport | null>(
    `${environment.apiUrl}/stages/etudiants/rapport/${stageId}`,
    { headers }
  ).pipe(
    catchError(() => of(null)) // Retourne null si erreur
  );
}



// Implémenter la pagination
getPaginatedStages(page: number, size: number): Observable<any> {
    const params = new HttpParams()
        .set('page', page.toString())
        .set('size', size.toString());
        
    return this.http.get<any>(`${this.adminUrl}/stages`, { params });
}
}