import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { StageService } from '../../../services/stage.service';
import { ToastService } from '../../../services/toast.service';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { User } from '../../../models/user.model';
import { Stage } from '../../../models/stage.model';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    
    <div class="dashboard-layout">
      <div class="dashboard-container">
        <!-- Header -->
        <div class="dashboard-header">
          <div class="header-content">
            <div>
              <h1>Tableau de bord étudiant</h1>
              <p>Gérez vos demandes de stage et suivez votre progression</p>
            </div>
            <div class="header-date">
              {{ currentDate | date:'EEEE d MMMM yyyy':'fr' }}
            </div>
          </div>
        </div>

        <!-- Stats Cards -->
        <div class="stats-grid">
          <div class="stat-card stat-primary">
            <div class="stat-icon">
              <i class="bi bi-file-earmark-plus"></i>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ getTotalStages() }}</div>
              <div class="stat-label">Demandes totales</div>
            </div>
          </div>

          <div class="stat-card stat-warning">
            <div class="stat-icon">
              <i class="bi bi-clock-history"></i>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ getStagesByStatus('EN_ATTENTE').length }}</div>
              <div class="stat-label">En attente</div>
            </div>
          </div>

          <div class="stat-card stat-success">
            <div class="stat-icon">
              <i class="bi bi-check-circle"></i>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ getStagesByStatus('APPROUVE').length }}</div>
              <div class="stat-label">Approuvés</div>
            </div>
          </div>

          <div class="stat-card stat-info">
            <div class="stat-icon">
              <i class="bi bi-briefcase"></i>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ getStagesByStatus('EN_COURS').length }}</div>
              <div class="stat-label">En cours</div>
            </div>
          </div>
        </div>

        <!-- Main Content -->
        <div class="content-grid">
          <!-- Current Stage -->
          <div class="content-section">
            <div class="card">
              <div class="card-header">
                <h3>Stage actuel</h3>
                <button *ngIf="canRequestNewStage()" 
                        routerLink="/student/new-stage" 
                        class="btn btn-primary">
                  <i class="bi bi-plus-circle"></i>
                  Nouvelle demande
                </button>
              </div>
              <div class="card-body">
                <div *ngIf="loading" class="loading-state">
                  <div class="spinner"></div>
                  <p>Chargement...</p>
                </div>

                <div *ngIf="!loading && getCurrentStage()" class="current-stage">
                  <div class="stage-header">
                    <h4>{{ getCurrentStage()?.sujet }}</h4>
                    <span class="badge" [ngClass]="getStatusBadgeClass(getCurrentStage()?.etat)">
                      {{ getStatusText(getCurrentStage()?.etat) }}
                    </span>
                  </div>
                  <div class="stage-details">
                    <div class="detail-item">
                      <i class="bi bi-building"></i>
                      <span>{{ getCurrentStage()?.entreprise }}</span>
                    </div>
                    <div class="detail-item">
                      <i class="bi bi-calendar-range"></i>
                      <span>{{ getCurrentStage()?.dateDebut | date:'dd/MM/yyyy' }} - {{ getCurrentStage()?.dateFin | date:'dd/MM/yyyy' }}</span>
                    </div>
                  </div>
                  <div *ngIf="getCurrentStage()?.note" class="stage-note">
                    <i class="bi bi-chat-left-text"></i>
                    <span>{{ getCurrentStage()?.note }}</span>
                  </div>
                </div>

                <div *ngIf="!loading && !getCurrentStage()" class="empty-state">
                  <i class="bi bi-briefcase"></i>
                  <h4>Aucun stage en cours</h4>
                  <p>Vous n'avez pas de stage actuel. Créez une nouvelle demande pour commencer.</p>
                  <button routerLink="/student/new-stage" class="btn btn-primary">
                    <i class="bi bi-plus-circle"></i>
                    Créer une demande
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Documents -->
          <div class="content-section">
            <div class="card">
              <div class="card-header">
                <h3>Documents</h3>
              </div>
              <div class="card-body">
                <div *ngIf="getCurrentStage()" class="documents-list">
                  <div class="document-item">
                    <div class="document-info">
                      <i class="bi bi-file-earmark-pdf"></i>
                      <span>Convention de stage</span>
                    </div>
                    <button class="btn btn-sm btn-outline-primary"
                            (click)="downloadConvention(getCurrentStage()!.id)"
                            [disabled]="!canDownloadDocuments()">
                      <i class="bi bi-download"></i>
                      Télécharger
                    </button>
                  </div>

                  <div class="document-item">
                    <div class="document-info">
                      <i class="bi bi-file-earmark-pdf"></i>
                      <span>Attestation d'assurance</span>
                    </div>
                    <button class="btn btn-sm btn-outline-primary"
                            (click)="downloadAssurance(getCurrentStage()!.id)"
                            [disabled]="!canDownloadDocuments()">
                      <i class="bi bi-download"></i>
                      Télécharger
                    </button>
                  </div>
                </div>

                <div *ngIf="!getCurrentStage()" class="empty-state">
                  <i class="bi bi-file-earmark-x"></i>
                  <p>Aucun document disponible</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Submit Report -->
          <div class="content-section full-width">
            <div class="card">
              <div class="card-header">
                <h3>Soumettre un rapport</h3>
              </div>
              <div class="card-body">
                <div *ngIf="canSubmitReport()" class="submit-report">
                  <p>Votre stage est approuvé. Vous pouvez maintenant soumettre votre rapport de stage.</p>
                  <div class="file-upload-area" (click)="triggerFileInput()">
                    <input #fileInput type="file" accept=".pdf,.doc,.docx" (change)="onFileSelected($event)" hidden>
                    <i class="bi bi-cloud-upload"></i>
                    <p>Cliquez pour sélectionner votre rapport</p>
                    <small>PDF, DOC, DOCX - Max 10MB</small>
                  </div>
                  <div *ngIf="selectedFile" class="selected-file">
                    <i class="bi bi-file-earmark-check"></i>
                    <span>{{ selectedFile.name }}</span>
                    <button class="btn btn-sm btn-danger" (click)="removeSelectedFile()">
                      <i class="bi bi-x"></i>
                    </button>
                  </div>
                  <button *ngIf="selectedFile" 
                          class="btn btn-success" 
                          (click)="submitReport()"
                          [disabled]="submittingReport">
                    <span *ngIf="submittingReport" class="spinner"></span>
                    <i *ngIf="!submittingReport" class="bi bi-upload"></i>
                    {{ submittingReport ? 'Envoi...' : 'Soumettre le rapport' }}
                  </button>
                </div>

                <div *ngIf="!canSubmitReport()" class="empty-state">
                  <i class="bi bi-file-earmark-x"></i>
                  <p>La soumission de rapport n'est pas disponible pour le moment</p>
                  <small>Votre stage doit être approuvé pour pouvoir soumettre un rapport</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-layout {
      margin-top: 72px;
      min-height: calc(100vh - 72px);
      background-color: var(--gray-50);
    }

    .dashboard-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: var(--spacing-8) var(--spacing-6);
    }

    .dashboard-header {
      margin-bottom: var(--spacing-8);
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .header-content h1 {
      font-size: var(--font-size-3xl);
      font-weight: 700;
      color: var(--gray-900);
      margin-bottom: var(--spacing-2);
    }

    .header-content p {
      color: var(--gray-600);
      font-size: var(--font-size-lg);
    }

    .header-date {
      color: var(--gray-500);
      font-weight: 500;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: var(--spacing-6);
      margin-bottom: var(--spacing-8);
    }

    .stat-card {
      background: white;
      border-radius: var(--radius-2xl);
      padding: var(--spacing-6);
      box-shadow: var(--shadow-sm);
      border: 1px solid var(--gray-200);
      display: flex;
      align-items: center;
      gap: var(--spacing-4);
      transition: transform 0.15s ease, box-shadow 0.15s ease;
    }

    .stat-card:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }

    .stat-icon {
      width: 48px;
      height: 48px;
      border-radius: var(--radius-xl);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      color: white;
    }

    .stat-primary .stat-icon { background-color: var(--primary-500); }
    .stat-warning .stat-icon { background-color: var(--warning-500); }
    .stat-success .stat-icon { background-color: var(--success-500); }
    .stat-info .stat-icon { background-color: var(--primary-400); }

    .stat-value {
      font-size: var(--font-size-2xl);
      font-weight: 700;
      color: var(--gray-900);
      line-height: 1;
    }

    .stat-label {
      font-size: var(--font-size-sm);
      color: var(--gray-600);
      margin-top: var(--spacing-1);
    }

    .content-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--spacing-6);
    }

    .content-section.full-width {
      grid-column: 1 / -1;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .card-header h3 {
      font-size: var(--font-size-lg);
      font-weight: 600;
      color: var(--gray-900);
    }

    .loading-state,
    .empty-state {
      text-align: center;
      padding: var(--spacing-8);
      color: var(--gray-500);
    }

    .loading-state .spinner {
      margin-bottom: var(--spacing-4);
    }

    .empty-state i {
      font-size: 48px;
      margin-bottom: var(--spacing-4);
      color: var(--gray-300);
    }

    .current-stage {
      padding: var(--spacing-4);
      border: 1px solid var(--gray-200);
      border-radius: var(--radius-xl);
      background-color: var(--gray-50);
    }

    .stage-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: var(--spacing-4);
    }

    .stage-header h4 {
      font-size: var(--font-size-lg);
      font-weight: 600;
      color: var(--gray-900);
      margin: 0;
    }

    .stage-details {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-2);
      margin-bottom: var(--spacing-4);
    }

    .detail-item {
      display: flex;
      align-items: center;
      gap: var(--spacing-2);
      color: var(--gray-600);
      font-size: var(--font-size-sm);
    }

    .stage-note {
      display: flex;
      align-items: flex-start;
      gap: var(--spacing-2);
      padding: var(--spacing-3);
      background-color: var(--primary-50);
      border-radius: var(--radius-lg);
      font-size: var(--font-size-sm);
      color: var(--primary-700);
    }

    .documents-list {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-4);
    }

    .document-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--spacing-4);
      border: 1px solid var(--gray-200);
      border-radius: var(--radius-lg);
    }

    .document-info {
      display: flex;
      align-items: center;
      gap: var(--spacing-3);
    }

    .document-info i {
      font-size: 20px;
      color: var(--danger-500);
    }

    .file-upload-area {
      border: 2px dashed var(--gray-300);
      border-radius: var(--radius-xl);
      padding: var(--spacing-8);
      text-align: center;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .file-upload-area:hover {
      border-color: var(--primary-400);
      background-color: var(--primary-50);
    }

    .file-upload-area i {
      font-size: 48px;
      color: var(--primary-400);
      margin-bottom: var(--spacing-4);
    }

    .selected-file {
      display: flex;
      align-items: center;
      gap: var(--spacing-3);
      padding: var(--spacing-3);
      background-color: var(--success-50);
      border-radius: var(--radius-lg);
      margin: var(--spacing-4) 0;
    }

    .selected-file i {
      color: var(--success-500);
    }

    .badge-primary { background-color: var(--primary-100); color: var(--primary-800); }
    .badge-warning { background-color: var(--warning-100); color: var(--warning-800); }
    .badge-success { background-color: var(--success-100); color: var(--success-800); }
    .badge-danger { background-color: var(--danger-100); color: var(--danger-800); }

    @media (max-width: 768px) {
      .dashboard-container {
        padding: var(--spacing-4);
      }

      .header-content {
        flex-direction: column;
        gap: var(--spacing-4);
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }

      .content-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class StudentDashboardComponent implements OnInit {
  currentUser: User | null = null;
  stages: Stage[] = [];
  loading = false;
  currentDate = new Date();
  selectedFile: File | null = null;
  submittingReport = false;

  constructor(
    private authService: AuthService,
    private stageService: StageService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadStages();
  }

  loadStages(): void {
    this.loading = true;
    this.stageService.getMyStages().subscribe({
      next: (stages) => {
        this.stages = stages;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.toastService.error('Erreur lors du chargement des stages');
        console.error('Error loading stages:', error);
      }
    });
  }

  getTotalStages(): number {
    return this.stages.length;
  }

  getStagesByStatus(status: string): Stage[] {
    return this.stages.filter(stage => stage.etat === status);
  }

  getCurrentStage(): Stage | null {
    // Return the most recent stage that's not rejected
    const activeStages = this.stages.filter(stage => stage.etat !== 'REJETE');
    return activeStages.length > 0 ? activeStages[activeStages.length - 1] : null;
  }

  canRequestNewStage(): boolean {
    const currentYear = new Date().getFullYear();
    const currentYearStages = this.stages.filter(stage => {
      const stageYear = new Date(stage.dateDebut).getFullYear();
      return stageYear === currentYear && stage.etat !== 'REJETE';
    });
    return currentYearStages.length === 0;
  }

  canDownloadDocuments(): boolean {
    const currentStage = this.getCurrentStage();
    return currentStage?.etat === 'APPROUVE' || currentStage?.etat === 'EN_COURS';
  }

  canSubmitReport(): boolean {
    const currentStage = this.getCurrentStage();
    return currentStage?.etat === 'APPROUVE' || currentStage?.etat === 'EN_COURS';
  }

  getStatusText(status?: string): string {
    const statusMap: { [key: string]: string } = {
      'EN_ATTENTE': 'En attente',
      'APPROUVE': 'Approuvé',
      'REJETE': 'Rejeté',
      'EN_COURS': 'En cours',
      'TERMINE': 'Terminé'
    };
    return statusMap[status || ''] || status || '';
  }

  getStatusBadgeClass(status?: string): string {
    const classMap: { [key: string]: string } = {
      'EN_ATTENTE': 'badge-warning',
      'APPROUVE': 'badge-success',
      'REJETE': 'badge-danger',
      'EN_COURS': 'badge-primary',
      'TERMINE': 'badge-primary'
    };
    return classMap[status || ''] || 'badge-primary';
  }

  downloadConvention(stageId: number): void {
    this.stageService.downloadConvention(stageId).subscribe({
      next: (blob) => {
        this.downloadFile(blob, `convention_stage_${stageId}.pdf`);
        this.toastService.success('Convention téléchargée avec succès');
      },
      error: (error) => {
        this.toastService.error('Erreur lors du téléchargement de la convention');
        console.error('Error downloading convention:', error);
      }
    });
  }

  downloadAssurance(stageId: number): void {
    this.stageService.downloadAssurance(stageId).subscribe({
      next: (blob) => {
        this.downloadFile(blob, `assurance_stage_${stageId}.pdf`);
        this.toastService.success('Attestation téléchargée avec succès');
      },
      error: (error) => {
        this.toastService.error('Erreur lors du téléchargement de l\'attestation');
        console.error('Error downloading assurance:', error);
      }
    });
  }

  triggerFileInput(): void {
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    fileInput?.click();
  }

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    
    if (file) {
      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        this.toastService.error('Le fichier ne doit pas dépasser 10MB');
        return;
      }

      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        this.toastService.error('Format de fichier non supporté. Utilisez PDF, DOC ou DOCX');
        return;
      }

      this.selectedFile = file;
    }
  }

  removeSelectedFile(): void {
    this.selectedFile = null;
  }

  submitReport(): void {
    const currentStage = this.getCurrentStage();
    if (!currentStage || !this.selectedFile) return;

    this.submittingReport = true;
    this.stageService.submitRapport(currentStage.id, this.selectedFile).subscribe({
      next: (rapport) => {
        this.submittingReport = false;
        this.selectedFile = null;
        this.toastService.success('Rapport soumis avec succès');
        this.loadStages(); // Refresh stages
      },
      error: (error) => {
        this.submittingReport = false;
        this.toastService.error('Erreur lors de la soumission du rapport');
        console.error('Error submitting report:', error);
      }
    });
  }

  private downloadFile(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
}