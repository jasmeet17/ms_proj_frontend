import { Component, OnInit } from '@angular/core';
import { ResultService } from '../result.services';

@Component({
  selector: 'results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {

  imageURL = ''
  result = 'Result'
  results = [];
  constructor(private dataImage: ResultService) { }

  ngOnInit() {
    this.dataImage.currentResult.subscribe(message => this.result = message);
    this.dataImage.currentImage.subscribe(message => this.results.push(message));
    this.results= [];
  }

}
