import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  

  constructor(private http: HttpClient) { }

  getAyahAudio(surah, ayah) {
    let url = `http://api.alquran.cloud/v1/ayah/${surah}:${ayah}/ar.husary`
    return this.http.get(url)
  }
}
