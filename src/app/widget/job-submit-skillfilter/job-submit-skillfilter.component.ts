
import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CandidatesPageComponent } from 'src/app/components/candidate-module/candidates-page/candidates-page.component';
import { NewCandidateComponent } from 'src/app/page/homepage/candidate/new-candidate/new-candidate.component';
import { ApiService } from 'src/app/services/api.service';
import { CommonValues } from 'src/app/services/commonValues';
import { UtilService } from 'src/app/services/util.service';
import { CreditModelComponent } from './../../components/credit/credit-model/credit-model.component';
import { SearchData } from './../../services/searchData';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-job-submit-skillfilter',
  templateUrl: './job-submit-skillfilter.component.html',
  styleUrls: ['./job-submit-skillfilter.component.scss'],
  providers: []
})
export class JobSubmitSkillfilterComponent implements OnInit, OnChanges {
  @Input() jobData: any;
  @Input() focus: string;
  @Input() candidateData: any;
  @Input() termsChecked: boolean;
  @Input() dataPasstoSkillwidgets: any;
  @Input() formData: any;
  @Input() resumes: any=[];
  @Input() widgetDesc: string;
  @Input() feaJ;
  duplicateres = false;
  duplicateinvites = false;
  duplicateresumes = false;
  @ViewChild('tagInput') tagInputRef: ElementRef;
  candidateFilter: boolean = false
  bsModalRef: BsModalRef;
  headerTitle: any;
  candidatePage !: CandidatesPageComponent;

  user: any = [{ a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }];
  @Input() selectedTags: any[];
  @Output() emitRemoveTag: EventEmitter<any> = new EventEmitter<any>();
  jobfilter: boolean = false;
  rtrpayType: any;
  candidateId: any;
  getresusertype: any;
  jobCountry: string;
  targetRates: string;
  jobPayType: string;
  constructor(private a_route: ActivatedRoute, private formBuilder: UntypedFormBuilder,
    private modalService: BsModalService , private comtwo: NewCandidateComponent,
     private commonValues: CommonValues, private searchData: SearchData, private router: Router, private util: UtilService,
     private api: ApiService) {


    this.a_route.queryParams.subscribe((res) => {
      this.jobCountry = res.country;
      this.targetRates = res.targetRateTo;
      this.jobPayType = res.payType;
      this.candidateId = res.candidateId;
      this.getresusertype = res.userType

      if (res.jobfilter != "undefined" && res.jobfilter != undefined && res.jobfilter == 'true') {
        this.candidateFilter = true;
        this.targetRate = res.targetRateTo;
        this.rtrpayType = res.payType;
      } else if (res.candidatefilter != "undefined" && res.candidatefilter != undefined && res.candidatefilter == 'true') {
        this.jobfilter = true

        if (res.getResume == "true") {
          this.getResume = true;
        }
      }
      if (res.master != "NETWORK" && res.master != "TEAM" && res.menu != null && res.menu != undefined) {
        // this.headerTitle = res.menu;
      }
    });
  }


  ngOnChanges(changes: SimpleChanges): void {

    if (changes.dataPasstoSkillwidgets && changes.dataPasstoSkillwidgets.currentValue && this.focus == 'job') {

    }
    if (changes.termsChecked && changes.termsChecked.currentValue!=undefined) {
      this.termsChecked = changes.termsChecked.currentValue;
     }

    if (changes.resumes && changes.resumes.currentValue!=undefined) {
      this.resumes = changes.resumes.currentValue;
     }

  }



  ngOnInit() {
    // console.log(this.jobData);
    if (this.focus == 'candidate') {
      this.headerTitle = this.candidateData.firstName + " " + this.candidateData.lastName + " " + "(" + this.candidateData.candidateId + ")"
    } else if (this.focus == 'job') {
      this.headerTitle = this.jobData.jobTitle + " " + "(" + this.jobData.jobId + ")"
    }
  }


  /// you can remove user in tag
  // removeTag(user) {
  //   this.emitRemoveTag.emit(user);
  //   if (this.dataPasstoSkillwidgets != null && this.dataPasstoSkillwidgets.length > 0) {
  //     this.dataPasstoSkillwidgets.forEach((element, i) => {
  //       if (element.candidateId === user.candidateId) {
  //         this.dataPasstoSkillwidgets.splice(i, 1);
  //       }
  //     });
  //   }
  // }



  removeTag(user, i) {
    this.emitRemoveTag.emit(user);

    if (this.dataPasstoSkillwidgets != null && i >= 0 && i < this.dataPasstoSkillwidgets.length) {
      const removedElements = this.dataPasstoSkillwidgets.filter((element, index) => {
        return !(index === i || (element.candidateId === user.candidateId && element.jobId === user.jobId));
      });
      this.dataPasstoSkillwidgets = removedElements;
    }
  }





  // submit check

