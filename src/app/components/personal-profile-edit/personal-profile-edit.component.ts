import { BusinessModal } from './../../services/businessModal';
import { WorkExperience } from './../../services/userModel';
import {
  Component,
  OnInit,
  TemplateRef,
  ChangeDetectorRef,
  ElementRef,
  Renderer2,
  ViewChild,
} from "@angular/core";
import {
  UntypedFormGroup,
  UntypedFormArray,
  UntypedFormBuilder,
  Validators,
} from "@angular/forms";
import { dateFormat } from "src/app/services/dateFormat";
import { ApiService } from "src/app/services/api.service";
import { UtilService } from "src/app/services/util.service";
import { MessageService } from "src/app/services/message.service";
import { ActivatedRoute, Router } from "@angular/router";
import {
  NgbDateParserFormatter,
  NgbDatepickerConfig,
} from "@ng-bootstrap/ng-bootstrap";
import {
  BsModalService,
  BsModalRef,
  ModalDirective,
} from "ngx-bootstrap/modal";
import { AuthServiceService } from "src/app/services/auth-service.service";
// import {
//   BsDatepickerConfig,
//   DateFormatter,
// } from "ngx-bootstrap/datepicker/public_api";
import { debounceTime } from "rxjs/operators";
import { ImageCroppedEvent } from "ngx-image-cropper";
import { AppSettings } from "../../services/AppSettings";
import { CookieService } from "ngx-cookie-service";
import { CustomValidator } from "../Helper/custom-validator";
import Swal from "sweetalert2";
import { Subscription, BehaviorSubject } from "rxjs";
import { SearchData } from "src/app/services/searchData";
import { PlatformLocation } from "@angular/common";
import { ProfilePhoto } from "src/app/services/profilePhoto";
import { TypeaheadOrder } from "ngx-bootstrap/typeahead/typeahead-order.class";
import { PageType } from "src/app/services/pageTypes";
import { CommonValues } from "src/app/services/commonValues";
import { MatAutocompleteTrigger } from "@angular/material/autocomplete";
import { FormValidation } from "src/app/services/FormValidation";
import { GigsumoService } from 'src/app/services/gigsumoService';
import { BUSINESS_STATUS_CODE, GigsumoConstants } from 'src/app/services/GigsumoConstants';
import { PROFILE_LISTENER } from 'src/app/services/UserService';
import { HealthCareOrganization } from 'src/app/services/HealthCareOrganization';
import { EventEmitter } from '@angular/core';
import { jobModuleConfig } from 'src/app/services/jobModuleConfig';

declare var $: any;


export type WorkExperienceOrBusiness = BusinessModal | WorkExperience;

@Component({
  selector: "app-personal-profile-edit",
  templateUrl: "./personal-profile-edit.component.html",
  styleUrls: ["./personal-profile-edit.component.scss"],
  providers: [
    { provide: NgbDateParserFormatter, useClass: dateFormat },
    NgbDatepickerConfig,
  ],
  outputs: ["profileBannerUpdate"]
})
export class PersonalProfileEditComponent extends FormValidation implements OnInit {
  photoUrl: string = AppSettings.photoUrl;
  profileBannerUpdate = new EventEmitter<WorkExperience>();
  currentYear: any = new Date().getFullYear();
  // datePickerConfig: Partial<BsDatepickerConfig>;
  @ViewChild("myFileInput") myFileInput;
  @ViewChild("lgModal") lgModal;
  personalInfoForm: UntypedFormGroup;
  commonVariables: any = {};
  aboutMeForm: UntypedFormGroup;
  remainingCharacters = new BehaviorSubject<any>(this.ABOUT_ME.max);
  mycommunities: boolean = false;
  showThisBoolean: boolean = false;
  aboutMe: any;
  hide: boolean = false;
  hide1: boolean = false;
  workExist: boolean = false;
  editable: boolean = true;
  socialPresenceForm: UntypedFormGroup;
  userPrivacyForm: UntypedFormGroup;
  fileUploadName: any = "";
  photoId: any;
  imageChangedEvent: any = "";
  croppedImage: any = "";
  infoData: any = {};
  commLength;
  comm;
  currentOrgList: any = [];
  currentPursueList: any = [];
  currentOrgSaveFlag: boolean = false;
  conditions: any;
  insurance: any;
  patientAcceptance: any;
  privatePay;
  workPrivacy: boolean = false;
  eduPrivacy: boolean = false;
  certPrivacy: boolean = false;
  socialPrivacy: boolean = false;
  communityPrivacy: boolean = false;
  reviewPrivacy: boolean = false;
  experelement: any = {};
  educationElement: any = {};
  showThisOrg: boolean = false;
  currentInstitute: boolean = false;
  changeDetector: ChangeDetectorRef;
  modalRef: BsModalRef;
  modalRef1: BsModalRef | null;
  modalRef2: BsModalRef;
  phyModRef: BsModalRef;
  studModRef: BsModalRef;
  workSaveFlag: boolean = false;
  physicianFlag: boolean = false;
  experAddFlag: boolean = false;
  experEditFlag: boolean = false;
  eduAddFlag: boolean = false;
  eduEditFlag: boolean = false;
  socialSaveFlag: boolean = false;
  eduSaveFlag: boolean = false;
  userId: any;
  queryParamValue: any; ''
  searchResponse: any;
  workExperienceList: any = [];
  educationList: any = {};
  certificationList: any = {};
  eventstring: any;
  eperienceForm: UntypedFormGroup;
  physicianForm: UntypedFormGroup;
  eduForm: UntypedFormGroup;
  certForm: UntypedFormGroup;
  formData = new FormData();
  fileToUpload: File;
  workExperience: UntypedFormArray;
  yearData: any;
  yearIndex: any;
  currentOrgForm: UntypedFormGroup;
  currentPursueForm: UntypedFormGroup;
  validateMonth: boolean;
  validateEduMonth: boolean;
  validateCertMonth: boolean;
  certAddFlag: boolean = false;
  certEditFlag: boolean = false;
  certificationEdit: boolean = false;
  educationDetail: UntypedFormArray;
  certification: UntypedFormArray;
  socialPresence: UntypedFormArray;
  alternamePageLink: any;
  blogURL: any;
  facebook: any;
  linkedin: any;
  twitter: any;
  pisubmit = false;
  amsubmit = false;
  workExData: any = {};
  physicianData: any = {};
  items: any[];
  specialityList = [];
  changedata = [];
  insuranceData = [];
  workModalShown: boolean = false;
  // studModalShown: boolean = false;
  selectOrgModalShown: boolean = false;
  // selectEduModalShown: boolean = false;
  specialityDropdown = [];
  insuranceList = [];
  insuranceDropdown = [];
  insuranceSelectedItems = [];
  specialitySelectedItems = [];
  insuranceDropdownSettings = {};
  specialityDropdownSettings = {};
  conditionList = [];
  conditionDropdown = [];
  conditionSelectedItems = [];
  conditionDropdownSettings = {};
  instList: any = [];
  selected3: string;
  // orgList: Observable<string[]>;
  img: any = {};
  img1: any = {};
  image: any = {};
  userDetailsLanding: any;
  userDetailsLanding_array = [];
  isCollapsed: boolean = false;
  show = false;
  instituteList: any = [];
  phyTitleList: any = [];
  busiTitleList: any = [];
  studentTitles: any = [];
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
  years: any = [];
  orgConfig: any;
  ngxSelconfig: any;
  valueWidth = false;
  currentIndex: any = null;
  currentIndex1: any = null;
  curIndex: any;
  thepatch = [];
  stateListAU: any = [];
  stateListIN: any = [];
  stateListCA: any = [];
  countryList: any = [];
  tempFlag: boolean = false;
  workUsFlag: boolean = false;
  physicianFlags: boolean = false;
  adminFlag: boolean = false;
  studentFlag: boolean = false;
  eduUsFlag: boolean = false;
  usFlag: boolean = false;
  phyUsFlag: boolean = false;
  localUser: boolean = false;
  requestSent: boolean = false;
  requestPending: boolean = false;
  connected: boolean = false;
  notConnected: boolean = false;

  backdropConfig = {
    backdrop: true,
    ignoreBackdropClick: true,
    keyboard: false,
  };


