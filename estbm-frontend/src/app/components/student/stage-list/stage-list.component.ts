import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StageService } from '../../../services/stage.service';
import { ToastService } from '../../../services/toast.service';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { Stage } from '../../../models/stage.model';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-stage-list',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent ,     FormsModule],
  templateUrl: './stage-list.component.html',
  styleUrls: ['./stage-list.component.css']
})
export class StageListComponent implements OnInit {
  stages: Stage[] = [];
  filteredStages: Stage[] = [];
  loading = false;
  searchTerm = '';
  statusFilter = '';

  get countEnAttente(): number {
    return this.stages.filter(s => s.etat === 'EN_ATTENTE').length;
  }
  get countApprouve(): number {
    return this.stages.filter(s => s.etat === 'APPROUVE').length;
  }
  get countRejete(): number {
    return this.stages.filter(s => s.etat === 'REJETE').length;
  }
  get countEncours(): number {
    return this.stages.filter(s => s.etat === 'EN_COURS').length;
  }

  constructor(
    private stageService: StageService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadStages();
  }



  loadStages(): void {
    this.loading = true;
    this.stageService.getMyStages().subscribe({
      next: (stages) => {
        this.stages = stages;
        this.filteredStages = [...stages];
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.toastService.error('Erreur lors du chargement des stages');
        console.error('Error loading stages:', error);
      }
    });
  }

  filterStages(): void {
    this.filteredStages = this.stages.filter(stage => {
      const matchesSearch = !this.searchTerm || 
        stage.sujet.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        stage.entreprise.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesStatus = !this.statusFilter || stage.etat === this.statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }

  getStatusClass(etat: string): string {
    const classMap: { [key: string]: string } = {
      'EN_ATTENTE': 'badge-warning',
      'APPROUVE': 'badge-success',
      'REJETE': 'badge-danger',
      'EN_COURS': 'badge-primary',
      'TERMINE': 'badge-primary'
    };
    return classMap[etat] || 'badge-primary';
  }

  getStatusText(etat: string): string {
    const statusMap: { [key: string]: string } = {
      'EN_ATTENTE': 'En attente',
      'APPROUVE': 'Approuvé',
      'REJETE': 'Rejeté',
      'EN_COURS': 'En cours',
      'TERMINE': 'Terminé'
    };
    return statusMap[etat] || etat;
  }

  downloadConvention(stageId: number): void {
    this.stageService.downloadConvention(stageId).subscribe({
      next: (blob) => {
        this.downloadFile(blob, `convention_stage_${stageId}.pdf`);
        this.toastService.success('Convention téléchargée avec succès');
      },
      error: (error) => {
        this.toastService.error('Erreur lors du téléchargement de la convention');
        console.error('Error downloading convention:', error);
      }
    });
  }

  downloadAssurance(stageId: number): void {
    this.stageService.downloadAssurance(stageId).subscribe({
      next: (blob) => {
        this.downloadFile(blob, `assurance_stage_${stageId}.pdf`);
        this.toastService.success('Attestation téléchargée avec succès');
      },
      error: (error) => {
        this.toastService.error('Erreur lors du téléchargement de l\'attestation');
        console.error('Error downloading assurance:', error);
      }
    });
  }

  uploadReport(stageId: number): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.doc,.docx';
    input.onchange = (event: any) => {
      const file = event.target.files[0];
      if (file) {
        // Validate file size (10MB max)
        if (file.size > 10 * 1024 * 1024) {
          this.toastService.error('Le fichier ne doit pas dépasser 10MB');
          return;
        }

        // Validate file type
        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!allowedTypes.includes(file.type)) {
          this.toastService.error('Format de fichier non supporté. Utilisez PDF, DOC ou DOCX');
          return;
        }

        this.stageService.submitRapport(stageId, file).subscribe({
          next: (rapport) => {
            this.toastService.success('Rapport soumis avec succès!');
            this.loadStages(); // Refresh the list
          },
          error: (error) => {
            this.toastService.error('Erreur lors de l\'envoi du rapport');
            console.error('Error submitting report:', error);
          }
        });
      }
    };
    input.click();
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