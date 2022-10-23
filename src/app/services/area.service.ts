import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Area } from 'app/models/area';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AreaService {

  constructor( private httpClient: HttpClient) { }

  getAreas(tenantId: number) : Observable<Area[]>{
    return this.httpClient.get<Area[]>(environment.apiBaseURI + 'Area?tenantId=' + tenantId);
  }

  postArea(formData){
    return this.httpClient.post(environment.apiBaseURI + 'Area', formData);
  }

  putArea(formData){
    return this.httpClient.put(environment.apiBaseURI + 'Area', formData);
  }

  deleteArea(id: number){
    return this.httpClient.delete(environment.apiBaseURI + 'Area/' + id);
  }

}
