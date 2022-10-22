import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ItemCategory } from 'app/models/itemCategory';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  constructor(private httpClient: HttpClient) { }


  postCategoria(formData){
    return this.httpClient.post(environment.apiBaseURI + 'ItemCategory', formData);
  }

  
  getCategorias(tenantId: number): Observable<ItemCategory[]>{ 
    return this.httpClient.get<ItemCategory[]>(environment.apiBaseURI + 'ItemCategory?tenantId=' + tenantId);
  }

  putCategoria(formData){
    return this.httpClient.put(environment.apiBaseURI + 'ItemCategory', formData);
  }

  deleteCategoria(id: number){
    return this.httpClient.delete(environment.apiBaseURI + 'ItemCategory/' + id);
  }

  getCategoriaLista(tenantId: number){ 
    console.log(tenantId);
    let list = this.httpClient.get(environment.apiBaseURI + 'ItemCategory?tenantId=' + tenantId);
    console.log(list);
    return list;
  }


}
