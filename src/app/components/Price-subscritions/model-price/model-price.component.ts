import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/services/UserService';
import { ApiService } from 'src/app/services/api.service';
import { JobModel, profileinput } from 'src/app/services/jobModel';
import { StreamService } from 'src/app/services/stream.service';
import { UtilService } from 'src/app/services/util.service';
import Swal from 'sweetalert2';
import { BENEFITS_KEY, ExpiryModel, PayAsYouGoModel, PricePlanService } from '../priceplanService';
import { SearchData } from './../../../services/searchData';
@Component({
  selector: 'app-model-price',
  templateUrl: './model-price.component.html',
  styleUrls: ['./model-price.component.scss'],
  inputs: ["ModelContent", "content", "modalName", "upgradeDetails", "currentdate", "featureddate", "availablecredits", "actualcredits", "utilizedcredits", "promotional"]
})
export class ModelPriceComponent implements OnInit {
  streamRes: any = null;
  clickEventsubscription: Subscription;

  constructor(private modalService: BsModalService, private route: Router, private userService: UserService,
    private pricePlan: PricePlanService, private stremService: StreamService, private http: HttpClient, private api: ApiService, private searchData: SearchData, private util: UtilService, private formBuilder: UntypedFormBuilder) {
    this.clickEventsubscription = this.stremService.getstreamResponse().subscribe((res) => {
      this.streamRes = res;
    });
  }
  FormData: any;
  modalRef: BsModalRef;
  yearmonth: boolean = false;
  profileDetailResponse: any;
  messageShow = false;
  submitted = false;
  content: BENEFITS_KEY;
  ModelContent: PayAsYouGoModel | ExpiryModel | any;
  modalName: "UPGRADE" | "PAY";
  upgradeDetails: JobModel;
  currentdate: profileinput;
  featureddate: profileinput;
  availablecredits: profileinput;
  promotional: profileinput;
  actualcredits: profileinput;
  utilizedcredits: profileinput;
  CreditConsumePoints: String;
  PlanConsumePoints: String;
  @Input() passValues: any;
  modelOpened
  points: any = [];


  dynamicMessage: string;
  dynamicTitle: string;
  @Output() selectedJob: EventEmitter<any> = new EventEmitter()
  @Output() jobReload = new EventEmitter<any>();
  @Output() candidateReload = new EventEmitter<any>()
  selectedValue: String;
  clearSelectedValues: boolean = false;
  selectedDay: number;

  upgradeForm: UntypedFormGroup;
  MemberShipType = localStorage.getItem("MemberShipType");
  @ViewChild("modalTemplate", { static: true }) modalPriceTemplate: TemplateRef<any>;
  @ViewChild("upgradejob", { static: true }) upgradePriceTemplate: TemplateRef<any>;
  backdropConfig: ModalOptions = {
    backdrop: true,
    ignoreBackdropClick: true,
    keyboard: true,

    // scroll
  };




  async ngOnInit() {
    this.CreditConsumePoints = await this.getPoints(this.content);
    this.selectedValue = 'redeemsumocredits';
    if (this.modalName === "PAY") {
      this.modalRef = this.modalService.show(this.modalPriceTemplate, this.backdropConfig);
    }
    else {
      if (this.ModelContent.headerName != undefined) {
        this.modalRef = this.modalService.show(this.upgradePriceTemplate, this.backdropConfig);
        this.upgradefunction();
        this.upgradeForm.get('upgradefor').patchValue(this.ModelContent.headerName);
      }

    }
  }
  showdays: any
  upgradefunction() {
    this.upgradeForm = this.formBuilder.group({
      payasyogo: [''],
      availablesumocredits: [''],
      acceptTerms: [false, Validators.requiredTrue],
      points: [null],
      redeemsumocredits: [''],
      upgradefor: [''],
      limit: ['', [Validators.required]],
      paylimit: ['', [Validators.required]],
      rateperday: [this.CreditConsumePoints],
      price: [null],
    });

    const price = this.upgradeForm.get('rateperday').value;
    this.upgradeForm.patchValue({ 'availablesumocredits': this.availablecredits })
    this.showdays = this.availablecredits;
    this.upgradeForm.get('limit').valueChanges.subscribe((selectedValue) => {
      if (selectedValue !== undefined) {
        const redeem = selectedValue * 25;
        this.upgradeForm.get('points').patchValue(redeem);
      } else if (selectedValue == undefined) {
        this.upgradeForm.get('points').patchValue(null);
      }
    });
    this.upgradeForm.get('paylimit').valueChanges.subscribe((selectedValue) => {
      if (selectedValue !== undefined) {
        const totalAmount = selectedValue * price;
        const fixedValue = totalAmount.toFixed(2);
        this.upgradeForm.get('price').patchValue(fixedValue);
      } else if (selectedValue == undefined) {
        this.upgradeForm.get('price').patchValue(null);
      }
    });
    if (this.selectedValue == 'redeemsumocredits') {

      this.days = Array.from({ length: this.showdays / 25 }, (_, index) => index + 1);
    }

  }