  config = {
    placeholder: "About Yourself",
    tabsize: 2,
    height: "100px",
    //uploadImagePath: '/api/upload',
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
    ],
    callbacks: {
      onKeydown(e) {
        const limiteCaracteres = 1001;

        const caracteres = e.currentTarget.innerText;
        const totalCaracteres = caracteres.length;

        if (totalCaracteres >= limiteCaracteres) {
          if (
            e.keyCode !== 8 &&
            e.keyCode !== 37 &&
            e.keyCode !== 38 &&
            e.keyCode !== 39 &&
            e.keyCode !== 40 &&
            e.keyCode !== 65
          ) {
            e.preventDefault();
          }
        }
      },
      onPaste(e) {
        const buffertext = (e.originalEvent || e).clipboardData.getData("text");
        e.preventDefault();
        const all = buffertext.trim();
        document.execCommand("insertText", false, all.substring(0, 1000));
        //$('#maxcontentpost').text(400 - t.length);
      },
    },
  };
  startPageCom: number;
  paginationLimitCom: number;
  showLessCommunity: boolean = false;
  promptConfig = {
    backdrop: true,
    ignoreBackdropClick: true,
    show: true,
    keyboard: false,
  };
  page: any;
  loadAPIcall:boolean=false;
  eventSubscription: Subscription;
  currentOrgEmitter: Subscription;
  CurrentPurEmitter: Subscription;
  commonVarEventEmitter: Subscription;
  anothrEmitter: Subscription
  weird: boolean = false;
  @ViewChild("autoShownModal")
  autoShownModal: ModalDirective;
  @ViewChild("autoShownModal1")
  autoShownModal1: ModalDirective;
  @ViewChild("autoShownModal2")
  autoShownModal2: ModalDirective;
  @ViewChild("autoShownModal3")
  autoShownModal3: ModalDirective;
  showOtherPrompt: boolean = false;
  charCountEmitter: Subscription;
  remainingCount: any;

  public FORMERROR = super.Form;
  supportModal: jobModuleConfig;

  constructor(
    private fb: UntypedFormBuilder,
    private auth: AuthServiceService,
    private route: ActivatedRoute,
    private util: UtilService,
    private cookieService: CookieService,
    private commonValues: CommonValues,
    private message: MessageService,
    private api: ApiService,
    private modalService: BsModalService,
    private rd: Renderer2,
    private el: ElementRef,
    private router: Router,
    private searchData: SearchData,
    private platform: PlatformLocation,
    private profilePhoto: ProfilePhoto,
    private pageType: PageType,
    private changedetector: ChangeDetectorRef,
    private gigsumoService: GigsumoService
  ) {
    super();
    this.anothrEmitter = this.pageType
      .getPageName()
      .subscribe((res) => {
        this.page = res.pages;
      });

    this.items = Array(15).fill(0);
    this.startPageCom = 0;
    this.paginationLimitCom = 5;
    this.eventSubscription = this.searchData
      .getBooleanValue()
      .subscribe((res) => {
        this.weird = res;
      });
    this.currentOrgEmitter = this.searchData
      .getCurrentOrg()
      .subscribe((res) => {
        this.currentIndex = res;
      });
    this.CurrentPurEmitter = this.searchData
      .getCurrentInst()
      .subscribe((res) => {
        this.curIndex = res;
      });
    this.commonVarEventEmitter = this.searchData
      .getCommonVariables()
      .subscribe((res) => {
        this.commonVariables = res;
        this.commonVariables.localUser = this.userId == localStorage.getItem("userId") ? true : false;
      });

    platform.onPopState(() => this.modalRef.hide());
    window.scrollTo(0, 0);
    const sessionId = localStorage.getItem("sessionID");
    if (sessionId === undefined || sessionId === null || sessionId === "") {
      // this.modalRef.hide();
      // this.modalRef1.hide();
      // this.modalRef2.hide();
      // this.hideModal();
      // this.hideModalSelectOrg();
      // this.hideModaledu();
      // this.hidePhyPrompt();
      // this.onHideEduMandTemp();
      // this.onHideWrkMandTemp();
      // this.onHideSelectEdu();
      // this.onHideSelectOrg();
    }

    this.charCountEmitter = this.commonValues.getCharCount().subscribe(res => {
      this.remainingCount = res.value
    })
  }
  clientTypeList: Array<string> = ['Direct Client', 'Supplier', 'Systems Integrator', 'Prime Vendor', 'Vendor', 'Staffing Agency']
  ngOnInit() {

    this.updateSupportModule();
    this.getUserDetails();
    this.getTitleList()
    this.generateYears();
    this.getCountry();
    this.getCertificationList();
    // this.api.create("business/checkBusinessByDomain/abubakr@dds.com", null).subscribe(res=> {
    // console.log("kdjfhksjdh")
    // console.log(res)
    // })
    this.personalInfoForm = this.fb.group(
      {
        userType: [null, [Validators.required]],
        nonApplicable: [false],
        firstName: [
          "",
          [
            Validators.required,
            Validators.pattern(this.FIRST_Name.pattern),
            CustomValidator.checkWhiteSpace(),
            , CustomValidator.max(this.FIRST_Name.max),
          ],
        ],
        lastName: [
          "",
          [
            Validators.required,
            Validators.pattern(this.LAST_NAME.pattern),
            CustomValidator.checkWhiteSpace(),
            , CustomValidator.max(this.LAST_NAME.max)
          ],
        ],
        photo: [""],
        npiNo: [null],
        phoneNo: [
          "",
          Validators.compose([
            Validators.maxLength(15),
            Validators.pattern(/^[\d -]+$/),
          ]),
        ],
        email: [
          "",
          Validators.compose([Validators.required, Validators.pattern(this.EMAIL.pattern), CustomValidator.max(this.EMAIL.max)]),
        ],
        state: ["", Validators.compose([Validators.required, CustomValidator.max(this.STATE.max)])],
        zipcode: [
          "",
          Validators.compose([
            Validators.required,
            CustomValidator.minmaxLetters(this.ZIPCODE.min, this.ZIPCODE.max)
          ]),
        ],
        secondaryEmail: ["", Validators.compose([Validators.pattern(this.EMAIL.pattern), CustomValidator.max(this.CITY.max)])],
        organisation: [""],
        city: ["", Validators.compose([Validators.required, CustomValidator.max(this.CITY.max)])],
        country: ["", Validators.compose([Validators.required, CustomValidator.max(this.CITY.max)])],
      },
    );

    this.currentOrgForm = this.fb.group({
      chooseCurrentOrg: [
        null,
        [Validators.required, Validators.pattern(/^[^\s]+(\s+[^\s]+)*$/)],
      ],
    });

    this.currentPursueForm = this.fb.group({
      chooseCurrentPursue: [
        null,
        [Validators.required, Validators.pattern(/^[^\s]+(\s+[^\s]+)*$/)],
      ],
    });

    this.aboutMeForm = this.fb.group({
      aboutMe: ["", CustomValidator.minmaxWords(this.ABOUT_ME.min, this.ABOUT_ME.max)], //, Validators.compose([Validators.maxLength(1000)])
    });

    this.eperienceForm = this.fb.group({
      workExperience: this.fb.array([]),
    });


    this.physicianForm = this.fb.group({
      conditions: [null],
      privatePay: ["No"],
      insurance: [null],
      patientAcceptance: ["No"],
    });

    this.eduForm = this.fb.group({
      educationDetail: this.fb.array([]),
    });

    this.certForm = this.fb.group({
      certification: this.fb.array([]),
    });

    this.socialPresenceForm = this.fb.group({
      twitter: [null, [Validators.pattern(this.SOCIAL_LINK.pattern)]],
      facebook: [null, [Validators.pattern(this.SOCIAL_LINK.pattern)]],
      linkedin: [null, [Validators.pattern(this.SOCIAL_LINK.pattern)]],
      blogURL: [null, [Validators.pattern(this.SOCIAL_LINK.pattern)]],
      alternamePageLink: [null, [Validators.pattern(this.SOCIAL_LINK.pattern)]],
    });

    this.userPrivacyForm = this.fb.group({
      workExperience: [false],
      educationDetail: [false],
      certification: [false],
      socialPresence: [false],
      communities: [false],
      reviews: [false],
    });



    this.addWorkExperience();
    this.addEducation();
    this.addCertification();

    this.orgConfig = {
      search: true,
      height: "auto",
      placeholder: "Organization",
      searchPlaceholder: "Search Organization",
      searchOnKey: "name",
      clearOnSelection: true,
    };

    this.ngxSelconfig = {
      search: true,
      height: "auto",
      placeholder: "Title",
      searchPlaceholder: "Search Title",
      searchOnKey: "name",
      clearOnSelection: true,
    };

    this.conditionSelectedItems = [];
    this.insuranceList = [
      "Life Insurance",
      "Vehicle Insurance",
      "Propreitary Insurance",
      "Home Insurance",
    ];
    this.insuranceSelectedItems = [];

    this.aboutMeForm.valueChanges.subscribe(res => {
      const value: string = FormValidation.extractContent(this.aboutMeForm.get('aboutMe').value);
      if (value != "undefined") {
        this.remainingCharacters.next(this.ABOUT_ME.max - (value && value.length));
      }
    })

  }


  getUserDetails() {
    if (this.route.snapshot.queryParams["userId"]) {
      this.route.queryParams.subscribe((res) => {
        this.queryParamValue = res;
        this.userId = res;
        this.getQuerParams();
      });
    } else {
      if (
        localStorage.getItem("userId") != undefined &&
        localStorage.getItem("userId") != null &&
        localStorage.getItem("userId") != ""
      ) {
        this.userId = localStorage.getItem("userId");
        this.validateUser();
      } else if (
        this.cookieService.get("userId") != undefined &&
        this.cookieService.get("userId") != null &&
        this.cookieService.get("userId") != ""
      ) {
        this.userId = this.cookieService.get("userId");
        this.validateUser();
      }
    }
  }

  recruiterTitleList: any = []
  getTitleList() {
    var data = { 'domain': 'GIGSUMO_JOB_TITLE,GIGSUMO_RECRUITERS_TITLE_LIST' }
    this.util.startLoader()
    this.api.create('listvalue/findbyList', data).subscribe(res => {
      if (res.code == '00000') {
        this.util.stopLoader()
        res.data.GIGSUMO_JOB_TITLE.listItems.forEach(ele => {
          this.candidateJobTitleList.push(ele.item)
        })

        res.data.GIGSUMO_RECRUITERS_TITLE_LIST.listItems.forEach(ele => {
          this.recruiterTitleList.push(ele.item)
        })
      }
    })
  }


  closeInfoModal() {
    this.modalRef.hide();
    $("profileimage").val("");

    this.img = {};
    this.img.src = AppSettings.ServerUrl + "download/" + this.infoData.photo;
  }

  setCommunityId(data) {
    this.checkadmincommunity(data.communityId, data);
  }

  checkadmincommunity(businessid, data) {
    let datas: any = {};
    datas.communityId = businessid;
    datas.userId = localStorage.getItem("userId");
    this.util.startLoader();
    this.api.create("community/home", datas).subscribe((res) => {
      this.util.stopLoader();
      localStorage.setItem("businessId", businessid);
      localStorage.setItem("communityId", businessid);
      localStorage.setItem("isAdmin", res.data.isAdmin);
      localStorage.setItem("isSuperAdmin", res.data.isSuperAdmin);
      localStorage.setItem("screen", "community");
      localStorage.setItem("adminviewflag", "false");

      this.router.navigate(["community"], { queryParams: data });
    }, err => {
      this.util.stopLoader();

    });

  }

  showMoreComm() {
    //  this.paginationLimit = Number(this.paginationLimit) + 3;
    this.paginationLimitCom = this.infoData.communityList.length;
    this.showLessCommunity = true;
  }

  showLessComm() {
    this.paginationLimitCom =
      Number(this.paginationLimitCom) + 5 - this.infoData.communityList.length;
    this.showLessCommunity = false;
  }

  generateYears() {
    var max = new Date().getFullYear();
    var min = max - 80;
    for (var i = min; i <= max; i++) {
      this.years.push(i);
    }
  }

  // getLists() {
  //   this.util.startLoader();
  //   this.api
  //     .query("care/list/values/MEDICAL_PROFESSIONAL_CONDITIONS")
  //     .subscribe((res) => {
  //       this.util.stopLoader();
  //       this.conditionList = [];
  //       if (res) {
  //         if (res.listItems && res.listItems != null) {
  //           res.listItems.forEach((ele) => {
  //             this.conditionList.push(ele.item);
  //           });
  //         }
  //       }
  //     }, err => {
  //       this.util.stopLoader();
  //     });
  // }

  resetData() {

    this.util.startLoader();
    this.api.query("user/" + this.userId).subscribe((res) => {

      if (res) {
        this.util.stopLoader();
        this.infoData = res;

      }
    }, err => {
      this.util.stopLoader();
    });
    this.chooseProfileWorkPlace();
  }

  closeValidator() {

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
      title: 'Are you sure you want to close?',
      text: "This will not let you change your current organization.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'cancel',
      reverseButtons: true
    })
      .then((result) => {
        if (result.isConfirmed) {
          this.domainValidatorSubmit = false
          this.resentOTPCode = false
          this.resendotp = false
          this.otpEmailSent = false
          this.domainForm.get('domainValidationOtp').setErrors({ wrongDomainValidationOtp: null })
          this.domainForm.get('domainValidationOtp').updateValueAndValidity({ emitEvent: false })
          this.domainForm.get('swapEmail').setErrors({ genericDomain: null })
          this.domainForm.get('swapEmail').updateValueAndValidity({ emitEvent: false })
          this.domainForm.get('swapEmail').setErrors({ emailExistsAlready: null })
          this.domainForm.get('swapEmail').updateValueAndValidity({ emitEvent: false })

          this.domainForm.get('domainValidationOtp').patchValue(null)
          this.domainForm.get('domainValidationOtp').setErrors({ wrongDomainValidationOtp: null })
          this.domainForm.get('domainValidationOtp').updateValueAndValidity({ emitEvent: false })
          this.domainForm.get('swapEmail').patchValue(null)
          this.domainForm.get('swapEmail').setErrors({ genericDomain: null })
          this.domainForm.get('swapEmail').updateValueAndValidity({ emitEvent: false })
          this.domainForm.get('swapEmail').setErrors({ emailExistsAlready: null })
          this.domainForm.get('swapEmail').updateValueAndValidity({ emitEvent: false })
          this.otpEmailSent = false
          this.commonVariables.emailDomainValidation = false
          this.searchData.setCommonVariables(this.commonVariables)
        } else if (result.isDenied) {

        }
      });




  }
  resentOTPCode: boolean = false
  resendotp: boolean = false
  otpEmailSent: boolean = false
  domainValidatorSubmit: boolean = false
  proceedAfterValidation() {
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

        this.api.create('user/sendOtpToMailId', data).subscribe(res => {
          if (res.code == '00000') {
            this.util.stopLoader()
            setTimeout(() => {
              this.resentOTPCode = true;
            }, 120000);
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
            //   //this.getToJob()
            //    this.workExperiencecheck();
            // }else if (param == 'JOBS' && workExperience.length > 0) {
            //   this.getToJob()
            // } else  if (param == 'CANDIDATE') {
            //   this.getToCandidate()
            // }


          } else if (res.code == '99998') {
            this.util.stopLoader()
            this.otpEmailSent = false
            this.domainForm.get('swapEmail').setErrors({ emailExistsAlready: true })
          }
        })
      }
    }
  }

  requestAnotherOTP() {


    var data: any = {}
    data.email = this.domainForm.value.swapEmail
    data.firstName = this.firstName
    data.lastName = this.lastName
    data.userId = this.userId
    this.api.create('user/sendOtpToMailId', data).subscribe(res => {
      if (res.code == '00000') {
        this.resendotp = true
        this.domainForm.get('domainValidationOtp').setValidators([Validators.required])
        this.domainForm.get('domainValidationOtp').updateValueAndValidity()
        this.domainForm.get('domainValidationOtp').setErrors({ wrongDomainValidationOtp: null })
        this.domainForm.get('domainValidationOtp').updateValueAndValidity({ emitEvent: false })
        this.domainForm.get('swapEmail').setErrors({ emailExistsAlready: null })
        this.domainForm.get('domainValidationOtp').updateValueAndValidity({ emitEvent: false })
      } else if (res.code == '99998') {
        this.otpEmailSent = false
        this.domainForm.get('swapEmail').setErrors({ emailExistsAlready: true })
      }
    })


  }

  domainForm: UntypedFormGroup

  get domainControl() {
    return this.domainForm.controls
  }

  onLogout() {
    var val: any = {}
    val.isLoggedOut = true
    this.searchData.setCommonVariables(val);
    this.util.startLoader();
    this.api.onLogout().subscribe((res) => {
      if (res) {
        if (res.code === "00000") {
          this.util.stopLoader();
          //this.updateUserOnlineOrOffline('OFFLINE');
          this.onLogoutSuccess();
        } else {
          this.util.stopLoader();
        }
      }
    });
  }



  onLogoutSuccess() {
    this.cookieService.deleteAll();
    let allCookies = document.cookie.split(";");
    if (allCookies) {
      for (let i = 0; i < allCookies.length; i++) {
        document.cookie =
          allCookies[i] + "=;expires=" + new Date(0).toUTCString();
      }
    }
    localStorage.clear();
    this.router.navigate(["login"]);
  }

  anotherCode: boolean = false;
  primaryEmail: any;
  firstName: any;
  lastName: any;
  previousEmailAddress: any;
  domainList: any = []
  creditPoints: any;
  currentEntity: any;
  clientType: any;
  validateOtp() {
    if (this.domainForm.value.domainValidationOtp == null || this.domainForm.value.domainValidationOtp == '' || this.domainForm.value.domainValidationOtp == undefined) {
      this.domainForm.get('domainValidationOtp').setErrors({ wrongDomainValidationOtp: true })
    } else {
      var data: any = {}
      data.primaryMailId = this.domainForm.value.swapEmail
      data.secondaryMailId = this.primaryEmail
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
          // this.otpEmailSent = false
          Swal.fire({
            position: "center",
            icon: "success",
            title: "OTP verified successfully.",
            showConfirmButton: false,
            timer: 2000,
          }).then(() => {
            this.util.startLoader()
            this.commonVariables.emailDomainValidation = false
            var expp = this.workExperience.getRawValue()[0]
            expp.action = "APPROVED"
            this.api
              .create("user/v1/workexperience", expp)
              .subscribe((res) => {
                Swal.fire({
                  title: "Work Experience Updated",
                  text: "Changes made successfully and your work experience is updated. You will be logged out now. Please login again with the new business email credential.",
                  icon: "success",
                  timer: 2000,
                  showConfirmButton: false
                  // confirmButtonText: "Yes",
                  // denyButtonText: "No"
                }).then(() => {
                  this.onLogout()
                })
                this.modalService.hide(1)
                this.util.stopLoader()
              })
          })
        } else if (res.code == '99999') {
          this.util.stopLoader();
          this.domainForm.get('domainValidationOtp').setErrors({ wrongDomainValidationOtp: true })

        }
        else if (res.code == '99998') {
          this.util.stopLoader();
          this.anotherCode = true;
          this.resendotp = true;
          this.domainForm.get('domainValidationOtp').setErrors({ wrongDomainValidationOtp: true })

        }
      })
    }
  }

  chooseProfileWorkPlace() {
    this.commonVariables.numberOfExperience =
      this.infoData.workExperience.length;
    this.searchData.setCommonVariables(this.commonVariables);
    this.infoData.workExperience.forEach((ele) => {
      if (this.infoData.workExperience.length > 1) {
        if (ele.badge == true) {
          this.commonVariables.orgSelected = true;
          this.commonVariables.noOrgSelected = false;
          this.commonVariables.expId = ele.expId;
          this.searchData.setCommonVariables(this.commonVariables);
          this.experelement.city = ele.city;
          this.experelement.title = ele.title;
          this.experelement.state = ele.state;
          this.experelement.country = ele.country;
          this.experelement.organisationName = ele.organisationName;
          // this.experelement.zipcode = ele.zipcode
          // this.experelement.street = ele.street
          // this.experelement.currentOrganization = ele.currentOrganization
          // this.experelement.startMonth = ele.startMonth
          // this.experelement.startYear = ele.startYear
          // this.experelement.endMonth = ele.endMonth
          // this.experelement.endYear = ele.endYear
        }
      } else if (this.infoData.workExperience.length == 1) {
        this.infoData.workExperience.forEach((ele) => {
          this.experelement.city = ele.city;
          this.experelement.title = ele.title;
          this.experelement.state = ele.state;
          this.experelement.country = ele.country;
          this.experelement.organisationName = ele.organisationName;
        });
      }
    });
    // this.ngOnInit();
  }

  resetDataForEdu() {
    this.util.startLoader();
    this.api.query("user/" + this.userId).subscribe((res) => {
      if (res) {
        this.util.stopLoader();
        this.infoData = res;
      }
    }, err => {
      this.util.stopLoader();
    });
    this.chooseProfileEducation();
  }

  chooseProfileEducation() {
    this.commonVariables.numberOfEducation =
      this.infoData.educationDetail.length;
    this.searchData.setCommonVariables(this.commonVariables);

    this.educationElement = {};
    this.infoData.educationDetail.forEach((ele) => {
      if (this.infoData.educationDetail.length > 1) {
        if (ele.currentlyPursued == true) {
          // this.currentOrg = true
          this.educationElement.schoolName = ele.schoolName;
          this.educationElement.speciality = ele.speciality;
          this.educationElement.street = ele.street;
          this.educationElement.zipcode = ele.zipcode;
          this.educationElement.currentlyPursued = ele.currentlyPursued;
          this.educationElement.state = ele.state;
          this.educationElement.city = ele.city;
          this.educationElement.country = ele.country;
        }
      } else if (this.infoData.educationDetail.length == 1) {
        this.infoData.educationDetail.forEach((ele) => {
          // this.currentOrg = true
          this.educationElement.schoolName = ele.schoolName;
          this.educationElement.speciality = ele.speciality;
          this.educationElement.street = ele.street;
          this.educationElement.zipcode = ele.zipcode;
          this.educationElement.currentlyPursued = ele.currentlyPursued;
          this.educationElement.state = ele.state;
          this.educationElement.city = ele.city;
          this.educationElement.country = ele.country;
        });
      }
    });
  }


  query() {
    this.loadAPIcall=true;
    //this.util.startLoader();
    this.api.query("user/" + this.userId).subscribe((res) => {
      this.loadAPIcall=false;
      if (res && res.code === "00000") {
        this.util.stopLoader();
        // console.log("final data" , res);
        this.infoData = res;

        this.clientType = res.clientType
        if (res.clientType == "Client") {
          this.clientTypeList.forEach(ele => {
            if (ele == 'Direct Client') {
              this.clientTypeList = []
              this.clientTypeList = ['Client', 'Supplier', 'Systems Integrator', 'Prime Vendor', 'Vendor', 'Staffing Agency']
            }
          })
        }
        this.photoCall();
        this.bnrPhoto();
        setTimeout(() => {
          this.getData();
          this.onChangePhysician(this.infoData.userType);
          if (this.infoData.userPrivacy != null) {

            this.userPrivacyForm.patchValue({
              workExperience: this.infoData.userPrivacy.workExperience,
              educationDetail: this.infoData.userPrivacy.educationDetail,
              certification: this.infoData.userPrivacy.certification,
              socialPresence: this.infoData.userPrivacy.socialInfluence,
              communities: this.infoData.userPrivacy.communities,
              reviews: this.infoData.userPrivacy.reviews,
            });
            this.validatePrivacy();
          }

        }, 600);
      }
    }, err => {
      this.util.stopLoader();
    });
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
    } else if (val == "edu") {
      var stYr = parseInt(this.educationDetail.value[index].startYear);
      var maxYr = new Date().getFullYear();
      if (stYr == maxYr) {
        this.educationDetail.controls[index].patchValue({ startMonth: null });
      }
      this.yearData = event.target.value;
      this.yearIndex = index;
      this.educationDetail.controls[index].patchValue({
        endYear: this.currentYear,
        endMonth: null,
      });
    } else if (val == "cert") {
      var stYr = parseInt(this.certification.value[index].startYear);
      var maxYr = new Date().getFullYear();
      if (stYr == maxYr) {
        this.certification.controls[index].patchValue({ startMonth: null });
      }
      this.yearData = event.target.value;
      this.yearIndex = index;
      this.certification.controls[index].patchValue({
        endYear: this.currentYear,
        endMonth: null,
      });
    }
  }

  checkYear(y, i, val) {
    // //// console.log(this.workExperience.value[i].startYear)
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
    } else if (val == "edu") {
      let yearDataInt = parseInt(this.educationDetail.value[i].startYear);
      let year = parseInt(y);
      if (yearDataInt != null) {
        if (yearDataInt > year) {
          return true;
        } else {
          return false;
        }
      }
    } else if (val == "cert") {
      let yearDataInt = parseInt(this.certification.value[i].startYear);
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
    } else if (val == "edu") {
      let endyr = parseInt(this.educationDetail.value[i].endYear);
      let stMonth = this.educationDetail.value[i].startMonth;
      let styr = parseInt(this.educationDetail.value[i].startYear);
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
    } else if (val == "cert") {
      let endyr = parseInt(this.certification.value[i].endYear);
      let stMonth = this.certification.value[i].startMonth;
      let styr = parseInt(this.certification.value[i].startYear);
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

  //duplicacy remover method
  removeDupe(list) {
    let unique = {};
    list.forEach(function (i) {
      if (!unique[i]) {
        unique[i] = true;
      }
    });
    this.list = Object.keys(unique);
  }

  list: any = [];

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
    } else if (val == "edu") {
      if (
        this.educationDetail.value[0].startYear ==
        this.educationDetail.value[0].endYear ||
        this.educationDetail.value[0].endYear == maxyr
      ) {
        this.educationDetail.controls[0].patchValue({ endMonth: null });
      }
      if (
        this.educationDetail.value[0].startYear ==
        this.educationDetail.value[0].endYear
      ) {
        this.validateEduMonth = true;
      } else {
        this.validateEduMonth = false;
      }
    } else if (val == "cert") {
      if (
        this.certification.value[0].startYear ==
        this.certification.value[0].endYear ||
        this.certification.value[0].endYear == maxyr
      ) {
        this.certification.controls[0].patchValue({ endMonth: null });
      }
      if (
        this.certification.value[0].startYear ==
        this.certification.value[0].endYear
      ) {
        this.validateCertMonth = true;
      } else {
        this.validateCertMonth = false;
      }
    }
  }

  filterNo(event: any) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  bnrPhoto() {
    var us: any = localStorage.getItem("userId");
    this.util.startLoader()
    this.api.query("user/" + us).subscribe((res) => {
      if (res.photo != null && res.photo != undefined && res.photo != "") {
        this.util.stopLoader()
        this.profilePhoto.setPhoto(res.photo);
      } else if (
        res.photo == null ||
        res.photo == undefined ||
        res.photo == ""
      ) {
        this.util.stopLoader()
        this.profilePhoto.setPhoto(null);
      }
    }, err => {
      this.util.stopLoader();
    });
  }

  photoCall() {
    if (
      this.infoData.photo != null &&
      this.infoData.photo != "" &&
      this.infoData.photo != undefined
    ) {
      this.img = {};
      this.img.src = AppSettings.ServerUrl + "download/" + this.infoData.photo;
      // this.profilePhoto.setPhoto(this.infoData.photo)
      this.image = {};
      this.image.src =
        AppSettings.ServerUrl + "download/" + this.infoData.photo;
    } else if (
      this.infoData.photo == null ||
      this.infoData.photo == "" ||
      this.infoData.photo == undefined
    ) {
      this.img = {};
      // //// console.log("this is passed123")
      this.img.src = "assets/images/userAvatar.png";
      // this.profilePhoto.setPhoto(null)
      this.image = {};
      this.image.src = "assets/images/userAvatar.png";
    }
  }
  userType;
  getData() {

    this.userType = this.infoData.userType;
    if (this.infoData.userType == "student") {
      this.commonVariables.studentFlag = true;
      this.searchData.setCommonVariables(this.commonVariables);
    } else {
      this.commonVariables.studentFlag = false;
      this.searchData.setCommonVariables(this.commonVariables);
    }

    if (this.infoData.userType == "RECRUITER" || this.infoData.userType == "FREELANCE_RECRUITER" || this.infoData.userType == 'MANAGEMENT_TALENT_ACQUISITION') {
      this.commonVariables.recruiterFlag = true;
      this.commonVariables.benchRecruiterFlag = false;
      this.commonVariables.studentFlag = false;
      this.searchData.setCommonVariables(this.commonVariables);
    } else if (this.infoData.userType == "BENCH_RECRUITER") {
      this.commonVariables.benchRecruiterFlag = true;
      this.commonVariables.recruiterFlag = false;
      this.commonVariables.studentFlag = false;
    } else if (this.infoData.userType == "JOB_SEEKER") {
      this.commonVariables.jobSeekerFlag = true;
      this.commonVariables.benchRecruiterFlag = false;
      this.commonVariables.recruiterFlag = false;
      this.commonVariables.studentFlag = false;
    }
    var c = this.infoData.educationDetail.findIndex(
      (x) => x.showThisOnProfile == true
    );

    if (
      this.infoData.userType == "student" &&
      this.infoData.educationDetail.length == 0 &&
      this.commonVariables.localUser == true
    ) {
      // this.studModalShown = true;
    } else if (
      this.commonVariables.localUser == true &&
      this.infoData.userType == "student" &&
      c == "-1" &&
      this.infoData.educationDetail.length > 1
    ) {
      // this.studModalShown = true;
      // this.selectEduModalShown = true;
      // getting list of current orgs
      this.util.startLoader();
      setTimeout(() => {
        this.currentPursueList = [];

        this.infoData.educationDetail.forEach((ele) => {
          var obj: any = {};

          (obj.schoolName = ele.schoolName),
            (obj.institutionId = ele.institutionId),
            (obj.degree = ele.degree),
            (obj.eduId = ele.eduId),
            (obj.userId = this.userId),
            (obj.showThisOnProfile = ele.showThisOnProfile),
            (obj.currentlyPursued = ele.currentlyPursued),
            (obj.startMonth = ele.startMonth),
            (obj.startYear = ele.startYear),
            (obj.currentYear = ele.currentYear),
            (obj.endMonth = ele.endMonth),
            (obj.endYear = ele.endYear),
            (obj.currentYear = ele.currentYear),
            (obj.city = ele.city),
            (obj.street = ele.street),
            (obj.state = ele.state),
            (obj.zipcode = ele.zipcode),
            (obj.country = ele.country),
            (obj.speciality = ele.speciality),
            this.currentPursueList.push(obj);
        });
      }, 600);
      this.util.stopLoader();
    } else if (
      this.commonVariables.localUser == true &&
      this.infoData.userType == "student" &&
      c == "-1" &&
      this.infoData.educationDetail.length == 1
    ) {
      // //// console.log("pssdfsdfdsf");
      this.indexTwo = true;
      // this.studModalShown = true;

      this.educationDetail.controls[0]
        .get("schoolName")
        .patchValue(this.infoData.educationDetail[0].schoolName);
      this.educationDetail.controls[0]
        .get("institutionId")
        .patchValue(this.infoData.educationDetail[0].institutionId);
      this.educationDetail.controls[0]
        .get("eduId")
        .patchValue(this.infoData.educationDetail[0].eduId);
      this.educationDetail.controls[0]
        .get("degree")
        .patchValue(this.infoData.educationDetail[0].degree);
      // this.educationDetail.controls[0].get("userId").patchValue(this.userId);
      this.educationDetail.controls[0]
        .get("showThisOnProfile")
        .patchValue(this.infoData.educationDetail[0].showThisOnProfile);
      this.educationDetail.controls[0]
        .get("currentlyPursued")
        .patchValue(this.infoData.educationDetail[0].currentlyPursued);
      this.educationDetail.controls[0]
        .get("startMonth")
        .patchValue(this.infoData.educationDetail[0].startMonth);
      this.educationDetail.controls[0]
        .get("startYear")
        .patchValue(this.infoData.educationDetail[0].startYear);
      this.educationDetail.controls[0]
        .get("endMonth")
        .patchValue(this.infoData.educationDetail[0].endMonth);
      this.educationDetail.controls[0]
        .get("endYear")
        .patchValue(this.infoData.educationDetail[0].endYear);
      this.educationDetail.controls[0]
        .get("state")
        .patchValue(this.infoData.educationDetail[0].state);
      this.educationDetail.controls[0]
        .get("city")
        .patchValue(this.infoData.educationDetail[0].city);
      this.educationDetail.controls[0]
        .get("zipcode")
        .patchValue(this.infoData.educationDetail[0].zipcode);
      this.educationDetail.controls[0]
        .get("street")
        .patchValue(this.infoData.educationDetail[0].street);
      this.educationDetail.controls[0]
        .get("country")
        .patchValue(this.infoData.educationDetail[0].country);
      this.educationDetail.controls[0]
        .get("speciality")
        .patchValue(this.infoData.educationDetail[0].speciality);
    }

    if (this.infoData.nonApplicable == "true") {
      this.isCollapsed = true;
      this.personalInfoForm.get("nonApplicable").setValue(true);
    } else if (this.infoData.nonApplicable == "false") {
      if (this.infoData.physicianData != null) {
        this.conditions = this.infoData.physicianData.conditions;
        this.privatePay = this.infoData.physicianData.privatePay;
        this.insurance = this.infoData.physicianData.insurance;
        this.patientAcceptance = this.infoData.physicianData.patientAcceptance;
      }
      this.isCollapsed = false;
      this.personalInfoForm.get("nonApplicable").setValue(false);
    }

    // setting the the length of workexperience in arbitrary constant
    this.commonVariables.numberOfExperience =
      this.infoData.workExperience.length;
    this.searchData.setCommonVariables(this.commonVariables);

    var a = this.infoData.workExperience.findIndex((x) => x.badge == true);
    this.infoData.workExperience.forEach((ele) => {
      if (ele.badge == true) {
        this.commonVariables.expId = ele.expId;
        this.searchData.setCommonVariables(this.commonVariables);
      }
    });

    if (a != "-1") {
      this.commonVariables.noOrgSelected = false;
      this.commonVariables.showThisOrg = false;
      this.commonVariables.orgSelected = true;
      this.commonVariables.currentIndex = a;
      this.searchData.setCommonVariables(this.commonVariables);
      this.currentIndex = a;
      this.searchData.setCurrentOrg(a);
      this.hide = true;
    } else if (a == "-1") {
      this.commonVariables.noOrgSelected = true;
      this.commonVariables.showThisOrg = false;
      this.commonVariables.orgSelected = false;
      this.commonVariables.currentIndex = null;
      this.searchData.setCommonVariables(this.commonVariables);
      this.searchData.setCurrentOrg(null);
      this.hide = false;
    }

    this.commonVariables.orgIdList = [];

    this.infoData.workExperience.forEach((ele) => {
      if (ele.currentOrganization == true) {
        var data: any = {};
        data.organisationId = ele.organisationId;
        data.expId = ele.expId;
        this.commonVariables.orgIdList.push(data);
      }
      this.searchData.setCommonVariables(this.commonVariables);
    });

    var b = this.infoData.educationDetail.findIndex(
      (x) => x.showThisOnProfile == true
    );
    if (b != "-1") {
      this.commonVariables.currentInstitute = true;
      this.searchData.setCommonVariables(this.commonVariables);
      this.curIndex = b;
      this.searchData.setCurrentInst(b);
      this.hide1 = true;
    } else {
      this.commonVariables.currentInstitute = false;
      this.searchData.setCommonVariables(this.commonVariables);
      this.searchData.setCurrentInst(null);
      this.hide1 = false;
    }
    this.commonVariables.numberOfExperience =
      this.infoData.workExperience.length;
    this.searchData.setCommonVariables(this.commonVariables);
    this.infoData.workExperience.forEach((ele) => {
      if (this.infoData.workExperience.length > 1) {
        if (ele.badge == true) {
          this.experelement.title = ele.title;
          this.experelement.zipcode = ele.zipcode;
          this.experelement.organisationName = ele.organisationName;
          this.experelement.currentOrganization = ele.currentOrganization;
          this.experelement.startMonth = ele.startMonth;
          this.experelement.startYear = ele.startYear;
          this.experelement.state = ele.state;
          this.experelement.city = ele.city;
          this.experelement.country = ele.country;
        }
      } else if (this.infoData.workExperience.length == 1) {
        this.infoData.workExperience.forEach((ele) => {
          this.experelement.title = ele.title;
          this.experelement.zipcode = ele.zipcode;
          this.experelement.organisationName = ele.organisationName;
          this.experelement.currentOrganization = ele.currentOrganization;
          this.experelement.startMonth = ele.startMonth;
          this.experelement.startYear = ele.startYear;
          this.experelement.state = ele.state;
          this.experelement.city = ele.city;
          this.experelement.country = ele.country;
        });
      }
    });
    this.infoData.educationDetail.forEach((ele) => {
      this.commonVariables.numberOfEducation =
        this.infoData.educationDetail.length;
      this.searchData.setCommonVariables(this.commonVariables);
      if (this.infoData.educationDetail.length > 1) {
        if (ele.showThisOnProfile == true) {
          this.commonVariables.institutionId = ele.institutionId;
          this.commonVariables.eduId = ele.eduId;
          this.searchData.setCommonVariables(this.commonVariables);
          this.educationElement.institutionId = ele.institutionId;

          this.educationElement.schoolName = ele.schoolName;
          this.educationElement.speciality = ele.speciality;
          this.educationElement.street = ele.street;
          this.educationElement.zipcode = ele.zipcode;
          this.educationElement.currentlyPursued = ele.currentlyPursued;
          this.educationElement.startMonth = ele.startMonth;
          this.educationElement.startYear = ele.startYear;
          this.educationElement.state = ele.state;
          this.educationElement.city = ele.city;
          this.educationElement.country = ele.country;
        }
      } else if (this.infoData.educationDetail.length == 1) {
        this.commonVariables.institutionId = ele.institutionId;
        this.commonVariables.eduId = ele.eduId;
        this.searchData.setCommonVariables(this.commonVariables);

        this.educationElement.schoolName = ele.schoolName;
        this.educationElement.speciality = ele.speciality;
        this.educationElement.street = ele.street;
        this.educationElement.zipcode = ele.zipcode;
        this.educationElement.currentlyPursued = ele.currentlyPursued;
        this.educationElement.startMonth = ele.startMonth;
        this.educationElement.startYear = ele.startYear;
        this.educationElement.state = ele.state;
        this.educationElement.city = ele.city;
        this.educationElement.country = ele.country;
      }
    });


    if (
      this.infoData.socialPresence != null && this.infoData.socialPresence.twitter != null &&
      this.infoData.socialPresence.twitter != undefined
    ) {
      this.twitter = this.infoData.socialPresence.twitter;
    }

    if (
      this.infoData.socialPresence != null && this.infoData.socialPresence.alternamePageLink != undefined &&
      this.infoData.socialPresence.alternamePageLink != null
    ) {
      this.alternamePageLink = this.infoData.socialPresence.alternamePageLink;
    }

    if (
      this.infoData.socialPresence != null && this.infoData.socialPresence.blogURL != undefined &&
      this.infoData.socialPresence.blogURL != null
    ) {
      this.blogURL = this.infoData.socialPresence.blogURL;
    }

    if (
      this.infoData.socialPresence != null && this.infoData.socialPresence.facebook != undefined &&
      this.infoData.socialPresence.facebook != null
    ) {
      this.facebook = this.infoData.socialPresence.facebook;
    }

    if (
      this.infoData.socialPresence != null && this.infoData.socialPresence.linkedin != undefined &&
      this.infoData.socialPresence.linkedin != null
    ) {
      this.linkedin = this.infoData.socialPresence.linkedin;
    }

    //checking if current org in selected for med & admin users
    var c = this.infoData.workExperience.findIndex(
      (x) => x.currentOrganization == true
    );
    // //// console.log(c)
    // //// console.log("kjdhskfsjdhfksjdfh")
    var e = this.infoData.workExperience.findIndex((x) => x.badge == true);
    if (
      this.commonVariables.localUser == true &&
      (this.infoData.userType == "HEALTHCARE" || this.infoData.userType == "adminPersonnel" || this.infoData.userType == "Other") &&
      (c == "-1" || e == "-1") &&
      this.infoData.workExperience.length > 1
    ) {

      this.selectOrgModalShown = true;

      //getting list of current orgs
      this.util.startLoader();
      setTimeout(() => {
        this.currentOrgList = [];

        this.infoData.workExperience.forEach((ele) => {
          var obj: any = {};
          obj.organisationId = ele.organisationId;
          obj.chooseCurrentOrg = ele.organisationName;
          obj.city = ele.city;
          obj.state = ele.state;
          obj.country = ele.country;
          // obj.countryName = ele.countryName
          obj.street = ele.street && ele.street !== null ? ele.street : null;
          this.currentOrgList.push(obj);
        });
      }, 600);
      this.util.stopLoader();
    } else if (
      this.commonVariables.localUser == true &&
      (this.infoData.userType == "HEALTHCARE" ||
        this.infoData.userType == "adminPersonnel" ||
        this.infoData.userType == "Other") &&
      (c == "-1" || e == "-1") &&
      this.infoData.workExperience.length == 1
    ) {
      this.indexOne = true;
      this.workModalShown = true;
      this.mandateWork();
      this.workExperience.controls.forEach((ele) => {
        ele.get("currentOrganization").setValidators([Validators.requiredTrue]);
        ele.get("currentOrganization").updateValueAndValidity();
      });
      this.workModalShown = true;
      this.workExperience.controls[0]
        .get("title")
        .patchValue(this.infoData.workExperience[0].title);
      this.workExperience.controls[0]
        .get("organisationName")
        .patchValue(this.infoData.workExperience[0].organisationName);
      this.workExperience.controls[0]
        .get("organisationId")
        .patchValue(this.infoData.workExperience[0].organisationId);
      this.workExperience.controls[0].get("userId").patchValue(this.userId);
      this.workExperience.controls[0]
        .get("expId")
        .patchValue(this.infoData.workExperience[0].expId);
      this.workExperience.controls[0]
        .get("currentOrganization")
        .patchValue(this.infoData.workExperience[0].currentOrganization);
      this.workExperience.controls[0]
        .get("startMonth")
        .patchValue(this.infoData.workExperience[0].startMonth);
      this.workExperience.controls[0]
        .get("timeZone")
        .patchValue(this.infoData.workExperience[0].timeZone);
      this.workExperience.controls[0]
        .get("startYear")
        .patchValue(this.infoData.workExperience[0].startYear);
      this.workExperience.controls[0]
        .get("endMonth")
        .patchValue(this.infoData.workExperience[0].endMonth);
      this.workExperience.controls[0]
        .get("endYear")
        .patchValue(this.infoData.workExperience[0].endYear);
      this.workExperience.controls[0]
        .get("state")
        .patchValue(this.infoData.workExperience[0].state);
      this.workExperience.controls[0]
        .get("city")
        .patchValue(this.infoData.workExperience[0].city);
      this.workExperience.controls[0]
        .get("zipcode")
        .patchValue(this.infoData.workExperience[0].zipcode);
      this.workExperience.controls[0]
        .get("badge")
        .patchValue(this.infoData.workExperience[0].badge);
      this.workExperience.controls[0]
        .get("country")
        .patchValue(this.infoData.workExperience[0].country);
    }

    if (
      (this.infoData.userType == "HEALTHCARE" ||
        this.infoData.userType == "adminPersonnel" ||
        this.infoData.userType == "Other") &&
      this.infoData.workExperience.length == 0 &&
      this.commonVariables.localUser == true
    ) {
      this.indexZero = true;
      this.workModalShown = true;
      this.workExperience.controls = [];
      this.addWorkExperience();
      this.mandateWork();
      this.workExperience.controls.forEach((ele) => {
        ele.get("currentOrganization").setValidators([Validators.requiredTrue]);
        ele.get("currentOrganization").updateValueAndValidity();
      });
    }
    this.ar();
    this.eduAr();
    // sorting by CurrentOrganization
    (this.infoData.workExperience as Array<WorkExperience>)
      .sort((a, b) => Number(b.currentOrganization) - Number(a.currentOrganization))
    // console.log("sorted" , this.infoData.workExperience);

  }

  get createControl() {
    return this.currentOrgForm.controls;
  }

  get pursueControl() {
    return this.currentPursueForm.controls;
  }
  // sorting work experience array  in descending order with current organization on top
  ar() {
    this.infoData.workExperience.sort((a, b) => {
      let st = parseInt(a.startYear);
      let end = parseInt(b.startYear);
      return end - st;
    });

    var b = this.infoData.workExperience.findIndex(
      (x) => x.currentOrganization == true
    );
    if (b != "-1") {
      this.infoData.workExperience.sort(function (x, y) {
        return x.currentOrganization == true
          ? -1
          : y.currentOrganization == true
            ? 1
            : 0;
      });
    }

    var a = this.infoData.workExperience.findIndex((x) => x.badge == true);
    if (a != "-1") {
      this.infoData.workExperience.sort(function (x, y) {
        return x.badge == true ? -1 : y.badge == true ? 1 : 0;
      });
    }

    // this.infoData.workExperience.forEach((ele) => {
    //   if (ele.badge == false && ele.currentOrganization == false) {

    //   }
    // });
  }

  // sorting education array in descending order with current institute on top
  eduAr() {
    if (
      this.infoData.educationDetail != undefined &&
      this.infoData.educationDetail != null
    ) {
      this.infoData.educationDetail = this.infoData.educationDetail.sort(
        (a, b) => {
          let st = parseInt(a.startYear);
          let end = parseInt(b.startYear);
          return end - st;
        }
      );
      var a = this.infoData.educationDetail.findIndex(
        (x) => x.currentlyPursued == true
      );
      if (a != "-1") {
        this.infoData.educationDetail.sort(function (x, y) {
          return x.currentlyPursued == true
            ? -1
            : y.currentlyPursued == true
              ? 1
              : 0;
        });
      }
      var b = this.infoData.educationDetail.findIndex(
        (x) => x.showThisOnProfile == true
      );
      if (b != "-1") {
        this.infoData.educationDetail.sort(function (x, y) {
          return x.showThisOnProfile == true
            ? -1
            : y.showThisOnProfile == true
              ? 1
              : 0;
        });
      }
    }
  }
  getQuerParams() {
    this.userId = this.queryParamValue.userId;
    this.validateUser();
  }

  validateUser() {
    if (this.userId == localStorage.getItem("userId")) {
      // this.localUser = true
      this.commonVariables.localUser = true;
      this.searchData.setCommonVariables(this.commonVariables);
      this.query();
    } else {
      // this.localUser = false
      this.commonVariables.localUser = false;
      this.searchData.setCommonVariables(this.commonVariables);
      this.fetchForeignUser();
    }
  }

  fetchForeignUser() {
    var data: any = {};
    data.userId = this.userId;
    data.requestedBy = localStorage.getItem("userId");
    this.util.startLoader();
    this.api.create("user/home", data).subscribe((res) => {
      if (res) {
        this.util.stopLoader();
        this.searchResponse = res;
        this.validateConnection();
      }
    }, err => {
      this.util.stopLoader();

    });

  }

  // getPhyTitle() {
  //   // this.util.startLoader()
  //   this.api
  //     .query("care/list/values/MEDICAL_PROFESSIONAL_TITLE")
  //     .subscribe((res) => {
  //       if (res) {
  //         if (res.listItems && res.listItems != null) {
  //           // this.util.stopLoader()
  //           res.listItems.forEach((ele) => {
  //             this.phyTitleList.push(ele.item);
  //             this.studentTitles.push(ele.item);
  //           });
  //         }
  //       }

  //       // //// console.log(this.phyTitleList)
  //       // //// console.log("This is healthcare response")
  //     }, err => {
  //       this.util.stopLoader();
  //     });
  // }

  accept() {
    var data: any = {};
    data.userId = localStorage.getItem("userId");
    data.connectedUser = this.userId;
    data.status = "CONNECTED";
    this.util.startLoader();
    this.api.create("user/connect/accept", data).subscribe((res) => {
      if (res.code == "00000") {
        this.util.stopLoader();
        this.connected = true;
        this.requestSent = false;
        this.requestPending = false;
        this.notConnected = false;

        //successfully accepted
        Swal.fire({
          icon: "success",
          title: "Request accepted successfully",
          // title: "Connection Request",
          showConfirmButton: false,
          timer: 2000,
        });
      } else if (res.code == "88889") {
        this.util.stopLoader();
        this.connected = false;
        this.requestSent = false;
        this.requestPending = false;
        this.notConnected = true;
        //some error occured
        // setTimeout(function () {
        //   Swal.fire("Oops! Something went wrong!");
        // }, 500);
        Swal.fire({
          icon: "info",
          title: "Oops...",
          text: "Connection accept request failed. Please try after a while.",
          showConfirmButton: false,
          timer: 4000,
        });
      }
    }, err => {
      this.util.stopLoader()
      if (err.status == 500) {
        this.util.stopLoader();
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: 'Something went wrong while accepting the request. Please, try again later.',
          showDenyButton: false,
          confirmButtonText: `ok`,
        })
      }
    });
  }

  reject() {
    var data: any = {};
    data.userId = localStorage.getItem("userId");
    data.connectedUser = this.userId;
    data.status = "REJECTED";
    this.util.startLoader();
    this.api.create("user/connect/accept", data).subscribe((res) => {
      if (res.code == "00000") {
        this.util.stopLoader();
        this.notConnected = true;
        this.connected = false;
        this.requestSent = false;
        this.requestPending = false;

        Swal.fire({
          position: "center",
          icon: "success",
          title: "Connection Request",
          text: "Connection request rejected",
          showConfirmButton: false,
          timer: 2000,
        })
      } else if (res.code == "88889") {
        this.util.stopLoader();
        this.notConnected = true;
        this.connected = false;
        this.requestSent = false;
        this.requestPending = false;

        Swal.fire({
          position: "center",
          icon: "success",
          title: "Oops...",
          text: "Something went wrong. Please try after some time.",
          showConfirmButton: false,
          timer: 2000,
        })
      }
    }, err => {
      this.util.stopLoader()
      if (err.status == 500) {
        this.util.stopLoader();
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: 'Something went wrong while rejecting the request. Please, try again later.',
          showDenyButton: false,
          confirmButtonText: `ok`,
        })
      }
    });
  }

  cert(event, value) {
    if (event == "on" && value == "true") {
      this.infoData.userPrivacy.certification = true;
      this.util.startLoader();
      this.api
        .create("user/updateUserPrivacy", this.infoData)
        .subscribe((res) => {
          this.util.stopLoader();
        }, err => {
          this.util.stopLoader();

        });

    } else if (event == "on" && value == "false") {
      this.infoData.userPrivacy.certification = false;
      this.util.startLoader();
      this.api
        .create("user/updateUserPrivacy", this.infoData)
        .subscribe((res) => {
          this.util.stopLoader();
        }, err => {
          this.util.stopLoader();

        });

    }
  }

  edu(event, value) {
    if (event == "on" && value == "true") {
      this.infoData.userPrivacy.educationDetail = true;
      this.util.startLoader();
      this.api
        .create("user/updateUserPrivacy", this.infoData)
        .subscribe((res) => {
          this.util.stopLoader();
        }, err => {
          this.util.stopLoader();

        });

    } else if (event == "on" && value == "false") {
      this.infoData.userPrivacy.educationDetail = false;
      this.util.startLoader();
      this.api
        .create("user/updateUserPrivacy", this.infoData)
        .subscribe((res) => {
          this.util.stopLoader();
        }, err => {
          this.util.stopLoader();

        });

    }
  }

  work(event, value) {
    if (event == "on" && value == "true") {
      this.infoData.userPrivacy.workExperience = true;
      this.util.startLoader();
      this.api
        .create("user/updateUserPrivacy", this.infoData)
        .subscribe((res) => {
          this.util.stopLoader();
        }, err => {
          this.util.stopLoader();

        });

    } else if (event == "on" && value == "false") {
      this.infoData.userPrivacy.workExperience = false;
      this.util.startLoader();
      this.api
        .create("user/updateUserPrivacy", this.infoData)
        .subscribe((res) => {
          this.util.stopLoader();
        }, err => {
          this.util.stopLoader();

        });

    }
  }

  social(event, value) {
    if (event == "on" && value == "true") {
      this.infoData.userPrivacy.socialInfluence = true;
      this.util.startLoader();
      this.api
        .create("user/updateUserPrivacy", this.infoData)
        .subscribe((res) => {
          this.util.stopLoader();
        }, err => {
          this.util.stopLoader();

        });

    } else if (event == "on" && value == "false") {
      this.infoData.userPrivacy.socialInfluence = false;
      this.util.startLoader();
      this.api
        .create("user/updateUserPrivacy", this.infoData)
        .subscribe((res) => {
          this.util.stopLoader();
        }, err => {
          this.util.stopLoader();

        });

    }
  }

  community(event, value) {
    if (event == "on" && value == "true") {
      this.infoData.userPrivacy.communities = true;
      this.communityPrivacy = true;
      this.util.startLoader();
      this.api
        .create("user/updateUserPrivacy", this.infoData)
        .subscribe((res) => {
          this.util.stopLoader();
        }, err => {
          this.util.stopLoader();

        });

    } else if (event == "on" && value == "false") {
      this.infoData.userPrivacy.communities = false;
      this.communityPrivacy = false;
      this.util.startLoader();
      this.api
        .create("user/updateUserPrivacy", this.infoData)
        .subscribe((res) => {
          this.util.stopLoader();
        }, err => {
          this.util.stopLoader();

        });

    }
  }

  decline(): void {
    this.modalRef.hide();
    this.phyPrompt = false;
    this.searchData.setBooleanValue(false);
    // this.similarOrgFlag = false
    this.isSuperAdmin = false
    this.isSuperAdmin1 = false
    this.commonVariables.similarOrgFlag = false
    this.searchData.setCommonVariables(this.commonVariables)
    this.workExperience.controls[0].get('currentOrganization').enable()
    // this.experEditFlag = false
    // this.experAddFlag = false
    // this.certEditFlag = false
    // this.certAddFlag = false
    //  this.eduEditFlag = false
    // this.eduAddFlag = false
    // this.ar()
    // this.eduAr()
    //canceling the uploaded photo but keeping the submitted one
    this.img = {};
    this.img.src = AppSettings.ServerUrl + "download/" + this.infoData.photo;
    // this.getData()
    if (this.commonVariables.previousFlag == true) {
      this.reload('personalProfile');
    }
  }

  validateConnection() {
    this.userId = this.searchResponse.userId;
    if (this.searchResponse.connected == "true") {
      this.connected = true;
    } else {
      this.connected = false;
    }
    // //// console.log("request sent checking")
    // //// console.log(this.searchResponse.connectionStatus)

    if (this.searchResponse.connectionStatus == "REQUEST_SENT") {
      this.requestSent = true;
      this.connected = false;
      this.notConnected = false;
      this.requestPending = false;
    } else if (this.searchResponse.connectionStatus == "NOT_CONNECTED") {
      this.notConnected = true;
      this.connected = false;
      this.requestPending = false;
      this.requestSent = false;
    } else if (this.searchResponse.connectionStatus == "REQUEST_PENDING") {
      this.requestPending = true;
      this.connected = false;
      this.notConnected = false;
      this.requestSent = false;
    } else if (this.searchResponse.connectionStatus == "CONNECTED") {
      this.connected = true;
      this.notConnected = false;
      this.requestPending = false;
      this.requestSent = false;
    }
    this.query();
  }

  connect() {
    var data: any = {};
    data.userId = this.userId;
    data.requestedBy = localStorage.getItem("userId");
    this.util.startLoader();
    this.api.create("user/connect", data).subscribe((res) => {
      if (res.code == "00000") {
        this.util.stopLoader();
        //message to show connect request is sent successfully
        this.requestSent = true;
        this.notConnected = false;
        this.connected = false;
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
        this.requestSent = false;
        this.notConnected = true;
        this.connected = false;
        Swal.fire({
          icon: "info",
          title: "Request failed",
          text: "Request coundn't be sent now. Please try after some time.",
          showConfirmButton: false,
          timer: 3000,
        });
      }
    }, err => {
      this.util.stopLoader()
      if (err.status == 500) {
        this.util.stopLoader();
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: 'Something went wrong while sending the request. Please, try again later.',
          showDenyButton: false,
          confirmButtonText: `ok`,
        })
      }
    });
  }

  sortConfigCert: TypeaheadOrder = {
    direction: "desc",
    field: "institutionName",
  };


  onChangeCertificate(event, index) {
    this.getCertFormGroup(index).patchValue({
      certificationId: event.item.certificationId
    });
  }

  // cancelConnectionRequest(userId: String){
  cancelConnectionRequest() {
    let cancelData: any = {};
    // cancelData.userId = userId
    cancelData.userId = this.userId;
    // //// console.log('connData.userId', cancelData.userId)
    this.util.startLoader();
    this.api.create("user/connect/cancel", cancelData).subscribe((res) => {
      // //// console.log('Cancel Connection : ', res);
      if (res.code === "00000") {
        this.util.stopLoader();
        // //// console.log('Connect request cancelled successfully');
        // this.user.connectionStatus="NOT_CONNECTED";
        // this.initCard();
        this.requestSent = false;
        this.notConnected = true;
        this.connected = false;
        Swal.fire({
          icon: "success",
          title: "Connection request cancelled",
          showConfirmButton: false,
          timer: 2000,
        });
      } else if (res.code === "88888") {
        this.util.stopLoader();
        // //// console.log('Unable to Cancel connection');
        Swal.fire({
          icon: "info",
          title: "Cancel request failed",
          text: "Unable to cancel connection. Please try after some time.",
          showConfirmButton: false,
          timer: 4000,
        });
      }
    }, err => {
      this.util.stopLoader()
      if (err.status == 500) {
        this.util.stopLoader();
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: 'Something went wrong while cancelling the request. Please, try again later.',
          showDenyButton: false,
          confirmButtonText: `ok`,
        })
      }
    });
  }

  removeConnection() {
    let connData: any = {};
    connData.userId = this.userId;
    this.util.startLoader();

    this.api.create("user/connect/remove", connData).subscribe((res) => {

      if (res.code === "00000") {
        this.util.stopLoader();

        this.requestSent = false;
        this.notConnected = true;
        this.connected = false;

        Swal.fire({
          icon: "success",
          title: "Connection removed successfully",
          showConfirmButton: false,
          timer: 2000,
        });

      } else if (res.code === "88888") {
        this.util.stopLoader();

        Swal.fire({
          icon: "info",
          title: "Unable to remove connection. Please try after some time.",
          showConfirmButton: false,
          timer: 4000,
        });
      }
    }, err => {
      this.util.stopLoader()
      if (err.status == 500) {
        this.util.stopLoader();
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: 'Something went wrong while removing the connection. Please, try again later.',
          showDenyButton: false,
          confirmButtonText: `ok`,
        })
      }
    });
  }

  sendMessage(userId: String) {
    var userData: any = {};
    userData.userId = this.userId;
    userData.groupId = this.userId;
    userData.type = 'USER'
    this.router.navigate(["message"], { queryParams: userData });
  }

  fileChangeEvent(event, popupName): void {
    if (event && event.target && event.target.files && event.target.files[0]) {
      this.imageChangedEvent = event;
      this.fileUploadName = event.target.files[0].name;
      // $("#profileimage").val
      const acceptedImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
      if (!acceptedImageTypes.includes(event.target.files[0].type)) {
        Swal.fire('', 'Please upload the correct file type   (Only .jpg, .png, .jpeg)', 'info');
        this.myFileInput.nativeElement.value = "";

        this.modalRef.hide();
      } else {
        this.PopupServicevlaues(popupName);
      }
    }
    // else {
    //   $("#profileimage").val("");
    // }
  }

  //Dev's code
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    // //// console.log("this.v-- "+this.croppedImage.name);
    // //// console.log("this.croppedImage-- "+this.croppedImage);

    const byteString = window.atob(
      event.base64.replace(/^data:image\/(png|jpeg|jpg);base64,/, "")
    );
    // const byteString = window.atob(event.base64);
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
  PopupServicevlaues(templateNested: TemplateRef<any>) {
    this.modalRef1 = this.modalService.show(templateNested, {
      animated: true,
      backdrop: "static",
      class: "second",
      keyboard: false,
    });
  }

  // @ViewChild('tagModal', { static: false }) tagModal: ModalDirective;
  // workModalShown = false;

  showModal(): void {
    this.workModalShown = true;
    //  this.modalRef = this.modalService.show( this.backdropConfig);
  }

  hideModal(): void {
    this.autoShownModal.hide();
  }

  onHideWrkMandTemp(): void {
    this.workModalShown = false;
    this.workSaveFlag = false;
    if (this.showOtherPrompt == true) {
      this.workModalShown = false;
      this.workSaveFlag = false;
      this.reload('workExperience');
    }
  }

  // showModaledu(): void {
  //   // this.studModalShown = true;
  //   //  this.modalRef = this.modalService.show( this.backdropConfig);
  // }

  hideModaledu(): void {
    this.autoShownModal1.hide();
  }

  hideModalSelectOrg(): void {
    this.autoShownModal2.hide();
  }

  hideModalCurrentPursue(): void {
    this.autoShownModal3.hide();
  }

  onHideSelectOrg(): void {
    this.selectOrgModalShown = false;
    // this.workSaveFlag = false
  }

  showSelectOrgModal(): void {
    this.selectOrgModalShown = true;
    //  this.modalRef = this.modalService.show( this.backdropConfig);
  }

  onHideSelectEdu(): void {
    // this.selectEduModalShown = false;
    // this.workSaveFlag = false
  }

  showSelectEduModal(): void {
    // this.selectEduModalShown = true;
    //  this.modalRef = this.modalService.show( this.backdropConfig);
  }

  onHideEduMandTemp(): void {
    // this.studModalShown = false;
    this.eduSaveFlag = false;
  }

  closeImage() {
    const formData: FormData = new FormData();
    //this.imageChangedEvent = undefined;
    this.fileUploadName = undefined;
    this.modalRef1.hide();
    // $("#profileimage").val("");
    this.img.src = AppSettings.ServerUrl + "download/" + this.photoId;
    // this.myFileInput.nativeElement.value = '';
    $("#profileimage").val("");
  }

  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }
  setModalClass() {
    this.valueWidth = !this.valueWidth;
    const modalWidth = this.valueWidth ? "modal-lg" : "modal-sm";
    this.modalRef.setClass(modalWidth);
  }

  validatePrivacy() {
    // //// console.log("privacy checking")
    // //// console.log(this.infoData.userPrivacy.workExperience)
    if (this.infoData.userPrivacy.workExperience == true) {
      this.workPrivacy = true;
    } else {
      this.workPrivacy = false;
    }

    if (this.infoData.userPrivacy.educationDetail == true) {
      this.eduPrivacy = true;
    } else {
      this.eduPrivacy = false;
    }

    if (this.infoData.userPrivacy.certification == true) {
      this.certPrivacy = true;
    } else {
      this.certPrivacy = false;
    }

    if (this.infoData.userPrivacy.socialInfluence == true) {
      this.socialPrivacy = true;
    } else {
      this.socialPrivacy = false;
    }

    if (this.infoData.userPrivacy.communities == true) {
      this.communityPrivacy = true;
    } else {
      this.communityPrivacy = false;
    }

    if (this.infoData.userPrivacy.reviews == true) {
      this.reviewPrivacy = true;
    } else {
      this.reviewPrivacy = false;
    }
  }

  getCountry() {
    this.util.startLoader();
    this.api.query("country/getAllCountries").subscribe((res) => {
      if (res) {
        this.util.stopLoader();
        res.forEach((ele) => {
          this.countryList.push(ele);
        });
      }
    }, err => {
      this.util.stopLoader();
    });
  }

  saveCurrentOrg() {
    this.currentOrgSaveFlag = true;
    var data: any = {};

    //  //// console.log('data')
    //  //// console.log(data)
    if (this.currentOrgForm.valid) {
      this.infoData.workExperience.forEach((ele) => {
        if (this.currentOrganisationId == ele.organisationId) {
          data.title = ele.title;
          data.expId = ele.expId;
          data.organisationName = ele.organisationName;
          data.organisationId = ele.organisationId;
          data.userId = this.userId;
          data.currentOrganization = true;
          data.startMonth = ele.startMonth;
          data.badge = true;
          data.startYear = ele.startYear;
          data.endMonth = ele.endMonth;
          data.endYear = ele.endYear;
          data.state = ele.state;
          data.city = ele.city;
          data.zipcode = ele.zipcode;
          data.country = ele.country;
        }
      });
      this.api.updatePut("user/v1/workexperience", data).subscribe((res) => {
        if (res.code == "00000") {
          this.util.stopLoader();
          this.selectOrgModalShown = false;
          Swal.fire({
            icon: "success",
            title: "Changes saved successfully",
            showConfirmButton: false,
            timer: 2000,
          });
          this.reload('workExperience');
        } else if (res.code == "99998") {
          this.util.stopLoader();
          const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
              confirmButton: 'btn btn-success',
              cancelButton: 'btn btn-danger'
            },
            buttonsStyling: false
          });

          swalWithBootstrapButtons.fire({
            title: 'Oops..',
            text: "You already have a current organization. Changing your current organization to a new work place requires you to authenticate a new business email address for the organization. Would you like to proceed?",
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            reverseButtons: true
          })
            .then((result) => {
              if (result.isConfirmed) {
                this.commonVariables.emailDomainValidation
              } else if (result.isDenied) {

              }
            });
          this.workSaveFlag = false;
          // this.workExperience.controls[0]
          //   .get("organisationName")
          //   .disable();
        } else if (res.code == "99996") {
          this.util.stopLoader();
          Swal.fire({
            title: "Oops..",
            text: "Sorry, one current organization is at least needed for your user type.",
            icon: "error",
            // timer: 3000,
            confirmButtonText: "Ok",
            // denyButtonText: "No"
          }).then((result) => {
            if (result.isConfirmed) {
              this.workExperience.controls[0].patchValue({
                currentOrganization: false,
                badge: false
              })
            }
          });
        } else if (res.code == "10001") {
          this.util.stopLoader();
          const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
              confirmButton: "btn btn-success",
              denyButton: 'btn btn-danger'
            },
            buttonsStyling: false,
          });
          swalWithBootstrapButtons
            .fire({
              title: "Are you sure you want to change?",
              text: "You are the super admin to the other current organization in your work experience. Changing the current organization will delete the business page of the organization. Would you like to proceed?",
              icon: "info",
              // timer: 3000,
              showDenyButton: true,
              confirmButtonText: "Yes",
              denyButtonText: "No"
            })
            .then((result) => {
              if (result.isConfirmed) {
                var expp = this.workExperience.getRawValue()[0]
                expp.action = "APPROVED"
                this.api
                  .create("user/v1/workexperience", expp)
                  .subscribe((res) => {
                    Swal.fire({
                      title: "Work Experience Updated",
                      text: "Changes made successfully and updated your work experience.",
                      icon: "success",
                      timer: 2000,
                      showConfirmButton: false
                    }).then(() => {
                      this.reload('personalProfile')
                      this.modalService.hide(1)
                    })
                  })
              } else if (result.isDenied) {
              }
            });
          this.workSaveFlag = false;
        } else if (res.code == "10002") {
          this.util.stopLoader();
          Swal.fire({
            text: "You are the super admin of the business page. You have to transfer super admin rights to other members before changing your current organization.",
            title: "Cannot change current organization",
            icon: "error",
            confirmButtonText: "Ok",
          })
        }
        else {
          this.util.stopLoader()
          const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
              confirmButton: "btn btn-success",
              // cancelButton: 'btn btn-danger'
            },
            buttonsStyling: false,
          });
          swalWithBootstrapButtons
            .fire({
              title: "Oops..",
              text: res["message"],
              icon: "error",
              // timer: 3000,
              confirmButtonText: "OK",
            })
            .then((result) => {
              if (result.isConfirmed) {
              }
            });
          this.workSaveFlag = false;
          this.workExperience.controls[0]
            .get("organisationName")
            .disable();
        }
      }, err => {
        this.util.stopLoader();
      });
    }
  }

  onCurrentPursueChosen(event) {
    //// console.log(event.item);
    if (event.item.institutionId != null) {
      this.currentPursueEduId = event.item.institutionId;
    }
  }

  currentPursueSaveFlag: boolean = false;
  edudata: any = {};
  saveCurrentPursue() {
    this.currentPursueSaveFlag = true;
    if (this.currentPursueForm.valid) {
      this.infoData.educationDetail.forEach((ele) => {
        if (this.currentPursueEduId == ele.institutionId) {
          this.edudata.schoolName = ele.schoolName;
          this.edudata.institutionId = ele.institutionId;
          this.edudata.eduId = ele.eduId;
          this.edudata.userId = this.userId;
          this.edudata.degree = ele.degree;
          this.edudata.showThisOnProfile = ele.showThisOnProfile;
          this.edudata.currentlyPursued = true;
          this.edudata.showThisOnProfile = true;
          this.edudata.startMonth = ele.startMonth;
          this.edudata.startYear = ele.startYear;
          this.edudata.endMonth = ele.endMonth;
          this.edudata.endYear = ele.endYear;
          this.edudata.city = ele.city;
          this.edudata.street = ele.street;
          this.edudata.state = ele.state;
          this.edudata.zipcode = ele.zipcode;
          this.edudata.country = ele.country;
          this.edudata.speciality = ele.speciality;
        }
      });
      this.util.startLoader();
      this.api
        .updatePut("user/update/education", this.edudata)
        .subscribe((res) => {
          if (res.code == "0000") {
            this.util.stopLoader();
            // this.selectEduModalShown = false;
            Swal.fire({
              icon: "success",
              title: "Changes saved successfully",
              showConfirmButton: false,
              timer: 2000,
            });
            // this.resetData();
            this.reload('education');
          }
        }, err => {
          this.util.stopLoader();
        });
    }
  }

  currentOrganisationId: any;
  currentPursueEduId: any;
  onCurrentOrgChosen(event) {
    this.currentOrganisationId = event.item.organisationId;
  }

  curOrg(event, index) {
    // //// console.log(index)
    if (event.target.checked == true) {
      this.hide = true;
      this.workExperience.controls[index].patchValue({
        currentOrganization: true,
      });
      this.workExperience.controls[index].patchValue({
        endYear: this.currentYear,
      });
      this.workExperience.controls[index].patchValue({ endMonth: null });
      this.infoData.workExperience.forEach((ele) => {
        if (
          ele.badge == true &&
          this.workExperience.value[index].organisationId == ele.organisationId
        ) {
          this.commonVariables.noOrgSelected = true;
          this.searchData.setCommonVariables(this.commonVariables);
        }
      });

      this.workExperience.controls.forEach((ele) => {
        ele.get("endYear").clearValidators();
        ele.get("endYear").updateValueAndValidity();
        ele.get("endMonth").clearValidators();
        ele.get("endMonth").updateValueAndValidity();
      });

      if (this.userType != 'JOB_SEEKER') {
        this.workExperience.controls[0].get('timeZone').setValidators([Validators.required]);
        this.workExperience.controls[0].get('timeZone').updateValueAndValidity()
      }
      this.commonVariables.noOrgSelected = false;
      this.searchData.setCommonVariables(this.commonVariables);
      this.showThisBoolean = true;
      this.workExperience.controls[index].patchValue({ badge: true });

    } else if (event.target.checked == false) {
      // this.currentIndex = null;
      this.workExperience.controls[0].get('timeZone').clearValidators();
      this.workExperience.controls[0].get('timeZone').updateValueAndValidity()

      this.workExperience.controls[index]
        .get("currentOrganization")
        .markAsUntouched();
      this.workExperience.controls[index]
        .get("currentOrganization")
        .updateValueAndValidity();
      this.workExperience.at(0).get('badge').patchValue(false);
      this.infoData.workExperience.forEach((ele) => {
        if (this.workExperience.value[index].organisationId == ele.organisationId) {
          this.commonVariables.noOrgSelected = true;
          this.searchData.setCommonVariables(this.commonVariables);
          this.workExperience.controls[index].patchValue({ badge: false });
          this.showThisBoolean = false;
        }
      });
      this.hide = false;
      this.workExperience.controls[index].patchValue({
        endYear: this.currentYear,
      });
      this.workExperience.controls[index].patchValue({ endMonth: null });
      // if(!this.studentFlag){
      // if (!this.commonVariables.studentFlag) {
      this.workExperience.controls.forEach((ele) => {
        ele.get("endMonth").setValidators([Validators.required]);
        ele.get("endMonth").updateValueAndValidity();
        ele.get("endYear").setValidators([Validators.required]);
        ele.get("endYear").updateValueAndValidity();
      });
      // }
    }
    this.validateShowOnProf(this.workExperience.controls[0].get("badge").value);

  }

  currentlyPursued(event, index) {
    if (event.target.checked == true) {
      this.hide1 = true;
      this.educationDetail.controls[index].patchValue({
        currentlyPursued: true,
      });
      this.educationDetail.controls[index].patchValue({
        endYear: this.currentYear,
      });
      this.educationDetail.controls[index].patchValue({ endMonth: null });
      this.infoData.educationDetail.forEach((ele) => {
        if (
          ele.showThisOnProfile == true &&
          this.educationDetail.value[index].institutionId == ele.institutionId
        ) {
          this.commonVariables.noEduOrgSelected = true;
          this.searchData.setCommonVariables(this.commonVariables);
        }
      });

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

      this.infoData.educationDetail.forEach((ele) => {
        if (
          this.educationDetail.value[index].organisationId == ele.organisationId
        ) {
          this.commonVariables.noEduOrgSelected = true;
          this.searchData.setCommonVariables(this.commonVariables);
          this.educationDetail.controls[index].patchValue({
            showThisOnProfile: false,
          });
          this.showThisEduBoolean = false;
        }
      });
      this.hide = false;
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
    this.validateEduShowOnProf(
      this.educationDetail.controls[0].get("showThisOnProfile").value
    );
  }

  getCertificationList() {
    this.util.startLoader()
    this.api.query('care/certifications').subscribe(res => {
      if (res) {
        this.certificationList = res
        this.util.stopLoader()
      }
    }, err => {
      this.util.stopLoader();
    })
  }

  notApplicable(event, template: TemplateRef<any>) {
    if (event.target.checked == true) {
      this.isCollapsed = !this.isCollapsed;
      this.infoData.nonApplicable = true;
      let obj: any = {};
      obj.privatePay = "No";
      obj.conditions = null;
      obj.insurance = null;
      obj.patientAcceptance = "No";
      this.infoData.physicianData = obj;
      this.util.startLoader();
      this.api.create("user/saveUser", this.infoData).subscribe((res) => {
        if (res.code == "00000") {
          this.util.stopLoader();
          this.conditions = null;
          this.privatePay = "No";
          this.insurance = null;
          this.patientAcceptance = "No";
        } else if (res.code == "99999") {
          this.util.stopLoader();
          Swal.fire({
            position: "center",
            icon: "info",
            title: "Oops...",
            text: "Sorry, something went wrong. Please try after some time.",
            showConfirmButton: false,
            timer: 3000,
          });

        }
      }, err => {
        this.util.stopLoader()
        if (err.status == 500) {
          this.util.stopLoader();
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: 'Something went wrong while saving your details. Please, try again later.',
            showDenyButton: true,
            timer: 3000,
            confirmButtonText: `ok`,
          })
        }
      });
    } else if (event.target.checked == false) {
      this.physicianForm.patchValue({
        patientAcceptance: "No",
        privatePay: "No",
      });
      this.insuranceSelectedItems = [];
      this.conditionSelectedItems = [];
      this.modalRef = this.modalService.show(template, this.backdropConfig);
      // //// console.log(this.isCollapsed)
      this.isCollapsed = !this.isCollapsed;
      this.infoData.nonApplicable = false;
      // this.api.create("user/saveUser", this.infoData).subscribe((res) => {
      //   this.util.stopLoader();
      //   if (res.code == "00000") {
      //   } else if (res.code == "99999") {
      //   }
      // });
    }
  }


  onChangeCountry(event, value, index) {
    if (this.eperienceForm == undefined) {
      this.createWorkExperience();
      setTimeout(() => {
        this.eperienceForm.get('timeZone').enable();
      }, 1500);

    }
    if (value == "user") {
      this.personalInfoForm.patchValue({
        state: null,
        zipcode: null,
        city: null,
        country: event,
      });
    } else if (value == "edu") {
      this.educationDetail.controls[index].patchValue({
        state: null,
        zipcode: null,
        city: null,
        street: null,
        country: event,
      });
    } else if (value == "work") {
      this.workExperience.controls[index].patchValue({
        state: null,
        zipcode: null,
        city: null,
        // street: null,
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

  timeZonecountryvalues(countryCode) {
    this.workExperience.controls[0].get("timeZone").patchValue(null);

    this.api.query("user/timeZoneByCountryCode/" + countryCode).subscribe((res) => {

      if (res) {
        this.util.stopLoader();
        this.timezoneslist = res.data.zones;

      }
    }, err => {
      this.util.stopLoader();
    });

  }



  onKeyZip(event: any, value, index) {
    if (value == "user") {
      let data: any = {};
      data.countryCode = "US";
      data.zipCode = event.target.value;
      data.stateCode = "";

      if (data.zipCode.length === 5) {
        this.api.create("country/geodetails", data).subscribe((res) => {
          if (res && res != null && res.length > 0 && event.target.value != "") {

            res.forEach((ele) => {
              let cityName = ele.cityName;
              let stateName = ele.stateName;
              this.personalInfoForm.patchValue({
                city: cityName,
                state: stateName,
              });
            });
          } else {

          }
        }, err => {
          this.util.stopLoader()
          if (err.status == 500) {
            this.util.stopLoader();
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: 'Something went wrong while fetching data. Please, try again later.',
              showDenyButton: false,
              confirmButtonText: `ok`,
            })
          }
        });
      } else {
        this.personalInfoForm.patchValue({
          city: null,
          state: null,

        });
      }
    } else if (value == "work") {
      let data: any = {};
      data.countryCode = "US";
      data.zipCode = event.target.value;

      if (data.zipCode.length === 5) {
        this.api.create("country/geodetails", data).subscribe((res) => {
          if (res && res != null && res.length > 0 && event.target.value != "") {

            res.forEach((ele) => {
              let cityName = ele.cityName;
              let stateName = ele.stateName;
              this.workExperience.controls[index].patchValue({
                city: cityName,
                state: stateName,
              });
            });
          } else {

          }
        }, err => {
          this.util.stopLoader()
          if (err.status == 500) {
            this.util.stopLoader();
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: 'Something went wrong while fetching data. Please, try again later.',
              showDenyButton: false,
              confirmButtonText: `ok`,
            })
          }
        });
      } else {
        this.workExperience.controls[index].patchValue({
          city: null,
          state: null,

        });
      }
    } else if (value == "edu") {
      let data: any = {};
      data.countryCode = "US";
      data.zipCode = event.target.value;

      if (data.zipCode.length === 5) {
        this.api.create("country/geodetails", data).subscribe((res) => {
          if (res && res != null && res.length > 0 && event.target.value != "") {

            res.forEach((ele) => {
              let cityName = ele.cityName;
              let stateName = ele.stateName;
              this.educationDetail.controls[index].patchValue({
                city: cityName,
                state: stateName,
              });
            });
          } else {

          }
        }, err => {
          this.util.stopLoader()
          if (err.status == 500) {
            this.util.stopLoader();
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: 'Something went wrong while fetching data. Please, try again later.',
              showDenyButton: false,
              confirmButtonText: `ok`,
            })
          }
        });
      } else {
        this.educationDetail.controls[index].patchValue({
          city: null,
          state: null,
          // street : null
        });
      }
    }
  }

  zipCodeValidaiton(x: number): boolean {
    if (String(x).length > 10) {
      return false;
    }
    return true;
  }

  temp: any = {};
  onChngOrg(value, index) {
    var data = value.organizationName + "/" + value.organizationId;
    this.util.startLoader();
    this.api.query("care/organization/" + data).subscribe((res) => {

      if (res) {
        const organisationSuggestedDetail = res[0]
        this.onChangeCountry(organisationSuggestedDetail.country, 'work', index)
        this.workExperience.controls[index].get('timeZone').enable()
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

              setTimeout(() => {
                this.workExperience.controls[index].patchValue({
                  clientType: res.data.businessModelList[0].organizationType,
                  organisationId: organisationSuggestedDetail.organizationId,
                  country: res.data.businessModelList[0].companyLocationDetails[0].country,
                  city: res.data.businessModelList[0].companyLocationDetails[0].city,
                  state: res.data.businessModelList[0].companyLocationDetails[0].state,
                  zipcode: res.data.businessModelList[0].companyLocationDetails[0].zipCode || organisationSuggestedDetail.zipCode
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
            this.isSuperAdmin = true
            this.isSuperAdmin1 = true
            this.workExperience.controls[0].get("city").disable()
            this.workExperience.controls[0].get("state").disable()
            this.workExperience.controls[0].get("country").disable()
            this.workExperience.controls[0].get("zipcode").disable()
          } else {
            this.util.stopLoader()
            this.isSuperAdmin = false
            this.isSuperAdmin1 = false
          }
        })
      }, 500);
    }, err => {
      this.util.stopLoader();
    });
  }

  // when no result matched the value, organization id is set to null
  changeTypeaheadNoResults(index, val) {
    if (val == "work") {
      this.getWorkFormGroup(index).patchValue({
        organisationId: null,
      });
    } else if (val == "edu") {
      this.getEducationFormGroup(index).patchValue({
        institutionId: null,
      });
      if (this.eduEditFlag == false) {
        this.educationDetail.controls[0].get('country').enable()
        this.educationDetail.controls[0].get('street').enable()
        this.educationDetail.controls[0].get('state').enable()
        this.educationDetail.controls[0].get('zipcode').enable()
        this.educationDetail.controls[0].get('city').enable()
      }
    }
    // else if(val == 'currentOrg'){
    //   this.getWorkFormGroup(index).patchValue({
    //     organisationId: null
    //   })
    // }
  }

  get p() {
    return this.personalInfoForm.controls;
  }
  get a() {
    return this.aboutMeForm.controls;
  }

  get experienceArray() {
    return this.eperienceForm.get("workExperience") as UntypedFormArray;
  }

  getWorkFormGroup(index): UntypedFormGroup {
    const formGroup = this.workExperience.controls[index] as UntypedFormGroup;
    return formGroup;
  }

  createWorkExperience(): UntypedFormGroup {
    return this.fb.group({
      title: [null, [Validators.required]],
      organisationName: [
        null,
        [Validators.required, CustomValidator.checkWhiteSpace(), CustomValidator.max(this.ORGANIZATION_NAME.max)],
      ],
      organisationId: [null],
      action: [null],
      clientType: [null, [Validators.required]],
      businessId: [null],
      expId: [null],
      userId: [null],
      currentOrganization: [false],
      startMonth: [null, [Validators.required]],
      timeZone: [null],
      startYear: [this.currentYear, [Validators.required]],
      endMonth: [null, [Validators.required]],
      endYear: [this.currentYear, [Validators.required]],
      state: [null, [Validators.required, CustomValidator.max(this.STATE.max)]],
      city: [null, [Validators.required, CustomValidator.max(this.CITY.max)]],
      zipcode: [null, [Validators.required, CustomValidator.minmaxLetters(this.ZIPCODE.min, this.ZIPCODE.max)]],
      badge: [false],

      country: [null, [Validators.required]],
    });
  }

  onOpenCalendar(container) {
    container.monthSelectHandler = (event: any): void => {
      container._store.dispatch(container._actions.select(event.date));
    };
    container.setViewMode("month");
  }

  toDateValidity(index: number, value) {
    if (value == "work") {
      if (this.workExperience.value[index].currentOrganization == true) {
        this.workExperience.controls.forEach((ele) => {
          ele.get("endMonth").clearValidators();
          ele.get("endMonth").updateValueAndValidity();
          ele.get("endYear").clearValidators();
          ele.get("endYear").updateValueAndValidity();
        });
      } else {
        this.workExperience.controls.forEach((ele) => {
          ele.get("endMonth").setValidators([Validators.required]);
          ele.get("endMonth").updateValueAndValidity();
          ele.get("endYear").setValidators([Validators.required]);
          ele.get("endYear").updateValueAndValidity();
        });
      }
    } else if (value == "edu") {
      // }else if(value=='edu'&&this.studentFlag==true){

      if (this.educationDetail.value[index].currentlyPursued == true) {
        // this.curIndex = index
        this.searchData.setCurrentInst(index);
        // this.currentInstitute = true
        this.commonVariables.currentInstitute = true;
        this.searchData.setCommonVariables(this.commonVariables);
        this.educationDetail.controls.forEach((ele) => {
          ele.get("endMonth").clearValidators();
          ele.get("endMonth").updateValueAndValidity();
          ele.get("endYear").clearValidators();
          ele.get("endYear").updateValueAndValidity();
        });
      } else {
        this.educationDetail.controls.forEach((ele) => {
          ele.get("endMonth").setValidators([Validators.required]);
          ele.get("endMonth").updateValueAndValidity();
          ele.get("endYear").setValidators([Validators.required]);
          ele.get("endYear").updateValueAndValidity();
        });
      }
    }
  }
  noOrgSelected: boolean = false;
  showThis(event, i) {
    if (event.target.checked == true) {
      // this.noOrgSelected = false
      this.showThisBoolean = true;
      this.commonVariables.noOrgSelected = false;
      this.searchData.setCommonVariables(this.commonVariables);
      if (this.userType != 'JOB_SEEKER') {
        this.workExperience.controls[0].get('timeZone').setValidators([Validators.required])
        this.workExperience.controls[0].get('timeZone').updateValueAndValidity()
      }

    } else if (event.target.checked == false) {
      // this.workExperience.controls[i].patchValue({badge: false})
      this.showThisBoolean = false;
      // this.noOrgSelected = true
      this.commonVariables.noOrgSelected = true;
      this.searchData.setCommonVariables(this.commonVariables);
      this.workExperience.controls[0].get('timeZone').clearValidators()
      this.workExperience.controls[0].get('timeZone').updateValueAndValidity()


    }
  }

  showThisEduBoolean = false;
  showThisEducation(event, i) {
    if (event.target.checked == true) {
      // this.noEduSelected = false
      this.showThisEduBoolean = true;
      this.commonVariables.noEduSelected = false;
      this.searchData.setCommonVariables(this.commonVariables);
    } else if (event.target.checked == false) {
      // this.workExperience.controls[i].patchValue({badge: false})
      this.showThisEduBoolean = false;
      // this.noEduSelected = true
      this.commonVariables.noEduSelected = true;
      this.searchData.setCommonVariables(this.commonVariables);
    }
  }

  validateIfChecked(control) {
    const userType = this.infoData.userType;
    var a = this.infoData.workExperience.findIndex(
      (x) => x.currentOrganization == true
    );
    //// console.log(control);
    if (userType != "student") {
      if (a == "-1") {
        if (
          control == false &&
          (userType == "HEALTHCARE" ||
            userType == "adminPersonnel" ||
            userType == "Other")
        ) {
          this.workExperience.controls[0]
            .get("currentOrganization")
            .setErrors({ validateIfChecked: true });
        } else if (
          control == true &&
          (userType == "HEALTHCARE" ||
            userType == "adminPersonnel" ||
            userType == "Other")
        ) {
          this.workExperience.controls[0]
            .get("currentOrganization")
            .setErrors({ validateIfChecked: null });
          this.workExperience.controls[0]
            .get("currentOrganization")
            .updateValueAndValidity({ emitEvent: false });
        }
      } else if (a != "-1") {
        if (
          control == false &&
          this.commonVariables.expId ==
          this.workExperience.controls[0].get("expId").value &&
          (userType == "HEALTHCARE" ||
            userType == "adminPersonnel" ||
            userType == "Other")
        ) {
          this.workExperience.controls[0]
            .get("currentOrganization")
            .setErrors({ validateIfChecked: true });
        }
      }
    } else {
      this.workExperience.controls[0]
        .get("currentOrganization")
        .setErrors({ validateIfChecked: null });
      this.workExperience.controls[0]
        .get("currentOrganization")
        .updateValueAndValidity({ emitEvent: false });
    }
    return null;
  }

  validateEduIfChecked(control) {
    const userType = this.infoData.userType;
    var a = this.infoData.educationDetail.findIndex(
      (x) => x.currentlyPursued == true
    );
    var eduId;
    this.infoData.educationDetail.forEach((ele) => {
      if (ele.currentlyPursued == true) {
        eduId = ele.eduId;
      }
    });
    if (userType == "student") {
      if (a == "-1") {
        if (control == false && userType == "student") {
          this.educationDetail.controls[0]
            .get("currentlyPursued")
            .setErrors({ validateEduIfChecked: true });
        } else if (control == true && userType == "student") {
          this.educationDetail.controls[0]
            .get("currentlyPursued")
            .setErrors({ validateEduIfChecked: null });
          this.educationDetail.controls[0]
            .get("currentlyPursued")
            .updateValueAndValidity({ emitEvent: false });
        }
      } else if (a != "-1") {
        if (
          control == false &&
          userType == "student" &&
          this.commonVariables.eduId ==
          this.educationDetail.controls[0].get("eduId").value
        ) {
          this.educationDetail.controls[0]
            .get("currentlyPursued")
            .setErrors({ validateEduIfChecked: true });
        }
      }
    } else {
      this.educationDetail.controls[0]
        .get("currentlyPursued")
        .setErrors({ validateEduIfChecked: null });
      this.educationDetail.controls[0]
        .get("currentlyPursued")
        .updateValueAndValidity({ emitEvent: false });
    }
    return null;
  }

  validateShowOnProf(control) {
    var a = this.infoData.workExperience.findIndex((x) => x.badge == true);
    var expYr = this.commonVariables.numberOfExperience;
    if (this.infoData.userData != "student") {
      if (
        // expYr == 1 &&
        a == "-1" &&
        this.workExperience.controls[0].get("currentOrganization").value ==
        true &&
        (this.infoData.userType == "HEALTHCARE" ||
          this.infoData.userType == "adminPersonnel" ||
          this.infoData.userType == "Other") &&
        control == false
      ) {
        this.workExperience.controls[0]
          .get("badge")
          .setErrors({ checkIfChecked: true });
      } else if (
        // expYr == 1 &&
        a == "-1" &&
        this.workExperience.controls[0].get("currentOrganization").value ==
        true &&
        (this.infoData.userType == "HEALTHCARE" ||
          this.infoData.userType == "adminPersonnel" ||
          this.infoData.userType == "Other") &&
        control == true
      ) {
        this.workExperience.controls[0]
          .get("badge")
          .setErrors({ checkIfChecked: null });

        this.workExperience.controls[0]
          .get("badge")
          .updateValueAndValidity({ emitEvent: false });
      } else if (a != "-1") {
        const expId = this.workExperience.controls[0].get("expId").value;
        this.infoData.workExperience.forEach((ele) => {
          if (ele.badge == true) {
            if (
              ele.expId == expId &&
              this.workExperience.controls[0].get("currentOrganization")
                .value == true &&
              (this.infoData.userType == "HEALTHCARE" ||
                this.infoData.userType == "adminPersonnel" ||
                this.infoData.userType == "Other") &&
              control == false
            ) {
              this.workExperience.controls[0]
                .get("badge")
                .setErrors({ checkIfChecked: true });
            }
          }
        });
      }
    } else {
      this.workExperience.controls[0]
        .get("badge")
        .setErrors({ checkIfChecked: null });

      this.workExperience.controls[0]
        .get("badge")
        .updateValueAndValidity({ emitEvent: false });
    }
  }

  validateEduShowOnProf(control) {
    if (this.infoData.userType == "student") {
      if (this.infoData.educationDetail.length != 0) {
        var a = this.infoData.educationDetail.findIndex(
          (x) => x.showThisOnProfile == true
        );

        if (
          a == "-1" &&
          this.educationDetail.controls[0].get("currentlyPursued").value ==
          true &&
          this.infoData.userType == "student" &&
          control == false
        ) {
          this.educationDetail.controls[0]
            .get("showThisOnProfile")
            .setErrors({ checkEduShowIfChecked: true });
        } else if (
          // expYr == 1 &&
          a == "-1" &&
          this.educationDetail.controls[0].get("currentlyPursued").value ==
          true &&
          this.infoData.userType == "student" &&
          control == true
        ) {
          this.educationDetail.controls[0]
            .get("showThisOnProfile")
            .setErrors({ checkEduShowIfChecked: null });

          this.educationDetail.controls[0]
            .get("showThisOnProfile")
            .updateValueAndValidity({ emitEvent: false });
        } else if (a != "-1") {
          this.infoData.educationDetail.forEach((ele) => {
            if (ele.showThisOnProfile == true) {
              if (this.educationDetail.controls[0].get("eduId") != null) {
                const eduId =
                  this.educationDetail.controls[0].get("eduId").value;
                if (
                  ele.eduId == eduId &&
                  this.educationDetail.controls[0].get("currentlyPursued")
                    .value == true &&
                  this.infoData.userType == "student" &&
                  control == false
                ) {
                  this.educationDetail.controls[0]
                    .get("showThisOnProfile")
                    .setErrors({ checkEduShowIfChecked: true });
                }
              }
            } else {
              this.educationDetail.controls[0]
                .get("showThisOnProfile")
                .setErrors({ checkEduShowIfChecked: null });

              this.educationDetail.controls[0]
                .get("showThisOnProfile")
                .updateValueAndValidity({ emitEvent: false });
            }
          });
        }
      } else if (this.infoData.educationDetail.length == 0) {
        if (
          this.educationDetail.controls[0].get("currentlyPursued").value ==
          false &&
          this.infoData.userType == "student" &&
          control == false
        ) {
          this.educationDetail.controls[0]
            .get("showThisOnProfile")
            .setErrors({ checkEduShowIfChecked: true });
        } else if (
          this.educationDetail.controls[0].get("currentlyPursued").value ==
          true &&
          this.infoData.userType == "student" &&
          control == true
        ) {
          this.educationDetail.controls[0]
            .get("showThisOnProfile")
            .setErrors({ checkEduShowIfChecked: null });

          this.educationDetail.controls[0]
            .get("showThisOnProfile")
            .updateValueAndValidity({ emitEvent: false });
        } else if (
          this.educationDetail.controls[0].get("currentlyPursued").value ==
          true &&
          this.infoData.userType == "student" &&
          control == false
        ) {
          this.educationDetail.controls[0]
            .get("showThisOnProfile")
            .setErrors({ checkEduShowIfChecked: true });
        }
      }
    } else {
      this.educationDetail.controls[0]
        .get("showThisOnProfile")
        .setErrors({ checkEduShowIfChecked: null });

      this.educationDetail.controls[0]
        .get("showThisOnProfile")
        .updateValueAndValidity({ emitEvent: false });
    }
  }
  tochangeOrgId: any = null;
  tochangeExpId: any = null;
  clientTypeOverrideFlag: boolean = false
  // overRideclient(value) {
  //   // this.util.startLoader()
  //   // setTimeout(() => {
  //   //   this.util.stopLoader()
  //   // }, 500);
  //   // this.clientTypeOverrideFlag = true
  //   // this.workExperience.controls[0].get("clientType").setErrors({ clientTypeMismatch: null });
  //   // this.workExperience.controls[0].get("clientType").updateValueAndValidity({ emitEvent: false });
  //   this.experSave(value)
  // }
  clientTypeChanged: boolean = false
  experSave(value: any) {
    // if (this.workExperience.value[0].clientType != null && this.workExperience.value[0].clientType != this.clientType && this.clientTypeChanged == false && this.userType != 'student' && this.userType != 'JOB_SEEKER' && this.userType != 'FREELANCE_RECRUITER' && this.workExperience.value[0].currentOrganization == true) {
    //   this.clientTypeChanged = true
    //   this.overRideclient(value);
    //   if (this.clientType != "Direct Client" && this.clientType != "Client") {
    //     if (this.clientType != this.workExperience.value[0].clientType) {
    //       this.util.stopLoader();
    //       const swalWithBootstrapButtons = Swal.mixin({
    //         customClass: {
    //           confirmButton: 'btn btn-success',
    //           cancelButton: 'btn btn-danger'
    //         },
    //         buttonsStyling: false
    //       })

    //       swalWithBootstrapButtons.fire({
    //         title: 'Oops..',
    //         text: "It seems that you are changing the organization type. Please note that the credit consumptions will vary depending on the type of organization chosen.",
    //         icon: 'warning',
    //         showCancelButton: true,
    //         confirmButtonText: 'Ok',
    //         cancelButtonText: 'cancel',
    //         reverseButtons: true
    //       }).then((result) => {
    //         if (result.isConfirmed) {
    //           this.overRideclient(value)
    //           // this.modalService.hide(1)
    //         }
    //       })

    //     } else {
    //       // this.workExperience.controls[0].get("clientType").setErrors({ clientTypeMismatch: null });
    //       // this.workExperience.controls[0].get("clientType").updateValueAndValidity({ emitEvent: false });
    //     }
    //   } else if (this.clientType == "Client") {
    //     if (this.workExperience.value[0].clientType != "Client") {
    //       this.clientTypeChanged = true
    //       this.util.stopLoader();
    //       const swalWithBootstrapButtons = Swal.mixin({
    //         customClass: {
    //           confirmButton: 'btn btn-success',
    //           cancelButton: 'btn btn-danger'
    //         },
    //         buttonsStyling: false
    //       })

    //       swalWithBootstrapButtons.fire({
    //         title: 'Oops..',
    //         text: "It seems that you are changing the organization type. Please note that the credit consumptions will vary depending on the type of organization chosen.",
    //         icon: 'warning',
    //         showCancelButton: true,
    //         confirmButtonText: 'Yes',
    //         cancelButtonText: 'cancel',
    //         reverseButtons: true
    //       }).then((result) => {
    //         if (result.isConfirmed) {
    //           this.overRideclient(value)

    //         }
    //       })

    //     }
    //   }
    // }
    // else {
    this.tochangeOrgId = null
    this.workSaveFlag = true;
    this.mandateWork();
    this.toDateValidity(0, "work");
    this.isDuplicateWorkExperience();
    this.checkLocationChange() //checks if either city, state, country, zipcode, name of the organization, or time zone has been changed and updates the organization ID accordingly
    if (value == "edit") {
      if (this.eperienceForm.valid) {
        // this.util.startLoader()
        this.workExperience.controls[0].patchValue({ userId: this.userId });
        // const currentClientTypeValue = this.workExperience.controls[0].get('clientType').value
        // const currentOrganization = this.workExperience.controls[0].get('badge').value
        // if (this.previousClientTypeValue != currentClientTypeValue && (currentOrganization == 'true' || currentOrganization == true)) {
        //   this.api.query("user/profile/complete/" + localStorage.getItem('userId')).subscribe(res => {
        //     if (res.code == '00000' && res.isCandidateOrJobAvailable) {
        //       Swal.fire({
        //         position: "center",
        //         title: "Oops..",
        //         text: "Sorry, you can't change organisation type if you have jobs or candidates with this profile.",
        //         icon: "info",
        //         showConfirmButton: true,
        //       });
        //     }
        //   })
        // } else
        // {
        setTimeout(() => {
          if (this.tochangeOrgId != null) {
            // this.sameOrgConflict();
            this.util.stopLoader()
            Swal.fire({
              position: "center",
              title: "Oops..",
              text: "Sorry, you can't have two current organization under the same business organization.",
              icon: "info",
              showConfirmButton: true,
              // timer: 5000,
            });
            this.tochangeOrgId = null

          } else if (
            this.commonVariables.expId != "" &&
            this.commonVariables.expId != undefined &&
            this.commonVariables.expId != null &&
            this.commonVariables.expId != this.workExperience.value[0].expId &&
            this.workExperience.value[0].badge == true
          ) {
            if (this.userType == 'FREELANCE_RECRUITER') {
              this.replaceCurOrg("edit");
            } else {
              this.util.stopLoader()
              // Swal.fire({
              //   position: "center",
              //   title: "Oops..",
              //   text: "Sorry, you can't have two current organizations for your user type.",
              //   icon: "info",
              //   showConfirmButton: true,
              //   // timer: 5000,
              // });
              this.newworkExperienceadd()
            }
          } else {
            this.expSave("put", "nochange");
          }
        }, 3000);
        // }
      }
    } else if (value == "add") {

      if (this.eperienceForm.valid) {
        if (this.infoData.workExperience.length > 0 && !this.infoData.workExperience.find(res => res.currentOrganization) && !this.eperienceForm.value.workExperience[0].currentOrganization) {
          const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
              confirmButton: 'btn btn-success',
              cancelButton: 'btn btn-danger'
            },
            buttonsStyling: false
          })

          swalWithBootstrapButtons.fire({
            title: 'Oops..',
            text: "you Don't have current Organization , would you like to make it as current organization",
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            reverseButtons: true
          }).then((result) => {
            this.util.stopLoader()
            if (result.isConfirmed) {
              this.workExperience.at(0).get('currentOrganization').patchValue(true);
              this.workExperience.at(0).get('badge').patchValue(true);
              this.workExperience.at(0).get('timeZone').setValidators([Validators.required]);
              this.workExperience.at(0).get('timeZone').updateValueAndValidity();
            }
            else if (result.isDismissed) {
              this.savingWorkExp()
            }
          }
          )
        }
        else {
          this.savingWorkExp()
        }

      }
    } else if (value == "newOrg" || value == "updateOrg") {
      if (this.eperienceForm.valid) {
        this.util.startLoader();
        this.workExperience.controls[0].patchValue({ userId: this.userId });
        if (value == "newOrg") {
          this.workExperience.controls[0].patchValue({ userId: this.userId });

          // setTimeout(() => {
          //   this.isDuplicateWorkExperience()
          // }, 1000);

          setTimeout(() => {
            this.api
              .create("user/v1/workexperience", this.workExperience.getRawValue()[0])
              .subscribe((res) => {
                if (res.code == "00000") {
                  this.util.stopLoader();
                  this.curOrgValidity("work");
                  this.workExperience.value.forEach((ele) => { });
                  this.reload('workExperience');
                } else if (res.code == "99998") {
                  this.util.stopLoader();
                  const swalWithBootstrapButtons = Swal.mixin({
                    customClass: {
                      confirmButton: 'btn btn-success',
                      cancelButton: 'btn btn-danger'
                    },
                    buttonsStyling: false
                  })

                  swalWithBootstrapButtons.fire({
                    title: 'Oops..',
                    text: "You already have a current organization. Changing your current organization to a new work place requires you to authenticate a new business email address for the organization. Would you like to proceed?",
                    icon: 'info',
                    showCancelButton: true,
                    confirmButtonText: 'Yes',
                    cancelButtonText: 'No',
                    reverseButtons: true
                  })
                    .then((result) => {
                      if (result.isConfirmed) {
                        var expp = this.workExperience.getRawValue()[0]
                        expp.action = "APPROVED"
                        this.api
                          .create("user/v1/workexperience", expp)
                          .subscribe((res) => {
                            Swal.fire({
                              title: "Work Experience Updated",
                              text: "Changes made successfully and updated your work experience.",
                              icon: "success",
                              timer: 2000,
                              showConfirmButton: false,

                              // timer: 2000,
                              // confirmButtonText: "Yes",
                              // denyButtonText: "No"
                            })
                            this.modalService.hide(1)
                          })
                      } else if (result.isDenied) {

                      }
                    });
                  this.workSaveFlag = false;
                  // this.workExperience.controls[0]
                  //   .get("organisationName")
                  //   .disable();
                } else if (res.code == "99996") {
                  this.util.stopLoader();
                  Swal.fire({
                    title: "Oops..",
                    text: "Sorry, one current organization is at least needed for your user type. ",
                    icon: "error",
                    // timer: 3000,
                    confirmButtonText: "Ok",
                    // denyButtonText: "No"
                  }).then((result) => {
                    if (result.isConfirmed) {
                      this.workExperience.controls[0].patchValue({
                        currentOrganization: false,
                        badge: false
                      })
                    }
                  });
                } else if (res.code == "10001") {
                  this.util.stopLoader();
                  const swalWithBootstrapButtons = Swal.mixin({
                    customClass: {
                      confirmButton: "btn btn-success",
                      denyButton: 'btn btn-danger'
                    },
                    buttonsStyling: false,
                  });
                  swalWithBootstrapButtons
                    .fire({
                      title: "Are you sure you want to change?",
                      text: "You are the super admin to the other current organization in your work experience. Changing the current organization will delete the business page of the organization. Would you like to proceed?",
                      icon: "info",
                      // timer: 3000,
                      showDenyButton: true,
                      confirmButtonText: "Yes",
                      denyButtonText: "No"
                    })
                    .then((result) => {
                      if (result.isConfirmed) {
                        var expp = this.workExperience.getRawValue()[0]
                        expp.action = "APPROVED"
                        this.api
                          .create("user/v1/workexperience", expp)
                          .subscribe((res) => {
                            Swal.fire({
                              title: "Work Experience Updated",
                              text: "Changes made successfully and updated your work experience.",
                              icon: "success",
                              showConfirmButton: false,

                              timer: 2000,

                            }).then(() => {
                              this.reload('personalProfile')
                              this.modalService.hide(1)
                            })
                          })
                      } else if (result.isDenied) {
                      }
                    });
                  this.workSaveFlag = false;
                } else if (res.code == "10002") {
                  this.util.stopLoader();
                  Swal.fire({
                    text: "You are the super admin of the business page. You have to transfer super admin rights to other members before changing your current organization.",
                    title: "Cannot change current organization",
                    icon: "error",
                    confirmButtonText: "Ok",
                  })
                } else {
                  this.util.stopLoader()
                  const swalWithBootstrapButtons = Swal.mixin({
                    customClass: {
                      confirmButton: "btn btn-success",
                      // cancelButton: 'btn btn-danger'
                    },
                    buttonsStyling: false,
                  });
                  swalWithBootstrapButtons
                    .fire({
                      title: "Oops..",
                      text: res["message"],
                      icon: "error",
                      // timer: 3000,
                      confirmButtonText: "OK",
                    })
                    .then((result) => {
                      if (result.isConfirmed) {
                      }
                    });
                  this.workSaveFlag = false;
                  this.workExperience.controls[0]
                    .get("organisationName")
                    .disable();
                }
              });
          }, 1400);

        } else if (value == "updateOrg") {
          this.workExperience.controls[0].patchValue({ userId: this.userId });
          this.api
            .updatePut("user/v1/workexperience", this.workExperience.getRawValue()[0])
            .subscribe((res) => {
              if (res.code == "00000") {
                this.util.stopLoader();
                this.reload('workExperience');
              } if (res.code == "00000") {
                this.util.stopLoader();
                this.curOrgValidity("work");
                this.workExperience.value.forEach((ele) => { });
                this.reload('workExperience');
              } else if (res.code == "99998") {
                this.util.stopLoader();
                const swalWithBootstrapButtons = Swal.mixin({
                  customClass: {
                    confirmButton: 'btn btn-success',
                    cancelButton: 'btn btn-danger'
                  },
                  buttonsStyling: false
                })

                swalWithBootstrapButtons.fire({
                  title: 'Oops..',
                  text: "You already have a current organization. Changing your current organization to a new work place requires you to authenticate a new business email address for the organization. Would you like to proceed?",
                  icon: 'info',
                  showCancelButton: true,
                  confirmButtonText: 'Yes',
                  cancelButtonText: 'No',
                  reverseButtons: true
                })
                  .then((result) => {
                    if (result.isConfirmed) {
                      this.initiateEmailDomainValidator()
                    } else if (result.isDenied) {

                    }
                  });
                this.workSaveFlag = false;
                // this.workExperience.controls[0]
                //   .get("organisationName")
                //   .disable();
              } else if (res.code == "99996") {
                this.util.stopLoader();
                Swal.fire({
                  title: "Oops..",
                  text: "Sorry, one current organization is at least needed for your user type. ",
                  icon: "error",
                  // timer: 3000,
                  confirmButtonText: "Ok",
                  // denyButtonText: "No"
                }).then((result) => {
                  if (result.isConfirmed) {
                    this.workExperience.controls[0].patchValue({
                      currentOrganization: false,
                      badge: false
                    })
                  }
                });
              } else if (res.code == "10001") {
                this.util.stopLoader();
                const swalWithBootstrapButtons = Swal.mixin({
                  customClass: {
                    confirmButton: "btn btn-success",
                    denyButton: 'btn btn-danger'
                  },
                  buttonsStyling: false,
                });
                swalWithBootstrapButtons
                  .fire({
                    title: "Are you sure you want to change?",
                    text: "You are the super admin to the other current organization in your work experience. Changing the current organization will delete the business page of the organization. Would you like to proceed?",
                    icon: "info",
                    // timer: 3000,
                    showDenyButton: true,
                    confirmButtonText: "Yes",
                    denyButtonText: "No"
                  })
                  .then((result) => {
                    if (result.isConfirmed) {
                      var expp = this.workExperience.getRawValue()[0]
                      expp.action = "APPROVED"
                      this.api
                        .updatePut("user/v1/workexperience", expp)
                        .subscribe((res) => {
                          if (res.code == '00000') {
                            Swal.fire({
                              title: "Work Experience Updated",
                              text: "Changes made successfully and updated your work experience.",
                              icon: "success",
                              // timer: 2000,
                              showConfirmButton: false,

                              timer: 2000,
                            }).then(() => {
                              this.reload('personalProfile')
                              this.modalService.hide(1)
                            })
                          } else {
                            this.util.stopLoader()
                            const swalWithBootstrapButtons = Swal.mixin({
                              customClass: {
                                confirmButton: "btn btn-success",
                                // cancelButton: 'btn btn-danger'
                              },
                              buttonsStyling: false,
                            });
                            swalWithBootstrapButtons
                              .fire({
                                title: "Oops..",
                                text: res["message"],
                                icon: "error",
                                // timer: 3000,
                                confirmButtonText: "OK",
                              })
                              .then((result) => {
                                if (result.isConfirmed) {
                                }
                              });
                            this.workSaveFlag = false;
                            this.workExperience.controls[0]
                              .get("organisationName")
                              .disable();
                          }
                          // this.modalService.hide(1)
                        })
                    } else if (result.isDenied) {
                    }
                  });
                this.workSaveFlag = false;
              } else if (res.code == "10002") {
                this.util.stopLoader();
                Swal.fire({
                  text: "You are the super admin of the business page. You have to transfer super admin rights to other members before changing your current organization.",
                  title: "Cannot change current organization",
                  icon: "error",
                  confirmButtonText: "Ok",
                })
              } else {
                this.util.stopLoader()
                const swalWithBootstrapButtons = Swal.mixin({
                  customClass: {
                    confirmButton: "btn btn-success",
                    // cancelButton: 'btn btn-danger'
                  },
                  buttonsStyling: false,
                });
                swalWithBootstrapButtons
                  .fire({
                    title: "Oops..",
                    text: res["message"],
                    icon: "error",
                    // timer: 3000,
                    confirmButtonText: "OK",
                  })
                  .then((result) => {
                    if (result.isConfirmed) {
                    }
                  });
                this.workSaveFlag = false;
                this.workExperience.controls[0]
                  .get("organisationName")
                  .disable();
              }
            }, err => {
              this.util.stopLoader();
            });
        }
      }
    }
  }

  savingWorkExp() {
    if (this.eperienceForm.valid) {
      this.util.startLoader()
      this.workExperience.controls[0].patchValue({ userId: this.userId });

      this.checkLocationChange();
      this.isDuplicateWorkExperience()

      if (this.tochangeOrgId != null) {
        Swal.fire({
          position: "center",
          title: "Oops..",
          text: "Sorry, you can't have two current organization under the same business organization.",
          icon: "info",
          showConfirmButton: true,
        });
        this.util.stopLoader();
        this.tochangeOrgId = null
      } else if (
        this.commonVariables.expId != "" &&
        this.commonVariables.expId != this.workExperience.value[0].expId &&
        this.workExperience.value[0].badge == true
      ) {

        if (this.userType == 'FREELANCE_RECRUITER') {
          this.replaceCurOrg("add");
        } else {
          this.newworkExperienceadd();
          this.util.stopLoader();
        }
      } else {
        this.expSave("add", "nochange");
      }
      this.util.stopLoader();
    }

  }
  newworkExperienceadd() {
    this.util.startLoader();
    this.api
      .create("user/v1/workexperience", this.workExperience.getRawValue()[0])
      .subscribe((res) => {
        if (res.code == "00000") {
          this.modalRef.hide();
          this.reload('workExperience');
          this.util.stopLoader();
          this.curOrgValidity("work");
          this.onHideWrkMandTemp();
          this.infoData.workExperience.push(
            {
              organisationName: this.workExperience.getRawValue()[0].organisationName,
              title: this.workExperience.getRawValue()[0].title,
              city: this.workExperience.getRawValue()[0].city,
              state: this.workExperience.getRawValue()[0].state,
              country: this.workExperience.getRawValue()[0].country,
              startMonth: this.workExperience.getRawValue()[0].startMonth,
              startYear: this.workExperience.getRawValue()[0].startYear,
              endMonth: this.workExperience.getRawValue()[0].endMonth,
              endYear: this.workExperience.getRawValue()[0].endYear,
              businessId: this.infoData.workExperience[this.workIndex].businessId,
              organizationId: this.infoData.workExperience[this.workIndex].organizationId,
              badge: this.infoData.workExperience[this.workIndex].badge,
              clientType: this.infoData.workExperience[this.workIndex].clientType,
              currentOrganization: this.infoData.workExperience[this.workIndex].currentOrganization,
              expId: this.infoData.workExperience[this.workIndex].expId,
              userId: this.infoData.workExperience[this.workIndex].userId
            }
          )
        }
        else if (res.code == "99998") {
          this.util.stopLoader();
          const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
              confirmButton: 'btn btn-success',
              cancelButton: 'btn btn-danger'
            },
            buttonsStyling: false
          })

          swalWithBootstrapButtons.fire({
            title: 'Oops..',
            text: "You already have a current organization. Changing your current organization to a new work place requires you to authenticate a new business email address for the organization. Would you like to proceed?",
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            reverseButtons: true
          })
            .then((result) => {
              if (result.isConfirmed) {
                this.initiateEmailDomainValidator()
              } else if (result.isDenied) {

              }
            });
          this.workSaveFlag = false;
          // this.workExperience.controls[0]
          //   .get("organisationName")
          //   .disable();
        } else if (res.code == "99996") {
          this.util.stopLoader();
          Swal.fire({
            title: "Oops..",
            text: "Sorry, one current organization is at least needed for your user type. ",
            icon: "error",
            // timer: 3000,
            confirmButtonText: "Ok",
            // denyButtonText: "No"
          }).then((result) => {
            if (result.isConfirmed) {
              this.workExperience.controls[0].patchValue({
                currentOrganization: false,
                badge: false
              })
            }
          });
        } else if (res.code == "10001") {
          this.util.stopLoader();
          const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
              confirmButton: "btn btn-success",
              denyButton: 'btn btn-danger'
            },
            buttonsStyling: false,
          });
          swalWithBootstrapButtons
            .fire({
              title: "Are you sure you want to change?",
              text: "You are the super admin to the other current organization in your work experience. Changing the current organization will delete the business page of the organization. Would you like to proceed?",
              icon: "info",
              // timer: 3000,
              showDenyButton: true,
              confirmButtonText: "Yes",
              denyButtonText: "No"
            })
            .then((result) => {
              if (result.isConfirmed) {
                var expp = this.workExperience.getRawValue()[0]
                expp.action = "APPROVED"
                this.api
                  .create("user/v1/workexperience", expp)
                  .subscribe((res) => {
                    Swal.fire({
                      title: "Work Experience Updated",
                      text: "Changes made successfully and updated your work experience.",
                      icon: "success",
                      showConfirmButton: false,

                      timer: 2000,

                    }).then(() => {
                      this.reload('personalProfile')
                      this.modalService.hide(1)
                    })
                  })
              } else if (result.isDenied) {
              }
            });
          this.workSaveFlag = false;
        } else if (res.code == "10002") {
          this.util.stopLoader();
          Swal.fire({
            text: "You are the super admin of the business page. You have to transfer super admin rights to other members before changing your current organization.",
            title: "Cannot change current organization",
            icon: "error",
            confirmButtonText: "Ok",
          })
        } else {
          this.util.stopLoader();
          const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
              confirmButton: "btn btn-success",
              // cancelButton: 'btn btn-danger'
            },
            buttonsStyling: false,
          });
          swalWithBootstrapButtons
            .fire({
              title: "Oops..",
              text: res["message"],
              icon: "error",
              confirmButtonText: "OK",
              timer: 3000,
            })
            .then((result) => {
              if (result.isConfirmed) {
              }
            });
          this.workSaveFlag = false;
          this.workExperience.controls[0].get("organisationName").disable();
        }
      }, err => {
        this.util.stopLoader();
      });


  }
  checkMailExists(email: string) {
    if (this.domainForm.value.swapEmail == null || this.domainForm.value.swapEmail == '' && email.length == 0 || email == "") {
      this.domainForm.get('swapEmail').setErrors({ emailExistsAlready: null })
      this.domainForm.get('swapEmail').updateValueAndValidity({ emitEvent: false })
    }
    else {
      this.domainForm.get('swapEmail').setErrors({ emailExistsAlready: null });
      this.domainForm.get('swapEmail').updateValueAndValidity({ emitEvent: false })
      this.api.query("user/checkMailAlreadyExists/" + email).subscribe((res) => {
        if (res.code == "00000") {
          if (res.data.exists) {
            this.domainForm.get('swapEmail').setErrors({ emailExistsAlready: true });
          } else if (res.data.exists == false) {
            this.domainForm.get('swapEmail').setErrors({ emailExistsAlready: null });
            this.domainForm.get('swapEmail').updateValueAndValidity({ emitEvent: false })
          }
        }
      })
    }

  }

  initiateEmailDomainValidator() {
    this.domainForm = this.fb.group({
      priEmail: null,
      secEmail: null,
      swapEmail: [null, [Validators.required, Validators.email]],
      domainValidationOtp: null,
    })
    this.util.startLoader()
    var data: any = {}
    data.userId = this.userId
    data.userType = this.userType
    this.api.create('user/profileDetails', data).subscribe(res => {
      this.clientType = res.data.userData.clientType
      if (res.code == '00000') {
        this.util.stopLoader()
        this.firstName = res.data.userData.firstName;
        this.primaryEmail = res.data.userData.email;
        this.lastName = res.data.userData.lastName;
        this.creditPoints = res.data.creditPoints
        this.previousEmailAddress = res.data.userData.email;
        setTimeout(() => {
          this.commonVariables.emailDomainValidation = true
        }, 500);
        res.data.GIGSUMO_GENERIC_EMAIL_DOMAINS.listItems.forEach(ele => {
          this.domainList.push(ele.item)
        })
        // primaryEmail = "abubakrgoogl@gmail.com";
        // primaryEmail = "lixara4382@pantabi.com";

        //  setTimeout(() => {
        //  }, 1000);

        // var validateEmail: any;
        // validateEmail = this.primaryEmail.split('@')[1]
      }
    })
  }

  checkLocationChange() {
    if (this.temp != undefined && this.temp != null && this.temp != '') {
      if (
        this.temp.city != this.workExperience.value[0].city ||
        this.temp.state != this.workExperience.value[0].state ||
        this.temp.country != this.workExperience.value[0].country ||
        this.temp.zipCode != this.workExperience.value[0].zipcode ||
        this.temp.organisationName != this.workExperience.value[0].organisationName ||
        this.temp.timeZone != this.workExperience.value[0].timeZone
      ) {
        var data: any = {}
        data.country = this.workExperience.value[0].country
        data.stateName = this.workExperience.value[0].state
        data.city = this.workExperience.value[0].city
        data.zipCode = this.workExperience.value[0].zipcode
        data.organizationName = this.workExperience.getRawValue()[0].organisationName
        this.util.startLoader()
        this.api.create('care/find/organization', data).subscribe(res => {

          if (res != null && res != undefined && res != '') {
            // this.util.stopLoader()
            this.workExperience.controls[0].patchValue({
              organisationId: res.organisationId,
              businessId: res.businessId,
              // expId: null
            })
          } else {
            // this.util.stopLoader();
            this.workExperience.controls[0].patchValue({
              organisationId: null,
              businessId: null,
              // expId: null
            })
          }
        }, err => {
          this.util.stopLoader()
          if (err.status == 500) {
            this.util.stopLoader();
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: 'Something went wrong while fetching data. Please, try again later.',
              showDenyButton: false,
              confirmButtonText: `ok`,
            })
          }
        })
      }
    }
  }

  isDuplicateWorkExperience() {
    this.commonVariables.orgIdList.forEach((ele) => {
      if (
        ele.organisationId === this.workExperience.controls[0].get("organisationId").value &&
        ele.expId !== this.workExperience.controls[0].get("expId").value &&
        this.workExperience.controls[0].get("currentOrganization").value == true
      ) {
        this.tochangeOrgId = this.workExperience.controls[0].get("organisationId").value;
        // this.tochangeExpId =
        //   this.workExperience.controls[0].get("expId").value;
      }
    });
  }


  replaceCurOrg(value) {
    // //// console.log(value);
    // //// console.log("value");
    this.util.stopLoader()
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: "Are you sure you want to change?",
        text: "There is a workplace you have chosen already to show on Profile. Would you like to change it?",
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.infoData.workExperience.forEach((ele) => {
            if (ele.badge == true) {
              ele.badge = false;
              this.util.startLoader();
              this.api
                .updatePut("user/v1/workexperience", ele)
                .subscribe((res) => {
                  if (res.code == "00000") {
                    // this.util.stopLoader();
                    if (value == "add") {
                      this.util.startLoader();
                      this.api
                        .create(
                          "user/v1/workexperience",
                          this.workExperience.getRawValue()[0]
                        )
                        .subscribe((res) => {
                          if (res.code == "00000") {
                            // this.util.stopLoader();
                            Swal.fire({
                              position: "center",
                              icon: "success",
                              title: "Changes saved successfully",
                              showConfirmButton: false,
                              timer: 2000,
                            });
                            if (this.modalRef != undefined) {
                              this.modalRef.hide();
                            }
                            this.reload('workExperience');
                          } else {
                            const swalWithBootstrapButtons = Swal.mixin({
                              customClass: {
                                confirmButton: "btn btn-success",
                                // cancelButton: 'btn btn-danger'
                              },
                              buttonsStyling: false,
                            });
                            this.util.stopLoader();
                            swalWithBootstrapButtons
                              .fire({
                                title: "Oops..",
                                text: res["message"],
                                icon: "error",
                                // timer: 3000,
                                confirmButtonText: "OK",
                              })
                              .then((result) => {
                                if (result.isConfirmed) {
                                }
                              });
                            this.workSaveFlag = false;
                            this.workExperience.controls[0]
                              .get("organisationName")
                              .disable();
                          }
                        }, err => {
                          this.util.stopLoader();

                        });

                    } else if (value == "edit") {
                      this.util.startLoader();
                      this.api
                        .updatePut(
                          "user/v1/workexperience",
                          this.workExperience.getRawValue()[0]
                        )
                        .subscribe((res) => {
                          if (res.code == "00000") {
                            // this.util.stopLoader();
                            Swal.fire({
                              position: "center",
                              icon: "success",
                              title: "Changes saved successfully",
                              showConfirmButton: false,
                              timer: 2000,
                            });
                            if (this.modalRef != undefined) {
                              this.modalRef.hide();
                            }
                            this.reload('workExperience');
                          } else {
                            this.util.startLoader();
                            const swalWithBootstrapButtons = Swal.mixin({
                              customClass: {
                                confirmButton: "btn btn-success",
                                // cancelButton: 'btn btn-danger'
                              },
                              buttonsStyling: false,
                            });
                            this.util.stopLoader();
                            swalWithBootstrapButtons
                              .fire({
                                title: "Oops..",
                                text: res["message"],
                                // timer: 3000,
                                icon: "error",
                                confirmButtonText: "OK",
                              })
                              .then((result) => {
                                if (result.isConfirmed) {
                                }
                              });
                            this.workSaveFlag = false;
                            this.workExperience.controls[0]
                              .get("organisationName")
                              .disable();
                          }
                        }, err => {
                          this.util.stopLoader();
                        });
                    }
                  } else {
                    this.util.stopLoader()
                    const swalWithBootstrapButtons = Swal.mixin({
                      customClass: {
                        confirmButton: "btn btn-success",
                        // cancelButton: 'btn btn-danger'
                      },
                      buttonsStyling: false,
                    });
                    swalWithBootstrapButtons
                      .fire({
                        title: "Oops..",
                        text: res["message"],
                        // timer: 3000,
                        icon: "error",
                        confirmButtonText: "OK",
                      })
                      .then((result) => {
                        if (result.isConfirmed) {
                        }
                      });
                    this.workSaveFlag = false;
                    this.workExperience.controls[0]
                      .get("organisationName")
                      .disable();
                  }
                });
            }
          });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          this.util.stopLoader()
          this.workSaveFlag == false;
          this.workExperience.controls[0].get("badge").setValue(false);
        }
      });
  }

  // checkLocationChange(){

  // }


  uploadPhoto() {
    this.myFileInput.nativeElement.click();
  }

  expSave(val, par) {
    if (this.eperienceForm.valid) {
      if (val == "put" && par == "nochange") {

        this.util.startLoader();
        setTimeout(() => {
          this.api
            .updatePut(
              "user/v1/workexperience",
              this.workExperience.getRawValue()[0]
            )
            .subscribe((res) => {
              if (res.code == "00000") {
                this.util.startLoader();
                this.curOrgValidity("work");
                this.util.stopLoader();
                this.onHideWrkMandTemp();
                this.infoData.workExperience.splice(this.workIndex, 1, {
                  organisationName: this.workExperience.getRawValue()[0].organisationName,
                  title: this.workExperience.getRawValue()[0].title,
                  city: this.workExperience.getRawValue()[0].city,
                  state: this.workExperience.getRawValue()[0].state,
                  country: this.workExperience.getRawValue()[0].country,
                  startMonth: this.workExperience.getRawValue()[0].startMonth,
                  startYear: this.workExperience.getRawValue()[0].startYear,
                  endMonth: this.workExperience.getRawValue()[0].endMonth,
                  endYear: this.workExperience.getRawValue()[0].endYear,
                  businessId: this.infoData.workExperience[this.workIndex].businessId,
                  badge: this.infoData.workExperience[this.workIndex].badge,
                  clientType: this.infoData.workExperience[this.workIndex].clientType,
                  currentOrganization: this.infoData.workExperience[this.workIndex].currentOrganization,
                  expId: this.infoData.workExperience[this.workIndex].expId,
                  userId: this.infoData.workExperience[this.workIndex].userId
                })
                this.modalRef.hide();
                this.reload('workExperience')
              } else if (res.code == "99998") {
                this.util.stopLoader();
                const swalWithBootstrapButtons = Swal.mixin({
                  customClass: {
                    confirmButton: 'btn btn-success',
                    cancelButton: 'btn btn-danger'
                  },
                  buttonsStyling: false
                })

                swalWithBootstrapButtons.fire({
                  title: 'Oops..',
                  text: "You already have a current organization. Changing your current organization to a new work place requires you to authenticate a new business email address for the organization. Would you like to proceed?",
                  icon: 'info',
                  showCancelButton: true,
                  confirmButtonText: 'Yes',
                  cancelButtonText: 'No',
                  reverseButtons: true
                })
                  .then((result) => {
                    if (result.isConfirmed) {
                      this.initiateEmailDomainValidator()
                    } else if (result.isDenied) {

                    }
                  });
                this.workSaveFlag = false;
                // this.workExperience.controls[0]
                //   .get("organisationName")
                //   .disable();
              } else if (res.code == "99996") {
                this.util.stopLoader();
                Swal.fire({
                  title: "Oops..",
                  text: "Sorry, one current organization is at least needed for your user type. ",
                  icon: "error",
                  // timer: 3000,
                  confirmButtonText: "Ok",
                  // denyButtonText: "No"
                }).then((result) => {
                  if (result.isConfirmed) {
                    this.workExperience.controls[0].patchValue({
                      currentOrganization: false,
                      badge: false
                    })
                  }
                });
              } else if (res.code == "10001") {
                this.util.stopLoader();
                const swalWithBootstrapButtons = Swal.mixin({
                  customClass: {
                    confirmButton: "btn btn-success",
                    denyButton: 'btn btn-danger'
                  },
                  buttonsStyling: false,
                });
                swalWithBootstrapButtons
                  .fire({
                    title: "Are you sure you want to change?",
                    text: "You are the super admin to the other current organization in your work experience. Changing the current organization will delete the business page of the organization. Would you like to proceed?",
                    icon: "info",
                    // timer: 3000,
                    showDenyButton: true,
                    confirmButtonText: "Yes",
                    denyButtonText: "No"
                  })
                  .then((result) => {
                    if (result.isConfirmed) {
                      var expp = this.workExperience.getRawValue()[0]
                      expp.action = "APPROVED"
                      this.api
                        .updatePut("user/v1/workexperience", expp)
                        .subscribe((res) => {
                          if (res.code == '00000') {
                            Swal.fire({
                              title: "Work Experience Updated",
                              text: "Changes made successfully and updated your work experience.",
                              icon: "success",
                              showConfirmButton: false,

                              timer: 2000,

                            }).then(() => {
                              this.reload('personalProfile')
                              this.modalService.hide(1)
                            })
                          } else {
                            this.util.stopLoader()
                            const swalWithBootstrapButtons = Swal.mixin({
                              customClass: {
                                confirmButton: "btn btn-success",
                                // cancelButton: 'btn btn-danger'
                              },
                              buttonsStyling: false,
                            });
                            swalWithBootstrapButtons
                              .fire({
                                title: "Oops..",
                                text: res["message"],
                                icon: "error",
                                // timer: 3000,
                                confirmButtonText: "OK",
                              })
                              .then((result) => {
                                if (result.isConfirmed) {
                                }
                              });
                            this.workSaveFlag = false;
                            this.workExperience.controls[0]
                              .get("organisationName")
                              .disable();
                          }
                        })
                    } else if (result.isDenied) {
                    }
                  });
                this.workSaveFlag = false;
              } else if (res.code == "10002") {
                this.util.stopLoader();
                Swal.fire({
                  text: "You are the super admin of the business page. You have to transfer super admin rights to other members before changing your current organization.",
                  title: "Cannot change current organization",
                  icon: "error",
                  confirmButtonText: "Ok",
                })
              } else {
                this.util.stopLoader();
                const swalWithBootstrapButtons = Swal.mixin({
                  customClass: {
                    confirmButton: "btn btn-success",
                    // cancelButton: 'btn btn-danger'
                  },
                  buttonsStyling: false,
                });
                swalWithBootstrapButtons
                  .fire({
                    title: "Oops..",
                    text: res["message"],
                    icon: "error",
                    timer: 3000,
                    confirmButtonText: "OK",
                  })
                  .then((result) => {
                    if (result.isConfirmed) {
                    }
                  });
                this.workSaveFlag = false;
                this.workExperience.controls[0].get("organisationName").disable();
              }
            }, err => {
              this.util.stopLoader();
            });
        }, 500);
      } else if (val == "put" && par == "change") {
        this.util.startLoader();
        var obj: any = {};
        this.infoData.workExperience.forEach((ele) => {
          if (ele.badge == true) {
            obj.badge = false;

            obj.title = ele.title;
            obj.organisationName = ele.organisationName;
            obj.organisationId = ele.organisationId;
            obj.expId = ele.expId;
            obj.userId = this.userId;
            obj.currentOrganization = ele.currentOrganization;
            obj.startMonth = ele.startMonth;
            obj.startYear = ele.startYear;
            obj.endMonth = ele.endMonth;
            obj.endYear = ele.endYear;
            obj.state = ele.state;
            obj.city = ele.city;
            obj.zipcode = ele.zipcode;
            // obj.// street = ele.// street
            obj.country = ele.country;
          }
        });

        this.util.startLoader();
        setTimeout(() => {
          this.api.updatePut("user/v1/workexperience", obj).subscribe((res) => {
            if (res.code == "00000") {
              this.api
                .updatePut(
                  "user/v1/workexperience",
                  this.workExperience.getRawValue()[0]
                )
                .subscribe((res) => {
                  if (res.code == "00000") {
                    this.util.stopLoader();
                    this.commonVariables.expId =
                      this.workExperience.value[0].expId;
                    this.searchData.setCommonVariables(this.commonVariables);
                    this.util.startLoader();
                    this.curOrgValidity("work");
                    this.infoData.workExperience.splice(this.workIndex, 1, {
                      organisationName: this.workExperience.getRawValue()[0].organisationName,
                      title: this.workExperience.getRawValue()[0].title,
                      city: this.workExperience.getRawValue()[0].city,
                      state: this.workExperience.getRawValue()[0].state,
                      country: this.workExperience.getRawValue()[0].country,
                      startMonth: this.workExperience.getRawValue()[0].startMonth,
                      startYear: this.workExperience.getRawValue()[0].startYear,
                      endMonth: this.workExperience.getRawValue()[0].endMonth,
                      endYear: this.workExperience.getRawValue()[0].endYear,
                      businessId: this.infoData.workExperience[this.workIndex].businessId,
                      badge: this.infoData.workExperience[this.workIndex].badge,
                      clientType: this.infoData.workExperience[this.workIndex].clientType,
                      currentOrganization: this.infoData.workExperience[this.workIndex].currentOrganization,
                      expId: this.infoData.workExperience[this.workIndex].expId,
                      userId: this.infoData.workExperience[this.workIndex].userId
                    })

                    this.onHideWrkMandTemp();
                    this.modalRef.hide();

                    this.reload('workExperience');
                  } else {
                    this.showErrors(res);
                  }
                }, err => {
                  this.util.stopLoader();
                });
            } else if (res.code == "99998") {
              this.util.stopLoader();
              const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                  confirmButton: 'btn btn-success',
                  cancelButton: 'btn btn-danger'
                },
                buttonsStyling: false
              })

              swalWithBootstrapButtons.fire({
                title: 'Oops..',
                text: "You already have a current organization. Changing your current organization to a new work place requires you to authenticate a new business email address for the organization. Would you like to proceed?",
                icon: 'info',
                showCancelButton: true,
                confirmButtonText: 'Yes',
                cancelButtonText: 'No',
                reverseButtons: true
              })
                .then((result) => {
                  if (result.isConfirmed) {
                    this.initiateEmailDomainValidator()
                  } else if (result.isDenied) {

                  }
                });
              this.workSaveFlag = false;
              // this.workExperience.controls[0]
              //   .get("organisationName")
              //   .disable();
            } else if (res.code == "99996") {
              this.util.stopLoader();
              Swal.fire({
                title: "Oops..",
                text: "Sorry, one current organization is at least needed for your user type. ",
                icon: "error",
                // timer: 3000,
                confirmButtonText: "Ok",
                // denyButtonText: "No"
              }).then((result) => {
                if (result.isConfirmed) {
                  this.workExperience.controls[0].patchValue({
                    currentOrganization: false,
                    badge: false
                  })
                }
              });
            } else if (res.code == "10001") {
              this.util.stopLoader();
              const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                  confirmButton: "btn btn-success",
                  denyButton: 'btn btn-danger'
                },
                buttonsStyling: false,
              });
              swalWithBootstrapButtons
                .fire({
                  title: "Are you sure you want to change?",
                  text: "You are the super admin to the other current organization in your work experience. Changing the current organization will delete the business page of the organization. Would you like to proceed?",
                  icon: "info",
                  // timer: 3000,
                  showDenyButton: true,
                  confirmButtonText: "Yes",
                  denyButtonText: "No"
                })
                .then((result) => {
                  if (result.isConfirmed) {
                    var expp = this.workExperience.getRawValue()[0]
                    expp.action = "APPROVED"
                    this.api
                      .updatePut("user/v1/workexperience", expp)
                      .subscribe((res) => {
                        if (res.code == '00000') {

                          Swal.fire({
                            title: "Work Experience Updated",
                            text: "Changes made successfully and updated your work experience.",
                            icon: "success",
                            // timer: 2000,
                            showConfirmButton: false,

                            timer: 2000,
                          }).then(() => {
                            this.reload('personalProfile')
                            this.modalService.hide(1)

                          })
                          this.modalService.hide(1);
                        } else {
                          this.util.stopLoader()
                          const swalWithBootstrapButtons = Swal.mixin({
                            customClass: {
                              confirmButton: "btn btn-success",
                              // cancelButton: 'btn btn-danger'
                            },
                            buttonsStyling: false,
                          });
                          swalWithBootstrapButtons
                            .fire({
                              title: "Oops..",
                              text: res["message"],
                              icon: "error",
                              // timer: 3000,
                              confirmButtonText: "OK",
                            })
                            .then((result) => {
                              if (result.isConfirmed) {
                              }
                            });
                          this.workSaveFlag = false;
                          this.workExperience.controls[0]
                            .get("organisationName")
                            .disable();
                        }
                      })
                  } else if (result.isDenied) {
                  }
                });
              this.workSaveFlag = false;
            } else if (res.code == "10002") {
              this.util.stopLoader();
              Swal.fire({
                text: "You are the super admin of the business page. You have to transfer super admin rights to other members before changing your current organization.",
                title: "Cannot change current organization",
                icon: "error",
                confirmButtonText: "Ok",
              })
            } else {
              this.util.stopLoader();
              const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                  confirmButton: "btn btn-success",
                  // cancelButton: 'btn btn-danger'
                },
                buttonsStyling: false,
              });
              swalWithBootstrapButtons
                .fire({
                  title: "Oops..",
                  text: res["message"],
                  icon: "error",
                  timer: 3000,
                  confirmButtonText: "OK",
                })
                .then((result) => {
                  if (result.isConfirmed) {
                  }
                });
              this.workSaveFlag = false;
              this.workExperience.controls[0].get("organisationName").disable();
            }
          });
        }, 500);
      } else if (val == "add" && par == "nochange") {
        this.util.startLoader();
        this.api
          .create("user/v1/workexperience", this.workExperience.getRawValue()[0])
          .subscribe((res) => {
            if (res.code == "00000") {
              this.modalRef.hide();
              this.reload();
              this.curOrgValidity("work");
              this.onHideWrkMandTemp();
              this.infoData.workExperience.push(
                {
                  organisationName: this.workExperience.getRawValue()[0].organisationName,
                  title: this.workExperience.getRawValue()[0].title,
                  city: this.workExperience.getRawValue()[0].city,
                  state: this.workExperience.getRawValue()[0].state,
                  country: this.workExperience.getRawValue()[0].country,
                  startMonth: this.workExperience.getRawValue()[0].startMonth,
                  startYear: this.workExperience.getRawValue()[0].startYear,
                  endMonth: this.workExperience.getRawValue()[0].endMonth,
                  endYear: this.workExperience.getRawValue()[0].endYear,
                  businessId: this.infoData.workExperience[this.workIndex].businessId != null ? this.infoData.workExperience[this.workIndex].businessId : null,
                  badge: this.infoData.workExperience[this.workIndex].badge,
                  clientType: this.infoData.workExperience[this.workIndex].clientType,
                  currentOrganization: this.infoData.workExperience[this.workIndex].currentOrganization,
                  expId: this.infoData.workExperience[this.workIndex].expId,
                  userId: this.infoData.workExperience[this.workIndex].userId
                }
              );
              this.util.stopLoader();
            }
            else if (res.code == "99998") {
              this.util.stopLoader();
              const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                  confirmButton: 'btn btn-success',
                  cancelButton: 'btn btn-danger'
                },
                buttonsStyling: false
              })

              swalWithBootstrapButtons.fire({
                title: 'Oops..',
                text: "You already have a current organization. Changing your current organization to a new work place requires you to authenticate a new business email address for the organization. Would you like to proceed?",
                icon: 'info',
                showCancelButton: true,
                confirmButtonText: 'Yes',
                cancelButtonText: 'No',
                reverseButtons: true
              })
                .then((result) => {
                  if (result.isConfirmed) {
                    this.initiateEmailDomainValidator()
                  } else if (result.isDenied) {

                  }
                });
              this.workSaveFlag = false;
              // this.workExperience.controls[0]
              //   .get("organisationName")
              //   .disable();
            } else if (res.code == "99996") {
              this.util.stopLoader();
              Swal.fire({
                title: "Oops..",
                text: "Sorry, one current organization is at least needed for your user type. ",
                icon: "error",
                // timer: 3000,
                confirmButtonText: "Ok",
                // denyButtonText: "No"
              }).then((result) => {
                if (result.isConfirmed) {
                  this.workExperience.controls[0].patchValue({
                    currentOrganization: false,
                    badge: false
                  })
                }
              });
            } else if (res.code == "10001") {
              this.util.stopLoader();
              const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                  confirmButton: "btn btn-success",
                  denyButton: 'btn btn-danger'
                },
                buttonsStyling: false,
              });
              swalWithBootstrapButtons
                .fire({
                  title: "Are you sure you want to change?",
                  text: "You are the super admin to the other current organization in your work experience. Changing the current organization will delete the business page of the organization. Would you like to proceed?",
                  icon: "info",
                  // timer: 3000,
                  showDenyButton: true,
                  confirmButtonText: "Yes",
                  denyButtonText: "No"
                })
                .then((result) => {
                  if (result.isConfirmed) {
                    var expp = this.workExperience.getRawValue()[0]
                    expp.action = "APPROVED"
                    this.api
                      .create("user/v1/workexperience", expp)
                      .subscribe((res) => {
                        if (res.code == '00000') {
                          Swal.fire({
                            title: "Work Experience Updated",
                            text: "Changes made successfully and updated your work experience.",
                            icon: "success",
                            showConfirmButton: false,

                            timer: 2000,

                          }).then(() => {
                            this.reload('personalProfile')
                            this.modalService.hide(1)
                          })
                        } else {
                          this.showErrors(res);
                        }
                      })
                  } else if (result.isDenied) {
                  }
                });
              this.workSaveFlag = false;
            } else if (res.code == "10002") {
              this.util.stopLoader();
              Swal.fire({
                text: "You are the super admin of the business page. You have to transfer super admin rights to other members before changing your current organization.",
                title: "Cannot change current organization",
                icon: "error",
                confirmButtonText: "Ok",
              })
            } else {
              this.util.stopLoader();
              const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                  confirmButton: "btn btn-success",
                  // cancelButton: 'btn btn-danger'
                },
                buttonsStyling: false,
              });
              swalWithBootstrapButtons
                .fire({
                  title: "Oops..",
                  text: res["message"],
                  icon: "error",
                  confirmButtonText: "OK",
                  timer: 3000,
                })
                .then((result) => {
                  if (result.isConfirmed) {
                  }
                });
              this.workSaveFlag = false;
              this.workExperience.controls[0].get("organisationName").disable();
            }
          }, err => {
            this.util.stopLoader();
          });

      } else if (val == "add" && par == "change") {
        this.util.startLoader();
        this.infoData.workExperience.forEach((ele) => {
          if (ele.badge == true) {
            var obj: any = {};
            obj.title = ele.title;
            obj.organisationName = ele.organisationName;
            obj.organisationId = ele.organisationId;
            obj.expId = ele.expId;
            obj.userId = this.userId;
            obj.currentOrganization = ele.currentOrganization;
            obj.startMonth = ele.startMonth;
            obj.startYear = ele.startYear;
            obj.endMonth = ele.endMonth;
            obj.endYear = ele.endYear;
            obj.state = ele.state;
            obj.city = ele.city;
            obj.zipcode = ele.zipcode;
            obj.badge = false;
            // obj.// street = ele.// street
            obj.country = ele.country;
            this.api
              .updatePut("user/v1/workexperience", obj)
              .subscribe((res) => {
                if (res.code == "00000") {
                  this.util.stopLoader();

                  this.util.startLoader();
                  setTimeout(() => {
                    this.api
                      .create(
                        "user/v1/workexperience",
                        this.workExperience.getRawValue()[0]
                      )
                      .subscribe((res) => {
                        if (res.code == "00000") {
                          this.util.stopLoader();
                          this.commonVariables.expId =
                            this.workExperience.value[0].expId;
                          this.searchData.setCommonVariables(
                            this.commonVariables
                          );
                          this.curOrgValidity("work");
                          this.infoData.workExperience.push(
                            {
                              organisationName: this.workExperience.getRawValue()[0].organisationName,
                              title: this.workExperience.getRawValue()[0].title,
                              city: this.workExperience.getRawValue()[0].city,
                              state: this.workExperience.getRawValue()[0].state,
                              country: this.workExperience.getRawValue()[0].country,
                              startMonth: this.workExperience.getRawValue()[0].startMonth,
                              startYear: this.workExperience.getRawValue()[0].startYear,
                              endMonth: this.workExperience.getRawValue()[0].endMonth,
                              endYear: this.workExperience.getRawValue()[0].endYear,
                              businessId: this.infoData.workExperience[this.workIndex].businessId,
                              badge: this.infoData.workExperience[this.workIndex].badge,
                              clientType: this.infoData.workExperience[this.workIndex].clientType,
                              currentOrganization: this.infoData.workExperience[this.workIndex].currentOrganization,
                              expId: this.infoData.workExperience[this.workIndex].expId,
                              userId: this.infoData.workExperience[this.workIndex].userId
                            }
                          )

                          this.onHideWrkMandTemp();
                          this.modalRef.hide();
                          this.reload('workExperience')
                        } else if (res.code == "99998") {
                          this.util.stopLoader();
                          const swalWithBootstrapButtons = Swal.mixin({
                            customClass: {
                              confirmButton: 'btn btn-success',
                              cancelButton: 'btn btn-danger'
                            },
                            buttonsStyling: false
                          })

                          swalWithBootstrapButtons.fire({
                            title: 'Oops..',
                            text: "You already have a current organization. Changing your current organization to a new work place requires you to authenticate a new business email address for the organization. Would you like to proceed?",
                            icon: 'info',
                            showCancelButton: true,
                            confirmButtonText: 'Yes',
                            cancelButtonText: 'No',
                            reverseButtons: true
                          })
                            .then((result) => {
                              if (result.isConfirmed) {
                                this.initiateEmailDomainValidator()
                              } else if (result.isDenied) {

                              }
                            });
                          this.workSaveFlag = false;
                          // this.workExperience.controls[0]
                          //   .get("organisationName")
                          //   .disable();
                        } else if (res.code == "99996") {
                          this.util.stopLoader();
                          Swal.fire({
                            title: "Oops..",
                            text: "Sorry, one current organization is at least needed for your user type. ",
                            icon: "error",
                            // timer: 3000,
                            confirmButtonText: "Ok",
                            // denyButtonText: "No"
                          }).then((result) => {
                            if (result.isConfirmed) {
                              this.workExperience.controls[0].patchValue({
                                currentOrganization: false,
                                badge: false
                              })
                            }
                          });
                        } else if (res.code == "10001") {
                          this.util.stopLoader();
                          const swalWithBootstrapButtons = Swal.mixin({
                            customClass: {
                              confirmButton: "btn btn-success",
                              denyButton: 'btn btn-danger'
                            },
                            buttonsStyling: false,
                          });
                          swalWithBootstrapButtons
                            .fire({
                              title: "Are you sure you want to change?",
                              text: "You are the super admin to the other current organization in your work experience. Changing the current organization will delete the business page of the organization. Would you like to proceed?",
                              icon: "info",
                              // timer: 3000,
                              showDenyButton: true,
                              confirmButtonText: "Yes",
                              denyButtonText: "No"
                            })
                            .then((result) => {
                              if (result.isConfirmed) {
                                var expp = this.workExperience.getRawValue()[0]
                                expp.action = "APPROVED"
                                this.api
                                  .create("user/v1/workexperience", expp)
                                  .subscribe((res) => {
                                    Swal.fire({
                                      title: "Work Experience Updated",
                                      text: "Changes made successfully and updated your work experience.",
                                      icon: "success",
                                      showConfirmButton: false,

                                      timer: 2000,

                                    }).then(() => {
                                      this.reload('personalProfile')
                                      this.modalService.hide(1)
                                    })
                                  })
                              } else if (result.isDenied) {
                              }
                            });
                          this.workSaveFlag = false;
                        } else if (res.code == "10002") {
                          this.util.stopLoader();
                          Swal.fire({
                            text: "You are the super admin of the business page. You have to transfer super admin rights to other members before changing your current organization.",
                            title: "Cannot change current organization",
                            icon: "error",
                            confirmButtonText: "Ok",
                          })
                        } else {
                          this.util.stopLoader();
                          // Swal.fire('', res['message'], 'error');
                          const swalWithBootstrapButtons = Swal.mixin({
                            customClass: {
                              confirmButton: "btn btn-success",
                              // cancelButton: 'btn btn-danger'
                            },
                            buttonsStyling: false,
                          });
                          // Swal.fire('', res['message'], 'error');
                          swalWithBootstrapButtons
                            .fire({
                              title: "Oops..",
                              text: res["message"],
                              icon: "error",
                              timer: 3000,
                              confirmButtonText: "OK",
                            })
                            .then((result) => {
                              if (result.isConfirmed) {
                              }
                            });
                          // this.resetData();
                          // this.ar();
                        }
                      }, err => {
                        this.util.stopLoader();

                      });

                  }, 500);
                } else if (res.code == "99998") {
                  this.util.stopLoader();
                  const swalWithBootstrapButtons = Swal.mixin({
                    customClass: {
                      confirmButton: 'btn btn-success',
                      cancelButton: 'btn btn-danger'
                    },
                    buttonsStyling: false
                  })

                  swalWithBootstrapButtons.fire({
                    title: 'Oops..',
                    text: "You already have a current organization. Changing your current organization to a new work place requires you to authenticate a new business email address for the organization. Would you like to proceed?",
                    icon: 'info',
                    showCancelButton: true,
                    confirmButtonText: 'Yes',
                    cancelButtonText: 'No',
                    reverseButtons: true
                  })
                    .then((result) => {
                      if (result.isConfirmed) {
                        this.initiateEmailDomainValidator()
                      } else if (result.isDenied) {

                      }
                    });
                  this.workSaveFlag = false;
                  // this.workExperience.controls[0]
                  //   .get("organisationName")
                  //   .disable();
                } else if (res.code == "99996") {
                  this.util.stopLoader();
                  Swal.fire({
                    title: "Oops..",
                    text: "Sorry, one current organization is at least needed for your user type. ",
                    icon: "error",
                    // timer: 3000,
                    confirmButtonText: "Ok",
                    // denyButtonText: "No"
                  }).then((result) => {
                    if (result.isConfirmed) {
                      this.workExperience.controls[0].patchValue({
                        currentOrganization: false,
                        badge: false
                      })
                    }
                  });
                }
                // else if (res.code == "99999") {
                //   this.util.stopLoader();
                //   // this.changeCurrentOrg();
                // }
                else if (res.code == "10001") {
                  this.util.stopLoader();
                  const swalWithBootstrapButtons = Swal.mixin({
                    customClass: {
                      confirmButton: "btn btn-success",
                      denyButton: 'btn btn-danger'
                    },
                    buttonsStyling: false,
                  });
                  swalWithBootstrapButtons
                    .fire({
                      title: "Are you sure you want to change?",
                      text: "You are the super admin to the other current organization in your work experience. Changing the current organization will delete the business page of the organization. Would you like to proceed?",
                      icon: "info",
                      // timer: 3000,
                      showDenyButton: true,
                      confirmButtonText: "Yes",
                      denyButtonText: "No"
                    })
                    .then((result) => {
                      if (result.isConfirmed) {
                        var expp = this.workExperience.getRawValue()[0]
                        expp.action = "APPROVED"
                        this.api
                          .updatePut("user/v1/workexperience", expp)
                          .subscribe((res) => {
                            if (res.code == '00000') {
                              Swal.fire({
                                title: "Work Experience Updated",
                                text: "Changes made successfully and updated your work experience.",
                                icon: "success",
                                showConfirmButton: false,

                                timer: 2000,

                              }).then(() => {
                                this.reload('personalProfile')
                                this.modalService.hide(1)
                              })
                            } else {
                              this.util.stopLoader()
                              this.showErrors(res);
                            }
                          })
                      } else if (result.isDenied) {
                      }
                    });
                  this.workSaveFlag = false;
                } else if (res.code == "10002") {
                  this.util.stopLoader();
                  Swal.fire({
                    text: "You are the super admin of the business page. You have to transfer super admin rights to other members before changing your current organization.",
                    title: "Cannot change current organization",
                    icon: "error",
                    confirmButtonText: "Ok",
                  })
                } else {
                  this.util.stopLoader();
                  const swalWithBootstrapButtons = Swal.mixin({
                    customClass: {
                      confirmButton: "btn btn-success",
                      // cancelButton: 'btn btn-danger'
                    },
                    buttonsStyling: false,
                  });
                  swalWithBootstrapButtons
                    .fire({
                      title: "Oops..",
                      text: res["message"],
                      timer: 3000,
                      icon: "error",
                      confirmButtonText: "OK",
                    })
                    .then((result) => {
                      if (result.isConfirmed) {
                      }
                    });
                  this.workSaveFlag = false;
                  this.workExperience.controls[0]
                    .get("organisationName")
                    .disable();
                }
              }, err => {
                this.util.stopLoader();
              });
          }
        });
      }
    }
  }

  thisBadgeShown: boolean = false
  // changeCurrentOrg() {
  //   const swalWithBootstrapButtons = Swal.mixin({
  //     customClass: {
  //       confirmButton: "btn btn-success",
  //       cancelButton: "btn btn-danger",
  //     },
  //     buttonsStyling: false,
  //   });

  //   swalWithBootstrapButtons
  //     .fire({
  //       title: "Are you sure?",
  //       text: "You can't have two current organization checked in one work place. Would you like to use this data for your current organization and uncheck the other?",
  //       icon: "warning",
  //       showCancelButton: true,
  //       confirmButtonText: "Yes",
  //       cancelButtonText: "No",
  //       reverseButtons: true,
  //     })
  //     .then((result) => {
  //       if (result.isConfirmed) {
  //         var expId = this.workExperience.value[0].expId;
  //         var organisationId = this.workExperience.value[0].organisationId;

  //         this.infoData.workExperience.forEach((ele) => {
  //           if (ele.organisationId == organisationId) {
  //             if(ele.badge == true){
  //               this.thisBadgeShown = true
  //             }else{
  //               this.thisBadgeShown = false
  //             }
  //             ele.currentOrganization = false;
  //             ele.badge = false;
  //             this.util.startLoader();
  //             this.api
  //               .updatePut("user/v1/workexperience", ele)
  //               .subscribe((res) => {
  //                 if (res.code == "00000") {
  //                   if(this.thisBadgeShown == true){
  //                     this.workExperience.controls[0].patchValue({badge: true})
  //                   }
  //                   this.api
  //                     .create(
  //                       "user/v1/workexperience",
  //                       this.workExperience.getRawValue()[0]
  //                     )
  //                     .subscribe((res) => {
  //                       if (res.code == "00000") {
  //                         this.util.stopLoader();
  //                       }else{
  //                         this.util.stopLoader();
  //                       }
  //                     });
  //                 } else {
  //                   this.util.stopLoader();
  //                   const swalWithBootstrapButtons = Swal.mixin({
  //                     customClass: {
  //                       confirmButton: "btn btn-success",
  //                       // cancelButton: 'btn btn-danger'
  //                     },
  //                     buttonsStyling: false,
  //                   });
  //                   swalWithBootstrapButtons
  //                     .fire({
  //                       title: "Oops..",
  //                       text: res["message"],
  //                       icon: "error",
  //                       timer: 3000,
  //                       confirmButtonText: "OK",
  //                     })
  //                     .then((result) => {
  //                       if (result.isConfirmed) {
  //                       }
  //                     });
  //                   this.workSaveFlag = false;
  //                   this.workExperience.controls[0]
  //                     .get("organisationName")
  //                     .disable();
  //                 }
  //               });
  //           }
  //         });
  //       } else if (result.dismiss === Swal.DismissReason.cancel) {
  //       }
  //     });
  // }

  showErrors(res) {
    this.util.stopLoader()
    this.workExperience.controls[0]
      .get("organisationName")
      .disable();
    this.util.stopLoader()
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        // cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false,
    });
    swalWithBootstrapButtons
      .fire({
        title: "Oops..",
        text: res["message"],
        icon: "error",
        timer: 3000,
        confirmButtonText: "OK",
      })
      .then((result) => {
        if (result.isConfirmed) {
        }
      });
    this.workSaveFlag = false;
    this.workExperience.controls[0].get("organisationName").disable();
  }

  digitKeyOnly(e) {
    var keyCode = e.keyCode == 0 ? e.charCode : e.keyCode;
    if ((keyCode >= 37 && keyCode <= 40) || (keyCode == 8 || keyCode == 9 || keyCode == 13) || (keyCode >= 48 && keyCode <= 57)) {
      return true;
    }
    return false;
  }

  scrollToFirstInvalidControl() {
    const firstInvalidControl: HTMLElement =
      this.el.nativeElement.querySelector("form .ng-invalid");
    // firstInvalidControl.focus(); //without smooth behavior
    window.scroll({
      top: this.getTopOffset(firstInvalidControl),
      left: 0,
      behavior: "smooth",
    });
  }

  private getTopOffset(controlEl: HTMLElement): number {
    const labelOffset = 50;
    return controlEl.getBoundingClientRect().top + window.scrollY - labelOffset;
  }

  workIndex: any = 0;
  isSuperAdmin: boolean = false
  isSuperAdmin1: boolean = true;
  PassWorkExperienceDetails: Partial<WorkExperience> = {};
  availableWorkExp: Array<WorkExperience> = [];
  button: string = "";


  experEdit(template: TemplateRef<any>, index, value) {

    this.commonVariables.similarOrgFlag = false
    this.searchData.setCommonVariables(this.commonVariables);
    this.availableWorkExp = Array.isArray(this.infoData.workExperience) && this.infoData.workExperience;
    if (value == "edit") {
      this.PassWorkExperienceDetails = Array.isArray(this.infoData.workExperience) && this.infoData.workExperience[index];
      this.button = "Update";
      // this.workIndex = index;
      this.experEditFlag = true;
      this.experAddFlag = false;
      // this.getStates();
      // this.workExperience.controls = [];
      // this.addWorkExperience();

      // this.timeZonecountryvalues(this.infoData.workExperience[index].country);

      this.workSaveFlag = false;
      this.modalRef = this.modalService.show(template, this.backdropConfig);
      // this.eperienceForm.reset();

      // this.workExperience.at(0).patchValue(this.infoData.workExperience[index]);
      // // this.previousClientTypeValue = this.workExperience.controls[0].get('clientType').value;
      // this.temp.city = this.infoData.workExperience[index].city;
      // this.temp.state = this.infoData.workExperience[index].state;
      // this.temp.country = this.infoData.workExperience[index].country;
      // this.temp.zipCode = this.infoData.workExperience[index].zipcode;
      // this.temp.organisationName = this.infoData.workExperience[index].organisationName;
      // this.temp.timeZone = this.infoData.workExperience[index].timeZone;
      // this.workExperience.at(0).patchValue({ "timeZone": this.infoData.workExperience[index].timeZone });

      // if (this.infoData.workExperience[index].badge == true) {
      //   this.showThisBoolean == true;
      // } else if (this.infoData.workExperience[index].badge == false) {
      //   this.showThisBoolean == false;
      // }

      // if (this.infoData.workExperience[index].currentOrganization == true) {
      //   this.workExperience.controls[0].get("endMonth").clearValidators();
      //   this.workExperience.controls[0].get("endMonth").updateValueAndValidity();
      //   this.workExperience.controls[0].get("endYear").clearValidators();
      //   this.workExperience.controls[0].get("endYear").updateValueAndValidity();
      // }
      // var data: any = {}
      // data.businessId = this.infoData.workExperience[index].businessId
      // data.userId = this.userId
      // data.organisationId = this.infoData.workExperience[index].organisationId
      // this.util.startLoader()
      // this.api.create('business/find/superadmin', data).subscribe(res => {
      //   if (res.code == '0000') {
      //     this.util.stopLoader()
      //     this.isSuperAdmin = true
      //     this.isSuperAdmin1 = true
      //     this.workExperience.controls[0].get("city").disable()
      //     this.workExperience.controls[0].get("state").disable()
      //     this.workExperience.controls[0].get("country").disable()
      //     this.workExperience.controls[0].get("zipcode").disable()
      //   } else {
      //     this.util.stopLoader()
      //     this.isSuperAdmin = false
      //     this.isSuperAdmin1 = false
      //   }
      // }, err => {
      //   this.util.stopLoader()
      //   if (err.status == 500) {
      //     this.util.stopLoader();
      //     Swal.fire({
      //       icon: "error",
      //       title: "Oops...",
      //       text: 'Something went wrong while fetching data. Please, try again later.',
      //       showDenyButton: false,
      //       confirmButtonText: `ok`,
      //     })
      //   }
      // })
    } else if (value == "add") {
      this.button = "Submit";
      this.modalRef = this.modalService.show(template, this.backdropConfig);
    }
  }

  editedExperience(item: PROFILE_LISTENER): void {
    if (item.content.includes("SUCESS")) {
      if (item.data.currentOrganization) {
        this.profileBannerUpdate.emit(item.data);
      }else{
        this.profileBannerUpdate.emit(null);
      }

      this.updateWorkExperienceData(item.data, item.content.includes("UPDATE") ? "UPDATE" : "ADD");
    }

  }

  messagemodelflag = false;
  messageData : any
  closeMessage(){
    this.messagemodelflag =  false;
  }

  updateSupportModule() {

    let module = new jobModuleConfig(this.openSupport);
    module.tabName = "job-details";
    module.source = this;
    this.supportModal = module;
  }

  openSupport(){
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



  candidateJobTitleList: any = []
  timezoneslist: any = []
  // getTitlesList() {
  //   // var data: any = {}
  //   var data = { "domain": "GIGSUMO_SKILLS_LIST,GIGSUMO_JOB_TITLE"}
  //   this.candidateJobTitleList = []
  //   this.util.startLoader()
  //   this.api.create('listvalue/findbyList', data).subscribe(res => {
  //     if (res.code == '00000') {
  //       this.util.stopLoader()
  //       res.data.GIGSUMO_JOB_TITLE.listItems.forEach(ele => {
  //         this.candidateJobTitleList.push(ele.item)
  //       })
  //     }
  //   })
  // }



  checkCurOrg() {
    var a = this.infoData.workExperience.findIndex((x) => x.badge == true);
    this.commonVariables.expId = "";
    this.searchData.setCommonVariables(this.commonVariables);
    this.infoData.workExperience.forEach((ele) => {
      if (ele.badge == true) {
        this.commonVariables.expId = ele.expId;
        this.searchData.setCommonVariables(this.commonVariables);
      }
    });
    if (a != "-1") {
      // this.currentIndex = a
      this.searchData.setCurrentOrg(a);
      // this.showThisOrg = true
      // this.noOrgSelected = false
      this.commonVariables.showThisOrg = true;
      this.commonVariables.noOrgSelected = false;
      this.commonVariables.orgSelected = true;
      this.searchData.setCommonVariables(this.commonVariables);
      this.hide = true;
    } else if (a == "-1") {
      // this.currentIndex= null
      this.searchData.setCurrentOrg(null);
      // this.showThisOrg = false
      // this.noOrgSelected = true
      this.commonVariables.showThisOrg = false;
      this.commonVariables.noOrgSelected = true;
      this.commonVariables.orgSelected = false;
      this.searchData.setCommonVariables(this.commonVariables);
      this.hide = false;
    }
  }

  curOrgValidity(value) {
    if (value == "work") {
      // var a = this.infoData.workExperience.findIndex(x => x.badge == true)
      var a = this.workExperience.value.findIndex((x) => x.badge == true);
      this.commonVariables.expId = "";
      this.searchData.setCommonVariables(this.commonVariables);
      this.infoData.workExperience.forEach((ele) => {
        if (ele.badge == true) {
          this.commonVariables.expId = ele.expId;
          this.searchData.setCommonVariables(this.commonVariables);
        }
      });

      if (a != "-1") {
        // this.showThisOrg = true
        this.commonVariables.showThisOrg = true;
        this.commonVariables.noOrgSelected = false;
        this.commonVariables.orgSelected = true;
        this.searchData.setCommonVariables(this.commonVariables);
        // this.currentIndex = a
        this.searchData.setCurrentOrg(a);
        this.hide = true;
      } else if (a == "-1") {
        // this.showThisOrg = false
        this.commonVariables.showThisOrg = false;
        this.commonVariables.noOrgSelected = true;
        this.commonVariables.orgSelected = false;
        this.searchData.setCommonVariables(this.commonVariables);
        // this.currentIndex = null
        this.searchData.setCurrentOrg(null);
        this.hide = false;
      }
    } else if (value == "edu") {
      // var a = this.infoData.educationDetail.findIndex(
      //   (x) => x.currentlyPursued == true
      // );
      // if (a != "-1") {
      //   // //// console.log("current isnti exist ")
      //   // this.currentInstitute = true
      //   this.commonVariables.currentInstitute = true;
      //   this.searchData.setCommonVariables(this.commonVariables);
      //   // this.curIndex = a
      //   this.searchData.setCurrentInst(a);
      //   this.hide1 = true;
      // } else {
      //   // //// console.log("current isnti doesnt exist ")
      //   // this.currentInstitute = false
      //   this.commonVariables.currentInstitute = false;
      //   this.searchData.setCommonVariables(this.commonVariables);
      //   // this.curIndex = null
      //   this.searchData.setCurrentInst(null);
      //   this.hide1 = false;
      // }
    }
  }

  getStates() {
    this.stateListIN = [];
    this.util.startLoader();
    this.api
      .query("country/getAllStates?countryCode=" + "IN")
      .subscribe((res) => {
        if (res) {
          this.util.stopLoader();
          this.stateListIN = res;
        }
      }, err => {
        this.util.stopLoader();
      });
    this.stateListCA = [];
    this.util.startLoader()
    this.api
      .query("country/getAllStates?countryCode=" + "CA")
      .subscribe((res) => {
        if (res) {
          this.util.stopLoader()
          this.stateListCA = res;
        }
      }, err => {
        this.util.stopLoader();
      });
    this.stateListCA = [];
    this.util.startLoader()
    this.api
      .query("country/getAllStates?countryCode=" + "AU")
      .subscribe((res) => {
        if (res) {
          this.util.stopLoader()
          this.stateListAU = res;
        }
      }, err => {
        this.util.stopLoader();
      });
  }

  socialPresenceSave() {
    this.socialSaveFlag = true;
    this.util.startLoader();
    this.infoData.socialPresence = {
      linkedin: this.socialPresenceForm.value.linkedin,
      twitter: this.socialPresenceForm.value.twitter,
      facebook: this.socialPresenceForm.value.facebook,
      blogURL: this.socialPresenceForm.value.blogURL,
      alternamePageLink: this.socialPresenceForm.value.alternamePageLink
    }



    this.api.create("user/saveUser", this.infoData).subscribe((res) => {
      if (res.code == '00000') {
        this.infoData.socialPresence.linkedin = this.socialPresenceForm.value.linkedin;
        this.infoData.socialPresence.twitter = this.socialPresenceForm.value.twitter;
        this.infoData.socialPresence.facebook = this.socialPresenceForm.value.facebook;
        this.infoData.socialPresence.blogURL = this.socialPresenceForm.value.blogURL;
        this.infoData.socialPresence.alternamePageLink = this.socialPresenceForm.value.alternamePageLink;
        this.linkedin = this.socialPresenceForm.value.linkedin;
        this.twitter = this.socialPresenceForm.value.twitter;
        this.facebook = this.socialPresenceForm.value.facebook;
        this.blogURL = this.socialPresenceForm.value.blogURL;
        this.alternamePageLink = this.socialPresenceForm.value.alternamePageLink;
        this.util.stopLoader();
      }
    }, err => {
      this.util.stopLoader()
      if (err.status == 500) {
        this.util.stopLoader();
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: 'Something went wrong while saving your details. Please, try again later.',
          showDenyButton: false,
          confirmButtonText: `ok`,
        })
      }
    });
    this.modalRef.hide();
  }

  physicianSave() {
    // //// console.log(this.physicianForm.value.conditions.length);

    this.physicianFlags = true;

    if (this.physicianForm.value.conditions.length == 0) {
    } else if (this.physicianForm.value.insurance.length == 0) {
    } else if (this.physicianForm.valid) {
      this.physicianFlags = false;
      if (
        this.infoData.physicianData == null ||
        this.infoData.physicianData == undefined ||
        this.infoData.physicianData == ""
      ) {
        let obj: any = {};
        (obj.privatePay = this.physicianForm.value.privatePay),
          (obj.conditions = this.physicianForm.value.conditions),
          (obj.insurance = this.physicianForm.value.insurance),
          (obj.patientAcceptance = this.physicianForm.value.patientAcceptance);

        this.infoData.physicianData = obj;
      } else {
        this.infoData.physicianData.conditions =
          this.physicianForm.value.conditions;
        this.infoData.physicianData.privatePay =
          this.physicianForm.value.privatePay;
        this.infoData.physicianData.insurance =
          this.physicianForm.value.insurance;
        this.infoData.physicianData.patientAcceptance =
          this.physicianForm.value.patientAcceptance;
      }
      this.util.startLoader();
      this.api.create("user/saveUser", this.infoData).subscribe((res) => {
        if (res.code == "00000") {
          this.util.stopLoader();
          this.conditions = this.physicianForm.value.conditions;
          this.privatePay = this.physicianForm.value.privatePay;
          this.insurance = this.physicianForm.value.insurance;
          this.patientAcceptance = this.physicianForm.value.patientAcceptance;
          this.modalRef.hide();
        } else if (res.code == "99999") {
          this.util.stopLoader()
          this.modalRef.hide();
        }
      }, err => {
        this.util.stopLoader()
        if (err.status == 500) {
          this.util.stopLoader();
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: 'Something went wrong while saving your details. Please, try again later.',
            showDenyButton: false,
            confirmButtonText: `ok`,
          })
        }
      });
    } else {
      // this.scrollToFirstInvalidControl()
    }
  }

  addWorkExperience() {
    this.workExperience = this.eperienceForm.get("workExperience") as UntypedFormArray;
    this.workExperience.push(this.createWorkExperience());
    if (this.workExperience.controls[0].get('timeZone') != null && this.userType == "JOB_SEEKER" && this.showThisBoolean != true) {
      this.workExperience.controls[0].get('timeZone').clearValidators()
      this.workExperience.controls[0].get('timeZone').updateValueAndValidity()
    }

  }

  get isUserHasWorkExperience(): boolean {
    return this.infoData.workExperience != null && this.infoData.workExperience.length > 0;
  }

  superAdminChecking(workExpData: WorkExperience) {
    this.util.startLoader();
    let data = { userId: workExpData.userId, organisationId: workExpData.organisationId };
    this.gigsumoService.isSuperAdmin(data).subscribe(Adminresponse => {

      if (Adminresponse && Adminresponse.code === GigsumoConstants.SUCESSCODE) {
        let businessCode: BUSINESS_STATUS_CODE = Adminresponse.data ? Adminresponse.data.businessStatusCode : (Adminresponse.data === null && "00000");


        const adminData: BusinessModal = Adminresponse.data ? Adminresponse.data.businessData : null;
        if (businessCode !== "10003" && adminData && adminData.status === GigsumoConstants.INACTIVE) {
          businessCode = "10003";
        }
        this.util.stopLoader();

        if (Adminresponse.data && Adminresponse.data.businessData && Adminresponse.data.businessData.verified == GigsumoConstants.NOT_VERIFIED) {
          this.confirmDeleteExperience(workExpData);
        } else {
          this.showInfoMessage({
            AdminData: (businessCode === "10000" || businessCode === "10003" || businessCode === "00000") ? workExpData : adminData,
            content: businessCode
          });
        }
      } else {
        // Handle case where Adminresponse or Adminresponse.code is null
        console.error("Adminresponse or Adminresponse.code is null.");
        this.util.stopLoader();
      }

    });
  }

  isBusinessModalData(objects: WorkExperienceOrBusiness): objects is BusinessModal {
    return (<BusinessModal>objects).businessName !== undefined;
  }

  showInfoMessage(value: { AdminData: BusinessModal | WorkExperience, content: BUSINESS_STATUS_CODE }) {
    value.content = value.content === "10003" ? "10000" : value.content;
    let data: "NO_MEMBER" | "HAS_MEMBER" | "NOTHING";
    data = (value.content === "10000" || value.content === "00000") ? "NOTHING" : value.content === "10001" ? "NO_MEMBER" : "HAS_MEMBER";

    if (data === "NOTHING") {
      const response = this.gigsumoService.getResponseMessage("DELTING_CURRENT_ORGANIZATION");
      if (response && response.then) {
        response.then(response => {
          if (response && response.isConfirmed) {
            this.deleteWorkExperience(value.AdminData);
          }
        });
      } else {

      }
    } else {
      const response = this.gigsumoService.getResponseMessage(value.content,
      (this.isBusinessModalData(value.AdminData) && value.AdminData.businessName ));
      if (response && response.then) {
        response.then(response => {
          if (response && response.isConfirmed) {
            if (data === "NO_MEMBER") {
              this.router.navigate(['/landingPage/business']);
            } else if (data === "HAS_MEMBER" && this.isBusinessModalData(value.AdminData)) {
              let data: { businessId: string; businessName: string; menu: string } =
              {
                businessId: value.AdminData.businessId,
                businessName: value.AdminData.businessName,
                menu: "pageadmin"
              };
              this.router.navigate(["/business"], { queryParams: data });
            }
          }
        });
      } else {

      }
    }
  }

