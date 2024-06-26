import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { AppSettings } from 'src/app/services/AppSettings';
import { CommonValues } from 'src/app/services/commonValues';
import { SearchData } from 'src/app/services/searchData';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-community-profile-complete',
  templateUrl: './community-profile-complete.component.html',
  styleUrls: ['./community-profile-complete.component.scss']
})
export class CommunityProfileCompleteComponent  implements OnInit, OnDestroy {
  businessComplteData: any = [];
  nonCreationPage: boolean = false
  communityLogo:any;
  eventEmitter1: Subscription
  eventEmitter2: Subscription
  commonDatahide:any={}
  dara: any = {}
  @Output()  commonFunction = new EventEmitter<string>();
  constructor(private util: UtilService, private api: ApiService, private router: Router, private commonvalues: CommonValues, private searchData: SearchData,
    private _route: ActivatedRoute) {
    if(this._route.queryParams['_value']['communityId']) {
      this.nonCreationPage = true
    }else {
      this.nonCreationPage = false;
      this.businessComplteData.logo = "assets/icon/comm.png";
    }

    this.eventEmitter1 = this.commonvalues.getCommuityData().subscribe(res=>{
      if(this.nonCreationPage === false) {
        this.businessComplteData = res;
        if(res.logoExist==true){
          this.getLogo()
        }else{
          this.communityLogo = "assets/icon/comm.png";
        }
        // //// console.log("test data "+JSON.stringify(res));

      }

    })

    this.eventEmitter2 = this.commonvalues.getCommuityBoolean().subscribe(res=>{
        if(res.boolean == true){
          this.profileStatus()
        }
    })
  }

  @Input() inputData: string;
  show = false;
  showadmin = false;

  ngOnInit() {

     this.profileStatus();
     var res = this.router.url.substring(1, 16);
      if(res=="createCommunity"){
       this.showadmin=true;
     }
  }


  route(businessData) {

     if (businessData != undefined && businessData != null && businessData != "") {
      let datum: any = {}
      datum.communityName=businessData.businessName;
      datum.communityId= localStorage.getItem('communityId');
      datum.menu='communityabout';
      this.router.navigate(['community'],{queryParams :datum});

    }
  }


  profileStatus() {


      let datas: any = {};
      datas.userId = localStorage.getItem('userId')
      if(this.nonCreationPage === true){this.util.startLoader()
      this.api.query("community/communityprofile/complete/" + localStorage.getItem('communityId')).subscribe(res => {
        this.util.stopLoader()
        if (res.logo == undefined || res.logo == null || res.logo == "") {
          res.logo = 'assets/icon/comm.png';
          this.communityLogo = 'assets/icon/comm.png';
        } else {
          res.logo = AppSettings.photoUrl + res.logo;
          this.communityLogo = res.logo;
        }

        if(res.communityType==true){
            res.communityType="Private"
        } else if(res.communityType==false){
          res.communityType="Public"
        }

        this.businessComplteData = res;
         if (res.completePercentage == 100) {
          this.show = false;
        } else {
          this.show = true;
        }
         if(!res.superAdmin){
          this.showadmin = false;
         }if(res.superAdmin){
          this.showadmin = true;
         }

      },err => {

        this.util.stopLoader();
        if(err.status==500){

        }
       });}
    }

    getLogo(){
      this.communityLogo = this.businessComplteData.logo
    }
   //}


ngOnDestroy(): void {
    if(this.eventEmitter2) {
      this.eventEmitter2.unsubscribe();
    }
    if(this.eventEmitter1) {
      this.eventEmitter1.unsubscribe();
    }
}


}
