import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {AuthService} from '../../services/auth/auth.service';


@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css']
})
export class StartComponent implements OnInit {
  mode = 'register'

  first_name = new FormControl('', [Validators.required])
  last_name = new FormControl('', [Validators.required])
  email = new FormControl('', [Validators.required, Validators.email])
  username = new FormControl('', [Validators.required])
  password = new FormControl('', [Validators.required])
  
  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {}

  handleRegisterForm() {
    let data = {
      first_name: this.first_name.value || '', 
      last_name: this.last_name.value || '',
      email: this.email.value || '',
      username: this.username.value,
      password: this.password.value
    }

    this.auth.auth(data, this.mode).subscribe(res => {
      console.log(res)
      if (res["isAuthenticated"] && res["isAuthenticated"] === true) {
        this.router.navigate(['/student-hub']);
      }

    })
  }


}
