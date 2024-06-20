import { Component, ElementRef, HostListener, Input, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { BehaviorSubject, Observable, Subject, Subscription } from "rxjs";
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { PricePlanService } from 'src/app/components/Price-subscritions/priceplanService';
import { countProvider } from 'src/app/components/suggestions/suggestions.component';
import { GigsumoConstants, USER_TYPE } from "src/app/services/GigsumoConstants";
import { ApiService } from "src/app/services/api.service";
import { CommonValues } from 'src/app/services/commonValues';
import { JobService } from "src/app/services/job.service";
import { JobModel } from "src/app/services/jobModel";
import { jobModuleConfig } from "src/app/services/jobModuleConfig";
import { PageType } from "src/app/services/pageTypes";
import { SearchData } from "src/app/services/searchData";
import { filterModel } from "src/app/services/userModel";
import { UtilService } from "src/app/services/util.service";
import { filterConfig } from "src/app/types/filterConfig";
import { CommunicationService } from "src/shared/services/CommunicationService";

declare var $: any;
@Component({
  selector: 'app-new-job',
  templateUrl: './new-job.component.html',
  styleUrls: ['./new-job.component.scss']
})
export class NewJobComponent implements OnInit, OnDestroy {
  filterApplied: boolean = false
  deactivatedJobs: Array<JobModel> = [];
  @Input() filterData: any;
  @Input() focus: string;
  modalRef: BsModalRef
  sendProfileData
  validTotalPoints: boolean
  totalCount
  listingCount = 0;
  valid: boolean = true;
  freelanceCount = 0;
  response = new BehaviorSubject<any>([]);
  searchObserver = new BehaviorSubject<string>("");
  dataPasstoSkillwidgets: Array<any> = [];
  @Input() screenName: any;
  jobsFoundStatus: any = "Fetching Jobs..."
  responseReceived: boolean = false;
  loadAPIcall: boolean = false;
  queryParamValues: any;
  userIdStorage = localStorage.getItem('userId')
  userType: any = localStorage.getItem('userType')
  highValue2: number;
  filterChanges: any;
  owner: boolean = false
  totalmsgcount: Subscription;
  totalmsgcounts: any;
  networkflag: boolean = false;
  entitySent: any = {}
  id: any;
  activeIds = ['1', '2', '3', '4'];
  uniqueColorClasses = [
    'fa fa-circle font-9 icon-prime-color',
    'fa fa-circle font-9 icon-red-color',
    'fa fa-circle font-9 icon-blue-color',
    'fa fa-circle font-9 icon-saffron-color',
    'fa fa-circle font-9 icon-green-color',
    'fa fa-circle font-9 icon-orange-color',
    'fa fa-circle font-9 icon-yellow-color'
  ];
  repetitions = 40;
  showSuggJobsDataServer: any = [];
  closeResult: string;
  messageData: any;
  isActivityWidgetShown: boolean = false;
  messagemodelflag: Boolean = false
  isScrollEnabled: boolean = true;
  showApplicantFilter: boolean = true;
  clientTypeCheckboxes = [
    { label: 'All', selected: false, disable: false },
    { label: 'Client', selected: false, disable: false },
    { label: 'Direct Client', selected: false, disable: false },
    { label: 'Direct Hire', selected: false, disable: false },
    { label: 'Systems Integrator', selected: false, disable: false },
    { label: 'Staffing Agency', selected: false, disable: false },
    { label: 'Prime Vendor', selected: false, disable: false },
    { label: 'Vendor', selected: false, disable: false },
    { label: 'Supplier', selected: false, disable: false },

  ];
  statusCheckboxes = [
    { label: 'All', selected: false, disable: false },
    { label: 'Draft', selected: false, disable: false },
    { label: 'Active', selected: false, disable: false },
    { label: 'On Hold', selected: false, disable: false },
    { label: 'Filled', selected: false, disable: false },
    { label: 'Closed', selected: false, disable: false },
    { label: 'Inactive', selected: false, disable: false },
    { label: 'Deactivated', selected: false, disable: false },
    // { label: 'Awaiting Post', selected: false, disable: false },

  ];


  jobclasscificationCheckboxes = [
    { label: 'All', selected: false, disable: false },
    { label: 'Corp To Corp', selected: false, disable: false },
    { label: 'W2 - Contract', selected: false, disable: false },
    { label: 'W2 - Full Time', selected: false, disable: false },
    { label: 'Part Time', selected: false, disable: false },
    { label: 'Freelance', selected: false, disable: false },
    { label: 'Internship', selected: false, disable: false },
    { label: 'Contract to Hire', selected: false, disable: false },
    { label: 'Direct Hire', selected: false, disable: false },
  ];
  noJobFound: boolean = false
  filterOn: boolean = false
  filterCount: number = 0
  typeOfInfiniteScroll: any;
  backdropConfig = {
    backdrop: true,
    ignoreBackdropClick: true,
    keyboard: false
  }
  data1: any = {};
  totalJobsCount: number;
  apiCount: number = 0
  experienceYearsFlag: boolean = false
  a: any;
  feaJ: boolean;
  daysApplied: boolean = false
  yearApplied: boolean = false
  removeTagvalues: any;
  value: number = 0;
  highValue: number = 0;
  options: any = {
    ceil: 20,
    floor: 0
  };
  value1: number = 0;
  highValue1: number = 0;
  options1: any = {
    floor: 0,
    ceil: 99
  };
  jobFilterForm: UntypedFormGroup
  isCollapsed = true;
  img: any;
  obj: any = {
    limit: 10,
    searchAfterKey: null,
    jobPostedBy: localStorage.getItem('userId')
  }
  previousSearchAfterKey = null;
  connectionJobs: boolean = false;
  data: any = {
    limit: 10,
    searchAfterKey: null,
    userId: localStorage.getItem('userId')
  }
  ischeckedJobSource: boolean = false
  ischeckedJobSourceAll: boolean = false
  ischeckedClientType: boolean = false
  ischeckedClientTypeAll: boolean = false
  ischeckedStatus: boolean = false
  jobSourceFlag: boolean = false
  clientTypeFlag: boolean = true
  activeStatus: boolean = null;
  statusFlag: boolean = false
  jobClassificationFlag: boolean = false
  workTypeFlag: boolean = false
  locationFlag: boolean = false
  experienceFlag: boolean = false
  ischeckedStatusAll: boolean = false
  creditexpiredflag: boolean = false
  getResume: boolean = false
  ischeckedJobClassification: boolean = false
  ischeckedJobClassificationAll: boolean = false
  ischeckedWorkType: boolean = false
  ischeckedWorkTypeAll: boolean = false
  jobSource: Array<any> = [];
  searchContent: string = null;
  responseReload = new Subject<any>();
  FeaSugg: boolean = false;
  jobSourceSearchRoute = null
  ScreenLoadBool: boolean = false
  subscription: Subscription;
  FilterSubscription: Subscription;
  jobSourceSelectNetRoute: any
  triggerapi = new BehaviorSubject("null")
  candidateFilter: boolean = false
  searchUserType: any
  availablePoints
  creditsConsume: any = 0;
  jobsData: Array<JobModel> = [];
  subsctiption: Subscription;
  isFilterOpen: boolean = false;
  stateListCA: any;
  stateListIN: any;
  stateListAU: any;
  countryList: any = [];
  isMyJobsShowedOnLoad: boolean = false;
  tabName: string;
  filterSubscriber: Subscription;
  panel: string;
  opendsideBar: boolean = false
  isCallFilter: boolean = false
  filterConfig: filterConfig;
  singlejobeView: boolean = false;
  singlejobeViewFromEyeIcon: boolean = false;
  jobModule: jobModuleConfig;
  jobPortfolioModule: jobModuleConfig;
  totalCountJob: number = 0;
  filterPayLoad: filterModel;
  jobId: any;
  candidateIdgetfromIntraction: any;
  fromContent: "SUGGESTED_JOBS" | "FEATURED_JOB" | "JOBS_FROM_CONNECTION" | "JOBS_FROM_PLATFORM" |
  "BUSINESS_JOBS" | "BUSINESS_CONNECTION_JOBS";
  routingvalue: Subscription;
  jobcreatReload: Subscription;
  newJobcreated: boolean = false;
  @ViewChild("widgetsticky") menuElement: ElementRef;
  afterJobCreated: boolean = false;
  reloadActivity: boolean = true;
  JOB_STATUS: string = "";
  networkType !: string;
  networkUserType !: string;
  isJobSeekerORBenchSales : boolean = false;

  constructor(
    private apiService: ApiService, private commonvalues: CommonValues,private searchData: SearchData,
    private formBuilder: UntypedFormBuilder, private activatedRoute: ActivatedRoute, private pricePlanService : PricePlanService,
    private pageType: PageType, private modalService: BsModalService, private countProvider : countProvider,
    private util: UtilService, private jobService: JobService,private communicationService: CommunicationService) {
    this.BaseresponseFilter();
    this.stopscrollFlag = false
    this.filterSubscriber = this.jobService.getSliderToggle().subscribe(value => {
      this.panel = value.panel;
      this.opendsideBar = value.value;
      this.entitySent.entity = value.panel;
      if (value.panel == 'jobs') {
        if (value.value == true) {
          this.openFilterSlider();
        } else {
          this.closeFilterSlider();
        }
      }
    });
    this.totalmsgcount = this.commonvalues.getmsgcountJob().subscribe((res) => {
      this.totalmsgcounts=res;
    });

    this.routingvalue = this.activatedRoute.queryParams.subscribe((res) => {

      // if we want to route from anywhere please use this
      if (res.jobId && res.tabName) {
        this.singlejobeView = true;
        this.jobId = res.jobId;
        this.candidateIdgetfromIntraction = res.candidateId;
        this.tabName = res.tabName;
        if (res.From) {
          this.singlejobeViewFromEyeIcon = true;
          this.fromContent = res.From;
        }
      }
      // after create job this flow will trigger
      else if (res.createJob) {
        this.afterJobCreated = true;
        this.JOB_STATUS = res.status;
      }
      // this flow will work when user route from network Card
      else if(res.networkName){
        this.networkflag = true;
        this.networkUserType = res.networkName;
        if(res.networkName === 'RECRUITER_NETWORK') {
          this.networkType = "recruiterNetworkJobs"
         }else if(res.networkName === 'MANAGEMENT_TALENT_ACQUISITION_NETWORK'){
          this.networkType = "mtaNetworkJobs"
         }else if(res.networkName === 'FREELANCE_RECRUITER_NETWORK'){
          this.networkType = "freeLancerNetworkJobs"
         }else if(res.networkName === 'JOB_SEEKER_NETWORK' || res.networkName === "BENCH_SALES_NETWORK"){
          this.isJobSeekerORBenchSales = true;
         }else if(res.networkName === 'OWNER'){
          this.networkType = "OWNER";
         }
      }
    });

  }

  async updateUserBenefits() {
    await this.pricePlanService.UPDATE_USERDETAILS("ACTIVE_INTERACTIONS");
    // console.log("PROVIDER_VALUE IS HEREREEEE " , this.countProvider.getBenefits());
  }

  getNetworkUserType(val : string) : USER_TYPE {
    if(val){

      switch (val) {
        case "MANAGEMENT_TALENT_ACQUISITION_NETWORK":
            return GigsumoConstants.MANAGEMENT_TALENT_ACQUISITION;
        case "FREELANCE_RECRUITER_NETWORK":
            return GigsumoConstants.FREELANCE_RECRUITER;
        case "RECRUITER_NETWORK":
            return GigsumoConstants.RECRUITER;
        case "JOB_SEEKER_NETWORK":
            return GigsumoConstants.JOB_SEEKER;
        case "BENCH_SALES_NETWORK":
            return GigsumoConstants.BENCH_RECRUITER;
        default:
          return "RECRUITER";
          break;
      }

    }
  }



  widgetstick: boolean = true
  suggestionStick: boolean = false
  @HostListener("window:scroll")
  handleScroll() {
    const windowScroll = window.pageYOffset;
    if (windowScroll >= 35) {
      this.suggestionStick = true;
    } else {
      this.suggestionStick = false;
    }
  }


  // Thiru changed code 02-01-2024
  ngOnDestroy(): void {
    if (this.FilterSubscription != undefined) {
      this.FilterSubscription.unsubscribe();
    }
    if (this.jobcreatReload != undefined) {
      this.jobcreatReload.unsubscribe();
    }
    if (this.routingvalue != undefined) {
      this.routingvalue.unsubscribe();
    }
  }

  diffcolourLabel() {
    let colurclass = [];
    for (let i = 0; i < this.repetitions; i++) {
      colurclass = colurclass.concat(this.uniqueColorClasses);
    }
  }

  keyarrayjobsouces = ["all", "myJobs", "allPlatFormJobs", "teamJobs", "recruiterNetworkJobs", "freeLancerNetworkJobs", "mtaNetworkJobs", "featured", "suggestedJobs"];


   ngOnInit() {

    if(!this.singlejobeViewFromEyeIcon){
      this.updateUserBenefits();
    }

    this.createjobFilterForm();
    this.updateJobFilterData();
    if (!this.singlejobeView) {
      this.RoleBasedFilter();
    } else {
      this.singlejobMethod()
    }

    this.updateJobModule();
    this.updateFilterPassing();
    this.updateJobPortfolioModule();


    // search filter

    this.searchObserver.pipe(
      distinctUntilChanged(),
      debounceTime(800),
    ).subscribe((res: string) => {
      if (res != "") {
        this.filterPayLoad.searchContent = res;
        this.filterPayLoad.searchAfterKey = null;
        this.filterapicall(res);
      }
      else if (res === null) {
        this.filterPayLoad.searchContent = "";
        this.filterPayLoad.searchAfterKey = null;
        this.filterapicall();
      }


    });
  }


  onMouseEnter() {
    const scrollableElement = document.getElementById('widget-flex-item');
    scrollableElement.classList.add('show-scrollbar')
  }

  onMouseLeave() {
    const scrollableElement = document.getElementById('widget-flex-item');
    scrollableElement.classList.remove('show-scrollbar')
  }

  singlejobMethod() {
    this.findByJobId(this.jobId);
  }

  filterReset(data) {
    if (data.pageName == 'job-applicants' || data.pageName == 'candidates-invited' || data.pageName == 'candidate-applied') {
      this.showApplicantFilter = true;
    } else {
      this.showApplicantFilter = false;

    }

  }

  removeCandidate(data) {

    this.candidateIdgetfromIntraction = undefined;
  }

  createjobFilterForm() {
    this.jobFilterForm = this.formBuilder.group({
      source: this.formBuilder.array([]),
      workType: this.formBuilder.array([]),
      jobClassification: null,
      clientType: null,
      status: null,
      userId: localStorage.getItem('userId'),
      country: null,
      state: null,
      city: null,
      zipCode: null,
      experienceFrom: null,
      experienceTo: null,
      postedFrom: null,
      postedTo: null,
      postedDayRange: 'Any (Days)',
      experienceType: 'Any (Years)',
      organisationTypeParams: this.formBuilder.group({
        all: false,
        owner: false,
        systemsIntergrator: false,
        primeVendor: false,
        vendorStaffingAgency: false
      })

    })

    this.jobsoucefilterFrom();
    this.worktypefilterFrompush();
  }

  get jobSourcesFormarray() {
    return this.jobFilterForm.get('source') as UntypedFormArray;
  }

  jobsoucefilterFrom() {
    this.jobSourcesFormarray.push(this.jobSourcefields())
  }


  jobSourcefields(): UntypedFormGroup {
    return this.formBuilder.group({
      all: false,
      allPlatFormJobs: false,
      myJobs: false,
      teamJobs: false,
      recruiterNetworkJobs: false,
      freeLancerNetworkJobs: false,
      mtaNetworkJobs: false,
      featured: false,
      suggestedJobs: false

    });
  }

  worktypefilterFrom(): UntypedFormGroup {
    return this.formBuilder.group({
      all: false,
      remoteWork: false,
      relocationRequired: false,
      workFromHome: false
    });
  }

  worktypefilterFrompush() {
    this.workTypeFormarray.push(this.worktypefilterFrom())
  }

  get workTypeFormarray() {
    return this.jobFilterForm.get('workType') as UntypedFormArray;
  }

  getOwnerNetwork(userType : USER_TYPE) : Array<string> {

    const arr = ['recruiterNetworkJobs' , 'freeLancerNetworkJobs' ,
    "mtaNetworkJobs"  , "myJobs"];

    if(this.isBenchorJob(userType)){
      arr.splice(arr.length - 1 , 1);
    }

    return arr;
  }


  updateJobFilterData() {

    const userType = localStorage.getItem('userType') as USER_TYPE;

    // patching source values when user route from NetWorkCard
    if(this.networkflag && this.networkType!="OWNER"){
      this.patchJobSourceTrue(this.networkType);
    } else if (this.networkType === "OWNER"){
      this.patchJobSourceasArr(this.getOwnerNetwork(userType), true);
    }

    if (this.isMTAorFREEorBENCHandJOB(userType)) {

      // after creating job
      if (this.afterJobCreated) {
        this.afterJobCreated = userType === (GigsumoConstants.BENCH_RECRUITER || GigsumoConstants.JOB_SEEKER) ? false : true;
      }

      if (this.singlejobeView) {

        if (this.singlejobeViewFromEyeIcon) {
          let filterName: Array<string> = this.updateFilterIfuserFromRouting();
          this.setDefaultFilter(filterName, true);
          this.searchData.setHighlighter('newJobs');
          return;
        }

      }

      if(this.isMTAorFREE(userType)){
        const {activeJobsCount} = this.countProvider.getBenefits();

        this.setDefaultFilter(activeJobsCount > 0 ? "myJobs" : "allPlatFormJobs");
      }
      else{
        this.setDefaultFilter("allPlatFormJobs");
      }

    }
    else if (this.isRecruiter(userType)) {

      // only triggered when user route from business jobs
      if (this.fromContent === "BUSINESS_CONNECTION_JOBS" || this.fromContent === "BUSINESS_JOBS") {

        if (this.singlejobeViewFromEyeIcon) {
          let filterName: Array<string> = this.updateFilterIfuserFromRouting();
          this.setDefaultFilter(filterName, true);
          this.searchData.setHighlighter('newJobs');
          return;
        }

      }


      this.setDefaultFilter("myJobs");
    }

  }

  updateFilterIfuserFromRouting(): string[] {
    this.clearJobSourceControl();
    switch (this.fromContent) {
      case "SUGGESTED_JOBS":
        this.patchJobSourceTrue('suggestedJobs');
        return ["suggestedJobs"];
      case "FEATURED_JOB":
        this.patchJobSourceTrue('featured');
        return ["featured"];
      case "JOBS_FROM_PLATFORM":
        this.patchJobSourceTrue('allPlatFormJobs');
        return ["featured"];
      case "BUSINESS_CONNECTION_JOBS":
        const arr =['recruiterNetworkJobs' , 'freeLancerNetworkJobs' , 'mtaNetworkJobs' , 'featured' , 'suggestedJobs'];
        this.patchJobSourceasArr(arr , true);
        return arr;
      case "BUSINESS_JOBS":
        this.patchJobSourceTrue('myJobs');
        return ['myJobs']
      case "JOBS_FROM_CONNECTION":
        this.patchJobSourceTrue('recruiterNetworkJobs');
        this.patchJobSourceTrue('freeLancerNetworkJobs');
        this.patchJobSourceTrue('mtaNetworkJobs');
        return ["recruiterNetworkJobs", "freeLancerNetworkJobs", "mtaNetworkJobs"];
      default:
        break;
    }

  }


  patchJobSourceTrue(key: string) {
    this.getSource().at(0).get(key).patchValue(true);
  }

  patchJobSourceasArr(arr : Array<string> , value : boolean) {
    for(const key of arr){
      this.getSource().at(0).get(key).patchValue(value);
    }
  }

  patchJobSourceFalse(key: string) {
    this.getSource().at(0).get(key).patchValue(false);
  }

  clearJobSourceControl() {
    for (const key of this.keyarrayjobsouces) {
      this.getSource().at(0).get(key).patchValue(false);
    }
  }

  setDefaultFilter(value: string | Array<string>, fromRoute: boolean = false) {
    if (value) {
      const userType = localStorage.getItem('userType') as USER_TYPE;

      const isOwner: boolean = ((fromRoute ? value.includes('myJobs') : value === 'myJobs') ||
        (!fromRoute && value === 'myJobs' && !this.isBenchorJob(userType)));

      if (fromRoute) {
        this.jobSource = value as Array<string>;
      }
      else if (!fromRoute) {
        this.getSource().at(0).get(value).patchValue(true);
        this.jobSource.push(value);
      }


      if (this.statusCheckboxes && isOwner) {
        this.statusCheckboxes[(this.JOB_STATUS != 'DRAFTED' ? 2 : 1)].selected = true;
        this.jobSource.push(this.JOB_STATUS != 'DRAFTED' ? 'Active' : "Draft");
      }

      // if userType was bench / freelancer / MTA uncheck the platform jobs when he was routed from network card
      if(this.networkflag){

        if(this.isMTAorFREEorBENCHandJOB(userType)){

          // if MTA / FREE do this function
          if(!this.isBenchorJob(userType)){

            if((this.networkType === "freeLancerNetworkJobs" && userType === GigsumoConstants.FREELANCE_RECRUITER)
               || (this.networkType === "mtaNetworkJobs" && userType  === GigsumoConstants.MANAGEMENT_TALENT_ACQUISITION)){
              this.patchJobSourceTrue('myJobs');
            }
          }

          // this is apply for all 3 type
          this.patchJobSourceFalse('allPlatFormJobs');
        }
        else if(this.isRecruiter(userType)){

          // if user is REC but he clicking the FREE or MTA networkCard uncheck the myJobs
          if(this.networkType === "freeLancerNetworkJobs" || this.networkType === "mtaNetworkJobs"){
            this.patchJobSourceFalse("myJobs")
          }

        }

      }


      this.tempFilterChanges = {};
      this.tempFilterChanges = {
        formData: this.jobFilterForm.getRawValue(),
        checkedItems: this.jobSource,
        statusCheckedItems: this.statusCheckboxes,
        clientTypeCheckedItems: this.clientTypeCheckboxes,
        jobClassifications: this.jobclasscificationCheckboxes
      };
      this.filterPayLoad.source = this.getSource().at(0).value;
      this.filterPayLoad.status = isOwner ? this.JOB_STATUS != 'DRAFTED' ? ['Active'] : ["Draft"] : [];
      this.filterPayLoad.searchAfterKey = null;
    }

  }

  getSource(): UntypedFormArray {
    return this.jobFilterForm.get('source') as UntypedFormArray;
  }

  isRecruiter(userType: USER_TYPE): boolean {
    return (userType === GigsumoConstants.RECRUITER);
  }

  isBenchorJob(userType: USER_TYPE): boolean {
    return (userType === GigsumoConstants.JOB_SEEKER ||
      userType === GigsumoConstants.BENCH_RECRUITER);
  }

  isMTAorFREE(userType: USER_TYPE): boolean {
    return (userType === GigsumoConstants.MANAGEMENT_TALENT_ACQUISITION ||
      userType === GigsumoConstants.FREELANCE_RECRUITER);
  }

  isMTAorFREEorBENCHandJOB(userType: USER_TYPE): boolean {
    return (userType === GigsumoConstants.MANAGEMENT_TALENT_ACQUISITION
      || userType === GigsumoConstants.FREELANCE_RECRUITER || userType === GigsumoConstants.BENCH_RECRUITER
      || userType === GigsumoConstants.JOB_SEEKER);
  }


  RoleBasedFilter() {
    this.diffcolourLabel();
    // console.log("1 job Filter form" , this.jobFilterForm.getRawValue());
    // this.userType = localStorage.getItem('userType');
    // const isRecruiter = this.userType === 'RECRUITER';
    // const isFreelanceOrManagement = this.userType === 'FREELANCE_RECRUITER' || this.userType === 'MANAGEMENT_TALENT_ACQUISITION';
     // if (this.owner && this.isMyJobsShowedOnLoad) {
    //   this.updateJobSourceAndFilter('myJobs');
    // } else {
    //   this.updateJobSourceAndFilter('allPlatFormJobs');
    // }

    this.filterapicall();

  }

  checkingnewlyjobcreated() {
    if (this.newJobcreated) {
      this.filterPayLoad.status = ['Active'];
      this.newJobcreated = false;
    }
  }


  findByJobId(jobId: any) {
    this.jobDetailsTabName = this.tabName;
    this.filterapicall();
  }



  prepareFilterPayload() {
    this.filterPayLoad = { ...this.filterPayLoad, searchAfterKey: null };
    // this.response.next([]);
    this.previousSearchAfterKey = null;
    this.obj.searchAfterKey = null;
    this.stopscrollFlag = false;
    // console.log("after prepearefilter " , this.filterPayLoad);

  }

  updateJobSourceAndFilter(jobSourceType) {
    this.filterPayLoad.source[jobSourceType] = true;
    this.jobSource.push(jobSourceType);
    this.jobSource = [...new Set(this.jobSource)];
  }


  BaseresponseFilter() {
    this.filterPayLoad = {
      "source": {
        "all": false,
        "allPlatFormJobs": false,
        "myJobs": false,
        "teamJobs": false,
        "recruiterNetworkJobs": false,
        "freeLancerNetworkJobs": false,
        "mtaNetworkJobs": false,
        "featured": false,
        "suggestedJobs": false
      },
      "searchAfterKey": null,
      "workType": {
        "all": false,
        "remoteWork": false,
        "relocationRequired": false,
        "workFromHome": false
      },
      "experienceFrom": null,
      "experienceTo": null,
      "postedFrom": null,
      "postedTo": null,
      "country": null,
      "state": null,
      "city": null,
      "zipCode": null,
      "limit": 10,
      "userId": localStorage.getItem('userId'),
      "jobClassification": [],
      "clientType": [],
      "status": [],
      "searchContent": "",
      "jobsToFilter": this.jobId,
      "organisationTypeParams": {
        "owner": false,
        "systemsIntergrator": false,
        "vendorStaffingAgency": false,
        "primeVendor": false,
      }
    };
  }
  closeCandidateSupplyModal() {
    this.modalService.hide(1);
  }

  InvitetoApplyFilter() {
    if (this.screenName != undefined && this.screenName === 'invite-job-listing') {
      this.BaseresponseFilter();
      for (let key in this.filterPayLoad.source) {
        if (key == 'myJobs') {
          this.filterPayLoad.source.myJobs = true;
          this.filterPayLoad.status = ['Active'];
        } else {
          this.filterPayLoad.source[key] = false;
        }
      }
    }
  }




  API_NAME: string = 'jobs/filter';
  SUCCESS_CODE: string = GigsumoConstants.SUCESSCODE;
  filterapicall(searchContent: string = null) {
    this.checkingnewlyjobcreated();

    if (!this.singlejobeView) {
      this.InvitetoApplyFilter();
    }

    if (this.screenName === "invite-job-listing") {
      this.filterPayLoad.candidateId = this.filterData.candidateId;
    }
    // this.util.startLoader();

    if (this.singlejobeView) {
      this.filterPayLoad.jobsToFilter = this.jobId;
    }

    this.loadAPIcall=true;
    this.commonvalues.changeData(true);

    if(this.filterPayLoad.searchAfterKey === null){
       this.response.next([]);
     }
    this.FilterSubscription = this.apiService.create(this.API_NAME, this.filterPayLoad)
      .subscribe(
        res => this.handleResponse(res, searchContent),
        err => this.handleError(err)
      );
  }

  // API success response
  handleResponse(res, searchContent: string) {
    this.loadAPIcall=false;
    this.commonvalues.changeData(false);

    // this.util.stopLoader();
    localStorage.setItem('jobForm', JSON.stringify(this.filterPayLoad));
    if (res.code === this.SUCCESS_CODE) {
      this.JobsListdata(res.data, searchContent);
    }
  }

  // API error response
  handleError(err) {
    this.util.stopLoader();
    this.loadAPIcall=false
    this.commonvalues.changeData(false);
    // console.error('Filter API Error:', err);
  }

  filterFuctionCompleted = new Subject<boolean>();
  // Job List datas
  JobsListdata(data, searchContent: string) {

    let content = this.filterPayLoad.searchContent;

    // Check if the search conditions are met
    if (this.filterPayLoad.searchAfterKey === null ||
      (content != null && searchContent != null && (content && content.trim()) === (searchContent && searchContent.trim()) && searchContent.length > 0)) {
      this.stopscrollFlag = false;
      this.response.next([]);
    }

    // If new job list is received
    if (data.jobList.length > 0) {
      const currentData = this.response.getValue();
      const combinedResponse = [...currentData, ...data.jobList];

      // Mark selected jobs
      this.dataPasstoSkillwidgets.forEach(parent => {
        combinedResponse.forEach((child, i) => {
          if (parent.jobId == child.jobId) {
            combinedResponse[i].isSelected = true;
          }
        });
      });

      // Update response
      this.response.next(combinedResponse);

      // If selectedJobData is not set or if it's no longer in the list, keep the same selected job
      if (this.filterPayLoad.searchAfterKey === null && combinedResponse.length > 0) {
        this.selectedJobData = combinedResponse[0];
      }



    } else if (this.response.getValue().length == 0) {
      // If job list is empty
      this.totalCountJob = 0;
      this.CandidateAcvityData = null;
      this.selectedJobData = null;
    }

    // Update searchAfterKey
    this.filterPayLoad.searchAfterKey = data.searchAfterKey;

    // Update total job count
    if (data.totalJobsCount !== undefined || data.totalJobsCount === 0) {
      this.totalCountJob = data.totalJobsCount;
    }

    // Check for empty job list
    this.checkForEmptyJobList(data.jobList, data.searchAfterKey);
  }



  // Label msg set .
  checkForEmptyJobList(jobList, searchAfterKey) {
    if (jobList && jobList.length === 0) {
      this.stopscrollFlag = true;
      this.jobsFoundStatus = "Couldn't find any jobs for the applied filters.";
    } else {
      this.jobsFoundStatus = "Fetching Jobs...";
      this.stopscrollFlag = false;
      this.checkSearchAfterKey(searchAfterKey);
    }
  }

  checkSearchAfterKey(searchAfterKey) {
    if (searchAfterKey && searchAfterKey[1] != null) {
      this.previousSearchAfterKey = searchAfterKey[1];
      if (searchAfterKey[1] < 0) {
        this.stopscrollFlag = true;
      }
    }
  }



  onFilterToggle(value: any) {
    this.filterApplied = false;
    this.stopscrollFlag = false;
    if (this.panel === 'jobs') {
      if (value === "reset") {
        this.resetFilternew();
        return;
      }
      // console.log("data from vertical filter  " , value);

      // const receivedData = JSON.parse(value);
      //  this.filterPayLoad = receivedData.jobForm;
      // this.filterPayLoad = receivedData.jobForm;
      this.afterFilterPrepareForm()
    } else if (this.panel == 'job applicants') {
      this.jobService.setSliderToggle(false, this.panel, value);
    } else if (this.panel == 'candidates invited') {
      this.jobService.setSliderToggle(false, this.panel, value);
    }
  }

  // Sidebar filter API call
  afterFilterPrepareForm() {
    this.ScreenLoadBool = true;
    const { formData: { source, workType, ...rest } } = this.tempFilterChanges;
    this.filterPayLoad = {
      searchContent: this.filterPayLoad.searchContent,
      ...rest,
      source: source[0],
      workType: workType[0]
    }
    this.filterPayLoad.searchAfterKey = null;
    this.filterPayLoad.userId = localStorage.getItem('userId');
    this.filterPayLoad.jobClassification = this.jobclasscificationCheckboxes.filter(element => element.selected).map(element => element.label);
    this.filterPayLoad.clientType = this.clientTypeCheckboxes.filter(element => element.selected).map(element => element.label);
    this.filterPayLoad.status = this.statusCheckboxes.filter(element => element.selected).map(element => element.label);
    this.filterapicall();
  }

  initializePayload(data) {
    this.filterPayLoad = { ...data, searchAfterKey: null };
    this.previousSearchAfterKey = null;
    this.obj.searchAfterKey = null;
    this.stopscrollFlag = false;
  }

  updateCheckboxes(data, key, checkboxes) {
    data[key].forEach(res => {
      checkboxes.forEach(item => {
        if (item.label === res) {
          item.selected = true;
          this.jobSource.push(res);
        }
      });
    });
  }

  updateSourceWorkType(data, type) {
    if (type == 'source') {
      for (let key in data) {
        if (key != "all" && data[key] == true) {
          this.jobSource.push(key);
        }
      }
    } else if (type == 'workType') {
      for (let key in data) {
        if (key != "all" && data[key] === true) {
          this.jobSource.push(key);
        }
      }
    }
  }


  resetFilternew() {
    this.value = 0;
    this.highValue = 0;
    this.value1 = 0;
    this.highValue1 = 0;
    this.previousSearchAfterKey = null;
    this.filterPayLoad.searchAfterKey = null;
    this.jobSource = [];
    this.jobFilterForm.reset();
    this.jobFilterForm.get('experienceType').patchValue('Any (Years)');
    this.jobFilterForm.get('postedDayRange').patchValue('Any (Days)');
    this.statusCheckboxes = this.resetStatusCheckBox();
    this.clientTypeCheckboxes = this.resetClientTypeCheckBox();
    this.jobclasscificationCheckboxes = this.resetEngagementTypeCheckBox();
    // this.filterPayLoad.- = [];
    // this.filterPayLoad.status = [];
    // this.filterPayLoad.clientType = [];
    this.BaseresponseFilter()
    this.updateJobFilterData();
    this.filterapicall();
    this.clearFilterselectedcount()

  }

  clearFilterselectedcount(){
    this.communicationService.triggerMethod('jobs');
  }

  resetStatusCheckBox(): Array<any> {
    return this.statusCheckboxes.map((val: any) => {
      val.selected = false
      return val;
    });
  }

  resetClientTypeCheckBox(): Array<any> {
    return this.clientTypeCheckboxes.map((val: any) => {
      val.selected = false
      return val;
    });
  }

  resetEngagementTypeCheckBox(): Array<any> {
    return this.jobclasscificationCheckboxes.map((val: any) => {
      val.selected = false
      return val;
    });
  }



  cleanJobSource() {
    this.jobSource = [...new Set(this.jobSource)].filter((ele: any) => ele.toLowerCase() !== 'all');
  }

  updateExperienceValues(data) {
    this.value = data.experienceFrom != null ? data.experienceFrom : 0;
    this.highValue = data.experienceTo != null ? data.experienceTo : 0;
    this.value1 = data.postedFrom != null ? data.postedFrom : 0;
    this.highValue1 = data.postedTo != null ? data.postedTo : 0;
  }

  resetFilterPayload(data) {
    this.filterPayLoad = data;
    this.filterPayLoad.searchAfterKey = null;
    this.previousSearchAfterKey = null;
    this.obj.searchAfterKey = null;
    this.stopscrollFlag = false;
  }


  // Remove selected filter

  removeEntity(value, index) {
    this.jobSource.splice(index, 1);

    Object.keys(this.filterPayLoad.source).forEach((key: any) => {
      if (key === value) {
        this.filterPayLoad.source[key] = false;
      }
      if (this.jobSource.includes(key)) {
        this.filterPayLoad.source[key] = true;
      }
    });

    this.clientTypeCheckboxes.forEach(element => {
      if (element.selected && element.label == value) {
        element.selected = false;
        this.clientTypeCheckboxes[0].selected = false
      }
    });

    this.statusCheckboxes.forEach(element => {
      if (element.selected && element.label == value) {
        element.selected = false;
        this.statusCheckboxes[0].selected = false
      }
    });

    this.jobclasscificationCheckboxes.forEach(element => {
      if (element.selected && element.label == value) {
        element.selected = false;
        this.jobclasscificationCheckboxes[0].selected = false
      }
    });

    this.filterPayLoad.jobClassification = this.jobclasscificationCheckboxes.filter(element => element.selected).map(element => element.label);
    this.filterPayLoad.clientType = this.clientTypeCheckboxes.filter(element => element.selected).map(element => element.label);
    this.filterPayLoad.status = this.statusCheckboxes.filter(element => element.selected).map(element => element.label);

    this.filterPayLoad.searchAfterKey = null;
    this.stopscrollFlag = false;

    let deletingData: any = {}
    deletingData.value = value;
    deletingData.index = index;
    this.jobService.setDataForFilter(deletingData);
    this.filterapicall();
  }


  stopscrollFlag: boolean = false
  onScrollDown() {
    if (!this.stopscrollFlag) {
      this.filterapicall();
    }


  }


  CandidateAcvityData: any = {
    call: false
  };

  updatetocandidateActivity(data) {
    data.refereshDatas = new Date();
    data.call = true;
    this.CandidateAcvityData = data;
    if (!data.isSelected) {
      this.CandidateAcvityData = { ...this.CandidateAcvityData };
    }

  }

  getchildData(data) {
    if (data != null) {
      this.dataPasstoSkillwidgets = JSON.parse(data);
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
    const responseData: Array<any> = this.response.getValue();

    responseData.forEach(element => {
      if (element.jobId == data.jobId) {
        element.isSelected = false;
      }
    });

    this.response.next(responseData);

    this.dataPasstoSkillwidgets.forEach(element => {
      if (element.jobId == data.jobId) {
        element.isSelected = false;
      }
    });
  }

  reloadJobData(value: string) {
    this.reloadProcess(value);
  }


  reloadProcess(value : string){
    this.filterPayLoad.searchAfterKey = null;

    if(value === 'updateReload'){
      this.filterPayLoad.status = ['Active'];
      this.statusCheckboxes.forEach(val=> val.selected = false);
      this.statusCheckboxes.find(val=> val.label === "Active").selected = true;;
      // update only the status without affecting the existing changes
      this.tempFilterChanges = {
        ...this.tempFilterChanges ,
        statusCheckedItems: this.statusCheckboxes,
      }
    }

    this.filterapicall();
  }


  emitReceived(value: any) {
    const currentData = this.response.getValue();
    if (value.jobId == currentData.jobId) {
      currentData[value.index] = { ...currentData[value.index], status: currentData.status }
    }
  }

  getdatafromjob(data: any) {
    data.userId = localStorage.getItem('userId')
    data.pageNumber = 0;
    data.limit = 10;
    this.apiService.create("candidates/findSuggestedCandidates", data).subscribe((res) => {
      this.util.stopLoader();
      res.componentName = 'SuggestedCandidateComponent';
      this.showSuggJobsDataServer = res;
      this.pageType.setsuggjob(res)
    })
  }


  getPanelValue(value: any) {
    this.panel = value;
  }

  searchfilter(val: string) {
    this.searchObserver.next(val === "" ? null : val);
  }


  get searchApiCall(): Observable<any> {
    return this.searchObserver.asObservable();
  }


  // prasanaa  changed code
  jobDetailsTabName: string = "job-details";
  selectedJobData: JobModel;
  selectedJobData_fromView: JobModel;
  updateJobModule() {

    let module = new jobModuleConfig(this.updateJobDetails);
    module.tabName = "job-details";
    module.source = this;
    this.jobModule = module;
  }

  updateJobDetails(data: any, content: any) {
    if (content.for === "JOB_DETAIL") {
      this.selectedJobData = { ...data };
      this.selectedJobData.call = false;
      this.jobDetailsTabName = "job-details";
    }
    else if (content.for === "TAB_ROUTE") {
      this.jobDetailsTabName = data;
      let datas = content.value;
      if (this.isParenActivity(data)) {
        datas.call = true;
      }else{
        datas.call=false;
      }
      this.selectedJobData = { ...datas };

    }

  }


  isParenActivity(data: string): boolean {
    return data === 'job-applicants' || data === 'candidate-applied' || data === 'candidates-invited'
  }

  updateJobPortfolioModule() {
    let module = new jobModuleConfig(this.updateJobPortfolioDetails);
    module.tabName = "job-details";
    module.source = this;
    this.jobPortfolioModule = module;
  }

  onStatuChange(value : any) {
    this.reloadProcess(value);
  }

  sortDateByNormalJobs(val: any) {
    let sortedDate = val.sort((a, b) => { return <any>new Date(b.updatedOn) - <any>new Date(a.updatedOn); })
    this.response.next(this.sortFeature(sortedDate));
  }

  sortFeature(data) {
    return data.sort((a, b) => {
      return b.isFeatured - a.isFeatured;
    });
  }

  updateJobPortfolioDetails(data: string) {
    this.jobDetailsTabName = data;
    if (!this.isParenActivity(data)) {
      this.selectedJobData = { ...this.selectedJobData };
      this.selectedJobData.call = false;
    }else{
      this.selectedJobData = { ...this.selectedJobData };
    }
  }


  tempFilterChanges: any;
  jobFilterData(data: any) {
    if (data != null && data.from === 'HORIZANTAL') {
      this.tempFilterChanges = data;
      this.clientTypeCheckboxes = data.clientTypeCheckedItems;
      this.statusCheckboxes = data.statusCheckedItems;
      this.jobclasscificationCheckboxes = data.jobClassifications;
      this.jobSource = [...new Set(data.checkedItems)];
      this.updateFilterData();
    }
    else if (data != null && data.from === 'VERTICAL') {
      this.tempFilterChanges = data;
      this.clientTypeCheckboxes = data.clientTypeCheckedItems;
      this.statusCheckboxes = data.statusCheckedItems;
      this.jobclasscificationCheckboxes = data.jobClassifications;
      this.jobSource = [];
      this.jobSource = [...new Set(data.checkedItems)];
    }



  }


  // updateFilterData() {
  //   this.filterPayLoad.jobClassification = this.jobclasscificationCheckboxes.filter(element => element.selected).map(element => element.label);
  //   this.filterPayLoad.clientType = this.clientTypeCheckboxes.filter(element => element.selected).map(element => element.label);
  //   this.filterPayLoad.status = this.statusCheckboxes.filter(element => element.selected).map(element => element.label);
  //   this.filterapicall();
  // }
  updateFilterData() {
    const { formData: { source, workType, ...rest } } = this.tempFilterChanges;
    this.filterPayLoad = {
      ...rest,
      searchContent: this.filterPayLoad.searchContent,
      source: source[0],
      workType: workType[0]
    }
    this.filterPayLoad.searchAfterKey = null;
    this.filterPayLoad.userId = localStorage.getItem('userId');
    this.filterPayLoad.jobClassification = this.jobclasscificationCheckboxes.filter(element => element.selected).map(element => element.label);
    this.filterPayLoad.clientType = this.clientTypeCheckboxes.filter(element => element.selected).map(element => element.label);
    this.filterPayLoad.status = this.statusCheckboxes.filter(element => element.selected).map(element => element.label);



    this.filterapicall();
  }


  openFilterSlider() {
    if (!this.isFilterOpen) {
      this.filterChanges = this.tempFilterChanges;
      this.isFilterOpen = true;
      this.jobService.setSliderToggle(true, 'jobs', null);
    }
  }

  closeFilterSlider() {
    if (this.isFilterOpen) {
      this.isFilterOpen = false;
      this.jobService.setSliderToggle(false, 'jobs', null);
    }
  }



  // chat function

  chatbottom() {
    let seletedItem: any = {};
    // this._socket.ngOnDestroy();
    // this._socket.connections();
    seletedItem.owner = true;
    this.messagemodelflag = true;
    seletedItem.userId = localStorage.getItem('userId');
    this.messageData = [];
    seletedItem.groupType = "JOB";
    seletedItem.messageType = "JOB";
    seletedItem.id = null;
    this.messageData = seletedItem;


  }

  closeMessage(event) {
    this.messagemodelflag = false;
    // this._socket.ngOnDestroy();
    // this._socket.connections_stream();
  }

  streamReloadApicallJobs() {
    let data: any = JSON.parse(localStorage.getItem('jobForm'));
    data.searchAfterKey = null;
    this.filterPayLoad = data;
    this.stopscrollFlag = false
    this.response.next([]);
    this.obj.searchAfterKey = null;
    this.previousSearchAfterKey = null;
    this.filterPayLoad.searchAfterKey = null;
    this.filterapicall();
  }

  updateFilterPassing() {
    let revokeBtn: filterConfig = new filterConfig(this.jobFilterData);
    revokeBtn.source = this;
    this.filterConfig = revokeBtn;
  }

}
