import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-sponsored-ads',
  templateUrl: './sponsored-ads.component.html',
  styleUrls: ['./sponsored-ads.component.scss']
})
export class SponsoredAdsComponent implements OnInit {

  @Input() widgetDesc: string;
   headerTitle;
  constructor(private a_route: ActivatedRoute) { }

  ngOnInit() {
      this.headerTitle=this.widgetDesc;
      this.a_route.queryParams.subscribe((res) => {
        if(res.master && res.master!="NETWORK" && res.master!="TEAM" && res.menu!=null &&res.menu!=undefined){
          this.headerTitle=res.menu;
      }
   })
  }

}
