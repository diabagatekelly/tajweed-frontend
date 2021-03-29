import { EventEmitter, Injectable, Output } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from '../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  

  authUrl = `${environment.backend}/api/auth`;
  verifyAuthUrl = `${environment.backend}/api/verify_auth`;
  updateUserUrl = `${environment.backend}/api/update_user`;
  resetPasswordUrl = `${environment.backend}/api/reset_password`;
  deleteUserUrl = `${environment.backend}/api/delete_user`;
  logoutUrl = `${environment.backend}/api/logout`;
  
  constructor(private http: HttpClient) {}

  headers = new HttpHeaders({
    'Content-Type': 'text/plain'
  })

  auth(data, mode) {
    let strData = JSON.stringify(data)
    let strMode = JSON.stringify(mode)
    let dataObj = {data: strData, mode: strMode}
    let complete = JSON.stringify(dataObj)
    console.log(complete)
    return this.http.post(this.authUrl, complete, {headers: this.headers})
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
