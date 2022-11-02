import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ItemStateService {

  constructor(private httpClient : HttpClient) { }

  getItemStates(){
    return this.httpClient.get(environment.apiBaseURI + 'ItemState');
  }
}
