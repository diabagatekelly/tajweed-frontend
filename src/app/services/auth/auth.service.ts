import { EventEmitter, Injectable, Output } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authUrl = 'http://localhost:4200/api/auth';
  verifyAuthUrl = 'http://localhost:4200/api/verify_auth';
  logoutUrl = 'http://localhost:4200/api/logout';

  constructor(private http: HttpClient) {}

  auth(data, mode) {
    console.log(data, mode)
    return this.http.post(this.authUrl, {data: data, mode : mode})
  }


authStatus() {
  console.log('checking auth')
  return this.http.get(this.verifyAuthUrl)
}

logout() {
  return this.http.get(this.logoutUrl)
}

}
