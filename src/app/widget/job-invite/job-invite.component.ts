import { Component, Injectable, Input, OnInit, TemplateRef } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PricePlanService } from 'src/app/components/Price-subscritions/priceplanService';
import { countProvider } from 'src/app/components/suggestions/suggestions.component';
import { AppSettings } from 'src/app/services/AppSettings';
import { FormValidation } from 'src/app/services/FormValidation';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';
import Swal from 'sweetalert2';
import { SearchData } from './../../services/searchData';
import { BehaviorSubject } from 'rxjs';
declare var $: any

@Component({
  selector: 'app-job-invite',
  templateUrl: './job-invite.component.html',
  styleUrls: ['./job-invite.component.scss']
})
@Injectable()
export class JobInviteComponent extends FormValidation implements OnInit {

  @Input('title') title: string = 'Resume Request';
  @Input() widgetDesc: string;
  userType = localStorage.getItem('userType');
  headerTitle: string = 'Resume Request';
  user: any = [{ a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }];
  response = new BehaviorSubject<any[]>([]);
  stopScroll : boolean = false;
  prevAfterKey : string = "";
  filterjob;
  FormData: any;
  resumeuploaduserId: any;
  totalCount: any = 0;
  fileDragdrop: any;
  resumeupload;
  fileSize = AppSettings.FILE_SIZE;
  candidateId: any;
  jobId: any;
  object: any;
  some: boolean = false;
  modalRef: BsModalRef;
  loadAPIcall:boolean=false
  rtrformgrp !: UntypedFormGroup
  @Input() inputData: string;
  @Input() page: any;
  loaddata:boolean=false;
  configlist = {
    itemsPerPage: 5,
    currentPage: 1
  }
  userId = localStorage.getItem('userId')
  pathdata: any;
  @Input() maxMin: any = {};
  viewType: string = "MIN";
  obj: any = {
    limit: 10,
    pageNumber: 0,
    userId: localStorage.getItem('userId')
  }
  url = AppSettings.photoUrl;
  tempFile: File;
  constructor(private a_route: ActivatedRoute, private formbuilder: UntypedFormBuilder, private searchData: SearchData,
    private router: Router, private apiService: ApiService, private util: UtilService, private provider : countProvider,
    private pricePlan: PricePlanService, private modalService: BsModalService) {
    super();
  }



  ngOnInit() {

    this.rtrformgrp = this.formbuilder.group({
      targetrate: [null, Validators.compose([Validators.required, Validators.pattern('[1-9][0-9]*')])],
      RtrpayType: [null, Validators.required],
      country: null,
      termsandcondition: [null, Validators.requiredTrue]
    });

    this.userId = localStorage.getItem('userId')
    this.userType = localStorage.getItem('userType');
    this.headerTitle = this.widgetDesc;
    this.a_route.queryParams.subscribe((res) => {
      this.filterjob = res.candidatefilter;
      if (res.master != "NETWORK" && res.master != "TEAM" && res.menu != null && res.menu != undefined) {
        this.headerTitle = res.menu;
      }

    })

    this.jobsApi();
  }

  invitelist;

