import { bootstrapApplication } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app/app.routes';
import { AuthInterceptor } from './app/interceptors/auth.interceptor';
import { ToastComponent } from './app/shared/components/toast/toast.component';
import { errorInterceptor } from './app/interceptors/error.interceptor';
import { provideAnimations } from '@angular/platform-browser/animations';



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


import { HTTP_INTERCEPTORS } from '@angular/common/http';

bootstrapApplication(App, {
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    provideHttpClient(),
    provideRouter(routes)  ]
});


