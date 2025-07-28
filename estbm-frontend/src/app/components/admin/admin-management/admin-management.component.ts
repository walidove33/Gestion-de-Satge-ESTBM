

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { ToastService } from '../../../services/toast.service';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { User, CreateAdminRequest } from '../../../models/user.model';

@Component({
  selector: 'app-admin-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NavbarComponent],
  templateUrl: './admin-management.component.html',
  styleUrls: ['./admin-management.component.scss']
})
export class AdminManagementComponent implements OnInit {
  admins: User[] = [];
  newAdmin: CreateAdminRequest = {
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    password: ''
  };

  successMessage = '';
  errorMessage = '';
  loading = false;
  loadingList = false;

  constructor(
    private userService: UserService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadAdmins();
    
    // Animation cascade
    setTimeout(() => {
      this.animateElements();
    }, 100);
  }

  loadAdmins(): void {
    this.loadingList = true;
    this.userService.getAdmins().subscribe({
      next: (admins: User[]) => {
        this.admins = admins;
        this.loadingList = false;
      },
      error: (error: any) => {
        this.loadingList = false;
        this.toastService.error('Erreur lors du chargement des administrateurs');
        console.error('Erreur chargement admins:', error);
      }
    });
  }

  createAdmin(): void {
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.userService.createAdmin(this.newAdmin).subscribe({
      next: (admin: User) => {
        this.loading = false;
        this.toastService.success('Administrateur créé avec succès !');
        this.resetForm();
        this.loadAdmins();
      },
      error: (error: any) => {
        this.loading = false;
        this.toastService.error('Erreur lors de la création de l\'administrateur');
        console.error('Erreur création admin:', error);
      }
    });
  }

  editAdmin(admin: User): void {
    this.toastService.info(`Modification de ${admin.nom} ${admin.prenom} (fonctionnalité à implémenter)`);
  }

  deleteAdmin(id: number): void {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet administrateur ?')) return;

    this.userService.deleteAdmin(id).subscribe({
      next: () => {
        this.toastService.success('Administrateur supprimé avec succès');
        this.loadAdmins();
      },
      error: (error: any) => {
        this.toastService.error('Erreur lors de la suppression');
        console.error('Erreur suppression admin:', error);
      }
    });
  }

  private resetForm(): void {
    this.newAdmin = { 
      nom: '', 
      prenom: '', 
      email: '', 
      telephone: '', 
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