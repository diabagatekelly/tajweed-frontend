import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  user

  constructor(private authService: AuthService) {
    this.authService.authStatus().subscribe(u => {
      console.log(u)
      this.user = u["user"];
    })
   }

  ngOnInit(): void {
  }

}
