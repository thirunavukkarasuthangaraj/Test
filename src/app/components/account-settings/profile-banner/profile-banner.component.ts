import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ImageCroppedEvent } from "ngx-image-cropper";
import { BehaviorSubject, Subject, Subscription, timer } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { AppSettings } from 'src/app/services/AppSettings';
import { FormValidation } from 'src/app/services/FormValidation';
import { GigsumoConstants } from 'src/app/services/GigsumoConstants';
import { UserService } from 'src/app/services/UserService';
import { ApiService } from 'src/app/services/api.service';
import { GigsumoService } from 'src/app/services/gigsumoService';
import { JobService } from 'src/app/services/job.service';
import { SearchData } from 'src/app/services/searchData';
import { WorkExperience } from 'src/app/services/userModel';
import { UtilService } from 'src/app/services/util.service';
import Swal from "sweetalert2";
import { CustomValidator } from '../../Helper/custom-validator';
declare var $: any;

@Component({
  selector: 'app-profile-banner',
  templateUrl: './profile-banner.component.html',
  styleUrls: ['./profile-banner.component.scss'],
  inputs: ["profileEditCurrentOrganizationUpdate"]
})
export class ProfileBannerComponent extends FormValidation implements OnInit, OnChanges, OnDestroy {
  userId: string = localStorage.getItem('userId');
  profileEditCurrentOrganizationUpdate: WorkExperience;
  OtpForm: UntypedFormGroup;
  requestPending: boolean = false;
  public FORMERROR = super.Form;
  stateListAU: any = [];
  imageChangedEvent: any = "";
  stateListIN: any = [];
  @ViewChild("myFileInput") myFileInput;
  @ViewChild("weirdFileName") weirdFileName;
  @ViewChild("myFileInput2") myFileInput2;
  resentOTPCode = new BehaviorSubject<boolean>(true);
  personalInfoForm: UntypedFormGroup;
  modalRef: BsModalRef;
  stateListCA: any = [];
  commonVariables: any = {};
  requestSent: boolean = false;
  connected: boolean = false;
  notConnected: boolean = false;
  duplicatepopup: boolean = false;
  bannerimg: any = "";
  profilePhoto: any = "";
  educationElement: any = {};
  businesslogs: any = "";
  commonVarEventEmitter: Subscription;
  experelement: any = {};
  backdropConfig = {
    backdrop: true,
    ignoreBackdropClick: true,
    keyboard: false,
  };

  backdropConfig1 = {
    backdrop: true,
    ignoreBackdropClick: true,
    keyboard: false,
    class: 'modal-sm',
  };

  eventSubscription: Subscription;
  photoId: any = null;
  infoData: any = {};
  adminFlag: boolean = false;
  constructor(private searchData: SearchData,
    private util: UtilService,
    private userService: UserService,
    private api: ApiService,
    private modalService: BsModalService,
    private fb: UntypedFormBuilder,
    private _route: ActivatedRoute,
    private gigsumoService: GigsumoService,
    private JobServicecolor: JobService,
    private router: Router) {
    super();
    this.userId = this._route.queryParams['_value'].userId
    this._route.queryParams['_value'].highlightSecondaryEmail == 'true' ? (this.openAndHighlightSecondaryEmail = true, this.util.startLoader()) : false;
    this.commonVarEventEmitter = this.searchData
      .getCommonVariables()
      .subscribe((res) => {
        this.commonVariables = res;
      });

    this.eventSubscription = this.searchData
      .getBooleanValue()
      .subscribe((res) => {
        this.weird = res;
      });
  }

  ngOnChanges({ profileEditCurrentOrganizationUpdate }: SimpleChanges): void {
    const currentOrg: WorkExperience = profileEditCurrentOrganizationUpdate.currentValue;
    if (currentOrg != null) {
      this.experelement.title = currentOrg.title;
      this.experelement.organisationName = currentOrg.organisationName;
    } else {
      this.experelement.title = "";
      this.experelement.organisationName = "";
    }
  }

  ngOnDestroy(): void {
    if (this.eventSubscription) {
      this.eventSubscription.unsubscribe();
    }

    if (this.commonVarEventEmitter) {
      this.commonVarEventEmitter.unsubscribe();
    }

    if (this.searchText) {
      this.searchText.unsubscribe()
    }
  }

