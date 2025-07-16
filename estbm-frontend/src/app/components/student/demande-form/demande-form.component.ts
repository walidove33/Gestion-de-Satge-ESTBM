import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { StageService } from '../../../services/stage.service';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { StageRequest } from '../../../models/stage.model';

@Component({
  selector: 'app-demande-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    
    <div class="form-layout">
      <div class="form-container">
        <!-- Header -->
        <div class="form-header">
          <h1>Nouvelle demande de stage</h1>
          <p>Remplissez le formulaire ci-dessous pour soumettre votre demande</p>
        </div>

        <!-- Form -->
        <div class="card">
          <form (ngSubmit)="onSubmit()" #stageForm="ngForm">
            <div class="card-body">
              <!-- Basic Information -->
              <div class="form-section">
                <h3>Informations générales</h3>
                
                <div class="form-grid">
                  <div class="form-group">
                    <label for="entreprise" class="form-label">
                      Entreprise *
                    </label>
                    <input 
                      type="text" 
                      id="entreprise" 
                      name="entreprise"
                      class="form-control"
                      [(ngModel)]="stageData.entreprise"
                      required
                      #entreprise="ngModel"
                      placeholder="Nom de l'entreprise"
                      [class.is-invalid]="entreprise.invalid && entreprise.touched">
                    <div *ngIf="entreprise.invalid && entreprise.touched" class="invalid-feedback">
                      Le nom de l'entreprise est requis
                    </div>
                  </div>

                  <div class="form-group">
                    <label for="filiere" class="form-label">
                      Filière *
                    </label>
                    <select 
                      id="filiere" 
                      name="filiere"
                      class="form-control"
                      [(ngModel)]="stageData.filiere"
                      required
                      #filiere="ngModel"
                      [class.is-invalid]="filiere.invalid && filiere.touched">
                      <option value="">Sélectionnez votre filière</option>
                      <option value="Génie Informatique">Génie Informatique</option>
                      <option value="Génie Électrique">Génie Électrique</option>
                      <option value="Génie Mécanique">Génie Mécanique</option>
                      <option value="Génie Civil">Génie Civil</option>
                      <option value="Génie Industriel">Génie Industriel</option>
                      <option value="Génie Chimique">Génie Chimique</option>
                    </select>
                    <div *ngIf="filiere.invalid && filiere.touched" class="invalid-feedback">
                      Veuillez sélectionner votre filière
                    </div>
                  </div>
                </div>

                <div class="form-group">
                  <label for="sujet" class="form-label">
                    Sujet du stage *
                  </label>
                  <textarea 
                    id="sujet" 
                    name="sujet"
                    class="form-control"
                    [(ngModel)]="stageData.sujet"
                    required
                    #sujet="ngModel"
                    rows="4"
                    placeholder="Décrivez le sujet de votre stage..."
                    [class.is-invalid]="sujet.invalid && sujet.touched"></textarea>
                  <div *ngIf="sujet.invalid && sujet.touched" class="invalid-feedback">
                    Le sujet du stage est requis
                  </div>
                </div>

                <div class="form-grid">
                  <div class="form-group">
                    <label for="dateDebut" class="form-label">
                      Date de début *
                    </label>
                    <input 
                      type="date" 
                      id="dateDebut" 
                      name="dateDebut"
                      class="form-control"
                      [(ngModel)]="stageData.dateDebut"
                      required
                      #dateDebut="ngModel"
                      [min]="getMinDate()"
                      [class.is-invalid]="dateDebut.invalid && dateDebut.touched">
                    <div *ngIf="dateDebut.invalid && dateDebut.touched" class="invalid-feedback">
                      La date de début est requise
                    </div>
                  </div>

                  <div class="form-group">
                    <label for="dateFin" class="form-label">
                      Date de fin *
                    </label>
                    <input 
                      type="date" 
                      id="dateFin" 
                      name="dateFin"
                      class="form-control"
                      [(ngModel)]="stageData.dateFin"
                      required
                      #dateFin="ngModel"
                      [min]="stageData.dateDebut"
                      [class.is-invalid]="dateFin.invalid && dateFin.touched">
                    <div *ngIf="dateFin.invalid && dateFin.touched" class="invalid-feedback">
                      La date de fin est requise
                    </div>
                  </div>
                </div>
              </div>

              <!-- Documents -->
              <div class="form-section">
                <h3>Documents (optionnels)</h3>
                
                <div class="form-grid">
                  <div class="form-group">
                    <label class="form-label">
                      Attestation d'assurance
                    </label>
                    <div class="file-upload-area" 
                         [class.has-file]="selectedFiles.assurance"
                         (click)="triggerFileInput('assurance')">
                      <input #assuranceInput 
                             type="file" 
                             accept=".pdf,.jpg,.jpeg,.png"
                             (change)="onFileSelect($event, 'assurance')"
                             hidden>
                      <div *ngIf="!selectedFiles.assurance" class="upload-placeholder">
                        <i class="bi bi-cloud-upload"></i>
                        <p>Cliquez pour sélectionner</p>
                        <small>PDF, JPG, PNG - Max 5MB</small>
                      </div>
                      <div *ngIf="selectedFiles.assurance" class="file-selected">
                        <i class="bi bi-file-earmark-check"></i>
                        <span>{{ selectedFiles.assurance.name }}</span>
                        <button type="button" class="btn btn-sm btn-danger" (click)="removeFile('assurance', $event)">
                          <i class="bi bi-x"></i>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div class="form-group">
                    <label class="form-label">
                      Convention de stage
                    </label>
                    <div class="file-upload-area" 
                         [class.has-file]="selectedFiles.convention"
                         (click)="triggerFileInput('convention')">
                      <input #conventionInput 
                             type="file" 
                             accept=".pdf,.doc,.docx"
                             (change)="onFileSelect($event, 'convention')"
                             hidden>
                      <div *ngIf="!selectedFiles.convention" class="upload-placeholder">
                        <i class="bi bi-cloud-upload"></i>
                        <p>Cliquez pour sélectionner</p>
                        <small>PDF, DOC, DOCX - Max 5MB</small>
                      </div>
                      <div *ngIf="selectedFiles.convention" class="file-selected">
                        <i class="bi bi-file-earmark-check"></i>
                        <span>{{ selectedFiles.convention.name }}</span>
                        <button type="button" class="btn btn-sm btn-danger" (click)="removeFile('convention', $event)">
                          <i class="bi bi-x"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Form Actions -->
            <div class="card-footer">
              <div class="form-actions">
                <button type="button" 
                        routerLink="/student/dashboard" 
                        class="btn btn-secondary">
                  Annuler
                </button>
                <button type="submit" 
                        class="btn btn-primary" 
                        [disabled]="stageForm.invalid || loading">
                  <span *ngIf="loading" class="spinner"></span>
                  <i *ngIf="!loading" class="bi bi-send"></i>
                  {{ loading ? 'Envoi...' : 'Soumettre la demande' }}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .form-layout {
      margin-top: 72px;
      min-height: calc(100vh - 72px);
      background-color: var(--gray-50);
      padding: var(--spacing-8) var(--spacing-6);
    }

    .form-container {
      max-width: 800px;
      margin: 0 auto;
    }

    .form-header {
      text-align: center;
      margin-bottom: var(--spacing-8);
    }

    .form-header h1 {
      font-size: var(--font-size-3xl);
      font-weight: 700;
      color: var(--gray-900);
      margin-bottom: var(--spacing-2);
    }

    .form-header p {
      color: var(--gray-600);
      font-size: var(--font-size-lg);
    }

    .form-section {
      margin-bottom: var(--spacing-8);
    }

    .form-section h3 {
      font-size: var(--font-size-xl);
      font-weight: 600;
      color: var(--gray-900);
      margin-bottom: var(--spacing-6);
      padding-bottom: var(--spacing-3);
      border-bottom: 2px solid var(--gray-200);
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--spacing-6);
    }

    .file-upload-area {
      border: 2px dashed var(--gray-300);
      border-radius: var(--radius-xl);
      padding: var(--spacing-6);
      text-align: center;
      cursor: pointer;
      transition: all 0.15s ease;
      min-height: 120px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .file-upload-area:hover {
      border-color: var(--primary-400);
      background-color: var(--primary-50);
    }

    .file-upload-area.has-file {
      border-color: var(--success-400);
      background-color: var(--success-50);
    }

    .upload-placeholder i {
      font-size: 32px;
      color: var(--primary-400);
      margin-bottom: var(--spacing-2);
    }

    .upload-placeholder p {
      margin: 0 0 var(--spacing-1) 0;
      font-weight: 500;
      color: var(--gray-700);
    }

    .upload-placeholder small {
      color: var(--gray-500);
    }

    .file-selected {
      display: flex;
      align-items: center;
      gap: var(--spacing-3);
    }

    .file-selected i {
      font-size: 24px;
      color: var(--success-500);
    }

    .file-selected span {
      font-weight: 500;
      color: var(--success-700);
    }

    .form-actions {
      display: flex;
      justify-content: space-between;
      gap: var(--spacing-4);
    }

    .form-actions .btn {
      flex: 1;
      max-width: 200px;
    }

    @media (max-width: 768px) {
      .form-layout {
        padding: var(--spacing-4);
      }

      .form-grid {
        grid-template-columns: 1fr;
      }

      .form-actions {
        flex-direction: column;
      }

      .form-actions .btn {
        max-width: none;
      }
    }
  `]
})
export class DemandeFormComponent implements OnInit {
  stageData: StageRequest = {
    sujet: '',
    entreprise: '',
    filiere: '',
    dateDebut: '',
    dateFin: '',
    etudiantId: 0
  };

  selectedFiles: {
    assurance?: File;
    convention?: File;
  } = {};

  loading = false;

  constructor(
    private authService: AuthService,
    private stageService: StageService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const userId = this.authService.getUserId();
    if (!userId) {
      this.toastService.error('Session expirée. Veuillez vous reconnecter.');
      this.router.navigate(['/login']);
      return;
    }
    this.stageData.etudiantId = userId;
  }

  getMinDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  triggerFileInput(type: 'assurance' | 'convention'): void {
    const input = document.querySelector(`input[type="file"][accept*="${type === 'assurance' ? 'jpg' : 'doc'}"]`) as HTMLInputElement;
    input?.click();
  }

  onFileSelect(event: Event, type: 'assurance' | 'convention'): void {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    
    if (file) {
      if (this.validateFile(file, type)) {
        this.selectedFiles[type] = file;
      }
    }
  }

  validateFile(file: File, type: 'assurance' | 'convention'): boolean {
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (file.size > maxSize) {
      this.toastService.error('Le fichier ne doit pas dépasser 5MB');
      return false;
    }

    const allowedTypes = type === 'assurance'
      ? ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
      : ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

    if (!allowedTypes.includes(file.type)) {
      this.toastService.error(`Format de fichier non supporté pour ${type}`);
      return false;
    }

    return true;
  }

  removeFile(type: 'assurance' | 'convention', event: Event): void {
    event.stopPropagation();
    delete this.selectedFiles[type];
  }

  onSubmit(): void {
    if (!this.stageData.etudiantId) {
      this.toastService.error('Erreur d\'authentification. Veuillez vous reconnecter.');
      return;
    }

    this.loading = true;

    this.stageService.createDemande(
      this.stageData,
      this.selectedFiles.assurance,
      this.selectedFiles.convention
    ).subscribe({
      next: (stage) => {
        this.loading = false;
        this.toastService.success('Demande de stage soumise avec succès !');
        setTimeout(() => {
          this.router.navigate(['/student/dashboard']);
        }, 1500);
      },
      error: (error) => {
        this.loading = false;
        console.error('Error submitting stage request:', error);

        if (error.status === 401) {
          this.toastService.error('Session expirée. Veuillez vous reconnecter.');
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        } else if (error.status === 400) {
          this.toastService.error('Données invalides. Vérifiez vos informations.');
        } else if (error.status === 0) {
          this.toastService.error('Impossible de se connecter au serveur.');
        } else {
          this.toastService.error('Une erreur est survenue lors de la soumission.');
        }
      }
    });
  }
}