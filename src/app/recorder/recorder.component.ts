import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
declare var require: any;
let RecordRTC = require('recordrtc/RecordRTC.min.js');

@Component({
  selector: 'recorder',
  templateUrl: './recorder.component.html',
  styleUrls: ['./recorder.component.css']
})
export class RecorderComponent implements OnInit {

  private stream: MediaStream;
  private recordRTC: any;

  @ViewChild('audio') audio;

  constructor() { }

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
      mimeType : 'audio/ogg',
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
    console.log("Get the result!");
  }

  download() {
    this.recordRTC.save('sample.ogg');
  }
}
