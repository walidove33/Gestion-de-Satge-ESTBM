import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Stage, StageRequest, Rapport, AssignmentRequest, StudentAssignment } from '../models/stage.model';

@Injectable({
  providedIn: 'root'
})
export class StageService {
  private baseUrl = 'http://localhost:8081/stages/stages';
  private adminUrl = 'http://localhost:8081/stages/admin';

  constructor(private http: HttpClient) {}

  // ==================== STUDENT METHODS ====================
  getMyStages(): Observable<Stage[]> {
    const userId = this.getCurrentUserId();
    if (!userId) {
      return throwError(() => new Error('User not authenticated'));
    }
    
    return this.http.get<Stage[]>(`${this.baseUrl}/etudiant/${userId}`)
      .pipe(catchError(this.handleError));
  }

  createDemande(stageData: StageRequest, assurance?: File, convention?: File): Observable<Stage> {
    const formData = new FormData();
    
    // Add stage data as JSON blob
    formData.append('stageData', new Blob([JSON.stringify(stageData)], { type: 'application/json' }));

    // Add files if provided
    if (assurance) {
      formData.append('assurance', assurance);
    }
    if (convention) {
      formData.append('convention', convention);
    }

    return this.http.post<Stage>(`${this.baseUrl}/demande`, formData)
      .pipe(catchError(this.handleError));
  }

  submitRapport(stageId: number, rapport: File): Observable<Rapport> {
    const formData = new FormData();
    formData.append('rapport', rapport);
    formData.append('stageId', stageId.toString());
    
    return this.http.post<Rapport>(`${this.baseUrl}/rapport`, formData)
      .pipe(catchError(this.handleError));
  }

  downloadConvention(stageId: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/convention`, { 
      params: { idStage: stageId.toString() },
      responseType: 'blob' 
    }).pipe(catchError(this.handleError));
  }

  downloadAssurance(stageId: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/${stageId}/assurance`, { 
      responseType: 'blob' 
    }).pipe(catchError(this.handleError));
  }

  // ==================== ENCADRANT METHODS ====================
  getMyAssignedStages(): Observable<Stage[]> {
    const userId = this.getCurrentUserId();
    if (!userId) {
      return throwError(() => new Error('User not authenticated'));
    }
    
    return this.http.get<Stage[]>(`${this.baseUrl}/encadrant/${userId}`)
      .pipe(catchError(this.handleError));
  }

  approveStage(stageId: number, note?: string): Observable<Stage> {
    const body = { note: note || '' };
    return this.http.put<Stage>(`${this.baseUrl}/encadrant/${stageId}/approve`, body)
      .pipe(catchError(this.handleError));
  }

  rejectStage(stageId: number, note: string): Observable<Stage> {
    const body = { note };
    return this.http.put<Stage>(`${this.baseUrl}/encadrant/${stageId}/reject`, body)
      .pipe(catchError(this.handleError));
  }

  addNote(stageId: number, note: string): Observable<Stage> {
    const body = { note };
    return this.http.put<Stage>(`${this.baseUrl}/encadrant/${stageId}/note`, body)
      .pipe(catchError(this.handleError));
  }

  getRapportsForEncadrant(): Observable<Rapport[]> {
    return this.http.get<Rapport[]>(`${this.baseUrl}/encadrant/rapports`)
      .pipe(catchError(this.handleError));
  }

  validateRapport(rapportId: number, commentaire?: string): Observable<Rapport> {
    const body = { commentaire: commentaire || '' };
    return this.http.put<Rapport>(`${this.baseUrl}/encadrant/rapports/${rapportId}/validate`, body)
      .pipe(catchError(this.handleError));
  }

  rejectRapport(rapportId: number, commentaire: string): Observable<Rapport> {
    const body = { commentaire };
    return this.http.put<Rapport>(`${this.baseUrl}/encadrant/rapports/${rapportId}/reject`, body)
      .pipe(catchError(this.handleError));
  }

  downloadRapport(rapportId: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/encadrant/rapports/${rapportId}/download`, { 
      responseType: 'blob' 
    }).pipe(catchError(this.handleError));
  }

  // ==================== ADMIN METHODS ====================
  getAllStages(): Observable<Stage[]> {
    return this.http.get<Stage[]>(`${this.adminUrl}/stages`)
      .pipe(catchError(this.handleError));
  }

  getStageStats(): Observable<any> {
    return this.http.get<any>(`${this.adminUrl}/statistiques`)
      .pipe(catchError(this.handleError));
  }

  assignEncadrant(assignment: AssignmentRequest): Observable<StudentAssignment> {
    return this.http.post<StudentAssignment>(`${this.adminUrl}/assigner-encadrant`, assignment)
      .pipe(catchError(this.handleError));
  }

  getAssignments(): Observable<StudentAssignment[]> {
    return this.http.get<StudentAssignment[]>(`${this.adminUrl}/assignments`)
      .pipe(catchError(this.handleError));
  }

  removeAssignment(assignmentId: number): Observable<void> {
    return this.http.delete<void>(`${this.adminUrl}/assignments/${assignmentId}`)
      .pipe(catchError(this.handleError));
  }

  uploadStudentDocuments(
    etudiantId: number,
    documents: { convention?: File; assurance?: File; demande?: File }
  ): Observable<any> {
    const formData = new FormData();
    if (documents.convention) formData.append('convention', documents.convention);
    if (documents.assurance) formData.append('assurance', documents.assurance);
    if (documents.demande) formData.append('demande', documents.demande);
    
    return this.http.post(`${this.adminUrl}/students/${etudiantId}/documents`, formData)
      .pipe(catchError(this.handleError));
  }

  getStatsByFiliere(): Observable<any> {
    return this.http.get<any>(`${this.adminUrl}/stats/filiere`)
      .pipe(catchError(this.handleError));
  }

  getStatsByEncadrant(): Observable<any> {
    return this.http.get<any>(`${this.adminUrl}/stats/encadrant`)
      .pipe(catchError(this.handleError));
  }

  // ==================== UTILITY METHODS ====================
  private getCurrentUserId(): number | null {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.userId || payload.id || payload.sub || null;
    } catch {
      return null;
    }
  }

  private handleError = (error: any): Observable<never> => {
    console.error('StageService error:', error);
    
    let errorMessage = 'Une erreur est survenue';
    
    if (error.status === 401) {
      errorMessage = 'Session expirée. Veuillez vous reconnecter.';
    } else if (error.status === 403) {
      errorMessage = 'Accès refusé.';
    } else if (error.status === 404) {
      errorMessage = 'Ressource non trouvée.';
    } else if (error.status === 0) {
      errorMessage = 'Impossible de se connecter au serveur.';
    } else if (error.error?.message) {
      errorMessage = error.error.message;
    }

    return throwError(() => new Error(errorMessage));
  };
}