import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { Http,Headers } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SearchComponent } from '../search/search.component'
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
  readonly ROOT_URL = 'http://localhost:5000/upload';
  private stream: MediaStream;
  private recordRTC: any;
  private file:File;

  results:any;

  @ViewChild('audio') audio;

  constructor(private http: HttpClient){ } //, private http:Http) { }

  ngOnInit() {
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
    let recordRTC = this.recordRTC;
    recordRTC.stopRecording(this.processVideo.bind(this));
    let stream = this.stream;
    stream.getAudioTracks().forEach(track => track.stop());
  }

  fetchResult() {
    // this.results =this.http.get(this.ROOT_URL).map((res: Response) => res.json())
    this.search_field.nativeElement.value = "Ability";
    console.log('value :::::'+this.search_field.nativeElement.value);
    // this.searchChild
    /*
    var blob = this.recordRTC.getBlob();
    
    var file = new File([blob], 'abilit.webm', {
        type: 'audio/webm'
    });

    var formData = new FormData();
    formData.append('audio_file', file, 'abilit.webm');
    this.uploadToServer(formData);
    */
  }

  uploadToServer(formData:FormData){
    this.http.put(this.ROOT_URL,formData).subscribe(data => {
      console.log(data);
    });    
  }

  download() {
    this.recordRTC.save('sample.webm');
  }
}
