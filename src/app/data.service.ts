import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class DataService {

  private messageSource = new BehaviorSubject<string>("ability");
  currentMessage = this.messageSource.asObservable();

  constructor() { }

  changeSound(message: string) {
    this.messageSource.next(message)
  }

}