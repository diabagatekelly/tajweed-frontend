import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TajweedService {
  ayahUrl = 'http://localhost:4200/api/generate_ayat';
  explUrl = 'http://localhost:4200/api/get_explanation';
  fetchRulesUrl = 'http://localhost:4200/api/fetch_rules';
  fetchOneRuleUrl = 'http://localhost:4200/api/fetch_single_rule';
  addEditRuleUrl = 'http://localhost:4200/api/add_edit_rule';
  deleteRuleUrl = 'http://localhost:4200/api/delete_rule';

  constructor(private http: HttpClient) { }

  getAyah(rule, range, activity) {
    console.log(range)
    return this.http.post(this.ayahUrl, {ruleChosen: rule, range: range, activity: activity})
  }

  getExpl(rule) {
    return this.http.post(this.explUrl, {ruleChosen: rule})
  }


  fetchRules() {
  return this.http.get(this.fetchRulesUrl)
  }

  fetchOneRule(user, code) {
    return this.http.post(this.fetchOneRuleUrl, {code: code, user: user})
  }

  addEditRule(user, ruleData, mode) {
    return this.http.post(this.addEditRuleUrl, {user: user, ruleData: ruleData, mode: mode})
  }

  deleteRule(user, code) {
    return this.http.post(this.deleteRuleUrl, {user: user, code: code})
  }


}
