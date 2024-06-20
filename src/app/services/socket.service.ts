import { filter, first, switchMap } from 'rxjs/operators';
import { Client, Message, over, StompSubscription } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { AppSettings } from 'src/app/services/AppSettings';
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export enum SocketClientState {
  ATTEMPTING, CONNECTED
}

@Injectable({
  providedIn: 'root'
})
export class SocketService implements OnDestroy {

  private client: Client;
  private state: BehaviorSubject<SocketClientState>;

    // urls = [AppSettings.webSocketUrl,AppSettings.webSocketUrlStream];


  constructor() {
  this.client = over(SockJS.default(AppSettings.webSocketUrl ));
    this.state = new BehaviorSubject<SocketClientState>(SocketClientState.ATTEMPTING);
    this.client.debug = null;
    this.client.connect({}, () => {
      this.state.next(SocketClientState.CONNECTED);
    });
  }
  connections(){
    this.client = over(SockJS.default(AppSettings.webSocketUrl));
    this.state = new BehaviorSubject<SocketClientState>(SocketClientState.ATTEMPTING);
    this.client.debug = null;
     this.client.connect({}, () => {
      this.state.next(SocketClientState.CONNECTED);
    });
  }


  reloadconnection(){
    let status:any={};
    status.connected=this.client.connected;
    status.streamTopic=this.state.observers.length;
    return status;
  }

  // connect(): Observable<Client> {
  //   return new Observable<Client>(observer => {
  //     this.state.pipe(filter(state => state === SocketClientState.CONNECTED)).subscribe(() => {
  //       observer.next(this.client);
  //     });
  //   });
  // }
  connect(): Observable<Client> {
    return this.state.pipe(
      filter(state => state === SocketClientState.CONNECTED),
      first(),
      switchMap(() => {
        return new Observable<Client>(observer => {
          observer.next(this.client);
          observer.complete();
        });
      })
    );
  }

  ngOnDestroy() {
    this.connect().pipe(first()).subscribe(inst => inst.disconnect(null));
    // this.connections_stream();
  }

  onMessage(topic: string, handler = SocketService.jsonHandler): Observable<any> {
    return this.connect().pipe(first(), switchMap(inst => {
      return new Observable<any>(observer => {
        const subscription: StompSubscription = inst.subscribe(topic, message => {
          observer.next(handler(message));
        });
        return () => inst.unsubscribe(subscription.id);
      });
    }));
  }

  onPlainMessage(topic: string): Observable<string> {
    return this.onMessage(topic, SocketService.textHandler);
  }

  send(topic: string, payload: any): void {
    this.connect()
      .pipe(first())
      .subscribe(inst => inst.send('/careonline' + topic, {}, JSON.stringify(payload)));
  }

  static jsonHandler(message: Message): any {
    return JSON.parse(message.body);
  }

  static textHandler(message: Message): string {
    return message.body;
  }

  /*stompClient: any;
  subscribersCounter: Record<string, number> = {};
  eventObservables$: Record<string, Observable<any>> = {};

  private state: BehaviorSubject<SocketClientState>;

  constructor() {
    let ws = new SockJS(AppSettings.ServerUrl + "ws");
    this.stompClient = Stomp.over(ws);
    const _this = this;
    _this.stompClient.connect({}, function (frame) {
      _this.state.next(SocketClientState.CONNECTED);
    }, this.errorCallBack);
  }

  connect(): Observable<any> {
    return new Observable<any>(observer => {
      this.state.pipe(filter(state => state === SocketClientState.CONNECTED)).subscribe(() => {
        observer.next(this.stompClient);
      });
    });
  }

  ngOnDestroy1() {
    this.connect().pipe(first()).subscribe(inst => inst.disconnect(null));
  }

  onMessage(topic: string, handler = SocketService.jsonHandler): Observable<any> {
    return this.connect().pipe(first(), switchMap(inst => {
      return new Observable<any>(observer => {
        const subscription = inst.subscribe(topic, message => {
          observer.next(handler(message));
        });
        return () => inst.unsubscribe(subscription.id);
      });
    }));
  }

  onPlainMessage(topic: string): Observable<string> {
    return this.onMessage(topic, SocketService.textHandler);
  }

  send(topic: string, payload: any): void {
    this.connect()
      .pipe(first())
      .subscribe(inst => inst.send(topic, {}, JSON.stringify(payload)));
  }

  static jsonHandler(message: any): any {
    return JSON.parse(message.body);
  }

  static textHandler(message: any): string {
    return message.body;
  }

  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }

  connect1() {
    if (this.stompClient == null)
      this._connect();
  }

  disconnect() {
    if (this.stompClient !== null) {
      this.stompClient.disconnect();
    }
  }

  private _connect() {
    let ws = new SockJS(AppSettings.ServerUrl + "ws");
    this.stompClient = Stomp.over(ws);
    const _this = this;
    _this.stompClient.connect({}, function (frame) {
      //_this.stompClient.reconnect_delay = 2000;
    }, this.errorCallBack);
  };

  errorCallBack(error) {
    setTimeout(() => {
      this._connect();
    }, 5000);
  }

  get() {
    if (this.stompClient == null) {

    }
    return this.stompClient;
  }

  on(eventName: string, callback: Function) {
    this.stompClient.subscribe(eventName, callback);
  }*/

}
