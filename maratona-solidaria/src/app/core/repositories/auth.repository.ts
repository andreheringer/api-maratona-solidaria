import { Observable } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthRepository {
  constructor(private http: HttpClient) {}

  public login(email: String, password: String): Observable<any> {
    let body = JSON.stringify({
      email: email,
      password: password,
    });
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post(environment.apiUrl + 'auth/login', body, {
      headers: header,
    });
  }
}
