import { Component, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GigsumoConstants } from 'src/app/services/GigsumoConstants';
import { Subscription } from 'rxjs';
import { AppSettings } from 'src/app/services/AppSettings';
import { CandidateService } from 'src/app/services/CandidateService';
import { FormValidation } from 'src/app/services/FormValidation';
import { ApiService } from 'src/app/services/api.service';
import { candidateModel } from 'src/app/services/candidateModel';
import { GigsumoService } from 'src/app/services/gigsumoService';
import { JobService } from 'src/app/services/job.service';
import { SearchData } from 'src/app/services/searchData';
import { UtilService } from 'src/app/services/util.service';


@Component({
  selector: 'app-job-applied-candidates',
  templateUrl: './jobs-applied.component.html',
  styleUrls: ['./jobs-applied.component.scss'],
  inputs: ['candidateDetails']
})
export class JobsAppliedcandidateComponent extends FormValidation implements OnInit, OnChanges {
  passValues: any = []
  flag: boolean = false;
  userType: any;
  colorLists: any;
  fiter_Route_candi_status = null;
  candidateId: any;
  obj: any = {
    limit: 10,
    searchAfterKey: null,
    currentStatus: null
  }
  stopscrollFlag: boolean = false;
  jobAppliedStatusList: Array<any>;
  messageShown: boolean = false
  entitySent: any = { entity: 'jobs applied' };
  jobsAppliedFoundStatus: any = 'Fetching applied jobs...'
  previousSearchAfterKey: any = null
  responseReceived: boolean = false;
  readonly GigsumoConstants = GigsumoConstants;
  userId = localStorage.getItem('userId');
  @Input() jobsFoundStatus: any;
  sliderSubscriber: Subscription;
  isFilterOpen: boolean = false;
  panel: string;
  candidateDetails: candidateModel;
  @Input() clickedJobIdIntraction:string;
  jobId:string;
  filterApplicantData: any;
  tempStatusList: any;
  subscription: Subscription;
  loadAPIcall:boolean=false;

