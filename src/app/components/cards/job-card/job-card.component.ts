import { HttpParams } from '@angular/common/http';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { Observable, Subscription } from 'rxjs';
import { AppSettings } from 'src/app/services/AppSettings';
import { FormValidation } from 'src/app/services/FormValidation';
import { GigsumoConstants } from 'src/app/services/GigsumoConstants';
import { ApiService } from 'src/app/services/api.service';
import { candidateModel } from 'src/app/services/candidateModel';
import { CommonValues } from 'src/app/services/commonValues';
import { JobService } from 'src/app/services/job.service';
import { JobModel } from 'src/app/services/jobModel';
import { UtilService } from 'src/app/services/util.service';
import Swal from 'sweetalert2';
import { SocketService } from '../../../services/socket.service';
import { PricePlanService } from '../../Price-subscritions/priceplanService';
import { CreditModelComponent } from '../../credit/credit-model/credit-model.component';
import { CandidateCardComponent } from '../candidate-card/candidate-card.component';
import { SearchData } from './../../../services/searchData';
import { CustomValidator } from '../../Helper/custom-validator';
declare var $: any
@Component({
  selector: 'app-job-card',
  templateUrl: './job-card.component.html',
  styleUrls: ['./job-card.component.scss'],
  providers: [CandidateCardComponent]
})
export class JobCardComponent extends FormValidation implements OnInit, OnChanges {
  @Input() viewSize: any;
  @Input() passValues: any;
  @Input() From: "SUGGESTED_JOBS" | "FEATURED_JOB" | "JOBS_FROM_CONNECTION" | "JOBS_FROM_PLATFORM";
  @Input() feaJ;
  @Input() allowedJobCandidateCounts: number = 0;
  flag: boolean = false;
  userType: string = localStorage.getItem('userType');
  applyingJob: boolean = false
  checkedList: any = [];
  @Input() showStatus: any;
  @Input() showCheckBox: any;
  @Input() applyingCandidate: any;
  connectionStatus: string;
  counterpartsDetails: any;
  connectionRequestRef: BsModalRef;
  values: any;
  @Output() jobemit = new EventEmitter<any>()
  @Output() selectedJob: EventEmitter<any> = new EventEmitter()
  @Input() getJobsugg: any;
  @Input() isDowngraded: boolean = false;
  bsModalRef: BsModalRef;
  fileDragdrop: any;
  resumeupload;
  Resurl = AppSettings.ServerUrl;
  fileSize = AppSettings.FILE_SIZE;
  candidateSupplyRef: BsModalRef;
  userId = localStorage.getItem('userId');
  @Input() jobsFoundStatus: any;
  clickItemActive: any;
  @Input() JobData: any;
  @Input() selectedjobCount: any;
  @Input() indexInput: any;
  @Input() JobDataUser: any
  @Input() candidateData: any
  @Input() jobstatus: any
  @Input() isRoutingDisabled: boolean = false;
  seletedChatItem;
  messageData: any;
  messagemodelflag: any;
  @Output() suggcandidate = new EventEmitter()
  jobid
  load: Subscription;
  rtrformgrp: UntypedFormGroup;
  url = AppSettings.photoUrl;
  GigsumoConstant = GigsumoConstants;
  rtrformModal: BsModalRef;
  rtrModalRef: BsModalRef;
  checkingApplyButton: boolean = false;
  tempFile: File;
  candidateStatus: string;
  dataPasstoSkillwidgets: Array<any> = [];
  termsCheck: any;
  rtrFormData: any;
  candidateFoundStatus: string;
  @Input() filterApplicantData: any;
  constructor(private fb: UntypedFormBuilder, private util: UtilService, private JobServicecolor: JobService,
    private _socket: SocketService, private common: CommonValues,
    private searchData: SearchData, private a_route: ActivatedRoute, private compOne: CandidateCardComponent,
    private modalService: BsModalService, private planService: PricePlanService, private router: Router, private pricePlan: PricePlanService,
    private api: ApiService) {
    super();

    if (this.a_route.snapshot.url.length != 0 && this.a_route.snapshot.url[0].path !== undefined) {
      this.checkingApplyButton = this.a_route.snapshot.url[0].path === "cInvited" ? true : false;
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.From) {
      this.From = changes.From.currentValue;
    }



  }