  targetRate: any
  candidateRequested(value) {
    if (this.dataPasstoSkillwidgets != null && this.dataPasstoSkillwidgets.length > 0) {
      this.duplicateinvites = true;
      if (value != undefined && value != null) {
        this.util.startLoader();
        if (value != undefined) {
          var data: any = {}
          data.candidateId = this.candidateData.candidateId
          data.interestShownLogs = [];
          value.forEach(element => {
            if (element.isSelected) {
              data.interestShownLogs.push({ "jobId": element.jobId, "requestedBy": localStorage.getItem('userId') })
             }
          });
          this.api.updatePut('candidates/updateCandidateInterested', data).subscribe(res => {
            if (res.code == '00000') {
              this.duplicateinvites = false;
              data.resumeRequestLogs = []
              value.forEach(element => {
                if (element.isSelected) {
                   if (element.resumeRequestStatus==undefined && element.resumeRequestStatus!="INITIATED") {
                    data.resumeRequestLogs.push({ "jobId": element.jobId, "requestedBy": localStorage.getItem('userId') })
                  }
                }
              });

              Swal.fire({
                position: "center",
                icon: "success",
                text: "Invitation to apply sent.",
                title: "Invitation Sent",
                showConfirmButton: false,
                timer: 2000,
              }).then(() => {
               // data.resumeRequestStatus=data.interestShownLogs;
                delete data.interestShownLogs;
                data.isInterestShown=true;
                // this.requestResume(data);
                this.refreshandModelclose(data)
              });
            }
            this.util.stopLoader();
          }, err => {
            this.duplicateinvites = false;
            this.util.stopLoader();
          });
        } else {
          this.duplicateinvites = false;
          Swal.fire({
            position: "center",
            icon: "info",
            title: "No jobs selected",
            text: "Please, select jobs before submitting.",
            showConfirmButton: false,
            timer: 1500,
          })
        }


      }
    }
  }


  isInteger(event) {
    var ctl = document.getElementById('myText');
    var startPos = ctl['selectionStart'];

    if (startPos == 0 && String.fromCharCode(event.which) == '0') {
      return false;
    }
  }

  getresumeAPIcall(data: any) {
    this.duplicateresumes = true;
    if (this.dataPasstoSkillwidgets != null && this.dataPasstoSkillwidgets.length > 0) {
      let element: any = {}
      if (data != undefined) {
        var dataResume: any = {};
        dataResume.candidateId = this.candidateData.candidateId;
        dataResume.resumeRequestLogs = [];
        if ('JOB_SEEKER' == this.getresusertype) {
          this.dataprepareforresume(data, element, dataResume);

        } else {
          this.dataprepareforresume(data, element, dataResume);
        }
      } else {
        this.duplicateresumes = false;
        Swal.fire({
          position: "center",
          icon: "info",
          title: "No Job selected",
          text: "Please, select job before submitting.",
          showConfirmButton: false,
          timer: 3000,
        })
      }
    }
  }


  dataprepareforresume(data, element, dataResume) {
    data.forEach(elements => {
      if (elements.isSelected) {
        dataResume.resumeRequestLogs.push({ "jobId": elements.jobId, "requestedBy": localStorage.getItem('userId') })
      }
    });

    setTimeout(() => {
      dataResume.createdBy = localStorage.getItem('userId');
      this.requestResume(dataResume);
    }, 700);
  }

  refreshandModelclose(data){
    this.modalService.hide(1);
    this.emitRemoveTag.emit("CLEAR");
    this.commonValues.setinviterefresh(data);
  }

