import { HttpClient } from '@angular/common/http';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { loadStripe } from '@stripe/stripe-js';
import { Gtag } from 'angular-gtag';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { CustomValidator } from 'src/app/components/Helper/custom-validator';
import { PlanDowngradeModelComponent } from 'src/app/components/plan-downgrade-model/plan-downgrade-model.component';
import { AppSettings } from 'src/app/services/AppSettings';
import { FormValidation } from 'src/app/services/FormValidation';
import { GigsumoConstants } from 'src/app/services/GigsumoConstants';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { PricePlanService } from '../../priceplanService';
import { Benefits, SubscriptionFeatures, SubscriptionPlans } from './../../../../services/userModel';
interface CustomModalOptions extends ModalOptions {
  data?: any
}
@Component({
  selector: 'app-plan-quota',
  templateUrl: './plan-quota.component.html',
  styleUrls: ['./plan-quota.component.scss']
})
export class PlanQuotaComponent extends FormValidation implements OnInit {
  active = 1;
  Plan: boolean = false;
  screendata: boolean = false;
  currentEntity: any;
  response = [];
  header: string;
  public FORMERROR = super.Form;
  featurelists: Array<SubscriptionFeatures>;
  individualPlans: any;
  businessPlans: any;
  individualPlansWiseSubscriptionFeatures: Array<SubscriptionFeatures>;
  businessPlansWiseSubscriptionFeatures: Array<SubscriptionFeatures>;
  catagories: Benefits;
  SubsciptionLists: Array<SubscriptionPlans>;
  userId: string = localStorage.getItem('userId');
  MemberShipType = localStorage.getItem("MemberShipType");
  stripePromise = loadStripe(AppSettings.stripekey);
  public lamdaurl: any = environment.LAMDA_URL;
  contactUs: UntypedFormGroup;
  isSubmitted = false;
  isFormDirty = false;
  duplicatedata = false;
  TeamPlan
  constructor(private modalService: BsModalService,
    private fb: UntypedFormBuilder,
    private http: HttpClient,
    private api: ApiService,
    private util: UtilService,
    private pricePlanService: PricePlanService,
    private route: Router,
    private gtag: Gtag) {
    super();
  }
  async ngOnInit() {
    this.TeamPlan = environment.PaymentmonthSub + '?prefilled_email=' + localStorage.getItem('userName');
    this.plansandfeatures();
    this.ContactUsForm()
  }
  countries: any[] = [];
  getCountry() {
    this.api.query("country/getAllCountries").subscribe((res: any[]) => {
      if (res) {
        this.countries = res; // Assign response directly to countries array
      }
    }, err => {
      console.error(err); // Log any errors
    });
  }
  ContactUsForm() {
    this.contactUs = this.fb.group({
      firstName: [null, [Validators.required, Validators.pattern(this.FIRST_Name.pattern), CustomValidator.max(this.FIRST_Name.max,), CustomValidator.checkWhiteSpace()]],
      lastName: [null, [Validators.required, Validators.pattern(this.LAST_NAME.pattern), CustomValidator.max(this.LAST_NAME.max), CustomValidator.checkWhiteSpace()]],
      workEmail: [null, [Validators.required, Validators.email, CustomValidator.max(this.EMAIL.max),
      Validators.pattern(this.EMAIL.pattern)]],
      phone: [null, [Validators.required, Validators.pattern(this.PHONE.pattern), CustomValidator.minmaxLetters(this.PHONE.min, this.PHONE.max)]],
      companyName: [null, [Validators.required, Validators.minLength(5)]],
      companySize: [null, Validators.required],
      country: [null, Validators.required],
      subject: 'SALE'
    });
  }
  get f() {
    return this.contactUs.controls;
  }
  closeModel() {
    this.modalRef.hide()
    this.contactUs.reset();
  }
  onSubmit() {
    this.isSubmitted = true;
    this.contactUs.markAllAsTouched();
    if (this.contactUs.valid) {
      this.contactUs.value.subject = "SALE"
      this.apicall()
    } else if (this.contactUs.invalid) {
      return;
    }
  }
  apicall() {
    const URL = environment.LAMDA_URL_temp_contactus;
    var myHeaders = new Headers();
    let data = this.contactUs.value;
    data.source = "App";
    var raw = JSON.stringify(data);
    let requestOptions: any = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    this.duplicatedata = true;
    this.util.startLoader();
    fetch(URL, requestOptions)
      .then(response => response.json())
      .then(result => {
        this.util.stopLoader();
        this.duplicatedata = false;
        Swal.fire({
          icon: 'success',
          title: 'Thank you for contacting us!',
          text: 'One of our Customer Success managers will get in touch with you shortly.',
          showConfirmButton: false,
          allowEscapeKey: false,
          allowOutsideClick: false,
          timer: 2000,
        });
        this.modalService.hide(1);
        this.contactUs.reset()
      })
      .catch(error => {
        this.util.stopLoader()
        this.duplicatedata = false;
        console.log('error', error)
      });
  }
  async plansandfeatures() {
    this.screendata = false;
    // this.util.startLoader();
    let planResponse: any = await this.pricePlanService.getPlan_Features();
    this.catagories = planResponse.data.benefitsMasters;
    this.individualPlans = planResponse.data.individualPlans;
    this.businessPlans = planResponse.data.businessPlans;
    this.individualPlans.forEach(element => {
      element.selected = true;
    });
    this.businessPlans.forEach(element => {
      element.selected = true;
    });
    this.individualPlansWiseSubscriptionFeatures = planResponse.data.individualPlansWiseSubscriptionFeatures;
    this.businessPlansWiseSubscriptionFeatures = planResponse.data.businessPlansWiseSubscriptionFeatures;
    this.featurelists = planResponse.data.individualPlans;
    this.screendata = true;
    this.selectMenu('Individualplan');
    // this.util.stopLoader();
  }
  modalRef: BsModalRef;
  openmodel(template: TemplateRef<any>) {
    const config: ModalOptions = { backdrop: 'static', keyboard: false };
    this.modalRef = this.modalService.show(template, config);
    this.getCountry()
  }
  handleButtonClick(event: MouseEvent, item) {
    if (item.subcriptionType == 'Team' && this.MemberShipType != 'Team') {
      window.location.href = this.TeamPlan;
    }
  }
  pay(item, template) {
    if (item.subcriptionType != "Business" && item.subcriptionType != "Enterprise") {
      if (this.Plan == true) {
        this.TeamPlan = environment.PaymentYearSub + '?prefilled_email=' + localStorage.getItem('userName');
      } else {
        this.TeamPlan = environment.PaymentmonthSub + '?prefilled_email=' + localStorage.getItem('userName');
      }
      return `${this.TeamPlan}`;
    } else {
      this.openmodel(template);
      return false;
    }
    // if(item.subcriptionType=="Business" || item.subcriptionType=="Enterprise"){
    //   this.openmodel(template);
    //  }else{
    //   if(item.subcriptionType==this.MemberShipType){
    //     Swal.fire("", `${this.UPGRADE_USER}`, "info");
    //     return;
    //    }
    //   if (this.Plan == true) {
    //     item.amount = item.annualSubscriptionAmount * 100
    //     item.billType = "Annually"
    //   } else {
    //     item.amount = item.monthlySubscriptionAmount * 100
    //     item.billType = "Monthly"
    //   }
    //   let payment: any = {
    //     name: 'Purchasing Plan : ' + item.subcriptionType,
    //     currency: 'usd',
    //     point: 50,
    //     sourceId: 50,
    //     plan: item.subcriptionType,
    //     billType: item.billType,
    //     amount: item.amount,
    //     userId: this.userId,
    //     quantity: 1,
    //     cancelUrl: 'http://localhost:4200/cancel',
    //     successUrl: 'http://localhost:4200/success',
    //   };
    //   this.util.startLoader()
    //    const stripe = await this.stripePromise;
    //     var myHeaders = new Headers();
    //     myHeaders.append("Content-Type", "application/json");
    //     var raw = JSON.stringify(payment);
    //     let requestOptions:any = {
    //       method: 'POST',
    //       headers: myHeaders,
    //       body: raw,
    //       redirect: 'follow'
    //     };
    //     fetch(this.lamdaurl+'payment/createCheckout', requestOptions)
    //       .then(response => response.json())
    //       .then(result => {
    //         this.util.stopLoader()
    //          stripe.redirectToCheckout({
    //           sessionId: result.data.sessionID,
    //        });
    //       })
    //       .catch(error => {
    //         this.util.stopLoader()
    //         console.log('error', error)
    //       });
    // }
  }
  plan(plan) {
    this.Plan = plan;
  }
  upgrade(url: string) {
    this.apicallforDowngrade(url);
  }
  entityCountConfig: any = {
    allowedJobsCandidatesCount: 0,
    allowedContactsCount: 0,
    allowedWorkspaceCount: 0,
    allowedInteractionsCount: 0,
    allowedNetworksCount: 0,
    modalTitle: '',
    isPromotional: false,
    isDowngraded: false,
    isUpgrading: false,
    showClosButton: true
  }
  bsModalRef: BsModalRef;
  openModals(planBenefits: any) {
    this.entityCountConfig.planBenefits = planBenefits
    const initialState: CustomModalOptions = {
      keyboard: false,
      backdrop: 'static',
      class: 'modal-lg',
      ignoreBackdropClick: true,
      data: this.entityCountConfig
    }
    this.bsModalRef = this.modalService.show(PlanDowngradeModelComponent,
      Object.assign({ initialState }, initialState)
    );
    this.bsModalRef.content.closeBtnName = 'Close';
  }
  userType = localStorage.getItem('userType');
  async apicallforDowngrade(url: string) {
    this.util.startLoader();
    let planbenefits: any = await this.api.lamdaFunctionsget('findUserPlanBenefits/' + localStorage.getItem('userId'));
    if (planbenefits.data != undefined && this.userType != "JOB_SEEKER") {
      this.util.stopLoader();
      this.calculateCountsWhilePromotionIsOnOrNull(planbenefits, url);
    }
  }
  calculateCountsWhilePromotionIsOnOrNull(planBenefits, url: string) {
    let openModal: boolean = false
    let candidateCount = 0
    let jobCount = 0
    if (planBenefits.data.activeCandidatesCount != undefined) {
      candidateCount = planBenefits.data.activeCandidatesCount
    }
    if (planBenefits.data.activeJobsCount != undefined) {
      jobCount = planBenefits.data.activeJobsCount
    }
    let totalCount: number = candidateCount + jobCount;
    let benefits: Array<any> = planBenefits.data.userPlanAndBenefits.benefitsUsages;
    benefits.forEach(ele => {
      if (ele.benefitKey == 'JOB_CANDIDATE_POSTINGS') {
        this.entityCountConfig.allowedJobsCandidatesCount = GigsumoConstants.FREE_PLAN_JOB_CANDIDATE_COUNT
        if (totalCount > GigsumoConstants.FREE_PLAN_JOB_CANDIDATE_COUNT) {
          openModal = true
          this.entityCountConfig.isUpgrading = true;
        }
      }
      if (ele.benefitKey == 'TEAM_WORKSPACES') {
        this.entityCountConfig.allowedWorkspaceCount = GigsumoConstants.FREE_PLAN_TEAM_COUNT
        if (ele.utilized > GigsumoConstants.FREE_PLAN_TEAM_COUNT) {
          openModal = true
          this.entityCountConfig.isUpgrading = true;
        }
      }
      if (ele.benefitKey == 'PERSONAL_NETWORKS') {
        this.entityCountConfig.allowedNetworksCount = GigsumoConstants.FREE_PLAN_NETWORK_COUNT
        if (ele.utilized > GigsumoConstants.FREE_PLAN_NETWORK_COUNT) {
          openModal = true
          this.entityCountConfig.isUpgrading = true;
        }
      }
    })
    if (openModal) {
      this.openModals(planBenefits);
      this.entityCountConfig.modalTitle = 'Team Plan Upgrade Prerequisites'
    } else {
      this.gtag.event('upgrade-in-process', {
        'app-name': 'Gigsumo',
        'screen-name': 'feed'
      })
      window.location.href = url;
    }
  }
  toggleclick(flag, item) {
    this.Plan = flag
    item.selected = flag;
    if (this.Plan == true) {
      this.TeamPlan = environment.PaymentYearSub + '?prefilled_email=' + localStorage.getItem('userName');
    } else {
      this.TeamPlan = environment.PaymentmonthSub + '?prefilled_email=' + localStorage.getItem('userName');
    }
  }
  TempSubscriptionLists: any;
  selectMenu(param) {
    this.currentEntity = param;
    let induvidual = document.getElementById("induvidual");
    let business = document.getElementById("business");
    if (param === "Individualplan") {
      this.SubsciptionLists = this.individualPlans;
      this.featurelists = this.individualPlansWiseSubscriptionFeatures;
      if (business) business.classList.remove("active");
      if (induvidual) induvidual.classList.add("active");
      // this.buttonTextLabel();
    } else {
      this.SubsciptionLists = this.businessPlans;
      this.featurelists = this.businessPlansWiseSubscriptionFeatures;
      if (induvidual) induvidual.classList!.remove("active");
      if (business) business.classList!.add("active");
      // this.buttonTextLabel();
    }
  }
  // showCurrentPlan: boolean = false
  // buttonTextLabel() {
  //   if(item.subcriptionType =='Free' && this.MemberShipType != item.subcriptionType) {
  //   }
  //   // item.subcriptionType =='Free' && MemberShipType != item.subcriptionType
  //   // item.subcriptionType == MemberShipType == 'Free'
  //   // item.subcriptionType =='Team' && MemberShipType != item.subcriptionType
  //   // item.subcriptionType == MemberShipType == 'Team'
  // }
  openitems = false
  getclickevent() {
    if (this.openitems) {
      this.openitems = false
    } else if (!this.openitems) {
      this.openitems = true
    }
  }
  returnZero() {
    return 0;
  }
}
