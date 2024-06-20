import { PricePlanService } from './../../priceplanService';
import { Component, OnInit } from '@angular/core';

import { ApiService } from 'src/app/services/api.service';
import { SubscriptionFeatures } from 'src/app/services/userModel';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-plan-feature',
  templateUrl: './plan-feature.component.html',
  styleUrls: ['./plan-feature.component.scss']
})
export class PlanFeatureComponent implements OnInit {

  featurelists: SubscriptionFeatures;
  constructor(private API: ApiService, private util: UtilService, private pricePlanService: PricePlanService) { }
  ngOnInit() {
    this.plansandfeatureslist();
  }

  async plansandfeatureslist() {
    let planResponse = await this.pricePlanService.getPlan_Features();
    const { data : {planWiseSubscriptionFeatures : planFeauture} } = planResponse;
    this.featurelists = planFeauture;
    console.log("plan" , this.featurelists);

    this.util.stopLoader();
  }



  returnZero() {
    return 0;
  }

}
