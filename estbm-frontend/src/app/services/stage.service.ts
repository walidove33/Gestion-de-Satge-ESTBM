import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Stage, StageRequest, Rapport, AssignmentRequest, StudentAssignment } from '../models/stage.model';

@Injectable({
  providedIn: 'root'
})
export class StageService {
  private baseUrl = 'http://localhost:8081/stages/stages';

  constructor(private http: HttpClient) {}

  // ==================== STUDENT METHODS ====================
  getMyStages(): Observable<Stage[]> {
    return this.http.get<Stage[]>(`${this.baseUrl}/student/my-stages`);
  }

  createDemande(stageData: StageRequest, assurance?: File, convention?: File): Observable<Stage> {
    const formData = new FormData();
    formData.append('stageData', new Blob([JSON.stringify(stageData)], { type: 'application/json' }));

    if (assurance) {
      formData.append('assurance', assurance);
    }
    if (convention) {
      formData.append('convention', convention);
    }

    return this.http.post<Stage>(`${this.baseUrl}/student/demande`, formData);
  }

  submitRapport(stageId: number, rapport: File): Observable<Rapport> {
    const formData = new FormData();
    formData.append('rapport', rapport);
    formData.append('stageId', stageId.toString());
    return this.http.post<Rapport>(`${this.baseUrl}/student/${stageId}/rapport`, formData);
  }

  downloadConvention(stageId: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/student/${stageId}/convention`, { 
      responseType: 'blob' 
    });
  }

  downloadAssurance(stageId: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/student/${stageId}/assurance`, { 
      responseType: 'blob' 
    });
  }

  // ==================== ENCADRANT METHODS ====================
  getMyAssignedStages(): Observable<Stage[]> {
    return this.http.get<Stage[]>(`${this.baseUrl}/encadrant/stages`);
  }

  approveStage(stageId: number, note?: string): Observable<Stage> {
    return this.http.put<Stage>(`${this.baseUrl}/encadrant/${stageId}/approve`, { note });
  }

  rejectStage(stageId: number, note: string): Observable<Stage> {
    return this.http.put<Stage>(`${this.baseUrl}/encadrant/${stageId}/reject`, { note });
  }

  addNote(stageId: number, note: string): Observable<Stage> {
    return this.http.put<Stage>(`${this.baseUrl}/encadrant/${stageId}/note`, { note });
  }

  getRapportsForEncadrant(): Observable<Rapport[]> {
    return this.http.get<Rapport[]>(`${this.baseUrl}/encadrant/rapports`);
  }

  validateRapport(rapportId: number, commentaire?: string): Observable<Rapport> {
    return this.http.put<Rapport>(`${this.baseUrl}/encadrant/rapports/${rapportId}/validate`, { commentaire });
  }

  rejectRapport(rapportId: number, commentaire: string): Observable<Rapport> {
    return this.http.put<Rapport>(`${this.baseUrl}/encadrant/rapports/${rapportId}/reject`, { commentaire });
  }

  downloadRapport(rapportId: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/encadrant/rapports/${rapportId}/download`, { 
      responseType: 'blob' 
    });
  }

  // ==================== ADMIN METHODS ====================
  getAllStages(): Observable<Stage[]> {
    return this.http.get<Stage[]>(`${this.baseUrl}/admin/all`);
  }

  getStageStats(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/admin/stats`);
  }

  assignEncadrant(assignment: AssignmentRequest): Observable<StudentAssignment> {
    return this.http.post<StudentAssignment>(`${this.baseUrl}/admin/assign`, assignment);
  }

  getAssignments(): Observable<StudentAssignment[]> {
    return this.http.get<StudentAssignment[]>(`${this.baseUrl}/admin/assignments`);
  }

  removeAssignment(assignmentId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/admin/assignments/${assignmentId}`);
  }

  uploadStudentDocuments(
    etudiantId: number,
    documents: { convention?: File; assurance?: File; demande?: File }
  ): Observable<any> {
    const formData = new FormData();
    if (documents.convention) formData.append('convention', documents.convention);
    if (documents.assurance) formData.append('assurance', documents.assurance);
    if (documents.demande) formData.append('demande', documents.demande);
    return this.http.post(`${this.baseUrl}/admin/students/${etudiantId}/documents`, formData);
  }

  getStatsByFiliere(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/admin/stats/filiere`);
  }

  getStatsByEncadrant(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/admin/stats/encadrant`);
  }
}