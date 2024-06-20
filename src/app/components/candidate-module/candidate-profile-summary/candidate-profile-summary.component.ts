import { Location } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, EventEmitter, OnChanges, OnInit, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { Observable, Subscription } from 'rxjs';
import { AppSettings } from 'src/app/services/AppSettings';
import { FormValidation } from 'src/app/services/FormValidation';
import { GigsumoConstants } from 'src/app/services/GigsumoConstants';
import { ApiService } from 'src/app/services/api.service';
import { candidateModel } from 'src/app/services/candidateModel';
import { CommonValues } from 'src/app/services/commonValues';
import { JobService } from 'src/app/services/job.service';
import { SearchData } from 'src/app/services/searchData';
import { WorkExperience } from 'src/app/services/userModel';
import { UtilService } from 'src/app/services/util.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { PricePlanService } from '../../Price-subscritions/priceplanService';
import { CreditModelComponent } from './../../credit/credit-model/credit-model.component';

declare var $: any;
@Component({
  selector: 'app-candidate-profile-summary',
  templateUrl: './candidate-profile-summary.component.html',
  styleUrls: ['./candidate-profile-summary.component.scss'],
  outputs: ['candidateListing'],
  inputs: ['candidateDetails']
})
export class CandidateProfileSummaryComponent extends FormValidation implements OnInit, OnChanges {
  candidateId: any;
  candidateDetails: candidateModel;
  userId: string = localStorage.getItem('userId');
  @ViewChild("myFileInput") myFileInput;
  @ViewChild("myFileInput1") myFileInput1;
  @ViewChild("myFileInput2") myFileInput2;
  imageChangedEvent: any = "";
  candidateListing = new EventEmitter();
  public FORMERROR = super.Form;
  fileUploadName;
  fileshow = undefined;
  fileToUpload: File;
  photoId: any = null;
  FormData: any;
  bsModalRef: BsModalRef;
  infoData: any = {};
  photo: any = null;
  submited: boolean = false;
  showmodel = false
  creditform: UntypedFormGroup;
  firstName: any;
  candidateSupplyRef: BsModalRef;
  fileSize = AppSettings.FILE_SIZE;
  lastName: any;
  ActivateContent: string = "Edit Candidate";
  currentTimeDate: string | Date;
  connectionStatus: string;
  connectionRequestRef: BsModalRef;
  values: any;
  counterpartsDetails: any;
  unit = { duration: '30' };
  creditPoints: any;
  primaryEmail: any;
  updateDate: any = [];
  url = AppSettings.ServerUrl + "download/";

  userType = localStorage.getItem('userType');
  public envName: any = environment.name;
  tempFile: File;
  object: any;
  years: any = []
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
  uploadFiles: Array<any> = [];
  resumeId;
  checkisDefault
  modalRef2: BsModalRef | null;
  img: any = {};
  img4: any = {};
  croppedImage: any = "";
  serverCurrentDate: string;
  servertimedate: string;
  disable_for_draft: boolean = false;
  resumeupload;
  fileDragdrop: any;
  figureLength: number = 0;
  payType: null;
  typeTargetValue: string;
  targetRate: null;
  countryChosen: null;
  selectedCountries: boolean = false
  augmentedList
  fileName
  resumelist;
  resumelength

  primarySkillsSelected = [];
  secondarySkillsSelected = [];
  stateListCA: any = []
  stateListIN: any = []
  stateListAU: any = []
  countryList: any = [];
  submit: boolean = false
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
  //effectiveforList = []
  recruiterTitleList: any = []
  engagementTypeList = []
  workAuthorizationList: any = []
  jobPostForm: UntypedFormGroup;
  currentTime: any;
  maxDate: any
  candidateSubmit: boolean = false


