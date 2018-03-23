import { Component, OnInit, ViewChild, AfterViewInit, ElementRef, Inject } from '@angular/core';
import { Http,Headers } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SearchComponent } from '../search/search.component'
import { DataService} from '../data.service';
import { ResultService } from '../result.services';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material';

declare var require: any;
let RecordRTC = require('recordrtc/RecordRTC.min.js');
import 'rxjs/add/operator/map';

@Component({
  selector: 'recorder',
  templateUrl: './recorder.component.html',
  styleUrls: ['./recorder.component.css']
})
export class RecorderComponent implements OnInit {

  // readonly ROOT_URL = 'https://reqres.in/api/users?page=2';
  // readonly ROOT_URL = 'http://localhost:5000/';
  @ViewChild(SearchComponent) searchChild: SearchComponent;
  @ViewChild('search_field') search_field: ElementRef;
  readonly ROOT_URL = 'http://localhost:5000/dtwScore';
  private stream: MediaStream;
  imageURL = '';
  imageResult = ''
  private recordRTC: any;
  private file:File;
  fileName:string;

  results:any;

  @ViewChild('audio') audio;

  constructor(private http: HttpClient, private data: DataService, private dataImage: ResultService, public dialog: MatDialog,){ } //, private http:Http) { }

  ngOnInit() {
    this.data.currentMessage.subscribe(message => this.fileName = message)
    this.dataImage.currentImage.subscribe(message => this.imageURL = message);
  }

  ngAfterViewInit() {
    //set the initial state of the audio
     let audio:HTMLAudioElement = this.audio.nativeElement;
     audio.muted = false;
     audio.controls = true;
     audio.autoplay = false;
  }

  toggleControls() {
    // let audio:HTMLAudioElement = this.audio.nativeElement;
    //  audio.muted = !audio.muted;
    //  audio.controls = !audio.controls;
    //  audio.autoplay = !audio.autoplay;
  }

  
  successCallback(stream: MediaStream) {

    var options = {
      mimeType : 'audio/webm',
      audioBitsPerSecond: 128000,
      bitsPerSecond: 128000
    };
    this.stream = stream;
    this.recordRTC = RecordRTC(stream, options);
    this.recordRTC.startRecording();

    let audio: HTMLAudioElement = this.audio.nativeElement;
    audio.src = window.URL.createObjectURL(stream);
    this.toggleControls();
  }

  errorCallback() {
    //handle error here
  }

  processVideo(audioVideoWebMURL) {
    let audio: HTMLAudioElement = this.audio.nativeElement;
    let recordRTC = this.recordRTC;
    audio.src = audioVideoWebMURL;
    this.toggleControls();

    var recordedBlob = recordRTC.getBlob();
    recordRTC.getDataURL(function (dataURL) { });
  }

  startRecording() {
    let mediaConstraints = {
      audio: true
    };
    navigator.mediaDevices
      .getUserMedia(mediaConstraints)
      .then(this.successCallback.bind(this), this.errorCallback.bind(this));
  }

  stopRecording() {
    if (typeof this.recordRTC === 'undefined'){
    }else{
      let recordRTC = this.recordRTC;
      recordRTC.stopRecording(this.processVideo.bind(this));
      let stream = this.stream;
      stream.getAudioTracks().forEach(track => track.stop());
    }
  }


  fetchResult() {
   
    if (typeof this.recordRTC === 'undefined'){
      this.openDialog('Please record the audio first.');
    }else{
      var blob = this.recordRTC.getBlob();
    
      var file = new File([blob], this.fileName + '.webm', {
          type: 'audio/webm'
      });

      var formData = new FormData();
      formData.append('audio_file', file, this.fileName + '.webm');
      this.uploadToServer(formData);
    }
  }

  uploadToServer(formData:FormData){
    this.http.put(this.ROOT_URL,formData).subscribe(data => {
      if(data['result']==1){
        // this.imageURL = data['image_url']
        this.imageURL = data['dtw_score']
        this.imageResult = 'Result'
        console.log('DTW SCORE :' + data['dtw_score']);
      }else{
        this.openDialog(data['error'])
        this.imageResult = data['error']
      }
      this.dataImage.changeImageResult(this.imageURL);
      this.dataImage.changeResult(this.imageResult);

    });    
  }

  download() {
    if (typeof this.recordRTC === 'undefined'){
      this.openDialog('Please record the audio first.');
    }else{
      this.recordRTC.save(this.fileName + '.webm');
    }
  }

  openDialog(dialogMessage:string) {
    this.dialog.open(DialogApi, {
      data: {
        message: dialogMessage
      }
    });
  }
}

@Component({
  selector: 'dialog-api-error',
  templateUrl: '../dialog-sound-file.html',
})
export class DialogApi {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}