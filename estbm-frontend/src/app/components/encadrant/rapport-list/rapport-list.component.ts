

// import { Component, OnInit } from "@angular/core"
// import { CommonModule } from "@angular/common"
// import { FormsModule } from "@angular/forms"
// import { RouterModule } from "@angular/router"
// import { StageService } from "../../../services/stage.service"
// import { ToastService } from "../../../services/toast.service"
// import { NavbarComponent } from "../../shared/navbar/navbar.component"
// import { Rapport } from "../../../models/stage.model"

// @Component({
//   selector: "app-rapport-list",
//   standalone: true,
//   imports: [CommonModule, FormsModule, RouterModule, NavbarComponent],
//   templateUrl: './rapport-list.component.html',
//   styleUrls: ['./rapport-list.component.scss']
// })
// export class RapportListComponent implements OnInit {
//   rapports: Rapport[] = []
//   filteredRapports: Rapport[] = []
//   commentaires: { [key: number]: string } = {}
//   loading = false
//   searchTerm = ""
//   statusFilter = ""

//   constructor(
//     private stageService: StageService,
//     private toastService: ToastService
//   ) {}

//   ngOnInit(): void {
//     this.loadRapports()
    
//     // Animation cascade
//     setTimeout(() => {
//       this.animateElements();
//     }, 100);
//   }

//   loadRapports(): void {
//     this.loading = true
//     this.stageService.getRapportsForEncadrant().subscribe({
//       next: (rapports) => {
//         this.rapports = rapports
//         this.filteredRapports = [...rapports]
//         this.loading = false
//       },
//       error: (error) => {
//         this.loading = false
//         this.toastService.error("Erreur lors du chargement des rapports")
//         console.error("Erreur lors du chargement des rapports:", error)
//       },
//     })
//   }

//   filterRapports(): void {
//     this.filteredRapports = this.rapports.filter(rapport => {
//       const matchesSearch = !this.searchTerm || 
//         rapport.nom.toLowerCase().includes(this.searchTerm.toLowerCase());
      
//       const matchesStatus = !this.statusFilter || rapport.etat === this.statusFilter;
      
//       return matchesSearch && matchesStatus;
//     });
//   }

//   getStatusClass(etat: string): string {
//     const classMap: { [key: string]: string } = {
//       "EN_ATTENTE": "badge-warning",
//       "VALIDE": "badge-success",
//       "REFUSE": "badge-error"
//     };
//     return classMap[etat] || "badge-secondary";
//   }

//   getStatusText(etat: string): string {
//     const statusMap: { [key: string]: string } = {
//       "EN_ATTENTE": "En attente",
//       "VALIDE": "Validé",
//       "REFUSE": "Refusé"
//     };
//     return statusMap[etat] || etat;
//   }

//   downloadReport(rapport: Rapport): void {
//     if (rapport.data) {
//       const url = window.URL.createObjectURL(rapport.data)
//       const a = document.createElement("a")
//       a.href = url
//       a.download = rapport.nom
//       a.click()
//       window.URL.revokeObjectURL(url)
//     } else {
//       this.stageService.downloadRapport(rapport.id).subscribe({
//         next: (blob) => {
//           const url = window.URL.createObjectURL(blob)
//           const a = document.createElement("a")
//           a.href = url
//           a.download = rapport.nom
//           a.click()
//           window.URL.revokeObjectURL(url)
//           this.toastService.success("Rapport téléchargé avec succès")
//         },
//         error: (error) => {
//           this.toastService.error("Erreur lors du téléchargement du rapport")
//           console.error("Erreur lors du téléchargement:", error)
//         },
//       })
//     }
//   }

//   validateReport(rapportId: number): void {
//     const commentaire = this.commentaires[rapportId] || ""
//     this.stageService.validateRapport(rapportId, commentaire).subscribe({
//       next: (updatedRapport) => {
//         this.loadRapports()
//         this.commentaires[rapportId] = ""
//         this.toastService.success("Rapport validé avec succès!")
//       },
//       error: (error) => {
//         this.toastService.error("Erreur lors de la validation du rapport")
//         console.error("Erreur lors de la validation:", error)
//       },
//     })
//   }

//   rejectReport(rapportId: number): void {
//     const commentaire = this.commentaires[rapportId]
//     if (!commentaire) {
//       this.toastService.warning("Veuillez ajouter un commentaire pour justifier le rejet.")
//       return
//     }

//     this.stageService.rejectRapport(rapportId, commentaire).subscribe({
//       next: (updatedRapport) => {
//         this.loadRapports()
//         this.commentaires[rapportId] = ""
//         this.toastService.success("Rapport rejeté avec succès!")
//       },
//       error: (error) => {
//         this.toastService.error("Erreur lors du rejet du rapport")
//         console.error("Erreur lors du rejet:", error)
//       },
//     })
//   }

//   private animateElements(): void {
//     const items = document.querySelectorAll('.rapport-item');
//     items.forEach((item, index) => {
//       setTimeout(() => {
//         item.classList.add('animate-slideInFromBottom');
//       }, index * 100);
//     });
//   }
// }


