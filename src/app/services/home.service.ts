import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Country } from 'app/models/country';
import { State } from 'app/models/state';
import { City } from 'app/models/city';
import { observable, Observable } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  //baseUrl: string = 'https://optirestapi-v1.azurewebsites.net/api/';

  constructor(private httpClient: HttpClient) { }

  getCountry(countryId: number): Observable<Country>{
    return this.httpClient.get<Country>(environment.apiBaseURI + 'country/' + countryId);
  }

  getCountries(): Observable<Country[]>{
    return this.httpClient.get<Country[]>(environment.apiBaseURI+ 'country/');
  }

  getCities(stateId: number): Observable<State>{
    return this.httpClient.get<State>(environment.apiBaseURI + 'state/' + stateId);
  }
}