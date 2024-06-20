import { HttpClient } from "@angular/common/http";
import { Component, ElementRef, HostListener, Input, OnDestroy, OnInit, TemplateRef, ViewChild, Injectable } from "@angular/core";
import { AbstractControl, UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from "@angular/forms";
import { MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from "@angular/router";
import * as CryptoJS from 'crypto-js';
import { BsModalRef, BsModalService, ModalOptions } from "ngx-bootstrap/modal";
import { TypeaheadOrder } from 'ngx-bootstrap/typeahead';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { NgxSummernoteDirective } from "ngx-summernote";
import { Observable, Subject, Subscription, interval, timer } from "rxjs";
import { debounceTime, takeUntil } from 'rxjs/operators';
import { AppSettings } from "src/app/services/AppSettings";
import { FormValidation } from 'src/app/services/FormValidation';
import { GigsumoConstants, USER_TYPE } from 'src/app/services/GigsumoConstants';
import { HealthCareOrganization } from 'src/app/services/HealthCareOrganization';
import { UserService } from 'src/app/services/UserService';
import { ApiService } from "src/app/services/api.service";
import { CommonValues } from "src/app/services/commonValues";
import { GigsumoService } from 'src/app/services/gigsumoService';
import { JobService } from 'src/app/services/job.service';
import { jobModuleConfig } from 'src/app/services/jobModuleConfig';
import { PageType } from 'src/app/services/pageTypes';
import { ProfilePhoto } from "src/app/services/profilePhoto";
import { SearchData } from "src/app/services/searchData";
import { WorkExperience } from 'src/app/services/userModel';
import { UtilService } from "src/app/services/util.service";
import { environment } from 'src/environments/environment';
import Swal from "sweetalert2";
import { CustomValidator } from '../Helper/custom-validator';
import { PricePlanService } from '../Price-subscritions/priceplanService';
import { UserBadgeComponent } from "../landing-page/user-badge/user-badge.component";
import { StreamService } from './../../services/stream.service';
import { LangdingPageNavBarComponent } from './../langding-page-nav-bar/langding-page-nav-bar.component';
import { TourService } from "src/app/services/TourService";

@Injectable()
export class GlobalCommunity {
  joined: boolean = false;
  communityData: any = {};
}

declare var $: any;
type Location = {
  country: string,
  state: string,
  city: string;
  zipCode: string,

}
@Component({
  selector: "app-bussiness-post",
  templateUrl: "./bussiness-post.component.html",
  styleUrls: ["./bussiness-post.component.scss"],
  animations: [
    // trigger('slide-in', [
    //   state('left', style({
    //     opacity: 0,
    //     transform: 'translateX(-100%)'
    //   })),
    //   state('middle', style({
    //     opacity: 1,
    //     transform: 'translateX(0)'
    //   })),
    //   state('right', style({
    //     opacity: 0,
    //     transform: 'translateX(100%)'
    //   })),
    //   transition('left=>middle', [
    //     style({
    //       opacity: 0,
    //       transform: 'translateX(-100%)'
    //     }),
    //     animate('400ms')
    //   ]),
    //   transition('right=>middle', [
    //     style({
    //       opacity: 0,
    //       transform: 'translateX(100%)'
    //     }),
    //     animate('400ms')
    //   ]),
    //   transition('middle=>*', [
    //     animate('400ms')
    //   ])
    // ])
  ]
})
export class BussinessPostComponent extends FormValidation implements OnInit, OnDestroy {
  show = false;
  creditform: UntypedFormGroup;
  submited: boolean = false;
  public FORMERROR = super.Form;
  getclickStatus: boolean = true;

  // sharecmd:any ={}
  public animState = 'right'
  public animState0 = 'middle'
  public animState1 = 'right'
  public animState2 = 'right'
  sharecmd;
  @ViewChild("myFileInputoo") myFileInputoo;
  @ViewChild("myFileInput1") myFileInput1;
  @ViewChild("myFileInput2") myFileInput2;
  @ViewChild("myFileInput3") myFileInput3;
  @ViewChild("myFileInput4") myFileInput4;
  @ViewChild("myFileInputcandidate") myFileInputcandidate;
  @ViewChild("postTemplate") postTemplate;
  imageChangedEvent: any = "";
  fileUploadName;
  fileshow = undefined;
  fileToUpload: File;
  photoId: any;
  infoData: any = {};
  photo: any = null;
  url = AppSettings.ServerUrl + "download/";
  nodata = "you have no post yet"
  noDatafound: Array<string> = ["No data Found"]
  datass: any;
  bannerdata;
  admindata;
  adminflag: Boolean;
  count = 0;
  fileSize = AppSettings.FILE_SIZE;
  clickEventsubscription: Subscription;
  streamSubcr: Subscription;
  subscription: Subscription;
  adminviewflag;
  values: any = {};
  menu;
  @Input() commonemit;
  @Input() ownerView;
  @Input() postView;
  registerForm: UntypedFormGroup;
  jobPostForm: UntypedFormGroup;
  candidatePostForm: UntypedFormGroup;
  submitted = false;
  postdatas: any = {};
  commanddata = null;
  urlLinkDetctForm: UntypedFormGroup
  commanddata1 = null;
  commanddataEdit = null;
  primarySkillsSelected = [];
  secondarySkillsSelected = [];
  otherSelectedStates = [];
  imagEditData: any = [];
  imagEditDatatemp: any = [];
  posteditId: any;
  typesofFile: any;
  userData;
  contentLoaded: boolean = false;
  tempdata;
  shareData;
  commentData;
  tempdataforscroll;
  userDatascroll;
  data = 10;
  counts: number = 0;
  Commomdatass;
  throttle = 50;
  scrollDistance = 1;
  cunt: number = 0;
  businessId: any
  networkId: any
  teamId: any
  communityid: any
  postId: any;
  postflags = false;
  disable_for_draft: boolean = false;
  FormData: any;
  uploadFiles: Array<any> = [];
  streamData: any = [];
  resumeupload;
  unit = { duration: '30' };
  wordlength: any = 0;
  attachment = false;
  modalRef: BsModalRef;
  modalRefedit: BsModalRef;
  modalRef_PostView: BsModalRef;
  modelList: any = [];
  currentTimeDate: string | Date;
  checkedList: any = [];
  tempcheckedList: any = [];
  page: number = 1;
  postviewModelName: any;
  imgUrl = AppSettings.photoUrl;
  postPrivacy = "Everyone";
  PhotoPath = AppSettings.photoUrl;
  searchName: any;
  htmlStr: any;
  currentDate: any = [];
  maxDate: any = [];
  jobscoutss: any;
  sendMessageData = {};
  entername;
  singleimagedata;
  showmodel = false;
  jobStreamData: any = [];
  canidateStreamData: any = [];
  rxjsTimer = timer(AppSettings.timerSocket);
  destroy = new Subject();
  streamRes: any = null;
  config1 = {
    focus: true,
    height: 150,
    placeholder: "Start a conversation....",
    toolbar: [],
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
  };

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
    ], onPaste(e) {
      const buffertext = (e.originalEvent || e).clipboardData.getData("text");
      e.preventDefault();
      const all = buffertext.trim();
      document.execCommand("insertText", false, all.substring(0, 1000));

    },
  };

  closeResult: string;
  loginUser: any = {};

  startCount = 0;
  pageCount = 7;
  currentPageCount = 0;

  modalScrollDistance = 2;
  modalScrollThrottle = 300;

  selectedImage = false;
  selectedvideo = false;
  eventHorizon: Subscription;
  urlVariable: Subscription;
  scrollSubscri: Subscription
  afterKey: any = undefined;
  cmdOffsetafterkey: any = null;
  newcmdoffSetMap: any = null;
  postTypeForm: UntypedFormGroup;
  linkChecker: Subscription;
  public envName: any = environment.name;


  @ViewChild("videoPlayer") videoplayer: ElementRef;
  @ViewChild("videoPlayerpopup")
  videoPlayerpopup: ElementRef;
  @ViewChild("myFileInput") myFileInput: ElementRef;
  @ViewChild("chartDiscussion") chartDisc: ElementRef;
  @ViewChild(NgxSummernoteDirective)
  summernote: NgxSummernoteDirective;
  @ViewChild("myInput") myInputVariable: ElementRef;
  @ViewChild("takeInput") InputVar: ElementRef;
  @ViewChild("jobCandidateTemplate") jobCandidateTemplate: ElementRef;
  currentOrganizationDetail: WorkExperience;

  @ViewChild('timezoneforFreelauncher') timezoneforFreelauncher: ElementRef;
  sharePost: any = {};
  userId: string = localStorage.getItem('userId');
  selectPost = "All";
  commonVariables: any = {};
  scrollValue: any = {};
  employeeFlag: boolean = false;
  postLoading: boolean = false;
  fileDragdrop: any;
  linkUrlText = new Subject<string>();
  workExperienceDetailsCheck: any = [];
  notificationDatasshow: any;
  jobId: any;
  gigCommunitySubscribed: boolean = false
  showLoadPost: boolean = false
  tempFile: any;

  freeLauchtimezoneFrom: UntypedFormGroup;
  timezonSubmited = false;
  loadAPIcall = false;
  supportModal: any;
  reloading = false;
  reloadSubscription: Subscription | undefined;
  constructor(
    private api: ApiService,
    public globalCommunity: GlobalCommunity,
    private fb: UntypedFormBuilder,
    private commonValues: CommonValues,
    private router: Router,
    private pageType: PageType,
    private route: ActivatedRoute,
    private userService: UserService,
    private modalService: BsModalService,
    private commonvalues: CommonValues,
    private langdingPageNavBarComponent: LangdingPageNavBarComponent,
    private util: UtilService,
    private httpClient: HttpClient,
    private searchData: SearchData,
    private profilePhoto: ProfilePhoto,
    private userbadges: UserBadgeComponent,
    private formBuilder: UntypedFormBuilder,
    protected _sanitizer: DomSanitizer,
    private stremService: StreamService,
    public gigsumoService: GigsumoService,
    private planService: PricePlanService,
    private JobServicecolor: JobService,
    private tourService: TourService,
  ) {
    super();
    this.clickEventsubscription = this.commonvalues
      .getbusinessid()
      .subscribe((res) => {
        this.values = res;
        if (res.basicDeatils) {
          res.basicDeatils.employees.forEach(element => {
            if (element.userId === localStorage.getItem('userId')) {
              this.employeeFlag = true
            }
          });
        }
        if (res.memberInGSComm) {
          this.gigCommunitySubscribed = true;
          this.globalCommunity.joined = true;
        }

        if (res.basicDeatils) {
          res.basicDeatils.followers.forEach(element => {
            if (element.userId === localStorage.getItem('userId')) {

            }
          });
        }

        this.adminflag = res.adminviewnavigation;
        if (this.values.menu) {
          this.menu = this.values.menu;
        }
      });

    this.clickEventsubscription = this.commonvalues.getpubliccommunity().subscribe((res) => {
      if (res) {
        this.gigCommunitySubscribed = true;
        this.globalCommunity.joined = true;
      }
    });

    this.clickEventsubscription = this.commonvalues.getLoadDate().subscribe((res) => {
      if (res > 0) {
        this.showLoadPost = true;

      } else {
        this.showLoadPost = false;
      }
    });

    this.linkChecker = this.searchData.getWebLinkURL().subscribe(res => {
      if (res != null && res != undefined && res != '') {
        this.linkUrlText = res
      } else {
        this.linkUrlText = null
      }

      if (this.linkUrlText != null) {
        var data = { key: '5b54e80a65c77848ceaa4630331e8384950e09d392365', q: this.linkUrlText }

        fetch('https://api.linkpreview.net', {
          method: 'POST',
          mode: 'cors',
          body: JSON.stringify(data),
        }).then(res => {
          if (res.status == 429) {

            this.linkDescription = null
            this.linkImage = null
            this.linkTitle = null

          } else if (res.status == 426) {

            this.linkDescription = null
            this.linkImage = null
            this.linkTitle = null
          } else if (res.status == 425) {

            this.linkDescription = null
            this.linkImage = null
            this.linkTitle = null
          } else if (res.status == 423) {

            this.linkDescription = null
            this.linkImage = null
            this.linkTitle = null
          } else if (res.status == 403) {

            this.linkDescription = null
            this.linkImage = null
            this.linkTitle = null
          } else if (res.status == 401) {

            this.linkDescription = null
            this.linkImage = null
            this.linkTitle = null
          } else if (res.status == 400) {

            this.linkDescription = null
            this.linkImage = null
            this.linkTitle = null
          }

          return res.json()
        }).then(response => {

          this.linkDescription = response.description
          this.linkImage = response.image
          this.linkTitle = response.title
          this.linkURL = response.url
        }).catch(error => {

        })

      }

    })

    this.scrollSubscri = this.searchData
      .getScroll()
      .subscribe((res) => {
        this.scrollValue.windowScroll = res.windowScroll;
      });


    $("#summernote").summernote({
      popover: {
        blockquoteBreakingLevel: 2,
        link: [["link", ["linkDialogShow", "unlink"]]],
      },
    });
    this.getLoginUserDetails();


    // console.log("this.wordlength", this.wordlength);

    this.streamSubcr = this.stremService.getstreamResponse().subscribe(streamData => {
      this.streamData = streamData;

      if (streamData.responseEntity == "JOB") {
        this.jobStreamData = streamData;
      }
      if (streamData.responseEntity == "CANDIDATE") {
        this.canidateStreamData = streamData;
      }
      if (streamData.responseEntity == "HOME") {
        this.streamData = streamData;
      }



      if (streamData && streamData.responseEntity == "HOME") {
        //console.log(streamData)
        let key = Object.keys(streamData.data);
        for (let index = 0; index < key.length; index++) {
          const element = key[index];

        }


      }

    });
  }

  startTour=false;
  shouldShowStep(stepId: string): boolean {
    // Show steps only if the tour is started
    return this.startTour;
  }

  
  markStepCompleted(stepId: string): void {
    console.log(`Step ${stepId} completed`);
  }

  callMethod() {
    this.gigsumoService.buttonClicked = true;
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
    } else {
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

  }
  loadImageFailed() {

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


  showmore(i) {
    this.userData[i].visible = true;
  }


  get isJobOwner() {
    return (this.userType === "FREELANCE_RECRUITER" || this.userType === "MANAGEMENT_TALENT_ACQUISITION" ||
      this.userType === "RECRUITER");
  }

  get isCandidateOwner() {
    return (this.userType === "FREELANCE_RECRUITER" || this.userType === "MANAGEMENT_TALENT_ACQUISITION" ||
      this.userType === "BENCH_RECRUITER" || this.userType === "JOB_SEEKER");
  }


  closePhoto2() {
    this.modalRef2.hide();
    this.photo = null;
    this.fileshow = undefined;
    this.myFileInputcandidate.nativeElement.value = null;
    this.photoId = null;

  }
  img: any = {};
  img4: any = {};

  imageLoaded2() {
    this.util.startLoader();
    const formData: FormData = new FormData();
    formData.append("file", this.fileToUpload, this.fileUploadName);
    // setTimeout(() => {
    this.api.create("upload/image", formData).subscribe((res) => {
      this.util.stopLoader();
      if (res) {
        this.photoId = res.fileId;
        this.modalRef2.hide();

      }
    }, err => {
      this.util.stopLoader();

    });
  }


  loadnewPost() {
    window.scrollBy(0, 0)
    this.getpostdatas();
    this.showLoadPost = false;
  }


  datagetvalue() {
    this.wordlength

  }
  results$: Observable<any>
  subject = new Subject()


  linkURL
  linkDescription
  linkTitle
  linkImage
  // asdf: any = {}
  isJoinedCommunity
  isCommunityAdmin
  isCommunitySuperAdmin
  userType: USER_TYPE = localStorage.getItem('userType') as USER_TYPE;
  communityType
  showWelcomePost: boolean = false
  // welcomePostData: any = []
  emailPattern = "^[a-zA-Z0-9._%+-]+@[a-zA-Z.-]+.[a-zA-Z]{2,4}$";
  isCommunityJoined
  clientTypeListprofile: Array<string> = ['Direct Client', 'Supplier', 'Systems Integrator', 'Prime Vendor', 'Vendor', 'Staffing Agency']
  ngOnInit() {

    
    this.updateSupportModule();
    this.generateYearsprofile();
    this.getCountries();
    this.freeLauncherTimezone();
    this.creditform = this.fb.group({
      point: [null, Validators.compose([Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)])],
    });


    this.domainForm = this.formBuilder.group({
      priEmail: null,
      secEmail: null,
      swapEmail: [null, [Validators.required, Validators.email,
      Validators.pattern(this.emailPattern)]],
      domainValidationOtp: null,
    })



    $(".summernote").summernote({
      onChange: function () {

      }    // callback as option
    });

    this.postTypeForm = this.formBuilder.group({
      postType: "Everyone",
    });

    this.urlLinkDetctForm = this.formBuilder.group({
      snippedLinkText: null
    }, { validators: CustomValidator.linkDetector('snippedLinkText', this.searchData) })


    this.userId = localStorage.getItem("userId");


    this.util.startLoader();
    this.api.query("user/" + this.userId).subscribe((res) => {
      if (res && res.code === "00000") {
        this.userType = res.userType;
        this.firstName = res.firstName;
        localStorage.setItem("MemberShipType", res.memberShipType);
        this.lastName = res.lastName
        this.util.stopLoader();
      }
    }, err => {
      this.util.stopLoader();
    });



    this.values = this.commonemit;
    this.route.queryParams.subscribe((res) => {

      if (res.postId !== undefined) {
        this.postId = res.postId;
      }
      if (res.showWelcomePost == 'true') {
        this.showWelcomePost = true
      }
      this.userData = [];
      if (
        res.businessId === undefined &&
        res.communityId === undefined &&
        res.networkId === undefined &&
        res.teamId === undefined
      ) {
        this.Commomdatass = "USER";
        this.commonPost_getpostdatas(this.startCount, this.pageCount);
      } else if (res.communityId !== undefined) {
        this.Commomdatass = "COMMUNITY";


        this.communityid = res.communityId;
        this.communityType = res.communityType
        if (res.isJoined) {
          this.isCommunityJoined = res.isJoined
        } else if (res.join) {
          this.isCommunityJoined = res.join
        }

        if (res.admin) {
          this.isCommunityAdmin = res.admin
        } else if (res.isAdmin) {
          this.isCommunityAdmin = res.isAdmin
        }
        this.isCommunitySuperAdmin = res.isSuperAdmin
        this.commonPost_getpostdatas(this.startCount, this.pageCount);
      } else if (res.teamId !== undefined) {
        this.Commomdatass = "TEAM";
        this.teamId = res.teamId;
        this.commonPost_getpostdatas(this.startCount, this.pageCount);

      } else if (res.businessId !== undefined )

        // &&  ((res.employee !== undefined && res.employee == "true") ||
        //   (res.followed !== undefined && res.followed == "true") ||
        //   (res.admin !== undefined && res.admin == "true") ||
        //   (res.isSuperAdmin !== undefined && res.isSuperAdmin == "true")))
     {
        this.Commomdatass = "BUSINESS";
        this.businessId = res.businessId;
        this.commonPost_getpostdatas(this.startCount, this.pageCount);

      }

      else if (res.networkId !== undefined) {
        this.Commomdatass = "NETWORK";
        this.networkId = res.networkId;
        this.commonPost_getpostdatas(this.startCount, this.pageCount);
      }

    });

    this.reloadSubscription = this.JobServicecolor.getReloadSignal().subscribe(() => {
      this.util.startLoader();
      this.reloading = true;
      if(this.Commomdatass!=undefined){
        this.getpostdatas();
      }
      setTimeout(() => {
        this.reloading = false;
      }, 2000);
    });
    this.jobformfield()
  }

  ngOnDestroy(): void {
    if (this.linkChecker) {
      this.linkChecker.unsubscribe();
    }
    if (this.scrollSubscri) {
      this.scrollSubscri.unsubscribe();
    }
    if (this.urlVariable) {
      this.urlVariable.unsubscribe();
    }
    if (this.eventHorizon) {
      this.eventHorizon.unsubscribe();
    }
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.streamSubcr) {
      this.streamSubcr.unsubscribe();
    }
    if (this.clickEventsubscription) {
      this.clickEventsubscription.unsubscribe();
    }
    if (this.reloadSubscription) {
      this.reloadSubscription.unsubscribe();
    }
  }

  closemodel() {
    this.gigsumoService.buttonClicked = true;
    this.beingEdited = false
    this.commonVariables.creditFlag = false
    this.commonVariables.educationFlag = false
    this.commonVariables.workExperienceFlag = false
    this.commonVariables.jobPostingFlag = false
    this.commonVariables.candidatePostingFlag = false
    this.commonVariables.postPrivacyFlag = false
    this.commonVariables.emailDomainValidation = false
    this.modalRef.hide();
  }


  qwer
  organizationList: any = []
  previousSearchAfterKey: any = null
  primarySkillsList: any = []
  secondarySkillsList: any = []
  skillsList: any = []
  payTypeList: any = []
  clientTypeList: any = []
  jobPostedBehalfOflist: Array<{ country: string, orgName: string, state: string, city: string, zipCode: string }> = []
  clientNameList: any = []
  clientNameList1: any = []
  durationTypeList: any = []
  jobClassificationList: any = []
  recruiterTitleList: any = []
  workAuthorizationList: any = []


  autoComplete1: MatAutocompleteTrigger;
  searchBarShow1: boolean = false
  uniqueOrgList1: Array<Partial<HealthCareOrganization>> = [];

  getOrganization1(value) {
    if (value != null) {
      this.api.query("care/organizations?organizationName=" + this.jobPostForm.value.clientName)
        .pipe(debounceTime(500))
        .subscribe((res) => {
          if (res) {
            const orgList1: Array<Partial<HealthCareOrganization>> = [];
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
      this.searchBarShow = true;
    } else {
      this.searchBarShow = false
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
      this.api
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
      this.api
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
      this.api
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
  onChangeCountry_timezone(event) {
    this.countryChosen = event;
    this.timeZonecountryvalues(this.countryChosen);

  }

  timeZonecountryvalues(countryCode) {
    this.util.startLoader();
    if (countryCode != undefined && countryCode != "") {
      this.timezoneslist = [];
      this.api.query("user/timeZoneByCountryCode/" + countryCode).subscribe((res) => {
        if (res) {
          this.util.stopLoader();
          this.timezoneslist = res.data.zones;
        }
      }, err => {
        this.util.stopLoader();
      });
    }
  }

  onPaste9(event: ClipboardEvent) {
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
            const orgList: Array<Partial<HealthCareOrganization>> = [];
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

  onPaste3(event: ClipboardEvent) {
    // let clipboardData = event.clipboardData;
    // let pastedText = clipboardData.getData('text');
    CustomValidator.jobDescriptionLength(this.jobPostForm.get('jobDescription'))
  }

  onPaste4(event: ClipboardEvent) {

    CustomValidator.jobDescriptionLength(this.candidatePostForm.get('resumeSummary'))
  }
  currentTime: any;

  getListValues(param) {

    this.clientTypeList = []
    this.jobPostedBehalfOflist = []
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

    if (this.jobClassificationList.length == 0) {
      this.util.startLoader()
      var data: any = { "domain": "ENGAGEMENT_TYPE,CLIENT_TYPE,PAY_TYPE,DURATION,PRIMARY_SKILLS,WORK_AUTHORIZATION,CANDIDATE_AVAILABLITY,TOTAL_EXPERIENCE,SECONDARY_SKILLS,GIGSUMO_SKILLS_LIST,GIGSUMO_JOB_TITLE,GIGSUMO_RECRUITERS_TITLE_LIST" }
      if(param=='JOBS'){
        data.type = 'JOB';
      }else if(param=='CANDIDATE'){
        data.type = 'CANDIDATE';
      }
      data.userId = localStorage.getItem("userId");
      this.api.create('listvalue/findbyList', data).subscribe(res => {
        if (res.code == '00000') {
          this.jobId = res.data.jobId;

          if (param != 'CANDIDATE') {
            this.jobPostForm.patchValue({ 'jobId': res.data.jobId });

            this.util.startLoader()
            this.api.query('business/check/orgname/' + this.userId).subscribe(res => {
              this.util.stopLoader()
              if (res.code == '00000' || '10008') {

                if (res.data != null && res.data.organisation != null && res.data.organisation.length != 0) {
                  let organisations: Array<any> = res.data.organisation;
                  res.data.organisation.forEach(ele => {
                    this.jobPostedBehalfOflist.push({ country: ele.country, orgName: ele.organizationName, state: ele.state, zipCode: ele.zipCode, city: ele.city })
                    if (this.userType == 'FREELANCE_RECRUITER' && organisations.length > 1) {
                      this.jobPostForm.get('jobPostedBehalfOf').enable();
                      this.addCurrentOrgValidation();
                    } else if (this.userType == 'FREELANCE_RECRUITER' && organisations.length == 1) {
                      this.jobPostForm.get('jobPostedBehalfOf').patchValue(ele.organizationName);
                      this.jobPostForm.get('jobPostedBehalfOf').disable();
                      this.addCurrentOrgValidation();
                    } else {
                      if (this.userType == 'FREELANCE_RECRUITER') {
                        this.removeCurrentOrgValidation();
                      }
                      this.jobPostForm.get('jobPostedBehalfOf').patchValue(ele.organizationName);
                      this.jobPostForm.get('jobPostedBehalfOf').disable()
                    }
                  })
                } else if (res.code = "100002") {
                  this.jobPostForm.get('jobPostedBehalfOf').disable()
                }
              } else if (res.code == '10002') {
                this.jobPostForm.get('jobPostedBehalfOf').disable()
              }
            })

          }
          if (param == 'CANDIDATE') {
            this.candidatePostForm.patchValue({ 'candidateId': res.data.candidateId });
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
          res.data.CLIENT_TYPE.listItems.forEach(ele => {

            // if (this.clientType == "Client" && ele.item == "Direct Client") {
            //   ele.item = "Client";
            // }

            this.clientTypeList.push(ele.item);
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
            this.candidateJobTitleList.push(ele.item);
            var mySet = new Set(this.candidateJobTitleList);
            this.candidateJobTitleList = [...mySet]
          })
          res.data.GIGSUMO_RECRUITERS_TITLE_LIST.listItems.forEach(ele => {
            this.recruiterTitleList.push(ele.item)

          })



          if (param == 'CANDIDATE') {
            if (this.openModal == true) {

              this.modalRef = this.modalService.show(this.postTemplate, this.backdropConfig);

            }

            if (this.otpEmailSent == true) {
              this.otpEmailSent = false
              this.commonVariables.emailDomainValidation = false
              this.commonVariables.workExperienceFlag = false
              this.commonVariables.educationFlag = false
              this.searchData.setCommonVariables(this.commonVariables)
            }
            this.commonVariables.candidatePostingFlag = true
            this.commonVariables.jobPostingFlag = false
            this.commonVariables.postPrivacyFlag = false
            this.commonVariables.workExperienceFlag = false
            this.commonVariables.educationFlag = false
            this.searchData.setCommonVariables(this.commonVariables)
          } else if (param == 'JOBS') {
            if (this.openModal == true) {

              this.modalRef = this.modalService.show(this.postTemplate, this.backdropConfig);

            }
            if (this.otpEmailSent == true) {
              this.otpEmailSent = false
              this.commonVariables.emailDomainValidation = false
              this.commonVariables.workExperienceFlag = false
              this.commonVariables.educationFlag = false
              this.searchData.setCommonVariables(this.commonVariables)
            }

            this.commonVariables.jobPostingFlag = true
            this.commonVariables.postPrivacyFlag = false
            this.commonVariables.workExperienceFlag = false
            this.commonVariables.educationFlag = false
            this.searchData.setCommonVariables(this.commonVariables)
          }

        }
      })
    } else {

      if (param == 'CANDIDATE') {
        if (this.openModal == true) {
          this.modalRef = this.modalService.show(this.postTemplate, this.backdropConfig);
        }

        this.commonVariables.candidatePostingFlag = true
        this.commonVariables.jobPostingFlag = false
        this.commonVariables.postPrivacyFlag = false
        this.commonVariables.workExperienceFlag = false
        this.commonVariables.educationFlag = false
        this.searchData.setCommonVariables(this.commonVariables)
      } else if (param == 'JOBS') {
        if (this.openModal == true) {
          this.modalRef = this.modalService.show(this.postTemplate, this.backdropConfig);

        }

        this.commonVariables.jobPostingFlag = true
        this.commonVariables.postPrivacyFlag = false
        this.commonVariables.workExperienceFlag = false
        this.commonVariables.educationFlag = false
        this.searchData.setCommonVariables(this.commonVariables)
      }

    }
  }

  sortConfigWork: TypeaheadOrder = {
    direction: "desc",
    field: "organisationName",
  };
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



  noResult: boolean = false
  typeaheadNoResults(event: boolean): void {
    this.noResult = event;
    this.jobPostForm.patchValue({
      organisationId: null
    })
  }

  closeEmailDomainValidator() {
    this.beingEdited = false
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
            this.domainForm.get('domainValidationOtp').patchValue(null)
            this.domainForm.get('domainValidationOtp').setErrors({ wrongDomainValidationOtp: null })
            this.domainForm.get('domainValidationOtp').clearValidators()
            this.domainForm.get('domainValidationOtp').updateValueAndValidity()
            this.domainForm.get('swapEmail').patchValue(null)
            this.domainForm.get('swapEmail').setErrors({ genericDomain: null })
            this.domainForm.get('swapEmail').updateValueAndValidity({ emitEvent: false })
            this.domainForm.get('swapEmail').setErrors({ emailExistsAlready: null })
            this.domainForm.get('swapEmail').updateValueAndValidity({ emitEvent: false })
            this.otpEmailSent = false
            this.commonVariables.emailDomainValidation = false
            this.searchData.setCommonVariables(this.commonVariables)
            this.modalService.hide(1);
            this.modalService.hide(2);
            this.modalService.hide(3);
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            this.commonVariables.emailDomainValidation = true
            this.searchData.setCommonVariables(this.commonVariables)
            if (this.openModal == true) {
              this.modalRef = this.modalService.show(this.postTemplate, this.backdropConfig);
            }
          }
        })
    } else if (this.otpEmailSent == false) {
      if (this.openModal == true) {
        this.modalRef.hide()
        setTimeout(() => {
          this.domainForm.get('domainValidationOtp').patchValue(null)
          this.commonVariables.emailDomainValidation = false
          this.searchData.setCommonVariables(this.commonVariables)
        }, 1000);
      } else {
        this.domainForm.get('domainValidationOtp').patchValue(null)
        this.commonVariables.emailDomainValidation = false
        this.searchData.setCommonVariables(this.commonVariables)
      }

    }
  }

  edit() {
    this.otpEmailSent = false
  }

  otpEmailSent: boolean = false
  domainValidatorSubmit: boolean = false
  proceedAfterValidation(param) {
    this.domainValidatorSubmit = true
    if (this.domainForm.valid) {
      var validateEmail: any;
      validateEmail = this.domainForm.value.swapEmail.split('@')[1];
      const a = this.domainList.indexOf(validateEmail)
      if (a != '-1') {
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
        this.api.create('user/sendOtpToMailId', data).subscribe(res => {
          if (res.code == '00000') {
            this.otpEmailSent = true
            this.domainForm.get('domainValidationOtp').setValidators([Validators.required])
            this.domainForm.get('domainValidationOtp').updateValueAndValidity()

            this.domainForm.get('domainValidationOtp').setErrors({ wrongDomainValidationOtp: null })
            this.domainForm.get('domainValidationOtp').updateValueAndValidity({ emitEvent: false })

            this.domainForm.get('swapEmail').setErrors({ emailExistsAlready: null })
            this.domainForm.get('domainValidationOtp').updateValueAndValidity({ emitEvent: false })

            // CHECK IF WORK EXPERIENC HAS BEEN PROVIDED

            // Here work exp check
            // if (param == 'JOBS' && workExperience.length == 0) {
            //    this.workExperiencecheck();
            // }else if (param == 'JOBS' && workExperience.length > 0) {
            // } else  if (param == 'CANDIDATE') {
            // }


          } else if (res.code == '99998') {
            this.otpEmailSent = false
            this.domainForm.get('swapEmail').setErrors({ emailExistsAlready: true })
          }
        })
        if (param == 'JOBS') {

          // this.commonVariables.jobPostingFlag = true
          // this.commonVariables.candidatePostingFlag = false
          // this.searchData.setCommonVariables(this.commonVariables)
        } else if (param == 'CANDIDATE') {
          // this.commonVariables.jobPostingFlag = false
          // this.commonVariables.candidatePostingFlag = true
          // this.searchData.setCommonVariables(this.commonVariables)
        }
      }
    }
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
      this.util.startLoader()
      this.api.create('user/verifyOTPToPrimaryMailId', data).subscribe(res => {
        if (res.code == '00000') {
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
            this.langdingPageNavBarComponent.onLogout()
          })
        } else if (res.code == '99999') {
          this.util.stopLoader();
          this.domainForm.get('domainValidationOtp').setErrors({ wrongDomainValidationOtp: true })

        }
        else if (res.code == '99998') {
          this.util.stopLoader();
          this.domainForm.get('domainValidationOtp').setErrors({ wrongDomainValidationOtp: true })

        }
      })
    }
  }

  closeValidator(param) {
    this.beingEdited = false
    if (this.openModal == true) {
      this.modalRef.hide()
      setTimeout(() => {
        this.domainValidatorSubmit = false
        this.otpEmailSent = false
        this.domainForm.get('domainValidationOtp').setErrors({ wrongDomainValidationOtp: null })
        this.domainForm.get('domainValidationOtp').clearValidators()
        this.domainForm.get('domainValidationOtp').updateValueAndValidity()
        this.domainForm.get('swapEmail').setErrors({ genericDomain: null })
        this.domainForm.get('swapEmail').updateValueAndValidity({ emitEvent: false })
        this.domainForm.get('swapEmail').setErrors({ emailExistsAlready: null })
        this.domainForm.get('swapEmail').updateValueAndValidity({ emitEvent: false })
        if (param == 'JOBS') {
          this.commonVariables.emailDomainValidation = false
          this.searchData.setCommonVariables(this.commonVariables)
        } else if (param == 'CANDIDATE') {
          this.commonVariables.emailDomainValidation = false
          this.searchData.setCommonVariables(this.commonVariables)
        }
      }, 1000);
    } else {
      this.domainValidatorSubmit = false
      this.otpEmailSent = false
      this.domainForm.get('domainValidationOtp').setErrors({ wrongDomainValidationOtp: null })
      this.domainForm.get('domainValidationOtp').clearValidators()
      this.domainForm.get('domainValidationOtp').updateValueAndValidity()
      this.domainForm.get('swapEmail').setErrors({ genericDomain: null })
      this.domainForm.get('swapEmail').updateValueAndValidity({ emitEvent: false })
      this.domainForm.get('swapEmail').setErrors({ emailExistsAlready: null })
      this.domainForm.get('swapEmail').updateValueAndValidity({ emitEvent: false })
      if (param == 'JOBS') {
        this.commonVariables.emailDomainValidation = false
        this.searchData.setCommonVariables(this.commonVariables)
      } else if (param == 'CANDIDATE') {
        this.commonVariables.emailDomainValidation = false
        this.searchData.setCommonVariables(this.commonVariables)
      }
    }

  }
  userid = localStorage.getItem('userId')

  async getToJob() {
    try {
      this.util.startLoader();
      await this.generateYears();
      await this.getCountries();
      await this.jobformfield();
      await this.onchangejob();
      // All asynchronous operations are complete at this point
      this.getListValues('JOBS');
    } catch (error) {
    } finally {
      this.util.stopLoader();
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

  jobformfield() {
    this.util.startLoader();
    var country: any = ''
    let location: Location;
    if (this.userdata1 != null) {
      this.userdata1.forEach(ele => {
        if (ele.currentOrganization == true) {
          country = ele.country;
          location = {
            country: ele.country, city: ele.city, state: this.toTitleCase(ele.state), zipCode: ele.zipcode
          };
        }
      })
      if (location != undefined) this.onChangeCountry(location.country, '');
    }

    this.jobPostForm = new AppSettings().getCreateJobForm(location);


  }

  onchangejob() {
    try {
      var formval: any = localStorage.getItem(this.userid + "_landingPagejobPostForm")
      if (formval != null || formval != undefined) {
        formval = formval.slice(1, -1)

        var tempdata: CryptoJS.lib.WordArray = CryptoJS.AES.decrypt(decodeURIComponent(formval), "secret key");
        var decrypt: any = JSON.parse(tempdata.toString(CryptoJS.enc.Utf8));

        setTimeout(() => {

          if (decrypt.secondarySkills != null) {
            decrypt.secondarySkills.forEach(ele => {
              this.secondarySkillsSelected.push(ele)
            })
          }
          if (decrypt.primarySkills != null) {
            decrypt.primarySkills.forEach(ele => {
              this.primarySkillsSelected.push(ele)
            });
          }

          this.jobPostForm.patchValue(decrypt)
          this.onClientTypeChange(decrypt.clientType);

        }, 4000);
      }
    } catch (error) {
      localStorage.removeItem(this.userid + "_landingPagejobPostForm")
    }
  }

  domainForm: UntypedFormGroup

  get domainControl() {
    return this.domainForm.controls
  }

  primaryEmail: any;
  firstName: any;
  lastName: any;
  secondaryEmail: any = null
  openModal: boolean = false
  domainList: any = []
  creditPoints: any;
  currentEntity: any;
  workExp: Array<WorkExperience>;
  clientType: any;
  beingEdited: boolean = false
  @ViewChild("postableconsole") postableconsole;
  userdata1: any;
  userdatacandidate: any;
  workauthcountry: any;
  currentOrg: boolean;
  showContent: "JOBS" | "CANDIDATE";

  async createJobsOrCandidates(param, boolean: boolean = true, called: boolean = false) {
    this.gigsumoService.buttonClicked = false;
    this.showContent = param;
    this.currentEntity = param;
    this.beingEdited = true
    if (!called) {
      let hasCurrentOrganization: boolean = await this.userService.checkIfUserHasCurrentOrganization(
        { userId: this.userId, userType: this.userType });
      if (!hasCurrentOrganization && this.userType != 'FREELANCE_RECRUITER') {
        this.addWorkExperience();
        return;
      }
    }
    try {
      this.util.startLoader();
      await new Promise(resolve => setTimeout(resolve, 1000));
      const userData = await this.planService.UPDATE_USERDETAILS("JOB_CANDIDATE_POSTINGS");
      let availablePoints = null;
      let actualPoints = null;
      let utilizedPoints = null;
      let promotional = null;
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
        this.beingEdited = false;
        this.afterValidatePlan(param, boolean);
        this.util.stopLoader();
        return;
      }
      if (userData.isExpired) {
        this.gigsumoService.buttonClicked = true;
        this.beingEdited = false;
        this.planService.expiredPopup("JOB_CANDIDATE_POSTINGS", "PAY", null, null, null, availablePoints, actualPoints, utilizedPoints, promotional);
        return;
      } else {
        this.beingEdited = false;
        this.afterValidatePlan(param, boolean);
      }
    } catch (error) {

    } finally {

      this.util.stopLoader();
    }

  }



  afterValidatePlan(param, boolean) {
    this.disable_for_draft = false;
    this.submit = false;
    this.candidateSubmit = false;
    this.currentDate = [];
    this.maxDate = [];
    this.commonVariables.creditFlag = false
    this.commonVariables.educationFlag = false
    this.commonVariables.workExperienceFlag = false
    this.commonVariables.jobPostingFlag = false
    this.commonVariables.candidatePostingFlag = false
    this.commonVariables.postPrivacyFlag = false
    this.commonVariables.emailDomainValidation = false
    this.commonVariables.postFormflag = false;
    // this.commonVariables.postPrivacyFlag = true


    if (boolean == true) {
      this.openModal = true
    } else {
      this.openModal = false
    }
    this.currentOrg = false
    // console.log(this.openModal)
    this.fileDragdrop = null;
    this.commonVariables.creditFlag = false;
    var data: any = {}
    data.userId = this.userId
    data.userType = this.userType
    this.util.startLoader();
    this.api.create('user/profileDetails', data).subscribe(res => {
      this.util.stopLoader()

      this.clientType = res.data.userData.clientType
      this.userdata1 = res.data.exeperienceList
      this.userdatacandidate = res.data.exeperienceList
      if (res.data && res.data.exeperienceList) {
        res.data.exeperienceList.forEach(workExperience => {
          if (workExperience.currentOrganization) {
            this.currentOrg = true;
            this.currentOrganizationDetail = workExperience;
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
      // const a = this.domainList.indexOf(validateEmail)
      // if (res.data.currentTimeByTimezone == undefined && localStorage.getItem('userType') == 'FREELANCE_RECRUITER') {
      //   this.modelshowforTimeZone(this.timezoneforFreelauncher);
      //   this.getCountries_forform();
      // } else
      // if (res.code == '00000') {
      res.data.GIGSUMO_GENERIC_EMAIL_DOMAINS.listItems.forEach(ele => {
        this.domainList.push(ele.item)
      })
      this.firstName = res.data.userData.firstName;
      this.lastName = res.data.userData.lastName;
      // this.creditPoints = res.data.creditPoints
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
        if (this.userType != 'FREELANCE_RECRUITER') {
          this.addWorkExperience(res.data.userData.clientType);
        } else {
          if (this.currentEntity == 'JOBS') {
            this.getToJob()
          } else if (this.currentEntity == 'CANDIDATE') {
            this.getToCandidate()
          }
        }
      }
      else if (param === 'JOBS' && ((res.data.exeperienceList != null || res.data.exeperienceList.length > 0) && this.currentOrg)) {
        res.data.exeperienceList.forEach(ele => {
          this.workExperienceDetailsCheck.push(ele)
        })
        // }
        if (this.currentEntity == 'JOBS') {
          this.getToJob()
        } else if (this.currentEntity == 'CANDIDATE') {
          this.getToCandidate()
        }
      }

      else if (this.userType != 'FREELANCE_RECRUITER' && param === 'CANDIDATE' && ((res.data.exeperienceList === null || res.data.exeperienceList.length === 0) || (res.data.exeperienceList.length > 0 && !this.currentOrg))) {

        res.data.exeperienceList.forEach(ele => {
          this.workExperienceDetailsCheck.push(ele)
        })
        this.addWorkExperience(res.data.userData.clientType);
      } else if (this.userType == 'FREELANCE_RECRUITER' && param === 'CANDIDATE') {
        this.getToCandidate();
      }


      else if (param === 'CANDIDATE' && ((res.data.exeperienceList != null || res.data.exeperienceList.length > 0) && this.currentOrg)) {

        if (this.userType == 'JOB_SEEKER') {
          if (res.data.candidateList) {
            if (res.data.candidateList.length >= 1) {
              this.beingEdited = false
              this.gigsumoService.buttonClicked = true;
              Swal.fire({
                position: "center",
                icon: "info",
                title: "Number of candidates exceeded",
                text: "You can't create more than 1 profiles for yourself as a job seeker.",
                showConfirmButton: true,
                showCancelButton: false,
                // timer: 1500,
              })
            } else if (res.data.candidateList.length < 1) {

              let element: any = {};

              if (localStorage.getItem('userType') == res.data.userData.userType && this.currentEntity == 'JOBS') {

              } else if (localStorage.getItem('userType') == res.data.userData.userType && this.currentEntity == 'CANDIDATE') {

              }



              if (this.currentEntity == 'JOBS') {
                this.getToJob()
              } else if (this.currentEntity == 'CANDIDATE') {

                this.getToCandidate()
              }

            }
          } else {

            let element: any = {};

            if (localStorage.getItem('userType') == res.data.userData.userType) {
              element = res.data.creditConsumptions.find(item => item.creditType === AppSettings.UPGRADE_CANDIDATE)
            }


            if (this.currentEntity == 'JOBS') {
              this.getToJob()
            } else if (this.currentEntity == 'CANDIDATE') {

              this.getToCandidate()
            }

          }
        }
        else {
          res.data.exeperienceList.forEach(ele => {
            this.workExperienceDetailsCheck.push(ele)
          })
          if (this.currentEntity == 'JOBS') {
            this.getToJob()
          } else if (this.currentEntity == 'CANDIDATE') {
            this.getToCandidate()
          }
        }
      }

      // }

    })
  }
  // time zone code for freelauncher
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


  openJobOrCandidate(openForm: { content: string, data: any }) {
    // this.modalRef = this.modalService.show(template, this.backdropConfig);
    if (openForm.content == 'JOBS') {
      this.getToJob();
      this.commonVariables.jobPostingFlag = true
      this.commonVariables.candidatePostingFlag = false
      this.commonVariables.workExperienceFlag = false
      this.commonVariables.educationFlag = false
      this.commonVariables.emailDomainValidation = false
      this.searchData.setCommonVariables(this.commonVariables)

    } else if (openForm.content == 'CANDIDATE') {
      this.getToCandidate();
      this.commonVariables.candidatePostingFlag = true
      this.commonVariables.jobPostingFlag = false
      this.commonVariables.workExperienceFlag = false
      this.commonVariables.educationFlag = false
      this.commonVariables.emailDomainValidation = false
      this.searchData.setCommonVariables(this.commonVariables);
    } else if (openForm.content == 'CREDIT') {
      this.commonVariables.creditFlag = true
      this.commonVariables.educationFlag = false
      this.commonVariables.workExperienceFlag = false
      this.commonVariables.jobPostingFlag = false
      this.commonVariables.candidatePostingFlag = false
      this.commonVariables.postPrivacyFlag = false
      this.commonVariables.emailDomainValidation = false
    }

    setTimeout(() => {
      this.createJobsOrCandidates(this.currentEntity, true, true);
    }, 1000);

  }
  saveusertimezone() {
    this.timezonSubmited = true;
    if (this.freeLauchtimezoneFrom.valid) {
      this.util.startLoader();
      this.api.query("user/" + this.userId).subscribe((res) => {
        res.timeZoneCountry = this.freeLauchtimezoneFrom.value.timeZoneCountry;
        res.timeZone = this.freeLauchtimezoneFrom.value.timeZone;
        this.api.create("user/updateUser", res).subscribe((res) => {
          this.util.stopLoader();
          if (res.code == "00000") {

            Swal.fire({
              icon: "success",
              title: "Updated successfully.",
              showConfirmButton: false,
              timer: 2000,
            });
            this.beingEdited = false;
            this.openModal = false;
            this.modalRef.hide();
            if (this.currentEntity == 'CANDIDATE') {
              this.commonVariables.candidatePostingFlag = true
              this.commonVariables.jobPostingFlag = false
              this.commonVariables.postPrivacyFlag = false
              this.commonVariables.workExperienceFlag = false
              this.commonVariables.educationFlag = false
              this.searchData.setCommonVariables(this.commonVariables)
            } else if (this.currentEntity == 'JOBS') {
              this.commonVariables.jobPostingFlag = true
              this.commonVariables.postPrivacyFlag = false
              this.commonVariables.workExperienceFlag = false
              this.commonVariables.educationFlag = false
              this.searchData.setCommonVariables(this.commonVariables)
            }


            this.createJobsOrCandidates(this.currentEntity, true);

          }
        }, err => {
        });

      });
    }


  }

  modelclose() {
    this.gigsumoService.buttonClicked = true;
    this.modalRef.hide();
    this.freeLauchtimezoneFrom.reset();
    this.beingEdited = false;
    this.openModal = false;
  }


  getCountries_forform() {
    this.countryList = [];
    this.util.startLoader();
    this.api.query("country/getAllCountries").subscribe((res) => {
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



  changecountry(countryCode) {
    this.timeZonecountryforFreelaucher(countryCode)
  }

  timeZonecountryforFreelaucher(countryCode) {
    this.timezoneslist = [];
    this.api.query("user/timeZoneByCountryCode/" + countryCode).subscribe((res) => {
      if (res) {
        this.util.stopLoader();
        this.timezoneslist = res.data.zones;
      }
    }, err => {
      this.util.stopLoader();
    });
  }

  checkspace(event: any): boolean {
    return super.validSpace(event);
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
  saveWorkExperience() {
    this.workSaveFlag = true
    if (this.eperienceForm.valid) {
      this.currentOrg = true;

      this.util.startLoader();
      this.api.create("user/v1/workexperience", this.workExperience.getRawValue()[0]).subscribe((res) => {
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


            var profiledata: any = {}
            profiledata.userId = localStorage.getItem('userId')
            profiledata.userType = localStorage.getItem('userType')
            this.api.create('user/profileDetails', profiledata).subscribe(res => {
              let element: any = {};
              this.clientType = res.data.userData.clientType
              if (localStorage.getItem('userType') == res.data.userData.userType && this.currentEntity == 'JOBS') {

              } else if (localStorage.getItem('userType') == res.data.userData.userType && this.currentEntity == 'CANDIDATE') {

              }
              if (this.currentEntity == 'JOBS') {
                this.getToJob()
              } else if (this.currentEntity == 'CANDIDATE') {
                this.getToCandidate()
              }
            })
          })
        }
      })
    }
  }

  closeWorkExperience() {
    this.gigsumoService.buttonClicked = true;
    this.beingEdited = false
    if (this.openModal == true) {
      this.modalRef.hide()
      setTimeout(() => {
        this.commonVariables.creditFlag = false
        this.commonVariables.educationFlag = false
        this.commonVariables.workExperienceFlag = false
        this.commonVariables.jobPostingFlag = false
        this.commonVariables.candidatePostingFlag = false
        this.commonVariables.postPrivacyFlag = false
        this.commonVariables.emailDomainValidation = false
      }, 1500);
    } else {
      this.commonVariables.creditFlag = false
      this.commonVariables.educationFlag = false
      this.commonVariables.workExperienceFlag = false
      this.commonVariables.jobPostingFlag = false
      this.commonVariables.candidatePostingFlag = false
      this.commonVariables.postPrivacyFlag = false
      this.commonVariables.emailDomainValidation = false
    }

  }



  routeToCredits() {

    this.showmodel = true
    this.modalRef.hide();
    this.router.navigate(['checkout'])


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


    this.getInstitutions()
  }


  addWorkExperience(clientType: string = null) {
    this.generateYears1()
    var data = { "domain": "CLIENT_TYPE,PAY_TYPE,GIGSUMO_JOB_TITLE,GIGSUMO_RECRUITERS_TITLE_LIST" }
    this.clientTypeList = []
    this.candidateJobTitleList = []
    this.recruiterTitleList = []
    this.util.startLoader();
    this.api.create('listvalue/findbyList', data).subscribe(res => {
      this.util.stopLoader();
      if (res.code == '00000') {
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
    this.api.query("care/intitutions/" + data).subscribe((res) => {
      this.util.stopLoader();
      res.forEach((ele) => {
        this.schoolData.institutionId = event.item.institutionId;
        this.schoolData.city = ele.city;
        this.schoolData.eduId = ele.eduId;
        this.schoolData.userId = this.userId;
        this.schoolData.state = ele.state;
        this.schoolData.country = ele.country;
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

  eduSaveFlag: boolean = false

  eduForm: UntypedFormGroup
  instList: any = []
  getInstitutions() {
    this.instList = []
    this.util.startLoader()
    this.api.query("care/institutions").subscribe((res) => {
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
    this.commonVariables.postPrivacyFlag = false
    this.commonVariables.emailDomainValidation = false
    if (this.openModal == true) {
      this.modalRef = this.modalService.show(this.postTemplate, this.backdropConfig);
    }
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
      timeZone: [null, [Validators.required]],
      startYear: [this.currentYear, [Validators.required]],
      endMonth: [null],
      endYear: [this.currentYear],
      city: [null, [Validators.required, CustomValidator.max(this.CITY.max)]],
      street: [null, [Validators.required]],
      state: [null, [Validators.required, CustomValidator.max(this.STATE.max)]],
      zipcode: [null, [Validators.required, CustomValidator.minmaxLetters(this.ZIPCODE.min, this.ZIPCODE.max)]],
      country: [null, [Validators.required]],
      speciality: [null, [Validators.required]],
    });
  }



  getWorkFormGroup(index): UntypedFormGroup {
    const formGroup = this.workExperience.controls[index] as UntypedFormGroup;
    return formGroup;
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
  profileyears: any = []
  generateYearsprofile() {
    var max = new Date().getFullYear();
    var min = max - 80;
    for (var i = min; i <= max; i++) {
      this.profileyears.push(i);
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

  zipCodeValidaiton(x: number): boolean {
    if (String(x).length > 10) {
      return false;
    }
    return true;
  }

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
    this.workExperience.at(0).get('clientType').patchValue(clientType)
    this.commonVariables.workExperienceFlag = true
    this.commonVariables.educationFlag = false
    this.commonVariables.jobPostingFlag = false
    this.commonVariables.candidatePostingFlag = false
    this.commonVariables.postPrivacyFlag = false
    this.commonVariables.emailDomainValidation = false;
    this.searchData.setCommonVariables(this.commonVariables);
    this.modalRef = this.modalService.show(this.postTemplate, this.backdropConfig);

  }
  closeflagModal() {
    this.commonVariables.workExperienceFlag = false;
    this.beingEdited = false;
  }


  autoComplete: MatAutocompleteTrigger;
  searchBarShow: boolean = false
  uniqueOrgList: Array<Partial<HealthCareOrganization>> = [];

  getOrgList(value) {
    if (value != null) {
      const orgList: Array<Partial<HealthCareOrganization>> = [];
      this.api.query("care/organizations?organizationName=" + this.workExperience.value[0].organisationName)
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


  // when no result matched the value, organization id is set to null
  changeTypeaheadNoResults(index, val) {
    if (val == "work") {
      this.getWorkFormGroup(index).patchValue({
        organisationId: null,
      });
    } else if (val == "edu") {

    }

  }


  workSaveFlag: boolean = false;

  createWorkExperience(): UntypedFormGroup {
    return this.formBuilder.group({
      currentOrganization: [true],
      organisationName: [
        null,
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[^\s]+(\s+[^\s]+)*$/),
        ]),
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

  saveEducation() {
    this.eduSaveFlag = true
    if (this.eduForm.valid) {
      this.util.startLoader();
      this.api
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

              this.getToCandidate()
            })
          }
        })
    }
  }


  onChngOrg(event) {
    this.jobPostForm.patchValue({
      organisationId: event.organizationId
    })


  }

  onChngOrg1(value, index) {

    var data = value.organizationName + "/" + value.organizationId;
    this.util.startLoader();
    this.api.query("care/organization/" + data).subscribe((res) => {

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
          this.api.query("business/details/" + res[0].businessId).subscribe((res) => {
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
        // this.util.startLoader()
        this.api.create('business/find/superadmin', data).subscribe(res => {
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
      this.api
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
      this.api
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
      this.api
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
  selectedCountries: boolean = false
  typeTargetValue: null;


  onChangePeriod(val: any) {

  }
  onengagementTypeChange(value) {
    if (value == 'W2 - Full Time') {
      this.jobPostForm.get('duration').disable();
      this.jobPostForm.get('durationType').disable();
      this.updateControl({ value: 'duration', form: this.jobPostForm }, "CLEAR");
      this.updateControl({ value: 'durationType', form: this.jobPostForm }, "CLEAR");
    } else {
      this.jobPostForm.get('duration').enable();
      this.jobPostForm.get('durationType').enable();
      this.jobPostForm.get('durationType').patchValue('Months');
      this.updateControl({ value: 'duration', form: this.jobPostForm });
      this.updateControl({ value: 'durationType', form: this.jobPostForm });
    }

  }

  onChangeCandidate() {
    try {
      var formval: any = localStorage.getItem(this.userid + "_landingPagecandidatePostForm")
      if (formval != null || formval != undefined) {
        formval = formval.slice(1, -1)
        var tempdata = CryptoJS.AES.decrypt(decodeURIComponent(formval), "secret key");
        var decrypt = JSON.parse(tempdata.toString(CryptoJS.enc.Utf8));


        setTimeout(() => {
          this.candidatePostForm.patchValue(decrypt)


        }, 4000);
      }
    } catch (error) {

      localStorage.removeItem(this.userid + "_landingPagecandidatePostForm");
    }
  }

  candidateJobTitleList: any = []
  periodList: any = []

  totalExperienceList: any = []
  otherStatesList: any = []
  engagementTypeList: any = []



  async getToCandidate() {
    try {
      this.util.startLoader();
      this.animState0 = 'right';
      this.animState1 = 'right';
      this.animState = 'right';
      this.animState2 = 'middle';

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

      if (this.userType == 'JOB_SEEKER') {
        this.candidatePostForm.get('candidateEmailId').clearValidators();
        this.candidatePostForm.get('candidateEmailId').updateValueAndValidity();
      }

      await Promise.all([
        this.getCountries(),
        this.onChangeCandidate(),
        this.generateYears()
      ]);



      if (this.userType == 'JOB_SEEKER') {
        this.candidatePostForm.patchValue({
          createCandidateOnPlatform: false,
          candidateEmailId: null,
          email: this.primaryEmail,
          firstName: this.firstName,
          lastName: this.lastName,
          createdBy: localStorage.getItem('userId')
        });

        this.candidatePostForm.get('email').disable();
        this.candidatePostForm.get('firstName').disable();
        this.candidatePostForm.get('lastName').disable();
      } else {
        this.candidatePostForm.get('email').enable();
        this.candidatePostForm.get('firstName').enable();
        this.candidatePostForm.get('lastName').enable();
        this.candidatePostForm.patchValue({
          createdBy: localStorage.getItem('userId')
        });
      }

      this.getListValues('CANDIDATE');
    } catch (error) {
      console.error('An error occurred:', error);
    } finally {
      setTimeout(() => {
        this.util.stopLoader();
      }, 2500);
    }
  }

  selectedTitle: any;
  onselecte(value) {
    this.selectedTitle = value.item;
  }

  submit: boolean = false;
  serverCurrentDate: string;

  createJob(statusvalue) {

    this.submit = true
    this.disable_for_draft = true;
    if (statusvalue == 'ALL' && this.jobPostForm.status == "INVALID") {
      this.scrollToFirstInvalidControl('jobfrom')
      this.disable_for_draft = false;
      return true;
    }


    localStorage.removeItem(this.userid + "_landingPagejobPostForm")
    this.submit = true

    if (statusvalue == "DRAFTED") {
      for (var allstatus in this.jobPostForm.controls) {
        if (allstatus != 'clientName' && allstatus != 'jobTitle') {

          this.jobPostForm.get(allstatus).clearValidators();

        }
        this.jobPostForm.controls[allstatus].updateValueAndValidity();
      }
      this.jobPostForm.get('status').patchValue('DRAFTED');
    }
    if (this.jobPostForm.valid && this.wordlength < 500) {
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: { confirmButton: 'btn btn-success', cancelButton: 'btn btn-danger' },
        buttonsStyling: false
      })

      this.jobPostForm.value.PostedByUserType = localStorage.getItem('userType');
      this.jobPostForm.patchValue({ 'PostedByUserType': localStorage.getItem('userType') })
      if (statusvalue != "DRAFTED") {
        this.savejobafterValdaiton();
      } else {
        this.draftsavecancel(statusvalue)

      }

    }


  }

  draftsavecancel(statusvalue) {
    this.beingEdited = false
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



  savejobafterValdaiton() {
    localStorage.removeItem(this.userid + "_landingPagejobPostForm")

    this.beingEdited = false
    this.util.startLoader();

    this.jobStreamData = [];

    let datas: any = {};

    datas = this.jobPostForm.getRawValue();
    datas.jobReferenceId = this.jobPostForm.value.jobId;

    datas.jobPostedBy = localStorage.getItem('userId');
    if (this.currentOrganizationDetail && this.currentOrganizationDetail.organisationId) {
      datas.organisationId = this.currentOrganizationDetail.organisationId;
    }
    // Check if this.workExp is defined before accessing it
    if (this.workExp && this.workExp.length > 0) {
      this.workExp.forEach(ele => {
        if (ele.currentOrganization == true) {
          this.clientType = ele.clientType;
        }
      });
    }

    const currentStatus: string = this.jobPostForm.value.status;

    this.api.create('jobs/createJob', datas).subscribe(res => {
      if (res.code == '00000') {
        if (environment.AsyncSync == "SYNC") {
          if (res.code == '00000') {
            this.disable_for_draft = false;
            this.jobStreamData = [];
            this.modalRef.hide();
            let data: any = {}
            data.count = 1;
            data.flag = true;
            this.searchData.setjobCount(data);
            this.currentDate = [];
            this.maxDate = [];
            Swal.fire({
              position: "center",
              icon: "success",
              title: super.getTextBasedOnStatus(currentStatus, currentStatus === GigsumoConstants.DRAFTED ? "Draft saved" : "Job created"),
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
              data.value = 'fromFeed'
              this.router.navigate(["newjobs"], { queryParams: { createJob: res.data.jobData.jobId, status: res.data.jobData.status } });
              this.searchData.setHighlighter('newjobs')
            }, 2000);

          }


        }
        else if (environment.AsyncSync == "ASYNC") {
          let timeout: any = undefined;
          // 3 mins validate
          this.rxjsTimer.pipe(takeUntil(this.destroy)).subscribe((val) => {
            timeout = val;

          });
          setTimeout(() => {
            const source = interval(1000);
            this.subscription = source.subscribe(val => {


              if (timeout != undefined) {
                this.util.stopLoader();
                this.subscription && this.subscription.unsubscribe();
                Swal.fire({
                  position: "center",
                  icon: "info",
                  title: "Job is being created. Please refresh the page",
                  showConfirmButton: false,
                  allowEscapeKey: false,
                  allowOutsideClick: false,
                  timer: 10000,
                })
                this.modalService.hide(1)
              }
              if (this.jobStreamData && this.jobStreamData != undefined && this.jobStreamData.length != 0 && this.jobStreamData != null) {
                this.util.stopLoader();
                this.subscription && this.subscription.unsubscribe();
                if (this.jobStreamData.length != 0 && this.jobStreamData != undefined && this.jobStreamData.code == "00000" && res.data.jobData.jobId == this.jobStreamData.requestId) {
                  this.util.stopLoader();
                  if (res.code == '00000') {
                    this.disable_for_draft = false;
                    this.subscription.unsubscribe();
                    this.jobStreamData = [];
                    this.stremService.clearsubjectvalue();
                    this.modalRef.hide();
                    let data: any = {}
                    data.count = 1;
                    data.flag = true;
                    this.searchData.setjobCount(data);
                    this.currentDate = [];
                    this.maxDate = [];
                    Swal.fire({
                      position: "center",
                      icon: "success",
                      title: super.getTextBasedOnStatus(currentStatus, currentStatus === GigsumoConstants.DRAFTED ? "Draft saved" : "Job created"),
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
                      let data: any = {}
                      data.value = 'fromFeed'
                      this.router.navigate(["newjobs"], { queryParams: { createJob: res.data.jobData.jobId, status: res.data.jobData.status } });
                      this.searchData.setHighlighter('newjobs')
                    }, 2000);

                    // setTimeout(() => {
                    //   this.commonVariables.loadJobs = true
                    //   this.searchData.setLoadJobOrCandidate(this.commonVariables)
                    // }, 4000);
                  }
                } else {
                  Swal.fire({
                    position: "center",
                    icon: "info",
                    title: "Job is being created. Please refresh the page",
                    showConfirmButton: false,
                    allowEscapeKey: false,
                    allowOutsideClick: false,
                    timer: 10000,
                  })
                }
              }


            });
          }, 1000);

        }


      }
    }, err => {
      this.util.stopLoader();
    });

  }

  resumeUpload(event) {
    this.resumeupload = event.target.files[0];
  }



  patchEmail() {
    this.candidatePostForm.patchValue({
      //candidateEmailId: this.candidatePostForm.value.email
      candidateEmailId: this.candidatePostForm.get('email').value
    })

    if (localStorage.getItem("userType") != "JOB_SEEKER") {
      this.emailidcehck(this.candidatePostForm.value.email);
    }

  }

  emailidcehck(id) {
    this.api.query("user/checkMailAlreadyExists/" + id).subscribe((res) => {
      if (res.data.exists) {
        this.candidatePostForm.get('email').setErrors({ existingEmailAddress: true })
        // this.candidatePostForm.get('email').reset();
        this.candidatePostForm.get('candidateEmailId').patchValue(null);
        // Swal.fire({
        //   icon: "info",
        //   title: "There already exists an account registered with this email address, Please enter different email",
        //   showConfirmButton: true,

        // });
      } else {
        this.candidatePostForm.get('email').setErrors({ existingEmailAddress: null })
        this.candidatePostForm.get('email').updateValueAndValidity({ emitEvent: false })
      }
    })

  }
  private scrollToFirstInvalidControl(id) {
    let form = document.getElementById(id);
    let firstInvalidControl = form.getElementsByClassName('ng-invalid')[0];
    firstInvalidControl.scrollIntoView();
    (firstInvalidControl as HTMLElement).focus();
  }


  candidateSubmit: boolean = false

  saveCandidate(statusvaluecandidate) {
    this.candidateSubmit = true
    this.disable_for_draft = true;
    if (statusvaluecandidate == 'ACTIVE' && this.candidatePostForm.status == "INVALID") {
      this.disable_for_draft = false;
      this.scrollToFirstInvalidControl('candidatefrom')
      return true;
    }
    this.beingEdited = false
    localStorage.removeItem(this.userid + "_landingPagecandidatePostForm")

    this.candidateSubmit = true

    this.candidatePostForm.value.createdByUserType = localStorage.getItem('userType')
    this.candidatePostForm.patchValue({ 'createdByUserType': localStorage.getItem('userType') })

    if (this.photoId != null) {
      this.candidatePostForm.value.photo = this.photoId;
      this.candidatePostForm.patchValue({ 'photo': this.photoId })
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
      this.util.stopLoader();
      this.savecandidateafterValdaiton();
    } else {
      this.draftsavecandidate(statusvaluecandidate)
    }
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
          //this.modalRef.hide();
          this.modalService.hide(1);
          this.modalService.hide(2);
          this.modalService.hide(3);
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
  cancelcloseCandidate() {

    this.candidateSubmit = false
    this.beingEdited = false
    if (this.candidatePostForm.value.firstName != null && this.candidatePostForm.value.lastName != null) {
      this.candidatePostForm.get('status').patchValue('DRAFTED');
      this.draftsavecandidate('DRAFTED');
    } else {
      this.commonVariables.candidatePostingFlag = false
      this.searchData.setCommonVariables(this.commonVariables)
      this.modalRef.hide()
      this.candidatePostForm.reset();
      this.primarySkillsSelected = [];
      this.secondarySkillsSelected = [];
      this.otherSelectedStates = []

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

  savecandidateafterValdaiton() {

    localStorage.removeItem(this.userid + "_landingPagecandidatePostForm")

    this.FormData = new FormData();
    this.FormData.append("resume", this.resumeupload);
    this.resumeupload = "";

    let datas: any = {};

    if (this.currentOrganizationDetail && this.currentOrganizationDetail.organisationId) {
      this.candidatePostForm.get('organisationId').patchValue(this.currentOrganizationDetail.organisationId);
    }


    datas = this.candidatePostForm.getRawValue();
    datas.createdBy = localStorage.getItem('userId');

    if (localStorage.getItem('userType') == 'JOB_SEEKER') {
      datas.effectiveDate = new Date();
      datas.effectiveUntil = new Date();
    }
    const currentStatus: string = this.candidatePostForm.value.status;

    datas.candidateReferenceId = datas.candidateId;
    this.FormData.append("candidate", new Blob([JSON.stringify(datas)], { type: "application/json" }));

    this.util.startLoader();

    this.canidateStreamData = [];

    this.api.create('candidates/createCandidate', this.FormData).subscribe(res => {
      if (res.code == '00000') {
        if (environment.AsyncSync == "SYNC") {
          if (res.code == '00000') {
            this.disable_for_draft = false;
            this.canidateStreamData = [];
            this.candidateSubmit = false
            this.util.stopLoader();
            this.modalRef.hide()
            let data: any = {}
            data.count = 1;
            data.flag = true;
            this.searchData.setcandiadateCount(data);
            this.currentDate = [];
            this.maxDate = [];
            Swal.fire({
              position: "center",
              icon: "success",
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
              data.value = 'fromFeed'
              this.router.navigate(["newcandidates"], { queryParams: { createCandidate: res.data.candidateData.candidateId, status: this.candidatePostForm.get('status').value } });
              this.searchData.setHighlighter('newcandidates')
            }, 2000);
          }

        } else if (environment.AsyncSync == "ASYNC") {
          let timeout: any = undefined;
          // 3 mins validate
          this.rxjsTimer.pipe(takeUntil(this.destroy)).subscribe((val) => {
            timeout = val;

          });
          setTimeout(() => {
            const source = interval(0);
            this.subscription = source.subscribe(val => {

              // time out
              if (timeout != undefined) {
                this.util.stopLoader();
                this.subscription && this.subscription.unsubscribe();
                Swal.fire({
                  position: "center",
                  icon: "info",
                  title: "Candidate is being created. Please refresh the page",
                  showConfirmButton: false,
                  allowEscapeKey: false,
                  allowOutsideClick: false,
                  timer: 10000,
                })
              }
              if (this.canidateStreamData && this.canidateStreamData.code == "00000") {
                this.util.stopLoader();
                // clear subscriber
                this.subscription && this.subscription.unsubscribe();
                if (this.canidateStreamData != undefined && this.canidateStreamData.length != 0 && this.canidateStreamData.code == "00000" && res.data.candidateData.candidateId == this.canidateStreamData.requestId) {
                  if (res.code == '00000') {
                    this.disable_for_draft = false;
                    this.canidateStreamData = [];
                    this.stremService.clearsubjectvalue();
                    this.candidateSubmit = false
                    this.util.stopLoader();
                    this.modalRef.hide()
                    let data: any = {}
                    data.count = 1;
                    data.flag = true;
                    this.searchData.setcandiadateCount(data);
                    this.currentDate = [];
                    this.maxDate = [];
                    Swal.fire({
                      position: "center",
                      icon: "success",
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
                      data.value = 'fromFeed'
                      this.router.navigate(["newcandidates"], { queryParams: { createCandidate: res.data.candidateData.candidateId, status: this.candidatePostForm.get('status').value } });
                      this.searchData.setHighlighter('newcandidates')
                    }, 2000);
                  } else {
                    Swal.fire({
                      position: "center",
                      icon: "info",
                      title: "Candidate is being created. Please refresh the page",
                      showConfirmButton: false,
                      allowEscapeKey: false,
                      allowOutsideClick: false,
                      timer: 10000,
                    })
                  }
                }
              }


              // setTimeout(() => {
              //   this.commonVariables.loadCandidates = true
              //   this.searchData.setLoadJobOrCandidate(this.commonVariables)
              // }, 5000);
            });
          }, 1000);
        }


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
  years1: any = []
  generateYears1() {
    var max = new Date().getFullYear();
    var min = max - 80;
    for (var i = min; i <= max; i++) {
      this.years1.push(i);
    }
  }

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

  stateListCA: any = []
  stateListIN: any = []
  stateListAU: any = []
  countryList: any = [];

  getCountries() {
    this.countryList = [];
    this.util.startLoader();
    this.api.query("country/getAllCountries").subscribe((res) => {
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

  formfield() {
    let location: Location;

    if (this.userdatacandidate != null && this.userdatacandidate != undefined) {
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
  payType: null;
  targetRate: null;
  countryChosen: null;
  figureLength: number = 0;
  usStatesList: any = [];
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
      this.api.query('listvalue/find?domain=WORK_AUTHORIZATION_US').subscribe(res => {
        if (res.code == '00000') {
          this.workAuthorizationList = [];
          this.util.stopLoader()
          res.data.listValues[0].listItems.forEach(ele => {
            this.workAuthorizationList.push(ele.item)
            var mySet = new Set(this.workAuthorizationList);
            this.workAuthorizationList = [...mySet]
          });

          this.api
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
      this.api.query('listvalue/find?domain=WORK_AUTHORIZATION_AU').subscribe(res => {
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
            this.api
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
      this.api.query('listvalue/find?domain=WORK_AUTHORIZATION_IN').subscribe(res => {
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

            this.api
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
      this.api.query('listvalue/find?domain=WORK_AUTHORIZATION_CA').subscribe(res => {
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
            this.api
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

  get jobControls(): { [key: string]: AbstractControl } {
    return this.jobPostForm.controls;
  }

  get candidateControls() {
    return this.candidatePostForm.controls
  }
  get credit() {
    return this.creditform.controls
  }



  cancelJob() {
    this.submit = false
    this.beingEdited = false
    if (this.jobPostForm && this.jobPostForm.get('clientName').value != null && this.jobPostForm.value.jobTitle != null) {
      this.jobPostForm.get('status').patchValue('DRAFTED');
      this.draftsavecancel('DRAFTED');
    } else {
      // this.modalRef.hide();
      for (let i = 1; i <= this.modalService.getModalsCount(); i++) {

        this.modalService.hide(i);

      }
      // this.modalService.hide(1);
      // this.modalService.hide(2);
      // this.modalService.hide(3);
      this.primarySkillsSelected = [];
      this.secondarySkillsSelected = [];
      this.primarySkillsList = []
      this.secondarySkillsList = []
      this.otherSelectedStates = []
      // if (this.openModal == true) {
      setTimeout(() => {
        this.jobPostForm.reset()
        this.commonVariables.jobPostingFlag = false
        this.searchData.setCommonVariables(this.commonVariables)
      }, 1000);
      // }

    }

  }

  closeCredit() {
    this.beingEdited = false
    this.commonVariables.creditFlag = false
    this.commonVariables.jobPostingFlag = false
    this.commonVariables.postPrivacyFlag = false
    this.commonVariables.workExperienceFlag = false
    this.commonVariables.educationFlag = false
    this.searchData.setCommonVariables(this.commonVariables)
  }

  closeExperience() {
    this.gigsumoService.buttonClicked = true;
    this.beingEdited = false
    if (this.openModal == true) {
      this.modalRef.hide()
      this.modalService.hide(1);
      this.modalService.hide(2);
      this.modalService.hide(3);
      setTimeout(() => {
        this.commonVariables.workExperienceFlag = false
        this.searchData.setCommonVariables(this.commonVariables)
      }, 1000);
    } else {
      this.commonVariables.workExperienceFlag = false
      this.searchData.setCommonVariables(this.commonVariables)
    }



  }

  closeEducation() {
    this.beingEdited = false

    if (this.openModal == true) {
      this.modalRef.hide()
      setTimeout(() => {
        this.commonVariables.educationFlag = false
        this.searchData.setCommonVariables(this.commonVariables)
      }, 1500);
    } else {
      this.commonVariables.educationFlag = false
      this.searchData.setCommonVariables(this.commonVariables)
    }


  }

  digitKeyOnly(e) {
    var keyCode = e.keyCode == 0 ? e.charCode : e.keyCode;
    if ((keyCode >= 37 && keyCode <= 40) || (keyCode == 8 || keyCode == 9 || keyCode == 13) || (keyCode >= 48 && keyCode <= 57)) {
      return true;
    }
    return false;
  }

  closeCandidate() {
    this.beingEdited = false
    if (this.openModal == true) {
      this.modalRef.hide()
      setTimeout(() => {
        this.primarySkillsSelected = [];
        this.secondarySkillsSelected = [];
        this.otherSelectedStates = []
        // this.animState0 = 'middle'
        // this.animState1 = 'left'
        // this.animState = 'right'
        this.commonVariables.jobPostingFlag = false
        this.commonVariables.candidatePostingFlag = false
        this.commonVariables.postPrivacyFlag = false
        this.commonVariables.workExperienceFlag = false
        this.commonVariables.educationFlag = false
        this.searchData.setCommonVariables(this.commonVariables)
        this.candidatePostForm.reset();
        this.candidateSubmit = false;


        this.fileshow = undefined;
        this.myFileInputcandidate.nativeElement.value = null;
        this.photoId = null;
      }, 1500);
    } else {
      this.primarySkillsSelected = [];
      this.secondarySkillsSelected = [];
      this.otherSelectedStates = []
      // this.animState0 = 'middle'
      // this.animState1 = 'left'
      // this.animState = 'right'
      this.commonVariables.jobPostingFlag = false
      this.commonVariables.candidatePostingFlag = false
      this.commonVariables.postPrivacyFlag = false
      this.commonVariables.workExperienceFlag = false
      this.commonVariables.educationFlag = false
      this.searchData.setCommonVariables(this.commonVariables)
      this.candidatePostForm.reset();
      this.candidateSubmit = false;


      this.fileshow = undefined;
      this.myFileInputcandidate.nativeElement.value = null;
      this.photoId = null;
    }



  }

  onKeyZip(event: any, param, index) {
    let data: any = {};
    data.countryCode = "US";
    data.zipCode = event.target.value;
    data.stateCode = "";
    if (data.zipCode.length === 5) {
      this.api.create("country/geodetails", data).subscribe((res) => {
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
  uploadMediaHere(value) {
    if (value == 'photo') {
      this.myFileInput1.nativeElement.click();
    } else if (value == 'video') {
      this.myFileInput2.nativeElement.click();
    }
  }
  uploadMediaHere1(value) {

    if (value == 'photo') {
      this.myFileInput3.nativeElement.click();
    } else if (value == 'video') {
      this.myFileInput4.nativeElement.click();
    }
  }

  ngAfterViewInit() {

    setTimeout(() => {
      this.isJoinedCommunity = localStorage.getItem('isJoined')
      this.isCommunityAdmin = localStorage.getItem('communityAdmin');
      this.isCommunitySuperAdmin = localStorage.getItem('communitySuperadmin');
    }, 2000);

    setTimeout(() => {
      if (document.getElementById('jingalala') != null) {
        document.getElementById('jingalala').style.visibility = "visible";
      }

      if (document.getElementById('blengi') != null) {
        document.getElementById('blengi').style.visibility = 'visible'
      }
    }, 3000);

  }



  profPhoto: any = null
  profName: any;
  profileitems: any
  getLoginUserDetails(): void {
    const userId = localStorage.getItem("userId");
    this.util.startLoader();
    this.api.query("user/" + userId).subscribe((res: any) => {
      this.profileitems = res;
      this.util.stopLoader();
      if (res) {
        if (res.code === "00000") {
          // this.clientNameList = res.workExperience
          this.profName = res.firstName + " " + res.lastName
          if (res.photo && res.photo != null) {
            this.profilePhoto.setPhoto(res.photo);
            this.profPhoto = AppSettings.photoUrl + res.photo

          } else {
            this.profilePhoto.setPhoto(null);
            this.profPhoto = null
          }

          res.fullName = res.firstName + " " + res.lastName
          res.photo =
            res.photo && res.photo != null
              ? AppSettings.photoUrl + res.photo
              : null;
          this.loginUser = res;

        }
      }
    });
  }

  modalOpenFlag: boolean = false
  @HostListener('window:scroll')
  handleScroll() {
    // var windowScroll: any;
    if (this.modalOpenFlag == false) {
      this.scrollValue.windowScroll = window.pageYOffset
      this.searchData.setScroll(this.scrollValue)
    }

  }

  savePostSelected(postviewModelName) {
    this.animState0 = 'middle'
    this.animState1 = 'right'
    this.animState = 'right'
    this.postPrivacy = postviewModelName;
    this.tempcheckedList = [...new Set(this.checkedList)];
    // this.dismiss();
    // this.flag
    var commonVariables: any = {};
    this.commonVariables.postPrivacyFlag = false;
    this.commonVariables.postFormflag = true;
    this.searchData.setCommonVariables(commonVariables);
  }

  getPostModel(value, template) {
    if (value != "Everyone") {
      this.checkedList = [];
      this.tempcheckedList = [];
      this.postviewModelName = value;

      this.modalRef_PostView = this.modalService.show(template, {
        backdrop: "static",
        animated: true,
      });
      this.queryPostview(value);
    } else {
      this.checkedList = [];
      this.tempcheckedList = [];
      this.postPrivacy = "Everyone";
      this.privacyValue = 'Everyone'
    }
  }

  nowNthenValue = []
  sdfsdf: boolean = true
  changePostModal(value, param) {

    this.animState0 = 'left'
    this.animState1 = 'middle'
    this.animState = 'right'
    this.nowNthenValue.push(value)
    this.privacyValue = value
    this.searchName = ""
    this.modelList = []
    if (param == 'post') {
      if (value !== "Everyone") {
        var commonVariables: any = {};
        // commonVariables.postPrivacyFlag = true;
        this.searchData.setCommonVariables(commonVariables);
        this.postviewModelName = value;
        this.queryPostview(value);
      } else {
        this.selectedEntities = []
        this.nowNthenValue = []
        this.checkedList = [];
        this.tempcheckedList = [];
        this.postPrivacy = "Everyone";
        this.privacyValue = 'Everyone'
        this.postviewModelName = value;
      }
    } else if (param == 'photo') {
      if (value !== "Everyone") {
        var commonVariables: any = {};
        commonVariables.postPrivacyFlag = true;
        this.searchData.setCommonVariables(commonVariables);



        this.postviewModelName = value;
        this.queryPostview(value);
      } else {
        this.nowNthenValue = []
        this.checkedList = [];
        this.tempcheckedList = [];
        this.postPrivacy = "Everyone";
        this.privacyValue = 'Everyone'
      }
    } else if (param == 'edit') {

      if (value !== "Everyone") {

        var commonVariables: any = {};
        commonVariables.postPrivacyFlag = true;
        this.searchData.setCommonVariables(commonVariables);
        this.postviewModelName = value;
        this.queryPostview(value);
      } else {
        this.nowNthenValue = []
        this.checkedList = [];
        this.tempcheckedList = [];
        this.postPrivacy = "Everyone";
        this.privacyValue = 'Everyone'
      }
    }
  }

  networkZeroFlag: boolean = false
  communityZeroFlag: boolean = false


  queryPostview(val) {
    let datas: any = {};
    datas.userId = localStorage.getItem("userId");
    if (val == "Connections") {
      datas.status = "CONNECTED";
      this.util.startLoader();
      this.api.create("user/connection/info", datas).subscribe((res) => {
        if (res.code == "00000") {
          this.util.stopLoader();
          this.modelList = []
          if (this.nowNthenValue.length > 1) {
            res.data.response.forEach((element2) => {
              element2.checked = false;
            });
            var y = this.nowNthenValue.length - 1
            var z = this.nowNthenValue.length - 2
            var a = this.nowNthenValue[y]
            var b = this.nowNthenValue[z]
            if (a !== b) {
              this.selectedEntities = []
              this.checkedList = [];
              this.tempcheckedList = [];
              res.data.response.forEach((element2) => {
                element2.checked = false;
              });
            } else {
              this.checkedList.forEach(element1 => {
                res.data.response.forEach((element2) => {
                  if (element1 === element2.userId) {
                    element2.checked = true;
                  }
                });
              });
            }
          } else if (this.nowNthenValue.length == 1 && this.privacyValue == 'Connections') {

            this.checkedList.forEach(element1 => {
              res.data.response.forEach((element2) => {
                if (element1 === element2.userId) {
                  element2.checked = true;
                } else {
                  if (element1 === element2.userId) {
                    element2.checked = true;
                  }
                }
              });
            });
          } else {
            res.data.response.forEach((element2) => {
              element2.checked = false;
            });
            this.checkedList.forEach(element1 => {
              res.data.response.forEach((element2) => {
                if (element1 === element2.userId) {
                  element2.checked = true;
                } else {
                  if (element1 === element2.userId) {
                    element2.checked = true;
                  }
                }
              });
            });
          }
          this.modelList = res.data.response;
          if (this.modelList.length == 0) {
            this.connectionZeroFlag = true
          }
          this.commonVariables.postFormflag = false;
          this.commonVariables.postPrivacyFlag = true;
        }
      }, err => {
        this.util.stopLoader();
        if (err.status == 500) {
          this.util.stopLoader();
        }
      });
    } else if (val == "Community") {
      this.util.startLoader();
      this.modelList = []
      this.api.queryPassval("community/check/user", datas).subscribe((res) => {
        if (res.code == "00000") {
          this.util.stopLoader();

          if (this.nowNthenValue.length > 1) {
            res.data.communityModelList.forEach((element2) => {
              element2.checked = false;
            });

            var y = this.nowNthenValue.length - 1
            var z = this.nowNthenValue.length - 2
            var a = this.nowNthenValue[y]
            var b = this.nowNthenValue[z]
            if (a !== b) {
              this.selectedEntities = []
              this.checkedList = [];
              this.tempcheckedList = [];
              res.data.communityModelList.forEach((element2) => {
                element2.checked = false;
                element2.userId = element2.communityId;
              });
            } else {
              this.checkedList.forEach(element1 => {
                res.data.communityModelList.forEach((element2) => {
                  if (element1 === element2.communityId) {
                    element2.checked = true;
                    element2.userId = element2.communityId;
                  }
                })
              });
            }
          } else {
            res.data.communityModelList.forEach((element2) => {
              element2.checked = false;
              element2.userId = element2.communityId;
            });
          }
          this.modelList = res.data.communityModelList
          if (this.modelList.length === 0) {
            this.communityZeroFlag = true
          }
          this.commonVariables.postFormflag = false;
          this.commonVariables.postPrivacyFlag = true;
        }
      }, err => {
        this.util.stopLoader();
      });
    } else if (val == "Network") {
      this.modelList = []
      this.util.startLoader();
      this.api
        .query(
          "network/home?userId=" +
          localStorage.getItem("userId") +
          "&withmember=true&limit=10&offset=0&status=ACTIVE"
        )
        .subscribe((res) => {
          if (res.code == "00000") {
            this.util.stopLoader();
            if (
              res.data.network &&
              res.data.network.length != 0 &&
              res.data.network != null &&
              res.data.network != undefined
            ) {

              if (this.nowNthenValue.length > 1) {

                res.data.network.forEach((element2) => {
                  element2.checked = false;
                });


                var y = this.nowNthenValue.length - 1
                var z = this.nowNthenValue.length - 2
                var a = this.nowNthenValue[y]
                var b = this.nowNthenValue[z]
                if (a !== b) {
                  this.selectedEntities = []
                  this.checkedList = [];
                  this.tempcheckedList = [];
                  res.data.network.forEach((element2) => {
                    element2.checked = false;
                    element2.userId = element2.networkId;
                  });
                } else {
                  this.checkedList.forEach(element1 => {
                    res.data.network.forEach((element2) => {
                      if (element1 === element2.networkId) {
                        element2.checked = true;
                        element2.userId = element2.networkId;
                      }
                    });
                  });
                }
              } else {
                res.data.network.forEach((element2) => {
                  element2.checked = false;
                  element2.userId = element2.networkId;
                });
              }






              this.modelList = res.data.network;
            } else {
              this.networkZeroFlag = true
            }
            this.commonVariables.postFormflag = false;
            this.commonVariables.postPrivacyFlag = true;
          }
        }, err => {
          this.util.stopLoader();
        });
    }
  }


  storedPage: any;
  config = {
    itemsPerPage: 5,
    currentPage: 1
  }

  pagecount(count) {
    this.config.currentPage = count
    this.storedPage = count
  }

  onSearch(event: any) {
    if (event.target.value != '') {
      this.config.currentPage = 1
    } else if (event.target.value == '') {
      this.config.currentPage = this.storedPage
    }
  }


  selectedEntities: any = []

  onCheckboxChange(option, event) {
    if (event.target.checked) {
      option.checked = true;
      if (option.connection) {
        this.checkedList.push(option.userId);
        this.selectedEntities.push(option.fullName)
        this.selectedEntities = this.duplicate(this.selectedEntities)
      } else if (option.networkId) {
        this.checkedList.push(option.networkId);
        this.selectedEntities.push(option.networkName)
        this.selectedEntities = this.duplicate(this.selectedEntities)
      } else if (option.communityId) {
        this.checkedList.push(option.communityId);
        this.selectedEntities.push(option.communityName)
        this.selectedEntities = this.duplicate(this.selectedEntities)
      }
    } else {
      option.checked = false;
      for (var i = 0; i < this.modelList.length; i++) {
        if (option.connection) {
          if (this.checkedList[i] == option.userId) {
            this.checkedList.splice(i, 1);
            this.selectedEntities.splice(i, 1);
          }
        } else if (option.networkId) {
          if (this.checkedList[i] == option.networkId) {
            this.checkedList.splice(i, 1);
            this.selectedEntities.splice(i, 1);
          }
        } else if (option.communityId) {
          if (this.checkedList[i] == option.communityId) {
            this.checkedList.splice(i, 1);
            this.selectedEntities.splice(i, 1);
          }
        }
      }
    }
  }
  duplicate(data) {
    var temp = [];
    var arr = data.filter(function (el) {
      if (temp.indexOf(el) == -1) {
        temp.push(el);
        return true;
      }
      return false;
    });
    return arr;
  }

  remove(chooseEntity: string): void {
    const index = this.selectedEntities.indexOf(chooseEntity);

    if (index >= 0) {
      this.selectedEntities.splice(index, 1);
    }
  }
  selectable = true;
  removable = true;
  fruitCtrl = new UntypedFormControl();
  selected(event: MatAutocompleteSelectedEvent): void {
    this.selectedEntities.push(event.option.viewValue);
    // this.fruitInput.nativeElement.value = '';
    this.fruitCtrl.setValue(null);
  }


  imagePopup(template) {
    this.modalRef = this.modalService.show(template, {
      backdrop: "static",
      animated: true,
    });
  }

  additems(data) {
    data.forEach((element, index) => {
      this.userData.push(element);
    });
  }

  onScrollDown() {
   // this.route.queryParams.subscribe((res) => {
      // if ((!res || Object.keys(res).length === 0) ||
      //     (this.postLoading == false && this.shouldCallCommonPost(res))) {
          if (this.postLoading == false) {
            this.currentPageCount += 1;
            this.startCount = this.currentPageCount;
            if (this.startCount != 0) {
              this.commonPost_getpostdatas(this.startCount, this.pageCount);
            }
          }

      //}
    //});
  }


  shouldCallCommonPost(res: any): boolean {
    if (
      res.businessId !== undefined)
      // && (
      //   (res.employee !== undefined && res.employee == "true") ||
      //   (res.followed !== undefined && res.followed == "true") ||
      //   (res.admin !== undefined && res.admin == "true") ||
      //   (res.isSuperAdmin !== undefined && res.isSuperAdmin == "true")
      // )

     {
      return true;
    } else {
      return false;
    }
  }
  sortData(data) {
    return data.sort((a, b) => {
      return <any>new Date(b.postedOn) - <any>new Date(a.postedOn);
    });
  }

  getUnique(arr, comp) {
    // store the comparison  values in array
    const unique = arr
      .map((e) => e[comp])
      // store the indexes of the unique objects
      .map((e, i, final) => final.indexOf(e) === i && i)
      // eliminate the false indexes & return unique objects
      .filter((e) => arr[e])
      .map((e) => arr[e]);
    return unique;
  }

  images: any = []

  load(value) {
    if (value.length > 1) {
      this.postflags = true;
    } else {
      this.postflags = false;
    }
  }

  privacyLock: any = ''
  editPost: boolean = false
  privacyentityset: any;
  findPost(data, template: TemplateRef<any>) {

    this.editPost = true
    if (data.postPrivacy == 'Connections') {
      this.postTypeForm.get('postType').patchValue('Connections')
      this.privacyValue = 'Connections'
    } else if (data.postPrivacy == 'Network') {
      this.postTypeForm.get('postType').patchValue('Network')
      this.privacyValue = 'Network'
    } else if (data.postPrivacy == 'Community') {
      this.postTypeForm.get('postType').patchValue('Community')
      this.privacyValue = 'Community'
    } else if (data.postPrivacy == 'Everyone') {
      this.postTypeForm.get('postType').patchValue('Everyone')
      this.privacyValue = 'Everyone'
    }
    this.imagEditData = [];
    this.commanddataEdit = "";
    this.imagEditDatatemp = [];
    this.typesofFile == "";
    this.posteditId = "";
    this.commanddataEdit = data.postContent;
    this.commanddata1 = data.postContent;
    this.posteditId = data.postId;

    if (data.medias && data.medias != null && data.medias.length > 0) {
      this.typesofFile = data.medias[0].type;
      data.medias.forEach((element) => {
        if (element.status == "ACTIVE") {
          this.imagEditData.push(element);
        }
      });
    } else {
      this.imagEditData = [];
    }
    this.privacyentityset = data;
    this.selectedEntities = []
    this.api.create("post/queryPrivacyEntities", data).subscribe(res => {

      if (res != undefined && res) {

        res.forEach(element => {
          this.selectedEntities.push(element.name)
          this.tempcheckedList.push(element.postEntityId)

          this.checkedList.push(element.postEntityId)
        });
        ;
      }
    })

    setTimeout(() => {
      this.util.startLoader()
      this.modalRefedit = this.modalService.show(template, {
        animated: true,
        backdrop: "static",
      });
      this.util.stopLoader()
    }, 600);
  }

  deleteImage(fileId: string) {


    this.imagEditData.forEach((element, i) => {
      if (element.fileId == fileId) {
        this.imagEditData.splice(i, 1);

      }
      if (this.imagEditData.length == 0) {
        this.uploadFiles = [];
      }
    });
  }
  // Delete Post
  removepost(data) {
    var postId = data.postId;
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
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
        allowOutsideClick: false,
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.api.delete("post/remove/" + data.postId).subscribe((res) => {
            if (res != null) {
              if (res.code == "00000") {

                let indx = this.userData.findIndex(item => item.postId == postId);
                this.userData.splice(indx, 1);

                // this.getpostdatas();
                this.userbadges.profileStatus();
                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: "Your post has been deleted.",
                  showConfirmButton: false,
                  timer: 2000,
                });
              } else if (res.code == "99999") {
                Swal.fire("Post not deleted");
              }
            }
          }, err => {
            this.util.stopLoader();
          });


        }

      });
  }

  close() {
    this.gigsumoService.buttonClicked = true;
    this.beingEdited = false
    if (this.openModal == true) {
      this.modalRef.hide();
      setTimeout(() => {
        this.otherSelectedStates = []
        this.primarySkillsSelected = [];
        this.secondarySkillsSelected = [];
        this.editPost = false
        this.selectedvideo = false;
        this.selectedImage = false;
        this.searchName = ""
        this.modalRef.hide();
        $("#file-input").val("");
        $("#file-input-upload").val("");

        this.networkZeroFlag = false
        this.commonVariables.postFormflag = true;
        this.teamZeroFlag = false
        this.connectionZeroFlag = false
        this.communityZeroFlag = false
        this.commonVariables.postPrivacyFlag = false;
        this.searchData.setCommonVariables(commonVariables);
        this.postTypeForm.get('postType').setValue('Everyone')
        setTimeout(() => {
          this.privacyValue = 'Everyone'
          this.linkTitle = null
          this.linkImage = null
          this.linkDescription = null
          this.linkURL = null
          this.modelList.forEach(element => {
            element.checked = false
          })
          CustomValidator.count1 = 0
          CustomValidator.count = 0
          CustomValidator.stoppingCount = undefined
          $("#summessage").summernote("reset");
          this.uploadFiles = [];
          this.selectedEntities = []
          this.checkedList = []
          window.scrollTo(0, this.scrollValue.windowScroll);
          this.modalOpenFlag = false
        }, 500);
      }, 1500);
    } else {
      this.commonVariables.postFormflag = true;
      this.commonVariables.postPrivacyFlag = false;
      this.otherSelectedStates = []
      this.primarySkillsSelected = [];
      this.secondarySkillsSelected = [];
      this.editPost = false
      this.selectedvideo = false;
      this.selectedImage = false;
      this.searchName = ""
      this.modalRef.hide();
      $("#file-input").val("");
      $("#file-input-upload").val("");
      var commonVariables: any = {};
      commonVariables.postPrivacyFlag = false;
      this.networkZeroFlag = false
      this.teamZeroFlag = false
      this.connectionZeroFlag = false
      this.communityZeroFlag = false
      this.searchData.setCommonVariables(commonVariables);
      this.postTypeForm.get('postType').setValue('Everyone')
      setTimeout(() => {
        this.privacyValue = 'Everyone'
        this.linkTitle = null
        this.linkImage = null
        this.linkDescription = null
        this.linkURL = null
        this.modelList.forEach(element => {
          element.checked = false
        })
        CustomValidator.count1 = 0
        CustomValidator.count = 0
        CustomValidator.stoppingCount = undefined
        $("#summessage").summernote("reset");
        this.uploadFiles = [];
        this.selectedEntities = []
        this.checkedList = []
        window.scrollTo(0, this.scrollValue.windowScroll);
        this.modalOpenFlag = false
      }, 500);
    }

  }

  connectionZeroFlag: boolean = false
  teamZeroFlag: boolean = false
  dismiss() {
    if (this.openModal == true) {
      this.modalRef.hide()
      setTimeout(() => {
        this.primarySkillsSelected = [];
        this.secondarySkillsSelected = [];
        this.otherSelectedStates = []
        this.animState0 = 'middle'
        this.animState1 = 'left'
        this.animState = 'left'
        if (this.editPost != true) {
          this.privacyValue = 'Everyone'
          this.checkedList = [];
          this.selectedEntities = []
        }

        this.searchName = "";
        this.page = 0;
        this.networkZeroFlag = false
        this.connectionZeroFlag = false
        this.teamZeroFlag = false
        this.communityZeroFlag = false
        var commonVariables: any = {};
        this.commonVariables.postPrivacyFlag = false;
        this.commonVariables.postFormflag = true;
        this.searchData.setCommonVariables(commonVariables);
        this.postTypeForm.get('postType').setValue('Everyone')
        CustomValidator.count1 = 0
        CustomValidator.count = 0
        CustomValidator.stoppingCount = undefined
      }, 1500);
    } else {
      this.primarySkillsSelected = [];
      this.secondarySkillsSelected = [];
      this.otherSelectedStates = []
      this.animState0 = 'middle'
      this.animState1 = 'left'
      this.animState = 'left'
      if (this.editPost != true) {
        this.privacyValue = 'Everyone'
        this.checkedList = [];
        this.selectedEntities = []
      }
      this.commonVariables.postPrivacyFlag = false;
      this.commonVariables.postFormflag = true;
      // this.editPost = false
      // this.modalRef_PostView.hide();
      this.searchName = "";
      this.page = 0;
      this.networkZeroFlag = false
      this.connectionZeroFlag = false
      this.teamZeroFlag = false
      this.communityZeroFlag = false
      var commonVariables: any = {};
      commonVariables.postPrivacyFlag = false;
      this.searchData.setCommonVariables(commonVariables);
      this.postTypeForm.get('postType').setValue('Everyone')
      CustomValidator.count1 = 0
      CustomValidator.count = 0
      CustomValidator.stoppingCount = undefined
    }

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
      text: " All data will be lost.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      reverseButtons: true
    }).then(result => {
      if (result.isConfirmed) {
        this.jobPostForm.reset({
          jobId: this.jobPostForm.get('jobId').value,
          jobPostedBehalfOf: this.jobPostForm.get('jobPostedBehalfOf').value, durationType: 'Months'
        })
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
      text: " All data will be lost",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'cancel',
      reverseButtons: true
    }).then(result => {
      if (result.isConfirmed) {
        this.candidatePostForm.reset();
        this.candidatePostForm.get('workAuthorization').disable();
        this.workAuthorizationList = [];
        setTimeout(() => {

          if (this.userType == 'JOB_SEEKER') {
            this.candidatePostForm.patchValue({
              email: this.primaryEmail,
              firstName: this.firstName,
              lastName: this.lastName,
            })

            this.candidatePostForm.get('email').disable()
            this.candidatePostForm.get('firstName').disable()
            this.candidatePostForm.get('lastName').disable()
          }

          localStorage.removeItem(this.userid + "_landingPagecandidatePostForm");


        }, 500);
      }
    })

  }

  closeuploadEdit() {
    this.beingEdited = false
    this.selectedvideo = false;
    this.selectedImage = false;

    $("#file-input-upload").val("");

    this.modalRef.hide();

    this.commanddata1 = this.commanddata1;
    this.uploadFiles.forEach((element, i) => {
      element.url = element.src;
      element.fileId = element.src;
      element.orderBy = this.imagEditData.length + 1;

      if (element.t == "video") {
        element.type = "video";
      } else if (element.t == "image") {
        element.type = "image";
      }

      this.imagEditData.push(element);
    });
  }

  privacyValue = 'Everyone'

  closeEdit() {
    this.beingEdited = false

    this.selectedvideo = false;
    this.selectedImage = false;
    this.editPost = false
    this.modalRefedit.hide();

    $("#file-input").val("");
    setTimeout(() => {
      this.commanddataEdit = "";
      this.imagEditData = null;
      this.imagEditDatatemp = [];
      this.uploadFiles = [];
      this.selectedEntities = []
      this.checkedList = []
      this.tempcheckedList = []
      this.linkTitle = null
      this.linkImage = null
      this.linkDescription = null
      this.linkURL = null
      CustomValidator.count1 = 0
      CustomValidator.count = 0
      CustomValidator.stoppingCount = undefined
    }, 600);

  }

  savewithattachment(status: any, data, entityid, entity) {
    this.FormData = new FormData();
    var mediasData: any = [];
    this.FormData.append("medias", "medias");
    this.FormData.append("file", "file");

    this.FormData.delete("medias");
    this.FormData.delete("file");

    if (status === "new") {

      this.modalRef.hide();


      this.modalRef.hide()
      this.selectedEntities = []
      this.startCount = 0;

      this.currentPageCount = 1;
      this.commanddata = "";
      setTimeout(() => {
        this.userbadges.profileStatus();
      }, 2000);

      if (this.uploadFiles != null) {
        this.uploadFiles.forEach((element) => {
          this.FormData.append("file", element.file);
        });
      }

      this.dataPostandUpdate("post/createwithmedia", data, "new", null, null);

    } else if (status === "edit") {

      let content = $("#summessageges")
        .summernote("code")
        .replace(/&nbsp;|<\/?[^>]+(>|$)/g, "")
        .trim();
      if (this.imagEditData != undefined) {
        this.imagEditData.forEach((element) => {
          if (element.status == "INACTIVE") {
            this.FormData.append("file", element.file);
          } else if (element.status == "ACTIVE") {
            mediasData.push(element);
          }
        });
      }
      if (this.uploadFiles.length == 0 && mediasData.length == 0 && content.length == 0) {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Empty post",
          text: "This post appears to be blank. Please write something or attach a link or a photo to post.",
          allowOutsideClick: false,
          showConfirmButton: false,
          timer: 3500,
        });

      }
      if (this.uploadFiles.length >= 1 || content.length != 0 || mediasData.length != 0) {
        this.dataPostandUpdate("post/updatewithmedia", mediasData, "edit", entityid, entity);
        this.modalRefedit.hide();
      }

    }
  }

  dataPostandUpdate(path: any, mediapostdata: any, status?: any, entityid?: any, entity?: any) {
    let postEntityId;
    if (status !== "edit") {
      if (this.Commomdatass === "USER") {
        postEntityId = this.userId;
      } else if (this.Commomdatass === "COMMUNITY") {
        postEntityId = this.communityid;
      } else if (this.Commomdatass === "BUSINESS") {
        postEntityId = this.businessId;
      } else if (this.Commomdatass === "NETWORK") {
        postEntityId = this.networkId;
      } else if (this.Commomdatass === "TEAM") {
        postEntityId = this.teamId;
      }
    }
    let postcont = null;
    let qwe = "";

    if (this.editPost == true) {
      try {
        qwe = $("#summessageges").summernote("code").replace(/&nbsp;|<\/?[^>]+(>|$)/g, "").trim();
      } catch (error) {

      }
    } else if (this.editPost == false) {
      try {
        qwe = $("#summessage").summernote("code").replace(/&nbsp;|<\/?[^>]+(>|$)/g, "").trim();
      } catch (error) {

      }
    }
    if (this.commanddata1 &&
      this.commanddata1 != null &&
      this.commanddata1.length != 0
    ) {
      postcont = this.commanddata1.trim();
    } else if (qwe && qwe != null && qwe.length != 0) {
      postcont = qwe
    }
    else {
      postcont = null;
    }

    var edit

    this.sendMessageData = {
      postType: "OWN",
      sourcePostId: "",
      postName: this.entername,
      postContent: postcont,
      postEntity: this.Commomdatass,
      postEntityId: postEntityId,
      postedBy: localStorage.getItem("userId"),
      postPrivacyEntities: this.tempcheckedList,
      postPrivacy: this.postPrivacy,
    };

    if (status && status !== null && (status === "edit" || status === 'mediaWithTexts')) {
      edit = true
      this.sendMessageData = {};
      this.sendMessageData = {
        postType: "OWN",
        sourcePostId: "",
        postName: this.entername,
        postContent: this.commanddataEdit,
        postEntity: entity,
        postEntityId: entityid,
        postId: this.posteditId,
        postedBy: localStorage.getItem("userId"),
        medias: mediapostdata,
        postPrivacyEntities: this.tempcheckedList,
        postPrivacy: this.postPrivacy,
      };
    } else {
      edit = false
    }

    this.FormData.append(
      "post",
      new Blob([JSON.stringify(this.sendMessageData)], {
        type: "application/json",
      })
    );

    this.util.startLoader();
    this.api
      .messagePageService("POST", path, this.FormData)
      .subscribe((res) => {
        if (res) {
          let timeout: any = undefined;
          this.rxjsTimer.pipe(takeUntil(this.destroy)).subscribe((val) => {
            timeout = val;
          });

          this.util.stopLoader();
          this.showWelcomePost = false;
          this.FormData.delete("file");
          this.FormData.delete("post");
          this.tempcheckedList = [];
          this.checkedList = []
          this.postPrivacy = "Everyone";
          this.editPost = false
          this.privacyValue = 'Everyone'
          $("#file-input").val("");
          this.commanddata1 = null;
          this.attachment = false;
          this.sendMessageData = {};
          this.uploadFiles = [];
          this.selectedEntities = []
          this.entername = "";
          res.edit = edit;
          res.userName = res.PostEntityName;
          this.localPushData(res);
          $("#summessage").summernote("reset");
          this.linkTitle = null
          this.linkImage = null
          this.linkDescription = null
          this.linkURL = null
        }
      },
        err => {
          if (err.status == 500) {
            this.uploadFiles = []
            this.checkedList = []
            this.tempcheckedList = []
          }
        });
  }

  redirectUserFromShareModel(post?: any, data?: any) {
    this.closeSharePage();
    this.userprofile(post, data);
  }

  userprofile(post?: any, data?: any) {
    let userData: any = {};
    userData.userId = data;
    if (post) {
      // this.util.startLoader()
      if (post.postEntity === "COMMUNITY1") {
        let datas: any = {};
        this.communityid = post.postEntityId;

        this.api
          .query("community/details/" + this.communityid)
          .subscribe((res) => {
            // this.util.stopLoader()
            this.router.navigate(["community"], { queryParams: res.data.communityDetails });
          }, err => {
            this.util.stopLoader();
          });
      } else if (post.postEntity === "BUSINESS") {
        let datas: any = {};
        datas.businessId = post.postEntityId;
        datas.userId = localStorage.getItem("userId");
        this.api.create("business/check/admin", datas).subscribe((res) => {
          //  this.util.stopLoader()
          localStorage.setItem("businessId", post.postEntityId);
          localStorage.setItem("isAdmin", res.isAdmin);
          localStorage.setItem("isSuperAdmin", res.isSuperAdmin);
          localStorage.setItem("screen", "business");
          localStorage.setItem("adminviewflag", "false");
          res.businessId = post.postEntityId;
          this.router.navigate(["business"], { queryParams: res });
        }, err => {
          this.util.stopLoader();
          if (err.status == 500) {
            this.util.stopLoader();
          }
        });
      } else if (post.postEntity === "NETWORK1") {
        this.api.query("network/get/" + post.postEntityId).subscribe((res) => {
          if (res != undefined && res != null) {
            this.router.navigate(["networkPage/home"], {
              queryParams: res.data.Network,
            });
          }
        }, err => {
          this.util.stopLoader();
        });
      } else if (post.postEntity === "TEAM1") {
        this.api.query("teams/get/" + post.postEntityId).subscribe((res) => {
          if (res != undefined && res != null) {
            this.router.navigate(["teamPage/home"], {
              queryParams: res.data.teams,
            });
          }
        }, err => {
          this.util.stopLoader();
        });
      } else {
        const userId = localStorage.getItem("userId");
        if (userId === data) {
          var datum: any = {}
          datum.userId = userId;

          this.router.navigate(["personalProfile"], { queryParams: datum });
        } else {
          this.router.navigate(["personalProfile"], { queryParams: userData });
        }
      }
    } else {
      const userId = localStorage.getItem("userId");
      if (userId === data) {
        var datum: any = {}
        datum.userId = userId;
        this.router.navigate(["personalProfile"], { queryParams: datum });

      } else {
        this.router.navigate(["personalProfile"], { queryParams: userData });
      }
    }
  }

  toggleVideo(event?: any) {
    this.videoplayer.nativeElement.play();
  }

  loadPost(postId: string) {

    if (postId) {
      this.afterKey = undefined;
      setTimeout(() => {
        this.commonPost_getpostdatas(null, null);
      }, 1500);
    }
  }

  toggleVideopopup(event?: any) {
    this.videoplayer.nativeElement.stop();
    this.videoPlayerpopup.nativeElement.play();
  }

  fileUpload(
    event: any,
    imgtype: string,
    template?: TemplateRef<any>,
    option?: any,
  ) {

    this.uploadFiles = [];
    this.commanddata1 = null;
    const acceptedImageTypes = ["image/gif", "image/jpeg", "image/png"];
    const videofileaccept = ["video/mp4", "video/webm"];
    var files = event.target.files;
    if (files[0].size > this.fileSize) {
      Swal.fire("", `${this.IMAGE_ERROR}`, "info");
      return true;
    }
    for (var i = 0, file; (file = files[i]); i++) {
      if (imgtype == "image" && acceptedImageTypes.includes(file.type)) {
      } else if (
        imgtype == "image" &&
        !acceptedImageTypes.includes(file.type)
      ) {
        Swal.fire("", `${this.FORMERROR.IMAGE_TYPE_VALID}`, "info");
        this.uploadFiles = [];
        this.modalRef.hide();

        return true;
      } else if (imgtype == "video" && videofileaccept.includes(file.type)) {
      } else if (imgtype == "video" && !videofileaccept.includes(file.type)) {
        Swal.fire("", "Please select only video type files.", "info");
        this.uploadFiles = [];
        this.modalRef.hide();

        return true;
      } else if (
        (imgtype == "both" && videofileaccept.includes(file.type)) ||
        (imgtype == "both" && acceptedImageTypes.includes(file.type))
      ) {
      } else if (
        (imgtype == "both" && !videofileaccept.includes(file.type)) ||
        (imgtype == "both" && !acceptedImageTypes.includes(file.type))
      ) {
        Swal.fire("", `${this.FORMERROR.IMAGE_VIDEO_VALID}`, "info");
        this.uploadFiles = [];
        this.modalRef.hide();

        return true;
      }
    }

    if (template != null) {
      this.modalRef = this.modalService.show(template, {
        animated: true,
        backdrop: "static",
      });
    }

    this.selectedImage = false;
    this.selectedImage = false;

    if (event.target.files && event.target.files[0]) {
      const filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        const reader = new FileReader();
        reader.onload = (event1: any) => {
          const type = event.target.files[i].type;
          let type1 = "image";
          if (type.includes("image")) {
            this.selectedImage = true;
            type1 = "image";
          } else if (type.includes("video")) {
            this.selectedvideo = true;
            type1 = "video";
          } else if (type.includes("application")) {
            type1 = "application";
          } else if (type.includes("audio")) {
            type1 = "audio";
          } else {
            type1 = "others";
          }
          const data = {
            t: type1,
            ft: type,
            fileName: type,
            file: event.target.files[i],
            status: "INACTIVE",
            src: event1.target.result,
          };
          this.uploadFiles.push(data);
        };
        reader.readAsDataURL(event.target.files[i]);


        if (!this.attachment) {
          this.attachment = true;
          setTimeout(() => {

          }, 100);
        }
      }
    }
  }


  selectedImage1?: number = null

  pushImages(values, index) {
    this.selectedImage1 = index
    this.images = values
  }

  singleimagevidshows(datas, template: TemplateRef<any>) {
    this.modalOpenFlag = true
    this.singleimagedata = datas;
    this.modalRef = this.modalService.show(template, {
      animated: true,
      backdrop: "static",
    });
  }

  tyu() {
    this.modalRef.hide()
    setTimeout(() => {
      window.scrollTo(0, this.scrollValue.windowScroll);
      this.modalOpenFlag = false
    }, 1000);
  }


  closeSharePage(): void {
    this.modalRef.hide();
    this.sharePost.thoughts = "";
    setTimeout(() => {
      this.linkTitle = null
      this.linkImage = null
      this.linkDescription = null
      this.linkURL = null
      CustomValidator.count1 = 0
      CustomValidator.count = 0
      CustomValidator.stoppingCount = undefined
    }, 600);
    this.postTypeForm.get('postType').setValue('Everyone')

  }

  sdf() {
    this.modalRef.hide();
    setTimeout(() => {
      this.linkTitle = null
      this.linkImage = null
      this.linkDescription = null
      this.linkURL = null
      CustomValidator.count1 = 0
      CustomValidator.count = 0
      CustomValidator.stoppingCount = undefined
    }, 600);
  }

  sharePostPage(): void {
    let postEntityId = "";
    if (this.Commomdatass === "USER") {
      postEntityId = this.userId;
    } else if (this.Commomdatass === "COMMUNITY") {
      postEntityId = this.communityid;
    } else if (this.Commomdatass === "BUSINESS") {
      postEntityId = this.businessId;
    } else if (this.Commomdatass === "NETWORK") {
      postEntityId = this.networkId;
    } else if (this.Commomdatass === "TEAM") {
      postEntityId = this.teamId;
    }

    if (this.sharePost.postId == "SHARE") {
      this.sharePost.postId = this.sharePost.sourcePostId;
    } else {
      this.sharePost.postId = this.sharePost.postId;
    }

    let datas = {
      postType: "SHARE",
      sourcePostId: this.sharePost.postId,
      postContent: this.sharePost.thoughts,
      postEntity: this.Commomdatass,
      postEntityId: postEntityId,
      postedBy: localStorage.getItem("userId"),
      postPrivacyEntities: this.tempcheckedList,
      postPrivacy: this.postPrivacy,
    };
    this.util.startLoader();
    this.api.create("post/create", datas).subscribe((res) => {
      setTimeout(() => {
      }, 1000);
      this.selectedEntities = []
      this.util.stopLoader();
      this.modalRef.hide();
      // this.getpostdatas();
      res.edit = false;
      this.localPushData(res)
      this.userbadges.profileStatus();
      this.sharePost.thoughts = "";


    }, err => {
      this.util.stopLoader();
      if (err.status == 500) {
        this.util.stopLoader();
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: 'Something went wrong while processing your request. Please, try again later.',
          showDenyButton: false,
          confirmButtonText: `ok`,
        })
      }
    });
  }

  share(post: any, template?: TemplateRef<any>) {
    this.checkedList = [];
    this.tempcheckedList = [];
    this.postPrivacy = "Everyone";
    this.privacyValue = 'Everyone'
    this.modalRef = this.modalService.show(template, {
      backdrop: "static",
      animated: true,
    });
    if (post.medias == null) {
      post.medias = [];
    }
    this.sharePost = post;
    if (post.postType == "SHARE") {
      this.sharePost = post.shareduser[0];
    }
  }

  welcomeShare(post: any, template?: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {
      backdrop: "static",
      animated: true,
    });
    if (post.medias == null) {
      post.medias = [];
    }
    this.sharePost = post;
    if (post.postType == "SHARE") {
      this.sharePost = post.shareduser[0];
    }
  }




  comment(i) {
    this.sharecmd = "";
    this.userData.forEach((element) => {
      element.cmd = false;
    });
    this.userData[i].cmd = true;
  }

  cmdpage(data, methodname, i, removepostId) {

    if (methodname == "comment") {
      let postcont = null;
      if (data.cmd) {
        postcont = data.cmd.trim();
      }
      let datas = {
        userId: localStorage.getItem("userId"),
        postId: data.postId,
        comment: postcont,

      };

      if (postcont != null && postcont.length > 0) {
        this.util.startLoader();
        this.api.create("post/add/comments", datas).subscribe((res) => {
          this.util.stopLoader();

          if (res && res.code === "00000" && res.data && res.data.comment) {
            data.cmd = null;
            const cmntList = res.data.comment;
            this.indexforSearchafterKey = [];
            let e1 = cmntList;

            if (e1.photo) {
              e1.photo = AppSettings.photoUrl + e1.photo;
            } else {

            }

            if (
              this.userData[i].comments &&
              this.userData[i].comments != null &&
              this.userData[i].comments != ""
            ) {
            } else {
              this.userData[i].comments = [];
            }
            let index = this.userData[i].comments.findIndex(
              (item: any) => item.commentId === e1.commentId
            );
            if (index < 0) {
              this.userData[i].comments.unshift(e1);
            } else {
              Object.assign(this.userData[i].comments[index], e1);
            }
            if (this.userData[i].comments.length > 3) {
              this.userData[i].comments.splice(
                3,
                this.userData[i].comments.length - 3
              );
            }
            if (res.data && res.data.commentsCount) {
              this.userData[i].commentsCount = res.data.commentsCount;
            } else {
              this.userData[i].commentsCount = 0;
            }

            this.userData[i].c = {
              offSet: 0,
              pageCount: 3,
            };

          }
        }, err => {
          this.util.stopLoader();
          if (err.status == 500) {
            this.util.stopLoader();
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: 'Something went wrong while processing your request. Please, try again later.',
              showDenyButton: false,
              confirmButtonText: `ok`,
            })
          }
        });
      }
    } else if (methodname == "remove") {
      let remove = {
        userId: localStorage.getItem("userId"),
        commentId: data.commentId,
        postId: removepostId.postId,
      };
      this.util.startLoader();
      this.api.create("post/remove/comments", remove).subscribe((res) => {

        this.sharecmd = "";
        if (res.data.comments) {
          res.data.comments.forEach((e1) => {
            this.api
              .query("user/connection/" + e1.userId)
              .subscribe((userres) => {
                this.util.stopLoader();
                e1.photo = AppSettings.photoUrl + userres.photo;
              }, err => {
                this.util.stopLoader();
              });
            this.userData[i].comments = res.data.comments;
            this.userData = this.userData;
          });
        } else {
          this.util.stopLoader();
        }
      }, err => {
        this.util.stopLoader();
        if (err.status == 500) {
          this.util.stopLoader();
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: 'Something went wrong processing your request. Please, try again later.',
            showDenyButton: false,
            confirmButtonText: `ok`,
          })
        }
      });
    }
  }


  like(data, i, flag) {
    let datas = {
      userId: localStorage.getItem("userId"),
      postId: data.postId,
    };
    this.userData[i].userLikedStatus = flag;
    let url = "post/like";
    if (!flag) {
      url = "post/unlike";
    }

    this.util.startLoader();
    this.api.create(url, datas, 'Unable to retrieve post').subscribe((res) => {
      this.util.stopLoader();

      if (res.code == "00000") {
        this.userData[i].userLikedStatus = flag;
        if (res.data && res.data.likesCount) {
          this.userData[i].likesCount = res.data.likesCount;
        } else {
          this.userData[i].likesCount = 0;
        }
        this.userData = this.userData;
      }
    }, err => {
      this.util.stopLoader();
      if (err.status == 500) {
        this.util.stopLoader();
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: 'Something went wrong while processing your request. Please, try again later.',
          showDenyButton: false,
          confirmButtonText: `ok`,
        })
      }
    });
  }

  save() {
    this.counts = 0;
    let postEntityId;
    if (this.Commomdatass === "USER") {
      postEntityId = this.userId;
    } else if (this.Commomdatass === "COMMUNITY") {
      postEntityId = this.communityid;
    } else if (this.Commomdatass === "BUSINESS") {
      postEntityId = this.businessId;
    } else if (this.Commomdatass === "NETWORK") {
      postEntityId = this.networkId;
    } else if (this.Commomdatass === "TEAM") {
      postEntityId = this.teamId;
    }

    let postcont = $("#summessage").summernote("code").replace(/&nbsp;|<\/?[^>]+(>|$)/g, "").trim();
    const substring = "<img";
    if (postcont.length > 0 && this.commanddata.includes(substring)) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: "Please, enter only texts.",

        allowOutsideClick: false,
        showConfirmButton: false,
        timer: 3500
      })
      $("#summessage").summernote("reset");
      $("#SummernoteText").summernote("reset");
    } else if (postcont.length == 0 && this.uploadFiles.length == 0) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Empty Post',
        text: "This post appears to be blank. Please write something or attach a link or a photo to post.",

        allowOutsideClick: false,
        showConfirmButton: false,
        timer: 3500
      })
      $("#summessage").summernote("reset");
      $("#SummernoteText").summernote("reset");
    }


    let datas = {
      postType: "OWN",
      sourcePostId: "",
      postContent: this.commanddata,
      postEntity: this.Commomdatass,
      postEntityId: postEntityId,
      postedBy: localStorage.getItem("userId"),
      postPrivacyEntities: this.tempcheckedList,
      postPrivacy: this.postPrivacy,
    };


    if (postcont.length > 0 && !this.commanddata.includes(substring) && this.uploadFiles.length == 0) {
      this.util.startLoader();
      this.api.create("post/create", datas).subscribe((res) => {
        if (res.code == '00000') {
          let timeout: any = undefined;
          this.rxjsTimer.pipe(takeUntil(this.destroy)).subscribe((val) => {
            timeout = val;
          });
          this.streamData = [];

          this.util.stopLoader();
          this.modalRef.hide()
          this.selectedEntities = []
          this.startCount = 0;
          this.showWelcomePost = false;
          this.currentPageCount = 1;
          this.commanddata = "";
          this.checkedList = [];
          this.tempcheckedList = [];
          this.postPrivacy = "Everyone";
          this.privacyValue = 'Everyone'
          setTimeout(() => {
            res.edit = false;
            this.localPushData(res)
            this.userbadges.profileStatus();
          }, 1000);
        }
      }, err => {
        this.util.stopLoader();
        if (err.status == 500) {
          this.util.stopLoader();
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: 'Something went wrong while processing your request. Please, try again later.',
            showDenyButton: false,
            confirmButtonText: `ok`,
          })
        }
      });
    } else if ((postcont.length == 0 && this.uploadFiles.length != 0)) {
      let datas = {
        postType: "OWN",
        sourcePostId: "",
        postContent: this.commanddata,
        postEntity: this.Commomdatass,
        postEntityId: postEntityId,
        postedBy: localStorage.getItem("userId"),
        postPrivacyEntities: this.tempcheckedList,
        postPrivacy: this.postPrivacy,
      };
      this.savewithattachment('new', datas, null, null)
    }
    else if (postcont.length > 0 && !this.commanddata.includes(substring) && this.uploadFiles.length != 0) {

      let content = $("#summessage")
        .summernote("code")
        .replace(/&nbsp;|<\/?[^>]+(>|$)/g, "")
        .trim();
      let postcont = $("#summessage").summernote("code").replace(/&nbsp;|<\/?[^>]+(>|$)/g, "").trim();
      let datas = {
        postType: "OWN",
        sourcePostId: "",
        postContent: postcont,
        postEntity: this.Commomdatass,
        postEntityId: postEntityId,
        postedBy: localStorage.getItem("userId"),
        postPrivacyEntities: this.tempcheckedList,
        postPrivacy: this.postPrivacy,
      };
      this.savewithattachment('new', datas, null, null)
    }
  }



  getpostdatas() {
    this.afterKey = undefined;
    this.commonPost_getpostdatas(null, null);
  }

  sortBy(list: Array<any>, prop: string) {
    return list.sort((a, b) => (b[prop] > a[prop] ? 1 : -1));
  }

   commonPost_getpostdatas(startIndex, pageCount) {

    this.postLoading = true;
    let postEntityId;
    if (this.Commomdatass === "USER") {
      postEntityId = this.userId;
    } else if (this.Commomdatass === "COMMUNITY") {
      postEntityId = this.communityid;
    } else if (this.Commomdatass === "BUSINESS") {
      postEntityId = this.businessId;
    } else if (this.Commomdatass === "NETWORK") {
      postEntityId = this.networkId;
    } else if (this.Commomdatass === "TEAM") {
      postEntityId = this.teamId;
    }
    var apiName = "post/query";

    const datas: any = {
      postEntity: this.Commomdatass,
      postId: this.postId,
      searchAfterKey: this.afterKey,
      limit: 10,
      page: {
        pageSize: 10,
      },
    };

    if(datas.searchAfterKey==null){
      this.userData = [];
    }

    if (this.ownerView != undefined) {
      apiName = "post/owner";
      datas.userId = postEntityId;
    } else {
      apiName = "post/query";
      datas.postEntityId = postEntityId;
    }

    if (this.afterKey === undefined || (this.afterKey != null && this.afterKey.length > 0)) {
      datas.searchAfterKey = this.afterKey;
    } else {
      this.postLoading = false;
      return;
    }

    if (startIndex != null) {
      datas.page.offSet = startIndex;
      datas.page.pageCount = pageCount;
      datas.page.pageSize = 10;

    } else {
      datas.page.offSet = 0;
      datas.page.pageSize = 10;
      this.userData = [];
    }
    setTimeout(() => {
      this.loadAPIcall = true;
      this.api.create(apiName, datas).subscribe((response) => {
        this.shareData = [];
        this.commentData = [];
        this.loadAPIcall = false;

        if (
          response !== undefined &&
          response !== null &&
          response.data != null &&
          response.data.postList != null
        ) {
          if (response.data.searchAfterKey == undefined) {
            this.afterKey = [];
          } else {
            this.afterKey = response.data.searchAfterKey;
          }
          this.postLoading = false;

          let sortedPosts;
          if (response.data.notifiedPost) {
            sortedPosts = [response.data.notifiedPost, ...response.data.postList];
          } else {
            sortedPosts = this.sortBy(response.data.postList, "postedOn");
          }
          this.userbadges.profileStatus();
          sortedPosts.forEach((element, index) => {
            if (element.medias) {
              element.medias.forEach((e1) => {
                if (e1.url != null) {
                  var path;
                  path = AppSettings.photoUrl + e1.fileId;
                  e1.url = "";
                  e1.url = path;
                } else {

                }
              });
            }
            if (element.comments) {
              element.comments.forEach((e1: any) => {
                if (e1) {
                  if (e1.photo && e1.photo != null) {
                    e1.photo = AppSettings.photoUrl + e1.photo;
                  } else {
                    e1.photo = null;
                  }
                }
              });
            }

            //localStorage.setItem("postedDate", response[0].serverDateTime)
            const date = new Date(element.postedOn);
            let current = new Date(element.serverDateTime);
            if (element.serverDateTime == null) {
              current = new Date()
            }
            const postedate = this.util.dataconvert(current, date);

            if (element.postContent == null) {
              element.postContent = null
            }

            var postData = {
              status: element.status,
              isWelcomePost: element.isWelcomePost,
              isPlatformPost: element.isPlatformPost,
              userId: element.userId,
              connected: element.connected,
              postId: element.postId,
              postType: element.postType,
              sourcePostId: element.postId,
              postContent: element.postContent,
              postEntity: element.postEntity,
              postEntityId: element.postEntityId,
              postedBy: element.postedBy,
              postedByType: element.postedByType,
              postedOn: element.postedOn,
              posteddate: postedate,
              likesCount: element.likesCount,
              commentsCount: element.commentsCount,
              sharedCount: element.sharedCount,
              postPrivacy: element.postPrivacy,
              postPrivacyEntities: element.postPrivacyEntities,
              hashTags: element.hashTags,
              medias: element.medias,
              likes: element.likes,
              shares: element.shares,
              page: element.page,
              code: element.code,
              message: element.message,
              comments: element.comments,
              isGlobalCommunityPost: element.isGlobalCommunityPost,
              user: element.user,
              visible: false,
              userLikedStatus: element.userLikedStatus,
              postedByUserData: element.postedByUserData
            };
            if (element.isPlatformPost) {
              postData.postEntity = "USER"
              this.addUserDataToPost(element, postData, element.postEntityId);
            }
            if (element.postEntity === "USER") {
              this.addUserDataToPost(element, postData, element.postEntityId);
            } else if (element.postEntity === "BUSINESS") {
              this.addBusinessDataToPost(
                element,
                postData,
                element.postEntityId,

              );
            } else if (element.postEntity === "COMMUNITY" || element.postEntity === "COMMUNITY" && element.isWelcomePost) {
              this.addCommunityDataToPost(
                element,
                postData,
                element.postEntityId,

              );
            } else if (element.postEntity === "NETWORK") {
              this.addNetworkToPost(element, postData, element.postEntityId);
            } else if (element.postEntity === "TEAM") {
              this.addTeamsToPost(element, postData, element.postEntityId);
            }

          });
          this.contentLoaded = true;
        }
      }, err => {
        this.util.stopLoader();
        if (err.status == 500) {
          this.util.stopLoader();
        }
      });
    }, 0);

  }

  subscribeGigSumoCommunity() {
    this.gigCommunitySubscribed = true
    var data: any = {}
    data.userId = localStorage.getItem('userId')
    data.userType = localStorage.getItem('userType')
    this.api.create('community/addToGigsumoCommunity', data).subscribe(res => {
      if (res.code == '00000') {
        this.gigCommunitySubscribed = true;
        this.globalCommunity.joined = true;
      }
      else {
        this.gigCommunitySubscribed = false;
        this.globalCommunity.joined = false;

      }
    })
  }

  addSharedPostData(sourcePost, postViewData): void {
    let shareData = [];
    this.api
      .query("post/query/" + sourcePost.sourcePostId)
      .subscribe((shareres) => {
        //this.util.stopLoader()
        let shareResponse = shareres[0];
        if (
          shareResponse != undefined &&
          shareResponse.medias != null &&
          shareResponse.medias != undefined
        ) {
          shareResponse.medias.forEach((e1) => {
            if (e1.url != null) {
              e1.url = AppSettings.photoUrl + e1.url;
            } else {

            }
          });

          let date = new Date(shareResponse.postedOn);
          let current = new Date();
          if (sourcePost.serverDateTime == null) {
            current = new Date(sourcePost.postedOn);
          } else {
            current = new Date(sourcePost.serverDateTime);
          }
          let postedateshare = this.util.dataconvert(current, date);
          let shareViewData = {

            status: shareResponse.status,
            userId: shareResponse.userId,
            connected: shareResponse.connected,
            postId: shareResponse.postId,
            postType: shareResponse.postType,
            sourcePostId: shareResponse.postId,
            postContent: shareResponse.postContent,
            postEntity: shareResponse.postEntity,
            postEntityId: shareResponse.postEntityId,
            postedBy: shareResponse.postedBy,
            postedByType: shareResponse.postedByType,
            postedOn: shareResponse.postedOn,
            posteddate: postedateshare,
            likesCount: shareResponse.likesCount,
            commentsCount: shareResponse.commentsCount,
            sharedCount: shareResponse.sharedCount,
            postPrivacyEntities: shareResponse.postPrivacyEntities,
            postPrivacy: shareResponse.postPrivacy,
            hashTags: shareResponse.hashTags,
            medias: shareResponse.medias,
            likes: shareResponse.likes,
            shares: shareResponse.shares,
            page: shareResponse.page,
            code: shareResponse.code,
            message: shareResponse.message,
            comments: shareResponse.comments,
            visible: false,
            postedByUserData: shareResponse.postedByUserData
          };

          if (shareResponse.postEntity === "USER") {
            this.addUserDataToSharedPost(
              postViewData,
              shareViewData,
              shareResponse.postEntityId,

            );
          } else if (shareResponse.postEntity === "BUSINESS") {
            this.addBusinessDataToSharedPost(
              postViewData,
              shareViewData,
              shareResponse.postEntityId,

            );
          } else if (shareResponse.postEntity === "COMMUNITY") {
            this.addCommunityDataToSharedPost(
              postViewData,
              shareViewData,
              shareResponse.postEntityId,

            );
          } else if (shareResponse.postEntity === "NETWORK") {
            this.addNetworkDataToSharedPost(
              postViewData,
              shareViewData,
              shareResponse.postEntityId,

            );
          } else if (shareResponse.postEntity === "TEAM") {
            this.addTeamDataToSharedPost(
              postViewData,
              shareViewData,
              shareResponse.postEntityId,

            );
          }
        }
      }, err => {
        this.util.stopLoader();
      });
  }

movedatafirst(userData: any[]): any[] {
  if (!userData || userData.length === 0 || !this.postId) {
    return userData;
  }

  const filteredPosts = userData.filter(post => post.postId === this.postId);
  const otherPosts = userData.filter(post => post.postId !== this.postId);

  return [...filteredPosts, ...otherPosts];
}



  addUserDataToPost(element, postViewData, userId): void {
    this.util.startLoader();
    this.api.query("user/connection/" + userId).subscribe((userres) => {
      this.util.stopLoader();
      postViewData.userName = userres.firstName + " " + userres.lastName;
      postViewData.photo = userres.photo;
      postViewData.img = userres.photo;
      postViewData.organisation = userres.organisation;
      postViewData.title = userres.title;

      if (postViewData.isPlatformPost) {
        postViewData.userName = "Gigsumo";
        postViewData.firstName = "Gigsumo";
        postViewData.lastName = "User";
        postViewData.photo = 'assets/icon/Sumoface_final.png';
      }

      if (element.postType === "SHARE") {
        this.addSharedPostData(element, postViewData);
      } else {
        if (element.edit) {
          let indx = this.userData.findIndex(item => item.postId == element.postId);
          this.userData.splice(indx, 1);
          this.userData[indx] = postViewData;
        } else {
            this.userData.push(postViewData);
            this.userData = this.removeDuplicates(this.userData, "postId");
              this.userData = this.sortData(this.userData);
        }
      }
    }, err => {
      this.util.stopLoader();
    });
  }





  addBusinessDataToPost(element, postViewData, businessId): void {

    let datas: any = {};
    datas.businessId = businessId;
    datas.userId = localStorage.getItem("userId");

    this.api.create("business/check/admin", datas).subscribe((res) => {
      let img = "assets/images/gallery/company.png";
      if (res.businessLogo != null) {
        img = AppSettings.photoUrl + res.businessLogo;
      }

      postViewData.userName = res.businessName;
      postViewData.photo = img;
      postViewData.img = img;
      if (element.postType === "SHARE") {
        this.addSharedPostData(element, postViewData);
      } else {
        if (element.edit) {
          let indx = this.userData.findIndex(item => item.postId == element.postId);
          this.userData.splice(indx, 1);
          this.userData[indx] = postViewData;
        } else {
          this.userData.push(postViewData);
          this.userData = this.removeDuplicates(this.userData, "postId");
        }
      }
    }, err => {
      this.util.stopLoader();
      if (err.status == 500) {
        this.util.stopLoader();
      }
    });
  }

  addCommunityDataToPost(element, postViewData, communityId): void {

    let datas: any = {};
    datas.communityId = communityId;
    datas.userId = localStorage.getItem("userId");
    this.communityid = communityId;

    this.api.query("community/details/" + this.communityid).subscribe((res) => {

      let photo;
      if (postViewData.postedByUserData != null && postViewData.postedByUserData.photo != null) {
        photo = AppSettings.photoUrl + postViewData.postedByUserData.photo;
      }

      if (res != undefined && res.data != null) {
        postViewData.userName = res.data.communityDetails.communityName;
      }

      postViewData.photo = photo;
      postViewData.img = photo;
      if (element.postType === "SHARE") {
        this.addSharedPostData(element, postViewData);
      } else {
        if (element.edit) {
          let indx = this.userData.findIndex(item => item.postId == element.postId);
          this.userData.splice(indx, 1);
          this.userData[indx] = postViewData;
        } else {
          this.userData.push(postViewData);
          this.userData = this.removeDuplicates(this.userData, "postId");
        }
      }
    }, err => {
      this.util.stopLoader();
    });
  }

  addNetworkToPost(element, postViewData, networkId): void {

    this.api.query("network/get/" + networkId).subscribe((res) => {
      if (
        res != undefined &&
        res != null &&
        res.data.Network != undefined &&
        res.data.Network != null
      ) {
        let img = null;
        let photo = img;
        if (postViewData.postedByUserData != null && postViewData.postedByUserData.photo != null) {
          photo = AppSettings.photoUrl + postViewData.postedByUserData.photo;
        }

        postViewData.userName = res.data.Network.networkName;
        postViewData.networkId = res.data.Network.networkId;
        postViewData.networkOwnerId = res.data.Network.networkOwnerId;
        postViewData.photo = photo;
        postViewData.img = img;
        if (element.postType === "SHARE") {
          this.addSharedPostData(element, postViewData);
        } else {

          if (element.edit) {
            let indx = this.userData.findIndex(item => item.postId == element.postId);
            this.userData[indx] = postViewData;
          } else {

            this.userData.push(postViewData);
            this.userData = this.removeDuplicates(this.userData, "postId");
          }
        }
      }
    }, err => {
      this.util.stopLoader();
    });
  }

  addTeamsToPost(element, postViewData, teamId): void {
    this.api.query("teams/get/" + teamId).subscribe((res) => {
      if (
        res != undefined &&
        res != null &&
        res.data.teams != undefined &&
        res.data.teams != null
      ) {
        let img = null;

        let photo = img;

        if (postViewData.postedByUserData != null && postViewData.postedByUserData.photo != null) {
          photo = AppSettings.photoUrl + postViewData.postedByUserData.photo;
        }

        postViewData.userName = res.data.teams.teamName;
        postViewData.teamId = res.data.teams.teamId;
        postViewData.teamsOwnerId = res.data.teams.teamsOwnerId;
        postViewData.photo = photo;
        postViewData.img = img;
        if (element.postType === "SHARE") {
          this.addSharedPostData(element, postViewData);
        } else {

          if (element.edit) {
            let indx = this.userData.findIndex(item => item.postId == element.postId);
            this.userData.splice(indx, 1);
            this.userData[indx] = postViewData;
          } else {
            this.userData.push(postViewData);
            this.userData = this.removeDuplicates(this.userData, "postId");
          }
        }
      }
    }, err => {
      this.util.stopLoader();
    });
  }

  addUserDataToSharedPost(postViewData, shareViewData, userId): void {
    this.util.startLoader()
    this.api.query("user/connection/" + userId).subscribe((userres) => {
      this.util.stopLoader()

      shareViewData.userName = userres.firstName + " " + userres.lastName;

      shareViewData.photo = userres.photo;
      shareViewData.img = userres.photo;
      shareViewData.organisation = userres.organisation;
      shareViewData.title = userres.title;
      let shareData = [];
      shareData.push(shareViewData);
      (postViewData.shareduser = shareData), this.userData.push(postViewData);
      this.userData = this.removeDuplicates(this.userData, "postId");
        this.userData = this.sortData(this.userData);


    }, err => {
      this.util.stopLoader();
    });
  }

  addBusinessDataToSharedPost(postViewData, shareViewData, businessId): void {
    // this.util.startLoader()
    let datas: any = {};
    datas.businessId = businessId;
    datas.userId = localStorage.getItem("userId");

    this.api.create("business/check/admin", datas).subscribe((res) => {
      //loder
      let img = "assets/images/gallery/company.png";
      if (res.businessLogo != null) {
        img = AppSettings.photoUrl + res.businessLogo;
      }

      shareViewData.userName = res.businessName;
      shareViewData.photo = img;
      shareViewData.img = img;
      let shareData = [];
      shareData.push(shareViewData);
      //shareData = this.sortBy(shareData, 'postedOn');
      (postViewData.shareduser = shareData), this.userData.push(postViewData);
      this.userData = this.removeDuplicates(this.userData, "postId");

        this.userData = this.sortData(this.userData);


    }, err => {
      this.util.stopLoader();
      if (err.status == 500) {
        this.util.stopLoader();
      }
    });
  }

  addCommunityDataToSharedPost(postViewData, shareViewData, communityId): void {

    let datas: any = {};
    datas.communityId = communityId;
    datas.userId = localStorage.getItem("userId");

    this.api.query("community/details/" + this.communityid).subscribe((res) => {
      let img = null;
      let photo = img;
      if (shareViewData.postedByUserData.photo != null) {
        photo = AppSettings.photoUrl + shareViewData.postedByUserData.photo;
      }
      if (res.data != null) {
        shareViewData.userName = res.data.communityDetails.communityName;
      }
      shareViewData.photo = photo;
      shareViewData.img = img;
      let shareData = [];
      shareData.push(shareViewData);

      (postViewData.shareduser = shareData), this.userData.push(postViewData);
      this.userData = this.removeDuplicates(this.userData, "postId");
        this.userData = this.sortData(this.userData);

    }, err => {
      this.util.stopLoader();
    });
  }

  addNetworkDataToSharedPost(postViewData, shareViewData, networkId): void {
    this.api.query("network/get/" + networkId).subscribe((res) => {
      if (
        res != undefined &&
        res != null &&
        res.data.Network.networkName != undefined &&
        res.data.Network.networkName != null
      ) {
        let img = null;
        let photo = img;
        if (shareViewData.postedByUserData.photo != null) {
          photo = AppSettings.photoUrl + shareViewData.postedByUserData.photo;
        }

        shareViewData.photo = photo;
        shareViewData.img = img;
        shareViewData.userName = res.data.Network.networkName;
        shareViewData.networkId = res.data.Network.networkId;
        shareViewData.networkOwnerId = res.data.Network.networkOwnerId;
        let shareData = [];
        shareData.push(shareViewData);
        (postViewData.shareduser = shareData), this.userData.push(postViewData);
        this.userData = this.removeDuplicates(this.userData, "postId");
          this.userData = this.sortData(this.userData);

      }
    }, err => {
      this.util.stopLoader();
    });
  }

  addTeamDataToSharedPost(postViewData, shareViewData, teamId): void {
    this.api.query("teams/get/" + teamId).subscribe((res) => {
      if (res != undefined && res != null) {
        let img = "";

        let photo = img;
        if (shareViewData.postedByUserData.photo != null) {
          photo = AppSettings.photoUrl + shareViewData.postedByUserData.photo;
        }
        shareViewData.photo = photo;
        shareViewData.img = img;
        shareViewData.userName = res.data.teams.teamName;
        shareViewData.teamId = res.data.teams.teamId;
        shareViewData.teamsOwnerId = res.data.teams.teamsOwnerId;
        let shareData = [];
        shareData.push(shareViewData);
        (postViewData.shareduser = shareData),
          this.userData.push(postViewData);
        this.userData = this.removeDuplicates(this.userData, "postId");

          this.userData = this.sortData(this.userData);


      }
    }, err => {
      this.util.stopLoader();
    });
  }


  removeDuplicates(originalArray, prop) {
    var newArray = [];
    var lookupObject = {};

    for (var i in originalArray) {
      lookupObject[originalArray[i][prop]] = originalArray[i];
    }

    for (i in lookupObject) {
      newArray.push(lookupObject[i]);
    }
    return newArray;
  }

  custom_sort(a, b) {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  }
  sharepage(data) {
    let postEntityId;
    if (this.Commomdatass === "USER") {
      postEntityId = this.userId;
    } else if (this.Commomdatass === "COMMUNITY") {
      postEntityId = this.communityid;
    } else if (this.Commomdatass === "BUSINESS") {
      postEntityId = this.businessId;
    } else if (this.Commomdatass === "NETWORK") {
      postEntityId = this.networkId;
    } else if (this.Commomdatass === "TEAM") {
      postEntityId = this.teamId;
    }

    let postdatas = this.sharecmd;
    let datas = {
      postType: "SHARE",
      sourcePostId: data.postId,
      postContent: postdatas,
      postEntity: this.Commomdatass,
      postEntityId: postEntityId,
      postedBy: localStorage.getItem("userId"),
    };
    this.util.startLoader();
    this.api.create("post/create", datas).subscribe((res) => {
      this.showWelcomePost = false;
      this.selectedEntities = []
      this.util.stopLoader();

      res.edit = false
      this.localPushData(res);
      this.afterKey = undefined;


      this.commanddata = "";
      this.sharecmd = "";
    }, err => {
      this.util.stopLoader();
      if (err.status == 500) {
        this.util.stopLoader();
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: 'Something went wrong while processing your request. Please, try again later.',
          showDenyButton: false,
          confirmButtonText: `ok`,
        })
      }
    });
  }
  toTitleCase(str: string): string {
    return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }

  loadPreviousComments(post: any): void {
    this.indexforSearchafterKey.pop();
    for (let i = post.comments.length - 1; i >= 0; i--) {
      const po = post.comments[i];
      if (po.offset === post.c.offSet) {
        post.comments.splice(i, 1);
      } else {
        break;
      }
    }
    post.c.offSet -= 3;
  }


  indexforSearchafterKey = [];
  loadMoreComments(post: any): void {

    if (post.c === undefined || post.c == null) {
      post.c = {
        offSet: 0,
        pageCount: 3,
      };
    }
    post.c.offSet = post.c.offSet + post.c.pageCount;
    if (this.indexforSearchafterKey.length == 0) {
      this.previousSearchAfterKey = null;
    } else {
      let lastkey = this.indexforSearchafterKey[this.indexforSearchafterKey.length - 1];
      if (lastkey) {
        this.previousSearchAfterKey = lastkey.key;
        if (lastkey.postId != post.postId) {
          this.indexforSearchafterKey = [];
          this.previousSearchAfterKey = null;
        }
      }


    }

    const postData = {
      postId: post.postId,
      searchAfterKey: this.previousSearchAfterKey ? [this.previousSearchAfterKey] : null,
      limit: 3,
      isGlobalCommunityPost: false

    };

    if (post.isGlobalCommunityPost == true || post.isGlobalCommunityPost != null) {
      postData.isGlobalCommunityPost = true;
    }

    this.util.startLoader();
    this.api.create("post/comments/qu", postData).subscribe((res: any) => {
      this.util.stopLoader();
      if (res) {
        if (res.data && res.data.comments) {

          if (res.data.searchAfterKey && res.data.searchAfterKey.length > 0) {
            let data = {
              "key": res.data.searchAfterKey[0],
              "postId": post.postId
            }
            this.indexforSearchafterKey.push(data)
            this.previousSearchAfterKey = res.data.searchAfterKey[0];
          }
          const comments = res.data.comments
          comments.forEach((e) => {

            if (e.photo !== undefined && e.photo != null) {
              e.photo = AppSettings.photoUrl + e.photo;
            } else {
              e.photo = null
            }
            e.offset = post.c.offSet;
            post.comments.push(e);
          });
        }
      } else {
        this.util.stopLoader();
      }
    }, err => {
      this.util.stopLoader();
      if (err.status == 500) {
        this.util.stopLoader();
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: 'Something went wrong while processing your request. Please, try again later.',
          showDenyButton: false,
          confirmButtonText: `ok`,
        })
      }
    });
  }


  showData(number, value) {
    if (number > 3) {
      this.cmdOffsetafterkey = false;
    }
  }

  redirectEntityFromShareModal(data) {
    this.closeSharePage();
    this.communityroute(data);
  }

  isBusinessSuperAdmin(): boolean {
    return (localStorage.getItem('isSuperAdmin') == 'true' || localStorage.getItem('isAdmin') == 'true') ? true : false;
  }

  communityroute(data) {



    if (data.postEntity === "COMMUNITY") {
      let datas: any = {};
      datas.communityId = data.postEntityId;
      data.communityId = data.communityId

      datas.userId = localStorage.getItem('userId')
      this.api.create("community/home", datas).subscribe(res => {
        if (res) {
          localStorage.setItem('communityId', res.data.communityhome.communityId)
          localStorage.setItem('isAdmin', res.data.isAdmin)
          localStorage.setItem('communityAdmin', res.data.isAdmin)
          localStorage.setItem('communityType', res.data.communityhome.communityType)
          localStorage.setItem('isSuperAdmin', res.data.isSuperAdmin)
          localStorage.setItem('communitySuperadmin', res.data.isSuperAdmin)
          localStorage.setItem('isJoined', res.data.isJoined)
          localStorage.setItem('screen', 'community')
          localStorage.setItem('adminviewflag', 'false')
          datas.communityId = res.data.communityhome.communityId;
          this.router.navigate(['community'], { queryParams: res.data.communityhome })
        }
      });


      // this.router.navigate(["community"], { queryParams: datas });
    } else if (data.postEntity === "NETWORK") {
      this.api.query("network/get/" + data.postEntityId).subscribe((res) => {
        if (res != undefined && res != null) {
          this.router.navigate(["networkPage/home"], {
            queryParams: res.data.Network,
          });
        }
      }, err => {
        this.util.stopLoader();
      });
    } else if (data.postEntity === "TEAM") {
      this.api.query("teams/get/" + data.postEntityId).subscribe((res) => {
        if (res != undefined && res != null) {
          this.router.navigate(["teamPage/home"], {
            queryParams: res.data.teams,
          });
        }
      }, err => {
        this.util.stopLoader();
      });
    }
  }

  photoUrl: any = AppSettings.photoUrl;
  onProfilePhotoError(event, post: any) {

    if (post.postEntity === "BUSINESS") {
      event.target.src = "assets/images/gallery/company.png";
    } else if (post.postEntity === "COMMUNITY") {
      event.target.src = "assets/icon/comm.png";
    } else {
    }
  }
  onTargetRateTyped(value, param) {
    this.typeTargetValue = value
  }
  getInitialstwo(firstname: string, lastname: string): string {
    return this.JobServicecolor.getInitialsparam(firstname, lastname);
  }

  getColortwo(firstname: string, lastname: string): string {
    return this.JobServicecolor.getColorparam(firstname, lastname);
  }
  getInitials(fullname: string): string {
    return this.JobServicecolor.getInitials(fullname);
  }

  getColor(fullname: string): string {
    return this.JobServicecolor.getColor(fullname);
  }

  backdropConfig = {
    backdrop: true,
    ignoreBackdropClick: true,
    keyboard: false,
    // scroll
  };

  startAPost(postTemplate: TemplateRef<any>) {
    this.currentOrg = true;
    this.animState0 = 'middle'
    this.animState1 = 'right'
    this.animState = 'right'
    this.editPost = false
    this.checkedList = [];
    this.tempcheckedList = [];
    this.postPrivacy = "Everyone";
    this.privacyValue = 'Everyone'
    this.modalRef = this.modalService.show(postTemplate, this.backdropConfig);
    this.postTypeForm.get('postType').setValue('Everyone')
    this.commonVariables.postFormflag = true;
    this.getCountries()
    this.getListValues('ENGAGEMENT_TYPE')
  }

  localPushData(response) {
    this.shareData = [];
    this.commentData = [];
    if (response !== undefined && response !== null) {
      this.afterKey = response.searchAfterKey;
      this.userbadges.profileStatus();
      let element = response;
      if (element.medias) {
        element.medias.forEach((e1) => {
          if (e1.url != null) {
            var path;
            path = AppSettings.photoUrl + e1.fileId;
            e1.url = "";
            e1.url = path;
          } else {

          }
        });
      }
      if (element.comments) {
        element.comments.forEach((e1: any) => {

          if (e1) {
            if (e1.photo && e1.photo != null) {
              e1.photo = AppSettings.photoUrl + e1.photo;
            } else {
              e1.photo = null
            }
          }
        });
      }

      let indx;
      if (element.postContent == null) {
        element.postContent = null
      }

      if (element.edit) {
        indx = this.userData.findIndex(item => item.postId == element.postId);

      } else {


      }


      var postData = {
        status: element.status,
        userId: element.userId,
        connected: element.connected,
        isWelcomePost: element.isWelcomePost,
        isPlatformPost: element.isPlatformPost,
        postId: element.postId,
        postType: element.postType,
        sourcePostId: element.postId,
        postContent: element.postContent,
        postEntity: element.postEntity,
        postEntityId: element.postEntityId,
        postedBy: element.postedBy,
        postedByType: element.postedByType,
        postedOn: element.postedOn,

        likesCount: element.likesCount,
        commentsCount: element.commentsCount,
        sharedCount: element.sharedCount,

        postPrivacy: element.postPrivacy,
        postPrivacyEntities: element.postPrivacyEntities,
        hashTags: element.hashTags,
        medias: element.medias,
        likes: element.likes,
        shares: element.shares,
        page: element.page,
        code: element.code,
        message: element.message,
        comments: element.comments,
        visible: false,

        userLikedStatus: element.userLikedStatus,
        postedByUserData: element.postedByUserData
      };
      this.userData[indx] = postData;

      if (element.postEntity === "USER") {
        this.addUserDataToPost(element, postData, element.postEntityId);
      } else if (element.postEntity === "BUSINESS") {
        this.addBusinessDataToPost(
          element,
          postData,
          element.postEntityId,

        );
      } else if (element.postEntity === "COMMUNITY") {
        this.addCommunityDataToPost(
          element,
          postData,
          element.postEntityId,

        );
      } else if (element.postEntity === "NETWORK") {
        this.addNetworkToPost(element, postData, element.postEntityId);
      } else if (element.postEntity === "TEAM") {
        this.addTeamsToPost(element, postData, element.postEntityId);
      }
      this.contentLoaded = true;
      setTimeout(() => {
        this.util.stopLoader()
      }, 600);
    }

  }


  onFileDropped($event) {
    this.prepareFilesList($event);
  }

  filetoView: any
  fileBrowseHandler(files) {
    this.prepareFilesList(files);
    this.tempFile = files[0];

  }



  prepareFilesList(files: File) {
    if (files[0].size > this.fileSize) {
      Swal.fire("", `${this.IMAGE_ERROR}`, "info");
      $("#fileDropRef")[0].value = '';
      return true;
    }
    this.fileDragdrop = files[0];
    this.resumeupload = files[0];
    var fromate = ['application/pdf', 'application/docx', 'application/doc', 'text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword']

    if (fromate.includes(files[0].type)) {
      this.fileDragdrop = files[0];
      this.resumeupload = files[0];
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




  savetest() {
    // console.log(this.fileDragdrop.name);
  }

  removeFiles() {
    $("#fileDropRef")[0].value = '';
    if (this.fileDragdrop != null && this.resumeupload != null) {
      this.fileDragdrop = ''
      this.resumeupload = ''
    }
    // this.prepareFilesList(null);

  }

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
              this.util.startLoader();
            this.api.create("credits/buyCredits", data).subscribe(res => {
              this.util.stopLoader();
              this.creditform.reset();
              this.modalRef.hide()
              this.showmodel = false;

              if (res.code == "00000") {
                this.modalService.hide(1)
                this.modalService.hide(2)
                this.beingEdited = false
                Swal.fire({
                  icon: "success",
                  title: "Credit Added Successfully",
                  showDenyButton: false,
                  // confirmButtonText: `ok`,
                  timer: 2000,
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
    // in case the Blob uses a lot of memory
    setTimeout(() => URL.revokeObjectURL(link.href), 0);
  }

  messagemodelflag = false;
  messageData: any
  closeMessage() {
    this.messagemodelflag = false;
  }

  updateSupportModule() {
    let module = new jobModuleConfig(this.openSupport);
    module.source = this;
    this.supportModal = module;
  }

  openSupport() {
    // this.closeModal();
    let data: any = {}
    data.userId = localStorage.getItem('userId');
    data.groupType = "SUPPORT";
    let url = "findContactsByRefererId";
    this.api.messagePageService('POST', url, data).subscribe(res => {

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

}



