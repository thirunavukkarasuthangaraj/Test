import { Component, EventEmitter, HostListener, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AppSettings } from 'src/app/services/AppSettings';
import { CandidateService } from 'src/app/services/CandidateService';
import { GigsumoConstants } from 'src/app/services/GigsumoConstants';
import { ApiService } from 'src/app/services/api.service';
import { GigsumoService } from 'src/app/services/gigsumoService';
import { JobService } from 'src/app/services/job.service';
import { JobModel } from 'src/app/services/jobModel';
import { SearchData } from 'src/app/services/searchData';
import { UtilService } from 'src/app/services/util.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-candiates-invited',
  templateUrl: './candiates-invited.component.html',
  styleUrls: ['./candiates-invited.component.scss'],
  inputs : ['jobDetails']
})
export class CandiatesInvitedComponent implements OnInit, OnDestroy , OnChanges{
  readonly GigsumoConstants = GigsumoConstants;
  userId: any;
  jobDetails : JobModel;
  @Input() clickedCandidateIdIntraction:string;
  candidateId:string;
  previousValue_jobDetails : JobModel;
  candidateInvitedStatusList: any;
  url = AppSettings.photoUrl;
  jobId: any;
  candidateSeletedFilter;
  entitySent: any = { entity: 'candidates invited' };
  invitedCandidatesFoundStatus = "Fetching invited candidates..."
  queryParamData: any;
  response: any = [];
  previousSearchAfterKey = null;
  stopscrollFlag: boolean = false
  userType: any;
  colorLists: any;
  obj: any = {
    limit: 10,
    jobId: null,
    searchAfterKey: null,
    // entityType: "JOB"
    // userId: localStorage.getItem('userId')
  }
  searchAfterKey=null;
  pageNumber:number=0;
  filterSubscriber: Subscription;
  isFilterOpen: boolean = false;
  panel: string;
  appliedJob: any;
  tempStatusList: any;
  // Status="CANDIDATE_INVITATION"
  // Status="CANDIDATE_INVITATION,JOB_APPLICATION"
  constructor(private util: UtilService, private apiService: ApiService, private searchdata: SearchData,
    private candidateService: CandidateService, private router: Router, private activatedRoute: ActivatedRoute,
    private jobService: JobService, private gigsumoService: GigsumoService) {
    this.filterSubscriber = this.jobService.getSliderToggle().subscribe(value => {
      this.panel = value.panel;
      if (value.panel == 'candidates invited') {

        if(!value.value) {
          if(value.filterData != null) {
            this.onFilterToggle(value.filterData);
          }
        }
        if(value.value == true && !this.isFilterOpen) {
          this.openFilterSlider();
        } else {
          this.isFilterOpen = false;
          this.closeFilterSlider();
        }
      }
    })
    this.colorLists = this.gigsumoService.colorClass
  }

  ngOnChanges(changes: SimpleChanges): void {

    if(changes.jobDetails.currentValue){
      this.jobDetails = changes.jobDetails.currentValue;
      if( changes.clickedCandidateIdIntraction&&changes.clickedCandidateIdIntraction.currentValue!=undefined){
        this.candidateId = changes.clickedCandidateIdIntraction.currentValue;
      }else{
        this.candidateId =undefined;
      }
      this.previousValue_jobDetails = changes.jobDetails.previousValue;
     this.searchAfterKey=null;
     this.appliedJob = this.jobDetails;
        this.getApplicantFilter();
        this.findJob();


    }
  }

  ngOnInit() {

    // this.util.startLoader()
    this.activatedRoute.queryParams.subscribe((res) => {
      this.jobId = res.jobId
      this.queryParamData = res;
      localStorage.setItem('candidatesInvitedStatus', JSON.stringify(["INITIATED"]));
     });
    this.userType = localStorage.getItem('userType')
    this.userId = localStorage.getItem('userId');
    this.response = [];
    this.pageNumber = 0;

  }




  filterApplicantData : Array<any>= [];
  getApplicantFilter() {
    let entireInviteStatusList: any = []
    const default_invite_stages = GigsumoConstants.JOB_INVITES_DEFAULT_STAGES
    // this.util.startLoader();
    this.loadAPIcall=true;
    this.apiService.create('listvalue/findbyList' , {domain : "JOB_INVITATION_SUPPLIER_ACTIONS,JOB_APPLICATION_BLOCKING_ACTIONS"}).subscribe(res=>{
      // this.util.stopLoader();
      this.loadAPIcall=false;

      const sorted : Array<any> =  res.data.JOB_INVITATION_SUPPLIER_ACTIONS && res.data.JOB_INVITATION_SUPPLIER_ACTIONS.listItems;
      this.filterApplicantData = res.data;
      if(sorted){
        this.candidateInvitedStatusList = sorted
        .filter(x=>default_invite_stages.includes(x.itemId))
        .map(x => {
          return {itemId : x.itemId , value : x.value};
        });

        entireInviteStatusList = sorted
        .map(x=> {
          return {itemId: x.itemId, value: x.value}
        })
        this.tempStatusList = entireInviteStatusList;
        this.filterByStatus(sorted.map(p=> p.itemId).toString());
        this.removedData =  this.updatedArr();
      }
     });
  }


