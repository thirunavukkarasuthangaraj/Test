import { Component, EventEmitter, HostListener, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AppSettings } from 'src/app/services/AppSettings';
import { CandidateService } from 'src/app/services/CandidateService';
import { GigsumoConstants } from 'src/app/services/GigsumoConstants';
import { GigsumoService } from 'src/app/services/gigsumoService';
import { JobService } from 'src/app/services/job.service';
import { JobModel } from 'src/app/services/jobModel';
import { SearchData } from 'src/app/services/searchData';
import Swal from 'sweetalert2';
import { ApiService } from './../../../services/api.service';
import { UtilService } from './../../../services/util.service';
@Component({
  selector: 'app-job-applicants',
  templateUrl: './job-applicants.component.html',
  styleUrls: ['./job-applicants.component.scss'],
  inputs: ['jobDetails']
})
export class JobApplicantsComponent implements OnInit, OnDestroy, OnChanges {
  jobApplicantStatusList: Array<any>;
  colorLists: any;
  jobDetails: JobModel;
  previousValue_jobDetails: JobModel;
  sliderSubscriber: Subscription;
  @Input() pagelist: string;
  @Output() candidateActivity = new EventEmitter();
  isFilterOpen: boolean = false;
  panel: string;
  jobApplicationBlockedStatus: any;
  constructor(private util: UtilService, private apiService: ApiService,  private activatedRoute: ActivatedRoute,
    private candidateService: CandidateService, private searchdata: SearchData, private jobService: JobService, private gigsumoService: GigsumoService) {
    this.colorLists = this.gigsumoService.colorClass
    // this.jobApplicantStatusList = [...GigsumoConstants.JOB_LIST_STATUS];
    this.sliderSubscriber = this.jobService.getSliderToggle().subscribe(value => {
      this.panel = value.panel;
       if (value.panel == 'job applicants') {
        if (!value.value) {
          if (value.filterData != null) {
            this.onFilterToggle(value.filterData);
          }
        }
        if (value.value == true && !this.isFilterOpen) {
          this.openFilterSlider();
        } else {
          this.isFilterOpen = false;
          this.closeFilterSlider();
        }
      }
    });
    this.activatedRoute.queryParams.subscribe((param)=>{
      if(param.candidateId){
        this.candidateId = param.candidateId;
      }
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.jobDetails.currentValue) {
      this.jobDetails = changes.jobDetails.currentValue;
      this.previousValue_jobDetails = changes.jobDetails.previousValue;
        this.appliedJob = this.jobDetails;
        this.pageNumber=0;
         this.response = [];
        this.getApplicantFilter();
    }
  }
  userId: any;
  url = AppSettings.photoUrl;
  candidatesApplied: any = []
  candidateSeletedFilter;
  candidateId : string = undefined;
  queryParamData: any;
  applicantsFoundStatus = "Fetching Applicants..."
  readonly GigsumoConstants = GigsumoConstants;
  response: any = [];
  previousSearchAfterKey = null;
  stopscrollFlag: boolean = false
  userType: any;
  messageShown: boolean = false
  appliedJob: JobModel;
  obj: any = {
    limit: 10,
    jobId: null,
    pageNumber: 0,
  }
  subscription: Subscription;
  appliedCount: any
  ngOnInit() {
    this.pageNumber=0;
     this.userType = localStorage.getItem('userType')
    this.subscription = this.jobService.confirmationResult$.subscribe(() => {
      this.getApplicantFilter( );
    });
   }
   filterApplicantData : Array<any>= [];
   loadAPIcall:boolean=false;
  getApplicantFilter() {
    let entireApplyStatusList: any = []
    const default_apply_stages: any = GigsumoConstants.JOB_APPLIED_DEFAULT_STAGES;
    this.loadAPIcall=true;
    this.apiService.create('listvalue/findbyList' , {domain : "JOB_APPLICATION_BUYER_ACTIONS,JOB_APPLICATION_BLOCKING_ACTIONS"}).subscribe(res=>{
      const sorted : Array<any> =  res.data.JOB_APPLICATION_BUYER_ACTIONS && res.data.JOB_APPLICATION_BUYER_ACTIONS.listItems;
      this.filterApplicantData = res.data;
      this.loadAPIcall=false;
      if(sorted){
        this.jobApplicantStatusList = sorted
        .filter(x=>default_apply_stages.includes(x.itemId))
        .map(x => {
          return {itemId : x.itemId , value : x.value};
        });
        entireApplyStatusList = sorted
        .map(x => {
          return {itemId : x.itemId , value : x.value};
        });
        this.tempStatusList = entireApplyStatusList;
        this.filterByStatus(sorted.map(p=> p.itemId).toString());
        this.removedData =  this.updatedArr();
      }
     });
  }
  ngOnDestroy(): void {
    if (this.sliderSubscriber) {
      this.sliderSubscriber.unsubscribe();
    }
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  findJob() {
    this.jobService.findByJobId(this.jobDetails.jobId).subscribe(response => {
      this.appliedJob = response.data.jobData;
    });
  }
  openFilterSlider() {
    if (!this.isFilterOpen) {
      this.isFilterOpen = true;
      this.jobService.setDataForFilter({...this.removedData});
      this.jobService.setSliderToggle(true, 'job applicants', null);
    }
   }
  closeFilterSlider() {
    if (this.isFilterOpen) {
      this.isFilterOpen = false;
      this.jobService.setSliderToggle(false, 'job applicants', null);
    }
   }
  tempStatusList : Array<any> = [];
  onFilterToggle(value: any) {
    this.isFilterOpen = false
    const receivedData = JSON.parse(value);
    const status : Array<any>= receivedData ? receivedData.jobApplicantStatus : null;
    if(status){
      const d =  this.tempStatusList.filter((e) => status.some(v => v === e.itemId));
      this.jobApplicantStatusList = d;
      this.removedData = {}
      this.jobApplicantStatusList.forEach(element => {
          this.removedData[element.itemId] =  true;
      });
    }
    this.stopscrollFlag = false
    this.response = []
    this.pageNumber = 0
    this.filterByStatus(this.jobApplicantStatusList.map(c=>c.itemId).toString());
  }
  pageNumber:number=0;
  open(values: any) {
    var profiledata: any = {};
    profiledata.userId = localStorage.getItem('userId')
    profiledata.userType = localStorage.getItem('userType')
    this.apiService.create('user/profileDetails', profiledata).subscribe(res => {
      let element: any = {}
      element = res.data.creditConsumptions.find(item => item.creditType === AppSettings.JOB_VIEW)
      if (res.data.creditPoints >= element.points || localStorage.getItem('userType') == 'student' || this.userType == 'JOB_SEEKER') {
        this.util.startLoader();
        this.candidateService.updateCandidateViewed(values).subscribe((res) => {
          this.util.stopLoader();
        }, err => {
          this.util.stopLoader();
        });
      }
    })
  }
  like(values: any) {
    let datas: any = {};
    datas.candidateId = values.candidateId
    datas.userId = localStorage.getItem('userId');
    this.util.startLoader();
    this.apiService.updatePut("candidates/updateCandidateLiked", datas).subscribe((res) => {
      if (res.code == '00000') {
        this.util.stopLoader();
        this.response.forEach(ele => {
          if (res.data.candidateData.candidateId == ele.candidateId) {
            ele.likesCount = res.data.candidateData.likesCount;
            ele.isLiked = true
          }
        })
      }
    }, err => {
      this.util.stopLoader();
    });
  }
  filterByStatus(status: any) {
    if(status){
      this.getCandidateList(status);
    }else{
      this.applicantsFoundStatus = "Please select appropriate filters to show relevant job applicants";
      this.returnmsgtoActivity();
    }
  }
  responseReceived: boolean = false;
  // API Call
  async getCandidateList(status) {
    this.responseReceived = false;
    this.util.startLoader();
    const userId = this.getUserId();
    try {
      if (this.previousValue_jobDetails != undefined && this.jobDetails.jobId != this.previousValue_jobDetails.jobId) {
        this.pageNumber = 0;
        this.response = [];
        this.stopscrollFlag = false;
      }
      const payload = this.createPayload(status, userId);
      let stringArray: string[] = status.split(",");
      localStorage.setItem('jobApplicantStatus', JSON.stringify(stringArray))
      this.loadAPIcall=true;
      const res = await this.apiService.create("candidates/findAppliedCandidates", payload).toPromise();
      this.processResponse(res);
    } catch (err) {
      this.handleError(err);
    } finally {
      this.loadAPIcall=false;
      this.util.stopLoader();
    }
  }
  getUserId() {
    return this.pagelist && this.pagelist !== 'job-applicants' ? localStorage.getItem('userId') : null;
  }
  createPayload(status, userId) {
    return {
      jobId: this.jobDetails.jobId,
      candidatesApplied: this.jobDetails.candidatesApplied,
      currentStatus: status,
      userId: userId,
      limit: 10,
      pageNumber: this.pageNumber,
    };
  }
  processResponse(res) {
    this.loadAPIcall=false;
    this.responseReceived = true;
    if (res && res.code === "00000") {
       this.processCandidates(res.data.appliedCandidateList);
    } else {
      this.setNoApplicantsFound();
    }
  }

  async processCandidates(candidates) {
    if (candidates.length === 0) {
      this.setNoApplicantsFound();
    } else {
      if (candidates.length < 9) {
        this.stopscrollFlag = true;
      } else {
        this.stopscrollFlag = false;
        this.pageNumber++;
      }

      const combinedCandidates = [...this.response, ...candidates];
      const uniqueCandidatesMap = new Map(combinedCandidates.map(candidate => [candidate.candidateId, candidate]));
      this.response = Array.from(uniqueCandidatesMap.values());
      this.initialSelected();
      this.searchdata.setNUllCheck(this.response.length > 0 ? "notNull" : "null");
    }
  }




  removeDuplicateCandidates(candidates) {
    return candidates.filter((obj, pos, arr) => arr.findIndex(t => t.candidateId === obj.candidateId) === pos);
  }
  setNoApplicantsFound() {
    this.stopscrollFlag = true;
    this.applicantsFoundStatus = this.pagelist !== 'candidate-applied' ? "Couldn't find any job applicants." : "You have not applied to this job yet.";
    this.messageShown = true;
    if(this.pageNumber==0){
      this.returnmsgtoActivity();
    }
  }
  handleError(err) {
    // Specific error handling based on the error object
    // For example, if (err.status === 500) { // Handle server error }
    this.loadAPIcall=false;
    this.stopscrollFlag = true;
    this.applicantsFoundStatus = "Couldn't find any Applicants.";
    this.messageShown = true;
  }
  count: number = 0;
  passCandidateId(item) {
    // Checkbox selected status update
   this.getUpdate(item);
  }
  // message retunto activity
  returnmsgtoActivity(){
    let item :any={};
    item.parentType="JOB_APPLICATION,CANDIDATE_INVITATION";
    item.tab="job-applicants";
    item.responseMessage=this.applicantsFoundStatus;
    this.parentValueChange.emit(item)
  }
// getting values from candidate card checkbox after i will pass to parent
  @Output() parentValueChange = new EventEmitter<any>();
  pushtoparentcomponent(item) {
    item.parentType="JOB_APPLICATION,CANDIDATE_INVITATION";
    this.parentValueChange.emit(item)
    this.getUpdate(item);
   }
   initialSelected(){
    this.response.forEach((element,index) => {
      if(index === 0 && this.candidateId === undefined){
        element.isSelected=true;
        this.pushtoparentcomponent(element)
      }
      else if(this.candidateId === element.candidateId){
        element.isSelected = true;
        this.pushtoparentcomponent(element)
      }
    });
  }
  getUpdate(candId) {
    this.response.forEach(element => {
      if (element.candidateId == candId.candidateId) {
        element.isSelected = true;
      } else{
        element.isSelected = false;
      }
    });
  }
  requestResume(value) {
    var data: any = {}
    data.candidateId = value.candidateId
    data.resumeRequestLogs = [{ "jobId": this.jobDetails.jobId, "requestedBy": localStorage.getItem('userId') }]
    this.util.startLoader()
    this.apiService.updatePut('candidates/updateResumeRequests', data).subscribe(res => {
      if (res.code == '00000') {
        this.util.stopLoader()
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Resume request sent",
          showConfirmButton: false,
          timer: 2000,
        })
      }
    }, err => {
      this.util.stopLoader();
    });
  }
  onScrollDown() {
    if (this.stopscrollFlag == false) {
      const status = this.jobApplicantStatusList.map(c=>c.itemId);
      this.previousValue_jobDetails=this.jobDetails;
      setTimeout(() => {
        this.getCandidateList(status.toString());
      }, 200);
    }
  }
  updatestatus(name, value, index) {
    this.util.startLoader();
    var data: any = {}
    data.candidateId = value.candidateId;
    data.jobId = this.jobDetails.jobId;
    data.currentStatus = name;
    this.apiService.create('candidates/updatejobAppliedStatus', data).subscribe(res => {
      this.util.stopLoader()
      if (res.code == '00000') {
        //  this.response[index].currentStatus=res.data.jobData.currentStatus;
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Status successfully Updated.",
          showConfirmButton: false,
          timer: 2000,
        })
      }
    }, err => {
      this.util.stopLoader();
    });
  }
  removedData : any;
  updatedArr() {
    const group = {};
    let arr = [...this.jobApplicantStatusList.map(x=>x.itemId)];
    arr.forEach((element)=>{
      group[element] = true;
    });
    return group;
  }
  removeEntity(value, index) {
    this.stopscrollFlag = false
    this.response = []
    this.obj.pageNumber = 0
    this.jobApplicantStatusList.splice(index, 1);
    this.removedData[value] = false;
    const status = this.jobApplicantStatusList.map(x=>x.itemId);
    this.filterByStatus(status.toString());
  }
  widgetstick: boolean = false
  @HostListener("window:scroll")
  handleScroll() {
    const windowScroll = window.pageYOffset;
    if (windowScroll >= 5) {
      this.widgetstick = true;
    } else {
      this.widgetstick = false;
    }
  }
}
