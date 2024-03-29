import { OnInit, Input, Component, Renderer2, ElementRef, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TajweedService } from '../../../../../services/tajweed.service';
import { StatsService } from '../../../../../services/stats.service';
import {AudioService} from '../../../../../services/audio.service';
import { AudioRecordingService } from '../../../../../services/audio-recording.service';
import { DomSanitizer } from '@angular/platform-browser';
import {RULELIST} from '../../../../../shared/ruleList';



declare var $: any;
import * as RecordRTC from 'recordrtc';

@Component({
  selector: 'app-activity-form',
  templateUrl: './activity-form.component.html',
  styleUrls: ['./activity-form.component.css'],
  changeDetection: ChangeDetectionStrategy.Default
})


export class ActivityFormComponent implements OnInit {
  @Input('activity') activity: string;
  @Input('user') user: Object;
  @ViewChild("appAyat") ayatDiv: ElementRef;
  
  ruleList = []

  rule = new FormControl('');
  range = new FormControl('');

  status = '';
  ayatArr = [];
  
  explanationSummary;
  explanationDetails;
  explanationExample;
  explanationAudio; 

  ruleCount = 0;
  counter = 0;
  wrongCount = 0;

  testComplete = false;
  isAudioRecording = false;
  audioRecordedTime;
  audioBlobUrl;
  audioBlob;
  audioName;
  audioStream;
  audioConf = { audio: true}

  constructor(private tajweed: TajweedService, private audio: AudioService, private renderer2: Renderer2, private sanitizer: DomSanitizer, private audioRecordingService: AudioRecordingService, private ref: ChangeDetectorRef, private stats: StatsService) { 
    this.audioRecordingService.recordingFailed().subscribe(() => {
      this.isAudioRecording = false;
      this.ref.detectChanges();
 });

    this.audioRecordingService.getRecordedTime().subscribe((time) => {
      this.audioRecordedTime = time;
      this.ref.detectChanges();
    });

    this.audioRecordingService.getRecordedBlob().subscribe((data) => {
      this.audioBlob = data.blob;
      this.audioName = data.title;
      this.audioBlobUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(data.blob));
      this.ref.detectChanges();
    });
  }


  
  ngOnInit(): void {
    this.ruleList = RULELIST.sort((a, b) => (a.code > b.code) ? 1 : -1)

  }

