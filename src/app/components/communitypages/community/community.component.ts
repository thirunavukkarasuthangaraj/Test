import { Component, OnInit } from '@angular/core';
import { CommonValues } from 'src/app/services/commonValues';
import { Subscription } from 'rxjs';
import { CommunityBannerComponent } from '../community-banner/community-banner.component';

@Component({
  selector: 'app-community',
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.scss']
})
export class CommunityComponent implements OnInit {
  home: Boolean = true
  about: Boolean = true
  clickEventsubscription: Subscription;
  communityData: any = {}
  menu = 'communityhome'
  passdata: any[];
  userType="ALL"
  adminWidgets: any;

  constructor(private commonvalues: CommonValues) {
    this.clickEventsubscription = this.commonvalues.getbusinessid().subscribe((res) => {
     // //// console.log(res)
      this.communityData = res;
      // //// console.log("  communityData " + this.communityData.menu)
      if (this.communityData.menu) {
        this.menu = this.communityData.menu;
      }

    })
  }

  ngOnInit() {

    window.scrollTo(0, 0);

  }


  addTodo(commondata) {
    this.passdata = commondata;

     this.adminWidgets = commondata.adminviewnavigation;
     if(!commondata.isSuperAdmin && !commondata.admin){
     this.userType="ALL";
    } else{
     this.userType="ADMIN";

    if(commondata.communityType==false ){
      this.adminWidgets = true;
    }


    }


   }

   businesBannerData : any;
   updateFunction(data:any){
    this.businesBannerData = data;

   }

}
