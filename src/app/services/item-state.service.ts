import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ItemStateService {
  private itemStatebehaviorSubject: BehaviorSubject<[]> = new BehaviorSubject<[]>([]);

  constructor(private httpClient : HttpClient) { }

  getItemStatesFromDb(){
    this.httpClient.get(environment.apiBaseURI + 'ItemState').subscribe((data: [])=>{
      this.itemStatebehaviorSubject.next(data);
    });
  }

  getItemStates(): Observable<[]>{
    return this.itemStatebehaviorSubject.asObservable();
  }
}
