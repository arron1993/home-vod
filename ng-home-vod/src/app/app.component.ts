import { Component, OnInit } from '@angular/core';
import { FileService } from './services/file.service';
import { faFolder } from '@fortawesome/free-solid-svg-icons';

import * as HLS from 'hls.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Home VOD';
  faFolder = faFolder;
  video: any;

  files: any[] = []
  constructor(private fs: FileService) {}

  ngOnInit() {

    this.fs.get("/").subscribe((files: any[]) => {
      this.files = files;
    })
  }

  selectFile(file: string) {
    this.videoSrc = file;
  }

  set videoSrc(file: any) {
    this.video = document.querySelector('#video') as HTMLVideoElement;
    if (HLS.isSupported()) {
      const hls = new HLS();
      hls.loadSource(`/hls/${file.name}/index.m3u8`);
      hls.on(HLS.Events.MANIFEST_PARSED, function (event, data) {
        console.log(data);
      });
      hls.attachMedia(this.video);
    }
  }
}
