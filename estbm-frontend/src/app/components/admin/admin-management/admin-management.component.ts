import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { User, CreateAdminRequest } from '../../../models/user.model';

@Component({
  selector: 'app-admin-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <!-- Admin Management Page: Interface for managing administrator accounts -->
    <div class="container mt-4">
      <!-- Header Section: Page title and navigation -->
      <div class="row">
        <div class="col-12">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h2>
              <i class="bi bi-shield-check me-2"></i>
              Gestion des Administrateurs
            </h2>
            <a routerLink="/admin/dashboard" class="btn btn-outline-secondary">
              <i class="bi bi-arrow-left me-2"></i>
              Retour au tableau de bord
            </a>
          </div>
        </div>
      </div>

      <div class="row">
        <!-- Creation Form Section: Form to create new administrators -->
        <div class="col-md-5">
          <div class="card">
            <div class="card-header bg-dark text-white">
              <h5 class="mb-0">
                <i class="bi bi-person-plus me-2"></i>
                Créer un Administrateur
              </h5>
            </div>
            <div class="card-body">
              <!-- Success Alert -->
              <div class="alert alert-success" *ngIf="successMessage" role="alert">
                <i class="bi bi-check-circle-fill me-2"></i>
                {{ successMessage }}
              </div>

              <!-- Error Alert -->
              <div class="alert alert-danger" *ngIf="errorMessage" role="alert">
                <i class="bi bi-exclamation-triangle-fill me-2"></i>
                {{ errorMessage }}
              </div>

              <!-- Admin Creation Form: All required fields -->
              <form (ngSubmit)="createAdmin()" #adminForm="ngForm">
                <div class="mb-3">
                  <label for="nom" class="form-label">
                    <i class="bi bi-person me-1"></i>
                    Nom *
                  </label>
                  <input 
                    type="text" 
                    class="form-control" 
                    id="nom" 
                    name="nom"
                    [(ngModel)]="newAdmin.nom"
                    required
                    #nom="ngModel"
                    placeholder="Nom de l'administrateur">
                  <div class="text-danger small mt-1" *ngIf="nom.invalid && nom.touched">
                    Nom requis
                  </div>
                </div>

                <div class="mb-3">
                  <label for="prenom" class="form-label">
                    <i class="bi bi-person me-1"></i>
                    Prénom *
                  </label>
                  <input 
                    type="text" 
                    class="form-control" 
                    id="prenom" 
                    name="prenom"
                    [(ngModel)]="newAdmin.prenom"
                    required
                    #prenom="ngModel"
                    placeholder="Prénom de l'administrateur">
                  <div class="text-danger small mt-1" *ngIf="prenom.invalid && prenom.touched">
                    Prénom requis
                  </div>
                </div>

                <div class="mb-3">
                  <label for="email" class="form-label">
                    <i class="bi bi-envelope me-1"></i>
                    Email *
                  </label>
                  <input 
                    type="email" 
                    class="form-control" 
                    id="email" 
                    name="email"
                    [(ngModel)]="newAdmin.email"
                    required
                    #email="ngModel"
                    placeholder="admin@est.ac.ma">
                  <div class="text-danger small mt-1" *ngIf="email.invalid && email.touched">
                    Email valide requis
                  </div>
                </div>

                <div class="mb-3">
                  <label for="telephone" class="form-label">
                    <i class="bi bi-telephone me-1"></i>
                    Téléphone *
                  </label>
                  <input 
                    type="tel" 
                    class="form-control" 
                    id="telephone" 
                    name="telephone"
                    [(ngModel)]="newAdmin.telephone"
                    required
                    #telephone="ngModel"
                    placeholder="06 12 34 56 78">
                  <div class="text-danger small mt-1" *ngIf="telephone.invalid && telephone.touched">
                    Téléphone requis
                  </div>
                </div>

                <div class="mb-3">
                  <label for="password" class="form-label">
                    <i class="bi bi-lock me-1"></i>
                    Mot de passe *
                  </label>
                  <input 
                    type="password" 
                    class="form-control" 
                    id="password" 
                    name="password"
                    [(ngModel)]="newAdmin.password"
                    required
                    minlength="6"
                    #password="ngModel"
                    placeholder="Minimum 6 caractères">
                  <div class="text-danger small mt-1" *ngIf="password.invalid && password.touched">
                    <div *ngIf="password.errors?.['required']">Mot de passe requis</div>
                    <div *ngIf="password.errors?.['minlength']">Minimum 6 caractères</div>
                  </div>
                </div>

                <div class="d-grid">
                  <button 
                    type="submit" 
                    class="btn btn-dark" 
                    [disabled]="adminForm.invalid || loading">
                    <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
                    <i class="bi bi-shield-plus me-2" *ngIf="!loading"></i>
                    Créer l'Administrateur
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <!-- Admins List Section: Table showing all administrators -->
        <div class="col-md-7">
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">
                <i class="bi bi-list me-2"></i>
                Liste des Administrateurs
              </h5>
            </div>
            <div class="card-body">
              <!-- Loading State -->
              <div *ngIf="loadingList" class="text-center py-4">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Chargement...</span>
                </div>
                <p class="mt-3">Chargement des administrateurs...</p>
              </div>

              <!-- Empty State -->
              <div *ngIf="!loadingList && admins.length === 0" class="text-center py-4">
                <i class="bi bi-shield-check display-1 text-muted mb-3"></i>
                <h6>Aucun administrateur</h6>
                <p class="text-muted">Créez le premier administrateur en utilisant le formulaire ci-contre.</p>
              </div>

              <!-- Admins Table: Complete list with actions -->
              <div class="table-responsive" *ngIf="!loadingList && admins.length > 0">
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th>Nom Complet</th>
                      <th>Email</th>
                      <th>Téléphone</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let admin of admins">
                      <td>
                        <i class="bi bi-shield-check me-2 text-primary"></i>
                        <strong>{{ admin.nom }} {{ admin.prenom }}</strong>
                      </td>
                      <td>
                        <i class="bi bi-envelope me-1"></i>
                        {{ admin.email }}
                      </td>
                      <td>
                        <i class="bi bi-telephone me-1"></i>
                        {{ admin.telephone }}
                      </td>
                      <td>
                        <div class="btn-group btn-group-sm">
                          <button 
                            class="btn btn-outline-primary" 
                            (click)="editAdmin(admin)"
                            title="Modifier">
                            <i class="bi bi-pencil"></i>
                          </button>
                          <button 
                            class="btn btn-outline-danger" 
                            (click)="deleteAdmin(admin.id)"
                            title="Supprimer">
                            <i class="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminManagementComponent implements OnInit {
  admins: User[] = [];
  newAdmin: CreateAdminRequest = {
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    password: ''
  };
  
  successMessage = '';
  errorMessage = '';
  loading = false;
  loadingList = false;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadAdmins();
  }

  loadAdmins(): void {
    this.loadingList = true;
    this.userService.listAdmins().subscribe({
      next: (admins) => {
        this.admins = admins;
        this.loadingList = false;
      },
      error: (error) => {
        this.loadingList = false;
        console.error('Erreur lors du chargement des admins:', error);
      }
    });
  }

  createAdmin(): void {
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.userService.createAdmin(this.newAdmin).subscribe({
      next: (admin) => {
        this.loading = false;
        this.successMessage = 'Administrateur créé avec succès!';
        this.resetForm();
        this.loadAdmins(); // Refresh the list
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = 'Erreur lors de la création de l\'administrateur.';
        console.error('Error:', error);
      }
    });
  }

  editAdmin(admin: User): void {
    // This would open a modal or navigate to an edit page
    alert(`Modification de ${admin.nom} ${admin.prenom} - Fonctionnalité à implémenter`);
  }

  deleteAdmin(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet administrateur ?')) {
      this.userService.deleteAdmin(id).subscribe({
        next: () => {
          this.loadAdmins(); // Refresh the list
          alert('Administrateur supprimé avec succès!');
        },
        error: (error) => {
          console.error('Erreur lors de la suppression:', error);
          alert('Erreur lors de la suppression de l\'administrateur');
        }
      });
    }
  }

  private resetForm(): void {
    this.newAdmin = {
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
      password: ''
    };
  }
}