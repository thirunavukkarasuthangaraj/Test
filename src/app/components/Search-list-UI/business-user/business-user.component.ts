import { UserDetailsComponent } from './../../user-details/user-details.component';
import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { UntypedFormBuilder, UntypedFormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AppSettings } from 'src/app/services/AppSettings';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-business-user',
  templateUrl: './business-user.component.html',
  styleUrls: ['./business-user.component.scss']
})
export class BusinessUserComponent implements OnInit {

  BuninessPageData: any;
  businessPages
  users
  communityPages
  term
  photoId

  isAdmin

  businessData = true;
  businessData1 = false;

  title:string = "Business";
  Arraylength

  navaData;
  srarch;
  name;

  colors: Array<any> = ['hgreen', 'hred', 'horange', 'hyellow'];
  selColor: string;

  constructor(
    private API: ApiService,
    private fb: UntypedFormBuilder,
    private router: Router ,
    private route: ActivatedRoute,
    private util: UtilService
   // private BusinessComponent: BusinessComponent,
  ) { }

  randomColor(): void {
    this.selColor = this.colors[Math.floor(Math.random() * this.colors.length)];
  }

  ngOnInit() {

    this.route.queryParams.subscribe((data)=>{
      ////// console.log('datanav',data)
      this.navaData =data.data;
      this.srarch = data.searchData
      // this.name = data.searchData

    });
    // this.dataBusiness();
    if(this.navaData!= 'undefined' && this.srarch != 'undefined' || this.srarch!=' '){

      this.dataBusiness();
    }else{
      // this.BusinessUserData();
      this.dataBusiness();

    }

  }

  BusinessUserData(){
    const data = {'search': this.srarch,
    'searchContent':'ALL',
    // 'searchContent': 'BUSINESS',
    'loginUserId':localStorage.getItem('userId'),
    'page': {
            'offSet': 0,
            'pageCount': 50
            }
    };
 this.util.startLoader()
    this.API.create('home/profiles/searchAll' , data).subscribe(res => {
      this.util.stopLoader()
    this.dynamicdata= res;
    this.businessPages=res.businessPages;
    this.Arraylength =  res.businessPages.length
    ////// console.log('bData=>>>', this.businessPages)
    ////// console.log('companyLocationDetails', res.businessPage.companyLocationDetails.address1)
    this.businessPages.forEach(element => {
      element.businessLogo = AppSettings.photoUrl+ element.businessLogo;
      element.businessColor = this.colors[Math.floor(Math.random() * this.colors.length)];

     });
     this.photoId = this.businessPages.businessLogo
     ////// console.log("sBusiness search data:=>>>>",this.businessPages)
     //////// console.log('Array length is :===>>', this.Arraylength)
    },err => {
      this.util.stopLoader();

     });


   }

   dataBusiness(){
    const data = {'search': this.srarch,
    'searchContent':'ALL',
    // 'searchContent': 'BUSINESS',
    'loginUserId':localStorage.getItem('userId'),
    'page': {
            'offSet': 0,
            'pageCount': 50
            }
    };
 this.util.stopLoader()
    this.API.create('home/profiles/search', data).subscribe(res => {
    this.util.stopLoader()
    this.dynamicdata= res;
    this.businessPages=res.businessPages;
    this.Arraylength =  res.businessPages.length
    //////// console.log('bData=>>>', this.businessPages)
    this.businessPages.forEach(element => {
    element.businessLogo = AppSettings.photoUrl+ element.businessLogo;
    element.businessColor = this.colors[Math.floor(Math.random() * this.colors.length)];
     });
     this.photoId = this.businessPages.businessLogo
     //////// console.log("sBusiness search data:=>>>>",this.businessPages)
     //////// console.log('Array length is :===>>', this.Arraylength)
    },err => {
      this.util.stopLoader();

     });

   }
  dynamicdata(arg0: string, dynamicdata: any) {
    throw new Error("Method not implemented.");
  }

  connetedstatus(data){

  }

  removedata(data){

  }

  businessLink(data){
    ////// console.log('business data :.....',data)
   var data1: any= {}
   data1.businessId = data.businessId
    this.router.navigate(['business'],{queryParams: data1})
  }

  clearInput = new UntypedFormControl();

  clearData(){
    this.businessData = true;
    this.clearInput.reset();
  ////// console.log('cleare Data')
  }

  businessDataSearch(busn){
    //this.businessData1 = true;
    const data = {'search': this.clearInput.value,
    // 'searchContent':'ALL',
    'searchContent': 'ALL',
    'loginUserId':localStorage.getItem('userId'),
    'page': {
            'offSet': 0,
            'pageCount': 50
            }
    };
 this.util.startLoader()
    this.API.create('home/profiles/search' , data).subscribe(res => {
      //////// console.log('businessDataSearch(busn)',res)
      this.util.stopLoader()
    this.dynamicdata= res;
    this.businessPages=res.businessPages;
    this.Arraylength =  res.businessPages.length
    //////// console.log('bData=>>>', this.businessPages)
    this.businessPages.forEach(element => {
      element.businessLogo = AppSettings.photoUrl+ element.businessLogo;
      element.businessColor = this.colors[Math.floor(Math.random() * this.colors.length)];
     });
     this.photoId = this.businessPages.businessLogo
    // ////// console.log("sBusiness search data:=>>>>",this.businessPages)
    // ////// console.log('Array length is :===>>', this.Arraylength)
  },err => {
    this.util.stopLoader();

   });

  }



  addfollower(data,flag) {
    const datas: any = {};
    datas.businessId =data.businessId ;
    datas.userId =localStorage.getItem('userId') ;
    this.util.startLoader()
    this.API.create('business/add/follower',datas).subscribe(res => {
    this.util.stopLoader()
    this.ngOnInit()
  },err => {
    this.util.stopLoader();

   });

 }

removefollower(data,flag) {
  const datas: any = {};
  datas.businessId =data.businessId ;
  datas.userId =localStorage.getItem('userId') ;
  this.util.startLoader()
  this.API.create('business/revoke/follower',datas ).subscribe(res => {
  this.util.stopLoader()
  this.ngOnInit()
},err => {
  this.util.stopLoader();

 });

}




}
