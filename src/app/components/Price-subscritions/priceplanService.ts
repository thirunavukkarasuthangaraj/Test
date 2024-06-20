import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from "@angular/core";
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { Benefits, SubscriptionFeatures, SubscriptionPlans, UserModel } from 'src/app/services/userModel';
import { UtilService } from 'src/app/services/util.service';
import { environment } from 'src/environments/environment';
import Swal, { SweetAlertOptions, SweetAlertResult } from 'sweetalert2';
import { ApiService } from "../../services/api.service";
import { PlanModel } from './PlanModel';
import { ModelPriceComponent } from './model-price/model-price.component';
import { countProvider } from '../suggestions/suggestions.component';

export type BENEFITS_KEY = "ACTIVE_INTERACTIONS" | "JOB_CANDIDATE_POSTINGS" |
  "TEAM_WORKSPACES" | "PERSONAL_NETWORKS" | "UPGRADE_JOBS" | "UPGRADE_CANDIDATES" |
  "INCLUDED_CONVERSATIONS";



export type BENEFITS_PLANS = {
  benefits: Benefits,
  subscriptionFeatures: SubscriptionFeatures,
  subscriptionPlans: SubscriptionPlans
};

export type PayAsYouGoModel = {
  headerName: string,
  body: string,
}

export type ExpiryModel = {
  headerName: string,
  body: string,
  planDetail?: string,
  planMax?: string,
  slotsUsed?: string,
  availableProvision?: string,
  planExtensionSnippet?: string,
  planExtensionDetail1?: string,
  planExtensionDetail2?: string,
  planExtensionDetail3?: string,
  psNote?: string,
  promotional?: string
}


@Injectable({
  providedIn: "root",
})
export class PricePlanService {
  public lamdaurl: any = environment.LAMDA_URL;
  userPlan: PlanModel
  featurelists: any;
  catagories: any;
  lists: any;
  sampleDate = '';
  ACTIVE_INTERACTION: number;
  PRICERESPONSE;

  readonly userType: string = localStorage.getItem('userType');