  days: number[] = Array.from({ length: 30 }, (_, i) => i + 1);
  get isInduvidual(): boolean {
    return this.MemberShipType === "Free" || this.MemberShipType === "Team";
  }

  userData = {
    userId: localStorage.getItem('userId'),
    userType: localStorage.getItem('userType')
  }


  onItemChange(selectedValue: string) {
    this.selectedValue = selectedValue;
    if (this.selectedValue == 'payasyogo') {
      this.days = Array.from({ length: 30 }, (_, i) => i + 1);
    } else {
      this.days = Array.from({ length: this.showdays / 25 }, (_, index) => index + 1);
    }
    if (this.clearSelectedValues) {
      this.selectedDay = null;
      this.submitted = false;
    }

    return this.selectedValue;
  }

  isPayAsYouGo(val: BENEFITS_KEY): boolean {
    return (val === "ACTIVE_INTERACTIONS" ||
      val === "UPGRADE_CANDIDATES" || val === "UPGRADE_JOBS");
  }

  async getPoints(key: BENEFITS_KEY): Promise<String> {
    this.util.startLoader();
    let planDetails = await this.pricePlan.getPlan_Features();
    const { businessPlans, individualPlans } = planDetails.data;
    this.util.stopLoader();
    if (this.isPayAsYouGo(key)) {
      let ResumeData = (this.isInduvidual ? individualPlans : businessPlans).find(val => val.subcriptionType === this.MemberShipType);
      let upgradeData = (this.isInduvidual ? individualPlans : businessPlans).find(val => val.order === (ResumeData && ResumeData.order + 1));
      if (upgradeData != undefined) {
        this.PlanConsumePoints = upgradeData.monthlySubscriptionAmount;
      }

      return ResumeData.payAsYouGoList.find(element => (element.benefitKey as string).includes(key)).price;
    } else {
      let data = (this.isInduvidual ? individualPlans : businessPlans).find(val => val.subcriptionType === this.MemberShipType);
      let upgradeData = (this.isInduvidual ? individualPlans : businessPlans).find(val => val.order === (data && data.order + 1));
      if (upgradeData != undefined) {
        this.PlanConsumePoints = upgradeData.monthlySubscriptionAmount;
      }
      return null;
    }

  }


  close() {
    this.modalRef.hide();
    this.modalService.hide(1);
    this.submitted = false;
    if (this.upgradeForm != undefined) {
      this.upgradeForm.reset();
    }

  }

  routeToPlan() {
    this.close();
    this.route.navigate(['plan-quota']);
  }

  open(content) {
    this.modalRef = this.modalService.show(this.modalPriceTemplate, this.backdropConfig);
  }


  upgradePlan() {
    this.modalRef.hide();
    this.modalService.hide(1);
    this.route.navigate(["plan-quota"]);
  }

  closemodel() {
    this.modalRef.hide();
    // this.modaZlService.hide(1);
  }



