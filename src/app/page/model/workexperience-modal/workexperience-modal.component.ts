import { Location } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef, ViewChild, Injectable } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, Observable, Subject, Subscription, timer } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { AppSettings } from 'src/app/services/AppSettings';
import { FormValidation } from 'src/app/services/FormValidation';
import { BUSINESS_STATUS_CODE, GigsumoConstants } from 'src/app/services/GigsumoConstants';
import { HealthCareOrganization } from 'src/app/services/HealthCareOrganization';
import { PROFILE_LISTENER } from 'src/app/services/UserService';
import { ApiService } from 'src/app/services/api.service';
import { BusinessModal } from 'src/app/services/businessModal';
import { CommonValues } from 'src/app/services/commonValues';
import { jobModuleConfig } from 'src/app/services/jobModuleConfig';
import { Country, State } from 'src/app/services/locationModal';
import { UserModel, WorkExperience } from 'src/app/services/userModel';
import Swal, { SweetAlertResult } from 'sweetalert2';
import { GigsumoService, superAdminDetails } from './../../../services/gigsumoService';
import { UtilService } from './../../../services/util.service';


export type WorkExperienceOrBusiness = BusinessModal | WorkExperience;
export interface workExperienceDetails {
  organizationId: string;
  businessId: string;
  city: string;
  action: string,
  organisationName: string,
  zipcode: string;
  state: string;
  country: string;
  clientType: string;
  startMonth: string,
  startYear: string,
  endMonth: string,
  endYear: string
  timeZone: string,
  currentOrganization: boolean,
  title: string,
  badge: boolean,
  organisationId: string,
  addEmployee: boolean,
  expId: string,
  userId: string,
  // organizationType : string,
}

@Injectable()
export class PopupCall {

  content: Array<{ Type: "MAKE_CURRENT" | "CHANGE_CLIENT", count: number }> = [];

  isPopupShowedMorethanOneTime(Type: "MAKE_CURRENT" | "CHANGE_CLIENT"): boolean {
    let call: boolean;
    if (this.content != null && this.content.length > 0) {
      this.content.forEach(element => {
        if (element.Type === Type) {
          call = element.count >= 1 ? true : false
        }
      });
    }
    return call;
  }

}


@Component({
  selector: 'app-workexperience-modal',
  templateUrl: './workexperience-modal.component.html',
  styleUrls: ['./workexperience-modal.component.scss'],
  providers: [PopupCall]
})

export class WorkexperienceModalComponent extends FormValidation implements OnInit, OnChanges {

