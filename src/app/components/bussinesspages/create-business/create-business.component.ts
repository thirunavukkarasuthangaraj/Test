import { filter } from 'rxjs/operators';
import { MessageService } from "src/app/services/message.service";
import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  ElementRef,
  ViewChildren,
  HostListener,
  Output,
} from "@angular/core";
import { ImageCroppedEvent } from "ngx-image-cropper";
import {
  UntypedFormGroup,
  UntypedFormArray,
  Validators,
  UntypedFormBuilder,
  UntypedFormControl,
  ValidatorFn,
} from "@angular/forms";
import * as CryptoJS from 'crypto-js';
import { AuthServiceService } from "src/app/services/auth-service.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "src/app/services/api.service";
import {
  BsModalService,
  BsModalRef,
  ModalDirective,
} from "ngx-bootstrap/modal";
import { CropperOption } from "ngx-cropper";
import { CommonValues } from "src/app/services/commonValues";
import { BehaviorSubject, Subscription } from "rxjs";
import { BusinessBannerComponent } from "../business-banner/business-banner.component";
import { CookieService } from "ngx-cookie-service";
import { AppSettings } from "src/app/services/AppSettings";
import { UtilService } from "src/app/services/util.service";
import { ProfilePhoto } from "src/app/services/profilePhoto";
import Swal from "sweetalert2";
import { CountdownComponent } from "ngx-countdown";
import { CustomValidator } from "../../Helper/custom-validator";
import { PreviousRouteService } from "src/app/services/PreviousRouteService";
import { FormValidation } from "src/app/services/FormValidation";
import { BusinessModal, CompanyLocationDetails } from 'src/app/services/businessModal';
import { UserSocialPresence } from 'src/app/services/userModel';
declare var $: any;

@Component({
  selector: "app-create-business",
  templateUrl: "./create-business.component.html",

  styleUrls: ["./create-business.component.scss"],
})
export class CreateBusinessComponent extends FormValidation implements OnInit {
  @ViewChild("cd") private countdown: CountdownComponent;
  @ViewChild("myFileInput") myFileInput;
  @ViewChild("businessmenusticky") menuElement: ElementRef;
  businessmenustick: boolean = false;
  //values = {businessId:"",  admin: false, menu:"", userId:""}
  values: any = {};
  public FORMERROR = super.Form;
  alreadyExitsBusiness;
  worktime: boolean = false;
  fromvalue: any;
  fromflag: boolean = false;
  disable: boolean = false;
  toflag: boolean = false;
  timeExpired: boolean = false;
  resentOTPCode: boolean = false;
  remainingCharacters = new BehaviorSubject<any>(this.ABOUT_COMPANY.max);
  tovalue: any;
  placeholder: any = "Add more";
  secondaryPlaceholder: any = "Option to add 3 #Tags";
  // data_: any = { "domain":"INSURANCE_COMPANYS, SKILLED_NURSING_FACILITY_SERVICE_TYPE,  SKILLED_NURSING_FACILITY_ACCREDITION,  HOME_CARE_SERVICE_TYPE,HHA_SERVICE_TYPE,HHA_ACCREDITION,HOSPICE_SERVICE_TYPE,HOSPICE_ACCREDITION,PHARMACY_SERVICE_TYPE,PHARMACY_ACCREDITION,DME_SERVICE_TYPE, DME_ACCREDITION, ADMINISTRATIVE_PERSONNEL, FACILITY_PRACTICE_TYPE" }

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

  backdropConfig = {
    backdrop: true,
    ignoreBackdropClick: true,
    show: true,
  };

  insuranceDropdown = [];
  insuranceDropdownSettings = {};
  insuranceList = [];
  insuranceSelectedItems = [];
  seletedaccredition: any;

  numberonlyflag: boolean = false;
  numberonlyflag1: boolean = false;
  otherFlag: boolean = false;
  modalRef: BsModalRef;
  applicable: boolean = false;
  valueWidth = false;
  tags: UntypedFormArray;
  businessForm: UntypedFormGroup;
  companyLocationDetails: UntypedFormArray;
  workingHours: UntypedFormArray;
  userSocialPresence: UntypedFormArray;
  eventEmitter: Subscription;
  socialData: any = {};
  serviceOptions: UntypedFormArray;
  hCareFlag: boolean = false;
  studentFlag: boolean = false;
  adminFlag: boolean = false;
  isCollapsed: boolean = false;
  validateflagforWork: boolean = false;
  infoData: any = {};
  // datasforsocial: any = {};
  dataforhours: any = {};
  phyData: any = {};
  fileToUpload: File;
  specialityList = [];
  countryList: any = [];
  insuranceData = [];
  serviceData = [];
  specialityDropdown = [];
  specialitySelectedItems = [];
  specialityDropdownSettings = {};
  stateListAU: any = [];
  stateListIN: any = [];
  stateListCA: any = [];
  serviceTypeList: any = [];
  accreditionValue: any = [];
  companyTypeList: any = [
    "Private",
    "Public",
    "Non-Profit",
    "Government",
    "Education",
  ];

  photoId: any;
  photoElement: any;
  img;
  conditionList = [];
  serviceDropdown = [];
  serviceSelectedItems = [];
  tagSelectedItems = [];

  serviceDropdownSettings = {};
  conditionPatch = [];
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
  companySize: any = [
    "0-10",
    "11-50",
    "51-250",
    "251-500",
    "501-1000",
    "1,001-5,000",
    "5,001-10,000",
    "10,001-25,000",
    "25,001-50,000",
    "50,001-100,000",
    "100,000+",
  ];

  phyTitleList: any = [];
  busiTitleList: any = [];
  hCareFacilityList: any = [];
  facilityValue: any = [];
  industryType: any = [];

  jsonData: any = {
    businessOwner: null,
    others: null,
    profileId: null,
    industryClassification: null,
    offlineVerification: false,
    facilityPracticeType: null,
    businessName: null,
    organizationType: null,
    tagLine: null,
    tags: [""],
    businessLogo: null,
    businessBanner: null,
    companyType: null,
    yearStarted: null,
    companySize: null,
    aboutCompany: null,
    companyLocationDetails: [
      {
        address1: null,
        address2: null,
        primary: false,
        company: null,
        country: null,
        state: null,
        locationId: null,
        city: null,
        zipCode: null,
        headquarters: false,
        businessPhone: null,
        cellPhone: null,
        businessEmail: null,
        website: null,
        street: null,
      },
    ],

    serviceOptions: {
      conditionCreated: null,
      insuranceAccepted: null,
      applicable: null,
      privatePayAccepted: null,
      // "licencedState": null,
      // "countryService": null,
      accredition: null,
      serviceType: null,
      medicareCertified: null,
      acceptingNewPatients: null,
    },
    userSocialPresence: {
      twitter: null,
      facebook: null,
      linkedin: null,
      blogURL: null,
      alternamePageLink: null,
    },
    workingHours: {
      monFromTime: null,
      monToTime: null,
      monWorking: false,
      tueFromTime: null,
      tueToTime: null,
      tueWorking: false,
      wedFromTime: null,
      wedToTime: null,
      wedWorking: false,
      thrFromTime: null,
      thrToTime: null,
      thrWorking: false,
      friFromTime: null,
      friToTime: null,
      friWorking: false,
      satFromTime: null,
      satToTime: null,
      satWorking: false,
      sunFromTime: null,
      sunToTime: null,
      sunWorking: false,
    },
  };
  currentIndex: any = null;
  submit: boolean = false;
  disavow: boolean = false;
  aboutCompany: any;
  OTPConfirm: UntypedFormGroup;
  resendotp: boolean = false;

  usFlag: boolean = false;
  physicianUser: boolean = false;

  imageChangedEvent: any = "";
  croppedImage: any = "";
  otp: boolean = false;
  fileUploadName: any = "";
  photoWindow = true;
  public cropperConfig: CropperOption;

