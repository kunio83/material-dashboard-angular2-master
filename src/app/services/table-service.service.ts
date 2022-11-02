import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { TableService } from 'app/models/tableService';

@Injectable({
  providedIn: 'root'
})
export class TableServiceService {

  constructor(private httpClient : HttpClient) { }

  getTableServicesLista(tenantId: number){
  return this.httpClient.get(environment.apiBaseURI + 'TableService/byTenant/' + tenantId );
}

  getTableServices(tenantId: number): Observable<TableService[]>{
    return this.httpClient.get<TableService[]>(environment.apiBaseURI + 'TableService/byTenant/' + tenantId );
}
  
  postTableService(formData){ 
    return this.httpClient.post(environment.apiBaseURI + 'TableService', formData);
}

  putTableService(formData){
    return this.httpClient.put(environment.apiBaseURI + 'TableService', formData);

}

  deleteTableService(id: number){
    return this.httpClient.delete(environment.apiBaseURI + 'TableService/' + id);
    
}
}