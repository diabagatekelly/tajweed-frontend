import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-student-hub',
  templateUrl: './student-hub.component.html',
  styleUrls: ['./student-hub.component.css']
})
export class StudentHubComponent implements OnInit {
  activity = ''
  action = ''

  constructor() { }

  ngOnInit(): void {
    console.log(this.activity)
  }

  setActivity(choice) {
    this.activity = choice;
    this.action = 'working';
  }

}
