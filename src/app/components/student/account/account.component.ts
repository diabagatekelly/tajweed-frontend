import { Component, ElementRef, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { D3Service } from '../../../services/d3.service';
import { DatePipe } from '@angular/common';
import { Renderer2 } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { StudentsService } from 'src/app/services/students.service';
import { StatsService } from 'src/app/services/stats.service';



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
  allForm: FormGroup;
  studentForm: FormGroup;

  userUpdated = false;
  passwordUpdated = false;
  studentAdded = false;
  error = false;
  openPopup = false;

  user;
  student_list = [];
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

  constructor(private statService: StatsService, private studentService: StudentsService, private authService: AuthService, private datePipe: DatePipe, private d3: D3Service, private renderer2: Renderer2, private modalService: BsModalService, private router: Router) {
   

    this.authService.authStatus().subscribe(u => {
      console.log(u)

      this.user = u["user"];
      this.student_list = u["user"]["students"]

      this.editForm.setValue({
        username: u["user"].username,
        first_name: u["user"].first_name,
        last_name: u["user"].last_name,
        email: u["user"].email
      })

      this.studentForm.setValue({
        student_username: '',
        student_firstName: '',
        student_lastName: ''
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

      console.log('on load', this.stats)

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

    this.studentForm = new FormGroup({
      student_firstName: new FormControl('', [Validators.required]),
      student_lastName: new FormControl('', [Validators.required]),
      student_username: new FormControl('', [Validators.required])
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

    // this.allForm = new FormGroup({
    //   all_practice: new FormControl(false),
    //   all_test: new FormControl(false)
    // })

    this.resetForm = new FormGroup({
      ghunnah_practice: new FormControl(false),
      ghunnah_test: new FormControl(false),
      idghaamGhunnah_practice: new FormControl(false),
      idghaamGhunnah_test: new FormControl(false),
      idghaamNoGhunnah_practice: new FormControl(false),
      idghaamNoGhunnah_test: new FormControl(false),
      ikhfa_practice: new FormControl(false),
      ikhfa_test: new FormControl(false),
      iqlab_practice: new FormControl(false),
      iqlab_test: new FormControl(false),
      madd246_practice: new FormControl(false),
      madd246_test: new FormControl(false),
      madd_practice: new FormControl(false),
      madd_test: new FormControl(false),
      qalqalah_practice: new FormControl(false),
      qalqalah_test: new FormControl(false)
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
    let practice = [];
    let test = [];
    for (let i in this.resetForm.value) {
      if (this.resetForm.value[i] === true) {
        if (i.includes('practice')) {
          practice.push(i)
        }

        if (i.includes('test')) {
          test.push(i)
        }
      }
    }

    if (practice.length !== 0) {
      this.statService.reset_practice(this.user.username, practice, 'self').subscribe(res => {
        console.log(res)
        this.stats = res["allTajArr"].sort((a, b) => (a.code > b.code) ? 1 : -1)
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
      })
    }
    console.log(test)
    if (test.length !== 0) {
      this.statService.reset_test(this.user.username, test, 'self').subscribe(res => {
        console.log(res)
        this.stats = res["allTajArr"].sort((a, b) => (a.code > b.code) ? 1 : -1)
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
      })
    }
  }

  addStudent() {
    this.studentService.add_student(this.user.username, this.studentForm.value).subscribe(res => {
      this.user = res['user']
      this.student_list = res['user']['students']
    })    
  }

  removeStudent(student) {
    console.log(student)
    this.studentService.remove_student(student,this.user.username).subscribe(res => {
      this.user = res['user']
      this.student_list = res['user']['students']
    })
  }

  togglePracticeCheck(e) {
        this.resetForm.setValue({
          ghunnah_practice: e.target.checked ? true : false,
          idghaamGhunnah_practice: e.target.checked ? true : false,
          idghaamNoGhunnah_practice: e.target.checked ? true : false,
          ikhfa_practice: e.target.checked ? true : false,
          iqlab_practice: e.target.checked ? true : false,
          madd246_practice: e.target.checked ? true : false,
          madd_practice: e.target.checked ? true : false,
          qalqalah_practice: e.target.checked ? true : false,
          ghunnah_test: this.resetForm.controls['ghunnah_test'].value,
          idghaamGhunnah_test: this.resetForm.controls['idghaamGhunnah_test'].value,
          idghaamNoGhunnah_test: this.resetForm.controls['idghaamNoGhunnah_test'].value,
          ikhfa_test: this.resetForm.controls['ikhfa_test'].value,
          iqlab_test: this.resetForm.controls['iqlab_test'].value,
          madd246_test: this.resetForm.controls['madd246_test'].value,
          madd_test: this.resetForm.controls['madd_test'].value,
          qalqalah_test: this.resetForm.controls['qalqalah_test'].value
        })      
  }

  toggleTestCheck(e) {
    this.resetForm.setValue({
      ghunnah_practice: this.resetForm.controls['ghunnah_practice'].value,
      idghaamGhunnah_practice: this.resetForm.controls['idghaamGhunnah_practice'].value,
      idghaamNoGhunnah_practice: this.resetForm.controls['idghaamNoGhunnah_practice'].value,
      ikhfa_practice: this.resetForm.controls['ikhfa_practice'].value,
      iqlab_practice: this.resetForm.controls['iqlab_practice'].value,
      madd246_practice: this.resetForm.controls['madd246_practice'].value,
      madd_practice: this.resetForm.controls['madd_practice'].value,
      qalqalah_practice: this.resetForm.controls['qalqalah_practice'].value,
      ghunnah_test: e.target.checked ? true : false,
      idghaamGhunnah_test: e.target.checked ? true : false,
      idghaamNoGhunnah_test: e.target.checked ? true : false,
      ikhfa_test: e.target.checked ? true : false,
      iqlab_test: e.target.checked ? true : false,
      madd246_test: e.target.checked ? true : false,
      madd_test: e.target.checked ? true : false,
      qalqalah_test: e.target.checked ? true : false
    })      
}
  

}
