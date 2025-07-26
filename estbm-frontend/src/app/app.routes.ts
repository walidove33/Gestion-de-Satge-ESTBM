// import { Routes } from '@angular/router';
// import { AuthGuard } from './guards/auth.guard';

// // Import all components
// import { LoginComponent } from './components/login/login.component';
// import { RegisterComponent } from './components/register/register.component';
// import { StudentDashboardComponent } from './components/student/student-dashboard/student-dashboard.component';
// import { DemandeFormComponent } from './components/student/demande-form/demande-form.component';
// import { StageListComponent } from './components/student/stage-list/stage-list.component';
// import { EncadrantDashboardComponent } from './components/encadrant/encadrant-dashboard/encadrant-dashboard.component';
// import { RapportListComponent } from './components/encadrant/rapport-list/rapport-list.component';
// import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
// import { EncadrantManagementComponent } from './components/admin/encadrant-management/encadrant-management.component';
// import { AdminManagementComponent } from './components/admin/admin-management/admin-management.component';

// export const routes: Routes = [
//   // Public routes
//   { path: 'login', component: LoginComponent },
//   { path: 'register', component: RegisterComponent },
  
//   // Student routes
//   { 
//     path: 'student/dashboard', 
//     component: StudentDashboardComponent, 
//     canActivate: [AuthGuard], 
//     data: { role: 'ETUDIANT' } 
//   },
//   { 
//     path: 'student/new-stage', 
//     component: DemandeFormComponent, 
//     canActivate: [AuthGuard], 
//     data: { role: 'ETUDIANT' } 
//   },
//   { 
//     path: 'student/stages', 
//     component: StageListComponent, 
//     canActivate: [AuthGuard], 
//     data: { role: 'ETUDIANT' } 
//   },
  
//   // Encadrant routes
//   { 
//     path: 'encadrant/dashboard', 
//     component: EncadrantDashboardComponent, 
//     canActivate: [AuthGuard], 
//     data: { role: 'ENCADRANT' } 
//   },
//   { 
//     path: 'encadrant/rapports', 
//     component: RapportListComponent, 
//     canActivate: [AuthGuard], 
//     data: { role: 'ENCADRANT' } 
//   },
  
//   // Admin routes
//   { 
//     path: 'admin/dashboard', 
//     component: AdminDashboardComponent, 
//     canActivate: [AuthGuard], 
//     data: { role: 'ADMIN' } 
//   },
//   { 
//     path: 'admin/encadrants', 
//     component: EncadrantManagementComponent, 
//     canActivate: [AuthGuard], 
//     data: { role: 'ADMIN' } 
//   },
//   { 
//     path: 'admin/admins', 
//     component: AdminManagementComponent, 
//     canActivate: [AuthGuard], 
//     data: { role: 'ADMIN' } 
//   },
  
//   // Dashboard redirects based on role
//   { 
//     path: 'dashboard', 
//     redirectTo: '/student/dashboard', 
//     pathMatch: 'full' 
//   },
  
//   // Default routes
//   { path: '', redirectTo: '/login', pathMatch: 'full' },
//   { path: '**', redirectTo: '/login' },


  
//   {
//     path: 'admin/dashboard',
//     component: AdminDashboardComponent,
//     canActivate: [AuthGuard],
//     data: { role: 'ADMIN' }
//   },
//   {
//     path: 'encadrant/dashboard',
//     component: EncadrantDashboardComponent,
//     canActivate: [AuthGuard],
//     data: { role: 'ENCADRANT' }
//   },
// ];



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