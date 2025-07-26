// // import { Component, type OnInit } from "@angular/core"
// // import { CommonModule } from "@angular/common"
// // import { FormsModule } from "@angular/forms"
// // import { RouterModule } from "@angular/router"
// // import  { AuthService } from "../../../services/auth.service"
// // import  { StageService } from "../../../services/stage.service"
// // import  { UserService } from "../../../services/user.service"
// // import  { ToastService } from "../../../services/toast.service"
// // import { NavbarComponent } from "../../shared/navbar/navbar.component"
// // import type { User } from "../../../models/user.model"
// // import type { Stage } from "../../../models/stage.model"

// // // Define stats interface
// // interface DashboardStats {
// //   total: number
// //   enAttente: number
// //   valides: number
// //   refuses: number
// //   totalEtudiants?: number
// // }

// // @Component({
// //   selector: "app-admin-dashboard",
// //   standalone: true,
// //   imports: [CommonModule, RouterModule, NavbarComponent, FormsModule],
// //   templateUrl: "./admin-dashboard.component.html",
// //   styleUrls: ["./admin-dashboard.component.css"],
// // })
// // export class AdminDashboardComponent implements OnInit {
// //   currentUser: User | null = null
// //   currentDate = new Date()
// //   loading = false
// //   loadingAssignments = false
// //   creatingAssignment = false
// //   searchTerm = ""
// //   statusFilter = ""
// //   currentPage = 1
// //   pageSize = 10
// //   showAssignmentModal = false

// //   stats: DashboardStats = {
// //     total: 0,
// //     enAttente: 0,
// //     valides: 0,
// //     refuses: 0,
// //     totalEtudiants: 0,
// //   }

// //   stages: Stage[] = []
// //   filteredStages: Stage[] = []
// //   assignments: any[] = []

// //   filiereStats = [
// //     { name: "Génie Informatique", count: 45, percentage: 85 },
// //     { name: "Génie Électrique", count: 32, percentage: 60 },
// //     { name: "Génie Mécanique", count: 28, percentage: 53 },
// //     { name: "Génie Civil", count: 22, percentage: 42 },
// //     { name: "Génie Industriel", count: 18, percentage: 34 },
// //     { name: "Génie Chimique", count: 15, percentage: 28 },
// //   ]

// //   newAssignment = {
// //   etudiantId: 0, // Changer idEtudiant → etudiantId
// //   encadrantId: 0, // Changer idEncadrant → encadrantId
// //   stageId: undefined as number | undefined,
// // }
// //   router: any

// //   constructor(
// //     private authService: AuthService,
// //     private stageService: StageService,
// //     private userService: UserService,
// //     private toastService: ToastService,
// //   ) {}

// //   ngOnInit(): void {
// //     this.currentUser = this.authService.getCurrentUser()
// //     this.loadData()
// //   }


// //   loadStats(): void {
// //     this.stageService.getStageStats().subscribe(stats => {
// //       this.stats = stats;
// //     });
// //   }

// //   loadAssignments(): void {
// //     this.stageService.getAssignments().subscribe(assignments => {
// //       this.assignments = assignments;
// //     });
// //   }

// //   // Modifier la méthode loadData
// // loadData(): void {
// //   this.loading = true;
  
// //   // Charger les statistiques
// //   this.stageService.getStageStats().subscribe({
// //     next: (stats) => {
// //       this.stats = stats;
// //       this.loadStages();
// //     },
// //     error: (error) => {
// //       this.handleError(error, "statistiques");
// //       this.loadStages(); // Tenter quand même de charger les stages
// //     }
// //   });
// // }

// // // Nouvelle méthode pour charger les stages
// // loadStages(): void {
// //   this.stageService.getAllStages().subscribe({
// //     next: (stages) => {
// //       this.stages = stages;
// //       this.filteredStages = [...stages];
// //       this.loading = false;
// //       this.loadAssignments(); // Charger les assignments après les stages
// //     },
// //     error: (error) => {
// //       this.handleError(error, "stages");
// //       this.loading = false;
// //     }
// //   });
// // }

// // // Nouvelle méthode pour gérer les erreurs
// // private handleError(error: any, context: string): void {
// //   console.error(`Error loading ${context}:`, error);
// //   this.toastService.error(`Erreur lors du chargement des ${context}`);
  
