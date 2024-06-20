
import { AbstractControl, UntypedFormGroup, ValidationErrors, Validators } from "@angular/forms";
import { GigsumoConstants } from "./GigsumoConstants";
import { Type } from "@angular/core";
import { WorkExperience } from "./userModel";
import { UrlSegment } from "@angular/router";
import { APPLICANT_STATUS } from "./gigsumoService";

type validField = {
  readonly max: number;
  readonly min: number;
  readonly mintxt: string;
  readonly maxtxt: string;
  readonly patterntxt: string;
  readonly pattern: string | RegExp;
  readonly domain: Array<any>;
};

enum ERROR_MESSAGE {
  FIRSTNAME_MIN = "First Name cannot be empty",
  FIRSTNAME_MAX = "Maximum 20 chars allowed",
  FIRSTNAME_VALID = "Enter Valid First Name",
  LASTNAME_MIN = "Last Name cannot be empty",
  LASTNAME_MAX = "Maximum 40 chars allowed",
  LASTNAME_VALID = "Enter Valid Last Name",
  NUMBER_PATTERN = "Please enter only numerals (0-9)",
  TARGETRATE_PATTERN = "Enter valid target rate",
  PHONE_MAX = "Maximum 15 chars allowed",
  PHONE_MIN = "Minimum 10 chars required",
  TARGETRATE_MIN = "Target Rate cannot be empty",
  TARGETRATE_MAX = "Max 8 chars allowed",
  STATE_MAX = "Max 50 chars allowed",
  ZIPCODE_MAX = "Max 11 chars allowed",
  ZIPCODE_MIN = "Min 4 chars required",
  RANGE_ERROR = "Please check your ranges",
  CITY_MAX = "Max 50 chars allowed",
  CLIENTNAME_MIN = "Client Name cannot be empty",
  CLIENTNAME_MAX = "Maximum 75 chars allowed",
  JOBTITLE_MIN = "Job Title cannot be empty",
  JOBTITLE_MAX = "Maximum 50 chars allowed",
  EMAIL_MAX = "Maximum 50 chars allowed",
  EMAIL_VALID = "Enter Valid Email address",
  EMAIL_DOMAIN = "Enter Valid domain",
  BUSINESSPHONE_MIN = "Minimum 10 chars required",
  BUSINESSPHONE_MAX = "Maximum 15 chars allowed",
  TAGLINE_MAX = "Maximum 100 chars allowed",
  TAGLINE_PATTERN = "Enter valid TagLine",
  HTTP_VALID = "Enter Valid Url",
  BUSINESS_ADDRESS_MIN = "Address cannot be empty",
  BUSINESS_ADDRESS_MAX = "Maximum 50 chars allowed",
  ORGANIZATION_NAME_MAX = "Maximum 100 chars allowed",
  ORGANIZATION_NAME_MIN = "Organization Name cannot be empty",
  SCHOOL_NAME_MIN = "Minimum 3 chars required",
  SCHOOL_NAME_MAX = "Maximum 50 chars allowed",
  DEGREE_MAX = "Maximum 50 chars allowed",
  SPECIALITY_MAX = "Maximum 50 chars allowed",
  CERTIFICATION_NAME_MIN = "Certification Name cannot be empty",
  CERTIFICATION_NAME_MAX = "Maximum 50 chars allowed",
  CERTIFICATION_ORG_MIN = "Certifying Organization cannot be empty",
  CERTIFICATION_ORG_MAX = "Maximum 50 chars allowed",
  CERTIFICATION_LICENSE_MIN = "License Number cannot be empty",
  CERTIFICATION_LICENSE_MAX = "Maximum 50 chars allowed",
  TEAMNAME_MAX = "Maximum 30 chars allowed",
  TEAMNAME_MIN = "Minimum 5 chars required",
  TEAMNAME_PATTERN = "Name must contain alphabet only",
  TEAM_DESCRIPTION = "Maximum 100 words allowed",
  ABOUTME_MIN = "Minimum 100 characters required",
  ABOUTME_MAX = "Maximum characters allowed is 1000",
  ABOUT_YOUR_MAX = " Maximum 1000 characters allowed",
  ABOUT_YOUR_MIN = " Minimum 100 characters required",
  ABOUT_COMPANY_MAX = " Maximum 1000 characters allowed",
  ABOUT_COMPANY_MIN = " Minimum 100 characters required",
  IMAGE_TYPE_VALID = "Please upload the correct file type (Only .jpg, .png, .jpeg)",
  IMAGE_VIDEO_VALID = "Please upload the correct file type( Only JPG, JPEG, PNG and GIF)",
}

