import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import {AuthService} from '../../services/auth.service';


@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css']
})
export class StartComponent implements OnInit {
  mode = 'register'

  firstName = new FormControl('', [Validators.required])
  lastName = new FormControl('', [Validators.required])
  email = new FormControl('', [Validators.required, Validators.email])
  username = new FormControl('', [Validators.required])
  password = new FormControl('', [Validators.required])
  
  constructor(private auth: AuthService) {}

  ngOnInit(): void {}

  handleRegisterForm() {
    let data = {
      firstName: this.firstName.value || '', 
      lastName: this.lastName.value || '',
      email: this.email.value || '',
      username: this.username.value,
      password: this.password.value
    }

    this.auth.auth(data, this.mode).subscribe(res => {
      console.log(res)
    })
  }


}
