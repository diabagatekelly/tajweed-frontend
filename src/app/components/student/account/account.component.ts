import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
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

  constructor(private authService: AuthService) {
    this.authService.authStatus().subscribe(u => {
      console.log(u)
      this.user = u["user"];
      this.stats = u["tajweed"].sort((a, b) => (a.code > b.code) ? 1 : -1)
      this.stats.forEach(i => {
        let sorted;
        if (i.practice.length !== 0) {
        sorted = i.practice.reduce(function(acc,next){
          let index = 0;
            if(i.practice.indexOf(next) !== -1){
                if(acc.length !== 0 && acc[index].date == next.practice_date){
                   acc[index].date_count++
                   acc[index].ayah += next.ayah_count
                   index++
                } else {
                  acc.push({date: next.practice_date, date_count : 1, ayah: next.ayah_count})
                  index++
                }
            }
            return acc;
        }, []);
        }
        i['sorted_practice'] = sorted
      })
      console.log(this.stats)
    })
   }

  ngOnInit(): void {
  }

}
