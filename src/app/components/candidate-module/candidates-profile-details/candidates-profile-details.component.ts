import { SocketServiceStream } from './../../../services/SocketServiceStream';
import { SocketService } from 'src/app/services/socket.service';
import { CookieService } from 'ngx-cookie-service';
import { UntypedFormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilService } from 'src/app/services/util.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Component, OnChanges, OnInit, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { CustomValidator } from '../../Helper/custom-validator';
import Swal from 'sweetalert2';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { SearchData } from 'src/app/services/searchData';
import { TypeaheadOrder } from 'ngx-bootstrap/typeahead';
import { FormValidation } from 'src/app/services/FormValidation';
import { candidateModel } from 'src/app/services/candidateModel';
declare var $: any;
@Component({
  selector: 'app-candidates-profile-details',
  templateUrl: './candidates-profile-details.component.html',
  styleUrls: ['./candidates-profile-details.component.scss'],
  inputs : ['candidateDetails']
})
export class CandidatesProfileDetailsComponent extends FormValidation implements OnInit , OnChanges {
  modalRef: BsModalRef;
  public FORMERROR = super.Form;
  userId= localStorage.getItem('userId')
  userType : string =localStorage.getItem('userType')
  CadidateInfo: UntypedFormGroup;
  candidateDetails: candidateModel;
  CadidateWorkExpeiecnceForm: UntypedFormGroup;
  domainForm : UntypedFormGroup
  CadidateEducationForm: UntypedFormGroup;
  CadidateCerificationForm: UntypedFormGroup;
  submitted: boolean = false;
  candidateId: any;
  CandidateData: any;
  FormData: any;
  currentYear: any = new Date().getFullYear();
  submittedWorkexp: boolean = false;
  submittedEducation: boolean = false;
  submittedCertification: boolean = false;
  @ViewChild("businessEmail") businessTemplate;
  businessmodal : BsModalRef
  workExperiences: UntypedFormArray;
  instList : any =[]
  yearData: any;
  yearIndex: any;
  checkWorkModel :string
   editData: any;
  candidateJobTitleList: any = [];
  recruiterTitleList: any = [];
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
  countryList: any = [];
  stateList: any = [];
  clientTypeList = ['Client','Supplier', 'Systems Integrator', 'Prime Vendor', 'Vendor', 'Staffing Agency']
  backdropConfig = {
    backdrop: true,
    ignoreBackdropClick: true,
    keyboard: false,
  };
   sortConfigEdu: TypeaheadOrder = {
    direction: "desc",
    field: "institutionName",
  };
  validateMonth: boolean;
  resumesummaryconfig = {
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
    ]
  };
  constructor(private modalService: BsModalService,  private _socket: SocketService,private _socket_stream: SocketServiceStream, private searchData: SearchData, private cookieService: CookieService, private router : Router,
    private activatedRoute: ActivatedRoute, private api: ApiService, private fb: UntypedFormBuilder, private util: UtilService) {
      super();
  }
  workExperience:Array<any>
  educationDetails:any;
  certification : any;
  aboutMe :string;
  emptyworkExp:string;
  createdBy: string
  otpEmailSent:boolean = false;
  firstName : string
  lastName : string
  ngOnChanges(changes: SimpleChanges): void {
    if(changes.candidateDetails.currentValue){
      this.candidateDetails = changes.candidateDetails.currentValue;
      
    }
  }
  ngOnInit() {
    this.aboutUsForm();
    this.workExperiencesformfields();
    this.CadidateEducationFormfiles();
    this.CadidateCerificationFormField();
    this.generateYears();
    this.getCountry();
    this.getTitleList();
    this.activatedRoute.queryParams.subscribe((res) => {
      this.candidateId = res.candidateId;
      this.createdBy = res.createdBy;
      this.firstName = res.firstName;
      this.lastName = res.lastName;
    })
    if (this.userType.match("JOB_SEEKER")){
      this.getworkexperience();
      }
     else {
      this.getCandidateDetails()
     }
  }
  // getEducationFormGroup(index) : FormGroup{
  //   const formgroup = this.CadidateEducationForm.controls[index] as FormGroup;
  //   return formgroup;
  // }
  schoolData: any = {}
  edulist() {
   let  data = this.CadidateEducationForm.value.schoolName;
      this.util.startLoader();
    this.api.query("care/intitutions/" + data).subscribe((res) => {
      this.util.stopLoader();
        this.schoolData = res;
        this.CadidateEducationForm.patchValue({
          country : this.schoolData.country,
          state : this.schoolData.state,
          city: this.schoolData.city,
          zipcode : this.schoolData.zipCode,
        });
    }, err => {
      this.util.stopLoader();
    });
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
    ]
  };
  getInstitutions() {
    this.util.startLoader()
    this.api.query("care/institutions").subscribe((res) => {
      if (res) {
        this.util.stopLoader();
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
  emailPattern = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$";
  getDomainForm(){
    this.domainForm = this.fb.group({
      businessemail : [null, [Validators.required,Validators.email, Validators.pattern(this.emailPattern)]],
      domainValidationOtp :  [null, [Validators.required]],
    })
   }
   defineDomainErrors(){
    // this.domainForm.get('businessemail').setErrors({emailExists : false})
    //  this.domainForm.get('domainValidationOtp').setErrors({wrongOtp : false})
    // )
    // )
    }
    updateOtp(){
    }
  // Get candidate information

  loadAPIcall:boolean=false;
  getCandidateDetails() {
  // this.util.startLoader();
   this.loadAPIcall=true;

    this.api.query("candidates/findCandidateById/" + this.candidateDetails.candidateId).subscribe(res => {
      if (res.code == '00000') {
        // this.util.stopLoader()
        this.loadAPIcall=false;

        this.CandidateData = res.data.candidateData;
        if(this.CandidateData.resumeSummary== null || undefined || this.CandidateData.resumeSummary== "<p><br></p>" || this.CandidateData.resumeSummary== "<br>"){
          this.CandidateData.resumeSummary ="About candidate has not been provided";
        }
      }
    })
  }
previousMailId : string
  getworkexperience(){
    //  this.util.startLoader();
    this.loadAPIcall=true;
       this.api.query("user/" + this.userId).subscribe(res => {
        this.loadAPIcall=false;
        this.previousMailId = res.email;
        let data : any ={}
        data = res;
        // workExperience for Jobseeker and student
        let workExp : Array<any> = res.workExperience;
        if(res.aboutMe == null || res.aboutMe == "") this.aboutMe = "You haven't added any  details yet";
        else
        this.aboutMe =res.aboutMe;
        if(workExp == null || undefined || workExp.length==0) { this.emptyworkExp = "You haven't added any  details yet";}
        else{
          data.workExperiences =  res.workExperience;
          this.CandidateData= data;
        }
        data.educationDetails = res.educationDetail;
        data.candidateCertifications = res.certification;
         this.CandidateData= data;
         this.util.stopLoader();
      });
  }
  // All Form
  aboutUsForm() {
    this.CadidateInfo = this.fb.group({
      resumeSummary: [null, [Validators.maxLength(2600)]],
    },
      {
        validators: CustomValidator.jobDescriptionLength('resumeSummary')
      }
    );
  }
  workExperiencesformfields() {
    this.CadidateWorkExpeiecnceForm = this.fb.group({
      title: [null, [Validators.required]],
      organisationName: [null, [Validators.required,CustomValidator.checkWhiteSpace() ,CustomValidator.max(this.ORGANIZATION_NAME.max)],],
      clientType: [null, [Validators.required]],
      expId: [null],
      userId: [null],
      currentOrganization: [false],
      startMonth: [null, [Validators.required]],
      startYear: [this.currentYear, [Validators.required]],
      endMonth: [null, [Validators.required]],
      endYear: [this.currentYear, [Validators.required]],
      state: [null, [Validators.required, CustomValidator.max(this.STATE.max)]],
      city: [null, [Validators.required , CustomValidator.max(this.CITY.max)]],
      zipcode: [null, [Validators.required , CustomValidator.minmaxLetters(this.ZIPCODE.min,this.ZIPCODE.max)]],
      badge: [false],
      country: [null, [Validators.required]],
    })
  }
  CadidateCerificationFormField() {
    this.CadidateCerificationForm = this.fb.group({
      certificationName: [null, Validators.required],
      certificateOrganization: [null, Validators.required],
      certificateLicenseNo: [null, Validators.required],
      startMonth: [null, [Validators.required]],
      startYear: [this.currentYear, [Validators.required]],
      endMonth: [null, [Validators.required]],
      endYear: [this.currentYear, [Validators.required]],
      certificateId: [null],
      userId: [null]
    })
  }
  CadidateEducationFormfiles() {
    this.CadidateEducationForm = this.fb.group({
      schoolName: [null, [Validators.required , CustomValidator.minmaxLetters(this.SCHOOL_NAME.min , this.SCHOOL_NAME.max)]],
      institutionId: [null],
      eduId: [null],
      userId: [null],
      degree: [null, [Validators.required]],
      showThisOnProfile: [false],
      currentlyPursued: [false],
      startMonth: [null, [Validators.required]],
      startYear: [this.currentYear, [Validators.required]],
      endMonth: [null, [Validators.required]],
      endYear: [this.currentYear, [Validators.required]],
      city: [null, [Validators.required, CustomValidator.max(this.CITY.max)]],
      street: [null, [Validators.required]],
      state: [null, [Validators.required, CustomValidator.max(this.STATE.max)]],
      zipcode: [null, [Validators.required, CustomValidator.minmaxLetters(this.ZIPCODE.min,this.ZIPCODE.max)]],
      country: [null, [Validators.required]],
      speciality: [null, [Validators.required]],
    })
  }
  // Formcontrols
  get candidateRequsetControls() {
    return this.CadidateInfo.controls
  }
  get workFromControl() {
    return this.CadidateWorkExpeiecnceForm.controls
  }
  get educationFormControl() {
    return this.CadidateEducationForm.controls
  }
  get CerificationControl() {
    return this.CadidateCerificationForm.controls
  }
  // model for modelResumeSummary
  modelResumeSummary(template: TemplateRef<any>) {
    this.CadidateInfo.reset();
    this.modalRef = this.modalService.show(template, { class: 'modal-lg' ,backdrop: 'static', keyboard: false});
    if(this.userType == 'student' || this.userType == 'JOB_SEEKER') {
      this.CadidateInfo.patchValue({ 'resumeSummary': this.CandidateData.aboutMe })
    }
    else  this.CadidateInfo.patchValue({ 'resumeSummary': this.CandidateData.aboutCandidate })
  }
  savemodalRef : BsModalRef;
  // model for modelResumeSummary
  modelWorkExperience(template: TemplateRef<any>,value) {
    this.checkWorkModel = value
    this.CadidateWorkExpeiecnceForm.reset();
    this.submittedWorkexp = false;
    this.savemodalRef = this.modalService.show(template, { class: 'modal-md' });
    this.CadidateWorkExpeiecnceForm.patchValue({
      endYear: this.currentYear,
      startYear: this.currentYear,
    });
    // this.CadidateWorkExpeiecnceForm.patchValue({ 'resumeSummary': this.CandidateData.resumeSummary })
  }
  modelEducation(template: TemplateRef<any>,val) {
    this.checkEduMOdel=val;
    this.CadidateEducationForm.reset();
    this.submittedEducation = false;
    this.modalRef = this.modalService.show(template, { class: 'modal-md' });
    this.CadidateEducationForm.patchValue({
      endYear: this.currentYear,
      startYear: this.currentYear,
    });
    // this.CadidateEducation.patchValue({ 'resumeSummary': this.CandidateData.resumeSummary })
  }
   modelCertification(template: TemplateRef<any>,val) {
    this.CadidateCerificationForm.reset();
    this.checkcertificationmodel =val;
    this.submittedCertification = false;
    this.modalRef = this.modalService.show(template, { class: 'modal-md' });
    this.CadidateCerificationForm.patchValue({
      endYear: this.currentYear,
      startYear: this.currentYear,
    });
    // this.CadidateCerification.patchValue({ 'resumeSummary': this.CandidateData.resumeSummary })
  }
   curOrg(event){
    if(event.target.clicked==true){
         this.CadidateWorkExpeiecnceForm.value.currentOrganization == true;
     }
    else if(event.target.clicked==false){
       this.CadidateWorkExpeiecnceForm.value.currentOrganization == false;
    }
  }
  changeEduOrg(event){
    if(event.target.clicked==true){
        this.CadidateEducationForm.value.currentlyPursued = true;
        this.CadidateEducationForm.get('currentlyPursued').setValidators(Validators.required);
        this.CadidateEducationForm.get('currentlyPursued').updateValueAndValidity();
     }
    else if(event.target.clicked==false){
      this.CadidateEducationForm.value.currentlyPursued = false;
    }
  }
    saveAboutMe(){
      let data : any={}
      data = this.CandidateData;
      data.aboutMe = this.CadidateInfo.value.resumeSummary;
      this.util.startLoader();
      this.api.create('user/saveUser',data).subscribe(res=>{
        if(res){
          this.util.stopLoader();
          this.aboutMe = res.aboutMe;
          this.modalRef.hide();
        }
      });
  }
  // save  About us
  saveaboutUS() {
    //  
    if(this.userType == 'student' || this.userType == 'JOB_SEEKER') {
      this.saveAboutMe();
     }
     else {
        if (this.CadidateInfo.valid) {
          this.submitted=true
          this.modalRef.hide();
          this.CandidateData.aboutCandidate = this.CadidateInfo.value.resumeSummary;
          this.CandidateData.candidateReferenceId=this.CandidateData.candidateId;
          this.FormData = new FormData();
          this.FormData.append("candidate", new Blob([JSON.stringify(this.CandidateData)], { type: "application/json" }));
          this.util.startLoader()
          this.api.updatePut('candidates/updateCandidate', this.FormData).subscribe(res => {
            this.util.stopLoader();
          })
          }
     }
     this.submitted=false;
}
  close(){
    if(this.checkWorkModel=="save"){
      this.savemodalRef.hide();
    }
    else if ( this.checkWorkModel=="edit"){
      this.modalRef.hide();
    }
  }
  // work experience
  getTitleList() {
    var data = { 'domain': 'GIGSUMO_JOB_TITLE,GIGSUMO_RECRUITERS_TITLE_LIST' }
    this.util.startLoader()
    this.loadAPIcall=true;
    this.api.create('listvalue/findbyList', data).subscribe(res => {
      this.loadAPIcall=false;
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
  generateYears() {
    var max = new Date().getFullYear();
    var min = max - 80;
    this.years = [];
    for (var i = min; i <= max; i++) {
      this.years.push(i);
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
  onChangeCountry(event, value) {
    const countryCode = event;
    this.stateList = [];
    this.util.startLoader();
    this.api
      .query("country/getAllStates?countryCode=" + countryCode)
      .subscribe((res) => {
        if (res) {
          this.util.stopLoader();
          this.stateList = res;
        }
      }, err => {
        this.util.stopLoader();
      });
  }
  resenOtp : boolean = false;
  requestAnotherOTP(){
    let data : any ={}
    data.email = this.domainForm.value.businessemail;
    data.fristName = this.firstName
    data.lastName = this.lastName
    data.userId = this.userId
    this.newPrimaryEmail= this.domainForm.value.businessemail
     this.api.create("user/sendOtpToMailId",data).subscribe(res=>{
      if(res.code=="00000"){
        this.checkotpEmailSent = true;
        this.resenOtp = true;
      }
      else if(res.code=="99998"){
            this.checkotpEmailSent = false
             this.resenOtp = false
            Swal.fire({
              title:"Email Already Exists",
              text:"use different email to proceed",
              icon:"info",
              timer:2000
            })
        }
    })
  }
  digitKeyOnly(e) {
    var keyCode = e.keyCode == 0 ? e.charCode : e.keyCode;
    if ((keyCode >= 37 && keyCode <= 40) || (keyCode == 8 || keyCode == 9 || keyCode == 13) || (keyCode >= 48 && keyCode <= 57)) {
      return true;
    }
    return false;
  }
  decline(): void {
    this.modalRef.hide();
  }
  closeBusiness(){
    this.checkotpEmailSent = false
    this.businessmodal.hide();
  }
  /*  API call & Data Save */
  //  work experience
  emailValidationWorkExperience : boolean = false;
  workExperSave() {
    if(this.userType == 'student' || this.userType == 'JOB_SEEKER') {
      let dataPost: any = {};
      if(this.checkWorkModel=='save') {
         this.submittedWorkexp = true;
       if (this.CadidateWorkExpeiecnceForm.valid ||
           this.CadidateWorkExpeiecnceForm.value.currentOrganization==true &&  this.CadidateWorkExpeiecnceForm.controls.endMonth.errors.required) {
         this.util.startLoader();
          dataPost = this.CadidateWorkExpeiecnceForm.value;
           dataPost.userId = this.userId;
           this.savemodalRef.hide();
           this.util.stopLoader()
             this.api.create('user/v1/workexperience', dataPost).subscribe((res) => {
               if(res.code=="00000"){
                   if(res.data.experience!=null)
                  {
                    let data : any ={};
                    data = res.data.experience;
                    this.CandidateData.workExperiences.push(data)
                  }
             }
             else if(res.code=="99998"){
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
                   title: "Oops..",
                   text: "You already have a current organization. Changing your current organization to a new work place requires you to authenticate a new business email address for the organization. Would you like to proceed?",
                   icon: "info",
                   showDenyButton: true,
                   confirmButtonText: "Yes",
                   denyButtonText: "No"
                 }).then((result)=>{
                   if(result.isConfirmed){
                     this.getDomainForm();
                     this.savemodalRef.hide();
                     this.domainForm.get('businessemail').setErrors({emailExists : false})
                     this.domainForm.get('domainValidationOtp').setErrors({wrongOtp : false})
                       let ngbModalOptions: NgbModalOptions = { backdrop : 'static', keyboard : false};
                       this.businessmodal = this.modalService.show(this.businessTemplate,ngbModalOptions)
                   }
                 });
             }
             else if (res.code=="10002"){
               Swal.fire({
                 text: "You are the super admin of the business page. You have to transfer super admin rights to other members before changing your current organization.",
                 title: "Cannot change current organization",
                 icon: "error",
                 confirmButtonText: "Ok",
               })
             }
       })
     }
     }
     else if(this.checkWorkModel=='edit') {
       this.submittedWorkexp = true;
       if (this.CadidateWorkExpeiecnceForm.valid || this.CadidateWorkExpeiecnceForm.value.currentOrganization==true
        &&  this.CadidateWorkExpeiecnceForm.controls.endMonth.errors.required) {
         this.util.startLoader();
         let dataPost: any = {};
          dataPost = this.CadidateWorkExpeiecnceForm.value;
           if (this.editData != undefined) {
             dataPost = this.CadidateWorkExpeiecnceForm.value;
             dataPost.expId = this.editData.expId;
             dataPost.candidateId = this.editData.candidateId;
           }
           this.util.stopLoader()
           this.api.updatePut('user/v1/workexperience', dataPost).subscribe((res) => {
             if(res.code==="00000"){
              this.modalRef.hide();
                  this.CandidateData.workExperiences.forEach((element,i) => {
                   if(element.expId==this.editData.expId){
                       this.CandidateData.workExperiences[i] = this.CadidateWorkExpeiecnceForm.value;
                   }
                 });
             }
             else if(res.code==="99998"){
              this.modalRef.hide();
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
                  title: "Oops..",
                  text: "You already have a current organization. Changing your current organization to a new work place requires you to authenticate a new business email address for the organization. Would you like to proceed?",
                  icon: "info",
                  showDenyButton: true,
                  confirmButtonText: "Yes",
                  denyButtonText: "No"
                }).then((result)=>{
                  if(result.isConfirmed){
                    this.getDomainForm();
                    this.savemodalRef.hide();
                    this.domainForm.get('businessemail').setErrors({emailExists : false})
                    this.domainForm.get('domainValidationOtp').setErrors({wrongOtp : false})
                      let ngbModalOptions: NgbModalOptions = { backdrop : 'static', keyboard : false};
                      this.businessmodal = this.modalService.show(this.businessTemplate,ngbModalOptions)
                  }
                });
            }
             else if (res.code==="10002"){
               Swal.fire({
                 text: "You are the super admin of the business page. You have to transfer super admin rights to other members before changing your current organization.",
                 title: "Cannot change current organization",
                 icon: "error",
                 confirmButtonText: "Ok",
               })
              }
             else if(res.code==="99996"){
              Swal.fire({
                title: "Oops..",
                text: "Sorry, one current organization is at least needed for your user type.",
                icon: "error",
                 confirmButtonText: "Ok",
               })
             }
       })
     }
     }
     else if(this.checkWorkModel='saveAfterOtp'){
       dataPost = this.CadidateWorkExpeiecnceForm.getRawValue();
     dataPost.action ="APPROVED";
     dataPost.userId = this.userId;
     dataPost.badge = false;
     dataPost.endMonth = null;
     this.api.create('user/v1/workexperience', dataPost).subscribe((res) => {
       if(res.code=="00000"){
         this.savemodalRef.hide();
         this.businessmodal.hide();
           Swal.fire({
           title: "Work Experience Updated",
           text: "Changes made successfully and your work experience is updated. You will be logged out now. Please login again with the new business email credential.",
           icon: "success",
           timer: 2000,
           showCancelButton: false,
           showConfirmButton: false
         }).then(()=>{
           this.onLogout();
         })
     }
     });
     }
    }
    else{
      this.candidateWorkExp();
    }
}
  zipCodeValidaiton(x : number) : boolean{
    if(String(x).length > 10){
      return false;
    }
    return true;
  }
candidateWorkExp(){
  if(this.checkWorkModel=='save'){
    this.submittedWorkexp = true;
  if (this.CadidateWorkExpeiecnceForm.valid ||
     this.CadidateWorkExpeiecnceForm.value.currentOrganization==true && this.CadidateWorkExpeiecnceForm.controls.endMonth.errors.required ) {
    let dataPost: any = {};
    this.util.startLoader()
    this.CadidateWorkExpeiecnceForm.value.candidateId = this.candidateDetails.candidateId;
    this.CadidateWorkExpeiecnceForm.value.streamAction = "ADD";
    dataPost = this.CadidateWorkExpeiecnceForm.value;
       if (this.editData != undefined) {
        dataPost = this.CadidateWorkExpeiecnceForm.value;
        dataPost.expId = this.editData.expId;
        dataPost.candidateId = this.editData.candidateId;
      }
      this.savemodalRef.hide();
      this.api.updatePut('candidates/updateCandidateWorkExperience', dataPost).subscribe((res) => {
        this.util.stopLoader()
        this.CandidateData.workExperiences.push(res.data.candiateExperience);
       })
  }
  }
  else if (this.checkWorkModel=='edit'){
    this.submittedWorkexp = true;
  if (this.CadidateWorkExpeiecnceForm.valid ||
     this.CadidateWorkExpeiecnceForm.value.currentOrganization==true && this.CadidateWorkExpeiecnceForm.controls.endMonth.errors.required ) {
    let dataPost: any = {};
    this.util.startLoader()
       if (this.editData != undefined) {
        dataPost = this.CadidateWorkExpeiecnceForm.value;
        dataPost.expId = this.editData.expId;
        dataPost.candidateId = this.editData.candidateId;
      }
      this.modalRef.hide();
      this.api.updatePut('candidates/updateCandidateWorkExperience', dataPost).subscribe((res) => {
        this.util.stopLoader()
        this.CandidateData.workExperiences.forEach((element,i) => {
          if(element.expId==this.editData.expId){
            this.CandidateData.workExperiences[i] = res.data.candiateExperience;
          }
        });
       })
  }
  }
}
checkotpEmailSent : boolean = false;
newPrimaryEmail : string
emailvalid :string
proceedAfterValidation(){
  const email = this.domainForm.value.businessemail
  // const emailpattern : RegExp = ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$;
  const expression: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  const result: boolean = expression.test(email)
  if(result){
    let data : any ={}
    data. email= this.domainForm.value.businessemail;
    data.fristName = this.firstName
    data.lastName = this.lastName
    data.userId = this.userId
    this.newPrimaryEmail= this.domainForm.value.businessemail
     this.api.create("user/sendOtpToMailId",data).subscribe(res=>{
      if(res.code=="00000"){
        this.checkotpEmailSent = true;
      }
      else if(res.code=="99998"){
            this.checkotpEmailSent = false
            Swal.fire({
              title:"Email Already Exists",
              text:"use different email to proceed",
              icon:"info",
              timer:2000
            })
        }
    })
  }
  else {
    this.emailvalid ="Enter a Valid Email"
  }
}
  monthChange(val) {
    if (val == "exp") {
      var a: any = this.CadidateWorkExpeiecnceForm.value.startYear;
      var b: any = this.CadidateWorkExpeiecnceForm.value.endYear;
      if (a == b) {
        this.CadidateWorkExpeiecnceForm.patchValue({
          endMonth: null,
        });
      }
    } else if (val == "edu") {
      var a: any = this.CadidateEducationForm.value.startYear;
      var b: any = this.CadidateEducationForm.value.endYear;
      if (a == b) {
        this.CadidateEducationForm.patchValue({
          endMonth: null,
        });
      }
    } else if (val == "cert") {
      var a: any = this.CadidateCerificationForm.value.startYear;
      var b: any = this.CadidateCerificationForm.value.endYear;
      if (a == b) {
        this.CadidateCerificationForm.patchValue({
          endMonth: null,
        });
      }
    }
  }
  checkMonth1(m, val) {
    if (val == "exp") {
      var n = new Date().getMonth();
      var maxYear = new Date().getFullYear();
      var maxMonth = n + 1;
      var monthCode = m;
      let startYear = parseInt(this.CadidateWorkExpeiecnceForm.value.startYear);
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
      let startYear = parseInt(this.CadidateEducationForm.value.startYear);
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
      let startYear = parseInt(this.CadidateCerificationForm.value.startYear);
      if (startYear == maxYear) {
        if (monthCode > maxMonth) {
          return true;
        } else {
          return false;
        }
      }
    }
  }
  checkYear(y, val) {
    // //// 
    if (val == "exp") {
      let yearDataInt = parseInt(this.CadidateWorkExpeiecnceForm.value.startYear);
      let year = parseInt(y);
      if (yearDataInt != null) {
        if (yearDataInt > year) {
          return true;
        } else {
          return false;
        }
      }
    } else if (val == "edu") {
      let yearDataInt = parseInt(this.CadidateEducationForm.value.startYear);
      let year = parseInt(y);
      if (yearDataInt != null) {
        if (yearDataInt > year) {
          return true;
        } else {
          return false;
        }
      }
    } else if (val == "cert") {
      let yearDataInt = parseInt(this.CadidateCerificationForm.value.startYear);
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
  validateOtp(){
    this.defineDomainErrors();
    if(this.domainForm.value.domainValidationOtp==null  || this.domainForm.value.domainValidationOtp==''){
      this.domainForm.get('domainValidationOtp').setErrors({wrongOtp : false})
     }
    else{
        this.domainForm.get('domainValidationOtp').setErrors({wrongOtp :false})
        this.util.startLoader();
         let data : any ={}
        data.businessId = this.userId;
        data.entityId = this.userId;
        data.otp = this.domainForm.value.domainValidationOtp;
        data.primaryMailId =  this.domainForm.value.businessemail;
        data.secondaryMailId = this.previousMailId
        this.api.create('user/verifyOTPToPrimaryMailId',data).subscribe(res=>{
          this.util.stopLoader();
            if(res.code=="00000"){
              this.domainForm.get('domainValidationOtp').setErrors({wrongOtp :false})
              Swal.fire({
                position: "center",
                icon: "success",
                title: "OTP verified successfully.",
                showConfirmButton: false,
                timer: 2000,
              })
                this.checkWorkModel = 'saveAfterOtp';
                this.workExperSave();
            }
            else if (res.code=="99998"){
               this.domainForm.get('domainValidationOtp').setErrors({wrongOtp :true})
              this.util.stopLoader();
              this.resenOtp=false;
             }
        })
    }
  }
  get domainControl(){
    return this.domainForm.controls;
   }
  checkMailExists(email:string){
    this.emailvalid =null
    this.defineDomainErrors();
    if(this.domainForm.value.businessemail==null  || this.domainForm.value.businessemail=='' && email.length==0 || email ==""){
      this.domainForm.get('businessemail').setErrors({emailExists : false})
     }
    else{
          this.domainForm.get('businessemail').setErrors({emailExists : false});
          this.api.query("user/checkMailAlreadyExists/" + email).subscribe((res) => {
        if(res.code=="00000"){
          if (res.data.exists) {
           this.domainForm.get('businessemail').setErrors({emailExists : true});
          } else if(res.data.exists==false){
           this.domainForm.get('businessemail').setErrors({emailExists : false});
           }
         }
       })
    }
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
  organizationList : Array<any>
  searchBarShow : boolean = false
  getOrganization(val){
    if(val!=null){
      this.util.startLoader();
        this.api.query("care/organizations?organizationName=" + val)
         .subscribe((res) => {
          this.util.stopLoader();
          this.organizationList=[]
            res.forEach(ele => {
              this.organizationList.push(ele);
             });
         });
         this.searchBarShow = true;
    }
    else{
      this.searchBarShow = false
    }
  }
  onchangeEdu(element){
    this.CadidateEducationForm.patchValue({
            country : element.country,
            city : element.city,
            state : element.state,
            zipcode : element.zipCode
    })
  }
  onChangeorg(value ){
   var data = value.organizationName + "/" + value.organizationId;
   this.api.query("care/organization/" + data).subscribe(res=>{
      if(res){
        res.forEach(element => {
          this.CadidateWorkExpeiecnceForm.patchValue({
            country : element.country,
            city : element.city,
            state : element.state,
            zipcode : element.zipCode
          })
        });
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
    this._socket.ngOnDestroy();
    this._socket_stream.ngOnDestroy();
setTimeout(() => {
	    this.router.navigate(["login"]);
}, 2000);  }
  onChangeYear(val) {
    const maxyr = new Date().getFullYear();
    if (val == "exp") {
      if (
        this.CadidateWorkExpeiecnceForm.value.startYear ==
        this.CadidateWorkExpeiecnceForm.value.endYear ||
        this.CadidateWorkExpeiecnceForm.value.endYear == maxyr
      ) {
        this.CadidateWorkExpeiecnceForm.patchValue({ endMonth: null });
      }
      if (
        this.CadidateWorkExpeiecnceForm.value.startYear ==
        this.CadidateWorkExpeiecnceForm.value.endYear
      ) {
        this.validateMonth = true;
      } else {
        this.validateMonth = false;
      }
    } else if (val == "edu") {
      if (
        this.CadidateEducationForm.value.startYear ==
        this.CadidateEducationForm.value.endYear ||
        this.CadidateEducationForm.value.endYear == maxyr
      ) {
        this.CadidateEducationForm.patchValue({ endMonth: null });
      }
      if (
        this.CadidateEducationForm.value.startYear ==
        this.CadidateEducationForm.value.endYear
      ) {
        // this.validateEduMonth = true;
      } else {
        // this.validateEduMonth = false;
      }
    } else if (val == "cert") {
      if (
        this.CadidateCerificationForm.value.startYear ==
        this.CadidateCerificationForm.value.endYear ||
        this.CadidateCerificationForm.value.endYear == maxyr
      ) {
        this.CadidateCerificationForm.patchValue({ endMonth: null });
      }
      if (
        this.CadidateCerificationForm.value.startYear ==
        this.CadidateCerificationForm.value.endYear
      ) {
        // this.validateCertMonth = true;
      } else {
        // this.validateCertMonth = false;
      }
    }
  }
  checkMonth(m, val) {
    var max = new Date().getFullYear();
    if (val == "exp") {
      let endyr = parseInt(this.CadidateWorkExpeiecnceForm.value.endYear);
      let stMonth = this.CadidateWorkExpeiecnceForm.value.startMonth;
      let styr = parseInt(this.CadidateWorkExpeiecnceForm.value.startYear);
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
      let endyr = parseInt(this.CadidateEducationForm.value.endYear);
      let stMonth = this.CadidateEducationForm.value.startMonth;
      let styr = parseInt(this.CadidateEducationForm.value.startYear);
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
      let endyr = parseInt(this.CadidateCerificationForm.value.endYear);
      let stMonth = this.CadidateCerificationForm.value.startMonth;
      let styr = parseInt(this.CadidateCerificationForm.value.startYear);
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
  yearChange(event, val) {
    if (val == "exp") {
      var stYr = parseInt(this.CadidateWorkExpeiecnceForm.value.startYear);
      var maxYr = new Date().getFullYear();
      if (stYr == maxYr) {
        this.CadidateWorkExpeiecnceForm.patchValue({ startMonth: null });
      }
      this.yearData = event.target.value;
      // this.yearIndex = index;
      this.CadidateWorkExpeiecnceForm.patchValue({
        endYear: this.currentYear,
        endMonth: null,
      });
    } else if (val == "edu") {
      var stYr = parseInt(this.CadidateEducationForm.value.startYear);
      var maxYr = new Date().getFullYear();
      if (stYr == maxYr) {
        this.CadidateEducationForm.patchValue({ startMonth: null });
      }
      this.yearData = event.target.value;
      // this.yearIndex = index;
      this.CadidateEducationForm.patchValue({
        endYear: this.currentYear,
        endMonth: null,
      });
    } else if (val == "cert") {
      var stYr = parseInt(this.CadidateCerificationForm.value.startYear);
      var maxYr = new Date().getFullYear();
      if (stYr == maxYr) {
        this.CadidateCerificationForm.patchValue({ startMonth: null });
      }
      this.yearData = event.target.value;
      // this.yearIndex = index;
      this.CadidateCerificationForm.patchValue({
        endYear: this.currentYear,
        endMonth: null,
      });
    }
  }
  removeWorkExperience(values){
   this.editData=values;
    if(this.userType == 'student' || this.userType == 'JOB_SEEKER') {
      if(values.currentOrganization==true){
        this.util.startLoader();
        const swalWithBootstrapButtons = Swal.mixin({
          customClass: {confirmButton: "btn btn-success"},
          buttonsStyling: false,
        });
         swalWithBootstrapButtons
          .fire({
            title: "Sorry, you can't delete this.",
            text: "This work place is being shown on your profile.",
            icon: "warning",
            confirmButtonText: "Okay",
          });
          this.util.stopLoader();
      }
      else{
        const swalWithBootstrapButtons = Swal.mixin({
          customClass: {
            confirmButton: 'btn btn-success',
            cancelButton: 'btn btn-danger'
          },
          buttonsStyling: false
        })
        swalWithBootstrapButtons.fire({
          title: 'Are you sure?',
          text: "You won't be able to revert this!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, delete it!',
          cancelButtonText: 'No, cancel!',
          reverseButtons: true
        }).then((result)=>{
            if(result.isConfirmed){
              this.util.startLoader();
               this.api.create("user/remove/workexp",values).subscribe(res=>{
                if(res.code="00000"){
                  this.util.stopLoader();
                   this.CandidateData.workExperiences.forEach(element=>{
                      if(element.expId==values.expId){
                        this.CandidateData.workExperiences.pop();
                      }
                   })
                }
                this.util.stopLoader();
               });
            }
          })
      }
    }
    else {
        this.removeCandidateWorkExperience(values);
    }
  }
  workexpEdit(template: TemplateRef<any>, item, value) {
    this.checkWorkModel =value
    this.CadidateWorkExpeiecnceForm.reset();
    this.editData = item;
    this.modalRef = this.modalService.show(template, this.backdropConfig);
    this.CadidateWorkExpeiecnceForm.patchValue(item);
  }
  removeCandidateWorkExperience(item) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: false,
    });
    swalWithBootstrapButtons
      .fire({
        title: "Are you sure you want to remove?",
        text: "You won't be able to revert this",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
        reverseButtons: true,
      })
      .then((result) => {
        if(result.isConfirmed){
            item.streamAction = "REMOVE";
        this.util.startLoader()
        this.api.updatePut('candidates/updateCandidateWorkExperience', item).subscribe((data) => {
        this.util.stopLoader()
          this.CandidateData.workExperiences.forEach(element => {
              if(element.expId==item.expId){
                this.CandidateData.workExperiences.pop();
              }
          });
        })
        }
    });
  }
  // Education for JS and Student
  JSEducationSave(){
    let data : any ={}
  if(this.checkEduMOdel=='save'){
    this.submittedEducation = true;
    if (this.CadidateEducationForm.valid || this.CadidateEducationForm.value.currentlyPursued==true && this.CadidateEducationForm.controls.endMonth.errors.required) {
      this.util.startLoader();
       data = this.CadidateEducationForm.value;
      this.api.create('user/create/education',data).subscribe(res=>{
        this.modalRef.hide();
        let education : Array<any> = res.data.User.educationDetail;
           this.CandidateData.educationDetails.push(education[0]);
           this.util.stopLoader();
       })
  }
  }
  else if(this.checkEduMOdel=='edit'){
    data = this.CadidateEducationForm.value;
    if (this.CadidateEducationForm.valid || this.CadidateEducationForm.value.currentlyPursued==true && this.CadidateEducationForm.controls.endMonth.errors.required) {
      this.util.startLoader();
      if(this.editData!=null){
        data.eduId = this.editData.eduId;
       }
      this.api.updatePut('user/update/education',data).subscribe(res=>{
        this.modalRef.hide();
        this.util.stopLoader();
           this.CandidateData.educationDetails.forEach((element,i) => {
              if(element.eduId==this.editData.eduId){
                this.CandidateData.educationDetails[i] = res.data.User.educationDetail[0];
              }
           });
       })
    }
  }
}
  checkEduMOdel : string;
  // Education  Part
  EducationFormSave() {
      if(this.userType == 'student' || this.userType == 'JOB_SEEKER') {
        this.JSEducationSave();
        return;
      }
    if(this.checkEduMOdel=='save'){
      this.submittedEducation = true;
      if (this.CadidateEducationForm.valid || this.CadidateEducationForm.value.currentlyPursued==true && this.CadidateEducationForm.controls.endMonth.errors.required) {
        this.util.startLoader();
          let dataPost: any = {};
          this.CadidateEducationForm.value.candidateId = this.candidateDetails.candidateId;
          this.CadidateEducationForm.value.streamAction = "ADD";;
           dataPost = this.CadidateEducationForm.value;
           this.modalRef.hide();
           this.api.updatePut('candidates/updateCandidateEducationalDetail', dataPost).subscribe((res) => {
            this.util.stopLoader();
                this.CandidateData.educationDetails.push(res.data.candidateEducationDetails);
           });
       }
    }
    else if (this.checkEduMOdel=='edit'){
      this.submittedEducation = true;
      if (this.CadidateEducationForm.valid ||  this.CadidateEducationForm.value.currentlyPursued==true && this.CadidateEducationForm.controls.endMonth.errors.required) {
        this.util.startLoader();
        let dataPost: any = {};
        this.CadidateEducationForm.value.candidateId = this.candidateDetails.candidateId;
        this.CadidateEducationForm.value.streamAction = "ADD";;
        dataPost = this.CadidateEducationForm.value;
        if (this.editData != null) {
          dataPost = this.CadidateEducationForm.value;
          dataPost.eduId = this.editData.eduId;
          dataPost.candidateId = this.editData.candidateId;
        }
           this.modalRef.hide();
          this.api.updatePut('candidates/updateCandidateEducationalDetail', dataPost).subscribe((res) => {
            this.util.stopLoader();
                this.CandidateData.educationDetails.forEach((element,i) => {
                    if(element.eduId==this.editData.eduId){
                      this.CandidateData.educationDetails[i] = res.data.candidateEducationDetails;
                    }
                });
           });
       }
    }
  }
  closeValidator(){
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        denyButton: 'btn btn-danger'
      },
      buttonsStyling: false,
    });
    swalWithBootstrapButtons
      .fire({
        title: "Are you sure you want to close?",
        text: "This will not let you change your current organization.",
        icon: "error",
        // timer: 3000,
        showDenyButton: true,
        confirmButtonText: "Yes",
        denyButtonText: "No"
      }).then((result)=>{
        if(result.isConfirmed){
          this.businessmodal.hide();
        }
      })
  }
  eduEdit(template: TemplateRef<any>, item, value) {
    this.CadidateEducationForm.reset()
    this.checkEduMOdel = value;
    this.editData = item;
    this.modalRef = this.modalService.show(template, this.backdropConfig);
    this.CadidateEducationForm.patchValue(item);
  }
  removeEducation(item:any) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: false,
    });
    swalWithBootstrapButtons
      .fire({
        title: "Are you sure you want to remove?",
        text: "You won't be able to revert this",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
        reverseButtons: true,
      })
      .then((result) => {
        if(result.isConfirmed){
          if(this.userType == 'student' || this.userType == 'JOB_SEEKER') {
            this.JSremoveEducation(item);
            return;
          }
          item.streamAction = 'REMOVE';
          this.util.startLoader();
          this.api.updatePut('candidates/updateCandidateEducationalDetail', item).subscribe((data) => {
            this.util.stopLoader();
           this.CandidateData.educationDetails.forEach(element => {
            if(element.eduId==item.eduId){
              this.CandidateData.educationDetails.pop();
            }
           });
          })
        }
      });
  }
  JSremoveEducation(value){
    this.api.create("user/remove/education",value).subscribe(res=>{
      this.CandidateData.educationDetails.forEach(element => {
          if(element.eduId==value.eduId){
            this.CandidateData.educationDetails.pop();
          }
      });
    })
  }
  JScertiificatiobnsave(){
    if(this.checkcertificationmodel=='save'){
      this.submittedCertification = true;
      if(this.CadidateCerificationForm.valid){
        this.util.startLoader();
         let dataPost: any = {};
         dataPost = this.CadidateCerificationForm.value;
         dataPost.userId = this.userId
       this.modalRef.hide();
       this.api.create('user/create/certification', dataPost).subscribe((res) => {
         this.util.stopLoader();
        this.CandidateData.candidateCertifications.push(res.data.User.certification[0]);
       })
     }
    }
    else if (this.checkcertificationmodel=='edit'){
      this.submittedCertification = true;
      if(this.CadidateCerificationForm.valid){
        this.util.startLoader();
        let dataPost: any = {};
         dataPost = this.CadidateCerificationForm.value;
       if (this.editData != null) {
          dataPost.certificateId = this.editData.certificateId;
        }
       this.modalRef.hide();
        this.api.updatePut('user/update/certification', dataPost).subscribe((res) => {
         this.util.stopLoader();
        this.CandidateData.candidateCertifications.forEach((element,i) => {
          if(element.certificateId==this.editData.certificateId){
            this.CandidateData.candidateCertifications[i] = res.data.User.certification[0];
          }
        });
       })
     }
    }
  }
  // cerification's
  certificateFormsave() {
    if(this.userType == 'student' || this.userType == 'JOB_SEEKER') {
      this.JScertiificatiobnsave();
      return;
    }
    if(this.checkcertificationmodel=='save'){
      this.submittedCertification = true;
      if(this.CadidateCerificationForm.valid){
       let dataPost: any = {};
       this.CadidateCerificationForm.value.candidateId = this.candidateDetails.candidateId;
       this.CadidateCerificationForm.value.streamAction = "ADD";
       dataPost = this.CadidateCerificationForm.value;
       if (this.editData != null) {
         dataPost = this.CadidateCerificationForm.value;
         dataPost.certificateId = this.editData.certificateId;
         dataPost.candidateId = this.editData.candidateId;
       }
       this.modalRef.hide();
       this.util.startLoader();
       this.api.updatePut('candidates/updateCandidateCertifications', dataPost).subscribe((res) => {
         this.util.stopLoader();
        this.CandidateData.candidateCertifications.push(res.data.candidateCertificates);
       })
     }
    }
    else if (this.checkcertificationmodel=='edit'){
      this.submittedCertification = true;
      if(this.CadidateCerificationForm.valid){
       let dataPost: any = {};
       this.CadidateCerificationForm.value.candidateId = this.candidateDetails.candidateId;
       this.CadidateCerificationForm.value.streamAction = "ADD";
       dataPost = this.CadidateCerificationForm.value;
       if (this.editData != null) {
         dataPost = this.CadidateCerificationForm.value;
         dataPost.certificateId = this.editData.certificateId;
         dataPost.candidateId = this.editData.candidateId;
       }
       this.modalRef.hide();
       this.util.startLoader();
       this.api.updatePut('candidates/updateCandidateCertifications', dataPost).subscribe((res) => {
         this.util.stopLoader();
        this.CandidateData.candidateCertifications.forEach((element,i) => {
          if(element.certificateId==this.editData.certificateId){
            this.CandidateData.candidateCertifications[i] = res.data.candidateCertificates;
          }
        });
       })
     }
    }
  }
  checkcertificationmodel : string
  certEdit(template: TemplateRef<any>, item, value) {
    this.CadidateCerificationForm.reset()
    this.editData = item;
    this.checkcertificationmodel = value;
     this.modalRef = this.modalService.show(template, this.backdropConfig);
    this.CadidateCerificationForm.patchValue(item);
  }
  removeCertification(item) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: false,
    });
    swalWithBootstrapButtons
      .fire({
        title: "Are you sure you want to remove?",
        text: "You won't be able to revert this",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
        reverseButtons: true,
      })
      .then((result) => {
        if(result.isConfirmed){
          if (this.userType.match("JOB_SEEKER") || !this.userType.match("JOB_SEEKER") && this.userType.match("student") ){
            this.JSremoveCertifications(item);
           }
          else{
            item.streamAction = "REMOVE";
          this.util.startLoader();
          this.api.updatePut('candidates/updateCandidateCertifications', item).subscribe((data) => {
            this.util.stopLoader();
             this.CandidateData.candidateCertifications.forEach(element => {
                if(element.certificateId==item.certificateId){
                  this.CandidateData.candidateCertifications.pop();
                }
             });
          })
          }
        }
      });
  }
JSremoveCertifications(val){
  this.util.startLoader();
  this.api.create('user/remove/certification', val).subscribe((data) => {
     this.CandidateData.candidateCertifications.forEach(element => {
        if(element.certificateId==val.certificateId){
          this.CandidateData.candidateCertifications.pop();
        }
     });
     this.util.stopLoader();
  });
}
  fromMonthChange(month){
  }
  fromYearChange(year){
  }
  startfromMonthChange(month){
  }
  startYearChange(year){
  }
}
