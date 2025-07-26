// import { Component, type OnInit } from "@angular/core"
// import { CommonModule } from "@angular/common"
// import { RouterModule,  Router } from "@angular/router"
// import  { StageService } from "../../../services/stage.service"
// import  { AuthService } from "../../../services/auth.service"
// import  { ToastService } from "../../../services/toast.service"
// import  { Stage } from "../../../models/stage.model"
// import { NavbarComponent } from "../../shared/navbar/navbar.component"

// @Component({
//   selector: "app-student-dashboard",
//   standalone: true,
//   imports: [CommonModule, RouterModule, NavbarComponent],
//   templateUrl: "./student-dashboard.component.html",
//   styleUrls: ["./student-dashboard.component.css"],
// })
// export class StudentDashboardComponent implements OnInit {
//   stages: Stage[] = []
//   loading = true
//   currentUser: any
//   currentDate = new Date()
//   selectedFile: File | null = null
//   submittingReport = false

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
//     console.log("👤 Current user:", this.currentUser)
//     console.log("🆔 User ID:", this.authService.getUserId())
//     console.log("📧 User email:", this.authService.getUserEmail())

//     this.loadStages()
//   }

//   loadStages(): void {
//     this.loading = true
//     console.log("📋 Loading stages...")

//     this.stageService.getMyStages().subscribe({
//       next: (stages) => {
//         console.log("✅ Loaded stages:", stages)
//         this.stages = stages || []
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

//   getTotalStages(): number {
//     return this.stages.length
//   }

//   getStagesByStatus(status: string): Stage[] {
//     return this.stages.filter((stage) => stage.etat === status)
//   }

//   getCurrentStage(): Stage | null {
//     // Return the most recent stage that is not refused
//     const activeStages = this.stages.filter((stage) => stage.etat !== "REFUSE")
//     return activeStages.length > 0 ? activeStages[0] : null
//   }

//   canRequestNewStage(): boolean {
//     // Allow new request if no current active stage
//     const activeStages = this.stages.filter(
//       (stage) => stage.etat === "EN_ATTENTE" || stage.etat === "VALIDE" || stage.etat === "EN_COURS",
//     )
//     return activeStages.length === 0
//   }

//   canSubmitReport(): boolean {
//     const currentStage = this.getCurrentStage()
//     return currentStage?.etat === "VALIDE" || currentStage?.etat === "EN_COURS"
//   }

//   canDownloadDocuments(): boolean {
//     const currentStage = this.getCurrentStage()
//     return currentStage?.etat === "VALIDE" || currentStage?.etat === "EN_COURS"
//   }

//   getStatusText(status: string): string {
//     const statusMap: { [key: string]: string } = {
//       EN_ATTENTE: "En attente",
//       VALIDE: "Validé",
//       REFUSE: "Refusé",
//       EN_COURS: "En cours",
//       TERMINE: "Terminé",
//       RAPPORT_SOUMIS: "Rapport soumis",
//     }
//     return statusMap[status] || status
//   }

//   getStatusBadgeClass(status: string): string {
//     const classMap: { [key: string]: string } = {
//       EN_ATTENTE: "badge-warning",
//       VALIDE: "badge-success",
//       REFUSE: "badge-danger",
//       EN_COURS: "badge-primary",
//       TERMINE: "badge-secondary",
//       RAPPORT_SOUMIS: "badge-info",
//     }
//     return classMap[status] || "badge-secondary"
//   }

//   triggerFileInput(): void {
//     const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
//     fileInput?.click()
//   }

//   onFileSelected(event: any): void {
//     const file = event.target.files[0]
//     if (file) {
//       // Validate file size (max 10MB)
//       if (file.size > 10 * 1024 * 1024) {
//         this.toastService.error("Le fichier ne doit pas dépasser 10MB")
//         return
//       }

//       // Validate file type
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

//   submitReport(): void {
//     const currentStage = this.getCurrentStage()
//     if (!currentStage || !this.selectedFile) {
//       this.toastService.error("Aucun fichier sélectionné")
//       return
//     }

