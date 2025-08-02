



// import { Component, type OnInit } from "@angular/core"
// import { CommonModule } from "@angular/common"
// import { RouterModule, Router } from "@angular/router"
// import { StageService } from "../../../services/stage.service"
// import { AuthService } from "../../../services/auth.service"
// import { ToastService } from "../../../services/toast.service"
// import { Stage } from "../../../models/stage.model"
// import { NavbarComponent } from "../../shared/navbar/navbar.component"
// import { EtatStage } from "../../../models/stage.model"
// import { Rapport } from "../../../models/stage.model"
// @Component({
//   selector: "app-student-dashboard",
//   standalone: true,
//   imports: [CommonModule, RouterModule, NavbarComponent],
//   templateUrl: "./student-dashboard.component.html",
//   styleUrls: ["./student-dashboard.component.scss"],
// })
// export class StudentDashboardComponent implements OnInit {
//   existingRapport: Rapport | null = null;
//   stages: Stage[] = []
//   rapports: any[] = []; 
//   loading = true
//   currentUser: any
//   currentDate = new Date()
//   selectedFile: File | null = null
//   submittingReport = false
  
//   // Dashboard statistics
//   stats = {
//     total: 0,
//     enAttente: 0,
//     valides: 0,
//     refuses: 0,
//     enCours: 0,
//     termines: 0
//   }

//   constructor(
//     private stageService: StageService,
//     private authService: AuthService,
//     private router: Router,
//     private toastService: ToastService,
//   ) {
//     this.currentUser = this.authService.getCurrentUser()
//   }

//   ngOnInit(): void {
//     console.log("🚀 StudentDashboard initialized")
//     this.loadStages()
    
//     // Animation cascade pour les éléments
//     setTimeout(() => {
//       this.animateElements()
//     }, 100)
//   }


  


//   loadExistingRapport(stageId: number): void {
//     this.stageService.getExistingRapport(stageId).subscribe({
//       next: (rapport) => {
//         this.existingRapport = rapport;
//         console.log("📄 Existing rapport:", rapport);
//       },
//       error: (error) => {
//         console.error("❌ Error loading existing rapport:", error);
//         this.existingRapport = null;
//       }
//     });
//   }

//   loadStages(): void {
//     this.loading = true

//     this.stageService.getMyStages().subscribe({
//       next: (stages) => {
//         console.log("✅ Loaded stages:", stages)
//         this.stages = stages || []
//         this.calculateStats()

//         this.loading = false
//       },
//       error: (error) => {
//         console.error("❌ Error loading stages:", error)
//         this.toastService.error("Erreur lors du chargement de vos stages: " + error.message)
//         this.stages = []
//         this.loading = false
//       },
//     })
//   }

//   calculateStats(): void {
//   this.stats = {
//     total: this.stages.length,
//     enAttente: this.stages.filter(s => s.etat === EtatStage.EN_ATTENTE_VALIDATION).length,
//     valides: this.stages.filter(s => 
//         s.etat === EtatStage.ACCEPTE || 
//         s.etat === EtatStage.RAPPORT_SOUMIS).length,  // Inclure les rapports soumis
//     refuses: this.stages.filter(s => s.etat === EtatStage.REFUSE).length,
//     enCours: this.stages.filter(s => s.etat === EtatStage.EN_COURS).length,
//     termines: this.stages.filter(s => s.etat === EtatStage.TERMINE).length
//   }
// }



//   animateElements(): void {
//     const cards = document.querySelectorAll('.stat-card')
//     cards.forEach((card, index) => {
//       setTimeout(() => {
//         card.classList.add('animate-slideInFromBottom')
//       }, index * 150)
//     })
//   }

//   getCurrentStage(): Stage | null {
//   const activeStages = this.stages.filter((stage) => 
//     [
//       EtatStage.EN_ATTENTE_VALIDATION, 
//       EtatStage.ACCEPTE, 
//       EtatStage.EN_COURS,
//       EtatStage.RAPPORT_SOUMIS // Ajouter cet état
//     ].includes(stage.etat)
//   );
//   return activeStages.length > 0 ? activeStages[0] : null;
// }

