import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  title?: string;
  message: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastsSubject = new BehaviorSubject<Toast[]>([]);
  public toasts$ = this.toastsSubject.asObservable();

  show(toast: Omit<Toast, 'id'>): void {
    const id = this.generateId();
    const newToast: Toast = {
      ...toast,
      id,
      duration: toast.duration || 5000
    };

    const currentToasts = this.toastsSubject.value;
    this.toastsSubject.next([...currentToasts, newToast]);

    // Auto remove after duration
    setTimeout(() => {
      this.remove(id);
    }, newToast.duration);
  }

  success(message: string, title?: string): void {
    this.show({ type: 'success', message, title });
  }

  error(message: string, title?: string): void {
    this.show({ type: 'error', message, title });
  }

  info(message: string, title?: string): void {
    this.show({ type: 'info', message, title });
  }

  remove(id: string): void {
    const currentToasts = this.toastsSubject.value;
    this.toastsSubject.next(currentToasts.filter(toast => toast.id !== id));
  }

  clear(): void {
    this.toastsSubject.next([]);
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}