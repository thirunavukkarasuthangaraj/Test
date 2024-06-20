
import { Location } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { ChangeDetectorRef, Component, EventEmitter, HostListener, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { Observable, Subject, Subscription } from 'rxjs';
import { AppSettings } from 'src/app/services/AppSettings';
import { CandidateService } from 'src/app/services/CandidateService';
import { FormValidation } from 'src/app/services/FormValidation';
import { GigsumoConstants } from 'src/app/services/GigsumoConstants';
import { UserService } from 'src/app/services/UserService';
import { ApiService } from 'src/app/services/api.service';
import { candidateModel } from 'src/app/services/candidateModel';
import { CommonValues } from 'src/app/services/commonValues';
import { GigsumoService } from 'src/app/services/gigsumoService';
import { JobService } from 'src/app/services/job.service';
import { JobModel } from 'src/app/services/jobModel';
import { jobModuleConfig } from 'src/app/services/jobModuleConfig';
import { WorkExperience } from 'src/app/services/userModel';
import { UtilService } from 'src/app/services/util.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { SocketService } from '../../../services/socket.service';
import { PricePlanService } from '../../Price-subscritions/priceplanService';
import { SearchData } from './../../../services/searchData';
import { ModelPriceComponent } from './../../Price-subscritions/model-price/model-price.component';
import { CreditModelComponent } from './../../credit/credit-model/credit-model.component';
import { CustomValidator } from '../../Helper/custom-validator';
declare var $: any;

@Component({
  selector: 'app-candidates-page',
  templateUrl: './candidates-page.component.html',
  styleUrls: ['./candidates-page.component.scss'],
  providers: []
})
export class CandidatesPageComponent extends FormValidation implements OnInit, OnDestroy, OnChanges {
  private wasInside = false;
  public FORMERROR = super.Form;
  @Output() candidateReload = new EventEmitter<any>()
  selectedCurrency: string = '';
  tempFile: any;
  rtrformgrp: UntypedFormGroup;
  candidateSupplyRef: BsModalRef;
  @Output() candidateListing = new EventEmitter();
  filterStatusList: { itemId: any; value: any; }[] = [];
  @Input() loadAPIcall: Boolean;

  @HostListener('click')
  clickInside() {
    this.wasInside = true;
  }
  @HostListener('document:click')
  clickout() {
    if (!this.wasInside) {
      this.searchData.setCandiHighLight('null');
    }
    this.wasInside = false;
  }
  @Input() passValues: Array<candidateModel> = [];
  @Input() responseReceived: any;
  @Input() viewSize: any;
  @Input() removeSelected: any;
  @Input() jobData: any;
  @Input() Obj: any;
  @Input() updateCandidateModule: jobModuleConfig;
  passCandidateData: any;
  @Input() removeTag: any;
  profileDetailResponse: any;
  ProfileComplete: any = {}
  resumeRequestedMap: Map<string, boolean> = new Map();
  @Input() candidatesFoundStatus: any;
  @Input() fromApply: boolean = false;
  CandiIdHighLight: any
  userId = localStorage.getItem("userId")
  appSettings: AppSettings
  submited: boolean = false;
  showmodel = false
  creditform: UntypedFormGroup;
  userType = localStorage.getItem('userType');
  removetagValueget: any;
  flag: boolean = true;
  filtersApplied: boolean = false
  @Input() data: any;
  @Input() dataPasstoSkillwidgets: any[];
  url = AppSettings.photoUrl;
  Resurl = AppSettings.ServerUrl;
  updateDate: any = [];
  jobfilter: boolean = false;
  GigsumoConstant = GigsumoConstants;
  unit = { duration: '30' };
  @Output() selectedCandidate: EventEmitter<any> = new EventEmitter()
  @Output() removeSeletedUser: EventEmitter<any> = new EventEmitter()
  @ViewChild("myFileInputcandidate") myFileInputcandidate;
  dataget
  checkcount: number = 0;
  checkedList: any = [];
  FormData: any;
  PrimaryResumeFormData: any;

  fileSize = AppSettings.FILE_SIZE;
  clickItemActive: any;
  @Output() suggjob: EventEmitter<any> = new EventEmitter()
  bsModalRef: BsModalRef;
  public envName: any = environment.name;
  @ViewChild("myFileInput") myFileInput;
  @ViewChild("myFileInput1") myFileInput1;
  @ViewChild("myFileInput2") myFileInput2;
  imageChangedEvent: any = "";
  fileUploadName;
  fileToUpload: File;

  photoId: any;
  totaljobcount: any
  infoData: any = {};
  photo: any = null;
  fileshow = undefined;
  object: any;
  download = environment.serverUrl + "/download/"
  seletedChatItem;
  messageData: any;

  messagemodelflag: any
  loadscribtion: Subscription;
  currentTimeDate: string | Date;
  loadDate: any = [];
  API: any;
  tempData: any = [];
  networkflag: boolean = false
  firstName: any;
  lastName: any;
  creditPoints: any;
  primaryEmail: any;
  jobCountry: string;
  targetRates: string;
  jobPayType: string;
  filtersAppliedbtn: boolean = true;
  items: any = {
  };
  clickEventsubscription: Subscription;
  updateCandidateListSubx: Subscription;
  focus: string;


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

  BackBreadCream() {
    this._location.back();
  }

  LandingPage() {
    this.router.navigate(["landingPage"]);
  }
  rtrpayType: any;
  observableFinalised: boolean = false;
  jobId: any;
  jobPostedBehalfOf: any
  ngunsubscribe = new Subject();
  createSubjectSubscription: Subscription;
  termCheckSubscription: Subscription;
  selectedItem: any;
  itemsLoaded: boolean = false;
  constructor(private JobServicecolor: JobService, private cdr: ChangeDetectorRef, private userService: UserService, private compOne: ModelPriceComponent, private apiService: ApiService,
    private commonValues: CommonValues, private _socket: SocketService, private planService: PricePlanService,
    private formBuilder: UntypedFormBuilder, private _location: Location, private searchData: SearchData, private modalService: BsModalService,
    private router: Router, public util: UtilService, private a_route: ActivatedRoute, private candidateService: CandidateService,
    public gigsumoService: GigsumoService) {
    super();
    this.searchData.getCandiHighLight().subscribe(res => {
      if (res != 'candiId') {
        this.CandiIdHighLight = res
      }
    });
    this.userId = localStorage.getItem('userId');

    this.createSubjectSubscription = this.searchData.getCreateSubjectCandidate().subscribe((res) => {
      if (res == true) {
        this.createANewSubject();
      }
    });

    this.updateCandidateListSubx = this.commonValues.getCandidateData().subscribe(candidateObject => {
       this.updateCandidateObject(candidateObject);
    })


  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.passValues && changes.passValues.currentValue != undefined) {
      this.passValues = changes.passValues.currentValue;
      this.onSyncWithJobSubmitSkiller();
    }
    if (changes.Obj && changes.Obj.currentValue) {
      this.selectedItem = changes.Obj.currentValue.candidateId;
    }
    if (changes.candidatesFoundStatus && changes.candidatesFoundStatus.currentValue) {
      this.candidatesFoundStatus = changes.candidatesFoundStatus.currentValue;

    }
  }
  shouldShowRequested(items): boolean {
    return (this.resumeRequestedMap.get(items?.candidateId) || items?.resumeRequested) &&
           (!items?.resumes || items.resumes.length === 0) &&
           items?.createdBy != this.userId &&
           this.userType != 'BENCH_RECRUITER' &&
           this.userType != 'JOB_SEEKER';
  }


  onSyncWithJobSubmitSkiller() {
    this.passValues.forEach((res, index) => {
      if (res.remove) {
        console.log("removed triggered", res)
        this.selectedCandidateData.splice(index, 1);
        this.rtrContent.controls.forEach((ele, rtrindex) => {
          this.updateByCandidateId(ele, res.candidateId, rtrindex);
        });
      }
    });
  }
  activejobcount: number;
  ngOnInit() {
    this.updatejobcount();
    if (this.viewSize === 'extra-small') {
      this.inititializertrform();
      this.getAppliedFilter();
    }
    if(this.userType!="JOB_SEEKER"){
      this.planService.UPDATE_USERDETAILS("ACTIVE_INTERACTIONS")
    }
    this.ProfileComplete = this.commonValues.getUserData();
    this.creditform = this.formBuilder.group({
      point: [null, Validators.compose([Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)])]
    });

    this.userType = localStorage.getItem('userType')
    if (this.data != null) {
      this.flag = false;
    }

    this.passValues.forEach(element => {
      if (element.isSelected != undefined)
        element.isSelected = false;


    });
    this.util.resumeRequested$.subscribe(resumeRequestedMap => {
      this.resumeRequestedMap = new Map(resumeRequestedMap);
    });

  }


  getFilterValue(key : string){
    const arrs : Array<any> =  [...this.filterStatusList];
    if(arrs){
      const find = arrs.find(c=>c.itemId === key);
      return find ? find.value : null;
    }
   }

   getAppliedFilter() {
    this.apiService.create('listvalue/findbyList' , {domain : "JOB_INVITATION_SUPPLIER_ACTIONS,JOB_APPLICATION_BLOCKING_ACTIONS,JOB_APPLICATION_SUPPLIER_ACTIONS"}).subscribe(res=>{
      const arraysToMerge = [
        res.data.JOB_APPLICATION_SUPPLIER_ACTIONS.listItems,
        res.data.JOB_INVITATION_SUPPLIER_ACTIONS.listItems,
        res.data.JOB_APPLICATION_BLOCKING_ACTIONS.listItems //probably this is not required.
      ]
      let mergedArray: any[] = []
      arraysToMerge.forEach(array => {
        if(Array.isArray(array) && array.length > 0) {
          mergedArray = mergedArray.concat(array)
        }
      })
      if(mergedArray.length > 0){
        this.filterStatusList = mergedArray.map(x => {
          return {itemId : x.itemId , value : x.value};
        });
      }
     });
  }
  shouldShowGetResume(items): boolean {
    const resumesPresent = Array.isArray(items.resumes) && items.resumes.length > 0;
    const condition = !this.resumeRequestedMap.get(items.candidateId) &&
                      items.createdBy != this.userId &&
                      !resumesPresent &&
                      !items.resumeRequested;
    return condition;
  }



  async updatejobcount() {
    let planbenefits: any = await this.apiService.lamdaFunctionsget('findUserPlanBenefits/' + localStorage.getItem('userId'));
    this.activejobcount = planbenefits.data && planbenefits.data.activeJobsCount != undefined ? planbenefits.data.activeJobsCount : 0;

  }

  ngOnDestroy(): void {
    if (this.loadscribtion && !this.loadscribtion.closed) {
      this.loadscribtion.unsubscribe();
    }

    if (this.updateCandidateListSubx) {
      this.updateCandidateListSubx.unsubscribe();
    }


    if (this.clickEventsubscription) {
      this.clickEventsubscription.unsubscribe();
    }
  }

  get credit() {
    return this.creditform.controls
  }
  getButtonColor(item: any): string {
    if (this.filtersApplied) {
      if (item.currentStatus == null && item.inviteStatus != 'INITIATED' && item.inviteStatus != 'REJECTED') {
        return '#63cfbe'; // Set the color for 'Available'
      } else if (item.currentStatus == null && item.inviteStatus == 'INITIATED') {
        return '#63cfbe'; // Set the color for 'Invited'
      } else if (item.status == 'DRAFTED') {
        return '#ffb606'; // Set the color for 'Draft'
      } else if (item.currentStatus == null && item.inviteStatus == 'REJECTED') {
        return '#fe4052'; // Set the color for 'Rejected'
      }
    }
    return '#63cfbe';
  }

  completeSubscription(): void {
    this.ngunsubscribe.complete()
  }

  nextSubscription(): void {
    this.ngunsubscribe.next(true)
  }

  createANewSubject(): void {
    this.ngunsubscribe = new Subject();
  }

  isFormInitialised: boolean = false
  targetrate: any
  RtrpayType: any
  country: any
  inititializertrform() {
    this.rtrformgrp = this.formBuilder.group({
      rtrcontent: this.formBuilder.array([]),
      termsandcondition: [true, Validators.requiredTrue]
    });

    if (this.passValues && this.passValues.length > 0) {
      this.passValues.forEach((element: any, index: number) => {
        element.candidateName = element.firstName + " " + element.lastName
        this.rtrContent.push(this.pushRtrFormFields(element, this.jobData));
        // this.updateResumeAtached(element , index);
      });
    }

  }

  updateResumeAtached(element: any, index: number) {


    if ((element.resumes === null || element.resumes === undefined) || (element.resumes != null && element.resumes.length === 0)) {
      this.rtrContent.at(index).get('resumeAttached').setValidators([Validators.required]);
      this.rtrContent.at(index).get('resumeAttached').updateValueAndValidity();
    }
  }

  updateByCandidateId(element: any, candidateId, index: number) {
    if (element.get('candidateId').value === candidateId) {
      this.rtrContent.at(index).get('resumeAttached').clearValidators();
      this.rtrContent.at(index).get('resumeAttached').updateValueAndValidity();
    }
  }

  termAndCondition: boolean = false;
  pushRtrFormFields(candidateData: candidateModel, jobData: JobModel) {
    return this.formBuilder.group({
      candidateName: [candidateData.candidateName, Validators.required],
      candidateId: [candidateData.candidateId, Validators.required],
      targetrate: [jobData.targetRateTo, Validators.compose([Validators.required, CustomValidator.validDecimal(), CustomValidator.checkWhiteSpace()])],
      RtrpayType: [jobData.payType, Validators.required],
      resumeAttached: [''],
      customError: [false],
      country: [jobData.country],
    });
  }



  get rtrFormControls() {
    return this.rtrformgrp.controls
  }

  widgetReload(data) {
    // this.clickItemActive=data;
    this.suggjob.emit(data);
  }

  change() { }
  posted: Date;
  statusupdate: Date;
  curr: any
  async candidateStatus(event, values) {

    if (event == 'ACTIVE') {
      // let isJobOrCandidayeExpired: boolean = await this.planService.UPDATE_USERDETAILS("JOB_CANDIDATE_POSTINGS");
      const userData = await this.planService.UPDATE_USERDETAILS("JOB_CANDIDATE_POSTINGS");
      let availablePoints = null;
      let actualPoints = null;
      let utilizedPoints = null;
      let promotional = null;
      if (userData.userDetail) {
        userData.userDetail.userPlanAndBenefits.benefitsUsages.forEach(ele => {
          if (ele.benefitKey == 'JOB_CANDIDATE_POSTINGS') {
            availablePoints = ele.available
            actualPoints = ele.actual
            utilizedPoints = ele.utilized
            promotional = ele.utilized
          }
        });
      }
      if (userData.isExpired) {
        this.planService.expiredPopup("JOB_CANDIDATE_POSTINGS", "PAY", null, null, null, availablePoints, actualPoints, utilizedPoints, promotional);
        // this.planService.expiredPopup("JOB_CANDIDATE_POSTINGS");
        return;
      }
      else {
        this.afterPlanValidationstatuschange(event, values);
      }
    } else {
      this.afterPlanValidationstatuschange(event, values);
    }
  }

  async downloadResume(data, userId, FileId) {

    const { candidateId, createdBy, connectionStatus,
      user, resumeDownloaded, ...rest } = data;


    if (!resumeDownloaded && createdBy != this.userId) {

      const userData = await this.planService.UPDATE_USERDETAILS("ACTIVE_INTERACTIONS");
      let availablePoints = null;
      let actualPoints = null;
      let utilizedPoints = null;
      let promotional = null;

      if (userData.userDetail) {

        userData.userDetail.userPlanAndBenefits.benefitsUsages.forEach(ele => {
          if (ele.benefitKey == 'ACTIVE_INTERACTIONS') {
            availablePoints = ele.available
            actualPoints = ele.actual
            utilizedPoints = ele.utilized
            promotional = ele.promotional
          }
        });
      }
      if (userData.isExpired) {
        this.planService.expiredPopup("ACTIVE_INTERACTIONS", "PAY", null, null, null, availablePoints, actualPoints, utilizedPoints, promotional);
        return;
      }
      else {
        //if (connectionStatus === "CONNECTED") {
          this.afterPlanValidationDownloadResume(candidateId, userId, createdBy, FileId);
       // }
       // else if (connectionStatus === "NOT_CONNECTED") {
          //this.afterPlanValidationDownloadResume(candidateId, userId, createdBy, FileId);
          // to be used later
          // this.openConnectionTemplate({user:user , rest , connectionStatus : connectionStatus} , this.connectionTemplate)
        //}
      }
    }
    else if (resumeDownloaded || createdBy === this.userId) {
      this.afterPlanValidationDownloadResume(candidateId, userId, createdBy, FileId);
    }
  }

  afterPlanValidationDownloadResume(candidateId, userId, createdBy, FileId) {
    let atag = document.createElement('a');
    atag.href = `${this.Resurl}candidates/resumeDownload/${candidateId}/${userId}/${createdBy}/${FileId}`;
    atag.click();
  }



  userData = {
    userId: localStorage.getItem('userId'),
    userType: localStorage.getItem('userType')
  }
  afterPlanValidationstatuschange(event, values) {

    try {
      this.util.stopLoader();
      values.status = event;
      this.candidateSubmit = true
      this.FormData = new FormData();
      this.FormData.append("resume", this.resumeupload);
      this.resumeupload = "";
      this.FormData = new FormData();
      values.candidateReferenceId=values.candidateId;
      this.FormData.append("candidate", new Blob([JSON.stringify(values)], { type: "application/json" }));
      this.apiService.updatePut("candidates/updateCandidate", this.FormData).subscribe(res => {
        if (res) {

          this.candidateReload.emit(event === 'ACTIVE' ? 'updateReload' : "reload");
          this.util.stopLoader();
          Swal.fire({
            icon: "success",
            title: "Candidate Update Successfully",
            showDenyButton: false,
            showConfirmButton: false,
            timer: 2000,
          })

        }
      });

    } catch (error) {
      this.util.stopLoader();
    }
  }

  downgradeCandidate(item) {
    let data: any = {}
    data = item;
    data.isFeatured = false;
    //data.points = 0;
    data.consumptionType = null;
    this.FormData = new FormData();
    this.FormData.append("resume", item.resume);
    data.candidateReferenceId=data.candidateId;
    this.FormData.append("candidate", new Blob([JSON.stringify(data)], { type: "application/json" }));
    this.apiService.updatePut("candidates/updateCandidate", this.FormData).subscribe((res) => {
      this.util.stopLoader();
      if (res.code == '00000') {
        this.searchData.setfilterReload("reload")
        Swal.fire({
          icon: "success",
          title: "Downgraded Successfully",
          showDenyButton: false,
          showConfirmButton: false,
          timer: 2000,
        });
        this.candidateReload.emit('reload')
      }
    }, err => {
      this.util.stopLoader();
    });
  }

  zipCodeValidaiton(x: number): boolean {
    if (String(x).length > 10) {
      return false;
    }
    return true;
  }

  enableCandidateedit(event) {
    if (event.target.checked == true) {
      this.object.status = 'ACTIVE'
    } else if (event.target.checked == false) {
      this.object.status = 'INACTIVE'
    }
    this.FormData = new FormData();
  }

  requestResumebyUser(value: any, index) {
    var data: any = {}
    data.candidateId = value.candidateId
    data.createdBy = this.userId
    data.resumeRequestLogs = [{ "jobId": null, "requestedBy": localStorage.getItem('userId') }]
    this.util.startLoader()
    this.apiService.updatePut('candidates/updateResumeRequests', data).subscribe(res => {
      if (res.code == '00000') {
        this.util.stopLoader()
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Resume request sent",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          value.resumeRequested = true;

          if (this.passValues.length > 1) {
            this.passValues.splice(index, 1, value)
          }
        })

      }
    }, err => {
      this.util.stopLoader();
    });
  }

  onDownload() {
    const file: File = this.tempFile;
    this.downloadFile(new Blob([file]), file.name);
  }

  downloadFile(blob: Blob, fileName: string): void {
    const link = document.createElement('a');
    // create a blobURI pointing to our Blob
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    // some browser needs the anchor to be in the doc
    document.body.append(link);
    link.click();
    link.remove();
    // in case the Blob uses a lot of memory
    setTimeout(() => URL.revokeObjectURL(link.href), 0);
  }

  duplicateresume: boolean = false
  requestResume(values: any, index, connectionTemplate: TemplateRef<any>, jobsupplytemplate: TemplateRef<any>) {
    this.duplicateresume = true;
    this.passCandidateData = values;
    this.focus = 'resume';
    //if (values.isFeatured) {
      this.requestresumesent(values, index, jobsupplytemplate);
    //} else if (!values.isFeatured) {
      //if (values.connectionStatus === 'CONNECTED') {
        //this.requestresumesent(values, index, jobsupplytemplate);
      //} else if (values.connectionStatus !== 'CONNECTED') {
        //this.requestresumesent(values, index, jobsupplytemplate);
        // to be used later
        // this.openConnectionTemplate(values, connectionTemplate);
        //this.duplicateresume = false;

     // }
   // }
  }

  async requestresumesent(values, index, jobsupplytemplate) {
    if (this.planService.ACTIVE_INTERACTION === 0) {
      const userData = await this.planService.UPDATE_USERDETAILS("ACTIVE_INTERACTIONS");
      let availablePoints = null;
      let actualPoints = null;
      let utilizedPoints = null;
      let promotional = null;
      userData.userDetail.userPlanAndBenefits.benefitsUsages.forEach(ele => {
        if (ele.benefitKey == 'ACTIVE_INTERACTIONS') {
          availablePoints = ele.available
          actualPoints = ele.actual
          utilizedPoints = ele.utilized
          promotional = ele.promotional
        }
      })
      this.planService.expiredPopup("ACTIVE_INTERACTIONS", "PAY", null, null, null, availablePoints, actualPoints, utilizedPoints, promotional);
      // this.planService.expiredPopup("ACTIVE_INTERACTIONS");
      return;
    }
    this.apiService.query("user/profile/complete/" + localStorage.getItem('userId')).subscribe(completerres => {
      this.totaljobcount = completerres.jobsCount;
      this.util.startLoader()
      values.userId = localStorage.getItem('userId');
      values.candidatefilter = true;
      values.userType = values.user.userType;
      values.candidateId = values.candidateId;
      values.getResume = true;

      if (this.totaljobcount == 0) {
        this.requestResumebyUser(values, index);
        this.duplicateresume = false;
      } else if ((this.totaljobcount > 0)) {
        const config: ModalOptions = { class: 'modal-lg', backdrop: 'static', keyboard: false };
        this.duplicateresume = false;
        this.candidateSupplyRef = this.modalService.show(jobsupplytemplate, config);
      }

    }, err => {
      this.util.stopLoader();
    });

  }










  figureLength: number = 0;
  payType: null;
  typeTargetValue: null;
  targetRate: any;
  countryChosen: null;
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

  updatedDate: string;
  availablepoints: any;
  async upgradeCandidate(item) {
    this.profileDetailResponse = await this.userService.userProfileDetails(this.userData);
    let currenttimezonedate = new Date(this.profileDetailResponse.currentTimeByTimezone);
    currenttimezonedate.setHours(0, 0, 0, 0);
    this.updatedDate = String(item.featuredUpdatedOn);
    let currentDates = this.util.dateFormatestring(this.updatedDate);
    this.availablepoints = this.profileDetailResponse.userCredits;
    if (item.isFeatured == undefined || currenttimezonedate > currentDates && item.isFeatured == false) {
      this.planService.expiredPopup("UPGRADE_CANDIDATES", "UPGRADE", item, currenttimezonedate, currentDates, this.availablepoints, null, null, null);
    } else if (item.isFeatured == false) {
      this.compOne.upgradejobandcandidatedetails(item, 'Upgrade Candidate', currenttimezonedate, currentDates);
    }
  }
  removecheckbox() {
    this.removeSeletedUser.emit(this.checkedList);
  }
  // Check values get
  selectedCandidateData: Array<any> = [];

  async selectCheckbox(event, candidateId: string, index?: any) {

    this.getCheckedItemList();
    const foundItems: Array<any> = this.passValues.filter(item => item.isSelected === true);
    if (event.target.checked) {
      if (this.userType != GigsumoConstants.JOB_SEEKER && foundItems.length < this.planService.ACTIVE_INTERACTION) {
        this.passValues.forEach((ele, index) => {
          if (ele.candidateId === candidateId) {
            ele.isSelected = true;
            this.updateResumeAtached(ele, index)
          }
          if (ele.isSelected) {
            this.selectedCandidateData.push(ele);
          }
        });
        var mySet = new Set(this.selectedCandidateData);
        this.selectedCandidateData = [...mySet];
        this.selectedCandidate.emit({ value: this.selectedCandidateData, formData: this.rtrContent, terms: this.termAndCondition, resumes: this.applyResumeUploadData });
      } else if (this.userType === GigsumoConstants.JOB_SEEKER) {
        this.passValues.forEach(ele => {
          if (ele.candidateId === candidateId) {
            ele.isSelected = true;
            this.updateResumeAtached(ele, index)
          }
          if (ele.isSelected) {
            this.selectedCandidateData.push(ele);
          }
        });
        var mySet = new Set(this.selectedCandidateData);
        this.selectedCandidateData = [...mySet]
        this.selectedCandidate.emit({ value: this.selectedCandidateData, formData: this.rtrContent, terms: this.termAndCondition, resumes: this.applyResumeUploadData });
      } else {
        const userData = await this.planService.UPDATE_USERDETAILS("ACTIVE_INTERACTIONS");
        let availablePoints = null;
        let actualPoints = null;
        let utilizedPoints = null;
        let promotional = null;
        userData.userDetail.userPlanAndBenefits.benefitsUsages.forEach(ele => {
          if (ele.benefitKey == 'ACTIVE_INTERACTIONS') {
            availablePoints = ele.available
            actualPoints = ele.actual
            utilizedPoints = ele.utilized
            promotional = ele.promotional
          }
        })
        this.planService.expiredPopup("ACTIVE_INTERACTIONS", "PAY", null, null, null, availablePoints, actualPoints, utilizedPoints, promotional);
        // this.planService.expiredPopup("ACTIVE_INTERACTIONS");
      }

    } else if (!event.target.checked) {
      if (this.selectedCandidateData.length > 0) {
        this.selectedCandidateData.forEach((element: any, i: number) => {
          if (element.candidateId === candidateId) {

            if (this.applyResumeUploadData.length > 0) {
              this.applyResumeUploadData.forEach((applyRes, index) => {
                if (applyRes.candidateId === candidateId) {
                  this.applyResumeUploadData.splice(index, 1);
                }
              });
            }

            this.rtrContent.controls.forEach((ele, rtrindex) => {
              this.updateByCandidateId(ele, candidateId, rtrindex);
            });

            this.selectedCandidateData.splice(i, 1);
            var mySet = new Set(this.selectedCandidateData);
            this.selectedCandidateData = [...mySet]
            this.selectedCandidate.emit({ value: this.selectedCandidateData, formData: this.rtrContent, terms: this.termAndCondition, resumes: this.applyResumeUploadData });

          }
        });
      }

      // this.rtrContent.at(index).get('resumeAttached').setValue(true);
      this.rtrContent.at(index).get('customError').setValue(true);
      // this.rtrContent.at(index).get('resumeAttached').updateValueAndValidity();
    }


  }

  openModalWithComponent() {

    const initialState: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      size: "open"
    };
    this.bsModalRef = this.modalService.show(CreditModelComponent, initialState);


  }


  // Get List of Checked Items
  getCheckedItemList() {
    this.checkedList = [];
    for (var i = 0; i < this.passValues.length; i++) {
      if (this.passValues[i].isSelected) {
        this.checkedList.push(this.passValues[i]);
      }
    }

    this.checkedList = this.checkedList;
    // this.selectedCandidate.emit({value : this.checkedList});
  }
  getInitials(fullname: string): string {
    return this.JobServicecolor.getInitials(fullname);
  }
  getColor(fullname: string): string {
    return this.JobServicecolor.getColor(fullname);
  }

  // for first and last name
  getInitialName(firstname: string, lastname: string): string {
    return this.JobServicecolor.getInitialsparam(firstname, lastname);
  }
  // for first and last name
  getColorName(firstname: string, lastname: string): string {
    return this.JobServicecolor.getColorparam(firstname, lastname);
  }

  checkConnectionStatus(values): Observable<any> {
    const apiURL = 'user/checkConnectionStatus';
    const params = new HttpParams()
      .set('userId', this.userId)
      .set('connnectorId', values.createdBy);

    const urlWithParams = `${apiURL}?${params.toString()}`;
    return this.apiService.query(urlWithParams);
  }
  private scrollToFirstInvalidControl(id: string) {

    let form = document.getElementById(id);
    let firstInvalidControl = form.getElementsByClassName('ng-invalid')[0];
    if (firstInvalidControl != undefined) {
      firstInvalidControl.scrollIntoView();
      (firstInvalidControl as HTMLElement).focus();
    }
  }
  get rtrContent(): UntypedFormArray | null {
    return this.rtrformgrp ? this.rtrformgrp.get('rtrcontent') as UntypedFormArray : null;
  }

  rtrlength(): number {
    return (this.rtrformgrp.get('rtrcontent') as UntypedFormArray).controls.length;
  }

  terms(event) {
    this.termAndCondition = event;
    this.selectedCandidate.emit({ value: this.selectedCandidateData, formData: this.rtrContent, terms: this.termAndCondition, resumes: this.applyResumeUploadData });
  }

  isApiCallInProgress: boolean = false

  candidateIdrtr;

  // duplicateinvite: boolean = false
  apply(values: any, connectionTemplate: TemplateRef<any>, jobsupplytemplate: TemplateRef<any>) {

    this.gigsumoService.candidateInviteBtnClicked = true
    this.passCandidateData = values;
    this.focus = 'candidate';
   // if (values.isFeatured) {
     // this.proceedToApply(values, jobsupplytemplate);
   // } else if (!values.isFeatured) {
      //if (values.connectionStatus === 'CONNECTED') {
        this.proceedToApply(values, jobsupplytemplate);
      //} else if (values.connectionStatus !== 'CONNECTED') {
        //this.proceedToApply(values, jobsupplytemplate);
        // to be used later
        // this.openConnectionTemplate(values, connectionTemplate);

      //}
    //}
  }

  async proceedToApply(values, jobsupplytemplate) {
    if (this.planService.ACTIVE_INTERACTION === 0) {
      const userData = await this.planService.UPDATE_USERDETAILS("ACTIVE_INTERACTIONS");
      let availablePoints = null;
      let actualPoints = null;
      let utilizedPoints = null;
      let promotional = null;
      userData.userDetail.userPlanAndBenefits.benefitsUsages.forEach(ele => {
        if (ele.benefitKey == 'ACTIVE_INTERACTIONS') {
          availablePoints = ele.available
          actualPoints = ele.actual
          utilizedPoints = ele.utilized
          promotional = ele.promotional
        }
      })
      this.planService.expiredPopup("ACTIVE_INTERACTIONS", "PAY", null, null, null, availablePoints, actualPoints, utilizedPoints, promotional);

      this.gigsumoService.candidateInviteBtnClicked = false

      return;
    }
    values.userId = localStorage.getItem('userId');
    values.candidatefilter = true;
    values.getResume = false;
    values.userType = values.user.userType;
    const config: ModalOptions = { class: 'modal-lg', backdrop: 'static', keyboard: false };

    this.candidateSupplyRef = this.modalService.show(jobsupplytemplate, config);

    this.gigsumoService.candidateInviteBtnClicked = false;
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    // setTimeout(() => {
    //   if(document.getElementById('zerocandidates') != null){
    //     document.getElementById('zerocandidates').style.visibility = "visible";
    //   }

    //   if(document.getElementById('fetching')!=null){
    //     document.getElementById('fetching').style.visibility = "hidden"
    //   }
    // },5000)
  }


  like(values: any) {
    if(values.createdBy!=localStorage.getItem('userId')){
      let datas: any = {};
      if (values.isLiked == false || values.isLiked == null) {
        datas.likeStatus = "LIKE"
      } else if (values.isLiked == true) {
        datas.likeStatus = "UNLIKE"
      }

      datas.candidateId = values.candidateId
      datas.userId = localStorage.getItem('userId');
      this.util.startLoader();
      this.apiService.updatePut("candidates/updateCandidateLiked", datas).subscribe((res) => {
        if (res.code == '00000') {
          this.util.stopLoader();
          this.passValues.forEach(ele => {
            if (res.data.candidateData.candidateId == ele.candidateId) {
              ele.isLiked = res.data.candidateData.isLiked;
              ele.likesCount = res.data.candidateData.likesCount;
            }
          })

        }

      }, err => {
        this.util.stopLoader();
      });
    }else{
      this.goTo(values, 'Clike-like')
    }
  }


  submissionFilterRoute(items) {
    this.candidateListing.emit(`SUBMISSION_ROUTE|${items.candidateId}`)
  }

  redirect_invite(val, path) {
    if (path == 'jobsApplied') {
      let data = JSON.parse(localStorage.getItem('candidateForm'));
      val.seletedFilter = data.submissionFilters;
      this.router.navigate(['newcandidates/jobsApplied'], { queryParams: val })
    }
  }

  goTo(values: any, param) {
    this.selectedItem = values.candidateId;
    if (this.updateCandidateModule) {

      if (values.createdBy == this.userId) {
        if (param == 'jobsApplied') {
          this.updateCandidateModule.jobDetails.apply(this.updateCandidateModule.source, [param, { value: values, for: "TAB_ROUTE" }])
        } else if (param == 'views') {
          this.updateCandidateModule.jobDetails.apply(this.updateCandidateModule.source, [param, { value: values, for: "TAB_ROUTE" }])
        }
        else if (param == 'Clike-like') {
          this.updateCandidateModule.jobDetails.apply(this.updateCandidateModule.source, [param, { value: values, for: "TAB_ROUTE" }])
        } else if (param == 'cInvited' && values.interestShownCount > 0) {
          this.updateCandidateModule.jobDetails.apply(this.updateCandidateModule.source, [param, { value: values, for: "TAB_ROUTE" }])
        }
      }
      else if (values.createdBy != this.userId) {
        if (param == 'jobsApplied') {
          this.updateCandidateModule.jobDetails.apply(this.updateCandidateModule.source, [param, { value: values, for: "TAB_ROUTE" }])
        } else if (param == 'views' && values.viewedByCount > 0) {
          this.updateCandidateModule.jobDetails.apply(this.updateCandidateModule.source, ["profileSummary", { value: values, for: "TAB_ROUTE" }])
        }
        else if (param == 'cInvited' && values.interestShownCount > 0) {
          this.updateCandidateModule.jobDetails.apply(this.updateCandidateModule.source, [param, { value: values, for: "TAB_ROUTE" }])
        }
      }

    }

  }

  async open(values: any) {
    if (!this.filtersApplied && values.status != 'BLOCKED' && !values.isViewed && values.createdBy != this.userId) {

      // const userData = await this.planService.UPDATE_USERDETAILS("RESUME_VIEWS");

      // let availablePoints = null;
      // let actualPoints = null;
      // let utilizedPoints = null;
      // userData.userDetail.userPlanAndBenefits.benefitsUsages.forEach(ele => {
      //   if (ele.benefitKey == 'RESUME_VIEWS') {
      //     availablePoints = ele.available
      //     actualPoints = ele.actual
      //     utilizedPoints = ele.utilized
      //   }
      // })

      // if (userData.isExpired) {
      //   this.planService.expiredPopup("RESUME_VIEWS", "PAY", null, null, null, availablePoints, actualPoints, utilizedPoints);

      //   return;
      // }
      // else {
      this.updateCandidateView(values);
      //}
    }
    else {
      this.selectedItem = values.candidateId;
      this.updateCandidateModule.jobDetails.apply(this.updateCandidateModule.source, [values, { value: null, for: "CANDIDATE_DETAIL" }]);
    }
  }

  updateCandidateView(values) {
    this.util.startLoader();
    this.candidateService.updateCandidateViewed(values).subscribe((res) => {
      this.util.stopLoader();
      if (res.code === "00000") {
        values.isViewed = true;
        this.selectedItem = values.candidateId;
        this.updateCandidateModule.jobDetails.apply(this.updateCandidateModule.source, [values, { value: null, for: "CANDIDATE_DETAIL" }]);
      }
    }, err => {
      this.util.stopLoader();
    });
  }


  backdropConfig = {
    backdrop: true,
    ignoreBackdropClick: true,
    keyboard: false,
    // scroll
  };
  candidateJobTitleList: any = [];
  modalRef: BsModalRef;
  otherStatesList: any = [];
  candidatePostForm: UntypedFormGroup;
  get candidateControls() {
    return this.candidatePostForm.controls
  }
  currentOrganizationDetail: WorkExperience;
  async edit(item, postTemplate: TemplateRef<any>) {

    try {
      this.disable_for_draft = false;
      this.candidateSubmit = false;
      this.updateDate = [];
      this.userType = localStorage.getItem('userType')
      const data: any = {
        userId: localStorage.getItem('userId'),
        userType: localStorage.getItem('userType')
      };

      this.util.startLoader();

      const profileDetails = await this.apiService.create('user/profileDetails', data).toPromise();

      this.util.stopLoader();

      const currentOrganization: Array<WorkExperience> = profileDetails.data.exeperienceList;
      if (currentOrganization && currentOrganization.length > 0) {
        currentOrganization.forEach(workExp => {
          if (workExp.currentOrganization) {
            this.currentOrganizationDetail = workExp;
          }
        });
      }

      this.currentTimeDate = profileDetails.data.currentTimeByTimezone;
      this.firstName = profileDetails.data.userData.firstName;
      this.lastName = profileDetails.data.userData.lastName;
      this.primaryEmail = profileDetails.data.userData.email;

      this.object = item;
      this.fileshow = undefined;

      await this.inititateCandidateForm();

      this.modalRef = this.modalService.show(postTemplate, this.backdropConfig);

      if (item.primarySkills && item.primarySkills.length > 0) {
        this.primarySkillsSelected = [...item.primarySkills];
      }

      if (item.secondarySkills && item.secondarySkills.length > 0) {
        this.secondarySkillsSelected = [...item.secondarySkills];
      }

      if (item.otherPreferedStates && item.otherPreferedStates.length > 0) {
        this.otherSelectedStates = [...item.otherPreferedStates];
      }

      if (item.targetRate == 0) {
        item.targetRate = '';
      }



      item.totalExperience = item.totalExperience === 0 ? null : item.totalExperience;
      item.email=item.candidateEmailId;
      this.onChangeCountry(item.country, 'candidates');
      this.candidatePostForm.patchValue(item);


      if (this.userType == 'JOB_SEEKER' || this.userType == 'student') {
        this.candidatePostForm.patchValue({
          'firstName': this.firstName,
          'lastName': this.lastName,
          'email': this.primaryEmail
        });

        this.candidatePostForm.get('email').disable();
        this.candidatePostForm.get('firstName').disable();
        this.candidatePostForm.get('lastName').disable();
      }
    } catch (error) {

      this.util.stopLoader();
    }
  }

  submitResume() {

    if (this.applyResumeUploadData.length > 0) {
      let data = this.applyResumeUploadData.find(item => item.candidateId == this.selectedResumeAttached.candidateId);
      if (data != undefined && this.selectedResumeAttached.candidateId == data.candidateId) {
        this.selectedCandidate.emit({ value: this.selectedCandidateData, formData: this.rtrContent, terms: this.termAndCondition, resumes: this.applyResumeUploadData });
        this.rtrContent.controls.forEach((ele, index) => {
          if (ele.get('candidateId').value === this.selectedResumeAttached.candidateId) {
            this.rtrContent.at(index).get('resumeAttached').clearValidators();
            this.rtrContent.at(index).get('resumeAttached').updateValueAndValidity();
          }
        });
        this.close(false);
      } else if (data == undefined) {
        Swal.fire({
          icon: "info",
          title: "Please Upload Resume...",
          showDenyButton: false,
          timer: 3000,
        })
      }

    } else {
      Swal.fire({
        icon: "info",
        title: "Please Upload Resume...",
        showDenyButton: false,
        timer: 3000,
      })
    }
  }


  getResumeError(index: number) {
    return this.rtrContent.at(index).get('resumeAttached').errors;
  }

  updatePrimaryresumeAPI(file: File) {
    // this.selectedResumeAttached.primaryResume=true;
    this.PrimaryResumeFormData = new FormData();
    this.PrimaryResumeFormData.append("file", file);
    this.PrimaryResumeFormData.append("candidate", new Blob([JSON.stringify(this.selectedResumeAttached)], { type: "application/json" }));
    this.util.startLoader()
    this.API.updatePut('candidates/updateResumeRequestStatus', this.PrimaryResumeFormData).subscribe(res => {
      this.modalRef.hide();
      this.util.stopLoader();
      if (res.code == '00000') {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Updated Successfully",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    })


  }

  selectedResumeAttached: any = [];
  openJobApplyResumeUpload(template: TemplateRef<any>, index: number) {
    this.selectedResumeAttached = this.passValues[index];
    this.modalRef = this.modalService.show(template, {
      animated: true,
      backdrop: "static",
      keyboard: false
    });
  }

  async inititateCandidateForm() {
    try {
      this.getCountries();
      this.generateYears();
      await this.getListValues('CANDIDATE');
      this.searchData.setCommonVariables(this.commonVariables);
      this.candidatePostForm = new AppSettings().getEditCandidateGroup();
      if (this.userType === 'student' || this.userType === 'JOB_SEEKER') {
        this.candidatePostForm.get('candidateEmailId').clearValidators();
        this.candidatePostForm.get('candidateEmailId').updateValueAndValidity();
      }
    } catch (error) {
    }
  }

  candidateSubmit: boolean = false



  primarySkillsSelected = [];
  secondarySkillsSelected = [];
  stateListCA: any = []
  stateListIN: any = []
  stateListAU: any = []
  countryList: any = [];
  submit: boolean = false
  getCountries() {
    this.countryList = [];
    this.util.startLoader();
    this.apiService.query("country/getAllCountries").subscribe((res) => {
      // this.util.stopLoader();
      res.forEach((ele) => {
        this.countryList.push(ele);
      });
    }, err => {
      this.util.stopLoader();
    });
  }

  checkspace(event: any): boolean {
    return super.validSpace(event);
  }

  years: any = []
  generateYears() {
    // var max = new Date().getFullYear();
    // var min = max - 80;
    for (var i = 0; i <= 20; i++) {
      this.years.push(i);
    }
  }

  organizationList: any = []
  primarySkillsList: any = []
  secondarySkillsList: any = []
  skillsList: any = []
  payTypeList: any = []
  clientTypeList: any = []
  clientNameList: any = []
  clientNameList1: any = []
  durationTypeList: any = []
  usStatesList = []
  jobClassificationList: any = []
  commonVariables: any = {};
  totalExperienceList = []
  periodList = []

  recruiterTitleList: any = []
  engagementTypeList = []
  workAuthorizationList: any = []
  jobPostForm: UntypedFormGroup;
  currentTime: any;
  maxDate: any
  getListValues(param) {
    this.clientTypeList = []
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
      var data: any = { "domain": "ENGAGEMENT_TYPE,CLIENT_TYPE,PAY_TYPE,DURATION,PRIMARY_SKILLS,WORK_AUTHORIZATION,CANDIDATE_AVAILABLITY,TOTAL_EXPERIENCE,SECONDARY_SKILLS,GIGSUMO_SKILLS_LIST,GIGSUMO_JOB_TITLE,GIGSUMO_RECRUITERS_TITLE_LIST,EFFECTIVE_FOR" }
      data.userId = localStorage.getItem("userId");
      this.apiService.create('listvalue/findbyList', data).subscribe(res => {
        if (res.code == '00000') {
          this.currentTime = new Date(res.data.currentTime);
          this.maxDate = new Date(this.currentTime);
          if (param == 'CANDIDATE') {
            this.usStatesList = []
            this.apiService
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
            this.clientTypeList.push(ele.item)
            var mySet = new Set(this.clientTypeList);
            this.clientTypeList = [...mySet]
          })
          res.data.PAY_TYPE.listItems.forEach(ele => {
            this.payTypeList.push(ele.item)
            var mySet = new Set(this.payTypeList);
            this.payTypeList = [...mySet]
          })
          res.data.GIGSUMO_SKILLS_LIST.listItems.forEach(ele => {
            this.skillsList.push(ele.item)
            var mySet = new Set(this.skillsList);
            this.skillsList = [...mySet]
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

          res.data.PRIMARY_SKILLS.listItems.forEach(ele => {
            if (ele.item) {
              this.primarySkillsList.push(ele.item)
              var mySet = new Set(this.primarySkillsList);
              this.primarySkillsList = [...mySet]
            }
          })
          res.data.SECONDARY_SKILLS.listItems.forEach(ele => {
            if (ele.item) {
              this.secondarySkillsList.push(ele.item)
              var mySet = new Set(this.secondarySkillsList);
              this.secondarySkillsList = [...mySet]
            }
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
            var mySet = new Set(this.recruiterTitleList);
            this.recruiterTitleList = [...mySet]
          })
        }
      })
    }
  }

  workflag: boolean = false;
  onChangeCountry(event, param) {

    this.countryChosen = event;
    if (this.candidatePostForm == undefined) {
      this.inititateCandidateForm();
      setTimeout(() => {
        this.candidatePostForm.get('workAuthorization').enable();
      }, 1500);

    }

    if (param == 'candidates') {
      this.candidatePostForm.get('city').patchValue(null)
      this.candidatePostForm.get('state').patchValue(null)
      this.candidatePostForm.get('zipCode').patchValue(null)
    }

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
      this.apiService.query('listvalue/find?domain=WORK_AUTHORIZATION_US').subscribe(res => {
        if (res.code == '00000') {
          this.workAuthorizationList = [];
          this.util.stopLoader()
          res.data.listValues[0].listItems.forEach(ele => {
            this.workAuthorizationList.push(ele.item)
            var mySet = new Set(this.workAuthorizationList);
            this.workAuthorizationList = [...mySet]
          });

          this.apiService
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
      this.apiService.query('listvalue/find?domain=WORK_AUTHORIZATION_AU').subscribe(res => {
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
            this.apiService
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
      this.apiService.query('listvalue/find?domain=WORK_AUTHORIZATION_IN').subscribe(res => {
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

            this.apiService
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
      this.apiService.query('listvalue/find?domain=WORK_AUTHORIZATION_CA').subscribe(res => {
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
            this.apiService
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
          }, 1000);

        }

      }

    }
    if (this.typeTargetValue != null) {
      this.onTargetRateTyped(this.typeTargetValue, param)
    }

  }


  selectedCountries: boolean = false
  onTargetRateTyped(value, param) {
    this.typeTargetValue = value
    // if (this.selectedCountries == true) {
    //   if (param == 'jobs') {
    //     if (value.length > this.figureLength) {
    //       this.jobPostForm.get('targetRate').setErrors({ notAcceptedValue: true })
    //     } else {
    //       this.jobPostForm.get('targetRate').setErrors({ notAcceptedValue: null })
    //       this.jobPostForm.get('targetRate').updateValueAndValidity({ emitEvent: false })
    //     }
    //   } else if (param == 'candidates') {
    //     if (value.length > this.figureLength && param == 'candidates') {
    //       this.candidatePostForm.get('targetRate').setErrors({ notAcceptedValue: true })
    //     } else {
    //       this.candidatePostForm.get('targetRate').setErrors({ notAcceptedValue: null })
    //       this.candidatePostForm.get('targetRate').updateValueAndValidity({ emitEvent: false })
    //     }
    //   }
    // } else {
    //   if (param == 'jobs') {
    //     this.jobPostForm.get('targetRate').setErrors({ notAcceptedValue: null })
    //     this.jobPostForm.get('targetRate').updateValueAndValidity({ emitEvent: false })
    //   } else if (param == 'candidates') {
    //     this.candidatePostForm.get('targetRate').setErrors({ notAcceptedValue: null })
    //     this.candidatePostForm.get('targetRate').updateValueAndValidity({ emitEvent: false })
    //   }
    // }
  }


  uploadPhotoHere() {
    this.myFileInput2.nativeElement.click();
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
      this.myFileInput2.nativeElement.value;

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
      this.myFileInput2.nativeElement.value = "";
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


  closePhoto2() {
    this.modalRef2.hide();
    this.photo = null;
    this.fileshow = undefined;
    this.myFileInput2.nativeElement.value = null;
    this.photoId = null;

  }
  img: any = {};
  img4: any = {};

  imageLoaded2() {
    this.util.startLoader();
    const formData: FormData = new FormData();
    formData.append("file", this.fileToUpload, this.fileUploadName);
    // setTimeout(() => {
    this.apiService.create("upload/image", formData).subscribe((res) => {
      this.util.stopLoader();
      if (res) {
        this.photoId = res.fileId;
        this.modalRef2.hide();

      }
    }, err => {
      this.util.stopLoader();

    });
  }
  resumeupload;

  fileDragdrop: any;

  prepareFilesList(files: File) {
    if (files[0].size > this.fileSize) {
      Swal.fire("", `${this.IMAGE_ERROR}`, "info");
      $("#fileDropRef")[0].value = '';
      return true;
    }
    this.fileDragdrop = files[0];
    this.resumeupload.push(files[0]);

    var fromate = ['application/pdf', 'application/docx', 'application/doc', 'text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword']

    if (fromate.includes(files[0].type)) {
      this.fileDragdrop = files[0];
      this.resumeupload = files[0];
    } else {
      this.fileDragdrop = "";
      this.resumeupload = "";
      Swal.fire({
        icon: "info",
        title: "Please upload valid formate.",
        showDenyButton: false,
        timer: 3000,
      })
    }

  }

  close(isValid : boolean = true) {
    this.modalRef.hide();
    this.fileDragdrop = "";
    $("#fileDropRef")[0].value = '';
    if(isValid){
      this.rtrContent.controls.forEach((ele, index) => {
        if (ele.get('candidateId').value === this.selectedResumeAttached.candidateId) {
          this.rtrContent.at(index).get('resumeAttached').setValidators([Validators.required]);
          this.rtrContent.at(index).get('resumeAttached').updateValueAndValidity();
        }
      });
    }
  }

  removeFile(){
    this.fileDragdrop = "";
    $("#fileDropRef")[0].value = '';
  }

  applyResumeUploadData = [];
  jobApplyprepareFilesList(files: File) {
    if (files[0].size > this.fileSize) {
      Swal.fire("", `${this.IMAGE_ERROR}`, "info");
      $("#fileDropRef")[0].value = '';
      return true;
    }

    var fromate = ['application/pdf', 'application/docx', 'application/doc', 'text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword']

    if (fromate.includes(files[0].type)) {
      this.fileDragdrop = files[0];
      this.applyResumeUploadData.push({
        file: files[0],
        candidateId: this.selectedResumeAttached.candidateId
      });
      // this.selectedCandidate.emit({value : this.selectedCandidateData , formData : this.rtrContent , terms : this.termAndCondition,resumes:this.applyResumeUploadData});

    } else {
      this.fileDragdrop = "";
      Swal.fire({
        icon: "info",
        title: "Please upload valid formate.",
        showDenyButton: false,
        timer: 3000,
      })
    }


  }

  onFileDropped($event) {
    this.prepareFilesList($event);
  }

  onChangePeriod(value) {

  }

  patchEmail() {
    this.candidatePostForm.patchValue({
      candidateEmailId: this.candidatePostForm.value.email
    })
    if (localStorage.getItem("userType") != "JOB_SEEKER") {
      this.emailidcehck(this.candidatePostForm.value.email);
    }
  }

  emailidcehck(id) {
    this.apiService.query("user/checkMailAlreadyExists/" + id).subscribe((res) => {
      if (res.data != undefined && res.data.exists != undefined) {
        if (res.data.exists) {
          setTimeout(() => {
            this.candidatePostForm.get('email').reset();
            Swal.fire({
              icon: "info",
              title: "There already exists an account registered with this email address, Please enter different email",
              showConfirmButton: true,
            });
          }, 500);

        }

      }
    })

  }
  closemodel() {
    this.modalRef.hide();
  }
  efftiveselecteddateCandidate: any;
  formatDates(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2) {
      day = '0' + day;

    }

    return [year, month, day].join('/');
  }
  purchesCredits(buyCredit: TemplateRef<any>) {
    this.modalRef.hide();
    this.router.navigate(['checkout'])
    // this.modalRef = this.modalService.show(buyCredit, this.backdropConfig);
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
            this.apiService.create("credits/buyCredits", data).subscribe(res => {
              this.util.stopLoader();
              this.creditform.reset();
              this.modalRef.hide()
              this.showmodel = false;

              if (res.code == "00000") {
                Swal.fire({
                  icon: "success",
                  title: "Credit Added Successfully",
                  showDenyButton: false,
                  // confirmButtonText: `ok`,
                  showConfirmButton: false,

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


  digitKeyOnly(e) {
    var keyCode = e.keyCode == 0 ? e.charCode : e.keyCode;
    if ((keyCode >= 37 && keyCode <= 40) || (keyCode == 8 || keyCode == 9 || keyCode == 13) || (keyCode >= 48 && keyCode <= 57)) {
      return true;
    }
    return false;
  }


  uploadFiles: Array<any> = [];
  serverCurrentDate: string;
  servertimedate: string;
  disable_for_draft: boolean = false;

  async updateCandidate(statusvaluecandidate: string) {

    this.candidateSubmit = true
    this.disable_for_draft = true;
    if (statusvaluecandidate == 'ACTIVE' && this.candidatePostForm.status == "INVALID") {
      this.disable_for_draft = false;
      return true;
    }
    this.candidatePostForm.value.createdBy = localStorage.getItem('userId');
    this.candidatePostForm.get("status").setValue(this.object.status);
    this.candidatePostForm.get("isFeatured").setValue(this.object.isFeatured);


    if (this.object.status == 'DRAFTED' && statusvaluecandidate != 'DRAFTED') {

      this.candidatePostForm.patchValue({

        "createdByUserType": localStorage.getItem('userType'),

        "status": "ACTIVE"
      })

    }

    if (this.photoId != null || this.photoId != undefined) {
      this.candidatePostForm.get("photo").setValue(this.photoId);

    } else {
      this.candidatePostForm.get("photo").setValue(this.object.photo);
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

    if (this.candidatePostForm.valid) {

      const swalWithBootstrapButtons = Swal.mixin({
        customClass: { confirmButton: 'btn btn-success', cancelButton: 'btn btn-danger' },
        buttonsStyling: false
      })

      if (statusvaluecandidate != "DRAFTED") {

        this.updatecandidateafterValdaiton(statusvaluecandidate);
      } else {
        this.draftsavecandidate(statusvaluecandidate)
      }
    }




  }

  connect(values) {

    var data: any = {};
    data.userId = values.createdBy;
    data.requestedBy = localStorage.getItem("userId");
    this.util.startLoader();
    this.apiService.create("user/connect", data).subscribe((res) => {
      if (res.code == "00000") {
        this.util.stopLoader();
        this.connectionStatus = 'REQUEST_SENT';
        values.connectionStatus = this.connectionStatus;
        this.commonValues.setCandidateData(values);
        //message to show connect request is sent successfully
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
        Swal.fire({
          icon: "info",
          title: "Request failed",
          text: "Request coundn't be sent now. Please try after some time.",
          showConfirmButton: false,
          timer: 3000,
        });
      } else if (res.code == 'U0031') {
        this.util.stopLoader()
      }
    }, err => {
      this.util.stopLoader();

    });
  }


  updateCandidateObject(candidateObject): void {
    this.passValues.forEach((res, index) => {
      if (res.createdBy == candidateObject.createdBy) {
        this.passValues[index] = { ...this.passValues[index], connectionStatus: candidateObject.connectionStatus }
      }
    });
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

        this.updatecandidateafterValdaiton(statusvaluecandidate);

      } else {
        this.candidatePostForm.get('status').patchValue('DRAFTED');

        if (statusvaluecandidate != 'DRAFTED') {
          this.candidatePostForm.get('status').patchValue('DRAFTED');
          this.updatecandidateafterValdaiton(statusvaluecandidate);
        } else {
          this.commonVariables.jobPostingFlag = false
          this.searchData.setCommonVariables(this.commonVariables)
          this.modalRef.hide();
          this.candidatePostForm.reset()
          this.primarySkillsSelected = [];
          this.secondarySkillsSelected = [];
          this.otherSelectedStates = []
        }
      }
    });

  }

  createCandidateOnProf(event) {
    if (event.target.checked == true) {
      this.candidatePostForm.get('candidateEmailId').setValidators([Validators.required])
    } else {
      this.candidatePostForm.get('candidateEmailId').clearValidators()
      this.candidatePostForm.get('candidateEmailId').updateValueAndValidity({ emitEvent: false })

    }
  }


  async updatecandidateafterValdaiton(currentStatus: string) {
    if (this.currentOrganizationDetail && this.currentOrganizationDetail.organisationId) {
      this.candidatePostForm.get('organisationId').patchValue(this.currentOrganizationDetail.organisationId);
    }
    let updateCandidate: any = this.candidatePostForm.getRawValue();

    if (this.candidatePostForm.value.status != "DRAFTED") {
      updateCandidate.status = 'ACTIVE';
    }

    this.FormData = new FormData();
    this.FormData.append("resume", this.resumeupload);
    this.resumeupload = "";
    const textStatus: string = updateCandidate.status;
    if (this.object.status != 'ACTIVE' && updateCandidate.status == 'ACTIVE') {

      const userData = await this.planService.UPDATE_USERDETAILS("JOB_CANDIDATE_POSTINGS");
      let availablePoints = null;
      let actualPoints = null;
      let utilizedPoints = null;
      let promotional = null;

      if (userData.userDetail) {
        userData.userDetail.userPlanAndBenefits.benefitsUsages.forEach(ele => {
          if (ele.benefitKey == 'JOB_CANDIDATE_POSTINGS') {
            availablePoints = ele.available
            actualPoints = ele.actual
            utilizedPoints = ele.utilized
            promotional = ele.promotional
          }
        });
      }

      if (userData.isExpired) {
        this.planService.expiredPopup("JOB_CANDIDATE_POSTINGS", "PAY", null, null, null, availablePoints, actualPoints, utilizedPoints, promotional);

        return;
      }
    }
    updateCandidate.candidateReferenceId=updateCandidate.candidateId;
    updateCandidate.primaryResume = true;
    this.FormData.append("candidate", new Blob([JSON.stringify(updateCandidate)], { type: "application/json" }));
    this.apiService.updatePut('candidates/updateCandidate', this.FormData).subscribe(res => {
      if (res.code == '00000') {
        this.disable_for_draft = false;
        this.CandiIdHighLight = this.candidatePostForm.value.candidateId
        this.photo = null;
        this.util.stopLoader();
        this.modalService.hide(1);
        Swal.fire({
          position: "center",
          icon: "success",
          title: super.getTextBasedOnStatus(textStatus, textStatus === GigsumoConstants.DRAFTED ? "Draft updated" : "Candidate updated"),
          showConfirmButton: false,
          timer: 2000,
        });
        this.candidateReload.emit(currentStatus === "ACTIVE" ? "updateReload" : 'reload');
      }
    }, err => {
      this.util.stopLoader();
    });
  }


  fileBrowseHandler(files) {

    this.tempFile = files[0];
    this.prepareFilesList(files);
  }

  applyResumeUpload(files) {
    this.tempFile = files[0];
    this.jobApplyprepareFilesList(files);
  }
  otherSelectedStates: any = []
  // closeCandidate() {
  //   this.primarySkillsSelected = [];
  //   this.secondarySkillsSelected = [];
  //   this.otherSelectedStates = []
  //   this.modalService.hide(1);

  //   this.fileshow=undefined;
  //   this.myFileInput2.nativeElement.value = null;
  //   this.photoId=null;


  // }

  cancelcloseCandidate() {
    this.resumeupload = "";
    this.fileDragdrop = "";
    this.candidateSubmit = false;
    this.candidatePostForm.get("status").setValue(this.object.status);
    if (this.object.status == 'DRAFTED') {
      if (this.candidatePostForm.value.firstName != null && this.candidatePostForm.value.lastName != null) {
        this.candidatePostForm.get('status').patchValue('DRAFTED');
        this.draftsavecandidate('DRAFTED');
      } else {
        this.commonVariables.candidatePostingFlag = false
        this.searchData.setCommonVariables(this.commonVariables)
        this.modalService.hide(1)
        this.candidatePostForm.reset()
        this.primarySkillsSelected = [];
        this.secondarySkillsSelected = [];
        this.otherSelectedStates = []

      }
    } else {
      this.activecandidatecancel();
    }
  }
  activecandidatecancel() {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: { confirmButton: 'btn btn-success', cancelButton: 'btn btn-danger' },
      buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
      title: 'Cancel Edit?',
      text: "You may lose the changed data if you cancel. Would you like to continue?",
      icon: 'info',
      showCancelButton: true,
      allowOutsideClick: false,
      allowEscapeKey: false,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.commonVariables.candidatePostingFlag = false
        this.searchData.setCommonVariables(this.commonVariables)
        this.modalRef.hide();
        this.candidatePostForm.reset()
        this.primarySkillsSelected = [];
        this.secondarySkillsSelected = [];
        this.otherSelectedStates = []
      }
    });
  }

  removeFiles() {
    if (this.fileDragdrop != null && this.resumeupload != null && this.resumeupload != "") {
      this.fileDragdrop = '';
      this.resumeupload = '';
      $("#fileDropRef")[0].value = '';
    }
  }


  openMessage(seletedItem) {
    this.gigsumoService.candidateInviteBtnClicked = false;
    this.messagemodelflag = false;
    if (seletedItem.createdBy == this.userId) {
      seletedItem.owner = true;
    } else {
      seletedItem.owner = false;
    }
    setTimeout(() => {
      // if (this.userId != seletedItem.createdBy) {
      seletedItem.userId = seletedItem.createdBy;
      this.seletedChatItem = seletedItem;
      this.messageData = [];
      this.messagemodelflag = true;
      seletedItem.groupType = "CANDIDATE";
      seletedItem.messageType = "CANDIDATE";
      seletedItem.id = seletedItem.candidateId;
      this.messageData = seletedItem;
      // }
    }, 1000);
  }

  chatuser(seletedItem, connectionTemplate: TemplateRef<any>) {
    this.gigsumoService.candidateInviteBtnClicked = true
    this.passCandidateData = seletedItem;
    this.focus = 'candidate';
    if (seletedItem.isFeatured || (seletedItem.createdBy == this.userId)) {
      this.openMessage(seletedItem);
    } else if (!seletedItem.isFeatured) {
      //if (seletedItem.connectionStatus === 'CONNECTED') {
        this.openMessage(seletedItem);
     // } else if (seletedItem.connectionStatus !== 'CONNECTED') {
       // this.gigsumoService.candidateInviteBtnClicked = false;
        //this.openMessage(seletedItem);
        // to be used later
        // this.openConnectionTemplate(seletedItem, connectionTemplate);
     // }
    }
  }

  closeMessage(event) {
    this.messagemodelflag = false;
    // this._socket.ngOnDestroy();
  }
  deletecandidate(id: any) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })
    swalWithBootstrapButtons.fire({
      title: 'Do you wish to discard?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.util.startLoader();
        this.apiService.delete('candidates/delete/' + id).subscribe(res => {
          if (res.code == "00000") {
            this.util.stopLoader();
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Discarded Sucessfully',
              showConfirmButton: false,
              timer: 1500
            })
            this.candidateReload.emit('reload')
          }
        })
      }
    });
  }
  connectionStatus: string;
  connectionRequestRef: BsModalRef;
  values: any;
  counterpartsDetails: any;
  @ViewChild("connectionTemplate") connectionTemplate: TemplateRef<any>;
  openConnectionTemplate(values, connectionTempate?: TemplateRef<any>) {

    this.connectionStatus = values.connectionStatus;
    this.values = values;
    this.counterpartsDetails = values.user;
    const config: ModalOptions = { class: 'modal-md', backdrop: 'static', keyboard: false };
    this.connectionRequestRef = this.modalService.show(connectionTempate, config);
  }

  isInteger(event: any): boolean {
    // Check if 'event.target' exists and is an input element
    if (event.target instanceof HTMLInputElement && event.target.selectionStart !== null) {
      const charCode = (event.which) ? event.which : event.keyCode;
      return !(charCode > 31 && (charCode < 48 || charCode > 57));
    }
    return false;
  }



}





