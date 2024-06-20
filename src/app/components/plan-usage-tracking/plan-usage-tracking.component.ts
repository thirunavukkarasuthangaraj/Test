import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { distinctUntilChanged, map, take } from 'rxjs/operators';
import { CandidateService } from 'src/app/services/CandidateService';
import { GigsumoConstants } from 'src/app/services/GigsumoConstants';
import { UserService } from 'src/app/services/UserService';
import { candidateModel } from 'src/app/services/candidateModel';
import { InteractionwidgetData, JobService, widgetData } from 'src/app/services/job.service';
import { JobModel } from 'src/app/services/jobModel';
import { UtilService } from 'src/app/services/util.service';

export type widgetItem = "Contacts" | "Jobs" | "Candidates" | "Active Interactions"
  | "Usage" | "Jobs & Candidates";

@Component({
  selector: "app-plan-usage-tracking",
  templateUrl: "./plan-usage-tracking.component.html",
  styleUrls: ["./plan-usage-tracking.component.scss"],
})
export class PlanUsageTrackingComponent implements OnInit, OnDestroy {
  userType: string = localStorage.getItem("userType");
  userId: string = localStorage.getItem("userId");
  jobstopScrollFlag: boolean = false;
  candidatestopScrollFlag: boolean = false;
  resumeViewstopScrollFlag: boolean = false;
  resumeRequeststopScrollFlag: boolean = false;
  resumeDownloadstopScrollFlag: boolean = false;
  candidateInvitedstopScrollFlag: boolean = false;
  jobAppliedstopScrollFlag: boolean = false;
  contactstopScrollFlag: boolean = false;
  selectedWidgetItem: widgetItem = "Contacts";
  selectedDropDownItem: "Candidates Invited" | "Jobs Applied" | "Resume Request Sent" | "Resume Downloaded"
    | "Jobs" | "Candidates" = "Jobs";
  contactList = new BehaviorSubject<Array<any>>([]);
  jobList = new BehaviorSubject<Array<JobModel>>([]);
  candidateList = new BehaviorSubject<Array<candidateModel>>([]);
  resumeViewcandidateList = new BehaviorSubject<Array<candidateModel>>([]);
  activeInteractionList = new BehaviorSubject<Array<any>>([]);
  resumeRequestList = new BehaviorSubject<Array<any>>([]);
  resumeDownloadList = new BehaviorSubject<Array<any>>([]);
  candidateInviteList = new BehaviorSubject<Array<any>>([]);
  jobAppliedList = new BehaviorSubject<Array<any>>([]);
  totalCount = new BehaviorSubject<number>(0);
  jobpreviousSearchAfterKey: Array<any>;
  candidatepreviousSearchAfterKey: Array<any>;
  resumeViewPreviousSearchAfterKey: Array<any>;
  resumeRequestPreviousSearchAfterKey: Array<any>;
  resumeDownloadPreviousSearchAfterKey: Array<any>;
  jobAppliedPreviousSearchAfterKey: Array<any>;
  candidateInvitedPreviousSearchAfterKey: Array<any>;
  contactPreviousSearchAfterKey: Array<any>;
  dataLoaded: boolean = false;
  total: number = 0;
  loadApicall:boolean=false
  planUsageList: Array<string> = [
    "Contacts",
    this.isFreelancerOrMta ? "Jobs & Candidates"
      : this.userType === GigsumoConstants.RECRUITER ? "Jobs" : "Candidates",
    "Active Interactions",
    "Usage",
  ];
  LIMIT: number = 10;
  CONTACTLIMIT: number = 12;
  responseBody = {
    userId: this.userId,
    limit: this.LIMIT,
    searchAfterKey: null,
  };
  dropDownList: Array<string> = [
    "Candidates Invited",
    "Jobs Applied",
    "Resume Downloaded",
    "Resume Request Sent",
  ];
  defaultInteractionBody = {
    userId: this.userId,
    limit: this.LIMIT,
    searchAfterKey: null,
    interactionType: this.findactiveInteractionKey(this.basedOnUserType()[0])
  };
  title: string;
  constructor(
    private activatedRoute: ActivatedRoute,
    private candidateService: CandidateService,
    private userService: UserService,
    public jobService: JobService,
    private util: UtilService
  ) {

    this.activatedRoute.params.subscribe((param) => {
      this.selectedWidgetItem = param["data"];
      this.getDataBasedOnWidgetSelected(this.selectedWidgetItem);
      // this.selectedDropDownItem = sel
    });




  }

