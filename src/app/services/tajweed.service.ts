import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TajweedService {
  ayahUrl = `${environment.backend}/api/generate_ayat`;
  explUrl = `${environment.backend}/api/get_explanation`;
  fetchRulesUrl = `${environment.backend}/api/fetch_rules`;
  fetchOneRuleUrl = `${environment.backend}/api/fetch_single_rule`;
  addEditRuleUrl = `${environment.backend}/api/add_edit_rule`;
  deleteRuleUrl = `${environment.backend}/api/delete_rule`;

  constructor(private http: HttpClient) { }

  getAyah(rule, range, activity) {
    console.log(range)
    return this.http.post(this.ayahUrl, JSON.stringify({ruleChosen: rule, range: range, activity: activity}))
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
