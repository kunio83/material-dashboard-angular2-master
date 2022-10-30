import { Injectable } from '@angular/core';
import * as signalR from '@aspnet/signalr';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignalrService {
  hubConnection: signalR.HubConnection;
  private appsConnectedBehaviorSubject: BehaviorSubject<any> = new BehaviorSubject<any>([]);


  constructor() { }

  startConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
                            .withUrl('https://localhost:5001/mainHub',{
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

askServer = () => {
    this.hubConnection.invoke('askServer','hola')
    .catch(err => console.error(err));
  }

  askServerListener = () => {
    this.hubConnection.on('askServerResponse', (message) => {
      //console.log(message);
      alert(message);
    });
  }

  updateAppsConnected = () => {
    this.hubConnection.invoke('GetConnectionId').then((connectionId) => {
      this.hubConnection.invoke('SetConnectionId', 'optirest-admin;'+connectionId).then(() => {
        this.hubConnection.invoke('GetAppIds').then((appIds) => {
          console.log('appIds', appIds);
          this.appsConnectedBehaviorSubject.next(appIds);
        })
      });
    })
  };
}