  @Input() content: "JOBS" | "CANDIDATE" | "PROFILE" | "BUSINESS" | "TEAM";
  @Input() header: string;
  @Input() ButtonName: "Submit" | "Update";
  @Input() supportModal: jobModuleConfig;
  public FORMERROR = super.Form;
  @Output('ModalEmitter') ModalEmitter = new EventEmitter<any>();
  @Input() workExperienceDetails: Partial<WorkExperience>;
  @Input() availableWorkExperience: Array<Partial<WorkExperience>>;
  @Output() profileListener = new EventEmitter<Partial<PROFILE_LISTENER>>();
  @Output() closeEmitter = new EventEmitter<string>();
  @ViewChild("businessEmails", { static: true }) businessEmails: TemplateRef<any>;
  @ViewChild("WorkExperience", { static: true }) WorkExperience: TemplateRef<any>;
  SucessModalContent: Array<{
    first: string, email: string, second: string,
    third: string, fourth: string
  }> = [
      {
        first: 'Your Primary email address has been updated to ',
        email: "prasanna@gmail.com",
        second: 'Please use this email address to login to the system going forward. ',
        third: 'Note: Your earlier email adderss has been moved to Secondary email in your profile',
        fourth: 'Secondary email can be used to reset your login crednetials if your lose access to the current business email'
      }
    ];
  showBusinessModal: boolean = false;
  showSucessMessage: boolean = false;
  isAdmin: boolean = false;
  isEmployee: boolean = false;
  stepCount: number = 1;
  businessModalTitle = "Authenticate Business Email Address"
  BusinessModal !: BsModalRef;
  WorkExperienceModal !: BsModalRef;
  businessEmailForm: UntypedFormGroup;
  WorkExperienceForm: UntypedFormGroup;
  OTPSENT: boolean = false;
  validateMonth: boolean;
  userType = localStorage.getItem('userType');
  userId = localStorage.getItem('userId');
  // orgList: Array<Partial<HealthCareOrganization>> = [];
  searchBarShow1: boolean = false;
  timezoneslist: Array<string> = [];
  disable: Array<string> = [];
  enable: Array<string> = [];
  currentOrgnization: HealthCareOrganization;
  stateList: Array<State> = [];
  currentYear: number = new Date().getFullYear();
  countryList: Array<Country> = [];
  years: Array<number> = [];
  currentclientType: string = "";
  clientTypeList: Array<string> = [];
  titleLists: Array<string> = [];
  approve: boolean = false;
  OrganizationSubject = new Subject<string>();
  months: Array<{ code: number, name: string }> = this.MONTHS;
  domainList: Array<string> = [];
  otpEmailSent: boolean = false;
  resentOTPCode = new BehaviorSubject<boolean>(true);
  firstName: string;
  lastName: string;
  primaryEmail: string = "";
  secondaryEmail: string = "";
  showThisProfile: boolean;
  citiesSubject = new Subject<string>();
  ProfileDetailsResponse: any;
  isGenericMailValid: boolean = false;
  emailMatchingBusiness: boolean = false;
  isUserFromProfileClickPlusButton: boolean = false;
  superAdminRightsChange: boolean = false;
  isSuperAdmin: boolean = false;
  superAdminDetails: any = null;
  tempOrganizationData: any;
  userInfoForOtpGenrate: { email: string, firstName: string, lastName: string, userId: string };
  originalOrganisationName: string;
  valueOnChangesSubscription: Subscription;
  initialState: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false,
    size: ''
  };
  searchSubject = new Subject<string>();
  expData: any;

  constructor(private modalService: BsModalService, private elementRef: ElementRef, private formbuilder: UntypedFormBuilder, private api: ApiService, private util: UtilService,
    private cdr: ChangeDetectorRef, public gigsumoService: GigsumoService, private activatedRoute: ActivatedRoute,
    private location: Location, private router: Router, public popupTracking: PopupCall, private commonValues: CommonValues) {
    super();

  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngAfterContentChecked(): void {
  }

  ngOnInit() {

    this.profiledetails();
    this.findByListApi();
    this.generateYears1();

    let currentPath: string = this.location.path().split('?')[0];

    if (currentPath.slice(1) === "personalProfile"
      && (this.content === "JOBS" || this.content === "CANDIDATE")) {
      this.isUserFromProfileClickPlusButton = true;

    }
    else this.isUserFromProfileClickPlusButton = false;

    this.intializeReactiveForms(this.content);
    setTimeout(() => {
      this.getCountries();
      this.subscribeToOrganisationNameControl();
    }, 1000);

    if (this.content === "PROFILE") {
      this.superAdmin();
    }
    this.searchUsZipCodes();

    this.searchSubject.pipe(
      debounceTime(1000),
      distinctUntilChanged()
    )
      .subscribe(
        res => {
          this.getOrgList(res);
        }
      )
  }

  manageOrgList(value) {
    this.searchSubject.next(value);
  }

  subscribeToOrganisationNameControl() {
    this.valueOnChangesSubscription = this.WorkExperienceForm.get('organisationName').valueChanges.subscribe((newValue) => {
      if (this.WorkExperienceForm.get('organisationName').touched
        && this.originalOrganisationName != newValue) {
        this.patchValue({
          clientType: null,
          organizationId: null,
          organisationId: null,
          businessId: null,
        })

        // Object.keys(this.WorkExperienceForm.controls).forEach(controlName => {
        //   this.WorkExperienceForm.controls["zipcode"].enable()
        //   this.WorkExperienceForm.controls["city"].enable()
        //   this.WorkExperienceForm.controls["state"].enable()
        //   this.WorkExperienceForm.controls["country"].enable()
        // })
        this.isGenericMailValid = this.checkGenricMail() != -1;
      }
    })
  }


  ngOnDestroy() {
    if (this.valueOnChangesSubscription) {
      this.valueOnChangesSubscription.unsubscribe();
    }
    if (this.searchSubject) {
      this.searchSubject.unsubscribe()
    }
  }

  searchUsZipCodes() {
    this.citiesSubject.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(res => {
      this.util.startLoader();
      this.gigsumoService.getUsaCities(res).subscribe(cities => {
        if (cities != null) {
          this.util.stopLoader();
          if (Array.isArray(cities)) {
            cities.forEach(element => {
              this.patchValue({ city: element.cityName, state: element.stateName })
            })
          }
        }
      }, error => {
        this.util.stopLoader();
      });
    });
  }

  isEntityExisting: boolean = false;
  profiledetails() {
    this.gigsumoService.PROFILEDETAILS.subscribe(res => {
      if (res.code === '00000') {
        this.ProfileDetailsResponse = res;
        const isOrganisationNameMutable = this.ProfileDetailsResponse.data.isCandidatesOrJobsAvailable ? true : false;
        if (isOrganisationNameMutable && this.ButtonName === "Update") {
          this.isEntityExisting = true;
          this.disable = ['organisationName', 'city', 'state', 'country', 'zipcode'];
          this.disableFields(this.disable);
        }
        // else {
        //   this.isEntityExisting = false;
        //   this.enable = ['organisationName', 'city', 'state', 'country', 'zipcode']
        //   this.enableFields(this.enable);
        // }
        const userValue: UserModel = res.data.userData;
        if (this.ButtonName != 'Update') {
          this.currentclientType = userValue.clientType;
        }
        res.data.GIGSUMO_GENERIC_EMAIL_DOMAINS.listItems.forEach(ele => {
          this.domainList.push(ele.item);
        });
        this.firstName = userValue.firstName;
        this.lastName = userValue.lastName;
        this.primaryEmail = userValue.email;
        this.isGenericMailValid = this.checkGenricMail() != -1;
        if (userValue.secondaryEmail == null || userValue.secondaryEmail == undefined) {
          this.secondaryEmail = 'None provided';
        } else {
          this.secondaryEmail = userValue.secondaryEmail;
        }

        this.isEmailLinkedToBusinessPage();
      }

      // if this is user first Work Exp / Currrent Organization
      if (this.isWorkExpEmpty) this.firstTimeValidation();
    });
  }

  organizationData: any = {};



  intializeReactiveForms(value?: string) {
    this.businessEmailForm = new AppSettings().getBusinessValidationForm();
    this.WorkExperienceForm = new AppSettings().getWorkExperienceForm();
    // if(this.content!= "PROFILE"){
    this.WorkExperienceModal = this.modalService.show(this.WorkExperience, this.initialState);
    // }
    if (value != "PROFILE") {
      this.updateWorkExpereinceForm();
    }
    else if (value === "PROFILE" && this.ButtonName === "Update") {
      let workExpData = this.workExperienceDetails;
      this.profileEditUpdation(workExpData);
      if (workExpData.currentOrganization) {
        !this.isJobSeeker ? this.setValidators(['timeZone']) : this.clearValidators(['timeZone']);
      }
    }

  }

  firstTimeValidation() {
    this.patchValue({ currentOrganization: true, badge: true, clientType: this.currentclientType != "" ? this.currentclientType : null })
    this.clearValidators(['endMonth']);
    if (!this.isJobSeeker) this.setValidators(['timeZone']);
  }

  profileEditUpdation(workExpData: Partial<WorkExperience>) {
    this.tempOrganizationData = this.workExperienceDetails;

    workExpData.action = null;
    this.currentclientType = workExpData.clientType;
    this.patchValue(workExpData);
    // if currentOrganization true clear the validators if not setvalidators
    workExpData.currentOrganization ?
      this.clearValidators(['endMonth', 'endYear']) : this.setValidators(['endMonth', 'endYear']);
    this.timeZonecountryvalues(workExpData.country);
  }
  superAdmin() {
    let data: Partial<superAdminDetails> = {};
    let value;

    if (this.availableWorkExperience.length > 0) {
      value = this.availableWorkExperience[0];
    }

    if (this.ButtonName === 'Update') {
      data = {
        userId: this.userId,
        organisationId: value.currentOrganization ? value.organisationId : this.workExperienceDetails.organisationId
      };
      data.status = "CALL";
    }
    else {
      if (!this.isWorkExpEmpty && (value && value.currentOrganization)) {
        data = { userId: this.userId, organisationId: value.organisationId, status: "CALL" };
      }
    }

    if (data.status === "CALL") {
      this.gigsumoService.isSuperAdmin(data).subscribe(isAdmin => {
        if (isAdmin.code === GigsumoConstants.SUCESSCODE) {
          const isEmployee = isAdmin.data.isEmployee;
          const code = isAdmin.data.businessStatusCode;
          const businessData = isAdmin.data.businessData;
          if ((code === GigsumoConstants.SUPERADMIN_BUSINESS_HAS_MEMBERS ||
            code === GigsumoConstants.SUPERADMIN_BUSINESS_NO_MEMBERS) &&
             businessData.status === GigsumoConstants.ACTIVE) {
            this.superAdminDetails = isAdmin;
            this.isAdmin = true;

            if (this.ButtonName === "Update" && this.workExperienceDetails.currentOrganization) {
              this.disableFields(['city', 'state', 'country', 'zipcode', 'organisationName', 'clientType']);
              this.isSuperAdmin = true;
            }
          }
          else if (isEmployee) {
            if (this.ButtonName === "Update" && this.workExperienceDetails.currentOrganization) {
              this.disableFields(['city', 'state', 'country', 'zipcode', 'organisationName', 'clientType']);
              this.isEmployee = true;
            }
            this.superAdminDetails = isAdmin;
          }
          else if(code === GigsumoConstants.NO_ADMIN_BUSINESS_FOUND || code === GigsumoConstants.NO_BUSINESS){
             this.superAdminDetails = isAdmin;
          }
          this.isAdmin = false;
        }
        else {
          this.enableFields(['organisationName']);
          this.superAdminDetails = null;
          this.isSuperAdmin = false;
        }
      });
    }
  }



  patchControl(key: string, data: any) {
    this.WorkExperienceForm.get(key).patchValue(data)
  }

  updateWorkExpereinceForm() {
    this.patchValue({ currentOrganization: true, badge: true });
    this.clearValidators(['endMonth']);
    !this.isJobSeeker ? this.setValidators(['timeZone']) : this.clearValidators(['timeZone']);
    this.disable = ['currentOrganization', 'badge'];
    this.disableFields(this.disable);
  }

  disableFields(value: Array<string>) {
    for (let key of value) {
      this.WorkExperienceForm.get(key).disable();
    }
  }

  enableFields(value: Array<string>) {
    for (let key of value) {
      this.WorkExperienceForm.get(key).enable();
      this.WorkExperienceForm.get(key).updateValueAndValidity();
    }
  }

  patchValue(value: Partial<workExperienceDetails>) {
    this.WorkExperienceForm.patchValue({ ...value });


  }

  get businessControl() {
    return this.businessEmailForm.controls;
  }

  get workExperienceControl() {
    return this.WorkExperienceForm.controls;
  }

  generateOtp(data: { email: string, firstName: string, lastName: string, userId: string }, resentOtpClick: boolean = false): Observable<any> {
    return this.api.create('user/sendOtpToMailId', data);
  }

  processOTPresponse(data: { email: string, firstName: string, lastName: string, userId: string }, resentOtpClick: boolean = false) {
    this.api.create('user/sendOtpToMailId', data)
      .subscribe(otpValidation => {
        if (otpValidation.code == '00000') {
          this.util.stopLoader();
          if (!resentOtpClick) {
            timer(30000).subscribe((x) => {
              this.resentOTPCode.next(false);
            });
          } else {
            this.resentOTPCode.next(true);
            timer(30000).subscribe((x) => {
              this.resentOTPCode.next(false);
            });
          }
          this.otpEmailSent = true;

          this.businessEmailForm.get('domainValidationOtp').setValidators([Validators.required]);
          this.businessEmailForm.get('domainValidationOtp').updateValueAndValidity();

          this.businessEmailForm.get('domainValidationOtp').setErrors({ wrongDomainValidationOtp: null });
          this.businessEmailForm.get('domainValidationOtp').updateValueAndValidity({ emitEvent: false });

          this.businessEmailForm.get('swapEmail').setErrors({ emailExistsAlready: null });
          this.businessEmailForm.get('domainValidationOtp').updateValueAndValidity({ emitEvent: false });

        } else if (otpValidation.code == '99998') {
          this.util.stopLoader()
          this.businessEmailForm.get('swapEmail').setErrors({ emailExistsAlready: true });
        }
      })
  }


  validateOtp(param) {
    if (this.businessEmailForm.value.domainValidationOtp == null || this.businessEmailForm.value.domainValidationOtp == '' || this.businessEmailForm.value.domainValidationOtp == undefined) {
      this.businessEmailForm.get('domainValidationOtp').setErrors({ wrongDomainValidationOtp: true });
    } else {

      let data: { primaryMailId: string, secondaryMailId: string, entityId: string, businessId: string, otp: number } = {
        primaryMailId: '',
        secondaryMailId: '',
        entityId: '',
        businessId: '',
        otp: 0
      };

      data.primaryMailId = this.businessEmailForm.value.swapEmail;
      this.SucessModalContent[0].email = this.businessEmailForm.value.swapEmail;

      if (this.secondaryEmail == null || this.secondaryEmail == undefined || this.secondaryEmail == 'None provided') {
        data.secondaryMailId = this.primaryEmail;
      } else if (this.secondaryEmail != null && this.secondaryEmail != undefined && this.secondaryEmail != 'None provided') {
        data.secondaryMailId = this.secondaryEmail;
      }

      data.entityId = this.userId;
      data.businessId = this.userId;
      data.otp = this.businessEmailForm.value.domainValidationOtp;

      this.api.create('user/verifyOTPToPrimaryMailId', data).subscribe(res => {
        this.util.startLoader();
        if (res.code == '00000' && res.message != 'Invalid OTP') {
          this.util.stopLoader();
          this.businessEmailForm.get('domainValidationOtp').setErrors({ wrongDomainValidationOtp: null });
          this.businessEmailForm.get('domainValidationOtp').updateValueAndValidity({ emitEvent: false });
          this.businessEmailForm.get('swapEmail').setErrors({ genericDomain: null });
          this.businessEmailForm.get('swapEmail').updateValueAndValidity({ emitEvent: false });
          if (this.approve) {
            this.patchValue({ action: "APPROVED" });
          }
          this.showSucessMessage = true;
        } else if (res.code == '99999') {
          this.util.stopLoader();
          this.SucessModalContent[0].email = "";
          this.businessEmailForm.get('domainValidationOtp').setErrors({ wrongDomainValidationOtp: true })
        }
        else if (res.code == '99998') {
          this.util.stopLoader();
          this.SucessModalContent[0].email = "";
          this.businessEmailForm.get('domainValidationOtp').setErrors({ wrongDomainValidationOtp: true })

        }
      });
    }
  }

  businessModalClose() {
    this.gigsumoService.getResponseMessage("CANCELEMAILAUTHENTICATION").then((response: SweetAlertResult) => {
      if (response.isConfirmed) {
        this.showBusinessModal = false;
        this.stepCount = 1;
        this.otpEmailSent = false;
        this.resentOTPCode.next(false);
        this.businessEmailForm.get('domainValidationOtp').patchValue(null);
        this.businessEmailForm.get('domainValidationOtp').setErrors({ wrongDomainValidationOtp: null });
        this.businessEmailForm.get('domainValidationOtp').clearValidators();
        this.businessEmailForm.get('domainValidationOtp').updateValueAndValidity();
        this.businessEmailForm.get('swapEmail').setErrors({ genericDomain: null });
        this.businessEmailForm.get('swapEmail').updateValueAndValidity({ emitEvent: false });
        this.businessEmailForm.get('swapEmail').setErrors({ emailExistsAlready: null });
        this.businessEmailForm.get('swapEmail').updateValueAndValidity({ emitEvent: false });
        this.businessEmailForm.reset();
      }
      else if (response.dismiss === Swal.DismissReason.cancel) {
        // this.showBusinessModal = false;

      }
    })


  }



  get isFreeLancerOrJobseeker(): boolean {
    return this.userType === 'FREELANCE_RECRUITER' || this.userType === 'JOB_SEEKER';
  }

  get isJobSeeker(): boolean {
    return this.userType === GigsumoConstants.JOB_SEEKER;
  }

  get isFormValid(): boolean {
    return this.WorkExperienceForm.valid;
  }

  get isChanginClientType(): boolean {
    return this.currentclientType != "" && !this.isJobSeeker && this.ButtonName === "Update" &&
      this.currentclientType != this.WorkExperienceForm.get('clientType').value;
  }

  get isUserCreatingWorkExpwithGenericMail(): boolean {
    return this.isGenericMailValid && this.getControlValue('currentOrganization');
    // return this.isGenericMailValid && this.getControlValue('currentOrganization') && this.userType != "FREELANCE_RECRUITER";
  }

  // getCurrentOrganizationtData() {
  //   return this.ButtonName == "Submit" ? this.availableWorkExperience[0]
  // }

  isLocationChanged(): boolean {
    return (this.getControlValue('country') != this.tempOrganizationData.country ||
      this.getControlValue('zipcode') != (this.tempOrganizationData.zipcode || this.tempOrganizationData.zipCode) ||
      this.getControlValue('state') != this.tempOrganizationData.state ||
      this.getControlValue('city') != this.tempOrganizationData.city||
      this.getControlValue('organisationName') != this.tempOrganizationData.organisationName);
  }

  // updateOrganizationId() {
  //   this.isLocationChanged() ?
  //     this.patchControl("organisationId", null) :
  //     this.patchControl("organisationId", this.tempOrganizationData.organisationId || this.tempOrganizationData.organizationId);
  // }
  updateOrganizationId() {
    this.isLocationChanged() ?
      (this.patchControl("organisationId", null), this.patchControl("businessId", null)) :
      (this.patchControl("organisationId", this.tempOrganizationData.organisationId || this.tempOrganizationData.organizationId),
       this.patchControl("businessId", this.tempOrganizationData.businessId)); // Adjust as needed
  }

  get isOrganizationSame(): boolean {
    return this.getControlValue('currentOrganization') && this.availableWorkExperience.length > 0 &&
      this.availableWorkExperience.some(res => res.currentOrganization === true) &&
      (
        this.ButtonName === "Submit" ?
          (this.availableWorkExperience.find(res => res.currentOrganization === true).organisationId === this.getControlValue('organisationId'))
          : !this.workExperienceDetails.currentOrganization && this.availableWorkExperience.find(res => res.currentOrganization === true).organisationId === this.getControlValue('organisationId')
      );
  }

  prerequisiteWorkExperience(call: string) {


    // patch the organizationId based on changes of Location
    const orgId = this.getControlValue('organisationId');
    if (orgId != null) {
      this.updateOrganizationId();
    }

    this.WorkExperienceForm.markAllAsTouched();
    if (this.isFormValid) {

      // if the superAdminDetails is not nul then user has curent organization and
      // he can be either super admin or employee of the busienss
      // if it's null he's not the superAdmin nor he has business

      if((this.superAdminDetails != null && this.isUserTryingToCreateCurentOrganziation) ||
        (this.ButtonName === "Update" && this.workExperienceDetails.currentOrganization)){

        let existingCurOrg: any;
        existingCurOrg = this.availableWorkExperience.filter(exp => exp.currentOrganization === true);
        const code = this.superAdminDetails.data.businessStatusCode;
        const status = this.superAdminDetails.data.businessData ? this.superAdminDetails.data.businessData.status : null;

        if(this.ifSuperAdmin(code) && (status && status === GigsumoConstants.ACTIVE)){

          if(this.workExperienceDetails.currentOrganization && !this.getControlValue('currentOrganization')){

            this.gigsumoService.getResponseMessage(code).then(resp=>{
              if(resp.isConfirmed){
                this.Super_Admin_Business_Updating(
                  code === GigsumoConstants.SUPERADMIN_BUSINESS_HAS_MEMBERS
                  ? "HAS_MEMBER" :
                    'NO_MEMBER');
              }
            });

          }
          else{
            this.saveWorkExperience(call);
          }

        }
        else if(((code === GigsumoConstants.NO_ADMIN_BUSINESS_FOUND || code === GigsumoConstants.NO_BUSINESS) ||
               (status && (status === GigsumoConstants.INACTIVE || status === GigsumoConstants.BLOCKED)))){

          // if the editing workExp is already current Organization user trying to uncheck and update it
          if ((this.workExperienceDetails.currentOrganization && !this.getControlValue('currentOrganization')) && !this.isSuperAdmin) {
            this.gigsumoService.getResponseMessage(GigsumoConstants.CHANGING_CURRENORG , 'change').then(response => {
              if (response.isConfirmed) {
                this.profileUpdateWorkExperience();
              }
            });
            return;
          }
          else if(this.workExperienceDetails.currentOrganization && this.getControlValue('currentOrganization')) {
            this.saveWorkExperience(call);
          }
          else {

            this.gigsumoService.getResponseMessage(GigsumoConstants.NO_ADMIN_BUSINESS_FOUND).then(response => {
              if (response.isConfirmed) {
                  this.showBusinessModal = true;
                  this.businessModalTitle = "Authenticate Business Email Address";
                  this.approve = true;
                  this.otpEmailSent = false;
                  this.stepCount = 2;
              }
            });

          }

        }

      }
      else{
        this.saveWorkExperience(call);
      }


      // if (this.isUserTryingToCreateCurentOrganziation) {
      //   let existingCurOrg: any;
      //   existingCurOrg = this.availableWorkExperience.filter(exp => exp.currentOrganization == true)
      //   this.superAdminChecking(existingCurOrg[0], call);
      // } else {
      // }
    }
  }


  ifSuperAdmin(code) : boolean {
    return (code ===GigsumoConstants.SUPERADMIN_BUSINESS_HAS_MEMBERS || code === GigsumoConstants.SUPERADMIN_BUSINESS_NO_MEMBERS);
  }

  openSupport() {
    if (this.supportModal) {
      this.closeModal();
      this.supportModal.jobDetails.apply(this.supportModal.source, []);
    }
  }


  saveWorkExperience(call: string) {

    this.subscribeToEmailValue()
    let called = this.popupTracking.isPopupShowedMorethanOneTime('CHANGE_CLIENT');

    if (this.content === "PROFILE" && this.isOrganizationSame && this.getControlValue('currentOrganization')) {
      this.gigsumoService.getResponseMessage("TWO_SAME_CURRENTORGANIZATION");
    } else if (this.emailLinkedToBusiness && this.workExperienceControl.currentOrganization.value && this.ButtonName == 'Submit' && this.emailMatchingBusiness == false) {
      this.openBusinessModal();
    }
    else if (this.isChanginClientType && !called) {

      this.gigsumoService.getResponseMessage("CHANGING_CLIENT_TYPE").then(response => {
        // if (response.isConfirmed) {
        //   this.popupTracking.content.push({ Type: "CHANGE_CLIENT", count: 1 });
        // }
        // this changes committed for now as per sunny new requirement may be we can use this in future

        if (response.isConfirmed) {
          this.callBusinessOrSave(this.content);
        }
      });
    }
    else {

      if (this.content != "PROFILE") {

        if (this.isUserCreatingWorkExpwithGenericMail) {
          this.openBusinessModal();
        } else {
          this.currentOrganizationSave();
        }
      }
      else {

        //  this is FR functionality popup may be we can use this in future So commenting it By prasanna
        // if(this.WorkExperienceForm.value.badge === true){
        //     this.validateShowthisProfile(call);
        // }

        if (call === "Update") {

          this.profileUpdateWorkExperience();
        }
        else if (call === "Submit") {
          this.isCurrentOrganizationEmpty();
        }


      }

    }
  }


  superAdminChecking(res : any , workExpData: Partial<WorkExperience>, call: string) {

      if (res && res.code === GigsumoConstants.SUCESSCODE) {
        let businessCode: BUSINESS_STATUS_CODE = res.data ? res.data.businessStatusCode : (res.data === null && "00000");
        if (res && res.data && res.data.businessData &&
          this.isUserTryingToCreateCurentOrganziation && this.ButtonName == 'Submit') {
          let businessData = res.data.businessData;

          const adminData: BusinessModal = res.data ? res.data.businessData : null;
          if (businessCode !== "10003" && adminData && adminData.status === GigsumoConstants.INACTIVE) {
            businessCode = "10003";
          }
          this.showInfoMessage({
            AdminData: (businessCode === "10000" ||
             businessCode === "10003" ||
             businessCode === "00000") ? workExpData : adminData,
            content: businessCode,
            businessData: businessData
          }, call);
        } else {
          this.saveWorkExperience(call);
        }
      }
  }

  isBusinessModalData(objects: WorkExperienceOrBusiness): objects is BusinessModal {
    return (<BusinessModal>objects).businessName !== undefined;
  }

  showInfoMessage(value: { AdminData: BusinessModal | Partial<WorkExperience>, content: BUSINESS_STATUS_CODE, businessData }, call: string) {

    let data: "NO_MEMBER" | "HAS_MEMBER" ;
    data =  value.content === "10001" ? "NO_MEMBER" : "HAS_MEMBER";

    if (data === "NO_MEMBER") {

      this.gigsumoService.getResponseMessage(GigsumoConstants.SUPERADMIN_BUSINESS_NO_MEMBERS).then(response => {
        if (response.isConfirmed) {
          this.closePopup();
          this.router.navigate(['/landingPage/business']);
        }
      });

    } else if (data === "HAS_MEMBER") {

      // if (value.businessData.employeesCnt > 1 && (value.businessData.status == 'INACTIVE' || value.businessData.status == 'BLOCKED')) {
      //   this.showBusinessModal = true;
      //   this.businessModalTitle = "Authenticate Business Email Address"
      //   this.approve = true;
      //   this.otpEmailSent = false;
      //   this.stepCount = 2;
      // } else
        this.gigsumoService.getResponseMessage(GigsumoConstants.SUPERADMIN_BUSINESS_HAS_MEMBERS, value.businessData.businessName).then(response => {
          if (response.isConfirmed) {

          }
        })
      }
  }

  isCurrentOrganizationEmpty() {
    let called = this.popupTracking.isPopupShowedMorethanOneTime('MAKE_CURRENT');
    if (this.needtoChangeCurrent && !called &&
      !this.WorkExperienceForm.value.currentOrganization) {
      this.createCurrentOrganization();
    }
    else {
      this.isUserCreatingWorkExpwithGenericMail ? this.openBusinessModal() : this.profileSaveWorkExeperience();
    }
  }

  get needtoChangeCurrent(): boolean {
    const isAvailable: boolean = this.availableWorkExperience.length > 0 && this.availableWorkExperience.some(data => data.currentOrganization === true);
    return !isAvailable;
  }

  createCurrentOrganization() {
    if (!this.hasCurrentOrganization) {
      this.gigsumoService
        .getResponseMessage("MAKECURRENT")
        .then((response: SweetAlertResult<any>) => {
          if (response.isConfirmed) {
            this.popupTracking.content.push({ Type: "MAKE_CURRENT", count: 1 });
            // for now commented by Prasanna
            // this.patchValue({ currentOrganization: true, badge: true });
            // if(!this.isJobSeeker) this.setValidators(['timeZone']);
          }
        });
    }
  }


  callBusinessOrSave(value: string) {

    if (value != "PROFILE") {
      this.isGenericMailValid ? this.openBusinessModal() : this.currentOrganizationSave();
    }
    else {
      if (this.ButtonName != "Update") {
        this.isGenericMailValid ? this.openBusinessModal() : this.profileSaveWorkExeperience();
      }
      else {
        this.isGenericMailValid ? this.openBusinessModal() : this.profileUpdateWorkExperience();
      }
    }

  }


  get isUserTryingToCreateCurentOrganziation(): boolean {
    return (
      // this.getControlValue("currentOrganization") &&
      // (this.ButtonName === "Submit"
      //   ? this.hasCurrentOrganization && this.userType != "FREELANCE_RECRUITER"
      //   : (!this.workExperienceDetails.currentOrganization && this.hasCurrentOrganization && this.userType != "FREELANCE_RECRUITER"))
      this.getControlValue("currentOrganization") &&
      (this.ButtonName === "Submit"
        ? this.hasCurrentOrganization
        : (!this.workExperienceDetails.currentOrganization && this.hasCurrentOrganization))
    );
  }

  emailLinkedToBusiness: boolean = false
  organizationExist: boolean = false;

  async isEmailLinkedToBusinessPage() {
    const email = (this.ProfileDetailsResponse
      && this.ProfileDetailsResponse.data
      && this.ProfileDetailsResponse.data.userData
      && this.ProfileDetailsResponse.data.userData.email) ? this.ProfileDetailsResponse.data.userData.email : null;

    // if (null != email) {
    //   if (this.checkGenricMail() == -1) {
    //     await this.businessEmailValidatedAgainstBusinessOrganisation(email)
    //       .subscribe(bus => {
    //         if (bus
    //           && bus.data
    //           && bus.data.businessData
    //           && typeof bus.data.businessData == 'object') {
    //           this.emailLinkedToBusiness = true
    //         } else if (bus
    //           && bus.data
    //           && Object.keys(bus.data).length == 0) {
    //           this.emailLinkedToBusiness = false
    //         }
    //       })
    //   }
    // }


    if (null != email) {
      if (this.checkGenricMail() == -1) {
        await this.businessEmailValidatedAgainstBusinessOrganisation(email)
          .subscribe(bus => {

            if (bus && bus.data && bus.data.businessData) {

              if (bus.data.organizationData   && !this.hasCurrentOrganization &&
                bus.data.businessData.status === GigsumoConstants.ACTIVE) {
                this.emailLinkedToBusiness = true;
                this.organizationData = bus.data.organizationData;
                if (bus.data.experienceData && bus.data.experienceData.length > 0) {
                  this.expData = bus.data.experienceData[0];
                }
                this.organizationExist = true;
                this.emailMatchingBusiness = bus.data.businessData.organisationId === this.organizationData.organizationId ? true : false;
                this.updateOrganizationdata(this.organizationData, this.expData);
                this.isGenericMailValid = bus.data.businessData.organisationId != this.WorkExperienceForm.value.organizationId ? true : false;
                this.timeZonecountryvalues(this.organizationData.country);
              }

            } else if (bus
              && bus.data
              && Object.keys(bus.data).length == 0) {
              this.emailLinkedToBusiness = false
            }
          });
      }
    }
  }


  updateOrganizationdata(organizationData: any, expData: any) {

    if (organizationData) {

      let companyLocationDetails = {
        country: organizationData.country,
        city: organizationData.city,
        state: organizationData.state,
        organizationId: organizationData.organizationId,
        organisationName: organizationData.organizationName,
        businessId: organizationData.businessId,
        zipcode: organizationData.zipCode,
        addEmployee: true
      };

      this.disableFields(['zipcode', 'country', 'state', 'city', 'organisationName', 'clientType']);

      let cli;
      if (expData && expData.clientType) {
        cli = expData.clientType;
      }

      this.patchValue({
        ...companyLocationDetails,
        clientType: cli,
      });


    }
  }



  get hasCurrentOrganization(): boolean {
    return (this.availableWorkExperience != null && this.availableWorkExperience.length > 0 &&
      this.availableWorkExperience.some(_data => _data.currentOrganization === true));
  }
  get getCurrentOrganization(): any {
    return (this.availableWorkExperience != null && this.availableWorkExperience.length > 0 &&
      this.availableWorkExperience.find(_data => _data.currentOrganization === true));
  }

  checkGenricMail(): number {
    let domainSplit: string = this.primaryEmail.split('@')[1];
    const genricDomain: number = this.domainList.indexOf(domainSplit);
    return genricDomain;
  }

  openBusinessModal() {
    if (this.isFormValid) {
      this.showBusinessModal = true;
      this.stepCount = 2;
      this.businessModalTitle = "Authenticate Business Email Address"
    }
  }

  get isBusinessActive(): boolean {
    return this.superAdminDetails.status === "ACTIVE";
  }

  get isBlocked_Deactivated(): boolean {
    return (this.superAdminDetails.status === GigsumoConstants.BLOCKED ||
      this.superAdminDetails.status === GigsumoConstants.DEACTIVATED);
  }


  async profileUpdateWorkExperience(formValue: Partial<WorkExperience> = this.workExperienceDetails, value: string = "SAVE") {
    if (this.isFormValid) {
      this.util.startLoader();
      let formData = value === "UPDATE" ? formValue : this.WorkExperienceForm.getRawValue();
      this.api.updatePut("user/v1/workexperience", formData).subscribe(updateWorkExpResponse => {
        try {
          switch (updateWorkExpResponse.code) {
            case GigsumoConstants.SUCESSCODE:
              this.WorkExperienceForm.reset();
              this.modalService.hide(1);
              this.profileListener.emit({ content: "UPDATESUCESS", data: updateWorkExpResponse.data.experience });
              break;
            case GigsumoConstants.CHANGING_CURRENORG:
              this.gigsumoService.getResponseMessage(GigsumoConstants.CHANGING_CURRENORG).then(response => {
                if (response.isConfirmed) {
                  this.showBusinessModal = true;
                  this.businessModalTitle = "Authenticate Business Email Address"
                  this.approve = true;
                  this.otpEmailSent = false;
                  this.stepCount = 2;
                }
                else if (response.dismiss === Swal.DismissReason.cancel) {
                  this.showBusinessModal = false;
                  this.stepCount = 1;
                  this.approve = false;
                }
              });
              // this popup may be used in future so Commenting this By Prasanna
              // this.gigsumoService.getResponseMessage(GigsumoConstants.CHANGING_CURRENORG).then(response=>{
              //   if(response.isConfirmed){
              //     this.showBusinessModal = true;
              //     this.approve = true;
              //     this.otpEmailSent = false;
              //     this.stepCount = 2;
              //   }
              //   else if(response.dismiss ===  Swal.DismissReason.cancel){
              //       this.showBusinessModal= false;
              //       this.stepCount = 1;
              //       this.approve = false;
              //   }
              // });

              break;
            case GigsumoConstants.CURRENTORGANIZATION_NEED:
              this.gigsumoService.getResponseMessage(GigsumoConstants.CURRENTORGANIZATION_NEED);
              break;
            case GigsumoConstants.SUPERADMIN_BUSINESS_NO_MEMBERS:
              this.gigsumoService.getResponseMessage(GigsumoConstants.SUPERADMIN_BUSINESS_NO_MEMBERS, 'Change').then(response => {
                if (response.isConfirmed) {
                  this.Super_Admin_Business_Updating(
                    this.isBusinessActive ? "NO_MEMBER"
                      : this.isBlocked_Deactivated ? "BLOCKED" : "BLOCKED"
                  );
                }
              });
              break;
            case GigsumoConstants.SUPERADMIN_BUSINESS_HAS_MEMBERS:
              this.gigsumoService.getResponseMessage(GigsumoConstants.SUPERADMIN_BUSINESS_HAS_MEMBERS, updateWorkExpResponse.data.businessData.businessName).then(response => {
                if (response.isConfirmed) {
                  this.Super_Admin_Business_Updating(
                    this.isBusinessActive ? "HAS_MEMBER"
                      : this.isBlocked_Deactivated ? "BLOCKED" : "BLOCKED"
                  );
                }
              });
              break;
            case GigsumoConstants.NO_BUSINESS:
              this.gigsumoService.getResponseMessage(GigsumoConstants.NO_BUSINESS).then(response => {
                if (response.isConfirmed) {
                  this.showBusinessModal = true;
                  this.businessModalTitle = "Authenticate Business Email Address"
                  this.approve = true;
                  this.otpEmailSent = false;
                  this.stepCount = 2;
                }
              });
              break;
            default:
              break;
          }
          this.util.stopLoader();
        } catch (error) {
          this.util.stopLoader();
        }
      });

    }
  }

  profileSaveWorkExeperience() {

    if (this.isFormValid) {
      this.util.startLoader();
      this.api.create("user/v1/workexperience", this.WorkExperienceForm.getRawValue()).subscribe(updateWorkExpResponse => {
        try {
          switch (updateWorkExpResponse.code) {
            case GigsumoConstants.SUCESSCODE:
              this.WorkExperienceForm.reset();
              this.modalService.hide(1);
              this.profileListener.emit({ content: "SAVESUCESS", data: updateWorkExpResponse.data.experience });
              break;
            case GigsumoConstants.CHANGING_CURRENORG:
              this.gigsumoService.getResponseMessage(GigsumoConstants.CHANGING_CURRENORG).then(response => {
                if (response.isConfirmed) {
                  this.showBusinessModal = true;
                  this.businessModalTitle = "Authenticate Business Email Address"
                  this.approve = true;
                  this.otpEmailSent = false;
                  this.stepCount = 2;
                }
                else if (response.dismiss === Swal.DismissReason.cancel) {
                  this.showBusinessModal = false;
                  this.stepCount = 1;
                  this.approve = false;
                }
              });
              break;
            case GigsumoConstants.CURRENTORGANIZATION_NEED:
              this.gigsumoService.getResponseMessage(GigsumoConstants.CURRENTORGANIZATION_NEED);
              break;

            // these 3 statusCode currently not coming anyway we're going to use this in different API
            case GigsumoConstants.SUPERADMIN_BUSINESS_NO_MEMBERS:
              this.gigsumoService.getResponseMessage(GigsumoConstants.SUPERADMIN_BUSINESS_NO_MEMBERS, 'add').then(response => {
                if (response.isConfirmed) {
                  if (response.isConfirmed) {
                    this.Super_Admin_Business_Updating(
                      this.isBusinessActive ? "NO_MEMBER"
                        : this.isBlocked_Deactivated ? "BLOCKED" : "BLOCKED"
                    );
                    // for now commenting this old superAdmin functionality by Prasanna
                    // this.approve = true;
                    // this.superAdminRightsChange = true;
                    // this.stepCount = 2;
                  }
                }
              });
              break;
            case GigsumoConstants.SUPERADMIN_BUSINESS_HAS_MEMBERS:

              if (updateWorkExpResponse.data.businessData.employeesCnt == 1 && (updateWorkExpResponse.data.businessData.status == 'INACTIVE' || updateWorkExpResponse.data.businessData.status == 'BLOCKED')) {
                this.showBusinessModal = true;
                this.businessModalTitle = "Authenticate Business Email Address"
                this.approve = true;
                this.otpEmailSent = false;
                this.stepCount = 2;
              } else if (updateWorkExpResponse.data.businessData.employeesCnt == 1 && updateWorkExpResponse.data.businessData.status == 'ACTIVE') {
                this.gigsumoService.getResponseMessage(GigsumoConstants.SUPERADMIN_BUSINESS_NO_MEMBERS).then(response => {
                  if (response.isConfirmed) {
                    this.closePopup();
                    this.router.navigate(['/landingPage/business']);
                  }
                })
              } else {
                this.gigsumoService.getResponseMessage(GigsumoConstants.SUPERADMIN_BUSINESS_HAS_MEMBERS, updateWorkExpResponse.data.businessData.businessName).then(response => {
                  if (response.isConfirmed) {
                    this.Super_Admin_Business_Updating(
                      this.isBusinessActive ? "HAS_MEMBER"
                        : (this.isBlocked_Deactivated ? "BLOCKED" : "BLOCKED")
                    );
                  }
                });
              }
              break;
            case GigsumoConstants.NO_BUSINESS:
              this.gigsumoService.getResponseMessage(GigsumoConstants.NO_BUSINESS).then(response => {
                if (response.isConfirmed) {
                  this.showBusinessModal = true;
                  this.businessModalTitle = "Authenticate Business Email Address"
                  this.approve = true;
                  this.otpEmailSent = false;
                  this.stepCount = 2;
                }
              });
              break;
            default:
              break;
          }
          this.util.stopLoader();
        } catch (error) {
          this.util.stopLoader();
        }
      });
    }

  }

  Super_Admin_Business_Updating(val: "HAS_MEMBER" | "NO_MEMBER" | "BLOCKED") {


      if (val === "NO_MEMBER") {
        this.closePopup();
        this.router.navigate(['/landingPage/business']);
      }
      else if(val === "HAS_MEMBER"){
        let data: { businessId: string; businessName: string; menu: string } =
        {
          businessId: this.superAdminDetails.data.businessData.businessId,
          businessName: this.superAdminDetails.data.businessData.businessName,
          menu: "pageadmin"
        };
        this.closePopup();
        this.router.navigate(["/business"], { queryParams: data });
        //  route user to business manage page
      }

    // }
    // else if (val === GigsumoConstants.BLOCKED) {

    //   this.gigsumoService.getResponseMessage(GigsumoConstants.CHANGING_CURRENORG).then(response => {
    //     if (response.isConfirmed) {

    //     }
    //   });

    // }
  }

  superAdminRightsUpdating(businessData: Partial<WorkExperience>, data: "SAVE" | "UPDATE") {
    this.api.delete('business/remove/' + this.superAdminDetails.businessId).subscribe(businessResponse => {
      if (businessResponse.code === GigsumoConstants.SUCESSCODE) {
        businessData.badge = false;
        businessData.currentOrganization = false;
        businessData.action = "APPROVED";
        this.profileUpdateWorkExperience(businessData, "UPDATE");
        data === "SAVE" ? this.profileSaveWorkExeperience() : this.profileUpdateWorkExperience();
      }
    });
  }
  businessEmailValidatedAgainstBusinessOrganisation(email): Observable<any> {
    return this.api.create("business/checkBusinessByDomain/" + email, null);
  }

  handlePrerequisitesForEmailValidation() {
    this.afterConfirmation()


  }


  afterConfirmation() {
    this.businessEmailForm.markAllAsTouched();
    // console.log("businessfomr", this.businessEmailForm);

    if (this.businessEmailForm.valid) {

      this.util.startLoader();
      let validateEmail: string;
      validateEmail = this.businessEmailForm.value.swapEmail.split('@')[1];
      const a = this.domainList.indexOf(validateEmail);
      // console.log("domain list", this.domainList, "a", a);

      if (a != -1) {
        this.util.stopLoader();
        this.businessEmailForm.get('swapEmail').setErrors({ genericDomain: true });
      } else {
        this.businessEmailForm.get('swapEmail').setErrors({ genericDomain: null });
        this.businessEmailForm.get('swapEmail').updateValueAndValidity({ emitEvent: false });
        this.userInfoForOtpGenrate = {

          email: this.businessEmailForm.value.swapEmail,
          firstName: this.firstName,
          lastName: this.lastName,
          userId: this.userId

        }
        // this.generateOtp(this.userInfoForOtpGenrate);
        this.processEmailValidation(true);
      }
    }
  }

  subscribeToEmailValue() {
    if (this.businessEmailForm.get('swapEmail') != null) {
      this.valueOnChangesSubscription = this.businessEmailForm.get('swapEmail').valueChanges
        .pipe(
          debounceTime(1500),
          distinctUntilChanged()
        )
        .subscribe((emailValue: string) => {
          if (emailValue != '' && emailValue != null) {
            this.api.query("user/checkMailAlreadyExists/" + emailValue)
              .subscribe((res) => {
                if (res.data != null && res.data.exists) {
                  if (res.data.exists) {
                    this.businessEmailForm.get('swapEmail').setErrors({ emailExistsAlready: true });
                  }
                } else {
                  this.businessEmailForm.get('swapEmail').setErrors({ emailExistsAlready: null })
                  this.businessEmailForm.get('swapEmail').updateValueAndValidity({ emitEvent: false })
                }
              })
          }
        })
    }
  }

  processEmailValidation(value: boolean) {
    let resentOtpClick: boolean = value;
    this.businessEmailValidatedAgainstBusinessOrganisation(this.businessEmailForm.get('swapEmail').value)
      .pipe(switchMap(bus => {
        if (bus.data.businessData) {
          if (bus.data.businessData.organisationId != this.WorkExperienceForm.get('organisationId').value) {
            this.util.stopLoader();
            const value = bus.data.businessData.businessName;
            this.gigsumoService.getResponseMessage("CHECK_EMAIL_DOMAIN_AGAINST_BUSINESS_ORGANISATION", value).then(response => {

            })
          } else {
            this.util.stopLoader();

            this.WorkExperienceForm.patchValue({ addEmployee: true });
            return this.generateOtp(this.userInfoForOtpGenrate, true);
          }
        } else {

          this.util.stopLoader();
          if (!this.businessFoundAgainstWorkExperience) {
            this.processOTPresponse(this.userInfoForOtpGenrate, true);
          } else {
            const value = this.organizationRelatedToWork;
            this.gigsumoService.getResponseMessage("WORK_EXPERIENCE_HAS_BUSINESS_BUT_EMAIL_DOESNOT", value).then(response => {
              if (response.isDismissed) {
                this.showBusinessModal = false;
                this.stepCount = 1;
                this.approve = false;
                this.businessEmailForm.reset();
              }
            })
          }
        }

      }))

      .subscribe(otpValidation => {
        if (otpValidation.code == '00000') {
          this.util.stopLoader();
          if (!resentOtpClick) {
            timer(30000).subscribe((x) => {
              this.resentOTPCode.next(false);
            });
          } else {
            this.resentOTPCode.next(true);
            timer(30000).subscribe((x) => {
              this.resentOTPCode.next(false);
            });
          }
          this.otpEmailSent = true;

          this.businessEmailForm.get('domainValidationOtp').setValidators([Validators.required]);
          this.businessEmailForm.get('domainValidationOtp').updateValueAndValidity();

          this.businessEmailForm.get('domainValidationOtp').setErrors({ wrongDomainValidationOtp: null });
          this.businessEmailForm.get('domainValidationOtp').updateValueAndValidity({ emitEvent: false });

          this.businessEmailForm.get('swapEmail').setErrors({ emailExistsAlready: null });
          this.businessEmailForm.get('domainValidationOtp').updateValueAndValidity({ emitEvent: false });

        } else if (otpValidation.code == '99998') {
          this.util.stopLoader()
          this.businessEmailForm.get('swapEmail').setErrors({ emailExistsAlready: true });
        }
      })
  }


  validateShowthisProfile(content: string) {
    if (this.isShowthisProfileValid && this.isFreeLancer) {
      this.gigsumoService.getResponseMessage("CHANGEPROFILE").then(response => {
        if (response.isConfirmed) {
          const userWorkExperience: Partial<WorkExperience> = this.workExperienceDetails;
          this.submitFreelancer(content);
        }
        else {
          this.patchValue({ badge: false });
        }
      });
    }
    else {

      if (this.isGenericMailValid) {
        this.openBusinessModal();
      }
      else {
        content === "Update" ? this.profileUpdateWorkExperience() : this.profileSaveWorkExeperience();
      }

    }
  }

  getMonthName(code: number): string {
    return this.months.find(ele => ele.code === code).name;
  }

  async submitFreelancer(content: string) {
    if (this.availableWorkExperience.length > 0) {
      this.availableWorkExperience.forEach(workResponse => {
        if (workResponse.currentOrganization) {
          workResponse.currentOrganization = false;
          workResponse.action = "APPROVED";
          workResponse.endMonth = this.getMonthName(new Date().getMonth() + 1);
          workResponse.endYear = String(new Date().getFullYear());
          this.profileUpdateWorkExperience(workResponse, "UPDATE");
          // console.log("first" , workResponse);
          if (content === "Submit") {
            this.patchValue({ action: "APPROVED" });
            this.profileSaveWorkExeperience();
          }
        }
        if (content === "Update" && workResponse.expId === this.getControlValue('expId')) {
          // this.patchValue({badge:true});
          workResponse = this.WorkExperienceForm.getRawValue();
          this.profileUpdateWorkExperience(workResponse, "UPDATE");
          // console.log("last" , workResponse);
        }


      });
    }
  }

  get isShowthisProfileValid(): boolean {
    return this.workExperienceDetails.badge ? false : this.availableWorkExperience.some(data => data.badge);
  }

  closeModal() {
    this.commonValues.setclickitem(true);
    this.gigsumoService.buttonClicked = true;
    // this.WorkExperienceModal.hide();
    this.modalService.hide(1);
    this.content === "TEAM" ? this.ModalEmitter.emit({ content: "CLOSE" }) : this.closeEmitter.emit('CLOSE');
  }


  getControlValue(key: string) {
    return this.WorkExperienceForm.get(key).value;
  }

  get isFreeLancer(): boolean {
    return this.userType === GigsumoConstants.FREELANCE_RECRUITER;
  }


  async OpenModal() {
    if (this.content === "PROFILE") {

      // commenting for now might be use in future by prasanna
      // if(this.superAdminRightsChange){
      //    let data: {userId : string , organisationId: string};
      //     if(Array.isArray(this.availableWorkExperience)){
      //       this.availableWorkExperience.forEach(userData =>{
      //         if(userData.currentOrganization && !this.isFreeLancer){
      //            setTimeout(() => {
      //             this.superAdminRightsUpdating(userData , this.ButtonName === "Submit" ? "SAVE" : "UPDATE");
      //            }, 500);
      //         }
      //       });
      //     }
      //     this.content !="PROFILE" ? this.ModalEmitter.emit(this.content) : this.profileListener.emit("SUCESS");
      //  }
      //  this.ButtonName != "Update" ? this.profileSaveWorkExeperience() : this.profileUpdateWorkExperience();
      //  this.profileListener.emit({ content :"SUCESS"});

      if (this.hasCurrentOrganization) {
        this.submitFreelancer(this.ButtonName);
      }
      else {

        if (this.ButtonName === "Submit") {
          this.profileSaveWorkExeperience();
        } else {
          this.profileUpdateWorkExperience();
        }
      }

    }
    else {
      this.currentOrganizationSave();
    }
  }


  closePopup() {
    this.modalService.hide(1);
  }

  currentOrganizationSave() {
    // console.log("welcome",this.WorkExperienceForm);

    if (this.isFormValid) {
      this.util.startLoader();
      this.gigsumoService.buttonClicked = true;
      this.api.create("user/v1/workexperience", this.WorkExperienceForm.getRawValue()).subscribe((res) => {
        if (res.code == '00000') {
          this.util.stopLoader();
          localStorage.setItem("currentOrganization", this.WorkExperienceForm.getRawValue().organisationName);
          this.modalService.hide(1);
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Work Experience added successfully",
            showConfirmButton: false,
            timer: 1000,
          });
          //credit validation
          let element: any = {};

          if (this.content === "JOBS" || this.content === "CANDIDATE") {
            this.ModalEmitter.emit({ content: this.content });
          } else {
            this.ModalEmitter.emit({
              content: "SUCESS",
              data: res.data.experience,
            });
          }



        } else {
          this.errorPopUp(res);
        }
      }, err => {
        this.errorPopUp()
      });
    }
    // }
  }

  errorPopUp(res?: any) {
    if (res) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Try again after sometime",
        text: `${res.message}`,
        showConfirmButton: false,
        timer: 2000,
      }).then(() => {
      });
    } else {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Try again after sometime",
        showConfirmButton: false,
        timer: 2000,
      }).then(() => {
      });
    }
  }
  public findInvalidControlsRecursive(formToInvestigate: UntypedFormGroup): string[] {
    var invalidControls: string[] = [];
    let recursiveFunc = (form: UntypedFormGroup) => {
      Object.keys(form.controls).forEach(field => {
        const control = form.get(field);
        if (control.invalid) invalidControls.push(field);
        if (control instanceof UntypedFormGroup) {
          recursiveFunc(control);
        }
      });
    }
    recursiveFunc(formToInvestigate);
    return invalidControls;
  }

  getCities(value: string) {
    // console.log("hello");

    if (value && value.length >= 4) {
      this.disableFields(['state', 'city']);
      this.citiesSubject.next(value);
    }
  }

  controlValid(key: string): boolean {
    return this.WorkExperienceForm.get(key).valid;
  }
  uniqueOrgList: Array<Partial<HealthCareOrganization>> = [];
  getOrgList(value: string) {
    if (value.trim().length >= 0 && value != " ") {
      const orgList: Array<Partial<HealthCareOrganization>> = [];
      this.api.query("care/organizations?organizationName=" + value)
        .subscribe((res) => {
          if (res != null) {
            res.forEach(ele => {
              orgList.push(ele);
            });
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

  getBusinessDetail(data): Observable<any> {
    return this.api.query("business/details/" + data.businessId);
  }

  businessFoundAgainstWorkExperience: boolean = false
  organizationRelatedToWork: string;
  onChngOrg1(value, index) {
    this.originalOrganisationName = value.organizationName;
    this.tempOrganizationData = value;
    this.WorkExperienceForm.get('organisationId').patchValue(value.organizationId);
    let companyLocationDetails: Partial<workExperienceDetails> = {};
    var data = value.organizationName + "/" + value.organizationId;
    this.util.startLoader();
    this.api.query("care/organization/" + data).subscribe((organizationResponse) => {
      if (organizationResponse) {
        let organisationSuggestedDetail: any = organizationResponse[0];
        companyLocationDetails.organizationId = organisationSuggestedDetail.organizationId as string;
        this.enable = ['timeZone']
        this.enableFields(this.enable)
        this.timeZonecountryvalues(organizationResponse[0].countryCode);
        if (organizationResponse[0].businessId
          && organizationResponse[0].verificationStatus == 'VERIFIED') {
          this.businessFoundAgainstWorkExperience = true;
          this.organizationRelatedToWork = organizationResponse[0].organizationName;
          //validate if the user having a non-generic email domain address is choosing the right work experience
          // or wrong work experience for his email address
          this.getBusinessDetail(organizationResponse[0])
            .pipe(
              switchMap(businessResponse => {
                if (businessResponse.code === GigsumoConstants.SUCESSCODE) {
                  this.util.stopLoader();
                  if (businessResponse.data.businessModelList[0].organizationType
                    && businessResponse.data.businessModelList[0].organizationType != null) {
                    this.disableFields(this.disable);
                  } else {
                    this.enableFields(['clientType']);
                  }

                  this.onChangeCountrypatchvalue(businessResponse.data.businessModelList[0].companyLocationDetails[0].country)
                  // setTimeout(() => {
                  if (businessResponse.data.businessModelList[0].organizationType == 'Client') {
                    businessResponse.data.businessModelList[0].organizationType = 'Direct Client'
                  }
                  companyLocationDetails = {
                    clientType: businessResponse.data.businessModelList[0].organizationType,
                    country: businessResponse.data.businessModelList[0].companyLocationDetails[0].country,
                    city: businessResponse.data.businessModelList[0].companyLocationDetails[0].city,
                    state: businessResponse.data.businessModelList[0].companyLocationDetails[0].state,
                    organizationId: businessResponse.data.businessModelList[0].organisationId,
                    businessId: businessResponse.data.businessModelList[0].businessId,
                    zipcode: businessResponse.data.businessModelList[0].companyLocationDetails[0].zipCode || organisationSuggestedDetail.zipCode
                  }
                  this.patchValue(companyLocationDetails);
                  // }, 500);
                  const email = this.ProfileDetailsResponse.data.userData.email;
                  return this.businessEmailValidatedAgainstBusinessOrganisation(email);
                } else {
                  this.util.stopLoader();
                  this.enable.push('clientType', 'country', 'city', 'state', 'zipcode')
                  this.enableFields(this.enable);
                  this.patchValue(
                    {
                      clientType: null,
                      country: null,
                      city: null,
                      state: null,
                      zipcode: null
                    });
                }
              })
            )
            .subscribe(bus => {
              if (bus.data.businessData) {
                this.util.stopLoader();
                this.isGenericMailValid = bus.data.businessData.organisationId != this.WorkExperienceForm.value.organisationId ? true : false;
                this.emailMatchingBusiness = bus.data.businessData.organisationId === this.WorkExperienceForm.value.organisationId ? true : false;

                if (!this.isGenericMailValid) {
                  this.WorkExperienceForm.patchValue({ addEmployee: true });
                  // console.log(this.WorkExperienceForm)
                }
              } else {
                this.emailMatchingBusiness = false;
                // this.emailLinkedToBusiness = false
                this.WorkExperienceForm.patchValue({ addEmployee: false });
                // Informing the user if there are no business found against the business email address
                // and encouraging the user to create business page using the email address
                this.isGenericMailValid = true;
                this.util.stopLoader();
              }
            })
        } else {
          // If the business related to the chosen organisation is not verified
          // we shall have to validate again if the user has a non-generic email domain for creating jobs
          // and candidates.
          const email = this.ProfileDetailsResponse.data.userData.email;
          this.businessEmailValidatedAgainstBusinessOrganisation(email)
            .subscribe(bus => {
              if (bus.data.businessData) {
                this.util.stopLoader();
                this.isGenericMailValid = bus.data.businessData.organisationId != this.WorkExperienceForm.value.organisationId ? true : false;
                this.emailMatchingBusiness = bus.data.businessData.organisationId == this.WorkExperienceForm.value.organisationId ? true : false;
                // this.emailLinkedToBusiness = bus.data.businessData.organisationId != this.WorkExperienceForm.value.organisationId ? true : false;
                if (!this.isGenericMailValid) {
                  this.WorkExperienceForm.patchValue({ addEmployee: true });
                }
                this.patchValue({
                  clientType: null,
                  country: value.country,
                  city: value.city,
                  state: value.state,
                  zipcode: value.zipCode,
                  organisationId: value.organizationId,
                  organizationId: value.organizationId,
                  businessId: value.businessId ? value.businessId : null
                });
              } else {
                // this.emailLinkedToBusiness = false;
                this.emailMatchingBusiness = false
                this.WorkExperienceForm.patchValue({ addEmployee: false });
                this.businessFoundAgainstWorkExperience = false;
                this.isGenericMailValid = this.checkGenricMail() != -1;
                this.util.stopLoader();
                this.enable.push('clientType', 'country', 'city', 'state', 'zipcode');
                this.enableFields(this.enable)
                this.patchValue({
                  clientType: null,
                  country: value.country,
                  city: value.city,
                  state: value.state,
                  zipcode: value.zipCode,
                  organisationId: value.organizationId,
                  organizationId: value.organizationId,
                  businessId: value.businessId ? value.businessId : null
                });
              }
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
            this.disable = ['city', 'state', 'country', 'zipcode'];
            this.disableFields(this.disable);
          } else {
            this.util.stopLoader()
          }
        })
      }, 500);
    }, err => {
      this.util.stopLoader();
    });


  }


  timeZonecountryvalues(countryCode: string) {
    if (countryCode != undefined && countryCode != "") {
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



  onChangeCountrypatchvalue(countryCode: string) {

    if (countryCode === "US") {
      this.disableFields(['state', 'city']);
    }
    else {
      this.enableFields(['state', 'city']);
    }
    this.patchValue({
      state: null,
      zipcode: null,
      city: null,
      country: countryCode,
      timeZone: null
    });

    if (countryCode.trim().length > 0) {
      this.util.startLoader()
      this.api.query("country/getAllStates?countryCode=" + countryCode).subscribe((res) => {
        if (res) {
          this.util.stopLoader();
          this.stateList = res;
        }
      });
      this.timeZonecountryvalues(countryCode);
    }
  }


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

  generateYears1() {
    let max = new Date().getFullYear();
    let min = max - 80;
    for (var i = min; i <= max; i++) {
      this.years.push(i);
    }
  }

  checkMonth(mcode) {
    var max = new Date().getFullYear();
    let endyr = parseInt(this.WorkExperienceForm.value.endYear);
    let stMonth = this.WorkExperienceForm.value.startMonth;
    let styr = parseInt(this.WorkExperienceForm.value.startYear);
    let stMonthCode;
    let n = new Date().getMonth();
    let monthCode = mcode;
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

  onChangeEndYear() {
    const maxyr = new Date().getFullYear();
    if (this.WorkExperienceForm.value.startYear == this.WorkExperienceForm.value.endYear ||
      this.WorkExperienceForm.value.endYear == maxyr) {
      this.patchValue({ endMonth: null });
    }
    if (this.WorkExperienceForm.value.startYear == this.WorkExperienceForm.value.endYear) {
      this.validateMonth = true;
    } else {
      this.validateMonth = false;
    }
  }

  disableMonth(code: number, val: string) {
    let n = new Date().getMonth();
    let maxYear = new Date().getFullYear();
    let maxMonth = n + 1;
    let monthCode = code;
    let startYear = parseInt(val === "START" ? this.WorkExperienceForm.value.startYear : this.WorkExperienceForm.value.endYear);
    if (startYear == maxYear) {
      if (monthCode > maxMonth) {
        return true;
      } else {
        return false;
      }
    }
  }

  validateMonths() {
    let a: any = this.WorkExperienceForm.value.startYear;
    let b: any = this.WorkExperienceForm.value.endYear;
    if (a == b) {
      this.patchValue({
        endMonth: null,
      });
    }
  }

  private scrollSubject = new Subject();

  checkYear(event) {
    let stYr = parseInt(this.WorkExperienceForm.value.startYear);
    let maxYr = new Date().getFullYear();
    if (stYr == maxYr) {
      this.patchValue({ startMonth: null });
    }
    this.patchValue({
      endYear: String(this.currentYear),
      endMonth: null,
    });
  }

  validateYear(years: string) {
    let yearDataInt = parseInt(this.WorkExperienceForm.value.startYear);
    let year = parseInt(years);
    if (yearDataInt != null) {
      if (yearDataInt > year) {
        return true;
      } else {
        return false;
      }
    }
  }

  get isWorkExpEmpty() {
    return Array.isArray(this.availableWorkExperience) ? this.availableWorkExperience.length === 0 : this.content != "PROFILE" ? true : false;
  }

  findByListApi() {
    this.gigsumoService.FINDBYLIST.subscribe(res => {
      if (res.code === "00000") {
        res.data.CLIENT_TYPE.listItems.forEach(ele => {
          this.clientTypeList.push(ele.item);
        });
        if (this.isJobSeeker) {
          res.data.GIGSUMO_JOB_TITLE.listItems.forEach(ele => {
            this.titleLists.push(ele.item);
          });
        }
        else {
          res.data.GIGSUMO_RECRUITERS_TITLE_LIST.listItems.forEach(ele => {
            this.titleLists.push(ele.item);
          });
        }
        this.titleLists = [...this.titleLists];
      }
    });

  }


  curOrg(event: boolean) {

    if (event) {
      this.patchValue({ currentOrganization: true, endMonth: null, badge: true });
      this.clearValidators(['endMonth', 'endYear']);
      this.isJobSeeker ? this.clearValidators(['timeZone']) : this.setValidators(['timeZone']);
      if (this.emailLinkedToBusiness && this.ButtonName === "Submit" && !this.hasCurrentOrganization) {
        this.updateOrganizationdata(this.organizationData, this.expData);
      }

    } else if (!event) {
      this.patchValue({ endMonth: null, badge: false });
      this.setValidators(['endMonth', 'endYear']);
      this.clearValidators(['badge', 'timeZone']);
      if (this.ButtonName === "Submit" && !this.hasCurrentOrganization && this.emailLinkedToBusiness) {
        this.WorkExperienceForm.reset();
        this.enableFields(['zipcode', 'country', 'state', 'city', 'organisationName', 'clientType']);
        // this.clearValidators(['zipcode', 'country', 'state', 'city', 'organisationName' , 'clientType']);
      }
      // this.WorkExperienceForm.get("badge").setErrors({ checkIfChecked: true });
    }

  }

  clearValidators(value: Array<string>) {
    for (let key of value) {
      this.WorkExperienceForm.get(key).clearValidators();
      this.WorkExperienceForm.get(key).updateValueAndValidity();
      this.WorkExperienceForm.get(key).reset();
    }
  }

  setValidators(value: Array<string>) {
    for (let key of value) {
      this.WorkExperienceForm.get(key).setValidators([Validators.required]);
      this.WorkExperienceForm.get(key).updateValueAndValidity();
    }
  }


}


