import { AbstractControl, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { environment } from '../../environments/environment';
import { CustomValidator } from '../components/Helper/custom-validator';
import { FormValidation } from './FormValidation';
type location = {
  country: string,
  state: string,
  city: string;
  zipCode: string,

}

const rangeMatcher: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const fromValue = Number(control.value.targetRateFrom);
  const toValue = Number(control.value.targetRateTo);

  return fromValue && toValue && fromValue > toValue
    ? { rangevalidation: true }
    : null;
};
export class AppSettings extends FormValidation {

  constructor(private formBuilder?: UntypedFormBuilder) {
    super();
  }

  public static ServerUrl = environment.serverUrl;
  public static noimg = "assets/images/userAvatar.png";
  public static photoUrl = environment.serverUrl + "download/";
   public static noimage = "assets/images/userAvatar.png";
  public static webSocketUrl = environment.webSocketUrl;
  public static webSocketUrlStream = environment.webSocketUrlStream;
  public static timerSocket = 5000;
  public static RECAPTCHA = "6Lf2AeQnAAAAAD4dtU_0pbzmyWBRTK9TlVzZcga8";
    public static stripekey = environment.stripekey;
  public static Async_Sync = environment.AsyncSync;
  public static LAMDA_URL = environment.LAMDA_URL;

  //  public static EMAIL_PATTERN : RegExp = ;



  public static CANDIDATE_INVITE_JOB_SEEKER = "CONSUMPTION_TO_INVITE_JOBSEEKER_CANDIDATE";
  public static CANDIDATE_INVITE_STUDENT = "CONSUMPTION_TO_INVITE_STUDENT";
  public static INVITE_CANDIDATE = "CONSUMPTION_TO_INVITE_CANDIDATE";
  public static VIEW_CANDIDATE = "CONSUMPTION_TO_VIEW_CANDIDATE";
  public static VIEW_JOBSEEKER = "CONSUMPTION_TO_VIEW_JOBSEEKER";
  public static INVITE_SUPPLER_CANDIDATE = "CONSUMPTION_TO_INVITE_SUPPLIER_CANIDATE";
  public static INVITE_JOBSEEKER = "CONSUMPTION_TO_INVITE_JOBSEEKER";
  public static UPGRADE_CANDIDATE = "CONSUMPTION_TO_UPGRADE_CANDIDATE";
  public static CREATE_CANDIDATE = "CONSUMPTION_TO_HOST_CANDIDATE";
  public static REQUEST_RESUME_SUPPLIER = "CONSUMPTION_TO_REQUEST_RESUME_SUPPLIER";
  public static REQUEST_RESUME_JOB_SEEKER = "CONSUMPTION_TO_REQUEST_RESUME_JOBSEEKER";


  // vendore job
  public static VENDOR_JOB_APPLY = "CONSUMPTION_FOR_VENDOR_JOB_APPLY";

  // job create
  public static CREATE_JOB = "CONSUMPTION_FOR_JOB";
  public static JOB_VIEW = "CONSUMPTION_FOR_JOB_VIEW";
  public static UPGRADED_JOB = "CONSUMPTION_FOR_UPGRADED_JOB";
  public static SI_JOB_APPLY = "CONSUMPTION_FOR_SI_JOB_APPLY";

  // staff agency
  public static SA_JOB_APPLY = "CONSUMPTION_FOR_SA_JOB_APPLY";

  // direct client
  public static JOB_APPLY = "CONSUMPTION_FOR_CLIENT_JOB_APPLY";

  // freelauncher
  public static FREELANCER_JOB_APPLY = "CONSUMPTION_FOR_FREELANCER_JOB_APPLY";

  // freelauncher
  public static STAFF_AGENCY = "CONSUMPTION_FOR_FREELANCER_JOB_APPLY";
  public static PRIME_VENDORE = "CONSUMPTION_FOR_PRIME_VENDOR_STAFF_AGENCY_JOB_APPLY";


  // suplier
  public static SUPPLIER = "CONSUMPTION_FOR_SUPPLIER";

  public static INTERNAL_HIRE = "CONSUMPTION_FOR_INTERNAL_HIRE";

  public static FILE_SIZE = 10000000;
  static readonly userType : string = localStorage.getItem("userType");

