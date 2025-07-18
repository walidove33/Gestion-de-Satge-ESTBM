import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }  from '@angular/forms';
import { RouterModule } from '@angular/router';

import { UserService } from '../../../services/user.service';
import { User, CreateEncadrantRequest } from '../../../models/user.model';

@Component({
  selector: 'app-encadrant-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './encadrant-management.component.html',
  styleUrls: ['./encadrant-management.component.css']
})
export class EncadrantManagementComponent implements OnInit {
  encadrants: User[] = [];
  newEncadrant: CreateEncadrantRequest = {
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    specialite: '',
    password: ''
  };

  successMessage = '';
  errorMessage   = '';
  loading        = false;
  loadingList    = false;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadEncadrants();
  }

  loadEncadrants(): void {
    this.loadingList = true;
    this.userService.getEncadrants().subscribe({
      next: (encadrants: User[]) => {
        this.encadrants   = encadrants;
        this.loadingList  = false;
      },
      error: (error: any) => {
        this.loadingList = false;
        console.error('Erreur chargement encadrants:', error);
      }
    });
  }

  createEncadrant(): void {
    this.loading        = true;
    this.errorMessage   = '';
    this.successMessage = '';

    this.userService.createEncadrant(this.newEncadrant).subscribe({
      next: (encadrant: User) => {
        this.loading        = false;
        this.successMessage = 'Encadrant créé avec succès !';
        this.resetForm();
        this.loadEncadrants();
      },
      error: (error: any) => {
        this.loading      = false;
        this.errorMessage = 'Erreur lors de la création de l’encadrant.';
        console.error('Erreur création encadrant:', error);
      }
    });
  }

  editEncadrant(encadrant: User): void {
    alert(`Modifier : ${encadrant.nom} ${encadrant.prenom} (fonctionnalité à implémenter)`);
  }

  deleteEncadrant(id: number): void {
    if (!confirm('Supprimer cet encadrant ?')) return;

    this.userService.deleteEncadrant(id).subscribe({
      next: () => {
        this.loadEncadrants();
        alert('Encadrant supprimé !');
      },
      error: (error: any) => {
        console.error('Erreur suppression encadrant:', error);
        alert('Erreur lors de la suppression');
      }
    });
  }

  private resetForm(): void {
    this.newEncadrant = {
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
      specialite: '',
      password: ''
    };
  }
}
