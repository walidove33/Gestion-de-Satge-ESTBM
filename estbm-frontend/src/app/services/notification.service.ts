// import { Injectable } from "@angular/core"
// import { BehaviorSubject, type Observable } from "rxjs"

// export interface NotificationAction {
//   label: string
//   action: () => void
//   style?: "primary" | "secondary" | "success" | "danger" | "warning" | "info"
// }

// export interface Notification {
//   id: string
//   type: "success" | "error" | "warning" | "info"
//   title: string
//   message: string
//   duration?: number
//   actions?: NotificationAction[]
//   persistent?: boolean
// }

// @Injectable({
//   providedIn: "root",
// })
// export class NotificationService {
//   private notificationsSubject = new BehaviorSubject<Notification[]>([])
//   public notifications: Observable<Notification[]> = this.notificationsSubject.asObservable()

//   private currentNotifications: Notification[] = []

//   success(title: string, message: string, duration = 5000, actions?: NotificationAction[]): void {
//     this.show({
//       type: "success",
//       title,
//       message,
//       duration,
//       actions,
//     })
//   }

//   error(title: string, message: string, duration = 8000, actions?: NotificationAction[]): void {
//     this.show({
//       type: "error",
//       title,
//       message,
//       duration,
//       actions,
//     })
//   }

//   warning(title: string, message: string, duration = 6000, actions?: NotificationAction[]): void {
//     this.show({
//       type: "warning",
//       title,
//       message,
//       duration,
//       actions,
//     })
//   }

//   info(title: string, message: string, duration = 5000, actions?: NotificationAction[]): void {
//     this.show({
//       type: "info",
//       title,
//       message,
//       duration,
//       actions,
//     })
//   }

//   private show(notification: Omit<Notification, "id">): void {
//     const id = this.generateId()
//     const newNotification: Notification = {
//       ...notification,
//       id,
//     }

//     this.currentNotifications.push(newNotification)
//     this.notificationsSubject.next([...this.currentNotifications])

//     // Auto remove after duration
//     if (notification.duration && notification.duration > 0 && !notification.persistent) {
//       setTimeout(() => {
//         this.remove(id)
//       }, notification.duration)
//     }
//   }

//   remove(id: string): void {
//     this.currentNotifications = this.currentNotifications.filter((n) => n.id !== id)
//     this.notificationsSubject.next([...this.currentNotifications])
//   }

//   clear(): void {
//     this.currentNotifications = []
//     this.notificationsSubject.next([])
//   }

//   private generateId(): string {
//     return Math.random().toString(36).substr(2, 9) + Date.now().toString(36)
//   }
// }
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface NotificationAction {
  label: string;
  style: 'primary' | 'secondary' | 'danger';
  action: () => void;
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration: number;
  actions?: NotificationAction[];
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications = new BehaviorSubject<Notification[]>([]);
  public notifications$ = this.notifications.asObservable();

  success(title: string, message?: string, duration = 5000, actions?: NotificationAction[]): void {
    this.show({
      type: 'success',
      title,
      message,
      duration,
      actions
    });
  }

  error(title: string, message?: string, duration = 7000, actions?: NotificationAction[]): void {
    this.show({
      type: 'error',
      title,
      message,
      duration,
      actions
    });
  }

  warning(title: string, message?: string, duration = 6000, actions?: NotificationAction[]): void {
    this.show({
      type: 'warning',
      title,
      message,
      duration,
      actions
    });
  }

  info(title: string, message?: string, duration = 5000, actions?: NotificationAction[]): void {
    this.show({
      type: 'info',
      title,
      message,
      duration,
      actions
    });
  }

  private show(notification: Omit<Notification, 'id'>): void {
    const id = this.generateId();
    const newNotification: Notification = { ...notification, id };
    
    const current = this.notifications.value;
    this.notifications.next([...current, newNotification]);

    // Auto remove after duration
    if (notification.duration > 0) {
      setTimeout(() => {
        this.remove(id);
      }, notification.duration);
    }
  }

  remove(id: string): void {
    const current = this.notifications.value;
    this.notifications.next(current.filter(n => n.id !== id));
  }

  clear(): void {
    this.notifications.next([]);
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}