  static get isJobSeeker() : boolean {
    return this.userType === "JOB_SEEKER";
  }

  public static  static_UserImag='assets/images/userAvatar.png';

  getEditJobFormGroup(): UntypedFormGroup {
    return new UntypedFormGroup({
      jobPostedBehalfOf: new UntypedFormControl(localStorage.getItem('currentOrganization')),
      clientType: new UntypedFormControl(null, [Validators.required]),
      jobId: new UntypedFormControl(null),
      status: new UntypedFormControl(null),
      jobDescription: new UntypedFormControl(null, [Validators.required, CustomValidator.minmaxWords(this.JOB_DESCRIPTION.min, this.JOB_DESCRIPTION.max)]),
      engagementOther: new UntypedFormControl(null),
      jobPostedBy: new UntypedFormControl(localStorage.getItem('userId')),
      durationType: new UntypedFormControl(null, [Validators.required]),
      duration: new UntypedFormControl(null, [Validators.required]),
      organisationId: new UntypedFormControl(null),
      clientName: new UntypedFormControl(null, [Validators.required, CustomValidator.max(this.CLIENT_NAME.max), CustomValidator.checkWhiteSpace()]),
      jobClassification: new UntypedFormControl(null, [Validators.required]),
      jobTitle: new UntypedFormControl(null, [Validators.required, CustomValidator.max(this.JOT_TITLE.max), CustomValidator.checkWhiteSpace()]),
      primarySkills: new UntypedFormControl(null, [Validators.required]),
      secondarySkills: new UntypedFormControl(null),
      showClientName: new UntypedFormControl(false),
      showClientType: new UntypedFormControl(true),
      country: new UntypedFormControl(null, [Validators.required]),
      state: new UntypedFormControl(null, [Validators.required, CustomValidator.max(this.STATE.max)]),
      zipCode: new UntypedFormControl(null, [Validators.required, CustomValidator.minmaxLetters(this.ZIPCODE.min, this.ZIPCODE.max)]),
      city: new UntypedFormControl(null, [Validators.required, CustomValidator.max(this.CITY.max)]),
      experienceFrom: new UntypedFormControl(null, [Validators.required]),
      experienceTo: new UntypedFormControl(null, [Validators.required]),
      targetRateFrom: new UntypedFormControl(null, [Validators.required, CustomValidator.validDecimal(),
      CustomValidator.checkWhiteSpace(), CustomValidator.max(this.TARGET_RATE.max)]),
      targetRateTo: new UntypedFormControl(null, [Validators.required, CustomValidator.validDecimal(),
        CustomValidator.checkWhiteSpace(), CustomValidator.max(this.TARGET_RATE.max)]),
      payType: new UntypedFormControl(null, [Validators.required]),
      remoteWork: new UntypedFormControl(false),
      relocationRequired: new UntypedFormControl(false),
      securityClearance: new UntypedFormControl(false),
      workFromHome: new UntypedFormControl(false),
      isFeatured: new UntypedFormControl(null),
      consumptionType: new UntypedFormControl(null),
      createdByUserType: new UntypedFormControl(null),
      points: new UntypedFormControl(null),
    },{
      validators: rangeMatcher,
    })
  }

