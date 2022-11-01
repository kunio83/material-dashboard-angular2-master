import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TableService2Item } from 'app/models/tablesService2Item';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TableService2ItemService {

  constructor(private httpClient : HttpClient) { }

  getTableService2Items(tableServiceId : number) : Observable<TableService2Item[]>{
    return this.httpClient.get<TableService2Item[]>(environment.apiBaseURI + 'TableService2Item/byTableService?tableServiceId=' + tableServiceId);
  }

  addTableService2Item(tableService2Item : TableService2Item){
    return this.httpClient.post(environment.apiBaseURI + 'TableService2Item', tableService2Item);
  }

  updateTableService2Item(tableService2Item : TableService2Item){
    return this.httpClient.put(environment.apiBaseURI + 'TableService2Item', tableService2Item);
  }

  deleteTableService2Item(id : number){
    return this.httpClient.delete(environment.apiBaseURI + 'TableService2Item/' + id);
  }

  getInProgressItems(tenantId : number) : Observable<TableService2Item[]>{
    return this.httpClient.get<TableService2Item[]>(environment.apiBaseURI + 'TableService2Item/inProgressItems?tenantId=' + tenantId);
  }

  getInProgressbyKitchen(kitchenId : number) : Observable<TableService2Item[]>{
    return this.httpClient.get<TableService2Item[]>(environment.apiBaseURI + 'TableService2Item/inProgressItemsByKitchen?kitchenId=' + kitchenId);
  }
}
