import { Injectable } from '@angular/core';
 
import { Rule } from '../shared/rule';
import { RULELIST } from '../shared/ruleList';
 
@Injectable()
export class RuleService {
 
  constructor() { }
 
  getRules(): Rule[] {
    return RULELIST;
  }
 
 addRule(rule, length) {
    if (RULELIST.length < length) {
      RULELIST.push(rule)
    }     
 }

 reset() {
  RULELIST.splice(0, RULELIST.length)
 } 

}