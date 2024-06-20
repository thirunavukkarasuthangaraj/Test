 import { Component, ElementRef, HostListener, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BsModalRef, BsModalService, } from 'ngx-bootstrap/modal';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { PricePlanService } from 'src/app/components/Price-subscritions/priceplanService';
import { countProvider } from 'src/app/components/suggestions/suggestions.component';
import { GigsumoConstants, USER_TYPE } from 'src/app/services/GigsumoConstants';
import { ApiService } from 'src/app/services/api.service';
import { candidateModel } from 'src/app/services/candidateModel';
import { JobService } from 'src/app/services/job.service';
import { jobModuleConfig } from 'src/app/services/jobModuleConfig';
import { PageType } from 'src/app/services/pageTypes';
import { SearchData } from 'src/app/services/searchData';
import { CandidateFilterModel } from 'src/app/services/userModel';
import { UtilService } from 'src/app/services/util.service';
import { filterConfig } from 'src/app/types/filterConfig';
import { CommunicationService } from 'src/shared/services/CommunicationService';
import { CommonValues } from '../../../../services/commonValues';
declare var $: any;

@Component({
  selector: 'app-new-candidate',
  templateUrl: './new-candidate.component.html',
  styleUrls: ['./new-candidate.component.scss']
})
export class NewCandidateComponent implements OnInit, OnDestroy {
  @Input() jobData: any;
  @Input() focus: string;
  singleCandidateView: boolean = false;
  afterCandidateCreated: boolean = false;
  response = new BehaviorSubject<any>([]);
  dataPass: any = [];
  stopscrollFlag: boolean = false
  entitySent: any = {}
  userType = localStorage.getItem('userType')
  jobfilter = false;
  totalFilters: number = 0;
  candidateFoundStatus: any = "Fetching Candidates..."
  dataPasstoSkillwidgets: Array<any> = [];
  removeSelected: any;
  FeaSugg: boolean = false
  activeStatus: boolean = null;
  removeTagvalues: any;
  stateListCA: any;
  stateListIN: any;
  stateListAU: any;
  candidateFilterForm: UntypedFormGroup;
  jobSeekerListName : string = "Profiles";
  countryList: any = [];
  candidateSource: Array<any> = [];
  engagementType: any = [];
  status: any = [];
  filterApplied: boolean = false
  workAuthorization: any = [];
  activeIds = [];
  @ViewChild("lgModal") lgModal;
  highValue2: number;
  refreshCandidates: Subscription
  filterReload: Subscription
  value: number = 0;
  highValue: number = 0;

