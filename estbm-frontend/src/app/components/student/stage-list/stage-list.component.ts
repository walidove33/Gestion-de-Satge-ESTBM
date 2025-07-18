// src/app/components/student/stage-list/stage-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { StageService } from '../../../services/stage.service';
import { ToastService } from '../../../services/toast.service';
import { NavbarComponent } from '../../shared/navbar/navbar.component';

import { Stage } from '../../../models/stage.model';

@Component({
  selector: 'app-stage-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    NavbarComponent
  ],
  templateUrl: './stage-list.component.html',
  styleUrls: ['./stage-list.component.css']
})
export class StageListComponent implements OnInit {
  stages: Stage[] = [];
  filteredStages: Stage[] = [];
  loading = false;
  searchTerm = '';
  statusFilter = '';

  // Totaux par statut
  totalEnAttente = 0;
  totalApprouve  = 0;
  totalRejete    = 0;
  totalEnCours   = 0;

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
        this.filterStages();
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.toastService.error('Erreur lors du chargement des stages');
        console.error('Error loading stages:', err);
      }
    });
  }

  filterStages(): void {
    this.filteredStages = this.stages.filter(stage => {
      const matchesSearch = !this.searchTerm
        || stage.sujet.toLowerCase().includes(this.searchTerm.toLowerCase())
        || stage.entreprise.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesStatus = !this.statusFilter
        || stage.etat === this.statusFilter;

      return matchesSearch && matchesStatus;
    });

    // Mise à jour des compteurs
    this.totalEnAttente = this.stages.filter(s => s.etat === 'EN_ATTENTE').length;
    this.totalApprouve  = this.stages.filter(s => s.etat === 'APPROUVE').length;
    this.totalRejete    = this.stages.filter(s => s.etat === 'REJETE').length;
    this.totalEnCours   = this.stages.filter(s => s.etat === 'EN_COURS').length;
  }

  getStatusClass(etat: string): string {
    const map: Record<string,string> = {
      'EN_ATTENTE': 'badge-warning',
      'APPROUVE':   'badge-success',
      'REJETE':     'badge-danger',
      'EN_COURS':   'badge-primary',
      'TERMINE':    'badge-secondary'
    };
    return map[etat] || 'badge-secondary';
  }

  getStatusText(etat: string): string {
    const map: Record<string,string> = {
      'EN_ATTENTE': 'En attente',
      'APPROUVE':   'Approuvé',
      'REJETE':     'Rejeté',
      'EN_COURS':   'En cours',
      'TERMINE':    'Terminé'
    };
    return map[etat] || etat;
  }

  downloadConvention(stageId: number): void {
    this.stageService.downloadConvention(stageId).subscribe({
      next: blob => this.downloadFile(blob, `convention_${stageId}.pdf`),
      error: err => this.toastService.error('Erreur téléchargement convention')
    });
  }

  downloadAssurance(stageId: number): void {
    this.stageService.downloadAssurance(stageId).subscribe({
      next: blob => this.downloadFile(blob, `assurance_${stageId}.pdf`),
      error: err => this.toastService.error('Erreur téléchargement assurance')
    });
  }

  uploadReport(stageId: number): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.doc,.docx';
    input.onchange = (e: any) => {
      const file: File = e.target.files[0];
      if (!file) return;

      if (file.size > 10 * 1024 * 1024) {
        return this.toastService.error('Fichier > 10 MB');
      }
      const types = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!types.includes(file.type)) {
        return this.toastService.error('Format non supporté');
      }

      this.stageService.submitRapport(stageId, file).subscribe({
        next: () => {
          this.toastService.success('Rapport soumis');
          this.loadStages();
        },
        error: () => this.toastService.error('Erreur soumission rapport')
      });
    };
    input.click();
  }

  private downloadFile(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const a   = document.createElement('a');
    a.href   = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  }
}
