import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MesaFormaService {

  constructor(private httpClient : HttpClient) { }

  getMesaFormas(){
    return this.httpClient.get(environment.apiBaseURI + 'TableShape');
  }

}
