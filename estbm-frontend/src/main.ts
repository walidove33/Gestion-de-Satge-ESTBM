import { bootstrapApplication } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app/app.routes';
import { authInterceptor } from './app/interceptors/auth.interceptor';
import { ToastComponent } from './app/shared/components/toast/toast.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, RouterOutlet, ToastComponent],
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
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor]))
  ]
}).catch(err => console.error(err));