  searchText = new Subject<string>();
  clientTypeList: any = []
  ngOnInit() {
    this.clientTypeList = ['Direct Hire', 'Direct Client', 'Systems Integrator', 'Prime Vendor', 'Vendor', 'Staffing Agency']
    this.personalInfoForm = this.fb.group(
      {
        userType: [null, [Validators.required]],
        clientType: [null],
        nonApplicable: [false],
        firstName: [
          "",
          [
            Validators.required,
            Validators.pattern(this.FIRST_Name.pattern),
            CustomValidator.max(this.FIRST_Name.max),
            CustomValidator.checkWhiteSpace()
          ],
        ],
        lastName: [
          "",
          [
            Validators.required,
            Validators.pattern(this.LAST_NAME.pattern),
            CustomValidator.max(this.LAST_NAME.max),
            CustomValidator.checkWhiteSpace()
          ],
        ],
        pitch: [null],
        photo: [""],
        npiNo: [null],
        phoneNo: [
          "",
          Validators.compose([Validators.required,
          CustomValidator.minmaxLetters(this.PHONE.min, this.PHONE.max),
          Validators.pattern(this.PHONE.pattern),
          ]),
        ],
        email: [
          "",
          Validators.compose([Validators.required, CustomValidator.max(this.EMAIL.max)]),
        ],
        state: ["", Validators.compose([Validators.required, CustomValidator.max(this.STATE.max)])],
        zipcode: [
          "",
          Validators.compose([
            Validators.required,
            CustomValidator.minmaxLetters(this.ZIPCODE.min, this.ZIPCODE.max)
          ]),
        ],
        secondaryEmail: ["", Validators.compose([CustomValidator.max(this.EMAIL.max)
          , Validators.pattern(this.EMAIL.pattern)])],
        organisation: [""],
        city: ["", Validators.compose([Validators.required, CustomValidator.max(this.CITY.max)])],
        country: ["", Validators.compose([Validators.required])],
      },
    );


    this.OtpForm = this.fb.group({
      domainValidationOtp: new UntypedFormControl(null, [Validators.pattern(this.OTP.pattern), Validators.required])
    });

    this.query()
    this.searchText.pipe(
      debounceTime(1000),
      distinctUntilChanged()
    )
      .subscribe(
        res => {
          this.processEmailAddress(res);
        }
      )
  }

  async resendOtp(resentOtp: boolean = false) {

    let data = await this.userService.sentOtpToMail(this.otpDetails);

    if (data.code === GigsumoConstants.SUCESSCODE) {
      if (!resentOtp) {
        timer(30000).subscribe((x) => {
          this.resentOTPCode.next(false);
        });
      } else {
        this.resentOTPCode.next(true);
        timer(30000).subscribe((x) => {
          this.resentOTPCode.next(false);
        });
      }
    }



  }

  async submitOtp() {
    this.OtpForm.markAllAsTouched();
    if (this.OtpForm.valid) {

      let verifiedOtp = await this.userService.verifyOtp({
        otp: this.OtpForm.get("domainValidationOtp").value,
        otpFor: "USER_SECONDARY_MAIL_OTP_VERIFICATION",
        entityId: this.userId
      });



      if (verifiedOtp.code === GigsumoConstants.SUCESSCODE) {

        await this.gigsumoService.getResponseMessage("OTP_VERIFIED");
        this.infoData.secondaryEmail = this.personalInfoForm.get('secondaryEmail').value;
        this.saveProfileData();

      }
      else {
        this.OtpForm.get("domainValidationOtp").setErrors({ wrongDomainValidationOtp: true });
      }

    }
  }


  setErrorsAndUpdate(form: UntypedFormGroup, { key, errors }) {
    form.get(key).setErrors({ ...errors });
    form.get(key).updateValueAndValidity();
  }


  saveProfileData() {
    this.infoData.city = this.personalInfoForm.value.city;
    this.infoData.zipcode = this.personalInfoForm.value.zipcode;
    this.infoData.phoneNo = this.personalInfoForm.value.phoneNo;
    this.infoData.country = this.personalInfoForm.value.country;
    this.infoData.state = this.personalInfoForm.value.state;
    this.infoData.secondaryEmail = this.personalInfoForm.value.secondaryEmail;
    let data = this.infoData;
    this.util.startLoader();
    this.api.create("user/saveUser", data).subscribe(response => {
      if (response.code === GigsumoConstants.SUCESSCODE) {
        this.modalRef.hide();
        this.infoData = response;
        this.otpValidForm = false;
        this.OtpForm.reset();
      }
      this.util.stopLoader()
    });
  }


  get OtpControls() {
    return this.OtpForm.controls;
  }


