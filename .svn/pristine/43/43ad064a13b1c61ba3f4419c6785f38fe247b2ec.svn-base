import { AppSettings } from './../../services/AppSettings';
import { Component, Input, Output,EventEmitter,OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-follower',
  templateUrl: './follower.component.html',
  styleUrls: ['./follower.component.scss']
})
export class FollowerComponent   implements OnInit {

  @Input('title') title: any = 'Followers';
  @Input() inputData: string;
  headerTitle
  commonDatahide:any={}
  @Output()  commonFunction = new EventEmitter<string>();
  admin:any=[]
  @Input() maxMin: any = {};
  @Input() page: string;
   viewType: string = "MIN";
   imgUrl: any = AppSettings.photoUrl;

   @Input() widgetDesc: string;
   constructor(private auth: ApiService,private a_route: ActivatedRoute,private router: Router, private util :UtilService) {
   }

  route(item) {
    this.router.navigate(['personalProfile'], { queryParams: item });
  }

  modelopen(data) {
    let dataPass: any = {};
    dataPass.data = data;
    dataPass.master = this.page;
    dataPass.menu = this.widgetDesc;
    dataPass.masterMenu =  this.inputData;
    dataPass.widgetName = "FollowerComponent";
    this.router.navigate(['suggestions'], { queryParams: dataPass })
  }


  ngOnInit() {

    this.headerTitle=this.widgetDesc;

    this.a_route.queryParams.subscribe((res) => {
      if(res.master!="NETWORK" && res.master!="TEAM" && res.menu!=null &&res.menu!=undefined){
        this.headerTitle=res.menu;
      }
   })

    if (this.maxMin.viewType != undefined) {
      this.viewType = "MAX";
      this.inputData = this.maxMin.master;
     }

    if (this.inputData && this.inputData != null && this.inputData != "") {
      this.util.startLoader()

      if (this.inputData == "BUSINESS") {

        let datas: any = {};
        datas.businessId = localStorage.getItem('businessId')
        this.util.startLoader()
        this.auth.create('business/followers', datas).subscribe(res => {
          this.util.stopLoader()
           if ( res && res.data.businessFollowers.length!=0 && res != undefined && res != null) {
            if (res && res !=null  && res.length != 0){
              res.data.businessFollowers.forEach(element => {
                element.userName = element.firstName + " " + element.lastName;
                if (element.userId === localStorage.getItem('userId')) {
                  element.followedOn = new Date()
                }
                if (element.photo != null) {
                  element.image =""
                  element.image = AppSettings.photoUrl + element.photo;
                 } else {
                  element.image=""
                  element.image = "assets/images/userAvatar.png";
                }

              })
              this.admin=res.data.businessFollowers;
             }else{
              this.hide(true)
             }
          }  else{
              this.hide(true)
           }


          },err => {
            this.util.stopLoader();
          });




      } else if (this.inputData == "COMMUNITY") {


      } else if (this.inputData == "HOME") {

      }
    }


  }

  hide(flag){
    this.commonDatahide.widgetName="FollowerComponent";
    this.commonDatahide.hide = flag;
    this.commonFunction.emit(this.commonDatahide);
  }

}


