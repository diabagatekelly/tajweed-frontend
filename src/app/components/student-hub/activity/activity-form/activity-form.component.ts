import { OnInit, Input, Component, Renderer2, ElementRef, } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TajweedService } from '../../../../services/tajweed.service';

import { ViewChild } from '@angular/core';

@Component({
  selector: 'app-activity-form',
  templateUrl: './activity-form.component.html',
  styleUrls: ['./activity-form.component.css']
})


export class ActivityFormComponent implements OnInit {
  @Input('activity') activity: string
  @ViewChild("appAyat") ayatDiv: ElementRef;
  @ViewChild("dot") dot: ElementRef;

  rule = new FormControl('');
  range = new FormControl('');

  status = '';
  ayatArr = []

  ruleCount = 0;
  counter = 0;
  wrongCount = 0;

  testComplete = false;

  constructor(private tajweed: TajweedService, private renderer2: Renderer2) { }

  ngOnInit(): void {
  }

  submitSelected() {
    const childElements = this.ayatDiv.nativeElement.childNodes;
    for (let child of childElements) {
      this.renderer2.removeChild(this.ayatDiv.nativeElement, child);
    }

    this.ruleCount = 0;
    this.counter = 0;
    this.testComplete = false;
    this.wrongCount = 0;

    this.tajweed.getAyah(this.rule.value, this.range.value).subscribe(res => {
      console.log(res["ayat"])

      let resultsOverview = res['ayat'].filter(i => i.rule.length !== 0);

      if (resultsOverview.length > 0) {
        this.status = 'go'
      } else {
        this.status = 're-submit'
      }

      res['ayat'].map(i => this.ruleCount += i.rule.length)


      for (let item of res['ayat']) {

        if (item.rule.length === 0) {
          const pNode = this.renderer2.createElement('p');
          const txtNode = this.renderer2.createText(`(${item.surahNumber}:${item.ayahNumber}) ${item.test_ayat}`);

          this.renderer2.appendChild(pNode, txtNode);
          this.renderer2.appendChild(this.ayatDiv.nativeElement, pNode);

        } else if (item.rule.length !== 0) {

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

                this.renderer2.appendChild(pNode, begText);
                this.renderer2.appendChild(pNode, spanNode);


              } else if (i > 0 && i === item.rule.length - 1) {
                let before = item.test_ayat.slice(ruleMap[`end${i - 1}`], ruleMap[`start${i}`])
                let after = item.test_ayat.slice(ruleMap[`end${i}`]);

                let begText = this.renderer2.createText(`${before}`);
                let endText = this.renderer2.createText(`${after} (${item.surahNumber}:${item.ayahNumber})`)


                this.renderer2.appendChild(pNode, begText);
                this.renderer2.appendChild(pNode, spanNode);
                this.renderer2.appendChild(pNode, endText)




              } else if (i > 0 && i < item.rule.length - 1) {

                let concat = newAyat.concat(item.test_ayat.slice(ruleMap[`end${i - 1}`], ruleMap[`start${i}`]))

                let begText = this.renderer2.createText(`${concat}`);

                this.renderer2.appendChild(pNode, begText);
                this.renderer2.appendChild(pNode, spanNode);

              }

              this.renderer2.appendChild(this.ayatDiv.nativeElement, pNode)
            }

          }

        }
      }

    })

  }

  handleClick(e) {
    console.log(e)
    if (e.target.classList.contains('notFound')) {
      e.target.classList.add('found');
      e.target.classList.remove('notFound')
      this.counter += 1;
    } else if (e.target.className === '') {
      console.log(e.target.pageX, typeof(e.target.pageX))
      let newDiv = this.renderer2.createElement('div');
      this.renderer2.addClass(newDiv, 'dot');
      this.renderer2.appendChild(this.ayatDiv.nativeElement, newDiv);

      this.renderer2.setStyle(newDiv, 'top', `${e.pageY-6}px`);
      this.renderer2.setStyle(newDiv, 'left', `${e.pageX-6}px`);

      this.wrongCount += 1;
    }
  }

  showScore() {
    this.testComplete = true;
    let notFoundArr = this.ayatDiv.nativeElement.getElementsByTagName("span");
    console.log(notFoundArr)

    for (let item of notFoundArr) {
      console.log(item.classList)
      item.classList.remove('notFound');
      item.classList.add('missed');
    }
  }

  calculateScore() {
    return ((this.counter / this.ruleCount)*100).toFixed(2);
  }

}