confirmDeleteExperience(work: Partial<WorkExperience>) {
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: { confirmButton: 'btn btn-success', cancelButton: 'btn btn-danger' },
    buttonsStyling: false
  })
  swalWithBootstrapButtons.fire({
    title: 'Delete Work Experience',
    text: `Are you sure you want to delete the work experience?`,
    icon: 'warning',
    showCancelButton: true,
    allowOutsideClick: false,
    allowEscapeKey: false,
    confirmButtonText: 'Yes',
    cancelButtonText: 'No',
    reverseButtons: true
  }).then((result) => {
    if (result.isConfirmed) {
      this.confirmDeleteWorkExperience(work);
    } else if (result.dismiss === Swal.DismissReason.cancel) {

    }
  });
}

  deleteWorkExperience(deleteWorkExperienceData: Partial<WorkExperience>) {
    if (deleteWorkExperienceData.currentOrganization != true) {
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: { confirmButton: 'btn btn-success', cancelButton: 'btn btn-danger' },
        buttonsStyling: false
      })
      swalWithBootstrapButtons.fire({
        title: 'Delete Work Experience',
        text: 'Are you sure you wish to delete the work experience ?',
        icon: 'warning',
        showCancelButton: true,
        allowOutsideClick: false,
        allowEscapeKey: false,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          this.confirmDeleteWorkExperience(deleteWorkExperienceData);
        } else if (result.dismiss === Swal.DismissReason.cancel) {

        }
      });

    } else {
      this.confirmDeleteWorkExperience(deleteWorkExperienceData);
    }
  }

  confirmDeleteWorkExperience(deleteWorkExperienceData: Partial<WorkExperience>) {
    this.util.startLoader();
    this.api.create("user/remove/workexp", deleteWorkExperienceData).subscribe(deleteresponse => {
      if (deleteresponse.code === GigsumoConstants.SUCESSCODE) {
        this.updateWorkExperienceData(deleteWorkExperienceData as WorkExperience, "REMOVE");
      }
      this.util.stopLoader();
    }, (error: any) => {
      this.util.stopLoader();
    });
  }




  removeWorkExperience(index) {
    let workExperienceData: Array<WorkExperience> = this.isUserHasWorkExperience && this.infoData.workExperience;


    if (this.isUserHasWorkExperience && workExperienceData[index].currentOrganization) {
      workExperienceData.forEach(workExpElement => {
        if (workExpElement.currentOrganization) {
          this.superAdminChecking(workExpElement);
        }
      });
    }
    else if (this.isUserHasWorkExperience) {
      this.deleteWorkExperience(workExperienceData[index]);
    }
  }

  updateWorkExperienceData(workExperienceData: WorkExperience, value: "ADD" | "UPDATE" | "REMOVE") {
    const { expId } = workExperienceData;
    const CurrentworkExperience = this.infoData.workExperience as Array<WorkExperience>;

    if (value === "ADD") {
      CurrentworkExperience.push(workExperienceData);
      CurrentworkExperience.sort((x, y) => {
        return (x.currentOrganization === y.currentOrganization) ? 0 : x.currentOrganization ? -1 : 1;
      });
    }
    else if (value === "UPDATE") {

      this.infoData.workExperience = CurrentworkExperience.map(element => {
        if (element.expId === expId) {
          element = workExperienceData;
        }
        return element;
      });
      this.infoData.workExperience = this.infoData.workExperience.sort((x, y) => {
        return (x.currentOrganization === y.currentOrganization) ? 0 : x.currentOrganization ? -1 : 1;
      });
    }
    else {
      CurrentworkExperience.forEach((element, index) => {
        if (element.expId === expId) {
          CurrentworkExperience.splice(index, 1);
        }
      });
    }



  }

  removeWorkIndex(value, index) {
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
        confirmButtonText: "Yes",
        cancelButtonText: "No",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.util.startLoader();
          this.api.create("user/remove/workexp", value).subscribe((res) => {
            if (res.code == "00000") {
              this.util.stopLoader();
              this.workExperience.removeAt(index);
              Swal.fire({
                icon: "success",
                title: "Work experience removed successfully",
                showConfirmButton: false,
                timer: 2000,
              });
              this.workExperience.removeAt(index);
            } else {
              this.util.stopLoader();
              const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                  confirmButton: "btn btn-success",
                  // cancelButton: 'btn btn-danger'
                },
                buttonsStyling: false,
              });
              swalWithBootstrapButtons
                .fire({
                  title: "Oops..",
                  text: res["message"],
                  timer: 3000,
                  icon: "error",
                  confirmButtonText: "OK",
                })
                .then((result) => {
                  if (result.isConfirmed) {
                  }
                });
            }
          }, err => {
            this.util.stopLoader()
            if (err.status == 500) {
              this.util.stopLoader();
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: 'Something went wrong while deleting work experience. Please, try again later.',
                showDenyButton: false,
                confirmButtonText: `ok`,
              })
            }
          });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
        }
      });
    // }
    // else {
    //   const swalWithBootstrapButtons = Swal.mixin({
    //     customClass: {
    //       confirmButton: "btn btn-success",
    //     },
    //     buttonsStyling: false,
    //   });
    //   swalWithBootstrapButtons
    //     .fire({
    //       title: "Sorry, you can't do that!",
    //       text: "You at least need one work experience",
    //       icon: "error",
    //       confirmButtonText: "OK",
    //     })
    //     .then((result) => {
    //       if (result.isConfirmed) {
    //       }
    //     });
    // }
  }

  otherExperSave() {
    this.mandateOtherWork();
    this.workSaveFlag = true;
    if (this.eperienceForm.valid) {
      this.workExperience.controls.forEach((ele) => {
        //// console.log(ele.value);
        this.util.startLoader();
        this.api
          .updatePut("user/v1/workexperience", ele.value)
          .subscribe((res) => { });
      });
      this.util.stopLoader();
      this.reload('workExperience');
    }
  }

  indexOne: boolean = false;
  indexTwo: boolean = false;
  indexZero: boolean = false;

  infoSave() {
    this.pisubmit = true;


    if (this.personalInfoForm.valid) {
      this.infoData.userType = this.personalInfoForm.value.userType;
      this.infoData.npiNo = this.personalInfoForm.value.npiNo;
      this.infoData.pitch = this.personalInfoForm.value.pitch;
      this.infoData.firstName = this.personalInfoForm.value.firstName;
      this.infoData.email = this.personalInfoForm.value.email;
      this.infoData.lastName = this.personalInfoForm.value.lastName;
      this.infoData.title = this.personalInfoForm.value.title;
      this.infoData.organisation = this.personalInfoForm.value.organisation;
      this.infoData.photo = this.photoId;
      this.img.src = AppSettings.ServerUrl + "download/" + this.infoData.photo;
      this.infoData.city = this.personalInfoForm.value.city;
      this.infoData.zipcode = this.personalInfoForm.value.zipcode;
      this.infoData.phoneNo = this.personalInfoForm.value.phoneNo;
      this.infoData.country = this.personalInfoForm.value.country;
      this.infoData.state = this.personalInfoForm.value.state;
      this.infoData.secondaryEmail = this.personalInfoForm.value.secondaryEmail;
      this.util.startLoader();
      this.api.create("user/saveUser", this.infoData).subscribe((res) => {
        if (res.code == "00000") {
          localStorage.setItem('userType', this.personalInfoForm.value.userType)
          this.util.stopLoader();
          this.modalRef.hide();

          if (res.photo != null && res.photo != "" && res.photo != undefined) {
            this.image = {};
            this.image.src = AppSettings.ServerUrl + "download/" + res.photo;
            this.profilePhoto.setPhoto(res.photo);
          } else if (
            res.photo == null ||
            res.photo == "" ||
            res.photo == undefined
          ) {
            this.image = {};
            this.image.src = "assets/images/userAvatar.png";
            this.profilePhoto.setPhoto(null);
          }
          localStorage.setItem("profileImage", this.image.src);
          var u = this.infoData.workExperience.findIndex(
            (x) => x.currentOrganization == true
          );

          if (
            this.infoData.educationDetail.length == 0 &&
            this.studentPrompt == true &&
            this.commonVariables.localUser == true
          ) {
            this.eduEditFlag = false;
            this.eduAddFlag = true;
            this.getStates();
            this.eduSaveFlag = false;
            this.educationDetail.controls = [];

            this.addEducation();
            this.checkCurOrg2();

          }
          if (this.personalInfoForm.value.userType == "HEALTHCARE") {
            if (
              this.personalInfoForm.value.userType != this.infoData.userType
            ) {
              this.isCollapsed = false;
              this.personalInfoForm.get("nonApplicable").setValue(false);
            }
            this.physicianFlag = true;
            this.adminFlag = false;
            this.commonVariables.studentFlag = false;
            this.searchData.setCommonVariables(this.commonVariables);
            this.reload('personalProfile');
          } else if (this.personalInfoForm.value.userType == "student") {
            this.commonVariables.studentFlag = true;
            this.searchData.setCommonVariables(this.commonVariables);
            this.adminFlag = false;
            this.physicianFlag = false;
            this.infoData.nonApplicable = false;
            this.reload('personalProfile');
          } else if (this.personalInfoForm.value.userType == "adminPersonnel") {
            this.adminFlag = true;
            this.physicianFlag = false;
            this.commonVariables.studentFlag = false;
            this.searchData.setCommonVariables(this.commonVariables);
            this.infoData.nonApplicable = false;
            this.reload('personalProfile');
          } else if (this.personalInfoForm.value.userType == "Other") {

            this.reload('personalProfile');
          }


          if (
            this.infoData.workExperience.length == 0 &&
            this.phyPrompt == true &&
            this.commonVariables.localUser == true
          ) {
            this.indexZero = true;
            this.workSaveFlag = false;
            this.workExperience.controls = [];
            this.workExperience = this.eperienceForm.get(
              "workExperience"
            ) as UntypedFormArray;
            this.addWorkExperience();
            this.workModalShown = true;

            this.workExperience.controls.forEach((ele) => {
              ele
                .get("currentOrganization")
                .setValidators([Validators.requiredTrue]);
              ele.get("currentOrganization").updateValueAndValidity();
            });
          } else if (
            this.infoData.workExperience.length > 1 &&
            this.phyPrompt == true &&
            u == "-1" &&
            this.commonVariables.localUser == true
          ) {
            this.selectOrgModalShown = true;
            this.util.startLoader();
            this.api.query("user/" + this.userId).subscribe((res) => {
              if (res) {
                this.util.stopLoader();
                this.infoData = res;
              }
            }, err => {
              this.util.stopLoader();
            });
            this.util.startLoader();
            setTimeout(() => {
              this.currentOrgList = [];

              this.infoData.workExperience.forEach((ele) => {
                var obj: any = {};
                obj.organisationId = ele.organisationId;
                obj.chooseCurrentOrg = ele.organisationName;
                obj.city = ele.city;
                obj.state = ele.state;
                obj.country = ele.country;

                obj.street =
                  ele.street && ele.street !== null ? ele.street : null;
                this.currentOrgList.push(obj);
              });
            }, 600);
            this.util.stopLoader();
          } else if (
            this.infoData.workExperience.length == 1 &&
            this.phyPrompt == true &&
            u == "-1" && this.commonVariables.localUser == true
          ) {
            this.indexOne = true;

            this.mandateWork();
            this.workExperience.controls.forEach((ele) => {
              ele
                .get("currentOrganization")
                .setValidators([Validators.requiredTrue]);
              ele.get("currentOrganization").updateValueAndValidity();
            });
            this.workModalShown = true;
            this.workExperience.controls[0]
              .get("title")
              .patchValue(this.infoData.workExperience[0].title);
            this.workExperience.controls[0]
              .get("organisationName")
              .patchValue(this.infoData.workExperience[0].organisationName);
            this.workExperience.controls[0]
              .get("organisationId")
              .patchValue(this.infoData.workExperience[0].organisationId);
            this.workExperience.controls[0]
              .get("userId")
              .patchValue(this.userId);
            this.workExperience.controls[0]
              .get("expId")
              .patchValue(this.infoData.workExperience[0].expId);
            this.workExperience.controls[0]
              .get("currentOrganization")
              .patchValue(this.infoData.workExperience[0].currentOrganization);
            this.workExperience.controls[0]
              .get("startMonth")
              .patchValue(this.infoData.workExperience[0].startMonth);
            this.workExperience.controls[0]
              .get("startYear")
              .patchValue(this.infoData.workExperience[0].startYear);
            this.workExperience.controls[0]
              .get("endMonth")
              .patchValue(this.infoData.workExperience[0].endMonth);
            this.workExperience.controls[0]
              .get("endYear")
              .patchValue(this.infoData.workExperience[0].endYear);
            this.workExperience.controls[0]
              .get("state")
              .patchValue(this.infoData.workExperience[0].state);
            this.workExperience.controls[0]
              .get("city")
              .patchValue(this.infoData.workExperience[0].city);
            this.workExperience.controls[0]
              .get("zipcode")
              .patchValue(this.infoData.workExperience[0].zipcode);
            this.workExperience.controls[0]
              .get("badge")
              .patchValue(this.infoData.workExperience[0].badge);
            this.workExperience.controls[0]
              .get("country")
              .patchValue(this.infoData.workExperience[0].country);
          } else {
            this.reload('personalProfile');
          }
        }
      }, err => {
        this.util.stopLoader()
        if (err.status == 500) {
          this.util.stopLoader();
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: 'Something went wrong while saving your details. Please, try again later.',
            showDenyButton: false,
            confirmButtonText: `ok`,
          })
        }
      });
    } else {

    }
  }

  reload(goTo?) {
    let datas: any = {};
    datas.userId = localStorage.getItem("userId");
    this.router.navigateByUrl("/", { skipLocationChange: true }).then(() => {
      this.router.navigate(["personalProfile"], { queryParams: datas });
    });
    // this.ngOnInit()
    // this.menuClick(goTo)
    this.modalService.hide(1)
  }

  menuClick(value) {
    var data: any = {};
    data.pages = value
    this.pageType.setPageName(data)
  }


  mandateWork() {
    this.mandate("title", "work");
    // this.mandate('organisationName', 'work')
    this.workExperience.controls.forEach((ele) => {
      ele
        .get("organisationName")
        .setValidators([
          Validators.required,
          Validators.pattern(/^[^\s]+(\s+[^\s]+)*$/),
        ]);
      ele.get("organisationName").updateValueAndValidity();
    });
    this.mandate("startMonth", "work");
    this.mandate("startYear", "work");
    this.mandate("endMonth", "work");
    this.mandate("endYear", "work");
    this.mandate("state", "work");
    this.mandate("city", "work");
    // this.mandate('street', 'work')
    this.mandate("country", "work");
    this.workExperience.controls.forEach((ele) => {
      ele
        .get("zipcode")
        .setValidators([Validators.required, Validators.pattern(/^[0-9]*$/)]);
      ele.get("zipcode").updateValueAndValidity;
    });
    this.validateIfChecked(
      this.workExperience.controls[0].get("currentOrganization").value
    );

    this.validateShowOnProf(this.workExperience.controls[0].get("badge").value);
  }

  mandateOtherWork() {
    this.mandateWork();
    var a = this.eperienceForm.value.workExperience.findIndex(
      (x) => x.currentOrganization == true
    );
    if (a != "-1") {
      this.workExperience.controls.forEach((ele) => {
        ele.get("currentOrganization").setErrors({ validateIfChecked: null });
        ele
          .get("currentOrganization")
          .updateValueAndValidity({ emitEvent: false });
      });
    } else if (a == "-1") {
      this.workExperience.controls.forEach((ele) => {
        ele.get("currentOrganization").setErrors({ validateIfChecked: true });
      });
    }

    var c = this.eperienceForm.value.workExperience.findIndex(
      (x) => x.badge == true
    );

    if (c != "-1") {
      this.workExperience.controls.forEach((ele) => {
        ele.get("badge").setErrors({ checkIfChecked: null });
        ele.get("badge").updateValueAndValidity({ emitEvent: false });
      });
    } else if (c == "-1") {
      this.workExperience.controls.forEach((ele) => {
        ele.get("badge").setErrors({ checkIfChecked: true });
      });
    }

    this.workExperience.controls.forEach((ele) => {
      if (ele.get("currentOrganization").value == true) {
        ele.get("endMonth").clearValidators();
        ele.get("endMonth").updateValueAndValidity();
        ele.get("endYear").clearValidators();
        ele.get("endYear").updateValueAndValidity();
      } else {
        ele.get("endMonth").setValidators([Validators.required]);
        ele.get("endMonth").updateValueAndValidity();
        ele.get("endYear").setValidators([Validators.required]);
        ele.get("endYear").updateValueAndValidity();
      }
    });
  }

  onEnterNpiNo(event: any) {
    if (event.target.value != "") {
      var a = event.target.value;
      this.util.startLoader();
      this.api.query("user/npi/registry/" + a).subscribe((res) => {
        if (res.code == "00000" && res.data != null) {
          this.util.stopLoader();
          var aboutMe = res.data.npidata.aboutMe;
          var careOnlineNo = res.data.npidata.careOnlineNo;
          var city = res.data.npidata.city;
          var country = res.data.npidata.country;
          var firstName = res.data.npidata.firstName;
          var lastName = res.data.npidata.lastName;
          var gender = res.data.npidata.gender;
          var zipcode = res.data.npidata.zipcode;
          var phoneNo = res.data.npidata.phoneNo;
          var state = res.data.npidata.state;
          var title = res.data.npidata.title;
          var taxonomyCode = res.data.npidata.taxonomyCode;
          var addressLine1 = res.data.npidata.addressLine1;
          this.personalInfoForm.patchValue({
            country: country,
            aboutMe: aboutMe,
            city: city,
            state: state,
            // firstName : firstName,
            // lastName : lastName,
            zipcode: zipcode,
            phoneNo: phoneNo,
            title: title,
          });
        } else {
          this.util.stopLoader();
          this.personalInfoForm.patchValue({
            country: null,
            aboutMe: null,
            city: null,
            state: null,
            // firstName : firstName,
            // lastName : lastName,
            zipcode: null,
            phoneNo: null,
            title: null,
          });
        }
      }, err => {
        this.util.stopLoader();
      });
    }
  }

  mandateEducation() {
    // //// console.log("this is also called ")
    this.mandate("schoolName", "edu");
    this.mandate("degree", "edu");
    this.mandate("startMonth", "edu");
    this.mandate("startYear", "edu");
    this.mandate("speciality", "edu");

    this.mandate("state", "edu");
    this.mandate("city", "edu");
    // this.mandate('zipcode', 'edu')
    this.mandate("street", "edu");
    this.mandate("country", "edu");
    this.educationDetail.controls.forEach((ele) => {
      ele
        .get("zipcode")
        .setValidators([Validators.required, Validators.pattern(/^[0-9]*$/)]);
      ele.get("zipcode").updateValueAndValidity();
    });
    const curPurVal =
      this.educationDetail.controls[0].get("currentlyPursued").value;
    if (curPurVal == true) {
      this.nonMandate("endMonth", "edu");
      this.nonMandate("endYear", "edu");
    } else if (curPurVal == false) {
      this.mandate("endMonth", "edu");
      this.mandate("endYear", "edu");
    }
  }

  mandate(value, category) {
    if (category == "edu") {
      this.educationDetail.controls.forEach((ele) => {
        ele.get(value).setValidators([Validators.required]);
        ele.get(value).updateValueAndValidity();
      });
    } else if (category == "work") {
      this.workExperience.controls.forEach((ele) => {
        ele.get(value).setValidators([Validators.required]);
        ele.get(value).updateValueAndValidity();
      });
    }
  }

  nonMandate(value, category) {
    if (category == "edu") {
      this.educationDetail.controls.forEach((ele) => {
        ele.get(value).clearValidators();
        ele.get(value).updateValueAndValidity();
      });
    } else if (category == "work") {
      this.workExperience.controls.forEach((ele) => {
        ele.get(value).clearValidators();
        ele.get(value).updateValueAndValidity();
      });
    }
  }

  openPhyPromptNested(physicianPrompTemplate: TemplateRef<any>) {
    this.phyModRef = this.modalService.show(physicianPrompTemplate, {
      animated: true,
      backdrop: true,
      ignoreBackdropClick: true,
      class: "second",
      keyboard: false,
    });
  }

  openStudPromptNested(studentPrompTemplate: TemplateRef<any>) {
    this.studModRef = this.modalService.show(studentPrompTemplate, {
      animated: true,
      backdrop: true,
      ignoreBackdropClick: true,
      class: "second",
      keyboard: false,
    });
  }

  phyPrompt: boolean = false;
  studentPrompt: boolean = false;
  userTypeValue: any;
  hidePhyPrompt() {
    // //// console.log("this is called")
    // this.physicianPrompTemplate = false
    this.studentPrompt = false;
    this.searchData.setBooleanValue(false);
    this.phyModRef.hide();
    this.phyPrompt = false;
    this.personalInfoForm.patchValue({ userType: this.infoData.userType });
  }

  hideStudPrompt() {
    // //// console.log("this is called")
    this.studentPrompt = false;
    this.phyPrompt = false;
    this.searchData.setBooleanValue(false);
    this.studModRef.hide();
    this.personalInfoForm.patchValue({ userType: this.infoData.userType });
  }

  changeToPhysician() {
    this.phyPrompt = true;
    this.studentPrompt = false;
    this.searchData.setBooleanValue(true);
    this.phyModRef.hide();
    this.modalRef.hide();
    this.infoSave();
  }

  changeToStudent() {
    this.studentPrompt = true;
    this.searchData.setBooleanValue(true);
    this.studModRef.hide();
    this.modalRef.hide();

    // this.util.startLoader();
    // setTimeout(() => {
    //   this.infoData.workExperience.forEach((ele) => {
    //     this.api.create("user/remove/workexp", ele).subscribe((res) => {});
    //   });
    // }, 4000);

    this.infoSave();
    // let datas: any = {};
    // datas.userId = localStorage.getItem("userId");
    // this.router.navigate(["personalProfile"], { queryParams: datas });
  }

  onChangePhysician(val) {
    if (val == "HEALTHCARE") {
      this.physicianFlag = true;
      this.adminFlag = false;
      // this.studentFlag = false
      this.commonVariables.studentFlag = false;
      this.searchData.setCommonVariables(this.commonVariables);
      this.mandateWork();
      this.mandateEducation();
      // this.nonMandateEducation()
    } else if (val == "student") {
      // this.studentFlag = true
      this.commonVariables.studentFlag = true;
      this.searchData.setCommonVariables(this.commonVariables);
      this.adminFlag = false;
      this.physicianFlag = false;
      this.mandateEducation();
      this.mandateWork();
      // this.nonMandateWork()
    } else if (val == "adminPersonnel") {
      this.adminFlag = true;
      this.physicianFlag = false;
      // this.studentFlag = false
      this.commonVariables.studentFlag = false;
      this.searchData.setCommonVariables(this.commonVariables);
      this.mandateWork();
      this.mandateEducation();
      // this.nonMandateEducation()
    } else if (val == "Other") {
      this.physicianFlag = false;
      this.adminFlag = false;
      // this.studentFlag = false
      this.commonVariables.studentFlag = false;
      this.searchData.setCommonVariables(this.commonVariables);
      this.mandateWork();
      this.mandateEducation();
      // this.nonMandateEducation()
    }
  }

  onChangePhysician1(physicianPrompTemplate, studentPrompTemplate) {
    // //// console.log("this is entered")
    if (this.phyPrompt == true) {
      this.openPhyPromptNested(physicianPrompTemplate);
    } else if (this.studentPrompt == true) {
      this.openStudPromptNested(studentPrompTemplate);
    }
  }

  changeUserTypeFlag: boolean = false
  onChangeIam(value) {

    if (value != this.restrictedUserType) {
      this.commonVariables.previousFlag = false
      this.searchData.setCommonVariables(this.commonVariables)
      // this.commonVariables.previousFlag = false
    } else if (value == this.restrictedUserType) {
      this.commonVariables.previousFlag = true
      this.searchData.setCommonVariables(this.commonVariables)
    }


    if (this.changeUserTypeFlag == false) {
      this.userTypeValue = "";
      if (value == "HEALTHCARE" && value != this.infoData.userType) {
        this.userTypeValue = "Medical/ Healthcare Professional";
        this.phyPrompt = true;
        this.studentPrompt = false;
        this.searchData.setBooleanValue(true);
      } else if (value == "student" && value != this.infoData.userType) {
        this.studentPrompt = true;
        this.phyPrompt = false;
        this.searchData.setBooleanValue(true);
      } else if (value == "adminPersonnel" && value != this.infoData.userType) {
        this.phyPrompt = true;
        this.studentPrompt = false;
        this.searchData.setBooleanValue(true);
        this.userTypeValue = "Administrative Healthcare personnel";
      } else if (
        (value == "Other" && this.infoData.userType != "adminPersonnel") ||
        (value == "Other" && this.infoData.userType != "HEALTHCARE")
      ) {
        this.phyPrompt = true;
        this.studentPrompt = false;
        this.searchData.setBooleanValue(true);
        this.userTypeValue = "Other";
      }
    }
  }

  aboutSave() {
    this.amsubmit = true;
    if (this.aboutMeForm.valid) {
      this.infoData.aboutMe = this.aboutMeForm.value.aboutMe;
      this.util.startLoader();
      this.api.create("user/saveUser", this.infoData).subscribe((res) => {
        if (res.code === '00000') {
          this.lgModal.hide()
          this.util.stopLoader();
          // var data: any = {}
          // this.commonValues.setRefresh(data)
          this.reload('personalProfile')

        } else {
          Swal.fire({
            icon: "info",
            title: "Oops...",
            text: "Something went wrong. Please try after a while.",
            showConfirmButton: false,
            timer: 4000,
          });
          this.lgModal.hide()
          this.util.stopLoader();
        }
      }, err => {
        this.util.stopLoader()
        if (err.status == 500) {
          this.util.stopLoader();
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: 'Something went wrong while saving your details. Please, try again later.',
            showDenyButton: false,
            confirmButtonText: `ok`,
          })
        }
      });
      // this.modalRef.hide();
    }
  }

  createEducation() {
    return this.fb.group({
      schoolName: [null, [Validators.required, CustomValidator.minmaxLetters(this.SCHOOL_NAME.min, this.SCHOOL_NAME.max)]],
      institutionId: [null],
      eduId: [null],
      userId: [null],
      degree: [null, [Validators.required, CustomValidator.max(this.DEGREE.max)]],
      showThisOnProfile: [false],
      currentlyPursued: [false],
      startMonth: [null, [Validators.required]],
      startYear: [this.currentYear, [Validators.required]],
      endMonth: [null, [Validators.required]],
      endYear: [this.currentYear, [Validators.required]],
      city: [null, [Validators.required, CustomValidator.max(this.CITY.max)]],
      street: [null],
      state: [null, [Validators.required, CustomValidator.max(this.STATE.max)]],
      zipcode: [null, [Validators.required, CustomValidator.minmaxLetters(this.ZIPCODE.min, this.ZIPCODE.max)]],
      country: [null],
      speciality: [null, [Validators.required, CustomValidator.max(this.SPECIALITY.max)]],
    });
  }

  addEducation() {
    this.educationDetail = this.eduForm.get("educationDetail") as UntypedFormArray;
    this.educationDetail.push(this.createEducation());
  }

  removeEducation(index, eduId: string) {
    if (
      this.userType == "student" &&
      this.infoData.educationDetail[index].showThisOnProfile == true
    ) {
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: "btn btn-success",
          // cancelButton: "btn btn-danger",
        },
        buttonsStyling: false,
      });
      swalWithBootstrapButtons
        .fire({
          title: "Sorry, you can't delete this.",
          text: "This education is being shown on your profile.",
          icon: "warning",
          // showCancelButton: true,
          confirmButtonText: "Okay",
          // cancelButtonText: "No, cancel!",
          // reverseButtons: true,
        })
        .then((result) => {
          if (result.isConfirmed) {
          }
        });
    } else {
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
        })
        .then((result) => {
          if (result.isConfirmed) {
            this.util.startLoader();
            const eduDet: Array<any> = this.infoData.educationDetail;
            this.api
              .create("user/remove/education", eduDet[0])
              .subscribe((res) => {
                this.util.stopLoader();
                if (res.code == "0000") {
                  if (eduDet != null) {
                    eduDet.forEach((element: any, i: number) => {
                      if (element.eduId === eduId) {
                        eduDet.splice(i, 1);
                      }
                    });
                  }
                  this.reload('education');
                }
              },
                err => {
                  this.util.stopLoader();
                });
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            // Swal.fire({
            //   position: "center",
            //   icon: "success",
            //   title: "Education  is safe",
            //   showConfirmButton: false,
            //   timer: 3000,
            // });
          }
        });
    }
  }
  get geteducation() {
    return this.eduForm.get("educationDetail") as UntypedFormArray;
  }

  get ph() {
    return this.physicianForm.controls;
  }

  getEducationFormGroup(index: any): UntypedFormGroup {
    const formGroup = this.educationDetail.controls[index] as UntypedFormGroup;
    return formGroup;
  }
  sortConfigWork: TypeaheadOrder = {
    direction: "desc",
    field: "organizationName",
  };

  sortConfigEdu: TypeaheadOrder = {
    direction: "desc",
    field: "institutionName",
  };
  autoComplete: MatAutocompleteTrigger;
  searchBarShow: boolean = false
  uniqueOrgList: Array<Partial<HealthCareOrganization>> = [];

  onPaste(event: ClipboardEvent) {
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

  getOrganization(value) {

    if (value != null) {
      this.util.startLoader();
      this.api.query("care/organizations?organizationName=" + value)
        .pipe(debounceTime(2000))
        .subscribe((res) => {
          this.util.stopLoader();
          if (res) {
            this.util.stopLoader();
            const orgList: Array<Partial<HealthCareOrganization>> = [];
            // this.orgList = [];
            res.forEach(ele => {
              const obj: any = {}
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
          // this.util.stopLoader();

        });
      this.searchBarShow = true;
    } else {
      this.searchBarShow = false
    }
  }




  // getProfTitle() {
  //   this.util.startLoader();
  //   this.api
  //     .query("care/list/values/ADMINISTRATIVE_PERSONNEL")
  //     .subscribe((res) => {
  //       this.util.stopLoader();
  //       if (res) {
  //         if (res.listItems && res.listItems != null) {
  //           res.listItems.forEach((ele) => {
  //             this.busiTitleList.push(res.item);
  //             this.studentTitles.push(ele.item);
  //           });
  //         }
  //       }
  //       // //// console.log(this.busiTitleList)
  //       // //// console.log("This is business titlee")
  //     }, err => {
  //       this.util.stopLoader();
  //     });
  // }

  getInstitutions() {
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

  eduSave(value: any) {
    this.eduSaveFlag = true;


    if (value == "edit") {
      this.validateEduIfChecked(
        this.educationDetail.controls[0].get("currentlyPursued").value
      );
      this.validateEduShowOnProf(
        this.educationDetail.controls[0].get("showThisOnProfile").value
      );
      if (this.eduForm.valid) {
        if (
          this.commonVariables.eduId != null &&
          this.commonVariables.eduId != undefined &&
          this.commonVariables.eduId != "" &&
          this.educationDetail.controls[0].get("eduId") != null &&
          this.commonVariables.eduId ==
          this.educationDetail.controls[0].get("eduId").value &&
          this.educationDetail.controls[0].get("showThisOnProfile").value ==
          false &&
          this.infoData.userType == "student"
        ) {
          const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
              confirmButton: "btn btn-success",
              cancelButton: "btn btn-danger",
            },
            buttonsStyling: false,
          });
          swalWithBootstrapButtons
            .fire({
              title: "Sorry, you can't do that",
              text: "There should be least one education you need to show on profile",
              icon: "warning",
              // showCancelButton: true,
              confirmButtonText: "Ok",
              // cancelButtonText: "No",
              // reverseButtons: true,
            })
            .then((result) => {
              if (result.isConfirmed) {
              }
            });
        } else if (
          this.commonVariables.eduId != null &&
          this.commonVariables.eduId != undefined &&
          this.commonVariables.eduId != "" &&
          this.educationDetail.controls[0].get("eduId") != null &&
          this.commonVariables.eduId !=
          this.educationDetail.controls[0].get("eduId").value &&
          this.educationDetail.controls[0].get("showThisOnProfile").value ==
          true
        ) {
          const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
              confirmButton: "btn btn-success",
              cancelButton: "btn btn-danger",
            },
            buttonsStyling: false,
          });
          swalWithBootstrapButtons
            .fire({
              title: "Are you sure you want to change?",
              text: "There is already an education you are showing on profile. Would you like to change it?",
              icon: "warning",
              showCancelButton: true,
              confirmButtonText: "Yes",
              cancelButtonText: "No",
              reverseButtons: true,
            })
            .then((result) => {
              if (result.isConfirmed) {
                this.infoData.educationDetail.forEach((ele) => {
                  if (ele.showThisOnProfile == true) {
                    ele.showThisOnProfile = false;
                    ele.userId = this.userId;
                    this.util.startLoader();
                    this.api
                      .updatePut("user/update/education", ele)
                      .subscribe((res) => {
                        if (res.code == "0000") {
                          this.educationDetail.controls[0].patchValue({
                            userId: this.userId,
                          });
                          var val = this.educationDetail.getRawValue()[0];
                          this.util.startLoader();
                          this.api
                            .updatePut("user/update/education", val)
                            .subscribe((res) => {
                              this.util.stopLoader();
                              if (res.code == "0000") {
                                this.curOrgValidity("edu");
                                if (this.modalRef != undefined) {
                                  this.modalRef.hide();
                                }
                                this.onHideEduMandTemp();
                                // this.infoData.educationDetail.splice(this.eduIndex, 1, {
                                //   currentlyPursued: res.data.User.educationDetail[0].currentlyPursued,
                                //   title: res.data.User.educationDetail[0].title,
                                //   city: res.data.User.educationDetail[0].city,
                                //   state: res.data.User.educationDetail[0].state,
                                //   country: res.data.User.educationDetail[0].country,
                                //   startMonth: res.data.User.educationDetail[0].startMonth,
                                //   startYear: res.data.User.educationDetail[0].startYear,
                                //   endMonth: res.data.User.educationDetail[0].endMonth,
                                //   endYear: res.data.User.educationDetail[0].endYear,
                                //   userId: res.data.User.educationDetail[0].userId,
                                //   zipcode: res.data.User.educationDetail[0].zipcode,
                                //   eduId: res.data.User.educationDetail[0].eduId,
                                //   schoolName: res.data.User.educationDetail[0].schoolName,
                                //   showThisOnProfile: res.data.User.educationDetail[0].showThisOnProfile,
                                //   speciality: res.data.User.educationDetail[0].speciality,
                                //   street: res.data.User.educationDetail[0].street,
                                //   institutionId: res.data.User.educationDetail[0].institutionId,
                                // })
                                // this.reload('education')
                              }
                            }, err => {
                              this.util.stopLoader();
                            });
                        }
                      }, err => {
                        this.util.stopLoader();
                      });
                  }
                });
              } else if (result.dismiss === Swal.DismissReason.cancel) {
                this.educationDetail.controls[0]
                  .get("showThisOnProfile")
                  .patchValue(false);
              }
            });
        } else {
          this.educationDetail.controls[0].patchValue({ userId: this.userId });
          this.util.startLoader();
          this.api
            .updatePut(
              "user/update/education",
              this.educationDetail.getRawValue()[0]
            )
            .subscribe((res) => {
              this.util.stopLoader();
              if (res.code == "0000") {
                this.reload('education');
              }
            }, err => {
              this.util.stopLoader();
            });
          // this.resetDataForEdu();
          // this.eduAr();
          if (this.modalRef != undefined) {
            this.modalRef.hide();
          }
          this.eduIndex = null;
          this.onHideEduMandTemp();
        }
      }
    } else if (value == "add") {
      // this.toDateValidity(0, "edu");
      this.validateEduIfChecked(
        this.educationDetail.controls[0].get("currentlyPursued").value
      );
      this.validateEduShowOnProf(
        this.educationDetail.controls[0].get("showThisOnProfile").value
      );
      if (this.eduForm.valid) {
        if (this.infoData.educationDetail.length != 0) {
          var e = this.infoData.educationDetail.findIndex(
            (x) => x.showThisOnProfile == true
          );
          if (
            this.educationDetail.controls[0].get("showThisOnProfile").value ==
            true &&
            e != "-1"
          ) {
            const swalWithBootstrapButtons = Swal.mixin({
              customClass: {
                confirmButton: "btn btn-success",
                cancelButton: "btn btn-danger",
              },
              buttonsStyling: false,
            });
            swalWithBootstrapButtons
              .fire({
                title: "Are you sure you want to change?",
                text: "There is already an education you are showing on profile. Would you like to change it?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes",
                cancelButtonText: "No",
                reverseButtons: true,
              })
              .then((result) => {
                if (result.isConfirmed) {
                  // this.infoData.educationDetail.splice(index, 1);
                  this.infoData.educationDetail.forEach((ele) => {
                    if (ele.showThisOnProfile == true) {
                      ele.showThisOnProfile = false;
                      ele.userId = this.userId;

                      this.util.startLoader();
                      this.api
                        .updatePut("user/update/education", ele)
                        .subscribe((res) => {
                          if (res.code == "0000") {
                            // var data = this.educationDetail.value[0];
                            this.educationDetail.controls[0].patchValue({
                              userId: this.userId,
                            });
                            var val2 = this.educationDetail.getRawValue()[0];
                            this.util.startLoader();
                            this.api
                              .create("user/create/education", val2)
                              .subscribe((res) => {
                                this.util.stopLoader();
                                if (res.code == "0000") {
                                  // this.curOrgValidity("edu");
                                  if (this.modalRef != undefined) {
                                    this.modalRef.hide();
                                  }
                                  this.onHideEduMandTemp();

                                  // let datas: any = {};
                                  // datas.userId = localStorage.getItem("userId");
                                  // this.router
                                  //   .navigateByUrl("/", {
                                  //     skipLocationChange: true,
                                  //   })
                                  //   .then(() => {
                                  //     this.router.navigate(
                                  //       ["personalProfile"],
                                  //       {
                                  //         queryParams: datas,
                                  //       }
                                  //     );
                                  //   });
                                  this.reload('education')
                                }
                              });
                          }
                        }, err => {
                          this.util.stopLoader();
                        });
                    }
                  });
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                  this.educationDetail.controls[0]
                    .get("showThisOnProfile")
                    .patchValue(false);
                }
              });
          } else if (
            this.educationDetail.controls[0].get("showThisOnProfile").value ==
            true &&
            e == "-1"
          ) {
            // const val = this.educationDetail.value[0];
            this.educationDetail.controls[0].patchValue({
              userId: this.userId,
            });
            var val4 = this.educationDetail.getRawValue()[0];

            this.util.startLoader();
            this.api.create("user/create/education", val4).subscribe((res) => {
              if (res.code == "0000") {
                this.util.stopLoader();
                this.curOrgValidity("edu");
                if (this.modalRef != undefined) {
                  this.modalRef.hide();
                }
                this.onHideEduMandTemp();

                // let datas: any = {};
                // datas.userId = localStorage.getItem("userId");
                // this.router
                //   .navigateByUrl("/", { skipLocationChange: true })
                //   .then(() => {
                //     this.router.navigate(["personalProfile"], {
                //       queryParams: datas,
                //     });
                //   });
                this.reload('education')
              }
            }, err => {
              this.util.stopLoader()
              if (err.status == 500) {
                this.util.stopLoader();
                Swal.fire({
                  icon: "error",
                  title: "Oops...",
                  text: 'Something went wrong while saving your details. Please, try again later.',
                  showDenyButton: false,
                  confirmButtonText: `ok`,
                })
              }
            });
          } else if (
            this.educationDetail.controls[0].get("showThisOnProfile").value ==
            false
          ) {
            this.util.startLoader();

            this.educationDetail.controls[0].patchValue({
              userId: this.userId,
            });
            var val5 = this.educationDetail.getRawValue()[0];

            this.api.create("user/create/education", val5).subscribe((res) => {
              if (res.code == "0000") {
                this.util.stopLoader();
                this.curOrgValidity("edu");
                this.modalRef.hide();
                this.onHideEduMandTemp();

                // let datas: any = {};
                // datas.userId = localStorage.getItem("userId");
                // this.router
                //   .navigateByUrl("/", { skipLocationChange: true })
                //   .then(() => {
                //     this.router.navigate(["personalProfile"], {
                //       queryParams: datas,
                //     });
                //   });
                this.reload('education')
              }
            }, err => {
              this.util.stopLoader()
              if (err.status == 500) {
                this.util.stopLoader();
                Swal.fire({
                  icon: "error",
                  title: "Oops...",
                  text: 'Something went wrong while saving your details. Please, try again later.',
                  showDenyButton: false,
                  confirmButtonText: `ok`,
                })
              }
            });
          }
        } else if (this.infoData.educationDetail.length == 0) {
          // var val = this.educationDetail.value[0];
          this.educationDetail.controls[0].patchValue({ userId: this.userId });
          var val5 = this.educationDetail.getRawValue()[0];
          this.util.startLoader();
          this.api.create("user/create/education", val5).subscribe((res) => {
            if (res.code == "0000") {
              this.util.stopLoader();
              // this.curOrgValidity("edu");
              if (this.modalRef != undefined && this.modalRef != null) {
                this.modalRef.hide();
              }
              this.onHideEduMandTemp();
              this.reload('education');
            }
          }, err => {
            this.util.stopLoader()
            if (err.status == 500) {
              this.util.stopLoader();
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: 'Something went wrong while saving your details. Please, try again later.',
                showDenyButton: false,
                confirmButtonText: `ok`,
              })
            }
          });
        }
      }
    }
  }


  checkIfEduLocChange() {
    if (this.schoolData.street != this.educationDetail.value[0].street ||
      this.schoolData.country != this.educationDetail.value[0].country ||
      this.schoolData.zipcode != this.educationDetail.value[0].zipcode ||
      this.schoolData.city != this.educationDetail.value[0].city ||
      this.schoolData.state != this.educationDetail.value[0].state) { }
  }

  createCertification() {
    return this.fb.group({
      certificationName: [null, [Validators.required, CustomValidator.max(this.CERTIFICATION_NAME_ORG_LICENSE.max), CustomValidator.checkWhiteSpace()]],
      certificateOrganization: [null, [Validators.required, CustomValidator.max(this.CERTIFICATION_NAME_ORG_LICENSE.max), CustomValidator.checkWhiteSpace()]],
      certificateLicenseNo: [null, [Validators.required, CustomValidator.max(this.CERTIFICATION_NAME_ORG_LICENSE.max), CustomValidator.checkWhiteSpace()]],
      startMonth: [null, [Validators.required, CustomValidator.max(this.CERTIFICATION_NAME_ORG_LICENSE.max), CustomValidator.checkWhiteSpace()]],
      startYear: [this.currentYear, [Validators.required, CustomValidator.max(this.CERTIFICATION_NAME_ORG_LICENSE.max), CustomValidator.checkWhiteSpace()]],
      endMonth: [null, [Validators.required, CustomValidator.max(this.CERTIFICATION_NAME_ORG_LICENSE.max), CustomValidator.checkWhiteSpace()]],
      endYear: [this.currentYear, [Validators.required, CustomValidator.max(this.CERTIFICATION_NAME_ORG_LICENSE.max), CustomValidator.checkWhiteSpace()]],
      certificateId: [null],
      userId: [null],
    });
  }

  mandateCertification() {
    this.certification.controls.forEach((ele) => {
      ele.get("certificationName").setValidators([Validators.required]);
      ele.get("certificationName").updateValueAndValidity();
      ele.get("certificateOrganization").setValidators([Validators.required]);
      ele.get("certificateOrganization").updateValueAndValidity();
      ele.get("certificateLicenseNo").setValidators([Validators.required]);
      ele.get("certificateLicenseNo").updateValueAndValidity();
      ele.get("startMonth").setValidators([Validators.required]);
      ele.get("startMonth").updateValueAndValidity();
      ele.get("startYear").setValidators([Validators.required]);
      ele.get("startYear").updateValueAndValidity();
      ele.get("endMonth").setValidators([Validators.required]);
      ele.get("endMonth").updateValueAndValidity();
      ele.get("endYear").setValidators([Validators.required]);
      ele.get("endYear").updateValueAndValidity();
    });
  }

  addCertification() {
    this.certification = this.certForm.get("certification") as UntypedFormArray;
    this.certification.push(this.createCertification());
  }

  getCertFormGroup(index: any): UntypedFormGroup {
    const formGroup = this.certification.controls[index] as UntypedFormGroup;
    return formGroup;
  }

  removeCertification(index) {
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
        text: "You will lose this details forever. Are you sure you want to delete this?",
        icon: "warning",
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          var val = this.infoData.certification
          if (val.length > 1) {
            var val1 = val.splice(0, val.length - 1, val[index])
          } else {
            val1 = val
          }
          // //// console.log(val1[0])
          this.util.startLoader();
          this.api.create("user/remove/certification", val1[0]).subscribe((res) => {
            if (res.code === "0000") {
              this.util.stopLoader();

              Swal.fire({
                position: "center",
                icon: "success",
                title: "Certification has been deleted",
                showConfirmButton: false,
                timer: 2000,
              });


              this.reload('certification');
            }
          }, err => {
            this.util.stopLoader()
            if (err.status == 500) {
              this.util.stopLoader();
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: 'Something went wrong while removing certificates. Please, try again later.',
                showDenyButton: false,
                confirmButtonText: `ok`,
              })
            }
          });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
        }
      });
  }

  get getCertification() {
    return this.certForm.get("certification") as UntypedFormArray;
  }


  //   /create/certification      --->post
  // /update/certification    ---->put
  // /remove/certification   ----->delete




  certSave(value: any) {
    this.certificationEdit = true;
    if (value == "edit") {
      this.mandateCertification();
      this.certification.controls[0].patchValue({ userId: this.userId })
      if (this.certForm.valid) {
        // var val = this.infoData.certification
        // val.splice(
        //   this.certIndex,
        //   1,
        //   this.certification.value[0]
        // );
        this.util.startLoader();
        this.api.updatePut("user/update/certification", this.certification.value[0]).subscribe((res) => {
          if (res.code == "0000") {
            this.util.stopLoader();
            this.modalRef.hide();
            this.certEditFlag = false;
            this.certAddFlag = false;
            // this.certIndex = null;
            // this.reload('certification')
            this.infoData.certification.splice(this.certIndex, 1, {
              certificationName: res.data.User.certification[0].certificationName,
              certificateOrganization: res.data.User.certification[0].certificateOrganization,
              startMonth: res.data.User.certification[0].startMonth,
              startYear: res.data.User.certification[0].startYear,
              endMonth: res.data.User.certification[0].endMonth,
              endYear: res.data.User.certification[0].endYear,
              certificateId: res.data.User.certification[0].certificateId,
              certificateLicenseNo: res.data.User.certification[0].certificateLicenseNo,
              certificateNameId: res.data.User.certification[0].certificateNameId,
              userId: res.data.User.certification[0].userId
            })
          } else if (res.code == '99999') {
            this.util.stopLoader();
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: 'Sorry, a similar record was found in your certifications. Please add a defferent one.',
              showDenyButton: false,
              confirmButtonText: `ok`,
            })
          }
        }, err => {
          this.util.stopLoader()
          if (err.status == 500) {
            this.util.stopLoader();
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: 'Something went wrong while saving your details. Please, try again later.',
              showDenyButton: false,
              confirmButtonText: `ok`,
            })
          }
        });
      }
    } else if (value == "add") {
      this.mandateCertification();
      if (this.certForm.valid) {
        // this.infoData.certification.push(this.certForm.value.certification[0]);
        this.certification.controls[0].patchValue({ userId: this.userId })
        this.util.startLoader();
        this.api.create("user/create/certification", this.certification.controls[0].value).subscribe((res) => {
          if (res.code == "0000") {
            this.util.stopLoader();
            this.modalRef.hide();
            this.certEditFlag = false;
            this.certAddFlag = false;
            // this.reload('certification')
            this.infoData.certification.push(
              {
                certificationName: res.data.User.certification[0].certificationName,
                certificateOrganization: res.data.User.certification[0].certificateOrganization,
                startMonth: res.data.User.certification[0].startMonth,
                startYear: res.data.User.certification[0].startYear,
                endMonth: res.data.User.certification[0].endMonth,
                endYear: res.data.User.certification[0].endYear,
                certificateId: res.data.User.certification[0].certificateId,
                certificateLicenseNo: res.data.User.certification[0].certificateLicenseNo,
                certificateNameId: res.data.User.certification[0].certificateNameId,
                userId: res.data.User.certification[0].userId
              }
            )
          } else if (res.code == '99999') {
            this.util.stopLoader();
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: 'Sorry, a similar record was found in your certification. Please add a defferent one.',
              showDenyButton: false,
              confirmButtonText: `ok`,
            })
          }
        }, err => {
          this.util.stopLoader()
          if (err.status == 500) {
            this.util.stopLoader();
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: 'Something went wrong while saving your details. Please, try again later.',
              showDenyButton: false,
              confirmButtonText: `ok`,
            })
          }
        });
      }
    }
  }

  onFileSelect(event) {
    this.formData.append("file", this.fileToUpload);
    this.formData.delete("file");
    for (let i = 0; i < event.target.files.length; i++) {
      this.fileToUpload = event.target.files[i] as File;
      this.formData.append("file", this.fileToUpload);
    }
  }

  disabledControl(data: any) {
    Object.keys(this.personalInfoForm.controls).forEach((field) => {
      ////// console.log(field)
      data.forEach((e) => {
        if (field == e) {
          this.personalInfoForm.get(e).disable({ onlySelf: true });
        }
      });
    });
  }

  reValidate(value) {
    this.personalInfoForm.get(value).setValidators([Validators.required]);
    this.personalInfoForm.get(value).updateValueAndValidity();
  }

  imageLoaded() {
    const formData: FormData = new FormData();
    formData.append("file", this.fileToUpload, this.fileUploadName);
    this.api.create("upload/image", formData).subscribe((res) => {
      this.photoId = res.fileId;
      this.modalRef1.hide();
      // $("#profileimage").val("")
      this.img = {};
      this.img.src = AppSettings.ServerUrl + "download/" + this.photoId;
    }, err => {
      this.util.stopLoader()
      if (err.status == 500) {
        this.util.stopLoader();
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: 'Something went wrong while uploading image. Please, try again later.',
          showDenyButton: false,
          confirmButtonText: `ok`,
        })
      }
    });
  }


  // @ViewChild('userType1', null) myDiv: ElementRef;
  // @ViewChild('userType1', {static: true, read: ElementRef }) myDiv: ElementRef<HTMLElement>;




  previousFlag: boolean = false;
  restrictedUserType: any;
  infoEdit(template: TemplateRef<any>, value) {
    if (value == "previous") {
      this.changeUserTypeFlag = true
      this.commonVariables.previousFlag = true
      this.searchData.setCommonVariables(this.commonVariables)
      this.restrictedUserType = this.userType
    }
    // if (this.studModalShown == true) {
    //   this.onHideEduMandTemp();
    // }
    if (this.workModalShown == true) {
      this.onHideWrkMandTemp();
    }
    this.util.startLoader();
    this.api.query("user/" + this.userId).subscribe((res) => {
      if (res) {
        this.infoData = res;
        setTimeout(() => {
          this.util.stopLoader();
        }, 1000);

      }
    }, err => {
      this.util.stopLoader();
    });

    setTimeout(() => {
      this.modalRef = this.modalService.show(template, this.backdropConfig);
      var u = this.infoData;
      this.getStates();
      this.onChangePhysician(u.userType);
      this.personalInfoForm.patchValue(u);
      if (this.commonVariables.previousFlag == true) {
        document.getElementById("userType1").focus()
      }

      if (u.nonApplicable == "true") {
        this.isCollapsed = true;
        this.personalInfoForm.get("nonApplicable").setValue(true);
      } else if (u.nonApplicable == "false") {
        this.isCollapsed = false;
        this.personalInfoForm.get("nonApplicable").setValue(false);
      }

      if (
        this.infoData.photo != null &&
        this.infoData.photo != undefined &&
        this.infoData.photo != ""
      ) {
        this.photoId = this.infoData.photo;
        this.img.src = AppSettings.ServerUrl + "download/" + this.photoId;
      } else {
        this.img.src = null;
      }
      this.reValidate("state");
      this.reValidate("userType");
      this.reValidate("city");
      this.reValidate("country");
      this.personalInfoForm
        .get("zipcode")
        .setValidators([Validators.required, Validators.pattern(/^[0-9]*$/)]);
      this.personalInfoForm.get("zipcode").updateValueAndValidity();

      this.personalInfoForm
        .get("firstName")
        .setValidators([Validators.required, Validators.pattern(this.FIRST_Name.pattern)]);
      this.personalInfoForm.get("firstName").updateValueAndValidity();

      this.personalInfoForm
        .get("lastName")
        .setValidators([Validators.required, Validators.pattern(this.LAST_NAME.pattern)]);
      this.personalInfoForm.get("lastName").updateValueAndValidity();

      this.personalInfoForm
        .get("phoneNo")
        .setValidators([
          Validators.maxLength(15),
          Validators.pattern(/^[\d -]+$/),
        ]);
      this.personalInfoForm.get("phoneNo").updateValueAndValidity();

      this.personalInfoForm
        .get("email")
        .setValidators([Validators.required, Validators.email]);
      this.personalInfoForm.get("email").updateValueAndValidity();

      this.personalInfoForm
        .get("secondaryEmail")
        .setValidators([Validators.email]);
      this.personalInfoForm.get("secondaryEmail").updateValueAndValidity();
    }, 1000);
    // this.util.stopLoader()
  }


  emailidcehck(id) {
    this.api.query("user/checkMailAlreadyExists/" + id).subscribe((res) => {
      if (res.data.exists) {
        setTimeout(() => {
          this.personalInfoForm.get('secondaryEmail').reset();
          Swal.fire({
            icon: "info",
            title: "There already exists an account registered with this email address, Please enter different email",
            showConfirmButton: true,
          });
        }, 500);

        // this.domainForm.setValidators([Validators.email, Validators.required])
        // this.domainForm.updateValueAndValidity()
      } else {
        this.personalInfoForm.patchValue({ 'secondaryEmail': id });
        this.infoData.secondaryEmail = id;
        // this.domainForm.setValidators([Validators.email, Validators.required])
        // this.domainForm.updateValueAndValidity()
      }
    })

  }



  showDropdown(element) {
    var event = document.createEvent('MouseEvents');
    event.initMouseEvent('mousedown', true, true, window, null, null, null, null, null, null, null, null, null, null, null);
    element.dispatchEvent(event);
  };

  aboutEdit() {
    this.util.startLoader();
    setTimeout(() => {
      this.util.stopLoader();
      this.remainingCharacters.next(this.ABOUT_ME.max);
      this.lgModal.show();
      const value1 = this.infoData.aboutMe;
      this.aboutMeForm.patchValue({
        aboutMe: value1,
      });
    }, 1000);
  }


  decline1() {
    this.lgModal.hide()
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
      var a: any = this.educationDetail.value[index].startYear;
      var b: any = this.educationDetail.value[index].endYear;
      if (a == b) {
        this.educationDetail.controls[index].patchValue({
          endMonth: null,
        });
      }
    } else if (val == "cert") {
      var a: any = this.certification.value[index].startYear;
      var b: any = this.certification.value[index].endYear;
      if (a == b) {
        this.certification.controls[index].patchValue({
          endMonth: null,
        });
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
    } else if (val == "edu") {
      var n = new Date().getMonth();
      var maxYear = new Date().getFullYear();
      var maxMonth = n + 1;
      var monthCode = m;
      let startYear = parseInt(this.educationDetail.value[i].startYear);
      if (startYear == maxYear) {
        if (monthCode > maxMonth) {
          return true;
        } else {
          return false;
        }
      }
    } else if (val == "cert") {
      var n = new Date().getMonth();
      var maxYear = new Date().getFullYear();
      var maxMonth = n + 1;
      var monthCode = m;
      let startYear = parseInt(this.certification.value[i].startYear);
      if (startYear == maxYear) {
        if (monthCode > maxMonth) {
          return true;
        } else {
          return false;
        }
      }
    }
  }

  eduIndex: any = null;
  eduEdit(template: TemplateRef<any>, index, value: any) {
    this.getInstitutions();
    this.eduSaveFlag = false;
    if (value == "edit") {

      this.eduIndex = index;
      this.eduEditFlag = true;
      this.eduAddFlag = false;
      this.getStates();
      this.educationDetail.controls = [];
      this.addEducation();
      this.eduSaveFlag = false;
      this.modalRef = this.modalService.show(template, this.backdropConfig);
      this.educationDetail.at(index).patchValue(this.infoData.educationDetail[index]);
      this.educationDetail.controls[0].get('country').disable()
      this.educationDetail.controls[0].get('schoolName').disable()
      this.educationDetail.controls[0].get('street').disable()
      this.educationDetail.controls[0].get('state').disable()
      this.educationDetail.controls[0].get('zipcode').disable()
      this.educationDetail.controls[0].get('city').disable()
      this.educationDetail.controls[0].get('street').disable()
      let currentlyPursed = this.educationDetail.controls[0].get('currentlyPursued').value
      if (currentlyPursed == true || currentlyPursed == 'true') {
        this.educationDetail.controls[0].get('endMonth').clearValidators();
        this.educationDetail.controls[0].get('endMonth').updateValueAndValidity();
        this.educationDetail.controls[0].get('endYear').clearValidators();
        this.educationDetail.controls[0].get('endYear').updateValueAndValidity();
      }
      this.schoolData.street = this.infoData.educationDetail[index].street
      this.schoolData.city = this.infoData.educationDetail[index].city
      this.schoolData.state = this.infoData.educationDetail[index].state
      this.schoolData.zipcode = this.infoData.educationDetail[index].zipcode
      this.schoolData.country = this.infoData.educationDetail[index].country

      if (this.infoData.educationDetail[index].showThisOnProfile == true) {
        this.showThisEduBoolean == true;
      } else {
        this.showThisEduBoolean == true;
      }
      this.checkCurOrg2();
    } else if (value == "add") {
      this.eduEditFlag = false;
      this.eduAddFlag = true;
      this.educationDetail.controls = [];
      this.addEducation();
      this.getStates();
      this.eduSaveFlag = false;
      this.modalRef = this.modalService.show(template, this.backdropConfig);
      this.checkCurOrg2();
    }
    // if (this.infoData.educationDetail == undefined ||
    //   this.infoData.educationDetail == null ||
    //   this.infoData.educationDetail.length == 0) {
    //   //this.educationDetail.push();
    //   this.addEducation();
    // } else {
    // }
    // this.infoData.educationDetail.forEach(element => {
    //   this.educationDetail.push(this.fb.group(element))
    // })
  }

  checkCurOrg2() {
    var b = this.infoData.educationDetail.findIndex(
      (x) => x.currentlyPursued == true
    );
    if (b != "-1") {
      // this.curIndex = b
      this.searchData.setCurrentInst(b);
      // this.currentInstitute = true
      this.commonVariables.currentInstitute = true;
      this.searchData.setCommonVariables(this.commonVariables);
    } else {
      // this.currentInstitute = false
      this.commonVariables.currentInstitute = false;
      this.searchData.setCommonVariables(this.commonVariables);
      // this.curIndex = null
      this.searchData.setCurrentInst(null);
    }
  }

  physicianEdit(template: TemplateRef<any>) {
    var data = [];
    this.modalRef = this.modalService.show(template, this.backdropConfig);
    if (
      this.infoData.physicianData != undefined &&
      this.infoData.physicianData != null &&
      this.infoData.physicianData != ""
    ) {
      // //// console.log("physicnsjgsjdhgf")
      // //// console.log(this.infoData.physicianData)
      this.physicianForm.patchValue(this.infoData.physicianData);

      this.insuranceSelectedItems = [];
      this.conditionSelectedItems = [];

      if (
        this.infoData.physicianData.conditions != undefined &&
        this.infoData.physicianData.conditions != null &&
        this.infoData.physicianData.conditions != ""
      ) {
        this.infoData.physicianData.conditions.forEach((ele) => {
          this.conditionSelectedItems.push(ele);
        });
      }

      if (
        this.infoData.physicianData.insurance != undefined &&
        this.infoData.physicianData.insurance != null &&
        this.infoData.physicianData.insurance != ""
      ) {
        this.infoData.physicianData.insurance.forEach((ele) => {
          this.insuranceSelectedItems.push(ele);
        });
      }
    } else {
      this.physicianForm.patchValue({
        conditions: null,
        privatePay: "No",
        insurance: null,
        patientAcceptance: "No",
      });
    }
  }
  certIndex: any = null;
  certEdit(template: TemplateRef<any>, index, value: any) {
    this.util.startLoader();
    this.certificationEdit = false;
    const modalOpenedPromise = new Promise<void>((resolve) => {
      if (value == "edit") {
        this.certEditFlag = true;
        this.certAddFlag = false;
        this.modalRef = this.modalService.show(template, this.backdropConfig);
        this.certification = this.certForm.get("certification") as UntypedFormArray;
        this.certification.controls = [];
        this.certification.push(
          this.fb.group(this.infoData.certification[index])
        );
      } else if (value == "add") {
        this.certEditFlag = false;
        this.certAddFlag = true;
        this.modalRef = this.modalService.show(template, this.backdropConfig);
        this.certification = this.certForm.get("certification") as UntypedFormArray;
        this.certification.controls = [];
        this.addCertification();
      }
      setTimeout(() => {
        resolve();
      }, 1000);
    });
    modalOpenedPromise.then(() => {
      this.util.stopLoader();
    });
  }



  socialPresenceEdit(template: TemplateRef<any>) {
    this.util.startLoader();
    this.modalRef = this.modalService.show(template, this.backdropConfig);
    var u = this.infoData.socialPresence;
    this.socialPresenceForm.patchValue(u != null ? u : "");
    setTimeout(() => {
      this.util.stopLoader();
    }, 1000);
  }


  get SocialControls() {
    return this.socialPresenceForm.controls
  }

  onItemSelect(item: any) {
    // //// console.log(item);
    // //// console.log(this.selectedItems);
  }
  OnItemDeSelect(item: any) {
    // //// console.log(item);
    // //// console.log(this.selectedItems);
  }
  onSelectAll(items: any) {
    // //// console.log(items);
  }
  onDeSelectAll(items: any) {
    // //// console.log(items);
  }
  clickUserPrivacy(key: String, value: String) {

    if (key == "workExperience") {
      this.infoData["userPrivacy"]["workExperience"] = value;
    } else if (key == "educationDetail") {
      this.infoData["userPrivacy"]["educationDetail"] = value;
    } else if (key == "certification") {
      this.infoData["userPrivacy"]["certification"] = value;
    } else if (key == "socialPresence") {
      this.infoData["userPrivacy"]["socialPresence"] = value;
    } else if (key == "communities") {
      this.infoData["userPrivacy"]["communities"] = value;
    } else if (key == "reviews") {
      this.infoData["userPrivacy"]["reviews"] = value;
    }


    this.util.startLoader();
    this.api
      .create("user/updateUserPrivacy", this.infoData)
      .subscribe((res) => {
        this.util.stopLoader();
      });
  }
}
