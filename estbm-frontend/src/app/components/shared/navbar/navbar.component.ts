import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import  { AuthService } from "../../../services/auth.service"
import type { User } from "../../../models/user.model"

@Component({
  selector: "app-navbar",
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar">
      <div class="navbar-container">
        <!-- Logo et titre -->
        <div class="navbar-brand">
          <div class="logo">
            <i class="bi bi-mortarboard-fill"></i>
          </div>
          <div class="brand-text">
            <h1>EST Stages</h1>
            <span>Gestion des Stages</span>
          </div>
        </div>

        <!-- Menu principal -->
        <div class="navbar-menu" [class.active]="menuOpen">
          <div class="menu-items">
            <a routerLink="/dashboard" routerLinkActive="active" class="menu-item">
              <i class="bi bi-speedometer2"></i>
              <span>Tableau de bord</span>
            </a>
            
            <a *ngIf="currentUser?.role === 'ADMIN'" routerLink="/admin/students" routerLinkActive="active" class="menu-item">
              <i class="bi bi-people"></i>
              <span>Étudiants</span>
            </a>
            
            <a *ngIf="currentUser?.role === 'ADMIN'" routerLink="/admin/encadrants" routerLinkActive="active" class="menu-item">
              <i class="bi bi-person-badge"></i>
              <span>Encadrants</span>
            </a>
            
            <a routerLink="/statistics" routerLinkActive="active" class="menu-item">
              <i class="bi bi-graph-up"></i>
              <span>Statistiques</span>
            </a>
          </div>
        </div>

        <!-- Actions utilisateur -->
        <div class="navbar-actions">
          <div class="user-info">
            <div class="user-avatar">
              <i class="bi bi-person-circle"></i>
            </div>
            <div class="user-details">
              <span class="user-name">{{ currentUser?.prenom }} {{ currentUser?.nom }}</span>
              <span class="user-role">{{ getRoleLabel(currentUser?.role) }}</span>
            </div>
          </div>
          
          <div class="dropdown">
            <button class="dropdown-toggle" (click)="toggleDropdown()">
              <i class="bi bi-three-dots-vertical"></i>
            </button>
            <div class="dropdown-menu" [class.show]="dropdownOpen">
              <a href="#" class="dropdown-item">
                <i class="bi bi-person"></i>
                Profil
              </a>
              <a href="#" class="dropdown-item">
                <i class="bi bi-gear"></i>
                Paramètres
              </a>
              <div class="dropdown-divider"></div>
              <a href="#" class="dropdown-item" (click)="logout()">
                <i class="bi bi-box-arrow-right"></i>
                Déconnexion
              </a>
            </div>
          </div>
        </div>

        <!-- Menu hamburger mobile -->
        <button class="hamburger" (click)="toggleMenu()" [class.active]="menuOpen">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  `,
  styles: [
    `
    .navbar {
      background: #ffffff;
      border-bottom: 1px solid #e5e7eb;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      height: 70px;
    }

    .navbar-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 100%;
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 24px;
    }

    .navbar-brand {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .logo {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, #3b82f6, #1d4ed8);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 20px;
    }

    .brand-text h1 {
      font-size: 20px;
      font-weight: 700;
      color: #1f2937;
      margin: 0;
      line-height: 1;
    }

    .brand-text span {
      font-size: 12px;
      color: #6b7280;
      line-height: 1;
    }

    .navbar-menu {
      display: flex;
      align-items: center;
    }

    .menu-items {
      display: flex;
      gap: 8px;
    }

    .menu-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      border-radius: 8px;
      color: #6b7280;
      text-decoration: none;
      font-weight: 500;
      transition: all 0.2s;
    }

    .menu-item:hover {
      background: #f3f4f6;
      color: #374151;
    }

    .menu-item.active {
      background: #eff6ff;
      color: #2563eb;
    }

    .menu-item i {
      font-size: 16px;
    }

    .navbar-actions {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .user-avatar {
      font-size: 32px;
      color: #6b7280;
    }

    .user-details {
      display: flex;
      flex-direction: column;
    }

    .user-name {
      font-size: 14px;
      font-weight: 600;
      color: #1f2937;
      line-height: 1;
    }

    .user-role {
      font-size: 12px;
      color: #6b7280;
      line-height: 1;
    }

    .dropdown {
      position: relative;
    }

    .dropdown-toggle {
      background: none;
      border: none;
      padding: 8px;
      border-radius: 6px;
      color: #6b7280;
      cursor: pointer;
      transition: all 0.2s;
    }

    .dropdown-toggle:hover {
      background: #f3f4f6;
      color: #374151;
    }

    .dropdown-menu {
      position: absolute;
      top: 100%;
      right: 0;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
      min-width: 180px;
      opacity: 0;
      visibility: hidden;
      transform: translateY(-10px);
      transition: all 0.2s;
    }

    .dropdown-menu.show {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }

    .dropdown-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      color: #374151;
      text-decoration: none;
      font-size: 14px;
      transition: all 0.2s;
    }

    .dropdown-item:hover {
      background: #f3f4f6;
    }

    .dropdown-divider {
      height: 1px;
      background: #e5e7eb;
      margin: 8px 0;
    }

    .hamburger {
      display: none;
      flex-direction: column;
      gap: 4px;
      background: none;
      border: none;
      padding: 8px;
      cursor: pointer;
    }

    .hamburger span {
      width: 20px;
      height: 2px;
      background: #6b7280;
      transition: all 0.3s;
    }

    .hamburger.active span:nth-child(1) {
      transform: rotate(45deg) translate(5px, 5px);
    }

    .hamburger.active span:nth-child(2) {
      opacity: 0;
    }

    .hamburger.active span:nth-child(3) {
      transform: rotate(-45deg) translate(7px, -6px);
    }

    @media (max-width: 768px) {
      .navbar-menu {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        border-top: 1px solid #e5e7eb;
        padding: 16px;
        opacity: 0;
        visibility: hidden;
        transform: translateY(-10px);
        transition: all 0.3s;
      }

      .navbar-menu.active {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
      }

      .menu-items {
        flex-direction: column;
        gap: 4px;
      }

      .menu-item {
        padding: 12px 16px;
      }

      .hamburger {
        display: flex;
      }

      .user-details {
        display: none;
      }
    }
  `,
  ],
})
export class NavbarComponent implements OnInit {
  currentUser: User | null = null
  menuOpen = false
  dropdownOpen = false

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser()
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen
  }

  getRoleLabel(role?: string): string {
    const roleLabels: { [key: string]: string } = {
      ETUDIANT: "Étudiant",
      ENCADRANT: "Encadrant",
      ADMIN: "Administrateur",
    }
    return roleLabels[role || ""] || ""
  }

  logout(): void {
    this.authService.logout()
    window.location.href = "/login"
  }
}
