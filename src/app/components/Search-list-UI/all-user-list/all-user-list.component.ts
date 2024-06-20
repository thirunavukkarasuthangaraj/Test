import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AppSettings } from 'src/app/services/AppSettings';
import { UtilService } from 'src/app/services/util.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-all-user-list',
  templateUrl: './all-user-list.component.html',
  styleUrls: ['./all-user-list.component.scss']
})
export class AllUserListComponent implements OnInit {

  BuninessPageData: any;
  businessPages;
  users;
  communityPages;
  term;
  Alldata;
  menuData;
  data;
  photoId;

  CommunityData;

  showSearchData = true;
  showSearchData1 = false;

  filter:UntypedFormGroup;

  navData;
  name;

  colors: Array<any> = ['hgreen', 'hred', 'horange', 'hyellow'];
  selColor: string;
  srarch: any;
  lenght: any;
  photoId_U: any;
  photoId_B: any;

  constructor(
    private API: ApiService,
    private fb: UntypedFormBuilder,
    private router: Router ,
    private route: ActivatedRoute,
    private util: UtilService
  ) {
  }

  randomColor(val: any): any {
    return '2px solid #' + Math.floor(Math.random() * val).toString(16);
  }

  ngOnInit() {
    this.route.queryParams.subscribe((res) => {
      //  ////// console.log('datanav',data)
      //  this.navaData =data.data;
      //  this.srarch = data.searchData;
      //  // this.name = data.searchData
      this.navData=res.data;
      this.srarch = res.searchData;
      // this.name = res.searchData;
      if(this.navData!='undefined' && this.srarch != 'undefined'){
        // this.allCombinationData();
        this.allCombinationData();

       }else {
        this.allCombinationData();

        // this.AllUserData();
       }
     });
    // this.allCombinationData();
  }

  allCombinationData(){
    const data = {
    'search': this.srarch,
    'searchContent':'ALL',
    'loginUserId':localStorage.getItem('userId'),
    'page':
        {
        'offSet': 0,
        'pageCount': 50,
        }
    };
   this.util.startLoader()
    this.API.create('home/profiles/search' , data).subscribe(res => {
      this.util.stopLoader()

      // if(res){
        this.dynamicdata= res;
        //community
        this.CommunityData = res.communityPages;
        this.CommunityData.forEach(element => {
          element.CommunityData = AppSettings.photoUrl + element.logo;
          element.communityColor =this.colors[Math.floor(Math.random() * this.colors.length)];
         });
         this.photoId = this.CommunityData.photo

        // //users
         this.users = res.users;
        //  this.lenght = res.users.length;
         this.users.forEach(element => {
          element.userImage = AppSettings.photoUrl + element.photo;
          element.userColor =this.colors[Math.floor(Math.random() * this.colors.length)];
         });
         this.photoId_U = this.users.photo

        //business
         this.businessPages=res.businessPages;
        //  this.Arraylength =  res.businessPages.length
          //////// console.log('bData=>>>', this.businessPages)
          this.businessPages.forEach(element => {
          element.businessLogo = AppSettings.photoUrl+ element.businessLogo;
          element.businessColor = this.colors[Math.floor(Math.random() * this.colors.length)];
          });
          this.photoId_B = this.businessPages.businessLogo


        // this.businessPages=res.businessPages;
        // this.users = res.users;
        // this.CommunityData = res.communityPages;
        // this.businessPages.forEach(element => {
        //   element.businessLogo = AppSettings.photoUrl+ element.businessLogo;
        //   element.businessColor =this.colors[Math.floor(Math.random() * this.colors.length)];
        //  });
        //  this.users.forEach(element => {
        //   element.userImage = AppSettings.photoUrl + element.photo;
        //   element.userColor =this.colors[Math.floor(Math.random() * this.colors.length)];
        //  });
        // this.Alldata = this.users;
        // this.photoId =this.users.userLogo;
        // this.CommunityData.forEach(element => {
        //   element.commLog = AppSettings.photoUrl + element.banner;
        //   element.commColor =this.colors[Math.floor(Math.random() * this.colors.length)];
        //  });
      // }

    },err => {
      this.util.stopLoader();

     });
   }

