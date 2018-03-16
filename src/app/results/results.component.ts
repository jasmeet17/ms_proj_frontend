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
  constructor(private dataImage: ResultService) { }

  ngOnInit() {
    this.dataImage.currentImage.subscribe(message => this.imageURL = message);
    this.dataImage.currentResult.subscribe(message => this.result = message);
  }

}
