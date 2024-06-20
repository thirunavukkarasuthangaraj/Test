import { Component, OnChanges, OnInit, SimpleChanges, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { AppSettings } from 'src/app/services/AppSettings';
import { FormValidation } from 'src/app/services/FormValidation';
import { GigsumoConstants } from 'src/app/services/GigsumoConstants';
import { ApiService } from 'src/app/services/api.service';
import { candidateModel } from 'src/app/services/candidateModel';
import { JobService } from 'src/app/services/job.service';
import { UtilService } from 'src/app/services/util.service';
import Swal from 'sweetalert2';
import { PricePlanService } from '../../Price-subscritions/priceplanService';
declare var $: any

@Component({
  selector: 'app-candidate-requests-received',
  templateUrl: './candidate-requests-received.component.html',
  styleUrls: ['./candidate-requests-received.component.scss'],
  inputs : ['candidateDetails']
})
export class CandidateRequestsReceivedComponent extends FormValidation implements OnInit , OnChanges{

  candidateId: any;
  candidateDetails: candidateModel;
  searchConfig: any = { pageNumber: 0 }
  FormData: any;
  jobId: any;
  resumeupload;
  stopscrollFlag: boolean = false
  fileSize = AppSettings.FILE_SIZE;
  fileDragdrop: any;
  viewedList: any = [];
  userType: string = localStorage.getItem('userType');
  connectionStatus: string;
  userId = localStorage.getItem('userId');
  object
  modalRef: BsModalRef;
  termsCheck: any;
  rtrFormData: any;
  seletedChatItem;
  messageData: any;
  messagemodelflag: any;
  candidateSupplyRef: BsModalRef;
  dataPasstoSkillwidgets: Array<any> = [];
  resumeuploaduserId: any;
  counterpartsDetails: any;
  Resurl = AppSettings.ServerUrl;
  tempFile: File;
  loadAPIcall:boolean=false;

  constructor(private api: ApiService, private router: Router, private modalService: BsModalService, private util: UtilService,
    private a_route: ActivatedRoute, private JobServicecolor: JobService,private planService: PricePlanService) {
      super();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.candidateDetails.currentValue){
      this.searchConfig.pageNumber = 0;
      this.viewedList = [];
      this.loadAPIcall=true;
      this.stopscrollFlag = false;
      this.candidateDetails = changes.candidateDetails.currentValue;

      if(this.candidateDetails.candidateId){
        this.getResumeRequests();
      }
    }

  }
  downloadResume(candidateId, userId, createdBy, FileId) {
    let atag = document.createElement('a');
    atag.href = `${this.Resurl}candidates/resumeDownload/${candidateId}/${userId}/${createdBy}/${FileId}`;
    atag.click();

  }

  ngOnInit() {
    this.viewedList = [];
    this.searchConfig.pageNumber = 0;
  }
  apply(values: any, connectionTemplate?: TemplateRef<any>, candidateSupplyTemplate?: TemplateRef<any>) {


    if (values.isFeatured == true) {
      this.proceedToApply(values, candidateSupplyTemplate);
    } else if (!values.isFeatured) {
      if (values.connectionStatus === 'CONNECTED') {
        this.proceedToApply(values, candidateSupplyTemplate);
      } else if (values.connectionStatus !== 'CONNECTED') {
        this.proceedToApply(values, candidateSupplyTemplate);

      }
    }
  }
  userTypeMap: { [key: string]: string } = {
    'FREELANCE_RECRUITER': 'Freelance Recruiter',
    'RECRUITER': 'Recruiter',
    'JOB_SEEKER': 'Job Seeker',
    'MANAGEMENT_TALENT_ACQUISITION': 'Talent Acquisition Manager',
    'MANAGEMENT TALENT ACQUISITION': 'Talent Acquisition Manager',
    'BENCH_RECRUITER': 'Bench Recruiter'
  };


  isRoutingDisabled: boolean = false
  From: string = "JOBS_FROM_CONNECTION"
  open(values: any) {

    if (values.status != "BLOCKED") {
      if (values.clientType == null) {
        values.clientType = values.user.clientType
      }
      if (values.user != null) {
        values.clientType = values.user.clientType;
      }
      let data: any = {}
      data.jobPostedBy = values.jobPostedBy;
      data.jobId = values.jobId;
      if (values.isViewed != null && values.isViewed == true && values.jobPostedBy != this.userId) {
        this.router.navigate(['newjobs'], { queryParams: { jobId: values.jobId, tabName: 'job-details', From: this.From } });
      } else if (values.jobPostedBy == this.userId || localStorage.getItem('userType') == 'JOB_SEEKER') {
        this.router.navigate(['newjobs'], { queryParams: { jobId: values.jobId, tabName: 'job-details', From: this.From } });
      } else if (values.isViewed) {
        this.router.navigate(['newjobs'], { queryParams: { jobId: values.jobId, tabName: 'job-details', From: this.From } });
      } else {
        this.router.navigate(['newjobs'], { queryParams: { jobId: values.jobId, tabName: 'job-details', From: this.From } });
      }
    }
  }
  // openConnectionTemplate(connectionStatus, values, connectionTempate?: TemplateRef<any>) {
  //   this.connectionStatus = connectionStatus;
  //   this.values = values;
  //   const initialState: NgbModalOptions = {
  //     backdrop: 'static',
  //     keyboard: false,
  //     size: 'sm',
  //   };
  //   this.api.query("user/" + this.values.jobPostedBy).subscribe(res => {
  //     if (res.code == '00000') {
  //       this.counterpartsDetails = res;
  //       this.connectionRequestRef = this.modalService.show(connectionTempate, initialState);
  //     }
  //   })
  // }
  resumeData: any = []
  getchildData(data: any) {


    this.termsCheck = data.terms;
    if (data.resumes) {
      this.resumeData = data.resumes
    }
      this.termsCheck = data.terms;

    if (data.value != null) {
      this.dataPasstoSkillwidgets = data.value;
      this.rtrFormData = data.formData;
    } else {
      this.dataPasstoSkillwidgets = [];
    }
  }
  removeUserfromTag(data) {
    this.applyResponse.forEach(element => {
      if (element.candidateId == data.candidateId) {
        element.isSelected = false;
      }
    });

    this.dataPasstoSkillwidgets.forEach(element => {
      if (element.candidateId == data.candidateId) {
        element.isSelected = false;
      }
    });
  }

  closeCandidateSupplyModal() {
    this.modalService.hide(1);
  }
  async proceedToApply(values, candidateSupplyTemplate) {
    this.jobDetails = values.jobDetails
    const userData = await this.planService.UPDATE_USERDETAILS("ACTIVE_INTERACTIONS");
    if (userData.isExpired && this.userType != "JOB_SEEKER") {
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
    this.myCandidatesForApply(values.jobDetails.jobId, candidateSupplyTemplate);
    values.clientType = values.user.clientType;
    values.userType = values.user.userType;
    let datas: any = {};
    var datacheck = [{ 'userId': localStorage.getItem('userId') }]
    datas.jobPostedBy = localStorage.getItem('userId');
    datas.jobId = values.jobDetails.jobId;
    datas.appliedBy = datacheck;
    values.jobfilter = true;
    values.filterTitle = 'Select';
    values.fromBusinessPage = false
    values.jobDescription = "";
  }
  applyResponse: any = [];
  candidateFoundStatus: string;
  jobDetails
  myCandidatesForApply(jobId: string, candidateSupplyTemplate: any) {
    const responseData: any = {
      "source": {
        "all": false,
        "myCandidates": true,
        "allPlatFormCandidates": false,
        "teamCandidates": false,
        "benchNetworkCandidates": false,
        "freeLancerNetworkCandidates": false,
        "mtaNetworkCandidates": false,
        "jobSeekerNetworkCandidates": false,
        "featured": false,
        "suggestedCandidates": false
      },
      "workType": {
        "all": false,
        "remoteWork": false,
        "relocationRequired": false,
        "workFromHome": false
      },
      "jobId": jobId,
      "workAuthorization": [],
      "engagementType": [],
      "availableIn": [],
      "status": [],
      "searchAfterKey": null,
      "city": null,
      "state": null,
      "country": null,
      "zipCode": null,
      "submissionFilters": [],
      "postedFrom": null,
      "postedTo": null,
      "limit": 10,
      "userId": this.userId,
      "searchContent": ""
    }

    this.api.create('candidates/filter', responseData).subscribe(res => {
      if (res.code === GigsumoConstants.SUCESSCODE) {
        this.applyResponse = res.data.candidateList;
        if (this.applyResponse.length === 0) {
          this.candidateFoundStatus = "Couldn't find any Candidates for the applied filters.";
        }
        const config: ModalOptions = { class: 'modal-lg', backdrop: 'static', keyboard: false };
        this.candidateSupplyRef = this.modalService.show(candidateSupplyTemplate, config);
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

  removeFiles() {
    $("#fileDropRef")[0].value = '';
    if (this.fileDragdrop != null && this.resumeupload != null) {
      this.fileDragdrop = null
      this.resumeupload = null
    }

  }
  onFileDropped($event) {

    this.prepareFilesList($event);
  }

  fileBrowseHandler(files) {
    this.tempFile = files[0];
    this.prepareFilesList(files);

  }

  prepareFilesList(files: File) {
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
      this.resumeupload = '';
      Swal.fire({
        icon: "info",
        title: "Please upload valid formate.",
        showDenyButton: false,
        timer: 3000,
      })
    }



  }

  getCandidateDetails(candidatedata) {
    this.api.query("candidates/findCandidateById/" + candidatedata.candidateId).subscribe(res => {
      if (res.code == '00000') {
        this.util.stopLoader()
        this.object = res.data.candidateData;
      }
    })
  }
  closeMessage(event) {
    this.messagemodelflag = false;
  }

  chatuser(seletedItem, connectionTemplate?: TemplateRef<any>) {

    this.messagemodelflag = false;


   // this.jobDetails = seletedItem;
    if (seletedItem.isFeatured == true || (seletedItem.jobPostedBy == this.userId)) {

      this.openMessage(seletedItem);
    } else if (!seletedItem.isFeatured) {
      if (seletedItem.connectionStatus === 'CONNECTED') {
        this.openMessage(seletedItem);

      } else if (seletedItem.connectionStatus !== 'CONNECTED') {
        this.openMessage(seletedItem);

      }
    }


  }

  openMessage(seletedItem) {
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

  submit() {

    let data: any = {};
    data.candidateId = this.candidateDetails.candidateId;
    data.userId = this.resumeuploaduserId;
    data.jobId = this.jobId;
    // data.primaryResume=true;

    if (this.resumeupload != null && this.resumeupload != '' || this.resumeupload != undefined) {
      this.FormData = new FormData();
      this.FormData.append("resume", this.resumeupload);
      this.FormData.append("candidate", new Blob([JSON.stringify(data)], { type: "application/json" }));
      this.resumeupload = "";
      this.util.startLoader()
      this.api.updatePut('candidates/updateResumeRequestStatus', this.FormData).subscribe(res => {
        this.modalRef.hide();
        this.util.stopLoader();
        if (res.code == '00000') {
          this.viewedList.forEach(element => {
              element.currentStatus = 'COMPLETED';
              element.fileId = "COMPLETED";

          });

        }
      })
    } else {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Please select file",
        showConfirmButton: false,
        timer: 1500,
      })
    }
  }


  model(items, template: TemplateRef<any>) {
    this.resumeupload = null;
    this.object = null;

    this.resumeuploaduserId = items.user.userId;
    if (items.jobDetails != null) {
      this.jobId = items.jobDetails.jobId;
    }

    this.fileDragdrop = null;
    this.modalRef = this.modalService.show(template, { backdrop: "static", animated: true });
  }

  getInitialstwo(firstname: string,lastname: string): string {
    return this.JobServicecolor.getInitialsparam(firstname,lastname);
  }

  getColortwo(firstname: string,lastname: string): string {
    return this.JobServicecolor.getColorparam(firstname,lastname);
  }
  emptymessage:boolean=false
  getResumeRequests() {
    this.searchConfig.candidateId = this.candidateDetails.candidateId;
    this.searchConfig.limit = 10;
    // this.util.startLoader();
    this.loadAPIcall=true;

    this.api.create('candidates/findCandidatesResumeRequestedBy', this.searchConfig).subscribe(res => {
      this.loadAPIcall=false;
        if (res.code === '00000' && res.data && res.data.resumeRequestedByList) {
          // this.util.stopLoader();
            const newItems = res.data.resumeRequestedByList.filter(ele => {
                return !this.viewedList.some(item => item.jobId === ele.jobId);
            });

            newItems.forEach(ele => {
                ele.photo = null;
                if (ele.user && ele.user.photo != null) {
                    ele.photo = AppSettings.photoUrl + ele.user.photo;
                }

                let date = new Date(ele.activityDate);
                let current: any = new Date();
                ele.activityDate = this.util.dataconvert(current, date);

                if (ele.user && ele.user.userType) {
                    ele.user.userType = ele.user.userType.replaceAll("_", " ");
                }

                this.viewedList.push(ele);
            });

            // Pagination and stop scroll flag logic
            if (res.data.resumeRequestedByList.length === 0) {
                this.stopscrollFlag = true;
            } else if (res.data.resumeRequestedByList.length < 9) {
                this.stopscrollFlag = true;
            } else {
                this.searchConfig.pageNumber = this.searchConfig.pageNumber + 1;
                this.stopscrollFlag = false;
            }
        }else if(res.code === '00000'&&res.data==null){
          // this.util.stopLoader();
          this.loadAPIcall=false;
          this.emptymessage=true
        }
    });
}
  like(jobDetails: any) {
    if (jobDetails.jobPostedBy != localStorage.getItem('userId')) {
      if (jobDetails.isProcessingLike) {
        return;
      }

      jobDetails.isProcessingLike = true;

      let datas: any = {};
      if (jobDetails.isLiked == false || jobDetails.isLiked == null) {
        datas.likeStatus = "LIKE";
      } else if (jobDetails.isLiked == true) {
        datas.likeStatus = "UNLIKE";
      }
      datas.userId = localStorage.getItem('userId');
      datas.jobId = jobDetails.jobId;

      this.api.updatePut("jobs/updateJobLiked", datas).subscribe((res) => {
        jobDetails.likesCount = res.data.jobData.likesCount; // Update likesCount immediately
        jobDetails.isLiked = res.data.jobData.isLiked;
        jobDetails.isProcessingLike = false; // Re-enable the like button
        this.util.stopLoader();
      }, err => {
        jobDetails.isProcessingLike = false; // Re-enable the like button in case of error
        this.util.stopLoader();
      });

    }
  }
  onScrollDown() {
    if (this.stopscrollFlag == false) {
      this.getResumeRequests()
    }
  }


}
