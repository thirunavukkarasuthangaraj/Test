import { ActivatedRoute } from '@angular/router';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-promoted-ads',
  templateUrl: './promoted-ads.component.html',
  styleUrls: ['./promoted-ads.component.scss']
})
export class PromotedAdsComponent implements OnInit {
  @Input() widgetDesc: string;
  headerTitle
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
