import { ActivatedRoute } from '@angular/router';
import { Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-trending-community',
  templateUrl: './trending-community.component.html',
  styleUrls: ['./trending-community.component.scss']
})
export class TrendingCommunityComponent implements OnInit {

  @Input('title') title: string = 'Trending Communities';

  headerTitle: string = 'Trending Communities';
  user: any = [{a: 1}, {a: 2}, {a: 3}, {a: 4}];
  @ViewChild('businessmenusticky') menuElements: ElementRef;
  @Input() widgetDesc: string;


  businessmenustick: boolean = false;
  constructor(private a_route: ActivatedRoute) {
   }

  ngOnInit() {

      this.headerTitle=this.widgetDesc;
      this.a_route.queryParams.subscribe((res) => {
        if(res.master!="NETWORK" && res.master!="TEAM" && res.menu!=null &&res.menu!=undefined){
          this.headerTitle=res.menu;
      }
   })
  }

  @HostListener('window:scroll')
  handleScroll(){
    const windowScroll = window.pageYOffset;
    if(windowScroll >= 1200){
      this.businessmenustick = true;
    } else {
      this.businessmenustick = false;
    }
  }

}
