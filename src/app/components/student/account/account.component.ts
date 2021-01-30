import { Component, ElementRef, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { D3Service } from '../../../services/d3.service';
import { DatePipe } from '@angular/common';
import { Renderer2 } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';


@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  @ViewChild("svgDiv") svgDiv: ElementRef;
  modalRef: BsModalRef;

  editForm: FormGroup;
  passwordForm: FormGroup;
  resetForm: FormGroup;
  deleteForm: FormGroup;

  userUpdated = false;
  passwordUpdated = false;
  error = false;
  openPopup = false;

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

  constructor(private authService: AuthService, private datePipe: DatePipe, private d3: D3Service, private renderer2: Renderer2, private modalService: BsModalService, private router: Router) {
   

    this.authService.authStatus().subscribe(u => {
      console.log(u)
      this.user = u["user"];

      this.editForm.setValue({
        username: u["user"].username,
        first_name: u["user"].first_name,
        last_name: u["user"].last_name,
        email: u["user"].email
      })

      this.passwordForm.setValue({
        username: u["user"].username,
        current: '',
        new: ''
      })

      this.deleteForm.setValue({
        username: u["user"].username,
        password: '',
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
      first_name: new FormControl('', [Validators.required]),
      last_name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      username: new FormControl('', [Validators.required])
    })

    this.passwordForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      current: new FormControl('', [Validators.required]),
      new: new FormControl('', [Validators.required])
    })

    this.deleteForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    })

    this.resetForm = new FormGroup({
      all_practice: new FormControl(''),
      all_test: new FormControl('', [Validators.required]),
      ghunnah_practice: new FormControl('', [Validators.required]),
      ghunnah_test: new FormControl('', [Validators.required]),
      idghaamGhunnah_practice: new FormControl('', [Validators.required]),
      idghaamGhunnah_test: new FormControl('', [Validators.required]),
      idghaamNoGhunnah_practice: new FormControl('', [Validators.required]),
      idghaamNoGhunnah_test: new FormControl('', [Validators.required]),
      ikhfa_practice: new FormControl('', [Validators.required]),
      ikhfa_test: new FormControl('', [Validators.required]),
      iqlab_practice: new FormControl('', [Validators.required]),
      iqlab_test: new FormControl('', [Validators.required]),
      madd246_practice: new FormControl('', [Validators.required]),
      madd246_test: new FormControl('', [Validators.required]),
      madd_practice: new FormControl('', [Validators.required]),
      madd_test: new FormControl('', [Validators.required]),
      qalqalah_practice: new FormControl('', [Validators.required]),
      qalqalah_test: new FormControl('', [Validators.required]),
    })

    console.log(this.resetForm)

  }

  editProfile() {
    this.authService.update_user(this.editForm.value).subscribe((res => {
      console.log(res)
      if (res["user"]) {
        this.userUpdated = true;
      } else {
        this.error = true;
      }
    }))
  }
  
  resetPassword() {
    this.authService.reset_password(this.passwordForm.value).subscribe((res => {
      console.log(res)
      if (res["response"] == 'success') {
        this.passwordUpdated = true;
      } else {
        this.error = true;
      }
    }))
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  deleteUser() {
    this.authService.delete_user(this.deleteForm.value).subscribe(res => {
      if (res['response'] === 'deleted') {
       this.authService.logout().subscribe(res => {
        this.router.navigate(['/student-hub']);
       })
      }
     
    })
  }

  resetStats() {
    console.log(this.resetForm.value);
  }
  

}
