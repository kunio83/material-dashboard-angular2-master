import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Table } from 'app/models/table';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MesaService {

  constructor(private httpClient : HttpClient) { }

  getMesas(tenantId : number) : Observable<Table[]>{
    return this.httpClient.get<Table[]>(environment.apiBaseURI + 'Table?tenantId=' + tenantId);
  }

  postMesa(formData){
    return this.httpClient.post(environment.apiBaseURI + 'Table', formData);
  }

  putMesa(formData){
    return this.httpClient.put(environment.apiBaseURI + 'Table', formData);
  }

  deleteMesa(id: number){
    return this.httpClient.delete(environment.apiBaseURI + 'Table/' + id);
  }
  
}
