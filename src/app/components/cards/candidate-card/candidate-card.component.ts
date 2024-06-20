import { HttpParams } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { AppSettings } from 'src/app/services/AppSettings';
import { CandidateService } from 'src/app/services/CandidateService';
import { FormValidation } from 'src/app/services/FormValidation';
import { GigsumoConstants } from 'src/app/services/GigsumoConstants';
import { ApiService } from 'src/app/services/api.service';
import { APPLICANT_STATUS } from 'src/app/services/gigsumoService';
import { JobService } from 'src/app/services/job.service';
import { JobModel } from 'src/app/services/jobModel';
import { SearchData } from 'src/app/services/searchData';
import { UtilService } from 'src/app/services/util.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { SocketService } from '../../../services/socket.service';
import { PricePlanService } from '../../Price-subscritions/priceplanService';
import { CreditModelComponent } from '../../credit/credit-model/credit-model.component';

@Component({
  selector: "app-candidate-card",
  templateUrl: "./candidate-card.component.html",
  styleUrls: ["./candidate-card.component.scss"],
})
export class CandidateCardComponent extends FormValidation implements OnInit {
  @Input() viewSize: any;
  @Input() passValues: any;
  @Input() showCheckBox: any;
  @Input() removeSelected: any;
  @Input() removeTag: any;
  @Input() From: "SUGGESTED_CANDIDATES" | "FEATURED_CANDIDATE" | "CANDIDATES_FROM_CONNECTION";
  @Input() candidatesFoundStatus: any;
  @Input() isRoutingDisabled: boolean = false;
  userId = localStorage.getItem("userId");
  appSettings: AppSettings;
  userType: any;
  removetagValueget: any;
  flag: boolean = true;
  filtersApplied: boolean = false;
  @Input() data: any;
  url = AppSettings.photoUrl;
  jobfilter: boolean = false;
  @Output() selectedCandidate: EventEmitter<any> = new EventEmitter();
  @Output() removeSeletedUser: EventEmitter<any> = new EventEmitter();
  dataget;
  checkcount: number = 0;
  checkedList: any = [];
  FormData: any;
  creditform: UntypedFormGroup;
  clickItemActive: any;
  showmodel = false;
  GigsumoConstant = GigsumoConstants;
  @Output() suggjob: EventEmitter<any> = new EventEmitter();
  bsModalRef: BsModalRef;
  @Input() candidateval: any;
  @Input() resumerequsetuser: any;
  @Input() selectedcandiCount: any;
  @Input() disabledCheckbox: boolean;
  @Input() showStatus: any;
  @Input() inviteapplyhide: any;
  @Input() datas: any;
  @Input() appliedJobDetails: JobModel;
  @Input() filterApplicantData: any;
  @Input() allowedJobCandidateCounts: number = 0;
  @Input() isDowngraded: boolean = false;
  JobModel;
  submited: boolean = false;
  Resurl = AppSettings.ServerUrl;
  jobId;
  jobTitle;
  jobPostedBehalfOf;
  postedByUserName;
  download = environment.serverUrl + "/download/";
  seletedChatItem;
  messageData: any;
  messagemodelflag: any;
  @Input() candidatesApplied: string;
  jobStatus: string = "";
  @Input() pageName: any;
  public envName: any = environment.name;
  checkingApplyButton: boolean = false;
  connectionStatus: string;
  connectionRequestRef: BsModalRef;
  values: any;
  counterpartsDetails: any;
  candidateSupplyRef: BsModalRef;
  isWait: boolean = false;
  hasCurrentOrganization: boolean = false;
  constructor(
    private apiService: ApiService,
    private _socket: SocketService,
    private searchData: SearchData,
    private modalService: BsModalService,
    private router: Router,
    private util: UtilService,
    private a_route: ActivatedRoute,
    private formBuilder: UntypedFormBuilder,
    private planService: PricePlanService,
    private candidateService: CandidateService,
    private JobServicecolor: JobService,
  ) {
    super();
    this.userId = localStorage.getItem("userId");
    if (this.a_route.snapshot.url[0] && this.a_route.snapshot.url[0].path) {
      this.checkingApplyButton = this.a_route.snapshot.url[0].path === "job-applicants";
    } else {
      this.checkingApplyButton = false;
    }
  }

