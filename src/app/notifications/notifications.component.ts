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
      this.notifications = notifications;
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