//   canRequestNewStage(): boolean {
//     const activeStages = this.stages.filter(
//       (stage) => ['EN_ATTENTE', 'VALIDE', 'EN_COURS'].includes(stage.etat)
//     )
//     return activeStages.length === 0
//   }


// canSubmitReport(): boolean {
//     const current = this.getCurrentStage();
//     if (!current) return false;

//     const isEtatOk = current.etat === EtatStage.ACCEPTE || 
//                       current.etat === EtatStage.EN_COURS ||
//                       current.etat === EtatStage.RAPPORT_SOUMIS;

//     return isEtatOk;
//   }



// canDownloadDocuments(): boolean {
//   const currentStage = this.getCurrentStage();
//   if (!currentStage) return false;
  
//   return [
//     EtatStage.ACCEPTE,
//     EtatStage.EN_COURS,
//     EtatStage.TERMINE,
//     EtatStage.RAPPORT_SOUMIS // Ajouter cet état
//   ].includes(currentStage.etat);
// }


// getStatusText(status: EtatStage): string {
//   const statusMap: Record<EtatStage, string> = {
//     [EtatStage.DEMANDE]: 'Demande créée',
//     [EtatStage.EN_ATTENTE_VALIDATION]: 'En attente de validation',
//     [EtatStage.VALIDATION_EN_COURS]: 'Validation en cours',
//     [EtatStage.ACCEPTE]: 'Validé par l’encadrant',
//     [EtatStage.REFUSE]: 'Refusé',
//     [EtatStage.EN_COURS]: 'Stage en cours',
//     [EtatStage.TERMINE]: 'Stage terminé',
//     [EtatStage.RAPPORT_SOUMIS]: 'Rapport soumis'
//   };

//   return statusMap[status] || status;
// }

// getStatusBadgeClass(status: EtatStage): string {
//   const classMap: Record<EtatStage, string> = {
//     [EtatStage.DEMANDE]: "badge-neutral",
//     [EtatStage.EN_ATTENTE_VALIDATION]: "badge-warning",
//     [EtatStage.VALIDATION_EN_COURS]: "badge-accent",
//     [EtatStage.ACCEPTE]: "badge-success",  // Doit correspondre à "ACCEPTE" sans accent
//     [EtatStage.REFUSE]: "badge-error",
//     [EtatStage.EN_COURS]: "badge-primary",
//     [EtatStage.TERMINE]: "badge-secondary",
//     [EtatStage.RAPPORT_SOUMIS]: "badge-info"
//   };
//   return classMap[status] || "badge-secondary";
// }


//   getProgressPercentage(status: string): number {
//     if (this.stats.total === 0) return 0
//     const count = this.stats[status as keyof typeof this.stats] as number
//     return (count / this.stats.total) * 100
//   }

//   triggerFileInput(): void {
//     const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
//     fileInput?.click()
//   }

//   onFileSelected(event: any): void {
//     const file = event.target.files[0]
//     if (file) {
//       if (file.size > 10 * 1024 * 1024) {
//         this.toastService.error("Le fichier ne doit pas dépasser 10MB")
//         return
//       }

//       const allowedTypes = [
//         "application/pdf",
//         "application/msword",
//         "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//       ]
//       if (!allowedTypes.includes(file.type)) {
//         this.toastService.error("Format de fichier non supporté. Utilisez PDF, DOC ou DOCX")
//         return
//       }

//       this.selectedFile = file
//     }
//   }

  

//   removeSelectedFile(): void {
//     this.selectedFile = null
//     const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
//     if (fileInput) {
//       fileInput.value = ""
//     }
//   }


