


import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
  },
  

  {
    path: 'register',
    loadComponent: () => import('./components/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'student',
    canActivate: [AuthGuard],
    data: { role: 'ETUDIANT' },
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./components/student/student-dashboard/student-dashboard.component').then(m => m.StudentDashboardComponent)
      },
      {
        path: 'stages',
        loadComponent: () => import('./components/student/stage-list/stage-list.component').then(m => m.StageListComponent)
      },
      {
        path: 'new-stage',
        loadComponent: () => import('./components/student/demande-form/demande-form.component').then(m => m.DemandeFormComponent)
      }
    ]
  },
  {
    path: 'encadrant',
    canActivate: [AuthGuard],
    data: { role: 'ENCADRANT' },
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./components/encadrant/encadrant-dashboard/encadrant-dashboard.component').then(m => m.EncadrantDashboardComponent)
      },
      {
        path: 'rapports',
        loadComponent: () => import('./components/encadrant/rapport-list/rapport-list.component').then(m => m.RapportListComponent)
      },
     {
      path: 'commentaires',
      loadComponent: () => import('./components/encadrant/rapport-commentaires/rapport-commentaires.component')
                        .then(m => m.RapportCommentairesComponent)
    }
    ]
  },
  {
    path: 'admin',
    canActivate: [AuthGuard],
    data: { role: 'ADMIN' },
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./components/admin/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
      },
      {
        path: 'encadrants',
        loadComponent: () => import('./components/admin/encadrant-management/encadrant-management.component').then(m => m.EncadrantManagementComponent)
      },
      {
        path: 'admins',
        loadComponent: () => import('./components/admin/admin-management/admin-management.component').then(m => m.AdminManagementComponent)
      }
    ]
  },
  
  {
    path: '**',
    redirectTo: '/login'
  }
];