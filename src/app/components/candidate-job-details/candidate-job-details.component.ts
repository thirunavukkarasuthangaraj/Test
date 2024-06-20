import { Component, EventEmitter, Input, OnChanges, OnInit, SimpleChanges, TemplateRef } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AppSettings } from 'src/app/services/AppSettings';
import { FormValidation } from 'src/app/services/FormValidation';
import { GigsumoConstants } from 'src/app/services/GigsumoConstants';
import { ApiService } from 'src/app/services/api.service';
import { APPLICANT_STATUS } from 'src/app/services/gigsumoService';
import { JobService } from 'src/app/services/job.service';
import { UtilService } from 'src/app/services/util.service';
import Swal from 'sweetalert2';
import { PricePlanService } from '../Price-subscritions/priceplanService';
import { CandidateCardComponent } from '../cards/candidate-card/candidate-card.component';
import { CustomValidator } from '../Helper/custom-validator';
declare var $: any
@Component({
  selector: "app-candidate-job-details",
  templateUrl: "./candidate-job-details.component.html",
  styleUrls: ["./candidate-job-details.component.scss"],
})
export class CandidateJobDetailsComponent
  extends FormValidation
  implements OnInit, OnChanges
{
  @Input() interactionResponse: Array<any>;
  @Input() showInteractiveButton: boolean = false;
  @Input() contentType: "CDI" | "JA" = "CDI";
  @Input() cardContent: string = "DEFAULT";
  @Input() totalCount: any;
  @Input() page: any;
  downloadurl = AppSettings.photoUrl;
  userId = localStorage.getItem("userId");
  messagemodelflag: boolean;
  messageData: any[];
  seletedChatItem: any;
  rtrformgrp: UntypedFormGroup;
  fileDragdrop: any;
  resumeupload: any;
  fileSize: any;
  tempFile: any;
  modalRef: BsModalRef;
  statusCall: string;
  FormData: FormData;
  tempstatus: any;
  tempdata: any;
  submitRTR: boolean;
  obj: any = {
    limit: 10,
    pageNumber: 0,
    userId: localStorage.getItem("userId"),
  };
  showResumeUpload: boolean;
  nextPage = new EventEmitter();
  resumeIndex: any;
  resumeuploaduserId: any;
  candidateId: any;
  jobId: any;
  Resurl = AppSettings.ServerUrl;
  constructor(
    private arouter: ActivatedRoute,
    private auth : ApiService,
    private router: Router,
    private compOne: CandidateCardComponent,
    private JobServicecolor: JobService,
    private util: UtilService,
    private api: ApiService,
    private formbuilder: UntypedFormBuilder,
    private modalService: BsModalService,
    private pricePlan: PricePlanService
  ) {
    super();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.interactionResponse != undefined ) {
      this.interactionResponse = changes.interactionResponse.currentValue;
    }
  }

  ngOnInit() {
  let data : string =
   (
    (this.contentType === "CDI" && this.cardContent === "DEFAULT") ? "JOB_APPLICATION_BUYER_ACTIONS" :
    (this.contentType === "CDI" && this.cardContent === "INVITE") ? "JOB_INVITATION_SUPPLIER_ACTIONS" :
    (this.contentType === "JA" && this.cardContent === "DEFAULT") ? "JOB_INVITATION_SUPPLIER_ACTIONS" :
    "JOB_APPLICATION_SUPPLIER_ACTIONS"
  );

  data = data + ( data.includes("APPLICATION") ? ",JOB_APPLICATION_BLOCKING_ACTIONS" : ",JOB_INVITATION_BLOCKED_ACTIONS");

  this.getApplicantFilter(data);


    this.rtrformgrp = this.formbuilder.group({
      targetrate: [
        null,
        Validators.compose([
          Validators.required,
          CustomValidator.validDecimal(),CustomValidator.checkWhiteSpace(),
        ]),
      ],
      RtrpayType: [null, Validators.required],
      country: null,
      termsandcondition: [null, Validators.requiredTrue],
    });
  }


  getApplicantFilter(data : string){
    this.auth.create(`listvalue/findbyList` , {domain : data}).subscribe((res)=>{
      if(res.code === GigsumoConstants.SUCESSCODE){
        let d = data.split(",");
        if(res.data[d[0]]){
          this.jobApplicationFilter = res.data[d[0]].listItems;
          this.jobApplicationFilter.forEach(d => d.wait = false);
          this.jobApplicationBlockedStatus =  res.data[d[1]] && res.data[d[1]].listItems;
        }
      }
     });
  }

  getCountryValue(code: string) {
    switch (code) {
      case "US":
        return "USD /";
      case "IN":
        return "INR /";
      case "CA":
        return "CAD /";
      case "AU":
        return "AUD /";
      default:
        return "CUR /";
        break;
    }
  }

  getPaytype(code: string) {
    switch (code) {
      case "Hourly":
        return "Hr";
      case "Daily":
        return "Day";
      case "Weekly":
        return "Week";
      case "Monthly":
        return "Month";
      case "Yearly":
        return "Year";
      default:
        break;
    }
  }

  showDropdown(index: number) {
    const dropDown: HTMLDivElement = document.getElementById(
      `dropDown${index}`
    ) as HTMLDivElement;

    if (dropDown.classList.contains("open")) {
      dropDown.classList.remove("open");
    } else {
      dropDown.classList.add("open");
    }

    this.interactionResponse.forEach((ele, i) => {
      if (i != index)
        document.getElementById(`dropDown${i}`).classList.remove("open");
    });
  }

  onDownload() {
    const file: File = this.tempFile;
    this.downloadFile(new Blob([file]), file.name);
  }

  isExcludedStatusTwo(status: APPLICANT_STATUS): boolean {
    const find = this.jobApplicationBlockedStatus && this.jobApplicationBlockedStatus.find(x => x.itemId === status);
    return find ? true : false;
   }



  updatestatuswithdraw(datas , value) {
    this.util.startLoader();
    var data: any = {};
    data.jobId = value.jobDetails.jobId;
    data.candidateId = value.candidateEntity.candidateId;
    data.currentStatus = datas.itemId;
    value.currentStatus = datas.itemId;
    data.candidateName =
      value.candidateEntity.firstName + " " + value.candidateEntity.lastName;
    data.jobTitle = value.jobDetails.jobTitle;
    data.createdByUserName = value.jobDetailspostedByUserName;
    data.organisationName = localStorage.getItem("currentOrganization");
    data.email = value.user.username;
    this.compOne.jobupdatestatus(data);
  }

  downloadFile(blob: Blob, fileName: string): void {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.append(link);
    link.click();
    link.remove();
    // in case the Blob uses a lot of memory
    setTimeout(() => URL.revokeObjectURL(link.href), 0);
  }
  getTitleCase(value: string): string {
    if (!value) return value;
    return value.replace(/\w\S*/g, (txt) => {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }
  async downloadResume(data, userId, FileId) {

    const { candidateId, createdBy, resumeDownloaded,
      connectionStatus, user, ...rest } = data;

    if (!resumeDownloaded && createdBy != this.userId) {


      const userData = await this.pricePlan.UPDATE_USERDETAILS("ACTIVE_INTERACTIONS");
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
        this.pricePlan.expiredPopup("ACTIVE_INTERACTIONS", "PAY", null, null, null, availablePoints, actualPoints, utilizedPoints, promotional);
        return;
      }
      else {
           this.afterPlanValidationDownloadResume(candidateId, userId, createdBy, FileId);
      }
    }
    else if (resumeDownloaded || createdBy === this.userId) {
      this.afterPlanValidationDownloadResume(candidateId, userId, createdBy, FileId);
    }
  }

  afterPlanValidationDownloadResume(candidateId: any, userId: any, createdBy: any, FileId: any) {
    let atag = document.createElement('a');
    atag.href = `${this.Resurl}candidates/resumeDownload/${candidateId}/${userId}/${createdBy}/${FileId}`;
    atag.click();
  }

  getData(object: any, property: string) {
    if (property === "currentStatus") {
      return object[property];
    }

    if (this.contentType === "CDI" &&object.candidateEntity) {
      if (property === "EXP") {
        return `Experience : ${object.candidateEntity["totalExperience"]} years`;
      } else if (property === "secondRow") {
        return object.candidateEntity["jobTitle"];
      } else if (property === "firstRow") {

        const firstName = this.getTitleCase(object.candidateEntity["firstName"]);
        const lastName = this.getTitleCase(object.candidateEntity["lastName"]);
        return `${firstName} ${lastName}`;
      } else if (property === "status") {
        return `${object.candidateEntity["status"]}`;
      }
      else if (property === 'availability') {
        return object.candidateEntity.availability;
      }

      return object.candidateEntity[property];
    }
    else if (this.contentType === "JA"&&object.jobDetails) {
      if (property === 'EXP') {
        return `Experience : ${object.jobDetails && object.jobDetails['experienceFrom']} to ${object.jobDetails && object.jobDetails['experienceTo']} years`;
      } else if (property === 'secondRow') {
        return `${object.jobDetails && object.jobDetails['city']} , ${object.jobDetails && object.jobDetails['state']}`;
      } else if (property === 'firstRow') {
        return object.jobDetails ? object.jobDetails['jobTitle'] : null;
      } else if (property === 'status') {
        return object.jobDetails && object.jobDetails['status'] ? `${object.jobDetails['status']}` : null;
      }   else if (property === 'availability') {
        return object.jobDetails.availability;
      }

      return object.jobDetails ? object.jobDetails[property] : null;
    }
  }

  getInitials(firstname: string, lastname: string): string {
    return this.JobServicecolor.getInitialsparam(firstname, lastname);
  }

  getColor(firstname: string, lastname: string): string {
    return this.JobServicecolor.getColorparam(firstname, lastname);
  }

  route(data: any, item: any, redirectPage?: string) {
    if (data != undefined) {
      const {
        jobDetails: { jobId,
          viewedByCount: jobViewedByCount,
          likesCount: jobLikesCount,
          appliedCount: jobAppliedCount,
          interestShownCount: jobInterestShownCount,
          status: jobstatus,
          availability: jobavailability,
        },
        candidateEntity: {
          candidateId,
          viewedByCount: candidateViewedByCount,
          jobsAppliedCount: jobsAppliedCount,
          likesCount: candidateLikesCount,
          interestShownCount: candidateInterestShownCount,
          status: candidatestatus,
          availability: candidateavailability,
        }
      } = data;
      // this.arouter.queryParams.subscribe((res) => {
      //     if (res.menu === "Job Invites Received")  {
      //         item="invited";
      //       }else if(res.menu === "Resume Request Recieved"){
      //         item="candidate-requests-received";
      //       }
      // });

      if (this.contentType === "CDI" && jobstatus != 'INACTIVE' && jobavailability && candidatestatus != 'INACTIVE' && candidateavailability) {

        if (item === "views" && jobViewedByCount > 0) {
          this.router.navigate(["newjobs"], {
            queryParams: { jobId: jobId, tabName: "jobs-viewed" },
          });
        } else if (item === "likes" && jobLikesCount > 0) {
          this.router.navigate(["newjobs"], {
            queryParams: { jobId: jobId, tabName: "jobs-liked" },
          });
        } else if (
          (item === "applied" && jobAppliedCount > 0) ||
          (item === "applied" && redirectPage === "directRoute")
        ) {
          this.router.navigate(["newjobs"], {
            queryParams: {
              jobId: jobId,
              candidateId: candidateId,
              tabName: "job-applicants",
            },
          });
        } else if (
          (item === "invited" && jobInterestShownCount > 0) ||
          (item === "invited" && redirectPage === "directRoute")
        ) {
          this.router.navigate(["newjobs"], {
            queryParams: {
              jobId: jobId,
              candidateId: candidateId,
              tabName: "candidates-invited",
            },
          });
        } else if (item === "candidate-requests-received") {
          this.router.navigate(["newcandidates"], {
            queryParams: {
              candidateId: candidateId,
              tabName: "candidate-requests-received",
            },
          });
        }
        else if (item === "likes" && jobLikesCount > 0) {
          this.router.navigate(['newjobs'], { queryParams: { jobId: jobId, tabName: 'jobs-liked' } });
        }
        else if (item === "applied" && jobAppliedCount > 0 || item === "applied" && redirectPage === 'directRoute') {
          this.router.navigate(['newjobs'], { queryParams: { jobId: jobId, candidateId: candidateId, tabName: 'job-applicants' } });
        }
        else if (item === "invited" && jobInterestShownCount > 0 || item === "invited" && redirectPage === 'directRoute') {
          this.router.navigate(['newjobs'], { queryParams: { jobId: jobId, candidateId: candidateId, tabName: 'candidates-invited' } });
        }
        else if (item === "candidate-requests-received") {
          this.router.navigate(['newcandidates'], { queryParams: { candidateId: candidateId, tabName: 'candidate-requests-received' } });
        }

      }
      else if (this.contentType === "JA" && jobstatus != 'INACTIVE' && jobavailability && candidatestatus != 'INACTIVE' && candidateavailability) {

        if (item === "views" && candidateViewedByCount > 0) {
          this.router.navigate(["newcandidates"], {
            queryParams: { candidateId: candidateId, tabName: "views" },
          });
        } else if (item === "likes" && candidateLikesCount > 0) {
          this.router.navigate(["newcandidates"], {
            queryParams: { candidateId: candidateId, tabName: "Clike-like" },
          });
        } else if (
          (item === "applied" && jobsAppliedCount > 0) ||
          (item === "applied" && redirectPage === "directRoute")
        ) {
          this.router.navigate(["newcandidates"], {
            queryParams: {
              candidateId: candidateId,
              jobId: jobId,
              tabName: "jobsApplied",
            },
          });
        } else if (
          (item === "invited" && candidateInterestShownCount > 0) ||
          (item === "invited" && redirectPage === "directRoute")
        ) {
          this.router.navigate(["newcandidates"], {
            queryParams: {
              candidateId: candidateId,
              jobId: jobId,
              tabName: "cInvited",
            },
          });
        } else if (item === "candidate-requests-received") {
          this.router.navigate(["newcandidates"], {
            queryParams: {
              candidateId: candidateId,
              tabName: "candidate-requests-received",
            },
          });
        }
      }
    }
  }

  likes(data, content: string) {

    if(content=="job"&&data.jobPostedBy!=localStorage.getItem("userId")||content=="candidate"&&data.createdBy!=localStorage.getItem("userId")){
      let datas: any = {};

      if (!data.isLiked || data.isLiked == null) {
        datas.likeStatus = "LIKE";
      } else if (data.isLiked) {
        datas.likeStatus = "UNLIKE";
      }

      datas.userId = localStorage.getItem("userId");
      content === "job"
        ? (datas.jobId = data.jobId)
        : (datas.candidateId = data.candidateId);
      this.util.startLoader();
      this.api
        .updatePut(
          content === "job"
            ? "jobs/updateJobLiked"
            : "candidates/updateCandidateLiked",
          datas
        )
        .subscribe(
          (res) => {
            if (res.code == "00000") {
              if (content === "job") {
                data.likesCount = res.data.jobData.likesCount;
                data.isLiked = res.data.jobData.isLiked;
              } else {
                data.isLiked = res.data.candidateData.isLiked;
                data.likesCount = res.data.candidateData.likesCount;
              }
            }
            this.util.stopLoader();
          },
          (err) => {
            this.util.stopLoader();
          }
        );
    }else{
      this.route(data,'likes')
    }
  }

  getClientType(value: string) {
    switch (value) {
      case "Vendor":
        return "V";
        break;
      case "Direct Hire":
        return "DH";
        break;
      case "Systems Integrator":
        return "SI";
        break;
      case "Prime Vendor":
        return "PV";
        break;
      case "Recruitment Process Outsourcer":
        return "RPO";
        break;
      case "Staffing Agency":
        return "SA";
        break;
      case "Direct Client":
        return "C";
        break;
      default:
        break;
    }
  }

  isExcludedStatus(status: APPLICANT_STATUS): boolean {

    const find = this.jobApplicationBlockedStatus && this.jobApplicationBlockedStatus.find(x => x.itemId === status);
    return find ? true : false;
  }

  jobApplicationFilter : Array<any> = [];
  jobApplicationBlockedStatus : Array<any> = [];

  isWait : boolean = false;
  filterApplicant(data : any){
    this.isWait = false;
    const arrs : Array<any> = [...this.jobApplicationFilter];

    const order = arrs.find(_x => _x.itemId === data)!.order;

    //  for RECRUITER ACTION
   if(this.contentType === "CDI"){

    const order = arrs.find(_x => _x.itemId === data)!.order;
    const lastValue :Array<any> = [];
    //  for RECRUITER ACTION

    const finalData : Array<any> = arrs.reduce((acc : Array<any>, current , index , arr )=>{

      const isAllWait = arr.some(pp => pp.wait === true);

      const find = acc.find(_d => _d.itemId === current.itemId);
      const next = arr.indexOf(current);
      const offer = arr.filter(o=> (o.order === undefined || o.order === null));

      if(find === undefined){

        const nextData = arr[next + 1];

        if(nextData && current.item !=null && data === current.itemId){
          if((nextData.item === undefined || nextData.item === null)){
            //  current.wait = true;
             this.isWait = true;
             return acc;
          }
          else if(nextData.item != undefined || nextData.item != null){
            this.isWait = false;
            // arr.forEach(p=> p.wait = false);
            return acc;
          }
        }

        if(current && current.item != undefined && current.order != undefined){
         acc.push(current);
        }
        else if(!lastValue.includes(offer) && (current.order === undefined || current.order === null)){
          lastValue.push(...offer);
        }

        if(this.isWait){
          acc = [];
          if(!acc.includes(offer)){
            acc.push(...offer);
          }
        }
      }

      return acc;
    },[]);

    const final = finalData.filter(_x => _x.order > order);
    if(!this.isWait){
      final.push(...lastValue);
    }


    return this.isWait ? finalData : final;

   }  //  for BENCH SALE ACTION
   else if(this.contentType === "JA"){

      const finalData = arrs.reduce((acc : Array<any>, current , index , arr )=>{

        const find = acc.find(_d => _d.itemId === current.itemId);
        const next = arr.indexOf(current) + 1;

        if(find === undefined){

          const nextData = arr[next];

          if(nextData && (current.item === undefined || current.item === null) && data === current.itemId){
            if(nextData.item != undefined || nextData.item != null){
               acc.push(...arr.filter(c=> c.order === order + 1));
               return acc;
            }
          }

         if((current.order === undefined || current.order === null) && current.item != undefined){
              acc.push(current);
          }

         }

        return acc;

      },[]);

      return  finalData;
   }

  }

  getFilterValue(key : string){
    const arrs : Array<any> = [...this.jobApplicationFilter];

    if(arrs){
      const find = arrs.find(c=>c.itemId === key);
      return find ? find.value : null;
    }
  }

  getClass(data) {
    return data.item.split(",")[1];
  }


  updatestatus(datas, value) {
    // return

    this.util.startLoader();
    var data: any = {};
    data.jobId = value.jobDetails.jobId;
    data.candidateId = value.candidateEntity.candidateId;
    data.currentStatus = datas.itemId;
    data.candidateName =   value.candidateEntity.firstName + " " + value.candidateEntity.lastName;
    data.jobTitle = value.jobDetails.jobTitle;
    data.createdByUserName = value.jobDetails.postedByUserName;
    data.email = value.user.email;
    var dropId = document.getElementById("jb_dpDown");
    dropId.classList.remove("open");
    this.api.create("candidates/updatejobAppliedStatus", data).subscribe(
    (res) => {
      this.util.stopLoader();
      if (res.code == "00000") {
        this.interactionResponse.forEach((element) => {
          if (
            value.candidateEntity.candidateId ==
              element.candidateEntity.candidateId &&
            value.jobDetails.jobId == element.jobDetails.jobId
          ) {
            element.currentStatus = datas.itemId;
          }
        });

        Swal.fire({
          position: "center",
          icon: "success",
          title: "Status successfully Updated.",
          showConfirmButton: false,
          timer: 2000,
        });
      }else if (res.code == "99998") {
        Swal.fire({
          position: "center",
          icon: "info",
          title: "Job application status updated already..!",
          showConfirmButton: true,
          allowEscapeKey: false,
          allowOutsideClick: false,
        }).then((result) => {
          if (result.isConfirmed) {
            this.JobServicecolor.confirmResult();
          }
        });
      }
    },
    (err) => {
      this.util.stopLoader();
    }
    );
   }

  chatuser(seletedItem) {
    this.messagemodelflag = false;

    if (seletedItem.jobPostedBy == this.userId) {
      seletedItem.owner = true;
    } else {
      seletedItem.owner = false;
    }

    setTimeout(() => {
      seletedItem.userId = seletedItem.jobPostedBy;
      this.seletedChatItem = seletedItem;
      this.messageData = [];
      this.messagemodelflag = true;
      seletedItem.groupType = "JOB";
      seletedItem.messageType = "JOB";
      seletedItem.id = seletedItem.jobId;
      this.messageData = seletedItem;
    }, 1000);
  }
  chatusercandidate(seletedItem) {
    if(seletedItem.status!='INACTIVE'&&seletedItem.availability){
      this.messagemodelflag = false;
      if (seletedItem.createdBy == this.userId) {
        seletedItem.owner = true;
      } else {
        seletedItem.owner = false;
      }
      setTimeout(() => {
        seletedItem.userId = seletedItem.createdBy;
        this.seletedChatItem = seletedItem;
        this.messageData = [];
        this.messagemodelflag = true;
        seletedItem.groupType = "CANDIDATE";
        seletedItem.messageType = "CANDIDATE";
        seletedItem.id = seletedItem.candidateId;
        this.messageData = seletedItem;
      }, 1000);
    }
  }

  disableCard(data: any): boolean {
    return (
      (data.candidateEntity && data.candidateEntity.status !== "ACTIVE") ||
      (data.candidateEntity && !data.candidateEntity.availability) ||
      (data.jobDetails != undefined && data.jobDetails.status !== "ACTIVE") ||
      (data.jobDetails != undefined && !data.jobDetails.availability)
    );
  }

  trackByCode(index: number, data: any): string {
    return this.contentType === "JA"
      ? data.candidateEntity.candidateId
      : data.jobDetails.jobId;
  }

  pagecount(event) {
    this.page = event;
    this.nextPage.emit(event);
  }

  onFileDropped($event) {
    this.prepareFilesList($event);
  }

  removeFiles() {
    $("#fileDropRef")[0].value = "";
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
    var fromate = [
      "application/pdf",
      "application/docx",
      "application/doc",
      "text/plain",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
    ];
    if (files[0].size > this.fileSize) {
      this.fileDragdrop = null;
      Swal.fire({
        icon: "info",
        title: "Please upload file lesser than 10 MB",
        showDenyButton: false,
        timer: 3000,
      });
      $("#fileDropRef")[0].value = "";
      this.resumeupload = null;
    } else if (fromate.includes(files[0].type)) {
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
      });
    }
  }

  checkAttached() {
    if (
      this.resumeupload == "" ||
      this.resumeupload == undefined ||
      this.resumeupload == null
    ) {
      return true;
    } else {
      return false;
    }
  }

  submit() {
    this.rtrformgrp.markAllAsTouched();
    this.submitRTR = true;
    var data: any = {};
    if (
      !this.tempdata.candidateEntity.resumeAttached &&
      this.checkAttached() &&
      this.statusCall !== "REJECTED"
    ) {
      Swal.fire({
        icon: "info",
        title: "Please Upload Resume...",
        showDenyButton: false,
        timer: 3000,
      });
      return;
    }

    if (
      (this.rtrformgrp.valid && this.rtrformgrp.value.termsandcondition) ||
      this.statusCall === "REJECTED"
    ) {
      this.util.startLoader();
      data.jobId = this.tempdata.jobDetails.jobId;
      data.organisationName = this.tempdata.user.organisation;
      data.postedByUserName = this.tempdata.jobDetails.postedByUserName;
      data.jobTitle = this.tempdata.jobDetails.jobTitle;
      // data.email=this.tempdata.user.email
      data.jobPostedBy = this.tempdata.jobDetails.jobPostedBy;
      data.candidateId = this.tempdata.candidateEntity.candidateId;
      data.currentStatus = this.tempstatus;
      data.targetRateFortheCandidate = this.rtrformgrp.value.targetrate;
      data.payTypeFortheCandidate = this.rtrformgrp.value.RtrpayType;
      // data.primaryResume=true;

      var dropId = document.getElementById("jb_dpDown");
      this.FormData = new FormData();
      this.FormData.append(
        "job",
        new Blob([JSON.stringify(data)], { type: "application/json" })
      );
      this.FormData.append("file", this.resumeupload);

      this.api
        .create("jobs/updateInterestShownStatus", this.FormData)
        .subscribe(
          (res) => {
            this.util.stopLoader();
            if (res.code == "00000") {
              this.jobsApi();
              if (this.statusCall === "ACCEPTED") this.hide();
              Swal.fire({
                icon: "success",
                title: `Invitation ${
                  this.statusCall === "ACCEPTED" ? "Accepted" : "Rejected"
                } Sucessfully`,
                showConfirmButton: false,
                timer: 2000,
              });
              this.resumeupload = "";
              this.fileDragdrop = "";
            }
          },
          (err) => {
            this.util.stopLoader();
          }
        );
    }
  }

  jobsApi() {
    this.util.startLoader();
    this.api
      .create("candidates/findMyCandidatesInvitations", this.obj)
      .subscribe((res) => {
        this.util.stopLoader();
        if (res.data != null) {
          res.data.candidateInvitations.forEach((ele) => {
            if (ele.user != null) {
              if (ele.user != null && ele.user.photo != null) {
                ele.user.photo = AppSettings.photoUrl + ele.user.photo;
              } else if (ele.user != null && ele.user.photo == null) {
                ele.user.photo = null;
              }
            }
          });
          this.interactionResponse = res.data.candidateInvitations;
        }
      });
  }

  async updatestatusFor(status, value, rtrtemplate: TemplateRef<any>) {
    if (status === "ACCEPTED") {
      let userData = await this.pricePlan.UPDATE_USERDETAILS(
        "ACTIVE_INTERACTIONS"
      );
      let availablePoints = null;
      let actualPoints = null;
      let utilizedPoints = null;
      let promotional = null;

      if (value.candidateEntity.resumeAttached) {
        this.showResumeUpload = false;
      } else {
        this.showResumeUpload = true;
      }
      userData.userDetail.userPlanAndBenefits.benefitsUsages.forEach((ele) => {
        if (ele.benefitKey == "ACTIVE_INTERACTIONS") {
          availablePoints = ele.available;
          actualPoints = ele.actual;
          utilizedPoints = ele.utilized;
          promotional = ele.promotional;
        }
      });

      if (userData.isExpired) {
        this.pricePlan.expiredPopup(
          "ACTIVE_INTERACTIONS",
          "PAY",
          null,
          null,
          null,
          availablePoints,
          actualPoints,
          utilizedPoints,
          promotional
        );

        return;
      } else {
        this.afterValidatingPlan(status, value, rtrtemplate);
      }
    } else {
      this.afterValidatingPlan(status, value, rtrtemplate);
    }
  }

  afterValidatingPlan(status, value, rtrtemplate: TemplateRef<any>) {
    this.tempstatus = status;
    this.rtrformgrp.patchValue({
      RtrpayType:
        value.jobDetails.payType != null ? value.jobDetails.payType : "Hourly",
      targetrate: value.jobDetails.targetRateTo,
      country: value.jobDetails.country != null ? value.jobDetails.country : "",
      termsandcondition: null,
    });
    this.rtrformgrp.get("termsandcondition").markAsUntouched();

    this.util.startLoader();
    if (status === "ACCEPTED") {
      this.statusCall = "ACCEPTED";
      if (
        value.candidateEntity.resumes != null ||
        value.candidateEntity.resumes != undefined
      ) {
        this.showResumeUpload =
          value.candidateEntity.resumes.length > 0 ? false : true;

        let ngbModalOptions: NgbModalOptions = {
          backdrop: "static",
          keyboard: false,
        };
        this.tempdata = value;
        this.resumeupload = "";
        this.fileDragdrop = "";
        this.modalRef = this.modalService.show(rtrtemplate, ngbModalOptions);
        this.util.stopLoader();
      } else if (
        value.candidateEntity.resumes === undefined ||
        value.candidateEntity.resumes === null
      ) {
        this.showResumeUpload = true;

        let ngbModalOptions: NgbModalOptions = {
          backdrop: "static",
          keyboard: false,
        };
        this.tempdata = value;
        this.resumeupload = "";
        this.fileDragdrop = "";
        this.modalRef = this.modalService.show(rtrtemplate, ngbModalOptions);
        this.util.stopLoader();
      }
    } else if (status === "REJECTED") {
      this.statusCall = "REJECTED";
      this.tempdata = value;
      this.resumeupload = "";
      this.fileDragdrop = "";
      this.submit();
    }
    this.util.stopLoader();
  }

  submitResume() {
    let data: any = {};
    data.candidateId = this.candidateId;
    data.userId = this.resumeuploaduserId;
    data.jobId = this.jobId;

    if (
      this.resumeupload != undefined &&
      this.resumeupload != null &&
      this.resumeupload != ""
    ) {
      this.FormData = new FormData();
      this.FormData.append("resume", this.resumeupload);
      this.FormData.append(
        "candidate",
        new Blob([JSON.stringify(data)], { type: "application/json" })
      );
      this.resumeupload = "";
      this.util.startLoader();
      this.api
        .updatePut("candidates/updateResumeRequestStatus", this.FormData)
        .subscribe((res) => {
          this.modalRef.hide();
          this.util.stopLoader();
          if (res.code == "00000") {
            this.modalRef.hide();
            this.interactionResponse.forEach((element, i) => {
              if (this.candidateId == element.candidateEntity.candidateId) {
                element.currentStatus = "COMPLETED";
              }
            });
            this.interactionResponse = [...this.interactionResponse];

            Swal.fire({
              position: "center",
              icon: "success",
              title: "Resumes Attached successfully",
              showConfirmButton: false,
              timer: 2000,
            });
          }
        });
    } else {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Please select file",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  }

  model(items, template: TemplateRef<any>, index) {
    this.util.startLoader();
    this.resumeupload = undefined;
    this.resumeIndex = index;
    this.fileDragdrop = null;
    this.candidateId = items.candidateEntity.candidateId;
    if (items.jobDetails != null) {
      this.jobId = items.jobDetails.jobId;
      this.resumeuploaduserId = items.jobDetails.jobPostedBy;
    }
    let ngbModalOptions: NgbModalOptions = {
      backdrop: "static",
      keyboard: false,
    };
    let resume: Array<any> = items.candidateEntity.resumes;
    if (!resume || resume.length === 0) {
      this.util.stopLoader();
      this.modalRef = this.modalService.show(template, ngbModalOptions);
      this.util.stopLoader();
    }
    // else if (resume.length >= 3) {
    // this.util.stopLoader();
    // Swal.fire(
    //   "You Already have 3 resumes , please delete and add another resume"
    // )
    //}
  }

  get rtrFormControls() {
    return this.rtrformgrp.controls;
  }

  hide() {
    this.modalRef.hide();
    this.rtrformgrp.reset();
    this.resumeupload = "";
    this.fileDragdrop = "";
  }

  closeMessage(event) {
    this.messagemodelflag = false;
  }
}
