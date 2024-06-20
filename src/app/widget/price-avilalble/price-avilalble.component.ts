import { Component, OnInit } from '@angular/core';
import { PricePlanService } from 'src/app/components/Price-subscritions/priceplanService';
import { AppSettings } from 'src/app/services/AppSettings';
import { GigsumoConstants } from 'src/app/services/GigsumoConstants';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-price-avilalble',
  templateUrl: './price-avilalble.component.html',
  styleUrls: ['./price-avilalble.component.scss']
})
export class PriceAvilalbleComponent implements OnInit {
  summaryList:any;
  getName: any = GigsumoConstants;
  readonly userType : string = localStorage.getItem('userType');
  constructor(public prices:PricePlanService,private api: ApiService ,private util:UtilService) { }

  async ngOnInit() {

   if(this.userType != "JOB_SEEKER"){
      this.util.startLoader();
    let planbenefits: any = await this.api.lamdaFunctionsget('findUserPlanBenefits/' + localStorage.getItem('userId'))
    this.util.stopLoader();
    console.log(planbenefits)
    if(planbenefits.data!=undefined){
      this.summaryList = planbenefits.data.userPlanAndBenefits.benefitsUsages;
    }
    }

  }

  refresh(){
  this.ngOnInit();
  }
  getelement(key) {
    if( this.summaryList && this.summaryList.length!=0)
    return this.summaryList.find(item => item.benefitKey === key);
  }
}
