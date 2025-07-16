import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { StageService } from '../../../services/stage.service';
import { UserService } from '../../../services/user.service';
import { ToastService } from '../../../services/toast.service';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FormsModule],
  template: `
    <app-navbar></app-navbar>
    
    <div class="dashboard-layout">
      <div class="dashboard-container">
        <!-- Header -->
        <div class="dashboard-header">
          <div class="header-content">
            <div>
              <h1>Tableau de bord administrateur</h1>
              <p>Vue d'ensemble des activités de stage et gestion du système</p>
            </div>
            <div class="header-date">
              {{ currentDate | date:'EEEE d MMMM yyyy':'fr' }}
            </div>
          </div>
        </div>

        <!-- KPI Cards -->
        <div class="kpi-grid">
          <div class="kpi-card kpi-primary">
            <div class="kpi-icon">
              <i class="bi bi-file-earmark-plus"></i>
            </div>
            <div class="kpi-content">
              <div class="kpi-value">{{ stats.totalDemandes || 0 }}</div>
              <div class="kpi-label">Total Demandes</div>
              <div class="kpi-trend positive">
                <i class="bi bi-arrow-up"></i>
                +12% ce mois
              </div>
            </div>
          </div>

          <div class="kpi-card kpi-warning">
            <div class="kpi-icon">
              <i class="bi bi-clock-history"></i>
            </div>
            <div class="kpi-content">
              <div class="kpi-value">{{ stats.enAttente || 0 }}</div>
              <div class="kpi-label">En Attente</div>
              <div class="kpi-trend neutral">
                <i class="bi bi-dash"></i>
                Stable
              </div>
            </div>
          </div>

          <div class="kpi-card kpi-success">
            <div class="kpi-icon">
              <i class="bi bi-check-circle"></i>
            </div>
            <div class="kpi-content">
              <div class="kpi-value">{{ stats.validees || 0 }}</div>
              <div class="kpi-label">Validées</div>
              <div class="kpi-trend positive">
                <i class="bi bi-arrow-up"></i>
                +8% ce mois
              </div>
            </div>
          </div>

          <div class="kpi-card kpi-info">
            <div class="kpi-icon">
              <i class="bi bi-people"></i>
            </div>
            <div class="kpi-content">
              <div class="kpi-value">{{ stats.totalEtudiants || 0 }}</div>
              <div class="kpi-label">Étudiants Actifs</div>
              <div class="kpi-trend positive">
                <i class="bi bi-arrow-up"></i>
                +5% ce mois
              </div>
            </div>
          </div>
        </div>

        <!-- Charts and Analytics -->
        <div class="analytics-section">
          <div class="analytics-grid">
            <!-- Stages by Filière -->
            <div class="chart-card">
              <div class="chart-header">
                <h3>Répartition par Filière</h3>
              </div>
              <div class="chart-content">
                <div class="filiere-stats">
                  <div class="filiere-item" *ngFor="let item of filiereStats">
                    <div class="filiere-info">
                      <span class="filiere-name">{{ item.name }}</span>
                      <span class="filiere-count">{{ item.count }}</span>
                    </div>
                    <div class="filiere-bar">
                      <div class="bar-fill" [style.width.%]="item.percentage"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Assignment Management -->
            <div class="chart-card">
              <div class="chart-header">
                <h3>Gestion des Affectations</h3>
                <button class="btn btn-sm btn-primary" (click)="showAssignmentModal = true">
                  <i class="bi bi-plus"></i>
                  Nouvelle affectation
                </button>
              </div>
              <div class="chart-content">
                <div *ngIf="loadingAssignments" class="loading-state">
                  <div class="spinner"></div>
                  <p>Chargement...</p>
                </div>

                <div *ngIf="!loadingAssignments && assignments.length === 0" class="empty-state">
                  <i class="bi bi-person-x"></i>
                  <p>Aucune affectation</p>
                </div>

                <div *ngIf="!loadingAssignments && assignments.length > 0" class="assignments-list">
                  <div *ngFor="let assignment of getRecentAssignments()" class="assignment-item">
                    <div class="assignment-info">
                      <div class="student-name">{{ assignment.etudiant?.prenom }} {{ assignment.etudiant?.nom }}</div>
                      <div class="encadrant-name">→ {{ assignment.encadrant?.prenom }} {{ assignment.encadrant?.nom }}</div>
                    </div>
                    <button class="btn btn-sm btn-outline-danger" 
                            (click)="removeAssignment(assignment.id)"
                            title="Supprimer l'affectation">
                      <i class="bi bi-x"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Data Table -->
        <div class="table-section">
          <div class="table-card">
            <div class="table-header">
              <h3>Demandes Récentes</h3>
              <div class="table-actions">
                <div class="search-box">
                  <i class="bi bi-search"></i>
                  <input type="text" 
                         placeholder="Rechercher..." 
                         [(ngModel)]="searchTerm" 
                         (input)="filterData()">
                </div>
                <select class="filter-select" 
                        [(ngModel)]="statusFilter" 
                        (change)="filterData()">
                  <option value="">Tous les statuts</option>
                  <option value="EN_ATTENTE">En attente</option>
                  <option value="APPROUVE">Approuvé</option>
                  <option value="REJETE">Rejeté</option>
                </select>
                <button class="btn btn-primary">
                  <i class="bi bi-download"></i>
                  Exporter
                </button>
              </div>
            </div>
            
            <div class="table-content">
              <div *ngIf="loading" class="loading-state">
                <div class="spinner"></div>
                <p>Chargement des données...</p>
              </div>

              <table *ngIf="!loading" class="data-table">
                <thead>
                  <tr>
                    <th>Étudiant</th>
                    <th>Filière</th>
                    <th>Entreprise</th>
                    <th>Période</th>
                    <th>Statut</th>
                    <th>Encadrant</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let stage of getPaginatedStages()">
                    <td>
                      <div class="student-info">
                        <div class="student-avatar">
                          <i class="bi bi-person-circle"></i>
                        </div>
                        <div class="student-details">
                          <div class="student-name">Étudiant #{{ stage.etudiantId }}</div>
                          <div class="student-email">{{ stage.filiere }}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span class="filiere-badge">{{ stage.filiere }}</span>
                    </td>
                    <td>{{ stage.entreprise }}</td>
                    <td>
                      <div class="date-range">
                        {{ stage.dateDebut | date:'dd/MM' }} - {{ stage.dateFin | date:'dd/MM/yyyy' }}
                      </div>
                    </td>
                    <td>
                      <span class="status-badge" [ngClass]="getStatusClass(stage.etat)">
                        {{ getStatusText(stage.etat) }}
                      </span>
                    </td>
                    <td>
                      <span *ngIf="stage.encadrantId" class="text-muted">Encadrant #{{ stage.encadrantId }}</span>
                      <span *ngIf="!stage.encadrantId" class="text-muted">Non assigné</span>
                    </td>
                    <td>
                      <div class="action-buttons">
                        <button class="btn btn-sm btn-outline-primary" title="Voir détails">
                          <i class="bi bi-eye"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-secondary" title="Modifier">
                          <i class="bi bi-pencil"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>

              <!-- Pagination -->
              <div class="pagination" *ngIf="!loading && filteredStages.length > 0">
                <div class="pagination-info">
                  Affichage de {{ (currentPage - 1) * pageSize + 1 }} à {{ Math.min(currentPage * pageSize, filteredStages.length) }} sur {{ filteredStages.length }} résultats
                </div>
                <div class="pagination-controls">
                  <button class="btn btn-sm btn-outline-secondary" 
                          [disabled]="currentPage === 1" 
                          (click)="previousPage()">
                    <i class="bi bi-chevron-left"></i>
                  </button>
                  <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
                  <button class="btn btn-sm btn-outline-secondary" 
                          [disabled]="currentPage === totalPages" 
                          (click)="nextPage()">
                    <i class="bi bi-chevron-right"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Assignment Modal -->
    <div *ngIf="showAssignmentModal" class="modal-overlay" (click)="closeAssignmentModal()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h3>Nouvelle Affectation</h3>
          <button class="btn btn-sm btn-outline-secondary" (click)="closeAssignmentModal()">
            <i class="bi bi-x"></i>
          </button>
        </div>
        <div class="modal-body">
          <form (ngSubmit)="createAssignment()" #assignmentForm="ngForm">
            <div class="form-group">
              <label class="form-label">Étudiant ID</label>
              <input type="number" 
                     class="form-control" 
                     [(ngModel)]="newAssignment.etudiantId"
                     name="etudiantId"
                     required>
            </div>
            <div class="form-group">
              <label class="form-label">Encadrant ID</label>
              <input type="number" 
                     class="form-control" 
                     [(ngModel)]="newAssignment.encadrantId"
                     name="encadrantId"
                     required>
            </div>
            <div class="form-group">
              <label class="form-label">Stage ID (optionnel)</label>
              <input type="number" 
                     class="form-control" 
                     [(ngModel)]="newAssignment.stageId"
                     name="stageId">
            </div>
            <div class="modal-actions">
              <button type="button" class="btn btn-secondary" (click)="closeAssignmentModal()">
                Annuler
              </button>
              <button type="submit" 
                      class="btn btn-primary" 
                      [disabled]="assignmentForm.invalid || creatingAssignment">
                <span *ngIf="creatingAssignment" class="spinner"></span>
                {{ creatingAssignment ? 'Création...' : 'Créer' }}
              </button>
            </div>
          </form>
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

    /* KPI Section */
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: var(--spacing-6);
      margin-bottom: var(--spacing-8);
    }

    .kpi-card {
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

    .kpi-card:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }

    .kpi-icon {
      width: 60px;
      height: 60px;
      border-radius: var(--radius-xl);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      color: white;
    }

    .kpi-primary .kpi-icon { background: linear-gradient(135deg, var(--primary-500), var(--primary-600)); }
    .kpi-warning .kpi-icon { background: linear-gradient(135deg, var(--warning-500), var(--warning-600)); }
    .kpi-success .kpi-icon { background: linear-gradient(135deg, var(--success-500), var(--success-600)); }
    .kpi-info .kpi-icon { background: linear-gradient(135deg, var(--primary-400), var(--primary-500)); }

    .kpi-content {
      flex: 1;
    }

    .kpi-value {
      font-size: 2rem;
      font-weight: 700;
      color: var(--gray-900);
      line-height: 1;
      margin-bottom: var(--spacing-1);
    }

    .kpi-label {
      font-size: var(--font-size-sm);
      color: var(--gray-600);
      font-weight: 500;
      margin-bottom: var(--spacing-2);
    }

    .kpi-trend {
      font-size: var(--font-size-xs);
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: var(--spacing-1);
    }

    .kpi-trend.positive { color: var(--success-600); }
    .kpi-trend.negative { color: var(--danger-600); }
    .kpi-trend.neutral { color: var(--gray-500); }

    /* Analytics Section */
    .analytics-section {
      margin-bottom: var(--spacing-8);
    }

    .analytics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: var(--spacing-6);
    }

    .chart-card {
      background: white;
      border-radius: var(--radius-2xl);
      box-shadow: var(--shadow-sm);
      border: 1px solid var(--gray-200);
      overflow: hidden;
    }

    .chart-header {
      padding: var(--spacing-6);
      border-bottom: 1px solid var(--gray-200);
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: var(--gray-50);
    }

    .chart-header h3 {
      font-size: var(--font-size-lg);
      font-weight: 600;
      color: var(--gray-900);
    }

    .chart-content {
      padding: var(--spacing-6);
    }

    .filiere-stats {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-4);
    }

    .filiere-item {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-2);
    }

    .filiere-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .filiere-name {
      font-size: var(--font-size-sm);
      color: var(--gray-700);
      font-weight: 500;
    }

    .filiere-count {
      font-size: var(--font-size-sm);
      color: var(--gray-900);
      font-weight: 600;
    }

    .filiere-bar {
      height: 8px;
      background: var(--gray-200);
      border-radius: var(--radius-md);
      overflow: hidden;
    }

    .bar-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--primary-500), var(--primary-600));
      border-radius: var(--radius-md);
      transition: width 0.5s ease;
    }

    .assignments-list {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-3);
      max-height: 200px;
      overflow-y: auto;
    }

    .assignment-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--spacing-3);
      background-color: var(--gray-50);
      border-radius: var(--radius-lg);
    }

    .assignment-info {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-1);
    }

    .student-name {
      font-size: var(--font-size-sm);
      font-weight: 600;
      color: var(--gray-900);
    }

    .encadrant-name {
      font-size: var(--font-size-xs);
      color: var(--gray-600);
    }

    /* Table Section */
    .table-section {
      margin-bottom: var(--spacing-8);
    }

    .table-card {
      background: white;
      border-radius: var(--radius-2xl);
      box-shadow: var(--shadow-sm);
      border: 1px solid var(--gray-200);
      overflow: hidden;
    }

    .table-header {
      padding: var(--spacing-6);
      border-bottom: 1px solid var(--gray-200);
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: var(--spacing-4);
      background-color: var(--gray-50);
    }

    .table-header h3 {
      font-size: var(--font-size-lg);
      font-weight: 600;
      color: var(--gray-900);
    }

    .table-actions {
      display: flex;
      align-items: center;
      gap: var(--spacing-3);
      flex-wrap: wrap;
    }

    .search-box {
      position: relative;
      display: flex;
      align-items: center;
    }

    .search-box i {
      position: absolute;
      left: var(--spacing-3);
      color: var(--gray-400);
      font-size: var(--font-size-sm);
    }

    .search-box input {
      padding: var(--spacing-2) var(--spacing-3) var(--spacing-2) var(--spacing-8);
      border: 1px solid var(--gray-300);
      border-radius: var(--radius-lg);
      font-size: var(--font-size-sm);
      width: 200px;
    }

    .filter-select {
      padding: var(--spacing-2) var(--spacing-3);
      border: 1px solid var(--gray-300);
      border-radius: var(--radius-lg);
      font-size: var(--font-size-sm);
      background: white;
    }

    .table-content {
      overflow-x: auto;
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
    }

    .data-table th {
      background-color: var(--gray-50);
      padding: var(--spacing-4);
      text-align: left;
      font-size: var(--font-size-xs);
      font-weight: 600;
      color: var(--gray-700);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-bottom: 1px solid var(--gray-200);
    }

    .data-table td {
      padding: var(--spacing-4);
      border-bottom: 1px solid var(--gray-100);
      font-size: var(--font-size-sm);
      color: var(--gray-700);
    }

    .data-table tr:hover {
      background-color: var(--gray-50);
    }

    .student-info {
      display: flex;
      align-items: center;
      gap: var(--spacing-3);
    }

    .student-avatar {
      font-size: 32px;
      color: var(--gray-400);
    }

    .student-details {
      display: flex;
      flex-direction: column;
    }

    .student-name {
      font-weight: 500;
      color: var(--gray-900);
      line-height: 1.2;
    }

    .student-email {
      font-size: var(--font-size-xs);
      color: var(--gray-500);
      line-height: 1.2;
    }

    .filiere-badge {
      background: var(--primary-100);
      color: var(--primary-800);
      padding: var(--spacing-1) var(--spacing-2);
      border-radius: var(--radius-md);
      font-size: var(--font-size-xs);
      font-weight: 500;
    }

    .date-range {
      font-size: var(--font-size-xs);
      color: var(--gray-600);
    }

    .status-badge {
      padding: var(--spacing-1) var(--spacing-2);
      border-radius: var(--radius-md);
      font-size: var(--font-size-xs);
      font-weight: 500;
    }

    .status-badge.en-attente { background: var(--warning-100); color: var(--warning-800); }
    .status-badge.approuve { background: var(--success-100); color: var(--success-800); }
    .status-badge.rejete { background: var(--danger-100); color: var(--danger-800); }
    .status-badge.en-cours { background: var(--primary-100); color: var(--primary-800); }

    .action-buttons {
      display: flex;
      gap: var(--spacing-1);
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

    .pagination {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--spacing-4) var(--spacing-6);
      border-top: 1px solid var(--gray-200);
      background-color: var(--gray-50);
    }

    .pagination-info {
      font-size: var(--font-size-sm);
      color: var(--gray-600);
    }

    .pagination-controls {
      display: flex;
      align-items: center;
      gap: var(--spacing-3);
    }

    .page-info {
      font-size: var(--font-size-sm);
      color: var(--gray-700);
      font-weight: 500;
    }

    /* Modal */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal-content {
      background: white;
      border-radius: var(--radius-2xl);
      box-shadow: var(--shadow-xl);
      width: 100%;
      max-width: 500px;
      margin: var(--spacing-4);
    }

    .modal-header {
      padding: var(--spacing-6);
      border-bottom: 1px solid var(--gray-200);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .modal-header h3 {
      font-size: var(--font-size-lg);
      font-weight: 600;
      color: var(--gray-900);
    }

    .modal-body {
      padding: var(--spacing-6);
    }

    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: var(--spacing-3);
      margin-top: var(--spacing-6);
    }

    @media (max-width: 768px) {
      .dashboard-container {
        padding: var(--spacing-4);
      }

      .header-content {
        flex-direction: column;
        gap: var(--spacing-4);
      }

      .kpi-grid {
        grid-template-columns: 1fr;
      }

      .analytics-grid {
        grid-template-columns: 1fr;
      }

      .table-header {
        flex-direction: column;
        align-items: stretch;
      }

      .table-actions {
        justify-content: stretch;
      }

      .search-box input {
        width: 100%;
      }

      .student-info {
        flex-direction: column;
        align-items: flex-start;
        gap: var(--spacing-2);
      }
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  currentUser: User | null = null;
  currentDate = new Date();
  loading = false;
  loadingAssignments = false;
  creatingAssignment = false;
  searchTerm = '';
  statusFilter = '';
  currentPage = 1;
  pageSize = 10;
  showAssignmentModal = false;

  stats = {
    totalDemandes: 0,
    enAttente: 0,
    validees: 0,
    refusees: 0,
    totalEtudiants: 0
  };

  stages: any[] = [];
  filteredStages: any[] = [];
  assignments: any[] = [];
  
  filiereStats = [
    { name: 'Génie Informatique', count: 45, percentage: 85 },
    { name: 'Génie Électrique', count: 32, percentage: 60 },
    { name: 'Génie Mécanique', count: 28, percentage: 53 },
    { name: 'Génie Civil', count: 22, percentage: 42 },
    { name: 'Génie Industriel', count: 18, percentage: 34 },
    { name: 'Génie Chimique', count: 15, percentage: 28 }
  ];

  newAssignment = {
    etudiantId: 0,
    encadrantId: 0,
    stageId: undefined as number | undefined
  };

  constructor(
    private authService: AuthService,
    private stageService: StageService,
    private userService: UserService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadData();
  }

  loadData(): void {
    this.loading = true;

    // Load statistics
    this.stageService.getStageStats().subscribe({
      next: (stats) => {
        this.stats = {
          totalDemandes: stats.total || 156,
          enAttente: stats.enAttente || 23,
          validees: stats.validees || 98,
          refusees: stats.refusees || 12,
          totalEtudiants: stats.totalEtudiants || 245
        };
      },
      error: (error) => {
        console.error('Error loading stats:', error);
        // Use mock data
        this.stats = {
          totalDemandes: 156,
          enAttente: 23,
          validees: 98,
          refusees: 12,
          totalEtudiants: 245
        };
      }
    });

    // Load stages data
    this.stageService.getAllStages().subscribe({
      next: (stages) => {
        this.stages = stages;
        this.filteredStages = [...stages];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading stages:', error);
        this.loading = false;
        // Use mock data
        this.stages = this.generateMockData();
        this.filteredStages = [...this.stages];
      }
    });

    this.loadAssignments();
  }

  loadAssignments(): void {
    this.loadingAssignments = true;
    this.stageService.getAssignments().subscribe({
      next: (assignments) => {
        this.assignments = assignments;
        this.loadingAssignments = false;
      },
      error: (error) => {
        console.error('Error loading assignments:', error);
        this.loadingAssignments = false;
        // Use mock data
        this.assignments = [
          {
            id: 1,
            etudiantId: 1,
            encadrantId: 1,
            etudiant: { nom: 'Benali', prenom: 'Ahmed' },
            encadrant: { nom: 'Alaoui', prenom: 'Dr. Fatima' }
          },
          {
            id: 2,
            etudiantId: 2,
            encadrantId: 2,
            etudiant: { nom: 'Idrissi', prenom: 'Salma' },
            encadrant: { nom: 'Tazi', prenom: 'Pr. Hassan' }
          }
        ];
      }
    });
  }

  generateMockData(): any[] {
    return [
      {
        id: 1,
        etudiantId: 1,
        filiere: 'Génie Informatique',
        entreprise: 'TechCorp Morocco',
        dateDebut: '2024-02-01',
        dateFin: '2024-07-31',
        etat: 'EN_ATTENTE',
        encadrantId: null
      },
      {
        id: 2,
        etudiantId: 2,
        filiere: 'Génie Électrique',
        entreprise: 'ElectroMag Solutions',
        dateDebut: '2024-03-15',
        dateFin: '2024-08-15',
        etat: 'APPROUVE',
        encadrantId: 1
      },
      {
        id: 3,
        etudiantId: 3,
        filiere: 'Génie Mécanique',
        entreprise: 'MechaDesign Pro',
        dateDebut: '2024-01-20',
        dateFin: '2024-06-20',
        etat: 'EN_COURS',
        encadrantId: 2
      }
    ];
  }

  filterData(): void {
    this.filteredStages = this.stages.filter(stage => {
      const matchesSearch = !this.searchTerm ||
        stage.entreprise.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        stage.filiere.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesStatus = !this.statusFilter || stage.etat === this.statusFilter;

      return matchesSearch && matchesStatus;
    });

    this.currentPage = 1;
  }

  getPaginatedStages(): any[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.filteredStages.slice(startIndex, endIndex);
  }

  getRecentAssignments(): any[] {
    return this.assignments.slice(0, 5);
  }

  getStatusClass(status: string): string {
    return status.toLowerCase().replace('_', '-');
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'EN_ATTENTE': 'En attente',
      'APPROUVE': 'Approuvé',
      'REJETE': 'Rejeté',
      'EN_COURS': 'En cours',
      'TERMINE': 'Terminé'
    };
    return statusMap[status] || status;
  }

  get totalPages(): number {
    return Math.ceil(this.filteredStages.length / this.pageSize);
  }

  get Math() {
    return Math;
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  closeAssignmentModal(): void {
    this.showAssignmentModal = false;
    this.newAssignment = {
      etudiantId: 0,
      encadrantId: 0,
      stageId: undefined
    };
  }

  createAssignment(): void {
    this.creatingAssignment = true;
    this.stageService.assignEncadrant(this.newAssignment).subscribe({
      next: (assignment) => {
        this.creatingAssignment = false;
        this.toastService.success('Affectation créée avec succès');
        this.closeAssignmentModal();
        this.loadAssignments();
      },
      error: (error) => {
        this.creatingAssignment = false;
        this.toastService.error('Erreur lors de la création de l\'affectation');
        console.error('Error creating assignment:', error);
      }
    });
  }

  removeAssignment(assignmentId: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette affectation ?')) {
      this.stageService.removeAssignment(assignmentId).subscribe({
        next: () => {
          this.toastService.success('Affectation supprimée avec succès');
          this.loadAssignments();
        },
        error: (error) => {
          this.toastService.error('Erreur lors de la suppression de l\'affectation');
          console.error('Error removing assignment:', error);
        }
      });
    }
  }
}