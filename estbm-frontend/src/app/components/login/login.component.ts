// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { Router, RouterModule } from '@angular/router';
// import { AuthService } from '../../services/auth.service';
// import { LoginRequest } from '../../models/auth.model';

// @Component({
//   selector: 'app-login',
//   standalone: true,
//   imports: [CommonModule, FormsModule, RouterModule],
//   template: `
//     <!-- LOGIN PAGE STRUCTURE -->
//     <!-- 1. MAIN CONTAINER: Full-height centered layout -->
//     <div class="min-vh-100 d-flex align-items-center justify-content-center bg-light">
//       <div class="card shadow-lg" style="width: 100%; max-width: 400px;">
        
//         <!-- 2. HEADER SECTION: App branding and title -->
//         <div class="card-header text-center bg-primary text-white">
//           <h4 class="mb-0">
//             <i class="bi bi-mortarboard-fill me-2"></i>
//             Gestion des Stages
//           </h4>
//           <small>École Supérieure de Technologie</small>
//         </div>

//         <!-- 3. FORM SECTION: Main authentication form -->
//         <div class="card-body p-4">
//           <h5 class="card-title text-center mb-4">Connexion</h5>
          
//           <!-- 3.1 ERROR ALERT: Shows authentication errors -->
//           <div class="alert alert-danger" *ngIf="errorMessage" role="alert">
//             <i class="bi bi-exclamation-triangle-fill me-2"></i>
//             {{ errorMessage }}
//           </div>

//           <!-- 3.2 LOGIN FORM: Email and password inputs with validation -->
//           <form (ngSubmit)="onLogin()" #loginForm="ngForm">
//             <!-- Email Input Field -->
//             <div class="mb-3">
//               <label for="email" class="form-label">
//                 <i class="bi bi-envelope me-1"></i>
//                 Email
//               </label>
//               <input 
//                 type="email" 
//                 class="form-control" 
//                 id="email" 
//                 name="email"
//                 [(ngModel)]="credentials.email"
//                 required
//                 #email="ngModel"
//                 placeholder="votre.email@est.ac.ma">
//               <div class="text-danger small mt-1" *ngIf="email.invalid && email.touched">
//                 Email requis
//               </div>
//             </div>

//             <!-- Password Input Field -->
//             <div class="mb-3">
//               <label for="password" class="form-label">
//                 <i class="bi bi-lock me-1"></i>
//                 Mot de passe
//               </label>
//               <input 
//                 type="password" 
//                 class="form-control" 
//                 id="password" 
//                 name="password"
//                 [(ngModel)]="credentials.password"
//                 required
//                 #password="ngModel"
//                 placeholder="Votre mot de passe">
//               <div class="text-danger small mt-1" *ngIf="password.invalid && password.touched">
//                 Mot de passe requis
//               </div>
//             </div>

//             <!-- 3.3 SUBMIT SECTION: Login button with loading state -->
//             <div class="d-grid gap-2">
//               <button 
//                 type="submit" 
//                 class="btn btn-primary" 
//                 [disabled]="loginForm.invalid || loading">
//                 <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
//                 <i class="bi bi-box-arrow-in-right me-2" *ngIf="!loading"></i>
//                 Se connecter
//               </button>
//             </div>
//           </form>

//           <!-- 4. NAVIGATION SECTION: Link to registration page -->
//           <div class="text-center mt-3">
//             <small class="text-muted">
//               Pas encore inscrit ?
//               <a routerLink="/register" class="text-decoration-none">
//                 Créer un compte
//               </a>
//             </small>
//           </div>
//         </div>
//       </div>
//     </div>
//   `
// })
// export class LoginComponent {
//   // Component state for form data
//   credentials: LoginRequest = {
//     email: '',
//     password: ''
//   };
  
//   // UI state management
//   errorMessage = '';
//   loading = false;

//   constructor(
//     private authService: AuthService,
//     private router: Router
//   ) {}

//   /**
//    * Handles form submission for user login
//    * Authenticates user and redirects based on role
//    */
//   onLogin(): void {
//     this.loading = true;
//     this.errorMessage = '';

