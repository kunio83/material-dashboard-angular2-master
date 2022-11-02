import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { BusinessConfig } from 'app/models/businessConfig';

@Injectable({
    providedIn: 'root'
})  
export class BusinessConfigService {

    constructor(private httpClient: HttpClient) { }

    getBusinessConfig(tenantId: number): Observable<BusinessConfig[]> {
        return this.httpClient.get<BusinessConfig[]>(environment.apiBaseURI + 'BusinessConfig?tenantId=' + tenantId);
    }
    postBusinessConfig(formData) {
        return this.httpClient.post(environment.apiBaseURI + 'BusinessConfig', formData);
    }

    putBusinessConfig(formData) {
        return this.httpClient.put(environment.apiBaseURI + 'BusinessConfig', formData);
    }
    getBusinessConfigLista(tenantId: number) {
        return this.httpClient.get(environment.apiBaseURI + 'BusinessConfig?tenantId=' + tenantId);
    }
}