import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Country } from 'app/models/country';
import { State } from 'app/models/state';
import { City } from 'app/models/city';
import { observable, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  baseUrl: string = 'https://optirestapi-v1.azurewebsites.net/api/';

  constructor(private httpClient: HttpClient) { }

  getCountry(countryId: number): Observable<Country>{
    return this.httpClient.get<Country>(this.baseUrl + 'country/' + countryId);
  }

  getCountries(): Observable<Country[]>{
    return this.httpClient.get<Country[]>(this.baseUrl + 'country/');
  }

  getCities(stateId: number): Observable<State>{
    return this.httpClient.get<State>(this.baseUrl + 'state/' + stateId);
  }
}