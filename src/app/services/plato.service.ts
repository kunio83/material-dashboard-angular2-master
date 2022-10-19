import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ItemCategory } from 'app/models/itemCategory';
import { observable, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlatoService {

  baseUrl: string = 'https://optirestapi-v1.azurewebsites.net/api/';

  constructor(private httpClient: HttpClient) { }
  
  getItemCategories(tenantId: number): Observable<ItemCategory[]>{
    return this.httpClient.get<ItemCategory[]>(this.baseUrl + 'ItemCategory?tenantId=' + tenantId);
  }
}
