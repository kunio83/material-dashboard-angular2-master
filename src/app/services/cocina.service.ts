import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Kitchen } from 'app/models/kitchen';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CocinaService {

  constructor(private httpClient: HttpClient) { }

  getCocinaLista(tenantId: number) {
    return this.httpClient.get(environment.apiBaseURI + 'Kitchen?tenantId=' + tenantId);
  }
  postCocina(formData) {
    return this.httpClient.post(environment.apiBaseURI + 'Kitchen', formData);
  }
  putCocina(formData) {
    return this.httpClient.put(environment.apiBaseURI + 'Kitchen', formData);
  }
  deleteCocina(id: number) {
    return this.httpClient.delete(environment.apiBaseURI + 'Kitchen/' + id);
  }
  getCocinas(tenantId: number): Observable<Kitchen[]> {
    return this.httpClient.get<Kitchen[]>(environment.apiBaseURI + 'Kitchen?tenantId=' + tenantId);
  }
}