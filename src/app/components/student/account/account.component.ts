import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { D3Service } from '../../../services/d3.service';
import { DatePipe } from '@angular/common';
import { Renderer2 } from '@angular/core';


@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  @ViewChild("svgDiv") svgDiv: ElementRef;


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

    //public title = 'Line Chart';
    data: any[] = [
      {date: new Date('2010-01-01'), value: 40},
      {date: new Date('2010-01-04'), value: 93},
      {date: new Date('2010-01-05'), value: 95},
      {date: new Date('2010-01-06'), value: 130},
      {date: new Date('2010-01-07'), value: 110},
      {date: new Date('2010-01-08'), value: 120},
      {date: new Date('2010-01-09'), value: 129},
      {date: new Date('2010-01-10'), value: 107},
      {date: new Date('2010-01-11'), value: 140},
    ];

   
  

  constructor(private authService: AuthService, private datePipe: DatePipe, private d3: D3Service, private renderer2: Renderer2) {

    this.authService.authStatus().subscribe(u => {
      console.log(u)
      this.user = u["user"];
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
    // const childElements = this.svgDiv.nativeElement.childNodes;
    // for (let child of childElements) {
    //   this.renderer2.removeChild(this.svgDiv.nativeElement, child);
    // }

    // let svg = this.renderer2.createElement('svg');
    // this.renderer2.setAttribute(svg, 'width', '900');
    // this.renderer2.setAttribute(svg, 'height', '500');

    // this.renderer2.appendChild(this.svgDiv.nativeElement, svg)


     let ruleData = []
     let ruleObj = this.stats.filter(i => i.code === rule)
     if (ruleObj[0].test.length !== 0) {
      ruleObj[0].test.forEach((t) => {
        let newTestDate = this.datePipe.transform(t.test_date, 'y-MM-dd', '+0000')
        ruleData.push({date: new Date(newTestDate), value: Number(((t.test_score_correct/t.test_out_of_count)*100).toFixed(1))})
      })
    }

    // this.model = new Model(ruleData);
    
    // this.model.buildSvg();
    // this.model.addXandYAxis();
    // this.model.drawLineAndPath();

    this.d3.buildSvg(rule)
   this.d3.addXandYAxis(ruleData);
   this.d3.drawLineAndPath(ruleData);
     
   }

   public ngOnInit(): void {  
  }
  
  

}
