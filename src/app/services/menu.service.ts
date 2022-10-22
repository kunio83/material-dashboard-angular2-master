import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Item } from 'app/models/item';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(private httpClient : HttpClient) { }

  getMenu(tenantId : number): Observable<Item[]>{
    return this.httpClient.get<Item[]>(environment.apiBaseURI + 'Item?tenantId=' + tenantId);
  }

  postItem(formData){
    return this.httpClient.post(environment.apiBaseURI + 'Item', formData);
  }

  putItem(formData){
    return this.httpClient.put(environment.apiBaseURI + 'Item', formData);
  }

  deleteItem(id: number){
    return this.httpClient.delete(environment.apiBaseURI + 'Item/' + id);
  }

  getCategorias(tenantId: number){
    return this.httpClient.get(environment.apiBaseURI + 'ItemCategory?tenantId=' + tenantId);
  }



}
