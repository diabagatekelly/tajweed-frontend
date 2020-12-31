import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authUrl = 'http://127.0.0.1:5000/auth';

  constructor(private http: HttpClient) {}

  auth(data, mode) {
    console.log(data, mode)
    return this.http.post(this.authUrl, {data: data, mode : mode})
  }
}
