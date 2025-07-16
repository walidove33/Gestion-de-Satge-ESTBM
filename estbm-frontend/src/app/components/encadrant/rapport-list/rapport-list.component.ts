import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { RouterModule } from "@angular/router"
import  { StageService } from "../../../services/stage.service"
import type { Rapport } from "../../../models/stage.model"

@Component({
  selector: "app-rapport-list",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <!-- Reports Management Page: Interface for supervisors to validate student reports -->
    <div class="container mt-4">
      <!-- Header Section: Navigation and page title -->
      <div class="row">
        <div class="col-12">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h2>
              <i class="bi bi-file-earmark-text me-2"></i>
              Gestion des Rapports
            </h2>
            <a routerLink="/encadrant/dashboard" class="btn btn-outline-secondary">
              <i class="bi bi-arrow-left me-2"></i>
              Retour au tableau de bord
            </a>
          </div>
        </div>
      </div>

      <!-- Content Section: Reports table with validation actions -->
      <div class="row">
        <div class="col-12">
          <div class="card shadow">
            <div class="card-header">
              <h5 class="mb-0">
                <i class="bi bi-list-check me-2"></i>
                Rapports Soumis par les Étudiants
              </h5>
            </div>
            <div class="card-body">
              <!-- Loading State -->
              <div *ngIf="loading" class="text-center py-5">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Chargement...</span>
                </div>
                <p class="mt-3">Chargement des rapports...</p>
              </div>

              <!-- Empty State -->
              <div *ngIf="!loading && rapports.length === 0" class="text-center py-5">
                <i class="bi bi-file-earmark-x display-1 text-muted mb-3"></i>
                <h5>Aucun rapport</h5>
                <p class="text-muted">Aucun rapport n'a été soumis pour le moment.</p>
              </div>

              <!-- Reports Table: Complete table with all report details -->
              <div class="table-responsive" *ngIf="!loading && rapports.length > 0">
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th>
                        <i class="bi bi-person me-1"></i>
                        Étudiant
                      </th>
                      <th>
                        <i class="bi bi-building me-1"></i>
                        Stage
                      </th>
                      <th>
                        <i class="bi bi-file-earmark-text me-1"></i>
                        Nom du Rapport
                      </th>
                      <th>
                        <i class="bi bi-calendar-date me-1"></i>
                        Date Soumission
                      </th>
                      <th>
                        <i class="bi bi-flag me-1"></i>
                        État
                      </th>
                      <th>
                        <i class="bi bi-chat-left-text me-1"></i>
                        Commentaire
                      </th>
                      <th>
                        <i class="bi bi-gear me-1"></i>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let rapport of rapports">
                      <!-- Student Information -->
                      <td>
                        <strong>Étudiant #{{ rapport.id }}</strong>
                      </td>
                      
                      <!-- Stage Information -->
                      <td>
                        <strong>Stage #{{ rapport.stageId }}</strong>
                      </td>
                      
                      <!-- Report Name and Download -->
                      <td>
                        <span class="d-flex align-items-center">
                          <i class="bi bi-file-earmark-pdf me-2 text-danger"></i>
                          {{ rapport.nom }}
                        </span>
                      </td>
                      
                      <!-- Submission Date -->
                      <td>
                        <small>{{ rapport.dateUpload | date:'dd/MM/yyyy HH:mm' }}</small>
                      </td>
                      
                      <!-- Status Badge -->
                      <td>
                        <span class="badge" [ngClass]="getStatusClass(rapport.etat)">
                          {{ getStatusText(rapport.etat) }}
                        </span>
                      </td>
                      
                      <!-- Comment Section: Display existing comments and input for new ones -->
                      <td>
                        <div *ngIf="rapport.commentaire" class="mb-2">
                          <small class="text-muted">{{ rapport.commentaire }}</small>
                        </div>
                        <textarea 
                          class="form-control form-control-sm" 
                          placeholder="Ajouter un commentaire..."
                          [(ngModel)]="commentaires[rapport.id]"
                          rows="2"
                          [disabled]="rapport.etat !== 'EN_ATTENTE'"></textarea>
                      </td>
                      
                      <!-- Actions: Download, validate, reject -->
                      <td>
                        <div class="btn-group-vertical btn-group-sm" role="group">
                          <button 
                            class="btn btn-outline-primary mb-1" 
                            (click)="downloadReport(rapport)"
                            title="Télécharger le rapport">
                            <i class="bi bi-download me-1"></i>
                            Télécharger
                          </button>
                          
                          <button 
                            class="btn btn-success mb-1" 
                            (click)="validateReport(rapport.id)"
                            [disabled]="rapport.etat !== 'EN_ATTENTE'"
                            title="Valider le rapport">
                            <i class="bi bi-check-circle me-1"></i>
                            Valider
                          </button>
                          
                          <button 
                            class="btn btn-danger" 
                            (click)="rejectReport(rapport.id)"
                            [disabled]="rapport.etat !== 'EN_ATTENTE'"
                            title="Rejeter le rapport">
                            <i class="bi bi-x-circle me-1"></i>
                            Rejeter
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
export class RapportListComponent implements OnInit {
  rapports: Rapport[] = []
  commentaires: { [key: number]: string } = {}
  loading = false

  constructor(private stageService: StageService) {}

  ngOnInit(): void {
    this.loadRapports()
  }

  loadRapports(): void {
    this.loading = true
    this.stageService.getRapportsForEncadrant().subscribe({
      next: (rapports) => {
        this.rapports = rapports
        this.loading = false
      },
      error: (error) => {
        this.loading = false
        console.error("Erreur lors du chargement des rapports:", error)
      },
    })
  }

  getStatusClass(etat: string): string {
    switch (etat) {
      case "EN_ATTENTE":
        return "bg-warning text-dark"
      case "VALIDE":
        return "bg-success"
      case "REJETE":
        return "bg-danger"
      default:
        return "bg-secondary"
    }
  }

  getStatusText(etat: string): string {
    switch (etat) {
      case "EN_ATTENTE":
        return "En attente"
      case "VALIDE":
        return "Validé"
      case "REJETE":
        return "Rejeté"
      default:
        return etat
    }
  }

  downloadReport(rapport: Rapport): void {
    if (rapport.data) {
      const url = window.URL.createObjectURL(rapport.data)
      const a = document.createElement("a")
      a.href = url
      a.download = rapport.nom
      a.click()
      window.URL.revokeObjectURL(url)
    } else {
      // Fallback: download via API
      this.stageService.downloadRapport(rapport.id).subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob)
          const a = document.createElement("a")
          a.href = url
          a.download = rapport.nom
          a.click()
          window.URL.revokeObjectURL(url)
        },
        error: (error) => {
          console.error("Erreur lors du téléchargement:", error)
          alert("Erreur lors du téléchargement du rapport")
        },
      })
    }
  }

  validateReport(rapportId: number): void {
    const commentaire = this.commentaires[rapportId] || ""
    this.stageService.validateRapport(rapportId, commentaire).subscribe({
      next: (updatedRapport) => {
        this.loadRapports() // Refresh the list
        this.commentaires[rapportId] = "" // Clear the comment input
        alert("Rapport validé avec succès!")
      },
      error: (error) => {
        console.error("Erreur lors de la validation:", error)
        alert("Erreur lors de la validation du rapport")
      },
    })
  }

  rejectReport(rapportId: number): void {
    const commentaire = this.commentaires[rapportId]
    if (!commentaire) {
      alert("Veuillez ajouter un commentaire pour justifier le rejet.")
      return
    }

    this.stageService.rejectRapport(rapportId, commentaire).subscribe({
      next: (updatedRapport) => {
        this.loadRapports() // Refresh the list
        this.commentaires[rapportId] = "" // Clear the comment input
        alert("Rapport rejeté avec succès!")
      },
      error: (error) => {
        console.error("Erreur lors du rejet:", error)
        alert("Erreur lors du rejet du rapport")
      },
    })
  }
}
