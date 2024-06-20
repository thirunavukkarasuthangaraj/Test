import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';

import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MessageService } from '../../services/message.service';

import { LocationStrategy } from '@angular/common';

import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";

import { SearchData } from 'src/app/services/searchData';


@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit, AfterViewInit {

  @ViewChild('landingside1') menuElement: ElementRef;
  @ViewChild('landingside2') menuElement1: ElementRef;
  @ViewChild('businessmenusticky') menuElements: ElementRef;

  businessmenustick: boolean = false;
  landingsidesticky1: boolean = false;
  landingsidesticky2: boolean = false;
  elementPosition: any;
  studentFlag: boolean = false
  schoolName: any;
  connectionRequest: UntypedFormGroup;
  Streamform: UntypedFormGroup;
  landingPageUserDatails;
  otherData: any;
  place: any;
  img: any = {};
  userDetailsLanding: any;
  userDetailsLanding_array = [];
  userName: any;

  userId: any;
  showhide = false;
  mystreams = false;
  mynetwork = false;
  todaystoppick = false;
  mycommunities = false;
  businessPage = false;
  tag = false;
  businessdetail;

  communityDetails;
  commLength;
  comm;
  commContent: any[];

  showLessCommunity = false;
  showMoreCommunity = false;

  startPageCom: number;
  paginationLimitCom: number;

  startPageBus;
  paginationLimitBus;
  stickyPosition: any;
  showLessBus = false;
  clickEventsubscription: Subscription;
  landingsidesticky3: boolean = false;
  public config: PerfectScrollbarConfigInterface = {};

  constructor(private router: Router, private location: LocationStrategy, private message: MessageService, private searchData: SearchData
  ) {
    this.searchData.getSticky().subscribe(res => {
      if (res.position) {
        this.stickyPosition = res.position
      }
    })

    history.pushState(null, null, window.location.href);
    this.location.onPopState(() => {
      history.pushState(null, null, window.location.href);
    });

  }

  ngAfterViewInit() {
    window.scrollTo(0, 0);
  }

  ngOnInit() {
    this.message.success('Login successfully')
    localStorage.removeItem("isJoined");
    this.userId = localStorage.getItem('userId');
    // this.router.routeReuseStrategy.shouldReuseRoute = () => false;

  }

  freelancer: boolean = false
  otherusertypes: boolean = false
  @HostListener('window:scroll')
  handleScroll() {
    const windowScroll = window.pageYOffset;
    const rightPanel = document.querySelector('.all-page-widget') as HTMLElement;
    const rightPanelHeight = rightPanel.offsetHeight;
    const windowHeight = window.innerHeight;
    // console.log(windowScroll + "-------->windowScroll")
    // console.log(rightPanelHeight + "-------->rightPanelHeight")
    // console.log(windowHeight + "-------->windowHeight")
    if (windowScroll >= rightPanelHeight) {
      if (localStorage.getItem('userType') == 'FREELANCE_RECRUITER') {
        this.freelancer = true
        this.otherusertypes = false
      } else {
        this.freelancer = false
        this.otherusertypes = true
      }
    } else {
      this.freelancer = false
      this.otherusertypes = false
    }
  }
}