  constructor(private util: UtilService, private searchData: SearchData, private activatedRoute: ActivatedRoute,
    private router: Router, private api: ApiService, private candidateService: CandidateService, private jobService: JobService,
    private gigsumoService: GigsumoService) {
    super();
    this.sliderSubscriber = this.jobService.getSliderToggle().subscribe(value => {
      this.panel = value.panel;

      if (value.panel == 'jobs applied') {
        if (!value.value) {
          if (value.filterData != null) {
            this.previousSearchAfterKey=null;
            this.obj.searchAfterKey = null;
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
    })
    this.colorLists = this.gigsumoService.colorClass
    this.jobAppliedStatusList = [...GigsumoConstants.JOB_LIST_STATUS];
  }
  fullName: any;

  ngOnInit(): void {
    this.passValues=[];
    // this.util.startLoader()
    this.loadAPIcall=true

      this.candidateId = this.candidateDetails.candidateId;
      this.fullName = this.candidateDetails.firstName + " " + this.candidateDetails.lastName

    this.userType = localStorage.getItem('userType');
    this.subscription = this.jobService.confirmationResult$.subscribe(() => {
      this.getAppliedFilter();

    });
  }

  previousValue_jobDetails:any={};
  ngOnChanges(changes: SimpleChanges): void {
     this.passValues=[];
     this.loadAPIcall=true;
    if (changes.candidateDetails.currentValue) {
      this.candidateDetails = changes.candidateDetails.currentValue;
      if( changes.clickedJobIdIntraction &&changes.clickedJobIdIntraction.currentValue!=undefined){
        this.jobId = changes.clickedJobIdIntraction.currentValue;
      }else{
        this.jobId =undefined;
      }

      this.previousValue_jobDetails = changes.candidateDetails.previousValue;
        this.obj.searchAfterKey=null;
        this.previousSearchAfterKey=null;

        this.getAppliedFilter();

    }
  }


  ngOnDestroy(): void {
    if (this.sliderSubscriber) {
      this.sliderSubscriber.unsubscribe();
    }
     if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  entire
  getAppliedFilter() {
    let entireApplyStatusList: any = []
    const default_apply_stages = GigsumoConstants.JOB_APPLIED_DEFAULT_STAGES;
    this.api.create('listvalue/findbyList' , {domain : "JOB_APPLICATION_SUPPLIER_ACTIONS,JOB_APPLICATION_BLOCKING_ACTIONS"}).subscribe(res=>{
      const sorted : Array<any> =  res.data.JOB_APPLICATION_SUPPLIER_ACTIONS && res.data.JOB_APPLICATION_SUPPLIER_ACTIONS.listItems;
      this.filterApplicantData = res.data;
      if(sorted){
        this.jobAppliedStatusList = sorted.map(x => {
          return {itemId : x.itemId , value : x.value};
        });

        this.jobAppliedStatusList = sorted
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

  onNgModelChange(event, value) {

  }

  openFilterSlider() {

    if (!this.isFilterOpen) {
      this.isFilterOpen = true;
      this.candidateService.setDataForFilter({...this.removedData});
      this.jobService.setSliderToggle(true, 'jobs applied', null);
    }
  }

  closeFilterSlider() {
    if (this.isFilterOpen) {
      this.isFilterOpen = false;
      this.jobService.setSliderToggle(false, 'jobs applied', null);
    }
  }

  onFilterToggle(value: any) {

    const receivedData = JSON.parse(value);
    const status = receivedData ? receivedData.jobsAppliedStatus : null;
     if(status){
      const d =  this.tempStatusList.filter((e) => status.some(v => v === e.itemId));
      this.jobAppliedStatusList = d;
      this.removedData = {};
      this.jobAppliedStatusList.forEach(element => {
          this.removedData[element.itemId] =  true;
      });
    }
    this.stopscrollFlag = false
    this.passValues = []
     this.obj.searchAfterKey = null;
    this.filterByStatus(this.jobAppliedStatusList.map(c=>c.itemId).toString());
  }

  apply(values: any) {
    this.util.startLoader();
    let datas: any = {};
    let routedata: any;
    var temparr = [];
    var datacheck = [{ 'userId': localStorage.getItem('userId') }]
    datas.jobPostedBy = localStorage.getItem('userId');
    datas.jobId = values.jobId;
    datas.appliedBy = datacheck;
    values.userType = values.user.userType;
    values.jobfilter = true;
    values.filterTitle = 'Select';
    this.router.navigate(["candidates"], { queryParams: values });
  }

  like(values: any, index) {


    let datas: any = {};
    datas.jobPostedBy = localStorage.getItem('userId');
    datas.jobId = values.jobId;
    this.util.startLoader();
    this.api.updatePut("jobs/updateJobLiked", datas).subscribe((res) => {

      this.passValues[index].isLiked = true;
      this.passValues[index].likesCount = this.passValues[index].likesCount + 1

      this.util.stopLoader();
    }, err => {
      this.util.stopLoader();
    });
  }


  open(values: any) {
    let data: any = {};
    data.jobPostedBy = localStorage.getItem('userId');
    data.jobId = values.jobId;
    this.util.startLoader();
    if (values.jobPostedBy != this.userId || !values.isViewed) {
      this.api.updatePut("jobs/updateJobViewed", data).subscribe((res) => {
        // this.data.isLiked=true;
        this.router.navigate(['newcandidates/jobs-applied'], { queryParams: data })
        this.util.stopLoader();
      }, err => {
        this.util.stopLoader();
      });
    } else {
      this.router.navigate(['newcandidates/jobs-applied'], { queryParams: data })
    }
  }

  filterByStatus(status: any) {

    if (status) {
      this.getAppliedJobsList(status);
    } else {
      this.jobsAppliedFoundStatus = 'Please select appropriate filters to show relevant job applieds.';
      this.loadAPIcall=false
      this.returnmsgtoActivity();
    }

  }


  async getAppliedJobsList(status) {
    this.prepareRequest(status);
    try {
        this.loadAPIcall=true
        const res = await this.api.create("jobs/findAppliedJobs", this.obj).toPromise();
        this.handleResponse(res);
    } catch (err) {
      this.loadAPIcall=false
        // this.util.stopLoader();
    }
}


  prepareRequest(status) {
    this.responseReceived = false;
    this.countss++;
    this.jobsAppliedFoundStatus = 'Fetching applied jobs...';
    this.obj = {
      candidateId: this.candidateDetails.candidateId,
      searchAfterKey: this.previousSearchAfterKey ? [this.previousSearchAfterKey] : null,
      currentStatus: status
    };
    // this.util.startLoader();
  }

  handleResponse(res) {
    // this.util.stopLoader();
    this.loadAPIcall=false
    if (!res) return;
    this.responseReceived = true;
    if (res.code == "00000" && res.data) {
      this.processData(res.data);
     } else if (res.code == "99999") {
      this.jobsAppliedFoundStatus = 'Something went wrong, please try after some time.';
    }
  }

  processData(data) {

    if(data && data.jobList.length<9){
      this.stopscrollFlag=true
    }else{
      this.stopscrollFlag=false
      this.previousSearchAfterKey = data.searchAfterKey[0];
    }

    if (data.searchAfterKey) {
      data.jobList.forEach((ele,index) => this.processJobElement(ele,index));
    }
    if (data.jobList.length == 0) {
      this.noJobsFound();
    }
  }


  processJobElement(ele, i) {
    ele.user.photo = ele.user.photo ? AppSettings.photoUrl + ele.user.photo : null;
    const existingIndex = this.passValues.findIndex(item => item.jobId === ele.jobId);

    if (existingIndex !== -1) {
      this.passValues[existingIndex] = ele;
    } else {
      this.passValues.push(ele);
      if (i === 0 && this.obj.searchAfterKey == null && this.jobId == undefined) {
        ele.isSelected = true;
        this.pushtoparentcomponent(ele);
      } else if (this.jobId != undefined && this.jobId == ele.jobId) {
        this.passValues = this.passValues.map(item => ({
          ...item,
          isSelected: false
        }));
        ele.isSelected = true;
        this.pushtoparentcomponent(ele);
      }
    }
  }


  uniqueCandidates(passValues) {
    return passValues.filter((obj, pos, arr) => {
      return arr.map(mapObj => mapObj.candidateId).indexOf(obj.candidateId) == pos;
    });
  }




  noJobsFound() {
    // this.stopscrollFlag = true;
    this.jobsAppliedFoundStatus = "There are no jobs applied for " + this.fullName + ".";
    this.messageShown = true;
    this.searchData.setNUllCheck("null");
    this.returnmsgtoActivity();
  }


   // message retunto activity
   returnmsgtoActivity(){
    let item :any={};
    // item.parentType="JOB_APPLICATION";
    item.parentType="JOB_APPLICATION,CANDIDATE_INVITATION";
    item.tab="cInvited";
    item.responseMessage=this.jobsAppliedFoundStatus;
    this.parentValueChange.emit(item)
  }



  searchConfig: any = {
    pageNumber: 0,
  }
  countss = -1;

  count: number = 0;
  getjobId(item) {
    this.getUpdate(item);
  }



  getUpdate(data) {
    this.passValues.forEach(element => {

      if (element.jobId == data.jobId) {
        element.isSelected = true;
      } else{
        element.isSelected = false;
      }

    });
  }



  @Output() parentValueChange = new EventEmitter<any>();
  pushtoparentcomponent(item) {
     // item.parentType="JOB_APPLICATION";
    item.parentType="JOB_APPLICATION,CANDIDATE_INVITATION";
    this.parentValueChange.emit(item)
    this.getUpdate(item)
   }




  onScrollDown() {
    if (this.stopscrollFlag == false) {
      const stagesStringArray  =  this.jobAppliedStatusList.map(oject => oject.itemId);
      const status = stagesStringArray;
      this.getAppliedJobsList(status.toString());
    }
  }

  removedData : any ={}

  updatedArr() {
    const group = {};
    let arr = [...this.jobAppliedStatusList.map(c=>c.itemId)];
    arr.forEach((element)=>{
      group[element] = true;
    });
    return group;
  }

  removeEntity(value, index) {
    this.stopscrollFlag = false
    this.passValues = [] ;
    this.jobAppliedStatusList.splice(index, 1);
    this.removedData[value] = false;
    const status = this.jobAppliedStatusList.map(x=>x.itemId);
    this.previousSearchAfterKey=null;
    this.obj.searchAfterKey = null;
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