//     this.submittingReport = true
//     this.stageService.submitRapport(currentStage.id, this.selectedFile).subscribe({
//       next: (rapport) => {
//         this.submittingReport = false
//         this.toastService.success("Rapport soumis avec succès")
//         this.selectedFile = null
//         this.loadStages() // Refresh stages
//       },
//       error: (error) => {
//         this.submittingReport = false
//         this.toastService.error("Erreur lors de la soumission du rapport")
//         console.error("Error submitting report:", error)
//       },
//     })
//   }

//   downloadConvention(stageId: number): void {
//     this.stageService.downloadConvention(stageId).subscribe({
//       next: (blob) => {
//         this.downloadFile(blob, `convention_${stageId}.pdf`)
//         this.toastService.success("Convention téléchargée")
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
//         this.downloadFile(blob, `assurance_${stageId}.pdf`)
//         this.toastService.success("Assurance téléchargée")
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

//   logout(): void {
//     this.authService.logout()
//     this.router.navigate(["/login"])
//   }
// }



import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule, Router } from "@angular/router"
import { StageService } from "../../../services/stage.service"
import { AuthService } from "../../../services/auth.service"
import { ToastService } from "../../../services/toast.service"
import { Stage } from "../../../models/stage.model"
import { NavbarComponent } from "../../shared/navbar/navbar.component"
import { EtatStage } from "../../../models/stage.model"
import { Rapport } from "../../../models/stage.model"
@Component({
  selector: "app-student-dashboard",
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: "./student-dashboard.component.html",
  styleUrls: ["./student-dashboard.component.scss"],
})
export class StudentDashboardComponent implements OnInit {
  existingRapport: Rapport | null = null;
  stages: Stage[] = []
  rapports: any[] = []; 
  loading = true
  currentUser: any
  currentDate = new Date()
  selectedFile: File | null = null
  submittingReport = false
  
  // Dashboard statistics
  stats = {
    total: 0,
    enAttente: 0,
    valides: 0,
    refuses: 0,
    enCours: 0,
    termines: 0
  }

  constructor(
    private stageService: StageService,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService,
  ) {
    this.currentUser = this.authService.getCurrentUser()
  }

  ngOnInit(): void {
    console.log("🚀 StudentDashboard initialized")
    this.loadStages()
    
    // Animation cascade pour les éléments
    setTimeout(() => {
      this.animateElements()
    }, 100)
  }


  // loadStages(): void {
  //   this.loading = true

  //   this.stageService.getMyStages().subscribe({
  //     next: (stages) => {
  //       console.log("✅ Loaded stages:", stages)
  //       this.stages = stages || []
  //       this.calculateStats()
  //       const currentStage = this.getCurrentStage();
  //       if (currentStage && this.canSubmitReport()) {
  //         this.loadExistingRapport(currentStage.id);
  //       }
  //       this.loading = false
  //     },
  //     error: (error) => {
  //       console.error("❌ Error loading stages:", error)
  //       this.toastService.error("Erreur lors du chargement de vos stages: " + error.message)
  //       this.stages = []
  //       this.loading = false
  //     },
  //   })
  // }


  loadExistingRapport(stageId: number): void {
    this.stageService.getExistingRapport(stageId).subscribe({
      next: (rapport) => {
        this.existingRapport = rapport;
        console.log("📄 Existing rapport:", rapport);
      },
      error: (error) => {
        console.error("❌ Error loading existing rapport:", error);
        this.existingRapport = null;
      }
    });
  }

  loadStages(): void {
    this.loading = true

    this.stageService.getMyStages().subscribe({
      next: (stages) => {
        console.log("✅ Loaded stages:", stages)
        this.stages = stages || []
        this.calculateStats()

        this.loading = false
      },
      error: (error) => {
        console.error("❌ Error loading stages:", error)
        this.toastService.error("Erreur lors du chargement de vos stages: " + error.message)
        this.stages = []
        this.loading = false
      },
    })
  }