  ngOnDestroy(): void {
    this.jobList.unsubscribe();
    this.candidateList.unsubscribe();
    this.contactList.unsubscribe();
    this.resumeViewcandidateList.unsubscribe();
    this.candidateInviteList.unsubscribe();
    this.jobAppliedList.unsubscribe();
    this.resumeRequestList.unsubscribe();
    this.jobpreviousSearchAfterKey = null;
    this.candidatepreviousSearchAfterKey = null;
    this.resumeViewPreviousSearchAfterKey = null;
    this.candidateInvitedPreviousSearchAfterKey = null;
    this.jobAppliedPreviousSearchAfterKey = null;
    this.resumeRequestPreviousSearchAfterKey = null;
    this.jobstopScrollFlag = false;
    this.candidatestopScrollFlag = false;
    this.resumeViewstopScrollFlag = false;
    this.candidateInvitedstopScrollFlag = false;
    this.jobAppliedstopScrollFlag = false;
    this.resumeRequeststopScrollFlag = false;
  }

  ngOnInit() { }

  onDropdownChange(val: any) {
    this.selectedDropDownItem = val;
    this.title = val;
    switch (this.selectedWidgetItem) {
      case "Jobs & Candidates":
        if (val === "Jobs") {
          this.clearData(['jobList', 'jobstopScrollFlag']);
          this.getJobandCandidateList("JOB");
        } else if (val === "Candidates") {
          this.clearData(['candidateList', 'candidatestopScrollFlag']);
          this.getJobandCandidateList("CANDIDATE");
        }
        break;

      case "Active Interactions":
        this.totalCount.next(0);

        if (val === "Candidates Invited") {
          this.clearData(['candidateInviteList', 'candidateInvitedstopScrollFlag', 'candidateInvitedPreviousSearchAfterKey']);
        }
        else if (val === "Jobs Applied") {
          this.clearData(['jobAppliedList', 'jobAppliedstopScrollFlag', "jobAppliedPreviousSearchAfterKey"]);
        }
        else if (val === "Resume Request Sent") {
          this.clearData(['resumeRequestList', 'resumeRequeststopScrollFlag', "resumeRequestPreviousSearchAfterKey"]);
        }
        else if (val === "Resume Downloaded") {
          this.clearData(['resumeDownloadList', 'resumeDownloadstopScrollFlag', "resumeDownloadPreviousSearchAfterKey"]);
        }

        this.getActiveInteractionList({
          userId: this.userId,
          searchAfterKey: null,
          limit: this.LIMIT,
          interactionType: this.findactiveInteractionKey(val)
        });
        break;

      default:
        break;
    }

  }



  get isFreelancerOrMta(): boolean {
    return (
      this.userType === GigsumoConstants.FREELANCE_RECRUITER ||
      this.userType === GigsumoConstants.MANAGEMENT_TALENT_ACQUISITION
    );
  }

  basedOnUserType(): Array<string> {
    return this.isFreelancerOrMta
      ? this.dropDownList
      : [...this.dropDownList].filter((val) =>
        this.userType === GigsumoConstants.BENCH_RECRUITER
          ? (val.includes("Jobs") || val.includes("Downloaded"))
          : !val.includes("Jobs")
      );
  }

