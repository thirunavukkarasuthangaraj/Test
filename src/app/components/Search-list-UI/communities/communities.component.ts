import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { UntypedFormBuilder, UntypedFormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AppSettings } from 'src/app/services/AppSettings';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-communities',
  templateUrl: './communities.component.html',
  styleUrls: ['./communities.component.scss']
})
export class CommunitiesComponent implements OnInit {

  items;
  term;
  commData;
  data;
  srarch;

  commShow=true;
  commShow1=false;
  communityDetails: any;
  photoId: any;
  selColor: string;


  constructor(
    private API: ApiService,
    private fb: UntypedFormBuilder,
    private router: Router ,
    private route: ActivatedRoute,
    private http: HttpClient,
    private util: UtilService
  ) { }

  colors: Array<any> = ['hgreen', 'hred', 'horange', 'hyellow'];

  randomColor(): void {
    this.selColor = this.colors[Math.floor(Math.random() * this.colors.length)];
  }

  ngOnInit() {
    this.route.queryParams.subscribe((res) => {
      ////// console.log('res data', res.data)
      this.data=res.data
      this.srarch = res.searchData;
      this.clearInput.patchValue(this.srarch);
      // if(this.data != 'undefined' && this.srarch != 'undefined'){

      // this.comunitydetailsapicall();
      // }else{

      // }
     });
     this.comunitydetailsapicall();

  }
  comunitydetailsapicall() {
    // //// console.log('this was called')
    let datas: any = {};
    datas.userId = localStorage.getItem('userId');
    this.util.startLoader();
    this.API.queryPassval("community/check/user", datas).subscribe(res => {
      this.util.stopLoader();
      this.communityDetails = res.data.communityModelList;
      // this.communityDetails = this.communityDetails

      this.communityDetails.forEach(element => {
        element.logo = AppSettings.photoUrl+ element.logo;
        element.businessColor = this.colors[Math.floor(Math.random() * this.colors.length)];

       });
       this.photoId = this.communityDetails.logo

    },err => {
      this.util.stopLoader();
    });
  }



//   communityUserData(){

//     const data = {'search': this.srarch,
//     // 'searchContent':'ALL',
//     'searchContent':  'COMMUNITY',
//     'loginUserId':localStorage.getItem('userId'),
//     'page': {
//             'offSet': 0,
//             'pageCount': 5,
//             }
//     };
//  this.util.startLoader()
//     this.API.create('home/profiles/searchAll' , data).subscribe(resdata =>{
//       this.util.stopLoader()
//       this.communityDetails = resdata.communityPages;
//       ////// console.log('comm data :.....',this.commData);

//       this.communityDetails.forEach(element => {
//         element.commLog = AppSettings.photoUrl + element.banner;
//        });

//        ////// console.log(this.commData)
//       },err => {
//         this.util.stopLoader();

//        });

//   }

//   dataCommunity(){
//     const data = {'search': this.srarch,
//     // 'searchContent':'ALL',
//     'searchContent':  'COMMUNITY',
//     'loginUserId':localStorage.getItem('userId'),
//     'page': {
//             'offSet': 0,
//             'pageCount': 5,
//             }
//     };
// this.util.startLoader()
//     this.API.create('home/profiles/searchAll' , data).subscribe(resdata =>{
//       this.util.stopLoader()
//       this.communityDetails = resdata.communityPages;
//       ////// console.log('comm data :.....',this.commData);

//       this.communityDetails.forEach(element => {
//         element.commLog = AppSettings.photoUrl + element.banner;
//        });

//        ////// console.log(this.commData)
//       },err => {
//         this.util.stopLoader();

//        });

//   }
  communityLink(dataLink){
    ////// console.log('communityLink(dataLink) :.....',dataLink)
    var data : any = {};
    data.communityId = dataLink.communityId;
    this.router.navigate(['community'],{queryParams : data})
  }

  clearInput = new UntypedFormControl();

  clearData(){
    this.clearInput.reset();
  ////// console.log('cleare Data')
  }


  community(comm){
    let datas: any = {};
    datas.userId = localStorage.getItem('userId');
    this.util.startLoader();
    this.API.queryPassval("community/check/user", datas).subscribe(res => {
      this.util.stopLoader();
      this.communityDetails = res.data.communityModelList;
      this.communityDetails = this.communityDetails
    },err => {
      this.util.stopLoader();
    });
//     this.commShow = false;
//     this.commShow1 = true;
//     const data = {'search': comm.target.value,
//     // 'searchContent':'ALL',
//     'searchContent':  'COMMUNITY',
//     'loginUserId':localStorage.getItem('userId'),
//     'page': {
//             'offSet': 0,
//             'pageCount': 5,
//             }
//     };
// this.util.startLoader()
//     this.API.create('home/profiles/searchAll' , data).subscribe(resdata =>{
//       this.util.stopLoader()
//       this.communityDetails = resdata.communityPages;
//       ////// console.log('comm data :.....',this.commData);

//       this.communityDetails.forEach(element => {
//         element.commLog = AppSettings.photoUrl + element.banner;
//        });

//        ////// console.log(this.commData)
//       },err => {
//         this.util.stopLoader();

//        });


  }
}
