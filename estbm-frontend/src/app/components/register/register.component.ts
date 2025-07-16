
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RegisterRequest } from '../../models/auth.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <!-- Registration Page: Student registration form with all required fields -->
    <div class="min-vh-100 d-flex align-items-center justify-content-center bg-light py-4">
      <div class="card shadow-lg" style="width: 100%; max-width: 500px;">
        <!-- Header Section: App branding and registration title -->
        <div class="card-header text-center bg-success text-white">
          <h4 class="mb-0">
            <i class="bi bi-person-plus-fill me-2"></i>
            Inscription Étudiant
          </h4>
          <small>École Supérieure de Technologie</small>
        </div>

        <!-- Form Section: Complete registration form -->
        <div class="card-body p-4">
          <!-- Success Alert: Shows registration success message -->
          <div class="alert alert-success" *ngIf="successMessage" role="alert">
            <i class="bi bi-check-circle-fill me-2"></i>
            {{ successMessage }}
          </div>

          <!-- Error Alert: Shows registration errors -->
          <div class="alert alert-danger" *ngIf="errorMessage" role="alert">
            <i class="bi bi-exclamation-triangle-fill me-2"></i>
            {{ errorMessage }}
          </div>

          <!-- Registration Form: All student information fields -->
          <form (ngSubmit)="onRegister()" #registerForm="ngForm">
            <div class="row">
              <!-- Student Identification Section -->
              <div class="col-md-6">
                <div class="mb-3">
                  <label for="codeApogee" class="form-label">
                    <i class="bi bi-credit-card-2-front me-1"></i>
                    Code Apogée
                  </label>
                  <input 
                    type="text" 
                    class="form-control" 
                    id="codeApogee" 
                    name="codeApogee"
                    [(ngModel)]="userData.codeApogee"
                    required
                    #codeApogee="ngModel"
                    placeholder="Ex: 12345678">
                  <div class="text-danger small mt-1" *ngIf="codeApogee.invalid && codeApogee.touched">
                    Code Apogée requis
                  </div>
                </div>
              </div>

              <div class="col-md-6">
                <div class="mb-3">
                  <label for="codeMassar" class="form-label">
                    <i class="bi bi-credit-card-2-front me-1"></i>
                    Code Massar
                  </label>
                  <input 
                    type="text" 
                    class="form-control" 
                    id="codeMassar" 
                    name="codeMassar"
                    [(ngModel)]="userData.codeMassar"
                    required
                    #codeMassar="ngModel"
                    placeholder="Ex: M123456789">
                  <div class="text-danger small mt-1" *ngIf="codeMassar.invalid && codeMassar.touched">
                    Code Massar requis
                  </div>
                </div>
              </div>
            </div>

            <!-- Personal Information Section -->
            <div class="row">
              <div class="col-md-6">
                <div class="mb-3">
                  <label for="nom" class="form-label">
                    <i class="bi bi-person me-1"></i>
                    Nom
                  </label>
                  <input 
                    type="text" 
                    class="form-control" 
                    id="nom" 
                    name="nom"
                    [(ngModel)]="userData.nom"
                    required
                    #nom="ngModel"
                    placeholder="Votre nom">
                  <div class="text-danger small mt-1" *ngIf="nom.invalid && nom.touched">
                    Nom requis
                  </div>
                </div>
              </div>

              <div class="col-md-6">
                <div class="mb-3">
                  <label for="prenom" class="form-label">
                    <i class="bi bi-person me-1"></i>
                    Prénom
                  </label>
                  <input 
                    type="text" 
                    class="form-control" 
                    id="prenom" 
                    name="prenom"
                    [(ngModel)]="userData.prenom"
                    required
                    #prenom="ngModel"
                    placeholder="Votre prénom">
                  <div class="text-danger small mt-1" *ngIf="prenom.invalid && prenom.touched">
                    Prénom requis
                  </div>
                </div>
              </div>
            </div>

            <!-- Birth Date Section -->
            <div class="mb-3">
              <label for="dateNaissance" class="form-label">
                <i class="bi bi-calendar-date me-1"></i>
                Date de naissance
              </label>
              <input 
                type="date" 
                class="form-control" 
                id="dateNaissance" 
                name="dateNaissance"
                [(ngModel)]="userData.dateNaissance"
                required
                #dateNaissance="ngModel">
              <div class="text-danger small mt-1" *ngIf="dateNaissance.invalid && dateNaissance.touched">
                Date de naissance requise
              </div>
            </div>

            <!-- Contact Information Section -->
            <div class="mb-3">
              <label for="email" class="form-label">
                <i class="bi bi-envelope me-1"></i>
                Email
              </label>
              <input 
                type="email" 
                class="form-control" 
                id="email" 
                name="email"
                [(ngModel)]="userData.email"
                required
                #email="ngModel"
                placeholder="votre.email@est.ac.ma">
              <div class="text-danger small mt-1" *ngIf="email.invalid && email.touched">
                Email valide requis
              </div>
            </div>

            <div class="mb-3">
              <label for="telephone" class="form-label">
                <i class="bi bi-telephone me-1"></i>
                Téléphone
              </label>
              <input 
                type="tel" 
                class="form-control" 
                id="telephone" 
                name="telephone"
                [(ngModel)]="userData.telephone"
                required
                #telephone="ngModel"
                placeholder="06 12 34 56 78">
              <div class="text-danger small mt-1" *ngIf="telephone.invalid && telephone.touched">
                Téléphone requis
              </div>
            </div>

            <!-- Security Section -->
            <div class="mb-3">
              <label for="password" class="form-label">
                <i class="bi bi-lock me-1"></i>
                Mot de passe
              </label>
              <input 
                type="password" 
                class="form-control" 
                id="password" 
                name="password"
                [(ngModel)]="userData.password"
                required
                minlength="6"
                #password="ngModel"
                placeholder="Minimum 6 caractères">
              <div class="text-danger small mt-1" *ngIf="password.invalid && password.touched">
                <div *ngIf="password.errors?.['required']">Mot de passe requis</div>
                <div *ngIf="password.errors?.['minlength']">Minimum 6 caractères</div>
              </div>
            </div>

            <!-- Actions Section: Registration button and loading state -->
            <div class="d-grid gap-2">
              <button 
                type="submit" 
                class="btn btn-success" 
                [disabled]="registerForm.invalid || loading">
                <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
                <i class="bi bi-person-plus me-2" *ngIf="!loading"></i>
                S'inscrire
              </button>
            </div>
          </form>

          <!-- Navigation Section: Link to login -->
          <div class="text-center mt-3">
            <small class="text-muted">
              Déjà inscrit ?
              <a routerLink="/login" class="text-decoration-none">
                Se connecter
              </a>
            </small>
          </div>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
  userData: RegisterRequest = {
    codeApogee: '',
    codeMassar: '',
    dateNaissance: '',
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    password: ''
  };
  
  errorMessage = '';
  successMessage = '';
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onRegister(): void {
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.register(this.userData).subscribe({
      next: (response) => {
        this.loading = false;
        this.successMessage = 'Inscription réussie ! Vous pouvez maintenant vous connecter.';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = 'Erreur lors de l\'inscription. Vérifiez vos informations.';
      }
    });
  }
}