  onSideWidgetSelect(content: widgetItem) {

    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });

    this.selectedWidgetItem = content;
    this.title = this.selectedWidgetItem;
    this.clearTotalCount();
    switch (content) {
      case "Jobs":
        this.clearData(['jobList', 'jobstopScrollFlag']);
        this.getJobList();
        break;
      case "Candidates":
        this.clearData(['candidateList', 'candidatestopScrollFlag']);
        this.getCandidateList();
        break;
      // case "Resume Views":
      //   this.clearData(['resumeViewcandidateList' , 'resumeViewstopScrollFlag']);
      //   this.getResumeViewCandidateList();
      // break;
      case "Contacts":
        this.clearData(['contactList', 'contactstopScrollFlag']);
        this.getContactList({
          ...this.responseBody,
          limit: this.CONTACTLIMIT
        });
        break;
      case "Active Interactions":
        this.getDataBasedOnWidgetSelected("Active Interactions");
        break;
      case "Jobs & Candidates":
        this.clearData(['jobList', 'jobstopScrollFlag']);
        this.selectedDropDownItem = "Jobs";
        this.title = "Jobs";
        this.getDataBasedOnWidgetSelected("Jobs");
        break;
      default:
        break;
    }

  }

  clearData(data: Array<keyof PlanUsageTrackingComponent>) {
    this[this.getDataList(data[0])].next([]);
    this[this.getStopScroll(data[1])] = false;
    this[this.getSearchAfterKey(data[2])] = null;
  }

  getDataBasedOnWidgetSelected(content: string) {
    this.title = content;

    if (content === "Contacts") {
      this.clearData(['contactList', 'contactstopScrollFlag']);
      this.getContactList({
        ...this.responseBody,
        limit: this.CONTACTLIMIT
      });
    } else if (content === "Jobs") {
      this.clearData(['jobList', 'jobstopScrollFlag']);
      this.getJobList();
    } else if (content === "Candidates") {
      this.clearData(['candidateList', 'candidatestopScrollFlag']);
      this.getCandidateList();
    } else if (content === "Jobs & Candidates") {
      this.title = "Jobs";
      this.clearData(['jobList', 'jobstopScrollFlag']);
      this.getJobandCandidateList("JOB");
    }
    //  else if(content === "Resume Views"){
    //   this.getResumeViewCandidateList();
    // }
    else if (content === "Active Interactions") {
      let data = (this.basedOnUserType()[0] as "Candidates Invited" | "Jobs Applied" | "Resume Request Sent" | "Resume Downloaded");


      if(data === "Jobs Applied"){
        this.clearData(['jobAppliedList', 'jobAppliedstopScrollFlag']);
        this.selectedDropDownItem = "Jobs Applied";
      }
      else if(data === "Candidates Invited"){
        this.clearData(['candidateInviteList', 'candidateInvitedstopScrollFlag' , 'candidateInvitedPreviousSearchAfterKey']);
        this.selectedDropDownItem = "Candidates Invited";
      }

      this.selectedDropDownItem = data;
      this.title = data;
      this.getActiveInteractionList({
        ...this.defaultInteractionBody,
        interactionType: this.findactiveInteractionKey(data)
      });
    }

  }

  handleUserCardEvent(event: any): void {

    let currentValue = this.contactList.getValue();
    let index = currentValue.findIndex(item => item.userId === event.data.userId);

    if (index !== -1) {
      currentValue.splice(index, 1);
      this.contactList.next(currentValue);
      this.totalCount.next(this.totalCount.getValue() - 1);
    }
  }

  findactiveInteractionKey(val: string): "CANDIDATE_INVITED" | "JOB_APPLIED" | "RESUME_REQUESTED" | "RESUME_DOWNLOADED" {
    if (val === "Candidates Invited") return "CANDIDATE_INVITED";
    else if (val === "Jobs Applied") return "JOB_APPLIED";
    else if (val === "Resume Request Sent") return "RESUME_REQUESTED";
    else if (val === "Resume Downloaded") return "RESUME_DOWNLOADED";
  }

  getContactList(data: widgetData = this.responseBody) {
    this.loadApicall=true;
    this.userService.userConnectionList(data).pipe(
      map(response => {
        this.updateResponseData(response, "activeContatcts",
          ['contactPreviousSearchAfterKey', 'contactstopScrollFlag', 'contactList'])

        if (data.searchAfterKey === null && response.total != undefined) {
          this.setTotalCount(response.total);
        }
        this.dataLoaded = true;
      }),
      take(1)
    ).subscribe();
    this.dataLoaded = false;

  }

  getJobList(data: widgetData = this.responseBody) {
    if (this.jobstopScrollFlag) {
      return;
    }
    this.loadApicall=true;
    this.jobService
      .findActieJobs(data)
      .pipe(
        map((response) => {

          this.updateResponseData(response, 'jobList',
            ['jobpreviousSearchAfterKey', "jobstopScrollFlag", 'jobList']);

          // let currentKey = response.searchAfterKey && response.searchAfterKey[0];

          // if (this.jobpreviousSearchAfterKey === currentKey || response.jobList.length === 0) {
          //   this.jobstopScrollFlag = true;
          // }
          // this.jobpreviousSearchAfterKey = currentKey;
          // // newData from response
          // const newJobs = response.jobList;
          // // currentData
          // const currentJobs = this.jobList.getValue();

          if (data.searchAfterKey === null && response.total != null) {
            this.setTotalCount(response.total);
          }

          // const combinedJobs = [...currentJobs, ...newJobs];
          // this.jobList.next(combinedJobs);
          this.dataLoaded = true;
        }),
        take(1)
      )
      .subscribe();
    this.dataLoaded = false;
  }



  // Inside your component class
  getCandidateList(data: widgetData = this.responseBody) {
    if (this.candidatestopScrollFlag) {
      return;
    }
    this.loadApicall=true;
    this.candidateService.findActiveCandidates(data).pipe(
      map((response) => {
        this.updateResponseData(response, 'candidateList',
          ['candidatepreviousSearchAfterKey', 'candidatestopScrollFlag', 'candidateList']);

        this.dataLoaded = true;

        if (data.searchAfterKey === null && response.total != null) {
          this.setTotalCount(response.total);
        }
      }),
      distinctUntilChanged(), // Filter out consecutive duplicate emissions
      take(1)
    ).subscribe();

    this.dataLoaded = false;
  }


  getResumeViewCandidateList(data: widgetData = this.responseBody) {
    if (this.resumeViewstopScrollFlag) {
      return;
    }
    this.candidateService.getResumeViewsByTheUser(data).pipe(
      map(response => {

        this.updateResponseData(response, "viewedCandidatesList",
          ["resumeViewPreviousSearchAfterKey", "resumeViewstopScrollFlag", "resumeViewcandidateList"]);

        if (data.searchAfterKey === null && response.total != undefined) {
          this.setTotalCount(response.total);
        }
        this.dataLoaded = true;
      }),
      take(1)
    ).subscribe();
    this.dataLoaded = false;
  }

  getSearchAfterKey(val: keyof PlanUsageTrackingComponent) {
    return (val === "resumeViewPreviousSearchAfterKey" || val === "jobpreviousSearchAfterKey" || val === "candidatepreviousSearchAfterKey" ||
      val === "candidateInvitedPreviousSearchAfterKey" || val === "jobAppliedPreviousSearchAfterKey" || val === "resumeRequestPreviousSearchAfterKey" ||
      val === "contactPreviousSearchAfterKey" || val === "resumeDownloadPreviousSearchAfterKey") ? val : null;
  }

  getStopScroll(val: keyof PlanUsageTrackingComponent) {
    return (val === "resumeViewstopScrollFlag" || val === "candidatestopScrollFlag" || val === "jobstopScrollFlag" ||
      val === "candidateInvitedstopScrollFlag" || val === "jobAppliedstopScrollFlag" || val == "resumeRequeststopScrollFlag" ||
      val === "contactstopScrollFlag" || val === "resumeDownloadstopScrollFlag") ? val : null;
  }

  getDataList(val: keyof PlanUsageTrackingComponent) {
    return (val === "candidateList" || val === "jobList" || val === "resumeViewcandidateList" ||
      val === "candidateInviteList" || val === "jobAppliedList" || val === "resumeRequestList" ||
      val === "contactList" || val === "resumeDownloadList") ? val : null;
  }

  updateResponseData(response: any, responseName: string, data: Array<keyof PlanUsageTrackingComponent>) {
    this.util.startLoader();

    if (response) {
      this.loadApicall=false;
      let currentKey = response.searchAfterKey;
      const searchAfterKey = this.getSearchAfterKey(data[0]);
      const stopScroll = this.getStopScroll(data[1]);
      const list = this.getDataList(data[2]);

      if (this[searchAfterKey] && currentKey || response[responseName].length === 0) {

        if (response[responseName].length === 0) {
          this[stopScroll] = true;
          this.loadApicall = false
          this.util.stopLoader();
          return;
        }

        if (this.selectedWidgetItem === "Active Interactions") {

          if ((this[searchAfterKey][0] === currentKey[0] && this[searchAfterKey][1] === currentKey[1])) {
            this[stopScroll] = true;
          }

        }
        else {

          if (this[searchAfterKey][0] === currentKey[0]) {
            this[stopScroll] = true;
          }
        }


      }

      this[searchAfterKey] = currentKey;

      // newData from response
      const newResponse = response[responseName];
      // currentData
      const currentResponse = this[list].getValue();

      const combinedResponse = [...currentResponse, ...newResponse];
      this[list].next(combinedResponse);

    }

    this.util.stopLoader();

  }

  getJobandCandidateList(value: "JOB" | "CANDIDATE") {
    value === "JOB" ?
      this.getJobList(this.responseBody) :
      this.getCandidateList(this.responseBody);
  }

  getActiveInteractionList(data: InteractionwidgetData = this.defaultInteractionBody) {
     // check if the data is finished return
    if (this.isFinalInteraction()) {
      this.loadApicall=false
      return;
    }

    this.loadApicall=true;


    this.jobService.findUserInteractionsForThePlan(data).pipe(
      map(response => {
        if (response != null) {

          if (data.interactionType === "CANDIDATE_INVITED") {
            this.updateResponseData(response, 'candidatesInvitations',
              ['candidateInvitedPreviousSearchAfterKey', "candidateInvitedstopScrollFlag", 'candidateInviteList']);

          }
          else if (data.interactionType === "JOB_APPLIED") {
            this.updateResponseData(response, "jobsApplied", [
              "jobAppliedPreviousSearchAfterKey", "jobAppliedstopScrollFlag", "jobAppliedList"
            ])
          }
          else if (data.interactionType === "RESUME_REQUESTED") {
            this.updateResponseData(response, "resumeRequests",
              ["resumeRequestPreviousSearchAfterKey", "resumeRequeststopScrollFlag", "resumeRequestList"]);
          }
          else if (data.interactionType === "RESUME_DOWNLOADED") {
            this.updateResponseData(response, "resumesDownloaded",
              ["resumeDownloadPreviousSearchAfterKey", "resumeDownloadstopScrollFlag", "resumeDownloadList"]);
          }

          // set totalCount for the active interaction here
          if (data.searchAfterKey === null && response.total != undefined) {
            this.setTotalCount(response.total);
          }

          this.dataLoaded = true;
        }
        // will need this in future based on the API response
        //  else{
        //       if(data.interactionType === "CANDIDATE_INVITATION"){
        //         this.candidateInviteList.next([]);
        //       }
        //       else if(data.interactionType === "JOB_APPLIED"){
        //         this.jobAppliedList.next([]);
        //       }
        //       else if(data.interactionType === "RESUME_REQUEST"){
        //         this.resumeRequestList.next([]);
        //         this.resumeRequeststopScrollFlag = true;
        //       }
        //       this.dataLoaded = true;
        //  }
      }),
      take(1)
    ).subscribe();
    this.dataLoaded = false;
    }

  isFinalInteraction(): boolean {

    if (this.selectedDropDownItem === "Candidates Invited") {
      return this.candidateInvitedstopScrollFlag;
    }
    else if (this.selectedDropDownItem === "Jobs Applied") {
      return this.jobAppliedstopScrollFlag;
    }
    else if (this.selectedDropDownItem === "Resume Request Sent") {
      return this.resumeRequeststopScrollFlag;
    }
    else if (this.selectedDropDownItem === "Resume Downloaded") {
      return this.resumeDownloadstopScrollFlag;
    }

  }

  updateResumeRequest(response: any): void {
    let currentKey = response.searchAfterKey && response.searchAfterKey[0];

    if (this.resumeRequestPreviousSearchAfterKey === currentKey || response.resumeRequests.length === 0) {

      this.resumeRequeststopScrollFlag = true;
    }
    this.resumeRequestPreviousSearchAfterKey = currentKey;
    // newData from response
    const newCandidates = response.resumeRequests;
    // currentData
    const currentCandidates = this.resumeRequestList.getValue();

    const combinedCandidates = [...currentCandidates, ...newCandidates];


    this.resumeRequestList.next(combinedCandidates);
  }

  updateCandidateInvite(response: any): void {
    let currentKey = response.searchAfterKey && response.searchAfterKey[0];

    if (this.candidateInvitedPreviousSearchAfterKey === currentKey || response.candidatesInvitations.length === 0) {

      this.candidateInvitedstopScrollFlag = true;
    }
    this.candidateInvitedPreviousSearchAfterKey = currentKey;
    // newData from response
    const newData = response.candidatesInvitations;
    // currentData
    const currentData = this.candidateInviteList.getValue();

    const combinedCandidates = [...currentData, ...newData];

    this.candidateInviteList.next(combinedCandidates);
  }

  updateJobApplied(response: any): void {
    let currentKey = response.searchAfterKey && response.searchAfterKey[0];

    if (this.jobAppliedPreviousSearchAfterKey === currentKey || response.jobsApplied.length === 0) {

      this.jobAppliedstopScrollFlag = true;
    }
    this.jobAppliedPreviousSearchAfterKey = currentKey;
    // newData from response
    const newData = response.jobsApplied;
    // currentData
    const currentData = this.jobAppliedList.getValue();

    const combinedData = [...currentData, ...newData];

    this.jobAppliedList.next(combinedData);
  }

  onScrollDown() {

    if (this.selectedWidgetItem === "Jobs") {
      this.getJobList({
        ...this.responseBody,
        searchAfterKey: this.jobpreviousSearchAfterKey
      })
    }
    else if (this.selectedWidgetItem === "Candidates") {
      this.getCandidateList({
        ...this.responseBody,
        searchAfterKey: this.candidatepreviousSearchAfterKey
      })
    }
    // else if(this.selectedWidgetItem === "Resume Views"){
    //     this.getResumeViewCandidateList({
    //       ...this.responseBody ,
    //       searchAfterKey : [this.resumeViewPreviousSearchAfterKey]
    //     })
    // }
    else if (this.selectedWidgetItem === "Contacts") {
      this.getContactList({
        ...this.responseBody,
        limit: this.CONTACTLIMIT,
        searchAfterKey: this.contactPreviousSearchAfterKey
      });
    }
    else if (this.selectedWidgetItem === 'Jobs & Candidates') {
      if (this.selectedDropDownItem === "Jobs") {
        this.getJobList({
          ...this.responseBody,
          searchAfterKey: this.jobpreviousSearchAfterKey
        })
      }
      else if (this.selectedDropDownItem === "Candidates") {
        this.getCandidateList({
          ...this.responseBody,
          searchAfterKey: this.candidatepreviousSearchAfterKey
        })
      }
    }
    else if (this.selectedWidgetItem === "Active Interactions") {

      if (this.selectedDropDownItem === "Candidates Invited") {
        this.getActiveInteractionList({
          ...this.defaultInteractionBody,
          interactionType: this.findactiveInteractionKey(this.selectedDropDownItem),
          searchAfterKey: this.candidateInvitedPreviousSearchAfterKey
        })
      }
      else if (this.selectedDropDownItem === "Jobs Applied") {
        this.getActiveInteractionList({
          ...this.defaultInteractionBody,
          interactionType: this.findactiveInteractionKey(this.selectedDropDownItem),
          searchAfterKey: this.jobAppliedPreviousSearchAfterKey
        })
      }
      else if (this.selectedDropDownItem === "Resume Request Sent") {
        this.getActiveInteractionList({
          ...this.defaultInteractionBody,
          interactionType: this.findactiveInteractionKey(this.selectedDropDownItem),
          searchAfterKey: this.resumeRequestPreviousSearchAfterKey
        })
      }
      else if (this.selectedDropDownItem === "Resume Downloaded") {
        this.getActiveInteractionList({
          ...this.defaultInteractionBody,
          interactionType: this.findactiveInteractionKey(this.selectedDropDownItem),
          searchAfterKey: this.resumeDownloadPreviousSearchAfterKey
        })
      }

    }
  }

  getResponseDataLength(): number {

    switch (this.selectedWidgetItem) {
      case "Jobs":
        return this.jobList.getValue().length;
        break;
      case "Candidates":
        return this.candidateList.getValue().length;
        break;
      case "Contacts":
        return this.contactList.getValue().length;
        break;
      // case "Resume Views":
      //   return this.resumeViewcandidateList.getValue().length;
      // break;
      case "Contacts":
        return this.contactList.getValue().length;
        break;
      case "Jobs & Candidates":
        if (this.selectedDropDownItem === "Candidates") {
          return this.candidateList.getValue().length;
        }
        else if (this.selectedDropDownItem === "Jobs") {
          return this.jobList.getValue().length;
        }
        break;
      case "Active Interactions":
        return this.getInteractionLength();
        break;
      default:
        break;
    }

  }

  getDataScrollEnd(): boolean {

    switch (this.selectedWidgetItem) {
      case "Jobs":
        return this.jobstopScrollFlag;
        break;
      case "Candidates":
        return this.candidatestopScrollFlag;
        break;
      case "Jobs & Candidates":

        if (this.selectedDropDownItem === "Jobs") {
          return this.jobstopScrollFlag;
        }
        else if (this.selectedDropDownItem === "Candidates") {
          return this.candidatestopScrollFlag;
        }

        break;
      case "Active Interactions":
        return this.isFinalInteraction();
        break;
      // case "Resume Views":
      //     return this.resumeViewstopScrollFlag;
      // break;
      case "Contacts":
        return this.contactstopScrollFlag;
        break;

      default:
        break;
    }

  }

  getInteractionLength(): number {
    if (this.selectedDropDownItem === "Candidates Invited") {
      return this.candidateInviteList.getValue().length;
    }
    else if (this.selectedDropDownItem === "Jobs Applied") {
      return this.jobAppliedList.getValue().length;
    }
    else if (this.selectedDropDownItem === "Resume Request Sent") {
      return this.resumeRequestList.getValue().length;
    }
    else if (this.selectedDropDownItem === "Resume Downloaded") {
      return this.resumeDownloadList.getValue().length;
    }
  }

  clearTotalCount() {
    this.totalCount.next(0);
  }

  setTotalCount(count: number) {
    this.totalCount.next(count);
  }


}
