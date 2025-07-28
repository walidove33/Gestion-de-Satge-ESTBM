
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { RegisterRequest } from '../../models/auth.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  userData: RegisterRequest = {
    codeApogee: '',
    codeMassar: '',
    dateNaissance: '',
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    password: ''
  };
  
  errorMessage = '';
  successMessage = '';
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {}

  onRegister(): void {
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.register(this.userData).subscribe({
      next: (response) => {
        this.loading = false;
        this.successMessage = 'Inscription réussie ! Vous pouvez maintenant vous connecter.';
        this.toastService.success('Compte créé avec succès !');
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = 'Erreur lors de l\'inscription. Vérifiez vos informations.';
        this.toastService.error('Erreur lors de l\'inscription');
      }
    });
  }
}