import { bootstrapApplication } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app/app.routes';
import { authInterceptor } from './app/interceptors/auth.interceptor'; // Import de la fonction
import { errorInterceptor } from './app/interceptors/error.interceptor';
import { ToastComponent } from './app/shared/components/toast/toast.component';
// import { provideAnimations } from '@angular/platform-browser/animations';

import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { ChangeDetectionStrategy } from '@angular/core';
import { NotificationComponent } from './app/shared/components/notification/notification.component';

@Component({
  selector: 'app-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,

  imports: [RouterModule, RouterOutlet, ToastComponent ],
  template: `
    <router-outlet></router-outlet>
    <app-toast></app-toast>
  `
})
export class App {
  title = 'Gestion des Stages - EST';
}

bootstrapApplication(App, {
  providers: [
    provideHttpClient(
      withInterceptors([
        authInterceptor, // Utilisation de la fonction
        // errorInterceptor
      ])
    ),
    provideRouter(routes),
    provideNoopAnimations()
  ]
});