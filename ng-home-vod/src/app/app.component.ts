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
  videoElem: any;

  _videoSrc: any;
  _path: string[] = [];

  files: any[] = []
  constructor(private fs: FileService) {}

  ngOnInit() {
    const lastVideo = window.localStorage.getItem("_videoSrc")
    const lastPath = window.localStorage.getItem("_path")

    if (lastVideo) {
      this.videoSrc = JSON.parse(lastVideo);
    }
    
    if (lastPath) {
      this._path = JSON.parse(lastPath);
      this.getFiles();
    } else {
      this.updatePath("/");  
    }
  }

  selectFile(file: any) {
    if (file.isFolder === 'false') {
      this.videoSrc = file;
    }
    else {
      this.updatePath(file.name);
    }      
  }

  updatePath(folder?: any) {
    if (folder) {
      this._path.push(folder);
    } else {
      this._path.pop();
    }
    window.localStorage.setItem("_path", JSON.stringify(this._path));
    this.getFiles();
  }

  getFiles() {
    this.fs.get(this.join(this._path)).subscribe((files: any[]) => {          
      this.files = files.sort(function(a, b) {
        return a.name.localeCompare(b.name, undefined, {
          numeric: true,
          sensitivity: 'base'
        });
      });
    })    
  }

  get folder() {
    return this.join(this._path);
  }

  get videoSrc()  {
    return this._videoSrc;
  }

  set videoSrc(file: any) {
    this._videoSrc = file;
    window.localStorage.setItem("_videoSrc", JSON.stringify(file));
    this.videoElem = document.querySelector('#video') as HTMLVideoElement;
    if (HLS.isSupported()) {
      const hls = new HLS();
      const path = this.join(["hls", this.folder, file.name, "index.m3u8"])
      hls.loadSource(path);
      hls.on(HLS.Events.MANIFEST_PARSED, function (event, data) {
        console.log(data);
      });
      hls.attachMedia(this.videoElem);
    }
  }

  join(parts: string[]){
    const separator =  '/';
    const replace = new RegExp(separator+'{1,}', 'g');
    return parts.join(separator).replace(replace, separator);
 }
 
}
