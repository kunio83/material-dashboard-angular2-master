import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CocinaService {

  constructor(private httpClient: HttpClient) { }

  getCocinaLista(tenantId: number){
    return this.httpClient.get(environment.apiBaseURI + 'Kitchen?tenantId=' + tenantId);
  }
}