  zipCodeValidaiton(x: number): boolean {
    if (String(x).length > 10) {
      return false;
    }
    return true;
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

  filterNo(event: any) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  digitKeyOnly(e) {
    var keyCode = e.keyCode == 0 ? e.charCode : e.keyCode;
    if ((keyCode >= 37 && keyCode <= 40) || (keyCode == 8 || keyCode == 9 || keyCode == 13)
      || (keyCode >= 48 && keyCode <= 57)) {
      return true;
    }
    return false;
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
      this.util.stopLoader();

    });
  }

  ngAfterViewInit() {
    this.validateUser()
  }

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
      this.util.stopLoader();

    });
  }


  userTypeValue: any;
  restrictedUserType: any;
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

  onKeyZip(event: any, value, index) {
    if (value == "user") {
      let data: any = {};
      data.countryCode = "US";
      data.zipCode = event.target.value;
      data.stateCode = "";
      // this.util.startLoader();
      if (data.zipCode.length === 5) {
        this.api.create("country/geodetails", data).subscribe((res) => {
          if (res && res != null && res.length > 0 && event.target.value != "") {
            // this.util.stopLoader();
            res.forEach((ele) => {
              let cityName = ele.cityName;
              let stateName = ele.stateName;
              this.personalInfoForm.patchValue({
                city: cityName,
                state: stateName,
              });
            });
          } else {
            // this.util.stopLoader();
            // this.personalInfoForm.patchValue({
            //   city: null,
            //   state: null,
            //   // street : null
            // });
          }
        }, err => {
          this.util.stopLoader();

        });
      } else {
        this.personalInfoForm.patchValue({
          city: null,
          state: null,
          // street : null
        });
      }
    }
  }
  duplicateconnects = false;
  connect() {
    this.duplicateconnects = true;
    var data: any = {};
    data.userId = this.userId;
    data.requestedBy = localStorage.getItem("userId");
    this.util.startLoader();
    this.api.create("user/connect", data).subscribe((res) => {
      this.duplicateconnects = false;
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
      } else if (res.code == 'U0031') {
        this.util.stopLoader()
        // this.query()
        // this.reload()
        // let datas: any = {};
        // datas.userId = this.userId
        // this.router.navigateByUrl("/", { skipLocationChange: true }).then(() => {
        //   this.router.navigate(["personalProfile"], { queryParams: datas });
        // });
        this.fetchForeignUser()
      }
    }, err => {
      this.duplicateconnects = false;
      this.util.stopLoader();

    });
  }
  profileitems: any;

  // highlightSecondaryEmail() {
  //   this.modalRef = this.modalService.show(this.infoTemplate, {
  //     animated: true,
  //     backdrop: "static",
  //   });
  // }

  @ViewChild('infoTemplate', { static: false }) infoTemplate: TemplateRef<any>;
  query() {
    this.util.startLoader();
    this.api.query("user/" + this.userId).subscribe((res) => {
      this.profileitems = res;
      if (res && res.code === "00000") {
        this.util.stopLoader();
        this.infoData = res;
        this.getData()
        this.getListValue(res.userType);
        this.openAndHighlightSecondaryEmail == true ? this.infoEdit(this.infoTemplate, 'highlight') : undefined;
      }
    }, err => {
      this.util.stopLoader();
    });
  }
  getInitials(firstname: string, lastname: string): string {
    return this.JobServicecolor.getInitialsparam(firstname, lastname);
  }

  getColor(firstname: string, lastname: string): string {
    return this.JobServicecolor.getColorparam(firstname, lastname);
  }

  getListValue(userType) {
    var data: any = { "domain": "CLIENT_TYPE" }
    this.api.create('listvalue/findbyList', data).subscribe(res => {
      if (res.code == '00000') {
        res.data.CLIENT_TYPE.listItems.forEach(ele => {

          this.clientTypeList.push(ele.item);
        })
        this.clientTypeList.push('Supplier')
      }
    })
  }

  validateUser() {
    if (this.userId == localStorage.getItem("userId")) {

      this.commonVariables.localUser = true;
      this.searchData.setCommonVariables(this.commonVariables);

    } else {

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

  searchResponse: any;

  validateConnection() {
    this.userId = this.searchResponse.userId;
    if (this.searchResponse.connected == "true") {
      this.connected = true;
    } else {
      this.connected = false;
    }


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


  sendMessage(userId: String) {
    var userData: any = {};
    userData.userId = this.userId;
    userData.groupId = this.userId;
    userData.type = 'USER'
    this.router.navigate(["message"], { queryParams: userData });
  }

  uploadPhotoHere() {
    this.myFileInput2.nativeElement.click();
  }

  uploadPhoto() {
    this.weirdFileName.nativeElement.click();
  }


  closeImage() {

    const formData: FormData = new FormData();

    this.fileUploadName = undefined;
    this.modalRef1.hide();

    this.img.src = AppSettings.ServerUrl + "download/" + this.photoId;

    $("#weirdFileName").val("");
    $("#myFileInput")[0].value = '';
  }

  userType;
  getData() {
    if (this.infoData.userType !== 'student') {
      const workExperience = this.infoData.workExperience;

      if (workExperience.length > 0) {
        const currentExperience = workExperience.find(ele => ele.currentOrganization);

        if (currentExperience) {
          this.experelement.city = currentExperience.city;
          this.experelement.title = currentExperience.title;
          this.experelement.state = currentExperience.state;
          this.experelement.country = currentExperience.country;
          this.experelement.organisationName = currentExperience.organisationName;
        }
        // else {

        //     const firstExperience = workExperience[0];
        //     this.experelement.city = firstExperience.city;
        //     this.experelement.title = firstExperience.title;
        //     this.experelement.state = firstExperience.state;
        //     this.experelement.country = firstExperience.country;
        //     this.experelement.organisationName = firstExperience.organisationName;
        // }
      }
    }

    else if (this.infoData.userType === 'student') {
      this.educationElement = {};
      this.infoData.educationDetail.forEach((ele) => {
        if (this.infoData.educationDetail.length > 1) {
          if (ele.currentlyPursued == true && ele.showThisOnProfile == true) {
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



    if (this.infoData.banner !== 'undefined' && this.infoData.banner !== 'undefined') {
      this.bannerimg = { src: AppSettings.photoUrl + this.infoData.banner };
    }

    if (this.infoData.photo != undefined && this.infoData.photo != 'undefined') {
      this.profilePhoto = { src: AppSettings.photoUrl + this.infoData.photo };
    } else {
      this.profilePhoto = null;
    }
  }


  onChangeCountry(event, value, index) {
    if (value == "user") {
      this.personalInfoForm.patchValue({
        state: null,
        zipcode: null,
        city: null,
        country: event,
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

  img: any = {};
  img4: any = {};
  previousUserType
  async infoEdit(template: TemplateRef<any>, value) {
    try {
      this.duplicatepopup = true;
      this.util.startLoader();

      if (value == "previous") {
        this.changeUserTypeFlag = true;
        this.commonVariables.previousFlag = true;
        this.searchData.setCommonVariables(this.commonVariables);
        this.restrictedUserType = this.userType;
      }

      const res = await this.api.query("user/" + this.userId).toPromise();

      if (res) {
        this.infoData = res;
        this.previousUserType = this.infoData.userType;
        const u = this.infoData;

        this.getCountry();
        this.getStates(u.country);
        this.onChangePhysician(u.userType);

        this.personalInfoForm.patchValue({
          ...u,
          secondaryEmail: u.secondaryEmail
        });
        this.modalRef = this.modalService.show(template, this.backdropConfig);
        if (this.commonVariables.previousFlag) {
          document.getElementById("userType1").focus();
        }

        if (this.infoData.photo) {
          this.photoId = this.infoData.photo;
          this.img4.src = AppSettings.ServerUrl + "download/" + this.photoId;
        } else {
          this.img4.src = null;
        }

        if (value == 'highlight') {
          this.highlightFormField('highlightSecondary')
        }

        this.setupValidators();
      }
    } catch (error) {
    } finally {
      this.duplicatepopup = false;
      this.util.stopLoader();
    }
  }

  private setupValidators(): void {
    const { ZIPCODE, FIRST_Name, LAST_NAME, EMAIL } = this;

    this.personalInfoForm.get("zipcode").setValidators([
      Validators.required,
      CustomValidator.minmaxLetters(ZIPCODE.min, ZIPCODE.max)
    ]);
    this.personalInfoForm.get("zipcode").updateValueAndValidity();

    this.personalInfoForm.get("firstName").setValidators([
      Validators.required,
      Validators.pattern(FIRST_Name.pattern),
      CustomValidator.max(FIRST_Name.max),
      CustomValidator.checkWhiteSpace()
    ]);
    this.personalInfoForm.get("firstName").updateValueAndValidity();

    this.personalInfoForm.get("lastName").setValidators([
      Validators.required,
      Validators.pattern(LAST_NAME.pattern),
      CustomValidator.max(LAST_NAME.max),
      CustomValidator.checkWhiteSpace()
    ]);
    this.personalInfoForm.get("lastName").updateValueAndValidity();

    this.personalInfoForm.get("email").setValidators([
      Validators.required,
      CustomValidator.max(EMAIL.max),
      Validators.pattern(EMAIL.pattern)
    ]);
    this.personalInfoForm.get("email").updateValueAndValidity();

    this.personalInfoForm.get("secondaryEmail").setValidators([
      CustomValidator.max(EMAIL.max),
      Validators.pattern(EMAIL.pattern)
    ]);
    this.personalInfoForm.get("secondaryEmail").updateValueAndValidity();
  }
  reValidate(value) {
    this.personalInfoForm.get(value).setValidators([Validators.required]);
    this.personalInfoForm.get(value).updateValueAndValidity();
  }
  onChangePhysician(val) {
    if (val == "HEALTHCARE") {
      this.commonVariables.studentFlag = false;
      this.searchData.setCommonVariables(this.commonVariables);
    } else if (val == "student") {
      this.commonVariables.studentFlag = true;
      this.searchData.setCommonVariables(this.commonVariables);
    } else if (val == "adminPersonnel") {
      this.commonVariables.studentFlag = false;
      this.searchData.setCommonVariables(this.commonVariables);
    } else if (val == "Other") {
      this.commonVariables.studentFlag = false;
      this.searchData.setCommonVariables(this.commonVariables);
    }
  }


  closePhoto() {
    this.modalRef.hide();
    // this.fileUploadName = ''
    this.myFileInput.nativeElement.value = "";
  }

  closePhoto2() {
    this.modalRef2.hide();
    this.myFileInput2.nativeElement.value = null
  }
  bannerdata;
  fileUploadName;
  fileUploadName2;
  fileToUpload: File;
  fileToUpload2: File;
  imageLoaded() {
    const formData: FormData = new FormData();
    formData.append("file", this.fileToUpload, this.fileUploadName);
    this.util.startLoader();
    this.api.create("upload/image", formData).subscribe((res) => {
      this.util.stopLoader();
      this.photoId = res.fileId;
      this.modalclose();
      formData.delete("file");
      if (res.fileId) {
        this.infoData.banner = this.photoId
        this.infoData.skipValidation = true
        this.api.create("user/saveUser", this.infoData).subscribe((res) => {
          if (res.code === '00000') {
            this.reload()
          }
        })
      }
    }, err => {
      this.util.stopLoader();

    });
  }


  processEmailAddress(id) {
    this.api.query("user/checkMailAlreadyExists/" + id).subscribe((res) => {
      if (res.data && res.data.exists) {
        this.personalInfoForm.get('secondaryEmail').reset();
        Swal.fire({
          icon: "info",
          title: "Email Address Taken",
          text: "There already exists an account registered with this email address. Please enter a different email.",
          showConfirmButton: true,
        });
      }
    })

  }

  emailidcehck(value: string) {
    this.searchText.next(value);
  }

  closeOTP() {
    this.otpValidForm = false;
    this.OtpForm.reset();
  }

  modalRef1: BsModalRef | null;

  imageLoaded1() {
    const formData: FormData = new FormData();
    formData.append("file", this.fileToUpload, this.fileUploadName);
    this.api.create("upload/image", formData).subscribe((res) => {
      this.photoId = res.fileId;
      this.modalRef1.hide();
      // $("#weirdFileName").val("")
      this.img4 = {};
      this.img4.src = AppSettings.ServerUrl + "download/" + this.photoId;
    });
  }

  imageLoaded2() {
    this.util.startLoader();
    const formData: FormData = new FormData();
    formData.append("file", this.fileToUpload, this.fileUploadName);
    // setTimeout(() => {
    this.api.create("upload/image", formData).subscribe((res) => {

      if (res) {
        this.photoId = res.fileId;
        this.modalRef2.hide();
        // $("#weirdFileName").val("")
        this.img4 = {};
        this.img4.src = AppSettings.ServerUrl + "download/" + this.photoId;
        this.infoData.photo = this.photoId;
        this.infoData.skipValidation = true


        this.api.create("user/saveUser", this.infoData).subscribe((res) => {
          if (res.code == "00000") {
            this.reload()
          } else {
            this.util.stopLoader()
            this.modalRef2.hide();
            Swal.fire({
              icon: "info",
              title: "Oops...",
              text: "Something went wrong. Please try after a while.",
              showConfirmButton: false,
              timer: 4000
            });
          }
        }, err => {
          this.util.stopLoader();

        });
      }
    }, err => {
      this.util.stopLoader();

    });
  }


  fileChangeEvent(event, popupName): void {
    this.imageChangedEvent = event;
    const acceptedImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
    if (event.target.files && event.target.files[0]) {
      this.fileUploadName = event.target.files[0].name;
      this.myFileInput.nativeElement.value;
    }

    if (!acceptedImageTypes.includes(event.target.files[0].type)) {
      Swal.fire('', 'Please upload the correct file type   (Only .jpg, .png, .jpeg)', 'info');
      this.myFileInput.nativeElement.value = "";
      this.modalRef.hide();
    } else {
      this.PopupServicevlaues(popupName);
    }
  }




  fileChangeEvent1(event, popupName): void {
    const checkSize = super.checkImageSize(event.target.files[0]);
    this.imageChangedEvent = event;
    const acceptedImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
    if (event.target.files && event.target.files[0]) {
      this.fileUploadName = event.target.files[0].name;
    }
    if (!acceptedImageTypes.includes(event.target.files[0].type)) {
      Swal.fire('', 'Please upload the correct file type   (Only .jpg, .png, .jpeg)', 'info');
      this.modalRef1.hide();
    }
    else if (checkSize > 10) {
      Swal.fire(`${this.IMAGE_ERROR}`);
    }
    else {
      this.PopupServicevlaues1(popupName);
    }

  }

  modalRef2: BsModalRef | null;
  fileChangeEvent2(event, popupName): void {
    // alert("ok"+ event.target.files[0].size)
    this.imageChangedEvent = event;
    const acceptedImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
    if (event.target.files && event.target.files[0]) {
      this.fileUploadName = event.target.files[0].name;
      this.myFileInput2.nativeElement.value;
    }

    if (!acceptedImageTypes.includes(event.target.files[0].type)) {
      Swal.fire('', 'Please upload the correct file type   (Only .jpg, .png, .jpeg)', 'info');
      this.myFileInput2.nativeElement.value = "";
      this.modalRef2.hide();
    } else {
      this.PopupServicevlaues2(popupName);
    }

  }

  PopupServicevlaues(template: TemplateRef<any>) {

    this.modalRef = this.modalService.show(template, {
      animated: true,
      backdrop: "static",
    });
  }

  PopupServicevlaues1(template: TemplateRef<any>) {

    this.modalRef1 = this.modalService.show(template, {
      animated: true,
      backdrop: "static",
    });
  }

  PopupServicevlaues2(template: TemplateRef<any>) {

    this.modalRef2 = this.modalService.show(template, {
      animated: true,
      backdrop: "static",
    });
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

  modalclose() {
    this.modalRef.hide();
    this.myFileInput.nativeElement.value = "";
  }

  getStates(countryName?: string) {
    this.stateListIN = [];
    this.util.startLoader();
    this.api
      .query("country/getAllStates?countryCode=" + countryName)
      .subscribe((res) => {
        if (res) {
          this.util.stopLoader();
          this.stateListIN = res;
        }
      }, err => {
        this.util.stopLoader();
      });
  }
  countryList: any = [];
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

  removeConnection() {
    let connData: any = {};
    connData.userId = this.userId;
    this.util.startLoader();

    this.api.create("user/connect/remove", connData).subscribe((res) => {

      if (res.code === "00000") {
        this.util.stopLoader();
        // this.user.connectionStatus="NOT_CONNECTED";
        // this.user.connected = false;
        // this.initCard();
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
      this.util.stopLoader();

    });
  }
  indexOne: boolean = false;
  indexTwo: boolean = false;
  indexZero: boolean = false;
  reload() {
    let datas: any = {};
    datas.userId = localStorage.getItem("userId");
    this.router.navigateByUrl("/", { skipLocationChange: true }).then(() => {
      this.router.navigate(["personalProfile"], { queryParams: datas });
    });
  }

  // cancelConnectionRequest(userId: String){
  cancelConnectionRequest() {
    let cancelData: any = {};
    // cancelData.userId = userId
    cancelData.userId = this.userId;

    this.util.startLoader();
    this.api.create("user/connect/cancel", cancelData).subscribe((res) => {

      if (res.code === "00000") {
        this.util.stopLoader();

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

        Swal.fire({
          icon: "info",
          title: "Cancel request failed",
          text: "Unable to cancel connection. Please try after some time.",
          showConfirmButton: false,
          timer: 4000,
        });
        this.fetchForeignUser()
      }
    }, err => {
      this.util.stopLoader();

    });
  }
  studModRef: BsModalRef;
  studPrompt: boolean = false
  medPrompt: boolean = false
  openStudPromptNested() {
    this.studPrompt = true
    this.medPrompt = false
    // this.studModRef = this.modalService.show(studentPrompTemplate, {
    //   animated: true,
    //   backdrop: true,
    //   ignoreBackdropClick: true,
    //   class: "second",
    //   keyboard: false,
    // });

  }

  showImage: boolean = false
  showImage1: boolean = false

  onMouseEnter() {
    this.showImage = true;
  }

  onMouseLeave() {
    this.showImage = false;
  }

  onMouseEnter1() {
    this.showImage1 = true;
  }

  onMouseLeave1() {
    this.showImage1 = false;
  }
  get p() {
    return this.personalInfoForm.controls;
  }

  uploadBannerHere() {
    this.myFileInput.nativeElement.click();
  }

  phyModRef: BsModalRef;

  openPhyPromptNested() {
    this.medPrompt = true
    this.studPrompt = false
    // this.phyModRef = this.modalService.show(physicianPrompTemplate, {
    //   animated: true,
    //   backdrop: true,
    //   ignoreBackdropClick: true,
    //   class: "second",
    //   keyboard: false,
    // });
  }


  decline(): void {
    this.modalRef.hide();
    this.phyPrompt = false;
    this.duplicatepopup = false;
    this.searchData.setBooleanValue(false);
    // this.isSuperAdmin = false
    this.commonVariables.similarOrgFlag = false
    this.searchData.setCommonVariables(this.commonVariables)
    // this.img = {};
    // this.img.src = AppSettings.ServerUrl + "download/" + this.infoData.photo;
    if (this.commonVariables.previousFlag == true) {
      this.reload();
    }
  }

  weird: boolean = false;

  changeToPhysician() {
    // this.phyPrompt = true;
    // this.studentPrompt = false;
    this.searchData.setBooleanValue(true);
    // this.phyModRef.hide();
    this.modalRef.hide();
    this.infoSave();
  }


  hidePhyPrompt() {
    this.medPrompt = false
    // this.studentPrompt = false;
    this.searchData.setBooleanValue(false);
    // this.phyModRef.hide();
    // this.phyPrompt = false;
    this.personalInfoForm.patchValue({ userType: this.infoData.userType });
  }

  changeToStudent() {
    // this.studentPrompt = true;
    this.searchData.setBooleanValue(true);
    // this.studModRef.hide();
    this.modalRef.hide();
    this.infoSave();
  }

  hideStudPrompt() {
    this.studPrompt = false

    // this.studentPrompt = false;
    // this.phyPrompt = false;
    this.searchData.setBooleanValue(false);
    // this.studModRef.hide();
    this.personalInfoForm.patchValue({ userType: this.infoData.userType });
  }

  // onChangePhysician1(physicianPrompTemplate, studentPrompTemplate) {

  //   if (this.phyPrompt == true) {
  //     this.openPhyPromptNested(physicianPrompTemplate);
  //   } else if (this.studentPrompt == true) {
  //     this.openStudPromptNested(studentPrompTemplate);
  //   }
  // }

  onChangePhysician1() {

    if (this.phyPrompt == true) {
      this.openPhyPromptNested();
    } else if (this.studentPrompt == true) {
      this.openStudPromptNested();
    }
  }

  executeInfoSave() {
    this.api.create("user/saveUser", this.infoData).subscribe((res) => {
      if (res.code == "00000") {
        this.modalRef.hide();
        localStorage.setItem('userType', this.personalInfoForm.value.userType)
        var data: any = {}
        data.userType = this.personalInfoForm.value.userType
        this.searchData.setuserType(data)
        setTimeout(() => {
          this.reload()
        }, 2000);
      }
    }, err => {
      this.util.stopLoader();
    });
  }

  pisubmit: boolean = false
  image: any = {};
  phyPrompt: boolean = false;
  studModalShown: boolean = false;
  studentPrompt: boolean = false;
  physicianFlag: boolean = false;

  get isSecondaryEmailChange(): boolean {
    const email: string = this.personalInfoForm.get('secondaryEmail').value;
    return (this.infoData.secondaryEmail != null && email != null && email.trim().length > 0 && this.infoData.secondaryEmail != email)
      || (this.infoData.secondaryEmail == null && email != null && email.trim().length > 0);
  }

  otpValidForm: boolean = false;
  otpDetails: Record<string, string>;
  async infoSave() {
    this.pisubmit = true;
    if (this.personalInfoForm.valid) {

      if (this.isSecondaryEmailChange) {
        this.util.startLoader();
        this.otpDetails = {
          secondaryEmail: this.personalInfoForm.get('secondaryEmail').value,
          firstName: this.infoData.firstName,
          lastName: this.infoData.lastName,
          userId: this.infoData.userId,
        };
        let userDetails = await this.userService.sentOtpToMail(this.otpDetails);
        this.util.stopLoader();

        if (userDetails.code === GigsumoConstants.SUCESSCODE) {
          timer(30000).subscribe((x) => {
            this.resentOTPCode.next(false);
          });
          this.otpValidForm = true;
        }
        return;
      }

      this.infoData.userType = this.personalInfoForm.value.userType;
      this.infoData.npiNo = this.personalInfoForm.value.npiNo;
      this.infoData.pitch = this.personalInfoForm.value.pitch;
      this.infoData.firstName = this.personalInfoForm.value.firstName;
      this.infoData.email = this.personalInfoForm.value.email;
      this.infoData.lastName = this.personalInfoForm.value.lastName;
      this.infoData.title = this.personalInfoForm.value.title;
      this.infoData.organisation = this.personalInfoForm.value.organisation;

      if (this.photoId != null) {
        this.infoData.photo = this.photoId;
      }
      // this.img.src = AppSettings.ServerUrl + "download/" + this.infoData.photo;
      this.infoData.city = this.personalInfoForm.value.city;
      this.infoData.zipcode = this.personalInfoForm.value.zipcode;
      this.infoData.skipValidation = true;
      this.infoData.phoneNo = this.personalInfoForm.value.phoneNo;
      this.infoData.country = this.personalInfoForm.value.country;
      this.infoData.state = this.personalInfoForm.value.state;
      this.infoData.secondaryEmail = this.personalInfoForm.value.secondaryEmail;
      this.util.startLoader();
      const currentUserType = this.personalInfoForm.value.userType
      if (currentUserType == 'MANAGEMENT_TALENT_ACQUISITION' || currentUserType == 'FREELANCE_RECRUITER') {
        this.executeInfoSave()
      } else if (currentUserType != this.previousUserType) {
        var data: any = {}
        data.userId = this.userId
        data.userType = currentUserType
        this.api.create("user/profileDetails", data).subscribe(res => {
          this.util.stopLoader();
          if (res != undefined && res && res.data.isCandidatesOrJobsAvailable) {
            Swal.fire({
              position: "center",
              title: "Oops..",
              text: "Sorry, you can't change user type if you have jobs or candidates with this profile.",
              icon: "info",
              showConfirmButton: true,
            });
          } else {
            this.executeInfoSave();
          }
        })
      } else {
        this.executeInfoSave()
      }
    }
  }

  openSweetalert() {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: "Remove Profile Photo?",
        text: "Are you sure you want to delete the profile photo?",
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.infoData.photo = null
          this.infoData.skipValidation = true
          this.api.create("user/saveUser", this.infoData).subscribe((res) => {
            if (res.code == "00000") {
              this.reload()
            } else {
              this.util.stopLoader()
              this.modalRef2.hide();
              Swal.fire({
                icon: "info",
                title: "Oops...",
                text: "Something went wrong. Please try after a while.",
                showConfirmButton: false,
                timer: 4000
              });
            }
          }, err => {
            this.util.stopLoader();

          });

        } else if (result.dismiss === Swal.DismissReason.cancel) {
          // Swal.fire({
          //   position: "center",
          //   icon: "success",
          //   title: "Work experience is safe",
          //   showConfirmButton: false,
          //   timer: 3000,
          // });
        }
      });
  }

  modalRef5: BsModalRef
  yes(): void {
    this.infoData.photo = null
    this.infoData.skipValidation = true
    this.api.create("user/saveUser", this.infoData).subscribe((res) => {
      if (res.code == "00000") {
        this.reload()
      } else {
        this.util.stopLoader()
        this.modalRef2.hide();
        Swal.fire({
          icon: "info",
          title: "Oops...",
          text: "Something went wrong. Please try after a while.",
          showConfirmButton: false,
          timer: 4000
        });
      }
    }, err => {
      this.util.stopLoader();

    });

    this.modalRef5.hide();

  }

  no(): void {
    this.modalRef5.hide();
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

  openAndHighlightSecondaryEmail: boolean = false;
  highlightFormField(fieldName: string): void {
    setTimeout(() => {
      const formField = document.getElementById(fieldName) as HTMLElement;
      if (formField) {
        formField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 1500);
    this.util.stopLoader();
  }
}
