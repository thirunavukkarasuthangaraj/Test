import { BehaviorSubject, Observable, Subject } from "rxjs";
import { ApiService } from "./api.service";
import { candidateModel } from "./candidateModel";
import { Injectable } from "@angular/core";
import { responseObject } from "./UserService";
import { map } from 'rxjs/operators';
import { UtilService } from './util.service';
import { AppSettings } from './AppSettings';

type paginate = "limit" | "pageNumber" | "userId" | "searchAfterKey";
@Injectable({
  providedIn : 'root'
})
export class CandidateService {
  private dataForFilterSubject = new BehaviorSubject<any>(null);
  private dataForReset = new Subject<boolean>();

  constructor(private api : ApiService,private util:UtilService){}


  updateCandidateViewed({candidateId}) : Observable<any>{
     let data : any = {};
     data.userId = localStorage.getItem('userId');
     data.candidateId = candidateId;
     console.log("updatedCandidateViewed" , data);
     return this.api.updatePut("candidates/updateCandidateViewed" , data);
  }

  updateCandidate(data : candidateModel) : Observable<any>{
      data.candidateReferenceId=data.candidateId;
      return this.api.updatePut('candidates/updateCandidate' , data);
  }

  findCandidatesInvitedByTheUser(data : Pick<responseObject,paginate>) : Observable<any>{
    return this.api.create("candidates/findCandidatesInvitedByTheUser" , data).pipe(
      map(response =>{ return response.data}));
  }

  getResumeRequestedUsers(data: Pick<responseObject, paginate>): Observable<any> {
    return this.api.create("candidates/findResumeRequestByTheUser", data).pipe(
      map(response => {
        // if (response.data && response.data.resumeRequests) {
          return response.data;
      })
    );
  }


  findActiveCandidates(data : Pick<responseObject,"userId" | "limit" | "searchAfterKey">) : Observable<any>{
    return this.api.create("candidates/findActiveCandidates",data).pipe(map(response=>{
      if(response.code != "00000"){
        throw new Error("There is some issue with Server");
      }
      if (response.data && response.data.candidateList) {

        response.data.candidateList.forEach(ele => {
          if (ele.user) {
            if (ele.user.photo != null) {
              ele.user.photo = AppSettings.photoUrl + ele.user.photo;
            } else {

              ele.user.photo = null;
            }
          }
        });

        response.data.candidateList = [...response.data.candidateList];
      }
      return  response.data;
    }));
  }

  getResumeViewsByTheUser(data : Pick<responseObject,"userId" | "limit" | "searchAfterKey">) : Observable<any>{

    return this.api.create("candidates/findCandidatesViewedByTheUser",data).pipe(map(response=>{
      this.util.stopLoader();
      if(response.code != "00000"){
        throw new Error("There is some issue with Server");
      }
      if (response.data && response.data.viewedCandidatesList) {

        response.data.viewedCandidatesList.forEach(ele => {
          if (ele.user) {
            if (ele.user.photo != null) {
              ele.user.photo = AppSettings.photoUrl + ele.user.photo;
            } else {

              ele.user.photo = null;
            }
          }
        });

        response.data.viewedCandidatesList = [...response.data.viewedCandidatesList];
      }
      return  response.data;
    }));
  }

  findByCandidateId(candidateId : string) {
    return this.api.query("candidates/findCandidateById/"+ candidateId).pipe(map(response=>{
      this.util.stopLoader();
      if(response.code != "00000"){
        throw new Error("There is some issue with Server");
      }
      return  response.data;
    }));
  }

  setDataForFilter(data: any): void {
    this.dataForFilterSubject.next(data);
  }

  getDataForFilter(): Observable<any> {
    return this.dataForFilterSubject.asObservable();
  }

  setReset(data: boolean): void {
    this.dataForReset.next(data);
  }

  getReset(): Observable<boolean> {
    return this.dataForReset.asObservable();
  }


}