// //   if (error.status === 401) {
// //     this.authService.logout();
// //     this.router.navigate(['/login']);
// //   }
// // }
// //     // Load real stages data
   

// //   filterData(): void {
// //     this.filteredStages = this.stages.filter((stage) => {
// //       const matchesSearch =
// //         !this.searchTerm ||
// //         stage.entreprise.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
// //         stage.filiere.toLowerCase().includes(this.searchTerm.toLowerCase())
// //       const matchesStatus = !this.statusFilter || stage.etat === this.statusFilter
// //       return matchesSearch && matchesStatus
// //     })
// //     this.currentPage = 1
// //   }

// //   getPaginatedStages(): Stage[] {
// //     const startIndex = (this.currentPage - 1) * this.pageSize
// //     const endIndex = startIndex + this.pageSize
// //     return this.filteredStages.slice(startIndex, endIndex)
// //   }

// //   getRecentAssignments(): any[] {
// //     return this.assignments.slice(0, 5)
// //   }

// //   getStatusClass(status: string): string {
// //     return status.toLowerCase().replace("_", "-")
// //   }

// //   getStatusText(status: string): string {
// //     const statusMap: { [key: string]: string } = {
// //       EN_ATTENTE: "En attente",
// //       VALIDE: "Validé",
// //       REFUSE: "Refusé",
// //       EN_COURS: "En cours",
// //       TERMINE: "Terminé",
// //     }
// //     return statusMap[status] || status
// //   }

// //   get totalPages(): number {
// //     return Math.ceil(this.filteredStages.length / this.pageSize)
// //   }

// //   previousPage(): void {
// //     if (this.currentPage > 1) {
// //       this.currentPage--
// //     }
// //   }

// //   nextPage(): void {
// //     if (this.currentPage < this.totalPages) {
// //       this.currentPage++
// //     }
// //   }

// //   openAssignmentModal(): void {
// //     this.showAssignmentModal = true
// //   }

// //   closeAssignmentModal(): void {
// //     this.showAssignmentModal = false
// //     this.newAssignment = {
// //       etudiantId: 0,
// //       encadrantId: 0,
// //       stageId: undefined,
// //     }
// //   }

// //   createAssignment(): void {
// //     if (!this.newAssignment.etudiantId || !this.newAssignment.encadrantId) {
// //       this.toastService.error("Veuillez sélectionner un étudiant et un encadrant")
// //       return
// //     }

// //     this.creatingAssignment = true

// //     const assignmentRequest = {
// //   etudiantId: this.newAssignment.etudiantId, // Changer idEtudiant → etudiantId
// //   encadrantId: this.newAssignment.encadrantId, // Changer idEncadrant → encadrantId
// //   stageId: this.newAssignment.stageId,
// // }


// //     this.stageService.assignEncadrant(assignmentRequest).subscribe({
// //       next: (assignment: any) => {
// //         this.creatingAssignment = false
// //         this.toastService.success("Affectation créée avec succès")
// //         this.closeAssignmentModal()
// //         this.loadAssignments()
// //       },
// //       error: (error) => {
// //         this.creatingAssignment = false
// //         this.toastService.error("Erreur lors de la création de l'affectation")
// //         console.error("Error creating assignment:", error)
// //       },
// //     })
// //   }

// //   removeAssignment(assignmentId: number): void {
// //     if (confirm("Êtes-vous sûr de vouloir supprimer cette affectation ?")) {
// //       this.stageService.removeAssignment(assignmentId).subscribe({
// //         next: () => {
// //           this.toastService.success("Affectation supprimée avec succès")
// //           this.loadAssignments()
// //         },
// //         error: (error) => {
// //           this.toastService.error("Erreur lors de la suppression de l'affectation")
// //           console.error("Error removing assignment:", error)
// //         },
// //       })
// //     }
// //   }
// // }


// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { RouterModule } from '@angular/router';
// import { AuthService } from '../../../services/auth.service';
// import { StageService } from '../../../services/stage.service';
// import { UserService } from '../../../services/user.service';
// import { ToastService } from '../../../services/toast.service';
// import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
// import { User } from '../../../models/user.model';
// import { AssignmentRequest, Stage } from '../../../models/stage.model';