  getEditCandidateGroup(): UntypedFormGroup {
    return new UntypedFormGroup({
      engagementType: new UntypedFormControl(null, [Validators.required]),
      firstName: new UntypedFormControl(null, [Validators.required, Validators.pattern(this.FIRST_Name.pattern),
      CustomValidator.checkWhiteSpace(), CustomValidator.max(this.FIRST_Name.max)]),
      lastName: new UntypedFormControl(null, [Validators.required, Validators.pattern(this.LAST_NAME.pattern),
      CustomValidator.checkWhiteSpace(), CustomValidator.max(this.LAST_NAME.max)]),
      candidateId: new UntypedFormControl(null),
      organisationId:new UntypedFormControl(null),
      appliedBy: new UntypedFormControl(null),
      createdBy: new UntypedFormControl(null),
      status: new UntypedFormControl(null),
      enrolledOn: new UntypedFormControl(null),
      updatedOn: new UntypedFormControl(null),
      limit: new UntypedFormControl(null),
      userId: new UntypedFormControl(null),
      isResumeAttached: new UntypedFormControl(false),
      phone: new UntypedFormControl(null, [Validators.required, Validators.pattern(this.PHONE.pattern), CustomValidator.minmaxLetters(this.PHONE.min, this.PHONE.max)]),
      otherPreferedStates: new UntypedFormControl(null),
      otherPrefered: new UntypedFormControl(false),
      email: new UntypedFormControl(null, [Validators.email, Validators.required, CustomValidator.max(this.EMAIL.max),
      Validators.pattern(this.EMAIL.pattern)]),
      candidateEmailId: new UntypedFormControl(null, [Validators.email, Validators.required]),
      resumeSummary: new UntypedFormControl(null, [Validators.required, CustomValidator.minmaxWords(this.RESUME_SUMMARY.min, this.RESUME_SUMMARY.max)]),
      jobTitle: new UntypedFormControl(null, [Validators.required, CustomValidator.checkWhiteSpace(), CustomValidator.max(this.JOT_TITLE.max)]),
      availableIn: new UntypedFormControl(null, [Validators.required]),
      totalExperience: new UntypedFormControl(null, [Validators.required]),
      workAuthorization: new UntypedFormControl(null, [Validators.required]),
      targetRateFrom: new UntypedFormControl(null, [Validators.required, CustomValidator.validDecimal(),
      CustomValidator.checkWhiteSpace(), CustomValidator.max(this.TARGET_RATE.max)]),
      targetRateTo: new UntypedFormControl(null, [Validators.required, CustomValidator.validDecimal(),
        CustomValidator.checkWhiteSpace(), CustomValidator.max(this.TARGET_RATE.max)]),
      payType: new UntypedFormControl(null, [Validators.required]),
      primarySkills: new UntypedFormControl(null, [Validators.required]),
      secondarySkills: new UntypedFormControl(null),
      country: new UntypedFormControl(null, [Validators.required]),
      state: new UntypedFormControl(null, [Validators.required, CustomValidator.max(this.STATE.max)]),
      zipCode: new UntypedFormControl(null, [Validators.required, CustomValidator.minmaxLetters(this.ZIPCODE.min, this.ZIPCODE.max)]),
      city: new UntypedFormControl(null, [Validators.required, CustomValidator.max(this.CITY.max)]),
      remoteWork: new UntypedFormControl(false),
      relocationRequired: new UntypedFormControl(false),
      securityClearance: new UntypedFormControl(false),
      workFromHome: new UntypedFormControl(false),
      createCandidateOnPlatform: new UntypedFormControl(true),
      candidateStatus: new UntypedFormControl(true),
      isFeatured: new UntypedFormControl(null),
      consumptionType: new UntypedFormControl(null),
      createdByUserType: new UntypedFormControl(null),
      points: new UntypedFormControl(null),
      photo: new UntypedFormControl(null),
    },{
      validators: rangeMatcher,
    });
  }

  default: location = {
    country: null, zipCode: null, state: null, city: null
  }

