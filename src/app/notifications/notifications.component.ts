import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'app/services/notification.service';
import { SignalrService } from 'app/services/signalr.service';
import { Notification } from 'app/models/notification';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  notifications: Notification[];

  constructor(
    private notificationService: NotificationService,
    private signalrService: SignalrService
  ) { }


  ngOnInit() {
    this.notificationService.getNotifications().subscribe(notifications => {

    // ordenando notificaciones por fecha de creación de forma descendente
    const sortedDesc = notifications.sort(
      (objA: Notification, objB: Notification) => new Date(objB.date).getTime() - new Date(objA.date).getTime()
      );
    
    this.notifications = sortedDesc as Notification[];
    });
  }
  deleteNotification(notification: Notification) {
    this.notificationService.deleteNotificationFromStorage(notification);
  }
  setNotificationReaded(notification: Notification) {
    notification.readed = true;
    this.notificationService.updateNotification(notification);
  }
}
