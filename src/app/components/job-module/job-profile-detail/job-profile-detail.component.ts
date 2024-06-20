import { HttpParams } from '@angular/common/http';
import { Component, EventEmitter, OnChanges, OnInit, Output, SimpleChanges, TemplateRef } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { TypeaheadOrder } from 'ngx-bootstrap/typeahead';
import { Observable, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { AppSettings } from 'src/app/services/AppSettings';
import { FormValidation } from 'src/app/services/FormValidation';
import { GigsumoConstants } from 'src/app/services/GigsumoConstants';
import { HealthCareOrganization } from 'src/app/services/HealthCareOrganization';
import { JobModel } from 'src/app/services/jobModel';
import { SearchData } from 'src/app/services/searchData';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { PricePlanService } from '../../Price-subscritions/priceplanService';
import { ApiService } from './../../../services/api.service';
import { CommonValues } from './../../../services/commonValues';
import { UtilService } from './../../../services/util.service';
import { CreditModelComponent } from './../../credit/credit-model/credit-model.component';
// import job from './job-profile-detail.json'
declare var $: any;
@Component({
  selector: 'app-job-profile-detail',
  templateUrl: './job-profile-detail.component.html',
  styleUrls: ['./job-profile-detail.component.scss'],
  inputs: ["jobDetails"],
  outputs: ["jobListing"],
  providers: [PricePlanService]
})
export class JobProfileDetailComponent extends FormValidation implements OnInit, OnChanges {

  jobDetails: JobModel;
  jobListing = new EventEmitter<any>();
  url = AppSettings.ServerUrl + "download/";
  jobId: any;
  userId: string = localStorage.getItem('userId');
  public FORMERROR = super.Form;
  submited: boolean = false;
  candidateSupplyRef: BsModalRef;
  showmodel = false
  creditform: UntypedFormGroup;
  updateDate: any = [];
  userType: any;
  ActivateContent: string = "Update Job";
  currentTimeDate: string | Date;
  jobstatussub: Subscription;
  unit = { duration: '30' };
  bsModalRef: BsModalRef;
  public envName: any = environment.name;
  queryParamsSubscription: Subscription;
  @Output() jobDetails_Activity: EventEmitter<any> = new EventEmitter()
  dataPasstoSkillwidgets: any;
  removeTagvalues: any;
  candidateFoundStatus: string;



  constructor(
    private api: ApiService,
    private util: UtilService,
    private modalService: BsModalService,
    private router: Router,
    private formBuilder: UntypedFormBuilder,
    private activatedRoute: ActivatedRoute,
    private commonValues: CommonValues,
    private searchData: SearchData, private pricePlanService: PricePlanService
  ) {
    super();
    // console.log("this.jobDetails")
    // console.log(this.jobDetails)
    this.userId = localStorage.getItem('userId')
    this.userType = localStorage.getItem('userType');
    this.searchData.setHighlighter('newjobs');

    // console.log("jobdetails ", this.jobDetails);
    this.queryParamsSubscription = this.activatedRoute.queryParams.subscribe((res) => {
      if (res) {
        this.jobId = res.jobId;
        // this.getJobDetails();
        // this.jobDetails = res
        let data: any = {};
        data.eachCandidate = true;
        data.jobId = this.jobId;
        // this.searchData.setJobID(data);
      }
    });

    // this.jobstatussub = this.commonValues.getJobData().subscribe(jobObject => {
    //   this.updateJobObject(jobObject);
    // })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.jobDetails.currentValue) {
      this.jobDetails = changes.jobDetails.currentValue;
      this.initiateJobForm();

      // console.log("CENTER_VALUE_UPDATED  ", this.jobDetails);
    }
  }

  object: any;
  ngOnInit() {
    this.searchData.setNUllCheck("notnull");
    this.creditform = this.formBuilder.group({
      point: [null, Validators.required],
    });
    // this.util.startLoader();


  }
  updateJobObject(JobObject): void {
    if (this.jobDetails.jobId == JobObject.jobId) {
      this.jobDetails.status = JobObject.status
    }
  }
  ngOnDestroy() {
    if (this.queryParamsSubscription) {
      this.queryParamsSubscription.unsubscribe();
    }
    if (this.jobstatussub) {
      this.jobstatussub.unsubscribe();
    }
  }

  connect(userId: string) {
    let datas: any = {};
    datas.userId = userId;
    datas.requestedBy = localStorage.getItem('userId');
    // this.util.startLoader();
    this.api.create("user/connect", datas).subscribe((conData) => {
      // this.util.stopLoader();
      console.warn("Connection Response data: ", conData);
      if (conData.code === "00000") {
        Swal.fire({
          icon: "success",
          title: "Connection request sent successfully",
          showConfirmButton: false,
          timer: 2000,
        }).then((result) => {
        });
      } else if (conData.code === "88888") {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Oops..",
          text: "Sorry, connection request failed. Please try after some time",
          showConfirmButton: false,
          timer: 3000,
        });

      }
    }, err => {
      // this.util.stopLoader();
    });
  }



  OnChangeCurrentOrg() {
    if (this.jobPostForm.get('clientType').value == GigsumoConstants.DIRECT_HIRE) {
      this.jobPostForm.patchValue({ clientName: this.jobPostForm.get("jobPostedBehalfOf").value })
      this.jobPostForm.get("clientName").disable()
    }
  }

  extractText(val: string) {
    return FormValidation.extractContent(val);
  }


  fromBusinessPage: boolean = false
  c: any;
  d: any;
  fromBusinessPageId: any;



  closeCandidateSupplyModal() {
    this.modalService.hide(1);
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
      console.log("APLY_RESPONSE  ", res);
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

  termsCheck: boolean = false;
  rtrFormData: any;
  getchildData(data: any) {
    this.termsCheck = data.terms;
    if (data.value != null) {
      this.dataPasstoSkillwidgets = data.value;
      this.rtrFormData = data.formData;
    } else {
      this.dataPasstoSkillwidgets = [];
    }

  }

  removeUserfromTag(data) {
    this.removeTagvalues = data;
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

  async proceedToApply(values, candidateSupplyTemplate) {
    if (this.pricePlanService.ACTIVE_INTERACTION === 0 && this.userType != "JOB_SEEKER") {
      const userData = await this.pricePlanService.UPDATE_USERDETAILS("ACTIVE_INTERACTIONS");
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
      this.pricePlanService.expiredPopup("ACTIVE_INTERACTIONS", "PAY", null, null, null, availablePoints, actualPoints, utilizedPoints, promotional);
      // this.pricePlanService.expiredPopup("ACTIVE_INTERACTIONS");
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

  // checkConnectionStatus(values): Observable<any> {
  //   const apiURL = 'user/checkConnectionStatus';
  //   const params = new HttpParams()
  //     .set('userId', this.userId)
  //     .set('connnectorId', values.jobPostedBy);

  //   const urlWithParams = `${apiURL}?${params.toString()}`;
  //   return this.api.query(urlWithParams);
  // }

  connectionStatus: string;
  connectionRequestRef: BsModalRef;
  values: any;
  counterpartsDetails: any;
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
  checkConnectionStatus(values): Observable<any> {
    const apiURL = 'user/checkConnectionStatus';
    const params = new HttpParams()
      .set('userId', this.userId)
      .set('connnectorId', values.createdBy);

    const urlWithParams = `${apiURL}?${params.toString()}`;
    return this.api.query(urlWithParams);
  }

  jobData: any;
  apply(values: any, template?: TemplateRef<any>, candidateSupplyTemplate?: TemplateRef<any>) {
    this.jobData = values;
    if (values.isFeatured) {
      this.proceedToApply(values, candidateSupplyTemplate);
    } else if (!values.isFeatured) {
      if (values.connectionStatus === 'CONNECTED') {
        this.proceedToApply(values, candidateSupplyTemplate);
      } else if (values.connectionStatus !== 'CONNECTED') {
        this.proceedToApply(values, candidateSupplyTemplate);
        // to be used later
        // this.openConnectionTemplate(values.connectionStatus, values, template);
      }
    }
  }

  zipCodeValidaiton(x: number): boolean {
    if (String(x).length > 10) {
      return false;
    }
    return true;
  }

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

  uniqueOrgList1: Array<Partial<HealthCareOrganization>> = [];

  searchBarShow1: boolean = false;
  onPaste1(event: ClipboardEvent) {
    let clipboardData = event.clipboardData;
    let pastedText = clipboardData.getData('text');
    if (pastedText != null) {
      // this.util.startLoader();
      this.api.query("care/organizations?organizationName=" + pastedText)
        .pipe(debounceTime(2000))
        .subscribe((res) => {
          // this.util.stopLoader();
          if (res) {
            // this.util.stopLoader();
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


  get credit() {
    return this.creditform.controls
  }
  closemodel() {
    this.modalRef.hide();
  }

  async enableJob(event) {
    if (event.target.checked) {
      // let isJobOrCandidayeExpired: boolean = await this.pricePlanService.UPDATE_USERDETAILS("JOB_CANDIDATE_POSTINGS");
      const userData = await this.pricePlanService.UPDATE_USERDETAILS("JOB_CANDIDATE_POSTINGS");

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
        this.pricePlanService.expiredPopup("JOB_CANDIDATE_POSTINGS", "PAY", null, null, null, availablePoints, actualPoints, utilizedPoints, promotional);
        // this.pricePlanService.expiredPopup("JOB_CANDIDATE_POSTINGS");

        this.toggleOpen = false;
        event.target.checked = false;
        return;
      }
      else {
        this.afterPlanValidationstatuschange(event);
      }
    } else {
      this.afterPlanValidationstatuschange(event);
    }

  }
  afterPlanValidationstatuschange(event) {

    if (event.target.checked == true) {
      if (this.jobDetails.status != 'ACTIVE' && this.jobDetails.status != 'DRAFTED' && this.jobDetails.status != 'AWAITING HOST') {
        this.ActivateContent = 'Activate Job'
      }
      this.jobDetails.status = 'ACTIVE'

    } else if (event.target.checked == false) {
      this.jobDetails.status = 'INACTIVE'
    }

    // this.util.startLoader()
    this.api.updatePut('jobs/updateJob', this.jobDetails).subscribe(res => {
      if (res.code == '00000') {
        this.jobDetails = res.data.jobData
        this.jobListing.emit(event.target.checked ? "updateReload" : "reload");
        // this.util.stopLoader()
      }
    })
  }

  getJobDetails() {
    if (this.jobDetails.jobId != undefined) {
      this.api.query("jobs/findJobById/" + this.jobDetails.jobId).subscribe(res => {
        if (res != undefined && res.code == '00000') {
          // this.util.stopLoader()
          this.jobDetails = res.data.jobData;


          if (res.data.jobData != null) {
            this.onChangeCountry(res.data.jobData.country)
          }
        }
      });
    }
  }

  backdropConfig = {
    backdrop: true,
    ignoreBackdropClick: true,
    keyboard: false,
    // scroll
  };

  openModalWithComponent() {
    const initialState: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      size: "open"
    };
    this.bsModalRef = this.modalService.show(CreditModelComponent, initialState);
  }
  serverCurrentDate: string;
  servertimedate: string;
  disable_for_draft: boolean = false;
  // async saveJob(statusvalue) {
  //   if(this.jobDetails.status!='ACTIVE'){
  //     let isJobOrCandidayeExpired : boolean = await this.pricePlanService.UPDATE_USERDETAILS("JOB_CANDIDATE_POSTINGS");

  //     if(isJobOrCandidayeExpired  ){
  //       this.pricePlanService.expiredPopup("JOB_CANDIDATE_POSTINGS");
  //       this.modalOpen = false;
  //       this.toggleOpen = false;
  //       return;
  //     }
  //     else{
  //       this.afterPlanValidation(statusvalue);
  //     }
  //   }else{
  //     this.afterPlanValidation(statusvalue);
  //   }
  // }
  async saveJob(statusvalue: string) {
    this.submit = true
    this.disable_for_draft = true;
    if (statusvalue == 'ALL' && this.jobPostForm.status == "INVALID") {
      this.disable_for_draft = false;
      return true;
    }


    //this.util.startLoader();

    // check credit
    // var profiledata: any = {}
    // profiledata.userId = localStorage.getItem('userId')
    // profiledata.userType = localStorage.getItem('userType')
    //this.util.startLoader()
    // this.api.create('user/profileDetails', profiledata).subscribe(profileres => {
    // this.util.stopLoader()
    // this.util.startLoader();
    // let element: any
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
    // element = profileres.data.creditConsumptions.find(item => item.creditType === AppSettings.CREATE_JOB);
    // if (this.jobDetails.status == "DRAFTED" && profileres.data.creditPoints < 5 && statusvalue != "DRAFTED" && this.jobDetails.isFeatured != true ||
    //   this.jobDetails.status == "ON HOLD" && profileres.data.creditPoints < 5 && statusvalue != "DRAFTED" && this.jobDetails.isFeatured != true ||
    //   this.jobDetails.status == "INACTIVE" && profileres.data.creditPoints < 5 && statusvalue != "DRAFTED" && this.jobDetails.isFeatured != true ||
    //   this.jobDetails.status == "INACTIVE_DUE_TO_LOW_CREDITS" && profileres.data.creditPoints < 5 && statusvalue != "DRAFTED" && this.jobDetails.isFeatured != true ||
    //   this.jobDetails.status == "DEACTIVATED" && profileres.data.creditPoints < 5 && statusvalue != "DRAFTED" && this.jobDetails.isFeatured != true) {
    //   this.util.stopLoader();
    //   this.modalRef.hide();
    //   this.openModalWithComponent();

    //this.modalRef = this.modalService.show(checkCredit, this.backdropConfig);

    //   return;
    // }
    // if (this.jobDetails.status == "DRAFTED" && profileres.data.creditPoints < 25 && statusvalue != "DRAFTED" && this.jobDetails.isFeatured == true ||
    //   this.jobDetails.status == "ON HOLD" && profileres.data.creditPoints < 25 && statusvalue != "DRAFTED" && this.jobDetails.isFeatured == true ||
    //   this.jobDetails.status == "INACTIVE" && profileres.data.creditPoints < 25 && statusvalue != "DRAFTED" && this.jobDetails.isFeatured == true ||
    //   this.jobDetails.status == "INACTIVE_DUE_TO_LOW_CREDITS" && profileres.data.creditPoints < 25 && statusvalue != "DRAFTED" && this.jobDetails.isFeatured == true ||
    //   this.jobDetails.status == "DEACTIVATED" && profileres.data.creditPoints < 25 && statusvalue != "DRAFTED" && this.jobDetails.isFeatured == true) {

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
    // if (this.jobPostForm.valid) {
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
    if (this.jobDetails.status == 'DRAFTED' && statusvalue != 'DRAFTED') {
      //if ( localStorage.getItem('userType') == 'student' || localStorage.getItem('userType') == 'JOB_SEEKER') {

      this.jobPostForm.patchValue({
        //"consumptionType": element.creditType,
        "createdByUserType": localStorage.getItem('userType'),
        //"points": element.points,
        "status": "ACTIVE"
      })
      //}

    }
    // if (this.jobDetails.statusUpdatedOn != undefined) {
    //   let statusupdateddate = this.util.dateFormatestring(this.jobDetails.statusUpdatedOn);
    //   if (
    //     this.jobDetails.status == 'ON HOLD' && statusvalue != 'DRAFTED' && creditserverdate > statusupdateddate && this.jobDetails.isFeatured != true ||
    //     this.jobDetails.status == 'INACTIVE' && statusvalue != 'DRAFTED' && creditserverdate > statusupdateddate && this.jobDetails.isFeatured != true || this.jobDetails.status == 'DEACTIVATED' && statusvalue != 'DRAFTED' && this.util.formatDateddd(fdate1) == this.util.formatDateddd(sdatet2) && this.jobDetails.isFeatured != true || this.jobDetails.status == 'INACTIVE_DUE_TO_LOW_CREDITS' && statusvalue != 'DRAFTED' && this.jobDetails.isFeatured != true && untildate >= sdatet2) {
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
    // if (this.jobDetails.statusUpdatedOn != undefined) {
    //   let statusupdateddate = this.util.dateFormatestring(this.jobDetails.statusUpdatedOn);
    //   if (
    //     this.jobDetails.status == 'ON HOLD' && statusvalue != 'DRAFTED' && creditserverdate > statusupdateddate && this.jobDetails.isFeatured == true ||
    //     this.jobDetails.status == 'INACTIVE' && statusvalue != 'DRAFTED' && creditserverdate > statusupdateddate && this.jobDetails.isFeatured == true || this.jobDetails.status == 'DEACTIVATED' && statusvalue != 'DRAFTED' && this.util.formatDateddd(fdate1) == this.util.formatDateddd(sdatet2) && this.jobDetails.isFeatured == true || this.jobDetails.status == 'INACTIVE_DUE_TO_LOW_CREDITS' && statusvalue != 'DRAFTED' && this.jobDetails.isFeatured == true && untildate >= sdatet2) {
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
    // if (this.jobDetails.statusUpdatedOn == undefined || this.jobDetails.statusUpdatedOn == null) {


    //   if (this.jobDetails.status == 'AWAITING HOST' && statusvalue != 'DRAFTED' &&
    //     this.util.formatDateddd(fdate1) == this.util.formatDateddd(sdatet2) && this.jobDetails.isFeatured != true) {
    //     this.jobPostForm.patchValue({
    //       "consumptionType": element.creditType,
    //       "createdByUserType": localStorage.getItem('userType'),
    //       "points": element.points,
    //       "status": "ACTIVE"
    //     })
    //   }
    // } else {

    //   let statusupdateddate = this.util.dateFormatestring(this.jobDetails.statusUpdatedOn);


    //   if (this.jobDetails.status == 'AWAITING HOST' && statusvalue != 'DRAFTED' &&
    //     this.util.formatDateddd(fdate1) == this.util.formatDateddd(sdatet2)
    //     && this.jobDetails.isFeatured != true &&
    //     this.util.formatDateddd(creditserverdate) == this.util.formatDateddd(statusupdateddate)) {
    //     this.jobPostForm.patchValue({
    //       "consumptionType": element.creditType,
    //       "createdByUserType": localStorage.getItem('userType'),
    //       "points": 0,
    //       "status": "ACTIVE"
    //     })
    //   } else if (this.jobDetails.status == 'AWAITING HOST' && statusvalue != 'DRAFTED'
    //     && this.util.formatDateddd(fdate1) == this.util.formatDateddd(sdatet2) && this.jobDetails.isFeatured != true && creditserverdate > statusupdateddate) {
    //     this.jobPostForm.patchValue({
    //       "consumptionType": element.creditType,
    //       "createdByUserType": localStorage.getItem('userType'),
    //       "points": element.points,
    //       "status": "ACTIVE"
    //     })
    //   } else if (this.jobDetails.status == 'AWAITING HOST' && statusvalue != 'DRAFTED'
    //     && this.util.formatDateddd(fdate1) == this.util.formatDateddd(sdatet2) && this.jobDetails.isFeatured == true && creditserverdate > statusupdateddate) {
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


    //});
  }
  draftupdate(statusvalue) {
    this.jobPostForm.get("status").setValue(this.jobDetails.status);
    if (this.jobDetails.status == 'DRAFTED') {
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
          this.jobDetails.status;
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
        this.jobDetails.status;
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

  cancelJob() {
    this.submit = false;
    this.modalOpen = false;
    this.toggleOpen = false;
    if (this.jobDetails.status != 'ACTIVE') {
      $('#toogleBar').prop('checked', false);
    }
    this.jobPostForm.get("status").setValue(this.jobDetails.status);
    if (this.jobDetails.status == 'DRAFTED') {
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
      text: "You will lose the changes if you proceed. Are you sure you want to cancel the edit?",
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      allowOutsideClick: false,
      allowEscapeKey: false,
      cancelButtonText: 'No',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.modalOpen = false
        this.toggleOpen = false
        this.commonVariables.jobPostingFlag = false
        this.searchData.setCommonVariables(this.commonVariables)
        this.modalService.hide(1)
        this.jobPostForm.reset()
        this.primarySkillsSelected = [];
        this.secondarySkillsSelected = [];

      }
    });
  }

  async savejobafterValdaiton(statusvalue) {
    //let serverdate, effectiveDate;
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

    if (this.jobPostForm.value.status != "DRAFTED") {
      this.jobPostForm.get('status').patchValue('ACTIVE');

    }


    // if (this.jobPostForm.value.effectiveFor == "Custom") {
    //   this.jobPostForm.get('effectiveFor').patchValue(0);
    // } else {
    //   var assigneff = parseInt(this.jobPostForm.value.effectiveFor)
    //   this.jobPostForm.get('effectiveFor').patchValue(assigneff);
    // }
    let updateJobData: any = {};
    updateJobData = this.jobPostForm.getRawValue()
    // if (this.userType != 'JOB_SEEKER') {
    //   updateJobData.effectiveDate = this.util.formatDateddd(this.jobPostForm.value.effectiveDate);
    //   updateJobData.effectiveUntil = this.util.formatDateddd(this.jobPostForm.value.effectiveUntil);
    // } else {
    //   updateJobData.effectiveDate = new Date();
    //   updateJobData.effectiveUntil = new Date();
    // }
    const currentStatus: string = updateJobData.status;
    if (this.jobDetails.status != 'ACTIVE' && updateJobData.status == 'ACTIVE') {
      // let isJobOrCandidayeExpired: boolean = await this.pricePlanService.UPDATE_USERDETAILS("JOB_CANDIDATE_POSTINGS");
      const userData = await this.pricePlanService.UPDATE_USERDETAILS("JOB_CANDIDATE_POSTINGS");

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
        this.pricePlanService.expiredPopup("JOB_CANDIDATE_POSTINGS", "PAY", null, null, null, availablePoints, actualPoints, utilizedPoints, promotional);
        // this.pricePlanService.expiredPopup("JOB_CANDIDATE_POSTINGS");
        this.modalOpen = false;
        this.toggleOpen = false;
        return;
      }
    }
    // this.util.startLoader()
    this.api.updatePut('jobs/updateJob', updateJobData).subscribe(res => {
      // this.util.stopLoader();
      if (res.code == '00000') {
        this.disable_for_draft = false;
        this.toggleOpen = false;
        let jobResponse: any | {} = res.data.jobData;
        jobResponse.user = this.jobDetails.user;
        this.jobDetails = jobResponse;
        this.jobListing.emit(statusvalue === "ALL" ? "updateReload" : "reload")       //this.modalRef.hide()
        this.modalService.hide(1);
        this.modalService.hide(2);
        this.modalService.hide(3);
        if (res.data.status == 'ACTIVE') {
          res.data.jobData.status = true
        } else if (res.data.status == 'INACTIVE') {
          res.data.jobData.status = false
        }
        this.updateDate = [];
        Swal.fire({
          position: "center",
          icon: "success",
          title: super.getTextBasedOnStatus(currentStatus, currentStatus === GigsumoConstants.DRAFTED ? "Draft updated" : "Job updated"),
          showConfirmButton: false,
          timer: 2000,
        }).then(() => {
          this.commonVariables.jobPostingFlag = false
          this.searchData.setCommonVariables(this.commonVariables)
        })

        setTimeout(() => {
          // this.router.navigate(["newjobs"]);
          // this.searchData.setHighlighter('newjobs')
          // this.router.navigate(["jobs"]);
          // this.searchData.setHighlighter('jobs')
          this.primarySkillsSelected = [];
          this.secondarySkillsSelected = [];
          this.otherSelectedStates = []
        }, 2000);


        setTimeout(() => {
          this.submit = false
        }, 4000);
      }
    }, err => {
      // this.util.stopLoader();
    });
  }

  otherSelectedStates: any = []
  // closeJob() {
  //   this.primarySkillsSelected = [];
  //   this.secondarySkillsSelected = [];
  //   this.otherSelectedStates = []
  //   this.modalService.hide(1)
  // }


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
  //effectiveforList = []
  FormData: any;
  uploadFiles: Array<any> = [];
  recruiterTitleList: any = []
  engagementTypeList = []
  workAuthorizationList: any = []
  jobPostForm: UntypedFormGroup;
  freelancerInternalHireFlag: boolean = false
  onClientTypeChange(value) {


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

    // this.util.startLoader()
    // this.jobPostForm.patchValue({
    //   clientName: null,
    //   organisationId: null
    // })
    // this.clientNameList = []
    // this.clientNameList1.forEach(ele => {
    //   if (ele.clientType == value) {
    //     this.clientNameList.push(ele)
    //   }
    // })
    // this.util.stopLoader()
  }

  years: any = []
  Toyears: any = []
  generateYears() {
    this.years = []
    this.Toyears = []
    // var max = new Date().getFullYear();
    // var min = max - 80;
    this.years = []
    for (var i = 0; i <= 20; i++) {
      this.years.push(i);
    }
    for (var i = 1; i <= 20; i++) {
      this.Toyears.push(i);
    }
  }

  years2: any = []
  generateYears2() {
    // var max = new Date().getFullYear();
    // var min = max - 80;
    this.years2 = []
    for (var i = 0; i <= 20; i++) {
      this.years2.push(i);
    }
  }

  primarySkillsSelected = [];
  secondarySkillsSelected = [];
  stateListCA: any = []
  stateListIN: any = []
  stateListAU: any = []
  countryList: any = [];
  submit: boolean = false
  currentTime: any;
  maxDate: any
  getListValues(param) {
    this.clientTypeList = []
    this.payTypeList = []
    this.secondarySkillsList = []
    this.primarySkillsList = []
    this.skillsList = []
    this.periodList = []
    // this.effectiveforList = []
    this.recruiterTitleList = []
    this.totalExperienceList = []
    this.workAuthorizationList = []
    this.durationTypeList = []
    this.engagementTypeList = []
    if (this.jobClassificationList.length == 0) {
      // this.util.startLoader()
      var data: any = { "domain": "ENGAGEMENT_TYPE,CLIENT_TYPE,PAY_TYPE,DURATION,PRIMARY_SKILLS,WORK_AUTHORIZATION,CANDIDATE_AVAILABLITY,TOTAL_EXPERIENCE,SECONDARY_SKILLS,GIGSUMO_SKILLS_LIST,GIGSUMO_JOB_TITLE,GIGSUMO_RECRUITERS_TITLE_LIST,EFFECTIVE_FOR" }
      data.userId = localStorage.getItem("userId");
      this.api.create('listvalue/findbyList', data).subscribe(res => {
        if (res.code == '00000') {
          this.currentTime = new Date(res.data.currentTime);
          this.maxDate = new Date(this.currentTime);
          if (param == 'CANDIDATE') {
            this.usStatesList = []
            this.api
              .query("country/getAllStates?countryCode=US")
              .subscribe((res) => {
                if (res) {
                  // this.util.stopLoader();
                  res.forEach(ele => {
                    this.usStatesList.push(ele.stateName)
                    this.otherStatesList.push(ele.stateName)
                  })
                }
              }, err => {
                // this.util.stopLoader();
              })
          }
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
          // res.data.EFFECTIVE_FOR.listItems.forEach(ele => {
          //   this.effectiveforList.push(ele.item)
          //   var mySet = new Set(this.effectiveforList);
          //   this.effectiveforList = [...mySet]
          // })

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
    this.countryChosen = event
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



    // }
    if (event == "US") {
      this.selectedCountries = true
      const countryCode = event;
      // this.util.startLoader()
      this.workAuthorizationList = []
      this.api.query('listvalue/find?domain=WORK_AUTHORIZATION_US').subscribe(res => {
        if (res.code == '00000') {
          // this.util.stopLoader()
          res.data.listValues[0].listItems.forEach(ele => {
            this.workAuthorizationList.push(ele.item)
          })


          if (this.usStatesList.length == 0) {
            this.api
              .query("country/getAllStates?countryCode=" + countryCode)
              .subscribe((res) => {
                res.forEach(ele => {
                  this.usStatesList.push(ele.stateName)
                })
              }, err => {
                // this.util.stopLoader();
              });
            // }
          }
        }
      })

    } else if (event == "AU") {
      this.workAuthorizationList = []
      // this.util.startLoader()
      this.api.query('listvalue/find?domain=WORK_AUTHORIZATION_AU').subscribe(res => {
        if (res.code == '00000') {
          // this.util.stopLoader()
          res.data.listValues[0].listItems.forEach(ele => {
            this.workAuthorizationList.push(ele.item)
          })

          this.selectedCountries = true
          const countryCode = event;
          if (this.stateListAU.length == 0) {
            this.stateListAU = [];

            this.api
              .query("country/getAllStates?countryCode=" + countryCode)
              .subscribe((res) => {
                if (res && res.length > 0) {
                  this.jobPostForm.get('state').clearValidators();
                  this.jobPostForm.get('state').updateValueAndValidity();
                }
                this.stateListAU = res;
              }, err => {
                // this.util.stopLoader();
              });
          }
        }
      })

      // }
    } else if (event == "IN") {
      this.workAuthorizationList = []
      // this.util.startLoader()
      this.api.query('listvalue/find?domain=WORK_AUTHORIZATION_IN').subscribe(res => {
        if (res.code == '00000') {
          // this.util.stopLoader()
          res.data.listValues[0].listItems.forEach(ele => {
            this.workAuthorizationList.push(ele.item)
          })


          this.selectedCountries = true
          const countryCode = event;
          if (this.stateListIN.length == 0) {
            this.stateListIN = [];
            this.api
              .query("country/getAllStates?countryCode=" + countryCode)
              .subscribe((res) => {
                if (res && res.length > 0) {
                  this.jobPostForm.get('state').clearValidators();
                  this.jobPostForm.get('state').updateValueAndValidity();
                }
                this.stateListIN = res;
              }, err => {
                // this.util.stopLoader();
              });
          }
        }
      })

      // }
    } else if (event == "CA") {
      this.workAuthorizationList = []
      // this.util.startLoader()
      this.api.query('listvalue/find?domain=WORK_AUTHORIZATION_CA').subscribe(res => {
        if (res.code == '00000') {
          // this.util.stopLoader()
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
                // this.util.stopLoader();
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

  onTargetRateTyped(value) {
    this.typeTargetValue = value
    // if (this.selectedCountries == true) {
    //   if (value.length > this.figureLength) {
    //     this.jobPostForm.get('targetRate').setErrors({ notAcceptedValue: true })
    //   } else {
    //     this.jobPostForm.get('targetRate').setErrors({ notAcceptedValue: null })
    //     this.jobPostForm.get('targetRate').updateValueAndValidity({ emitEvent: false })
    //   }
    // }
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
      this.jobPostForm.get('duration').reset();
      this.jobPostForm.get('durationType').reset();
      this.jobPostForm.get('duration').disable();
      this.jobPostForm.get('durationType').disable();
    } else {
      this.jobPostForm.get('duration').enable()
      this.jobPostForm.get('durationType').enable()
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
    //       // console.log("res.data.businessModelList[0]")
    //       // console.log(res.data.businessModelList[0])
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
    //           zipCode: res.data.businessModelList[0].companyLocationDetails[0].zipCode
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


  candidateJobTitleList: any = []
  jobPostedBehalfOflist: any = []
  modalRef: BsModalRef;
  modalOpen: boolean = false;
  toggleOpen: boolean = false;
  otherStatesList: any = [];

  async editJob(postTemplate: TemplateRef<any>, content) {
    try {
      this.disable_for_draft = false;
      this.submit = false;
      this.updateDate = [];
      this.modalOpen = true;
      this.toggleOpen = true;
      this.ActivateContent = content;
      // this.util.startLoader();
      const [orgNamesResponse] = await Promise.all([
        this.api.query('business/check/orgname/' + this.userId).toPromise(),
        this.initiateJobForm(),
      ]);

      // this.util.stopLoader();
      if ((orgNamesResponse.code == '00000' || orgNamesResponse.code == '10008') &&
        orgNamesResponse.data.organisation.length !== 0) {
        this.jobPostedBehalfOflist = orgNamesResponse.data.organisation.map(ele => ele.organizationName);
      }

      this.currentTimeDate = new Date(this.currentTime);
      this.modalRef = this.modalService.show(postTemplate, this.backdropConfig);
      this.addSkills(this.jobDetails.primarySkills, this.primarySkillsSelected);
      this.addSkills(this.jobDetails.secondarySkills, this.secondarySkillsSelected);

      // if (this.jobDetails.otherPreferedStates != null && this.jobDetails.otherSelectedStates.length > 0) {
      this.addSkills(this.jobDetails.secondarySkills, this.secondarySkillsSelected);
      // }
      this.jobDetails.duration = this.jobDetails.duration === 0 ? null : this.jobDetails.duration;
      this.jobDetails.experienceFrom = this.jobDetails.experienceFrom === 0 ? null : this.jobDetails.experienceFrom;
      this.jobDetails.experienceTo = this.jobDetails.experienceTo === 0 ? null : this.jobDetails.experienceTo;
      this.onChangeCountry(this.jobDetails.country);
      setTimeout(() => {
        this.jobPostForm.patchValue(this.jobDetails);
      }, 1000);
      if (this.jobDetails.clientType == GigsumoConstants.DIRECT_HIRE && this.jobDetails.clientName != null) {
        this.jobPostForm.get('clientName').disable();
      }

      if (this.jobDetails.jobClassification == 'W2 - Full Time') {
        this.jobPostForm.get('duration').disable();
        this.jobPostForm.get('durationType').disable();
      }
    } catch (error) {
      console.error('Error in editJob:', error);
      // this.util.stopLoader();
    }
  }
  addSkills(sourceArray, targetArray) {
    sourceArray.forEach(ele => {
      targetArray.push(ele);
    });
  }


  getCountries() {
    this.countryList = [];
    // this.util.startLoader();
    this.api.query("country/getAllCountries").subscribe((res) => {
      // this.util.stopLoader();
      res.forEach((ele) => {
        this.countryList.push(ele);
      });
      // this.util.stopLoader();
    }, err => {
      // this.util.stopLoader();
    });
  }
  purchesCredits(buyCredit: TemplateRef<any>) {
    this.modalRef.hide();
    this.router.navigate(['checkout'])
    //this.modalRef = this.modalService.show(buyCredit, this.backdropConfig);
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
  // formatDates(date) {
  //   var d = new Date(date),
  //     month = '' + (d.getMonth() + 1),
  //     day = '' + d.getDate(),
  //     year = d.getFullYear();

  //   if (month.length < 2) {
  //     month = '0' + month;
  //   }
  //   if (day.length < 2) {
  //     day = '0' + day;

  //   }

  //   return [year, month, day].join('/');
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
  //       this.unit = { duration: "0" };
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
              //data.totalPoints = this.creditform.value.point;
              // this.util.startLoader();
            this.api.create("credits/buyCredits", data).subscribe(res => {
              // this.util.stopLoader();
              this.creditform.reset();
              this.modalRef.hide()
              this.showmodel = false;

              if (res.code == "00000") {
                Swal.fire({
                  icon: "success",
                  title: "Credit Added Successfully",
                  showDenyButton: false,
                  // confirmButtonText: `ok`,
                  showConfirmButton: false,

                  timer: 2000,

                })
                this.creditform.reset();


              }
            }, err => {
              // this.util.stopLoader();
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
  async initiateJobForm() {
    try {
      await Promise.all([
        this.getCountries(),
        this.getListValues('JOBS'),
        this.generateYears(),
        this.generateYears2()
      ]);
      this.jobPostForm = new AppSettings().getEditJobFormGroup();
    } catch (error) {
    }
  }

}