  readonly swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: 'btn btn-success',
      cancelButton: 'btn btn-danger'
    },
    buttonsStyling: false
  });

  plan: EventEmitter<any> = new EventEmitter<any>();
  userId: string;
  constructor(private api: ApiService, private util: UtilService, private provider: countProvider, private modalService: BsModalService) { }


  // constructor(private API?: ApiService) {}

  async Plan_Features(): Promise<any> {
    let URL = this.lamdaurl + "findPlans";
    var myHeaders = new Headers();
    let requestOptions: any = {
      headers: myHeaders,
    };
    return await fetch(URL, requestOptions);
  }

  async getPlan_Features(): Promise<any> {
    return await this.Plan_Features().then(result => {
      return result.json();
    }).then(data => {
      return data;
    });

  }



  isPayAsYouGo(val: BENEFITS_KEY): boolean {
    return val === "ACTIVE_INTERACTIONS" || val === "UPGRADE_CANDIDATES" ||
      val === "UPGRADE_JOBS";
  }

  isJobseeker(): BehaviorSubject<any> {
    let userType = localStorage.getItem("userType");
    return new BehaviorSubject(userType);
  }

  async UPDATE_USERDETAILS(key: BENEFITS_KEY, keyvalue: boolean = false): Promise<{ userDetail: any, isExpired: boolean }> {
    try {
      this.util.startLoader();

      let isPlanExpired: boolean = false;

      if (this.isJobseeker().getValue() === "JOB_SEEKER") {
        return { userDetail: null, isExpired: false };
      }

      let userDetails: UserModel | any = await this.api.lamdaFunctionsget('findUserPlanBenefits/' + localStorage.getItem('userId'));

      const { userPlanAndBenefits: { benefitsUsages: userBenefits } } = userDetails.data;
      this.PRICERESPONSE = userDetails.data;

      if(userDetails.data){
        this.provider.setBenefits(userDetails.data);
      }

      this.ACTIVE_INTERACTION = userBenefits.find(ele => ele.benefitKey === key).available;

      if (keyvalue) {
        return { userDetail: userDetails.data, isExpired: userBenefits.find(ele => ele.benefitKey === key).available };
      } else {
        let available = userBenefits.find(ele => ele.benefitKey === key).available;
        return { userDetail: userDetails.data, isExpired: available > 0 ? false : true };
      }
    } catch (error) {
      return { userDetail: null, isExpired: false };
    } finally {
      this.util.stopLoader();
    }
  }



  getRepsonseMessage(text: BENEFITS_KEY): Promise<SweetAlertResult> {

    switch (text) {
      case "ACTIVE_INTERACTIONS":
        return this.getSwal({
          text: "Your Active Interactions have gone below the limit(500) ",
          icon: "info",
          showConfirmButton: true,
          confirmButtonText: "Pay as you go",
        });
        break;
      case "JOB_CANDIDATE_POSTINGS":
        return this.getSwal({
          text: "you have exceeded the Limitation of creating Job / Candidates",
          icon: "info",
          showConfirmButton: true,
          showCancelButton: true,
          confirmButtonText: "Upgrade Plan",
          reverseButtons: true
        })
        break;
      case "PERSONAL_NETWORKS":
        return this.getSwal({
          text: "you have exceeded the Limitation of creating Networks",
          icon: "info",
          showConfirmButton: true,
          showCancelButton: true,
          confirmButtonText: "Upgrade Plan",
          reverseButtons: true
        })
        break;
      case "TEAM_WORKSPACES":
        return this.getSwal({
          text: "you have exceeded the Limitation of creating Teams",
          icon: "info",
          showConfirmButton: true,
          showCancelButton: true,
          confirmButtonText: "Upgrade Plan",
          reverseButtons: true
        })
        break;
      default:
        break;
    }
  }


  private getSwal(options: SweetAlertOptions) {
    return this.swalWithBootstrapButtons.fire(options);
  }

  expiredPopup(val?: BENEFITS_KEY, modelname: "UPGRADE" | "PAY" = "PAY", jobData = null, currenttimezonedate = null, currentDates = null, availablecredits = null, actualcredits = null, utilizedcredits = null, promotional = null): void {
    const initialState: any = {
      backdrop: "static",
      keyboard: false,
      size: "open",
      content: val,
      ModelContent: this.getTextBasedOnKey(val, modelname),
      modalName: modelname,
      upgradeDetails: jobData,
      currentdate: currenttimezonedate,
      featureddate: currentDates,
      availablecredits: availablecredits,
      actualcredits: actualcredits,
      utilizedcredits: utilizedcredits,
      promotional: promotional
    };
    this.modalService.show(ModelPriceComponent, { initialState });
  }




  getTextBasedOnKey(key: BENEFITS_KEY, modelName: "UPGRADE" | "PAY"): ExpiryModel {

    if (modelName === "PAY") {
      switch (key) {
        // case "RESUME_VIEWS":
        //   return {
        //     headerName: 'Resume Views',
        //     body: 'Resume views available for this plan:',
        //     planMax: 'Plan Max',
        //     slotsUsed: 'Used',
        //     availableProvision: 'Available',
        //     planExtensionSnippet: 'To increase your resume view limit, you can exercise one of the below options.',
        //     planExtensionDetail1: '1. Upgrade to "PRO" subscription.',
        //     planExtensionDetail3: '2. Contact support to add additional resume view limits.',
        //     psNote: '*resume view limit will reset on the 1st of each month.'
        //   }
        //   break;
        case "ACTIVE_INTERACTIONS":
          return {
            headerName: 'Interaction Credits ',
            body: 'Interaction credits available for this plan:',
            planMax: 'Plan Max',
            slotsUsed: 'Used',
            promotional: 'Promotional',
            availableProvision: 'Available',
            planExtensionSnippet: 'To increase your interaction limits, you can exercise one of the below options.',
            planExtensionDetail1: '1. Upgrade to "PRO" subscription.',
            planExtensionDetail2: '2. Contact support to add additional interaction credits.',
            psNote: '*interaction credits will reset on the 1st of each month.'
          }
          break;
        case "JOB_CANDIDATE_POSTINGS":
          return {
            headerName: 'Jobs / Candidate Slots ',
            body: 'You are currently on the',
            planDetail: 'Job/ candidate slots available for this plan is,',
            planMax: 'Plan Max',
            slotsUsed: 'Slots Used',
            promotional: 'Promotional',
            availableProvision: 'Available',
            planExtensionSnippet: 'To post additional jobs/ candidates, you can exercise one of the below options.',
            planExtensionDetail1: '1. Upgrade to "PRO" subscription.',
            planExtensionDetail2: '2. Deactivate one of the active jobs/ candidates and post a new one.',
            planExtensionDetail3: '3. Contact support to add additional slots.',
          }
          break;
        case "PERSONAL_NETWORKS":
          return {
            headerName: 'Personal Network Credits ',
            body: 'You are currently on the',
            planDetail: 'Personal network credits available for this plan:',
            planMax: 'Plan Max',
            slotsUsed: 'Used',
            promotional: 'Promotional',
            availableProvision: 'Available',
            psNote: '*if you need additional additional personal network, consider upgrading to higher plan.'
          }
          break;
        case "TEAM_WORKSPACES":
          return {
            headerName: 'Workspace Credits ',
            body: 'You are currently on the',
            planDetail: 'Workspace credits available for this plan:',
            planMax: 'Plan Max',
            slotsUsed: 'Used',
            promotional: 'Promotional',
            availableProvision: 'Available',
            psNote: '*if you need additional workspace credits, consider upgrading to higher plan.'
          }
          break;
        default:
          break;
      }
    }
    else {
      switch (key) {
        case "UPGRADE_JOBS":
          return {
            headerName: 'Upgrade Job',
            body: '*Upgrade job consumes 25 Sumo credits per day.'
          }
          break;
        case "UPGRADE_CANDIDATES":
          return {
            headerName: 'Upgrade Candidate',
            body: 'Upgrade candidate consumes 25 Sumo credits per day.'
          }
          break;
        // case "RESUME_VIEWS":
        //   return {
        //     headerName: 'Add Resume Views',
        //     body: '*Resume views consumes 5 Sumo credits per view.'
        //   }
        //   break;
        case "ACTIVE_INTERACTIONS":
          return {
            headerName: 'Add Active Interactions',
            body: '*Interactions consumes 5 Sumo credits per active interaction.'
          }
          break;
        default:
          break;
      }

    }


  }

}
