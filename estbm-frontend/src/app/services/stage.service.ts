
import { Injectable } from "@angular/core"
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from "@angular/common/http"
import { Observable, throwError } from "rxjs"
import { Stage, StageRequest, Rapport, AssignmentRequest } from "../models/stage.model"
import { AuthService } from "./auth.service"
import {environment} from "../environement"
import { DecisionDto } from '../models/stage.model';
import { of } from 'rxjs'; // Ajouter cette importation
import { CommentaireRapport } from "../models/stage.model"
import { catchError, map, tap } from "rxjs/operators"; // Ajouter 'tap'
import { ToastService } from "./toast.service"; // Importer ToastService
import { GroupAssignmentRequest } from "../models/stage.model"
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

listDepartements(): Observable<{id: number, nom: string}[]> {
  return this.http.get<{id: number, nom: string}[]>(`${this.adminUrl}/departements`)
    .pipe(catchError(this.handleError));
}

listClassGroups(depId: number): Observable<{id: number, nom: string}[]> {
  return this.http.get<{id: number, nom: string}[]>(
    `${this.adminUrl}/departements/${depId}/class-groups`
  ).pipe(catchError(this.handleError));
}


listAnneesScolaires(): Observable<{id: number, libelle: string}[]> {
  return this.http.get<{id: number, libelle: string}[]>(
    `${this.adminUrl}/annee-scolaires`
  ).pipe(catchError(this.handleError));
}

// stage.service.ts
listAllClassGroups(): Observable<{id: number, nom: string}[]> {
  return this.http.get<{id: number, nom: string}[]>(
    `${this.adminUrl}/class-groups`
  ).pipe(catchError(this.handleError));
}


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

 approveDecision(dto: DecisionDto): Observable<{ message: string }> {
  return this.http.post<{ message: string }>(
    `${this.encadrantUrl}/decision`, 
    dto
  ).pipe(
    catchError(this.handleError)
  );
}


// approveDecision(dto: DecisionDto): Observable<string> {
//   return this.http.post(
//     `${this.encadrantUrl}/decision`, 
//     dto,
//     { 
//       responseType: 'text',
//       headers: new HttpHeaders().set('Content-Type', 'text/plain') // Spécifier explicitement
//     }
//   ).pipe(catchError(this.handleError));
// }

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



downloadRapport(stageId: number): Observable<HttpResponse<Blob>> {
  return this.http.get(
    `${this.rapportUrl}/${stageId}/download`,
    { 
      responseType: 'blob',
      withCredentials: true,
      observe: 'response' // Nécessaire pour les headers
    }
  );
}


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

 
  // ==================== ADMIN METHODS ====================



  
  getAllStages(): Observable<Stage[]> {
    return this.http.get<Stage[]>(`${this.adminUrl}/stages`).pipe(catchError(this.handleError))
  }


getStageStats(): Observable<any> {
  return this.http.get<any>(`${this.adminUrl}/statistiques`).pipe(
    map(stats => ({
      total: stats.total || 0,
      enAttente: stats.enAttente || 0,
      valides: stats.valides || 0,
      refuses: stats.refuses || 0,
      enCours: stats.enCours || 0,
      totalEtudiants: stats.totalEtudiants || 0,
      totalEncadrants: stats.totalEncadrants || 0
    })),
    catchError(this.handleError)
  );
}

  // assignEncadrant(dto: AssignmentRequest): Observable<any> {
  //   return this.http.post<any>(
  //     `${this.adminUrl}/assigner-encadrant`, 
  //     dto
  //   ).pipe(catchError(this.handleError));
  // }

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
/** Récupère tous les commentaires (filtrable par nom/prénom) */
listCommentaires(etudiantFilter?: string): Observable<CommentaireRapport[]> {
  let params = etudiantFilter
    ? new HttpParams().set('etudiant', etudiantFilter)
    : undefined;
  return this.http.get<CommentaireRapport[]>(
    `${this.encadrantUrl}/me/commentaires`,
    { params }
  ).pipe(catchError(this.handleError));
}

/** Poste un nouveau commentaire sur un rapport */
addComment(rapportId: number, texte: string): Observable<CommentaireRapport> {
  const token = this.authService.getToken();
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  });

  return this.http.post<CommentaireRapport>(
    `${this.encadrantUrl}/${rapportId}/commentaire`,
    { texte },
    { headers }
  ).pipe(catchError(this.handleError));
}

// // dans stage.service.ts
// assignEncadrantParGroupe(
//   dto: GroupAssignmentRequest
// ): Observable<{ message: string }> {
//   return this.http.post<{ message: string }>(
//     `${this.adminUrl}/assigner-encadrant-groupe`,
//     dto
//   );
// }


// assignEncadrantGroupe(
//   dto: GroupAssignmentRequest
// ): Observable<{ message: string }> {
//   return this.http.post<{ message: string }>(
//     `${this.adminUrl}/assigner-encadrant-groupe`,
//     dto
//   );
// }


assignerEncadrantGroupe(dto: GroupAssignmentRequest): Observable<{ message: string }> {
  return this.http
    .post<{ message: string }>(
      `${this.adminUrl}/assigner-encadrant-groupe`,
      dto
    )
    .pipe(
      catchError(this.handleError)   // ✅ bien avec catchError
    );
}



//  assignerEncadrantGroupe(dto: GroupAssignmentRequest): Observable<{ message: string }> {
//     const params = new HttpParams()
//       .set('encadrantId',    dto.encadrantId.toString())
//       .set('departementId',  dto.departementId.toString())
//       .set('classeGroupeId', dto.classeGroupeId.toString())
//       .set('anneeScolaireId',dto.anneeScolaireId.toString());

//     return this.http
//       .post<{ message: string }>(
//         `${this.adminUrl}/assigner-encadrant-groupe`,
//         null,
//         { params }
//       )
//       .pipe(this.handleError);
//   }



}