  clickEventsubscription: Subscription;
  userId = localStorage.getItem("userId");
  registerValue: any;
  postalCode = false;
  businessId;
  logo = false;
  //config for ngxSummerNote
  config = {
    placeholder: "About Company",
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
      onKeyup(e) {
        const t = e.currentTarget.innerText;
        // this.keyupdata(t)
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
  percentage: any = 0;
  @ViewChild("autoShownModal")
  autoShownModal: ModalDirective;
  @ViewChild("postalCodeModal")
  postalCodeModal: ModalDirective;
  isModalShown = false;

  showModal(): void {
    this.isModalShown = true;
    //  this.modalRef = this.modalService.show( this.backdropConfig);
  }

  hideModal(): void {
    this.autoShownModal.hide();
  }

  onHidden(): void {
    this.isModalShown = false;
    this.disavow = false;
    this.disable = false;
    this.timeExpired = false;
    this.otp = false;
    this.resendotp = false;
    this.exit = false;
    this.resentOTPCode = false;
    this.OTPConfirm.reset();
    this.businessForm.get("businessName").disable();
  }

  canceldata() {
    // this.isModalShown = false;
    // this.disavow = false
    // this.disable = false
    // this.timeExpired = false;
    // this.otp = false;
    // this.resendotp = false;
    // this.exit = false;
    // this.resentOTPCode = false;
    // this.OTPConfirm.reset()
    // this.businessForm.get('businessName').disable()

    Swal.fire({
      icon: "info",
      title: "OTP Authentication",
      text:
        "By cancelling the OTP request, the business page will not be activated. To activate it, please enter the OTP after clicking on Verify.",
      allowOutsideClick: false,
      showCancelButton: true,
      confirmButtonText: `Ok`,
      allowEscapeKey: false,
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(["landingPage/business"]);
      } else if (result.isDenied) {
        // Swal.fire('Changes are not saved', '', 'info')
      }
    });
  }

  showModal1(): void {
    this.postalCode = true;
  }



  hideModal1(): void {
    this.postalCodeModal.hide();
  }
  dara: any = {}

  onHidden1(): void {
    this.postalCode = false;
  }
  @ViewChild("businessNpi") userInput: ElementRef;
  workingHrpersent: boolean = false;
  constructor(
    private fb: UntypedFormBuilder,
    private route: ActivatedRoute,
    private api: ApiService,
    private commonvalues: CommonValues,
    private auth: AuthServiceService,
    private router: Router,
    private cookieService: CookieService,
    private modalService: BsModalService,
    private banner: BusinessBannerComponent,
    private el: ElementRef,
    private message: MessageService,
    private util: UtilService,
    private profilePhoto: ProfilePhoto,
    private aroute: ActivatedRoute,
    private previousRouteService: PreviousRouteService
  ) {
    super();
    this.clickEventsubscription = this.commonvalues
      .getbusinessid()
      .subscribe((res) => {
        this.values = res;
      });

    this.charCountEmitter = this.commonvalues.getCharCount().subscribe(res => {
      this.remainingCount = res.value
    })

    this.eventEmitter = this.commonvalues.getBusinessData().subscribe(res => {
      this.dara = res
    })

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

    var a = this.previousRouteService.getPreviousUrl();
    // this.datePickerConfig = Object.assign({},
    //   {
    //     containerClass : 'theme-dark-blue',
    //     dateInputFormat: 'MMM-YYYY',
    //     adaptivePosition: true
    //    })

  }
  // @Output() busLogo: String;

  // this.otp = true
  // this.isModalShown = true
  clientTypeList: any = []
  charCountEmitter: Subscription;
  clientType
  remainingCount: any;
  otherData: any;
  totalBusinessPercentage: number
  ngOnInit() {
    localStorage.setItem('busLogo', null)

    this.bnrPhoto();


    this.businessForm = this.fb.group({
      industryClassification: [null, Validators.compose([Validators.required])],
      businessOwner: [null],
      npiNo: [null],
      others: [null, [Validators.required]],
      facilityPracticeType: [null, [Validators.required]],
      businessName: [null, []],
      organizationType: [null, [Validators.required]],
      tagLine: [null, [Validators.pattern(this.TAG_LINE.pattern), CustomValidator.max(this.TAG_LINE.max)]],
      businessLogo: [null],
      businessBanner: [null],
      companyType: [null, Validators.compose([Validators.required])],
      offlineVerification: [false],
      yearStarted: [null, Validators.compose([Validators.required])],
      companySize: [null, Validators.compose([Validators.required])],
      tags: [null],
      aboutCompany: [null, CustomValidator.minmaxWords(this.ABOUT_COMPANY.min, this.ABOUT_COMPANY.max)], //[Validators.pattern(/^[^\s]+(\s+[^\s]+)*$/)]
      companyLocationDetails: this.fb.array([]),
      workingHours: this.fb.array([]),
      userSocialPresence: this.fb.array([]),
      serviceOptions: this.fb.array([]),
    });
    try {
      var formval: any = localStorage.getItem(this.userid + '_businessForm');
      formval = formval.slice(1, -1)

      var tempdata = CryptoJS.AES.decrypt(decodeURIComponent(formval), "secret key");
      var decrypt = JSON.parse(tempdata.toString(CryptoJS.enc.Utf8));

      if (formval != null || formval != undefined) {
        setTimeout(() => {
          if (decrypt.tags != null) {
            decrypt.tags.forEach(element => {
              this.tagSelectedItems.push(element);
            });
          }
          this.businessForm.patchValue(decrypt);
        }, 3500);

      }
    } catch (error) {
      localStorage.removeItem(this.userid + '_businessForm');
    }

    this.OTPConfirm = this.fb.group({
      otp: [null, [Validators.required, Validators.pattern(/^[^\s]*$/)]],
    });

    this.serviceTypeList = [];
    this.serviceSelectedItems = [];
    this.tagSelectedItems = [];
    this.insuranceSelectedItems = [];

    this.route.queryParams.subscribe((prevData) => {
    });
    this.util.startLoader();
    this.api.query("user/" + this.userId).subscribe((res) => {
      this.util.stopLoader();
      this.businessForm.patchValue({
        firstName: res.firstName,
        lastName: res.lastName,
        email: res.email,
      });
      localStorage.setItem("userName", res.email);
    }, err => {
      this.util.stopLoader();
    });

    this.getCountry();
    this.getStates();
    this.getInsuranceType()
    this.generateYears();
    this.addLocation();
    this.addWorkingHour();
    this.addSocialPresence();
    this.addServiceOptions();
    // this.getIndustryClass();
    this.getFacilityType();
    this.checkflag();
    this.queryParams();
    this.patchData();
    this.businessApiCall()
    this.companyLocationDetails.controls[0].get("city").disable();
    this.companyLocationDetails.controls[0].get("country").disable();
    this.companyLocationDetails.controls[0].get("state").disable();
    this.companyLocationDetails.controls[0].get("zipCode").disable();

    localStorage.setItem('businessId', this.otherData.businessId)
    this.businessForm.get('aboutCompany').valueChanges.subscribe(res => {
      const value: string = FormValidation.extractContent(this.businessForm.get('aboutCompany').value);
      console.log("business", value.length);
      if (value != "undefined") {
        this.remainingCharacters.next(this.ABOUT_COMPANY.max - (value && value.length));
      }
    });

    this.businessForm.markAsDirty()

    this.businessForm.valueChanges.subscribe(selectedValue => {
      // console.log("business form",selectedValue,'reqlfomr',this.businessForm.getRawValue(),"jsdhfksdjf-0>",this.businessForm);
      this.totalBusinessPercentage = 0

      const businessFormValue: BusinessModal = this.businessForm.getRawValue();

      this.totalBusinessPercentage = businessFormValue.industryClassification != null ? this.totalBusinessPercentage + 10 : this.totalBusinessPercentage;
      this.totalBusinessPercentage = businessFormValue.businessName != null ? this.totalBusinessPercentage + 10 : this.totalBusinessPercentage;
      this.totalBusinessPercentage = (selectedValue.tagLine != null && selectedValue.tagLine != "") ? this.totalBusinessPercentage + 5 : this.totalBusinessPercentage;
      this.totalBusinessPercentage = ($("#profileimage")[0].value != null && $("#profileimage")[0].value != "") ? this.totalBusinessPercentage + 10 : this.totalBusinessPercentage;
      this.totalBusinessPercentage = selectedValue.businessBanner != null ? this.totalBusinessPercentage + 5 : this.totalBusinessPercentage;
      this.totalBusinessPercentage = selectedValue.companyType != null ? this.totalBusinessPercentage + 5 : this.totalBusinessPercentage;
      this.totalBusinessPercentage = selectedValue.yearStarted != null ? this.totalBusinessPercentage + 5 : this.totalBusinessPercentage;
      this.totalBusinessPercentage = selectedValue.companySize != null ? this.totalBusinessPercentage + 5 : this.totalBusinessPercentage;
      this.totalBusinessPercentage = this.businessForm.controls.organizationType.value != null ? this.totalBusinessPercentage + 10 : this.totalBusinessPercentage;
      this.totalBusinessPercentage = (selectedValue.aboutCompany != null && FormValidation.extractContent(selectedValue.aboutCompany).length > 100) ? this.totalBusinessPercentage + 10 : this.totalBusinessPercentage;

      const companyDetails: CompanyLocationDetails = businessFormValue.companyLocationDetails[0];
      this.totalBusinessPercentage = (companyDetails.address1 != null && companyDetails.address1 != "") ? this.totalBusinessPercentage + 5 : this.totalBusinessPercentage;
      this.totalBusinessPercentage = (companyDetails.country && companyDetails.country!.length > 0 &&
        companyDetails.state && companyDetails.state!.length > 0 &&
        companyDetails.city && companyDetails.city!.length > 0 &&
        companyDetails.zipCode && companyDetails.zipCode!.length > 0) ? this.totalBusinessPercentage + 10 : this.totalBusinessPercentage;

      this.totalBusinessPercentage = companyDetails.businessPhone != null && companyDetails.businessPhone != "" ? this.totalBusinessPercentage + 5 : this.totalBusinessPercentage; this.totalBusinessPercentage = companyDetails.businessEmail != null ? this.totalBusinessPercentage + 5 : this.totalBusinessPercentage;
      this.totalBusinessPercentage = companyDetails.website != null ? this.totalBusinessPercentage + 5 : this.totalBusinessPercentage;

      const socialPresence: UserSocialPresence = selectedValue.userSocialPresence[0];

      let socialPresenceCount: number = 0;
      for (let key in socialPresence) {
        if (socialPresence[key] != null && socialPresence[key].length > 0) {
          socialPresenceCount = socialPresenceCount + 1;
        }
      }



      this.totalBusinessPercentage = (socialPresenceCount > 1) ? this.totalBusinessPercentage + 10 : this.totalBusinessPercentage;
      this.totalBusinessPercentage = (socialPresenceCount === 1) ? this.totalBusinessPercentage + 5 : this.totalBusinessPercentage;




    });

    const profileCompleteCall: { boolean: boolean } = {
      boolean: true
    }
    this.commonvalues.setProfo(profileCompleteCall);
  }

  businessApiCall() {
    this.api.query("business/details/" + this.otherData.businessId).subscribe(res => {
      if (!this.otherData.city) {
        this.companyLocationDetails.at(0).patchValue({
          city: res.data.businessModelList[0].companyLocationDetails[0].city,
          country: res.data.businessModelList[0].companyLocationDetails[0].country,
          state: res.data.businessModelList[0].companyLocationDetails[0].state,
          zipCode: res.data.businessModelList[0].companyLocationDetails[0].zipCode,
        });
        this.businessForm.patchValue({ organizationType: res.data.businessModelList[0].organizationType });
        this.businessForm.get('organizationType').disable();
      }
      this.companyLocationDetails.at(0).patchValue({
        locationId: res.data.businessModelList[0].companyLocationDetails[0].locationId,
      });



    });


  }


  checkSpace(event: any): boolean {
    return super.validSpace(event);
  }

  getInsuranceType() {
    this.util.startLoader();
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


  queryParams() {
    this.route.queryParams.subscribe((res) => {
      this.otherData = res;
    });
  }

  formValidity: boolean = false;
  onHidden2(): void {
    this.wplaceModalShown = false;
    this.formValidity = false;
  }

  chooseBusiness: UntypedFormGroup;
  get controlOfForms() {
    return this.chooseBusiness.controls;
  }

  hideModal2(): void {
    this.chooseBusinessModal.hide();
  }

  selectedAddress: any;
  onselecte(value) {
    this.selectedAddress = value.item;
  }

  clear() {
    this.selectedAddress = null;
  }

  patchThem() {

    this.formValidity = true;
    if (this.chooseBusiness.valid) {
      this.onHidden2();
      var phNo = this.selectedAddress.cellPhone.replace(/-/g, "");

      this.companyLocationDetails.controls[0].patchValue({
        address1: this.selectedAddress.address1,
        address2: this.selectedAddress.address2,
        zipCode: this.selectedAddress.zipCode,
        city: this.selectedAddress.city,
        state: this.selectedAddress.state,
        country: this.selectedAddress.country,
        street: this.selectedAddress.street,
        businessPhone: phNo,
        website: this.selectedAddress.website,
      });
      this.companyLocationDetails.controls[0].get("website").markAsTouched();
      this.companyLocationDetails.controls[0]
        .get("website")
        .updateValueAndValidity();
      this.companyLocationDetails.controls[0]
        .get("businessEmail")
        .markAsTouched();
      this.companyLocationDetails.controls[0]
        .get("businessEmail")
        .updateValueAndValidity();
    }
    if (
      this.selectedAddress.website == null ||
      this.selectedAddress.website == ""
    ) {
      this.companyLocationDetails.controls[0].get("website").markAsUntouched();
      this.companyLocationDetails.controls[0].get("website").markAsPristine();
      this.companyLocationDetails.controls[0]
        .get("website")
        .updateValueAndValidity();
      this.companyLocationDetails.controls[0]
        .get("businessEmail")
        .markAsUntouched();
      this.companyLocationDetails.controls[0]
        .get("businessEmail")
        .markAsPristine();
      this.companyLocationDetails.controls[0]
        .get("businessEmail")
        .updateValueAndValidity();
    }
  }

  filterNo(event: any) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }



  organizationList: any;
  @ViewChild("chooseBusinessModal")
  chooseBusinessModal: ModalDirective;
  wplaceModalShown = false;
  onEnterNpiNo(event: any) {
    if (event.target.value != "") {
      var a = event.target.value;
      this.util.startLoader();
      this.api.query("business/npiRegistry/" + a).subscribe((res) => {
        if (res.code == "00000") {
          this.util.stopLoader();
          if (res.data == null) {
            this.businessForm.controls.npiNo.setErrors({ incorrectNPI: true });
          } else if (res.data.npidata.length > 1) {
            this.businessForm.controls.npiNo.setErrors(null);
            this.wplaceModalShown = true;
            this.organizationList = res.data.npidata;
            this.chooseBusiness = this.fb.group({
              address1: [null, [Validators.required, Validators.pattern(/^[ A-Za-z0-9_@./#&+-]*$/)]],
            });
          } else if (res.data.npidata.length == 1) {
            this.businessForm.controls.npiNo.setErrors(null);
            this.companyLocationDetails.controls[0].patchValue({
              address1: res.data.npidata.address1,
              address2: res.data.npidata.address2,
              zipCode: res.data.npidata.zipCode,
              city: res.data.npidata.city,
              state: res.data.npidata.state,
              country: res.data.npidata.country,
              street: res.data.npidata.street,
              businessPhone: res.data.npidata.cellPhone,
              website: res.data.npidata.website,
            });
          }
        } else {
          this.util.stopLoader();
        }
      }, err => {
        this.util.stopLoader();
      });
    }
  }

  codeOffline(event) {
    if (event.target.checked == true) {
      this.businessForm.patchValue({ offlineVerification: true });
      var a = this.companyLocationDetails.value[0].headquarters;
      this.companyLocationDetails.controls[0].patchValue({ headquarters: a });
      this.postalCode = true;
      // this.businessForm.get('offlineVerification').updateValueAndValidity()
      // CustomValidator.validateEmailDomain(null,null,this.businessForm.controls)
    } else if (event.target.checked == false) {
      this.businessForm.patchValue({ offlineVerification: false });
      var a = this.companyLocationDetails.value[0].headquarters;
      this.companyLocationDetails.controls[0].patchValue({ headquarters: a });
    }
  }

  hrOtherDay(event) {
    this.workingHours.controls.forEach((ele) => {
      ele.get("applyAll").patchValue(false);
    });
  }

  restrictedIndex: boolean = false
  patchData() {

    if (this.otherData.organizationType && this.otherData.organizationType != null) {
      // console.log("this.otherData")
      // console.log(this.otherData)
      if (this.otherData.organizationType == 'Client' || this.otherData.organizationType == 'Direct Client') {
        var data: any = { "domain": "ENGAGEMENT_TYPE,CLIENT_TYPE,GIGSUMO_JOB_TITLE,GIGSUMO_INDUSTRY_CLASSIFICATION" }
        this.api.create('listvalue/findbyList', data).subscribe(res => {
          console.log("this got called 1")
          if (res.code == '00000') {
            res.data.CLIENT_TYPE.listItems.forEach(ele => {
              // if (ele.item == 'Direct Client') {
              //   ele.item = "Client";
              // }
              this.clientTypeList.push(ele.item);
            })
            this.clientTypeList.push('Supplier')

            res.data.GIGSUMO_INDUSTRY_CLASSIFICATION.listItems.forEach(ele => {
              this.industryType.push(ele.item)
            })

            // res.data.GIGSUMO_RECRUITERS_TITLE_LIST.listItems.forEach(ele => {
            //   this.recruiterTitleList.push(ele.item)
            // })

            if (this.clientTypeList.length != 0) {
              this.businessForm.patchValue({
                organizationType: this.otherData.organizationType
              })
            }
          }
        })

      } else {
        var data: any = { "domain": "ENGAGEMENT_TYPE,CLIENT_TYPE,GIGSUMO_JOB_TITLE,GIGSUMO_INDUSTRY_CLASSIFICATION" }
        this.api.create('listvalue/findbyList', data).subscribe(res => {
          console.log("this got called 2")
          if (res.code == '00000') {
            res.data.CLIENT_TYPE.listItems.forEach(ele => {
              this.clientTypeList.push(ele.item);
              // if (ele.item == 'Direct Client') {
              //   ele.item = "Client";
              // }
            })
            this.clientTypeList.push('Supplier')

            res.data.GIGSUMO_INDUSTRY_CLASSIFICATION.listItems.forEach(ele => {
              this.industryType.push(ele.item)
            })

            // res.data.GIGSUMO_RECRUITERS_TITLE_LIST.listItems.forEach(ele => {
            //   this.recruiterTitleList.push(ele.item)
            // })

            if (this.clientTypeList.length != 0) {
              this.businessForm.patchValue({
                organizationType: this.otherData.organizationType
              })
            }
          }
        })

      }
      this.businessForm.get("organizationType").disable();
    } else {
      console.log("passing through this one alright 111")
      var data: any = { "domain": "ENGAGEMENT_TYPE,CLIENT_TYPE,GIGSUMO_JOB_TITLE,GIGSUMO_INDUSTRY_CLASSIFICATION" }
      this.api.create('listvalue/findbyList', data).subscribe(res => {
        console.log("this got called 3")
        if (res.code == '00000') {
          res.data.CLIENT_TYPE.listItems.forEach(ele => {
            // if ((this.otherData.organizationType == 'Client' || this.otherData.organizationType == 'Direct Client') && ele.item == 'Direct Client') {
            //   ele.item = 'Client'
            // }
            this.clientTypeList.push(ele.item);
          })
          this.clientTypeList.push('Supplier')
          res.data.GIGSUMO_INDUSTRY_CLASSIFICATION.listItems.forEach(ele => {
            this.industryType.push(ele.item)
          })

          // res.data.GIGSUMO_RECRUITERS_TITLE_LIST.listItems.forEach(ele => {
          //   this.recruiterTitleList.push(ele.item)
          // })
        }
      })
      this.businessForm.get("organizationType").enable();
    }
    this.businessForm.patchValue({
      businessName: this.otherData.businessName,
    });
    // if user is trying create anothe rbusiness page for the same organzation
    // fields are enabled for data input



    if (this.otherData.value) {
      this.companyLocationDetails.controls[0].get("city").enable();
      this.companyLocationDetails.controls[0].get("country").enable();
      this.companyLocationDetails.controls[0].get("state").enable();
      this.companyLocationDetails.controls[0].get("zipCode").enable();
      this.companyLocationDetails.controls[0].get("street").enable();
      this.companyLocationDetails.controls[0].get("website").disable();
      this.businessForm.get("industryClassification").disable();
      this.businessForm.get("facilityPracticeType").disable();
    } else {

      let result = localStorage.getItem('userName').indexOf("@");
      let totallength = localStorage.getItem('userName').length
      let domain = localStorage.getItem('userName').substring(result + 1, totallength);
      let domainnew = "www." + domain;

      this.restrictedIndex = true
      this.companyLocationDetails.controls[0].patchValue({
        city: this.otherData.city,
        country: this.otherData.country,
        state: this.otherData.state,
        website: domainnew,
        street: "",
        zipCode: this.otherData.zipCode,
        primary: true,
      });



      if (this.otherData.city == null) {
        this.companyLocationDetails.controls[0].get("city").enable();
        this.companyLocationDetails.controls[0].get("country").enable();
        this.companyLocationDetails.controls[0].get("state").enable();
        this.companyLocationDetails.controls[0].get("zipCode").enable();
        this.companyLocationDetails.controls[0].get("website").enable();
      }

      // this.companyLocationDetails.controls[0].get('street').disable()
    }
    var businessProfileId = localStorage.getItem("businessProfileId");
    if (
      businessProfileId != null &&
      businessProfileId != "" &&
      businessProfileId != undefined
    ) {
      this.companyLocationDetails.controls[0].get("city").disable();
      this.companyLocationDetails.controls[0].get("country").disable();
      this.companyLocationDetails.controls[0].get("state").disable();
      this.companyLocationDetails.controls[0].get("zipCode").disable();
      this.companyLocationDetails.controls[0].get("website").disable();
    }

    // reference id api call for api call patch all value
    if (
      this.otherData.referenceId != undefined &&
      this.otherData.referenceId != null
    ) {
      this.logo = true;
      this.util.startLoader();
      this.api
        .query("business/details/" + this.otherData.referenceId)
        .subscribe((res) => {
          this.util.stopLoader();
          this.photoId = res.data.businessModelList[0].businessLogo;
          // this.busLogo = this.photoId
          localStorage.setItem('busLogo', this.photoId)
          this.img = { src: AppSettings.photoUrl + res.data.businessModelList[0].businessLogo };

          this.dara.businessLogo = this.img.src
          this.commonvalues.setBusinessData(this.dara)

          this.businessForm.get("businessLogo").disable();
          // this.businessForm.removeControl('businessLogo')
          if (res.data.businessModelList[0].industryClassification == "MEDICAL_HEALTHCARE_PRACTICE") {
            this.hCareFlag = true;
            this.otherFlag = false;
            this.onChngFacility(res.data.businessModelList[0].industryClassification);

            this.businessForm
              .get("facilityPracticeType")
              .setValue(res.data.businessModelList[0].facilityPracticeType);
          }

          this.companyLocationDetails.controls = [];
          if (
            res.data.businessModelList[0].companyLocationDetails != null &&
            res.data.businessModelList[0].companyLocationDetails != ""
          ) {
            res.data.businessModelList[0].companyLocationDetails.forEach((e, i) => {
              e.address1 = "";
              e.address2 = "";
              e.country = "";
              e.zipCode = "";
              e.state = "";
              e.city = "";
              e.street = "";
              var getindex = parseInt(i);
              if (getindex == 0) {
                e.primary = true;
                this.companyLocationDetails.push(this.createLocation());
              }
            });
          } else {
            this.companyLocationDetails.push(this.createLocation());
          }
          var workinghours = [];
          var userSocialPresencearr = [];
          var serviceOptionss = [];
          workinghours.push(res.data.businessModelList[0].workingHours);
          userSocialPresencearr.push(res.data.businessModelList[0].userSocialPresence);
          serviceOptionss.push(res.data.businessModelList[0].serviceOptions);
          res.data.businessModelList[0].workingHours = workinghours;
          res.data.businessModelList[0].userSocialPresence = userSocialPresencearr;
          res.data.businessModelList[0].serviceOptions = serviceOptionss;
          res.data.businessModelList[0].companyLocationDetails;
          this.businessForm.patchValue(res.data.businessModelList[0]);
        }, err => {
          this.util.stopLoader();
        });
    }

    this.api
      .query("user/" + localStorage.getItem("userId"))
      .subscribe((res) => {
        if (res.profileId) {
          if (
            res.profileId != null &&
            res.profileId != "" &&
            res.profileId != undefined
          ) {
            this.getDirBusinessDetail(res.profileId);
          }
        }
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

  getDirBusinessDetail(organisationId) {
    this.util.startLoader();
    this.api
      .query("healthcare/hcp/organization/" + organisationId)
      .subscribe((res) => {
        this.util.stopLoader();
        if (res != null) {
          if (res.code == "00000") {
            //// console.log("res.data.hcporganization");
            //// console.log(res.data.hcporganization);
            if (
              res.data.hcporganization != null &&
              res.data.hcporganization != undefined
            ) {
              this.businessForm.patchValue({
                npiNo: res.data.hcporganization.npiNo,
              });
              this.businessForm.get("npiNo").disable();
              let event = new KeyboardEvent("keyup", { bubbles: true });
              this.userInput.nativeElement.dispatchEvent(event);
            }
          }
        }
      }, err => {
        this.util.stopLoader();
      });
  }

  bnrPhoto() {
    var us: any = localStorage.getItem("userId");
    this.api.query("user/" + us).subscribe((res) => {
      if (res.photo != null && res.photo != undefined && res.photo != "") {
        this.profilePhoto.setBusinessBannerPhoto(res.photo);
      } else if (
        res.photo == null ||
        res.photo == undefined ||
        res.photo == ""
      ) {
        this.profilePhoto.setBusinessBannerPhoto(null);
      }
    }, err => {
      this.util.stopLoader();
    });
  }

  generateYears() {
    var max = new Date().getFullYear();
    var min = max - 150;
    for (var i = min; i <= max; i++) {
      this.years.push(i);
      this.years = this.years.sort((a, b) => b - a);
    }
  }

  public noWhitespaceValidator(control: UntypedFormControl) {
    const isWhitespace = (control.value || "").trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
  }

  public comChecker(control: UntypedFormControl) {
    const isCom =
      control.value[-3] + control.value[-2] + control.value[-1] ===
      /^([a-z0-9]{5,})$/.test("com");
    const isValid = !isCom;
    return isValid ? null : { comCheck: true };
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

  // getIndustryClass() {
  //   var data = { 'domain': 'GIGSUMO_JOB_TITLE,GIGSUMO_INDUSTRY_CLASSIFICATION' }
  //   this.api.create('listvalue/findbyList', data).subscribe(res => {
  //     console.log("this got called 4")
  //     if (res.code == '00000') {
  //       this.util.stopLoader()
  //       res.data.GIGSUMO_INDUSTRY_CLASSIFICATION.listItems.forEach(ele => {
  //         this.industryType.push(ele.item)
  //       })

  //       // res.data.GIGSUMO_RECRUITERS_TITLE_LIST.listItems.forEach(ele => {
  //       //   this.recruiterTitleList.push(ele.item)
  //       // })
  //     }
  //   })
  // }

  tue(event) {
    if (event.target.checked == false) {
      this.workingHrpersent = false

      this.workingHours.controls.forEach((ele) => {
        ele.get("tueFromTime").clearValidators();
        ele.get("tueFromTime").updateValueAndValidity();
        ele.get("tueToTime").clearValidators();
        ele.get("tueToTime").updateValueAndValidity();
        ele.get("tueFromTime").setValue(null);
        ele.get("tueToTime").setValue(null);
        ele.get("applyAll").setValue(false);
      });
      this.checkdays();
    } else if (event.target.checked == true) {
      this.workingHrpersent = true

      this.workingHours.controls.forEach((ele) => {
        ele.get("tueFromTime").setValidators([Validators.required]);
        ele.get("tueFromTime").updateValueAndValidity();
        ele.get("tueToTime").setValidators([Validators.required]);
        ele.get("tueToTime").updateValueAndValidity();
      });
    }
  }

  wed(event) {
    if (event.target.checked == false) {
      this.workingHrpersent = false
      this.workingHours.controls.forEach((ele) => {
        ele.get("wedFromTime").clearValidators();
        ele.get("wedFromTime").updateValueAndValidity();
        ele.get("wedToTime").clearValidators();
        ele.get("wedToTime").updateValueAndValidity();
        ele.get("wedFromTime").setValue(null);
        ele.get("wedToTime").setValue(null);
        ele.get("applyAll").setValue(false);
      });
      this.checkdays();
    } else if (event.target.checked == true) {
      this.workingHrpersent = true
      this.workingHours.controls.forEach((ele) => {
        ele.get("wedToTime").setValidators([Validators.required]);
        ele.get("wedToTime").updateValueAndValidity();
        ele.get("wedFromTime").setValidators([Validators.required]);
        ele.get("wedFromTime").updateValueAndValidity();
      });
    }
  }

  thu(event) {
    if (event.target.checked == false) {
      this.workingHrpersent = false
      this.workingHours.controls.forEach((ele) => {
        ele.get("thrFromTime").clearValidators();
        ele.get("thrFromTime").updateValueAndValidity();
        ele.get("thrToTime").clearValidators();
        ele.get("thrToTime").updateValueAndValidity();
        ele.get("thrFromTime").setValue(null);
        ele.get("thrToTime").setValue(null);
        ele.get("applyAll").setValue(false);
      });

      this.checkdays();
    } else if (event.target.checked == true) {
      this.workingHrpersent = true

      this.workingHours.controls.forEach((ele) => {
        ele.get("thrFromTime").setValidators([Validators.required]);
        ele.get("thrFromTime").updateValueAndValidity();
        ele.get("thrToTime").setValidators([Validators.required]);
        ele.get("thrToTime").updateValueAndValidity();
      });
    }
  }

  fri(event) {
    if (event.target.checked == false) {
      this.workingHrpersent = false

      this.workingHours.controls.forEach((ele) => {
        ele.get("friFromTime").clearValidators();
        ele.get("friFromTime").updateValueAndValidity();
        ele.get("friToTime").clearValidators();
        ele.get("friToTime").updateValueAndValidity();
        ele.get("friFromTime").setValue(null);
        ele.get("friToTime").setValue(null);
        ele.get("applyAll").setValue(false);
      });
      this.checkdays();
    } else if (event.target.checked == true) {
      this.workingHrpersent = true

      this.workingHours.controls.forEach((ele) => {
        ele.get("friFromTime").setValidators([Validators.required]);
        ele.get("friFromTime").updateValueAndValidity();
        ele.get("friToTime").setValidators([Validators.required]);
        ele.get("friToTime").updateValueAndValidity();
      });
    }
  }

  getHourFormGroup(index: any): UntypedFormGroup {
    return this.workingHours.controls[index] as UntypedFormGroup;;
  }

  sat(event) {
    if (event.target.checked == false) {
      this.workingHrpersent = false

      this.workingHours.controls.forEach((ele) => {
        ele.get("satFromTime").clearValidators();
        ele.get("satFromTime").updateValueAndValidity();
        ele.get("satToTime").clearValidators();
        ele.get("satToTime").updateValueAndValidity();
        ele.get("satFromTime").setValue(null);
        ele.get("satToTime").setValue(null);
        ele.get("applyAll").setValue(false);
      });
      this.checkdays();
    } else if (event.target.checked == true) {
      this.workingHrpersent = true

      this.workingHours.controls.forEach((ele) => {
        ele.get("satFromTime").setValidators([Validators.required]);
        ele.get("satFromTime").updateValueAndValidity();
        ele.get("satToTime").setValidators([Validators.required]);
        ele.get("satToTime").updateValueAndValidity();
      });
    }
  }

  sun(event) {
    if (event.target.checked == false) {
      this.workingHrpersent = false

      this.workingHours.controls.forEach((ele) => {
        ele.get("sunFromTime").clearValidators();
        ele.get("sunFromTime").updateValueAndValidity();
        ele.get("sunToTime").clearValidators();
        ele.get("sunToTime").updateValueAndValidity();
        ele.get("sunFromTime").setValue(null);
        ele.get("sunToTime").setValue(null);
        ele.get("applyAll").setValue(false);
      });
      this.checkdays();
    } else if (event.target.checked == true) {
      this.workingHrpersent = true

      this.workingHours.controls.forEach((ele) => {
        ele.get("sunFromTime").setValidators([Validators.required]);
        ele.get("sunFromTime").updateValueAndValidity();
        ele.get("sunToTime").setValidators([Validators.required]);
        ele.get("sunToTime").updateValueAndValidity();
      });
    }
  }

  checkdays() {
    this.workingHourArray.controls.forEach((ele) => {
      if (
        ele.get("tueWorking").value == false &&
        ele.get("wedWorking").value == false &&
        ele.get("thrWorking").value == false &&
        ele.get("friWorking").value == false &&
        ele.get("satWorking").value == false &&
        ele.get("sunWorking").value == false
      ) {
        ele.get("applyAll").setValue(false);
      }
    });
  }

  trimValidator: ValidatorFn = (control: UntypedFormControl) => {
    if (this.businessForm.value.businessName.startsWith(" ")) {
      return {
        trimError: { value: "control has leading whitespace" },
      };
    }
    if (this.businessForm.value.businessName.endsWith(" ")) {
      return {
        trimError: { value: "control has trailing whitespace" },
      };
    }
    return null;
  };

  curOrg(event, index) {
    if (event.target.checked == true) {
      this.currentIndex = index;
    } else if (event.target.checked == false) {
      this.currentIndex = null;
    }
  }

  // primaryIndex: boolean = false
  primaryIndex: any = null;

  keepPrimary(event, index) {
    if (event.target.checked == true) {
      this.primaryIndex = index;
      this.companyLocationDetails.controls[index].patchValue({ primary: true })
    } else if (event.target.checked == false) {
      this.primaryIndex = null;
      this.companyLocationDetails.controls[index].patchValue({ primary: false })
    }
  }

  collapses() { }

  expands() { }
  collapsed() {
    // //// console.log("collapsed")
    this.physicianArray.reset();
  }

  notApplicable(event) {
    if (event.target.checked == true) {
      // //// console.log(this.isCollapsed)
      this.isCollapsed = !this.isCollapsed;
      this.physicianArray.reset();
    } else if (event.target.checked == false) {
      // //// console.log(this.isCollapsed)
      this.isCollapsed = !this.isCollapsed;
      this.serviceArray.controls.forEach((ele) => {
        ele.get("medicareCertified").setValue(false);
        ele.get("acceptingNewPatients").setValue(false);
        ele.get("privatePayAccepted").setValue(false);
      });
    }
  }

  expanded() {
    // //// console.log("expanded")
  }

  onChngFacility(event) {
    // //// console.log("sakdhfsjgh")
    // //// console.log(event)
    if (event == "Skilled Nursing Facility") {
      // this.util.startLoader()
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
    } else if (event == "Home Care") {
      // this.util.startLoader()
      this.api
        .query("care/list/values/HOME_CARE_SERVICE_TYPE")
        .subscribe((res) => {
          // this.util.stopLoader()
          this.serviceTypeList = [];
          this.accreditionValue = [];
          if (res.listItems != null) {
            res.listItems.forEach((ele) => {
              this.serviceTypeList.push(ele.item);
            });
          }
        }, err => {
          this.util.stopLoader();
        });
    } else if (event == "Home Heathcare Agency") {
      // this.util.startLoader()
      this.api.query("care/list/values/HHA_SERVICE_TYPE").subscribe((res) => {
        this.serviceTypeList = [];
        if (res.listItems != null) {
          res.listItems.forEach((ele) => {
            this.serviceTypeList.push(ele.item);
          });
        }
        // //// console.log("This is service type lst")
        // //// console.log(this.serviceTypeList)
      }, err => {
        this.util.stopLoader();
      });

      this.api.query("care/list/values/HHA_ACCREDITION").subscribe((res) => {
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
    } else if (event == "Hospice") {
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
    } else if (event == "Pharmacy") {
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
          //this.util.stopLoader()
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
      //   this.util.startLoader()
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
        //    this.util.stopLoader()
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
      //  this.util.stopLoader()
      this.serviceTypeList = [];
      this.accreditionValue = [];
    }
  }

  get userControl() {
    return this.businessForm.controls;
  }

  get socialPresenceArray() {
    return this.businessForm.get("userSocialPresence") as UntypedFormArray;
  }

  get locationArray() {
    return this.businessForm.get("companyLocationDetails") as UntypedFormArray;
  }

  get physicianArray() {
    return this.businessForm.get("serviceOptions") as UntypedFormArray;
  }

  createLocation(): UntypedFormGroup {
    let result = localStorage.getItem('userName').indexOf("@");
    let totallength = localStorage.getItem('userName').length
    let domain = localStorage.getItem('userName').substring(result + 1, totallength);
    let domainnew = "www." + domain;

    return this.fb.group(
      {
        locationId: '',
        primary: [false],
        address1: ["", Validators.compose([Validators.required, CustomValidator.checkWhiteSpace(), CustomValidator.max(this.BUSINESS_ADDRESS.max)])],
        address2: [""],
        zipCode: [
          "",
          Validators.compose([
            Validators.required, CustomValidator.minmaxLetters(this.ZIPCODE.min, this.ZIPCODE.max)
          ]),
        ],
        city: [null, [Validators.required, CustomValidator.max(this.CITY.max)]],
        state: ["", [Validators.required, CustomValidator.max(this.STATE.max)]],
        country: ["", [Validators.required]],
        street: [null], // [Validators.required]
        headquarters: [false],
        businessPhone: [
          null,
          Validators.compose([
            Validators.required,
            CustomValidator.minmaxLetters(this.BUSINESS_PHONE.min, this.BUSINESS_PHONE.max),
            Validators.pattern(this.BUSINESS_PHONE.pattern),
          ]),
        ],
        cellPhone: [
          "",
          Validators.compose([
            Validators.maxLength(10),
            Validators.pattern(/^[0-9]*$/),
          ]),
        ],
        businessEmail: [
          localStorage.getItem('userName'),
          Validators.compose([Validators.required, Validators.email]),
        ],
        website: [domainnew, Validators.compose([
          Validators.required,
        ]),
        ], //,this.noWhitespaceValidator
        // website: ['', Validators.compose([Validators.required, Validators.pattern(/^\S*$/)])], //,this.noWhitespaceValidator
      },
      {
        validators: CustomValidator.validateEmailDomain(
          "website",
          "businessEmail",
          this.businessForm.controls
        ),
      }
    );
  }

  createSocialPresence(): UntypedFormGroup {
    return this.fb.group({
      twitter: [null, Validators.pattern(this.SOCIAL_LINK.pattern)],
      linkedin: [null, Validators.pattern(this.SOCIAL_LINK.pattern)],
      facebook: [null, Validators.pattern(this.SOCIAL_LINK.pattern)],
      blogURL: [null, Validators.pattern(this.SOCIAL_LINK.pattern)],
      alternamePageLink: [null, Validators.pattern(this.SOCIAL_LINK.pattern)],
    });
  }

  createServiceOptions(): UntypedFormGroup {
    return this.fb.group({
      conditionCreated: [null],
      insuranceAccepted: [null],
      applicable: [null],
      // licencedState: [null],
      // countryService: [null],
      accredition: [null],
      serviceType: [null],
      medicareCertified: [false],
      acceptingNewPatients: [false],
      privatePayAccepted: [false],
    });
  }

  addServiceOptions() {
    this.serviceOptions = this.businessForm.get("serviceOptions") as UntypedFormArray;
    this.serviceOptions.push(this.createServiceOptions());
  }

  addSocialPresence() {
    this.userSocialPresence = this.businessForm.get(
      "userSocialPresence"
    ) as UntypedFormArray;
    this.userSocialPresence.push(this.createSocialPresence());
    // console.log("sdsds",this.userSocialPresence);

  }

  addLocation() {
    this.companyLocationDetails = this.businessForm.get(
      "companyLocationDetails"
    ) as UntypedFormArray;
    this.companyLocationDetails.push(this.createLocation());
  }

  locationSubmit: boolean = false
  removeLocation(index) {
    if (index == "0" && this.companyLocationDetails.length == 1) {

      if (this.restrictedIndex == true) {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Oops...",
          text: "Sorry, you can't delete this business location as this is your current organization.",
          // text: 'Employee added successfully',
          showConfirmButton: false,
          timer: 6000,
        });
      } else {
        this.locationSubmit = false
        this.locationArray.reset();
        this.checkHeadquarters();
        this.checkPrimary()
      }
    } else if (index == "0" && this.companyLocationDetails.length > 1) {
      if (this.restrictedIndex == true) {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Oops...",
          text: "Sorry, you can't delete this business location as this is your current organization.",
          // text: 'Employee added successfully',
          showConfirmButton: false,
          timer: 6000,
        });
      } else {
        this.locationSubmit = false
        this.companyLocationDetails.removeAt(index);
        this.checkHeadquarters();
        this.checkPrimary()
      }
    } else if (index > 0) {
      this.companyLocationDetails.removeAt(index);
      this.checkHeadquarters();
      this.checkPrimary();
    }
  }

  checkHeadquarters() {
    var array: any = [];
    this.companyLocationDetails.controls.forEach((ele) => {
      array.push(ele.get("headquarters").value);
    });
    var a = array.findIndex((x) => x == true);
    if (a == "-1") {
      this.currentIndex = null;
    }
  }

  checkPrimary() {
    var array: any = [];
    this.companyLocationDetails.controls.forEach((ele) => {
      array.push(ele.get("primary").value);
    });
    var a = array.findIndex((x) => x == true);
    if (a == "-1") {
      this.primaryIndex = null;
    }
  }

  removeHours(index) {
    return this.companyLocationDetails.removeAt(index);
  }

  get serviceArray() {
    return this.businessForm.get("serviceOptions") as UntypedFormArray;
  }

  get workingHourArray() {
    return this.businessForm.get("workingHours") as UntypedFormArray;
  }

  createWorkingHour(): UntypedFormGroup {
    return this.fb.group({
      // dothis: [null],
      monFromTime: [null],
      monToTime: [null],
      monWorking: [false],
      applyAll: [false],
      tueFromTime: [null],
      tueToTime: [null],
      tueWorking: [false],
      wedFromTime: [null],
      wedToTime: [null],
      wedWorking: [false],
      thrFromTime: [null],
      thrToTime: [null],
      thrWorking: [false],
      friFromTime: [null],
      friToTime: [null],
      friWorking: [false],
      satFromTime: [null],
      satToTime: [null],
      satWorking: [false],
      sunFromTime: [null],
      sunToTime: [null],
      sunWorking: [false],
    });
  }

  addWorkingHour() {
    this.workingHours = this.businessForm.get("workingHours") as UntypedFormArray;
    this.workingHours.push(this.createWorkingHour());
  }

  getPhysicianFormGroup(index: any): UntypedFormGroup {
    const formGroup = this.serviceOptions.controls[index] as UntypedFormGroup;
    return formGroup;
  }

  getLocationFormgroup(index: any): UntypedFormGroup {
    const formGroup = this.companyLocationDetails.controls[index] as UntypedFormGroup;
    return formGroup;
  }

  getworkingForm(index: any): UntypedFormGroup {
    const formGroup = this.workingHours.controls[index] as UntypedFormGroup;
    return formGroup;
  }

  getCompanyType() {
    this.companyTypeList = [];
    this.util.startLoader();
    this.api.query("country/getAllCountries").subscribe((res) => {
      this.util.stopLoader();
      res.forEach((ele) => {
        this.companyTypeList.push(ele);
      });
    }, err => {
      this.util.stopLoader();
    });
  }

  getCountry() {
    this.countryList = [];
    this.util.startLoader();
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

  public clearValidators(field) {
    this.businessForm.get(field).clearValidators();
    this.businessForm.get(field).updateValueAndValidity();
  }

  clearformData() {
    this.businessForm.reset();
  }

  getValidity(i) {
    return (<UntypedFormArray>this.businessForm.get("companyLocationDetails"))
      .controls[i].invalid;
  }
  userid = localStorage.getItem('userId')
  save() {
    localStorage.removeItem(this.userid + '_businessForm');
    this.submit = true;
    this.locationSubmit = true
    var busProfId = localStorage.getItem("businessProfileId");
    if (this.hCareFlag == false) {
      this.clearValidators("facilityPracticeType");
    }
    if (this.otherFlag == false) {
      this.clearValidators("others");
    }

    if (this.companyLocationDetails.length == 1) {
      this.companyLocationDetails.controls[0].patchValue({ primary: true })
    } else if (this.companyLocationDetails.length > 1) {
      var a = this.businessForm.value.companyLocationDetails.findIndex(x => (x.primary == true))
      //// console.log(a)
      if (a == "-1") {
        this.companyLocationDetails.controls.forEach(ele => {
          ele.get("primary").setValidators([Validators.requiredTrue])
          ele.get("primary").updateValueAndValidity()
        })
      } else if (a != "-1") {
        //// console.log("pasinf here")
        this.companyLocationDetails.controls.forEach(ele => {
          ele.get("primary").clearValidators()
          ele.get("primary").updateValueAndValidity()
        })
      }
    }

    if (
      this.businessForm.value.aboutCompany != undefined &&
      this.businessForm.value.aboutCompany != null &&
      this.businessForm.value.aboutCompany != ""
    ) {
      this.aboutCompany = this.businessForm.value.aboutCompany;
    }
    if (
      this.businessForm.value.tags == undefined &&
      this.businessForm.value.tags == null &&
      this.businessForm.value.tags == ""
    ) {
      this.jsonData.tags = this.jsonData.tags;
    } else {
      this.jsonData.tags = this.businessForm.value.tags;
    }
    this.jsonData.userId = this.userId;

    // var division = this.businessForm.controls['businessName'].value.trim();
    // if(division!=null){
    //  this.businessForm.controls['businessName'].setValue(division);

    if (this.businessForm.valid) {
      let currentAddressvalidate: any;
      // var index = this.companyLocationDetails.getRawValue().findIndex(p => p.primary == true);
      // //// console.log(this.businessForm.value.companyLocationDetails);
      // var index = this.businessForm.value.companyLocationDetails.findIndex(p => p.primary == true);
      var index = 0;

      this.companyLocationDetails.controls[index].get("city").enable();
      this.companyLocationDetails.controls[index].get("country").enable();
      this.companyLocationDetails.controls[index].get("state").enable();
      this.companyLocationDetails.controls[index].get("zipCode").enable();
      this.companyLocationDetails.controls[index].get("street").enable();

      let currentindex = this.businessForm.value.companyLocationDetails[index];
      currentAddressvalidate =
        currentindex.address1 +
        "," +
        currentindex.street +
        "," +
        currentindex.city +
        "," +
        currentindex.state +
        "," +
        currentindex.country +
        "," +
        currentindex.zipCode;

      if (
        this.otherData.referenceId != undefined &&
        this.otherData.referenceId != null
      ) {
        this.companyLocationDetails.controls[index].get("city").enable();
        this.companyLocationDetails.controls[index].get("country").enable();
        this.companyLocationDetails.controls[index].get("state").enable();
        this.companyLocationDetails.controls[index].get("zipCode").enable();
      } else {
        this.companyLocationDetails.controls[index].get("city").disable();
        this.companyLocationDetails.controls[index].get("country").disable();
        this.companyLocationDetails.controls[index].get("state").disable();
        this.companyLocationDetails.controls[index].get("zipCode").disable();
      }

      // this.businessForm.get('companyLocationDetails').controls[i].invalid
      this.businessForm.get("businessName").enable();
      this.disavow = true;
      // //// console.log("The form is valid")
      this.businessForm.get("industryClassification").enable();
      this.businessForm.get("facilityPracticeType").enable();

      this.jsonData.industryClassification =
        this.businessForm.value.industryClassification;
      this.jsonData.facilityPracticeType =
        this.businessForm.value.facilityPracticeType;

      this.businessForm.get("industryClassification").disable();
      this.businessForm.get("facilityPracticeType").disable();

      this.jsonData.others = this.businessForm.value.others;
      this.jsonData.npiNo = this.businessForm.getRawValue().npiNo;
      this.jsonData.businessLogo = this.photoId;
      // this.busLogo = this.photoId
      localStorage.setItem('busLogo', this.photoId)
      this.jsonData.aboutCompany = this.aboutCompany;
      this.jsonData.offlineVerification =
        this.businessForm.value.offlineVerification;
      this.jsonData.businessName = this.businessForm.value.businessName;
      this.jsonData.tagLine = this.businessForm.value.tagLine;
      if (busProfId != null && busProfId != undefined && busProfId != "") {
        this.jsonData.profileId = busProfId;
      } else {
        this.jsonData.profileId = null;
      }
      // this.jsonData.tags = this.tags
      this.jsonData.organizationType = this.otherData.organizationType;
      this.jsonData.businessBanner = this.businessForm.value.businessBanner;
      this.jsonData.companyType = this.businessForm.value.companyType;
      this.jsonData.yearStarted = this.businessForm.value.yearStarted;
      this.jsonData.companySize = this.businessForm.value.companySize;

      this.businessForm.value.serviceOptions.forEach((element) => {
        this.phyData.conditionCreated = element.conditionCreated;
        this.phyData.applicable = this.applicable;

        // //// console.log(element.accredition.length);
        // //// console.log(element.accredition);

        if (element.accredition != null && element.accredition != undefined) {
          this.phyData.accredition = element.accredition;
        }
        this.phyData.insuranceAccepted = element.insuranceAccepted;
        this.phyData.serviceType = element.serviceType;
        this.phyData.medicareCertified = element.medicareCertified;
        this.phyData.acceptingNewPatients = element.acceptingNewPatients;
        this.phyData.privatePayAccepted = element.privatePayAccepted;

        // if(this.phyData.accredition.length==0){
        //   this.phyData.accredition="";
        // }
      });

      this.jsonData.serviceOptions = this.phyData;

      this.businessForm.value.workingHours.forEach((ele) => {
        this.dataforhours.monFromTime = ele.monFromTime;
        this.dataforhours.monToTime = ele.monToTime;
        this.dataforhours.monWorking = ele.monWorking;
        this.dataforhours.tueFromTime = ele.tueFromTime;
        this.dataforhours.tueToTime = ele.tueToTime;
        this.dataforhours.tueWorking = ele.tueWorking;
        this.dataforhours.wedToTime = ele.wedToTime;
        this.dataforhours.wedFromTime = ele.wedFromTime;
        this.dataforhours.wedWorking = ele.wedWorking;
        this.dataforhours.thrFromTime = ele.thrFromTime;
        this.dataforhours.thrToTime = ele.thrToTime;
        this.dataforhours.thrWorking = ele.thrWorking;
        this.dataforhours.friFromTime = ele.friFromTime;
        this.dataforhours.friToTime = ele.friToTime;
        this.dataforhours.friWorking = ele.friWorking;
        this.dataforhours.satFromTime = ele.satFromTime;
        this.dataforhours.satToTime = ele.satToTime;
        this.dataforhours.satWorking = ele.satWorking;
        this.dataforhours.sunFromTime = ele.sunFromTime;
        this.dataforhours.sunToTime = ele.sunToTime;
        this.dataforhours.sunWorking = ele.sunWorking;
      });
      this.businessForm.value.userSocialPresence.forEach((ele) => {
        this.socialData.twitter = ele.twitter;
        this.socialData.facebook = ele.facebook;
        this.socialData.linkedin = ele.linkedin;
        this.socialData.blogURL = ele.blogURL;
        this.socialData.alternamePageLink = ele.alternamePageLink;
      });
      this.jsonData.userSocialPresence = this.socialData;
      this.jsonData.companyLocationDetails =
        this.companyLocationDetails.getRawValue();
      this.jsonData.workingHours = this.dataforhours;

      this.jsonData.businessOwner = this.userId;

      if (
        this.aroute &&
        this.aroute.snapshot &&
        this.aroute.snapshot.queryParams
      ) {
        let id =
          this.aroute.snapshot.queryParams["orgId"] ||
          this.aroute.snapshot.queryParams["organizationId"] || this.aroute.snapshot.queryParams["organisationId"];
        this.jsonData.organisationId = id;

        let id1 = this.aroute.snapshot.queryParams["businessId"]
        this.jsonData.businessId = id1
      }



      this.businessForm.value.companyLocationDetails.forEach((element, i) => {
        var getindex = parseInt(i);

        if (index != getindex) {
          let newAddressvalidate: any;
          newAddressvalidate =
            element.address1 +
            "," +
            element.street +
            "," +
            element.city +
            "," +
            element.state +
            "," +
            element.country +
            "," +
            element.zipCode;
          // //// console.log(newAddressvalidate);

          if (currentAddressvalidate == newAddressvalidate) {
            this.businessForm.get("businessName").disable();

            this.disavow = false;

            Swal.fire({
              icon: "info",
              title: "Address should not same as the Primary Address",
              allowOutsideClick: false,
            }).then((result) => {
              this.isModalShown = false;
            });

            return true;
          }
        }

        if (
          this.businessForm.value.companyLocationDetails.length - 1 ==
          getindex
        ) {
          this.apicallsave();
        }
      });
    } else {
      this.api.stopLoader();
      //alert message that the form is not valid
      this.scrollToFirstInvalidControl();
    }
    // }

    // }
  }

  zipCodeValidaiton(x: number): boolean {
    if (String(x).length > 10) {
      return false;
    }
    return true;
  }

  apicallsave() {
    this.api.startLoader();
    this.api.create("business/create", this.jsonData).subscribe(
      (response) => {
        this.api.stopLoader();
        this.businessForm.get("businessName").disable();

        if (response.code == "00000") {
          this.api.stopLoader();
          this.isModalShown = true;
          // setTimeout(() => {
          //   this.resentOTPCode = true;
          // }, 600000);
          this.resentOTPCode = true;
          this.registerValue = "";
          this.registerValue = response.data.business;
          this.businessId = response.data.business.businessId;
          localStorage.setItem("businessId", response.data.business.businessId);
          // this.countdown.begin();
        } else if (response.code == "10008") {
          Swal.fire({
            title:
              " Business Page already exists for the given location. Please create one with a new location",
            showDenyButton: false,
            icon: "info",
            confirmButtonText: `ok`,
          }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
              this.disavow = false;
            }
          });
        } else if (response.code == "10006" || response.code == "99999") {
          /*else if (response.code == "99999") {

        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Email domain and website domain should be the same. For example: abc@abc.com & abc.com',
        }).then((result) => {
          this.businessForm.get('businessName').disable();
          this.companyLocationDetails.controls[0].get('businessEmail').setValue(null);
          this.disavow = false;
        })

      }*/
          this.businessForm.get("businessName").disable();
          Swal.fire({
            title: response.message,
            showDenyButton: false,
            confirmButtonText: `ok`,
          }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
              this.disavow = false;
            }
          });
        } else if (response.code == "10007") {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Email domain and website domain should be the same. For example: abc@abc.com & abc.com",
            showDenyButton: false,
            confirmButtonText: `ok`,
          }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
              this.disavow = false;
              this.businessForm.get("businessName").disable();
              this.companyLocationDetails.controls[0]
                .get("businessEmail")
                .setValue(null);
              // this.disavow = false;
            }
          });
        } else if (response.code == "10013") {
          Swal.fire({
            icon: "info",
            title: "Offline Verification",
            text: "Your business page is still pending to be created. You will receive the authorization code via postal in a week. Please make sure to check the mailbox.",
            showDenyButton: false,
            confirmButtonText: `Go To Business Page`,
          }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
              // getbussinessid(data){}
              this.registerValue = "";
              this.registerValue = response.data.business;
              this.businessId = response.data.business.businessId;
              // this.commonvalues.businessid(this.values);
              this.checkadmin(response.data.business.businessId, this.userId);
              localStorage.setItem("businessId", response.data.business.businessId);
              this.commonvalues.businessid(this.registerValue.businessId);
              localStorage.setItem("businessId", this.registerValue.businessId);
              localStorage.setItem("isSuperAdmin", "true");
              this.router.navigate(["business"], {
                queryParams: this.registerValue,
              });
            }
          });
        } else if (response.code == "B0030") {
          Swal.fire({
            icon: "info",
            title: "Business Page Created By Another User",
            text: "The business you trying to create has been created by another user. Please check if it has been verified in the business listing page and visit the page.",
            showDenyButton: false,
            confirmButtonText: `Okay`,
          }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
              this.router.navigate(["landingPage/business"])
            }
          });
        }
      }, err => {
        this.util.stopLoader();
        if (err.status == 500) {
          this.util.stopLoader();
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: 'Something went wrong while saving business. Please, try again later.',
            showDenyButton: false,
            confirmButtonText: `ok`,
          })
        }
      }
    );
  }

  getbussinessid(data) {
    this.checkadmin(data.businessId, data);
  }

  checkadmin(businessid, data) {
    let datas: any = {};
    datas.businessId = businessid;
    datas.userId = localStorage.getItem("userId");
    this.util.startLoader();
    this.api.create("business/check/admin", datas).subscribe((res) => {
      this.util.stopLoader();
      //  //// console.log("businesscheckadmin "+res);

      localStorage.setItem("businessId", businessid);
      localStorage.setItem("isAdmin", res.isAdmin);
      localStorage.setItem("isSuperAdmin", res.isSuperAdmin);
      localStorage.setItem("screen", "business");
      localStorage.setItem("adminviewflag", "false");

      //this.sideheader.displaymenu('business')
      this.router.navigate(["business"], { queryParams: data });
    }, err => {
      this.util.stopLoader();

    });
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

  get otpControl() {
    return this.OTPConfirm.controls;
  }

  anotherCode() {
    var data: any = {};
    data.businessId = this.businessId;
    this.util.startLoader();
    this.api.create("business/resendotp", data).subscribe((response) => {
      this.util.stopLoader();
      if (response.code == "00000") {
        this.resendotp = true;
        this.timeExpired = false;
        // this.exit = true
      }
    }, err => {
      this.util.stopLoader();
      if (err.status == 500) {
        this.util.stopLoader();
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: 'Something went wrong while requesting another code. Please, try again later.',
          showDenyButton: false,
          confirmButtonText: `ok`,
        })
      }
    });
  }

  enterOtp() {
    this.otp = false;
  }

  exit: boolean = false;
  navigate() {
    this.disable = true;
    if (this.OTPConfirm.valid) {
      let data: any = {};
      data.otp = this.OTPConfirm.value.otp;
      data.businessId = this.registerValue.businessId;
      this.util.startLoader();
      this.api.AuthValidation("business/verify", data).subscribe((res) => {
        this.util.stopLoader();
        if (res.code == "00000") {
          this.otp = false;
          this.timeExpired = false;
          this.hideModal();
          this.commonvalues.businessid(this.registerValue.businessId);
          localStorage.setItem("businessId", this.registerValue.businessId);
          localStorage.setItem("isSuperAdmin", "true");
          this.router.navigate(["business"], {
            queryParams: this.registerValue,
          });
        } else if (res.code == "99999") {
          this.otp = true;
          this.timeExpired = false;
        } else if (res.code == "85003") {
          // time expired
          this.otp = false;
          this.disable = false;
          this.timeExpired = true;
          if (this.resendotp) {
            // time expired twice
            this.exit = true;
          }
        }
      }, err => {
        this.util.stopLoader();

      });
    }
  }


  fileChangeEvent(event, popupName): void {

    this.imageChangedEvent = event;
    const checkSize = super.checkImageSize(event.target.files[0])
    // $("#profileimage").val("")
    if (event.target.files && event.target.files[0]) {
      $("#profileimage").val;
      this.fileUploadName = event.target.files[0].name;
      const acceptedImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
      if (!acceptedImageTypes.includes(event.target.files[0].type)) {
        Swal.fire('', 'Please upload the correct file type   (Only .jpg, .png, .jpeg)', 'info');
        this.myFileInput.nativeElement.value = "";

        this.modalRef.hide();
      }
      else if (checkSize > 10) {
        $("#profileimage").val("");
        Swal.fire(`${this.IMAGE_ERROR}`)
      }
      else {
        this.PopupServicevlaues(popupName);
      }

    } else {
      $("#profileimage").val("");
    }
  }

  PopupServicevlaues(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {
      animated: true,
      backdrop: "static",
    });
  }

  modalclose() {
    this.modalRef.hide();
    $("#profileimage").val("");
    this.totalBusinessPercentage -= 10;
  }

  doHours(event) {
    if (event.target.checked == true) {
      this.workingHrpersent = true
      this.worktime = true;
      this.workingHours.controls.forEach((ele) => {
        ele.get("monFromTime").setValidators([Validators.required]);
        ele.get("monFromTime").updateValueAndValidity();
        ele.get("monToTime").setValidators([Validators.required]);
        ele.get("monToTime").updateValueAndValidity();
      });
    } else if (event.target.checked == false) {
      this.fromflag = false;
      this.workingHrpersent = false
      this.toflag = false;
      this.tovalue = null;
      this.fromvalue = null;
      this.workingHours.controls.forEach((ele) => {
        ele.get("monFromTime").clearValidators();
        ele.get("monFromTime").updateValueAndValidity();
        ele.get("monToTime").clearValidators();
        ele.get("monToTime").updateValueAndValidity();
      });
      this.workingHourArray.controls.forEach((ele) => {
        ele.get("applyAll").setValue(false);
        ele.get("monFromTime").setValue(null);
        ele.get("monToTime").setValue(null);
        ele.get("applyAll").disable();
      });
      this.worktime = false;
    }
  }

  frmHr(event) {
    this.fromflag = true;
    this.fromvalue = null;
    this.fromvalue = event.target.value;
    this.workingHourArray.controls.forEach((ele) => {
      ele.get("applyAll").setValue(false);
    });

    this.checkflag();
  }

  toHr(event) {
    this.toflag = true;
    this.tovalue = null;
    this.tovalue = event.target.value;

    this.workingHourArray.controls.forEach((ele) => {
      ele.get("applyAll").setValue(false);
    });

    this.checkflag();
  }

  checkflag() {
    if (this.toflag == true && this.fromflag == true) {
      this.workingHourArray.controls.forEach((ele) => {
        ele.get("applyAll").enable();
      });
    } else {
      this.workingHourArray.controls.forEach((ele) => {
        ele.get("applyAll").disable();
      });
    }
  }

  changeHours(event) {
    if (event.target.checked == true) {
      this.workingHourArray.controls.forEach((ele) => {
        ele.get("tueWorking").setValue(true);
        ele.get("wedWorking").setValue(true);
        ele.get("thrWorking").setValue(true);
        ele.get("friWorking").setValue(true);
        ele.get("satWorking").setValue(true);
        ele.get("sunWorking").setValue(true);
        ele.get("tueToTime").setValue(this.tovalue);
        ele.get("tueFromTime").setValue(this.fromvalue);
        ele.get("wedFromTime").setValue(this.fromvalue);
        ele.get("wedToTime").setValue(this.tovalue);
        ele.get("thrFromTime").setValue(this.fromvalue);
        ele.get("thrToTime").setValue(this.tovalue);
        ele.get("friFromTime").setValue(this.fromvalue);
        ele.get("friToTime").setValue(this.tovalue);
        ele.get("satFromTime").setValue(this.fromvalue);
        ele.get("satToTime").setValue(this.tovalue);
        ele.get("sunFromTime").setValue(this.fromvalue);
        ele.get("sunToTime").setValue(this.tovalue);

        ele.get("tueToTime").setValidators([Validators.required]);
        ele.get("tueToTime").updateValueAndValidity();
        ele.get("tueFromTime").setValidators([Validators.required]);
        ele.get("tueFromTime").updateValueAndValidity();
        ele.get("wedFromTime").setValidators([Validators.required]);
        ele.get("wedFromTime").updateValueAndValidity();
        ele.get("wedToTime").setValidators([Validators.required]);
        ele.get("wedToTime").updateValueAndValidity();
        ele.get("thrFromTime").setValidators([Validators.required]);
        ele.get("thrFromTime").updateValueAndValidity();
        ele.get("thrToTime").setValidators([Validators.required]);
        ele.get("thrToTime").updateValueAndValidity();
        ele.get("friFromTime").setValidators([Validators.required]);
        ele.get("friFromTime").updateValueAndValidity();
        ele.get("friToTime").setValidators([Validators.required]);
        ele.get("friToTime").updateValueAndValidity();
        ele.get("satFromTime").setValidators([Validators.required]);
        ele.get("satFromTime").updateValueAndValidity();
        ele.get("satToTime").setValidators([Validators.required]);
        ele.get("satToTime").updateValueAndValidity();
        ele.get("sunFromTime").setValidators([Validators.required]);
        ele.get("sunFromTime").updateValueAndValidity();
        ele.get("sunToTime").setValidators([Validators.required]);
        ele.get("sunToTime").updateValueAndValidity();
      });
    } else if (event.target.checked == false) {
      this.workingHourArray.controls.forEach((ele) => {
        ele.get("tueWorking").setValue(false);
        ele.get("wedWorking").setValue(false);
        ele.get("thrWorking").setValue(false);
        ele.get("friWorking").setValue(false);
        ele.get("satWorking").setValue(false);
        ele.get("sunWorking").setValue(false);
        ele.get("tueToTime").setValue(null);
        ele.get("tueFromTime").setValue(null);
        ele.get("wedFromTime").setValue(null);
        ele.get("wedToTime").setValue(null);
        ele.get("thrFromTime").setValue(null);
        ele.get("thrToTime").setValue(null);
        ele.get("friFromTime").setValue(null);
        ele.get("friToTime").setValue(null);
        ele.get("satFromTime").setValue(null);
        ele.get("satToTime").setValue(null);
        ele.get("sunFromTime").setValue(null);
        ele.get("sunToTime").setValue(null);

        ele.get("tueToTime").clearValidators();
        ele.get("tueToTime").updateValueAndValidity();
        ele.get("tueFromTime").clearValidators();
        ele.get("tueFromTime").updateValueAndValidity();
        ele.get("wedFromTime").clearValidators();
        ele.get("wedFromTime").updateValueAndValidity();
        ele.get("wedToTime").clearValidators();
        ele.get("wedToTime").updateValueAndValidity();
        ele.get("thrFromTime").clearValidators();
        ele.get("thrFromTime").updateValueAndValidity();
        ele.get("thrToTime").clearValidators();
        ele.get("thrToTime").updateValueAndValidity();
        ele.get("friFromTime").clearValidators();
        ele.get("friFromTime").updateValueAndValidity();
        ele.get("friToTime").clearValidators();
        ele.get("friToTime").updateValueAndValidity();
        ele.get("satFromTime").clearValidators();
        ele.get("satFromTime").updateValueAndValidity();
        ele.get("satToTime").clearValidators();
        ele.get("satToTime").updateValueAndValidity();
        ele.get("sunFromTime").clearValidators();
        ele.get("sunFromTime").updateValueAndValidity();
        ele.get("sunToTime").clearValidators();
        ele.get("sunToTime").updateValueAndValidity();
      });
    }
  }

  setModalClass() {
    this.valueWidth = !this.valueWidth;
    const modalWidth = this.valueWidth ? "modal-lg" : "modal-sm";
    this.modalRef.setClass(modalWidth);
  }

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

  @HostListener("window:scroll")
  handleScroll() {
    const windowScroll = window.pageYOffset;
    if (windowScroll >= 35) {
      this.businessmenustick = true;
    } else {
      this.businessmenustick = false;
    }
  }
  count = 0
  imageLoaded() {
    //$("#profileimage").val("")
    const formData: FormData = new FormData();
    formData.append("file", this.fileToUpload, this.fileUploadName);
    this.util.startLoader();

    this.api.create("upload/image", formData).subscribe((res) => {
      this.util.stopLoader();
      this.photoId = res.fileId;
      // this.busLogo = this.photoId
      localStorage.setItem('busLogo', this.photoId)
      this.img = {
        src: AppSettings.ServerUrl + "download/" + this.photoId,
      };


      this.count = this.count + 1
      if (this.count === 1) {
        this.dara.completePercentage = this.dara.completePercentage + 10
      }
      this.dara.businessLogo = AppSettings.ServerUrl + "download/" + this.photoId
      this.commonvalues.setBusinessData(this.dara)
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

    this.modalRef.hide();
    // this.keyupdata("test")
  }

  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }

  onKeyZip(event: any, index) {
    let data: any = {};
    data.countryCode = "US";
    data.zipCode = event.target.value;
    if (event.target.value != "") {
      // data.stateCode = '';
      this.util.startLoader();
      this.api.create("country/geodetails", data).subscribe((res) => {
        this.util.stopLoader();
        if (res && res != null && res.length > 0) {
          res.forEach((ele) => {
            let cityName = ele.cityName;
            let stateName = ele.stateName;
            this.companyLocationDetails.controls[index].patchValue({
              city: cityName,
              state: stateName,
            });
          });
        } else {
          this.companyLocationDetails.controls[index].patchValue({
            city: null,
            state: null,
            // street: null
          });
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
    } else {
      this.companyLocationDetails.controls[index].patchValue({
        city: null,
        state: null,
      });
    }
  }

  onChangeCountry(event, index) {
    this.companyLocationDetails.controls[index].patchValue({
      state: null,
      zipCode: null,
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
  }

  getProfTitle() {
    this.util.startLoader();
    this.api
      .query("care/list/values/ADMINISTRATIVE_PERSONNEL")
      .subscribe((res) => {
        this.util.stopLoader();
        res.listItems.forEach((ele) => {
          this.busiTitleList.push(ele.item);
        });
        // //// console.log(this.busiTitleList)
        // //// console.log("This is business titlee")
      }, err => {
        this.util.stopLoader();
      });
  }

  getOrganization() {
    this.util.startLoader();
    this.api.query("care/organizations").subscribe((res) => {
      this.util.stopLoader();
      res.forEach((ele) => {
        this.hCareFacilityList.push(ele.organizationName);
      });
      // //// console.log("orgnaisatin list")
      // //// console.log(this.hCareFacilityList)
    }, err => {
      this.util.stopLoader();
    });
  }

  getPhyTitle() {
    this.util.startLoader();
    this.api
      .query("care/list/values/MEDICAL_PROFESSIONAL_TITLE")
      .subscribe((res) => {
        this.util.stopLoader();
        res.listItems.forEach((ele) => {
          this.phyTitleList.push(ele.item);
        });

        // //// console.log(this.phyTitleList)
        // //// console.log("This is healthcare response")
      }, err => {
        this.util.stopLoader();
      });
  }

  getFacilityType() {
    this.util.startLoader();
    this.api
      .query("care/list/values/FACILITY_PRACTICE_TYPE")
      .subscribe((res) => {
        this.util.stopLoader();
        var data = res.listItems;
        data.forEach((ele) => {
          this.facilityValue.push(ele.item);
        });
        //  data.forEach((ele)=>{
        //    this.hCareFacilityList.push({
        //     'itemId' : ele.itemId,
        //      'item' : ele.item
        //    })
        //  })
      }, err => {
        this.util.stopLoader();
      });
    // //// console.log("facility value")
    // //// console.log(this.facilityValue)
  }

  onChangeIndustry(val) {

    if (val == "MEDICAL_HEALTHCARE_PRACTICE") {
      this.hCareFlag = true;
      this.otherFlag = false;
      // this.adminFlag = false
      // this.studentFlag = false
      this.businessForm
        .get("facilityPracticeType")
        .setValidators([Validators.required]);
      this.businessForm.get("facilityPracticeType").updateValueAndValidity();
      this.businessForm.get("others").clearValidators();
      this.businessForm.get("others").updateValueAndValidity();
    } else if (val == "OTHER") {
      this.otherFlag = true;
      this.hCareFlag = false;
      this.businessForm.get("facilityPracticeType").clearValidators();
      this.businessForm.get("facilityPracticeType").updateValueAndValidity();
      this.businessForm
        .get("others")
        .setValidators([
          Validators.required,
          Validators.pattern(/^[^\s]+(\s+[^\s]+)*$/),
        ]);
      this.businessForm.get("others").updateValueAndValidity();
    } else {
      this.hCareFlag = false;
      this.otherFlag = false;
      this.businessForm.get("facilityPracticeType").clearValidators();
      this.businessForm.get("facilityPracticeType").updateValueAndValidity();
      this.businessForm.get("others").clearValidators();
      this.businessForm.get("others").updateValueAndValidity();
    }

  }

  // onOpenCalendar(container) {
  //   container.monthSelectHandler = (event: any): void => {
  //     container._store.dispatch(container._actions.select(event.date));
  //   };
  //   container.setViewMode('month');
  //  }

  //   onFileSelect(){
  //     this.infoData.append('file', this.fileToUpload);
  //     this.infoData.delete('file');
  //     for (let i = 0; i < event.target.files.length; i++) {
  //       this.fileToUpload =  event.target.files[i] as File;
  //       this.infoData.append('file', this.fileToUpload);
  // }
  //   }

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

  scrollTo(el: Element): void {
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }
  scrollToError(): void {
    const firstElementWithError = document.querySelector(
      ".ng-invalid[formControlName]"
    );
    this.scrollTo(firstElementWithError);
  }

  existBusinessModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
}
