import { User } from './../types/User';
import { Injectable, Input } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})

export class CommonValues {

  constructor( private router: Router ){

  }
      adminMode:boolean=false
      subject = new Subject<any>();
      comEmiter = new Subject<any>();
      profo = new Subject<any>();
      userBasicObj = new Subject<any>();
      businessData = new Subject<any>();
      communityData = new Subject<any>();
      communityBoolean = new Subject<any>();
      countData = new Subject<any>();
      refresh = new Subject<any>();
      welcomePost = new Subject<any>();
      publicCommunityFollow = new Subject<any>();
      postdate = new Subject<any>();
      msgcountJob = new Subject<any>();
      msgcountCandidate = new Subject<any>();
      responseReloadJob = new Subject<{values:any, receivedSearchAfterKeyJob: any}>();
      responseReloadCandidate = new Subject<{values:any, receivedSearchAfterKeyJob: any}>();
      multiClickstop = new BehaviorSubject<boolean>(true);
      jobData = new Subject<any>();
      jobSearchObserver = new Subject<any>();
      candidateData = new Subject<any>();
      termChecked = new BehaviorSubject<any>(undefined);
      inviterefresh = new Subject<any>();
      userBasic :User;
      validNpi = new Subject<any>();

      //  <<<<<<<<---- For filter api flag enable disable
      private dataSource = new BehaviorSubject<boolean>(false);
      currentData = this.dataSource.asObservable();
      changeData(data: boolean) {
        this.dataSource.next(data);
      }  // flag enable end --->>>>>>>>>>>>>


      private resetfilter = new BehaviorSubject<boolean>(false);
      resetdatas = this.resetfilter.asObservable();
      resetdata(data: any) {
        this.resetfilter.next(data);
      }

      // to view joyride for all component so i created here
      private startTourSubject = new Subject<void>();
      startTour$ = this.startTourSubject.asObservable();
      triggerStartTour(): void {
        this.startTourSubject.next();
      }

      setValidNPI(value) {
        this.validNpi.next(value);
      }

      getJobSearchObserver(): Observable<any> {
        return this.jobSearchObserver.asObservable();
      }

      setJobSearchObserver(value) {
        this.jobSearchObserver.next(value);
      }

      getValidNPI(): Observable<any> {
        return this.validNpi.asObservable();
      }

      setWelcomePost(value) {
        this.welcomePost.next(value);
      }

      getWelcomePost(): Observable<any> {
        return this.welcomePost.asObservable();
      }
        businessid(id){
          this.subject.next(id);
        }

        getbusinessid(): Observable<any>{
          return this.subject.asObservable();
        }

        setProfo(id){
          this.profo.next(id);
        }

        getProfo(): Observable<any>{
          return this.profo.asObservable();
        }

        setTermCheck(id){
          this.termChecked.next(id);
        }

        getTermCheck(): Observable<any>{
          return this.termChecked.asObservable();
        }


        setloadData(id){
          this.postdate.next(id);
        }

        getLoadDate(): Observable<any>{
          return this.postdate.asObservable();
        }


        setmsgcountJob(id){
          this.msgcountJob.next(id);
        }

        getmsgcountJob(): Observable<any>{
          return this.msgcountJob.asObservable();
        }


        setmsgcountCandidate(id){
          this.msgcountCandidate.next(id);
        }

        getmsgcountCandidate(): Observable<any>{
          return this.msgcountCandidate.asObservable();
        }



        communitydata(id){

          this.subject.next(id);
        }

        getcommunitydata(): Observable<any>{
          return this.subject.asObservable();
        }

        setCommunityEventEmitter(id){
          this.comEmiter.next(id);
        }

        getCommunityEventEmitter(): Observable<any>{
          return this.comEmiter.asObservable();
        }

        setpubliccommunity(id){
          this.publicCommunityFollow.next(id);
        }

        getpubliccommunity(): Observable<any>{
          return this.publicCommunityFollow.asObservable();
        }




        redirect(data,path){
          setTimeout(() => {  this.router.navigate([path],{queryParams :data,replaceUrl: true})}, 400);
        }

        setUserData(data) {
          this.userBasicObj.next(data)
      }

      getUserData(): Observable<any> {
        return this.userBasicObj.asObservable();
      }

        setBusinessData(data) {
          	this.businessData.next(data)
        }

        getBusinessData(): Observable<any> {
          return this.businessData.asObservable();
        }

        setCommuityData(data) {
          this.communityData.next(data)
        }

        getCommuityData(): Observable<any> {
          return this.communityData.asObservable();
        }

        setCommuityBoolean(data) {
          this.communityBoolean.next(data)
        }

        getCommuityBoolean(): Observable<any> {
          return this.communityBoolean.asObservable();
        }

        setCharCount(data) {
          this.countData.next(data)
        }

        getCharCount(): Observable<any> {
          return this.countData.asObservable();
        }

        setRefresh(data) {
          this.refresh.next(data)
        }

        getRefresh(): Observable<any> {
          return this.refresh.asObservable();
        }


        getjobRelaodDate(): Observable<any> {
          return this.responseReloadJob.asObservable();
        }

        setjobsData(values, receivedSearchAfterKeyJob?: any) {
          this.responseReloadJob.next({values, receivedSearchAfterKeyJob});
        }


        getcandidateRelaodDate(): Observable<any> {
          return this.responseReloadCandidate.asObservable();
        }

        setcandidateData(values, receivedSearchAfterKeyJob?: any) {
          this.responseReloadCandidate.next({values, receivedSearchAfterKeyJob})
        }

        getCandidateData(): Observable<any> {
          return this.candidateData.asObservable();
        }

        setCandidateData(value): void {
          this.candidateData.next(value);
        }

        getJobData(): Observable<any> {
          return this.jobData.asObservable();
        }

        setJobData(value): void {
          this.jobData.next(value);
        }

        setclickitem(data : boolean) {
          this.multiClickstop.next(data)
        }

        getclickitem() {
           return this.multiClickstop.asObservable();
        }

        setinviterefresh(data : any) {
          this.inviterefresh.next(data)
        }

        getinviterefresh() {
           return this.inviterefresh.asObservable();
        }

        getVideoDuration(url: string): Promise<number> {
          return new Promise((resolve, reject) => {
            let video = document.createElement('video');
            video.src = url;
            video.onloadedmetadata = () => {
              resolve(video.duration);
              video.remove(); // Clean up
            };
            video.onerror = () => {
              reject('Error loading video metadata.');
              video.remove(); // Clean up
            };
          });
        }

      }
