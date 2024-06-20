import { SocketService } from 'src/app/services/socket.service';
import { SocketServiceStream } from './../../services/SocketServiceStream';
// import { UserDetailsComponent } from 'src/app/components/user-details/user-details.component';
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import {
  Component,
  OnInit,
  TemplateRef,
  ElementRef,
  ViewChild,
  HostListener,
} from "@angular/core";
import {
  UntypedFormGroup,
  UntypedFormBuilder,
  Validators,
  UntypedFormArray,
  FormControl,
  AbstractControl,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "src/app/services/api.service";
import { AuthServiceService } from "src/app/services/auth-service.service";
import { CalendarCellViewModel } from "ngx-bootstrap/datepicker/models";
import { ImageCroppedEvent } from "ngx-image-cropper";
import { CropperOption } from "ngx-cropper";
import { PopupService } from "@ng-bootstrap/ng-bootstrap/util/popup";
import { NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";
import { AppSettings } from "../../services/AppSettings";
import { LangdingPageNavBarComponent } from "../../components/langding-page-nav-bar/langding-page-nav-bar.component";
import { CacheService } from "src/app/services/cache.service";
import { CookieService } from "ngx-cookie-service";
// import { DOMSerializer, DOMParser } from "prosemirror-model";
// import { schema } from "ngx-editor";
import { CommonValues } from "src/app/services/commonValues";
import { CustomValidator } from "../Helper/custom-validator";
import { UtilService } from "src/app/services/util.service";
import { range, Subscription } from "rxjs";
import Swal from "sweetalert2";
import { TypeaheadOrder } from "ngx-bootstrap/typeahead/typeahead-order.class";
import { PlatformLocation } from "@angular/common";
import { SearchData } from "src/app/services/searchData";
import { FormValidation } from 'src/app/services/FormValidation';
@Component({
  selector: "app-user-details",
  templateUrl: "./user-details.component.html",
  styleUrls: ["./user-details.component.scss"],
})
export class UserDetailsComponent extends FormValidation implements OnInit {
  // [x: string]: any;
  //config for ngxSummerNote
  @ViewChild("myFileInput") myFileInput;
  currentYear: any = new Date().getFullYear();
  public FORMERROR = super.Form;
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
        const limiteCaracteres = 1000;
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
      onKeyup(e) {
        const t = e.currentTarget.innerText;
        // console.log(t.length);
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

  userId: any;
  modalRef: BsModalRef;
  modalcloseRef: BsModalRef;
  valueWidth = false;
  ngxSelconfig: any;
  orgConfig: any;
  userDetailForm: UntypedFormGroup;
  workExperience: UntypedFormArray;
  educationDetail: UntypedFormArray;
  certification: UntypedFormArray;
  socialPresence: UntypedFormArray;
  physicianData: UntypedFormArray;
  weedit = false;
  physicianFlag = false;
  studentFlag = false;
  adminFlag = false;
  isCollapsed = false;
  validateflagforWork = false;
  disablePromptFlag: boolean = false
  infoData: any = {};
  datasforsocial: any = {};
  phyData: any = {};
  fileToUpload: File;
  specialityList = [];
  changedata = [];
  insuranceData = [];
  sample = [];
  specialityDropdown = [];
  specialitySelectedItems = [];
  specialityDropdownSettings = {};
  stateListCA: any;
  stateListIN: any;
  stateListAU: any;
  countryList: any = [];
  // insuranceList = [];
  insuranceDropdown = [];
  insuranceSelectedItems = [];
  insuranceDropdownSettings = {};
  validateMonth: boolean;
  validateEduMonth: boolean;
  validateCertMonth: boolean;
  hide = false;
  hide1 = false;
  photoId: any;
  photoElement: any;
  img;
  businessProfileId;

  // public photoUrl = 'http://curOrg.251:8090/careonline-social/download/';
  // conditionList = [];
  conditionSelectedItems = [];

  // multiselect
  selectedPeople = [];
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

  // phyTitleList: any = [];
  studentTitles: any = [];
  // busiTitleList: any = [];
  orgList: any = [];
  instList: any = [];
  certificationList: any = []
  jsonData: any = {
    userId: "",
    profileId: null,
    source: null,
    npiNo: "",
    nonApplicable: false,
    username: "",
    userType: "",
    firstName: "",
    lastName: "",
    email: "",
    secondaryEmail: "",
    phoneNo: "",
    password: "",
    city: "",
    state: "",
    country: "",
    zipcode: "",
    aboutMe: "",
    title: "",
    organisation: "",
    photo: null,
    workExperience: [
      {
        currentOrganization: false,
        organisationName: "",
        organisationId: "",
        title: "",
        startMonth: "",
        // street: '',
        startYear: "",
        endMonth: "",
        endYear: "",
        city: "",
        state: "",
        country: "",
        zipcode: "",
      },
    ],
    educationDetail: [
      {
        schoolName: "",
        institutionId: "",
        degree: "",
        speciality: "",
        currentlyPursued: false,
        startMonth: "",
        startYear: "",
        endMonth: "",
        endYear: "",
        street: "",
        city: "",
        state: "",
        country: "",
        zipcode: "",
      },
    ],
    certification: [
      {
        certificationName: "",
        certificateOrganization: "",
        certificateLicenseNo: "",
        startMonth: "",
        startYear: "",
        endMonth: "",
        endYear: "",
      },
    ],
    socialPresence: {
      twitter: "",
      facebook: "",
      linkedin: "",
      blogURL: "",
      alternamePageLink: "",
    },
    physicianData: {
      privatePay: "No",
      conditions: "",
      insurance: "",
      patientAcceptance: "No",
    },
    userPrivacy: {
      workExperience: "",
      educationDetail: "",
      certification: "",
      socialInfluence: "",
      communities: "",
      reviews: "",
    },
  };

  currentIndex: any = null;
  // curIndex: any = null;

  submit: boolean = false;
  clientTypeList: any = []
  valid: boolean = false;
  aboutMe: any;
  physicianUser = false;
  imageChangedEvent: any = "";
  croppedImage: any = "";
  fileUploadName: any = "";
  photoWindow = true;
  public cropperConfig: CropperOption;
  futMnthDisable: boolean;
  yearData;
  yearIndex;
  userData: any;
  disfield: boolean = false;
  source: any;
  profileId: any;
  businessDirectoryFlag: boolean = false;
  commonArbitraryData: any = {};
  receivedArbitraryData: any;
  eventEmitter: Subscription;
  charCountEmitter: Subscription;
  remainingCount: any;
  data9: any = {}
  commonVariables: Subscription;
  constructor(
    private fb: UntypedFormBuilder,
    private route: ActivatedRoute,
    private api: ApiService,
    private auth: AuthServiceService,
    private router: Router,
    private modalService: BsModalService,
    private cache: CacheService,
    private cookieService: CookieService,
    private commonValues: CommonValues,
    private util: UtilService,
    // private landingPageNaveBar: LangdingPageNavBarComponent,
    private el: ElementRef,
    private cookieservice: CookieService,
    private searchData: SearchData,
    private _socket: SocketService,
    private _socket_stream: SocketServiceStream,
  ) {
    // platform.onPopState(() => this.stayOnPage());
    super();
    this.cropperConfig = {
      url: null, // image server url
      maxsize: 512000, // image max size, default 500k = 512000bit
      title: "Apply your image size and position", // edit modal title, this is default
      uploadBtnName: "Upload Image", // default Upload Image
      uploadBtnClass: null, // default bootstrap styles, btn btn-primary
      cancelBtnName: "Cancel", // default Cancel
      cancelBtnClass: null, // default bootstrap styles, btn btn-default
      applyBtnName: "Apply", // default Apply
      applyBtnClass: null, // default bootstrap styles, btn btn-primary
      errorMsgs: {
        // These error msgs are to be displayed to the user (not the ones sent in returnData)
        4000: null, // default `Max size allowed is ${maxsize}kb, current size is ${currentSize}kb`
        4001: null, // default 'When sent to the server, something went wrong'
      },
      fdName: "file", // default 'file', this is  Content-Disposition: form-data; name="file"; filename="fire.jpg"
      aspectRatio: 1 / 1, // default 1 / 1, for example: 16 / 9, 4 / 3 ...
      viewMode: 0, // default 0, value can be 0, 1, 2, 3
    };

    this.eventEmitter = this.searchData
      .getCommonVariables()
      .subscribe((res) => {
        this.receivedArbitraryData = res;
      });

    this.commonVariables = this.commonValues.getUserData().subscribe(res => {
      this.data9 = res
    })

    this.charCountEmitter = this.commonValues.getCharCount().subscribe(res => {
      this.remainingCount = res.value
    })
  }


  ngOnInit() {
    this.generateYears();
    // this.getLists();
    this.getTitleList()

    this.conditionSelectedItems = [];
    var emailRegEx = "^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$";
    this.userDetailForm = this.fb.group(
      {
        userType: [null, Validators.compose([Validators.required])],
        npiNo: [null],
        pitch: [null],
        firstName: [""],
        nonApplicable: [false],
        lastName: [""],
        photo: [""],
        aboutMe: ["", [CustomValidator.max(this.ABOUT_ME.max), CustomValidator.checkWhiteSpace()]], //, Validators.compose([Validators.maxLength(1000)]) , Validators.pattern(/[^\s]([ ]{2,})[^\s]/)
        phoneNo: [
          "",
          Validators.compose([
            CustomValidator.minmaxLetters(this.PHONE.min, this.PHONE.max), Validators.pattern(this.PHONE.pattern)
          ]),
        ],
        email: [null],
        zipcode: [
          "",
          Validators.compose([
            Validators.required, CustomValidator.minmaxLetters(this.ZIPCODE.min, this.ZIPCODE.max)
          ]),
        ],
        secondaryEmail: [null, [Validators.email]], // Validators.pattern(emailRegEx)
        city: ["", Validators.compose([Validators.required, CustomValidator.max(this.CITY.max)])],
        state: ["", Validators.compose([Validators.required, CustomValidator.max(this.CITY.max)])],
        country: ["", Validators.compose([Validators.required])],
        workExperience: this.fb.array([]),
        educationDetail: this.fb.array([]),
        certification: this.fb.array([]),
        socialPresence: this.fb.array([]),
        physicianData: this.fb.array([]),
        workExperiencePrivacy: true,
        educationDetailPrivacy: false,
        certificationPrivacy: true,
        socialInfluencePrivacy: true,
      },
      {
        validator: CustomValidator.mustMismatch("email", "secondaryEmail"),
        validators: CustomValidator.checkFormCompletion("pitch", "userType", "npiNo", "firstName", "lastName", "photo", "aboutMe", "phoneNo", "email",
          "secondaryEmail", "city", "state", "country", "workExperience", "educationDetail", "zipcode", this.commonValues)
        // sdf: CustomValidator.checkCharCount("aboutMe", this.commonValues)
      }
    );

    // document.getElementById("userType1").focus()


    this.clientTypeList = ['Direct Hire', 'Direct Client', 'Systems Integrator', 'Prime Vendor', 'Vendor', 'Supplier', 'Staffing Agency']

    this.ngxSelconfig = {
      search: true,
      height: "auto",
      placeholder: "Title",
      searchPlaceholder: "Search Title",
      searchOnKey: "name",
      clearOnSelection: true,
    };

    this.orgConfig = {
      search: true,
      height: "auto",
      placeholder: "Organization",
      searchPlaceholder: "Search Organization",
      searchOnKey: "name",
      clearOnSelection: true,
    };

    // this.insuranceList = [
    //   "Life Insurance",
    //   "Vehicle Insurance",
    //   "Propreitary Insurance",
    //   "Home Insurance",
    // ];
    this.insuranceDropdown = [];
    this.insuranceSelectedItems = [];
    // this.insuranceList.forEach((res, i) => {
    //   this.insuranceDropdown.push({
    //     id: i + 1,
    //     itemName: res,
    //   });
    // });

    this.insuranceDropdownSettings = {
      singleSelection: false,
      text: "Select Insurance Type",
      selectAllText: "Select All",
      unSelectAllText: "UnSelect All",
      enableSearchFilter: true,
      classes: "custom-multiselect",
    };

    this.route.queryParams.subscribe((prevData) => {
      this.userId = prevData.userId;
      localStorage.setItem("userId", this.userId);
      this.cookieService.set("userId", this.userId);
      this.cache.setValue("userId", this.userId);
    });

    this.util.startLoader();
    this.api.query("user/" + this.userId).subscribe((res) => {
      this.util.stopLoader();
      this.userDetailForm.patchValue({
        firstName: res.firstName,
        lastName: res.lastName,
        email: res.email,
      });
      if (res.npiNo != null && res.npiNo != "" && res.npiNo != undefined) {
        this.userDetailForm.controls["npiNo"].disable();
        this.userDetailForm.patchValue({
          npiNo: res.npiNo,
        });
      } else {
        this.userDetailForm.controls["npiNo"].enable();
      }
      if (res.source != null) {
        this.source = res.source;
      }
      if (res.profileId != null) {
        this.profileId = res.profileId;
        // this.getBusinessProfileDetail(this.profileId);
      }
      localStorage.setItem("userName", res.email);
      this.cache.setValue("email", res.email);

      //business directory data
      if (
        res.profileId !== null &&
        res.profileId !== undefined &&
        res.profileId !== ""
      ) {
        this.businessDirectoryFlag = true;
        this.businessProfileId = res.profileId;
        this.util.startLoader();
        this.api
          .query("healthcare/hcp/organization/" + res.profileId)
          .subscribe((ele) => {
            this.util.stopLoader();
            if (ele != null) {
              if (ele.code == "00000") {
                if (
                  ele.data.hcporganization != null &&
                  ele.data.hcporganization != undefined
                ) {
                  this.directoryData = ele.data.hcporganization.mailingAddress;
                  this.currentIndex = 0;
                  this.workExperience.controls[0].patchValue({
                    city: this.directoryData.city,
                    country: this.directoryData.countryCode,
                    organisationName: ele.data.hcporganization.organizationName,
                    organisationId: ele.data.hcporganization.organizationId,
                    state: this.directoryData.state,
                    zipcode: this.directoryData.postalCode,
                    currentOrganization: true,
                    badge: true,
                  });

                  // this.temp
                  var details: any = {}
                  details.id = 0;
                  details.organisationId = ele.data.hcporganization.organizationId
                  details.city = this.directoryData.city
                  details.state = this.directoryData.state
                  details.country = this.directoryData.countryCode
                  details.zipCode = this.directoryData.postalCode
                  details.currentOrganization = true
                  details.badge = true

                  this.temp.push(details)

                  if (
                    this.workExperience.controls[0].get("organisationName")
                      .value != null &&
                    this.workExperience.controls[0].get("organisationName")
                      .value != "" &&
                    this.workExperience.controls[0].get("organisationName")
                      .value != undefined
                  ) {
                    this.workExperience.controls[0]
                      .get("organisationName")
                      .disable();

                    this.workExperience.controls[0]
                      .get("currentOrganization")
                      .disable();
                    this.disablePromptFlag = true
                  }

                }
              }
            }
          }, err => {
            this.util.stopLoader();
          });
      }
    }, err => {
      this.util.stopLoader();
    });

    this.addWorkExperience();
    this.addEducation();

    this.addCertification();
    this.addSocialPresence();
    this.addPhysicianData();
    this.getCountry();
    this.getStates();
    this.getOrganization();
    this.getInstitutions();
    this.getPhyTitle();
    // this.getProfTitle();
    this.sdf();
    this.getCertification()
  }





  sdf() {
    this.commonArbitraryData.curIndex = null;
    this.searchData.setCommonVariables(this.commonArbitraryData);
    // this.userDetailForm.get('userType').
    // CustomValidator.checkFormCompletion
    localStorage.setItem('profilePhoto', null)
  }
  ngAfterViewInit(): void {
    window.scrollTo(0, 0);
  }

  directoryData: any;
  // getprofileData() {

  // }

  data: any;
  getBusinessProfileDetail(value) {
    this.util.startLoader();
    this.api.query("healthcare/hcp/organization/" + value).subscribe((res) => {
      this.util.stopLoader();
      if (res != null) {
        if (res.code == "00000") {
          if (
            res.data.hcporganization != null &&
            res.data.hcporganization != undefined
          ) {
            this.data = res.data.hcporganization;
          }
          if (this.data.businessLogo != null) {
            this.img = {
              src: AppSettings.ServerUrl + "download/" + this.data.businessLogo,
            };
          }
        }
      }
    }, err => {
      this.util.stopLoader();
    });
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
  //       if( res.listItems!=null){
  //       res.listItems.forEach((ele) => {
  //         this.conditionList.push(ele.item);
  //       });
  //     }
  //     },err => {
  //       this.util.stopLoader();
  //     });
  // }

  monthChange(index, val) {
    if (val == "exp") {
      var a: any = this.workExperience.value[index].startYear;
      var b: any = this.workExperience.value[index].endYear;
      if (a == b) {
        // (this.workExperience.value[i].startYear==this.workExperience.value[i].endYear)
        // this.validateMonth = true
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

  yearChange(index, event, val, par) {
    var maxYear = new Date().getFullYear();
    var num = new Date().getMonth();
    var maxMonth = num + 1;
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
      this.yearData = event.target.value;
      this.yearIndex = index;
      var stYr = parseInt(this.educationDetail.value[index].startYear);
      var maxYr = new Date().getFullYear();
      if (stYr == maxYr) {
        this.educationDetail.controls[index].patchValue({ startMonth: null });
      }
      this.educationDetail.controls[index].patchValue({
        endYear: this.currentYear,
        endMonth: null,
      });
    } else if (val == "cert") {
      this.yearData = event.target.value;
      this.yearIndex = index;
      var stYr = parseInt(this.certification.value[index].startYear);
      var maxYr = new Date().getFullYear();
      if (stYr == maxYr) {
        this.certification.controls[index].patchValue({ startMonth: null });
      }
      this.certification.controls[index].patchValue({
        endYear: this.currentYear,
        endMonth: null,
      });
    }
    //  this.checkExperienceYear(index,par)
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

  checkYear(y, i, val) {
    ////console.log(this.workExperience.value[i].startYear)
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


  zipCodeValidaiton(x: number): boolean {
    if (String(x).length > 10) {
      return false;
    }
    return true;
  }

  onChangeYear(i, val, par) {
    const maxyr = new Date().getFullYear();
    if (val == "exp") {
      if (
        this.workExperience.value[i].startYear ==
        this.workExperience.value[i].endYear ||
        this.workExperience.value[i].endYear == maxyr
      ) {
        this.workExperience.controls[i].patchValue({ endMonth: null });
      }
      if (
        this.workExperience.value[i].startYear ==
        this.workExperience.value[i].endYear
      ) {
        this.validateMonth = true;
      } else {
        this.validateMonth = false;
      }
    } else if (val == "edu") {
      if (
        this.educationDetail.value[i].startYear ==
        this.educationDetail.value[i].endYear ||
        this.educationDetail.value[i].endYear == maxyr
      ) {
        this.educationDetail.controls[i].patchValue({ endMonth: null });
      }
      if (
        this.educationDetail.value[i].startYear ==
        this.educationDetail.value[i].endYear
      ) {
        this.validateEduMonth = true;
      } else {
        this.validateEduMonth = false;
      }
    } else if (val == "cert") {
      if (
        this.certification.value[i].startYear ==
        this.certification.value[i].endYear ||
        this.certification.value[i].endYear == maxyr
      ) {
        this.certification.controls[i].patchValue({ endMonth: null });
      }

      if (
        this.certification.value[i].startYear ==
        this.certification.value[i].endYear
      ) {
        this.validateCertMonth = true;
      } else {
        this.validateCertMonth = false;
      }
    }
    // this.checkExperienceYear(i,par)
  }

  //removing years list while current organization is unchecked
  curOrgUncheck(value, index) {
    if (value == "work") {
      this.list.forEach((ele) => {
        if (
          this.workExperience.value[index].startYear == null ||
          this.workExperience.value[index].startYear == false
        ) {
          var a = parseInt(this.workExperience.value[index].startYear);
          if (parseInt(ele) >= a + 1) {
            this.list.splice([ele], 1);
          }
        }
      });
    }
  }

  // curIndex: any = null

  notApplicable(event) {
    if (event.target.checked == true) {
      //// console.log(this.isCollapsed)
      this.isCollapsed = !this.isCollapsed;
      // this.physicianArray.reset()
      this.physicianArray.controls.forEach((ele) => {
        // ele.get('medicareCertified').setValue(false)
        ele.get("patientAcceptance").setValue("No");
        ele.get("privatePay").setValue("No");
        ele.get("insurance").setValue(null);
        ele.get("conditions").setValue(null);
      });
    } else if (event.target.checked == false) {
      //// console.log(this.isCollapsed)
      this.isCollapsed = !this.isCollapsed;
      this.physicianArray.controls.forEach((ele) => {
        // ele.get('medicareCertified').setValue(false)
        ele.get("patientAcceptance").setValue("No");
        ele.get("privatePay").setValue("No");
      });
    }
  }

  collapses() {
    // console.log('collapses');
  }

  expands() {
    // console.log('expands');
  }

  collapsed() {
    // console.log('collapsed');
    this.physicianArray.reset();
  }

  expanded() {
    // console.log('expanded');
  }

  onChangeSchool(event, index) {
    // console.log(event.item.institutionId)
    var data = event.value + "/" + event.item.institutionId;
    this.api.query("care/intitutions/" + data).subscribe((res) => {
      res.forEach((ele) => {
        let data: any = {};
        data.institutionId = event.item.institutionId;
        // data.organisationName = ele.institutionName
        data.city = ele.city;
        data.state = ele.state;
        data.country = ele.country;
        data.zipcode = ele.zipCode && ele.zipCode != null ? ele.zipCode : null;
        data.street = ele.street && ele.street != null ? ele.street : null;
        data.address1 = ele.address1;
        data.address2 = ele.address2;
        // data.source = ele.source
        this.getEducationFormGroup(index).patchValue(data);
      });
    }, err => {
      this.util.stopLoader();
    });
  }

  digitKeyOnly(e) {
    var keyCode = e.keyCode == 0 ? e.charCode : e.keyCode;
    if ((keyCode >= 37 && keyCode <= 40) || (keyCode == 8 || keyCode == 9 || keyCode == 13) || (keyCode >= 48 && keyCode <= 57)) {
      return true;
    }
    return false;
  }

  onChangeCertificate(event, index) {
    this.getCertFormGroup(index).patchValue({
      certificationId: event.item.certificationId
    });
  }

  temp: any = [];
  onChngOrg(event, index) {
    // console.log('this is event')
    // console.log(event.item.organizationId)
    var data = event.value + "/" + event.item.organizationId;
    this.util.startLoader();
    this.api.query("care/organization/" + data).subscribe((res) => {
      this.util.stopLoader();
      res.forEach((ele) => {
        let data: any = {};
        data.organisationId = event.item.organizationId;
        // data.organisationName = ele.institutionName
        data.city = ele.city;
        data.state = ele.state;
        data.country = ele.country;
        data.zipcode = ele.zipCode && ele.zipCode !== null ? ele.zipCode : null;
        data.address1 = ele.address1;
        data.address2 = ele.address2;
        // data.street = ele.street && ele.street !== null ? ele.street : null;
        // data.source = ele.source
        this.getWorkFormGroup(index).patchValue(data);

        var details: any = {}
        details.id = index;
        details.organisationId = event.item.organizationId;
        details.city = ele.city;
        details.state = ele.state;
        details.country = ele.country;
        details.zipCode = ele.zipCode;
        details.currentOrganization = this.workExperience.value[index].currentOrganization;
        details.badge = this.workExperience.value[index].badge;

        if (this.temp.length == 0) {
          this.temp.push(details)
        } else if (this.temp.length > 0) {
          for (var i = 0; i < this.temp.length; i++) {
            if (index <= this.temp.length - 1) {
              if (this.temp[i].id === index) {
                this.temp.splice(index, 1, details)
              }
            } else {
              this.temp.push(details)
            }

          }
        }

      });
    }, err => {
      this.util.stopLoader();
    });
  }

  // when no result matched the value, organization id & institution id is set to null
  changeTypeaheadNoResults(index, val) {
    if (val == "work") {
      this.getWorkFormGroup(index).patchValue({
        organisationId: null,
      });
    } else if (val == "edu") {
      this.getEducationFormGroup(index).patchValue({
        institutionId: null,
      });
    } else if (val == "cert") {
      this.getCertFormGroup(index).patchValue({
        certificationId: null,
      });
    }
  }

  sortConfigWork: TypeaheadOrder = {
    direction: "desc",
    field: "organizationName",
  };

  sortConfigEdu: TypeaheadOrder = {
    direction: "desc",
    field: "institutionName",
  };

  sortConfigCert: TypeaheadOrder = {
    direction: "desc",
    field: "institutionName",
  };

  get userControl() {
    return this.userDetailForm.controls;
  }

  get socialPresenceArray() {
    return this.userDetailForm.get("socialPresence") as UntypedFormArray;
  }

  get experienceArray() {
    return this.userDetailForm.get("workExperience") as UntypedFormArray;
  }

  get physicianArray() {
    return this.userDetailForm.get("physicianData") as UntypedFormArray;
  }

  createWorkExperience(): UntypedFormGroup {
    return this.fb.group({
      currentOrganization: [false],
      organisationName: [
        null,
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[^\s]+(\s+[^\s]+)*$/),
        ]),
      ],
      clientType: ['Direct Hire', [Validators.required]],
      badge: [false],
      organisationId: [null],
      title: [null, Validators.compose([Validators.required])],
      // street : [null, Validators.compose([Validators.required])],
      city: [null, [Validators.required, CustomValidator.max(this.CITY.max)]],
      state: [null, [Validators.required, CustomValidator.max(this.STATE.max)]],
      country: [null, [Validators.required]],
      startMonth: [null, Validators.compose([Validators.required])],
      startYear: [this.currentYear, Validators.compose([Validators.required])],
      endMonth: [null, Validators.compose([Validators.required])],
      endYear: [this.currentYear, Validators.compose([Validators.required])],
      zipcode: [
        null,
        Validators.compose([
          Validators.required, CustomValidator.minmaxLetters(this.ZIPCODE.min, this.ZIPCODE.max)
        ]),
      ],
    });
  }

  createSocialPresence(): UntypedFormGroup {
    return this.fb.group({
      twitter: [null],
      linkedin: [null],
      blogURL: [null],
      alternamePageLink: [null],
    });
  }

  createPhysicianData(): UntypedFormGroup {
    return this.fb.group({
      privatePay: ["No"],
      conditions: [null],
      insurance: [null],
      patientAcceptance: ["No"],
    });
  }

  addPhysicianData() {
    this.physicianData = this.userDetailForm.get("physicianData") as UntypedFormArray;
    this.physicianData.push(this.createPhysicianData());
  }

  addSocialPresence() {
    this.socialPresence = this.userDetailForm.get(
      "socialPresence"
    ) as UntypedFormArray;
    this.socialPresence.push(this.createSocialPresence());
  }

  addWorkExperience() {
    this.workExperience = this.userDetailForm.get(
      "workExperience"
    ) as UntypedFormArray;
    this.workExperience.push(this.createWorkExperience());
    // this.checkMandatory()
  }

  addWorkExperience1() {
    this.workExperience = this.userDetailForm.get(
      "workExperience"
    ) as UntypedFormArray;
    this.workExperience.push(this.createWorkExperience());
    this.checkMandatory();
  }

  notApp(event) {
    if (event.target.checked == true) {
      // console.log(this.isCollapsed)
      this.isCollapsed = !this.isCollapsed;
    } else if (event.target.checked == false) {
      // console.log(this.isCollapsed)
      this.isCollapsed = !this.isCollapsed;
    }
  }

  removeWorkExperience(index) {
    if (
      index == "0" &&
      this.workExperience.length == 1 &&
      this.businessDirectoryFlag == false
    ) {
      this.experienceArray.reset();
      this.workExperience.controls[index]
        .get("currentOrganization")
        .setValue(false);
      this.workSubmit = false;
      this.workExperience.controls.forEach((ele) => {
        ele.get("startYear").setValue(this.currentYear);
        ele.get("endYear").setValue(this.currentYear);
      });
      this.checkCurOrg("work");
      this.temp.splice(index, 1)
    } else if (
      index == "0" &&
      this.workExperience.length == 1 &&
      this.businessDirectoryFlag == true
    ) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "This is the business place that you are going to claim. We're afraid you can't remove this.",
        showDenyButton: false,
        confirmButtonText: `ok`,
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
        }
      });
    } else if (index == "0" && this.workExperience.length > 1) {
      this.workExperience.removeAt(index);
      this.checkCurOrg("work");
      this.temp.splice(index, 1)
    } else if (index > 0) {
      this.workExperience.removeAt(index);
      this.checkCurOrg("work");
      this.temp.splice(index, 1)
    }
    // this.checkExperienceYear(index, null)
    // console.log("this.temp")
    // console.log(this.temp)
  }

  checkCurOrg(value) {
    if (value == "work") {
      var array: any = [];
      this.workExperience.controls.forEach((ele) => {
        array.push(ele.get("badge").value);
      });
      var a = array.findIndex((x) => x == true);
      if (a == "-1") {
        this.currentIndex = null;
      }
    } else if (value == "edu") {
      var array: any = [];
      this.educationDetail.controls.forEach((ele) => {
        array.push(ele.get("currentlyPursued").value);
      });
      var a = array.findIndex((x) => x == true);
      if (a == "-1") {
        // this.curIndex = null;
        this.commonArbitraryData.curIndex = null;
        this.searchData.setCommonVariables(this.commonArbitraryData);
      }
    }
  }

  get educationArray() {
    return this.userDetailForm.get("educationDetail") as UntypedFormArray;
  }

  createEducation(): UntypedFormGroup {
    return this.fb.group({
      schoolName: [null],
      institutionId: [null],
      street: [null],
      city: [null, [CustomValidator.max(this.CITY.max)]],
      state: [null, [CustomValidator.max(this.CITY.max)]],
      country: [null],
      degree: [null],
      speciality: [null],
      currentlyPursued: [false],
      showThisOnProfile: [false],
      startMonth: [null],
      startYear: [this.currentYear],
      endMonth: [null],
      zipcode: [null, [Validators.required, CustomValidator.minmaxLetters(this.ZIPCODE.min, this.ZIPCODE.max)]],
      endYear: [this.currentYear],
    });
  }

  addEducation() {
    this.educationDetail = this.userDetailForm.get(
      "educationDetail"
    ) as UntypedFormArray;
    this.educationDetail.push(this.createEducation());
    //  this.checkMandatory()
  }

  addEducation1() {
    this.educationDetail = this.userDetailForm.get(
      "educationDetail"
    ) as UntypedFormArray;
    this.educationDetail.push(this.createEducation());
    this.checkMandatory();
  }

  checkMandatory() {
    if (this.studentFlag == true) {
      this.nonMandateWork();
      this.mandateEducation();
    } else if (this.studentFlag == false) {
      this.mandateWork();
      this.nonMandateEducation();
    }
  }

  removeEducation(index) {
    if (index == "0" && this.educationDetail.length == 1) {
      this.educationArray.reset();
      this.educationSubmit = false;
      this.educationDetail.controls.forEach((ele) => {
        ele.get("startYear").setValue(this.currentYear);
        ele.get("endYear").setValue(this.currentYear);
      });
      this.checkCurInst();
    } else if (index == "0" && this.educationDetail.length > 1) {
      this.educationDetail.removeAt(index);
      this.checkCurInst();
    } else if (index > 0) {
      this.educationDetail.removeAt(index);
      this.checkCurInst();
    }
  }

  checkCurInst() {
    var array: any = [];
    this.educationDetail.controls.forEach((ele) => {
      array.push(ele.get("showThisOnProfile").value);
    });
    var a = array.findIndex((x) => x == true);
    if (a == "-1") {
      // this.curIndex = null;
      this.commonArbitraryData.curIndex = null;
      this.searchData.setCommonVariables(this.commonArbitraryData);
    }
  }

  get certArray() {
    return this.userDetailForm.get("certification") as UntypedFormArray;
  }

  createCertification(): UntypedFormGroup {
    return this.fb.group({
      certificationName: [null],
      certificateOrganization: [null],
      certificationId: [null],
      certificateLicenseNo: [null],
      startMonth: [null],
      startYear: [this.currentYear],
      endMonth: [null],
      endYear: [this.currentYear],
    });
  }

  addCertification() {
    this.certification = this.userDetailForm.get("certification") as UntypedFormArray;
    this.certification.push(this.createCertification());
  }

  removeCertification(index) {
    if (index == "0" && this.certification.length == 1) {
      this.certArray.reset();
      this.certification.controls.forEach((ele) => {
        ele.get("startYear").setValue(this.currentYear);
        ele.get("endYear").setValue(this.currentYear);
      });
    } else if (index == "0" && this.certification.length > 1) {
      return this.certification.removeAt(index);
    } else if (index > 0) {
      return this.certification.removeAt(index);
    }
  }

  getPhysicianFormGroup(index: any): UntypedFormGroup {
    const formGroup = this.physicianData.controls[index] as UntypedFormGroup;
    return formGroup;
  }

  getWorkFormGroup(index: any): UntypedFormGroup {
    const formGroup = this.workExperience.controls[index] as UntypedFormGroup;
    return formGroup;
  }

  getCertFormGroup(index: any): UntypedFormGroup {
    const formGroup = this.certification.controls[index] as UntypedFormGroup;
    return formGroup;
  }

  getEducationFormGroup(index: any): UntypedFormGroup {
    const formGroup = this.educationDetail.controls[index] as UntypedFormGroup;
    return formGroup;
  }

  getCountry() {
    this.countryList = [];
    this.util.startLoader();
    this.api.query("country/getAllCountries").subscribe((res) => {
      this.util.stopLoader();
      res.forEach((ele) => {
        this.countryList.push(ele);
      });
    }, err => {
      this.util.stopLoader();
    });
  }
  selectUndefinedOptionValue: any;
  getStates() {
    // this.util.startLoader();
    this.stateListIN = [];
    this.api
      .query("country/getAllStates?countryCode=" + "IN")
      .subscribe((res) => {
        this.stateListIN = res;
        // this.util.stopLoader();
      }, err => {
        this.util.stopLoader();
      });
    //this.util.startLoader();
    this.stateListCA = [];
    this.api
      .query("country/getAllStates?countryCode=" + "CA")
      .subscribe((res) => {
        //this.util.stopLoader();
        this.stateListCA = res;
      }, err => {
        this.util.stopLoader();
      });
    //this.util.startLoader();
    this.stateListCA = [];
    this.api
      .query("country/getAllStates?countryCode=" + "AU")
      .subscribe((res) => {
        // this.util.stopLoader();
        this.stateListAU = res;
      }, err => {
        this.util.stopLoader();
      });
  }

  educationSubmit: boolean = false;
  workSubmit: boolean = false;
  currentOrgList: any = []





  getCurrentOrgs() {
    this.currentOrgList = []
    this.workExperience.value.forEach(ele => {
      var details: any = {}
      if (ele.currentOrganization == true && ele.organisationId !== null) {
        details.organisationId = ele.organisationId
        this.currentOrgList.push(details)
      }
    });
  }

  setValue() {
    this.workExperience.controls[this.orgIndex].patchValue({
      organisationId: this.orgResponse.organizationId,
    })
  }

  orgResponse: any
  orgIndex: number
  checkIfLocationChanged(i) {
    if (this.temp[i].city !==
      this.workExperience.value[i].city ||
      this.temp[i].zipCode !== this.workExperience.value[i].zipcode ||
      this.temp[i].city !== this.workExperience.value[i].city ||
      this.temp[i].country !== this.workExperience.value[i].country) {
      var data: any = {}
      data.country = this.workExperience.value[i].country
      data.stateName = this.workExperience.value[i].state
      data.city = this.workExperience.value[i].city
      data.zipCode = this.workExperience.value[i].zipcode
      data.organizationName = this.workExperience.getRawValue()[i].organisationName
      this.api.create('care/find/organization', data).subscribe(res => {
        if (res != undefined && res != null && res != '') {
          this.orgResponse = res
          this.orgIndex = i
          this.setValue()
        } else {
          this.workExperience.controls[i].patchValue({ organisationId: null })
        }
      }, err => {
        this.util.stopLoader();

      });
    }
  }




  save() {
    this.util.startLoader()

    for (var i = 0; i < this.temp.length; i++) {
      this.checkIfLocationChanged(i)
    }
    setTimeout(() => {
      this.getCurrentOrgs()
    }, 4000);

    setTimeout(() => {
      this.certification.controls.forEach(ele => {
        if (ele.get('certificationName').value != null && ele.get('certificationName').value != '' && ele.get('certificationName').value != undefined) {
          ele.get('certificationName').setValidators([Validators.required])
          ele.get('certificationName').updateValueAndValidity()
          ele.get('certificateOrganization').setValidators([Validators.required])
          ele.get('certificateOrganization').updateValueAndValidity()
          ele.get('certificateLicenseNo').setValidators([Validators.required])
          ele.get('certificateLicenseNo').updateValueAndValidity()
          ele.get('startMonth').setValidators([Validators.required])
          ele.get('startMonth').updateValueAndValidity()
          ele.get('startYear').setValidators([Validators.required])
          ele.get('startYear').updateValueAndValidity()
          ele.get('endMonth').setValidators([Validators.required])
          ele.get('endMonth').updateValueAndValidity()
          ele.get('endYear').setValidators([Validators.required])
          ele.get('endYear').updateValueAndValidity()
        }

      })
    }, 4500);

    setTimeout(() => {
      let map = {};
      let result = false;
      if (this.currentOrgList !== "") {
        for (let i = 0; i < this.currentOrgList.length; i++) {
          // check if object contains entry with this element as key
          if (map[this.currentOrgList[i].organisationId]) {
            result = true;
            // terminate the loop
            break;
          }
          // add entry in object with the element as key
          map[this.currentOrgList[i].organisationId] = true;
        }
      }

      if (result) {
        this.util.stopLoader()
        Swal.fire({
          icon: "info",
          title: "Oops...",
          text: "Sorry, you can't have multiple current organization under the same organization in your work experience.",
          showConfirmButton: true
        });
      } else {
        // this.util.stopLoader()
        this.submit = true;
        this.educationSubmit = true;
        this.workSubmit = true;
        if (
          this.userDetailForm.value.userType == "HEALTHCARE" ||
          this.userDetailForm.value.userType == "adminPersonnel" ||
          this.userDetailForm.value.userType == "Other" ||
          this.userDetailForm.value.userType == "RECRUITER" ||
          this.userDetailForm.value.userType == "BENCH_RECRUITER" ||
          this.userDetailForm.value.userType == "FREELANCE_RECRUITER"

        ) {

          this.educationDetail.controls.forEach((ele) => {
            ele.get("currentlyPursued").clearValidators();
            ele.get("currentlyPursued").updateValueAndValidity();
          });

          this.educationDetail.controls.forEach((ele) => {
            ele.get("showThisOnProfile").clearValidators();
            ele.get("showThisOnProfile").updateValueAndValidity();
          });

          var a = this.userDetailForm.value.workExperience.findIndex(
            (x) => x.currentOrganization == true
          );

          var c = this.userDetailForm.value.workExperience.findIndex(
            (x) => x.badge == true
          );

          if (this.workExperience.length > 1) {
            if (a != "-1") {
              this.workExperience.controls.forEach((ele) => {
                ele.get("currentOrganization").clearValidators();
                ele.get("currentOrganization").updateValueAndValidity();
              });
            } else if (a == "-1") {
              this.workExperience.controls.forEach((ele) => {
                ele
                  .get("currentOrganization")
                  .setValidators([Validators.requiredTrue]);
                ele.get("currentOrganization").updateValueAndValidity();
              });
            }

            if (c != "-1") {
              this.workExperience.controls.forEach((ele) => {
                ele.get("badge").clearValidators();
                ele.get("badge").updateValueAndValidity();
              });
            } else if (c == "-1") {
              this.workExperience.controls.forEach((ele) => {
                ele.get("badge").setValidators([Validators.requiredTrue]);
                ele.get("badge").updateValueAndValidity();
              });
            }
          } else if (this.workExperience.length == 1) {
            this.workExperience.controls[0].patchValue({ currentOrganization: true, badge: true })
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
        } else if (this.userDetailForm.value.userType == "student" ||
          this.userDetailForm.value.userType == "JOB_SEEKER") {
          this.workExperience.controls.forEach((ele) => {
            ele.get("currentOrganization").clearValidators();
            ele.get("currentOrganization").updateValueAndValidity();
          });

          this.workExperience.controls.forEach((ele) => {
            ele.get("badge").clearValidators();
            ele.get("badge").updateValueAndValidity();
          });

          var b = this.userDetailForm.value.educationDetail.findIndex(
            (x) => x.currentlyPursued == true
          );

          var c = this.userDetailForm.value.educationDetail.findIndex(
            (x) => x.showThisOnProfile == true
          );

          if (this.educationDetail.length > 1) {
            if (b != "-1") {
              this.educationDetail.controls.forEach((ele) => {
                ele.get("currentlyPursued").clearValidators();
                ele.get("currentlyPursued").updateValueAndValidity();
              });
            } else if (b == "-1") {
              this.educationDetail.controls.forEach((ele) => {
                ele.get("currentlyPursued").setValidators([Validators.requiredTrue]);
                ele.get("currentlyPursued").updateValueAndValidity();
              });
            }

            if (c != "-1") {
              this.educationDetail.controls.forEach((ele) => {
                ele.get("showThisOnProfile").clearValidators();
                ele.get("showThisOnProfile").updateValueAndValidity();
              });
            } else if (c == "-1") {
              this.educationDetail.controls.forEach((ele) => {
                ele.get("showThisOnProfile").setValidators([Validators.requiredTrue]);
                ele.get("showThisOnProfile").updateValueAndValidity();
              });
            }
          } else if (this.educationDetail.length == 1) {
            this.educationDetail.controls[0].patchValue({ currentlyPursued: true, showThisOnProfile: true })
          }

          this.educationDetail.controls.forEach((ele) => {
            if (ele.get("currentlyPursued").value == true) {
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
        if (
          this.userDetailForm.value.aboutMe != undefined &&
          this.userDetailForm.value.aboutMe != null &&
          this.userDetailForm.value.aboutMe != ""
        ) {
          this.aboutMe = this.userDetailForm.value.aboutMe;
        }
        if (this.userDetailForm.valid) {
          this.valid = true;
          this.jsonData.userId = this.userId;
          // this.jsonData.currentIndex = this.currentIndex
          this.jsonData.email = this.userDetailForm.value.email;
          this.jsonData.username = this.userDetailForm.value.email;
          this.jsonData.profileId = this.profileId;
          this.jsonData.source = this.source;
          this.jsonData.npiNo = this.userDetailForm.getRawValue().npiNo;
          this.jsonData.userType = this.userDetailForm.value.userType;
          this.jsonData.firstName = this.userDetailForm.value.firstName;
          this.jsonData.nonApplicable = this.userDetailForm.value.nonApplicable;
          this.jsonData.lastName = this.userDetailForm.value.lastName;
          this.jsonData.password = this.infoData.password;
          this.jsonData.zipcode = this.userDetailForm.value.zipcode;
          this.jsonData.profileId = this.businessProfileId;
          this.jsonData.photo = this.photoId;
          localStorage.setItem('profilePhoto', this.photoId)
          this.jsonData.aboutMe = this.aboutMe;
          this.userDetailForm.value.workExperience.forEach((ele) => {
            this.jsonData.title = ele.title;
            this.jsonData.organisation = ele.organisationName;
          });
          this.jsonData.phoneNo = this.userDetailForm.value.phoneNo;
          this.jsonData.secondaryEmail = this.userDetailForm.value.secondaryEmail;
          this.jsonData.city = this.userDetailForm.value.city;
          this.jsonData.state = this.userDetailForm.value.state;
          this.jsonData.country = this.userDetailForm.value.country;
          this.userDetailForm.value.physicianData.forEach((element) => {
            this.phyData.userId = element.userId;
            this.phyData.conditions = element.conditions;
            this.phyData.privatePay = element.privatePay;
            this.phyData.insurance = element.insurance;
            this.phyData.patientAcceptance = element.patientAcceptance;
          });

          this.jsonData.physicianData = this.phyData;

          this.userDetailForm.value.socialPresence.forEach((element) => {
            this.datasforsocial.twitter = element.twitter;
            this.datasforsocial.linkedin = element.linkedin;
            this.datasforsocial.blogURL = element.blogURL;
            this.datasforsocial.alternamePageLink = element.alternamePageLink;
          });
          this.jsonData.socialPresence = this.datasforsocial;
          //checking empty arrays in education
          this.jsonData.educationDetail = [];
          this.educationDetail.value.forEach((ele) => {
            if (
              ele.schoolName != null &&
              ele.schoolName != undefined &&
              ele.schoolName != ""
            ) {
              this.jsonData.educationDetail.push(ele);
            }
          });
          //checking empty arrays in work experience
          this.jsonData.workExperience = [];
          this.workExperience.getRawValue().forEach((ele) => {
            if (
              ele.organisationName != null &&
              ele.organisationName != undefined &&
              ele.organisationName != ""
            ) {
              this.jsonData.workExperience.push(ele);
            }
          });
          //checking empty arrays in certification
          this.jsonData.certification = [];
          this.certification.value.forEach((ele) => {
            if (
              ele.certificationName != null &&
              ele.certificationName != undefined &&
              ele.certificationName != ""
            ) {
              this.jsonData.certification.push(ele);
            }
          });

          this.jsonData.userPrivacy["workExperience"] =
            this.userDetailForm.value.workExperiencePrivacy;
          this.jsonData.userPrivacy["educationDetail"] =
            this.userDetailForm.value.educationDetailPrivacy;
          this.jsonData.userPrivacy["certification"] =
            this.userDetailForm.value.certificationPrivacy;
          this.jsonData.userPrivacy["socialInfluence"] =
            this.userDetailForm.value.socialInfluencePrivacy;
          this.jsonData.userPrivacy["communities"] = true;
          this.jsonData.userPrivacy["reviews"] = true;

          // console.log("this.jsonData");
          // console.log(this.jsonData);
          // if(this.workExperience.length > 1){
          for (var i = 0; i < this.workExperience.length; i++) {
            var qwert: any = this.workExperience.at(i)
            var qwerty: any = this.workExperience.at(i + 1)
            var qwertyu: any = this.workExperience.at(i + 2)
            var qwertyui: any = this.workExperience.at(i + 3)
            // console.log("qwert")
            // console.log(qwert.value)
            // console.log("qwerty")
            // console.log(qwerty.value)
            if (qwert != undefined && qwerty != undefined) {
              if (qwert.value.city == qwerty.value.city && qwert.value.country == qwerty.value.country && qwert.value.endMonth == qwerty.value.endMonth && qwert.value.endYear == qwerty.value.endYear && qwert.value.organisationName == qwerty.value.organisationName && qwert.value.startMonth == qwerty.value.startMonth && qwert.value.startYear == qwerty.value.startYear && qwert.value.state == qwerty.value.state && qwert.value.title == qwerty.value.title && qwert.value.zipcode == qwerty.value.zipcode) {
                return Swal.fire({
                  icon: "error",
                  title: "Duplicate work experience detected",
                  text: 'Two of the work experience data seems duplicate. Please, remove one of them',
                  showDenyButton: false,
                  confirmButtonText: `ok`,
                }).then((result) => {
                  /* Read more about isConfirmed, isDenied below */
                  if (result.isConfirmed) {
                    this.valid = false
                  }
                });
              }



              if (qwert.value.organisationName == qwerty.value.organisationName && qwert.value.currentOrganization == true && qwerty.value.currentOrganization == true &&
                qwert.value.country == qwerty.value.country && qwert.value.city == qwerty.value.city &&
                qwert.value.zipcode == qwerty.value.zipcode && qwert.value.state == qwerty.value.state) {
                return Swal.fire({
                  icon: "info",
                  title: "Oops...",
                  text: "Sorry, you can't have multiple current organization under the same organization in your work experience.",
                  showConfirmButton: true
                }).then((result) => {
                  /* Read more about isConfirmed, isDenied below */
                  if (result.isConfirmed) {
                    this.valid = false
                  }
                });
              }
            }


            if (qwertyu != undefined) {
              if (qwert.value.city == qwertyu.value.city && qwert.value.country == qwertyu.value.country && qwert.value.endMonth == qwertyu.value.endMonth && qwert.value.endYear == qwertyu.value.endYear && qwert.value.organisationName == qwertyu.value.organisationName && qwert.value.startMonth == qwertyu.value.startMonth && qwert.value.startYear == qwertyu.value.startYear && qwert.value.state == qwertyu.value.state && qwert.value.title == qwertyu.value.title && qwert.value.zipcode == qwertyu.value.zipcode) {
                return Swal.fire({
                  icon: "error",
                  title: "Duplicate work experience detected",
                  text: 'Two of the work experience data seems duplicate. Please, remove one of them',
                  showDenyButton: false,
                  confirmButtonText: `ok`,
                }).then((result) => {
                  /* Read more about isConfirmed, isDenied below */
                  if (result.isConfirmed) {
                    this.valid = false
                  }
                });
              }

              if (qwert.value.organisationName == qwertyu.value.organisationName && qwert.value.currentOrganization == true && qwertyu.value.currentOrganization == true &&
                qwert.value.country == qwertyu.value.country && qwert.value.city == qwertyu.value.city &&
                qwert.value.zipcode == qwertyu.value.zipcode && qwert.value.state == qwertyu.value.state) {
                return Swal.fire({
                  icon: "info",
                  title: "Oops...",
                  text: "Sorry, you can't have multiple current organization under the same organization in your work experience.",
                  showConfirmButton: true
                }).then((result) => {
                  /* Read more about isConfirmed, isDenied below */
                  if (result.isConfirmed) {
                    this.valid = false
                  }
                });
              }
            }

            if (qwertyui != undefined) {
              if (qwert.value.city == qwertyui.value.city && qwert.value.country == qwertyui.value.country && qwert.value.endMonth == qwertyui.value.endMonth && qwert.value.endYear == qwertyui.value.endYear && qwert.value.organisationName == qwertyui.value.organisationName && qwert.value.startMonth == qwertyui.value.startMonth && qwert.value.startYear == qwertyui.value.startYear && qwert.value.state == qwertyui.value.state && qwert.value.title == qwertyui.value.title && qwert.value.zipcode == qwertyui.value.zipcode) {
                return Swal.fire({
                  icon: "error",
                  title: "Duplicate work experience detected",
                  text: 'Two of the work experience data seems duplicate. Please, remove one of them',
                  showDenyButton: false,
                  confirmButtonText: `ok`,
                }).then((result) => {
                  /* Read more about isConfirmed, isDenied below */
                  if (result.isConfirmed) {
                    this.valid = false
                  }
                });
              }

              if (qwert.value.organisationName == qwertyui.value.organisationName && qwert.value.currentOrganization == true && qwertyui.value.currentOrganization == true &&
                qwert.value.country == qwertyui.value.country && qwert.value.city == qwertyui.value.city &&
                qwert.value.zipcode == qwertyui.value.zipcode && qwert.value.state == qwertyui.value.state) {
                return Swal.fire({
                  icon: "info",
                  title: "Oops...",
                  text: "Sorry, you can't have multiple current organization under the same organization in your work experience.",
                  showConfirmButton: true
                }).then((result) => {
                  /* Read more about isConfirmed, isDenied below */
                  if (result.isConfirmed) {
                    this.valid = false
                  }
                });
              }
            }
          }
          // }
          this.util.startLoader();
          this.api.create("user/saveUser", this.jsonData).subscribe((response) => {
            // this.util.stopLoader();
            if (response.code === "00000") {
              if (this.source != null) {
                var data: any = {};
                data.source = this.source;
                setTimeout(() => {
                  this.router.navigate(["landingPage"], { queryParams: data });
                }, 2000);
              } else {
                setTimeout(() => {
                  this.router.navigate(["landingPage"]);
                }, 2000);
              }
            } else if (response.code === "99999") {
              this.valid = false;
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: response.message,
                showDenyButton: false,
                confirmButtonText: `ok`,
              }).then((result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                }
              });
            } else if (response.code == '88888') {
              this.valid = false;
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "There seems two duplicate certifications. Please, remove one.",
                showDenyButton: false,
                confirmButtonText: `ok`,
              }).then((result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                }
              });
            }
            // this.api.stopLoader();
            //this.router.navigate(['landingPage']);
          }, err => {
            this.util.stopLoader();
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
          this.scrollToFirstInvalidControl();
          // this.submit = false
          this.util.stopLoader()
        }
      }
    }, 5000);


  }

  fileChangeEvent(event, popupName): void {
    this.imageChangedEvent = event;
    if (event.target.files && event.target.files[0]) {
      this.fileUploadName = event.target.files[0].name;

      this.myFileInput.nativeElement.value; //assigning the file through viewchild
      const acceptedImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
      if (!acceptedImageTypes.includes(event.target.files[0].type)) {
        Swal.fire('', 'Please upload the correct file type   (Only .jpg, .png, .jpeg)', 'info');
        // this.myFileInput.nativeElement.value = "";
        this.modalRef.hide();
      } else {
        this.PopupServicevlaues(popupName);
      }
    }
  }
  PopupServicevlaues(templatePhoto: TemplateRef<any>) {
    this.modalRef = this.modalService.show(templatePhoto, {
      animated: true,
      backdrop: "static",
      class: "second",
      keyboard: false,
    });
  }

  modalclose() {
    // for (let i = 1; i <= this.modalService.getModalsCount(); i++) {
    //   this.modalService.hide(i);
    //   // this.myFileInput.nativeElement.value='' //clearing the previosuly selected files
    // }
    this.modalRef.hide()
  }

  closePhoto() {
    this.modalRef.hide();
    this.fileUploadName = "";
    // this.myFileInput.nativeElement.value = '';
  }

  setModalClass() {
    this.valueWidth = !this.valueWidth;
    const modalWidth = this.valueWidth ? "modal-lg" : "modal-sm";
    this.modalRef.setClass(modalWidth);
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    //// console.log("this.v-- "+this.croppedImage.name);\
    //// console.log("this.croppedImage-- "+this.croppedImage);

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

  uploadPhoto() {
    this.myFileInput.nativeElement.click();
  }
  count = 0
  imageLoaded() {
    // this.modalclose();
    this.closePhoto()
    const formData: FormData = new FormData();
    formData.append("file", this.fileToUpload, this.fileUploadName);
    this.api.create("upload/image", formData).subscribe((res) => {
      this.photoId = res.fileId;
      localStorage.setItem('profilePhoto', this.photoId)
      // this.landingPageNaveBar.updatephoto()

      this.img = {
        src: AppSettings.ServerUrl + "download/" + this.photoId,
      };
      // this.landingPageNaveBar.updatepath(this.img)


      this.count = this.count + 1
      if (this.count === 1) {
        this.data9.completePercentage = this.data9.completePercentage + 10
      }
      // else {
      //   this.data9.completePercentage = this.data9.completePercentage - 10
      // }
      this.data9.photo = AppSettings.ServerUrl + "download/" + this.photoId,
        this.commonValues.setUserData(this.data9)

    }, err => {
      this.util.stopLoader();
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

  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }

  // deal callback data
  public onReturnData(data: any) {
    // Do what you want to do

    // this.imageLoaded();

    //  Here has three type of messages now
    //  1. Max size
    // {
    //     code: 4000,
    //     data: currentSize,
    //     msg: `Max size allowed is ${this.viewConfig.maxsize / 1024}kb, current size is ${currentSize}kb`
    //  }

    //  2. Error
    //  {
    //       code: 4001,
    //       data: null,
    //       msg: 'ERROR: When sent to the server, something went wrong, please check the server url.'
    //  }

    //  3. Image type error
    // {
    //       code: 4002,
    //       data: null,
    //       msg: `The type you can upload is only image format`
    // }

    //  4. Success
    //  {
    //       code: 2000,
    //       data,
    //       msg: 'The image was sent to the server successfully'
    //  }
  }

  onKeyZip(event: any, value, index) {

    if (value == "user") {
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
              this.userDetailForm.patchValue({
                city: cityName,
                state: stateName,
              });
            });
          } else {
            // this.userDetailForm.patchValue({
            //   city: null,
            //   state: null,
            //   // street: null
            // });
          }
        });
      } else {
        this.userDetailForm.patchValue({
          city: null,
          state: null,
          // street: null
        });
      }
    } else if (value == "work") {
      let data: any = {};
      data.countryCode = "US";
      data.zipCode = event.target.value;
      // data.stateCode = '';
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
          }
          else {
            // this.workExperience.controls[index].patchValue({
            //   city: null,
            //   state: null,
            //   // street : null,
            // });
          }
        });
      } else {
        //  {
        this.workExperience.controls[index].patchValue({
          city: null,
          state: null,
          // street : null,
        });
        // }
      }
    } else if (value == "edu") {
      let data: any = {};
      data.countryCode = "US";
      data.zipCode = event.target.value;
      // data.stateCode = '';
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
          }
          else {
            // this.educationDetail.controls[index].patchValue({
            //   city: null,
            //   state: null,
            // });
          }
        });
      } else {
        this.educationDetail.controls[index].patchValue({
          city: null,
          state: null,
        });
      }
    }
  }

  onEnterNpiNo(event: any) {
    if (event.target.value == "") {
      this.userDetailForm.controls.npiNo.setValidators(Validators.nullValidator)
      this.userDetailForm.controls.npiNo.updateValueAndValidity()
    }
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
          this.userDetailForm.patchValue({
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

          var val: any = {}
          val.boolean = true
          this.commonValues.setValidNPI(val)

        } else {

          var val: any = {}
          val.boolean = false
          this.commonValues.setValidNPI(val)

          this.util.stopLoader();
          this.userDetailForm.controls.npiNo.setErrors({ invalidNpi: true })
          this.userDetailForm.updateValueAndValidity()
          // this.userDetailForm.patchValue({
          //   // country: null,
          //   // aboutMe: null,
          //   // city: null,
          //   // state: null,
          //   // // firstName : firstName,
          //   // // lastName : lastName,
          //   // zipcode: null,
          //   // phoneNo: null,
          //   // title: null,
          // });
        }
      }, err => {
        this.util.stopLoader();
      });
    }
  }

  filterNo(event: any) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  onChangeCountry(event, value, index) {
    if (value == "user") {
      this.userDetailForm.patchValue({
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
        country: event,
      });
    } else if (value == "work") {
      this.workExperience.controls[index].patchValue({
        state: null,
        zipcode: null,
        city: null,
        country: event,
      });
    }
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
  }



  getOrganization() {
    this.util.startLoader();
    this.api.query("care/organizations").subscribe((res) => {

      this.util.stopLoader();
      res.forEach((ele) => {
        var obj: any = {};
        obj.organizationId = ele.organizationId;
        obj.organizationName = ele.organizationName;
        obj.country = ele.country;
        obj.countryName = ele.countryName;
        obj.city = ele.city;
        obj.street = ele.street && ele.street !== null ? ele.street : null;
        obj.address1 = ele.address1;
        obj.address2 = ele.address2;
        this.orgList.push(obj);
      });
    }, err => {
      this.util.stopLoader();
    });
  }

  getCertification() {
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

  getInstitutions() {
    this.util.startLoader();
    this.api.query("care/institutions").subscribe((res) => {
      //// console.log('insitutoi list');
      //// console.log(res);
      this.util.stopLoader();
      res.forEach((ele) => {
        var obj: any = {};
        obj.institutionId = ele.institutionId;
        obj.institutionName = ele.institutionName;
        obj.country = ele.country;
        obj.countryName = ele.countryName;
        obj.city = ele.city;
        obj.street = ele.street && ele.street !== null ? ele.street : null;
        // this.instList.push(ele.institutionName);
        this.instList.push(obj);
      });
    }, err => {
      this.util.stopLoader();
    });
  }

  getPhyTitle() {
    this.studentTitles = [];
    this.util.startLoader();
    this.api
      .query("care/list/values/MEDICAL_PROFESSIONAL_TITLE")
      .subscribe((res) => {
        this.util.stopLoader();
        if (res.listItems != null) {
          res.listItems.forEach((ele) => {
            // this.phyTitleList.push(ele.item);
            this.studentTitles.push(ele.item);
          });
        }
      }, err => {
        this.util.stopLoader();
      });
  }

  mandateWork() {
    this.mandate("title", "work");
    // this.mandate('organisationName', 'work')
    this.mandate("startMonth", "work");
    this.mandate("startYear", "work");
    this.mandate("endMonth", "work");
    this.mandate("endYear", "work");
    this.mandate("state", "work");
    this.mandate("clientType", "work");
    this.mandate("city", "work");
    // this.mandate('zipcode', 'work')
    // this.mandate('street', 'work')
    this.mandate("country", "work");
    this.workExperience.controls.forEach((ele) => {
      ele
        .get("zipcode")
        .setValidators([Validators.required, Validators.pattern(/^[0-9]*$/)]);
      ele.get("zipcode").updateValueAndValidity;
      ele
        .get("organisationName")
        .setValidators([
          Validators.required,
          Validators.pattern(/^[^\s]+(\s+[^\s]+)*$/),
        ]);
      ele.get("organisationName").updateValueAndValidity();
    });
  }

  nonMandateWork() {
    this.nonMandate("title", "work");
    this.nonMandate("organisationName", "work");
    this.workExperience.controls.forEach((ele) => {
      ele
        .get("organisationName")
        .setValidators([Validators.pattern(/^[^\s]+(\s+[^\s]+)*$/)]);
      ele.get("organisationName").updateValueAndValidity();
    });
    this.nonMandate("startMonth", "work");
    this.nonMandate("startYear", "work");
    this.nonMandate("endMonth", "work");
    this.nonMandate("endYear", "work");
    this.nonMandate("state", "work");
    this.nonMandate("city", "work");
    this.nonMandate("clientType", "work");
    this.nonMandate("zipcode", "work");
    this.workExperience.controls.forEach((ele) => {
      ele.get("zipcode").setValidators([Validators.pattern(/^[0-9]*$/)]);
      ele.get("zipcode").updateValueAndValidity();
    });
    // this.nonMandate('street', 'work')
    this.nonMandate("country", "work");
  }

  mandateEducation() {
    this.mandate("schoolName", "edu");
    this.mandate("degree", "edu");
    this.mandate("startMonth", "edu");
    this.mandate("startYear", "edu");
    this.mandate("speciality", "edu");
    this.mandate("endMonth", "edu");
    this.mandate("endYear", "edu");
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
  }

  //method filtering the only org name that will be shown in the profile
  showThis(event, index) {
    if (event.target.checked == true) {
      this.currentIndex = index;
      this.workExperience.controls.forEach((ele) => {
        ele.get("badge").patchValue(false);
      });
      this.workExperience.controls[index].patchValue({ badge: true });
    } else if (event.target.checked == false) {
      this.currentIndex = null;
      this.workExperience.controls[index].patchValue({ badge: false });
    }
  }

  // eduShowThisFlag: any = null
  eduShowThis(event, index) {
    if (event.target.checked == true) {
      // this.curIndex = index;
      this.commonArbitraryData.curIndex = index;
      this.searchData.setCommonVariables(this.commonArbitraryData);

      this.educationDetail.controls.forEach((ele) => {
        ele.get("showThisOnProfile").patchValue(false);
      });
      this.educationDetail.controls[index].patchValue({
        showThisOnProfile: true,
      });
    } else if (event.target.checked == false) {
      // this.curIndex = null;
      this.commonArbitraryData.curIndex = null;
      this.searchData.setCommonVariables(this.commonArbitraryData);

      this.educationDetail.controls.forEach((ele) => {
        ele.get("showThisOnProfile").patchValue(false);
      });
    }
  }

  currentlyPursued(event, index) {
    if (event.target.checked == true) {
      // this.curIndex = index;
      // this.hide1 = true;
      this.educationDetail.controls.forEach((ele) => {
        ele.get("currentlyPursued").clearValidators();
        ele.get("currentlyPursued").updateValueAndValidity();
      });

      this.educationDetail.controls[index].patchValue({
        currentlyPursued: true,
      });
      this.educationDetail.controls[index].patchValue({
        endYear: this.currentYear,
      });
      this.educationDetail.controls[index].patchValue({ endMonth: null });
    } else if (event.target.checked == false) {
      this.hide1 = false;
      this.educationDetail.controls[index].patchValue({
        endYear: this.currentYear,
      });
      this.educationDetail.controls[index].patchValue({ endMonth: null });
      this.educationDetail.controls[index].patchValue({
        currentlyPursued: false,
      });
      this.educationDetail.controls[index].patchValue({
        showThisOnProfile: false,
      });
      this.checkCurOrg("edu");
    }
  }

  curOrg(event, index) {
    if (event.target.checked == true) {
      // this.currentIndex = index;
      this.hide = true;
      this.workExperience.controls.forEach((ele) => {
        ele.get("currentOrganization").clearValidators();
        ele.get("currentOrganization").updateValueAndValidity();
      });

      this.workExperience.controls[index].patchValue({
        currentOrganization: true,
      });
      this.workExperience.controls[index].patchValue({
        endYear: this.currentYear,
      });
      this.workExperience.controls[index].patchValue({ endMonth: null });
      // this.checkExperienceYear(index, null)   //checking for overlapping work experience years
    } else if (event.target.checked == false) {
      // this.currentIndex = null;
      this.hide = false;
      this.workExperience.controls[index].patchValue({
        endYear: this.currentYear,
      });
      this.workExperience.controls[index].patchValue({ endMonth: null });
      this.workExperience.controls[index].patchValue({
        currentOrganization: false,
      });
      this.workExperience.controls[index].patchValue({ badge: false });
      this.workExperience.controls[index]
        .get("currentOrganization")
        .markAsUntouched();
      this.workExperience.controls[index]
        .get("currentOrganization")
        .updateValueAndValidity();
      //checking if profile badge is selected for at least one org.
      this.checkCurOrg("work");
      //checking if at least one cur org is checked
      var a = this.userDetailForm.value.workExperience.findIndex(
        (x) => x.currentOrganization == true
      );
      if (
        this.userDetailForm.value.userType == "HEALTHCARE" ||
        this.userDetailForm.value.userType == "adminPersonnel"
      ) {
        if (a != "-1") {
          this.workExperience.controls.forEach((ele) => {
            ele.get("currentOrganization").clearValidators();
            ele.get("currentOrganization").updateValueAndValidity();
          });
        } else if (a == "-1") {
          this.workExperience.controls.forEach((ele) => {
            ele
              .get("currentOrganization")
              .setValidators([Validators.requiredTrue]);
            ele.get("currentOrganization").updateValueAndValidity();
          });
        }
      }

      this.curOrgUncheck("work", index); //removing not used years
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
  eduList: any = [];
  checkExperienceYear(index, par) {
    this.list = [];
    var yearList: Array<any> = [];
    this.workExperience.controls.forEach((ele) => {
      var obj: any = {};
      if (ele.get("startYear").dirty) {
        obj.startYear = parseInt(ele.get("startYear").value);
      }

      if (this.workExperience.value[index].currentOrganization == true) {
        obj.endYear = parseInt(this.currentYear);
      } else if (
        this.workExperience.value[index].currentOrganization == false ||
        this.workExperience.value[index].currentOrganization == null
      ) {
        if (ele.get("endYear").dirty) {
          obj.endYear = parseInt(ele.get("endYear").value);
        }
      }
      yearList.push(obj);
      //// console.log('yearList')
      //// console.log(yearList)
    });
    var stYr: any;
    var endYr: any;
    yearList.forEach((ele) => {
      stYr = ele.startYear;
      endYr = ele.endYear;
      for (var i: number = stYr + 1; i < endYr; i++) {
        //// console.log('this is checking if value exist')
        //// console.log(this.list.includes(i))
        if (!this.list.includes(i)) {
          this.list.push(i);
        } else {
          //// console.log('this is the number')
          //// console.log(i)
          Swal.fire({
            title: "Invalid experience year",
            text: "You already have work experience falling  on this year",
            showDenyButton: false,
            confirmButtonText: `ok`,
          }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
              if (par == "stYr") {
                this.workExperience.controls[index].patchValue({
                  startYear: this.currentYear,
                });
                this.workExperience.controls[index]
                  .get("startYear")
                  .markAsPristine();
                this.workExperience.controls[index]
                  .get("startYear")
                  .updateValueAndValidity();
                // this. checkExperienceYear(index, null)
              } else if (par == "endYr") {
                this.workExperience.controls[index].patchValue({
                  endYear: this.currentYear,
                });
                this.workExperience.controls[index]
                  .get("endYear")
                  .markAsPristine();
                this.workExperience.controls[index]
                  .get("endYear")
                  .updateValueAndValidity();
                // this. checkExperienceYear(index, null)
              }
            }
          });
        }
      }
    });
    this.removeDupe(this.list); //removing duplicate years

    //// console.log('list so far')
    //// console.log(this.list)
    var yearValue: any;
    if (par == "stYr") {
      yearValue = parseInt(this.workExperience.value[index].startYear);
    } else if (par == "endYr") {
      yearValue = parseInt(this.workExperience.value[index].endYear);
    }

    this.list.forEach((ele) => {
      if (parseInt(ele) == yearValue) {
        Swal.fire({
          title: "Invalid experience year",
          text: "You already have work experience falling  on this year",
          showDenyButton: false,
          confirmButtonText: `ok`,
        }).then((result) => {
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {
            if (par == "stYr") {
              this.workExperience.controls[index].patchValue({
                startYear: this.currentYear,
              });
              this.workExperience.controls[index]
                .get("startYear")
                .markAsPristine();
              this.workExperience.controls[index]
                .get("startYear")
                .updateValueAndValidity();
              // this. checkExperienceYear(index, null)
            } else if (par == "endYr") {
              this.workExperience.controls[index].patchValue({
                endYear: this.currentYear,
              });
              this.workExperience.controls[index]
                .get("endYear")
                .markAsPristine();
              this.workExperience.controls[index]
                .get("endYear")
                .updateValueAndValidity();
              // this. checkExperienceYear(index, null)
            }
          }
        });
      }
    });
  }

  nonMandateEducation() {
    this.nonMandate("schoolName", "edu");
    this.nonMandate("degree", "edu");
    this.nonMandate("startMonth", "edu");
    this.nonMandate("startYear", "edu");
    this.nonMandate("speciality", "edu");
    this.nonMandate("endMonth", "edu");
    this.nonMandate("endYear", "edu");
    this.nonMandate("state", "edu");
    this.nonMandate("city", "edu");
    this.nonMandate("zipcode", "edu");
    this.nonMandate("street", "edu");
    this.nonMandate("country", "edu");
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

  professionalFlag: boolean = true
  recruiterFlag: boolean = false
  jobSeekerFlag: boolean = false
  onChangePhysician(val) {
    localStorage.setItem('userType', val)
    this.workExperience.controls.forEach((ele) => {
      ele.get("title").setValue(null);
    });
    if (val == "HEALTHCARE") {
      this.physicianFlag = true;
      this.adminFlag = false;
      this.recruiterFlag = false
      this.professionalFlag = true
      this.jobSeekerFlag = false
      this.studentFlag = false;
      this.mandateWork();
      this.nonMandateEducation();
      this.workExperience.controls.forEach((ele) => {
        ele.get("currentOrganization").setValidators([Validators.required]);
        ele.get("currentOrganization").updateValueAndValidity();
      });
      this.skjhf()
    } else if (val == "student") {
      this.studentFlag = true;
      this.professionalFlag = false
      this.recruiterFlag = false
      this.jobSeekerFlag = false
      this.adminFlag = false;
      this.physicianFlag = false;
      this.mandateEducation();
      this.nonMandateWork();
      this.workExperience.controls.forEach((ele) => {
        ele.get("currentOrganization").clearValidators();
        ele.get("currentOrganization").updateValueAndValidity();
        ele.get("badge").patchValue(false);
      });
    } else if (val == "adminPersonnel") {
      this.adminFlag = true;
      this.professionalFlag = true
      this.physicianFlag = false;
      this.recruiterFlag = false
      this.studentFlag = false;
      this.jobSeekerFlag = false
      this.mandateWork();
      this.nonMandateEducation();
      this.workExperience.controls.forEach((ele) => {
        ele.get("currentOrganization").setValidators([Validators.required]);
        ele.get("currentOrganization").updateValueAndValidity();
      });
      this.skjhf()
    } else if (val == "Other") {
      this.adminFlag = false;
      this.professionalFlag = true
      this.physicianFlag = false;
      this.recruiterFlag = false
      this.studentFlag = false;
      this.jobSeekerFlag = false
      this.mandateWork();
      this.nonMandateEducation();
      this.workExperience.controls.forEach((ele) => {
        ele.get("currentOrganization").clearValidators();
        ele.get("currentOrganization").updateValueAndValidity();
      });
      this.skjhf()
    } else if (val == "RECRUITER" || val == "BENCH_RECRUITER" || val == "FREELANCE_RECRUITER") {
      this.adminFlag = false;
      this.professionalFlag = false
      this.physicianFlag = false;
      this.studentFlag = false;
      this.jobSeekerFlag = false
      this.recruiterFlag = true
      this.mandateWork();
      this.nonMandateEducation();
      this.skjhf()
    } else if (val == "JOB_SEEKER") {
      this.adminFlag = false;
      this.professionalFlag = false
      this.physicianFlag = false;
      this.studentFlag = false;
      this.recruiterFlag = false
      this.jobSeekerFlag = true
      this.nonMandateWork();
      this.mandateEducation();
      this.skjhf()
    }
  }

  candidateJobTitleList: any = []
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


  skjhf() {
    this.educationDetail.controls.forEach((ele) => {
      ele.get("showThisOnProfile").patchValue(false);
    });
  }

  onItemSelect(item: any) {
    //// console.log(item);
    //// console.log(this.selectedItems);
  }
  OnItemDeSelect(item: any) {
    //// console.log(item);
    //// console.log(this.selectedItems);
  }
  onSelectAll(items: any) {
    //// console.log(items);
  }
  onDeSelectAll(items: any) {
    //// console.log(items);
  }

  onHidden(): void {
    // console.log('Dropdown is hidden');
  }
  onShown(): void {
    // console.log('Dropdown is shown');
  }
  isOpenChange(): void {
    // console.log('Dropdown state is changed');
  }

  clearData() {
    // console.log('clear data');
    // this.userDetailForm.value.phoneNo.reset();
    let phone = document.getElementById("phoneNo");
    // phone.textContent.replace = null;
  }

  scrollToFirstInvalidControl() {
    const firstInvalidControl: HTMLElement =
      this.el.nativeElement.querySelector("form .ng-invalid");

    // firstInvalidControl.focus(); //without smooth behavior
    window.scroll({
      //smooth behaviur

      top: this.getTopOffset(firstInvalidControl),
      left: 0,
      behavior: "smooth",
    });
  }

  private getTopOffset(controlEl: HTMLElement): number {
    const labelOffset = 50;
    return controlEl.getBoundingClientRect().top + window.scrollY - labelOffset;
  }

  stayOnPage() {
    // this.router.navigate(['/userClassification'])
    this.router
      .navigateByUrl("/userClassification", { skipLocationChange: true })
      .then(() => {
        this.router.navigate(["/userClassification"]);
      });
  }

  onLogout() {
    this.util.startLoader();
    this.api.onLogout().subscribe((res) => {
      this.util.stopLoader();
      if (res) {
        if (res.code === "00000") {
          this.cookieservice.deleteAll();
          let allCookies = document.cookie.split(";");
          if (allCookies) {
            for (let i = 0; i < allCookies.length; i++) {
              document.cookie =
                allCookies[i] + "=;expires=" + new Date(0).toUTCString();
            }
          }
          localStorage.clear();
          this._socket.ngOnDestroy();
          this._socket_stream.ngOnDestroy();

          this.router.navigate(["/login"]);
        }
      }
    });
  }

  stopThere: boolean = false
  @HostListener('window:scroll')
  handleScroll() {
    const YoffSet = window.pageYOffset
    if (YoffSet >= 25) {
      this.stopThere = true
    } else {
      this.stopThere = false
    }
  }

}
