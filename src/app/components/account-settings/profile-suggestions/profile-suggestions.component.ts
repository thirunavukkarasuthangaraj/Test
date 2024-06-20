import { Component, OnDestroy, OnInit } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';
import { UserCardConfig } from 'src/app/types/UserCardConfig';
import { PageType } from 'src/app/services/pageTypes';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile-suggestions',
  templateUrl: './profile-suggestions.component.html',
  styleUrls: ['./profile-suggestions.component.scss']
})
export class ProfileSuggestionsComponent implements OnInit, OnDestroy {
  mycommunities = false;
  communityDetails;
  showLessCommunity = false;
  showMoreCommunity = false;
  businessPage = false;
  businessdetail;
  startPageCom : number;
  paginationLimitCom:number;
  comm: any;
  startPageBus;
  paginationLimitBus;
  eventEmitter: Subscription
  userCardConfig: UserCardConfig[] = []
  showLessBus = false;
  pages:any;
  constructor(private util : UtilService,
              private api: ApiService,
              private router: Router,
              private pageType: PageType) {
      this.startPageCom = 0;
      this.paginationLimitCom = 5;
      this.startPageBus = 0;
      this.paginationLimitBus = 5;

      this.eventEmitter = this.pageType.getPageName().subscribe(res=>{
       if(res.pages == 'personalProfile'){
        this.pages='PROFILE_PAGE';
        }else if(res.pages == 'workExperience'){
        this.pages='PROFILE_PAGE'
        }else if(res.pages == 'education'){
        this.pages='PROFILE_PAGE'
        }else if(res.pages == 'certification'){
        this.pages='PROFILE_PAGE'
        }else if(res.pages == 'socialInfluence'){
        this.pages='PROFILE_PAGE'
        }else if(res.pages == 'settings'){
        this.pages='SECURITY_SETTINGS';
        }else if(res.pages == 'appAccess'){
        this.pages='PROFILE_ACCESS_APPLICATION';
        }else if(res.pages == 'social'){
        this.pages='PROFILE_SOCIAL_ACCESS';
        }else {
          this.pages='PROFILE_PAGE';
          }

      })


    }

    ngOnInit() {
      this.companydetailsapicall()
      this.comunitydetailsapicall()
      var res = this.router.url.substring(1, 14);
      if(res=='personalProfi'){
        this.pages='PROFILE_PAGE';
      }
  }

  ngOnDestroy(): void {
    if(this.eventEmitter) {
      this.eventEmitter.unsubscribe();
    }
  }

  checkadmincommunity(businessid,data){
    let datas:any ={};
    datas.communityId=businessid
    datas.userId=localStorage.getItem('userId')
    this.util.startLoader();
    this.api.create("community/home",datas).subscribe(res=>{
      this.util.stopLoader();
      localStorage.setItem('businessId', businessid)
      localStorage.setItem('communityId', businessid)
      localStorage.setItem('isAdmin', res.data.isAdmin)
      localStorage.setItem('isSuperAdmin', res.data.isSuperAdmin)
      localStorage.setItem('screen','community')
      localStorage.setItem('adminviewflag', 'false')
      this.router.navigate(['community'],{queryParams :data})
    },err => {
      this.util.stopLoader();

     });
  }

  companydetailsapicall() {
    let datas: any = {};
    datas.userId = localStorage.getItem('userId')
    this.util.startLoader()
    this.api.create("business/check/user", datas).subscribe(res => {
      this.util.stopLoader()
       if (res && res != null && res.data.businessModelList.length > 0) {
        let d = [];
        res.data.businessModelList.forEach(e => {
          if (e.businessStatus && e.businessStatus != null && e.businessStatus === 'VERIFIED') {
            d.push(e);
          }
        });
        this.businessdetail = d;
      } else {
        this.businessdetail = [];
      }
    },err => {
      this.util.stopLoader();

     });
  }

  setCommunityId(data){
    this.checkadmincommunity(data.communityId,data)
  }
  showMoreComm() {
  //  this.paginationLimit = Number(this.paginationLimit) + 3;
   this.paginationLimitCom = this.communityDetails.length;
   this.showLessCommunity = true;
}

showLessComm(){
  this.paginationLimitCom = Number(this.paginationLimitCom) + 5 - this.communityDetails.length;
  this.showLessCommunity = false;
}

getbussinessid(data){

  this.checkadmin(data.businessId,data)

}

checkadmin(businessid,data){

  let datas:any ={};
  datas.businessId=businessid
  datas.userId=localStorage.getItem('userId')
  this.util.startLoader();
  this.api.create("business/check/admin",datas).subscribe(res=>{
    this.util.stopLoader();
   ////// console.log("businesscheckadmin "+res);

   localStorage.setItem('businessId', businessid)
   localStorage.setItem('isAdmin', res.isAdmin)
   localStorage.setItem('isSuperAdmin', res.isSuperAdmin)
   localStorage.setItem('screen','business')
   localStorage.setItem('adminviewflag', 'false')


   //this.sideheader.displaymenu('business')
   this.router.navigate(['business'],{queryParams :data})


  },err => {
    this.util.stopLoader();

   });
}

showMoreBusiness(){
  this.paginationLimitBus = this.businessdetail.length;
  this.showLessBus = true
}
showLessBusiness(){
  this.paginationLimitBus = Number(this.paginationLimitBus) + 5 - this.businessdetail.length;
  this.showLessBus = false;
}

  comunitydetailsapicall(){
    let datas:any ={};
    datas.userId=localStorage.getItem('userId')
      this.util.startLoader()
     this.api.queryPassval("community/check/user", datas).subscribe(res=>{
      this.util.stopLoader()
    this.communityDetails = res.data.communityModelList;
    this.comm = res.data.communityModelList.communityName;
    ////// console.log('this.communityDetails',this.communityDetails)
    ////// console.log('Community length is :',this.communityDetails.length)
  },err => {
    this.util.stopLoader();
  });
  }

}