export class FormValidation {
  public isInvalid: boolean = false;
  MemberShipType : string = localStorage.getItem("MemberShipType");
  readonly IMAGE_ERROR: string = "Please upload file upto 10 MB";
  readonly UPGRADE_USER: string = `Already u are in ${this.MemberShipType} plan ,Once ur limit is over then u can upgrade Again.`;
  readonly TEAM_NAME: Partial<validField> = { pattern: "^[a-zA-Z ]*$", min: 5, max: 30 }
  readonly TEAM_DESCRIPTION: Partial<validField> = { max: 100 }
  readonly FIRST_Name: Partial<validField> = { pattern: "^[a-zA-Z ]*$", max: 20 };
  readonly LAST_NAME: Partial<validField> = { pattern: "^[a-zA-Z ]*$", max: 40 };
  readonly PHONE: Partial<validField> = { min: 10, max: 15, pattern: '[0-9]*\.?[0-9]*' };
  readonly ABOUT_COMPANY: Partial<validField> = { min: 100, max: 1000 };
  readonly ABOUT_ME: Partial<validField> = { min: 100, max: 1000 };
  readonly STATE: Partial<validField> = { max: 50 };
  readonly CITY: Partial<validField> = { max: 50 };
  readonly TARGET_RATE: Partial<validField> = { pattern: '[1-9][0-9]*', max: 8 };
  readonly OTP: Partial<validField> = { pattern: '[0-9]*\.?[0-9]*', max: 6 };
  readonly CLIENT_NAME: Partial<validField> = { max: 75 };
  readonly BUSINESS_NAME: Partial<validField> = { max: 100, pattern: "^[a-zA-Z ]*$" };
  readonly TAG_LINE: Partial<validField> = { pattern: "^[a-zA-Z ]*$", max: 140 };
  readonly JOT_TITLE: Partial<validField> = { max: 100 };
  readonly ZIPCODE: Partial<validField> = { max: 11, min: 4 };
  readonly JOB_DESCRIPTION: Partial<validField> = { min: 50, max: 1500 };
  readonly RESUME_SUMMARY: Partial<validField> = { min: 50, max: 1500 };
  readonly EMAIL: Partial<validField> = {
    pattern: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    max: 50,
    domain: ["com", "net", "org", "info"],
  };
  readonly BUSINESS_PHONE: Partial<validField> = { pattern: '[0-9]*\.?[0-9]*', min: 10, max: 15 };
  readonly BUSINESS_ADDRESS: Partial<validField> = { max: 50 };
  readonly DEGREE: Partial<validField> = { max: 50 };
  readonly SPECIALITY: Partial<validField> = { max: 50 };
  readonly CERTIFICATION_NAME_ORG_LICENSE: Partial<validField> = { max: 50 };
  readonly ORGANIZATION_NAME: Partial<validField> = { max: 100 };
  readonly SCHOOL_NAME: Partial<validField> = { min: 3, max: 50 };
  readonly SOCIAL_LINK: Partial<validField> = { pattern: '^(https?://)?((([a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,})|localhost)(:\\d+)?(\\/\\S*)?(\\?\\S*)?$'};
  readonly IMAGE_TYPE: Array<any> = ['image/jpg', 'image/jpeg', 'image/png']

  get Form() {
    return ERROR_MESSAGE;
  }

  convertSmallCase(data : string){
    if(data!=null){
    const [d , ...rest] = data;
    let restValue = rest.join("");
    restValue = restValue.includes("_") ? restValue.replace(/_/g,"") : restValue;
    return d + restValue.toLowerCase();
    }
  }


  titleCase([d , ...rest] : string | any){
    return d.toUpperCase() + rest.toString().replaceAll(",","");
  }

  convertUserType(val : string) {
    let data  = val.split("_");
    let [ f , ...rest] = data[0];
    let [ s , ...rest2] = data[1];
    return f + rest.join("").toLowerCase() + " " + s + rest2.join("").toLowerCase();
  }

  getHours(val : string){
    switch (val) {
      case "Hourly":
          return "per hour";
      case "Daily":
          return "per day";
      case "Monthly":
          return "per month";
      case "Weekly":
          return "per weekly";
      case "Yearly":
          return "per yearly";
      default:
        break;
    }
  }

  isInteger(event) {
    var ctl = document.getElementById('myText');
    var startPos = ctl['selectionStart'];

    if (startPos == 0 && String.fromCharCode(event.which) == '0') {
      return false;
    }
  }

  getClasName(value : string){
    return value === "ON HOLD" ? "ONHOLD" : value;
  }

