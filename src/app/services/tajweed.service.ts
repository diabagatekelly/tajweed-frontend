import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TajweedService {
  ayahUrl = 'http://localhost:4200/api/generate_ayat';
  explUrl = 'http://localhost:4200/api/get_explanation';

  constructor(private http: HttpClient) { }

  getAyah(rule, range, activity) {
    console.log(range)
    return this.http.post(this.ayahUrl, {ruleChosen: rule, range: range, activity: activity})
  }

  getExpl(rule) {
    return this.http.post(this.explUrl, {ruleChosen: rule})
  }


}