  plan(val) {
    this.yearmonth = val

  }
  pricesummary() {
    const userId = localStorage.getItem("userId");
    this.api
      .query("user/findUserPlanBenefits/" + userId)
      .subscribe((res) => {

        console.log("res" + res);

      }, err => {
        this.util.stopLoader();
      });
  }
  sortDate(data) {
    return data.sort((a, b) => {
      return b.isFeatured - a.isFeatured;
    });
  }
  upgradeCandidate(upgradeDetails) {
    this.FormData = new FormData();
    this.FormData.append("resume", upgradeDetails.resume);
    upgradeDetails.candidateReferenceId=upgradeDetails.candidateId;
    this.FormData.append("candidate", new Blob([JSON.stringify(upgradeDetails)], { type: "application/json" }));
    this.util.startLoader()
    this.api.updatePut("candidates/updateCandidate", this.FormData).subscribe((res) => {
      this.util.stopLoader();
      if (res.code == '00000') {
        if (this.modalService && this.modalRef) {
          this.modalRef.hide();
          this.modalService.hide(1);
        }
        this.searchData.setfilterReload("reload")
        Swal.fire({
          icon: "success",
          title: "Upgraded Successfully",
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

  featurejob(item) {
   item.jobReferenceId=item.jobId;
    this.api.updatePut("jobs/updateJob", item).subscribe((res) => {
      if (this.passValues != undefined) {
        this.passValues.forEach(ele => {
          if (item.jobId == ele.jobId) {
            ele.updatedOn = res.data.jobData.updatedOn;
            this.sortDate(this.passValues);
          }
        });
      }

      if (this.streamRes != null && this.streamRes.code == '00000') {
        this.stremService.clear();
      }
      this.util.stopLoader();
      if (res.code == '00000') {
        if (this.modalService && this.modalRef) {
          this.modalRef.hide();
          this.modalService.hide(1);
        }
        Swal.fire({
          icon: "success",
          title: "Job Upgraded",
          showDenyButton: false,
          showConfirmButton: false,
          timer: 2000,
        })

        this.selectedJob.emit(null);
        this.jobReload.emit("reload");

      }
    }, err => {
      this.util.stopLoader();
    });
  }
  generateTitleHtml(action: string, Noofdays: any, pointsOrPrice: any): string {
    const dayText = Noofdays === 1 ? 'day' : 'days';
    return `<div>${action} for ${Noofdays} ${dayText} will consume ${pointsOrPrice} credits</div>`;
}

  updatedDate: string;
  upgradejobandcandidatedetails(upgradeDetails, param, currentdate, featureddate) {

    if (param == "") {
      currentdate = this.currentdate;
      featureddate = this.featureddate;
    }
    let titleHtml, secondtitile;
    let action = '';
    if (this.ModelContent && this.ModelContent.headerName === 'Upgrade Candidate') {
      action = 'Upgrading a candidate';
    } else if (this.ModelContent && this.ModelContent.headerName === 'Upgrade Job') {
      action = 'Upgrading a Job';
    }
    if (this.selectedValue === 'redeemsumocredits' || this.selectedValue === 'payasyogo') {
      const pointsOrPrice = this.selectedValue === 'redeemsumocredits' ? this.upgradeForm.get('points').value : this.upgradeForm.get('price').value;
      const Noofdays=this.selectedValue === 'redeemsumocredits' ? this.upgradeForm.get('limit').value : this.upgradeForm.get('paylimit').value;
      titleHtml = this.generateTitleHtml(action,Noofdays, pointsOrPrice);
    }

    if (upgradeDetails.isFeatured == false && param == 'Upgrade Candidate') {
      secondtitile = 'You will not be charged for this Candidate again for the day as it has already been paid for.';
    } else if (upgradeDetails.isFeatured == false && param == 'Upgrade Job') {
      secondtitile = 'You will not be charged for this job again for the day as it has already been paid for.';
    }
    if (param == "") {
      if (upgradeDetails.isFeatured != false && this.ModelContent.headerName == 'Upgrade Candidate' || upgradeDetails.isFeatured == false && this.ModelContent.headerName == 'Upgrade Candidate' && currentdate > featureddate) {
        this.dynamicMessage = 'Once upgraded, this candidate will be shown under the featured category and can be seen beyond your connections. Would you like to upgrade the candidate?';
      } else if (upgradeDetails.isFeatured != false && this.ModelContent.headerName == 'Upgrade Job' || upgradeDetails.isFeatured == false && this.ModelContent.headerName == 'Upgrade Job' && currentdate > featureddate) {
        this.dynamicMessage = 'Once upgraded,this job will be shown under the featured category and can be seen beyond your connections.  Would you like to upgrade the job?';
      }
    }

    if (upgradeDetails.isFeatured == true || currentdate == featureddate) {
      upgradeDetails.price = 0;
      upgradeDetails.points = 0;
    } else if (currentdate > featureddate && upgradeDetails.isFeatured == false || upgradeDetails.isFeatured == null || upgradeDetails.isFeatured == undefined) {
      if (this.upgradeForm != undefined) {
        upgradeDetails.price = this.upgradeForm.get('price').value;
        upgradeDetails.points = this.upgradeForm.get('points').value;
      }
    }

    if (upgradeDetails.isFeatured == undefined || currentdate > featureddate && upgradeDetails.isFeatured == false) {

      const swalWithBootstrapButtons = Swal.mixin({
        customClass: { confirmButton: 'btn btn-success', cancelButton: 'btn btn-danger' },
        buttonsStyling: false
      })
      swalWithBootstrapButtons.fire({
        title: titleHtml,
        text: this.dynamicMessage,
        icon: "warning",
        showCancelButton: true,
        allowOutsideClick: false,
        allowEscapeKey: false,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed && this.ModelContent.headerName == 'Upgrade Job') {
          upgradeDetails.isFeatured = true;
          upgradeDetails.limit = this.upgradeForm.get('limit').value;
          if (upgradeDetails.limit == undefined) {
            upgradeDetails.limit = this.upgradeForm.get('paylimit').value;
          }
          this.featurejob(upgradeDetails);
        } else if (result.isConfirmed && this.ModelContent.headerName == 'Upgrade Candidate') {
          upgradeDetails.isFeatured = true;
          upgradeDetails.limit = this.upgradeForm.get('limit').value;
          if (upgradeDetails.limit == undefined) {
            upgradeDetails.limit = this.upgradeForm.get('paylimit').value;
          }
          this.upgradeCandidate(upgradeDetails)
        }
      });
    } else if (upgradeDetails.isFeatured == false) {

      const swalWithBootstrapButtons = Swal.mixin({
        customClass: { confirmButton: 'btn btn-success', cancelButton: 'btn btn-danger' },
        buttonsStyling: false
      })
      swalWithBootstrapButtons.fire({
        title: secondtitile,
        text: this.dynamicMessage,
        icon: "warning",
        showCancelButton: true,
        allowOutsideClick: false,
        allowEscapeKey: false,
        confirmButtonText: 'Ok',
        cancelButtonText: 'No',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed && param == 'Upgrade Job') {
          upgradeDetails.isFeatured = true;
          this.upgradefunction();
          upgradeDetails.limit = this.upgradeForm.get('limit').value;
          if (upgradeDetails.limit == undefined) {
            upgradeDetails.limit = this.upgradeForm.get('paylimit').value;
          }
          this.featurejob(upgradeDetails);
        } else if (result.isConfirmed && param == 'Upgrade Candidate') {
          upgradeDetails.isFeatured = true;
          this.upgradefunction();
          upgradeDetails.limit = this.upgradeForm.get('limit').value;
          if (upgradeDetails.limit == undefined) {
            upgradeDetails.limit = this.upgradeForm.get('paylimit').value;
          }
          this.upgradeCandidate(upgradeDetails)
        }
      });

    }

  }
  redeemthecredits(upgradeDetails) {
    this.submitted = true;
    if (this.selectedValue == 'redeemsumocredits') {
      this.upgradeForm.get('paylimit').clearValidators();
      this.upgradeForm.get('paylimit').updateValueAndValidity();
    } else if (this.selectedValue == 'payasyogo') {
      this.upgradeForm.get('limit').clearValidators();
      this.upgradeForm.get('limit').updateValueAndValidity();
    }
    if (this.selectedValue == 'redeemsumocredits' && this.upgradeForm.value.acceptTerms && this.upgradeForm.valid && this.upgradeForm.get('points').value != 0) {
      this.upgradejobandcandidatedetails(upgradeDetails, '', '', '');
    } else if (this.selectedValue == 'payasyogo' && this.upgradeForm.value.acceptTerms && this.upgradeForm.valid && this.upgradeForm.get('price').value != 0.00) {
      this.upgradejobandcandidatedetails(upgradeDetails, '', '', '');
    }

  }
}

