import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StudentsService {
  addStudentUrl = 'http://localhost:4200/api/add_student';
  removeStudentUrl = 'http://localhost:4200/api/remove_student';
  fetchStudentUrl = 'http://localhost:4200/api/fetch_student';


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
