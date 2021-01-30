import { EventEmitter, Injectable, Output } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authUrl = 'http://localhost:4200/api/auth';
  verifyAuthUrl = 'http://localhost:4200/api/verify_auth';
  updateUserUrl = 'http://localhost:4200/api/update_user';
  resetPasswordUrl = 'http://localhost:4200/api/reset_password';
  deleteUserUrl = 'http://localhost:4200/api/delete_user';
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

update_user(user) {
  return this.http.post(this.updateUserUrl, {user: user})
}

reset_password(data) {
  return this.http.post(this.resetPasswordUrl, {data: data})
}

delete_user(data) {
  return this.http.post(this.deleteUserUrl, {data: data}) 
}

}
