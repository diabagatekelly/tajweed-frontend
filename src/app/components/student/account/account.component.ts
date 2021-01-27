import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { D3Service } from '../../../services/d3.service';
import { DatePipe } from '@angular/common';
import { Renderer2 } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  @ViewChild("svgDiv") svgDiv: ElementRef;
  editForm: FormGroup;
  passwordForm: FormGroup;

  user;
  stats = [];

  ruleList = [
    {code: "ghunnah",
    name: "Ghunnah"}, 
    {code: "hamzatWasl",
    name: "Hamzat-ul-Wasl"}, 
    {code: "idghaamGhunnah",
    name: "Idghaam w/ Ghunnah"}, 
    {code: "idghaamNoGhunnah",
    name: "Idghaam w/ no Ghunnah"}, 
    {code: "ikhfa",
    name: "Ikhfa"}, 
    {code: "iqlab",
    name: "Iqlab"}, 
    {code: "madd",
    name: "Long Madd"}, 
    {code: "madd246",
    name: "Madd optional 2, 4 or 6"}, 
    {code: "qalqalah",
    name: "Qalqalah"}].sort((a, b) => (a.code > b.code) ? 1 : -1)

    newD3;  

  constructor(private authService: AuthService, private datePipe: DatePipe, private d3: D3Service, private renderer2: Renderer2) {

    this.authService.authStatus().subscribe(u => {
      console.log(u)
      this.user = u["user"];

      this.editForm.setValue({
        username: u["user"].username,
        firstName: u["user"].firstName,
        lastName: u["user"].lastName,
        email: u["user"].email
      })

      this.passwordForm.setValue({
        username: u["user"].username,
        current: '',
        new: ''
      })

      this.stats = u["tajweed"].sort((a, b) => (a.code > b.code) ? 1 : -1)
      this.stats.forEach(i => {
        let sorted = {};
        if (i.practice.length !== 0) {
          i.practice.forEach((session) => {
            let newDate = this.datePipe.transform(session.practice_date, 'fullDate', '+0000')
            if (sorted[newDate]) {
              sorted[newDate]["count"]++;
              sorted[newDate]["ayah_count"] += session.ayah_count

            } else {
              sorted[newDate] = {}
              sorted[newDate]["count"] = 1
              sorted[newDate]["ayah_count"] = session.ayah_count
            }
          })
        }
        i['sorted_practice'] = sorted  
      })
      console.log(this.stats)
    })
   }

   generateGraph(rule) {
     let ruleData = []
     let ruleObj = this.stats.filter(i => i.code === rule)
     if (ruleObj[0].test.length !== 0) {
      ruleObj[0].test.forEach((t) => {
        let newTestDate = this.datePipe.transform(t.test_date, 'y-MM-dd', '+0000')
        ruleData.push({date: new Date(newTestDate), value: Number(((t.test_score_correct/t.test_out_of_count)*100).toFixed(1))})
      })
    }

    this.d3.buildSvg(rule)
    this.d3.addXandYAxis(ruleData);
    this.d3.drawLineAndPath(ruleData);
     
   }

  ngOnInit(): void {  
    this.editForm = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      username: new FormControl('', [Validators.required])
    })

    this.passwordForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      current: new FormControl('', [Validators.required]),
      new: new FormControl('', [Validators.required])
    })

  }

  editProfile() {

  }
  
  resetPassword() {

  }
  

}