  calculateStats(): void {
  this.stats = {
    total: this.stages.length,
    enAttente: this.stages.filter(s => s.etat === EtatStage.EN_ATTENTE_VALIDATION).length,
    valides: this.stages.filter(s => 
        s.etat === EtatStage.ACCEPTE || 
        s.etat === EtatStage.RAPPORT_SOUMIS).length,  // Inclure les rapports soumis
    refuses: this.stages.filter(s => s.etat === EtatStage.REFUSE).length,
    enCours: this.stages.filter(s => s.etat === EtatStage.EN_COURS).length,
    termines: this.stages.filter(s => s.etat === EtatStage.TERMINE).length
  }
}

//   calculateStats(): void {
//     this.stats = {
//   total: this.stages.length,
//   enAttente: this.stages.filter(s => s.etat === EtatStage.EN_ATTENTE_VALIDATION).length,
//   valides: this.stages.filter(s => s.etat === EtatStage.ACCEPTE).length,
//   refuses: this.stages.filter(s => s.etat === EtatStage.REFUSE).length,
//   enCours: this.stages.filter(s => s.etat === EtatStage.EN_COURS).length,
//   termines: this.stages.filter(s => s.etat === EtatStage.TERMINE).length,
// }
//   }

  animateElements(): void {
    const cards = document.querySelectorAll('.stat-card')
    cards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add('animate-slideInFromBottom')
      }, index * 150)
    })
  }

  getCurrentStage(): Stage | null {
  const activeStages = this.stages.filter((stage) => 
    [
      EtatStage.EN_ATTENTE_VALIDATION, 
      EtatStage.ACCEPTE, 
      EtatStage.EN_COURS,
      EtatStage.RAPPORT_SOUMIS // Ajouter cet état
    ].includes(stage.etat)
  );
  return activeStages.length > 0 ? activeStages[0] : null;
}

  canRequestNewStage(): boolean {
    const activeStages = this.stages.filter(
      (stage) => ['EN_ATTENTE', 'VALIDE', 'EN_COURS'].includes(stage.etat)
    )
    return activeStages.length === 0
  }

  // canSubmitReport(): boolean {
  //   const currentStage = this.getCurrentStage()
  //   return currentStage?.etat === "VALIDE" || currentStage?.etat === "EN_COURS"
  // }

//   canSubmitReport(): boolean {
//   const current = this.getCurrentStage();
//   if (!current) return false;

//   const isEtatOk =
//     current.etat === 'ACCEPTE'
//     || current.etat === 'EN_COURS';

//   return isEtatOk && this.rapports.length === 0;
// }


canSubmitReport(): boolean {
    const current = this.getCurrentStage();
    if (!current) return false;

    const isEtatOk = current.etat === EtatStage.ACCEPTE || 
                      current.etat === EtatStage.EN_COURS ||
                      current.etat === EtatStage.RAPPORT_SOUMIS;

    return isEtatOk;
  }



canDownloadDocuments(): boolean {
  const currentStage = this.getCurrentStage();
  if (!currentStage) return false;
  
  return [
    EtatStage.ACCEPTE,
    EtatStage.EN_COURS,
    EtatStage.TERMINE,
    EtatStage.RAPPORT_SOUMIS // Ajouter cet état
  ].includes(currentStage.etat);
}


getStatusText(status: EtatStage): string {
  const statusMap: Record<EtatStage, string> = {
    [EtatStage.DEMANDE]: 'Demande créée',
    [EtatStage.EN_ATTENTE_VALIDATION]: 'En attente de validation',
    [EtatStage.VALIDATION_EN_COURS]: 'Validation en cours',
    [EtatStage.ACCEPTE]: 'Validé par l’encadrant',
    [EtatStage.REFUSE]: 'Refusé',
    [EtatStage.EN_COURS]: 'Stage en cours',
    [EtatStage.TERMINE]: 'Stage terminé',
    [EtatStage.RAPPORT_SOUMIS]: 'Rapport soumis'
  };

  return statusMap[status] || status;
}