getExplanation() {
  console.log('calling expl')
  this.tajweed.getExpl(this.rule.value).subscribe(res => {
    console.log(res["explanationObj"]);

    this.explanationSummary = res["explanationObj"]["summary"]
    this.explanationDetails = res["explanationObj"]["details"]
    this.explanationExample = res["explanationObj"]["example"]
    this.explanationAudio = res["explanationObj"]["audioLink"]
})
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

    this.tajweed.getAyah(this.rule.value, this.range.value || 1, this.activity).subscribe(res => {
      console.log(res["ayat"]);

      let resultsOverview = res['ayat'].filter(i => i.rule.length !== 0);

      if (resultsOverview.length > 0) {
        this.status = 'go'
      } else {
        this.status = 're-submit'
      }

      res['ayat'].map(i => this.ruleCount += i.rule.length)


      for (let item of res['ayat']) {
        let audioLink = '';
        let audioNode = this.renderer2.createElement('audio');
        this.renderer2.setAttribute(audioNode, 'controls', 'true')
        this.renderer2.setAttribute(audioNode, 'controlsList', 'nodownload')
        this.renderer2.setAttribute(audioNode, 'id', 'quran')

        this.audio.getAyahAudio(item.surahNumber, item.ayahNumber).subscribe(res => {
        audioLink = res["data"].audioSecondary[0]
        let source = this.renderer2.createElement('source');

        this.renderer2.setAttribute(source, 'src', audioLink);
        this.renderer2.setAttribute(source, 'type', 'audio/mpeg');

        this.renderer2.appendChild(audioNode, source);
        })

        if (item.rule.length === 0) {
          const pNode = this.renderer2.createElement('p');
          const txtNode = this.renderer2.createText(`(${item.surahNumber}:${item.ayahNumber}) ${item.test_ayat}`);
          

          this.renderer2.appendChild(pNode, txtNode);
          this.renderer2.appendChild(this.ayatDiv.nativeElement, pNode);
          this.renderer2.appendChild(this.ayatDiv.nativeElement, audioNode)

        } else if (item.rule.length !== 0) {

          let pauses = /[\u06d6\u06d7\u06d8\u06d9\u06da\u06db\u06dc\u06e9]/g;

          let pauseMap = []

          let match;

          while ((match = pauses.exec(item.test_ayat)) != null) {
            pauseMap.push(match.index)
        }
     
          const pNode = this.renderer2.createElement('p');

          let ruleMap = {}

          let newAyat = '';

          for (let r of item.rule) {
            
            let relToPause = pauseMap.filter((i) => i < r.start);
            let shift = 2*(relToPause.length);
            r.start = r.start + shift;
            r.end = r.end + shift;
            ruleMap[`start${item.rule.indexOf(r)}`] = r.start;
            ruleMap[`end${item.rule.indexOf(r)}`] = r.end;

          }

         


          for (let i = 0; i < item.rule.length; i++) {
            if (item.rule.length === 1) {
              let ruleSubstr = item.test_ayat.substring(item.rule[0].start, item.rule[0].end);
              let before = item.test_ayat.slice(0, item.rule[0].start);
              let after = item.test_ayat.slice(item.rule[0].end);

        
              if (ruleSubstr === 'آ') {

                if (item.test_ayat.substring(ruleMap[`start${i}`] -2, ruleMap[`end${i}`]-2) === 'لَ') {
                  ruleSubstr = item.test_ayat.substring(item.rule[0].start-2, item.rule[0].end);
                  before = item.test_ayat.slice(0, item.rule[0].start-2);

                } else if (item.test_ayat.substring(ruleMap[`start${i}`] -3, ruleMap[`end${i}`]-3) === 'لّ') {
                  ruleSubstr = item.test_ayat.substring(item.rule[0].start-3, item.rule[0].end);
                  
                  before = item.test_ayat.slice(0, item.rule[0].start-3);
               
                }
              }

              if (ruleSubstr === 'ٰٓ') {
                ruleSubstr = item.test_ayat.substring(item.rule[0].start-3, item.rule[0].end);
                before = item.test_ayat.slice(0, item.rule[0].start-3);
              }

              const spanNode = this.renderer2.createElement('span');
              const spanText = this.renderer2.createText(`${ruleSubstr}`);
              this.renderer2.appendChild(spanNode, spanText);
              
              if (this.activity !== 'learn') {
                this.renderer2.addClass(spanNode, 'notFound');
              } else if (this.activity === 'learn') {
                this.renderer2.addClass(spanNode, 'learning');
              }

              const begText = this.renderer2.createText(`${before}`);
              const endText = this.renderer2.createText(`${after} (${item.surahNumber}:${item.ayahNumber})`)

              this.renderer2.appendChild(pNode, begText);
              this.renderer2.appendChild(pNode, spanNode);
              this.renderer2.appendChild(pNode, endText);


              this.renderer2.appendChild(this.ayatDiv.nativeElement, pNode);
              this.renderer2.appendChild(this.ayatDiv.nativeElement, audioNode)


            } else if (item.rule.length > 1) {

              let ruleSubstr = item.test_ayat.substring(ruleMap[`start${i}`], ruleMap[`end${i}`]);

              if (ruleSubstr === 'آ') {
                if (item.test_ayat.substring(ruleMap[`start${i}`] -2, ruleMap[`end${i}`]-2) === 'لَ') {
                  ruleSubstr = item.test_ayat.substring(ruleMap[`start${i}`]-2, ruleMap[`end${i}`]);
                } else if (item.test_ayat.substring(ruleMap[`start${i}`] -3, ruleMap[`end${i}`]-3) === 'لّ') {
                  console.log('found', item.test_ayat.substring(ruleMap[`start${i}`] -3, ruleMap[`end${i}`]-3))
                  ruleSubstr = item.test_ayat.substring(ruleMap[`start${i}`]-3, ruleMap[`end${i}`]);
                  console.log('looking', ruleSubstr)

             }
              }

              if (ruleSubstr === 'ٰٓ') {
                ruleSubstr = item.test_ayat.substring(ruleMap[`start${i}`]-3,  ruleMap[`end${i}`]);
              }

              const spanNode = this.renderer2.createElement('span');
              const spanText = this.renderer2.createText(`${ruleSubstr}`);
              this.renderer2.appendChild(spanNode, spanText);

              if (ruleSubstr.includes('ٰٓ')) {
                ruleSubstr = 'ٰٓ'
              }


              if (ruleSubstr === 'لَآ' || ruleSubstr === "لَّآ") {
                ruleSubstr = 'آ'
              }


              if (this.activity !== 'learn') {
                this.renderer2.addClass(spanNode, 'notFound');
              } else if (this.activity === 'learn') {
                this.renderer2.addClass(spanNode, 'learning');
              }

              if (i === 0) {
                let before = item.test_ayat.slice(0, ruleMap[`start${i}`]);


                if (ruleSubstr === 'آ') {
                  if (item.test_ayat.substring(ruleMap[`start${i}`] -2, ruleMap[`end${i}`]-2) === 'لَ') {
                    before = item.test_ayat.slice(0, ruleMap[`start${i}`]-2);
                  } else if (item.test_ayat.substring(ruleMap[`start${i}`] -3, ruleMap[`end${i}`]-3) === 'لّ') {
                    before = item.test_ayat.slice(0, ruleMap[`start${i}`]-3);
                  }
                }

                if (ruleSubstr === 'ٰٓ') {
                  before = item.test_ayat.slice(0, ruleMap[`start${i}`]-2);
                }

                let concat = newAyat.concat(before)

                let begText = this.renderer2.createText(`${concat}`);

                this.renderer2.appendChild(pNode, begText);
                this.renderer2.appendChild(pNode, spanNode);

                if (ruleSubstr.includes('ٰٓ')) {
                  ruleSubstr = 'ٰٓ'
                }

                if (ruleSubstr === 'لَآ' || ruleSubstr === "لَّآ") {
                  ruleSubstr = 'آ'
                }


              } else if (i > 0 && i === item.rule.length - 1) {
                let before = item.test_ayat.slice(ruleMap[`end${i - 1}`], ruleMap[`start${i}`])
                let after = item.test_ayat.slice(ruleMap[`end${i}`]);
                
               
                 
                if (ruleSubstr === 'آ') {
                  if (item.test_ayat.substring(ruleMap[`start${i}`] -2, ruleMap[`end${i}`]-2) === 'لَ') {
                    before = item.test_ayat.slice(ruleMap[`end${i - 1}`], ruleMap[`start${i}`]-2);
                  } else if (item.test_ayat.substring(ruleMap[`start${i}`] -3, ruleMap[`end${i}`]-3) === 'لّ') {
                    before = item.test_ayat.slice(ruleMap[`end${i - 1}`], ruleMap[`start${i}`]-3);
                  }

                }

                if (ruleSubstr === 'ٰٓ') {
           
                  before = item.test_ayat.slice(ruleMap[`end${i - 1}`], ruleMap[`start${i}`]-3);
                }

                let begText = this.renderer2.createText(`${before}`);
                let endText = this.renderer2.createText(`${after} (${item.surahNumber}:${item.ayahNumber})`)


                this.renderer2.appendChild(pNode, begText);
                this.renderer2.appendChild(pNode, spanNode);
                this.renderer2.appendChild(pNode, endText)


                if (ruleSubstr.includes('ٰٓ')) {
                  ruleSubstr = 'ٰٓ'
                }

                if (ruleSubstr === 'لَآ' || ruleSubstr === "لَّآ") {
                  ruleSubstr = 'آ'
                }

        

              } else if (i > 0 && i < item.rule.length - 1) {

                let concat = newAyat.concat(item.test_ayat.slice(ruleMap[`end${i - 1}`], ruleMap[`start${i}`]))



                if (ruleSubstr === 'آ') {
                  if (item.test_ayat.substring(ruleMap[`start${i}`] -2, ruleMap[`end${i}`]-2) === 'لَ') {
                    concat = newAyat.concat(item.test_ayat.slice(ruleMap[`end${i - 1}`], ruleMap[`start${i}`]-2))
                  } else if (item.test_ayat.substring(ruleMap[`start${i}`] -3, ruleMap[`end${i}`]-2) === 'لَّ') {
                    concat = newAyat.concat(item.test_ayat.slice(ruleMap[`end${i - 1}`], ruleMap[`start${i}`]-3))
                  }
                }

                let begText = this.renderer2.createText(`${concat}`);

                this.renderer2.appendChild(pNode, begText);
                this.renderer2.appendChild(pNode, spanNode);
              }

              this.renderer2.appendChild(this.ayatDiv.nativeElement, pNode)
              this.renderer2.appendChild(this.ayatDiv.nativeElement, audioNode)
            }
          }
        }
      }
    })

  }

  handleClick(e) {
    if (e.target.classList.contains('notFound')) {
      e.target.classList.add('found');
      e.target.classList.remove('notFound')
      this.counter += 1;
    } else if (e.target.classList.contains('learning')) {
      e.target.classList.add('found');
      e.target.classList.remove('learning')
      this.counter += 1;
    }
    
    else if (e.target.className === '') {
      let newDiv = this.renderer2.createElement('div');
      this.renderer2.addClass(newDiv, 'dot');
      this.renderer2.appendChild(this.ayatDiv.nativeElement, newDiv);

      this.renderer2.setStyle(newDiv, 'top', `${e.pageY-6}px`);
      this.renderer2.setStyle(newDiv, 'left', `${e.pageX-6}px`);

      this.wrongCount += 1;
    }

    if (this.counter === this.ruleCount && this.activity === 'practice') {
      this.updatePracticeStats();
    }
  }

  showScore() {
    this.testComplete = true;
    let notFoundArr = this.ayatDiv.nativeElement.getElementsByTagName("span");

    for (let item of notFoundArr) {
      if(!item.classList.contains('found')) {
        item.classList.remove('notFound');
        item.classList.add('missed');
      }
    }

    this.updateTestStats()
  }

  calculateScore() {
    return ((this.counter / this.ruleCount)*100).toFixed(2);
  }

