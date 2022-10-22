import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from 'app/models/user';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient : HttpClient ) { }

  getUsers(tenantId : number): Observable<User[]>{
    return this.httpClient.get<User[]>(environment.apiBaseURI + 'User/usersByTenant/' + tenantId);
  }

  postUser(formData){
    return this.httpClient.post(environment.apiBaseURI + 'User', formData);
  }

  putUser(formData){
    return this.httpClient.put(environment.apiBaseURI + 'User', formData);
  }

  deleteUser(id: number){
    return this.httpClient.delete(environment.apiBaseURI + 'User/' + id);
  }
}
