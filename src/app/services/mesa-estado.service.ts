import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MesaEstadoService {

  constructor(private httpClient : HttpClient) { }

  getMesaEstados(){
    return this.httpClient.get(environment.apiBaseURI + 'TableState');
  }


}
