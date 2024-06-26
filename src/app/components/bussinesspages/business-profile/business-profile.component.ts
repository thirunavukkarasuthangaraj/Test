import { values } from "lodash";
import {
  Component,
  OnInit,
  ChangeDetectorRef,
  TemplateRef,
  Input, ElementRef, OnDestroy,
} from "@angular/core";
import {
  UntypedFormGroup,
  UntypedFormArray,
  UntypedFormBuilder,
  Validators,
  UntypedFormControl,
} from "@angular/forms";
import { ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { ActivatedRoute } from "@angular/router";
import { UtilService } from "src/app/services/util.service";
import { ApiService } from "src/app/services/api.service";
import { AppSettings } from "src/app/services/AppSettings";
import { ImageCroppedEvent } from "ngx-image-cropper";
import { BehaviorSubject, Subscription } from "rxjs";
import { CommonValues } from "src/app/services/commonValues";
import { Router } from "@angular/router";
import Swal from "sweetalert2";
import { PlatformLocation } from "@angular/common";
import { SearchData } from "src/app/services/searchData";
import { CustomValidator } from "../../Helper/custom-validator";
import { FormValidation } from "src/app/services/FormValidation";
// import { EventData } from 'src/app/services/eventData';
// import { EventData } from 'src/app/services/eventData';

declare var $: any;
@Component({
  selector: "app-business-profile",
  templateUrl: "./business-profile.component.html",
  styleUrls: ["./business-profile.component.scss"],
})
export class BusinessProfileComponent extends FormValidation implements OnInit, OnDestroy {
  placeholder: any = "Add more";
  secondaryPlaceholder: any = "Option to add 3 #Tags";
  tagSelectedItems = [];
  loadAPIcall:boolean=false
  max = 400;
  remainingCharacters = new BehaviorSubject<any>(this.ABOUT_COMPANY.max);
  public FORMERROR = super.Form;

  //config for ngxSummerNote
  config = {
    placeholder: "About Company",
    tabsize: 2,
    height: "100px",
    lenght: 1000,
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
    callback: {
      onKeydown(e) {
        var t = e.currentTarget.innerText;
        // var max = 400
        if (t.length >= this.max) {
          //delete key
          if (e.keyCode != 8) {
          }
          e.preventDefault();
          // add other keys ...
        }
      },
      onKeyup: function (e) {
        var t = e.currentTarget.innerText;
        if (this.max == 400) {
          this.max - t.length;
        }
      },
    },
  };
  @ViewChild("myFileInput") myFileInput;
  @ViewChild("lgModal") lgModal;

  maxdata = {};
  @Input() commonemit;
  ldSubmit: boolean = false;
  numberonlyflag: boolean = false;
  numberonlyflag1: boolean = false;
  busDetailForm: UntypedFormGroup;
  object: any = [];
  worktime: boolean = false;
  tags: any = [];
  aboutCompanyForm: UntypedFormGroup;
  workExist: boolean = false;
  userSocialPresenceForm: UntypedFormGroup;
  aboutCompany: any;
  hoursForm: UntypedFormGroup;
  hourSubmit: boolean = false;
  userPrivacyForm: UntypedFormGroup;
  fileUploadName: any = "";
  photoId: any;
  imageChangedEvent: any = "";
  croppedImage: any = "";
  infoData: any;
  locationDetail: any;
  monFrom: any;
  monTo: any;
  tueFrom: any;
  tueTo: any;
  wedFrom: any;
  wedTo: any;
  thrFrom: any;
  thrTo: any;
  friFrom: any;
  friTo: any;
  satFrom: any;
  satTo: any;
  sunFrom: any;
  sunTo: any;
  monWork: any;
  tueWork: any;
  wedWork: any;
  thrWork: any;
  friWork: any;
  satWork: any;
  sunWork: any;
  fromflag: boolean = false;
  toflag: boolean = false;
  hours: any = [
    "12:15 AM",
    "12:30 AM",
    "12:45 AM",
    "01:00 AM",
    "01:15 AM",
    "01:30 AM",
    "01:45 AM",
    "02:00 AM",
    "02:15 AM",
    "02:30 AM",
    "02:45 AM",
    "03:00 AM",
    "03:15 AM",
    "03:30 AM",
    "03:45 AM",
    "04:00 AM",
    "04:15 AM",
    "04:30 AM",
    "04:45 AM",
    "05:00 AM",
    "05:15 AM",
    "05:30 AM",
    "05:45 AM",
    "06:00 AM",
    "06:15 AM",
    "06:30 AM",
    "06:45 AM",
    "07:00 AM",
    "07:15 AM",
    "07:30 AM",
    "07:45 AM",
    "08:00 AM",
    "08:15 AM",
    "08:30 AM",
    "08:45 AM",
    "09:00 AM",
    "09:15 AM",
    "09:30 AM",
    "09:45 AM",
    "10:00 AM",
    "10:15 AM",
    "10:30 AM",
    "10:45 AM",
    "11:00 AM",
    "11:15 AM",
    "11:30 AM",
    "11:45 AM",
    "12:00 PM",
    "12:15 PM",
    "12:30 PM",
    "12:45 PM",
    "01:00 PM",
    "01:15 PM",
    "01:30 PM",
    "01:45 PM",
    "02:00 PM",
    "02:15 PM",
    "02:30 PM",
    "02:45 PM",
    "03:00 PM",
    "03:15 PM",
    "03:30 PM",
    "03:45 PM",
    "04:00 PM",
    "04:15 PM",
    "04:30 PM",
    "04:45 PM",
    "05:00 PM",
    "05:15 PM",
    "05:30 PM",
    "05:45 PM",
    "06:00 PM",
    "06:15 PM",
    "06:30 PM",
    "06:45 PM",
    "07:00 PM",
    "07:15 PM",
    "07:30 PM",
    "07:45 PM",
    "08:00 PM",
    "08:15 PM",
    "08:30 PM",
    "08:45 PM",
    "09:00 PM",
    "09:15 PM",
    "09:30 PM",
    "09:45 PM",
    "10:00 PM",
    "10:15 PM",
    "10:30 PM",
    "10:45 PM",
    "11:00 PM",
    "11:15 PM",
    "11:30 PM",
    "11:45 PM",
    "12:00 AM",
  ];
  companyTypeList: any = [
    "Private",
    "Public",
    "Non-Profit",
    "Government",
    "Education",
  ];
  companySize: any = [
    { code: "0-10" },
    { code: "11-50" },
    { code: "51-250" },
    { code: "251-500" },
    { code: "501-1000" },
    { code: "1,001-5,000" },
    { code: "5,001-10,000" },
    { code: "10,001-25,000" },
    { code: "25,001-50,000" },
    { code: "50,001-100,000" },
    { code: "100,000+" },
  ];
  locationEditFlag: boolean = false;
  locationAddFlag: boolean = false;
  changeDetector: ChangeDetectorRef;
  modalRef: BsModalRef;
  modalRef1: BsModalRef | null;
  modalRef2: BsModalRef;
  patchurldata: any;
  businessId: any;
  userId: any;
  clearServiceFlag: boolean = false;
  eventstring: any;

  locationForm: UntypedFormGroup;
  serviceForm: UntypedFormGroup;
  formData = new FormData();
  fileToUpload: File;
  companyLocationDetails: UntypedFormArray;
  useruserSocialPresence: UntypedFormArray;
  serviceOptions: UntypedFormArray;
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
  changedata = [];

  insuranceData = [];
  insuranceList = [];
  insuranceDropdown = [];
  insuranceSelectedItems = [];
  insuranceDropdownSettings = {};
  fromvalue: any;
  tovalue: any;
  serviceTypeList: any = [];
  accreditionValue: any = [];
  serviceDropdown = [];
  serviceSelectedItems = [];
  serviceDropdownSettings = {};

  landingPageUserDatails;
  img = {
    src: null,
  };
  userDetailsLanding: any;
  userDetailsLanding_array = [];

  months: any = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  years: any = [];
  accreditionCode: any;
  facilityFlag: boolean = false;
  accredition: any;
  industryClass: any;
  serviceType: any;
  insuranceAccepted: any;
  medicareCertified: any;
  acceptingNewPatients: any;
  privatePayAccepted: any;
  notApplicable: boolean = false;
  orgConfig: any;
  ngxSelconfig: any;
  valueWidth = false;
  currentIndex: any;
  hide: boolean = false;
  stateListAU: any = [];
  stateListIN: any = [];
  stateListCA: any = [];
  countryList: any = [];
  hCareFlag: boolean = false;
  otherFlag: boolean = false;
  hCareFlag1: boolean = false;
  otherFlag1: boolean = false;
  studentFlag: boolean = false;
  adminFlag: boolean = false;
  usFlag: boolean = false;
  phyTitleList: any = [];
  busiTitleList: any = [];
  hCareFacilityList: any = [];
  facilityValue: any = [];
  industryType: Array<any> = [];
  serveOpt: any;
  backdropConfig = {
    backdrop: true,
    ignoreBackdropClick: true,
  };
  companyType: any;
  facilityPracticeType: any;
  businessName: any;
  tagLine: any;
  yearStarted: any;
  companysize: any;
  tag: any = [];
  clickEventsubscription: Subscription;
  BannerData: Subscription;
  businessIddata;
  values: any = {};
  adminflag = false;
  isAdmin;
  isSuperAdmin;
  viewadmin = false;
  HQEmitter: Subscription;
  commonEmitter: Subscription;
  commonVariables: any = {}
  tuetrue: boolean;
  bannerChanged;
  businessBanner;
  currentHeadQuarters: boolean = false;
  charCountEmitter: Subscription;
  remainingCount: any;

  constructor(
    private fb: UntypedFormBuilder,
    private route: ActivatedRoute,
    private commonvalues: CommonValues,
    private api: ApiService,
    private modalService: BsModalService,
    private router: Router,
    private util: UtilService,
    private platform: PlatformLocation,
    private searchData: SearchData
  ) {
    super();
    this.items = Array(15).fill(0);
    this.clickEventsubscription = this.commonvalues
      .getbusinessid()
      .subscribe((res) => {
        this.values = res;
        this.isAdmin = localStorage.getItem("isAdmin");
        this.isSuperAdmin = localStorage.getItem("isSuperAdmin");
        if (this.isSuperAdmin) {
          this.isAdmin = this.isSuperAdmin;
        }
      });
    this.BannerData = this.searchData.getBannerPhoto().subscribe((res) => {

      this.bannerChanged = res.bannerchanged;
      this.businessBanner = res.businessBanner;
    });

    platform.onPopState(() => {
      if (this.modalRef && typeof this.modalRef.hide === 'function') {
        this.modalRef.hide();
      }
    });

    platform.onPopState(() => {
      if (this.modalRef1 && typeof this.modalRef1.hide === 'function') {
        this.modalRef1.hide();
      }
    });

    platform.onPopState(() => {
      if (this.modalRef2 && typeof this.modalRef2.hide === 'function') {
        this.modalRef2.hide();
      }
    });
    this.HQEmitter = this.searchData.getHeadQuarters().subscribe((res) => {
      this.currentIndex = res;
    });

    this.commonEmitter = this.searchData.getCommonVariables().subscribe((res) => {
      this.commonVariables = res
    })

    this.charCountEmitter = this.commonvalues.getCharCount().subscribe(res => {
      this.remainingCount = res.value
    })
  }

  getbussinessId(businessId, admin) {
    this.values.businessId = businessId;
    this.values.admin = admin;
    this.businessId = businessId;
    if (this.values.adminviewnavigation) {
      this.values.viewadmin = true;
      this.viewadmin = true;
    }
    // this.commonvalues.businessid(this.values);
  }

  ngOnInit() {

    this.aboutCompanyForm = this.fb.group({
      aboutCompany: ['', Validators.compose([CustomValidator.minmaxWords(this.ABOUT_COMPANY.min, this.ABOUT_COMPANY.max), CustomValidator.checkWhiteSpace()])],
    },
    );


    this.busDetailForm = this.fb.group({
      businessOwner: [null],
      offlineVerification: [false],
      organizationType: [null, [Validators.required]],
      others: [
        null,
        [Validators.required, Validators.pattern(/^[^\s]+(\s+[^\s]+)*$/)],
      ],
      industryClassification: [null, Validators.compose([Validators.required])],
      facilityPracticeType: [null, Validators.required], //facilityPracticeType
      businessName: [
        null,
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[^\s]+(\s+[^\s]+)*$/),
        ]),
      ], //, this.noWhitespaceValidator
      tagLine: [null, [Validators.pattern(/^[^\s]+(\s+[^\s]+)*$/)]], // Validators.compose([this.noWhitespaceValidator])
      businessLogo: [null],
      businessBanner: [null],
      companyType: [null],
      yearStarted: [null],
      companySize: [null],
      tags: [null],
    });



    this.serviceForm = this.fb.group({
      conditionCreated: [null],
      insuranceAccepted: [null],
      isApplicable: [null],
      // licencedState: [null],
      // countryService: [null],
      accredition: [null],
      serviceType: [null],
      medicareCertified: ["No"],
      acceptingNewPatients: ["No"],
      privatePayAccepted: ["No"],
    });

    this.locationForm = this.fb.group({
      companyLocationDetails: this.fb.array([]),
    });
    this.addLocation();

    this.hoursForm = this.fb.group({
      monFromTime: [null],
      applyAll: [null],
      monToTime: [null],
      monWorking: [null],
      tueFromTime: [null],
      tueToTime: [null],
      tueWorking: [null],
      wedFromTime: [null],
      wedToTime: [null],
      wedWorking: [null],
      thrFromTime: [null],
      thrToTime: [null],
      thrWorking: [null],
      friFromTime: [null],
      friToTime: [null],
      friWorking: [null],
      satFromTime: [null],
      satToTime: [null],
      satWorking: [null],
      sunFromTime: [null],
      sunToTime: [null],
      sunWorking: [null],
    });

    this.userSocialPresenceForm = this.fb.group({
      twitter: [null, Validators.pattern(this.SOCIAL_LINK.pattern)],
      facebook: [null, Validators.pattern(this.SOCIAL_LINK.pattern)],
      linkedin: [null, Validators.pattern(this.SOCIAL_LINK.pattern)],
      blogURL: [null, Validators.pattern(this.SOCIAL_LINK.pattern)],
      alternamePageLink: [null, Validators.pattern(this.SOCIAL_LINK.pattern)],
    });
    this.userPrivacyForm = this.fb.group({
      userSocialPresence: [null],
      communities: [null],
      reviews: [null],
    });

    this.tagSelectedItems = [];
    this.values = this.commonemit;
    this.route.queryParams.subscribe((prevData) => {
      this.businessId = prevData.businessId;
    });
    this.userId = localStorage.getItem("userId");

    this.loadAPIcall=true
    this.api.query("business/details/" + this.businessId).subscribe((res) => {
      this.loadAPIcall=false
      this.util.stopLoader();
      this.infoData = res.data.businessModelList[0];
      this.previousBusinessName = this.infoData.businessName;
      this.locationData = this.infoData.companyLocationDetails.filter((ele: any) => ele.primary == true);
      this.fetchData();
    }, err => {
      this.util.stopLoader();
    });
    this.getCountry();
    this.getStates();
    this.checkShown();

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

    this.serviceTypeList = [];
    this.serviceSelectedItems = [];
    this.insuranceSelectedItems = [];
    this.getIndustryClass();
    this.getFacilityType();
    this.getInsuranceType()
    this.generateYears();

    this.aboutCompanyForm.valueChanges.subscribe(res => {
      console.log("sdsd", this.aboutCompanyForm);

      const value: string = FormValidation.extractContent(this.aboutCompanyForm.get('aboutCompany').value);
      if (value != "undefined") {
        this.remainingCharacters.next(this.ABOUT_COMPANY.max - (value && value.length));
      }
    });
  }

  ngOnDestroy(): void {
    if (this.clickEventsubscription) {
      this.clickEventsubscription.unsubscribe();
    }
    if (this.HQEmitter) {
      this.HQEmitter.unsubscribe();
    }
    if (this.commonEmitter) {
      this.commonEmitter.unsubscribe();
    }
    if (this.charCountEmitter) {
      this.charCountEmitter.unsubscribe();
    }
  }

  clearFaciOthr() {
    this.busDetailForm.get("facilityPracticeType").clearValidators();
    this.busDetailForm.get("facilityPracticeType").updateValueAndValidity();
    this.busDetailForm.get("others").clearValidators();
    this.busDetailForm.get("others").updateValueAndValidity();
  }

  organizationType: null;
  fetchData() {
    const u = this.infoData.facilityPracticeType;
    if (u) {
      this.onChngFacility(u, null);
    }
    this.businessName = this.infoData.businessName;
    this.tagLine = this.infoData.tagLine;
    this.companyType = this.infoData.companyType;
    this.facilityPracticeType = this.infoData.facilityPracticeType;
    this.yearStarted = this.infoData.yearStarted;
    this.companysize = this.infoData.companySize;
    this.tag = this.infoData.tags;
    this.aboutCompany = this.infoData.aboutCompany;
    this.organizationType = this.infoData.organizationType



    // this.locationDetail = this.infoData.companyLocationDetails

    this.photoId = this.infoData.businessLogo;
    if (this.photoId != undefined && this.photoId != null) {
      this.img = {
        src: AppSettings.ServerUrl + "download/" + this.photoId,
      };
    }
    // sorting location array with headquarters on top
    this.ar();
    var a = this.infoData.companyLocationDetails.findIndex(
      (x) => x.headquarters == true
    );

    this.infoData.companyLocationDetails.forEach(ele => {
      if (ele.primary == true) {
        this.commonVariables.locationId = ele.locationId
        this.searchData.setCommonVariables(this.commonVariables)
      }
    })

    if (a != "-1") {
      // this.currentOrg = true
      this.currentIndex = a;
      this.searchData.setHeadQuarters(a);
      this.hide = true;
    } else {
      // this.currentOrg = false
      // this.currentIndex = null
      this.searchData.setHeadQuarters(null);
      this.hide = false;
    }

    this.accreditionCode = this.infoData.serviceOptions.accreditionCode;
    this.accredition = this.infoData.serviceOptions.accredition;
    this.serviceType = this.infoData.serviceOptions.serviceType;
    this.insuranceAccepted = this.infoData.serviceOptions.insuranceAccepted;

    this.acceptingNewPatients =
      this.infoData.serviceOptions.acceptingNewPatients;
    if (this.infoData.serviceOptions.acceptingNewPatients == true) {
      this.acceptingNewPatients = "Yes";
    } else if (this.infoData.serviceOptions.acceptingNewPatients == false) {
      this.acceptingNewPatients = "No";
    }

    this.medicareCertified = this.infoData.serviceOptions.medicareCertified;
    if (this.infoData.serviceOptions.medicareCertified == true) {
      this.medicareCertified = "Yes";
    } else if (this.infoData.serviceOptions.medicareCertified == false) {
      this.medicareCertified = "No";
    }
    this.privatePayAccepted = this.infoData.serviceOptions.privatePayAccepted;
    if (this.infoData.serviceOptions.privatePayAccepted == true) {
      this.privatePayAccepted = "Yes";
    } else if (this.infoData.serviceOptions.privatePayAccepted == false) {
      this.privatePayAccepted = "No";
    }

    this.industryClass = this.infoData.industryClassification

    // if (this.infoData.industryClassification == "MEDICAL_HEALTHCARE_PRACTICE") {
    //   this.industryClass = "Medical and Healthcare Practice";
    //   this.hCareFlag = true;
    //   this.otherFlag = false;
    //   this.hCareFlag1 = true;
    //   this.otherFlag1 = false;
    //   this.busDetailForm
    //     .get("facilityPracticeType")
    //     .setValidators([Validators.required]);
    //   this.busDetailForm.get("facilityPracticeType").updateValueAndValidity();
    //   this.busDetailForm.get("others").clearValidators();
    //   this.busDetailForm.get("others").updateValueAndValidity();
    // } else if (
    //   this.infoData.industryClassification ==
    //   "NON-PROFIT_ORGANIZATION_(HEALTH/WELLNESS/MEDICAL)"
    // ) {
    //   //  this.industryClass = this.industryType.itemId
    //   this.industryClass = "Non-Profit Organization (Health/Wellness/Medical)";
    //   this.hCareFlag = false;
    //   this.otherFlag = false;
    //   this.hCareFlag1 = false;
    //   this.otherFlag1 = false;
    //   this.clearFaciOthr();
    // } else if (this.infoData.industryClassification == "ALTERNATIVE_MEDICE") {
    //   this.industryClass = "Alternative Medicine";
    //   this.hCareFlag = false;
    //   this.otherFlag = false;
    //   this.hCareFlag1 = false;
    //   this.otherFlag1 = false;
    //   this.clearFaciOthr();
    // } else if (this.infoData.industryClassification == "BIOTECHNOLOGY") {
    //   this.industryClass = "Biotechnology";
    //   this.hCareFlag = false;
    //   this.otherFlag = false;
    //   this.hCareFlag1 = false;
    //   this.otherFlag1 = false;
    //   this.clearFaciOthr();
    // } else if (this.infoData.industryClassification == "DIAGNOSTIC_SERVICES") {
    //   this.industryClass = "Diagnostic Services";
    //   this.hCareFlag = false;
    //   this.otherFlag = false;
    //   this.hCareFlag1 = false;
    //   this.otherFlag1 = false;
    //   this.clearFaciOthr();
    // } else if (
    //   this.infoData.industryClassification ==
    //   "EDUCATIONAL_INSTITUTION_(MEDICAL,_NURSING,_HEALTHCARE)"
    // ) {
    //   this.industryClass =
    //     "Educational Institution (Medical, Nursing, Healthcare)";
    //   this.hCareFlag = false;
    //   this.otherFlag = false;
    //   this.hCareFlag1 = false;
    //   this.otherFlag1 = false;
    //   this.clearFaciOthr();
    // } else if (this.infoData.industryClassification == "HEALTH_INSURANCE") {
    //   this.industryClass = "Health Insurance";
    //   this.hCareFlag = false;
    //   this.otherFlag = false;
    //   this.hCareFlag1 = false;
    //   this.otherFlag1 = false;
    //   this.clearFaciOthr();
    // } else if (
    //   this.infoData.industryClassification == "MEDICAL_DEVICE_EQUIPMENTS"
    // ) {
    //   this.industryClass = "Medical Device/ Equipments";
    //   this.hCareFlag = false;
    //   this.otherFlag = false;
    //   this.hCareFlag1 = false;
    //   this.otherFlag1 = false;
    //   this.clearFaciOthr();
    // } else if (
    //   this.infoData.industryClassification ==
    //   "PROFIT_ORGANIZATION_(HEALTH/WELLNESS/MEDICAL)"
    // ) {
    //   this.industryClass = "Non-Profit Organization (Health/Wellness/Medical)";
    //   this.hCareFlag = false;
    //   this.otherFlag = false;
    //   this.hCareFlag1 = false;
    //   this.otherFlag1 = false;
    // } else if (this.infoData.industryClassification == "OTHER") {
    //   this.industryClass = "Other";
    //   this.otherFlag = true;
    //   this.hCareFlag = false;
    //   this.hCareFlag1 = false;
    //   this.otherFlag1 = true;
    //   this.busDetailForm
    //     .get("others")
    //     .setValidators([
    //       Validators.required,
    //       Validators.pattern(/^[^\s]+(\s+[^\s]+)*$/),
    //     ]);
    //   this.busDetailForm.get("others").updateValueAndValidity();
    //   this.busDetailForm.get("facilityPracticeType").clearValidators();
    //   this.busDetailForm.get("facilityPracticeType").updateValueAndValidity();
    // } else if (this.infoData.industryClassification == "PHARMACEUTICALS") {
    //   this.industryClass = "Pharmaceuticals";
    //   this.hCareFlag = false;
    //   this.otherFlag = false;
    //   this.hCareFlag1 = false;
    //   this.otherFlag1 = false;
    //   this.clearFaciOthr();
    // } else if (this.infoData.industryClassification == "RESEARCH") {
    //   this.industryClass = "Research";
    //   this.hCareFlag = false;
    //   this.otherFlag = false;
    //   this.clearFaciOthr();
    // } else if (this.infoData.industryClassification == "WELLNESS_FITNESS") {
    //   this.industryClass = "Wellness & Fitness";
    //   this.hCareFlag = false;
    //   this.otherFlag = false;
    //   this.hCareFlag1 = false;
    //   this.otherFlag1 = false;
    //   this.clearFaciOthr();
    // }

    if (
      this.infoData.facilityPracticeType == undefined ||
      this.infoData.facilityPracticeType == null ||
      this.infoData.facilityPracticeType == ""
    ) {
      this.facilityFlag = false;
    } else if (
      this.infoData.facilityPracticeType != undefined &&
      this.infoData.facilityPracticeType != null &&
      this.infoData.facilityPracticeType != ""
    ) {
      this.facilityFlag = true;
    }

    if (
      this.infoData.userSocialPresence.twitter != undefined &&
      this.infoData.userSocialPresence.twitter != null
    ) {
      this.twitter = this.infoData.userSocialPresence.twitter;
    }

    if (
      this.infoData.userSocialPresence.alternamePageLink != undefined &&
      this.infoData.userSocialPresence.alternamePageLink != null
    ) {
      this.alternamePageLink =
        this.infoData.userSocialPresence.alternamePageLink;
    }

    if (
      this.infoData.userSocialPresence.blogURL != undefined &&
      this.infoData.userSocialPresence.blogURL != null
    ) {
      this.blogURL = this.infoData.userSocialPresence.blogURL;
    }

    if (
      this.infoData.userSocialPresence.facebook != undefined &&
      this.infoData.userSocialPresence.facebook != null
    ) {
      this.facebook = this.infoData.userSocialPresence.facebook;
    }

    if (
      this.infoData.userSocialPresence.linkedin != undefined &&
      this.infoData.userSocialPresence.linkedin != null
    ) {
      this.linkedin = this.infoData.userSocialPresence.linkedin;
    }

    this.monFrom = this.infoData.workingHours.monFromTime;
    this.monTo = this.infoData.workingHours.monToTime;
    this.tueFrom = this.infoData.workingHours.tueFromTime;
    this.tueTo = this.infoData.workingHours.tueToTime;
    this.wedFrom = this.infoData.workingHours.wedFromTime;
    this.wedTo = this.infoData.workingHours.wedToTime;
    this.thrFrom = this.infoData.workingHours.thrFromTime;
    this.thrTo = this.infoData.workingHours.thrToTime;
    this.friFrom = this.infoData.workingHours.friFromTime;
    this.friTo = this.infoData.workingHours.friToTime;
    this.satFrom = this.infoData.workingHours.satFromTime;
    this.satTo = this.infoData.workingHours.satToTime;
    this.sunFrom = this.infoData.workingHours.sunFromTime;
    this.sunTo = this.infoData.workingHours.sunToTime;
    this.monWork = this.infoData.workingHours.monWorking;
    this.tueWork = this.infoData.workingHours.tueWorking;
    this.wedWork = this.infoData.workingHours.wedWorking;
    this.thrWork = this.infoData.workingHours.thrWorking;
    this.friWork = this.infoData.workingHours.friWorking;
    this.satWork = this.infoData.workingHours.satWorking;
    this.sunWork = this.infoData.workingHours.sunWorking;
  }

  getCountry() {
    this.countryList = [];

    this.api.query("country/getAllCountries").subscribe((res) => {
      this.util.stopLoader();
      res.forEach((ele) => {
        var data: any = {};
        (data.countryName = ele.countryName),
          (data.countryCode = ele.countryCode),
          this.countryList.push(data);
      });
    }, err => {
      this.util.stopLoader();
    });
  }

  getStates() {
    this.stateListIN = [];
    this.api
      .query("country/getAllStates?countryCode=" + "IN")
      .subscribe((res) => {
        this.stateListIN = res;
      }, err => {
        this.util.stopLoader();
      });
    this.stateListCA = [];
    this.api
      .query("country/getAllStates?countryCode=" + "CA")
      .subscribe((res) => {
        this.stateListCA = res;
      }, err => {
        this.util.stopLoader();
      });
    this.stateListCA = [];
    this.api
      .query("country/getAllStates?countryCode=" + "AU")
      .subscribe((res) => {
        this.stateListAU = res;
      }, err => {
        this.util.stopLoader();
      });
  }

  generateYears() {
    var max = new Date().getFullYear();
    var min = max - 150;
    for (var i = min; i <= max; i++) {
      this.years.push(i);
    }
    // this.years.sort((a,b) => b - a);
  }

  public clearBusDetVal(field) {
    this.busDetailForm.get(field).clearValidators();
    this.busDetailForm.get(field).updateValueAndValidity();
  }

  zipCodeValidaiton(x: number): boolean {
    if (String(x).length > 10) {
      return false;
    }
    return true;
  }

  onChangeCountry(event, index) {
    this.companyLocationDetails.controls[index].patchValue({
      state: null,
      zipCode: null,
      locationId: null,
      city: null,
      street: null,
      country: event,
    });
    if (event == "US") {
    } else if (event == "AU") {
      const countryCode = event;
      this.stateListAU = [];
      this.api
        .query("country/getAllStates?countryCode=" + countryCode)
        .subscribe((res) => {
          this.stateListAU = res;
        }, err => {
          this.util.stopLoader();
        });
    } else if (event == "IN") {
      const countryCode = event;
      this.stateListIN = [];
      this.api
        .query("country/getAllStates?countryCode=" + countryCode)
        .subscribe((res) => {
          this.stateListIN = res;
        }, err => {
          this.util.stopLoader();
        });
    } else if (event == "CA") {
      const countryCode = event;
      this.stateListCA = [];
      this.api
        .query("country/getAllStates?countryCode=" + countryCode)
        .subscribe((res) => {
          this.stateListCA = res;
        }, err => {
          this.util.stopLoader();
        });
    } else {
    }
    this.companyLocationDetails.controls.forEach((ele) => {
      if (ele == index) {
        ele.get("state").setValidators([Validators.required]);
        ele.get("state").updateValueAndValidity();
        ele.get("city").setValidators([Validators.required]);
        ele.get("city").updateValueAndValidity();
        ele
          .get("zipCode")
          .setValidators([Validators.required, CustomValidator.minmaxLetters(this.ZIPCODE.min, this.ZIPCODE.max)]);
        ele.get("zipCode").updateValueAndValidity();
        ele.get("country").setValidators([Validators.required]);
        ele.get("country").updateValueAndValidity();

        ele
          .get("businessPhone")
          .setValidators([Validators.required,
          CustomValidator.minmaxLetters(this.BUSINESS_PHONE.min, this.BUSINESS_PHONE.max),
          Validators.pattern(this.BUSINESS_PHONE.pattern),
          ]);
        ele.get("businessPhone").updateValueAndValidity();
        ele
          .get("cellPhone")
          .setValidators([
            Validators.maxLength(10),
            Validators.pattern(/^[0-9]*$/),
          ]);
        ele.get("cellPhone").updateValueAndValidity();
        ele
          .get("businessEmail")
          .setValidators([Validators.required, Validators.email]);
        ele.get("businessEmail").updateValueAndValidity();

        ele
          .get("website")
          .setValidators([
            Validators.required,
            Validators.pattern(
              /^(?!.* .*)(?:[a-z0-9][a-z0-9-]{0,61}[a-z0-9]\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/
            ),
          ]);

        ele.get("website").updateValueAndValidity();
        // ele.get('address1').setValidators([Validators.required,  Validators.pattern(/^[^\s]+(\s+[^\s]+)*$/)])
        ele.get("address1").setValidators([Validators.required]);
        ele.get("address1").updateValueAndValidity();
      }
    });
  }

  keyPress(event: any) {
    this.numberonlyflag = false;
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
      this.numberonlyflag = true;
    }
  }

  keyPress1(event: any) {
    this.numberonlyflag1 = false;
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
      this.numberonlyflag1 = true;
    }
  }
  public noWhitespaceValidator(control: UntypedFormControl) {
    const isWhitespace = (control.value || "").trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
  }

  decline1() {
    this.lgModal.hide()
  }

  decline(): void {
    this.clearServiceFlag = false;
    this.modalRef.hide();
    this.hoursClearValidation("tueFromTime");
    this.hoursClearValidation("tueToTime");
    this.hoursClearValidation("monFromTime");
    this.hoursClearValidation("monToTime");
    this.hoursClearValidation("wedFromTime");
    this.hoursClearValidation("wedToTime");
    this.hoursClearValidation("thrFromTime");
    this.hoursClearValidation("thrToTime");
    this.hoursClearValidation("friFromTime");
    this.hoursClearValidation("friToTime");
    this.hoursClearValidation("satFromTime");
    this.hoursClearValidation("satToTime");
    this.hoursClearValidation("sunFromTime");
    this.hoursClearValidation("sunToTime");

  }

  checkSpace(event: any): boolean {
    return super.validSpace(event);
  }

  fileChangeEvent(event, popupName): void {
    const CheckSize = super.checkImageSize(event.target.files[0]);
    this.imageChangedEvent = event;
    if (event.target.files && event.target.files[0]) {
      this.fileUploadName = event.target.files.length;
      $("#profileimage").val;
      const acceptedImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
      if (!acceptedImageTypes.includes(event.target.files[0].type)) {
        Swal.fire('', 'Please upload the correct file type   (Only .jpg, .png, .jpeg)', 'info');
        this.myFileInput.nativeElement.value = "";
        this.modalRef.hide();
      }
      else if (CheckSize > 10) {
        $("#profileimage").val("");
        Swal.fire(`${this.IMAGE_ERROR}`);
      }
      else {
        this.PopupServicevlaues(popupName);
      }
    } else {
      $("#profileimage").val("");
    }
  }

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
    });
  }

  // modalclose() {
  //   for (let i = 1; i <= this.modalService.getModalsCount(); i++) {
  //     this.modalService.hide(i);
  //     this.myFileInput.nativeElement.value=''
  //   }
  // }
  imageLoaded() {
    const formData: FormData = new FormData();
    formData.append("file", this.fileToUpload, this.fileUploadName);
    this.api.create("upload/image", formData).subscribe((res) => {
      this.photoId = res.fileId;
      this.modalRef1.hide();
      //$("#profileimage").val("")
      this.img = {
        //  src :this.photoUrl + this.photoId
        src: AppSettings.ServerUrl + "download/" + this.photoId,
      };
    }, err => {
      this.util.stopLoader();
      if (err.status == 500) {
        this.util.stopLoader();
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: 'Something went wrong while uploading photo. Please, try again later.',
          showDenyButton: false,
          confirmButtonText: `ok`,
        })
      }
    });
  }

  closePhoto() {
    this.modalRef1.hide();
    $("#profileimage").val("");
    // this.fileUploadName = ''
    // this.myFileInput.nativeElement.value = '';
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

  onChangeIndustry(val) {
    if (val == "MEDICAL_HEALTHCARE_PRACTICE") {
      this.hCareFlag1 = true;
      this.otherFlag1 = false;
      this.busDetailForm
        .get("facilityPracticeType")
        .setValidators([Validators.required]);
      this.busDetailForm.get("facilityPracticeType").updateValueAndValidity();
      this.busDetailForm.get("others").clearValidators();
      this.busDetailForm.get("others").updateValueAndValidity();
      this.busDetailForm.get("others").setValue(null);
    } else if (val == "OTHER") {
      this.otherFlag1 = true;
      this.hCareFlag1 = false;
      // this.busDetailForm.get('others').setValidators([Validators.required, Validators.pattern(/^[^\s]+(\s+[^\s]+)*$/)])
      this.busDetailForm.get("others").setValidators([Validators.required]);
      this.busDetailForm.get("others").updateValueAndValidity();
      this.busDetailForm.get("facilityPracticeType").clearValidators();
      this.busDetailForm.get("facilityPracticeType").updateValueAndValidity();
      this.busDetailForm.get("facilityPracticeType").setValue(null);
    } else {
      this.busDetailForm.get("others").setValue(null);
      this.busDetailForm.get("facilityPracticeType").setValue(null);
      this.hCareFlag1 = false;
      this.otherFlag1 = false;
      this.busDetailForm.get("others").clearValidators();
      this.busDetailForm.get("others").updateValueAndValidity();
      this.busDetailForm.get("facilityPracticeType").clearValidators();
      this.busDetailForm.get("facilityPracticeType").updateValueAndValidity();
    }
  }

  changelocation(event, index) {
    // //// console.log(this.locationForm);

    // //// console.log(this.companyLocationDetails[0]);
    if (event.target.checked == true) {
      this.hide = true;
    } else if (event.target.checked == false) {
      this.hide = false;
    }

    this.infoData.companyLocationDetails.forEach((element, i) => {
      if (element.headquarters) {
        const swalWithBootstrapButtons = Swal.mixin({
          customClass: {
            confirmButton: "btn btn-success",
            cancelButton: "btn btn-danger",
          },
          buttonsStyling: false,
        });

        swalWithBootstrapButtons
          .fire({
            title: "Changing headquarter?",
            text: "There is already a headquarter selected. Do you want change it?",
            icon: "info",
            showCancelButton: true,
            confirmButtonText: "Yes, change!",
            cancelButtonText: "No, cancel!",
            reverseButtons: true,
          })
          .then((result) => {
            if (result.isConfirmed) {
              // this.infoData.companyLocationDetails.forEach(element => {
              //     element.headquarters=false;
              // });
              this.hide == false;
            } else if (result.dismiss === Swal.DismissReason.cancel) {
              this.hide == true;
              this.locationForm.value.companyLocationDetails[0].headquarters =
                false;
              this.locationForm.value.companyLocationDetails[0].headquarters =
                false;

              const faControl = (<UntypedFormArray>(
                this.locationForm.controls["companyLocationDetails"]
              )).at(index);
              faControl["controls"].headquarters.setValue(false);

              Swal.fire({
                position: "center",
                icon: "info",
                title: "Headquarters not changed ",
                showConfirmButton: false,
                timer: 1500,
              });
            }
          });
      } else {
      }
    });
  }

  curOrg(event, index) {
    // //// console.log(this.locationForm);

    if (event.target.checked == true) {
      this.hide = true;
    } else if (event.target.checked == false) {
      this.hide = false;
    }
  }

  keepPrimary(event, index) {
    if (event.target.checked == true) {
      this.companyLocationDetails.controls[0].patchValue({ primary: true })
    } else if (event.target.checked == false) {
      this.companyLocationDetails.controls[0].patchValue({ primary: false })
    }
  }

  getInsuranceType() {

    this.api
      .query("care/list/values/INSURANCE_COMPANYS")
      .subscribe((res) => {
        this.util.stopLoader();
        if (res.listItems != null) {
          res.listItems.forEach((ele) => {
            this.insuranceList.push(ele.item);
          });
        }
      }, err => {
        this.util.stopLoader();
      });
  }

  onKeyZip(event: any, index) {
    var data: any = {};
    data.countryCode = "US";
    data.zipCode = event.target.value;
    data.stateCode = "";
    this.util.startLoader();
    this.api.create("country/geodetails", data).subscribe((res) => {
      this.util.stopLoader();
      if (res && res != null && res.length > 0 && event.target.value != "") {
        res.forEach((ele) => {
          var data: any = {};
          data.city = ele.cityName;
          data.state = ele.stateName;
          this.getLocationFormgroup(index).patchValue(data);
        });
      } else {
        const d: any = {};
        d.city = null;
        d.state = null;
        // d.street = null;
        this.getLocationFormgroup(index).patchValue(d);
      }
    }, err => {
      this.util.stopLoader();
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
  }

  get a() {
    return this.aboutCompanyForm.controls;
  }

  getServiceFormGroup(index): UntypedFormGroup {
    const formGroup = this.serviceOptions.controls[index] as UntypedFormGroup;
    return formGroup;
  }

  get locationArray() {
    return this.locationForm.get("companyLocationDetails") as UntypedFormArray;
  }

  // removeLocation(index) {
  //   if(this.companyLocationDetails.length>1 && index == 0){
  //      this.companyLocationDetails.removeAt(index);
  //      this.checkHeadquarters()
  //   }else if(this.companyLocationDetails.length==1 && index == 0){
  //     this.locationArray.reset();
  //     this.checkHeadquarters()
  //   } else{
  //      this.companyLocationDetails.removeAt(index);
  //      this.checkHeadquarters()
  //   }

  // }
  locationSubmit: boolean = false

  removeLocation(index) {
    if (this.infoData.companyLocationDetails[index].locationId == this.commonVariables.locationId) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Oops...",
        text: "Sorry, you can't delete this business location as this is your primary location.",
        // text: 'Employee added successfully',
        showConfirmButton: false,
        timer: 6000,
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
          title: "Are you sure you want to delete?",
          text: "You can't get this data back once you have deleted it.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes",
          cancelButtonText: "Cancel",
          reverseButtons: true,
        })
        .then((result) => {
          if (result.isConfirmed) {
            // let deactivateBusinessID = localStorage.getItem('businessId');
            // this.infoData.companyLocationDetails.splice(index, 1)
            // this.util.startLoader()
            // this.api.updatePut('business/update', this.infoData).subscribe(res => {
            //   this.util.stopLoader()
            //       if (res.code === '00000') {
            //         this.currentHQValidity()
            //         swalWithBootstrapButtons.fire(
            //           'Deleted!',
            //           'Company location has been deleted.',
            //           'success'
            //         ).then((result) => {
            //           this.reloadpage()
            //           // if (result.value) {
            //           //   this.router.navigate(['landingPage'])
            //           // }
            //         })
            //       }

            //     })

            this.api
              .delete(
                "business/companylocation/remove/" +
                this.infoData.companyLocationDetails[index].locationId
              )
              .subscribe((res) => {
                this.util.stopLoader();
                if (res.code == "00000") {
                  //this.infoData.companyLocationDetails.removeAt(index);

                  this.infoData.companyLocationDetails.splice(index, 1);

                  Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Company location has been deleted.",
                    showConfirmButton: false,
                    timer: 2000,
                  });
                } else {
                  Swal.fire({
                    position: "center",
                    icon: "error",
                    title: "Company location not deleted.",
                    showConfirmButton: false,
                    timer: 1500,
                  });
                }
              }, err => {
                this.util.stopLoader();
              });
          }
          //  else if (result.dismiss === Swal.DismissReason.cancel) {
          //   swalWithBootstrapButtons.fire(
          //     "Cancelled",
          //     "Company location is safe :)",
          //     "error"
          //   );
          // }
        });
    }
  }

  // checkHeadquarters(){
  //   var array: any = []
  //   this.companyLocationDetails.controls.forEach(ele=>{
  //     array.push(ele.get('headquarters').value)
  //   })
  //   var a = array.findIndex(x => x==true)
  //   if(a=='-1'){
  //     this.currentIndex = null
  //   }
  // }

  get physicianArray() {
    return this.serviceForm.get("serviceOptions") as UntypedFormArray;
  }

  onOpenCalendar(container) {
    container.monthSelectHandler = (event: any): void => {
      container._store.dispatch(container._actions.select(event.date));
    };
    container.setViewMode("month");
  }

  get Social() {
    return this.userSocialPresenceForm.controls;
  }

  userSocialPresenceSave() {
    // this.socialSaveFlag = true
    this.infoData.userSocialPresence.linkedin =
      this.userSocialPresenceForm.value.linkedin;
    this.infoData.userSocialPresence.twitter =
      this.userSocialPresenceForm.value.twitter;
    this.infoData.userSocialPresence.facebook =
      this.userSocialPresenceForm.value.facebook;
    this.infoData.userSocialPresence.blogURL =
      this.userSocialPresenceForm.value.blogURL;
    this.infoData.userSocialPresence.alternamePageLink =
      this.userSocialPresenceForm.value.alternamePageLink;

    this.linkedin = this.userSocialPresenceForm.value.linkedin;
    this.twitter = this.userSocialPresenceForm.value.twitter;
    this.facebook = this.userSocialPresenceForm.value.facebook;
    this.blogURL = this.userSocialPresenceForm.value.blogURL;
    this.alternamePageLink =
      this.userSocialPresenceForm.value.alternamePageLink;
    this.util.startLoader();
    this.api.updatePut("business/update", this.infoData).subscribe((res) => {
      if (res) {
        this.util.stopLoader();
        this.ngOnInit();
        var val: any = {}
        val.boolean = true
        this.commonvalues.setProfo(val)
      }
    }, err => {
      this.util.stopLoader();
    });
    this.modalRef.hide();
  }

  hourSave() {
    // this.hourSubmit = true
    if (this.hoursForm.valid) {
      this.monFrom = this.hoursForm.value.monFromTime;
      this.monTo = this.hoursForm.value.monToTime;
      this.tueFrom = this.hoursForm.value.tueFromTime;
      this.tueTo = this.hoursForm.value.tueToTime;
      this.wedFrom = this.hoursForm.value.wedFromTime;
      this.wedTo = this.hoursForm.value.wedToTime;
      this.thrFrom = this.hoursForm.value.thrFromTime;
      this.thrTo = this.hoursForm.value.thrToTime;
      this.friFrom = this.hoursForm.value.friFromTime;
      this.friTo = this.hoursForm.value.friToTime;
      this.satFrom = this.hoursForm.value.satFromTime;
      this.satTo = this.hoursForm.value.satToTime;
      this.sunFrom = this.hoursForm.value.sunFromTime;
      this.sunTo = this.hoursForm.value.sunToTime;
      this.monWork = this.hoursForm.value.monWorking;
      this.tueWork = this.hoursForm.value.tueWorking;
      this.wedWork = this.hoursForm.value.wedWorking;
      this.thrWork = this.hoursForm.value.thrWorking;
      this.friWork = this.hoursForm.value.friWorking;
      this.satWork = this.hoursForm.value.satWorking;
      this.sunWork = this.hoursForm.value.sunWorking;

      this.infoData.workingHours.monFromTime = this.hoursForm.value.monFromTime;
      this.infoData.workingHours.applyAll = this.hoursForm.value.applyAll;
      this.infoData.workingHours.monToTime = this.hoursForm.value.monToTime;
      this.infoData.workingHours.monWorking = this.hoursForm.value.monWorking;
      this.infoData.workingHours.tueFromTime = this.hoursForm.value.tueFromTime;
      this.infoData.workingHours.tueToTime = this.hoursForm.value.tueToTime;
      this.infoData.workingHours.tueWorking = this.hoursForm.value.tueWorking;
      this.infoData.workingHours.wedToTime = this.hoursForm.value.wedToTime;
      this.infoData.workingHours.wedFromTime = this.hoursForm.value.wedFromTime;
      this.infoData.workingHours.wedWorking = this.hoursForm.value.wedWorking;
      this.infoData.workingHours.thrToTime = this.hoursForm.value.thrToTime;
      this.infoData.workingHours.thrFromTime = this.hoursForm.value.thrFromTime;
      this.infoData.workingHours.thrWorking = this.hoursForm.value.thrWorking;
      this.infoData.workingHours.friFromTime = this.hoursForm.value.friFromTime;
      this.infoData.workingHours.friToTime = this.hoursForm.value.friToTime;
      this.infoData.workingHours.friWorking = this.hoursForm.value.friWorking;
      this.infoData.workingHours.satFromTime = this.hoursForm.value.satFromTime;
      this.infoData.workingHours.satToTime = this.hoursForm.value.satToTime;
      this.infoData.workingHours.satWorking = this.hoursForm.value.satWorking;
      this.infoData.workingHours.sunFromTime = this.hoursForm.value.sunFromTime;
      this.infoData.workingHours.sunToTime = this.hoursForm.value.sunToTime;
      this.infoData.workingHours.sunWorking = this.hoursForm.value.sunWorking;
      this.util.startLoader();
      this.api.updatePut("business/update", this.infoData).subscribe((res) => {
        if (res) {
          this.util.stopLoader();
          var obj: any = {}
          obj.boolean = true
          this.commonvalues.setProfo(obj)
        }
      }, err => {
        this.util.stopLoader();
      });
      this.modalRef.hide();
    }
  }

  closeOptions() {
    this.modalRef.hide();
    this.ngOnInit()
    $(".modal-backdrop").remove();
    $("modal-container").remove()
    document.body.className = document.body.className.replace("modal-open", "");
  }
  physicianSave() {
    if (this.serviceForm.valid) {
      // "conditionCreated" : this.serviceForm.value.conditionCreated,
      (this.infoData.serviceOptions.insuranceAccepted =
        this.serviceForm.value.insuranceAccepted),
        (this.infoData.serviceOptions.isApplicable =
          this.serviceForm.value.isApplicable),
        (this.infoData.serviceOptions.accredition =
          this.serviceForm.value.accredition),
        (this.infoData.serviceOptions.serviceType =
          this.serviceForm.value.serviceType),
        (this.infoData.serviceOptions.medicareCertified =
          this.serviceForm.value.medicareCertified),
        (this.infoData.serviceOptions.acceptingNewPatients =
          this.serviceForm.value.acceptingNewPatients),
        (this.infoData.serviceOptions.privatePayAccepted =
          this.serviceForm.value.privatePayAccepted),
        (this.accredition = this.serviceForm.value.accredition);
      this.serviceType = this.serviceForm.value.serviceType;
      this.insuranceAccepted = this.serviceForm.value.insuranceAccepted;
      this.medicareCertified = this.serviceForm.value.medicareCertified;
      if (this.medicareCertified == true) {
        this.medicareCertified = "Yes";
      } else if (this.medicareCertified == false) {
        this.medicareCertified = "No";
      }
      this.acceptingNewPatients = this.serviceForm.value.acceptingNewPatients;
      if (this.acceptingNewPatients == true) {
        this.acceptingNewPatients = "Yes";
      } else if (this.acceptingNewPatients == false) {
        this.acceptingNewPatients = "No";
      }
      this.privatePayAccepted = this.serviceForm.value.privatePayAccepted;

      if (this.privatePayAccepted == true) {
        this.privatePayAccepted = "Yes";
      } else if (this.privatePayAccepted == false) {
        this.privatePayAccepted = "No";
      }
      this.util.startLoader();
      this.api.updatePut("business/update", this.infoData).subscribe((res) => {
        if (res) {
          this.closeOptions();
          this.reloadpage();
          var obj: any = {}
          obj.boolean = true
          this.commonvalues.setProfo(obj)
        }
        // this.util.stopLoader();
        // this.ngOnInit();
      }, err => {
        this.util.stopLoader();
      });

    } else {
      // alert("Form is not valid")
      Swal.fire("Form is not valid");
    }
  }

  get detailControl() {
    return this.busDetailForm.controls;
  }

  getdatas(event) {
    event.value = this.infoData.facilityPracticeType;
    this.onChngFacility(event, null);
  }

  openNested(templateNested1: TemplateRef<any>) {
    this.modalRef2 = this.modalService.show(templateNested1, {
      animated: true,
      backdrop: true,
      ignoreBackdropClick: true,
      class: "second",
    });
  }

  onHidden(): void {
    this.modalRef2.hide();
    this.busDetailForm.patchValue({
      facilityPracticeType: this.infoData.facilityPracticeType,
    });
  }

  clearService() {
    this.clearServiceFlag = true;
    this.modalRef2.hide();
  }

  count: number = 0;
  onChngFacility(event, templateNested) {
    // //// console.log("this is event")
    // //// console.log(event)
    this.count = this.count + 1;
    if (this.count > 1 && this.infoData.facilityPracticeType != event) {
      // this.isModalShown = true;
      this.openNested(templateNested);
    }

    if (event == "Skilled Nursing Facility") {
      this.api
        .query("care/list/values/SKILLED_NURSING_FACILITY_SERVICE_TYPE")
        .subscribe((res) => {
          this.serviceTypeList = [];
          if (res.listItems != null) {
            res.listItems.forEach((ele) => {
              this.serviceTypeList.push(ele.item);
            });
          }
          //  //// console.log("this is service list")
          //  //// console.log(this.serviceTypeList)
        }, err => {
          this.util.stopLoader();
        });
      this.api
        .query("care/list/values/SKILLED_NURSING_FACILITY_ACCREDITION")
        .subscribe((res) => {
          this.accreditionValue = [];
          if (res.listItems != null) {
            res.listItems.forEach((ele) => {
              this.accreditionValue.push(ele.item);
            });
          }
        }, err => {
          this.util.stopLoader();
        });
    } else if (event == "Home Care") {
      this.api
        .query("care/list/values/HOME_CARE_SERVICE_TYPE")
        .subscribe((res) => {
          this.serviceTypeList = [];
          if (res.listItems != null) {
            res.listItems.forEach((ele) => {
              this.serviceTypeList.push(ele.item);
            });
          }
        }, err => {
          this.util.stopLoader();
        });
    } else if (event == "Home Heathcare Agency") {
      this.api.query("care/list/values/HHA_SERVICE_TYPE").subscribe((res) => {
        this.serviceTypeList = [];
        if (res.listItems != null) {
          res.listItems.forEach((ele) => {
            this.serviceTypeList.push(ele.item);
          });
        }
      }, err => {
        this.util.stopLoader();
      });

      this.api.query("care/list/values/HHA_ACCREDITION").subscribe((res) => {
        this.accreditionValue = [];
        if (res.listItems != null) {
          res.listItems.forEach((ele) => {
            this.accreditionValue.push(ele.item);
          });
        }
      }, err => {
        this.util.stopLoader();
      });
    } else if (event == "Hospice") {
      this.api
        .query("care/list/values/HOSPICE_SERVICE_TYPE")
        .subscribe((res) => {
          this.serviceTypeList = [];
          if (res.listItems != null) {
            res.listItems.forEach((ele) => {
              this.serviceTypeList.push(ele.item);
            });
          }
        }, err => {
          this.util.stopLoader();
        });

      this.api
        .query("care/list/values/HOSPICE_ACCREDITION")
        .subscribe((res) => {
          this.accreditionValue = [];
          res.listItems.forEach((ele) => {
            this.accreditionValue.push(ele.item);
          });
        }, err => {
          this.util.stopLoader();
        });
    } else if (event == "Pharmacy") {
      this.api
        .query("care/list/values/PHARMACY_SERVICE_TYPE")
        .subscribe((res) => {
          this.serviceTypeList = [];
          if (res.listItems != null) {
            res.listItems.forEach((ele) => {
              this.serviceTypeList.push(ele.item);
            });
          }
        }, err => {
          this.util.stopLoader();
        });

      this.api
        .query("care/list/values/PHARMACY_ACCREDITION")
        .subscribe((res) => {
          this.accreditionValue = [];
          if (res.listItems != null) {
            res.listItems.forEach((ele) => {
              this.accreditionValue.push(ele.item);
            });
          }
        }, err => {
          this.util.stopLoader();
        });
    } else if (event == "DME") {
      this.api.query("care/list/values/DME_SERVICE_TYPE").subscribe((res) => {
        this.serviceTypeList = [];
        if (res.listItems != null) {
          res.listItems.forEach((ele) => {
            this.serviceTypeList.push(ele.item);
          });
        }
      }, err => {
        this.util.stopLoader();
      });
      this.api.query("care/list/values/DME_ACCREDITION").subscribe((res) => {
        this.accreditionValue = [];
        if (res.listItems != null) {
          res.listItems.forEach((ele) => {
            this.accreditionValue.push(ele.item);
          });
        }
      }, err => {
        this.util.stopLoader();
      });
    } else {
      this.serviceTypeList = [];
      this.accreditionValue = [];
    }
  }

  digitKeyOnly(e) {
    var keyCode = e.keyCode == 0 ? e.charCode : e.keyCode;
    if ((keyCode >= 37 && keyCode <= 40) || (keyCode == 8 || keyCode == 9 || keyCode == 13) || (keyCode >= 48 && keyCode <= 57)) {
      return true;
    }
    return false;
  }

  changeHours(event) {
    if (event.target.checked == true) {
      this.hoursForm.patchValue({
        applyAll: true,
        tueWorking: true,
        wedWorking: true,
        thrWorking: true,
        friWorking: true,
        satWorking: true,
        sunWorking: true,
        tueToTime: this.tovalue,
        tueFromTime: this.fromvalue,
        wedFromTime: this.fromvalue,
        wedToTime: this.tovalue,
        thrFromTime: this.fromvalue,
        thrToTime: this.tovalue,
        friFromTime: this.fromvalue,
        friToTime: this.tovalue,
        satFromTime: this.fromvalue,
        satToTime: this.tovalue,
        sunFromTime: this.fromvalue,
        sunToTime: this.tovalue,
      });
      this.hoursValidate("tueToTime");
      this.hoursValidate("tueFromTime");
      this.hoursValidate("wedFromTime");
      this.hoursValidate("wedToTime");
      this.hoursValidate("thrFromTime");
      this.hoursValidate("thrToTime");
      this.hoursValidate("friFromTime");
      this.hoursValidate("friToTime");
      this.hoursValidate("satFromTime");
      this.hoursValidate("satToTime");
      this.hoursValidate("sunFromTime");
      this.hoursValidate("sunToTime");
    } else if (event.target.checked == false) {
      this.hoursForm.patchValue({
        applyAll: false,
        tueWorking: false,
        wedWorking: false,
        thrWorking: false,
        friWorking: false,
        satWorking: false,
        sunWorking: false,
        tueToTime: null,
        tueFromTime: null,
        wedFromTime: null,
        wedToTime: null,
        thrFromTime: null,
        thrToTime: null,
        friFromTime: null,
        friToTime: null,
        satFromTime: null,
        satToTime: null,
        sunFromTime: null,
        sunToTime: null,
      });
      this.hoursClearValidation("tueToTime");
      this.hoursClearValidation("tueFromTime");
      this.hoursClearValidation("wedFromTime");
      this.hoursClearValidation("wedToTime");
      this.hoursClearValidation("thrFromTime");
      this.hoursClearValidation("thrToTime");
      this.hoursClearValidation("friFromTime");
      this.hoursClearValidation("friToTime");
      this.hoursClearValidation("satFromTime");
      this.hoursClearValidation("satToTime");
      this.hoursClearValidation("sunFromTime");
      this.hoursClearValidation("sunToTime");
    }
  }

  frmHr(event) {
    this.fromflag = true;
    this.fromvalue = null;
    this.fromvalue = event.target.value;
    this.hoursForm.patchValue({
      applyAll: false,
    });
    this.checkflag();
  }

  fromHrOtherDay(event) {
    this.hoursForm.patchValue({
      applyAll: false,
    });
  }

  toHrOtherDay(event) {
    this.hoursForm.patchValue({
      applyAll: false,
    });
  }

  toHr(event) {
    this.toflag = true;
    this.tovalue = null;
    this.tovalue = event.target.value;
    this.hoursForm.patchValue({
      applyAll: false,
    });
    this.checkflag();
  }

  hoursValidate(value) {
    this.hoursForm.get(value).setValidators([Validators.required]);
    this.hoursForm.get(value).updateValueAndValidity();
    // //// console.log("This is run")
  }

  hoursClearValidation(value) {
    this.hoursForm.get(value).clearValidators();
    this.hoursForm.get(value).updateValueAndValidity();
    // //// console.log("This is executed")
  }

  doHours(event) {
    if (event.target.checked == true) {
      this.worktime = true;
      if (this.toflag == false && this.fromflag == false) {
        this.hoursForm.get("applyAll").disable();
      }
      // this.hoursValidate('monFromTime')
      // this.hoursValidate('monToTime')
      this.hoursForm.get("monFromTime").setValidators([Validators.required]);
      this.hoursForm.get("monFromTime").updateValueAndValidity();
      this.hoursForm.get("monToTime").setValidators([Validators.required]);
      this.hoursForm.get("monToTime").updateValueAndValidity();
    } else if (event.target.checked == false) {
      this.tovalue = null;
      this.fromvalue = null;
      this.fromflag = false;
      this.toflag = false;
      this.hoursForm.patchValue({
        applyAll: false,
        monFromTime: null,
        monToTime: null,
      });
      this.hoursForm.get("applyAll").disable();
      this.worktime = false;
      this.hoursClearValidation("monFromTime");
      this.hoursClearValidation("monToTime");
    }
  }

  tue(event) {
    if (event.target.checked == false) {
      this.hoursForm.patchValue({
        tueFromTime: null,
        tueToTime: null,
        applyAll: false,
      });
      this.checkdays();
      this.hoursClearValidation("tueFromTime");
      this.hoursClearValidation("tueToTime");
      this.tuetrue = false;
    } else if (event.target.checked == true) {
      this.hoursValidate("tueFromTime");
      this.hoursValidate("tueToTime");
      this.tuetrue = true;
    }
  }

  wed(event) {
    if (event.target.checked == false) {
      this.hoursForm.patchValue({
        wedFromTime: null,
        wedToTime: null,
        applyAll: false,
      });
      this.checkdays();
      this.hoursClearValidation("wedFromTime");
      this.hoursClearValidation("wedToTime");
    } else if (event.target.checked == true) {
      this.hoursValidate("wedFromTime");
      this.hoursValidate("wedToTime");
    }
  }

  thu(event) {
    if (event.target.checked == false) {
      this.hoursForm.patchValue({
        thrFromTime: null,
        thrToTime: null,
        applyAll: false,
      });
      this.checkdays();
      this.hoursClearValidation("thrFromTime");
      this.hoursClearValidation("thrToTime");
    } else if (event.target.checked == true) {
      this.hoursValidate("thrFromTime");
      this.hoursValidate("thrToTime");
    }
  }

  fri(event) {
    if (event.target.checked == false) {
      this.hoursForm.patchValue({
        friFromTime: null,
        friToTime: null,
        applyAll: false,
      });
      this.checkdays();
      this.hoursClearValidation("friFromTime");
      this.hoursClearValidation("friToTime");
    } else if (event.target.checked == true) {
      this.hoursValidate("friFromTime");
      this.hoursValidate("friToTime");
    }
  }

  sat(event) {
    if (event.target.checked == false) {
      this.hoursForm.patchValue({
        satFromTime: null,
        satToTime: null,
        applyAll: false,
      });
      this.checkdays();
      this.hoursClearValidation("satFromTime");
      this.hoursClearValidation("satToTime");
    } else if (event.target.checked == true) {
      this.hoursValidate("satFromTime");
      this.hoursValidate("satToTime");
    }
  }

  sun(event) {
    if (event.target.checked == false) {
      this.hoursForm.patchValue({
        sunFromTime: null,
        sunToTime: null,
        applyAll: false,
      });
      this.checkdays();
      this.hoursClearValidation("sunFromTime");
      this.hoursClearValidation("sunToTime");
    } else if (event.target.checked == true) {
      this.hoursValidate("sunFromTime");
      this.hoursValidate("sunToTime");
    }
  }

  get hourControl() {
    return this.hoursForm.controls;
  }

  checkflag() {
    if (this.toflag == true && this.fromflag == true) {
      this.hoursForm.get("applyAll").enable();
    } else {
      this.hoursForm.get("applyAll").disable();
    }
  }

  checkdays() {
    if (
      this.hoursForm.value.tueWorking == false &&
      this.hoursForm.value.wedWorking == false &&
      this.hoursForm.value.thrWorking == false &&
      this.hoursForm.value.friWorking == false &&
      this.hoursForm.value.satWorking == false &&
      this.hoursForm.value.sunWorking == false
    ) {
      this.hoursForm.get("applyAll").setValue(false);
    }
  }

  checkShown() {
    if (
      this.infoData != undefined &&
      this.infoData != null &&
      this.infoData != ""
    ) {
      if (this.infoData.workingHours.monWorking != null) {
        if (this.infoData.workingHours.monWorking == true) {
          this.worktime = true;
        } else {
          this.worktime = false;
        }
      }
    }
  }

  aboutSave() {
    // this.amsubmit = true;
    // //// console.log(this.aboutCompanyForm.value.aboutCompany == "");

    if (this.aboutCompanyForm.value.aboutCompany == "") {
      this.infoData.aboutCompany = "Please write something of your company";
    } else {
      this.infoData.aboutCompany = this.infoData.aboutCompany;
    }

    if (this.aboutCompanyForm.valid) {
      if (
        this.aboutCompanyForm.value.aboutCompany != undefined &&
        this.aboutCompanyForm.value.aboutCompany != "" &&
        this.aboutCompanyForm.value.aboutCompany != null
      ) {
        this.infoData.aboutCompany = this.aboutCompanyForm.value.aboutCompany;
      } else {
        this.infoData.aboutCompany = this.infoData.aboutCompany;
      }

      this.util.startLoader();
      this.api.updatePut("business/update", this.infoData).subscribe((res) => {
        this.util.stopLoader();
        // //// console.log('NGX summer not data patch:',res)
        if (res.code == "00000") {
          //  this.aboutCompany = this.aboutCompanyForm.value.aboutCompany
          this.aboutCompany = res.aboutCompany;
          //  //// console.log('res.aboutCompany',res.aboutCompany.lenght);
          this.ngOnInit();
          var obj: any = {}
          obj.boolean = true
          this.commonvalues.setProfo(obj)
        }
      }, err => {
        this.util.stopLoader();
      });
      // this.modalRef.hide();
      this.lgModal.hide()
    }
  }

  getLocationFormgroup(index: any): UntypedFormGroup {
    const formGroup = this.companyLocationDetails.controls[index] as UntypedFormGroup;
    return formGroup;
  }

  createLocation(): UntypedFormGroup {
    return this.fb.group(
      {
        primary: [false],
        locationId: [null],
        address1: [
          null,
          [Validators.required, CustomValidator.checkWhiteSpace(), CustomValidator.max(this.BUSINESS_ADDRESS.max)],
        ],
        address2: [null], //,  Validators.compose([this.noWhitespaceValidator])
        zipCode: [null, [Validators.required, CustomValidator.minmaxLetters(this.ZIPCODE.min, this.ZIPCODE.max)]],
        city: [null, [Validators.required, CustomValidator.max(this.CITY.max)]],
        state: [null, [Validators.required, CustomValidator.max(this.STATE.max)]],
        country: [null, [Validators.required]],
        street: [null],
        headquarters: [null],
        businessPhone: [
          null,
          [
            Validators.required, CustomValidator.minmaxLetters(this.BUSINESS_PHONE.min, this.BUSINESS_PHONE.max),
            Validators.pattern(this.BUSINESS_PHONE.pattern),
          ],
        ],
        cellPhone: [
          null,
          [Validators.maxLength(10), Validators.pattern(/^[0-9]*$/)],
        ],
        businessEmail: [null, [Validators.required, Validators.email]],
        website: [
          null,
          [
            Validators.required,
            Validators.pattern(
              /^(?!.* .*)(?:[a-z0-9][a-z0-9-]{0,61}[a-z0-9]\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/
            ),
          ],
        ],
      },
    );
  }

  addLocation() {
    this.companyLocationDetails = this.locationForm.get(
      "companyLocationDetails"
    ) as UntypedFormArray;

    this.companyLocationDetails.push(this.createLocation());
  }

  // locationSave() {
  //   this.ldSubmit = true;
  //   if(this.locationForm.valid){
  //     this.infoData.companyLocationDetails = this.locationForm.value.companyLocationDetails
  //     this.locationDetail = this.infoData.companyLocationDetails
  //     this.util.startLoader()
  //     this.api.updatePut('business/update',this.infoData).subscribe(res => {
  //       this.util.stopLoader();
  //       this.reloadpage();
  //     });
  //     this.modalRef.hide();
  //   }else{

  //   }
  // }

  // sorting work location array  in descending order with headquarters on top
  ar() {
    var a = this.infoData.companyLocationDetails.findIndex(
      (x) => x.headquarters == true
    );
    if (a != "-1") {
      this.infoData.companyLocationDetails.sort(function (x, y) {
        return x.headquarters == true ? -1 : y.headquarters == true ? 1 : 0;
      });
    }
  }

  locationSave(value: any) {
    this.ldSubmit = true;
    if (value == "edit") {
      if (this.locationForm.valid) {
        this.infoData.companyLocationDetails.forEach((element, i) => {
          element.headquarters = false;
          var index = parseInt(i);
          // if (index == 0) {
          //   element.primary = true;
          // }
        });

        //  this.companyLocationDetails.controls[0].patchValue({primary: true});

        //  //// console.log("value3333333333333333333333 "+  this.companyLocationDetails.controls[0]);
        this.infoData.companyLocationDetails.splice(
          this.locationIndex,
          1,
          this.companyLocationDetails.getRawValue()[0]
        );

        // this.infoData.companyLocationDetails.forEach((element, i) => {
        //   var index = parseInt(i);
        //   if (index == 0) {
        //     element.primary = true;
        //   }
        //   if (element.headquarters == true) {
        //     this.infoData.companyLocationDetails[0].primary = false;
        //     element.primary = true;
        //   }
        // });
        //sorting location array with headquarters location on top.
        // this.ar();
        this.util.startLoader();
        this.api
          .updatePut("business/update", this.infoData)
          .subscribe((res) => {
            // //// console.log("this.companyLocationDetails", res);
            this.util.stopLoader();
            if (res.code == "00000") {
              this.reloadpage();
              this.modalRef.hide();
              var obj: any = {}
              obj.boolean = true
              this.commonvalues.setProfo(obj)
              let persistedLocationData: any = this.infoData.companyLocationDetails.filter((ele: any) => ele.primary == true);
              let isLocationChanged: boolean = false
              isLocationChanged = (this.locationData[0].city != persistedLocationData[0].city
                || this.locationData[0].state != persistedLocationData[0].state
                || this.locationData[0].zipCode != persistedLocationData[0].zipCode
                || this.locationData[0].country != persistedLocationData[0].country
                || this.locationData[0].address1 != persistedLocationData[0].address1) ? true : false;
              this.reloadpage(null, isLocationChanged);
            } else if (res.code == "10007") {
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Email domain and website domain should be the same. For example: abc@abc.com & abc.com",
                showDenyButton: false,
                confirmButtonText: `ok`,
              }).then((result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                  this.companyLocationDetails.controls[0]
                    .get("businessEmail")
                    .setValue(null);
                  // this.disavow = false;
                }
              });
            } else if (res.code == "10008") {
              Swal.fire({
                title:
                  " Business Page already exists for the given location. Please create with new location",
                showDenyButton: false,
                icon: "info",
                confirmButtonText: `ok`,
              }).then((result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                }
              });
            }
          }, err => {
            this.util.stopLoader();
          });
      }
    } else if (value == "add") {
      if (this.locationForm.valid) {
        // this.infoData.companyLocationDetails.forEach((element, i) => {
        //   element.headquarters = false;
        // });

        this.infoData.companyLocationDetails.push(
          this.companyLocationDetails.getRawValue()[0]
        );
        // this.infoData.companyLocationDetails.forEach((element, i) => {
        //   var index = parseInt(i);
        //   if (index == 0) {
        //     element.primary = true;
        //   }
        //   if (element.headquarters == true) {
        //     this.infoData.companyLocationDetails[0].primary = false;
        //     element.primary = true;
        //   }
        // });

        this.util.startLoader();
        this.api
          .updatePut("business/update", this.infoData)
          .subscribe((res) => {
            this.util.stopLoader();
            if (res.code == "00000") {
              // this.currentHQValidity()
              // this.ar()
              var obj: any = {}
              obj.boolean = true
              this.commonvalues.setProfo(obj)
              this.reloadpage();
              this.modalRef.hide();
            } else if (res.code == "10007") {
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Email domain and website domain should be the same. For example: abc@abc.com & abc.com",
                showDenyButton: false,
                confirmButtonText: `ok`,
              }).then((result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                  this.companyLocationDetails.controls[0]
                    .get("businessEmail")
                    .setValue(null);
                  // this.disavow = false;
                }
              });
            }
          }, err => {
            this.util.stopLoader();
          });
      }
    }
  }

  currentHQValidity() {
    var a = this.infoData.companyLocationDetails.findIndex(
      (x) => x.headquarters == true
    );
    if (a != "-1") {
      // //// console.log("current org exist")
      this.currentHeadQuarters = true;
      // this.currentIndex = a
      this.searchData.setHeadQuarters(a);
      //  this.hide = true
    } else {
      // //// console.log("current org doenst exist exist")
      this.currentHeadQuarters = false;
      // this.currentIndex = null
      this.searchData.setHeadQuarters(null);
      //  this.hide = false
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
    Object.keys(this.busDetailForm.controls).forEach((field) => {
      //////// console.log(field)
      data.forEach((e) => {
        if (field == e) {
          this.busDetailForm.get(e).disable({ onlySelf: true });
        }
      });
    });
  }

  getFacilityType() {

    this.api
      .query("care/list/values/FACILITY_PRACTICE_TYPE")
      .subscribe((res) => {
        this.util.stopLoader();
        var data = res.listItems;
        data.forEach((ele) => {
          this.facilityValue.push(ele.item);
        });
      }, err => {
        this.util.stopLoader();
      });
  }

  getIndustryClass() {

    var data = { 'domain': 'GIGSUMO_JOB_TITLE,GIGSUMO_INDUSTRY_CLASSIFICATION' }
    this.api
      .create('listvalue/findbyList', data)
      .subscribe((res) => {
        this.util.stopLoader();
        this.industryType = [];
        if (res.data.GIGSUMO_INDUSTRY_CLASSIFICATION.listItems != null) {
          res.data.GIGSUMO_INDUSTRY_CLASSIFICATION.listItems.forEach((ele) => {
            this.industryType.push({
              item: ele.item,
            });
          });

        }
      }, err => {
        this.util.stopLoader();
      });
  }

  previousBusinessName: any;
  locationData: any;
  infoSave() {

    if (
      this.busDetailForm.value.industryClassification ==
      "MEDICAL_HEALTHCARE_PRACTICE"
    ) {
      this.industryClass = "Medical and Healthcare Practice";
      this.busDetailForm
        .get("facilityPracticeType")
        .setValidators([Validators.required]);
      this.busDetailForm.get("facilityPracticeType").updateValueAndValidity();
      this.busDetailForm.get("others").clearValidators();
      this.busDetailForm.get("others").updateValueAndValidity();
    } else if (this.busDetailForm.value.industryClassification == "OTHER") {
      this.industryClass = "Other";
      // this.otherFlag = true
      // this.hCareFlag = false
      this.busDetailForm
        .get("others")
        .setValidators([
          Validators.required,
          Validators.pattern(/^[^\s]+(\s+[^\s]+)*$/),
        ]);
      this.busDetailForm.get("others").updateValueAndValidity();
      this.busDetailForm.get("facilityPracticeType").clearValidators();
      this.busDetailForm.get("facilityPracticeType").updateValueAndValidity();
    } else {
      //clearing facility and other validations
      this.clearFaciOthr();
    }

    if (this.busDetailForm.valid) {
      this.infoData.businessOwner = this.busDetailForm.value.businessOwner;
      this.infoData.others = this.busDetailForm.value.others;
      this.infoData.industryClassification =
        this.busDetailForm.value.industryClassification;
      this.infoData.facilityPracticeType =
        this.busDetailForm.value.facilityPracticeType;
      this.infoData.businessName = this.busDetailForm.value.businessName;
      this.infoData.businessLogo = this.photoId;
      this.infoData.tagLine = this.busDetailForm.value.tagLine;
      // if (this.bannerChanged == true) {
      //   this.infoData.businessBanner = this.businessBanner;
      // } else {
      //   this.infoData.businessBanner = this.busDetailForm.value.businessBanner;
      // }
      this.infoData.businessBanner = localStorage.getItem("businessBannerImage");
      this.infoData.companyType = this.busDetailForm.value.companyType;
      this.infoData.yearStarted = this.busDetailForm.value.yearStarted;
      this.infoData.companySize = this.busDetailForm.value.companySize;
      this.infoData.organizationType = this.busDetailForm.getRawValue().organizationType;

      this.object = [];
      this.busDetailForm.value.tags.forEach((ele) => {
        if (ele["label"]) {
          this.object.push(ele["label"]);
        } else {
          this.object.push(ele);
        }
      });
      this.infoData.tags = this.object;

      //clearing service options
      if (this.clearServiceFlag == true) {
        this.infoData.serviceOptions.accredition = null;
        this.infoData.serviceOptions.serviceType = null;
        this.clearServiceFlag = false;
      }
      // //// console.log(JSON.stringify(this.infoData))

      this.util.startLoader();
      this.api.updatePut("business/update", this.infoData).subscribe((res) => {
        this.util.stopLoader();
        if (res.code == "00000") {
          // this.ngOnInit()
          var obj: any = {}
          obj.boolean = true
          this.commonvalues.setProfo(obj)

          if (
            this.busDetailForm.value.industryClassification ==
            "MEDICAL_HEALTHCARE_PRACTICE"
          ) {
            this.industryClass = "Medical and Healthcare Practice";
            this.hCareFlag = true;
            this.otherFlag = false;
            this.hCareFlag1 = true;
            this.otherFlag1 = false;
          } else if (
            this.busDetailForm.value.industryClassification ==
            "ALTERNATIVE_MEDICE"
          ) {
            this.industryClass = "Alternative Medicine";
            this.hCareFlag = false;
            this.otherFlag = false;
            this.hCareFlag1 = false;
            this.otherFlag1 = false;
          } else if (
            this.busDetailForm.value.industryClassification == "BIOTECHNOLOGY"
          ) {
            this.industryClass = "Biotechnology";
            this.hCareFlag = false;
            this.otherFlag = false;
            this.hCareFlag1 = false;
            this.otherFlag1 = false;
          } else if (
            this.busDetailForm.value.industryClassification ==
            "DIAGNOSTIC_SERVICES"
          ) {
            this.industryClass = "Diagnostic Services";
            this.hCareFlag = false;
            this.otherFlag = false;
            this.hCareFlag1 = false;
            this.otherFlag1 = false;
          } else if (
            this.busDetailForm.value.industryClassification ==
            "EDUCATIONAL_INSTITUTION_(MEDICAL,_NURSING,_HEALTHCARE)"
          ) {
            this.industryClass =
              "Educational Institution (Medical, Nursing, Healthcare)";
            this.hCareFlag = false;
            this.otherFlag = false;
            this.hCareFlag1 = false;
            this.otherFlag1 = false;
          } else if (
            this.busDetailForm.value.industryClassification ==
            "HEALTH_INSURANCE"
          ) {
            this.industryClass = "Health Insurance";
            this.hCareFlag = false;
            this.otherFlag = false;
            this.hCareFlag1 = false;
            this.otherFlag1 = false;
          } else if (
            this.busDetailForm.value.industryClassification ==
            "MEDICAL_DEVICE_EQUIPMENTS"
          ) {
            this.industryClass = "Medical Device/ Equipments";
            this.hCareFlag = false;
            this.otherFlag = false;
            this.hCareFlag1 = false;
            this.otherFlag1 = false;
          } else if (
            this.busDetailForm.value.industryClassification ==
            "PROFIT_ORGANIZATION_(HEALTH/WELLNESS/MEDICAL)"
          ) {
            this.industryClass =
              "Non-Profit Organization (Health/Wellness/Medical)";
            this.hCareFlag = false;
            this.otherFlag = false;
            this.hCareFlag1 = false;
            this.otherFlag1 = false;
          } else if (
            this.busDetailForm.value.industryClassification == "OTHER"
          ) {
            this.industryClass = "Other";
            this.hCareFlag = false;
            this.otherFlag = true;
            this.hCareFlag1 = false;
            this.otherFlag1 = true;
          } else if (
            this.busDetailForm.value.industryClassification == "PHARMACEUTICALS"
          ) {
            this.industryClass = "Pharmaceuticals";
            this.hCareFlag = false;
            this.otherFlag = false;
            this.hCareFlag1 = false;
            this.otherFlag1 = false;
          } else if (
            this.busDetailForm.value.industryClassification == "RESEARCH"
          ) {
            this.industryClass = "Research";
            this.hCareFlag = false;
            this.otherFlag = false;
            this.hCareFlag1 = false;
            this.otherFlag1 = false;
          } else if (
            this.busDetailForm.value.industryClassification ==
            "WELLNESS_FITNESS"
          ) {
            this.industryClass = "Wellness & Fitness";
            this.hCareFlag = false;
            this.otherFlag = false;
            this.hCareFlag1 = false;
            this.otherFlag1 = false;
          }

          this.tagLine = this.busDetailForm.value.tagLine;
          this.businessName = this.busDetailForm.value.businessName;
          this.industryClass = this.busDetailForm.value.industryClassification;
          this.facilityPracticeType =
            this.busDetailForm.value.facilityPracticeType;
          this.companyType = this.busDetailForm.value.companyType;
          this.yearStarted = this.busDetailForm.value.yearStarted;
          this.companysize = this.busDetailForm.value.companySize;
          this.tag = this.busDetailForm.value.tags;
          this.modalRef.hide();
          let isNameChanged: boolean = false;
          isNameChanged = this.previousBusinessName != this.infoData.businessName ? true : false
          this.reloadpage(isNameChanged, null);
        }
      }, err => {
        this.util.stopLoader();
      });
    }
  }

  reloadpage(businessNameEdited?: boolean, businessLocationEdited?: boolean) {
    this.route.queryParams.subscribe((patchurldata) => {
      let data: any = {};
      data.businessId = patchurldata.businessId;
      data.businessName = patchurldata.businessName;
      data.menu = "about";
      data.businessNameEdited = businessNameEdited;
      data.businessLocationEdited = businessLocationEdited;
      this.router
        .navigateByUrl("/clear", { skipLocationChange: true })
        .then(() => {
          this.router.navigate(["business"], { queryParams: data });
        });
    });
  }

  clientTypeList: any = []

  busDetailEdit(template: TemplateRef<any>) {


    this.getIndustryClass();
    this.generateYears();
    const { businessName, tagLine, yearStarted, companySize, tags, organizationType,
      industryClassification, companyType, ...rest } = this.infoData;


    //prasa
    this.busDetailForm.patchValue({
      businessName: businessName,
      tagLine: tagLine,
      companyType: companyType,
      industryClassification: industryClassification,
      yearStarted: yearStarted,
      companySize: companySize,
      tags: tags,
      organizationType: organizationType,
    });
    this.tagSelectedItems = [];
    if (
      this.infoData.tags != undefined &&
      this.infoData.tags != null &&
      this.infoData.tags != ""
    ) {
      this.infoData.tags.forEach((ele) => {
        this.tagSelectedItems.push(ele);
      });
    }

    this.busDetailForm
      .get("industryClassification")
      .setValidators([Validators.required]);
    this.busDetailForm.get("industryClassification").updateValueAndValidity();
    this.busDetailForm
      .get("businessName")
      .setValidators([
        Validators.required,
        Validators.pattern(/^[^\s]+(\s+[^\s]+)*$/),
      ]);

    this.busDetailForm.get("businessName").updateValueAndValidity();
    this.isSuperAdmin = localStorage.getItem('isSuperAdmin');
    this.isSuperAdmin == 'true' ? this.busDetailForm.get("businessName").enable() : this.busDetailForm.get("businessName").disable();
    this.busDetailForm
      .get("tagLine")
      .setValidators([Validators.pattern(this.TAG_LINE.pattern), CustomValidator.max(this.TAG_LINE.max)]);
    this.busDetailForm.get("tagLine").updateValueAndValidity();
    if (this.otherFlag == true) {
      this.busDetailForm
        .get("others")
        .setValidators([
          Validators.required,
          Validators.pattern(/^[^\s]+(\s+[^\s]+)*$/),
        ]);
      this.busDetailForm.get("others").updateValueAndValidity();
    } else {
      this.busDetailForm.get("others").clearValidators();
      this.busDetailForm.get("others").updateValueAndValidity();
    }

    if (this.hCareFlag == true) {
      this.busDetailForm
        .get("facilityPracticeType")
        .setValidators([Validators.required]);
      this.busDetailForm.get("facilityPracticeType").updateValueAndValidity();
    } else {
      this.busDetailForm.get("facilityPracticeType").clearValidators();
      this.busDetailForm.get("facilityPracticeType").updateValueAndValidity();
    }

    if (
      this.infoData.businessLogo != null &&
      this.infoData.businessLogo != undefined &&
      this.infoData.businessLogo != ""
    ) {
      this.photoId = this.infoData.businessLogo;
      // this.imageLoaded()
      this.img = {
        //  src :this.photoUrl + this.photoId
        src: AppSettings.ServerUrl + "download/" + this.infoData.businessLogo,
      };
    } else {
      this.photoId = null;
    }


    this.busDetailForm.get("organizationType").disable();
    if (this.infoData.organizationType && this.infoData.organizationType != null) {
      if (this.infoData.organizationType == 'Client') {
        var data: any = { "domain": "ENGAGEMENT_TYPE,CLIENT_TYPE" }
        this.api.create('listvalue/findbyList', data).subscribe(res => {
          if (res.code == '00000') {
            res.data.CLIENT_TYPE.listItems.forEach(ele => {
              // if (ele.item == 'Direct Client') {
              //   ele.item = "Client";
              // }
              this.clientTypeList.push(ele.item);
            })
          }
        })
        this.busDetailForm.patchValue({
          organizationType: this.infoData.organizationType
        })
      } else {
        var data: any = { "domain": "ENGAGEMENT_TYPE,CLIENT_TYPE" }
        this.api.create('listvalue/findbyList', data).subscribe(res => {
          if (res.code == '00000') {
            res.data.CLIENT_TYPE.listItems.forEach(ele => {
              this.clientTypeList.push(ele.item);
            })
          }
        })
        this.busDetailForm.patchValue({
          organizationType: this.infoData.organizationType
        })
      }
      // this.busDetailForm.get("organizationType").disable();
    } else {
      var data: any = { "domain": "ENGAGEMENT_TYPE,CLIENT_TYPE" }
      this.api.create('listvalue/findbyList', data).subscribe(res => {
        if (res.code == '00000') {
          res.data.CLIENT_TYPE.listItems.forEach(ele => {
            this.clientTypeList.push(ele.item);
          })
        }
      })
      // this.busDetailForm.get("organizationType").enable();
    }


    this.modalRef = this.modalService.show(template, this.backdropConfig);
  }

  // closeDetailModal(){
  //   this.modalRef.hide()

  //   this.img = {}
  //   this.img.src = AppSettings.ServerUrl + 'download/' + this.infoData.businessLogo
  // }

  aboutEdit() {
    // this.modalRef = this.modalService.show(template, this.backdropConfig);

    // this.infoData.aboutCompany

    this.lgModal.show()

    if (
      this.infoData.aboutCompany == "Please write something of your company"
    ) {
      this.infoData.aboutCompany = "";
    }

    this.aboutCompanyForm.patchValue({
      aboutCompany: this.infoData.aboutCompany,
    });
  }

  // locationEdit(template: TemplateRef<any>, index, value) {
  //   this.ldSubmit = false
  //   this.modalRef = this.modalService.show(template, this.backdropConfig);
  //   this.companyLocationDetails.controls = []
  //   this.infoData.companyLocationDetails.forEach(element => {
  //      this.companyLocationDetails.push(this.fb.group(element))
  //   })
  //   this.getStates()
  //  this.mandateLocation(index)
  // }

  locationIndex: any = null;
  locationEdit(
    template: TemplateRef<any>,
    index,
    value,
    headquarters: boolean
  ) {
    this.ldSubmit = false;
    if (value == "edit") {
      this.locationIndex = index;
      // this.experEditFlag = true
      this.locationEditFlag = true;
      this.locationAddFlag = false;
      // this.experAddFlag = false
      this.getStates();
      // this.workSaveFlag = false
      this.modalRef = this.modalService.show(template, this.backdropConfig);
      this.locationForm.reset();
      // this.busDetailForm.patchValue(this.infoData);
      // //// console.log("busDetailForm")
      // //// console.log(this.busDetailForm)
      this.companyLocationDetails = this.locationForm.get(
        "companyLocationDetails"
      ) as UntypedFormArray;
      this.companyLocationDetails.controls[0].patchValue(
        this.infoData.companyLocationDetails[index]
      );
      if (this.infoData.companyLocationDetails[index].locationId == this.commonVariables.locationId && this.isSuperAdmin == 'false') {
        this.companyLocationDetails.controls[0].get("primary").disable()
        this.companyLocationDetails.controls[0].get("address1").disable()
        this.companyLocationDetails.controls[0].get("city").disable()
        this.companyLocationDetails.controls[0].get("state").disable()
        this.companyLocationDetails.controls[0].get("zipCode").disable()
        this.companyLocationDetails.controls[0].get("country").disable()
      } else {
        this.companyLocationDetails.controls[0].get("primary").enable()
        this.companyLocationDetails.controls[0].get("address1").enable()
        this.companyLocationDetails.controls[0].get("city").enable()
        this.companyLocationDetails.controls[0].get("state").enable()
        this.companyLocationDetails.controls[0].get("zipCode").enable()
        this.companyLocationDetails.controls[0].get("country").enable()
      }
      this.companyLocationDetails.controls.forEach((ele) => {
        ele.get("website").markAsTouched();
        ele.get("website").updateValueAndValidity();
        ele.get("website").disable();
        ele.get("businessEmail").markAsTouched();
        ele.get("businessEmail").updateValueAndValidity();
      });
      this.checkHeadquarters();
    } else if (value == "add") {

      this.locationEditFlag = false;
      this.locationAddFlag = true;
      this.getStates();
      // this.workSaveFlag = false
      this.checkHeadquarters();
      this.companyLocationDetails.controls = [];
      this.addLocation();

      this.companyLocationDetails.controls[0].patchValue({ businessEmail: this.infoData.companyLocationDetails[0].businessEmail });
      this.companyLocationDetails.controls[0].patchValue({ website: this.infoData.companyLocationDetails[0].website });
      this.companyLocationDetails.at(0).get('website').disable()
      this.modalRef = this.modalService.show(template, this.backdropConfig);
      // this.mandateLocation()
    }
  }

  checkHeadquarters() {
    var a = this.infoData.companyLocationDetails.findIndex(
      (x) => x.headquarters == true
    );
    if (a != "-1") {
      // this.currentIndex = a
      this.searchData.setHeadQuarters(a);
      this.currentHeadQuarters = true;
      this.hide = true;
    } else {
      // this.currentIndex= null
      this.searchData.setHeadQuarters(null);
      this.currentHeadQuarters = false;
      this.hide = false;
    }
  }

  physicianEdit(template: TemplateRef<any>, event) {
    this.getdatas(event);
    this.modalRef = this.modalService.show(template, this.backdropConfig);
    if (
      this.infoData.facilityPracticeType != undefined &&
      this.infoData.facilityPracticeType != null &&
      this.infoData.facilityPracticeType != ""
    ) {
      if (this.infoData.facilityPracticeType == "Skilled Nursing Facility") {
        //  this.util.startLoader()
        this.api
          .query("care/list/values/SKILLED_NURSING_FACILITY_SERVICE_TYPE")
          .subscribe((res) => {
            this.serviceTypeList = [];
            if (res.listItems != null) {
              res.listItems.forEach((ele) => {
                this.serviceTypeList.push(ele.item);
              });
            }
          }, err => {
            this.util.stopLoader();
          });

        this.api
          .query("care/list/values/SKILLED_NURSING_FACILITY_ACCREDITION")
          .subscribe((res) => {
            // this.util.stopLoader()
            this.accreditionValue = [];
            if (res.listItems != null) {
              res.listItems.forEach((ele) => {
                this.accreditionValue.push(ele.item);
              });
            }
          }, err => {
            this.util.stopLoader();
          });
      } else if (this.infoData.facilityPracticeType == "Home Care") {
        //this.util.startLoader()
        this.api
          .query("care/list/values/HOME_CARE_SERVICE_TYPE")
          .subscribe((res) => {
            //  this.util.stopLoader()
            this.serviceTypeList = [];
            if (res.listItems != null) {
              res.listItems.forEach((ele) => {
                this.serviceTypeList.push(ele.item);
              });
            }
          }, err => {
            this.util.stopLoader();
          });
      } else if (
        this.infoData.facilityPracticeType == "Home Heathcare Agency"
      ) {
        // this.util.startLoader()
        this.api.query("care/list/values/HHA_SERVICE_TYPE").subscribe((res) => {
          this.serviceTypeList = [];
          if (res.listItems != null) {
            res.listItems.forEach((ele) => {
              this.serviceTypeList.push(ele.item);
            });
          }
        }, err => {
          this.util.stopLoader();
        });

        this.api.query("care/list/values/HHA_ACCREDITION").subscribe((res) => {
          // this.util.stopLoader()
          this.accreditionValue = [];
          if (res.listItems != null) {
            res.listItems.forEach((ele) => {
              this.accreditionValue.push(ele.item);
            });
          }
        }, err => {
          this.util.stopLoader();
        });
      } else if (this.infoData.facilityPracticeType == "Hospice") {
        //  this.util.startLoader()
        this.api
          .query("care/list/values/HOSPICE_SERVICE_TYPE")
          .subscribe((res) => {
            this.serviceTypeList = [];
            if (res.listItems != null) {
              res.listItems.forEach((ele) => {
                this.serviceTypeList.push(ele.item);
              });
            }
          }, err => {
            this.util.stopLoader();
          });

        this.api
          .query("care/list/values/HOSPICE_ACCREDITION")
          .subscribe((res) => {
            //   this.util.stopLoader()
            this.accreditionValue = [];
            if (res.listItems != null) {
              res.listItems.forEach((ele) => {
                this.accreditionValue.push(ele.item);
              });
            }
          }, err => {
            this.util.stopLoader();
          });
      } else if (this.infoData.facilityPracticeType == "Pharmacy") {
        // this.util.startLoader()
        this.api
          .query("care/list/values/PHARMACY_SERVICE_TYPE")
          .subscribe((res) => {
            this.serviceTypeList = [];
            if (res.listItems != null) {
              res.listItems.forEach((ele) => {
                this.serviceTypeList.push(ele.item);
              });
            }
          }, err => {
            this.util.stopLoader();
          });

        this.api
          .query("care/list/values/PHARMACY_ACCREDITION")
          .subscribe((res) => {
            //  this.util.stopLoader()
            this.accreditionValue = [];
            if (res.listItems != null) {
              res.listItems.forEach((ele) => {
                this.accreditionValue.push(ele.item);
              });
            }
          }, err => {
            this.util.stopLoader();
          });
      } else if (this.infoData.facilityPracticeType == "DME") {
        //  this.util.startLoader()
        this.api.query("care/list/values/DME_SERVICE_TYPE").subscribe((res) => {
          this.serviceTypeList = [];
          if (res.listItems != null) {
            res.listItems.forEach((ele) => {
              this.serviceTypeList.push(ele.item);
            });
          }
        }, err => {
          this.util.stopLoader();
        });
        this.api.query("care/list/values/DME_ACCREDITION").subscribe((res) => {
          //   this.util.stopLoader()
          this.accreditionValue = [];
          if (res.listItems != null) {
            res.listItems.forEach((ele) => {
              this.accreditionValue.push(ele.item);
            });
          }
        }, err => {
          this.util.stopLoader();
        });
      } else {
        // this.util.stopLoader()
        this.serviceTypeList = [];
        this.accreditionValue = [];
      }
    }

    this.serviceForm.patchValue(this.infoData.serviceOptions);
    // //// console.log(this.infoData.serviceOptions);
    this.serviceSelectedItems = [];
    this.insuranceSelectedItems = [];
    if (
      this.infoData.serviceOptions.serviceType != undefined &&
      this.infoData.serviceOptions.serviceType != null &&
      this.infoData.serviceOptions.serviceType != ""
    ) {
      this.infoData.serviceOptions.serviceType.forEach((ele) => {
        this.serviceSelectedItems.push(ele);
      });
    }

    if (
      this.infoData.serviceOptions.insuranceAccepted != undefined &&
      this.infoData.serviceOptions.insuranceAccepted != null &&
      this.infoData.serviceOptions.insuranceAccepted != ""
    ) {
      this.infoData.serviceOptions.insuranceAccepted.forEach((ele) => {
        this.insuranceSelectedItems.push(ele);
      });
    }
  }

  hoursEdit(template: TemplateRef<any>) {
    if (this.infoData.workingHours.monWorking == true) {
      this.worktime = true;
      this.tovalue = this.infoData.workingHours.monToTime;
      this.fromvalue = this.infoData.workingHours.monFromTime;
    } else {
      this.worktime = false;
    }
    this.modalRef = this.modalService.show(template, this.backdropConfig);

    this.hoursForm.patchValue({
      monWorking: this.infoData.workingHours.monWorking,
      applyAll: this.infoData.workingHours.applyAll,
      tueWorking: this.infoData.workingHours.tueWorking,
      wedWorking: this.infoData.workingHours.wedWorking,
      thrWorking: this.infoData.workingHours.thrWorking,
      friWorking: this.infoData.workingHours.friWorking,
      satWorking: this.infoData.workingHours.satWorking,
      sunWorking: this.infoData.workingHours.sunWorking,
      monFromTime: this.infoData.workingHours.monFromTime,
      monToTime: this.infoData.workingHours.monToTime,

      tueFromTime: this.infoData.workingHours.tueFromTime,
      tueToTime: this.infoData.workingHours.tueToTime,

      wedFromTime: this.infoData.workingHours.wedFromTime,
      wedToTime: this.infoData.workingHours.wedToTime,

      thrFromTime: this.infoData.workingHours.thrFromTime,
      thrToTime: this.infoData.workingHours.thrToTime,

      friFromTime: this.infoData.workingHours.friFromTime,
      friToTime: this.infoData.workingHours.friToTime,

      satFromTime: this.infoData.workingHours.satFromTime,
      satToTime: this.infoData.workingHours.satToTime,

      sunFromTime: this.infoData.workingHours.sunFromTime,
      sunToTime: this.infoData.workingHours.sunToTime,
    });

    if (this.infoData.workingHours.monWorking == true) {
      this.hoursValidate("monFromTime");
      this.hoursValidate("monToTime");
    } else if (this.infoData.workingHours.monWorking == false) {
      // this.hoursClearValidation('monFromTIme')
      // this.hoursClearValidation('monToTIme')
    }

    if (this.infoData.workingHours.tueWorking == true) {
      this.tuetrue = true;
      this.hoursValidate("tueFromTime");
      this.hoursValidate("tueToTime");
    } else if (this.infoData.workingHours.tueWorking == false) {
      // this.hoursClearValidation('tueFromTIme')
      this.tuetrue = false;
      // this.hoursClearValidation('tueToTIme')
    }

    if (this.infoData.workingHours.wedWorking == true) {
      this.hoursValidate("wedFromTime");
      this.hoursValidate("wedToTime");
    } else if (this.infoData.workingHours.wedWorking == false) {
      // this.hoursClearValidation('wedFromTIme')
      // this.hoursClearValidation('wedToTIme')
    }

    if (this.infoData.workingHours.thrWorking == true) {
      this.hoursValidate("thrFromTime");
      this.hoursValidate("thrToTime");
    } else if (this.infoData.workingHours.thrWorking == false) {
      // this.hoursClearValidation('thrFromTIme')
      // this.hoursClearValidation('thrToTIme')
    }

    if (this.infoData.workingHours.friWorking == true) {
      this.hoursValidate("friFromTime");
      this.hoursValidate("friToTime");
    } else if (this.infoData.workingHours.friWorking == false) {
      // this.hoursClearValidation('friFromTIme')
      // this.hoursClearValidation('friToTIme')
    }

    if (this.infoData.workingHours.satWorking == true) {
      this.hoursValidate("satFromTime");
      this.hoursValidate("satToTime");
    } else if (this.infoData.workingHours.satWorking == false) {
      // this.hoursClearValidation('satFromTIme')
      // this.hoursClearValidation('satToTIme')
    }

    if (this.infoData.workingHours.sunWorking == true) {
      this.hoursValidate("sunFromTime");
      this.hoursValidate("sunToTime");
    } else if (this.infoData.workingHours.sunWorking == false) {
      // this.hoursClearValidation('sunFromTIme')
      // this.hoursClearValidation('sunToTIme')
    }
  }

  userSocialPresenceEdit(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, this.backdropConfig);
    //  u = this.infoData.userSocialPresence
    this.userSocialPresenceForm.patchValue(this.infoData.userSocialPresence);
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
    ////// console.log("infoData-- "+JSON.stringify(this.infoData));
    // //// console.log("infoData-- "+JSON.stringify(this.userPrivacyForm.value));
    // //// console.log(key+"  --key-- "+value);
    if (key == "workExperience") {
      this.infoData["userPrivacy"]["workExperience"] = value;
    } else if (key == "educationDetail") {
      this.infoData["userPrivacy"]["educationDetail"] = value;
    } else if (key == "certification") {
      this.infoData["userPrivacy"]["certification"] = value;
    } else if (key == "userSocialPresence") {
      this.infoData["userPrivacy"]["userSocialPresence"] = value;
    } else if (key == "communities") {
      this.infoData["userPrivacy"]["communities"] = value;
    } else if (key == "reviews") {
      this.infoData["userPrivacy"]["reviews"] = value;
    }

    // //// console.log("infoData-- "+JSON.stringify(this.infoData));
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


