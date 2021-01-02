import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';


@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent implements OnInit {
  user

  constructor(private authService: AuthService) {
    this.authService.authStatus().subscribe(u => {
      console.log(u)
      this.user = u["user"];
    })
   }

  ngOnInit(): void {
  }

  // setUser(u) {
  //   this.user = u
  //   console.log(u)
  //   console.log(this.user)
  // }

}
