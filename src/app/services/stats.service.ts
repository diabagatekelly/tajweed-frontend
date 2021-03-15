import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  practiceUrl = 'http://localhost:4200/api/update_practice';
  testUrl = 'http://localhost:4200/api/update_test';
  resetPracticeUrl = 'http://localhost:4200/api/reset_practice';
  resetTestUrl = 'http://localhost:4200/api/reset_test';

  constructor(private http: HttpClient) {}

  update_practice(user, stats) {
    console.log(user, stats)
    return this.http.post(this.practiceUrl, {username: user, stats: stats})
  }

  update_test(user, stats) {
    console.log(stats)
    return this.http.post(this.testUrl, {username: user, stats: stats})
  }

  reset_practice(user, stats, account) {
    console.log(user, stats, account)
    return this.http.post(this.resetPracticeUrl, {username: user, stats: stats, account: account})
  }

  reset_test(user, stats, account) {
    return this.http.post(this.resetTestUrl, {username: user, stats: stats, account: account})
  }


}
