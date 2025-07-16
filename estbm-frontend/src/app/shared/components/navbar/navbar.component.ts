import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar">
      <div class="navbar-container">
        <!-- Brand -->
        <div class="navbar-brand">
          <img src="/assets/logo.png" alt="EST Logo" class="brand-logo" />
          <div class="brand-text">
            <h1>EST Stages</h1>
            <span>École Supérieure de Technologie</span>
          </div>
        </div>

        <!-- Desktop Navigation -->
        <div class="navbar-nav" [class.active]="mobileMenuOpen">
          <a routerLink="/dashboard" routerLinkActive="active" class="nav-link">
            <i class="bi bi-speedometer2"></i>
            <span>Dashboard</span>
          </a>
          
          <a *ngIf="currentUser?.role === 'ETUDIANT'" 
             routerLink="/student/stages" 
             routerLinkActive="active" 
             class="nav-link">
            <i class="bi bi-briefcase"></i>
            <span>Mes Stages</span>
          </a>
          
          <a *ngIf="currentUser?.role === 'ENCADRANT'" 
             routerLink="/encadrant/rapports" 
             routerLinkActive="active" 
             class="nav-link">
            <i class="bi bi-file-earmark-text"></i>
            <span>Rapports</span>
          </a>
          
          <a *ngIf="currentUser?.role === 'ADMIN'" 
             routerLink="/admin/encadrants" 
             routerLinkActive="active" 
             class="nav-link">
            <i class="bi bi-people"></i>
            <span>Gestion</span>
          </a>
        </div>

        <!-- User Menu -->
        <div class="navbar-user">
          <div class="user-info" (click)="toggleUserMenu()">
            <div class="user-avatar">
              <i class="bi bi-person-circle"></i>
            </div>
            <div class="user-details">
              <span class="user-name">{{ currentUser?.prenom }} {{ currentUser?.nom }}</span>
              <span class="user-role">{{ getRoleLabel(currentUser?.role) }}</span>
            </div>
            <i class="bi bi-chevron-down dropdown-icon" [class.rotated]="userMenuOpen"></i>
          </div>
          
          <div class="user-dropdown" [class.active]="userMenuOpen">
            <a href="#" class="dropdown-item">
              <i class="bi bi-person"></i>
              <span>Profil</span>
            </a>
            <a href="#" class="dropdown-item">
              <i class="bi bi-gear"></i>
              <span>Paramètres</span>
            </a>
            <div class="dropdown-divider"></div>
            <a href="#" class="dropdown-item" (click)="logout($event)">
              <i class="bi bi-box-arrow-right"></i>
              <span>Déconnexion</span>
            </a>
          </div>
        </div>

        <!-- Mobile Menu Button -->
        <button class="mobile-menu-btn" (click)="toggleMobileMenu()">
          <span class="hamburger-line" [class.active]="mobileMenuOpen"></span>
          <span class="hamburger-line" [class.active]="mobileMenuOpen"></span>
          <span class="hamburger-line" [class.active]="mobileMenuOpen"></span>
        </button>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      background-color: white;
      border-bottom: 1px solid var(--gray-200);
      box-shadow: var(--shadow-sm);
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      height: 72px;
    }

    .navbar-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 var(--spacing-6);
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .navbar-brand {
      display: flex;
      align-items: center;
      gap: var(--spacing-3);
    }

    .brand-logo {
      width: 40px;
      height: 40px;
      border-radius: var(--radius-lg);
    }

    .brand-text h1 {
      font-size: var(--font-size-xl);
      font-weight: 700;
      color: var(--primary-600);
      margin: 0;
      line-height: 1;
    }

    .brand-text span {
      font-size: var(--font-size-xs);
      color: var(--gray-500);
      line-height: 1;
    }

    .navbar-nav {
      display: flex;
      align-items: center;
      gap: var(--spacing-2);
    }

    .nav-link {
      display: flex;
      align-items: center;
      gap: var(--spacing-2);
      padding: var(--spacing-2) var(--spacing-4);
      color: var(--gray-600);
      text-decoration: none;
      border-radius: var(--radius-lg);
      font-weight: 500;
      transition: all 0.15s ease;
    }

    .nav-link:hover {
      color: var(--primary-600);
      background-color: var(--primary-50);
    }

    .nav-link.active {
      color: var(--primary-600);
      background-color: var(--primary-100);
    }

    .navbar-user {
      position: relative;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: var(--spacing-3);
      padding: var(--spacing-2);
      border-radius: var(--radius-lg);
      cursor: pointer;
      transition: background-color 0.15s ease;
    }

    .user-info:hover {
      background-color: var(--gray-50);
    }

    .user-avatar {
      font-size: 32px;
      color: var(--gray-400);
    }

    .user-details {
      display: flex;
      flex-direction: column;
    }

    .user-name {
      font-size: var(--font-size-sm);
      font-weight: 600;
      color: var(--gray-900);
      line-height: 1.2;
    }

    .user-role {
      font-size: var(--font-size-xs);
      color: var(--gray-500);
      line-height: 1.2;
    }

    .dropdown-icon {
      font-size: var(--font-size-sm);
      color: var(--gray-400);
      transition: transform 0.15s ease;
    }

    .dropdown-icon.rotated {
      transform: rotate(180deg);
    }

    .user-dropdown {
      position: absolute;
      top: 100%;
      right: 0;
      margin-top: var(--spacing-2);
      min-width: 200px;
      background-color: white;
      border: 1px solid var(--gray-200);
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-lg);
      opacity: 0;
      visibility: hidden;
      transform: translateY(-10px);
      transition: all 0.15s ease;
    }

    .user-dropdown.active {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }

    .dropdown-item {
      display: flex;
      align-items: center;
      gap: var(--spacing-3);
      padding: var(--spacing-3) var(--spacing-4);
      color: var(--gray-700);
      text-decoration: none;
      font-size: var(--font-size-sm);
      transition: background-color 0.15s ease;
    }

    .dropdown-item:hover {
      background-color: var(--gray-50);
    }

    .dropdown-item:first-child {
      border-radius: var(--radius-xl) var(--radius-xl) 0 0;
    }

    .dropdown-item:last-child {
      border-radius: 0 0 var(--radius-xl) var(--radius-xl);
    }

    .dropdown-divider {
      height: 1px;
      background-color: var(--gray-200);
      margin: var(--spacing-2) 0;
    }

    .mobile-menu-btn {
      display: none;
      flex-direction: column;
      gap: 4px;
      background: none;
      border: none;
      padding: var(--spacing-2);
      cursor: pointer;
    }

    .hamburger-line {
      width: 24px;
      height: 2px;
      background-color: var(--gray-600);
      transition: all 0.3s ease;
    }

    .hamburger-line.active:nth-child(1) {
      transform: rotate(45deg) translate(6px, 6px);
    }

    .hamburger-line.active:nth-child(2) {
      opacity: 0;
    }

    .hamburger-line.active:nth-child(3) {
      transform: rotate(-45deg) translate(6px, -6px);
    }

    @media (max-width: 768px) {
      .navbar-nav {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background-color: white;
        border-top: 1px solid var(--gray-200);
        flex-direction: column;
        padding: var(--spacing-4);
        gap: var(--spacing-2);
        opacity: 0;
        visibility: hidden;
        transform: translateY(-10px);
        transition: all 0.3s ease;
      }

      .navbar-nav.active {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
      }

      .nav-link {
        width: 100%;
        justify-content: flex-start;
        padding: var(--spacing-3) var(--spacing-4);
      }

      .mobile-menu-btn {
        display: flex;
      }

      .user-details {
        display: none;
      }
    }
  `]
})
export class NavbarComponent implements OnInit {
  currentUser: User | null = null;
  mobileMenuOpen = false;
  userMenuOpen = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  toggleUserMenu(): void {
    this.userMenuOpen = !this.userMenuOpen;
  }

  getRoleLabel(role?: string): string {
    const roleLabels: { [key: string]: string } = {
      'ETUDIANT': 'Étudiant',
      'ENCADRANT': 'Encadrant',
      'ADMIN': 'Administrateur'
    };
    return roleLabels[role || ''] || '';
  }

  logout(event: Event): void {
    event.preventDefault();
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}