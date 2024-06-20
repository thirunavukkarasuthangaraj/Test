import { Location } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { BsModalRef, BsModalService, ModalDirective, ModalOptions } from 'ngx-bootstrap/modal';
import { TypeaheadOrder } from 'ngx-bootstrap/typeahead/typeahead-order.class';
import { Observable, Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { AppSettings } from 'src/app/services/AppSettings';
import { FormValidation } from 'src/app/services/FormValidation';
import { GigsumoConstants } from 'src/app/services/GigsumoConstants';
import { HealthCareOrganization } from 'src/app/services/HealthCareOrganization';
import { UserService } from 'src/app/services/UserService';
import { ApiService } from 'src/app/services/api.service';
import { CommonValues } from 'src/app/services/commonValues';
import { JobService } from 'src/app/services/job.service';
import { jobModuleConfig } from 'src/app/services/jobModuleConfig';
import { UtilService } from 'src/app/services/util.service';
import Swal from 'sweetalert2';
import { PricePlanService } from '../../Price-subscritions/priceplanService';
import { NewJobComponent } from './../../../page/homepage/layout-jobs/new-job/new-job.component';
import { JobModel } from './../../../services/jobModel';
import { SearchData } from './../../../services/searchData';
import { SocketService } from './../../../services/socket.service';
import { StreamService } from './../../../services/stream.service';
import { ModelPriceComponent } from './../../Price-subscritions/model-price/model-price.component';
import { CreditModelComponent } from './../../credit/credit-model/credit-model.component';
import { TourService } from 'src/app/services/TourService';

declare var $: any;

@Component({
  selector: 'app-jobs',
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.scss'],
})



export class JobsComponent extends FormValidation
  implements OnInit, OnDestroy, OnChanges {
  @Output() jobReload = new EventEmitter<any>();
  public FORMERROR = super.Form;
  profileDetailResponse: any;
  private wasInside = false;
  dataPasstoSkillwidgets: Array<any> = [];
  removeTagvalues: any;
  candidateFoundStatus: string = "Fetching candidates ...";
  currentStatusList : { itemId: any; value: any; }[] = []
  inviteStatusList : { itemId: any; value: any; }[] = [];
  @HostListener('click')
  clickInside() {
    this.wasInside = true;
  }
  @HostListener('document:click')
  clickout() {
    if (!this.wasInside) {
      this.searchData.setjobHighLight('null');
    }
    this.wasInside = false;
  }
  loadDate: any = [];
  flag: boolean = false;
  userType: any;
  applyingJob: boolean = false
  checkedList: any = []
  @Input() applyingCandidate: any;
  @Output() selectedJob: EventEmitter<any> = new EventEmitter()
  @Output() recallfilterAPI: EventEmitter<any> = new EventEmitter()
  @Input() getJobsugg: any;
  @Input() showStatus: any;
  @Input() jobsFoundStatus: any;
  @Input() responseReceived: any;
  @Input() passValues: Array<JobModel> = [];
  @Input() Obj: JobModel;
  @Input() viewSize: any;
  @Input() loadAPIcall: Boolean;
  @Input() focus: string;
  @Input() updateJobModule: jobModuleConfig;
  @Output() jobListing = new EventEmitter();

  downloadurl = AppSettings.photoUrl;
  bsModalRef: BsModalRef;
  connectionRequestRef: BsModalRef;
  candidateSupplyRef: BsModalRef;
  candidateId
  object: any;
  currentTimeDate: string | Date;
  unit = { duration: '30' };

  jobsInvitedToApplyFlag: boolean = false
  // updatedDate: any = new Date();
  rtrformModal: BsModalRef;
  rtrformgrp: UntypedFormGroup

  // @Input() type:any;
  // @Input() data: any;
  userId = localStorage.getItem('userId');

  clickItemActive: any;
  jobId
  seletedChatItem;
  followerFlag: boolean = false
  GigsumoConstant = GigsumoConstants;
  messageData: any;
  messagemodelflag: any;
  @ViewChild('childModal') childModal?: ModalDirective;
  @Output() suggcandidate: EventEmitter<any> = new EventEmitter();
  @ViewChild("myFileInputcandidate") myFileInputcandidate;

  submited: boolean = false;
  networkflag: boolean = false
  showmodel = false
  creditform: UntypedFormGroup;
  connectionStatus: string;
  values: any;
  counterpartsDetails: any;
  clickEventsubscription: Subscription;
  loadscribtion: Subscription;
  streamRes: any = null;
  jobsResponse: any = [];
  updateJobListSubx: Subscription;
  queryParamsSubscription: Subscription;
  pasDatehide: any = [];
  ngunsubscribe = new Subject();
  createSubjectSubscription: Subscription;
  itemsLoaded: boolean = false;
  constructor(private JobServicecolor: JobService, private userService: UserService, private compOne: ModelPriceComponent, private activatedRoute: ActivatedRoute,
    private el: ElementRef, private job: NewJobComponent, private _socket: SocketService,
    private commonValues: CommonValues, private stremService: StreamService, private util: UtilService, private _location: Location,
    private formBuilder: UntypedFormBuilder, private searchData: SearchData, private a_route: ActivatedRoute,
    private modalService: BsModalService, private router: Router, private api: ApiService,    private tourService: TourService,
    private planService: PricePlanService, private changeDet: ChangeDetectorRef) {
    super();
    this.userType = localStorage.getItem('userType');
    this.searchData.getjobHighLight().subscribe(res => {
      if (res != 'jobId') {
        this.jobIdHighLight = res
      }
    });

    this.activatedRoute.params.subscribe(response => {
      if (response.networkflag) {
        this.networkflag = true;
      }
      if (response['candidatefilter'] == "true") {
        this.jobsInvitedToApplyFlag = true
      } else {
        this.jobsInvitedToApplyFlag = false
      }
    })

    this.clickEventsubscription = this.stremService.getstreamResponse().subscribe((res) => {
      this.streamRes = res;
    });

    this.createSubjectSubscription = this.searchData.getCreateSubjectJob().subscribe((res) => {
      if (res == true) {
        this.createANewSubject();
      }
    });

    // this.loadscribtion = this.commonValues.getjobRelaodDate()
    //   .pipe(takeUntil(this.ngunsubscribe))
    //   .subscribe((res) => {
    //     this.loadDate = res.values;
    //     if (res.receivedSearchAfterKeyJob == null) {
    //       this.itemsLoaded = false;
    //     }
    //     this.loadDate.filter((element, i) => element === this.loadDate[i].element);

    //     this.activatedRoute.queryParams.subscribe(response => {
    //       if (response.value == 'fromFeed') {
    //         const navigationExtras: NavigationExtras = {
    //           queryParams: {}
    //         };
    //         this.router.navigate(["newjobs"], navigationExtras);
    //         setTimeout(() => {
    //           this.refreshPage();
    //         }, 1000);
    //       } else {
    //         setTimeout(() => {
    //           res.values.map((element, index) => {
    //             if (index == 0 && !this.itemsLoaded && this.viewSize == 'small') {
    //               this.itemsLoaded = true;
    //               let data: any = {};
    //           data.eachCandidate = true;
    //           data.jobId = element.jobId;
    //           this.searchData.setJobID(data);

    //           // return this.open(element);
    //             }
    //           })
    //         }, 1000);
    //       }
    //     })


    //     this.nextSubscription();
    //     this.completeSubscription();
    //   });
    this.updateJobListSubx = this.commonValues.getJobData().subscribe(jobObject => {
      this.updateJobObject(jobObject);
    })


  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.passValues != undefined && changes.passValues.currentValue != undefined) {
      this.passValues = changes.passValues.currentValue;
    }
    if (changes.Obj && changes.Obj.currentValue) {
      this.selectedItem = changes.Obj.currentValue.jobId;
    }
  }

  updateJobObject(JobObject): void {
    this.passValues.forEach((res, index) => {
      if (res.jobPostedBy == JobObject.jobPostedBy) {
        this.passValues[index] = { ...this.passValues[index], connectionStatus: JobObject.connectionStatus }
      }
      if (res.jobId == JobObject.jobId) {
        this.passValues[index] = { ...this.passValues[index], status: JobObject.status }
        // this.jobReload.emit("reload")
        //recenttly added steps
        JobObject.index = index
        this.jobReload.emit(JobObject);
      }
    });
  }
  isJobOwner(data: JobModel) {
    return (
      ((data.status === "FILLED" || data.status === "CLOSED") && data.jobPostedBy === this.userId) ||
      (data.status != 'ACTIVE' && data.jobPostedBy != this.userId)
    )
  }

  completeSubscription(): void {
    this.ngunsubscribe.complete()
  }

  nextSubscription(): void {
    this.ngunsubscribe.next(true)
  }

  createANewSubject(): void {
    this.ngunsubscribe = new Subject();
  }

  connect(values) {

    var data: any = {};
    data.userId = values.jobPostedBy;
    data.requestedBy = localStorage.getItem("userId");
    this.util.startLoader();
    this.api.create("user/connect", data).subscribe((res) => {
      if (res.code == "00000") {
        this.util.stopLoader();
        this.connectionStatus = 'REQUEST_SENT';
        values.connectionStatus = this.connectionStatus;
        this.commonValues.setJobData(values);
        //message to show connect request is sent successfully
        setTimeout(function () {
          Swal.fire({
            icon: "success",
            title: "Request sent successfully",
            showConfirmButton: false,
            timer: 2000,
          });
        }, 200);

      } else if (res.code == "88888") {
        this.util.stopLoader();
        Swal.fire({
          icon: "info",
          title: "Request failed",
          text: "Request coundn't be sent now. Please try after some time.",
          showConfirmButton: false,
          timer: 3000,
        });
      } else if (res.code == 'U0031') {
        this.util.stopLoader()
      }
    }, err => {
      this.util.stopLoader();

    });
  }


  OnChangeCurrentOrg() {
    if (this.jobPostForm.get('clientType').value == GigsumoConstants.DIRECT_HIRE) {
      this.jobPostForm.patchValue({ clientName: this.jobPostForm.get("jobPostedBehalfOf").value })
      this.jobPostForm.get("clientName").disable()
    }
  }

  BackBreadCream() {
    this._location.back();
  }
  LandingPage() {
    this.router.navigate(["landingPage"]);
  }


  // img: any;
  ngOnInit(): void {
    if(this.userType!="JOB_SEEKER"){
      this.planService.UPDATE_USERDETAILS("ACTIVE_INTERACTIONS");
    }
    this.creditform = this.formBuilder.group({
      point: [null, Validators.compose([Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)])]
    });

    this.generateYears()

    if(this.viewSize === "extra-small"){
      this.getAppliedFilter();
    }

    // && Object.keys(this.applyingCandidate).length == 0
    // && Object.keys(this.applyingCandidate).length > 0
    // if (this.applyingCandidate != undefined && this.jobsInvitedToApplyFlag == false) {
    //   this.applyingJob = false
    // } else if (this.applyingCandidate != undefined && this.jobsInvitedToApplyFlag == true) {
    //   this.applyingJob = true;
    // }

    this.a_route.queryParams.subscribe((res) => {
      this.candidateId = res.candidateId
      // this.selectedItem = res.jobId
      this.jobId = res.jobId
    })
  }


  getAppliedFilter() {
    this.api.create('listvalue/findbyList' , {domain : "JOB_APPLICATION_BUYER_ACTIONS,JOB_INVITATION_SUPPLIER_ACTIONS"}).subscribe(res=>{
      const Csorted : Array<any> =  res.data.JOB_APPLICATION_BUYER_ACTIONS && res.data.JOB_APPLICATION_BUYER_ACTIONS.listItems;
      const Isorted : Array<any> =  res.data.JOB_INVITATION_SUPPLIER_ACTIONS && res.data.JOB_INVITATION_SUPPLIER_ACTIONS.listItems;
      if(Csorted && Isorted){
        this.currentStatusList = Csorted.map(x => {
          return {itemId : x.itemId , value : x.value};
        });
        this.inviteStatusList = Isorted.map(x => {
          return {itemId : x.itemId , value : x.value};
        });
        console.log("FILTER_STATUS" ,this.currentStatusList , this.inviteStatusList);
      }
     });
  }




  getFilterValue(data: any) {

    let arrs: Array<any> = [];
    let find : any = {};

    if(data.currentStatus && data.currentStatus !=null){
      arrs = this.currentStatusList ? [...this.currentStatusList] : [];
      find = arrs.find(c => c.itemId === data.currentStatus);
    }
    else {
      arrs = this.inviteStatusList ? [...this.inviteStatusList] : [];
      find = arrs.find(c => c.itemId === data.inviteStatus);
    }

    return find ? find.value : null;
  }





  ngOnDestroy(): void {
    this.ngunsubscribe.next(true);
    this.ngunsubscribe.complete();
    if (this.queryParamsSubscription) {
      this.queryParamsSubscription.unsubscribe();

    }
    if (this.updateJobListSubx) {
      this.updateJobListSubx.unsubscribe();
    }

    if (this.loadscribtion) {
      this.loadscribtion.unsubscribe();
    }

    if (this.clickEventsubscription) {
      this.clickEventsubscription.unsubscribe();
    }
  }

  get credit() {
    return this.creditform.controls
  }

  async selectCheckbox(jobId: string, selected) {
    this.getCheckedItemList();

    let foundItems: Array<any> = this.passValues.filter(item => item.isSelected === true);
    let data = [];
    if (foundItems.length > this.planService.ACTIVE_INTERACTION) {
      this.passValues.map(ele => {
        if (ele.jobId === jobId) {
          ele.isSelected = false;
          selected.checked = false;
        }
        if (ele.isSelected) {
          data.push(ele);
        }
      });
      this.selectedJob.emit(JSON.stringify(data));
      const userData = await this.planService.UPDATE_USERDETAILS("ACTIVE_INTERACTIONS");
      let availablePoints = null;
      let actualPoints = null;
      let utilizedPoints = null;
      let promotional = null;
      userData.userDetail.userPlanAndBenefits.benefitsUsages.forEach(ele => {
        if (ele.benefitKey == 'ACTIVE_INTERACTIONS') {
          availablePoints = ele.available
          actualPoints = ele.actual
          utilizedPoints = ele.utilized
          promotional = ele.promotional
        }
      })
      this.planService.expiredPopup("ACTIVE_INTERACTIONS", "PAY", null, null, null, availablePoints, actualPoints, utilizedPoints, promotional);

      // this.planService.expiredPopup("ACTIVE_INTERACTIONS");
    }

  }
  getInitials(fullname: string): string {
    return this.JobServicecolor.getInitials(fullname);
  }

  getColor(fullname: string): string {
    return this.JobServicecolor.getColor(fullname);
  }
  widgetReload(data) {
    //this.clickItemActive=data;
    this.suggcandidate.emit(data);

  }


  getCheckedItemList() {
    this.checkedList = [];
    for (var i = 0; i < this.passValues.length; i++) {
      if (this.passValues[i].isSelected)
        this.checkedList.push(this.passValues[i]);
    }
    this.checkedList = JSON.stringify(this.checkedList);
    this.selectedJob.emit(this.checkedList);
  }

  c: any;
  d: any;
  fromBusinessPage: boolean = false
  fromBusinessPageId: any;
  submitRTR: boolean = false;
  formValidate(val) {
    this.submitRTR = true

    const expression: RegExp = /^-?(0|[1-9]\d*)?$/;

    const result: boolean = expression.test(val)
    if (result == true && this.rtrformgrp.valid && this.rtrformgrp.value.termsandcondition) {
      this.rtrformModal.hide()
      this.apply(this.tempApplyValue);
    }

  }

  checkConnectionStatus(values): Observable<any> {
    const apiURL = 'user/checkConnectionStatus';
    const params = new HttpParams()
      .set('userId', this.userId)
      .set('connnectorId', values.jobPostedBy);

    const urlWithParams = `${apiURL}?${params.toString()}`;
    return this.api.query(urlWithParams);
  }

  tempApplyValue: any
  jobData: any;
  apply(values: any, connectionTemplate?: TemplateRef<any>, candidateSupplyTemplate?: TemplateRef<any>) {
    this.jobData = values;
    if (values.isFeatured) {
      this.proceedToApply(values, candidateSupplyTemplate);
    } else if (!values.isFeatured) {
      if (values.connectionStatus === 'CONNECTED') {
        this.proceedToApply(values, candidateSupplyTemplate);
      } else if (values.connectionStatus !== 'CONNECTED') {
        this.proceedToApply(values, candidateSupplyTemplate);
        // to be used later
        // this.openConnectionTemplate(values.connectionStatus, values, connectionTemplate);
      }
    }
  }

  closeCandidateSupplyModal() {
    this.modalService.hide(1);
    this.dataPasstoSkillwidgets = []
  }

  closeModal(event) {
    console.log("This is happening")
    this.closeCandidateSupplyModal();
  }

  applyResponse: any = [];
  myCandidatesForApply(jobId: string, candidateSupplyTemplate: any) {
    const responseData: any = {
      "source": {
        "all": false,
        "myCandidates": true,
        "allPlatFormCandidates": false,
        "teamCandidates": false,
        "benchNetworkCandidates": false,
        "freeLancerNetworkCandidates": false,
        "mtaNetworkCandidates": false,
        "jobSeekerNetworkCandidates": false,
        "featured": false,
        "suggestedCandidates": false
      },
      "workType": {
        "all": false,
        "remoteWork": false,
        "relocationRequired": false,
        "workFromHome": false
      },
      "jobId": jobId,
      "workAuthorization": [],
      "engagementType": [],
      "availableIn": [],
      "status": [],
      "searchAfterKey": null,
      "city": null,
      "state": null,
      "country": null,
      "zipCode": null,
      "submissionFilters": [],
      "postedFrom": null,
      "postedTo": null,
      "limit": 10,
      "userId": this.userId,
      "searchContent": ""
    }

    this.api.create('candidates/filter', responseData).subscribe(res => {

      if (res.code === GigsumoConstants.SUCESSCODE) {
        this.applyResponse = res.data.candidateList;
        if (this.applyResponse.length === 0) {
          this.candidateFoundStatus = "Couldn't find any Candidates for the applied filters.";
        }
        const config: ModalOptions = { class: 'modal-lg', backdrop: 'static', keyboard: false };
        this.candidateSupplyRef = this.modalService.show(candidateSupplyTemplate, config);
      }
    });

  }

  termsCheck: boolean;
  resumeData: any = [];
  rtrFormData: any;
  getchildData(data: any) {

    this.termsCheck = data.terms;
    if (data.resumes) {
      this.resumeData = data.resumes
    }
      this.termsCheck = data.terms;

    if (data.value != null) {
      this.dataPasstoSkillwidgets = data.value;
      this.rtrFormData = data.formData;
    } else {
      this.dataPasstoSkillwidgets = [];
    }
  }

  removeUserfromTag(data) {


    if (data === "CLEAR") {
      this.dataPasstoSkillwidgets = [];
      return;
    }

    this.removeTagvalues = data;
    this.applyResponse = this.applyResponse.map(element => {
      if (element.candidateId === data.candidateId) {
        element.isSelected = false;
        element.remove = true;
      }
      return element;
    });

    this.dataPasstoSkillwidgets.forEach((element, i) => {
      if (element.candidateId === data.candidateId) {
        this.dataPasstoSkillwidgets.splice(i, 1);
        this.dataPasstoSkillwidgets = [...this.dataPasstoSkillwidgets];
        element.isSelected = false;
      }
    });

    console.log("Removed ", this.applyResponse, this.dataPasstoSkillwidgets);

  }

  refreshPage(): void {

    // window.location.reload();

  }

  cancelConnectionRequest() {
    this.modalService.hide(1);
  }

  async proceedToApply(values, candidateSupplyTemplate) {
    if ( this.userType != "JOB_SEEKER" && this.planService.ACTIVE_INTERACTION === 0) {
      const userData = await this.planService.UPDATE_USERDETAILS("ACTIVE_INTERACTIONS");
      let availablePoints = null;
      let actualPoints = null;
      let utilizedPoints = null;
      let promotional = null;
      userData.userDetail.userPlanAndBenefits.benefitsUsages.forEach(ele => {
        if (ele.benefitKey == 'ACTIVE_INTERACTIONS') {
          availablePoints = ele.available
          actualPoints = ele.actual
          utilizedPoints = ele.utilized
          promotional = ele.promotional
        }
      })
      this.planService.expiredPopup("ACTIVE_INTERACTIONS", "PAY", null, null, null, availablePoints, actualPoints, utilizedPoints, promotional);

      // this.planService.expiredPopup("ACTIVE_INTERACTIONS");
      return;
    }
    this.myCandidatesForApply(values.jobId, candidateSupplyTemplate);
    this.c = this.activatedRoute.pathFromRoot[0]['_routerState']['snapshot'].url
    this.d = this.c.substr(1, 8)
    if (this.d == 'business' && localStorage.getItem('isAFollower') == 'false') {
      Swal.fire({
        icon: "info",
        title: "Following Required!",
        text: "Please, follow the business page for applying the job.",
        showConfirmButton: true,
      });
    } else {
      if (this.d == 'business') {
        this.fromBusinessPage = true
        this.fromBusinessPageId = localStorage.getItem('businessId')

      } else {
        this.fromBusinessPage = false
      }


      values.clientType = values.user.clientType;
      values.userType = values.user.userType;
      let datas: any = {};
      var datacheck = [{ 'userId': localStorage.getItem('userId') }]
      datas.jobPostedBy = localStorage.getItem('userId');
      datas.jobId = values.jobId;
      datas.appliedBy = datacheck;
      values.jobfilter = true;
      values.filterTitle = 'Select';
      if (this.fromBusinessPage == true) {
        values.fromBusinessPage = true
        values.fromBusinessPageId = this.fromBusinessPageId
      } else {
        values.fromBusinessPage = false
      }
      values.jobDescription = "";


    }
  }

  get rtrFormControls() {
    return this.rtrformgrp.controls
  }

  like(values: any) {
   if(values.jobPostedBy!=localStorage.getItem('userId')){
    let datas: any = {};
    if (values.isLiked == false || values.isLiked == null) {
      datas.likeStatus = "LIKE"
    } else if (values.isLiked == true) {
      datas.likeStatus = "UNLIKE"
    }

    datas.userId = localStorage.getItem('userId');
    datas.jobId = values.jobId;
    this.util.startLoader();
    this.api.updatePut("jobs/updateJobLiked", datas).subscribe((res) => {
      this.passValues.forEach(ele => {
        if (res.data.jobData.jobId == ele.jobId) {
          ele.likesCount = res.data.jobData.likesCount;
          ele.isLiked = res.data.jobData.isLiked;
        }
      })

       this.util.stopLoader();
    }, err => {
      this.util.stopLoader();
    });
   }else{
    this.goTo(values, 'jobs-liked')
   }
  }

  goTo(values, param) {

    this.selectedItem = values.jobId;
    console.log(values);

    if (this.updateJobModule) {

      if (values.jobPostedBy == this.userId) {

        if (param == 'jobs-applied' && values.appliedCount > 0 && values.status != 'INACTIVE') {
          this.updateJobModule.jobDetails.apply(this.updateJobModule.source, ["job-applicants", { value: values, for: "TAB_ROUTE" }]);
        } else if (param == 'views' && values.status != 'INACTIVE') {
          this.updateJobModule.jobDetails.apply(this.updateJobModule.source, ["jobs-viewed", { value: values, for: "TAB_ROUTE" }]);
        }
        else if (param == 'jobs-liked' && values.status != 'INACTIVE') {
          this.updateJobModule.jobDetails.apply(this.updateJobModule.source, ["jobs-liked", { value: values, for: "TAB_ROUTE" }]);
        }
        else if (param == 'candidates-invited' && values.status != 'INACTIVE' && values.interestShownCount > 0) {
          this.updateJobModule.jobDetails.apply(this.updateJobModule.source, ["candidates-invited", { value: values, for: "TAB_ROUTE" }]);
        }
      }
      else if (values.jobPostedBy != this.userId) {

        if (param == 'jobs-applied' && values.appliedCount > 0 && values.status != 'INACTIVE') {
          this.updateJobModule.jobDetails.apply(this.updateJobModule.source, ["job-applicants", { value: values, for: "TAB_ROUTE" }]);
        } else if (param == 'views' && values.status != 'INACTIVE') {
          this.updateJobModule.jobDetails.apply(this.updateJobModule.source, ["job-details", { value: values, for: "TAB_ROUTE" }]);
        }
        else if (param == 'candidates-invited' && values.status != 'INACTIVE' && values.interestShownCount > 0) {
          this.updateJobModule.jobDetails.apply(this.updateJobModule.source, ["candidates-invited", { value: values, for: "TAB_ROUTE" }]);
        }
        else if (values.appliedCount > 0 && param == 'candidate-applied' && values.status != 'INACTIVE' && values.candidatesApplied && this.userType!='RECRUITER') {
          this.updateJobModule.jobDetails.apply(this.updateJobModule.source, ["candidate-applied", { value: values, for: "TAB_ROUTE" }]);
        }
      }

    }

  }

  openModalWithComponent() {
    const initialState: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      size: "open"
    };
    this.bsModalRef = this.modalService.show(CreditModelComponent, initialState);
  }



  openConnectionTemplate(connectionStatus, values, connectionTempate?: TemplateRef<any>) {
    this.connectionStatus = connectionStatus;
    this.values = values;
    const initialState: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      size: 'sm',
    };
    this.api.query("user/" + this.values.jobPostedBy).subscribe(res => {
      if (res.code == '00000') {
        this.counterpartsDetails = res;
        this.connectionRequestRef = this.modalService.show(connectionTempate, initialState);
      }
    })
  }

  showinviteResumeView(items): boolean {
    if (this.focus === 'candidate' && (items.inviteStatus == undefined && items.currentStatus == undefined)) {
      return true;
    } else if (this.focus === 'resume' && items.resumeRequestStatus != 'COMPLETED' && items.resumeRequestStatus != 'INITIATED') {
      return true;
    } else {
      return false;
    }
  }


  selectedItem: any;
  async open(values: any, index?: any) {

    this.selectedItem = values.jobId;

    try {

      let data: any = {
        jobId: values.jobId,
        jobPostedBy: this.userId
      };

      if (values.jobPostedBy != this.userId && !values.isViewed) {
        this.api.updatePut("jobs/updateJobViewed", data).subscribe((res: any) => {
          if (res.code === GigsumoConstants.SUCESSCODE) {
            this.updateJobModule.jobDetails.apply(this.updateJobModule.source, [values, { value: null, for: "JOB_DETAIL" }]);
            values.isViewed = true;
          }
        });
      }
      else if (values.isViewed || values.jobPostedBy === this.userId) {
        this.updateJobModule.jobDetails.apply(this.updateJobModule.source, [values, { value: null, for: "JOB_DETAIL" }]);
      }

      // if (values.status !== "BLOCKED") {
      //   this.util.startLoader();

      //   if (values.clientType == null) {
      //     values.clientType = values.user.clientType;
      //   }

      //   if (values.user != null) {
      //     values.clientType = values.user.clientType;
      //   }

      // let data: any = {
      //   jobId: values.jobId,
      //   jobPostedBy: values.jobPostedBy
      // };

      //   if (
      //     values.isViewed != null &&
      //     values.isViewed == true &&
      //     values.jobPostedBy != this.userId
      //   ) {
      //     this.router.navigate(['newjobs/job-details'], { queryParams: data });
      //   } else if (
      //     values.jobPostedBy == this.userId ||
      //     localStorage.getItem('userType') == 'JOB_SEEKER'
      //   ) {
      //     this.router.navigate(['newjobs/job-details'], { queryParams: data });
      //   } else if (values.isViewed) {
      //     this.router.navigate(['newjobs/job-details'], { queryParams: data });
      //   } else {
      // if (values.jobPostedBy != this.userId && values.isViewed == false) {
      //   await this.api.updatePut("jobs/updateJobViewed", data).toPromise();
      //   this.router.navigate(['newjobs/job-details'], { queryParams: data });
      // } else {
      //       this.router.navigate(['newjobs/job-details'], { queryParams: data });
      //     }
      //   }
      // }
    } catch (error) {
      // Handle errors if needed
    } finally {
      this.util.stopLoader();
    }
  }

  routeBusiness(data : JobModel){
    const {jobPostedBy , jobId} =data;

    if(jobPostedBy === this.userId){
      this.router.navigate(['newjobs'], { queryParams: { jobId : jobId , tabName : 'job-details' , From: "BUSINESS_JOBS" } });
    }
    else if(jobPostedBy != this.userId){
      this.router.navigate(['newjobs'], { queryParams: { jobId : jobId , tabName : 'job-details' , From: "BUSINESS_CONNECTION_JOBS" } });
    }


  }

  downgradeJob(items) {

    let data: any = {}
    data = items;
    data.isFeatured = false;
    //data.points = 0;
    data.consumptionType = null;
    data.jobReferenceId=data.jobId;
    this.api.updatePut("jobs/updateJob", data).subscribe((res) => {

      this.passValues.forEach(ele => {
        if (items.jobId == ele.jobId) {
          ele.updatedOn = res.data.jobData.updatedOn;

          // this.sortDate(this.passValues);
        }
      })
      if (this.streamRes != null && this.streamRes.code == '00000') {
        this.stremService.clear();
      }
      this.util.stopLoader();
      if (res.code == '00000') {

        Swal.fire({
          icon: "success",
          title: "Downgraded Successfully",
          showDenyButton: false,
          showConfirmButton: false,

          timer: 2000,

          // timer: 3500,
        })
        this.selectedJob.emit(null);
        this.jobReload.emit("reload")

      }
    }, err => {
      this.util.stopLoader();
    });
  }
  userData = {
    userId: localStorage.getItem('userId'),
    userType: localStorage.getItem('userType')
  }

  updatedDate: string;
  availablepoints: any;
  async featurejobvalues(item) {
    this.profileDetailResponse = await this.userService.userProfileDetails(this.userData);
    let currenttimezonedate = new Date(this.profileDetailResponse.currentTimeByTimezone);
    currenttimezonedate.setHours(0, 0, 0, 0);
    this.updatedDate = String(item.featuredUpdatedOn);
    let currentDates = this.util.dateFormatestring(this.updatedDate);
    this.availablepoints = this.profileDetailResponse.userCredits;
    if (item.isFeatured == undefined || currenttimezonedate > currentDates && item.isFeatured == false) {
      this.planService.expiredPopup("UPGRADE_JOBS", "UPGRADE", item, currenttimezonedate, currentDates, this.availablepoints, null, null, null);

    } else if (item.isFeatured == false) {
      this.compOne.upgradejobandcandidatedetails(item, 'Upgrade Job', currenttimezonedate, currentDates);
    }

  }

  enable(event) {
    if (event.target.checked) {
      this.object.status = 'ACTIVE';
    }
    else if (!event.target.checked) {
      this.object.status = 'INACTIVE';
    }

  }

  test() {


  }

  fileChangeEvent(data) {
    this.myFileInputcandidate.nativeElement.click();
  }


  sortDate(data) {
    return data.sort((a, b) => {
      return b.isFeatured - a.isFeatured;
    });
  }

  sortDateByNormalJobs(passValues: any) {
    let sortedDate = passValues.sort((a, b) => { return <any>new Date(b.updatedOn) - <any>new Date(a.updatedOn); })
    this.sortDate(sortedDate);
  }




  jobIdHighLight: any
  async enableJob(event, value) {
    if (event === 'ACTIVE') {
      const userData = await this.planService.UPDATE_USERDETAILS("JOB_CANDIDATE_POSTINGS");
      if (userData.isExpired) {
        let availablePoints = null;
        let actualPoints = null;
        let utilizedPoints = null;
        let promotional = null;
        userData.userDetail.userPlanAndBenefits.benefitsUsages.forEach(ele => {
          if (ele.benefitKey === 'JOB_CANDIDATE_POSTINGS') {
            availablePoints = ele.available
            actualPoints = ele.actual
            utilizedPoints = ele.utilized
            promotional = ele.promotional
          }
        })
        this.planService.expiredPopup("JOB_CANDIDATE_POSTINGS", "PAY", null, null, null, availablePoints, actualPoints, utilizedPoints, promotional);

        return;
      }
      else {
        this.afterPlanValidationstatuschange(event, value);
      }
    } else {
      this.afterPlanValidationstatuschange(event, value);
    }
  }


  afterPlanValidationstatuschange(event, value) {
    value.status = event;
    let datas: any = {};
    var datacheck = [{ 'userId': localStorage.getItem('userId') }]
    datas.jobPostedBy = localStorage.getItem('userId');
    datas.jobId = value.jobId;
    datas.appliedBy = datacheck;
    value.jobReferenceId=value.jobId;

    this.api.updatePut("jobs/updateJob", value).subscribe(jobres => {
      if (jobres) {
        this.jobReload.emit(event === 'ACTIVE' ? 'updateReload' : 'reload');
        this.util.stopLoader();
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Job updated successfully",
          showConfirmButton: false,
          timer: 2000,
        });
      }
      this.selectedJob.emit(null);
    });

  }

  backdropConfig = {
    backdrop: true,
    ignoreBackdropClick: true,
    keyboard: false,
  };

  buycredit(id) {
    this.submited = true;
    if (id != 'noval') {
      this.creditform.patchValue({ 'point': id });
    }
    if (this.creditform.valid) {
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: { confirmButton: 'btn btn-success', cancelButton: 'btn btn-danger' },
        buttonsStyling: false
      })

      swalWithBootstrapButtons.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          if (this.creditform.valid) {
            this.submited = false;
            let data: any = {};
            data.userId = localStorage.getItem('userId'),
              // data.totalPoints = this.creditform.value.point;
              this.util.startLoader();
            this.api.create("credits/buyCredits", data).subscribe(res => {
              this.util.stopLoader();
              this.creditform.reset();
              this.modalRef.hide()
              this.showmodel = false;

              if (res.code == "00000") {
                Swal.fire({
                  icon: "success",
                  title: "Credit Added Successfully",
                  showDenyButton: false,
                  showConfirmButton: false,

                  timer: 2000,
                  // confirmButtonText: `ok`,
                  // timer: 2000,
                })
                this.creditform.reset();


              }
            }, err => {
              this.util.stopLoader();
            })
          } else if (this.creditform.invalid) {
            this.submited = true;

          }


        } else if (result.dismiss === Swal.DismissReason.cancel) {

          this.creditform.reset();

        }
      })


    }
  }


  purchesCredits(buyCredit: TemplateRef<any>) {
    this.modalRef.hide();
    //this.modalRef = this.modalService.show(buyCredit, this.backdropConfig);
    this.router.navigate(['checkout'])
  }

  closemodel() {
    this.modalRef.hide();
  }
  serverCurrentDate: string;
  servertimedate: string;
  disable_for_draft: boolean = false;

  // async saveJob(statusvalue) {
  //   if(this.object.status!='ACTIVE'){
  //   let isJobOrCandidayeExpired : boolean = await this.pricePlanService.UPDATE_USERDETAILS("JOB_CANDIDATE_POSTINGS");

  //   if(isJobOrCandidayeExpired){
  //     this.pricePlanService.expiredPopup("JOB_CANDIDATE_POSTINGS");
  //     return;
  //   }
  //   else{
  //     this.afterPlanValidation(statusvalue);
  //   }
  //  }else{
  //   this.afterPlanValidation(statusvalue);
  //  }
  // }

  async saveJob(statusvalue: string) {

    this.submit = true
    this.disable_for_draft = true;
    if (statusvalue == 'ACTIVE' && this.jobPostForm.status == "INVALID") {
      this.disable_for_draft = false;
      return true;
    }


    // check credit
    // var profiledata: any = {}
    // profiledata.userId = localStorage.getItem('userId')
    // profiledata.userType = localStorage.getItem('userType')
    this.jobPostForm.get("status").setValue(this.object.status);
    this.jobPostForm.get("isFeatured").setValue(this.object.isFeatured);

    //this.api.create('user/profileDetails', profiledata).subscribe(profileres => {

    //let element: any
    // this.serverCurrentDate = String(profileres.data.currentTimeByTimezone);

    // if (this.jobPostForm.value.effectiveUntil == null) {
    //   this.jobPostForm.get("effectiveUntil").setValue(this.jobPostForm.value.effectiveDate);
    // }

    // this.servertimedate = String(profileres.data.serverDate);
    // let fdate1 = new Date(this.jobPostForm.value.effectiveDate);
    // let untildate = new Date(this.jobPostForm.value.effectiveUntil);
    // let sdatet2 = this.util.dateFormatestring(this.serverCurrentDate);
    // let creditserverdate = this.util.dateFormatestring(this.servertimedate);

    // fdate1.setHours(0, 0, 0, 0);
    // sdatet2.setHours(0, 0, 0, 0);


    //element = profileres.data.creditConsumptions.find(item => item.creditType === AppSettings.CREATE_JOB);
    // if (this.object.status == "DRAFTED" && profileres.data.creditPoints < 5 && statusvalue != "DRAFTED" && this.object.isFeatured != true ||
    //   this.object.status == "ON HOLD" && profileres.data.creditPoints < 5 && statusvalue != "DRAFTED" && this.object.isFeatured != true ||
    //   this.object.status == "INACTIVE" && profileres.data.creditPoints < 5 && statusvalue != "DRAFTED" && this.object.isFeatured != true ||
    //   this.object.status == "INACTIVE_DUE_TO_LOW_CREDITS" && profileres.data.creditPoints < 5 && statusvalue != "DRAFTED" && this.object.isFeatured != true ||
    //   this.object.status == "DEACTIVATED" && profileres.data.creditPoints < 5 && statusvalue != "DRAFTED" && this.object.isFeatured != true) {
    //   this.util.stopLoader();
    //   this.modalRef.hide();
    //   this.openModalWithComponent();
    //   return;
    // }
    // if (this.object.status == "DRAFTED" && profileres.data.creditPoints < 25 && statusvalue != "DRAFTED" && this.object.isFeatured == true ||
    //   this.object.status == "ON HOLD" && profileres.data.creditPoints < 25 && statusvalue != "DRAFTED" && this.object.isFeatured == true ||
    //   this.object.status == "INACTIVE" && profileres.data.creditPoints < 25 && statusvalue != "DRAFTED" && this.object.isFeatured == true ||
    //   this.object.status == "INACTIVE_DUE_TO_LOW_CREDITS" && profileres.data.creditPoints < 25 && statusvalue != "DRAFTED" && this.object.isFeatured == true ||
    //   this.object.status == "DEACTIVATED" && profileres.data.creditPoints < 25 && statusvalue != "DRAFTED" && this.object.isFeatured == true) {

    //   this.util.stopLoader();
    //   this.modalRef.hide();
    //   this.openModalWithComponent();

    //   return;
    // }

    if (statusvalue == "DRAFTED") {
      for (var allstatus in this.jobPostForm.controls) {
        if (allstatus != 'clientName' && allstatus != 'jobTitle') {

          this.jobPostForm.get(allstatus).clearValidators();

        }
        this.jobPostForm.controls[allstatus].updateValueAndValidity();
      }
      this.jobPostForm.get('status').patchValue('DRAFTED');
    }


    if (this.jobPostForm.valid) {
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: { confirmButton: 'btn btn-success', cancelButton: 'btn btn-danger' },
        buttonsStyling: false
      })

      // if (statusvalue == "DRAFTED") {
      //   this.jobPostForm.patchValue({
      //     'consumptionType': null,
      //     'points': 0,
      //   })
      // }
      if (this.object.status == 'DRAFTED' && statusvalue != 'DRAFTED') {
        //if (  localStorage.getItem('userType') == 'student' || this.userType == 'JOB_SEEKER') {
        this.jobPostForm.patchValue({
          // "consumptionType": element.creditType,
          "createdByUserType": localStorage.getItem('userType'),
          //"points": element.points,
          "status": "ACTIVE"
        })
        //}

      }




      // if (this.object.statusUpdatedOn != undefined) {

      //   let statusupdateddate = this.util.dateFormatestring(this.object.statusUpdatedOn);

      //   if (
      //     this.object.status == 'ON HOLD' && statusvalue != 'DRAFTED' && creditserverdate > statusupdateddate && this.object.isFeatured != true ||
      //     this.object.status == 'INACTIVE' && statusvalue != 'DRAFTED' && creditserverdate > statusupdateddate && this.object.isFeatured != true ||
      //     this.object.status == 'DEACTIVATED' && statusvalue != 'DRAFTED' && this.util.formatDateddd(fdate1) == this.util.formatDateddd(sdatet2) && this.object.isFeatured != true ||
      //     this.object.status == 'INACTIVE_DUE_TO_LOW_CREDITS' && statusvalue != 'DRAFTED' && this.object.isFeatured != true && untildate >= sdatet2
      //   ) {
      //     if (profileres.data.creditPoints >= element.points || localStorage.getItem('userType') == 'student' || this.userType == 'JOB_SEEKER') {
      //       this.jobPostForm.patchValue({
      //         "consumptionType": element.creditType,
      //         "createdByUserType": localStorage.getItem('userType'),
      //         "points": element.points,
      //         "status": "ACTIVE"
      //       })
      //     }
      //   }
      // }
      // if (this.object.statusUpdatedOn != undefined) {
      //   let statusupdateddate = this.util.dateFormatestring(this.object.statusUpdatedOn);
      //   if (
      //     this.object.status == 'ON HOLD' && statusvalue != 'DRAFTED' && creditserverdate > statusupdateddate && this.object.isFeatured == true ||
      //     this.object.status == 'INACTIVE' && statusvalue != 'DRAFTED' && creditserverdate > statusupdateddate && this.object.isFeatured == true || this.object.status == 'DEACTIVATED' && statusvalue != 'DRAFTED' && this.util.formatDateddd(fdate1) == this.util.formatDateddd(sdatet2) && this.object.isFeatured == true || this.object.status == 'INACTIVE_DUE_TO_LOW_CREDITS' && statusvalue != 'DRAFTED' && this.object.isFeatured == true && untildate >= sdatet2) {
      //     element = profileres.data.creditConsumptions.find(item => item.creditType === AppSettings.UPGRADED_JOB)
      //     if (profileres.data.creditPoints >= element.points || localStorage.getItem('userType') == 'student' || this.userType == 'JOB_SEEKER') {
      //       this.jobPostForm.patchValue({
      //         "consumptionType": element.creditType,
      //         "createdByUserType": localStorage.getItem('userType'),
      //         "points": element.points,
      //         "status": "ACTIVE"
      //       })
      //     }
      //   }
      // }

      // newly added code -- thiru & monish

      // if (this.object.statusUpdatedOn == undefined || this.object.statusUpdatedOn == null) {

      //   if (this.object.status == 'AWAITING HOST' && statusvalue != 'DRAFTED' &&
      //     this.util.formatDateddd(fdate1) == this.util.formatDateddd(sdatet2) && this.object.isFeatured != true) {
      //     this.jobPostForm.patchValue({
      //       "consumptionType": element.creditType,
      //       "createdByUserType": localStorage.getItem('userType'),
      //       "points": element.points,
      //       "status": "ACTIVE"
      //     })
      //   }
      // } else {

      //   let statusupdateddate = this.util.dateFormatestring(this.object.statusUpdatedOn);


      //   if (this.object.status == 'AWAITING HOST' && statusvalue != 'DRAFTED' &&
      //     this.util.formatDateddd(fdate1) == this.util.formatDateddd(sdatet2)
      //     && this.object.isFeatured != true &&
      //     this.util.formatDateddd(creditserverdate) == this.util.formatDateddd(statusupdateddate)) {
      //     this.jobPostForm.patchValue({
      //       "consumptionType": element.creditType,
      //       "createdByUserType": localStorage.getItem('userType'),
      //       "points": 0,
      //       "status": "ACTIVE"
      //     })
      //   } else if (this.object.status == 'AWAITING HOST' && statusvalue != 'DRAFTED'
      //     && this.util.formatDateddd(fdate1) == this.util.formatDateddd(sdatet2) && this.object.isFeatured != true && creditserverdate > statusupdateddate) {
      //     this.jobPostForm.patchValue({
      //       "consumptionType": element.creditType,
      //       "createdByUserType": localStorage.getItem('userType'),
      //       "points": element.points,
      //       "status": "ACTIVE"
      //     })
      //   } else if (this.object.status == 'AWAITING HOST' && statusvalue != 'DRAFTED'
      //     && this.util.formatDateddd(fdate1) == this.util.formatDateddd(sdatet2) && this.object.isFeatured == true && creditserverdate > statusupdateddate) {
      //     element = profileres.data.creditConsumptions.find(item => item.creditType === AppSettings.UPGRADED_JOB)
      //     this.jobPostForm.patchValue({
      //       "consumptionType": element.creditType,
      //       "createdByUserType": localStorage.getItem('userType'),
      //       "points": element.points,
      //       "status": "ACTIVE"
      //     })
      //   }
      // }



      if (statusvalue != "DRAFTED") {

        //const current = new Date(profileres.data.currentTimeByTimezone);
        // if (current.getHours() >= 15) {
        //   this.draftupdate(statusvalue)

        // } else {
        //   this.savejobafterValdaiton(statusvalue);
        // }
        this.savejobafterValdaiton(statusvalue);
      } else {
        this.draftupdatecancel(statusvalue)

      }
    } else {
      this.submit = false
    }
  }

  async savejobafterValdaiton(statusvalue) {

    // let serverdate, effectiveDate;
    // if (this.serverCurrentDate != undefined) {
    //   serverdate = new Date(this.util.formatDateddd(this.serverCurrentDate));
    //   effectiveDate = new Date(this.util.formatDateddd(this.jobPostForm.value.effectiveDate));
    // } else {
    //   serverdate = new Date();
    // }

    // if (this.jobPostForm.value.effectiveDate == null) {
    //   this.jobPostForm.get("effectiveDate").setValue(serverdate);
    // }
    // if (this.jobPostForm.value.effectiveDate != null && this.jobPostForm.value.effectiveUntil == null) {
    //   this.jobPostForm.get("effectiveUntil").setValue(this.jobPostForm.value.effectiveDate);
    // }

    let updateJobData: any = this.jobPostForm.getRawValue();

    if (this.jobPostForm.value.status != "DRAFTED") {
      updateJobData.status = 'ACTIVE';
      //updateJobData.points = 0;
    }

    // if (this.jobPostForm.value.effectiveFor == "Custom") {
    //   updateJobData.effectiveFor = '0';
    // } else {
    //   updateJobData.effectiveFor = this.jobPostForm.value.effectiveFor;
    // }

    // if (this.userType != 'JOB_SEEKER') {
    //   updateJobData.effectiveDate = this.util.formatDateddd(this.jobPostForm.value.effectiveDate);
    //   updateJobData.effectiveUntil = this.util.formatDateddd(this.jobPostForm.value.effectiveUntil);
    // } else {
    //   updateJobData.effectiveDate = new Date();
    //   updateJobData.effectiveUntil = new Date();
    // }


    const currentStatus: string = updateJobData.status;
    if (this.object.status != 'ACTIVE' && updateJobData.status == 'ACTIVE') {
      // let isJobOrCandidayeExpired: boolean = await this.planService.UPDATE_USERDETAILS("JOB_CANDIDATE_POSTINGS");
      const userData = await this.planService.UPDATE_USERDETAILS("JOB_CANDIDATE_POSTINGS");

      if (userData.isExpired) {
        let availablePoints = null;
        let actualPoints = null;
        let utilizedPoints = null;
        let promotional = null;
        userData.userDetail.userPlanAndBenefits.benefitsUsages.forEach(ele => {
          if (ele.benefitKey == 'JOB_CANDIDATE_POSTINGS') {
            availablePoints = ele.available
            actualPoints = ele.actual
            utilizedPoints = ele.utilized
            promotional = ele.promotional
          }
        })
        this.planService.expiredPopup("JOB_CANDIDATE_POSTINGS", "PAY", null, null, null, availablePoints, actualPoints, utilizedPoints, promotional);
        // this.planService.expiredPopup("JOB_CANDIDATE_POSTINGS");
        return;
      }
    }
    this.util.startLoader()
    this.api.updatePut('jobs/updateJob', updateJobData).subscribe(res => {
      this.jobIdHighLight = this.jobPostForm.value.jobId

      this.util.stopLoader();
      if (res.code == '00000') {
        this.disable_for_draft = false;
        // this.modalRef
        // this.modalRef.hide(1)
        this.modalService.hide(1);
        if (res.data.status == 'ACTIVE') {
          res.data.jobData.status = true
        } else if (res.data.status == 'INACTIVE') {
          res.data.jobData.status = false
        }
        this.pasDatehide = [];
        // this.object = res.data.jobData
        Swal.fire({
          position: "center",
          icon: "success",
          title: super.getTextBasedOnStatus(currentStatus, currentStatus === GigsumoConstants.DRAFTED ? "Draft updated" : "Job updated"),
          showConfirmButton: false,
          timer: 2000,
        })

        // let index = this.passValues.findIndex(items => items.jobId === this.object.jobId);
        // res.data.jobData.user = this.object.user;
        // let element = this.passValues.find(item => item.candidateId === this.object.candidateId)
        // res.data.jobData.user = this.object.user;
        // res.data.jobData.status = this.object.status;
        // res.data.jobData.isLiked = element.isLiked;
        // res.data.jobData.likesCount = element.likesCount;
        // res.data.jobData.viewedByCount = element.viewedByCount;
        // // this.object.photo=  res.data.jobData.photo;
        // this.passValues[index] = res.data.jobData;
        this.jobReload.emit(statusvalue === 'ACTIVE' ? 'updateReload' : 'reload');

        setTimeout(() => {
          this.submit = false
        }, 4000);
      }
    }, err => {
      this.util.stopLoader();
    });
  }



  draftupdate(statusvalue) {
    this.jobPostForm.get("status").setValue(this.object.status);
    if (this.object.status == 'DRAFTED') {
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: { confirmButton: 'btn btn-success', cancelButton: 'btn btn-danger' },
        buttonsStyling: false
      })


      swalWithBootstrapButtons.fire({
        title: 'Credit Consumption Alert',
        text: "Credits for this job will be consumed at 12 AM. Would you like to save it as a draft now and create the job, the next day?",
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        allowOutsideClick: false,
        allowEscapeKey: false,
        cancelButtonText: 'No',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          this.object.status;
          this.jobPostForm.get('status').patchValue('DRAFTED');
          // this.jobPostForm.patchValue({
          //   'consumptionType': null,
          //   'points': 0,
          // })
          this.savejobafterValdaiton(statusvalue);

        } else {
          this.jobPostForm.get('status').patchValue('ACTIVE');


          if (statusvalue != 'DRAFTED') {
            this.savejobafterValdaiton(statusvalue);
          } else {
            this.commonVariables.jobPostingFlag = false
            this.searchData.setCommonVariables(this.commonVariables)
            this.modalService.hide(1)
            this.jobPostForm.reset()
            this.primarySkillsSelected = [];
            this.secondarySkillsSelected = [];


          }

        }

      });
    } else {
      this.savejobafterValdaiton(statusvalue);
    }

  }

  draftupdatecancel(statusvalue) {

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: { confirmButton: 'btn btn-success', cancelButton: 'btn btn-danger' },
      buttonsStyling: false
    })


    swalWithBootstrapButtons.fire({
      title: 'Save as Draft',
      text: "Would you like to save it as a draft? You can edit this later and save. If No is selected,all the changes will be lost.",
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      allowOutsideClick: false,
      allowEscapeKey: false,
      cancelButtonText: 'No',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.object.status;
        this.jobPostForm.get('status').patchValue('DRAFTED');
        // this.jobPostForm.patchValue({
        //   'consumptionType': null,
        //   'points': 0,
        // })
        this.savejobafterValdaiton(statusvalue);

      } else {
        this.jobPostForm.get('status').patchValue('ACTIVE');


        if (statusvalue != 'DRAFTED') {
          this.savejobafterValdaiton(statusvalue);
        } else {
          this.commonVariables.jobPostingFlag = false
          this.searchData.setCommonVariables(this.commonVariables)
          this.modalService.hide(1)
          this.jobPostForm.reset()
          this.primarySkillsSelected = [];
          this.secondarySkillsSelected = [];


        }

      }

    });

  }
  otherSelectedStates: any = []

  cancelJob() {
    this.submit = false;
    this.jobPostForm.get("status").setValue(this.object.status);
    if (this.object.status == 'DRAFTED') {
      if (this.jobPostForm.getRawValue().clientName != null && this.jobPostForm.value.jobTitle != null) {
        this.jobPostForm.get('status').patchValue('DRAFTED');
        this.draftupdatecancel('DRAFTED');
      } else {
        this.commonVariables.jobPostingFlag = false
        this.searchData.setCommonVariables(this.commonVariables)
        this.modalService.hide(1)
        this.jobPostForm.reset()
        this.primarySkillsSelected = [];
        this.secondarySkillsSelected = [];
        this.otherSelectedStates = []
      }
    } else {
      this.activejobcancel();
    }
  }
  activejobcancel() {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: { confirmButton: 'btn btn-success', cancelButton: 'btn btn-danger' },
      buttonsStyling: false
    })


    swalWithBootstrapButtons.fire({
      title: 'Cancel Editing?',
      text: "You might lose the changes you made recently if you do so. You want to continue?",
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      allowOutsideClick: false,
      allowEscapeKey: false,
      cancelButtonText: 'No',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.commonVariables.jobPostingFlag = false
        this.searchData.setCommonVariables(this.commonVariables)
        this.modalService.hide(1)
        this.jobPostForm.reset()
        this.primarySkillsSelected = [];
        this.secondarySkillsSelected = [];

      }
    });
  }

  validateLast(year) {
    // var toYear = this.jobPostForm.value.experienceTo
    var fromYear = this.jobPostForm.value.experienceFrom
    if (fromYear != null) {
      if (fromYear > year) {
        return true
      } else {
        return false
      }
    }
  }

  zipCodeValidaiton(x: number): boolean {
    if (String(x).length > 10) {
      return false;
    }
    return true;
  }

  onPaste1(event: ClipboardEvent) {
    let clipboardData = event.clipboardData;
    let pastedText = clipboardData.getData('text');
    if (pastedText != null) {
      this.util.startLoader();
      this.api.query("care/organizations?organizationName=" + pastedText)
        .pipe(debounceTime(2000))
        .subscribe((res) => {
          this.util.stopLoader();
          if (res) {
            this.util.stopLoader();
            const orgList1: Array<Partial<HealthCareOrganization>> = [];
            // this.orgList1 = [];
            res.forEach(ele => {
              var obj: any = {}
              obj.organizationId = ele.organizationId;
              obj.organizationName = ele.organizationName;
              obj.city = ele.city;
              obj.address1 = ele.address1;
              obj.zipCode = ele.zipCode;
              obj.address2 = ele.address2;
              obj.state = ele.state;
              obj.country = ele.country;
              obj.countryName = ele.countryName;
              obj.street = ele.street && ele.street !== null ? ele.street : null;
              orgList1.push(obj);
            });
            const uniqueList = new Set(orgList1);
            this.uniqueOrgList1 = Array.from(uniqueList);
          }
        }, err => {
        });
      this.searchBarShow1 = true;
    } else {
      this.searchBarShow1 = false
    }
  }


  autoComplete1: MatAutocompleteTrigger;
  searchBarShow1: boolean = false
  uniqueOrgList1: Array<Partial<HealthCareOrganization>> = [];

  getOrganization1(value) {
    if (value != null) {
      this.api.query("care/organizations?organizationName=" + this.jobPostForm.getRawValue().clientName)
        .pipe(debounceTime(500))
        .subscribe((res) => {
          if (res) {
            const orgList1: Array<Partial<HealthCareOrganization>> = [];
            // this.orgList1 = [];
            res.forEach(ele => {
              var obj: any = {}
              obj.organizationId = ele.organizationId;
              obj.organizationName = ele.organizationName;
              obj.city = ele.city;
              obj.address1 = ele.address1;
              obj.address2 = ele.address2;
              obj.zipCode = ele.zipCode;
              obj.state = ele.state;
              obj.country = ele.country;
              obj.zipCode = ele.zipCode;
              obj.businessId = ele.businessId
              obj.countryName = ele.countryName;
              obj.street = ele.street && ele.street !== null ? ele.street : null;
              orgList1.push(obj);
            })
            const uniqueList = new Set(orgList1);
            this.uniqueOrgList1 = Array.from(uniqueList);
          }
        }, err => {
        });
      this.searchBarShow1 = true;
    } else {
      this.searchBarShow1 = false
    }
  }


  organizationList: any = []
  primarySkillsList: any = []
  secondarySkillsList: any = []
  skillsList: any = []
  payTypeList: any = []
  clientTypeList: any = []
  clientNameList: any = []
  clientNameList1: any = []
  durationTypeList: any = []
  usStatesList = []
  jobClassificationList: any = []
  totalExperienceList = []
  periodList = []

  FormData: any;
  uploadFiles: Array<any> = [];
  recruiterTitleList: any = []
  engagementTypeList = []
  // effectiveforList = []
  workAuthorizationList: any = []
  jobPostForm: UntypedFormGroup;
  freelancerInternalHireFlag: boolean = false
  onClientTypeChange(value) {
    // this.util.startLoader()
    // this.jobPostForm.patchValue({
    //   // clientName: null,
    //   // organisationId: null
    // })
    // this.clientNameList = []
    // this.clientNameList1.forEach(ele => {
    //   if (ele.clientType == value) {
    //     this.clientNameList.push(ele)
    //   }
    // })
    // this.util.stopLoader()
    if (this.userType != 'FREELANCE_RECRUITER') {
      this.freelancerInternalHireFlag = false
      if (value == GigsumoConstants.DIRECT_HIRE) {
        this.jobPostForm.patchValue({ clientName: this.jobPostedBehalfOflist[0] })
        this.jobPostForm.get('clientName').disable()
      } else {
        this.jobPostForm.get('clientName').enable()
        this.jobPostForm.get('clientName').patchValue(null)
      }
    } else if (this.userType == 'FREELANCE_RECRUITER') {
      if (value == GigsumoConstants.DIRECT_HIRE) {
        if (this.jobPostForm.get('jobPostedBehalfOf').value != null) {
          this.jobPostForm.patchValue({ clientName: this.jobPostForm.get('jobPostedBehalfOf').value })
          this.jobPostForm.get('clientName').disable()
        } else {
          this.jobPostForm.get('clientName').patchValue(null)
          this.jobPostForm.get('clientName').enable()
        }
      } else {
        this.jobPostForm.get('clientName').patchValue(null)
        this.jobPostForm.get('clientName').enable()
      }
    }
  }

  years: any = []
  Toyears: any = []
  generateYears() {
    this.years = []
    this.Toyears = []
    // var max = new Date().getFullYear();
    // var min = max - 80;
    for (var i = 0; i <= 20; i++) {
      this.years.push(i);
    }
    for (var i = 1; i <= 20; i++) {
      this.Toyears.push(i);
    }
  }

  years2: any = []
  generateYears2() {
    this.years2 = []
    // var max = new Date().getFullYear();
    // var min = max - 80;
    for (var i = 1; i <= 20; i++) {
      this.years2.push(i);
    }
  }

  years1: any = []
  generateYears1() {
    this.years1 = []
    var max = new Date().getFullYear();
    var min = max - 80;
    for (var i = min; i <= max; i++) {
      this.years1.push(i);
    }
  }

  primarySkillsSelected = [];
  secondarySkillsSelected = [];
  stateListCA: any = []
  stateListIN: any = []
  stateListAU: any = []
  countryList: any = [];
  submit: boolean = false;
  currentTime: any;
  maxDate: any
  getListValues(param) {
    this.clientTypeList = []
    this.payTypeList = []
    this.secondarySkillsList = []
    this.primarySkillsList = []
    this.skillsList = []
    this.periodList = []
    this.recruiterTitleList = []
    this.totalExperienceList = []
    this.workAuthorizationList = []
    this.durationTypeList = []
    this.engagementTypeList = []
    // this.effectiveforList = []
    if (this.jobClassificationList.length == 0) {
      this.util.startLoader()
      var data: any = { "domain": "ENGAGEMENT_TYPE,CLIENT_TYPE,PAY_TYPE,DURATION,PRIMARY_SKILLS,WORK_AUTHORIZATION,CANDIDATE_AVAILABLITY,TOTAL_EXPERIENCE,SECONDARY_SKILLS,GIGSUMO_SKILLS_LIST,GIGSUMO_JOB_TITLE,GIGSUMO_RECRUITERS_TITLE_LIST,EFFECTIVE_FOR" }
      data.userId = localStorage.getItem("userId");
      this.api.create('listvalue/findbyList', data).subscribe(res => {
        if (res.code == '00000') {
          this.currentTime = new Date(res.data.currentTime);
          //this.maxDate = new Date(this.currentTime);
          if (param == 'CANDIDATE') {
            this.usStatesList = []
            this.api
              .query("country/getAllStates?countryCode=US")
              .subscribe((res) => {
                if (res) {
                  res.forEach(ele => {
                    this.usStatesList.push(ele.stateName)
                    this.otherStatesList.push(ele.stateName)
                  })
                }
              }, err => {
                this.util.stopLoader();
              })
          }
          // res.data.CLIENT_TYPE.listItems.forEach(ele => {
          //   this.clientTypeList.push(ele.item)
          // })

          res.data.CLIENT_TYPE.listItems.forEach(ele => {
            // if (ele.item == "Direct Client") {
            //   ele.item = "Client";
            // }
            this.clientTypeList.push(ele.item);
          })
          res.data.PAY_TYPE.listItems.forEach(ele => {
            this.payTypeList.push(ele.item)
          })
          res.data.GIGSUMO_SKILLS_LIST.listItems.forEach(ele => {
            this.skillsList.push(ele.item)
          })
          res.data.PRIMARY_SKILLS.listItems.forEach(ele => {
            if (ele.item) {
              this.primarySkillsList.push(ele.item)
              var mySet = new Set(this.primarySkillsList);
              this.primarySkillsList = [...mySet]
            }
          })
          res.data.SECONDARY_SKILLS.listItems.forEach(ele => {
            if (ele.item) {
              this.secondarySkillsList.push(ele.item)
              var mySet = new Set(this.secondarySkillsList);
              this.secondarySkillsList = [...mySet]
            }
          })
          res.data.CANDIDATE_AVAILABLITY.listItems.forEach(ele => {
            this.periodList.push(ele.item)
          })
          // res.data.EFFECTIVE_FOR.listItems.forEach(ele => {
          //   this.effectiveforList.push(ele.item)
          //   var mySet = new Set(this.effectiveforList);
          //   this.effectiveforList = [...mySet]
          // })
          res.data.TOTAL_EXPERIENCE.listItems.forEach(ele => {
            this.totalExperienceList.push(ele.item)
          })
          res.data.ENGAGEMENT_TYPE.listItems.forEach(ele => {
            this.engagementTypeList.push(ele.item)
          })
          res.data.WORK_AUTHORIZATION.listItems.forEach(ele => {
            this.workAuthorizationList.push(ele.item)
          })
          res.data.DURATION.listItems.forEach(ele => {
            this.durationTypeList.push(ele.item)
          })
          res.data.GIGSUMO_JOB_TITLE.listItems.forEach(ele => {
            this.candidateJobTitleList.push(ele.item)
            var mySet = new Set(this.candidateJobTitleList);
            this.candidateJobTitleList = [...mySet]
          })
          res.data.GIGSUMO_RECRUITERS_TITLE_LIST.listItems.forEach(ele => {
            this.recruiterTitleList.push(ele.item)
          })
          if (param == 'CANDIDATE') {
            // this.util.stopLoader()
            this.commonVariables.jobPostingFlag = false
            this.commonVariables.candidatePostingFlag = true
            this.commonVariables.postPrivacyFlag = false
            this.searchData.setCommonVariables(this.commonVariables)
          } else if (param == 'JOBS') {
            // this.util.stopLoader()
            this.commonVariables.jobPostingFlag = true
            this.commonVariables.postPrivacyFlag = false
            this.searchData.setCommonVariables(this.commonVariables)
          }
        }
      })
    } else {
      if (param == 'CANDIDATE') {
        this.util.stopLoader()
        this.commonVariables.jobPostingFlag = false
        this.commonVariables.candidatePostingFlag = true
        this.commonVariables.postPrivacyFlag = false
        this.searchData.setCommonVariables(this.commonVariables)
      } else if (param == 'JOBS') {
        this.util.stopLoader()
        this.commonVariables.jobPostingFlag = true
        this.commonVariables.postPrivacyFlag = false
        this.searchData.setCommonVariables(this.commonVariables)
      }
    }
  }

  onChangePeriod(value) {

  }


  payType: null;
  targetRate: null;
  figureLength: number = 0;
  selectedCountries: boolean = false
  typeTargetValue: null;
  countryChosen: null;
  onChangeCountry(event) {
    this.countryChosen = event;
    if (this.countryChosen != undefined && this.jobPostForm != undefined) {
      if (this.countryChosen != 'US' || this.countryChosen != 'AU' || this.countryChosen != 'IN' || this.countryChosen != 'CA') {
        this.jobPostForm.get('city').patchValue(null)
        this.jobPostForm.get('state').patchValue(null)
        this.jobPostForm.get('zipCode').patchValue(null)
      }
    }


    if ((this.countryChosen == 'US' || this.countryChosen == 'AU' || this.countryChosen == 'CA') && this.payType == 'Hourly') {
      this.figureLength = 2
    } else if ((this.countryChosen == 'US' || this.countryChosen == 'AU' || this.countryChosen == 'CA') && this.payType == 'Daily') {
      this.figureLength = 3
    } else if ((this.countryChosen == 'US' || this.countryChosen == 'AU' || this.countryChosen == 'CA') && this.payType == 'Monthly') {
      this.figureLength = 6
    } else if ((this.countryChosen == 'US' || this.countryChosen == 'AU' || this.countryChosen == 'CA') && this.payType == 'Weekly') {
      this.figureLength = 5
    } else if ((this.countryChosen == 'US' || this.countryChosen == 'AU' || this.countryChosen == 'CA') && this.payType == 'Yearly') {
      this.figureLength = 8
    } else if (this.countryChosen == 'IN' && this.payType == 'Hourly') {
      this.figureLength = 4
    } else if (this.countryChosen == 'IN' && this.payType == 'Daily') {
      this.figureLength = 5
    } else if (this.countryChosen == 'IN' && this.payType == 'Monthly') {
      this.figureLength = 7
    } else if (this.countryChosen == 'IN' && this.payType == 'Weekly') {
      this.figureLength = 6
    } else if (this.countryChosen == 'IN' && this.payType == 'Yearly') {
      this.figureLength = 8
    }


    if (event == "US") {
      this.selectedCountries = true
      const countryCode = event;
      this.util.startLoader()
      this.workAuthorizationList = []
      this.api.query('listvalue/find?domain=WORK_AUTHORIZATION_US').subscribe(res => {
        if (res.code == '00000') {
          this.util.stopLoader()
          res.data.listValues[0].listItems.forEach(ele => {
            this.workAuthorizationList.push(ele.item)
          });
          this.usStatesList = [];
          if (this.usStatesList.length == 0) {
            this.api
              .query("country/getAllStates?countryCode=" + countryCode)
              .subscribe((res) => {
                res.forEach(ele => {
                  if (res && res.length > 0) {
                    this.jobPostForm.get('state').clearValidators();
                    this.jobPostForm.get('state').updateValueAndValidity();
                  }
                  this.usStatesList.push(ele.stateName)
                })
              }, err => {
                this.util.stopLoader();
              });
            // }
          }
        }
      })

    } else if (event == "AU") {
      this.workAuthorizationList = []
      this.util.startLoader()
      this.api.query('listvalue/find?domain=WORK_AUTHORIZATION_AU').subscribe(res => {
        if (res.code == '00000') {
          this.util.stopLoader()
          res.data.listValues[0].listItems.forEach(ele => {
            this.workAuthorizationList.push(ele.item)
          })

          this.selectedCountries = true
          const countryCode = event;
          if (this.stateListAU.length == 0) {
            this.stateListAU = [];

            // if (this.stateListAU.length == 0) {
            this.api
              .query("country/getAllStates?countryCode=" + countryCode)
              .subscribe((res) => {
                if (res && res.length > 0) {
                  this.jobPostForm.get('state').clearValidators();
                  this.jobPostForm.get('state').updateValueAndValidity();
                }
                this.stateListAU = res;
              }, err => {
                this.util.stopLoader();
              });
          }
        }
      })

      // }
    } else if (event == "IN") {
      this.workAuthorizationList = []
      this.util.startLoader()
      this.api.query('listvalue/find?domain=WORK_AUTHORIZATION_IN').subscribe(res => {
        if (res.code == '00000') {
          this.util.stopLoader()
          res.data.listValues[0].listItems.forEach(ele => {
            this.workAuthorizationList.push(ele.item)
          })


          this.selectedCountries = true
          const countryCode = event;
          if (this.stateListIN.length == 0) {
            this.stateListIN = [];
            // if (this.stateListIN.length == 0) {
            this.api
              .query("country/getAllStates?countryCode=" + countryCode)
              .subscribe((res) => {
                if (res && res.length > 0) {
                  this.jobPostForm.get('state').clearValidators();
                  this.jobPostForm.get('state').updateValueAndValidity();
                }
                this.stateListIN = res;
              }, err => {
                this.util.stopLoader();
              });
          }
        }
      })

      // }
    } else if (event == "CA") {
      this.workAuthorizationList = []
      this.util.startLoader()
      this.api.query('listvalue/find?domain=WORK_AUTHORIZATION_CA').subscribe(res => {
        if (res.code == '00000') {
          this.util.stopLoader()
          res.data.listValues[0].listItems.forEach(ele => {
            this.workAuthorizationList.push(ele.item)
          })

          this.selectedCountries = true
          const countryCode = event;
          // this.stateListCA = [];

          if (this.stateListCA.length == 0) {
            this.api
              .query("country/getAllStates?countryCode=" + countryCode)
              .subscribe((res) => {
                if (res && res.length > 0) {
                  this.jobPostForm.get('state').clearValidators();
                  this.jobPostForm.get('state').updateValueAndValidity();
                }
                this.stateListCA = res;
              }, err => {
                this.util.stopLoader();
              });
          }
        }
      })

    } else {
      this.selectedCountries = false

    }
    if (this.typeTargetValue != null) {
      this.onTargetRateTyped(this.typeTargetValue)
    }

  }





  commonVariables: any = {};

  digitKeyOnly(e) {
    var keyCode = e.keyCode == 0 ? e.charCode : e.keyCode;
    if ((keyCode >= 37 && keyCode <= 40) || (keyCode == 8 || keyCode == 9 || keyCode == 13) || (keyCode >= 48 && keyCode <= 57)) {
      return true;
    }
    return false;
  }

  get jobControls() {
    return this.jobPostForm.controls
  }


  noResult: boolean = false
  typeaheadNoResults(event: boolean): void {
    this.noResult = event;
    this.jobPostForm.patchValue({
      organisationId: null
    })
  }
  onengagementTypeChange(value: string) {
    if (value.includes('W2 - Full Time')) {
      this.jobPostForm.get('duration').disable();
      this.jobPostForm.get('durationType').disable();
      this.jobPostForm.get('duration').reset();
      this.jobPostForm.get('durationType').reset();
    } else {
      this.jobPostForm.get('duration').enable();
      this.jobPostForm.get('durationType').enable();
      this.jobPostForm.get('durationType').patchValue('Months');
    }
  }

  onChngOrg(event) {

    this.jobPostForm.patchValue({
      organisationId: event.organizationId
    })
    /**selecting curr org will automatically patch the location and client Type - but this functnality is now removed so cmded*/


    // if (event.businessId && event.businessId != null) {
    //   this.jobPostForm.get('country').disable()
    //   this.jobPostForm.get('city').disable()
    //   this.jobPostForm.get('state').disable()
    //   this.jobPostForm.get('zipCode').disable()
    //   this.util.startLoader();
    //   this.api.query("business/details/" + event.businessId).subscribe((res) => {
    //     if (res.code == '00000') {

    //       this.util.stopLoader();
    //       if (res.data.businessModelList[0].organizationType && res.data.businessModelList[0].organizationType != null) {
    //         this.jobPostForm.get('clientType').disable()
    //         this.jobPostForm.patchValue({
    //           clientType: res.data.businessModelList[0].organizationType
    //         })
    //       } else {
    //         this.jobPostForm.get('clientType').enable()
    //       }
    //       this.onChangeCountry(res.data.businessModelList[0].companyLocationDetails[0].country)
    //       setTimeout(() => {
    //         this.jobPostForm.patchValue({
    //           // clientType: res.data.businessModelList[0].organizationType,
    //           country: res.data.businessModelList[0].companyLocationDetails[0].country,
    //           city: res.data.businessModelList[0].companyLocationDetails[0].city,
    //           state: res.data.businessModelList[0].companyLocationDetails[0].state,
    //           zipCode: res.data.businessModelList[0].companyLocationDetails[0].zipCode || event.zipCode

    //         })
    //       }, 1000);
    //     } else {
    //       this.util.stopLoader();
    //       this.jobPostForm.get('clientType').enable()
    //       this.jobPostForm.get('country').enable()
    //       this.jobPostForm.get('city').enable()
    //       this.jobPostForm.get('state').enable()
    //       this.jobPostForm.get('zipCode').enable()
    //       this.jobPostForm.patchValue({
    //         // clientType: null,
    //         country: null,
    //         city: null,
    //         state: null,
    //         zipCode: null
    //       })
    //     }
    //   }, err => {
    //     this.util.stopLoader();
    //     this.jobPostForm.get('clientType').enable()
    //     this.jobPostForm.get('country').enable()
    //     this.jobPostForm.get('city').enable()
    //     this.jobPostForm.get('state').enable()
    //     this.jobPostForm.get('zipCode').enable()
    //     this.jobPostForm.patchValue({
    //       // clientType: null,
    //       country: null,
    //       city: null,
    //       state: null,
    //       zipCode: null
    //     })
    //   })
    // } else {
    //   this.jobPostForm.get('clientType').enable()
    //   this.jobPostForm.get('country').enable()
    //   this.jobPostForm.get('city').enable()
    //   this.jobPostForm.get('state').enable()
    //   this.jobPostForm.get('zipCode').enable()
    //   this.onChangeCountry(event.country)
    //   this.jobPostForm.patchValue({
    //     // clientType: null,
    //     country: event.country,
    //     city: event.city,
    //     state: event.state,
    //     zipCode: event.zipCode
    //   })
    // }
  }


  sortConfigWork: TypeaheadOrder = {
    direction: "desc",
    field: "organisationName",
  };

  validateBeginning(year) {
    // var fromYear = this.jobPostForm.value.experienceFrom
    var toYear = this.jobPostForm.value.experienceTo
    if (toYear != null) {
      if (year > toYear) {
        return true
      } else {
        return false
      }
    }
  }

  config2 = {
    focus: false,
    height: 150,
    placeholder: "",
    link: [["link", ["linkDialogShow", "unlink"]]],
    insert: ["link", "picture", "video"],
    view: ["fullscreen", "codeview", "help"],
    style:
      "outline: none !important;background-color: rgb(241 243 246) !important;cursor: pointer !important;",
    disableDragAndDrop: true,
    blockquoteBreakingLevel: 1,
    callbacks: {
      onFocus: function (contents) {
        if ($(this).summernote("isEmpty")) {
          $("#summessage").html(""); //either the class (.) or id (#) of your textarea or summernote element
        }
      },
    },
    toolbar: [
      ["misc", ["codeview", "undo", "redo"]],
      // ['style', ['bold', 'italic', 'underline', 'clear']],
      [
        "font",
        [
          "bold",
          "italic",
          "underline",
          "strikethrough",
          "superscript",
          "subscript",
          "clear",
        ],
      ],
      ["fontsize", ["fontname", "fontsize", "color"]],
      ["para", ["style", "ul", "ol", "paragraph", "height"]],
    ],
    fontNames: [
      "Helvetica",
      "Arial",
      "Arial Black",
      "Comic Sans MS",
      "Courier New",
      "Roboto",
      "Times",
    ]
  };

  onChangePayType(value, param) {
    this.payType = value
    // if (this.countryChosen != null) {
    if ((this.countryChosen == 'US' || this.countryChosen == 'AU' || this.countryChosen == 'CA') && this.payType == 'Hourly') {
      this.figureLength = 2
    } else if ((this.countryChosen == 'US' || this.countryChosen == 'AU' || this.countryChosen == 'CA') && this.payType == 'Daily') {
      this.figureLength = 2
    } else if ((this.countryChosen == 'US' || this.countryChosen == 'AU' || this.countryChosen == 'CA') && this.payType == 'Monthly') {
      this.figureLength = 6
    } else if ((this.countryChosen == 'US' || this.countryChosen == 'AU' || this.countryChosen == 'CA') && this.payType == 'Weekly') {
      this.figureLength = 5
    } else if ((this.countryChosen == 'US' || this.countryChosen == 'AU' || this.countryChosen == 'CA') && this.payType == 'Yearly') {
      this.figureLength = 8
    } else if (this.countryChosen == 'IN' && this.payType == 'Hourly') {
      this.figureLength = 4
    } else if (this.countryChosen == 'IN' && this.payType == 'Daily') {
      this.figureLength = 5
    } else if (this.countryChosen == 'IN' && this.payType == 'Monthly') {
      this.figureLength = 7
    } else if (this.countryChosen == 'IN' && this.payType == 'Weekly') {
      this.figureLength = 6
    } else if (this.countryChosen == 'IN' && this.payType == 'Yearly') {
      this.figureLength = 8
    }
    // }
    if (this.typeTargetValue != null) {
      this.onTargetRateTyped(this.typeTargetValue)
    }

  }

  onTargetRateTyped(value) {
    this.typeTargetValue = value

  }

  candidateJobTitleList: any = []
  jobPostedBehalfOflist: any = []
  modalRef: BsModalRef;
  otherStatesList: any = [];
  editedJob: Partial<JobModel>
  async editJob(item, postTemplate: TemplateRef<any>) {
    try {
      this.disable_for_draft = false;
      this.editedJob = item;
      this.submit = false;
      this.pasDatehide = [];
      this.util.startLoader();

      const orgCheckResponse = await this.api.query('business/check/orgname/' + this.userId).toPromise();

      this.util.stopLoader();

      if (orgCheckResponse.code === '00000' || orgCheckResponse.code === '10008') {
        if (orgCheckResponse.data != null && orgCheckResponse.data.organisation != undefined && orgCheckResponse.data.organisation.length != 0) {
          orgCheckResponse.data.organisation.forEach(ele => {
            this.jobPostedBehalfOflist.push(ele.organizationName);
          });
        }
      }

      this.object = item;
      this.onChangeCountry(item.country);
      await this.initiateJobForm();
      this.currentTimeDate = new Date(this.currentTime);

      // Show modal without delay
      this.modalRef = this.modalService.show(postTemplate, this.backdropConfig);

      this.object.primarySkills.forEach(ele => {
        this.primarySkillsSelected.push(ele);
      });

      this.object.secondarySkills.forEach(ele => {
        this.secondarySkillsSelected.push(ele);
      });

      if (this.object.otherPreferedStates != null && this.object.otherSelectedStates.length > 0) {
        this.object.secondarySkills.forEach(ele => {
          this.secondarySkillsSelected.push(ele);
        });
      }

      if (item.targetRate == 0) {
        item.targetRate = '';
      }

      // Apply patch value without delay
      this.object.duration = this.object.duration === 0 ? null : this.object.duration;
      this.object.experienceFrom = this.object.experienceFrom === 0 ? null : this.object.experienceFrom;
      this.object.experienceTo = this.object.experienceTo === 0 ? null : this.object.experienceTo;
      setTimeout(() => {
        this.jobPostForm.patchValue(this.object);
      }, 1000);

      if (this.object.clientType == GigsumoConstants.DIRECT_HIRE && this.object.clientName != null) {
        this.jobPostForm.get('clientName').disable();
      }

      if (this.object.jobClassification == 'W2 - Full Time') {
        this.jobPostForm.get('duration').disable();
        this.jobPostForm.get('durationType').disable();
      }
    } catch (error) {

    } finally {
      this.util.stopLoader();
    }
  }




  getCountries() {
    this.countryList = [];
    this.util.startLoader();
    this.api.query("country/getAllCountries").subscribe((res) => {
      // this.util.stopLoader();
      res.forEach((ele) => {
        this.countryList.push(ele);
      });
    }, err => {
      this.util.stopLoader();
    });
  }
  formatDates(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2) {
      day = '0' + day;

    }

    return [year, month, day].join('/');
  }
  efftiveselecteddate: any;

  // onDateChange_from(selecteddate: any) {

  //   let date1: any = new Date(selecteddate);
  //   let date2: any = new Date(selecteddate);

  //   var temp = this.formatDates(date1);
  //   date1 = new Date(temp);
  //   this.efftiveselecteddate = selecteddate;
  //   var temp2 = this.formatDates(date2);
  //   date2 = new Date(temp2);

  //   if (this.jobPostForm.value.effectiveFor == "7") {
  //     date2.setDate(date2.getDate() + 6);
  //     this.unit.duration = '7';
  //     var time_difference = date2.getTime() - date1.getTime();
  //     let days_difference: any = time_difference / (1000 * 3600 * 24);
  //     let stringconvert = days_difference.toString();
  //     this.jobPostForm.get('effectiveUntil').patchValue(date2);
  //     this.jobPostForm.get('effectiveFor').patchValue(stringconvert);
  //     this.onDateChange_end(date2);

  //   } else if (this.jobPostForm.value.effectiveFor == "15") {
  //     date2.setDate(date2.getDate() + 14);
  //     this.unit.duration = '15';
  //     var time_difference = date2.getTime() - date1.getTime();
  //     let days_difference: any = time_difference / (1000 * 3600 * 24);
  //     let stringconvert = days_difference.toString();

  //     this.jobPostForm.get('effectiveUntil').patchValue(date2);
  //     this.jobPostForm.get('effectiveFor').patchValue(stringconvert);
  //     this.onDateChange_end(date2);

  //   } else if (this.jobPostForm.value.effectiveFor == "30") {
  //     date2.setDate(date2.getDate() + 29);
  //     this.unit.duration = '30';
  //     var time_difference = date2.getTime() - date1.getTime();
  //     let days_difference: any = time_difference / (1000 * 3600 * 24);

  //     let stringconvert = days_difference.toString();
  //     this.jobPostForm.get('effectiveUntil').patchValue(date2);
  //     this.jobPostForm.get('effectiveFor').patchValue(stringconvert);
  //     this.onDateChange_end(date2)

  //   } else {

  //     this.unit = { duration: 'Custom' };
  //     var time_difference = date2.getTime() - date1.getTime();
  //     let days_difference: any = time_difference / (1000 * 3600 * 24);
  //     date2.setDate(date2.getDate() + (days_difference));
  //     let stringconvert = days_difference.toString();

  //     if (stringconvert == "0") {
  //       stringconvert = "Custom";
  //     }

  //     this.maxDate = new Date(selecteddate);
  //     // this.jobPostForm.get('effectiveUntil').patchValue(date2);
  //     this.jobPostForm.get('effectiveUntil').reset();
  //     this.jobPostForm.get('effectiveUntil').setValidators([Validators.required])
  //     this.jobPostForm.get('effectiveUntil').updateValueAndValidity();

  //     this.jobPostForm.get('effectiveFor').patchValue(stringconvert);
  //     this.onDateChange_end(date2)
  //   }





  // }

  // onDateChange_end(selecteddate: any) {
  //   setTimeout(() => {
  //     var date1: any;

  //     if (this.efftiveselecteddate == null) {
  //       date1 = new Date(this.jobPostForm.value.effectiveDate);
  //     } else {
  //       date1 = new Date(this.efftiveselecteddate);

  //     }
  //     var date2: any = new Date(selecteddate);

  //     var date_f = this.formatDates(date1);
  //     var date_2f = this.formatDates(date2);

  //     date1 = new Date(date_f);
  //     date2 = new Date(date_2f);

  //     var time_difference = date2.getTime() - date1.getTime();
  //     let days_difference: any = time_difference / (1000 * 3600 * 24);
  //     this.unit = { duration: '30' };
  //     let inputnumer: any;
  //     if (days_difference == 6) {
  //       this.unit.duration = "7"
  //       let stringconvert = days_difference.toString();
  //       this.jobPostForm.get('effectiveFor').patchValue('7');
  //     }
  //     else if (days_difference == 14) {
  //       this.unit.duration = "15"
  //       let stringconvert = days_difference.toString();
  //       this.jobPostForm.get('effectiveFor').patchValue('15');
  //     }
  //     else if (days_difference == 29) {
  //       this.unit.duration = "30"
  //       let stringconvert = days_difference.toString();
  //       this.jobPostForm.get('effectiveFor').patchValue('30');
  //     }
  //     else {

  //       this.unit = { duration: 'Custom' };
  //       this.jobPostForm.get('effectiveFor').patchValue('Custom');

  //     }

  //   }, 2000);

  // }


  // onDateChange_end_radio(selecteddate: any) {


  //   let date1: Date | string;
  //   let date2: Date | string;
  //   if (this.jobPostForm.value.effectiveDate != null) {
  //     date1 = new Date(this.jobPostForm.value.effectiveDate);
  //     date2 = new Date(this.jobPostForm.value.effectiveDate);
  //   } else {
  //     date1 = new Date(this.currentTimeDate);
  //     date2 = new Date(this.currentTimeDate);
  //     this.jobPostForm.get('effectiveDate').patchValue(new Date(this.currentTimeDate));
  //   }
  //   if (selecteddate == "7") {
  //     date2.setDate(date2.getDate() + 7);
  //   } else if (selecteddate == "15") {
  //     date2.setDate(date2.getDate() + 15);
  //   } else if (selecteddate == "30") {
  //     date2.setDate(date2.getDate() + 30);
  //   }
  //   var date_f = this.formatDates(date1);
  //   var date_2f = this.formatDates(date2);

  //   date1 = new Date(date_f);
  //   date2 = new Date(date_2f);

  //   var time_difference = date2.getTime() - date1.getTime();
  //   let days_difference: any = time_difference / (1000 * 3600 * 24);
  //   let jobunitdate = new Date(this.jobPostForm.value.effectiveDate);
  //   this.unit = { duration: '30' };
  //   let inputnumer: any;
  //   if (selecteddate == 7) {
  //     this.unit.duration = "7"
  //     jobunitdate.setDate(jobunitdate.getDate() + 6);
  //     this.jobPostForm.get('effectiveUntil').patchValue(jobunitdate);
  //     this.onDateChange_end(jobunitdate)
  //   }
  //   else if (selecteddate == 15) {
  //     this.unit.duration = "15"
  //     jobunitdate.setDate(jobunitdate.getDate() + 14);
  //     this.jobPostForm.get('effectiveUntil').patchValue(jobunitdate);
  //     this.onDateChange_end(jobunitdate)
  //   }
  //   else if (selecteddate == 30) {
  //     this.unit.duration = "30"
  //     jobunitdate.setDate(jobunitdate.getDate() + 29);
  //     this.jobPostForm.get('effectiveUntil').patchValue(jobunitdate);
  //     this.onDateChange_end(jobunitdate)
  //   }
  //   else {
  //     this.unit.duration = "Custom"
  //     jobunitdate.setDate(jobunitdate.getDate() + (days_difference));
  //     this.jobPostForm.get('effectiveUntil').patchValue(jobunitdate);
  //     this.onDateChange_end(jobunitdate)
  //   }


  // }


  async initiateJobForm() {
    try {
      this.util.startLoader();
      await Promise.all([
        this.getCountries(),
        this.getListValues('JOBS'),
        this.generateYears(),
        this.generateYears2(),
      ]);
      this.jobPostForm = new AppSettings().getEditJobFormGroup();
    } catch (error) {
    } finally {
      this.util.stopLoader();
    }
  }


  chatuser(seletedItem, connectionTemplate?: TemplateRef<any>) {

    // if (seletedItem.isFeatured || (seletedItem.jobPostedBy == this.userId)) {
    //   this.openMessage(seletedItem);
    // } else if (!seletedItem.isFeatured) {
    //   if (seletedItem.connectionStatus === 'CONNECTED') {
    //     this.openMessage(seletedItem);
    //   } else if (seletedItem.connectionStatus !== 'CONNECTED') {
         this.openMessage(seletedItem);
    //     // to be used later
    //     // this.openConnectionTemplate(seletedItem.connectionStatus, seletedItem, connectionTemplate);
    //   }
    // }
    // if (seletedItem.jobPostedBy == this.userId) {
    //   seletedItem.owner = true;
    // } else {
    //   seletedItem.owner = false;
    // }




      // this.messagemodelflag = false;

      // if (seletedItem.jobPostedBy == this.userId) {
      //   seletedItem.owner = true;
      // } else {
      //   seletedItem.owner = false;
      // }


  }

  openMessage(seletedItem) {
    this.messagemodelflag = false;
    setTimeout(() => {
      if (this.userId != seletedItem.jobPostedBy) {
      seletedItem.userId = seletedItem.jobPostedBy;
      this.seletedChatItem = seletedItem;
      this.messageData = [];
      this.messagemodelflag = true;
      seletedItem.groupType = "JOB";
      seletedItem.messageType = "JOB";
      seletedItem.id = seletedItem.jobId;
      this.messageData = seletedItem;
      }
    }, 1000);

  }

  closeMessage(event) {
    this.messagemodelflag = false;
    // this._socket.ngOnDestroy();
  }
  deletedraft(id: any) {

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })
    swalWithBootstrapButtons.fire({
      title: 'Do you wish to discard?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.util.startLoader();
        this.api.delete('jobs/delete/' + id).subscribe(res => {
          if (res.code == "00000") {
            this.util.stopLoader();
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Discarded Sucessfully',
              showConfirmButton: false,
              timer: 1500
            })
            this.jobReload.emit("reload");

          }
        })
      }
    })
      ;
  }
}




