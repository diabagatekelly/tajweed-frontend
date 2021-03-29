import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StudentsService {
  addStudentUrl = `${environment.backend}/api/add_student`;
  removeStudentUrl = `${environment.backend}/api/remove_student`;
  fetchStudentUrl = `${environment.backend}/api/fetch_student`;


  constructor(private http: HttpClient) {}

  add_student(user, data) {
    console.log(user, data)
    return this.http.post(this.addStudentUrl, {username: user, data: data})
  }

  fetch_student(teacher, student) {
    return this.http.post(this.fetchStudentUrl, {teacher: teacher, student : student})
  }

  remove_student(student, teacher) {
    return this.http.post(this.removeStudentUrl, {student: student, teacher: teacher})
  }


}