   AllUserData(){
    const data = {'search': this.srarch,
    'searchContent':'ALL',
    'loginUserId':localStorage.getItem('userId'),
    'page': {
            'offSet': 0,
            'pageCount': 50,
            }
    };
    this.util.startLoader()
    this.API.create('home/profiles/searchAll' , data).subscribe(res => {
    this.util.stopLoader()
    this.dynamicdata= res;
    this.businessPages=res.businessPages;
    this.users = res.users;
    this.CommunityData = res.communityPages;
    this.Alldata = this.users;
    this.photoId =this.users.userLogo;

    this.CommunityData.forEach(element => {
      element.commLog = AppSettings.photoUrl + element.banner;
      element.commColor =this.colors[Math.floor(Math.random() * this.colors.length)];
     });

     this.users.forEach(element => {
      element.userLogo = AppSettings.photoUrl + element.businessLogo;
      element.userColor =this.colors[Math.floor(Math.random() * this.colors.length)];
     });

     this.businessPages.forEach(element => {
      element.businessLogo = AppSettings.photoUrl+ element.businessLogo;
      element.businessColor =this.colors[Math.floor(Math.random() * this.colors.length)];
     });
    },err => {
      this.util.stopLoader();
     });
   }

   businessLink(data){
    // //// console.log('business data :.....',data);
    var data1: any= {};
    data1.businessId = data.businessId;
     this.router.navigate(['business'],{queryParams: data1});
   }

   communityLink(dataLink){
   // //// console.log('communityLink(dataLink) :.....',dataLink);
    var data : any = {};
    data.communityId = dataLink.communityId;
    this.router.navigate(['community'],{queryParams : data});
  }

   searchInput(){
     this.filter = this.fb.group({
      filterDataSearch :['']
     });
   }

   clearInput = new UntypedFormControl();

   clearData(){
     this.clearInput.reset();
  // //// console.log('cleare Data');
   }

   searchData(search){
    // // //// console.log('data....search',search.target.value);
    //  this.showSearchData = false;
    //  this.showSearchData1 = true;

     const data = {'search': this.clearInput.value,

     'loginUserId':localStorage.getItem('userId'),
     'searchContent':'ALL',
     //'searchContent':  this.data,
     'page': {
             'offSet': 0,
             'pageCount': 50,
             }
     };
 this.util.startLoader()
     this.API.create('home/profiles/search' , data).subscribe(res => {
       this.util.stopLoader()
      this.dynamicdata= res;
      this.businessPages=res.businessPages;
      this.users = res.users;
      this.CommunityData = res.communityPages;
     // this.Arraylength =  res.businessPages.length
     // //// console.log('bData=>>>', this.businessPages);
      this.businessPages.forEach(element => {
        element.businessLogo = AppSettings.photoUrl+ element.businessLogo;
       });
      // //// console.log("sBusiness search data:=>>>>",this.businessPages);
       //////// console.log('Array length is :===>>', this.Arraylength)


       this.users.forEach(element => {
        element.userImage = AppSettings.photoUrl + element.photo;
       });

      this.Alldata = this.users;
      this.photoId =this.users.userLogo;
    },err => {
      this.util.stopLoader();

     });

   }

   connect(data){
   // //// console.log('connect data:' ,data)
    data.requestedBy = localStorage.getItem('userId')
    this.util.startLoader()
    this.API.create('user/connect', data).subscribe(res=>{
     // //// console.log('connect data :' , res)
      this.util.stopLoader()
      if(res.code=="00000"){
        //message to show connect request is sent successfully
        // this.requestSent = true
        // this.notConnected = false
        // this.connected = false
        this.ngOnInit()
        // if()
        setTimeout(function(){ Swal.fire("Request is sent Successfully!"); }, 200);

      }else if(res.code=="88888"){
        // this.requestSent = false
        // this.notConnected = false
        // this.connected = false
      }
    },err => {
      this.util.stopLoader();

     });

  }

  cancelConnectionRequest(data){
    this.util.startLoader()
    this.API.create('user/connect/cancel',data).subscribe(res =>{
      this.util.stopLoader()
     // //// console.log('Cancel Connection : ', res);
      if(res.code === '00000'){
        this.ngOnInit();
       // //// console.log('Connect request cancelled successfully');
        Swal.fire('Connect request cancelled successfully');
        // this.user.connectionStatus="NOT_CONNECTED";
        // this.initCard();
        // this.requestSent = false
        // this.notConnected = true
        // this.connected = false

      }else if(res.code === '88888'){
       // //// console.log('Unable to Cancel connection');
      }
    },err => {
      this.util.stopLoader();

     });

  }
  dynamicdata(arg0: string, dynamicdata: any) {
    throw new Error("Method not implemented.");
  }

}
