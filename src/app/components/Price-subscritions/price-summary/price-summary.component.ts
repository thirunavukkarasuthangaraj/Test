import { PricePlanService } from 'src/app/components/Price-subscritions/priceplanService';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';


@Component({
  selector: 'app-price-summary',
  templateUrl: './price-summary.component.html',
  styleUrls: ['./price-summary.component.scss']
})
export class PriceSummaryComponent implements OnInit {

  constructor(private modalService: BsModalService, private pricePlanService: PricePlanService, private route: Router, private api: ApiService, private util: UtilService) { }

  modalRef: BsModalRef;
  yearmonth: boolean = false;
  loaddata:boolean=true;
  summarylist: any;
  tableheader: string;
  screendata: boolean = false;
  userType=localStorage.getItem('userType');
  monthlyusage: any[] = [];
  ngOnInit() {
    this.pricesummary();
    this.consumptionmatrix();
  }
  backdropConfig = {
    backdrop: true,
    ignoreBackdropClick: true,
    keyboard: false,

  };

  open(content) {
    this.modalRef = this.modalService.show(content, this.backdropConfig);
  }
  closemodel() {
    this.modalRef.hide();
  }
  upgradePlan() {
    this.modalRef.hide();
    this.route.navigate(["plan-quota"]);


  }
  reload() {
    this.ngOnInit();
  }

  plan(val) {
    this.yearmonth = val

  }
  plandetails: any
  async pricesummary() {

    //this.util.startLoader();
    let planbenefits: any = await this.api.lamdaFunctionsget('findUserPlanBenefits/' + localStorage.getItem('userId'));
    this.summarylist = planbenefits.data.userPlanAndBenefits.benefitsUsages;
    this.screendata = true;
    this.loaddata=false
    this.util.stopLoader();
  }
  dateranges:any;
  async consumptionmatrix() {
    this.util.startLoader();
    try {
        let planmatrix: any = await this.api.lamdaFunctionsget('findPayAsYouGoForUser/' + localStorage.getItem('userId'));
        this.monthlyusage = planmatrix.data.payAsYouGoUsage;
        this.dateranges = planmatrix.data.planUsage;
        this.screendata = true;
    } catch (error) {
    } finally {
        this.util.stopLoader();
    }
}

getFilteredMonthlyUsage(): any[] {
  if (!this.monthlyusage) {
      return [];
  }
  if (this.userType === 'RECRUITER') {
      return this.monthlyusage.filter(
          usage => usage.title === 'Upgrade Jobs'   || usage.title === 'Active Interactions' || usage.title === 'Pay as you go Charges'
      );
  } else if (this.userType === 'BENCH_RECRUITER' || this.userType === 'JOB_SEEKER') {
    return this.monthlyusage.filter(
        usage => usage.title === 'Upgrade Candidatess'   || usage.title === 'Active Interactions' || usage.title === 'Pay as you go Charges'
    );

}  else {
      // For other user types, show all items
      return this.monthlyusage;
  }


}




}
