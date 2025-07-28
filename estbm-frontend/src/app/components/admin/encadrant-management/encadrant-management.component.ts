

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { ToastService } from '../../../services/toast.service';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { User, CreateEncadrantRequest } from '../../../models/user.model';

@Component({
  selector: 'app-encadrant-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NavbarComponent],
  templateUrl: './encadrant-management.component.html',
  styleUrls: ['./encadrant-management.component.scss']
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
  errorMessage = '';
  loading = false;
  loadingList = false;

  specialites = [
    'Génie Informatique',
    'Génie Électrique',
    'Génie Mécanique',
    'Génie Civil',
    'Génie Industriel',
    'Génie Chimique',
    'Génie des Procédés',
    'Génie Énergétique'
  ];

  constructor(
    private userService: UserService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadEncadrants();
    
    // Animation cascade
    setTimeout(() => {
      this.animateElements();
    }, 100);
  }

  loadEncadrants(): void {
    this.loadingList = true;
    this.userService.getEncadrants().subscribe({
      next: (encadrants: User[]) => {
        this.encadrants = encadrants;
        this.loadingList = false;
      },
      error: (error: any) => {
        this.loadingList = false;
        this.toastService.error('Erreur lors du chargement des encadrants');
        console.error('Erreur chargement encadrants:', error);
      }
    });
  }

  createEncadrant(): void {
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.userService.createEncadrant(this.newEncadrant).subscribe({
      next: (encadrant: User) => {
        this.loading = false;
        this.toastService.success('Encadrant créé avec succès !');
        this.resetForm();
        this.loadEncadrants();
      },
      error: (error: any) => {
        this.loading = false;
        this.toastService.error('Erreur lors de la création de l\'encadrant');
        console.error('Erreur création encadrant:', error);
      }
    });
  }

  editEncadrant(encadrant: User): void {
    this.toastService.info(`Modification de ${encadrant.nom} ${encadrant.prenom} (fonctionnalité à implémenter)`);
  }

  deleteEncadrant(id: number): void {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet encadrant ?')) return;

    this.userService.deleteEncadrant(id).subscribe({
      next: () => {
        this.toastService.success('Encadrant supprimé avec succès');
        this.loadEncadrants();
      },
      error: (error: any) => {
        this.toastService.error('Erreur lors de la suppression');
        console.error('Erreur suppression encadrant:', error);
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

  private animateElements(): void {
    const cards = document.querySelectorAll('.management-card');
    cards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add('animate-slideInFromBottom');
      }, index * 150);
    });
  }
}