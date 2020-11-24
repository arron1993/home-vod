import { Component, OnInit } from '@angular/core';

import * as HLS from 'hls.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Home VOD';

  video: any;

  ngOnInit() {
    this.video = document.querySelector('#video') as HTMLVideoElement;
    
    const videoSrc = '/hls/leaf.mp4/index.m3u8';

    console.log(videoSrc)
    if (HLS.isSupported()) {
      const hls = new HLS();
      hls.loadSource(videoSrc);
      hls.attachMedia(this.video);
    }
  }

  togglePlay() {
    console.log("Toggle")
    if (this.video.paused) {
      this.video.play()
    } else {
      this.video.pause();
    }
  }
}
