// import { Component, Input, OnInit } from '@angular/core';
import {  OnInit, Input, Component, Renderer2, ElementRef, } from '@angular/core';
import { FormControl } from '@angular/forms';
import {TajweedService} from '../../../../services/tajweed.service';

import { ViewChild } from '@angular/core';

@Component({
  selector: 'app-activity-form',
  templateUrl: './activity-form.component.html',
  styleUrls: ['./activity-form.component.css']
})


export class ActivityFormComponent implements OnInit {
  @Input('activity') activity: string
  @ViewChild("appAyat") ayatDiv: ElementRef;

  rule = new FormControl('');
  range = new FormControl('');

  status = '';
  ayatArr = []

  constructor(private tajweed: TajweedService, private renderer2: Renderer2) { }

  ngOnInit(): void {
  }

  submitSelected() {    
    const childElements = this.ayatDiv.nativeElement.childNodes;
    for (let child of childElements) {
      this.renderer2.removeChild(this.ayatDiv.nativeElement, child);
    }

    this.tajweed.getAyah(this.rule.value, this.range.value).subscribe(res => {
      console.log(res["ayat"])

      let resultsOverview = res['ayat'].filter(i => i.rule.length !== 0);

      if (resultsOverview.length > 0) {
          this.status = 'go'
      } else {
          this.status = 're-submit'
      }
    
      
   for (let item of res['ayat']) {

    if (item.rule.length === 0) {
      const pNode = this.renderer2.createElement('p');
      const txtNode = this.renderer2.createText(`(${item.surahNumber}:${item.ayahNumber}) ${item.test_ayat}`);
    
      this.renderer2.appendChild(pNode, txtNode);
      this.renderer2.appendChild(this.ayatDiv.nativeElement, pNode);
      
    } else if (item.rule.length !== 0) {
        // $("#practiceAyat").addClass('changeToPointer');

        // $('#scoreBoard').show();
    
        // $('#score').empty();
        // $('#score').append(counter);
    

        // let ayat = item.test_ayat;
        const pNode = this.renderer2.createElement('p');


        let ruleMap = {}

        let newAyat = '';

        for (let r of item.rule) {

            ruleMap[`start${item.rule.indexOf(r)}`] = r.start;
            ruleMap[`end${item.rule.indexOf(r)}`] = r.end;

        }


        for (let i = 0; i < item.rule.length; i++) {
            if (item.rule.length === 1) {
                let ruleSubstr = item.test_ayat.substring(item.rule[0].start, item.rule[0].end);
                let before = item.test_ayat.slice(0, item.rule[0].start);
                let after = item.test_ayat.slice(item.rule[0].end);

                const spanNode = this.renderer2.createElement('span');
                const spanText = this.renderer2.createText(`${ruleSubstr}`);
                this.renderer2.appendChild(spanNode, spanText);
                this.renderer2.addClass(spanNode, 'notFound');

                const begText = this.renderer2.createText(`${before}`);
                const endText = this.renderer2.createText(`${after} (${item.surahNumber}:${item.ayahNumber})`)
              
                this.renderer2.appendChild(pNode, begText);
                this.renderer2.appendChild(pNode, spanNode);
                this.renderer2.appendChild(pNode, endText);


                this.renderer2.appendChild(this.ayatDiv.nativeElement, pNode);

            } else if (item.rule.length > 1) {


                let ruleSubstr = item.test_ayat.substring(ruleMap[`start${i}`], ruleMap[`end${i}`]);

                const spanNode = this.renderer2.createElement('span');
                const spanText = this.renderer2.createText(`${ruleSubstr}`);
                this.renderer2.appendChild(spanNode, spanText);
                this.renderer2.addClass(spanNode, 'notFound');

                if (i === 0) {
                    let before = item.test_ayat.slice(0, ruleMap[`start${i}`]);

                    let concat = newAyat.concat(before)

                    let begText = this.renderer2.createText(`${concat}`);
                    // const endText = this.renderer2.createText(`${after} (${item.surahNumber} : ${item.ayahNumber})`)
                  
                    this.renderer2.appendChild(pNode, begText);
                    this.renderer2.appendChild(pNode, spanNode);
                //     let withClass = this.render.createElement('span');
                // let text = this.render.createText(ruleSubstr);
                // this.render.appendChild(withClass, text)
                // this.render.addClass(withClass, "notFound");
                //     console.log(withClass)
                //     let concat = newAyat.concat(before + withClass)

                    // newAyat = concat

                } else if (i > 0 && i === item.rule.length - 1) {
                    let before = item.test_ayat.slice(ruleMap[`end${i - 1}`], ruleMap[`start${i}`])
                    let after = item.test_ayat.slice(ruleMap[`end${i}`]);

                    let begText = this.renderer2.createText(`${before}`);
                    let endText = this.renderer2.createText(`${after} (${item.surahNumber}:${item.ayahNumber})`)
                    // let withClass = this.render.addClass(ruleSubstr, "notFound");
                    // console.log(withClass)

                    this.renderer2.appendChild(pNode, begText);
                    this.renderer2.appendChild(pNode, spanNode);
                    this.renderer2.appendChild(pNode, endText)
                    // let concat = newAyat.concat(before + `<span class="notFound">${ruleSubstr}</span>` + after);
                    // newAyat = concat;



                } else if (i > 0 && i < item.rule.length - 1) {
                  // let withClass = this.render.createElement('span');
                  // let text = this.render.createText(ruleSubstr);
                  // this.render.appendChild(withClass, text)
                  // this.render.addClass(withClass, "notFound");
                  //     console.log(withClass)
                    let concat = newAyat.concat(item.test_ayat.slice(ruleMap[`end${i - 1}`], ruleMap[`start${i}`]))
                    
                    let begText = this.renderer2.createText(`${concat}`);

                    this.renderer2.appendChild(pNode, begText);
                    this.renderer2.appendChild(pNode, spanNode);

                   

                }

                // this.renderer2.appendChild(pNode, endText);
                this.renderer2.appendChild(this.ayatDiv.nativeElement, pNode)

                

            }

        }

        // this.ayatArr.push({ayah: ayat, surahNumber: item.surahNumber, ayahNumber:item.ayahNumber})

        // $('#practiceAyat').append(`<h2 class="mb-4">(${item.surahNumber} : ${item.ayahNumber}) ${ayat}</h2>`)
    }
}

// } else {
//     $('#practiceAyat').empty();

//     for (let item of data.data.ayat) {
//         $('#practiceAyat').append(`<h2 class="mb-4">(${item.surahNumber} : ${item.ayahNumber}) ${item.test_ayat}</h2>`)
//     }
//     $('#practiceAyat').append("<h3 class='text-center'>Oops!! These ayat don't have this rule. Please try again.</h3>");
//     $('#scoreBoard').hide()

// }
   
     
      
  })

  }
 

}
