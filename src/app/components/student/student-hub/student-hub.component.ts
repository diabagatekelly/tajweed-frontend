import { Component, Input, OnInit } from '@angular/core';


@Component({
  selector: 'app-student-hub',
  templateUrl: './student-hub.component.html',
  styleUrls: ['./student-hub.component.css']
})
export class StudentHubComponent implements OnInit {
  @Input('user') user: Object
  
  activity = ''
  action = ''

  constructor() {
   }

  ngOnInit(): void {
  }

  setActivity(choice) {
    this.activity = choice;
    this.action = 'working';
  }



}
