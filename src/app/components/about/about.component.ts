import { Component, OnInit } from '@angular/core';
import {RULELIST} from '../../shared/ruleList';


@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  ruleList = []
  constructor() { }

  ngOnInit(): void {
    this.ruleList = RULELIST.sort((a, b) => (a.code > b.code) ? 1 : -1)
    console.log(this.ruleList)
    console.log(RULELIST)
  }

}
