import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthGuard } from 'src/app/services/auth/auth.guard';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  authStatus;

  constructor(private authGuard: AuthGuard, private authService: AuthService, private router: Router) {
    this.authGuard.getAuthStatus.subscribe(status => this.updateAuthStatus(status));
   }

  ngOnInit(): void {
  }

  updateAuthStatus(status) {
    this.authStatus = status;
    console.log(this.authStatus)
  }

  logout() {
    this.authService.logout().subscribe(res => {
      this.authStatus = false;
      this.router.navigate(['/start']);

      console.log(res)
    })
  }

}
