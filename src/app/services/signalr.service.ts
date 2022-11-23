import { ItemStateService } from 'app/services/item-state.service';
import { Injectable } from '@angular/core';
import * as signalR from '@aspnet/signalr';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
import { NotificationService } from './notification.service';
import { Notification } from '../models/notification';
import { v4 as uuidv4 } from 'uuid';
import { environment } from 'environments/environment';
import { TableService2ItemService } from './table-service2-item.service';

@Injectable({
  providedIn: 'root'
})
export class SignalrService {
  appName: string = 'optirest-cocina';
  appGuid: string;
  hubConnection: signalR.HubConnection;
  private appsConnectedBehaviorSubject: BehaviorSubject<any> = new BehaviorSubject<any>([]);


  constructor(
    private toastr: ToastrService,
    private notificationService: NotificationService,
    private tableService2ItemService: TableService2ItemService
  ) { }

  startConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(environment.urlNotificationsHub + 'mainHub', {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
      })
      .build();

    this.hubConnection
      .start()
      .then(() => {
        this.updateAppsConnected();
      })
      .catch(err => console.log('Error while starting connection: ' + err));
  }

  startReceiveMessage = () => {
    this.hubConnection.on('receiveMessage', (message) => {
      if (message.includes('refreshorder')) {
        this.tableService2ItemService.refrestInProgressItems(environment.tenantId);

      } else {
        this.toastr.success(message);

        let notification = new Notification(uuidv4(), 'Some title', message, new Date(), 'Some type', false);

        this.notificationService.saveNotificationToStorage(notification);
      }
      
    });
  }

  updateAppsConnected = () => {
      this.hubConnection.invoke('SetConnectionId', this.appName).then(() => {
        this.hubConnection.invoke('GetAppIds').then((appIds) => {
          console.log('appIds:-->', appIds);
          this.appsConnectedBehaviorSubject.next(appIds);
        })
      });
  }

  // sendNotificationByAppName = (message: string, appName: string) => {
  //   let connectionIds: string[] = this.appsConnectedBehaviorSubject.getValue().map(a => a.notificationAppData).filter(a => a.appName == appName).map(e => e.connectionId);

  //   this.hubConnection.invoke('sendMessage', message, connectionIds)
  //     .catch(err => console.error(err));
  // }

  sendNotificationByAppName = (message: string, appName: string) => {
      this.hubConnection.invoke('sendMessageByAppName', message, appName)
        .catch(err => console.error(err));
    }

  sendNotificationByAppGuid = (message: string, appGuid: string) => {
    let connectionId: string = this.appsConnectedBehaviorSubject.getValue().find(q => q.appGuid == appGuid)?.notificationAppData.connectionId ?? '';

    this.hubConnection.invoke('sendMessage', message, [connectionId])
      .catch(err => console.error(err));
  }
}