//    submitReport(): void {
//     const currentStage = this.getCurrentStage();
//     if (!currentStage || !this.selectedFile) {
//       this.toastService.error("Aucun fichier sélectionné");
//       return;
//     }

//     // Validation du fichier
//     if (this.selectedFile.type !== 'application/pdf') {
//       this.toastService.error("Seuls les fichiers PDF sont acceptés");
//       return;
//     }

//     if (this.selectedFile.size > 10 * 1024 * 1024) {
//       this.toastService.error("Le fichier est trop volumineux (max 10MB)");
//       return;
//     }

//     this.submittingReport = true;
//     this.stageService.submitRapport(currentStage.id, this.selectedFile).subscribe({
//       next: () => {
//         this.submittingReport = false;
//         this.toastService.success("Rapport soumis avec succès");
//         this.selectedFile = null;
//         this.loadStages();
//         this.loadExistingRapport(currentStage.id); // Recharger le rapport
//       },
//       error: (error) => {
//         this.submittingReport = false;
//         this.toastService.error("Erreur lors de la soumission du rapport");
//         console.error("Error submitting report:", error);
//       },
//     });
//   }


//   downloadConvention(stageId: number): void {
//     this.stageService.downloadConvention(stageId).subscribe({
//       next: (blob) => {
//         this.downloadFile(blob, `convention_stage_${stageId}.pdf`)
//         this.toastService.success("Convention téléchargée avec succès")
//       },
//       error: (error) => {
//         this.toastService.error("Erreur lors du téléchargement de la convention")
//         console.error("Error downloading convention:", error)
//       },
//     })
//   }

//   downloadAssurance(stageId: number): void {
//     this.stageService.downloadAssurance(stageId).subscribe({
//       next: (blob) => {
//         this.downloadFile(blob, `assurance_stage_${stageId}.pdf`)
//         this.toastService.success("Attestation d'assurance téléchargée")
//       },
//       error: (error) => {
//         this.toastService.error("Erreur lors du téléchargement de l'assurance")
//         console.error("Error downloading assurance:", error)
//       },
//     })
//   }

//   private downloadFile(blob: Blob, filename: string): void {
//     const url = window.URL.createObjectURL(blob)
//     const a = document.createElement("a")
//     a.href = url
//     a.download = filename
//     document.body.appendChild(a)
//     a.click()
//     document.body.removeChild(a)
//     window.URL.revokeObjectURL(url)
//   }

//   downloadExistingReport(): void {
//   if (this.existingRapport && this.existingRapport.cloudinaryUrl) {
//     window.open(this.existingRapport.cloudinaryUrl, '_blank');
//   } else {
//     this.toastService.error("URL du rapport non disponible");
//   }
// }
// }

import { Component, type OnInit, type OnDestroy } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { Subject, takeUntil } from "rxjs"

import  { StageService } from "../../../services/stage.service"
import  { AuthService } from "../../../services/auth.service"
import  { NotificationService } from "../../../services/notification.service"
import { NavbarComponent } from "../../shared/navbar/navbar.component"
import { CardComponent } from "../../../shared/components/card/card.component"
import { LoadingComponent } from "../../../shared/components/loading/loading.component"
import {
  EmptyStateComponent,
  type EmptyStateAction,
} from "../../../shared/components/empty-state/empty-state.component"

import { type Stage, EtatStage, type Rapport } from "../../../models/stage.model"
import type { User } from "../../../models/user.model"

