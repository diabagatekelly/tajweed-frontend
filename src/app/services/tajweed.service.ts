import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TajweedService {
  url = 'http://127.0.0.1:5000/generate_ayat'

  constructor(private http: HttpClient) { }

  getAyah(rule, range) {
    return this.http.post(this.url, {ruleChosen: rule, range: range})
  }


}