  findJob() {
    this.jobService.findByJobId(this.jobDetails.jobId).subscribe(response=>{
      if(response.jobData){
        this.appliedJob = response.jobData;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.filterSubscriber) {
      this.filterSubscriber.unsubscribe();
    }
  }

  openFilterSlider() {
    if (!this.isFilterOpen) {
      this.isFilterOpen = true;
      this.jobService.setDataForFilter({...this.removedData});
      this.jobService.setSliderToggle(true, 'candidates invited', null);
    }
  }

  closeFilterSlider() {
    if (this.isFilterOpen) {
      this.isFilterOpen = false;
      this.jobService.setSliderToggle(false, 'candidates invited', null);
    }
  }

  open(values: any) {
    var profiledata: any = {};
    profiledata.userId = localStorage.getItem('userId')
    profiledata.userType = localStorage.getItem('userType')
    this.apiService.create('user/profileDetails', profiledata).subscribe(res => {
      let element: any = {}
      element = res.data.creditConsumptions.find(item => item.creditType === AppSettings.JOB_VIEW)

      // this.util.startLoader();
      this.candidateService.updateCandidateViewed(values).subscribe((res) => {

        // this.util.stopLoader();
      }, err => {
        // this.util.stopLoader();
      });


    })
  }



  count: number = 0
  passCandidateId(item) {
    this.getUpdate(item.candidateId,item.flag);

  }


  getUpdate(candId,flag) {
    this.response.forEach(element => {
      if (element.candidateId == candId && flag=='true') {
        element.isSelected = true;
      } else{
        element.isSelected = false;
      }

    });
  }



  @Output() parentValueChange = new EventEmitter<any>();
  pushtoparentcomponent(item) {

    item.parentType="CANDIDATE_INVITATION,JOB_APPLICATION";
    this.parentValueChange.emit(item)
   }





  getCheck(value, index) {
    if (index > 1) {
      return;
    }
    this.response.forEach((element) => {
      if (element.candidateId == value) {
        element.isSelected = true;
        this.searchdata.setJobID(value);
      }
    });

  }


  like(values: any) {

    let datas: any = {};
    datas.candidateId = values.candidateId
    datas.userId = localStorage.getItem('userId');
    // this.util.startLoader();
    this.apiService.updatePut("candidates/updateCandidateLiked", datas).subscribe((res) => {
      if (res.code == '00000') {
        // this.util.stopLoader();
        this.response.forEach(ele => {
          if (res.data.candidateData.candidateId == ele.candidateId) {
            ele.likesCount = res.data.candidateData.likesCount;
            ele.isLiked = true
          }
        })
      }

    }, err => {
      // this.util.stopLoader();
    });
  }

  filterByStatus(status: any) {
    if(status!=""){
      this.getCandidateList(status);
    }else{
      this.invitedCandidatesFoundStatus = 'Please select appropriate filters to show relevant candidate invites.';
      this.returnmsgtoActivity();
    }
  }

  responseReceived: boolean = false;
  loadAPIcall: boolean = false;
  async getCandidateList(status: string) {

    try {
      // this.util.startLoader();
      this.loadAPIcall=true;
      this.responseReceived = false;
      this.obj = {
        jobId: this.jobDetails.jobId,
        limit: 10,
        searchAfterKey: this.searchAfterKey,
        inviteStatus: status,
        userId: localStorage.getItem("userId")
      };

      if (this.previousValue_jobDetails != undefined && this.jobDetails.jobId != this.previousValue_jobDetails.jobId) {
        this.searchAfterKey = null;
        this.response = [];
      }

      const res = await this.apiService.create("candidates/findCandidatesInvitedForTheJob", this.obj).toPromise();
      this.responseReceived = true;

      this.handleResponse(res);
    } catch (err) {
      this.handleError(err);
    } finally {
      // this.util.stopLoader();
      this.loadAPIcall=false;

    }
  }


  // message retunto activity
  returnmsgtoActivity(){
    let item :any={};
    item.parentType="CANDIDATE_INVITATION,JOB_APPLICATION";

    item.tab="candidates-invited";
    item.responseMessage="No Data Found";
    this.parentValueChange.emit(item)
  }

handleResponse(res) {
  this.loadAPIcall=false;

    if (res.code == "00000") {
      if(res.data && res.data.invitedCandidateList.length<9){
        this.stopscrollFlag=true
      }else{
        this.stopscrollFlag=false
        this.searchAfterKey=res.data.searchAfterKey;
      }
     this.processCandidates(res.data.invitedCandidateList);
     if(res.data.invitedCandidateList==0){
      this.returnmsgtoActivity();
     }
    } else {
        this.handleError(res);
    }
}

processCandidates(candidatess) {
    let seletedtrue :boolean= this.response.find(item=>item.isSelected==true);
    candidatess.forEach((candidate, index) => this.updateCandidate(candidate, index === 0,seletedtrue));
    this.setFlags(this.response.length);
}

getUniqueCandidates(candidates ) {
    return candidates.filter((c, i, arr) => arr.findIndex(t => t.candidateId === c.candidateId) === i);
}

updateCandidate(candidate, isFirst: boolean,seletedtrue:boolean) {

    candidate.enrolledOn = candidate.updatedOn;
    candidate.photo = candidate.photo ? AppSettings.photoUrl + candidate.photo : "assets/images/userAvatar.png";


    if (isFirst ) {
        this.searchdata.setJobID({ eachCandidate: true, candId: candidate.candidateId });
          candidate.isSelected = isFirst;
          this.pushtoparentcomponent(candidate)
     }else{
      candidate.isSelected = false;
      if(this.candidateId != undefined && this.candidateId == candidate.candidateId){
        this.response = this.response.map(item => ({
          ...item,
          isSelected: false
        }));

        candidate.isSelected = true;
        this.pushtoparentcomponent(candidate)
    }
    }
    this.response.push(candidate);
    let data:any=this.response;
    this.response = this.getUniqueCandidates(data);
}

setFlags(length: number) {

    this.invitedCandidatesFoundStatus = length ? "" : "No candidates got invited.";
    this.searchdata.setNUllCheck(length ? "notNull" : "null");
}

handleError(err: any) {
    this.stopscrollFlag = true;
    const failureMessage = err.code === GigsumoConstants.FAILURECODE ?
        "Something went wrong please try again later ...." : "No candidates got invited.";
    this.invitedCandidatesFoundStatus = failureMessage;
}

  messageShown: boolean = false

  requestResume(value) {
    var data: any = {}
    data.candidateId = value.candidateId
    data.resumeRequestLogs = [{ "jobId": this.jobId, "requestedBy": localStorage.getItem('userId') }]
    // this.util.startLoader()
    this.apiService.updatePut('candidates/updateResumeRequests', data).subscribe(res => {
      if (res.code == '00000') {
        // this.util.stopLoader()
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Resume request sent",
          showConfirmButton: false,
          timer: 2000,
        })
      }
    }, err => {
      // this.util.stopLoader();
    });
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

  onScrollDown() {
    if (this.stopscrollFlag == false) {
      const stagesStringArray  =  this.candidateInvitedStatusList.map(oject => oject.itemId);
      const status = stagesStringArray;
      this.previousValue_jobDetails=this.jobDetails;
      this.getCandidateList(status.toString());
    }
  }

  updatestatus(name, value, index) {
    // this.util.startLoader();
    this.loadAPIcall=true;

    var data: any = {}
    data.candidateId = value.candidateId;
    data.jobId = this.jobId;
    data.currentStatus = name;
    this.apiService.create('candidates/updateCandidateStatusForJob', data).subscribe(res => {
      // this.util.stopLoader()
      this.loadAPIcall=false;
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
      // this.util.stopLoader();
    });
  }

  removedData : any = [];

  updatedArr() {
    const group = {};
    let arr = [...this.candidateInvitedStatusList.map(c=>c.itemId)];
    arr.forEach((element)=>{
      group[element] = true;
    });
    return group;
  }


  removeEntity(value, index) {
    this.stopscrollFlag = false
    this.response = []
    this.obj.pageNumber = 0
    this.candidateInvitedStatusList.splice(index, 1);
    this.removedData[value] = false;
    const status = this.candidateInvitedStatusList.map(x=>x.itemId);
    this.filterByStatus(status.toString());
  }

  onFilterToggle(value: any) {
    console.log("alerttt" , value);

    this.isFilterOpen = false;
    const receivedData = JSON.parse(value);
    const status = receivedData.candidatesInvitedStatus;
    this.candidateInvitedStatusList = status;
    if(status){
      const d =  this.tempStatusList.filter((e) => status.some(v => v === e.itemId));
      this.candidateInvitedStatusList = d;
      this.removedData = {};
      this.candidateInvitedStatusList.forEach(element => {
          this.removedData[element.itemId] =  true;
      });
    }
    this.stopscrollFlag = false
    this.response = []
    this.obj.pageNumber = 0
    this.filterByStatus(this.candidateInvitedStatusList.map(c=>c.itemId).toString());
  }
}