  triggerChange(jobId: string) {


  }
  @Output() jobapp_to_newjob_to_atvity = new EventEmitter<any>();
  selectCheckbox(value, jobVal) {
    if (value == true) {
      let data: Partial<{ jobId: string, eachJob: boolean }> = {}
      data.jobId = jobVal;
      this.jobemit.emit({ value: jobVal, flag: "true" });
    } else if (value == false) {
      this.jobemit.emit({ value: jobVal, flag: "false" });
    }
    jobVal.isSelected = value;
    this.jobapp_to_newjob_to_atvity.emit(jobVal);

  }
  userTypeMap: { [key: string]: string } = {
    'FREELANCE_RECRUITER': 'Freelance Recruiter',
    'RECRUITER': 'Recruiter',
    'JOB_SEEKER': 'Job Seeker',
    'MANAGEMENT_TALENT_ACQUISITION': 'Talent Acquisition Manager',
    'MANAGEMENT TALENT ACQUISITION': 'Talent Acquisition Manager',
    'BENCH_RECRUITER': 'Bench Recruiter'
  };




  // img: any;
  tempcandidateval: Array<any>;
  count = 0
  ngOnInit(): void {
    this.rtrformgrp = this.fb.group({
      targetrate: [null, Validators.compose([Validators.required, CustomValidator.validDecimal(),CustomValidator.checkWhiteSpace()])],
      termsandcondition: [null, Validators.requiredTrue],
      country: null,
      RtrpayType: [null, Validators.required]
    })
    // if (this.indexInput == 0) {
    //   this.jobemit.emit({ value: this.JobData.jobId, flag: "null" });
    // }

    if (this.selectedjobCount == undefined || this.selectedjobCount == null) {
      this.selectedjobCount = 1;
    }

  }
  FormData: any;
  tempstatus
  statusCall: string;
  showResumeUpload: boolean;
  @ViewChild("RTRtemplate") rtrformTemplate;
  async updatestatus(status, value, template: TemplateRef<any>) {

    if (status === "ACCEPTED") {

      const userData = await this.pricePlan.UPDATE_USERDETAILS("ACTIVE_INTERACTIONS");

      if (userData.isExpired) {
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

        return;
      }
      else {
        this.afterValidatingPlan(status, value, template);
      }
    }
    else {
      this.afterValidatingPlan(status, value, template);
    }

  }

  getInitials(fullname: string): string {
    return this.JobServicecolor.getInitials(fullname);
  }

  getColor(fullname: string): string {
    return this.JobServicecolor.getColor(fullname);
  }
  downloadResume(candidateId, userId, createdBy, FileId) {
    let atag = document.createElement('a');
    atag.href = `${this.Resurl}candidates/resumeDownload/${candidateId}/${userId}/${createdBy}/${FileId}`;
    atag.click();

  }

  updatestatuswithdraw(datas, value) {

    this.util.startLoader();
    var data: any = {};
    data.jobId = value.jobId;
    data.candidateId = this.candidateData.candidateId;
    data.jobPostedBy = value.jobPostedBy;
    data.currentStatus = datas.itemId;
    data.candidateName = this.candidateData.firstName + " " + this.candidateData.lastName;
    data.jobTitle = value.jobTitle;
    data.createdByUserName = value.postedByUserName;
    // data.organisationName = localStorage.getItem('currentOrganization');
    data.email = value.user.username;
    this.JobData.currentStatus = datas.itemId;
    this.jobupdatestatus(data);
  }