// interface DashboardStats {
//   total: number;
//   enAttente: number;
//   valides: number;
//   refuses: number;
//   totalEtudiants?: number;
//   totalEncadrants?: number;
// }

// @Component({
//   selector: 'app-admin-dashboard',
//   standalone: true,
//   imports: [CommonModule, RouterModule, NavbarComponent, FormsModule],
//   templateUrl: './admin-dashboard.component.html',
//   styleUrls: ['./admin-dashboard.component.css']
// })
// export class AdminDashboardComponent implements OnInit {
//   currentUser: User | null = null;
//   currentDate = new Date();
//   loading = false;
//   creatingAssignment = false;
//   searchTerm = "";
//   statusFilter = "";
//   currentPage = 1;
//   pageSize = 10;
//   showAssignmentModal = false;

//   stats: DashboardStats = {
//     total: 0,
//     enAttente: 0,
//     valides: 0,
//     refuses: 0,
//     totalEtudiants: 0,
//     totalEncadrants: 0
//   };

//   stages: Stage[] = [];
//   filteredStages: Stage[] = [];
//   assignments: any[] = [];
//   students: User[] = [];
//   supervisors: User[] = [];

//   newAssignment = {
//   etudiantId: 0,
//   etudiantNom: '',
//   encadrantId: 0,
//   encadrantNom: ''
// };

//   constructor(
//     private authService: AuthService,
//     private stageService: StageService,
//     private userService: UserService,
//     private toastService: ToastService,
//   ) {}

//   ngOnInit(): void {
//     this.currentUser = this.authService.getCurrentUser();
//     this.loadData();
//     this.loadStudents();
//     this.loadSupervisors();
//     // this.loadAssignments(); // Ajouter cette ligne

//   }

//   loadData(): void {
//     this.loading = true;
    
//     this.stageService.getStageStats().subscribe({
//       next: (stats) => {
//         this.stats = stats;
//         this.loadStages();
//       },
//       error: (error) => this.handleError(error, "statistiques")
//     });
//   }

//   loadStages(): void {
//     this.stageService.getAllStages().subscribe({
//       next: (stages) => {
//         this.stages = stages;
//         this.filteredStages = [...stages];
//         this.loadAssignments();
//         this.loading = false;
//       },
//       error: (error) => this.handleError(error, "stages")
//     });
//   }

//   loadAssignments(): void {
//     this.stageService.getAssignments().subscribe(assignments => {
//       this.assignments = assignments;
//     });
//   }

//   loadStudents(): void {
//     this.userService.getStudents().subscribe(students => {
//       this.students = students;
//     });
//   }

//   loadSupervisors(): void {
//     this.userService.getEncadrants().subscribe(supervisors => {
//       this.supervisors = supervisors;
//     });
//   }

//   filterData(): void {
//     this.filteredStages = this.stages.filter(stage => {
//       const matchesSearch = !this.searchTerm || 
//         stage.entreprise.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
//         stage.filiere.toLowerCase().includes(this.searchTerm.toLowerCase());
      
//       const matchesStatus = !this.statusFilter || stage.etat === this.statusFilter;
      
//       return matchesSearch && matchesStatus;
//     });
//     this.currentPage = 1;
//   }

//   getPaginatedStages(): Stage[] {
//     const startIndex = (this.currentPage - 1) * this.pageSize;
//     return this.filteredStages.slice(startIndex, startIndex + this.pageSize);
//   }

//   getRecentAssignments(): any[] {
//     return this.assignments.slice(0, 5);
//   }

//   // getStatusText(status: string): string {
//   //   const statusMap: Record<string, string> = {
//   //     EN_ATTENTE: "En attente",
//   //     VALIDE: "Validé",
//   //     REFUSE: "Refusé",
//   //     EN_COURS: "En cours",
//   //     TERMINE: "Terminé",
//   //   };
//   //   return statusMap[status] || status;
//   // }
//   getStatusText(status: string): string {
//   const statusMap: Record<string, string> = {
//     EN_ATTENTE: "En attente",
//     VALIDE: "Validé",
//     REFUSE: "Refusé",
//     EN_COURS: "En cours",
//     TERMINE: "Terminé",
//   };
//   return statusMap[status?.toUpperCase()] || status?.toLowerCase();
// }


