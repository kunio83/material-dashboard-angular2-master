import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TableServiceStateService {

  constructor(private httpClient : HttpClient) { }

  getTableServiceStates() {
    return this.httpClient.get(environment.apiBaseURI + 'ServiceState');
  }

  
}
