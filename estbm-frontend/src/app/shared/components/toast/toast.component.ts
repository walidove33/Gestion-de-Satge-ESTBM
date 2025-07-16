import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../../../services/toast.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      <div *ngFor="let toast of toasts" 
           class="toast" 
           [ngClass]="'toast-' + toast.type"
           [@slideIn]>
        <i class="bi" 
           [ngClass]="{
             'bi-check-circle-fill text-success': toast.type === 'success',
             'bi-exclamation-triangle-fill text-danger': toast.type === 'error',
             'bi-info-circle-fill text-primary': toast.type === 'info'
           }"></i>
        <div class="toast-content">
          <div class="toast-title" *ngIf="toast.title">{{ toast.title }}</div>
          <div class="toast-message">{{ toast.message }}</div>
        </div>
        <button class="toast-close" (click)="removeToast(toast.id)">
          <i class="bi bi-x"></i>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: var(--spacing-4);
      right: var(--spacing-4);
      z-index: 1050;
      display: flex;
      flex-direction: column;
      gap: var(--spacing-2);
      max-width: 400px;
    }

    .toast {
      background-color: white;
      border: 1px solid var(--gray-200);
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-lg);
      padding: var(--spacing-4);
      display: flex;
      align-items: flex-start;
      gap: var(--spacing-3);
      min-width: 300px;
    }

    .toast-success {
      border-left: 4px solid var(--success-500);
    }

    .toast-error {
      border-left: 4px solid var(--danger-500);
    }

    .toast-info {
      border-left: 4px solid var(--primary-500);
    }

    .toast-content {
      flex: 1;
    }

    .toast-title {
      font-weight: 600;
      font-size: var(--font-size-sm);
      color: var(--gray-900);
      margin-bottom: var(--spacing-1);
    }

    .toast-message {
      font-size: var(--font-size-sm);
      color: var(--gray-700);
      line-height: 1.4;
    }

    .toast-close {
      background: none;
      border: none;
      color: var(--gray-400);
      cursor: pointer;
      padding: 0;
      font-size: var(--font-size-lg);
      line-height: 1;
      transition: color 0.15s ease;
    }

    .toast-close:hover {
      color: var(--gray-600);
    }

    @media (max-width: 768px) {
      .toast-container {
        left: var(--spacing-4);
        right: var(--spacing-4);
        max-width: none;
      }

      .toast {
        min-width: auto;
      }
    }
  `],
  animations: []
})
export class ToastComponent implements OnInit, OnDestroy {
  toasts: Toast[] = [];
  private subscription: Subscription = new Subscription();

  constructor(private toastService: ToastService) {}

  ngOnInit(): void {
    this.subscription.add(
      this.toastService.toasts$.subscribe(toasts => {
        this.toasts = toasts;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  removeToast(id: string): void {
    this.toastService.remove(id);
  }
}