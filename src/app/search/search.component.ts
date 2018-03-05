import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';

import {Observable} from 'rxjs/Observable';
import {startWith} from 'rxjs/operators/startWith';
import {map} from 'rxjs/operators/map';


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
  
  states: State[] = [
  ];

  items: Array<Item>;

  constructor(private http: Http) { 
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
    
    this.http
      .get(Library.ASSETS_FOLER + Library.AUDIO_LIST)
      .map(data => data.json() as Array<Item>)
      .subscribe(data => {
        this.items = data;
        this.states = data;
      });
      
  }
}

export class State {
  constructor(public name: string) { }
}

export type Item = { id: number, name: string };

export class Library {
  public static get ASSETS_FOLER():string { return "/assets/downloads/"; }
  public static get AUDIO_LIST():string { return "audio_files_list.json"; }   
}