  getCreateCandidateForm(location: location = this.default): UntypedFormGroup {
    return new UntypedFormGroup({
      engagementType: new UntypedFormControl(null, [Validators.required]),
      firstName: new UntypedFormControl(null, [Validators.required, Validators.pattern(this.FIRST_Name.pattern), CustomValidator.max(this.FIRST_Name.max), CustomValidator.checkWhiteSpace()]),
      lastName: new UntypedFormControl(null, [Validators.required, Validators.pattern(this.LAST_NAME.pattern), CustomValidator.max(this.LAST_NAME.max), CustomValidator.checkWhiteSpace()]),
      createdByUserType: new UntypedFormControl(null),
      organisationId:new UntypedFormControl(null),
      candidateId: new UntypedFormControl(null, [Validators.required]),
      appliedBy: new UntypedFormControl(null),
      createdBy: new UntypedFormControl(localStorage.getItem('userId')),
      enrolledOn: new UntypedFormControl(null),
      points: new UntypedFormControl(null),
      photo: new UntypedFormControl(null),

      PostedByUserType: new UntypedFormControl(localStorage.getItem('userType')),
      consumption: new UntypedFormControl(null),
      consumptionType: new UntypedFormControl(null),
      updatedOn: new UntypedFormControl(null),
      limit: new UntypedFormControl(null),
      userId: new UntypedFormControl(null),
      status: new UntypedFormControl("ACTIVE"),
      isResumeAttached: new UntypedFormControl(false),
      phone: new UntypedFormControl('', [Validators.required, Validators.pattern(this.PHONE.pattern), CustomValidator.minmaxLetters(this.PHONE.min, this.PHONE.max)]),
      otherPreferedStates: new UntypedFormControl(null),
      otherPrefered: new UntypedFormControl(false),
      email: new UntypedFormControl(null, [Validators.email, Validators.required, CustomValidator.max(this.EMAIL.max),
      Validators.pattern(this.EMAIL.pattern)]),
      candidateEmailId: new UntypedFormControl(null, [Validators.email, Validators.required]),
      resumeSummary: new UntypedFormControl(null, [Validators.required, CustomValidator.minmaxWords(this.RESUME_SUMMARY.min, this.RESUME_SUMMARY.max)]),
      jobTitle: new UntypedFormControl(null, [Validators.required, CustomValidator.max(this.JOT_TITLE.max), CustomValidator.checkWhiteSpace()]),
      availableIn: new UntypedFormControl(null, [Validators.required]),
      totalExperience: new UntypedFormControl(null, [Validators.required]),
      workAuthorization: new UntypedFormControl(null, [Validators.required]),
      targetRateFrom: new UntypedFormControl(null, [Validators.required, CustomValidator.validDecimal(),
      CustomValidator.checkWhiteSpace(), CustomValidator.max(this.TARGET_RATE.max)]),
      targetRateTo: new UntypedFormControl(null, [Validators.required, CustomValidator.validDecimal(),
        CustomValidator.checkWhiteSpace(), CustomValidator.max(this.TARGET_RATE.max)]),
      payType: new UntypedFormControl(null, [Validators.required]),
      primarySkills: new UntypedFormControl(null, [Validators.required]),
      secondarySkills: new UntypedFormControl(null),
      country: new UntypedFormControl(location.country, [Validators.required]),
      state: new UntypedFormControl(location.state, [Validators.required, CustomValidator.max(this.STATE.max)]),
      zipCode: new UntypedFormControl(location.zipCode, [Validators.required, CustomValidator.minmaxLetters(this.ZIPCODE.min, this.ZIPCODE.max)]),
      city: new UntypedFormControl(location.city, [Validators.required, CustomValidator.max(this.CITY.max)]),
      remoteWork: new UntypedFormControl(false),
      relocationRequired: new UntypedFormControl(false),
      securityClearance: new UntypedFormControl(false),
      workFromHome: new UntypedFormControl(false),
      createCandidateOnPlatform: new UntypedFormControl(true),
      candidateStatus: new UntypedFormControl(false)
    },{
      validators: rangeMatcher,
    })
  }