updatePracticeStats() {
  let user = this.user['username'];
  let stats = {
    rule : this.rule.value,
    ayah_count : this.range.value
  };

  this.stats.update_practice(user, stats).subscribe(res => {
    console.log(res)
  })
}

updateTestStats() {
  let user = this.user['username'];
  let stats = {
    rule : this.rule.value,
    ayah_count : this.range.value,
    correct: this.counter,
    out_of: this.ruleCount,
    score: `${this.counter}/${this.ruleCount}`
  };

  this.stats.update_test(user, stats).subscribe(res => {
    console.log(res)
  })
}

    startAudioRecording() {
      if (!this.isAudioRecording) {
        this.isAudioRecording = true;
        this.audioRecordingService.startRecording();
      }
    }
  
    abortAudioRecording() {
      if (this.isAudioRecording) {
        this.isAudioRecording = false;
        this.audioRecordingService.abortRecording();
      }
    }
  
    stopAudioRecording() {
      if (this.isAudioRecording) {
        this.audioRecordingService.stopRecording();
        this.isAudioRecording = false;
      }
    }
  
    clearAudioRecordedData() {
      this.audioBlobUrl = null;
    }
  
    downloadAudioRecordedData() {
      this._downloadFile(this.audioBlob, 'audio/mp3', this.audioName);
    }
  
    ngOnDestroy(): void {
      this.abortAudioRecording();
    }
  
    _downloadFile(data: any, type: string, filename: string): any {
      const blob = new Blob([data], { type: type });
      const url = window.URL.createObjectURL(blob);
      //this.video.srcObject = stream;
      //const url = data;
      const anchor = document.createElement('a');
      anchor.download = filename;
      anchor.href = url;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
    }


}