  value1: number = 0;
  highValue1: number = 0;
  owner: boolean = false;
  showsuggJobsData: any = [];
  formDataPost: any = {};
  keyarrayCandidatesouces = ["all", "allPlatFormCandidates", "myCandidates", "teamCandidates", "benchNetworkCandidates", "freeLancerNetworkCandidates", "mtaNetworkCandidates", "jobSeekerNetworkCandidates", "featured", "suggestedCandidates"];
  keysarrWorks = ["all", "remoteWork", "relocationRequired", "workFromHome"];
  searchContent: any;
  userIdStorage = localStorage.getItem('userId')
  candiSourceSearchRoute = null
  searchUserType: any
  candiSourceSelectNetRoute: any
  ScreenLoadBool: boolean = false
  subscription: Subscription;
  isAccordionOpen: boolean;
  messageData: any;
  messagemodelflag: Boolean = false
  //job classification
  availableForCheckboxes = [
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
  availablecheckbox = [
    { label: 'All', selected: false, disable: false },
    { label: 'Immediate', selected: false, disable: false },
    { label: '1 Week', selected: false, disable: false },
    { label: '2 Weeks', selected: false, disable: false },
    { label: 'Other', selected: false, disable: false }

  ];
  candidate_status = [];
  statusCheckboxes: Array<{ label: string, selected: boolean, disable: boolean }> = [
    { label: 'All', selected: false, disable: false },
    { label: 'Draft', selected: false, disable: false },
    { label: 'Available', selected: false, disable: false },
    // { label: 'Shortlisted', selected: false, disable: false },
    // { label: 'Interview', selected: false, disable: false },
    // { label: 'Offered', selected: false, disable: false },
    // { label: 'Onboarded', selected: false, disable: false },
    // { label: 'On Contract', selected: false, disable: false },
    // { label: 'Featured', selected: false, disable: false },
    { label: 'Unavailable', selected: false, disable: false },


  ];
  WACheckboxes: Array<{ label: string, selected: boolean, disable: boolean }> = [];
  ischeckedJobSource: boolean = false
  ischeckedJobSourceAll: boolean = false
  ischeckedClientType: boolean = false
  ischeckedClientTypeAll: boolean = false
  ischeckedStatus: boolean = false
  ischeckedStatusAll: boolean = false
  ischeckedJobClassification: boolean = false
  ischeckedJobClassificationAll: boolean = false
  ischeckedWorkType: boolean = false
  ischeckedWorkTypeAll: boolean = false
  totalmsgcount: Subscription;
  totalmsgcounts: any;
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
  feaJ: boolean;
  profile: any
  networkflag: boolean = false;
  deactivatedCandidates: Array<candidateModel>
  modalRef: BsModalRef
  sendProfileData: any = {}
  validTotalPoints: boolean
  totalCount
  listingCount = 0;
  freelanceCount = 0;
  creditsConsume: any = 0;
  candidatesData: Array<candidateModel> = [];
  valid: boolean = true;
  triggerapi = new BehaviorSubject('null');
  availablePoints;
  queryParamsValues: any
  //@ViewChild('listingCandidate', { static: false }) listingmodal: TemplateRef<any>;
  img: any;
  obj: any = {
    limit: 10,
    searchAfterKey: null,
    userId: localStorage.getItem('userId')
  }
  obj1: any = {
    limit: 10,
    searchAfterKey: null,
    userId: localStorage.getItem('userId')
  }
  yearApplied: boolean = false
  backdropConfig = {
    backdrop: true,
    ignoreBackdropClick: true,
    keyboard: false
  }
  selectedCandidateData: candidateModel;
  postDateApplied: boolean = false
  previousSearchAfterKey = null;
  statusFlag: boolean = false
  myCandidateFlag: boolean = false
  countryFlag: boolean = false
  totalExperienceFlag: boolean = false
  benchCandidatesFlag: boolean = false
  remoteWorkFlag: boolean = false
  postedInDaysFlag: boolean = false
  experienceToFlag: boolean = false
  experienceFromFlag: boolean = false
  cityFlag: boolean = false
  zipcodeFlag: boolean = false
  workFromHomeFlag: boolean = false
  stateFlag: boolean = false
  relocationRequiredFlag: boolean = false
  engagementTypeFlag: boolean = false
  workAuthorizationFlag: boolean = false
  featuredCandidatesFlag: boolean = false
  totalCandidatesCount: number = 0;
  datas: any = {};
  isMyCandidateShowedOnLoad: boolean = false;
  @Input() screenName: any;
  filterSubscriber: Subscription;
  routingvalue: Subscription;
  isFilterOpen: boolean = false;
  panel: string;
  unsubscribe$: boolean = false;
  isActivityWidgetShown: boolean = false;
  pageYetToLoad: boolean = true;
  candidatePortfolioModule: any;
  candidateModule: jobModuleConfig;
  filterConfig: filterConfig;
  tempFilterChanges: any;
  filterChanges: any;
  candidateId: any;
  jobIdgetfromIntraction: string;
  tabName: string;
  filterPayLoad: CandidateFilterModel = {};
  FilterSubscription: Subscription;
  @ViewChild("widgetsticky") menuElement: ElementRef;
  isMyJobsShowedOnLoad: boolean = false;
  jobDataToBeSent: any;
  apiCompleted: boolean = false;

  showWorkAuthorization: boolean = false
  searchObserver = new Subject<string>();
  fromContent: "SUGGESTED_CANDIDATES" | "FEATURED_CANDIDATE" | "CANDIDATES_FROM_CONNECTION";
  singleCandidateViewFromEyeIcon: boolean = false;
  networkType : string = ""
  CANDIDATE_STATUS: string= "";
  loadAPIcall: boolean = false;


  constructor(private apiService: ApiService, private commonvalues: CommonValues, private modalService: BsModalService,private pageType: PageType,
    private pricePlanService: PricePlanService, private a_route: ActivatedRoute, private formBuilder: UntypedFormBuilder, private util: UtilService,
    private searchData: SearchData, private countProvider: countProvider, private jobService: JobService, private communicationService: CommunicationService) {
    this.BaseresponseFilter();
    this.filterSubscriber = this.jobService.getSliderToggle().subscribe(value => {
      this.panel = value.panel;
      this.entitySent.entity = value.panel;
      if (value.panel == 'candidates') {
        if (value.value == true) {
          this.openFilterSlider();
        } else {
          this.closeFilterSlider();
        }
      }
    })
    this.totalmsgcount = this.commonvalues.getmsgcountJob().subscribe((res) => {
      this.totalmsgcounts=res;
    });

    this.routingvalue = this.a_route.queryParams.subscribe((res) => {
      this.queryParamsValues = res;
      if (res.candidateId && res.tabName) {
        this.singleCandidateView = true;
        this.candidateId = res.candidateId;
        this.jobIdgetfromIntraction = res.jobId;
        this.tabName = res.tabName;
        if (res.From) {
          this.singleCandidateViewFromEyeIcon = true;
        }
        this.fromContent = res.From;
      }
      else if (res.createCandidate) {
        this.afterCandidateCreated = true;
        this.CANDIDATE_STATUS = res.status;
      }
      else if(res.networkName){
        this.networkflag = true;
        if (res.networkName === 'BENCH_SALES_NETWORK') {
          this.networkType = "benchNetworkCandidates";
        } else if (res.networkName === 'MANAGEMENT_TALENT_ACQUISITION_NETWORK') {
          this.networkType = "mtaNetworkCandidates";
        } else if (res.networkName === 'FREELANCE_RECRUITER_NETWORK') {
          this.networkType = "freeLancerNetworkCandidates";
        } else if (res.networkName === 'JOB_SEEKER_NETWORK') {
          this.networkType = "jobSeekerNetworkCandidates";
        } else if (res.networkName === 'OWNER') {
          this.networkType = "OWNER";
        }
      }
    });
  }

  removeJobId(data) {
    this.jobIdgetfromIntraction = undefined;
  }

  // Base response for Filter
  BaseresponseFilter() {
    this.filterPayLoad = {
      "source": {
        "all": false,
        "myCandidates": false,
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
      "userId": localStorage.getItem("userId"),
      "searchContent": "",
      "candidatesToFilter": this.candidateId
    }
  }

  async singlejobMethod() {
    await this.findByCandidateId(this.candidateId);
  }



  createCandidateFilterForm() {
    this.candidateFilterForm = this.formBuilder.group({
      source: this.formBuilder.array([]),
      workType: this.formBuilder.array([]),
      availableIn: null,
      engagementType: null,
      status: null,
      submissionFilters: null,
      workAuthorization: null,
      searchAfterKey: null,
      country: null,
      userId: localStorage.getItem('userId'),
      state: null,
      city: null,
      zipCode: null,
      limit: 10,
      totalExperience: null,
      postedFrom: null,
      postedTo: null,
    });

    this.jobsoucefilterFrom();
    this.worktypefilterFrompush();

  }

  jobsoucefilterFrom() {
    this.jobSourcesFormarray.push(this.jobSourcefields())
  }

  get jobSourcesFormarray() {
    return this.candidateFilterForm.get('source') as UntypedFormArray;
  }

  jobSourcefields(): UntypedFormGroup {
    return this.formBuilder.group({
      all: false,
      myCandidates: false,
      allPlatFormCandidates: false,
      teamCandidates: false,
      benchNetworkCandidates: false,
      freeLancerNetworkCandidates: false,
      mtaNetworkCandidates: false,
      jobSeekerNetworkCandidates: false,
      featured: false,
      suggestedCandidates: false

    });
  }

  worktypefilterFrompush() {
    this.workTypeFormarray.push(this.worktypefilterFrom())
  }

  get workTypeFormarray() {
    return this.candidateFilterForm.get('workType') as UntypedFormArray;
  }

  worktypefilterFrom(): UntypedFormGroup {
    return this.formBuilder.group({
      all: false,
      remoteWork: false,
      relocationRequired: false,
      workFromHome: false
    });
  }

  RoleBasedFilter() {
    this.diffcolourLabel();
    this.prepareFilterPayload();
    this.jobDataToBeSent = this.jobData
    this.filterapicall();
  }

  prepareFilterPayload() {
    this.filterPayLoad = { ...this.filterPayLoad, searchAfterKey: null };
    this.response.next([]);
    this.previousSearchAfterKey = null;
    this.obj.searchAfterKey = null;
    this.stopscrollFlag = false;
  }

  diffcolourLabel() {
    let colurclass = [];
    for (let i = 0; i < this.repetitions; i++) {
      colurclass = colurclass.concat(this.uniqueColorClasses);
    }
  }

  updateJobSourceAndFilter(candidateSourceType) {
    this.filterPayLoad.source[candidateSourceType] = true;
    this.candidateSource.push(candidateSourceType);
    this.candidateSource = [...new Set(this.candidateSource)];
  }

  clearFilterselectedcount(){
    this.communicationService.triggerMethod('candidates');
  }


  ngOnInit(): void {
    this.createCandidateFilterForm();
    this.updateCandidateFilterData();

    if (!this.singleCandidateView) {
      this.RoleBasedFilter();
    }
    else {
      this.singlejobMethod();
    }
    this.updateFilterPassing();
    this.updateCandidateModule();
    this.updateCandidatePortfolioModule();


    // search filter
    this.searchObserver.pipe(
      distinctUntilChanged(),
      debounceTime(800),
    ).subscribe((res: any) => {
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

  async updateBenefits() {
    await this.pricePlanService.UPDATE_USERDETAILS("ACTIVE_INTERACTIONS");
    console.log("PROVIDER_VALUE IS HEREREEEE " , this.countProvider.getBenefits());
  }

  ngOnDestroy(): void {
    if (this.filterSubscriber) {
      this.filterSubscriber.unsubscribe();
    }
    if (this.routingvalue) {
      this.routingvalue.unsubscribe();
    }
  }


  showApplicantFilter: boolean = true;
  filterReset(data) {
    if (data.pageName == 'cInvited' || data.pageName == 'jobsApplied') {
      this.showApplicantFilter = true;
    } else {
      this.showApplicantFilter = false;
    }
  }

  getOwnerNetwork(userType : USER_TYPE) : Array<string> {

    const arr = ['benchNetworkCandidates' , 'freeLancerNetworkCandidates' ,
    "mtaNetworkCandidates" , "jobSeekerNetworkCandidates" , "myCandidates"];

    if(this.isRecruiter(userType)){
      arr.splice(arr.length - 1 , 1);
    }

    return arr;
  }


  updateCandidateFilterData() {

    const userType = localStorage.getItem('userType') as USER_TYPE;

    if(this.networkflag && this.networkType!="OWNER"){
      this.patchCandidateSourceTrue(this.networkType);
    }
    else if (this.networkType === "OWNER"){
      this.patchCandidateSourceasArr(this.getOwnerNetwork(userType), true);
    }


    if (this.isMTAorFREEandREC(userType)) {

      // after creating candidate
      if (this.afterCandidateCreated) {
        this.afterCandidateCreated = userType === GigsumoConstants.RECRUITER ? false : true;
      }

      if (this.singleCandidateView && userType != GigsumoConstants.BENCH_RECRUITER) {

        if (this.singleCandidateViewFromEyeIcon) {
          let filterName: Array<string> = this.updateFilterIfuserFromRouting();
          this.setDefaultFilter(filterName, true);
          this.searchData.setHighlighter('newCandidates');
          return;
        }

      }

      if(this.isMTAorFREE(userType)){
        const {activeCandidatesCount} = this.countProvider.getBenefits();

        this.setDefaultFilter(activeCandidatesCount > 0 ? "myCandidates" : "allPlatFormCandidates");
      }
      else{
        this.setDefaultFilter("allPlatFormCandidates");
      }

    }
    else if (this.isBenchorJob(userType)) {
      this.setDefaultFilter("myCandidates");
    }

  }
  updateFilterIfuserFromRouting(): string[] {

    this.clearCandidateSourceControl();
    switch (this.fromContent) {
      case "SUGGESTED_CANDIDATES":
        this.patchCandidateSourceTrue('suggestedCandidates');
        return ["suggestedCandidates"];
      case "FEATURED_CANDIDATE":
        this.patchCandidateSourceTrue('featured');
        return ["featured"];
      case "CANDIDATES_FROM_CONNECTION":
        this.patchCandidateSourceTrue('benchNetworkCandidates');
        this.patchCandidateSourceTrue('freeLancerNetworkCandidates');
        this.patchCandidateSourceTrue('mtaNetworkCandidates');
        this.patchCandidateSourceTrue('jobSeekerNetworkCandidates');
        return ["benchNetworkCandidates", "freeLancerNetworkCandidates", "mtaNetworkCandidates", "jobSeekerNetworkCandidates"];
      default:
        break;
    }



  }

  patchCandidateSourceTrue(key: string) {
    this.getSource().at(0).get(key).patchValue(true);
  }


  patchCandidateSourceasArr(arr : Array<string> , value : boolean) {
    for(const key of arr){
      this.getSource().at(0).get(key).patchValue(value);
    }
  }

  patchCandidateSourceFalse(key: string) {
    this.getSource().at(0).get(key).patchValue(false);
  }

  clearCandidateSourceControl() {
    for (const key of this.keyarrayCandidatesouces) {
      this.getSource().at(0).get(key).patchValue(false);
    }
  }

  setDefaultFilter(value: string | Array<string>, fromRoute: boolean = false) {
    const userType = localStorage.getItem('userType') as USER_TYPE;

    const isOwner: boolean = ((fromRoute ? value.includes('myCandidates') : value === 'myCandidates') ||
      (!fromRoute && value === 'myCandidates' && !this.isRecruiter(userType)));

    if (fromRoute) {
      this.candidateSource = value as Array<string>;
    }
    else if (!fromRoute) {
      this.getSource().at(0).get(value).patchValue(true);
      this.candidateSource.push(value);
    }

    if (this.statusCheckboxes && isOwner) {
      this.statusCheckboxes[(this.CANDIDATE_STATUS != "DRAFTED" ? 2 : 1)].selected = true;
      this.candidateSource.push(this.CANDIDATE_STATUS != 'DRAFTED' ? 'Available' : "Draft");
    }

    // if he's recruiter / freelancer / MTA uncheck the platform candidates when he was routed from network card
    if(this.networkflag){

      if(this.isMTAorFREEandREC(userType)){

        // if MTA / FREE do this function
        if(!this.isRecruiter(userType)){

          if((this.networkType === "freeLancerNetworkCandidates" && userType === GigsumoConstants.FREELANCE_RECRUITER)
          || (this.networkType === "mtaNetworkCandidates" && userType  === GigsumoConstants.MANAGEMENT_TALENT_ACQUISITION)){

            this.patchCandidateSourceTrue('myCandidates');
           }
        }

        // this is apply for all 3 type
        this.patchCandidateSourceFalse('allPlatFormCandidates');
      }
      else if(this.isBenchorJob(userType)){

        if(this.networkType === "mtaNetworkCandidates" || this.networkType === "freeLancerNetworkCandidates"){
          this.patchCandidateSourceFalse("myCandidates");
        }

      }

    }


    this.tempFilterChanges = {};
    this.tempFilterChanges = {
      formData: this.candidateFilterForm.getRawValue(),
      checkedItems: this.candidateSource,
      statusCheckedItems: this.statusCheckboxes,
      availiabilityCheckedItems: this.availablecheckbox,
      engageMentCheckedItems: this.availableForCheckboxes,
      submissionItems: this.candidate_status
    };
    this.filterPayLoad.source = this.getSource().at(0).value;
    this.filterPayLoad.status = isOwner ? this.CANDIDATE_STATUS != 'DRAFTED' ? ['Available'] : ["Draft"] : [];
    // console.log("FILTERFORMADADAsahdsahd ", this.tempFilterChanges);

  }

  getSource(): UntypedFormArray {
    return this.candidateFilterForm.get('source') as UntypedFormArray;
  }

  isBenchorJob(userType: USER_TYPE): boolean {
    return (userType === GigsumoConstants.BENCH_RECRUITER
      || userType === GigsumoConstants.JOB_SEEKER);
  }

  isMTAorFREEandREC(userType: USER_TYPE): boolean {
    return (userType === GigsumoConstants.MANAGEMENT_TALENT_ACQUISITION
      || userType === GigsumoConstants.FREELANCE_RECRUITER || userType === GigsumoConstants.RECRUITER);
  }

  isMTAorFREE(userType: USER_TYPE): boolean {
    return (userType === GigsumoConstants.MANAGEMENT_TALENT_ACQUISITION || userType === GigsumoConstants.FREELANCE_RECRUITER );
  }

  isRecruiter(userType: USER_TYPE): boolean {
    return (userType === GigsumoConstants.RECRUITER);
  }
  selectedCandidateData_View: any;
  findByCandidateId(candidateId: any) {
    this.candidateDetailsTabName = this.tabName;
    // this.filterPayLoad.source.myCandidates = true;
    // this.filterPayLoad.candidatesToFilter = this.candidateId;
    this.filterapicall();
  }






  JobAcvityDatas: any = {
    call: false
  };
  updatetocandidateActivity(data) {
    data.refereshDatas = new Date();
    data.call = true;
    this.JobAcvityDatas = data;
    if (!data.isSelected) {
      this.JobAcvityDatas = { ...this.JobAcvityDatas };
    }

  }



  // get child date to display widgets
  getchildData(data) {
    if (data != null) {
      this.dataPasstoSkillwidgets = JSON.parse(data);

    } else {
      this.dataPasstoSkillwidgets = [];
    }
  }

  //  user remove after uncheck from widgets
  removeUserfromTag(data) {
    this.removeTagvalues = data;
    this.response.forEach(element => {
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


  onScrollDown() {
    if (!this.stopscrollFlag) {
      this.filterapicall();
    }

    // Add search content and jobId search filter here.

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

  searchfilter(val: string) {
    this.searchObserver.next(val === "" ? null : val);
  }

  API_NAME: string = 'candidates/filter';
  SUCCESS_CODE: string = GigsumoConstants.SUCESSCODE;
  filterapicall(searchContent: string = null) {
    this.apiCompleted = false
    this.InvitetoApplyFilter();

    this.loadAPIcall = true;
    this.commonvalues.changeData(true);
    // this.util.startLoader();
    // To check duplicate in candidate view ...

    // this.filterPayLoad.source.myCandidates=true;
    // this.filterPayLoad.source.allPlatFormCandidates=false;
    if (this.singleCandidateView) {
      this.filterPayLoad.candidatesToFilter = this.candidateId;
    }
    this.FilterSubscription = this.apiService.create(this.API_NAME, this.filterPayLoad)
      .subscribe(
        res => this.handleResponse(res, searchContent),
        err => this.handleError(err)
      );
  }
  // API success response
  handleResponse(res, searchContent: string) {
    this.loadAPIcall = false;
    this.commonvalues.changeData(false);
    // this.util.stopLoader();
    localStorage.setItem('candidateForm', JSON.stringify(this.filterPayLoad));
    if (res.code === this.SUCCESS_CODE) {
      this.apiCompleted = true
      this.CanidateListdata(res.data, searchContent);
    }
  }

  // API error responsec
  handleError(err) {
    this.loadAPIcall = false;
    this.commonvalues.changeData(false);

    // this.util.stopLoader();

  }


  CanidateListdata(data, searchContent: string) {
    let content = this.filterPayLoad.searchContent;

    if (this.filterPayLoad.searchAfterKey === null ||
      (content != null && searchContent != null && (content && content.trim()) === (searchContent && searchContent.trim()) && searchContent.length > 0)) {
      this.stopscrollFlag = false;
      this.response.next([]);

    }

    if (data.candidateList.length > 0) {
      const currentData = this.response.getValue();
      const combinedResponse = [...currentData, ...data.candidateList];
      this.response.next(combinedResponse);

      if(this.filterPayLoad.searchAfterKey === null && combinedResponse.length > 0){
        this.selectedCandidateData = combinedResponse[0];
      }

    } else if (this.response.getValue().length == 0) {
      this.totalCandidatesCount = 0;
      this.JobAcvityDatas=null;
      this.selectedCandidateData = null;
    }

    this.filterPayLoad.searchAfterKey = data.searchAfterKey;


    if (data.workAuthorization) {
      data.workAuthorization.forEach((res) => {
        this.WACheckboxes.forEach(item => {
          if (item.label === res) {
            this.showWorkAuthorization = true;
            item.selected = true;
            this.candidateSource.push(res);
          }
        });
      });
    }

    if (data.totalCandidatesCount !== undefined || data.totalCandidatesCount === 0) {
      this.totalCandidatesCount = data.totalCandidatesCount;
    }
    this.checkForEmptyJobList(data.candidateList, data.searchAfterKey);
  }


  candidateDetailsTabName: string = "profileSummary";

  updateCandidateModule() {
    let module = new jobModuleConfig(this.updateCandidateDetails);
    module.tabName = "profileSummary";
    module.source = this;
    this.candidateModule = module;
  }


  updateCandidatePortfolioModule() {
    let module = new jobModuleConfig(this.updateCandidatePortfolioDetails);
    module.tabName = "profileSummary";
    module.source = this;
    this.candidatePortfolioModule = module;
  }


  updateFilterPassing() {
    let revokeBtn: filterConfig = new filterConfig(this.candidateFilterData);
    revokeBtn.source = this;
    this.filterConfig = revokeBtn;
  }

  candidateFilterData(data: any) {
    if (data != null && data.from === "HORIZANTAL") {
      // console.log("FILTERTRIGERED ", data);
      this.tempFilterChanges = data;
      this.availablecheckbox = data.availiabilityCheckedItems;
      this.statusCheckboxes = data.statusCheckedItems;
      this.availableForCheckboxes = data.engageMentCheckedItems;
      this.candidateSource = [...new Set(data.checkedItems)];
      this.updateFilterData();
    }
    else if (data != null && data.from === "VERTICAL") {
      // console.log("FILTERTRIGERED ", data);
      this.tempFilterChanges = data;
      this.availablecheckbox = data.availiabilityCheckedItems;
      this.statusCheckboxes = data.statusCheckedItems;
      this.availableForCheckboxes = data.engageMentCheckedItems;
      this.candidate_status = data.submissionItems;
      this.candidateSource = [...new Set(data.checkedItems)];
    }
  }




  updateFilterData() {
    const { formData: { source, workType, ...rest } } = this.tempFilterChanges;
    this.filterPayLoad = {
      searchContent: this.filterPayLoad.searchContent,
      ...rest,
      source: source[0],
      workType: workType[0]
    }

    console.log("CABIHAAS " , source);

    if(this.candidateSource){
      this.jobSeekerListName = (this.filterPayLoad.source &&
         this.filterPayLoad.source['myCandidates'] &&
         !this.checkKey(this.filterPayLoad.source).some(c => c === true)
        ) ?
      "Profiles" : "Candidates";
    }

    this.filterPayLoad.workAuthorization = [];
    this.filterPayLoad.searchAfterKey = null;
    this.filterPayLoad.userId = localStorage.getItem('userId');
    this.filterPayLoad.status = this.statusCheckboxes.filter(element => element.selected).map(element => element.label);
    this.filterPayLoad.availableIn = this.availablecheckbox.filter(element => element.selected).map(element => element.label);
    this.filterPayLoad.submissionFilters = this.candidate_status.filter(element => element.selected).map(element => element.value);
    this.filterPayLoad.engagementType = this.availableForCheckboxes.filter(element => element.selected).map(element => element.label);
    this.filterapicall();
  }


  checkKey(dt : any) {
    return Object.keys(dt).reduce((acc , dd)=>{
      if(dd != "myCandidates"){
            acc.push(dt[dd]);
      }
      return acc
    },[]);
  }





  onFilterToggle(value: any) {
    // this.response.next([]);
    this.filterApplied = false;
    this.stopscrollFlag = false;
    if (this.panel == 'candidates') {
      if (value === 'reset') {
        this.resetFilternew();
        return;
      }
      this.afterFilterPrepareForm()
    } else if (this.panel == 'job invites') {
      this.jobService.setSliderToggle(false, this.panel, value);
    } else if (this.panel == 'jobs applied') {
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
    this.filterPayLoad.workAuthorization = [];
    this.filterPayLoad.searchAfterKey = null;
    this.filterPayLoad.userId = localStorage.getItem('userId');
    this.filterPayLoad.status = this.statusCheckboxes.filter(element => element.selected).map(element => element.label);
    this.filterPayLoad.availableIn = this.availablecheckbox.filter(element => element.selected).map(element => element.label);
    if (this.candidate_status != undefined) {
      this.filterPayLoad.submissionFilters = this.candidate_status.filter(element => element.selected).map(element => element.itemId);
    }
    this.filterPayLoad.engagementType = this.availableForCheckboxes.filter(element => element.selected).map(element => element.label);
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
          this.candidateSource.push(res);
        }
      });
    });
  }



  updateSourceWorkType(data, type) {
    if (type == 'source') {
      for (let key in data.source) {
        if (data.source[key] === true) {
          this.filterPayLoad.source[0].key = true;
          this.candidateSource.push(key);
        }
      }
    } else if (type == 'workType') {
      for (let key in data.workType) {
        if (data.source[key] === true) {
          this.filterPayLoad.workType[0].key = true;
          this.candidateSource.push(key);
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
    this.candidateSource = [];
    this.candidateFilterForm.reset();
    this.statusCheckboxes = this.resetStatusCheckBox();
    this.availableForCheckboxes = this.resetClientTypeCheckBox();
    this.availablecheckbox = this.resetEngagementTypeCheckBox();
    this.candidate_status = this.resetSubmissionFilter();
    this.BaseresponseFilter();
    this.updateCandidateFilterData();
    this.filterapicall();
    this.clearFilterselectedcount();
  }


  resetStatusCheckBox(): Array<any> {
    return this.statusCheckboxes.map((val: any) => {
      val.selected = false
      return val;
    });
  }

  resetClientTypeCheckBox(): Array<any> {
    return this.availableForCheckboxes.map((val: any) => {
      val.selected = false
      return val;
    });
  }

  resetEngagementTypeCheckBox(): Array<any> {
    return this.availablecheckbox.map((val: any) => {
      val.selected = false
      return val;
    });
  }

  resetSubmissionFilter(): Array<any> {
    return this.candidate_status.map((val: any) => {
      val.selected = false
      return val;
    });
  }


  removeEntitynew(value, index) {
    this.candidateSource.splice(index, 1);

    Object.keys(this.filterPayLoad.source).forEach((key: any) => {
      if (key === value) {
        this.filterPayLoad.source[key] = false;
      }
      if (this.candidateSource.includes(key)) {
        this.filterPayLoad.source[key] = true;
      }
    });
    // Submission Status

    this.candidate_status.forEach(element => {
      if (element.selected && element.label == value) {
        element.selected = false;
        this.candidate_status[0].selected = false
      }
    });

    // status candaidate avilable
    this.statusCheckboxes.forEach(element => {
      if (element.selected && element.label == value) {
        element.selected = false;
        this.statusCheckboxes[0].selected = false
      }
    });

    // Availability
    this.availablecheckbox.forEach(element => {
      if (element.selected && element.label == value) {
        element.selected = false;
        this.availablecheckbox[0].selected = false
      }
    });


    // Engagement Type
    this.availableForCheckboxes.forEach(element => {
      if (element.selected && element.label == value) {
        element.selected = false;
        this.availableForCheckboxes[0].selected = false
      }
    });


    this.filterPayLoad.workAuthorization = [] // work auth values
    this.filterPayLoad.availableIn = this.availablecheckbox.filter(element => element.selected).map(element => element.label);;
    this.filterPayLoad.engagementType = this.availableForCheckboxes.filter(element => element.selected).map(element => element.label);
    this.filterPayLoad.status = this.statusCheckboxes.filter(element => element.selected).map(element => element.label);;
    this.filterPayLoad.submissionFilters = this.candidate_status.filter(element => element.selected).map(element => element.label);;


    this.filterPayLoad.searchAfterKey = null;
    this.stopscrollFlag = false;
    let deletingData: any = {}
    deletingData.value = value;
    deletingData.index = index;
    this.jobService.setDataForFilter(deletingData);
    this.filterapicall();
  }



  // Label msg set .
  checkForEmptyJobList(candidateList, searchAfterKey) {
    if (candidateList.length === 0) {
      this.stopscrollFlag = true;
      this.candidateFoundStatus = "Couldn't find any Candidates for the applied filters."
    } else {
      this.candidateFoundStatus = "Fetching Candidates...";
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
    this.showWorkAuthorization = false;
  }





  updateCandidateDetails(data: any, content: any) {

    if (content.for === "CANDIDATE_DETAIL") {
      this.selectedCandidateData = { ...data };
      this.selectedCandidateData.call = false;
      this.candidateDetailsTabName = "profileSummary";
    }
    else if (content.for === "TAB_ROUTE") {
      this.candidateDetailsTabName = data;
      let datas = content.value;
      if (this.isParenActivity(data)) {
        datas.call = true;
      }else{
        datas.call = false;
      }

     this.selectedCandidateData = { ...datas };
      // this.selectedCandidateData = datas;
    }
  }

  isParenActivity(data: string): boolean {
    return data === 'jobsApplied' || data === 'cInvited'
  }

  updateCandidatePortfolioDetails(data: string) {
    this.candidateDetailsTabName = data;
    if (!this.isParenActivity(data)) {
      this.selectedCandidateData = { ...this.selectedCandidateData };
      this.selectedCandidateData.call = false;
    }else{
      this.selectedCandidateData = { ...this.selectedCandidateData };
    }
  }


  cleanJobSource() {
    this.candidateSource = [...new Set(this.candidateSource)].filter((ele: any) => ele.toLowerCase() !== 'all');
  }

  closeCandidateSupplyModal() {
    this.modalService.hide(1);
  }

  InvitetoApplyFilter() {
    if (this.screenName != undefined && this.screenName === 'job-listing') {
      this.BaseresponseFilter();
      for (let key in this.filterPayLoad.source) {
        if (key == 'myCandidates') {
          this.filterPayLoad.source.myCandidates = true;
          this.filterPayLoad.status = ['Active'];
        } else {
          this.filterPayLoad.source[key] = false;
        }
      }
    }
  }

  openFilterSlider() {
    if (!this.isFilterOpen) {
      this.filterChanges = this.tempFilterChanges;
      // console.log("opened Changes", this.filterChanges);
      this.isFilterOpen = true;
      this.jobService.setSliderToggle(true, 'candidates', null);
    }
  }

  closeFilterSlider() {
    if (this.isFilterOpen) {
      this.isFilterOpen = false
      this.jobService.setSliderToggle(false, 'candidates', null);
    }
  }

  onStatuChange(value: string) {

    // when user filtered the submission filter and trying to route from candidate listing by clicking the count
    if(value && value.split("|").length > 0 && value.split("|")[0] === "SUBMISSION_ROUTE"){
      this.candidateDetailsTabName = "jobsApplied";
      const datas = this.response.getValue();

      if(datas){
        const selectedData = datas.filter((_e:any)=> _e.candidateId === value.split("|")[1]);
        console.log("selectedData " , selectedData[0]);
        if(selectedData && selectedData.length >0){
          this.selectedCandidateData = selectedData[0];
        }
      }

      return;
    }

    this.reloadProcess(value);
    // for now commenting it
    // console.log("CANDIDATE_CHANGE_TRIGGERED " , candidateData);
    // const responseValue : Array<any> =  this.response.getValue();
    // if(Array.isArray(responseValue) && responseValue.length > 0){
    //   let responseData = responseValue.map((element: any)=>{
    //     if(element.candidateId === candidateData.candidateId){
    //       element = candidateData;
    //       this.selectedCandidateData =  element;
    //     }
    //     return element;
    //   });
    //   this.sortDateByNormalCandidate(responseData);
    // }
  }

  reloadProcess(value: string) {
    this.filterPayLoad.searchAfterKey = null;

    if (value === 'updateReload') {
      this.filterPayLoad.status = ['Available'];
      this.statusCheckboxes.forEach(val => val.selected = false);
      this.statusCheckboxes.find(val => val.label === 'Available').selected = true;
      // update only the status without affecting the existing changes
      this.tempFilterChanges = {
        ...this.tempFilterChanges,
        statusCheckedItems: this.statusCheckboxes,
      }
    }

    this.filterapicall();
  }


  emitReceived(value: any) {
    const currentData = this.response.getValue();
    if (value.candidateId == currentData.candidateId) {
      currentData[value.index] = { ...currentData[value.index], status: currentData.status }
    }
  }


  sortDateByNormalCandidate(val: any) {
    let sortedDate = val.sort((a, b) => { return <any>new Date(b.updatedOn) - <any>new Date(a.updatedOn); })
    this.response.next(this.sortFeature(sortedDate));
  }

  sortFeature(data) {
    return data.sort((a, b) => {
      return b.isFeatured - a.isFeatured;
    });
  }


  getsuggjob(data) {
    data.pageNumber = 0;
    data.limit = 10;
    data.userId = localStorage.getItem('userId');
    this.apiService.create("jobs/findSuggestedJobs", data).subscribe((res) => {
      res.componentName = 'SuggestedJobComponent';
      this.showsuggJobsData = res;
      this.pageType.setsuggjob(res)
    })
  }


  reloadFilter(value: string) {
    this.reloadProcess(value);
  }

  getPanelValue(value: any) {
    this.panel = value;
  }

  chatbottom() {
    let seletedItem: any = {};
    seletedItem.owner = true;
    this.messagemodelflag = true;
    seletedItem.userId = localStorage.getItem('userId');
    this.messageData = [];
    seletedItem.groupType = "CANDIDATE";
    seletedItem.messageType = "CANDIDATE";
    seletedItem.id = null;
    this.messageData = seletedItem;


  }

  closeMessage(event) {
    this.messagemodelflag = false;
  }

  countSouce: number = 0;
  streamReloadApicallcandidate() {
    let data: any = JSON.parse(localStorage.getItem('candidateForm'));
    data.searchAfterKey = null;
    this.filterPayLoad = data;
    this.stopscrollFlag = false
    this.response.next([]);
    this.obj.searchAfterKey = null;
    this.previousSearchAfterKey = null;
    this.filterPayLoad.searchAfterKey = null;
    this.filterapicall();
  }


}
