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
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.css']
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