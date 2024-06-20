import { BusinessBannerComponent } from './../business-banner/business-banner.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, HostListener, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonValues } from 'src/app/services/commonValues';
  
export type Credentials = { password: string, username: string };

@Component({
  selector: 'app-business',
  templateUrl: './business.component.html',
  styleUrls: ['./business.component.scss']
})


export class BusinessComponent implements OnInit, OnDestroy {
  @ViewChild('landingside3') landingside3: ElementRef;
  home: Boolean = true;
  about: Boolean = true;
  clickEventsubscription: Subscription;
  commondata: any = {};
  menu = 'home';
  DeactivateMenu: "pageadmin" | null = null;
  userType = "ALL";
  passdata: any[];
  adminWidgets: any[];
  landingsidesticky1: boolean = false;
  @ViewChild('landingside1') menuElement: ElementRef;
  constructor(
     private commonvalues: CommonValues,
     private router: Router,
     private ActivateRoute: ActivatedRoute,

  ) {
    window.scrollTo(0, 0);
    this.clickEventsubscription = this.commonvalues.getbusinessid().subscribe((res) => {
      this.commondata = res;
      localStorage.setItem('businessId', res.businessId);
      if (this.commondata.menu) {
        this.menu = this.commondata.menu;
      }

    });

    this.ActivateRoute.queryParams.subscribe(res => {
      if (res.menu === "pageadmin") {
        this.menu = 'pageadmin';
        localStorage.setItem('isSuperAdmin', 'true');
        this.DeactivateMenu = 'pageadmin';
      }
      if (res.businessNameEdited == "true") {
        this.businessNameEdited = true
        this.notificationTitle = 'Business Name Changed';
        this.notificationContent = 'Business name has been changed, it will take some time to show up in the profile and other parts of the platform.'
      }
      if (res.businessLocationEdited == "true") {
        this.businessLocationEdited = true
        this.notificationTitle = 'Business Location Changed';
        this.notificationContent = 'Business location has been changed, it will take some time to show up in the profile and other parts of the platform.'
      }
    });
  }

  notificationTitle: any;
  notificationContent: any;
  businessNameEdited: boolean = false;
  businessLocationEdited: boolean = false;

  ngOnInit() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnDestroy(): void {
    if (this.clickEventsubscription) {
      this.clickEventsubscription.unsubscribe();
    }
  }



  // Add below code for Load page from top
  // ngAfterViewChecked() {
  //   window.scrollTo(0, 0);
  // }


  addTodo(commondata) {
    // this.todos = [{label, id: this.todos.length + 1, complete: true }];
    this.passdata = commondata;
    this.adminWidgets = commondata.adminviewnavigation;
    if (!commondata.isSuperAdmin && !commondata.admin) {
      this.userType = "ALL";
    } else {
      this.userType = "ADMIN";
    }

  }


}