  candidatePostForm: UntypedFormGroup;
  backdropConfig = {
    backdrop: true,
    ignoreBackdropClick: true,
    keyboard: false,
    // scroll
  };
  candidateJobTitleList: any = []
  modalRef: BsModalRef;
  otherStatesList: any = []
  modalOpen: boolean = false
  toggleOpen: boolean = false;
  candidatelistsub: Subscription;
  currentOrganizationDetail: WorkExperience;
  Resurl: any = AppSettings.ServerUrl;
  @ViewChild("connectionTemplate") connectionTemplate: TemplateRef<any>;
  constructor(
    private api: ApiService,
    private router: Router,
    private _location: Location,
    private util: UtilService,
    private formBuilder: UntypedFormBuilder,
    private activatedRoute: ActivatedRoute,
    private modalService: BsModalService,
    private searchData: SearchData,
    private commonValues: CommonValues,
    private planService: PricePlanService,
    private JobServicecolor: JobService,
  ) {
    super();
    this.userId = localStorage.getItem('userId');
    // this.searchData.setHighlighter('newcandidates');

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.candidateDetails.currentValue) {
      this.candidateDetails = changes.candidateDetails.currentValue;
      // console.log("CENTER_VALUE_UPDATED  ", this.candidateDetails);
      if (this.candidateDetails.candidateId) {
        // this.getCandidateDetails()
      }
    }
  }


  ngOnInit() {

    this.creditform = this.formBuilder.group({
      point: [null, Validators.compose([Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)])]
    });

  }
  updateCandidateObject(candidateObject): void {
    if (this.candidateDetails.candidateId == candidateObject.candidateId) {
      this.candidateDetails.status = candidateObject.status
    }
  }
  ngOnDestroy() {
    if (this.candidatelistsub) {
      this.candidatelistsub.unsubscribe();
    }
  }

  get credit() {
    return this.creditform.controls
  }

  closemodel() {
    this.modalRef.hide();
  }


  async proceedToInvite(values, jobsupplytemplate) {
    if (this.planService.ACTIVE_INTERACTION === 0) {
      let availablePoints = null;
      let actualPoints = null;
      let utilizedPoints = null;
      let promotional = null;
      const userData = await this.planService.UPDATE_USERDETAILS("ACTIVE_INTERACTIONS");
      userData.userDetail.userPlanAndBenefits.benefitsUsages.forEach(ele => {
        if (ele.benefitKey == 'ACTIVE_INTERACTIONS') {
          availablePoints = ele.available
          actualPoints = ele.actual
          utilizedPoints = ele.utilized
          promotional = ele.promotional
        }
      })
      this.planService.expiredPopup("ACTIVE_INTERACTIONS", "PAY", null, null, null, availablePoints, actualPoints, utilizedPoints, promotional);

      return;
    }
    values.userId = localStorage.getItem('userId');
    values.candidatefilter = true;
    values.getResume = false;
    values.userType = values.user.userType;
    const config: ModalOptions = { class: 'modal-lg', backdrop: 'static', keyboard: false };
    this.candidateSupplyRef = this.modalService.show(jobsupplytemplate, config);

  }


  connect(userId: string) {
    let datas: any = {};
    datas.userId = userId;
    datas.requestedBy = localStorage.getItem('userId');
    this.util.startLoader();
    this.api.create("user/connect", datas).subscribe((conData) => {
      this.util.stopLoader();
      console.warn("Connection Response data: ", conData);
      if (conData.code === "00000") {
        Swal.fire({
          icon: "success",
          title: "Connection request sent successfully",
          showConfirmButton: false,
          timer: 2000,
        });
      } else if (conData.code === "88888") {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Oops..",
          text: "Sorry, connection request failed. Please try after some time",
          showConfirmButton: false,
          timer: 3000,
        });

      }
    }, err => {
      this.util.stopLoader();
    });
  }



  checkConnectionStatus(values): Observable<any> {
    const apiURL = 'user/checkConnectionStatus';
    const params = new HttpParams()
      .set('userId', this.userId)
      .set('connnectorId', values.createdBy);

    const urlWithParams = `${apiURL}?${params.toString()}`;
    return this.api.query(urlWithParams);
  }
  focus: string;
  passCandidateData: any;
  invite(values: any, jobsupplytemplate: TemplateRef<any>, template: TemplateRef<any>) {
    this.focus = 'candidate'
    this.passCandidateData = values;
    if (values.isFeatured == true) {
      this.proceedToInvite(values, jobsupplytemplate);
    } else if (values.isFeatured == false || values.isFeatured == null) {
      if (values.connectionStatus === 'CONNECTED') {
        this.proceedToInvite(values, jobsupplytemplate);
      } else if (values.connectionStatus !== 'CONNECTED') {
        this.proceedToInvite(values, jobsupplytemplate);
        // to be used later
        // this.openConnectionTemplate(values.connectionStatus, values, template);
      }
    }
  }

  extractText(val: string) {
    return FormValidation.extractContent(val);
  }

  openConnectionTemplate(connectionStatus, values, connectionTempate?: TemplateRef<any>) {
    this.connectionStatus = connectionStatus;
    this.values = values;
    const config: ModalOptions = { class: 'modal-md', backdrop: 'static', keyboard: false };
    this.api.query("user/" + this.values.createdBy).subscribe(res => {
      if (res.code == '00000') {
        this.counterpartsDetails = res;
        this.connectionRequestRef = this.modalService.show(connectionTempate, config);
      }
    })
  }


  onDownload() {
    const file: File = this.tempFile;
    this.downloadFile(new Blob([file]), file.name);
  }

  downloadFile(blob: Blob, fileName: string): void {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.append(link);
    link.click();
    link.remove();
    // in case the Blob uses a lot of memory
    setTimeout(() => URL.revokeObjectURL(link.href), 0);
  }

  close() {
    this.modalRef2.hide();
    this.resumeupload = "";
    this.fileDragdrop = "";
  }
  open(content, item) {
    this.util.startLoader();
    this.resumeId = item;
    let loading = true;
    this.api.query("candidates/findCandidateById/" + this.candidateDetails.candidateId).subscribe(
      (res) => {
        if (res.code == '00000') {
          this.util.stopLoader();
          this.resumelist = "";
          this.candidateDetails = res.data.candidateData;
          this.resumelist = res.data.candidateData.resumes;
          this.resumelength = res.data.candidateData.resumes;
          this.candidateDetails.photo = res.data.candidateData.photo;
          // this.candidateDetails.userTypenot = res.data.candidateData.user.userType;
          this.photoId = res.data.candidateData.photo;
          if (loading) {
            this.modalRef = this.modalService.show(content, this.backdropConfig);
          }
        }
        loading = false;
      },
      (error) => {
        this.util.stopLoader();
        loading = false;
      }
    );
  }


  opens(content, item, val) {
    this.resumeId = item;
    this.checkisDefault = val

    if (val == true) {
      Swal.fire({
        position: "center",
        icon: "info",
        title: "you can't edit the primary resume change the primary before you try to edit",
        showConfirmButton: false,
        timer: 3000,
      })
    } else {
      this.modalRef2 = this.modalService.show(content, this.backdropConfig);

    }
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
            this.api.create("credits/buyCredits", data).subscribe(res => {
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
                  timer: 2000
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

  deleteResumes(id: any) {
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
    }).then((result) => {
      if (result.isConfirmed) {
        this.api.updatePut('candidates/deleteResumes/' + id, this.candidateDetails).subscribe(res => {
          if (res.code == "00000") {
            this.util.startLoader();
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Deleted Sucessfully',
              showConfirmButton: false,
              timer: 1500
            })
          }
          this.resumelist = res.data.candidateData.resumes
          this.candidateDetails = res.data.candidateData
          this.util.stopLoader();
        })
      }
    })
      ;
  }

  editresumes() {
    if (this.resumeupload != null && this.resumeupload != '' && this.resumeId != null) {
      this.util.startLoader()
      if (this.photoId != null) {
        this.candidateDetails.photo = this.photoId;
      } else {
        this.candidateDetails.photo = this.candidateDetails.photo;
      }
      this.FormData = new FormData();
      this.FormData.append("resume", this.resumeupload);
      this.candidateDetails.resumeFileId = this.resumeId

      this.candidateDetails.candidateReferenceId=this.candidateDetails.candidateId;
      this.FormData.append("candidate", new Blob([JSON.stringify(this.candidateDetails)], { type: "application/json" }));
      this.api.updatePut('candidates/updateCandidate', this.FormData).subscribe(res => {
        if (res.code == "00000") {
          this.util.stopLoader();
          this.modalRef2.hide();
          this.resumelist = res.data.candidateData.resumes
          this.candidateDetails = res.data.candidateData
          this.resumeupload = ""
          this.fileDragdrop = ""
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Resumes updated successfully",
            showConfirmButton: false,
            timer: 2000,
          })
        }
      });

    }
    if (this.resumeupload != null && this.resumeId == null) {
      this.util.startLoader()
      if (this.photoId != null) {
        this.candidateDetails.photo = this.photoId;
      } else {
        this.candidateDetails.photo = this.candidateDetails.photo;
      }

      this.candidateDetails.candidateReferenceId=this.candidateDetails.candidateId;

      this.FormData = new FormData();
      this.FormData.append("resume", this.resumeupload);
      this.FormData.append("candidate", new Blob([JSON.stringify(this.candidateDetails)], { type: "application/json" }));
      this.api.updatePut('candidates/updateCandidate', this.FormData).subscribe(res => {
        if (res.code == "00000") {
          this.util.stopLoader();
          this.modalRef.hide();
          this.resumelist = res.data.candidateData.resumes
          this.candidateDetails = res.data.candidateData
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Resumes Attached successfully",
            showConfirmButton: false,
            timer: 2000,
          })
        }
      });

    }

  }

  async downloadResume(data, userId, FileId) {
    const { candidateId, createdBy, connectionStatus,
      user, resumeDownloaded, ...rest } = data;

    console.log(user);
    if (!resumeDownloaded && createdBy != this.userId) {


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
      });

      if (userData.isExpired) {
        this.planService.expiredPopup("ACTIVE_INTERACTIONS", "PAY", null, null, null, availablePoints, actualPoints, utilizedPoints, promotional);
        return;
      }
      else {
        if (connectionStatus === "CONNECTED") {
          this.afterPlanValidationDownloadResume(candidateId, userId, createdBy, FileId);
        }
        else if (connectionStatus === "NOT_CONNECTED") {
          this.afterPlanValidationDownloadResume(candidateId, userId, createdBy, FileId);
          // to be used later
          // this.openConnectionTemplate(connectionStatus , data , this.connectionTemplate)
        }
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

  uploadPhotoHere() {
    this.myFileInput2.nativeElement.click();
  }

  fileChangeEvent(event, popupName): void {
    const checkSize = super.checkImageSize(event.target.files[0]);
    this.imageChangedEvent = event;
    const acceptedImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
    if (checkSize > 10) {
      Swal.fire("", `${this.IMAGE_ERROR}`, "info");
      this.myFileInput2.nativeElement.value = null;
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

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    // console.log("this.v-- "+this.croppedImage.name);
    // console.log("this.croppedImage-- "+this.croppedImage);

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

  imageLoaded2() {
    this.util.startLoader();
    const formData: FormData = new FormData();
    formData.append("file", this.fileToUpload, this.fileUploadName);
    // setTimeout(() => {
    this.api.create("upload/image", formData).subscribe((res) => {
      this.util.stopLoader();
      if (res) {
        this.photoId = res.fileId;
        this.img4.src = AppSettings.ServerUrl + "download/" + this.photoId;
        this.modalRef2.hide();

      }
    }, err => {
      this.util.stopLoader();

    });
  }

  BackBreadCream() {
    this._location.back();
  }

  LandingPage() {
    this.router.navigate(["landingPage"]);
  }
  getInitialstwo(firstname: string, lastname: string): string {
    return this.JobServicecolor.getInitialsparam(firstname, lastname);
  }

  getColortwo(firstname: string, lastname: string): string {
    return this.JobServicecolor.getColorparam(firstname, lastname);
  }

  async enableCandidate(event) {
    if (event.target.checked) {

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

        this.toggleOpen = false;
        return;
      }
      else {
        this.afterPlanValidationstatuschange(event);
      }
    } else {
      this.afterPlanValidationstatuschange(event);
    }
  }

  afterPlanValidationstatuschange(event) {
    if (event.target.checked == true) {
      if (this.candidateDetails.status != 'ACTIVE' && this.candidateDetails.status != 'DRAFTED' && this.candidateDetails.status != 'AWAITING HOST') {
        this.ActivateContent = 'Make Candidate Available'
      }
      this.candidateDetails.status = 'ACTIVE'
    } else if (event.target.checked == false) {
      this.candidateDetails.status = 'INACTIVE'
    }

    if (this.photoId != null) {
      this.candidateDetails.photo = this.photoId;
    } else {
      this.candidateDetails.photo = this.candidateDetails.photo;
    }
    this.FormData = new FormData();
    this.candidateDetails.candidateReferenceId=this.candidateDetails.candidateId;
    this.FormData.append("resume", this.resumeupload);
    this.FormData.append("candidate", new Blob([JSON.stringify(this.candidateDetails)], { type: "application/json" }));
    this.resumeupload = "";

    this.util.startLoader()
    this.api.updatePut('candidates/updateCandidate', this.FormData).subscribe(res => {
      if (res.code == '00000') {
        this.commonValues.setCandidateData(this.candidateDetails);
        this.candidateDetails = res.data.candidateData;
        this.candidateListing.emit(event.target.checked ? "updateReload" : "reload");
        this.util.stopLoader();
      }
    })
  }

  onFileDropped($event) {
    this.prepareFilesList($event);
  }

  openModalWithComponent() {
    const initialState: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      size: "open"
    };
    this.bsModalRef = this.modalService.show(CreditModelComponent, initialState);
  }


  async updateCandidate(statusvaluecandidate: string) {

    this.candidateSubmit = true
    this.disable_for_draft = true;
    if (statusvaluecandidate == 'ALL' && this.candidatePostForm.status == "INVALID") {
      this.disable_for_draft = false;
      return true;
    }
    this.candidatePostForm.value.createdBy = localStorage.getItem('userId');
    this.FormData = new FormData();
    if (this.photoId != null || this.photoId != undefined) {
      this.candidatePostForm.get("photo").setValue(this.photoId);
    } else {
      this.candidatePostForm.get("photo").setValue(this.candidateDetails.photo);
    }

    if (this.candidateDetails.status == 'DRAFTED' && statusvaluecandidate != 'DRAFTED') {
      this.candidatePostForm.patchValue({
        "createdByUserType": localStorage.getItem('userType'),
        "status": "ACTIVE"
      })
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

  cancelcloseCandidate() {
    this.resumeupload = '';
    this.fileDragdrop = '';
    this.candidateSubmit = false
    this.modalOpen = false
    this.toggleOpen = false;
    if (this.candidateDetails.status != 'ACTIVE') {
      $('#toogleBar').prop('checked', false);
    }
    this.candidatePostForm.get("status").setValue(this.candidateDetails.status);
    if (this.candidateDetails.status == 'DRAFTED') {
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
    // const swalWithBootstrapButtons = Swal.mixin({
    //   customClass: { confirmButton: 'btn btn-success', cancelButton: 'btn btn-danger' },
    //   buttonsStyling: false
    // })

    // swalWithBootstrapButtons.fire({
    //   title: 'Are You Sure?',
    //   text: "You would like to cancel this Candidate!",
    //   icon: 'info',
    //   showCancelButton: true,
    //   allowOutsideClick: false,
    //   allowEscapeKey: false,
    //   confirmButtonText: 'Yes',
    //   cancelButtonText: 'No',
    //   reverseButtons: true
    // }).then((result) => {
    //   if (result.isConfirmed) {
    //     this.commonVariables.candidatePostingFlag = false
    //     this.searchData.setCommonVariables(this.commonVariables)
    //     this.modalRef.hide();
    //     this.candidatePostForm.reset()
    //     this.primarySkillsSelected = [];
    //     this.secondarySkillsSelected = [];
    //     this.otherSelectedStates = []
    //   }
    // });
    this.modalOpen = false
    this.toggleOpen = false;
    this.commonVariables.candidatePostingFlag = false
    this.searchData.setCommonVariables(this.commonVariables)
    this.modalRef.hide();
    this.candidatePostForm.reset()
    this.primarySkillsSelected = [];
    this.secondarySkillsSelected = [];
    this.otherSelectedStates = []
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

        this.updatecandidateafterValdaiton();

      } else {
        this.candidatePostForm.get('status').patchValue('DRAFTED');

        if (statusvaluecandidate != 'DRAFTED') {
          this.candidatePostForm.get('status').patchValue('DRAFTED');
          this.updatecandidateafterValdaiton();
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
  // save with draft popup for model
  CandiateCreditInfo_draft(statusvaluecandidate) {
    this.candidatePostForm.get("status").setValue(this.candidateDetails.status);
    if (this.candidateDetails.status == 'DRAFTED') {
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: { confirmButton: 'btn btn-success', cancelButton: 'btn btn-danger' },
        buttonsStyling: false
      })
      var customText;
      if (localStorage.getItem('userType') == 'student' || localStorage.getItem('userType') == 'JOB_SEEKER') {
        customText = "Are you sure you won't be able to save the draft?";
      }
      else {
        customText = "Credits for this candidate will be consumed at 12 AM. Would you like to save it as a draft now and create the candidate, the next day?";
      }
      swalWithBootstrapButtons.fire({
        title: "Credit Consumption Alert",
        text: customText,
        icon: 'info',
        showCancelButton: true,
        allowOutsideClick: false,
        allowEscapeKey: false,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {

          this.candidatePostForm.get('status').patchValue('DRAFTED');
          // this.candidatePostForm.patchValue({
          //   'consumptionType': null,
          //   'points': 0,
          // })
          this.updatecandidateafterValdaiton();
        } else {
          this.candidatePostForm.get('status').patchValue('ACTIVE');
          this.updatecandidateafterValdaiton();
        }
      });
    } else {
      this.updatecandidateafterValdaiton();
    }
  }

  zipCodeValidaiton(x: number): boolean {
    if (String(x).length > 10) {
      return false;
    }
    return true;
  }

  async updatecandidateafterValdaiton(status?: string) {

    if (this.currentOrganizationDetail && this.currentOrganizationDetail.organisationId) {
      this.candidatePostForm.get('organisationId').patchValue(this.currentOrganizationDetail.organisationId);
    }
    let datevaluespass: any = this.candidatePostForm.getRawValue();
    if (this.candidatePostForm.value.status != "DRAFTED") {
      datevaluespass.status = 'ACTIVE';

    }

    this.FormData = new FormData();
    this.FormData.append("resume", this.resumeupload);
    this.resumeupload = "";
    const textStatus: string = datevaluespass.status;
    if (this.candidateDetails.status != 'ACTIVE' && datevaluespass.status == 'ACTIVE') {

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

        this.modalOpen = false
        this.toggleOpen = false;
        if (this.candidateDetails.status != 'ACTIVE') {
          $('#toogleBar').prop('checked', false);
        } return;
      }
    }
    datevaluespass.primaryResume=true;
    datevaluespass.candidateReferenceId=datevaluespass.candidateId;
    this.FormData.append("candidate", new Blob([JSON.stringify(datevaluespass)], { type: "application/json" }));
    this.api.updatePut('candidates/updateCandidate', this.FormData).subscribe(res => {
      if (res.code == '00000') {
        let candidateResponse = res.data.candidateData;
        candidateResponse.user = this.candidateDetails.user;
        this.candidateDetails = candidateResponse;
        this.candidateListing.emit(status === "ALL" ? "updateReload" : 'reload');
        this.disable_for_draft = false;
        this.toggleOpen = false;
        this.photo = null;
        this.util.stopLoader();
        //this.modalRef.hide()
        this.modalService.hide(1);
        this.modalService.hide(2);
        this.modalService.hide(3);
        if (res.data.candidateData.resumes == null) {
          this.resumeupload = null;
        }
        this.updateDate = [];
        Swal.fire({
          position: "center",
          icon: "success",
          title: super.getTextBasedOnStatus(textStatus, textStatus === GigsumoConstants.DRAFTED ? "Draft updated" : "Candidate updated"),
          showConfirmButton: false,
          timer: 2000,
        }).then(() => {
          this.commonVariables.jobPostingFlag = false
          this.searchData.setCommonVariables(this.commonVariables)
        })

        setTimeout(() => {
          // this.router.navigate(["newcandidates"]);
          // this.searchData.setHighlighter('newcandidates')
          if (res.data.status == 'ACTIVE') {
            res.data.candidateData.status = true
          } else if (res.data.status == 'INACTIVE') {
            res.data.candidateData.status = false
          }
          this.candidateDetails = res.data.candidateData
          // var a = res.data.candidateData.otherPreferedStates

          // var b = a.split(/[ ,]+/)
          // this.augmentedList = b
          this.candidateDetails.photo = res.data.candidateData.photo;
          this.primarySkillsSelected = [];
          this.secondarySkillsSelected = [];
          this.otherSelectedStates = []
          this.submit = false
          this.removeFiles()
        }, 2000);
      }
    }, err => {
      this.util.stopLoader();
    });
  }

  fileBrowseHandler(files) {
    this.tempFile = files[0];
    this.prepareFilesList(files);
  }

  prepareFilesList(files: File) {
    if (files[0].size > this.fileSize) {
      Swal.fire("", `${this.IMAGE_ERROR}`, "info");
      $("#fileDropRef")[0].value = '';
      return true;
    }
    this.fileDragdrop = files[0];
    this.resumeupload = files[0];
    var fromate = ['application/pdf', 'application/docx', 'application/doc', 'text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword']

    if (fromate.includes(files[0].type)) {
      this.fileDragdrop = files[0];
      this.resumeupload = files[0];

    } else {
      this.fileDragdrop = "";
      this.resumeupload = '';
      Swal.fire({
        icon: "info",
        title: "Please upload valid formate.",
        showDenyButton: false,
        timer: 3000,
      })
    }
  }
  removeFiles() {
    const fileDropRef = $("#fileDropRef")[0];
    if (fileDropRef) {
      fileDropRef.value = '';
    }
    if (this.fileDragdrop != null && this.resumeupload != null) {
      this.fileDragdrop = "";
      this.resumeupload = "";
    }
  }


  otherSelectedStates: any = []
  // closeCandidate() {
  //   this.primarySkillsSelected = [];
  //   this.secondarySkillsSelected = [];
  //   this.otherSelectedStates = []
  //   this.modalService.hide(1);

  //   this.fileshow = undefined;
  //   this.myFileInput2.nativeElement.value = null;
  //   this.photoId = null;


  // }

  patchEmail() {
    this.candidatePostForm.patchValue({
      candidateEmailId: this.candidatePostForm.value.email
    })
    if (localStorage.getItem("userType") != "JOB_SEEKER") {
      this.emailidcehck(this.candidatePostForm.value.email);
    }
  }

  emailidcehck(id) {
    this.api.query("user/checkMailAlreadyExists/" + id).subscribe((res) => {
      if (res.data != undefined && res.data.exists) {
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

  onChangePeriod(value) {

  }

  onChangePayType(value, param) {
    this.payType = value
    // if (this.countryChosen != null) {
    if ((this.countryChosen == 'US' || this.countryChosen == 'AU' || this.countryChosen == 'CA') &&
      this.payType == 'Hourly') {
      this.figureLength = 2
    } else if ((this.countryChosen == 'US' || this.countryChosen == 'AU' || this.countryChosen == 'CA') &&
      this.payType == 'Daily') {
      this.figureLength = 2
    } else if ((this.countryChosen == 'US' || this.countryChosen == 'AU' || this.countryChosen == 'CA') &&
      this.payType == 'Monthly') {
      this.figureLength = 6
    } else if ((this.countryChosen == 'US' || this.countryChosen == 'AU' || this.countryChosen == 'CA') &&
      this.payType == 'Weekly') {
      this.figureLength = 5
    } else if ((this.countryChosen == 'US' || this.countryChosen == 'AU' || this.countryChosen == 'CA') &&
      this.payType == 'Yearly') {
      this.figureLength = 8
    } else if (this.countryChosen == 'IN' &&
      this.payType == 'Hourly') {
      this.figureLength = 4
    } else if (this.countryChosen == 'IN' &&
      this.payType == 'Daily') {
      this.figureLength = 5
    } else if (this.countryChosen == 'IN' &&
      this.payType == 'Monthly') {
      this.figureLength = 7
    } else if (this.countryChosen == 'IN' &&
      this.payType == 'Weekly') {
      this.figureLength = 6
    } else if (this.countryChosen == 'IN' &&
      this.payType == 'Yearly') {
      this.figureLength = 8
    }
    // }
    if (this.typeTargetValue != null) {
      this.onTargetRateTyped(this.typeTargetValue, param)
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
      this.api.query('listvalue/find?domain=WORK_AUTHORIZATION_US').subscribe(res => {
        if (res.code == '00000') {
          this.workAuthorizationList = [];
          this.util.stopLoader()
          res.data.listValues[0].listItems.forEach(ele => {
            this.workAuthorizationList.push(ele.item)
            var mySet = new Set(this.workAuthorizationList);
            this.workAuthorizationList = [...mySet]
          });

          this.api
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
      this.api.query('listvalue/find?domain=WORK_AUTHORIZATION_AU').subscribe(res => {
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
            this.api
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
      this.api.query('listvalue/find?domain=WORK_AUTHORIZATION_IN').subscribe(res => {
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

            this.api
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
      this.api.query('listvalue/find?domain=WORK_AUTHORIZATION_CA').subscribe(res => {
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
            this.api
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

  onTargetRateTyped(value: string, param) {
    this.typeTargetValue = value;


  }

  getCandidateDetails() {
    this.api.query("candidates/findCandidateById/" + this.candidateDetails.candidateId).subscribe(res => {
      if (res.code == '00000') {
        this.util.stopLoader()
        this.resumelist = ""
        this.candidateDetails = res.data.candidateData
        this.resumelist = res.data.candidateData.resumes
        this.resumelength = res.data.candidateData.resumes
        this.candidateDetails.photo = res.data.candidateData.photo;
        // this.candidateDetails.userTypenot = res.data.candidateData.user.userType;
        this.photoId = res.data.candidateData.photo;
      }
    })
  }

  setPrimary(id, event) {
    this.util.startLoader();
    if (this.photoId != null) {
      this.candidateDetails.photo = this.photoId;
    } else {
      this.candidateDetails.photo = this.candidateDetails.photo;
    }
    this.FormData = new FormData();
    this.candidateDetails.primaryResumeId = id;
    this.candidateDetails.candidateReferenceId=this.candidateDetails.candidateId;
    this.FormData.append("candidate", new Blob([JSON.stringify(this.candidateDetails)], { type: "application/json" }));
    this.api.updatePut('candidates/updateCandidate', this.FormData).subscribe(res => {
      if (res.code == "00000") {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Candidate updated successfully",
          showConfirmButton: false,
          timer: 2000,
        })
        this.resumelist = ""
        this.resumelist = res.data.candidateData.resumes
        this.candidateDetails = res.data.candidateData;
        this.util.stopLoader();
      }
    });



  }

  model(value, template: TemplateRef<any>, val) {
    this.resumeupload = "";
    this.fileDragdrop = "";
    this.util.startLoader();
    this.resumeId = val;
    let resume: Array<any> = value.resumes;
    if (resume == null || undefined || resume.length < 3) {
      this.modalRef2 = this.modalService.show(template, this.backdropConfig);
      setTimeout(() => {
        this.util.stopLoader();
      }, 500);
    } else if (resume.length >= 3) {
      this.util.stopLoader();
      Swal.fire(
        "You Already have 3 resumes, please delete and add another resume"
      );
    }
  }

  digitKeyOnly(e) {
    var keyCode = e.keyCode == 0 ? e.charCode : e.keyCode;
    if ((keyCode >= 37 && keyCode <= 40) || (keyCode == 8 || keyCode == 9 || keyCode == 13) || (keyCode >= 48 && keyCode <= 57)) {
      return true;
    }
    return false;
  }


  get candidateControls() {
    return this.candidatePostForm.controls
  }

  getCountries() {
    this.countryList = [];
    this.util.startLoader();
    this.api.query("country/getAllCountries").subscribe((res) => {
      // this.util.stopLoader();
      res.forEach((ele) => {
        this.countryList.push(ele);
      });
    }, err => {
      this.util.stopLoader();
    });
  }

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
      this.api.create('listvalue/findbyList', data).subscribe(res => {
        if (res.code == '00000') {
          this.currentTime = new Date(res.data.currentTime);
          this.maxDate = new Date(this.currentTime);
          if (param == 'CANDIDATE') {
            this.usStatesList = []
            this.api
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
          res.data.DURATION.listItems.forEach(ele => {
            this.durationTypeList.push(ele.item)
            var mySet = new Set(this.durationTypeList);
            this.durationTypeList = [...mySet]
          })
          res.data.GIGSUMO_JOB_TITLE.listItems.forEach(ele => {
            this.candidateJobTitleList.push(ele.item)
            var mySet = new Set(this.candidateJobTitleList);
            this.candidateJobTitleList = [...mySet]
          })
          res.data.GIGSUMO_RECRUITERS_TITLE_LIST.listItems.forEach(ele => {
            this.recruiterTitleList.push(ele.item)
          })
        }
      })
    }
  }

  generateYears() {
    // var max = new Date().getFullYear();
    // var min = max - 80;
    for (var i = 0; i <= 20; i++) {
      this.years.push(i);
    }
  }

  checkspace(event: any): boolean {
    return super.validSpace(event);
  }

  inititateCandidateForm() {
    this.getCountries()
    this.generateYears()
    this.getListValues('CANDIDATE')
    this.searchData.setCommonVariables(this.commonVariables)
    this.candidatePostForm = new AppSettings().getEditCandidateGroup();
    if (this.userType == 'student' || this.userType == 'JOB_SEEKER') {
      this.candidatePostForm.get('candidateEmailId').clearValidators()
      this.candidatePostForm.get('candidateEmailId').updateValueAndValidity()
    }
  }

  async editCandidate(postTemplate: TemplateRef<any>, content) {

    try {
      this.disable_for_draft = false;
      this.candidateSubmit = false;
      this.updateDate = [];
      this.modalOpen = true;
      this.toggleOpen = true;
      this.ActivateContent = content;
      this.userType = localStorage.getItem('userType');

      this.util.startLoader();

      const data: any = {
        userId: localStorage.getItem('userId'),
        userType: localStorage.getItem('userType'),
      };

      const res = await this.api.create('user/profileDetails', data).toPromise();

      this.util.stopLoader();
      this.currentTimeDate = res.data.currentTimeByTimezone;
      this.firstName = res.data.userData.firstName;
      this.lastName = res.data.userData.lastName;

      const CurrentOrganization: Array<WorkExperience> = res.data.exeperienceList;
      if (CurrentOrganization != null && CurrentOrganization.length > 0) {
        this.currentOrganizationDetail = CurrentOrganization.find(workExp => workExp.currentOrganization);
      }

      this.primaryEmail = res.data.userData.email;
      this.fileshow = undefined;

      this.inititateCandidateForm();
      this.modalRef = this.modalService.show(postTemplate, this.backdropConfig);
      this.populateFormValues();
    } catch (error) {
      this.util.stopLoader();

    }
  }

  private populateFormValues() {
    if (this.candidateDetails.primarySkills != null && this.candidateDetails.primarySkills.length > 0) {
      this.primarySkillsSelected = [...this.candidateDetails.primarySkills];
    }

    if (this.candidateDetails.secondarySkills != null && this.candidateDetails.secondarySkills.length > 0) {
      this.secondarySkillsSelected = [...this.candidateDetails.secondarySkills];
    }

    if (this.candidateDetails.otherPreferedStates != null && this.candidateDetails.otherPreferedStates.length > 0) {
      this.otherSelectedStates = [...this.candidateDetails.otherPreferedStates];
    }
    this.onChangeCountry(this.candidateDetails.country, 'candidates');
    if (typeof this.candidateDetails.totalExperience === 'number') {
      this.candidateDetails.totalExperience = this.candidateDetails.totalExperience === 0 ? null : this.candidateDetails.totalExperience;
    }
    this.candidateDetails.email=this.candidateDetails.candidateEmailId;
    this.candidatePostForm.patchValue(this.candidateDetails);


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
  }

}