getStatusBadgeClass(status: EtatStage): string {
  const classMap: Record<EtatStage, string> = {
    [EtatStage.DEMANDE]: "badge-neutral",
    [EtatStage.EN_ATTENTE_VALIDATION]: "badge-warning",
    [EtatStage.VALIDATION_EN_COURS]: "badge-accent",
    [EtatStage.ACCEPTE]: "badge-success",  // Doit correspondre à "ACCEPTE" sans accent
    [EtatStage.REFUSE]: "badge-error",
    [EtatStage.EN_COURS]: "badge-primary",
    [EtatStage.TERMINE]: "badge-secondary",
    [EtatStage.RAPPORT_SOUMIS]: "badge-info"
  };
  return classMap[status] || "badge-secondary";
}


  getProgressPercentage(status: string): number {
    if (this.stats.total === 0) return 0
    const count = this.stats[status as keyof typeof this.stats] as number
    return (count / this.stats.total) * 100
  }

  triggerFileInput(): void {
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    fileInput?.click()
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        this.toastService.error("Le fichier ne doit pas dépasser 10MB")
        return
      }

      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ]
      if (!allowedTypes.includes(file.type)) {
        this.toastService.error("Format de fichier non supporté. Utilisez PDF, DOC ou DOCX")
        return
      }

      this.selectedFile = file
    }
  }

  

  removeSelectedFile(): void {
    this.selectedFile = null
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    if (fileInput) {
      fileInput.value = ""
    }
  }


   submitReport(): void {
    const currentStage = this.getCurrentStage();
    if (!currentStage || !this.selectedFile) {
      this.toastService.error("Aucun fichier sélectionné");
      return;
    }

    // Validation du fichier
    if (this.selectedFile.type !== 'application/pdf') {
      this.toastService.error("Seuls les fichiers PDF sont acceptés");
      return;
    }

    if (this.selectedFile.size > 10 * 1024 * 1024) {
      this.toastService.error("Le fichier est trop volumineux (max 10MB)");
      return;
    }

    this.submittingReport = true;
    this.stageService.submitRapport(currentStage.id, this.selectedFile).subscribe({
      next: () => {
        this.submittingReport = false;
        this.toastService.success("Rapport soumis avec succès");
        this.selectedFile = null;
        this.loadStages();
        this.loadExistingRapport(currentStage.id); // Recharger le rapport
      },
      error: (error) => {
        this.submittingReport = false;
        this.toastService.error("Erreur lors de la soumission du rapport");
        console.error("Error submitting report:", error);
      },
    });
  }

//   submitReport(): void {
//   const currentStage = this.getCurrentStage()
//   if (!currentStage || !this.selectedFile) {
//     this.toastService.error("Aucun fichier sélectionné")
//     return
//   }

//   // Validation du fichier
//   if (this.selectedFile.type !== 'application/pdf') {
//     this.toastService.error("Seuls les fichiers PDF sont acceptés")
//     return
//   }

//   if (this.selectedFile.size > 10 * 1024 * 1024) { // 10MB
//     this.toastService.error("Le fichier est trop volumineux (max 10MB)")
//     return
//   }

//   this.submittingReport = true
//   this.stageService.submitRapport(currentStage.id, this.selectedFile).subscribe({
//     next: () => {
//       this.submittingReport = false
//       this.toastService.success("Rapport soumis avec succès")
//       this.selectedFile = null
//       this.loadStages()
//     },
//     error: (error) => {
//       this.submittingReport = false
//       this.toastService.error("Erreur lors de la soumission du rapport")
//       console.error("Error submitting report:", error)
//     },
//   })
// }

  downloadConvention(stageId: number): void {
    this.stageService.downloadConvention(stageId).subscribe({
      next: (blob) => {
        this.downloadFile(blob, `convention_stage_${stageId}.pdf`)
        this.toastService.success("Convention téléchargée avec succès")
      },
      error: (error) => {
        this.toastService.error("Erreur lors du téléchargement de la convention")
        console.error("Error downloading convention:", error)
      },
    })
  }

  downloadAssurance(stageId: number): void {
    this.stageService.downloadAssurance(stageId).subscribe({
      next: (blob) => {
        this.downloadFile(blob, `assurance_stage_${stageId}.pdf`)
        this.toastService.success("Attestation d'assurance téléchargée")
      },
      error: (error) => {
        this.toastService.error("Erreur lors du téléchargement de l'assurance")
        console.error("Error downloading assurance:", error)
      },
    })
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

  downloadExistingReport(): void {
  if (this.existingRapport && this.existingRapport.cloudinaryUrl) {
    window.open(this.existingRapport.cloudinaryUrl, '_blank');
  } else {
    this.toastService.error("URL du rapport non disponible");
  }
}
}