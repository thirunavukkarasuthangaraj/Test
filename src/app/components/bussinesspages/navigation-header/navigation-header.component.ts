import { ActivatedRoute } from '@angular/router';
import { BusinessEmployeeComponent } from '../business-employee/business-employee.component';
import { BusinessAdminComponent } from '../business-admin/business-admin.component';
import { SearchData } from '../../../services/searchData';
import { BussinessPostComponent } from '../../bussiness-post/bussiness-post.component';
import { BusinessFollowerComponent } from '../business-follower/business-follower.component';
import { BusinessProfileComponent } from '../business-profile/business-profile.component';
import { BusinessFollowersRequestSentComponent } from '../business-followers-request-sent/business-followers-request-sent.component';
import { BusinessFollowersRequestComponent } from '../business-followers-request/business-followers-request.component';
import { BusinessEmployeeRequestsComponent } from '../business-employee-requests/business-employee-requests.component';
import { CommonValues } from '../../../services/commonValues';
import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { Subscription } from "rxjs";
import { ApiService } from "src/app/services/api.service";
import { AccordionConfig } from "ngx-bootstrap/accordion";
import { UtilService } from "src/app/services/util.service";

export function getAccordionConfig(): AccordionConfig {
  return Object.assign(new AccordionConfig(), { closeOthers: true });
}

@Component({
  selector: "app-navigation-header",
  templateUrl: "./navigation-header.component.html",
  styleUrls: ["./navigation-header.component.scss"],
  providers: [{ provide: AccordionConfig, useFactory: getAccordionConfig }],
  inputs : ["Menu"]
})
export class NavigationHeaderComponent implements OnInit , OnDestroy{
  @ViewChild("businessmenusticky") menuElement: ElementRef;
  @Input() DeactivateMenu : string;
  Menu : "pageadmin" | null = null;
  businessmenustick: boolean = false;

  clickEventsubscription: Subscription; //
  employeeCount: Subscription;
  followerRequesCount: Subscription;

  commondata: any = {};
  active;
  // commondata

  allroles: any = [];
  selectedRole = "13";
  selectedDetails: any = [];
  screenData: any = [];
  serviceData: any = [];
  roleData: any = [];
  rolescreenMap = {};
  groupedMenu = [];
  panelOpenState = false;
  isSuperAdmin: any;
  employeeRequestFlag: boolean = true;
  followerRequestFlag: boolean = true;
  managePageFlag: boolean = true
  values: any = {};
  navigationMenu = [];
  navigationadminMenu = [];
  selectedItem;
  submenuData;
  reqPendinCnt;
  visitorsCnt;
  businessId :string;
  constructor(
    private commonvalues: CommonValues,
    private businesseEmployeeRequests: BusinessEmployeeRequestsComponent,
    private businesseFollowerRequests: BusinessFollowersRequestComponent,
    private businesseFollowerRequestsSent: BusinessFollowersRequestSentComponent,
    private about: BusinessProfileComponent,
    private follower: BusinessFollowerComponent,
    private people: BussinessPostComponent,
    private searchData: SearchData,
    private api: ApiService,
    private adminadd: BusinessAdminComponent,
    private employee: BusinessEmployeeComponent,
    private util: UtilService , private route : ActivatedRoute
  ) {

    this.clickEventsubscription = this.commonvalues
      .getbusinessid()
      .subscribe((res) => {

       this.commondata = res;
       if(res.isFollow){
          this.isAFollower = 'true'
        }
        else if(!res.isFollow){
          this.isAFollower = 'false';
        }
        // if(res.menu == "requestsReceived"){
        //   this.employeeRequestFlag = false
        // }
      });

      this.route.queryParams.subscribe(ele=>{
        this.businessId =  ele.businessId;


        if(ele.menu === "pageadmin"){
         this.commondata.menu = "pageadmin";
         this.commondata.adminviewnavigation = true;
         this.managePageFlag = false;
         this.menuclick('pageadmin')
       }
   });

    this.followerRequesCount = this.searchData
      .getVisitorsCount()
      .subscribe((res) => {
        this.visitorsCnt = res;
      });
  }
  ngOnDestroy(): void {
    this.Menu = null;
   }

  isAFollower: any;
  ngOnInit() {
    this.isAFollower = localStorage.getItem('isAFollower')
    this.isSuperAdmin = localStorage.getItem("isSuperAdmin");
    this.apicall();
  }

  @HostListener("window:scroll")
  handleScroll() {
    const windowScroll = window.pageYOffset;

    if (windowScroll >= 327.5) {
      this.businessmenustick = true;
    } else {
      this.businessmenustick = false;
    }
  }

  // displaymenu(){

  //      var screen =  localStorage.getItem('screen')

  //      var adminviewflag= localStorage.getItem('adminviewflag')
  //      this.navidationData.forEach(element => {

  //       if( element.page==screen){
  //         if(adminviewflag!=undefined||adminviewflag!=null||adminviewflag!=''){
  //          if(adminviewflag==element.admin){
  //             this.navigationMenu.push(element)

  //            }
  //         }else{
  //           this.navigationMenu.push(element)

  //         }

  //       }

  //     });
  //     this.commondata.navigationMenu=this.navigationMenu

  //     this.commonvalues.businessid(this.commondata);
  //     //  this.commondata.selectedItem=this.navigationMenu[0]

  // }

  // submenu(data){
  //   this.submenuData=data
  // }

  ngAfterViewInit(): void {
    setInterval(() => {
      this.isSuperAdmin = localStorage.getItem("isSuperAdmin");
      this.reqPendinCnt = localStorage.getItem("reqPendinCnt");
    }, 800);
  }

  apicall() {
    this.util.startLoader();
     this.api.query('business/employee/request/pending/'+this.businessId).subscribe(res=>{
      this.util.stopLoader();
      // this.searchData.setRequestedEmployeeCount(res.length)
      if(res.data.pendingtList!=undefined && res.data.pendingtList!=null)
      this.reqPendinCnt = localStorage.setItem("reqPendinCnt",res.data.pendingtList.length);

    },err => {
      this.util.stopLoader();
    })
  }

  menuclick(value) {

    this.commondata.menu = value;

    if (value === "follower") {
      this.follower.followersapicall();
    }
    else if (value === "followerRequestsReceived") {
      this.businesseFollowerRequests.requestlist();
    }
    else if (value === "followerRequestsSent") {
      this.businesseFollowerRequestsSent.getVisitorsList();
    }
    else if (value === "employee") {
      this.employee.employees();
      this.apicall();
    }
    else if (value === "requestsReceived") {
       this.businesseEmployeeRequests.ngOnInit();
    }
    else if (value === "pageadmin") {
      this.adminadd.getAdmins(this.commondata.businessId || this.businessId);
    }
    else if (value === "about") {
      this.about.getbussinessId(
        this.commondata.businessId,
        this.commondata.admin
      );
    }
    else if (value === "deactivate") {
      this.about.getbussinessId(
        this.commondata.businessId,
        this.commondata.admin
      );
    }
    this.commonvalues.businessid(this.commondata);



  }


}
