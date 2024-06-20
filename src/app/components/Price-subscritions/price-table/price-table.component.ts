import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-price-table',
  templateUrl: './price-table.component.html',
  styleUrls: ['./price-table.component.scss']
})
export class PriceTableComponent implements OnInit {
  summarylist: any;
  constructor(private api: ApiService, private util: UtilService) { }

  ngOnInit() {
    this.pricesummary();
  }
  pricesummary() {
    const userId = localStorage.getItem("userId");
    this.api
      .query("user/findUserPlanBenefits/" + userId)
      .subscribe((res) => {

        this.summarylist = res.data.userPlanAndBenefits.benefitsUsages;
        console.log(res)
      }, err => {
        this.util.stopLoader();
      });
  }
}
