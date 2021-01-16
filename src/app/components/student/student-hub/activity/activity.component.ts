import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.css']
})
export class ActivityComponent implements OnInit {
  @Input('activity') activity: string
  @Input('user') user: Object

  constructor() { }

  ngOnInit(): void {
    console.log(this.user)
  }

}