  APPLICANT_STATUS_COLOR : Array<{key : APPLICANT_STATUS , color : string}>= [
    { key: 'CANDIDATE-SELECTED', color: '#63cfbe' },
    { key: 'PROFILE-REJECTED', color: '#fc0303' },
    { key: 'ONBOARDED', color: '#17a2b8' },
    { key: 'INTERVIEW-SCHEDULED', color: '#3498db' },
    { key: 'CANDIDATE-SHORTLISTED', color: '#3498db' },
    { key: 'PRE-ONBOARDED', color: '#3498db' },
    { key: 'OFFER-WITHDRAWN', color: '#fc0303' },
    { key: 'WITHDRAW', color: '#fc0303' },
    { key: 'INTERVIEW-ACCEPTED', color: '#63cfbe' },
    { key: 'INTERVIEW-REJECTED', color: '#fc0303' },
    { key: 'OFFER-DECLINED', color: '#fc0303' },
    { key: 'OFFER-ACCEPTED', color: '#63cfbe' },
    { key: 'ACTIVE', color: '#63cfbe' },
    { key: 'INACTIVE', color: '#63cfbe' },
    { key: 'INITIATED', color: '#63cfbe' },
    { key: 'INTERVIEW-FAILED', color: '#fc0303' },
    { key: 'ACCEPTED', color: '#63cfbe' },
    { key: 'REJECTED', color: '#fc0303' },
    { key: 'JOB-APPLIED', color: '#63cfbe' },
    { key: 'OFFERED', color: '#63cfbe' },
    { key: 'CANDIDATE-WITHDRAWN', color: '#fc0303' },
  ];

  getStyle(status : APPLICANT_STATUS){
    const find = this.APPLICANT_STATUS_COLOR.find(p => p.key === status);
    return find ? { background : find.color } : null;
  }

  get MONTHS() : Array<any>{
    return [
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
  }

  validSpace(evt) {
    evt = (evt || window.event);
    return this.willCreateWhitespaceSequence(evt) ? false : true;
  }

  checkImageSize(file: File): number {
    // finding fileSize
    const Filesize: number = file && (file.size / 1024 / 1024);
    return Math.abs(Filesize);
  }

  static extractContent(value: string): string {
    let span = document.createElement('span');
    span.innerHTML = value;
    return span.textContent || span.innerText;
  };


  getStatus(value : string ){
    if(value === "ACTIVE"){
      return "Available";
    }
    else if(value === "INACTIVE"){
      return "Unavailable";
    }
  }

  isWhiteSpace(char) {
    return (/\s/).test(char);
  }

  updateControl(data: { value: string, form: UntypedFormGroup }, status: string = "SET") {
    if (status.includes("CLEAR")) {
      data.form.get(data.value).clearValidators();
      data.form.get(data.value).updateValueAndValidity();
      data.form.get(data.value).reset();
    }
    else {
      data.form.get(data.value).setValidators([Validators.required]);
      data.form.get(data.value).updateValueAndValidity();
    }

  }

  getTextBasedOnStatus(status: string, content: string): string {
    let textContent: string;
    switch (status) {
      case GigsumoConstants.ACTIVE: textContent = `${content} Sucessfully`
        break;
      case GigsumoConstants.DRAFTED: textContent = `${content} Sucessfully`
        break;
      case GigsumoConstants.AWAITING_HOST:
        content = content === "Job created" ? content.substring(0, 3) : content.substring(0, 9)
        textContent = `The ${content} will become ${content === "Job" ? "active" : "available"} on the Effective date selected`
        break;
      default: textContent = `${content} Sucessfully`;
    }
    return textContent;
  }

  // throwPopup(value: SweetAlertOptions): Promise<SweetAlertResult<any>> {
  //   return Swal.fire({
  //     title: value.title,

  //   })
  // }

  dateInPast(date: Date) : boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  }


  dateInFuture(date: Date) : boolean{
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today;
  }

  willCreateWhitespaceSequence(evt) {
    var willCreateWSS = false;
    if (this.isWhiteSpace(evt.key)) {

      var elmInput: HTMLInputElement = evt.currentTarget;
      var content = elmInput.value;

      var posStart = elmInput.selectionStart;
      var posEnd = elmInput.selectionEnd;
      console.log((/\s/).test(content.charAt(posStart - 1)), (/\s/).test(content.charAt(posEnd)));

      willCreateWSS = (
        this.isWhiteSpace(content[posStart - 1] || '')
        || this.isWhiteSpace(content[posEnd] || '')
      );
    }
    return willCreateWSS;
  }
  decimalFilter(event: any) {
    const reg = /^-?\d*(\.\d{0,8})?$/;
    let input = event.target.value + String.fromCharCode(event.charCode);

    if (!reg.test(input)) {
      event.preventDefault();
    }
    this.validatezeo(event);
  }
  validatezeo(event) {
    var ctl = document.getElementById('myText');
    if (ctl instanceof HTMLInputElement) {
      var startPos = ctl.selectionStart;

      if (startPos == 0 && String.fromCharCode(event.which) == '0') {
        return false;
      }
    }
  }

  public findDiffrenceBetweenDates(date1 : Date, date2 : Date) {
  let diffMillis = date1.getTime()-date2.getTime();
  return (diffMillis / (1000 * 3600 * 24));
}

  validSpace_specialCharacters(evt) {

    evt = (evt || window.event);
    var charCode = (evt.which || evt.keyCode);

    return ((charCode > 32)
      && (charCode < 65 || charCode > 90)
      && (charCode < 97 || charCode > 122))
      || this.willCreateWhitespaceSequence(evt) ? false : true;
  }



}
