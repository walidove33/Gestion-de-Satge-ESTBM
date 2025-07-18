import { Component, OnInit } from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule }    from '@angular/forms';
import { RouterModule }   from '@angular/router';

import { UserService }            from '../../../services/user.service';
import { User, CreateAdminRequest } from '../../../models/user.model';

@Component({
  selector: 'app-admin-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin-management.component.html',
  styleUrls: ['./admin-management.component.css']
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
  errorMessage   = '';
  loading        = false;
  loadingList    = false;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadAdmins();
  }

  loadAdmins(): void {
    this.loadingList = true;
    this.userService.getAdmins().subscribe({
      next: (admins: User[]) => {
        this.admins      = admins;
        this.loadingList = false;
      },
      error: (error: any) => {
        this.loadingList = false;
        console.error('Erreur chargement admins:', error);
      }
    });
  }

  createAdmin(): void {
    this.loading        = true;
    this.errorMessage   = '';
    this.successMessage = '';

    this.userService.createAdmin(this.newAdmin).subscribe({
      next: (admin: User) => {
        this.loading        = false;
        this.successMessage = 'Administrateur créé avec succès !';
        this.resetForm();
        this.loadAdmins();
      },
      error: (error: any) => {
        this.loading      = false;
        this.errorMessage = 'Erreur lors de la création de l’administrateur.';
        console.error('Erreur création admin:', error);
      }
    });
  }

  editAdmin(admin: User): void {
    alert(`Modifier : ${admin.nom} ${admin.prenom} (à implémenter)`);
  }

  deleteAdmin(id: number): void {
    if (!confirm('Supprimer cet administrateur ?')) return;

    this.userService.deleteAdmin(id).subscribe({
      next: () => {
        this.loadAdmins();
        alert('Administrateur supprimé !');
      },
      error: (error: any) => {
        console.error('Erreur suppression admin:', error);
        alert('Erreur lors de la suppression');
      }
    });
  }

  private resetForm(): void {
    this.newAdmin = { nom: '', prenom: '', email: '', telephone: '', password: '' };
  }
}
