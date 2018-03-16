import { Component, OnInit, Inject } from '@angular/core';
import {FormControl} from '@angular/forms';

import {MatDialog, MAT_DIALOG_DATA} from '@angular/material';


import {Observable} from 'rxjs/Observable';
import {startWith} from 'rxjs/operators/startWith';
import {map} from 'rxjs/operators/map';
import {FormGroup} from '@angular/forms';
import { DataService} from '../data.service';

import { HttpClient, HttpClientJsonpModule } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http'
import { Http, Response } from "@angular/http";
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})

export class SearchComponent implements OnInit {
  stateCtrl: FormControl;
  filteredStates: Observable<any[]>;
  audio_sound = 'ability'
  last_audio_sound = ''
  sound_data = ''

  readonly ROOT_URL = 'http://localhost:5000/';
  
  states: State[] = [
  ];

  items: Array<Item>;

  constructor(private data: DataService, private http: Http, public dialog: MatDialog) { 
    this.stateCtrl = new FormControl();
    this.filteredStates = this.stateCtrl.valueChanges
      .pipe(
        startWith(''),
        map(state => state ? this.filterStates(state) : this.states.slice())
      );
  }

  filterStates(name: string) {
    return this.states.filter(state =>
      state.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }

  ngOnInit() {

    this.data.currentMessage.subscribe(message => this.audio_sound = message);
    
    this.http
      .get(Library.ASSETS_FOLER + Library.AUDIO_LIST)
      .map(data => data.json() as Array<Item>)
      .subscribe(data => {
        this.items = data;
        this.states = data;
      });
      
  }

  newSound() {
    this.data.changeSound(this.audio_sound);
  }

  audioFileNameChange(event) {
    this.newSound();
  }

  playSound() {
    if(this.audio_sound == ''){
      this.openDialog('Please enter a valid file name.');
    }
    else if (this.audio_sound === this.last_audio_sound){
      if(this.sound_data['result']==1) {
        this.playAudio(this.sound_data['sound_url']);
      }else{
        this.openDialog('File ' + this.audio_sound +' not found on server.');
      }
    }
    else {
      this.http.request(this.ROOT_URL+ 'audio_file?audio_file_name='+ this.audio_sound)
      .subscribe((res: Response) => {
        
        this.sound_data = res.json();

        if(this.sound_data['result']==1) {
          this.last_audio_sound=this.audio_sound;
          this.playAudio(this.sound_data['sound_url']);
          
        }else{
          this.openDialog('File ' + this.audio_sound +' not found on server.');
        }

      });
    }
    
  }

  playAudio(soundUrl:string){
    let audio = new Audio();
    audio.src = soundUrl;
    audio.load();
    audio.play();
  }

  openDialog(dialogMessage:string) {
    this.dialog.open(DialogSoundFile, {
      data: {
        message: dialogMessage
      }
    });
  }
}

@Component({
  selector: 'dialog-sound-error',
  templateUrl: '../dialog-sound-file.html',
})
export class DialogSoundFile {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}

export class State {
  constructor(public name: string) { }
}

export type Item = { id: number, name: string };

export class Library {
  public static get ASSETS_FOLER():string { return "/assets/downloads/"; }
  public static get AUDIO_LIST():string { return "audio_files_list.json"; }   
}

