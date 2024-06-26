import { Component, OnInit, HostListener, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router'
import { Subscription } from 'rxjs';
import { PageType } from 'src/app/services/pageTypes';
import { WorkExperience } from 'src/app/services/userModel';

@Component({
  selector: 'app-personal-profile',
  templateUrl: './personal-profile.component.html',
  styleUrls: ['./personal-profile.component.scss'],
})
export class PersonalProfileComponent implements OnInit, OnDestroy {
  profileBannerCurrentOrganization: WorkExperience;
  profile: boolean = false;
  showWidget: boolean = false;
  eventEmitter: Subscription;
  pageName: any;
  flag = true
  constructor(private route: ActivatedRoute,
    private router: Router,
    private pageType: PageType) {
    this.eventEmitter = this.pageType.getPageName().subscribe(res => {
      this.pageName = res.pages
    })

    if (this.route.queryParams['_value'].userId !== localStorage.getItem('userId')) {
      this.showWidget = false
    } else {
      this.showWidget = true
    }
  }

  ngOnInit() {


    if (this.route.snapshot.url[0].path == 'personalProfile' || this.pageName === 'personalProfile') {
      this.profile = true;
      if (this.route.queryParams['_value'].menu == 'billing') {
        this.profile = false;
      }
    }

    if (this.route.queryParams['_value'].menu == 'billing') {
      this.pageName = 'billing';
      this.profile = false;
      var data: any = {};
      data.pages = "billing"
      this.pageType.setPageName(data)

    }

  }

  ngOnDestroy(): void {
    if(this.eventEmitter) {
      this.eventEmitter.unsubscribe();
    }
  }
  
  elementPosition: any;

  updateProfileBanner(data: WorkExperience) {
    this.profileBannerCurrentOrganization = data;
  }

  @ViewChild('menuScroll') menuElement: ElementRef;
  @ViewChild('suggestionScroll') suggestionElement: ElementRef;
  stopMenuScroll: boolean = false
  stopSuggestionScroll: boolean = false
  @HostListener('window:scroll')
  handleScroll() {
    const YoffSet = window.pageYOffset
    if (YoffSet >= 25) {
      this.stopMenuScroll = true
    } else {
      this.stopMenuScroll = false
    }
  }

}