  requestResume(data) {

    if(data.resumeRequestLogs.length==0){
      this.refreshandModelclose(data)
    }else{
      this.util.startLoader();
      this.api.updatePut('candidates/updateResumeRequests', data).subscribe(res => {
        if (res.code === '00000') {
          this.duplicateresumes = false;
          this.util.setResumeRequested(data.candidateId, true);
          this.util.stopLoader();
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Resume request sent',
            showConfirmButton: false,
            timer: 1500,
            customClass: {
              title: 'swal2-title'
            }
          }).then(() => {
            this.modalService.hide(1);
          });
        }
      }, err => {
        this.duplicateresumes = false;
        this.util.stopLoader();
      });
    }


  }



  getResume = false;
  rtrformModal: BsModalRef;
  submitRTR: boolean = false;
  tempData: any = [];
  ResumeFormData: any;
   submitcandidateData(data: Array<any>) {
   this.ResumeFormData = new FormData();
   if (data != undefined && data.length > 0 && this.termsChecked && this.formData.valid) {

      let tempSubmitData = [];
        this.dataPasstoSkillwidgets.forEach((ele: any) => {
        this.formData.controls.forEach(element => {
          if (ele.candidateId === element.value.candidateId) {
            tempSubmitData.push({
              'userId': element.value.candidateId,
              'appliedUserId': localStorage.getItem('userId'),
              'targetRate': element.value.targetrate,
              'payType': element.value.RtrpayType,
              'candidateName': element.value.candidateName ,
              'resumes' : ele.resumes
            });
          }
        });
      });
       // return;
      if (tempSubmitData.length > 0) {
        let datas: any = {};
        let submitData = [];
        tempSubmitData.forEach((submitresponse ,index)=>{
          const {resumes , ...rest} =  submitresponse;
          if(resumes === undefined || resumes === null || (resumes!=null && resumes.length === 0)){
            submitData.unshift(rest);
          }
          else if(resumes && resumes.length > 0){
            submitData.push(rest);
          }
        });

        if(submitData.length > 0){
          datas.appliedBy = submitData;
          datas.jobId = this.jobData.jobId;
          datas.organisationName = this.jobData.jobPostedBehalfOf;
          this.ResumeFormData.append("jobApplications", new Blob([JSON.stringify(datas)], { type: "application/json" }));
          if(this.resumes && this.resumes.length > 0){
            submitData.forEach((respo , index)=>{
              this.resumes.forEach((resumeResponse)=>{
                if(resumeResponse.candidateId === respo.userId){
                  let file : File;
                  file = resumeResponse.file;
                  this.ResumeFormData.append("resumes", file);
                }
              });
            });
         }
        }



        this.duplicateres = true;
        this.util.startLoader();
        this.api.updatePut("jobs/updateJobApplied", this.ResumeFormData).subscribe((res) => {
          this.duplicateres = false;
          if (res) {
            this.util.stopLoader();
            if (res.code == '00000') {
              this.duplicateres = false;
              Swal.fire({
                position: "center",
                icon: "success",
                title: "Candidate(s) applied successfully.",
                showConfirmButton: false,
                timer: 2000,
              }).then(() => {
                this.modalService.hide(1);
                this.emitRemoveTag.emit("REFRESH");
                this.commonValues.setinviterefresh(datas);
              });
            }
          }
        }, err => {
          this.duplicateres = false;
          this.util.stopLoader();
        });
      }

    }
    else if (data.length === 0) {
      this.duplicateres = false;
      Swal.fire({
        position: "center",
        icon: "info",
        title: "No candidates selected",
        text: "Please, select candidates before submitting.",
        showConfirmButton: false,
        timer: 1500,
      });
      this.util.stopLoader();
    }

  }

  @Output() closeModalEvent: EventEmitter<any> = new EventEmitter<any>();

  modalhidejobsubmit() {

    this.comtwo.closeCandidateSupplyModal();
    this.closeModalEvent.emit();
  }

  openModalWithComponent() {
    const initialState: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      size: "open"
    };
    this.bsModalRef = this.modalService.show(CreditModelComponent, initialState);
    this.bsModalRef.content.closeBtnName = 'Close';
    // let data:any={}; data.sufficient=true;
    // this.router.navigate(["checkout"], { queryParams: data });
  }


  oldsubmitData(data) {
    if (data != undefined) {
      var submitData = [];
      var tempremovelist = [];
      data.forEach(element => {
        if (element.isSelected) {
          var datavalus = element.jobId;
          submitData.push({ 'userId': datavalus });
          tempremovelist.push({ 'jobId': datavalus });
        }
      });

      if (submitData.length != 0) {
        let datas: any = {};
        datas.appliedBy = submitData;
        datas.jobId = this.jobData.jobId;
        this.util.startLoader();
        this.api.updatePut("jobs/applyCandidates", datas).subscribe((res) => {
          if (res) {
            this.util.stopLoader()
            if (res.code == '00000') {
              Swal.fire({
                position: "center",
                icon: "success",
                title: "Candidate(s) submitted successfully.",
                showConfirmButton: false,
                timer: 2000,
              }).then(() => {
                this.searchData.setHighlighter('newjobs')
                this.router.navigate(["newjobs"]);
              });
              this.emitRemoveTag.emit(tempremovelist);
            }
          }
        }, err => {
          this.util.stopLoader();
        });
      } else {
        Swal.fire({
          position: "center",
          title: "No candidates selected",
          icon: "info",
          text: "Please, select candidates before submitting",
          showConfirmButton: false,
          timer: 1500,
        })
      }
    }

  }

  // submitJobData(data: Array<any>, rtrTemplate?: TemplateRef<any>) {
  //   this.tempData = data;
  //   // if(this.rtrformgrp!=undefined){
  //   //   this.rtrformgrp.get('termsandcondition').markAsUntouched();
  //   // }
  //   if ((this.dataPasstoSkillwidgets != null && this.dataPasstoSkillwidgets.length > 0 &&
  //     (this.rtrformgrp.get('rtrcontent') as FormArray).controls.length > 0)) {
  //       const initialState: NgbModalOptions = {
  //         backdrop: 'static',
  //         keyboard: false,
  //         size: "open"
  //       };
  //     this.rtrformModal = this.modalService.show(rtrTemplate,initialState);
  //   }
  // }
}
