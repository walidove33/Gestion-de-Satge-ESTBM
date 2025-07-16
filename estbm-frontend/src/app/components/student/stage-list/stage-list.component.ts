import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import  { StageService } from "../../../services/stage.service"
import type { Stage } from "../../../models/stage.model"

@Component({
  selector: "app-stage-list",
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- Stage List Page: Complete table view of all student's stages -->
    <div class="container mt-4">
      <!-- Header Section: Page title and navigation -->
      <div class="row">
        <div class="col-12">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h2>
              <i class="bi bi-list-ul me-2"></i>
              Mes Stages
            </h2>
            <div>
              <a routerLink="/student/new-stage" class="btn btn-primary me-2">
                <i class="bi bi-plus-circle me-2"></i>
                Nouveau Stage
              </a>
              <a routerLink="/student/dashboard" class="btn btn-outline-secondary">
                <i class="bi bi-arrow-left me-2"></i>
                Retour
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Content Section: Stages table with all details -->
      <div class="row">
        <div class="col-12">
          <div class="card shadow">
            <div class="card-header">
              <h5 class="mb-0">
                <i class="bi bi-briefcase me-2"></i>
                Liste complète de vos stages
              </h5>
            </div>
            <div class="card-body">
              <!-- Loading State -->
              <div *ngIf="loading" class="text-center py-5">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Chargement...</span>
                </div>
                <p class="mt-3">Chargement de vos stages...</p>
              </div>

              <!-- Empty State -->
              <div *ngIf="!loading && stages.length === 0" class="text-center py-5">
                <i class="bi bi-briefcase display-1 text-muted mb-3"></i>
                <h5>Aucun stage trouvé</h5>
                <p class="text-muted">Vous n'avez pas encore de demandes de stage.</p>
                <a routerLink="/student/new-stage" class="btn btn-primary">
                  <i class="bi bi-plus-circle me-2"></i>
                  Créer votre première demande
                </a>
              </div>

              <!-- Stages Table: Complete table with all stage information -->
              <div class="table-responsive" *ngIf="!loading && stages.length > 0">
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th>
                        <i class="bi bi-building me-1"></i>
                        Entreprise
                      </th>
                      <th>
                        <i class="bi bi-journal-text me-1"></i>
                        Sujet
                      </th>
                      <th>
                        <i class="bi bi-mortarboard me-1"></i>
                        Filière
                      </th>
                      <th>
                        <i class="bi bi-calendar-range me-1"></i>
                        Période
                      </th>
                      <th>
                        <i class="bi bi-flag me-1"></i>
                        État
                      </th>
                      <th>
                        <i class="bi bi-gear me-1"></i>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let stage of stages">
                      <!-- Company Information -->
                      <td>
                        <strong>{{ stage.entreprise }}</strong>
                      </td>
                      
                      <!-- Subject -->
                      <td>
                        <span [title]="stage.sujet">
                          {{ stage.sujet.length > 50 ? (stage.sujet | slice:0:50) + '...' : stage.sujet }}
                        </span>
                      </td>
                      
                      <!-- Field of Study -->
                      <td>
                        <span class="badge bg-info">{{ stage.filiere }}</span>
                      </td>
                      
                      <!-- Duration -->
                      <td>
                        <small>
                          <strong>Du:</strong> {{ stage.dateDebut | date:'dd/MM/yyyy' }}<br>
                          <strong>Au:</strong> {{ stage.dateFin | date:'dd/MM/yyyy' }}
                        </small>
                      </td>
                      
                      <!-- Status Badge -->
                      <td>
                        <span class="badge" [ngClass]="getStatusClass(stage.etat)">
                          {{ getStatusText(stage.etat) }}
                        </span>
                        <div *ngIf="stage.note" class="mt-1">
                          <small class="text-muted">
                            <i class="bi bi-chat-left-text me-1"></i>
                            {{ stage.note }}
                          </small>
                        </div>
                      </td>
                      
                      <!-- Actions: Download convention and upload report -->
                      <td>
                        <div class="btn-group btn-group-sm" role="group">
                          <button 
                            class="btn btn-outline-primary" 
                            (click)="downloadConvention(stage.id)"
                            [disabled]="stage.etat === 'EN_ATTENTE' || stage.etat === 'REJETE'"
                            title="Télécharger la convention">
                            <i class="bi bi-download"></i>
                          </button>
                          <button 
                            class="btn btn-outline-success" 
                            (click)="uploadReport(stage.id)"
                            [disabled]="stage.etat !== 'APPROUVE' && stage.etat !== 'EN_COURS'"
                            title="Soumettre le rapport">
                            <i class="bi bi-upload"></i>
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
  `,
})
export class StageListComponent implements OnInit {
  stages: Stage[] = []
  loading = false

  constructor(private stageService: StageService) {}

  ngOnInit(): void {
    this.loadStages()
  }

  loadStages(): void {
    this.loading = true
    this.stageService.getMyStages().subscribe({
      next: (stages) => {
        this.stages = stages
        this.loading = false
      },
      error: (error) => {
        this.loading = false
        console.error("Erreur lors du chargement des stages:", error)
      },
    })
  }

  getStatusClass(etat: string): string {
    switch (etat) {
      case "EN_ATTENTE":
        return "bg-warning text-dark"
      case "APPROUVE":
        return "bg-success"
      case "REJETE":
        return "bg-danger"
      case "EN_COURS":
        return "bg-info"
      case "TERMINE":
        return "bg-secondary"
      default:
        return "bg-secondary"
    }
  }

  getStatusText(etat: string): string {
    switch (etat) {
      case "EN_ATTENTE":
        return "En attente"
      case "APPROUVE":
        return "Approuvé"
      case "REJETE":
        return "Rejeté"
      case "EN_COURS":
        return "En cours"
      case "TERMINE":
        return "Terminé"
      default:
        return etat
    }
  }

  downloadConvention(stageId: number): void {
    this.stageService.downloadConvention(stageId).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `convention_stage_${stageId}.pdf`
        a.click()
        window.URL.revokeObjectURL(url)
      },
      error: (error) => {
        console.error("Erreur lors du téléchargement:", error)
        alert("Erreur lors du téléchargement de la convention")
      },
    })
  }

  uploadReport(stageId: number): void {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".pdf,.doc,.docx"
    input.onchange = (event: any) => {
      const file = event.target.files[0]
      if (file) {
        this.stageService.submitRapport(stageId, file).subscribe({
          next: (rapport) => {
            alert("Rapport soumis avec succès!")
            this.loadStages() // Refresh the list
          },
          error: (error) => {
            console.error("Erreur lors de l'envoi du rapport:", error)
            alert("Erreur lors de l'envoi du rapport")
          },
        })
      }
    }
    input.click()
  }
}
