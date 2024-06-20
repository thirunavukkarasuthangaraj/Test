import { environment } from './../../environments/environment.uat';
import { UserBadgeComponent } from './../components/landing-page/user-badge/user-badge.component';
// import { LangdingPageNavBarComponent } from './../components/langding-page-nav-bar/langding-page-nav-bar.component';
import { NewCandidateComponent } from './../page/homepage/candidate/new-candidate/new-candidate.component';
import { NewJobComponent } from './../page/homepage/layout-jobs/new-job/new-job.component';
 import { SocketService } from 'src/app/services/socket.service';
import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { SocketServiceStream } from './SocketServiceStream';
import { eventNames } from 'process';
@Injectable({
  providedIn: 'root'
})
export class StreamService {
  private streamData = new Subject<any>();
  response:any=null;
  userId=localStorage.getItem('userId');
   constructor(private _socket: SocketService,
    private Socketserver: SocketService,
    private _socket_stream: SocketServiceStream,private userData:UserBadgeComponent,private jobs: NewJobComponent, private canidate :NewCandidateComponent) {
    this.response = this.streamData.asObservable();
   }


// start socket for streamserver.

  startStream() {
    this._socket.connections();
    this._socket_stream.connections();

    setTimeout(() => {
      if (this.Socketserver.reloadconnection().connected == false &&
        this._socket_stream.reloadconnection().connected == false &&
        localStorage.getItem('userId')) {
        this.startTopic();
      }
    }, 1000);
  }


   startTopic(){
    this._socket_stream.onMessage('/topic/streams/' + localStorage.getItem('userId')).subscribe((response) => {
      this.response=response;
      this.streamData.next(response);
        setTimeout(() => {
             this.reloadAPI(response);
         }, 500);
     });

     setTimeout(() => this.serverTopicfor_eyenotification(), 2000);

   }


   // server socket
   serverTopicfor_eyenotification(){
    this._socket.onMessage('/topic/streams/' + localStorage.getItem('userId')).subscribe((response) => {
      this.response=response;
      this.streamData.next(response);
          setTimeout(() => {
             this.reloadAPI(response);
         }, 500);
     });
   }

// start socket for message
   startsocket_message() {
    this._socket.connections();
   }


   clearsubjectvalue(){
    setTimeout(() => {
      // this.streamData.next();
      // this.streamData.unsubscribe();

    }, 2000);
   }

  getstreamResponse(): Observable<any> {
    return this.streamData.asObservable();
  }

  getresponse(){
    return this.response;
  }


   clear(){
    return this.response=null;
  }

   reloadAPI(response){
    if(response.code=="00000" && response.responseEntity=="JOB"){
      this.jobs.streamReloadApicallJobs();
    }else if(response.code=="00000" && response.responseEntity=="CANDIDATE"){
      this.canidate.streamReloadApicallcandidate();
    }else if(response.code=="00000" && response.responseEntity=="CREDIT"){
      this.userData.streamReloadApicallcandidate();
    }
     else if(response.code=="00000" && response.responseEntity=="POST"){
      // this.post.getReloadstream();

    } else if(response.code=="00000" && response.responseEntity=="HOME"){
      // this.header.streamReloadApicallcandidate();

    }


   }

   OnDestroy(){
    this._socket.ngOnDestroy();
    this._socket_stream.ngOnDestroy();

   }

}
