

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { StageService } from '../../../services/stage.service';
import { ToastService } from '../../../services/toast.service';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { User } from '../../../models/user.model';
import { Stage, Rapport } from '../../../models/stage.model';
import { HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { DecisionDto } from '../../../models/stage.model';


@Component({
  selector: 'app-encadrant-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './encadrant-dashboard.component.html',
  styleUrls: ['./encadrant-dashboard.component.scss']
})
export class EncadrantDashboardComponent implements OnInit {
  currentUser: User | null = null;
  stages: Stage[] = [];
  rapports: Rapport[] = [];
  loading = false;
  loadingRapports = false;
  currentDate = new Date();


  

  // Dashboard statistics
  stats = {
    total: 0,
    enAttente: 0,
    valides: 0,
    refuses: 0,
    enCours: 0,
    termines: 0,
    totalRapports: 0
  };
  demandes: Stage[] = [];      // <— nouveau
  loadingDemandes = true;     //

  constructor(
    private authService: AuthService,
    private stageService: StageService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadDemandes();        // <— appel au démarrage
    this.currentUser = this.authService.getCurrentUser();
    this.loadStages();
    this.loadRapports();
    // this.stageService.getMesDemandes().subscribe({
    //   next: (data) => {
    //     this.stages = data;
    //   },
    //   error: (err) => {
    //     console.error('Erreur récupération stages :', err);
    //   }
    // });
    
    // Animation cascade pour les éléments
    setTimeout(() => {
      this.animateElements();
    }, 100);
  }
     loadDemandes(): void {
    this.loadingDemandes = true;
    this.stageService.getMesDemandes().subscribe({
      next: (list) => {
        this.demandes = list;
        this.loadingDemandes = false;
        this.calculateStats();
      },
      error: (err) => {
        this.loadingDemandes = false;
        console.error("Erreur chargement demandes :", err);
        this.toastService.error("Impossible de charger vos demandes");
      }
    });
  }


  loadStages(): void {
    this.loading = true;
    this.stageService.getMyAssignedStages().subscribe({
      next: (stages) => {
        this.stages = stages;
        this.calculateStats();
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
      next: list => {
        this.rapports = list;
        this.loadingRapports = false;
      },
      error: err => {
        this.loadingRapports = false;
        this.toastService.error('Impossible de charger les rapports');
      }
    });
  }

  calculateStats(): void {
  this.stats = {
    total: this.stages.length,
    enAttente: this.stages.filter(s => 
        s.etat === 'DEMANDE' || 
        s.etat === 'EN_ATTENTE_VALIDATION' || 
        s.etat === 'VALIDATION_EN_COURS').length,
    valides: this.stages.filter(s => 
        s.etat === 'ACCEPTE' ||  // Utiliser 'ACCEPTE'
        s.etat === 'RAPPORT_SOUMIS').length,
    refuses: this.stages.filter(s => s.etat === 'REFUSE').length,
    enCours: this.stages.filter(s => s.etat === 'EN_COURS').length,
    termines: this.stages.filter(s => s.etat === 'TERMINE').length,
    totalRapports: this.rapports.length
  };
}

  animateElements(): void {
    const cards = document.querySelectorAll('.stat-card');
    cards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add('animate-slideInFromBottom');
      }, index * 150);
    });
  }

  getTotalStages(): number {
    return this.stages.length;
  }

  getTotalRapports(): number {
    return this.rapports.length;
  }

  getStagesByStatus(statusKey: string): Stage[] {
  let statuses: string[] = [];
  
  switch(statusKey) {
    case 'EN_ATTENTE':
      statuses = ['DEMANDE', 'EN_ATTENTE_VALIDATION', 'VALIDATION_EN_COURS'];
      break;
    case 'VALIDE':
      statuses = ['ACCEPTE', 'RAPPORT_SOUMIS'];  // Utiliser 'ACCEPTE'
      break;
    case 'REFUSE':
      statuses = ['REFUSE'];
      break;
    default:
      statuses = [statusKey];
  }
  
  return this.stages.filter(s => statuses.includes(s.etat));
}

  getRecentRapports(): Rapport[] {
    return this.rapports.slice(0, 5);
  }

  getValidationPercentage(status: string): number {
    const total = this.getTotalStages();
    if (total === 0) return 0;
    return (this.getStagesByStatus(status).length / total) * 100;
  }

  getProgressPercentage(status: string): number {
    if (this.stats.total === 0) return 0;
    const count = this.stats[status as keyof typeof this.stats] as number;
    return (count / this.stats.total) * 100;
  }

  // Mettre à jour les fonctions getStatusText et getStatusBadgeClass
// Mettre à jour les fonctions getStatusText et getStatusBadgeClass
getStatusText(status: string): string {
  const statusMap: { [key: string]: string } = {
    'DEMANDE': 'Demande créée',
    'EN_ATTENTE_VALIDATION': 'En attente de validation',
    'VALIDATION_EN_COURS': 'Validation en cours',
    'ACCEPTE': 'Validé', // Changer de 'VALIDE' à 'ACCEPTE'
    'REFUSE': 'Refusé',
    'EN_COURS': 'En cours',
    'TERMINE': 'Terminé',
    'RAPPORT_SOUMIS': 'Rapport soumis'
  };
  return statusMap[status] || status;
}

