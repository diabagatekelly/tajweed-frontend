import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TajweedService {
  ayahUrl = 'http://127.0.0.1:5000/generate_ayat';
  explUrl = 'http://127.0.0.1:5000/get_explanation';

  constructor(private http: HttpClient) { }

  getAyah(rule, range, activity) {
    console.log(range)
    return this.http.post(this.ayahUrl, {ruleChosen: rule, range: range, activity: activity})
  }

  getExpl(rule) {
    return this.http.post(this.explUrl, {ruleChosen: rule})
  }


}