@Component({
  selector: "app-student-dashboard",
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, CardComponent, LoadingComponent, EmptyStateComponent],
  templateUrl: "./student-dashboard.component.html",
  styleUrls: ["./student-dashboard.component.scss"],
})
export class StudentDashboardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>()

  currentUser: User | null = null
  stages: Stage[] = []
  existingRapport: Rapport | null = null
  loading = true
  submittingReport = false
  selectedFile: File | null = null
  currentDate = new Date()

  stats = {
    total: 0,
    enAttente: 0,
    valides: 0,
    refuses: 0,
    enCours: 0,
    termines: 0,
  }

  emptyStateActions: EmptyStateAction[] = [
    {
      label: "Créer ma première demande",
      icon: "bi-plus-circle",
      variant: "primary",
      action: () => {
        // Navigation will be handled by router
      },
    },
  ]

  constructor(
    private stageService: StageService,
    private authService: AuthService,
    private notificationService: NotificationService,
  ) {
    this.currentUser = this.authService.getCurrentUser()
  }

  ngOnInit(): void {
    this.loadData()
    this.animateElements()
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  private loadData(): void {
    this.loading = true

    this.stageService
      .getMyStages()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (stages) => {
          this.stages = stages || []
          this.calculateStats()
          this.loadExistingRapport()
          this.loading = false
        },
        error: (error) => {
          this.loading = false
          this.notificationService.error(
            "Erreur de chargement",
            "Impossible de charger vos données. Veuillez réessayer.",
          )
          console.error("Error loading stages:", error)
        },
      })
  }

  private loadExistingRapport(): void {
    const currentStage = this.getCurrentStage()
    if (currentStage) {
      this.stageService
        .getExistingRapport(currentStage.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (rapport) => {
            this.existingRapport = rapport
          },
          error: () => {
            this.existingRapport = null
          },
        })
    }
  }

  private calculateStats(): void {
    this.stats = {
      total: this.stages.length,
      enAttente: this.stages.filter((s) => s.etat === EtatStage.EN_ATTENTE_VALIDATION).length,
      valides: this.stages.filter((s) => s.etat === EtatStage.ACCEPTE || s.etat === EtatStage.RAPPORT_SOUMIS).length,
      refuses: this.stages.filter((s) => s.etat === EtatStage.REFUSE).length,
      enCours: this.stages.filter((s) => s.etat === EtatStage.EN_COURS).length,
      termines: this.stages.filter((s) => s.etat === EtatStage.TERMINE).length,
    }
  }

  private animateElements(): void {
    setTimeout(() => {
      const cards = document.querySelectorAll(".stat-card")
      cards.forEach((card, index) => {
        setTimeout(() => {
          card.classList.add("animate-slideInUp")
        }, index * 150)
      })
    }, 100)
  }

  getCurrentStage(): Stage | null {
    const activeStages = this.stages.filter((stage) =>
      [EtatStage.EN_ATTENTE_VALIDATION, EtatStage.ACCEPTE, EtatStage.EN_COURS, EtatStage.RAPPORT_SOUMIS].includes(
        stage.etat,
      ),
    )
    return activeStages.length > 0 ? activeStages[0] : null
  }

  canRequestNewStage(): boolean {
    const activeStages = this.stages.filter((stage) => ["EN_ATTENTE", "VALIDE", "EN_COURS"].includes(stage.etat))
    return activeStages.length === 0
  }

  canSubmitReport(): boolean {
    const current = this.getCurrentStage()
    if (!current) return false

    return [EtatStage.ACCEPTE, EtatStage.EN_COURS, EtatStage.RAPPORT_SOUMIS].includes(current.etat)
  }

  canDownloadDocuments(): boolean {
    const currentStage = this.getCurrentStage()
    if (!currentStage) return false

    return [EtatStage.ACCEPTE, EtatStage.EN_COURS, EtatStage.TERMINE, EtatStage.RAPPORT_SOUMIS].includes(
      currentStage.etat,
    )
  }

  getStatusText(status: EtatStage): string {
    const statusMap: Record<EtatStage, string> = {
      [EtatStage.DEMANDE]: "Demande créée",
      [EtatStage.EN_ATTENTE_VALIDATION]: "En attente de validation",
      [EtatStage.VALIDATION_EN_COURS]: "Validation en cours",
      [EtatStage.ACCEPTE]: "Validé par l'encadrant",
      [EtatStage.REFUSE]: "Refusé",
      [EtatStage.EN_COURS]: "Stage en cours",
      [EtatStage.TERMINE]: "Stage terminé",
      [EtatStage.RAPPORT_SOUMIS]: "Rapport soumis",
    }
    return statusMap[status] || status
  }

  getStatusBadgeClass(status: EtatStage): string {
    const classMap: Record<EtatStage, string> = {
      [EtatStage.DEMANDE]: "badge-neutral",
      [EtatStage.EN_ATTENTE_VALIDATION]: "badge-warning",
      [EtatStage.VALIDATION_EN_COURS]: "badge-accent",
      [EtatStage.ACCEPTE]: "badge-success",
      [EtatStage.REFUSE]: "badge-error",
      [EtatStage.EN_COURS]: "badge-primary",
      [EtatStage.TERMINE]: "badge-secondary",
      [EtatStage.RAPPORT_SOUMIS]: "badge-info",
    }
    return classMap[status] || "badge-secondary"
  }

  getProgressPercentage(status: string): number {
    if (this.stats.total === 0) return 0
    const count = this.stats[status as keyof typeof this.stats] as number
    return (count / this.stats.total) * 100
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0]
    if (!file) return

    // Validation du fichier
    if (file.type !== "application/pdf") {
      this.notificationService.error("Format non supporté", "Seuls les fichiers PDF sont acceptés.")
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      this.notificationService.error("Fichier trop volumineux", "Le fichier ne doit pas dépasser 10MB.")
      return
    }

    this.selectedFile = file
    this.notificationService.success("Fichier sélectionné", `${file.name} est prêt à être soumis.`)
  }

  removeSelectedFile(): void {
    this.selectedFile = null
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    if (fileInput) {
      fileInput.value = ""
    }
  }

  submitReport(): void {
    const currentStage = this.getCurrentStage()
    if (!currentStage || !this.selectedFile) {
      this.notificationService.error("Erreur de soumission", "Aucun fichier sélectionné ou stage non trouvé.")
      return
    }

    this.submittingReport = true

    this.stageService
      .submitRapport(currentStage.id, this.selectedFile)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.submittingReport = false
          this.selectedFile = null

          this.notificationService.success(
            "Rapport soumis",
            "Votre rapport a été soumis avec succès et sera examiné par votre encadrant.",
          )

          this.loadData()
        },
        error: (error) => {
          this.submittingReport = false
          this.notificationService.error(
            "Erreur de soumission",
            "Une erreur est survenue lors de la soumission de votre rapport.",
          )
          console.error("Error submitting report:", error)
        },
      })
  }

  downloadConvention(stageId: number): void {
    this.stageService
      .downloadConvention(stageId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (blob) => {
          this.downloadFile(blob, `convention_stage_${stageId}.pdf`)
          this.notificationService.success("Téléchargement réussi", "La convention de stage a été téléchargée.")
        },
        error: () => {
          this.notificationService.error("Erreur de téléchargement", "Impossible de télécharger la convention.")
        },
      })
  }

  downloadAssurance(stageId: number): void {
    this.stageService
      .downloadAssurance(stageId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (blob) => {
          this.downloadFile(blob, `assurance_stage_${stageId}.pdf`)
          this.notificationService.success("Téléchargement réussi", "L'attestation d'assurance a été téléchargée.")
        },
        error: () => {
          this.notificationService.error(
            "Erreur de téléchargement",
            "Impossible de télécharger l'attestation d'assurance.",
          )
        },
      })
  }

  downloadExistingReport(): void {
    if (this.existingRapport?.cloudinaryUrl) {
      window.open(this.existingRapport.cloudinaryUrl, "_blank")
    } else {
      this.notificationService.error(
        "Rapport indisponible",
        "Le lien de téléchargement du rapport n'est pas disponible.",
      )
    }
  }

  private downloadFile(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  triggerFileInput(): void {
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    fileInput?.click()
  }
}
