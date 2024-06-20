import { Search } from 'angular2-multiselect-dropdown/lib/menu-item';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CandidateService } from 'src/app/services/CandidateService';
import { ApiService } from 'src/app/services/api.service';
import { JobModel } from 'src/app/services/jobModel';
import { UtilService } from 'src/app/services/util.service';
import { countProvider } from '../../suggestions/suggestions.component';

@Component({
  selector: 'app-resume-request-sent',
  templateUrl: './resume-request-sent.component.html',
  styleUrls: ['./resume-request-sent.component.scss'],

})
export class ResumeRequestSentComponent implements OnInit,OnChanges {
  page: any;
  @Input() pagelist: string;
  @Input() jobDetails: any;
  passValues: any = []
  Resumerequeststatus: any;
  stopscrollFlag = false;
  responseReceived: boolean = false;
  constructor(private canidateService: CandidateService, private apiService: ApiService,
    private provider :countProvider , private util: UtilService) { }
  resumeRequestedUserList = new BehaviorSubject<any>([]);
  resumeRequestedPreviouseSearchAfterKey : string ;
  resumeRequestedStopScroll : boolean = false;

  loadAPIcall:boolean=false;
  URL = "candidates/findResumeRequestByTheUser";
  totalCount: number = 0;
  obj: any = {
    limit: 10,
    searchAfterKey: null,
    userId: localStorage.getItem('userId')
  }
  data: any = {
    limit: 10,
    searchAfterKey: null,
    userId: localStorage.getItem('userId')
  };

  payload() {
    this.data = {
      limit: 10,
      jobId: this.jobDetails.jobId,
      searchAfterKey: null,
      userId: localStorage.getItem('userId')
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.jobDetails.currentValue) {
      this.jobDetails = changes.jobDetails.currentValue;
      if (this.jobDetails.jobId&&this.pagelist == 'resume-requests') {
        this.data.searchAfterKey=null;
          this.passValues = [];
          this.payload();
          this.insideresumerequestsent()
      }
    }
  }

  ngOnInit() {
    if (this.pagelist != 'resume-requests') {
      this.apiCall();
    }
    this.passValues = [];
  }

  apiCall() {
    this.loadAPIcall=true;
    this.canidateService.getResumeRequestedUsers(this.obj).subscribe((response: any) => {
      this.loadAPIcall=false;
      if (response) {
        const afterKey = response.searchAfterKey;
        const responseData = response.resumeRequests;

        if(responseData){

          if(this.resumeRequestedPreviouseSearchAfterKey === afterKey || responseData.length === 0){
            this.resumeRequestedStopScroll = true;
          }

          const data = responseData.map((request) => ({
            candidateEntity: {
              ...request.candidateEntity,
              user: request.user
            },
            currentStatus : request.currentStatus,
            user: request.user,
            jobDetails : request.jobDetails
          }));
          if (this.resumeRequestedPreviouseSearchAfterKey !== afterKey) {
          const combinedResponse = [...this.resumeRequestedUserList.getValue() , ...data ];
          this.resumeRequestedUserList.next(combinedResponse);

          }
          this.resumeRequestedPreviouseSearchAfterKey = afterKey;



          if (this.totalCount != 0) {
            this.totalCount = response.total;
            this.provider.setCount(this.totalCount);
          }

        }

      }



    }, err=>{

      this.loadAPIcall=false;

    });
  }
  priviousSearchafterKey: any = null;

  insideresumerequestsent() {
    this.responseReceived = false;
    this.loadAPIcall=true
    this.Resumerequeststatus = 'Fetching Resume Requests...';

    if (this.data.searchAfterKey != null) {
      this.priviousSearchafterKey = this.data.searchAfterKey;
    }

    this.apiService.create("candidates/findResumeRequestsForTheJob", this.data).subscribe((res) => {

      this.loadAPIcall=false

      if (res && res.code == '00000' && res.data.rewsumeRequestedCandidates) {
        this.responseReceived = true;

        if (res.data.rewsumeRequestedCandidates.length == 0) {
          this.Resumerequeststatus = "There are no Resume request for this job";
          return true;
        }

        if (res.data.rewsumeRequestedCandidates && res.data.rewsumeRequestedCandidates.length < 9) {
          this.stopscrollFlag = true;
        } else {
          this.stopscrollFlag = false;
          this.data.searchAfterKey = res.data.searchAfterKey;
        }

        // res.data.rewsumeRequestedCandidates.forEach(element => {
        //   this.passValues.push(element)
        // });
        const newElements = res.data.rewsumeRequestedCandidates.filter(element =>
          !this.passValues.some(el => el.id === element.id)
      );

      this.passValues = this.passValues.concat(newElements);


      } else if (res.code == "99999") {
        this.Resumerequeststatus = 'Something went wrong, please try after some time.';
      }
    });
  }

  onScrollDown() {
    if (this.stopscrollFlag == false) {
      if (this.data.searchAfterKey != this.priviousSearchafterKey) {
        this.insideresumerequestsent();
      }
    }
  }

  onScrollResume() {
    if(!this.resumeRequestedStopScroll&& this.obj.searchAfterKey != this.resumeRequestedPreviouseSearchAfterKey){
      this.obj.searchAfterKey = this.resumeRequestedPreviouseSearchAfterKey;
      this.apiCall();
    }
  }


  pagecount(event) {
    this.page = event;
    this.obj.pageNumber = this.page - 1;
    this.apiCall();
  }


}
