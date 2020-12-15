import { Component, OnInit } from '@angular/core';
import { FileService } from './services/file.service';
import { faFolder, faVideo } from '@fortawesome/free-solid-svg-icons';

import * as HLS from 'hls.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Home VOD';
  faFolder = faFolder;
  faVideo = faVideo;
  video: any;

  _path = ["/"];

  files: any[] = []
  constructor(private fs: FileService) {}

  ngOnInit() {
    this.fs.get(this.join(this._path)).subscribe((files: any[]) => {
      this.files = files;
    })   
  }

  selectFile(file: any) {
    if (file.isFolder === 'false') {
      this.videoSrc = file;
    }
    else {
      this.updatePath(file);
    }      
  }

  updatePath(folder?: any) {
    if (folder) {
      this._path.push(folder.name);
    } else {
      this._path.pop();
    }
    this.fs.get(this.join(this._path)).subscribe((files: any[]) => {
      this.files = files;
    })    
  }

  get folder() {
    return this.join(this._path);
  }

  set videoSrc(file: any) {
    this.video = document.querySelector('#video') as HTMLVideoElement;
    if (HLS.isSupported()) {
      const hls = new HLS();
      const path = this.join(["hls", this.folder, file.name, "index.m3u8"])
      hls.loadSource(path);
      hls.on(HLS.Events.MANIFEST_PARSED, function (event, data) {
        console.log(data);
      });
      hls.attachMedia(this.video);
    }
  }

  join(parts: string[]){
    const separator =  '/';
    const replace = new RegExp(separator+'{1,}', 'g');
    return parts.join(separator).replace(replace, separator);
 }
 
}
