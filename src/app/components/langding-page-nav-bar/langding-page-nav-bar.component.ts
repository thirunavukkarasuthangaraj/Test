import { DatePipe, PlatformLocation } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  Renderer2,
  TemplateRef,
  ViewChild
} from "@angular/core";
import { AbstractControl, UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from "@angular/forms";
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { ActivatedRoute, NavigationStart, Router } from "@angular/router";
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import * as CryptoJS from 'crypto-js';
import { ConnectionService } from "ng-connection-service";
import { BsModalRef, BsModalService, ModalOptions } from "ngx-bootstrap/modal";
import { TypeaheadOrder } from "ngx-bootstrap/typeahead";
import { CookieService } from "ngx-cookie-service";
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { Observable, Subject, Subscription, interval, timer } from "rxjs";
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { AppSettings } from "src/app/services/AppSettings";
import { ApiService } from "src/app/services/api.service";
import { CommonValues } from "src/app/services/commonValues";
import { PageType } from 'src/app/services/pageTypes';
import { ProfilePhoto } from "src/app/services/profilePhoto";
import { SearchData } from "src/app/services/searchData";
import { SocketService } from 'src/app/services/socket.service';
import { UtilService } from "src/app/services/util.service";
import { environment } from 'src/environments/environment';
import Swal from "sweetalert2";
import { CustomValidator } from '../Helper/custom-validator';
import { SocketServiceStream } from './../../services/SocketServiceStream';
import { StreamService } from './../../services/stream.service';
import { CreditModelComponent } from './../credit/credit-model/credit-model.component';
declare var $: any
type Location = {
  country: string,
  state: string,
  city: string;
  zipCode: string,
}
import { FormValidation } from 'src/app/services/FormValidation';
//import { StreamRouter } from 'src/app/services/streamRouter';
import { Gtag } from 'angular-gtag';
import { PricePlanService } from 'src/app/components/Price-subscritions/priceplanService';
import { GigsumoConstants, USER_TYPE } from 'src/app/services/GigsumoConstants';
import { HealthCareOrganization } from 'src/app/services/HealthCareOrganization';
import { UserService } from 'src/app/services/UserService';
import { GigsumoService } from 'src/app/services/gigsumoService';
import { JobService } from 'src/app/services/job.service';
import { jobModuleConfig } from 'src/app/services/jobModuleConfig';
import { WorkExperience } from 'src/app/services/userModel';
import { PlanDowngradeModelComponent } from '../plan-downgrade-model/plan-downgrade-model.component';
import { TourService } from 'src/app/services/TourService';
import { JoyrideService } from 'ngx-joyride';
 
declare var $: any;
 
interface CustomModalOptions extends ModalOptions {
  data?: any
}
@Component({
  selector: "app-langding-page-nav-bar",
  templateUrl: "./langding-page-nav-bar.component.html",
  styleUrls: ["./langding-page-nav-bar.component.scss"],
})
export class LangdingPageNavBarComponent extends FormValidation
  implements OnInit, OnDestroy, AfterViewInit {
  showmodel = false
  creditform: UntypedFormGroup;
  freeLauchtimezoneFrom: UntypedFormGroup;
  timezonSubmited = false;
  submited: boolean = false;
  public FORMERROR = super.Form;
  points: any = [];
  availableredim: any = [];
  redeimform: UntypedFormGroup;
  counts;
  userTypeunder: any = null;
  gigsumono: any = null;
  disable_for_draft: boolean = false;
  userId: string = localStorage.getItem('userId');
  fileSize = AppSettings.FILE_SIZE;
  currentTimeDate: string | Date;
  img;
  unit = { duration: '30' };
  mindate: any = new Date();
  currentDate: any = [];
  maxDate: any = [];
  autoComplete: MatAutocompleteTrigger;
  userDetailsLanding: any;
  photoId: any;
  name;
  // tslint:disable-next-line: variable-name
  userDetailsLanding_array = [];
  dynamicArray = [];
  public envName: any = environment.name;
  businessDataArray: any = [];
  BuninessPageData;
  serachForm: UntypedFormGroup;
  SerachList: Array<String> = [];
  conditionDropdown = [];
  keyword = "firstName";
  item: any;
  bsModalRef: BsModalRef;
  dynamicdata;
  userData;
  bunissData;
  CommunityData;
  errorMsg: any;
  BusinessId;
  SearchcArray;
  filteredStreets: Observable<any>;
  businessTitle = "BusinessPage";
  showSearchData = false;
  searchBarShow = false;
  reloadUser = false;
  highLighter: Subscription
  notificationList: any = [];
  callNotification = true;
  unreadUserMsgCount: number = 0;
  notificationcount: number = 0;
  jobInvitesReceivedCount: number = 0;
  resumeRequestReceivedCount: number = 0;
  jobApplicationsReceivedCount: number = 0;
  totalFeaturedCandidatesCount: number = 0;
  jobsAppliedCount: number = 0;
  totalFeaturedJobsCount: number = 0;
  jobInvitesSentCount: number = 0;
  resumeRequestedCount: number = 0;
  totalsuggJobsCount: number = 0;
  totalSuggCandidatesCount: number = 0;
  newPost: number = 0;
  callUnreadMsg: boolean = true;
  value: any = {}
  userValues: Subscription
  currentOrganizationDetail: WorkExperience;
  expireModalRef: BsModalRef;
  workauthcountry: any;
  supportModal: jobModuleConfig;
  isOpenChange1(): void {
  }
  candidateSubmit: boolean = false
  eventEmitter: Subscription;
  countEmitter: Subscription;
  entityPassed: Subscription;
  userTypeChanger: Subscription;
  navigationSubscription: Subscription;
  isConnected = true;
  getclickStatus = true;
  result: any;
  noInternetConnection: boolean;
  globalsearchRes: any = [];
  candidateId: any;
  streamData: any = [];
  jobStreamData: any = [];
  canidateStreamData: any = [];
  notificationDatasshow: any;
  workExperienceContent: string;
  @ViewChild("myFileInputcandidate") myFileInputcandidate;
  @ViewChild("jobCandidateTemplate") jobCandidateTemplate: ElementRef;;
  @ViewChild('timezoneforFreelauncher') timezoneforFreelauncher: ElementRef;
  @ViewChild('welcometour', { static: true }) welcometour: TemplateRef<any>;
  TourmodalRef: BsModalRef;
  @ViewChild('customDropdown') customDropdown: any;
  imageChangedEvent: any = "";
  fileUploadName;
  fileshow = undefined;
  fileToUpload: File;
  photoIdnew: any;
  infoData: any = {};
  photo: any = null;
  url = AppSettings.ServerUrl + "download/";
  counter = 0
  previous = 0
  now = 0
  clickEventsubscription: Subscription;
  subscription: Subscription;
  rxjsTimer = timer(AppSettings.timerSocket);
  destroy = new Subject();
  streamRes: any = null;
  isScrollEnabled: boolean = false;
  constructor(
    private datePipe: DatePipe,
    private cookieService: CookieService,
    private API: ApiService, private userService: UserService,
    private pageType: PageType,
    private modalService: BsModalService,
    private fb: UntypedFormBuilder,
    private commonValues: CommonValues,
    private pricePlanService: PricePlanService,
    private router: Router,
    private _route: ActivatedRoute,
    private connectionService: ConnectionService,
    private commonservice: CommonValues,
    private util: UtilService,
    private formBuilder: UntypedFormBuilder,
    private profilePhoto: ProfilePhoto,
    private cookieservice: CookieService,
    private searchData: SearchData,
    private stremService: StreamService,
    private Socketserver: SocketService,
    private StreamSocket: SocketServiceStream,
    private readonly joyrideService: JoyrideService,
    public gigsumoService: GigsumoService,
    private JobServicecolor: JobService,
    private UserService: UserService,
    private gtag: Gtag,
    private tourService: TourService,
    
   ) {
    super();
    this.getUserHeaderCount();
    this.userProfileUpdate();

    this.tourService.getTourSteps().subscribe(data => {
      this.tourSteps = data;
    });


    this.navigationSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        const isTargetRoute = event.url.includes('/newjobs')
          || event.url.includes('/newcandidates') ? true : false;
        this.toggleBodyOverflow(!isTargetRoute);
        if (event.url.includes('/newjobs')) {
          localStorage.removeItem('candidateSource');
          localStorage.removeItem('candidateForm');
        } else if (event.url.includes('/newcandidates')) {
          localStorage.removeItem('jobSource');
          localStorage.removeItem('jobForm');
        }
      }
    });
    this.connectionService.monitor().subscribe(isConnected => {
      this.isConnected = isConnected;
    }); 
    
 
     
     this.clickEventsubscription = this.stremService.getstreamResponse().subscribe(streamData => {
      this.streamData = streamData;
      // console.log("streamData", streamData);
      if (streamData.responseEntity == "JOB") {
        this.jobStreamData = streamData;
      }
      if (streamData.responseEntity == "CANDIDATE") {
        this.canidateStreamData = streamData;
      }
      if (streamData.responseEntity == "HOME") {
        this.streamData = streamData;
      }
      if (!this.notificationDatasshow) {
        this.notificationDatasshow = {};
      }
      if (streamData && streamData.responseEntity === "HOME" && streamData.data) {
        const data = streamData.data;
        this.notificationDatasshow.jobApplicationsReceivedCount = data.jobApplicationsReceivedCount || 0;
        this.notificationDatasshow.jobInvitesReceivedCount = data.jobInvitesReceivedCount || 0;
        this.notificationDatasshow.jobNonSeenMessageCount = data.jobNonSeenMessageCount || 0;
        this.notificationDatasshow.candidateNonSeenMessageCount = data.candidateNonSeenMessageCount || 0;
        if (data.message != undefined) {
          this.notificationDatasshow.message = data.message || '';
        }
        if (data.notification != undefined) {
          this.notificationcount = data.notification || '';
        }
        this.notificationDatasshow.newPost = data.newPost || '';
        this.notificationDatasshow.notification = data.notification || '';
        this.notificationDatasshow.resumeRequestReceivedCount = data.resumeRequestReceivedCount || 0;
        this.notificationDatasshow.unreadUserMsgCount = data.unreadUserMsgCount || 0;
        this.commonValues.setmsgcountJob(data.jobNonSeenMessageCount || 0);
        this.commonValues.setmsgcountJob(data.candidateNonSeenMessageCount || 0);
        this.commonValues.setmsgcountJob(data.message || 0);
      }
    })
    this.checkUserProfileStatus();
    this.eventEmitter = this.profilePhoto.getPhoto().subscribe((res) => {
      this.photoId = res;
      this.img = {
        src:
          res && res.photo !== undefined && res.photo !== null && res.photo !== ""
            ? AppSettings.ServerUrl + "download/" + res.photo
            : null,
      };
    });
    this.countEmitter = this.searchData.getNotificationCount().subscribe(res => {
      if (!this.notificationDatasshow) {
        this.notificationDatasshow = {};
      }
      this.notificationDatasshow.message = res.unreadUserMsgCount;
      this.notificationcount = res.notificationcount;
    })
    this.userTypeChanger = this.searchData.getuserType().subscribe(res => {
      this.userType = res.userType
    })
    this.highLighter = this.searchData.getHighlighter().subscribe(res => {
      this.getHighLighter(res)
    })
    this.userId = localStorage.getItem("userId");
    this._route.queryParams.subscribe(res => {
      if (res.showWelcomePost == "true") {
        setTimeout(() => {
          this.userType = localStorage.getItem('userType') as USER_TYPE;
        }, 4000);
      }
    })
    this.a = this._route.pathFromRoot[0]['_routerState']['snapshot'].url
    this.b = this.a.substr(1, 6);
    this.pageName = this.b;
    if (this.b == 'newcan') {
      this.pageName = 'newcandidates'
    } else if (this.b == 'newjob') {
      this.pageName = 'newjobs'
    } else if (this.b == 'landin') {
      this.pageName = 'landingPage'
    } else if (this.b == 'messag') {
      this.pageName = 'message'
    } else if (this.b == 'notifi') {
      this.pageName = 'notification'
    }

    this.commonValues.startTour$.subscribe(() => {
      this.startTour = true;
    }); 
  }
 
  highlightMenu(value: string) {
    switch (value) {
      case "":
        break;
      default: ""
    }
  }
  userDetailPage: boolean = false
  pageName: any = null
  emailPattern = "^[a-zA-Z0-9._%+-]+@[a-zA-Z.-]+.[a-zA-Z]{2,4}$";
  a: any;
  b: any;
  domainForm: UntypedFormGroup
  domainForfreeLauchtimezoneFromm: UntypedFormGroup
  clientTypeListprofile: Array<string> = ['Direct Client', 'Supplier', 'Systems Integrator', 'Prime Vendor', 'Vendor', 'Staffing Agency']
  activejobcount: number = 0;
  activeCandidatesCount: number = 0;
  totalCount: number = 0;
  showingcount: boolean = false;
  loadAPIcall: boolean = false;
  startTour: boolean = false; 
  tourSteps: any[] = [];

  openTourModal(welcometour) { 
    const config: ModalOptions = { backdrop: 'static', keyboard: false };
    this.TourmodalRef = this.modalService.show(welcometour, config);  
  }

  startUI() { 
    this.TourmodalRef.hide();
    localStorage.setItem("tourshowed",'true'); 
    this.startTour = true;
    this.tourService.startTour();  
  }  
  
  closeTour() { 
    this.TourmodalRef.hide();
    localStorage.setItem("tourshowlater",'true');
    localStorage.setItem('tourshowlater_timestamp', new Date().toISOString());
  }

  getTitle(stepId: string): string {
    const step = this.tourSteps.find(s => s.stepId === stepId);
    return step ? step.title : 'Loading...';
  }

  getText(stepId: string): string {
    const step = this.tourSteps.find(s => s.stepId === stepId);
    return step ? step.text : 'Loading...';
  }

 
  ngOnInit() {  
    
     this.instantiateComponent();
     this.apicallforDowngrade();
     this.updateSupportModule();
    // i will open the model for angular tour
    let tourshowlaterTimestamp = localStorage.getItem('tourshowlater_timestamp');
    let tourshowlater = localStorage.getItem('tourshowlater')
    let showedTour = localStorage.getItem('tourshowed')
    
    if(tourshowlater==null  && showedTour==null){
     this.openTourModal(this.welcometour);
    }else  if(tourshowlater=='true'){
      if (tourshowlaterTimestamp) {
        const lastShown = new Date(tourshowlaterTimestamp).getTime();
        const now = new Date().getTime();
        const diffHours = (now - lastShown) / (1000 * 60 * 60);
        if (diffHours >= 24) {
           this.openTourModal(this.welcometour);
         }
      }
    } 
   
    this.creditform = this.fb.group({
      point: [null, Validators.compose([Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)])]
    });
    this.domainForm = this.formBuilder.group({
      priEmail: null,
      secEmail: null,
      swapEmail: [null, [Validators.required,
      Validators.email,
      Validators.pattern(this.emailPattern)]],
      domainValidationOtp: null,
    })
    if (this.b == 'userClassification') {
      this.userDetailPage = true
    } else {
      this.userDetailPage = false
    }
    this.instantiateDependencies();
    setTimeout(() => {
      this.onChangeProfile();
    }, 1000);
    this.searchSubject.pipe(
      debounceTime(1000),
      distinctUntilChanged()
    )
      .subscribe(
        res => {
          this.patchEmail(res);
        }
      )
    this.orgNameSubject.pipe(
      debounceTime(1000),
      distinctUntilChanged()
    )
      .subscribe(
        res => {
          this.getOrganization1(res);
        }
      )

   
  }


  resumeTour() {
    this.tourService.resumeTour();
  }

  notificationTitle: string = "";
  notificationContent: string = "";
  showSecondaryAlert: boolean = false;
  getTheEmailSearchContent(value: string) {
    this.searchSubject.next(value);
  }
  getOrganisationName(value: string) {
    this.orgNameSubject.next(value);
  }
  async apicallforDowngrade() {
    this.util.startLoader();
    this.loadAPIcall = true;
    let planbenefits: any = await this.API.lamdaFunctionsget('findUserPlanBenefits/' + localStorage.getItem('userId'));
    if (planbenefits.data != undefined && this.userType != "JOB_SEEKER") {
      this.util.stopLoader();
      this.loadAPIcall = false;
      this.showingcount = true;
      let isDowngraded: boolean = false;
      let isPromotional: boolean = false;
      localStorage.setItem("MemberShipType", planbenefits.data.userPlanAndBenefits.membershipType);
      let localDate = new Date();
      let expiredDate = new Date(planbenefits.data.userPlanAndBenefits.toDate);
      //promtional credits validation
      let promotionEndDate = null;
      if (planbenefits.data.userPlanAndBenefits.promotionsEndDate != null
        && planbenefits.data.userPlanAndBenefits.promotionsEndDate != undefined) {
        promotionEndDate = new Date(planbenefits.data.userPlanAndBenefits.promotionsEndDate);
      }
      if (planbenefits.data.userPlanAndBenefits.downgradeRequested != undefined
        && planbenefits.data.userPlanAndBenefits.downgradeRequested == true
        && localDate > expiredDate) {
        this.calculateCountsWhilePromotionIsOnOrNull(planbenefits, 'downgradeRequested');
      }
      if (localDate > expiredDate && planbenefits.data.userPlanAndBenefits.membershipType != "Free") {
        isDowngraded = true;
      }
      if (promotionEndDate != null
        && promotionEndDate < localDate) {
        isPromotional = true
      }
      this.calculateCountsWhilePromotionOrPlanIsOver(planbenefits, isDowngraded, isPromotional)
      if (promotionEndDate != null && promotionEndDate > localDate && !isDowngraded) {
        this.calculateCountsWhilePromotionIsOnOrNull(planbenefits, 'onOrNull');
      }
    }
  }
  calculateCountsWhilePromotionIsOnOrNull(planBenefits, param) {
    if (param == 'onOrNull') {
      this.entityCountConfig.modalTitle = 'Promotion Credits Minimized'
    }
    if (param == 'downgradeRequested') {
      this.entityCountConfig.modalTitle = 'Plan Downgrade Requested'
    }
    let openModal: boolean = false
    let candidateCount = 0
    let jobCount = 0
    if (planBenefits.data.activeCandidatesCount != undefined) {
      candidateCount = planBenefits.data.activeCandidatesCount
    }
    if (planBenefits.data.activeJobsCount != undefined) {
      jobCount = planBenefits.data.activeJobsCount
    }
    let totalCount: number = candidateCount + jobCount;
    let benefits: Array<any> = planBenefits.data.userPlanAndBenefits.benefitsUsages;
    benefits.forEach(ele => {
      if (ele.benefitKey == 'JOB_CANDIDATE_POSTINGS') {
        this.entityCountConfig.allowedJobsCandidatesCount = ele.actual + ele.promotional
        if (totalCount > (ele.actual + ele.promotional)) {
          openModal = true
          this.entityCountConfig.isPromotional = true;
        }
      }
      if (ele.benefitKey == 'TEAM_WORKSPACES') {
        this.entityCountConfig.allowedWorkspaceCount = ele.actual + ele.promotional
        if (ele.utilized > (ele.actual + ele.promotional)) {
          openModal = true
          this.entityCountConfig.isPromotional = true;
        }
      }
      if (ele.benefitKey == 'PERSONAL_NETWORKS') {
        this.entityCountConfig.allowedNetworksCount = ele.actual + ele.promotional
        if (ele.utilized > (ele.actual + ele.promotional)) {
          openModal = true
          this.entityCountConfig.isPromotional = true;
        }
      }
    })
    if (openModal) {
      this.openModals(planBenefits);
    }
  }
  calculateCountsWhilePromotionOrPlanIsOver(planBenefits, isDowngraded, isPromotional) {
    this.entityCountConfig.isDowngraded = isDowngraded == true ? true : false;
    this.entityCountConfig.isPromotional = isPromotional == true ? true : false;
    let totalcount = 0;
    if (planBenefits.data.activeCandidatesCount != undefined) {
      totalcount = planBenefits.data.activeCandidatesCount
    }
    if (planBenefits.data.activeJobsCount != undefined) {
      totalcount = totalcount + planBenefits.data.activeJobsCount
    }
    if (isPromotional === true && isDowngraded == false) {
      this.entityCountConfig.modalTitle = 'Promotion Credits Exhausted'
    }
    if (isDowngraded === true && isPromotional == false) {
      this.entityCountConfig.modalTitle = `${planBenefits.data.userPlanAndBenefits.membershipType} Plan Expired`
    }
    if (isPromotional == true && isDowngraded == true) {
      this.entityCountConfig.modalTitle = `Promotion Credits and '${planBenefits.data.userPlanAndBenefits.membershipType}' Plan Expired`
    }
    let openModal: boolean = false
    let downgradePlanForJobAndCandidate: boolean = false
    let downgradePlanForNetwork: boolean = false
    let downgradePlanForTeam: boolean = false
    let benefits: Array<any> = planBenefits.data.userPlanAndBenefits.benefitsUsages;
    let data: any = {}
    benefits.forEach(ele => {
      if (ele.benefitKey == 'JOB_CANDIDATE_POSTINGS') {
        if (totalcount > GigsumoConstants.FREE_PLAN_JOB_CANDIDATE_COUNT && isPromotional == true && isDowngraded == true) {
          openModal = true
          this.entityCountConfig.allowedJobsCandidatesCount = GigsumoConstants.FREE_PLAN_JOB_CANDIDATE_COUNT
        } else if (totalcount > ele.actual && isPromotional == true && isDowngraded == false) {
          openModal = true
          this.entityCountConfig.allowedJobsCandidatesCount = ele.actual
        } else if (totalcount > (GigsumoConstants.FREE_PLAN_JOB_CANDIDATE_COUNT + ele.promotional) && isPromotional == false && isDowngraded == true) {
          openModal = true
          this.entityCountConfig.allowedJobsCandidatesCount = GigsumoConstants.FREE_PLAN_JOB_CANDIDATE_COUNT + ele.promotional;
        } else if ((isDowngraded == true || isPromotional == true) && totalcount <= GigsumoConstants.FREE_PLAN_JOB_CANDIDATE_COUNT) {
          data.isDowngraded = this.entityCountConfig.isDowngraded
          data.isPromotional = this.entityCountConfig.isPromotional
          downgradePlanForJobAndCandidate = true
        }
      }
      if (ele.benefitKey == 'TEAM_WORKSPACES') {
        if (ele.utilized > GigsumoConstants.FREE_PLAN_TEAM_COUNT && isPromotional == true && isDowngraded == true) {
          openModal = true
          this.entityCountConfig.allowedWorkspaceCount = GigsumoConstants.FREE_PLAN_TEAM_COUNT
        } else if (isPromotional == false && isDowngraded == true && ele.utilized > (GigsumoConstants.FREE_PLAN_TEAM_COUNT + ele.promotional)) {
          openModal = true
          this.entityCountConfig.allowedWorkspaceCount = GigsumoConstants.FREE_PLAN_TEAM_COUNT + ele.promotional;
        } else if (isPromotional == true && isDowngraded == false && ele.utilized > ele.actual) {
          openModal = true
          this.entityCountConfig.allowedWorkspaceCount = ele.actual;
        } else if ((isDowngraded == true || isPromotional == true) && ele.utilized <= GigsumoConstants.FREE_PLAN_TEAM_COUNT) {
          data.isDowngraded = this.entityCountConfig.isDowngraded
          data.isPromotional = this.entityCountConfig.isPromotional
          downgradePlanForTeam = true
        }
      }
      if (ele.benefitKey == 'PERSONAL_NETWORKS') {
        if (ele.utilized > GigsumoConstants.FREE_PLAN_NETWORK_COUNT && isPromotional == true && isDowngraded == true) {
          openModal = true
          this.entityCountConfig.allowedNetworksCount = GigsumoConstants.FREE_PLAN_NETWORK_COUNT
        } else if (isDowngraded == true && isPromotional == false && (ele.utilized > GigsumoConstants.FREE_PLAN_NETWORK_COUNT + ele.promotional)) {
          openModal = true
          this.entityCountConfig.allowedNetworksCount = GigsumoConstants.FREE_PLAN_NETWORK_COUNT + ele.promotional;
        } else if (isDowngraded == false && isPromotional == true && ele.utilized > ele.actual) {
        } else if (isDowngraded == false && isPromotional == true && ele.utilized > ele.actual) {
          openModal = true
          this.entityCountConfig.allowedNetworksCount = ele.actual;
        } else if ((isDowngraded == true || isPromotional == true) && ele.utilized <= GigsumoConstants.FREE_PLAN_NETWORK_COUNT) {
          data.isDowngraded = this.entityCountConfig.isDowngraded
          data.isPromotional = this.entityCountConfig.isPromotional
          downgradePlanForNetwork = true
        }
      }
    })
    if (openModal) {
      this.openModals(planBenefits);
    }
    if (downgradePlanForJobAndCandidate && downgradePlanForTeam && downgradePlanForNetwork) {
      this.callDowngradeAPI(data, planBenefits);
    }
  }
  callDowngradeAPI(values, planBenefits) {
    let data: any = {}
    data.userId = localStorage.getItem('userId');
    data.updateToFreePlan = values.isDowngraded === true ? true : false;
    data.expirePrmotional = values.isPromotional === true ? true : false;
    this.API.create('user/downgradeSubscriptionPlan', data).subscribe(
      res => {
        if (res.code == "00000") {
          localStorage.setItem('MemberShipType', 'Free');
          if (data.updateToFreePlan == true && data.expirePrmotional == true) {
            this.notificationTitle = this.prepareContent('title', planBenefits, 'both');
            this.notificationContent = this.prepareContent('text', planBenefits, 'both');
          } else if (data.updateToFreePlan == true && data.expirePrmotional == false) {
            this.notificationTitle = this.prepareContent('title', planBenefits, 'planExpired');
            this.notificationContent = this.prepareContent('text', planBenefits, 'planExpired');
          } else if (data.expirePrmotional == true && data.updateToFreePlan == false) {
            this.notificationTitle = this.prepareContent('title', planBenefits, 'promotionExpired');
            this.notificationContent = this.prepareContent('text', planBenefits, 'promotionExpired');
          }
          this.showSecondaryAlert = true;
        } else if (res.code === "99998") {
          Swal.fire({
            icon: "info",
            title: "Plan already downgraded",
            timer: 2000
          })
        }
      },
      error => {
        this.util.stopLoader();
      })
  }
  prepareContent(param: 'title' | 'text', content, scenario: 'promotionExpired' | 'planExpired' | 'both'): string {
    if (scenario == 'promotionExpired') {
      if (param == 'title') {
        return `Promotion Credits Expired`;
      }
      if (param == 'text') {
        return `Your Promotional Credits have been expired on ${this.dateFormat(content.data.userPlanAndBenefits.promotionsEndDate)}`;
      }
    } else if (scenario == 'planExpired') {
      if (param == 'title') {
        return `'${content.data.userPlanAndBenefits.membershipType}' Plan Expired`;
      }
      if (param == 'text') {
        return `Your plan is moved from '${content.data.userPlanAndBenefits.membershipType}' to 'Free' as it had expired on ${this.dateFormat(content.data.userPlanAndBenefits.toDate)}`
      }
    } else if (scenario == 'both') {
      if (param == 'title') {
        return `'${content.data.userPlanAndBenefits.membershipType}' Plan and Promotional Credits Expired`
      }
      if (param == 'text') {
        return `Your '${content.data.userPlanAndBenefits.membershipType}' Plan and Promotional Credits have both expired on ${this.dateFormat(content.data.userPlanAndBenefits.toDate)} and
        ${this.dateFormat(content.data.userPlanAndBenefits.promotionsEndDate)} respectively. And your plan is downgraded to 'Free'.`
      }
    }
  }
  entityCountConfig: any = {
    allowedJobsCandidatesCount: GigsumoConstants.FREE_PLAN_JOB_CANDIDATE_COUNT,
    allowedContactsCount: 0,
    allowedWorkspaceCount: GigsumoConstants.FREE_PLAN_TEAM_COUNT,
    allowedInteractionsCount: 0,
    allowedNetworksCount: GigsumoConstants.FREE_PLAN_NETWORK_COUNT,
    modalTitle: '',
    isPromotional: false,
    isDowngraded: false,
    showClosButton: false
  }
  openModals(planBenefits) {
    this.entityCountConfig.planBenefits = planBenefits
    const initialState: CustomModalOptions = {
      keyboard: false,
      backdrop: 'static',
      class: 'modal-lg',
      ignoreBackdropClick: true,
      data: this.entityCountConfig
    }
    this.bsModalRef = this.modalService.show(PlanDowngradeModelComponent,
      Object.assign({ initialState }, initialState)
    );
    this.bsModalRef.content.closeBtnName = 'Close';
  }
  onChangeProfile(event: boolean = false) {
     if (!event) {
      this.userProfileUpdate();
    }
    else if (event) {
      // if (this.userTypeunder == null || this.gigsumono == null) {
        this.userProfileUpdate();
      // }
    }
  }
  loginUser: any = {};
  loginPhoto: string | null = null; // Initialize to null
  userProfileUpdate() {
    this.API.query("user/" + localStorage.getItem('userId')).subscribe((res) => {
      if (res) {
        this.userTypeunder = res.userType;
        this.gigsumono = res.gigsumoNo;
        this.UserName = res.firstName + " " + res.lastName
        this.emailid = res.email;
        res.photo =
          res.photo && res.photo != null
            ? AppSettings.photoUrl + res.photo
            : null;
        this.loginPhoto = res.photo;
        this.loginUser = res;
        if (this.userTypeunder == 'MANAGEMENT_TALENT_ACQUISITION') {
          this.userTypeunder = 'Manager';
        } else if (this.userTypeunder == 'BENCH_RECRUITER') {
          this.userTypeunder = 'Bench Sales';
        } else if (this.userTypeunder == 'FREELANCE_RECRUITER') {
          this.userTypeunder = 'Freelancer';
        } else {
          this.userTypeunder = this.userTypeunder && this.userTypeunder.replaceAll("_", " ")
        }
      }
    });
  }
  instantiateComponent() {
    this.generateYearsprofile();
    this.profileStatus();
  }
  instantiateDependencies() {
    this.formserchData();
    this.labelsBasedonUserType(this.userType)
    this.freeLauncherTimezone();
  }
  get getcontrolforFreelaucher() {
    return this.freeLauchtimezoneFrom.controls
  }
  freeLauncherTimezone() {
    this.freeLauchtimezoneFrom = this.fb.group({
      timeZoneCountry: [null, [Validators.required]],
      timeZone: [null, [Validators.required]]
    });
  }
  modelshowforTimeZone(timezoneforFreelauncher) {
    const config: ModalOptions = { backdrop: 'static', keyboard: false };
    this.modalRef = this.modalService.show(timezoneforFreelauncher, config);
  }
  saveusertimezone() {
    this.timezonSubmited = true;
    if (this.freeLauchtimezoneFrom.valid) {
      this.util.startLoader();
      this.API.query("user/" + this.userId).subscribe((res) => {
        res.timeZoneCountry = this.freeLauchtimezoneFrom.value.timeZoneCountry;
        res.timeZone = this.freeLauchtimezoneFrom.value.timeZone;
        this.API.create("user/updateUser", res).subscribe((res) => {
          this.util.stopLoader();
          if (res.code == "00000") {
            this.modalRef.hide();
            Swal.fire({
              icon: "success",
              title: "Updated successfully.",
              showConfirmButton: false,
              timer: 2000,
            });
            setTimeout(() => {
              this.createJobsOrCandidates(this.currentEntity, this.jobCandidateTemplate);
            }, 500);
          }
        }, err => {
        });
      });
    }
  }
  modelclose() {
    this.modalRef.hide();
    this.freeLauchtimezoneFrom.reset();
    this.gigsumoService.buttonClicked = true;
  }
  getHighLighter(value) {
    // alert("coming");
    this.pageName = value;
  }
  backdropConfig = {
    backdrop: true,
    ignoreBackdropClick: true,
    keyboard: false,
    // scroll
  };
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
  createAJob(postTemplate: TemplateRef<any>) {
    this.modalRef = this.modalService.show(postTemplate, this.backdropConfig);
  }
  openEmailDomain(postTemplate: TemplateRef<any>) {
    this.modalRef = this.modalService.show(postTemplate, this.backdropConfig);
  }
  get jobControls() {
    return this.jobPostForm.controls
  }
  candidatePostForm: UntypedFormGroup;
  get candidateControls() {
    return this.candidatePostForm.controls;
  }
  onChangeCountrypatchvalue(event, value, index) {
    if (value == "work") {
      this.workExperience.controls[index].patchValue({
        state: null,
        zipcode: null,
        city: null,
        country: event,
      });
      this.workExperience.controls.forEach((ele) => {
        ele.get("state").setValidators([Validators.required]);
        ele.get("state").updateValueAndValidity();
      });
    }
    if (event == "United States") {
    } else if (event == "AU") {
      const countryCode = event;
      this.stateListAU = [];
      this.util.startLoader();
      this.API
        .query("country/getAllStates?countryCode=" + countryCode)
        .subscribe((res) => {
          if (res) {
            this.util.stopLoader();
            this.stateListAU = res;
          }
        }, err => {
          this.util.stopLoader();
        });
    } else if (event == "IN") {
      const countryCode = event;
      this.stateListIN = [];
      this.util.startLoader();
      this.API
        .query("country/getAllStates?countryCode=" + countryCode)
        .subscribe((res) => {
          if (res) {
            this.util.stopLoader();
            this.stateListIN = res;
          }
        }, err => {
          this.util.stopLoader();
        });
    } else if (event == "CA") {
      const countryCode = event;
      this.stateListCA = [];
      this.util.startLoader();
      this.API
        .query("country/getAllStates?countryCode=" + countryCode)
        .subscribe((res) => {
          if (res) {
            this.util.stopLoader();
            this.stateListCA = res;
          }
        }, err => {
          this.util.stopLoader();
        });
    } else {
    }
  }
  onChngOrg1(value, index) {
    var data = value.organizationName + "/" + value.organizationId;
    this.util.startLoader();
    this.API.query("care/organization/" + data).subscribe((res) => {
      if (res) {
        const organisationSuggestedDetail = res[0]
        this.workExperience.controls[index].get('timeZone').enable()
        this.timeZonecountryvalues(res[0].countryCode);
        if (res[0].businessId) {
          this.workExperience.controls[index].get('country').disable()
          this.workExperience.controls[index].get('city').disable()
          this.workExperience.controls[index].get('state').disable()
          this.workExperience.controls[index].get('zipcode').disable()
          this.util.startLoader();
          this.API.query("business/details/" + res[0].businessId).subscribe((res) => {
            if (res.code == '00000') {
              this.util.stopLoader();
              if (res.data.businessModelList[0].organizationType && res.data.businessModelList[0].organizationType != null) {
                this.workExperience.controls[index].get('clientType').disable()
              } else {
                this.workExperience.controls[index].get('clientType').enable()
              }
              this.onChangeCountrypatchvalue(res.data.businessModelList[0].companyLocationDetails[0].country, 'work', index)
              setTimeout(() => {
                this.workExperience.controls[index].patchValue({
                  organisationId: organisationSuggestedDetail.organizationId,
                  clientType: res.data.businessModelList[0].organizationType,
                  country: res.data.businessModelList[0].companyLocationDetails[0].country,
                  city: res.data.businessModelList[0].companyLocationDetails[0].city,
                  state: res.data.businessModelList[0].companyLocationDetails[0].state,
                  zipcode: res.data.businessModelList[0].companyLocationDetails[0].zipCode
                })
              }, 500);
            } else {
              this.util.stopLoader();
              this.workExperience.controls[index].get('clientType').enable()
              this.workExperience.controls[index].get('country').enable()
              this.workExperience.controls[index].get('city').enable()
              this.workExperience.controls[index].get('state').enable()
              this.workExperience.controls[index].get('zipcode').enable()
              this.workExperience.controls[index].patchValue({
                clientType: null,
                country: null,
                city: null,
                state: null,
                zipcode: null
              })
            }
          }, err => {
            this.util.stopLoader();
            this.workExperience.controls[index].get('clientType').enable()
            this.workExperience.controls[index].get('country').enable()
            this.workExperience.controls[index].get('city').enable()
            this.workExperience.controls[index].get('state').enable()
            this.workExperience.controls[index].get('zipcode').enable()
            this.workExperience.controls[index].patchValue({
              clientType: null,
              country: null,
              city: null,
              state: null,
              zipcode: null
            })
          })
        } else {
          this.onChangeCountry(value.country, '');
          this.workExperience.controls[index].get('clientType').enable()
          this.workExperience.controls[index].get('country').enable()
          this.workExperience.controls[index].get('city').enable()
          this.workExperience.controls[index].get('state').enable()
          this.workExperience.controls[index].get('zipcode').enable()
          this.workExperience.controls[index].patchValue({
            clientType: null,
            country: value.country,
            city: value.city,
            state: value.state,
            zipcode: value.zipCode
          })
        }
      }
      setTimeout(() => {
        var data: any = {}
        data.userId = this.userId
        data.businessId = value.businessId
        data.organisationId = value.organizationId
        this.API.create('business/find/superadmin', data).subscribe(res => {
          if (res.code == '0000') {
            this.util.stopLoader()
            this.workExperience.controls[0].get("city").disable()
            this.workExperience.controls[0].get("state").disable()
            this.workExperience.controls[0].get("country").disable()
            this.workExperience.controls[0].get("zipcode").disable()
          } else {
            this.util.stopLoader()
          }
        })
      }, 500);
    }, err => {
      this.util.stopLoader();
    });
  }
  zipCodeValidaiton(x: number): boolean {
    if (String(x).length > 10) {
      return false;
    }
    return true;
  }
  onChngOrg2(event) {
  }
  OnChangeCurrentOrg(selectedOrg: string) {
    if (this.jobPostForm.get('clientType').value == GigsumoConstants.DIRECT_HIRE) {
      this.jobPostForm.patchValue({ clientName: this.jobPostForm.get("jobPostedBehalfOf").value })
      this.jobPostForm.get("clientName").disable();
    }
    this.jobPostedBehalfOflist.forEach(ele => {
      if (ele.orgName === selectedOrg && this.jobPostForm.get('clientType').value != GigsumoConstants.DIRECT_HIRE) {
        this.jobPostForm.get('country').patchValue(ele.country);
      } else if (ele.orgName === selectedOrg && this.jobPostForm.get('clientType').value == GigsumoConstants.DIRECT_HIRE) {
        this.jobPostForm.get('country').patchValue(ele.country);
        this.jobPostForm.get('state').patchValue(ele.state);
        this.jobPostForm.get('city').patchValue(ele.city);
        this.jobPostForm.get('zipCode').patchValue(ele.zipCode);
      }
    });
  }
  inboxCount: number = 0;
  labelToShow: Array<any> = [
    { value: 'Job Invites Sent', title: 'Outbox', url: 'JobInviteSentComponent', param: '', id: 'jobInviteSent', count: this.jobInvitesSentCount },
    { value: 'Job Applicants', title: 'Inbox', url: 'CandidateInviteComponent', param: '', id: 'jobApplicants', count: this.jobApplicationsReceivedCount },
    { value: 'Featured Candidates', title: 'Featured', url: 'FeaturedCandidateComponent', param: '', id: 'featureCandidates', count: this.totalFeaturedCandidatesCount },
    { value: 'Suggested Candidates', title: 'Suggested', url: 'SuggestedCandidateComponent', param: '', id: 'suggestedCadidate', count: this.totalSuggCandidatesCount },
    { value: 'Resume Requests Sent', title: 'Outbox', url: 'ResumeRequestSentComponent', param: '', id: 'resumeRequestSent', count: this.resumeRequestedCount },
    { value: 'Job Invites Received', title: 'Inbox', url: 'JobInviteComponent', param: '', id: 'jobInviteRecieved', count: this.jobInvitesReceivedCount },
    { value: 'Jobs Applied', title: 'Outbox', url: 'JobsAppliedByTheUserComponent', param: '', id: 'jobApplied', count: this.jobsAppliedCount },
    { value: 'Suggested Jobs', title: 'Suggested', url: 'SuggestedJobComponent', param: '', id: 'suggestedJobs', count: this.totalsuggJobsCount },
    { value: 'Featured Jobs', title: 'Featured', url: 'FeaturedJobsComponent', param: '', id: 'featureJobs', count: this.totalFeaturedJobsCount },
    { value: 'Resume Requests Received', title: 'Inbox', url: 'ResumeRequestComponent', param: '', id: 'resumeRequestRecieved', count: this.resumeRequestReceivedCount },
  ]
  isFreelanceorMTA(userType: string): boolean {
    return userType == GigsumoConstants.FREELANCE_RECRUITER || userType === GigsumoConstants.MANAGEMENT_TALENT_ACQUISITION;
  }
  labelsBasedonUserType(userType: string): Array<any> {
    return this.isFreelanceorMTA(userType) ? this.labelToShow : ((userType === GigsumoConstants.BENCH_RECRUITER || userType === GigsumoConstants.JOB_SEEKER) ? [...this.labelToShow].splice(5) : [...this.labelToShow].splice(0, 5))
  }
  figureLength: number = 0;
  selectedCountries: boolean = false
  typeTargetValue: null;
  organizationList: any = []
  // primarySkillsList: any = []
  // secondarySkillsList: any = []
  skillsList: any = []
  payTypeList: any = []
  clientTypeList: any = []
  jobPostedBehalfOflist: Array<{ country: string, orgName: string, state: string, city: string, zipCode: string }> = []
  clientNameList: any = []
  clientNameList1: any = []
  durationTypeList: any = []
  usStatesList = []
  jobId: any;
  jobClassificationList: any = []
  totalExperienceList = []
  periodList = []
  recruiterTitleList: any = []
  engagementTypeList = []
  workAuthorizationList: any = []
  jobPostForm: UntypedFormGroup;
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
  resumeupload;
  fileTypeExtension: any;
  fileDragdrop: any;
  removeFiles() {
    $("#fileDropRef")[0].value = '';
    this.fileDragdrop = "";
    this.resumeupload = "";
    this.tempFile = ""
    // this.prepareFilesList(null);
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
      onKeydown: function (e) {
        var t: string = e.currentTarget.innerText;
        var words = t.split(" ");
        // console.log(t, t.length);
        // if (words.length >= 100) {
        //   //delete key
        //   if (e.keyCode != 8)
        //     e.preventDefault();
        //   // add other keys ...
        // }
      }
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
    ], onPaste(e) {
      const buffertext = (e.originalEvent || e).clipboardData.getData("text");
      e.preventDefault();
      const all = buffertext.trim();
      document.execCommand("insertText", false, all.substring(0, 1000));
    },
  };
  filetoView: any
  onDownload() {
    const file: File = this.tempFile;
    this.downloadFile(new Blob([file]), file.name);
  }
  downloadFile(blob: Blob, fileName: string): void {
    const link = document.createElement('a');
    // create a blobURI pointing to our Blob
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    // some browser needs the anchor to be in the doc
    document.body.append(link);
    link.click();
    link.remove();
    // in case the Blob uses a lot of memory
    setTimeout(() => URL.revokeObjectURL(link.href), 0);
  }
  onFileDropped($event) {
    this.prepareFilesList($event);
  }
  tempFile: File | any;
  fileBrowseHandler(files) {
    this.prepareFilesList(files);
    this.tempFile = files[0];
  }
  prepareFilesList(files: File) {
    var fromate = ['application/pdf', 'application/docx', 'application/doc', 'text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
    if (files[0].size > this.fileSize) {
      Swal.fire("", `${this.IMAGE_ERROR}`, "info");
      $("#fileDropRef")[0].value = '';
      return true;
    }
    if (fromate.includes(files[0].type)) {
      this.fileDragdrop = files[0];
      this.resumeupload = files[0];
      $("#fileDropRef")[0].value = '';
    } else {
      this.fileDragdrop = "";
      this.resumeupload = '';
      Swal.fire({
        icon: "info",
        title: "Please upload valid formate.",
        showDenyButton: false,
        timer: 3000,
      })
    }
  }
  payType: null;
  targetRate: null;
  countryChosen: null;
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
      this.onTargetRateTyped(this.typeTargetValue, param)
    }
  }
  closeCredit() {
    this.commonVariables.creditFlag = false
    this.commonVariables.jobPostingFlag = false
    this.commonVariables.postPrivacyFlag = false
    this.commonVariables.workExperienceFlag = false
    this.commonVariables.educationFlag = false
    this.searchData.setCommonVariables(this.commonVariables)
  }
  getCountries() {
    this.countryList = [];
    this.util.startLoader();
    this.API.query("country/getAllCountries").subscribe((res) => {
      if (res != undefined) {
        res.forEach((ele) => {
          this.countryList.push(ele);
        });
      }
    }, err => {
      this.util.stopLoader();
    });
  }
  timeZonecountryvalues(countryCode) {
    if (countryCode != undefined && countryCode != "") {
      this.timezoneslist = [];
      this.API.query("user/timeZoneByCountryCode/" + countryCode).subscribe((res) => {
        if (res) {
          this.util.stopLoader();
          this.timezoneslist = res.data.zones;
        }
      }, err => {
        this.util.stopLoader();
      });
    }
  }
  userid = localStorage.getItem('userId')
  currentTime: any;
  async initiateJobForm() {
    try {
      this.util.startLoader();
      await Promise.all([
        this.getCountries(),
        this.getListValues('JOBS'),
        this.generateYears(),
        this.generateYears2()
      ]);
      var country: any = '';
      let location: Location;
      if (this.userdata1 != null) {
        this.userdata1.forEach(ele => {
          if (ele.currentOrganization == true) {
            country = ele.country;
            location = {
              country: ele.country, city: ele.city, state: this.toTitleCase(ele.state), zipCode: ele.zipcode
            };
          }
        });
        if (location != undefined) await this.onChangeCountry(location.country, '');
      }
      this.jobPostForm = new AppSettings().getCreateJobForm(location);
      var formval: any = localStorage.getItem(this.userid + "_landingPagejobPostForm");
      if (formval != null || formval != undefined) {
        formval = formval.slice(1, -1);
        var tempdata: CryptoJS.lib.WordArray = CryptoJS.AES.decrypt(decodeURIComponent(formval), "secret key");
        var decrypt: any = JSON.parse(tempdata.toString(CryptoJS.enc.Utf8));
        await new Promise(resolve => setTimeout(resolve, 3500)); // Wait for 3500 ms
        if (decrypt.secondarySkills != null) {
          decrypt.secondarySkills.forEach(ele => {
            this.secondarySkillsSelected.push(ele);
          });
        }
        if (decrypt.primarySkills != null) {
          decrypt.primarySkills.forEach(ele => {
            this.primarySkillsSelected.push(ele);
          });
        }
        if (decrypt.targetRate == 0) {
          decrypt.targetRate = '';
        }
        await new Promise(resolve => setTimeout(resolve, 500)); // Additional wait
        this.jobPostForm.patchValue(decrypt);
        this.onClientTypeChange(decrypt.clientType);
      }
    } catch (error) {
    } finally {
      this.util.stopLoader();
      (this.jobPostForm.get('primarySkills') as UntypedFormControl).valueChanges.forEach(res => { });
    }
  }
  currentOrganisationRequired: boolean = true
  removeCurrentOrgValidation() {
    this.currentOrganisationRequired = false
    this.jobPostForm.get('jobPostedBehalfOf').clearValidators();
    this.jobPostForm.get('jobPostedBehalfOf').updateValueAndValidity();
  }
  addCurrentOrgValidation() {
    this.currentOrganisationRequired = true
    this.jobPostForm.get('jobPostedBehalfOf').setValidators([Validators.required]);
    this.jobPostForm.get('jobPostedBehalfOf').updateValueAndValidity();
  }
  checkspace(event: any): boolean {
    return super.validSpace(event);
  }
  private scrollToFirstInvalidControl(id: string) {
    let form = document.getElementById(id);
    let firstInvalidControl = form.getElementsByClassName('ng-invalid')[0];
    if (firstInvalidControl != undefined) {
      firstInvalidControl.scrollIntoView();
      (firstInvalidControl as HTMLElement).focus();
    }
  }
  createJobs() {
    this.initiateJobForm();
  }
  primaryEmail: any;
  firstName: any;
  lastName: any;
  secondaryEmail: any = null;
  workExperienceDetailsCheck: any = [];
  domainList: any = []
  creditPoints: any;
  currentEntity: any;
  openModalWithComponent() {
    const initialState: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      size: "open"
    };
    this.bsModalRef = this.modalService.show(CreditModelComponent, initialState);
    this.bsModalRef.content.closeBtnName = 'Close';
  }
  callMethod() {
    this.gigsumoService.buttonClicked = true;
  }
  userdata1: any;
  currentOrg: boolean = false
  userdatacandidate: any;
  showContent: "JOBS" | "CANDIDATE";
  workExp: Array<WorkExperience>;
  async createJobsOrCandidates(param, template, called = false) {
    this.gigsumoService.buttonClicked = false;
    this.util.startLoader();
    this.currentEntity = param;
    this.showContent = param;
    if (!called) {
      let hasCurrentOrganization = await this.userService.checkIfUserHasCurrentOrganization({ userId: this.userId, userType: this.userType });
      if (!hasCurrentOrganization && this.userType != 'FREELANCE_RECRUITER') {
        this.modalRef = this.modalService.show(template, this.backdropConfig);
        this.addWorkExperience();
        this.util.stopLoader();
        return;
      }
    }
    try {
      const userData = await this.pricePlanService.UPDATE_USERDETAILS("JOB_CANDIDATE_POSTINGS");
      let availablePoints = null;
      let actualPoints = null;
      let utilizedPoints = null;
      let promotional = null;
      // Check if userData.userDetail is not null before accessing its properties
      if (userData.userDetail && userData.userDetail.userPlanAndBenefits && userData.userDetail.userPlanAndBenefits.benefitsUsages) {
        userData.userDetail.userPlanAndBenefits.benefitsUsages.forEach(ele => {
          if (ele.benefitKey == 'JOB_CANDIDATE_POSTINGS') {
            availablePoints = ele.available;
            actualPoints = ele.actual;
            utilizedPoints = ele.utilized;
            promotional = ele.promotional;
          }
        });
      } else {
        this.afterValidatingPlan(param, template);
        this.util.stopLoader();
        return;
      }
      if (userData.isExpired) {
        this.pricePlanService.expiredPopup("JOB_CANDIDATE_POSTINGS", "PAY", null, null, null, availablePoints, actualPoints, utilizedPoints, promotional);
        this.gigsumoService.buttonClicked = true;
        this.util.stopLoader();
        return;
      } else {
        this.afterValidatingPlan(param, template);
      }
    } catch (error) {
    } finally {
      this.util.stopLoader();
    }
  }
  afterValidatingPlan(param, template) {
    this.submit = false;
    this.candidateSubmit = false;
    this.commonVariables.candidatePostingFlag = false;
    this.commonVariables.jobPostingFlag = false;
    this.commonVariables.workExperienceFlag = false;
    this.commonVariables.emailDomainValidation = false;
    this.commonVariables.educationFlag = false
    this.primarySkillsSelected = [];
    this.secondarySkillsSelected = [];
    this.otherSelectedStates = [];
    this.currentDate = [];
    this.disable_for_draft = false;
    this.maxDate = [];
    this.fileDragdrop = null;
    this.commonVariables.creditFlag = false;
    this.points = 0;
    this.photoIdnew = null;
    var data: any = {}
    data.userId = this.userId
    data.userType = this.userType;
    this.util.startLoader();
    this.API.create('user/profileDetails', data).subscribe(res => {
      if (res.data && res.data.exeperienceList) {
        this.workExp = res.data.exeperienceList;
        res.data.exeperienceList.forEach(workExperience => {
          if (workExperience.currentOrganization) {
            this.currentOrg = true;
            this.currentOrganizationDetail = workExperience;
          }
          if (workExperience.currentOrganization == true) {
            this.workauthcountry = workExperience.country;
          }
        });
      }
      this.onChangeCountry(this.workauthcountry, null)
      this.firstName = res.data.userData.firstName;
      this.lastName = res.data.userData.lastName;
      this.primaryEmail = res.data.userData.email;
      if (res.data.userData.secondaryEmail == null || res.data.userData.secondaryEmail == undefined) {
        this.secondaryEmail = 'None provided'
      } else {
        this.secondaryEmail = res.data.userData.secondaryEmail
      }
      var validateEmail: any;
      validateEmail = this.primaryEmail.split('@')[1];
      this.clientType = res.data.userData.clientType
      this.userdata1 = res.data.exeperienceList
      this.userdatacandidate = res.data.exeperienceList
      res.data.GIGSUMO_GENERIC_EMAIL_DOMAINS.listItems.forEach(ele => {
        this.domainList.push(ele.item)
      })
      this.firstName = res.data.userData.firstName;
      this.lastName = res.data.userData.lastName;
      this.primaryEmail = res.data.userData.email;
      if (res.data.userData.secondaryEmail == null || res.data.userData.secondaryEmail == undefined) {
        this.secondaryEmail = 'None provided'
      } else {
        this.secondaryEmail = res.data.userData.secondaryEmail
      }
      var validateEmail: any;
      validateEmail = this.primaryEmail.split('@')[1];
      const a = this.domainList.indexOf(validateEmail)
      if (param === 'JOBS' && ((res.data.exeperienceList == null || res.data.exeperienceList.length == 0) || (res.data.exeperienceList.length > 0 && !this.currentOrg))) {
        if (this.modalRef != undefined) {
          this.modalRef.hide()
        }
        if (this.userType != 'FREELANCE_RECRUITER') {
          this.modalRef = this.modalService.show(template, this.backdropConfig);
          this.addWorkExperience(res.data.userData.clientType);
        } else {
          if (param === 'JOBS') {
            this.commonVariables.jobPostingFlag = true;
            this.commonVariables.candidatePostingFlag = false;
            this.modalRef = this.modalService.show(template, this.backdropConfig);
            this.util.stopLoader();
            if (res.data.exeperienceList) {
              res.data.exeperienceList.forEach(ele => {
                this.workExperienceDetailsCheck.push(ele)
              })
            }
            this.createJobs();
          } else if (param === 'CANDIDATE') {
            if (res.data.exeperienceList) {
              res.data.exeperienceList.forEach(ele => {
                this.workExperienceDetailsCheck.push(ele)
              })
            }
            setTimeout(() => {
              this.modalRef = this.modalService.show(template, this.backdropConfig);
            }, 1000);
            this.createCandidate();
          }
        }
      }
      /* this functionality wil bring up in future for FR **/
      //  else if (param === 'JOBS' && this.userType !== 'FREELANCE_RECRUITER' && res.data.currentTimeByTimezone == undefined) {
      //   this.modelshowforTimeZone(this.timezoneforFreelauncher);
      //   this.getCountries_forform();
      // }
      // param === 'JOBS' && (this.userType === 'FREELANCE_RECRUITER' || ((res.data.exeperienceList != null || res.data.exeperienceList.length > 0) && this.currentOrg))
      else if (param === 'JOBS' && ((res.data.exeperienceList != null || res.data.exeperienceList.length > 0) && this.currentOrg)) {
        if (this.modalRef != undefined) {
          this.modalRef.hide()
        }
        // setTimeout(() => {
        this.commonVariables.jobPostingFlag = true;
        this.commonVariables.candidatePostingFlag = false;
        this.modalRef = this.modalService.show(template, this.backdropConfig);
        this.util.stopLoader();
        // }, 2500);
        res.data.exeperienceList.forEach(ele => {
          this.workExperienceDetailsCheck.push(ele)
        })
        //if (res.data.creditPoints >= element.points || localStorage.getItem('userType') == 'student' || this.userType == 'JOB_SEEKER') {
        // this.points = element.points;
        this.createJobs();
        // } else {
        //   this.util.stopLoader();
        //   this.commonVariables.creditFlag = true
        //   this.commonVariables.educationFlag = false
        //   this.commonVariables.workExperienceFlag = false
        //   this.commonVariables.jobPostingFlag = false
        //   this.commonVariables.candidatePostingFlag = false
        //   this.commonVariables.postPrivacyFlag = false
        //   this.commonVariables.emailDomainValidation = false
        // }
      } else if (param == 'JOBS' && this.userType == 'FREELANCE_RECRUITER') {
        if (this.modalRef != undefined) {
          this.modalRef.hide()
        }
        if (res.data.exeperienceList) {
          res.data.exeperienceList.forEach(ele => {
            this.workExperienceDetailsCheck.push(ele)
          })
        }
        this.commonVariables.jobPostingFlag = true;
        this.commonVariables.candidatePostingFlag = false;
        this.modalRef = this.modalService.show(template, this.backdropConfig);
        this.util.stopLoader();
        this.createJobs();
      }
      /* this functionality wil bring up in future for FR **/
      // param === 'CANDIDATE' && this.userType != 'student' && this.userType !== 'FREELANCE_RECRUITER' && ((res.data.exeperienceList === null || res.data.exeperienceList.length === 0) || (res.data.exeperienceList.length > 0 && !this.currentOrg))
      else if (this.userType != 'FREELANCE_RECRUITER' && param === 'CANDIDATE' && ((res.data.exeperienceList === null || res.data.exeperienceList.length === 0) || (res.data.exeperienceList.length > 0 && !this.currentOrg))) {
        res.data.exeperienceList.forEach(ele => {
          this.workExperienceDetailsCheck.push(ele)
        })
        this.addWorkExperience(res.data.userData.clientType);
        this.modalRef = this.modalService.show(template, this.backdropConfig);
      }
      /* this functionality wil bring up in future for FR **/
      //  else if (param === 'CANDIDATE' && this.userType != 'JOB_SEEKER' && this.userType !== 'FREELANCE_RECRUITER' && res.data.currentTimeByTimezone == undefined) {
      //   this.modelshowforTimeZone(this.timezoneforFreelauncher);
      //   this.getCountries_forform();
      // }
      // param === 'CANDIDATE' && (this.userType === 'FREELANCE_RECRUITER' || ((res.data.exeperienceList != null || res.data.exeperienceList.length > 0) && this.currentOrg))
      else if (param === 'CANDIDATE' && ((res.data.exeperienceList != null || res.data.exeperienceList.length > 0) && this.currentOrg)) {
        if (this.userType == 'JOB_SEEKER') {
          if (res.data.candidateList) {
            if (res.data.candidateList.length >= 1) {
              this.gigsumoService.buttonClicked = true;
              this.util.stopLoader()
              Swal.fire({
                position: "center",
                icon: "info",
                title: "Number of candidates exceeded.",
                text: "You can't create more than 1 profiles for yourself as a job seeker.",
                showConfirmButton: true,
                showCancelButton: false,
                // timer: 1500,
              })
            } else if (res.data.candidateList.length < 1) {
              let element: any
              if (param == 'CANDIDATE') {
                //element = res.data.creditConsumptions.find(item => item.creditType === AppSettings.CREATE_CANDIDATE)
              } else if (param == 'JOBS') {
                //element = res.data.creditConsumptions.find(item => item.creditType === AppSettings.CREATE_JOB)
              }
              //if ((res.data.creditPoints >= element.points) || this.userType == 'student' || this.userType == 'JOB_SEEKER') {
              //this.points = element.points;
              this.createCandidate()
              setTimeout(() => {
                this.modalRef = this.modalService.show(template, this.backdropConfig);
              }, 2500);
              // } else {
              //   this.modalRef = this.modalService.show(template, this.backdropConfig);
              //   this.util.stopLoader();
              //   this.commonVariables.creditFlag = true
              //   this.redirectToCreditPage();
              //   this.commonVariables.educationFlag = false
              //   this.commonVariables.workExperienceFlag = false
              //   this.commonVariables.jobPostingFlag = false
              //   this.commonVariables.candidatePostingFlag = false
              //   this.commonVariables.postPrivacyFlag = false
              //   this.commonVariables.emailDomainValidation = false
              // }
            }
          } else {
            let element: any
            if (param == 'CANDIDATE') {
              //element = res.data.creditConsumptions.find(item => item.creditType === AppSettings.CREATE_CANDIDATE)
            } else if (param == 'JOBS') {
              //element = res.data.creditConsumptions.find(item => item.creditType === AppSettings.CREATE_JOB)
            }
            //if ((res.data.creditPoints >= element.points) || this.userType == 'JOB_SEEKER') {
            // this.points = element.points;
            this.createCandidate()
            setTimeout(() => {
              this.modalRef = this.modalService.show(template, this.backdropConfig);
            }, 2500);
            // } else {
            //   this.modalRef = this.modalService.show(template, this.backdropConfig);
            //   this.util.stopLoader();
            //   this.commonVariables.creditFlag = true
            //   this.redirectToCreditPage();
            //   this.commonVariables.educationFlag = false
            //   this.commonVariables.workExperienceFlag = false
            //   this.commonVariables.jobPostingFlag = false
            //   this.commonVariables.candidatePostingFlag = false
            //   this.commonVariables.postPrivacyFlag = false
            //   this.commonVariables.emailDomainValidation = false
            // }
          }
        }
        else {
          this.commonVariables.candidatePostingFlag = true
          this.commonVariables.jobPostingFlag = false
          this.commonVariables.workExperienceFlag = false
          this.commonVariables.emailDomainValidation = false
          this.commonVariables.educationFlag = false
          this.util.stopLoader();
          res.data.exeperienceList.forEach(ele => {
            this.workExperienceDetailsCheck.push(ele)
          })
          this.createCandidate()
          setTimeout(() => {
            this.modalRef = this.modalService.show(template, this.backdropConfig);
          }, 1000);
          // } else {
          //   setTimeout(() => {
          //     this.modalRef = this.modalService.show(template, this.backdropConfig);
          //   }, 1000);
          //   this.commonVariables.creditFlag = true
          //   this.util.stopLoader()
          //   this.redirectToCreditPage();
          //   this.commonVariables.educationFlag = false
          //   this.commonVariables.workExperienceFlag = false
          //   this.commonVariables.jobPostingFlag = false
          //   this.commonVariables.candidatePostingFlag = false
          //   this.commonVariables.postPrivacyFlag = false
          //   this.commonVariables.emailDomainValidation = false
          // }
        }
      } else if (param === 'CANDIDATE' && this.userType == 'FREELANCE_RECRUITER') {
        this.commonVariables.candidatePostingFlag = true
        this.commonVariables.jobPostingFlag = false
        this.commonVariables.workExperienceFlag = false
        this.commonVariables.emailDomainValidation = false
        this.commonVariables.educationFlag = false
        this.util.stopLoader();
        res.data.exeperienceList.forEach(ele => {
          this.workExperienceDetailsCheck.push(ele)
        })
        this.createCandidate()
        setTimeout(() => {
          this.modalRef = this.modalService.show(template, this.backdropConfig);
        }, 1000);
      }
      setTimeout(() => {
        this.gigsumoService.buttonClicked = true;
      }, 2000);
    })
  }
  getCountries_forform() {
    this.countryList = [];
    this.util.startLoader();
    this.API.query("country/getAllCountries").subscribe((res) => {
      this.util.stopLoader();
      if (res != undefined) {
        res.forEach((ele) => {
          this.countryList.push(ele);
        });
      }
    }, err => {
      this.util.stopLoader();
    });
  }
  routeToCredits() {
    this.showmodel = false
    this.modalRef.hide();
    this.router.navigate(['checkout'])
  }
  get credit() {
    return this.creditform.controls
  }
  openJobOrCandidate(openForm: { content: string, data: any }, template: TemplateRef<any>) {
    // this.modalRef = this.modalService.show(template, this.backdropConfig);
    if (openForm.content === 'JOBS') {
      this.initiateJobForm();
      this.commonVariables.jobPostingFlag = true
      this.commonVariables.candidatePostingFlag = false
      this.commonVariables.workExperienceFlag = false
      this.commonVariables.educationFlag = false
      this.commonVariables.emailDomainValidation = false
      this.searchData.setCommonVariables(this.commonVariables)
    } else if (openForm.content === 'CANDIDATE') {
      this.inititateCandidateForm();
      this.commonVariables.candidatePostingFlag = true
      this.commonVariables.jobPostingFlag = false
      this.commonVariables.workExperienceFlag = false
      this.commonVariables.educationFlag = false
      this.commonVariables.emailDomainValidation = false
      this.searchData.setCommonVariables(this.commonVariables)
    } else if (openForm.content === 'CREDIT') {
      this.commonVariables.creditFlag = true
      this.commonVariables.educationFlag = false
      this.commonVariables.workExperienceFlag = false
      this.commonVariables.jobPostingFlag = false
      this.commonVariables.candidatePostingFlag = false
      this.commonVariables.postPrivacyFlag = false
      this.commonVariables.emailDomainValidation = false
    }
    setTimeout(() => {
      this.createJobsOrCandidates(this.currentEntity, this.jobCandidateTemplate, true);
    }, 1000);
  }
  validateOtp(param) {
    if (this.domainForm.value.domainValidationOtp == null || this.domainForm.value.domainValidationOtp == '' || this.domainForm.value.domainValidationOtp == undefined) {
      this.domainForm.get('domainValidationOtp').setErrors({ wrongDomainValidationOtp: true })
    } else {
      var data: any = {}
      data.primaryMailId = this.domainForm.value.swapEmail
      if (this.secondaryEmail == null || this.secondaryEmail == undefined || this.secondaryEmail == 'None provided') {
        data.secondaryMailId = this.primaryEmail  // working pending hre abu
      } else if (this.secondaryEmail != null && this.secondaryEmail != undefined && this.secondaryEmail != 'None provided') {
        data.secondaryMailId = this.secondaryEmail
      }
      data.entityId = this.userId
      data.businessId = this.userId
      data.otp = this.domainForm.value.domainValidationOtp
      this.API.create('user/verifyOTPToPrimaryMailId', data).subscribe(res => {
        this.util.startLoader()
        if (res.code == '00000' && res.message != 'Invalid OTP') {
          this.util.stopLoader()
          this.domainForm.get('domainValidationOtp').setErrors({ wrongDomainValidationOtp: null })
          this.domainForm.get('domainValidationOtp').updateValueAndValidity({ emitEvent: false })
          this.domainForm.get('swapEmail').setErrors({ genericDomain: null })
          this.domainForm.get('swapEmail').updateValueAndValidity({ emitEvent: false })
          Swal.fire({
            position: "center",
            icon: "warning",
            title: "Please use the new business email address to login to the application, the next time you login.",
            showConfirmButton: false,
            timer: 2000,
          }).then(() => {
            this.onLogout()
            if (this.workExperienceDetailsCheck.length > 0) {
              if (param == 'JOBS') {
                this.initiateJobForm()
                setTimeout(() => {
                  this.commonVariables.jobPostingFlag = true
                  this.commonVariables.candidatePostingFlag = false
                  this.commonVariables.workExperienceFlag = false
                  this.commonVariables.educationFlag = false
                  this.commonVariables.emailDomainValidation = false
                  this.searchData.setCommonVariables(this.commonVariables)
                }, 3000);
              } else if (param == 'CANDIDATE') {
                this.inititateCandidateForm()
                setTimeout(() => {
                  this.commonVariables.candidatePostingFlag = true;
                  this.commonVariables.jobPostingFlag = false;
                  this.commonVariables.workExperienceFlag = false;
                  this.commonVariables.educationFlag = false;
                  this.commonVariables.emailDomainValidation = false;
                  this.searchData.setCommonVariables(this.commonVariables)
                }, 3000);
              }
            } else {
              if (this.userType != 'FREELANCE_RECRUITER') { this.addWorkExperience() }
            }
          })
        } else if (res.code == '99999') {
          this.util.stopLoader()
          this.domainForm.get('domainValidationOtp').setErrors({ wrongDomainValidationOtp: true })
        }
        else if (res.code == '99998') {
          this.util.stopLoader()
          this.domainForm.get('domainValidationOtp').setErrors({ wrongDomainValidationOtp: true })
        }
      })
    }
  }
  symbolsOnly(control: AbstractControl) {
    if (!/^[^`~!@#$%\^&*()_+={}|[\]\\:';"<>?,./]*$/.test(control.value)) {
      return { symbols: true };
    }
    return null;
  }
  closeValidator(param) {
    if (param == 'JOBS') {
      this.commonVariables.emailDomainValidation = false
      this.searchData.setCommonVariables(this.commonVariables)
    } else if (param == 'CANDIDATE') {
      this.commonVariables.emailDomainValidation = false
      this.searchData.setCommonVariables(this.commonVariables)
    }
  }
  get domainControl() {
    return this.domainForm.controls
  }
  closeEmailDomainValidator() {
    if (this.otpEmailSent == true) {
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: "btn btn-success",
          cancelButton: "btn btn-danger",
        },
        buttonsStyling: false,
      });
      swalWithBootstrapButtons
        .fire({
          title: "Are you sure you want to discontinue the validation?",
          text: "If you ignore this process, you may not create Jobs or Candidates.",
          icon: "info",
          showCancelButton: true,
          confirmButtonText: "Yes",
          cancelButtonText: "No",
          reverseButtons: true,
          allowOutsideClick: false,
        })
        .then((result) => {
          if (result.isConfirmed) {
            this.domainForm.get('domainValidationOtp').setErrors({ wrongDomainValidationOtp: null })
            this.domainForm.get('domainValidationOtp').updateValueAndValidity({ emitEvent: false })
            this.domainForm.get('swapEmail').setErrors({ genericDomain: null })
            this.domainForm.get('swapEmail').updateValueAndValidity({ emitEvent: false })
            this.otpEmailSent = false
            this.commonVariables.emailDomainValidation = false
            this.searchData.setCommonVariables(this.commonVariables)
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            this.commonVariables.emailDomainValidation = true
            this.searchData.setCommonVariables(this.commonVariables)
          }
        })
    } else if (this.otpEmailSent == false) {
      this.commonVariables.emailDomainValidation = false
      this.searchData.setCommonVariables(this.commonVariables)
    }
  }
  otpEmailSent: boolean = false
  domainValidatorSubmit: boolean = false
  proceedAfterValidation(param) {
    this.domainValidatorSubmit = true
    if (this.domainForm.valid) {
      this.util.startLoader()
      var validateEmail: any;
      validateEmail = this.domainForm.value.swapEmail.split('@')[1];
      const a = this.domainList.indexOf(validateEmail)
      if (a != '-1') {
        this.util.stopLoader()
        this.domainForm.get('swapEmail').setErrors({ genericDomain: true })
      } else {
        this.domainForm.get('swapEmail').setErrors({ genericDomain: null })
        this.domainForm.get('swapEmail').updateValueAndValidity({ emitEvent: false })
        // this.commonVariables.emailDomainValidation = false
        var data: any = {}
        data.email = this.domainForm.value.swapEmail
        data.firstName = this.firstName
        data.lastName = this.lastName
        data.userId = this.userId
        this.API.create('user/sendOtpToMailId', data).subscribe(res => {
          if (res.code == '00000') {
            this.util.stopLoader()
            this.otpEmailSent = true
            this.domainForm.get('domainValidationOtp').setValidators([Validators.required])
            this.domainForm.get('domainValidationOtp').updateValueAndValidity()
            this.domainForm.get('domainValidationOtp').setErrors({ wrongDomainValidationOtp: null })
            this.domainForm.get('domainValidationOtp').updateValueAndValidity({ emitEvent: false })
            this.domainForm.get('swapEmail').setErrors({ emailExistsAlready: null })
            this.domainForm.get('domainValidationOtp').updateValueAndValidity({ emitEvent: false })
          } else if (res.code == '99998') {
            this.util.stopLoader()
            // this.otpEmailSent = false
            this.domainForm.get('swapEmail').setErrors({ emailExistsAlready: true })
          }
        })
      }
    }
  }
  toTitleCase(str: string): string {
    return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }
  async inititateCandidateForm() {
    try {
      this.util.startLoader();
      const promises = [
        this.getCountries(),
        this.generateYears(),
        this.generateYears2(),
        this.getListValues('CANDIDATE')
      ];
      await Promise.all(promises);
      let location: Location;
      if (this.userdatacandidate != null) {
        this.userdatacandidate.forEach(ele => {
          if (ele.currentOrganization == true) {
            location = {
              country: ele.country,
              city: ele.city,
              state: this.toTitleCase(ele.state),
              zipCode: ele.zipcode
            };
          }
        });
        if (location != undefined) this.onChangeCountry(location.country, null);
      }
      this.candidatePostForm = new AppSettings().getCreateCandidateForm(location);
      this.searchData.setCommonVariables(this.commonVariables);
      if (this.userType == 'JOB_SEEKER') {
        this.candidatePostForm.get('candidateEmailId').clearValidators();
        this.candidatePostForm.get('candidateEmailId').updateValueAndValidity();
      }
      try {
        var userid = localStorage.getItem('userId');
        var formval: any = localStorage.getItem(userid + "_landingPagecandidatePostForm");
        if (formval != null || formval != undefined) {
          formval = formval.slice(1, -1);
          var tempdata = CryptoJS.AES.decrypt(decodeURIComponent(formval), "secret key");
          var decrypt = JSON.parse(tempdata.toString(CryptoJS.enc.Utf8));
          this.onChangeCountry(decrypt.country, '');
          if (decrypt.secondarySkills != null) {
            decrypt.secondarySkills.forEach(ele => {
              this.secondarySkillsSelected.push(ele);
            });
          }
          if (decrypt.primarySkills != null) {
            decrypt.primarySkills.forEach(ele => {
              this.primarySkillsSelected.push(ele);
            });
          }
          this.candidatePostForm.patchValue(decrypt);
        }
      } catch (error) {
        localStorage.removeItem(userid + "_landingPagecandidatePostForm");
      }
    } finally {
      this.util.stopLoader();
    }
  }
  createCandidateOnProf(event) {
    if (event.target.checked == true) {
      this.candidatePostForm.get('candidateEmailId').setValidators([Validators.required])
    } else {
      this.candidatePostForm.get('candidateEmailId').clearValidators()
      this.candidatePostForm.get('candidateEmailId').updateValueAndValidity({ emitEvent: false })
    }
  }
  candidateJobTitleList: any = []
  otherStatesList: any = []
  async createCandidate() {
    await this.inititateCandidateForm()
    if (this.userType == 'JOB_SEEKER') {
      this.candidatePostForm.patchValue({
        createCandidateOnPlatform: false,
        candidateEmailId: null,
        email: this.primaryEmail,
        firstName: this.firstName,
        lastName: this.lastName,
        createdBy: localStorage.getItem('userId')
      })
      this.candidatePostForm.get('email').disable()
      this.candidatePostForm.get('firstName').disable()
      this.candidatePostForm.get('lastName').disable()
    } else {
      this.candidatePostForm.get('email').enable()
      this.candidatePostForm.get('firstName').enable()
      this.candidatePostForm.get('lastName').enable()
      this.candidatePostForm.patchValue({
        createdBy: localStorage.getItem('userId')
      })
    }
  }
  FormData: any;
  uploadFiles: Array<any> = [];
  saveCandidate(statusvaluecandidate) {
    console.log(this.candidatePostForm);
    this.candidateSubmit = true
    this.disable_for_draft = true;
    if (statusvaluecandidate == 'ALL' && this.candidatePostForm.status == "INVALID") {
      this.disable_for_draft = false;
      this.scrollToFirstInvalidControl('candidatefrom')
      return true;
    }
    localStorage.removeItem(this.userid + '_landingPagecandidatePostForm');
    this.FormData = new FormData();
    this.FormData.append("resume", this.resumeupload);
    this.candidatePostForm.patchValue({ 'createdByUserType': localStorage.getItem('userType') })
    this.candidatePostForm.value.createdByUserType = localStorage.getItem('userType')
    if (this.photoIdnew != null || this.photoIdnew != undefined) {
      this.candidatePostForm.value.photo = this.photoIdnew;
      this.candidatePostForm.patchValue({ 'photo': this.photoIdnew })
    }
    if (statusvaluecandidate == "DRAFTED") {
      for (var allstatus in this.candidatePostForm.controls) {
        if (allstatus != 'firstName' && allstatus != 'lastName') {
          this.candidatePostForm.get(allstatus).clearValidators();
        }
        this.candidatePostForm.controls[allstatus].updateValueAndValidity();
      }
      this.candidatePostForm.get('status').patchValue('DRAFTED');
    }
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: { confirmButton: 'btn btn-success', cancelButton: 'btn btn-danger' },
      buttonsStyling: false
    })
    if (statusvaluecandidate != "DRAFTED") {
      this.savecandidateafterValdaiton();
    } else {
      this.draftsavecandidate(statusvaluecandidate)
    }
  }
  savecandidateafterValdaiton() {
    this.router.routeReuseStrategy.shouldReuseRoute = function(){return false;};
    localStorage.removeItem(this.userid + '_landingPagecandidatePostForm');
    this.FormData = new FormData();
    this.FormData.append("resume", this.resumeupload);
    this.resumeupload = "";
    let datas: any = {};
    datas = this.candidatePostForm.getRawValue();
    datas.createdBy = localStorage.getItem('userId');
    if (this.currentOrganizationDetail && this.currentOrganizationDetail.organisationId) {
      datas.organisationId = this.currentOrganizationDetail.organisationId;
      this.candidatePostForm.get('organisationId').patchValue(this.currentOrganizationDetail.organisationId);
    }
    const currentStatus: string = this.candidatePostForm.value.status;
    datas.candidateReferenceId = datas.candidateId;
    this.FormData.append("candidate", new Blob([JSON.stringify(datas)], { type: "application/json" }));
    this.util.startLoader();
    this.canidateStreamData = [];
    this.API.create('candidates/createCandidate', this.FormData).subscribe(res => {
      this.searchData.setCandiHighLight(this.candidatePostForm.value.candidateId);
      this.util.startLoader()
      this.fileshow = undefined;
      if (res.code == '00000') {
        this.gtag.event('candidate-creation', {
          'app-name': 'Gigsumo',
          'screen-name': 'header'
        })
        this.photoIdnew = null;
        if (environment.AsyncSync == "SYNC") {
          if (res.code == '00000') {
            this.disable_for_draft = false;
            // clear subscriber response
            this.canidateStreamData = [];
            this.candidateSubmit = false
            this.util.stopLoader();
            this.modalRef.hide();
            let data: any = {}
            data.count = 1;
            data.flag = true;
            data.status = res.data.candidateData.status
            this.searchData.setcandiadateCount(data);
            this.searchData.setcandidateform(localStorage.getItem('candidateForm'));
            this.currentDate = [];
            this.maxDate = [];
            Swal.fire({
              position: "center",
              icon: "success",
              allowOutsideClick: false,
              allowEscapeKey: false,
              title: super.getTextBasedOnStatus(currentStatus, currentStatus === GigsumoConstants.DRAFTED ? "Draft saved" : "Candidate created"),
              showConfirmButton: false,
              timer: 2000,
            }).then(() => {
              this.modalService.hide(1);
              this.modalService.hide(2);
              this.modalService.hide(3);
              this.commonVariables.jobPostingFlag = false
              this.commonVariables.workExperienceFlag = false
              this.commonVariables.educationFlag = false
              this.searchData.setCommonVariables(this.commonVariables)
            })
            setTimeout(() => {
              this.router.navigate(["newcandidates"], { queryParams: { createCandidate: res.data.candidateData.candidateId, status: this.candidatePostForm.get('status').value } });
              this.searchData.setHighlighter('newcandidates')
              this.d = "newcandidates";
            }, 100);
            setTimeout(() => {
              this.pageName = 'newcandidates'
              if (this.pageName == 'newcandidates') {
                this.commonVariables.loadCandidates = true
              }
            }, 100);
          }
        }
        else if (environment.AsyncSync == "ASYNC") {
          let timeout: any = undefined;
          // 3 mins validate
          this.rxjsTimer.pipe(takeUntil(this.destroy)).subscribe((val) => {
            timeout = val;
          });
          const source = interval(0);
          this.subscription = source.subscribe(val => {
            // time out
            if (timeout != undefined) {
              this.canidateStreamData = [];
              this.util.stopLoader();
              this.subscription.unsubscribe();
              Swal.fire({
                position: "center",
                icon: "info",
                title: "Candidate is being created. Please refresh the page",
                showConfirmButton: false,
                allowEscapeKey: false,
                allowOutsideClick: false,
                timer: 1500,
              })
            }
            if (this.canidateStreamData && this.canidateStreamData.code == "00000") {
              this.util.stopLoader();
              // clear subscriber
              this.subscription.unsubscribe();
              if (this.canidateStreamData != undefined && this.canidateStreamData.length != 0 && this.canidateStreamData.code == "00000" && res.data.candidateData.candidateId == this.streamData.requestId) {
                if (res.code == '00000') {
                  this.disable_for_draft = false;
                  // clear subscriber response
                  this.canidateStreamData = [];
                  this.stremService.clearsubjectvalue();
                  this.candidateSubmit = false
                  this.util.stopLoader();
                  this.modalRef.hide();
                  let data: any = {}
                  data.count = 1;
                  data.flag = true;
                  data.status = res.data.candidateData.status
                  this.searchData.setcandiadateCount(data);
                  this.searchData.setcandidateform(localStorage.getItem('candidateForm'));
                  this.currentDate = [];
                  this.maxDate = [];
                  Swal.fire({
                    position: "center",
                    icon: "success",
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    title: super.getTextBasedOnStatus(currentStatus, currentStatus === GigsumoConstants.DRAFTED ? "Draft saved" : "Candidate created"),
                    showConfirmButton: false,
                    timer: 2000,
                  }).then(() => {
                    this.modalService.hide(1);
                    this.modalService.hide(2);
                    this.modalService.hide(3);
                    this.commonVariables.jobPostingFlag = false
                    this.commonVariables.workExperienceFlag = false
                    this.commonVariables.educationFlag = false
                    this.searchData.setCommonVariables(this.commonVariables)
                  })
                  setTimeout(() => {
                    this.router.navigate(["newcandidates"], { queryParams: { createCandidate: res.data.candidateData.candidateId, status: this.candidatePostForm.get('status').value } });
                    this.searchData.setHighlighter('newcandidates');
                    this.d = "newcandidates";
                  }, 100);
                  setTimeout(() => {
                    this.pageName = 'newcandidates'
                    if (this.pageName == 'newcandidates') {
                      this.commonVariables.loadCandidates = true
                      this.searchData.setLoadJobOrCandidate(this.commonVariables)
                    }
                  }, 200);
                } else {
                  Swal.fire({
                    position: "center",
                    icon: "info",
                    title: "Candidate is being created. Please refresh the page",
                    showConfirmButton: false,
                    allowEscapeKey: false,
                    allowOutsideClick: false,
                  });
                }
              }
            }
          });
        }
      }
    });
  }
  // cancel validation check
  cancelJob() {
    this.submit = false
    if (this.jobPostForm && this.jobPostForm.get('clientName').value != null && this.jobPostForm.value.jobTitle != null) {
      this.jobPostForm.get('status').patchValue('DRAFTED');
      this.draftsavecancel('DRAFTED');
    } else if (this.jobPostForm) {
      this.commonVariables.jobPostingFlag = false
      this.searchData.setCommonVariables(this.commonVariables)
      this.modalRef.hide();
      this.jobPostForm.reset()
      this.primarySkillsSelected = [];
      this.secondarySkillsSelected = [];
      this.primarySkillsList = []
      this.secondarySkillsList = []
      this.otherSelectedStates = []
    }
  }
  cancelcloseCandidate() {
    this.candidateSubmit = false
    if (this.candidatePostForm.value.firstName != null && this.candidatePostForm.value.lastName != null) {
      this.candidatePostForm.get('status').patchValue('DRAFTED');
      this.draftsavecandidate('DRAFTED');
    } else {
      this.commonVariables.candidatePostingFlag = false
      this.searchData.setCommonVariables(this.commonVariables)
      this.modalRef.hide();
      this.candidatePostForm.reset()
      this.primarySkillsSelected = [];
      this.secondarySkillsSelected = [];
      this.otherSelectedStates = []
    }
  }
  clientType: any;
  modalRef: BsModalRef;
  serverCurrentDate: string;
  saveJob(statusvalue) {
    this.submit = true
    this.disable_for_draft = true;
    if (statusvalue == 'ALL' && this.jobPostForm.status == "INVALID") {
      this.disable_for_draft = false;
      this.scrollToFirstInvalidControl('jobfrom')
      return true;
    }
    this.streamData = [];
    localStorage.removeItem(this.userid + '_landingPagejobPostForm');
    this.submit = true
    if (statusvalue === "DRAFTED") {
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
      if (statusvalue != "DRAFTED") {
        this.savejobafterValdaiton();
      } else {
        this.draftsavecancel(statusvalue)
      }
    }
  }
  selectMenu(value) {
    this.pageName = value;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate([value]));
    this.searchData.setHighlighter([value]);
    if (value == "landingPage") {
      this.JobServicecolor.reloadComponent(); // Emit reload signal when value is "landingPage"
    }
  }
  draftsavecancel(statusvalue) {
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
        this.jobPostForm.get('status').patchValue('DRAFTED');
        this.savejobafterValdaiton();
      } else {
        this.jobPostForm.get('status').patchValue('ACTIVE');
        if (statusvalue != 'DRAFTED') {
          this.savejobafterValdaiton();
        } else {
          this.commonVariables.jobPostingFlag = false
          this.searchData.setCommonVariables(this.commonVariables)
          this.modalRef.hide();
          this.jobPostForm.reset()
          this.primarySkillsSelected = [];
          this.secondarySkillsSelected = [];
          this.primarySkillsList = []
          this.secondarySkillsList = []
          this.otherSelectedStates = []
        }
      }
    });
  }
  draftsavecandidate(statusvaluecandidate) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: { confirmButton: 'btn btn-success', cancelButton: 'btn btn-danger' },
      buttonsStyling: false
    })
    swalWithBootstrapButtons.fire({
      title: 'Save as Draft',
      text: "Would you like to save it as a draft? You can edit this later and save. If No is selected,all the changes will be lost.",
      icon: 'info',
      showCancelButton: true,
      allowOutsideClick: false,
      allowEscapeKey: false,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        if (statusvaluecandidate == 'DRAFTED') {
          this.candidatePostForm.get('status').patchValue('DRAFTED');
        }
        this.savecandidateafterValdaiton();
      } else {
        this.candidatePostForm.get('status').patchValue('DRAFTED');
        if (statusvaluecandidate != 'DRAFTED') {
          this.candidatePostForm.get('status').patchValue('DRAFTED');
          this.savecandidateafterValdaiton();
        } else {
          this.commonVariables.jobPostingFlag = false
          this.searchData.setCommonVariables(this.commonVariables)
          this.modalRef.hide();
          this.candidatePostForm.reset()
          this.primarySkillsSelected = [];
          this.secondarySkillsSelected = [];
          this.primarySkillsList = []
          this.secondarySkillsList = []
          this.otherSelectedStates = []
        }
      }
    });
  }
  savejobafterValdaiton() {
    this.router.routeReuseStrategy.shouldReuseRoute = function(){return false;};
    localStorage.removeItem(this.userid + '_landingPagejobPostForm');
    this.util.startLoader();
    this.jobStreamData = [];
    let datas: any = {};
    datas = this.jobPostForm.getRawValue();
    datas.jobPostedBy = localStorage.getItem('userId');
    if (this.currentOrganizationDetail && this.currentOrganizationDetail.organisationId) {
      datas.organisationId = this.currentOrganizationDetail.organisationId;
    }
    // Check if this.workExp is defined before accessing it
    if (this.workExp && this.workExp.length > 0) {
      this.workExp.forEach(ele => {
        if (ele.currentOrganization == true) {
          this.clientType = ele.clientType;
          datas.createdByType = this.clientType;
        }
      });
    }
    datas.jobReferenceId = this.jobPostForm.value.jobId;
    const currentStatus: string = this.jobPostForm.value.status;
    this.API.create('jobs/createJob', datas).subscribe(res => {
      if (res.code == '00000') {
        this.gtag.event('job-creation', {
          'app-name': 'Gigsumo',
          'screen-name': 'feed'
        })
        this.util.stopLoader();
        if (environment.AsyncSync == "SYNC") {
          if (res.code == '00000') {
            this.disable_for_draft = false;
            this.jobStreamData = [];
            let data: any = {}
            data.count = 1;
            data.flag = true;
            data.status = res.data.jobData.status
            // this.searchData.setjobCount(data);
            this.searchData.setjobform(localStorage.getItem('jobForm'));
            this.searchData.setjobHighLight(this.jobPostForm.value.jobId);
            this.submit = false
            this.modalRef.hide();
            this.currentDate = [];
            this.maxDate = [];
            Swal.fire({
              position: "center",
              icon: "success",
              title: super.getTextBasedOnStatus(currentStatus, currentStatus === GigsumoConstants.DRAFTED ? "Draft saved" : "Job created"),
              showConfirmButton: false,
              allowEscapeKey: false,
              allowOutsideClick: false,
              timer: 2000,
            }).then(() => {
              this.commonVariables.jobPostingFlag = false
              this.searchData.setCommonVariables(this.commonVariables)
              this.modalService.hide(1);
              this.modalService.hide(2);
              this.modalService.hide(3);
            })
            setTimeout(() => {
              this.router.navigate(["newjobs"], { queryParams: { createJob: res.data.jobData.jobId, status: data.status } });
              this.searchData.setHighlighter('newjobs')
            }, 2000);
          }
        } else if (environment.AsyncSync == "ASYNC") {
          let timeout: any = undefined;
          // 3 mins validate
          this.rxjsTimer.pipe(takeUntil(this.destroy)).subscribe((val) => {
            timeout = val;
          });
          const source = interval(0);
          this.subscription = source.subscribe(val => {
            if (timeout != undefined) {
              this.jobStreamData = [];
              this.util.stopLoader();
              Swal.fire({
                position: "center",
                icon: "info",
                title: "Job is being created. Please refresh the page",
                showConfirmButton: false,
                allowEscapeKey: false,
                allowOutsideClick: false,
                timer: 1500,
              })
              this.subscription.unsubscribe();
              this.modalService.hide(1)
            }
            if (this.jobStreamData && this.jobStreamData != undefined && this.jobStreamData.length != 0 && this.jobStreamData != null) {
              this.util.stopLoader();
              this.subscription.unsubscribe();
              if (this.jobStreamData.length != 0 && this.jobStreamData != undefined && this.jobStreamData.code == "00000" && res.data.jobData.jobId == this.streamData.requestId) {
                if (res.code == '00000') {
                  this.disable_for_draft = false;
                  this.subscription.unsubscribe();
                  this.jobStreamData = [];
                  this.stremService.clearsubjectvalue();
                  let data: any = {}
                  data.count = 1;
                  data.flag = true;
                  data.status = res.data.jobData.status;
                  this.searchData.setjobCount(data);
                  this.searchData.setjobform(localStorage.getItem('jobForm'));
                  this.submit = false
                  this.modalRef.hide();
                  this.currentDate = [];
                  this.maxDate = [];
                  Swal.fire({
                    position: "center",
                    icon: "success",
                    title: super.getTextBasedOnStatus(currentStatus, currentStatus === GigsumoConstants.DRAFTED ? "Draft saved" : "Job created"),
                    showConfirmButton: false,
                    allowEscapeKey: false,
                    allowOutsideClick: false,
                    timer: 2000,
                  }).then(() => {
                    this.commonVariables.jobPostingFlag = false
                    this.searchData.setCommonVariables(this.commonVariables)
                    this.modalService.hide(1);
                    this.modalService.hide(2);
                    this.modalService.hide(3);
                  })
                  setTimeout(() => {
                    this.router.navigate(["newjobs"], { queryParams: { createJob: res.data.jobData.jobId, status: data.status } });
                    this.searchData.setHighlighter('newjobs')
                  }, 2000);
                }
              } else {
                Swal.fire({
                  position: "center",
                  icon: "info",
                  title: "Job is being created. Please refresh the page",
                  showConfirmButton: false,
                  allowEscapeKey: false,
                  allowOutsideClick: false,
                  timer: 1500,
                })
              }
            }
          });
        }
        // }, 2500);
      }
    }, err => {
      this.util.stopLoader();
    });
  }
  // private formatDateddd(date) {
  //   const d = new Date(date);
  //   let month = '' + (d.getMonth() + 1);
  //   let day = '' + d.getDate();
  //   const year = d.getFullYear();
  //   if (month.length < 2) month = '0' + month;
  //   if (day.length < 2) day = '0' + day;
  //   return [year, month, day].join('-');
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
  freelancerInternalHireFlag: boolean = false
  onClientTypeChange(value) {
    if (this.userType != 'FREELANCE_RECRUITER') {
      this.freelancerInternalHireFlag = false
      if (value == GigsumoConstants.DIRECT_HIRE) {
        this.jobPostForm.patchValue({ clientName: this.jobPostedBehalfOflist[0].orgName })
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
    if (value == GigsumoConstants.DIRECT_HIRE && this.userType != "FREELANCE_RECRUITER") {
      this.onChangeCountry(this.jobPostedBehalfOflist[0].country, '');
      const stateTitleCase = this.toTitleCase(this.jobPostedBehalfOflist[0].state);
      this.jobPostForm.patchValue({ country: this.jobPostedBehalfOflist[0].country })
      this.jobPostForm.patchValue({ city: this.jobPostedBehalfOflist[0].city })
      this.jobPostForm.patchValue({ state: stateTitleCase });
      this.jobPostForm.patchValue({ zipCode: this.jobPostedBehalfOflist[0].zipCode })
    } else if (value == GigsumoConstants.DIRECT_HIRE && this.userType === "FREELANCE_RECRUITER") {
      this.jobPostedBehalfOflist.forEach(ele => {
        if (ele.orgName === this.jobPostForm.get('jobPostedBehalfOf').value) {
          this.onChangeCountry(ele.country, '');
          this.jobPostForm.get('country').patchValue(ele.country);
          this.jobPostForm.get('city').patchValue(ele.city);
          this.jobPostForm.get('state').patchValue(this.toTitleCase(ele.state));
          this.jobPostForm.get('zipCode').patchValue(ele.zipCode);
        }
      })
    } else if (value != GigsumoConstants.DIRECT_HIRE) {
      this.jobPostForm.get('country').patchValue(null)
      this.jobPostForm.get('state').patchValue(null)
      this.jobPostForm.get('city').patchValue(null)
      this.jobPostForm.get('zipCode').patchValue(null)
    }
  }
  onengagementTypeChange(value) {
    if (value == 'W2 - Full Time') {
      this.jobPostForm.get('duration').disable();
      this.jobPostForm.get('durationType').disable();
      this.updateControl({ value: 'duration', form: this.jobPostForm }, "CLEAR");
      this.updateControl({ value: 'durationType', form: this.jobPostForm }, "CLEAR");
    } else {
      this.updateControl({ value: 'duration', form: this.jobPostForm });
      this.updateControl({ value: 'durationType', form: this.jobPostForm });
      this.jobPostForm.get('duration').enable();
      this.jobPostForm.get('durationType').enable();
      this.jobPostForm.get('durationType').patchValue('Months');
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
  profileyears: any = []
  generateYearsprofile() {
    var max = new Date().getFullYear();
    var min = max - 80;
    for (var i = min; i <= max; i++) {
      this.profileyears.push(i);
    }
  }
  dateFormat(date: any): string {
    if (date != null) {
      let date1 = new Date(date);
      let date_transform = this.datePipe.transform(date1, 'MM/dd/yyyy')
      return date_transform;
    }
  }
  primarySkillsSelected = [];
  secondarySkillsSelected = [];
  stateListCA: any = []
  stateListIN: any = []
  stateListAU: any = []
  countryList: any = [];
  secondarySkillsList: any = []
  primarySkillsList: any = []
  submit: boolean = false
  widgetload(widgetName: string, count) {
    let dataPass: any = {};
    if (widgetName == "JobInviteComponent") {
      dataPass.menu = "Job Invites Received";
    } else if (widgetName == "ResumeRequestComponent") {
      dataPass.menu = "Resume Request Recieved";
    } else if (widgetName == "CandidateInviteComponent") {
      dataPass.menu = "Job Applicants";
    } else if (widgetName == "SuggestedJobComponent") {
      dataPass.menu = "Suggested Jobs";
    } else if (widgetName == "SuggestedCandidateComponent") {
      dataPass.menu = "Suggested Candidates";
    } else if (widgetName == "FeaturedJobsComponent") {
      dataPass.menu = "Featured Jobs";
    } else if (widgetName == "FeaturedCandidateComponent") {
      dataPass.menu = "Featured Candidates";
    }
    else if (widgetName === "ResumeRequestSentComponent") {
      dataPass.menu = "Resume Requests Sent"
    } else if (widgetName === "JobInviteSentComponent") {
      dataPass.menu = "Job Invites Sent"
    } else if (widgetName === "JobsAppliedByTheUserComponent") {
      dataPass.menu = "Jobs Applied"
    }
    dataPass.master = "HEADER_WIDGETS";
    dataPass.masterMenu = "HEADER_WIDGETS";
    dataPass.widgetName = widgetName;
    dataPass.count = count;
    // if(count>0){
    this.router.navigate(['suggestions'], { queryParams: dataPass });
    //}
  }
  // modelopen(data) {
  //   let dataPass: any = {};
  //   dataPass.data = data;
  //   dataPass.menu = this.widgetDesc;
  //   dataPass.master = this.page;
  //   dataPass.masterMenu = this.inputData;
  //   dataPass.widgetName = "JobInviteComponent";
  //   dataPass.count = this.totalCount;
  //   this.router.navigate(['suggestions'], { queryParams: dataPass })
  //  }
  getListValues(param) {
    this.clientTypeList = []
    this.jobPostedBehalfOflist = []
    this.payTypeList = []
    this.secondarySkillsList = []
    this.primarySkillsList = []
    this.periodList = []
    this.recruiterTitleList = []
    this.totalExperienceList = []
    this.workAuthorizationList = []
    this.durationTypeList = []
    this.engagementTypeList = []
    this.util.startLoader()
    var data: any = { "domain": "ENGAGEMENT_TYPE,CLIENT_TYPE,PAY_TYPE,DURATION,PRIMARY_SKILLS,WORK_AUTHORIZATION,CANDIDATE_AVAILABLITY,TOTAL_EXPERIENCE,SECONDARY_SKILLS,GIGSUMO_SKILLS_LIST,GIGSUMO_JOB_TITLE,GIGSUMO_RECRUITERS_TITLE_LIST" }
    if (param == 'JOBS') {
      data.type = 'JOB';
    } else if (param == 'CANDIDATE') {
      data.type = 'CANDIDATE';
    }
    data.userId = localStorage.getItem("userId");
    this.API.create('listvalue/findbyList', data).subscribe(res => {
      if (res.code == '00000') {
        this.jobId = res.data.jobId;
        if (param != 'CANDIDATE') {
          this.jobPostForm.patchValue({ 'jobId': res.data.jobId });
          this.util.startLoader();
          this.API.query('business/check/orgname/' + this.userId).subscribe(res => {
            this.util.stopLoader();
            if (res.code == '00000' || '10008') {
              if (res.data != null && res.data.organisation != null && res.data.organisation.length != 0) {
                let organisations: Array<any> = res.data.organisation;
                res.data.organisation.forEach(ele => {
                  this.jobPostedBehalfOflist.push({ country: ele.country, orgName: ele.organizationName, state: ele.state, zipCode: ele.zipCode, city: ele.city })
                  if (this.userType == 'FREELANCE_RECRUITER' && organisations.length > 1) {
                    this.jobPostForm.get('jobPostedBehalfOf').enable()
                    this.addCurrentOrgValidation();
                  } else if (this.userType == 'FREELANCE_RECRUITER' && organisations.length == 1) {
                    this.jobPostForm.get('jobPostedBehalfOf').patchValue(ele.organizationName);
                    this.jobPostForm.get('jobPostedBehalfOf').disable();
                    this.addCurrentOrgValidation();
                  } else {
                    this.jobPostForm.get('jobPostedBehalfOf').patchValue(ele.organizationName);
                    this.jobPostForm.get('jobPostedBehalfOf').disable()
                    if (this.userType == 'FREELANCE_RECRUITER') {
                      this.removeCurrentOrgValidation();
                    }
                  }
                })
              } else if (res.code == '10002') {
                if (this.userType == 'FREELANCE_RECRUITER') {
                  this.removeCurrentOrgValidation();
                }
                this.jobPostForm.get('jobPostedBehalfOf').disable()
              }
            } else if (res.code == '10002') {
              if (this.userType == 'FREELANCE_RECRUITER') {
                this.removeCurrentOrgValidation();
              }
              this.jobPostForm.get('jobPostedBehalfOf').disable()
            }
          });
        }
        if (param === 'CANDIDATE') {
          this.candidatePostForm.patchValue({ 'candidateId': res.data.candidateId });
          this.usStatesList = []
          this.API.query("country/getAllStates?countryCode=US")
            .subscribe((res) => {
              if (res) {
                res.forEach(ele => {
                  this.usStatesList.push(ele.stateName)
                  this.otherStatesList.push(ele.stateName)
                })
              }
            }, err => {
              this.util.stopLoader();
            });
        }
        res.data.CLIENT_TYPE.listItems.forEach(ele => {
          this.clientTypeList.push(ele.item)
          var mySet = new Set(this.clientTypeList);
          this.clientTypeList = [...mySet]
        })
        res.data.PAY_TYPE.listItems.forEach(ele => {
          this.payTypeList.push(ele.item)
          var mySet = new Set(this.payTypeList);
          this.payTypeList = [...mySet]
        })
        res.data.SECONDARY_SKILLS.listItems.forEach(ele => {
          if (ele.item) {
            this.secondarySkillsList.push(ele.item)
            var mySet = new Set(this.secondarySkillsList);
            this.secondarySkillsList = [...mySet]
          }
        })
        res.data.PRIMARY_SKILLS.listItems.forEach(ele => {
          if (ele.item) {
            this.primarySkillsList.push(ele.item)
            var mySet = new Set(this.primarySkillsList);
            this.primarySkillsList = [...mySet]
          }
        })
        res.data.CANDIDATE_AVAILABLITY.listItems.forEach(ele => {
          this.periodList.push(ele.item)
          var mySet = new Set(this.periodList);
          this.periodList = [...mySet]
        })
        res.data.TOTAL_EXPERIENCE.listItems.forEach(ele => {
          this.totalExperienceList.push(ele.item)
          var mySet = new Set(this.totalExperienceList);
          this.totalExperienceList = [...mySet]
        })
        res.data.ENGAGEMENT_TYPE.listItems.forEach(ele => {
          this.engagementTypeList.push(ele.item)
          var mySet = new Set(this.engagementTypeList);
          this.engagementTypeList = [...mySet]
        })
        res.data.DURATION.listItems.forEach(ele => {
          this.durationTypeList.push(ele.item)
          var mySet = new Set(this.durationTypeList);
          this.durationTypeList = [...mySet]
        })
        res.data.GIGSUMO_JOB_TITLE.listItems.forEach(ele => {
          this.candidateJobTitleList.push(ele.item)
          var mySet = new Set(this.candidateJobTitleList);
          this.candidateJobTitleList = [...mySet]
        })
        res.data.GIGSUMO_RECRUITERS_TITLE_LIST.listItems.forEach(ele => {
          this.recruiterTitleList.push(ele.item)
        })
        if (param === 'JOBS') {
          this.util.stopLoader();
        }
        setTimeout(() => {
          if (param == 'CANDIDATE') {
            this.util.stopLoader()
            this.commonVariables.jobPostingFlag = false
            this.commonVariables.candidatePostingFlag = true
            this.commonVariables.workExperienceFlag = false
            this.commonVariables.educationFlag = false
            this.searchData.setCommonVariables(this.commonVariables)
          } else if (param == 'JOBS') {
            this.util.stopLoader()
            this.commonVariables.jobPostingFlag = true
            this.commonVariables.candidatePostingFlag = false
            this.commonVariables.workExperienceFlag = false
            this.commonVariables.educationFlag = false
            this.searchData.setCommonVariables(this.commonVariables)
          }
        }, 2000);
      }
    })
  }
  onChangePeriod(value) {
  }
  jobformreset() {
    this.submit = false;
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    });
    swalWithBootstrapButtons.fire({
      title: 'Are you sure ?',
      text: " All data will be lost",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      reverseButtons: true
    }).then(result => {
      if (result.isConfirmed) {
        this.jobPostForm.reset({ jobId: this.jobPostForm.get('jobId').value, jobPostedBehalfOf: this.jobPostForm.get('jobPostedBehalfOf').value, durationType: 'Months' })
        this.jobPostForm.get('city').enable();
        this.jobPostForm.get('country').enable();
        this.jobPostForm.get('state').enable();
        this.jobPostForm.get('zipCode').enable();
        this.jobPostForm.get('clientType').enable();
        this.jobPostForm.get('duration').enable();
        this.jobPostForm.get('durationType').enable();
        this.updateControl({ value: 'duration', form: this.jobPostForm });
        this.updateControl({ value: 'durationType', form: this.jobPostForm });
        localStorage.removeItem(this.userid + "_landingPagejobPostForm");
      }
    })
  }
  candidateformreset() {
    this.candidateSubmit = false;
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    });
    swalWithBootstrapButtons.fire({
      title: 'Are you sure ?',
      text: " All data will be lost.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'cancel',
      reverseButtons: true
    }).then(result => {
      if (result.isConfirmed) {
        this.candidatePostForm.reset();
        this.candidatePostForm.get('workAuthorization').disable();
        this.workAuthorizationList = []
        setTimeout(() => {
          if (this.userType === 'JOB_SEEKER') {
            this.candidatePostForm.patchValue({
              email: this.primaryEmail,
              firstName: this.firstName,
              lastName: this.lastName,
            })
            this.candidatePostForm.get('email').disable()
            this.candidatePostForm.get('firstName').disable()
            this.candidatePostForm.get('lastName').disable();
          }
          localStorage.removeItem(this.userid + "_landingPagecandidatePostForm");
        }, 500);
      }
    })
  }
  getInitials(firstname: string, lastname: string): string {
    return this.JobServicecolor.getInitialsparam(firstname, lastname);
  }
  getColor(firstname: string, lastname: string): string {
    return this.JobServicecolor.getColorparam(firstname, lastname);
  }
  getInitialsfullname(fullname: string): string {
    return this.JobServicecolor.getInitials(fullname);
  }
  getColorfullname(fullname: string): string {
    return this.JobServicecolor.getColor(fullname);
  }
  formfield() {
    let location: Location;
    if (this.userdatacandidate != null) {
      this.userdatacandidate.forEach(ele => {
        if (ele.currentOrganization == true) {
          location = {
            country: ele.country, city: ele.city, state: this.toTitleCase(ele.state), zipCode: ele.zipcode
          };
        }
      })
    }
    this.candidatePostForm = new AppSettings().getCreateCandidateForm(location);
  }
  onChangeCountry_timezone(event) {
    this.countryChosen = event;
    this.timeZonecountryvalues(this.countryChosen);
  }
  workflag: boolean = false;
  onChangeCountry(event, param) {
    this.countryChosen = event;
    if (this.candidatePostForm == undefined) {
      this.formfield();
      setTimeout(() => {
        this.candidatePostForm.get('workAuthorization').enable();
      }, 1500);
    }
    if (param == 'jobs') {
      this.jobPostForm.get('city').patchValue(null)
      this.jobPostForm.get('state').patchValue(null)
      this.jobPostForm.get('zipCode').patchValue(null)
    }
    if (param == 'candidates') {
      this.candidatePostForm.get('city').patchValue(null)
      this.candidatePostForm.get('state').patchValue(null)
      this.candidatePostForm.get('zipCode').patchValue(null)
    }
    this.timeZonecountryvalues(this.countryChosen);
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
    if (event == "US" && this.candidatePostForm != undefined) {
      this.candidatePostForm.get('workAuthorization').enable();
      this.candidatePostForm.get('workAuthorization').patchValue(null)
      this.candidatePostForm.get('workAuthorization').setValidators([Validators.required])
      this.candidatePostForm.get('workAuthorization').updateValueAndValidity();
      this.selectedCountries = true
      const countryCode = event;
      this.util.startLoader()
      this.workAuthorizationList = []
      this.API.query('listvalue/find?domain=WORK_AUTHORIZATION_US').subscribe(res => {
        if (res.code == '00000') {
          this.workAuthorizationList = [];
          this.util.stopLoader()
          res.data.listValues[0].listItems.forEach(ele => {
            this.workAuthorizationList.push(ele.item)
            var mySet = new Set(this.workAuthorizationList);
            this.workAuthorizationList = [...mySet]
          });
          this.API
            .query("country/getAllStates?countryCode=" + countryCode)
            .subscribe((res) => {
              this.usStatesList = [];
              res.forEach(ele => {
                this.usStatesList.push(ele.stateName);
              })
            }, err => {
              this.util.stopLoader();
            });
        }
      })
    } else if (event == "AU" && this.candidatePostForm != undefined) {
      this.workAuthorizationList = [];
      this.candidatePostForm.get('workAuthorization').enable();
      this.candidatePostForm.get('workAuthorization').patchValue(null)
      this.candidatePostForm.get('workAuthorization').setValidators([Validators.required])
      this.candidatePostForm.get('workAuthorization').updateValueAndValidity();
      this.util.startLoader()
      this.API.query('listvalue/find?domain=WORK_AUTHORIZATION_AU').subscribe(res => {
        if (res.code == '00000') {
          this.util.stopLoader()
          this.workAuthorizationList = [];
          res.data.listValues[0].listItems.forEach(ele => {
            this.workAuthorizationList.push(ele.item)
            var mySet = new Set(this.workAuthorizationList);
            this.workAuthorizationList = [...mySet]
          })
          this.selectedCountries = true
          const countryCode = event;
          if (this.stateListAU.length == 0) {
            this.stateListAU = [];
            this.API
              .query("country/getAllStates?countryCode=" + countryCode)
              .subscribe((res) => {
                this.stateListAU = res;
              }, err => {
                this.util.stopLoader();
              });
          }
        }
      })
    } else if (event == "IN" && this.candidatePostForm != undefined) {
      this.workAuthorizationList = [];
      this.candidatePostForm.get('workAuthorization').enable();
      this.candidatePostForm.get('workAuthorization').patchValue(null)
      this.candidatePostForm.get('workAuthorization').setValidators([Validators.required])
      this.candidatePostForm.get('workAuthorization').updateValueAndValidity();
      this.util.startLoader()
      this.API.query('listvalue/find?domain=WORK_AUTHORIZATION_IN').subscribe(res => {
        if (res.code == '00000') {
          this.util.stopLoader()
          this.workAuthorizationList = [];
          res.data.listValues[0].listItems.forEach(ele => {
            this.workAuthorizationList.push(ele.item)
            var mySet = new Set(this.workAuthorizationList);
            this.workAuthorizationList = [...mySet]
          });
          this.selectedCountries = true;
          const countryCode = event;
          if (this.stateListIN.length == 0) {
            this.stateListIN = [];
            this.API
              .query("country/getAllStates?countryCode=" + countryCode)
              .subscribe((res) => {
                this.stateListIN = res;
              }, err => {
                this.util.stopLoader();
              });
          }
        }
      })
    } else if (event == "CA" && this.candidatePostForm != undefined) {
      this.workAuthorizationList = [];
      this.candidatePostForm.get('workAuthorization').enable();
      this.candidatePostForm.get('workAuthorization').patchValue(null)
      this.candidatePostForm.get('workAuthorization').setValidators([Validators.required])
      this.candidatePostForm.get('workAuthorization').updateValueAndValidity();
      this.util.startLoader()
      this.API.query('listvalue/find?domain=WORK_AUTHORIZATION_CA').subscribe(res => {
        if (res.code == '00000') {
          this.util.stopLoader()
          res.data.listValues[0].listItems.forEach(ele => {
            this.workAuthorizationList.push(ele.item)
            var mySet = new Set(this.workAuthorizationList);
            this.workAuthorizationList = [...mySet]
          });
          this.selectedCountries = true
          const countryCode = event;
          if (this.stateListCA.length == 0) {
            this.API
              .query("country/getAllStates?countryCode=" + countryCode)
              .subscribe((res) => {
                this.stateListCA = res;
              }, err => {
                this.util.stopLoader();
              });
          }
        }
      })
    } else {
      this.selectedCountries = false;
      if (event != null && this.candidatePostForm != undefined) {
        this.workflag = true;
        this.workAuthorizationList = [];
        if (this.countryChosen != 'US' || this.countryChosen != 'AU' || this.countryChosen != 'IN' || this.countryChosen != 'CA') {
          setTimeout(() => {
            this.candidatePostForm.get('workAuthorization').patchValue(null)
            this.candidatePostForm.get('workAuthorization').disable();
            this.candidatePostForm.get('workAuthorization').clearValidators();
            this.candidatePostForm.get('workAuthorization').updateValueAndValidity();
          }, 2000);
        }
      }
    }
    if (this.typeTargetValue != null) {
      this.onTargetRateTyped(this.typeTargetValue, param)
    }
  }
  onTargetRateTyped(value, param) {
    this.typeTargetValue = value
  }
  commonVariables: any = {};
  digitKeyOnly(e) {
    var keyCode = e.keyCode == 0 ? e.charCode : e.keyCode;
    if ((keyCode >= 37 && keyCode <= 40) || (keyCode == 8 || keyCode == 9 || keyCode == 13) || (keyCode >= 48 && keyCode <= 57)) {
      return true;
    }
    return false;
  }
  searchSubject = new Subject<String>();
  orgNameSubject = new Subject<String>();
  patchEmail(value) {
    this.candidatePostForm.patchValue({
      candidateEmailId: this.candidatePostForm.get('email').value
    })
    if (localStorage.getItem("userType") != "JOB_SEEKER") {
      this.emailidcehck(value);
    }
  }
  emailidcehck(id) {
    this.API.query("user/checkMailAlreadyExists/" + id).subscribe((res) => {
      if (res.data != null && res.data.exists) {
        if (res.data.exists) {
          this.candidatePostForm.get('email').setErrors({ existingEmailAddress: true });
          this.candidatePostForm.get('candidateEmailId').patchValue(null);
        }
      } else {
        this.candidatePostForm.get('email').setErrors({ existingEmailAddress: null })
        this.candidatePostForm.get('email').updateValueAndValidity({ emitEvent: false })
      }
    })
  }
  enableScroll(): void {
    this.isScrollEnabled = true;
    this.toggleBodyOverflow(true);
  }
  disableScroll(): void {
    this.isScrollEnabled = false;
    this.toggleBodyOverflow(false);
  }
  toggleBodyOverflow(isEnabled: boolean) {
    const body = document.body;
    if (isEnabled) {
      body.style.overflow = 'visible';
    } else {
      body.style.overflow = 'hidden'
    }
  }
  modalRef2: BsModalRef | null;
  fileChangeEvent(event, popupName): void {
    const checkSize = super.checkImageSize(event.target.files[0]);
    this.imageChangedEvent = event;
    const acceptedImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
    if (checkSize > 10) {
      Swal.fire("", `${this.IMAGE_ERROR}`, "info");
      this.myFileInputcandidate.nativeElement.value = null;
    }
    if (event.target.files && event.target.files[0]) {
      this.fileUploadName = event.target.files[0].name;
      this.myFileInputcandidate.nativeElement.value;
      const numberOfFiles = event.target.files.length;
      for (let i = 0; i < numberOfFiles; i++) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.fileshow = e.target.result;
        };
        reader.readAsDataURL(event.target.files[0]);
      }
    }
    if (!acceptedImageTypes.includes(event.target.files[0].type)) {
      Swal.fire('', 'Please upload the correct file type   (Only .jpg, .png, .jpeg)', 'info');
      this.myFileInputcandidate.nativeElement.value = "";
      this.modalRef.hide();
    }
    else {
      this.PopupServicevlaues(popupName);
    }
  }
  PopupServicevlaues(template: TemplateRef<any>) {
    this.modalRef2 = this.modalService.show(template, {
      animated: true,
      backdrop: "static",
    });
  }
  uploadPhotoHere() {
    this.myFileInputcandidate.nativeElement.click();
  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }
  croppedImage: any = "";
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    const byteString = window.atob(
      event.base64.replace(/^data:image\/(png|jpeg|jpg);base64,/, "")
    );
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: "image/jpeg" });
    this.fileToUpload = new File([blob], this.fileUploadName, {
      type: "image/jpeg",
    });
  }
  closePhoto2() {
    this.modalRef2.hide();
    this.photo = null;
    this.fileshow = undefined;
    this.myFileInputcandidate.nativeElement.value = null;
    this.photoIdnew = null;
  }
  img4: any = {};
  imageLoaded2() {
    this.util.startLoader();
    const formData: FormData = new FormData();
    formData.append("file", this.fileToUpload, this.fileUploadName);
    // setTimeout(() => {
    this.API.create("upload/image", formData).subscribe((res) => {
      this.util.stopLoader();
      if (res) {
        this.photoIdnew = res.fileId;
        this.modalRef2.hide();
      }
    }, err => {
      this.util.stopLoader();
    });
  }
  ngOnDestroy(): void {
    this.callNotification = false;
    this.callUnreadMsg = false;
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
    if (this.clickEventsubscription) {
      this.clickEventsubscription.unsubscribe();
    }
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.userTypeChanger) {
      this.userTypeChanger.unsubscribe();
    }
    if (this.entityPassed) {
      this.entityPassed.unsubscribe();
    }
    if (this.countEmitter) {
      this.countEmitter.unsubscribe();
    }
    if (this.eventEmitter) {
      this.eventEmitter.unsubscribe();
    }
  
  }
  sortConfigWork: TypeaheadOrder = {
    direction: "desc",
    field: "organisationName",
  };
  noResult: boolean = false
  typeaheadNoResults(event: boolean): void {
    this.noResult = event;
    this.jobPostForm.patchValue({
      organisationId: null
    })
  }
  onKeyZip(event: any, param, index) {
    let data: any = {};
    data.countryCode = "US";
    data.zipCode = event.target.value;
    data.stateCode = "";
    if (data.zipCode.length === 5) {
      this.API.create("country/geodetails", data).subscribe((res) => {
        if (
          res &&
          res != null &&
          res != "" &&
          res.length > 0 &&
          event.target.value != ""
        ) {
          res.forEach((ele) => {
            let cityName = ele.cityName;
            let stateName = ele.stateName;
            if (param == 'job') {
              this.jobPostForm.patchValue({
                city: cityName,
                state: stateName,
              });
            } else if (param == 'candidate') {
              this.candidatePostForm.patchValue({
                city: cityName,
                state: stateName,
              });
            } else if (param == 'work') {
              this.workExperience.controls[0].patchValue({
                city: cityName,
                state: stateName,
              });
            }
          });
        }
      });
    } else if (data.zipCode.length < 5 || data.zipCode.length > 5) {
    }
  }
  autoComplete1: MatAutocompleteTrigger;
  searchBarShow1: boolean = false
  uniqueOrgList: Array<Partial<HealthCareOrganization>> = [];
  getOrgList(value) {
    if (value != null) {
      const orgList: Array<Partial<HealthCareOrganization>> = [];
      this.API.query("care/organizations?organizationName=" + this.workExperience.value[0].organisationName)
        .pipe(debounceTime(500))
        .subscribe((res) => {
          if (res) {
            res.forEach(ele => {
              var obj: any = {}
              obj.organizationId = ele.organizationId;
              obj.organizationName = ele.organizationName;
              obj.city = ele.city;
              obj.zipCode = ele.zipCode;
              obj.address1 = ele.address1;
              obj.address2 = ele.address2;
              obj.state = ele.state;
              obj.country = ele.country;
              obj.countryName = ele.countryName;
              obj.street = ele.street && ele.street !== null ? ele.street : null;
              orgList.push(obj);
            })
            const uniqueList = new Set(orgList);
            this.uniqueOrgList = Array.from(uniqueList);
          }
        }, err => {
          this.util.stopLoader();
        });
      this.searchBarShow1 = true;
    } else {
      this.searchBarShow1 = false
    }
  }
  closeModal_credit() {
    this.gigsumoService.buttonClicked = true;
    this.modalRef.hide();
  }
  otherSelectedStates: any = []
  closeModal() {
    this.gigsumoService.buttonClicked = true;
    this.primarySkillsSelected = [];
    this.secondarySkillsSelected = [];
    this.primarySkillsList = []
    this.secondarySkillsList = []
    this.otherSelectedStates = []
    this.modalRef.hide();
    // this.cancelJob()
    this.otpEmailSent = false
    this.domainValidatorSubmit = false
    this.commonVariables.jobPostingFlag = false
    this.commonVariables.emailDomainValidation = false
    this.commonVariables.educationFlag = false
    this.commonVariables.candidatePostingFlag = false
    this.commonVariables.workExperienceFlag = false
    this.submit = false
    this.domainForm.get('domainValidationOtp').patchValue(null)
    this.domainForm.get('domainValidationOtp').setErrors({ wrongDomainValidationOtp: null })
    this.domainForm.get('domainValidationOtp').clearValidators()
    this.domainForm.get('domainValidationOtp').updateValueAndValidity()
    this.domainForm.get('swapEmail').setErrors({ genericDomain: null })
    this.domainForm.get('swapEmail').updateValueAndValidity({ emitEvent: false })
    this.domainForm.get('swapEmail').setErrors({ emailExistsAlready: null })
    this.domainForm.get('swapEmail').updateValueAndValidity({ emitEvent: false })
  }
  closeCandidate() {
    this.candidateSubmit = false
    this.primarySkillsSelected = [];
    this.secondarySkillsSelected = [];
    this.otherSelectedStates = []
    this.modalService.hide(1)
    this.cancelcloseCandidate()
    this.otpEmailSent = false
    setTimeout(() => {
      this.commonVariables.candidatePostingFlag = false
    }, 3000);
    this.domainForm.get('domainValidationOtp').setErrors({ wrongDomainValidationOtp: null })
    this.domainForm.get('domainValidationOtp').updateValueAndValidity({ emitEvent: false })
    this.domainForm.get('domainValidationOtp').setErrors({ wrongDomainValidationOtp: null })
    this.domainForm.get('domainValidationOtp').updateValueAndValidity({ emitEvent: false })
    this.domainForm.get('swapEmail').setErrors({ genericDomain: null })
    this.domainForm.get('swapEmail').updateValueAndValidity({ emitEvent: false })
    this.fileshow = undefined;
    this.myFileInputcandidate.nativeElement.value = null;
    this.photoIdnew = null;
  }
  userType: USER_TYPE = localStorage.getItem('userType') as USER_TYPE;
  userdetailList: any
  UserName: any
  emailid: any;
  getUnreadMessageUserCount(res: any) {
    this.unreadUserMsgCount = res;
  }
  updatepath(imgpath) {
    this.img = imgpath;
  }
  test(flag) {
    this.reloadUser = flag;
  }
  checkUserProfileStatus(): void {
    const userId = localStorage.getItem("userId");
    this.util.startLoader()
    this.API.query("user/profilestatus/" + userId).subscribe((res) => {
      if (res != undefined && res && res === "PENDING") {
        this.util.stopLoader()
        const data: any = {};
        data.userId = this.userId;
        this.router.navigate(["userClassification"], { queryParams: data });
      }
    }, err => {
      this.util.stopLoader();
    });
  }
  c: any;
  d: any;
  getUserHeaderCount(): void {
    const userId = localStorage.getItem("userId");
    this.API.query("user/header/" + userId + "/" + localStorage.getItem('postedDate')).subscribe((res) => {
      if (res) {
        this.notificationDatasshow = res;
        const countsMapping = {
          'Job Invites Received': 'jobInvitesReceivedCount',
          'Job Applicants': 'jobApplicationsReceivedCount',
          'Resume Requests Received': 'resumeRequestReceivedCount',
          'Featured Candidates': 'totalFeaturedCandidatesCount',
          'Jobs Applied': 'jobsAppliedCount',
          'Featured Jobs': 'totalFeaturedJobsCount',
          'Job Invites Sent': 'jobInvitesSentCount',
          'Suggested Candidates': 'totalSuggCandidatesCount',
          'Resume Requests Sent': 'resumeRequestedCount',
          'Suggested Jobs': 'totalsuggJobsCount',
        };
        this.labelToShow.forEach(ele => {
          const propertyName = countsMapping[ele.value];
          if (propertyName && res[propertyName] !== undefined) {
            ele.count = res[propertyName];
          }
        });
        this.unreadUserMsgCount = res.message || 0;
        this.notificationcount = res.notification || 0;
        this.jobInvitesReceivedCount = res.jobInvitesReceivedCount || 0;
        this.resumeRequestReceivedCount = res.resumeRequestReceivedCount || 0;
        this.jobApplicationsReceivedCount = res.jobApplicationsReceivedCount || 0;
        // Calculate inbox count if all counts are available
        if (res.jobInvitesReceivedCount !== undefined && res.resumeRequestReceivedCount !== undefined && res.jobApplicationsReceivedCount !== undefined) {
          this.inboxCount = this.jobApplicationsReceivedCount + this.resumeRequestReceivedCount + this.jobInvitesReceivedCount;
        }
        ['newPost', 'candidateNonSeenMessageCount', 'jobNonSeenMessageCount'].forEach(propertyName => {
          if (res[propertyName] !== undefined) {
            this.commonValues.setloadData(res.newPost);
            this.commonValues.setmsgcountJob(res.jobNonSeenMessageCount + res.candidateNonSeenMessageCount + res.message);
          }
        });
      }
    }, err => {
      this.util.stopLoader();
    });
  }
  getnotificationView(): void {
    const userId = localStorage.getItem("userId");
    this.util.startLoader()
    var value: any = {}
    value.userId = this.userId
    value.offset = null
    value.limit = 10
    this.API.create("notification/query", value).subscribe((res) => {
      if (res != undefined && res) {
        this.util.stopLoader()
        this.getNotification(res.data['notifications']);
      }
    }, err => {
      this.util.stopLoader();
    });
  }
  profileStatus() {
    let datas: any = {};
    datas.userId = localStorage.getItem('userId')
    this.util.startLoader()
    this.API.query("user/profile/complete/" + localStorage.getItem('userId')).subscribe(res => {
      if (res != undefined && res) {
        this.userdetailList = res;
        this.util.stopLoader()
        this.userType = res.userType
      }
    }, err => {
      this.util.stopLoader();
    });
  }
  ngAfterViewInit(): void {
    var count = 0;
    this.userId = localStorage.getItem("userId");
    setInterval(() => {
      if (localStorage.getItem('userId') != null) {
        this.connectionService.monitor().subscribe(isConnected => {
          this.isConnected = isConnected;
          if (this.isConnected) {
            console.log("online")
          } else {
            console.log("offline");
            this.UserService.onlineAPI('ONLINE');
          }
        });
        let message_response = this.Socketserver.reloadconnection();
        let stream_response = this.StreamSocket.reloadconnection();
        // console.log("message_response",message_response)
        // console.log("stream_response",stream_response)
        // don't remove this console we should remove only Prod
        //  console.log("stream,message_response", stream_response, message_response,);
        // Restart stream socket server
        if (!message_response.connected) {
          this.stremService.startsocket_message();
        }
        // Restart stream socket server
        if (!stream_response.connected) {
          this.stremService.startStream();
        } else if (stream_response.streamTopic == 0) {
          if (localStorage.getItem('userId') != null) {
            this.stremService.startTopic();
          }
        }
      }
    }, 10000)




    let checktourStarted= localStorage.getItem("tourshowed")
    if(checktourStarted!=null ||checktourStarted!=undefined ){
      this.resumeTour();  
    }else{
      localStorage.removeItem("lastTourStep")
    } 


    }
  getNotification(val: any): any {
    if (val) {
      this.notificationList = val;
    }
  }
  getCountNotification(val: any): any {
    let c = 0;
    val.forEach((e: any) => {
      if (!e.read) {
        c += 1;
      }
    });
    return c;
  }
  redirectNotification(item: any): any {
    const userId = localStorage.getItem("userId");
    this.util.startLoader();
    this.API.create("notification/read/" + item["notifyId"], {}).subscribe((res) => {
      if (res) {
        if (res.code === "00000" && res.data != null) {
          this.util.stopLoader();
          this.getUserHeaderCount();
          item["redirectFrom"] = "notification";
          if (item["notifyType"] === "CONNECT_REQUEST_RECEIVED") {
            this.router.navigate(["/personalProfile"], {
              queryParams: { userId: item["notifyEntityId"] },
            });
          } else if (item["notifyType"] === "POST_LIKED") {
          } else if (item["notifyType"] === "POST_COMMENTED") {
          }
          else if (item["notifyType"] === "COMMUNITY_USER_INVITE_REQUEST") {
            localStorage.setItem("communityId", item["notifyEntityId"]);
            this.router.navigate(["/community"], {
              queryParams: item["notifyData"],
            });
          } else if (item["notifyType"] === "COMMUNITY_USER_JOINED") {
            localStorage.setItem("communityId", item["notifyEntityId"]);
            this.router.navigate(["/community"], {
              queryParams: item["notifyData"],
            });
          } else if (item["notifyType"] === "REMOVED_FROM_MSG_GRP") {
            localStorage.setItem("communityId", item["notifyEntityId"]);
            this.router.navigate(["/message"], {
              queryParams: item["notifyData"],
            });
          } else if (item["notifyType"] === "LEFT_FROM_MSG_GRP") {
            localStorage.setItem("communityId", item["notifyEntityId"]);
            this.router.navigate(["/message"], {
              queryParams: item["notifyData"],
            });
          } else if (item["notifyType"] === "ADDED_TO_MSG_GRP") {
            localStorage.setItem("communityId", item["notifyEntityId"]);
            this.router.navigate(["/message"], {
              queryParams: item["notifyData"],
            });
          }
          else if (item["notifyType"] === "COMMUNITY_USER_JOIN_REQUEST") {
            localStorage.setItem("communityId", item["notifyEntityId"]);
            this.router.navigate(["/community"], {
              queryParams: item["notifyData"],
            });
          } else if (item["notifyType"] === "COMMUNITY_MEMBER_INVITE_REQUEST") {
            localStorage.setItem("communityId", item["notifyEntityId"]);
            this.router.navigate(["/community"], {
              queryParams: item["notifyData"],
            });
          }
          else if (item["notifyType"] === "JOINED_TEAM") {
            const temp = item["notifyData"];
            temp.routeFrom = "notification";
            this.router.navigate(["landingPage/team"], {
              queryParams: temp,
            });
          } else if (item["notifyType"] === "TEAMS_REMOVED") {
            this.router.navigate(["landingPage/team"], {
              queryParams: item["notifyData"]
            });
          } else if (item["notifyType"] === "TEAM_CONNECT_REQUEST_CANCELLED") {
            this.router.navigate(["landingPage/team"], {
              queryParams: item["notifyData"]
            });
          } else if (item["notifyType"] === "CONNECT_REQUEST_CANCELLED") {
            this.router.navigate(["/personalProfile"], {
              queryParams: { userId: item["notifyEntityId"] },
            });
          } else if (item["notifyType"] === "CONNECTION_REMOVED") {
            this.router.navigate(["/personalProfile"], {
              queryParams: { userId: item["notifyEntityId"] },
            });
          } else if (item["notifyType"] === "User_itself_remove_from_teams") {
            this.router.navigate(["teamPage/" + "member"], {
              queryParams: item["notifyData"],
            });
          } else if (item["notifyType"] === "User_itself_remove_from_Network") {
            this.router.navigate(["networkPage/" + "member"], {
              queryParams: item["notifyData"],
            });
          }
          else if (item["notifyType"] === "JOINED_NETWORK" || item["notifyType"] === "NETWORK_INVITE_SENT") {
            const temp = item["notifyData"];
            temp.routeFrom = "notification";
            this.router.navigate(["landingPage/network"], {
              queryParams: temp,
            });
          } else if (item["notifyType"] === "Network_Removed") {
            this.router.navigate(["landingPage/network"], {
              queryParams: item["notifyData"],
            });
          } else if (item["notifyType"] === "NETWORK_INVITE_CANCELLED") {
            this.router.navigate(["landingPage/network"], {
              queryParams: item["notifyData"],
            });
          } else if (item["notifyType"] === "NETWORK_CONNECT_REQUEST_REJECTED") {
            this.router.navigate(["/personalProfile"], {
              queryParams: { userId: item["notifyEntityId"] },
            });
          } else if (item["notifyType"] === "NETWORK_CONNECT_REQUEST_ACCEPTED") {
            this.router.navigate(["landingPage/network"], {
              queryParams: item["notifyData"]
            });
          } else if (
            item["notifyType"] === "BUSINESS_PAGE_FOLLOWER_INVITE_SENT"
          ) {
            localStorage.setItem("businessId", item["notifyEntityId"]);
            this.router.navigate(["/business"], {
              queryParams: item["notifyData"],
            });
          } else if (item["notifyType"] === "BUSINESS_EMPLOYEE_REQUEST_REJECTED") {
            localStorage.setItem("businessId", item["notifyEntityId"]);
            this.router.navigate(["/business"], {
              queryParams: item["notifyData"],
            });
          } else if (item["notifyType"] === "BUSINESS_EMPLOYEE_REQUEST_ACCEPTED") {
            localStorage.setItem("businessId", item["notifyEntityId"]);
            this.router.navigate(["/business"], {
              queryParams: item["notifyData"],
            });
          }
          else if (
            item["notifyType"] === "BUSINESS_EMPLOYEE_INVITE_REQUEST"
          ) {
            item.notifyData.menu = "requestsReceived"
            localStorage.setItem("businessId", item["notifyEntityId"]);
            this.router.navigate(["/business"], {
              queryParams: item["notifyData"],
            });
          } else if (
            item["notifyType"] === "BUSINESS_EMPLOYEE_INVITE_SENT"
          ) {
            localStorage.setItem("businessId", item["notifyEntityId"]);
            this.router.navigate(["/business"], {
              queryParams: item["notifyData"],
            });
          }
        }
      }
    }, err => {
      this.util.stopLoader();
    });
  }
  redirect(vlue) {
  }
  formserchData() {
    this.serachForm = this.fb.group({
      serachData: [""],
    });
  }
  globalSearchValue: any = ''
  photoUrl: string = AppSettings.photoUrl;
  onChangeSearch(val: string) {
    this.globalSearchValue = this.serachForm.value.serachData
    const data = {
      search: this.globalSearchValue,
      searchContent: "ALL",
      loginUserId: localStorage.getItem("userId"),
      page: {
        offSet: 0,
        pageCount: 5,
      },
    };
    if (val != null && this.serachForm.value.serachData != "") {
      this.util.startLoader();
      this.API.create("home/profiles/search", data)
        .pipe(debounceTime(500))
        .subscribe((res) => {
          this.util.stopLoader();
          this.globalsearchRes = res;
          if (res != null && res != null) {
            this.dynamicArray = [""];
            this.dynamicdata = res;
            if (res.businessPages != "undefined") {
              this.bunissData = res.businessPages;
              if (this.dynamicdata.businessPages != null) {
                this.dynamicdata.businessPages.forEach((element) => {
                  if (element.businessLogo != null) {
                    element.businessLogo1 =
                      AppSettings.photoUrl + element.businessLogo;
                  } else {
                    element.businessLogo1 = null;
                  }
                  this.dynamicArray.push(element);
                });
              }
            }
            if (res.users != "undefined") {
              this.userData = res.users;
              this.dynamicdata.users.forEach((element) => {
                if (element.photo != null) {
                  element.userImage = AppSettings.photoUrl + element.photo;
                } else {
                  element.userImage = null;
                }
                element.UserTitle = "User";
                this.dynamicArray.push(element);
              });
            }
            if (res.communityPages != "undefined") {
              this.CommunityData = res.communityPages;
              this.dynamicdata.communityPages.forEach((element) => {
                if (element.logo != null) {
                  element.logo = AppSettings.photoUrl + element.logo;
                } else {
                  element.logo = null;
                }
                element.firstName = element.communityName;
                this.dynamicArray.push(element);
              });
            }
          }
        }, err => {
          this.util.stopLoader();
        });
      this.searchBarShow = true;
    } else {
      this.searchBarShow = false;
      this.bunissData = [];
      this.userData = [];
    }
  }
  onFocused(e) {
  }
  onLogout() {
    var val: any = {}
    val.isLoggedOut = true
    this.searchData.setCommonVariables(val);
    this.util.startLoader();
    this.API.onLogout().subscribe((res) => {
      if (res) {
        if (res.code === "00000") {
          this.util.stopLoader();
          this.onLogoutSuccess();
        } else {
          this.util.stopLoader();
        }
      }
    });
  }
  onLogoutSuccess() {
    this.cookieservice.deleteAll();
    let allCookies = document.cookie.split(";");
    if (allCookies) {
      for (let i = 0; i < allCookies.length; i++) {
        document.cookie = allCookies[i] + "=;expires=" + new Date(0).toUTCString();
      }
    }
    localStorage.clear();
    this.stremService.OnDestroy();
    this.router.navigate(["login"]);
  }
  viewMyProfile() {
    var data: any = {}
    data.userId = this.userId
    this.router
      .navigateByUrl("/", { skipLocationChange: true })
      .then(() => this.router.navigate(["/personalProfile"], { queryParams: data }));
  }
  goToSecuritySettings() {
    var data: any = {}
    data.userId = this.userId
    data.destination = "securitySettings"
    this.router
      .navigateByUrl("/", { skipLocationChange: true })
      .then(() => this.router.navigate(["/personalProfile"], { queryParams: data }));
  }
  businessSelected(val, role) {
    this.name = "";
    if (role == "BUSINESS_PAGE") {
      if (val.businessId != undefined) {
        localStorage.setItem("businessId", val.businessId);
        var data: any = {};
        data.businessId = val.businessId;
        data.businessName = val.businessName;
        data.employee = val.employee;
        data.followed = val.followed;
        data.admin = val.admin;
        this.searchedpage(val.businessId, "BUSINESS");
        this.setVisitor(data);
        this.router
          .navigateByUrl("/", { skipLocationChange: true })
          .then(() => this.router.navigate(["/business"], { queryParams: data }));
      }
    }
    else if (role == "COMMUNITY_PAGE") {
      let newobj: any = {};
      newobj.communityId = val.communityId
      newobj.userId = localStorage.getItem('userId')
      this.API.create("community/home", newobj).subscribe(res => {
        localStorage.setItem("communityId", val.communityId);
        var data: any = {};
        data.communityId = val.communityId;
        data.communityName = val.communityName;
        data.communityType = val.communityType;
        data.isJoined = res.data.isJoined;
        data.isAdmin = res.data.isAdmin;
        data.isSuperAdmin = res.data.isSuperAdmin;
        this.searchedpage(val.communityId, "COMMUNITY");
        this.router
          .navigateByUrl("/", { skipLocationChange: true })
          .then(() =>
            this.router.navigate(["/community"], { queryParams: data })
          );
      }, err => {
        this.util.stopLoader();
      });
    }
    else if (role == "JOBSSEARCH") {
      if (val.jobPostedBy != this.userId) {
        var profiledata: any = {};
        profiledata.userId = localStorage.getItem('userId')
        profiledata.userType = localStorage.getItem('userType')
        this.util.stopLoader
        let element: any = {}
        let dataview: any = {};
        this.util.stopLoader
        dataview.jobPostedBy = localStorage.getItem('userId');
        dataview.jobId = val.jobId;
        if (val.jobPostedBy != this.userId && val.isViewed == false) {
          this.util.startLoader
          this.API.updatePut("jobs/updateJobViewed", dataview).subscribe((res) => {
            this.util.stopLoader();
          }, err => {
            this.util.stopLoader();
          });
        } else if (val.businessId != null) {
          data.menu = "Jobs"
          this.router.navigate(["/business"], { queryParams: data });
        }
      }
      if (val.businessId != null) {
        let dataBusiness: any = {};
        dataBusiness.jobId = val.jobId;
        dataBusiness.businessId = val.businessId;
        dataBusiness.menu = "Jobs"
        this.router.navigate(["/business"], { queryParams: dataBusiness });
      }
      else {
        var dataa: any = {};
        dataa.jobId = val.jobId;
        dataa.businessId = val.businessId;
        dataa.userType = val.user.userType
        dataa.userId = val.jobPostedBy
        dataa.menu = "Jobs"
        this.router.navigate(['newjobs'], { queryParams: dataa });
      }
    }
    else if (role == "CANDIDATESEARCH") {
      var data: any = {};
      data.candidateId = val.candidateId;
      data.userId = val.createdBy
      data.userType = val.user.userType
      this.router.navigate(["/newcandidates"], { queryParams: data })
    }
  }
  setVisitor(data) {
    var datum: any = {};
    datum.businessId = data.businessId;
    datum.userId = localStorage.getItem("userId");
    this.util.startLoader()
    this.API.create("business/save/pagevisitor", datum).subscribe((res) => {
      if (res.code == "00000") {
        this.util.stopLoader()
      }
    }, err => {
      this.util.stopLoader();
    });
  }
  userSelected(valUser, pageType) {
    this.searchedpage(valUser.userId, "USER");
    var userData: any = {};
    userData.userId = valUser.userId;
    this.name = "";
    //    this.router.navigate(['personalProfile'], {queryParams : userData})
    this.router
      .navigateByUrl("/", { skipLocationChange: true })
      .then(() =>
        this.router.navigate(["/personalProfile"], { queryParams: userData })
      );
  }
  searchList(data, temp: MatAutocompleteTrigger) {
    // //// console.log(data);
    let datas: any = {};
    datas.data = data;
    datas.searchData = this.globalSearchValue;
    // datas.searchData = this.serachForm.value.serachData;
    //this.searchedpage(data);
    this.router
      .navigateByUrl("/", { skipLocationChange: true })
      .then(() => this.router.navigate(["Search-list"], { queryParams: datas }));
    // this.router.navigate(["Search-list"], { queryParams: datas });
    // this.router.navigate(['clear']);
    //  this.commonservice.redirect(data,'Search-list'
    temp.closePanel();
    this.serachForm.reset();
  }
  searchedpage(userid, pageType) {
    let datas: any = {};
    datas.userId = localStorage.getItem("userId");
    datas.pageId = userid;
    datas.pageType = pageType;
    this.util.startLoader()
    this.API.create("widget/searchedpage", datas).subscribe((res) => {
      if (res) {
        this.util.stopLoader()
      }
    }, err => {
      this.util.stopLoader();
    });
  }
  notification() {
    var userid = localStorage.getItem("userId");
    this.util.startLoader();
    this.API.query("notification/" + userid).subscribe((res) => {
      if (res) {
        this.util.stopLoader();
        this.counts = res.length;
      }
    }, err => {
      this.util.stopLoader();
    });
  }
  itemclick(data) { }
  eduSaveFlag: boolean = false
  saveWorkExperience() {
    this.workSaveFlag = true
    if (this.eperienceForm.valid) {
      this.currentOrg = true;
      this.util.startLoader();
      this.API.create("user/v1/workexperience", this.workExperience.getRawValue()[0]).subscribe((res) => {
        if (res.code == '00000') {
          this.util.stopLoader();
          localStorage.setItem("currentOrganization", this.workExperience.getRawValue()[0].organisationName)
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Work Experience added successfully",
            showConfirmButton: false,
            timer: 2000,
          }).then(() => {
            //credit validation
            var profiledata: any = {};
            profiledata.userId = localStorage.getItem('userId')
            profiledata.userType = localStorage.getItem('userType')
            this.util.startLoader()
            this.API.create('user/profileDetails', profiledata).subscribe(res => {
              this.util.stopLoader()
              if (res.code == '00000') {
                this.workExp = res.data.exeperienceList;
                let element: any = {}
                if (this.currentEntity == 'JOBS') {
                  // element = res.data.creditConsumptions.find(item => item.creditType === AppSettings.CREATE_JOB)
                } else if (this.currentEntity == 'CANDIDATE') {
                  //element = res.data.creditConsumptions.find(item => item.creditType === AppSettings.CREATE_CANDIDATE)
                }
                //if (res.data.creditPoints >= element.points || localStorage.getItem('userType') == 'student' || this.userType == 'JOB_SEEKER') {
                if (this.currentEntity == 'JOBS') {
                  this.createJobs();
                } else if (this.currentEntity == 'CANDIDATE') {
                  this.createCandidate()
                }
                // } else {
                //   this.commonVariables.creditFlag = true
                //   this.redirectToCreditPage();
                //   this.commonVariables.educationFlag = false
                //   this.commonVariables.workExperienceFlag = false
                //   this.commonVariables.jobPostingFlag = false
                //   this.commonVariables.candidatePostingFlag = false
                //   this.commonVariables.postPrivacyFlag = false
                //   this.commonVariables.emailDomainValidation = false
                // }
              }
            })
          })
        }
      })
    }
  }
  closeWorkExperience() {
  }
  redirectToCreditPage() {
    // this.openModalWithComponent();
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
  workExperience: UntypedFormArray
  eperienceForm: UntypedFormGroup
  currentYear: any = new Date().getFullYear();
  educationDetail: UntypedFormArray;
  addEducation() {
    this.generateYears1()
    this.getCountries()
    this.eduForm = this.formBuilder.group({
      educationDetail: this.formBuilder.array([]),
    });
    // this.educationDetail = this.eduForm.get("educationDetail") as FormArray;
    // this.educationDetail.push(this.createEducation());
    this.getInstitutions()
  }
  addWorkExperience(clientType: string = null) {
    this.generateYears1()
    this.getCountries()
    this.clientTypeList = []
    this.candidateJobTitleList = []
    this.recruiterTitleList = []
    var data = { "domain": "CLIENT_TYPE,PAY_TYPE,GIGSUMO_JOB_TITLE,GIGSUMO_RECRUITERS_TITLE_LIST" }
    this.util.startLoader();
    this.API.create('listvalue/findbyList', data).subscribe(res => {
      if (res.code == '00000') {
        this.util.stopLoader();
        res.data.CLIENT_TYPE.listItems.forEach(ele => {
          // if (this.clientType == "Direct Client" && ele.item == "Direct Client") {
          //   ele.item = "Client";
          // }
          this.clientTypeList.push(ele.item);
        })
        res.data.GIGSUMO_JOB_TITLE.listItems.forEach(ele => {
          this.candidateJobTitleList.push(ele.item)
        })
        res.data.GIGSUMO_RECRUITERS_TITLE_LIST.listItems.forEach(ele => {
          this.recruiterTitleList.push(ele.item)
        })
        this.getOrganization(clientType)
      }
    })
  }
  get geteducation() {
    return this.eduForm.get("educationDetail") as UntypedFormArray;
  }
  getEducationFormGroup(index: any): UntypedFormGroup {
    const formGroup = this.educationDetail.controls[index] as UntypedFormGroup;
    return formGroup;
  }
  sortConfigEdu: TypeaheadOrder = {
    direction: "desc",
    field: "institutionName",
  };
  autoComplete2: MatAutocompleteTrigger;
  searchBarShow2: boolean = false
  uniqueOrgList2: Array<Partial<HealthCareOrganization>> = [];
  getOrganization1(value) {
    if (value != null) {
      this.API.query("care/organizations?organizationName=" + this.jobPostForm.value.clientName)
        // .pipe(debounceTime(500))
        .subscribe((res) => {
          if (res) {
            const orgList2: Array<Partial<HealthCareOrganization>> = [];
            res.forEach(ele => {
              var obj: any = {}
              obj.organizationId = ele.organizationId;
              obj.organizationName = ele.organizationName;
              obj.city = ele.city;
              obj.address1 = ele.address1;
              obj.address2 = ele.address2;
              obj.state = ele.state;
              obj.country = ele.country;
              obj.zipCode = ele.zipCode
              obj.businessId = ele.businessId
              obj.zipCode = ele.zipCode
              obj.countryName = ele.countryName;
              obj.street = ele.street && ele.street !== null ? ele.street : null;
              orgList2.push(obj);
            })
            const uniqueList = new Set(orgList2);
            this.uniqueOrgList2 = Array.from(uniqueList);
          }
        }, err => {
        });
      this.searchBarShow2 = true;
    } else {
      this.searchBarShow2 = false
    }
  }
  currentlyPursued(event, index) {
    if (event.target.checked == true) {
      this.educationDetail.controls[index].patchValue({
        currentlyPursued: true,
      });
      this.educationDetail.controls[index].patchValue({
        endYear: this.currentYear,
      });
      this.educationDetail.controls[index].patchValue({ endMonth: null });
      this.educationDetail.controls.forEach((ele) => {
        ele.get("endYear").clearValidators();
        ele.get("endYear").updateValueAndValidity();
        ele.get("endMonth").clearValidators();
        ele.get("endMonth").updateValueAndValidity();
      });
    } else if (event.target.checked == false) {
      this.educationDetail.controls[index]
        .get("currentlyPursued")
        .markAsUntouched();
      this.educationDetail.controls[index]
        .get("currentlyPursued")
        .updateValueAndValidity();
      this.educationDetail.controls[0].patchValue({ showThisOnProfile: false });
      this.educationDetail.controls[index].patchValue({
        endYear: this.currentYear,
      });
      this.educationDetail.controls[index].patchValue({ endMonth: null });
      this.educationDetail.controls.forEach((ele) => {
        ele.get("endMonth").setValidators([Validators.required]);
        ele.get("endMonth").updateValueAndValidity();
        ele.get("endYear").setValidators([Validators.required]);
        ele.get("endYear").updateValueAndValidity();
      });
    }
  }
  schoolData: any = {}
  onChangeSchool(event, index) {
    //// console.log(event.item);
    var data = event.value + "/" + event.item.institutionId;
    this.util.startLoader();
    this.API.query("care/intitutions/" + data).subscribe((res) => {
      this.util.stopLoader();
      res.forEach((ele) => {
        this.schoolData.institutionId = event.item.institutionId;
        this.schoolData.city = ele.city;
        this.schoolData.eduId = ele.eduId;
        this.schoolData.userId = this.userId;
        this.schoolData.state = ele.state;
        this.schoolData.country = ele.country;
        // this.schoolData.countryName = ele.countryName;
        this.schoolData.zipcode = ele.zipCode && ele.zipCode !== null ? ele.zipCode : null;
        this.schoolData.street = ele.street && ele.street !== null ? ele.street : null;
        this.getEducationFormGroup(index).patchValue(this.schoolData);
        this.educationDetail.controls[0].get('city').disable()
        this.educationDetail.controls[0].get('country').disable()
        this.educationDetail.controls[0].get('state').disable()
        this.educationDetail.controls[0].get('zipcode').disable()
        this.educationDetail.controls[0].get('street').disable()
      });
    }, err => {
      this.util.stopLoader();
    });
  }
  eduForm: UntypedFormGroup
  instList: any = []
  getInstitutions() {
    this.instList = []
    this.util.startLoader()
    this.API.query("care/institutions").subscribe((res) => {
      if (res) {
        this.util.stopLoader()
        this.instList = [];
        res.forEach((ele) => {
          var obj: any = {};
          obj.institutionId = ele.institutionId;
          obj.institutionName = ele.institutionName;
          obj.city = ele.city;
          obj.state = ele.state;
          obj.country = ele.country;
          obj.countryName = ele.countryName;
          obj.street = ele.street && ele.street !== null ? ele.street : null;
          this.instList.push(obj);
        });
      }
    }, err => {
      this.util.stopLoader();
    });
    this.educationDetail = this.eduForm.get("educationDetail") as UntypedFormArray;
    this.educationDetail.push(this.createEducation());
    this.commonVariables.educationFlag = true
    this.commonVariables.workExperienceFlag = false
    this.commonVariables.jobPostingFlag = false
    this.commonVariables.candidatePostingFlag = false
    this.commonVariables.emailDomainValidation = false
    this.util.stopLoader()
  }
  createEducation() {
    return this.formBuilder.group({
      schoolName: [null, [Validators.required]],
      institutionId: [null],
      eduId: [null],
      userId: [null],
      degree: [null, [Validators.required]],
      showThisOnProfile: [false],
      currentlyPursued: [true],
      startMonth: [null, [Validators.required]],
      startYear: [this.currentYear, [Validators.required]],
      endMonth: [null],
      endYear: [this.currentYear],
      city: [null, [Validators.required]],
      street: [null, [Validators.required]],
      state: [null, [Validators.required]],
      zipcode: [null, [Validators.required, CustomValidator.minmaxLetters(this.ZIPCODE.min, this.ZIPCODE.max)]],
      country: [null, [Validators.required]],
      speciality: [null, [Validators.required]],
    });
  }
  getWorkFormGroup(index): UntypedFormGroup {
    const formGroup = this.workExperience.controls[index] as UntypedFormGroup;
    return formGroup;
  }
  showThis(event, i) {
    if (event.target.checked == true) {
      this.commonVariables.noOrgSelected = false;
      this.searchData.setCommonVariables(this.commonVariables);
    } else if (event.target.checked == false) {
      this.commonVariables.noOrgSelected = true;
      this.searchData.setCommonVariables(this.commonVariables);
    }
  }
  timezoneslist: any = []
  onChangeCountryorg(event, value, index) {
    if (value == "work") {
      this.workExperience.controls[index].patchValue({
        state: null,
        zipcode: null,
        city: null,
        country: event,
      });
      this.workExperience.controls.forEach((ele) => {
        ele.get("state").setValidators([Validators.required]);
        ele.get("state").updateValueAndValidity();
      });
    }
    if (event == "United States") {
    } else if (event == "AU") {
      const countryCode = event;
      this.stateListAU = [];
      this.util.startLoader();
      this.API
        .query("country/getAllStates?countryCode=" + countryCode)
        .subscribe((res) => {
          if (res) {
            this.util.stopLoader();
            this.stateListAU = res;
          }
        }, err => {
          this.util.stopLoader();
        });
    } else if (event == "IN") {
      const countryCode = event;
      this.stateListIN = [];
      this.util.startLoader();
      this.API
        .query("country/getAllStates?countryCode=" + countryCode)
        .subscribe((res) => {
          if (res) {
            this.util.stopLoader();
            this.stateListIN = res;
          }
        }, err => {
          this.util.stopLoader();
        });
    } else if (event == "CA") {
      const countryCode = event;
      this.stateListCA = [];
      this.util.startLoader();
      this.API
        .query("country/getAllStates?countryCode=" + countryCode)
        .subscribe((res) => {
          if (res) {
            this.util.stopLoader();
            this.stateListCA = res;
          }
        }, err => {
          this.util.stopLoader();
        });
    } else {
    }
    const countryCode = event;
    if (event != null && this.eperienceForm != undefined) {
      this.workExperience.controls[0].get("timeZone").enable();
    }
    this.timeZonecountryvalues(countryCode);
  }
  curOrg(event, index) {
    if (event.target.checked == true) {
      this.workExperience.controls[index].patchValue({
        currentOrganization: true,
      });
      this.workExperience.controls[index].patchValue({
        endYear: this.currentYear,
      });
      this.workExperience.controls[index].patchValue({ endMonth: null });
      this.workExperience.controls.forEach((ele) => {
        ele.get("endYear").clearValidators();
        ele.get("endYear").updateValueAndValidity();
        ele.get("endMonth").clearValidators();
        ele.get("endMonth").updateValueAndValidity();
      });
    } else if (event.target.checked == false) {
      this.workExperience.controls[index]
        .get("currentOrganization")
        .markAsUntouched();
      this.workExperience.controls[index]
        .get("currentOrganization")
        .updateValueAndValidity();
      this.workExperience.controls[index].patchValue({
        endYear: this.currentYear,
      });
      this.workExperience.controls[index].patchValue({ endMonth: null });
      this.workExperience.controls.forEach((ele) => {
        ele.get("endMonth").setValidators([Validators.required]);
        ele.get("endMonth").updateValueAndValidity();
        ele.get("endYear").setValidators([Validators.required]);
        ele.get("endYear").updateValueAndValidity();
      });
      this.workExperience.controls[0]
        .get("badge")
        .setErrors({ checkIfChecked: true });
    }
  }
  monthChange(index, val) {
    if (val == "exp") {
      var a: any = this.workExperience.value[index].startYear;
      var b: any = this.workExperience.value[index].endYear;
      if (a == b) {
        this.workExperience.controls[index].patchValue({
          endMonth: null,
        });
      }
    } else if (val == "edu") {
    }
  }
  months: any = [
    { code: 1, name: "January" },
    { code: 2, name: "February" },
    { code: 3, name: "March" },
    { code: 4, name: "April" },
    { code: 5, name: "May" },
    { code: 6, name: "June" },
    { code: 7, name: "July" },
    { code: 8, name: "August" },
    { code: 9, name: "September" },
    { code: 10, name: "October" },
    { code: 11, name: "November" },
    { code: 12, name: "December" },
  ];
  yearIndex: any;
  yearData: any;
  yearChange(index, event, val, par) {
    if (val == "exp") {
      var stYr = parseInt(this.workExperience.value[index].startYear);
      var maxYr = new Date().getFullYear();
      if (stYr == maxYr) {
        this.workExperience.controls[index].patchValue({ startMonth: null });
      }
      this.yearData = event.target.value;
      this.yearIndex = index;
      this.workExperience.controls[index].patchValue({
        endYear: this.currentYear,
        endMonth: null,
      });
    }
  }
  onChangeYear(i, val, par) {
    const maxyr = new Date().getFullYear();
    if (val == "exp") {
      if (
        this.workExperience.value[0].startYear ==
        this.workExperience.value[0].endYear ||
        this.workExperience.value[0].endYear == maxyr
      ) {
        this.workExperience.controls[0].patchValue({ endMonth: null });
      }
      if (
        this.workExperience.value[0].startYear ==
        this.workExperience.value[0].endYear
      ) {
        this.validateMonth = true;
      } else {
        this.validateMonth = false;
      }
    }
  }
  checkYear(y, i, val) {
    if (val == "exp") {
      let yearDataInt = parseInt(this.workExperience.value[i].startYear);
      let year = parseInt(y);
      if (yearDataInt != null) {
        if (yearDataInt > year) {
          return true;
        } else {
          return false;
        }
      }
    }
  }
  validateMonth: boolean;
  checkMonth(m, i, val) {
    var max = new Date().getFullYear();
    if (val == "exp") {
      let endyr = parseInt(this.workExperience.value[i].endYear);
      let stMonth = this.workExperience.value[i].startMonth;
      let styr = parseInt(this.workExperience.value[i].startYear);
      let stMonthCode;
      let n = new Date().getMonth();
      let monthCode = m;
      this.months.forEach((e) => {
        if (e.name == stMonth) {
          stMonthCode = e.code;
        }
      });
      if (styr == max && (this.validateMonth || styr == endyr)) {
        if (monthCode > n + 1 || stMonthCode > monthCode) {
          return true;
        } else {
          return false;
        }
      } else if (styr != max && (this.validateMonth || styr == endyr)) {
        if (stMonthCode > monthCode) {
          return true;
        } else {
          return false;
        }
      } else if (styr != endyr && endyr == max) {
        if (monthCode > n + 1) {
          return true;
        } else {
          return false;
        }
      }
    }
  }
  checkMonth1(m, i, val) {
    if (val == "exp") {
      var n = new Date().getMonth();
      var maxYear = new Date().getFullYear();
      var maxMonth = n + 1;
      var monthCode = m;
      let startYear = parseInt(this.workExperience.value[i].startYear);
      if (startYear == maxYear) {
        if (monthCode > maxMonth) {
          return true;
        } else {
          return false;
        }
      }
    }
  }
  getOrganization(clientType: string = null) {
    this.eperienceForm = this.formBuilder.group({
      workExperience: this.formBuilder.array([])
    })
    this.workExperience = this.eperienceForm.get("workExperience") as UntypedFormArray;
    this.workExperience.push(this.createWorkExperience());
    if (this.workExperience.controls[0].get('timeZone') != null && this.userType == "JOB_SEEKER") {
      this.workExperience.controls[0].get('timeZone').clearValidators()
      this.workExperience.controls[0].get('timeZone').updateValueAndValidity()
    }
    this.workExperience.at(0).get('clientType').patchValue(clientType);
    this.commonVariables.workExperienceFlag = true
    this.commonVariables.educationFlag = false
    this.commonVariables.jobPostingFlag = false
    this.commonVariables.candidatePostingFlag = false
    this.commonVariables.emailDomainValidation = false
    this.util.stopLoader()
  }
  // when no result matched the value, organization id is set to null
  changeTypeaheadNoResults(index, val) {
    if (val == "work") {
      this.getWorkFormGroup(index).patchValue({
        organisationId: null,
      });
    } else if (val == "edu") {
      // this.getEducationFormGroup(index).patchValue({
      //   institutionId: null,
      // });
    }
    // else if(val == 'currentOrg'){
    //   this.getWorkFormGroup(index).patchValue({
    //     organisationId: null
    //   })
    // }
  }
  workSaveFlag: boolean = false;
  createWorkExperience(): UntypedFormGroup {
    return this.formBuilder.group({
      currentOrganization: [true],
      organisationName: [
        null, [Validators.required, CustomValidator.checkWhiteSpace(),
        CustomValidator.max(this.ORGANIZATION_NAME.max)]
      ],
      clientType: [null, [Validators.required]],
      action: [null],
      businessId: [null],
      expId: [null],
      userId: [this.userId],
      badge: [true],
      organisationId: [null],
      timeZone: [null, [Validators.required]],
      title: [null, [Validators.required]],
      state: [null, [Validators.required, CustomValidator.max(this.STATE.max)]],
      zipcode: [null, [Validators.required, CustomValidator.minmaxLetters(this.ZIPCODE.min, this.ZIPCODE.max)]],
      city: [null, [Validators.required, CustomValidator.max(this.CITY.max)]],
      country: [null, [Validators.required]],
      startMonth: [null, [Validators.required]],
      startYear: [this.currentYear, [Validators.required]],
    });
  }
  onPaste(event: ClipboardEvent) {
    let clipboardData = event.clipboardData;
    let pastedText = clipboardData.getData('text');
    if (pastedText != null) {
      this.util.startLoader();
      this.API.query("care/organizations?organizationName=" + pastedText)
        .pipe(debounceTime(2000))
        .subscribe((res) => {
          this.util.stopLoader();
          if (res) {
            this.util.stopLoader();
            const orgList: Array<Partial<HealthCareOrganization>> = [];
            // this.orgList = [];
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
              orgList.push(obj);
            })
            const uniqueList = new Set(orgList);
            this.uniqueOrgList = Array.from(uniqueList);
          }
        }, err => {
        });
      this.searchBarShow = true;
    } else {
      this.searchBarShow = false
    }
  }
  saveEducation() {
    this.eduSaveFlag = true
    if (this.eduForm.valid) {
      this.util.startLoader();
      this.API
        .create("user/create/education", this.educationDetail.getRawValue()[0])
        .subscribe((res) => {
          this.util.stopLoader();
          if (res.code == "0000") {
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Education added successfully",
              showConfirmButton: false,
              timer: 2000,
            }).then(() => {
              // localStorage.setItem('userName', this.domainForm.value.swapEmail)
              this.createCandidate()
            })
          }
        })
    }
  }
  ContactAdmin() {
    let data: any = {}
    data.userId = localStorage.getItem('userId');
    data.groupType = "SUPPORT";
    let url = "findContactsByRefererId";
    this.API.messagePageService('POST', url, data).subscribe(res => {
      var userData: any = {};
      userData.groupId = null;
      if (res.length != 0) {
        userData.groupId = null;
        if (res[0].groupId) {
          userData.groupId = res[0].groupId;
        }
      }
      this.messageData = [];
      this.messagemodelflag = true;
      this.messageData.onlySupport = "SUPPORT";
      this.messageData.groupType = "SUPPORT";
      this.messageData.messageType = "SUPPORT";
      this.messageData.userId = localStorage.getItem('userId');
      this.messageData.id = userData.groupId;
    });
  }
  messageData: any;
  messagemodelflag = false;
  closeMessage(event) {
    this.messagemodelflag = false;
  }
  updateSupportModule() {
    let module = new jobModuleConfig(this.ContactAdmin);
    module.source = this;
    this.supportModal = module;
  }
}