  async jobupdatestatus(data) {

    try {
      this.util.startLoader();
      const res = await this.api.create("candidates/updatejobAppliedStatus", data).toPromise();
      this.util.stopLoader();
      if (res.code === "00000") {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Status successfully Updated.",
          showConfirmButton: false,
          timer: 2000,
        });
        data.eachCandidate = true;
        data.isSelected = true;
        this.searchData.setJobID(data);
        this.jobapp_to_newjob_to_atvity.emit(data);
      }else if (res.code == "99998") {
        Swal.fire({
          position: "center",
          icon: "info",
          title: "Job application status updated already..!",
          showConfirmButton: true,
          allowEscapeKey: false,
          allowOutsideClick: false,
        }).then((result) => {
          if (result.isConfirmed) {
            this.JobServicecolor.confirmResult();
          }
        });
      }
    } catch (err) {
      this.util.stopLoader();

    }
  }

  getFilterValue(key : string , content : string = "JOB_APPLIED"){
    if(this.filterApplicantData){
      const arrs : Array<any> = content === "JOB_APPLIED" ? [...this.filterApplicantData.JOB_APPLICATION_SUPPLIER_ACTIONS.listItems] :
      [...this.filterApplicantData.JOB_INVITATION_SUPPLIER_ACTIONS.listItems];

      if(arrs){
        const find = arrs.find(c=>c.itemId === key);
        return find ? find.value : null;
      }
    }
  }

  filterApplicant(data , content : string = "JOB_APPLIED"){

    if(this.filterApplicantData){


      const arrs : Array<any> = content === "JOB_APPLIED" ? [...this.filterApplicantData.JOB_APPLICATION_SUPPLIER_ACTIONS.listItems] :
      [...this.filterApplicantData.JOB_INVITATION_SUPPLIER_ACTIONS.listItems] ;
      const order = arrs.find(_x => _x.itemId === data)!.order;

      const finalData = arrs.reduce((acc : Array<any>, current , index , arr )=>{

        const find = acc.find(_d => _d.itemId === current.itemId);
        const next = arr.indexOf(current) + 1;

        if(find === undefined){

          const nextData = arr[next];

          if(nextData && (current.item === undefined || current.item === null) && data === current.itemId){
            if(nextData.item != undefined || nextData.item != null){
              acc.push(...arr.filter(c=> c.order === order + 1));
              return acc;
            }
          }

          if((current.order === undefined || current.order === null) && current.item != undefined){
            acc.push(current);
        }

      }

      return acc;

    },[]);



      return  finalData;
    }

  }


  afterValidatingPlan(status, value, template: TemplateRef<any>) {
    if (value.targetRateTo != null) {
      this.rtrformgrp.patchValue({
        targetrate: value.targetRateTo,
        RtrpayType: value.payType != null ? value.payType : "Hourly",
        country: value.country != null ? value.country : "",
        termsandcondition: null
      });
    }
    this.rtrformgrp.get('termsandcondition').markAsUntouched();
    if (status === 'ACCEPTED') {
      this.statusCall = 'ACCEPTED';
      let resumes: Array<any> = this.candidateData.resumes;
      if ((resumes != null && resumes.length > 0) || value.resumeUpdated) {

        if (resumes != null && resumes != undefined) this.showResumeUpload = resumes.length > 0 ? false : true;

        if (value.resumeUpdate) this.showResumeUpload = false;

        let ngbModalOptions: NgbModalOptions = { backdrop: 'static', keyboard: false };
        this.tempdata = value;
        this.tempstatus = status;
        this.tempcanddata = this.candidateData;
        this.resumeupload = '';
        this.fileDragdrop = '';
        this.rtrModalRef = this.modalService.show(template, ngbModalOptions);

      }
      else if (!value.resumeUpdated || resumes === null || resumes === undefined) {
        this.showResumeUpload = value.resumeUpdated ? false : true;


        let ngbModalOptions: NgbModalOptions = { backdrop: 'static', keyboard: false };
        this.tempdata = value;
        this.tempstatus = status;
        this.tempcanddata = this.candidateData;
        this.resumeupload = '';
        this.fileDragdrop = '';
        this.rtrModalRef = this.modalService.show(template, ngbModalOptions);
      }
    }
    else if (!value.resumeUpdated || status === 'REJECTED') {
      this.showResumeUpload = value.resumeUpdated ? false : true;
      this.tempdata = value;
      this.statusCall = 'REJECTED';
      this.tempstatus = status;
      this.tempcanddata = this.candidateData;
      this.resumeupload = '';
      this.fileDragdrop = '';
      this.submit();
    }
  }

  afterValidatingApplyPlan(values) {
    this.tempApplyValue = values;
    var profiledata: any = {}
    profiledata.userId = localStorage.getItem('userId')
    profiledata.userType = localStorage.getItem('userType')
    this.api.create('user/profileDetails', profiledata).subscribe(res => {
      // let element: any = {};
      values.clientType = values.user.clientType;
      values.userType = values.user.userType;
      if (values.clientType == undefined && values.userType == undefined) {
        values.clientType = res.data.userData.clientType;
        values.userType = res.data.userData.userType;
      }
      let datas: any = {};
      let routedata: any;
      var temparr = [];
      var datacheck = [{ 'userId': localStorage.getItem('userId') }]
      datas.jobPostedBy = localStorage.getItem('userId');
      datas.jobId = values.jobId;
      datas.appliedBy = datacheck;
      values.feaJ = this.feaJ;
      values.jobfilter = true;
      values.targetRate = this.rtrformgrp.value.targetrate;
      values.filterTitle = 'Select';
      this.router.navigate(["newcandidates"], { queryParams: values });
    });
  }

  tempApplyValue: any
  jobData: any;
  apply(values: any, connectionTemplate?: TemplateRef<any>, candidateSupplyTemplate?: TemplateRef<any>) {

    this.jobData = values;
    if (values.isFeatured == true) {
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

  async proceedToApply(values, candidateSupplyTemplate) {
    const userData = await this.pricePlan.UPDATE_USERDETAILS("ACTIVE_INTERACTIONS");
    if (userData.isExpired && this.userType != "JOB_SEEKER") {
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
    values.clientType = values.user.clientType;
    values.userType = values.user.userType;
    let datas: any = {};
    var datacheck = [{ 'userId': localStorage.getItem('userId') }]
    datas.jobPostedBy = localStorage.getItem('userId');
    datas.jobId = values.jobId;
    datas.appliedBy = datacheck;
    values.jobfilter = true;
    values.filterTitle = 'Select';
    values.fromBusinessPage = false
    values.jobDescription = "";
    // const config: ModalOptions = { class: 'modal-lg', backdrop: 'static', keyboard: false };
    // this.router.navigate(["newcandidates"], { queryParams: values });
    // this.searchData.setHighlighter('newcandidates')
    // this.candidateSupplyRef = this.modalService.show(candidateSupplyTemplate, config);

  }


  closeCandidateSupplyModal() {
    this.modalService.hide(1);
  }

  removeUserfromTag(data) {
    if(data === "REFRESH"){
      this.jobemit.emit(data);
    }
    else{
      this.applyResponse.forEach(element => {
        if (element.candidateId == data.candidateId) {
          element.isSelected = false;
        }
      });

      this.dataPasstoSkillwidgets.forEach(element => {
        if (element.candidateId == data.candidateId) {
          element.isSelected = false;
        }
      });
    }

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

  resumeData: any = []
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

  getUserDetails(): Observable<any> {
    return this.api.query("user/" + this.values.jobPostedBy);
  }

  checkConnectionStatus(values): Observable<any> {

    const apiURL = 'user/checkConnectionStatus';
    const params = new HttpParams()
      .set('userId', this.userId)
      .set('connnectorId', values.jobPostedBy);

    const urlWithParams = `${apiURL}?${params.toString()}`;
    return this.api.query(urlWithParams);
  }




  get rtrFormControls() {
    return this.rtrformgrp.controls
  }
  like(values: any) {
    if (values.jobPostedBy != localStorage.getItem('userId')) {
      let datas: any = {};
      if (values.isLiked == false || values.isLiked == null) {
        datas.likeStatus = "LIKE"
      } else if (values.isLiked == true) {
        datas.likeStatus = "UNLIKE"
      }
      datas.userId = localStorage.getItem('userId');
      datas.jobId = values.jobId;

      this.api.updatePut("jobs/updateJobLiked", datas).subscribe((res) => {
        this.JobData.likesCount = res.data.jobData.likesCount;
        this.JobData.isLiked = res.data.jobData.isLiked;
        this.passValues.isLiked = true;
        this.util.stopLoader();
      }, err => {
        this.util.stopLoader();
      });
    }else{
      this.goTo(values, 'jobs-liked')
    }
  }
  isInteger(event) {
    var ctl = document.getElementById('myText');
    var startPos = ctl['selectionStart'];

    if (startPos == 0 && String.fromCharCode(event.which) == '0') {
      return false;
    }
  }

  goTo(values, param) {
    if (values.jobPostedBy == this.userId && values.jobPostedBy != undefined) {
      if (param == 'job-applicants' && values.appliedCount > 0) {
        this.router.navigate(['newjobs'], { queryParams: { jobId: values.jobId, tabName: 'job-applicants', From: this.From } });
      } else if (param == 'views' && values.viewedByCount != undefined) {
        this.router.navigate(['newjobs'], { queryParams: { jobId: values.jobId, tabName: 'jobs-viewed', From: this.From } });
      }
      else if (param == 'jobs-liked' && values.status != 'INACTIVE') {
        this.router.navigate(['newjobs'], { queryParams: { jobId: values.jobId, tabName: 'jobs-liked', From: this.From } });
      }
      else if (param == "candidates-invited") {
        this.router.navigate(['newjobs'], { queryParams: { jobId: values.jobId, tabName: 'candidates-invited', From: this.From } });
      }
    }
    else if (values.jobPostedBy != this.userId) {
      if (param == 'jobs-applied' && values.appliedCount > 0 && values.status != 'INACTIVE') {
        this.router.navigate(['newjobs'], { queryParams: { jobId: values.jobId, tabName: 'job-details', From: this.From } });
      } else if (param == 'views' && values.status != 'INACTIVE') {
        this.router.navigate(['newjobs'], { queryParams: { jobId: values.jobId, tabName: 'job-details', From: this.From } });
      }
      // else if (param == 'job-applicants' && values.appliedCount > 0) {
      //   this.router.navigate(['newjobs'], { queryParams: { jobId: values.jobId, tabName: 'job-applicants', From: this.From } });
      // }
      else if (param == 'candidate-applied' && values.candidatesApplied && values.candidatesApplied.length > 0) {
        this.router.navigate(['newjobs'], { queryParams: { jobId: values.jobId, tabName: 'candidate-applied', From: this.From } });
      }

    }

  }

 isExcludedStatus(status: string , content : string = "JOB_APPLIED"): boolean {
  if(this.filterApplicantData){

    const find = content === "JOB_APPLIED" ? (this.filterApplicantData.JOB_APPLICATION_BLOCKING_ACTIONS.listItems &&
      this.filterApplicantData.JOB_APPLICATION_BLOCKING_ACTIONS.listItems.find(x => x.itemId === status) ) :
      (this.filterApplicantData.JOB_INVITATION_BLOCKED_ACTIONS.listItems &&
        this.filterApplicantData.JOB_INVITATION_BLOCKED_ACTIONS.listItems.find(x => x.itemId === status) );
        return find ? true : false;
  }
}



  openModalWithComponent() {
    const initialState: any = {
      backdrop: 'static',
      keyboard: false,
      size: "open"
    };
    this.modalService.show(CreditModelComponent, { initialState });
  }

  open(values: any) {

    if (values.status != "BLOCKED") {
      if (values.clientType == null) {
        values.clientType = values.user.clientType
      }
      if (values.user != null) {
        values.clientType = values.user.clientType;
      }
      let data: any = {}
      data.jobPostedBy = values.jobPostedBy;
      data.jobId = values.jobId;
      if (values.isViewed != null && values.isViewed == true && values.jobPostedBy != this.userId) {
        this.router.navigate(['newjobs'], { queryParams: { jobId: values.jobId, tabName: 'job-details', From: this.From } });
      } else if (values.jobPostedBy == this.userId || localStorage.getItem('userType') == 'JOB_SEEKER') {
        this.router.navigate(['newjobs'], { queryParams: { jobId: values.jobId, tabName: 'job-details', From: this.From } });
      } else if (values.isViewed) {
        this.router.navigate(['newjobs'], { queryParams: { jobId: values.jobId, tabName: 'job-details', From: this.From } });
      } else {
        this.router.navigate(['newjobs'], { queryParams: { jobId: values.jobId, tabName: 'job-details', From: this.From } });
      }
    }
  }

  view(jobData) {
    this.router.navigate(['newjobs'], { queryParams: { jobId: jobData.jobId, tabName: 'job-details', From: this.From } });
  }


  // async open(values: any, index?: any) {
  //   this.updateJobModule.jobDetails.apply(this.updateJobModule.source,[values , {value : null , for : "JOB_DETAIL"}]);
  //   this.selectedItem = values.jobId;
  //   try {
  //   } catch (error) {

  //   } finally {
  //     this.util.stopLoader();
  //   }
  // }


  featurejob(item) {


    var profiledata: any = {}
    profiledata.userId = localStorage.getItem('userId')
    profiledata.userType = localStorage.getItem('userType')
    this.api.create('user/profileDetails', profiledata).subscribe(res => {
      //let element: any = {};

      // CONSUMPTION_FOR_UPGRADED_JOB
      //element = res.data.creditConsumptions.find(item => item.creditType === AppSettings.UPGRADED_JOB)


      //if (res.data.creditPoints >= element.points || localStorage.getItem('userType') == 'student' || this.userType == 'JOB_SEEKER') {
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: "btn btn-success",
          cancelButton: "btn btn-danger",
        },
        buttonsStyling: false,
      });

      swalWithBootstrapButtons
        .fire({
          title: "Are you sure?",
          text: "Upgrade will consume $2.99 per day,would you like to Upgrade the job",
          icon: "warning",
          showCancelButton: true,
          // showConfirmButton:true,
          confirmButtonText: "Yes",
          cancelButtonText: "No",
          reverseButtons: true,
          allowOutsideClick: false,
        })
        .then((result) => {
          if (result.isConfirmed) {

            //   }
            // })

            item.isFeatured = true;
            // item.points = element.points;
            // item.consumptionType = element.creditType;
            this.util.startLoader();
            item.jobReferenceId=item.jobId;
            this.api.updatePut("jobs/updateJob", item).subscribe((res) => {
              this.util.stopLoader();
              if (res.code == '00000') {
                Swal.fire({
                  icon: "success",
                  title: "Upgraded Successfully",
                  showDenyButton: false,
                  // confirmButtonText: `ok`,
                  showConfirmButton: false,

                  timer: 2000,
                })
              }
            }, err => {
              this.util.stopLoader();
            });
          }
        });

      // }
      // else {
      //   this.openModalWithComponent();
      // }

    });

  }

  ngAfterViewInit(): void {
  }



  chatuser(seletedItem, connectionTemplate?: TemplateRef<any>) {

    this.messagemodelflag = false;


    this.jobData = seletedItem;
    if (seletedItem.isFeatured == true || (seletedItem.jobPostedBy == this.userId)) {

      this.openMessage(seletedItem);
    } else if (!seletedItem.isFeatured) {
      if (seletedItem.connectionStatus === 'CONNECTED') {
        this.openMessage(seletedItem);

      } else if (seletedItem.connectionStatus !== 'CONNECTED') {
        this.openMessage(seletedItem);

      }
    }


  }

  openMessage(seletedItem) {
    if (seletedItem.jobPostedBy == this.userId) {
      seletedItem.owner = true;
    } else {
      seletedItem.owner = false;
    }

    setTimeout(() => {
      seletedItem.userId = seletedItem.jobPostedBy;
      this.seletedChatItem = seletedItem;
      this.messageData = [];
      this.messagemodelflag = true;
      seletedItem.groupType = "JOB";
      seletedItem.messageType = "JOB";
      seletedItem.id = seletedItem.jobId;
      this.messageData = seletedItem;
    }, 1000);
  }

  closeMessage(event) {
    this.messagemodelflag = false;
  }

  onFileDropped($event) {
    this.prepareFilesList($event);
  }

  removeFiles() {
    $("#fileDropRef")[0].value = '';
    if (this.fileDragdrop != null && this.resumeupload != null) {
      this.fileDragdrop = null;
      this.resumeupload = null;
    }
  }

  onDownload() {
    const file: File = this.tempFile;
    this.downloadFile(new Blob([file]), file.name);
  }

  downloadFile(blob: Blob, fileName: string): void {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(link.href), 0);
  }

  fileBrowseHandler(files) {
    this.tempFile = files[0];
    this.prepareFilesList(files);
  }

  prepareFilesList(files: File) {
    this.fileDragdrop = files[0];
    this.resumeupload = files[0];
    var fromate = ['application/pdf', 'application/docx', 'application/doc', 'text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword']
    if (files[0].size > this.fileSize) {
      this.fileDragdrop = null;
      Swal.fire({
        icon: "info",
        title: "Please upload file lesser than 10 MB",
        showDenyButton: false,
        timer: 3000,
      })
      $("#fileDropRef")[0].value = '';
      this.resumeupload = null;
    }
    else if (fromate.includes(files[0].type)) {
      this.fileDragdrop = files[0];
      this.resumeupload = files[0];

    } else {
      this.fileDragdrop = "";
      this.resumeupload = undefined;
      Swal.fire({
        icon: "info",
        title: "Please upload valid formate.",
        showDenyButton: false,
        timer: 3000,
      })
    }
  }
  tempdata: JobModel;
  tempcanddata: candidateModel;
  resumeflag = false;
  submitRTR: boolean = false;

  checkAttached() {
    if (this.resumeupload == "" || this.resumeupload == undefined || this.resumeupload == null) {
      return true
    } else {
      return false
    }
  }

  submit() {
    this.rtrformgrp.markAllAsTouched();
    var data: any = {}
    this.submitRTR = true;


    if (!this.candidateData.resumeAttached && this.checkAttached() && this.statusCall !== 'REJECTED') {
      Swal.fire({
        icon: "info",
        title: "Please upload Resume...",
        showDenyButton: false,
        timer: 3000,
      })
      return
    }




    if ((this.rtrformgrp.valid && this.rtrformgrp.value.termsandcondition) || this.statusCall === 'REJECTED') {
      this.util.startLoader();
      data.jobId = this.tempdata.jobId;
      data.organisationName = this.tempdata.jobPostedBehalfOf;
      data.postedByUserName = this.tempdata.postedByUserName
      data.jobTitle = this.tempdata.jobTitle;
      data.jobPostedBy = this.tempdata.jobPostedBy;
      data.candidateId = this.tempcanddata.candidateId;
      data.currentStatus = this.tempstatus;
      data.targetRateFortheCandidate = this.rtrformgrp.value.targetrate;
      data.payTypeFortheCandidate = this.rtrformgrp.value.RtrpayType;
      // data.primaryResume=true;

      this.FormData = new FormData();
      this.FormData.append("job", new Blob([JSON.stringify(data)], { type: "application/json" }));
      this.FormData.append("file", this.resumeupload);

      this.api.create('jobs/updateInterestShownStatus', this.FormData).subscribe(res => {
        this.util.stopLoader();
        if (res.code == '00000') {
          data.isSelected = true;
          if (this.tempstatus === 'ACCEPTED') {
            this.showResumeUpload = false

          }
          this.jobapp_to_newjob_to_atvity.emit(data);
          this.candidateData.resumeAttached = true;
          this.resumeflag = true;
          this.JobData.currentStatus = this.tempstatus;
          if (this.statusCall === 'ACCEPTED') this.hide();
          Swal.fire({
            icon: "success",
            title: `Invitation ${this.statusCall === 'ACCEPTED' ? 'Accepted' : 'Rejected'} Sucessfully`,
            showConfirmButton: false,
            timer: 2000,
          });
          let datas: Partial<{ jobId: string, eachJob: boolean }> = {}
          datas.jobId = this.tempdata.jobId;
          datas.eachJob = true;
          this.searchData.setJobID(datas);

          this.resumeupload = ''
          this.fileDragdrop = ''
        }
      }, err => {
        this.util.stopLoader();
      });
    }
  }

  hide() {
    this.rtrModalRef.hide();
    this.rtrformgrp.reset();
    this.submitRTR = false;
  }

}
