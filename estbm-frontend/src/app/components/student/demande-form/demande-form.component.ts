// src/app/components/student/demande-form/demande-form.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }  from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { StageService } from '../../../services/stage.service';
import { AuthService }  from '../../../services/auth.service';
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
      this.toastService.error('Session expirée ! Veuillez vous reconnecter.');
      this.router.navigate(['/login']);
      return;
    }
    this.stageData.etudiantId = userId;
  }

  getMinDate(): string {
    // Permet de désactiver les dates passées
    return new Date().toISOString().split('T')[0];
  }

  onSubmit(): void {
    if (this.loading || !this.stageData.etudiantId) return;

    this.loading = true;
    this.stageService.createDemande(this.stageData).subscribe({
      next: () => {
        this.loading = false;
        this.toastService.success('Demande de stage soumise avec succès !');
        this.router.navigate(['/student/dashboard']);
      },
      error: err => {
        this.loading = false;
        console.error('Error submitting stage request:', err);
        if (err.status === 401) {
          this.toastService.error('Session expirée. Veuillez vous reconnecter.');
          this.router.navigate(['/login']);
        } else if (err.status === 400) {
          this.toastService.error('Données invalides. Vérifiez vos informations.');
        } else {
          this.toastService.error('Une erreur est survenue lors de la soumission.');
        }
      }
    });
  }
}