//   get totalPages(): number {
//     return Math.ceil(this.filteredStages.length / this.pageSize);
//   }

//   // createAssignment(): void {
//   //   if (!this.newAssignment.etudiantId || !this.newAssignment.encadrantId) {
//   //     this.toastService.error("Sélectionnez un étudiant et un encadrant");
//   //     return;
//   //   }

//   //   this.creatingAssignment = true;

//   //   this.stageService.assignEncadrant(this.newAssignment as any).subscribe({
//   //     next: () => {
//   //       this.creatingAssignment = false;
//   //       this.toastService.success("Affectation créée avec succès");
//   //       this.closeAssignmentModal();
//   //       this.loadAssignments();
//   //     },
//   //     error: (error) => {
//   //       this.creatingAssignment = false;
//   //       this.toastService.error("Erreur lors de la création");
//   //     }
//   //   });
//   // }
//   createAssignment(): void {
//   if (!this.newAssignment.etudiantId || !this.newAssignment.encadrantId) {
//     this.toastService.error("Sélectionnez un étudiant et un encadrant");
//     return;
//   }

//   // Trouver les noms correspondants aux IDs
//   const student = this.students.find(s => s.id === this.newAssignment.etudiantId);
//   const supervisor = this.supervisors.find(s => s.id === this.newAssignment.encadrantId);

//   if (!student || !supervisor) {
//     this.toastService.error("Étudiant ou encadrant introuvable");
//     return;
//   }

//   const dto: AssignmentRequest = {
//     etudiantId: this.newAssignment.etudiantId,
//     etudiantNom: `${student.prenom} ${student.nom}`,
//     encadrantId: this.newAssignment.encadrantId,
//     encadrantNom: `${supervisor.prenom} ${supervisor.nom}`
//   };

//   this.creatingAssignment = true;

//   this.stageService.assignEncadrant(dto).subscribe({
//     next: () => {
//       this.creatingAssignment = false;
//       this.toastService.success("Affectation créée avec succès");
//       this.closeAssignmentModal();
//       this.loadAssignments();
//     },
//     error: (error) => {
//       this.creatingAssignment = false;
//       this.toastService.error("Erreur lors de la création: " + error.error?.message || error.message);
//     }
//   });
// }

//   removeAssignment(assignmentId: number): void {
//     if (confirm("Supprimer cette affectation ?")) {
//       this.stageService.removeAssignment(assignmentId).subscribe({
//         next: () => {
//           this.toastService.success("Affectation supprimée");
//           this.loadAssignments();
//         },
//         error: (error) => this.toastService.error("Erreur lors de la suppression")
//       });
//     }
//   }

//   //  openAssignmentModal(stage?: Stage) {
//   //   this.newAssignment.stageId = stage?.id;
//   //   this.showAssignmentModal   = true;
//   // }

//   /** Closes the modal and resets the form */
//   closeAssignmentModal() {
//     this.showAssignmentModal = false;
//     this.newAssignment = {
//       etudiantId: 0,
//       encadrantId: 0,
//       encadrantNom:'',
//       etudiantNom:''
//     };
//   }

//   private handleError(error: any, context: string): void {
//     this.toastService.error(`Erreur ${context}: ${error.message}`);
//     if (error.status === 401) this.authService.logout();
//   }
// }


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
import { Stage, AssignmentRequest } from '../../../models/stage.model';
import { ChangeDetectionStrategy } from '@angular/core';