  ngOnInit(): void {
    this.checkCurrentOrganization();
    this.creditform = this.formBuilder.group({
      point: [
        null,
        Validators.compose([
          Validators.required,
          Validators.pattern(/^-?(0|[1-9]\d*)?$/),
        ]),
      ],
    });
    this.userType = localStorage.getItem("userType");
    if (this.data != null) {
      this.flag = false;
    }


    this.jobStatus = this.appliedJobDetails && this.appliedJobDetails.status !== undefined
      ? this.appliedJobDetails.status
      : "";

    this.jobId = this.appliedJobDetails && this.appliedJobDetails.jobId;
    this.jobTitle = this.appliedJobDetails && this.appliedJobDetails.jobTitle;
    this.postedByUserName = this.appliedJobDetails && this.appliedJobDetails.postedByUserName;
    this.jobPostedBehalfOf = this.appliedJobDetails && this.appliedJobDetails.jobPostedBehalfOf;


    if (this.selectedcandiCount == undefined || this.selectedcandiCount == null) {
      this.selectedcandiCount = 1;
    }


  }

  triggerChange(candidateId: string) {

  }

  @ViewChild("connectionTemplate") connectionTemplate: TemplateRef<any>
  async downloadResume(data, userId, FileId) {

    const { candidateId, createdBy, resumeDownloaded,
      connectionStatus, user, ...rest } = data;

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
        // if (connectionStatus === "CONNECTED") {
           this.afterPlanValidationDownloadResume(candidateId, userId, createdBy, FileId);
        // }
        // else if (connectionStatus === "NOT_CONNECTED") {
        //   this.afterPlanValidationDownloadResume(candidateId, userId, createdBy, FileId);
          // to be used later
          // this.openConnectionTemplate({user:user , data , connectionStatus : connectionStatus} , this.connectionTemplate)
        //}
      }
    }
    else if (resumeDownloaded || createdBy === this.userId) {
      this.afterPlanValidationDownloadResume(candidateId, userId, createdBy, FileId);
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
  afterPlanValidationDownloadResume(candidateId: any, userId: any, createdBy: any, FileId: any) {
    let atag = document.createElement('a');
    atag.href = `${this.Resurl}candidates/resumeDownload/${candidateId}/${userId}/${createdBy}/${FileId}`;
    atag.click();
  }
  checkCurrentOrganization(): void {
    this.hasCurrentOrganization = this.candidateval?.user?.workExperience?.some(work => work?.currentOrganization) || false;
  }

  getInitials(fullname: string): string {
    return this.JobServicecolor.getInitials(fullname);
  }

  getColor(fullname: string): string {
    return this.JobServicecolor.getColor(fullname);
  }
  getInitialstwo(firstname: string, lastname: string): string {
    return this.JobServicecolor.getInitialsparam(firstname, lastname);
  }

  getColortwo(firstname: string, lastname: string): string {
    return this.JobServicecolor.getColorparam(firstname, lastname);
  }
  requestResume(value) {
    this.focus = 'resume';
    this.candidateData = value;
    var data: any = {};
    data.candidateId = value.candidateId;
    const jobId = this.appliedJobDetails&&this.appliedJobDetails.jobId || null;
    data.resumeRequestLogs = [
      { jobId:jobId, requestedBy: localStorage.getItem("userId") },
    ];
    this.util.startLoader();
    this.apiService
      .updatePut("candidates/updateResumeRequests", data)
      .subscribe(
        (res) => {
          if (res.code == "00000") {
            this.util.stopLoader();
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Resume request sent",
              showConfirmButton: false,
              timer: 2000,
            }).then(() => {
              value.resumeRequested = true;
            });
          }
        },
        (err) => {
          this.util.stopLoader();
        }
      );
  }

  filterApplicant(data: any) {


    if (this.filterApplicantData) {
      const arrs: Array<any> = [...this.filterApplicantData.JOB_APPLICATION_BUYER_ACTIONS.listItems];
      const order = arrs.find(_x => _x.itemId === data)!.order;
      const lastValue: Array<any> = [];
      //  for RECRUITER ACTION

      const finalData: Array<any> = arrs.reduce((acc: Array<any>, current, _index, arr) => {

        const isAllWait = arr.some(pp => pp.wait === true);

        const find = acc.find(_d => _d.itemId === current.itemId);
        const next = arr.indexOf(current);
        const offer = arr.filter(o => (o.order === undefined || o.order === null));

        if (find === undefined) {

          const nextData = arr[next + 1];

          if (nextData && current.item != null && data === current.itemId) {
            if ((nextData.item === undefined || nextData.item === null)) {
              this.isWait = true;
              return acc;
            }
            else if (nextData.item != undefined || nextData.item != null) {
              this.isWait = false;
              return acc;
            }
          }

          if (current && current.item != undefined && current.order != undefined) {
            acc.push(current);
          }
          else if (!lastValue.includes(offer) && (current.order === undefined || current.order === null)) {
            lastValue.push(...offer);
          }

          if (this.isWait) {
            acc = [];
            if (!acc.includes(offer)) {
              acc.push(...offer);
            }
          }
        }

        return acc;
      }, []);

      const final = finalData.filter(_x => _x.order > order);
      if (!this.isWait) {
        final.push(...lastValue);
      }


      return this.isWait ? finalData : final;
    }

    return null;
  }

  upgradeCandidate(item) {
    var profiledata: any = {};
    profiledata.userId = localStorage.getItem("userId");
    profiledata.userType = localStorage.getItem("userType");
    this.apiService
      .create("user/profileDetails", profiledata)
      .subscribe((res) => {
        //let element: any = {};


        // element = res.data.creditConsumptions.find(
        //   (item) => item.creditType === AppSettings.UPGRADE_CANDIDATE
        // );


        if (

          localStorage.getItem("userType") == "student" ||
          this.userType == "JOB_SEEKER"
        ) {
          this.util.startLoader();
          const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
              confirmButton: "btn btn-success",
              cancelButton: "btn btn-danger",
            },
            buttonsStyling: false,
          });

          swalWithBootstrapButtons
            .fire({
              title: "Upgrading a candidate will consume $2.99 per day",
              text: "Once upgraded, this candidate will be shown under the featured category and can be seen beyond your connections. Would you like to upgrade the candidate?",
              icon: "warning",
              showCancelButton: true,

              confirmButtonText: "Yes",
              cancelButtonText: "No",
              reverseButtons: true,
              allowOutsideClick: false,
            })
            .then((result) => {
              if (result.isConfirmed) {


                item.isFeatured = true;
                // item.points = element.points;
                // item.consumptionType = element.creditType;

                this.FormData = new FormData();
                item.candidateReferenceId = item.candidateId;

                this.FormData.append("resume", item.resume);
                this.FormData.append(
                  "candidate",
                  new Blob([JSON.stringify(item)], { type: "application/json" })
                );

                this.apiService
                  .updatePut("candidates/updateCandidate", this.FormData)
                  .subscribe(
                    (res) => {
                      this.util.stopLoader();
                      if (res.code == "00000") {

                        Swal.fire({
                          icon: "success",
                          title: "Upgraded Successfully",
                          // text: "This candidate will now on be shown under featured category, where it shall be seen by the candidates, bench sales, and talent acquisitions beyond your connections",
                          showDenyButton: false,
                          showConfirmButton: false,

                          timer: 2000,
                          // confirmButtonText: `ok`,
                          // timer: 3500,
                        });
                      }
                    },
                    (err) => {
                      this.util.stopLoader();
                    }
                  );
              }
            });
        } else {
          this.openModalWithComponent();
        }
      });
  }

  removecheckbox() {
    this.removeSeletedUser.emit(this.checkedList);
  }
  @Output() candidateEmitter = new EventEmitter<{ candidateId: any; flag: string }>();


  // from this component to job-applicant --> newjobscomponent --> activity candidate;
  @Output() jobapp_to_newjob_to_atvity = new EventEmitter<any>();

  flagcandidateId: string;
  selectedItem: any;
  selectCheckbox1(event, val) {
    this.flagcandidateId = val.candidateId;
    val.isSelected = event.target.checked;
    this.jobapp_to_newjob_to_atvity.emit(val);
    this.selectedItem = val.candidateId

  }


  onNgModelChange(event, val) {
    if (event == true) {
      this.candidateEmitter.emit({ candidateId: val, flag: "true" });
    } else if (event == false) {
      this.candidateEmitter.emit({ candidateId: val, flag: "false" });
    }

  }

  selectCheckbox() {
    this.a_route.queryParams.subscribe((res) => {
      this.getCheckedItemList();
      // var totalcredit = parseInt(res.creditPoints);
      // var points = parseInt(res.points);
      var found = this.passValues.filter((item) => item.isSelected === true);
      if (

        localStorage.getItem("userType") == "student" ||
        this.userType == "JOB_SEEKER"
      ) {
        this.passValues.every(function (item: any) {
          return item.isSelected == true;
        });
      } else {
        this.openModalWithComponent();
        return true;
      }
    });
  }

  openModalWithComponent() {
    const initialState: any = {
      backdrop: "static",
      keyboard: false,
      size: "open",
    };
    this.bsModalRef = this.modalService.show(CreditModelComponent, {
      initialState,
    });
    this.bsModalRef.content.closeBtnName = "Close";
    // let data:any={}; data.sufficient=true; this.router.navigate(["checkout"], { queryParams: data });
  }

  // Get List of Checked Items
  getCheckedItemList() {
    this.checkedList = [];
    for (var i = 0; i < this.passValues.length; i++) {
      if (this.passValues[i].isSelected) {
        this.checkedList.push(this.passValues[i]);
      }
    }

    this.checkedList = JSON.stringify(this.checkedList);
    this.selectedCandidate.emit(this.checkedList);
  }
  candidateData: any;
  focus: string;
  invite(values: any, connectionModal?: TemplateRef<any>, jobSupplyTemplate?: TemplateRef<any>) {
    this.candidateData = values;
    this.focus = 'candidate';
    // this.checkConnectionStatus(values)
    //   .subscribe(response => {
        //if (values.isFeatured == true) {
          this.proceedToInvite(values, jobSupplyTemplate);
       // } else if (values.isFeatured == false || values.isFeatured == null) {
          // if (response.data.connectionStatus === 'CONNECTED') {
          //   this.proceedToInvite(values, jobSupplyTemplate);
          // } else if (response.data.connectionStatus !== 'CONNECTED') {
          //   this.proceedToInvite(values, jobSupplyTemplate);
            // to be used later
            // this.openConnectionTemplate(response.data.connectionStatus, values, connectionModal);
          //}
      //  }
      //})
  }

  openConnectionTemplate(connectionStatus, values, connectionTempate?: TemplateRef<any>) {
    this.connectionStatus = connectionStatus;
    this.values = values;
    const initialState: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      size: 'sm',
    };
    this.apiService.query("user/" + this.values.createdBy).subscribe(res => {
      if (res.code == '00000') {
        this.counterpartsDetails = res;
        this.connectionRequestRef = this.modalService.show(connectionTempate, initialState);
      }
    })
  }

  checkConnectionStatus(values): Observable<any> {
    const apiURL = 'user/checkConnectionStatus';
    const params = new HttpParams()
      .set('userId', this.userId)
      .set('connnectorId', values.createdBy);

    const urlWithParams = `${apiURL}?${params.toString()}`;
    return this.apiService.query(urlWithParams);
  }

  async proceedToInvite(values, jobsupplytemplate) {
    const userData = await this.planService.UPDATE_USERDETAILS("ACTIVE_INTERACTIONS");
    if (userData.isExpired) {
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
      // this.planService.expiredPopup("ACTIVE_INTERACTIONS",);
      return;
    }
    values.userId = localStorage.getItem('userId');
    values.candidatefilter = true;
    values.getResume = false;
    // values.userType = values.user.userType;
    values.userType = values.user ? values.user.userType : null;
    const config: ModalOptions = { class: 'modal-lg', backdrop: 'static', keyboard: false };
    this.candidateSupplyRef = this.modalService.show(jobsupplytemplate, config);
  }

  afterValidatingPlan(values: any) {
    values.userId = localStorage.getItem("userId");
    values.candidatefilter = true;
    values.userType = values.user.userType;
    this.router.navigate(["newjobs"], { queryParams: values });
  }


  backdropConfig = {
    backdrop: true,
    ignoreBackdropClick: true,
    keyboard: false,
    // scroll
  };
  modalRef: BsModalRef;
  closemodel() {
    this.modalRef.hide();
  }
  purchesCredits(buyCredit: TemplateRef<any>) {
    this.modalRef.hide();
    this.modalRef = this.modalService.show(buyCredit, this.backdropConfig);
  }
  get credit() {
    return this.creditform.controls;
  }
  buycredit(id) {
    this.submited = true;
    if (id != "noval") {
      this.creditform.patchValue({ point: id });
    }
    if (this.creditform.valid) {
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: "btn btn-success",
          cancelButton: "btn btn-danger",
        },
        buttonsStyling: false,
      });

      swalWithBootstrapButtons
        .fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "info",
          showCancelButton: true,
          confirmButtonText: "Yes",
          cancelButtonText: "No",
          reverseButtons: true,
        })
        .then((result) => {
          if (result.isConfirmed) {
            if (this.creditform.valid) {
              this.submited = false;
              let data: any = {};
              (data.userId = localStorage.getItem("userId")),
                //(data.totalPoints = this.creditform.value.point);
                this.util.startLoader();
              this.apiService.create("credits/buyCredits", data).subscribe(
                (res) => {
                  this.util.stopLoader();
                  this.creditform.reset();
                  this.modalRef.hide();
                  this.showmodel = false;

                  if (res.code == "00000") {
                    Swal.fire({
                      icon: "success",
                      title: "Credit Added Successfully",
                      showDenyButton: false,
                      // confirmButtonText: `ok`,
                      showConfirmButton: false,

                      timer: 2000,
                    });
                    this.creditform.reset();
                  }
                },
                (err) => {
                  this.util.stopLoader();
                }
              );
            } else if (this.creditform.invalid) {
              this.submited = true;
            }
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            this.creditform.reset();
          }
        });
    }
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
    if (values.createdBy != localStorage.getItem("userId")) {
      let datas: any = {};
      datas.candidateId = values.candidateId;
      datas.userId = localStorage.getItem("userId");

      const likeStatus = values.isLiked === true ? "UNLIKE" : "LIKE";

      this.util.startLoader();
      datas.likeStatus = likeStatus;

      this.apiService.updatePut("candidates/updateCandidateLiked", datas).subscribe((res) => {
        if (res.code == "00000") {
          this.util.stopLoader();
          this.candidateval.isLiked = res.data.candidateData.isLiked;
          this.candidateval.likesCount = res.data.candidateData.likesCount;
        }
      });
    }else{
      this.goTo(values, 'Clike-like')
    }
  }

  goTo(values: any, param) {
    if (values.createdBy == this.userId) {
      if (param == "jobsApplied") {
        this.router.navigate(['newcandidates'], { queryParams: { candidateId: values.candidateId, tabName: 'jobsApplied', From: this.From } })
      } else if (param == "views") {
        this.router.navigate(['newcandidates'], { queryParams: { candidateId: values.candidateId, tabName: 'views', From: this.From } })

      } else if (param == "Clike-like") {
        this.router.navigate(['newcandidates'], { queryParams: { candidateId: values.candidateId, tabName: 'Clike-like', From: this.From } })

      } else if (param == "cInvited" && values.interestShownCount > 0) {
        this.router.navigate(['newcandidates'], { queryParams: { candidateId: values.candidateId, tabName: 'cInvited', From: this.From } })

      }
    } else if (values.createdBy != this.userId) {
      if (param == "jobsApplied") {
        this.router.navigate(['newcandidates'], { queryParams: { candidateId: values.candidateId, tabName: 'profileSummary', From: this.From } })
      } else if (param == "views" && values.viewedByCount > 0) {
        this.router.navigate(['newcandidates'], { queryParams: { candidateId: values.candidateId, tabName: 'profileSummary', From: this.From } })
      } else if (param == "cInvited" && values.interestShownCount > 0) {
        this.router.navigate(['newcandidates'], { queryParams: { candidateId: values.candidateId, tabName: 'profileSummary', From: this.From } })
      }
    }
  }

  async open(values: any) {

    // const userData =
    //   await this.planService.UPDATE_USERDETAILS("RESUME_VIEWS");
    if (values.createdBy != this.userId && !values.isViewed) {
      // if (userData.isExpired) {
      //   let availablePoints = null;
      //   let actualPoints = null;
      //   let utilizedPoints = null;
      //   userData.userDetail.userPlanAndBenefits.benefitsUsages.forEach(ele => {
      //     if (ele.benefitKey == 'RESUME_VIEWS') {
      //       availablePoints = ele.available
      //       actualPoints = ele.actual
      //       utilizedPoints = ele.utilized
      //     }
      //   })
      //   this.planService.expiredPopup("RESUME_VIEWS", "PAY", null, null, null, availablePoints, actualPoints, utilizedPoints);

      //   return;
      // } else {
      this.updateCandidateView(values);
      //}
    }
    else {
      this.router.navigate(["newcandidates"], { queryParams: { candidateId: values.candidateId, tabName: 'profileSummary', From: this.From } });
    }
  }

  updateCandidateView(values: any) {
    this.util.startLoader();
    this.candidateService.updateCandidateViewed(values).subscribe((res) => {
      this.util.stopLoader();
      if (res.code === "00000") {
        this.router.navigate(["newcandidates"], { queryParams: { candidateId: values.candidateId, tabName: 'profileSummary', From: this.From } });
      }
    },
      (err) => {
        this.util.stopLoader();
      });
  }

  isExcludedStatus(status: string): boolean {
    if (this.filterApplicantData) {
      const find = this.filterApplicantData.JOB_APPLICATION_BLOCKING_ACTIONS.listItems &&
        this.filterApplicantData.JOB_APPLICATION_BLOCKING_ACTIONS.listItems.find(x => x.itemId === status);
      return find ? true : false;
    }
  }

  updatestatus(datas, value) {

    this.util.startLoader();
    var data: any = {};
    data.jobId = this.jobId;
    data.candidateId = value.candidateId;
    data.currentStatus = datas.itemId;
    data.candidateName = this.candidateval.firstName + " " + this.candidateval.lastName;
    data.jobTitle = this.jobTitle;
    data.createdByUserName = this.postedByUserName;
    data.createdBy = value.createdBy;
    data.email = this.candidateval.user.email;
    value.currentStatus = datas.itemId;
    this.jobupdatestatus(data);
  }

  async jobupdatestatus(data) {
    try {
      this.util.startLoader();
      const res = await this.apiService.create("candidates/updatejobAppliedStatus", data).toPromise();
      this.util.stopLoader();
      if (res.code === "00000") {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Status successfully Updated.",
          showConfirmButton: false,
          timer: 2000,
        });
        data.eachCandidate = true;
        this.searchData.setJobID(data);
        data.isSelected = true;
        this.jobapp_to_newjob_to_atvity.emit(data);
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
    } catch (err) {
      this.util.stopLoader();

    }
  }




  getStyle(status: APPLICANT_STATUS) {
    const find = this.APPLICANT_STATUS_COLOR.find(p => p.key === status);
    return find ? { background: find.color } : null;
  }

  getFilterValue(key: string, content: string = "JOB_APPLICANT") {
    if (this.filterApplicantData) {
      const arrs: Array<any> = content === "JOB_APPLICANT" ? [...this.filterApplicantData.JOB_APPLICATION_BUYER_ACTIONS.listItems] :
        [...this.filterApplicantData.JOB_INVITATION_SUPPLIER_ACTIONS.listItems];
      if (arrs) {
        const find = arrs.find(c => c.itemId === key);
        return find ? find.value : null;
      }
    }
  }


  chatuser(seletedItem: any, connectionModal?: TemplateRef<any>) {

    this.candidateData = seletedItem;
    this.focus = 'candidate';
    if (seletedItem.createdBy == this.userId) {
      this.openMessage(seletedItem)
    }
    this.checkConnectionStatus(seletedItem)
      .subscribe(response => {
        if (seletedItem.isFeatured != undefined && seletedItem.isFeatured == true) {
          this.openMessage(seletedItem)
        } else if (seletedItem.isFeatured == false || seletedItem.isFeatured == undefined && seletedItem.createdBy != this.userId) {
          //if (response.data.connectionStatus === 'CONNECTED') {
            this.openMessage(seletedItem);
          //} else if (response.data.connectionStatus !== 'CONNECTED') {
           // this.openMessage(seletedItem);
            // to be used later
            // this.openConnectionTemplate(response.data.connectionStatus, seletedItem, connectionModal);
          //}
        }
      })
  }

  openMessage(seletedItem) {
    this.messagemodelflag = false;
    // this._socket.ngOnDestroy();
    // this._socket.connections();

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

  closeMessage(event) {
    this.messagemodelflag = false;
    // this._socket.ngOnDestroy();
  }
}










