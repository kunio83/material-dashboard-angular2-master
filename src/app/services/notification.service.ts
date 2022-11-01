import { Injectable } from '@angular/core';
import * as signalR from '@aspnet/signalr';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable } from 'rxjs';
import { Notification } from '../models/notification';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsBehaviorSubject: BehaviorSubject<Notification[]> = new BehaviorSubject<Notification[]>([]);


  constructor(
    private toastr: ToastrService
  ) { }

  getNotificationsFromStorage(): Notification[] {
    let notifications = JSON.parse(localStorage.getItem('notifications'));
    
    if (notifications == null) {
      notifications = [];
    }

    return notifications;
  }

  saveNotificationToStorage(notification: Notification) {
    let notifications = this.getNotificationsFromStorage();
    notifications.push(notification);

    localStorage.setItem('notifications', JSON.stringify(notifications));
    this.notificationsBehaviorSubject.next(notifications);
  }

  deleteNotificationFromStorage(notification: Notification) {
    let notifications = this.getNotificationsFromStorage();
    notifications = notifications.filter(x => x.id != notification.id);

    localStorage.setItem('notifications', JSON.stringify(notifications));
    this.notificationsBehaviorSubject.next(notifications);
  }

  getNotifications(): Observable<Notification[]> {
    let notifications = this.getNotificationsFromStorage();
    this.notificationsBehaviorSubject.next(notifications);

    return this.notificationsBehaviorSubject.asObservable();
  }

  updateNotification(notifications: Notification) {
    let notificationsFromStorage = this.getNotificationsFromStorage();
    notificationsFromStorage = notificationsFromStorage.filter(x => x.id != notifications.id);
    notificationsFromStorage.push(notifications);

    localStorage.setItem('notifications', JSON.stringify(notificationsFromStorage));
    this.notificationsBehaviorSubject.next(notificationsFromStorage);
  }
}