interface DashboardStats {
  totalStages: number;
  enAttente: number;
  valides: number;
  refuses: number;
  totalEtudiants: number;
  totalEncadrants: number;
  totalAdmins: number;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FormsModule],
  templateUrl: './admin-dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  currentUser: User | null = null;
  currentDate = new Date();
  loading = false;
  creatingAssignment = false;
  searchTerm = "";
  statusFilter = "";
  currentPage = 1;
  pageSize = 10;
  showAssignmentModal = false;
  

  stats: DashboardStats = {
    totalStages: 0,
    enAttente: 0,
    valides: 0,
    refuses: 0,
    totalEtudiants: 0,
    totalEncadrants: 0,
    totalAdmins: 0
  };

  stages: Stage[] = [];
  filteredStages: Stage[] = [];
  assignments: any[] = [];
  students: User[] = [];
  supervisors: User[] = [];

  newAssignment = {
    etudiantId: 0,
    etudiantNom: '',
    encadrantId: 0,
    encadrantNom: ''
  };

  // Données pour les graphiques
  chartData = {
    stagesByStatus: [
      { name: 'En attente', value: 0, color: '#f59e0b' },
      { name: 'Validés', value: 0, color: '#10b981' },
      { name: 'Refusés', value: 0, color: '#ef4444' },
      { name: 'En cours', value: 0, color: '#3b82f6' }
    ],
    monthlyTrends: [
      { month: 'Jan', stages: 12, validations: 8 },
      { month: 'Fév', stages: 18, validations: 15 },
      { month: 'Mar', stages: 25, validations: 20 },
      { month: 'Avr', stages: 32, validations: 28 },
      { month: 'Mai', stages: 28, validations: 25 },
      { month: 'Jun', stages: 35, validations: 32 }
    ]
  };

  constructor(
    private authService: AuthService,
    private stageService: StageService,
    private userService: UserService,
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadData();
    this.loadStudents();
    this.loadSupervisors();
    this.loadAssignments() 
    
    // Initialiser les animations
    setTimeout(() => {
      this.animateCharts();
    }, 500);
  }

  loadData(): void {
    this.loading = true;
    
    // Charger les statistiques
    this.stageService.getStageStats().subscribe({
      next: (stats) => {
        this.stats = {
          totalStages: stats.total || 0,
          enAttente: stats.enAttente || 0,
          valides: stats.valides || 0,
          refuses: stats.refuses || 0,
          totalEtudiants: stats.totalEtudiants || 0,
          totalEncadrants: stats.totalEncadrants || 0,
          totalAdmins: stats.totalAdmins || 0
        };
        this.updateChartData();
        this.loadStages();
      },
      error: (error) => this.handleError(error, "statistiques")
    });
  }

  updateChartData(): void {
    this.chartData.stagesByStatus = [
      { name: 'En attente', value: this.stats.enAttente, color: '#f59e0b' },
      { name: 'Validés', value: this.stats.valides, color: '#10b981' },
      { name: 'Refusés', value: this.stats.refuses, color: '#ef4444' },
      { name: 'En cours', value: this.stats.totalStages - this.stats.enAttente - this.stats.valides - this.stats.refuses, color: '#3b82f6' }
    ];
  }

  loadStages(): void {
    this.stageService.getAllStages().subscribe({
      next: (stages) => {
        this.stages = stages;
        this.filteredStages = [...stages];
        this.loading = false;
        // Charger les assignements après avoir chargé les stages
        this.loadAssignments();
      },
      error: (error) => this.handleError(error, "stages")
    });
  }

  loadAssignments(): void {
    this.stageService.getAssignments().subscribe({
      next: (assignments) => {
        this.assignments = assignments;
      },
      error: (error) => {
        console.error('Erreur chargement affectations:', error);
        // Ne pas afficher d'erreur si l'endpoint n'existe pas
        this.assignments = [];
      }
    });
  }

  loadStudents(): void {
    this.userService.getStudents().subscribe({
      next: (students) => {
        this.students = students;
      },
      error: (error) => console.error('Erreur chargement étudiants:', error)
    });
  }

  loadSupervisors(): void {
    this.userService.getEncadrants().subscribe({
      next: (supervisors) => {
        this.supervisors = supervisors;
      },
      error: (error) => console.error('Erreur chargement encadrants:', error)
    });
  }

  filterData(): void {
    this.filteredStages = this.stages.filter(stage => {
      const matchesSearch = !this.searchTerm || 
        stage.entreprise.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        stage.filiere.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (stage.etudiant?.nom + ' ' + stage.etudiant?.prenom).toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesStatus = !this.statusFilter || stage.etat === this.statusFilter;
      
      return matchesSearch && matchesStatus;
    });
    this.currentPage = 1;
  }

  getPaginatedStages(): Stage[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredStages.slice(startIndex, startIndex + this.pageSize);
  }

  getRecentAssignments(): any[] {
    return this.assignments.slice(0, 5);
  }

  getStatusText(status: string): string {
    const statusMap: Record<string, string> = {
      EN_ATTENTE: "En attente",
      VALIDE: "Validé",
      REFUSE: "Refusé",
      EN_COURS: "En cours",
      TERMINE: "Terminé",
    };
    return statusMap[status] || status;
  }

  getStatusBadgeClass(status: string): string {
    const classMap: Record<string, string> = {
      EN_ATTENTE: "badge-warning",
      VALIDE: "badge-success", 
      REFUSE: "badge-error",
      EN_COURS: "badge-primary",
      TERMINE: "badge-secondary",
    };
    return classMap[status] || "badge-secondary";
  }

  get totalPages(): number {
    return Math.ceil(this.filteredStages.length / this.pageSize);
  }

  createAssignment(): void {
    if (!this.newAssignment.etudiantId || !this.newAssignment.encadrantId) {
      this.toastService.error("Sélectionnez un étudiant et un encadrant");
      return;
    }

    const student = this.students.find(s => s.id === this.newAssignment.etudiantId);
    const supervisor = this.supervisors.find(s => s.id === this.newAssignment.encadrantId);

    if (!student || !supervisor) {
      this.toastService.error("Étudiant ou encadrant introuvable");
      return;
    }

    const dto: AssignmentRequest = {
      etudiantId: this.newAssignment.etudiantId,
      etudiantNom: `${student.prenom} ${student.nom}`,
      encadrantId: this.newAssignment.encadrantId,
      encadrantNom: `${supervisor.prenom} ${supervisor.nom}`
    };

    this.creatingAssignment = true;

    this.stageService.assignEncadrant(dto).subscribe({
      next: () => {
        this.creatingAssignment = false;
        this.toastService.success("Affectation créée avec succès");
        this.closeAssignmentModal();
        this.loadAssignments();
      },
      error: (error) => {
        this.creatingAssignment = false;
        this.toastService.error("Erreur lors de la création: " + (error.error?.message || error.message));
      }
    });
  }

  removeAssignment(assignmentId: number): void {
    if (confirm("Supprimer cette affectation ?")) {
      this.stageService.removeAssignment(assignmentId).subscribe({
        next: () => {
          this.toastService.success("Affectation supprimée");
          this.loadAssignments();
        },
        error: (error) => this.toastService.error("Erreur lors de la suppression")
      });
    }
  }

  openAssignmentModal(): void {
    this.showAssignmentModal = true;
  }

  closeAssignmentModal(): void {
    this.showAssignmentModal = false;
    this.newAssignment = {
      etudiantId: 0,
      etudiantNom: '',
      encadrantId: 0,
      encadrantNom: ''
    };
  }

  // Animation des graphiques
  animateCharts(): void {
    const bars = document.querySelectorAll('.chart-bar .bar-fill');
    bars.forEach((bar, index) => {
      setTimeout(() => {
        (bar as HTMLElement).style.height = (bar as HTMLElement).dataset['height'] || '0%';
      }, index * 200);
    });

    const pieSegments = document.querySelectorAll('.pie-segment');
    pieSegments.forEach((segment, index) => {
      setTimeout(() => {
        segment.classList.add('animate');
      }, index * 300);
    });
  }

  // Méthodes pour les graphiques
  getPercentage(value: number): number {
    const total = this.chartData.stagesByStatus.reduce((sum, item) => sum + item.value, 0);
    return total > 0 ? (value / total) * 100 : 0;
  }

  getMaxValue(): number {
    return Math.max(...this.chartData.monthlyTrends.map(item => Math.max(item.stages, item.validations)));
  }

  getBarHeight(value: number): number {
    const max = this.getMaxValue();
    return max > 0 ? (value / max) * 100 : 0;
  }

  private handleError(error: any, context: string): void {
    this.loading = false;
    this.toastService.error(`Erreur ${context}: ${error.message}`);
    if (error.status === 401) {
      this.authService.logout();
    }
  }

  // Navigation des pages
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

  goToPage(page: number): void {
    this.currentPage = page;
  }
}