getStatusBadgeClass(status: string): string {
  const classMap: { [key: string]: string } = {
    'DEMANDE': 'badge-neutral',
    'EN_ATTENTE_VALIDATION': 'badge-warning',
    'VALIDATION_EN_COURS': 'badge-accent',
    'ACCEPTE': 'badge-success', // Changer de 'VALIDE' à 'ACCEPTE'
    'REFUSE': 'badge-error',
    'EN_COURS': 'badge-primary',
    'TERMINE': 'badge-secondary',
    'RAPPORT_SOUMIS': 'badge-info'
  };
  return classMap[status] || 'badge-secondary';
}

  // approveStage(stageId: number): void {
  //   const note = prompt('Note optionnelle pour l\'approbation:');
  //   this.stageService.approveStage(stageId, note || undefined).subscribe({
  //     next: (stage) => {
  //       this.toastService.success('Stage approuvé avec succès');
  //       this.loadStages();
  //     },
  //     error: (error) => {
  //       this.toastService.error('Erreur lors de l\'approbation du stage');
  //       console.error('Error approving stage:', error);
  //     }
  //   });
  // }

//  // src/app/components/encadrant-dashboard/encadrant-dashboard.component.ts
// approveDemande(stageId: number): void {
//   const dto: DecisionDto = { idStage: stageId, approuver: true };
//   this.stageService.approveDecision(dto).subscribe({
//     next: (msg) => {
//       this.toastService.success(msg);
//       this.loadDemandes();   // recharge la liste
//     },
//     error: (err) => {
//       this.toastService.error("Erreur lors de l'approbation");
//       console.error("Error decision:", err);
//     }
//   });
// }




//  rejectDemande(stageId: number): void {
//   // On choisit une raison fixe ou récupérée ailleurs (pas de prompt)
//   const raison = "Refus standard"; // ou une valeur issue d'un formulaire
//   this.stageService.rejectStage(stageId, raison).subscribe({
//     next: (msg) => {
//       this.toastService.success(msg);
//       this.loadDemandes();    // recharge la liste des demandes
//     },
//     error: (err) => {
//       this.toastService.error("Erreur lors du rejet du stage");
//       console.error("Error rejecting stage:", err);
//     }
//   });
// }



// Dans votre composant

approveDemande(stageId: number): void {
  const dto: DecisionDto = { idStage: stageId, approuver: true };
  
  this.stageService.approveDecision(dto).subscribe({
    next: (msg) => {
      this.toastService.success(msg); // Utilisez directement la réponse texte
      this.loadDemandes();
    },
    error: (err) => {
      this.toastService.error("Erreur lors de l'approbation");
      console.error("Error decision:", err);
    }
  });
}

rejectDemande(stageId: number): void {
  const raison = "Refus standard";
  
  this.stageService.rejectStage(stageId, raison).subscribe({
    next: (msg) => {
      this.toastService.success(msg); // Utilisez directement la réponse texte
      this.loadDemandes();
    },
    error: (err) => {
      this.toastService.error("Erreur lors du rejet du stage");
      console.error("Error rejecting stage:", err);
    }
  });
}


// downloadReport(rapport: Rapport): void {
//   this.stageService.downloadReport(rapport.id).subscribe({
//     next: (blob: Blob) => {
//       const filename = rapport.nom  // ou rapport.nomFichier si votre interface l’a
//         ? rapport.nom
//         : `rapport_${rapport.id}.pdf`;

//       this.downloadFile(blob, filename);
//       this.toastService.success('Rapport téléchargé avec succès');
//     },
//     error: (err: any) => {
//       this.toastService.error('Erreur lors du téléchargement du rapport');
//       console.error('Error downloading report:', err);
//     }
//   });
// }



// downloadReport(rapport: Rapport): void {
//   this.stageService.getRapportUrl(rapport.stageId).subscribe({ // Utilisez stageId au lieu de stage
//     next: (url: string) => {
//       window.open(url, '_blank');
//       this.toastService.success('Rapport ouvert dans un nouvel onglet');
//     },
//     error: (err: HttpErrorResponse) => {
//       console.error('Error getting report URL:', err);
      
//       if (err.status === 401) {
//         this.toastService.error('Session expirée. Veuillez vous reconnecter.');
//         this.authService.logout();
//       } else if (err.status === 404) {
//         this.toastService.error('Rapport non trouvé');
//       } else {
//         this.toastService.error('Erreur lors de la récupération du rapport');
//       }
//     }
//   });
// }


// downloadReport(rapport: Rapport): void {
//   if (!rapport.cloudinaryUrl) {
//     this.toastService.error('URL du rapport non disponible');
//     return;
//   }

//   // Créer un lien de téléchargement direct
//   const downloadLink = document.createElement('a');
//   downloadLink.href = rapport.cloudinaryUrl;
//   downloadLink.target = '_blank';
//   downloadLink.download = rapport.nom || 'rapport_stage.pdf';
  
//   // Déclenchez le téléchargement
//   document.body.appendChild(downloadLink);
//   downloadLink.click();
//   document.body.removeChild(downloadLink);
// }

downloadReport(rapport: Rapport): void {
  if (!rapport.cloudinaryUrl) {
    this.toastService.error('URL du rapport non disponible');
    return;
  }

  // Créer un lien de téléchargement direct
  const downloadLink = document.createElement('a');
  
  // Ajouter un timestamp pour éviter la mise en cache
  const uniqueUrl = `${rapport.cloudinaryUrl}?t=${new Date().getTime()}`;
  
  // Forcer le téléchargement avec le bon nom de fichier
  downloadLink.href = uniqueUrl;
  downloadLink.download = this.getSafeFileName(rapport.nom || 'rapport_stage');
  
  // Ouvrir dans un nouvel onglet
  downloadLink.target = '_blank';
  
  // Déclencher le téléchargement
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}



private getSafeFileName(fileName: string): string {
  // Supprimer les caractères spéciaux
  let safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
  
  // Ajouter l'extension .pdf si manquante
  if (!safeName.toLowerCase().endsWith('.pdf')) {
    safeName += '.pdf';
  }
  
  return safeName;
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