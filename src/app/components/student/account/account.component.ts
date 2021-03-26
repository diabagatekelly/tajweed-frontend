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
import { TajweedService } from 'src/app/services/tajweed.service';
import { RuleService } from 'src/app/services/rules.service';
import {RULELIST} from '../../../shared/ruleList';


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
  ruleForm: FormGroup;

  userUpdated = false;
  passwordUpdated = false;
  studentAdded = false;
  ruleAddSuccess = false;
  ruleEditSuccess = false;
  error = false;
  openPopup = false;
  editMode = false;

  user;
  student_list = [];
  stats = [];

  ruleList = [];

  newD3;  

  constructor(private rule: RuleService, private statService: StatsService, private studentService: StudentsService, private authService: AuthService, private datePipe: DatePipe, private d3: D3Service, private renderer2: Renderer2, private modalService: BsModalService, private router: Router, private rules: TajweedService) {
   

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
    this.ruleList = RULELIST.sort((a, b) => (a.code > b.code) ? 1 : -1)
    console.log(this.ruleList)
    console.log(RULELIST)
    
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

    this.ruleForm = new FormGroup({
      rule_code: new FormControl('', [Validators.required]),
      rule_name: new FormControl(''),
      rule_summary: new FormControl(''),
      rule_details: new FormControl(''),
      rule_example: new FormControl(''),
      rule_audio: new FormControl(''),
      rule_with_exercise: new FormControl(false)
    })

    let resetData = {}
    RULELIST.forEach((r) => {
      resetData[`${r.code}-practice`] = new FormControl(false)
      resetData[`${r.code}-test`] = new FormControl(false)
    })

    this.resetForm = new FormGroup(resetData)
   
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
    
    let setData = {}
    RULELIST.forEach((r) => {
      setData[`${r.code}-practice`] = e.target.checked ? true : false
      setData[`${r.code}-test`] =  this.resetForm.controls[`${r.code}-test`].value
    })

    this.resetForm.setValue(setData)  
  }

  toggleTestCheck(e) {
    let setData = {}
    RULELIST.forEach((r) => {
      setData[`${r.code}-practice`] =  this.resetForm.controls[`${r.code}-practice`].value
      setData[`${r.code}-test`] = e.target.checked ? true : false
    })

    this.resetForm.setValue(setData)
   
}
  
ruleHandling(mode) {

  if (mode !== 'add') {
    this.editMode = true;
    this.rules.fetchOneRule(this.user.username, mode).subscribe(res => {
 
      this.ruleForm.setValue({
        rule_code: res['rule'].code,
        rule_name: res['rule'].name,
        rule_summary: res['rule'].summary,
        rule_details: res['rule'].details,
        rule_example: res['rule'].example,
        rule_audio: res['rule'].audio,
        rule_with_exercise: res['rule'].with_exercise
      })
    })
    
  } else if (mode === 'add') {
    this.editMode = false;

    this.ruleForm.setValue({
      rule_code: '',
      rule_name: '',
      rule_summary: '',
      rule_details: '',
      rule_example: '',
      rule_audio: '',
      rule_with_exercise: false
    })
  }
}

processRule() {
  let mode;
  if (this.editMode == false) {
    mode = 'add'
  } else {
    mode = 'edit'
  }
  console.log(this.ruleForm.value)
  this.rules.addEditRule(this.user.username, this.ruleForm.value, mode).subscribe(res => {
    if (res['result'] === 'success') {
      this.stats = res['tajweed'].sort((a, b) => (a.code > b.code) ? 1 : -1)
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

      this.rule.reset()

      let resetData = {}

      this.rules.fetchRules().subscribe(res => {
        let l = res['rules'].length
        res['rules'].forEach((r) => {
          this.rule.addRule(r, l)
          resetData[`${r.code}-practice`] = new FormControl(false)
          resetData[`${r.code}-test`] = new FormControl(false)
        })
      })

    this.resetForm = new FormGroup(resetData)
  
    }

  })
}

deleteRule(code) {
  this.rules.deleteRule(this.user.username, code).subscribe(res => {
    if (res['result'] === 'deleted') {
      this.stats = res['tajweed'].sort((a, b) => (a.code > b.code) ? 1 : -1)
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
      this.rule.reset()

      let resetData = {}

      this.rules.fetchRules().subscribe(res => {
        let l = res['rules'].length
        res['rules'].forEach((r) => {
          this.rule.addRule(r, l)
          resetData[`${r.code}-practice`] = new FormControl(false)
          resetData[`${r.code}-test`] = new FormControl(false)
        })
      })

      this.resetForm = new FormGroup(resetData)
    }
  })
}
}
