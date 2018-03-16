import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class ResultService {

    private messageSource = new BehaviorSubject<string>("https://placeimg.com/640/480/tech");
    private result = new BehaviorSubject<string>("Result");
  
  currentImage = this.messageSource.asObservable();
  currentResult = this.result.asObservable()

  constructor() { }

  changeImageResult(message: string) {
    this.messageSource.next(message)
  }

  changeResult(message: string) {
    this.result.next(message)
  }

}