//     this.authService.login(this.credentials).subscribe({
//       next: (response) => {
//         this.loading = false;
//         // Role-based navigation after successful login
//         switch (response.role) {
//           case 'ADMIN':
//             this.router.navigate(['/admin/dashboard']);
//             break;
//           case 'ENCADRANT':
//             this.router.navigate(['/encadrant/dashboard']);
//             break;
//           case 'ETUDIANT':
//             this.router.navigate(['/student/dashboard']);
//             break;
//         }
//       },
//       error: (error) => {
//         this.loading = false;
//         this.errorMessage = 'Email ou mot de passe incorrect';
//       }
//     });
//   }
// }

import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import {  Router, RouterModule } from "@angular/router"
import  { AuthService } from "../../services/auth.service"
import type { LoginRequest } from "../../models/auth.model"

@Component({
  selector: "app-login",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="login-container">
      <div class="login-background"></div>
      
      <div class="login-card">
        <div class="login-header">
          <div class="logo-section">
            <div class="logo-circle">
              <i class="bi bi-mortarboard-fill"></i>
            </div>
            <h1 class="app-title">Gestion des Stages</h1>
            <p class="institution-name">École Supérieure de Technologie</p>
            <p class="ministry-label">Ministère de l'Éducation Nationale - Royaume du Maroc</p>
          </div>
        </div>

        <div class="login-body">
          <h2 class="form-title">Connexion</h2>
          
          <div class="alert alert-danger" *ngIf="errorMessage" role="alert">
            <i class="bi bi-exclamation-triangle-fill me-2"></i>
            {{ errorMessage }}
          </div>

          <form (ngSubmit)="onLogin()" #loginForm="ngForm" class="login-form">
            <div class="form-group">
              <label for="email" class="form-label">
                <i class="bi bi-envelope me-2"></i>
                Adresse email
              </label>
              <input 
                type="email" 
                class="form-control" 
                id="email" 
                name="email"
                [(ngModel)]="credentials.email"
                required
                #email="ngModel"
                placeholder="votre.email@est.ac.ma"
                [class.is-invalid]="email.invalid && email.touched">
              <div class="invalid-feedback" *ngIf="email.invalid && email.touched">
                Veuillez saisir une adresse email valide
              </div>
            </div>

            <div class="form-group">
              <label for="password" class="form-label">
                <i class="bi bi-lock me-2"></i>
                Mot de passe
              </label>
              <div class="password-input-group">
                <input 
                  [type]="showPassword ? 'text' : 'password'" 
                  class="form-control" 
                  id="password" 
                  name="password"
                  [(ngModel)]="credentials.password"
                  required
                  #password="ngModel"
                  placeholder="Votre mot de passe"
                  [class.is-invalid]="password.invalid && password.touched">
                <button 
                  type="button" 
                  class="password-toggle"
                  (click)="togglePassword()">
                  <i class="bi" [class.bi-eye]="!showPassword" [class.bi-eye-slash]="showPassword"></i>
                </button>
              </div>
              <div class="invalid-feedback" *ngIf="password.invalid && password.touched">
                Le mot de passe est requis
              </div>
            </div>

            <div class="form-check mb-4">
              <input class="form-check-input" type="checkbox" id="rememberMe" [(ngModel)]="rememberMe" name="rememberMe">
              <label class="form-check-label" for="rememberMe">
                Se souvenir de moi
              </label>
            </div>

            <button 
              type="submit" 
              class="btn btn-primary btn-login" 
              [disabled]="loginForm.invalid || loading">
              <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
              <i class="bi bi-box-arrow-in-right me-2" *ngIf="!loading"></i>
              {{ loading ? 'Connexion...' : 'Se connecter' }}
            </button>
          </form>

          <div class="register-link">
            <p class="text-muted">
              Première connexion ?
              <a routerLink="/register" class="link-primary">
                Créer un compte étudiant
              </a>
            </p>
          </div>
        </div>

        <div class="login-footer">
          <p class="footer-text">
            <i class="bi bi-shield-check me-1"></i>
            Connexion sécurisée - Données protégées
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }

    .login-background {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image: 
        radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
    }

    .login-card {
      background: white;
      border-radius: 20px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 450px;
      position: relative;
      z-index: 1;
      overflow: hidden;
    }

    .login-header {
      background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
      color: white;
      padding: 40px 30px;
      text-align: center;
    }

    .logo-section {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .logo-circle {
      width: 80px;
      height: 80px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;
      backdrop-filter: blur(10px);
    }

    .logo-circle i {
      font-size: 2.5rem;
      color: white;
    }

    .app-title {
      font-size: 1.8rem;
      font-weight: 700;
      margin-bottom: 8px;
      letter-spacing: -0.5px;
    }

    .institution-name {
      font-size: 1rem;
      margin-bottom: 5px;
      opacity: 0.9;
    }

    .ministry-label {
      font-size: 0.85rem;
      opacity: 0.8;
      margin-bottom: 0;
    }

    .login-body {
      padding: 40px 30px;
    }

    .form-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: #2c3e50;
      margin-bottom: 30px;
      text-align: center;
    }

    .form-group {
      margin-bottom: 25px;
    }

    .form-label {
      font-weight: 600;
      color: #2c3e50;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
    }

    .form-control {
      border: 2px solid #e9ecef;
      border-radius: 10px;
      padding: 12px 16px;
      font-size: 1rem;
      transition: all 0.3s ease;
    }

    .form-control:focus {
      border-color: #667eea;
      box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
    }

    .password-input-group {
      position: relative;
    }

    .password-toggle {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: #6c757d;
      cursor: pointer;
      padding: 4px;
    }

    .password-toggle:hover {
      color: #495057;
    }

    .btn-login {
      width: 100%;
      padding: 12px;
      font-size: 1.1rem;
      font-weight: 600;
      border-radius: 10px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;
      transition: all 0.3s ease;
    }

    .btn-login:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
    }

    .btn-login:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .register-link {
      text-align: center;
      margin-top: 25px;
    }

    .link-primary {
      color: #667eea;
      text-decoration: none;
      font-weight: 600;
    }

    .link-primary:hover {
      color: #764ba2;
      text-decoration: underline;
    }

    .login-footer {
      background: #f8f9fa;
      padding: 20px 30px;
      text-align: center;
      border-top: 1px solid #e9ecef;
    }

    .footer-text {
      margin: 0;
      font-size: 0.9rem;
      color: #6c757d;
    }

    .alert {
      border-radius: 10px;
      border: none;
      margin-bottom: 25px;
    }

    .form-check {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .form-check-input:checked {
      background-color: #667eea;
      border-color: #667eea;
    }

    @media (max-width: 576px) {
      .login-container {
        padding: 10px;
      }
      
      .login-card {
        max-width: 100%;
      }
      
      .login-header {
        padding: 30px 20px;
      }
      
      .login-body {
        padding: 30px 20px;
      }
      
      .app-title {
        font-size: 1.5rem;
      }
    }
  `,
  ],
})
export class LoginComponent {
  credentials: LoginRequest = {
    email: "",
    password: "",
  }

  errorMessage = ""
  loading = false
  showPassword = false
  rememberMe = false

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  togglePassword(): void {
    this.showPassword = !this.showPassword
  }

  onLogin(): void {
    this.loading = true
    this.errorMessage = ""

    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        this.loading = false
        const role = response.role
        switch (role) {
          case "ADMIN":
            this.router.navigate(["/admin/dashboard"])
            break
          case "ENCADRANT":
            this.router.navigate(["/encadrant/dashboard"])
            break
          case "ETUDIANT":
          default:
            this.router.navigate(["/student/dashboard"])
            break
        }
      },
      error: (error) => {
        this.loading = false
        console.error("Erreur de connexion:", error)

        if (error.status === 401) {
          this.errorMessage = "Email ou mot de passe incorrect"
        } else if (error.status === 403) {
          this.errorMessage = "Accès refusé. Contactez l'administrateur."
        } else if (error.status === 0) {
          this.errorMessage = "Impossible de se connecter au serveur"
        } else {
          this.errorMessage = "Une erreur est survenue. Veuillez réessayer."
        }
      },
    })
  }
}
