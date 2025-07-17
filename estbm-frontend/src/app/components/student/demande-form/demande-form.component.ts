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
  templateUrl: './demande-form.component.html',
  styleUrls: ['./demande-form.component.css']
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
    const input = document.querySelector(`#${type}Input`) as HTMLInputElement;
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