  jobsApi() {
    if(this.stopScroll){
      return;
    }
    this.loadAPIcall=true
    this.apiService.create("candidates/findMyCandidatesInvitations", this.obj).subscribe((res) => {
      this.loaddata=true
      this.util.stopLoader();
      this.loadAPIcall=false
      if (res.data != null) {

        const afterKey = res.data.searchAfterKey;
        const resData = res.data.candidateInvitations;

        if(resData){

          if(this.prevAfterKey === afterKey || resData.length === 0){
            this.stopScroll = true;
            return;
          }

          const data = resData.map(ele => {
            if (ele.user != null) {
              if (ele.user != null && ele.user.photo != null) {
                ele.user.photo = AppSettings.photoUrl + ele.user.photo
              } else if (ele.user != null && ele.user.photo == null) {
                ele.user.photo = null;
              }
            }
            return ele;
          });

          const combined  = [...this.response.getValue() , ...data];
          this.response.next(combined);
          this.prevAfterKey =  afterKey;

          if (res.data.totalCount != undefined && this.totalCount === 0) {
            this.totalCount = res.data.totalCount;
            this.provider.setCount(this.totalCount);
          }

        }

      }else{
        this.loaddata=false
      }
    });
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

  modelopen(data) {
    let dataPass: any = {};
    dataPass.data = data;
    dataPass.menu = this.widgetDesc;
    dataPass.master = this.page;
    dataPass.masterMenu = this.inputData;
    dataPass.widgetName = "JobInviteComponent";
    dataPass.count = this.totalCount;
    this.router.navigate(['suggestions'], { queryParams: dataPass })
  }

  pagecount(event) {
    this.configlist.currentPage = event;
    this.page = event;
    this.obj.pageNumber = event - 1;
    this.jobsApi();
  }

  getClasName(value: string) {
    return value;
  }

  onScrollDown(){
    if(!this.stopScroll&&this.obj.searchAfterKey != this.prevAfterKey){
      this.obj.searchAfterKey = this.prevAfterKey;
      this.jobsApi();
    }
  }


  onFileDropped($event) {

    this.prepareFilesList($event);
  }
  removeFiles() {
    $("#fileDropRef")[0].value = '';
    if (this.fileDragdrop != null && this.resumeupload != null) {
      this.fileDragdrop = null;
      this.resumeupload = null;
    }

  }
  fileBrowseHandler(files) {
    this.tempFile = files[0];
    this.prepareFilesList(files);

  }
  prepareFilesList(files: File) {
    // this.resumeupload = undefined;
    this.fileDragdrop = files[0];
    this.resumeupload = files[0];
    var fromate = ['application/pdf', 'application/docx', 'application/doc', 'text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword']
    if (files[0].size > this.fileSize) {
      this.fileDragdrop = null;
      Swal.fire({
        icon: "info",
        title: "Please upload file lesser than 10 MB",
        showDenyButton: false,
        timer: 3000,
      })
      $("#fileDropRef")[0].value = '';
      this.resumeupload = null;
    }
    else if (fromate.includes(files[0].type)) {
      this.fileDragdrop = files[0];
      this.resumeupload = files[0];

    } else {
      this.fileDragdrop = "";
      this.resumeupload = undefined;
      Swal.fire({
        icon: "info",
        title: "Please upload valid formate.",
        showDenyButton: false,
        timer: 3000,
      })
    }
  }
  statusCall
  submitRTR: boolean = false;
  isInteger(event) {
    var ctl = document.getElementById('myText');
    var startPos = ctl['selectionStart'];

    if (startPos == 0 && String.fromCharCode(event.which) == '0') {
      return false;
    }
  }
  submit() {
    this.rtrformgrp.markAllAsTouched()
    this.submitRTR = true;
    var data: any = {}

    if ((this.rtrformgrp.valid && this.rtrformgrp.value.termsandcondition) || this.statusCall === 'REJECTED') {
      this.util.startLoader();
      data.jobId = this.tempdata.jobDetails.jobId;
      data.organisationName = this.tempdata.user.organisation
      data.postedByUserName = this.tempdata.jobDetails.postedByUserName
      data.jobTitle = this.tempdata.jobDetails.jobTitle
      // data.email=this.tempdata.user.email
      data.jobPostedBy = this.tempdata.jobDetails.jobPostedBy;
      data.candidateId = this.tempdata.candidateEntity.candidateId;
      data.currentStatus = this.tempstatus;
      data.targetRateFortheCandidate = this.rtrformgrp.value.targetrate;
      data.payTypeFortheCandidate = this.rtrformgrp.value.RtrpayType;
      // data.primaryResume=true;


      var dropId = document.getElementById("jb_dpDown");


      this.FormData = new FormData();
      this.FormData.append("job", new Blob([JSON.stringify(data)], { type: "application/json" }));
      this.FormData.append("file", this.resumeupload)

      this.apiService.create('jobs/updateInterestShownStatus', this.FormData).subscribe(res => {
        this.util.stopLoader()
        if (res.code == '00000') {
          this.jobsApi();
          if (this.statusCall === "ACCEPTED") this.hide();
          Swal.fire({
            icon: "success",
            title: `Invitation ${this.statusCall === 'ACCEPTED' ? 'Accepted' : 'Rejected'} Sucessfully`,
            showConfirmButton: false,
            timer: 2000,
          });
          this.resumeupload = ''
          this.fileDragdrop = ''
        }
      }, err => {
        this.util.stopLoader();
      });
    }
  }
  get rtrFormControls() {
    return this.rtrformgrp.controls
  }


  tempstatus;
  tempdata: any;
  showResumeUpload: boolean;

  hide() {
    this.modalRef.hide();
    this.rtrformgrp.reset();
    this.resumeupload = "";
    this.fileDragdrop = "";
  }

}


