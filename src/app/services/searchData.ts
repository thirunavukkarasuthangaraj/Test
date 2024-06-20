import { Injectable, EventEmitter } from "@angular/core";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";

interface SelectAllCandidate {
  val: string,
  flag: boolean
}
@Injectable({
  providedIn: "root",
})
export class SearchData {

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}


   adminMode: boolean = false;
  subject = new Subject<any>();
  candidateform = new Subject<any>();
  scroll = new Subject<any>();
  URLLink = new Subject<any>();
  filterReload = new Subject<any>();
  currentOrganizaition = new Subject<any>();
  currentInstitute = new Subject<any>();
  requestedEmployeeCount = new Subject<any>();
  visitorsCount = new Subject<any>();
  searchDirectery = new Subject<any>();
  commonVariables = new Subject<any>();
  notifCount = new Subject<any>();
  candidateOrJobLoader = new Subject<any>();
  inviteSentCount = new Subject<any>();
  highLighter = new Subject<any>();
  teamData = new Subject<any>();
  networkData = new Subject<any>();
  bannerData = new Subject<any>();
  userType = new Subject<any>();
  profileBannerData = new Subject<any>();
  menuNameLanding = new Subject<any>();
  sticky = new Subject<any>();
  jobform = new Subject<any>();
  jobID = new Subject<any>();
  entityValue = new Subject<any>();
  emptySelectors = new Subject<any>();
  widgetData = new Subject<any>();
  createSubjectJob = new Subject<any>();
  createSubjectCandidate = new Subject<any>();
  nullCheck = new Subject<any>();
  checkCredits = new BehaviorSubject<any>('null');
  jobCount = new BehaviorSubject(0);
  contactIncreaseCount = new BehaviorSubject<number>(null);
  candidateCount = new BehaviorSubject(0);
  jobIdHighLight = new BehaviorSubject<string>("jobId");
  candiIdHighLight = new BehaviorSubject<string>("candiId");
  public selectAll$ = new BehaviorSubject<SelectAllCandidate>({ val: 'nothing', flag: null });
  JobActvityWidget = new Subject<any>();
  activity: EventEmitter<any> = new EventEmitter<any>();




  setCandiHighLight(val) {
    this.candiIdHighLight.next(val);
  }
  getCandiHighLight(): Observable<any> {
    return this.candiIdHighLight.asObservable();
  }

  setContactCount(val) {
    this.contactIncreaseCount.next(val);
  }
  getContactCount(): Observable<any> {
    return this.contactIncreaseCount.asObservable();
  }

  setCreateSubjectJob(val) {
    this.createSubjectJob.next(val);
  }
  getCreateSubjectJob(): Observable<any> {
    return this.createSubjectJob.asObservable();
  }
  setCreateSubjectCandidate(val) {
    this.createSubjectCandidate.next(val);
  }
  getCreateSubjectCandidate(): Observable<any> {
    return this.createSubjectCandidate.asObservable();
  }
  setjobHighLight(val) {
    this.jobIdHighLight.next(val);
  }
  getjobHighLight(): Observable<any> {
    return this.jobIdHighLight.asObservable();
  }
  setcandiadateCount(val) {
    this.candidateCount.next(val);
  }

  getcandidateCount(): Observable<any> {
    return this.candidateCount.asObservable();
  }

  setjobCount(val) {
    this.jobCount.next(val);
  }

  getjobCount(): Observable<any> {
    return this.jobCount.asObservable();
  }



  setjobform(val) {
    this.jobform.next(val);
  }

  getjobform(): Observable<any> {
    return this.jobform.asObservable();
  }
  setcandidateform(val) {
    this.candidateform.next(val);
  }

  getcandidateform(): Observable<any> {
    return this.candidateform.asObservable();
  }

  setcheckCredits(val) {
    this.checkCredits.next(val);
  }

  getcheckCredits(): Observable<any> {
    return this.checkCredits.asObservable();
  }

  setNUllCheck(value) {
    this.nullCheck.next(value);
  }

  getNulllCheck(): Observable<any> {
    return this.nullCheck.asObservable();
  }

  setWidget(value) {
    this.widgetData.next(value);
  }

  getWidget(): Observable<any> {
    return this.widgetData.asObservable();
  }

  setSticky(value) {
    this.sticky.next(value);
  }

  getSticky(): Observable<any> {
    return this.sticky.asObservable();
  }


  setEmptySelectors(value) {
    this.emptySelectors.next(value);
  }

  getEmptySelectors(): Observable<any> {
    return this.emptySelectors.asObservable();
  }


  setJobID(value) {
     this.jobID.next(value);
  }

  getJobID(): Observable<any> {
     return this.jobID.asObservable();
  }

  setEntityValue(value) {
    this.entityValue.next(value);
  }

  getEntityValue(): Observable<any> {
    return this.entityValue.asObservable();
  }


  setCurrentOrg(value) {
    this.currentOrganizaition.next(value);
  }

  getCurrentOrg(): Observable<any> {
    return this.currentOrganizaition.asObservable();
  }

  setRequestedEmployeeCount(value) {
    this.requestedEmployeeCount.next(value);
  }

  getRequestedEmploeeCount(): Observable<any> {
    return this.requestedEmployeeCount.asObservable();
  }

  setVisitorsCount(value) {
    this.visitorsCount.next(value);
  }

  getVisitorsCount(): Observable<any> {
    return this.visitorsCount.asObservable();
  }

  setCommonVariables(value) {

    this.commonVariables.next(value);
  }

  getCommonVariables(): Observable<any> {
    return this.commonVariables.asObservable();
  }

  setLoadJobOrCandidate(value) {
    this.candidateOrJobLoader.next(value);
  }

  getLoadJobOrCandidate(): Observable<any> {
    return this.candidateOrJobLoader.asObservable();
  }

  setNotificationCount(value) {
    this.notifCount.next(value);
  }

  getNotificationCount(): Observable<any> {
    return this.notifCount.asObservable();
  }

  setInviteSentCount(value) {
    this.inviteSentCount.next(value);
  }

  getInviteSentount(): Observable<any> {
    return this.inviteSentCount.asObservable();
  }

  setHighlighter(value) {
    this.highLighter.next(value);
  }

  getHighlighter(): Observable<any> {
    return this.highLighter.asObservable();
  }

  setuserType(value) {
    this.userType.next(value);
  }

  getuserType(): Observable<any> {
    return this.userType.asObservable();
  }

  setCurrentInst(value) {
    this.currentInstitute.next(value);
  }

  getCurrentInst(): Observable<any> {
    return this.currentInstitute.asObservable();
  }

  setBooleanValue(value) {
    this.subject.next(value);
  }

  getBooleanValue(): Observable<any> {
    return this.subject.asObservable();
  }

  setSearchData(value) {
    this.subject.next(value);
  }

  getSearchData(): Observable<any> {
    return this.subject.asObservable();
  }

  setHeadQuarters(value) {
    this.subject.next(value);
  }

  getHeadQuarters(): Observable<any> {
    return this.subject.asObservable();
  }

  setSearchDire(value) {
    this.searchDirectery.next(value);
  }

  getsetSearchDire(): Observable<any> {
    return this.searchDirectery.asObservable();
  }

  setTeamdata(value) {
    this.teamData.next(value);
  }

  setNetdata(value) {
    this.networkData.next(value);
    this.updateQueryParams({ networkName: value.networkName, networkNameLowerCase: value.networkNameLowerCase });
  }



  getNetdata(): Observable<any> {
    return this.networkData.asObservable();
  }
  setnetpathdata(value) {
    this.networkData.next(value);
  }
  getTeamdata(): Observable<any> {
    return this.teamData.asObservable();
  }

  setBannerPhoto(value) {
    this.bannerData.next(value);
  }

  getBannerPhoto(): Observable<any> {
    return this.bannerData.asObservable();
  }

  setProfileBannerPhoto(value) {
    this.profileBannerData.next(value);
  }

  getProfileBannerPhoto(): Observable<any> {
    return this.profileBannerData.asObservable();
  }

  setScroll(value) {
    this.scroll.next(value);
  }

  getScroll(): Observable<any> {
    return this.scroll.asObservable();
  }

  setWebLinkURL(value) {
    this.URLLink.next(value);
  }

  getWebLinkURL(): Observable<any> {
    return this.URLLink.asObservable();
  }


  setfilterReload(value) {
    this.filterReload.next(value);
  }

  getfilterReload(): Observable<any> {
    return this.filterReload.asObservable();
  }


  setJobActvityWidget(value) {
    // console.log("click")
    this.activity.emit(value);
    this.JobActvityWidget.next(value);
  }

  getJobActvityWidget(): Observable<any> {
    return this.JobActvityWidget.asObservable();
  }

// Update Query param;
  updateQueryParams(newParams: { [key: string]: any }) {
    this.activatedRoute.queryParams.subscribe(params => {
     this.router.navigate([], {
       relativeTo: this.activatedRoute,
       queryParams: newParams,
       queryParamsHandling: 'merge',
       preserveFragment: true
     });
   });
 }



  redirect(data, path) {
    setTimeout(() => {
      this.router.navigate([path], { queryParams: data, replaceUrl: true });
    }, 400);
  }
}