import { Component, OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { RouterModule } from "@angular/router"
import { StageService } from "../../../services/stage.service"
import { ToastService } from "../../../services/toast.service"
import { NavbarComponent } from "../../shared/navbar/navbar.component"
import { Rapport } from "../../../models/stage.model"

@Component({
  selector: "app-rapport-list",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NavbarComponent],
  templateUrl: './rapport-list.component.html',
  styleUrls: ['./rapport-list.component.scss']
})
export class RapportListComponent implements OnInit {
  rapports: Rapport[] = []
  filteredRapports: Rapport[] = []
  commentaires: { [key: number]: string } = {}
  loading = false
  searchTerm = ""
  statusFilter = ""

  constructor(
    private stageService: StageService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadRapports()

    setTimeout(() => {
      this.animateElements()
    }, 100)
  }

  loadRapports(): void {
    this.loading = true
    this.stageService.getRapportsForEncadrant().subscribe({
      next: (rapports: Rapport[]) => {
        this.rapports = rapports
        this.filteredRapports = [...rapports]
        this.loading = false
      },
      error: (error: any) => {
        this.loading = false
        this.toastService.error("Erreur lors du chargement des rapports")
        console.error("Erreur lors du chargement des rapports:", error)
      }
    })
  }

  filterRapports(): void {
    this.filteredRapports = this.rapports.filter(rapport => {
      const matchesSearch = !this.searchTerm || 
        rapport.nom.toLowerCase().includes(this.searchTerm.toLowerCase())

      const matchesStatus = !this.statusFilter || rapport.etat === this.statusFilter

      return matchesSearch && matchesStatus
    })
  }

  getStatusClass(etat: string): string {
    const classMap: { [key: string]: string } = {
      "EN_ATTENTE": "badge-warning",
      "VALIDE": "badge-success",
      "REFUSE": "badge-error"
    }
    return classMap[etat] || "badge-secondary"
  }

  getStatusText(etat: string): string {
    const statusMap: { [key: string]: string } = {
      "EN_ATTENTE": "En attente",
      "VALIDE": "Validé",
      "REFUSE": "Refusé"
    }
    return statusMap[etat] || etat
  }

downloadReport(rapport: Rapport): void {
  if (!rapport.cloudinaryUrl) {
    this.toastService.error('URL du rapport non disponible');
    return;
  }

  // Solution 100% frontend - contourne tous les problèmes backend
  const downloadLink = document.createElement('a');
  
  // Créer une URL avec paramètre de forçage PDF
  const downloadUrl = `${rapport.cloudinaryUrl}?fl_attachment=rapport.pdf`;
  
  downloadLink.href = downloadUrl;
  downloadLink.target = '_blank';
  downloadLink.download = this.getSafeFileName(rapport.nom || 'rapport_stage');
  
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}

private getSafeFileName(fileName: string): string {
  // Supprime les caractères spéciaux et ajoute .pdf
  let safeName = fileName
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/\s+/g, '_');
  
  if (!safeName.toLowerCase().endsWith('.pdf')) {
    safeName += '.pdf';
  }
  
  return safeName;
}
  // downloadReport(rapport: Rapport): void {
  //   if (rapport.data) {
  //     const url = window.URL.createObjectURL(rapport.data)
  //     const a = document.createElement("a")
  //     a.href = url
  //     a.download = rapport.nom
  //     a.click()
  //     window.URL.revokeObjectURL(url)
  //   } else {
  //     this.stageService.downloadReport(rapport.id).subscribe({
  //       next: (blob: Blob) => {
  //         const url = window.URL.createObjectURL(blob)
  //         const a = document.createElement("a")
  //         a.href = url
  //         a.download = rapport.nom
  //         a.click()
  //         window.URL.revokeObjectURL(url)
  //         this.toastService.success("Rapport téléchargé avec succès")
  //       },
  //       error: (error: any) => {
  //         this.toastService.error("Erreur lors du téléchargement du rapport")
  //         console.error("Erreur lors du téléchargement:", error)
  //       }
  //     })
  //   }
  // }

  validateReport(rapportId: number): void {
    const commentaire = this.commentaires[rapportId] || ""
    this.stageService.validateRapport(rapportId, commentaire).subscribe({
      next: (_: any) => {
        this.loadRapports()
        this.commentaires[rapportId] = ""
        this.toastService.success("Rapport validé avec succès!")
      },
      error: (error: any) => {
        this.toastService.error("Erreur lors de la validation du rapport")
        console.error("Erreur lors de la validation:", error)
      }
    })
  }

  rejectReport(rapportId: number): void {
    const commentaire = this.commentaires[rapportId]
    if (!commentaire) {
      this.toastService.warning("Veuillez ajouter un commentaire pour justifier le rejet.")
      return
    }

    this.stageService.rejectRapport(rapportId, commentaire).subscribe({
      next: (_: any) => {
        this.loadRapports()
        this.commentaires[rapportId] = ""
        this.toastService.success("Rapport rejeté avec succès!")
      },
      error: (error: any) => {
        this.toastService.error("Erreur lors du rejet du rapport")
        console.error("Erreur lors du rejet:", error)
      }
    })
  }

  private animateElements(): void {
    const items = document.querySelectorAll('.rapport-item')
    items.forEach((item, index) => {
      setTimeout(() => {
        item.classList.add('animate-slideInFromBottom')
      }, index * 100)
    })
  }
}
