// import { Component, type OnInit, type OnDestroy } from "@angular/core"
// import { CommonModule } from "@angular/common"
// import  { NotificationService, Notification } from "../../../services/notification.service"
// import { Subject, takeUntil } from "rxjs"

// @Component({
//   selector: "app-notification",
//   standalone: true,
//   imports: [CommonModule],
//   template: `
//     <div class="notification-container">
//       <div 
//         *ngFor="let notification of notifications; trackBy: trackByFn"
//         class="notification-item animate-slideInRight"
//         [ngClass]="'notification-' + notification.type"
//         (click)="dismiss(notification.id)">
        
//         <div class="notification-icon">
//           <i class="bi" [ngClass]="getIcon(notification.type)"></i>
//         </div>
        
//         <div class="notification-content">
//           <h4 class="notification-title">{{ notification.title }}</h4>
//           <p class="notification-message">{{ notification.message }}</p>
          
//           <div *ngIf="notification.actions" class="notification-actions">
//             <button 
//               *ngFor="let action of notification.actions"
//               class="btn btn-sm"
//               [ngClass]="'btn-' + (action.style || 'primary')"
//               (click)="executeAction(action, $event)">
//               {{ action.label }}
//             </button>
//           </div>
//         </div>
        
//         <button class="notification-close" (click)="dismiss(notification.id, $event)">
//           <i class="bi bi-x"></i>
//         </button>
//       </div>
//     </div>
//   `,
//   styleUrls: ["./notification.component.scss"],
// })
// export class NotificationComponent implements OnInit, OnDestroy {
//   notifications: Notification[] = []
//   private destroy$ = new Subject<void>()

//   constructor(private notificationService: NotificationService) {}

//   ngOnInit(): void {
//     this.notificationService.notifications.pipe(takeUntil(this.destroy$)).subscribe((notifications) => {
//       this.notifications = notifications
//     })
//   }

//   ngOnDestroy(): void {
//     this.destroy$.next()
//     this.destroy$.complete()
//   }

//   trackByFn(index: number, item: Notification): string {
//     return item.id
//   }

//   getIcon(type: string): string {
//     const icons = {
//       success: "bi-check-circle-fill",
//       error: "bi-exclamation-triangle-fill",
//       warning: "bi-exclamation-circle-fill",
//       info: "bi-info-circle-fill",
//     }
//     return icons[type as keyof typeof icons] || "bi-info-circle-fill"
//   }

//   dismiss(id: string, event?: Event): void {
//     if (event) {
//       event.stopPropagation()
//     }
//     this.notificationService.remove(id)
//   }

//   executeAction(action: any, event: Event): void {
//     event.stopPropagation()
//     action.action()
//   }
// }


import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { NotificationService, Notification } from '../../../services/notification.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="notification-container">
      <div *ngFor="let notification of notifications; trackBy: trackByFn" 
           class="notification-item animate-slideIn"
           [ngClass]="'notification-' + notification.type"
           [@slideIn]>
        
        <div class="notification-icon">
          <i [ngClass]="getIconClass(notification.type)"></i>
        </div>
        
        <div class="notification-content">
          <div class="notification-title">{{ notification.title }}</div>
          <div class="notification-message" *ngIf="notification.message">
            {{ notification.message }}
          </div>
          <div class="notification-actions" *ngIf="notification.actions && notification.actions.length > 0">
            <button *ngFor="let action of notification.actions" 
                    class="notification-btn"
                    [ngClass]="'btn-' + action.style"
                    (click)="executeAction(action, notification)">
              {{ action.label }}
            </button>
          </div>
        </div>
        
        <button class="notification-close" (click)="removeNotification(notification.id)">
          <i class="bi bi-x"></i>
        </button>
        
        <div class="notification-progress" 
             *ngIf="notification.duration > 0"
             [style.animation-duration]="notification.duration + 'ms'"></div>
      </div>
    </div>
  `,
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  notifications: Notification[] = [];

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.notificationService.notifications$
      .pipe(takeUntil(this.destroy$))
      .subscribe(notifications => {
        this.notifications = notifications;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  trackByFn(index: number, item: Notification): string {
    return item.id;
  }

  getIconClass(type: string): string {
    const iconMap: { [key: string]: string } = {
      success: 'bi bi-check-circle-fill',
      error: 'bi bi-exclamation-triangle-fill',
      warning: 'bi bi-exclamation-circle-fill',
      info: 'bi bi-info-circle-fill'
    };
    return iconMap[type] || 'bi bi-info-circle-fill';
  }

  removeNotification(id: string): void {
    this.notificationService.remove(id);
  }

  executeAction(action: any, notification: Notification): void {
    action.action();
    this.removeNotification(notification.id);
  }
}