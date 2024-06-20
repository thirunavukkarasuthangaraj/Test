import { Injectable } from '@angular/core';
import { UtilService } from './util.service';
import { ApiService } from './api.service';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private subject = new Subject<any>();
  public message: String;
  // tslint:disable-next-line: ban-types
  public type: String;
  public time: number = 5000;
  private messageMap = {};

  constructor(private util: UtilService, private api: ApiService) {
    // this.util.startLoader()
    //     this.api.query('message').subscribe(messages => {
    //         this.util.stopLoader()
    //         messages.forEach(element => {
    //             this.messageMap[element.messageCode] = element.messageDescription;
    //         });
    //     })
  }

  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }

  sendMessage(message: string, type: string) {
    this.subject.next({ text: message, type: type });
  }

  getType() {
    return this.type;
  }

  getMessageText() {
    return this.message;
  }

  error(code) {
    //this.message = this.messageMap[code];
    this.message = code;
    this.type = 'ERROR';
    this.timeout(this.time);
  }

  success(code) {
    //this.message = this.messageMap[code];
    this.message = code;
    this.type = 'SUCCESS';
    this.timeout(this.time);
  }

  info(code) {
    //this.message = this.messageMap[code]
    this.message = code
    this.type = 'INFO';
    this.timeout(this.time);
  }

  timeout(timeout) {
    setTimeout(() => {
      this.clear()
    }, timeout)
  }

  clear() {
    this.message = ''
    this.type = ''
    this.subject.next(true);
  }
}
