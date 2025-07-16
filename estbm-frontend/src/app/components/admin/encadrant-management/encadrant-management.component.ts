import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { User, CreateEncadrantRequest } from '../../../models/user.model';

@Component({
  selector: 'app-encadrant-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <!-- Encadrant Management Page: Interface for managing supervisor accounts -->
    <div class="container mt-4">
      <!-- Header Section: Page title and navigation -->
      <div class="row">
        <div class="col-12">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h2>
              <i class="bi bi-people me-2"></i>
              Gestion des Encadrants
            </h2>
            <a routerLink="/admin/dashboard" class="btn btn-outline-secondary">
              <i class="bi bi-arrow-left me-2"></i>
              Retour au tableau de bord
            </a>
          </div>
        </div>
      </div>

      <div class="row">
        <!-- Creation Form Section: Form to create new supervisors -->
        <div class="col-md-5">
          <div class="card">
            <div class="card-header bg-primary text-white">
              <h5 class="mb-0">
                <i class="bi bi-person-plus me-2"></i>
                Créer un Encadrant
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

              <!-- Encadrant Creation Form: All required fields -->
              <form (ngSubmit)="createEncadrant()" #encadrantForm="ngForm">
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
                    [(ngModel)]="newEncadrant.nom"
                    required
                    #nom="ngModel"
                    placeholder="Nom de l'encadrant">
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
                    [(ngModel)]="newEncadrant.prenom"
                    required
                    #prenom="ngModel"
                    placeholder="Prénom de l'encadrant">
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
                    [(ngModel)]="newEncadrant.email"
                    required
                    #email="ngModel"
                    placeholder="encadrant@est.ac.ma">
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
                    [(ngModel)]="newEncadrant.telephone"
                    required
                    #telephone="ngModel"
                    placeholder="06 12 34 56 78">
                  <div class="text-danger small mt-1" *ngIf="telephone.invalid && telephone.touched">
                    Téléphone requis
                  </div>
                </div>

                <div class="mb-3">
                  <label for="specialite" class="form-label">
                    <i class="bi bi-mortarboard me-1"></i>
                    Spécialité *
                  </label>
                  <select 
                    class="form-select" 
                    id="specialite" 
                    name="specialite"
                    [(ngModel)]="newEncadrant.specialite"
                    required
                    #specialite="ngModel">
                    <option value="">Sélectionnez une spécialité</option>
                    <option value="Génie Informatique">Génie Informatique</option>
                    <option value="Génie Électrique">Génie Électrique</option>
                    <option value="Génie Mécanique">Génie Mécanique</option>
                    <option value="Génie Civil">Génie Civil</option>
                    <option value="Génie Industriel">Génie Industriel</option>
                    <option value="Génie Chimique">Génie Chimique</option>
                  </select>
                  <div class="text-danger small mt-1" *ngIf="specialite.invalid && specialite.touched">
                    Spécialité requise
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
                    [(ngModel)]="newEncadrant.password"
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
                    class="btn btn-primary" 
                    [disabled]="encadrantForm.invalid || loading">
                    <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
                    <i class="bi bi-person-plus me-2" *ngIf="!loading"></i>
                    Créer l'Encadrant
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <!-- Encadrants List Section: Table showing all supervisors -->
        <div class="col-md-7">
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">
                <i class="bi bi-list me-2"></i>
                Liste des Encadrants
              </h5>
            </div>
            <div class="card-body">
              <!-- Loading State -->
              <div *ngIf="loadingList" class="text-center py-4">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Chargement...</span>
                </div>
                <p class="mt-3">Chargement des encadrants...</p>
              </div>

              <!-- Empty State -->
              <div *ngIf="!loadingList && encadrants.length === 0" class="text-center py-4">
                <i class="bi bi-people display-1 text-muted mb-3"></i>
                <h6>Aucun encadrant</h6>
                <p class="text-muted">Créez le premier encadrant en utilisant le formulaire ci-contre.</p>
              </div>

              <!-- Encadrants Table: Complete list with actions -->
              <div class="table-responsive" *ngIf="!loadingList && encadrants.length > 0">
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th>Nom Complet</th>
                      <th>Email</th>
                      <th>Téléphone</th>
                      <th>Spécialité</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let encadrant of encadrants">
                      <td>
                        <strong>{{ encadrant.nom }} {{ encadrant.prenom }}</strong>
                      </td>
                      <td>
                        <i class="bi bi-envelope me-1"></i>
                        {{ encadrant.email }}
                      </td>
                      <td>
                        <i class="bi bi-telephone me-1"></i>
                        {{ encadrant.telephone }}
                      </td>
                      <td>
                        <span class="badge bg-info">{{ encadrant.specialite }}</span>
                      </td>
                      <td>
                        <div class="btn-group btn-group-sm">
                          <button 
                            class="btn btn-outline-primary" 
                            (click)="editEncadrant(encadrant)"
                            title="Modifier">
                            <i class="bi bi-pencil"></i>
                          </button>
                          <button 
                            class="btn btn-outline-danger" 
                            (click)="deleteEncadrant(encadrant.id)"
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
export class EncadrantManagementComponent implements OnInit {
  encadrants: User[] = [];
  newEncadrant: CreateEncadrantRequest = {
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    specialite: '',
    password: ''
  };
  
  successMessage = '';
  errorMessage = '';
  loading = false;
  loadingList = false;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadEncadrants();
  }

  loadEncadrants(): void {
    this.loadingList = true;
    this.userService.listEncadrants().subscribe({
      next: (encadrants) => {
        this.encadrants = encadrants;
        this.loadingList = false;
      },
      error: (error) => {
        this.loadingList = false;
        console.error('Erreur lors du chargement des encadrants:', error);
      }
    });
  }

  createEncadrant(): void {
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.userService.createEncadrant(this.newEncadrant).subscribe({
      next: (encadrant) => {
        this.loading = false;
        this.successMessage = 'Encadrant créé avec succès!';
        this.resetForm();
        this.loadEncadrants(); // Refresh the list
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = 'Erreur lors de la création de l\'encadrant.';
        console.error('Error:', error);
      }
    });
  }

  editEncadrant(encadrant: User): void {
    // This would open a modal or navigate to an edit page
    alert(`Modification de ${encadrant.nom} ${encadrant.prenom} - Fonctionnalité à implémenter`);
  }

  deleteEncadrant(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet encadrant ?')) {
      this.userService.deleteEncadrant(id).subscribe({
        next: () => {
          this.loadEncadrants(); // Refresh the list
          alert('Encadrant supprimé avec succès!');
        },
        error: (error) => {
          console.error('Erreur lors de la suppression:', error);
          alert('Erreur lors de la suppression de l\'encadrant');
        }
      });
    }
  }

  private resetForm(): void {
    this.newEncadrant = {
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
      specialite: '',
      password: ''
    };
  }
}