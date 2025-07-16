import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { StageService } from '../../../services/stage.service';
import { ToastService } from '../../../services/toast.service';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { User } from '../../../models/user.model';
import { Stage, Rapport } from '../../../models/stage.model';

@Component({
  selector: 'app-encadrant-dashboard',
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
              <h1>Tableau de bord encadrant</h1>
              <p>Gérez vos stages assignés et validez les rapports</p>
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
              <i class="bi bi-briefcase"></i>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ getTotalStages() }}</div>
              <div class="stat-label">Stages assignés</div>
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
              <i class="bi bi-file-earmark-text"></i>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ getTotalRapports() }}</div>
              <div class="stat-label">Rapports reçus</div>
            </div>
          </div>
        </div>

        <!-- Main Content -->
        <div class="content-grid">
          <!-- Pending Requests -->
          <div class="content-section">
            <div class="card">
              <div class="card-header">
                <h3>Demandes en attente</h3>
                <span class="badge badge-warning">{{ getStagesByStatus('EN_ATTENTE').length }}</span>
              </div>
              <div class="card-body">
                <div *ngIf="loading" class="loading-state">
                  <div class="spinner"></div>
                  <p>Chargement...</p>
                </div>

                <div *ngIf="!loading && getStagesByStatus('EN_ATTENTE').length === 0" class="empty-state">
                  <i class="bi bi-check-circle"></i>
                  <h4>Aucune demande en attente</h4>
                  <p>Toutes les demandes ont été traitées</p>
                </div>

                <div *ngIf="!loading && getStagesByStatus('EN_ATTENTE').length > 0" class="requests-list">
                  <div *ngFor="let stage of getStagesByStatus('EN_ATTENTE')" class="request-item">
                    <div class="request-info">
                      <h5>{{ stage.sujet }}</h5>
                      <div class="request-details">
                        <span><i class="bi bi-building"></i> {{ stage.entreprise }}</span>
                        <span><i class="bi bi-person"></i> Étudiant #{{ stage.etudiantId }}</span>
                      </div>
                      <div class="request-period">
                        <i class="bi bi-calendar-range"></i>
                        {{ stage.dateDebut | date:'dd/MM/yyyy' }} - {{ stage.dateFin | date:'dd/MM/yyyy' }}
                      </div>
                    </div>
                    <div class="request-actions">
                      <button class="btn btn-sm btn-success" (click)="approveStage(stage.id)">
                        <i class="bi bi-check"></i>
                        Approuver
                      </button>
                      <button class="btn btn-sm btn-danger" (click)="rejectStage(stage.id)">
                        <i class="bi bi-x"></i>
                        Rejeter
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Validation Stats Chart -->
          <div class="content-section">
            <div class="card">
              <div class="card-header">
                <h3>Statistiques de validation</h3>
              </div>
              <div class="card-body">
                <div class="stats-chart">
                  <div class="chart-item">
                    <div class="chart-bar">
                      <div class="bar-fill bar-success" [style.height.%]="getValidationPercentage('APPROUVE')"></div>
                    </div>
                    <div class="chart-label">
                      <span class="chart-value">{{ getStagesByStatus('APPROUVE').length }}</span>
                      <span class="chart-text">Approuvés</span>
                    </div>
                  </div>
                  
                  <div class="chart-item">
                    <div class="chart-bar">
                      <div class="bar-fill bar-warning" [style.height.%]="getValidationPercentage('EN_ATTENTE')"></div>
                    </div>
                    <div class="chart-label">
                      <span class="chart-value">{{ getStagesByStatus('EN_ATTENTE').length }}</span>
                      <span class="chart-text">En attente</span>
                    </div>
                  </div>
                  
                  <div class="chart-item">
                    <div class="chart-bar">
                      <div class="bar-fill bar-danger" [style.height.%]="getValidationPercentage('REJETE')"></div>
                    </div>
                    <div class="chart-label">
                      <span class="chart-value">{{ getStagesByStatus('REJETE').length }}</span>
                      <span class="chart-text">Rejetés</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Recent Reports -->
          <div class="content-section full-width">
            <div class="card">
              <div class="card-header">
                <h3>Rapports récents</h3>
                <a routerLink="/encadrant/rapports" class="btn btn-sm btn-outline-primary">
                  Voir tous les rapports
                </a>
              </div>
              <div class="card-body">
                <div *ngIf="loadingRapports" class="loading-state">
                  <div class="spinner"></div>
                  <p>Chargement des rapports...</p>
                </div>

                <div *ngIf="!loadingRapports && rapports.length === 0" class="empty-state">
                  <i class="bi bi-file-earmark-x"></i>
                  <h4>Aucun rapport</h4>
                  <p>Aucun rapport n'a été soumis</p>
                </div>

                <div *ngIf="!loadingRapports && rapports.length > 0" class="reports-table">
                  <table class="table">
                    <thead>
                      <tr>
                        <th>Rapport</th>
                        <th>Stage</th>
                        <th>Date</th>
                        <th>État</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr *ngFor="let rapport of getRecentRapports()">
                        <td>
                          <div class="report-info">
                            <i class="bi bi-file-earmark-pdf"></i>
                            <span>{{ rapport.nom }}</span>
                          </div>
                        </td>
                        <td>Stage #{{ rapport.stageId }}</td>
                        <td>{{ rapport.dateUpload | date:'dd/MM/yyyy' }}</td>
                        <td>
                          <span class="badge" [ngClass]="getStatusBadgeClass(rapport.etat)">
                            {{ getStatusText(rapport.etat) }}
                          </span>
                        </td>
                        <td>
                          <div class="action-buttons">
                            <button class="btn btn-sm btn-outline-primary" 
                                    (click)="downloadReport(rapport)"
                                    title="Télécharger">
                              <i class="bi bi-download"></i>
                            </button>
                            <button *ngIf="rapport.etat === 'EN_ATTENTE'" 
                                    class="btn btn-sm btn-success" 
                                    (click)="validateReport(rapport.id)"
                                    title="Valider">
                              <i class="bi bi-check"></i>
                            </button>
                            <button *ngIf="rapport.etat === 'EN_ATTENTE'" 
                                    class="btn btn-sm btn-danger" 
                                    (click)="rejectReport(rapport.id)"
                                    title="Rejeter">
                              <i class="bi bi-x"></i>
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

    .requests-list {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-4);
    }

    .request-item {
      padding: var(--spacing-4);
      border: 1px solid var(--gray-200);
      border-radius: var(--radius-xl);
      background-color: var(--gray-50);
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .request-info h5 {
      font-size: var(--font-size-base);
      font-weight: 600;
      color: var(--gray-900);
      margin-bottom: var(--spacing-2);
    }

    .request-details {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-1);
      margin-bottom: var(--spacing-2);
    }

    .request-details span,
    .request-period {
      font-size: var(--font-size-sm);
      color: var(--gray-600);
      display: flex;
      align-items: center;
      gap: var(--spacing-2);
    }

    .request-actions {
      display: flex;
      gap: var(--spacing-2);
    }

    .stats-chart {
      display: flex;
      justify-content: space-around;
      align-items: end;
      height: 200px;
      padding: var(--spacing-4);
    }

    .chart-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--spacing-3);
    }

    .chart-bar {
      width: 40px;
      height: 120px;
      background-color: var(--gray-200);
      border-radius: var(--radius-md);
      display: flex;
      align-items: end;
      overflow: hidden;
    }

    .bar-fill {
      width: 100%;
      border-radius: var(--radius-md);
      transition: height 0.5s ease;
      min-height: 4px;
    }

    .bar-success { background-color: var(--success-500); }
    .bar-warning { background-color: var(--warning-500); }
    .bar-danger { background-color: var(--danger-500); }

    .chart-label {
      text-align: center;
    }

    .chart-value {
      display: block;
      font-size: var(--font-size-lg);
      font-weight: 700;
      color: var(--gray-900);
    }

    .chart-text {
      font-size: var(--font-size-sm);
      color: var(--gray-600);
    }

    .reports-table {
      overflow-x: auto;
    }

    .report-info {
      display: flex;
      align-items: center;
      gap: var(--spacing-2);
    }

    .report-info i {
      color: var(--danger-500);
      font-size: 18px;
    }

    .action-buttons {
      display: flex;
      gap: var(--spacing-1);
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

      .request-item {
        flex-direction: column;
        gap: var(--spacing-4);
      }

      .request-actions {
        align-self: stretch;
        justify-content: center;
      }
    }
  `]
})
export class EncadrantDashboardComponent implements OnInit {
  currentUser: User | null = null;
  stages: Stage[] = [];
  rapports: Rapport[] = [];
  loading = false;
  loadingRapports = false;
  currentDate = new Date();

  constructor(
    private authService: AuthService,
    private stageService: StageService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadStages();
    this.loadRapports();
  }

  loadStages(): void {
    this.loading = true;
    this.stageService.getMyAssignedStages().subscribe({
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

  loadRapports(): void {
    this.loadingRapports = true;
    this.stageService.getRapportsForEncadrant().subscribe({
      next: (rapports) => {
        this.rapports = rapports;
        this.loadingRapports = false;
      },
      error: (error) => {
        this.loadingRapports = false;
        this.toastService.error('Erreur lors du chargement des rapports');
        console.error('Error loading reports:', error);
      }
    });
  }

  getTotalStages(): number {
    return this.stages.length;
  }

  getTotalRapports(): number {
    return this.rapports.length;
  }

  getStagesByStatus(status: string): Stage[] {
    return this.stages.filter(stage => stage.etat === status);
  }

  getRecentRapports(): Rapport[] {
    return this.rapports.slice(0, 5);
  }

  getValidationPercentage(status: string): number {
    const total = this.getTotalStages();
    if (total === 0) return 0;
    return (this.getStagesByStatus(status).length / total) * 100;
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'EN_ATTENTE': 'En attente',
      'APPROUVE': 'Approuvé',
      'REJETE': 'Rejeté',
      'EN_COURS': 'En cours',
      'TERMINE': 'Terminé',
      'VALIDE': 'Validé'
    };
    return statusMap[status] || status;
  }

  getStatusBadgeClass(status: string): string {
    const classMap: { [key: string]: string } = {
      'EN_ATTENTE': 'badge-warning',
      'APPROUVE': 'badge-success',
      'REJETE': 'badge-danger',
      'EN_COURS': 'badge-primary',
      'TERMINE': 'badge-primary',
      'VALIDE': 'badge-success'
    };
    return classMap[status] || 'badge-primary';
  }

  approveStage(stageId: number): void {
    const note = prompt('Note optionnelle pour l\'approbation:');
    this.stageService.approveStage(stageId, note || undefined).subscribe({
      next: (stage) => {
        this.toastService.success('Stage approuvé avec succès');
        this.loadStages();
      },
      error: (error) => {
        this.toastService.error('Erreur lors de l\'approbation du stage');
        console.error('Error approving stage:', error);
      }
    });
  }

  rejectStage(stageId: number): void {
    const note = prompt('Raison du rejet (obligatoire):');
    if (!note) {
      this.toastService.error('Veuillez fournir une raison pour le rejet');
      return;
    }

    this.stageService.rejectStage(stageId, note).subscribe({
      next: (stage) => {
        this.toastService.success('Stage rejeté avec succès');
        this.loadStages();
      },
      error: (error) => {
        this.toastService.error('Erreur lors du rejet du stage');
        console.error('Error rejecting stage:', error);
      }
    });
  }

  downloadReport(rapport: Rapport): void {
    this.stageService.downloadRapport(rapport.id).subscribe({
      next: (blob) => {
        this.downloadFile(blob, rapport.nom);
        this.toastService.success('Rapport téléchargé avec succès');
      },
      error: (error) => {
        this.toastService.error('Erreur lors du téléchargement du rapport');
        console.error('Error downloading report:', error);
      }
    });
  }

  validateReport(rapportId: number): void {
    const commentaire = prompt('Commentaire optionnel:');
    this.stageService.validateRapport(rapportId, commentaire || undefined).subscribe({
      next: (rapport) => {
        this.toastService.success('Rapport validé avec succès');
        this.loadRapports();
      },
      error: (error) => {
        this.toastService.error('Erreur lors de la validation du rapport');
        console.error('Error validating report:', error);
      }
    });
  }

  rejectReport(rapportId: number): void {
    const commentaire = prompt('Raison du rejet (obligatoire):');
    if (!commentaire) {
      this.toastService.error('Veuillez fournir une raison pour le rejet');
      return;
    }

    this.stageService.rejectRapport(rapportId, commentaire).subscribe({
      next: (rapport) => {
        this.toastService.success('Rapport rejeté avec succès');
        this.loadRapports();
      },
      error: (error) => {
        this.toastService.error('Erreur lors du rejet du rapport');
        console.error('Error rejecting report:', error);
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