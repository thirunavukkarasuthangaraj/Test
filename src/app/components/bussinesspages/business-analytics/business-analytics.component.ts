import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonValues } from 'src/app/services/commonValues';

@Component({
  selector: 'app-business-analytics',
  templateUrl: './business-analytics.component.html',
  styleUrls: ['./business-analytics.component.scss']
})
export class BusinessAnalyticsComponent implements OnInit, OnDestroy {
  // values: {
  //   businessId: any;
  // };

  @Input() commonemit

  businessId: any;
  analytics: any = {
    totFollowers: 3,
    totEmployees: 87876,
    newFollowers: 787,
    pageViews: 76876,
    totPosts: 23434,
    postViews: 234423,
    visitors: 242,
    uniqueVisitors: 23423,
    comments: 234234,
    likes: 23434,
    shares: 234
  }
  clickEventsubscription: Subscription;
  values: any = {}
  constructor(private commonvalues: CommonValues) {
    this.clickEventsubscription = this.commonvalues.getbusinessid().subscribe((res) => {
      this.values = res;
    })
  }

  ngOnInit() {
    this.values = this.commonemit
  }

  ngOnDestroy(): void {
    if (this.clickEventsubscription) {
      this.clickEventsubscription.unsubscribe();
    }
  }
}
