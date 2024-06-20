import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
import { Subscription } from "rxjs";
import { PageType } from "src/app/services/pageTypes";
import { SearchData } from "src/app/services/searchData";

@Component({
  selector: "app-profile-navigation-header",
  templateUrl: "./profile-navigation-header.component.html",
  styleUrls: ["./profile-navigation-header.component.scss"],
})
export class ProfileNavigationHeaderComponent implements OnInit, OnDestroy {
  @ViewChild("businessmenusticky") menuElement: ElementRef;

  businessmenustick: boolean = true;
  dropFlag: boolean = false
  eventEmitter: Subscription
  data: any = {};
  profile: boolean = false;
  settings: boolean = false;
  appAccess: boolean = false;
  social: boolean = false;
  pageName: any;
  userType: any;
  showmenu: boolean = true;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private cookieService: CookieService,
    private pageType: PageType
  ) {


    var count1: number = 0
    count1 = count1 + 1
    if (count1 == 1) {
      setTimeout(() => {
        // if (this.route.snapshot.url[0].path === "personalProfile" && this.route.queryParams['_value'].destination !== "securitySettings") {
        //   var data: any = {}
        //   data.pages = 'personalProfile'
        //   this.pageType.setPageName(data)

        // } else if (this.route.snapshot.url[0].path === "personalProfile" && this.route.queryParams['_value'].destination === "securitySettings"){
        //   var data: any = {}
        //   data.pages = 'settings'
        //   this.pageType.setPageName(data)
        // }
        this.getThisSorted()
      }, 1500);
    } else if (count1 > 1) {
      this.getThisSorted()
    }


    this.data.userId = localStorage.getItem("userId");
    this.eventEmitter = this.pageType.getPageName().subscribe(res => {
      this.pageName = res.pages;
    })



  }
  queryParamValue;
  page: any;
  userId;
  localUser: boolean = false;
  ngOnInit() {
    this.userType = localStorage.getItem('userType');
    if (this.userType == 'JOB_SEEKER' || this.userType == 'student') {
      this.showmenu = false;
    }
    if (this.route.snapshot.queryParams["userId"]) {
      this.userId = this.route.queryParams.subscribe((res) => {
        this.queryParamValue = res;
        this.getQuerParams();
      });
    } else {
      if (
        localStorage.getItem("userId") != undefined &&
        localStorage.getItem("userId") != null &&
        localStorage.getItem("userId") != ""
      ) {
        this.userId = localStorage.getItem("userId");
        this.validateUser();
      } else if (
        this.cookieService.get("userId") != undefined &&
        this.cookieService.get("userId") != null &&
        this.cookieService.get("userId") != ""
      ) {
        this.userId = this.cookieService.get("userId");
        this.validateUser();
      }
    }
  }

  ngOnDestroy(): void {
    if(this.eventEmitter) {
      this.eventEmitter.unsubscribe();
    }
  }

  getThisSorted() {
    if (this.route.snapshot.url[0].path === "personalProfile" && this.route.queryParams['_value'].destination !== "securitySettings") {
      var data: any = {};
      data.pages = 'personalProfile'
      if (this.route.queryParams['_value'].menu === "billing") {
        data.pages = 'billing'
      } if (this.route.queryParams['_value'].menu === "pricing_summary") {
        data.pages = 'pricing_summary'
      }
      this.pageType.setPageName(data)

    } else if (this.route.snapshot.url[0].path === "personalProfile" && this.route.queryParams['_value'].destination === "securitySettings") {
      var data: any = {}
      data.pages = 'settings'
      this.pageType.setPageName(data)
    } else if (this.route.snapshot.url[0].path === "personalProfile" && this.route.queryParams['_value'].destination === "securitySettings") {
      var data: any = {}
      data.pages = 'settings'
      this.pageType.setPageName(data)
    }

  }


  getQuerParams() {
    this.userId = this.queryParamValue.userId;

    if (this.queryParamValue.goTo) {
      this.dropFlag = true
      setTimeout(() => {
        this.menuClick(this.queryParamValue.goTo)
      }, 2000);
    }
    this.validateUser();
  }

  menuClick(value) {

    var data: any = {};
    data.pages = value
    this.pageType.setPageName(data)
  }

  validateUser() {
    if (this.userId == localStorage.getItem("userId")) {
      this.localUser = true;
    } else {
      this.localUser = false;
    }
  }
}
