import { Component, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { CandidateService } from 'src/app/services/CandidateService';
import { candidateModel } from 'src/app/services/candidateModel';
import { GigsumoService } from 'src/app/services/gigsumoService';
import { JobService } from 'src/app/services/job.service';
import { JobCandidate } from 'src/app/services/jobModel';
import Swal from 'sweetalert2';
import { AppSettings } from './../../../services/AppSettings';
import { GigsumoConstants } from './../../../services/GigsumoConstants';
import { ApiService } from './../../../services/api.service';
import { SearchData } from './../../../services/searchData';
import { UtilService } from './../../../services/util.service';

@Component({
  selector: 'app-candidate-job-invite',
  templateUrl: './candidate-job-invite.component.html',
  styleUrls: ['./candidate-job-invite.component.scss'],
  inputs : ['candidateDetails']
})

export class CandidateJobInviteComponent implements OnInit  , OnChanges{
  readonly GigsumoConstants = GigsumoConstants;
  emptySelector: Subscription
  candidateId: any;
  candidateDetails: candidateModel;
  previousValue_candidateDetails: candidateModel;
  candidateJobModel: JobCandidate;
  @Input() clickedJobIdIntraction:string;

  colorLists: any;
  candidateSeletedFilter;
  jobInvitesStatusList: any = [];
  queryParamData: any;
  entitySent: any = { entity: 'job invites' };
  searchConfig: any = {
    pageNumber: 0,
  }
  responseReceived: boolean = false;
  jobInvitedFoundStatus = "Fetching job invites.."
  invitedCandidateDetails : candidateModel;
  countss = -1;
  filterSubscriber: Subscription;
  isFilterOpen: boolean = false;
  panel: string;
  jobId: string;
  filterApplicantData: any;
  jobStatusList: { itemId: any; value: any; }[];
  tempStatusList: any;
  constructor(private api: ApiService, private searchdata: SearchData, private searchData: SearchData,
     private util: UtilService, private a_route: ActivatedRoute,
     private candidateService : CandidateService, private gigsumoService: GigsumoService, private jobService: JobService) {
    this.colorLists = this.gigsumoService.colorClass
    this.emptySelector = this.searchData.getEmptySelectors().subscribe(res => {
      if (res == true) {
        this.viewedList.forEach(element => {
          element.isSelected = false
        });
      }
    })
    this.filterSubscriber = this.jobService.getSliderToggle().subscribe(value => {
      this.panel = value.panel;
      if (value.panel == 'job invites') {

        if(!value.value) {
          if(value.filterData != null) {
            this.onFilterToggle(value.filterData);
          }
        }

        if (value.value == true  && !this.isFilterOpen) {
          this.openFilterSlider();
        } else {
          this.isFilterOpen = false;
          this.closeFilterSlider();
        }
      }
    })
  }


  ngOnChanges(changes: SimpleChanges): void {
    if(changes.candidateDetails.currentValue){
      this.searchConfig.pageNumber = 0;
      this.viewedList = [];
      this.loadAPIcall=true;
      this.stopscrollFlag = false;
      this.candidateDetails = changes.candidateDetails.currentValue;
      this.previousValue_candidateDetails = changes.candidateDetails.previousValue;
           this.getAppliedFilter();
    }
    if( changes.clickedJobIdIntraction && changes.clickedJobIdIntraction.currentValue!=undefined){
      this.jobId = changes.clickedJobIdIntraction.currentValue;
    }else{
      this.jobId =undefined;
    }
  }
  loadAPIcall:boolean=false;
  getAppliedFilter() {
    let entireInviteStatusList: any = []
    const default_invite_stages: any = GigsumoConstants.JOB_INVITES_DEFAULT_STAGES;
    this.api.create('listvalue/findbyList' , {domain : "JOB_INVITATION_SUPPLIER_ACTIONS,JOB_APPLICATION_BLOCKING_ACTIONS,JOB_INVITATION_BLOCKED_ACTIONS"}).subscribe(res=>{
      const sorted : Array<any> =  res.data.JOB_INVITATION_SUPPLIER_ACTIONS && res.data.JOB_INVITATION_SUPPLIER_ACTIONS.listItems;
      this.filterApplicantData = res.data;
      if(sorted){
          this.jobInvitesStatusList = sorted
          .filter(x=>default_invite_stages.includes(x.itemId))
          .map(x => {
            return {itemId : x.itemId , value : x.value};
          });


          entireInviteStatusList = sorted
          .map(x => {
            return {itemId : x.itemId , value : x.value};
          });

        this.tempStatusList = entireInviteStatusList;
        this.filterByStatus(sorted.map(p=> p.itemId).toString());
        this.removedData =  this.updatedArr();
      }
     });
  }


  viewedList: any = []
  ngOnInit() {
    this.loadAPIcall=true;
    this.viewedList = [];
    this.searchConfig.pageNumber = 0;
  }


  openFilterSlider() {
    if (!this.isFilterOpen) {
      this.isFilterOpen = true;
      this.jobService.setDataForFilter({...this.removedData});
      this.jobService.setSliderToggle(true, 'job invites', null);
    }
  }

  closeFilterSlider(): void {
    if (this.isFilterOpen) {
      this.isFilterOpen = false;
      this.jobService.setSliderToggle(false, 'job invites', null);
    }
  }

  count: number = 0;
  getjobId(item) {
     if(item === "REFRESH"){
      this.searchConfig.pageNumber = 0;
      this.viewedList = [];
      this.getViews(this.tempStatusList.map(c=>c.itemId).toString() , null);
    }
   }




  // getting values from candidate card checkbox after i will pass to parent
  @Output() candidateSelectionChanged = new EventEmitter<any>();
  @Output() parentValueChange = new EventEmitter<any>();
   pushtoparentcomponent(selectedItem) {

    selectedItem.parentType = "CANDIDATE_INVITATION,JOB_APPLICATION";
    this.candidateSelectionChanged.emit(selectedItem);
    this.parentValueChange.emit(selectedItem)
    this.updateSelectionInList(selectedItem);

  }
  updateSelectionInList(selectedItem) {
    this.viewedList.forEach((element:any) => {

      if(selectedItem.currentStatus=='ACCEPTED'){
        element.candidateEntity.resumeAttached=true;
       }
      if(element.jobDetails.jobId == selectedItem.jobId) {
         element.jobDetails.currentStatus = selectedItem.currentStatus;
         element.jobDetails.isSelected = selectedItem.isSelected;
      }else{
        element.jobDetails.isSelected = false;
      }
    });

  }





  initialSelected(){

    this.viewedList.forEach((element,index) => {
      if(index === 0 && this.jobId === undefined){
        element.jobDetails.isSelected=true;
        this.pushtoparentcomponent( element.jobDetails)
      }
      else if(this.jobId === element.jobDetails.jobId){
        element.jobDetails.isSelected=true;
        this.pushtoparentcomponent( element.jobDetails)
      }

    });
  }



  public onFilterToggle(value: any) {
    const receivedData = JSON.parse(value);
    const status = receivedData ? receivedData.jobInvitesStatus : null;
    this.jobInvitesStatusList = status;

    if(status){
      const d =  this.tempStatusList.filter((e) => status.some(v => v === e.itemId));
      this.jobInvitesStatusList = d;
      this.removedData = {};
      this.jobInvitesStatusList.forEach(element => {
          this.removedData[element.itemId] =  true;
      });
    }
    this.stopscrollFlag = false
    this.viewedList = []
    this.searchConfig.pageNumber = 0;

    this.filterByStatus(this.jobInvitesStatusList.map(c=>c.itemId).toString());
  }

  getCandidateresumecheck(value) {
    this.viewedList.forEach(element => {
      if (element.candidateEntity.candidateId == value.candidateId) {
        element.candidateEntity.resumes = value.resumes;
      }
    });
  }


  filterByStatus(status: any) {
    if(status!=""){
      this.getViews(status, null);
    }else{
      this.loadAPIcall=false;
      this.jobInvitedFoundStatus = 'Please select appropriate filters to show relevant job invites.';
      this.returnmsgtoActivity();
    }
  }

    // message retunto activity
    returnmsgtoActivity(){
      let item :any={};
      // item.parentType="CANDIDATE_INVITATION";
      item.parentType="CANDIDATE_INVITATION,JOB_APPLICATION";
      item.tab="cInvited";
      item.responseMessage=this.jobInvitedFoundStatus;
      this.parentValueChange.emit(item)
    }

  async getViews(status, candId) {
    this.initializeResponse();
    this.updateSearchConfig(candId, status);
    try {
      this.loadAPIcall=true;
      const res = await this.api.create('candidates/findCandidatesInterestShownBy', this.searchConfig).toPromise();
      this.loadAPIcall=false;
      this.responseReceived = true;

      if (res && res.code === '00000') {
        this.processResponseData(res);

      } else if (res.code === '99999') {
        this.jobInvitedFoundStatus = 'Something went wrong. Please, try after some time.';
      }
    } catch (err) {

    } finally {
      this.util.stopLoader();
      this.loadAPIcall=false;
    }
  }


  initializeResponse() {
    this.responseReceived = false;
    this.countss++;
  }

  updateSearchConfig(candId, status) {
    this.searchConfig.candidateId = this.candidateDetails.candidateId;
    this.searchConfig.limit = 10;
    if (typeof status === 'string') {
      this.searchConfig.currentStatus = status.replace("SUBMITTED", "ACCEPTED");
    } else {
      this.searchConfig.currentStatus = undefined;
    }
  }



  processResponseData(res) {
    if (res.data==null||res.data.interestedShownByList.length === 0 ) {
      this.setNoJobInvitesFound();
    }else{
      if(res.data && res.data.interestedShownByList.length<9){
        this.stopscrollFlag=true;
      }else{
         this.searchConfig.pageNumber = this.searchConfig.pageNumber + 1;
         this.stopscrollFlag=false
      }
      if (res.data && res.data.interestedShownByList.length) {
        res.data.interestedShownByList.forEach((ele, index) => {
          this.processEachElement(ele, index);
        });
      }
    }
  }




  processEachElement(ele, index) {

    if (!this.viewedList.some(item => item.jobDetails.jobId === ele.jobDetails.jobId)) {
        ele.isSelected = index === 0;
        ele.user.photo = ele.user.photo ? AppSettings.photoUrl + ele.user.photo : null;
        ele.activityDate = this.util.dataconvert(new Date(), new Date(ele.activityDate));
        ele.jobDetails.resumeUpdated = false;
        this.viewedList.push(ele);
        if (index === 0 && this.jobId === undefined) {
            this.searchdata.setJobID({ eachJob: true, jobId: ele.jobDetails.jobId });
            ele.jobDetails.firstId = true;
            this.initialSelected();
        } else if (this.jobId !== undefined && this.jobId === ele.jobDetails.jobId) {
            this.checkbasedonJobs();
        }
    } else {
        console.log('Duplicate data skipped:', ele);
    }
}
  checkbasedonJobs(){

    this.viewedList.forEach((element,index) => {
      if(this.jobId != undefined && this.jobId ==  element.jobDetails.jobId){
        element.jobDetails.isSelected=true;
        this.pushtoparentcomponent( element.jobDetails)
      }

    });
  }

  removeDuplicates(data: JobCandidate[]): JobCandidate[] {
    const seenJobIds = new Set();
    return data.filter(item => {
      const jobId = item.jobDetails.jobId;
      if (!seenJobIds.has(jobId)) {
        seenJobIds.add(jobId);
        return true;
      }
      return false;
    });
  }




  setNoJobInvitesFound() {
    this.stopscrollFlag = true;
    this.loadAPIcall=false;
    this.jobInvitedFoundStatus = "No job invites found.";
    this.returnmsgtoActivity();
  }




  stopscrollFlag: boolean = false
  onScrollDown() {
    if (this.stopscrollFlag == false) {
      const stagesStringArray  =  this.jobInvitesStatusList.map(oject => oject.itemId);
      const status = stagesStringArray;
      this.getViews(status.toString(), null);
    }
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

  removedData : any = [];

  updatedArr() {
    const group = {};
    let arr = [...this.jobInvitesStatusList.map(c=>c.itemId)];
    arr.forEach((element)=>{
      group[element] = true;
    });
    return group;
  }

  removeEntity(value, index) {
    this.stopscrollFlag = false
    this.viewedList = []
    this.searchConfig.pageNumber = 0
    this.jobInvitesStatusList.splice(index, 1);
    this.removedData[value] = false;
    const status = this.jobInvitesStatusList.map(c=>c.itemId);
    this.filterByStatus(status.toString());
  }

  updatestatus(name, value) {

    this.util.startLoader();
    var data: any = {}
    data.jobId = value.jobId;
    data.candidateId = this.candidateId;
    data.currentStatus = name;
    this.api.create('candidates/updatejobAppliedStatus', data).subscribe(res => {
      this.util.stopLoader()
      if (res.code == '00000') {
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
  ngOnDestroy() {
    if (this.emptySelector) {
      this.emptySelector.unsubscribe();
    }

    if (this.filterSubscriber) {
      this.filterSubscriber.unsubscribe();
    }
  }

}