  getCreateJobForm(location: location = this.default): UntypedFormGroup {
    return new UntypedFormGroup({
      jobPostedBehalfOf: new UntypedFormControl(null, [Validators.required]), //localStorage.getItem('currentOrganization'),]
      clientType: new UntypedFormControl(null, [Validators.required]),
      createdByType: new UntypedFormControl(null),
      jobId: new UntypedFormControl(null),
      jobDescription: new UntypedFormControl(null, [Validators.required, CustomValidator.minmaxWords(this.JOB_DESCRIPTION.min, this.JOB_DESCRIPTION.max)]),
      engagementOther: new UntypedFormControl(null),
      jobPostedBy: new UntypedFormControl(localStorage.getItem('userId')),
      durationType: new UntypedFormControl('Months', [Validators.required]),
      points: new UntypedFormControl(null),
      PostedByUserType: new UntypedFormControl(localStorage.getItem('userType')),
      consumption: new UntypedFormControl(null),
      consumptionType: new UntypedFormControl(null),
      duration: new UntypedFormControl(null, [Validators.required]),
      status: new UntypedFormControl("ACTIVE"),
      organisationId: new UntypedFormControl(null),
      clientName: new UntypedFormControl(null, [Validators.required, CustomValidator.max(this.CLIENT_NAME.max), CustomValidator.checkWhiteSpace()]),
      jobClassification: new UntypedFormControl(null, [Validators.required]),
      jobTitle: new UntypedFormControl(null, [Validators.required, CustomValidator.max(this.JOT_TITLE.max), CustomValidator.checkWhiteSpace()]),
      primarySkills: new UntypedFormControl(null, [Validators.required]),
      secondarySkills: new UntypedFormControl(null),
      showClientName: new UntypedFormControl(false),
      showClientType: new UntypedFormControl(true),
      country: new UntypedFormControl(location.country, [Validators.required]),
      state: new UntypedFormControl(location.state, [Validators.required, CustomValidator.max(this.STATE.max)]),
      zipCode: new UntypedFormControl(location.zipCode, [Validators.required, CustomValidator.minmaxLetters(this.ZIPCODE.min, this.ZIPCODE.max)]),
      city: new UntypedFormControl(location.city, [Validators.required, CustomValidator.max(this.CITY.max)]),
      experienceFrom: new UntypedFormControl(null, [Validators.required]),
      experienceTo: new UntypedFormControl(null, [Validators.required]),
      targetRateFrom: new UntypedFormControl(null, [Validators.required, CustomValidator.validDecimal()
      , CustomValidator.checkWhiteSpace(), CustomValidator.max(this.TARGET_RATE.max)]),
      targetRateTo: new UntypedFormControl(null, [Validators.required, CustomValidator.validDecimal()
      , CustomValidator.checkWhiteSpace(), CustomValidator.max(this.TARGET_RATE.max)]),
      payType: new UntypedFormControl(null, [Validators.required]),
      remoteWork: new UntypedFormControl(false),
      relocationRequired: new UntypedFormControl(false),
      securityClearance: new UntypedFormControl(false),
      workFromHome: new UntypedFormControl(false),
    },{
      validators: rangeMatcher,
    })
  }

  getWorkExperienceForm() : UntypedFormGroup {
   return new UntypedFormGroup({
      title: new UntypedFormControl(null, [Validators.required]),
      organisationName:  new UntypedFormControl(null, [Validators.required, CustomValidator.checkWhiteSpace(), CustomValidator.max(this.ORGANIZATION_NAME.max)]),
      organisationId: new UntypedFormControl(null),
      organizationId: new UntypedFormControl(null),
      action: new UntypedFormControl(null),
      clientType: new UntypedFormControl(null, [Validators.required]),
      businessId: new UntypedFormControl(null),
      expId: new UntypedFormControl(null),
      userId: new UntypedFormControl(localStorage.getItem('userId')),
      currentOrganization: new UntypedFormControl(false),
      badge: new UntypedFormControl(false),
      addEmployee: new UntypedFormControl(false),
      startMonth: new UntypedFormControl(null, [Validators.required]),
      timeZone: new UntypedFormControl(null),
      startYear: new UntypedFormControl(new Date().getFullYear(), [Validators.required]),
      endMonth: new UntypedFormControl(null, [Validators.required]),
      endYear: new UntypedFormControl(new Date().getFullYear() , [Validators.required]),
      country: new UntypedFormControl(null, [Validators.required]),
      state: new UntypedFormControl(null, [Validators.required, CustomValidator.max(this.STATE.max)]),
      city: new UntypedFormControl(null, [Validators.required, CustomValidator.max(this.CITY.max)]),
      zipcode: new UntypedFormControl(null, [Validators.required, CustomValidator.minmaxLetters(this.ZIPCODE.min, this.ZIPCODE.max)]),
    });
  }

  getBusinessValidationForm() : UntypedFormGroup{
    return new UntypedFormGroup({
      swapEmail :new UntypedFormControl(null , [Validators.required,Validators.email,Validators.pattern(this.EMAIL.pattern)]),
      domainValidationOtp :new UntypedFormControl(null , [Validators.pattern(this.OTP.pattern)] )
    });


  }

  // public static AuthTokenUrl = 'http://localhost:9090/careonline-social/user/activate?jsr=2bb18e80-dcc7-4513-9684-ecb42ab975b2';
  // public static authValidUrl = ' http://192.168.1.125:8090/careonline-social/user/validateToken';
  // public static setPasswordUrl = 'POST  http://192.168.1.125:8090/careonline-social/user/setPassword';
  static HTTP_CONTENT_TYPE: any;
  static HTTP_ACCESS_CONTROL_ALLOW_ORIGIN: '*';
  // static photoUrl: any;


  static ApplogoBase64 ="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"
}


