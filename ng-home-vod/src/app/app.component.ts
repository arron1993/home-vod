import { Component, OnInit } from '@angular/core';
import { FileService } from './services/file.service';

import * as HLS from 'hls.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Home VOD';

  video: any;

  files: any[] = []
  constructor(private fs: FileService) {}

  ngOnInit() {
    
    


    this.fs.get("/").subscribe((files: any[]) => {
      this.files = files;
      console.log(this.files);
    })
  }

  togglePlay() {
    console.log("Toggle")
    if (this.video.paused) {
      this.video.play()
    } else {
      this.video.pause();
    }
  }

  selectFile(file: string) {
    this.videoSrc = file;
  }

  set videoSrc(file: string) {
    this.video = document.querySelector('#video') as HTMLVideoElement;
    if (HLS.isSupported()) {
      const hls = new HLS();
      hls.loadSource(`/hls/${file}/index.m3u8`);
      hls.attachMedia(this.video);
    }
  }
}
