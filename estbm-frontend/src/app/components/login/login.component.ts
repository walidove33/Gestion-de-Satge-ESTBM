

import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { Router, RouterModule } from "@angular/router"
import { AuthService } from "../../services/auth.service"
import { ToastService } from "../../services/toast.service"
import { LoginRequest } from "../../models/auth.model"

@Component({
  selector: "app-login",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
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
    private toastService: ToastService
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
        this.toastService.success(`Bienvenue ${response.user.prenom} !`)
        
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
        
        this.toastService.error(this.errorMessage)
      },
    })
  }
}